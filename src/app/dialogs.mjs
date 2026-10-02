/* OS DIÁLOGOS — o aviso e a posse. */

import { noticeHtml } from "../ui/screens/report.mjs";
import { DEFAULT_TREATMENT, UI } from "../ui/strings.mjs";
import { CATALOG } from "../public/index.mjs";
import { session } from "./session.mjs";
import { dressActions, el } from "./paint.mjs";

/**
 * O AVISO — a única coisa que ainda interrompe.
 *
 * `showModal()` entrega foco, inércia do fundo, Escape e camada superior; a versão
 * manual disso custou, no projeto anterior, uma sessão inteira de correção de
 * acessibilidade e três regras permanentes de documentação. O relatório saiu daqui de
 * propósito: informacao que se consulta não trava o fundo, e um aviso trava porque
 * algo deu errado.
 *
 * @param {string} title
 * @param {string} body
 */
export function openNotice(title, body) {
  el.noticeSlot.innerHTML = noticeHtml({ title, body });
  el.dialog.showModal();
  dressActions();
}

/* ── A POSSE ───────────────────────────────────────────────────────────────── */

export function openSwear() {
  el.swearName.value = session.state.president?.name ?? "";
  /* AS OPÇÕES SÃO MONTADAS AQUI, e não no HTML: a lista de bancadas mora no catálogo, e
     escrever nove `<option>` a mão seria uma segunda verdade sobre quantas o jogo tem. */
  /* ⚠ NENHUMA VEM MARCADA, e a vaga na frente e o item: com a lista crua, quem só clica em
     "tomar posse" leva a PRIMEIRA do catálogo — a menor bancada da Camara, escolhida por
     ordem de arquivo e não por ele. A escolha e obrigatória na lei e passa a ser na tela. */
  const vazia = document.createElement("option");
  vazia.value = "";
  vazia.textContent = UI.actions.swearPartyEmpty;
  vazia.disabled = true;
  vazia.selected = session.state.party === null || session.state.party === undefined;

  el.swearParty.replaceChildren(
    vazia,
    ...CATALOG.parties.map(party => {
      const option = document.createElement("option");
      option.value = party.id;
      option.textContent = `${party.sigla} — ${party.label} · ${party.seats} cadeiras`;
      option.selected = party.id === session.state.party;
      return option;
    }),
  );
  const marcado = /** @type {HTMLInputElement | null} */ (
    el.swearForm.querySelector(
      `input[name="treatment"][value="${session.state.president?.treatment ?? DEFAULT_TREATMENT}"]`,
    )
  );
  if (marcado) marcado.checked = true;
  el.swearDialog.showModal();
  dressActions();
  el.swearName.focus();
  el.swearName.select();
}
