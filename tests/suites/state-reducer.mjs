/* SUITE · O REDUCER — propriedades, e nao exemplos.
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE ESTA E A PRIMEIRA SUITE, com os motores ainda por nascer. O reducer e
   a unica peca ja implementada que o resto vai depender: `src/state/state.mjs`
   promete tres coisas — imutabilidade, pureza e identidade de referencia — e as
   tres sao a base do render sem framework. Promessa de cabecalho que ninguem
   executa e comentario, nao contrato.

   POR QUE PROPRIEDADE E NAO EXEMPLO. Um exemplo prova que `{31,34,35}` funciona.
   O que precisa ser provado e diferente: que NENHUM estado valido quebra os
   invariantes — e borda de faixa e exatamente o que ninguem escolhe como
   exemplo.

   ⚠ O ANDAIME JA SAIU, e estas provas continuaram. Havia aqui uma acao
   `advanceMonth` que empurrava o mes e oscilava a aprovacao numa senoide
   deterministica; ela morreu quando o botao da tela passou a chamar o turno de
   verdade. As propriedades nunca descreveram aquele corpo — elas descrevem o que
   tem de continuar verdadeiro depois que ele saisse —, e por isso foi possivel
   apenas aponta-las para a acao viva. Prova amarrada a implementacao teria
   morrido junto. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { AREAS } from "../../src/data/areas.mjs";
import { BILLS } from "../../src/data/bills.mjs";
import { PARTIES } from "../../src/data/parties.mjs";
import { SCHEMA_VERSION, createState, monthLabel, reduce } from "../../src/state/state.mjs";

/** @typedef {import("../../src/state/state.mjs").GameState} GameState */
/** @typedef {import("../../src/state/state.mjs").Action} Action */

/* A UNICA acao que o reducer conhece. `advanceMonth` existia ao lado dela como
   andaime — empurrava o mes e oscilava a aprovacao — e saiu quando o botao da
   tela passou a chamar o turno de verdade. As provas que rodavam nele foram
   MOVIDAS para ca, e nao apagadas: elas provam invariantes do reducer, e o
   reducer continua existindo. Prova de invariante rodando em acao morta e
   cobertura que nao cobre o caminho que roda. */

/**
 * @param {GameState} state
 * @returns {Action}
 */
function resolutionOf(state) {
  return {
    type: "monthResolved",
    loyalty: state.loyalty,
    fiscal: state.fiscal,
    capacity: state.capacity,
    enacted: state.enacted,
    stream: state.streams.congress,
  };
}

/* ESTADOS VALIDOS, e nao objetos quaisquer. Gerar aprovacao com as tres fatias
   soltas produziria entradas que o jogo nunca constroi, e a falha resultante
   falaria do gerador em vez do reducer. Aqui `fair` nasce como o resto — que e a
   mesma definicao que o codigo de producao usa. */
const anyApproval = fc
  .record({
    good: fc.integer({ min: 0, max: 100 }),
    poor: fc.integer({ min: 0, max: 100 }),
  })
  .filter(({ good, poor }) => good + poor <= 100)
  .map(({ good, poor }) => ({ good, fair: 100 - good - poor, poor }));

/* Fluxos em QUALQUER ponto do percurso, e nao so zerados: um save carregado no
   turno 40 chega com contadores altos, e o reducer tem de tratar isso como
   trata o comeco. */
const anyStream = fc.record({
  seed: fc.integer({ min: 0, max: 4294967295 }),
  draws: fc.nat({ max: 5000 }),
});

/* A BASE em qualquer humor, uma entrada por bancada do catalogo. */
const anyLoyalty = fc
  .array(fc.double({ min: 0, max: 100, noNaN: true }), {
    minLength: PARTIES.length,
    maxLength: PARTIES.length,
  })
  .map(values => Object.fromEntries(PARTIES.map((party, i) => [party.id, values[i] ?? 0])));

/* Posicoes orcamentarias por todo o percurso, e nao so a de abertura: o estado
   que chega aqui pode vir de um save do mes 40, com a divida ja em outro
   patamar. As faixas sao largas de proposito — o reducer nao pode ter opiniao
   sobre valor de campo que ele apenas carrega. */
