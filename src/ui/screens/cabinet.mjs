/* GABINETE — a tela inicial, e a unica que so resume. */

import { escapeHtml } from "../shared/html.mjs";
import { headHtml } from "../shared/head.mjs";
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
 * ⚠ ELA E A UNICA CONTA DESTA VIEW, e e de ESCALA e nao de modelo: a regua le de 0 a 100, e
 * cadeira e maioria vem em unidades do plenario.
 *
 * @param {number} part
 * @param {number} whole
 * @returns {number}
 */
function share(part, whole) {
  return whole > 0 ? (part / whole) * 100 : 0;
}

/**
 * A LINHA DE LEITURA — nome, barra, valor. ⚠ ELA E A UNICA FORMA DA COLUNA DA DIREITA,
 * por decisao dele: "quero algo padronizado e refeito do zero". Antes eram duas
 * gramaticas na mesma coluna — placar com numero grande e barra de 432px nas duas fichas de
 * cima, lista com barra recuada de 192px nas duas de baixo —, e o olho lia as quatro juntas.
 *
 * @param {object} input
 * @param {string} input.who o nome da leitura
 * @param {string} input.value o numero, ja formatado
 * @param {string} [input.bar] a barra, ja em HTML; sem ela o nome atravessa a pista
 * @param {string} [input.tone] `crisis` tinge a linha inteira
 * @param {string} [input.note] o que qualifica o nome, e nao o valor — ele entra DENTRO do
 * rotulo porque nao e uma segunda leitura: e a mesma leitura dizendo o proprio peso
 * @param {"up" | "down" | "flat" | null} [input.trend] para que lado a leitura andou desde o
 * mes passado; `null` quando nao ha mes passado com que comparar
 * @returns {string}
 */
