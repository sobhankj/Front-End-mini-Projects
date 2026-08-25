import { describe, it, expect } from 'vitest';
import { WhipPhysics } from './WhipPhysics';
import { cloneConfig } from '../config/presets';
import { DEFAULT_CONFIG } from '../config/defaults';

describe('whip visibility / chain span', () => {
  it('keeps a non-collapsed chain after handle tracking', () => {
    const cfg = cloneConfig(DEFAULT_CONFIG);
    const w = new WhipPhysics(cfg);
    w.init(400, 300);

    const span0 = w.nodes[0].position.distanceTo(w.nodes[w.nodes.length - 1].position);
    expect(span0).toBeGreaterThan(cfg.whip.length * 0.8);

    for (let i = 0; i < 45; i++) {
      w.setTarget(420 + i * 8, 280 + Math.sin(i * 0.2) * 30);
      w.update(1 / 60);
    }

    const span = w.nodes[0].position.distanceTo(w.nodes[w.nodes.length - 1].position);
    expect(w.getNodeCount()).toBe(cfg.whip.nodeCount);
    expect(span).toBeGreaterThan(cfg.whip.length * 0.35);
    expect(span).toBeLessThan(cfg.whip.length * 1.5);
  });
});
