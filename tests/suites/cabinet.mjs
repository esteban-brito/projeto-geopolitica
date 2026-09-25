/* SUITE · O GABINETE — as cadeiras de ministro da Lei 14.600/2023 (pesquisa 15). */

import assert from "node:assert/strict";
import test from "node:test";
import { CATALOG, catalogViolations } from "../../src/data/catalog.mjs";

test("o gabinete tem as 38 cadeiras de ministro da lei: 32 ministérios e 6 da Presidência e da AGU", () => {
  const seats = CATALOG.cabinet;
  assert.equal(seats.length, 38);
  assert.equal(seats.filter(seat => seat.kind === "ministry").length, 32);
  assert.equal(seats.filter(seat => seat.kind === "presidency").length, 5);
  assert.equal(seats.filter(seat => seat.kind === "agu").length, 1);
  assert.equal(new Set(seats.map(seat => seat.id)).size, 38, "id repetido");
});

test("toda área do jogo tem a sua cadeira, e nenhuma cadeira aponta para área que não existe", () => {
  const areas = new Set(CATALOG.areas.map(area => area.id));
  const linked = CATALOG.cabinet.filter(seat => seat.area !== undefined);
  for (const seat of linked)
    assert.ok(areas.has(seat.area ?? ""), `${seat.id} aponta para ${seat.area}`);
  const covered = new Set(linked.map(seat => seat.area));
  for (const area of areas) assert.ok(covered.has(area), `a área ${area} não tem cadeira`);
  assert.deepEqual(catalogViolations(), []);
});

test("os ministros do corte sentam em cadeiras que existem", () => {
  const seats = new Set(CATALOG.cabinet.map(seat => seat.id));
  for (const minister of CATALOG.ministers)
    assert.ok(seats.has(minister.seat), `${minister.id} → ${minister.seat}`);
});
