/**
 * Fullscreen fixed canvas with high-DPI support and DPR capping.
 * pointer-events: none — system cursor remains the input source.
 */
export class CanvasHost {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  width = 0;
  height = 0;
  dpr = 1;

  private readonly maxDpr: number;
  private resizeObserver: ResizeObserver | null = null;

  constructor(parent: HTMLElement, maxDpr = 2) {
    this.maxDpr = maxDpr;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'whip-canvas';
    this.canvas.setAttribute('aria-hidden', 'true');
    parent.appendChild(this.canvas);

    const ctx = this.canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
      willReadFrequently: false,
    });
    if (!ctx) throw new Error('Canvas 2D unavailable');
    this.ctx = ctx;

    this.resize();
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(document.documentElement);
    }

    window.addEventListener('resize', this.onResize, { passive: true });
  }

  private onResize = (): void => {
    this.resize();
  };

  resize(): void {
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, this.maxDpr);

    if (cssW === this.width && cssH === this.height && dpr === this.dpr) return;

    this.width = cssW;
    this.height = cssH;
    this.dpr = dpr;

    this.canvas.width = Math.max(1, Math.floor(cssW * dpr));
    this.canvas.height = Math.max(1, Math.floor(cssH * dpr));
    this.canvas.style.width = `${cssW}px`;
    this.canvas.style.height = `${cssH}px`;

    // Reset transform then scale for CSS-pixel drawing
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  dispose(): void {
    window.removeEventListener('resize', this.onResize);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.canvas.remove();
  }
}
