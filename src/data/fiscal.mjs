/* PARAMETROS FISCAIS — as constantes que LASTRO consome.
   ⚠ FICCAO com inspiracao na realidade, como o resto do catalogo.
   Nenhum destes numeros cita fonte porque nenhum e afirmacao sobre o Brasil. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const FISCAL_SCHEMA = {
  taxLoad: { kind: "number", min: 0, max: 1 },
  mandatoryGrowth: { kind: "number", min: 0, max: 0.2 },
  expenseGrowthShare: { kind: "number", min: 0, max: 1 },
  expenseGrowthFloor: { kind: "number", min: 0, max: 0.2 },
  expenseGrowthCap: { kind: "number", min: 0, max: 0.2 },
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
 * @property {number} expenseGrowthFloor - crescimento REAL minimo da despesa, ao ano
 * @property {number} expenseGrowthCap - crescimento REAL maximo da despesa, ao ano
 * @property {number} seatPrice - custo MENSAL de manter uma cadeira a verba cheia
 * @property {number} initialGdp - PIB anual inicial, em bilhoes
 * @property {number} initialMandatory - despesa obrigatoria anual inicial, em bilhoes
 * @property {number} initialDiscretionary - discricionario anual inicial; com a
 * obrigatoria ele forma a ancora de despesa do primeiro exercicio
 * @property {number} initialDebtRatio - divida bruta sobre PIB
 */

/** @type {FiscalParameters} */
export const FISCAL = {
  /* E o ultimo termo do achado numero um do handoff, e o unico que e calibragem e nao
     mecanica: receita 2.400 contra despesa 2.330 → superavit de 70 bi/ano receita 2.280
     contra despesa 2.330 → DEFICIT de 50 bi/ano O Brasil roda deficit primario, e o modelo
     nao conseguia rodar nenhum — nao por uma trava, mas porque a receita nascia acima da
     despesa e o teto do arcabouco e uma ancora na DESPESA. */
  taxLoad: 0.19,
  /* Rubrica a rubrica, sobre os R$ 2.157 bi que a soma dos pisos produz: R$ 1.325 bi (61%)
     aposentadoria urbana e rural, BPC, transferencia de renda, abono e seguro — estes SIM
     crescem sozinhos, ~3% real ao ano, por demografia e pela regra do salario minimo; R$  398
     bi (18%) folha e inativos, civis e militares — ~0% real. */
  mandatoryGrowth: 0.0216,
  /* 70% do crescimento da receita — o numero do arcabouco de verdade. */
  expenseGrowthShare: 0.7,
  /* ── A BANDA REAL, e ela era a OMISSAO DECLARADA no topo deste arquivo ─────── A LC
     200/2023 nao repassa 70% da receita e pronto: ela limita o crescimento REAL da despesa a
     uma banda de 0,6% a 2,5% ao ano. */
  expenseGrowthFloor: 0.006,
  expenseGrowthCap: 0.025,
  /* A emenda individual impositiva vale ~R$ 38 mi por deputado ao ano, o que daria 0,003 aqui
     — e a esse preco 6% do caixa compraria o plenario inteiro, todo mes, para sempre. */
  seatPrice: 0.05,
  /* PIB nominal de 2025, arredondado. Fonte: IBGE. */
  initialGdp: 12000,
  /* A DESPESA OBRIGATORIA E A SOMA DOS PISOS DOS PROGRAMAS, e nao um numero independente:
     `tests/suites/agenda.mjs` prova que os dois batem. */
  /* ⚠ OS DOIS PERDERAM A DESONERACAO, e isso e RECLASSIFICACAO e nao recalibragem: ela saiu
     da despesa e virou renuncia de receita, entao os mesmos R$ 19,84 bi que ela ocupava aqui
     agora abatem a arrecadacao. A conta e explicita — do piso saem (31 × 48%) = 14,88, e de
     acima do piso (31 × 16%) = 4,96. O primario de posse nao se move: −51,2 antes e depois. */
  initialMandatory: 2139,
  initialDiscretionary: 171,
  /* Divida bruta do governo geral sobre o PIB. Fonte: BCB. */
  initialDebtRatio: 0.78,
};
