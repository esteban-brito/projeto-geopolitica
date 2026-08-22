/* ECLUSA — congresso.
   recebe  bancadas, proposta, moeda oferecida, historico de barganha devolve votos por
   bancada, resultado, custo pago, ressentimento ── A SEPARACAO QUE FAZ A MECANICA Duas
   funcoes, e a divisao entre elas E o jogo: `whipCount` — a PREVISAO. */

import { unit } from "../../state/random.mjs";

/**
 * @typedef {import("../../data/parties.mjs").Party} Party
 * @typedef {import("../../state/random.mjs").Stream} Stream
 */

/**
 * O QUE ESTE MOTOR PRECISA SABER DE UMA PROPOSTA, e nada alem disso.
 *
 * realmente lê e o que fez a pauta derivada nascer sem o ECLUSA mudar uma linha.
 * @typedef {object} Motion
 * @property {number} economic - a posicao no eixo economico
 * @property {number} liberty - a posicao no eixo de liberdades
 * @property {number} threat - o quanto ela ataca a maquina
 * @property {number} [spread] - o RAIO da nuvem de movimentos em torno do centroide;
 * zero, ou ausente, e um texto coeso. Ver a prosa dentro de `whipCount`.
 */

/* Quanto a ameaca pesa, em unidades de resistencia. */
const THREAT_WEIGHT = 85;

/* A curva que traduz resistencia em adesao. */
const PIVOT = 58;
const SPREAD = 16;

/* A 25, um governo com 60% de otimo/bom derruba a resistencia em 5 pontos, e um com 10% a
   levanta em 10. */
const STANDING_WEIGHT = 25;

/* Ele NAO e 50 de proposito — 35% de otimo/bom e um governo mediano no Brasil, e nao um
   governo em crise. */
const STANDING_NEUTRAL = 35;

/* Dissidencia maxima, em fracao da bancada, quando a lealdade esta cheia. */
const DISSIDENCE = 0.07;

/* OS DOIS ESTADOS DE DESCONTENTAMENTO, e eles sao degraus e nao uma rampa. */
const OBSTRUCTION = 50;
const OBSTRUCTION_TOLL = 0.6;
const RUPTURE = 20;
const RUPTURE_TOLL = 0.15;

/* OS LIMIARES SAO EXPORTADOS porque a tela precisa dizer em que estado a bancada esta, e ela
   nao pode redigitar os numeros: dois lugares com o mesmo limiar e um lugar que vai divergir
   na primeira recalibragem, e o sintoma seria a interface chamando de "obstruindo" uma
   bancada que o motor ja trata como rompida. */
export const THRESHOLDS = { obstruction: OBSTRUCTION, rupture: RUPTURE };

/* ── O ASSENTAMENTO DA LEALDADE, mes a mes ────────────────────────────────── Tres forcas, e
   a terceira e a que liga este motor ao orcamento. */
const DECAY = 1.5;
const PATRONAGE = 12;
const BETRAYAL = 25;

/**
 * @typedef {object} PartyForecast
 * @property {string} partyId
 * @property {number} distance - a distancia ideologica crua
 * @property {number} venality - a venalidade do eixo que domina a distancia
 * @property {number} resistance - ja com verba e ameaca
 * @property {number} adherence - fracao da bancada que tende a votar sim
 * @property {number} votes - a previsao em cadeiras
 * @typedef {object} Forecast
 * @property {PartyForecast[]} parties
 * @property {number} votes - a soma prevista
 * @typedef {object} PartyTally
 * @property {string} partyId
 * @property {number} votes
 * @property {number} drift - quantas cadeiras fugiram da previsao
 * @typedef {object} Tally
 * @property {PartyTally[]} parties
 * @property {number} votes
 * @property {number} expected
 * @property {boolean} passed
 * @property {Stream} stream
 */

/** @param {number} value */
function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

/**
 * A venalidade que vale para ESTA pauta: a do eixo que domina a distancia.
 *
 * @param {Party} party
 * @param {number} dx
 * @param {number} dy
 */
function venalityFor(party, dx, dy) {
  const total = dx * dx + dy * dy;
  if (total === 0) return (party.venalityEconomic + party.venalityLiberty) / 2;
  return (dx * dx * party.venalityEconomic + dy * dy * party.venalityLiberty) / total;
}

