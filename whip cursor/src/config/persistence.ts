import type { AppConfig } from './types';
import { DEFAULT_CONFIG } from './defaults';
import { cloneConfig, mergeConfig } from './presets';

/** Bump when persisted shape is incompatible. */
export const SETTINGS_VERSION = 1;
export const SETTINGS_KEY = 'whip-cursor-settings';

export interface PersistedSettings {
  settingsVersion: number;
  config: AppConfig;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function probeStorage(): StorageLike | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const k = '__whip_probe';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return localStorage;
  } catch {
    return null;
  }
}

function clamp(n: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function asFinite(n: unknown, fallback: number): number {
  return typeof n === 'number' && Number.isFinite(n) ? n : fallback;
}

function asBool(v: unknown, fallback: boolean): boolean {
  return typeof v === 'boolean' ? v : fallback;
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' ? (v as Record<string, unknown>) : {};
}

/**
 * Merge unknown stored JSON onto defaults and clamp to safe ranges.
 * Invalid data never throws.
 */
export function sanitizeStoredConfig(raw: unknown): AppConfig {
  const d = DEFAULT_CONFIG;
  const src = asRecord(raw);
  const whipIn = asRecord(src.whip);
  const physIn = asRecord(src.physics);
  const motIn = asRecord(src.motion);
  const audIn = asRecord(src.audio);

  const massCurve =
    physIn.massCurve === 'linear' || physIn.massCurve === 'exponential' || physIn.massCurve === 'smooth'
      ? physIn.massCurve
      : d.physics.massCurve;

  const merged = mergeConfig(d, {
    whip: {
      length: clamp(asFinite(whipIn.length, d.whip.length), 80, 480, d.whip.length),
      thickness: clamp(asFinite(whipIn.thickness, d.whip.thickness), 3, 14, d.whip.thickness),
      gripSize: clamp(asFinite(whipIn.gripSize, d.whip.gripSize), 4, 18, d.whip.gripSize),
      nodeCount: clamp(asFinite(whipIn.nodeCount, d.whip.nodeCount), 8, 48, d.whip.nodeCount) | 0,
    },
    physics: {
      mass: clamp(asFinite(physIn.mass, d.physics.mass), 0.3, 2.5, d.physics.mass),
      massCurve,
      gravity: clamp(asFinite(physIn.gravity, d.physics.gravity), 0, 4000, d.physics.gravity),
      friction: clamp(asFinite(physIn.friction, d.physics.friction), 0, 0.1, d.physics.friction),
      damping: clamp(asFinite(physIn.damping, d.physics.damping), 0, 0.4, d.physics.damping),
      stiffness: clamp(asFinite(physIn.stiffness, d.physics.stiffness), 0.4, 1, d.physics.stiffness),
      iterations: clamp(asFinite(physIn.iterations, d.physics.iterations), 1, 12, d.physics.iterations) | 0,
      timestep: d.physics.timestep,
      maxAccumulatedTime: d.physics.maxAccumulatedTime,
    },
    motion: {
      followStrength: clamp(
        asFinite(motIn.followStrength, d.motion.followStrength),
        0.5,
        1,
        d.motion.followStrength,
      ),
      velocityResponse: clamp(
        asFinite(motIn.velocityResponse, d.motion.velocityResponse),
        0,
        1,
        d.motion.velocityResponse,
      ),
      tipSensitivity: clamp(
        asFinite(motIn.tipSensitivity, d.motion.tipSensitivity),
        1,
        3,
        d.motion.tipSensitivity,
      ),
    },
    audio: {
      crackEnabled: asBool(audIn.crackEnabled, d.audio.crackEnabled),
      crackSensitivity: clamp(
        asFinite(audIn.crackSensitivity, d.audio.crackSensitivity),
        0.1,
        1,
        d.audio.crackSensitivity,
      ),
      volume: clamp(asFinite(audIn.volume, d.audio.volume), 0, 1, d.audio.volume),
      cooldown: clamp(asFinite(audIn.cooldown, d.audio.cooldown), 0.1, 2, d.audio.cooldown),
    },
    debug: { ...d.debug, enabled: false },
  });

  return merged;
}

export function loadSettings(storage: StorageLike | null = probeStorage()): AppConfig {
  const fallback = cloneConfig(DEFAULT_CONFIG);
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(SETTINGS_KEY);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return fallback;
    const bag = parsed as { settingsVersion?: unknown; config?: unknown };
    const version = asFinite(bag.settingsVersion as number, 0);
    if (version !== SETTINGS_VERSION) return fallback;
    return sanitizeStoredConfig(bag.config);
  } catch {
    return fallback;
  }
}

export function saveSettings(config: AppConfig, storage: StorageLike | null = probeStorage()): boolean {
  if (!storage) return false;
  try {
    const payload: PersistedSettings = {
      settingsVersion: SETTINGS_VERSION,
      config: {
        ...cloneConfig(config),
        debug: { ...DEFAULT_CONFIG.debug, enabled: false },
      },
    };
    storage.setItem(SETTINGS_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function clearSettings(storage: StorageLike | null = probeStorage()): void {
  try {
    storage?.removeItem(SETTINGS_KEY);
  } catch {
    /* ignore */
  }
}
