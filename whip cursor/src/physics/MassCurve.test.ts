import { describe, it, expect } from 'vitest';
import { massAt, buildMassDistribution, massPowerFromTipSensitivity } from './MassCurve';

describe('mass distribution', () => {
  it('handle is heavier than tip for all curves', () => {
    for (const curve of ['linear', 'exponential', 'smooth'] as const) {
      expect(massAt(0, curve)).toBeGreaterThan(massAt(1, curve));
      expect(massAt(0, curve)).toBeCloseTo(1, 2);
      expect(massAt(1, curve)).toBeCloseTo(0.05, 2);
    }
  });

  it('is monotonically non-increasing along the whip', () => {
    for (const curve of ['linear', 'exponential', 'smooth'] as const) {
      const m = buildMassDistribution(32, 1, curve, 2);
      for (let i = 1; i < m.length; i++) {
        expect(m[i]).toBeLessThanOrEqual(m[i - 1] + 1e-9);
      }
    }
  });

  it('applies mass scale', () => {
    const m = buildMassDistribution(4, 2, 'smooth', 2);
    expect(m[0]).toBeCloseTo(2, 1);
  });

  it('maps tipSensitivity to steeper power', () => {
    expect(massPowerFromTipSensitivity(3)).toBeGreaterThan(massPowerFromTipSensitivity(1));
  });
});
