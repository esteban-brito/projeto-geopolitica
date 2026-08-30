/* GABINETE — a tela inicial, e a unica que so resume.
   ⚠ ELA FALA A LINGUA DA CAIXA DESDE O CICLO 15, e antes falava a propria: 18 classes de
   estilo em quatro blocos e TRES instrumentos para a mesma pergunta — `gauge`, `meter` e
   `poles` respondiam todos "onde este numero esta na regua dele?". Cada bloco tinha sido
   desenhado sozinho, e cada um resolveu o mesmo problema de um jeito.
   ⚠ AGORA SAO BLOCOS DENTRO DE BLOCOS, e a peca vem de `src/ui/shared/`: a coluna e a mesma
   moldura da caixa, com a mesma linha dentro. O que muda entre as duas e a SUBSTANCIA, e ela
   e do contexto — papel na carta, vidro na coluna. */

import { escapeHtml } from "../shared/html.mjs";
import { money, percent } from "../shared/format.mjs";
import { chamberRows, lineHtml, linesHtml, rupturesRows } from "../shared/annex.mjs";
import { UI } from "../strings.mjs";

/**
 * @typedef {import("../../domain/opinion/index.mjs").Approval} Approval
 * @typedef {import("../../data/opinion.mjs").Segment} Segment
 */

/**
 * @param {object} input
 * @param {string} input.body
 * @param {string} [input.span] `lead` ocupa a coluna da esquerda
 * @returns {string}
 */
function cardHtml({ body, span }) {
  return (
    `<section class="card"${span ? ` data-span="${span}"` : ""}>` +
    `<div class="card__body">${body}</div>` +
    `</section>`
  );
}

/**
 * PARA QUE LADO A LEITURA ANDOU — ou `null` quando nao ha com que comparar.
 *
 * ⚠ AUSENCIA NAO E RESULTADO: numa recarga nao existe mes anterior, e desenhar "nao moveu"
 * ali afirmaria que nada andou num mandato em que tudo andou.
 * ⚠ E O LIMIAR E O DA LEITURA ARREDONDADA: as duas colunas imprimem inteiro, e uma seta ao
 * lado de um numero que nao mudou na tela faz a cor negar o numero.
 *
 * @param {number} now
 * @param {number | undefined} before
 * @param {1 | -1} good 1 quando subir e bom; -1 quando subir e ruim
 * @returns {"up" | "down" | "flat" | null}
 */
function directionOf(now, before, good) {
  if (before === undefined) return null;
  const moved = now - before;
  if (Math.abs(moved) < 0.5) return "flat";
  return moved * good > 0 ? "up" : "down";
}

/**
 * A tela inteira.
 *
 * @param {object} input
 * @param {number} input.base cadeiras que respondem ao governo
 * @param {number} input.seats o plenario inteiro
 * @param {number} input.majority
 * @param {boolean} input.resolved se ALGUM mes ja foi resolvido. ⚠ Ele existe para o
 * estado vazio escolher a frase verdadeira, e sai do MES do estado e nao do relatorio
 * em memoria: o relatorio nao vai para o save, e o mes vai
 * @param {string} input.inbox a BANDEJA ja montada — lista e oficio aberto —, e vazia
 * enquanto o mundo nao escreve. ⚠ Ela chega pronta de `trayHtml` em vez de as cartas
 * chegarem soltas: quem decide qual oficio esta aberto e a bandeja, e o Gabinete nao
 * tem por que saber que existe um aberto
 * @param {number} input.room o discricionario que cabe no mes
 * @param {number} input.committed o que as ordens do mes ja comprometeram
 * @param {number} input.mandatory a despesa obrigatoria anualizada
 * @param {number} input.revenue a receita anualizada
 * @param {ReadonlyArray<{ id: string, label: string, spend: number, guard: string }>} input.locked
 * o que mais prende a obrigatoria, e a natureza da norma que prende
 * @param {ReadonlyArray<Segment>} input.segments
 * @param {Record<string, Approval>} input.street a pesquisa de cada segmento
 * @param {{ lobbies: ReadonlyArray<{ id: string, label: string, wants: string,
 * share: number, pressure: number, boiling: boolean, boil: number,
 * fall: number | null }>,
 * rupture: { social: boolean, economic: boolean, political: boolean, open: boolean },
 * ruptures: ReadonlyArray<{ id: string, value: number, threshold: number,
 * breaks: string, open: boolean }>,
 * impeachment: number | null, fallen: number | null }} input.boiler a CALDEIRA, perguntada a `boilerOf`
 * @param {{ pressure: Record<string, number>, street: Record<string, Approval> } | null}
 * [input.before] o quadro do mes passado, e ele NAO vem do save: e a memoria de uma pintura,
 * como a das setas da barra de cima. Numa recarga ele volta nulo e nenhuma seta e desenhada
 * @returns {string}
 */
