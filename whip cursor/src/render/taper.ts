/** Monotonic half-width samples for tests (handle → tip). */
import { radiusAt } from '../physics/MassCurve';

export function sampleTaperRadii(
  count: number,
  thickness: number,
  gripSize: number,
): Float64Array {
  const n = Math.max(2, count | 0);
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = radiusAt(i / (n - 1), thickness, gripSize);
  }
  return out;
}

export function isMonotonicNonIncreasing(values: ArrayLike<number>, eps = 1e-6): boolean {
  for (let i = 1; i < values.length; i++) {
    if (values[i] > values[i - 1] + eps) return false;
  }
  return true;
}
