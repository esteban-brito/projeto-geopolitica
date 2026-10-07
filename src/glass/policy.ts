import { Spring } from "../physics/spring.ts";

/**
 * The Regular variant's legibility policy, and the measurements it reads. Mirrors of the WGSL in
 * glass.wgsl (`lightness`, `cs_metrics`, `stateless_appearance`, `adapt_light`); the tests check
 * they agree.
 *
 * Regular glass keeps whatever sits on it legible: over light content it lifts the darks behind it
 * (dark labels stay readable), over dark content it pulls the lights down (light labels stay
 * readable), and it saturates what it lets through a little (vibrancy). Which side it takes is the
 * glass's *appearance*, decided from the content under it with hysteresis and animated, as the
 * system glass does. Clear never adapts.
 */

/** CIE lightness thresholds (L*, 0..100) with a dead band, so a glass on mixed content does not flicker. */
export const DARK_BELOW = 42;
export const LIGHT_ABOVE = 58;

/** Where adaptation maps black and white, in linear light: light appearance, dark appearance. */
export const LIGHT_RANGE: readonly [number, number] = [0.3, 1.0];
export const DARK_RANGE: readonly [number, number] = [0.0, 0.2];
/** Saturation gain of the transmitted light at adapt = 1. */
export const VIBRANCY = 0.35;

const LUMA: readonly [number, number, number] = [0.2126, 0.7152, 0.0722];

/** CIE L* (0..100) of a linear luminance. */
export function lightness(y: number): number {
  const f = y > 0.008856 ? Math.cbrt(y) : 7.787 * y + 16 / 116;
  return 116 * f - 16;
}

export interface BackdropStats {
  /** Mean L* of the content under the glass. */
  mean: number;
  /** 10th and 90th percentile of L*: the dark and light ends, robust to a stray pixel. */
  p10: number;
  p90: number;
  /** Fraction of the 8×8 sample grid that fell inside the shape. */
  coverage: number;
}

export const HISTOGRAM_BINS = 16;

/**
 * Statistics of L* samples as cs_metrics computes them: mean in 1/64 steps, percentiles from a
 * 16-bin histogram, interpolated inside the bin.
 */
export function backdropStats(samples: readonly number[], gridSize = 64): BackdropStats {
  const n = samples.length;
  if (n === 0) return { mean: 0, p10: 0, p90: 0, coverage: 0 };
  const bins = new Array<number>(HISTOGRAM_BINS).fill(0);
  let sum = 0;
  for (const l of samples) {
    sum += Math.floor(Math.max(l, 0) * 64);
    bins[Math.min(Math.floor((Math.max(l, 0) / 100) * HISTOGRAM_BINS), HISTOGRAM_BINS - 1)]!++;
  }
  const percentile = (q: number) => {
    const target = q * n;
    let below = 0;
    for (let b = 0; b < HISTOGRAM_BINS; b++) {
      const count = bins[b]!;
      if (below + count >= target && count > 0) return ((b + (target - below) / count) * 100) / HISTOGRAM_BINS;
      below += count;
    }
    return 100;
  };
  return { mean: sum / 64 / n, p10: percentile(0.1), p90: percentile(0.9), coverage: n / gridSize };
}

/** Appearance without memory, for renders nobody animates (tests, bench): 0 light, 1 dark. */
export function statelessAppearance(meanL: number): number {
  const t = Math.min(Math.max((meanL - DARK_BELOW) / (LIGHT_ABOVE - DARK_BELOW), 0), 1);
  return 1 - t * t * (3 - 2 * t);
}

/** The light the Regular glass lets through, from the content `rgb` (linear). */
export function adaptLight(rgb: readonly [number, number, number], adapt: number, appearance: number): [number, number, number] {
  const lo = LIGHT_RANGE[0] + (DARK_RANGE[0] - LIGHT_RANGE[0]) * appearance;
  const hi = LIGHT_RANGE[1] + (DARK_RANGE[1] - LIGHT_RANGE[1]) * appearance;
  const c1 = rgb.map((c) => c + (lo + (hi - lo) * c - c) * adapt);
  const luma = c1[0]! * LUMA[0] + c1[1]! * LUMA[1] + c1[2]! * LUMA[2];
  const gain = 1 + VIBRANCY * adapt;
  return c1.map((c) => Math.max(0, luma + (c - luma) * gain)) as [number, number, number];
}

/** A glass's appearance over time: hysteresis on the measured lightness, a spring for the flip. */
export class AppearancePolicy {
  dark = false;
  private seeded = false;
  private readonly spring = new Spring(0, { response: 0.4, dampingRatio: 1 }, 1e-3);

  /** Feed the latest measurement. Returns true when the target flipped. */
  update(stats: BackdropStats): boolean {
    if (stats.coverage <= 0) return false;
    const wasDark = this.dark;
    if (!this.seeded) {
      this.dark = stats.mean < (DARK_BELOW + LIGHT_ABOVE) / 2;
      this.seeded = true;
      this.spring.set(this.dark ? 1 : 0);
      return this.dark !== wasDark;
    }
    if (!this.dark && stats.mean < DARK_BELOW) this.dark = true;
    else if (this.dark && stats.mean > LIGHT_ABOVE) this.dark = false;
    this.spring.target = this.dark ? 1 : 0;
    return this.dark !== wasDark;
  }

  /** Advance the flip animation; true while it moves. */
  step(dt: number): boolean {
    return this.spring.step(dt);
  }

  /** 0 = light appearance, 1 = dark. */
  get value(): number {
    return Math.min(Math.max(this.spring.value, 0), 1);
  }

  get moving(): boolean {
    return !this.spring.resting;
  }

  /** False until the first measurement arrived. */
  get ready(): boolean {
    return this.seeded;
  }
}
