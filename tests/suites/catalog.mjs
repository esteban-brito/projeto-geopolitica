/* SUITE · O CATALOGO — o dado de verdade, conferido valor a valor.
   ══════════════════════════════════════════════════════════════════════════════

   A guarda `schema` prova que todo esquema existe e e citado pelo indice; ela lê
   TEXTO e nao executa nada. Quem confere se os registros obedecem ao esquema e
   esta suite, que importa o catalogo de verdade.

   A divisao nao e burocracia: guarda que tentasse ler valor precisaria
   interpretar JavaScript por regex, e regex sobre codigo e frageis demais para
   virar prova. Cada instrumento cobre o que ele consegue provar. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { CATALOG, catalogViolations } from "../../src/data/catalog.mjs";
import { PARTIES, PARTY_SCHEMA, SEATS, SIMPLE_MAJORITY } from "../../src/data/parties.mjs";
import { collectionViolations, violations } from "../../src/data/schema.mjs";

test("o catalogo do projeto esta integro", () => {
  assert.deepEqual(catalogViolations(), []);
});

test("as cadeiras das bancadas somam a Camara inteira", () => {
  /* Soma que nao fecha nao e erro de digitacao inofensivo: e uma votacao cujo
     quorum nunca bate, e o defeito apareceria como "a lei nunca passa". */
  const total = PARTIES.reduce((sum, party) => sum + party.seats, 0);
  assert.equal(total, SEATS, `as bancadas somam ${total} e a Camara tem ${SEATS}`);
  assert.ok(SIMPLE_MAJORITY > SEATS / 2);
});

test("nenhuma bancada sozinha tem maioria simples", () => {
  /* Se uma tivesse, o resto do motor de votacao seria decoracao — bastaria
     comprar uma bancada e nenhuma barganha existiria. */
  for (const party of PARTIES) {
    assert.ok(
      party.seats < SIMPLE_MAJORITY,
      `${party.id} tem ${party.seats} cadeiras e a maioria e ${SIMPLE_MAJORITY}`,
    );
  }
});

test("A VENALIDADE POR EIXO FAZ ALGUMA COISA: ao menos um bloco e assimetrico", () => {
  /* Como a propriedade da armadilha em LASTRO, esta exige que algo POSSA
     acontecer. Dois numeros iguais em toda a tabela devolveriam o escalar
     antigo por outro nome, e a distincao morreria sem nenhuma prova ficar
     vermelha — que e a pior forma de perder uma decisao de modelagem. */
  const asymmetric = PARTIES.filter(
    party => Math.abs(party.venalityEconomic - party.venalityLiberty) >= 0.2,
  );
  assert.ok(
    asymmetric.length > 0,
    "nenhum bloco cobra preco diferente por assunto — a divisao por eixo virou enfeite",
  );
});

test("o preco depende do assunto, e em sentidos opostos", () => {
  /* O caso que motivou a mudanca: a bancada liberal nao entrega a pauta
     economica e negocia costumes; o centrao faz o contrario. Se os dois
     andassem para o mesmo lado, um eixo so bastaria. */
  const liberal = PARTIES.find(party => party.id === "direita-liberal");
  const centrao = PARTIES.find(party => party.id === "centrao");
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
  /* Venalidade 1 significa que dinheiro anula a ideologia por completo, e ai a
     bancada deixa de ter posicao — vira uma funcao do orcamento. */
  for (const party of PARTIES) {
    assert.ok(party.venalityEconomic < 1, `${party.id} se vende por inteiro em economia`);
    assert.ok(party.venalityLiberty < 1, `${party.id} se vende por inteiro em costumes`);
  }
});

test("o catalogo expoe as bancadas e os parametros fiscais", () => {
  assert.equal(CATALOG.parties, PARTIES);
  assert.ok(CATALOG.fiscal.taxLoad > 0);
});

/* ── AS PROVAS SINTETICAS DO VALIDADOR ──────────────────────────────────────
   O catalogo passar nao prova nada sobre o validador: ele passaria igual se
   `violations` devolvesse lista vazia sempre. Cada prova abaixo reintroduz um
   defeito e exige acusacao, que e a mesma exigencia das guardas. */

test("PROVA SINTETICA: campo faltando e acusado", () => {
  /* Um registro real MENOS um campo: assim a prova mede a falta e nada mais.
     Escrito por filtro e nao por desestruturacao com resto, que deixaria uma
     variavel morta so para dar nome ao campo descartado. */
  const complete = PARTIES[0];
  assert.ok(complete);
  const broken = Object.fromEntries(
    Object.entries(complete).filter(([field]) => field !== "seats"),
  );
  const found = violations(PARTY_SCHEMA, broken, "teste");
  assert.equal(found.length, 1);
  assert.match(found[0] ?? "", /seats/);
});

test("PROVA SINTETICA: campo a mais e acusado", () => {
  const broken = { ...(PARTIES[0] ?? {}), sobrando: 1 };
  const found = violations(PARTY_SCHEMA, broken, "teste");
  assert.match(found.join(" "), /sobrando/);
});

test("PROVA SINTETICA: id fora do kebab-case e acusado", () => {
  const broken = { ...(PARTIES[0] ?? {}), id: "Centrão Puro" };
  assert.match(violations(PARTY_SCHEMA, broken, "teste").join(" "), /kebab-case/);
});

test("PROVA SINTETICA: id repetido e acusado", () => {
  const first = PARTIES[0];
  assert.ok(first);
  const found = collectionViolations(PARTY_SCHEMA, [first, first], "teste");
  assert.match(found.join(" "), /mais de uma vez/);
});

test("todo numero fora da faixa declarada e acusado", () => {
  /* Propriedade e nao exemplo: o que precisa ser provado nao e que 1.5 de
     venalidade e recusado, e que NENHUM valor fora da faixa passa. */
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

test("o validador nao conserta nem preenche, so relata", () => {
  /* Validador que conserta esconde o erro em vez de mostrar. A prova de que ele
     nao mexe e o registro sair identico ao que entrou. */
  const record = { ...(PARTIES[0] ?? {}), venalityEconomic: 9 };
  const before = JSON.stringify(record);
  violations(PARTY_SCHEMA, record, "teste");
  assert.equal(JSON.stringify(record), before);
});
