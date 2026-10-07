import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { GLOW_FLAT, glowField, glowLight } from "../src/glass/glow.ts";
import { FINGER_RADIUS, SPREAD_BEYOND, SUSTAIN, TouchGlow } from "../src/physics/touch.ts";
import { image, openLab } from "./harness.mjs";

/**
 * V5a: the glass lights up from the touch (WWDC25 "Meet Liquid Glass"). The light's life is
 * physics on the CPU; the light it adds is a shader term with a TS mirror, checked by readback.
 */
const W = 480;
const H = 240;
const toLinear = (b) => {
  const c = b / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const Y = ([r, g, b]) => 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

test("a luz nasce do tamanho do dedo, acende rápido, se espalha pelo vidro e além, e apaga sozinha", () => {
  const glow = new TouchGlow();
  assert.equal(glow.light(0, 0, 100), null, "sem toque, sem luz");
  glow.press(10, -5);
  glow.step(1 / 240);
  const first = glow.light(200, 100, 100);
  assert.ok(first && Math.abs(first.radius - FINGER_RADIUS) < 2, `nasce com ~${FINGER_RADIUS} px: ${first?.radius}`);
  assert.deepEqual([first.x, first.y], [210, 95], "ancorada onde o dedo pousou, relativa ao centro");
  // Strength before the spread spreads it thin: the flash, then the level held.
  const raw = (l) => l.intensity / (FINGER_RADIUS / l.radius) ** 0.6;
  let flash = 0;
  for (let i = 0; i < 72; i++) {
    glow.step(1 / 240); // 0.3 s
    flash = Math.max(flash, raw(glow.light(200, 100, 100)));
  }
  assert.ok(flash > 0.95, `acende por inteiro em 0,3 s: ${flash.toFixed(2)}`);
  const lit = glow.light(200, 100, 100);
  for (let i = 0; i < 480; i++) glow.step(1 / 240); // +2 s
  const spread = glow.light(200, 100, 100);
  assert.ok(Math.abs(raw(spread) - SUSTAIN) < 0.01, `segurando, assenta na sustentação: ${raw(spread).toFixed(2)}`);
  assert.ok(Math.abs(spread.radius - (100 + SPREAD_BEYOND)) < 1, `espalhada além do vidro: ${spread.radius.toFixed(1)}`);
  assert.ok(spread.intensity < lit.intensity, "o pico cai ao se espalhar (a mesma luz numa área maior)");
  glow.release();
  let steps = 0;
  while (glow.step(1 / 60) && steps < 600) steps++;
  assert.ok(steps < 180, `apaga em ${(steps / 60).toFixed(1)} s e para sozinha`);
  assert.equal(glow.light(200, 100, 100), null);
});

test("espelho: soma de gaussianas; a borda vertical brilha 1/GLOW_FLAT vezes o topo plano", () => {
  const lights = [{ x: 0, y: 0, radius: 10, intensity: 1 }, { x: 30, y: 0, radius: 20, intensity: 0.5 }];
  assert.ok(Math.abs(glowField(lights, 0, 0) - (1 + 0.5 * Math.exp(-2.25))) < 1e-12);
  assert.ok(Math.abs(glowLight(1, 0) / glowLight(1, 1) - 1 / GLOW_FLAT) < 1e-12);
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

const render = async (req) => image(await lab.page.evaluate((r) => window.probe.render(r), req));
const capsule = (cx, hw) => ({ cx, cy: 120, halfWidth: hw, halfHeight: 60, radius: 60, exponent: 2, rotation: 0 });
/** Nothing but transmitted light on the flat top: no blur, highlight, reflection or adaptation. */
const BARE = { roughness: 0, shadow: 0, environment: 0, light: 0, adapt: 0, abbe: 90 };

test("GPU e espelho concordam na luz somada ao topo plano", async () => {
  await lab.page.evaluate(([w, h]) => window.probe.init(w, h, "solid-dark"), [W, H]);
  const glass = { shape: capsule(240, 200), material: BARE };
  const touches = [{ x: 200, y: 120, radius: 40, intensity: 0.8 }];
  const off = await render({ surfaces: [glass] });
  const on = await render({ surfaces: [glass], touches });
  let worst = 0;
  for (const [x, y] of [[200, 120], [230, 120], [200, 150], [160, 100], [260, 135], [300, 120]]) {
    const added = Y(on.at(x, y)) - Y(off.at(x, y));
    const expected = glowLight(glowField(touches, x + 0.5, y + 0.5), 1);
    worst = Math.max(worst, Math.abs(added - expected));
  }
  // 8-bit sRGB on a dark background: a code step is ~0.0015 in linear here.
  assert.ok(worst < 0.004, `maior diferença ${worst.toFixed(4)} (linear)`);
});

test("o brilho alcança o vidro vizinho, mas não o conteúdo entre os dois", async () => {
  await lab.page.evaluate(([w, h]) => window.probe.init(w, h, "solid-dark"), [W, H]);
  const left = { shape: capsule(130, 100), material: BARE };
  const right = { shape: capsule(360, 100), material: BARE };
  const touches = [{ x: 225, y: 120, radius: 60, intensity: 1 }];
  const off = await render({ surfaces: [left, right] });
  const on = await render({ surfaces: [left, right], touches });
  const gain = (x) => Y(on.at(x, 120)) - Y(off.at(x, 120));
  assert.ok(gain(275) > 0.02, `o vizinho acende: +${gain(275).toFixed(3)}`);
  assert.equal(gain(245), 0, "o vão entre os vidros não recebe luz");
  const none = await render({ surfaces: [left, right], touches: [] });
  const same = [100, 245, 360].every((x) => off.at(x, 120).every((v, c) => v === none.at(x, 120)[c]));
  assert.ok(same, "sem luz, o quadro é o mesmo de antes");
});
