/* GABINETE — a MESA: o tampo, a pasta de despachos e a correspondencia do mes.

   ⚠ AS SEIS LEITURAS SAIRAM DA TELA, e a ausencia e declarada: aprovacao e base moram na
   barra superior, e as outras esperam a peca de papel que vai carrega-las. A jogada ficou: as
   oito pastas do contingenciamento sao marcadas no proprio decreto, onde o Art. 2 fala delas.

   ⚠ A LINGUA DA CAIXA CONTINUA AQUI, e a guarda `annexes` a fecha: `emailHtml` nao mudou. */

import { escapeHtml } from "../shared/html.mjs";
import { armSignature, decreeHtml } from "../shared/decree.mjs";
import { briefHtml } from "../shared/brief.mjs";
import { mailPileHtml } from "../shared/mail-pile.mjs";
import { phoneHtml } from "../shared/phone.mjs";
import { curveOf } from "../shared/spring.mjs";
import { felt, fibre } from "../shared/texture.mjs";
import { UI } from "../strings.mjs";

/* AS MATERIAS DA MESA nascem UMA vez: gerar os SVG a cada pintura refaria tres filtros por
   clique. `feTurbulence` sai de JS como data URI, e a folha nao tem como escreve-lo.
   ⛔ O caminho e absoluto: `url()` dentro de custom property resolve contra a FOLHA que a
   consome — relativo, a mesa pedia `/styles/assets/` e dava 404. */
const TIMBER = 'url("/assets/jacaranda.webp")';
const FIBRE = fibre({ freq: 0.9, octaves: 4, force: 0.13 });
const FELT = felt();

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
 * A CAIXA DE ENTRADA — ela ocupa a tela inteira, e e outra tela.
 *
 * @param {object} input
 * @param {boolean} input.resolved se ALGUM mes ja foi resolvido. ⚠ Ele existe para o
 * estado vazio escolher a frase verdadeira, e sai do MES do estado e nao do relatorio
 * em memoria: o relatorio nao vai para o save, e o mes vai
 * @param {string} input.inbox a BANDEJA ja montada — lista e oficio aberto —, e vazia
 * enquanto o mundo nao escreve
 * @returns {string}
 */
export function emailHtml(input) {
  /* O vazio ocupa a coluna, nao um paragrafo no alto dela: num vao de 700px o paragrafo
     encostado no teto le como carregamento que travou. */
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

  return `<section class="area cabinet"><div class="cards">${inbox}</div></section>`;
}

/**
 * A MESA — o tampo, a pasta de despachos e a correspondencia do mes. O tampo sangra pelos
 * lados de proposito: uma mesa que cabe inteira na tela vira uma bandeja.
 *
 * @param {object} input
 * @param {number} input.room o discricionario que cabe no mes
 * @param {number} input.ratio a fracao do pedido que o rateio honra, de 0 a 1
 * @param {string} input.president quem assina o ato
 * @param {number} input.month o mes do mandato
 * @param {ReadonlyArray<{ id: string, label: string, short?: string }>} input.areas as oito
 * @param {ReadonlyArray<string>} input.protect quais o decreto deste mes poupa
 * @param {ReadonlyArray<{ urgent: boolean }>} input.letters a correspondencia na mesa, com o
 * que vence ja perguntado a `silences`
 * @param {number} input.sheets quantos atos esperam atras do decreto
 * @param {Parameters<typeof briefHtml>[0]} input.brief as seis leituras do parecer, prontas
 * @param {string | null} input.boiling o grupo que ferveu, perguntado a `boilerOf`, ou nulo
 * @returns {string}
 */
