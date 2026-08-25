export interface FrameStats {
  fps: number;
  frameTimeMs: number;
  physicsHz: number;
}

/**
 * Rolling FPS / frame-time monitor. No allocations in hot path after init.
 */
export class FPSMonitor {
  fps = 0;
  frameTimeMs = 0;
  physicsHz = 0;

  private frames = 0;
  private physicsSteps = 0;
  private windowStart = 0;
  private readonly windowMs = 500;

  begin(nowMs: number): void {
    this.windowStart = nowMs;
  }

  /**
   * Record a rendered frame and how many physics steps ran.
   */
  sample(nowMs: number, frameDtMs: number, physicsSteps: number): void {
    this.frameTimeMs = frameDtMs;
    this.frames++;
    this.physicsSteps += physicsSteps;

    const elapsed = nowMs - this.windowStart;
    if (elapsed >= this.windowMs) {
      const seconds = elapsed / 1000;
      this.fps = this.frames / seconds;
      this.physicsHz = this.physicsSteps / seconds;
      this.frames = 0;
      this.physicsSteps = 0;
      this.windowStart = nowMs;
    }
  }

  snapshot(): FrameStats {
    return {
      fps: this.fps,
      frameTimeMs: this.frameTimeMs,
      physicsHz: this.physicsHz,
    };
  }
}
