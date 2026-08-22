/* GABINETE — a tela inicial, e a unica que so resume. */

import { escapeHtml } from "../shared/html.mjs";
import { headHtml } from "../shared/head.mjs";
import { ribbonHtml } from "../shared/ribbon.mjs";
import { attr, money, percent, seats } from "../shared/format.mjs";
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
 * A LINHA DO NUMERO, com a porta que leva ao lugar de decidir.
 *
 * @param {object} input
 * @param {string} input.value o numero, ja em HTML
 * @param {string} [input.action] o rotulo do botao
 * @param {string} [input.target] a secao para onde ele leva
 * @returns {string}
 */
function leadHtml({ value, action, target }) {
  return (
    `<div class="card__lead">${value}` +
    (action && target
      ? `<button class="card__action glass-action" type="button" ` +
        `data-section="${escapeHtml(target)}">${escapeHtml(action)}</button>`
      : "") +
    `</div>`
  );
}

/* de ser quando o ELENCO nasceu: a Camara passou a ter ONZE bancadas com contagem
   de cadeiras propria. */

/* Ela decifrava as três cores de humor do arco — "com o governo / obstruindo / em ruptura" —
   e nasceu de um defeito caro: três cores sem chave, e um gráfico que só o autor lê. */

/**
 * A tela inteira.
 *
 * @param {object} input
 * @param {string} input.situation o nivel do governo — crisis, stable, growth
 * @param {string} input.verdict a frase que diz o que esta em jogo
 * @param {{ name: string, label: string } | null} [input.adviser] quem assina a leitura
 * @param {number} input.base cadeiras que respondem ao governo
 * @param {number} input.seats o plenario inteiro
 * @param {number} input.majority
 * @param {{ loyal: number, obstructing: number, ruptured: number }} input.split a base por estado
 * @param {ReadonlyArray<{ id: string, label: string, economic: number, seats: number,
 * delivered: number, mood: string }>} input.chamber as bancadas, ja contadas pelo motor
 * @param {ReadonlyArray<{ id: string, label: string, economic: number, seats: number,
 * delivered: number, mood: string }>} input.chamber as onze bancadas, do motor
 * @param {ReadonlyArray<{ id: string, label: string, economic: number, seats: number,
 * delivered: number, mood: string }>} input.chamber as onze bancadas, ja contadas pelo motor
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
 * share: number, pressure: number, boiling: boolean, boil: number }>,
 * rupture: { social: boolean, economic: boolean, political: boolean, open: boolean },
 * ruptures: ReadonlyArray<{ id: string, value: number, threshold: number,
 * breaks: string, open: boolean }>,
 * impeachment: number | null, fallen: number | null }} input.boiler a CALDEIRA, perguntada a `boilerOf`
 * @returns {string}
 */
