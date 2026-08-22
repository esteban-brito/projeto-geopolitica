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
import { money, percent, seats, signed } from "../shared/format.mjs";
import { sigilHtml } from "../shared/sigil.mjs";
import { monthLabel } from "../../state/state.mjs";
import { UI, labelOf } from "../strings.mjs";

/**
 * ── O OFICIO — o que uma carta E, antes de virar pixel ────────────────────────
 *
 * ⚠ ELE NASCEU EM 20/08/2026, com a bandeja de DUAS COLUNAS, e a razao dele e a
 * unica que importa aqui: a lista da esquerda e o oficio aberto da direita mostram
 * a MESMA carta em dois tamanhos. Enquanto o `switch` devolvia HTML pronto, a unica
 * forma de a lista saber o assunto de uma carta seria montar o assunto DE NOVO — e
 * a segunda copia de "Pautado: {nome}" divergiria da primeira no dia seguinte.
 *
 * Esta e a familia de defeito mais cara do projeto, com sete ocorrencias medidas, e
 * ela nasce sempre igual: uma mudanca deixa uma copia para tras. O descritor a mata
 * na raiz — o `switch` decide UMA vez o que a carta diz, e duas views leem dele.
 *
 * @typedef {object} Dispatch
 * @property {string} id o mesmo id da carta no estado; e por ele que a bandeja abre
 * @property {number} month o mes em que ela chegou — e o indice PRECISA dele; ver `rowHtml`
 * @property {{ name: string, office: string, label: string, reach: number } | null} from
 * @property {string} subject
 * @property {string} body ja em HTML
 * @property {string | undefined} [action] o rotulo do botao que leva ao lugar de decidir
 * @property {string | undefined} [target] a secao para onde ele leva
 * @property {string | undefined} [choices] as duas saidas, quando a carta PERGUNTA
 * @property {number | null | undefined} [due] quantos meses faltam; nulo sem prazo
 * @property {string | undefined} [why] por que ESTA carta chegou — a causa, e nao o efeito
 * @property {"high" | undefined} [weight] se o movimento foi grande o bastante para gritar
 */

/**
 * QUAO PERTO DE VENCER — tres degraus, e nao um gradiente.
 *
 * O jogador nao lê "2,4 meses", ele lê se da tempo. `open` e prazo que ainda cabe
 * numa fila; `soon` e o ultimo mes em que responder ainda e decisao; `now` e o mes
 * em que o silencio decide por ele.
 *
 * ⚠ ELA VIROU FUNCAO no dia em que a bandeja ganhou duas colunas, e a extracao e o
 * conserto preventivo: a regra estava dentro de `letterHtml`, e a LISTA precisa
 * exatamente dela para pintar a tarja da linha. Copiada, as duas divergiriam no dia
 * em que "o ultimo mes" deixasse de ser um mes — e a lista leria calmo o que o
 * oficio aberto lê em vermelho, na tela onde o jogador escolhe o que responder
 * primeiro.
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
 * @param {string} [input.why] por que ela chegou
 * @param {number | null} [input.month] o mês em que ela foi escrita, para o cabeçalho
 * @returns {string}
 */
