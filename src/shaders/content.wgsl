// What sits on a glass (a toolbar's symbol), drawn right after the glass of its layer. Being in
// the frame — not a DOM element over the canvas — is what lets a glass of an upper layer refract
// the symbols of the one below, and lets the upper glass's shadow fall on them.
//
// The atlas holds one white symbol per cell, coverage in alpha. Each mip level was rasterized from
// the SVG at that size (src/renderer/symbols.ts), not filtered down, so a small symbol stays sharp.

struct Globals {
  viewport: vec2f,
  invViewport: vec2f,
  dpr: f32,
  time: f32,
  debugView: u32,
  edgeStart: f32,
  features: u32,
}

struct Content {
  place: vec4f,  // centre.xy, half side (device px), mip level to read
  axis: vec4f,   // cos and sin of the glass's rotation, atlas cell, cells in the atlas
  color: vec4f,  // linear rgb, opacity
}

@group(0) @binding(0) var<uniform> globals: Globals;
@group(0) @binding(1) var<storage, read> contents: array<Content>;
@group(0) @binding(2) var atlas: texture_2d<f32>;
@group(0) @binding(3) var atlasSampler: sampler;

struct VOut {
  @builtin(position) pos: vec4f,
  @location(0) uv: vec2f,
  @location(1) @interpolate(flat) instance: u32,
}

@vertex
fn vs_main(@builtin(vertex_index) vi: u32, @builtin(instance_index) ii: u32) -> VOut {
  let c = contents[ii];
  var corners = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0),
  );
  let q = corners[vi] * c.place.z;
  // Screen y points down, so this turns the same way as CSS rotate().
  let px = c.place.xy + vec2f(q.x * c.axis.x - q.y * c.axis.y, q.x * c.axis.y + q.y * c.axis.x);
  let ndc = px * globals.invViewport * 2.0 - 1.0;
  var out: VOut;
  out.pos = vec4f(ndc.x, -ndc.y, 0.0, 1.0);
  out.uv = vec2f((c.axis.z + corners[vi].x * 0.5 + 0.5) / c.axis.w, corners[vi].y * 0.5 + 0.5);
  out.instance = ii;
  return out;
}

@fragment
fn fs_main(in: VOut) -> @location(0) vec4f {
  let c = contents[in.instance];
  let a = textureSampleLevel(atlas, atlasSampler, in.uv, c.place.w).a * c.color.a;
  return vec4f(c.color.rgb * a, a);
}
