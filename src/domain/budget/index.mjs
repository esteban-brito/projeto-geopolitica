/* LASTRO — receita do PIB, obrigatoria em valor absoluto, teto do arcabouco e o
   gatilho de contingenciamento. */

/* A razao despesa/receita passa a ser EMERGENTE: nasce perto de 90%, sobe sozinha quando o
   PIB decepciona, e espreme o discricionario contra o zero.
   O espaco discricionario e a moeda real do jogo: e com ele que ECLUSA paga.
   Juros sobre a divida. Eles dependem da Selic, que e CORRENTE, e um numero
   inventado aqui viraria divida silenciosa no momento em que o motor certo
   nascesse. A divida cresce por deficit primario e so. */

const MONTHS_PER_YEAR = 12;

/**
 * @typedef {import("../../data/fiscal.mjs").FiscalParameters} FiscalParameters
 * @typedef {object} BudgetInput
 * @property {number} gdp - PIB anualizado corrente
 * @property {number} mandatory - despesa obrigatoria ANUALIZADA corrente
 * @property {number} anchorRevenue - receita do exercicio anterior; a ancora da regra
 * @property {number} anchorExpense - despesa total do exercicio anterior
 * @property {number} debt - divida bruta
 * @property {number} spent - discricionario efetivamente empenhado NO MES
 * @property {number} [inflation] - ao ano; e ela que indexa a despesa obrigatoria
 * @property {number} [elapsed] - quanto do exercicio ja correu, de 0 a 1; a banda
 * do arcabouco e ANUAL e o turno e mensal, e sem isto o piso dela entrega o
 * crescimento de um ano inteiro no primeiro mes
 * @property {FiscalParameters} parameters
 * @property {number} [revenueFactor] - o quanto a maquina de arrecadar rende hoje
 * @property {number} [mandatoryFactor] - o quanto o servico publico encarece a obrigatoria
 * @typedef {object} BudgetOutput
 * @property {number} revenue - receita anualizada, ja com o fator
 * @property {number} mandatory - obrigatoria anualizada, ja crescida e ja com o fator
 * @property {number} revenueBase - receita SEM o fator
 * @property {number} mandatoryBase - obrigatoria crescida SEM o fator
 * @property {number} cash - receita menos obrigatoria: quanto EXISTE
 * @property {number} ceiling - o teto de despesa que o arcabouco permite
 * @property {number} allowance - quanto se pode empenhar: o MENOR entre caixa e regra
 * @property {number} balance - saldo primario DO MES
 * @property {number} debt
 * @property {number} debtRatio - divida sobre PIB
 * @property {boolean} contingency - a obrigatoria sozinha ja fura o teto
 */

/**
 * Receita anualizada.
 *
 * @param {number} gdp
 * @param {number} taxLoad
 */
export function revenueOf(gdp, taxLoad) {
  return gdp * taxLoad;
}

/**
 * ⚠ A INFLACAO ENTRA AQUI, E A AUSENCIA DELA ERA UM DEFEITO MEDIDO.
 *
 * @param {number} mandatory
 * @param {number} annualRate crescimento REAL ao ano
 * @param {number} [inflation] ao ano, em fracao; zero reproduz o comportamento antigo
 */
export function growMandatory(mandatory, annualRate, inflation = 0) {
  const nominal = (1 + annualRate) * (1 + inflation) - 1;
  return mandatory * (1 + nominal) ** (1 / MONTHS_PER_YEAR);
}

/**
 * Com PIB nominal a 6% ao ano isso da 4,2% de crescimento do teto — que sao 0,2% REAIS.
 *
 * @param {number} anchorExpense
 * @param {number} anchorRevenue
 * @param {number} revenue
 * @param {number} share
 * @param {number} [floor] crescimento REAL minimo ao ano; sem ele, a regra antiga
 * @param {number} [cap] crescimento REAL maximo ao ano
 * @param {number} [inflation] ao ano — o deflator que torna a banda REAL
 * @param {number} [elapsed] quanto do exercicio ja correu, de 0 a 1
 */
export function ceilingOf(
  anchorExpense,
  anchorRevenue,
  revenue,
  share,
  floor,
  cap,
  inflation = 0,
  elapsed = 1,
) {
  /* Ancora zerada nao existe em partida valida, mas divisao por zero produz `Infinity` que
     atravessa o motor inteiro sem lancar — e ai o defeito aparece como um teto absurdo tres
     telas adiante. */
  if (anchorRevenue <= 0) return anchorExpense;
  const growth = (revenue - anchorRevenue) / anchorRevenue;

  /* SEM BANDA DECLARADA, A REGRA ANTIGA. */
  if (floor === undefined || cap === undefined) return anchorExpense * (1 + share * growth);

  /* O REPASSE E SOBRE O CRESCIMENTO REAL, e a banda tambem e real.
     so, que e a familia do hiato nominal que a CORRENTE ja pagou uma vez. */
  const accrued = (1 + inflation) ** elapsed - 1;
  const real = (1 + growth) / (1 + accrued) - 1;
  const allowed = Math.min(cap, Math.max(floor, share * real));

  /* E o teto volta a ser NOMINAL, porque a despesa se paga em dinheiro do ano. */
  return anchorExpense * (1 + allowed) ** elapsed * (1 + accrued);
}

/**
 * Resolve um mes de orcamento.
 *
 * @param {BudgetInput} input
 * @returns {BudgetOutput}
 */
export function step(input) {
  const { parameters } = input;

  /* OS DOIS FATORES ENTRAM POR PARAMETRO e valem 1 quando ninguem os passa. */
  /* ⚠ A BASE E DEVOLVIDA SEPARADA, e isso nao e conveniencia — e a correcao de um defeito que
     a simulacao pegou com a divida em 1066% do PIB. */
  const revenueBase = revenueOf(input.gdp, parameters.taxLoad);
  const mandatoryBase = growMandatory(
    input.mandatory,
    parameters.mandatoryGrowth,
    input.inflation ?? 0,
  );

  const revenue = revenueBase * (input.revenueFactor ?? 1);
  const mandatory = mandatoryBase * (input.mandatoryFactor ?? 1);

  const cash = revenue - mandatory;
  const ceiling = ceilingOf(
    input.anchorExpense,
    input.anchorRevenue,
    revenue,
    parameters.expenseGrowthShare,
    parameters.expenseGrowthFloor,
    parameters.expenseGrowthCap,
    input.inflation ?? 0,
    input.elapsed ?? 1,
  );

  /* O espaco que a REGRA abre, que nao e o mesmo que o caixa disponivel. */
  const room = ceiling - mandatory;

  /* CONTINGENCIAMENTO e o caso em que nem a obrigatoria cabe no teto.
     e ECLUSA, porque emenda sai daqui. */
  const contingency = room < 0;

  /* Medido em 48 meses: um governo que poe os 38 programas no MAXIMO e paga verba cheia a
     todas as bancadas fecha o mes com o mesmo saldo de um que nao faz nada. */
  const allowance = contingency ? 0 : Math.max(0, room);

  /* O saldo e do MES: o caixa anualizado dividido por doze, menos o que foi efetivamente
     empenhado neste turno. */
  const balance = cash / MONTHS_PER_YEAR - input.spent;
  const debt = input.debt - balance;

  return {
    revenue,
    mandatory,
    revenueBase,
    mandatoryBase,
    cash,
    ceiling,
    allowance,
    balance,
    debt,
    debtRatio: input.gdp > 0 ? debt / input.gdp : 0,
    contingency,
  };
}
