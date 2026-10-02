/* SUITE · O REDUCER — propriedades, e não exemplos.
   POR QUE ESTA E A PRIMEIRA SUITE, com os motores ainda por nascer.
   O reducer e a única peça já implementada que o resto vai depender: `src/state/state.mjs`
   promete três coisas — imutabilidade, pureza e identidade de referencia — e as três são a
   base do render sem framework. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { AREAS } from "../../src/data/areas.mjs";
import { PROGRAMS } from "../../src/data/programs.mjs";
import { PARTIES } from "../../src/data/parties.mjs";
import { LOBBIES } from "../../src/data/lobbies.mjs";
import { OPINION, SEGMENTS } from "../../src/data/opinion.mjs";
import { inherited } from "../../src/domain/norms/index.mjs";
import { pollFrom } from "../../src/domain/opinion/index.mjs";
import { SCHEMA_VERSION, createState, monthLabel, reduce } from "../../src/state/state.mjs";

/** @typedef {import("../../src/state/state.mjs").GameState} GameState */
/** @typedef {import("../../src/state/state.mjs").Action} Action */

/* A ÚNICA ação que o reducer conhece. */

/**
 * @param {GameState} state
 * @returns {Action}
 */
function resolutionOf(state) {
  return {
    type: "monthResolved",
    loyalty: state.loyalty,
    decree: state.decree ?? [],
    platform: state.platform,
    fiscal: state.fiscal,
    capacity: state.capacity,
    macro: state.macro,
    mood: state.mood,
    series: state.series,
    months: state.months,
    levels: state.levels,
    norms: state.norms,
    bills: state.bills,
    mail: state.mail,
    pressure: state.pressure,
    impeachment: state.impeachment,
    fallen: state.fallen,
    memory: state.memory,
    stream: state.streams.congress,
  };
}

/* A SATISFAÇÃO DE CADA SEGMENTO em qualquer ponto da escala, incluindo os extremos: um
   governo adorado pela base e odiado pelo topo e um estado valido, e e justamente o que a
   media nacional esconde. */
const anyMood = fc
  .array(fc.double({ min: 0, max: 100, noNaN: true }), {
    minLength: SEGMENTS.length,
    maxLength: SEGMENTS.length,
  })
  .map(values => Object.fromEntries(SEGMENTS.map((segment, i) => [segment.id, values[i] ?? 0])));

/* Fluxos em QUALQUER ponto do percurso, e não só zerados: um save carregado no turno 40 chega
   com contadores altos, e o reducer tem de tratar isso como trata o começo. */
const anyStream = fc.record({
  seed: fc.integer({ min: 0, max: 4294967295 }),
  draws: fc.nat({ max: 5000 }),
});

/* A BASE em qualquer humor, uma entrada por bancada do catálogo. */
const anyLoyalty = fc
  .array(fc.double({ min: 0, max: 100, noNaN: true }), {
    minLength: PARTIES.length,
    maxLength: PARTIES.length,
  })
  .map(values => Object.fromEntries(PARTIES.map((party, i) => [party.id, values[i] ?? 0])));

/* Posições orçamentárias por todo o percurso, e não só a de abertura: o estado que chega aqui
   pode vir de um save do mês 40, com a dívida já em outro patamar. */
const anyFiscal = fc.record({
  mandatory: fc.double({ min: 0, max: 12000, noNaN: true }),
  anchorRevenue: fc.double({ min: 1, max: 12000, noNaN: true }),
  anchorExpense: fc.double({ min: 0, max: 12000, noNaN: true }),
  debt: fc.double({ min: 0, max: 60000, noNaN: true }),
});

/* A CAPACIDADE em qualquer ponto do percurso, incluindo o histórico pela metade: uma área de
   atraso longo passa dois anos com o buffer incompleto, e o reducer não pode ter opinião
   sobre isso. */
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

const anyMacro = fc.record({
  gdp: fc.double({ min: 1000, max: 30000, noNaN: true }),
  potential: fc.double({ min: 1000, max: 30000, noNaN: true }),
  inflation: fc.double({ min: -0.05, max: 0.5, noNaN: true }),
  rate: fc.double({ min: 0, max: 0.5, noNaN: true }),
  unemployment: fc.double({ min: 0.01, max: 0.4, noNaN: true }),
  population: fc.double({ min: 100, max: 300, noNaN: true }),
});

/* A SÉRIE EM QUALQUER PONTO DO MANDATO, e a vazia entra junto: uma partida recem-aberta não
   tem mês guardado nenhum, e uma que atravessou o mandato tem 48. */
