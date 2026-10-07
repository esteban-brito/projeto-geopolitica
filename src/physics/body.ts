import type { GlassMaterial } from "../glass/material.ts";
import type { Shape } from "../glass/shape.ts";
import { Spring, Spring2, type SpringConfig } from "./spring.ts";

export interface BodyTuning {
  /** How the glass follows the pointer. */
  follow: SpringConfig;
  /** How the stretch settles: under 1 lets it squash past rest once before settling. */
  deform: SpringConfig;
  /** Stretch per px/s of speed; the stretch itself is capped at MAX_STRETCH. */
  deformation: number;
}

export const DEFAULT_TUNING: BodyTuning = {
  follow: { response: 0.14, dampingRatio: 0.86 },
  deform: { response: 0.22, dampingRatio: 0.55 },
  deformation: 0.00006,
};

/** The stretch never passes 12%: past that a UI element stops reading as glass and starts as jelly. */
export const MAX_STRETCH = 0.12;
const PRESS: SpringConfig = { response: 0.12, dampingRatio: 1 };
/** Release bounce: one restrained overshoot, as macOS 27 does on interactive glass. */
const BOUNCE: SpringConfig = { response: 0.32, dampingRatio: 0.55 };
const PRESS_SCALE = 0.035;
/** Shape morph: a little overshoot reads as liquid; more reads as rubber. */
export const MORPH: SpringConfig = { response: 0.42, dampingRatio: 0.74 };

/** The fields of the shape descriptor that morph. Every form is these numbers, nothing else. */
const FORM = ["halfWidth", "halfHeight", "radius", "exponent", "rotation"] as const;
type FormField = (typeof FORM)[number];

/**
 * Physical state of one glass surface. The rest shape is what the panel edits; `shape()` is what
 * gets drawn: position from a spring, a stretch along the velocity that preserves area, a press
 * that scales it, and the form (extents, corner, rotation) from one spring per field, so a circle
 * becomes a capsule or a panel by interpolating numbers. Moving rebuilds no optics; morphing
 * rebuilds the radial table of this surface while it runs (microseconds).
 */
export class GlassBody {
  rest: Shape;
  tuning: BodyTuning;
  private readonly position: Spring2;
  private readonly stretch: Spring2;
  private readonly press = new Spring(0, PRESS);
  private readonly scale = new Spring(1, BOUNCE, 1e-4);
  private readonly form: Record<FormField, Spring>;
  private grabX = 0;
  private grabY = 0;
  private dragging = false;

  constructor(rest: Shape, tuning: BodyTuning = DEFAULT_TUNING) {
    this.rest = rest;
    this.tuning = tuning;
    this.position = new Spring2(rest.cx, rest.cy, tuning.follow, 0.01);
    this.stretch = new Spring2(0, 0, tuning.deform, 1e-4);
    this.form = Object.fromEntries(FORM.map((f) => [f, new Spring(rest[f], MORPH, f === "exponent" || f === "rotation" ? 1e-4 : 0.01)])) as Record<
      FormField,
      Spring
    >;
  }

  get moving(): boolean {
    return (
      this.dragging ||
      !this.position.x.resting ||
      !this.position.y.resting ||
      !this.stretch.x.resting ||
      !this.stretch.y.resting ||
      !this.press.resting ||
      !this.scale.resting ||
      FORM.some((f) => !this.form[f].resting)
    );
  }

  /** Animate the form toward `target` (its position is ignored: the glass stays where it is). */
  morph(target: Shape): void {
    for (const f of FORM) {
      this.rest[f] = target[f];
      this.form[f].target = target[f];
    }
  }

  /** The panel changed the rest form: follow it at once (a slider is already continuous). */
  snap(): void {
    for (const f of FORM) this.form[f].set(this.rest[f]);
  }

  /** Teleport (panel edits, presets): no animation, no stretch. */
  place(cx: number, cy: number): void {
    this.rest.cx = cx;
    this.rest.cy = cy;
    this.position.set(cx, cy);
    this.stretch.set(0, 0);
  }

  grab(x: number, y: number): void {
    this.dragging = true;
    this.grabX = x - this.position.x.value;
    this.grabY = y - this.position.y.value;
    this.press.target = 1;
    this.scale.target = 1 + PRESS_SCALE;
  }

  drag(x: number, y: number): void {
    if (!this.dragging) return;
    this.rest.cx = x - this.grabX;
    this.rest.cy = y - this.grabY;
    this.position.setTarget(this.rest.cx, this.rest.cy);
  }

  release(): void {
    this.dragging = false;
    this.press.target = 0;
    this.scale.target = 1;
  }

  step(dt: number): boolean {
    this.position.config = this.tuning.follow;
    this.stretch.config = this.tuning.deform;
    this.position.step(dt);
    const vx = this.position.x.velocity;
    const vy = this.position.y.velocity;
    const speed = Math.hypot(vx, vy);
    const amount = Math.min(speed * this.tuning.deformation, MAX_STRETCH);
    const k = speed > 1e-6 ? amount / speed : 0;
    this.stretch.setTarget(vx * k, vy * k);
    this.stretch.step(dt);
    this.press.step(dt);
    this.scale.step(dt);
    for (const f of FORM) this.form[f].step(dt);
    return this.moving;
  }

  /** The shape to draw this frame. */
  shape(): Shape {
    const sx = this.stretch.x.value;
    const sy = this.stretch.y.value;
    const amount = Math.min(Math.hypot(sx, sy), MAX_STRETCH);
    const form = this.form;
    return {
      ...this.rest,
      halfWidth: Math.max(form.halfWidth.value, 1),
      halfHeight: Math.max(form.halfHeight.value, 1),
      radius: Math.max(form.radius.value, 0),
      // An overshoot below 2 would still be convex down to 1; keep a margin.
      exponent: Math.max(form.exponent.value, 1.6),
      rotation: form.rotation.value,
      cx: this.position.x.value,
      cy: this.position.y.value,
      stretch: amount > 1e-5 ? { amount, angle: Math.atan2(sy, sx) } : undefined,
      scale: this.scale.value,
    };
  }

  /** Pressing pushes the glass toward the content: shorter gap, tighter shadow, brighter light. */
  material(base: GlassMaterial): GlassMaterial {
    const p = Math.max(0, Math.min(1, this.press.value));
    if (p <= 1e-4) return base;
    return { ...base, gap: base.gap * (1 - 0.45 * p), light: base.light * (1 + 0.35 * p), shadow: Math.min(1, base.shadow * (1 + 0.3 * p)) };
  }
}
