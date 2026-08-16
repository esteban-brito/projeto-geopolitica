/* GABINETE — a tela inicial, e a unica que so resume. Views PURAS.
   ══════════════════════════════════════════════════════════════════════════════

   ── ELA SUBSTITUI A MESA, E NAO E A MESA COM OUTRO NOME ─────────────────────
   A Mesa misturava duas coisas: o resumo do mes e a mesa de negociacao. Quem
   abria o jogo caia no meio de uma decisao — placar, bancadas e controles de
   verba — sem antes saber como o pais estava. Agora sao duas telas: aqui se
   ENTENDE, e no Congresso se DECIDE.

   ── O GABINETE NAO DECIDE NADA ──────────────────────────────────────────────
   Ele e a segunda tela sem controle, depois de Financas, e a diferenca entre as
   duas e o proposito: Financas e o placar que se consulta, o Gabinete e o
   despacho que se resolve. Cada cartao aqui LEVA ao lugar onde a decisao mora —
   e essa e a mesma razao que separou a area da Mesa: decidir onde nao se ve a
   consequencia e decidir no escuro.

   ── A REFERENCIA E O INBOX DO FOOTBALL MANAGER ──────────────────────────────
   E ela nao e estetica: um dashboard de cartoes e a forma que resolve o problema
   de "o mundo tem coisas a me dizer e eu preciso escolher a quais responder".
   Enquanto o mundo nao fala — Congresso, relator e tribunal ainda nao escrevem —,
   a caixa de entrada declara a espera em vez de fingir conteudo. */

import { escapeHtml } from "../shared/html.mjs";
import { headHtml } from "../shared/head.mjs";
import { hemicycleHtml } from "../shared/hemicycle.mjs";
import { money, percent, seats } from "../shared/format.mjs";
import { UI } from "../strings.mjs";

/**
 * @typedef {import("../../domain/opinion/index.mjs").Approval} Approval
 * @typedef {import("../../data/opinion.mjs").Segment} Segment
 */

/**
 * @param {object} input
 * @param {string} input.title
 * @param {string} input.body
 * @param {string} [input.action] o rotulo do botao que leva ao lugar de decidir
 * @param {string} [input.target] a secao para onde ele leva
 * @param {string} [input.span] `wide` ocupa a coluna inteira
 * @returns {string}
 */
function cardHtml({ title, body, action, target, span }) {
  return (
    `<section class="card"${span ? ` data-span="${span}"` : ""}>` +
    `<h3 class="card__title">${escapeHtml(title)}` +
    (action && target
      ? `<button class="card__action" type="button" data-section="${escapeHtml(target)}">` +
        `${escapeHtml(action)}</button>`
      : "") +
    `</h3>` +
    `<div class="card__body">${body}</div>` +
    `</section>`
  );
}

/* ── O ARCO MORREU AQUI EM 15/08/2026, e o hemiciclo o substituiu ───────────
   `archHtml` desenhava a base efetiva repartida em tres fatias — leal, obstruindo,
   rompida — e a prosa dele trazia a razao de NAO desenhar 513 cadeiras: "o modelo
   nao tem deputado individual, ele tem quatro blocos". Aquilo era verdade e deixou
   de ser quando o ELENCO nasceu: a Camara passou a ter ONZE bancadas com contagem
   de cadeiras propria.

   ⚠ E A SUBSTITUICAO E A DECISAO, e nao a convivencia. Os dois pareciam responder
   perguntas diferentes — o arco, "quao saudavel e minha base?"; o hemiciclo, "de que
   a Camara e feita?" —, mas o hemiciclo responde as DUAS: a cor de cada cadeira e a
   saude da bancada dela, e a cadeira cheia contra a vazada e a base efetiva. O arco
   virou um subconjunto, e manter os dois seria a mesma verdade em dois desenhos no
   mesmo cartao.

   O que sobreviveu inteiro dele foi a LEGENDA, e a licao que a criou: tres cores sem
   chave e um grafico que so o autor lê. Ver `src/ui/shared/hemicycle.mjs`. */