const anySeriesLine = fc.array(fc.double({ min: -1e4, max: 3e4, noNaN: true }), { maxLength: 48 });

const anySeries = fc.record({
  gdp: anySeriesLine,
  inflation: anySeriesLine,
  rate: anySeriesLine,
  unemployment: anySeriesLine,
  debtRatio: anySeriesLine,
  primary: anySeriesLine,
  /* ⚠ AS OITO ÁREAS COM COMPRIMENTOS DIFERENTES ENTRE SI, e não a mesma linha oito vezes: a
     série de uma área começa quando a área começa a ser medida, e nada no modelo garante que
     as oito tenham o mesmo tamanho. */
  areas: fc
    .array(anySeriesLine, { minLength: AREAS.length, maxLength: AREAS.length })
    .map(lines => Object.fromEntries(AREAS.map((area, index) => [area.id, lines[index] ?? []]))),
});

/* ⚠ ELAS VIRARAM UMA PILHA DE NORMAS na versão 12 do save, e o gerador acompanhou: um mandato
   de 48 meses reformando chega ao fim com dezenas de textos por cima dos herdados, e o
   reducer tem de carregar isso do mesmo jeito que carregava um par de números. */
const anyNorms = fc
  .array(
    fc.record({
      lever: fc.integer({ min: 0, max: PROGRAMS.length - 1 }),
      floor: fc.integer({ min: 0, max: 100 }),
      ceiling: fc.integer({ min: 0, max: 100 }),
      enactedAt: fc.integer({ min: 0, max: 47 }),
    }),
    { maxLength: 60 },
  )
  .map(written => {
    /** @type {import("../../src/domain/norms/index.mjs").Norm[]} */
    const pile = PROGRAMS.map(program => inherited(program));

    written.forEach((item, index) => {
      const program = PROGRAMS[item.lever];
      if (!program) return;
      pile.push({
        ...inherited(program),
        id: `escrita-${index}`,
        floor: item.floor,
        ceiling: item.ceiling,
        enactedAt: item.enactedAt,
      });
    });

    return pile;
  });

