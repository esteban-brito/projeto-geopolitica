import assert from "node:assert/strict";
import test from "node:test";
import { coalitionOf } from "../../src/application/cabinet.mjs";
import { playMonth } from "../../src/application/turn.mjs";
import { deserialize, serialize } from "../../src/state/save.mjs";
import { createState, reduce } from "../../src/state/state.mjs";

const nominee = { id: "posse-candidate", name: "Helena Prado", party: "pcn" };

test("mudar uma pessoa de pasta libera a anterior sem duplicar apoio ou confundir homônimos", () => {
  const start = reduce(createState(), { type: "appoint", seat: "saude", appointee: nominee });
  const homonym = { ...nominee, id: "another-candidate" };
  const before = reduce(start, { type: "appoint", seat: "fazenda", appointee: homonym });
  const saved = serialize(before);
  const moved = reduce(before, { type: "appoint", seat: "educacao", appointee: nominee });
  assert.equal(moved.cabinet?.["saude"], undefined);
  assert.deepEqual(moved.cabinet?.["educacao"], nominee);
  assert.deepEqual(moved.cabinet?.["fazenda"], homonym);
  assert.equal(
    Object.values(moved.cabinet ?? {}).filter(person => person.id === nominee.id).length,
    1,
  );
  assert.deepEqual(
    coalitionOf(moved.cabinet ?? {}),
    coalitionOf({ educacao: nominee, fazenda: homonym }),
  );
  assert.equal(serialize(before), saved);
  assert.deepEqual(moved.streams, before.streams);
  assert.ok(Object.isFrozen(moved.cabinet));
});

test("exonerar uma pasta já vaga não muda a sessão nem consome sorteio", () => {
  const start = createState();
  assert.equal(reduce(start, { type: "dismiss", seat: "saude" }), start);
  const named = reduce(start, { type: "appoint", seat: "fazenda", appointee: nominee });
  assert.equal(reduce(named, { type: "dismiss", seat: "saude" }), named);
});

test("Presidente e gabinete remanejado atravessam recarga e primeiro mês sem ressuscitar a pasta anterior", () => {
  const start = createState(
    20270101,
    undefined,
    { name: "Ana Prado", treatment: "senhora" },
    "pcn",
  );
  const named = reduce(start, { type: "appoint", seat: "saude", appointee: nominee });
  const moved = reduce(named, { type: "appoint", seat: "fazenda", appointee: nominee });
  const loaded = deserialize(serialize(moved));
  assert.ok(loaded.ok);
  const direct = playMonth(moved);
  const resumed = playMonth(loaded.state);
  assert.deepEqual(resumed, direct);
  assert.equal(resumed.state.month, 1);
  assert.deepEqual(resumed.state.president, start.president);
  assert.equal(resumed.state.party, "pcn");
  assert.equal(resumed.state.cabinet?.["saude"], undefined);
  assert.deepEqual(resumed.state.cabinet?.["fazenda"], nominee);
});