export function cabinetHtml(input) {
  /* As folhas de baixo nao tem texto, e a ausencia e declarada: o jogo tem UMA caneta
     construida, o contingenciamento. */
  const under = Array.from(
    { length: input.sheets },
    (_, i) => `<div class="stack__under" style="--i:${input.sheets - i}"></div>`,
  ).join("");

  return (
    `<section class="area cabinet">` +
    `<div class="room">` +
    /* Nao ha tampo aqui: a madeira e o substrato da janela (`.backdrop`), o mesmo que o vidro
       da barra e do rail refratam. */
    `<div class="folder" tabindex="0" role="button" aria-label="${escapeHtml(UI.cabinet.folder)}">` +
    /* As sombras sao camadas prontas, e o voo so cruza a opacidade delas. */
    `<i class="folder__cast" data-cast="lift"></i>` +
    /* ⛔ A pasta aberta e uma camada, nao o fundo de `.folder`: fechada, o couro aberto
       aparecia por baixo da capa. Ela cruza opacidade com a capa, no mesmo `t` das sombras. */
    `<i class="folder__open"></i>` +
    /* A folha que vira e UMA peca com duas faces: o parecer na frente e a capa no verso — a
       foto `assets/folder-closed.webp`, cujo corpo bate a aba direita da aberta em 0,71%. */
    `<div class="folder__leaf">` +
    briefHtml(input.brief) +
    `<i class="folder__cover"></i>` +
    `</div>` +
    `<div class="stack">${under}${decreeHtml({ ...input, chief: input.brief.chief })}</div>` +
    `</div>` +
    `<div class="mail">${mailPileHtml(input)}</div>` +
    phoneHtml(input) +
    /* A caneta e paisagem: nao responde ao ponteiro e nao le por som. */
    `<div class="pen" aria-hidden="true"></div>` +
    `</div>` +
    `</section>`
  );
}

/**
 * VESTE A MESA — as materias e a rubrica, depois de a mesa estar na pagina.
 *
 * ⚠ DEPOIS DE PINTAR: `armSignature` mede o traco com `getTotalLength`, que so existe com o
 * `<path>` na pagina. As materias vem junto porque `innerHTML` troca o elemento, e o estilo
 * inline vai com ele.
 *
 * @param {ParentNode} root o `main` recem-pintado
 */
export function dressDesk(root) {
  /** @param {string} pick @param {string} name @param {string} value */
  const wear = (pick, name, value) => {
    const node = root.querySelector(pick);
    if (node instanceof HTMLElement) node.style.setProperty(name, value);
  };

  /* A madeira vai para o corpo da pagina: a barra e o rail sao vidro com `backdrop-filter`, e
     vidro sobre fundo liso nao refrata nada — a mesa parecia colada AO LADO da interface. */
  const body = root instanceof Element ? root.ownerDocument.body : null;
  if (body) {
    body.style.setProperty("--timber", TIMBER);
    /* A medida da cena vai com ela: `.backdrop` e `.room` leem o mesmo par, escrito daqui. */
    body.style.setProperty("--room-w", `${DESIGN.width}px`);
    body.style.setProperty("--room-h", `${DESIGN.height}px`);
  }
  /* A fibra desce por heranca: quem a le e a `.sheet`, dentro da pasta. O envelope nao usa a
     fibra da folha: papel de carta e liso e envelope de convite e feltrado. */
  wear(".folder", "--fibre", FIBRE);
  wear(".mail", "--felt", FELT);

  /* ⛔ `.stack .sheet` e nao `.sheet`: a face esquerda da pasta e uma folha tambem e vem ANTES
     no documento — `querySelector` devolvia o parecer, e a rubrica do ato nunca seria medida. */
  armSignature(root.querySelector(".stack .sheet"));
  /* O voo primeiro, a medida depois: quem calibra o tamanho de leitura e o proprio desenho do
     voo, e `fitDesk` o chama assim que a escala da cena esta escrita. */
  armFlight(root);
  fitDesk(root);
}

/* ══ A CENA E A FOTO ══════════════════════════════════════════════════════════
   A mesa tem o tamanho da foto do tampo e nunca cresce alem dele: em nenhuma largura um pixel
   da madeira e reamostrado para cima. ⛔ E esta e a UNICA fonte da medida: teclada em tres
   lugares, quatro comentarios ficaram em 1206x806 e um em 1672x940. */
const DESIGN = { width: 1916, height: 821 };

/* As pecas da mesa, para a faixa que a janela tem de mostrar inteira. */
const PIECES = [".folder", ".mail", ".phone", ".pen"];
/* Folga acima da peca mais alta e abaixo da mais baixa antes de a cena encolher, em px da cena. */
const BREATH = 12;

/** @type {ResizeObserver | null} */
let watcher = null;
/** A faixa vertical das pecas em px da cena, medida a cada pintura: do topo da mais alta ao pe da mais baixa. */
let band = { top: 0, bottom: DESIGN.height };

