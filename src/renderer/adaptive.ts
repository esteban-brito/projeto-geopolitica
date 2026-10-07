import { QUALITY_TIERS, type QualityTier } from "./quality.ts";

/**
 * Picks the quality tier from the measured GPU time, the way a phone running hot needs: it reacts
 * to a sustained trend, never to one frame, and waits after each change before judging again.
 *
 * - down one tier when the time stays above `downAt` of the frame budget for `downAfterMs`;
 * - up one tier when it stays below `upAt` for `upAfterMs` (much longer: going up is a guess, the
 *   next tier costs more, and a wrong guess comes back down);
 * - after any change, `cooldownMs` without judging, so the new tier's own timings come in first.
 */
export interface AdaptiveConfig {
  downAt: number;
  upAt: number;
  downAfterMs: number;
  upAfterMs: number;
  cooldownMs: number;
}

export const DEFAULT_ADAPTIVE: AdaptiveConfig = { downAt: 0.75, upAt: 0.35, downAfterMs: 500, upAfterMs: 3000, cooldownMs: 2000 };

export class AdaptiveQuality {
  tier: QualityTier;
  /** Frame budget, ms: the display's refresh interval. */
  budgetMs: number;
  readonly config: AdaptiveConfig;
  private overSince = -1;
  private underSince = -1;
  private quietUntil = 0;

  constructor(tier: QualityTier, budgetMs: number, config: AdaptiveConfig = DEFAULT_ADAPTIVE) {
    this.tier = tier;
    this.budgetMs = budgetMs;
    this.config = config;
  }

  /**
   * Feed the smoothed GPU time of a frame (ms, all passes) at wall-clock `now` (ms). Returns the
   * tier to render with; it changes at most one step at a time.
   */
  sample(gpuMs: number, now: number): QualityTier {
    if (now < this.quietUntil || !(gpuMs > 0)) return this.tier;
    const { downAt, upAt, downAfterMs, upAfterMs, cooldownMs } = this.config;
    const load = gpuMs / this.budgetMs;
    this.overSince = load > downAt ? (this.overSince < 0 ? now : this.overSince) : -1;
    this.underSince = load < upAt ? (this.underSince < 0 ? now : this.underSince) : -1;
    const index = QUALITY_TIERS.indexOf(this.tier);
    let next = index;
    // QUALITY_TIERS runs from ultra (0) to low (3).
    if (this.overSince >= 0 && now - this.overSince >= downAfterMs) next = Math.min(index + 1, QUALITY_TIERS.length - 1);
    else if (this.underSince >= 0 && now - this.underSince >= upAfterMs) next = Math.max(index - 1, 0);
    if (next !== index) {
      this.tier = QUALITY_TIERS[next]!;
      this.overSince = this.underSince = -1;
      this.quietUntil = now + cooldownMs;
    }
    return this.tier;
  }
}

/** The display's refresh interval, ms: median of a few animation frames. */
export function measureRefresh(frames = 24): Promise<number> {
  return new Promise((resolve) => {
    const times: number[] = [];
    const tick = (t: number) => {
      times.push(t);
      if (times.length <= frames) requestAnimationFrame(tick);
      else {
        const gaps = times.slice(1).map((v, i) => v - times[i]!).sort((a, b) => a - b);
        resolve(gaps[Math.floor(gaps.length / 2)] ?? 1000 / 60);
      }
    };
    requestAnimationFrame(tick);
  });
}
