import { ConfigStore } from './config/ConfigStore';
import type { AppConfig } from './config/types';
import { loadSettings, saveSettings } from './config/persistence';
import { PointerTracker } from './input/PointerTracker';
import { WhipPhysics } from './physics/WhipPhysics';
import { AnimationLoop } from './loop/AnimationLoop';
import { FPSMonitor } from './loop/FPSMonitor';
import { CanvasHost } from './render/CanvasHost';
import { WhipRenderer } from './render/WhipRenderer';
import { DebugOverlay } from './render/DebugOverlay';
import { CrackDetector } from './crack/CrackDetector';
import { CrackAudio } from './crack/CrackAudio';
import { SettingsPanel } from './ui/SettingsPanel';
import { prefersReducedMotion, onReducedMotionChange } from './utils/reducedMotion';
import { hasFinePointer, isCoarsePointerDevice } from './utils/touchDetection';
import { onVisibilityChange } from './utils/visibility';
import { setWhipCursorMode } from './utils/cursorMode';

/**
 * Application orchestrator.
 * Wiring only — physics, render, input, and UI stay independent.
 */
export class WhipApp {
  private store: ConfigStore;
  private pointer = new PointerTracker();
  private physics: WhipPhysics;
  private renderer: WhipRenderer;
  private debug: DebugOverlay;
  private crackDetector: CrackDetector;
  private crackAudio: CrackAudio;
  private loop = new AnimationLoop();
  private fps = new FPSMonitor();
  private canvas: CanvasHost | null = null;
  private panel: SettingsPanel | null = null;
  private reducedMotion = false;
  private whipEnabled = true;
  private audioPrimed = false;
  private hintDismissed = false;
  private hintOriginX = 0;
  private hintOriginY = 0;
  private hasHintOrigin = false;
  private persistTimer = 0;
  private cleanups: Array<() => void> = [];
  private lastPointerEventMs = 0;
  private hint: HTMLElement | null = null;

