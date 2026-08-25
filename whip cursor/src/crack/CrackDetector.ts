import type { AudioConfig } from '../config/types';
import type { PointerTracker } from '../input/PointerTracker';
import type { WhipPhysics } from '../physics/WhipPhysics';

export interface CrackSignals {
  mouseSpeed: number;
  mouseAccel: number;
  handleSpeed: number;
  tipSpeed: number;
  tipAccel: number;
  tipHandleRatio: number;
  directionChange: number;
  chainEnergy: number;
  tipEnergy: number;
  score: number;
  threshold: number;
  cooldownRemaining: number;
  eligible: boolean;
}

/**
 * Multi-signal crack detector biased toward physical tip behavior.
 * Mouse speed alone cannot trigger a crack.
 */
export class CrackDetector {
  active = false;
  lastCrackTime = 0;
  lastScore = 0;
  lastThreshold = 0;
  lastEligible = false;
  lastSignals: CrackSignals = {
    mouseSpeed: 0,
    mouseAccel: 0,
    handleSpeed: 0,
    tipSpeed: 0,
    tipAccel: 0,
    tipHandleRatio: 0,
    directionChange: 0,
    chainEnergy: 0,
    tipEnergy: 0,
    score: 0,
    threshold: 0,
    cooldownRemaining: 0,
    eligible: false,
  };

  private wasAbove = false;
  private config: AudioConfig;

  constructor(config: AudioConfig) {
    this.config = config;
  }

  applyConfig(config: AudioConfig): void {
    this.config = config;
  }

  /**
   * Evaluate crack for this frame. Returns true once per crack event.
   */
  update(pointer: PointerTracker, physics: WhipPhysics, nowSeconds: number): boolean {
    this.active = false;
    if (!this.config.crackEnabled) {
      this.wasAbove = false;
      this.lastEligible = false;
      return false;
    }

    const sens = Math.max(0.05, Math.min(1, this.config.crackSensitivity));
    // Higher sensitivity → lower threshold
    const threshold = 1.25 - sens * 0.7;
    this.lastThreshold = threshold;

    const mouseSpeed = pointer.speed;
    const mouseAccel = pointer.accelMagnitude;
    const handleSpeed = physics.handleSpeed;
    const tipSpeed = physics.tipSpeed;
    const tipAccel = physics.tipAccelMagnitude;
    const directionChange = pointer.directionChange;
    const chainEnergy = physics.totalKineticEnergy;
    const tipEnergy = physics.tipKineticEnergy;
    const tipHandleRatio = handleSpeed > 40 ? tipSpeed / handleSpeed : tipSpeed > 800 ? 2 : 0;

    const cooldownRemaining = Math.max(0, this.config.cooldown - (nowSeconds - this.lastCrackTime));
    const cooledDown = cooldownRemaining <= 0;

    // Score heavily weights tip physics; mouse is supporting context only
    const score =
      tipSpeed * 0.00042 +
      tipAccel * 0.00001 +
      tipEnergy * 0.0025 +
      chainEnergy * 0.00015 +
      tipHandleRatio * 0.22 +
      directionChange * tipSpeed * 0.00028 +
      handleSpeed * 0.00004 +
      mouseSpeed * 0.00005 +
      mouseAccel * 0.000002;

    this.lastScore = score;

    // Hard gates — tip-centric; mouse speed alone fails
    const tipFast = tipSpeed > 900 * (1.22 - sens * 0.5);
    const tipWhips = tipHandleRatio > 1.12 || tipAccel > 16000 * (1.1 - sens * 0.4);
    const flickDir = directionChange > 0.32 || tipAccel > 22000;
    const tipSnap = tipSpeed > 1500 && (tipHandleRatio > 1.18 || tipAccel > 14000);
    const notJustMouse = tipSpeed > mouseSpeed * 0.45 || tipEnergy > 28;
    const hasMotion = handleSpeed > 180 || mouseSpeed > 280;

    const eligible =
      score >= threshold &&
      tipFast &&
      notJustMouse &&
      hasMotion &&
      cooledDown &&
      (tipSnap || (tipWhips && flickDir));

    this.lastEligible = eligible;
    this.lastSignals = {
      mouseSpeed,
      mouseAccel,
      handleSpeed,
      tipSpeed,
      tipAccel,
      tipHandleRatio,
      directionChange,
      chainEnergy,
      tipEnergy,
      score,
      threshold,
      cooldownRemaining,
      eligible,
    };

    const exit = threshold * 0.5;
    let triggered = false;

    if (!this.wasAbove && eligible) {
      triggered = true;
      this.active = true;
      this.lastCrackTime = nowSeconds;
      this.wasAbove = true;
    } else if (score < exit) {
      this.wasAbove = false;
    } else if (score >= threshold) {
      this.wasAbove = true;
    }

    return triggered;
  }
}
