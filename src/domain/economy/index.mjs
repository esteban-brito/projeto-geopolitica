/* CORRENTE — hiato, Phillips, Taylor, Okun e populacao; e o `carry`, que faz gasto
   virar divida e divida virar juro. */

/* ── O ESTOQUE DA DIVIDA E O CANAL QUE FECHA O CIRCUITO ────────────────────── Juro alto nao
   so freia o PIB: ele cobra do orcamento, porque 45% da divida brasileira acompanha a taxa
   basica. */

/**
 * @typedef {import("../../data/macro.mjs").MacroParameters} MacroParameters
 * @typedef {object} MacroState o que atravessa os meses
 * @property {number} gdp - PIB nominal anualizado, em bilhoes
 * @property {number} potential - PIB potencial anualizado
 * @property {number} inflation - ao ano, em fracao
 * @property {number} rate - a taxa basica nominal, ao ano
 * @property {number} unemployment - em fracao da forca de trabalho
 * @property {number} population - em milhoes
 * @typedef {object} EconomyInput
 * @property {MacroState} macro
 * @property {MacroParameters} parameters
 * @property {number} taxLoad - carga tributaria corrente, em fracao do PIB
 * @property {number} baseTaxLoad - a carga com que a partida abriu
 * @property {number} capacity - o quanto a capacidade do Estado esta acima do neutro, de -1 a 1
 * @property {number} impulse - o discricionario empenhado no mes sobre o PIB mensal
 * @property {number} [shock] - choque de oferta do mes, em pontos de inflacao anual
 * @typedef {object} EconomyOutput
 * @property {MacroState} macro - a posicao do mes seguinte
 * @property {number} gap - o hiato do produto, em fracao
 * @property {number} realRate - o juro real corrente
 * @property {number} growth - o crescimento REAL anualizado deste mes
 */

const MONTHS_PER_YEAR = 12;

/**
 * Converte uma taxa anual no fator de UM mes, compondo — nunca dividindo.
 *
 * @param {number} annual
 */
function monthly(annual) {
  return (1 + annual) ** (1 / MONTHS_PER_YEAR);
}

/**
 * Um mes de economia.
 *
 * O choque exogeno entra por parametro (`shock`): um sorteio feito aqui dentro
 * tornaria o mandato irreproduzivel.
 * @param {EconomyInput} input
 * @returns {EconomyOutput}
 */
export function step(input) {
  const { macro, parameters: p } = input;

  /* E o unico lugar do jogo em que investir em educacao aparece como numero — e aparece 24
     meses depois, porque o atraso mora na
     MALHA e chega aqui ja defasado. */
  const potentialRate = p.potentialGrowth + p.capacityLift * input.capacity;
  const potentialReal = macro.potential * monthly(potentialRate);

  /* ⚠ A CARGA E MEDIDA CONTRA A DE ABERTURA, e nao contra zero. */
  const realRate = macro.rate - macro.inflation;
  const taxDelta = input.taxLoad - input.baseTaxLoad;

  const demand =
    potentialRate -
    p.taxDrag * taxDelta -
    p.rateDrag * (realRate - p.neutralRate) +
    p.fiscalMultiplier * input.impulse;

  const gdpReal = macro.gdp * monthly(demand);

  /* O hiato passava a medir inflacao acumulada em vez de aquecimento, e o resultado era uma
     economia que fugia sozinha: hiato de 1% no mes 6 virava 7,6% no mes 24, com o juro
     perseguindo em 20% ao ano e ninguem tendo feito nada. */
  const gap = potentialReal > 0 ? (gdpReal - potentialReal) / potentialReal : 0;

  /* 3 — PHILLIPS. */
  const expectation = p.anchoring * p.inflationTarget + (1 - p.anchoring) * macro.inflation;
  const inflation = Math.max(-0.05, expectation + p.phillips * gap + (input.shock ?? 0));

  /* 4 — TAYLOR, com suavizacao. */
  const target =
    p.neutralRate +
    inflation +
    p.taylorInflation * (inflation - p.inflationTarget) +
    p.taylorGap * gap;
  const rate = Math.max(0, p.rateSmoothing * macro.rate + (1 - p.rateSmoothing) * target);

  /* 5 — OKUN. */
  const unemployment = Math.min(0.4, Math.max(0.01, p.naturalUnemployment - p.okun * gap));

  /* O PIB NOMINAL carrega a inflacao junto, porque toda a contabilidade do jogo e nominal:
     receita e fracao do PIB, e divida e razao sobre ele. */
  const price = monthly(inflation);
  const gdp = gdpReal * price;

  return {
    macro: {
      gdp,
      /* E isso que mantem o hiato honesto ao longo de 48 meses: os dois lados envelhecem
         juntos. */
      potential: potentialReal * price,
      inflation,
      rate,
      unemployment,
      population: macro.population * monthly(p.populationGrowth),
    },
    gap,
    realRate,
    growth: demand,
  };
}

/**
 * E por isso a tolerancia entra por parametro em vez de morar no catalogo macro: ela ja
 * existe, em `fiscal.initialDebtRatio`, e dois lugares com o mesmo numero e um lugar que vai
 * divergir.
 *
 * @param {object} input
 * @param {number} input.debtRatio - a divida sobre o PIB, hoje
 * @param {number} input.tolerance - a razao que o mercado ja precificou
 * @param {number} input.slope - quanto ele cobra por ponto ao quadrado
 * @returns {number} pontos de juro ao ano, somados a basica
 */
export function premiumOf({ debtRatio, tolerance, slope }) {
  const excess = debtRatio - tolerance;
  if (excess <= 0) return 0;
  return slope * excess * excess;
}

/**
 * O QUE A DIVIDA CUSTA NUM MES, em bilhoes.
 *
 * Separado de `step` porque o estoque da divida mora no LASTRO e nao aqui, e
 * motor nenhum chama outro motor: quem tem os dois na mao e a camada de
 * aplicacao, que passa o estoque e recebe a conta.
 * ⚠ A ANCORA E PUBLICA: cada 1 p.p. de taxa basica custa cerca de R$ 40 bi ao ano ao
 * Tesouro, e com divida perto de R$ 9,4 tri isso da os 45% que `floatingDebt` declara.
 * @param {object} input
 * @param {number} input.debt - o estoque bruto
 * @param {number} input.rate - a taxa basica nominal ao ano
 * @param {number} [input.premium] - o spread que o mercado cobra, ao ano
 * @param {MacroParameters} input.parameters
 * @returns {number} bilhoes NO MES
 */
export function carry({ debt, rate, premium = 0, parameters }) {
  const effective =
    parameters.floatingDebt * rate + (1 - parameters.floatingDebt) * parameters.legacyRate;
  return (debt * (effective + premium)) / MONTHS_PER_YEAR;
}

/**
 * A posicao macro de abertura, montada do catalogo.
 *
 * @param {number} gdp
 * @param {MacroParameters} parameters
 * @returns {MacroState}
 */
export function opening(gdp, parameters) {
  return {
    gdp,
    potential: gdp,
    inflation: parameters.initialInflation,
    rate: parameters.initialRate,
    unemployment: parameters.initialUnemployment,
    population: parameters.initialPopulation,
  };
}
