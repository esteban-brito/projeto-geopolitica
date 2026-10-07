export type QualityTier = "ultra" | "high" | "medium" | "low";

export const QUALITY_TIERS: readonly QualityTier[] = ["ultra", "high", "medium", "low"];

/** Ultra renders at the native ratio up to 3 (phones); High caps at 2. */
const DPR_CAP: Record<QualityTier, number> = { ultra: 3, high: 2, medium: 1.5, low: 1 };

/** Shader features, bit flags read by glass.wgsl (`FEATURE_*`). */
export const FEATURE_DISPERSION = 1;
export const FEATURE_BICUBIC = 2;

/**
 * What each tier pays for besides resolution. Low drops the two costs that only show at the
 * border: three samples for dispersion become one, and the bicubic read of the blurred content
 * (four taps) becomes one bilinear tap. Measured side by side on Crystal, that changes up to 10–20
 * of 255 levels over hundreds of pixels. Six spectral samples for Ultra were tried and changed at
 * most 5: rejected (docs/research §13).
 */
export const TIER_FEATURES: Record<QualityTier, number> = {
  ultra: FEATURE_DISPERSION | FEATURE_BICUBIC,
  high: FEATURE_DISPERSION | FEATURE_BICUBIC,
  medium: FEATURE_DISPERSION | FEATURE_BICUBIC,
  low: 0,
};

/** 4096² — the same ceiling Canvas UI measured as safe for one canvas buffer. */
const MAX_PIXELS = 16_777_216;

/**
 * effectivePixelRatio = min(dpr, cap(tier)) × pinch zoom, bounded by the texture limit, 8192 px per
 * side and the pixel budget. A phone at dpr 3 never allocates a 3× canvas.
 */
export function effectivePixelRatio(cssWidth: number, cssHeight: number, tier: QualityTier, maxTexture: number): number {
  const zoom = window.visualViewport?.scale ?? 1;
  const requested = Math.min(window.devicePixelRatio || 1, DPR_CAP[tier]) * zoom;
  const w = Math.max(cssWidth, 1);
  const h = Math.max(cssHeight, 1);
  const side = Math.min(maxTexture, 8192);
  return Math.max(0.25, Math.min(requested, side / Math.max(w, h), Math.sqrt(MAX_PIXELS / (w * h))));
}
