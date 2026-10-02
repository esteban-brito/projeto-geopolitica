/* ENTRYPOINT — composicao e wiring, e nada mais.

   Ele não calcula e não formata: liga o estado as views e as views ao documento, e
   `boundaries` prova que ele só alcanca `src/state/`, `src/public/` e `src/ui/`. No
   projeto anterior o entrypoint nasceu wiring, acumulou regra e virou 1.715 linhas que
   uma refatoração inteira não desmontou.

   ELE GUARDA TRÊS COISAS: `state`, o jogo; `screen`, onde o jogador esta; `orders`, o
   que ele montou para ESTE mês. Só `orders` e mutável, e de propósito — rascunho de
   interface vira estado no instante em que o mês executa, e não antes.

   E HÁ DUAS PINTURAS: `paint` redesenha, `refresh` só troca número derivado. Trocar o
   HTML de um `<input type=range>` no meio de um arrasto arranca o elemento que o
   ponteiro esta segurando, e o arrasto morre no primeiro pixel. */

import { NEUTRAL } from "./public/index.mjs";
import { armRail } from "./ui/components/rail.mjs";
import { iconHtml } from "./ui/core/icons.mjs";
import { UI } from "./ui/strings.mjs";
import { opening } from "./shell/session.mjs";
import { el, endLabel, label, paint } from "./shell/paint.mjs";
import { openNotice } from "./shell/dialogs.mjs";
import { armHandlers } from "./shell/handlers.mjs";

/* A gaveta do dock arma uma vez: o `<ul>` sobrevive as pinturas, e o estado mora nele. */
armRail(el.railNav);

/* O BOTÃO DE RECOMEÇAR TEM GLIFO E RÓTULO PRÓPRIOS, como o de avançar: no dock só o glifo
   aparece e o rótulo vira a dica; no rail vertical e o contrário. `label` escreve no rótulo. */
el.restart.innerHTML = iconHtml("restart", "rail__icon") + '<span class="action__label"></span>';

/* O ponto neutro e do catálogo e não da tela; ele chega aqui só para a faixa de
   índices saber onde fica a linha d'água. */
document.documentElement.style.setProperty("--neutral", String(NEUTRAL));

/* OS DOIS GLIFOS FIXOS DA BARRA — o brasão da marca e a seta do botão. Eles não mudam com o
   estado, então nascem na abertura e não a cada pintura. */
el.seal.innerHTML = iconHtml("estado", "icon");
el.advanceArrow.innerHTML = iconHtml("chevron", "icon");

endLabel();
label(el.restart, UI.actions.restart, "");

/* OS RÓTULOS DA POSSE, como todo texto: do arquivo de frases, e não do documento. */
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

/* O AVISO VEM DEPOIS DA PRIMEIRA PINTURA, e não antes: um diálogo modal sobre
   uma tela em branco não diz de onde ele veio. */
if (opening.refused) openNotice(UI.save.refusedTitle, UI.save.refusedBody);
