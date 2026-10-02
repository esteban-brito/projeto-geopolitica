/* SUITE · O CATÁLOGO — o dado de verdade, conferido valor a valor. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import fc from "fast-check";
import { CATALOG, catalogViolations } from "../../src/data/catalog.mjs";
import { PARTIES, PARTY_SCHEMA } from "../../src/data/parties.mjs";
import { SEATS, SIMPLE_MAJORITY } from "../../src/data/regime.mjs";
import { collectionViolations, violations } from "../../src/data/schema.mjs";

test("o catálogo do projeto esta íntegro", () => {
  assert.deepEqual(catalogViolations(), []);
});

test("as cadeiras das bancadas somam a Camara inteira", () => {
  /* Soma que não fecha não é erro de digitação inofensivo: é uma votação cujo quórum nunca
     bate, e o defeito apareceria como "a lei nunca passa". */
  const total = PARTIES.reduce((sum, party) => sum + party.seats, 0);
  assert.equal(total, SEATS, `as bancadas somam ${total} e a Camara tem ${SEATS}`);
  assert.ok(SIMPLE_MAJORITY > SEATS / 2);
});

test("nenhuma bancada sozinha tem maioria simples", () => {
  /* Se uma tivesse, o resto do motor de votação seria decoração — bastaria comprar uma
     bancada e nenhuma barganha existiria. */
  for (const party of PARTIES) {
    assert.ok(
      party.seats < SIMPLE_MAJORITY,
      `${party.id} tem ${party.seats} cadeiras e a maioria e ${SIMPLE_MAJORITY}`,
    );
  }
});

test("A VENALIDADE POR EIXO FAZ ALGUMA COISA: ao menos um bloco e assimétrico", () => {
  /* Como a propriedade da armadilha em LASTRO, esta exige que algo POSSA acontecer. */
  const asymmetric = PARTIES.filter(
    party => Math.abs(party.venalityEconomic - party.venalityLiberty) >= 0.2,
  );
  assert.ok(
    asymmetric.length > 0,
    "nenhum bloco cobra preco diferente por assunto — a divisao por eixo virou enfeite",
  );
});

test("o preço depende do assunto, e em sentidos opostos", () => {
  /* O caso que motivou a mudança: a bancada liberal não entrega a pauta econômica e negocia
     costumes; o centrão faz o contrário. */
  const liberal = PARTIES.find(party => party.id === "vanguarda");
  const centrao = PARTIES.find(party => party.id === "fbr");
  assert.ok(liberal && centrao);
  assert.ok(
    liberal.venalityLiberty > liberal.venalityEconomic,
    "a direita liberal devia negociar costumes e nao economia",
  );
  assert.ok(
    centrao.venalityEconomic > centrao.venalityLiberty,
    "o centrao devia ceder mais em economia que em costumes",
  );
});

test("nenhum bloco esta inteiramente a venda", () => {
  /* Venalidade 1 significa que dinheiro anula a ideologia por completo, e aí a bancada deixa
     de ter posição — vira uma função do orçamento. */
  for (const party of PARTIES) {
    assert.ok(party.venalityEconomic < 1, `${party.id} se vende por inteiro em economia`);
    assert.ok(party.venalityLiberty < 1, `${party.id} se vende por inteiro em costumes`);
  }
});

test("o catálogo expõe as bancadas e os parâmetros fiscais", () => {
  assert.equal(CATALOG.parties, PARTIES);
  assert.ok(CATALOG.fiscal.taxLoad > 0);
});

/* Cada prova abaixo reintroduz um defeito e exige acusação, que e a mesma exigência das
   guardas. */

test("PROVA SINTÉTICA: campo faltando e acusado", () => {
  /* Um registro real MENOS um campo: assim a prova mede a falta e nada mais. */
  const complete = PARTIES[0];
  assert.ok(complete);
  const broken = Object.fromEntries(
    Object.entries(complete).filter(([field]) => field !== "seats"),
  );
  const found = violations(PARTY_SCHEMA, broken, "teste");
  assert.equal(found.length, 1);
  assert.match(found[0] ?? "", /seats/);
});

test("PROVA SINTÉTICA: campo a mais e acusado", () => {
  const broken = { ...(PARTIES[0] ?? {}), sobrando: 1 };
  const found = violations(PARTY_SCHEMA, broken, "teste");
  assert.match(found.join(" "), /sobrando/);
});

