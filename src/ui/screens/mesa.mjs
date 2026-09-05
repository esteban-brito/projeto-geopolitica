/* A MESA — onde o mes se resolve. */

import { escapeHtml } from "../shared/html.mjs";
import { money, percent, seats, signed, sparkline } from "../shared/format.mjs";
import { WINDOW, directionOf, trendOf } from "../shared/trend.mjs";
import { iconHtml } from "../shared/icons.mjs";
import { headHtml } from "../shared/head.mjs";
import { sigilHtml } from "../shared/sigil.mjs";
import { UI, labelOf } from "../strings.mjs";

/**
 * @typedef {import("../../data/areas.mjs").Area} Area
 * @typedef {import("../../application/agenda.mjs").Proposal} Bill
 * @typedef {import("../../data/parties.mjs").Party} Party
 * @typedef {import("../../domain/congress/index.mjs").Forecast} Forecast
 */

/* O estado de humor de uma bancada, como a tela o nomeia. */

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
 * @param {object} input
 * @param {ReadonlyArray<Area>} input.areas
 * @param {Record<string, number>} input.index
 * @param {Record<string, number[]>} input.history
 * @param {Record<string, "watch" | "alert">} [input.alerts] a queda desde a posse, por area
 * @returns {string}
 */
export function capacityStripHtml({ areas, index, history, alerts = {} }) {
  const gauges = areas
    .map(area => {
      const value = index[area.id] ?? area.initial;
      const past = history[area.id] ?? [];
      /* A JANELA E A MESMA DAS OUTRAS DUAS TELAS — ver `WINDOW`, em `shared/trend.mjs`. */
      const trend = sparkline(past.length > 0 ? past : [value], WINDOW);
      /* ⚠ A DIRECAO E A MESMA CONTA DAS OUTRAS DUAS TELAS, e ela vem de `trendOf`: refeita
         aqui, a faisca discordaria da seta do Gabinete no primeiro mes de empate. */
      const moved = trendOf(value, past);
      const direction = moved === null ? null : directionOf(value, value - moved.delta, 1);
      /* ⚠ A COR E DO MANDATO, E NAO DO NIVEL: Seguranca abre em 38, e pintar por nivel
         acusaria o jogador de um pais que ele herdou. `alertsOf` mede a distancia de
         `initial`, e e o MESMO motor que o rail le. */
      const alert = alerts[area.id];

      return (
        `<button class="capacity" type="button" data-section="${escapeHtml(area.id)}"` +
        (alert ? ` data-alert="${alert}"` : "") +
        `>` +
        /* O NOME CURTO, pela mesma razao do rail: a faixa da 117px por area. */
        `<span class="capacity__label">` +
        iconHtml(area.id, "capacity__icon") +
        `<span class="capacity__name">${escapeHtml(area.short ?? area.label)}</span>` +
        `</span>` +
        /* ⚠ O QUE A AREA MEDE ESTAVA NO CATALOGO E NAO NA TELA: oito blocos diziam so o nome
           do ministerio, e o numero grande ao lado nao dizia numero DE QUE. */
        `<span class="capacity__index">${escapeHtml(area.index)}</span>` +
        `<span class="capacity__read">` +
        `<span class="capacity__value" data-numeric>${seats(value)}</span>` +
        `<span class="capacity__trend"` +
        (direction ? ` data-direction="${direction}"` : "") +
        ` aria-hidden="true">${trend}</span>` +
        `</span>` +
        `<span class="capacity__track" style="--index:${seats(value)}" aria-hidden="true"></span>` +
        `</button>`
      );
    })
    .join("");

  /* Ela era `glass-support` porque morava solta no tabuleiro, ao lado da mesa; agora ela e um
     BLOCO dentro da lamina do Congresso, e vidro dentro de vidro e o defeito que o sistema
     visual inteiro existe para impedir. */
  return `<div class="capacities">${gauges}</div>`;
}

/* ONDE A MEMORIA DEIXA DE SER RUIDO. */
const MEMORY_FLOOR = 0.08;

/**
 * UMA PESSOA DA BANCADA — e ela e a peca que faltava na tela inteira.
 *
 * @param {object} input
 * @param {{ id: string, name: string, office: string, role: string, ambition: string,
 * seats: number, votes: number, reach: number, memory: number, portfolio?: string,
 * gender?: "f" | "m" }} input.person
 * @param {boolean} input.voting
 * @returns {string}
 */
