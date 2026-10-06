export type QualityTier = "ultra" | "high" | "medium" | "low";

export const QUALITY_TIERS: readonly QualityTier[] = ["ultra", "high", "medium", "low"];

const DPR_CAP: Record<QualityTier, number> = { ultra: 2, high: 2, medium: 1.5, low: 1 };

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
