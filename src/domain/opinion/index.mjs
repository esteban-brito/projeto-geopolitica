/* SONDA — opiniao publica por segmento.
   Porque so agora existe o que ele consome. Ate a CORRENTE nascer nao havia
   inflacao nem desemprego, e uma aprovacao construida sobre indice de area
   sozinho seria um segundo indice de area com outro nome. A aprovacao ficou
   FORA DA TELA por tres sessoes com esta razao escrita — "quem a produz e SONDA,
   que nao existe" —, e este arquivo e o que a traz de volta.
   Evento e escandalo (dependem de TEMPORAL), enquadramento de imprensa (depende
   do elenco do ciclo 4), recorte regional e religioso. Nenhum e necessario para
   a aprovacao TER PRECO, que e a razao de este motor existir agora. */

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
 * NOTA DE 0 A 100 PARA UM INDICADOR EM QUE MENOS E MELHOR.
 *
 * @param {number} value
 * @param {number} anchor
 * @param {number} span
 */
function lowerIsBetter(value, anchor, span) {
  return clamp100(50 - ((value - anchor) / span) * 50);
}

/**
 * A MESMA NOTA para um indicador em que MAIS e melhor.
 *
 * @param {number} value
 * @param {number} anchor
 * @param {number} span
 */
function higherIsBetter(value, anchor, span) {
  return clamp100(50 + ((value - anchor) / span) * 50);
}

/**
 * QUANTO A PROMESSA QUEBRADA COBRA POR MES, em pontos de satisfacao.
 *
 * ⚠ ELA E EXTRAIDA DE `step` E NAO COPIADA DELE, e a razao e a regra: o Gabinete precisa
 * anunciar este preco ANTES do fechamento, e informacao que chega depois da decisao e recibo.
 * Refeita na tela, ela divergiria no dia em que `broken` mudasse.
 *
 * @param {number} breach a fracao da plataforma quebrada, de 0 a 1
 * @param {OpinionParameters} parameters
 * @returns {number}
 */
export function betrayalCost(breach, parameters) {
  return Math.min(1, Math.max(0, breach)) * parameters.broken;
}

/**
 * Um mes de opiniao publica.
 *
 * @param {OpinionInput} input
 * @returns {OpinionOutput}
 */
export function step(input) {
  const { released, parameters: p, segments } = input;

  /* AS QUATRO NOTAS QUE O PAIS INTEIRO RECEBE. */
  const notes = {
    prices: lowerIsBetter(released.inflation, p.priceAnchor, p.priceSpan),
    jobs: lowerIsBetter(released.unemployment, p.jobAnchor, p.jobSpan),
    services: clamp100(input.services),
    safety: clamp100(input.safety),
    economy: higherIsBetter(released.growth, p.growthAnchor, p.growthSpan),
  };

  /* A PROMESSA QUEBRADA CHEGA A RUA, e nao so ao Congresso. */
  const betrayal = betrayalCost(input.betrayal ?? 0, p);

  /* ⚠ O DESGASTE DO CARGO, e ele cresce com o mandato. */
  const wear = Math.max(0, input.tenure ?? 0) * p.wearRate;

  /** @type {Record<string, number>} */
  const mood = {};
  /** @type {Record<string, Approval>} */
  const bySegment = {};
  /* QUANTO CADA NOTA VALEU PARA CADA SEGMENTO, ja pesado. */
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

    /* A INERCIA, E A ASSIMETRIA DENTRO DELA. */
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

  /* A MEDIA E PONDERADA PELA POPULACAO, e o divisor e a soma real das fatias e nao 1: um
     catalogo que nao some exatamente 1 devolveria uma aprovacao silenciosamente menor, e o
     defeito apareceria como "o governo e impopular" tres telas adiante. */
  const national = shareTotal > 0 ? weighted / shareTotal : 0;

  /* A alternativa seria a view multiplicar nota por peso para montar o anexo, e ai haveria
     dois lugares somando a mesma coisa — o defeito recorrente numero um deste projeto. */
  return { mood, approval: pollOf(national, p), bySegment, notes, betrayal, wear, weighed };
}

/**
 * A SATISFACAO VIRA PESQUISA — de um numero para as tres fatias.
 *
 * @param {number} mood de 0 a 100
 * @param {OpinionParameters} p
 * @returns {Approval}
 */
function pollOf(mood, p) {
  const share = clamp100(mood) / 100;

  const good = 100 * share ** p.goodSlope;
  const poor = 100 * (1 - share) ** p.poorSlope;

  /* O estado ja tinha esse invariante e ha prova dele em `tests/suites/state-reducer.mjs`;
     quebra-lo aqui apareceria como um medidor que nao fecha a barra. */
  const fair = Math.max(0, 100 - good - poor);
  const total = good + poor + fair;

  return {
    good: Math.round((good / total) * 100),
    fair: Math.round((fair / total) * 100),
    poor: 100 - Math.round((good / total) * 100) - Math.round((fair / total) * 100),
  };
}

/**
 * A opiniao de abertura, montada do catalogo.
 *
 * @param {ReadonlyArray<Segment>} segments
 * @returns {Record<string, number>}
 */
export function opening(segments) {
  return Object.fromEntries(segments.map(segment => [segment.id, segment.initial]));
}

/**
 * A LEITURA NACIONAL de uma satisfacao ja conhecida, sem avancar o mes.
 *
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
