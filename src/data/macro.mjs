/* PARAMETROS MACROECONOMICOS — as constantes que CORRENTE consome. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const MACRO_SCHEMA = {
  potentialGrowth: { kind: "number", min: -0.1, max: 0.2 },
  capacityLift: { kind: "number", min: 0, max: 0.5 },
  taxDrag: { kind: "number", min: 0, max: 5 },
  rateDrag: { kind: "number", min: 0, max: 5 },
  fiscalMultiplier: { kind: "number", min: 0, max: 5 },
  inflationTarget: { kind: "number", min: 0, max: 0.2 },
  inflationTolerance: { kind: "number", min: 0, max: 0.1 },
  anchoring: { kind: "number", min: 0, max: 1 },
  phillips: { kind: "number", min: 0, max: 5 },
  neutralRate: { kind: "number", min: 0, max: 0.2 },
  taylorInflation: { kind: "number", min: 0, max: 5 },
  taylorGap: { kind: "number", min: 0, max: 5 },
  rateSmoothing: { kind: "number", min: 0, max: 1 },
  naturalUnemployment: { kind: "number", min: 0, max: 0.3 },
  okun: { kind: "number", min: 0, max: 5 },
  floatingDebt: { kind: "number", min: 0, max: 1 },
  legacyRate: { kind: "number", min: 0, max: 0.5 },
  riskPremium: { kind: "number", min: 0, max: 20 },
  initialInflation: { kind: "number", min: 0, max: 0.5 },
  initialRate: { kind: "number", min: 0, max: 0.5 },
  initialUnemployment: { kind: "number", min: 0, max: 0.5 },
  initialPopulation: { kind: "number", min: 1 },
  populationGrowth: { kind: "number", min: -0.05, max: 0.05 },
};

/**
 * @typedef {object} MacroParameters
 * @property {number} potentialGrowth - crescimento potencial anual de base
 * @property {number} capacityLift - quanto a capacidade do Estado soma ao potencial
 * @property {number} taxDrag - quanto 1 ponto de carga tributaria tira do PIB
 * @property {number} rateDrag - quanto 1 ponto de juro real tira do PIB
 * @property {number} fiscalMultiplier - quanto o impulso fiscal soma ao PIB
 * @property {number} inflationTarget - a meta
 * @property {number} inflationTolerance - a banda da meta, para cada lado
 * @property {number} anchoring - o quanto a expectativa gruda na meta, de 0 a 1
 * @property {number} phillips - quanto o hiato pressiona preco
 * @property {number} neutralRate - o juro real que nem estimula nem freia
 * @property {number} taylorInflation - reacao do BC ao desvio da meta
 * @property {number} taylorGap - reacao do BC ao hiato
 * @property {number} rateSmoothing - o quanto o BC alisa o proprio movimento
 * @property {number} naturalUnemployment - a taxa que sobra com hiato zero
 * @property {number} okun - quanto o hiato move o desemprego
 * @property {number} floatingDebt - fracao da divida atrelada a taxa basica
 * @property {number} legacyRate - o custo medio do estoque que NAO acompanha a taxa
 * @property {number} riskPremium - a inclinacao do premio de risco, por ponto ao
 * quadrado de divida acima da herdada
 * @property {number} initialInflation
 * @property {number} initialRate
 * @property {number} initialUnemployment
 * @property {number} initialPopulation - em milhoes
 * @property {number} populationGrowth - ao ano
 */

/** @type {MacroParameters} */
export const MACRO = {
  /* Fonte: consenso de estimativas de PIB potencial, na faixa de 1,5% a 2,5%. */
  potentialGrowth: 0.02,
  /* A 0,03, um pais com todos os indices no teto cresce ~5% em vez de 2% — que e a distancia
     entre o Brasil e um pais que resolveu seus gargalos. */
  capacityLift: 0.03,
  /* A 0,35, subir a carga em 1 ponto do PIB tira 0,35 ponto de crescimento — na faixa das
     estimativas de multiplicador tributario para o Brasil, que ficam entre 0,2 e 0,6
     dependendo do tributo. */
  taxDrag: 0.35,
  /* Juro real freia. */
  rateDrag: 0.25,
  /* Gasto publico estimula, e MENOS do que ele custa: multiplicador abaixo de 1 e o consenso
     para gasto corrente em economia com juro alto. */
  fiscalMultiplier: 0.6,

  /* Meta de inflacao continua, 3%. Fonte: CMN. */
  inflationTarget: 0.03,
  /* A banda de tolerancia do regime, 1,5 ponto para cada lado. Fonte: CMN.
     ⚠ ELA MORA AQUI E NAO NA TELA: duas telas liam a mesma pergunta com reguas
     diferentes — Financas acusava a partir de 4,5% e a barra so a partir de 7,5%. */
  inflationTolerance: 0.015,
  /* A 0,6, a expectativa e 60% meta e 40% inflacao passada — um pais com credibilidade
     imperfeita, que e o caso. */
  anchoring: 0.6,
  phillips: 0.35,

  /* Juro real neutro. Fonte: estimativas do BCB, faixa de 4,5% a 5,5%. */
  neutralRate: 0.05,
  /* Taylor: o BC reage mais a inflacao do que a hiato, e alisa o movimento. */
  taylorInflation: 1.5,
  taylorGap: 0.5,
  rateSmoothing: 0.7,

  /* Fonte: PNAD Continua, faixa estrutural de 7% a 9%. */
  naturalUnemployment: 0.08,
  okun: 0.4,

  /* ⚠ A FRACAO DA DIVIDA QUE ACOMPANHA A SELIC, e ela e a peca que faz juro alto virar
     crise fiscal. A ancora e publica: cada 1 p.p. de Selic custa cerca de R$ 40 bi ao ano,
     e com divida bruta perto de R$ 9,4 tri isso da 45% do estoque atrelado a taxa basica. */
  floatingDebt: 0.45,
  /* ⚠ O RESTO DO ESTOQUE TAMBEM PAGA JURO, e esquecer isso foi o defeito que a simulacao
     pegou. */
  legacyRate: 0.09,

  /* A INCLINACAO DO PREMIO DE RISCO, e ela e PRIMEIRO CHUTE DECLARADO — como o PIVOT de
     ECLUSA e o TABLE da Mesa. O que NAO e chute e a forma: convexa, porque o mercado
     tolera e depois foge. Em cima da divida herdada de 78%, +10 p.p. custam 0,5 ponto de
     juro a mais e incomodam; +20 p.p. custam 2,0 e doem; +50 p.p. custam 12,5 e sao crise.
     Um premio LINEAR ensinaria que "mais um pouco" custa igual no comeco e na beira do
     abismo. Ver `premiumOf` em `src/domain/economy/`. */
  riskPremium: 0.5,

  initialInflation: 0.042,
  initialRate: 0.105,
  initialUnemployment: 0.068,
  /* Populacao em milhoes, e o crescimento que o IBGE projeta — desacelerando, e e por isso
     que o bonus demografico acabou e a previdencia aperta. */
  initialPopulation: 213,
  populationGrowth: 0.004,
};