const anyState = fc.record({
  schemaVersion: fc.constant(SCHEMA_VERSION),
  seed: fc.integer({ min: 0, max: 4294967295 }),
  /* O presidente entrou na versão 18: nome digitado pelo jogador, ou `null` para o sorteado.
     O reducer apenas o carrega, então a prova cobre os dois lados. */
  president: fc.option(
    fc.record({
      name: fc.string({ minLength: 1, maxLength: 40 }),
      treatment: fc.constantFrom("senhor", "senhora"),
    }),
    { nil: null },
  ),
  /* ⚠ A PLATAFORMA ENTROU NA VERSÃO 20: os três compromissos da posse, e o reducer apenas os
     carrega. Os quatro estados de cada eixo entram — inclusive o `null` de quem não prometeu. */
  platform: fc.record({
    priority: fc.option(fc.constantFrom("security", "education", "industry"), { nil: null }),
    fiscal: fc.option(fc.constantFrom("debt", "primary"), { nil: null }),
    reform: fc.option(fc.constantFrom("law", "amendment", "keep"), { nil: null }),
  }),
  /* 48 turnos por mandato — a decisão fechada. */
  month: fc.integer({ min: 0, max: 47 }),
  mood: anyMood,
  loyalty: anyLoyalty,
  fiscal: anyFiscal,
  /* Ela entrou na versão 8 do save, e o reducer não pode ter opinião sobre valor de campo que
     ele apenas carrega — inclusive um país em recessão com juro de 40%. */
  macro: anyMacro,
  series: anySeries,
  /* ⚠ O FECHAMENTO DE CADA MÊS entrou na versão 19 do save: o reducer apenas o carrega. */
  months: fc.constant(/** @type {import("../../src/state/state.mjs").MonthCard[]} */ ([])),
  capacity: anyCapacity,
  levels: fc.constant(Object.fromEntries(PROGRAMS.map(p => [p.id, p.initial]))),
  norms: anyNorms,
  /* ⚠ A GAVETA EM QUALQUER PONTO DA TRAMITAÇÃO, e os três estágios entram. */
  bills: fc.array(
    fc.record({
      id: fc.string({ minLength: 1, maxLength: 12 }),
      writtenAt: fc.integer({ min: 0, max: 47 }),
      stage: fc.constantFrom("drawer", "rapporteur", "floor"),
      since: fc.integer({ min: 0, max: 47 }),
      label: fc.string({ maxLength: 24 }),
      bands: fc.constant({}),
      levels: fc.constant({}),
      except: fc.array(fc.string({ maxLength: 8 }), { maxLength: 2 }),
    }),
    { maxLength: 4 },
  ),
  /* ⚠ A CAIXA DE ENTRADA COM AS DUAS NATUREZAS DENTRO, e as duas precisam estar aqui: o AVISO
     (`due` nulo, já fechado) e a PERGUNTA (com prazo, esperando ou já respondida). */
  mail: fc.array(
    fc.record({
      id: fc.string({ minLength: 1, maxLength: 12 }),
      kind: fc.constantFrom(
        "posse",
        "tabled",
        "reported",
        "forgotten",
        "passed",
        "rejected",
        "demand",
      ),
      month: fc.integer({ min: 0, max: 47 }),
      due: fc.option(fc.integer({ min: 0, max: 47 }), { nil: null }),
      subject: fc.option(fc.string({ maxLength: 24 }), { nil: null }),
      bill: fc.option(fc.string({ maxLength: 12 }), { nil: null }),
      except: fc.array(fc.string({ maxLength: 8 }), { maxLength: 2 }),
      saved: fc.option(fc.string({ maxLength: 24 }), { nil: null }),
      /* OS TRÊS CAMPOS DA CHANTAGEM, e o gerador os sorteia soltos de propósito: o reducer
         não pode depender de eles virem coerentes entre si. */
      from: fc.option(fc.string({ maxLength: 12 }), { nil: null }),
      lever: fc.option(fc.string({ maxLength: 12 }), { nil: null }),
      level: fc.option(fc.integer({ min: 0, max: 100 }), { nil: null }),
      was: fc.option(fc.integer({ min: 0, max: 513 }), { nil: null }),
      now: fc.option(fc.integer({ min: 0, max: 513 }), { nil: null }),
      weight: fc.option(fc.constant("high"), { nil: null }),
      answer: fc.option(fc.constantFrom("accept", "block", "silence"), { nil: null }),
      closedAt: fc.option(fc.integer({ min: 0, max: 47 }), { nil: null }),
    }),
    { maxLength: 5 },
  ),
  /* A MEMÓRIA EM QUALQUER PONTO DA ESCALA, incluindo os dois extremos: um sujeito que o
     governo bancou o mandato inteiro e um que ele traiu no primeiro mês são estados válidos,
     e o reducer não pode ter opinião sobre nenhum dos dois. */
  /* A CALDEIRA EM QUALQUER TEMPERATURA, e as duas pontas entram: um governo que agrada todo
     mundo e um em véspera de queda são estados válidos, e o reducer não pode ter opinião
     sobre nenhum dos dois. */
  pressure: fc
    .array(fc.double({ min: 0, max: 100, noNaN: true }), {
      minLength: LOBBIES.length,
      maxLength: LOBBIES.length,
    })
    .map(values => Object.fromEntries(LOBBIES.map((l, i) => [l.id, values[i] ?? 0]))),
  /* E O PROCESSO ABERTO OU NÃO. */
  impeachment: fc.option(fc.integer({ min: 0, max: 47 }), { nil: null }),
  fallen: fc.option(fc.integer({ min: 0, max: 47 }), { nil: null }),
  memory: fc
    .array(fc.double({ min: -100, max: 100, noNaN: true }), { maxLength: 12 })
    .map(values => Object.fromEntries(values.map((value, index) => [`pessoa-${index}`, value]))),
  streams: fc.record({ events: anyStream, congress: anyStream }),
});

/* Ação que o reducer NÃO conhece. */
const anyUnknownAction = fc
  .string({ minLength: 1 })
  .filter(type => type !== "monthResolved")
  .map(type => /** @type {Action} */ (/** @type {unknown} */ ({ type })));

/**
 * O INVARIANTE DA APROVAÇÃO, extraído para que a prova sintética la embaixo rode ESTA
 * verificação e não uma copia dela.
 *
 * e a saída de SONDA, e não um campo carregado. O invariante e o mesmo: as três
 * fatias somam 100 e nenhuma e negativa.
 * @param {import("../../src/domain/opinion/index.mjs").Approval} approval
 */
function assertApprovalInvariant(approval) {
  const { good, fair, poor } = approval;
  assert.equal(good + fair + poor, 100, `as tres fatias somam ${good + fair + poor}`);
  assert.ok(fair >= 0, `fair saiu negativo (${fair})`);
  assert.ok(good >= 0 && poor >= 0, `fatia negativa: good=${good} poor=${poor}`);
}

