/* A FACHADA — a unica porta por onde o entrypoint alcanca o jogo. */

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
export { CAPACITY_TARGET, NEUTRAL } from "../data/areas.mjs";
export { quorumOf } from "../data/bills.mjs";
export { MONTHS_PER_TERM, MONTHS_PER_YEAR, SEATS, SIMPLE_MAJORITY } from "../data/regime.mjs";

/* A PREVISAO e a BANDA sao os dois numeros que a mesa de negociacao mostra ao vivo enquanto o
   jogador arrasta a verba. */
/* A tela que os redigitasse chamaria de obstrucao o que o motor ja trata como ruptura no dia
   seguinte a primeira recalibragem. */
/* Elas passam pela porta porque a tela ja montou a camara a mao: com os blocos crus do
   catalogo, enquanto o turno votava com as bancadas do ELENCO, a verba com credito de
   memoria dentro e a aprovacao da rua. Ninguem quebrou nada ao acrescentar esses motores;
   a tela simplesmente ficou para tras, e em 27,2% das votacoes ela anunciava o veredito
   contrario ao que o mes produzia. */
export { baseSplit, baseVenality, THRESHOLDS } from "../domain/congress/index.mjs";

/* ⚠ `alertsOf` E A DECIMA SEXTA PORTA, e ela nasceu de um dado sem consumidor: o rail
   desenhava os oito ministerios IDENTICOS enquanto a MALHA sabia o indice de cada um todo mes.
   Ela passa pela porta pelo mesmo motivo de `pollFrom`: a escala de queda e regra da MALHA, e
   duas telas vao le-la — o rail agora, a faixa de areas no passo 2. */
export { alertsOf } from "../domain/capacity/index.mjs";

/* `pollFrom` CONVERTE SATISFACAO EM PESQUISA, e ela passa pela porta pelo mesmo motivo das
   duas acima: o estado guarda o humor de cada segmento, e a escala de
   otimo/bom/regular e uma regra de SONDA. A tela pergunta; ela nao converte. */
export { pollFrom } from "../domain/opinion/index.mjs";

/* `bandsOf` e a quarta, e ela nasceu com o motor de normas. */
/* `lockedBy` e a quinta porta, e ela responde a pergunta que o jogador faz antes de qualquer
   outra: por que eu nao tenho dinheiro. */
/* ⚠ `forecast` E A SEXTA, e ela nasceu de um defeito medido: a Mesa montava a previsao a mao
   com os blocos crus do catalogo enquanto o turno votava com as bancadas do ELENCO, a
   verba com credito de memoria dentro e a aprovacao da rua.
   Em 1.012 votacoes, o veredito saia INVERTIDO em 27,2% delas.
   Ela e a porta que torna esse defeito impossivel de repetir: a tela nao tem mais como montar
   uma camara, porque ela nao recebe as pecas — recebe a resposta. */
/* `governmentOf` e a setima porta, e ela responde a pergunta que o jogo nunca respondeu: QUEM
   E VOCE. */
/* `passageOf` e a nona porta, e ela nasceu junto com a tramitacao: o texto que o jogador
   escreve hoje vai para a GAVETA, e uma tela que continuasse anunciando o placar do mes
   estaria prevendo uma votacao que nao vai acontecer. */
/* `chamberOf` e a oitava porta, e ela desenha o hemiciclo: quantas cadeiras cada bancada tem
   e quantas delas respondem ao governo. */
/* A tela nao remonta pressao nem redecide ruptura: refeitas por fora, elas divergiriam no
   primeiro mes em que um limiar mudasse. */
/* ⚠ `outlook` e a decima segunda porta, e ela fechou a PORTA ERRADA que estava aberta no
   entrypoint. */
/* ⚠ `termOf` e a decima terceira porta, e ela guarda uma regra que estava PELA METADE na
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
  /* ⚠ `trajectory` E A DECIMA SETIMA PORTA, e ela e `outlook` com horizonte: a tela de area
     imprimia `61 → 61` numa area que anda 0,40 por mes. O plenario fica congelado dentro dela,
     de proposito — ver a prosa da funcao. */
  trajectory,
  HORIZON,
} from "../application/turn.mjs";
export { compose, honour, spendOf } from "../application/agenda.mjs";
/* O caminho da tramitacao, em ordem: a tela desenha onde o texto esta, e nao redeclara a fila. */
export { STAGES } from "../application/passage.mjs";
/* ⚠ O CALENDARIO E A PRIMEIRA DATA DO JOGO, e ele passa pela porta como funcao pura de `month`:
   nenhum relogio, para o mandato continuar se refazendo da semente. */
export { calendarOf, AHEAD } from "../application/calendar.mjs";
/* ⚠ `chainOf` E A DECIMA OITAVA PORTA, e ela e o D4: a corrente existia e nao aparecia. Gastar
   em Seguranca move a ordem, que move a despesa obrigatoria, que move o caixa — e a unica
   pista disso na interface era um numero mudando em outra tela. */
export { chainOf } from "../application/chain.mjs";
/* ⚠ `pledgesOf` E `platformOf` SAO A DECIMA NONA PORTA, e a lista de prioridade e DERIVADA do
   catalogo — as tres areas que o pais entrega piores. A tela que a montasse teria uma segunda
   verdade sobre onde o pais esta pior, e o julgamento de cada promessa e motor: o indice contra
   a posse, a divida contra a herdada, a norma contra `enactedAt`. */
export { betrayalOf, pledgesOf, platformOf, spoken } from "../application/platform.mjs";
/* `left` e a decima porta, e ela e uma linha — o que importa e ela ser a UNICA. */
/* ⚠ `silences` e a decima quinta porta, e ela nasceu de uma RECUSA. */
export { left, silences } from "../application/mail.mjs";
