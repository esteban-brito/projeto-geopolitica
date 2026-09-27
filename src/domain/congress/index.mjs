/* ECLUSA — congresso.
   recebe  bancadas, proposta, moeda oferecida, historico de barganha devolve votos por
   bancada, resultado, custo pago, ressentimento ── A SEPARACAO QUE FAZ A MECANICA Duas
   funcoes, e a divisao entre elas E o jogo: `whipCount` — a PREVISAO. */

import { hash, mix, unit } from "../../state/random.mjs";

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
/* ⚠ EXPORTADO PELA MESMA RAZAO DE `THRESHOLDS`: o elenco tambem pergunta o que e um governo
   mediano, e redigitar o numero la seria um segundo lugar para ele divergir. */
export const STANDING_NEUTRAL = 35;

/* Dissidencia maxima, em fracao da bancada, quando a lealdade esta cheia. */
const DISSIDENCE = 0.07;

/* Os tons da tela, em pontos de chance: abaixo de 50 a bancada vota mais contra que a favor;
   abaixo de 20, e oposicao. */
const OBSTRUCTION = 50;
const RUPTURE = 20;

/* OS LIMIARES SAO EXPORTADOS porque a tela precisa dizer em que estado a bancada esta, e ela
   nao pode redigitar os numeros: dois lugares com o mesmo limiar e um lugar que vai divergir
   na primeira recalibragem, e o sintoma seria a interface chamando de "obstruindo" uma
   bancada que o motor ja trata como rompida. */
export const THRESHOLDS = { obstruction: OBSTRUCTION, rupture: RUPTURE };

/* Voto firme: o deputado que acompanha o governo em emenda e reforma. */
export const FIRM = 0.8;

/* ── A CHANCE ESTRUTURAL (docs/spec/the-base-model.md) ──────────────────────── Os numeros sao
   os do prototipo da posse, [DESENHO] dentro das faixas da pesquisa 17. */
const OWN_CHANCE = 0.92;
const NEAR = 45;
const PRAGMATIC_REACH = 70;
const DEPUTY_SPREAD = 0.14;
const CENTER = { economic: 50, liberty: 50 };

/* A chance com que a lealdade nem ajuda nem atrapalha uma votacao: a do voto firme. Com 0,75,
   duas leis mansas passavam de graca numa Camara inteira a 30% (266 e 260 votos para 257). */
const NEUTRAL_CHANCE = 0.8;

/* ── O ASSENTAMENTO DA LEALDADE, mes a mes ──────────────────────────────────── A posicao puxa,
   a emenda paga soma e a promessa quebrada tira. Cair 1,5 por mes sem motivo levava toda
   bancada sem emenda a ruptura (achado 86). O puxao de metade da distancia e [DESENHO]: a
   pesquisa 17 nao achou prazo medido. */
const STANCE_PULL = 0.5;
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
 * A chance em fracao; a lealdade guardada e a chance em pontos.
 *
 * @param {number} mood a lealdade da bancada, de 0 a 100
 * @returns {number}
 */
function chanceOf(mood) {
  return clamp01(mood / 100);
}

/** @param {number} chance */
function logit(chance) {
  const bounded = Math.min(0.98, Math.max(0.02, chance));
  return Math.log(bounded / (1 - bounded));
}

/**
 * A chance de a bancada votar com o governo, de 0 a 1, pela posicao dela.
 *
 * @param {object} input
 * @param {Party} input.party
 * @param {{ economic: number, liberty: number }} input.home - onde mora o governo
 * @param {number} [input.share] - a parte da cota de pastas que o partido tem, de 0 a 1
 * @param {"gov" | "opposition" | null} [input.stance] - o que o partido declarou
 * @returns {number}
 */
