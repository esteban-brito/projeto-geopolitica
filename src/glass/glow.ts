/**
 * Light from a touch, inside the glass (WWDC25 "Meet Liquid Glass": the material "illuminates from
 * within… starting right under your fingertips, the glow spreads throughout the element and onto
 * any Liquid Glass elements nearby"). Mirror of `touch_glow` and the glow term of `shade` in
 * glass.wgsl; how a light moves and spreads over time is physics (src/physics/touch.ts).
 *
 * A light is a Gaussian in screen space. Summing every light at every glass pixel is what carries
 * the glow onto neighbouring glasses with no special case, and it stays on the glass: the content
 * between two glasses is never lit.
 */
export interface TouchLight {
  /** Centre and radius: CSS px in the app, device px once the renderer packs them. */
  x: number;
  y: number;
  radius: number;
  /** Strength at the centre, 0..1. */
  intensity: number;
}

export const MAX_TOUCH_LIGHTS = 4;
/** Linear radiance a light adds at its centre on a flat top, at intensity 1. */
export const GLOW_RADIANCE = 0.32;
/**
 * Share the flat top shows. Light scattered inside the slab is trapped by total internal
 * reflection and escapes where the surface bends, so the rim glows brighter (1 at a vertical rim).
 */
export const GLOW_FLAT = 0.55;

/** Σ intensity · exp(−(d / radius)²) over the lights. */
export function glowField(lights: readonly TouchLight[], x: number, y: number): number {
  let sum = 0;
  for (const t of lights.slice(0, MAX_TOUCH_LIGHTS)) {
    const qx = (x - t.x) / t.radius;
    const qy = (y - t.y) / t.radius;
    sum += t.intensity * Math.exp(-(qx * qx + qy * qy));
  }
  return sum;
}

/** Linear light added to a glass pixel whose normal has z component `normalZ`. */
export function glowLight(field: number, normalZ: number): number {
  return GLOW_RADIANCE * field * (GLOW_FLAT + (1 - GLOW_FLAT) * Math.sqrt(Math.max(0, 1 - normalZ)));
}
