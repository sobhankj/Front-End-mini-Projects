import type { AppConfig } from './types';

/**
 * Default product configuration.
 *
 * Screen-space Verlet rope — values are tuned for a lively hanging whip cursor,
 * not SI units:
 * - gravity ~1800 px/s²: tail hangs and pendulum-swings (110 was visually dead)
 * - damping 0.038 / friction 0.004: settles after flicks without killing waves
 * - stiffness 0.78 / iterations 8: inextensible enough, still bends
 * - followStrength 1: handle is the cursor (zero offset)
 * - velocityResponse 0.52: first-segment coupling into the chain
 * - tipSensitivity 1.75: mass-curve steepness only (no tip ×velocity)
 */
export const DEFAULT_CONFIG: AppConfig = {
  whip: {
    length: 290,
    thickness: 8,
    gripSize: 9,
    nodeCount: 28,
  },
  physics: {
    mass: 1,
    massCurve: 'smooth',
    gravity: 1800,
    friction: 0.004,
    damping: 0.038,
    stiffness: 0.78,
    iterations: 8,
    timestep: 1 / 120,
    maxAccumulatedTime: 0.1,
  },
  motion: {
    followStrength: 1,
    velocityResponse: 0.52,
    tipSensitivity: 1.75,
  },
  audio: {
    crackEnabled: true,
    crackSensitivity: 0.62,
    volume: 0.7,
    cooldown: 0.35,
  },
  debug: {
    enabled: false,
    showNodes: true,
    showConstraints: true,
    showVelocityVectors: false,
    showTarget: true,
    showTip: true,
  },
};
