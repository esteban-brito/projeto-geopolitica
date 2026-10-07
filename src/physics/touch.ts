import type { TouchLight } from "../glass/glow.ts";
import { Spring, type SpringConfig } from "./spring.ts";

/** Lights up at once: the feedback has to be there while the finger is still down. */
const RISE: SpringConfig = { response: 0.14, dampingRatio: 1 };
/** After the flash, settles while the finger stays: feedback, not a lamp left on. */
const SETTLE: SpringConfig = { response: 0.6, dampingRatio: 1 };
/** Level held while the finger stays down, after the flash. */
export const SUSTAIN = 0.45;
/** Dies away slower than it came. */
const FADE: SpringConfig = { response: 0.7, dampingRatio: 1 };
/** From under the finger to the whole glass and past it. */
const SPREAD: SpringConfig = { response: 0.55, dampingRatio: 1 };
/** Radius of the light when it appears, CSS px: about a fingertip. */
export const FINGER_RADIUS = 16;
/** How far past the glass's own extent the glow reaches, CSS px: onto the glasses nearby. */
export const SPREAD_BEYOND = 56;
/** As the light spreads its peak falls, (r0 / r)^k: the same light over a larger area, not more of it. */
const SPREAD_DIMMING = 0.6;

/**
 * The glow of one glass after a touch. It is anchored where the finger landed, relative to the
 * glass's centre, so it travels with the glass while dragged. Stops by itself (step returns false).
 */
export class TouchGlow {
  private ox = 0;
  private oy = 0;
  private readonly intensity = new Spring(0, RISE, 1e-3);
  private readonly spread = new Spring(0, SPREAD, 1e-3);
  private held = false;

  /** A finger landed `(ox, oy)` CSS px from the glass's centre. */
  press(ox: number, oy: number): void {
    this.ox = ox;
    this.oy = oy;
    this.spread.set(0);
    this.spread.target = 1;
    this.intensity.config = RISE;
    this.intensity.target = 1;
    this.held = true;
  }

  release(): void {
    this.held = false;
    this.intensity.config = FADE;
    this.intensity.target = 0;
  }

  step(dt: number): boolean {
    if (this.held && this.intensity.target === 1 && this.intensity.value >= 0.97) {
      this.intensity.config = SETTLE;
      this.intensity.target = SUSTAIN;
    }
    const a = this.intensity.step(dt);
    const b = this.spread.step(dt);
    return a || b;
  }

  get lit(): boolean {
    return this.intensity.value > 1e-3;
  }

  /** The light for a glass centred at (cx, cy) whose farthest edge is `reach` CSS px away. */
  light(cx: number, cy: number, reach: number): TouchLight | null {
    const strength = Math.min(Math.max(this.intensity.value, 0), 1);
    if (strength <= 1e-3) return null;
    const s = Math.min(Math.max(this.spread.value, 0), 1);
    const radius = FINGER_RADIUS + (reach + SPREAD_BEYOND - FINGER_RADIUS) * s;
    return { x: cx + this.ox, y: cy + this.oy, radius, intensity: strength * (FINGER_RADIUS / radius) ** SPREAD_DIMMING };
  }
}