/**
 * Ele existe extraido porque DUAS coisas precisam dele e elas nao podem divergir: a previsao
 * de uma votacao e a leitura da base.
 *
 * @param {number} mood a lealdade da bancada, de 0 a 100
 * @returns {number}
 */
function moodFactor(mood) {
  let factor = 0.5 + 0.5 * clamp01(mood / 100);

  /* Os dois degraus, na ordem em que a base os desce. */
  if (mood < OBSTRUCTION) factor *= OBSTRUCTION_TOLL;
  if (mood < RUPTURE) factor *= RUPTURE_TOLL;

  return factor;
}

/**
 * A BASE, EM CADEIRAS — quantas o governo tem sem nada em pauta.
 *
 * @param {object} input
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.loyalty
 * @returns {number} cadeiras, arredondado
 */
export function baseCount({ parties, loyalty }) {
  let seats = 0;
  for (const party of parties) {
    seats += party.seats * clamp01(moodFactor(loyalty[party.id] ?? 0));
  }
  return Math.round(seats);
}

/**
 * `baseCount` arredonda o total porque a tela mostra um inteiro; repartir arredondado faria a
 * soma das partes divergir do total em ate uma cadeira, e o arco fecharia com uma fresta que
 * ninguem consegue explicar.
 *
 * @param {object} input
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.loyalty
 * @returns {{ loyal: number, obstructing: number, ruptured: number }} cadeiras efetivas
 */
export function baseSplit({ parties, loyalty }) {
  const split = { loyal: 0, obstructing: 0, ruptured: 0 };

  for (const party of parties) {
    const mood = loyalty[party.id] ?? 0;
    const effective = party.seats * clamp01(moodFactor(mood));

    /* A ORDEM E A DA GRAVIDADE, e ela espelha a de `moodFactor`: quem rompeu passou pela
       obstrucao antes, entao a pergunta mais grave vem primeiro. */
    if (mood < RUPTURE) split.ruptured += effective;
    else if (mood < OBSTRUCTION) split.obstructing += effective;
    else split.loyal += effective;
  }

  return split;
}

/**
 * A soma de `delivered` aqui e exatamente o `loyal + obstructing + ruptured` de la — e ha uma
 * prova cobrando isso, porque a hora em que as duas divergirem e a hora em que o desenho
 * passa a mentir sobre o tamanho da base.
 *
 * @param {object} input
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.loyalty
 * @returns {{ id: string, label: string, economic: number, seats: number,
 * delivered: number, mood: "loyal" | "obstructing" | "ruptured" }[]}
 */
export function seating({ parties, loyalty }) {
  return parties.map(party => {
    const mood = loyalty[party.id] ?? 0;
    return {
      id: party.id,
      label: party.label,
      economic: party.economic,
      seats: party.seats,
      delivered: party.seats * clamp01(moodFactor(mood)),
      mood: mood < RUPTURE ? "ruptured" : mood < OBSTRUCTION ? "obstructing" : "loyal",
    };
  });
}

/**
 * @param {object} input
 * @param {Motion} input.bill
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.funding - verba por bancada, de 0 a 1
 * @param {Record<string, number>} input.loyalty - lealdade por bancada, de 0 a 100
 * @param {number} [input.standing] - a aprovacao do governo, em "otimo/bom"
 * @returns {Forecast}
 */
