import assert from "node:assert/strict";
import { test } from "node:test";
import { AdaptiveQuality } from "../src/renderer/adaptive.ts";

/** Run the controller at 240 Hz for `seconds` with GPU time `ms(t)`; returns the tier timeline. */
function run(start, ms, seconds, budget = 1000 / 240) {
  const q = new AdaptiveQuality(start, budget);
  const tiers = [];
  for (let t = 0; t < seconds * 1000; t += budget) tiers.push([t, q.sample(ms(t), t)]);
  return { q, tiers };
}

test("folga grande: sobe um nível por vez até o Ultra, nunca dois de uma vez", () => {
  const { q, tiers } = run("low", () => 0.3, 20);
  assert.equal(q.tier, "ultra");
  const changes = tiers.filter((x, i) => i > 0 && x[1] !== tiers[i - 1][1]);
  assert.equal(changes.length, 3, "low → medium → high → ultra");
  for (let i = 1; i < changes.length; i++) assert.ok(changes[i][0] - changes[i - 1][0] >= 3000, "cada subida espera 3 s");
});

test("um pico de um quadro não derruba o nível", () => {
  const { q } = run("high", (t) => (t > 1000 && t < 1005 ? 40 : 1), 3);
  assert.equal(q.tier, "high");
});

test("carga alta sustentada desce em ~0,5 s, e espera antes de descer de novo", () => {
  const { tiers } = run("ultra", () => 3.9, 4);
  const firstDrop = tiers.find((x) => x[1] !== "ultra");
  assert.ok(firstDrop && firstDrop[0] >= 500 && firstDrop[0] < 600, `primeira descida em ${firstDrop?.[0]} ms`);
  const secondDrop = tiers.find((x) => x[1] !== "ultra" && x[1] !== firstDrop[1]);
  assert.ok(secondDrop && secondDrop[0] - firstDrop[0] >= 2000, "resfriamento de 2 s entre trocas");
});

test("entre 35% e 75% do orçamento fica parado: sem oscilar", () => {
  const { tiers } = run("high", () => 2.2, 15);
  assert.ok(tiers.every((x) => x[1] === "high"));
});
