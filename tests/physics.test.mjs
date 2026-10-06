import assert from "node:assert/strict";
import { test } from "node:test";
import { shapeMatrix } from "../src/glass/shape.ts";
import { GlassBody, MAX_STRETCH } from "../src/physics/body.ts";
import { Spring } from "../src/physics/spring.ts";

/** Runs a spring from 0 to 1 at `hz` for `seconds`; returns the trajectory. */
function run(config, hz, seconds) {
  const spring = new Spring(0, config, 1e-5);
  spring.target = 1;
  const values = [];
  for (let t = 0; t < seconds; t += 1 / hz) {
    spring.step(1 / hz);
    values.push(spring.value);
  }
  return values;
}

test("amortecimento crítico chega ao alvo sem passar dele", () => {
  const values = run({ response: 0.3, dampingRatio: 1 }, 120, 1.5);
  assert.ok(Math.max(...values) <= 1 + 1e-3, `pico ${Math.max(...values).toFixed(4)}`);
  assert.ok(Math.abs(values.at(-1) - 1) < 1e-3, `final ${values.at(-1)}`);
});

test("com ζ = 0,55 o overshoot é o da teoria (12,6%), não mais", () => {
  const peak = Math.max(...run({ response: 0.3, dampingRatio: 0.55 }, 240, 2));
  assert.ok(peak > 1.1 && peak < 1.15, `pico ${peak.toFixed(4)}`);
});

test("a mola é a mesma a 30 Hz e a 240 Hz (subpasso fixo)", () => {
  const config = { response: 0.25, dampingRatio: 0.6 };
  const slow = run(config, 30, 1);
  const fast = run(config, 240, 1);
  assert.ok(Math.abs(Math.max(...slow) - Math.max(...fast)) < 0.01, "picos diferentes");
  assert.ok(Math.abs(slow.at(-1) - fast.at(-1)) < 0.01, "finais diferentes");
});

function dragAcross(body, vx, vy, frames, hz = 120) {
  body.grab(body.rest.cx, body.rest.cy);
  let x = body.rest.cx;
  let y = body.rest.cy;
  for (let i = 0; i < frames; i++) {
    x += vx / hz;
    y += vy / hz;
    body.drag(x, y);
    body.step(1 / hz);
  }
}

const REST = { cx: 0, cy: 0, halfWidth: 100, halfHeight: 40, radius: 40, exponent: 2, rotation: 0 };

test("arrastar estica o vidro ao longo da velocidade, inclusive na diagonal", () => {
  const body = new GlassBody({ ...REST });
  dragAcross(body, 900, 900, 30);
  const { stretch } = body.shape();
  assert.ok(stretch && stretch.amount > 0.02, `estiramento ${stretch?.amount}`);
  const angle = (stretch.angle * 180) / Math.PI;
  assert.ok(Math.abs(angle - 45) < 5, `ângulo ${angle.toFixed(1)}° (esperado 45°)`);
});

test("o estiramento preserva a área e tem teto", () => {
  const body = new GlassBody({ ...REST });
  dragAcross(body, 40000, 0, 30);
  const shape = body.shape();
  assert.ok(shape.stretch.amount <= MAX_STRETCH + 1e-9, `estiramento ${shape.stretch.amount}`);
  const m = shapeMatrix({ ...shape, scale: 1 });
  assert.ok(Math.abs(m[0] * m[3] - m[1] * m[2] - 1) < 1e-9, "det ≠ 1: a área mudou");
});

test("solto, o vidro assenta: posição no alvo, sem estiramento, laço parado", () => {
  const body = new GlassBody({ ...REST });
  dragAcross(body, 1200, -300, 20);
  body.release();
  for (let i = 0; i < 240 && body.moving; i++) body.step(1 / 120);
  assert.equal(body.moving, false, "o laço tem de parar sozinho");
  const shape = body.shape();
  assert.equal(shape.stretch, undefined);
  assert.equal(shape.scale, 1);
});

test("o bounce de soltar é contido: no máximo 1% abaixo do tamanho de repouso", () => {
  const body = new GlassBody({ ...REST });
  body.grab(0, 0);
  for (let i = 0; i < 60; i++) body.step(1 / 120);
  body.release();
  let min = Infinity;
  for (let i = 0; i < 240; i++) {
    body.step(1 / 120);
    min = Math.min(min, body.shape().scale);
  }
  assert.ok(min < 1, "tem de haver um bounce");
  assert.ok(min > 0.99, `escala mínima ${min.toFixed(4)}`);
});