export function partyChance({ party, home, share = 0, stance = null }) {
  if (stance === "gov") return OWN_CHANCE;
  const d = Math.hypot(party.economic - home.economic, party.liberty - home.liberty);
  const opposition = 0.12 + 0.2 * clamp01(1 - Math.max(0, d - NEAR) / NEAR);
  if (stance === "opposition" || party.neverBase) return opposition;
  const free =
    d <= NEAR ? 0.85 - (d / NEAR) * 0.2 : Math.max(0.4, 0.65 - ((d - NEAR) / NEAR) * 0.25);
  if (share > 0) return Math.min(0.95, Math.max(0.67, free + 0.25 * clamp01(share)));
  if (party.pragmatic) return d > PRAGMATIC_REACH ? 0.35 : Math.max(free, 0.55);
  return d > NEAR ? opposition : free;
}

/**
 * A chance estrutural de cada partido, em pontos: para onde o mes puxa a lealdade.
 *
 * @param {object} input
 * @param {ReadonlyArray<Party>} input.parties
 * @param {string | null} input.ruling - o partido do Presidente
 * @param {Record<string, number>} [input.served] - a parte da cota de pastas, de 0 a 1
 * @param {ReadonlyArray<string>} [input.declared] - os partidos que romperam
 * @returns {Record<string, number>}
 */
export function chanceTargets({ parties, ruling, served = {}, declared = [] }) {
  const home = parties.find(party => party.id === ruling) ?? CENTER;
  return Object.fromEntries(
    parties.map(party => {
      /** @type {"gov" | "opposition" | null} */
      const stance =
        party.id === ruling ? "gov" : declared.includes(party.id) ? "opposition" : null;
      const share = served[party.id] ?? 0;
      return [party.id, 100 * partyChance({ party, home, share, stance })];
    }),
  );
}

/**
 * A lealdade da posse: a chance estrutural, sem pasta nenhuma.
 *
 * @param {object} input
 * @param {ReadonlyArray<Party>} input.parties
 * @param {string | null} input.ruling
 * @returns {Record<string, number>}
 */
export function openingLoyalty({ parties, ruling }) {
  return chanceTargets({ parties, ruling });
}

/**
 * A chance de cada deputado, em torno da do partido, tirada da semente e nunca guardada.
 *
 * @param {object} input
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.loyalty
 * @param {number} input.seed
 * @returns {number[]}
 */
export function deputyChances({ parties, loyalty, seed }) {
  /** @type {number[]} */
  const chances = [];
  for (const party of parties) {
    const chance = chanceOf(loyalty[party.id] ?? 0);
    const key = hash(`${seed}:${party.id}`);
    for (let seat = 0; seat < party.seats; seat++) {
      const jitter = (mix(key, seat) / 2 ** 32 - 0.5) * 2 * DEPUTY_SPREAD;
      chances.push(Math.min(0.99, Math.max(0.02, chance + jitter)));
    }
  }
  return chances;
}

/**
 * OS VOTOS FIRMES, o placar principal da base.
 *
 * @param {object} input
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.loyalty
 * @param {number} input.seed
 * @returns {number}
 */
export function firmCount(input) {
  return deputyChances(input).filter(chance => chance >= FIRM).length;
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
    seats += party.seats * chanceOf(loyalty[party.id] ?? 0);
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
    const effective = party.seats * chanceOf(mood);

    /* A ORDEM E A DA GRAVIDADE: quem rompeu passou pela obstrucao antes, entao a pergunta
       mais grave vem primeiro. */
    if (mood < RUPTURE) split.ruptured += effective;
    else if (mood < OBSTRUCTION) split.obstructing += effective;
    else split.loyal += effective;
  }

  return split;
}

/* MEDIDO NO CATALOGO: com o corte em 0,7 a Camara parte em 384 contra 129 cadeiras, e a media
   ponderada pela venalidade da 70,0% (no catalogo de 9, 364 contra 149 e 67,9%). O corte nao e redondo por acaso — ele e o degrau em que
   `venalityFor` deixa de cobrar resistencia ideologica e passa a cobrar preco. */
