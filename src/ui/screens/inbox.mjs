/* A CAIXA DE ENTRADA — a primeira carta de verdade. */

import { escapeHtml } from "../shared/html.mjs";
import { apportion, money, percent, seats, signed } from "../shared/format.mjs";
import { sigilHtml } from "../shared/sigil.mjs";
import { monthLabel } from "../../state/state.mjs";
import { DEFAULT_TREATMENT, UI, addressed, labelOf } from "../strings.mjs";

/**
 * Esta e a familia de defeito mais cara do projeto, com sete ocorrencias medidas, e ela nasce
 * sempre igual: uma mudanca deixa uma copia para tras.
 *
 * @typedef {object} Dispatch
 * @property {string} id o mesmo id da carta no estado; e por ele que a bandeja abre
 * @property {number} month o mes em que ela chegou — e o indice PRECISA dele; ver `rowHtml`
 * @property {{ name: string, office: string, label: string, reach: number, gender?: "f" | "m" } | null} from
 * @property {string} subject
 * @property {string} body ja em HTML
 * @property {string | undefined} [annex] os anexos, ja em HTML
 * @property {string | undefined} [action] o rotulo do botao que leva ao lugar de decidir
 * @property {string | undefined} [target] a secao para onde ele leva
 * @property {string | undefined} [choices] as duas saidas, quando a carta PERGUNTA
 * @property {number | null | undefined} [due] quantos meses faltam; nulo sem prazo
 */

/**
 * QUAO PERTO DE VENCER — tres degraus, e nao um gradiente.
 *
 * @param {number | null | undefined} due
 * @returns {"open" | "soon" | "now" | null}
 */
function urgencyOf(due) {
  if (due === null || due === undefined) return null;
  return due <= 0 ? "now" : due <= 1 ? "soon" : "open";
}

/**
 * UMA CARTA — remetente, assunto, corpo, e para onde ela leva.
 *
 * @param {object} input
 * @param {{ name: string, office: string, label: string, reach: number, gender?: "f" | "m" } | null} input.from
 * @param {string} input.subject
 * @param {string} input.body ja em HTML
 * @param {string} [input.annex] os anexos, ja em HTML; cada um e um card
 * @param {string} [input.action] o rotulo do botao
 * @param {string} [input.target] a secao para onde ele leva
 * @param {string} [input.choices] as duas saidas, quando a carta PERGUNTA
 * @param {number | null} [input.due] quantos meses faltam; nulo quando nao ha prazo
 * @param {number | null} [input.month]
 * @returns {string}
 */
export function letterHtml({
  from,
  subject,
  body,
  annex,
  action,
  target,
  choices,
  due = null,
  month = null,
}) {
  const urgency = urgencyOf(due);

  return (
    `<article class="letter"${urgency ? ` data-urgency="${urgency}"` : ""}>` +
    `<header class="letter__head">` +
    (from
      ? sigilHtml({
          name: from.name,
          office: from.office,
          reach: from.reach,
          role: from.label,
          ...(from.gender ? { gender: from.gender } : {}),
        })
      : "") +
    `<span class="letter__from">` +
    (from
      ? `<b class="letter__name">${escapeHtml(from.name)}</b>` +
        `<span class="letter__role">${escapeHtml(from.label)}</span>`
      : "") +
    `</span>` +
    /* ⚠ A DATA MORA NO CABECALHO DO OFICIO, ao lado de quem assinou — que e onde um documento
       datado se data. */
    `<span class="letter__meta">` +
    (month !== null ? `<span class="letter__date">${escapeHtml(monthLabel(month))}</span>` : "") +
    (urgency ? `<span class="letter__due" data-numeric>${escapeHtml(dueLabel(due))}</span>` : "") +
    `</span>` +
    `</header>` +
    `<h4 class="letter__subject">${escapeHtml(subject)}</h4>` +
    /* ⚠ O VOCATIVO SAIU, por minimalismo: "Presidente," era a MESMA palavra na
       abertura das doze cartas, e uma linha que nunca muda e nunca decide nada e a definicao
       de cerimonia. Ela custava 20px em toda carta e a segunda linha de leitura em todas.
       ⚠ Voltar e uma linha, e o tratamento continua chegando aqui: o resto do corpo o usa. */
    `<div class="letter__body">${body}</div>` +
    /* ⚠ A SECAO EXISTE MESMO VAZIA, e nao e desperdicio: ela e a fileira `1fr` da grade da
       carta, e sem ela o rodape sobe e cola no corpo em toda carta sem anexo. */
    `<section class="letter__annexes">` +
    /* ⚠ A LEGENDA "ANEXOS" SAIU: era um rotulo para um bloco de rotulos. Cada card ja se
       nomeia, e uma palavra em versal para anunciar que o que vem abaixo tem nome e a
       definicao de texto que nao paga o proprio pixel. */
    (annex ? `<div class="annexes">${annex}</div>` : "") +
    `</section>` +
    /* ⚠ O RODAPE E UMA BARRA QUE SANGRA ATE A BORDA, como a "mensagem de accao" do Football
       Manager: o que se pode FAZER com um documento nao mora no meio dele. */
    (choices || (action && target)
      ? `<footer class="letter__foot">` +
        (choices ?? "") +
        (action && target
          ? `<button class="letter__action" type="button" data-section="${escapeHtml(target)}">` +
            `${escapeHtml(action)}</button>`
          : "") +
        `</footer>`
      : "") +
    `</article>`
  );
}

/**
 * O PRAZO EM PALAVRAS — e o zero tem frase propria.
 *
 * @param {number | null} due
 * @returns {string}
 */
function dueLabel(due) {
  if (due === null) return "";
  if (due <= 0) return UI.inbox.dueNow;
  return `${UI.inbox.dueIn} ${due} ${due === 1 ? UI.inbox.month : UI.inbox.months}`;
}

