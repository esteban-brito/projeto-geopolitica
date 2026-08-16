/* CORRENTE — economia.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   estado macro, carga tributaria, capacidade do Estado, impulso fiscal
   devolve  PIB, inflacao, juro, desemprego

   ── POR QUE ELE NASCEU AGORA, e nao antes nem depois ────────────────────────
   Pelo criterio do projeto: um botao entra quando o preco dele ja existe. A
   Fazenda vai virar aliquotas, e aliquota sem resposta do PIB e receita de graca
   — a jogada dominante mais obvia que este jogo poderia ter. Este motor existe
   para o imposto CUSTAR.

   ── AS QUATRO EQUACOES ───────────────────────────────────────────────────────
   Sao as relacoes comuns de qualquer modelo de banco central, e usar o comum e
   deliberado: permite calibrar contra numero publicado em vez de contra
   intuicao.

     1. POTENCIAL   quanto o pais consegue produzir. Sobe com a capacidade do
                    Estado — e por aqui que educacao e infraestrutura pagam;
     2. DEMANDA     o PIB efetivo. Impulso fiscal soma, carga tributaria e juro
                    real subtraem;
     3. PHILLIPS    hiato positivo pressiona preco, contra uma expectativa
                    parcialmente ancorada na meta;
     4. TAYLOR      o BC levanta juro quando a inflacao passa da meta;
     5. OKUN        hiato positivo derruba desemprego.

   ── O JURO E A UNICA COISA QUE O JOGADOR SOFRE E NAO CONTROLA ───────────────
   E isso e desenho, e nao limitacao. Tudo mais no jogo se compra ou se decreta;
   a taxa basica nao. Ela e o preco que a irresponsabilidade fiscal cobra por
   fora do Congresso, e e o unico adversario que nao negocia.

   ⚠ E ELA E MUTAVEL, mas por lei: a autonomia do Banco Central e uma alavanca de
   regra. Quem quiser o juro na mao arrasta `autonomia`, cruza clausula petrea, e
   descobre que a inflacao tambem nao negocia. Nao ha muro; ha preco.

   ── O ESTOQUE DA DIVIDA E O CANAL QUE FECHA O CIRCUITO ──────────────────────
   Juro alto nao so freia o PIB: ele cobra do orcamento, porque 45% da divida
   brasileira acompanha a taxa basica. Cada ponto de Selic vale cerca de R$ 40 bi
   ao ano — e e assim que "gastar demais" volta como despesa financeira sem que
   ninguem tenha escrito uma regra dizendo isso.

   ── O QUE ELE NAO FAZ, declarado ────────────────────────────────────────────
   Cambio, setor externo, credibilidade endogena e composicao setorial. Nenhum
   deles e necessario para o imposto ter preco. */

/**
 * @typedef {import("../../data/macro.mjs").MacroParameters} MacroParameters
 *
 * @typedef {object} MacroState o que atravessa os meses
 * @property {number} gdp - PIB nominal anualizado, em bilhoes
 * @property {number} potential - PIB potencial anualizado
 * @property {number} inflation - ao ano, em fracao
 * @property {number} rate - a taxa basica nominal, ao ano
 * @property {number} unemployment - em fracao da forca de trabalho
 * @property {number} population - em milhoes
 *
 * @typedef {object} EconomyInput
 * @property {MacroState} macro
 * @property {MacroParameters} parameters
 * @property {number} taxLoad - carga tributaria corrente, em fracao do PIB
 * @property {number} baseTaxLoad - a carga com que a partida abriu
 * @property {number} capacity - o quanto a capacidade do Estado esta acima do neutro, de -1 a 1
 * @property {number} impulse - o discricionario empenhado no mes sobre o PIB mensal
 * @property {number} [shock] - choque de oferta do mes, em pontos de inflacao anual
 *
 * @typedef {object} EconomyOutput
 * @property {MacroState} macro - a posicao do mes seguinte
 * @property {number} gap - o hiato do produto, em fracao
 * @property {number} realRate - o juro real corrente
 * @property {number} growth - o crescimento REAL anualizado deste mes
 */

const MONTHS_PER_YEAR = 12;

