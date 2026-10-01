import assert from "node:assert/strict";
import test from "node:test";
import { OFFICE_IDS } from "../../prototypes/posse/bridge.mjs";
import { COMPETENCIES } from "../../prototypes/government/competencies.mjs";
import {
  activeOffices,
  governmentViolations,
  reformGovernment,
} from "../../prototypes/government/index.mjs";
import {
  structureOf,
  mergeStructure,
  splitStructure,
  structureParts,
  abolishStructure,
  restoreStructure,
  openingStructure,
} from "../../prototypes/posse/structure.mjs";

const labels = Object.fromEntries(Object.keys(OFFICE_IDS).map(id => [id, id]));
const fresh = () => ({ into: {}, names: {}, gone: {}, created: [] });

test("a estrutura da posse conserva as atribuições e os tipos dos órgãos da abertura", () => {
  const state = fresh();
  const government = structureOf(state, labels);
  assert.ok(government);
  assert.equal(activeOffices(government).length, 38);
  assert.equal(government.inventory.length, COMPETENCIES.length);
  assert.equal(government.offices["advocacia-geral-da-uniao"]?.kind, "agu");
  assert.equal(government.offices["casa-civil"]?.kind, "presidency");
  assert.deepEqual(governmentViolations(government), []);
  assert.deepEqual(state, fresh());
});

test("juntar e desfazer conservam IDs e movem apenas as atribuições da pasta absorvida", () => {
  const original = fresh();
  const opening = structureOf(original, labels);
  assert.ok(opening);
  const change = mergeStructure(original, labels, "saude", "direitos", "Saúde e Direitos Humanos");
  assert.ok(change);
  const joined = { ...original, ...change };
  assert.equal(activeOffices(change.government).length, 37);
  assert.equal(change.into.direitos, "saude");
  assert.deepEqual(change.government.inventory, opening.inventory);
  for (const work of COMPETENCIES)
    assert.equal(
      change.government.owner[work.id],
      work.office === "direitos-humanos" ? "saude" : work.office,
    );
  assert.ok(structureParts(change.government, "saude").some(work => work.from === "direitos"));
  assert.deepEqual(structureParts(change.government, "direitos"), []);
  const divided = splitStructure(joined, labels, "saude");
  assert.ok(divided);
  assert.equal(activeOffices(divided.government).length, 38);
  assert.deepEqual(divided.government.owner, opening.owner);
  assert.deepEqual(divided.into, {});
  assert.deepEqual(governmentViolations(divided.government), []);
  assert.deepEqual(original, fresh());
});

test("desfazer pela posse usa a ordem do histórico e preserva junção aninhada", () => {
  let state = fresh();
  state = { ...state, ...mergeStructure(state, labels, "saude", "direitos", "Primeira junção") };
  state = { ...state, ...mergeStructure(state, labels, "educacao", "saude", "Segunda junção") };
  const divided = splitStructure(state, labels, "educacao");
  assert.ok(divided);
  assert.equal(activeOffices(divided.government).length, 37);
  assert.equal(divided.into.direitos, "saude");
  assert.equal(divided.into.saude, undefined);
  assert.ok(structureParts(divided.government, "saude").some(work => work.from === "direitos"));
});

test("desfazer não apaga renomeação posterior nem restaura trabalho transferido depois da junção", () => {
  let state = { ...fresh(), ...mergeStructure(fresh(), labels, "saude", "direitos", "Junção") };
  assert.ok(state.government);
  const work = COMPETENCIES.find(item => item.office === "direitos-humanos");
  assert.ok(work);
  const transferred = reformGovernment(state.government, {
    type: "transfer",
    competency: work.id,
    to: "educacao",
  });
  assert.ok(transferred.ok);
  const renamed = reformGovernment(transferred.state, {
    type: "rename",
    office: "saude",
    label: "Nome posterior",
  });
  assert.ok(renamed.ok);
  state = { ...state, government: renamed.state, names: { saude: "Nome posterior" } };
  const divided = splitStructure(state, labels, "saude");
  assert.ok(divided);
  assert.equal(divided.names.saude, "Nome posterior");
  assert.equal(divided.government.owner[work.id], "educacao");
});

test("a ligação parcial devolve fluxos não convertidos à lógica original sem inventar histórico", () => {
  assert.equal(mergeStructure(fresh(), labels, "saude", "agu", "Nome"), null);
  assert.equal(
    mergeStructure(
      { ...fresh(), created: [{ id: "digital" }] },
      labels,
      "saude",
      "direitos",
      "Nome",
    ),
    null,
  );
  assert.equal(structureOf({ ...fresh(), into: { direitos: "saude" } }, labels), null);
  assert.equal(splitStructure(fresh(), labels, "saude"), null);
});

test("extinção aplica destinos por ID e recriação recupera a mesma estrutura", () => {
  const original = fresh();
  const opening = structureOf(original, labels);
  assert.ok(opening);
  const works = structureParts(opening, "turismo");
  const change = abolishStructure(
    original,
    labels,
    "turismo",
    Object.fromEntries(works.map(work => [work.id, "cultura"])),
  );
  assert.ok(change);
  assert.equal(activeOffices(change.government).length, 37);
  assert.ok(change.gone.turismo);
  for (const work of works) assert.equal(change.government.owner[work.id], "cultura");
  const restored = restoreStructure({ ...original, ...change }, labels, "turismo");
  assert.ok(restored);
  assert.deepEqual(restored.government.owner, opening.owner);
  assert.deepEqual(restored.gone, {});
  assert.equal(openingStructure(restored.government), true);
  assert.deepEqual(original, fresh());
});

test("reformas encadeadas conservam todo o trabalho e inversas respeitam transferências posteriores", () => {
  let state = { ...fresh(), government: structureOf(fresh(), labels) };
  assert.ok(state.government);
  const opening = state.government;
  for (const [source, target] of [
    ["turismo", "cultura"],
    ["cultura", "educacao"],
  ]) {
    assert.ok(source && target && state.government);
    const destinations = Object.fromEntries(
      structureParts(state.government, source).map(work => [work.id, target]),
    );
    const change = abolishStructure(state, labels, source, destinations);
    assert.ok(change);
    state = { ...state, ...change };
    const government = change.government;
    const ids = activeOffices(government).flatMap(office =>
      structureParts(
        government,
        Object.keys(OFFICE_IDS).find(id => OFFICE_IDS[id] === office.id) ?? "",
      ).map(work => work.id),
    );
    assert.equal(ids.length, 152);
    assert.equal(new Set(ids).size, 152);
    assert.deepEqual(governmentViolations(government), []);
  }
  const restoredTourism = restoreStructure(state, labels, "turismo");
  assert.ok(restoredTourism);
  assert.deepEqual(structureParts(restoredTourism.government, "turismo"), []);
  const restoredCulture = restoreStructure({ ...state, ...restoredTourism }, labels, "cultura");
  assert.ok(restoredCulture);
  assert.equal(activeOffices(restoredCulture.government).length, 38);
  assert.deepEqual(restoredCulture.gone, {});
  for (const work of structureParts(opening, "turismo"))
    assert.equal(restoredCulture.government.owner[work.id], "cultura");
  assert.equal(openingStructure(restoredCulture.government), false);
});

test("distribuição incompleta não altera a estrutura", () => {
  const original = fresh();
  assert.equal(abolishStructure(original, labels, "turismo", {}), null);
  assert.equal(restoreStructure(original, labels, "turismo"), null);
  assert.deepEqual(original, fresh());
});
