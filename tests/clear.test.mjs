import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { CLEAR_DIM } from "../src/glass/material.ts";
import { image, openLab } from "./harness.mjs";

/**
 * V5c: Clear gets a dimming layer while a symbol sits on it (WWDC25 "Meet Liquid Glass"); Regular
 * is never dimmed. Measured on the flat top, away from the symbol, with nothing but transmitted light.
 */
const W = 480;
const H = 240;
const SHAPE = { cx: 240, cy: 120, halfWidth: 180, halfHeight: 70, radius: 70, exponent: 2, rotation: 0 };
const BARE = { roughness: 0, shadow: 0, environment: 0, light: 0, abbe: 90, edge: 0 };
const SYMBOL = { symbol: 4, size: 34, color: [1, 1, 1, 0.96] };
const toLinear = (b) => {
  const c = b / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const Y = ([r, g, b]) => 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

let lab;

before(async () => {
  lab = await openLab("/probe.html");
  await lab.page.waitForFunction(() => window.probe !== undefined);
  await lab.page.evaluate(([w, h]) => window.probe.init(w, h, "solid-light"), [W, H]);
});

after(async () => {
  const errors = [...lab.errors];
  await lab.close();
  assert.deepEqual(errors, [], "a página não pode registrar erro");
});

/** Luminance on the flat top, 90 px right of the symbol. */
async function flatTop(variant, content) {
  const material = { ...BARE, variant, adapt: variant === "regular" ? 0 : 0.5 };
  const out = image(await lab.page.evaluate((r) => window.probe.render(r), { surfaces: [{ shape: SHAPE, material, ...(content ? { content } : {}) }] }));
  return Y(out.at(330, 120));
}

test("Claro com símbolo: a luz que atravessa cai pelo fator da camada de escurecimento", async () => {
  const bare = await flatTop("clear", null);
  const dimmed = await flatTop("clear", SYMBOL);
  const ratio = dimmed / bare;
  assert.ok(Math.abs(ratio - (1 - CLEAR_DIM)) < 0.01, `razão ${ratio.toFixed(3)}, esperado ${(1 - CLEAR_DIM).toFixed(3)}`);
});

test("Regular com símbolo e Claro sem símbolo não escurecem", async () => {
  assert.equal(await flatTop("regular", SYMBOL), await flatTop("regular", null));
  const clear = await flatTop("clear", null);
  assert.equal(await flatTop("clear", { ...SYMBOL, color: [1, 1, 1, 0] }), clear, "símbolo invisível não pede escurecimento");
});
