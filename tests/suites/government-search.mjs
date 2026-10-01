import assert from "node:assert/strict";
import test from "node:test";
import { COMPETENCIES } from "../../prototypes/government/competencies.mjs";
import { searchWork, searchDestinations } from "../../prototypes/government/work-search.mjs";

const offices = [
  { id: "public", parts: [{ text: "Polícia Federal e segurança pública" }] },
  { id: "food", parts: [{ text: "segurança alimentar e combate à fome" }] },
  { id: "information", parts: [{ text: "segurança da informação" }] },
  { id: "lab", parts: [{ text: "pesquisa em saúde" }] },
];

test("busca cobre o inventário sem fabricar ou transferir atribuições", () => {
  const before = globalThis.structuredClone(COMPETENCIES);
  const result = searchWork(COMPETENCIES, "");
  assert.equal(result.ids.length, 152);
  assert.equal(new Set(result.ids).size, 152);
  assert.deepEqual(COMPETENCIES, before);
});

test("normaliza acentos e caixa, respeitando expressões e fronteiras", () => {
  const result = searchDestinations(offices, "SEGURANÇA PÚBLICA");
  assert.deepEqual(
    result.matches.map(item => item.id),
    ["public"],
  );
  assert.deepEqual(searchDestinations(offices, "seguro").matches, []);
  assert.deepEqual(
    searchDestinations(offices, '"segurança alimentar"').matches.map(item => item.id),
    ["food"],
  );
});

test("termo amplo conserva os escopos concorrentes, sem escolher destino", () => {
  const result = searchDestinations(offices, "segurança");
  assert.deepEqual(
    result.matches.map(item => item.id),
    ["food", "information", "public"],
  );
  for (const match of result.matches) assert.equal(match.parts.length, 1);
  assert.equal(Object.hasOwn(result, "recommended"), false);
});

test("negação e parênteses compõem a seleção sobre o mesmo trabalho", () => {
  assert.deepEqual(
    searchDestinations(offices, "segurança e não alimentar").matches.map(item => item.id),
    ["information", "public"],
  );
  assert.deepEqual(
    searchDestinations(offices, "(segurança ou pesquisa) e não informação").matches.map(
      item => item.id,
    ),
    ["food", "lab", "public"],
  );
  assert.deepEqual(searchDestinations(offices, "segurança e pesquisa").matches, []);
});

test("termo desconhecido não desaparece, inclusive sob negação ou alternativa", () => {
  for (const query of ["segurança ou abracadabra", "não abracadabra", "pesquisa e hospital"]) {
    const result = searchDestinations(offices, query);
    assert.equal(result.status, "unknown");
    assert.deepEqual(result.matches, []);
    assert.ok(result.unknown.length);
  }
});

test("consulta incompleta é recusada sem efeito lateral", () => {
  for (const query of [
    "segurança e",
    "(pesquisa",
    '"pesquisa',
    "()",
    "segurança )",
    "ou pesquisa",
  ]) {
    const result = searchDestinations(offices, query);
    assert.equal(result.status, "invalid", query);
    assert.deepEqual(result.matches, []);
  }
});

test("sinônimos são vocabulário extensível, sem equivalência de poderes", () => {
  const result = searchDestinations(offices, "PF");
  assert.deepEqual(
    result.matches.map(item => item.id),
    ["public"],
  );
  const custom = searchWork(COMPETENCIES, "receita", { receita: ["impostos", "arrecadação"] });
  assert.equal(custom.ids.length, 1);
  assert.equal(searchWork(COMPETENCIES, "receita").status, "unknown");
});

test("ordem de entrada, nome de órgão e consultas anteriores não mudam o resultado", () => {
  const before = globalThis.structuredClone(offices);
  const first = searchDestinations(offices, "segurança");
  searchDestinations(offices, "pesquisa");
  const reversed = searchDestinations(
    [...offices].reverse().map(item => ({ ...item, label: "Saúde e Segurança Absoluta" })),
    "segurança",
  );
  assert.deepEqual(first, reversed);
  assert.deepEqual(offices, before);
});

test("transferência muda o órgão encontrado, sem alterar identidade do trabalho", () => {
  const work = { id: "health-research", text: "pesquisa em saúde" };
  const first = searchDestinations(
    [
      { id: "a", parts: [work] },
      { id: "b", parts: [] },
    ],
    "pesquisa",
  );
  const second = searchDestinations(
    [
      { id: "a", parts: [] },
      { id: "b", parts: [work] },
    ],
    "pesquisa",
  );
  assert.equal(first.matches[0]?.parts[0]?.id, "health-research");
  assert.equal(second.matches[0]?.parts[0]?.id, "health-research");
  assert.equal(second.matches[0]?.id, "b");
});

test("órgão vazio pode ser escolhido manualmente, sem ganhar atribuições pelo nome", () => {
  const empty = [{ id: "empty", parts: [] }];
  assert.equal(searchDestinations(empty, "").matches[0]?.id, "empty");
  assert.deepEqual(searchDestinations(empty, "saúde").matches, []);
});
