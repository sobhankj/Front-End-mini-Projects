import type { AppConfig } from '../config/types';
import type { WhipPhysics } from '../physics/WhipPhysics';
import { radiusAt } from '../physics/MassCurve';

/** Preallocated buffers — zero per-frame allocation in the hot path. */
const MAX_SAMPLES = 160;
const MAX_NODES = 64;

const nodeX = new Float64Array(MAX_NODES);
const nodeY = new Float64Array(MAX_NODES);
const sampleX = new Float64Array(MAX_SAMPLES);
const sampleY = new Float64Array(MAX_SAMPLES);
const sampleR = new Float64Array(MAX_SAMPLES);
const leftX = new Float64Array(MAX_SAMPLES);
const leftY = new Float64Array(MAX_SAMPLES);
const rightX = new Float64Array(MAX_SAMPLES);
const rightY = new Float64Array(MAX_SAMPLES);
const tanX = new Float64Array(MAX_SAMPLES);
const tanY = new Float64Array(MAX_SAMPLES);

/**
 * Tapered leather ribbon renderer.
 * Reads interpolated render positions from physics — never writes back.
 */
export class WhipRenderer {
  private config: AppConfig;
  private crackFlash = 0;
  private crackTipX = 0;
  private crackTipY = 0;

  constructor(config: AppConfig) {
    this.config = config;
  }

  applyConfig(config: AppConfig): void {
    this.config = config;
  }

  /** Trigger a brief tip accent (call from crack event). */
  triggerCrackFlash(intensity: number, tipX: number, tipY: number): void {
    this.crackFlash = Math.min(1, Math.max(this.crackFlash, 0.35 + intensity * 0.4));
    this.crackTipX = tipX;
    this.crackTipY = tipY;
  }

  render(ctx: CanvasRenderingContext2D, physics: WhipPhysics, dt = 1 / 60): void {
    const n = physics.getRenderPositions(nodeX, nodeY);
    if (n < 2) return;

    const samples = this.sampleSpline(n);
    if (samples < 2) return;

    this.buildRibbon(samples);
    this.drawRibbon(ctx, samples);
    this.drawHandle(ctx, nodeX[0], nodeY[0]);
    this.drawTip(ctx, samples);

    if (this.crackFlash > 0.01) {
      this.drawCrackAccent(ctx);
      this.crackFlash = Math.max(0, this.crackFlash - dt * 4.5);
    }
  }

  private sampleSpline(nodeCount: number): number {
    const { whip } = this.config;
    const perSeg = 3;
    let count = 0;
    const denom = Math.max(1, nodeCount - 1);

    for (let i = 0; i < nodeCount - 1 && count < MAX_SAMPLES; i++) {
      const i0 = Math.max(0, i - 1);
      const i1 = i;
      const i2 = i + 1;
      const i3 = Math.min(nodeCount - 1, i + 2);

      const steps = i === nodeCount - 2 ? perSeg + 1 : perSeg;
      for (let s = 0; s < steps && count < MAX_SAMPLES; s++) {
        const t = s / perSeg;
        const t2 = t * t;
        const t3 = t2 * t;

        sampleX[count] =
          0.5 *
          (2 * nodeX[i1] +
            (-nodeX[i0] + nodeX[i2]) * t +
            (2 * nodeX[i0] - 5 * nodeX[i1] + 4 * nodeX[i2] - nodeX[i3]) * t2 +
            (-nodeX[i0] + 3 * nodeX[i1] - 3 * nodeX[i2] + nodeX[i3]) * t3);
        sampleY[count] =
          0.5 *
          (2 * nodeY[i1] +
            (-nodeY[i0] + nodeY[i2]) * t +
            (2 * nodeY[i0] - 5 * nodeY[i1] + 4 * nodeY[i2] - nodeY[i3]) * t2 +
            (-nodeY[i0] + 3 * nodeY[i1] - 3 * nodeY[i2] + nodeY[i3]) * t3);

        const u = (i + t) / denom;
        sampleR[count] = radiusAt(u, whip.thickness, whip.gripSize);
        count++;
      }
    }
    return count;
  }

