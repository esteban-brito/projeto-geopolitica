/* MALHA — os indices por area: decaimento, rendimento da alocacao, e a pressao que
   os indices devolvem a receita e a despesa. */

/* Medido, e as duas coisas foram medidas.
   sao TEMPORAL e ECLUSA. */

/**
 * @typedef {import("../../data/areas.mjs").Area} Area
 * @typedef {object} Pressure
 * @property {number} revenue - multiplicador da receita; 1 e neutro
 * @property {number} mandatory - multiplicador da despesa obrigatoria; 1 e neutro
 * @typedef {object} Outcome
 * @property {Record<string, number>} index - o indice de cada area, agora
 * @property {Record<string, number[]>} history - o mais antigo na frente
 * @property {Record<string, number>} effective - o valor que o modelo consome hoje
 * @property {Pressure} pressure
 */

/* O ponto neutro chega por parametro em vez de ser importado do catalogo: o dominio recebe o
   que precisa, e um motor que alcanca dado direto e um motor que nao da para testar com outra
   tabela. */

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * O valor que o modelo consome AGORA: o indice de `lag` meses atras.
 *
 * @param {number[] | undefined} past
 * @param {number} fallback
 * @param {number} lag
 */
function delayed(past, fallback, lag) {
  if (past === undefined || past.length < lag + 1) return fallback;
  return past[0] ?? fallback;
}

/**
 * A FORCA QUE UMA AREA FAZ NO CANAL DELA, hoje, e ela e a ARESTA que o DELTA descreve.
 *
 * ⚠ ELA MEDE CONTRA `initial` — o que o modelo cobra e o DESVIO da abertura, e nao o nivel.
 * A troca conserta um defeito medido, e ele era o segundo termo do achado numero um do
 * handoff — o pais que se desendivida sozinho.
 *
 * @param {Area} area
 * @param {Record<string, number[]>} history
 * @returns {number} somado a 1, vira o multiplicador; 0 e neutro
 */
export function pushOf(area, history) {
  return ((delayed(history[area.id], area.initial, area.lag) - area.initial) / 100) * area.force;
}

/**
 * O canal `capacity` mede contra `neutral`, e nao contra a abertura: uma Educacao de 44
 * ABAIXA a producao, e e isso que a tese do modelo diz. Sao duas bases porque sao duas
 * perguntas — quanto MUDOU, e onde ESTA.
 *
 * @param {Area} area
 * @param {number} value o indice que o canal ja consome, com o atraso aplicado
 * @param {number} neutral
 * @returns {number} pontos de indice entregues a area alvo
 */
function liftAt(area, value, neutral) {
  return ((value - neutral) / 100) * area.force;
}

/**
 * O MESMO CANAL, PERGUNTADO DE FORA — quanto esta area entrega hoje a area alvo.
 *
 * @param {Area} area
 * @param {Record<string, number[]>} history
 * @param {number} neutral
 * @returns {number} pontos de indice
 */
export function liftOf(area, history, neutral) {
  return liftAt(area, delayed(history[area.id], area.initial, area.lag), neutral);
}

/**
 * Calculado depois, a educacao alimentaria a producao no mesmo mes em que ela propria mudou,
 * e o `lag` de 24 meses viraria enfeite.
 *
 * @param {object} input
 * @param {ReadonlyArray<Area>} input.areas
 * @param {Record<string, number>} input.index - o indice de cada area, no inicio do mes
 * @param {Record<string, number[]>} input.history
 * @param {Record<string, number>} input.allocation - bilhoes alocados no mes, por area
 * @param {Record<string, number>} [input.impacts] - salto de acao aprovada, por area
 * @param {number} input.neutral - o ponto em que o indice nao ajuda nem cobra
 * @param {string} input.capacityTarget - a area que recebe o canal `capacity`
 * @returns {Outcome}
 */
