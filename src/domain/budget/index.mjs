/* LASTRO — receita do PIB, despesa obrigatoria, teto e gatilhos de aperto.
   O motor tratava bloqueio (teto) e contingenciamento (meta) como o mesmo conceito. */

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
 * @property {boolean} blocked - a obrigatoria sozinha ja fura o teto do arcabouco
 * @property {number} primary - o resultado primario do mes, ANUALIZADO e em fracao do PIB
 * @property {number} primaryTarget - a meta do ano, na mesma unidade
 * @property {number} primaryFloor - o piso da banda da meta, na mesma unidade
 * @property {boolean} atRisk - o primario caiu abaixo da banda: contingenciamento
 */

/**
 * @param {number} gdp
 * @param {number} taxLoad
 */
export function revenueOf(gdp, taxLoad) {
  return gdp * taxLoad;
}

/**
 * A inflacao indexa a despesa obrigatoria: sua ausencia distorcia o modelo.
 * @param {number} mandatory
 * @param {number} annualRate crescimento REAL ao ano
 * @param {number} [inflation] ao ano, em fracao; zero reproduz o comportamento antigo
 */
export function growMandatory(mandatory, annualRate, inflation = 0) {
  const nominal = (1 + annualRate) * (1 + inflation) - 1;
  return mandatory * (1 + nominal) ** (1 / MONTHS_PER_YEAR);
}

/**
 * Com PIB nominal a 6% ao ano da 4,2% de crescimento do teto (0,2% reais).
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
  /* Ancora zerada geraria Infinity sem lancar erro, gerando teto absurdo na tela. */
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

  /* A base e devolvida separada: a simulacao pegou divida explodindo em 1066% do PIB. */
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

  /* Medido em 48 meses: programas no maximo fechavam o mes com o mesmo saldo de nao fazer nada. */
  const allowance = blocked ? 0 : Math.max(0, room);

  const balance = cash / MONTHS_PER_YEAR - input.spent;
  const debt = input.debt - balance;

  /* O resultado primario do mes e anualizado para comparacao direta com a meta da LDO. */
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
