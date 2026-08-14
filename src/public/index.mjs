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
export { whipCount, dispersion, THRESHOLDS } from "../domain/congress/index.mjs";

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
export { ledger, playMonth, settlement, situationOf } from "../application/turn.mjs";
export { compose, honour, spendOf } from "../application/agenda.mjs";
