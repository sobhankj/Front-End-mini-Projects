import { Vector2, clamp } from '../physics/Vector2';

/** Max tracked pointer speed (px/s) before clamping. */
const MAX_POINTER_SPEED = 10000;

export interface PointerSample {
  x: number;
  y: number;
  time: number;
}

/**
 * Lightweight pointer tracker — no DOM writes, no framework state.
 * Computes velocity, acceleration, direction change, and movement energy.
 */
export class PointerTracker {
  readonly position = new Vector2();
  readonly velocity = new Vector2();
  readonly acceleration = new Vector2();
  readonly direction = new Vector2(1, 0);

  /** Radians between previous and current direction (0–π). */
  directionChange = 0;
  /** Scalar energy proxy from speed × accel. */
  energy = 0;
  speed = 0;
  accelMagnitude = 0;

  private prevVelocity = new Vector2();
  private prevDirection = new Vector2(1, 0);
  private lastTime = 0;
  private hasSample = false;
  private active = false;

  /** Call from pointermove / pointerdown. */
  update(x: number, y: number, timeMs: number): void {
    const t = timeMs * 0.001;
    if (!this.hasSample) {
      this.position.set(x, y);
      this.lastTime = t;
      this.hasSample = true;
      this.active = true;
      return;
    }

    const dt = t - this.lastTime;
    if (dt < 1e-5) {
      this.position.set(x, y);
      return;
    }

    // Soft clamp absurd dt (e.g. after sleep) — treat as teleport, reset derivatives
    if (dt > 0.1) {
      this.position.set(x, y);
      this.velocity.set(0, 0);
      this.acceleration.set(0, 0);
      this.speed = 0;
      this.accelMagnitude = 0;
      this.energy = 0;
      this.directionChange = 0;
      this.lastTime = t;
      return;
    }

    const dx = x - this.position.x;
    const dy = y - this.position.y;
    let vx = dx / dt;
    let vy = dy / dt;

    let spd = Math.hypot(vx, vy);
    if (spd > MAX_POINTER_SPEED) {
      const s = MAX_POINTER_SPEED / spd;
      vx *= s;
      vy *= s;
      spd = MAX_POINTER_SPEED;
    }

    this.prevVelocity.copy(this.velocity);
    this.velocity.set(vx, vy);
    this.speed = spd;

    this.acceleration.x = (vx - this.prevVelocity.x) / dt;
    this.acceleration.y = (vy - this.prevVelocity.y) / dt;
    this.accelMagnitude = this.acceleration.length();

    if (spd > 8) {
      this.prevDirection.copy(this.direction);
      this.direction.set(vx / spd, vy / spd);
      const dot = clamp(this.prevDirection.dot(this.direction), -1, 1);
      this.directionChange = Math.acos(dot);
    } else {
      this.directionChange *= 0.9;
    }

    this.energy =
      this.speed * 0.001 +
      this.accelMagnitude * 0.00002 +
      this.directionChange * this.speed * 0.002;

    this.position.set(x, y);
    this.lastTime = t;
    this.active = true;
  }

  onPointerUp(): void {
    // Decay will happen naturally; mark inactive for UI if needed
    this.active = false;
  }

  isActive(): boolean {
    return this.active;
  }

  /** Soft-decay derivatives when no events arrive (called from loop). */
  decay(dt: number): void {
    const f = Math.exp(-8 * dt);
    this.velocity.scale(f);
    this.acceleration.scale(f);
    this.speed *= f;
    this.accelMagnitude *= f;
    this.energy *= f;
    this.directionChange *= f;
  }

  reset(x: number, y: number): void {
    this.position.set(x, y);
    this.velocity.set(0, 0);
    this.acceleration.set(0, 0);
    this.direction.set(1, 0);
    this.prevDirection.set(1, 0);
    this.prevVelocity.set(0, 0);
    this.directionChange = 0;
    this.energy = 0;
    this.speed = 0;
    this.accelMagnitude = 0;
    this.hasSample = true;
    this.lastTime = performance.now() * 0.001;
  }
}
