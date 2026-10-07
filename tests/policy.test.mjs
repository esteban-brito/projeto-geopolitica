import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { adaptLight, AppearancePolicy, backdropStats, lightness, statelessAppearance } from "../src/glass/policy.ts";
import { image, openLab } from "./harness.mjs";

/**
 * V4 Regular policy: what the glass measures behind itself (cs_metrics) and what it does with it
 * (adapt_light), each against its TS mirror; the hysteresis and the flip in Node.
 */
const W = 320;
const H = 200;
const CAPSULE = { cx: 160, cy: 100, halfWidth: 120, halfHeight: 48, radius: 48, exponent: 2, rotation: 0 };
/** Nothing but transmitted light at the flat centre: no shadow, reflection, highlight or blur. */
const BARE = { roughness: 0, shadow: 0, environment: 0, light: 0, abbe: 90, adapt: 1 };
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toByte = (c) => Math.round(255 * (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055));
const LIGHT_BG = [0xe9, 0xe9, 0xe6].map((b) => toLinear(b / 255));
const DARK_BG = [0x1d, 0x1e, 0x22].map((b) => toLinear(b / 255));
const Y = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

test("histerese: entre 42 e 58 de L* o vidro não troca de lado", () => {
  const policy = new AppearancePolicy();
  policy.update({ mean: 70, p10: 60, p90: 80, coverage: 1 });
  assert.equal(policy.dark, false);
  assert.equal(policy.value, 0, "a primeira medida não anima");
  for (const mean of [55, 45, 50, 43]) policy.update({ mean, p10: 0, p90: 0, coverage: 1 });
  assert.equal(policy.dark, false, "dentro da faixa morta continua claro");
  assert.equal(policy.update({ mean: 40, p10: 0, p90: 0, coverage: 1 }), true);
  for (const mean of [45, 55, 57]) policy.update({ mean, p10: 0, p90: 0, coverage: 1 });
  assert.equal(policy.dark, true, "e volta só acima de 58");
  policy.update({ mean: 60, p10: 0, p90: 0, coverage: 1 });
  assert.equal(policy.dark, false);
});

test("a troca anima em ~0,5 s, sem passar do ponto", () => {
  const policy = new AppearancePolicy();
  policy.update({ mean: 80, p10: 0, p90: 0, coverage: 1 });
  policy.update({ mean: 20, p10: 0, p90: 0, coverage: 1 });
  const values = [];
  for (let i = 0; i < 120 && policy.step(1 / 120); i++) values.push(policy.value);
  assert.ok(values.length > 20 && values.length < 100, `${values.length} quadros a 120 Hz`);
  assert.ok(Math.max(...values) <= 1, "sem overshoot");
  assert.equal(policy.value, 1);
});

test("estatísticas: L* de uma cor lisa e percentis interpolados no balde (espelho de cs_metrics)", () => {
  const l = lightness(0.18);
  assert.ok(Math.abs(l - 49.5) < 0.1, `L*(0,18) = ${l}`);
  const flat = backdropStats(new Array(64).fill(l));
  assert.ok(Math.abs(flat.mean - l) < 1 / 64 + 1e-9);
  // All 64 samples in one bin: both percentiles land inside that bin.
  const bin = Math.floor(l / (100 / 16)) * (100 / 16);
  assert.ok(flat.p10 >= bin && flat.p90 <= bin + 100 / 16 && flat.p10 < flat.p90, `p10 ${flat.p10}, p90 ${flat.p90}`);
  const split = backdropStats([...new Array(32).fill(0), ...new Array(32).fill(100)]);
  assert.ok(split.p10 < 5 && split.p90 > 95 && Math.abs(split.mean - 50) < 0.1);
});

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

async function measure(scene, material = {}) {
  await lab.page.evaluate(([w, h, s]) => window.probe.init(w, h, s), [W, H, scene]);
  await lab.page.evaluate((r) => window.probe.render(r), { surfaces: [{ shape: CAPSULE, material }] });
  return (await lab.page.evaluate(() => window.probe.backdrop()))[0];
}

