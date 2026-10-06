// Glass surfaces: one instanced draw, one quad per surface around its bounds and its shadow.
// Units are device pixels; z points at the viewer. Light math is linear (sRGB texture + sRGB view).
//
// The radial optics (two-interface refraction per colour channel, Fresnel transmission, optical
// path, injectivity guard) are computed on the CPU per surface — src/glass/optics.ts,
// buildRadialTable — and read here from a table indexed by depth. The guard is a cumulative pass
// along the whole bevel, which a per-pixel shader cannot do.

struct Globals {
  viewport: vec2f,
  invViewport: vec2f,
  dpr: f32,
  time: f32,
  debugView: u32,
  edgeStart: f32,
}

struct Surface {
  geom: vec4f,     // centre.xy, half extents.xy
  corner: vec4f,   // radius, superellipse exponent, -, -
  optics: vec4f,   // bevel, thickness T, gap G, ior
  shading: vec4f,  // roughness, edge contrast, shadow strength, environment
  medium: vec4f,   // absorption per device px (r, g, b), key light
  light: vec4f,    // direction the key light comes from (screen xy), blur radius px, F0
  xform: vec4f,    // inverse of the shape matrix (rotation · press scale · stretch), row-major 2×2
}

@group(0) @binding(0) var<uniform> globals: Globals;
@group(0) @binding(1) var<storage, read> surfaces: array<Surface>;
@group(0) @binding(2) var bgTex: texture_2d<f32>;
@group(0) @binding(3) var bgSampler: sampler;
@group(0) @binding(4) var<storage, read> tables: array<vec4f>;

const TABLE_SAMPLES: u32 = 64u;
const MAX_COMPRESSION: f32 = 0.88;
const BOUNDS_MARGIN: f32 = 2.0;
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

struct VOut {
  @builtin(position) pos: vec4f,
  @location(0) @interpolate(flat) instance: u32,
}

struct ShadowShape {
  offset: vec2f,
  sigma: f32,
}

// The shadow follows the gap: the higher the glass floats, the further down and the softer.
fn shadow_shape(s: Surface) -> ShadowShape {
  let g = s.optics.z;
  return ShadowShape(vec2f(0.0, 1.0 + g * 0.55), 1.5 * globals.dpr + g * 0.85);
}

@vertex
fn vs_main(@builtin(vertex_index) vi: u32, @builtin(instance_index) ii: u32) -> VOut {
  let s = surfaces[ii];
  let inv = s.xform;
  let det = inv.x * inv.w - inv.y * inv.z;
  let fwd = vec4f(inv.w, -inv.y, -inv.z, inv.x) / det;
  let half = s.geom.zw;
  let sh = shadow_shape(s);
  let shadowReach = select(0.0, length(sh.offset) + sh.sigma * 3.0, s.shading.z > 0.0);
  let extent = vec2f(abs(fwd.x) * half.x + abs(fwd.y) * half.y, abs(fwd.z) * half.x + abs(fwd.w) * half.y)
    + BOUNDS_MARGIN + shadowReach;
  var corners = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0),
  );
  let px = s.geom.xy + corners[vi] * extent;
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
// CPU mirror: shapeDistance in src/glass/shape.ts.
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

// Two vec4 per sample, depth ∝ u² (dense near the border). CPU mirror: tableLookup in optics.ts.
fn table_lookup(instance: u32, bevel: f32, depth: f32) -> Radial {
  let base = instance * TABLE_SAMPLES * 2u;
  let edge = globals.edgeStart;
  if (bevel <= edge + 1e-3) {
    let a = tables[base];
    let b = tables[base + 1u];
    return Radial(a.x, a.y, a.z, a.w, b.x, b.y, b.z);
  }
  if (depth >= bevel) {
    let a = tables[base + (TABLE_SAMPLES - 1u) * 2u];
    let b = tables[base + (TABLE_SAMPLES - 1u) * 2u + 1u];
    return Radial(0.0, a.y, 0.0, a.w, 0.0, 0.0, b.z);
  }
  let u = sqrt(max(0.0, (depth - edge) / (bevel - edge)));
  let x = u * f32(TABLE_SAMPLES - 1u);
  let i0 = min(u32(floor(x)), TABLE_SAMPLES - 2u);
  let t = x - f32(i0);
  let a = mix(tables[base + i0 * 2u], tables[base + i0 * 2u + 2u], t);
  let b = mix(tables[base + i0 * 2u + 1u], tables[base + i0 * 2u + 3u], t);
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
  if (lod < 0.75) {
    return textureSampleLevel(bgTex, bgSampler, uv, lod).rgb;
  }
  return sample_bicubic(uv, lod);
}

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
fn lighting(s: Surface, normal: vec3f, roughness: f32, surround: vec3f) -> Lighting {
  let view = vec3f(0.0, 0.0, 1.0);
  let r = reflect(-view, normal);
  let up = clamp(r.z, 0.0, 1.0);
  let ambient = surround * mix(0.3, 1.0, up * up) * s.shading.w;

  let key = normalize(vec3f(s.light.xy * 0.94, 0.34));
  let back = normalize(vec3f(-s.light.xy * 0.94, 0.34));
  let hk = normalize(key + view);
  let hb = normalize(back + view);
  let fk = schlick(s.light.w, dot(view, hk));
  let fb = schlick(s.light.w, dot(view, hb));
  let spec = (fk * disc_light(dot(normal, hk), roughness) + BACK_LIGHT * fb * disc_light(dot(normal, hb), roughness))
    * LIGHT_RADIANCE * s.medium.w;
  return Lighting(ambient, spec);
}