const anyFiscal = fc.record({
  gdp: fc.double({ min: 1000, max: 30000, noNaN: true }),
  mandatory: fc.double({ min: 0, max: 12000, noNaN: true }),
  anchorRevenue: fc.double({ min: 1, max: 12000, noNaN: true }),
  anchorExpense: fc.double({ min: 0, max: 12000, noNaN: true }),
  debt: fc.double({ min: 0, max: 60000, noNaN: true }),
});

/* A CAPACIDADE em qualquer ponto do percurso, incluindo o historico pela metade:
   uma area de atraso longo passa dois anos com o buffer incompleto, e o reducer
   nao pode ter opiniao sobre isso. */
const anyCapacity = fc.record({
  index: fc
    .array(fc.double({ min: 0, max: 100, noNaN: true }), {
      minLength: AREAS.length,
      maxLength: AREAS.length,
    })
    .map(values => Object.fromEntries(AREAS.map((area, i) => [area.id, values[i] ?? 0]))),
  history: fc
    .array(fc.array(fc.double({ min: 0, max: 100, noNaN: true }), { maxLength: 25 }), {
      minLength: AREAS.length,
      maxLength: AREAS.length,
    })
    .map(values => Object.fromEntries(AREAS.map((area, i) => [area.id, values[i] ?? []]))),
});

const anyState = fc.record({
  schemaVersion: fc.constant(SCHEMA_VERSION),
  seed: fc.integer({ min: 0, max: 4294967295 }),
  /* 48 turnos por mandato — a decisao fechada. */
  month: fc.integer({ min: 0, max: 47 }),
  approval: anyApproval,
  loyalty: anyLoyalty,
  fiscal: anyFiscal,
  capacity: anyCapacity,
  enacted: fc.uniqueArray(fc.constantFrom(...BILLS.map(bill => bill.id)), { maxLength: 12 }),
  streams: fc.record({ events: anyStream, congress: anyStream }),
});

/* Acao que o reducer NAO conhece. O molde de tipo so admite "monthResolved", e a
   conversao dupla esta aqui para dizer em voz alta que a saida do tipo e
   proposital: e justamente o caso nao previsto que o `default` tem de aguentar,
   porque save antigo e codigo futuro chegam assim. */
const anyUnknownAction = fc
  .string({ minLength: 1 })
  .filter(type => type !== "monthResolved")
  .map(type => /** @type {Action} */ (/** @type {unknown} */ ({ type })));

/**
 * O INVARIANTE DA APROVACAO, extraido para que a prova sintetica la embaixo rode
 * ESTA verificacao e nao uma copia dela. Prova que exercita uma copia nao diz
 * nada sobre o casador que roda de verdade.
 *
 * @param {GameState} state
 */
function assertApprovalInvariant(state) {
  const { good, fair, poor } = state.approval;
  assert.equal(good + fair + poor, 100, `as tres fatias somam ${good + fair + poor}`);
  assert.ok(fair >= 0, `fair saiu negativo (${fair})`);
  assert.ok(good >= 0 && poor >= 0, `fatia negativa: good=${good} poor=${poor}`);
}

test("o estado de abertura ja satisfaz o invariante e ja sai congelado", () => {
  const state = createState();
  assertApprovalInvariant(state);
  assert.ok(Object.isFrozen(state));
  assert.ok(Object.isFrozen(state.approval));
});

test("reduce nunca muta o estado que recebe", () => {
  fc.assert(
    fc.property(anyState, state => {
      /* Retrato ANTES da chamada. Se o reducer mexer no lugar, o retrato e o
         objeto divergem — e nenhum `Object.freeze` teria avisado, porque o
         estado que o jogo passa nem sempre vem congelado de fora. */
      const before = JSON.stringify(state);
      reduce(state, resolutionOf(state));
      assert.equal(JSON.stringify(state), before);
    }),
  );
});

test("o estado que sai esta congelado em profundidade", () => {
  fc.assert(
    fc.property(anyState, state => {
      const next = reduce(state, resolutionOf(state));
      assert.ok(Object.isFrozen(next), "a raiz saiu destravada");
      assert.ok(Object.isFrozen(next.approval), "a aprovacao saiu destravada");
    }),
  );
});

