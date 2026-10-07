import assert from "node:assert/strict";
import { test } from "node:test";
import { CONTENT_FLOATS, GROUP_FLOATS, SURFACE_FLOATS, UploadStage } from "../src/renderer/stage.ts";

/**
 * The upload stage decides when the composite under layer 1 can be reused: only when layer 0
 * uploaded exactly what it did last frame. Three surfaces: 0 and 1 on layer 0, 2 on layer 1; one
 * draw record and one symbol for layer 0, one of each for layer 1.
 */
const LOWER = { unionStart: 2, unions: 0 }; // records 0 and 1 are layer 0's singles

function frame(stage, edit = () => {}) {
  const { surfaces, layers } = stage.flip();
  for (let i = 0; i < 3; i++) {
    surfaces.fill(i + 1, i * SURFACE_FLOATS, (i + 1) * SURFACE_FLOATS);
    layers[i] = i === 2 ? 1 : 0;
  }
  const groups = stage.groups(3);
  for (let r = 0; r < 3; r++) groups.f32.fill(10 + r, r * GROUP_FLOATS, (r + 1) * GROUP_FLOATS);
  const content = stage.content(2);
  content.fill(20, 0, CONTENT_FLOATS);
  content.fill(21, CONTENT_FLOATS, 2 * CONTENT_FLOATS);
  edit({ surfaces, layers, groups, content });
  return stage.lowerChanged(3, LOWER, 1);
}

test("o mesmo quadro duas vezes: reaproveita; o primeiro conta como mudado", () => {
  const stage = new UploadStage();
  assert.equal(frame(stage), true, "primeiro quadro: nada para comparar");
  assert.equal(frame(stage), false);
  assert.equal(frame(stage), false);
});

test("mudar o vidro de cima não toca a camada de baixo; mudar um de baixo, sim", () => {
  const stage = new UploadStage();
  frame(stage);
  frame(stage);
  assert.equal(frame(stage, ({ surfaces }) => (surfaces[2 * SURFACE_FLOATS] = 99)), false, "superfície da camada 1");
  assert.equal(frame(stage, ({ groups }) => (groups.f32[2 * GROUP_FLOATS] = 99)), false, "registro da camada 1");
  assert.equal(frame(stage, ({ content }) => (content[CONTENT_FLOATS] = 99)), false, "símbolo da camada 1");
  frame(stage);
  assert.equal(frame(stage, ({ surfaces }) => (surfaces[SURFACE_FLOATS + 5] = 99)), true, "superfície da camada 0");
  frame(stage);
  assert.equal(frame(stage, ({ groups }) => (groups.u32[4] = 7)), true, "registro da camada 0 (campo inteiro)");
  frame(stage);
  assert.equal(frame(stage, ({ content }) => (content[3] = 99)), true, "símbolo da camada 0");
  frame(stage);
  assert.equal(frame(stage, ({ layers }) => (layers[1] = 1)), true, "um vidro trocou de camada");
});

test("crescer os buffers perde o quadro anterior: conta como mudado uma vez", () => {
  const stage = new UploadStage();
  frame(stage);
  frame(stage);
  stage.reserveSurfaces(64);
  assert.equal(frame(stage), true);
  assert.equal(frame(stage), false);
});