/* A faixa e medida, nao escrita: as pecas moram em porcentagem da cena e ganham peca nova por
   etapa. Os retangulos saem na escala corrente e voltam a escala 1 pelo `--fit` da hora. */
/** @param {HTMLElement} room */
function measureBand(room) {
  const fit = Number(room.style.getPropertyValue("--fit")) || 1;
  const box = room.getBoundingClientRect();
  let top = Infinity,
    bottom = -Infinity;
  for (const piece of room.querySelectorAll(PIECES.join(","))) {
    const r = piece.getBoundingClientRect();
    top = Math.min(top, (r.top - box.top) / fit);
    bottom = Math.max(bottom, (r.bottom - box.top) / fit);
  }
  if (!Number.isFinite(top)) return { top: 0, bottom: DESIGN.height };
  return { top: Math.max(0, top - BREATH), bottom: Math.min(DESIGN.height, bottom + BREATH) };
}

/** @param {ParentNode} root */
function fitDesk(root) {
  const area = root.querySelector(".area.cabinet");
  if (!(area instanceof HTMLElement)) return;

  /* Um observador so, reapontado: cada pintura traz um `.area` novo, e um observador por
     pintura prenderia o elemento morto da anterior. */
  if (watcher === null)
    watcher = new ResizeObserver(entries => entries.forEach(seen => scale(seen.target)));
  watcher.disconnect();
  const room = area.querySelector(".room");
  if (room instanceof HTMLElement) band = measureBand(room);
  watcher.observe(area);
  scale(area);
}

/* 📐 Quanto da altura visivel a pasta erguida ocupa. ⛔ Era 0,86, e deixava o corpo do ato em
   10,5px na tela a 1440x980: a 10px o antialiasing come a haste, e filtro nenhum conserta
   tamanho. */
const READING = 0.9;

/** @type {((seen: number) => void) | null} a calibragem do voo da pintura em curso */
let tune = null;

/** @param {Element} area */
function scale(area) {
  const room = area.querySelector(".room");
  if (!(room instanceof HTMLElement)) return;
  /* ⛔ A CENA NUNCA PASSA DE 1: acima disso a foto amplia; o preco e o fundo aparecer em volta
     numa janela maior que ela. E SO ENCOLHE QUANDO UMA PECA SAIRIA DA JANELA: dividir pela
     altura da FOTO encolhia a cena 5,1% a 1920x937 (area de 779) e reamostrava toda peca —
     a 1:1 o corte come 21px de madeira por beira e a peca mais alta fica a 39px do topo. */
  const fit = Math.min(
    1,
    Math.max(area.clientWidth / DESIGN.width, area.clientHeight / (band.bottom - band.top)),
  );
  room.style.setProperty("--fit", fit.toFixed(4));
  /* ⛔ O CORTE COME A MADEIRA LIVRE, nao a peca: a grade centra a CENA, e a faixa das pecas nao
     e centrada nela (o telefone nasce a 40px do topo, a pasta acaba a 120 do pe). Com a cena
     centrada, a 1920x800 o telefone saia 27px pela janela. */
  const spare = Math.max(0, (DESIGN.height * fit - area.clientHeight) / 2);
  const shift = ((DESIGN.height - band.top - band.bottom) / 2) * fit;
  room.style.setProperty("--room-dy", `${Math.max(-spare, Math.min(spare, shift)).toFixed(1)}px`);

  /* O telefone encosta na beira VISIVEL da direita, que muda com a janela. 📐 No meio do vao
     ate a pasta sobravam 39px de madeira a direita dele a 1440 e 152 a 1920. ⛔ 160 de recuo
     cortou o aparelho em 36px: a imagem nao tem margem e o giro alarga a caixa para 457. Os
     220 sao meia caixa rodada (228) menos os 32 do recuo, mais 24 de respiro. Em px da cena.
     ⚠ E a pasta saiu da conta: medir so com a pasta na mesa deixava a sala repintada sem
     `--phone-x`, e o telefone ia para -271px. */
  const seenRight = (DESIGN.width + area.clientWidth / fit) / 2;
  room.style.setProperty("--phone-x", `${(seenRight - 220).toFixed(1)}px`);

  /* ⛔ A beira da esquerda NAO leva a mesma conta: o punhado fecha 217px de leque e entre o
     rail e a pasta cabem 198,7. Ancorar o envelope na beira visivel devolveu 2,9px de carta
     por baixo da pasta em 6 dos 24 meses; o transbordo vai para a aresta da cena. */

  /* ⛔ O tamanho de leitura nao se deduz: a pasta mora numa arvore inclinada, e a altura na
     tela nao e a de layout vezes a escala. Duas contas erraram — uma pediu 86% da area e
     entregou 65%, a outra 64%. Quem responde e a peca, erguida uma vez e medida. */
  tune?.(area.clientHeight);
}