const VENAL = 0.7;

/**
 * A BASE TEM DUAS METADES: a que se compra e a que se convence.
 *
 * ⚠ ELA RESPONDE A PERGUNTA QUE A TELA NUNCA RESPONDEU — _quantos destes me abandonam no dia em
 * que eu parar de pagar?_ A leitura de hoje diz "436 apoiam" sem separar conviccao de aluguel.
 *
 * ⚠ E ELA NAO E `baseSplit`: aquela reparte por HUMOR — quem esta leal, obstruindo ou rompido
 * hoje. Esta reparte por PRECO, que e outra pergunta e nao muda com o mes.
 *
 * @param {object} input
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.loyalty
 * @returns {{ bought: number, convinced: number }} cadeiras efetivas, e a soma e a base
 */
export function baseVenality({ parties, loyalty }) {
  const split = { bought: 0, convinced: 0 };

  for (const party of parties) {
    const effective = party.seats * chanceOf(loyalty[party.id] ?? 0);
    if (party.venalityEconomic >= VENAL) split.bought += effective;
    else split.convinced += effective;
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
      delivered: party.seats * chanceOf(mood),
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
 * @param {ReadonlySet<string> | null} [input.ruling] - as bancadas do presidente. E um
 * CONJUNTO, e nao um id: o bloco dele chega ao plenario repartido entre a bancada restante e
 * as pessoas que arrastam pedacos dela, e todas sao a mesma casa
 * @returns {Forecast}
 */
export function whipCount({ bill, parties, funding, loyalty, standing, ruling = null }) {
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

    /* ── O SEU PARTIDO NAO SE COMPRA ─────────────────────────────────────────── Ele quer
       participacao, e nao emenda. O que ele da em troca ja veio na lealdade de abertura, que
       nasce 20 pontos acima da dos outros — e comparecimento vale mais que desconto. */
    const own = ruling !== null && ruling.has(party.id);
    const paid = own ? 0 : clamp01(funding[party.id] ?? 0);

    const resistance =
      distance * (1 - venality * paid) +
      bill.threat * venality * THREAT_WEIGHT -
      street * STANDING_WEIGHT;

    /* A lealdade desloca, como a rua: multiplicar fazia a oposicao recusar a propria pauta. */
    const loyal = logit(chanceOf(loyalty[party.id] ?? 0)) - logit(NEUTRAL_CHANCE);
    const adherence = 1 / (1 + Math.exp((resistance - PIVOT) / SPREAD - loyal));

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
 * @param {ReadonlySet<string> | null} [input.ruling] - as bancadas do presidente
 * @returns {Tally}
 */
export function vote({ bill, parties, funding, loyalty, stream, majority, standing, ruling }) {
  const forecast = whipCount({ bill, parties, funding, loyalty, standing, ruling });
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
 * @param {Record<string, number>} input.loyalty - a chance de entrada, em pontos
 * @param {Record<string, number>} input.promised - verba prometida, de 0 a 1
 * @param {Record<string, number>} input.paid - verba que o caixa realmente honrou
 * @param {Record<string, number>} input.targets - a chance estrutural, em pontos
 * @returns {Record<string, number>} a chance de saida
 */
export function settle({ parties, loyalty, promised, paid, targets }) {
  /** @type {Record<string, number>} */
  const next = {};

  for (const party of parties) {
    const before = loyalty[party.id] ?? 0;
    const honoured = clamp01(paid[party.id] ?? 0);
    /* O buraco nunca e negativo: pagar MAIS do que se prometeu e generosidade, e generosidade
       ja esta paga pelo afago. */
    const broken = Math.max(0, clamp01(promised[party.id] ?? 0) - honoured);
    const target = targets[party.id] ?? before;
    next[party.id] = clamp(
      before + STANCE_PULL * (target - before) + PATRONAGE * honoured - BETRAYAL * broken,
      0,
      100,
    );
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
