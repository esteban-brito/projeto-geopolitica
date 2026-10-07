// Glass surfaces: one quad per record around its members, their merge reach and their shadow.
// Two entry points share everything after the geometry: fs_single for a surface on its own (most
// of them), fs_union for a merge group. They are separate pipelines because a shader's register
// budget is set by its heaviest path: with one entry point, every lone glass paid for the union's
// bookkeeping (+70% per pixel on an RX 6600). Units are device pixels; z points at the viewer.
// Light math is linear (sRGB texture + sRGB view).
//
// The radial optics (two-interface refraction per colour channel, Fresnel transmission, optical
// path, injectivity guard) are computed on the CPU per surface — src/glass/optics.ts,
// buildRadialTable — and read here from a table indexed by depth. The guard is a cumulative pass
// along the whole bevel, which a per-pixel shader cannot do. The smooth union of a group mirrors
// src/glass/union.ts.

struct Globals {
  viewport: vec2f,
  invViewport: vec2f,
  dpr: f32,
  time: f32,
  debugView: u32,
  edgeStart: f32,
  features: u32,
}

struct Surface {
  geom: vec4f,     // centre.xy, half extents.xy
  corner: vec4f,   // radius, superellipse exponent, shadow offset y, shadow sigma
  optics: vec4f,   // bevel, thickness T, gap G, ior
  shading: vec4f,  // roughness, edge contrast, shadow strength, environment
  medium: vec4f,   // absorption per device px (r, g, b), key light
  light: vec4f,    // direction the key light comes from (screen xy), blur radius px, F0
  xform: vec4f,    // inverse of the shape matrix (rotation · press scale · stretch), row-major 2×2
  policy: vec4f,   // Regular adaptation strength (0 = Clear), appearance 0 light..1 dark (< 0: from metrics), -, -
}

// Members [start, start + count) of the surface array merge with each other and with nothing else.
// A lone surface is a record with count 1.
struct Group {
  bounds: vec4f,   // min.xy, max.xy: members + reach, computed on the CPU
  start: u32,
  count: u32,
  k: f32,          // smooth-union depth; the gap at which two members touch is 2k. 0 = no merging
  reach: f32,      // past this (a lower bound of the union) a pixel is neither glass nor shadow
}

@group(0) @binding(0) var<uniform> globals: Globals;
@group(0) @binding(1) var<storage, read> surfaces: array<Surface>;
@group(0) @binding(2) var bgTex: texture_2d<f32>;
@group(0) @binding(3) var bgSampler: sampler;
@group(0) @binding(4) var<storage, read> tables: array<vec4f>;
@group(0) @binding(5) var<storage, read> groups: array<Group>;
// Backdrop statistics per surface (cs_metrics, earlier in the same frame): mean L*, p10, p90, coverage.
@group(0) @binding(6) var<storage, read> backdrop: array<vec4f>;

// Quality features (src/renderer/quality.ts).
const FEATURE_DISPERSION: u32 = 1u;
const FEATURE_BICUBIC: u32 = 2u;

const TABLE_SAMPLES: u32 = 64u;
const MAX_COMPRESSION: f32 = 0.88;
const MAX_BLEND: u32 = 4u;
const BACK_LIGHT: f32 = 0.38;
// The key light is a soft box of angular radius LIGHT_RADIUS: its reflection is the set of normals
// within that angle of the half vector — a band that follows the bevel, zero on the flat top. A GGX
// lobe widened to the same size was tried first: its tail lit the whole flat top (0.12 → 0.34 on a
// dark background). LIGHT_RADIANCE is the source's brightness relative to the content (HDR).
const LIGHT_RADIUS: f32 = 0.22;
const LIGHT_RADIANCE: f32 = 18.0;

const DEBUG_SDF: u32 = 1u;
const DEBUG_NORMAL: u32 = 2u;
const DEBUG_OFFSET: u32 = 3u;
const DEBUG_INJECTIVITY: u32 = 4u;
const DEBUG_TRANSMISSION: u32 = 5u;
const DEBUG_THICKNESS: u32 = 6u;
const DEBUG_SAMPLE: u32 = 7u;
const DEBUG_FRESNEL: u32 = 8u;
const DEBUG_LOD: u32 = 9u;
const DEBUG_SPECULAR: u32 = 10u;
const DEBUG_DISPERSION: u32 = 11u;
const DEBUG_UNION: u32 = 12u;

struct VOut {
  @builtin(position) pos: vec4f,
  @location(0) @interpolate(flat) instance: u32,
}

@vertex
fn vs_main(@builtin(vertex_index) vi: u32, @builtin(instance_index) ii: u32) -> VOut {
  let b = groups[ii].bounds;
  var corners = array<vec2f, 6>(
    vec2f(0.0, 0.0), vec2f(1.0, 0.0), vec2f(0.0, 1.0),
    vec2f(0.0, 1.0), vec2f(1.0, 0.0), vec2f(1.0, 1.0),
  );
  let px = mix(b.xy, b.zw, corners[vi]);
  let ndc = px * globals.invViewport * 2.0 - 1.0;
  var out: VOut;
  out.pos = vec4f(ndc.x, -ndc.y, 0.0, 1.0);
  out.instance = ii;
  return out;
}