/**
 * O que a carta faz e escolher QUAIS das leituras que o turno ja produziu merecem uma linha —
 * e a escolha e por consequencia: o que o mes decidiu, quanto ele custou, e o que a rua
 * achou.
 *
 * @param {object} input
 * @param {import("../../application/turn.mjs").Report} input.report
 * @param {{ name: string, office: string, label: string, reach: number, gender?: "f" | "m" } | null} input.adviser
 * @returns {Dispatch}
 */
export function describeMonth({ report, adviser }) {
  const bill = report.agenda.proposal;

  const judged = report.events.find(event => event.kind === "passed" || event.kind === "rejected");

  const subject = judged
    ? `${judged.kind === "passed" ? UI.inbox.passed : UI.inbox.rejected}: ${judged.label}`
    : bill
      ? `${UI.inbox.filed}: ${bill.label}`
      : UI.report.noBill;

  /** @type {string[]} */
  const lines = [];

  /* O PLACAR, e so quando houve votacao: decreto nao tem placar, e imprimir um travessao no
     lugar do numero ja foi defeito nesta tela uma vez. */
  if (report.tally) {
    lines.push(
      `<span>${escapeHtml(UI.inbox.voted)} ` +
        `<b data-numeric>${seats(report.tally.votes)}</b> ` +
        `${escapeHtml(UI.mesa.needs)} <b data-numeric>${seats(report.agenda.quorum)}</b></span>`,
    );
  }

  /* O DINHEIRO, e a linha so aparece quando houve promessa: um "prometeu R$ 0,0 bi" todo mes
     ensina o olho a pular a linha inteira. */
  if (report.promisedCost > 0) {
    lines.push(
      `<span>${escapeHtml(UI.report.promised)} ` +
        `<b data-numeric>${money(report.promisedCost)}</b> · ` +
        `${escapeHtml(UI.report.honoured)} ` +
        `<b data-numeric>${money(report.paidCost)}</b></span>`,
    );
  }

  /* ⚠ AS TRES LEITURAS SAIRAM DO CORPO, e a razao e duplicacao medida: o anexo
     "o mes em tres leituras" mostra as MESMAS tres com o antes ao lado, e o corpo as repetia
     so com o depois. Tres linhas de prosa para dizer metade do que a tabela logo abaixo diz
     inteiro. O corpo ficou com o que o anexo NAO tem: o que o mes decidiu, e quanto custou. */
  const balance = report.balance;

  /* O MES QUE NAO DECIDE NADA PRECISA DIZER ISSO, senao o corpo fica vazio — e carta com corpo
     vazio ja foi defeito medido aqui: cabecalho, assunto e 430px de folha em branco. */
  if (lines.length === 0) lines.push(`<span>${escapeHtml(UI.inbox.quietMonth)}</span>`);

  /* ⚠ O ID E O MES, e nao um contador: esta carta nao mora em `state.mail` — ela e lida do
     relatorio a cada pintura. */
  return {
    id: `month-${report.month}`,
    month: report.month,
    from: adviser,
    /* Duas datas coladas uma na outra nao sao redundancia inofensiva — elas roubam a largura
       do unico campo que decide o clique, numa coluna de 208px. */
    subject,
    body: `<div class="letter__lines">${lines.join("")}</div>`,
    annex: balanceAnnex(balance),
    action: UI.inbox.seeMonth,
    target: "congress",
    due: null,
  };
}

/**
 * AS CARTAS DA TRAMITACAO — e sao elas que transformam a gaveta em mecanica.
 *
 * @param {object} input
 * @param {ReadonlyArray<import("../../state/state.mjs").Letter>} input.mail
 * @param {ReadonlyArray<{ id: string, name: string, office: string, label: string,
 * reach: number, gender?: "f" | "m" }>} input.people
 * @param {(letter: import("../../state/state.mjs").Letter) => number | null} input.left
 * quantos meses faltam, perguntado a fachada
 * @param {{ mandatory: number, room: number }} input.inherited a heranca, para a posse
 * @param {Record<string, string>} input.answered o que o jogador ja MARCOU neste mes
 * @param {ReadonlyArray<{ id: string, label: string, reads?: string }>} [input.lobbies]
 * quem pode exigir. ⚠ `reads` entra aqui porque o SENTIDO da exigencia depende dele —
 * quem lê a divida pede corte, e os outros pedem verba — e guardar o sentido na carta
 * daria dois lugares dizendo a mesma coisa
 * @param {{ price: number, removal: number, seats: number,
 * lobbies?: ReadonlyArray<{ id: string, pressure: number, boil: number, share: number }> }}
 * [input.siege] o cerco e a caldeira, perguntados ao motor. A carta do processo cita o
 * quorum do afastamento e o quanto a cadeira encareceu; a da fervura cita a pressao, o
 * ponto e a fatia. ⚠ Os cinco sao do motor: escritos a mao nesta view, mentiriam no dia
 * em que qualquer um deles mudasse
 * @param {ReadonlyArray<{ id: string, label: string }>} [input.parties]
 * @param {"senhor" | "senhora"} [input.treatment] como o jogador quer ser tratado as bancadas, para o
 * @param {ReadonlyArray<{ id: string, label: string }>} [input.segments] as classes, para o
 * @param {{ base: number, majority: number }} [input.chamber] as cadeiras que respondem ao
 * governo e o quorum simples. ⚠ Ela entrou com a carta da MINORIA, e os
 * dois numeros vem prontos: a soma das bancadas leais e conta de `baseCount`, e refaze-la
 * aqui daria a esta carta um placar diferente do que a Trindade mostra ao lado dela
 * @returns {Dispatch[]}
 */