test("métricas na GPU: L* do fundo liso bate com o espelho; fundo dividido dá os extremos", async () => {
  const light = await measure("solid-light");
  const dark = await measure("solid-dark");
  const expected = (bg) => lightness(Y(bg));
  assert.ok(Math.abs(light[0] - expected(LIGHT_BG)) < 0.5, `claro: ${light[0].toFixed(2)} × ${expected(LIGHT_BG).toFixed(2)}`);
  assert.ok(Math.abs(dark[0] - expected(DARK_BG)) < 0.5, `escuro: ${dark[0].toFixed(2)} × ${expected(DARK_BG).toFixed(2)}`);
  assert.ok(light[3] > 0.7 && light[3] < 1, `cobertura da cápsula ${light[3]}`);
  const split = await measure("split");
  assert.ok(split[1] < 10 && split[2] > 90, `p10 ${split[1].toFixed(1)}, p90 ${split[2].toFixed(1)}`);
  // Samples next to the divide read the blurred mix, 0.5 in linear light = L* 76: the mean of
  // lightness sits above 50.
  assert.ok(split[0] > 45 && split[0] < 70, `média ${split[0].toFixed(1)}`);
});

async function centre(scene, surface) {
  await lab.page.evaluate(([w, h, s]) => window.probe.init(w, h, s), [W, H, scene]);
  const out = await lab.page.evaluate((r) => window.probe.render(r), { surfaces: [surface] });
  return image(out).at(160, 100);
}

test("adaptação na GPU = espelho em TS, nos dois lados (centro plano, só luz transmitida)", async () => {
  const transmission = (await lab.page.evaluate(([s, m]) => window.probe.predictOffset(s, m, 47.5), [CAPSULE, BARE])).transmission;
  for (const [scene, bg] of [["solid-light", LIGHT_BG], ["solid-dark", DARK_BG]]) {
    for (const appearance of [0, 1]) {
      const got = await centre(scene, { shape: CAPSULE, material: BARE, appearance });
      const want = adaptLight(bg, 1, appearance).map((c) => toByte(c * transmission));
      got.slice(0, 3).forEach((v, i) => assert.ok(Math.abs(v - want[i]) <= 2, `${scene}, aparência ${appearance}: GPU ${got.slice(0, 3)}, CPU ${want}`));
    }
  }
});

test("sem aparência dada, a GPU decide pela medida do mesmo quadro", async () => {
  for (const [scene, side] of [["solid-light", 0], ["solid-dark", 1]]) {
    const auto = await centre(scene, { shape: CAPSULE, material: BARE });
    const forced = await centre(scene, { shape: CAPSULE, material: BARE, appearance: side });
    assert.deepEqual(auto, forced, `${scene}: ${auto} × ${forced}`);
    assert.equal(statelessAppearance(lightness(Y(scene === "solid-light" ? LIGHT_BG : DARK_BG))), side);
  }
});

test("legibilidade: sobre texto, o Regular clareia as letras pretas sob ele; o Claro não mexe", async () => {
  const darkest = async (material) => {
    await lab.page.evaluate(([w, h, s]) => window.probe.init(w, h, s), [W, H, "text"]);
    const img = image(await lab.page.evaluate((r) => window.probe.render(r), { surfaces: [{ shape: CAPSULE, material }] }));
    let min = 1;
    for (let y = 80; y < 120; y++) for (let x = 90; x < 230; x++) min = Math.min(min, Y(img.at(x, y).slice(0, 3).map((b) => toLinear(b / 255))));
    return min;
  };
  const regular = await darkest({ roughness: 0, shadow: 0 });
  const clear = await darkest({ roughness: 0, shadow: 0, variant: "clear" });
  assert.ok(clear < 0.05, `o Claro deixa o preto preto (${clear.toFixed(3)})`);
  assert.ok(regular > clear + 0.08, `Regular ${regular.toFixed(3)} × Claro ${clear.toFixed(3)}`);
});