struct SdfSample {
  d: f32,      // signed distance, Euclidean to first order
  grad: vec2f, // outward unit normal of the iso-line, screen space
}

// Rectangle with superellipse corners, under an affine map (rotation, press scale, stretch). The
// p-norm field has iso-lines that are shrunken superellipses, so its gradient stays smooth while
// depth < radius; dividing by |M⁻ᵀ ∇| restores screen-space Euclidean distance to first order, which
// also undoes the stretch. Keeping bevel <= radius therefore leaves no crease on the diagonal.
// CPU mirror: shapeField in src/glass/shape.ts.
fn shape_sdf(s: Surface, pix: vec2f) -> SdfSample {
  let inv = s.xform;
  let rel = pix - s.geom.xy;
  let local = vec2f(inv.x * rel.x + inv.y * rel.y, inv.z * rel.x + inv.w * rel.y);
  let sgn = select(vec2f(-1.0), vec2f(1.0), local >= vec2f(0.0));
  let p = abs(local);
  let half = s.geom.zw;
  let r = clamp(s.corner.x, 0.0, min(half.x, half.y));
  let q = p - half + r;
  let m = max(q, vec2f(0.0));
  let peak = max(m.x, m.y);

  var d: f32;
  var g: vec2f;
  if (peak <= 0.0) {
    d = max(q.x, q.y) - r;
    g = select(vec2f(0.0, 1.0), vec2f(1.0, 0.0), q.x > q.y);
  } else if (s.corner.y == 2.0) {
    // Circular corner, the common case: the p-norm is the Euclidean length (same values, no pow).
    let norm = length(m);
    d = norm - r;
    g = m / norm;
  } else {
    let n = s.corner.y;
    let a = max(m / peak, vec2f(1e-6));
    let sum = pow(a.x, n) + pow(a.y, n);
    let norm = peak * pow(sum, 1.0 / n);
    let gp = pow(a, vec2f(n - 1.0)) / pow(sum, (n - 1.0) / n);
    let gl = max(length(gp), 1e-4);
    d = (norm - r) / gl;
    g = gp / gl;
  }
  let gs = g * sgn;
  let gw = vec2f(inv.x * gs.x + inv.z * gs.y, inv.y * gs.x + inv.w * gs.y);
  let gwl = max(length(gw), 1e-6);
  return SdfSample(d / gwl, gw / gwl);
}

struct Radial {
  offsetG: f32,      // along the outward normal; negative = light comes from further inside
  transmission: f32, // Fresnel transmission through top and base
  slope: f32,        // dh/ds of the profile
  height: f32,       // bevel height above the flat slab
  offsetR: f32,
  offsetB: f32,
  path: f32,         // length of the ray inside the glass
}

const TABLE_VEC4: u32 = 2u;

// Where a depth falls in the table, which is dense near the border (depth ∝ u²).
struct TableCoord {
  i0: u32,
  t: f32,
}

fn table_coord(bevel: f32, depth: f32) -> TableCoord {
  let edge = globals.edgeStart;
  let u = sqrt(max(0.0, (depth - edge) / (bevel - edge)));
  let x = u * f32(TABLE_SAMPLES - 1u);
  let i0 = min(u32(floor(x)), TABLE_SAMPLES - 2u);
  return TableCoord(i0, x - f32(i0));
}

// Two vec4 per sample (TABLE_STRIDE in optics.ts). CPU mirror: tableLookup in optics.ts.
fn table_lookup(instance: u32, bevel: f32, depth: f32) -> Radial {
  let base = instance * TABLE_SAMPLES * TABLE_VEC4;
  let edge = globals.edgeStart;
  if (bevel <= edge + 1e-3) {
    let a = tables[base];
    let b = tables[base + 1u];
    return Radial(a.x, a.y, a.z, a.w, b.x, b.y, b.z);
  }
  if (depth >= bevel) {
    let a = tables[base + (TABLE_SAMPLES - 1u) * TABLE_VEC4];
    let b = tables[base + (TABLE_SAMPLES - 1u) * TABLE_VEC4 + 1u];
    return Radial(0.0, a.y, 0.0, a.w, 0.0, 0.0, b.z);
  }
  let c = table_coord(bevel, depth);
  let at = base + c.i0 * TABLE_VEC4;
  let a = mix(tables[at], tables[at + TABLE_VEC4], c.t);
  let b = mix(tables[at + 1u], tables[at + TABLE_VEC4 + 1u], c.t);
  return Radial(a.x, a.y, a.z, a.w, b.x, b.y, b.z);
}