export function cabinetHtml(input) {
  /* ── A CAIXA DE ENTRADA E A COLUNA DA ESQUERDA, CHEIA OU VAZIA ───────────── ⚠ O VAZIO
     OCUPA A COLUNA, e nao um paragrafo no alto dela: num vao de 700px o paragrafo encostado
     no teto le como carregamento que travou. A chamada vem antes da explicacao porque ela
     responde em cinco palavras a pergunta que o olho faz primeiro. */
  const inbox = cardHtml({
    span: "lead",
    body:
      input.inbox === ""
        ? `<div class="empty">` +
          `<p class="empty__lead">` +
          `${escapeHtml(input.resolved ? UI.inbox.quietLead : UI.inbox.firstLead)}</p>` +
          `<p class="empty__note">` +
          (input.resolved ? "" : `${escapeHtml(UI.cabinet.inboxSigned)} `) +
          `${escapeHtml(UI.cabinet.inboxWaiting)}</p>` +
          `</div>`
        : input.inbox,
  });

  /* ── 1 · O RISCO DE QUEDA ──────────────────────────────────────────────────
     ⚠ ELE ERA UMA FAIXA DE LARGURA INTEIRA no topo, e dizia a MESMA coisa que o bloco da
     caldeira 300px abaixo — com "Parlamentares" saindo nos dois com o mesmo 83 e limiares
     DIFERENTES: "rompe acima de 86" em cima, "abandonam acima de 68" embaixo. Os dois numeros
     estavam certos e mediam coisas diferentes, e nada na tela dizia isso. */
  const risk = linesHtml(UI.cabinet.trinityTitle, rupturesRows(input.boiler.ruptures));

  const boiler = boilerBlock(input);

  /* ── 3 · A CAMARA — a mesma leitura que a carta do plenario ja da ─────────── */
  const chamber = linesHtml(
    UI.cabinet.blockCongress,
    chamberRows(input.base, input.majority, input.seats),
    { door: "congress" },
  );

  const vault = vaultBlock(input);
  const street = streetBlock(input);

  return (
    /* ⚠ ELA NAO TEM CABECA, e e a unica tela assim: o titulo dizia o nome de uma tela que o
       rail ja marca, em 25,6px de serifa, e a faixa de risco que morava logo abaixo desceu
       para a coluna. Quem nomeia agora e a legenda da bandeja, na fonte das outras legendas. */
    `<section class="area glass-stage cabinet">` +
    /* ⚠ A ORDEM DA COLUNA E A DA CONSEQUENCIA, e ela era a da contabilidade: o que decide se a
       PARTIDA ACABA dividia espaco igual com a nota de rodape do cofre. */
    `<div class="cards">${inbox}` +
    `<div class="cards__side">${risk}${boiler}${chamber}${vault}${street}</div>` +
    `</div>` +
    `</section>`
  );
}

/**
 * ⚠ ELE E UM BLOCO SEPARADO DA RUA, e a separacao e a modelagem: a Rua mede quem APROVA o
 * governo; este mede quem consegue DERRUBA-LO.
 *
 * @param {Parameters<typeof cabinetHtml>[0]} input
 * @returns {string}
 */
