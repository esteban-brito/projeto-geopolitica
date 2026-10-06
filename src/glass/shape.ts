/**
 * One descriptor for every form the lab morphs between. Circle, capsule, rounded rectangle,
 * squircle and panel differ only in these numbers, so a morph is a spring on each field.
 * Units: CSS pixels, radians.
 */
export interface Shape {
  cx: number;
  cy: number;
  halfWidth: number;
  halfHeight: number;
  /** Corner radius, clamped to the smaller half extent. */
  radius: number;
  /** Superellipse exponent of the corner: 2 is circular, ~4 is the iOS-like squircle. */
  exponent: number;
  rotation: number;
}

export type ShapeKind = "circle" | "capsule" | "rounded" | "squircle" | "panel";

export function shapeOf(kind: ShapeKind, cx: number, cy: number): Shape {
  switch (kind) {
    case "circle":
      return { cx, cy, halfWidth: 88, halfHeight: 88, radius: 88, exponent: 2, rotation: 0 };
    case "capsule":
      return { cx, cy, halfWidth: 150, halfHeight: 44, radius: 44, exponent: 2, rotation: 0 };
    case "rounded":
      return { cx, cy, halfWidth: 150, halfHeight: 96, radius: 40, exponent: 2, rotation: 0 };
    case "squircle":
      return { cx, cy, halfWidth: 96, halfHeight: 96, radius: 72, exponent: 4, rotation: 0 };
    case "panel":
      return { cx, cy, halfWidth: 240, halfHeight: 150, radius: 36, exponent: 3.2, rotation: 0 };
  }
}

export function clampedRadius(shape: Shape): number {
  return Math.max(0, Math.min(shape.radius, shape.halfWidth, shape.halfHeight));
}

/**
 * CPU mirror of `shape_sdf` in glass.wgsl (Euclidean-corrected superellipse rectangle), used for
 * hit testing. Returns the signed distance in the same units as the shape.
 */
export function shapeDistance(shape: Shape, x: number, y: number): number {
  const c = Math.cos(shape.rotation);
  const s = Math.sin(shape.rotation);
  const dx = x - shape.cx;
  const dy = y - shape.cy;
  const px = Math.abs(c * dx + s * dy);
  const py = Math.abs(-s * dx + c * dy);
  const r = clampedRadius(shape);
  const qx = px - shape.halfWidth + r;
  const qy = py - shape.halfHeight + r;
  const mx = Math.max(qx, 0);
  const my = Math.max(qy, 0);
  const inside = Math.min(Math.max(qx, qy), 0);
  const peak = Math.max(mx, my);
  if (peak <= 0) return inside - r;
  const n = shape.exponent;
  const ax = mx / peak;
  const ay = my / peak;
  const sum = ax ** n + ay ** n;
  const norm = peak * sum ** (1 / n);
  const gx = ax ** (n - 1) / sum ** ((n - 1) / n);
  const gy = ay ** (n - 1) / sum ** ((n - 1) / n);
  const g = Math.hypot(gx, gy) || 1;
  return (norm - r) / g + inside;
}
