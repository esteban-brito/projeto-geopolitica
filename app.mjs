/* ENTRYPOINT — composicao e wiring, e nada mais.
   ══════════════════════════════════════════════════════════════════════════════
   Este arquivo nao calcula nada e nao formata nada. Ele liga o estado as views e
   as views ao documento. `tests/guards/boundaries.mjs` prova que ele so importa
   de `src/state/`, `src/public/` e `src/ui/` — e a razao e concreta: no projeto
   anterior o entrypoint nasceu como wiring, foi acumulando regra, e virou 1.715
   linhas que uma etapa inteira de refatoracao nao conseguiu desmontar. */

import { createState, reduce } from "./src/state/state.mjs";
import { railNavHtml } from "./src/ui/shared/rail.mjs";
import { approvalHtml, contextHtml, turnHtml, verdictHtml } from "./src/ui/screens/dashboard.mjs";

/** @typedef {import("./src/state/state.mjs").GameState} GameState */

const el = {
  railNav: must("railNav"),
  turn: must("turn"),
  context: must("context"),
  stage: must("stage"),
  verdict: must("verdict"),
  advance: must("advance"),
  inspect: must("inspect"),
  dialog: /** @type {HTMLDialogElement} */ (must("eventDialog")),
  dialogClose: must("eventDialogClose"),
};

/** @param {string} id */
function must(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`elemento #${id} nao existe no documento`);
  return node;
}

/* O SUBSTRATO NAO PASSA MAIS POR AQUI. Ele virou CSS puro — gradiente resolvido
   na resolucao do dispositivo, sem SVG escalado no meio —, entao o entrypoint
   deixou de precisar montar coisa nenhuma no fundo. Menos wiring e exatamente a
   direcao que este arquivo tem de seguir. */

/* O RAIL E MONTADO UMA VEZ. Ele nao depende do estado: a secao corrente
   e a unica coisa que muda nele, e enquanto houver uma tela so nao ha o que
   trocar. Quando a segunda chegar, isto vira parametro e nao mais constante. */
el.railNav.innerHTML = railNavHtml("dashboard");

let state = createState();
/** @type {GameState | null} */
let painted = null;

/* RENDER POR IDENTIDADE DE REFERENCIA.
   Como o estado e imutavel, `anterior.approval === atual.approval` responde
   "esta parte mudou?" com uma comparacao de ponteiro — sem diff de arvore, sem
   framework e sem biblioteca de sinais. E o beneficio direto da decisao de
   imutabilidade: com objetos mutados no lugar, esta linha seria sempre `true` e
   a tela inteira teria de ser redesenhada a cada turno. */
function paint() {
  const previous = painted;

  if (!previous || previous.month !== state.month) {
    el.turn.textContent = turnHtml(state);
  }

  if (!previous || previous.month !== state.month || previous.situation !== state.situation) {
    el.context.innerHTML = contextHtml(state);
  }

  if (!previous || previous.approval !== state.approval) {
    const delta = previous ? state.approval.good - previous.approval.good : 0;
    el.stage.innerHTML = approvalHtml(state.approval, delta);
  }

  if (!previous || previous.situation !== state.situation) {
    el.verdict.textContent = verdictHtml(state.situation);
    document.documentElement.style.setProperty("--situation-tint", `var(--${state.situation})`);
  }

  painted = state;
}

/* A troca de turno passa pela View Transition quando ela existe, e degrada para
   uma pintura direta quando nao — o `?.` e a degradacao inteira. A coreografia
   deixa de ser keyframes coordenados na mao e vira uma declaracao. */
/** @param {import("./src/state/state.mjs").Action} action */
function dispatch(action) {
  state = reduce(state, action);
  const start = document.startViewTransition?.bind(document);
  if (start) start(paint);
  else paint();
}

el.advance.addEventListener("click", () => dispatch({ type: "advanceMonth" }));

/* `showModal()` entrega foco, inercia do fundo, Escape e camada superior. Nada
   disso e escrito aqui — e essa e a diferenca entre o padrao nativo e a versao
   manual, que no projeto anterior custou uma sessao inteira de correcao de
   acessibilidade e tres regras permanentes de documentacao. */
el.inspect.addEventListener("click", () => el.dialog.showModal());
el.dialogClose.addEventListener("click", () => el.dialog.close());

paint();
