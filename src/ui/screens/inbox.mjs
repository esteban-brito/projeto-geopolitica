/* A CAIXA DE ENTRADA — a primeira carta de verdade. */

import { escapeHtml } from "../shared/html.mjs";
import { iconHtml } from "../shared/icons.mjs";
import { money, percent, seats, signed } from "../shared/format.mjs";
import { sigilHtml } from "../shared/sigil.mjs";
import {
  cardHtml,
  chamberRows,
  lineHtml,
  linesHtml,
  noteHtml,
  rupturesRows,
} from "../shared/annex.mjs";
import { monthLabel } from "../../state/state.mjs";
import { DEFAULT_TREATMENT, UI, addressed, labelOf } from "../strings.mjs";

/**
 * Esta e a familia de defeito mais cara do projeto, com sete ocorrencias medidas, e ela nasce
 * sempre igual: uma mudanca deixa uma copia para tras.
 *
 * @typedef {object} Dispatch
 * @property {string} id o mesmo id da carta no estado; e por ele que a bandeja abre
 * @property {number} month o mes em que ela chegou — e o indice PRECISA dele; ver `rowHtml`
 * @property {import("../../state/state.mjs").Letter["kind"]} [kind] a especie da carta;
 *   necessario para o indice distinguir demand, rupture e siege — os tres kinds sem prefixo
 *   no assunto. ausente na carta sintetica do mes (describeMonth)
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
  /* ⚠ ERAM TRES FAIXAS E SAO DUAS: medido em 48 meses, `left` devolve 0 ou 1 e mais nada — o
     prazo e de dois meses e a carta so aparece no mes seguinte ao que a escreveu, entao a
     faixa larga nunca foi pintada uma vez. */
  return due <= 0 ? "now" : "soon";
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
    /* ⚠ O `<span>` VAZIO CONSUMIA O VÃO DO FLEX: quatro espécies saem com `from: null` — a
       exigência, a gaveta e as duas do plenário —, e o cabeçalho delas ficava com 354px de
       faixa e 15,8% de tinta. Sem remetente não há caixa de remetente. */
    (from
      ? `<span class="letter__from">` +
        `<b class="letter__name">${escapeHtml(from.name)}</b>` +
        `<span class="letter__role">${escapeHtml(from.label)}</span>` +
        `</span>`
      : "") +
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
  return `${UI.inbox.dueIn} ${due} ${UI.inbox.month}`;
}

/* ⚠ SOMENTE OS TRÊS KINDS SEM PREFIXO NO ASSUNTO — demand, rupture e siege. Os demais já
   trazem a espécie escrita no subject ("Pautei:", "Devolvi com emenda:", "Esquecido:" etc.). */
const DISPATCH_TAG = new Map([
  ["demand", "Exigência"],
  ["rupture", "Ruptura"],
  ["siege", "Cerco"],
]);

/**
 * O que a carta faz e escolher QUAIS das leituras que o turno ja produziu merecem uma linha —
 * e a escolha e por consequencia: o que o mes decidiu, quanto ele custou, e o que a rua
 * achou.
 *
 * @param {object} input
 * @param {import("../../state/state.mjs").MonthCard} input.report
 * @param {{ name: string, office: string, label: string, reach: number, gender?: "f" | "m" } | null} input.adviser
 * @returns {Dispatch}
 */