export function whipCount({ bill, parties, funding, loyalty, standing }) {
  /* A RUA ENTRA COMO DESLOCAMENTO DA RESISTENCIA, e nao como multiplicador da adesao:
     multiplicar mexeria no comparecimento, que e o que a lealdade ja faz. */
  const street = ((standing ?? STANDING_NEUTRAL) - STANDING_NEUTRAL) / 100;
  const forecasts = parties.map(party => {
    const dx = party.economic - bill.economic;
    const dy = party.liberty - bill.liberty;

    /* ── A DISPERSAO DO TEXTO ENTRA COMO UM TERCEIRO EIXO ────────────────────── ⚠ ELA
       CONSERTA O DEFEITO MEDIDO EM : o preco de uma pauta nao escalava com o TAMANHO dela. */
    const distance = Math.hypot(dx, dy, bill.spread ?? 0);
    const venality = venalityFor(party, dx, dy);
    const paid = clamp01(funding[party.id] ?? 0);

    const resistance =
      distance * (1 - venality * paid) +
      bill.threat * venality * THREAT_WEIGHT -
      street * STANDING_WEIGHT;

    /* A logistica devolve adesao alta para resistencia baixa e vice-versa. */
    let adherence = 1 / (1 + Math.exp((resistance - PIVOT) / SPREAD));

    /* LEALDADE nao muda a direcao, muda o comparecimento. */
    adherence *= moodFactor(loyalty[party.id] ?? 0);

    return {
      partyId: party.id,
      distance,
      venality,
      resistance,
      adherence: clamp01(adherence),
      votes: Math.round(party.seats * clamp01(adherence)),
    };
  });

  return {
    parties: forecasts,
    votes: forecasts.reduce((sum, forecast) => sum + forecast.votes, 0),
  };
}

/**
 * Um saque unico para todas faria as quatro traírem juntas, o que parece evento e e defeito
 * de modelagem.
 *
 * @param {object} input
 * @param {Motion} input.bill
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.funding
 * @param {Record<string, number>} input.loyalty
 * @param {Stream} input.stream
 * @param {number} input.majority - votos necessarios
 * @param {number} [input.standing] - a aprovacao do governo, em "otimo/bom"
 * @returns {Tally}
 */
export function vote({ bill, parties, funding, loyalty, stream, majority, standing }) {
  const forecast = whipCount({ bill, parties, funding, loyalty, standing });
  let current = stream;

  const tallies = forecast.parties.map((prediction, index) => {
    const party = parties[index];
    const seats = party?.seats ?? 0;
    const drawn = unit(current);
    current = drawn.stream;

    /* A margem de erro cresce quando a lealdade cai: bancada insatisfeita entrega menos E de
       forma menos previsivel. */
    const faith = clamp01((loyalty[prediction.partyId] ?? 0) / 100);
    const spread = DISSIDENCE * (2 - faith);

    const drift = (drawn.value - 0.5) * 2 * spread;
    const actual = clamp01(prediction.adherence + drift);
    const votes = Math.round(seats * actual);

    return { partyId: prediction.partyId, votes, drift: votes - prediction.votes };
  });

  const votes = tallies.reduce((sum, tally) => sum + tally.votes, 0);

  return {
    parties: tallies,
    votes,
    expected: forecast.votes,
    passed: votes >= majority,
    stream: current,
  };
}

/**
 * A LARGURA DA INCERTEZA, em cadeiras.
 *
 * @param {object} input
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.loyalty
 * @returns {number} cadeiras, arredondado
 */
export function dispersion({ parties, loyalty }) {
  let variance = 0;

  for (const party of parties) {
    const faith = clamp01((loyalty[party.id] ?? 0) / 100);
    const reach = party.seats * DISSIDENCE * (2 - faith);
    variance += (reach * reach) / 3;
  }

  return Math.round(Math.sqrt(variance));
}

/**
 * O QUE O MES DEIXOU NA BASE.
 *
 * @param {object} input
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.loyalty - o humor de entrada, de 0 a 100
 * @param {Record<string, number>} input.promised - verba prometida, de 0 a 1
 * @param {Record<string, number>} input.paid - verba que o caixa realmente honrou
 * @returns {Record<string, number>} o humor de saida
 */
export function settle({ parties, loyalty, promised, paid }) {
  /** @type {Record<string, number>} */
  const next = {};

  for (const party of parties) {
    const before = loyalty[party.id] ?? 0;
    const honoured = clamp01(paid[party.id] ?? 0);
    /* O buraco nunca e negativo: pagar MAIS do que se prometeu e generosidade, e generosidade
       ja esta paga pelo afago. */
    const broken = Math.max(0, clamp01(promised[party.id] ?? 0) - honoured);

    next[party.id] = clamp(before - DECAY + PATRONAGE * honoured - BETRAYAL * broken, 0, 100);
  }

  return next;
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
