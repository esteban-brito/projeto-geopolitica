import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { image, openLab } from "./harness.mjs";

/**
 * Layers (glass over glass) and what sits on a glass, by readback. A glass on layer 1 must see
 * layer 0 — its glasses, symbols and shadows — and nothing else must change: far from layer 0 it is
 * the same glass, a lone upper layer costs nothing, and the composite below is reused while only
 * the upper layer moves, with the same pixels a fresh frame would have.
 */
const W = 480;
const H = 240;
const capsule = (cx, cy, hw, hh) => ({ cx, cy, halfWidth: hw, halfHeight: hh, radius: hh, exponent: 2, rotation: 0 });
const circle = (cx, cy, r) => ({ cx, cy, halfWidth: r, halfHeight: r, radius: r, exponent: 2, rotation: 0 });
/** Transmitted light only: no blur, no reflected environment (it averages the whole frame), no adaptation. */
const PLAIN = { roughness: 0, environment: 0, adapt: 0 };
const DARK_SYMBOL = { symbol: 4, size: 34, color: [0.08, 0.08, 0.1, 1] };

let lab;

before(async () => {
  lab = await openLab("/probe.html");
  await lab.page.waitForFunction(() => window.probe !== undefined);
});

after(async () => {
  const errors = [...lab.errors];
  await lab.close();
  assert.deepEqual(errors, [], "a página não pode registrar erro");
});

const init = (scene) => lab.page.evaluate(([w, h, s]) => window.probe.init(w, h, s), [W, H, scene]);
const render = async (req) => image(await lab.page.evaluate((r) => window.probe.render(r), req));
const lowerRenders = () => lab.page.evaluate(() => window.probe.lowerRenders());

/** Largest channel difference over a rectangle (whole frame by default). */
function maxDiff(a, b, [x0, y0, x1, y1] = [0, 0, W, H]) {
  let worst = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const p = a.at(x, y);
      const q = b.at(x, y);
      for (let c = 0; c < 3; c++) worst = Math.max(worst, Math.abs(p[c] - q[c]));
    }
  }
  return worst;
}

/** Two groups that never merge (spacing 0), the second on `upper`'s layer. */
const scene = (lower, upper, layer = 1) => ({
  groups: [
    { spacing: 0, surfaces: [lower] },
    { spacing: 0, surfaces: [upper], layer },
  ],
});

test("uma camada de cima sozinha é desenhada como camada 0, sem custo extra", async () => {
  await init("grid");
  const glass = { shape: capsule(240, 120, 150, 56), material: PLAIN };
  const flat = await render({ groups: [{ spacing: 0, surfaces: [glass] }] });
  const before = await lowerRenders();
  const alone = await render({ groups: [{ spacing: 0, surfaces: [glass], layer: 1 }] });
  assert.equal(maxDiff(flat, alone), 0, "mesmos pixels");
  assert.equal(await lowerRenders(), before, "nenhuma composição de camada de baixo");
});

test("longe da camada de baixo, o vidro de cima é o mesmo vidro (e o resto do quadro também)", async () => {
  await init("image");
  const lower = { shape: capsule(110, 120, 80, 48), material: PLAIN };
  const upper = { shape: circle(372, 120, 52), material: PLAIN };
  const flat = await render(scene(lower, upper, 0));
  const layered = await render(scene(lower, upper, 1));
  const diff = maxDiff(flat, layered);
  // The composite is the same 8-bit sRGB the frame is; copying it back is exact up to rounding.
  assert.ok(diff <= 1, `diferença máxima ${diff}/255`);
});

test("o vidro de cima vê o de baixo: através dele, a cor do vidro tingido e o símbolo", async () => {
  await init("solid-light");
  const red = { ...PLAIN, tint: [1, 0.15, 0.15], density: 1 };
  const lower = { shape: capsule(200, 120, 160, 70), material: red, content: { ...DARK_SYMBOL, symbol: 0 } };
  const upper = { shape: circle(290, 120, 50), material: PLAIN };
  const centre = (img) => img.at(290, 120);
  const flat = centre(await render(scene(lower, upper, 0)));
  const layered = centre(await render(scene(lower, upper, 1)));
  // Flat, the upper glass refracts the white content and covers the red glass; layered, it shows it.
  assert.ok(flat[0] - flat[1] < 12, `achatado, centro quase neutro: ${flat}`);
  assert.ok(layered[0] - layered[1] > 60, `em camadas, centro vermelho: ${layered}`);

  // The lower glass's symbol sits right under the upper one: it must show through it.
  const over = { shape: circle(200, 120, 50), material: PLAIN };
  const withSymbol = await render(scene(lower, over));
  const without = await render(scene({ ...lower, content: undefined }, over));
  const inside = [170, 90, 230, 150];
  const diff = maxDiff(withSymbol, without, inside);
  assert.ok(diff > 60, `o símbolo de baixo aparece através do vidro de cima (diferença ${diff}/255)`);
});

