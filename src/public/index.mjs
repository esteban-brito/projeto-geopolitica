/* A FACHADA — a única porta por onde o entrypoint alcança o jogo. */

/**
 * @typedef {import("../application/turn.mjs").Orders} Orders
 * @typedef {import("../application/turn.mjs").Report} Report
 * @typedef {import("../data/areas.mjs").Area} Area
 * @typedef {import("../data/bills.mjs").Bill} Bill
 * @typedef {import("../data/parties.mjs").Party} Party
 * @typedef {import("../domain/opinion/index.mjs").Approval} Approval
 * @typedef {import("../data/opinion.mjs").Segment} Segment
 */

export { CATALOG } from "../data/catalog.mjs";
export { posseOf, posseDeputyOf } from "../application/posse.mjs";
export { CAPACITY_TARGET, NEUTRAL } from "../data/areas.mjs";
export { quorumOf } from "../data/bills.mjs";
export { MONTHS_PER_TERM, MONTHS_PER_YEAR, SEATS, SIMPLE_MAJORITY } from "../data/regime.mjs";

/* A PREVISÃO e a BANDA são os dois números que a mesa de negociação mostra ao vivo enquanto o
   jogador arrasta a verba. */
/* A tela que os redigitasse chamaria de obstrução o que o motor já trata como ruptura no dia
   seguinte à primeira recalibragem. */
/* Elas passam pela porta porque a tela já montou a câmara à mão: com os blocos crus do
   catálogo, enquanto o turno votava com as bancadas do ELENCO, a verba com crédito de
   memória dentro e a aprovação da rua. Ninguém quebrou nada ao acrescentar esses motores;
   a tela simplesmente ficou para trás, e em 27,2% das votações ela anunciava o veredito
   contrário ao que o mês produzia. */
export { baseSplit, baseVenality, THRESHOLDS } from "../domain/congress/index.mjs";

/* ⚠ `alertsOf` É A DÉCIMA SEXTA PORTA, e ela nasceu de um dado sem consumidor: o rail
   desenhava os oito ministérios IDÊNTICOS enquanto a MALHA sabia o índice de cada um todo mês.
   Ela passa pela porta pelo mesmo motivo de `pollFrom`: a escala de queda é regra da MALHA, e
   duas telas vão lê-la — o rail agora, a faixa de áreas no passo 2. */
export { alertsOf } from "../domain/capacity/index.mjs";

/* `pollFrom` CONVERTE SATISFAÇÃO EM PESQUISA, e ela passa pela porta pelo mesmo motivo das
   duas acima: o estado guarda o humor de cada segmento, e a escala de
   ótimo/bom/regular é uma regra de SONDA. A tela pergunta; ela não converte. */
export { pollFrom } from "../domain/opinion/index.mjs";

/* `bandsOf` é a quarta, e ela nasceu com o motor de normas. */
/* `lockedBy` é a quinta porta, e ela responde à pergunta que o jogador faz antes de qualquer
   outra: por que eu não tenho dinheiro. */
/* ⚠ `forecast` É A SEXTA, e ela nasceu de um defeito medido: a Mesa montava a previsão à mão
   com os blocos crus do catálogo enquanto o turno votava com as bancadas do ELENCO, a
   verba com crédito de memória dentro e a aprovação da rua.
   Em 1.012 votações, o veredito saía INVERTIDO em 27,2% delas.
   Ela é a porta que torna esse defeito impossível de repetir: a tela não tem mais como montar
   uma câmara, porque ela não recebe as peças — recebe a resposta. */
/* `governmentOf` é a sétima porta, e ela responde à pergunta que o jogo nunca respondeu: QUEM
   É VOCÊ. */
/* `passageOf` é a nona porta, e ela nasceu junto com a tramitação: o texto que o jogador
   escreve hoje vai para a GAVETA, e uma tela que continuasse anunciando o placar do mês
   estaria prevendo uma votação que não vai acontecer. */
/* `chamberOf` é a oitava porta, e ela desenha o hemiciclo: quantas cadeiras cada bancada tem
   e quantas delas respondem ao governo. */
/* A tela não remonta pressão nem redecide ruptura: refeitas por fora, elas divergiriam no
   primeiro mês em que um limiar mudasse. */
/* ⚠ `outlook` é a décima segunda porta, e ela fechou a PORTA ERRADA que estava aberta no
   entrypoint. */
/* ⚠ `termOf` é a décima terceira porta, e ela guarda uma regra que estava PELA METADE na
   tela. */
export {
  bandsOf,
  boilerOf,
  chamberOf,
  forecast,
  governmentOf,
  ledger,
  lockedBy,
  outlook,
  passageOf,
  playMonth,
  settlement,
  situationOf,
  termOf,
  /* ⚠ `trajectory` É A DÉCIMA SÉTIMA PORTA, e ela é `outlook` com horizonte: a tela de área
     imprimia `61 → 61` numa área que anda 0,40 por mês. O plenário fica congelado dentro dela,
     de propósito — ver a prosa da função. */
  trajectory,
  HORIZON,
} from "../application/turn.mjs";
export { compose, honour, spendOf } from "../application/agenda.mjs";
/* O corte do bimestre (E0): a reunião e o ensaio passam pela porta, e a tela não refaz a conta. */
export { briefingOf, momentOf } from "../application/contingency.mjs";
/** @typedef {import("../application/contingency.mjs").Step} Step */
/** @typedef {import("../application/contingency.mjs").Stance} Stance */
/** @typedef {import("../application/contingency.mjs").Briefing} Briefing */
export { rehearsal, upkeepOf } from "../application/scenario.mjs";
/* O caminho da tramitação, em ordem: a tela desenha onde o texto está, e não redeclara a fila. */
export { STAGES } from "../application/passage.mjs";
/* ⚠ O CALENDÁRIO É A PRIMEIRA DATA DO JOGO, e ele passa pela porta como função pura de `month`:
   nenhum relógio, para o mandato continuar se refazendo da semente. */
export { calendarOf, AHEAD } from "../application/calendar.mjs";
/* ⚠ `chainOf` É A DÉCIMA OITAVA PORTA, e ela é o D4: a corrente existia e não aparecia. Gastar
   em Segurança move a ordem, que move a despesa obrigatória, que move o caixa — e a única
   pista disso na interface era um número mudando em outra tela. */
export { chainOf } from "../application/chain.mjs";
/* ⚠ `pledgesOf` E `platformOf` SÃO A DÉCIMA NONA PORTA, e a lista de prioridade é DERIVADA do
   catálogo — as três áreas que o país entrega piores. A tela que a montasse teria uma segunda
   verdade sobre onde o país está pior, e o julgamento de cada promessa é motor: o índice contra
   a posse, a dívida contra a herdada, a norma contra `enactedAt`. */
export { betrayalOf, pledgesOf, platformOf, spoken } from "../application/platform.mjs";
/* `left` é a décima porta, e ela é uma linha — o que importa é ela ser a ÚNICA. */
/* ⚠ `silences` é a décima quinta porta, e ela nasceu de uma RECUSA. */
export { left, silences } from "../application/mail.mjs";
