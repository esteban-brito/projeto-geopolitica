/* SUITE · AS TELAS — views puras, provadas sem navegador.
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE ELA EXISTE, e o motivo tem data. As views devolvem TEXTO, e texto que
   o navegador vai interpretar. Um numero escrito no formato errado dentro de um
   atributo nao quebra nada em Node, nao aparece em nenhum tipo, nao derruba
   guarda nenhuma e nao suja o console: ele muda o comportamento do controle na
   tela, em silencio.

   Foi exatamente o que aconteceu com o controle de alocacao. `num` escreve
   virgula decimal — `max="25,04"` —, e virgula num atributo numerico e valor
   invalido. O navegador descartou os dois atributos e usou o padrao dele: teto
   100 e valor no MEIO da faixa. O controle abria em 50 enquanto o modelo o dava
   como zero, e a unica pista era um controle que "comeca no meio".

   As tres provas aqui cobrem a classe inteira desse defeito, e nao so o caso:
   todo atributo numerico de toda tela, em varias posicoes de jogo. */

import assert from "node:assert/strict";
import test from "node:test";
import { CATALOG } from "../../src/data/catalog.mjs";
import { quorumOf } from "../../src/data/bills.mjs";
import { THRESHOLDS, dispersion, whipCount } from "../../src/domain/congress/index.mjs";
import { discretionaryRoom, ledger, playMonth } from "../../src/application/turn.mjs";
import { createState } from "../../src/state/state.mjs";
import { PROGRAMS } from "../../src/data/programs.mjs";
import { areaHtml } from "../../src/ui/screens/area.mjs";
import { financeHtml } from "../../src/ui/screens/finance.mjs";
import { capacityStripHtml, mesaHtml } from "../../src/ui/screens/mesa.mjs";

const { areas, bills, parties, fiscal } = CATALOG;

/** @param {number} level */
function everyone(level) {
  return Object.fromEntries(parties.map(party => [party.id, level]));
}

/**
 * A Mesa como o entrypoint a monta.
 *
 * @param {import("../../src/data/bills.mjs").Bill | null} bill
 * @param {Record<string, number>} funding
 */
function mesaOf(bill, funding = everyone(0.4)) {
  const state = createState(7);
  const voting = bill !== null && bill.instrument !== "decree";

  return mesaHtml({
    bill,
    areaLabel: areas.find(area => area.id === bill?.area)?.label ?? "",
    quorum: bill ? quorumOf(bill) : 0,
    parties,
    loyalty: state.loyalty,
    funding,
    forecast: voting ? whipCount({ bill, parties, funding, loyalty: state.loyalty }) : null,
    band: dispersion({ parties, loyalty: state.loyalty }),
    seatPrice: fiscal.seatPrice,
    room: discretionaryRoom(state),
    demand: 15.75,
    thresholds: THRESHOLDS,
  });
}

/**
 * Uma area como o entrypoint a monta.
 *
 * @param {import("../../src/data/areas.mjs").Area} area
 * @param {number} spent bilhoes que esta area consome no mes
 * @param {Record<string, number>} [levels] niveis fora do vigente, quando a prova quiser
 */
function areaOf(area, spent, levels = {}) {
  const state = createState(7);
  const value = state.capacity.index[area.id] ?? area.initial;

  return areaHtml({
    area,
    value,
    history: state.capacity.history[area.id] ?? [],
    programs: PROGRAMS.filter(program => program.area === area.id),
    levels: { ...state.levels, ...levels },
    spent,
    room: discretionaryRoom(state),
    committed: 3.25,
    projected: value - area.decay + area.yield * spent,
    idle: value - area.decay,
  });
}

/**
 * O painel de Financas como o entrypoint o monta.
 *
 * @param {number} months quantos meses correram antes de olhar o placar
 * @param {Partial<import("../../src/state/state.mjs").Series>} [series] serie forjada
 */
function financeOf(months, series = {}) {
  let state = createState(7);
  for (let i = 0; i < months; i++) state = playMonth(state).state;

  const { budget, interest, debt, debtRatio } = ledger(state);

  return financeHtml({
    macro: state.macro,
    budget,
    interest,
    debt,
    debtRatio,
    series: { ...state.series, ...series },
    target: CATALOG.macro.inflationTarget,
    areas,
    index: state.capacity.index,
    history: state.capacity.history,
  });
}