// Uniform cubic B-spline from 4 bilinear taps (Ruijters et al.): no blocks when a high mip is
// stretched over a large area.
fn sample_bicubic(uv: vec2f, lod: f32) -> vec3f {
  let size = vec2f(textureDimensions(bgTex, u32(floor(lod))));
  let coord = uv * size - 0.5;
  let index = floor(coord);
  let f = coord - index;
  let f2 = f * f;
  let f3 = f2 * f;
  let w0 = (1.0 - 3.0 * f + 3.0 * f2 - f3) / 6.0;
  let w1 = (4.0 - 6.0 * f2 + 3.0 * f3) / 6.0;
  let w2 = (1.0 + 3.0 * f + 3.0 * f2 - 3.0 * f3) / 6.0;
  let w3 = f3 / 6.0;
  let g0 = w0 + w1;
  let g1 = w2 + w3;
  let h0 = (index - 0.5 + w1 / g0) / size;
  let h1 = (index + 1.5 + w3 / g1) / size;
  let t00 = textureSampleLevel(bgTex, bgSampler, vec2f(h0.x, h0.y), lod).rgb;
  let t10 = textureSampleLevel(bgTex, bgSampler, vec2f(h1.x, h0.y), lod).rgb;
  let t01 = textureSampleLevel(bgTex, bgSampler, vec2f(h0.x, h1.y), lod).rgb;
  let t11 = textureSampleLevel(bgTex, bgSampler, vec2f(h1.x, h1.y), lod).rgb;
  return g0.y * (g0.x * t00 + g1.x * t10) + g1.y * (g0.x * t01 + g1.x * t11);
}

fn sample_content(px: vec2f, lod: f32) -> vec3f {
  let uv = px * globals.invViewport;
  if (lod < 0.75 || (globals.features & FEATURE_BICUBIC) == 0u) {
    return textureSampleLevel(bgTex, bgSampler, uv, lod).rgb;
  }
  return sample_bicubic(uv, lod);
}

// ---- Smooth union of a group (CPU mirror: src/glass/union.ts) -------------------------------

// Cubic smooth minimum (C²) and its derivative with respect to b: (value, t).
fn smin_cubic(a: f32, b: f32, k: f32) -> vec2f {
  if (k <= 0.0) {
    return select(vec2f(a, 0.0), vec2f(b, 1.0), b < a);
  }
  let h = max(6.0 * k - abs(a - b), 0.0) / (6.0 * k);
  return vec2f(min(a, b) - h * h * h * k, select(1.0 - h * h * 0.5, h * h * 0.5, a < b));
}

// Material of a pixel: the members' parameters mixed by the same weights as their gradients, so a
// tinted glass merging with a clear one blends across the neck.
struct Blend {
  corner: vec4f,
  optics: vec4f,
  shading: vec4f,
  medium: vec4f,
  light: vec4f,
  policy: vec4f,
}

// ---- Regular's legibility policy (CPU mirror: src/glass/policy.ts) ---------------------------

const DARK_BELOW: f32 = 42.0;
const LIGHT_ABOVE: f32 = 58.0;
const LIGHT_RANGE = vec2f(0.3, 1.0);
const DARK_RANGE = vec2f(0.0, 0.2);
const VIBRANCY: f32 = 0.35;
const LUMA = vec3f(0.2126, 0.7152, 0.0722);

// Appearance nobody animates (tests, bench): from the measured mean lightness, no memory.
fn stateless_appearance(meanL: f32) -> f32 {
  return 1.0 - smoothstep(DARK_BELOW, LIGHT_ABOVE, meanL);
}

// A surface's policy with the appearance resolved: the app's animated value, or the measurement.
fn resolved_policy(i: u32, s: Surface) -> vec4f {
  var p = s.policy;
  if (p.y < 0.0) {
    p.y = stateless_appearance(backdrop[i].x);
  }
  return p;
}

// What Regular lets through: the content's range remapped toward the legible side (light
// appearance lifts the darks, dark appearance pulls the lights down), then saturated a little.
fn adapt_light(c: vec3f, adapt: f32, appearance: f32) -> vec3f {
  let range = mix(LIGHT_RANGE, DARK_RANGE, appearance);
  let c1 = mix(c, range.x + (range.y - range.x) * c, adapt);
  let luma = dot(c1, LUMA);
  return max(vec3f(0.0), luma + (c1 - luma) * (1.0 + VIBRANCY * adapt));
}

fn blend_of(i: u32, s: Surface) -> Blend {
  return Blend(s.corner, s.optics, s.shading, s.medium, s.light, resolved_policy(i, s));
}

// Up to MAX_BLEND members whose tables a pixel mixes. Kept in vec4s and written through lane masks:
// an array indexed by a runtime value lands in scratch memory on some GPUs.
struct Union {
  d: f32,              // union value: negative inside; depth for the radial table
  grad: vec2f,         // exact gradient of the union, |grad| <= 1 (0 on the ridge of a neck)
  mat: Blend,
  count: u32,
  index: vec4<u32>,
  weight: vec4f,       // t of each entry while folding, final weights after; 0 past `count`
}

const LANES = vec4<u32>(0u, 1u, 2u, 3u);

// Final weight of each entry of a mix chain: its own t times (1 − t) of every later entry. Empty
// entries have t = 0 and leave the product alone.
fn chain_weights(t: vec4f) -> vec4f {
  let c3 = 1.0 - t.w;
  let c2 = c3 * (1.0 - t.z);
  let c1 = c2 * (1.0 - t.y);
  return vec4f(t.x * c1, t.y * c2, t.z * c3, t.w);
}