test("acao desconhecida devolve a MESMA referencia, e nao uma copia igual", () => {
  fc.assert(
    fc.property(anyState, anyUnknownAction, (state, action) => {
      /* IGUALDADE DE REFERENCIA, nao deepEqual. O render deste projeto decide o
         que redesenhar comparando `anterior.approval === atual.approval`; um
         reducer que devolvesse uma copia identica passaria num deepEqual e
         redesenharia a tela inteira a cada turno. */
      assert.equal(reduce(state, action), state);
    }),
  );
});

test("o mes anda exatamente um por turno, e so para frente", () => {
  fc.assert(
    fc.property(anyState, state => {
      assert.equal(reduce(state, resolutionOf(state)).month, state.month + 1);
    }),
  );
});

test("a aprovacao sempre soma 100 e nenhuma fatia fica negativa", () => {
  fc.assert(
    fc.property(anyState, state => assertApprovalInvariant(reduce(state, resolutionOf(state)))),
  );
});

test("PROVA SINTETICA: o invariante acusa um reducer que larga o resto", () => {
  /* O defeito exato que a verificacao acima existe para pegar: `fair` deixa de
     ser o resto e vira campo carregado adiante — que e o formato do erro quando
     alguem troca a conta por um spread durante uma refatoracao.
     Sem esta prova, "verde" nao distingue reducer correto de assercao frouxa. */
  const broken = (/** @type {GameState} */ state) => ({
    ...state,
    approval: { ...state.approval, good: state.approval.good + 2 },
  });

  assert.throws(
    () => fc.assert(fc.property(anyState, state => assertApprovalInvariant(broken(state)))),
    "o invariante nao acusou uma aprovacao que soma 102 — a assercao nao consegue falhar",
  );
});

/* ── A ACAO QUE VEM DA CAMADA DE APLICACAO ──────────────────────────────────
   `monthResolved` chega com a conta ja feita; o que se prova aqui e o DOBRAR,
   e nao o calculo — o calculo tem suite propria em `turn.mjs`. */

test("o mes resolvido tambem anda exatamente um, e sai congelado", () => {
  fc.assert(
    fc.property(anyState, state => {
      const next = reduce(state, resolutionOf(state));
      assert.equal(next.month, state.month + 1);
      assert.ok(Object.isFrozen(next), "a raiz saiu destravada");
      assert.ok(Object.isFrozen(next.fiscal), "a posicao orcamentaria saiu destravada");
    }),
  );
});

test("o mes resolvido PRESERVA A REFERENCIA do que ele nao toca", () => {
  /* O contrato de render por identidade, cobrado na acao nova. A aprovacao nao
     tem motor que a mova hoje, entao `anterior.approval === atual.approval` tem
     de continuar respondendo "esta parte da tela nao mudou". Um spread que
     recriasse o objeto passaria em qualquer deepEqual e mandaria a tela
     redesenhar o painel inteiro todo mes — defeito silencioso, e caro
     exatamente na peca que usa filtro. */
  fc.assert(
    fc.property(anyState, state => {
      const next = reduce(state, resolutionOf(state));
      assert.equal(next.approval, state.approval, "a aprovacao foi recriada sem ter mudado");
      assert.equal(next.streams.events, state.streams.events, "o fluxo de eventos foi recriado");
    }),
  );
});

test("reduce e deterministico: mesma entrada, mesma saida", () => {
  fc.assert(
    fc.property(anyState, state => {
      const action = resolutionOf(state);
      assert.deepEqual(reduce(state, action), reduce(state, action));
    }),
  );
});

test("monthLabel e total para qualquer mes, inclusive alem do mandato", () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 2000 }), month => {
      /* O rotulo tem forma fixa: tres letras, ponto medio, quatro digitos. O que
         esta sendo provado e TOTALIDADE — que nenhum mes cai no `?? "jan"`
         disfarcando um indice fora da faixa como se fosse janeiro. */
      assert.match(monthLabel(month), /^[a-z]{3} · \d{4}$/u);
    }),
  );
});