export function describeMail({
  mail,
  people,
  left,
  inherited,
  answered,
  lobbies = [],
  siege,
  chamber = { base: 0, majority: 0 },
  segments = [],
  parties = [],
  /* ⚠ COMO O JOGADOR QUER SER TRATADO, e ele escolhe junto com o nome. Sem isto a carta
     dizia "o senhor" em metade das partidas para uma presidenta. Ver `addressed`. */
  treatment = DEFAULT_TREATMENT,
}) {
  const by = (/** @type {string} */ office) =>
    people.find(person => person.office === office) ?? null;

  /* O NOME DO GRUPO SAI DO CATALOGO, e nao de uma tabela nesta view: um quinto lobby
     apareceria aqui como um id cru, e id cru na tela e o defeito que `identity` existe para
     impedir do outro lado. */
  const nameOf = (/** @type {string | null} */ id) =>
    lobbies.find(lobby => lobby.id === id)?.label ?? "";

  /* QUEM PEDE CORTE, e nao verba. Ver a nota no caso `demand`. */
  const cuts = new Set(lobbies.filter(lobby => lobby.reads === "debt").map(lobby => lobby.id));

  return mail
    .map(letter => {
      const subject = letter.subject ?? "";

      /* Nove lugares para digitar a mesma chave e nove lugares para esquece-la — e uma carta
         sem id na bandeja de duas colunas nao quebra nada: ela simplesmente nunca abre quando
         clicada. */
      const paper = (/** @type {Omit<Dispatch, "id" | "month">} */ spec) => ({
        ...spec,
        id: letter.id,
        month: letter.month,
        /* ⚠ `treatment` NAO VIAJA MAIS COM A CARTA: ele existia para o vocativo, e o vocativo
           saiu. Quem trata o presidente por senhor ou senhora sao as FRASES do corpo, e elas
           se montam aqui, onde o tratamento ja esta. */
        /* ⚠ `weight` NAO VIAJA MAIS COM A CARTA. Ele so alimentava a segunda tarja da coluna,
           que saiu por pintar do mesmo vermelho do prazo vencido; e o campo continuar chegando
           aqui sem ninguem le-lo seria dado morto — o defeito que este projeto persegue dos
           dois lados. Quem diz que o movimento foi grande agora e a propria pastilha. */
      });

      switch (letter.kind) {
        /* ⚠ A CARTA DE POSSE ABRE O MANDATO, e ela e a unica que nasce com o estado. */
        case "posse":
          return paper({
            from: by("chief"),
            subject: addressed(UI.inbox.inauguration, treatment),
            body:
              `<div class="letter__lines">` +
              `<span>${escapeHtml(addressed(UI.inbox.inheritedLead, treatment))}</span>` +
              `</div>`,
            /* ⚠ `money`, E NAO `seats`. */
            annex:
              cardHtml(UI.inbox.inheritedMandatory, `<b>${money(inherited.mandatory)}</b>`) +
              cardHtml(UI.inbox.inheritedRoom, `<b>${money(inherited.room)}</b>`),
            action: UI.inbox.seeMonth,
            target: "congress",
          });

        case "tabled":
          return paper({
            from: by("speaker"),
            subject: `${UI.inbox.tabled}: ${subject}`,
            body: `<div class="letter__lines"><span>${escapeHtml(UI.inbox.tabledBody)}</span></div>`,
          });

        /* ⚠ A EMENDA E A UNICA CARTA QUE PERGUNTA, e por isso ela e a unica com prazo, com
           tarja e com botao que decide. */
        case "reported":
          return paper({
            from: by("rapporteur"),
            subject: `${UI.inbox.reported}: ${subject}`,
            due: left(letter),
            body:
              `<div class="letter__lines">` +
              /* ⚠ O JABUTI E DITO PELO NOME. */
              (letter.saved
                ? `<span>${escapeHtml(UI.inbox.reportedSaved)} ` +
                  `<b>${escapeHtml(letter.saved)}</b></span>`
                : "") +
              `<span>${escapeHtml(outcomeOf(letter))}</span>` +
              `</div>`,
            choices:
              letter.answer === null
                ? choicesHtml(letter.id, answered[letter.id] ?? "")
                : undefined,
          });

        /* ── A CHANTAGEM — a segunda pergunta do jogo, e a primeira que vem de FORA da
           tramitacao ───────────────────────────────────────────────────────── ⚠ ELA NAO TEM
           SINETE, e a ausencia e a modelagem: um lobby nao e uma PESSOA. */
        case "demand": {
          /* ⚠ O SENTIDO DA EXIGENCIA VEM DO GRUPO, e nao de um campo na carta: quem lê a
             DIVIDA pede corte, e os outros pedem verba. */
          const cutting = cuts.has(letter.from ?? "");

          return paper({
            from: null,
            subject: `${escapeHtml(nameOf(letter.from))}: ${subject}`,
            due: left(letter),
            body:
              `<div class="letter__lines">` +
              /* O QUE ELE QUER, EM NUMERO. */
              `<span>${escapeHtml(cutting ? UI.inbox.demandCutBody : UI.inbox.demandBody)} ` +
              `<b data-numeric>${seats(letter.level ?? 0)}</b></span>` +
              `<span>${escapeHtml(outcomeOf(letter))}</span>` +
              `</div>`,
            choices:
              letter.answer === null
                ? choicesHtml(
                    letter.id,
                    answered[letter.id] ?? "",
                    cutting ? UI.inbox.demandCutChoices : UI.inbox.demandChoices,
                  )
                : undefined,
          });
        }

        /* ⚠ A GAVETA NAO TEM REMETENTE, e a ausencia e a informacao: ninguem escreve para
           avisar que engavetou. */
        case "forgotten":
          return paper({
            from: null,
            subject: `${UI.inbox.forgotten}: ${subject}`,
            body: `<div class="letter__lines"><span>${escapeHtml(UI.inbox.forgottenBody)}</span></div>`,
          });

        /* ⚠ AS DUAS ERAM AS UNICAS CARTAS DO JOGO COM CORPO VAZIO, e a medicao de as pegou:
           numa folha que estica ate 630px, `body: ""` produz cabecalho, assunto e 430px de
           papel em branco. */
        case "passed":
        case "rejected":
          return paper({
            from: null,
            subject: `${letter.kind === "passed" ? UI.inbox.passedBill : UI.inbox.rejectedBill}: ${subject}`,
            body:
              `<div class="letter__lines"><span>` +
              `${escapeHtml(letter.kind === "passed" ? UI.inbox.passedBillBody : UI.inbox.rejectedBillBody)}` +
              `</span></div>`,
            action: letter.kind === "passed" ? UI.inbox.passedBillAction : undefined,
            target: letter.kind === "passed" ? "estado" : undefined,
          });

        /* ── OS TRES RELATORIOS DO MES ────────────────────────────────────── ⚠ ELES CHEGAM
           POR TEMPO, e nao por evento, e sao a unica especie assim. */
        case "street":
        case "seats":
        case "vault":
          return paper({
            from: by("chief"),
            subject: headlineOf(letter),
            body: reportBody(letter, segments, chamber, treatment),
            annex: annexHtml(letter, segments, parties),
          });

        /* ── O MUNDO SE MEXENDO SOZINHO ───────────────────────────────────── ⚠ AS TRES SAO
           TRAVESSIA, e nao estado, e as tres sao AVISO: nao ha o que responder a uma
           aritmetica. */
        case "ceiling":
          return paper({
            from: by("chief"),
            subject: UI.inbox.ceilingSubject,
            body:
              `<div class="letter__lines">` +
              `<span>${escapeHtml(UI.inbox.ceilingBody)}</span>` +
              `<span>${escapeHtml(UI.inbox.ceilingNote)} ` +
              `<b data-numeric>${money(inherited.room)}</b></span>` +
              `</div>`,
          });

        case "minority":
          return paper({
            from: by("leader"),
            subject: UI.inbox.minoritySubject,
            body:
              `<div class="letter__lines">` +
              `<span>${escapeHtml(UI.inbox.minorityBody)}</span>` +
              `</div>`,
            annex:
              cardHtml(
                UI.cabinet.baseLine,
                `<b>${seats(chamber.base)}</b><small>${escapeHtml(UI.inbox.minorityNote)}</small>`,
              ) + cardHtml(UI.inbox.majority, `<b>${seats(chamber.majority)}</b>`),
            action: UI.cabinet.congressAction,
            target: "congress",
          });

        case "boiling": {
          /* O GRUPO INTEIRO VEM DA CALDEIRA, e nao de uma tabela nesta view: pressao, ponto
             de fervura e fatia sao do motor, e a frase se monta em volta deles. */
          const group = (siege?.lobbies ?? []).find(item => item.id === subject) ?? null;
          return paper({
            from: by("chief"),
            /* ⚠ O NOME VEM DEPOIS DO VERBO, e nao antes: assim a frase nao concorda com ele. */
            subject: `${UI.inbox.boilingSubject} ${nameOf(subject) || subject}`,
            body:
              `<div class="letter__lines">` +
              `<span>${escapeHtml(UI.inbox.boilingBody)}</span>` +
              `</div>`,
            ...(group
              ? {
                  annex:
                    cardHtml(
                      UI.inbox.boilingPressure,
                      `<b>${seats(group.pressure)}</b>` +
                        `<small>${escapeHtml(UI.inbox.boilingNote)} ${seats(group.boil)}</small>`,
                    ) +
                    cardHtml(
                      UI.inbox.boilingWeight,
                      group.share > 0
                        ? `<b>${percent(group.share)}</b>`
                        : `<b>${escapeHtml(UI.inbox.boilingNoWeight)}</b>`,
                    ),
                }
              : {}),
          });
        }

        /* ── O CERCO FALANDO ──────────────────────────────────────────────── ⚠ AS DUAS SAO
           AVISO, e nao pergunta: a resposta ao cerco nao se da na carta, ela se da no
           Congresso, comprando a cadeira que ficou mais cara. */
        case "rupture":
          return paper({
            from: by("chief"),
            subject: ruptureText(UI.inbox.ruptureSubject, subject) ?? UI.inbox.ruptureFallback,
            body:
              `<div class="letter__lines">` +
              `<span>${escapeHtml(addressed(ruptureText(UI.inbox.ruptureBody, subject) ?? "", treatment))}</span>` +
              `</div>`,
            /* ⚠ A REGRA DO IMPEACHMENT E ANEXO, e nao rodape de prosa: ela e a mesma frase em
               toda ruptura, e como segunda linha do corpo ela era lida uma vez e ignorada
               depois — que e o defeito que a linha "nenhuma ruptura aberta" ja pagou. */
            annex: cardHtml(UI.inbox.ruptureLegend, `<b>${escapeHtml(UI.inbox.ruptureNote)}</b>`),
          });

        case "siege":
          return paper({
            from: by("chief"),
            subject: UI.inbox.siegeSubject,
            body:
              `<div class="letter__lines">` +
              `<span>${escapeHtml(UI.inbox.siegeBody)}</span>` +
              /* ⚠ OS DOIS NUMEROS VEM DO MOTOR, e a frase e montada em volta deles. */
              (siege
                ? `<span>${escapeHtml(UI.inbox.siegeVote)} ` +
                  `<b data-numeric>${seats(siege.removal)}</b> ` +
                  `${escapeHtml(UI.inbox.siegeOf)} <b data-numeric>${seats(siege.seats)}</b>. ` +
                  `${escapeHtml(UI.inbox.siegePrice)} ` +
                  `<b data-numeric>${seats(siege.price)}×</b>.</span>`
                : "") +
              `</div>`,
            action: UI.inbox.siegeAction,
            target: "congress",
          });

        default:
          return null;
      }
    })
    .filter(part => part !== null);
}

