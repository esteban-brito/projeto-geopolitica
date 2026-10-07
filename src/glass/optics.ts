import { channelIors, type GlassMaterial, type Profile } from "./material.ts";
import { clampedRadius, type Shape } from "./shape.ts";

/** Maximum compression the refraction may apply: below 1 keeps the sample mapping one-to-one. */
export const MAX_COMPRESSION = 0.88;
/** Profiles are evaluated from half a device pixel inside the border: the AA band covers the rest. */
export const EDGE_START_PX = 0.5;
/** Steepest exit ray allowed through the gap (tan 70°); grazing rays carry no light anyway. */
export const MAX_EXIT_TAN = 2.75;

/** CPU mirror of `profile_eval` in glass.wgsl: height in [0,1] and its derivative over x in [0,1]. */
export function profileEval(profile: Profile, x: number): [number, number] {
  if (profile === "circle") {
    const u = 1 - x;
    const f = Math.sqrt(Math.max(1 - u * u, 1e-6));
    return [f, u / f];
  }
  if (profile === "lip") {
    const [convex, cvd] = squircle(2 * x);
    const convexD = 2 * cvd;
    const u = 1 - x;
    const circ = Math.sqrt(Math.max(1 - u * u, 1e-6));
    const concave = 1 - circ + 0.1;
    const concaveD = -u / circ;
    const s = x * x * x * (x * (6 * x - 15) + 10);
    const sd = 30 * x * x * (x * (x - 2) + 1);
    return [convex * (1 - s) + concave * s, convexD * (1 - s) + concaveD * s + (concave - convex) * sd];
  }
  return squircle(x);
}

function squircle(x: number): [number, number] {
  const u = 1 - x;
  const u3 = u * u * u;
  const inner = Math.max(1 - u3 * u, 1e-6);
  return [inner ** 0.25, u3 * inner ** -0.75];
}

export interface RadialSample {
  /** Displacement along the outward normal, device px (negative = sampled inward). */
  offset: number;
  /** Fraction of light that crosses both faces (Fresnel). */
  transmission: number;
  /** Length of the ray inside the glass, device px (Beer–Lambert). */
  path: number;
}

/**
 * Two-interface refraction along one radial section. View ray straight down, refract into the
 * glass at the curved top, cross to the flat base, refract back into air, cross the gap. Kube stops
 * at the base with no gap; the second interface and the gap are this lab's extension.
 */
export function radialSample(slope: number, height: number, thickness: number, gap: number, ior: number): RadialSample {
  const nLen = Math.hypot(slope, 1);
  const nx = slope / nLen;
  const nz = 1 / nLen;
  const eta = 1 / ior;
  const cosIn = nz;
  const k1 = 1 - eta * eta * (1 - cosIn * cosIn);
  const a = eta * -cosIn + Math.sqrt(k1);
  const tx = -a * nx;
  const tz = -eta - a * nz;
  const path = (height + thickness) / Math.max(-tz, 1e-4);
  const o1 = tx * path;

  const f0 = ((ior - 1) / (ior + 1)) ** 2;
  const transIn = 1 - schlick(f0, cosIn);
  const cosG = -tz;
  const k2 = 1 - ior * ior * (1 - cosG * cosG);
  if (k2 <= 0) return { offset: o1, transmission: 0, path };
  const exitCos = Math.sqrt(k2);
  const ax = ior * tx;
  const tan = Math.min(Math.abs(ax) / exitCos, MAX_EXIT_TAN);
  const o2 = Math.sign(ax) * tan * gap;
  return { offset: o1 + o2, transmission: transIn * (1 - schlick(f0, exitCos)), path };
}

function schlick(f0: number, cos: number): number {
  const m = 1 - Math.max(0, Math.min(1, cos));
  return f0 + (1 - f0) * m * m * m * m * m;
}

/** Samples per surface in the radial table; denser near the border (depth ∝ u²). */
export const TABLE_SAMPLES = 64;
/**
 * Floats per sample: [offset G, transmission, profile slope, height, offset R, offset B, path, -].
 * Offsets are along the outward normal, device px; each channel has its own ior and its own guard.
 * Six spectral samples instead of three channels were tried for Ultra and rejected: against R, G,
 * B they changed at most 5 of 255 levels on Crystal (docs/research §13).
 */
export const TABLE_STRIDE = 8;

export interface GuardStats {
  /** Steepest |d offset / d depth| of the raw physics, among samples that carry light. */
  rawSlope: number;
  /** Device pixels from the border where the envelope replaced the physics. */
  compressedBand: number;
  /** True when the corner constraint clipped some sample. */
  cornerBound: boolean;
}

export interface RadialTable {
  data: Float32Array<ArrayBuffer>;
  stats: GuardStats;
}

/** Depth (device px) of table sample `i` for a bevel of `bevel` device px. */
export function tableDepth(i: number, bevel: number): number {
  const u = i / (TABLE_SAMPLES - 1);
  return EDGE_START_PX + (bevel - EDGE_START_PX) * u * u;
}

/**
 * Radial refraction table of one surface: the physics of `radialSample` at TABLE_SAMPLES depths,
 * then the injectivity guard. A pixel at inward depth s samples the content at depth
 * S(s) = s − o(s). Thick glass makes S fall toward the border — the image folds, as it does at
 * the edge of a real slab. The guard keeps the physics wherever S already rises and, walking from
 * the inner end outward, caps S so it keeps falling by at least (1 − MAX_COMPRESSION) per pixel:
 * the fold becomes the strongest allowed compression instead of a mirror. In a convex corner of
 * radius R the shift is also capped at MAX_COMPRESSION·(R − s), so it never crosses the corner
 * centre. A uniform scale was tried first and rejected: with the default material it had to drop
 * the whole refraction to 2.5% to remove a fold confined to the outer 10 px.
 */