function boilerBlock({ boiler, before }) {
  const rows = boiler.lobbies
    .map(lobby =>
      lineHtml({
        who: lobby.label,
        /* ⚠ O PESO DO GRUPO E LEITURA, e nao rotulo de leitor de tela: um dos quatro pesa
           ZERO, e quem enxergava via quatro barras iguais e gastava capital acalmando um
           grupo que nao conta para a conta. E o zero nao imprime "0%": ele nao pesa POUCO. */
        aside: lobby.share > 0 ? percent(lobby.share) : UI.cabinet.boilerNoWeight,
        /* ⚠ PRESSAO SUBINDO E RUIM, e por isso o sinal se inverte. */
        trend: directionOf(lobby.pressure, before?.pressure[lobby.id], -1),
        share: lobby.pressure,
        /* ⚠ A SEGUNDA MARCA E DO FIADOR: um grupo tem DUAS linhas na mesma regua — abandona o
           governo em `boil`, e em `fall` a ruptura politica abre. */
        mark: lobby.boil,
        ...(lobby.fall === null ? {} : { fall: lobby.fall }),
        past: lobby.boiling,
        label:
          `${lobby.label}: ${Math.round(lobby.pressure)} ${UI.cabinet.boilerMeter}, ` +
          `${UI.cabinet.boilerBreaks} ${lobby.boil}` +
          (lobby.fall === null
            ? ""
            : `, ${UI.cabinet.trinityTitle.toLowerCase()} ${UI.cabinet.boilerAt} ${lobby.fall}`),
        value: String(Math.round(lobby.pressure)),
        ...(lobby.boiling ? { tone: "crisis" } : {}),
      }),
    )
    .join("");

  /* ⚠ UMA LINHA PARA AS QUATRO, e nao uma por linha: o ponto de fervura e UM numero do
     catalogo, o mesmo para todos os grupos, entao repeti-lo quatro vezes seria a legenda
     estatica que este projeto ja pagou duas vezes. No dia em que um grupo tiver o proprio,
     ela cala em vez de mentir. ⚠ E O NUMERO CONTINUA ESCRITO: a marca diz ONDE, e nao QUANTO. */
  const boil = boiler.lobbies[0]?.boil ?? 0;
  const same = boiler.lobbies.every(lobby => lobby.boil === boil);
  const edge = same ? lineHtml({ who: UI.cabinet.boilerBreaks, value: String(boil) }) : "";

  /* AS RUPTURAS ABERTAS, NOMEADAS. ⚠ E O SILENCIO E O ESTADO NORMAL, ENTAO ELE NAO IMPRIME
     LINHA: uma legenda que lista "em ruptura: 0" todo mes ensina o olho a ignorar a linha, e
     ai, no mes em que a ruptura acontecer, ela aparece onde o jogador ja parou de ler. */
  const open = [
    boiler.rupture.social ? UI.cabinet.ruptureSocial : "",
    boiler.rupture.economic ? UI.cabinet.ruptureEconomic : "",
    boiler.rupture.political ? UI.cabinet.rupturePolitical : "",
  ].filter(Boolean);

  const foot =
    boiler.fallen !== null
      ? `<p class="boiler__siege"><b class="stamp">${escapeHtml(UI.cabinet.fallen)}</b> ` +
        `${escapeHtml(UI.cabinet.fallenNote)}</p>`
      : boiler.impeachment !== null
        ? `<p class="boiler__siege"><b class="stamp">${escapeHtml(UI.cabinet.siege)}</b> ` +
          `${escapeHtml(UI.cabinet.siegeNote)}</p>`
        : open.length > 0
          ? `<p class="boiler__ruptures">${escapeHtml(UI.cabinet.rompeu)} ` +
            `<b>${open.map(escapeHtml).join(" · ")}</b></p>`
          : "";

  return linesHtml(UI.cabinet.blockBoiler, rows + edge, { foot });
}

/* Quantos gastos presos cabem na coluna. `lockedBy` devolve tres; o terceiro so aparece em
   Financas, que e a tela do assunto. */
