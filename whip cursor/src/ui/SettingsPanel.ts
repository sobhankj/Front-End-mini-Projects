import type { AppConfig, PresetId } from '../config/types';
import type { ConfigStore } from '../config/ConfigStore';
import {
  PRESET_IDS,
  PRESET_LABELS,
  cloneConfig,
  getPresetConfig,
  identifyPreset,
  type PresetSelection,
} from '../config/presets';
import { DEFAULT_CONFIG } from '../config/defaults';

interface SliderDef {
  section: keyof AppConfig;
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

const SLIDERS: SliderDef[] = [
  { section: 'whip', key: 'length', label: 'Length', min: 120, max: 480, step: 1, unit: 'px' },
  { section: 'whip', key: 'thickness', label: 'Thickness', min: 3, max: 14, step: 0.5, unit: 'px' },
  { section: 'whip', key: 'gripSize', label: 'Grip Size', min: 4, max: 18, step: 0.5, unit: 'px' },
  { section: 'physics', key: 'mass', label: 'Mass', min: 0.3, max: 2.5, step: 0.05 },
  { section: 'physics', key: 'gravity', label: 'Gravity', min: 0, max: 4000, step: 20 },
  { section: 'physics', key: 'damping', label: 'Damping', min: 0, max: 0.4, step: 0.01 },
  { section: 'physics', key: 'friction', label: 'Friction', min: 0, max: 0.1, step: 0.001 },
  { section: 'physics', key: 'stiffness', label: 'Stiffness', min: 0.4, max: 1, step: 0.01 },
  { section: 'physics', key: 'iterations', label: 'Iterations', min: 1, max: 10, step: 1 },
  { section: 'motion', key: 'followStrength', label: 'Follow Strength', min: 0.5, max: 1, step: 0.01 },
  { section: 'motion', key: 'velocityResponse', label: 'Velocity Response', min: 0, max: 1, step: 0.01 },
  { section: 'motion', key: 'tipSensitivity', label: 'Tip Sensitivity', min: 1, max: 3, step: 0.05 },
  { section: 'audio', key: 'crackSensitivity', label: 'Crack Sensitivity', min: 0.1, max: 1, step: 0.01 },
  { section: 'audio', key: 'volume', label: 'Volume', min: 0, max: 1, step: 0.01 },
];

/**
 * Settings panel — mutates ConfigStore only; never touches physics objects.
 */
export class SettingsPanel {
  readonly root: HTMLElement;
  private store: ConfigStore;
  private valueLabels = new Map<string, HTMLElement>();
  private onReset: (() => void) | null = null;
  private collapsed = true;
  private advanced = false;
  private presetButtons = new Map<PresetId, HTMLButtonElement>();
  private statusEl: HTMLElement | null = null;
  private advancedBtn: HTMLButtonElement | null = null;
  private advancedRoot: HTMLElement | null = null;
  private debugBanner: HTMLElement | null = null;
  private crackCb: HTMLInputElement | null = null;
  private debugCb: HTMLInputElement | null = null;
  private toggleBtn: HTMLButtonElement | null = null;

  constructor(parent: HTMLElement, store: ConfigStore) {
    this.store = store;
    this.root = document.createElement('aside');
    this.root.className = 'settings-panel collapsed';
    this.root.setAttribute('aria-label', 'Whip settings');
    parent.appendChild(this.root);
    this.build();
    store.subscribe(() => this.syncFromStore());
  }

  setResetHandler(fn: () => void): void {
    this.onReset = fn;
  }

  /** Restore product defaults and ask the app to reset pose. */
  resetToDefaults(): void {
    const next = cloneConfig(DEFAULT_CONFIG);
    next.debug.enabled = false;
    this.store.set(next);
    this.onReset?.();
  }

