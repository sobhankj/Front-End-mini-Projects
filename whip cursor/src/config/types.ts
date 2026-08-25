/**
 * Central configuration types for WHIP Cursor.
 * UI mutates these; physics/renderer read them — never the reverse.
 */

export interface WhipVisualConfig {
  /** Total rest length of the whip in CSS pixels */
  length: number;
  /** Base body thickness at the thickest segment (CSS pixels) */
  thickness: number;
  /** Visual handle/grip radius (CSS pixels) */
  gripSize: number;
  /** Number of physics nodes along the whip (handle → tip) */
  nodeCount: number;
}

export interface PhysicsConfig {
  /**
   * Mass scale applied to the mass curve.
   * Higher = heavier overall whip, more inertia.
   */
  mass: number;
  /**
   * Mass falloff shape along the whip (handle → tip).
   * `smooth` is the default for believable wave transfer.
   */
  massCurve: 'linear' | 'exponential' | 'smooth';
  /**
   * Screen-space acceleration in px/s² (positive = down).
   * Needs to be large (~1000–2500) so the tail actually hangs and swings.
   * Real-world 1g (9.8 m/s²) is not the unit here.
   */
  gravity: number;
  /** Linear friction / drag coefficient (separate from constraint solve). */
  friction: number;
  /** Velocity damping factor (0–1). Higher = settles faster. */
  damping: number;
  /**
   * Constraint stiffness (0–1).
   * How aggressively distance constraints correct stretch each iteration.
   */
  stiffness: number;
  /** Number of distance-constraint solver iterations per physics step */
  iterations: number;
  /** Fixed physics timestep in seconds (default ~1/120) */
  timestep: number;
  /** Max accumulated time (seconds) to simulate after a stall / tab return */
  maxAccumulatedTime: number;
}

export interface MotionConfig {
  /**
   * How strongly the handle tracks the pointer (0–1).
   * 1 = snap to pointer; lower = lag / soft follow.
   */
  followStrength: number;
  /**
   * How much handle motion couples into the first free segment (0–1).
   * Higher = snappier yank into the chain; does not inject tip velocity.
   */
  velocityResponse: number;
  /**
   * Steepness of the mass falloff toward the tip (≥ 1).
   * Higher → lighter tip → naturally higher tip speed from physics.
   * Not an artificial velocity multiplier.
   */
  tipSensitivity: number;
}

export interface AudioConfig {
  crackEnabled: boolean;
  /** 0–1 sensitivity; higher = easier cracks */
  crackSensitivity: number;
  /** Output gain 0–1 */
  volume: number;
  /** Minimum seconds between cracks */
  cooldown: number;
}

export interface DebugConfig {
  enabled: boolean;
  showNodes: boolean;
  showConstraints: boolean;
  showVelocityVectors: boolean;
  showTarget: boolean;
  showTip: boolean;
}

export interface AppConfig {
  whip: WhipVisualConfig;
  physics: PhysicsConfig;
  motion: MotionConfig;
  audio: AudioConfig;
  debug: DebugConfig;
}

export type PresetId =
  | 'classic'
  | 'heavy'
  | 'light'
  | 'fast'
  | 'snappy'
  | 'loose';

export type ConfigPatch = {
  [K in keyof AppConfig]?: Partial<AppConfig[K]>;
};
