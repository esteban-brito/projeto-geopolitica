/* A MESA — onde o mes se resolve. Views PURAS.
   ══════════════════════════════════════════════════════════════════════════════
   Nenhuma funcao daqui toca o DOM, lê o relogio ou guarda estado. Elas recebem
   dado e devolvem string. Quem aplica ao documento e `app.mjs`.

   ── A TELA QUE NAO NAVEGA ────────────────────────────────────────────────────
   Um turno inteiro se decide aqui. As areas sao onde se vai quando se QUER
   olhar; a Mesa e onde se decide, e ela mostra de uma vez as tres coisas que a
   decisao precisa: o que esta em pauta, quanto cada bancada entrega com a verba
   oferecida ate agora, e se o caixa cobre o que foi prometido.

   ── `241 ± 14`, E NAO `241` ──────────────────────────────────────────────────
   A banda e a coisa mais importante desta tela. `241` afirma um placar que o
   motor nao promete: a previsao e deterministica e o DIA nao e. O jogador que
   confia no numero cru aprende a desconfiar da tela na primeira vez que perder
   por tres votos — e aprender a desconfiar da tela e o pior que uma interface de
   simulacao pode ensinar.

   Com a banda, a tela diz exatamente o que o modelo sabe: a tendencia e
   conhecida, o dia nao. E comprar mais verba ESTREITA a banda sem nunca zera-la,
   o que da ao jogador uma segunda coisa para comprar alem de votos.

   ── O QUE E CERTEZA E O QUE E RISCO ──────────────────────────────────────────
   Distincao deliberada, e ela aparece na hierarquia visual. O rateio e
   DETERMINISTICO: dada a promessa e a folga, o corte e uma conta, e a tela o
   afirma sem ressalva. O placar e SORTEADO: a tela mostra a faixa. Mostrar o
   rateio como "risco de 12%" inventaria incerteza que nao existe. */

import { escapeHtml } from "../shared/html.mjs";
import { money, percent, seats, signed, sparkline } from "../shared/format.mjs";
import { UI } from "../strings.mjs";

/**
 * @typedef {import("../../data/areas.mjs").Area} Area
 * @typedef {import("../../application/agenda.mjs").Proposal} Bill
 * @typedef {import("../../data/parties.mjs").Party} Party
 * @typedef {import("../../domain/congress/index.mjs").Forecast} Forecast
 */

/* O estado de humor de uma bancada, como a tela o nomeia. Os limiares chegam do
   motor: redigita-los aqui seria garantir que um dia a tela chame de
   "obstruindo" quem o motor ja trata como rompida. */
/**
 * O rotulo de um instrumento. Ele passa por aqui em vez de indexar direto porque
 * `bill.instrument` e texto vindo do catalogo, e catalogo e dado editavel: um
 * instrumento novo digitado errado tem de aparecer como o proprio id na tela, e
 * nao derrubar a pintura inteira.
 *
 * @param {Record<string, string>} table
 * @param {string} key
 */
function labelOf(table, key) {
  return table[key] ?? key;
}

/**
 * @param {number} loyalty
 * @param {{ obstruction: number, rupture: number }} thresholds
 */
function moodOf(loyalty, thresholds) {
  if (loyalty < thresholds.rupture) return "broken";
  if (loyalty < thresholds.obstruction) return "obstructing";
  return "loyal";
}

/**
 * A FAIXA DE INDICES — seis medidores, uma linha, sempre visivel.
 *
 * Ela existe para o jogador enxergar de relance a area que ele abandonou. Com
 * seis telas separadas, so se descobre clicando em seis lugares — e e assim que
 * um jogador deixa de olhar.
 *
 * TRES LEITURAS EM UM MEDIDOR, e cada uma responde uma pergunta diferente: o
 * NUMERO diz onde a area esta, a ESCADA diz para onde ela vem indo, e a BARRA
 * diz o que nenhum dos dois diz — de que lado do ponto neutro ela caiu. O ponto
 * neutro chega do catalogo pelo `--neutral`, que o entrypoint injeta: 50 e regra
 * de jogo, e nao valor de paleta.
 *
 * @param {object} input
 * @param {ReadonlyArray<Area>} input.areas
 * @param {Record<string, number>} input.index
 * @param {Record<string, number[]>} input.history
 * @returns {string}
 */
