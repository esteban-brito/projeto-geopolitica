/* O TURNO — onde o orcamento e o Congresso se encontram.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   o estado, as ordens do mes e o catalogo
   devolve  o estado seguinte e o relatorio do que aconteceu

   Este arquivo nao e um motor e nao tem codinome. Ele COMPOE motores, que e o
   papel declarado da camada de aplicacao: LASTRO diz quanto existe, ECLUSA diz
   quem vota, e a ordem em que os dois sao chamados e a mecanica.

   ── A ORDEM, E POR QUE ELA E A REGRA ─────────────────────────────────────────
   A tentacao e resolver a votacao primeiro e cobrar a conta depois. Feito assim,
   verba prometida sempre compra voto e o orcamento vira placar — um numero que o
   jogador olha DEPOIS de a decisao ter sido tomada, e que portanto nao decide
   nada. Aqui e o inverso:

     1. o teto e o caixa dizem quanto cabe NESTE mes;
     2. o prometido e confrontado com o que cabe;
     3. a votacao acontece com a verba REALMENTE PAGA;
     4. o buraco entre prometido e pago desaba sobre a lealdade;
     5. o orcamento fecha com o que de fato saiu.

   O passo 3 e o acoplamento inteiro. Prometer nao move voto nenhum: o Congresso
   responde ao que caiu na conta. E como o passo 1 pode devolver zero por
   contingenciamento — que nao e escolha do jogador, e aritmetica do teto —,
   existe um caminho em que o governo promete de boa fe, nao entrega, e perde a
   base sem que nenhum evento roteirizado tenha dito "sua base se revoltou".
   Essa era a peca que faltava: aperto fiscal virando crise politica por conta
   propria.

   ── O RATEIO, quando falta ───────────────────────────────────────────────────
   Falta dinheiro para todos, todos recebem menos, na proporcao do prometido. O
   governo NAO escolhe quem trair quando o teto fecha — escolher exigiria uma
   ordem de prioridade que o jogador nunca declarou, e inventa-la aqui seria o
   motor decidindo politica no lugar dele. Quem quiser proteger uma bancada
   promete menos as outras no mes seguinte.

   ── O QUE ESTA DECLARADO COMO SIMPLIFICACAO ──────────────────────────────────
   · O IMPACTO FISCAL de uma pauta aprovada cai na despesa OBRIGATORIA, inclusive
     quando o texto e de receita. E a unica linha permanente que o orcamento
     carrega hoje — a receita e funcao do PIB e de mais nada. O sinal e o
     tamanho ficam certos, a linha nao; quando o motor macroeconomico existir,
     pauta de arrecadacao muda de lado;
   · O PIB nao anda sozinho. Ele e o motor macroeconomico, que nao existe, e por
     isso entra aqui como PREMISSA explicita de quem chama — com zero por padrao.
     Um crescimento inventado neste arquivo viraria modelo macro clandestino. */

import { revenueOf, step as budgetStep } from "../domain/budget/index.mjs";
import { pressureOf, step as capacityStep } from "../domain/capacity/index.mjs";
import { benches as benchesOf, cast, offered, president, remember } from "../domain/cast/index.mjs";
import { carry, premiumOf, step as economyStep } from "../domain/economy/index.mjs";
import { heat, rupture } from "../domain/pressure/index.mjs";
import { enact, resolve } from "../domain/norms/index.mjs";
import {
  opening as opinionOpening,
  pollFrom,
  step as opinionStep,
} from "../domain/opinion/index.mjs";
import {
  THRESHOLDS,
  baseCount,
  dispersion,
  seating,
  settle,
  vote,
  whipCount,
} from "../domain/congress/index.mjs";
import { CAPACITY_TARGET, NEUTRAL } from "../data/areas.mjs";
import { CATALOG } from "../data/catalog.mjs";
import { bandOf, compose, honour, spendOf } from "./agenda.mjs";
import { DRAWER_LIFE, forgotten, proposalOf, reports, tables } from "./passage.mjs";
import { alarm, amendment, demand, notice, pending, settle as settleMail } from "./mail.mjs";
import {
  MONTHS_PER_TERM,
  MONTHS_PER_YEAR,
  QUALIFIED_MAJORITY,
  SIMPLE_MAJORITY,
  SEATS,
  REMOVAL_MAJORITY,
} from "../data/regime.mjs";
import { OPENING_MONTH, reduce } from "../state/state.mjs";

/**
 * @typedef {import("../state/state.mjs").GameState} GameState
 * @typedef {import("../data/bills.mjs").Bill} Bill
 * @typedef {import("../data/parties.mjs").Party} Party
 * @typedef {import("../domain/budget/index.mjs").BudgetOutput} BudgetOutput
 * @typedef {import("../domain/congress/index.mjs").Tally} Tally
 */

/**
 * @typedef {object} Orders as ordens do mes
 * @property {Record<string, number>} [funding] verba PROMETIDA por bancada, de 0 a 1
 * @property {Record<string, number>} [levels] a intensidade PEDIDA de cada programa
 * @property {Record<string, import("../state/state.mjs").Band>} [bands] as leis PEDIDAS
 * @property {Record<string, string>} [mail] o que o jogador respondeu a cada carta
 *
 * ⚠ A RESPOSTA E ORDEM, E NAO ACAO PROPRIA, e a alternativa foi recusada com razao
 * escrita em `state.mjs`: o vencimento acontece dentro do turno, e uma resposta que
 * mutasse o estado fora dele criaria dois caminhos para a mesma carta.
 *
 * @typedef {object} Options
 * @property {typeof CATALOG} [catalog]
 * @property {number} [shock] choque de oferta do mes, em pontos de inflacao anual
 *
 * @typedef {object} Report o que o mes deixou, para a tela ou para o terminal
 * @property {number} month o mes que acabou de ser resolvido
 * @property {import("./agenda.mjs").Agenda} agenda a pauta composta do orcamento
 * @property {Record<string, number>} levels os niveis com que o mes fechou
 * @property {Record<string, import("../state/state.mjs").Band>} bands as leis com que o mes fechou
 * @property {boolean} enacted se a pauta virou realidade
 * @property {BudgetOutput} budget
 * @property {import("../domain/capacity/index.mjs").Outcome} capacity
 * @property {import("../domain/economy/index.mjs").EconomyOutput} economy o mes macro
 * @property {import("../domain/opinion/index.mjs").OpinionOutput} opinion a rua
 * @property {number} interest o custo de carregar a divida no mes
 * @property {number} room o discricionario que cabia NO MES, em bilhoes
 * @property {number} promisedCost quanto a promessa de emenda custaria
 * @property {number} paidCost quanto o caixa honrou de emenda
 * @property {number} allocatedTotal quanto o caixa honrou de alocacao
 *
 * ⚠ O RATEIO E UM FATO DO MES, E ELE PRECISOU SUBIR PARA CA em 16/08/2026. O
 * simulador media "quantos meses o rateio cortou" com uma conta PROPRIA, montada dos
 * campos vizinhos — e ela contava, para a politica `herdado`, exatamente os 41 meses
 * em que NADA foi cortado. A serie inteira do projeto leu "o rateio corta em 41 de 48
 * meses" de um instrumento que anunciava o complemento da verdade.
 *
 * E a causa e a familia mais cara deste projeto pela SEXTA vez: dois lugares montando
 * a mesma pergunta. `settlement` ja sabia a resposta; quem quer saber, pergunta.
 * @property {number} ratio a fracao do pedido que o caixa honrou; 1 e mes sem corte
 * @property {Record<string, number>} promised
 * @property {Record<string, number>} paid
 * @property {Record<string, number>} asked bilhoes pedidos por area
 * @property {Record<string, number>} allocated bilhoes que chegaram, por area
 * @property {Tally | null} tally nulo quando nao houve votacao — decreto ou mes parado
 * @property {Record<string, number>} loyalty o humor depois do mes
 * @property {ReadonlyArray<import("../domain/cast/index.mjs").Person>} people o elenco do mandato
 * @property {Record<string, number>} memory o que cada pessoa passou a lembrar
 * @property {ReadonlyArray<{ kind: string, label: string, detail: string | null }>} events
 *   o que a tramitacao fez no mes: engavetou, pautou, relatou, aprovou ou derrubou
 */

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * AS ALAVANCAS COMO O MOTOR DE NORMAS AS VÊ — id e grupo, e nada mais.
 *
 * O motor nao conhece programa nem regra, e nao deveria: o que ele precisa saber
 * de uma alavanca e como referi-la sozinha e como referi-la em conjunto. O GRUPO
 * e a area de um programa e a familia de uma regra, e e essa traducao que faz
 * "piso de 30 em toda a saude, salvo atencao basica" ser uma frase que o motor
 * executa sem nunca ter ouvido falar em saude.
 *
 * @param {typeof CATALOG} catalog
 * @returns {import("../domain/norms/index.mjs").Lever[]}
 */
function leversOf(catalog) {
  return [
    /* ⚠ O CUSTO VAI JUNTO, e ele so serve a VINCULACAO: e o divisor que converte
       "15% da receita" em pontos daquela alavanca. Sem ele o motor de normas nao teria
       como saber que fracao de um programa uma fracao da receita compra — e uma
       alavanca sem custo declarado simplesmente nao pode ser vinculada.
       A REGRA NAO TEM CUSTO, e nao e esquecimento: propriedade de estatal e poder do
       Executivo nao consomem orcamento, entao nao ha o que vincular nelas. */
    ...catalog.programs.map(program => ({
      id: program.id,
      group: program.area,
      cost: program.cost,
    })),
    ...catalog.rules.map(rule => ({ id: rule.id, group: rule.family })),
  ];
}

/**
 * O QUE OS GATILHOS LEEM, e so o que o estado ja guarda.
 *
 * ⚠ NENHUM NUMERO E CALCULADO AQUI. Um gatilho que lesse um indicador derivado na
 * hora seria a tela refazendo a conta do motor, do lado errado da fronteira: o
 * jogador escreve "enquanto a divida passar de 80%" e precisa que esse 80 seja o
 * mesmo 80 que o painel de Financas mostra. A divida sobre o PIB e a unica razao
 * montada aqui, e ela e a mesma divisao que `ledger` devolve.
 *
 * @param {GameState} state
 * @returns {Record<string, number>}
 */
function indicatorsOf(state) {
  return {
    debtRatio: state.macro.gdp > 0 ? state.fiscal.debt / state.macro.gdp : 0,
    gdp: state.macro.gdp,
    inflation: state.macro.inflation,
    rate: state.macro.rate,
    unemployment: state.macro.unemployment,
  };
}

/**
 * O TEXTO QUE UMA APROVACAO ESCREVE — o que mudou, e so o que mudou.
 *
 * ⚠ SO O LADO QUE SE MOVEU ENTRA NA NORMA, e a tentacao de gravar os dois e o
 * defeito que isto existe para evitar. A tela manda a faixa inteira todo mes,
 * porque o rascunho nasce copiado do vigente; gravar os dois lados faria toda
 * emenda sobre o piso da saude tambem RE-AFIRMAR o teto dela, com a mesma data e a
 * mesma forca. O efeito so apareceria meses depois, quando uma norma de area
 * tentasse mexer naquele teto e perdesse para uma clausula que ninguem escreveu.
 *
 * Uma norma por alavanca, e nao uma por lado: quem move piso e teto no mesmo texto
 * escreveu um texto so, e revoga-lo tem de derrubar as duas metades juntas.
 *
 * @param {Record<string, import("../state/state.mjs").Band>} before as leis vigentes
 * @param {Record<string, import("../state/state.mjs").Band>} after as leis pedidas
 * @param {number} month
 * @param {typeof CATALOG} catalog
 * @returns {import("../domain/norms/index.mjs").Norm[]}
 */
function normsFrom(before, after, month, catalog) {
  /** @type {import("../domain/norms/index.mjs").Norm[]} */
  const written = [];

  for (const lever of [...catalog.programs, ...catalog.rules]) {
    const was = before[lever.id];
    const asked = after[lever.id];
    if (!was || !asked) continue;

    /** @type {{ floor?: number, ceiling?: number }} */
    const moved = {};
    if (asked.floor !== was.floor) moved.floor = asked.floor;
    if (asked.ceiling !== was.ceiling) moved.ceiling = asked.ceiling;
    if (moved.floor === undefined && moved.ceiling === undefined) continue;

    written.push(enact({ lever, month, ...moved }));
  }

  return written;
}

/**
 * A LEI VIGENTE DE CADA ALAVANCA — a pilha de normas lida como faixa.
 *
 * ⚠ ELA E EXPORTADA PELA MESMA RAZAO DE `settlement` E `ledger`: a tela precisa
 * saber o que a lei manda enquanto o jogador arrasta o controle, e a alternativa
 * seria o entrypoint montando as alavancas e os indicadores por fora para chamar o
 * motor. Duas montagens da mesma coisa e a definicao de conta que diverge — e esta
 * divergiria no mes em que uma clausula de gatilho ligasse, que e justamente o mes
 * em que o jogador precisava do numero.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {Record<string, import("../state/state.mjs").Band>}
 */
export function bandsOf(state, catalog = CATALOG) {
  return resolve({
    norms: state.norms,
    levers: leversOf(catalog),
    month: state.month,
    indicators: indicatorsOf(state),
    revenue: revenueNow(state, catalog),
  }).bands;
}

/**
 * A RECEITA SOBRE A QUAL A VINCULACAO INCIDE.
 *
 * ⚠ ELA E PERGUNTADA AO LASTRO, e nao remontada aqui: `revenueOf` e a mesma funcao
 * que o turno usa para fechar o mes, e um segundo lugar multiplicando PIB por carga
 * daria dois pisos da saude divergindo no primeiro mes em que a formula mudasse.
 *
 * ⚠ E ELA E A RECEITA BRUTA, e nao a corrente liquida. No mundo real a vinculacao da
 * saude incide sobre a RCL — depois das transferencias a estados e municipios —, e o
 * modelo ainda nao separa as duas. A omissao esta declarada no achado 26, e a
 * consequencia e conhecida: as fracoes deste catalogo sao menores que as
 * constitucionais porque a base delas e maior.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} catalog
 */

/* ── O DESCONTENTAMENTO DE CADA GRUPO, e ele e a UNICA coisa que a CALDEIRA nao sabe
   fazer sozinha. Motor nenhum chama outro motor: quem enxerga LASTRO, ECLUSA e MALHA
   ao mesmo tempo e esta camada, e por isso a leitura mora aqui.

   ⚠ CADA UM LE UM LUGAR, e a regra da exclusao mutua esta em `src/data/lobbies.mjs`:
   dois grupos que subissem pelo mesmo numero seriam um grupo com dois nomes.

   ⚠ E TODOS SOBEM POR AUSENCIA DE ENTREGA. Nenhuma das tres leituras pergunta "o que
   o governo fez contra mim" — as tres perguntam "o que eu recebi". Quem nao entrega
   esquenta a caldeira do mesmo jeito que quem contraria, e sem isso este motor
   premiaria a passividade que ele existe para punir. */
/**
 * @param {object} input
 * @param {number} input.debtRatio
 * @param {number} input.delivered - a verba que de fato CHEGOU as bancadas, 0 a 1
 * @param {Record<string, number>} input.index - o indice de cada area
 * @param {ReadonlyArray<string>} [input.spurned] - os lobbies cuja exigencia foi
 *   recusada ou deixada vencer NESTE mes
 * @param {typeof CATALOG} input.catalog
 * @returns {Record<string, number>} de 0 (satisfeito) a 1 (fervendo)
 */