/**
 * Converte uma taxa anual no fator de UM mes, compondo — nunca dividindo.
 * @param {number} annual
 */
function monthly(annual) {
  return (1 + annual) ** (1 / MONTHS_PER_YEAR);
}

/**
 * Um mes de economia.
 *
 * ⚠ FUNCAO PURA e sem sorteio. O choque entra por parametro porque quem sorteia
 * evento e TEMPORAL — um sorteio feito aqui dentro tornaria o mandato
 * irreproduzivel, que e a unica coisa que este projeto nao abre mao.
 *
 * @param {EconomyInput} input
 * @returns {EconomyOutput}
 */
export function step(input) {
  const { macro, parameters: p } = input;

  /* 1 — O POTENCIAL. Ele cresce sozinho a uma taxa baixa, e a capacidade do
     Estado soma a isso. E o unico lugar do jogo em que investir em educacao
     aparece como numero — e aparece 24 meses depois, porque o atraso mora na
     MALHA e chega aqui ja defasado. */
  const potentialRate = p.potentialGrowth + p.capacityLift * input.capacity;
  const potentialReal = macro.potential * monthly(potentialRate);

  /* 2 — A DEMANDA. Tres forcas sobre o potencial, e as duas primeiras sao as que
     o jogador controla.

     ⚠ A CARGA E MEDIDA CONTRA A DE ABERTURA, e nao contra zero. O que freia a
     economia e MUDAR a carga, e nao existir carga: um pais com 20% de carga
     estavel nao esta permanentemente em recessao por causa disso. Medir contra
     zero faria o PIB despencar no primeiro mes sem ninguem ter feito nada. */
  const realRate = macro.rate - macro.inflation;
  const taxDelta = input.taxLoad - input.baseTaxLoad;

  const demand =
    potentialRate -
    p.taxDrag * taxDelta -
    p.rateDrag * (realRate - p.neutralRate) +
    p.fiscalMultiplier * input.impulse;

  const gdpReal = macro.gdp * monthly(demand);

  /* O HIATO E O QUE SOBRA quando o efetivo passa do potencial, e ele e a variavel
     central: Phillips e Okun leem os dois dele.

     ⚠ OS DOIS LADOS TEM DE ESTAR NA MESMA MOEDA, e a primeira versao nao estava.
     Ela comparava o PIB NOMINAL — que ja carregava a inflacao de todos os meses
     anteriores — com um potencial que so crescia em termos reais. O hiato passava
     a medir inflacao acumulada em vez de aquecimento, e o resultado era uma
     economia que fugia sozinha: hiato de 1% no mes 6 virava 7,6% no mes 24, com o
     juro perseguindo em 20% ao ano e ninguem tendo feito nada.

     A correcao e comparar ANTES da inflacao entrar, e depois aplicar o mesmo
     fator aos dois. A razao entre eles fica preservada, e o hiato volta a ser o
     que ele e: uma medida real. */
  const gap = potentialReal > 0 ? (gdpReal - potentialReal) / potentialReal : 0;

  /* 3 — PHILLIPS. A expectativa e uma media entre a meta e a inflacao corrente,
     e o peso e a CREDIBILIDADE. Ancoragem cheia faria a inflacao voltar sozinha e
     o jogador nunca sentir consequencia; ancoragem zero faria qualquer choque
     virar espiral. */
  const expectation = p.anchoring * p.inflationTarget + (1 - p.anchoring) * macro.inflation;
  const inflation = Math.max(-0.05, expectation + p.phillips * gap + (input.shock ?? 0));

  /* 4 — TAYLOR, com suavizacao. O BC nao pula: ele caminha em direcao ao juro que
     a regra pede, e a inercia e o que faz o jogador ter TEMPO de sentir o erro
     antes de a conta chegar inteira. */
  const target =
    p.neutralRate +
    inflation +
    p.taylorInflation * (inflation - p.inflationTarget) +
    p.taylorGap * gap;
  const rate = Math.max(0, p.rateSmoothing * macro.rate + (1 - p.rateSmoothing) * target);

  /* 5 — OKUN. */
  const unemployment = Math.min(0.4, Math.max(0.01, p.naturalUnemployment - p.okun * gap));

  /* O PIB NOMINAL carrega a inflacao junto, porque toda a contabilidade do jogo e
     nominal: receita e fracao do PIB, e divida e razao sobre ele. Separar real de
     nominal aqui pouparia uma multiplicacao e obrigaria o LASTRO a aprender a
     distincao inteira. */
  const price = monthly(inflation);
  const gdp = gdpReal * price;

  return {
    macro: {
      gdp,
      /* O MESMO FATOR DE PRECO nos dois. E isso que mantem o hiato honesto ao
         longo de 48 meses: os dois lados envelhecem juntos. */
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
 * O PREMIO DE RISCO — quanto o mercado cobra ACIMA da taxa basica.
 *
 * ⚠ ELE ESTAVA PROMETIDO NA PROSA E NAO EXISTIA. `turn.mjs` dizia, sobre o juro:
 * "ele nao disputa com hospital — ele engorda a divida, e a divida volta PELO PREMIO
 * DE RISCO". A segunda metade da frase era uma intenção: nada no modelo a cumpria.
 *
 * E ela ficou cara em 16/08/2026, quando o empenho deixou de ser limitado pelo caixa.
 * Antes o governo nao conseguia gastar acima do que arrecadava, entao a divida so
 * andava por juro e o premio seria decorativo. Agora ele PODE se endividar — e um
 * pais que se endivida sem o juro reagir e um pais SEM CREDOR.
 *
 * ── POR QUE AQUI, E NAO NA TAYLOR ────────────────────────────────────────────────
 * Um Banco Central nao sobe juro por risco fiscal: ele sobe por inflacao e hiato, que
 * e o que a regra ja olha. Quem cobra a mais e o CREDOR DO TESOURO, e o que ele cobra
 * e um spread sobre a basica. Somar isso a Taylor confundiria dois agentes com
 * interesses diferentes, e o jogador nao teria como saber qual dos dois reagiu ao que
 * ele fez.
 *
 * ── A FORMA E CONVEXA, E ISSO NAO E ENFEITE ──────────────────────────────────────
 * O mercado nao cobra em linha reta: ele tolera, tolera, e entao foge. Um premio
 * linear ensinaria que endividar-se custa sempre o mesmo por ponto, e a decisao de
 * "mais um pouco" seria identica no comeco e na beira do abismo. Com o quadrado, o
 * primeiro ponto e barato e o vigesimo nao — que e a diferença entre uma conta e um
 * risco.
 *
 * ⚠ E A TOLERANCIA E A DIVIDA HERDADA, e nao um numero escolhido. O mercado JA
 * precificou o pais que o presidente recebeu; o que ele cobra e a DETERIORACAO. Por
 * isso o premio nasce em zero no mes 1 e a serie de abertura fica identica — o mesmo
 * padrao que provou inerte a migracao das faixas para normas. E por isso a tolerancia
 * entra por parametro em vez de morar no catalogo macro: ela ja existe, em
 * `fiscal.initialDebtRatio`, e dois lugares com o mesmo numero e um lugar que vai
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
 *
 * ⚠ A ANCORA E PUBLICA: cada 1 p.p. de taxa basica custa cerca de R$ 40 bi ao ano
 * ao Tesouro. Com divida perto de R$ 9,4 tri, isso implica 45% do estoque
 * atrelado a taxa — que e o que `floatingDebt` declara.
 *
 * ⚠ O PREMIO INCIDE SOBRE O ESTOQUE INTEIRO, e nao so sobre a parte pos-fixada. E a
 * mesma correcao que `legacyRate` ja carrega, pela mesma razao: quem rola divida rola
 * o estoque todo, e quem desconfia do pais cobra mais para rolar qualquer pedaco dele.
 * Aplicar o premio so na fatia flutuante diria que o credor do prefixado nao repara
 * que o devedor piorou.
 *
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
 * O POTENCIAL NASCE IGUAL AO EFETIVO, e isso e uma afirmacao: a partida comeca
 * com hiato zero. Comecar com hiato herdado seria contar uma historia sobre o
 * governo anterior que ninguem escreveu, e ela mudaria a inflacao do primeiro mes
 * sem o jogador ter feito nada.
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
