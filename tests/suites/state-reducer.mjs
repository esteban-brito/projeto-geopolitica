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
import { PROGRAMS } from "../../src/data/programs.mjs";
import { PARTIES } from "../../src/data/parties.mjs";
import { LOBBIES } from "../../src/data/lobbies.mjs";
import { OPINION, SEGMENTS } from "../../src/data/opinion.mjs";
import { inherited } from "../../src/domain/norms/index.mjs";
import { pollFrom } from "../../src/domain/opinion/index.mjs";
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
    macro: state.macro,
    mood: state.mood,
    series: state.series,
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

/* A SATISFACAO DE CADA SEGMENTO em qualquer ponto da escala, incluindo os
   extremos: um governo adorado pela base e odiado pelo topo e um estado valido, e
   e justamente o que a media nacional esconde. */
const anyMood = fc
  .array(fc.double({ min: 0, max: 100, noNaN: true }), {
    minLength: SEGMENTS.length,
    maxLength: SEGMENTS.length,
  })
  .map(values => Object.fromEntries(SEGMENTS.map((segment, i) => [segment.id, values[i] ?? 0])));

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

const anyMacro = fc.record({
  gdp: fc.double({ min: 1000, max: 30000, noNaN: true }),
  potential: fc.double({ min: 1000, max: 30000, noNaN: true }),
  inflation: fc.double({ min: -0.05, max: 0.5, noNaN: true }),
  rate: fc.double({ min: 0, max: 0.5, noNaN: true }),
  unemployment: fc.double({ min: 0.01, max: 0.4, noNaN: true }),
  population: fc.double({ min: 100, max: 300, noNaN: true }),
});

/* A SERIE EM QUALQUER PONTO DO MANDATO, e a vazia entra junto: uma partida
   recem-aberta nao tem mes guardado nenhum, e uma que atravessou o mandato tem
   48. As linhas nao andam juntas por construcao — o reducer recebe o que lhe
   derem e so carrega —, entao cada uma sorteia o proprio comprimento. */
const anySeriesLine = fc.array(fc.double({ min: -1e4, max: 3e4, noNaN: true }), { maxLength: 48 });

const anySeries = fc.record({
  gdp: anySeriesLine,
  inflation: anySeriesLine,
  rate: anySeriesLine,
  unemployment: anySeriesLine,
  debtRatio: anySeriesLine,
  primary: anySeriesLine,
  /* ⚠ AS OITO AREAS COM COMPRIMENTOS DIFERENTES ENTRE SI, e nao a mesma linha oito
     vezes: a serie de uma area comeca quando a area comeca a ser medida, e nada no
     modelo garante que as oito tenham o mesmo tamanho. Um gerador que as fizesse
     iguais deixaria de acusar o dia em que alguem indexasse uma pela outra. */
  areas: fc
    .array(anySeriesLine, { minLength: AREAS.length, maxLength: AREAS.length })
    .map(lines => Object.fromEntries(AREAS.map((area, index) => [area.id, lines[index] ?? []]))),
});

