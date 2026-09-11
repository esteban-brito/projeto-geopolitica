/* GABINETE — a MESA, e ela deixou de ser um painel de vez.

   ⭐ ELA ERA QUATRO ZONAS DE VIDRO — a promessa, a caneta, seis leituras e os prazos —, e a
   ordem que as tirou foi dele: "nada de paineis flutuando em cima de uma mesa… quero realismo
   fisico, e um gabinete realista que FUNCIONE". Depois, ao ver a mesa de pe: "o gabinete por
   enquanto sera so a mesa com as coisas em cima como ja definimos".

   ⚠ AS SEIS LEITURAS SAIRAM DA TELA, e a ausencia e declarada e nao esquecida: duas delas —
   aprovacao e base — ja moram na barra superior, a 40px de distancia, e as outras esperam a
   peca de papel que vai carrega-las. O que NAO saiu foi a jogada: as oito pastas do
   contingenciamento agora sao marcadas no proprio decreto, que e onde o Art. 2 fala delas.

   ⚠ A LINGUA DA CAIXA CONTINUA AQUI, e a guarda `annexes` a fecha: `emailHtml` nao mudou. */

import { escapeHtml } from "../shared/html.mjs";
import { armSignature, decreeHtml } from "../shared/decree.mjs";
import { briefHtml } from "../shared/brief.mjs";
import { mailPileHtml } from "../shared/mail-pile.mjs";
import { phoneHtml } from "../shared/phone.mjs";
import { spring } from "../shared/spring.mjs";
import { felt, fibre } from "../shared/texture.mjs";
import { UI } from "../strings.mjs";

/* AS MATERIAS DA MESA, e elas nascem UMA vez. As duas fotos entram por `url()` e as tres
   superficies por data URI; gerar os SVG a cada pintura refaria tres filtros por clique.

   ⚠ E ELAS NAO PODEM MORAR NO CSS: `feTurbulence` sai de JS como data URI, e a folha nao
   tem como escreve-lo. O CSS declara a alternativa `none` em cada uma. */
/* ⛔ E O CAMINHO E ABSOLUTO: `url()` dentro de custom property resolve contra a FOLHA que a
   consome, e nao contra a pagina — relativo, a mesa pedia `/styles/assets/` e dava 404. */
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
  /* ── A CAIXA OCUPA A TELA INTEIRA ───────────────────────────────────────── ⚠ O VAZIO
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

  return `<section class="area cabinet"><div class="cards">${inbox}</div></section>`;
}

/**
 * A MESA — o tampo, a pasta de despachos e a correspondencia do mes.
 *
 * ⚠ O TAMPO SANGRA PELOS LADOS de proposito: uma mesa que cabe inteira na tela vira uma
 * bandeja. O que se ve e um pedaco dela.
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
  /* ⚠ AS FOLHAS DE BAIXO NAO TEM TEXTO, e a ausencia e declarada: o jogo tem UMA caneta
     construida, o contingenciamento. As outras sao a borda do que ainda vai existir. */
  const under = Array.from(
    { length: input.sheets },
    (_, i) => `<div class="stack__under" style="--i:${input.sheets - i}"></div>`,
  ).join("");

  return (
    `<section class="area cabinet">` +
    `<div class="room">` +
    /* ⛔ NAO HA TAMPO AQUI: a madeira e o SUBSTRATO da janela — `.backdrop`, o mesmo que o
       vidro da barra e do rail refratam. A cena so tem as pecas, e por isso a mesa passa por
       baixo da interface em vez de terminar contra ela. */
    `<div class="folder">` +
    /* ⭐ AS DUAS SOMBRAS SAO CAMADAS PRONTAS, e o voo so cruza a opacidade delas. */
    `<i class="folder__cast" data-cast="rest"></i>` +
    `<i class="folder__cast" data-cast="lift"></i>` +
    `<div class="folder__light"></div>` +
    /* ⭐ A FACE ESQUERDA E O PARECER, e nao couro vazio: uma pasta de despacho tem o que te
       explica de um lado e o que voce assina do outro. O "boletim" do ciclo 25 nao existe no
       governo real — o que existe e a exposicao de motivos, e ela mora aqui. */
    briefHtml(input.brief) +
    `<i class="folder__fold"></i>` +
    `<div class="stack">${under}${decreeHtml(input)}</div>` +
    `</div>` +
    `<div class="mail">${mailPileHtml(input)}</div>` +
    phoneHtml(input) +
    `</div>` +
    `</section>`
  );
}

