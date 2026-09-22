/* OS GESTOS — o que o jogador clica, arrasta e avanca. */

import { createState } from "../state/state.mjs";
import { CATALOG, governmentOf, playMonth, termOf } from "../public/index.mjs";
import { forgetDesk } from "../ui/screens/cabinet.mjs";
import { DEFAULT_TREATMENT, UI } from "../ui/strings.mjs";
import { blankOrders, lawNow, persist, persistDraft, persistSeen, session } from "./session.mjs";
import { el, endLabel, label, paint, refresh, transition } from "./paint.mjs";
import { openSwear } from "./dialogs.mjs";

export function armHandlers() {
  document.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    /* Resposta a carta e ordem no rascunho, e vem antes da navegacao do botao. */
    /* Discurso de posse grava escolhas no rascunho do mes sem mutar o estado. */
    const pledge = target.closest("[data-pledge]");
    if (pledge instanceof HTMLElement && pledge.dataset["pledge"] && pledge.dataset["choice"]) {
      const axis = pledge.dataset["pledge"];
      /* Clicar novamente desmarca o compromisso (governar sem promessa no eixo). */
      session.orders.platform[axis] =
        session.orders.platform[axis] === pledge.dataset["choice"] ? "" : pledge.dataset["choice"];
      persistDraft();
      paint();
      return;
    }

    const choice = target.closest("[data-letter]");
    if (choice instanceof HTMLElement && choice.dataset["letter"] && choice.dataset["answer"]) {
      const id = choice.dataset["letter"];
      /* Clicar novamente na mesma saida desfaz a escolha da carta. */
      session.orders.mail[id] =
        session.orders.mail[id] === choice.dataset["answer"] ? "" : choice.dataset["answer"];
      persistDraft();
      paint();
      return;
    }

    /* Selecao usa data-dispatch para evitar colisao com data-open de ruptura. */
    const dispatch = target.closest("[data-dispatch]");
    if (dispatch instanceof HTMLElement && dispatch.dataset["dispatch"]) {
      session.openDispatch = dispatch.dataset["dispatch"];
      persistSeen();
      paint();
      return;
    }

    /* Decreto protege ou solta a area e repinta projecoes de todas as pastas. */
    const decree = target.closest("[data-protect]");
    if (decree instanceof HTMLElement && decree.dataset["protect"]) {
      const id = decree.dataset["protect"];
      session.orders.protect = session.orders.protect.includes(id)
        ? session.orders.protect.filter(other => other !== id)
        : [...session.orders.protect, id];
      persistDraft();
      paint();
      return;
    }

    const section = target.closest("[data-section]");
    if (section instanceof HTMLElement && section.dataset["section"]) {
      session.screen = section.dataset["section"];
      transition();
      return;
    }
  });

  document.addEventListener("input", event => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;

    const party = target.dataset["party"];
    if (party) {
      session.orders.funding[party] = Number(target.value) / 100;
      persistDraft();
      refresh();
      return;
    }

    /* Controle de programa nao trava em piso: arrastar abaixo da lei muda o rito. */
    const program = target.dataset["program"];
    if (program) {
      session.orders.levels[program] = Number(target.value);
      persistDraft();
      refresh();
      return;
    }

    /* Bandas nao travam piso no teto: faixas invertidas sao derrotadas no plenario. */
    const band = target.dataset["band"];
    const side = target.dataset["side"];
    if (band && (side === "floor" || side === "ceiling")) {
      const current = session.orders.bands[band] ?? lawNow()[band];
      if (current) session.orders.bands[band] = { ...current, [side]: Number(target.value) };
      persistDraft();
      refresh();
    }
  });

  /* Flag resolving impede que multiplos cliques resolvam dois meses no mesmo estado. */
  el.advance.addEventListener("click", () => {
    if (session.resolving) return;
    /* Mandato encerrado por prazo ou queda bloqueia avanco; reinicio exige nova partida. */
    if (termOf(session.state, CATALOG).over) return;
    session.resolving = true;
    el.advance.disabled = true;

    const before = session.state;

    /* Try/catch restaura resolving e advance.disabled em caso de excecao no turno. */
    try {
      const played = playMonth(session.state, session.orders, { catalog: CATALOG });
      session.state = played.state;

      session.last = {
        report: played.report,
        quorum: played.report.agenda.quorum,
        loyaltyBefore: before.loyalty,
        indexBefore: before.capacity.index,
        adviser: governmentOf(before, CATALOG).adviser,
      };

      /* Carta aberta preserva selecao entre meses; rotulo do botao le silences do motor. */
      /* Rascunho reinicia a cada mes para nao pagar verba anterior sem decisao nova. */
      session.orders = blankOrders();
      persistDraft();
      persist();
      /* Fecho assume a tela no mes em que o mandato encerra. */
      if (termOf(session.state, CATALOG).over) session.screen = "cabinet";

      /* Virada de mes pinta direto sem View Transition para evitar piscar de backdrop-filter. */
      paint();
      session.resolving = false;
      endLabel();
    } catch {
      session.resolving = false;
      el.advance.disabled = false;
      session.state = before;
    }
  });

  el.noticeClose.addEventListener("click", () => el.dialog.close());

  /* Botao de reinicio em dois passos com confirmacao que expira apos 5000ms. */
  let arming = 0;

  function disarm() {
    arming = 0;
    el.restart.dataset["arming"] = "false";
    label(el.restart, UI.actions.restart, "");
  }

  el.restart.addEventListener("click", () => {
    if (arming === 0) {
      arming = window.setTimeout(disarm, 5000);
      el.restart.dataset["arming"] = "true";
      label(el.restart, UI.actions.restartConfirm, UI.actions.restartConfirmHint);
      return;
    }

    window.clearTimeout(arming);
    arming = 0;
    disarm();
    /* Partida e criada no fechamento do formulario de posse. */
    openSwear();
  });

  el.swearCancel.addEventListener("click", () => el.swearDialog.close());

  el.swearForm.addEventListener("submit", () => {
    const nome = el.swearName.value.trim();
    const escolha = /** @type {HTMLInputElement | null} */ (
      el.swearForm.querySelector('input[name="treatment"]:checked')
    );
    const treatment = escolha?.value === "senhora" ? "senhora" : DEFAULT_TREATMENT;

    /* Nome vazio reverte ao sorteado; partido invalido aceita null como estado do motor. */
    const partido = CATALOG.parties.some(party => party.id === el.swearParty.value)
      ? el.swearParty.value
      : null;

    session.state = createState(
      undefined,
      CATALOG,
      nome === "" ? null : { name: nome, treatment },
      partido,
    );
    session.last = null;
    /* Posse reseta despacho aberto e estado de mesa da partida anterior. */
    session.openDispatch = session.state.mail[0]?.id ?? null;
    forgetDesk();
    persistSeen();
    session.orders = blankOrders();
    persistDraft();
    session.screen = "cabinet";
    session.painted = null;
    session.framed = null;
    session.standing = null;
    persist();
    transition();
  });
}