/**
 * A LEGENDA DO ARCO — e ela nao e enfeite.
 *
 * ⚠ TRES CORES SEM CHAVE E UM GRAFICO QUE SO O AUTOR LÊ, e este arco passou um dia
 * inteiro assim: as fatias estavam certas, o motor sabia o que cada uma dizia, e a
 * tela nao dizia nada. Uma revisao de fora leu o arco como "um macarrao verde" — e
 * leu certo, porque no primeiro mes as quatro bancadas estao no mesmo humor e ha
 * UMA fatia so. Sem legenda, nao havia como saber que aquela cor significa alguma
 * coisa, nem que existem outras duas.
 *
 * ⚠ SO ENTRA QUEM TEM CADEIRA. Uma legenda que lista "em ruptura: 0" todo mes
 * ensina o olho a ignorar a linha inteira — e ai, no mes em que a ruptura
 * acontecer, ela aparece num lugar que o jogador ja parou de ler. Legenda e
 * consequencia do desenho, e nao um indice fixo dele.
 *
 * @param {{ loyal: number, obstructing: number, ruptured: number }} split
 * @returns {string}
 */
function legendHtml(split) {
  const parts = /** @type {const} */ ([
    ["good", split.loyal, UI.cabinet.archLoyal],
    ["fair", split.obstructing, UI.cabinet.archObstructing],
    ["poor", split.ruptured, UI.cabinet.archRuptured],
  ]);

  const rows = parts
    .filter(([, value]) => Math.round(value) > 0)
    .map(
      ([part, value, label]) =>
        `<span class="legend__item" data-part="${part}">` +
        `<b data-numeric>${seats(value)}</b> ${escapeHtml(label)}</span>`,
    )
    .join("");

  return `<p class="legend">${rows}</p>`;
}

/**
 * A tela inteira.
 *
 * @param {object} input
 * @param {string} input.situation o nivel do governo — crisis, stable, growth
 * @param {string} input.verdict a frase que diz o que esta em jogo
 * @param {{ name: string, label: string } | null} input.adviser quem assina a leitura
 * @param {{ name: string, label: string } | null} [input.adviser] quem assina a leitura
 * @param {number} input.base cadeiras que respondem ao governo
 * @param {number} input.seats o plenario inteiro
 * @param {number} input.majority
 * @param {{ loyal: number, obstructing: number, ruptured: number }} input.split a base por estado
 * @param {ReadonlyArray<{ id: string, label: string, economic: number, seats: number,
 *   delivered: number, mood: string }>} input.chamber as bancadas, ja contadas pelo motor
 * @param {ReadonlyArray<{ id: string, label: string, economic: number, seats: number,
 *   delivered: number, mood: string }>} input.chamber as onze bancadas, do motor
 * @param {ReadonlyArray<{ id: string, label: string, economic: number, seats: number,
 *   delivered: number, mood: string }>} input.chamber as onze bancadas, ja contadas pelo motor
 * @param {ReadonlyArray<string>} input.inbox as cartas do mes, ja em HTML; vazia enquanto o mundo nao escreve
 * @param {number} input.room o discricionario que cabe no mes
 * @param {number} input.committed o que as ordens do mes ja comprometeram
 * @param {number} input.mandatory a despesa obrigatoria anualizada
 * @param {number} input.revenue a receita anualizada
 * @param {ReadonlyArray<{ id: string, label: string, spend: number, guard: string }>} input.locked
 *   o que mais prende a obrigatoria, e a natureza da norma que prende
 * @param {ReadonlyArray<Segment>} input.segments
 * @param {Record<string, Approval>} input.street a pesquisa de cada segmento
 * @param {{ lobbies: ReadonlyArray<{ id: string, label: string, wants: string,
 *   pressure: number, boiling: boolean }>,
 *   rupture: { social: boolean, economic: boolean, political: boolean, open: boolean },
 *   impeachment: number | null, fallen: number | null }} input.boiler a CALDEIRA, perguntada a `boilerOf`
 * @returns {string}
 */