  private buildRibbon(samples: number): void {
    // Tangents from centerline
    for (let i = 0; i < samples; i++) {
      let dx: number;
      let dy: number;
      if (i === 0) {
        dx = sampleX[1] - sampleX[0];
        dy = sampleY[1] - sampleY[0];
      } else if (i === samples - 1) {
        dx = sampleX[i] - sampleX[i - 1];
        dy = sampleY[i] - sampleY[i - 1];
      } else {
        dx = sampleX[i + 1] - sampleX[i - 1];
        dy = sampleY[i + 1] - sampleY[i - 1];
      }
      const len = Math.hypot(dx, dy) || 1;
      tanX[i] = dx / len;
      tanY[i] = dy / len;
    }

    // Prevent 180° flips that invert the ribbon at sharp bends
    for (let i = 1; i < samples; i++) {
      if (tanX[i] * tanX[i - 1] + tanY[i] * tanY[i - 1] < 0) {
        tanX[i] = -tanX[i];
        tanY[i] = -tanY[i];
      }
    }

    // Light tangent smoothing
    for (let i = 1; i < samples - 1; i++) {
      const sx = tanX[i - 1] + tanX[i] * 2 + tanX[i + 1];
      const sy = tanY[i - 1] + tanY[i] * 2 + tanY[i + 1];
      const len = Math.hypot(sx, sy) || 1;
      let tx = sx / len;
      let ty = sy / len;
      if (tx * tanX[i] + ty * tanY[i] < 0) {
        tx = -tx;
        ty = -ty;
      }
      tanX[i] = tx;
      tanY[i] = ty;
    }

    let prevNx = -tanY[0];
    let prevNy = tanX[0];
    for (let i = 0; i < samples; i++) {
      let nx = -tanY[i];
      let ny = tanX[i];
      // Keep normals continuous (no inside-out segments)
      if (nx * prevNx + ny * prevNy < 0) {
        nx = -nx;
        ny = -ny;
      }
      prevNx = nx;
      prevNy = ny;

      // Visual-only floor so the tip does not vanish at subpixel widths
      const r = Math.max(0.55, sampleR[i]);
      leftX[i] = sampleX[i] + nx * r;
      leftY[i] = sampleY[i] + ny * r;
      rightX[i] = sampleX[i] - nx * r;
      rightY[i] = sampleY[i] - ny * r;
    }

    // Blend first samples toward grip so body meets handle without a gap
    const gripR = this.config.whip.gripSize * 0.42;
    if (samples > 2) {
      const blend = Math.min(4, samples - 1);
      for (let i = 0; i < blend; i++) {
        const t = 1 - i / blend;
        const boost = gripR * t * 0.85;
        const nx = (leftX[i] - sampleX[i]);
        const ny = (leftY[i] - sampleY[i]);
        const len = Math.hypot(nx, ny) || 1;
        const ux = nx / len;
        const uy = ny / len;
        const r = Math.max(sampleR[i], 0.55) + boost;
        leftX[i] = sampleX[i] + ux * r;
        leftY[i] = sampleY[i] + uy * r;
        rightX[i] = sampleX[i] - ux * r;
        rightY[i] = sampleY[i] - uy * r;
      }
    }
  }

