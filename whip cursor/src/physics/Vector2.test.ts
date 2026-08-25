import { describe, it, expect } from 'vitest';
import { Vector2, clamp } from './Vector2';

describe('Vector2', () => {
  it('sets and copies', () => {
    const a = new Vector2(1, 2);
    const b = new Vector2().copy(a);
    expect(b.x).toBe(1);
    expect(b.y).toBe(2);
    a.set(3, 4);
    expect(a.x).toBe(3);
  });

  it('adds, subtracts, scales', () => {
    const v = new Vector2(2, 4).add(new Vector2(1, 1)).sub(new Vector2(0, 2)).scale(2);
    expect(v.x).toBe(6);
    expect(v.y).toBe(6);
  });

  it('computes length and normalizes', () => {
    const v = new Vector2(3, 4);
    expect(v.length()).toBe(5);
    v.normalize();
    expect(v.length()).toBeCloseTo(1);
  });

  it('distance and static helpers', () => {
    const a = new Vector2(0, 0);
    const b = new Vector2(3, 4);
    expect(a.distanceTo(b)).toBe(5);
    const out = new Vector2();
    Vector2.lerp(a, b, 0.5, out);
    expect(out.x).toBe(1.5);
    expect(out.y).toBe(2);
  });

  it('clamp works', () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 3)).toBe(0);
  });
});
