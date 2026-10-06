// The background is the content the glass refracts. It has the canvas's size, so a texel is a pixel.

@group(0) @binding(0) var bgTex: texture_2d<f32>;

struct VOut {
  @builtin(position) pos: vec4f,
}

@vertex
fn vs_main(@builtin(vertex_index) i: u32) -> VOut {
  let p = vec2f(f32((i << 1u) & 2u), f32(i & 2u));
  var out: VOut;
  out.pos = vec4f(p * 2.0 - 1.0, 0.0, 1.0);
  return out;
}

@fragment
fn fs_main(in: VOut) -> @location(0) vec4f {
  return vec4f(textureLoad(bgTex, vec2i(in.pos.xy), 0).rgb, 1.0);
}
