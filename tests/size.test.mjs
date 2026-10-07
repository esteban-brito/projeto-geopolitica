import assert from "node:assert/strict";
import { test } from "node:test";
import { PRESETS, SIZE_REFERENCE, sizeResponse } from "../src/glass/material.ts";

/** V5b: bigger glass reads as thicker material (WWDC25). A pure function of the shape. */
const regular = PRESETS.regular.material;
const half = (side) => side / 2;

test("no tamanho de referência nada muda; o lado que conta é o menor", () => {
  assert.equal(sizeResponse(regular, half(SIZE_REFERENCE), half(SIZE_REFERENCE)), regular);
  assert.equal(sizeResponse(regular, 400, half(SIZE_REFERENCE)), regular, "uma cápsula longa não é um vidro grosso");
});

test("maior = mais espesso, lente mais larga, mais alto (sombra mais funda); menor = o inverso", () => {
  const small = sizeResponse(regular, 22, 22);
  const big = sizeResponse(regular, 176, 176);
  for (const key of ["thickness", "bevel", "gap", "shadow"]) {
    assert.ok(small[key] < regular[key] && regular[key] < big[key], `${key}: ${small[key]} < ${regular[key]} < ${big[key]}`);
  }
  // One octave each way: ±30% of thickness.
  assert.ok(Math.abs(big.thickness / regular.thickness - 1.6) < 1e-9 && Math.abs(small.thickness / regular.thickness - 0.7) < 1e-9);
  assert.equal(big.roughness, regular.roughness, "o espalhamento cresce pela geometria, não pela rugosidade");
});

test("limites: uma oitava para baixo, duas para cima", () => {
  assert.deepEqual(sizeResponse(regular, 4, 4), sizeResponse(regular, 22, 22), "abaixo de 44 px não afina mais");
  assert.deepEqual(sizeResponse(regular, 900, 900), sizeResponse(regular, 176, 176), "acima de 352 px não engrossa mais");
});