function personHtml({ person, voting }) {
  /* A afirmação é verdadeira e a conclusão estava errada, e a captura mostrou por quê: no mês
     1 NINGUÉM tem histórico, e a mesma frase saía **uma vez por pessoa na mesma tela**, uma
     debaixo da outra, sob nomes diferentes. */
  const memory =
    person.memory > MEMORY_FLOOR
      ? { tone: "good", text: UI.congress.memoryGood }
      : person.memory < -MEMORY_FLOOR
        ? { tone: "poor", text: UI.congress.memoryBad }
        : null;

  /* A PASTA VEM NOMEADA DO MOTOR, e o generico e o que sobra quando ela nao veio: a tela nao
     escolhe ministerio, ela imprime o que o sorteio deu. */
  const ambition = person.portfolio
    ? `${UI.congress.cabinetOf} ${person.portfolio}`
    : labelOf(UI.congress.ambition, person.ambition);

  const cost = labelOf(UI.congress.ambitionPrice, person.ambition);
  const price = cost ? ` <em>— ${escapeHtml(cost)}</em>` : "";

  return (
    `<div class="person" data-office="${escapeHtml(person.office)}">` +
    sigilHtml({
      name: person.name,
      office: person.office,
      reach: person.reach,
      role: person.role,
      ...(person.gender ? { gender: person.gender } : {}),
    }) +
    `<span class="person__who">` +
    `<b class="person__name">${escapeHtml(person.name)}</b>` +
    `<span class="person__role">${escapeHtml(labelOf(UI.congress.office, person.office))}</span>` +
    `</span>` +
    `<span class="person__note">` +
    `<span class="person__ambition">${escapeHtml(ambition)}${price}</span>` +
    (memory
      ? `<span class="person__memory" data-tone="${memory.tone}">${escapeHtml(memory.text)}</span>`
      : "") +
    `</span>` +
    `<span class="person__votes" data-numeric>` +
    (voting
      ? `${seats(person.votes)} <small>${escapeHtml(UI.mesa.seats)} ${seats(person.seats)}</small>`
      : `<small>${escapeHtml(UI.mesa.leads)}</small> ${seats(person.seats)}`) +
    `</span>` +
    `</div>`
  );
}

/**
 * A LINHA DE UMA BANCADA.
 *
 * @param {object} input
 * @param {Party} input.party
 * @param {number} input.loyalty
 * @param {number} input.funding de 0 a 1
 * @param {number} input.votes
 * @param {number} input.seatPrice
 * @param {{ obstruction: number, rupture: number }} input.thresholds
 * @param {boolean} input.voting
 * @param {boolean} [input.own] - a bancada que elegeu o presidente
 * @param {ReadonlyArray<Parameters<typeof personHtml>[0]["person"]>} [input.people]
 */
