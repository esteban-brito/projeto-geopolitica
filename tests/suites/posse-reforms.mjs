import assert from "node:assert/strict";
import test from "node:test";
import { OFFICE_IDS } from "../../prototypes/posse/bridge.mjs";
import { COMPETENCIES } from "../../prototypes/government/competencies.mjs";
import { activeOffices, governmentViolations } from "../../prototypes/government/index.mjs";
import {
  structureOf,
  structureParts,
  createStructure,
  transferStructure,
  renameStructure,
  cancelCreation,
  mergeStructure,
  splitStructure,
  openingStructure,
} from "../../prototypes/posse/structure.mjs";

const labels = Object.fromEntries(Object.keys(OFFICE_IDS).map(id => [id, id]));
const fresh = () => ({ into: {}, names: {}, gone: {}, created: [] });

test("criação livre transfere os IDs escolhidos sem inventar trabalho ou duplicar órgão", () => {
  const state = fresh();
  const government = structureOf(state, labels);
  assert.ok(government);
  const selected = structureParts(government, "saude")
    .slice(0, 2)
    .map(work => work.id);
  const change = createStructure(state, labels, "Saúde Digital", selected, "saude");
  assert.ok(change);
  const created = change.created[0];
  assert.ok(created);
  assert.equal(activeOffices(change.government).length, 39);
  assert.equal(change.names[created.id], "Saúde Digital");
  assert.deepEqual(
    structureParts(change.government, created.id).map(work => work.id),
    selected,
  );
  assert.ok(
    selected.every(id => !structureParts(change.government, "saude").some(work => work.id === id)),
  );
  assert.deepEqual(change.government.inventory, government.inventory);
  assert.deepEqual(governmentViolations(change.government), []);
  assert.equal(structureOf({ ...state, ...change }, labels), change.government);
  assert.deepEqual(state, fresh());
});

test("renomear uma pasta criada preserva atribuições, identidade e memória", () => {
  const original = fresh();
  const government = structureOf(original, labels);
  assert.ok(government);
  const works = structureParts(government, "saude").map(work => work.id);
  const created = createStructure(original, labels, "Nova Saúde", works, "saude");
  assert.ok(created);
  const office = created.created[0];
  assert.ok(office);
  const renamed = renameStructure(
    { ...original, ...created },
    labels,
    office.id,
    "Nome inteiramente diferente",
  );
  assert.ok(renamed);
  assert.equal(renamed.names[office.id], "Nome inteiramente diferente");
  assert.deepEqual(renamed.government.owner, created.government.owner);
  assert.deepEqual(renamed.government.ownerRevision, created.government.ownerRevision);
  assert.deepEqual(renamed.government.events, created.government.events);
  assert.deepEqual({ ...original, ...created, ...renamed }.created, created.created);
});

test("transferência é atômica e exige IDs pertencentes ao órgão selecionado", () => {
  const state = fresh();
  const government = structureOf(state, labels);
  assert.ok(government);
  const selected = structureParts(government, "turismo").map(work => work.id);
  const change = transferStructure(state, labels, "turismo", selected, "cultura");
  assert.ok(change);
  assert.ok(selected.every(id => change.government.owner[id] === "cultura"));
  assert.equal(activeOffices(change.government).length, 38);
  assert.equal(structureParts(change.government, "turismo").length, 0);
  assert.equal(openingStructure(change.government), false);
  assert.equal(transferStructure(state, labels, "saude", selected, "cultura"), null);
  assert.equal(
    transferStructure(state, labels, "turismo", selected.concat("missing"), "cultura"),
    null,
  );
  assert.equal(
    transferStructure(state, labels, "turismo", selected.concat(selected), "cultura"),
    null,
  );
  assert.deepEqual(state, fresh());
});

test("cancelar criação preserva transferências posteriores e recupera a distribuição anterior", () => {
  const original = fresh();
  const government = structureOf(original, labels);
  assert.ok(government);
  const selected = structureParts(government, "saude")
    .slice(0, 2)
    .map(work => work.id);
  const created = createStructure(original, labels, "Serviços Digitais", selected, "saude");
  assert.ok(created);
  const office = created.created[0];
  assert.ok(office);
  const first = selected[0],
    second = selected[1];
  assert.ok(first && second);
  const moved = transferStructure(
    { ...original, ...created },
    labels,
    office.id,
    [first],
    "educacao",
  );
  assert.ok(moved);
  const canceled = cancelCreation({ ...original, ...created, ...moved }, labels, office.id);
  assert.ok(canceled);
  assert.equal(canceled.government.owner[first], "educacao");
  assert.equal(canceled.government.owner[second], "saude");
  assert.equal(activeOffices(canceled.government).length, 38);
  assert.deepEqual(governmentViolations(canceled.government), []);
  assert.equal(openingStructure(canceled.government), false);
  assert.deepEqual(
    canceled.government.inventory,
    COMPETENCIES.map(work => work.id),
  );
});

test("junção e inversa aceitam pasta criada e conservam o nome posterior", () => {
  const original = fresh();
  const government = structureOf(original, labels);
  assert.ok(government);
  const selected = structureParts(government, "saude").map(work => work.id);
  const created = createStructure(original, labels, "Nova Pasta", selected, "saude");
  assert.ok(created);
  const office = created.created[0];
  assert.ok(office);
  const joined = mergeStructure(
    { ...original, ...created },
    labels,
    "educacao",
    office.id,
    "Educação e Saúde",
  );
  assert.ok(joined);
  const renamed = renameStructure(
    { ...original, ...created, ...joined },
    labels,
    "educacao",
    "Nome posterior",
  );
  assert.ok(renamed);
  const divided = splitStructure({ ...original, ...created, ...renamed }, labels, "educacao");
  assert.ok(divided);
  assert.equal(divided.names.educacao, "Nome posterior");
  assert.deepEqual(divided.government.owner, created.government.owner);
  assert.deepEqual(governmentViolations(divided.government), []);
});

test("pasta vazia é possível e cancelar sua criação não fabrica capacidade ou apoio", () => {
  const original = fresh();
  const government = structureOf(original, labels);
  assert.ok(government);
  const created = createStructure(original, labels, "Pasta Vazia", [], "saude");
  assert.ok(created);
  const office = created.created[0];
  assert.ok(office);
  assert.equal(activeOffices(created.government).length, 39);
  assert.deepEqual(structureParts(created.government, office.id), []);
  assert.deepEqual(created.government.owner, government.owner);
  const canceled = cancelCreation({ ...original, ...created }, labels, office.id);
  assert.ok(canceled);
  assert.equal(openingStructure(canceled.government), true);
});
