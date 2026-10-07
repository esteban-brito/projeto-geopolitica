// Glass surfaces: one instanced draw, one quad per merge group around its members, their merge
// reach and their shadow. Units are device pixels; z points at the viewer. Light math is linear
// (sRGB texture + sRGB view).
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
}

// Members [start, start + count) of the surface array merge with each other and with nothing else.
struct Group {
  bounds: vec4f,   // min.xy, max.xy: members + merge reach + shadow, computed on the CPU
  start: u32,
  count: u32,
  k: f32,          // smooth-union depth; the gap at which two members touch is 2k. 0 = no merging
  pad: f32,
}

@group(0) @binding(0) var<uniform> globals: Globals;
@group(0) @binding(1) var<storage, read> surfaces: array<Surface>;
@group(0) @binding(2) var bgTex: texture_2d<f32>;
@group(0) @binding(3) var bgSampler: sampler;
@group(0) @binding(4) var<storage, read> tables: array<vec4f>;
@group(0) @binding(5) var<storage, read> groups: array<Group>;

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
}

struct Union {
  d: f32,        // union value: negative inside; depth for the radial table
  grad: vec2f,   // exact gradient of the union, |grad| <= 1 (0 on the ridge of a neck)
  mat: Blend,
  count: u32,    // members whose tables this pixel blends
  index: array<u32, 4>,
  weight: array<f32, 4>,
}

// Final weight of each entry of a mix chain: its own t times (1 − t) of every later entry.
fn chain_weights(count: u32, t: array<f32, 4>) -> array<f32, 4> {
  var w = array<f32, 4>(0.0, 0.0, 0.0, 0.0);
  var carry = 1.0;
  for (var e = i32(count) - 1; e >= 0; e--) {
    w[e] = t[e] * carry;
    carry *= 1.0 - t[e];
  }
  return w;
}

fn union_field(g: Group, p: vec2f) -> Union {
  var u: Union;
  u.count = 0u;
  for (var j = 0u; j < g.count; j++) {
    let i = g.start + j;
    let s = surfaces[i];
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
    if (t >= 1.0) {
      u.count = 0u;
    }
    if (u.count == MAX_BLEND) {
      let w = chain_weights(u.count, u.weight);
      var weakest = 0u;
      for (var e = 1u; e < MAX_BLEND; e++) {
        if (w[e] < w[weakest]) {
          weakest = e;
        }
      }
      for (var e = weakest; e + 1u < MAX_BLEND; e++) {
        u.index[e] = u.index[e + 1u];
        u.weight[e] = u.weight[e + 1u];
      }
      u.count = MAX_BLEND - 1u;
    }
    u.index[u.count] = i;
    u.weight[u.count] = t;
    u.count += 1u;
  }
  let w = chain_weights(u.count, u.weight);
  var sum = 0.0;
  for (var e = 0u; e < u.count; e++) {
    sum += w[e];
  }
  for (var e = 0u; e < u.count; e++) {
    u.weight[e] = w[e] / max(sum, 1e-6);
  }
  return u;
}

// The union value alone, for the shadow (evaluated away from the pixel).
fn union_distance(g: Group, p: vec2f) -> f32 {
  var d = 0.0;
  for (var j = 0u; j < g.count; j++) {
    let dj = shape_sdf(surfaces[g.start + j], p).d;
    d = select(smin_cubic(d, dj, g.k).x, dj, j == 0u);
  }
  return d;
}