/**
 * VESTE A MESA — as materias e a rubrica, depois de a mesa estar na pagina.
 *
 * ⚠ DEPOIS DE PINTAR, E NAO DENTRO DO HTML: `armSignature` mede o traco com
 * `getTotalLength`, que so existe com o `<path>` na pagina. As materias vem junto porque a
 * pintura as apaga — `innerHTML` troca o elemento, e o estilo inline vai com ele.
 *
 * @param {ParentNode} root o `main` recem-pintado
 */
export function dressDesk(root) {
  /** @param {string} pick @param {string} name @param {string} value */
  const wear = (pick, name, value) => {
    const node = root.querySelector(pick);
    if (node instanceof HTMLElement) node.style.setProperty(name, value);
  };

  /* ⭐ A MADEIRA VAI PARA O CORPO DA PAGINA, e quem a le e o substrato fixo da janela: a barra
     e o rail sao vidro com `backdrop-filter`, e vidro sobre um fundo liso nao refrata nada —
     era por isso que a mesa parecia colada AO LADO da interface. Com a foto embaixo de tudo,
     o vidro finalmente tem o que borrar. */
  const body = root instanceof Element ? root.ownerDocument.body : null;
  if (body) {
    body.style.setProperty("--timber", TIMBER);
    /* A MEDIDA DA CENA VAI COM ELA: o `.backdrop` pinta a foto no tamanho exato, e o `.room`
       se dimensiona pelo mesmo par — um numero so, escrito de um lugar so. */
    body.style.setProperty("--room-w", `${DESIGN.width}px`);
    body.style.setProperty("--room-h", `${DESIGN.height}px`);
  }
  /* A FIBRA DESCE POR HERANCA: quem a le e a `.sheet`, que mora dentro da pasta. */
  wear(".folder", "--fibre", FIBRE);
  /* ⚠ O ENVELOPE NAO USA A FIBRA DA FOLHA: papel de carta e liso e envelope de convite e
     feltrado. O feltro tem relevo calculado; a fibra e so ruido cinza. */
  wear(".mail", "--felt", FELT);

  /* ⛔ `.stack .sheet` E NAO `.sheet`: a face esquerda da pasta e uma folha tambem, e ela vem
     ANTES no documento — `querySelector` devolvia o parecer, e a rubrica do ato nunca seria
     medida. Quem assina e o que esta na pilha. */
  armSignature(root.querySelector(".stack .sheet"));
  /* ⚠ O VOO PRIMEIRO, e a medida depois: quem calibra o tamanho de leitura e o proprio
     desenho do voo, e `fitDesk` o chama assim que a escala da cena esta escrita. */
  armFlight(root);
  fitDesk(root);
}

/* ══ A CENA E A FOTO ══════════════════════════════════════════════════════════
   ⭐ A MESA TEM O TAMANHO DA FOTO DO TAMPO e nunca cresce alem dele, por ordem dele: "nao
   quero ampliacao alguma na textura". A janela mostra o CENTRO da cena, e em nenhuma largura
   um pixel da madeira e reamostrado para cima.
   ⭐ E ESTA E A UNICA FONTE DA MEDIDA. Ela morava aqui, no `.room` e no `.backdrop`, com um
   aviso de que os tres mudavam juntos — e o aviso falhou: quatro comentarios ficaram em
   1206x806 e um deles em 1672x940. Hoje o CSS le `--room-w` e `--room-h`, que saem daqui. */
const DESIGN = { width: 1916, height: 821 };

/** @type {ResizeObserver | null} */
let watcher = null;