// Gaussian ring at the shifted outline plus a soft outer tail: a transparent slab casts most of
// its shadow where its edge bends light away, not under its flat centre.
fn shadow_at(s: Surface, px: vec2f) -> f32 {
  if (s.shading.z <= 0.0) {
    return 0.0;
  }
  let sh = shadow_shape(s);
  let d = shape_sdf(s, px - sh.offset).d;
  let ring = exp(-(d * d) / (2.0 * sh.sigma * sh.sigma));
  let tail = select(1.0, exp(-d / (sh.sigma * 2.0)), d > 0.0) * 0.35;
  return s.shading.z * clamp(max(ring, tail), 0.0, 1.0) * 0.5;
}

// Inverse of the sRGB encode the attachment applies, so a debug value v lands in the byte as v·255.
fn srgb_to_linear(c: vec3f) -> vec3f {
  return select(pow((c + 0.055) / 1.055, vec3f(2.4)), c / 12.92, c <= vec3f(0.04045));
}

fn heat(v: f32) -> vec3f {
  let t = clamp(v, 0.0, 1.5) / 1.5;
  return clamp(vec3f(t * 2.0, 2.0 - t * 2.0, 0.15), vec3f(0.0), vec3f(1.0));
}

@fragment
fn fs_main(in: VOut) -> @location(0) vec4f {
  let s = surfaces[in.instance];
  let pix = in.pos.xy;
  let sd = shape_sdf(s, pix);
  let coverage = clamp(0.5 - sd.d, 0.0, 1.0);
  let outsideShadow = shadow_at(s, pix);
  if (coverage <= 0.0) {
    if (outsideShadow <= 0.002) {
      discard;
    }
    return vec4f(0.0, 0.0, 0.0, outsideShadow);
  }

  let bevel = s.optics.x;
  let depth = max(-sd.d, 0.0);
  let r = table_lookup(in.instance, bevel, depth);
  let roughness = s.shading.x;
  let posG = pix + r.offsetG * sd.grad;
  let posR = pix + r.offsetR * sd.grad;
  let posB = pix + r.offsetB * sd.grad;

  // Blur: frost from the roughness, plus the footprint of the refracted sample along the normal so
  // a minified border is filtered instead of shimmering. Read from the table (one pixel inward),
  // not dpdx: derivatives are not allowed after the shadow-only early return above.
  let inward = table_lookup(in.instance, bevel, depth + 1.0);
  let footprint = abs(1.0 - (inward.offsetG - r.offsetG));
  let maxLod = f32(textureNumLevels(bgTex) - 1u);
  let lod = clamp(max(log2(max(s.light.z, 1.0)), log2(max(footprint, 1.0))), 0.0, maxLod);

  var content: vec3f;
  let dispersed = abs(r.offsetR - r.offsetB) > 0.05;
  if (dispersed) {
    content = vec3f(sample_content(posR, lod).r, sample_content(posG, lod).g, sample_content(posB, lod).b);
  } else {
    content = sample_content(posG, lod);
  }
  content *= 1.0 - shadow_at(s, posG);

  let absorption = exp(-s.medium.xyz * r.path);
  let transmitted = content * r.transmission * absorption;

  let normal = normalize(vec3f(r.slope * sd.grad, 1.0));
  let fresnel = schlick(s.light.w, normal.z);
  let surround = textureSampleLevel(bgTex, bgSampler, pix * globals.invViewport, maxLod).rgb;
  let light = lighting(s, normal, roughness, surround);
  let edgeShade = 1.0 - s.shading.y * 0.7 * sqrt(1.0 - normal.z);
  var color = transmitted * edgeShade + fresnel * light.reflected + vec3f(light.specular);

  switch globals.debugView {
    case DEBUG_SDF: {
      let bands = 0.5 + 0.5 * cos(sd.d * 0.7853982);
      color = mix(vec3f(0.05, 0.12, 0.35), vec3f(0.35, 0.65, 1.0), bands) * (0.4 + 0.6 * exp(sd.d / 60.0));
    }
    case DEBUG_NORMAL: {
      color = normal * 0.5 + 0.5;
    }
    case DEBUG_OFFSET: {
      let reach = max(bevel + s.optics.y + s.optics.z, 1.0);
      color = vec3f(0.5 + 0.5 * (posG - pix) / reach, 0.5);
    }
    case DEBUG_INJECTIVITY: {
      // |d offset / d depth| over one pixel; red past MAX_COMPRESSION. Black where Fresnel
      // leaves under 5% of the light (the position of a dark pixel does not read).
      let carries = select(0.0, 1.0, min(r.transmission, inward.transmission) >= 0.05);
      color = mix(vec3f(0.08), heat(abs(inward.offsetG - r.offsetG) / MAX_COMPRESSION), carries);
    }
    case DEBUG_TRANSMISSION: {
      color = select(vec3f(r.transmission), vec3f(1.0, 0.1, 0.1), r.transmission <= 0.0);
    }
    case DEBUG_THICKNESS: {
      color = vec3f(r.path / max(bevel + s.optics.y, 1.0) * 0.5);
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
  let alpha = coverage + (1.0 - coverage) * outsideShadow;
  return vec4f(color * coverage, alpha);
}
