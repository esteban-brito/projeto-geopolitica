export type Profile = "squircle" | "circle" | "lip";

export const PROFILE_INDEX: Record<Profile, number> = { squircle: 0, circle: 1, lip: 2 };

/**
 * Optical material. Lengths are CSS pixels and become device pixels when packed. Everything that
 * can be derived from these (F0 from ior, exit transmission, the injectivity scale) is derived,
 * not exposed.
 */
export interface GlassMaterial {
  /** Index of refraction of the glass. */
  ior: number;
  /** Flat slab thickness under the bevel (T). */
  thickness: number;
  /** Height the glass floats above the content (G). */
  gap: number;
  /** Width of the curved band along the border; capped by the corner radius. */
  bevel: number;
  profile: Profile;
}

export const DEFAULT_MATERIAL: GlassMaterial = {
  ior: 1.5,
  thickness: 14,
  gap: 8,
  bevel: 22,
  profile: "squircle",
};
