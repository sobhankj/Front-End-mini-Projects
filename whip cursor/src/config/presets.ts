import type { AppConfig, ConfigPatch, PresetId } from './types';
import { DEFAULT_CONFIG } from './defaults';

/** Deep-merge a patch onto a base config (shallow per section). */
export function mergeConfig(base: AppConfig, patch: ConfigPatch): AppConfig {
  return {
    whip: { ...base.whip, ...patch.whip },
    physics: { ...base.physics, ...patch.physics },
    motion: { ...base.motion, ...patch.motion },
    audio: { ...base.audio, ...patch.audio },
    debug: { ...base.debug, ...patch.debug },
  };
}

export function cloneConfig(config: AppConfig): AppConfig {
  return {
    whip: { ...config.whip },
    physics: { ...config.physics },
    motion: { ...config.motion },
    audio: { ...config.audio },
    debug: { ...config.debug },
  };
}

/**
 * Coherent physical profiles — each preset changes a related set of knobs.
 */
export const PRESET_PATCHES: Record<PresetId, ConfigPatch> = {
  classic: {},

  /** More inertia, slower response, thicker presence. */
  heavy: {
    whip: { length: 330, thickness: 10, gripSize: 11, nodeCount: 30 },
    physics: {
      mass: 1.7,
      massCurve: 'smooth',
      gravity: 2100,
      friction: 0.008,
      damping: 0.034,
      stiffness: 0.74,
      iterations: 8,
    },
    motion: { followStrength: 1, velocityResponse: 0.38, tipSensitivity: 1.4 },
    audio: { crackSensitivity: 0.48, cooldown: 0.45 },
  },

  /** Quick, low momentum, sharp tip. */
  light: {
    whip: { length: 230, thickness: 5.5, gripSize: 7.5, nodeCount: 24 },
    physics: {
      mass: 0.5,
      massCurve: 'exponential',
      gravity: 1500,
      friction: 0.0035,
      damping: 0.042,
      stiffness: 0.82,
      iterations: 7,
    },
    motion: { followStrength: 1, velocityResponse: 0.58, tipSensitivity: 2.1 },
    audio: { crackSensitivity: 0.58, cooldown: 0.32 },
  },

  /** Energetic, high coupling, settles after bursts. */
  fast: {
    whip: { length: 250, thickness: 6.5, gripSize: 8, nodeCount: 26 },
    physics: {
      mass: 0.68,
      massCurve: 'smooth',
      gravity: 1700,
      friction: 0.005,
      damping: 0.048,
      stiffness: 0.84,
      iterations: 8,
    },
    motion: { followStrength: 1, velocityResponse: 0.62, tipSensitivity: 2.0 },
    audio: { crackSensitivity: 0.5, cooldown: 0.32 },
  },

  /** Short, stiff, strong directional response. */
  snappy: {
    whip: { length: 200, thickness: 6, gripSize: 8, nodeCount: 22 },
    physics: {
      mass: 0.62,
      massCurve: 'exponential',
      gravity: 1900,
      friction: 0.007,
      damping: 0.052,
      stiffness: 0.88,
      iterations: 8,
    },
    motion: { followStrength: 1, velocityResponse: 0.6, tipSensitivity: 2.2 },
    audio: { crackSensitivity: 0.44, cooldown: 0.3 },
  },

  /** Long, flexible, delayed waves. */
  loose: {
    whip: { length: 350, thickness: 7.5, gripSize: 9, nodeCount: 32 },
    physics: {
      mass: 0.85,
      massCurve: 'linear',
      gravity: 2000,
      friction: 0.003,
      damping: 0.028,
      stiffness: 0.7,
      iterations: 6,
    },
    motion: { followStrength: 1, velocityResponse: 0.42, tipSensitivity: 1.55 },
    audio: { crackSensitivity: 0.55, cooldown: 0.42 },
  },
};

export function getPresetConfig(id: PresetId): AppConfig {
  return mergeConfig(DEFAULT_CONFIG, PRESET_PATCHES[id]);
}

export const PRESET_LABELS: Record<PresetId, string> = {
  classic: 'Classic',
  heavy: 'Heavy',
  light: 'Light',
  fast: 'Fast',
  snappy: 'Snappy',
  loose: 'Loose',
};

export const PRESET_IDS: PresetId[] = [
  'classic',
  'heavy',
  'light',
  'fast',
  'snappy',
  'loose',
];

export type PresetSelection = PresetId | 'custom';

const MATCH_EPS = 0.0015;

function nearlyEqual(a: number, b: number): boolean {
  return Math.abs(a - b) <= MATCH_EPS;
}

/** User-facing fields only — debug overlay is ignored. */
export function sameUserConfig(a: AppConfig, b: AppConfig): boolean {
  const wa = a.whip;
  const wb = b.whip;
  if (wa.length !== wb.length || wa.thickness !== wb.thickness) return false;
  if (wa.gripSize !== wb.gripSize || wa.nodeCount !== wb.nodeCount) return false;

  const pa = a.physics;
  const pb = b.physics;
  if (!nearlyEqual(pa.mass, pb.mass) || pa.massCurve !== pb.massCurve) return false;
  if (!nearlyEqual(pa.gravity, pb.gravity) || !nearlyEqual(pa.friction, pb.friction)) return false;
  if (!nearlyEqual(pa.damping, pb.damping) || !nearlyEqual(pa.stiffness, pb.stiffness)) {
    return false;
  }
  if (pa.iterations !== pb.iterations) return false;

  const ma = a.motion;
  const mb = b.motion;
  if (!nearlyEqual(ma.followStrength, mb.followStrength)) return false;
  if (!nearlyEqual(ma.velocityResponse, mb.velocityResponse)) return false;
  if (!nearlyEqual(ma.tipSensitivity, mb.tipSensitivity)) return false;

  const aa = a.audio;
  const ab = b.audio;
  if (aa.crackEnabled !== ab.crackEnabled) return false;
  if (!nearlyEqual(aa.crackSensitivity, ab.crackSensitivity)) return false;
  if (!nearlyEqual(aa.volume, ab.volume) || !nearlyEqual(aa.cooldown, ab.cooldown)) return false;
  return true;
}

export function identifyPreset(config: AppConfig): PresetSelection {
  for (let i = 0; i < PRESET_IDS.length; i++) {
    const id = PRESET_IDS[i];
    if (sameUserConfig(config, getPresetConfig(id))) return id;
  }
  return 'custom';
}

/** Lightweight validity check used by tests. */
export function assertPresetCoherent(id: PresetId): string[] {
  const c = getPresetConfig(id);
  const issues: string[] = [];
  if (c.whip.nodeCount < 8) issues.push('nodeCount too low');
  if (c.whip.length < 80) issues.push('length too short');
  if (c.physics.stiffness < 0.4 || c.physics.stiffness > 1) issues.push('stiffness out of range');
  if (c.physics.damping < 0 || c.physics.damping > 0.5) issues.push('damping out of range');
  if (c.motion.followStrength < 0.5) issues.push('followStrength too soft for handle latency');
  if (c.physics.iterations < 1 || c.physics.iterations > 12) issues.push('iterations out of range');
  return issues;
}
