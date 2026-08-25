import { describe, it, expect } from 'vitest';
import { PhysicsNode } from './Node';
import {
  solveDistanceConstraint,
  solveChainConstraints,
} from './Constraints';

describe('distance constraints', () => {
  it('pulls stretched nodes toward rest length', () => {
    const a = new PhysicsNode(0, 0, 1, 2);
    const b = new PhysicsNode(20, 0, 1, 2);
    const rest = 10;
    for (let i = 0; i < 8; i++) {
      solveDistanceConstraint(a, b, rest, 1);
    }
    expect(a.position.distanceTo(b.position)).toBeCloseTo(rest, 1);
  });

  it('respects pinned (infinite mass) nodes', () => {
    const a = new PhysicsNode(0, 0, 1, 2);
    a.pin();
    const b = new PhysicsNode(30, 0, 1, 2);
    solveDistanceConstraint(a, b, 10, 1);
    expect(a.position.x).toBe(0);
    expect(a.position.y).toBe(0);
    expect(b.position.x).toBeCloseTo(10, 0);
  });

  it('solves a chain without exploding', () => {
    const nodes = [
      new PhysicsNode(0, 0, 1, 2),
      new PhysicsNode(50, 0, 0.5, 2),
      new PhysicsNode(100, 0, 0.2, 2),
    ];
    nodes[0].pin();
    const result = solveChainConstraints(nodes, 20, 0.9, 4);
    for (const n of nodes) {
      expect(Number.isFinite(n.position.x)).toBe(true);
      expect(Number.isFinite(n.position.y)).toBe(true);
    }
    expect(nodes[0].position.distanceTo(nodes[1].position)).toBeLessThan(40);
    expect(result.maxError).toBeLessThan(1.5);
  });

  it('tension-only constraints allow slack instead of pushing', () => {
    const a = new PhysicsNode(0, 0, 1, 2);
    a.pin();
    const b = new PhysicsNode(3, 0, 1, 2);
    solveDistanceConstraint(a, b, 10, 1, true);
    expect(b.position.x).toBeCloseTo(3, 5);
    expect(b.position.y).toBeCloseTo(0, 5);
  });
});