export function letterHtml({
  from,
  subject,
  body,
  action,
  target,
  choices,
  due = null,
  why,
  month = null,
}) {
  const urgency = urgencyOf(due);

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
    /* ⚠ A DATA MORA NO CABECALHO DO OFICIO, ao lado de quem assinou — que e onde um
       documento datado se data. Ela saiu do indice por decisao dele, e o lugar dela aqui
       nao e substituicao: e o lugar certo desde sempre, e o indice e que a tinha tomado
       emprestada. */
    `<span class="letter__meta">` +
    (month !== null ? `<span class="letter__date">${escapeHtml(monthLabel(month))}</span>` : "") +
    (urgency ? `<span class="letter__due" data-numeric>${escapeHtml(dueLabel(due))}</span>` : "") +
    `</span>` +
    `</header>` +
    `<h4 class="letter__subject">${escapeHtml(subject)}</h4>` +
    /* ⚠ O VOCATIVO SUBIU PARA CA EM 22/08/2026, e antes ele existia em TRES das doze
       especies — as de relatorio. Pedido dele: "use essa mensagem sobre a Aprovacao para
       todas as outras, tudo deve ser igualmente padronizado".
       ⚠ E ELE E DA CARTA, E NAO DO CORPO. Escrito dentro de cada caso, ele seria doze
       lugares para manter em dia e a decima terceira ocorrencia da familia de defeito mais
       cara deste projeto — foi assim que tres das doze o tiveram e nove nao. Aqui ele nasce
       com o oficio: nao ha como escrever uma carta nova sem ele.
       ⚠ E ELE NAO E ENFEITE. Ele e a unica peca da tela que se dirige ao presidente em
       segunda pessoa, e e ela que separa um OFICIO de uma leitura de dado — que foi
       exatamente a queixa que reescreveu o corpo destas cartas em 21/08. */
    `<p class="letter__vocative">${escapeHtml(UI.inbox.vocative)}</p>` +
    `<div class="letter__body">${body}</div>` +
    (choices ?? "") +
    (action && target
      ? `<button class="letter__action" type="button" data-section="${escapeHtml(target)}">` +
        `${escapeHtml(action)}</button>`
      : "") +
    /* ⚠ A RAZAO FICA NO PE, E NAO NO TOPO, e a ordem e a pergunta que o leitor faz. Ele
       abre a carta para saber O QUE aconteceu; "por que isto chegou" e a segunda
       pergunta, e so de quem quer aprender a maquina. No topo, ela empurraria o assunto
       para baixo em toda carta para responder algo que ninguem perguntou ainda. */
    (why ? `<p class="letter__why">${escapeHtml(why)}</p>` : "") +
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
 *
 * ⚠ E A APROVACAO SAIU DA ASSINATURA em 21/08/2026, porque ela chegava por DOIS caminhos:
 * `app.mjs` a media do estado vivo e a passava, e `report.balance` ja a trazia medida pelo
 * turno. Os dois numeros concordavam por sorte — o estado vivo e o mes fechado sao o mesmo
 * ate alguem resolver um mes —, e concordar por sorte e a definicao do defeito que este
 * projeto persegue.
 * @returns {Dispatch}
 */
export function describeMonth({ report, adviser }) {
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

  /* ⚠ AS TRES LEITURAS JUNTAS, E ISSO E O CONSERTO DE UM DEFEITO DE PROJETO MEU. Ate
     21/08/2026 esta carta trazia so a rua, e tres relatorios avulsos escreviam a base e o
     caixa ao lado dela TODO MES — e o print dele mostrou o resultado: "Base perde 4
     cadeiras" tres meses seguidos, com o mesmo numero. Medido depois, jogando: 7, 4, 5, 5,
     5, 5, 5, 4, 4. O numero repetia porque o FATO repete, e relatorio mensal de uma
     constante e linha de log.

     Reunidas na carta que ja chegava todo mes, elas viram um BALANCO — que nunca repete,
     porque o conteudo dele e o mes inteiro. Os avulsos subiram de limiar e voltaram a ser
     o que o nome diz.

     ⚠ E NENHUMA DAS TRES E CALCULADA AQUI. `report.balance` traz as seis medidas do turno,
     e `discretionaryRoom` perguntado desta view daria o mes SEGUINTE — a tela estaria
     contando outro mes que o motor. */
  const balance = report.balance;
  lines.push(
    `<span>${escapeHtml(UI.inbox.street)} ` +
      `<b data-numeric>${seats(balance.streetNow)}%</b></span>`,
  );
  lines.push(
    `<span>${escapeHtml(UI.inbox.base)} ` +
      `<b data-numeric>${seats(balance.seatsNow)}</b> ${escapeHtml(UI.inbox.headlineSeats)}</span>`,
  );
  lines.push(
    `<span>${escapeHtml(UI.inbox.vault)} <b data-numeric>${money(balance.roomNow)}</b></span>`,
  );

  /* ⚠ O ID E O MES, e nao um contador: esta carta nao mora em `state.mail` — ela e
     lida do relatorio a cada pintura. Um id estavel e o que permite a bandeja mante-la
     ABERTA entre dois cliques; um id novo a cada pintura fecharia o oficio sozinho no
     instante em que o jogador marcasse qualquer outra coisa. */
  return {
    id: `month-${report.month}`,
    month: report.month,
    from: adviser,
    /* ⚠ O PREFIXO DE MES SAIU em 21/08/2026, e quem o tornou redundante foi a BARRA DE
       DATA do indice: ela diz "MAI · 2027" na linha imediatamente acima desta carta. Duas
       datas coladas uma na outra nao sao redundancia inofensiva — elas roubam a largura do
       unico campo que decide o clique, numa coluna de 208px. */
    subject,
    body: `<div class="letter__lines">${lines.join("")}</div>${balanceAnnex(balance)}`,
    action: UI.inbox.seeMonth,
    target: "congress",
    due: null,
    /* ⚠ ELA REUSA A FRASE QUE O ESTADO VAZIO PERDEU em 21/08/2026. "Todo mês que você
       resolve chega aqui, assinado pela Casa Civil" era uma PROMESSA no lugar errado —
       dita a uma bandeja vazia, ela negava o que o jogador tinha acabado de fazer. Dita
       no pé da própria carta do mês, ela vira o que sempre foi: a razão de ela existir. */
    why: UI.cabinet.inboxSigned,
  };
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
 * @param {ReadonlyArray<{ id: string, label: string, reads?: string }>} [input.lobbies]
 *   quem pode exigir. ⚠ `reads` entra aqui porque o SENTIDO da exigencia depende dele —
 *   quem lê a divida pede corte, e os outros pedem verba — e guardar o sentido na carta
 *   daria dois lugares dizendo a mesma coisa
 * @param {{ price: number, removal: number, seats: number,
 *   lobbies?: ReadonlyArray<{ id: string, pressure: number, boil: number, share: number }> }}
 *   [input.siege] o cerco e a caldeira, perguntados ao motor. A carta do processo cita o
 *   quorum do afastamento e o quanto a cadeira encareceu; a da fervura cita a pressao, o
 *   ponto e a fatia. ⚠ Os cinco sao do motor: escritos a mao nesta view, mentiriam no dia
 *   em que qualquer um deles mudasse
 * @param {ReadonlyArray<{ id: string, label: string }>} [input.parties] as bancadas, para o
 *   ANEXO da base. ⚠ Só o RÓTULO vem daqui — a lealdade e as cadeiras chegam na carta
 * @param {ReadonlyArray<{ id: string, label: string }>} [input.segments] as classes, para o
 *   ANEXO da carta da rua. ⚠ So o RÓTULO vem daqui — os números chegam pesados na carta
 * @param {{ base: number, majority: number }} [input.chamber] as cadeiras que respondem ao
 *   governo e o quorum simples. ⚠ Ela entrou em 21/08/2026 com a carta da MINORIA, e os
 *   dois numeros vem prontos: a soma das bancadas leais e conta de `baseCount`, e refaze-la
 *   aqui daria a esta carta um placar diferente do que a Trindade mostra ao lado dela
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
}) {
  const by = (/** @type {string} */ office) =>
    people.find(person => person.office === office) ?? null;

  /* O NOME DO GRUPO SAI DO CATALOGO, e nao de uma tabela nesta view: um quinto lobby
     apareceria aqui como um id cru, e id cru na tela e o defeito que `identity` existe
     para impedir do outro lado. */
  const nameOf = (/** @type {string | null} */ id) =>
    lobbies.find(lobby => lobby.id === id)?.label ?? "";

  /* QUEM PEDE CORTE, e nao verba. Ver a nota no caso `demand`. */
  const cuts = new Set(lobbies.filter(lobby => lobby.reads === "debt").map(lobby => lobby.id));

  return mail
    .map(letter => {
      const subject = letter.subject ?? "";

      /* ⚠ O ID VEM DE FORA DE CADA CASO, e essa e a razao de `paper` existir em vez
         de nove literais com `id: letter.id` dentro. Nove lugares para digitar a mesma
         chave e nove lugares para esquece-la — e uma carta sem id na bandeja de duas
         colunas nao quebra nada: ela simplesmente nunca abre quando clicada. */
      const paper = (/** @type {Omit<Dispatch, "id" | "month">} */ spec) => ({
        ...spec,
        id: letter.id,
        month: letter.month,
        /* ⚠ A RAZAO ENTRA AQUI E NAO EM CADA CASO, e por isso ela e uma linha e nao
           nove. O `kind` ja e o que o motor gravou para dizer o que aconteceu; escrever
           a razao dentro de cada `case` seria nove lugares para manter em dia, e a
           nona ocorrencia da familia de defeito mais cara deste projeto. */
        why: labelOf(UI.inbox.why, letter.kind),
        /* ⚠ O PESO VEM DA CARTA, e a tela nao o recalcula: quem sabe se um movimento e
           grande e quem conhece os limiares, e eles moram no motor. */
        weight: letter.weight ?? undefined,
      });

      switch (letter.kind) {
        /* ⚠ A CARTA DE POSSE ABRE O MANDATO, e ela e a unica que nasce com o
           estado. Nada aqui e inventado: a obrigatoria e o que sobra no mes ja sao
           produzidos pelo LASTRO desde a primeira sessao — o que faltava era
           alguem ENTREGAR isso ao presidente em vez de deixa-lo procurar. */
        case "posse":
          return paper({
            from: by("chief"),
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
          return paper({
            from: by("speaker"),
            subject: `${UI.inbox.tabled}: ${subject}`,
            body: `<div class="letter__lines"><span>${escapeHtml(UI.inbox.tabledBody)}</span></div>`,
          });

        /* ⚠ A EMENDA E A UNICA CARTA QUE PERGUNTA, e por isso ela e a unica com
           prazo, com tarja e com botao que decide. Ate ontem ela informava e o
           texto seguia sozinho; o jogador via o relator emendar a lei DELE e nao
           podia fazer nada. */
        case "reported":
          return paper({
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

        /* ── A CHANTAGEM — a segunda pergunta do jogo, e a primeira que vem de FORA
           da tramitacao ─────────────────────────────────────────────────────────
           ⚠ ELA NAO TEM SINETE, e a ausencia e a modelagem: um lobby nao e uma
           PESSOA. O sinete identifica quem assina — iniciais num anel cujo raio e o
           alcance daquele sujeito na Camara —, e um grupo de pressao nao tem cadeira
           nem iniciais. Dar um a ele diria que ele vota, e ele nao vota: ele aperta.

           O nome dele vem no assunto, que e onde o remetente aparece quando nao ha
           quem assine — a mesma solucao da gaveta, do outro lado. */
        case "demand": {
          /* ⚠ O SENTIDO DA EXIGENCIA VEM DO GRUPO, e nao de um campo na carta: quem lê
             a DIVIDA pede corte, e os outros pedem verba. Guardar o sentido na carta
             daria dois lugares dizendo a mesma coisa — o catalogo ja sabe o que cada
             grupo lê, e no dia em que um quinto lobby nascer ele entra por aqui sozinho. */
          const cutting = cuts.has(letter.from ?? "");

          return paper({
            from: null,
            subject: `${escapeHtml(nameOf(letter.from))}: ${subject}`,
            due: left(letter),
            body:
              `<div class="letter__lines">` +
              /* O QUE ELE QUER, EM NUMERO. "Devolva o que voce cortou" sem dizer
                 QUANTO seria a carta escondendo a unica coisa acionavel dela. */
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

        /* ⚠ A GAVETA NAO TEM REMETENTE, e a ausencia e a informacao: ninguem escreve
           para avisar que engavetou. O texto morreu de silencio, que e como projeto
           morre numa casa legislativa de verdade. */
        case "forgotten":
          return paper({
            from: null,
            subject: `${UI.inbox.forgotten}: ${subject}`,
            body: `<div class="letter__lines"><span>${escapeHtml(UI.inbox.forgottenBody)}</span></div>`,
          });

        /* ⚠ AS DUAS ERAM AS UNICAS CARTAS DO JOGO COM CORPO VAZIO, e a medicao de
           21/08/2026 as pegou: numa folha que estica ate 630px, `body: ""` produz
           cabecalho, assunto e 430px de papel em branco. E a especie que sofria era a
           do DESFECHO — o texto que o jogador escreveu, negociou e pagou —, entao o
           momento de maior recompensa do jogo chegava como a carta mais vazia dele.

           ⚠ E O CORPO NAO INVENTA NUMERO: as duas frases dizem o que a MECANICA faz
           depois do voto, e nada mais. O que falta aqui e o placar da votacao, e ele
           NAO entra por esta porta — `notice` nao guarda voto, e lê-lo do estado vivo
           faria uma carta de marco imprimir a camara de agosto. Isso é motor, e motor
           nao se mexe enquanto a interface nao fecha.

           ⚠ E SO A APROVACAO TEM PORTA. A norma nova passa a existir em algum lugar —
           a tela do Estado —, e a carta leva ate ela; a derrubada nao criou nada, e um
           botao ali mandaria o jogador olhar a ausencia de uma coisa. */
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

        /* ── OS TRES RELATORIOS DO MES ──────────────────────────────────────
           ⚠ ELES CHEGAM POR TEMPO, e nao por evento, e sao a unica especie assim. Quem
           assina e a Casa Civil — e a mesma pessoa que entrega o mes ao presidente.

           ⚠ E OS DOIS NUMEROS VEM DA CARTA, e nunca do estado vivo. Uma carta de marco
           que lesse o "depois" de hoje contaria o mes errado na segunda vez que fosse
           aberta, e o jogador nao teria como saber que ela mudou debaixo dele. */
        case "street":
        case "seats":
        case "vault":
          return paper({
            from: by("chief"),
            subject: headlineOf(letter),
            body: reportBody(letter, segments, chamber) + annexHtml(letter, segments, parties),
          });

        /* ── O MUNDO SE MEXENDO SOZINHO ─────────────────────────────────────
           ⚠ AS TRES SAO TRAVESSIA, e nao estado, e as tres sao AVISO: nao ha o que
           responder a uma aritmetica. O que se faz a respeito mora no Congresso e em
           Financas, e um par de botoes aqui seria uma segunda porta para a mesma
           jogada — com o jogador escolhendo sem ver o preco que so a outra tela mostra.

           ⚠ E QUEM ASSINA MUDA COM O ASSUNTO. O teto e a fervura sao fatos que a Casa
           Civil entrega, como todo mes; a MINORIA e do LIDER, porque perder a maioria e
           problema dele antes de ser do presidente — e e ele quem vai ter de recompor.

           ⚠ E A FERVURA NAO E ASSINADA PELO GRUPO, ainda que a carta guarde o id dele: um
           lobby nao tem rosto neste jogo — nao esta no elenco, nao tem sinete e nao tem
           cargo. O nome dele vai no ASSUNTO, que e onde ele lê como manchete. */
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
              `<span><b data-numeric>${seats(chamber.base)}</b> ` +
              `${escapeHtml(UI.inbox.minorityNote)} ` +
              `<b data-numeric>${seats(chamber.majority)}</b></span>` +
              `</div>`,
            action: UI.cabinet.congressAction,
            target: "congress",
          });

        case "boiling": {
          /* O GRUPO INTEIRO VEM DA CALDEIRA, e nao de uma tabela nesta view: pressao,
             ponto de fervura e fatia sao do motor, e a frase se monta em volta deles. */
          const group = (siege?.lobbies ?? []).find(item => item.id === subject) ?? null;
          return paper({
            from: by("chief"),
            subject: `${nameOf(subject) || subject} ${UI.inbox.boilingSubject}`,
            body:
              `<div class="letter__lines">` +
              `<span>${escapeHtml(UI.inbox.boilingBody)}</span>` +
              (group
                ? `<span><b data-numeric>${seats(group.pressure)}</b> ` +
                  `${escapeHtml(UI.inbox.boilingNote)} ` +
                  `<b data-numeric>${seats(group.boil)}</b>. ` +
                  (group.share > 0
                    ? `${escapeHtml(UI.inbox.boilingWeight)} ` +
                      `<b data-numeric>${percent(group.share)}</b> ` +
                      `${escapeHtml(UI.cabinet.boilerShare)}`
                    : escapeHtml(UI.inbox.boilingNoWeight)) +
                  `</span>`
                : "") +
              `</div>`,
          });
        }

        /* ── O CERCO FALANDO ────────────────────────────────────────────────
           ⚠ AS DUAS SAO AVISO, e nao pergunta: a resposta ao cerco nao se da na
           carta, ela se da no Congresso, comprando a cadeira que ficou mais cara.
           Um par de botoes aqui seria uma SEGUNDA porta para a mesma jogada, e o
           jogador escolheria sem ver o preco que so a outra tela mostra.

           ⚠ E QUEM ASSINA E A CASA CIVIL, e nao ninguem. A gaveta nao tem
           remetente porque ninguem escreve para avisar que engavetou; aqui alguem
           escreve, e e a mesma pessoa que entrega o mes ao presidente. */
        case "rupture":
          return paper({
            from: by("chief"),
            subject: ruptureText(UI.inbox.ruptureSubject, subject) ?? UI.inbox.ruptureFallback,
            body:
              `<div class="letter__lines">` +
              `<span>${escapeHtml(ruptureText(UI.inbox.ruptureBody, subject) ?? "")}</span>` +
              `<span>${escapeHtml(UI.inbox.ruptureNote)}</span>` +
              `</div>`,
          });

        case "siege":
          return paper({
            from: by("chief"),
            subject: UI.inbox.siegeSubject,
            body:
              `<div class="letter__lines">` +
              `<span>${escapeHtml(UI.inbox.siegeBody)}</span>` +
              /* ⚠ OS DOIS NUMEROS VEM DO MOTOR, e a frase e montada em volta deles.
                 O quorum e a CF art. 86 — dado com fonte —, e o preco e a
                 calibragem do cerco: escritos a mao aqui, mentiriam no dia em que
                 qualquer um dos dois mudasse. */
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
 * ⚠ ELA E UMA FUNCAO E NAO UM INDICE DIRETO porque `subject` e uma string vinda do
 * estado, e o mapa tem exatamente tres chaves: um acesso solto devolveria
 * `undefined` sem nada acusar no dia em que uma quarta ruptura nascesse com o nome
 * escrito diferente dos dois lados. Aqui o `undefined` tem um lugar para cair.
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
 * ⚠ ABERTA, ELA AVISA O QUE O SILENCIO FAZ — e essa frase e a razao de o prazo ser
 * mecanica. Fechada, ela diz o que aconteceu, inclusive quando o que aconteceu foi
 * nada: um inbox que apaga o que voce deixou vencer esconde justamente que voce vem
 * deixando vencer.
 *
 * @param {import("../../state/state.mjs").Letter} letter
 * @returns {string}
 */
function outcomeOf(letter) {
  /* ⚠ A CHANTAGEM INVERTE O SILENCIO, e a tela precisa saber disso — foi um defeito
     medido no dia em que a carta nasceu: ela imprimia "se voce nao responder, a emenda
     vale", que e a frase da tramitacao, numa carta em que o silencio RECUSA.

     Uma tela que promete o contrario do que o turno faz e pior que uma tela feia: o
     jogador aprende uma regra errada e joga contra ela por meses. E `settle` nao ajuda
     a perceber — as duas cartas fecham com `answer: "silence"` pelo mesmo caminho; o
     que muda e o que o TURNO faz com esse silencio. */
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

/* ══════════════════════════════════════════════════════════════════════════════
   A BANDEJA DE DUAS COLUNAS — a lista à esquerda, o ofício aberto à direita
   ══════════════════════════════════════════════════════════════════════════════

   ⚠ ELA NASCEU DE UMA MEDIÇÃO, em 20/08/2026, e o número é o pior desta tela:
   **a Caixa de Entrada media 899px de altura com 242px de conteúdo — 657px mortos,
   73% do maior objeto do Gabinete.** Uma auditoria externa leu a tela como "cara de
   painel administrativo, cheia de espaços mortos" e acertou o sintoma; a causa não
   era a que ela dizia. A caixa nunca foi um bloco de texto passivo: ela é uma carta
   **esticada** pela coluna vizinha, que empilha quatro resumos e fecha nos mesmos
   899px.

   ⚠ E ENCOLHER A BANDEJA JÁ FOI TENTADO E REVERTIDO, na décima primeira sessão, com
   a razão escrita em `45-screen-cabinet.css`: uma bandeja curta com um vão enorme
   embaixo lê como layout inacabado, e um degrau no rodapé custa mais que o vazio
   dentro de um contêiner que se anuncia como contêiner. **O estiramento fica; o que
   muda é o que mora dentro dele.**

   ── POR QUE DUAS COLUNAS RESOLVEM O QUE UMA NÃO RESOLVIA ────────────────────
   Uma lista curta com espaço embaixo lê como caixa de entrada de mês tranquilo —
   que é o que ela é. Uma lista curta com espaço embaixo **e uma moldura em volta**
   lê como capacidade, e não como falha. O que a segunda coluna acrescenta é a
   moldura: a esquerda passa a ser um índice, a direita passa a ser o documento, e
   nenhuma das duas precisa fingir conteúdo para justificar a altura.

   A referência é o inbox do Football Manager, e ela é a mesma do ciclo 4 — o que
   faltava era a segunda metade dela.

   ── O QUE NÃO ENTROU, E A RECUSA É DOUTRINA ─────────────────────────────────
   O dossiê pede que o botão de avançar o mês **trave** enquanto houver ofício
   urgente aberto. Isso é um muro, e a regra de fundação do projeto é a oposta:
   tudo tem preço, nada tem muro. O próprio dossiê escreve a versão certa na frase
   seguinte — "o tempo cobra seu preço" —, e o preço já existe e já está modelado:
   prazo vencido é silêncio, e o silêncio aceita a emenda do relator. O que falta é
   a barra superior DIZER isso antes do clique, e isso não é trabalho desta função. */

/**
 * UMA LINHA DA LISTA — o mesmo ofício, no tamanho de índice.
 *
 * ⚠ ELA NÃO REMONTA NADA. Assunto, remetente e prazo saem do descritor que o
 * `switch` já decidiu, e a tarja sai de `urgencyOf` — a mesma função que pinta o
 * ofício aberto. Uma linha que montasse o próprio assunto seria a oitava ocorrência
 * da família de defeito mais cara deste projeto.
 *
 * ⚠ E A MARCA DE SELEÇÃO É `aria-current`, e não uma classe. O que a linha expressa
 * é "este é o item aberto do conjunto", que é exatamente o que `aria-current`
 * significa — uma classe pintaria a mesma coisa e não diria nada a quem lê por som.
 *
 * @param {Dispatch} dispatch
 * @param {boolean} open
 * @param {boolean} read se o jogador ja abriu esta carta alguma vez
 * @returns {string}
 */
function rowHtml(dispatch, open, read) {
  const urgency = urgencyOf(dispatch.due);

  /* ⚠ O MÊS ENTROU NO ÍNDICE PORQUE A CAPTURA MOSTROU DUAS LINHAS IDÊNTICAS.
     "Pautei o seu texto: Cortar média e alta complexidade · e mais 2", assinado por
     Nílson Camargo, apareceu DUAS VEZES na lista — e as duas estavam certas: são dois
     textos protocolados em meses diferentes, com a mesma etiqueta de pauta. O índice é
     que não dava como distinguir um do outro, e um índice em que duas linhas são a
     mesma linha obriga a abrir as duas para descobrir qual é qual.

     A data é a coluna que toda caixa de entrada tem, e a razão é essa: quando o
     assunto se repete, o que separa é QUANDO.

     ⚠ E O ASSUNTO PASSOU A OCUPAR A LINHA INTEIRA. A primeira versão pôs assunto e
     prazo lado a lado, e a captura mostrou o preço: com o prazo levando 5rem de uma
     coluna de 13, o assunto de uma carta de tramitação quebrou em SETE linhas. Um
     índice com sete linhas por item deixa de ser índice. */
  return (
    `<li>` +
    /* ⚠ A ABERTA DEIXOU DE SER VIDRO E VIROU PAPEL, e o pedido dele diz por que: "na
       mensagem que eu apertar deve ficar com uma cor diferente, pode ser a mesma cor do
       fundo do bloco da mensagem, sabe esse fundo marrom? deixe igual, padronizado".

       ⚠ E ISSO E MAIS DO QUE COR. Com o vidro subindo para a coluna inteira, uma linha de
       vidro dentro de um painel de vidro seria o mesmo material duas vezes — invisivel. O
       que a selecao precisa dizer e "esta linha E o documento ao lado", e a forma direta de
       dizer isso e pinta-la da cor do documento. A classe some do HTML porque a regra
       passou a ser de COR e nao de material; ela vive em `45-screen-cabinet.css`. */
    `<button class="tray__row" type="button" ` +
    `data-dispatch="${escapeHtml(dispatch.id)}"` +
    /* ⚠ A TARJA DA ESQUERDA TEM DOIS DONOS, E NUNCA OS DOIS AO MESMO TEMPO. Numa carta
       com prazo ela e TEMPO — quanto falta para o silencio decidir; numa sem prazo ela e
       PESO — o quanto aquilo se moveu. Uma carta ou tem prazo ou nao tem, entao os dois
       significados nunca disputam a mesma peca.

       ⚠ E OS DOIS RESPONDEM A MESMA PERGUNTA DO OLHO — "o quanto eu preciso me importar
       com esta linha?" —, que e o que permite um canal so servir aos dois. E e isto que
       torna o relatorio mensal possivel: numa bandeja indiferenciada, vinte e quatro
       cartas sao um mural; numa em que o movimento grande grita, sao um arquivo. */
    (urgency ? ` data-urgency="${urgency}"` : "") +
    (!urgency && dispatch.weight ? ` data-weight="${dispatch.weight}"` : "") +
    (open ? ` aria-current="true"` : "") +
    /* ⚠ O NAO LIDO E A UNICA COISA QUE FALTAVA PARA ISTO SER UMA BANDEJA, e a
       referencia e o inbox do Football Manager: la o peso visual principal do indice e
       o item que ainda nao foi aberto. Aqui uma carta que chegou agora tinha exatamente
       a mesma cara de uma que o jogador ja leu tres vezes.
       ⚠ E ELE E ATRIBUTO E NAO CLASSE: e um ESTADO da carta naquele momento, e nao uma
       variante da peca — a mesma razao que pos `data-price` no botao de avancar. */
    (read ? "" : ` data-unread="true"`) +
    `>` +
    `<b class="tray__subject">${escapeHtml(dispatch.subject)}</b>` +
    /* O REMETENTE VEM ABAIXO DO ASSUNTO, e não acima como no ofício aberto: numa
       linha de índice o olho procura O QUE é antes de QUEM é, porque ele está
       escolhendo o que ler. No documento aberto a ordem se inverte, e ela está certa
       nos dois lugares pela mesma razão — a pergunta que o leitor faz ali. */
    /* ⚠ A LINHA NAO CARREGA DATA, e ela ja carregou de tres formas nesta sessao — dentro
       do remetente, como peca propria na ponta direita, e num divisor de mes. As tres
       foram recusadas, e a ultima palavra dele foi a mais curta: "nada de data na linha, a
       data é só na mensagem".

       ⚠ E ELE ESTA CERTO PELA FORMA DO OBJETO. O indice existe para ESCOLHER o que ler, e
       para escolher bastam o assunto e quem assina; a data e o que se le DEPOIS de abrir,
       como em qualquer oficio — ela fica no cabecalho do documento, ao lado de quem
       assinou. Repetida em oito linhas, ela roubava largura de 208px do unico campo que
       decide o clique.

       ⚠ E A DATA VOLTOU — NA BARRA, E NAO NA LINHA, que e a quarta forma e a que ele
       desenhou: "a data vai onde fica a linha fisica hoje; voce retira a linha e troca por
       uma barra horizontal de vidro com a data, e as mensagens daquela data ficam embaixo".
       Dita UMA VEZ sobre as tres cartas de maio ela e cabecalho e pode ser grande; repetida
       nas tres ela era ruido e sumia. Foi o mesmo objeto perdendo tres brigas por estar no
       lugar errado, e ganhando na hora em que virou titulo de grupo. */
    /* ⚠ O REMETENTE SAIU E VOLTOU NO MESMO DIA, e as duas decisoes estao certas porque a
       PECA mudou entre elas. Ele saiu porque "Denise Hollanda Cavalcanti" aparecia em oito
       de oito linhas gastando metade da altura de cada uma — num item de texto solto, um
       campo que quase nunca muda e moldura, e moldura cobrava a mesma tinta do assunto.

       Ele voltou por pedido dele — "coloque o nome de quem enviou embaixo do titulo,
       pequeno e pouco visivel" — e agora ele CABE, porque a linha virou um retangulo de
       vidro com fundo proprio. Dentro de uma peca com contorno, um segundo nivel de tinta
       le como legenda; sem contorno, ele lia como uma segunda frase disputando o olho.

       ⚠ E ELE E SO O NOME, e nunca o cargo. "Denise Hollanda Cavalcanti · Casa Civil" tem
       duas vezes a largura que a coluna tem, e o cargo e o que o cabecalho do oficio aberto
       ja diz — repetir os dois no indice seria pagar duas linhas pela mesma identificacao. */
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

/* QUANTAS LINHAS A COLUNA AGUENTA SEM ROLAR.
   ══════════════════════════════════════════════════════════════════════════════
   ⚠ ELE E MEDIDO, e nao escolhido: a bandeja fecha em 630px numa janela de 980, e uma
   linha do indice mede 50px mais 4 de respiro. Pedido do responsavel, com as palavras
   dele: "empilhar as mensagens, aí elas vão se excluindo sozinhas quando a próxima
   ocuparia mais espaço do que a tela aguenta sem precisar rolar".

   ⚠ ELE ERA 11 E CAIU PARA 9, e quem o derrubou foi a PROVA DO PASSEIO no primeiro mes em
   que a bandeja de fato encheu: "o indice rola 53px para baixo com 11 linhas — a pilha
   estourou". Onze vinha de dividir 630 por 54, que e a linha TIPICA — e a linha tipica nao
   e o teto. Um assunto que quebra em duas linhas mede 66px, e "O baixo clero passou do
   ponto" quebra.

   ⚠ E O TETO E DO PIOR CASO, E NUNCA DO TIPICO. Dimensionar pelo tipico faz a pilha
   estourar exatamente no mes movimentado — que e o unico mes em que ela precisava
   funcionar. Duas linhas de folga num mes calmo custam nada; uma barra de rolagem no mes
   em que tudo acontece custa a leitura.

   ⚠ E ELE DESCEU OUTRA VEZ, DE 9 PARA 8, quando o assunto do indice subiu de
   `--text-note` para `--text-body` — a queixa dele era "mal da pra ler". Corpo maior e
   entrelinha maior: o pior caso foi de 66 para 70px, e 630 ÷ 74 da oito.

   ⚠ E ELE VAI CAIR DE NOVO no dia em que alguem mexer no recuo da linha ou no corpo do
   assunto. Isto NAO se conserta lendo esta prosa: quem o derruba e a prova do passeio.
   Ele ja foi 11, e foi ela que o pegou.

   ⚠ E ELE E UM NUMERO NA VIEW, o que normalmente seria defeito neste projeto. A regra
   dura e "a tela nao refaz conta do motor" — mas isto NAO e conta de motor: e a
   capacidade de uma caixa de vidro, e o motor nao sabe quantos pixels ela tem. O que
   impede o numero de envelhecer nao e um tipo, e o PASSEIO: ha uma prova de navegador
   que reprova se o indice rolar. Mude a altura da linha e ela fica vermelha.

   ── ⚠ E A PILHA TEM UMA TRAVA QUE O PEDIDO NAO MENCIONA ─────────────────────────
   UMA PERGUNTA NUNCA SAI DA PILHA. Descartar uma carta com prazo por falta de espaco
   seria a tela decidindo pelo jogador: ele nunca a veria, `silences` a fecharia sozinha
   no vencimento, e o mes cobraria o preco de um silencio que ninguem escolheu. Isso e um
   MURO com outra cara — e a doutrina inteira deste projeto e que tudo tem preco e nada
   tem muro.

   Como as perguntas chegam PRIMEIRO — a bandeja ja vem ordenada por urgencia —, cortar
   pelo fim da lista tira aviso antes de tirar pergunta sozinho. A trava so existe para o
   caso extremo em que so ha pergunta: ali a pilha estoura de proposito e a coluna volta a
   rolar, porque uma barra de rolagem e mais barata que uma pergunta escondida. */
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

  /* ⚠ O ABERTO ENTRA MESMO SE ELE FOR UM AVISO VELHO. O jogador pode ter clicado numa
     carta que a chegada de hoje empurrou para fora da pilha, e ve-la desaparecer debaixo
     do proprio clique e o tipo de coisa que faz alguem parar de clicar. */
  const room = Math.max(0, capacity - asking.length);
  const kept = rest.slice(0, room);
  if (!asking.includes(current) && !kept.includes(current)) kept.push(current);

  /* A ORDEM ORIGINAL SOBREVIVE ao corte: reordenar aqui faria a pilha embaralhar
     sozinha no mes em que uma carta caisse fora. */
  const staying = new Set([...asking, ...kept]);
  return dispatches.filter(item => staying.has(item));
}

/* ⚠ `reportValue` MORREU EM 21/08/2026, e o registro fica porque a lição não morreu junto.
   Ela formatava um número do relatório escolhendo o formatador pela espécie — reais no
   caixa, contagem nos outros —, e isso continua verdade. O que a matou foi o corpo da
   carta deixar de ser uma leitura de dado e virar OFÍCIO: cada espécie passou a escrever a
   própria frase, e a frase sabe qual formatador ela quer. Uma função que só existia para
   escolher entre dois formatadores num template comum não tem mais template comum. */

/**
 * O CORPO DO RELATORIO, ESCRITO COMO OFICIO.
 *
 * ⚠ ELE ERA UMA LEITURA DE DADO ate 21/08/2026 — "caiu de 24 para 23 de aprovação" —, e o
 * responsável nomeou o defeito: "quero algo como uma mensagem de verdade para um
 * presidente de verdade". Leitura de dado não é mensagem: não tem quem fala, não tem para
 * quem, e não diz o que aquilo significa.
 *
 * ⚠ E CADA ORAÇÃO SE PRENDE A UM FATO, o que é a parte difícil e a única que importa. O
 * número e a direção vêm da carta; a nota que mais sustenta e a mais fraca vêm de
 * `attach`, que SONDA passou a produzir hoje. Uma frase sem número atrás seria o texto
 * opinando, e isso continua recusado mesmo com as ADRs reabertas — o que o projeto proíbe
 * não é o modelo escrever, é a tela AFIRMAR o que o motor não sabe.
 *
 * @param {import("../../state/state.mjs").Letter} letter
 * @param {ReadonlyArray<{ id: string, label: string }>} segments
 * @param {{ base: number, majority: number }} chamber
 * @returns {string}
 */
function reportBody(letter, segments, chamber) {
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
      line(escapeHtml(UI.inbox.seatsHint)) +
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

  /* ── A RUA, E SÓ ELA TEM A CONTA POR TRÁS ─────────────────────────────────
     ⚠ A NOTA QUE SUSTENTA É A MAIOR JÁ PESADA, e não a maior nota crua: o que segura o
     governo numa classe é o produto da nota pelo peso DELA, e é exatamente por isso que a
     mesma inflação agrada uma faixa e é indiferente para outra. A mais fraca é a menor
     NOTA nacional, porque essa é comum às três — dizê-la por classe seria repetir três
     vezes o mesmo número. */
  const data = letter.attach;
  const notes = ["prices", "jobs", "services", "safety", "economy"];

  let holds = null;
  let weakest = null;

  if (data) {
    for (const segment of segments) {
      for (const note of notes) {
        const value = data[`${segment.id}.${note}`] ?? 0;
        if (!holds || value > holds.value) holds = { value, note, segment: segment.label };
      }
    }
    /* A NOTA CRUA SE RECUPERA DE UMA CLASSE COM PESO CONHECIDO? Não — e por isso a mais
       fraca sai da SOMA das três classes, que é monótona no valor da nota: a menor soma é
       a menor nota, sem precisar dividir por peso nenhum. */
    let least = null;
    for (const note of notes) {
      const total = segments.reduce((sum, s) => sum + (data[`${s.id}.${note}`] ?? 0), 0);
      if (!least || total < least.total) least = { total, note };
    }
    weakest = least;
  }

  return (
    `<div class="letter__lines">` +
    line(
      `${escapeHtml(UI.inbox.pollClosed)} <b data-numeric>${seats(now)}%</b> ` +
        `${escapeHtml(UI.inbox.pollGood)} — <b data-numeric>${seats(moved)}</b> ` +
        `${escapeHtml(moved === 1 ? UI.inbox.pollPoint : UI.inbox.pollPoints)} ` +
        `${escapeHtml(way)}`,
    ) +
    (holds
      ? line(
          `${escapeHtml(UI.inbox.pollHolds)} ` +
            `<b>${escapeHtml(labelOf(UI.inbox.annexNote, holds.note))}</b>` +
            `${escapeHtml(UI.inbox.pollHoldsIn)} ` +
            `<b>${escapeHtml(holds.segment)}</b> ` +
            `${escapeHtml(UI.inbox.pollHoldsWeighs)}`,
        )
      : "") +
    (weakest
      ? line(
          `${escapeHtml(UI.inbox.pollDrags)} ` +
            `<b>${escapeHtml(labelOf(UI.inbox.annexNote, weakest.note))}</b>, ` +
            `${escapeHtml(UI.inbox.pollDragsAt)}`,
        )
      : "") +
    `</div>`
  );
}

/**
 * A MANCHETE — verbo e NUMERO, como um despacho.
 *
 * ⚠ ELA JA FOI ROTULO E JA FOI POESIA, e as duas foram recusadas pelo responsavel. A
 * segunda com a palavra certa: "pare com essa poesia, eu quero que seja algo TECNICO,
 * vida real, humanizado".
 *
 *   v1  "A rua se moveu"        rotulo de categoria — diz o assunto, nao o fato
 *   v2  "A rua escorregou"      poesia — diz o tamanho, e nao diz QUANTO
 *   v3  "Aprovação cai a 21%"   noticia — verbo e numero
 *
 * ⚠ O QUE SEPARA A TERCEIRA DAS OUTRAS E O NUMERO NO TITULO. "A base desmanchou" e uma
 * opiniao sobre o tamanho; "Base perde 12 cadeiras" e o fato, e quem forma a opiniao e o
 * leitor — que e o que um documento tecnico faz.
 *
 * ⚠ E O PESO SAIU DA CHAVE. Ele existia para escolher entre "escorregou" e "desmanchou",
 * e com o numero no titulo ele nao tem mais o que decidir: doze e maior que quatro sem
 * ninguem precisar dizer. O peso continua vivo onde ele serve — no rubor da linha do
 * indice, que e onde o olho procura.
 *
 * @param {import("../../state/state.mjs").Letter} letter
 * @returns {string}
 */
function headlineOf(letter) {
  const was = letter.was ?? 0;
  const now = letter.now ?? 0;
  const way = now >= was ? "rose" : "fell";
  const verb = labelOf(UI.inbox.headline, `${letter.kind}.${way}`);

  /* A BASE FALA EM CADEIRAS GANHAS OU PERDIDAS, e nao no total: "Base perde 12 cadeiras" e
     a noticia, e "Base cai a 398" e um placar. As outras duas falam no NIVEL, porque e o
     nivel que decide — 21% de aprovacao e R$ 13,2 bi sao o que o presidente tem, e nao o
     quanto ele mudou. */
  if (letter.kind === "seats") {
    return `${verb} ${seats(Math.abs(now - was))} ${UI.inbox.headlineSeats}`;
  }
  if (letter.kind === "vault") return `${verb} ${money(now)}`;
  return `${verb} ${seats(now)}%`;
}

/* AS CINCO NOTAS, NA ORDEM EM QUE A TABELA AS MOSTRA. Ela e a ordem de `SONDA`, e nao
   uma reordenacao por tamanho: uma tabela cujas colunas trocam de lugar conforme o mes
   deixa de ser tabela e vira quebra-cabeca. */
const ANNEX_NOTES = /** @type {const} */ (["prices", "jobs", "services", "safety", "economy"]);

/**
 * O ANEXO DO CAIXA — de onde vem o que sobra.
 *
 * ⚠ ELE RESPONDE A UNICA PERGUNTA QUE O NUMERO SOZINHO NAO RESPONDE: por que o
 * discricionario e daquele tamanho. Receita menos obrigatoria e o que EXISTE, o teto e o
 * que a regra deixa gastar, e o menor dos dois e o que se pode empenhar — e ver os quatro
 * lado a lado e ver qual dos dois esta mandando no mes.
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
 * ⚠ ELE E O QUE PERMITIU OS TRES AVULSOS CALAREM NO MES CALMO. Enquanto a carta do mes
 * trazia so a rua, a base e o caixa precisavam de uma carta cada para serem vistos — e
 * como o limiar delas estava na mediana, elas escreviam todo mes com o mesmo numero. Aqui
 * as tres cabem em nove celulas, e o jogador compara sem abrir nada.
 *
 * ⚠ E A COLUNA QUE PESA E "AGORA", e nao a maior das duas. Nos outros anexos `data-top`
 * marca o MAIOR valor da linha, porque ali a pergunta e "quem manda"; aqui a pergunta e
 * "onde eu estou", e o passado so existe para dar a direcao.
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
 * O ANEXO DA BASE — bancada por bancada.
 *
 * ⚠ ELE MOSTRA O EIXO QUE O JOGO TEM E NUNCA MOSTROU. "398 cadeiras" e uma soma que
 * esconde a unica coisa acionavel: tres bancadas a 73 e oito em ruptura pedem decisoes
 * opostas, e o agregado nao distingue esse mes do mes em que todas estao em 45. Escolher
 * quem se compra e quem se decepciona e o jogo, e ate hoje a tela nao dizia quem era quem.
 *
 * ⚠ E ELE SO MOSTRA QUEM SE MOVEU, porque uma tabela de onze linhas num oficio de 435px e
 * o Diario Oficial dentro de uma carta — e o risco R2 que este projeto ja nomeou. Quem
 * ficou parado nao e noticia; quem andou, e.
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
 * O ANEXO DA CARTA DA RUA — a cadeia causal, em tabela.
 *
 * ⚠ ELE E A RESPOSTA A "POR QUE A APROVACAO MUDOU", e ate 21/08/2026 o jogo nao tinha
 * como responder: SONDA calculava as cinco notas, pesava cada uma de forma diferente por
 * classe, subtraia a traicao e o desgaste — e devolvia so o numero final. A referencia e
 * o Democracy 4, e ela e do responsavel: la o jogo inteiro e a cadeia causal visivel.
 *
 * ⚠ E NADA AQUI E MULTIPLICADO. Os valores chegam JA PESADOS de `opinionStep`; esta
 * funcao escolhe a ordem das colunas, acha a maior de cada linha e formata. Multiplicar
 * nota por peso aqui daria dois lugares fazendo a conta, e o segundo divergiria no dia em
 * que um peso mudasse — que e o dia em que o anexo precisa estar certo.
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

  const rows = segments
    .map(segment => {
      const values = ANNEX_NOTES.map(note => data[`${segment.id}.${note}`] ?? 0);
      const total = values.reduce((sum, value) => sum + value, 0);
      /* ⚠ A MAIOR DA LINHA GANHA PESO, e e ela que faz a tabela ser legivel de relance:
         sem destaque, cinco numeros por linha sao cinco numeros. Com ele, o olho lê
         "esta classe vive de carestia" sem ler nenhum algarismo. */
      const top = Math.max(...values);

      return (
        `<tr>` +
        `<th scope="row">${escapeHtml(segment.label)}</th>` +
        values
          .map(
            (value, index) =>
              `<td data-numeric${value === top && value > 0 ? ' data-top="true"' : ""} ` +
              `title="${escapeHtml(labelOf(UI.inbox.annexNote, ANNEX_NOTES[index] ?? ""))}">` +
              `${seats(value)}</td>`,
          )
          .join("") +
        `<td data-numeric class="annex__sum">${seats(total)}</td>` +
        `</tr>`
      );
    })
    .join("");

  const wear = data["wear"] ?? 0;
  const betrayal = data["betrayal"] ?? 0;

  return (
    `<section class="annex">` +
    `<h5 class="annex__legend">${escapeHtml(UI.inbox.annexLegend)}</h5>` +
    `<div class="annex__scroll">` +
    `<table class="annex__table">` +
    `<thead><tr><th></th>` +
    ANNEX_NOTES.map(note => `<th>${escapeHtml(labelOf(UI.inbox.annexNote, note))}</th>`).join("") +
    `<th>${escapeHtml(UI.inbox.annexTotal)}</th></tr></thead>` +
    `<tbody>${rows}</tbody>` +
    `</table>` +
    `</div>` +
    /* O PE SO APARECE QUANDO O DESCONTO EXISTE: "a promessa nao honrada tirou 0" todo mes
       e a linha que ensina o olho a pular o pe inteiro. */
    (wear > 0
      ? `<p class="annex__foot">${escapeHtml(UI.inbox.annexWear)} ` +
        `<b data-numeric>${seats(wear)}</b> ${escapeHtml(UI.inbox.annexEveryone)}` +
        (betrayal > 0
          ? `, ${escapeHtml(UI.inbox.annexBetrayal)} <b data-numeric>${seats(betrayal)}</b>`
          : "") +
        `</p>`
      : "") +
    `</section>`
  );
}

/**
 * A BANDEJA INTEIRA — e ela devolve string vazia quando não há carta nenhuma.
 *
 * ⚠ O VAZIO NÃO MORA AQUI, e a divisão é de propósito: o estado vazio da Caixa de
 * Entrada declara O QUE FALTA no mundo — quem ainda não escreve —, e isso é assunto
 * do Gabinete, que é quem sabe o que ele está esperando. Uma bandeja que desenhasse
 * o próprio vazio teria de conhecer o motor que não existe.
 *
 * ⚠ E O OFÍCIO ABERTO CAI NO PRIMEIRO quando o id não acha dono. Isso não é
 * tolerância a erro: é o caso normal do jogo. Uma pergunta respondida sai da bandeja
 * um mês depois, e o id que o jogador tinha aberto deixa de existir sem ninguém
 * clicar em nada — a bandeja abre a carta de cima, que é a mais urgente, porque a
 * lista já chega ordenada por urgência.
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
    /* ⚠ O MATERIAL SUBIU DA LINHA PARA A COLUNA em 21/08/2026, e o print do Football
       Manager que ele mandou e a razao: la o indice e UM painel com fios finos dentro, e
       nao sete cartoes empilhados. A queixa dele foi exata — "ta dificil diferenciar as
       caixas de vidro, data e mensagem" —, e a culpa era minha: eu tinha dado o MESMO
       material para a linha e para a barra de data, e cheguei a escrever "mesmo material,
       de proposito" na prosa. Dois objetos de papeis diferentes com material identico nao
       se distinguem, que e exatamente o que ele viu.

       ⚠ E O MATERIAL DE VERDADE FOI TENTADO AQUI E REPROVOU NA MEDICAO. A ideia era
       `glass-support` — o nivel 3, "informacao que nao se toca", que e o que um continente
       de linhas e — com o argumento de que "sete desfoques viram um". O argumento estava
       ERRADO: as sete linhas nunca tiveram filtro, so a forma dele. Por o filtro no painel
       nao consolidava nada, ADICIONAVA um desfoque de 630px sobre um gradiente que anima.

       `npm run screen` cobrou 17,9 fps contra o braço de controle, e a suite reprovou. A
       forma fica em `45-screen-cabinet.css`, sem filtro — que e o mesmo raciocinio que a
       propria linha ja usava, e que eu contradisse ao propor esta mudanca. */
    `<ul class="tray__list">` +
    /* ⚠ O OFICIO ABERTO NUNCA E "NAO LIDO", e a regra mora AQUI e nao em quem chama.
       Quem decide qual carta abre e esta funcao — `open` e uma preferencia, e o fallback e
       a primeira da lista —, entao qualquer outro lugar que tentasse marcar a aberta como
       lida teria de REFAZER essa decisao, e divergiria dela no mes em que a ordem de
       urgencia mudasse.

       E sem esta linha havia uma contradicao que a captura pegou: a carta que acabou de
       chegar abre sozinha e saía com o ponto de nao lida ao lado, ate o proximo clique — a
       marca dizendo "voce ainda nao viu isto" apontando para o que estava aberto na frente
       do jogador. Quem PERSISTE a leitura e o entrypoint; quem sabe o que esta aberto e a
       bandeja, e as duas coisas nao sao a mesma. */
    shown
      .map((item, index) => {
        /* ⚠ A BARRA NASCE ANTES DE TODO GRUPO, INCLUSIVE O PRIMEIRO — e isso INVERTE a
           regra anterior, que dizia "nunca antes do primeiro: uma regua no topo seria um
           traco separando a lista do nada". A regra valia enquanto a peca era um TRACO:
           separador so existe entre duas coisas. Ela virou CABECALHO, e cabecalho pertence
           ao grupo que vem abaixo dele — o primeiro grupo tem tanto direito a um titulo
           quanto os outros, e sem ele as cartas do mes corrente seriam as unicas orfas. */
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