/* `min`, `max`, `step` e `value` sao os quatro atributos que o navegador lê como
   NUMERO. Nenhum outro atributo do projeto entra aqui — `data-*` e `aria-*` sao
   texto por definicao. */
const NUMERIC_ATTRIBUTE = /\s(?:min|max|step|value)="([^"]*)"/g;

/* A COLUNA DE TENDENCIA do placar, com o conteudo — que pode ser vazio, e o vazio
   e informacao: serie curta demais nao vira escada. */
const SPARK = /class="ledger__spark"[^>]*>([^<]*)</g;

/** @param {string} html @param {string} where */
function assertNumericAttributes(html, where) {
  let found = 0;
  for (const hit of html.matchAll(NUMERIC_ATTRIBUTE)) {
    const raw = hit[1] ?? "";
    found++;
    assert.ok(
      raw.length > 0 && Number.isFinite(Number(raw)),
      `${where}: o atributo numerico recebeu "${raw}", que o navegador descarta em silencio`,
    );
  }
  return found;
}

test("TODO ATRIBUTO NUMERICO E LEGIVEL PELO NAVEGADOR, em qualquer posicao de jogo", () => {
  let checked = 0;

  /* A Mesa, com e sem pauta, e com verba em fracao quebrada — que e o caso que
     produz decimal no atributo. */
  for (const bill of [null, ...bills.slice(0, 8)]) {
    checked += assertNumericAttributes(mesaOf(bill, everyone(0.37)), `mesa ${bill?.id ?? "vazia"}`);
  }

  /* As seis areas, com alocacoes que nao sao redondas. */
  for (const area of areas) {
    for (const allocation of [0, 1.05, 7.3333, 24.99]) {
      checked += assertNumericAttributes(areaOf(area, allocation), `area ${area.id}`);
    }
  }

  checked += assertNumericAttributes(
    capacityStripHtml({
      areas,
      index: Object.fromEntries(areas.map(area => [area.id, 61.4])),
      history: {},
    }),
    "faixa de indices",
  );

  /* A prova so vale se ela tiver achado atributos para conferir: uma view que
     parasse de emitir controles passaria vazia, e passar vazia e a forma mais
     comum de uma suite morrer sem ninguem ver. */
  assert.ok(checked > 100, `so ${checked} atributos numericos conferidos — a suite ficou cega`);
});