export function cabinetHtml(input) {
  /* O VEREDITO SOBE PARA CA. Ele morava no rail da direita, que deixou de
     existir — e este e o lugar certo: ele e a leitura do governo inteiro, e o
     Gabinete e a tela do governo inteiro.

     ⚠ ELE GANHOU UM ROTULO, e a razao veio de uma revisao de fora: a frase estava
     SOLTA no canto superior direito, sem nada que justificasse a existencia dela, e
     lia como texto esquecido na tela. O rotulo nao e enfeite — ele responde a
     pergunta que o leitor faz antes de qualquer outra: quem esta falando isto, e
     sobre o que. Sem ele, uma frase em prosa no meio de uma tela de numeros parece
     sobra de outro layout.

     ⚠ E O ROTULO DEIXOU DE SER DESTA TELA, em 15/08/2026. Ele era `cabinet__*`, e
     era o mesmo desenho que a area precisava para o indice dela — duas classes para
     um lugar so, que e como uma paleta comeca a divergir. Agora as cinco telas
     montam a cabeca com a mesma peca, e a leitura da direita e um slot. */
  /* ⚠ A LEITURA GANHOU AUTOR em 15/08/2026, e a razao e a mais funda da auditoria:
     nenhuma tela do Planalto se DIRIGIA ao presidente. Tudo era descrito em terceira
     pessoa, e esta frase — a unica escrita PARA ele — chegava sem ninguem atras
     dela. Assinada, ela deixa de ser um rotulo do sistema e vira o que ela sempre
     quis ser: o conselho de quem trabalha para voce.
     O CONSELHEIRO PODE NAO EXISTIR, e a assinatura some junto em vez de imprimir um
     vazio: um "leitura de —" seria pior que nenhuma assinatura. */
  const head = headHtml({
    eyebrow: UI.cabinet.eyebrow,
    title: UI.cabinet.title,
    reading: {
      label: UI.cabinet.reading,
      value:
        `<p class="cabinet__verdict" data-situation="${escapeHtml(input.situation)}">` +
        `${escapeHtml(input.verdict)}</p>` +
        /* ⚠ A ASSINATURA NAO REPETE O ROTULO. A primeira versao escrevia "leitura de
           Fulano" logo abaixo de um rotulo que ja dizia "A LEITURA DO MES" — a
           mesma palavra duas vezes em dois pesos, que e a terceira duplicacao desta
           familia no dia. Uma assinatura de verdade nao se anuncia: ela e um traco
           e um nome. */
        (input.adviser
          ? `<p class="cabinet__signature">` +
            `<b>— ${escapeHtml(input.adviser.name)}</b>` +
            `<small>${escapeHtml(input.adviser.label)}</small></p>`
          : ""),
    },
  });

  /* ── A CAIXA DE ENTRADA E A COLUNA DA ESQUERDA, CHEIA OU VAZIA ─────────────
     ⚠ ELA JA FOI UMA FAIXA NO TOPO, e a razao escrita era boa: meia tela em branco
     ao lado de tres cartoes cheios leria como defeito de carregamento. A razao era
     boa e estava errada, e foram tres sinais para admitir — duas revisoes externas
     e o responsavel usando a tela.

     O que eu subestimei e que O LAYOUT E UMA PROMESSA. Uma tela que muda de
     esqueleto quando o conteudo chega nao ensina onde as coisas moram: o jogador
     aprende um mapa no mes 1 e recebe outro no mes em que a primeira carta cair —
     justamente o mes em que ele mais precisa saber para onde olhar. E o custo da
     forma definitiva desde o inicio e uma coluna com pouco texto dentro; o custo do
     contrario e o mapa se refazendo debaixo do pe.

     A LISTA CRESCE PARA BAIXO, e e por isso que ela precisa de ALTURA e nao de
     largura: quatro cartas num mes empurrariam o Congresso e o Cofre para fora da
     tela se ela fosse uma faixa no topo. */
  const inbox = cardHtml({
    title: UI.cabinet.inbox,
    span: "lead",
    body:
      input.inbox.length === 0
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
          /* ⚠ A CHAMADA MUDOU em 15/08/2026, e o motivo e que a antiga deixou de ser
             verdade. Ela dizia "a mesa ainda nao recebe correspondencia", e a mesa
             passou a receber: o mes que fecha cai aqui como carta. O que sobrou de
             verdadeiro e mais estreito — nenhum mes foi resolvido ainda —, e a NOTA
             continua declarando o que de fato falta, porque o Congresso, o relator e
             o tribunal seguem sem escrever. Sao dois estados vazios diferentes, e
             este e o primeiro dos dois. */
          `<div class="empty">` +
          `<p class="empty__lead">${escapeHtml(UI.inbox.firstLead)}</p>` +
          `<p class="empty__note">${escapeHtml(UI.cabinet.inboxWaiting)}</p>` +
          `</div>`
        : input.inbox.join(""),
  });

  /* ⚠ O ARCO DEU LUGAR AO HEMICICLO em 15/08/2026, e a substituicao — e nao a
     convivencia — e a decisao. Os dois respondiam perguntas diferentes: o arco
     repartia a base efetiva por saude, o hemiciclo desenha a Camara inteira. Mas o
     hemiciclo responde AS DUAS: a cor de cada cadeira e a saude da bancada dela, e
     a cadeira cheia contra a vazada e a base efetiva. O arco virou um subconjunto,
     e manter os dois seria a mesma verdade em dois desenhos no mesmo cartao — que
     e exatamente o que a regra das tres fatias evitou quando ela nasceu.
     A LEGENDA FICA, e ela e o que impede o desenho de ser um grafico que so o autor
     lê: tres cores sem chave ja custaram um dia inteiro a este cartao. */
  const congress = cardHtml({
    title: UI.cabinet.congress,
    action: UI.cabinet.congressAction,
    target: "congress",
    body:
      hemicycleHtml({ benches: input.chamber, total: input.seats }) +
      `<p class="card__hero" data-numeric>${seats(input.base)}` +
      `<small>${escapeHtml(UI.cabinet.seats)}</small></p>` +
      legendHtml(input.split),
  });

  /* O COFRE MOSTRA O QUE SOBRA E O QUE ESTA PRESO, e os dois na mesma barra: a
     obrigatoria nao e contexto, e a razao de o discricionario ser pequeno. Ver os
     dois separados faria o jogador ler "R$ 25 bi" como o orcamento do pais. */
  const locked = input.revenue > 0 ? Math.min(1, input.mandatory / input.revenue) : 0;

  /* QUANTO O MES JA PASSOU DO QUE CABE. Zero quando cabe — e a comparacao e entre
     os dois numeros que o cartao ja tem, sem nenhuma conta nova: `room` e o que o
     LASTRO abre, `committed` e o que as ordens deste mes pediram. */
  const excess = Math.max(0, input.committed - input.room);

  /* ⚠ O ESTOURO E MEDIDO NA LEITURA, E NAO NO VALOR CHEIO. Um excesso de 0,04
     imprime "R$ 0,0 bi", e acender o vermelho ali faz a cor negar o numero ao lado
     dela — foi o defeito que Financas levou uma sessao para achar. Comparar as
     duas FORMATACOES resolve sem digitar limiar nenhum, e continua certo no dia em
     que `money` mudar de casas decimais. */
  const over = money(excess) === money(0) ? 0 : excess;

  /* ⚠ O HERO E O QUE CABE, E NAO O QUE SOBRA. A primeira versao mostrava
     `room − committed` sob o rotulo "livre no mes", e a partida abria com
     "R$ 0,0 bi" — porque o orcamento HERDADO ja consome o discricionario inteiro.
     O numero estava certo e a leitura, errada: zero ao lado de "livre" parece
     defeito de carregamento, quando na verdade e a descoberta mais dura do
     modelo. Ela merece uma frase, e nao um zero. */
  const vault = cardHtml({
    title: UI.cabinet.vault,
    action: UI.nav.finance,
    target: "finance",
    body:
      `<p class="card__hero" data-numeric>${money(input.room)}` +
      `<small>${escapeHtml(UI.cabinet.vaultFree)}</small></p>` +
      `<div class="meter meter--vault" role="img" ` +
      `aria-label="${escapeHtml(`${percent(locked)} ${UI.cabinet.vaultLocked}`)}">` +
      `<span class="meter__part" data-part="poor" style="flex-grow:${(locked * 100).toFixed(1)}"></span>` +
      `<span class="meter__part" data-part="good" style="flex-grow:${((1 - locked) * 100).toFixed(1)}"></span>` +
      `</div>` +
      /* ── O ESTOURO PASSA A TER SINAL ────────────────────────────────────────
         ⚠ A TELA MOSTRAVA "cabe R$ 14,2 bi" E "ja consome R$ 14,5 bi" LADO A
         LADO, sem uma cor, sem uma palavra. O orcamento escrito passava do que
         cabia — que e o rateio funcionando, e a coisa mais importante que este
         cartao tem a dizer — e o jogador via dois numeros parecidos e uma
         aparente contradicao. O padrao do projeto e explicito: cor e texto contam
         a mesma historia, e aqui o texto contava um estouro e a cor, calmaria.

         E O QUE SE MOSTRA NO ESTOURO E O EXCESSO, e nao o total outra vez. Dois
         valores em "R$ 14,x bi" a dois centimetros um do outro obrigam a subtrair
         de cabeca para descobrir a unica coisa que importa — quanto falta. A
         subtracao e da tela, e nao do jogador.

         ⚠ O TOM SEGUE O NUMERO ARREDONDADO, e nao o cheio. E a mesma correcao que
         Financas ja levou: um excesso de 0,04 imprime "R$ 0,0 bi" e pintar isso de
         vermelho faz a cor negar o numero ao lado dela. */
      /* ⚠ SO O EXCESSO ACENDE, E NAO A LINHA INTEIRA. A primeira versao pintava o
         paragrafo todo de vermelho, e uma revisao externa acusou na hora: com
         "obrigatoria 95%" no mesmo tom do estouro, os dois viram contexto e o
         perigo deixa de ter destaque. Vermelho que cobre tudo nao destaca nada —
         e a correcao da manha tinha criado exatamente o defeito que ela veio
         corrigir, so que com mais tinta. */
      `<p class="card__note">${escapeHtml(UI.cabinet.vaultLocked)} ` +
      `<b data-numeric>${percent(locked)}</b> · ` +
      (over > 0
        ? `<b data-over="true">${escapeHtml(UI.cabinet.vaultOver)} ` +
          `<b data-numeric>${money(over)}</b></b>`
        : `${escapeHtml(UI.cabinet.vaultTaken)} <b data-numeric>${money(input.committed)}</b>`) +
      `</p>` +
      /* ── DO REAL TRAVADO ATE O TEXTO QUE O TRAVOU ────────────────────────────
         ⚠ ELA E A METADE DO RISCO R2 QUE FALTAVA, e uma revisao externa a cobrou
         com todas as letras: "a barra diz que 95% e obrigatorio, mas nao ha como
         investigar quais leis herdadas estao sugando esse dinheiro".

         Ela so ficou construivel quando a lei virou texto. Enquanto a faixa era um
         par de numeros, "quem trava" nao tinha resposta — havia um piso e ninguem
         para responder por ele. Agora `resolve` devolve QUAL norma decidiu cada
         piso, e a tela pergunta em vez de deduzir.

         ⚠ TRES LINHAS, E NAO A LISTA INTEIRA. Trinta e oito programas com o valor
         de cada um seria o Diario Oficial dentro de um cartao de resumo — que e
         exatamente o risco R2 pelo outro lado, o da heranca que aliena o jogador
         antes do terceiro mes. Tres respondem "por que eu nao tenho dinheiro" numa
         passada de olho, e o resto mora na area de cada programa. */
      `<p class="locked"><span class="locked__label">${escapeHtml(UI.cabinet.vaultWho)}</span>` +
      input.locked
        .map(
          item =>
            `<span class="locked__item" data-guard="${escapeHtml(item.guard)}">` +
            `${escapeHtml(item.label)} <b data-numeric>${money(item.spend)}</b></span>`,
        )
        .join("") +
      `</p>`,
  });

  /* A RUA POR SEGMENTO, e nao a media. A media esconde exatamente o que decide o
     risco de queda: um governo com apoio morno de todo mundo aguenta uma crise, e
     um adorado por metade do pais e odiado pela outra nao aguenta nenhuma. */
  const street = cabinetStreetHtml(input);
  const boiler = boilerCardHtml(input);

  return (
    `<section class="area glass-stage cabinet">` +
    head +
    `<div class="cards">${inbox}${congress}${vault}${boiler}${street}</div>` +
    `</section>`
  );
}

