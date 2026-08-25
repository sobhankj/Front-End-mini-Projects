import { describe, it, expect } from 'vitest';
import { assertPresetCoherent, getPresetConfig, PRESET_LABELS } from '../config/presets';
import type { PresetId } from '../config/types';
import { sampleTaperRadii, isMonotonicNonIncreasing } from '../render/taper';
import { WhipPhysics } from '../physics/WhipPhysics';
import { cloneConfig } from '../config/presets';
import { DEFAULT_CONFIG } from '../config/defaults';
import { FixedTimestep } from '../physics/FixedTimestep';

describe('preset validity', () => {
  const ids = Object.keys(PRESET_LABELS) as PresetId[];

  it('every preset is coherent', () => {
    for (const id of ids) {
      expect(assertPresetCoherent(id)).toEqual([]);
      const c = getPresetConfig(id);
      expect(c.motion.followStrength).toBeGreaterThanOrEqual(0.95);
      expect(c.physics.massCurve).toBeTruthy();
    }
  });

  it('presets differ meaningfully from classic', () => {
    const classic = getPresetConfig('classic');
    const heavy = getPresetConfig('heavy');
    const light = getPresetConfig('light');
    expect(heavy.physics.mass).toBeGreaterThan(classic.physics.mass);
    expect(light.physics.mass).toBeLessThan(classic.physics.mass);
    expect(heavy.whip.length).toBeGreaterThan(light.whip.length);
    expect(getPresetConfig('snappy').physics.stiffness).toBeGreaterThan(
      getPresetConfig('loose').physics.stiffness,
    );
  });
});

describe('monotonic taper', () => {
  it('half-width decreases from handle to tip', () => {
    const r = sampleTaperRadii(32, 8, 9);
    expect(isMonotonicNonIncreasing(r)).toBe(true);
    expect(r[0]).toBeGreaterThan(r[r.length - 1]);
    expect(r[r.length - 1]).toBeLessThan(1.2);
  });
});

describe('render interpolation', () => {
  it('exposes alpha after physics steps and keeps handle on target', () => {
    const w = new WhipPhysics(cloneConfig(DEFAULT_CONFIG));
    w.init(100, 100);
    w.setTarget(180, 120);
    w.update(1 / 60);
    expect(w.lastPhysicsSteps).toBeGreaterThan(0);
    expect(w.renderAlpha).toBeGreaterThanOrEqual(0);
    expect(w.renderAlpha).toBeLessThan(1);

    const xs = new Float64Array(64);
    const ys = new Float64Array(64);
    const n = w.getRenderPositions(xs, ys);
    expect(n).toBe(w.getNodeCount());
    expect(xs[0]).toBeCloseTo(180, 5);
    expect(ys[0]).toBeCloseTo(120, 5);
  });

  it('fixed timestep alpha is consistent', () => {
    const ft = new FixedTimestep(1 / 120, 0.1);
    ft.advance(1 / 60);
    expect(ft.alpha()).toBeGreaterThanOrEqual(0);
    expect(ft.alpha()).toBeLessThan(1);
  });
});

describe('edge-of-screen stability', () => {
  it('survives corners without NaN', () => {
    const w = new WhipPhysics(cloneConfig(DEFAULT_CONFIG));
    w.init(400, 300);
    const corners = [
      [0, 0],
      [1920, 0],
      [0, 1080],
      [1920, 1080],
      [960, 0],
      [0, 540],
    ];
    for (const [x, y] of corners) {
      for (let i = 0; i < 8; i++) {
        w.setTarget(x, y);
        w.update(1 / 60);
      }
    }
    for (const n of w.nodes) {
      expect(Number.isFinite(n.position.x)).toBe(true);
      expect(Number.isFinite(n.position.y)).toBe(true);
    }
    expect(w.getNodeCount()).toBe(DEFAULT_CONFIG.whip.nodeCount);
  });
});

describe('renderer extreme coordinates', () => {
  it('getRenderPositions stays finite for large targets', () => {
    const w = new WhipPhysics(cloneConfig(DEFAULT_CONFIG));
    w.init(0, 0);
    w.setTarget(50000, -50000);
    w.update(1 / 60);
    const xs = new Float64Array(64);
    const ys = new Float64Array(64);
    w.getRenderPositions(xs, ys);
    for (let i = 0; i < w.getNodeCount(); i++) {
      expect(Number.isFinite(xs[i])).toBe(true);
      expect(Number.isFinite(ys[i])).toBe(true);
    }
  });
});
