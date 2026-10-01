import test from "node:test";
import assert from "node:assert/strict";
import {
  openingGovernment,
  reformGovernment,
  governmentViolations,
  activeOffices,
} from "../../prototypes/government/index.mjs";

const opening = () =>
  openingGovernment(
    [
      { id: "health", label: "Saúde", kind: "ministry" },
      { id: "justice", label: "Justiça", kind: "ministry" },
      { id: "civil", label: "Casa Civil", kind: "presidency" },
    ],
    [
      { id: "care", office: "health" },
      { id: "vigilance", office: "health" },
      { id: "law", office: "justice" },
    ],
  );

/** @param {Parameters<typeof reformGovernment>[0]} state @param {Parameters<typeof reformGovernment>[1]} command */
const done = (state, command) => {
  const result = reformGovernment(state, command);
  assert.equal(result.ok, true, result.ok ? "" : result.reason);
  return result.state;
};

test("dividir preserva uma transferência que saiu e voltou ao destino da junção", () => {
  let state = done(opening(), { type: "merge", into: "health", from: "justice" });
  state = done(state, { type: "transfer", competency: "law", to: "civil" });
  state = done(state, { type: "transfer", competency: "law", to: "health" });
  state = done(JSON.parse(JSON.stringify(state)), {
    type: "splitMerge",
    into: "health",
    from: "justice",
  });
  assert.equal(state.owner.law, "health");
  assert.deepEqual(governmentViolations(state), []);
});

test("dividir preserva uma renomeação posterior que saiu e voltou ao nome da junção", () => {
  let state = done(opening(), {
    type: "merge",
    into: "health",
    from: "justice",
    label: "Saúde e Justiça",
  });
  state = done(state, { type: "rename", office: "health", label: "Serviços" });
  state = done(state, { type: "rename", office: "health", label: "Saúde e Justiça" });
  state = done(JSON.parse(JSON.stringify(state)), {
    type: "splitMerge",
    into: "health",
    from: "justice",
  });
  assert.equal(state.offices.health?.label, "Saúde e Justiça");
  assert.deepEqual(governmentViolations(state), []);
});

test("divisões aninhadas recuperam a identidade anterior do nome", () => {
  let state = openingGovernment(
    [
      { id: "health", label: "Saúde", kind: "ministry" },
      { id: "justice", label: "Justiça", kind: "ministry" },
      { id: "economy", label: "Economia", kind: "ministry" },
    ],
    [{ id: "care", office: "health" }],
  );
  state = done(state, { type: "merge", into: "health", from: "justice", label: "Duas" });
  state = done(state, { type: "merge", into: "health", from: "economy", label: "Três" });
  state = done(state, { type: "splitMerge", into: "health", from: "economy" });
  assert.equal(state.offices.health?.label, "Duas");
  state = done(state, { type: "splitMerge", into: "health", from: "justice" });
  assert.equal(state.offices.health?.label, "Saúde");
  assert.deepEqual(governmentViolations(state), []);
});

test("recriar preserva a transferência posterior mesmo quando o destino se repete", () => {
  let state = done(opening(), {
    type: "abolish",
    office: "justice",
    destinations: { law: "health" },
  });
  state = done(state, { type: "transfer", competency: "law", to: "civil" });
  state = done(state, { type: "transfer", competency: "law", to: "health" });
  state = done(state, { type: "restore", office: "justice" });
  assert.equal(state.owner.law, "health");
});

test("a criação de outra pasta também impede que uma inversa desfaça sua transferência", () => {
  let state = done(opening(), { type: "merge", into: "health", from: "justice" });
  state = done(state, { type: "create", label: "Nova", competencies: ["law"] });
  state = done(state, { type: "transfer", competency: "law", to: "health" });
  state = done(state, { type: "splitMerge", into: "health", from: "justice" });
  assert.equal(state.owner.law, "health");
});

test("desfazer operações aninhadas preserva a possibilidade de desfazer a primeira", () => {
  let state = done(opening(), { type: "merge", into: "health", from: "justice" });
  state = done(state, {
    type: "abolish",
    office: "health",
    destinations: { care: "civil", vigilance: "civil", law: "civil" },
  });
  state = done(state, { type: "restore", office: "health" });
  state = done(state, { type: "splitMerge", into: "health", from: "justice" });
  assert.deepEqual(state.owner, opening().owner);
});