function grievanceOf({ debtRatio, delivered, index, spurned = [], catalog }) {
  /** @type {Record<string, number>} */
  const want = {};

  for (const lobby of catalog.lobbies) {
    if (lobby.reads === "debt") {
      /* ⚠ A MESMA TOLERANCIA DO PREMIO DE RISCO, lida do mesmo lugar: o mercado que
         cobra spread e o mercado que abandona o governo sao o mesmo mercado, e dois
         limiares diferentes fariam ele desconfiar em um numero e fugir em outro.
         `SPAN` e quanta deterioracao leva da paciencia ao ponto de fervura. */
      const excess = debtRatio - catalog.fiscal.initialDebtRatio;
      want[lobby.id] = clamp(excess / DEBT_SPAN, 0, 1);
      continue;
    }

    if (lobby.reads === "share") {
      /* ⚠ O QUE CHEGOU, E NAO O RATEIO — e esta linha e a correcao do defeito mais
         grave que a CALDEIRA teve, achado na primeira medicao dela.

         A primeira versao lia `ratio`: que FRACAO do prometido o caixa honrou. E com
         isso um governo que nao promete nada a ninguem honra 100% de zero e o baixo
         clero ficava SATISFEITO — pressao zero em 48 meses de descaso completo.

         Era o motor premiando exatamente a passividade que ele existe para punir, e
         a prosa de `lobbies.mjs` ja dizia que isso nao podia acontecer: "quem nao
         entrega esquenta a caldeira do mesmo jeito que quem contraria".

         O que ele cobra e ENTREGA, e nao coerencia: verba que chegou. Zero de verba
         e descontentamento maximo, e foi assim que presidentes brasileiros perderam
         a base — nao por trai-la, por nao alimenta-la. */
      want[lobby.id] = clamp(1 - delivered, 0, 1);
      continue;
    }

    /* CAPACIDADE: o indice das areas dele contra o ponto neutro. Abaixo do neutro o
       setor esta pior do que o pais considera normal, e e isso que ele cobra. */
    const ids = (lobby.areas ?? "").split(" ").filter(Boolean);
    if (ids.length === 0) {
      want[lobby.id] = 0;
      continue;
    }
    const mean = ids.reduce((sum, id) => sum + (index[id] ?? NEUTRAL), 0) / ids.length;
    want[lobby.id] = clamp((NEUTRAL - mean) / NEUTRAL, 0, 1);
  }

  /* ── O RANCOR DE QUEM FOI RECUSADO ──────────────────────────────────────────
     ⚠ ELE E A UNICA COISA QUE A CHANTAGEM SOMA A CALDEIRA, e ele nao tem memoria
     propria de proposito: a pressao JA e um estoque com inercia, entao um mes de
     queixa alta continua doendo nos meses seguintes sozinho. Guardar um rancor a
     parte seria a mesma verdade em dois lugares — e o que a caldeira guarda E o
     rancor de quem foi recusado.

     ⚠ E O SILENCIO CONTA COMO RECUSA, e nao como meio-termo. Aqui a omissao nao pode
     ACEITAR, como aceita na emenda do relator: um lobby que exige e nao recebe
     resposta nao entende que ganhou. A carta diz isso antes de vencer. */
  for (const id of spurned) {
    want[id] = clamp((want[id] ?? 0) + catalog.pressure.spite, 0, 1);
  }

  return want;
}

/**
 * O SPREAD QUE O MERCADO COBRA HOJE — e ele e uma LEITURA do estado, e nao um campo.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} catalog
 */
function premiumNow(state, catalog) {
  return premiumOf({
    debtRatio: state.macro.gdp > 0 ? state.fiscal.debt / state.macro.gdp : 0,
    /* ⚠ A TOLERANCIA E A DIVIDA HERDADA, lida do catalogo fiscal e nao repetida aqui:
       o mercado ja precificou o pais que o presidente recebeu, e o que ele cobra e a
       DETERIORACAO. Ver a prosa de `premiumOf`. */
    tolerance: catalog.fiscal.initialDebtRatio,
    slope: catalog.macro.riskPremium,
  });
}

/**
 * @param {GameState} state
 * @param {typeof CATALOG} catalog
 */
function revenueNow(state, catalog) {
  return revenueOf(state.macro.gdp, catalog.fiscal.taxLoad);
}

/**
 * O QUE TRAVA O ORCAMENTO, e QUAL TEXTO o trava.
 *
 * ⚠ ELA RESPONDE A PERGUNTA QUE O JOGADOR FAZ PRIMEIRO — "por que eu nao tenho
 * dinheiro?" — e a resposta do Planalto e diferente da que ele espera. Nao e falta
 * de caixa: e excesso de TEXTO. A obrigatoria e a soma dos pisos, cada piso e uma
 * norma, e cada norma tem um nome e uma hierarquia.
 *
 * Ate a Parte 1 isso era intencao escrita num documento de risco (R2 do ciclo 4).
 * Virou construivel no dia em que a lei deixou de ser um par de numeros: `resolve`
 * devolve QUEM decidiu cada piso, entao a tela consegue ir do real travado ate o
 * texto que o travou sem refazer a disputa de precedencia por fora.
 *
 * ⚠ O QUE ELA MEDE E O PISO EFETIVO, e nao o piso da lei: quem gasta ABAIXO do que
 * a lei obriga trava so o que gasta. E a mesma conta que `nextPosition` usa para o
 * alivio da reforma, e ela e uma so de proposito — duas contas para "quanto deste
 * programa e obrigatorio" divergiriam no mes seguinte a qualquer reforma.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @param {number} [top] quantas linhas devolver
 * @returns {{ id: string, label: string, area: string, spend: number, guard: string, norm: string }[]}
 */
export function lockedBy(state, catalog = CATALOG, top = 3) {
  const { bands, governs } = resolve({
    norms: state.norms,
    levers: leversOf(catalog),
    month: state.month,
    indicators: indicatorsOf(state),
    revenue: revenueNow(state, catalog),
  });

  return catalog.programs
    .map(program => {
      const floor = Math.min(
        bands[program.id]?.floor ?? program.floor,
        state.levels[program.id] ?? program.initial,
      );
      return {
        id: program.id,
        label: program.label,
        area: program.area,
        /* EM BILHOES POR MES, que e a moeda em que o cofre fala. O catalogo
           raciocina em ano, e a divisao mora aqui e em `agenda.mjs` — nos dois
           lugares pelo mesmo motivo, e em nenhum outro. */
        spend: (Math.max(0, floor) / 100) * program.cost * (1 / MONTHS_PER_YEAR),
        guard: program.guard,
        norm: governs[program.id] ?? "",
      };
    })
    .filter(item => item.spend > 0)
    .sort((a, b) => b.spend - a.spend)
    .slice(0, top);
}

/**
 * A posicao com que o orcamento entra no mes, ja com a capacidade do Estado
 * pesando nela.
 *
 * A PRESSAO VEM DO HISTORICO QUE CHEGOU, e nao do mes que esta sendo resolvido.
 * A ordem nao e detalhe: se a alocacao deste mes ja melhorasse a arrecadacao
 * deste mes, o jogador financiaria a alocacao com a receita que ela mesma vai
 * gerar — dinheiro nascendo de si proprio. O atraso de cada area e o que impede
 * isso, e ele so vale se a leitura for feita antes.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} catalog
 */
function positionOf(state, catalog) {
  const pressure = pressureOf({ areas: catalog.areas, history: state.capacity.history });

  /* O DIVIDENDO DAS ESTATAIS ENTRA PELO FATOR DE RECEITA, e a razao e evitar um
     campo novo no LASTRO por uma linha. O fator ja e "quanto do devido de fato
     entra"; somar a ele a razao entre dividendo e receita-base da exatamente
     `receita = base × pressao + dividendos`, sem o motor precisar aprender uma
     fonte de receita nova.

     ⚠ E ELE E PERMANENTE ENQUANTO A ESTATAL FOR DO ESTADO. Privatizar apaga esta
     linha para sempre — e essa e a metade da conta que a receita de venda esconde
     no mes em que ela entra. */
  const base = state.macro.gdp * catalog.fiscal.taxLoad;

  /* ⚠ O QUE ENTRA E A VARIACAO DO DIVIDENDO, E NAO ELE INTEIRO — e o conserto do
     terceiro termo do achado numero um. `taxLoad` e a receita primaria da Uniao
     sobre o PIB, e dividendo de estatal JA ESTA dentro dela: somar o valor cheio
     por cima era contar o mesmo real duas vezes, e inflava a receita de abertura
     em 40,9 bilhoes que ninguem arrecadou.
     O canal fiscal continua inteiro, porque o que ele sempre mediu foi a MUDANCA:
     privatizar apaga o dividendo e a receita cai na hora — que e a metade da conta
     que a receita de venda esconde no mes em que ela entra. */
  const dividendOf = (/** @type {Record<string, number>} */ levels) =>
    catalog.rules.reduce(
      (sum, rule) => sum + (rule.reach * rule.dividend * (levels[rule.id] ?? rule.initial)) / 100,
      0,
    );

  const opening = Object.fromEntries(catalog.rules.map(rule => [rule.id, rule.initial]));
  const dividends = dividendOf(state.levels) - dividendOf(opening);

  return {
    gdp: state.macro.gdp,
    /* A INFLACAO INDEXA A OBRIGATORIA, e por isso ela atravessa a fronteira: sem
       ela, aposentadoria e salario encolhiam contra o PIB nominal todo mes. */
    inflation: state.macro.inflation,
    mandatory: state.fiscal.mandatory,
    anchorRevenue: state.fiscal.anchorRevenue,
    anchorExpense: state.fiscal.anchorExpense,
    /* ⚠ QUANTOS TURNOS CORRERAM DESDE A ANCORA, de 0 a 1 — e ele existe porque a
       banda do arcabouco e ANUAL e o turno e MENSAL. Sem esta fracao, o piso da banda
       entrega o crescimento de um ano inteiro no PRIMEIRO mes: medido, R$ 107 bi de
       teto a mais na posse, sobre um discricionario de 176.

       ⚠ E ELE CONTA TURNOS, E NAO O CALENDARIO, e a distincao custou uma prova
       vermelha. A ancora rola em dezembro, mas a partida ABRE EM MARCO — e a
       obrigatoria de abertura e um valor de marco que so cresce a partir do primeiro
       turno jogado. Contando pelo calendario, o teto ganhava tres meses de correcao
       que a obrigatoria nao tinha ganhado, e os dois relogios andavam separados: a
       posicao apertada da suite deixava de apertar por R$ 42 bi que ninguem gastou.

       O `+ 1` e porque `step` cresce a obrigatoria UMA vez por chamada: quando o teto
       e lido, ela ja andou o mes que esta sendo resolvido. */
    elapsed:
      ((state.month < MONTHS_PER_YEAR
        ? state.month - OPENING_MONTH
        : state.month % MONTHS_PER_YEAR) +
        1) /
      MONTHS_PER_YEAR,
    debt: state.fiscal.debt,
    parameters: catalog.fiscal,
    revenueFactor: pressure.revenue + (base > 0 ? dividends / base : 0),
    mandatoryFactor: pressure.mandatory,
  };
}

/**
 * A RECEITA DE VENDA — o que entra no mes em que se privatiza.
 *
 * ⚠ ELA E A ARMADILHA MAIS BONITA DO MODELO, e ninguem a escreveu como
 * armadilha. Ela entra UMA VEZ, engorda o resultado do exercicio, e por isso
 * levanta a ancora do arcabouco do ano seguinte — `nextPosition` fecha o ano com
 * o teto que vigorou. No ano depois ela nao se repete, o teto encolhe contra uma
 * obrigatoria que continuou crescendo, e o governo descobre que financiou custeio
 * permanente com caixa de uma vez. E aritmetica do LASTRO.
 *
 * @param {ReadonlyArray<import("../data/rules.mjs").Rule>} rules
 * @param {Record<string, number>} before
 * @param {Record<string, number>} after
 * @returns {number} bilhoes, no mes
 */
function saleOf(rules, before, after) {
  let total = 0;
  for (const rule of rules) {
    const sold = (before[rule.id] ?? rule.initial) - (after[rule.id] ?? rule.initial);
    /* SO A VENDA ARRECADA. Estatizar CUSTA — comprar de volta e desembolso —, e
       isso fica como omissao declarada: o preco de recompra depende de avaliacao
       de mercado, que e CORRENTE. Por enquanto reestatizar sai de graca em caixa
       e cobra em folha, que ja e metade da verdade. */
    if (sold > 0) total += (rule.reach * rule.sale * sold) / 100;
  }
  return total;
}

/**
 * QUANTO CABE NESTE MES, em bilhoes — o discricionario ja dividido por doze.
 *
 * Ele e exportado porque quem decide precisa saber ANTES de decidir: a politica
 * de simulacao consulta para nao prometer o que nao cabe, e a tela vai precisar
 * dele para mostrar o limite enquanto o jogador arrasta o controle de verba.
 * Sem isto, os dois teriam de refazer a conta do orcamento por fora — e conta
 * refeita por fora e conta que diverge.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {number}
 */
export function discretionaryRoom(state, catalog = CATALOG) {
  return budgetStep({ ...positionOf(state, catalog), spent: 0 }).allowance / MONTHS_PER_YEAR;
}

/**
 * Quanto custa, em bilhoes, manter uma promessa de verba durante um mes.
 *
 * @param {Record<string, number>} funding
 * @param {ReadonlyArray<Party>} parties
 * @param {number} seatPrice
 * @returns {number}
 */
export function costOf(funding, parties, seatPrice) {
  let total = 0;
  for (const party of parties) {
    total += clamp(funding[party.id] ?? 0, 0, 1) * party.seats * seatPrice;
  }
  return total;
}

/**
 * A POSICAO DO GOVERNO — e nao a do pais, e muito menos a da opiniao publica.
 *
 * ⚠ ELA NAO E SONDA, e a distincao e o que torna esta funcao legitima. Aprovacao
 * e o que a populacao acha, depende de motor que nao existe, e por isso saiu da
 * tela. Isto aqui e outra coisa: e se o governo TEM COMO GOVERNAR — se o caixa
 * responde e se a base responde. Um governo com o teto fechado e a base rompida
 * esta em crise mesmo que ninguem tenha perguntado nada a populacao.
 *
 * Ela vive na camada de aplicacao porque compoe DOIS motores, e motor nenhum
 * chama outro: LASTRO diz se sobrou orcamento, ECLUSA diz se sobrou base.
 *
 * A ORDEM DAS PERGUNTAS E A DA GRAVIDADE, e cada degrau devolve o proprio
 * motivo — a tela precisa dizer QUAL crise, senao ela vira uma luz vermelha que
 * o jogador aprende a ignorar.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {{ level: "crisis" | "stable" | "growth", reason: string, base: number }}
 */
export function situationOf(state, catalog = CATALOG) {
  const { parties } = catalog;
  const budget = budgetStep({ ...positionOf(state, catalog), spent: 0 });
  const base = baseCount({ parties, loyalty: state.loyalty });

  const mood = (/** @type {Party} */ party) => state.loyalty[party.id] ?? 0;
  const ruptured = parties.some(party => mood(party) < THRESHOLDS.rupture);
  const obstructing = parties.some(party => mood(party) < THRESHOLDS.obstruction);

  /* O teto fechado vem primeiro porque ele nao se negocia: sem discricionario
     nao ha emenda, e sem emenda a base nao se compra de volta. */
  if (budget.contingency) return { level: "crisis", reason: "contingency", base };
  if (ruptured) return { level: "crisis", reason: "rupture", base };
  if (base < SIMPLE_MAJORITY) return { level: "crisis", reason: "minority", base };

  /* OBSTRUCAO SEGURA O GOVERNO EM "ESTAVEL" mesmo com a base grande, e isso e
     desenho: um degrau que so aparece na crise seria um degrau que nunca
     aparece, porque a queda da lealdade passa por ele em um mes. */
  if (obstructing) return { level: "stable", reason: "obstruction", base };
  if (base < QUALIFIED_MAJORITY) return { level: "stable", reason: "tight", base };

  return { level: "growth", reason: "comfortable", base };
}

/**
 * O RATEIO DO MES — o que foi prometido, e o que o caixa de fato honra.
 *
 * ⚠ ELA E EXPORTADA PARA A TELA, e a razao e um defeito visto na propria tela.
 * A Mesa previa o placar com a verba PROMETIDA enquanto o turno vota com a
 * PAGA. Enquanto a promessa cabia no mes as duas eram a mesma coisa e nada
 * aparecia; no instante em que o jogador prometia demais — que e justamente o
 * momento em que ele precisa da previsao — a tela anunciava um placar que o
 * turno nao ia produzir, e podia anunciar "acima do quorum" numa votacao que o
 * corte derrubava. Refazer o rateio por fora seria a mesma conta em dois
 * lugares, e conta refeita por fora e conta que diverge.
 *
 * O corte e o MESMO para emenda e para area: prometer demais ao Congresso
 * encolhe o hospital no mesmo mes, e e assim que o jogador descobre que as duas
 * contas eram uma. Ele tambem e PROPORCIONAL — o governo nao escolhe quem trair
 * quando o teto fecha.
 *
 * @param {GameState} state
 * @param {Orders} [orders]
 * @param {typeof CATALOG} [catalog]
 */
