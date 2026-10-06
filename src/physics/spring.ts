/**
 * Damped spring with unit mass, parametrised the way a designer reads it: `response` is the period
 * of the undamped oscillation in seconds, `dampingRatio` is 1 for critical damping and below 1 for
 * overshoot. For a single spring, stiffness and mass only ever appear as their ratio, so a separate
 * mass would be a third knob for two degrees of freedom.
 */
export interface SpringConfig {
  response: number;
  dampingRatio: number;
}

/** Substep ceiling: stable from 30 to 240 Hz displays. */
const MAX_STEP = 1 / 240;
/** A frame longer than this (tab in background, breakpoint) is not simulated in full. */
const MAX_FRAME = 1 / 15;

export function springConstants(config: SpringConfig): { k: number; c: number } {
  const omega = (2 * Math.PI) / Math.max(config.response, 1e-3);
  return { k: omega * omega, c: 2 * config.dampingRatio * omega };
}

export class Spring {
  value: number;
  velocity = 0;
  target: number;
  config: SpringConfig;
  /** Below this distance and speed (per second) the spring snaps to rest. */
  readonly precision: number;

  constructor(value: number, config: SpringConfig, precision = 1e-3) {
    this.value = value;
    this.target = value;
    this.config = config;
    this.precision = precision;
  }

  get resting(): boolean {
    return this.velocity === 0 && this.value === this.target;
  }

  set(value: number): void {
    this.value = value;
    this.target = value;
    this.velocity = 0;
  }

  /** Semi-implicit Euler in substeps of at most MAX_STEP. Returns true while still moving. */
  step(dt: number): boolean {
    if (this.resting) return false;
    const frame = Math.min(Math.max(dt, 0), MAX_FRAME);
    const steps = Math.max(1, Math.ceil(frame / MAX_STEP));
    const h = frame / steps;
    const { k, c } = springConstants(this.config);
    for (let i = 0; i < steps; i++) {
      const accel = -k * (this.value - this.target) - c * this.velocity;
      this.velocity += accel * h;
      this.value += this.velocity * h;
    }
    if (Math.abs(this.value - this.target) < this.precision && Math.abs(this.velocity) < this.precision * 10) {
      this.value = this.target;
      this.velocity = 0;
      return false;
    }
    return true;
  }
}

/** Two springs sharing one configuration, for positions and vectors. */
export class Spring2 {
  readonly x: Spring;
  readonly y: Spring;

  constructor(x: number, y: number, config: SpringConfig, precision = 1e-3) {
    this.x = new Spring(x, config, precision);
    this.y = new Spring(y, config, precision);
  }

  set config(config: SpringConfig) {
    this.x.config = config;
    this.y.config = config;
  }

  setTarget(x: number, y: number): void {
    this.x.target = x;
    this.y.target = y;
  }

  set(x: number, y: number): void {
    this.x.set(x);
    this.y.set(y);
  }

  step(dt: number): boolean {
    const a = this.x.step(dt);
    const b = this.y.step(dt);
    return a || b;
  }
}