test("PROVA SINTÉTICA: id fora do kebab-case e acusado", () => {
  const broken = { ...(PARTIES[0] ?? {}), id: "Centrão Puro" };
  assert.match(violations(PARTY_SCHEMA, broken, "teste").join(" "), /kebab-case/);
});

test("PROVA SINTÉTICA: id repetido e acusado", () => {
  const first = PARTIES[0];
  assert.ok(first);
  const found = collectionViolations(PARTY_SCHEMA, [first, first], "teste");
  assert.match(found.join(" "), /mais de uma vez/);
});

test("todo número fora da faixa declarada e acusado", () => {
  /* Propriedade e não exemplo: o que precisa ser provado não é que 1.5 de venalidade é
     recusado, é que NENHUM valor fora da faixa passa. */
  fc.assert(
    fc.property(
      fc.double({ min: 1.0001, max: 1000, noNaN: true }),
      fc.constantFrom("venalityEconomic", "venalityLiberty", "economic", "liberty"),
      (excess, field) => {
        const rule = PARTY_SCHEMA[field];
        assert.ok(rule);
        const max = rule.max ?? 0;
        const broken = { ...(PARTIES[0] ?? {}), [field]: max + excess };
        assert.match(violations(PARTY_SCHEMA, broken, "teste").join(" "), /acima do maximo/);
      },
    ),
  );
});

test("o validador não conserta nem preenche, só relata", () => {
  /* Validador que conserta esconde o erro em vez de mostrar. */
  const record = { ...(PARTIES[0] ?? {}), venalityEconomic: 9 };
  const before = JSON.stringify(record);
  violations(PARTY_SCHEMA, record, "teste");
  assert.equal(JSON.stringify(record), before);
});

/* ── O HANDOFF CONTA O CATÁLOGO QUE EXISTE ─────────────────────────────────── ⚠ ELA NASCE DE
   UM DEFEITO MEDIDO, e ele e a família que `standards.md` §7 declara SEM GUARDA: prosa que
   continua gramatical e para de ser verdade. O handoff afirmou por sessões um Congresso de
   "onze bancadas" e um elenco de "sete pessoas" enquanto o catálogo tinha nove blocos e oito
   arquétipos — e nada podia acusar, porque toda guarda deste projeto lê TEXTO e nenhuma sabe
   contar o catálogo.

   ⚠ E O ALCANCE E DECLARADO: ela cobre só o `handoff.md`, que promete no próprio cabeçalho
   que ali "só entra o que e verificável hoje". `journal.md` e `cycles/` são histórico datado
   e ficam de fora de propósito — corrigir um número la seria reescrever o que foi medido. */
const CONTAGENS = new Map([
  ["blocos partidários", () => CATALOG.parties.length],
  ["cadeiras", () => SEATS],
  ["áreas", () => CATALOG.areas.length],
  ["programas", () => CATALOG.programs.length],
  ["regras", () => CATALOG.rules.length],
  ["grupos de pressão", () => CATALOG.lobbies.length],
  ["faixas de renda", () => CATALOG.segments.length],
  ["arquétipos", () => CATALOG.archetypes.length],
]);

test("O HANDOFF CONTA O CATÁLOGO QUE EXISTE, e não o de uma sessão passada", () => {
  const handoff = readFileSync(join(import.meta.dirname, "..", "..", "docs", "handoff.md"), "utf8");

  /* TODA LINHA DE DUAS COLUNAS, e não uma tabela ancorada por título: o rótulo é a chave, e
     assim a contagem pode morar em qualquer seção do arquivo sem a prova ter de saber onde. */
  const rows = [...handoff.matchAll(/^\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|\s*$/gm)];

  /** @type {string[]} */
  const checked = [];
  for (const row of rows) {
    const label = (row[1] ?? "").trim();
    const count = CONTAGENS.get(label);
    if (!count) continue;
    checked.push(label);
    assert.equal(
      Number(row[2]),
      count(),
      `o handoff diz ${row[2]} ${label} e o catalogo tem ${count()}`,
    );
  }

  /* ⚠ A PROVA TEM DE FALHAR QUANDO A TABELA SUMIR, senão apagar as linhas a deixa verde para
     sempre — que é a forma mais silenciosa de uma prova morrer. */
  assert.deepEqual(
    [...CONTAGENS.keys()].filter(label => !checked.includes(label)),
    [],
    "o handoff deixou de declarar uma das contagens que esta prova cobra",
  );
});