export function cabinetHtml(input) {
  /* O VEREDITO SOBE PARA CA. */
  /* Ela custava *101px do topo da lâmina** — a cabeça inteira era dimensionada por ela, e não
     pelo título — para dizer em prosa o que a tela já diz em três instrumentos: a Trindade do
     risco logo abaixo, o gel de situação que tinge a tela inteira, e a barra de cima. */
  const head = headHtml({ title: UI.cabinet.title });

  /* ── A CAIXA DE ENTRADA E A COLUNA DA ESQUERDA, CHEIA OU VAZIA ───────────── ⚠ ELA JA FOI
     UMA FAIXA NO TOPO, e a razao escrita era boa: meia tela em branco ao lado de tres cartoes
     cheios leria como defeito de carregamento. */
  const inbox = cardHtml({
    span: "lead",
    body:
      input.inbox === ""
        ? /* ── O VAZIO OCUPA A COLUNA, e nao um paragrafo no alto dela ──────────
             ⚠ ELE VIROU COMPOSICAO NO DIA EM QUE A CAIXA VIROU COLUNA. Como faixa
             no topo, um paragrafo bastava; numa coluna de 700px de altura, o mesmo
             paragrafo encostado no teto deixa um vao enorme embaixo e a tela lê
             como carregamento que travou. O vazio centrado lê como o que e — um
             lugar reservado, com a razao dita.

             A CHAMADA VEM ANTES DA EXPLICACAO porque ela responde a pergunta que o
             olho faz primeiro ("isto esta quebrado?") em cinco palavras, e a prosa
             abaixo responde a segunda ("por que?") para quem quiser. Invertido, o
             jogador lê tres linhas antes de saber se precisa se preocupar. */
          /* Ausencia se declara neste projeto; o que a captura pegou foi ausencia declarada
             com o texto ERRADO. */
          `<div class="empty">` +
          `<p class="empty__lead">` +
          `${escapeHtml(input.resolved ? UI.inbox.quietLead : UI.inbox.firstLead)}</p>` +
          `<p class="empty__note">` +
          (input.resolved ? "" : `${escapeHtml(UI.cabinet.inboxSigned)} `) +
          `${escapeHtml(UI.cabinet.inboxWaiting)}</p>` +
          `</div>`
        : input.inbox,
  });

  const congress = cardHtml({
    body:
      leadHtml({
        value:
          `<p class="card__hero" data-numeric>${seats(input.base)}` +
          `<small>${escapeHtml(UI.cabinet.seats)}</small></p>`,
        action: UI.cabinet.congressAction,
        target: "congress",
      }) + ribbonHtml({ benches: input.chamber, total: input.seats, majority: input.majority }),
  });

  /* O COFRE MOSTRA O QUE SOBRA E O QUE ESTA PRESO, e os dois na mesma barra: a obrigatoria
     nao e contexto, e a razao de o discricionario ser pequeno. */
  const locked = input.revenue > 0 ? Math.min(1, input.mandatory / input.revenue) : 0;

  /* QUANTO O MES JA PASSOU DO QUE CABE.
     LASTRO abre, `committed` e o que as ordens deste mes pediram. */
  const excess = Math.max(0, input.committed - input.room);

  /* ⚠ O ESTOURO E MEDIDO NA LEITURA, E NAO NO VALOR CHEIO. */
  const over = money(excess) === money(0) ? 0 : excess;

  /* ⚠ O HERO E O QUE CABE, E NAO O QUE SOBRA. */
  const vault = cardHtml({
    body:
      leadHtml({
        value:
          `<p class="card__hero" data-numeric>${money(input.room)}` +
          `<small>${escapeHtml(UI.cabinet.vaultFree)}</small></p>`,
        action: UI.nav.finance,
        target: "finance",
      }) +
      `<div class="meter meter--vault" role="img" ` +
      `aria-label="${escapeHtml(`${percent(locked)} ${UI.cabinet.vaultLocked}`)}">` +
      `<span class="meter__part" data-part="poor" style="flex-grow:${(locked * 100).toFixed(1)}"></span>` +
      `<span class="meter__part" data-part="good" style="flex-grow:${((1 - locked) * 100).toFixed(1)}"></span>` +
      `</div>` +
      /* ── O ESTOURO PASSA A TER SINAL ──────────────────────────────────────── ⚠ A TELA
         MOSTRAVA "cabe R$ 14,2 bi" E "ja consome R$ 14,5 bi" LADO A LADO, sem uma cor, sem
         uma palavra. */
      /* Vermelho que cobre tudo nao destaca nada — e a correcao da manha tinha criado
         exatamente o defeito que ela veio corrigir, so que com mais tinta. */
      `<p class="card__note">${escapeHtml(UI.cabinet.vaultLocked)} ` +
      `<b data-numeric>${percent(locked)}</b> · ` +
      (over > 0
        ? `<b data-over="true">${escapeHtml(UI.cabinet.vaultOver)} ` +
          `<b data-numeric>${money(over)}</b></b>`
        : `${escapeHtml(UI.cabinet.vaultTaken)} <b data-numeric>${money(input.committed)}</b>`) +
      `</p>` +
      /* ── DO REAL TRAVADO ATE O TEXTO QUE O TRAVOU ──────────────────────────── ⚠ ELA E A
         METADE DO RISCO R2 QUE FALTAVA, e uma revisao externa a cobrou com todas as letras:
         "a barra diz que 95% e obrigatorio, mas nao ha como investigar quais leis herdadas
         estao sugando esse dinheiro". */
      (input.locked[0]
        ? `<p class="locked">` +
          `<span class="locked__item" data-guard="${escapeHtml(input.locked[0].guard)}">` +
          `${escapeHtml(input.locked[0].label)} ${escapeHtml(UI.cabinet.vaultWho)} ` +
          `<b data-numeric>${money(input.locked[0].spend)}</b></span></p>`
        : ""),
  });

  /* A RUA POR SEGMENTO, e nao a media. */
  const street = cabinetStreetHtml(input);
  const boiler = boilerCardHtml(input);

  return (
    `<section class="area glass-stage cabinet">` +
    head +
    trinityHtml(input) +
    /* O ciclo 10 acrescentou a ⚠ E `1 / -1` NAO CONSERTA, o que me custou uma tentativa: `-1`
       conta a ultima linha da grade EXPLICITA, e aqui todas as linhas sao implicitas.
       CALDEIRA, ninguem voltou aqui, e a coluna da esquerda passou a terminar uma
       linha antes da direita — um degrau que so a captura mostra, porque nada falha:
       o `span` continua sendo um span valido. */
    `<div class="cards">${inbox}` +
    `<div class="cards__side">${congress}${vault}${boiler}${street}</div>` +
    `</div>` +
    `</section>`
  );
}