test("o indice escrito em estilo inline tambem e numero, e nao texto localizado", () => {
  const html = capacityStripHtml({
    areas,
    index: Object.fromEntries(areas.map(area => [area.id, 48.6])),
    history: {},
  });

  const values = [...html.matchAll(/--index:\s*([^"';]+)/g)].map(hit => hit[1] ?? "");
  assert.equal(values.length, areas.length);
  for (const value of values) {
    assert.ok(
      Number.isFinite(Number(value)),
      `--index recebeu "${value}", e `.concat("`calc(1% * var(--index))` so aceita numero"),
    );
  }
});

test("o PLACAR so aparece quando existe votacao", () => {
  /* Sem pauta nao ha previsao, e uma previsao vazia no maior degrau da escala
     ocupa a tela inteira para dizer "nada". Com caneta tambem nao ha: decreto
     nao vai a plenario, e mostrar um placar de zero seria afirmar uma derrota
     que nao existe. */
  const decree = bills.find(bill => bill.instrument === "decree");
  const law = bills.find(bill => bill.instrument === "law");
  assert.ok(decree && law, "o catalogo perdeu um dos instrumentos");

  assert.ok(!mesaOf(null).includes("tally__forecast"), "a mesa vazia mostrou placar");
  assert.ok(!mesaOf(decree).includes("tally__forecast"), "a caneta mostrou placar");
  assert.ok(mesaOf(law).includes("tally__forecast"), "a lei nao mostrou placar");

  /* E o veredito so se veste de aprovado ou reprovado quando ha o que aprovar. */
  assert.ok(!mesaOf(null).includes("data-passes"), "a mesa vazia deu veredito de votacao");
});

test("O PLACAR NAO OFERECE NADA PARA MEXER, e essa e a informacao principal dele", () => {
  /* A unica tela do jogo sem um controle, e a ausencia precisa ser verdadeira no
     HTML e nao so na intencao: um `<input>` que entrasse aqui por reuso de
     componente daria ao jogador um controle que nao muda nada — pior do que nao
     ter, porque ele so descobre depois de arrastar. */
  for (const months of [0, 1, 7]) {
    const html = financeOf(months);
    assert.ok(!html.includes("<input"), `o placar do mes ${months} emitiu um controle`);
    assert.ok(!html.includes("<button"), `o placar do mes ${months} emitiu um botao`);
    assert.equal(assertNumericAttributes(html, `financas mes ${months}`), 0);
  }
});

test("NENHUM NUMERO DO PLACAR SAI QUEBRADO, em partida nova ou em andamento", () => {
  /* `NaN`, `undefined` e `Infinity` atravessam template literal sem lancar e
     chegam a tela como texto. Numa tela densa de dezenove linhas, um deles se
     esconde entre os outros dezoito — e o painel e justamente a tela em que o
     jogador nao tem como conferir nada por fora. */
  for (const months of [0, 1, 12]) {
    const html = financeOf(months);
    for (const rot of ["NaN", "undefined", "Infinity"]) {
      assert.ok(!html.includes(rot), `o placar do mes ${months} mostrou "${rot}"`);
    }
  }

  /* A partida recem-aberta tem serie VAZIA, e o painel nao pode desenhar escada
     nenhuma nela: um degrau solitario lê como sujeira de renderizacao, e seis
     iguais afirmam uma estabilidade que ninguem observou ainda. */
  const sparks = [...financeOf(0).matchAll(SPARK)].map(hit => hit[1] ?? "");
  assert.ok(sparks.length > 0, "o painel parou de emitir a coluna de tendencia");
  assert.ok(
    sparks.every(spark => spark === ""),
    "o painel desenhou tendencia sem passado",
  );
});

test("A ESCADA LE CADA INDICADOR NA REGUA DELE, e nao na do indice de area", () => {
  /* ⚠ ESTA PROVA PRENDE UM DEFEITO QUE JA ESTEVE NA TELA. `sparkline` nasceu para
     indice de 0 a 100 e o painel passou a desenhar com ela inflacao (0,042), juro
     (0,105) e divida sobre PIB (0,78): contra aquela regua, os tres viravam o
     degrau do chao em toda partida, para sempre. A serie existia, o motor estava
     certo, e a escada afirmava que nada nunca acontece — que e a mentira mais
     cara possivel numa tela que so serve para mostrar o que aconteceu. */
  const html = financeOf(0, {
    inflation: [0.02, 0.035, 0.05, 0.07, 0.09, 0.12],
    rate: [0.09, 0.1, 0.11, 0.13, 0.16, 0.19],
    debtRatio: [0.7, 0.74, 0.78, 0.83, 0.89, 0.96],
  });

  const varied = [...html.matchAll(SPARK)]
    .map(hit => hit[1] ?? "")
    .filter(spark => new Set(spark).size > 1);

  assert.equal(
    varied.length,
    3,
    `${varied.length} das tres series macro subiram na escada — o resto ficou plano na regua errada`,
  );
});

test("o rotulo do catalogo e ESCAPADO, e o catalogo e dado editavel", () => {
  /* Nomes de pauta e de bancada sao dado, e dado vai ser editado por gente. Um
     `<` que atravesse a view nao e so um defeito de desenho: e injecao de marcacao
     a partir de um arquivo que qualquer sessao futura vai mexer. */
  const bill = bills[0];
  assert.ok(bill);

  const html = mesaOf({ ...bill, label: '<img src=x onerror="alert(1)">' });

  assert.ok(!html.includes("<img"), "o rotulo da pauta entrou como marcacao");
  assert.ok(html.includes("&lt;img"), "o rotulo nao foi escapado");
});