export function settlement(state, orders = {}, catalog = CATALOG) {
  const { parties, fiscal, programs } = catalog;

  /* A LEI VIGENTE, LIDA UMA VEZ SO. Ela e derivada da pilha de normas, e resolve-
     la de novo a cada uso seria pagar a mesma leitura quatro vezes no mesmo mes —
     e, pior, abriria a porta para dois trechos deste arquivo lerem meses
     diferentes se alguem mexer na ordem. Uma leitura, um mes, uma lei. */
  const bands = bandsOf(state, catalog);

  /* O ORCAMENTO PEDIDO E O VIGENTE COM AS MUDANCAS POR CIMA. Programa que o
     jogador nao citou continua onde estava — e nao volta a zero, que seria a
     leitura de quem confunde "nao mexi" com "nao quero". */
  const written = { ...state.levels, ...(orders.levels ?? {}) };

  /* ⚠ O PISO QUE SOBE POR BAIXO NAO E UMA PROPOSTA DO PRESIDENTE, e esta e a metade
     que faltava da VINCULACAO — a metade que a simulacao cobrou.

     Um piso vinculado anda com a receita: medido, o da media e alta complexidade sobe
     de 63,00 para 64,60 em cinco meses enquanto o nivel vigente cai de 66,00 para
     65,60. Por volta do mes 12 eles CRUZAM — e a partir dai `compose` via "o nivel
     esta abaixo do piso" e montava um projeto de lei, todo mes, sem que ninguem
     tivesse pedido nada. A serie mediu isso: a politica `base`, que so mantem a
     maquina, saiu de ZERO votacoes para 41 aprovadas de 42.

     A DISTINCAO E ENTRE MOVER E FICAR. Quem baixa o controle abaixo do piso esta
     propondo derruba-lo, e isso custa lei — continua custando. Quem nao mexeu em nada
     e viu a lei subir por baixo nao propos coisa nenhuma: ele recebeu uma CONTA, e o
     que "obrigatorio" significa e que ele vai paga-la.

     ⚠ E O CRITERIO E O MOVIMENTO, E NAO O PISO: comparar o pedido com o piso apagaria
     a jogada de furar o piso; comparar com o NIVEL VIGENTE distingue as duas. Reducao
     deliberada passa direto e vira texto; o resto sobe com a lei. */
  /* ⚠ OS DOIS LADOS SOBEM JUNTOS, e a primeira versao subiu so um — o que criou um
     defeito novo que uma prova pegou na hora. Elevando apenas o PEDIDO, cumprir a lei
     virava um MOVIMENTO de ampliacao: o texto de "um movimento so" passou a ter dois,
     e o raio ideologico dele saiu de 0 para 0,06 sem que nada tivesse sido proposto.

     O VIGENTE EFETIVO e o que a lei ja obriga, e nao o que o estado guardou: se o
     piso subiu acima do nivel, o pais JA gasta o piso — nao ha nada a decidir ali. */
  /** @type {Record<string, number>} */
  const current = {};
  /** @type {Record<string, number>} */
  const requested = {};
  for (const [id, level] of Object.entries(written)) {
    const before = state.levels[id] ?? level;
    const floor = bands[id]?.floor ?? 0;
    current[id] = Math.max(before, floor);
    requested[id] = level < before ? level : Math.max(level, floor);
  }

  /* A promessa, normalizada. Bancada que o jogador nao citou prometeu zero, e
     valor fora da faixa e cortado em vez de recusado: ordens vem de politica de
     simulacao e de arrastar um controle na tela, e nenhum dos dois deve
     conseguir derrubar o turno. */
  /** @type {Record<string, number>} */
  const promised = {};
  for (const party of parties) {
    promised[party.id] = clamp(orders.funding?.[party.id] ?? 0, 0, 1);
  }

  /* A ALOCACAO NAO E MAIS PEDIDA — ELA E DERIVADA DO ORCAMENTO ESCRITO.
     Antes o jogador arrastava um controle por area e dizia "quero 3 bilhoes na
     saude"; agora ele diz em que intensidade cada programa vai rodar, e o custo
     cai da conta. A diferenca nao e de interface: um numero em bilhoes nao diz o
     que o dinheiro compra, e por isso nao tinha como o Congresso reagir a ele.

     ⚠ SO A PARTE ACIMA DO PISO ENTRA AQUI. O gasto ate o piso e a lei sendo
     cumprida e ja esta na despesa obrigatoria — cobra-lo de novo no
     discricionario seria contar o mesmo real duas vezes. */
  /* ⚠ O GASTO DO MES USA A LEI VIGENTE, e nunca a proposta. A faixa que o texto
     pede so vale depois de o plenario votar — cobrar o discricionario contra ela
     seria o governo executando um orcamento com base numa lei que ainda nao
     existe, que e a definicao de gastar sem autorizacao. */
  /* ── O QUE DE FATO SE EXECUTA NESTE MES ────────────────────────────────────
     ⚠ ESTE E O ACHADO 14, E A TRAMITACAO O TRIPLICOU EM VEZ DE MATA-LO. O ciclo
     previa que ele sumisse quando o pedido e o aplicado se separassem; eles se
     separaram, e o resto do arquivo continuou lendo o PEDIDO.

     O sintoma: o jogador pede corte na saude, o texto vai para a gaveta, o dinheiro
     NAO e cortado — e a MALHA recebia o mes como se tivesse sido, e o caixa cobrava
     o empenho que nao saiu. Antes a divergencia durava um mes (ate a votacao); agora
     dura TRES, ou para sempre se o texto morrer engavetado.

     ⚠ E O RATEIO PASSA A DIVIDIR O EXECUTAVEL, e nao o sonhado. Rateado sobre o
     pedido, o corte se calculava contra uma despesa que ninguem ia fazer — e o
     governo perdia base por um aperto que a propria gaveta ja tinha evitado.

     A COMPOSICAO MORA AQUI AGORA, e nao no turno: ela e o que distingue o que espera
     do que executa, e essa distincao e anterior a qualquer conta de dinheiro. De
     quebra morre o segundo `compose` do arquivo — quem quiser a pauta pergunta ao
     rateio. */
  /* AS LEIS PEDIDAS ATRAVESSAM O RATEIO INTEIRAS, e nao ha o que ratear nelas:
     faixa nao consome caixa. Elas passam por aqui so para quem consulta o rateio
     — a tela e o turno — receber a proposta completa de uma vez. */
  const requestedBands = { ...bands, ...(orders.bands ?? {}) };

  const agenda = compose({
    programs,
    rules: catalog.rules,
    levels: current,
    requested,
    power: state.levels["poder-do-executivo"] ?? 0,
    bands,
    requestedBands,
  });

  const held = Object.fromEntries(
    programs.map(program => {
      const move = agenda.moves.find(
        item => item.program.id === program.id && item.kind !== "floor" && item.kind !== "ceiling",
      );
      const waits = move && move.rite !== "budget";
      const before = state.levels[program.id] ?? program.initial;
      return [program.id, waits ? before : (requested[program.id] ?? before)];
    }),
  );

  const wanted = spendOf({ programs, levels: held, bands });
  const asked = wanted.byArea;
  const askedTotal = wanted.total;

  /* QUANTO CABE. O empenho ainda e zero porque e justamente isto que decide o
     empenho. `allowance` e anualizado, como toda a regra fiscal; o turno e
     mensal, e a divisao por doze mora em `discretionaryRoom`. */
  const room = discretionaryRoom(state, catalog);

  /* QUANTO CUSTA. Emenda e ministerio saem da MESMA bolsa, e essa e a decisao de
     desenho mais importante deste arquivo: se cada um tivesse a sua, comprar o
     Congresso nao custaria saude, e a escolha central do jogo — a quem pagar —
     deixaria de existir. O preco da cadeira e o cambio que poe as duas na mesma
     moeda. */
  /* ⚠ O LEILAO: COM O PROCESSO ABERTO, A CADEIRA CUSTA MAIS. E o que transforma a
     queda de INTERRUPTOR em JOGADA — a melhor ideia do nono dossie externo, e a razao
     de ela valer e de desenho: uma derrota que se sofre e um obstaculo; uma que se
     joga e uma historia.

     Deputado que ve o presidente sangrando cobra mais para ficar do lado dele, e quem
     ja ia votar contra passa a ter concorrencia pela propria cadeira. Sobreviver aos
     342 vira um leilao que drena o caixa — e o jogador pode ganhar esse leilao.

     ⚠ E NAO HA FORMULA NOVA: o preco da cadeira e o cambio que ja poe emenda e
     ministerio na mesma moeda. O processo apenas o multiplica. */
  const seatPrice = fiscal.seatPrice * (state.impeachment === null ? 1 : SIEGE_PRICE);
  const promisedCost = costOf(promised, parties, seatPrice);
  const demand = promisedCost + askedTotal;

  const ratio = demand <= room ? 1 : room <= 0 ? 0 : room / demand;

  /** @type {Record<string, number>} */
  const paid = {};
  for (const party of parties) {
    paid[party.id] = (promised[party.id] ?? 0) * ratio;
  }
  /* O CORTE EMPURRA CADA PROGRAMA DE VOLTA NA DIRECAO DO PISO, e nao multiplica
     a alocacao por fora. A diferenca importa: multiplicar daria um numero de
     bilhoes que nao corresponde a configuracao nenhuma, e o mes seguinte
     comecaria de um estado que o jogador nao consegue ler. Empurrando o NIVEL, o
     contingenciamento vira o que ele e no mundo — o Estado inteiro escorregando
     para o minimo legal, sem ninguem ter escolhido qual programa sofre. */
  const levels = honour({ programs, levels: held, ratio, bands });
  const honoured = spendOf({ programs, levels, bands });
  const allocated = honoured.byArea;

  /* O QUE A CAPACIDADE CONSOME E O GASTO CHEIO DA AREA, e nao a parte acima do
     piso. Ver a prosa de `spendOf`: o que constroi hospital e o dinheiro que chega
     ao hospital, e nao o rotulo juridico dele. Enquanto a MALHA lia so o
     discricionario, derrubar um piso convertia gasto obrigatorio em compra de
     indice sem mover um real — e desregulamentar era a jogada dominante. */
  const funded = honoured.fullByArea;

  /* ── O PLENARIO COM GENTE DENTRO ─────────────────────────────────────────
     ⚠ A CAMARA E MONTADA AQUI, E NAO NO TURNO, pela mesma razao que o rateio: a
     tela precisa prever com EXATAMENTE a mesma camara que vai votar. Montada dos
     dois lados, o lider apareceria com um preco na Mesa e outro no plenario — e a
     divergencia so apareceria no mes em que a memoria dele virasse o placar, que e
     o mes em que ela importa.

     O ELENCO SE REFAZ DA SEMENTE a cada chamada, e isso e barato de proposito: sao
     sete pessoas e nenhuma consulta a fluxo de aleatoriedade. Guardar as pessoas no
     estado seria guardar valor derivado — e o save so precisa da semente e da
     MEMORIA, porque as pessoas se refazem e o que voce fez com elas nao. */
  const people = cast({
    seed: state.seed,
    parties,
    archetypes: catalog.archetypes,
    firstNames: catalog.firstNames,
    surnames: catalog.surnames,
    ambitions: catalog.ambitions,
  });

  const { benches, credit } = benchesOf({
    people,
    parties,
    memory: state.memory,
    parameters: catalog.cast,
  });

  /* O HUMOR DO LIDER E O HUMOR DA BANCADA DELE, e o que o distingue e a memoria.
     Sao duas coisas diferentes e nao podem virar uma: humor e do bloco e anda por
     verba e traicao coletiva; memoria e da pessoa e anda pelo que ELA recebeu.
     Sem esta linha o lider nasceria com lealdade zero — bancada em ruptura no mes
     1, que e um estado de jogo valido e portanto indistinguivel de um defeito. */
  /** @type {Record<string, number>} */
  const chamberLoyalty = { ...state.loyalty };
  for (const person of people) chamberLoyalty[person.id] = state.loyalty[person.bloc] ?? 0;

  const table = (/** @type {Record<string, number>} */ source) =>
    offered({ people, parties, funding: source, credit, parameters: catalog.cast });

  return {
    agenda,
    held,
    bands,
    people,
    benches,
    chamberLoyalty,
    offeredPromised: table(promised),
    offeredPaid: table(paid),
    promised,
    asked,
    room,
    demand,
    ratio,
    paid,
    requested,
    requestedBands,
    levels,
    allocated,
    promisedCost,
    funded,
    paidCost: promisedCost * ratio,
    allocatedTotal: askedTotal * ratio,
  };
}

/* A PAUTA DEIXOU DE TER FUNCAO PROPRIA em 15/08/2026. `agendaOf` existia para os
   dois `compose` do arquivo lerem os mesmos argumentos; agora ha um so, e ele mora
   dentro de `settlement` — porque distinguir o que ESPERA do que EXECUTA e anterior
   a qualquer conta de dinheiro, e o rateio precisa dessa distincao para dividir o
   executavel em vez do sonhado. Quem quiser a pauta pergunta ao rateio. */

/**
 * QUEM EXIGE NESTE MES, E O QUE — a chantagem, e ela e DETERMINISTICA.
 *
 * ⚠ O GATILHO NAO PODE SER SORTEADO, e a razao esta escrita no ciclo 10: a queda tem
 * de se ver chegar, e um evento aleatorio e o oposto disso. Um lobby exige quando a
 * pressao dele cruza `demandAt` — e `demandAt` e MENOR que o ponto de fervura, porque
 * uma exigencia que chega depois de o grupo ja ter abandonado o governo e um recibo.
 *
 * ── SO OS DOIS QUE LEEM A MALHA EXIGEM, e a limitacao e declarada ────────────
 * Cada lobby cobra na moeda do canal que ele lê, e essa e a regra de exclusao mutua do
 * catalogo. Os dois de capacidade cobram GASTO NUMA AREA, que e uma alavanca que o
 * presidente move com a caneta. Os outros dois cobram coisas que ainda nao tem carta:
 * o mercado quer que a divida pare de crescer — um TETO, e nao um piso — e o baixo
 * clero quer verba para as bancadas, que nao e alavanca. **Fica registrado**: sao a
 * proxima onda, e cada um precisa de um verbo proprio.
 *
 * ── E ELE EXIGE DE VOLTA O QUE FOI CORTADO ──────────────────────────────────
 * O nivel exigido e o da POSSE, e por isso a exigencia so nasce quando o jogador de
 * fato cortou. Entre os programas da area dele, o escolhido e o de maior QUEDA em
 * dinheiro — o corte que mais pesou no mundo, e nao o maior em pontos de controle. E a
 * mesma regua que a pauta usa para escolher o assunto dela.
 *
 * @param {GameState} state
 * @param {Record<string, number>} pressure - a pressao DEPOIS do mes
 * @param {typeof CATALOG} catalog
 * @returns {import("../state/state.mjs").Letter[]}
 */
function demandsOf(state, pressure, catalog) {
  /** @type {import("../state/state.mjs").Letter[]} */
  const written = [];

  for (const lobby of catalog.lobbies) {
    if (lobby.reads !== "capacity") continue;
    if ((pressure[lobby.id] ?? 0) < catalog.pressure.demandAt) continue;

    /* ⚠ UMA EXIGENCIA ABERTA POR VEZ, POR GRUPO. Sem isto o mesmo lobby escreveria
       todo mes enquanto a pressao dele estivesse alta, e a bandeja viraria a lista de
       tarefas que o ciclo 9 recusou. */
    if (state.mail.some(letter => letter.from === lobby.id && letter.answer === null)) continue;

    const areas = new Set((lobby.areas ?? "").split(" ").filter(Boolean));

    /* O CORTE QUE MAIS PESOU EM DINHEIRO. `cost` e o gasto anual cheio do programa,
       entao `(posse − hoje)/100 × custo` e quanto o pais deixou de gastar ali. */
    let worst = null;
    let deepest = 0;
    for (const program of catalog.programs) {
      if (!areas.has(program.area)) continue;
      const now = state.levels[program.id] ?? program.initial;
      const cut = ((program.initial - now) / 100) * program.cost;
      if (cut > deepest) {
        deepest = cut;
        worst = program;
      }
    }

    /* NADA CORTADO, NADA A EXIGIR — e o silencio aqui e a informacao. Um grupo
       insatisfeito que nao tem o que pedir continua esquentando pelo indice; ele so
       nao tem uma carta para escrever. */
    if (!worst) continue;

    written.push(demand({ lobby, program: worst, level: worst.initial, month: state.month }));
  }

  return written;
}

