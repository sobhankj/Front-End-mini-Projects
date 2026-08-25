import type { AppConfig } from '../config/types';
import { cloneConfig } from '../config/presets';
import { WhipPhysics } from '../physics/WhipPhysics';
import { CrackDetector } from '../crack/CrackDetector';
import { PointerTracker } from '../input/PointerTracker';

export type TrajectoryId =
  | 'slowLine'
  | 'fastLine'
  | 'reversal'
  | 'circle'
  | 'figureEight'
  | 'flick'
  | 'stop';

export interface BenchmarkMetrics {
  trajectory: TrajectoryId;
  durationSec: number;
  maxHandleVelocity: number;
  maxMidVelocity: number;
  maxTipVelocity: number;
  tipHandleRatio: number;
  maxTipAccel: number;
  maxTotalKE: number;
  maxTipKE: number;
  avgConstraintError: number;
  maxConstraintError: number;
  settlingTimeSec: number;
  recoveryEvents: number;
  /** Seconds after reversal when mid vx flips; -1 if never */
  midReverseDelay: number;
  /** Seconds after reversal when tip vx flips; -1 if never */
  tipReverseDelay: number;
  waveOrderOk: boolean;
  crackCount: number;
}

export interface TrajectoryPoint {
  t: number;
  x: number;
  y: number;
}

const ORIGIN_X = 480;
const ORIGIN_Y = 320;
const DT = 1 / 120;

/**
 * Deterministic mouse trajectories for development benchmarking.
 * Does not replace live pointer input — tests/dev only.
 */
export function buildTrajectory(id: TrajectoryId): TrajectoryPoint[] {
  const pts: TrajectoryPoint[] = [];
  const push = (t: number, x: number, y: number): void => {
    pts.push({ t, x, y });
  };

  switch (id) {
    case 'slowLine': {
      // 1.2s left→right at ~200 px/s
      for (let i = 0; i <= 144; i++) {
        const t = i * DT;
        push(t, ORIGIN_X - 120 + (240 * i) / 144, ORIGIN_Y);
      }
      break;
    }
    case 'fastLine': {
      // 0.4s left→right at ~1200 px/s
      for (let i = 0; i <= 48; i++) {
        const t = i * DT;
        push(t, ORIGIN_X - 240 + (480 * i) / 48, ORIGIN_Y);
      }
      break;
    }
    case 'reversal': {
      // accelerate right then reverse left
      for (let i = 0; i <= 36; i++) {
        push(i * DT, ORIGIN_X - 80 + i * 18, ORIGIN_Y);
      }
      const t0 = 37 * DT;
      for (let i = 0; i <= 48; i++) {
        push(t0 + i * DT, ORIGIN_X - 80 + 36 * 18 - i * 22, ORIGIN_Y);
      }
      break;
    }
    case 'circle': {
      const r = 110;
      for (let i = 0; i <= 180; i++) {
        const t = i * DT;
        const a = (i / 180) * Math.PI * 2;
        push(t, ORIGIN_X + Math.cos(a) * r, ORIGIN_Y + Math.sin(a) * r);
      }
      break;
    }
    case 'figureEight': {
      const r = 90;
      for (let i = 0; i <= 240; i++) {
        const t = i * DT;
        const a = (i / 240) * Math.PI * 4;
        push(t, ORIGIN_X + Math.sin(a) * r, ORIGIN_Y + Math.sin(a * 2) * (r * 0.55));
      }
      break;
    }
    case 'flick': {
      // slow drift then sudden reversal
      for (let i = 0; i <= 40; i++) {
        push(i * DT, ORIGIN_X - 40 + i * 4, ORIGIN_Y);
      }
      const t0 = 41 * DT;
      for (let i = 0; i <= 20; i++) {
        push(t0 + i * DT, ORIGIN_X - 40 + 40 * 4 - i * 28, ORIGIN_Y);
      }
      // coast
      const holdX = ORIGIN_X - 40 + 40 * 4 - 20 * 28;
      for (let i = 1; i <= 60; i++) {
        push(t0 + 20 * DT + i * DT, holdX, ORIGIN_Y);
      }
      break;
    }
    case 'stop': {
      for (let i = 0; i <= 30; i++) {
        push(i * DT, ORIGIN_X + i * 22, ORIGIN_Y);
      }
      const holdX = ORIGIN_X + 30 * 22;
      const t0 = 31 * DT;
      for (let i = 0; i <= 200; i++) {
        push(t0 + i * DT, holdX, ORIGIN_Y);
      }
      break;
    }
  }

  return pts;
}

function emptyMetrics(id: TrajectoryId): BenchmarkMetrics {
  return {
    trajectory: id,
    durationSec: 0,
    maxHandleVelocity: 0,
    maxMidVelocity: 0,
    maxTipVelocity: 0,
    tipHandleRatio: 0,
    maxTipAccel: 0,
    maxTotalKE: 0,
    maxTipKE: 0,
    avgConstraintError: 0,
    maxConstraintError: 0,
    settlingTimeSec: -1,
    recoveryEvents: 0,
    midReverseDelay: -1,
    tipReverseDelay: -1,
    waveOrderOk: true,
    crackCount: 0,
  };
}

/**
 * Run a deterministic trajectory against a config clone.
 * Uses fixed 120 Hz steps matching the physics timestep.
 */