test("o inventário detecta trabalho apagado e trabalho inventado", () => {
  const missing = opening();
  delete missing.owner.law;
  assert.ok(governmentViolations(missing).some(error => error.includes("law")));
  const extra = opening();
  extra.owner.unknown = "health";
  assert.ok(governmentViolations(extra).some(error => error.includes("unknown")));
});

test("o inventário duplicado invalida o estado recarregado", () => {
  const state = opening();
  state.inventory = [...state.inventory, "care"];
  assert.ok(governmentViolations(state).some(error => error.includes("care")));
});

test("criar pula IDs existentes inclusive os de pastas extintas", () => {
  let state = openingGovernment(
    [
      { id: "ministry-1", label: "Primeira", kind: "ministry" },
      { id: "ministry-2", label: "Segunda", kind: "ministry" },
    ],
    [],
  );
  state = done(state, { type: "abolish", office: "ministry-2", destinations: {} });
  state = done(state, { type: "create", label: "Terceira", competencies: [] });
  assert.equal(state.offices["ministry-3"]?.label, "Terceira");
  assert.equal(state.offices["ministry-2"]?.active, false);
  state = done(state, { type: "create", label: "Quarta", competencies: [] });
  assert.equal(state.offices["ministry-4"]?.label, "Quarta");
});

test("a abertura preserva o dono de cada trabalho e separa cargos especiais", () => {
  const state = opening();
  assert.equal(state.owner.care, "health");
  assert.equal(state.owner.law, "justice");
  assert.equal(activeOffices(state, "ministry").length, 2);
  assert.deepEqual(governmentViolations(state), []);
  assert.equal(
    reformGovernment(state, { type: "abolish", office: "civil", destinations: {} }).ok,
    false,
  );
});

test("juntar e dividir usam a trilha; transferências posteriores permanecem", () => {
  const start = opening();
  const joined = done(start, {
    type: "merge",
    into: "health",
    from: "justice",
    label: "Saúde e Justiça",
  });
  assert.equal(joined.owner.law, "health");
  assert.equal(joined.offices.justice?.active, false);
  const moved = done(joined, { type: "transfer", competency: "law", to: "civil" });
  const restored = done(moved, { type: "splitMerge", into: "health", from: "justice" });
  assert.equal(restored.owner.law, "civil", "uma transferência posterior não é desfeita");
  assert.equal(restored.offices.justice?.active, true);
  assert.equal(restored.offices.health?.label, "Saúde");
  assert.deepEqual(governmentViolations(restored), []);
  assert.deepEqual(start, opening(), "o estado anterior é imutável");
});

test("extinguir exige destino individual; recriar respeita mudanças posteriores", () => {
  const start = opening();
  assert.equal(
    reformGovernment(start, {
      type: "abolish",
      office: "health",
      destinations: { care: "justice" },
    }).ok,
    false,
  );
  const abolished = done(start, {
    type: "abolish",
    office: "health",
    destinations: { care: "justice", vigilance: "civil" },
  });
  assert.equal(abolished.owner.care, "justice");
  assert.equal(abolished.owner.vigilance, "civil");
  const changed = done(abolished, { type: "transfer", competency: "care", to: "civil" });
  const restored = done(changed, { type: "restore", office: "health" });
  assert.equal(restored.owner.care, "civil");
  assert.equal(restored.owner.vigilance, "health");
  assert.deepEqual(governmentViolations(restored), []);
});

test("abrir 80 ministérios e juntar até cinco conserva exatamente o mesmo trabalho", () => {
  /** @type {Parameters<typeof openingGovernment>[0]} */
  const seats = [{ id: "base", label: "Base", kind: "ministry" }];
  const work = Array.from({ length: 100 }, (_, i) => ({ id: `work-${i}`, office: "base" }));
  let state = openingGovernment(seats, work);
  for (let i = 1; i < 80; i++) {
    state = done(state, { type: "create", label: `Pasta ${i}`, competencies: [`work-${i}`] });
  }
  assert.equal(activeOffices(state, "ministry").length, 80);
  for (let i = 79; i >= 5; i--) {
    state = done(state, { type: "merge", into: "base", from: `ministry-${i}` });
  }
  assert.equal(activeOffices(state, "ministry").length, 5);
  assert.equal(Object.keys(state.owner).length, 100);
  assert.deepEqual(governmentViolations(state), []);
});
