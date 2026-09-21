/* ENTRYPOINT — composicao e wiring, e nada mais.

   Ele nao calcula e nao formata: liga o estado as views e as views ao documento, e
   `boundaries` prova que ele so alcanca `src/state/`, `src/public/` e `src/ui/`. No
   projeto anterior o entrypoint nasceu wiring, acumulou regra e virou 1.715 linhas que
   uma refatoracao inteira nao desmontou.

   ELE GUARDA TRES COISAS: `state`, o jogo; `screen`, onde o jogador esta; `orders`, o
   que ele montou para ESTE mes. So `orders` e mutavel, e de proposito — rascunho de
   interface vira estado no instante em que o mes executa, e nao antes.

   E HA DUAS PINTURAS: `paint` redesenha, `refresh` so troca numero derivado. Trocar o
   HTML de um `<input type=range>` no meio de um arrasto arranca o elemento que o
   ponteiro esta segurando, e o arrasto morre no primeiro pixel. */

import { NEUTRAL } from "./src/public/index.mjs";
import { armRail } from "./src/ui/shared/rail.mjs";
import { iconHtml } from "./src/ui/shared/icons.mjs";
import { UI } from "./src/ui/strings.mjs";
import { opening } from "./src/app/session.mjs";
import { el, endLabel, label, paint } from "./src/app/paint.mjs";
import { openNotice } from "./src/app/dialogs.mjs";
import { armHandlers } from "./src/app/handlers.mjs";

/* A gaveta do dock arma uma vez: o `<ul>` sobrevive as pinturas, e o estado mora nele. */
armRail(el.railNav);

/* O BOTAO DE RECOMECAR TEM GLIFO E ROTULO PROPRIOS, como o de avancar: no dock so o glifo
   aparece e o rotulo vira a dica; no rail vertical e o contrario. `label` escreve no rotulo. */
el.restart.innerHTML = iconHtml("restart", "rail__icon") + '<span class="action__label"></span>';

/* O ponto neutro e do catalogo e nao da tela; ele chega aqui so para a faixa de
   indices saber onde fica a linha d'agua. */
document.documentElement.style.setProperty("--neutral", String(NEUTRAL));

/* OS DOIS GLIFOS FIXOS DA BARRA — o brasao da marca e a seta do botao. Eles nao mudam com o
   estado, entao nascem na abertura e nao a cada pintura. */
el.seal.innerHTML = iconHtml("estado", "icon");
el.advanceArrow.innerHTML = iconHtml("chevron", "icon");

endLabel();
label(el.restart, UI.actions.restart, "");

/* OS ROTULOS DA POSSE, como todo texto: do arquivo de frases, e nao do documento. */
el.swearTitle.textContent = UI.actions.swearTitle;
el.swearNameLabel.textContent = UI.actions.swearName;
el.swearPartyLabel.textContent = UI.actions.swearParty;
el.swearPartyHint.textContent = UI.actions.swearPartyHint;
el.swearHowLabel.textContent = UI.actions.swearHow;
el.swearSir.textContent = UI.actions.swearSir;
el.swearMadam.textContent = UI.actions.swearMadam;
el.swearOk.textContent = UI.actions.swearOk;
el.swearCancel.textContent = UI.actions.swearCancel;
el.noticeClose.textContent = UI.actions.close;

armHandlers();
paint();

/* O AVISO VEM DEPOIS DA PRIMEIRA PINTURA, e nao antes: um dialogo modal sobre
   uma tela em branco nao diz de onde ele veio. */
if (opening.refused) openNotice(UI.save.refusedTitle, UI.save.refusedBody);
