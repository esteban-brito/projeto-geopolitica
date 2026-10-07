import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { sminCubic, unionField } from "../src/glass/union.ts";
import { image, openLab } from "./harness.mjs";

/**
 * V3 smooth union. The maths is checked in Node against its own definition (value, derivative,
 * continuity); the shader is checked against the TS mirror by readback, like the radial table.
 */
const W = 400;
const H = 240;
const SAMPLE_VIEW = 7;
const circle = (cx, cy, r) => ({ cx, cy, halfWidth: r, halfHeight: r, radius: r, exponent: 2, rotation: 0 });
/** Two circles of radius 60 with `gap` px between them, centred in the canvas. */
const pair = (gap, spacing, material = {}) => ({
  spacing,
  surfaces: [
    { shape: circle(W / 2 - 60 - gap / 2, H / 2, 60), material },
    { shape: circle(W / 2 + 60 + gap / 2, H / 2, 60), material },
  ],
});

test("smin cúbica: k é a profundidade em a = b, e longe dela é o mínimo exato", () => {
  const [v, t] = sminCubic(5, 5, 4);
  assert.ok(Math.abs(v - (5 - 4)) < 1e-12 && t === 0.5, `smin(5,5,4) = ${v}, t = ${t}`);
  assert.deepEqual(sminCubic(0, 30, 4), [0, 0]);
  assert.deepEqual(sminCubic(30, 0, 4), [0, 1]);
  assert.deepEqual(sminCubic(1, 2, 0), [1, 0], "k = 0 é o mínimo duro");
});

test("smin cúbica: t é a derivada em b, e valor, t e dt/db são contínuos (C²)", () => {
  const k = 3;
  const eps = 1e-5;
  for (let b = -25; b <= 25; b += 0.37) {
    const numeric = (sminCubic(0, b + eps, k)[0] - sminCubic(0, b - eps, k)[0]) / (2 * eps);
    assert.ok(Math.abs(numeric - sminCubic(0, b, k)[1]) < 1e-6, `b=${b}: t ${sminCubic(0, b, k)[1]}, numérico ${numeric}`);
  }
  // dt/db across the two seams of the piecewise definition: a = b and |a − b| = 6k.
  const slope = (b) => (sminCubic(0, b + eps, k)[1] - sminCubic(0, b - eps, k)[1]) / (2 * eps);
  for (const seam of [0, 6 * k, -6 * k]) {
    const left = slope(seam - 1e-3);
    const right = slope(seam + 1e-3);
    assert.ok(Math.abs(left - right) < 1e-3, `dt/db salta em b=${seam}: ${left} → ${right}`);
  }
});

test("união: pesos somam 1, o gradiente encolhe entre dois membros e some no cume do pescoço", () => {
  const shapes = [circle(-70, 0, 60), circle(70, 0, 60)];
  const ridge = unionField(shapes, 12, 0, 0);
  assert.ok(Math.hypot(ridge.gx, ridge.gy) < 1e-6, "no centro do pescoço o gradiente é zero");
  assert.equal(ridge.blend.length, 2);
  assert.ok(Math.abs(ridge.blend[0].weight - 0.5) < 1e-9, "simétrico no meio");
  for (const [x, y] of [[-30, 20], [10, -15], [100, 40], [-129, 0]]) {
    const u = unionField(shapes, 12, x, y);
    const sum = u.blend.reduce((a, b) => a + b.weight, 0);
    assert.ok(Math.abs(sum - 1) < 1e-9, `(${x},${y}) pesos somam ${sum}`);
    assert.ok(Math.hypot(u.gx, u.gy) <= 1 + 1e-9);
  }
  const far = unionField([circle(-300, 0, 60), circle(300, 0, 60)], 12, -300, 50);
  assert.equal(far.blend.length, 1, "longe do outro membro, a óptica é só a do próprio");
});

test("união: dois vidros se tocam quando o vão fica abaixo do espaçamento", () => {
  const mid = (gap, spacing) => unionField(pair(gap, spacing).surfaces.map((s) => s.shape), spacing / 2, W / 2, H / 2).d;
  assert.ok(mid(30, 40) < 0, "vão 30 < espaçamento 40: ponte");
  assert.ok(mid(50, 40) > 0, "vão 50 > espaçamento 40: separados");
});

let lab;

