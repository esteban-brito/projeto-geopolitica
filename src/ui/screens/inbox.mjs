/* A CAIXA DE ENTRADA — a primeira carta de verdade. Views PURAS.
   ══════════════════════════════════════════════════════════════════════════════

   ── POR QUE ELA COMECA PELO MES QUE FECHOU ──────────────────────────────────
   O ciclo 4 diz que a Caixa de Entrada e a interface do jogo inteiro: o Congresso
   propoe e chega uma carta, o relator devolve o texto e chega uma carta, o
   tribunal derruba e chega uma carta. Nada disso existe — sao as Partes 3, 4 e 8.
   Enquanto isso a caixa ficou vazia por duas sessoes, declarando a espera.

   Mas havia uma carta possivel o tempo todo, e ela e a mais basica de todas: **o
   mes fechou assim**. O relatorio do turno existe desde a quinta sessao, e ele
   estava enterrado num bloco no rodape do Congresso — uma tela que o jogador pode
   nao visitar. O resultado de uma decisao chegando a um lugar onde ele talvez nao
   olhe e a definicao de consequencia invisivel.

   ⚠ E ELA NAO E EVENTO ROTEIRIZADO, que e o que o ciclo proibe. Nenhuma frase aqui
   e escrita para um caso: tudo o que a carta diz e leitura do relatorio que o turno
   ja produziu — se a pauta passou, quanto o caixa honrou, o que a rua fez. Se um dia
   uma carta precisar de um numero que nenhum motor produz, ela nao entra.

   ── O REMETENTE VEM ANTES DO TEXTO ──────────────────────────────────────────
   Uma auditoria externa formulou isto melhor do que o ciclo tinha: "o jogador
   precisa bater o olho e pensar — ih, carta do lider do Centrao". Uma lista de
   paragrafos sem cara e um mural de avisos, e mural que se ignora ensina a ignorar
   a tela onde o jogo inteiro vai acontecer. Entao toda carta abre com sinete, nome
   e cargo — e quem assina esta e o chefe da Casa Civil, que e o unico personagem
   cuja funcao e falar com o presidente.

   ── ELA E DE PAPEL ──────────────────────────────────────────────────────────
   A segunda substancia do ciclo 5, e a segunda consumidora dela depois da lei. A
   fronteira e a mesma e continua declarada: papel so onde ha TEXTO DE REGISTRO. */

import { escapeHtml } from "../shared/html.mjs";
import { money, seats } from "../shared/format.mjs";
import { sigilHtml } from "../shared/sigil.mjs";
import { monthLabel } from "../../state/state.mjs";
import { UI } from "../strings.mjs";

/**
 * UMA CARTA — remetente, assunto, corpo, e para onde ela leva.
 *
 * ⚠ A TARJA DE GRAVIDADE MEDE TEMPO, E NAO IMPORTANCIA. Um assunto grave com prazo
 * largo nao e urgente, e e essa distincao que o jogador precisa para escolher o que
 * responder primeiro. Ela e vermelha porque uma carta prestes a vencer E crise, e o
 * vermelho semantico ja significa isso no resto do jogo — nao ha cor nova aqui.
 *
 * ⚠ E QUEM CONTA OS MESES E `left`, DA FACHADA. A subtracao e trivial, e e por isso
 * mesmo que ela nao pode morar aqui: trivial e o que a tela refaz sem pensar, e no
 * dia em que o vencimento deixar de ser `due - month` a tarja mentiria calada.
 *
 * @param {object} input
 * @param {{ name: string, office: string, label: string, reach: number } | null} input.from
 * @param {string} input.subject
 * @param {string} input.body ja em HTML
 * @param {string} [input.action] o rotulo do botao
 * @param {string} [input.target] a secao para onde ele leva
 * @param {string} [input.choices] as duas saidas, quando a carta PERGUNTA
 * @param {number | null} [input.due] quantos meses faltam; nulo quando nao ha prazo
 * @returns {string}
 */