/* ══ O VOO DA PASTA ═══════════════════════════════════════════════════════════
   Voce nao assina o que nao pegou: na mesa o clique ERGUE, e so com ela na mao a marca e a
   rubrica respondem. Erguida, a folha vem a escala de leitura que `fitDesk` mede.
   ⭐ O voo nao anda por quadro — e RESOLVIDO e entregue ao compositor: `curveOf` da a curva
   analitica e o navegador a executa sozinho. ⛔ Transicao CSS interrompida recomeca do zero;
   aqui a interrupcao le posicao e velocidade da conta, e o voo novo parte de onde o antigo
   estava. */

/* Quique zero e amortecimento critico; 0,30s e o tempo em que o olho le o movimento inteiro
   sem esperar por ele. */
const LIFT = { duration: 0.3, bounce: 0 };
const DROP = { duration: 0.26, bounce: 0 };

/* O voo sobrevive a pintura: marcar uma pasta repinta a tela inteira, e uma pasta que cai da
   mao a cada marca e a tela recusando o gesto. */
let lifted = false;
let at = 0;
/* QUAL ato foi assinado, pela epigrafe dele: o mes vira, o ato e outro, e a rubrica sai. */
let sealed = "";

/** O voo em curso, para quem interromper saber de onde partir. @type {null | {
    curve: ReturnType<typeof curveOf>, from: number, to: number, start: number,
    how: { duration: number, bounce: number } }} */
let flying = null;

/**
 * ONDE O VOO ESTA AGORA — posicao e velocidade, os dois da conta e nenhum medido.
 *
 * ⛔ Medir entre dois quadros devolve ruido: num quadro perdido a diferenca finita ve uma
 * velocidade que a peca nunca teve, e o voo seguinte parte errado.
 *
 * @param {number} now o relogio, em milissegundos
 * @returns {{ at: number, rate: number }} a posicao de 0 a 1 e a velocidade em cursos/s
 */
function whereIs(now) {
  if (flying === null) return { at, rate: 0 };
  const t = Math.max(0, (now - flying.start) / 1000);
  const span = flying.to - flying.from;
  if (t >= flying.curve.duration) return { at: flying.to, rate: 0 };
  return {
    at: flying.from + span * flying.curve.at(t),
    rate: span * flying.curve.rate(t),
  };
}

/**
 * ESQUECE O GESTO — e a posse e o unico lugar que chama.
 *
 * ⛔ Os tres sobrevivem a partida: assinar em jan/2027 e comecar de novo devolvia o decreto de
 * jan/2027 JA RUBRICADO, com a pasta na mao a 710px. A epigrafe e funcao pura do mes e se
 * repete entre partidas, entao o gesto tem de morrer com a anterior.
 */
export function forgetDesk() {
  lifted = false;
  at = 0;
  flying = null;
  sealed = "";
}