/**
 * O TERMOMETRO DA RUA.
 *
 * ⚠ ELE E UMA FUNCAO SEPARADA e nao esta inline no corpo acima porque a Caixa de
 * Entrada vai precisar dele: quando o inbox existir, uma carta de pesquisa vai
 * mostrar exatamente este bloco dentro dela. Extrair depois seria mexer nas duas.
 *
 * @param {object} input
 * @param {ReadonlyArray<{ id: string, label: string, spend: number, guard: string }>} input.locked
 *   o que mais prende a obrigatoria, e a natureza da norma que prende
 * @param {ReadonlyArray<Segment>} input.segments
 * @param {Record<string, Approval>} input.street
 * @returns {string}
 */
function cabinetStreetHtml({ segments, street }) {
  const rows = segments
    .map(segment => {
      const poll = street[segment.id];
      if (!poll) return "";

      return (
        `<div class="street__row">` +
        `<span class="street__who">${escapeHtml(segment.label)}</span>` +
        `<div class="meter" role="img" ` +
        `aria-label="${escapeHtml(`${segment.label}: ${poll.good}% ótimo ou bom`)}">` +
        /** @type {const} */ (["good", "fair", "poor"])
          .map(
            part =>
              `<span class="meter__part" data-part="${part}" style="flex-grow:${poll[part]}"></span>`,
          )
          .join("") +
        `</div>` +
        `<span class="street__value" data-numeric>${poll.good}%</span>` +
        `</div>`
      );
    })
    .join("");

  return cardHtml({ title: UI.cabinet.street, body: `<div class="street">${rows}</div>` });
}

