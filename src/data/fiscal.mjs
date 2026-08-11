/* PARAMETROS FISCAIS — as constantes que LASTRO consome.
   ══════════════════════════════════════════════════════════════════════════════

   ⚠ FICCAO com inspiracao na realidade, como o resto do catalogo. Nenhum destes
   numeros cita fonte porque nenhum e afirmacao sobre o Brasil.

   ── A CORRECAO QUE FAZ A ARMADILHA EXISTIR ───────────────────────────────────
   O dossie de origem declarava a despesa obrigatoria como "90% da receita".
   Escrita assim ela NAO e uma restricao: se a despesa e definida como uma fracao
   da receita, o caixa discricionario e sempre os outros 10%, cai junto quando a
   receita cai, e nunca aperta. O gatilho de contingenciamento jamais dispararia.

   A armadilha so existe se a despesa obrigatoria for um VALOR ABSOLUTO que
   cresce por conta propria — salario, aposentadoria e beneficio nao consultam a
   arrecadacao para subir. Entao aqui ela nasce como valor, cresce
   vegetativamente, e a razao despesa/receita e EMERGENTE: comeca perto de 90% e
   sobe sozinha quando o PIB decepciona, espremendo o discricionario contra o
   zero. E o mesmo mecanismo que o dossie descreve em prosa e impede na formula.

   ── O ARCABOUCO ──────────────────────────────────────────────────────────────
   A despesa nao pode crescer mais que `EXPENSE_GROWTH_SHARE` do crescimento da
   receita. A versao real tem ainda uma banda de crescimento real minimo e
   maximo; ela fica de fora por enquanto, e fica DECLARADO que fica — parametro
   omitido em silencio e o que faz a proxima sessao achar que o modelo e fiel. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const FISCAL_SCHEMA = {
  taxLoad: { kind: "number", min: 0, max: 1 },
  mandatoryGrowth: { kind: "number", min: 0, max: 0.2 },
  expenseGrowthShare: { kind: "number", min: 0, max: 1 },
  initialGdp: { kind: "number", min: 1 },
  initialMandatory: { kind: "number", min: 1 },
  initialDebtRatio: { kind: "number", min: 0, max: 3 },
};

/**
 * @typedef {object} FiscalParameters
 * @property {number} taxLoad - carga tributaria como fracao do PIB
 * @property {number} mandatoryGrowth - crescimento vegetativo real ao ano
 * @property {number} expenseGrowthShare - o teto do arcabouco
 * @property {number} initialGdp - PIB anual inicial, em bilhoes
 * @property {number} initialMandatory - despesa obrigatoria anual inicial, em bilhoes
 * @property {number} initialDebtRatio - divida bruta sobre PIB
 */

/** @type {FiscalParameters} */
export const FISCAL = {
  taxLoad: 0.33,
  mandatoryGrowth: 0.025,
  expenseGrowthShare: 0.7,
  initialGdp: 11000,
  initialMandatory: 3270,
  initialDebtRatio: 0.78,
};
