import { describe, it, expect } from 'vitest';
import { CrackDetector } from './CrackDetector';
import { PointerTracker } from '../input/PointerTracker';
import { WhipPhysics } from '../physics/WhipPhysics';
import { cloneConfig } from '../config/presets';
import { DEFAULT_CONFIG } from '../config/defaults';

function setup() {
  const cfg = cloneConfig(DEFAULT_CONFIG);
  cfg.audio.crackEnabled = true;
  cfg.audio.crackSensitivity = 0.9;
  cfg.audio.cooldown = 0.2;
  const detector = new CrackDetector(cfg.audio);
  const pointer = new PointerTracker();
  const physics = new WhipPhysics(cfg);
  physics.init(0, 0);
  return { detector, pointer, physics, cfg };
}

describe('crack detection', () => {
  it('does not crack from idle', () => {
    const { detector, pointer, physics } = setup();
    expect(detector.update(pointer, physics, 1)).toBe(false);
    expect(detector.lastEligible).toBe(false);
  });

  it('does not crack from mouse speed alone', () => {
    const { detector, pointer, physics } = setup();
    pointer.speed = 5000;
    pointer.accelMagnitude = 80000;
    pointer.directionChange = 0;
    pointer.energy = 2;
    physics.tipSpeed = 100;
    physics.tipAccelMagnitude = 0;
    physics.handleSpeed = 5000;
    physics.totalKineticEnergy = 5;
    physics.tipKineticEnergy = 0.1;
    expect(detector.update(pointer, physics, 1)).toBe(false);
  });

  it('does not crack from slow circular-like motion', () => {
    const { detector, pointer, physics } = setup();
    pointer.speed = 600;
    pointer.directionChange = 0.2;
    physics.tipSpeed = 700;
    physics.tipAccelMagnitude = 5000;
    physics.handleSpeed = 600;
    physics.totalKineticEnergy = 80;
    physics.tipKineticEnergy = 10;
    expect(detector.update(pointer, physics, 1)).toBe(false);
  });

  it('cracks on a sharp tip snap even without a full reversal', () => {
    const { detector, pointer, physics } = setup();
    pointer.speed = 900;
    pointer.accelMagnitude = 20000;
    pointer.directionChange = 0.1;
    physics.handleSpeed = 700;
    physics.tipSpeed = 2200;
    physics.tipAccelMagnitude = 30000;
    physics.totalKineticEnergy = 280;
    physics.tipKineticEnergy = 90;
    expect(detector.update(pointer, physics, 1)).toBe(true);
  });

  it('cracks on multi-signal flick and respects cooldown', () => {
    const { detector, pointer, physics } = setup();
    pointer.speed = 1400;
    pointer.accelMagnitude = 40000;
    pointer.directionChange = 1.2;
    physics.handleSpeed = 900;
    physics.tipSpeed = 2800;
    physics.tipAccelMagnitude = 80000;
    physics.totalKineticEnergy = 400;
    physics.tipKineticEnergy = 120;

    expect(detector.update(pointer, physics, 1)).toBe(true);
    expect(detector.lastEligible).toBe(true);
    expect(detector.update(pointer, physics, 1.05)).toBe(false);

    // Drop below hysteresis exit
    pointer.speed = 0;
    pointer.directionChange = 0;
    physics.tipSpeed = 0;
    physics.tipAccelMagnitude = 0;
    physics.handleSpeed = 0;
    physics.totalKineticEnergy = 0;
    physics.tipKineticEnergy = 0;
    expect(detector.update(pointer, physics, 1.2)).toBe(false);

    pointer.speed = 1400;
    pointer.directionChange = 1.2;
    physics.handleSpeed = 900;
    physics.tipSpeed = 2800;
    physics.tipAccelMagnitude = 80000;
    physics.totalKineticEnergy = 400;
    physics.tipKineticEnergy = 120;
    expect(detector.update(pointer, physics, 1.5)).toBe(true);
  });

  it('respects disabled setting', () => {
    const { detector, pointer, physics, cfg } = setup();
    cfg.audio.crackEnabled = false;
    detector.applyConfig(cfg.audio);
    pointer.speed = 2000;
    pointer.directionChange = 2;
    physics.tipSpeed = 5000;
    physics.tipAccelMagnitude = 100000;
    physics.handleSpeed = 1000;
    physics.tipKineticEnergy = 200;
    expect(detector.update(pointer, physics, 1)).toBe(false);
  });
});
