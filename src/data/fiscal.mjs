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
  seatPrice: { kind: "number", min: 0, max: 10 },
  initialGdp: { kind: "number", min: 1 },
  initialMandatory: { kind: "number", min: 1 },
  initialDiscretionary: { kind: "number", min: 0 },
  initialDebtRatio: { kind: "number", min: 0, max: 3 },
};

/**
 * @typedef {object} FiscalParameters
 * @property {number} taxLoad - carga tributaria como fracao do PIB
 * @property {number} mandatoryGrowth - crescimento vegetativo real ao ano
 * @property {number} expenseGrowthShare - o teto do arcabouco
 * @property {number} seatPrice - custo MENSAL de manter uma cadeira a verba cheia
 * @property {number} initialGdp - PIB anual inicial, em bilhoes
 * @property {number} initialMandatory - despesa obrigatoria anual inicial, em bilhoes
 * @property {number} initialDiscretionary - discricionario anual inicial; com a
 *   obrigatoria ele forma a ancora de despesa do primeiro exercicio
 * @property {number} initialDebtRatio - divida bruta sobre PIB
 */

/** @type {FiscalParameters} */
export const FISCAL = {
  taxLoad: 0.33,
  mandatoryGrowth: 0.025,
  expenseGrowthShare: 0.7,
  /* O PRECO DA CADEIRA e o cambio entre os dois motores: ele traduz "verba
     oferecida", que a votacao entende como fracao de 0 a 1, em bilhoes que saem
     do discricionario. Sem ele os dois motores ficariam em moedas diferentes e o
     acoplamento seria uma regra escrita a mao em vez de uma conta.

     O NUMERO SAI DE UMA RAZAO, e nao de gosto: o discricionario nasce perto de
     27 bilhoes por mes, e comprar as 513 cadeiras a verba cheia tem de ser
     IMPOSSIVEL — senao existe uma jogada dominante e a escolha de a quem pagar
     deixa de ser escolha. A 0,09 o plenario inteiro custa 46,2, quase o dobro do
     que cabe no mes; o centrao sozinho custa 18,5, que cabe e doi. */
  seatPrice: 0.09,
  initialGdp: 11000,
  initialMandatory: 3270,
  initialDiscretionary: 330,
  initialDebtRatio: 0.78,
};