/**
 * Consertado o achado 31, o pais passou a se degradar e os dois passaram a andar — medido: o
 * setor produtivo vai a 33 e as forcas de ordem a 35 em 48 meses, contra ZERO antes.
 *
 * @param {object} input
 * @param {{ ruptures: ReadonlyArray<{ id: string, value: number, threshold: number,
 * breaks: string, open: boolean }> }} input.boiler
 * @returns {string}
 */
function trinityHtml({ boiler }) {
  const rows = boiler.ruptures
    .map(item => {
      const label = UI.cabinet.trinity[/** @type {"social"} */ (item.id)];

      /* Ela MENTIA, e a captura pegou: com a rua em 44 e o piso em 20, a conta dava 70% e a
         barra aparecia quase cheia e vermelha num governo confortavel. */
      const safe =
        item.breaks === "below" ? item.value > item.threshold : item.value < item.threshold;

      return (
        `<div class="trinity__item"${item.open ? ' data-open="true"' : ""}>` +
        `<span class="trinity__who">${escapeHtml(label)}</span>` +
        `<span class="trinity__value" data-numeric>${seats(item.value)}` +
        `<small>${escapeHtml(item.breaks === "below" ? UI.cabinet.trinityBelow : UI.cabinet.trinityAbove)} ` +
        `${seats(item.threshold)}</small></span>` +
        /* O VALOR E A MARCA SAO DADO, e por isso vao em estilo inline — a mesma excecao
           declarada do `--floor` no trilho do orcamento. */
        `<div class="gauge" role="img"${safe ? "" : ' data-past="true"'} ` +
        `style="--index:${attr(Math.round(item.value))};--mark:${attr(item.threshold)}" ` +
        `aria-label="${escapeHtml(`${label}: ${seats(item.value)}`)}"></div>` +
        `</div>`
      );
    })
    .join("");

  /* ⚠ O RODAPE DIZ O QUE AINDA SEGURA O GOVERNO DE PE, e nao quantas romperam. */
  const holding = boiler.ruptures.filter(item => !item.open).length;

  return (
    `<section class="trinity"${boiler.ruptures.every(i => i.open) ? ' data-open="true"' : ""}>` +
    `<h3 class="block__legend">${escapeHtml(UI.cabinet.trinityTitle)}` +
    `<span>${escapeHtml(holding === 0 ? UI.cabinet.trinityNone : UI.cabinet.trinityHold)}</span></h3>` +
    `<div class="trinity__row">${rows}</div>` +
    `</section>`
  );
}

/**
 * O TERMOMETRO DA RUA.
 *
 * @param {object} input
 * @param {ReadonlyArray<{ id: string, label: string, spend: number, guard: string }>} input.locked
 * o que mais prende a obrigatoria, e a natureza da norma que prende
 * @param {ReadonlyArray<Segment>} input.segments
 * @param {Record<string, Approval>} input.street
 * @returns {string}
 */