function letterHtml({ from, subject, body, action, target, choices, due = null }) {
  /* TRES DEGRAUS, E NAO UM GRADIENTE: o jogador nao le "2,4 meses", ele le se da
     tempo. `open` e prazo que ainda cabe numa fila; `soon` e o ultimo mes em que
     responder ainda e decisao; `now` e o mes em que o silencio decide por ele. */
  const urgency = due === null ? null : due <= 0 ? "now" : due <= 1 ? "soon" : "open";

  return (
    `<article class="letter"${urgency ? ` data-urgency="${urgency}"` : ""}>` +
    `<header class="letter__head">` +
    (from
      ? sigilHtml({ name: from.name, office: from.office, reach: from.reach, role: from.label })
      : "") +
    `<span class="letter__from">` +
    (from
      ? `<b class="letter__name">${escapeHtml(from.name)}</b>` +
        `<span class="letter__role">${escapeHtml(from.label)}</span>`
      : "") +
    `</span>` +
    (urgency ? `<span class="letter__due" data-numeric>${escapeHtml(dueLabel(due))}</span>` : "") +
    `</header>` +
    `<h4 class="letter__subject">${escapeHtml(subject)}</h4>` +
    `<div class="letter__body">${body}</div>` +
    (choices ?? "") +
    (action && target
      ? `<button class="letter__action" type="button" data-section="${escapeHtml(target)}">` +
        `${escapeHtml(action)}</button>`
      : "") +
    `</article>`
  );
}

/**
 * O PRAZO EM PALAVRAS — e o zero tem frase propria.
 *
 * ⚠ "vence em 0 meses" e o tipo de texto que so um programador escreve. O mes em que
 * o silencio decide e o mes mais importante da carta, e ele merece a frase que o
 * jogador de fato leria.
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
 * A CARTA DO MES QUE FECHOU — e cada linha dela e uma leitura do relatorio.
 *
 * ⚠ NENHUM NUMERO E CALCULADO AQUI. O que a carta faz e escolher QUAIS das leituras
 * que o turno ja produziu merecem uma linha — e a escolha e por consequencia: o que
 * o mes decidiu, quanto ele custou, e o que a rua achou. Somar ou comparar qualquer
 * coisa neste arquivo seria a tela refazendo a conta do motor, do lado errado da
 * fronteira.
 *
 * @param {object} input
 * @param {import("../../application/turn.mjs").Report} input.report
 * @param {{ name: string, office: string, label: string, reach: number } | null} input.adviser
 * @param {number} input.approval a pesquisa com que o mes fechou
 * @returns {string}
 */
export function monthLetterHtml({ report, adviser, approval }) {
  const bill = report.agenda.proposal;

  /* O ASSUNTO E O QUE O MES DECIDIU, e um assunto generico — "o mes fechou" —
     obrigaria o jogador a ler o corpo para saber se algo aconteceu.

     ⚠ E ELE PASSOU A DISTINGUIR ESPERAR DE PERDER, o que ate 15/08/2026 ele nao
     fazia: a carta dizia "derrubada" para um texto que tinha acabado de ser ESCRITO.
     Ela lia `enacted` — que desde a tramitacao significa "algum texto venceu o
     plenario hoje" — contra a pauta que o jogador acabou de assinar, e as duas
     deixaram de ser a mesma coisa.

     QUEM DIZ O VEREDITO SAO OS EVENTOS, e nao a pauta do mes: o texto que o plenario
     julgou hoje foi escrito ha tres meses, e o nome dele esta no evento. */
  const judged = report.events.find(event => event.kind === "passed" || event.kind === "rejected");

  const subject = judged
    ? `${judged.kind === "passed" ? UI.inbox.passed : UI.inbox.rejected}: ${judged.label}`
    : bill
      ? `${UI.inbox.filed}: ${bill.label}`
      : UI.report.noBill;

  /** @type {string[]} */
  const lines = [];

  /* O PLACAR, e so quando houve votacao: decreto nao tem placar, e imprimir um
     travessao no lugar do numero ja foi defeito nesta tela uma vez. */
  if (report.tally) {
    lines.push(
      `<span>${escapeHtml(UI.inbox.voted)} ` +
        `<b data-numeric>${seats(report.tally.votes)}</b> ` +
        `${escapeHtml(UI.mesa.needs)} <b data-numeric>${seats(report.agenda.quorum)}</b></span>`,
    );
  }

  /* O DINHEIRO, e a linha so aparece quando houve promessa: um "prometeu R$ 0,0 bi"
     todo mes ensina o olho a pular a linha inteira. */
  if (report.promisedCost > 0) {
    lines.push(
      `<span>${escapeHtml(UI.report.promised)} ` +
        `<b data-numeric>${money(report.promisedCost)}</b> · ` +
        `${escapeHtml(UI.report.honoured)} ` +
        `<b data-numeric>${money(report.paidCost)}</b></span>`,
    );
  }

  lines.push(`<span>${escapeHtml(UI.inbox.street)} <b data-numeric>${seats(approval)}%</b></span>`);

  return letterHtml({
    from: adviser,
    subject: `${monthLabel(report.month)} — ${subject}`,
    body: `<div class="letter__lines">${lines.join("")}</div>`,
    action: UI.inbox.seeMonth,
    target: "congress",
  });
}

