/* OS DIALOGOS — o aviso e a posse. */

import { noticeHtml } from "../ui/screens/report.mjs";
import { DEFAULT_TREATMENT, UI } from "../ui/strings.mjs";
import { CATALOG } from "../public/index.mjs";
import { session } from "./session.mjs";
import { dressActions, el } from "./paint.mjs";

/**
 * O AVISO — a unica coisa que ainda interrompe.
 *
 * `showModal()` entrega foco, inercia do fundo, Escape e camada superior; a versao
 * manual disso custou, no projeto anterior, uma sessao inteira de correcao de
 * acessibilidade e tres regras permanentes de documentacao. O relatorio saiu daqui de
 * proposito: informacao que se consulta nao trava o fundo, e um aviso trava porque
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
  /* AS OPCOES SAO MONTADAS AQUI, e nao no HTML: a lista de bancadas mora no catalogo, e
     escrever nove `<option>` a mao seria uma segunda verdade sobre quantas o jogo tem. */
  /* ⚠ NENHUMA VEM MARCADA, e a vaga na frente e o item: com a lista crua, quem so clica em
     "tomar posse" leva a PRIMEIRA do catalogo — a menor bancada da Camara, escolhida por
     ordem de arquivo e nao por ele. A escolha e obrigatoria na lei e passa a ser na tela. */
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
