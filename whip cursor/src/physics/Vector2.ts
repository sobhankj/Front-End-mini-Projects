/**
 * Mutable 2D vector utilities with object reuse to avoid GC during simulation.
 * Methods that return Vector2 mutate `out` (or `this` for in-place ops).
 */

export class Vector2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  copy(v: Vector2): this {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  add(v: Vector2): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v: Vector2): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  scale(s: number): this {
    this.x *= s;
    this.y *= s;
    return this;
  }

  addScaled(v: Vector2, s: number): this {
    this.x += v.x * s;
    this.y += v.y * s;
    return this;
  }

  length(): number {
    return Math.hypot(this.x, this.y);
  }

  lengthSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  normalize(): this {
    const len = this.length();
    if (len > 1e-8) {
      this.x /= len;
      this.y /= len;
    } else {
      this.x = 0;
      this.y = 0;
    }
    return this;
  }

  /** Distance between this and v. */
  distanceTo(v: Vector2): number {
    return Math.hypot(this.x - v.x, this.y - v.y);
  }

  distanceToSq(v: Vector2): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  /** Dot product. */
  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  /** Write this + v into out. */
  static add(a: Vector2, b: Vector2, out: Vector2): Vector2 {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    return out;
  }

  static sub(a: Vector2, b: Vector2, out: Vector2): Vector2 {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    return out;
  }

  static scale(a: Vector2, s: number, out: Vector2): Vector2 {
    out.x = a.x * s;
    out.y = a.y * s;
    return out;
  }

  static lerp(a: Vector2, b: Vector2, t: number, out: Vector2): Vector2 {
    out.x = a.x + (b.x - a.x) * t;
    out.y = a.y + (b.y - a.y) * t;
    return out;
  }

  static distance(a: Vector2, b: Vector2): number {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  static isFinite(v: Vector2): boolean {
    return Number.isFinite(v.x) && Number.isFinite(v.y);
  }
}

/** Clamp a scalar into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

/** Safe finite check + fallback for positions/velocities. */
export function sanitizeNumber(n: number, fallback = 0): number {
  return Number.isFinite(n) ? n : fallback;
}
