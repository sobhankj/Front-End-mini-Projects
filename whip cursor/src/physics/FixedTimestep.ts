/**
 * Fixed-timestep accumulator.
 * Decouples physics rate from render FPS; clamps to avoid spiral-of-death
 * after tab suspension.
 */
export class FixedTimestep {
  readonly timestep: number;
  readonly maxAccumulated: number;
  private accumulated = 0;

  constructor(timestep: number, maxAccumulated: number) {
    this.timestep = timestep;
    this.maxAccumulated = maxAccumulated;
  }

  /** Reset accumulator (e.g. on visibility restore). */
  reset(): void {
    this.accumulated = 0;
  }

  getAccumulated(): number {
    return this.accumulated;
  }

  /**
   * Advance with wall-clock delta (seconds).
   * Returns how many fixed steps to run this frame.
   */
  advance(deltaSeconds: number): number {
    const dt = Number.isFinite(deltaSeconds) && deltaSeconds > 0 ? deltaSeconds : 0;
    this.accumulated += dt;
    if (this.accumulated > this.maxAccumulated) {
      this.accumulated = this.maxAccumulated;
    }
    let steps = 0;
    while (this.accumulated >= this.timestep) {
      this.accumulated -= this.timestep;
      steps++;
    }
    return steps;
  }

  /** Interpolation alpha for rendering between physics states [0, 1). */
  alpha(): number {
    return this.accumulated / this.timestep;
  }
}
