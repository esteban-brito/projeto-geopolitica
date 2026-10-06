import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { image, openLab } from "./harness.mjs";

/**
 * V1 acceptance, measured on uniform backgrounds so every change in a pixel comes from the glass.
 * The criteria are the Liquid Glass 27 target recorded in docs/research §11.2.
 */
const W = 320;
const H = 200;
const CAPSULE = { cx: 160, cy: 100, halfWidth: 120, halfHeight: 48, radius: 48, exponent: 2, rotation: 0 };
const POLISHED = { roughness: 0, shadow: 0, abbe: 90 };

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

const luminance = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

async function renderOn(scene, material) {
  await lab.page.evaluate(([w, h, s]) => window.probe.init(w, h, s), [W, H, scene]);
  const out = await lab.page.evaluate((r) => window.probe.render(r), { surfaces: [{ shape: CAPSULE, material }] });
  return image(out);
}

/** Luminance profile along a vertical line from the centre to the top edge. */
function column(img, x, fromY, toY) {
  const values = [];
  const step = toY > fromY ? 1 : -1;
  for (let y = fromY; y !== toY; y += step) values.push(luminance(img.at(x, y)));
  return values;
}

test("sobre fundo claro, a borda escurece numa faixa, nos lados e no topo (borda escura legível)", async () => {
  const img = await renderOn("solid-light", POLISHED);
  const bg = luminance(img.at(10, 10));
  const dark = (values) => values.filter((v) => v < bg * 0.85).length;
  const side = [];
  for (let x = 160; x <= 160 + 120; x++) side.push(luminance(img.at(x, 100)));
  const top = column(img, 160, 100, 100 - 48 - 1);
  assert.ok(Math.min(...side) < bg * 0.8, `mínimo na lateral ${Math.min(...side).toFixed(3)} contra fundo ${bg.toFixed(3)}`);
  assert.ok(dark(side) >= 2 && dark(top) >= 2, `faixa escura: lateral ${dark(side)} px, topo ${dark(top)} px`);
});

test("sobre fundo escuro, o realce especular aparece (borda clara legível)", async () => {
  const img = await renderOn("solid-dark", POLISHED);
  const bg = luminance(img.at(10, 10));
  const top = column(img, 160, 100, 100 - 48);
  const brightest = Math.max(...top);
  assert.ok(brightest > bg + 0.15, `máximo no topo ${brightest.toFixed(3)} contra fundo ${bg.toFixed(3)}`);
});

test("o realce depende de N·L: o lado da luz brilha mais que o lado perpendicular", async () => {
  const img = await renderOn("solid-dark", POLISHED);
  const top = Math.max(...column(img, 160, 100, 100 - 48));
  let side = 0;
  for (let x = 160 + 120 - 30; x < 160 + 120; x++) side = Math.max(side, luminance(img.at(x, 100)));
  assert.ok(top > side + 0.1, `topo ${top.toFixed(3)}, lateral ${side.toFixed(3)}`);
});

test("girar a luz move o realce para o novo lado", async () => {
  const img = await renderOn("solid-dark", { ...POLISHED, lightAngle: 0 });
  const top = Math.max(...column(img, 160, 100, 100 - 48));
  let right = 0;
  for (let x = 160 + 120 - 30; x < 160 + 120; x++) right = Math.max(right, luminance(img.at(x, 100)));
  assert.ok(right > top + 0.1, `com luz a 0°: direita ${right.toFixed(3)}, topo ${top.toFixed(3)}`);
});

test("o realce não é um contorno de largura constante", async () => {
  const img = await renderOn("solid-dark", POLISHED);
  const bg = luminance(img.at(10, 10));
  const lit = (values) => values.filter((v) => v > bg + 0.08).length;
  const topWidth = lit(column(img, 160, 100, 100 - 48));
  let sideWidth = 0;
  for (let x = 160 + 120 - 30; x < 160 + 120; x++) if (luminance(img.at(x, 100)) > bg + 0.08) sideWidth++;
  assert.ok(topWidth >= sideWidth + 3, `largura iluminada: topo ${topWidth} px, lateral ${sideWidth} px`);
});

test("a sombra cai para baixo, não para cima", async () => {
  const img = await renderOn("solid-light", { roughness: 0, shadow: 1 });
  const below = luminance(img.at(160, 100 + 48 + 6));
  const above = luminance(img.at(160, 100 - 48 - 6));
  assert.ok(below < above - 0.03, `abaixo ${below.toFixed(3)}, acima ${above.toFixed(3)}`);
});

test("vidro fosco borra o conteúdo: menos contraste que o polido sobre a grade", async () => {
  const contrast = (img) => {
    let lo = 1;
    let hi = 0;
    for (let x = 120; x < 200; x++) {
      const v = luminance(img.at(x, 100));
      lo = Math.min(lo, v);
      hi = Math.max(hi, v);
    }
    return hi - lo;
  };
  const sharp = contrast(await renderOn("grid", { ...POLISHED }));
  const frost = contrast(await renderOn("grid", { ...POLISHED, roughness: 0.7 }));
  assert.ok(frost < sharp * 0.6, `contraste polido ${sharp.toFixed(3)}, fosco ${frost.toFixed(3)}`);
});

test("tint é absorção: densidade zero não muda cor, densidade alta tinge", async () => {
  const neutral = await renderOn("solid-light", { ...POLISHED, tint: [0.2, 0.4, 1], density: 0 });
  const tinted = await renderOn("solid-light", { ...POLISHED, tint: [0.2, 0.4, 1], density: 1 });
  const [nr, , nb] = neutral.at(160, 100);
  const [tr, , tb] = tinted.at(160, 100);
  assert.ok(Math.abs(nr - nb) <= 3, `sem densidade o centro é neutro (${nr}, ${nb})`);
  assert.ok(tb - tr > 40, `com densidade o centro puxa para o azul (${tr}, ${tb})`);
});
