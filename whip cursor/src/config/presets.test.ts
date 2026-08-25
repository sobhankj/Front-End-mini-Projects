import { describe, it, expect } from 'vitest';
import { DEFAULT_CONFIG } from './defaults';
import { cloneConfig, getPresetConfig, identifyPreset, sameUserConfig } from './presets';

describe('identifyPreset', () => {
  it('maps defaults to classic', () => {
    expect(identifyPreset(DEFAULT_CONFIG)).toBe('classic');
  });

  it('recognizes named presets', () => {
    expect(identifyPreset(getPresetConfig('heavy'))).toBe('heavy');
    expect(identifyPreset(getPresetConfig('snappy'))).toBe('snappy');
    expect(identifyPreset(getPresetConfig('loose'))).toBe('loose');
  });

  it('returns custom after a user-facing change', () => {
    const cfg = cloneConfig(DEFAULT_CONFIG);
    cfg.whip.length = 310;
    expect(identifyPreset(cfg)).toBe('custom');
  });

  it('ignores debug overlay when matching', () => {
    const cfg = cloneConfig(DEFAULT_CONFIG);
    cfg.debug.enabled = true;
    expect(identifyPreset(cfg)).toBe('classic');
    expect(sameUserConfig(cfg, DEFAULT_CONFIG)).toBe(true);
  });
});