/**
 * PARA ONDE O INDICE DE CADA AREA VAI ESTE MES — e e a MESMA conta que o turno fara.
 *
 * ⚠ ELA NASCEU DE UM DEFEITO MEDIDO, e ele e a SETIMA ocorrencia da familia mais cara
 * deste projeto. O entrypoint projetava o indice a mao:
 *
 *     value − area.decay + area.yield × share.asked[area.id]
 *
 * com a prosa ao lado afirmando, em maiusculas, que "a projecao e a mesma conta do
 * motor, e nao uma aproximacao escrita aqui". **Nao era**, e por duas razoes somadas:
 *
 *   · a MALHA consome `funded` — o gasto CHEIO da area, piso incluido e ja rateado —
 *     desde 14/08/2026, e `asked` e so a parte ACIMA DO PISO. Na Previdencia os dois
 *     numeros sao R$ 2,4 bi e R$ 126,7 bi: a tela projetava com 2% do dinheiro;
 *   · o canal `capacity`, que a educacao exerce sobre a industria, nao entrava.
 *
 * Medido no mes 1 da partida padrao: em CINCO das oito areas a seta apontava para o
 * lado ERRADO. A tela dizia que a Saude cairia de 61,0 para 60,4; o mes a levou a 61,1.
 *
 * ⚠ E O DEFEITO NASCEU DE UMA MUDANCA QUE DEIXOU UMA COPIA PARA TRAS, que e como
 * todas as sete nasceram: `funded` substituiu `asked` na alimentacao da MALHA, e a
 * projecao do entrypoint ficou no numero antigo, em silencio.
 *
 * ── O CONTRAFACTUAL MUDOU DE PERGUNTA, e a razao e a mesma ────────────────────
 * `idle` era "o indice sem alocacao nenhuma" — `value − decay` —, e essa e uma
 * configuracao que a LEI NAO PERMITE: gastar zero numa area exige derrubar todos os
 * pisos dela por emenda. Um contrafactual que descreve um mundo inalcancavel nao
 * ajuda a decidir. Agora ele e o mes **sem as ordens do jogador**: o que acontece se
 * ele nao mexer em nada, que e exatamente a alternativa a decisao que ele esta
 * tomando enquanto olha a linha.
 *
 * @param {GameState} state
 * @param {Orders} [orders]
 * @param {typeof CATALOG} [catalog]
 * @returns {{ index: Record<string, number>, idle: Record<string, number> }}
 *   o indice de cada area no fim deste mes: com as ordens, e sem elas
 */
export function outlook(state, orders = {}, catalog = CATALOG) {
  /** @param {Orders} given */
  const project = given =>
    capacityStep({
      areas: catalog.areas,
      index: state.capacity.index,
      history: state.capacity.history,
      /* O QUE A AREA RECEBE E O QUE O RATEIO HONRA, e quem sabe isso e `settlement`.
         Perguntar aqui e a unica forma de a linha nao divergir no mes em que o caixa
         apertar — que e justamente o mes em que o jogador precisa dela. */
      allocation: settlement(state, given, catalog).funded,
      impacts: {},
      neutral: NEUTRAL,
      capacityTarget: CAPACITY_TARGET,
    }).index;

  return { index: project(orders), idle: project({}) };
}

/**
 * A GAVETA COMO A TELA PRECISA VÊ-LA — o que esta andando, e ha quanto tempo.
 *
 * ⚠ ELA EXISTE PORQUE A TRAMITACAO SEM TELA SERIA UMA MENTIRA PIOR que a que ela
 * conserta. Com o texto virando instantaneo, a Mesa mostrava um placar do mes; com
 * a tramitacao, o texto que o jogador escreve hoje vai para a gaveta — e uma tela
 * que continuasse anunciando "acima do quorum" estaria prevendo uma votacao que
 * nao vai acontecer. E a terceira vez que este projeto encontra a mesma familia de
 * defeito, e desta vez ele foi visto antes de existir.
 *
 * O QUE ELA DEVOLVE E O ESTADO DE CADA TEXTO, com o quorum recomposto contra o
 * pais de hoje: o mesmo `proposalOf` que a tramitacao usa, e nao uma segunda
 * leitura.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 */
export function passageOf(state, catalog = CATALOG) {
  const bands = bandsOf(state, catalog);
  const power = state.levels["poder-do-executivo"] ?? 0;

  return state.bills.map(bill => {
    const agenda = proposalOf(bill, { levels: state.levels, bands, power, catalog });
    return {
      id: bill.id,
      label: bill.label,
      stage: bill.stage,
      /* HA QUANTOS MESES ELE ESPERA, e nao em que mes ele entrou: o jogador conta
         espera, e nao data. */
      waiting: state.month - bill.since,
      /* ⚠ QUANTO FALTA PARA ELE MORRER NA GAVETA, e so na gaveta: um texto que ja
         passou pela Mesa nao volta para la. Sem esta leitura, "engavetado" seria um
         rotulo permanente e o jogador nunca saberia que ha um relogio correndo. */
      expires: bill.stage === "drawer" ? DRAWER_LIFE - (state.month - bill.writtenAt) : null,
      instrument: agenda.proposal?.instrument ?? "",
      quorum: agenda.quorum,
      saved: bill.saved ?? null,
    };
  });
}

/**
 * O PLENARIO CADEIRA A CADEIRA — as onze bancadas, com o que cada uma entrega.
 *
 * ⚠ ELA E A PORTA DO HEMICICLO, e existe pela mesma razao que `forecast`: a tela
 * nao monta camara. Desenhar 513 cadeiras exige saber o tamanho de cada bancada E
 * quantas delas de fato respondem ao governo — e a segunda conta e `moodFactor`,
 * que e calibragem de ECLUSA. Refeita na tela, ela erraria no dia seguinte a
 * primeira recalibragem dos pedagios, e o sintoma seria um plenario DESENHADO que
 * discorda do numero impresso ao lado dele.
 *
 * ⚠ SAO AS ONZE BANCADAS, e nao os quatro blocos. E o que o hemiciclo tem a dizer
 * que o arco nao tinha: de que a Camara e FEITA. Com quatro caixas o desenho seria
 * o mesmo grafico de sempre com outra forma.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 */
export function chamberOf(state, catalog = CATALOG) {
  const share = settlement(state, {}, catalog);
  return seating({ parties: share.benches, loyalty: share.chamberLoyalty });
}

/**
 * O SEU GOVERNO — quem voce e, quem fala com voce, e no que voce se tornou.
 *
 * ⚠ ELA RESPONDE A PERGUNTA QUE O JOGO NUNCA RESPONDEU. Ate 15/08/2026 nenhuma
 * tela dizia de quem era o mandato: a barra anunciava "1º MANDATO · ANO 1" — o
 * mandato de QUEM? —, e o jogador era a unica pessoa sem nome num jogo em que sete
 * outras tinham. Um simulador em que voce e ninguem e um painel sobre o pais, e nao
 * uma presidencia.
 *
 * O ELENCO E REFEITO AQUI, e isso e barato de proposito — sao oito pessoas e
 * nenhuma consulta a fluxo de aleatoriedade, exatamente como `settlement` ja o
 * refaz todo mes. Guardar as pessoas no estado seria guardar valor derivado.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 */
export function governmentOf(state, catalog = CATALOG) {
  const people = cast({
    seed: state.seed,
    parties: catalog.parties,
    archetypes: catalog.archetypes,
    firstNames: catalog.firstNames,
    surnames: catalog.surnames,
    ambitions: catalog.ambitions,
  });

  return {
    /* O ELENCO INTEIRO SAI JUNTO: as cartas da tramitacao precisam achar quem
       assina cada uma pelo CARGO, e refazer o elenco na tela seria a segunda
       geracao da mesma gente no mesmo turno. */
    people,
    president: president({
      seed: state.seed,
      people,
      firstNames: catalog.firstNames,
      surnames: catalog.surnames,
    }),
    /* ⚠ O CONSELHEIRO E ACHADO PELO CARGO, e nao pelo id do arquetipo. Procurar por
       `chief-of-staff` amarraria a camada de aplicacao a uma linha do catalogo; o
       cargo e o contrato, e e ele que diz o que a pessoa FAZ. */
    adviser: people.find(person => person.office === "chief") ?? null,
    stance: stanceOf(state, catalog),
  };
}

/**
 * QUEM O GOVERNO SE TORNOU — a posicao do mandato inteiro, e nao a do mes.
 *
 * ── A REGRA DO CICLO 2, FINALMENTE VISIVEL ───────────────────────────────────
 * "A posicao ideologica e sombra, e nunca controle": o jogador nao arrasta um
 * cursor no plano `economico × liberdades` — ele mexe em leitos e aliquotas, e a
 * posicao e CALCULADA do que ele moveu. Isso vale desde o ciclo 2, e ate
 * 15/08/2026 nao havia uma tela no jogo que dissesse o resultado. O calculo
 * existia, rodava todo mes dentro de `compose`, e morria dentro de uma pauta.
 *
 * ⚠ E ELA E A MESMA FUNCAO, e nao uma formula parecida. O que muda e o par que se
 * compara: `compose` mede o RASCUNHO contra o vigente e devolve a posicao do texto
 * do mes; aqui o vigente e medido contra o ORCAMENTO HERDADO, e a posicao devolvida
 * e a do mandato acumulado. Escrever a media ponderada de novo neste arquivo daria
 * dois lugares calculando ideologia, e eles divergiriam na primeira recalibragem —
 * com a tela afirmando um governo de esquerda que o Congresso trata como de direita.
 *
 * ⚠ SEM MOVIMENTO NAO HA POSICAO, e `null` e a resposta certa. Um presidente que
 * nao mexeu em nada nao e "de centro": ele nao tem posicao propria nenhuma, porque
 * tudo o que esta em vigor foi o antecessor que escreveu. Devolver o centro do
 * plano seria inventar uma ideologia para quem nao exerceu nenhuma — e e a mesma
 * regra que faz a area sem historico calar em vez de imprimir zero.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {{ economic: number, liberty: number, near: string, article: string } | null}
 */
function stanceOf(state, catalog = CATALOG) {
  const levers = [...catalog.programs, ...catalog.rules];

  /* O PAIS COMO ELE FOI RECEBIDO. Ele sai do catalogo pela mesma razao que
     `createState` o tira de la: dois lugares com o mesmo numero e um lugar que vai
     divergir na primeira recalibragem. */
  const inherited = Object.fromEntries(levers.map(lever => [lever.id, lever.initial]));

  const walked = compose({
    programs: catalog.programs,
    rules: catalog.rules,
    levels: inherited,
    requested: state.levels,
    power: state.levels["poder-do-executivo"] ?? 0,
    /* A FAIXA NAO IMPORTA AQUI, e passar a vigente seria pior que nao passar: o que
       se mede e para onde o gasto andou, e nao que rito isso exigiria. */
    bands: {},
    requestedBands: {},
  });

  if (!walked.proposal) return null;

  /* ── O MARCO E O BLOCO MAIS PROXIMO, e nao um rotulo inventado ──────────────
     O plano nao tem regioes com nome, e batizar faixas dele — "voce e de centro-
     esquerda" — seria importar uma taxonomia que o modelo nao tem, que foi
     exatamente o que ja se recusou duas vezes a duas auditorias. O que o modelo TEM
     sao quatro blocos com posicao declarada, e eles sao os unicos pontos de
     referencia nomeados que existem. Entao a tela nao diz o que o governo E: ela diz
     de quem ele mais se APROXIMA, com a mesma distancia euclidiana que ECLUSA usa
     para decidir quem vota a favor. */
  let near = "";
  let article = "";
  let best = Infinity;
  for (const party of catalog.parties) {
    const dx = party.economic - walked.proposal.economic;
    const dy = party.liberty - walked.proposal.liberty;
    const distance = dx * dx + dy * dy;
    if (distance < best) {
      best = distance;
      near = party.label;
      /* ⚠ O ARTIGO VEM JUNTO, e vem do CATALOGO. A tela escreve "mais perto DO
         Centrao" e "DA Esquerda"; montar a contracao na view seria uma tabela de
         excecoes escondida numa string, e o quinto bloco sairia com a preposicao
         errada sem nada acusar. */
      article = party.article ?? "";
    }
  }

  return {
    economic: walked.proposal.economic,
    liberty: walked.proposal.liberty,
    near,
    article,
  };
}

/**
 * O PLACAR DA VOTACAO ANTES DELA ACONTECER — com a MESMA camara que vai votar.
 *
 * ── O DEFEITO QUE ELA CONSERTA, E ELE ERA O MAIS CARO DA TELA ────────────────
 * A Mesa montava a previsao a mao, no entrypoint, com os QUATRO blocos do
 * catalogo, a verba crua e a lealdade crua. O turno vota com outra coisa desde a
 * oitava sessao: as ONZE bancadas do ELENCO, a verba com o credito de memoria e o
 * desconto de ambicao dentro, e a APROVACAO DA RUA deslocando a resistencia —
 * `standing`, que a tela nem passava.
 *
 * Medido em 1.012 votacoes reais: divergencia de ate 35 votos, e o veredito
 * INVERTIDO em 275 delas — 27,2%. A tela anunciava "acima do quorum" e o mes
 * derrubava a pauta em mais de um quarto dos casos.
 *
 * ⚠ E O CONSERTO NAO E CORRIGIR A CHAMADA — E TIRAR DA TELA A CAPACIDADE DE MONTAR
 * A CAMARA. Este e o terceiro defeito da mesma familia no projeto: a Mesa ja previu
 * com a verba prometida enquanto o turno pagava a rateada, e a tela ja remontou a
 * legislacao por fora antes de `bandsOf` existir. Toda vez a causa foi a mesma —
 * havia dois lugares montando a mesma pergunta. Enquanto a tela PUDER montar, ela
 * vai divergir de novo na proxima peca que o motor ganhar; e o ELENCO e a SONDA
 * provam isso, porque nenhum dos dois quebrou nada: eles so chegaram, e a tela
 * ficou para tras em silencio.
 *
 * ⚠ A BANDA TAMBEM ESTAVA ERRADA, e por uma razao que so aparece na aritmetica:
 * `dispersion` soma variancia POR BANCADA, porque cada uma saca do proprio fluxo em
 * `vote`. Repartir um bloco de 205 cadeiras em quatro de ~51 nao divide a banda por
 * quatro — divide por dois, porque erros independentes se somam em quadratura.
 * Calculada sobre 4 blocos, ela anunciava uma incerteza MAIOR que a real.
 *
 * @param {GameState} state
 * @param {Orders} [orders]
 * @param {typeof CATALOG} [catalog]
 */
export function forecast(state, orders = {}, catalog = CATALOG) {
  const share = settlement(state, orders, catalog);
  const agenda = share.agenda;

  /* A MESMA RUA QUE O TURNO USA: a do mes passado, ja divulgada. Ver o passo 4 de
     `playMonth` — o parlamentar vota com a pesquisa que ele ja leu. */
  const standing = pollFrom(state.mood, catalog.segments, catalog.opinion).good;

  /* TODO BLOCO ENTRA NO MAPA, inclusive com zero: a tela desenha uma linha por
     bloco sempre, e uma chave ausente a faria imprimir vazio onde o certo e zero. */
  /** @type {Record<string, number>} */
  const byBloc = {};
  for (const party of catalog.parties) byBloc[party.id] = 0;

  /* SEM PAUTA NAO HA PLACAR, e a ausencia e devolvida como ausencia. A tela ja
     sabe nao desenhar um travessao de 4,5rem no lugar de um numero.

     ⚠ MAS A GENTE CONTINUA LA, e essa e a diferenca entre nao haver votacao e nao
     haver Congresso. O mes sem pauta ainda tem presidente da Camara, ainda tem
     lider com memoria do que o governo fez, e o jogador ainda precisa ver com quem
     ele vai negociar quando escrever alguma coisa. O que fica em zero e o VOTO. */
  if (!agenda.proposal || agenda.quorum === 0) {
    return {
      agenda,
      share,
      standing,
      whip: null,
      band: 0,
      byBloc,
      blocs: blocsOf(state, share, { votes: 0, parties: [] }, byBloc, catalog),
    };
  }

  const whip = whipCount({
    bill: agenda.proposal,
    parties: share.benches,
    funding: share.offeredPaid,
    loyalty: share.chamberLoyalty,
    standing,
  });

  /* ── O QUE CADA BLOCO ENTREGA, somando as bancadas dele ────────────────────
     A tela oferece um controle de verba por BLOCO — e o jogador paga bloco, nao
     pessoa. Mas quem vota sao as onze bancadas, e o lider de um bloco e uma delas.
     A soma mora aqui e nao na tela pela razao de sempre: feita por fora, ela
     esqueceria uma bancada no dia em que o elenco crescer, e a soma das linhas
     deixaria de bater com o total logo abaixo delas — sem nada acusar. */
  const blocOf = new Map(share.people.map(person => [person.id, person.bloc]));
  for (const bench of whip.parties) {
    const bloc = blocOf.get(bench.partyId) ?? bench.partyId;
    if (bloc in byBloc) byBloc[bloc] = (byBloc[bloc] ?? 0) + bench.votes;
  }

  return {
    agenda,
    share,
    standing,
    whip,
    band: dispersion({ parties: share.benches, loyalty: share.chamberLoyalty }),
    byBloc,
    blocs: blocsOf(state, share, whip, byBloc, catalog),
  };
}

