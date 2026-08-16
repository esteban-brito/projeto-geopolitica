/* LASTRO — orcamento.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   receita e despesa, obrigatorio contra discricionario, estado macro
   devolve  saldo, divida sobre PIB, espaco discricionario restante

   O espaco discricionario e a moeda real do jogo: e com ele que ECLUSA paga.

   ── A ARMADILHA, E POR QUE ELA DEPENDE DE UMA ESCOLHA DE MODELAGEM ───────────
   A despesa obrigatoria e um VALOR ABSOLUTO que cresce por conta propria. Nao e
   uma fracao da receita, e a diferenca decide se o jogo tem tensao fiscal ou
   nao: definida como fracao, o discricionario seria sempre a fracao
   complementar, cairia junto quando a receita cai e NUNCA apertaria — o gatilho
   de contingenciamento jamais dispararia.

   Como valor absoluto, salario e beneficio nao consultam a arrecadacao para
   subir. A razao despesa/receita passa a ser EMERGENTE: nasce perto de 90%,
   sobe sozinha quando o PIB decepciona, e espreme o discricionario contra o
   zero. E isso, e nao um evento roteirizado, que produz o aperto.

   ── DUAS RESTRICOES, E O MENOR MANDA ─────────────────────────────────────────
   O jogador esbarra em duas coisas diferentes, e confundi-las e o erro comum:

     CAIXA  — receita menos obrigatoria. E quanto dinheiro EXISTE;
     REGRA  — o teto do arcabouco. E quanto a lei DEIXA gastar.

   Sao independentes. Da para ter caixa e nao poder gastar (ano de receita
   extraordinaria), e da para ter permissao e nao ter caixa. O que o jogador
   pode empenhar e o MENOR dos dois, e o motor devolve os dois separados
   justamente para a tela conseguir dizer QUAL dos dois esta mordendo.

   ── ANUALIZADO POR DENTRO, MENSAL POR FORA ───────────────────────────────────
   A regra fiscal e um exercicio anual e a ancora dela nao muda no meio do ano;
   o turno e um mes. Entao o motor raciocina em valores ANUALIZADOS — que e a
   escala em que a regra existe — e devolve tambem o fluxo do mes. Sem isso, ou
   a regra vira mensal (e deixa de ser a regra) ou o aperto so aparece em
   dezembro (e deixa de ser jogavel).

   ── O QUE ELE AINDA NAO FAZ, declarado ───────────────────────────────────────
   Juros sobre a divida. Eles dependem da Selic, que e CORRENTE, e um numero
   inventado aqui viraria divida silenciosa no momento em que o motor certo
   nascesse. A divida cresce por deficit primario e so. */

const MONTHS_PER_YEAR = 12;

/**
 * @typedef {import("../../data/fiscal.mjs").FiscalParameters} FiscalParameters
 *
 * @typedef {object} BudgetInput
 * @property {number} gdp - PIB anualizado corrente
 * @property {number} mandatory - despesa obrigatoria ANUALIZADA corrente
 * @property {number} anchorRevenue - receita do exercicio anterior; a ancora da regra
 * @property {number} anchorExpense - despesa total do exercicio anterior
 * @property {number} debt - divida bruta
 * @property {number} spent - discricionario efetivamente empenhado NO MES
 * @property {number} [inflation] - ao ano; e ela que indexa a despesa obrigatoria
 * @property {FiscalParameters} parameters
 * @property {number} [revenueFactor] - o quanto a maquina de arrecadar rende hoje
 * @property {number} [mandatoryFactor] - o quanto o servico publico encarece a obrigatoria
 *
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
 * Receita anualizada. Ela e funcao do PIB, entao choque macroeconomico chega ao
 * orcamento sem ninguem escrever a ligacao.
 *
 * @param {number} gdp
 * @param {number} taxLoad
 */
export function revenueOf(gdp, taxLoad) {
  return gdp * taxLoad;
}

/**
 * Um mes de crescimento vegetativo, composto a partir da taxa anual.
 *
 * A raiz de indice doze, e nao a taxa dividida por doze: dividir daria um ano
 * ligeiramente MAIOR que a taxa declarada, e um erro de composicao que anda por
 * 48 turnos deixa de ser arredondamento.
 *
 * ⚠ A INFLACAO ENTRA AQUI, E A AUSENCIA DELA ERA UM DEFEITO MEDIDO. O parametro
 * `mandatoryGrowth` sempre se chamou "crescimento vegetativo REAL ao ano" na
 * prosa do catalogo, e o codigo o aplicava sobre um valor NOMINAL sem corrigir
 * por preco. O efeito era o oposto da armadilha que o arquivo promete:
 *
 *   obrigatoria crescia   2,5% ao ano
 *   PIB nominal crescia   ~6% ao ano (2% real + 4% de inflacao)
 *
 * — ou seja, a despesa obrigatoria ENCOLHIA contra o PIB todo mes, sozinha, e o
 * pais se desendividava sem ninguem governar. Era a causa raiz do achado numero
 * um do handoff.
 *
 * Aposentadoria e salario sao indexados: eles sobem com a inflacao E crescem em
 * cima disso. O composto dos dois e o que faz a obrigatoria correr ACIMA do PIB
 * nominal, que e a armadilha fiscal brasileira em uma linha.
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
 * O teto do arcabouco: a despesa nao cresce mais que `share` do crescimento da
 * receita.
 *
 * O sinal e o ponto. Quando a receita CAI, `growth` e negativo e o teto
 * ENCOLHE — e como a obrigatoria cresceu no mesmo mes, ela pode furar um teto
 * que baixou. Nao ha evento nenhum escrito para isso acontecer; e aritmetica.
 *
 * @param {number} anchorExpense
 * @param {number} anchorRevenue
 * @param {number} revenue
 * @param {number} share
 */
