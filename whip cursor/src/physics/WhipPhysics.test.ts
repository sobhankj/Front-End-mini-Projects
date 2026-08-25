import { describe, it, expect } from 'vitest';
import { DEFAULT_CONFIG } from '../config/defaults';
import { cloneConfig } from '../config/presets';
import { WhipPhysics } from './WhipPhysics';
import { measureConstraintError } from './Constraints';

function makeWhip(overrides?: (cfg: ReturnType<typeof cloneConfig>) => void): WhipPhysics {
  const cfg = cloneConfig(DEFAULT_CONFIG);
  overrides?.(cfg);
  const whip = new WhipPhysics(cfg);
  whip.init(100, 100);
  return whip;
}

describe('whip initialization', () => {
  it('creates configured node count with lighter tip', () => {
    const whip = makeWhip((c) => {
      c.whip.nodeCount = 24;
    });
    expect(whip.getNodeCount()).toBe(24);
    expect(whip.nodes[0].invMass).toBe(0);
    expect(whip.nodes[whip.nodes.length - 1].mass).toBeLessThan(whip.nodes[0].mass);
  });

  it('handles extreme target without NaN', () => {
    const whip = makeWhip();
    whip.setTarget(1e9, -1e9);
    for (let i = 0; i < 30; i++) {
      whip.update(1 / 60);
    }
    for (const n of whip.nodes) {
      expect(Number.isFinite(n.position.x)).toBe(true);
      expect(Number.isFinite(n.position.y)).toBe(true);
      expect(Number.isFinite(n.velocity.x)).toBe(true);
    }
  });

  it('suspend/resume clears ghost velocity', () => {
    const whip = makeWhip();
    whip.setTarget(200, 50);
    whip.update(0.1);
    whip.suspend();
    whip.resume();
    expect(whip.tipVelocity.length()).toBe(0);
  });
});

describe('handle anchoring', () => {
  it('keeps handle at target with followStrength 1', () => {
    const whip = makeWhip((c) => {
      c.motion.followStrength = 1;
    });
    whip.setTarget(250, 180);
    whip.update(1 / 60);
    expect(whip.nodes[0].position.x).toBeCloseTo(250, 0);
    expect(whip.nodes[0].position.y).toBeCloseTo(180, 0);
  });

  it('does not teleport the tip with the handle in one step', () => {
    const whip = makeWhip();
    const tipBefore = whip.nodes[whip.nodes.length - 1].position.clone();
    whip.setTarget(400, 100);
    whip.update(1 / 120);
    const tipAfter = whip.nodes[whip.nodes.length - 1].position;
    const tipMove = tipBefore.distanceTo(tipAfter);
    const handleMove = Math.hypot(400 - 100, 0);
    expect(tipMove).toBeLessThan(handleMove * 0.5);
  });
});

describe('constraint error under motion', () => {
  it('keeps max stretch controlled during fast handle motion', () => {
    const whip = makeWhip();
    for (let i = 0; i < 40; i++) {
      whip.setTarget(100 + i * 25, 100 + Math.sin(i * 0.4) * 40);
      whip.update(1 / 120);
    }
    const err = measureConstraintError(whip.nodes, whip.getRestLength());
    expect(err.maxError).toBeLessThan(0.85);
    expect(whip.maxConstraintError).toBeLessThan(0.85);
  });
});

describe('velocity preservation & tip acceleration', () => {
  it('preserves momentum after stopping the handle', () => {
    const whip = makeWhip((c) => {
      c.physics.damping = 0.02;
      c.physics.friction = 0.002;
      c.physics.gravity = 0;
    });
    // Accelerate horizontally
    for (let i = 0; i < 20; i++) {
      whip.setTarget(100 + i * 30, 100);
      whip.update(1 / 120);
    }
    const keBeforeStop = whip.totalKineticEnergy;
    // Hold still
    for (let i = 0; i < 8; i++) {
      whip.setTarget(100 + 19 * 30, 100);
      whip.update(1 / 120);
    }
    expect(whip.totalKineticEnergy).toBeGreaterThan(keBeforeStop * 0.15);
    expect(whip.totalKineticEnergy).toBeGreaterThan(1);
  });

  it('produces tip speed greater than handle during a flick', () => {
    const whip = makeWhip((c) => {
      c.physics.gravity = 0;
      c.physics.damping = 0.03;
      c.motion.tipSensitivity = 2.0;
    });
    // Build lateral motion then reverse hard
    for (let i = 0; i < 15; i++) {
      whip.setTarget(100 + i * 40, 200);
      whip.update(1 / 120);
    }
    let tipBeatHandleWhileMoving = false;
    for (let i = 0; i < 18; i++) {
      whip.setTarget(100 + 14 * 40 - i * 55, 200);
      whip.update(1 / 120);
      if (whip.handleSpeed > 400 && whip.tipSpeed > whip.handleSpeed) {
        tipBeatHandleWhileMoving = true;
        break;
      }
    }
    // If not yet during reverse, allow a short coast while handle still nonzero
    if (!tipBeatHandleWhileMoving) {
      for (let i = 0; i < 25; i++) {
        whip.update(1 / 120);
        if (whip.handleSpeed > 80 && whip.tipSpeed > whip.handleSpeed * 1.05) {
          tipBeatHandleWhileMoving = true;
          break;
        }
      }
    }
    expect(tipBeatHandleWhileMoving).toBe(true);
  });
});

describe('NaN recovery', () => {
  it('recovers from corrupted node state', () => {
    const whip = makeWhip();
    whip.nodes[5].position.x = Number.NaN;
    whip.nodes[5].position.y = Number.POSITIVE_INFINITY;
    whip.setTarget(120, 120);
    whip.update(1 / 60);
    for (const n of whip.nodes) {
      expect(Number.isFinite(n.position.x)).toBe(true);
      expect(Number.isFinite(n.position.y)).toBe(true);
    }
    expect(whip.recoveredThisStep).toBe(true);
  });
});

describe('fixed timestep consistency', () => {
  it('similar tip position after same simulated time at different render rates', () => {
    const run = (frameDt: number, frames: number) => {
      const whip = makeWhip((c) => {
        c.physics.gravity = 0;
      });
      let t = 0;
      for (let f = 0; f < frames; f++) {
        t += frameDt;
        whip.setTarget(100 + Math.sin(t * 8) * 120, 100 + Math.cos(t * 8) * 80);
        whip.update(frameDt);
      }
      const tip = whip.nodes[whip.nodes.length - 1].position;
      return { x: tip.x, y: tip.y, ke: whip.totalKineticEnergy };
    };

    // Same wall time ~0.25s
    const at60 = run(1 / 60, 15);
    const at120 = run(1 / 120, 30);
    const at144 = run(1 / 144, 36);

    expect(Math.abs(at60.x - at120.x)).toBeLessThan(25);
    expect(Math.abs(at120.x - at144.x)).toBeLessThan(25);
    expect(Math.abs(at60.y - at144.y)).toBeLessThan(30);
  });
});
