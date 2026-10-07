import { shapeField, type Shape } from "./shape.ts";

/**
 * Smooth union of the glass surfaces in one group — CPU mirror of `union_field` in glass.wgsl.
 *
 * The members are folded in order with Inigo Quilez's cubic smooth minimum, which is C²: the
 * refraction follows the curvature of the surface, and a C¹ union (the quadratic smin) leaves a
 * crease in the refracted image. With this normalisation `k` is the deepest the union sinks below
 * min(a, b) (at a = b), so two shapes start to touch when the gap between them is 2k, and a member
 * stops affecting the field once it is 6k farther than the rest.
 *
 * The gradient of the union is exact, not a finite difference: d smin / d b = t, so the gradient is
 * the running mix of the members' gradients by t. Its length falls below 1 where two members pull
 * against each other, and reaches 0 on the ridge of a neck. The glass surface is h(−union), whose
 * slope is h′ · |∇union|: the shader scales the radial table's offset and slope by that length,
 * which is exact to first order in the slope and keeps the ridge of a neck smooth instead of
 * creased.
 */

/** Members that can share one pixel's optics; more than this at one pixel drops the weakest. */
export const MAX_BLEND = 4;

/** Cubic smin and its derivative with respect to `b`. `k` ≤ 0 is the hard minimum. */
export function sminCubic(a: number, b: number, k: number): [value: number, t: number] {
  if (k <= 0) return b < a ? [b, 1] : [a, 0];
  const h = Math.max(6 * k - Math.abs(a - b), 0) / (6 * k);
  const value = Math.min(a, b) - h * h * h * k;
  return [value, a < b ? (h * h) / 2 : 1 - (h * h) / 2];
}

export interface UnionSample {
  /** Union value: signed, negative inside, not renormalised (depth for the radial table). */
  d: number;
  /** Exact gradient of the union; |g| ≤ 1. */
  gx: number;
  gy: number;
  /** Members whose optics this pixel blends, with weights that sum to 1. */
  blend: { index: number; weight: number }[];
}

export function unionField(shapes: readonly Shape[], k: number, x: number, y: number): UnionSample {
  let d = 0;
  let gx = 0;
  let gy = 0;
  let entries: { index: number; t: number }[] = [];
  shapes.forEach((shape, j) => {
    const f = shapeField(shape, x, y);
    let t: number;
    if (j === 0) {
      d = f.d;
      t = 1;
    } else {
      [d, t] = sminCubic(d, f.d, k);
    }
    if (t <= 0) return;
    gx += (f.gx - gx) * t;
    gy += (f.gy - gy) * t;
    if (t >= 1) entries = [];
    if (entries.length === MAX_BLEND) {
      const w = chainWeights(entries);
      entries.splice(w.indexOf(Math.min(...w)), 1);
    }
    entries.push({ index: j, t });
  });
  const w = chainWeights(entries);
  const sum = w.reduce((a, b) => a + b, 0) || 1;
  return { d, gx, gy, blend: entries.map((e, i) => ({ index: e.index, weight: w[i]! / sum })) };
}

/** Final weight of each entry of a mix chain: its own t times (1 − t) of every later entry. */
function chainWeights(entries: readonly { t: number }[]): number[] {
  const w = new Array<number>(entries.length);
  let carry = 1;
  for (let i = entries.length - 1; i >= 0; i--) {
    w[i] = entries[i]!.t * carry;
    carry *= 1 - entries[i]!.t;
  }
  return w;
}