export function capacityStripHtml({ areas, index, history }) {
  const gauges = areas
    .map(area => {
      const value = index[area.id] ?? area.initial;
      const past = history[area.id] ?? [];
      const trend = sparkline(past.length > 0 ? past : [value]);

      return (
        `<button class="gauge" type="button" data-section="${escapeHtml(area.id)}">` +
        `<span class="gauge__label">${escapeHtml(area.label)}</span>` +
        `<span class="gauge__read">` +
        `<span class="gauge__value" data-numeric>${seats(value)}</span>` +
        `<span class="gauge__trend" aria-hidden="true">${trend}</span>` +
        `</span>` +
        `<span class="gauge__track" style="--index:${seats(value)}" aria-hidden="true"></span>` +
        `</button>`
      );
    })
    .join("");

  /* A FAIXA E UMA SUPERFICIE SO, com seis campos — e nao seis laminas
     enfileiradas. Caixa e peso, e seis pesos para dizer coisas do mesmo nivel e
     o ruido que a regra de forma dos componentes existe para impedir. */
  return `<div class="gauges glass-support">${gauges}</div>`;
}

/**
 * A LINHA DE UMA BANCADA. Ela carrega a historia inteira daquela bancada: humor,
 * estado, verba oferecida, custo e quantas cadeiras isso compra.
 *
 * @param {object} input
 * @param {Party} input.party
 * @param {number} input.loyalty
 * @param {number} input.funding de 0 a 1
 * @param {number} input.votes
 * @param {number} input.seatPrice
 * @param {{ obstruction: number, rupture: number }} input.thresholds
 * @param {boolean} input.voting
 */
function benchHtml({ party, loyalty, funding, votes, seatPrice, thresholds, voting }) {
  const mood = moodOf(loyalty, thresholds);

  /* O CONTROLE FICA FORA DA PARTE QUE SE REPINTA, e isso e requisito de gesto e
     nao de organizacao: trocar o HTML de um `<input type=range>` no meio de um
     arrasto ARRANCA o elemento que o ponteiro esta segurando, e o arrasto morre
     no primeiro pixel. Por isso a leitura numerica vive num filho proprio, que e
     o unico que a atualizacao ao vivo substitui. */
  return (
    `<div class="bench" data-mood="${mood}" data-party="${escapeHtml(party.id)}">` +
    `<span class="bench__name">${escapeHtml(party.label)}</span>` +
    `<span class="bench__mood" data-numeric title="${escapeHtml(UI.mood[mood])}">` +
    `${seats(loyalty)}<i aria-hidden="true"></i></span>` +
    `<input class="bench__slider" type="range" min="0" max="100" step="5" ` +
    `value="${Math.round(funding * 100)}" data-party="${escapeHtml(party.id)}" ` +
    `aria-label="${escapeHtml(`${UI.mesa.funding} — ${party.label}`)}" />` +
    `<span class="bench__read" data-read="${escapeHtml(party.id)}">` +
    benchReadHtml({ party, funding, votes, seatPrice, voting }) +
    `</span>` +
    `</div>`
  );
}

/**
 * A LEITURA de uma bancada: o que muda enquanto o controle e arrastado.
 *
 * @param {object} input
 * @param {Party} input.party
 * @param {number} input.funding
 * @param {number} input.votes
 * @param {number} input.seatPrice
 * @param {boolean} input.voting
 * @returns {string}
 */
export function benchReadHtml({ party, funding, votes, seatPrice, voting }) {
  const cost = funding * party.seats * seatPrice;

  return (
    `<span class="bench__share" data-numeric>${percent(funding)}</span>` +
    `<span class="bench__cost" data-numeric>${money(cost)}</span>` +
    `<span class="bench__votes" data-numeric>` +
    (voting ? `${seats(votes)} <small>${escapeHtml(UI.mesa.seats)} ${party.seats}</small>` : "—") +
    `</span>`
  );
}

/**
 * A MESA inteira.
 *
 * @param {object} input
 * @param {Bill | null} input.bill
 * @param {string} input.areaLabel
 * @param {number} input.quorum zero quando a acao nao vai a plenario
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.loyalty
 * @param {Record<string, number>} input.funding
 * @param {Forecast | null} input.forecast
 * @param {number} input.band
 * @param {number} input.seatPrice
 * @param {number} input.room o discricionario que cabe no mes
 * @param {number} input.demand tudo o que foi prometido no mes — emenda e areas
 * @param {{ obstruction: number, rupture: number }} input.thresholds
 * @returns {string}
 */