/**
 * AS CARTAS DA TRAMITACAO — e sao elas que transformam a gaveta em mecanica.
 *
 * ⚠ SEM ELAS A TRAMITACAO E MUDA. O jogador ve o texto sumir e nao sabe se a Mesa
 * engavetou, se o relator o esvaziou ou se o plenario o derrubou — e mecanica que so
 * mostra ESTADO e obstaculo; a que mostra CAUSA e jogada. O ciclo 4 prometeu que "a
 * gaveta vira uma jogada, tanto do jogador quanto contra ele", e sem a carta ela
 * virava so a segunda metade.
 *
 * ⚠ O REMETENTE E QUEM DE FATO DECIDIU, e nao um narrador. O presidente da Camara
 * assina a pauta porque foi ele quem pautou; o relator assina a emenda porque foi ele
 * quem a escreveu. Isso nao e sabor: e o que faz o jogador saber A QUEM pagar no mes
 * seguinte — e e a diferenca entre uma carta e um aviso.
 *
 * ⚠ E NENHUMA E ESCRITA PARA UM CASO. Cada uma e a leitura de um evento que a
 * tramitacao produziu, com o nome do texto que o proprio jogador escreveu. Se um dia
 * uma carta precisar de um fato que nenhum motor registra, ela nao entra.
 *
 * ⚠ ELA LE O ESTADO, E NAO OS EVENTOS DO ULTIMO TURNO. Ate 16/08/2026 esta funcao
 * recebia `report.events`, e por isso a caixa era um MURAL: o que chegava sumia no
 * mes seguinte, sem resposta e sem consequencia. Agora ela recebe `state.mail`, que
 * e o que espera — e o que espera pode ter prazo.
 *
 * @param {object} input
 * @param {ReadonlyArray<import("../../state/state.mjs").Letter>} input.mail
 * @param {ReadonlyArray<{ id: string, name: string, office: string, label: string,
 *   reach: number }>} input.people
 * @param {(letter: import("../../state/state.mjs").Letter) => number | null} input.left
 *   quantos meses faltam, perguntado a fachada
 * @param {{ mandatory: number, room: number }} input.inherited a heranca, para a posse
 * @param {Record<string, string>} input.answered o que o jogador ja MARCOU neste mes
 * @returns {string[]}
 */
