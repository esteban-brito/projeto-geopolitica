/* PARAMETROS MACROECONOMICOS — as constantes que CORRENTE consome.
   ══════════════════════════════════════════════════════════════════════════════

   ⚠ NUMEROS REAIS, datados, como o resto do catalogo desde 13/08/2026. O que e
   ficcao e o que o modelo FAZ com eles.

   ── AS QUATRO EQUACOES, E POR QUE SAO ESSAS ─────────────────────────────────
   Este e o menor motor macro que da PRECO ao imposto. Sem ele, subir aliquota e
   receita de graca e existe uma jogada dominante: taxar tudo no maximo, pagar o
   custo politico uma vez, e governar com dinheiro infinito para sempre.

     HIATO      quanto o PIB esta acima ou abaixo do que o pais consegue produzir;
     PHILLIPS   hiato positivo pressiona preco;
     TAYLOR     inflacao acima da meta levanta juro;
     OKUN       hiato positivo derruba desemprego.

   Sao as quatro relacoes que qualquer banco central do mundo usa para conversar
   consigo mesmo. Nao sao "o modelo certo" — sao o modelo COMUM, e usar o comum e
   o que permite calibrar contra numero publicado em vez de contra intuicao.

   ── O QUE ESTE MOTOR NAO FAZ, declarado ─────────────────────────────────────
   Cambio, setor externo, expectativa de mercado formada por credibilidade, e
   composicao setorial do PIB. Os quatro sao reais e nenhum deles e necessario
   para o imposto ter preco — que e a razao de este motor existir agora. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const MACRO_SCHEMA = {
  potentialGrowth: { kind: "number", min: -0.1, max: 0.2 },
  capacityLift: { kind: "number", min: 0, max: 0.5 },
  taxDrag: { kind: "number", min: 0, max: 5 },
  rateDrag: { kind: "number", min: 0, max: 5 },
  fiscalMultiplier: { kind: "number", min: 0, max: 5 },
  inflationTarget: { kind: "number", min: 0, max: 0.2 },
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
 * @property {number} initialInflation
 * @property {number} initialRate
 * @property {number} initialUnemployment
 * @property {number} initialPopulation - em milhoes
 * @property {number} populationGrowth - ao ano
 */

/** @type {MacroParameters} */
export const MACRO = {
  /* Crescimento potencial do Brasil, que e baixo e e o problema do pais: a
     economia nao consegue crescer muito sem inflacionar. Fonte: consenso de
     estimativas de PIB potencial, na faixa de 1,5% a 2,5%. */
  potentialGrowth: 0.02,
  /* A CAPACIDADE DO ESTADO LEVANTA O POTENCIAL, e e por aqui que educacao e
     infraestrutura pagam. A 0,03, um pais com todos os indices no teto cresce
     ~5% em vez de 2% — que e a distancia entre o Brasil e um pais que resolveu
     seus gargalos. E como o `lag` da educacao e 24 meses, esse premio chega
     depois do mandato de quem o pagou. */
  capacityLift: 0.03,
  /* ⚠ ESTA CONSTANTE E O PRECO DO IMPOSTO, e sem ela o jogo tem jogada dominante.
     A 0,35, subir a carga em 1 ponto do PIB tira 0,35 ponto de crescimento — na
     faixa das estimativas de multiplicador tributario para o Brasil, que ficam
     entre 0,2 e 0,6 dependendo do tributo. */
  taxDrag: 0.35,
  /* Juro real freia. A 0,25, cada ponto de juro real acima do neutro custa um
     quarto de ponto de PIB — e e por isso que o jogador vai odiar o BC. */
  rateDrag: 0.25,
  /* Gasto publico estimula, e MENOS do que ele custa: multiplicador abaixo de 1 e
     o consenso para gasto corrente em economia com juro alto. Investimento
     multiplica mais, e essa distincao fica declarada como ausente. */
  fiscalMultiplier: 0.6,

  /* Meta de inflacao continua, 3%. Fonte: CMN. */
  inflationTarget: 0.03,
  /* ANCORAGEM PARCIAL. A 0,6, a expectativa e 60% meta e 40% inflacao passada —
     um pais com credibilidade imperfeita, que e o caso. Ancoragem 1 faria a
     inflacao voltar sozinha e o jogador nunca sentir consequencia; ancoragem 0
     faria qualquer choque virar espiral. */
  anchoring: 0.6,
  phillips: 0.35,

  /* Juro real neutro. Fonte: estimativas do BCB, faixa de 4,5% a 5,5%. */
  neutralRate: 0.05,
  /* Taylor: o BC reage mais a inflacao do que a hiato, e alisa o movimento.
     Reagir 1,5 ao desvio e o principio de Taylor — abaixo de 1, subir juro nao
     sobe o juro REAL e o modelo perde a ancora. */
  taylorInflation: 1.5,
  taylorGap: 0.5,
  rateSmoothing: 0.7,

  /* Desemprego que sobra com o PIB no potencial. Fonte: PNAD Continua, faixa
     estrutural de 7% a 9%. */
  naturalUnemployment: 0.08,
  okun: 0.4,

  /* ⚠ A FRACAO DA DIVIDA QUE ACOMPANHA A SELIC, e ela e a peca que faz juro alto
     virar crise fiscal. A ancora e publica e boa: cada 1 p.p. de Selic custa
     cerca de R$ 40 bi ao ano. Com divida bruta perto de R$ 9,4 tri, isso da 45%
     do estoque atrelado a taxa basica — que e a ordem de grandeza real do perfil
     brasileiro. E o que torna "baixar o juro na canetada" uma tentacao com
     consequencia, em vez de um botao sem preco. */
  floatingDebt: 0.45,
  /* ⚠ O RESTO DO ESTOQUE TAMBEM PAGA JURO, e esquecer isso foi o defeito que a
     simulacao pegou. A ancora de R$ 40 bi por ponto de Selic mede a SENSIBILIDADE
     — quanto a conta muda quando a taxa muda —, e nao o custo total. Prefixado e
     indexado a inflacao nao reagem a decisao de hoje, mas cobram todo mes: juntos,
     os dois canais dao perto de R$ 900 bi ao ano, ou 7,5% do PIB, que e a ordem
     real do servico da divida brasileira.

     Sem esta linha, a divida crescia menos que o PIB nominal e o mandato terminava
     com a razao caindo de 78% para 55% sem o jogador ter feito nada — um pais que
     se desendivida sozinho, que e o oposto do Brasil. */
  legacyRate: 0.09,

  initialInflation: 0.042,
  initialRate: 0.105,
  initialUnemployment: 0.068,
  /* Populacao em milhoes, e o crescimento que o IBGE projeta — desacelerando, e
     e por isso que o bonus demografico acabou e a previdencia aperta. */
  initialPopulation: 213,
  populationGrowth: 0.004,
};