/**
 * QUAL DAS TRES RUPTURAS ESCREVEU.
 *
 * @param {Record<string, string>} texts
 * @param {string} id
 * @returns {string | undefined}
 */
function ruptureText(texts, id) {
  return Object.hasOwn(texts, id) ? texts[id] : undefined;
}

/**
 * O QUE A CARTA DIZ SOBRE O PROPRIO DESFECHO.
 *
 * @param {import("../../state/state.mjs").Letter} letter
 * @returns {string}
 */
function outcomeOf(letter) {
  /* ⚠ A CHANTAGEM INVERTE O SILENCIO, e a tela precisa saber disso — foi um defeito medido no
     dia em que a carta nasceu: ela imprimia "se voce nao responder, a emenda vale", que e a
     frase da tramitacao, numa carta em que o silencio RECUSA. */
  const spurns = letter.kind === "demand";

  switch (letter.answer) {
    case "accept":
      return spurns ? UI.inbox.conceded : UI.inbox.accepted;
    case "block":
      return spurns ? UI.inbox.refused : UI.inbox.blocked;
    case "silence":
      return spurns ? UI.inbox.refused : UI.inbox.silenced;
    default:
      return spurns ? UI.inbox.spiteWarns : UI.inbox.silenceWarns;
  }
}

/**
 * AS DUAS SAIDAS, e nenhuma e de graca.
 *
 * @param {string} id
 * @param {string} chosen o que ja esta marcado, se algo estiver
 * @returns {string}
 */
