import assert from "node:assert/strict";
import test from "node:test";
import { CATALOG, posseOf } from "../../src/public/index.mjs";
import { baseCount, chanceTargets, firmCount } from "../../src/domain/congress/index.mjs";
import { coalitionOf } from "../../src/application/cabinet.mjs";
import { deserialize, serialize } from "../../src/state/save.mjs";
import { playMonth } from "../../src/application/turn.mjs";
import { OFFICE_IDS, PARTY_IDS, readPosse, previewPosse } from "../../prototypes/posse/bridge.mjs";

const president = { name: "Ana Souza", fem: true, party: "mdn" };
const people = { candidate: { key: "candidate", name: "Helena Prado", party: "ftb" } };
const structure = { into: {}, gone: {}, created: [] };

test("porte cobre os 16 partidos e as 38 pastas por IDs explícitos e únicos", () => {
  assert.deepEqual(Object.values(PARTY_IDS).sort(), CATALOG.parties.map(item => item.id).sort());
  assert.deepEqual(Object.values(OFFICE_IDS).sort(), CATALOG.cabinet.map(item => item.id).sort());
});

test("nomeação da posse gera gabinete canônico que atravessa save e mês", () => {
  const result = readPosse(president, { saude: "candidate" }, people, structure);
  assert.equal(result.status, "estimated");
  assert.ok(result.status === "estimated");
  assert.equal(result.state.party, "mdn");
  assert.deepEqual(result.state.president, { name: "Ana Souza", treatment: "senhora" });
  assert.deepEqual(result.state.cabinet?.["saude"], {
    id: "candidate",
    name: "Helena Prado",
    party: "pcs",
  });
  const loaded = deserialize(serialize(result.state));
  assert.ok(loaded.ok);
  assert.deepEqual(playMonth(loaded.state), playMonth(result.state));
});

test("conta estrutural e deputados seguem o motor nos 16 partidos sem consumir sorteio", () => {
  for (const party of Object.keys(PARTY_IDS)) {
    const result = readPosse({ ...president, party }, { saude: "candidate" }, people, structure);
    assert.ok(result.status === "estimated");
    const saved = serialize(result.state);
    const loyalty = chanceTargets({
      parties: CATALOG.parties,
      ruling: result.state.party ?? null,
      served: coalitionOf(result.state.cabinet ?? {}),
    });
    assert.equal(
      result.support.firm,
      firmCount({ parties: CATALOG.parties, loyalty, seed: result.state.seed }),
    );
    assert.equal(result.support.probable, baseCount({ parties: CATALOG.parties, loyalty }));
    assert.equal(
      result.support.parties.reduce((sum, item) => sum + item.deputies.length, 0),
      513,
    );
    assert.deepEqual(posseOf(result.state), result.support);
    assert.equal(serialize(result.state), saved);
  }
});

test("pessoa sem partido não compra apoio e título não altera a conta", () => {
  const plain = readPosse(president, {}, people, structure);
  const technical = readPosse(
    president,
    { saude: "candidate" },
    { candidate: { ...people.candidate, party: null, name: "Presidente General Doutora" } },
    structure,
  );
  assert.ok(plain.status === "estimated" && technical.status === "estimated");
  assert.deepEqual(technical.support, plain.support);
});

test("reforma e identidade não mapeadas declaram incerteza; não fabricam cadeiras ou apoio", () => {
  for (const changed of [
    { ...structure, into: { saude: "educacao" } },
    { ...structure, gone: { saude: [] } },
    { ...structure, created: [{ id: "new-office" }] },
  ])
    assert.equal(readPosse(president, {}, people, changed).status, "unknown");
  assert.equal(readPosse(president, { saude: "missing" }, people, structure).status, "unknown");
  assert.equal(
    readPosse({ ...president, party: "missing" }, {}, people, structure).status,
    "unknown",
  );
  assert.equal(
    readPosse(president, { saude: "candidate", educacao: "candidate" }, people, structure).status,
    "unknown",
  );
});

test("nomes herdados do objeto não viram partidos, pastas ou pessoas", () => {
  assert.equal(
    readPosse({ ...president, party: "constructor" }, {}, people, structure).status,
    "unknown",
  );
  assert.equal(
    readPosse(president, { constructor: "candidate" }, people, structure).status,
    "unknown",
  );
  assert.equal(readPosse(president, { saude: "constructor" }, people, structure).status, "unknown");
});

test("voltar a 38 órgãos não autoriza estimar apoio se as atribuições continuam redistribuídas", () => {
  assert.equal(
    readPosse(president, {}, people, { ...structure, changedWork: true }).status,
    "unknown",
  );
  assert.equal(
    previewPosse(president, {}, people, { ...structure, changedWork: true }).status,
    "unknown",
  );
});
