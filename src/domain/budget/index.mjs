/* LASTRO — receita do PIB, despesa obrigatória, teto e gatilhos de aperto.
   O motor tratava bloqueio (teto) e contingenciamento (meta) como o mesmo conceito. */

const MONTHS_PER_YEAR = 12;

/**
 * @typedef {import("../../data/fiscal.mjs").FiscalParameters} FiscalParameters
 * @typedef {object} BudgetInput
 * @property {number} gdp - PIB anualizado corrente
 * @property {number} mandatory - despesa obrigatória ANUALIZADA corrente
 * @property {number} anchorRevenue - receita do exercício anterior; a âncora da regra
 * @property {number} anchorExpense - despesa total do exercício anterior
 * @property {number} debt - dívida bruta
 * @property {number} spent - discricionário efetivamente empenhado NO MÊS
 * @property {number} [inflation] - ao ano; é ela que indexa a despesa obrigatória
 * @property {number} [elapsed] - quanto do exercício já correu, de 0 a 1; a banda
 * do arcabouço é ANUAL e o turno é mensal, e sem isto o piso dela entrega o
 * crescimento de um ano inteiro no primeiro mês
 * @property {FiscalParameters} parameters
 * @property {number} [revenueFactor] - o quanto a máquina de arrecadar rende hoje
 * @property {number} [mandatoryFactor] - o quanto o serviço público encarece a obrigatória
 * @typedef {object} BudgetOutput
 * @property {number} revenue - receita anualizada, já com o fator
 * @property {number} mandatory - obrigatória anualizada, já crescida e já com o fator
 * @property {number} revenueBase - receita SEM o fator
 * @property {number} mandatoryBase - obrigatória crescida SEM o fator
 * @property {number} cash - receita menos obrigatória: quanto EXISTE
 * @property {number} ceiling - o teto de despesa que o arcabouço permite
 * @property {number} allowance - quanto se pode empenhar: o MENOR entre caixa e regra
 * @property {number} balance - saldo primário DO MÊS
 * @property {number} debt
 * @property {number} debtRatio - dívida sobre PIB
 * @property {boolean} blocked - a obrigatória sozinha já fura o teto do arcabouço
 * @property {number} primary - o resultado primário do mês, ANUALIZADO e em fração do PIB
 * @property {number} primaryTarget - a meta do ano, na mesma unidade
 * @property {number} primaryFloor - o piso da banda da meta, na mesma unidade
 * @property {boolean} atRisk - o primário caiu abaixo da banda: contingenciamento
 */

/**
 * @param {number} gdp
 * @param {number} taxLoad
 */
export function revenueOf(gdp, taxLoad) {
  return gdp * taxLoad;
}

/**
 * A inflação indexa a despesa obrigatória: sua ausência distorcia o modelo.
 * @param {number} mandatory
 * @param {number} annualRate crescimento REAL ao ano
 * @param {number} [inflation] ao ano, em fração; zero reproduz o comportamento antigo
 */
export function growMandatory(mandatory, annualRate, inflation = 0) {
  const nominal = (1 + annualRate) * (1 + inflation) - 1;
  return mandatory * (1 + nominal) ** (1 / MONTHS_PER_YEAR);
}

/**
 * Com PIB nominal a 6% ao ano dá 4,2% de crescimento do teto (0,2% reais).
 * @param {number} anchorExpense
 * @param {number} anchorRevenue
 * @param {number} revenue
 * @param {number} share
 * @param {number} [floor] crescimento REAL mínimo ao ano; sem ele, a regra antiga
 * @param {number} [cap] crescimento REAL máximo ao ano
 * @param {number} [inflation] ao ano — o deflator que torna a banda REAL
 * @param {number} [elapsed] quanto do exercício já correu, de 0 a 1
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
  /* Âncora zerada geraria Infinity sem lançar erro, gerando teto absurdo na tela. */
  if (anchorRevenue <= 0) return anchorExpense;
  const growth = (revenue - anchorRevenue) / anchorRevenue;

  if (floor === undefined || cap === undefined) return anchorExpense * (1 + share * growth);

  const accrued = (1 + inflation) ** elapsed - 1;
  const real = (1 + growth) / (1 + accrued) - 1;
  const allowed = Math.min(cap, Math.max(floor, share * real));

  return anchorExpense * (1 + allowed) ** elapsed * (1 + accrued);
}

/**
 * @param {BudgetInput} input
 * @returns {BudgetOutput}
 */
export function step(input) {
  const { parameters } = input;

  /* A base é devolvida separada: a simulação pegou dívida explodindo em 1066% do PIB. */
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

  const room = ceiling - mandatory;

  const blocked = room < 0;

  /* Medido em 48 meses: programas no máximo fechavam o mês com o mesmo saldo de não fazer nada. */
  const allowance = blocked ? 0 : Math.max(0, room);

  const balance = cash / MONTHS_PER_YEAR - input.spent;
  const debt = input.debt - balance;

  /* O resultado primário do mês é anualizado para comparação direta com a meta da LDO. */
  const primary = input.gdp > 0 ? (balance * MONTHS_PER_YEAR) / input.gdp : 0;
  const primaryFloor = parameters.primaryTarget - parameters.primaryBand;

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
    blocked,
    primary,
    primaryTarget: parameters.primaryTarget,
    primaryFloor,
    atRisk: primary < primaryFloor,
  };
}
