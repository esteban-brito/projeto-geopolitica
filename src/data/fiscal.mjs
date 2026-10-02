/* PARÂMETROS FISCAIS — as constantes que LASTRO consome.
   ⚠ FICÇÃO com inspiração na realidade, como o resto do catálogo.
   Nenhum destes números cita fonte porque nenhum e afirmação sobre o Brasil. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const FISCAL_SCHEMA = {
  taxLoad: { kind: "number", min: 0, max: 1 },
  mandatoryGrowth: { kind: "number", min: 0, max: 0.2 },
  primaryTarget: { kind: "number", min: -0.1, max: 0.1 },
  primaryBand: { kind: "number", min: 0, max: 0.05 },
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
 * @property {number} primaryTarget - a meta de resultado primario, em fracao do PIB
 * @property {number} primaryBand - a tolerancia da meta, para cada lado
 * @property {number} expenseGrowthShare - o teto do arcabouco
 * @property {number} expenseGrowthFloor - crescimento REAL minimo da despesa, ao ano
 * @property {number} expenseGrowthCap - crescimento REAL maximo da despesa, ao ano
 * @property {number} seatPrice - custo MENSAL de manter uma cadeira a verba cheia
 * @property {number} initialGdp - PIB anual inicial, em bilhoes
 * @property {number} initialMandatory - despesa obrigatoria anual inicial, em bilhoes
 * @property {number} initialDiscretionary - discricionario anual inicial; com a
 * obrigatória ele forma a ancora de despesa do primeiro exercício
 * @property {number} initialDebtRatio - divida bruta sobre PIB
 */

/** @type {FiscalParameters} */
export const FISCAL = {
  /* E o último termo do achado número um do handoff, e o único que e calibragem e não
     mecânica: receita 2.400 contra despesa 2.330 → superávit de 70 bi/ano receita 2.280
     contra despesa 2.330 → DÉFICIT de 50 bi/ano O Brasil roda déficit primário, e o modelo
     não conseguia rodar nenhum — não por uma trava, mas porque a receita nascia acima da
     despesa e o teto do arcabouço e uma ancora na DESPESA. */
  taxLoad: 0.19,
  /* Rubrica a rubrica, sobre os R$ 2.157 bi que a soma dos pisos produz: R$ 1.325 bi (61%)
     aposentadoria urbana e rural, BPC, transferência de renda, abono e seguro — estes SIM
     crescem sozinhos, ~3% real ao ano, por demografia e pela regra do salario minimo; R$  398
     bi (18%) folha e inativos, civis e militares — ~0% real. */
  mandatoryGrowth: 0.0216,
  /* A META DE RESULTADO PRIMÁRIO. Fonte: LDO 2027 — superávit de 0,5% do PIB, R$ 73,2 bi.
     ⚠ ELA E O QUE SEPARA OS DOIS INSTRUMENTOS: o BLOQUEIO nasce do teto do arcabouço e e
     aritmética; o CONTINGENCIAMENTO nasce daqui, da receita que frustrou contra a meta. */
  primaryTarget: 0.005,
  /* A banda da meta, para cada lado. Fonte: a LDO fixa 0,25 ponto do PIB — em 2025, meta
     de 0,5% com intervalo de 0,25% a 0,75%. */
  primaryBand: 0.0025,
  /* 70% do crescimento da receita — o número do arcabouço de verdade. */
  expenseGrowthShare: 0.7,
  /* ── A BANDA REAL, e ela era a OMISSÃO DECLARADA no topo deste arquivo ─────── A LC
     200/2023 não repassa 70% da receita e pronto: ela limita o crescimento REAL da despesa a
     uma banda de 0,6% a 2,5% ao ano. */
  expenseGrowthFloor: 0.006,
  expenseGrowthCap: 0.025,
  /* A emenda individual impositiva vale ~R$ 38 mi por deputado ao ano, o que daria 0,003 aqui
     — e a esse preço 6% do caixa compraria o plenario inteiro, todo mês, para sempre. */
  seatPrice: 0.05,
  /* PIB nominal de 2025, arredondado. Fonte: IBGE. */
  initialGdp: 12000,
  /* A DESPESA OBRIGATÓRIA E A SOMA DOS PISOS DOS PROGRAMAS, e não um número independente:
     `tests/suites/agenda.mjs` prova que os dois batem. */
  /* ⚠ OS DOIS PERDERAM A DESONERAÇÃO, e isso e RECLASSIFICACAO e não recalibragem: ela saiu
     da despesa e virou renúncia de receita, então os mesmos R$ 19,84 bi que ela ocupava aqui
     agora abatem a arrecadação. A conta e explicita — do piso saem (31 × 48%) = 14,88, e de
     acima do piso (31 × 16%) = 4,96. O primário de posse não se move: −51,2 antes e depois. */
  initialMandatory: 2139,
  initialDiscretionary: 171,
  /* Dívida bruta do governo geral sobre o PIB. Fonte: BCB. */
  initialDebtRatio: 0.78,
};