test("o estado de abertura já satisfaz o invariante e já sai congelado", () => {
  const state = createState();
  assertApprovalInvariant(pollFrom(state.mood, SEGMENTS, OPINION));
  assert.ok(Object.isFrozen(state));
  assert.ok(Object.isFrozen(state.mood));
  assert.ok(Object.isFrozen(state.fiscal));
  assert.ok(Object.isFrozen(state.capacity.index));
  assert.ok(Object.isFrozen(state.series.gdp));
});

test("reduce nunca muta o estado que recebe", () => {
  fc.assert(
    fc.property(anyState, state => {
      /* Retrato ANTES da chamada. */
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
      assert.ok(Object.isFrozen(next.mood), "a satisfacao saiu destravada");
    }),
  );
});

test("ação desconhecida devolve a MESMA referencia, e não uma copia igual", () => {
  fc.assert(
    fc.property(anyState, anyUnknownAction, (state, action) => {
      /* IGUALDADE DE REFERENCIA, não deepEqual. */
      assert.equal(reduce(state, action), state);
    }),
  );
});

test("o mês anda exatamente um por turno, e só para frente", () => {
  fc.assert(
    fc.property(anyState, state => {
      assert.equal(reduce(state, resolutionOf(state)).month, state.month + 1);
    }),
  );
});

test("a aprovação sempre soma 100 e nenhuma fatia fica negativa", () => {
  fc.assert(
    fc.property(anyState, state =>
      assertApprovalInvariant(pollFrom(reduce(state, resolutionOf(state)).mood, SEGMENTS, OPINION)),
    ),
  );
});

test("PROVA SINTÉTICA: o invariante acusa um reducer que larga o resto", () => {
  /* O defeito exato que a verificação acima existe para pegar: `fair` deixa de ser o resto e
     vira campo carregado adiante — que e o formato do erro quando alguém troca a conta por um
     spread durante uma refatoração. */
  const broken = (/** @type {GameState} */ state) => {
    const poll = pollFrom(state.mood, SEGMENTS, OPINION);
    return { ...poll, good: poll.good + 2 };
  };

  assert.throws(
    () => fc.assert(fc.property(anyState, state => assertApprovalInvariant(broken(state)))),
    "o invariante nao acusou uma aprovacao que soma 102 — a assercao nao consegue falhar",
  );
});

/* ── A AÇÃO QUE VEM DA CAMADA DE APLICAÇÃO ────────────────────────────────── `monthResolved`
   chega com a conta já feita; o que se prova aqui e o DOBRAR, e não o cálculo — o cálculo tem
   suite própria em `turn.mjs`. */

test("o mês resolvido também anda exatamente um, e sai congelado", () => {
  fc.assert(
    fc.property(anyState, state => {
      const next = reduce(state, resolutionOf(state));
      assert.equal(next.month, state.month + 1);
      assert.ok(Object.isFrozen(next), "a raiz saiu destravada");
      assert.ok(Object.isFrozen(next.fiscal), "a posicao orcamentaria saiu destravada");
    }),
  );
});

test("o mês resolvido PRESERVA A REFERENCIA do que ele não toca", () => {
  /* Um spread que recriasse um objeto sem motivo passaria em qualquer deepEqual e mandaria a
     tela redesenhar o painel inteiro todo mês — defeito silencioso, e caro exatamente na peça
     que usa filtro.
     ⚠ ELA MEDIA `streams.events`, QUE SAIU POR NÃO TER CONSUMIDOR, e o que ela cobra continua
     de pé no fluxo que restou: a ação devolve o MESMO fluxo, e recriá-lo seria o spread
     indiscriminado que esta prova existe para pegar. */
  fc.assert(
    fc.property(anyState, state => {
      const next = reduce(state, resolutionOf(state));
      assert.equal(
        next.streams.congress,
        state.streams.congress,
        "o fluxo da tramitacao foi RECRIADO, e a acao o devolveu inalterado",
      );
    }),
  );
});

test("reduce e determinístico: mesma entrada, mesma saída", () => {
  fc.assert(
    fc.property(anyState, state => {
      const action = resolutionOf(state);
      assert.deepEqual(reduce(state, action), reduce(state, action));
    }),
  );
});

test("monthLabel e total para qualquer mês, inclusive além do mandato", () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 2000 }), month => {
      /* O rótulo tem forma fixa: três letras, ponto médio, quatro dígitos. */
      assert.match(monthLabel(month), /^[a-z]{3} · \d{4}$/u);
    }),
  );
});