export function step({ areas, index, history, allocation, impacts = {}, neutral, capacityTarget }) {
  /* 1 — O QUE CHEGOU, com o atraso de cada area ja aplicado. */
  /** @type {Record<string, number>} */
  const incoming = {};
  for (const area of areas) {
    incoming[area.id] = delayed(history[area.id], area.initial, area.lag);
  }

  /* 2 — O CANAL `capacity`, que e o unico que uma area exerce sobre outra. */
  let bonus = 0;
  for (const area of areas) {
    if (area.feeds !== "capacity") continue;
    bonus += liftAt(area, incoming[area.id] ?? area.initial, neutral);
  }

  /* 3 — O INDICE NOVO. */
  /** @type {Record<string, number>} */
  const next = {};
  /** @type {Record<string, number[]>} */
  const nextHistory = {};

  for (const area of areas) {
    const before = index[area.id] ?? area.initial;
    const spent = Math.max(0, allocation[area.id] ?? 0);
    const jump = impacts[area.id] ?? 0;
    const inherited = area.id === capacityTarget ? bonus : 0;

    /* ⚠ PROPORCIONAL, E NAO SUBTRAIDO — ver o cabecalho. */
    next[area.id] = clamp(
      before * (1 - area.decay) + area.yield * spent + jump + inherited,
      0,
      100,
    );

    /* O historico guarda `lag + 1` valores: o de hoje e os `lag` anteriores. */
    const kept = [...(history[area.id] ?? []), next[area.id] ?? area.initial];
    nextHistory[area.id] = kept.slice(-(area.lag + 1));
  }

  /* 4 — O QUE O MODELO VAI CONSUMIR, ja com o valor novo no historico. */
  /** @type {Record<string, number>} */
  const effective = {};
  for (const area of areas) {
    effective[area.id] = delayed(nextHistory[area.id], area.initial, area.lag);
  }

  return {
    index: next,
    history: nextHistory,
    effective,
    pressure: pressureOf({ areas, history: nextHistory }),
  };
}

/**
 * A PRESSAO QUE OS INDICES FAZEM NO MODELO, lida de um historico sem avanca-lo.
 *
 * @param {object} input
 * @param {ReadonlyArray<Area>} input.areas
 * @param {Record<string, number[]>} input.history
 * @returns {Pressure}
 */
export function pressureOf({ areas, history }) {
  let revenue = 1;
  let mandatory = 1;

  for (const area of areas) {
    const push = pushOf(area, history);
    if (area.feeds === "revenue") revenue += push;
    if (area.feeds === "mandatory") mandatory += push;
  }

  /* Multiplicador nunca fica negativo nem zera: receita negativa e despesa obrigatoria zerada
     nao sao estados de jogo, sao aritmetica escapando. */
  return { revenue: Math.max(0.25, revenue), mandatory: Math.max(0.25, mandatory) };
}

/**
 * O indice de abertura de cada area, e o historico vazio que o acompanha.
 *
 * @param {ReadonlyArray<Area>} areas
 * @returns {{ index: Record<string, number>, history: Record<string, number[]> }}
 */
export function opening(areas) {
  /** @type {Record<string, number>} */
  const index = {};
  /** @type {Record<string, number[]>} */
  const history = {};
  for (const area of areas) {
    index[area.id] = area.initial;
    history[area.id] = [];
  }
  return { index, history };
}

/* MEDIDO EM 72 CELULAS — nove politicas-sonda a 48 meses, oito areas cada. A distribuicao tem
   um VAO real entre -9 e -12, e o agrupamento denso do colapso comeca em -20: 49 celulas ficam
   acima de -10, 9 caem na faixa do meio e 14 passam de -20. Os dois limiares saem dai, e nao
   de escolha. */
const WATCH = 10;
const ALERT = 20;

/**
 * QUANTO CADA AREA CAIU DESDE A ABERTURA, dito em estado.
 *
 * ⚠ A DISTANCIA E DE `initial`, E NAO DO NIVEL. Um limiar absoluto acusaria o jogador de uma
 * Seguranca 38 que ele HERDOU — ela abre em 38. O que e noticia e a queda, e so ela.
 *
 * A ausencia de uma area no resultado significa que ela esta quieta, e e ausencia DECLARADA:
 * quem pinta le `alerts[id]` e nao encontra nada para pintar.
 *
 * @param {ReadonlyArray<Area>} areas
 * @param {Record<string, number>} index - o indice de cada area, hoje
 * @returns {Record<string, "watch" | "alert">} so as areas que caíram
 */
export function alertsOf(areas, index) {
  /** @type {Record<string, "watch" | "alert">} */
  const alerts = {};

  for (const area of areas) {
    const fall = area.initial - (index[area.id] ?? area.initial);
    if (fall >= ALERT) alerts[area.id] = "alert";
    else if (fall >= WATCH) alerts[area.id] = "watch";
  }

  return alerts;
}
