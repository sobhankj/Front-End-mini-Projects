import { describe, it, expect } from 'vitest';
import { WhipPhysics } from './WhipPhysics';
import { cloneConfig } from '../config/presets';
import { DEFAULT_CONFIG } from '../config/defaults';

/**
 * Scenario audit — encodes manual movement expectations as automated checks.
 */
describe('physics scenario audit', () => {
  function create(gravity?: number): WhipPhysics {
    const cfg = cloneConfig(DEFAULT_CONFIG);
    if (gravity !== undefined) cfg.physics.gravity = gravity;
    const w = new WhipPhysics(cfg);
    w.init(400, 300);
    return w;
  }

  it('slow movement keeps stretch low', () => {
    const w = create();
    for (let i = 0; i < 40; i++) {
      w.setTarget(400 + i * 2, 300);
      w.update(1 / 120);
    }
    expect(w.maxConstraintError).toBeLessThan(0.2);
    expect(Number.isFinite(w.totalKineticEnergy)).toBe(true);
  });

  it('gravity hangs the tail below the handle', () => {
    const w = create();
    const handle = w.nodes[0];
    const tip = w.nodes[w.nodes.length - 1];
    for (let i = 0; i < 60; i++) {
      w.setTarget(400, 200);
      w.update(1 / 60);
    }
    expect(tip.position.y).toBeGreaterThan(handle.position.y + 80);
    expect(handle.position.distanceTo(tip.position)).toBeGreaterThan(w.getRestLength() * 8);
  });

  it('horizontal yank curves the whip then gravity pulls it back down', () => {
    const w = create();
    const n = w.nodes.length;
    const handle = w.nodes[0];
    const tip = w.nodes[n - 1];
    const mid = w.nodes[(n / 2) | 0];

    let maxBend = 0;
    for (let i = 0; i < 18; i++) {
      w.setTarget(200 + i * 45, 180);
      w.update(1 / 60);
      const hx = handle.position.x;
      const hy = handle.position.y;
      const mx = mid.position.x;
      const my = mid.position.y;
      const tx = tip.position.x;
      const ty = tip.position.y;
      const dx = tx - hx;
      const dy = ty - hy;
      const len = Math.hypot(dx, dy) || 1;
      const bend = Math.abs((mx - hx) * dy - (my - hy) * dx) / len;
      if (bend > maxBend) maxBend = bend;
    }
    expect(maxBend).toBeGreaterThan(18);

    const holdX = 200 + 17 * 45;
    for (let i = 0; i < 90; i++) {
      w.setTarget(holdX, 180);
      w.update(1 / 60);
    }
    expect(tip.position.y).toBeGreaterThan(handle.position.y + 80);
    expect(Math.abs(tip.position.x - handle.position.x)).toBeLessThan(160);
  });

  it('fast linear motion creates lag (tip behind handle path)', () => {
    const w = create(0);
    let sawLag = false;
    let maxTrail = 0;
    for (let i = 0; i < 25; i++) {
      w.setTarget(200 + i * 40, 300);
      w.update(1 / 120);
      const handleX = w.nodes[0].position.x;
      const tipX = w.nodes[w.nodes.length - 1].position.x;
      const trail = handleX - tipX;
      if (trail > maxTrail) maxTrail = trail;
      // During acceleration to +X, tip should trail the handle
      if (i > 3 && i < 15 && trail > 25) sawLag = true;
    }
    expect(sawLag).toBe(true);
    expect(maxTrail).toBeGreaterThan(40);
    expect(w.maxConstraintError).toBeLessThan(0.85);
  });

  it('sudden reversal produces delayed tip response (traveling wave)', () => {
    const w = create(0);
    for (let i = 0; i < 20; i++) {
      w.setTarget(200 + i * 35, 300);
      w.update(1 / 120);
    }

    // Track when mid vs tip velocity reverse relative to prior direction (+x)
    let midReverseStep = -1;
    let tipReverseStep = -1;
    for (let i = 0; i < 30; i++) {
      w.setTarget(200 + 19 * 35 - i * 45, 300);
      w.update(1 / 120);
      const midVx = w.nodes[(w.nodes.length / 2) | 0].velocity.x;
      const tipVx = w.nodes[w.nodes.length - 1].velocity.x;
      if (midReverseStep < 0 && midVx < -150) midReverseStep = i;
      if (tipReverseStep < 0 && tipVx < -150) tipReverseStep = i;
    }

    expect(midReverseStep).toBeGreaterThanOrEqual(0);
    expect(tipReverseStep).toBeGreaterThanOrEqual(0);
    // Mid should reverse at the same time or earlier than tip (wave travels outward)
    expect(midReverseStep).toBeLessThanOrEqual(tipReverseStep);
  });

  it('circular motion remains stable', () => {
    const w = create();
    for (let i = 0; i < 120; i++) {
      const a = i * 0.12;
      w.setTarget(400 + Math.cos(a) * 90, 300 + Math.sin(a) * 90);
      w.update(1 / 60); // 60Hz render pacing with substepped physics
    }
    for (const n of w.nodes) {
      expect(Number.isFinite(n.position.x)).toBe(true);
      expect(Number.isFinite(n.position.y)).toBe(true);
    }
    expect(w.maxConstraintError).toBeLessThan(0.85);
    expect(w.recoveredThisStep).toBe(false);
  });

  it('stopping retains then drains kinetic energy', () => {
    const w = create(0);
    for (let i = 0; i < 20; i++) {
      w.setTarget(200 + i * 40, 300);
      w.update(1 / 120);
    }
    const keMove = w.totalKineticEnergy;
    const holdX = 200 + 19 * 40;
    for (let i = 0; i < 6; i++) {
      w.setTarget(holdX, 300);
      w.update(1 / 120);
    }
    const keSoon = w.totalKineticEnergy;
    // Still has meaningful energy shortly after stop (not instantly dead)
    expect(keSoon).toBeGreaterThan(keMove * 0.08);
    for (let i = 0; i < 240; i++) {
      w.setTarget(holdX, 300);
      w.update(1 / 120);
    }
    expect(w.totalKineticEnergy).toBeLessThan(keSoon * 0.25);
  });
});
