import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { image, openLab } from "./harness.mjs";

const SIZE = 256;
const SAMPLE_VIEW = 7;
const CAPSULE = { cx: 128, cy: 128, halfWidth: 100, halfHeight: 44, radius: 44, exponent: 2, rotation: 0 };
const STRONG = { thickness: 40, gap: 30, bevel: 40, ior: 1.9 };

let lab;

before(async () => {
  lab = await openLab("/probe.html");
  await lab.page.waitForFunction(() => window.probe !== undefined);
  const info = await lab.page.evaluate((size) => window.probe.init(size, size, "coordinates"), SIZE);
  console.log(`adaptador: ${info.adapter}${info.fallback ? " (fallback, só correção)" : ""}`);
});

after(async () => {
  const errors = [...lab.errors];
  await lab.close();
  assert.deepEqual(errors, [], "a página não pode registrar erro");
});

const render = (req) => lab.page.evaluate((r) => window.probe.render(r), req).then(image);

/** In the sample view the byte is the source pixel: 256 px ↔ 0..255. */
const sampleAt = (img, x, y) => {
  const [r, g] = img.at(x, y);
  return [r, g];
};

test("sem vidro, a cena de coordenadas volta byte a byte (caminho sRGB sem perda)", async () => {
  const img = await render({ surfaces: [] });
  for (const [x, y] of [[0, 0], [17, 200], [128, 128], [255, 255], [201, 33]]) {
    const [r, g] = img.at(x, y);
    assert.ok(Math.abs(r - x) <= 1 && Math.abs(g - y) <= 1, `(${x},${y}) → (${r},${g})`);
  }
});

test("o centro plano não desloca a luz", async () => {
  const img = await render({ surfaces: [{ shape: CAPSULE }], debugView: SAMPLE_VIEW });
  const [sx, sy] = sampleAt(img, 128, 128);
  assert.ok(Math.abs(sx - 128) <= 1 && Math.abs(sy - 128) <= 1, `centro amostrou (${sx},${sy})`);
});

test("fora da forma (além do antialias) o fundo fica intacto", async () => {
  const img = await render({ surfaces: [{ shape: CAPSULE }] });
  const [r, g] = img.at(128 + 100 + 3, 128);
  assert.ok(Math.abs(r - 231) <= 1 && Math.abs(g - 128) <= 1, `pixel externo virou (${r},${g})`);
});

test("na borda convexa a luz vem de dentro: lente que comprime para o centro", async () => {
  const img = await render({ surfaces: [{ shape: CAPSULE }], debugView: SAMPLE_VIEW });
  const right = sampleAt(img, 128 + 100 - 4, 128)[0];
  const left = sampleAt(img, 128 - 100 + 3, 128)[0];
  const top = sampleAt(img, 128, 128 - 44 + 3)[1];
  assert.ok(right < 128 + 100 - 4, `borda direita amostrou x=${right}`);
  assert.ok(left > 128 - 100 + 3, `borda esquerda amostrou x=${left}`);
  assert.ok(top > 128 - 44 + 3, `borda superior amostrou y=${top}`);
});

test("GPU e CPU concordam no deslocamento ao longo do bisel (mesma tabela radial)", async () => {
  const material = { thickness: 14, gap: 8, bevel: 22, ior: 1.5 };
  const img = await render({ surfaces: [{ shape: CAPSULE, material }], debugView: SAMPLE_VIEW });
  const edge = 128 + 100;
  let compared = 0;
  for (let px = edge - 21; px < edge; px++) {
    const depth = edge - (px + 0.5);
    const p = await lab.page.evaluate(([s, m, d]) => window.probe.predictOffset(s, m, d), [CAPSULE, material, depth]);
    if (p.transmission < 0.05) continue;
    const expected = px + p.offset;
    const got = sampleAt(img, px, 128)[0];
    assert.ok(Math.abs(got - expected) <= 1.5, `x=${px}: GPU ${got}, CPU ${expected.toFixed(2)}`);
    compared++;
  }
  assert.ok(compared >= 15, `só ${compared} pixels comparáveis`);
});

/** Largest backward step of the sample position while walking outward along +x. */
async function worstFold(guard) {
  const img = await render({ surfaces: [{ shape: CAPSULE, material: STRONG }], debugView: SAMPLE_VIEW, guard });
  let worst = 0;
  let previous = -Infinity;
  for (let px = 128; px < 128 + 100; px++) {
    const [r, , , a] = img.at(px, 128);
    if (a === 0) continue;
    worst = Math.max(worst, previous - r);
    previous = Math.max(previous, r);
  }
  return worst;
}

test("a guarda mantém o mapeamento injetivo mesmo com vidro grosso (n=1,9)", async () => {
  assert.ok((await worstFold(true)) <= 1, "com a guarda, a amostra nunca anda para trás");
});

test("sem a guarda o mesmo vidro dobra a imagem — a guarda é o que impede", async () => {
  assert.ok((await worstFold(false)) >= 3, "o teste precisa enxergar a dobra quando ela existe");
});

test("no canto arredondado a amostra não atravessa o centro do canto", async () => {
  const img = await render({ surfaces: [{ shape: CAPSULE, material: STRONG }], debugView: SAMPLE_VIEW });
  const capCenterX = 128 + 100 - 44;
  for (let px = capCenterX; px < 128 + 100; px++) {
    const [sx] = sampleAt(img, px, 128);
    assert.ok(sx >= capCenterX - 1, `x=${px} amostrou ${sx}, além do centro ${capCenterX}`);
  }
});