function choicesHtml(id, chosen, texts = UI.inbox.amendmentChoices) {
  const button = (
    /** @type {string} */ answer,
    /** @type {string} */ label,
    /** @type {string} */ cost,
  ) =>
    `<button class="letter__choice" type="button" ` +
    `aria-pressed="${chosen === answer}" ` +
    `data-letter="${escapeHtml(id)}" data-answer="${escapeHtml(answer)}">` +
    `<b>${escapeHtml(label)}</b>` +
    `<span class="letter__cost">${escapeHtml(cost)}</span>` +
    `</button>`;

  return (
    `<div class="letter__choices">` +
    button("accept", texts.accept, texts.acceptCost) +
    button("block", texts.block, texts.blockCost) +
    `</div>`
  );
}

/* A caixa nunca foi um bloco de texto passivo: ela é uma carta *esticada** pela coluna
   vizinha, que empilha quatro resumos e fecha nos mesmos 899px. */

/**
 * Uma linha que montasse o próprio assunto seria a oitava ocorrência da família de defeito
 * mais cara deste projeto.
 *
 * @param {Dispatch} dispatch
 * @param {boolean} open
 * @param {boolean} read se o jogador ja abriu esta carta alguma vez
 * @returns {string}
 */
function rowHtml(dispatch, open, read) {
  const urgency = urgencyOf(dispatch.due);

  /* ⚠ O MÊS ENTROU NO ÍNDICE PORQUE A CAPTURA MOSTROU DUAS LINHAS IDÊNTICAS. */
  return (
    `<li>` +
    `<button class="tray__row" type="button" ` +
    `data-dispatch="${escapeHtml(dispatch.id)}"` +
    /* ⚠ A TARJA DA ESQUERDA TEM UM DONO SO, E ELE E O PRAZO. Ela teve dois antes, e o
       segundo pintava do MESMO vermelho do prazo vencido: um aviso sem prazo nenhum aparecia
       na coluna com a marca de "vence agora". A prosa do nao-lido, dez linhas abaixo na folha,
       ja proibia isso com todas as letras — "a esquerda ja significa PRAZO em tres cores, e
       uma quarta cor ali faria o jogador ler urgencia onde ha novidade". Quem carrega o peso
       agora e a pastilha de variacao, que diz quanto andou e para que lado. */
    (urgency ? ` data-urgency="${urgency}"` : "") +
    (open ? ` aria-current="true"` : "") +
    /* ⚠ O NAO LIDO E A UNICA COISA QUE FALTAVA PARA ISTO SER UMA BANDEJA, e a referencia e o
       inbox do Football Manager: la o peso visual principal do indice e o item que ainda nao
       foi aberto. */
    (read ? "" : ` data-unread="true"`) +
    `>` +
    `<b class="tray__subject">${escapeHtml(dispatch.subject)}</b>` +
    /* O REMETENTE VEM ABAIXO DO ASSUNTO, e não acima como no ofício aberto: numa linha de
       índice o olho procura O QUE é antes de QUEM é, porque ele está escolhendo o que ler. */
    /* Repetida em oito linhas, ela roubava largura de 208px do unico campo que decide o
       clique. */
    /* ⚠ O REMETENTE SAIU E VOLTOU NO MESMO DIA, e as duas decisoes estao certas porque a PECA
       mudou entre elas. */
    `<span class="tray__line">` +
    (dispatch.from ? `<span class="tray__from">${escapeHtml(dispatch.from.name)}</span>` : "") +
    (urgency
      ? `<span class="tray__due" data-numeric>${escapeHtml(dueLabel(dispatch.due ?? null))}</span>`
      : "") +
    `</span>` +
    `</button>` +
    `</li>`
  );
}

/* ⚠ ELE E MEDIDO, e nao escolhido: a bandeja fecha em 630px numa janela de 980, e uma linha
   do indice mede 50px mais 4 de respiro. */
const TRAY_CAPACITY = 7;

