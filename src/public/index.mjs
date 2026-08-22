/* A FACHADA — a unica porta por onde o entrypoint alcanca o jogo.
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE ELA EXISTE, e a razao esta escrita numa guarda. `app.mjs` so pode
   importar de `src/state/`, `src/public/` e `src/ui/` — ele NAO alcanca dominio
   nem aplicacao direto. A regra parece burocracia ate a gente lembrar de onde
   veio: no projeto anterior o entrypoint nasceu como wiring, foi acumulando
   regra por conveniencia, e virou 1.715 linhas que uma etapa inteira de
   refatoracao nao conseguiu desmontar.

   Este arquivo e a consequencia util disso. Ele nao calcula nada e nao decide
   nada: reune o que a tela precisa e da um nome so a isso. Quando um motor novo
   nascer, quem muda e este arquivo, e nao o entrypoint.

   O QUE ELE NAO EXPORTA E TAO IMPORTANTE QUANTO. Nada de `vote`, `settle` ou
   `step`: a tela nao resolve turno, ela pede o turno resolvido. Se um dia alguem
   precisar de um motor cru aqui, e sinal de que a camada de aplicacao esta
   faltando uma funcao — e nao de que a fachada esta incompleta. */

/* OS TIPOS TAMBEM PASSAM PELA PORTA, e nao e formalidade: sem o bloco abaixo o
   entrypoint teria de escrever `import("../application/turn.mjs").Orders` para
   anotar as proprias ordens — alcancando a camada de aplicacao por dentro de um
   comentario. A fronteira que a guarda cobra vale para o valor E para o tipo,
   senao ela e fronteira so em tempo de execucao. */

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

/* A PREVISAO e a BANDA sao os dois numeros que a mesa de negociacao mostra ao
   vivo enquanto o jogador arrasta a verba. Eles vem do dominio porque sao a
   mesma conta que a votacao vai fazer — refeita por fora, seria conta que
   diverge da que decide. */
/* `baseSplit` passa pela porta pela mesma razao das duas acima, e com um agravante
   proprio: o arco do Gabinete pinta a base por estado da bancada, e os limiares que
   separam "com o governo" de "obstruindo" e de "rompido" sao calibragem de ECLUSA.
   A tela que os redigitasse chamaria de obstrucao o que o motor ja trata como
   ruptura no dia seguinte a primeira recalibragem. */
/* ⚠ `whipCount` E `dispersion` SAIRAM DA FACHADA em 15/08/2026, e a saida delas e
   o conserto de verdade — a prova nova so denuncia; isto IMPEDE.

   Enquanto os dois estiveram aqui, o entrypoint podia montar a propria camara para
   prever uma votacao, e foi exatamente o que ele fez: chamava `whipCount` com os
   quatro blocos do catalogo enquanto o turno votava com as onze bancadas do ELENCO,
   a verba com credito de memoria dentro e a aprovacao da rua. Ninguem quebrou nada
   ao acrescentar esses motores; a tela simplesmente ficou para tras, e em 27,2% das
   votacoes ela anunciava o veredito contrario ao que o mes produzia.

   O padrao ja estava escrito tres vezes neste arquivo — `settlement`, `ledger` e
   `bandsOf` existem para a tela PERGUNTAR em vez de remontar. A licao que faltava e
   que nao basta oferecer a porta certa: enquanto a porta errada continuar aberta,
   alguem entra por ela. Quem quiser prever uma votacao chama `forecast`. */
export { baseSplit, THRESHOLDS } from "../domain/congress/index.mjs";

/* `pollFrom` CONVERTE SATISFACAO EM PESQUISA, e ela passa pela porta pelo mesmo
   motivo das duas acima: o estado guarda o humor de cada segmento, e a escala de
   otimo/bom/regular e uma regra de SONDA. A tela pergunta; ela nao converte. */
export { pollFrom } from "../domain/opinion/index.mjs";

/* `settlement` E `playMonth` sao as duas unicas portas da camada de aplicacao, e
   elas dizem a mesma coisa em tempos diferentes: uma responde "o que aconteceria
   com estas ordens", a outra executa. A tela usa a primeira a cada movimento de
   controle justamente para nao ter de imitar a segunda. */
/* `ledger` e a terceira, e ela e do mesmo tipo: a pergunta "como este mes fecha
   em dinheiro". Financas mostraria numero de dois motores, e a alternativa era
   abrir `budgetStep` e `carry` crus aqui — motor cru na fachada e a tela
   remontando a posicao orcamentaria por fora. */