test("cache: mover só o vidro de cima reaproveita a camada de baixo, com os pixels de um quadro do zero", async () => {
  await init("image");
  const lower = { shape: capsule(200, 120, 160, 64), material: { ...PLAIN, roughness: 0.4 }, content: DARK_SYMBOL };
  const at = (x) => ({ shape: circle(x, 110, 46), material: { ...PLAIN, roughness: 0.25 } });
  await render(scene(lower, at(150)));
  const count = await lowerRenders();
  const moved = await render(scene(lower, at(260)));
  assert.equal(await lowerRenders(), count, "a composição de baixo não foi refeita");

  await init("image");
  const fresh = await render(scene(lower, at(260)));
  const diff = maxDiff(moved, fresh);
  assert.ok(diff === 0, `quadro reaproveitado = quadro do zero (diferença ${diff}/255)`);

  const before = await lowerRenders();
  await render(scene({ ...lower, shape: capsule(206, 120, 160, 64) }, at(260)));
  assert.equal(await lowerRenders(), before + 1, "mover o de baixo refaz a composição");
});

test("métricas: o vidro de cima mede o que está embaixo dele, vidro de baixo incluído", async () => {
  await init("solid-light");
  const smoke = { ...PLAIN, tint: [0.12, 0.12, 0.14], density: 1 };
  const lower = { shape: capsule(220, 120, 180, 80), material: smoke };
  const upper = { shape: circle(220, 120, 48), material: PLAIN };
  await render(scene(lower, upper, 0));
  const flat = await lab.page.evaluate(() => window.probe.backdrop());
  await render(scene(lower, upper, 1));
  const layered = await lab.page.evaluate(() => window.probe.backdrop());
  assert.ok(Math.abs(layered[0][0] - flat[0][0]) < 0.5, `o de baixo mede o mesmo fundo: ${flat[0][0]} × ${layered[0][0]}`);
  assert.ok(flat[1][0] > 85, `achatado, o de cima mede o fundo claro: L* ${flat[1][0]}`);
  assert.ok(layered[1][0] < flat[1][0] - 25, `em camadas, mede o vidro fumê embaixo: L* ${layered[1][0]}`);
});

test("conteúdo: o símbolo fica centrado no vidro, gira com ele e some nas vistas de inspeção", async () => {
  await init("solid-light");
  // Symbol 4 is three horizontal bars: symmetric, so its centroid is the glass's centre.
  const glass = (rotation) => ({ shape: { ...capsule(240, 120, 120, 50), rotation }, material: PLAIN, content: DARK_SYMBOL });
  /** Pixels the symbol darkens, against the same glass without it. */
  const dark = async (rotation) => {
    const img = await render({ surfaces: [glass(rotation)] });
    const bare = await render({ surfaces: [{ ...glass(rotation), content: undefined }] });
    let n = 0;
    let sx = 0;
    let sy = 0;
    let sxx = 0;
    let syy = 0;
    for (let y = 70; y < 170; y++) {
      for (let x = 180; x < 300; x++) {
        const d = bare.at(x, y)[1] - img.at(x, y)[1];
        if (d < 40) continue;
        n++;
        sx += x + 0.5;
        sy += y + 0.5;
        sxx += (x + 0.5) ** 2;
        syy += (y + 0.5) ** 2;
      }
    }
    return { n, x: sx / n, y: sy / n, spreadX: sxx / n - (sx / n) ** 2, spreadY: syy / n - (sy / n) ** 2 };
  };
  const level = await dark(0);
  assert.ok(level.n > 100, `${level.n} pixels escuros`);
  assert.ok(Math.abs(level.x - 240) < 1.5 && Math.abs(level.y - 120) < 1.5, `centroide (${level.x.toFixed(1)}, ${level.y.toFixed(1)})`);
  assert.ok(level.spreadX > level.spreadY, "barras deitadas: mais largas que altas");
  const turned = await dark(Math.PI / 2);
  assert.ok(turned.spreadY > turned.spreadX, "a 90° as barras ficam de pé");
  const inspect = await render({ surfaces: [glass(0)], debugView: 5 });
  const inspectBare = await render({ surfaces: [{ ...glass(0), content: undefined }], debugView: 5 });
  assert.equal(maxDiff(inspect, inspectBare), 0, "a vista de inspeção mostra só o vidro");
});