function readingHtml({ who, value, bar, tone, note, trend }) {
  return (
    `<div class="reading${bar ? "" : " reading--wide"}"` +
    `${tone ? ` data-tone="${escapeHtml(tone)}"` : ""}>` +
    `<span class="reading__who">${escapeHtml(who)}` +
    (note ? `<small class="reading__note">${escapeHtml(note)}</small>` : "") +
    `</span>` +
    (bar ?? "") +
    `<span class="reading__value" data-numeric>${value}` +
    (trend
      ? `<i class="trend" data-direction="${trend}" aria-hidden="true">${UI.trend[trend]}</i>`
      : "") +
    `</span>` +
    `</div>`
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
 * O MEDIDOR COMPOSTO — as fatias que somam o todo, e ele e a FORMA DA COMPOSICAO.
 *
 * ⚠ TIPO DE NUMERO DIFERENTE PEDE FORMA DIFERENTE, e a coluna tinha sete barras iguais
 * medindo contagem, fracao, pressao e composicao. A regua com marca (`gauge`) ficou para
 * PRESSAO, que e a unica que tem limiar; o que reparte um todo em partes vem para ca.
 *
 * @param {object} input
 * @param {ReadonlyArray<{ id: string, value: number }>} input.parts
 * @param {string} input.label o rotulo de leitor de tela
 * @param {number} [input.mark] o limiar, quando ele existe — a maioria, na Camara
 * @returns {string}
 */
function meterHtml({ parts, label, mark }) {
  return (
    `<div class="meter" role="img"` +
    (mark === undefined ? "" : ` data-mark="true" style="--mark:${attr(mark)}"`) +
    ` aria-label="${escapeHtml(label)}">` +
    parts
      .map(
        part =>
          `<span class="meter__part" data-part="${escapeHtml(part.id)}" ` +
          `style="flex-grow:${attr(part.value)}"></span>`,
      )
      .join("") +
    `</div>`
  );
}

/**
 * UM BLOCO — a legenda que o nomeia, e as linhas dele.
 *
 * ⚠ A LEGENDA VOLTOU, e ela tinha saido com outras quatro. A premissa daquela
 * retirada era que o numero grande nomeava a ficha sozinho — "436 de 513" diz Congresso. Sem
 * numero grande, uma lista que abre em "O mercado" nao diz de que assunto ela e.
 *
 * @param {object} input
 * @param {string} input.legend
 * @param {string} input.rows
 * @param {string} [input.key] a chave das cores, quando a barra e composta. ⚠ Ela entra
 * DENTRO de uma linha vazia, e nao solta ao lado das outras: ela se alinha pela pista da
 * barra, e `grid-column` so encontra essa pista dentro de uma `.reading`
 * @param {string} [input.foot] o que atravessa a largura toda — carimbo, ruptura aberta
 * @param {string} [input.door] a tela que este bloco abre, quando ela existe
 * @param {boolean} [input.lead] o bloco que manda na coluna; um so, e por tinta
 * @returns {string}
 */
function blockHtml({ legend, rows, key, foot, door, lead }) {
  /* ⚠ A PORTA E A LEGENDA, e nao o cartao inteiro: um `<div>` com clique nao chega pelo
     teclado, e este bloco tem leitor de tela em toda barra. Duas das quatro tem destino que
     EXISTE — a Camara abre o Congresso, o cofre abre Financas —, e as outras duas nao ganham
     porta nenhuma: um lobby nao tem tela para abrir, e prometer uma seria o rail cinza. */
  /* ⚠ O BLOCO QUE DECIDE A PARTIDA DOMINA PELA TINTA, e nao por tamanho: a coluna fecha em
     639 de 639 e nao ha um pixel para crescer, e corpo maior abriria combinacao nova no censo
     de tipografia. Tinta nao entra no censo, e ela basta para o olho escolher por onde comeca. */
  const mark = `block__legend${lead ? " block__legend--lead" : ""}`;
  const head = door
    ? `<button class="${mark} block__door" type="button" ` +
      `data-section="${escapeHtml(door)}">${escapeHtml(legend)}</button>`
    : `<h3 class="${mark}">${escapeHtml(legend)}</h3>`;

  return cardHtml({
    body:
      head +
      `<div class="block__rows">${rows}` +
      (key ? `<div class="reading">${key}</div>` : "") +
      `</div>` +
      (foot ?? ""),
  });
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

  /* ⚠ ELE FOI CORTADO ATE SOBRAR A PERGUNTA, e a queixa dele nomeia cada pedaco do defeito:
     "Base no plenario" era jargao, "maioria simples 257" ficava solto sem nada a que se
     prender, "436" e "513" eram numeros sem relacao entre si, e a fita de cinco cores nao
     dizia o que significava — nem os polos, porque intervencao e mercado sao o EIXO do
     catalogo e nao uma frase que alguem entenda de primeira.
     ⚠ A COMPOSICAO POR EIXO SAIU DO GABINETE, e a razao e de largura: uma barra de onze
     bancadas em 184px so seria legivel com uma legenda nomeando cada cor, e essa legenda nao
     cabe. Quem lista bancada por bancada, com nome e humor, e a tela do Congresso. */
  /* ⚠ A CAMARA DEIXOU DE SER UMA REGUA E VIROU UMA COMPOSICAO, e o dado ja existia: `split`
     era calculado todo quadro, declarado no contrato desta view e NUNCA lido — o quinto canal
     morto da mesma familia dos quatro do plano. Uma barra cheia dizia "436 apoiam"; as tres
     fatias dizem QUEM SAO os outros 77, e essa e a diferenca entre um numero e uma leitura. */
  /* QUEM APARECE NA BARRA, e so quem aparece. */
  const dividida = [
    input.split.obstructing >= 0.5 ? UI.mood.obstructing : "",
    input.split.ruptured >= 0.5 ? UI.mood.broken : "",
  ].filter(Boolean);

  const congress = blockHtml({
    legend: UI.cabinet.blockCongress,
    door: "congress",
    rows:
      readingHtml({
        who: UI.cabinet.baseLine,
        bar: meterHtml({
          /* ⚠ A QUARTA FATIA E O QUE NAO RESPONDE, e sem ela a barra ficava SEMPRE CHEIA: as
             tres primeiras somam a base — `baseCount` e `loyal + obstructing + ruptured` —,
             entao repartir so elas apagava a comparacao com as 513 cadeiras, que e a leitura
             inteira. Ela nao tem cor propria: e a pista vazia da regua. */
          parts: [
            { id: "loyal", value: input.split.loyal },
            { id: "obstructing", value: input.split.obstructing },
            { id: "ruptured", value: input.split.ruptured },
            { id: "rest", value: Math.max(0, input.seats - input.base) },
          ],
          mark: share(input.majority, input.seats),
          label:
            `${UI.cabinet.baseLine}: ${seats(input.base)} ${UI.cabinet.of} ${seats(input.seats)}, ` +
            `${seats(input.split.obstructing)} ${UI.mood.obstructing}, ` +
            `${seats(input.split.ruptured)} ${UI.mood.broken}`,
        }),
        value: `${seats(input.base)} ${UI.cabinet.of} ${seats(input.seats)}`,
      }) +
      /* ⚠ A FRASE EXPLICA A MARCA, e o numero dentro dela e da COR DA MARCA: e o unico jeito
         de ligar um risco de latao na barra a um numero escrito, sem uma seta e sem uma nota
         de rodape.
         ⚠ E ELA GANHOU A CHAVE DAS TRES CORES na outra ponta da MESMA linha: tres cores sem
         chave sao um grafico que so o autor lê — defeito ja medido aqui —, e `.poles` poe as
         duas pontas numa linha so, entao o bloco nao ganha altura. */
      `<div class="reading"><p class="poles poles--note poles--wide"><span>` +
      `${escapeHtml(UI.cabinet.lawPasses)} ` +
      `<b class="poles__mark" data-numeric>${seats(input.majority)}</b>` +
      `</span>` +
      /* ⚠ A CHAVE SO NOMEIA A COR QUE ESTA NA BARRA, e nunca as tres de enfeite: uma legenda
         que lista "em ruptura" todo mes num mandato em que ninguem rompeu ensina o olho a
         pular a linha — e ai, no mes em que a ruptura acontecer, ela aparece num lugar que o
         jogador ja parou de ler. E o mesmo silencio que o rodape da caldeira usa. */
      (dividida.length > 0 ? `<span>${dividida.map(escapeHtml).join(" · ")}</span>` : "") +
      `</p></div>`,
  });

  /* O COFRE MOSTRA O QUE SOBRA E O QUE ESTA PRESO, e os dois na mesma barra: a obrigatoria
     nao e contexto, e a razao de o discricionario ser pequeno. */
  const locked = input.revenue > 0 ? Math.min(1, input.mandatory / input.revenue) : 0;

  /* QUANTO O MES JA PASSOU DO QUE CABE.
     LASTRO abre, `committed` e o que as ordens deste mes pediram. */
  const excess = Math.max(0, input.committed - input.room);

  /* ⚠ O ESTOURO E MEDIDO NA LEITURA, E NAO NO VALOR CHEIO. */
  const over = money(excess) === money(0) ? 0 : excess;

  /* ⚠ ELE RESPONDE NA ORDEM EM QUE A PERGUNTA NASCE: quanto sobra, por que sobra tao pouco, e
     qual e o maior grampo. Antes a primeira linha era "livre no mes" e a segunda um "95%" sem
     base — 95% de que? A frase abaixo da regua da a base, que e a mesma forma da Camara. */
  const vault = blockHtml({
    legend: UI.cabinet.blockVault,
    door: "finance",
    rows:
      /* ⚠ SEM BARRA, e a ausencia e honesta: nao existe teto MENSAL contra o que medir o que
         sobra — o teto do arcabouco mede o ano. Inventar uma escala aqui seria desenhar um
         numero que o motor nao produz. */
      readingHtml({ who: UI.cabinet.vaultFree, value: money(input.room) }) +
      readingHtml({
        who: UI.cabinet.vaultLocked,
        bar:
          `<div class="gauge" role="img" style="--index:${attr(locked * 100)}" ` +
          `aria-label="${escapeHtml(`${percent(locked)} ${UI.cabinet.vaultLocked}`)}"></div>`,
        value: percent(locked),
      }) +
      `<div class="reading"><p class="poles poles--note"><span>` +
      `${escapeHtml(UI.cabinet.vaultOfRevenue)} ` +
      `<b data-numeric>${money(input.revenue)}</b></span></p></div>` +
      /* ⚠ O COMPROMETIDO SO APARECE QUANDO DIFERE DO QUE SOBRA, e a razao e uma medicao: num
         governo que nao toca em nada as duas leituras imprimem o MESMO numero em 44 de 49
         meses. Compara-se a FORMATACAO, e nao o valor cheio. */
      (over > 0
        ? readingHtml({ who: UI.cabinet.vaultOver, value: money(over), tone: "crisis" })
        : money(input.committed) === money(input.room)
          ? ""
          : readingHtml({ who: UI.cabinet.vaultTaken, value: money(input.committed) })) +
      /* ── DO REAL TRAVADO ATE O TEXTO QUE O TRAVOU ──────────────────────────── ⚠ ELA E A
         METADE DO RISCO R2 QUE FALTAVA, e uma revisao externa a cobrou com todas as letras:
         "a barra diz que 95% e obrigatorio, mas nao ha como investigar quais leis herdadas
         estao sugando esse dinheiro". */
      (input.locked[0]
        ? readingHtml({
            who: `${UI.cabinet.vaultBiggest} ${input.locked[0].label}`,
            value: money(input.locked[0].spend),
          })
        : ""),
  });

  /* A RUA POR SEGMENTO, e nao a media. */
  const street = cabinetStreetHtml(input);
  const boiler = boilerCardHtml(input);
  /* ⚠ AS DUAS RECEBEM `input` INTEIRO, e e por isso que `before` chega nelas sem passar por
     uma terceira assinatura. */

  return (
    `<section class="area glass-stage cabinet">` +
    head +
    trinityHtml(input) +
    /* O ciclo 10 acrescentou a ⚠ E `1 / -1` NAO CONSERTA, o que me custou uma tentativa: `-1`
       conta a ultima linha da grade EXPLICITA, e aqui todas as linhas sao implicitas.
       CALDEIRA, ninguem voltou aqui, e a coluna da esquerda passou a terminar uma
       linha antes da direita — um degrau que so a captura mostra, porque nada falha:
       o `span` continua sendo um span valido. */
    /* ⚠ A ORDEM DA COLUNA E A DA CONSEQUENCIA, e ela era a da contabilidade. Os quatro blocos
       tinham a mesma forma e o mesmo peso, e o que decide se a PARTIDA ACABA dividia espaco
       igual com a nota de rodape do cofre. Quem pode derrubar sobe para o topo, encostado na
       faixa de risco que ele explica; o resto desce na ordem em que se consulta. */
    `<div class="cards">${inbox}` +
    `<div class="cards__side">${boiler}${congress}${vault}${street}</div>` +
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

      /* Ela MENTIA, e a captura pegou: com a aprovacao em 44 e o piso em 20, a conta dava 70%
         e a barra aparecia quase cheia e vermelha num governo confortavel. */
      const safe =
        item.breaks === "below" ? item.value > item.threshold : item.value < item.threshold;

      /* ⚠ O ITEM E UMA PILHA, e nao uma `.reading` deitada. A linha de leitura e gramatica de
         LISTA VERTICAL: o que a faz funcionar e o alinhamento entre linhas, e numa faixa de
         tres colunas nao existe linha para alinhar. Medido: o rotulo numa coluna de 112px
         deixava 74px de vazio antes da barra de "Capital", e o vao entre um item e o seguinte
         era 24px contra 12px dentro do item — "31 Capital" lia como uma frase so. Aqui o que
         se padroniza sao os TOKENS (rotulo, valor, regua, legenda), e nao o arranjo. */
      return (
        /* ⚠ `data-open` SAIU DAQUI, e ele era canal morto dos dois lados: nenhuma folha o
           pintava e nenhuma prova o lia, entao a ruptura aberta nao mudava um pixel. Quem
           tinge agora e `data-tone`, que e o mesmo marcador da linha estourada do cofre. */
        `<div class="trinity__item"${item.open ? ' data-tone="crisis"' : ""}>` +
        `<p class="trinity__head">` +
        `<span class="reading__who">${escapeHtml(label)}</span>` +
        `<span class="reading__value" data-numeric>${seats(item.value)}</span>` +
        `</p>` +
        /* O VALOR E A MARCA SAO DADO, e por isso vao em estilo inline — a mesma excecao
           declarada do `--floor` no trilho do orcamento. */
        `<div class="gauge" role="img" data-mark="true"${safe ? "" : ' data-past="true"'} ` +
        `style="--index:${attr(Math.round(item.value))};--mark:${attr(item.threshold)}" ` +
        `aria-label="${escapeHtml(`${label}: ${seats(item.value)}`)}"></div>` +
        /* ⚠ O LIMIAR CONTINUA ESCRITO, e a marca sozinha nao bastaria: as tres rompem em
           DIRECOES diferentes — uma quando cai, duas quando sobem —, entao um risco de latao
           sem texto e ambiguo. */
        `<p class="poles poles--note"><span>` +
        `${escapeHtml(item.breaks === "below" ? UI.cabinet.trinityBelow : UI.cabinet.trinityAbove)} ` +
        `${seats(item.threshold)}</span></p>` +
        `</div>`
      );
    })
    .join("");

  /* ⚠ A LEGENDA NAO CARREGA MAIS A REGRA DO IMPEACHMENT — "as tres, juntas" saiu inteira,
     por decisao dele, e nao foi reescrita. */
  return (
    /* ⚠ O `data-open` DA SECAO SAIU JUNTO: as tres rompidas ja carimbam PROCESSO ABERTO no
       bloco da caldeira, e um segundo canal para o mesmo estado — que ninguem pintava — era a
       familia de defeito mais cara deste projeto. */
    `<section class="trinity">` +
    `<h3 class="block__legend">${escapeHtml(UI.cabinet.trinityTitle)}</h3>` +
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
 * @param {{ street: Record<string, Approval> } | null} [input.before] o mes passado
 * @returns {string}
 */
function cabinetStreetHtml({ segments, street, before }) {
  const rows = segments
    .map(segment => {
      const poll = street[segment.id];
      if (!poll) return "";

      /* ⚠ A DESCRICAO NOMEIA AS TRES FATIAS, e nao so a verde. */
      const described = /** @type {const} */ (["good", "fair", "poor"])
        .map(part => `${poll[part]}% ${UI.approvalParts[part]}`)
        .join(", ");

      return readingHtml({
        who: segment.label,
        trend: directionOf(poll.good, before?.street[segment.id]?.good, 1),
        bar:
          `<div class="meter" role="img" ` +
          `aria-label="${escapeHtml(`${segment.label}: ${described}`)}">` +
          /** @type {const} */ (["good", "fair", "poor"])
            .map(
              part =>
                `<span class="meter__part" data-part="${part}" style="flex-grow:${poll[part]}"></span>`,
            )
            .join("") +
          `</div>`,
        value: `${poll.good}%`,
      });
    })
    .join("");

  /* Sem chave, o jogador nao tem como saber se `27%` e a verde, a vermelha ou a soma; com
     chave, a posicao responde sozinha. */
  const key =
    `<p class="poles">` +
    `<span>${escapeHtml(UI.approvalParts.good)}</span>` +
    `<span>${escapeHtml(UI.approvalParts.poor)}</span>` +
    `</p>`;

  return blockHtml({ legend: UI.cabinet.blockStreet, rows, key });
}

/**
 * ⚠ ELA E UM CARTAO SEPARADO DA RUA, e a separacao e a modelagem: a Rua mede quem APROVA o
 * governo; esta mede quem consegue DERRUBA-LO.
 *
 * A CALDEIRA — os quatro grupos que conseguem derrubar um presidente.
 * @param {object} input
 * @param {{ lobbies: ReadonlyArray<{ id: string, label: string, wants: string,
 * share: number, pressure: number, boiling: boolean, boil: number,
 * fall: number | null }>,
 * rupture: { social: boolean, economic: boolean, political: boolean, open: boolean },
 * impeachment: number | null, fallen: number | null }} input.boiler
 * @param {{ pressure: Record<string, number> } | null} [input.before] o mes passado
 * @returns {string}
 */
function boilerCardHtml({ boiler, before }) {
  const rows = boiler.lobbies
    .map(lobby =>
      readingHtml({
        who: lobby.label,
        /* ⚠ O QUARTO CANAL MORTO SAIU DO `aria-label` E VIROU LEITURA. O peso do grupo na
           ruptura economica era calculado, formatado em porcentagem e entregue SO a quem usa
           leitor de tela — e um dos quatro pesa ZERO. Quem enxergava via quatro barras iguais
           e gastava capital acalmando um grupo que nao conta para a conta.
           ⚠ E O ZERO NAO IMPRIME "0%": ele nao pesa POUCO, ele nao entra na conta. */
        note: lobby.share > 0 ? percent(lobby.share) : UI.cabinet.boilerNoWeight,
        /* ⚠ PRESSAO SUBINDO E RUIM, e por isso o sinal se inverte — a mesma inversao que a
           inflacao ja carrega na barra de vitais. */
        trend: directionOf(lobby.pressure, before?.pressure[lobby.id], -1),
        /* ⚠ A SEGUNDA MARCA E DO FIADOR, e ela vem do motor com o resto: um grupo tem DUAS
           linhas na mesma regua — abandona o governo em `boil`, e em `fall` a ruptura
           politica abre. Antes o segundo numero morava noutro bloco com o mesmo verbo. */
        /* ⚠ A FATIA DO CAPITAL SAIU DA LINHA E FICOU NO ROTULO DE LEITOR DE TELA, e a razao
           e a auditoria: ela vem do catalogo e nao muda em 48 meses — leitura que nao muda e
           legenda, e legenda ocupava aqui a segunda fileira que fazia esta linha ter 34px
           contra os 20px de toda outra linha da coluna. */
        bar:
          `<div class="gauge" role="img" data-mark="true"` +
          `${lobby.boiling ? ' data-past="true"' : ""}` +
          `${lobby.fall === null ? "" : ' data-fall="true"'} ` +
          `style="--index:${attr(Math.round(lobby.pressure))};--mark:${attr(lobby.boil)}` +
          `${lobby.fall === null ? "" : `;--fall:${attr(lobby.fall)}`}" ` +
          `aria-label="${escapeHtml(
            `${lobby.label}: ${Math.round(lobby.pressure)} ${UI.cabinet.boilerMeter}, ` +
              `${UI.cabinet.boilerBreaks} ${seats(lobby.boil)}` +
              `${
                lobby.fall === null
                  ? ""
                  : `, ${UI.cabinet.trinityTitle.toLowerCase()} ${UI.cabinet.boilerAt} ${seats(lobby.fall)}`
              }, ` +
              `${lobby.share > 0 ? `${percent(lobby.share)} ${UI.cabinet.boilerShare}` : UI.cabinet.boilerNoShare}`,
          )}"></div>`,
        value: String(Math.round(lobby.pressure)),
        ...(lobby.boiling ? { tone: "crisis" } : {}),
      }),
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
        : /* ⚠ E O SILÊNCIO É O ESTADO NORMAL, ENTÃO ELE NÃO IMPRIME LINHA. Uma legenda que
             lista "em ruptura: 0" todo mês ensina o olho a ignorar a linha inteira — e aí, no
             mês em que a ruptura acontecer, ela aparece num lugar que o jogador já parou de
             ler. */
          open.length > 0
          ? `<p class="boiler__ruptures">${escapeHtml(UI.cabinet.rompeu)} ` +
            `<b>${open.map(escapeHtml).join(" · ")}</b></p>`
          : "";

  /* ⚠ UMA FRASE PARA AS QUATRO LINHAS, e nao uma por linha: o ponto de fervura e UM numero do
     catalogo, o mesmo para todos os grupos, entao repeti-lo quatro vezes seria a legenda
     estatica que este projeto ja pagou duas vezes. Ela so aparece se o catalogo mantiver o
     ponto igual — no dia em que um grupo tiver o proprio, ela cala em vez de mentir. */
  const boil = boiler.lobbies[0]?.boil ?? 0;
  const same = boiler.lobbies.every(lobby => lobby.boil === boil);

  /* ⚠ A SEGUNDA CLAUSULA NOMEIA O GRUPO, e sem o nome ela seria uma marca muda na barra —
     que e o quarto canal morto visto pelo avesso. Ela cabe na chave que ja existe: `.poles`
     poe duas pontas na MESMA linha, entao o bloco nao ganha altura nenhuma. */
  const faller = boiler.lobbies.find(lobby => lobby.fall !== null);

  const key = same
    ? `<p class="poles poles--note${faller?.fall === null || faller?.fall === undefined ? "" : " poles--wide"}">` +
      `<span>${escapeHtml(UI.cabinet.boilerBreaks)} ` +
      `<b class="poles__mark" data-numeric>${seats(boil)}</b></span>` +
      /* ⚠ O 86 NAO GANHA VERBO NOVO: ele ja se chama `Risco de queda` na faixa do topo, e
         inventar um segundo nome aqui repetiria o defeito com os papeis trocados. */
      (faller?.fall !== null && faller?.fall !== undefined
        ? `<span>${escapeHtml(faller.label)}: ` +
          `${escapeHtml(UI.cabinet.trinityTitle.toLowerCase())} ${escapeHtml(UI.cabinet.boilerAt)} ` +
          `<b class="poles__mark" data-numeric>${seats(faller.fall)}</b></span>`
        : "") +
      `</p>`
    : undefined;

  return blockHtml({ legend: UI.cabinet.blockBoiler, rows, key, foot, lead: true });
}