/** @param {ParentNode} root */
function fitDesk(root) {
  const area = root.querySelector(".area.cabinet");
  if (!(area instanceof HTMLElement)) return;

  /* ⚠ UM OBSERVADOR SO, REAPONTADO: cada pintura traz um `.area` novo, e um observador por
     pintura prenderia o elemento morto da anterior. */
  if (watcher === null)
    watcher = new ResizeObserver(entries => entries.forEach(seen => scale(seen.target)));
  watcher.disconnect();
  watcher.observe(area);
  scale(area);
}

/* 📐 QUANTO DA ALTURA VISIVEL A PASTA ERGUIDA OCUPA. Os 14% que sobram sao a folga que
   impede o corte: a cena e cortada e nao encolhida, entao numa janela larga a mesa tem mais
   altura do que se ve dela. */
const READING = 0.86;

/** @type {((seen: number) => void) | null} a calibragem do voo da pintura em curso */
let tune = null;

/** @param {Element} area */
function scale(area) {
  const room = area.querySelector(".room");
  if (!(room instanceof HTMLElement)) return;
  /* ⛔ E A CENA NUNCA PASSA DE 1, por ordem dele: "nao quero ampliacao alguma na textura,
     quero a imagem como ela e, resolucao original". A cena tem o tamanho exato da foto —
     `DESIGN`, logo acima —, entao qualquer fator acima de 1 amplia a madeira. O preco esta
     medido e e este: acima daquele tamanho a mesa para de crescer e o fundo aparece em volta. */
  const fit = Math.min(
    1,
    Math.max(area.clientWidth / DESIGN.width, area.clientHeight / DESIGN.height),
  );
  room.style.setProperty("--fit", fit.toFixed(4));

  /* ⛔ E O TAMANHO DE LEITURA NAO SE DEDUZ: ele depende da altura que sobrou depois do corte,
     e a pasta mora numa arvore 3D inclinada — a altura dela na tela nao e a de layout vezes a
     escala. Duas contas foram tentadas e as duas erraram: uma pediu 86% da area e entregou 65%,
     a outra 64%. Quem responde e a peca, erguida uma vez e medida. */
  tune?.(area.clientHeight);
}

/* ══ O VOO DA PASTA ═══════════════════════════════════════════════════════════
   ⭐ VOCE NAO ASSINA O QUE NAO PEGOU: na mesa o clique ERGUE, e so com ela na mao a marca e a
   rubrica respondem. Erguida, a folha vem a escala 1 e sem inclinacao — e essa a leitura.
   ⛔ E E MOLA POR QUADRO, E NAO TRANSICAO CSS: transicao interrompida RECOMECA DO ZERO, e
   erguer e largar em sequencia e exatamente o caso em que isso aparece.
   ⚠ A SUBIDA QUICA E A DESCIDA NAO: subir e devolucao, e o quique da massa a peca; descer e
   assentar, e quique ali le como a pasta pulando na mesa. */
const LIFT = { duration: 0.42, bounce: 0.22 };
const DROP = { duration: 0.26, bounce: 0 };

/* ⚠ O VOO SOBREVIVE A PINTURA, e ele TEM de sobreviver: marcar uma pasta repinta a tela
   inteira, e uma pasta que cai da mao a cada marca e a tela recusando o gesto. */
let lifted = false;
let at = 0;
/* QUAL ato foi assinado, pela epigrafe dele: o mes vira, o ato e outro, e a rubrica sai. */
let sealed = "";

/**
 * ESQUECE O GESTO — e a posse e o unico lugar que chama.
 *
 * ⛔ OS TRES SOBREVIVEM A PARTIDA, e medido isso entrega uma mesa que ninguem tocou: assinar
 * em jan/2027 e comecar de novo devolvia o decreto de jan/2027 JA RUBRICADO, com a pasta na
 * mao a 710px e a sala apagada. A epigrafe e funcao pura do mes, entao ela se repete entre
 * partidas — comparar por ela nao separa duas mesas, e o gesto tem de morrer com a anterior.
 */
