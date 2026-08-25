export type FrameCallback = (deltaSeconds: number, nowMs: number) => void;

/**
 * rAF-driven animation loop with visibility awareness.
 */
export class AnimationLoop {
  private running = false;
  private rafId = 0;
  private lastMs = 0;
  private callback: FrameCallback | null = null;

  start(callback: FrameCallback): void {
    this.callback = callback;
    if (this.running) return;
    this.running = true;
    this.lastMs = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  isRunning(): boolean {
    return this.running;
  }

  /** Call when tab becomes visible again to avoid huge first delta. */
  resync(): void {
    this.lastMs = performance.now();
  }

  private tick = (nowMs: number): void => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this.tick);

    let dt = (nowMs - this.lastMs) / 1000;
    this.lastMs = nowMs;
    // Hard clamp per-frame delta (visibility handler also resets)
    if (!Number.isFinite(dt) || dt < 0) dt = 0;
    if (dt > 0.05) dt = 0.05;

    if (this.callback) this.callback(dt, nowMs);
  };
}