/**
 * O CONGRESSO COMO A TELA PRECISA VÊ-LO — blocos, e a gente dentro deles.
 *
 * ⚠ ELA EXISTE PORQUE A GENTE ESTAVA NO MOTOR E NAO NA TELA. Sete pessoas com nome,
 * cargo, ambicao e memoria eram geradas todo turno, decidiam o preco de cada
 * votacao, e nenhuma linha de interface as mencionava: o jogador pagava um bloco, a
 * memoria do lider mudava o valor em silencio, e ele nunca soube que existia um
 * lider. Um motor que o jogador nao consegue ver nao e profundidade — e custo.
 *
 * ⚠ E A MONTAGEM MORA AQUI, e nao na tela, pela mesma razao de `byBloc`: casar
 * pessoa com bancada, bancada com voto e pessoa com memoria sao quatro junções, e
 * feitas por fora elas erram calado no dia em que o elenco crescer. A tela recebe
 * uma lista pronta e desenha.
 *
 * ⚠ SO ENTRA QUEM TEM CADEIRA. Um lider cujo alcance arredonda para zero assento
 * nao e uma linha vazia na tela — ele nao esta no plenario, e `benches` ja o
 * descarta. Listar um nome que entrega zero voto ensinaria o jogador a procurar
 * gente que nao decide nada.
 *
 * @param {GameState} state
 * @param {ReturnType<typeof settlement>} share
 * @param {import("../domain/congress/index.mjs").Forecast} whip
 * @param {Record<string, number>} byBloc
 * @param {typeof CATALOG} catalog
 */
function blocsOf(state, share, whip, byBloc, catalog) {
  const seatsOf = new Map(share.benches.map(bench => [bench.id, bench.seats]));
  const votesOf = new Map(whip.parties.map(bench => [bench.partyId, bench.votes]));

  return catalog.parties.map(party => ({
    id: party.id,
    label: party.label,
    seats: party.seats,
    votes: byBloc[party.id] ?? 0,
    people: share.people
      .filter(person => person.bloc === party.id && (seatsOf.get(person.id) ?? 0) > 0)
      .map(person => ({
        id: person.id,
        name: person.name,
        office: person.office,
        /* O ARQUETIPO EM UMA LINHA — "cacique da Mesa", "lider do Centrao". Ele vem
           do catalogo e nao e montado aqui: e o vocabulario, e vocabulario mora no
           catalogo com a fonte dele ao lado. */
        role: person.label,
        ambition: person.ambition,
        seats: seatsOf.get(person.id) ?? 0,
        /* ⚠ O ALCANCE QUE VAI PARA A TELA E O EFETIVO, e nao `person.reach` cru.
           Os alcances de um bloco sao NORMALIZADOS quando somam mais que `CROWD` —
           foi o conserto do defeito que fechava a Camara com 730 cadeiras —, entao
           o cru diz o que a pessoa queria arrastar e o efetivo diz o que ela
           arrasta. Mostrar o cru poria na tela um numero que a votacao nao usa. */
        reach: party.seats > 0 ? (seatsOf.get(person.id) ?? 0) / party.seats : 0,
        votes: votesOf.get(person.id) ?? 0,
        /* ⚠ A MEMORIA VAI NORMALIZADA, de -1 a 1, e nao em pontos. O numero cheio
           depende de `memoryCap`, que e calibragem de ELENCO — e a tela que o
           mostrasse cru teria de saber o teto para dizer se 40 e muito ou pouco.
           Normalizada, ela e a mesma fracao que o motor usa como verba. */
        memory: clamp((state.memory[person.id] ?? 0) / (catalog.cast.memoryCap || 1), -1, 1),
      })),
  }));
}

/**
 * O PLACAR FISCAL DO MES — a leitura que a tela de Financas mostra.
 *
 * ⚠ ELA EXISTE PORQUE O PAINEL NAO PODE REFAZER A CONTA. Financas mostra dez
 * numeros que sairiam de dois motores — LASTRO e CORRENTE —, e o entrypoint nao
 * alcanca motor: a fachada so abre a camada de aplicacao, e a guarda de
 * fronteiras cobra isso. Sem esta funcao, a saida seria expor `budgetStep` e
 * `carry` crus na fachada, e a tela passaria a montar a posicao orcamentaria por
 * fora — que e a definicao de conta que diverge. `settlement` fez o mesmo
 * caminho, e pela mesma razao.
 *
 * ELA E A FOTO DO MES COMO ELE VAI FECHAR, e nao a do mes que passou. O empenho
 * que entra e o que o caixa HONRA das ordens correntes, exatamente como no passo
 * 7 do turno — inclusive a venda de estatal, que abate empenho. Um painel que
 * ignorasse o mes corrente mostraria uma divida que so anda depois de o jogador
 * avancar, e a decisao que a moveu ja teria saido da tela.
 *
 * O JURO E O DO ESTOQUE QUE CHEGOU, a taxa que vigorava no inicio do mes — a
 * mesma regra do passo 9 —, e a divida que ela devolve ja o carrega, porque e
 * assim que `nextPosition` fecha o mes. Duas verdades sobre o estoque seriam uma
 * a mais.
 *
 * @param {GameState} state
 * @param {Orders} [orders]
 * @param {typeof CATALOG} [catalog]
 * ⚠ O PREMIO SAI JUNTO, e nao e a tela que o calcula. Ele e o mesmo que o turno vai
 * cobrar neste mes — refeito na view, ele divergiria no dia em que a forma da curva
 * mudasse, e o jogador leria um spread que o Tesouro nao paga.
 *
 * @returns {{ budget: BudgetOutput, interest: number, debt: number, debtRatio: number,
 *   premium: number }}
 */
export function ledger(state, orders = {}, catalog = CATALOG) {
  const share = settlement(state, orders, catalog);
  const proceeds = saleOf(catalog.rules, state.levels, share.levels);

  const budget = budgetStep({
    ...positionOf(state, catalog),
    spent: share.paidCost + share.allocatedTotal - proceeds,
  });

  const premium = premiumNow(state, catalog);
  const interest = carry({
    debt: state.fiscal.debt,
    rate: state.macro.rate,
    premium,
    parameters: catalog.macro,
  });

  const debt = budget.debt + interest;

  return {
    budget,
    interest,
    debt,
    debtRatio: state.macro.gdp > 0 ? debt / state.macro.gdp : 0,
    premium,
  };
}

/**
 * O TEXTO QUE O MES DE HOJE PROTOCOLA — e ele guarda o PEDIDO, e nao o efeito.
 *
 * ⚠ SO O QUE PRECISA DE VOTO ENTRA NO TEXTO. Remanejamento dentro das faixas e
 * execucao orcamentaria e vale na hora; se ele entrasse aqui, o presidente teria de
 * esperar tres meses para trocar um leito de lugar — e a tramitacao passaria a
 * cobrar tempo de quem nao legislou nada.
 *
 * @param {import("./agenda.mjs").Agenda} agenda
 * @param {number} month
 * @param {Record<string, import("../state/state.mjs").Band>} bands as leis vigentes
 * @param {Record<string, import("../state/state.mjs").Band>} asked as pedidas
 * @param {Record<string, number>} requested os niveis pedidos
 * @returns {import("./passage.mjs").Bill | null}
 */
function draft(agenda, month, bands, asked, requested) {
  if (!agenda.proposal || agenda.quorum === 0) return null;

  /** @type {Record<string, import("../state/state.mjs").Band>} */
  const bills = {};
  for (const [id, band] of Object.entries(asked)) {
    const now = bands[id];
    if (!now || band.floor !== now.floor || band.ceiling !== now.ceiling) bills[id] = band;
  }

  /** @type {Record<string, number>} */
  const levels = {};
  for (const move of agenda.moves) {
    if (move.kind === "floor" || move.kind === "ceiling") continue;
    if (move.rite === "budget") continue;
    const level = requested[move.program.id];
    if (level !== undefined) levels[move.program.id] = level;
  }

  return {
    id: `texto-m${month}`,
    writtenAt: month,
    stage: "drawer",
    since: month,
    label: agenda.proposal.label,
    bands: bills,
    levels,
    except: [],
  };
}

/* OS EVENTOS DO MES QUE VIRAM AVISO. Nem todos viram, e a lista e a decisao:

     `reported` NAO ENTRA. Quando o relator emendou, o que chega ao jogador e a
     PERGUNTA — a carta com prazo —, e um aviso ao lado dela dizendo a mesma coisa
     seria a quarta duplicacao desta familia neste projeto. Quando ele nao emendou,
     nao ha noticia nenhuma: um texto que passou pela relatoria intacto e um texto
     que continua andando;
     `blocked` NAO ENTRA pela mesma razao invertida: quem travou foi o jogador, e
     avisar alguem do que ele acabou de decidir e recibo.

   Sobra o que o MUNDO fez sem ser perguntado, que e exatamente o que uma caixa de
   entrada existe para trazer. */
const NOTICED = new Set(["tabled", "forgotten", "passed", "rejected"]);

/**
 * O QUE O CERCO ESCREVE — e ele so escreve quando alguma coisa MUDA.
 *
 * ⚠ ELA NASCEU DE UMA MEDICAO. Num governo passivo chegam ZERO cartas em 44 meses,
 * e o processo de impeachment abre no mes 43 no meio desse silencio: o pais
 * desmoronava e a unica noticia era uma barra num cartao da coluna da direita. A
 * caixa nao estava quebrada — ela responde ao que o jogador FAZ, e quem nao legisla
 * nao recebe correspondencia de tramitacao. O que faltava era o mundo escrever
 * quando o mundo se mexe sozinho.
 *
 * ⚠ E ELA CUMPRE UMA REGRA QUE O MOTOR JA TINHA ESCRITO: "a queda tem de se ver
 * chegar. Uma derrota que voce viu chegar e nao conseguiu evitar e uma historia; uma
 * que chega sem aviso e um defeito percebido". As tres reguas do Gabinete ja diziam
 * isso a quem olhasse; a carta e o que chega a quem nao estava olhando.
 *
 * ⚠ SO A TRANSICAO ESCREVE, e nao o estado. Uma carta por mes de ruptura aberta
 * empilharia trinta avisos identicos ate o plenario votar — que e o mural que a
 * caixa deixou de ser em 16/08/2026. E por isso ela precisa das rupturas de ANTES:
 * elas nao estao no estado, entao a unica maneira de saber o que mudou e perguntar
 * duas vezes, com o antes e com o depois.
 *
 * @param {GameState} state o mes ANTES do passo
 * @param {ReturnType<typeof rupture>} now as rupturas depois dele
 * @param {number | null} impeachment o mes em que o processo abriu, ja decidido
 * @param {typeof CATALOG} catalog
 * @returns {import("../state/state.mjs").Letter[]}
 */
function alarmsOf(state, now, impeachment, catalog) {
  const before = rupture({
    pressure: state.pressure,
    lobbies: catalog.lobbies,
    standing: pollFrom(state.mood, catalog.segments, catalog.opinion).good,
    broker: BROKER,
    parameters: catalog.pressure,
  });

  /** @type {import("../state/state.mjs").Letter[]} */
  const written = [];

  for (const id of /** @type {const} */ (["social", "economic", "political"])) {
    if (before[id] || !now[id]) continue;
    written.push(alarm({ kind: "rupture", id, subject: id, month: state.month }));
  }

  /* ⚠ O CERCO LE `impeachment`, E NAO `now.open`, e a diferenca importa: o processo
     NAO SE FECHA quando uma das tres melhora — ele so termina no plenario. Escrito
     contra as rupturas, este aviso chegaria de novo toda vez que a terceira delas
     reabrisse, num processo que ja estava de pe havia meses. */
  if (state.impeachment === null && impeachment !== null) {
    written.push(alarm({ kind: "siege", id: "siege", subject: "siege", month: state.month }));
  }

  /* ⚠ A CAIXA MANDA NO ID. O alarme nao carrega o mes de proposito — a ferida que
     reabre nao e uma noticia nova —, e sem esta linha uma pressao oscilando em volta
     do limiar poria duas cartas de mesmo id na bandeja no mesmo mes. */
  const held = new Set(state.mail.map(letter => letter.id));
  return written.filter(letter => !held.has(letter.id));
}

/**
 * @param {ReadonlyArray<{ kind: string, label: string, detail: string | null, bill: string }>} events
 * @param {number} month
 * @returns {import("../state/state.mjs").Letter[]}
 */
function notices(events, month) {
  return events
    .filter(event => NOTICED.has(event.kind))
    .map(event =>
      notice({
        kind: /** @type {"tabled" | "forgotten" | "passed" | "rejected"} */ (event.kind),
        id: event.bill,
        subject: event.label,
        month,
      }),
    );
}

/**
 * OS TEXTOS UM ESTAGIO ADIANTE — e no maximo UM estagio por mes.
 *
 * ⚠ ESTA FUNCAO E A PARTE 3 INTEIRA, e o que ela acrescenta ao jogo e TEMPO. Ela
 * nao inventa preco nenhum: a Mesa decide com `whipCount`, o relator escolhe com a
 * distancia que ECLUSA usa, e o plenario vota com `vote`. Ver `passage.mjs`.
 *
 * ⚠ UM SO CHEGA AO PLENARIO POR MES, e a restricao e de desenho e nao de
 * implementacao: duas votacoes no mesmo turno dariam ao jogador dois placares para
 * ler e uma unica bolsa de verba para dividir entre eles — e a verba ja foi paga
 * antes de qualquer votacao acontecer. Um plenario por mes e o que mantem a
 * negociacao legivel. Os outros esperam onde estao.
 *
 * @param {GameState} state
 * @param {object} world
 * @param {{ benches: Party[], offeredPaid: Record<string, number>,
 *   chamberLoyalty: Record<string, number>,
 *   people: ReadonlyArray<import("../domain/cast/index.mjs").Person>,
 *   bands: Record<string, import("../state/state.mjs").Band> }} world.share
 * @param {number} world.standing
 * @param {typeof CATALOG} world.catalog
 * @param {ReadonlyArray<import("../state/state.mjs").Letter>} world.resolved as
 *   perguntas que FECHARAM neste mes, respondidas ou vencidas
 * @param {ReadonlyArray<import("../state/state.mjs").Letter>} world.mail a caixa JA
 *   fechada — ver a nota sobre `pending`, abaixo
 */
