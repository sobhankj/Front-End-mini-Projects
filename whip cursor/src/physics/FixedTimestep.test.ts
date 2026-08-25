import { describe, it, expect } from 'vitest';
import { FixedTimestep } from './FixedTimestep';

describe('FixedTimestep', () => {
  it('runs expected steps at matching rate', () => {
    const ft = new FixedTimestep(1 / 120, 0.1);
    expect(ft.advance(1 / 60)).toBe(2);
    expect(ft.advance(1 / 120)).toBe(1);
  });

  it('clamps accumulated time after large stall', () => {
    const ft = new FixedTimestep(1 / 120, 0.05);
    const steps = ft.advance(5);
    // maxAccumulated 0.05 / (1/120) = 6 steps
    expect(steps).toBe(6);
    expect(ft.getAccumulated()).toBeLessThan(1 / 120);
  });

  it('reset clears accumulator', () => {
    const ft = new FixedTimestep(1 / 120, 0.1);
    ft.advance(0.01);
    ft.reset();
    expect(ft.getAccumulated()).toBe(0);
  });
});