export function forgetDesk() {
  lifted = false;
  at = 0;
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

  /* ⚠ OS ALVOS SE LEEM UMA VEZ POR VOO, e nao por quadro: `getComputedStyle` forca calculo de
     estilo, que e exatamente o que o desenho por transform existe para evitar. */
  const of = getComputedStyle(folder);
  /** @param {string} name @param {number} fallback */
  const num = (name, fallback) => {
    const value = parseFloat(of.getPropertyValue(name));
    return Number.isFinite(value) ? value : fallback;
  };
  /* ⛔ A MESA E VISTA DE CIMA, e o voo perdeu o `translateZ` e o `rotateX` que cancelavam a
     inclinacao do tampo: sem perspectiva os dois nao fazem nada, e a aproximacao que eles
     davam (7,6% a mais) entrou na escala de leitura, que `fitDesk` ja mede. */
  const aim = {
    dx: num("--lift-dx", 36),
    dy: num("--lift-dy", -57),
    turn: num("--folder-tilt", -2),
    rest: num("--rest", 0.5),
    rise: num("--lift-rise", 0.8),
  };
  const onDesk = folder.querySelector('[data-cast="rest"]');
  const inHand = folder.querySelector('[data-cast="lift"]');

  /** @param {number} t */
  const draw = t => {
    const size = aim.rest + (aim.rise - aim.rest) * t;
    folder.style.transform =
      `translate(-50%, -50%) translate(${aim.dx * t}px, ${aim.dy * t}px)` +
      ` rotate(${aim.turn * (1 - t)}deg) scale(${size})`;
    /* AS DUAS SOMBRAS EM SENTIDOS OPOSTOS, e e isso que faz "levantou" em vez de "aumentou": a
       de contato APAGA e a de altura CRESCE. ⭐ E elas se CRUZAM em opacidade em vez de a
       sombra ser reescrita por quadro: reescrever repinta a peca inteira, e a medicao deu 13
       fps de diferenca — 156,8 contra 143,8 no mesmo laco. */
    if (onDesk instanceof HTMLElement) onDesk.style.opacity = String(1 - t);
    if (inHand instanceof HTMLElement) inHand.style.opacity = String(t);
  };

  /* ⭐ A CALIBRAGEM DO TAMANHO DE LEITURA: ergue a peca, mede o que ela ocupou, e corrige a
     escala na mesma proporcao. Uma ida e volta por pintura, e nenhuma por quadro. */
  tune = seen => {
    draw(1);
    const tall = folder.getBoundingClientRect().height;
    if (tall > 0) {
      const fixed = Math.min(1, aim.rise * ((seen * READING) / tall));
      aim.rise = fixed;
      folder.style.setProperty("--lift-rise", fixed.toFixed(4));
    }
    draw(at);
  };

  /* A PINTURA NOVA REASSUME O VOO ONDE ELE ESTAVA, e CONTINUA se ele estava no meio: a mola
     morre com o elemento que ela movia, e sem esta retomada uma pintura no meio do gesto
     congelava a pasta onde ela estivesse — medido a 3px da mesa, com a descida quase pronta. */
  draw(at);
  const move = spring(
    step => {
      at = step;
      draw(step);
    },
    { ...LIFT, from: at },
  );
  const goal = lifted ? 1 : 0;
  if (at !== goal) move(goal, lifted ? LIFT : DROP);

  room.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.closest(".folder") === null) {
      if (lifted) {
        lifted = false;
        move(0, DROP);
      }
      return;
    }

    if (!lifted) {
      /* ⛔ E O CLIQUE PARA AQUI: com a pasta na mesa o gesto e PEGAR, e deixar a marca passar
         faria um clique so erguer e marcar. */
      event.stopPropagation();
      lifted = true;
      move(1, LIFT);
      return;
    }

    /* A MARCA E DO JOGO, e ela segue para o entrypoint. */
    if (target.closest("[data-protect]") !== null) return;

    /* ⭐ E A RUBRICA SO CORRE COM A PASTA ASSENTADA NA MAO: o traco leva 1,1s, e assinar no
       meio da subida desenharia o nome enquanto a folha ainda anda. */
    if (target.closest(".stack .sheet") !== null && at > 0.94) {
      sealed = sealed === act ? "" : act;
      sheet.dataset["signed"] = String(sealed === act);
    }
  });
}
