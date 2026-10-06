// One level of the roughness pyramid: mip i from mip i−1 of the background texture.
// 13-tap downsample (Jimenez, "Next generation post processing in Call of Duty: AW", 2014): a box
// of 2×2 boxes, which is smooth enough that sampling between levels shows no blocks.

@group(0) @binding(0) var src: texture_2d<f32>;
@group(0) @binding(1) var srcSampler: sampler;

struct VOut {
  @builtin(position) pos: vec4f,
  @location(0) uv: vec2f,
}

@vertex
fn vs_main(@builtin(vertex_index) i: u32) -> VOut {
  let p = vec2f(f32((i << 1u) & 2u), f32(i & 2u));
  var out: VOut;
  out.pos = vec4f(p * 2.0 - 1.0, 0.0, 1.0);
  out.uv = vec2f(p.x, 1.0 - p.y);
  return out;
}

fn tap(uv: vec2f, offset: vec2f, texel: vec2f) -> vec3f {
  return textureSampleLevel(src, srcSampler, uv + offset * texel, 0.0).rgb;
}

@fragment
fn fs_main(in: VOut) -> @location(0) vec4f {
  let texel = 1.0 / vec2f(textureDimensions(src, 0));
  let uv = in.uv;
  let a = tap(uv, vec2f(-2.0, -2.0), texel);
  let b = tap(uv, vec2f(0.0, -2.0), texel);
  let c = tap(uv, vec2f(2.0, -2.0), texel);
  let d = tap(uv, vec2f(-1.0, -1.0), texel);
  let e = tap(uv, vec2f(1.0, -1.0), texel);
  let f = tap(uv, vec2f(-2.0, 0.0), texel);
  let g = tap(uv, vec2f(0.0, 0.0), texel);
  let h = tap(uv, vec2f(2.0, 0.0), texel);
  let i = tap(uv, vec2f(-1.0, 1.0), texel);
  let j = tap(uv, vec2f(1.0, 1.0), texel);
  let k = tap(uv, vec2f(-2.0, 2.0), texel);
  let l = tap(uv, vec2f(0.0, 2.0), texel);
  let m = tap(uv, vec2f(2.0, 2.0), texel);
  let color = (d + e + i + j) * 0.125
    + (a + b + f + g) * 0.03125
    + (b + c + g + h) * 0.03125
    + (f + g + k + l) * 0.03125
    + (g + h + l + m) * 0.03125;
  return vec4f(color, 1.0);
}