export function mailHtml({ mail, people, left, inherited, answered }) {
  const by = (/** @type {string} */ office) =>
    people.find(person => person.office === office) ?? null;

  return mail
    .map(letter => {
      const subject = letter.subject ?? "";

      switch (letter.kind) {
        /* ⚠ A CARTA DE POSSE ABRE O MANDATO, e ela e a unica que nasce com o
           estado. Nada aqui e inventado: a obrigatoria e o que sobra no mes ja sao
           produzidos pelo LASTRO desde a primeira sessao — o que faltava era
           alguem ENTREGAR isso ao presidente em vez de deixa-lo procurar. */
        case "posse":
          return letterHtml({
            from: by("chief-of-staff"),
            subject: UI.inbox.inauguration,
            body:
              `<div class="letter__lines">` +
              /* ⚠ `money`, E NAO `seats`. A primeira versao imprimiu "2166% da
                 despesa e obrigatoria" — a obrigatoria e R$ 2.166 bi, e ela saiu
                 vestida de porcentagem. Nada falhou: tipo, guarda e 194 provas
                 passaram, porque `seats` recebe um numero e devolve um numero. Quem
                 pegou foi a imagem, pela quarta vez neste projeto.

                 A LICAO E DE FORMA, E NAO DE DESCUIDO: o formatador carrega a
                 UNIDADE, e escolher o errado troca a unidade sem trocar o valor —
                 que e o unico erro de exibicao que nenhuma prova de igualdade
                 alcanca. */
              `<span><b data-numeric>${money(inherited.mandatory)}</b> ` +
              `${escapeHtml(UI.inbox.inheritedMandatory)}</span>` +
              `<span><b data-numeric>${money(inherited.room)}</b> ` +
              `${escapeHtml(UI.inbox.inheritedRoom)}</span>` +
              `<span>${escapeHtml(UI.inbox.inheritedLead)}</span>` +
              `</div>`,
            action: UI.inbox.seeMonth,
            target: "congress",
          });

        case "tabled":
          return letterHtml({
            from: by("speaker"),
            subject: `${UI.inbox.tabled}: ${subject}`,
            body: `<div class="letter__lines"><span>${escapeHtml(UI.inbox.tabledBody)}</span></div>`,
          });

        /* ⚠ A EMENDA E A UNICA CARTA QUE PERGUNTA, e por isso ela e a unica com
           prazo, com tarja e com botao que decide. Ate ontem ela informava e o
           texto seguia sozinho; o jogador via o relator emendar a lei DELE e nao
           podia fazer nada. */
        case "reported":
          return letterHtml({
            from: by("rapporteur"),
            subject: `${UI.inbox.reported}: ${subject}`,
            due: left(letter),
            body:
              `<div class="letter__lines">` +
              /* ⚠ O JABUTI E DITO PELO NOME. "Devolvi com uma emenda" sem dizer QUAL
                 seria a carta escondendo a unica informacao que ela tem — e o jogador
                 descobriria o buraco no mes seguinte, no numero. */
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

        /* ⚠ A GAVETA NAO TEM REMETENTE, e a ausencia e a informacao: ninguem escreve
           para avisar que engavetou. O texto morreu de silencio, que e como projeto
           morre numa casa legislativa de verdade. */
        case "forgotten":
          return letterHtml({
            from: null,
            subject: `${UI.inbox.forgotten}: ${subject}`,
            body: `<div class="letter__lines"><span>${escapeHtml(UI.inbox.forgottenBody)}</span></div>`,
          });

        case "passed":
        case "rejected":
          return letterHtml({
            from: null,
            subject: `${letter.kind === "passed" ? UI.inbox.passedBill : UI.inbox.rejectedBill}: ${subject}`,
            body: "",
          });

        default:
          return "";
      }
    })
    .filter(Boolean);
}

/**
 * O QUE A CARTA DIZ SOBRE O PROPRIO DESFECHO.
 *
 * ⚠ ABERTA, ELA AVISA O QUE O SILENCIO FAZ — e essa frase e a razao de o prazo ser
 * mecanica. Fechada, ela diz o que aconteceu, inclusive quando o que aconteceu foi
 * nada: um inbox que apaga o que voce deixou vencer esconde justamente que voce vem
 * deixando vencer.
 *
 * @param {import("../../state/state.mjs").Letter} letter
 * @returns {string}
 */
function outcomeOf(letter) {
  switch (letter.answer) {
    case "accept":
      return UI.inbox.accepted;
    case "block":
      return UI.inbox.blocked;
    case "silence":
      return UI.inbox.silenced;
    default:
      return UI.inbox.silenceWarns;
  }
}

/**
 * AS DUAS SAIDAS, e nenhuma e de graca.
 *
 * ⚠ O PRECO DE CADA UMA VEM COLADO NO BOTAO. Um par "aceitar / travar" sem o custo
 * ao lado obrigaria o jogador a descobrir o que escolheu no mes seguinte — e a
 * escolha so e escolha quando os dois lados sao legiveis ANTES.
 *
 * ⚠ E A MARCA E `aria-pressed`, e nao uma classe: o que o botao expressa e um estado
 * de ALTERNANCIA — decidido e ainda nao executado —, e o leitor de tela precisa saber
 * disso tanto quanto o olho. Uma classe pintaria a mesma coisa e nao diria nada.
 *
 * @param {string} id
 * @param {string} chosen o que ja esta marcado, se algo estiver
 * @returns {string}
 */
function choicesHtml(id, chosen) {
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
    button("accept", UI.inbox.accept, UI.inbox.acceptCost) +
    button("block", UI.inbox.block, UI.inbox.blockCost) +
    `</div>`
  );
}
