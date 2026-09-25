/* SUITE · O GABINETE — as cadeiras de ministro da Lei 14.600/2023 (pesquisa 15). */

import assert from "node:assert/strict";
import test from "node:test";
import { CATALOG, catalogViolations } from "../../src/data/catalog.mjs";
import { playMonth } from "../../src/application/turn.mjs";
import { deserialize, serialize } from "../../src/state/save.mjs";
import { createState, reduce } from "../../src/state/state.mjs";

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

/* ── NOMEAR E DEMITIR (E1.0a, passo 2) ─────────────────────────────────────── */

const minister = { id: "person-1", name: "Helena Prado", party: "democratas-nacionais" };

test("nomear senta a pessoa na cadeira, e demitir deixa a cadeira vaga", () => {
  const start = createState();
  assert.deepEqual(start.cabinet, {});
  const named = reduce(start, { type: "appoint", seat: "fazenda", appointee: minister });
  assert.deepEqual(named.cabinet?.["fazenda"], minister);
  assert.ok(Object.isFrozen(named.cabinet));
  const other = reduce(named, {
    type: "appoint",
    seat: "fazenda",
    appointee: { id: "person-2", name: "Rui Tavares", party: null },
  });
  assert.equal(other.cabinet?.["fazenda"]?.name, "Rui Tavares", "nomear por cima troca o ministro");
  const empty = reduce(other, { type: "dismiss", seat: "fazenda" });
  assert.equal(empty.cabinet?.["fazenda"], undefined);
});

test("cadeira que a lei não tem não recebe ninguém", () => {
  const start = createState();
  assert.equal(
    reduce(start, { type: "appoint", seat: "ministerio-inventado", appointee: minister }),
    start,
  );
  assert.equal(reduce(start, { type: "dismiss", seat: "ministerio-inventado" }), start);
});

test("o gabinete atravessa o save, e o save de antes dele abre sem ele", () => {
  const named = reduce(createState(), { type: "appoint", seat: "saude", appointee: minister });
  const back = deserialize(serialize(named));
  assert.ok(back.ok);
  assert.deepEqual(back.ok && back.state.cabinet, named.cabinet);
  const legacy = JSON.parse(serialize(createState()));
  delete legacy.cabinet;
  assert.ok(deserialize(JSON.stringify(legacy)).ok, "save sem gabinete foi recusado");
  const broken = JSON.parse(serialize(createState()));
  broken.cabinet = { saude: { id: "person-3", name: 7, party: null } };
  assert.equal(deserialize(JSON.stringify(broken)).ok, false);
  broken.cabinet = { saude: { name: "Sem Id", party: null } };
  assert.equal(deserialize(JSON.stringify(broken)).ok, false);
});

test("o gabinete atravessa a virada do mês", () => {
  const named = reduce(createState(), { type: "appoint", seat: "fazenda", appointee: minister });
  const { state } = playMonth(named);
  assert.deepEqual(state.cabinet, named.cabinet);
});
