import type { AppConfig } from '../config/types';

/**
 * Phase 3 production defaults — frozen baseline for Phase 4 comparisons.
 * Do not mutate; clone before applying experimental patches.
 */
export const PHASE3_BASELINE: Readonly<AppConfig> = Object.freeze({
  whip: Object.freeze({
    length: 300,
    thickness: 8,
    gripSize: 9,
    nodeCount: 30,
  }),
  physics: Object.freeze({
    mass: 1,
    massCurve: 'smooth' as const,
    gravity: 130,
    friction: 0.005,
    damping: 0.036,
    stiffness: 0.84,
    iterations: 6,
    timestep: 1 / 120,
    maxAccumulatedTime: 0.1,
  }),
  motion: Object.freeze({
    followStrength: 1,
    velocityResponse: 0.48,
    tipSensitivity: 1.8,
  }),
  audio: Object.freeze({
    crackEnabled: true,
    crackSensitivity: 0.52,
    volume: 0.42,
    cooldown: 0.38,
  }),
  debug: Object.freeze({
    enabled: false,
    showNodes: true,
    showConstraints: true,
    showVelocityVectors: false,
    showTarget: true,
    showTip: true,
  }),
});

export function baselinePhysicsSummary(): Record<string, number | string> {
  const b = PHASE3_BASELINE;
  return {
    gravity: b.physics.gravity,
    damping: b.physics.damping,
    friction: b.physics.friction,
    stiffness: b.physics.stiffness,
    velocityResponse: b.motion.velocityResponse,
    followStrength: b.motion.followStrength,
    tipSensitivity: b.motion.tipSensitivity,
    length: b.whip.length,
    nodeCount: b.whip.nodeCount,
    thickness: b.whip.thickness,
    massCurve: b.physics.massCurve,
    iterations: b.physics.iterations,
  };
}
