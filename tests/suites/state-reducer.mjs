/* SUITE · O REDUCER — propriedades, e nao exemplos.
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE ESTA E A PRIMEIRA SUITE, com os motores ainda por nascer. O reducer e
   a unica peca ja implementada que o resto vai depender: `src/state/state.mjs`
   promete tres coisas — imutabilidade, pureza e identidade de referencia — e as
   tres sao a base do render sem framework. Promessa de cabecalho que ninguem
   executa e comentario, nao contrato.

   POR QUE PROPRIEDADE E NAO EXEMPLO. Um exemplo prova que `{31,34,35}` funciona.
   O que precisa ser provado e diferente: que NENHUM estado valido produz uma
   fatia negativa. O corpo do reducer chega a `fair` por subtracao, depois de
   `good` e `poor` passarem por DOIS clamps independentes — e essa e exatamente a
   forma de conta que fura numa borda que ninguem escolheria como exemplo.

   ⚠ O CORPO DO REDUCER E ANDAIME e sai inteiro quando CASCATA, CORRENTE e SONDA
   existirem. Estas propriedades nao descrevem o andaime: elas descrevem o que
   tem de continuar verdadeiro depois que ele sair. Por isso nenhuma delas cita a
   oscilacao de "sobe tres meses, desce dois" — repetir a implementacao num teste
   nao prova nada, so obriga a editar dois lugares. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { SCHEMA_VERSION, createState, monthLabel, reduce } from "../../src/state/state.mjs";

/** @typedef {import("../../src/state/state.mjs").GameState} GameState */
/** @typedef {import("../../src/state/state.mjs").Action} Action */

/** @type {Action} */
const ADVANCE = { type: "advanceMonth" };

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

const anyState = fc.record({
  schemaVersion: fc.constant(SCHEMA_VERSION),
  /* 48 turnos por mandato — a decisao fechada. */
  month: fc.integer({ min: 0, max: 47 }),
  approval: anyApproval,
  situation: fc.constantFrom("crisis", "stable", "growth"),
});

/* Acao que o reducer NAO conhece. O molde de tipo so admite "advanceMonth", e a
   conversao dupla esta aqui para dizer em voz alta que a saida do tipo e
   proposital: e justamente o caso nao previsto que o `default` tem de aguentar,
   porque save antigo e codigo futuro chegam assim. */
const anyUnknownAction = fc
  .string({ minLength: 1 })
  .filter(type => type !== "advanceMonth")
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
      reduce(state, ADVANCE);
      assert.equal(JSON.stringify(state), before);
    }),
  );
});

test("o estado que sai esta congelado em profundidade", () => {
  fc.assert(
    fc.property(anyState, state => {
      const next = reduce(state, ADVANCE);
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
      assert.equal(reduce(state, ADVANCE).month, state.month + 1);
    }),
  );
});

test("a aprovacao sempre soma 100 e nenhuma fatia fica negativa", () => {
  fc.assert(fc.property(anyState, state => assertApprovalInvariant(reduce(state, ADVANCE))));
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

test("reduce e deterministico: mesma entrada, mesma saida", () => {
  fc.assert(
    fc.property(anyState, state => {
      assert.deepEqual(reduce(state, ADVANCE), reduce(state, ADVANCE));
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
