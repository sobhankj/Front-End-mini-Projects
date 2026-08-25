import type { AppConfig } from '../config/types';
import type { WhipPhysics } from '../physics/WhipPhysics';
import type { PointerTracker } from '../input/PointerTracker';
import type { CrackDetector } from '../crack/CrackDetector';
import type { FrameStats } from '../loop/FPSMonitor';

/**
 * Optional debug overlay — off in normal presentation.
 */
export class DebugOverlay {
  private config: AppConfig;

  constructor(config: AppConfig) {
    this.config = config;
  }

  applyConfig(config: AppConfig): void {
    this.config = config;
  }

  render(
    ctx: CanvasRenderingContext2D,
    physics: WhipPhysics,
    pointer: PointerTracker,
    crack: CrackDetector,
    stats: FrameStats,
  ): void {
    const d = this.config.debug;
    if (!d.enabled) return;

    const nodes = physics.nodes;
    const ratio = physics.handleSpeed > 1 ? physics.tipSpeed / physics.handleSpeed : 0;

    if (d.showConstraints && nodes.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(180, 190, 200, 0.28)';
      ctx.lineWidth = 1;
      ctx.moveTo(nodes[0].position.x, nodes[0].position.y);
      for (let i = 1; i < nodes.length; i++) {
        ctx.lineTo(nodes[i].position.x, nodes[i].position.y);
      }
      ctx.stroke();
    }

    if (d.showNodes) {
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.beginPath();
        ctx.arc(n.position.x, n.position.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle =
          i === 0 ? '#9cf' : i === nodes.length - 1 ? '#e8a070' : 'rgba(255,255,255,0.4)';
        ctx.fill();
      }
    }

    if (d.showVelocityVectors) {
      ctx.strokeStyle = 'rgba(220, 200, 140, 0.55)';
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const s = 0.02;
        ctx.beginPath();
        ctx.moveTo(n.position.x, n.position.y);
        ctx.lineTo(n.position.x + n.velocity.x * s, n.position.y + n.velocity.y * s);
        ctx.stroke();
      }
    }

    if (d.showTarget) {
      ctx.beginPath();
      ctx.arc(physics.target.x, physics.target.y, 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(160, 220, 160, 0.8)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (d.showTip && nodes.length > 0) {
      const tip = nodes[nodes.length - 1];
      ctx.beginPath();
      ctx.arc(tip.position.x, tip.position.y, 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(230, 150, 90, 0.85)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const s = crack.lastSignals;
    const lines = [
      `${stats.fps.toFixed(0)} fps  ${stats.frameTimeMs.toFixed(1)} ms  ${stats.physicsHz.toFixed(0)} Hz`,
      `n ${physics.getNodeCount()}  ε ${(physics.maxConstraintError * 100).toFixed(1)}%  ptr ${pointer.speed.toFixed(0)}`,
      `v  h ${physics.handleSpeed.toFixed(0)}  m ${physics.midSpeed.toFixed(0)}  t ${physics.tipSpeed.toFixed(0)}  r ${ratio.toFixed(2)}`,
      `E ${physics.totalKineticEnergy.toFixed(0)}  crack ${crack.active ? 'YES' : s.eligible ? 'ready' : '—'}  ${s.score.toFixed(2)}`,
    ];

    ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    ctx.textBaseline = 'top';
    const pad = 8;
    const lineH = 14;
    const boxW = 340;
    const boxH = lines.length * lineH + pad * 2;
    ctx.fillStyle = 'rgba(8, 8, 10, 0.72)';
    ctx.fillRect(12, 12, boxW, boxH);
    ctx.fillStyle = '#d8d6d2';
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 12 + pad, 12 + pad + i * lineH);
    }
  }
}

