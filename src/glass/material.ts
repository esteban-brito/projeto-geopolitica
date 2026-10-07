export type Profile = "squircle" | "circle" | "lip";

export const PROFILE_INDEX: Record<Profile, number> = { squircle: 0, circle: 1, lip: 2 };

/** Regular adapts to the content behind it; Clear stays transparent and never adapts. */
export type GlassVariant = "regular" | "clear";

/** Above this Abbe number the lab treats the glass as dispersion-free (one sample, not three). */
export const ABBE_OFF = 90;

/**
 * Optical material. Lengths are CSS pixels and become device pixels when packed. What can be
 * derived is derived and not exposed: F0 from ior, per-channel ior from abbe, blur radius from
 * roughness and the glass's height, shadow offset and softness from the gap.
 */
export interface GlassMaterial {
  variant: GlassVariant;
  /** Index of refraction at the d line (587.6 nm). */
  ior: number;
  /** Abbe number: lower disperses more (flint ≈ 30, crown ≈ 60). ≥ ABBE_OFF disables dispersion. */
  abbe: number;
  /** Flat slab thickness under the bevel (T). */
  thickness: number;
  /** Height the glass floats above the content (G). */
  gap: number;
  /** Width of the curved band along the border; capped by the corner radius. */
  bevel: number;
  profile: Profile;
  /** Surface micro-roughness, 0 (polished) to 1 (deep frost). */
  roughness: number;
  /** Colour the glass takes after REFERENCE_PATH of material, linear RGB. White = no intrinsic colour. */
  tint: [number, number, number];
  /** 0..1, how far the transmission moves toward `tint` at REFERENCE_PATH. */
  density: number;
  /** Key light from above; the back light below is a fixed fraction of it. */
  light: number;
  /** Direction the key light comes from, degrees; 90 = top of the screen. */
  lightAngle: number;
  /** Studio environment reflected by Fresnel; it takes its colour from the content around. */
  environment: number;
  /**
   * Edge contrast, 0..1: transmitted light dims with the surface's slope, (1 − N·V). Liquid Glass 27
   * darkened the edge for legibility; here the darkening follows the geometry instead of a band.
   */
  edge: number;
  /** Shadow cast on the content; its offset and softness follow `gap`. */
  shadow: number;
  /**
   * Regular only, 0..1: how far the glass compresses the light behind it toward the side that
   * keeps content on top legible — lighter over light content (dark labels), darker over dark
   * content (light labels) — and how much it saturates it (vibrancy). Clear ignores it.
   */
  adapt: number;
}

/** Path length (CSS px) at which the glass reaches `tint` when density = 1. */
export const REFERENCE_PATH = 24;

const BASE: GlassMaterial = {
  variant: "regular",
  ior: 1.5,
  abbe: 55,
  thickness: 14,
  gap: 8,
  bevel: 22,
  profile: "squircle",
  roughness: 0.22,
  tint: [1, 1, 1],
  density: 0,
  light: 1,
  lightAngle: 90,
  environment: 1,
  edge: 0.6,
  shadow: 0.35,
  adapt: 0.5,
};

export type PresetId = "clear" | "regular" | "frost" | "crystal" | "smoke";

export const PRESETS: Record<PresetId, { label: string; material: GlassMaterial }> = {
  clear: {
    label: "Claro",
    material: { ...BASE, variant: "clear", roughness: 0, thickness: 10, gap: 6, bevel: 18, abbe: 60, environment: 0.85, edge: 0.45, shadow: 0.25 },
  },
  regular: { label: "Regular", material: { ...BASE } },
  frost: {
    label: "Fosco",
    material: { ...BASE, roughness: 0.62, thickness: 16, gap: 10, bevel: 24, abbe: ABBE_OFF, light: 0.8 },
  },
  crystal: {
    label: "Cristal",
    material: { ...BASE, roughness: 0, ior: 1.72, abbe: 28, thickness: 22, gap: 10, bevel: 28, light: 1.25, environment: 1.1 },
  },
  smoke: {
    label: "Fumê",
    material: { ...BASE, roughness: 0.3, tint: [0.42, 0.43, 0.46], density: 0.85, light: 0.9 },
  },
};

export const DEFAULT_MATERIAL: GlassMaterial = PRESETS.regular.material;

export function cloneMaterial(m: GlassMaterial): GlassMaterial {
  return { ...m, tint: [...m.tint] };
}

/**
 * Cauchy fit through n_d with the dispersion n_F − n_C = (n_d − 1) / V, evaluated at `nm`.
 */
export function iorAt(ior: number, abbe: number, nm: number): number {
  if (abbe >= ABBE_OFF) return ior;
  const um = (x: number) => (x / 1000) ** 2;
  const b = (ior - 1) / abbe / (1 / um(486.1) - 1 / um(656.3));
  const a = ior - b / um(587.6);
  return a + b / um(nm);
}

/** The wavelengths the lab assigns to R, G and B (three-sample dispersion). */
export const CHANNEL_NM = [610, 550, 465] as const;

export function channelIors(ior: number, abbe: number): [number, number, number] {
  return [iorAt(ior, abbe, CHANNEL_NM[0]), iorAt(ior, abbe, CHANNEL_NM[1]), iorAt(ior, abbe, CHANNEL_NM[2])];
}