export function runBenchmark(
  trajectory: TrajectoryId,
  config: AppConfig,
  options?: { trackCracks?: boolean },
): BenchmarkMetrics {
  const cfg = cloneConfig(config);
  const trackCracks = options?.trackCracks ?? false;

  const whip = new WhipPhysics(cfg);
  whip.init(ORIGIN_X, ORIGIN_Y);

  const pointer = new PointerTracker();
  pointer.reset(ORIGIN_X, ORIGIN_Y);
  const crack = new CrackDetector(cfg.audio);

  const pts = buildTrajectory(trajectory);
  const m = emptyMetrics(trajectory);
  if (pts.length < 2) return m;

  m.durationSec = pts[pts.length - 1].t;

  let errSum = 0;
  let errSamples = 0;
  let peakTipAtHandle = 0;

  // Reversal detection: find first frame where handle vx is clearly negative
  // after having been positive (for reversal / flick).
  let sawPositiveHandle = false;
  let reverseTime = -1;
  let midFlip = -1;
  let tipFlip = -1;

  let settleStart = -1;
  let settledAt = -1;
  let movingDone = false;
  let keAtStop = -1;

  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const prev = i > 0 ? pts[i - 1] : p;
    const dt = Math.max(DT, p.t - prev.t);

    whip.setTarget(p.x, p.y);
    // Feed pointer with synthetic timestamps (ms)
    pointer.update(p.x, p.y, p.t * 1000);
    whip.update(dt);

    if (whip.recoveredThisStep) m.recoveryEvents++;

    m.maxHandleVelocity = Math.max(m.maxHandleVelocity, whip.handleSpeed);
    m.maxMidVelocity = Math.max(m.maxMidVelocity, whip.midSpeed);
    m.maxTipVelocity = Math.max(m.maxTipVelocity, whip.tipSpeed);
    m.maxTipAccel = Math.max(m.maxTipAccel, whip.tipAccelMagnitude);
    m.maxTotalKE = Math.max(m.maxTotalKE, whip.totalKineticEnergy);
    m.maxTipKE = Math.max(m.maxTipKE, whip.tipKineticEnergy);
    m.maxConstraintError = Math.max(m.maxConstraintError, whip.maxConstraintError);
    errSum += whip.avgConstraintError;
    errSamples++;

    if (whip.handleSpeed > 80) {
      const ratio = whip.tipSpeed / Math.max(1, whip.handleSpeed);
      peakTipAtHandle = Math.max(peakTipAtHandle, ratio);
    }

    const hx = whip.handleVelocity.x;
    const mid = whip.nodes[(whip.nodes.length / 2) | 0];
    const tip = whip.nodes[whip.nodes.length - 1];

    if (trajectory === 'reversal' || trajectory === 'flick') {
      if (hx > 200) sawPositiveHandle = true;
      if (sawPositiveHandle && reverseTime < 0 && hx < -150) {
        reverseTime = p.t;
      }
      if (reverseTime >= 0) {
        if (midFlip < 0 && mid.velocity.x < -120) midFlip = p.t - reverseTime;
        if (tipFlip < 0 && tip.velocity.x < -120) tipFlip = p.t - reverseTime;
      }
    }

    if (trajectory === 'stop') {
      if (!movingDone && i > 0 && Math.abs(p.x - prev.x) < 1e-6) {
        movingDone = true;
        settleStart = p.t;
        keAtStop = Math.max(1, whip.totalKineticEnergy);
      }
      // Relative settle: energy below 5% of KE at the moment motion stopped
      if (
        movingDone &&
        settledAt < 0 &&
        keAtStop > 0 &&
        whip.totalKineticEnergy < keAtStop * 0.05
      ) {
        settledAt = p.t - settleStart;
      }
    }

    if (trackCracks && crack.update(pointer, whip, p.t)) {
      m.crackCount++;
    }
  }

  m.avgConstraintError = errSamples > 0 ? errSum / errSamples : 0;
  m.tipHandleRatio = peakTipAtHandle;
  m.midReverseDelay = midFlip;
  m.tipReverseDelay = tipFlip;
  m.waveOrderOk =
    midFlip < 0 || tipFlip < 0 ? midFlip >= 0 || tipFlip < 0 : midFlip <= tipFlip + 1e-6;
  m.settlingTimeSec = settledAt;

  return m;
}

export function runSuite(
  config: AppConfig,
  trajectories: TrajectoryId[] = [
    'slowLine',
    'fastLine',
    'reversal',
    'circle',
    'figureEight',
    'flick',
    'stop',
  ],
): BenchmarkMetrics[] {
  return trajectories.map((id) => runBenchmark(id, config));
}

/** Score helper for comparisons — lower is better for errors/recoveries; higher tip ratio better within reason. */
export function summarizeSuite(results: BenchmarkMetrics[]): {
  maxConstraint: number;
  recoveries: number;
  flickTipRatio: number;
  reverseWaveOk: boolean;
  settleSec: number;
  flickTipV: number;
} {
  const by = (id: TrajectoryId) => results.find((r) => r.trajectory === id)!;
  return {
    maxConstraint: Math.max(...results.map((r) => r.maxConstraintError)),
    recoveries: results.reduce((s, r) => s + r.recoveryEvents, 0),
    flickTipRatio: by('flick').tipHandleRatio,
    reverseWaveOk: by('reversal').waveOrderOk,
    settleSec: by('stop').settlingTimeSec,
    flickTipV: by('flick').maxTipVelocity,
  };
}