  private drawRibbon(ctx: CanvasRenderingContext2D, samples: number): void {
    const last = samples - 1;

    // Soft contact shadow (offset, no blur filter)
    ctx.beginPath();
    ctx.moveTo(leftX[0], leftY[0] + 2);
    for (let i = 1; i < samples; i++) ctx.lineTo(leftX[i], leftY[i] + 2);
    ctx.lineTo(rightX[last], rightY[last] + 2);
    for (let i = last - 1; i >= 0; i--) ctx.lineTo(rightX[i], rightY[i] + 2);
    ctx.closePath();
    ctx.fillStyle = 'rgba(12, 8, 5, 0.22)';
    ctx.fill();

    // Main leather silhouette
    ctx.beginPath();
    ctx.moveTo(leftX[0], leftY[0]);
    for (let i = 1; i < samples; i++) ctx.lineTo(leftX[i], leftY[i]);
    ctx.lineTo(rightX[last], rightY[last]);
    for (let i = last - 1; i >= 0; i--) ctx.lineTo(rightX[i], rightY[i]);
    ctx.closePath();

    // Longitudinal leather gradient (handle → tip)
    const grad = ctx.createLinearGradient(sampleX[0], sampleY[0], sampleX[last], sampleY[last]);
    grad.addColorStop(0, '#6e4228');
    grad.addColorStop(0.35, '#5a3420');
    grad.addColorStop(0.75, '#4a2a18');
    grad.addColorStop(1, '#3a2014');
    ctx.fillStyle = grad;
    ctx.fill();

    // Dark edge outline for depth
    ctx.strokeStyle = 'rgba(28, 16, 10, 0.55)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Highlight ridge along the “top” (left edge, thinner)
    ctx.beginPath();
    ctx.moveTo(leftX[0], leftY[0]);
    const hiEnd = Math.max(2, (samples * 0.85) | 0);
    for (let i = 1; i < hiEnd; i++) {
      ctx.lineTo(leftX[i], leftY[i]);
    }
    ctx.strokeStyle = 'rgba(200, 150, 100, 0.28)';
    ctx.lineWidth = 1.25;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Inner core stroke for material density (very subtle)
    ctx.beginPath();
    ctx.moveTo(sampleX[0], sampleY[0]);
    for (let i = 1; i < samples; i++) ctx.lineTo(sampleX[i], sampleY[i]);
    ctx.strokeStyle = 'rgba(90, 55, 35, 0.35)';
    ctx.lineWidth = Math.max(0.6, this.config.whip.thickness * 0.18);
    ctx.stroke();
  }

  private drawHandle(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const r = this.config.whip.gripSize;

    // Soft ground shadow
    ctx.beginPath();
    ctx.ellipse(x + 1, y + 2, r * 0.95, r * 0.55, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();

    // Grip body
    const grad = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
    grad.addColorStop(0, '#a06a42');
    grad.addColorStop(0.45, '#6a4028');
    grad.addColorStop(1, '#2e1a10');

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Pommel ring
    ctx.beginPath();
    ctx.arc(x, y, r * 0.78, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(210, 170, 110, 0.4)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Inner wrap lines
    ctx.beginPath();
    ctx.arc(x, y, r * 0.5, -0.6, Math.PI + 0.4);
    ctx.strokeStyle = 'rgba(40, 24, 14, 0.45)';
    ctx.lineWidth = 1.1;
    ctx.stroke();

    // Specular speck
    ctx.beginPath();
    ctx.arc(x - r * 0.28, y - r * 0.3, r * 0.16, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 220, 170, 0.22)';
    ctx.fill();
  }

  private drawTip(ctx: CanvasRenderingContext2D, samples: number): void {
    const i = samples - 1;
    const x = sampleX[i];
    const y = sampleY[i];
    // Visual floor only — physical radius unchanged
    const r = Math.max(0.7, sampleR[i] * 0.9);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#2a1810';
    ctx.fill();
  }

  private drawCrackAccent(ctx: CanvasRenderingContext2D): void {
    const a = this.crackFlash;
    const r = 3 + a * 5;
    ctx.beginPath();
    ctx.arc(this.crackTipX, this.crackTipY, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 230, 190, ${0.22 * a})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.crackTipX, this.crackTipY, r * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 250, 235, ${0.4 * a})`;
    ctx.fill();
  }
}