  private build(): void {
    this.root.innerHTML = '';
    this.presetButtons.clear();
    this.valueLabels.clear();

    const header = el('div', 'settings-header');
    const titleWrap = el('div', 'settings-title-wrap');
    const title = el('h1', '', 'WHIP');
    this.statusEl = el('p', 'preset-status', 'Classic');
    titleWrap.append(title, this.statusEl);

    this.debugBanner = el('span', 'debug-banner', 'Debug');
    this.debugBanner.hidden = true;

    this.toggleBtn = el('button', 'settings-toggle', 'Settings') as HTMLButtonElement;
    this.toggleBtn.type = 'button';
    this.toggleBtn.setAttribute('aria-expanded', 'false');
    this.toggleBtn.addEventListener('click', () => this.setCollapsed(!this.collapsed));

    header.append(titleWrap, this.debugBanner, this.toggleBtn);
    this.root.appendChild(header);

    const body = el('div', 'settings-body');

    body.appendChild(sectionTitle('Presets'));
    const presets = el('div', 'preset-grid');
    presets.setAttribute('role', 'group');
    presets.setAttribute('aria-label', 'Presets');
    for (const id of PRESET_IDS) {
      const btn = el('button', 'preset-btn', PRESET_LABELS[id]) as HTMLButtonElement;
      btn.type = 'button';
      btn.dataset.preset = id;
      btn.addEventListener('click', () => {
        const next = getPresetConfig(id);
        next.debug = { ...this.store.get().debug };
        this.store.set(next);
      });
      this.presetButtons.set(id, btn);
      presets.appendChild(btn);
    }
    body.appendChild(presets);

    body.appendChild(sectionTitle('Whip'));
    this.appendSliders(body, ['length', 'thickness', 'gripSize']);

    body.appendChild(sectionTitle('Physics'));
    this.appendSliders(body, ['mass', 'gravity']);

    body.appendChild(sectionTitle('Audio'));
    this.crackCb = this.appendCheck(
      body,
      'crack-enabled',
      'Enable Crack',
      this.store.get().audio.crackEnabled,
      (on) => this.store.patch({ audio: { crackEnabled: on } }),
    );
    this.appendSliders(body, ['volume']);

    this.advancedBtn = el('button', 'advanced-toggle', 'Advanced') as HTMLButtonElement;
    this.advancedBtn.type = 'button';
    this.advancedBtn.setAttribute('aria-expanded', 'false');
    this.advancedBtn.addEventListener('click', () => this.setAdvanced(!this.advanced));
    body.appendChild(this.advancedBtn);

    this.advancedRoot = el('div', 'settings-advanced');
    this.advancedRoot.hidden = true;

    this.advancedRoot.appendChild(sectionTitle('Physics'));
    this.appendSliders(this.advancedRoot, ['damping', 'friction', 'stiffness', 'iterations']);

    this.advancedRoot.appendChild(sectionTitle('Motion'));
    this.appendSliders(this.advancedRoot, ['followStrength', 'velocityResponse', 'tipSensitivity']);

    this.advancedRoot.appendChild(sectionTitle('Audio'));
    this.appendSliders(this.advancedRoot, ['crackSensitivity']);

    this.advancedRoot.appendChild(sectionTitle('Developer'));
    this.debugCb = this.appendCheck(
      this.advancedRoot,
      'debug-enabled',
      'Debug overlay',
      this.store.get().debug.enabled,
      (on) => this.store.patch({ debug: { enabled: on } }),
    );

    body.appendChild(this.advancedRoot);

    const actions = el('div', 'settings-actions');
    const resetBtn = el('button', 'action-btn', 'Reset') as HTMLButtonElement;
    resetBtn.type = 'button';
    resetBtn.title = 'Restore default settings (R)';
    resetBtn.addEventListener('click', () => this.resetToDefaults());
    actions.appendChild(resetBtn);
    body.appendChild(actions);

    const hint = el(
      'p',
      'settings-hint',
      'Click once to enable sound · flick to crack',
    );
    body.appendChild(hint);

    this.root.appendChild(body);
    this.syncFromStore();
  }

  private setCollapsed(collapsed: boolean): void {
    this.collapsed = collapsed;
    this.root.classList.toggle('collapsed', collapsed);
    if (this.toggleBtn) {
      this.toggleBtn.textContent = collapsed ? 'Settings' : 'Hide';
      this.toggleBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }
  }

