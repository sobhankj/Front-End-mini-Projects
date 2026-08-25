import { clamp } from './Vector2';

/**
 * Mass distribution curve along the whip (handle → tip).
 * All curves are smooth and monotonically non-increasing.
 */
export type MassCurveType = 'linear' | 'exponential' | 'smooth';

/** Tip mass floor relative to handle (before massScale). */
export const MASS_TIP_FLOOR = 0.05;

/**
 * Relative mass at normalized position t ∈ [0, 1].
 * Handle ≈ 1, tip ≈ MASS_TIP_FLOOR.
 */
export function massAt(
  t: number,
  curve: MassCurveType = 'smooth',
  power = 2.0,
): number {
  const u = clamp(t, 0, 1);
  const floor = MASS_TIP_FLOOR;
  const span = 1 - floor;

  switch (curve) {
    case 'linear':
      return floor + span * (1 - u);

    case 'exponential': {
      // Steeper falloff controlled by power (≥ 1)
      const p = Math.max(1, power);
      return floor + span * Math.pow(1 - u, p);
    }

    case 'smooth':
    default: {
      // Smoothstep-eased falloff: gentle near handle, progressive toward tip.
      // Combines cubic smoothstep with moderate power for believable wave transfer.
      const p = Math.max(1, power);
      const s = u * u * (3 - 2 * u); // smoothstep
      return floor + span * Math.pow(1 - s, p * 0.85);
    }
  }
}

/**
 * Build a mass array for `count` nodes, scaled by `massScale`.
 * Writes into `out` when length matches to avoid allocation.
 */
export function buildMassDistribution(
  count: number,
  massScale = 1,
  curve: MassCurveType = 'smooth',
  power = 2.0,
  out?: Float64Array | null,
): Float64Array {
  const n = Math.max(2, count | 0);
  const masses: Float64Array =
    out && out.length === n ? out : new Float64Array(n);
  const denom = n - 1;
  for (let i = 0; i < n; i++) {
    const t = denom === 0 ? 0 : i / denom;
    masses[i] = massAt(t, curve, power) * massScale;
  }
  return masses;
}

/**
 * Visual half-width along the whip (handle → tip).
 * Smooth continuous taper — no abrupt width jumps.
 */
export function radiusAt(t: number, baseThickness: number, gripSize: number): number {
  const u = clamp(t, 0, 1);
  const body = baseThickness * 0.5;
  const grip = gripSize * 0.55;
  const tip = Math.max(0.35, baseThickness * 0.04);

  // Soft blend grip → body over first ~12%, then power taper to tip
  if (u < 0.12) {
    const g = u / 0.12;
    const s = g * g * (3 - 2 * g);
    return grip + (body - grip) * s;
  }
  const bodyT = (u - 0.12) / 0.88;
  // Ease-in power keeps mid-body present, tip extremely thin
  return tip + (body - tip) * Math.pow(1 - bodyT, 1.85);
}

/**
 * Map tipSensitivity (≥ 1) to mass-curve power.
 * Higher sensitivity → steeper falloff → lighter tip → naturally faster tip.
 * Does NOT multiply tip velocity directly.
 */
export function massPowerFromTipSensitivity(tipSensitivity: number): number {
  const s = clamp(tipSensitivity, 1, 3);
  // tipSensitivity 1 → power ~1.6, 1.6 → ~2.1, 3 → ~3.2
  return 1.2 + (s - 1) * 1.0;
}