  private root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
    this.store = new ConfigStore(loadSettings());
    const cfg = this.store.get();
    this.physics = new WhipPhysics(cfg);
    this.renderer = new WhipRenderer(cfg);
    this.debug = new DebugOverlay(cfg);
    this.crackDetector = new CrackDetector(cfg.audio);
    this.crackAudio = new CrackAudio(cfg.audio);
  }

  start(): void {
    this.root.innerHTML = '';
    this.root.classList.add('whip-app');

    if (isCoarsePointerDevice() && !hasFinePointer()) {
      this.showTouchFallback();
      return;
    }

    const stage = document.createElement('div');
    stage.className = 'whip-stage';
    this.root.appendChild(stage);

    try {
      this.canvas = new CanvasHost(stage);
    } catch {
      this.showCapabilityFallback(
        'This browser cannot draw the whip. Canvas 2D support is required.',
      );
      return;
    }

    this.panel = new SettingsPanel(this.root, this.store);
    this.panel.setResetHandler(() => this.resetWhipPose());
    this.mountHint();

    const cx = window.innerWidth * 0.5;
    const cy = window.innerHeight * 0.35;
    this.physics.init(cx, cy);
    this.pointer.reset(cx, cy);

    this.reducedMotion = prefersReducedMotion();
    this.applyMotionPreference();

    this.bindInput();
    this.bindKeyboard();
    this.bindVisibility();
    this.bindConfig();
    this.bindReducedMotion();

    this.fps.begin(performance.now());
    setWhipCursorMode(true);

    this.loop.start((dt, nowMs) => this.frame(dt, nowMs));
  }

  private mountHint(): void {
    const hint = document.createElement('p');
    hint.className = 'move-hint';
    hint.textContent = 'Move your mouse';
    hint.setAttribute('aria-hidden', 'true');
    this.root.appendChild(hint);
    this.hint = hint;
  }

  private dismissHint(): void {
    if (this.hintDismissed) return;
    this.hintDismissed = true;
    this.hint?.classList.add('is-gone');
  }

  private showTouchFallback(): void {
    this.whipEnabled = false;
    const msg = document.createElement('div');
    msg.className = 'touch-fallback';
    msg.innerHTML =
      '<h1>WHIP</h1><p>This is a mouse-driven physics cursor. Touch-only devices cannot drive the simulation, so the whip stays off here.</p>';
    this.root.appendChild(msg);
  }

  private showCapabilityFallback(copy: string): void {
    this.whipEnabled = false;
    setWhipCursorMode(false);
    const msg = document.createElement('div');
    msg.className = 'capability-fallback';
    const h = document.createElement('h1');
    h.textContent = 'WHIP';
    const p = document.createElement('p');
    p.textContent = copy;
    msg.append(h, p);
    this.root.appendChild(msg);
  }

  private bindInput(): void {
    const onMove = (e: PointerEvent): void => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('.settings-panel')) return;

      this.pointer.update(e.clientX, e.clientY, e.timeStamp || performance.now());
      this.physics.setTarget(e.clientX, e.clientY);
      this.lastPointerEventMs = performance.now();
      this.noteHintMotion(e.clientX, e.clientY);
    };

    const onDown = (e: PointerEvent): void => {
      this.primeAudio();
      if ((e.target as HTMLElement | null)?.closest?.('.settings-panel')) return;
      this.pointer.update(e.clientX, e.clientY, e.timeStamp || performance.now());
      this.physics.setTarget(e.clientX, e.clientY);
      this.noteHintMotion(e.clientX, e.clientY);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('click', this.primeAudio, { passive: true });
    this.cleanups.push(() => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('click', this.primeAudio);
    });
  }

  private noteHintMotion(x: number, y: number): void {
    if (this.hintDismissed) return;
    if (!this.hasHintOrigin) {
      this.hintOriginX = x;
      this.hintOriginY = y;
      this.hasHintOrigin = true;
      return;
    }
    const dx = x - this.hintOriginX;
    const dy = y - this.hintOriginY;
    if (dx * dx + dy * dy > 400) this.dismissHint();
  }

  private primeAudio = (): void => {
    this.audioPrimed = true;
    void this.crackAudio.unlock();
  };

  private bindKeyboard(): void {
    const onKey = (e: KeyboardEvent): void => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isEditableTarget(e.target)) return;
      const key = e.key.toLowerCase();
      if (key === 'd') {
        e.preventDefault();
        const on = !this.store.get().debug.enabled;
        this.store.patch({ debug: { enabled: on } });
      } else if (key === 'r') {
        e.preventDefault();
        this.panel?.resetToDefaults();
      } else if (key === 'm') {
        e.preventDefault();
        this.primeAudio();
        this.store.patch({ audio: { crackEnabled: !this.store.get().audio.crackEnabled } });
      }
    };
    window.addEventListener('keydown', onKey);
    this.cleanups.push(() => window.removeEventListener('keydown', onKey));
  }

  private bindVisibility(): void {
    const off = onVisibilityChange(
      () => {
        this.physics.suspend();
        this.loop.resync();
      },
      () => {
        this.loop.resync();
        this.physics.resume();
        this.pointer.reset(this.physics.target.x, this.physics.target.y);
        if (this.audioPrimed) void this.crackAudio.unlock();
      },
    );
    this.cleanups.push(off);
  }

  private bindReducedMotion(): void {
    const off = onReducedMotionChange((reduced) => {
      this.reducedMotion = reduced;
      this.applyMotionPreference();
    });
    this.cleanups.push(off);
  }

  private applyMotionPreference(): void {
    document.documentElement.classList.toggle('reduced-motion', this.reducedMotion);
  }

  private bindConfig(): void {
    const off = this.store.subscribe((cfg) => this.onConfig(cfg));
    this.cleanups.push(off);
  }

  private onConfig(cfg: AppConfig): void {
    this.physics.applyConfig(cfg);
    this.renderer.applyConfig(cfg);
    this.debug.applyConfig(cfg);
    this.crackDetector.applyConfig(cfg.audio);
    this.crackAudio.applyConfig(cfg.audio);
    if (cfg.audio.crackEnabled && this.audioPrimed) void this.crackAudio.unlock();
    this.schedulePersist(cfg);
  }

  private schedulePersist(cfg: AppConfig): void {
    window.clearTimeout(this.persistTimer);
    this.persistTimer = window.setTimeout(() => {
      saveSettings(cfg);
    }, 160);
  }

  private resetWhipPose(): void {
    const x = this.pointer.position.x || window.innerWidth * 0.5;
    const y = this.pointer.position.y || window.innerHeight * 0.35;
    this.physics.resetTo(x, y);
  }

  private frame(dt: number, nowMs: number): void {
    if (!this.canvas || !this.whipEnabled) return;

    if (nowMs - this.lastPointerEventMs > 32) {
      this.pointer.decay(dt);
    }

    this.physics.update(dt);

    const nowSec = nowMs * 0.001;
    if (this.crackDetector.update(this.pointer, this.physics, nowSec)) {
      const intensity = Math.min(1.35, 0.55 + this.crackDetector.lastScore * 0.55);
      this.crackAudio.playCrack(intensity);
      const tip = this.physics.nodes[this.physics.nodes.length - 1];
      if (tip) {
        this.renderer.triggerCrackFlash(intensity, tip.position.x, tip.position.y);
      }
    }

    const ctx = this.canvas.ctx;
    this.canvas.clear();
    this.renderer.render(ctx, this.physics, dt);
    this.debug.render(ctx, this.physics, this.pointer, this.crackDetector, this.fps.snapshot());
    this.fps.sample(nowMs, dt * 1000, this.physics.lastPhysicsSteps);
  }

  dispose(): void {
    this.loop.stop();
    window.clearTimeout(this.persistTimer);
    setWhipCursorMode(false);
    this.canvas?.dispose();
    this.crackAudio.dispose();
    for (const c of this.cleanups) c();
    this.cleanups.length = 0;
  }
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return target.isContentEditable;
}
