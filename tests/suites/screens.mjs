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
import { discretionaryRoom } from "../../src/application/turn.mjs";
import { createState } from "../../src/state/state.mjs";
import { areaHtml } from "../../src/ui/screens/area.mjs";
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
 * @param {number} allocation
 * @param {ReadonlyArray<string>} enacted
 */
function areaOf(area, allocation, enacted = []) {
  const state = createState(7);
  const value = state.capacity.index[area.id] ?? area.initial;

  return areaHtml({
    area,
    value,
    history: state.capacity.history[area.id] ?? [],
    available: bills.filter(bill => bill.area === area.id && !enacted.includes(bill.id)),
    standing: bills.filter(bill => bill.area === area.id && enacted.includes(bill.id)),
    quorumOf,
    onTable: null,
    allocation,
    room: discretionaryRoom(state),
    committed: 3.25,
    projected: value - area.decay + area.yield * allocation,
    idle: value - area.decay,
  });
}

/* `min`, `max`, `step` e `value` sao os quatro atributos que o navegador lê como
   NUMERO. Nenhum outro atributo do projeto entra aqui — `data-*` e `aria-*` sao
   texto por definicao. */
const NUMERIC_ATTRIBUTE = /\s(?:min|max|step|value)="([^"]*)"/g;

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