const GASTOS_PRESOS = 2;

/**
 * ⚠ ELE RESPONDE NA ORDEM EM QUE A PERGUNTA NASCE: quanto sobra, por que sobra tao pouco, e o
 * que ja foi comprometido. A nota abaixo do percentual da a base — sem ela, "95%" nao diz 95%
 * de que.
 *
 * @param {Parameters<typeof cabinetHtml>[0]} input
 * @returns {string}
 */
function vaultBlock(input) {
  /* A obrigatoria nao e contexto: e a razao de o discricionario ser pequeno. */
  const locked = input.revenue > 0 ? Math.min(1, input.mandatory / input.revenue) : 0;
  const excess = Math.max(0, input.committed - input.room);
  /* ⚠ O ESTOURO E MEDIDO NA LEITURA, E NAO NO VALOR CHEIO. */
  const over = money(excess) === money(0) ? 0 : excess;

  const rows =
    /* ⚠ SEM BARRA, e a ausencia e honesta: nao existe teto MENSAL contra o que medir o que
       sobra — o teto do arcabouco mede o ano. */
    lineHtml({ who: UI.cabinet.vaultFree, value: money(input.room) }) +
    lineHtml({
      who: UI.cabinet.vaultLocked,
      share: locked * 100,
      value: percent(locked),
      /* ⚠ ELA VOLTOU A SER NOTA, e agora cabe: a coluna do valor tem largura FIXA desde a
         padronizacao, entao a base do percentual nao estica mais a pista dos outros blocos. */
      aside: `${UI.cabinet.vaultOfRevenue} ${money(input.revenue)}`,
      label: `${percent(locked)} ${UI.cabinet.vaultLocked}`,
    }) +
    /* ⚠ O COMPROMETIDO SO APARECE QUANDO DIFERE DO QUE SOBRA: num governo que nao toca em
       nada as duas leituras imprimem o MESMO numero em 44 de 49 meses. */
    (over > 0
      ? lineHtml({ who: UI.cabinet.vaultOver, value: money(over), tone: "crisis" })
      : money(input.committed) === money(input.room)
        ? ""
        : lineHtml({ who: UI.cabinet.vaultTaken, value: money(input.committed) })) +
    /* ── DO REAL TRAVADO ATE O TEXTO QUE O TRAVOU ────────────────────────────
       ⚠ ERA UMA FRASE CORRIDA EM LETRA MIUDA — tres numeros um atras do outro — e virou tres
       linhas. Uma lista escrita como frase e uma lista que ninguem le. */
    /* ⚠ DOIS, E NAO TRES: com o tipo maior cada linha custa 26px, e o terceiro maior gasto
       preso e o primeiro item que a porta `DINHEIRO DO MES ›` ja entrega inteiro em Financas. */
    input.locked
      .slice(0, GASTOS_PRESOS)
      .map(item => lineHtml({ who: item.label, value: money(item.spend) }))
      .join("");

  return linesHtml(UI.cabinet.blockVault, rows, { door: "finance" });
}

/**
 * O TERMOMETRO DA RUA.
 *
 * ⚠ AS TRES FATIAS SAIRAM: a pergunta que o bloco responde e "qual classe esta pior", e uma
 * pista responde. E a mesma decisao que a carta da rua ja tomou, e la ela tirou 15 celulas.
 *
 * @param {Parameters<typeof cabinetHtml>[0]} input
 * @returns {string}
 */
function streetBlock({ segments, street, before }) {
  const rows = segments
    .map(segment => {
      const poll = street[segment.id];
      if (!poll) return "";

      return lineHtml({
        who: segment.label,
        trend: directionOf(poll.good, before?.street[segment.id]?.good, 1),
        share: poll.good,
        value: `${poll.good}%`,
        label: `${segment.label}: ${poll.good}% ${UI.approvalParts.good}`,
      });
    })
    .join("");

  return linesHtml(UI.cabinet.blockStreet, rows);
}