/**
 * O QUE CABE NA PILHA, com a pergunta protegida.
 *
 * @param {ReadonlyArray<Dispatch>} dispatches ja ordenados por urgencia
 * @param {Dispatch} current o oficio aberto, que nunca some
 * @param {number} capacity
 * @returns {ReadonlyArray<Dispatch>}
 */
function fitted(dispatches, current, capacity) {
  if (dispatches.length <= capacity) return dispatches;

  /* AS PERGUNTAS PRIMEIRO, e todas: ver a trava na prosa acima. */
  const asking = dispatches.filter(item => item.due !== null && item.due !== undefined);
  const rest = dispatches.filter(item => !asking.includes(item));

  /* ⚠ O ABERTO ENTRA MESMO SE ELE FOR UM AVISO VELHO. */
  const room = Math.max(0, capacity - asking.length);
  const kept = rest.slice(0, room);
  if (!asking.includes(current) && !kept.includes(current)) kept.push(current);

  /* A ORDEM ORIGINAL SOBREVIVE ao corte: reordenar aqui faria a pilha embaralhar sozinha no
     mes em que uma carta caisse fora. */
  const staying = new Set([...asking, ...kept]);
  return dispatches.filter(item => staying.has(item));
}

/**
 * O CORPO DO RELATORIO, ESCRITO COMO OFICIO.
 *
 * `attach`, que SONDA passou a produzir hoje. Uma frase sem número atrás seria o texto
 * opinando, e isso continua recusado mesmo com as ADRs reabertas — o que o projeto proíbe
 * não é o modelo escrever, é a tela AFIRMAR o que o motor não sabe.
 * @param {import("../../state/state.mjs").Letter} letter
 * @param {ReadonlyArray<{ id: string, label: string }>} segments
 * @param {{ base: number, majority: number }} chamber
 * @returns {string}
 */
function reportBody(
  letter,
  segments,
  chamber,
  /** @type {"senhor" | "senhora"} */ treatment = DEFAULT_TREATMENT,
) {
  const was = letter.was ?? 0;
  const now = letter.now ?? 0;
  const moved = Math.abs(now - was);
  const way = now >= was ? UI.inbox.pollUp : UI.inbox.pollDown;

  /** @param {string} text */
  const line = text => `<span>${text}</span>`;

  if (letter.kind === "seats") {
    return (
      `<div class="letter__lines">` +
      line(
        `${escapeHtml(UI.inbox.seatsBody)} <b data-numeric>${seats(now)}</b> ` +
          `${escapeHtml(UI.inbox.seatsOf)} <b data-numeric>${seats(chamber.majority)}</b>. ` +
          `<b data-numeric>${seats(moved)}</b> ` +
          `${escapeHtml(moved === 1 ? UI.inbox.pollPoint : UI.inbox.pollPoints)} ` +
          `${escapeHtml(way)}`,
      ) +
      line(escapeHtml(addressed(UI.inbox.seatsHint, treatment))) +
      `</div>`
    );
  }

  if (letter.kind === "vault") {
    return (
      `<div class="letter__lines">` +
      line(
        `${escapeHtml(UI.inbox.vaultBody)} <b data-numeric>${money(now)}</b>, ` +
          `${escapeHtml(way.replace(".", ""))} <b data-numeric>${money(was)}</b>.`,
      ) +
      line(escapeHtml(UI.inbox.vaultHint)) +
      `</div>`
    );
  }

  /* ⚠ O CORPO FICOU COM A MANCHETE, E SO ELA. As duas leituras de analise — o que sustenta e o
     que puxa para baixo — desceram para cards: elas sao ANEXO, e nao prosa, e
     lidas como terceiro e quarto paragrafo elas obrigavam o jogador a ler tres linhas para
     saber se precisava se preocupar. Ver `pollCards`. */
  return (
    `<div class="letter__lines">` +
    line(
      `${escapeHtml(UI.inbox.pollClosed)} <b data-numeric>${seats(now)}%</b> ` +
        `${escapeHtml(UI.inbox.pollGood)} — <b data-numeric>${seats(moved)}</b> ` +
        `${escapeHtml(moved === 1 ? UI.inbox.pollPoint : UI.inbox.pollPoints)} ` +
        `${escapeHtml(way)}`,
    ) +
    `</div>`
  );
}

/**
 * OS DOIS CARDS DE ANALISE DA PESQUISA — o que segura o governo, e o que o puxa.
 *
 * @param {Record<string, number>} data
 * @param {ReadonlyArray<{ id: string, label: string }>} segments
 * @returns {string}
 */
function pollCards(data, segments) {
  const notes = ANNEX_NOTES;

  /* ⚠ A NOTA QUE SUSTENTA E A MAIOR JA PESADA, e nao a maior nota crua: o que segura o governo
     numa classe e o produto da nota pelo peso DELA. */
  let holds = null;
  for (const segment of segments) {
    for (const note of notes) {
      const value = data[`${segment.id}.${note}`] ?? 0;
      if (!holds || value > holds.value) holds = { value, note, segment: segment.label };
    }
  }

  /* A NOTA CRUA SE RECUPERA DE UMA CLASSE COM PESO CONHECIDO? */
  let weakest = null;
  for (const note of notes) {
    const total = segments.reduce((sum, s) => sum + (data[`${s.id}.${note}`] ?? 0), 0);
    if (!weakest || total < weakest.total) weakest = { total, note };
  }

  return (
    (holds
      ? cardHtml(
          /* ⚠ SEM `addressed`: a legenda deixou de tratar o presidente por "o senhor" quando
             virou rotulo de card — "O QUE SUSTENTA O SENHOR" quebrava em duas linhas e
             desalinhava o valor do card vizinho. Um rotulo nomeia a coisa, e nao interpela. */
          UI.inbox.pollHolds,
          `<b>${escapeHtml(labelOf(UI.inbox.annexNote, holds.note))}</b>` +
            `<small>${escapeHtml(holds.segment)}</small>`,
        )
      : "") +
    (weakest
      ? /* ⚠ SEM QUALIFICADOR: "nas tres faixas de renda" e sempre a mesma frase, por
           construcao — a nota mais fraca e a que soma menos SOMANDO as tres. Frase que nao
           varia nao e leitura, e legenda. */
        cardHtml(
          UI.inbox.pollDrags,
          `<b>${escapeHtml(labelOf(UI.inbox.annexNote, weakest.note))}</b>`,
        )
      : "")
  );
}

