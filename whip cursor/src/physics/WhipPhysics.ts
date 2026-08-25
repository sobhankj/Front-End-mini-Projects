import type { AppConfig } from '../config/types';
import { PhysicsNode } from './Node';
import { Vector2, clamp, sanitizeNumber } from './Vector2';
import {
  buildMassDistribution,
  massPowerFromTipSensitivity,
  radiusAt,
  type MassCurveType,
} from './MassCurve';
import {
  measureConstraintError,
  solveChainConstraints,
  type ConstraintSolveResult,
} from './Constraints';
import { FixedTimestep } from './FixedTimestep';

/** Max node speed after reconstruction (px/s). */
const MAX_NODE_SPEED = 14000;
/** Relative stretch that triggers hard recover. */
const CATASTROPHIC_STRETCH = 8;

/**
 * Lightweight whip physics — independent of rendering/UI.
 *
 * Integration model (per fixed step):
 * 1. Drive handle toward mouse target (kinematic)
 * 2. Classic Verlet integrate free nodes (inertia + uniform gravity + damping)
 * 3. Iterative distance constraints (positional only)
 * 4. Reconstruct velocity from post-constraint positions
 * 5. Update diagnostics (KE, constraint error, tip/handle/mid speeds)
 *
 * Waves, lag, and tip acceleration emerge from mass distribution + constraints.
 * Gravity is uniform (not mass-scaled) so the tail hangs and swings.
 */
export class WhipPhysics {
  nodes: PhysicsNode[] = [];
  readonly target = new Vector2();
  readonly tipVelocity = new Vector2();
  readonly tipAcceleration = new Vector2();
  readonly handleVelocity = new Vector2();
  readonly midVelocity = new Vector2();

  private restLength = 10;
  private timestep: FixedTimestep;
  private masses: Float64Array = new Float64Array(0);
  private prevTipVelocity = new Vector2();
  private prevHandlePos = new Vector2();
  /** Target at the start of the current update() — used to substep handle motion. */
  private frameStartTarget = new Vector2();
  private constraintResult: ConstraintSolveResult = { avgError: 0, maxError: 0 };
  private initialized = false;
  private suspended = false;
  private massCurve: MassCurveType = 'smooth';
  private hasFrameStartTarget = false;

  /** Positions before the last physics step — render-only interpolation. */
  private stepPrevX: Float64Array = new Float64Array(0);
  private stepPrevY: Float64Array = new Float64Array(0);
  /** 0 = previous step, 1 = current — never fed back into physics. */
  renderAlpha = 0;

  /** Debug / crack instrumentation (updated each physics step). */
  lastPhysicsSteps = 0;
  tipSpeed = 0;
  tipAccelMagnitude = 0;
  handleSpeed = 0;
  midSpeed = 0;
  /** Σ ½ m v² for free nodes */
  totalKineticEnergy = 0;
  /** ½ m_tip v_tip² */
  tipKineticEnergy = 0;
  avgConstraintError = 0;
  maxConstraintError = 0;
  /** True after a NaN/catastrophe recovery this frame */
  recoveredThisStep = false;

  private config: AppConfig;

  constructor(config: AppConfig) {
    this.config = config;
    this.timestep = new FixedTimestep(
      config.physics.timestep,
      config.physics.maxAccumulatedTime,
    );
  }

  applyConfig(config: AppConfig): void {
    const nodeCountChanged = config.whip.nodeCount !== this.config.whip.nodeCount;
    const lengthChanged = config.whip.length !== this.config.whip.length;
    const tipSensChanged =
      config.motion.tipSensitivity !== this.config.motion.tipSensitivity;
    const massChanged = config.physics.mass !== this.config.physics.mass;
    const curveChanged =
      (config.physics.massCurve ?? 'smooth') !== (this.config.physics.massCurve ?? 'smooth');

    const tsChanged =
      config.physics.timestep !== this.config.physics.timestep ||
      config.physics.maxAccumulatedTime !== this.config.physics.maxAccumulatedTime;

    this.config = config;
    this.massCurve = config.physics.massCurve ?? 'smooth';

    if (tsChanged) {
      this.timestep = new FixedTimestep(
        config.physics.timestep,
        config.physics.maxAccumulatedTime,
      );
    }

    if (nodeCountChanged || !this.initialized) {
      this.rebuild(this.target.x, this.target.y);
    } else {
      if (massChanged || tipSensChanged || curveChanged || lengthChanged) {
        this.refreshMassesAndRadii();
      }
      if (lengthChanged) {
        this.restLength = config.whip.length / Math.max(1, this.nodes.length - 1);
      }
    }
  }

  setMassCurve(curve: MassCurveType): void {
    this.massCurve = curve;
    if (this.initialized) this.refreshMassesAndRadii();
  }