before(async () => {
  lab = await openLab("/probe.html");
  await lab.page.waitForFunction(() => window.probe !== undefined);
  await lab.page.evaluate(([w, h]) => window.probe.init(w, h, "coordinates"), [W, H]);
});

after(async () => {
  const errors = [...lab.errors];
  await lab.close();
  assert.deepEqual(errors, [], "a página não pode registrar erro");
});

const render = (req) => lab.page.evaluate((r) => window.probe.render(r), req).then(image);
const predict = (group, x, y) => lab.page.evaluate(([g, px, py]) => window.probe.predictUnion(g, px, py), [group, x, y]);

/** In the sample view at W×H the byte is the source position scaled to 0..255. */
const sampled = (img, x, y) => {
  const [r, g] = img.at(x, y);
  return [(r / 255) * (W - 1), (g / 255) * (H - 1)];
};

test("GPU e CPU concordam na amostra dentro do pescoço e na zona de mistura", async () => {
  const group = pair(24, 40);
  const img = await render({ groups: [group], debugView: SAMPLE_VIEW });
  let compared = 0;
  const points = [];
  for (let y = H / 2 - 40; y <= H / 2 + 40; y += 4) for (let x = W / 2 - 50; x <= W / 2 + 50; x += 5) points.push([x, y]);
  for (const [x, y] of points) {
    const p = await predict(group, x, y);
    if (p.d > -1.5 || p.transmission < 0.05) continue;
    const [gx, gy] = sampled(img, x, y);
    // One byte of the sample view is (W − 1) / 255 ≈ 1.6 px wide.
    assert.ok(Math.abs(gx - p.x) <= 2.5 && Math.abs(gy - p.y) <= 2.5, `(${x},${y}): GPU (${gx.toFixed(1)},${gy.toFixed(1)}), CPU (${p.x.toFixed(1)},${p.y.toFixed(1)})`);
    if (p.blend.length > 1) compared++;
  }
  assert.ok(compared >= 20, `só ${compared} pixels comparáveis com dois membros misturados`);
});

test("sem espaçamento o grupo é idêntico a superfícies soltas", async () => {
  const group = pair(60, 0, { shadow: 0 });
  const merged = await render({ groups: [group], debugView: SAMPLE_VIEW });
  const loose = await render({ surfaces: group.surfaces, debugView: SAMPLE_VIEW });
  let differ = 0;
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      const a = merged.at(x, y);
      const b = loose.at(x, y);
      if (a.some((v, i) => Math.abs(v - b[i]) > 1)) differ++;
    }
  }
  assert.equal(differ, 0, `${differ} pixels diferentes`);
});

test("a ponte aparece só abaixo do espaçamento", async () => {
  const center = async (gap, spacing) => (await render({ groups: [pair(gap, spacing, { shadow: 0 })], debugView: SAMPLE_VIEW })).at(W / 2, H / 2);
  const [, , blueJoined] = await center(30, 40);
  const [, , blueApart] = await center(50, 40);
  // The sample view writes blue = 1 inside the glass; the coordinates scene has no blue.
  assert.ok(blueJoined > 200, `vão 30, espaçamento 40: centro azul ${blueJoined}`);
  assert.ok(blueApart < 50, `vão 50, espaçamento 40: centro azul ${blueApart}`);
});

test("a amostra varia sem saltos ao atravessar o pescoço (sem vinco)", async () => {
  // A thin neck: its whole height lies in the outer bevel, where the offset is largest. Using the
  // normalised gradient instead of the union's own makes the offset flip across the ridge (7–9
  // bytes between neighbours, measured); the exact gradient fades to zero there instead.
  const img = await render({ groups: [pair(30, 40)], debugView: SAMPLE_VIEW });
  let worst = 0;
  const walk = (points, channel) => {
    let previous = null;
    for (const [x, y] of points) {
      const px = img.at(x, y);
      if (px[2] < 250) {
        previous = null;
        continue;
      }
      if (previous !== null) worst = Math.max(worst, Math.abs(px[channel] - previous));
      previous = px[channel];
    }
  };
  for (let y = H / 2 - 30; y <= H / 2 + 30; y += 6) walk(Array.from({ length: 101 }, (_, i) => [W / 2 - 50 + i, y]), 0);
  for (let x = W / 2 - 20; x <= W / 2 + 20; x += 4) walk(Array.from({ length: 81 }, (_, i) => [x, H / 2 - 40 + i]), 1);
  assert.ok(worst <= 4, `maior salto entre vizinhos: ${worst} bytes`);
});