/**
 * UM CARD DE ANEXO — legenda em cima, leitura embaixo.
 *
 * @param {string} legend
 * @param {string} body ja em HTML
 * @returns {string}
 */
function cardHtml(legend, body) {
  return (
    `<section class="annex">` +
    `<h5 class="annex__legend">${escapeHtml(legend)}</h5>` +
    `<p class="annex__read">${body}</p>` +
    `</section>`
  );
}

/**
 * A MANCHETE — verbo e NUMERO, como um despacho.
 *
 * @param {import("../../state/state.mjs").Letter} letter
 * @returns {string}
 */
function headlineOf(letter) {
  const was = letter.was ?? 0;
  const now = letter.now ?? 0;
  const way = now >= was ? "rose" : "fell";
  const verb = labelOf(UI.inbox.headline, `${letter.kind}.${way}`);

  /* As outras duas falam no NIVEL, porque e o nivel que decide — 21% de aprovacao e R$ 13,2
     bi sao o que o presidente tem, e nao o quanto ele mudou. */
  if (letter.kind === "seats") return `${verb} ${seats(now)} ${UI.inbox.headlineSeats}`;
  if (letter.kind === "vault") return `${verb} ${money(now)}`;
  return `${verb} ${seats(now)}%`;
}

/* Ela e a ordem de `SONDA`, e nao uma reordenacao por tamanho: uma tabela cujas colunas
   trocam de lugar conforme o mes deixa de ser tabela e vira quebra-cabeca. */
const ANNEX_NOTES = /** @type {const} */ (["prices", "jobs", "services", "safety", "economy"]);

/**
 * O ANEXO DO CAIXA — de onde vem o que sobra.
 *
 * @param {Record<string, number>} data
 * @returns {string}
 */
function vaultAnnex(data) {
  const rows = ["revenue", "mandatory", "ceiling", "allowance"]
    .map(
      key =>
        `<tr><th scope="row">${escapeHtml(labelOf(UI.inbox.annexVaultRow, key))}</th>` +
        `<td data-numeric${key === "allowance" ? ' data-top="true"' : ""}>` +
        `${money(data[key] ?? 0)}</td></tr>`,
    )
    .join("");

  return (
    `<section class="annex">` +
    `<h5 class="annex__legend">${escapeHtml(UI.inbox.annexVault)}</h5>` +
    `<div class="annex__scroll"><table class="annex__table annex__table--pairs">` +
    `<tbody>${rows}</tbody></table></div>` +
    `</section>`
  );
}

/**
 * O ANEXO DO BALANCO — as tres leituras do mes, antes e depois.
 *
 * @param {import("../../application/turn.mjs").Balance} balance
 * @returns {string}
 */
function balanceAnnex(balance) {
  /* AS TRES NA ORDEM DA CARTA, e nao por tamanho: o corpo do oficio le rua, base e caixa
     nessa ordem, e uma tabela que reordenasse obrigaria o olho a reencontrar cada uma. */
  const rows = [
    { key: "street", was: `${seats(balance.streetWas)}%`, now: `${seats(balance.streetNow)}%` },
    { key: "seats", was: seats(balance.seatsWas), now: seats(balance.seatsNow) },
    { key: "vault", was: money(balance.roomWas), now: money(balance.roomNow) },
  ]
    .map(
      row =>
        `<tr><th scope="row">${escapeHtml(labelOf(UI.inbox.annexBalanceRow, row.key))}</th>` +
        `<td data-numeric>${escapeHtml(row.was)}</td>` +
        `<td data-numeric data-top="true">${escapeHtml(row.now)}</td></tr>`,
    )
    .join("");

  return (
    `<section class="annex">` +
    `<h5 class="annex__legend">${escapeHtml(UI.inbox.annexBalance)}</h5>` +
    `<div class="annex__scroll"><table class="annex__table">` +
    `<thead><tr><td></td>` +
    `<th scope="col">${escapeHtml(UI.inbox.annexBalanceWas)}</th>` +
    `<th scope="col">${escapeHtml(UI.inbox.annexBalanceNow)}</th>` +
    `</tr></thead>` +
    `<tbody>${rows}</tbody></table></div>` +
    `</section>`
  );
}

/**
 * ⚠ E ELE SO MOSTRA QUEM SE MOVEU, porque uma tabela de onze linhas num oficio de 435px e o
 * Diario Oficial dentro de uma carta — e o risco R2 que este projeto ja nomeou.
 *
 * @param {Record<string, number>} data
 * @param {ReadonlyArray<{ id: string, label: string }>} parties
 * @returns {string}
 */