export function buildRadialTable(material: GlassMaterial, shape: Shape, dpr: number, guard = true): RadialTable {
  const data = new Float32Array(TABLE_SAMPLES * TABLE_STRIDE);
  const { bevel, radius } = deviceGeometry(material, shape, dpr);
  const stats: GuardStats = { rawSlope: 0, compressedBand: 0, cornerBound: false };
  const iors = channelIors(material.ior, material.abbe);
  const T = material.thickness * dpr;
  const G = material.gap * dpr;
  if (bevel <= EDGE_START_PX + 1e-3) {
    const flat = radialSample(0, 0, T, G, iors[1]);
    for (let i = 0; i < TABLE_SAMPLES; i++) data.set([0, flat.transmission, 0, 0, 0, 0, flat.path, 0], i * TABLE_STRIDE);
    return { data, stats };
  }

  // Channels R, G, B, each written to its own slot.
  const channels = iors;
  const slots = [4, 0, 5];
  const depth: number[] = [];
  const offsets: number[][] = channels.map(() => []);
  for (let i = 0; i < TABLE_SAMPLES; i++) {
    const s = tableDepth(i, bevel);
    const [f, fp] = profileEval(material.profile, s / bevel);
    const h = f * bevel;
    const samples = channels.map((n) => radialSample(fp, h, T, G, n));
    const g = samples[1]!;
    depth.push(s);
    const o = i * TABLE_STRIDE;
    data.set([g.offset, g.transmission, fp, h], o);
    data[o + 6] = g.path;
    samples.forEach((r, c) => {
      offsets[c]!.push(r.offset);
      data[o + slots[c]!] = r.offset;
    });
    if (i > 0) {
      const tPrev = data[(i - 1) * TABLE_STRIDE + 1]!;
      if (Math.min(tPrev, g.transmission) >= 0.05) {
        const prev = offsets[1]![i - 1]!;
        stats.rawSlope = Math.max(stats.rawSlope, Math.abs((g.offset - prev) / (s - depth[i - 1]!)));
      }
    }
  }
  if (!guard) return { data, stats };

  for (let c = 0; c < channels.length; c++) {
    const guarded = envelope(depth, offsets[c]!, radius, stats, c === 1);
    guarded.forEach((o, i) => (data[i * TABLE_STRIDE + slots[c]!] = o));
  }
  return { data, stats };
}

/** Injectivity guard on one channel: see buildRadialTable. Returns guarded offsets. */
function envelope(depth: number[], offset: number[], radius: number, stats: GuardStats, record: boolean): number[] {
  const minRise = 1 - MAX_COMPRESSION;
  const reach = depth.map((s, i) => s - offset[i]!);
  for (let i = depth.length - 1; i >= 0; i--) {
    const s = depth[i]!;
    let S = reach[i]!;
    if (radius > 0 && s < radius) {
      const cap = s + MAX_COMPRESSION * (radius - s);
      if (S > cap) {
        S = cap;
        if (record) stats.cornerBound = true;
      }
    }
    if (i < depth.length - 1) {
      const limit = reach[i + 1]! - minRise * (depth[i + 1]! - s);
      if (S > limit) {
        S = limit;
        if (record) stats.compressedBand = Math.max(stats.compressedBand, s);
      }
    }
    reach[i] = S;
  }
  return depth.map((s, i) => s - reach[i]!);
}

/** Linear lookup in a table, mirroring `table_lookup` in glass.wgsl. Returns TABLE_STRIDE floats. */
export function tableLookup(table: Float32Array<ArrayBuffer>, bevel: number, depth: number): number[] {
  const at = (i: number) => Array.from(table.subarray(i * TABLE_STRIDE, (i + 1) * TABLE_STRIDE));
  if (bevel <= EDGE_START_PX + 1e-3) return at(0);
  if (depth >= bevel) {
    // The flat top: no slope, no offset on any channel.
    const last = at(TABLE_SAMPLES - 1);
    return last.map((v, k) => (k === 1 || k === 3 || k === 6 ? v : 0));
  }
  const u = Math.sqrt(Math.max(0, (depth - EDGE_START_PX) / (bevel - EDGE_START_PX)));
  const x = u * (TABLE_SAMPLES - 1);
  const i0 = Math.min(TABLE_SAMPLES - 2, Math.floor(x));
  const t = x - i0;
  const a = at(i0);
  const b = at(i0 + 1);
  return a.map((v, k) => v * (1 - t) + b[k]! * t);
}

/** Device-pixel bevel and corner radius exactly as the shader will see them. */
export function deviceGeometry(material: GlassMaterial, shape: Shape, dpr: number): { bevel: number; radius: number } {
  const radius = clampedRadius(shape) * dpr;
  const minHalf = Math.min(shape.halfWidth, shape.halfHeight) * dpr;
  const bevel = Math.max(0, Math.min(material.bevel * dpr, radius > 0 ? radius : minHalf, minHalf));
  return { bevel, radius };
}

/**
 * Shadow of a surface floating `gap` device px above the content: it falls further down and
 * softens as the glass rises. Device px.
 */
export function shadowGeometry(gap: number, dpr: number): { offsetY: number; sigma: number } {
  return { offsetY: 1 + gap * 0.55, sigma: 1.5 * dpr + gap * 0.85 };
}