// The radial optics of the pixel: each member's own table at the union's depth, mixed by weight.
fn blended_radial(u: Union, depth: f32) -> Radial {
  var r = Radial(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
  for (var e = 0u; e < u.count; e++) {
    let i = u.index[e];
    let w = u.weight[e];
    let x = table_lookup(i, surfaces[i].optics.x, depth);
    r.offsetG += w * x.offsetG;
    r.transmission += w * x.transmission;
    r.slope += w * x.slope;
    r.height += w * x.height;
    r.offsetR += w * x.offsetR;
    r.offsetB += w * x.offsetB;
    r.path += w * x.path;
  }
  return r;
}

// ---- Light ------------------------------------------------------------------------------------

fn schlick(f0: f32, cosine: f32) -> f32 {
  let m = 1.0 - clamp(cosine, 0.0, 1.0);
  let m2 = m * m;
  return f0 + (1.0 - f0) * m2 * m2 * m;
}

// Reflection of a disc light: 1 inside its angular radius, soft edge, widened by roughness and
// dimmed by the same factor so the energy stays put.
fn disc_light(nh: f32, roughness: f32) -> f32 {
  let radius = LIGHT_RADIUS + roughness * 0.45;
  let feather = 0.06 + roughness * 0.3;
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
// its shadow where its edge bends light away, not under its flat centre. Offset and softness come
// from the gap (shadowGeometry in optics.ts).
fn shadow_at(g: Group, m: Blend, px: vec2f) -> f32 {
  if (m.shading.z <= 0.0) {
    return 0.0;
  }
  let sigma = m.corner.w;
  let d = union_distance(g, px - vec2f(0.0, m.corner.z));
  let ring = exp(-(d * d) / (2.0 * sigma * sigma));
  let tail = select(1.0, exp(-d / (sigma * 2.0)), d > 0.0) * 0.35;
  return m.shading.z * clamp(max(ring, tail), 0.0, 1.0) * 0.5;
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

@fragment
fn fs_main(in: VOut) -> @location(0) vec4f {
  let g = groups[in.instance];
  let pix = in.pos.xy;
  let u = union_field(g, pix);
  let m = u.mat;
  // Where two members pull against each other |grad| < 1: renormalise for the antialiased edge.
  let gradLen = length(u.grad);
  let edgeDistance = u.d / max(gradLen, 0.3);
  let coverage = clamp(0.5 - edgeDistance, 0.0, 1.0);
  let outsideShadow = shadow_at(g, m, pix);
  if (coverage <= 0.0) {
    if (outsideShadow <= 0.002) {
      discard;
    }
    return vec4f(0.0, 0.0, 0.0, outsideShadow);
  }

  let depth = max(-u.d, 0.0);
  let r = blended_radial(u, depth);
  let roughness = m.shading.x;
  let posG = pix + r.offsetG * u.grad;
  let posR = pix + r.offsetR * u.grad;
  let posB = pix + r.offsetB * u.grad;

  // Blur: frost from the roughness, plus the footprint of the refracted sample along the normal so
  // a minified border is filtered instead of shimmering. One pixel inward the union moves by
  // |grad|; read the table there (not dpdx: derivatives are not allowed after the early return).
  let inward = blended_radial(u, depth + gradLen);
  let footprint = abs(1.0 - (inward.offsetG - r.offsetG) * gradLen);
  let maxLod = f32(textureNumLevels(bgTex) - 1u);
  let lod = clamp(max(log2(max(m.light.z, 1.0)), log2(max(footprint, 1.0))), 0.0, maxLod);

  var content: vec3f;
  let dispersed = (globals.features & FEATURE_DISPERSION) != 0u && abs(r.offsetR - r.offsetB) > 0.05;
  if (dispersed) {
    content = vec3f(sample_content(posR, lod).r, sample_content(posG, lod).g, sample_content(posB, lod).b);
  } else {
    content = sample_content(posG, lod);
  }
  content *= 1.0 - shadow_at(g, m, posG);

  let absorption = exp(-m.medium.xyz * r.path);
  let transmitted = content * r.transmission * absorption;

  let normal = normalize(vec3f(r.slope * u.grad, 1.0));
  let fresnel = schlick(m.light.w, normal.z);
  let surround = textureSampleLevel(bgTex, bgSampler, pix * globals.invViewport, maxLod).rgb;
  let light = lighting(m, normal, roughness, surround);
  let edgeShade = 1.0 - m.shading.y * 0.7 * sqrt(1.0 - normal.z);
  var color = transmitted * edgeShade + fresnel * light.reflected + vec3f(light.specular);

  switch globals.debugView {
    case DEBUG_SDF: {
      let bands = 0.5 + 0.5 * cos(edgeDistance * 0.7853982);
      color = mix(vec3f(0.05, 0.12, 0.35), vec3f(0.35, 0.65, 1.0), bands) * (0.4 + 0.6 * exp(edgeDistance / 60.0));
    }
    case DEBUG_NORMAL: {
      color = normal * 0.5 + 0.5;
    }
    case DEBUG_OFFSET: {
      let reach = max(m.optics.x + m.optics.y + m.optics.z, 1.0);
      color = vec3f(0.5 + 0.5 * (posG - pix) / reach, 0.5);
    }
    case DEBUG_INJECTIVITY: {
      // |d offset / d px| along the normal; red past MAX_COMPRESSION. Black where Fresnel
      // leaves under 5% of the light (the position of a dark pixel does not read).
      let carries = select(0.0, 1.0, min(r.transmission, inward.transmission) >= 0.05);
      color = mix(vec3f(0.08), heat(abs(inward.offsetG - r.offsetG) * gradLen / MAX_COMPRESSION), carries);
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
    case DEBUG_UNION: {
      // Each member in its colour, mixed by weight; dark where the gradient shrinks (the neck).
      var hue = vec3f(0.0);
      for (var e = 0u; e < u.count; e++) {
        hue += u.weight[e] * member_hue(u.index[e] - g.start);
      }
      color = hue * (0.25 + 0.75 * gradLen);
    }
    default: {}
  }
  let alpha = coverage + (1.0 - coverage) * outsideShadow;
  return vec4f(color * coverage, alpha);
}