/** @param {ParentNode} root */
function armFlight(root) {
  const room = root.querySelector(".room");
  const folder = root.querySelector(".folder");
  const sheet = root.querySelector(".stack .sheet");
  if (!(room instanceof HTMLElement) || !(folder instanceof HTMLElement)) return;
  if (!(sheet instanceof HTMLElement)) return;

  const act = sheet.querySelector(".epigraph")?.textContent ?? "";
  sheet.dataset["signed"] = String(act !== "" && act === sealed);

  /* Os alvos se leem uma vez por voo, nao por quadro: `getComputedStyle` forca calculo de
     estilo, que e o que o desenho por transform existe para evitar. */
  const of = getComputedStyle(folder);
  /** @param {string} name @param {number} fallback */
  const num = (name, fallback) => {
    const value = parseFloat(of.getPropertyValue(name));
    return Number.isFinite(value) ? value : fallback;
  };
  /* Sem perspectiva, `translateZ` e `rotateX` nao fazem nada: a aproximacao que davam (7,6%)
     entrou na escala de leitura, que `fitDesk` mede. */
  const aim = {
    dx: num("--lift-dx", 36),
    dy: num("--lift-dy", -57),
    turn: num("--folder-tilt", -2),
    rest: num("--rest", 0.5),
    rise: num("--lift-rise", 0.8),
  };
  const inHand = folder.querySelector('[data-cast="lift"]');
  const leaf = folder.querySelector(".folder__leaf");
  const spread = folder.querySelector(".folder__open");
  const pile = folder.querySelector(".stack");

  /* ⭐ TODO TERMO E LINEAR EM `t`, e e isso que leva o voo inteiro ao compositor: dois
     quadros-chave e a curva analitica no `easing` reproduzem o caminho que o laco desenhava.
     Fechada, a pasta ocupa a metade direita da caixa aberta: `left: 47%` centra a caixa ABERTA,
     e os 25% sao percentagem da propria caixa — em px seriam a terceira copia da medida. */
  /** @param {number} t */
  const shape = t =>
    `translate(-50%, -50%) translate(${aim.dx * t}px, ${aim.dy * t}px)` +
    ` rotate(${aim.turn * (1 - t)}deg) scale(${aim.rest + (aim.rise - aim.rest) * t})` +
    ` translateX(${-25 * (1 - t)}%)`;

  /* A dobra e o mesmo `t`: pegar a pasta ABRE ela, e isso e um gesto so. */
  /** @param {number} t */
  const fold = t => `rotateY(${180 * (1 - t)}deg)`;

  /* ⛔ A sombra de altura nunca chega a zero: em `opacity: 0` o navegador descarta a textura, e
     a primeira subida pagava 75ms para a GPU alocar os 132px de desfoque — 2 quadros perdidos.
     A 0,001 ela e invisivel em 8 bits por canal e a textura fica quente. */
  const FLOOR = 0.001;

  /** @param {number} t */
  const draw = t => {
    folder.style.transform = shape(t);
    /* As duas sombras em sentidos opostos e o que faz "levantou" em vez de "aumentou": a de
       contato apaga e a de altura cresce. Cruzar opacidade em vez de reescrever a sombra por
       quadro: 156,8 fps contra 143,8 no mesmo laco. */
    if (inHand instanceof HTMLElement) inHand.style.opacity = String(Math.max(FLOOR, t));
    if (leaf instanceof HTMLElement) leaf.style.transform = fold(t);
    if (spread instanceof HTMLElement) spread.style.opacity = String(Math.max(FLOOR, t));
    /* ⛔ Cobrir nao e esconder: a capa inflada para tapar a pilha arrastava a franja do recorte
       para dentro da tela. A pilha apaga, e a capa fica do tamanho da foto. */
    if (pile instanceof HTMLElement) pile.style.opacity = String(Math.max(FLOOR, t));
  };

  /* As pecas andam na mesma curva e no mesmo tempo: separadas, o olho le duas coisas. */
  const parts = () => [
    { node: folder, key: "transform", of: shape },
    { node: inHand, key: "opacity", of: (/** @type {number} */ t) => String(Math.max(FLOOR, t)) },
    { node: leaf, key: "transform", of: fold },
    { node: spread, key: "opacity", of: (/** @type {number} */ t) => String(Math.max(FLOOR, t)) },
    { node: pile, key: "opacity", of: (/** @type {number} */ t) => String(Math.max(FLOOR, t)) },
  ];

  /**
   * ERGUE OU LARGA — e o voo em curso e o ponto de partida do proximo.
   *
   * @param {number} goal 0 na mesa, 1 na mao
   * @param {{ duration: number, bounce: number }} how
   */
  const move = (goal, how) => {
    const now = performance.now();
    const here = whereIs(now);
    const span = goal - here.at;

    for (const part of parts()) {
      if (!(part.node instanceof HTMLElement)) continue;
      part.node.getAnimations().forEach(one => one.cancel());
    }
    if (Math.abs(span) < 0.001) {
      at = goal;
      flying = null;
      draw(goal);
      return;
    }

    /* A velocidade vai normalizada pelo curso novo: a curva trabalha de 0 a 1, e um impulso de
       2 cursos/s no caminho antigo nao vale 2 no novo — sem isto uma interrupcao no meio da
       subida devolve a peca com o dobro do impulso. */
    const curve = curveOf({ ...how, velocity: here.rate / span });
    flying = { curve, from: here.at, to: goal, start: now, how };
    at = goal;

    for (const part of parts()) {
      if (!(part.node instanceof HTMLElement)) continue;
      part.node.animate([{ [part.key]: part.of(here.at) }, { [part.key]: part.of(goal) }], {
        duration: curve.duration * 1000,
        easing: curve.css,
        fill: "forwards",
      });
    }
  };

  /* A calibragem do tamanho de leitura: ergue a peca, mede o que ela ocupou, e corrige a
     escala na mesma proporcao. Uma ida e volta por pintura, e nenhuma por quadro. */
  tune = seen => {
    /* A medida e tirada com a peca parada no alto: medir no meio da subida calibraria a escala
       pelo caminho. */
    for (const part of parts()) {
      if (part.node instanceof HTMLElement) part.node.getAnimations().forEach(one => one.cancel());
    }
    draw(1);
    const tall = folder.getBoundingClientRect().height;
    if (tall > 0) {
      const fixed = Math.min(1, aim.rise * ((seen * READING) / tall));
      aim.rise = fixed;
      folder.style.setProperty("--lift-rise", fixed.toFixed(4));
    }

    /* ⛔ O lugar da pasta erguida e medido, nao escrito: com `--lift-dx`/`--lift-dy` fixos, onde
       ela parava dependia de onde estava. E o centro e o da TELA, nao o da area: a area comeca
       depois do rail e abaixo da barra, e centrar nela deixava a peca 132px a direita do meio. */
    draw(1);
    const peca = folder.getBoundingClientRect();
    const janela = folder.ownerDocument.defaultView;
    if (janela !== null && peca.height > 0) {
      aim.dx += janela.innerWidth / 2 - (peca.left + peca.width / 2);
      aim.dy += janela.innerHeight / 2 - (peca.top + peca.height / 2);
    }
    const back = whereIs(performance.now());
    draw(back.at);
    if (flying !== null) move(flying.to, flying.how);
  };

  /* A pintura nova reassume o voo onde ele estava: a animacao morre com o elemento que movia,
     e sem a retomada uma pintura no meio do gesto congelava a pasta — medido a 3px da mesa, com
     a descida quase pronta. O estado do voo e de modulo para atravessar a pintura. */
  const here = whereIs(performance.now());
  draw(here.at);
  const goal = lifted ? 1 : 0;
  if (Math.abs(here.at - goal) > 0.001) move(goal, lifted ? LIFT : DROP);
  else {
    at = goal;
    flying = null;
  }

  /* O TECLADO PEGA E LARGA: Enter e Espaco viram o clique na pasta, que sobe pelo mesmo caminho
     do ponteiro; Esc larga. Sem isto a pasta era um `div` que o Tab pulava. */
  folder.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      folder.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    } else if (event.key === "Escape" && lifted) {
      lifted = false;
      folder.dataset["open"] = "false";
      move(0, DROP);
    }
  });

  room.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.closest(".folder") === null) {
      if (lifted) {
        lifted = false;
        folder.dataset["open"] = "false";
        move(0, DROP);
      }
      return;
    }

    if (!lifted) {
      /* O clique para aqui: com a pasta na mesa o gesto e PEGAR, e deixar a marca passar faria
         um clique so erguer e marcar. */
      event.stopPropagation();
      lifted = true;
      folder.dataset["open"] = "true";
      move(1, LIFT);
      return;
    }

    /* A marca e do jogo, e ela segue para o entrypoint. */
    if (target.closest("[data-protect]") !== null) return;

    /* A rubrica so corre com a pasta assentada na mao: o traco leva 1,1s, e assinar no meio da
       subida desenharia o nome enquanto a folha anda. */
    if (target.closest(".stack .sheet") !== null && whereIs(performance.now()).at > 0.94) {
      sealed = sealed === act ? "" : act;
      sheet.dataset["signed"] = String(sealed === act);
    }
  });
}