  getMassCurve(): MassCurveType {
    return this.massCurve;
  }

  suspend(): void {
    this.suspended = true;
    this.timestep.reset();
  }

  resume(): void {
    this.suspended = false;
    this.timestep.reset();
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      n.previousPosition.copy(n.position);
      n.velocity.set(0, 0);
      n.acceleration.set(0, 0);
    }
    this.prevTipVelocity.set(0, 0);
    this.tipVelocity.set(0, 0);
    this.tipAcceleration.set(0, 0);
    this.handleVelocity.set(0, 0);
    this.midVelocity.set(0, 0);
    this.handleSpeed = 0;
    this.midSpeed = 0;
    this.tipSpeed = 0;
    this.totalKineticEnergy = 0;
    this.tipKineticEnergy = 0;
    this.frameStartTarget.copy(this.target);
    this.hasFrameStartTarget = true;
  }

  isSuspended(): boolean {
    return this.suspended;
  }

  init(x: number, y: number): void {
    this.target.set(x, y);
    this.prevHandlePos.set(x, y);
    this.rebuild(x, y);
    this.initialized = true;
  }

  private rebuild(x: number, y: number): void {
    const { whip, physics, motion } = this.config;
    const count = Math.max(2, whip.nodeCount | 0);
    this.restLength = whip.length / (count - 1);
    this.massCurve = physics.massCurve ?? 'smooth';
    const power = massPowerFromTipSensitivity(motion.tipSensitivity);
    this.masses = buildMassDistribution(count, physics.mass, this.massCurve, power);

    this.nodes = new Array(count);
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const node = new PhysicsNode(
        x,
        y + i * this.restLength,
        this.masses[i],
        radiusAt(t, whip.thickness, whip.gripSize),
      );
      this.nodes[i] = node;
    }
    this.nodes[0].pin();
    this.prevHandlePos.set(x, y);
    this.frameStartTarget.set(x, y);
    this.hasFrameStartTarget = true;
    this.ensureRenderBuffers(count);
    this.captureStepPrev();
    this.renderAlpha = 0;
  }

  private ensureRenderBuffers(count: number): void {
    if (this.stepPrevX.length !== count) {
      this.stepPrevX = new Float64Array(count);
      this.stepPrevY = new Float64Array(count);
    }
  }

  private captureStepPrev(): void {
    const n = this.nodes.length;
    this.ensureRenderBuffers(n);
    for (let i = 0; i < n; i++) {
      this.stepPrevX[i] = this.nodes[i].position.x;
      this.stepPrevY[i] = this.nodes[i].position.y;
    }
  }

  /**
   * Fill preallocated render buffers with interpolated positions.
   * Handle (index 0) always uses the live target for zero cursor offset.
   * Returns node count.
   */
  getRenderPositions(outX: Float64Array, outY: Float64Array): number {
    const n = this.nodes.length;
    const a = this.lastPhysicsSteps > 0 ? clamp(this.renderAlpha, 0, 1) : 0;
    const inv = 1 - a;
    for (let i = 0; i < n; i++) {
      if (i === 0) {
        // Immediate handle — mouse is the visual origin
        outX[i] = this.target.x;
        outY[i] = this.target.y;
      } else if (a <= 1e-6) {
        outX[i] = this.nodes[i].position.x;
        outY[i] = this.nodes[i].position.y;
      } else {
        outX[i] = this.stepPrevX[i] * inv + this.nodes[i].position.x * a;
        outY[i] = this.stepPrevY[i] * inv + this.nodes[i].position.y * a;
      }
    }
    return n;
  }

  private refreshMassesAndRadii(): void {
    const { whip, physics, motion } = this.config;
    const count = this.nodes.length;
    this.massCurve = physics.massCurve ?? 'smooth';
    const power = massPowerFromTipSensitivity(motion.tipSensitivity);
    this.masses = buildMassDistribution(
      count,
      physics.mass,
      this.massCurve,
      power,
      this.masses,
    );
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      this.nodes[i].setMass(this.masses[i]);
      this.nodes[i].radius = radiusAt(t, whip.thickness, whip.gripSize);
      if (i === 0) this.nodes[i].pin();
    }
  }

  setTarget(x: number, y: number): void {
    this.target.set(sanitizeNumber(x), sanitizeNumber(y));
  }

  /**
   * @deprecated Artificial mid-chain injection removed — waves come from Verlet + mass.
   * Kept as no-op so callers remain source-compatible.
   */
  injectPointerVelocity(_vx: number, _vy: number): void {
    // Intentionally empty — see Phase 2 physics audit.
  }

  update(deltaSeconds: number): void {
    if (this.suspended || !this.initialized || this.nodes.length === 0) {
      this.lastPhysicsSteps = 0;
      this.renderAlpha = 0;
      return;
    }

    const steps = this.timestep.advance(deltaSeconds);
    this.lastPhysicsSteps = steps;
    this.recoveredThisStep = false;

    if (steps === 0) {
      this.renderAlpha = 0;
      return;
    }

    // Substep the handle goal across physics steps so a 60Hz render frame
    // does not dump the entire mouse delta into the first 120Hz step.
    if (!this.hasFrameStartTarget) {
      this.frameStartTarget.copy(this.target);
      this.hasFrameStartTarget = true;
    }
    const startX = this.frameStartTarget.x;
    const startY = this.frameStartTarget.y;
    const endX = this.target.x;
    const endY = this.target.y;

    for (let s = 0; s < steps; s++) {
      this.captureStepPrev();
      const a = (s + 1) / steps;
      const goalX = startX + (endX - startX) * a;
      const goalY = startY + (endY - startY) * a;
      this.step(this.config.physics.timestep, goalX, goalY);
    }

    this.renderAlpha = this.timestep.alpha();
    this.frameStartTarget.copy(this.target);
  }

  private step(dt: number, goalX: number, goalY: number): void {
    const { physics, motion } = this.config;
    const nodes = this.nodes;
    const handle = nodes[0];
    const dt2 = dt * dt;
    const invDt = dt > 1e-8 ? 1 / dt : 0;

    // —— 1. Kinematic handle follow (immediate feel, substepped goal) ——
    const follow = clamp(motion.followStrength, 0, 1);
    const hx = handle.position.x;
    const hy = handle.position.y;
    let newHx = hx + (goalX - hx) * follow;
    let newHy = hy + (goalY - hy) * follow;

    // Sanity clamp only for pathological teleports (not normal mouse motion).
    // Handle must stay on the cursor; the chain supplies physical lag.
    const maxTeleport = 2800;
    const hdx = newHx - hx;
    const hdy = newHy - hy;
    const hDist = Math.hypot(hdx, hdy);
    if (hDist > maxTeleport && hDist > 1e-8) {
      const s = maxTeleport / hDist;
      newHx = hx + hdx * s;
      newHy = hy + hdy * s;
    }

    this.handleVelocity.set((newHx - this.prevHandlePos.x) * invDt, (newHy - this.prevHandlePos.y) * invDt);
    this.handleSpeed = this.handleVelocity.length();
    this.prevHandlePos.set(newHx, newHy);

    handle.position.set(newHx, newHy);
    handle.previousPosition.set(newHx, newHy);
    handle.velocity.copy(this.handleVelocity);

    // Couple handle motion into the first free node (Verlet: shift previousPosition).
    const response = clamp(motion.velocityResponse, 0, 1);
    if (response > 0 && nodes.length > 1) {
      const yank = response * 0.28;
      nodes[1].previousPosition.x -= (newHx - hx) * yank;
      nodes[1].previousPosition.y -= (newHy - hy) * yank;
    }

    // —— 2. Classic Verlet for free nodes (inertia + gravity), THEN constraints.
    // Pre-solving the whole chain before integrate dragged it like a rigid stick.
    const damp = clamp(physics.damping, 0, 0.5);
    const velRetain = Math.pow(1 - damp, dt * 60);
    const frictionRetain = 1 - clamp(physics.friction, 0, 0.2) * (dt * 60);
    const retain = clamp(velRetain * frictionRetain, 0.5, 1);

    const gx = 0;
    const gy = physics.gravity;

    for (let i = 1; i < nodes.length; i++) {
      const node = nodes[i];

      let dx = (node.position.x - node.previousPosition.x) * retain;
      let dy = (node.position.y - node.previousPosition.y) * retain;

      dx += gx * dt2;
      dy += gy * dt2;

      const px = node.position.x;
      const py = node.position.y;

      node.previousPosition.set(px, py);
      node.position.x = px + dx;
      node.position.y = py + dy;
      node.acceleration.set(gx, gy);
    }

    // —— 3. Distance constraints (positional only) ——
    solveChainConstraints(
      nodes,
      this.restLength,
      physics.stiffness,
      physics.iterations,
      this.constraintResult,
      true,
    );

    // Extra sweeps only for true blow-ups — not every flick (that kills lag/waves).
    if (this.constraintResult.maxError > 0.55) {
      solveChainConstraints(
        nodes,
        this.restLength,
        physics.stiffness,
        Math.max(2, (physics.iterations / 2) | 0),
        this.constraintResult,
        true,
      );
    }

    handle.position.set(newHx, newHy);
    handle.previousPosition.set(newHx, newHy);

    // —— 4. Velocity reconstruction ——
    for (let i = 1; i < nodes.length; i++) {
      const node = nodes[i];
      let vx = (node.position.x - node.previousPosition.x) * invDt;
      let vy = (node.position.y - node.previousPosition.y) * invDt;

      const spd = Math.hypot(vx, vy);
      if (spd > MAX_NODE_SPEED) {
        const s = MAX_NODE_SPEED / spd;
        vx *= s;
        vy *= s;
        node.previousPosition.x = node.position.x - vx * dt;
        node.previousPosition.y = node.position.y - vy * dt;
      }

      if (!Number.isFinite(vx) || !Number.isFinite(vy)) {
        vx = 0;
        vy = 0;
        node.previousPosition.copy(node.position);
      }

      node.velocity.set(vx, vy);
    }

    // —— 5. Stability / NaN recovery ——
    this.sanitizeAndRecover(dt);

    // —— 6. Diagnostics ——
    this.updateEnergyAndSegmentMetrics(dt);
  }

  private sanitizeAndRecover(dt: number): void {
    const nodes = this.nodes;
    const handle = nodes[0];
    let corrupt = false;

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (!Vector2.isFinite(n.position) || !Vector2.isFinite(n.previousPosition)) {
        corrupt = true;
        break;
      }
      if (!Number.isFinite(n.velocity.x) || !Number.isFinite(n.velocity.y)) {
        corrupt = true;
        break;
      }
    }

    // Only recover from NaN or runaway stretch. A folded/coiled whip is valid
    // (handle-to-tip span can be short) — resetting it to a vertical stick
    // is what made the cursor look frozen.
    if (!corrupt && nodes.length > 1 && this.restLength > 1e-6) {
      const measured = measureConstraintError(nodes, this.restLength);
      if (measured.maxError > CATASTROPHIC_STRETCH) {
        corrupt = true;
      }
    }

    if (!corrupt) return;

    this.recoveredThisStep = true;
    // Rebuild chain hanging from current handle/target without full config reset
    const x = sanitizeNumber(handle.position.x, this.target.x);
    const y = sanitizeNumber(handle.position.y, this.target.y);
    for (let i = 0; i < nodes.length; i++) {
      const nx = x;
      const ny = y + i * this.restLength;
      nodes[i].reset(nx, ny);
      if (i === 0) nodes[i].pin();
    }
    this.prevHandlePos.set(x, y);
    this.tipVelocity.set(0, 0);
    this.tipAcceleration.set(0, 0);
    this.prevTipVelocity.set(0, 0);
    void dt;
  }

  private updateEnergyAndSegmentMetrics(dt: number): void {
    const nodes = this.nodes;
    const n = nodes.length;
    if (n === 0) return;

    let totalKE = 0;
    for (let i = 1; i < n; i++) {
      const node = nodes[i];
      const v2 = node.velocity.lengthSq();
      totalKE += 0.5 * node.mass * v2;
    }
    this.totalKineticEnergy = totalKE;

    const mid = nodes[(n / 2) | 0];
    this.midVelocity.copy(mid.velocity);
    this.midSpeed = this.midVelocity.length();

    const tip = nodes[n - 1];
    this.prevTipVelocity.copy(this.tipVelocity);
    this.tipVelocity.copy(tip.velocity);
    this.tipSpeed = this.tipVelocity.length();
    this.tipKineticEnergy = 0.5 * tip.mass * tip.velocity.lengthSq();

    if (dt > 1e-8) {
      this.tipAcceleration.x = (this.tipVelocity.x - this.prevTipVelocity.x) / dt;
      this.tipAcceleration.y = (this.tipVelocity.y - this.prevTipVelocity.y) / dt;
    }
    this.tipAccelMagnitude = this.tipAcceleration.length();

    // Final stretch sample for debug (post-sanitize)
    const err = measureConstraintError(nodes, this.restLength);
    this.avgConstraintError = err.avgError;
    this.maxConstraintError = err.maxError;
  }

  getRestLength(): number {
    return this.restLength;
  }

  getNodeCount(): number {
    return this.nodes.length;
  }

  /** Ratio actualDistance / restLength for segment i (0 = handle→node1). */
  segmentRatio(i: number): number {
    if (i < 0 || i >= this.nodes.length - 1 || this.restLength < 1e-8) return 1;
    const a = this.nodes[i];
    const b = this.nodes[i + 1];
    return a.position.distanceTo(b.position) / this.restLength;
  }

  resetTo(x: number, y: number): void {
    this.target.set(x, y);
    this.rebuild(x, y);
    this.timestep.reset();
    this.tipVelocity.set(0, 0);
    this.tipAcceleration.set(0, 0);
    this.prevTipVelocity.set(0, 0);
    this.handleVelocity.set(0, 0);
    this.midVelocity.set(0, 0);
    this.totalKineticEnergy = 0;
    this.tipKineticEnergy = 0;
    this.avgConstraintError = 0;
    this.maxConstraintError = 0;
    this.frameStartTarget.set(x, y);
    this.hasFrameStartTarget = true;
  }
}