function seatsAnnex(data, parties) {
  const moved = parties
    .map(party => ({
      label: party.label,
      seats: data[`${party.id}.seats`] ?? 0,
      was: data[`${party.id}.was`] ?? 0,
      now: data[`${party.id}.now`] ?? 0,
    }))
    .filter(row => Math.abs(row.now - row.was) >= 0.5)
    .sort((a, b) => Math.abs(b.now - b.was) - Math.abs(a.now - a.was));

  if (moved.length === 0) return "";

  const rows = moved
    .map(
      row =>
        `<tr><th scope="row">${escapeHtml(row.label)}</th>` +
        `<td data-numeric>${seats(row.seats)}</td>` +
        `<td data-numeric>${seats(row.now)}</td>` +
        `<td data-numeric data-top="true">${signed(row.now - row.was)}</td></tr>`,
    )
    .join("");

  return (
    `<section class="annex">` +
    `<h5 class="annex__legend">${escapeHtml(UI.inbox.annexSeats)}</h5>` +
    `<div class="annex__scroll"><table class="annex__table">` +
    `<thead><tr><th></th>` +
    `<th>${escapeHtml(UI.inbox.annexSeatsCol)}</th>` +
    `<th>${escapeHtml(UI.inbox.annexMoodCol)}</th>` +
    `<th>${escapeHtml(UI.inbox.annexMoveCol)}</th>` +
    `</tr></thead><tbody>${rows}</tbody></table></div>` +
    `</section>`
  );
}

/**
 * Multiplicar nota por peso aqui daria dois lugares fazendo a conta, e o segundo divergiria
 * no dia em que um peso mudasse — que e o dia em que o anexo precisa estar certo.
 *
 * como responder: SONDA calculava as cinco notas, pesava cada uma de forma diferente por
 * classe, subtraia a traicao e o desgaste — e devolvia so o numero final. A referencia e
 * o Democracy 4, e ela e do responsavel: la o jogo inteiro e a cadeia causal visivel.
 * @param {import("../../state/state.mjs").Letter} letter
 * @param {ReadonlyArray<{ id: string, label: string }>} segments
 * @param {ReadonlyArray<{ id: string, label: string }>} parties
 * @returns {string}
 */
function annexHtml(letter, segments, parties) {
  const data = letter.attach;
  if (!data) return "";

  if (letter.kind === "vault") return vaultAnnex(data);
  if (letter.kind === "seats") return seatsAnnex(data, parties);
  if (segments.length === 0) return "";

  const rows = segments
    .map(segment => {
      const values = ANNEX_NOTES.map(note => data[`${segment.id}.${note}`] ?? 0);
      const total = values.reduce((sum, value) => sum + value, 0);
      /* ⚠ AS CELULAS SAO REPARTIDAS, e nao arredondadas uma a uma: o total impresso e a soma
         cheia arredondada, e cinco arredondamentos independentes nao fecham nele. */
      const cells = apportion(values);
      /* ⚠ A MAIOR DA LINHA GANHA PESO, e e ela que faz a tabela ser legivel de relance: sem
         destaque, cinco numeros por linha sao cinco numeros.
         Ela sai do valor CHEIO, e nao da celula repartida: com empate impresso o peso fica na
         que de fato e maior, e a reparticao nunca inverte a ordem — quem tem piso maior nunca
         imprime menos que quem tem piso menor. */
      const top = Math.max(...values);

      return (
        `<tr>` +
        `<th scope="row">${escapeHtml(segment.label)}</th>` +
        values
          .map(
            (value, index) =>
              `<td data-numeric${value === top && value > 0 ? ' data-top="true"' : ""} ` +
              `title="${escapeHtml(labelOf(UI.inbox.annexNote, ANNEX_NOTES[index] ?? ""))}">` +
              `${seats(cells[index] ?? 0)}</td>`,
          )
          .join("") +
        `<td data-numeric class="annex__sum">${seats(total)}</td>` +
        `</tr>`
      );
    })
    .join("");

  return (
    pollCards(data, segments) +
    `<section class="annex" data-wide="true">` +
    `<h5 class="annex__legend">${escapeHtml(UI.inbox.annexLegend)}</h5>` +
    `<div class="annex__scroll">` +
    `<table class="annex__table">` +
    `<thead><tr><th></th>` +
    ANNEX_NOTES.map(note => `<th>${escapeHtml(labelOf(UI.inbox.annexNote, note))}</th>`).join("") +
    `<th>${escapeHtml(UI.inbox.annexTotal)}</th></tr></thead>` +
    `<tbody>${rows}</tbody>` +
    `</table>` +
    `</div>` +
    `</section>`
  );
}

/**
 * A BANDEJA INTEIRA — e ela devolve string vazia quando não há carta nenhuma.
 *
 * @param {object} input
 * @param {ReadonlyArray<Dispatch>} input.dispatches
 * @param {string | null} input.open o id do ofício que o jogador abriu
 * @param {ReadonlyArray<string>} [input.seen] os ids que ele já abriu alguma vez
 * @param {number} [input.capacity] quantas linhas cabem sem a coluna rolar
 * @returns {string}
 */
export function trayHtml({ dispatches, open, seen = [], capacity = TRAY_CAPACITY }) {
  if (dispatches.length === 0) return "";

  const current = dispatches.find(item => item.id === open) ?? dispatches[0];
  if (!current) return "";

  const shown = fitted(dispatches, current, capacity);
  const read = new Set(seen);

  return (
    `<div class="tray">` +
    /* ⚠ E O MATERIAL DE VERDADE FOI TENTADO AQUI E REPROVOU NA MEDICAO. */
    `<ul class="tray__list">` +
    /* Quem decide qual carta abre e esta funcao — `open` e uma preferencia, e o fallback e a
       primeira da lista —, entao qualquer outro lugar que tentasse marcar a aberta como lida
       teria de REFAZER essa decisao, e divergiria dela no mes em que a ordem de urgencia
       mudasse. */
    shown
      .map((item, index) => {
        const before = shown[index - 1];
        const divider =
          !before || before.month !== item.month
            ? `<li class="tray__month">${escapeHtml(monthLabel(item.month))}</li>`
            : "";
        return (
          divider +
          rowHtml(item, item.id === current.id, read.has(item.id) || item.id === current.id)
        );
      })
      .join("") +
    `</ul>` +
    `<div class="tray__open">${letterHtml({ ...current, month: current.month })}</div>` +
    `</div>`
  );
}
