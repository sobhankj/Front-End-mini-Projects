import type { AppConfig, ConfigPatch } from './types';
import { DEFAULT_CONFIG } from './defaults';
import { cloneConfig, mergeConfig } from './presets';

type Listener = (config: AppConfig) => void;

/**
 * Mutable configuration store.
 * UI writes patches; physics/render subscribe or poll the current snapshot.
 */
export class ConfigStore {
  private config: AppConfig;
  private listeners: Listener[] = [];

  constructor(initial: AppConfig = DEFAULT_CONFIG) {
    this.config = cloneConfig(initial);
  }

  get(): AppConfig {
    return this.config;
  }

  /** Replace entire config (e.g. presets). */
  set(config: AppConfig): void {
    this.config = cloneConfig(config);
    this.notify();
  }

  /** Patch one or more sections safely. */
  patch(patch: ConfigPatch): void {
    this.config = mergeConfig(this.config, patch);
    this.notify();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      const i = this.listeners.indexOf(listener);
      if (i >= 0) this.listeners.splice(i, 1);
    };
  }

  private notify(): void {
    const snapshot = this.config;
    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i](snapshot);
    }
  }
}
