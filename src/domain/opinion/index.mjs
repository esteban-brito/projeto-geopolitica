/* SONDA — opiniao publica por segmento a partir de macroeconomia e servicos. */

/**
 * @typedef {import("../../data/opinion.mjs").Segment} Segment
 * @typedef {import("../../data/opinion.mjs").OpinionParameters} OpinionParameters
 * @typedef {object} Approval a escala de pesquisa, em pontos que somam 100
 * @property {number} good - "otimo/bom"
 * @property {number} fair - "regular"
 * @property {number} poor - "ruim/pessimo"
 * @typedef {object} Released o que a populacao JA SABE quando o mes comeca
 * @property {number} inflation - ao ano, em fracao
 * @property {number} unemployment - em fracao da forca de trabalho
 * @property {number} growth - crescimento real anualizado, em fracao
 * @typedef {object} OpinionInput
 * @property {Record<string, number>} mood - a satisfacao de cada segmento, de 0 a 100
 * @property {Released} released
 * @property {number} services - o servico publico percebido, de 0 a 100
 * @property {number} safety - a ordem percebida, de 0 a 100
 * @property {number} [betrayal] - a fracao da promessa que o caixa NAO honrou
 * @property {number} [tenure] - meses no cargo; o desgaste cresce com eles
 * @property {ReadonlyArray<Segment>} segments
 * @property {OpinionParameters} parameters
 * @typedef {object} OpinionOutput
 * @property {Record<string, number>} mood - a satisfacao do mes seguinte
 * @property {Approval} approval - a leitura nacional, na escala de pesquisa
 * @property {Record<string, Approval>} bySegment - a mesma escala, por segmento
 * @property {Record<string, number>} notes - as cinco notas nacionais, de 0 a 100
 * @property {number} betrayal - quanto a promessa quebrada tirou de todo mundo
 * @property {number} wear - quanto o desgaste do cargo tirou de todo mundo
 * @property {Record<string, Record<string, number>>} weighed - cada nota JA PESADA, por
 * segmento. ⚠ E ela e pesada AQUI e nao na view: multiplicar nota por peso do lado de
 * la daria dois lugares fazendo a mesma conta, e o segundo divergiria do primeiro no
 * dia em que um peso mudasse — que e o dia em que o anexo precisa estar certo
 */

/** @param {number} value */
function clamp100(value) {
  return Math.min(100, Math.max(0, value));
}

/**
 * @param {number} value
 * @param {number} anchor
 * @param {number} span
 */
function lowerIsBetter(value, anchor, span) {
  return clamp100(50 - ((value - anchor) / span) * 50);
}

/**
 * @param {number} value
 * @param {number} anchor
 * @param {number} span
 */
function higherIsBetter(value, anchor, span) {
  return clamp100(50 + ((value - anchor) / span) * 50);
}

/**
 * @param {number} breach a fracao da plataforma quebrada, de 0 a 1
 * @param {OpinionParameters} parameters
 * @returns {number}
 */
export function betrayalCost(breach, parameters) {
  return Math.min(1, Math.max(0, breach)) * parameters.broken;
}

/**
 * @param {OpinionInput} input
 * @returns {OpinionOutput}
 */
export function step(input) {
  const { released, parameters: p, segments } = input;

  const notes = {
    prices: lowerIsBetter(released.inflation, p.priceAnchor, p.priceSpan),
    jobs: lowerIsBetter(released.unemployment, p.jobAnchor, p.jobSpan),
    services: clamp100(input.services),
    safety: clamp100(input.safety),
    economy: higherIsBetter(released.growth, p.growthAnchor, p.growthSpan),
  };

  const betrayal = betrayalCost(input.betrayal ?? 0, p);

  const wear = Math.max(0, input.tenure ?? 0) * p.wearRate;

  /** @type {Record<string, number>} */
  const mood = {};
  /** @type {Record<string, Approval>} */
  const bySegment = {};
  /* Pesada aqui para evitar duplicar conta na view e divergir se o peso mudar. */
  /** @type {Record<string, Record<string, number>>} */
  const weighed = {};
  let weighted = 0;
  let shareTotal = 0;

  for (const segment of segments) {
    const target = clamp100(
      notes.prices * segment.prices +
        notes.jobs * segment.jobs +
        notes.services * segment.services +
        notes.safety * segment.safety +
        notes.economy * segment.economy -
        betrayal -
        wear,
    );

    const current = input.mood[segment.id] ?? segment.initial;

    const pull = Math.min(1, (1 - p.inertia) * (target < current ? p.fallSpeed : 1));
    const next = clamp100(current + (target - current) * pull);

    mood[segment.id] = next;
    bySegment[segment.id] = pollOf(next, p);
    weighed[segment.id] = {
      prices: notes.prices * segment.prices,
      jobs: notes.jobs * segment.jobs,
      services: notes.services * segment.services,
      safety: notes.safety * segment.safety,
      economy: notes.economy * segment.economy,
    };
    weighted += next * segment.share;
    shareTotal += segment.share;
  }

  /* Divisao pela soma real das fatias evita aprovacao menor quando o catalogo nao soma 1. */
  const national = shareTotal > 0 ? weighted / shareTotal : 0;

  return { mood, approval: pollOf(national, p), bySegment, notes, betrayal, wear, weighed };
}

/**
 * @param {number} mood de 0 a 100
 * @param {OpinionParameters} p
 * @returns {Approval}
 */
function pollOf(mood, p) {
  const share = clamp100(mood) / 100;

  const good = 100 * share ** p.goodSlope;
  const poor = 100 * (1 - share) ** p.poorSlope;

  /* Soma das tres fatias fecha em 100 para manter invariante visual da barra de aprovacao. */
  const fair = Math.max(0, 100 - good - poor);
  const total = good + poor + fair;

  return {
    good: Math.round((good / total) * 100),
    fair: Math.round((fair / total) * 100),
    poor: 100 - Math.round((good / total) * 100) - Math.round((fair / total) * 100),
  };
}

/**
 * @param {ReadonlyArray<Segment>} segments
 * @returns {Record<string, number>}
 */
export function opening(segments) {
  return Object.fromEntries(segments.map(segment => [segment.id, segment.initial]));
}

/**
 * @param {Record<string, number>} mood
 * @param {ReadonlyArray<Segment>} segments
 * @param {OpinionParameters} parameters
 * @returns {Approval}
 */
export function pollFrom(mood, segments, parameters) {
  let weighted = 0;
  let shareTotal = 0;
  for (const segment of segments) {
    weighted += (mood[segment.id] ?? segment.initial) * segment.share;
    shareTotal += segment.share;
  }
  return pollOf(shareTotal > 0 ? weighted / shareTotal : 0, parameters);
}