function benchHtml({
  party,
  loyalty,
  funding,
  votes,
  seatPrice,
  thresholds,
  voting,
  own = false,
  people = [],
}) {
  const mood = moodOf(loyalty, thresholds);

  /* O CONTROLE FICA FORA DA PARTE QUE SE REPINTA, e isso e requisito de gesto e nao de
     organizacao: trocar o HTML de um `<input type=range>` no meio de um arrasto ARRANCA o
     elemento que o ponteiro esta segurando, e o arrasto morre no primeiro pixel. */
  return (
    `<div class="bench" data-mood="${mood}" data-party="${escapeHtml(party.id)}"` +
    (own ? ` data-own="true"` : "") +
    `>` +
    /* "Partido Social Municipalista" numa coluna de 96px quebra em tres linhas e empurra a
       linha inteira; a sigla cabe sempre e e como um Congresso de verdade se cita. */
    `<span class="bench__name"><b>${escapeHtml(party.sigla)}</b>` +
    /* ⚠ A MARCA SUBSTITUI O NOME LONGO, e nao se soma a ele: a coluna tem 96px, e "Partido
       Social Municipalista · o seu partido" nao cabe em duas linhas. */
    `<small>${escapeHtml(own ? UI.mesa.ownParty : party.label)}</small></span>` +
    `<span class="bench__mood" data-numeric title="${escapeHtml(UI.mood[mood])}">` +
    `${seats(loyalty)}<i aria-hidden="true"></i></span>` +
    `<input class="bench__slider" type="range" min="0" max="100" step="5" ` +
    `value="${Math.round(funding * 100)}" data-party="${escapeHtml(party.id)}" ` +
    `aria-label="${escapeHtml(`${UI.mesa.funding} — ${party.label}`)}" />` +
    `<span class="bench__read" data-read="${escapeHtml(party.id)}">` +
    benchReadHtml({ party, funding, votes, seatPrice, voting }) +
    `</span>` +
    /* ── A GENTE MORA DENTRO DO BLOCO, e a aninhagem e a mecanica ────────────── Voce paga o
       BLOCO; o bloco e feito de gente; a gente entrega diferente. */
    (people.length > 0
      ? `<div class="bench__people">` +
        people.map(person => personHtml({ person, voting })).join("") +
        `</div>`
      : "") +
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
 * @param {Record<string, number>} input.byBloc votos que cada BLOCO entrega, ja somados
 * @param {ReadonlyArray<{ id: string,
 * people: ReadonlyArray<Parameters<typeof personHtml>[0]["person"]> }>} input.blocs
 * os blocos com a GENTE dentro, montados pela camada de aplicacao
 * @param {number} input.band
 * @param {number} input.seatPrice
 * @param {number} input.room o discricionario que cabe no mes
 * @param {number} input.demand tudo o que foi prometido no mes — emenda e areas
 * @param {{ obstruction: number, rupture: number }} input.thresholds
 * @param {string | null} [input.ruling] - a bancada que elegeu o presidente
 * @returns {string}
 */
export function mesaHtml(input) {
  const { bill, forecast, quorum } = input;
  const voting = quorum > 0 && forecast !== null;

  /* ⚠ O SOBRANCELHO "EM PAUTA" SAIU DAQUI e ele saiu por um defeito que a captura pegou no
     mesmo dia em que ele nasceu. */
  const head = bill
    ? `<h2 class="mesa__title">${escapeHtml(bill.label)}</h2>` +
      `<p class="mesa__meta">` +
      `<span class="badge" data-instrument="${escapeHtml(bill.instrument)}">` +
      `${escapeHtml(labelOf(UI.instrument, bill.instrument))}</span>` +
      `<span>${escapeHtml(input.areaLabel)}</span>` +
      `<span>${escapeHtml(labelOf(UI.instrumentHint, bill.instrument))}` +
      (voting ? ` · ${seats(quorum)}` : "") +
      `</span>` +
      `<span>${escapeHtml(UI.mesa.result)} ` +
      `${signed(bill.fiscalImpact, 1)}${escapeHtml(UI.area.perYear)}</span>` +
      `<button class="mesa__swap" type="button" data-section="${escapeHtml(bill.area)}">` +
      `${escapeHtml(UI.mesa.swap)}</button>` +
      `</p>`
    : /* O VAZIO USA A PECA DE VAZIO, e nao um paragrafo com outro nome. Ele era
         `mesa__eyebrow` + `mesa__meta` — as mesmas classes do TITULO de uma pauta
         real —, entao "Nada em pauta" saia com o peso de um assunto em discussao. O
         Gabinete ja tinha a forma certa para isto: chamada centrada respondendo
         "isto esta quebrado?", e a prosa embaixo respondendo "por que?". Uma forma
         so para os dois estados vazios do jogo. */
      `<div class="empty">` +
      `<p class="empty__lead">${escapeHtml(UI.mesa.empty)}</p>` +
      `<p class="empty__note">${escapeHtml(UI.mesa.emptyHint)}</p>` +
      `</div>`;

  /* ⚠ OS VOTOS DA LINHA VEM SOMADOS DO MOTOR. */
  const peopleOf = new Map(input.blocs.map(bloc => [bloc.id, bloc.people]));

  const benches = input.parties
    .map(party =>
      benchHtml({
        party,
        loyalty: input.loyalty[party.id] ?? 0,
        funding: input.funding[party.id] ?? 0,
        votes: input.byBloc[party.id] ?? 0,
        seatPrice: input.seatPrice,
        thresholds: input.thresholds,
        voting,
        own: party.id === input.ruling,
        people: peopleOf.get(party.id) ?? [],
      }),
    )
    .join("");

  /* O RESUMO E UMA REGIAO VIVA, e por uma razao de teclado: quem move o controle com as setas
     nao ve o placar mudar de canto de olho — ele precisa ouvir. */
  return (
    `<section class="mesa">` +
    `<div class="mesa__head">${head}</div>` +
    `<div class="mesa__benches">${benches}</div>` +
    `<div class="tally" id="tally" aria-live="polite">${tallyHtml(input)}</div>` +
    `</section>`
  );
}

/**
 * A GAVETA — o que esta andando, e ha quanto tempo.
 *
 * @param {ReadonlyArray<{ id: string, label: string, stage: string, waiting: number,
 * expires: number | null, instrument: string, quorum: number, saved: string | null }>} bills
 * @param {ReadonlyArray<string>} [stages] o caminho em ordem, e ele vem do motor
 * @returns {string}
 */
export function passageHtml(bills, stages = []) {
  if (bills.length === 0) {
    return (
      `<div class="empty">` +
      `<p class="empty__lead">${escapeHtml(UI.congress.passageEmpty)}</p>` +
      `<p class="empty__note">${escapeHtml(UI.congress.passageNote)}</p>` +
      `</div>`
    );
  }

  const rows = bills
    .map(bill => {
      const clock =
        bill.expires !== null && bill.expires <= 3
          ? `<span class="passage__clock">${escapeHtml(UI.congress.expires)} ` +
            `<b data-numeric>${seats(bill.expires)}</b></span>`
          : "";

      /* ⚠ O ESTAGIO ERA UMA PALAVRA, e uma palavra nao diz que ha um CAMINHO: o jogador lia
         "na gaveta" sem saber que faltam dois passos nem quanto ja andou. Os degraus vem do
         motor em ordem, entao um quarto estagio aparece aqui sozinho. */
      const at = stages.indexOf(bill.stage);
      const path = stages
        .map((step, index) => {
          const state = index < at ? "past" : index === at ? "now" : "next";
          return `<span class="passage__step" data-step="${state}"></span>`;
        })
        .join("");

      return (
        `<div class="passage__row" data-stage="${escapeHtml(bill.stage)}">` +
        `<span class="passage__stage">` +
        (path ? `<span class="passage__path" aria-hidden="true">${path}</span>` : "") +
        `<span class="passage__where">${escapeHtml(labelOf(UI.congress.stage, bill.stage))}</span>` +
        `</span>` +
        `<span class="passage__what">` +
        `<b class="passage__label">${escapeHtml(bill.label)}</b>` +
        (bill.saved
          ? `<span class="passage__saved">${escapeHtml(UI.congress.savedBy)} ` +
            `${escapeHtml(bill.saved)}</span>`
          : "") +
        `</span>` +
        `<span class="badge" data-instrument="${escapeHtml(bill.instrument)}">` +
        `${escapeHtml(labelOf(UI.instrument, bill.instrument))}</span>` +
        `<span class="passage__wait" data-numeric>` +
        `${escapeHtml(UI.congress.waiting)} ${seats(bill.waiting)}${clock ? "" : ""}</span>` +
        clock +
        `</div>`
      );
    })
    .join("");

  return `<div class="passage">${rows}</div>`;
}

/**
 * @param {object} input
 * @param {string} input.gauges
 * @param {string} input.mesa
 * @param {string} input.report
 * @param {string} input.passage
 */
export function congressHtml({ gauges, mesa, report, passage }) {
  /* A MESMA CASCA DE BLOCO DE FINANCAS E DA AREA, e nao uma terceira: legenda em versalete e
     o corpo embaixo. */
  const block = (/** @type {string} */ legend, /** @type {string} */ body) =>
    `<section class="area__block">` +
    `<h3 class="block__legend">${escapeHtml(legend)}</h3>` +
    body +
    `</section>`;

  return (
    `<section class="area glass-stage">` +
    headHtml({ title: UI.nav.congress }) +
    block(UI.congress.country, gauges) +
    block(UI.congress.agenda, mesa) +
    block(UI.congress.passage, passage) +
    block(UI.report.panel, report) +
    `</section>`
  );
}

/**
 * O RESUMO — a parte que se repinta a cada movimento do controle.
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

  /* SEM VOTACAO NAO HA PLACAR, e entao nao ha linha de placar. */
  /* ⚠ O PLACAR MUDOU DE TEMPO, E A TELA TEM DE DIZER ISSO. */
  const call = voting
    ? `<p class="tally__forecast" data-numeric>` +
      `${seats(forecast.votes)} <span class="tally__band">± ${seats(band)}</span> ` +
      `<small>${escapeHtml(UI.mesa.needs)} ${seats(quorum)}</small></p>` +
      `<p class="tally__verdict" data-passes="${forecast.votes >= quorum}">` +
      `${escapeHtml(forecast.votes >= quorum ? UI.mesa.above : UI.mesa.below)}</p>` +
      `<p class="tally__when">${escapeHtml(UI.congress.willFile)} · ` +
      `${escapeHtml(UI.congress.forecastLater)}</p>`
    : /* ⚠ SEM PAUTA, O PLACAR NAO REPETE O ESTADO VAZIO. Esta linha imprimia
         `UI.mesa.emptyHint` — "escolha uma ação numa das áreas" —, que e
         EXATAMENTE a frase que o vazio do bloco acima ja diz, e a captura do
         celular pegou as duas na mesma tela, com pesos diferentes. E o segundo
         defeito desta familia no mesmo dia: quem nomeia uma ausencia e o lugar
         onde ela acontece, e uma vez so.
         O DECRETO CONTINUA SENDO DITO, porque ali ha pauta e nao ha votacao — e
         "vale sem passar pelo plenario" e informacao que nenhum outro lugar da. */
      bill
      ? `<p class="tally__verdict">${escapeHtml(UI.mesa.decree)}</p>`
      : "";

  const fits = demand <= room + 1e-9;

  return (
    call +
    `<p class="tally__cash" data-fits="${fits}">` +
    `${escapeHtml(UI.mesa.promises)} <b data-numeric>${money(demand)}</b> · ` +
    `${escapeHtml(fits ? UI.mesa.fits : UI.mesa.over)} <b data-numeric>${money(room)}</b>` +
    `</p>`
  );
}
