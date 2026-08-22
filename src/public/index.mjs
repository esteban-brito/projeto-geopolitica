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
export { INSTRUMENTS, quorumOf } from "../data/bills.mjs";
export { MONTHS_PER_TERM, MONTHS_PER_YEAR, SEATS, SIMPLE_MAJORITY } from "../data/regime.mjs";

/* A PREVISAO e a BANDA sao os dois numeros que a mesa de negociacao mostra ao vivo enquanto o
   jogador arrasta a verba. */
/* `baseSplit` passa pela porta pela mesma razao das duas acima, e com um agravante proprio: o
   arco do Gabinete pinta a base por estado da bancada, e os limiares que A tela que os
   redigitasse chamaria de obstrucao o que o motor ja trata como ruptura no dia seguinte a
   primeira recalibragem.
   separam "com o governo" de "obstruindo" e de "rompido" sao calibragem de ECLUSA. */
/* quatro blocos do catalogo enquanto o turno votava com as onze bancadas do ELENCO,
   a verba com credito de memoria dentro e a aprovacao da rua. Ninguem quebrou nada
   ao acrescentar esses motores; a tela simplesmente ficou para tras, e em 27,2% das
   votacoes ela anunciava o veredito contrario ao que o mes produzia. */
export { baseSplit, THRESHOLDS } from "../domain/congress/index.mjs";

/* `pollFrom` CONVERTE SATISFACAO EM PESQUISA, e ela passa pela porta pelo mesmo motivo das
   duas acima: o estado guarda o humor de cada segmento, e a escala de
   otimo/bom/regular e uma regra de SONDA. A tela pergunta; ela nao converte. */
export { pollFrom } from "../domain/opinion/index.mjs";

/* `bandsOf` e a quarta, e ela nasceu com o motor de normas. */
/* `lockedBy` e a quinta porta, e ela responde a pergunta que o jogador faz antes de qualquer
   outra: por que eu nao tenho dinheiro. */
/* ⚠ `forecast` E A SEXTA, e ela nasceu de um defeito medido: a Mesa montava a previsao a mao
   com os quatro blocos do catalogo enquanto o turno votava com as Ela e a porta que torna
   esse defeito impossivel de repetir: a tela nao tem mais como montar uma camara, porque ela
   nao recebe as pecas — recebe a resposta.
   onze bancadas do ELENCO, a verba com credito de memoria dentro e a aprovacao da
   rua. Em 1.012 votacoes, o veredito saia INVERTIDO em 27,2% delas. */
/* `governmentOf` e a setima porta, e ela responde a pergunta que o jogo nunca respondeu: QUEM
   E VOCE. */
/* `passageOf` e a nona porta, e ela nasceu junto com a tramitacao: o texto que o jogador
   escreve hoje vai para a GAVETA, e uma tela que continuasse anunciando o placar do mes
   estaria prevendo uma votacao que nao vai acontecer. */
/* `chamberOf` e a oitava porta, e ela desenha o hemiciclo: quantas cadeiras cada bancada tem
   e quantas delas respondem ao governo.
   calibragem de ECLUSA — refeita na tela, ela produziria um plenario desenhado que
   discorda do numero impresso ao lado dele. */
/* A tela nao remonta pressao nem redecide ruptura: refeitas por fora, elas divergiriam no
   primeiro mes em que um limiar mudasse. */
/* ⚠ `outlook` e a decima segunda porta, e ela fechou a PORTA ERRADA que estava aberta no
   entrypoint.
   yield × asked` — enquanto a MALHA consome o gasto CHEIO e ja rateado, e o
   resultado era a seta apontando para o lado errado em CINCO das oito areas no mes 1. */
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
} from "../application/turn.mjs";
export { compose, honour, spendOf } from "../application/agenda.mjs";
/* `left` e a decima porta, e ela e uma linha — o que importa e ela ser a UNICA. */
/* ⚠ `silences` e a decima quinta porta, e ela nasceu de uma RECUSA. */
export { left, silences } from "../application/mail.mjs";
