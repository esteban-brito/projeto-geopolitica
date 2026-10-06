// Glass surfaces: one instanced draw, one quad per surface around its bounds.
// Units are device pixels; z points at the viewer. Light math is linear (sRGB texture + sRGB view).
//
// The radial optics (two-interface refraction, Fresnel transmission, injectivity guard) are
// computed on the CPU per surface — src/glass/optics.ts, buildRadialTable — and read here from a
// table indexed by depth. The guard is a cumulative pass along the whole bevel, which a per-pixel
// shader cannot do; the table also makes CPU and GPU agree to the last bit.

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
  corner: vec4f,   // radius, superellipse exponent, cos(rotation), sin(rotation)
  optics: vec4f,   // bevel, thickness T, gap G, ior
  shading: vec4f,  // -, profile, -, -
  reserve0: vec4f,
  reserve1: vec4f,
}

@group(0) @binding(0) var<uniform> globals: Globals;
@group(0) @binding(1) var<storage, read> surfaces: array<Surface>;
@group(0) @binding(2) var bgTex: texture_2d<f32>;
@group(0) @binding(3) var bgSampler: sampler;
@group(0) @binding(4) var<storage, read> tables: array<vec4f>;

const TABLE_SAMPLES: u32 = 64u;
const MAX_COMPRESSION: f32 = 0.88;
const BOUNDS_MARGIN: f32 = 2.0;

const DEBUG_SDF: u32 = 1u;
const DEBUG_NORMAL: u32 = 2u;
const DEBUG_OFFSET: u32 = 3u;
const DEBUG_INJECTIVITY: u32 = 4u;
const DEBUG_TRANSMISSION: u32 = 5u;
const DEBUG_THICKNESS: u32 = 6u;
const DEBUG_SAMPLE: u32 = 7u;

struct VOut {
  @builtin(position) pos: vec4f,
  @location(0) @interpolate(flat) instance: u32,
}

@vertex
fn vs_main(@builtin(vertex_index) vi: u32, @builtin(instance_index) ii: u32) -> VOut {
  let s = surfaces[ii];
  let c = abs(s.corner.z);
  let sn = abs(s.corner.w);
  let half = s.geom.zw;
  let extent = vec2f(c * half.x + sn * half.y, sn * half.x + c * half.y) + BOUNDS_MARGIN;
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

// Rectangle with superellipse corners. The p-norm field has iso-lines that are shrunken
// superellipses, so its gradient stays smooth while depth < radius; d / |grad| restores Euclidean
// distance to first order. Keeping bevel <= radius therefore leaves no crease on the diagonal.
// CPU mirror: shapeDistance in src/glass/shape.ts.
fn shape_sdf(s: Surface, pix: vec2f) -> SdfSample {
  let c = s.corner.z;
  let sn = s.corner.w;
  let rel = pix - s.geom.xy;
  let local = vec2f(c * rel.x + sn * rel.y, -sn * rel.x + c * rel.y);
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
  return SdfSample(d, vec2f(c * gs.x - sn * gs.y, sn * gs.x + c * gs.y));
}

struct Radial {
  offset: f32,       // along the outward normal; negative = light comes from further inside
  transmission: f32, // Fresnel transmission through top and base
  slope: f32,        // dh/ds of the profile, for the surface normal
  height: f32,       // bevel height above the flat slab
}

// Samples are spaced as depth ∝ u², dense where the border changes fastest.
// CPU mirror: tableLookup in src/glass/optics.ts.
fn table_lookup(instance: u32, bevel: f32, depth: f32) -> Radial {
  let base = instance * TABLE_SAMPLES;
  let edge = globals.edgeStart;
  if (bevel <= edge + 1e-3) {
    let v = tables[base];
    return Radial(v.x, v.y, v.z, v.w);
  }
  if (depth >= bevel) {
    let v = tables[base + TABLE_SAMPLES - 1u];
    return Radial(0.0, v.y, 0.0, v.w);
  }
  let u = sqrt(max(0.0, (depth - edge) / (bevel - edge)));
  let x = u * f32(TABLE_SAMPLES - 1u);
  let i0 = min(u32(floor(x)), TABLE_SAMPLES - 2u);
  let v = mix(tables[base + i0], tables[base + i0 + 1u], x - f32(i0));
  return Radial(v.x, v.y, v.z, v.w);
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
  if (coverage <= 0.0) {
    discard;
  }

  let bevel = s.optics.x;
  let depth = max(-sd.d, 0.0);
  let r = table_lookup(in.instance, bevel, depth);
  let offset = r.offset * sd.grad;
  let bg = textureSampleLevel(bgTex, bgSampler, (pix + offset) * globals.invViewport, 0.0).rgb;
  var color = bg * r.transmission;

  switch globals.debugView {
    case DEBUG_SDF: {
      let bands = 0.5 + 0.5 * cos(sd.d * 0.7853982);
      color = mix(vec3f(0.05, 0.12, 0.35), vec3f(0.35, 0.65, 1.0), bands) * (0.4 + 0.6 * exp(sd.d / 60.0));
    }
    case DEBUG_NORMAL: {
      color = normalize(vec3f(r.slope * sd.grad, 1.0)) * 0.5 + 0.5;
    }
    case DEBUG_OFFSET: {
      let reach = max(bevel + s.optics.y + s.optics.z, 1.0);
      color = vec3f(0.5 + 0.5 * offset / reach, 0.5);
    }
    case DEBUG_INJECTIVITY: {
      // |d offset / d depth| over one pixel; red past MAX_COMPRESSION. Black where Fresnel
      // leaves under 5% of the light (the position of a dark pixel does not read).
      let next = table_lookup(in.instance, bevel, depth + 1.0);
      let carries = select(0.0, 1.0, min(r.transmission, next.transmission) >= 0.05);
      color = mix(vec3f(0.08), heat(abs(next.offset - r.offset) / MAX_COMPRESSION), carries);
    }
    case DEBUG_TRANSMISSION: {
      color = select(vec3f(r.transmission), vec3f(1.0, 0.1, 0.1), r.transmission <= 0.0);
    }
    case DEBUG_THICKNESS: {
      color = vec3f((r.height + s.optics.y) / max(bevel + s.optics.y, 1.0));
    }
    case DEBUG_SAMPLE: {
      // Where the light came from, in pixels / (viewport − 1), linear in the stored byte. For tests.
      let samplePx = pix + offset - 0.5;
      color = srgb_to_linear(vec3f(clamp(samplePx / (globals.viewport - 1.0), vec2f(0.0), vec2f(1.0)), 1.0));
    }
    default: {}
  }
  return vec4f(color * coverage, coverage);
}
