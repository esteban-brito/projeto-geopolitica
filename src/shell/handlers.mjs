/* OS GESTOS — o que o jogador clica, arrasta e avança. */

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

    /* Resposta à carta é ordem no rascunho, e vem antes da navegação do botão. */
    /* Discurso de posse grava escolhas no rascunho do mês sem mutar o estado. */
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
      /* Clicar novamente na mesma saída desfaz a escolha da carta. */
      session.orders.mail[id] =
        session.orders.mail[id] === choice.dataset["answer"] ? "" : choice.dataset["answer"];
      persistDraft();
      paint();
      return;
    }

    /* Seleção usa data-dispatch para evitar colisão com data-open de ruptura. */
    const dispatch = target.closest("[data-dispatch]");
    if (dispatch instanceof HTMLElement && dispatch.dataset["dispatch"]) {
      session.openDispatch = dispatch.dataset["dispatch"];
      persistSeen();
      paint();
      return;
    }

    /* Na reunião do corte, recusar uma posição é um ato que só o ministro recusado observa. */
    const refuse = target.closest("[data-refuse]");
    if (refuse instanceof HTMLElement && refuse.dataset["refuse"] && refuse.dataset["plan"]) {
      if (session.orders.moment.closed) return;
      session.orders.moment.steps.push({
        kind: "refuse",
        minister: refuse.dataset["refuse"],
        plan: refuse.dataset["plan"],
      });
      persistDraft();
      paint();
      return;
    }
    if (target.closest("[data-close-cut]") !== null) {
      session.orders.moment.closed = true;
      persistDraft();
      paint();
      return;
    }

    /* Decreto protege ou solta a área e repinta projeções de todas as pastas. */
    const decree = target.closest("[data-protect]");
    if (decree instanceof HTMLElement && decree.dataset["protect"]) {
      if (session.orders.moment.closed) return;
      const id = decree.dataset["protect"];
      session.orders.protect = session.orders.protect.includes(id)
        ? session.orders.protect.filter(other => other !== id)
        : [...session.orders.protect, id];
      session.orders.moment.steps.push({ kind: "draft", protect: [...session.orders.protect] });
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

    /* Controle de programa não trava em piso: arrastar abaixo da lei muda o rito. */
    const program = target.dataset["program"];
    if (program) {
      session.orders.levels[program] = Number(target.value);
      persistDraft();
      refresh();
      return;
    }

    /* Bandas não travam piso no teto: faixas invertidas são derrotadas no plenário. */
    const band = target.dataset["band"];
    const side = target.dataset["side"];
    if (band && (side === "floor" || side === "ceiling")) {
      const current = session.orders.bands[band] ?? lawNow()[band];
      if (current) session.orders.bands[band] = { ...current, [side]: Number(target.value) };
      persistDraft();
      refresh();
    }
  });

  /* Flag resolving impede que múltiplos cliques resolvam dois meses no mesmo estado. */
  el.advance.addEventListener("click", () => {
    if (session.resolving) return;
    /* Mandato encerrado por prazo ou queda bloqueia avanço; reinício exige nova partida. */
    if (termOf(session.state, CATALOG).over) return;
    session.resolving = true;
    el.advance.disabled = true;

    const before = session.state;

    /* Try/catch restaura resolving e advance.disabled em caso de exceção no turno. */
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

      /* Carta aberta preserva seleção entre meses; rótulo do botão lê silences do motor. */
      /* Rascunho reinicia a cada mês para não pagar verba anterior sem decisão nova. */
      session.orders = blankOrders();
      persistDraft();
      persist();
      /* Fecho assume a tela no mês em que o mandato encerra. */
      if (termOf(session.state, CATALOG).over) session.screen = "cabinet";

      /* Virada de mês pinta direto sem View Transition para evitar piscar de backdrop-filter. */
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

  /* Botão de reinício em dois passos com confirmação que expira após 5000ms. */
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
    /* Partida é criada no fechamento do formulário de posse. */
    openSwear();
  });

  el.swearCancel.addEventListener("click", () => el.swearDialog.close());

  el.swearForm.addEventListener("submit", () => {
    const nome = el.swearName.value.trim();
    const escolha = /** @type {HTMLInputElement | null} */ (
      el.swearForm.querySelector('input[name="treatment"]:checked')
    );
    const treatment = escolha?.value === "senhora" ? "senhora" : DEFAULT_TREATMENT;

    /* Nome vazio reverte ao sorteado; partido inválido aceita null como estado do motor. */
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