function advanceBills(state, { share, standing, catalog, resolved, mail }) {
  const speaker = share.people.find(person => person.office === "speaker") ?? null;
  const rapporteur = share.people.find(person => person.office === "rapporteur") ?? null;
  const power = state.levels["poder-do-executivo"] ?? 0;

  /* O QUE O JOGADOR DECIDIU SOBRE CADA TEXTO, indexado pelo texto e nao pela carta:
     quem pergunta aqui e a tramitacao, e ela raciocina em texto.

     ⚠ E "aceito" E "aceito por silencio" SAO A MESMA COISA PARA O TEXTO. A
     diferenca entre decidir e deixar vencer e informacao do jogador, e ela mora na
     carta — que guarda qual dos dois foi. Duplica-la aqui daria dois lugares
     dizendo o mesmo, e um deles ia divergir. */
  const answers = new Map(
    resolved
      .filter(letter => letter.bill !== null && letter.kind === "reported")
      .map(letter => [
        /** @type {string} */ (letter.bill),
        { answer: letter.answer, except: letter.except, saved: letter.saved },
      ]),
  );

  /** @type {import("./passage.mjs").Bill[]} */
  const bills = [];
  /** @type {import("./passage.mjs").Bill[]} */
  const dropped = [];
  /* AS PERGUNTAS QUE ESTE MES ABRE. Elas saem daqui e nao de `events` porque uma
     pergunta nao e um aviso: ela tem prazo, guarda os termos da emenda e SEGURA o
     texto. */
  /** @type {import("../state/state.mjs").Letter[]} */
  const asked = [];
  /* ⚠ O QUE ACONTECEU COM CADA TEXTO, e nao so onde ele esta. A tramitacao sem isto
     e muda: o jogador ve a lei sumir da gaveta e nao sabe se a Mesa engavetou, se o
     relator a esvaziou ou se o plenario a derrubou. Uma mecanica que so mostra
     ESTADO e um obstaculo; uma que mostra CAUSA e uma jogada. Estes eventos sao a
     materia-prima das cartas do Gabinete. */
  /** @type {{ kind: string, label: string, detail: string | null, bill: string }[]} */
  const events = [];
  /** @type {Tally | null} */
  let tally = null;
  /** @type {import("./passage.mjs").Bill | null} */
  let passed = null;
  let stream = state.streams.congress;
  let voted = false;

  for (const bill of state.bills) {
    const agenda = proposalOf(bill, { levels: state.levels, bands: share.bands, power, catalog });

    /* ⚠ TEXTO QUE DEIXOU DE PEDIR ALGUMA COISA MORRE, e nao vai a voto. Ele fica
       vazio quando o mundo andou por baixo dele: outra lei ja baixou aquele piso, ou
       o relator salvou a unica alavanca que ele movia. Levar um texto vazio ao
       plenario seria pedir voto para nada — e o Congresso aprovaria, porque nada
       nao incomoda ninguem, e o jogador veria uma vitoria que nao mudou um real. */
    if (!agenda.proposal || agenda.quorum === 0) {
      dropped.push(bill);
      continue;
    }

    if (bill.stage === "drawer") {
      if (forgotten(bill, state.month)) {
        dropped.push(bill);
        events.push({ kind: "forgotten", label: bill.label, detail: null, bill: bill.id });
        continue;
      }
      const { tabled } = tables({
        proposal: agenda.proposal,
        speaker,
        benches: share.benches,
        funding: share.offeredPaid,
        loyalty: share.chamberLoyalty,
        standing,
      });
      /* ⚠ QUEM NAO E PAUTADO NAO PERDE — ELE ESPERA. E a diferenca entre a gaveta e
         a derrota, e ela e o poder mais real do sistema brasileiro: o texto nao
         some, ele fica, e o jogador pode voltar no mes seguinte com a Mesa mais bem
         paga. So o relogio o mata. */
      if (tabled) events.push({ kind: "tabled", label: bill.label, detail: null, bill: bill.id });
      bills.push(tabled ? { ...bill, stage: "rapporteur", since: state.month } : bill);
      continue;
    }

    if (bill.stage === "rapporteur") {
      /* ⚠ O TEXTO EMENDADO PARA E PERGUNTA, e ate 16/08/2026 ele nao parava: o
         relator emendava, o texto seguia para o plenario, e o jogador ASSISTIA. Era
         o buraco de jogabilidade mais caro do projeto — a peca mais sofisticada
         dele nao tinha um verbo do lado de quem joga.

         A pergunta segura o texto ONDE ELE ESTA. Ele nao volta nem avanca enquanto
         ela estiver aberta, e quem a fecha e o turno: resposta ou vencimento. */
      /* ⚠ A CAIXA JA FECHADA, E NAO `state.mail` — e esta linha e a correcao de um
         defeito que so a simulacao pegou, porque ele nao derruba nada: ele TRAVA.

         Consultando a caixa de ANTES do fechamento, a carta que o jogador acabou de
         responder ainda constava como aberta, e o texto esperava por ela para
         sempre. Medido em oito meses de mandato, nas tres saidas: aceitar, travar e
         silenciar — nenhum texto saiu da relatoria em nenhuma delas, e a tramitacao
         inteira parou de existir sem uma unica prova ficar vermelha.

         A CLASSE E CONHECIDA: ler o estado ANTES do passo que o proprio turno acabou
         de dar. E a mesma familia do achado 14, em que a MALHA lia o nivel PEDIDO
         depois de a tramitacao ter separado pedido de aplicado. */
      const open = pending(mail, bill.id);
      if (open) {
        bills.push(bill);
        continue;
      }

      const answer = answers.get(bill.id) ?? null;

      /* ⚠ TRAVAR DEVOLVE O TEXTO A GAVETA COM O RELOGIO CORRENDO. O `writtenAt`
         nao se mexe, entao os seis meses de `DRAWER_LIFE` continuam contando, e o
         texto precisa ser pautado DE NOVO por uma Mesa que pode nao querer mais.
         E o preco de recusar o relatorio, e ele e tempo — nada aqui inventa
         numero. Travar pode matar o texto pelo relogio, e essa e a aposta. */
      if (answer?.answer === "block") {
        events.push({ kind: "blocked", label: bill.label, detail: null, bill: bill.id });
        bills.push({ ...bill, stage: "drawer", since: state.month });
        continue;
      }

      /* ACEITO, OU ACEITO POR SILENCIO — e para o texto os dois sao a mesma coisa.
         A diferenca entre decidir e deixar vencer mora na CARTA, que guarda qual
         dos dois foi, e e ela que a tela le. */
      if (answer) {
        bills.push({
          ...bill,
          stage: "floor",
          since: state.month,
          except: [...bill.except, ...answer.except],
          ...(answer.saved !== null && { saved: answer.saved }),
        });
        continue;
      }

      const { except, saved } = reports({ rapporteur, agenda, catalog });

      /* ⚠ SEM EMENDA NAO HA PERGUNTA. O relator que nao encontrou o que salvar —
         porque o texto move uma alavanca so, ou porque nada nele o machuca —
         devolveu o texto intacto, e nao ha o que aceitar ou travar. Uma carta
         perguntando sobre uma emenda que nao existe seria a interface fabricando
         uma decisao, que e o oposto do que este ciclo faz. */
      if (saved === undefined) {
        events.push({ kind: "reported", label: bill.label, detail: null, bill: bill.id });
        bills.push({ ...bill, stage: "floor", since: state.month });
        continue;
      }

      events.push({ kind: "reported", label: bill.label, detail: saved, bill: bill.id });
      asked.push(amendment({ bill, month: state.month, except, saved }));
      bills.push(bill);
      continue;
    }

    /* PLENARIO — e so um por mes. */
    if (voted) {
      bills.push(bill);
      continue;
    }
    voted = true;

    const result = vote({
      bill: agenda.proposal,
      /* ⚠ QUEM VOTA E A CAMARA DIVIDIDA, e nao os quatro blocos. O lider leva a
         fracao da bancada que ele arrasta, com a posicao e a venalidade DELE, e o
         resto do bloco continua votando pela ideologia do bloco. ECLUSA nao soube de
         nada disso: uma pessoa e uma bancada de um so. */
      parties: share.benches,
      funding: share.offeredPaid,
      loyalty: share.chamberLoyalty,
      stream,
      majority: agenda.quorum,
      standing,
    });

    stream = result.stream;
    tally = result;

    events.push({
      kind: result.passed ? "passed" : "rejected",
      label: bill.label,
      detail: null,
      bill: bill.id,
    });

    if (result.passed) {
      /* O QUE PASSA E O TEXTO JA SEM O QUE O RELATOR SALVOU. */
      const spared = new Set(bill.except);
      passed = {
        ...bill,
        bands: Object.fromEntries(Object.entries(bill.bands).filter(([id]) => !spared.has(id))),
        levels: Object.fromEntries(Object.entries(bill.levels).filter(([id]) => !spared.has(id))),
      };
    } else {
      dropped.push(bill);
    }
  }

  return { bills, dropped, tally, passed, stream, voted, events, asked };
}

/**
 * Resolve um mes.
 *
 * E funcao PURA: mesmo estado, mesmas ordens e mesmo catalogo devolvem
 * exatamente o mesmo par. O unico sorteio do turno sai do fluxo que vive dentro
 * do estado, e ele volta avancado no estado devolvido — que e o que faz um
 * mandato inteiro ser reproduzivel a partir da semente e da lista de ordens.
 *
 * @param {GameState} state
 * @param {Orders} [orders]
 * @param {Options} [options]
 * @returns {{ state: GameState, report: Report }}
 */