/**
 * A CALDEIRA — os quatro grupos que conseguem derrubar um presidente.
 *
 * ⚠ ELA E UM CARTAO SEPARADO DA RUA, e a separacao e a modelagem: a Rua mede quem
 * APROVA o governo; esta mede quem consegue DERRUBA-LO. Sao perguntas diferentes, e
 * junta-las faria a segunda parecer um detalhe da primeira.
 *
 * ⚠ E NENHUM NUMERO E CALCULADO AQUI. A pressao, o ponto de fervura e as tres
 * rupturas vem de `boilerOf` prontos — a tela nao tem limiar proprio, senao ela
 * chamaria de fervendo o que o motor ainda trata como paciencia.
 *
 * @param {object} input
 * @param {{ lobbies: ReadonlyArray<{ id: string, label: string, wants: string,
 *   pressure: number, boiling: boolean }>,
 *   rupture: { social: boolean, economic: boolean, political: boolean, open: boolean },
 *   impeachment: number | null, fallen: number | null }} input.boiler
 * @returns {string}
 */
function boilerCardHtml({ boiler }) {
  const rows = boiler.lobbies
    .map(
      lobby =>
        `<div class="boiler__row"${lobby.boiling ? ' data-boiling="true"' : ""}>` +
        `<span class="boiler__who">${escapeHtml(lobby.label)}</span>` +
        `<span class="boiler__wants">${escapeHtml(lobby.wants)}</span>` +
        `<div class="meter" role="img" ` +
        `aria-label="${escapeHtml(`${lobby.label}: ${Math.round(lobby.pressure)} ${UI.cabinet.boilerMeter}`)}">` +
        `<span class="meter__part" data-part="poor" style="flex-grow:${lobby.pressure}"></span>` +
        `<span class="meter__part" data-part="rest" style="flex-grow:${100 - lobby.pressure}"></span>` +
        `</div>` +
        `<span class="boiler__value" data-numeric>${Math.round(lobby.pressure)}</span>` +
        `</div>`,
    )
    .join("");

  /* AS RUPTURAS ABERTAS, NOMEADAS. Um contador — "2 de 3" — diria o tamanho do perigo
     e esconderia a unica coisa acionavel: QUAL delas ainda segura o governo de pe. */
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
        : `<p class="boiler__ruptures">` +
          (open.length > 0
            ? `${escapeHtml(UI.cabinet.rompeu)} <b>${open.map(escapeHtml).join(" · ")}</b>`
            : escapeHtml(UI.cabinet.ruptureNone)) +
          `</p>`;

  return cardHtml({
    title: UI.cabinet.boiler,
    body: `<div class="boiler">${rows}</div>${foot}`,
  });
}
