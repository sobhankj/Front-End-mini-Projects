import type { AudioConfig } from '../config/types';

/**
 * Synthesized whip-crack via Web Audio API.
 * Short snap — intensity scales with flick strength.
 */
export class CrackAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private unlocked = false;
  private config: AudioConfig;
  private pendingIntensity: number | null = null;

  constructor(config: AudioConfig) {
    this.config = config;
  }

  applyConfig(config: AudioConfig): void {
    this.config = config;
    if (this.master && this.ctx) {
      try {
        this.master.gain.setTargetAtTime(
          Math.max(0, Math.min(1, config.volume)),
          this.ctx.currentTime,
          0.02,
        );
      } catch {
        this.master.gain.value = Math.max(0, Math.min(1, config.volume));
      }
    }
  }

  async unlock(): Promise<void> {
    try {
      if (!this.ctx) {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        this.ctx = new Ctx();
        this.master = this.ctx.createGain();
        this.master.gain.value = Math.max(0, Math.min(1, this.config.volume));
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      this.unlocked = this.ctx.state === 'running';
      if (this.unlocked) this.flushPending();
    } catch {
      this.unlocked = this.ctx?.state === 'running';
    }
  }

  isUnlocked(): boolean {
    return this.unlocked && this.ctx?.state === 'running';
  }

  playCrack(intensity = 1): void {
    if (!this.config.crackEnabled) return;
    const i = Math.max(0.3, Math.min(1.4, intensity));
    if (!this.ctx || !this.master || this.ctx.state !== 'running') {
      this.pendingIntensity = i;
      void this.unlock();
      return;
    }
    try {
      this.playCrackUnsafe(i);
    } catch {
      /* Audio graph can fail after context close */
    }
  }

  private flushPending(): void {
    if (this.pendingIntensity == null || !this.config.crackEnabled) return;
    if (!this.ctx || this.ctx.state !== 'running') return;
    const i = this.pendingIntensity;
    this.pendingIntensity = null;
    try {
      this.playCrackUnsafe(i);
    } catch {
      /* ignore */
    }
  }

  private playCrackUnsafe(intensity: number): void {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;

    const t = ctx.currentTime;
    const i = intensity;
    const dur = 0.07 + 0.05 * i;

    // Broadband noise = the “snap”
    const nSamples = Math.max(32, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, nSamples, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let n = 0; n < nSamples; n++) {
      const u = n / nSamples;
      const env = Math.exp(-u * (14 + 10 * (1.4 - i)));
      data[n] = (Math.random() * 2 - 1) * env;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const high = ctx.createBiquadFilter();
    high.type = 'highpass';
    high.frequency.value = 700 + 200 * i;
    high.Q.value = 0.7;

    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 2100 + 1600 * i;
    band.Q.value = 0.85;

    const noiseGain = ctx.createGain();
    const peak = 0.85 * i;
    noiseGain.gain.setValueAtTime(0.0001, t);
    noiseGain.gain.linearRampToValueAtTime(peak, t + 0.004);
    noiseGain.gain.linearRampToValueAtTime(0.0001, t + dur);

    noise.connect(high);
    high.connect(band);
    band.connect(noiseGain);
    noiseGain.connect(master);
    noise.start(t);
    noise.stop(t + dur + 0.02);

    // Short leather pop under the snap
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420 + 180 * i, t);
    osc.frequency.linearRampToValueAtTime(90, t + 0.045);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.0001, t);
    oscGain.gain.linearRampToValueAtTime(0.22 * i, t + 0.003);
    oscGain.gain.linearRampToValueAtTime(0.0001, t + 0.055);

    osc.connect(oscGain);
    oscGain.connect(master);
    osc.start(t);
    osc.stop(t + 0.07);
  }

  dispose(): void {
    try {
      void this.ctx?.close();
    } catch {
      /* ignore */
    }
    this.ctx = null;
    this.master = null;
    this.unlocked = false;
    this.pendingIntensity = null;
  }
}
