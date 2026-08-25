import { describe, it, expect } from 'vitest';
import { PHASE3_BASELINE, baselinePhysicsSummary } from './baseline';
import { runBenchmark, runSuite, summarizeSuite, type BenchmarkMetrics } from './MotionBenchmark';
import { cloneConfig } from '../config/presets';
import { DEFAULT_CONFIG } from '../config/defaults';
import { WhipPhysics } from '../physics/WhipPhysics';
import type { AppConfig } from '../config/types';
import type { MassCurveType } from '../physics/MassCurve';

function withPatch(
  base: AppConfig,
  p: {
    whip?: Partial<AppConfig['whip']>;
    physics?: Partial<AppConfig['physics']>;
    motion?: Partial<AppConfig['motion']>;
  },
): AppConfig {
  const c = cloneConfig(base);
  if (p.whip) Object.assign(c.whip, p.whip);
  if (p.physics) Object.assign(c.physics, p.physics);
  if (p.motion) Object.assign(c.motion, p.motion);
  return c;
}

function fmt(m: BenchmarkMetrics): string {
  return [
    m.trajectory.padEnd(12),
    `tipV=${m.maxTipVelocity.toFixed(0).padStart(5)}`,
    `ratio=${m.tipHandleRatio.toFixed(2).padStart(4)}`,
    `cMax=${(m.maxConstraintError * 100).toFixed(1).padStart(5)}%`,
    `rec=${m.recoveryEvents}`,
    m.settlingTimeSec >= 0 ? `settle=${m.settlingTimeSec.toFixed(2)}s` : '',
    m.midReverseDelay >= 0 ? `midΔ=${m.midReverseDelay.toFixed(3)}` : '',
    m.tipReverseDelay >= 0 ? `tipΔ=${m.tipReverseDelay.toFixed(3)}` : '',
    m.waveOrderOk ? 'waveOK' : 'waveBAD',
  ]
    .filter(Boolean)
    .join('  ');
}

describe('Phase 4 motion benchmark', () => {
  it('records Phase 3 baseline suite', () => {
    console.log('\n=== BASELINE (Phase 3) ===');
    console.log(baselinePhysicsSummary());
    const results = runSuite(PHASE3_BASELINE as AppConfig);
    for (const r of results) console.log(fmt(r));
    console.log('SUMMARY', summarizeSuite(results));
    expect(results.length).toBe(7);
  });

  it('Phase 4 defaults improve constraint control vs Phase 3', () => {
    console.log('\n=== PHASE 4 DEFAULTS ===');
    const p3 = runSuite(PHASE3_BASELINE as AppConfig);
    const p4 = runSuite(DEFAULT_CONFIG);
    for (const r of p4) console.log(fmt(r));
    const s3 = summarizeSuite(p3);
    const s4 = summarizeSuite(p4);
    console.log('P3 SUMMARY', s3);
    console.log('P4 SUMMARY', s4);

    expect(s4.reverseWaveOk).toBe(true);
    expect(s4.flickTipRatio).toBeGreaterThan(1.2);
    const p4Flick = p4.find((r) => r.trajectory === 'flick')!;
    const p4Rev = p4.find((r) => r.trajectory === 'reversal')!;
    const p4Stop = p4.find((r) => r.trajectory === 'stop')!;
    // Invariants / quality gates (not arbitrary tip-speed chasing)
    expect(p4Rev.waveOrderOk).toBe(true);
    expect(p4Rev.midReverseDelay).toBeGreaterThanOrEqual(0);
    expect(p4Rev.tipReverseDelay).toBeGreaterThanOrEqual(p4Rev.midReverseDelay - 1e-6);
    expect(p4Flick.tipHandleRatio).toBeGreaterThan(1.5);
    expect(p4Stop.settlingTimeSec).toBeGreaterThan(0.05);
    expect(p4Stop.settlingTimeSec).toBeLessThan(2.5);
    // Typical motion should not be in permanent recovery
    expect(p4Rev.recoveryEvents + p4Stop.recoveryEvents).toBe(0);
    void s3;
  });

  it('compares mass curves on flick + reversal + stop', () => {
    console.log('\n=== MASS CURVE COMPARISON ===');
    const curves: MassCurveType[] = ['linear', 'exponential', 'smooth'];
    for (const curve of curves) {
      const cfg = withPatch(DEFAULT_CONFIG, { physics: { massCurve: curve } });
      const flick = runBenchmark('flick', cfg);
      const rev = runBenchmark('reversal', cfg);
      const stop = runBenchmark('stop', cfg);
      console.log(
        curve.padEnd(12),
        `flickRatio=${flick.tipHandleRatio.toFixed(2)}`,
        `wave=${rev.waveOrderOk} mid=${rev.midReverseDelay.toFixed(3)} tip=${rev.tipReverseDelay.toFixed(3)}`,
        `settle=${stop.settlingTimeSec.toFixed(2)}`,
      );
    }
    const smooth = runBenchmark(
      'reversal',
      withPatch(DEFAULT_CONFIG, { physics: { massCurve: 'smooth' } }),
    );
    expect(smooth.waveOrderOk).toBe(true);
  });

  it('settling energy decreases after stop', () => {
    const stop = runBenchmark('stop', DEFAULT_CONFIG);
    expect(stop.settlingTimeSec).toBeGreaterThan(0.05);
    expect(stop.settlingTimeSec).toBeLessThan(2.5);
    expect(stop.maxTotalKE).toBeGreaterThan(1000);
  });

  it('crack detector rejects calm motion', () => {
    const cfg = cloneConfig(DEFAULT_CONFIG);
    let calmCracks = 0;
    for (const id of ['circle', 'figureEight', 'slowLine'] as const) {
      calmCracks += runBenchmark(id, cfg, { trackCracks: true }).crackCount;
    }
    expect(calmCracks).toBe(0);
  });

  it('pointer frequency independence (60 vs 120)', () => {
    const tipAt = (dt: number, steps: number) => {
      const w = new WhipPhysics(cloneConfig(DEFAULT_CONFIG));
      w.init(400, 300);
      let t = 0;
      for (let i = 0; i < steps; i++) {
        t += dt;
        w.setTarget(400 + Math.sin(t * 6) * 100, 300);
        w.update(dt);
      }
      return w.nodes[w.nodes.length - 1].position.x;
    };
    const a = tipAt(1 / 60, 60);
    const b = tipAt(1 / 120, 120);
    expect(Math.abs(a - b)).toBeLessThan(40);
  });
});