export function playMonth(state, orders = {}, options = {}) {
  const catalog = options.catalog ?? CATALOG;
  const { areas, parties, programs } = catalog;

  const position = positionOf(state, catalog);

  /* 1, 2 e 3 — QUANTO CABE, QUANTO CUSTA e QUANTO O CAIXA HONRA. */
  const {
    agenda,
    held,
    bands,
    promised,
    asked,
    room,
    paid,
    requested,
    allocated,
    funded,
    people,
    benches,
    chamberLoyalty,
    offeredPaid,
    promisedCost,
    paidCost,
    allocatedTotal,
    ratio,
    requestedBands,
  } = settlement(state, orders, catalog);

  /* 4 — A VOTACAO, com a verba que chegou e nao com a que foi falada.
     A PAUTA NAO E MAIS ESCOLHIDA DE UMA LISTA: ela e composta do orcamento que o
     jogador escreveu, e o quorum sai do que o movimento derrubou. Remanejamento
     dentro das faixas nao vai a plenario — a lei ja autorizou, e pedir voto para
     executar o orcamento seria inventar um rito que nao existe.

     ⚠ E ELA VEM DO RATEIO, e nao de um `compose` proprio. Havia dois no projeto com
     argumentos ligeiramente diferentes; um deles ia divergir e ninguem saberia qual.
     Agora ha um so, e ele mora onde a distincao importa primeiro: o rateio precisa
     saber o que ESPERA para dividir o que EXECUTA. */

  /* ⚠ A RUA QUE PESA NA VOTACAO E A DO MES PASSADO, e nao a que SONDA vai apurar
     no fim deste turno. O parlamentar vota com a pesquisa que ele ja leu — e usar
     a de depois faria a decisao de hoje ser julgada por uma opiniao que ainda nao
     existia, que e a mesma armadilha que o juro sobre a divida evita. */
  const standing = pollFrom(state.mood, catalog.segments, catalog.opinion).good;

  /* ── A TRAMITACAO ─────────────────────────────────────────────────────────
     ⚠ A ORDEM E A REGRA: os textos que JA estavam andando avancam PRIMEIRO, e so
     depois o que o jogador escreveu neste mes e protocolado. Invertida, um texto
     assinado hoje andaria um estagio hoje — e tres meses da caneta ao efeito
     viraria dois, sem ninguem ter decidido isso.

     E o texto do mes NAO VOTA no mes: ele entra na gaveta. Quem vota agora e o que
     foi escrito ha tres meses, e essa defasagem e a Parte 3 inteira. */
  /* ⚠ A CORRESPONDENCIA FECHA ANTES DE OS TEXTOS ANDAREM, e a ordem e a mecanica:
     a resposta que o jogador deu neste mes tem de valer NESTE mes. Fechada depois,
     ela so valeria no seguinte, e o jogador que aceitasse a emenda veria o texto
     parado mais um mes sem razao visivel.

     ⚠ E DENTRO DE `settle` A RESPOSTA GANHA DO RELOGIO — ver a prosa la. Quem
     respondeu no ultimo mes respondeu. */
  const post = settleMail({ mail: state.mail, orders: orders.mail ?? {}, month: state.month });

  /* ── O QUE A CHANTAGEM PRODUZIU NESTE MES ───────────────────────────────────
     Duas listas, e as duas saem das cartas que FECHARAM agora:

       CEDIDO    a alavanca vai para o nivel exigido, e ela entra no orcamento do mes
                 como qualquer outro movimento de caneta — sai da mesma bolsa;
       RECUSADO  quem foi recusado, para a queixa dele subir. ⚠ E o SILENCIO conta
                 como recusa, ao contrario da emenda do relator, onde ele aceita: um
                 lobby que exige e nao recebe resposta nao entende que ganhou.

     ⚠ O QUE SE CEDE E UM NIVEL, E NAO UM CHEQUE. O decimo dossie propunha cobrar em
     bilhoes — uma segunda moeda, que o ciclo 10 ja recusou. Aqui o preco ja existe e o
     jogador nao aprende nada novo: ele descobre que a bolsa ficou menor. */
  /** @type {Record<string, number>} */
  const conceded = {};
  /** @type {string[]} */
  const spurned = [];

  for (const letter of post.resolved) {
    if (letter.kind !== "demand" || letter.lever === null) continue;
    if (letter.answer === "accept") conceded[letter.lever] = letter.level ?? 0;
    else if (letter.from !== null) spurned.push(letter.from);
  }

  const passage = advanceBills(state, {
    share: { benches, offeredPaid, chamberLoyalty, people, bands },
    standing,
    catalog,
    resolved: post.resolved,
    mail: post.mail,
  });

  const tally = passage.tally;

  /* 5 — O QUE SOBROU NA BASE, e o que cada PESSOA passou a lembrar.
     O humor e do bloco e a memoria e da pessoa: as duas leem o MESMO fato — a
     verba paga e a fracao prometida que o caixa nao honrou —, e por isso nao ha
     duas versoes do que aconteceu naquele mes. */
  const loyalty = settle({ parties, loyalty: state.loyalty, promised, paid });
  const memory = remember({
    people,
    memory: state.memory,
    promised,
    paid,
    parameters: catalog.cast,
  });

  /* 6 — A CAPACIDADE DO ESTADO.
     ⚠ `enacted` DEIXOU DE SER "a pauta deste mes passou" e virou "um texto chegou
     ao fim da tramitacao e passou". Sao coisas diferentes desde 15/08/2026: o que o
     jogador escreveu hoje esta na gaveta, e o que se aprova hoje foi escrito ha
     tres meses. */
  const approved = passage.passed;
  const enacted = approved !== null;

  /* ── O QUE ACONTECE COM O QUE PRECISA DE VOTO ───────────────────────────────
     Nao e tudo ou nada, e a distincao e a mesma que separou os ritos. O que era
     EXECUCAO ORCAMENTARIA acontece de qualquer jeito: ela nunca dependeu de voto,
     e segura-la junto seria o Congresso vetando uma coisa que ninguem lhe
     perguntou. So o que fura parede espera.

     ⚠ E AGORA ELE ESPERA SEMPRE, e nao so quando perde. Ate 15/08/2026 o movimento
     que exigia lei valia no mes em que o plenario aprovava e revertia no mes em que
     ele derrubava; com a tramitacao, ele reverte SEMPRE no mes em que e escrito,
     porque no mes em que e escrito ele ainda nao foi autorizado por ninguem. Gastar
     abaixo de um piso antes de a lei mudar e gastar sem autorizacao, e o modelo
     nunca deveria ter deixado.

     O QUE VOLTA A VALER e o texto APROVADO, e ele entra por cima: quando um projeto
     vence o plenario, os niveis que ele pedia passam a valer no mesmo mes — como
     valiam antes, so que tres meses depois de assinados. */
  /* ⚠ O QUE FOI CEDIDO ENTRA POR CIMA, e depois do texto aprovado: se as duas coisas
     tocarem a mesma alavanca no mesmo mes, quem manda e a exigencia — porque ela e a
     que o jogador acabou de responder, e o texto foi assinado ha tres meses.

     ⚠ E ELE PASSA PELO RATEIO como todo o resto. Ceder nao cria dinheiro: se o caixa
     nao cobrir, o nivel cedido escorrega junto com os outros — e o lobby vai ver o que
     de fato chegou, e nao o que foi prometido. E a mesma regra do Congresso, do outro
     lado da mesa. */
  const applied = honour({
    programs,
    levels: { ...(approved ? { ...held, ...approved.levels } : held), ...conceded },
    ratio,
    bands,
  });

  /* ── A LEI SO MUDA SE O PLENARIO DEIXAR, e nao ha meio-termo aqui ────────────
     Movimento de faixa NUNCA e execucao orcamentaria: mexer no que a lei obriga
     custa lei, no minimo. Entao a regra que separa o que sobrevive a derrota nao
     tem trabalho nenhum deste lado — cai o texto, cai a lei inteira, e o pais
     continua com as normas que tinha.
     ⚠ O QUE O PLENARIO APROVA E UM TEXTO NOVO, e nao a correcao do texto antigo.
     A norma que o antecessor escreveu continua no arquivo depois que a desta
     sessao passa por cima dela — e e por isso que revogar a nova faz a velha
     voltar a valer, que e como funciona no mundo e que um campo sobrescrito nao
     tinha como representar.
     ⚠ E O QUE SE ESCREVE E O TEXTO APROVADO, ja sem o que o relator salvou. A
     excecao dele nao e um enfeite de tela: ela sai da norma, e a alavanca protegida
     continua com a lei que tinha. */
  const written = approved
    ? normsFrom(bands, { ...bands, ...approved.bands }, state.month, catalog)
    : [];
  const appliedNorms = written.length > 0 ? [...state.norms, ...written] : state.norms;

  /* A LEI DEPOIS DA VOTACAO, lida da pilha nova e no MESMO mes. A reforma vale a
     partir do mes em que passou — e por isso o alivio fiscal dela ja entra no
     fechamento deste turno, exatamente como entrava quando a faixa era um campo. */
  const appliedBands =
    written.length > 0
      ? resolve({
          norms: appliedNorms,
          levers: leversOf(catalog),
          month: state.month,
          indicators: indicatorsOf(state),
          revenue: revenueNow(state, catalog),
        }).bands
      : bands;
  /* O IMPACTO DIRETO NO INDICE SUMIU, e a omissao e proposital. Cada pauta do
     catalogo antigo carregava um `impact` que empurrava o indice da area de uma
     vez, por fora do dinheiro — uma lei aprovada "melhorava a saude" sem que um
     real tivesse sido gasto. Com programa isso deixou de fazer sentido: o que
     move o indice e a VERBA que chegou, e a reforma move o indice porque muda
     quanto de verba passa a caber. Um empurrao extra estaria contando o mesmo
     efeito duas vezes. */
  const capacity = capacityStep({
    areas,
    index: state.capacity.index,
    history: state.capacity.history,
    allocation: funded,
    impacts: {},
    neutral: NEUTRAL,
    capacityTarget: CAPACITY_TARGET,
  });

  /* 7 — O ORCAMENTO FECHA com tudo o que de fato saiu do discricionario. */
  /* A VENDA ABATE O EMPENHO DO MES. Ela nao e "menos gasto": e caixa que entrou,
     e o saldo do mes e o mesmo nos dois casos. Passa por aqui porque o LASTRO
     raciocina em empenho liquido, e criar uma terceira porta para o mesmo real
     seria duas contas para uma coisa. */
  const proceeds = saleOf(catalog.rules, state.levels, applied);
  const budget = budgetStep({ ...position, spent: paidCost + allocatedTotal - proceeds });

  /* 8 — A ECONOMIA, e ela vem DEPOIS do orcamento porque le o que ele empenhou.
     O impulso fiscal e o discricionario que de fato saiu, medido contra o PIB do
     mes: e a unica forma de "gastar" chegar a inflacao sem ninguem escrever a
     ligacao.

     ⚠ A CAPACIDADE ENTRA COMO MEDIA DAS SETE AREAS contra o ponto neutro, e isso
     e simplificacao declarada. O honesto seria so as areas que empurram o
     potencial — educacao, infraestrutura —, mas o catalogo ja diz qual area
     alimenta qual canal, e replicar esse mapa aqui seria a mesma verdade em dois
     lugares. A media inteira e grossa e nao mente. */
  const spread = areas.reduce(
    (sum, area) => sum + ((capacity.index[area.id] ?? area.initial) - NEUTRAL) / NEUTRAL,
    0,
  );

  const economy = economyStep({
    macro: state.macro,
    parameters: catalog.macro,
    taxLoad: catalog.fiscal.taxLoad,
    baseTaxLoad: catalog.fiscal.taxLoad,
    capacity: clamp(spread / areas.length, -1, 1),
    impulse: ((paidCost + allocatedTotal) * MONTHS_PER_YEAR) / Math.max(1, state.macro.gdp),
    shock: options.shock ?? 0,
  });

  /* 9 — O QUE A DIVIDA CUSTA. Ela roda a taxa que vigorava no INICIO do mes, e
     nao a que a CORRENTE acabou de decidir: juro se paga sobre o estoque ao preco
     do dia, e usar a taxa nova aqui faria a decisao do Banco Central retroagir um
     mes inteiro.

     ⚠ ELE NAO ENTRA NO PRIMARIO, e essa e a distincao que o arcabouco faz e o
     jogo tem de fazer junto: juro fica FORA do teto de despesa. Ele nao disputa
     com hospital — ele engorda a divida, e a divida volta pelo premio de risco. */
  const interest = carry({
    debt: state.fiscal.debt,
    rate: state.macro.rate,
    premium: premiumNow(state, catalog),
    parameters: catalog.macro,
  });

  /* 10 — A RUA, e ela e o ultimo passo de proposito: SONDA le tudo o que os
     outros motores acabaram de produzir, e nao manda em nenhum deles neste mes.
     A realimentacao existe e chega no mes SEGUINTE, pelo poder de barganha —
     que e como funciona no mundo: popularidade de hoje compra voto amanha.

     ⚠ O QUE ELA LE E O QUE JA FOI DIVULGADO, e nao o mes que acabou de ser
     resolvido. A serie guarda o passado inteiro, entao a defasagem e um indice
     nela — e nao uma fila nova para manter. Nos primeiros meses a serie e curta
     e o valor mais antigo disponivel e o certo: um pais recem-empossado ainda
     esta lendo os numeros do governo anterior, que e exatamente a verdade. */
  const released = {
    inflation: releasedFrom(state.series.inflation, catalog.opinion.release, state.macro.inflation),
    unemployment: releasedFrom(
      state.series.unemployment,
      catalog.opinion.release,
      state.macro.unemployment,
    ),
    growth: economy.growth,
  };

  /* SERVICO E ORDEM SAO LEITURAS DA MALHA, e a composicao mora aqui porque motor
     nenhum chama outro motor. O que a rua sente por "servico publico" e a media
     de saude e educacao; por "ordem", o indice de seguranca sozinho. */
  /* O TEXTO QUE ESTE MES ESCREVEU — protocolado, e nao votado. */
  const protocolled = draft(agenda, state.month, bands, requestedBands, requested);

  const opinion = opinionStep({
    mood: state.mood,
    released,
    services: mean([capacity.index["health"], capacity.index["education"]]),
    safety: capacity.index["security"] ?? 50,
    /* A FRACAO DA PROMESSA QUE O CAIXA NAO HONROU. Ela ja custava base no
       Congresso; agora custa rua tambem, e pelo mesmo fato. */
    betrayal: promisedCost > 0 ? 1 - paidCost / promisedCost : 0,
    tenure: state.month,
    segments: catalog.segments,
    parameters: catalog.opinion,
  });

  /* 10b — A CALDEIRA, e ela vem DEPOIS de tudo porque le tudo. Como a SONDA, ela nao
     manda em ninguem neste mes: a realimentacao chega no seguinte, pela abertura do
     processo. */
  const pressure = heat({
    pressure: state.pressure,
    grievance: grievanceOf({
      debtRatio: budget.debtRatio,
      /* A MEDIA DA VERBA QUE CHEGOU A CADA BANCADA. `offeredPaid` ja e a fracao paga
         por bancada depois do rateio — nao ha conta nova aqui, so a media. */
      delivered:
        parties.length > 0
          ? parties.reduce((sum, party) => sum + (offeredPaid[party.id] ?? 0), 0) / parties.length
          : 0,
      index: capacity.index,
      spurned,
      catalog,
    }),
    parameters: catalog.pressure,
  });

  /* ⚠ O PROCESSO NAO SE FECHA SOZINHO. Aberto uma vez, ele fica aberto: um pedido de
     impeachment protocolado nao caduca porque a rua melhorou no mes seguinte. Quem o
     encerra e o plenario — e enquanto ele estiver de pe, sobreviver custa.

     E ele e DETERMINISTICO, e nao sorteado. O nono dossie propunha dispara-lo por
     evento aleatorio; este ciclo ja tinha decidido o contrario, e a razao vale mais
     que a fonte: a queda tem de se ver chegar. Uma derrota que voce viu chegar e nao
     conseguiu evitar e uma historia; uma que chega sem aviso e um defeito percebido. */
  const rupturas = rupture({
    pressure,
    lobbies: catalog.lobbies,
    /* A RUA APURADA AGORA, e nao a do mes passado: a ruptura social e uma leitura do
       estado do pais no fim deste mes, e nao um insumo de negociacao. Quem usa a rua
       DIVULGADA e a votacao, porque o parlamentar vota com a pesquisa que ele leu. */
    standing: pollFrom(opinion.mood, catalog.segments, catalog.opinion).good,
    broker: BROKER,
    parameters: catalog.pressure,
  });
  const impeachment = state.impeachment ?? (rupturas.open ? state.month : null);

  /* ── O PLENARIO DECIDE, e a queda e a TRAMITACAO COM OUTRO OBJETO ────────────
     ⚠ ELA NAO GANHA FORMULA PROPRIA, exatamente como a Mesa nao ganhou: e `vote`,
     com o quorum trocado. Uma segunda formula criaria um preco que diverge do preco
     de tudo o mais neste jogo, e o jogador nao conseguiria prever nenhum dos dois.

     ⚠ E O QUE SE VOTA E A SUSTENTACAO, e nao a queda. A mocao fica na posicao do
     PROPRIO GOVERNO, e os votos sao de quem fica com ele — porque e isso que o
     jogador compra no leilao. O presidente cai quando a oposicao junta os 342, ou
     seja, quando quem sustenta cai abaixo de `SEATS - 342`.

     Contar votos "pela queda" exigiria inverter a posicao da mocao, e a inversao nao
     e simetrica: `whipCount` mede distancia ate a proposta, e o oposto de um governo
     de centro nao e um ponto — sao dois. */
  const seat = stanceOf(state, catalog);
  const survivors =
    /* ⚠ O PLENARIO VOTA NO MES SEGUINTE AO DA ABERTURA, e nao no mesmo — e esta
       linha e a correcao de um defeito de desenho que a primeira medicao pegou.

       Votando no mes em que o processo abre, o presidente caia SEMPRE: o que abriu o
       processo foi a base ja destruida, entao os votos para sustentar nao existiam.
       Medido: aberto no mes 47, caido no mes 47. O leilao — a melhor parte desta
       mecanica — nunca acontecia, porque nao havia um turno para joga-lo.

       Um mes de intervalo e o mesmo desenho da tramitacao: um estagio por mes. E ele
       e o que transforma a derrota em JOGADA — o jogador ve o processo aberto, ve a
       cadeira valendo o triplo, e tem um turno para comprar sobrevivencia. */
    impeachment !== null && impeachment < state.month && state.fallen === null
      ? vote({
          /* A POSICAO DO GOVERNO, e nao a de um texto: `stanceOf` a devolve com o
             marco, e o que importa aqui sao os dois eixos. Governo que nao moveu nada
             fica no centro do plano — quem nao exerceu ideologia nenhuma nao afasta
             nem atrai ninguem por ideologia, e o que decide a queda dele e so o
             dinheiro e a rua. */
          bill: { economic: seat?.economic ?? 50, liberty: seat?.liberty ?? 50, threat: 0 },
          parties: benches,
          funding: offeredPaid,
          loyalty: chamberLoyalty,
          stream: passage.stream,
          majority: SEATS - REMOVAL_MAJORITY + 1,
          standing,
        })
      : null;

  const fallen = state.fallen ?? (survivors && !survivors.passed ? state.month : null);

  return {
    state: reduce(state, {
      type: "monthResolved",
      loyalty,
      fiscal: nextPosition(state, budget, applied, catalog, interest, bands, appliedBands),
      macro: economy.macro,
      mood: opinion.mood,
      series: extend(
        state.series,
        {
          gdp: economy.macro.gdp,
          inflation: economy.macro.inflation,
          rate: economy.macro.rate,
          unemployment: economy.macro.unemployment,
          debtRatio: budget.debtRatio,
          primary: budget.balance,
        },
        capacity.index,
      ),
      capacity: { index: capacity.index, history: capacity.history },
      levels: applied,
      norms: appliedNorms,
      /* ⚠ O TEXTO DE HOJE ENTRA NA GAVETA DEPOIS de os antigos andarem, e a ordem e
         a regra: protocolado antes, ele andaria um estagio no proprio mes de
         assinatura, e tres meses da caneta ao efeito viraria dois sem ninguem ter
         decidido isso. */
      bills: protocolled ? [...passage.bills, protocolled] : passage.bills,
      /* ⚠ A ORDEM DENTRO DA CAIXA E A DA URGENCIA, e nao a cronologica — e ela e
         decidida AQUI, e nao na view, porque quem sabe o que pede decisao e quem
         produziu o fato. As perguntas do mes vem primeiro, os avisos depois, e o
         que ja estava guardado por ultimo.

         Um inbox ordenado por hora poe o aviso na frente do pedido, e ai o jogador
         aprende a rolar — que e o comeco de ele parar de ler. */
      /* ⚠ A CHANTAGEM VEM DEPOIS DA PRESSAO SER CALCULADA, e por isso ela entra aqui e
         nao antes: um lobby exige com base no que ele sente AGORA, e nao no que sentia
         no mes passado. Ler `state.pressure` daria uma exigencia sempre um mes
         atrasada — a familia do "ler o estado antes do passo que o turno acabou de
         dar", que este projeto ja pagou duas vezes. */
      /* ⚠ O ALARME VEM PRIMEIRO, e a ordem e a mesma regra do resto da bandeja: o
         que exige leitura antes da proxima decisao fica no alto. Um processo de
         impeachment aberto embaixo de tres avisos de tramitacao e um inbox que
         ensina a rolar — e quem rola para de ler. */
      mail: [
        ...alarmsOf(state, rupturas, impeachment, catalog),
        ...passage.asked,
        ...demandsOf(state, pressure, catalog),
        ...notices(passage.events, state.month),
        ...post.mail,
      ],
      pressure,
      impeachment,
      fallen,
      memory,
      /* O FLUXO VEM DA TRAMITACAO, e nao do placar: quem sorteia e a votacao do
         plenario, e ela agora acontece dentro de `advanceBills`. Um mes sem texto no
         plenario nao consome sorteio nenhum, como um mes sem pauta nunca consumiu. */
      stream: passage.stream,
    }),
    report: {
      month: state.month,
      agenda,
      enacted,
      levels: applied,
      bands: appliedBands,
      capacity,
      economy,
      opinion,
      interest,
      asked,
      allocated,
      allocatedTotal,
      budget,
      room,
      promisedCost,
      paidCost,
      ratio,
      promised,
      paid,
      tally,
      loyalty,
      people,
      memory,
      /* O QUE A TRAMITACAO FEZ NESTE MES — a materia-prima das cartas. */
      events: passage.events,
    },
  };
}

/* QUANTOS MESES A SERIE GUARDA. Um mandato inteiro, e nem um a mais: o painel
   desenha o mandato, e um buffer que cresce para sempre e um save que engorda
   para sempre — num jogo que ja atravessa o navegador fechado. */
const SERIES_LENGTH = 48;

/* QUANTOS PONTOS DE DIVIDA ACIMA DA HERDADA LEVAM O MERCADO DA PACIENCIA AO PONTO DE
   FERVURA. Trinta, e e primeiro chute declarado: com a divida abrindo em 78%, ele
   ferve por volta de 108%. O que NAO e chute e a escala ser a mesma do premio de
   risco — os dois leem a mesma deterioracao, e limiares diferentes fariam o mesmo
   credor desconfiar num numero e fugir noutro. */
const DEBT_SPAN = 0.15;

/* QUEM SUSTENTA O GOVERNO NO CONGRESSO, e portanto quem abre a ruptura POLITICA
   quando conclui que sustentar custa mais que derrubar. E o fisiologismo, e nao um
   bloco partidario: quem decide a sobrevivencia de um presidente brasileiro nao e a
   oposicao — e quem estava com ele. */
const BROKER = "fisiologismo";

/* QUANTO A CADEIRA CUSTA A MAIS COM O PROCESSO ABERTO. Tres, e e primeiro chute
   declarado. O que NAO e chute e ser MAIOR QUE UM: um processo que nao encarecesse
   nada seria um aviso, e nao um cerco — e a mecanica inteira depende de sobreviver
   ser caro o bastante para doer e barato o bastante para ser possivel. */
export const SIEGE_PRICE = 3;

/**
 * Acrescenta um mes a cada serie e corta o excesso pelo comeco.
 *
 * ⚠ AS AREAS SAO UM MAPA DENTRO DA SERIE, e por isso elas nao passam pelo laco
 * plano. Achatá-las — `area:saude` como chave irma de `gdp` — daria uma serie so e
 * exigiria que todo consumidor soubesse desmontar o prefixo; e um mapa aninhado
 * diz o que a coisa e: oito series irmas entre si e diferentes das outras seis.
 *
 * @param {import("../state/state.mjs").Series} series
 * @param {Record<string, number>} point
 * @param {Record<string, number>} areas o indice de cada area no fim deste mes
 * @returns {import("../state/state.mjs").Series}
 */
function extend(series, point, areas) {
  const next = /** @type {Record<string, number[]>} */ ({});
  for (const [key, past] of Object.entries(series)) {
    if (key === "areas") continue;
    next[key] = [.../** @type {number[]} */ (past), point[key] ?? 0].slice(-SERIES_LENGTH);
  }

  /** @type {Record<string, number[]>} */
  const nextAreas = {};
  for (const [id, past] of Object.entries(series.areas)) {
    nextAreas[id] = [...past, areas[id] ?? 0].slice(-SERIES_LENGTH);
  }

  return /** @type {import("../state/state.mjs").Series} */ (
    /** @type {unknown} */ ({ ...next, areas: nextAreas })
  );
}

/**
 * A posicao orcamentaria com que o mes seguinte comeca.
 *
 * ── A VIRADA DE EXERCICIO ────────────────────────────────────────────────────
 * A ancora do arcabouco e o ano ANTERIOR, e ela nao pode andar mes a mes: se
 * andasse, o teto perseguiria a despesa e a regra deixaria de restringir
 * qualquer coisa. Entao ela fica parada onze meses e vira em dezembro, que e
 * quando o exercicio fecha.
 *
 * A ANCORA NOVA E O TETO QUE VIGOROU, e nao a despesa realizada. A primeira
 * versao usava o realizado, e a simulacao mostrou na hora por que isso esta
 * errado: um governo que gastou pouco em 2027 via o teto de 2028 desabar para o
 * proprio gasto — a regra PUNIA a economia e o discricionario caia de 25,9 para
 * 5,2 numa virada de ano. Isso nao e o arcabouco, e um catraca. O limite do
 * exercicio seguinte cresce sobre o LIMITE do anterior; quem gastou menos que o
 * teto simplesmente nao usou o espaco, e nao o perde.
 *
 * @param {GameState} state
 * @param {BudgetOutput} budget
 * @param {Record<string, number>} applied os niveis com que o mes fechou
 * @param {typeof CATALOG} catalog
 * @param {number} interest o custo de carregar a divida NESTE mes
 * @param {Record<string, import("../state/state.mjs").Band>} bands as leis com que o mes ABRIU
 * @param {Record<string, import("../state/state.mjs").Band>} appliedBands as leis com que ele fechou
 * @returns {import("../state/state.mjs").Fiscal}
 */