/* `bandsOf` e a quarta, e ela nasceu com o motor de normas. A tela precisa saber
   o que a lei manda enquanto o jogador arrasta o controle, e a lei deixou de ser
   um campo do estado para virar a leitura de uma pilha de textos — com gatilho,
   prazo e revogacao dentro. Sem esta porta, o entrypoint teria de montar as
   alavancas e os indicadores por fora para chamar o motor: motor cru na fachada, e
   a tela remontando a legislacao do pais. */
/* `lockedBy` e a quinta porta, e ela responde a pergunta que o jogador faz antes
   de qualquer outra: por que eu nao tenho dinheiro. A resposta e uma lista de
   NORMAS, e quem sabe qual delas venceu a disputa de precedencia e o motor. */
/* ⚠ `forecast` E A SEXTA, e ela nasceu de um defeito medido: a Mesa montava a
   previsao a mao com os quatro blocos do catalogo enquanto o turno votava com as
   onze bancadas do ELENCO, a verba com credito de memoria dentro e a aprovacao da
   rua. Em 1.012 votacoes, o veredito saia INVERTIDO em 27,2% delas.
   Ela e a porta que torna esse defeito impossivel de repetir: a tela nao tem mais
   como montar uma camara, porque ela nao recebe as pecas — recebe a resposta. E o
   mesmo movimento de `settlement` e de `bandsOf`, e pela terceira vez pela mesma
   razao. */
/* `governmentOf` e a setima porta, e ela responde a pergunta que o jogo nunca
   respondeu: QUEM E VOCE. Ela devolve o nome do presidente, o conselheiro que
   assina a leitura do mes, e a posicao que o governo se TORNOU — que `compose`
   calcula desde o ciclo 2 e que morria dentro de uma pauta, sem nenhuma tela
   dizer o resultado. */
/* `passageOf` e a nona porta, e ela nasceu junto com a tramitacao: o texto que o
   jogador escreve hoje vai para a GAVETA, e uma tela que continuasse anunciando o
   placar do mes estaria prevendo uma votacao que nao vai acontecer. Ela devolve o
   estagio de cada texto, ha quanto tempo ele espera e quanto falta para ele morrer
   engavetado. */
/* `chamberOf` e a oitava porta, e ela desenha o hemiciclo: quantas cadeiras cada
   bancada tem e quantas delas respondem ao governo. A segunda conta e `moodFactor`,
   calibragem de ECLUSA — refeita na tela, ela produziria um plenario desenhado que
   discorda do numero impresso ao lado dele. */
/* `boilerOf` e a decima primeira porta: a CALDEIRA como a tela precisa ve-la — os
   quatro grupos de pressao, o que cada um cobra, e quais das tres rupturas ja estao
   abertas. A tela nao remonta pressao nem redecide ruptura: refeitas por fora, elas
   divergiriam no primeiro mes em que um limiar mudasse. */
/* ⚠ `outlook` e a decima segunda porta, e ela fechou a PORTA ERRADA que estava
   aberta no entrypoint. Ele projetava o indice da area a mao — `value − decay +
   yield × asked` — enquanto a MALHA consome o gasto CHEIO e ja rateado, e o
   resultado era a seta apontando para o lado errado em CINCO das oito areas no mes 1.
   Oferecer a porta certa nao basta: a copia saiu junto. */
/* ⚠ `termOf` e a decima terceira porta, e ela guarda uma regra que estava PELA
   METADE na tela. O entrypoint perguntava `state.fallen !== null` para desligar o
   botao de avancar — o que pegava a queda e nao pegava o PRAZO: nada no jogo
   terminava o mandato aos 48 meses, e quem atravessasse os quatro anos entrava num
   "2o mandato" que nunca teve eleicao. Quem sabe quando um mandato acaba e o
   regime, e nao a view. */
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
/* `left` e a decima porta, e ela e uma linha — o que importa e ela ser a UNICA.
   Quantos meses faltam para uma carta vencer parece conta trivial demais para ter
   porta propria, e e exatamente por isso que ela precisa de uma: subtracao trivial
   e o que a tela refaz sem pensar, e no dia em que o vencimento deixar de ser
   `due - month` — prorrogacao, prazo em dias, feriado legislativo — a tarja de
   gravidade passaria a mentir sem nada acusar. A tela pergunta. */
/* ⚠ `silences` e a decima quinta porta, e ela nasceu de uma RECUSA. Um dossie
   externo pediu que o botao de avancar travasse com pergunta urgente na mesa; o
   projeto nao tem muro, tem preco. Ela responde exatamente a pergunta que o botao
   precisa fazer — "o que este clique decide por mim?" — e a resposta e `settle`
   filtrada, e nao uma regra nova: a tela que perguntasse `left(carta) <= 0` por fora
   estaria refazendo a conta do motor pela oitava vez neste projeto. */
export { left, silences } from "../application/mail.mjs";
