import { describe, it, expect } from 'vitest';
import { cloneConfig } from './presets';
import { DEFAULT_CONFIG } from './defaults';
import {
  SETTINGS_KEY,
  SETTINGS_VERSION,
  clearSettings,
  loadSettings,
  saveSettings,
  sanitizeStoredConfig,
} from './persistence';
import type { StorageLike } from './persistence';

class MemoryStorage implements StorageLike {
  private data = new Map<string, string>();
  getItem(key: string): string | null {
    return this.data.has(key) ? this.data.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
}

describe('settings persistence', () => {
  it('returns defaults when storage is empty', () => {
    const mem = new MemoryStorage();
    const cfg = loadSettings(mem);
    expect(cfg.whip.length).toBe(DEFAULT_CONFIG.whip.length);
    expect(cfg.debug.enabled).toBe(false);
  });

  it('round-trips user settings and strips debug', () => {
    const mem = new MemoryStorage();
    const cfg = cloneConfig(DEFAULT_CONFIG);
    cfg.whip.length = 240;
    cfg.debug.enabled = true;
    expect(saveSettings(cfg, mem)).toBe(true);
    const loaded = loadSettings(mem);
    expect(loaded.whip.length).toBe(240);
    expect(loaded.debug.enabled).toBe(false);
  });

  it('falls back on invalid JSON', () => {
    const mem = new MemoryStorage();
    mem.setItem(SETTINGS_KEY, '{not json');
    expect(loadSettings(mem).whip.nodeCount).toBe(DEFAULT_CONFIG.whip.nodeCount);
  });

  it('falls back on version mismatch', () => {
    const mem = new MemoryStorage();
    mem.setItem(
      SETTINGS_KEY,
      JSON.stringify({ settingsVersion: SETTINGS_VERSION + 9, config: { whip: { length: 200 } } }),
    );
    expect(loadSettings(mem).whip.length).toBe(DEFAULT_CONFIG.whip.length);
  });

  it('clamps out-of-range values', () => {
    const cfg = sanitizeStoredConfig({
      whip: { length: 99999, nodeCount: 2 },
      physics: { stiffness: 9, gravity: -40 },
    });
    expect(cfg.whip.length).toBeLessThanOrEqual(480);
    expect(cfg.whip.nodeCount).toBeGreaterThanOrEqual(8);
    expect(cfg.physics.stiffness).toBeLessThanOrEqual(1);
    expect(cfg.physics.gravity).toBe(0);
  });

  it('survives missing storage', () => {
    expect(loadSettings(null).whip.length).toBe(DEFAULT_CONFIG.whip.length);
    expect(saveSettings(DEFAULT_CONFIG, null)).toBe(false);
    expect(() => clearSettings(null)).not.toThrow();
  });
});