// First lane holding the smallest value (the TS mirror's indexOf(min)).
fn weakest(w: vec4f) -> u32 {
  var e = 0u;
  var v = w.x;
  if (w.y < v) {
    e = 1u;
    v = w.y;
  }
  if (w.z < v) {
    e = 2u;
    v = w.z;
  }
  if (w.w < v) {
    e = 3u;
  }
  return e;
}

fn union_field(g: Group, p: vec2f) -> Union {
  var u: Union;
  for (var j = 0u; j < g.count; j++) {
    let i = g.start + j;
    let s = surfaces[i];
    // A member 6k farther than the union so far contributes exactly nothing (t = 0); its box
    // distance, a lower bound of its distance, proves it without evaluating the shape.
    if (j > 0u && box_distance(s, p) >= u.d + 6.0 * g.k) {
      continue;
    }
    let f = shape_sdf(s, p);
    var t = 1.0;
    if (j == 0u) {
      u.d = f.d;
    } else {
      let m = smin_cubic(u.d, f.d, g.k);
      u.d = m.x;
      t = m.y;
    }
    if (t <= 0.0) {
      continue;
    }
    u.grad = mix(u.grad, f.grad, t);
    u.mat.corner = mix(u.mat.corner, s.corner, t);
    u.mat.optics = mix(u.mat.optics, s.optics, t);
    u.mat.shading = mix(u.mat.shading, s.shading, t);
    u.mat.medium = mix(u.mat.medium, s.medium, t);
    u.mat.light = mix(u.mat.light, s.light, t);
    u.mat.policy = mix(u.mat.policy, resolved_policy(i, s), t);
    if (t >= 1.0) {
      u.count = 0u;
      u.weight = vec4f(0.0);
    }
    if (u.count == MAX_BLEND) {
      // Drop the weakest entry: every lane from it on takes the next one.
      let shift = LANES >= vec4<u32>(weakest(chain_weights(u.weight)));
      u.weight = select(u.weight, vec4f(u.weight.yzw, 0.0), shift);
      u.index = select(u.index, vec4<u32>(u.index.yzw, 0u), shift);
      u.count = MAX_BLEND - 1u;
    }
    let slot = LANES == vec4<u32>(u.count);
    u.index = select(u.index, vec4<u32>(i), slot);
    u.weight = select(u.weight, vec4f(t), slot);
    u.count += 1u;
  }
  let w = chain_weights(u.weight);
  u.weight = w / max(w.x + w.y + w.z + w.w, 1e-6);
  return u;
}

// The union value alone, for the shadow (evaluated away from the pixel).
fn union_distance(g: Group, p: vec2f) -> f32 {
  var d = 0.0;
  for (var j = 0u; j < g.count; j++) {
    let s = surfaces[g.start + j];
    if (j > 0u && box_distance(s, p) >= d + 6.0 * g.k) {
      continue;
    }
    let dj = shape_sdf(s, p).d;
    d = select(smin_cubic(d, dj, g.k).x, dj, j == 0u);
  }
  return d;
}

// One pass over the members' boxes (box distance: a lower bound of each member's distance).
struct Nearest {
  index: u32,   // member with the nearest box
  bound: f32,   // the union's chain over the box distances: smin only grows with its arguments,
                // so this is a lower bound of the union — far from all the glass, an early out
  others: f32,  // lower bound of what the members other than `index` can bring, see fs_union
}

fn nearest_member(g: Group, p: vec2f) -> Nearest {
  var chain = 0.0;
  var best = 1e9;
  var index = 0u;
  var before = 1e9;
  var after = 1e9;
  for (var j = 0u; j < g.count; j++) {
    let b = box_distance(surfaces[g.start + j], p);
    if (b < best) {
      // The chain so far bounds the union of the members before this one from below.
      before = select(chain, 1e9, j == 0u);
      after = 1e9;
      best = b;
      index = j;
    } else {
      after = min(after, b);
    }
    chain = select(smin_cubic(chain, b, g.k).x, b, j == 0u);
  }
  return Nearest(index, chain, min(before, after));
}

// Distance from p to the member's bounding box: a lower bound of its distance, for the early out.
fn box_distance(s: Surface, p: vec2f) -> f32 {
  let inv = s.xform;
  let fwd = vec4f(inv.w, -inv.y, -inv.z, inv.x) / (inv.x * inv.w - inv.y * inv.z);
  let half = s.geom.zw;
  let extent = vec2f(abs(fwd.x) * half.x + abs(fwd.y) * half.y, abs(fwd.z) * half.x + abs(fwd.w) * half.y);
  return length(max(abs(p - s.geom.xy) - extent, vec2f(0.0)));
}

fn radial_add(r: Radial, i: u32, w: f32, depth: f32) -> Radial {
  if (w <= 0.0) {
    return r;
  }
  let x = table_lookup(i, surfaces[i].optics.x, depth);
  return Radial(
    r.offsetG + w * x.offsetG, r.transmission + w * x.transmission, r.slope + w * x.slope, r.height + w * x.height,
    r.offsetR + w * x.offsetR, r.offsetB + w * x.offsetB, r.path + w * x.path,
  );
}

