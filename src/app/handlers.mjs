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

    /* ⚠ A RESPOSTA A UMA CARTA E ORDEM, e nao mutacao do estado — a razao esta em
     `state.mjs`, e ela e concreta: o VENCIMENTO acontece dentro do turno, e uma
     resposta que mudasse o estado aqui criaria dois caminhos para a mesma carta,
     com o resultado dependendo de qual chegasse primeiro no mes em que o prazo
     fecha. Marcar aqui e decidir; o mes e que resolve.

     E ELA VEM ANTES DA NAVEGACAO de proposito: o botao de escolha vive dentro de
     uma carta que tambem leva a uma tela, e a ordem inversa faria escolher navegar. */
    /* ── O DISCURSO DE POSSE ────────────────────────────────────────────────────
     ⚠ ELE VEM ANTES DA RESPOSTA DE CARTA e pela mesma razao que ela vem antes da navegacao:
     os tres grupos moram DENTRO da carta da posse, que tambem leva a uma tela.
     ⚠ E ELE NAO ESCREVE NO ESTADO — escreve no rascunho do mes, como toda decisao: quem
     grava a plataforma e o turno, uma vez so. */
    const pledge = target.closest("[data-pledge]");
    if (pledge instanceof HTMLElement && pledge.dataset["pledge"] && pledge.dataset["choice"]) {
      const axis = pledge.dataset["pledge"];
      /* CLICAR DE NOVO NO MESMO COMPROMISSO DESMARCA, como nas duas saidas da emenda: nao
       prometer nada naquele eixo e uma escolha, e ela tem de ter caminho de volta. */
      session.orders.platform[axis] =
        session.orders.platform[axis] === pledge.dataset["choice"] ? "" : pledge.dataset["choice"];
      persistDraft();
      paint();
      return;
    }

    const choice = target.closest("[data-letter]");
    if (choice instanceof HTMLElement && choice.dataset["letter"] && choice.dataset["answer"]) {
      const id = choice.dataset["letter"];
      /* CLICAR DE NOVO NA MESMA SAIDA DESMARCA. Sem isso, uma carta respondida por
       engano so se desfaria escolhendo a outra — e escolher o contrario do que se
       quer para voltar atras nao e desfazer, e uma segunda decisao errada. */
      session.orders.mail[id] =
        session.orders.mail[id] === choice.dataset["answer"] ? "" : choice.dataset["answer"];
      persistDraft();
      paint();
      return;
    }

    /* ── ABRIR UM OFÍCIO NA BANDEJA ─────────────────────────────────────────────
     ⚠ ELE VEM DEPOIS DA ESCOLHA E ANTES DA NAVEGAÇÃO: os botões de resposta moram
     DENTRO do ofício aberto, que mora numa tela que também navega. Abrir antes de
     escolher faria responder virar "abrir de novo o que já está aberto"; navegar antes
     de abrir faria um clique na lista trocar de tela.

     ⚠ E O ATRIBUTO É `data-dispatch` E NÃO `data-open`: a trindade já marca ruptura
     aberta com `data-open="true"`, e um seletor `[data-open]` aqui leria um clique na
     barra de risco como pedido para abrir a carta de id "true". */
    const dispatch = target.closest("[data-dispatch]");
    if (dispatch instanceof HTMLElement && dispatch.dataset["dispatch"]) {
      session.openDispatch = dispatch.dataset["dispatch"];
      persistSeen();
      paint();
      return;
    }

    /* ── O DECRETO DE CONTINGENCIAMENTO ─────────────────────────────────────────
     ⚠ ELE VEM ANTES DA NAVEGACAO pela mesma razao das duas escolhas acima, e clicar de novo
     SOLTA a area: proteger e uma decisao do mes, e toda decisao do mes tem caminho de volta.
     Ele repinta a tela inteira e nao so a leitura, porque proteger uma area muda a razao do
     corte — e portanto a bolsa e a projecao de TODAS as outras. */
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

    /* O BOTAO "PAUTAR" SUMIU, e com ele o gesto que levava a Mesa. Nao ha mais o
     que escolher: a pauta e o que o orcamento ficou, e ela existe no instante em
     que um controle sai do lugar. Quem quiser ver o placar vai a Mesa pelo rail,
     como vai a qualquer outra tela. */
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

    /* O CONTROLE DE PROGRAMA E O UNICO GESTO DA AREA. Ele nao pede confirmacao e
     nao trava em piso nenhum: arrastar abaixo da lei e permitido, e o que muda e
     o rito que a linha passa a anunciar. */
    const program = target.dataset["program"];
    if (program) {
      session.orders.levels[program] = Number(target.value);
      persistDraft();
      refresh();
      return;
    }

    /* ── MOVER UMA LEI ──────────────────────────────────────────────────────────
     O mesmo gesto do controle de verba, e de propósito: mudar quanto se gasta e
     mudar quanto a lei obriga a gastar são o mesmo movimento com preços
     diferentes. O que muda é onde o número cai — em `levels` ou em `bands` — e o
     preço aparece sozinho na Mesa, porque `compose` lê os dois.

     ⚠ O PISO NÃO É TRAVADO PELO TETO, e a ausência de trava é a doutrina do
     projeto: uma faixa invertida é um texto absurdo, e texto absurdo se derrota no
     plenário — não se impede no controle. */
    const band = target.dataset["band"];
    const side = target.dataset["side"];
    if (band && (side === "floor" || side === "ceiling")) {
      const current = session.orders.bands[band] ?? lawNow()[band];
      if (current) session.orders.bands[band] = { ...current, [side]: Number(target.value) };
      persistDraft();
      refresh();
    }
  });

  /* ── O MES E REPETIVEL, E O QUE O SEGURA E O JOGO ───────────────────────────
   Nao ha confirmacao entre um mes e o seguinte: quem quiser atravessar dez meses sem
   decidir nada atravessa, e chega do outro lado com a base obstruindo. Cobrar um clique
   de "entendi" para proteger o jogador dele mesmo e a regra artificial que este jogo
   recusa.

   O TRAVAMENTO NAO E RITMO, E CORRECAO. `playMonth` e sincrono, mas a pintura passa por
   View Transition e a promessa dela demora alguns quadros; dois cliques dentro dessa
   janela resolveriam DOIS meses sobre o MESMO estado. */

  el.advance.addEventListener("click", () => {
    if (session.resolving) return;
    /* ⚠ MANDATO ACABADO NAO E BLOQUEIO DE FLUXO, e a distincao importa porque o
     ciclo 9 proibiu o oposto: bloquear o turno para FORCAR uma resposta. Aqui nao ha
     turno para dar — o mandato acabou, e o botao para pela queda ou pelo PRAZO, que
     e a metade que faltava antes. Quem quiser jogar de novo aperta "nova
     partida". */
    if (termOf(session.state, CATALOG).over) return;
    session.resolving = true;
    el.advance.disabled = true;

    /* O ESTADO DE ANTES FICA GUARDADO porque o relatorio compara: lealdade e
     indice sao valores de agora, e "de 70 para 72" e uma informacao que nenhum
     dos dois carrega sozinho. O turno devolve o depois; o antes so existe aqui,
     no instante anterior a troca. */
    const before = session.state;

    /* ⚠ O TRY/CATCH EVITA TRAVAMENTO PERMANENTE. Se `playMonth` lancar por estado
     corrompido ou violacao de contrato, `resolving` ficaria true e o botao trancado
     para sempre — sem caminho de recuperacao. */
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

      /* ⚠ A CARTA ABERTA ATRAVESSA O MES, POR DECISAO DELE: "quando eu avanco um mes, nao pode
       mudar a mensagem que esta clicada, tem que ficar naquela ate que eu mesmo mude".
       ⚠ E ISSO REVERTE O CONSERTO DE 28/08, que zerava `openDispatch` aqui. O defeito que
       aquele conserto atacava — o painel mostrando um aviso velho enquanto o botao cobrava o
       silencio de outra carta — nao volta: quem escreve o rotulo do botao e `silences`, do
       motor, e nao a carta aberta. Quem perde o id (poda) cai na de cima, em `trayHtml`. */

      /* O RASCUNHO MORRE COM O MES. Carregar a verba do mes passado para o proximo
       faria o jogador pagar de novo sem ter decidido — e o motor cobraria, porque
       ele nao sabe distinguir promessa nova de promessa esquecida na tela. */
      session.orders = blankOrders();
      persistDraft();
      persist();
      /* ⚠ O FECHO PUXA A TELA PARA SI no mes em que o mandato acaba, e so nesse mes. */
      if (termOf(session.state, CATALOG).over) session.screen = "cabinet";

      /* ⛔ AVANCAR O MES NAO E TROCAR DE TELA, e tratar os dois igual era o defeito. Numa View
       Transition o navegador congela a pagina numa IMAGEM, e `backdrop-filter` nao sobrevive
       a um instantaneo: a barra piscava de vidro para chapado e de volta, uma vez por mes. O
       rail nao piscava so porque o conteudo dele nao muda — o olho nao tinha onde notar.
       ⭐ A troca de TELA continua com transicao; a virada do MES pinta direto. */
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

  /* ── RECOMECAR, EM DOIS PASSOS ──────────────────────────────────────────────
   O botao apaga um mandato e mora ao lado de um que se aperta toda hora. O
   primeiro clique so troca o proprio rotulo; o segundo executa. E a confirmacao
   expira sozinha, porque um botao que fica armado indefinidamente e uma
   armadilha esperando o proximo clique distraido. */
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
    /* ⚠ A PARTIDA NAO COMECA NO CLIQUE, e sim na POSSE: o jogador escreve o nome antes de o
     estado existir. O `createState` so roda quando o formulario fecha. */
    openSwear();
  });

  el.swearCancel.addEventListener("click", () => el.swearDialog.close());

  el.swearForm.addEventListener("submit", () => {
    const nome = el.swearName.value.trim();
    const escolha = /** @type {HTMLInputElement | null} */ (
      el.swearForm.querySelector('input[name="treatment"]:checked')
    );
    const treatment = escolha?.value === "senhora" ? "senhora" : DEFAULT_TREATMENT;

    /* ⚠ NOME VAZIO VOLTA AO SORTEADO, e nao a uma string em branco: a tela cita o presidente
     em quatro lugares, e um vazio ali leria como defeito de carregamento. */
    /* ⚠ SEM PARTIDO NAO E UMA OPCAO DA TELA, mas continua sendo um estado valido do motor: e
     assim que um save da versao 20 abre, e e assim que o simulador roda. */
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
    /* ⚠ E A CARTA ABERTA MORRE NA POSSE, que e o unico lugar onde ela morre: o id do alarme nao
     carrega o mes — `alarm()` monta `kind:id` —, entao um `ceiling:ceiling` clicado na
     partida anterior atravessa o recomeco e a bandeja abre ele em vez da mais urgente. */
    session.openDispatch = session.state.mail[0]?.id ?? null;
    /* ⚠ E O GESTO DA MESA MORRE AQUI PELA MESMA RAZAO: a pasta erguida e a rubrica vivem em
     variavel de modulo, e sem isto a partida nova abria com o ato ja assinado. */
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