function cabinetStreetHtml({ segments, street }) {
  const rows = segments
    .map(segment => {
      const poll = street[segment.id];
      if (!poll) return "";

      /* Ate cada uma tinha a propria grade — 7,5rem aqui, 9rem la —, e as duas moram uma
         embaixo da outra na mesma coluna do Gabinete: as barras comecavam em pontos
         diferentes e o olho lia desalinho sem conseguir nomear a causa. */
      /* ⚠ A DESCRICAO NOMEIA AS TRES FATIAS, e nao so a verde. */
      const described = /** @type {const} */ (["good", "fair", "poor"])
        .map(part => `${poll[part]}% ${UI.approvalParts[part]}`)
        .join(", ");

      return (
        `<div class="street__row reading">` +
        `<span class="street__who">${escapeHtml(segment.label)}</span>` +
        `<div class="meter" role="img" ` +
        `aria-label="${escapeHtml(`${segment.label}: ${described}`)}">` +
        /** @type {const} */ (["good", "fair", "poor"])
          .map(
            part =>
              `<span class="meter__part" data-part="${part}" style="flex-grow:${poll[part]}"></span>`,
          )
          .join("") +
        `</div>` +
        `<span class="reading__value" data-numeric>${poll.good}%</span>` +
        `</div>`
      );
    })
    .join("");

  /* Sem chave, o jogador nao tem como saber se `27%` e a verde, a vermelha ou a soma; com
     chave, a posicao responde sozinha. */
  const key =
    `<div class="street__key reading">` +
    `<p class="street__poles">` +
    `<span>${escapeHtml(UI.approvalParts.good)}</span>` +
    `<span>${escapeHtml(UI.approvalParts.poor)}</span>` +
    `</p>` +
    `</div>`;

  return cardHtml({ body: `<div class="street">${rows}${key}</div>` });
}

/**
 * ⚠ ELA E UM CARTAO SEPARADO DA RUA, e a separacao e a modelagem: a Rua mede quem APROVA o
 * governo; esta mede quem consegue DERRUBA-LO.
 *
 * A CALDEIRA — os quatro grupos que conseguem derrubar um presidente.
 * @param {object} input
 * @param {{ lobbies: ReadonlyArray<{ id: string, label: string, wants: string,
 * share: number, pressure: number, boiling: boolean, boil: number }>,
 * rupture: { social: boolean, economic: boolean, political: boolean, open: boolean },
 * impeachment: number | null, fallen: number | null }} input.boiler
 * @returns {string}
 */
function boilerCardHtml({ boiler }) {
  const rows = boiler.lobbies
    .map(
      lobby =>
        `<div class="boiler__row reading"${lobby.boiling ? ' data-boiling="true"' : ""}>` +
        /* Dois nomes para o mesmo limiar seriam o defeito que a guarda `vocabulary` existe
           para pegar. */
        `<span class="boiler__who">${escapeHtml(lobby.label)}` +
        `<small class="boiler__share">` +
        (lobby.share > 0
          ? `${percent(lobby.share)} ${escapeHtml(UI.cabinet.boilerShare)}`
          : escapeHtml(UI.cabinet.boilerNoShare)) +
        `</small></span>` +
        /* ⚠ O DESEJO VOLTA QUANDO ELE FERVE, e aí ele deixa de ser legenda e vira aviso. */
        (lobby.boiling ? `<span class="boiler__wants">${escapeHtml(lobby.wants)}</span>` : "") +
        `<div class="gauge" role="img"${lobby.boiling ? ' data-past="true"' : ""} ` +
        `style="--index:${attr(Math.round(lobby.pressure))};--mark:${attr(lobby.boil)}" ` +
        `aria-label="${escapeHtml(`${lobby.label}: ${Math.round(lobby.pressure)} ${UI.cabinet.boilerMeter}`)}"></div>` +
        `<span class="boiler__value reading__value" data-numeric>${Math.round(lobby.pressure)}</span>` +
        `</div>`,
    )
    .join("");

  /* AS RUPTURAS ABERTAS, NOMEADAS. */
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
        : /* ⚠ E O SILÊNCIO É O ESTADO NORMAL, ENTÃO ELE NÃO IMPRIME LINHA. Até
             20/08/2026 esta frase dizia "nenhuma ruptura aberta" todo mês em que nada
             acontecia — que é a maioria dos meses de um governo que funciona. A regra
             contrária já estava escrita duas vezes neste projeto, e nos dois casos com
             a mesma razão: "uma legenda que lista 'em ruptura: 0' todo mês ensina o
             olho a ignorar a linha inteira — e aí, no mês em que a ruptura acontecer,
             ela aparece num lugar que o jogador já parou de ler".

             Pedido do responsável, na mesma sessão: "tire o máximo de texto inútil da
             tela". Uma linha que só diz que nada aconteceu é a definição disso. */
          open.length > 0
          ? `<p class="boiler__ruptures">${escapeHtml(UI.cabinet.rompeu)} ` +
            `<b>${open.map(escapeHtml).join(" · ")}</b></p>`
          : "";

  return cardHtml({ body: `<div class="boiler">${rows}</div>${foot}` });
}
