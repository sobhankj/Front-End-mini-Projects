import type { PhysicsNode } from './Node';
import { clamp } from './Vector2';

export interface ConstraintSolveResult {
  /** Mean |actual/rest - 1| over segments (last iteration). */
  avgError: number;
  /** Max |actual/rest - 1| over segments (last iteration). */
  maxError: number;
}

const emptyResult: ConstraintSolveResult = { avgError: 0, maxError: 0 };

/**
 * Iterative distance constraint between two nodes.
 * Mass-weighted positional correction. Does not touch velocities —
 * caller reconstructs velocity from Verlet state after the full solve.
 *
 * @param tensionOnly If true, only correct stretch (rope/whip). Slack is allowed
 *   so the chain hangs and folds instead of accordion-pushing into itself.
 * @returns absolute relative stretch |dist/rest - 1| (0 when slack-skipped)
 */
export function solveDistanceConstraint(
  a: PhysicsNode,
  b: PhysicsNode,
  restLength: number,
  stiffness: number,
  tensionOnly = false,
): number {
  const dx = b.position.x - a.position.x;
  const dy = b.position.y - a.position.y;
  const distSq = dx * dx + dy * dy;

  if (restLength < 1e-8) return 0;

  // Degenerate overlap — nudge apart along +Y (gravity) so the tail can fall
  if (distSq < 1e-12) {
    if (b.invMass > 0) b.position.y += restLength * 0.5;
    else if (a.invMass > 0) a.position.y -= restLength * 0.5;
    return 1;
  }

  const dist = Math.sqrt(distSq);
  const invTotal = a.invMass + b.invMass;
  if (invTotal < 1e-12) return Math.abs(dist / restLength - 1);

  const relError = dist / restLength - 1;
  if (tensionOnly && relError < 0) return 0;

  const diff = (dist - restLength) / dist;
  const corr = diff * clamp(stiffness, 0, 1);

  const wA = a.invMass / invTotal;
  const wB = b.invMass / invTotal;

  a.position.x += dx * corr * wA;
  a.position.y += dy * corr * wA;
  b.position.x -= dx * corr * wB;
  b.position.y -= dy * corr * wB;

  return Math.abs(relError);
}

/**
 * Solve sequential segment constraints with alternating sweep direction.
 * Alternating passes improve convergence vs. always-forward Jacobi-ish bias.
 *
 * Velocity is intentionally NOT modified here. With Verlet, momentum is
 * preserved by leaving previousPosition alone; reconstruct after the solve.
 */
export function solveChainConstraints(
  nodes: PhysicsNode[],
  restLength: number,
  stiffness: number,
  iterations: number,
  out: ConstraintSolveResult = emptyResult,
  tensionOnly = false,
): ConstraintSolveResult {
  const n = nodes.length;
  if (n < 2) {
    out.avgError = 0;
    out.maxError = 0;
    return out;
  }

  const iters = Math.max(1, iterations | 0);
  let avgError = 0;
  let maxError = 0;
  const segCount = n - 1;

  for (let iter = 0; iter < iters; iter++) {
    let sum = 0;
    let max = 0;
    const forward = (iter & 1) === 0;

    if (forward) {
      for (let i = 0; i < segCount; i++) {
        const e = solveDistanceConstraint(
          nodes[i],
          nodes[i + 1],
          restLength,
          stiffness,
          tensionOnly,
        );
        sum += e;
        if (e > max) max = e;
      }
    } else {
      for (let i = segCount - 1; i >= 0; i--) {
        const e = solveDistanceConstraint(
          nodes[i],
          nodes[i + 1],
          restLength,
          stiffness,
          tensionOnly,
        );
        sum += e;
        if (e > max) max = e;
      }
    }

    avgError = sum / segCount;
    maxError = max;
  }

  out.avgError = avgError;
  out.maxError = maxError;
  return out;
}

/**
 * Measure constraint stretch without modifying positions.
 */
export function measureConstraintError(
  nodes: PhysicsNode[],
  restLength: number,
): ConstraintSolveResult {
  const n = nodes.length;
  if (n < 2 || restLength < 1e-8) return { avgError: 0, maxError: 0 };

  let sum = 0;
  let max = 0;
  for (let i = 0; i < n - 1; i++) {
    const dx = nodes[i + 1].position.x - nodes[i].position.x;
    const dy = nodes[i + 1].position.y - nodes[i].position.y;
    const dist = Math.hypot(dx, dy);
    const e = Math.abs(dist / restLength - 1);
    sum += e;
    if (e > max) max = e;
  }
  return { avgError: sum / (n - 1), maxError: max };
}
