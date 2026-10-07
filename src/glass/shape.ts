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
  /** Stretch along `angle` that preserves area (×(1+amount) along, ÷(1+amount) across). Physics only. */
  stretch?: { amount: number; angle: number } | undefined;
  /** Uniform scale around the centre (press, bounce). Physics only. */
  scale?: number | undefined;
}

/** Row-major 2×2 [m00, m01, m10, m11] taking local shape space to screen space. */
export type Mat2 = [number, number, number, number];

/** M = R(rotation) · scale · R(φ) · diag(1+a, 1/(1+a)) · R(−φ). */
export function shapeMatrix(shape: Shape): Mat2 {
  const k = shape.scale ?? 1;
  let d: Mat2 = [k, 0, 0, k];
  if (shape.stretch && shape.stretch.amount > 0) {
    const along = 1 + shape.stretch.amount;
    const across = 1 / along;
    const c = Math.cos(shape.stretch.angle);
    const s = Math.sin(shape.stretch.angle);
    d = [
      k * (c * c * along + s * s * across),
      k * (c * s * (along - across)),
      k * (c * s * (along - across)),
      k * (s * s * along + c * c * across),
    ];
  }
  const c = Math.cos(shape.rotation);
  const s = Math.sin(shape.rotation);
  return [c * d[0] - s * d[2], c * d[1] - s * d[3], s * d[0] + c * d[2], s * d[1] + c * d[3]];
}

export function invert(m: Mat2): Mat2 {
  const det = m[0] * m[3] - m[1] * m[2];
  const inv = Math.abs(det) > 1e-12 ? 1 / det : 0;
  return [m[3] * inv, -m[1] * inv, -m[2] * inv, m[0] * inv];
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

export interface ShapeField {
  /** Signed distance, Euclidean to first order; negative inside. */
  d: number;
  /** Outward unit normal of the iso-line, screen space. */
  gx: number;
  gy: number;
}

/**
 * CPU mirror of `shape_sdf` in glass.wgsl (Euclidean-corrected superellipse rectangle under the
 * shape's affine map). Same units as the shape.
 */
export function shapeField(shape: Shape, x: number, y: number): ShapeField {
  const inv = invert(shapeMatrix(shape));
  const dx = x - shape.cx;
  const dy = y - shape.cy;
  const lx = inv[0] * dx + inv[1] * dy;
  const ly = inv[2] * dx + inv[3] * dy;
  const sgx = lx >= 0 ? 1 : -1;
  const sgy = ly >= 0 ? 1 : -1;
  const px = Math.abs(lx);
  const py = Math.abs(ly);
  const r = clampedRadius(shape);
  const qx = px - shape.halfWidth + r;
  const qy = py - shape.halfHeight + r;
  const mx = Math.max(qx, 0);
  const my = Math.max(qy, 0);
  const peak = Math.max(mx, my);
  let d: number;
  let gx: number;
  let gy: number;
  if (peak <= 0) {
    d = Math.max(qx, qy) - r;
    [gx, gy] = qx > qy ? [1, 0] : [0, 1];
  } else {
    const n = shape.exponent;
    const ax = Math.max(mx / peak, 1e-6);
    const ay = Math.max(my / peak, 1e-6);
    const sum = ax ** n + ay ** n;
    const norm = peak * sum ** (1 / n);
    const px1 = ax ** (n - 1) / sum ** ((n - 1) / n);
    const py1 = ay ** (n - 1) / sum ** ((n - 1) / n);
    const gl = Math.max(Math.hypot(px1, py1), 1e-4);
    d = (norm - r) / gl;
    gx = px1 / gl;
    gy = py1 / gl;
  }
  gx *= sgx;
  gy *= sgy;
  const wx = inv[0] * gx + inv[2] * gy;
  const wy = inv[1] * gx + inv[3] * gy;
  const wl = Math.max(Math.hypot(wx, wy), 1e-6);
  return { d: d / wl, gx: wx / wl, gy: wy / wl };
}

/** Signed distance only (hit testing). */
export function shapeDistance(shape: Shape, x: number, y: number): number {
  return shapeField(shape, x, y).d;
}

/** Half extents of the axis-aligned box around the drawn shape (rotation, press, stretch). */
export function shapeExtent(shape: Shape): [number, number] {
  const m = shapeMatrix(shape);
  return [
    Math.abs(m[0]) * shape.halfWidth + Math.abs(m[1]) * shape.halfHeight,
    Math.abs(m[2]) * shape.halfWidth + Math.abs(m[3]) * shape.halfHeight,
  ];
}