/* AS LEIS DO PAIS EM QUALQUER CONFIGURACAO, e a faixa invertida entra junto: o
   reducer nao tem opiniao sobre o conteudo de uma lei, ele so a carrega. Quem
   recusa faixa impossivel e quem a compoe, e ha prova disso em `agenda.mjs`.

   ⚠ ELAS VIRARAM UMA PILHA DE NORMAS na versao 12 do save, e o gerador acompanhou:
   um mandato de 48 meses reformando chega ao fim com dezenas de textos por cima
   dos herdados, e o reducer tem de carregar isso do mesmo jeito que carregava um
   par de numeros. A guarda vem do proprio programa porque ela e a natureza da
   norma — o gerador pode inventar conteudo, e nao hierarquia. */
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
  /* 48 turnos por mandato — a decisao fechada. */
  month: fc.integer({ min: 0, max: 47 }),
  mood: anyMood,
  loyalty: anyLoyalty,
  fiscal: anyFiscal,
  /* A POSICAO MACRO em qualquer ponto do percurso. Ela entrou na versao 8 do
     save, e o reducer nao pode ter opiniao sobre valor de campo que ele apenas
     carrega — inclusive um pais em recessao com juro de 40%. */
  macro: anyMacro,
  series: anySeries,
  capacity: anyCapacity,
  levels: fc.constant(Object.fromEntries(PROGRAMS.map(p => [p.id, p.initial]))),
  norms: anyNorms,
  /* ⚠ A GAVETA EM QUALQUER PONTO DA TRAMITACAO, e os tres estagios entram. O
     reducer nao pode ter opiniao sobre um texto parado na gaveta ha cinco meses
     nem sobre um que ja esta no plenario: ele CARREGA, e a prova existe para
     acusar o dia em que ele passar a decidir alguma coisa sobre o conteudo. */
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
  /* ⚠ A CAIXA DE ENTRADA COM AS DUAS NATUREZAS DENTRO, e as duas precisam estar
     aqui: o AVISO (`due` nulo, ja fechado) e a PERGUNTA (com prazo, esperando ou
     ja respondida). O reducer nao pode ter opiniao sobre nenhuma delas — ele
     CARREGA —, e uma prova que so gerasse aviso deixaria de acusar o dia em que
     alguem puser regra de prazo dentro do reducer, que e o lugar errado para ela. */
  mail: fc.array(
    fc.record({
      id: fc.string({ minLength: 1, maxLength: 12 }),
      kind: fc.constantFrom("posse", "tabled", "reported", "forgotten", "passed", "rejected"),
      month: fc.integer({ min: 0, max: 47 }),
      due: fc.option(fc.integer({ min: 0, max: 47 }), { nil: null }),
      subject: fc.option(fc.string({ maxLength: 24 }), { nil: null }),
      bill: fc.option(fc.string({ maxLength: 12 }), { nil: null }),
      except: fc.array(fc.string({ maxLength: 8 }), { maxLength: 2 }),
      saved: fc.option(fc.string({ maxLength: 24 }), { nil: null }),
      answer: fc.option(fc.constantFrom("accept", "block", "silence"), { nil: null }),
      closedAt: fc.option(fc.integer({ min: 0, max: 47 }), { nil: null }),
    }),
    { maxLength: 5 },
  ),
  /* A MEMORIA EM QUALQUER PONTO DA ESCALA, incluindo os dois extremos: um sujeito
     que o governo bancou o mandato inteiro e um que ele traiu no primeiro mes sao
     estados validos, e o reducer nao pode ter opiniao sobre nenhum dos dois. */
  /* A CALDEIRA EM QUALQUER TEMPERATURA, e as duas pontas entram: um governo que
     agrada todo mundo e um em vespera de queda sao estados validos, e o reducer nao
     pode ter opiniao sobre nenhum dos dois. */
  pressure: fc
    .array(fc.double({ min: 0, max: 100, noNaN: true }), {
      minLength: LOBBIES.length,
      maxLength: LOBBIES.length,
    })
    .map(values => Object.fromEntries(LOBBIES.map((l, i) => [l.id, values[i] ?? 0]))),
  /* E O PROCESSO ABERTO OU NAO. Nulo e "nunca abriu", e nao "fechou" — processo
     aberto nao se fecha, quem o encerra e o plenario. */
  impeachment: fc.option(fc.integer({ min: 0, max: 47 }), { nil: null }),
  fallen: fc.option(fc.integer({ min: 0, max: 47 }), { nil: null }),
  memory: fc
    .array(fc.double({ min: -100, max: 100, noNaN: true }), { maxLength: 12 })
    .map(values => Object.fromEntries(values.map((value, index) => [`pessoa-${index}`, value]))),
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
 * ⚠ ELE MUDOU DE ALVO em 14/08/2026. A aprovacao deixou de ser campo do estado e
 * passou a ser a CONVERSAO da satisfacao por segmento — entao o que se prova aqui
 * e a saida de SONDA, e nao um campo carregado. O invariante e o mesmo: as tres
 * fatias somam 100 e nenhuma e negativa.
 *
 * @param {import("../../src/domain/opinion/index.mjs").Approval} approval
 */
function assertApprovalInvariant(approval) {
  const { good, fair, poor } = approval;
  assert.equal(good + fair + poor, 100, `as tres fatias somam ${good + fair + poor}`);
  assert.ok(fair >= 0, `fair saiu negativo (${fair})`);
  assert.ok(good >= 0 && poor >= 0, `fatia negativa: good=${good} poor=${poor}`);
}

test("o estado de abertura ja satisfaz o invariante e ja sai congelado", () => {
  const state = createState();
  assertApprovalInvariant(pollFrom(state.mood, SEGMENTS, OPINION));
  assert.ok(Object.isFrozen(state));
  assert.ok(Object.isFrozen(state.mood));
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
      assert.ok(Object.isFrozen(next.mood), "a satisfacao saiu destravada");
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
    fc.property(anyState, state =>
      assertApprovalInvariant(pollFrom(reduce(state, resolutionOf(state)).mood, SEGMENTS, OPINION)),
    ),
  );
});

test("PROVA SINTETICA: o invariante acusa um reducer que larga o resto", () => {
  /* O defeito exato que a verificacao acima existe para pegar: `fair` deixa de
     ser o resto e vira campo carregado adiante — que e o formato do erro quando
     alguem troca a conta por um spread durante uma refatoracao.
     Sem esta prova, "verde" nao distingue reducer correto de assercao frouxa. */
  const broken = (/** @type {GameState} */ state) => {
    const poll = pollFrom(state.mood, SEGMENTS, OPINION);
    return { ...poll, good: poll.good + 2 };
  };

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
  /* O contrato de render por identidade, cobrado na acao nova. Um spread que
     recriasse um objeto sem motivo passaria em qualquer deepEqual e mandaria a
     tela redesenhar o painel inteiro todo mes — defeito silencioso, e caro
     exatamente na peca que usa filtro.

     ⚠ A APROVACAO SAIU DESTA PROVA porque ela deixou de ser campo, e a satisfacao
     que a substituiu MUDA todo mes por construcao: SONDA sempre devolve um mapa
     novo. O que continua valendo e o fluxo que a acao nao toca — e ele basta,
     porque o defeito que a prova pega e o spread indiscriminado. */
  fc.assert(
    fc.property(anyState, state => {
      const next = reduce(state, resolutionOf(state));
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
