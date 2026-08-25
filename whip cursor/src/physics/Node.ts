import { Vector2 } from './Vector2';

/**
 * A single physics particle along the whip chain.
 * Uses Verlet-style previousPosition for stable integration.
 */
export class PhysicsNode {
  position: Vector2;
  previousPosition: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  mass: number;
  radius: number;
  /** Inverse mass; 0 means immovable (pinned). */
  invMass: number;

  constructor(x = 0, y = 0, mass = 1, radius = 4) {
    this.position = new Vector2(x, y);
    this.previousPosition = new Vector2(x, y);
    this.velocity = new Vector2();
    this.acceleration = new Vector2();
    this.mass = mass;
    this.radius = radius;
    this.invMass = mass > 0 ? 1 / mass : 0;
  }

  setMass(mass: number): void {
    this.mass = mass;
    this.invMass = mass > 0 ? 1 / mass : 0;
  }

  pin(): void {
    this.invMass = 0;
  }

  unpin(): void {
    this.invMass = this.mass > 0 ? 1 / this.mass : 0;
  }

  reset(x: number, y: number): void {
    this.position.set(x, y);
    this.previousPosition.set(x, y);
    this.velocity.set(0, 0);
    this.acceleration.set(0, 0);
  }
}
