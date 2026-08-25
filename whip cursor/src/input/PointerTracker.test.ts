import { describe, it, expect } from 'vitest';
import { PointerTracker } from './PointerTracker';

describe('PointerTracker velocity / acceleration', () => {
  it('computes velocity from samples', () => {
    const p = new PointerTracker();
    p.update(0, 0, 0);
    p.update(100, 0, 100); // 100px in 0.1s → 1000 px/s
    expect(p.speed).toBeCloseTo(1000, 0);
    expect(p.velocity.x).toBeCloseTo(1000, 0);
  });

  it('clamps extreme velocity', () => {
    const p = new PointerTracker();
    p.update(0, 0, 0);
    p.update(1e7, 0, 1); // absurd jump in 1ms
    expect(p.speed).toBeLessThanOrEqual(10000);
  });

  it('resets derivatives on large time gap', () => {
    const p = new PointerTracker();
    p.update(0, 0, 0);
    p.update(50, 0, 50);
    p.update(100, 0, 5000); // big gap
    expect(p.speed).toBe(0);
  });

  it('detects direction change', () => {
    const p = new PointerTracker();
    p.update(0, 0, 0);
    p.update(100, 0, 50);
    p.update(100, 100, 100);
    expect(p.directionChange).toBeGreaterThan(0.5);
  });
});