// The radial optics of the pixel: each member's own table at the union's depth, mixed by weight.
fn blended_radial(u: Union, depth: f32) -> Radial {
  var r = Radial(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
  r = radial_add(r, u.index.x, u.weight.x, depth);
  r = radial_add(r, u.index.y, u.weight.y, depth);
  r = radial_add(r, u.index.z, u.weight.z, depth);
  r = radial_add(r, u.index.w, u.weight.w, depth);
  return r;
}

// ---- Light ------------------------------------------------------------------------------------

fn schlick(f0: f32, cosine: f32) -> f32 {
  let m = 1.0 - clamp(cosine, 0.0, 1.0);
  let m2 = m * m;
  return f0 + (1.0 - f0) * m2 * m2 * m;
}

// Reflection of a disc light: 1 inside its angular radius, soft edge, widened by roughness and
// dimmed by the same factor so the energy stays put. The edge is wide (0.14 rad): with 0.06 the
// highlight stopped dead where a rim curves away from the light — at a merge neck, a blunt end.
fn disc_light(nh: f32, roughness: f32) -> f32 {
  let radius = LIGHT_RADIUS + roughness * 0.45;
  let feather = 0.14 + roughness * 0.3;
  let lobe = smoothstep(cos(radius + feather), cos(max(radius - feather, 0.0)), nh);
  return lobe * (LIGHT_RADIUS * LIGHT_RADIUS) / (radius * radius);
}

struct Lighting {
  reflected: vec3f,
  specular: f32,
}

// Studio environment: what the glass reflects is the light around it — the content's own average
// colour (top of the pyramid) — dimming toward the horizon, which grazing reflections at the rim
// see. Plus a key light from `light.xy` and a weaker back light from the opposite side (light
// reflected inside the slab off its far face). Highlights therefore sit at top and bottom.
fn lighting(m: Blend, normal: vec3f, roughness: f32, surround: vec3f) -> Lighting {
  let view = vec3f(0.0, 0.0, 1.0);
  let r = reflect(-view, normal);
  let up = clamp(r.z, 0.0, 1.0);
  let ambient = surround * mix(0.3, 1.0, up * up) * m.shading.w;

  let key = normalize(vec3f(m.light.xy * 0.94, 0.34));
  let back = normalize(vec3f(-m.light.xy * 0.94, 0.34));
  let hk = normalize(key + view);
  let hb = normalize(back + view);
  let fk = schlick(m.light.w, dot(view, hk));
  let fb = schlick(m.light.w, dot(view, hb));
  let spec = (fk * disc_light(dot(normal, hk), roughness) + BACK_LIGHT * fb * disc_light(dot(normal, hb), roughness))
    * LIGHT_RADIANCE * m.medium.w;
  return Lighting(ambient, spec);
}

// Gaussian ring at the shifted outline plus a soft outer tail: a transparent slab casts most of
// its shadow where its edge bends light away, not under its flat centre. `d` is the distance of
// the point shifted by the shadow offset; offset and softness come from the gap (shadowGeometry
// in optics.ts).
fn shadow_value(m: Blend, d: f32) -> f32 {
  let sigma = m.corner.w;
  let ring = exp(-(d * d) / (2.0 * sigma * sigma));
  let tail = select(1.0, exp(-d / (sigma * 2.0)), d > 0.0) * 0.35;
  // Fade to exactly zero at 3σ, where the quad and the early out stop drawing: the tail used to be
  // cut there at ~1.3% darkening, a faint step on smooth backgrounds.
  let fade = 1.0 - smoothstep(2.0 * sigma, 3.0 * sigma, d);
  return m.shading.z * clamp(max(ring, tail), 0.0, 1.0) * 0.5 * fade;
}

// Under the glass, deeper than ~1.5σ, the shadow is the constant tail (the ring has fallen below
// it). The union and the SDF change by at most 1 per pixel, so if the pixel's own depth minus how
// far the shadow lookup moves (refraction + shadow offset) is still deeper than 1.8σ, the answer is
// that constant and the shape need not be evaluated again.
fn shadow_is_flat(m: Blend, d: f32, moved: f32) -> bool {
  return d + moved + m.corner.z <= -1.8 * m.corner.w;
}

const FLAT_SHADOW: f32 = 0.35 * 0.5;

fn shadow_single(s: Surface, m: Blend, px: vec2f) -> f32 {
  if (m.shading.z <= 0.0) {
    return 0.0;
  }
  return shadow_value(m, shape_sdf(s, px - vec2f(0.0, m.corner.z)).d);
}

fn shadow_union(g: Group, m: Blend, px: vec2f) -> f32 {
  if (m.shading.z <= 0.0) {
    return 0.0;
  }
  return shadow_value(m, union_distance(g, px - vec2f(0.0, m.corner.z)));
}

// Inverse of the sRGB encode the attachment applies, so a debug value v lands in the byte as v·255.
fn srgb_to_linear(c: vec3f) -> vec3f {
  return select(pow((c + 0.055) / 1.055, vec3f(2.4)), c / 12.92, c <= vec3f(0.04045));
}

fn heat(v: f32) -> vec3f {
  let t = clamp(v, 0.0, 1.5) / 1.5;
  return clamp(vec3f(t * 2.0, 2.0 - t * 2.0, 0.15), vec3f(0.0), vec3f(1.0));
}

fn member_hue(i: u32) -> vec3f {
  var palette = array<vec3f, 6>(
    vec3f(0.95, 0.35, 0.25), vec3f(0.25, 0.6, 1.0), vec3f(0.3, 0.85, 0.45),
    vec3f(0.95, 0.75, 0.2), vec3f(0.75, 0.4, 0.95), vec3f(0.2, 0.85, 0.85),
  );
  return palette[i % 6u];
}

// ---- Shading, shared by both entry points ------------------------------------------------------

struct Pixel {
  pix: vec2f,
  edge: f32,     // signed distance to the outline, px (antialiasing, SDF view)
  depth: f32,    // radial table depth
  grad: vec2f,   // outward gradient: unit for one surface, the union's own for a group
  gradLen: f32,
}

// Everything after the geometry: refraction, blur, absorption, light, debug views. `r` and
// `inward` are the radial optics at the pixel and one pixel inward; `shade` is the glass's own
// shadow on the content seen through it.
fn shade(p: Pixel, m: Blend, r: Radial, inward: Radial, shadow: f32) -> vec3f {
  let roughness = m.shading.x;
  let posG = p.pix + r.offsetG * p.grad;
  let posR = p.pix + r.offsetR * p.grad;
  let posB = p.pix + r.offsetB * p.grad;

  // Blur: frost from the roughness, plus the footprint of the refracted sample along the normal so
  // a minified border is filtered instead of shimmering. Read from the table one pixel inward, not
  // dpdx: derivatives are not allowed after the early returns.
  let footprint = abs(1.0 - (inward.offsetG - r.offsetG) * p.gradLen);
  let maxLod = f32(textureNumLevels(bgTex) - 1u);
  let lod = clamp(max(log2(max(m.light.z, 1.0)), log2(max(footprint, 1.0))), 0.0, maxLod);

  var content: vec3f;
  let dispersed = (globals.features & FEATURE_DISPERSION) != 0u && abs(r.offsetR - r.offsetB) > 0.05;
  if (dispersed) {
    content = vec3f(sample_content(posR, lod).r, sample_content(posG, lod).g, sample_content(posB, lod).b);
  } else {
    content = sample_content(posG, lod);
  }
  if (m.policy.x > 0.0) {
    content = adapt_light(content, m.policy.x, m.policy.y);
  }
  content *= 1.0 - shadow;

  let absorption = exp(-m.medium.xyz * r.path);
  let transmitted = content * r.transmission * absorption;

  let normal = normalize(vec3f(r.slope * p.grad, 1.0));
  let fresnel = schlick(m.light.w, normal.z);
  let surround = textureSampleLevel(bgTex, bgSampler, p.pix * globals.invViewport, maxLod).rgb;
  let light = lighting(m, normal, roughness, surround);
  let edgeShade = 1.0 - m.shading.y * 0.7 * sqrt(1.0 - normal.z);
  var color = transmitted * edgeShade + fresnel * light.reflected + vec3f(light.specular);

  switch globals.debugView {
    case DEBUG_SDF: {
      let bands = 0.5 + 0.5 * cos(p.edge * 0.7853982);
      color = mix(vec3f(0.05, 0.12, 0.35), vec3f(0.35, 0.65, 1.0), bands) * (0.4 + 0.6 * exp(p.edge / 60.0));
    }
    case DEBUG_NORMAL: {
      color = normal * 0.5 + 0.5;
    }
    case DEBUG_OFFSET: {
      let reach = max(m.optics.x + m.optics.y + m.optics.z, 1.0);
      color = vec3f(0.5 + 0.5 * (posG - p.pix) / reach, 0.5);
    }
    case DEBUG_INJECTIVITY: {
      // |d offset / d px| along the normal; red past MAX_COMPRESSION. Black where Fresnel
      // leaves under 5% of the light (the position of a dark pixel does not read).
      let carries = select(0.0, 1.0, min(r.transmission, inward.transmission) >= 0.05);
      color = mix(vec3f(0.08), heat(abs(inward.offsetG - r.offsetG) * p.gradLen / MAX_COMPRESSION), carries);
    }
    case DEBUG_TRANSMISSION: {
      color = select(vec3f(r.transmission), vec3f(1.0, 0.1, 0.1), r.transmission <= 0.0);
    }
    case DEBUG_THICKNESS: {
      color = vec3f(r.path / max(m.optics.x + m.optics.y, 1.0) * 0.5);
    }
    case DEBUG_SAMPLE: {
      // Where the green light came from, pixels / (viewport − 1), linear in the byte. For tests.
      let samplePx = posG - 0.5;
      color = srgb_to_linear(vec3f(clamp(samplePx / (globals.viewport - 1.0), vec2f(0.0), vec2f(1.0)), 1.0));
    }
    case DEBUG_FRESNEL: {
      color = vec3f(fresnel);
    }
    case DEBUG_LOD: {
      color = heat(lod / max(maxLod, 1.0) * 1.5);
    }
    case DEBUG_SPECULAR: {
      color = vec3f(light.specular);
    }
    case DEBUG_DISPERSION: {
      color = vec3f(0.5) + vec3f(r.offsetR - r.offsetG, 0.0, r.offsetB - r.offsetG) * 0.25;
    }
    default: {}
  }
  return color;
}

// What an empty pixel returns. Not `discard`: WGSL's discard demotes the invocation to a helper,
// and Tint implements that with a flag while the shader keeps running to the end — an early out
// by discard saved nothing. Under premultiplied blending (one, one − src alpha) a zero output
// leaves the target as it was, and the return really ends the work.
const NOTHING = vec4f(0.0);

fn composite(color: vec3f, coverage: f32, outsideShadow: f32) -> vec4f {
  return vec4f(color * coverage, coverage + (1.0 - coverage) * outsideShadow);
}

// A surface on its own: one SDF, one table, no union bookkeeping.
@fragment
fn fs_single(in: VOut) -> @location(0) vec4f {
  let i = groups[in.instance].start;
  let s = surfaces[i];
  let m = blend_of(i, s);
  let pix = in.pos.xy;
  let sd = shape_sdf(s, pix);
  let coverage = clamp(0.5 - sd.d, 0.0, 1.0);
  // The shadow outside only shows where coverage is partial: skip it inside.
  var outsideShadow = 0.0;
  if (coverage < 1.0) {
    outsideShadow = shadow_single(s, m, pix);
  }
  if (coverage <= 0.0) {
    if (outsideShadow <= 0.002) {
      return NOTHING;
    }
    return vec4f(0.0, 0.0, 0.0, outsideShadow);
  }
  let depth = max(-sd.d, 0.0);
  let r = table_lookup(i, s.optics.x, depth);
  let inward = table_lookup(i, s.optics.x, depth + 1.0);
  var shadow = m.shading.z * FLAT_SHADOW;
  if (!shadow_is_flat(m, sd.d, abs(r.offsetG))) {
    shadow = shadow_single(s, m, pix + r.offsetG * sd.grad);
  }
  var color = shade(Pixel(pix, sd.d, depth, sd.grad, 1.0), m, r, inward, shadow);
  if (globals.debugView == DEBUG_UNION) {
    color = member_hue(0u);
  }
  return composite(color, coverage, outsideShadow);
}

// A merge group: the members' smooth union, their tables and materials mixed by weight.
@fragment
fn fs_union(in: VOut) -> @location(0) vec4f {
  let g = groups[in.instance];
  let pix = in.pos.xy;
  // Early out: the bounds are a rectangle around the whole group, and most of it is empty between
  // and around members.
  let near = nearest_member(g, pix);
  if (near.bound > g.reach) {
    return NOTHING;
  }

  // Alone: if the members before the nearest one cannot come within 6k of it (their chain stays
  // ≥ d + 6k, so the nearest one resets the chain, t = 1) and the ones after are ≥ d + 6k (t = 0),
  // the union IS the nearest member — exactly, weights and all. Most pixels of a group are like
  // this; they are shaded as a lone surface, and only necks and their surroundings pay the union.
  let i = g.start + near.index;
  let s = surfaces[i];
  let sd = shape_sdf(s, pix);
  let clearance = near.others - (sd.d + 6.0 * g.k);
  if (clearance >= 0.0) {
    let m = blend_of(i, s);
    let coverage = clamp(0.5 - sd.d, 0.0, 1.0);
    // A shadow looked up `moved` px away stays alone if the clearance covers the move twice (the
    // member's distance and the others' bounds both change by at most 1 per px).
    var outsideShadow = 0.0;
    if (coverage < 1.0) {
      // An if, not select(): select evaluates both arguments.
      if (clearance >= 2.0 * m.corner.z) {
        outsideShadow = shadow_single(s, m, pix);
      } else {
        outsideShadow = shadow_union(g, m, pix);
      }
    }
    if (coverage <= 0.0) {
      if (outsideShadow <= 0.002) {
        return NOTHING;
      }
      return vec4f(0.0, 0.0, 0.0, outsideShadow);
    }
    let depth = max(-sd.d, 0.0);
    let r = table_lookup(i, s.optics.x, depth);
    let inward = table_lookup(i, s.optics.x, depth + 1.0);
    var shadow = m.shading.z * FLAT_SHADOW;
    if (!shadow_is_flat(m, sd.d, abs(r.offsetG))) {
      let at = pix + r.offsetG * sd.grad;
      if (clearance >= 2.0 * (abs(r.offsetG) + m.corner.z)) {
        shadow = shadow_single(s, m, at);
      } else {
        shadow = shadow_union(g, m, at);
      }
    }
    var color = shade(Pixel(pix, sd.d, depth, sd.grad, 1.0), m, r, inward, shadow);
    if (globals.debugView == DEBUG_UNION) {
      color = member_hue(near.index);
    }
    return composite(color, coverage, outsideShadow);
  }

  let u = union_field(g, pix);
  let m = u.mat;
  // Where two members pull against each other |grad| < 1: renormalise for the antialiased edge.
  let gradLen = length(u.grad);
  let edge = u.d / max(gradLen, 0.3);
  let coverage = clamp(0.5 - edge, 0.0, 1.0);
  var outsideShadow = 0.0;
  if (coverage < 1.0) {
    outsideShadow = shadow_union(g, m, pix);
  }
  if (coverage <= 0.0) {
    if (outsideShadow <= 0.002) {
      return NOTHING;
    }
    return vec4f(0.0, 0.0, 0.0, outsideShadow);
  }
  let depth = max(-u.d, 0.0);
  let r = blended_radial(u, depth);
  // One pixel inward the union moves by |grad|.
  let inward = blended_radial(u, depth + gradLen);
  var shadow = m.shading.z * FLAT_SHADOW;
  if (!shadow_is_flat(m, u.d, abs(r.offsetG) * gradLen)) {
    shadow = shadow_union(g, m, pix + r.offsetG * u.grad);
  }
  var color = shade(Pixel(pix, edge, depth, u.grad, gradLen), m, r, inward, shadow);
  if (globals.debugView == DEBUG_UNION) {
    // Each member in its colour, mixed by weight; dark where the gradient shrinks (the neck).
    var hue = vec3f(0.0);
    for (var e = 0u; e < MAX_BLEND; e++) {
      hue += u.weight[e] * member_hue(u.index[e] - g.start);
    }
    color = hue * (0.25 + 0.75 * gradLen);
  }
  return composite(color, coverage, outsideShadow);
}

// ---- Backdrop metrics (compute; CPU mirror: backdropStats in src/glass/policy.ts) --------------

@group(0) @binding(7) var<storage, read_write> backdropOut: array<vec4f>;

var<workgroup> histogram: array<atomic<u32>, 16>;
var<workgroup> lightSum: atomic<u32>;
var<workgroup> validCount: atomic<u32>;

// CIE L*, 0..100.
fn lightness(y: f32) -> f32 {
  let f = select(7.787 * y + 16.0 / 116.0, pow(max(y, 0.0), 1.0 / 3.0), y > 0.008856);
  return 116.0 * f - 16.0;
}

// One workgroup per surface: 8×8 samples over its rectangle, mapped to the screen by the shape
// matrix, each read from the pyramid level whose texel is about one grid cell (so a sample is the
// average of its cell); the ones outside the shape are dropped. Writes mean L*, p10, p90 and the
// fraction of samples inside.
@compute @workgroup_size(64)
fn cs_metrics(@builtin(workgroup_id) wg: vec3u, @builtin(local_invocation_index) li: u32) {
  let s = surfaces[wg.x];
  if (li < 16u) {
    atomicStore(&histogram[li], 0u);
  }
  if (li == 0u) {
    atomicStore(&lightSum, 0u);
    atomicStore(&validCount, 0u);
  }
  workgroupBarrier();

  let inv = s.xform;
  let fwd = vec4f(inv.w, -inv.y, -inv.z, inv.x) / (inv.x * inv.w - inv.y * inv.z);
  let cell = vec2f(f32(li % 8u), f32(li / 8u));
  let local = ((cell + 0.5) / 8.0 * 2.0 - 1.0) * s.geom.zw;
  let px = s.geom.xy + vec2f(fwd.x * local.x + fwd.y * local.y, fwd.z * local.x + fwd.w * local.y);
  let spacing = 2.0 * max(s.geom.z, s.geom.w) / 8.0;
  let lod = clamp(log2(max(spacing, 1.0)), 0.0, f32(textureNumLevels(bgTex) - 1u));
  let rgb = textureSampleLevel(bgTex, bgSampler, px * globals.invViewport, lod).rgb;
  let l = clamp(lightness(dot(rgb, LUMA)), 0.0, 100.0);
  if (shape_sdf(s, px).d < 0.0) {
    atomicAdd(&validCount, 1u);
    atomicAdd(&lightSum, u32(l * 64.0));
    atomicAdd(&histogram[min(u32(l / 100.0 * 16.0), 15u)], 1u);
  }
  workgroupBarrier();

  if (li == 0u) {
    let n = atomicLoad(&validCount);
    if (n == 0u) {
      backdropOut[wg.x] = vec4f(0.0);
      return;
    }
    let total = f32(n);
    var below = 0.0;
    var p10 = 100.0;
    var p90 = 100.0;
    var found10 = false;
    var found90 = false;
    for (var b = 0u; b < 16u; b++) {
      let count = f32(atomicLoad(&histogram[b]));
      if (count > 0.0) {
        if (!found10 && below + count >= 0.1 * total) {
          p10 = (f32(b) + (0.1 * total - below) / count) * 100.0 / 16.0;
          found10 = true;
        }
        if (!found90 && below + count >= 0.9 * total) {
          p90 = (f32(b) + (0.9 * total - below) / count) * 100.0 / 16.0;
          found90 = true;
        }
      }
      below += count;
    }
    backdropOut[wg.x] = vec4f(f32(atomicLoad(&lightSum)) / 64.0 / total, p10, p90, total / 64.0);
  }
}