  private setAdvanced(advanced: boolean): void {
    this.advanced = advanced;
    if (this.advancedRoot) this.advancedRoot.hidden = !advanced;
    if (this.advancedBtn) {
      this.advancedBtn.textContent = advanced ? 'Advanced –' : 'Advanced';
      this.advancedBtn.setAttribute('aria-expanded', advanced ? 'true' : 'false');
    }
  }

  private appendCheck(
    parent: HTMLElement,
    id: string,
    label: string,
    checked: boolean,
    onChange: (on: boolean) => void,
  ): HTMLInputElement {
    const row = el('label', 'check-row');
    row.htmlFor = id;
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = id;
    cb.checked = checked;
    cb.addEventListener('change', () => onChange(cb.checked));
    row.append(cb, document.createTextNode(' ' + label));
    parent.appendChild(row);
    return cb;
  }

  private appendSliders(parent: HTMLElement, keys: string[]): void {
    for (const def of SLIDERS) {
      if (!keys.includes(def.key)) continue;
      const id = `whip-${def.section}-${def.key}`;
      const row = el('div', 'slider-row');
      const top = el('div', 'slider-top');
      const name = el('label', '', def.label);
      name.setAttribute('for', id);
      const val = el('span', 'slider-value');
      this.valueLabels.set(`${def.section}.${def.key}`, val);
      top.append(name, val);

      const input = document.createElement('input');
      input.type = 'range';
      input.id = id;
      input.min = String(def.min);
      input.max = String(def.max);
      input.step = String(def.step);
      input.dataset.section = def.section;
      input.dataset.key = def.key;
      input.dataset.unit = def.unit ?? '';
      input.setAttribute('aria-valuemin', String(def.min));
      input.setAttribute('aria-valuemax', String(def.max));

      const section = this.store.get()[def.section] as unknown as Record<string, number>;
      input.value = String(section[def.key]);
      val.textContent = formatVal(section[def.key], def.unit);

      input.addEventListener('input', () => {
        const num = Number(input.value);
        val.textContent = formatVal(num, def.unit);
        input.setAttribute('aria-valuenow', String(num));
        this.store.patch({ [def.section]: { [def.key]: num } } as never);
      });

      row.append(top, input);
      parent.appendChild(row);
    }
  }

  private syncFromStore(): void {
    const cfg = this.store.get();
    const selection = identifyPreset(cfg);
    this.renderPresetState(selection);

    const inputs = this.root.querySelectorAll<HTMLInputElement>('input[type="range"]');
    inputs.forEach((input) => {
      const section = input.dataset.section as keyof AppConfig;
      const key = input.dataset.key!;
      const unit = input.dataset.unit || undefined;
      const value = (cfg[section] as unknown as Record<string, number>)[key];
      if (value !== undefined && input.value !== String(value)) {
        input.value = String(value);
      }
      if (value !== undefined) input.setAttribute('aria-valuenow', String(value));
      const label = this.valueLabels.get(`${section}.${key}`);
      if (label) label.textContent = formatVal(value, unit);
    });

    if (this.crackCb) this.crackCb.checked = cfg.audio.crackEnabled;
    if (this.debugCb) this.debugCb.checked = cfg.debug.enabled;
    if (this.debugBanner) this.debugBanner.hidden = !cfg.debug.enabled;
    this.root.classList.toggle('is-debug', cfg.debug.enabled);
  }

  private renderPresetState(selection: PresetSelection): void {
    for (const [id, btn] of this.presetButtons) {
      const on = selection === id;
      btn.classList.toggle('is-selected', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    if (this.statusEl) {
      this.statusEl.textContent = selection === 'custom' ? 'Custom' : PRESET_LABELS[selection];
      this.statusEl.classList.toggle('is-custom', selection === 'custom');
    }
  }
}

function sectionTitle(text: string): HTMLElement {
  const h = el('h2', '', text);
  return h;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatVal(n: number, unit?: string): string {
  if (!Number.isFinite(n)) return '—';
  let text: string;
  if (Math.abs(n) >= 100 || Number.isInteger(n)) text = String(Math.round(n * 1000) / 1000);
  else text = n.toFixed(n < 0.01 && n !== 0 ? 3 : 2);
  return unit ? `${text} ${unit}` : text;
}