export function mesaHtml(input) {
  const { bill, forecast, quorum } = input;
  const voting = quorum > 0 && forecast !== null;

  const head = bill
    ? `<p class="mesa__eyebrow">${escapeHtml(UI.mesa.onTable)}</p>` +
      `<h2 class="mesa__title">${escapeHtml(bill.label)}</h2>` +
      `<p class="mesa__meta">` +
      `<span class="badge" data-instrument="${escapeHtml(bill.instrument)}">` +
      `${escapeHtml(labelOf(UI.instrument, bill.instrument))}</span>` +
      `<span>${escapeHtml(input.areaLabel)}</span>` +
      `<span>${escapeHtml(labelOf(UI.instrumentHint, bill.instrument))}` +
      (voting ? ` · ${seats(quorum)}` : "") +
      `</span>` +
      /* O NUMERO VEM ANTES DA UNIDADE, e com o sinal explicito: a versao
         anterior escrevia "/ano -34,0", que se lê como uma unidade seguida de um
         numero solto. E o menos e o tipografico, o mesmo da coluna da area —
         dois sinais de menos diferentes na mesma grandeza sao dois formatos de
         numero na mesma tela. */
      `<span>${escapeHtml(UI.mesa.result)} ` +
      `${signed(bill.fiscalImpact, 1)}${escapeHtml(UI.area.perYear)}</span>` +
      `<button class="mesa__swap" type="button" data-section="${escapeHtml(bill.area)}">` +
      `${escapeHtml(UI.mesa.swap)}</button>` +
      `</p>`
    : `<p class="mesa__eyebrow">${escapeHtml(UI.mesa.empty)}</p>` +
      `<p class="mesa__meta">${escapeHtml(UI.mesa.emptyHint)}</p>`;

  const benches = input.parties
    .map(party =>
      benchHtml({
        party,
        loyalty: input.loyalty[party.id] ?? 0,
        funding: input.funding[party.id] ?? 0,
        votes: forecast?.parties.find(item => item.partyId === party.id)?.votes ?? 0,
        seatPrice: input.seatPrice,
        thresholds: input.thresholds,
        voting,
      }),
    )
    .join("");

  /* O RESUMO E UMA REGIAO VIVA, e por uma razao de teclado: quem move o controle
     com as setas nao ve o placar mudar de canto de olho — ele precisa ouvir. Sao
     tres linhas curtas, entao o anuncio cabe entre um passo e o seguinte. */
  return (
    `<section class="mesa glass-stage">` +
    `<div class="mesa__head">${head}</div>` +
    `<div class="mesa__benches">${benches}</div>` +
    `<div class="tally" id="tally" aria-live="polite">${tallyHtml(input)}</div>` +
    `</section>`
  );
}

/**
 * O RESUMO — a parte que se repinta a cada movimento do controle.
 *
 * Ela separa CERTEZA de RISCO na propria hierarquia: a previsao vem com banda
 * porque o dia e sorteado; o dinheiro vem sem ressalva porque o rateio e uma
 * conta. Dizer "risco de rateio de 12%" inventaria incerteza que nao existe.
 *
 * @param {object} input
 * @param {Bill | null} input.bill
 * @param {number} input.quorum
 * @param {Forecast | null} input.forecast
 * @param {number} input.band
 * @param {number} input.room
 * @param {number} input.demand
 * @returns {string}
 */
export function tallyHtml({ bill, quorum, forecast, band, room, demand }) {
  const voting = quorum > 0 && forecast !== null;

  /* SEM VOTACAO NAO HA PLACAR, e entao nao ha linha de placar. A primeira versao
     punha um travessao no lugar do numero — no maior degrau da escala, um
     travessao de 4,5rem que ocupava a tela inteira para dizer "nada". E o
     veredito vinha marcado como APROVADO, entao "escolha uma acao numa das
     areas" chegava em verde de vitoria. Ausencia de pauta nao e aprovacao nem
     derrota: e ausencia, e a unica forma honesta de mostra-la e nao mostrar. */
  const call = voting
    ? `<p class="tally__forecast" data-numeric>` +
      `${seats(forecast.votes)} <span class="tally__band">± ${seats(band)}</span> ` +
      `<small>${escapeHtml(UI.mesa.needs)} ${seats(quorum)}</small></p>` +
      `<p class="tally__verdict" data-passes="${forecast.votes >= quorum}">` +
      `${escapeHtml(forecast.votes >= quorum ? UI.mesa.above : UI.mesa.below)}</p>`
    : `<p class="tally__verdict">${escapeHtml(bill ? UI.mesa.decree : UI.mesa.emptyHint)}</p>`;

  const fits = demand <= room + 1e-9;

  return (
    call +
    `<p class="tally__cash" data-fits="${fits}">` +
    `${escapeHtml(UI.mesa.promises)} <b data-numeric>${money(demand)}</b> · ` +
    `${escapeHtml(fits ? UI.mesa.fits : UI.mesa.over)} <b data-numeric>${money(room)}</b>` +
    `</p>`
  );
}