function nextPosition(state, budget, applied, catalog, interest, bands, appliedBands) {
  /* ── A ECONOMIA DA REFORMA DEIXOU DE SER ESCOLHIDA ──────────────────────────
     Enquanto o jogo tinha catalogo de pautas, cada uma trazia um `fiscalImpact`
     digitado a mao: a reforma da previdencia "poupava 48" porque alguem escreveu
     48. O jogador via um numero mudar e nunca via O QUE mudou.

     Agora ela e a conta do PISO QUE CAIU. O piso efetivo de um programa e o menor
     entre o que a lei obriga e onde ele de fato esta — quem furou o piso com 308
     votos passou a ter um piso novo, e essa e a definicao de reforma. A diferenca
     entre a soma dos pisos de antes e a de agora e o alivio permanente.

     E ELE E PERMANENTE NOS DOIS SENTIDOS, que e o que torna a decisao pesada: o
     custo politico se paga uma vez e o efeito fiscal fica nos 48 meses. Furar o
     piso para BAIXO alivia para sempre; ampliar um piso — o que so acontece por
     lei — cobra para sempre.

     ⚠ E A PARTIR DE 14/08/2026 O PISO TAMBEM SE MOVE. Enquanto ele era catalogo,
     a unica forma de aliviar a obrigatoria era furar a parede e deixar o gasto
     abaixo dela; agora a lei em si e movel, e a conta abaixo cobre as duas — ela
     compara o piso EFETIVO de antes com o de agora, e nao importa se o que mudou
     foi onde o programa esta ou onde a lei manda ele estar. Baixar o piso e
     manter o gasto nao alivia nada, e essa e a leitura certa: desvincular sem
     cortar nao economiza um real, so muda de qual bolso ele sai. */
  const floorOf = (
    /** @type {Record<string, number>} */ levels,
    /** @type {Record<string, import("../state/state.mjs").Band>} */ bands,
  ) =>
    catalog.programs.reduce(
      (sum, program) =>
        sum +
        (program.cost *
          Math.min(bandOf(program, bands).floor, levels[program.id] ?? program.initial)) /
          100,
      0,
    );

  /* A FOLHA DAS ESTATAIS TAMBEM E OBRIGATORIA, e por isso ela entra na mesma
     conta: privatizar tira gente da folha da Uniao para sempre, e esse alivio e
     tao permanente quanto o de furar um piso. E o contrario tambem vale —
     estatizar um setor traz a folha dele junto, e ninguem avisa. */
  const payrollOf = (/** @type {Record<string, number>} */ levels) =>
    catalog.rules.reduce(
      (sum, rule) => sum + (rule.reach * rule.payroll * (levels[rule.id] ?? rule.initial)) / 100,
      0,
    );

  const relief =
    floorOf(state.levels, bands) -
    floorOf(applied, appliedBands) +
    (payrollOf(state.levels) - payrollOf(applied));

  /* A BASE, e nao o valor mostrado. O fator de capacidade e leitura do mes e nao
     mudanca de estado — guardar o valor multiplicado faria o fator incidir sobre
     si mesmo todo mes. Ver o comentario em `src/domain/budget/`. */
  const mandatory = Math.max(0, budget.mandatoryBase - relief);

  const closesYear = (state.month + 1) % MONTHS_PER_YEAR === 0;

  return {
    mandatory,
    anchorRevenue: closesYear ? budget.revenueBase : state.fiscal.anchorRevenue,
    anchorExpense: closesYear ? budget.ceiling : state.fiscal.anchorExpense,
    /* ⚠ O JURO ENTRA AQUI, e so aqui. Ele nao passa pelo saldo primario — o
       arcabouco o exclui, e o jogo tem de excluir junto — mas ele engorda o
       estoque todo mes. E dai nasce a espiral que o Brasil conhece: gasto vira
       divida, divida vira juro, juro vira mais divida, e nenhuma linha de codigo
       diz "espiral". */
    debt: budget.debt + interest,
  };
}

/**
 * O INDICADOR QUE JA FOI DIVULGADO, `release` meses atras.
 *
 * ⚠ O PADRAO E O VALOR CORRENTE, e nao zero: nos primeiros meses a serie e curta
 * demais para ter passado, e devolver zero faria a rua ler inflacao zero e
 * desemprego zero — um paraiso de dois meses que nenhum jogador causou.
 *
 * @param {ReadonlyArray<number>} series
 * @param {number} release
 * @param {number} fallback
 */
function releasedFrom(series, release, fallback) {
  if (series.length === 0) return fallback;
  return series[Math.max(0, series.length - 1 - release)] ?? fallback;
}

/** @param {ReadonlyArray<number | undefined>} values */
function mean(values) {
  const known = values.filter(value => typeof value === "number");
  if (known.length === 0) return 50;
  return known.reduce((sum, value) => sum + value, 0) / known.length;
}

/**
 * A CALDEIRA COMO A TELA PRECISA VÊ-LA — os quatro grupos, o que cada um cobra, e
 * quais das três rupturas já estão abertas.
 *
 * ⚠ ELA É A DÉCIMA PRIMEIRA PORTA, e existe pela razão de sempre: a tela não remonta
 * a pressão nem redecide as rupturas. Refeitas por fora, elas divergiriam no primeiro
 * mês em que um limiar mudasse — e o jogador leria uma caldeira que o turno não usa.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 */
export function boilerOf(state, catalog = CATALOG) {
  const standing = pollFrom(state.mood, catalog.segments, catalog.opinion).good;

  /* UMA CHAMADA SO, e ela responde as duas leituras: o veredito que o turno usa e a
     distancia que a tela mostra. Chamar o motor tres vezes daria o mesmo resultado e
     ensinaria que ele e barato — e no dia em que ele deixar de ser, a tela paga. */
  const broke = rupture({
    pressure: state.pressure,
    lobbies: catalog.lobbies,
    standing,
    broker: BROKER,
    parameters: catalog.pressure,
  });

  return {
    lobbies: catalog.lobbies.map(lobby => ({
      id: lobby.id,
      label: lobby.label,
      wants: lobby.wants,
      pressure: state.pressure[lobby.id] ?? 0,
      /* FERVENDO E UM ESTADO, e nao um adjetivo: e o mesmo limiar que a ruptura
         economica le, e por isso a tela nao pode ter o proprio. */
      boiling: (state.pressure[lobby.id] ?? 0) >= catalog.pressure.boil,
      /* ⚠ O PONTO DE FERVURA VAI JUNTO, desde 16/08/2026. A barra de cada grupo
         mostrava pressao de 0 a 100 e NAO dizia onde e a linha: um grupo em 55 e um
         em 20 apareciam como "duas barras curtas", quando o primeiro esta a cinco
         pontos de abandonar o governo. E a mesma cegueira que a regua da Trindade
         acabou de consertar, e o limiar e do motor — a tela nao pode ter o proprio. */
      boil: catalog.pressure.boil,
    })),
    rupture: broke,
    /* ── AS TRES RUPTURAS COM DISTANCIA, e nao so com o veredito ────────────────
     * ⚠ A TELA PRECISA DO QUANTO FALTA, e nao do "sim ou nao". `rupture` devolve tres
     * booleanos, que e o que o TURNO precisa para decidir se o processo abre; um
     * medidor construido sobre booleano so sabe acender e apagar, e a regra do
     * projeto e que informacao que chega depois da decisao e recibo.
     *
     * ⚠ E ELA NAO PODE CALCULAR ISSO POR FORA. O valor de cada ruptura e uma conta
     * diferente — a social le a rua, a economica e uma media PONDERADA de quem
     * ferveu, e a politica tem limiar proprio e mais alto —, e refeitas na tela as
     * tres divergiriam no primeiro mes em que um peso mudasse. E a sexta e a setima
     * ocorrencia da familia mais cara deste projeto, e as duas foram hoje.
     *
     * O SINAL DE CADA UMA E DECLARADO: a social rompe quando CAI abaixo do piso; as
     * outras duas rompem quando SOBEM acima do limiar. Sem isto a tela teria de saber
     * qual das tres se lê ao contrario, que e regra de motor morando na view. */
    ruptures: [
      {
        id: "social",
        value: standing,
        threshold: catalog.pressure.streetFloor,
        /* `below` quer dizer "rompe quando o valor fica ABAIXO do limiar". */
        breaks: "below",
        open: broke.social,
      },
      {
        id: "economic",
        /* A FRACAO PONDERADA DE QUEM ABANDONOU, na mesma escala de 0 a 100 das
           outras duas — e ela e a MESMA conta de `rupture`, com o mesmo peso zero
           excluido. Um grupo que nao financia campanha nao abandona o capital. */
        value: weightedAbandon(state, catalog),
        threshold: 50,
        breaks: "above",
        open: broke.economic,
      },
      {
        id: "political",
        value: state.pressure[BROKER] ?? 0,
        threshold: catalog.pressure.brokerBoil,
        breaks: "above",
        open: broke.political,
      },
    ],
    impeachment: state.impeachment,
    fallen: state.fallen,
    /* ⚠ O PRECO DO CERCO E O QUORUM DA QUEDA SAEM DAQUI, e nao de uma constante
       copiada na view. A carta do cerco diz "cada cadeira custa o triplo" e "342 de
       513", e os dois numeros sao do motor: escritos a mao na tela, eles mentiriam
       no dia em que `SIEGE_PRICE` ou a Camara mudassem — e essa e a familia de
       defeito mais cara deste projeto, com sete ocorrencias medidas. */
    price: SIEGE_PRICE,
    removal: REMOVAL_MAJORITY,
    seats: SEATS,
  };
}

/**
 * QUANTO DO CAPITAL JA ABANDONOU, de 0 a 100 — a mesma conta que `rupture` faz.
 *
 * ⚠ ELA E UMA FUNCAO E NAO UMA LINHA SOLTA porque a ruptura economica e a unica das
 * tres que nao tem um numero proprio no estado: ela e uma media ponderada de quem
 * ferveu, e o peso de cada grupo mora no catalogo. Quem quiser o numero pergunta.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} catalog
 * @returns {number}
 */
function weightedAbandon(state, catalog) {
  let abandoned = 0;
  let total = 0;
  for (const lobby of catalog.lobbies) {
    if (lobby.weight <= 0) continue;
    total += lobby.weight;
    if ((state.pressure[lobby.id] ?? 0) >= catalog.pressure.boil) abandoned += lobby.weight;
  }
  return total > 0 ? (abandoned / total) * 100 : 0;
}

/* ── O FECHO DO MANDATO ──────────────────────────────────────────────────────
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE ELE EXISTE, e a resposta e uma partida jogada ate o fim. O mandato
   passivo cai no mes 47, e a unica coisa que a tela dizia sobre isso era um selo
   de dez pixels no canto de um cartao. O botao de avancar continuava aceso, do
   mesmo tamanho e da mesma cor — clicar nele nao fazia nada e nao explicava por
   que. E o mes 48 nao existia: nada no jogo terminava o mandato no prazo, entao
   quem atravessasse os quatro anos entrava num "2o mandato" que nunca teve
   eleicao.

   ⚠ ELE NAO E UMA TELA DE DERROTA, e essa decisao ja estava escrita em
   `state.mjs` antes desta funcao: "a partida JA E um mandato de 48 meses, sem
   vitoria e sem placar, entao fim de jogo nao e o oposto de nada. Cair e o
   mandato terminar antes, e o que muda e a DATA". Por isso ha um fecho so, e as
   duas saidas dele diferem no motivo e no mes — nunca no tom.

   ⚠ E ELE NAO INVENTA UM NUMERO SEQUER. Tudo o que o fecho mostra ja estava no
   estado ou no catalogo com fonte: o indice de abertura de cada area e o
   `initial` do catalogo, a divida herdada e `fiscal.initialDebtRatio`, as leis
   sao as normas com `enactedAt` acima de zero, e a pressao de cada grupo e o
   estoque da CALDEIRA. O que esta funcao faz e PERGUNTAR — ela nao refaz conta
   nenhuma, pela mesma razao que nenhuma tela refaz.

   ── POR QUE `over` MORA AQUI, E NAO NO ENTRYPOINT ────────────────────────────
   Porque quem sabe quando um mandato acaba e o regime, e nao a tela. O
   entrypoint ja perguntava `state.fallen !== null` para desligar o botao, e essa
   pergunta estava PELA METADE: ela pegava a queda e nao pegava o prazo. Uma
   metade de regra morando na view e como as sete ocorrencias mais caras deste
   projeto comecaram. */

/**
 * @typedef {object} TermArea uma area, do dia da posse ao ultimo mes
 * @property {string} id
 * @property {string} label
 * @property {string} index - o nome do que ela mede
 * @property {number} from - o indice herdado, do catalogo
 * @property {number} to - o indice do ultimo mes
 *
 * @typedef {object} TermLaw uma lei que o jogador escreveu
 * @property {string} id
 * @property {string} label - a alavanca que ela move
 * @property {string} guard - a natureza dela: `none`, `law` ou `constitution`
 * @property {number} month - o mes em que ela passou
 *
 * @typedef {object} Term o mandato visto de fora, no dia em que ele acaba
 * @property {boolean} over - se acabou
 * @property {"removed" | "served" | null} ending - como acabou; nulo enquanto corre
 * @property {number} months - meses decorridos de mandato quando ele acabou
 * @property {number} of - quantos ele tinha
 * @property {{ from: number, to: number }} approval - "otimo/bom", da posse ao fim
 * @property {{ from: number, to: number }} debt - a divida sobre o PIB
 * @property {TermArea[]} areas - as oito, da posse ao fim
 * @property {TermLaw[]} laws - o que ficou escrito
 * @property {string[]} abandoned - os grupos que fervearam e nao voltaram
 */

/**
 * O MANDATO VISTO DE FORA — e a tela pergunta a ele em vez de decidir sozinha.
 *
 * ⚠ ELA RESPONDE MESMO COM O MANDATO CORRENDO, e devolve `over: false`. Uma
 * leitura que so existisse depois do fim obrigaria quem chama a saber quando o
 * fim e — que e exatamente a regra que esta funcao existe para guardar.
 *
 * @param {GameState} state
 * @param {typeof CATALOG} [catalog]
 * @returns {Term}
 */
export function termOf(state, catalog = CATALOG) {
  const removed = state.fallen !== null;
  /* ⚠ O MES DA QUEDA MANDA, e nao o corrente. Os dois sao iguais hoje porque o
     turno para no instante em que o plenario afasta; se um dia deixarem de ser,
     o fecho tem de datar o afastamento e nao o ultimo repaint. */
  const months = state.fallen ?? state.month;
  const served = state.month >= MONTHS_PER_TERM;

  const debtRatio = state.macro.gdp > 0 ? state.fiscal.debt / state.macro.gdp : 0;

  /* AS ALAVANCAS INTEIRAS, para achar o rotulo de cada norma. A lei guarda o id
     do que ela move, e o jogador escreveu sobre um nome — nao sobre um id. */
  const levers = [...catalog.programs, ...catalog.rules];

  return {
    over: removed || served,
    ending: removed ? "removed" : served ? "served" : null,
    months,
    of: MONTHS_PER_TERM,
    /* ⚠ A APROVACAO DA POSSE NAO E DIGITADA: e o que a SONDA le do humor de
       abertura do catalogo, que e o mesmo que `createState` usa. Um numero escrito
       a mao aqui seria a segunda verdade sobre com quanta popularidade o
       presidente entrou — e ela divergiria no dia em que um segmento mudasse. */
    approval: {
      from: pollFrom(opinionOpening(catalog.segments), catalog.segments, catalog.opinion).good,
      to: pollFrom(state.mood, catalog.segments, catalog.opinion).good,
    },
    debt: { from: catalog.fiscal.initialDebtRatio, to: debtRatio },
    areas: catalog.areas.map(area => ({
      id: area.id,
      label: area.label,
      index: area.index,
      from: area.initial,
      to: state.capacity.index[area.id] ?? area.initial,
    })),
    /* ⚠ `enactedAt > 0` E O QUE SEPARA A LEI DO JOGADOR DA HERDADA, e o criterio
       nao e desta funcao: `enact` grava o mes, e a posse grava zero. Contar a
       pilha inteira daria ao presidente o credito pela Constituicao. */
    laws: state.norms
      .filter(norm => norm.enactedAt > 0)
      .map(norm => ({
        id: norm.id,
        label: levers.find(lever => lever.id === norm.target.id)?.label ?? norm.target.id ?? "",
        guard: norm.guard,
        month: norm.enactedAt,
      })),
    /* QUEM FERVEU E NAO VOLTOU. E o mesmo limiar da ruptura economica, perguntado
       ao catalogo — a tela nao pode ter o proprio, e nem este fecho. */
    abandoned: catalog.lobbies
      .filter(lobby => (state.pressure[lobby.id] ?? 0) >= catalog.pressure.boil)
      .map(lobby => lobby.label),
  };
}