export function describeMonth({ report, adviser }) {
  const judged = report.judged;

  const subject = judged
    ? `${judged.kind === "passed" ? UI.inbox.passed : UI.inbox.rejected}: ${judged.label}`
    : report.bill
      ? `${UI.inbox.filed}: ${report.bill}`
      : UI.report.noBill;

  /** @type {string[]} */
  const lines = [];

  /* O PLACAR, e so quando houve votacao: decreto nao tem placar, e imprimir um travessao no
     lugar do numero ja foi defeito nesta tela uma vez. */
  if (report.votes !== null) {
    lines.push(
      `<span>${escapeHtml(UI.inbox.voted)} ` +
        `<b data-numeric>${seats(report.votes)}</b> ` +
        `${escapeHtml(UI.mesa.needs)} <b data-numeric>${seats(report.quorum)}</b></span>`,
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
 * lobbies?: ReadonlyArray<{ id: string, pressure: number, boil: number, share: number }>,
 * ruptures?: ReadonlyArray<{ id: string, value: number, threshold: number, breaks: string,
 * open: boolean }> }}
 * [input.siege] o cerco e a caldeira, perguntados ao motor. ⚠ `ruptures` entrou com o bloco
 * das tres: uma ruptura sozinha nao diz se o processo esta perto, e o processo so abre com as
 * tres — a conta de cada uma e do motor, e refeita aqui divergiria no primeiro limiar mudado. A carta do processo cita o
 * quorum do afastamento e o quanto a cadeira encareceu; a da fervura cita a pressao, o
 * ponto e a fatia. ⚠ Os cinco sao do motor: escritos a mao nesta view, mentiriam no dia
 * em que qualquer um deles mudasse
 * @param {ReadonlyArray<import("../../state/state.mjs").MonthCard>} [input.months] os meses
 * fechados. ⚠ A CARTA DO PLENARIO NAO GUARDA O PROPRIO PLACAR, e ele ja mora aqui: `votes` e
 * `quorum` do cartao do MESMO mes. Ligar os dois custa um parametro; grava-lo na carta seria
 * uma segunda verdade sobre a mesma votacao
 * @param {ReadonlyArray<{ id: string, label: string }>} [input.parties]
 * @param {{ priority: ReadonlyArray<{ id: string, label: string, short: string }>,
 * fiscal: ReadonlyArray<{ id: string, label: string, short: string }>,
 * reform: ReadonlyArray<{ id: string, label: string, short: string }> }} [input.pledges] o que
 * a posse oferece, perguntado a fachada
 * @param {{ priority: string | null, fiscal: string | null, reform: string | null }}
 * [input.platform] o que ja esta marcado — do estado depois da posse, das ordens antes dela
 * @param {"senhor" | "senhora"} [input.treatment] como o jogador quer ser tratado as bancadas, para o
 * @param {ReadonlyArray<{ id: string, label: string }>} [input.segments] as classes, para o
 * @param {{ base: number, majority: number, seats: number }} [input.chamber] as cadeiras que
 * respondem ao governo, o quorum simples e o tamanho da Camara. ⚠ Ela entrou com a carta da
 * MINORIA, e os numeros vem prontos: a soma das bancadas leais e conta de `baseCount`, e
 * refaze-la aqui daria a esta carta um placar diferente do que a Trindade mostra ao lado dela.
 * ⚠ E `seats` entrou porque o 513 estava TECLADO em duas frases, com o motor tendo o numero
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
  chamber = { base: 0, majority: 0, seats: 0 },
  months = [],
  segments = [],
  parties = [],
  /* ⚠ COMO O JOGADOR QUER SER TRATADO, e ele escolhe junto com o nome. Sem isto a carta
     dizia "o senhor" em metade das partidas para uma presidenta. Ver `addressed`. */
  treatment = DEFAULT_TREATMENT,
  /* ⚠ AS OPCOES DA POSSE VEM PRONTAS DA FACHADA, e a lista de prioridade e DERIVADA la: as
     tres areas que o pais entrega piores. Monta-la aqui daria uma segunda verdade sobre onde
     o pais esta pior, e ela mentiria no dia em que uma abertura mudasse. */
  pledges = { priority: [], fiscal: [], reform: [] },
  platform = { priority: null, fiscal: null, reform: null },
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
      const paper = (/** @type {Omit<Dispatch, "id" | "month" | "kind">} */ spec) => ({
        ...spec,
        id: letter.id,
        month: letter.month,
        kind: letter.kind,
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
              `</div>` +
              pledgeHtml(
                UI.inbox.pledgePriority,
                "priority",
                pledges.priority,
                platform.priority ?? "",
              ) +
              pledgeHtml(UI.inbox.pledgeFiscal, "fiscal", pledges.fiscal, platform.fiscal ?? "") +
              pledgeHtml(UI.inbox.pledgeReform, "reform", pledges.reform, platform.reform ?? ""),
            /* ⚠ `money`, E NAO `seats`. */
            /* ⚠ O ANEXO MOSTRA SO O QUE O COFRE NAO MOSTRA, e a sobra do mes SAIU daqui: ela
               era a MESMA constante do bloco do dinheiro — `TERMOS.roomLine` nos dois —, e o
               mes 1 imprimia `R$ 14,5 bi` duas vezes a um palmo, numa tela que nao rola. A
               guarda de vocabulario forcou o literal compartilhado (o que PROVA que sao a
               mesma leitura) e ninguem perguntou se ela devia ser mostrada duas vezes. */
            /* ⚠ A SOBRA VOLTOU PARA O LADO DA OBRIGATORIA, e a retirada dela tinha razao no
               desenho antigo: ela repetia o card do Gabinete a um palmo. Num BLOCO as duas sao
               uma leitura so — o que esta preso e o que sobra —, e e essa relacao que a posse
               precisa ensinar. */
            annex: linesHtml(
              addressed(UI.inbox.blockInherited, treatment),
              lineHtml({
                who: UI.inbox.inheritedMandatory,
                value: money(inherited.mandatory),
              }) + lineHtml({ who: UI.cabinet.vaultFree, value: money(inherited.room) }),
            ),
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

          /* ⚠ GRUPO SEM NOME NAO IMPRIME DOIS PONTOS, e o assunto comecava por ": " quando o
             catalogo nao conhecia o id — a carta irma, o alarme de fervura, ja tinha defesa e
             esta nao tinha.
             ⚠ E O ESCAPE E DE QUEM PINTA: `subject` e escapado de novo em `rowHtml` e em
             `letterHtml`, entao escapar aqui pintava `&amp;` cru num nome com `&`. */
          const groupName = nameOf(letter.from) || "";

          return paper({
            from: null,
            subject: groupName ? `${groupName}: ${subject}` : subject,
            due: left(letter),
            body:
              `<div class="letter__lines">` +
              /* O QUE ELE QUER, EM NUMERO. */
              `<span>${escapeHtml(cutting ? UI.inbox.demandCutBody : UI.inbox.demandBody)} ` +
              `<b data-numeric>${seats(letter.level ?? 0)}</b></span>` +
              `<span>${escapeHtml(outcomeOf(letter))}</span>` +
              `</div>`,
            /* ⚠ MEDIDO: 374px DE PAPEL EM BRANCO E ZERO BLOCO, e ela e a pergunta que custa
               dinheiro. Quem exige ja chega inteiro em `boilerOf` — pressao, ponto de fervura e
               fatia na ruptura economica —, e a carta irma da fervura ja mostrava os tres. */
            annex: groupBlock(siege, letter.from),
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
            annex: plenaryBlock(months, letter.month),
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
            body: `<div class="letter__lines"><span>${escapeHtml(UI.inbox.ceilingBody)}</span></div>`,
            annex: linesHtml(
              addressed(UI.inbox.blockInherited, treatment),
              lineHtml({ who: UI.inbox.ceilingNote, value: money(inherited.room) }),
            ),
          });

        /* ⚠ ELE NAO E TRAVESSIA, e e a diferenca deste aviso para os tres acima: nada
           piorou — venceu um PRAZO. O calendario e quem o dispara, e por isso ele volta de dois
           em dois meses enquanto os outros chegam uma vez. */
        case "contingency":
          return paper({
            from: by("chief"),
            subject: UI.inbox.contingencySubject,
            body: `<div class="letter__lines"><span>${escapeHtml(UI.inbox.contingencyBody)}</span></div>`,
            /* ⚠ O NUMERO E O DA CARTA, e nao o de hoje — a mesma regra do alarme de minoria. */
            annex: linesHtml(
              UI.inbox.contingencyLegend,
              lineHtml({ who: UI.inbox.contingencyNote, value: `${letter.now ?? 0}%` }),
            ),
          });

        case "minority":
          return paper({
            from: by("leader"),
            subject: UI.inbox.minoritySubject,
            body:
              `<div class="letter__lines">` +
              `<span>${escapeHtml(UI.inbox.minorityBody)}</span>` +
              `</div>`,
            /* ⚠ O NUMERO E O DA CARTA, e nao o de hoje: lido do estado corrente, este alarme
               ia de 229 para 227 cadeiras entre um mes e o seguinte. `chamber` fica como
               reserva para a carta antiga, gravada antes de o alarme carregar o proprio. */
            annex: chamberBlock(
              letter.now ?? chamber.base,
              letter.was ?? chamber.majority,
              chamber.seats,
            ),
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
            /* ⚠ A PRESSAO E A DO DIA EM QUE ELE FERVEU: medido, ela ia de 70 para 75 um mes
               depois, porque a tela lia a caldeira de hoje. O bloco e o MESMO da exigencia —
               dois recados sobre o mesmo grupo nao podem ter duas leituras diferentes. */
            ...(group
              ? { annex: groupBlock(siege, subject, letter.now ?? null, letter.was ?? null) }
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
               depois — que e o defeito que a linha "nenhuma ruptura aberta" ja pagou.
               ⚠ E AS TRES ENTRARAM JUNTO: uma ruptura sozinha nao diz se o processo esta perto,
               e o processo so abre com as TRES. Medido: 367px de papel em branco aqui. */
            annex: rupturesBlock(siege) + noteHtml(UI.inbox.ruptureLegend, UI.inbox.ruptureNote),
          });

        case "siege":
          return paper({
            from: by("chief"),
            subject: UI.inbox.siegeSubject,
            body: `<div class="letter__lines"><span>${escapeHtml(UI.inbox.siegeBody)}</span></div>`,
            /* ⚠ OS TRES NUMEROS SAIRAM DA PROSA E VIRARAM BLOCO, e os tres continuam vindo do
               motor: escritos a mao aqui, mentiriam no dia em que qualquer um mudasse. Numa
               frase corrida eles eram lidos uma vez; num bloco eles ficam consultaveis. */
            ...(siege
              ? {
                  annex: linesHtml(
                    UI.inbox.blockProcess,
                    lineHtml({ who: UI.inbox.siegeVote, value: seats(siege.removal) }) +
                      lineHtml({ who: UI.inbox.siegeOf, value: seats(siege.seats) }) +
                      lineHtml({ who: UI.inbox.siegePrice, value: `${seats(siege.price)}×` }),
                  ),
                }
              : {}),
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

/**
 * AS OPCOES DE UM EIXO DA POSSE — a mesma peca das duas saidas, com a lista aberta.
 *
 * ⚠ ELA REUSA `.letter__choice`: uma segunda forma de perguntar na mesma tela e como os cinco
 * formatos de anexo nasceram.
 * ⚠ E O GESTO E OUTRO — `data-pledge` e nao `data-letter`: emprestar o atributo faria a
 * maquina da emenda receber um id de area.
 *
 * @param {string} legend
 * @param {string} axis
 * @param {ReadonlyArray<{ id: string, label: string, short: string }>} options
 * @param {string} chosen o que ja esta marcado neste mes
 * @returns {string}
 */
function pledgeHtml(legend, axis, options, chosen) {
  const buttons = options
    .map(
      option =>
        `<button class="letter__choice" type="button" ` +
        /* A PROMESSA INTEIRA VAI PARA QUEM LE POR SOM, e o botao mostra o nome: a frase por
           extenso ("entregar ordem acima do que recebi") repete o que o eixo ja disse. */
        `aria-label="${escapeHtml(option.label)}" ` +
        `aria-pressed="${chosen === option.id}" ` +
        `data-pledge="${escapeHtml(axis)}" data-choice="${escapeHtml(option.id)}">` +
        /* ⚠ A CLASSE E PROPRIA, e a captura cobrou: com a `icon` padrao o SVG nao tem tamanho
           em folha nenhuma e estica ate a caixa inteira — os tres glifos sairam com 96px e o
           nome da area por cima deles. Rail e coluna ja tem a sua, com 16 e 14px. */
        (axis === "priority" ? iconHtml(option.id, "pledge__icon") : "") +
        `<b>${escapeHtml(option.short)}</b>` +
        `</button>`,
    )
    .join("");

  return (
    `<div class="letter__pledge">` +
    `<span class="letter__axis">${escapeHtml(legend)}</span>` +
    `<div class="letter__choices">${buttons}</div>` +
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
    /* ⚠ A TAG DE ESPECIE SO APARECE NOS TRÊS KINDS SEM PREFIXO NO ASSUNTO: demand, rupture e
       siege. Os outros já trazem "Pautei:", "Devolvi com emenda:", "Esquecido:" etc. no
       subject, e uma tag lá seria repetição. */
    (dispatch.kind && DISPATCH_TAG.has(dispatch.kind)
      ? ` <span class="tray__kind">${escapeHtml(DISPATCH_TAG.get(dispatch.kind))}</span>`
      : "") +
    (urgency
      ? `<span class="tray__due" data-numeric>${escapeHtml(dueLabel(dispatch.due ?? null))}</span>`
      : "") +
    `</span>` +
    `</button>` +
    `</li>`
  );
}

/**
 * A ORDEM DA BANDEJA: o calendario, e so ele.
 *
 * ⚠ ELA ARRANCAVA A PERGUNTA DO CALENDARIO, e o preco era o mes dela nao existir: duas
 * gemeas de JAN e FEV liam a MESMA frase, byte a byte, num bloco sem data.
 *
 * ⚠ E O DESEMPATE DENTRO DO MES E A ORDEM DE ENTRADA, decidida pelo motor: alarme, pergunta,
 * exigencia, aviso, relatorio. `sort` e estavel, entao ela sobrevive.
 *
 * @param {ReadonlyArray<Dispatch>} dispatches
 * @returns {Dispatch[]}
 */
function sorted(dispatches) {
  return [...dispatches].sort((a, b) => b.month - a.month);
}

/**
 * O CORPO DO RELATORIO, ESCRITO COMO OFICIO.
 *
 * `attach`, que SONDA passou a produzir hoje. Uma frase sem número atrás seria o texto
 * opinando, e isso continua recusado mesmo com as ADRs reabertas — o que o projeto proíbe
 * não é o modelo escrever, é a tela AFIRMAR o que o motor não sabe.
 * @param {import("../../state/state.mjs").Letter} letter
 * @param {ReadonlyArray<{ id: string, label: string }>} segments
 * @param {{ base: number, majority: number, seats: number }} chamber
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
          `${escapeHtml(UI.inbox.of)} <b data-numeric>${seats(chamber.seats)}</b>` +
          `${escapeHtml(UI.inbox.seatsMajority)} ` +
          `<b data-numeric>${seats(chamber.majority)}</b>. ` +
          `<b data-numeric>${seats(moved)}</b> ` +
          /* ⚠ A UNIDADE DESTA CARTA E CADEIRA, e ela reusava o rotulo da PESQUISA: o corpo
             dizia "11 pontos" onde sao 11 cadeiras. */
          `${escapeHtml(moved === 1 ? UI.inbox.seat : UI.inbox.seats)} ` +
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

/* Ela e a ordem de `SONDA`, e nao uma reordenacao por tamanho: uma lista cujas linhas trocam
   de lugar conforme o mes deixa de ser leitura e vira quebra-cabeca. */
const ANNEX_NOTES = /** @type {const} */ (["prices", "jobs", "services", "safety", "economy"]);

/**
 * O GRUPO QUE FALA — e as duas cartas dele dizem a MESMA coisa.
 *
 * ⚠ A EXIGENCIA CHEGAVA SEM BLOCO NENHUM, com 374px de papel em branco medidos, enquanto a
 * carta irma da fervura mostrava pressao e peso do mesmo grupo. Duas cartas sobre o mesmo
 * lobby com leituras diferentes sao dois vocabularios para um assunto.
 *
 * @param {{ lobbies?: ReadonlyArray<{ id: string, pressure: number, boil: number,
 * share: number }> } | undefined} siege
 * @param {string | null} id qual grupo
 * @param {number | null} [pressure] a pressao GRAVADA na carta, quando ela a carrega
 * @param {number | null} [boil] o ponto de fervura gravado
 * @returns {string}
 */
function groupBlock(siege, id, pressure = null, boil = null) {
  const group = (siege?.lobbies ?? []).find(item => item.id === id) ?? null;
  if (!group) return "";

  /* ⚠ O NUMERO DA CARTA VENCE O VIVO, e a reserva existe para a carta gravada antes de o
     alarme passar a carregar o proprio: a pressao ia de 70 para 75 um mes depois. */
  const now = pressure ?? group.pressure;
  const point = boil ?? group.boil;

  return linesHtml(
    UI.inbox.blockGroup,
    lineHtml({
      who: UI.inbox.boilingPressure,
      value: seats(now),
      share: point > 0 ? (now / point) * 100 : 0,
      note: `${UI.inbox.boilingNote} ${seats(point)}`,
    }) +
      lineHtml({
        who: UI.inbox.boilingWeight,
        value: group.share > 0 ? percent(group.share) : UI.inbox.boilingNoWeight,
        ...(group.share > 0 ? { share: group.share * 100 } : {}),
      }),
  );
}

/**
 * O QUE FALTA PARA CADA RUPTURA ABRIR — as mesmas linhas que a coluna do Gabinete mostra.
 *
 * @param {{ ruptures?: ReadonlyArray<{ id: string, value: number, threshold: number,
 * breaks: string, open: boolean }> } | undefined} siege
 * @returns {string}
 */
function rupturesBlock(siege) {
  const ruptures = siege?.ruptures ?? [];
  if (ruptures.length === 0) return "";

  return linesHtml(UI.inbox.blockRuptures, rupturesRows(ruptures));
}

/**
 * O PLACAR DA VOTACAO — e ele ja estava no save.
 *
 * ⚠ A CARTA DO PLENARIO CHEGAVA COM UMA LINHA DE TEXTO E NENHUM NUMERO, e o cartao do MESMO
 * mes, na MESMA bandeja, guardava `votes` e `quorum` desde a versao 19. "Derrubou por 3" e
 * "derrubou por 90" pedem jogadas opostas — comprar duas bancadas, ou reescrever o texto.
 *
 * @param {ReadonlyArray<import("../../state/state.mjs").MonthCard>} months
 * @param {number} month o mes da carta
 * @returns {string}
 */
function plenaryBlock(months, month) {
  const card = months.find(item => item.month === month) ?? null;
  /* ⚠ AUSENTE E DECLARADO, e nao zero: a bandeja e os meses tem o mesmo teto, entao na ponta
     do mandato a carta sobrevive ao cartao que a explicava. Sem placar, sem bloco. */
  if (!card || card.votes === null) return "";

  const gap = card.votes - card.quorum;
  const top = Math.max(card.votes, card.quorum, 1);

  return linesHtml(
    UI.inbox.blockPlenary,
    lineHtml({
      who: UI.inbox.blockVotes,
      value: seats(card.votes),
      share: (card.votes / top) * 100,
    }) +
      lineHtml({
        who: UI.inbox.blockQuorum,
        value: seats(card.quorum),
        share: (card.quorum / top) * 100,
      }) +
      lineHtml({
        who: gap < 0 ? UI.inbox.blockMissed : UI.inbox.blockSpare,
        value: seats(Math.abs(gap)),
      }),
  );
}

/**
 * A CAMARA EM TRES LINHAS — as mesmas que a coluna do Gabinete mostra.
 *
 * @param {number} base
 * @param {number} majority
 * @param {number} seatsTotal
 * @returns {string}
 */
function chamberBlock(base, majority, seatsTotal) {
  return linesHtml(UI.inbox.blockChamber, chamberRows(base, majority, seatsTotal));
}

/**
 * O ANEXO DO CAIXA — de onde vem o que sobra.
 *
 * ⚠ AS QUATRO DIVIDEM A MESMA ESCALA — sao reais do mesmo mes —, entao a barra compara de
 * verdade: o empenhavel ao lado da receita diz de relance o quanto do bolo sobra.
 *
 * @param {Record<string, number>} data
 * @returns {string}
 */
function vaultAnnex(data) {
  const keys = ["revenue", "mandatory", "ceiling", "allowance"];
  const top = Math.max(...keys.map(key => Math.abs(data[key] ?? 0)), 1);

  return linesHtml(
    UI.inbox.annexVault,
    keys
      .map(key =>
        lineHtml({
          who: labelOf(UI.inbox.annexVaultRow, key),
          value: money(data[key] ?? 0),
          share: (Math.abs(data[key] ?? 0) / top) * 100,
        }),
      )
      .join(""),
  );
}

/**
 * O ANEXO DO BALANCO — as tres leituras do mes, e o quanto cada uma andou.
 *
 * ⚠ SEM BARRA: `%`, cadeiras e reais nao dividem escala nenhuma. O que a linha carrega e o
 * AGORA, e a variacao ao lado — que e o que a coluna "antes" dizia com o dobro de tinta.
 *
 * @param {import("../../application/turn.mjs").Balance} balance
 * @returns {string}
 */
function balanceAnnex(balance) {
  /* AS TRES NA ORDEM DA CARTA, e nao por tamanho: o corpo do oficio le rua, base e caixa
     nessa ordem, e uma lista que reordenasse obrigaria o olho a reencontrar cada uma. */
  /* ⚠ A VARIACAO ZERO NAO IMPRIME, e a captura nomeou o defeito: `signed(0)` devolve "0", e
     "21% 0" lia como um numero de duas partes. Mes parado nao tem o que dizer ao lado. */
  const moved = (/** @type {number} */ value, /** @type {number} */ digits = 0) =>
    Number(value.toFixed(digits)) === 0 ? "" : signed(value, digits);

  const rows = [
    {
      key: "street",
      value: `${seats(balance.streetNow)}%`,
      note: moved(balance.streetNow - balance.streetWas),
    },
    {
      key: "seats",
      value: seats(balance.seatsNow),
      note: moved(balance.seatsNow - balance.seatsWas),
    },
    {
      key: "vault",
      value: money(balance.roomNow),
      note: moved(balance.roomNow - balance.roomWas, 1),
    },
  ];

  return linesHtml(
    UI.inbox.annexBalance,
    rows
      .map(row =>
        lineHtml({
          who: labelOf(UI.inbox.annexBalanceRow, row.key),
          value: row.value,
          note: row.note,
        }),
      )
      .join(""),
  );
}

/* QUANTAS BANCADAS A CARTA MOSTRA. ⚠ ONZE LINHAS NUM OFICIO E O DIARIO OFICIAL DENTRO DE UMA
   CARTA, e quem lista bancada por bancada e a TELA DO CONGRESSO — o Gabinete ja recusa a mesma
   lista com essas palavras, e a carta a trazia inteira. */
const SEATS_SHOWN = 4;

/**
 * ⚠ E ELE SO MOSTRA QUEM SE MOVEU, e agora so as MAIORES: o resto vira uma linha que diz
 * quantas foram e quanto somaram, e o botao leva a tela que lista todas.
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
      move: (data[`${party.id}.now`] ?? 0) - (data[`${party.id}.was`] ?? 0),
    }))
    .filter(row => Math.abs(row.move) >= 0.5)
    .sort((a, b) => Math.abs(b.move) - Math.abs(a.move));

  if (moved.length === 0) return "";

  const shown = moved.slice(0, SEATS_SHOWN);
  const rest = moved.slice(SEATS_SHOWN);

  /* ⚠ A FRACAO SE NORMALIZA PELA MAIOR MOSTRADA, e nao por cem: um movimento tipico e de 2 a
     15% da bancada, e contra a escala cheia as quatro barras saiam como tracos de 2 a 10px —
     medido na captura. Contra a maior da lista, a comparacao usa a pista inteira. */
  const deepest = Math.max(
    ...shown.map(row => (row.seats > 0 ? Math.abs(row.move) / row.seats : 0)),
    Number.EPSILON,
  );

  const lines = shown
    .map(row =>
      lineHtml({
        who: row.label,
        value: signed(row.move),
        /* ⚠ A BARRA MEDE QUANTO DA PROPRIA BANCADA ANDOU, e nao a queda contra a maior queda:
           medido na captura, quatro bancadas caindo 2 cadeiras cada davam QUATRO BARRAS CHEIAS
           e iguais, e a peca dizia nada. Perder 2 de 14 e romper; perder 2 de 80 e ruido. */
        share: row.seats > 0 ? (Math.abs(row.move) / row.seats / deepest) * 100 : 0,
        note: `${UI.inbox.of} ${seats(row.seats)}`,
      }),
    )
    .join("");

  /* ⚠ O RESTO E DITO, E NAO OMITIDO: uma lista cortada sem dizer que cortou mente sobre o
     proprio tamanho, e o jogador leria quatro quedas onde houve nove. */
  const tail =
    rest.length === 0
      ? ""
      : lineHtml({
          who: `${UI.inbox.annexSeatsRest} ${seats(rest.length)}`,
          value: signed(rest.reduce((total, row) => total + row.move, 0)),
        });

  return linesHtml(UI.inbox.annexSeats, lines + tail);
}

/**
 * O ANEXO DA RUA — o humor de cada classe, e o que pesa nela.
 *
 * ⚠ ELE MOSTRAVA QUINZE CELULAS E MOSTRA TRES LINHAS, e o que saiu foi a nota por nota: o
 * jogador nao decide sabendo que servicos vale 13 na baixa renda. Ele decide sabendo QUAL
 * classe esta pior e o que a move — e as duas leituras de analise ja moram nos cards acima.
 *
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

  const lines = segments
    .map(segment => {
      const values = ANNEX_NOTES.map(note => ({ note, value: data[`${segment.id}.${note}`] ?? 0 }));
      const mood = values.reduce((total, item) => total + item.value, 0);
      /* A QUE MAIS PESA NA CLASSE, e ela e o que a linha diz alem do numero. */
      const top = values.reduce(
        (best, item) => (best && item.value > best.value ? item : (best ?? item)),
        values[0],
      );

      return lineHtml({
        who: segment.label,
        value: seats(mood),
        share: mood,
        note: top ? labelOf(UI.inbox.annexNote, top.note) : "",
      });
    })
    .join("");

  /* ⚠ OS DOIS DESCONTOS PESAM IGUAL EM TODA CLASSE, e por isso ficam num bloco proprio e SEM
     BARRA: sete pontos numa escala de cem sairiam como um traco, e o traco leria "quase nada"
     onde o motor tira sete. O corte de meio ponto e o das bancadas. */
  const discounts = [
    { key: "betrayal", value: data.betrayal ?? 0 },
    { key: "wear", value: data.wear ?? 0 },
  ].filter(row => row.value >= 0.5);

  return (
    pollCards(data, segments) +
    linesHtml(UI.inbox.annexLegend, lines) +
    (discounts.length === 0
      ? ""
      : linesHtml(
          UI.inbox.annexDiscounts,
          discounts
            .map(row =>
              lineHtml({
                who: labelOf(UI.inbox.annexDiscount, row.key),
                value: signed(-row.value),
              }),
            )
            .join(""),
        ))
  );
}

/**
 * A BANDEJA INTEIRA — e ela devolve string vazia quando não há carta nenhuma.
 *
 * @param {object} input
 * @param {ReadonlyArray<Dispatch>} input.dispatches
 * @param {string | null} input.open o id do ofício que o jogador abriu
 * @param {ReadonlyArray<string>} [input.seen] os ids que ele já abriu alguma vez
 * @returns {string}
 */
export function trayHtml({ dispatches, open, seen = [] }) {
  if (dispatches.length === 0) return "";

  const ordered = sorted(dispatches);
  /* ⚠ O INDICE MOSTRA TUDO, e o teto de 7 linhas caiu com ele: com blocos de mes, cortar em
     sete mostrava "MAR" com 2 das 5 cartas dele — um bloco pela metade mente sobre o mes.
     `.tray__list` e a unica peca com rolagem declarada no portao, e e ela que absorve. */
  const current = ordered.find(item => item.id === open) ?? ordered[0];
  if (!current) return "";

  const read = new Set(seen);

  return (
    `<div class="tray">` +
    /* ⚠ A LEGENDA DA BANDEJA E A MESMA PECA DA LEGENDA DE UM BLOCO — `annex__legend` —, e nao
       um titulo proprio: o Gabinete tinha um titulo de 25,6px em serifa para dizer o nome de
       uma tela que o rail ja marca, e ele saiu inteiro. */
    `<h2 class="tray__head annex__legend">${escapeHtml(UI.inbox.title)}</h2>` +
    /* ⚠ E O MATERIAL DE VERDADE FOI TENTADO AQUI E REPROVOU NA MEDICAO. */
    `<ul class="tray__list">` +
    /* Quem decide qual carta abre e esta funcao — `open` e uma preferencia, e o fallback e a
       primeira da lista —, entao qualquer outro lugar que tentasse marcar a aberta como lida
       teria de REFAZER essa decisao, e divergiria dela no mes em que a ordem de urgencia
       mudasse. */
    ordered
      .map((item, index) => {
        const before = ordered[index - 1];
        /* ⚠ O BLOCO DO MES E O UNICO DIVISOR. Quem pede resposta ja teve secao propria no
           topo, fora do calendario, e o mes dela deixava de existir: o jogador lia "abr → mar
           → abr" e chamou de bagunca. A pergunta se distingue pela tarja e pelo prazo, e nao
           pela posicao. */
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