export function ceilingOf(anchorExpense, anchorRevenue, revenue, share) {
  /* Ancora zerada nao existe em partida valida, mas divisao por zero produz
     `Infinity` que atravessa o motor inteiro sem lancar — e ai o defeito
     aparece como um teto absurdo tres telas adiante. */
  if (anchorRevenue <= 0) return anchorExpense;
  const growth = (revenue - anchorRevenue) / anchorRevenue;
  return anchorExpense * (1 + share * growth);
}

/**
 * Resolve um mes de orcamento.
 *
 * @param {BudgetInput} input
 * @returns {BudgetOutput}
 */
export function step(input) {
  const { parameters } = input;

  /* OS DOIS FATORES ENTRAM POR PARAMETRO e valem 1 quando ninguem os passa.
     Eles sao a porta por onde a capacidade do Estado chega ao orcamento:
     arrecadacao ruim nao muda a aliquota nem o PIB, muda quanto do que e devido
     efetivamente entra; e servico publico ruim nao muda a regra da despesa
     obrigatoria, muda quanto ela custa na pratica — fila vira judicializacao,
     desordem vira presidio.

     PADRAO 1 E DELIBERADO. Este motor foi escrito antes de existir motor de
     capacidade, e continua valendo sozinho: quem nao passa fator nenhum tem o
     orcamento que sempre teve, e a suite antiga continua descrevendo a verdade. */
  /* ⚠ A BASE E DEVOLVIDA SEPARADA, e isso nao e conveniencia — e a correcao de
     um defeito que a simulacao pegou com a divida em 1066% do PIB.

     O fator e uma LEITURA do mes, e nao uma mudanca de estado. Quem guardou
     `mandatory` de volta na posicao do mes seguinte estava guardando o valor JA
     MULTIPLICADO, e no mes seguinte o fator incidia outra vez sobre ele. Doze
     meses de 6% viram 100%; quarenta e oito viram outro planeta. O sintoma
     aparecia longe da causa: contingenciamento permanente a partir do quarto mes,
     como se a regra fiscal estivesse errada.

     Quem avanca o estado usa `mandatoryBase` e `revenueBase`. Quem mostra numero
     na tela usa os de cima. */
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
  );

  /* O espaco que a REGRA abre, que nao e o mesmo que o caixa disponivel. */
  const room = ceiling - mandatory;

  /* CONTINGENCIAMENTO e o caso em que nem a obrigatoria cabe no teto. Nao ha o
     que escolher: nao sobra discricionario nenhum, e quem paga a conta politica
     e ECLUSA, porque emenda sai daqui. */
  const contingency = room < 0;

  /* ⚠ O TETO MANDA, E O CAIXA NAO — e esta linha e a queda do ULTIMO MURO do jogo.
     Ate 16/08/2026 ela era `min(cash, room)`, e a consequencia foi medida:

       ratio   = room / demand                    quando demand > room
       spent   = demand x ratio = min(cash, room) / 12
       balance = cash / 12 - spent  ->  ZERO, sempre que o caixa aperta antes do teto

     O empenho consumia EXATAMENTE o caixa livre, nem mais nem menos. Despesa total =
     obrigatoria + caixa = receita, por construcao — e o saldo primario dava zero em
     toda jogada. Medido em 48 meses: um governo que poe os 38 programas no MAXIMO e
     paga verba cheia a todas as bancadas fecha o mes com o mesmo saldo de um que nao
     faz nada. A divida so andava por JURO, e o orcamento — que o ciclo 2 declarou
     ser o jogo — nao tinha consequencia fiscal nenhuma.

     ⚠ E O ENQUADRAMENTO E O QUE IMPORTA: `spent <= cash` e `if (proibido) return`
     escrito em aritmetica. Em todo lugar do Planalto a pergunta e QUANTO CUSTA;
     aqui, e so aqui, ela era PODE?. Nenhum governo do mundo real respeita esse
     limite, e o Brasil menos que a media.

     ── O QUE FICA, E POR QUE ────────────────────────────────────────────────────
     O TETO CONTINUA VALENDO, e ele nao e o mesmo tipo de coisa: o arcabouco e LEI,
     com norma atras, e o jogador pode muda-la pelo rito que a guarda dela exigir. O
     caixa nao tinha nada atras — era aritmetica se passando por regra.

     A diferenca pratica: furar o teto continua exigindo mudar a lei; gastar mais do
     que se arrecada passa a ser possivel, e custa DIVIDA. E o preco ja existe e nao
     precisou ser inventado: divida maior -> juro maior -> menos discricionario no
     ano seguinte. A espiral ja estava modelada; o que faltava era deixar o jogador
     entrar nela. */
  const allowance = contingency ? 0 : Math.max(0, room);

  /* O saldo e do MES: o caixa anualizado dividido por doze, menos o que foi
     efetivamente empenhado neste turno. */
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
