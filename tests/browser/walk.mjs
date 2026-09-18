/* O PASSEIO — a tela usada como se joga, num navegador de verdade.
   POR QUE ELE EXISTE, e a resposta e uma lista de defeitos que nada mais pegou.
   `npm run screen` abre a pagina e mede o custo do material; ele nunca CLICA em nada, entao
   so ve a tela de abertura. */

import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { ROOT } from "../lib/project.mjs";
import { CATALOG } from "../../src/data/catalog.mjs";

const PORT = 5201;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = join(ROOT, "captures", "passeio");

const server = spawn(process.execPath, [join(ROOT, "tools", "serve-static.mjs")], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: "ignore",
});

async function waitForServer(tries = 60) {
  for (let i = 0; i < tries; i++) {
    try {
      const response = await fetch(`${BASE}/index.html`);
      if (response.ok) return;
    } catch {
      /* ainda subindo */
    }
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw new Error("o servidor nao subiu");
}

let failures = 0;
/** @type {string[]} */
const report = [];

/* NO GABINETE OS MINISTERIOS MORAM NA GAVETA DO DOCK: para clicar num deles a gaveta abre antes.
   Nas outras telas o botao da gaveta nao existe e o clique vai direto. */
/** @param {import("playwright").Page} page @param {string} key */
async function viaRail(page, key) {
  const drawer = page.locator(".rail__drawer");
  const hidden = await page.locator(`[data-section="${key}"]`).first().isHidden();
  if (hidden && (await drawer.count()) > 0 && (await drawer.isVisible())) {
    await drawer.click();
    await page.waitForTimeout(120);
  }
  await page.click(`[data-section="${key}"]`);
}

/** @param {boolean} condition @param {string} complaint */
function expect(condition, complaint) {
  if (condition) return;
  failures++;
  report.push(complaint);
}

try {
  await waitForServer();
  mkdirSync(OUT, { recursive: true });

  /* Sem cabeca aqui, e COM cabeca no `screen-cost`. */
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 980 } });
  const page = await context.newPage();

  /** @type {string[]} */
  const noise = [];
  page.on("console", message => {
    if (message.type() === "error" || message.type() === "warning") noise.push(message.text());
  });
  /* ⚠ `pageerror` NAO E `console`, e por isso uma familia inteira de defeito era invisivel
     aqui: rejeicao de promessa nao tratada chega por este canal e nao pelo outro. Ele
     achou 46 delas na primeira vez que foi ligado, todas de View Transition pulada. */
  page.on("pageerror", error => noise.push(`erro nao tratado: ${error.message}`));
  page.on("pageerror", error => noise.push(String(error)));
  page.on("requestfailed", request => noise.push(`404/erro: ${request.url()}`));

  /** @param {string} where */
  async function checkOverflow(where) {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(!overflow, `[${where}] a tela rola na horizontal`);
  }

  /**
   * ⚠ CONTEUDO CORTADO DENTRO DO PROPRIO RECORTE, e o passeio era CEGO para isso: ele media a
   * rolagem da PAGINA, e uma peca com `overflow-x: auto` engole o excesso sem que a pagina
   * cresca um pixel. Foi assim que a tabela do anexo saiu com a coluna da SOMA cortada duas
   * vezes — na segunda, com o passeio verde ao lado.
   * A rolagem lateral e o plano B declarado para janela estreita; a 1440px nada deve cortar.
   *
   * @param {string} where
   */
  async function checkClipped(where) {
    const clipped = await page.$$eval("#main *, .rail *", nodes =>
      nodes
        .filter(node => {
          const style = getComputedStyle(node);
          if (style.overflowX !== "auto" && style.overflowX !== "scroll") return false;
          return node.scrollWidth > node.clientWidth + 1;
        })
        .map(node => `${node.className || node.tagName} ${node.scrollWidth}>${node.clientWidth}`),
    );

    expect(
      clipped.length === 0,
      `[${where}] peca com conteudo cortado dentro do proprio recorte: ${clipped.join(" | ")}`,
    );
  }

  /* ⚠ O PASSEIO NAO VIA A PAGINA ROLAR, e essa foi a quinta ocorrencia da mesma cegueira: ele
     media recorte DENTRO dos elementos e transbordo lateral, e um Gabinete 31px mais alto que
     a janela passava verde. A tela e a unica do jogo que declara nao rolar — acima de 940px de
     altura ela trava em `100dvh` e as listas rolam por dentro (`40-shell.css`).
     ⛔ E O LIMIAR DELA ERA DE ALTURA, 940px, o que a desligava EXATAMENTE onde o defeito
     morava: a 1440x900 a pagina rolava 94px e esta funcao saia calada. O limiar continua sendo
     o da folha, e a folha passou a medir LARGURA — abaixo de 1181 o rail vira faixa no topo, e
     ali a pagina rolar e decisao declarada. */
  /** @param {string} where */
  async function checkNoPageScroll(where) {
    const scroll = await page.evaluate(() => ({
      page: document.documentElement.scrollHeight,
      window: window.innerHeight,
      wide: window.innerWidth,
    }));
    if (scroll.wide < 1181) return;
    expect(
      scroll.page <= scroll.window + 1,
      `[${where}] a pagina rola ${scroll.page - scroll.window}px — o Gabinete nao rola com o ` +
        `rail em coluna, e quem rola por dentro sao as listas`,
    );
  }

  /**
   * ⚠ O GEMEO VERTICAL DE `checkClipped`, E ELE NASCEU DE UM CARTAO INTEIRO SUMINDO: a coluna
   * do Gabinete tem `overflow-y: auto` e engolia 175px numa janela de 760 — a pagina nao
   * crescia um pixel, entao `checkOverflow` passava e este passeio ficava verde ao lado.
   * `.tray__list` e a UNICA excecao declarada: o indice de cartas cresce todo mes e sempre
   * foi desenhado para rolar.
   *
   * @param {string} where
   */
  async function checkSwallowed(where) {
    const swallowed = await page.$$eval("#main *, .rail *", nodes =>
      nodes
        .filter(node => {
          if (node.closest(".tray__list")) return false;
          const style = getComputedStyle(node);
          if (style.overflowY !== "auto" && style.overflowY !== "scroll") return false;
          return node.scrollHeight > node.clientHeight + 1;
        })
        .map(node => `${node.className || node.tagName} ${node.scrollHeight}>${node.clientHeight}`),
    );

    expect(
      swallowed.length === 0,
      `[${where}] peca engolindo conteudo no eixo Y: ${swallowed.join(" | ")}`,
    );
  }

  /**
   * ⚠ O TERCEIRO IRMAO DE `checkClipped`, e ele ve o que os outros dois nao veem: `overflow:
   * hidden` com `text-overflow: ellipsis` NAO rola, entao nem o eixo X nem o eixo Y acusam —
   * a frase simplesmente perde o fim, com reticencia, e a tela fica plausivel. E a familia
   * inteira ja custou quatro vezes aqui: toda checagem nasce sem alcance.
   * A EXCECAO DECLARADA E UMA SO: `.bench__name small`, o nome longo do partido numa coluna
   * de 96px — a sigla ao lado dela e o nome curto, e a reticencia ali e o desenho.
   *
   * @param {string} where
   */
  async function checkEllipsized(where) {
    const cut = await page.$$eval("#main *, .topbar *, .rail *", nodes =>
      nodes
        .filter(node => {
          if (node.closest(".bench__name")) return false;
          const style = getComputedStyle(node);
          if (style.textOverflow !== "ellipsis") return false;
          return node.scrollWidth > node.clientWidth + 1;
        })
        .map(
          node =>
            `${node.className || node.tagName} "${(node.textContent ?? "").trim().slice(0, 24)}" ` +
            `${node.scrollWidth}>${node.clientWidth}`,
        ),
    );

    expect(cut.length === 0, `[${where}] texto truncado com reticencia: ${cut.join(" | ")}`);
  }

  /**
   * ⚠ O QUINTO IRMAO, e ele ve o que os outros quatro nao veem: peca de largura FIXA nao
   * rola, nao poe reticencia e nao move `scrollWidth` do pai — ela so pinta por cima do
   * vizinho. Tres defeitos moravam ai: a marca atravessava a peca dos vitais abaixo de
   * 1228px, a legenda invisivel do botao jogava a seta 193px alem da aresta, e um marco de
   * catalogo mais longo empurrava 212px de texto para fora da peca do quando.
   *
   * @param {string} where
   */
  async function checkTopbar(where, on = page) {
    const found = await on.evaluate(() => {
      /** @param {string} s @returns {DOMRect | null} */
      const r = s => document.querySelector(s)?.getBoundingClientRect() ?? null;
      const bar = r(".topbar");
      const brand = r(".topbar__brand");
      const cluster = r(".topbar__cluster");
      const go = r(".go");
      const arrow = r(".go__arrow");
      /** @type {string[]} */
      const out = [];
      if (!bar || !brand || !cluster || !go || !arrow) return ["a barra nao veio inteira"];
      if (brand.right > cluster.x + 0.5) {
        out.push(`a marca invade o cacho em ${(brand.right - cluster.x).toFixed(1)}px`);
      }
      if (cluster.right > bar.right + 0.5) {
        out.push(`o cacho passa da barra em ${(cluster.right - bar.right).toFixed(1)}px`);
      }
      if (arrow.right > go.right + 0.5 || arrow.x < go.x - 0.5) {
        out.push(
          `a seta saiu do botao: ${arrow.x.toFixed(0)}→${arrow.right.toFixed(0)} contra ${go.x.toFixed(0)}→${go.right.toFixed(0)}`,
        );
      }
      for (const node of document.querySelectorAll(".topbar *")) {
        const style = getComputedStyle(node);
        if (style.overflow === "hidden" || style.overflowX === "hidden") continue;
        if (node.clientWidth > 0 && node.scrollWidth > node.clientWidth + 1) {
          out.push(`${node.className} vaza ${node.scrollWidth - node.clientWidth}px`);
        }
      }
      return out;
    });
    expect(found.length === 0, `[${where}] a barra superior vaza: ${found.join(" | ")}`);
  }

  /**
   * ⚠ O QUARTO IRMAO, e ele ve o que os outros tres nao veem. `-webkit-line-clamp` nao rola,
   * nao poe reticencia no eixo X e NAO MOVE `scrollHeight`: a caixa de `-webkit-box` so
   * diagrama as linhas que sobraram, entao o sinal padrao de estouro simplesmente nao existe.
   * A unica forma de medir e SOLTAR o recorte e comparar a altura — e e o que ela faz, dentro
   * de um `evaluate` so, sem repintura entre a mudanca e a restauracao.
   * ⚠ E A EXCECAO DECLARADA MORREU: `.tray__subject` era isenta porque o corte em duas linhas
   * era desenho. Em quatro ele nao corta mais — 20 de 28 assuntos perdiam o fim —, entao o
   * indice passa a ser guardado como o resto da tela.
   *
   * @param {string} where
   */
  async function checkClamped(where) {
    const cut = await page.$$eval("#main *, .topbar *, .rail *", nodes =>
      nodes
        .filter(node => {
          const style = getComputedStyle(node);
          if (!style.webkitLineClamp || style.webkitLineClamp === "none") return false;

          const clamped = node.clientHeight;
          const clamp = node.style.webkitLineClamp;
          const display = node.style.display;
          node.style.webkitLineClamp = "unset";
          node.style.display = "block";
          const full = node.scrollHeight;
          node.style.webkitLineClamp = clamp;
          node.style.display = display;

          return full > clamped + 1;
        })
        .map(
          node =>
            `${node.className || node.tagName} "${(node.textContent ?? "").trim().slice(0, 24)}" ` +
            `${node.scrollHeight}>${node.clientHeight}`,
        ),
    );

    expect(cut.length === 0, `[${where}] texto cortado por recorte de linhas: ${cut.join(" | ")}`);
  }

  /**
   * PECA DESENHADA POR CIMA DE PECA — e este e um defeito que so a geometria pega.
   *
   * @param {string} where
   * @param {string} selector as pecas que nao podem se cruzar
   */
  async function checkNoOverlap(where, selector) {
    const crossings = await page.$$eval(selector, nodes => {
      const boxes = nodes.map(node => {
        const box = node.getBoundingClientRect();
        return {
          name: (node.querySelector(".card__title")?.textContent ?? node.className)
            .trim()
            .slice(0, 24),
          left: box.left,
          top: box.top,
          right: box.right,
          bottom: box.bottom,
        };
      });

      const found = [];
      for (let a = 0; a < boxes.length; a++) {
        for (let b = a + 1; b < boxes.length; b++) {
          const one = boxes[a];
          const other = boxes[b];
          if (!one || !other) continue;
          const across = Math.min(one.right, other.right) - Math.max(one.left, other.left);
          const down = Math.min(one.bottom, other.bottom) - Math.max(one.top, other.top);
          if (across > 1 && down > 1) {
            found.push(`${one.name} × ${other.name} (${Math.round(across)}×${Math.round(down)}px)`);
          }
        }
      }
      return found;
    });

    expect(
      crossings.length === 0,
      `[${where}] pecas desenhadas uma por cima da outra: ${crossings.join(" | ")}`,
    );
  }

  /* ── O CONTRASTE, MEDIDO NO PAR RENDERIZADO ─────────────────────────────── ⚠ ELE NAO PODE
     SER GUARDA DE `npm run check`, e a razao decide o desenho: `--ink-dim` sobre `--bg` passa
     folgado e sobre a lamina do palco reprovava — o par teorico e o par certo sao dois pares
     diferentes, e so um navegador sabe qual e qual. Por isso ele mora aqui.
     O FUNDO SAI DO PIXEL e a TINTA sai do valor computado: amostrar a tinta na captura leria
     serrilhado em vez de cor. A mediana da caixa e o fundo porque letra e minoria de pixel.
     ⚠ SO FOLHA ENTRA — elemento sem filho elemento. Um `<p>` com `<b>` dentro fica de fora, e
     o `<b>` e medido sozinho: medir o pai daria a cor dele contra a caixa dos dois. */
  const FLOOR = 4.5;
  /* AA nao pede 4,5 de texto GRANDE, e o piso dele e 3,0 — 24px, ou 18,66px em negrito. */
  const LARGE = 24;
  const LARGE_BOLD = 18.66;

  /** @param {string} where */
  async function checkContrast(where) {
    /* ⚠ A CAPTURA E DA PAGINA INTEIRA, e nao da janela: Financas rola 1300px, e medir so o
       que cabe na tela deixaria metade das leituras sem medicao nenhuma. Ver o desvio de
       `scrollY` abaixo — a caixa do elemento e da JANELA, e a captura e do documento. */
    const shot = (await page.screenshot({ fullPage: true })).toString("base64");
    const failures = await page.evaluate(
      async ({ shot, FLOOR, LARGE, LARGE_BOLD }) => {
        const image = new Image();
        image.src = `data:image/png;base64,${shot}`;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return ["o canvas de medicao nao abriu"];
        ctx.drawImage(image, 0, 0);
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const scale = image.width / document.documentElement.clientWidth;
        const downBy = window.scrollY;
        const acrossBy = window.scrollX;

        /** @param {number} channel */
        const linear = channel => {
          const unit = channel / 255;
          return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
        };
        /** @param {number} r @param {number} g @param {number} b */
        const lum = (r, g, b) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);

        const found = [];
        for (const node of document.querySelectorAll("#main *, .topbar *, .rail *")) {
          if (node.children.length > 0) continue;
          if (!(node.textContent ?? "").trim()) continue;

          const box = node.getBoundingClientRect();
          if (box.width < 2 || box.height < 2) continue;
          const style = getComputedStyle(node);
          if (style.visibility === "hidden" || style.opacity === "0") continue;

          /* ⛔ NAO MEDE O QUE ESTA COBERTO: medir elemento tapado mede a peca de cima.
             Se o centro da caixa no viewport responde para outro elemento, pula. */
          const cx = box.left + box.width / 2;
          const cy = box.top + box.height / 2;
          if (cx >= 0 && cx <= window.innerWidth && cy >= 0 && cy <= window.innerHeight) {
            const hit = document.elementFromPoint(cx, cy);
            if (hit !== null && hit !== node && !node.contains(hit)) continue;
          }

          const parts = style.color.match(/rgba?\(([^)]+)\)/);
          if (!parts || !parts[1]) continue;
          const [r = 0, g = 0, b = 0, alpha = 1] = parts[1].split(",").map(Number);

          const x0 = Math.max(0, Math.round((box.left + acrossBy) * scale));
          const x1 = Math.min(canvas.width, Math.round((box.right + acrossBy) * scale));
          const y0 = Math.max(0, Math.round((box.top + downBy) * scale));
          const y1 = Math.min(canvas.height, Math.round((box.bottom + downBy) * scale));
          const sample = [];
          for (let y = y0; y < y1; y++) {
            for (let x = x0; x < x1; x++) {
              const at = (y * canvas.width + x) * 4;
              sample.push({
                r: pixels[at] ?? 0,
                g: pixels[at + 1] ?? 0,
                b: pixels[at + 2] ?? 0,
                l: lum(pixels[at] ?? 0, pixels[at + 1] ?? 0, pixels[at + 2] ?? 0),
              });
            }
          }
          if (sample.length === 0) continue;
          /* ⚠ O DECIL DO FUNDO DEPENDE DE QUE LADO A TINTA ESTA, e ignorar isso produziu os
             DOIS falsos positivos deste medidor. A mediana pega tinta em caixa apertada — num
             valor de um digito `--ink` saiu 4,05 quando o par real passa de 14. E um decil fixo
             na ponta escura subestima texto ESCURO sobre fundo claro: o botao de avancar, tinta
             `--bg-deep` sobre latao, saiu 4,43 porque a amostra caiu na parte mais escura do
             gradiente. O fundo e o aglomerado do lado OPOSTO ao da tinta. */
          sample.sort((one, other) => one.l - other.l);
          const middle = sample[Math.floor(sample.length / 2)];
          if (!middle) continue;
          const inkOnDeclared = lum(r, g, b);
          const light = inkOnDeclared > middle.l;
          const back = sample[Math.floor(sample.length * (light ? 0.3 : 0.7))];
          if (!back) continue;

          /* A TINTA COMPOSTA, e nao a declarada: metade das notas deste projeto e branco com
             alfa, e o literal delas nao e a cor que chega ao olho. */
          const ink = lum(
            r * alpha + back.r * (1 - alpha),
            g * alpha + back.g * (1 - alpha),
            b * alpha + back.b * (1 - alpha),
          );
          const ratio = (Math.max(ink, back.l) + 0.05) / (Math.min(ink, back.l) + 0.05);

          const size = Number.parseFloat(style.fontSize);
          const bold = Number.parseInt(style.fontWeight, 10) >= 700;
          const floor = size >= LARGE || (bold && size >= LARGE_BOLD) ? 3 : FLOOR;
          if (ratio + 0.005 < floor) {
            /* O NOME DO PAI ENTRA JUNTO porque metade das acusacoes cai num `<b>` solto, e
               `b` sozinho nao diz em que peca da tela ele mora. */
            const name =
              (typeof node.className === "string" ? node.className : node.getAttribute("class")) ||
              node.tagName.toLowerCase();
            const pClass = node.parentElement?.className;
            const parent =
              (typeof pClass === "string" ? pClass : node.parentElement?.getAttribute("class")) ||
              "";
            found.push(
              `${parent ? `${parent} > ` : ""}${name} "${(node.textContent ?? "").trim().slice(0, 22)}" ` +
                `${ratio.toFixed(2)} < ${floor} (${style.fontSize}, ${style.color})`,
            );
          }
        }
        return found;
      },
      { shot, FLOOR, LARGE, LARGE_BOLD },
    );

    expect(
      failures.length === 0,
      `[${where}] contraste abaixo do piso AA: ${failures.join(" | ")}`,
    );
  }

  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });

  /* ⛔ A PASTA NASCE FECHADA, e as medidas do ATO precisam dela aberta: fechada, a pilha esta
     em opacidade 0,001 atras da capa e o parecer esta virado para o outro lado. O contraste
     saia em 1,1 a 3,5 e o enquadramento acusava vao de lombada de -308px — nenhum dos dois era
     defeito de arranjo, os dois mediam uma pasta que ninguem abriu.
     ⭐ ABRIR E O GESTO DO JOGADOR, entao a prova o faz: e a mesma peca, no estado em que ela
     existe para ser lida. A etapa do voo, adiante, fecha de volta e mede o gesto. */
  /** Abre ou fecha a pasta, e espera o voo assentar.
   * ⛔ E O CLIQUE NAO VAI NO CENTRO DA CAIXA: fechada, a metade esquerda dela esta VAZIA — a
   * folha girou para cima da direita —, e o centro cai na mesa, que engole o clique. Quem
   * responde e a peca pintada: a capa para abrir, e a sala longe dela para fechar.
   * ⚠ O CLIQUE DE FECHAR TEM DE ACERTAR A SALA VISIVEL: a `.room` transborda a janela e o topo
   * cai sob a barra de vitais. Quem fecha e um ponto visivel da sala, fora da pasta, conferido
   * por `elementFromPoint`.
   * @param {boolean} abrir */
  async function setFolder(abrir) {
    const onde = await page.evaluate(() => {
      const spread = document.querySelector(".folder__open");
      const cover = document.querySelector(".folder__cover");
      if (spread === null || cover === null) return null;
      const aberta = Number(getComputedStyle(spread).opacity) > 0.5;
      const box = (aberta ? spread : cover).getBoundingClientRect();
      return { aberta, x: box.left + box.width / 2, y: box.top + box.height / 2 };
    });
    if (onde === null || onde.aberta === abrir) return;
    if (abrir) {
      await page.mouse.click(onde.x, onde.y);
    } else {
      const fora = await page.evaluate(() => {
        const room = document.querySelector(".room");
        const folder = document.querySelector(".folder");
        if (room === null || folder === null) return null;
        const r = room.getBoundingClientRect();
        const f = folder.getBoundingClientRect();
        const candidatos = [
          {
            x: f.left + f.width / 2,
            y: Math.min(window.innerHeight - 20, Math.min(r.bottom - 10, f.bottom + 25)),
          },
          {
            x: Math.min(window.innerWidth - 40, r.right - 40),
            y: Math.min(window.innerHeight - 30, r.bottom - 30),
          },
          { x: Math.min(window.innerWidth - 30, f.right + 40), y: f.bottom + 20 },
        ];
        for (const c of candidatos) {
          const el = document.elementFromPoint(c.x, c.y);
          if (el !== null && el.closest(".room") !== null && el.closest(".folder") === null) {
            return { x: c.x, y: c.y };
          }
        }
        return null;
      });
      if (fora !== null) await page.mouse.click(fora.x, fora.y);
    }
    await page.waitForTimeout(600);
  }
  await setFolder(true);

  await checkOverflow("gabinete");
  await checkClipped("gabinete");
  await checkSwallowed("gabinete");
  await checkEllipsized("gabinete");
  await checkClamped("gabinete");
  await checkContrast("gabinete");
  await checkNoPageScroll("gabinete");

  /* 1 — O GABINETE E A MESA, e o que estava aqui media as QUATRO ZONAS DE VIDRO que sairam.
     ⚠ AS QUATRO PECAS TEM LUGAR FIXO, e o numero e conferido porque peca que some nao falha em
     lugar nenhum: a mesa abriu uma sessao inteira sem madeira e o portao ficou verde. */
  for (const piece of [".room", ".folder", ".mail", ".phone"]) {
    expect((await page.locator(piece).count()) === 1, `[gabinete] a peca ${piece} nao veio`);
  }

  /* ⛔ E AS TRES MATERIAS SAO ESCRITAS PELO JS, entao elas nao existem ate a tela rodar: sem
     `dressDesk` a mesa abre sem madeira e nada acusa. A madeira vai no CORPO, porque quem a le
     e o substrato da janela, atras da barra e do rail. */
  for (const worn of [
    { piece: "body", material: "--timber" },
    { piece: ".folder", material: "--fibre" },
    { piece: ".mail", material: "--felt" },
  ]) {
    const written = await page
      .locator(worn.piece)
      .evaluate(
        (node, name) => (node instanceof HTMLElement ? node.style.getPropertyValue(name) : ""),
        worn.material,
      );
    expect(
      written !== "",
      `[gabinete] a materia ${worn.material} nao foi escrita em ${worn.piece}`,
    );
  }

  /* ⚠ A CANETA CONSTRUIDA E UMA SO, e ela mora DENTRO do decreto: as oito pastas sao marcadas
     na frase do Art. 2 que fala delas. Elas deixaram as oito telas de area, e duas portas para
     o mesmo gesto e o defeito recorrente numero um deste projeto. */
  expect(
    (await page.locator(".act__folders [data-protect]").count()) === 8,
    "[gabinete] o decreto nao trouxe as oito pastas",
  );

  /* 📐 O ENQUADRAMENTO DAS FOLHAS NA PASTA DE FOTO:
     As quatro medidas sao fracao da peca, invariantes a escala (repouso 684px vs erguida 1003px):
     1. Margem lateral: 15-22px a 684 vira 2,19%-3,22% (na mao, 24,5px sobre 1003px da 2,44%);
     2. Vao da lombada: piso de 25px a 684 vira 3,65% (com gap 118px da 7,20%);
     3. Desvio das folhas do centro da pasta: teto de 3px a 684 vira 0,45%;
     4. Desvio do timbre do centro da pagina: teto de 2px na folha de 720px (0,28%). */
  const fitFolhas = await page.evaluate(() => {
    const f = document.querySelector(".folder");
    const br = document.querySelector(".brief");
    const st = document.querySelector(".stack");
    const lh = document.querySelector(".brief .letterhead");
    if (!f || !(br instanceof HTMLElement) || !st || !(lh instanceof HTMLElement)) return null;
    const fb = f.getBoundingClientRect();
    const bb = br.getBoundingClientRect();
    const sb = st.getBoundingClientRect();
    const folhaCentro = br.offsetWidth / 2;
    const timbreCentro = lh.offsetLeft + lh.offsetWidth / 2;
    const fw = fb.width;
    return {
      larguraPasta: fw,
      margemEsqPct: ((bb.left - fb.left) / fw) * 100,
      margemDirPct: ((fb.right - sb.right) / fw) * 100,
      vaoLombadaPct: ((sb.left - bb.right) / fw) * 100,
      desvioFolhasPct: (Math.abs((bb.right + sb.left) / 2 - (fb.left + fw / 2)) / fw) * 100,
      desvioTimbre: Math.abs(timbreCentro - folhaCentro),
      margemEsqPx: bb.left - fb.left,
      margemDirPx: fb.right - sb.right,
      vaoLombadaPx: sb.left - bb.right,
    };
  });
  expect(
    fitFolhas !== null &&
      fitFolhas.margemEsqPct >= 2.19 &&
      fitFolhas.margemEsqPct <= 3.22 &&
      fitFolhas.margemDirPct >= 2.19 &&
      fitFolhas.margemDirPct <= 3.22,
    `[gabinete] a folha cobriu a cantoneira ou ficou longe da borda: esq ${fitFolhas?.margemEsqPct.toFixed(2)}% (${fitFolhas?.margemEsqPx.toFixed(1)}px), dir ${fitFolhas?.margemDirPct.toFixed(2)}% (${fitFolhas?.margemDirPx.toFixed(1)}px) (faixa 2,19%-3,22%)`,
  );
  expect(
    fitFolhas !== null && fitFolhas.vaoLombadaPct >= 3.65,
    `[gabinete] a folha invadiu a lombada central da pasta: vao de ${fitFolhas?.vaoLombadaPct.toFixed(2)}% (${fitFolhas?.vaoLombadaPx.toFixed(1)}px) (piso 3,65%)`,
  );
  expect(
    fitFolhas !== null && fitFolhas.desvioTimbre <= 2,
    `[gabinete] o timbre da folha esta fora do centro da pagina: desvio de ${fitFolhas?.desvioTimbre.toFixed(1)}px (teto 2px)`,
  );
  expect(
    fitFolhas !== null && fitFolhas.desvioFolhasPct <= 0.45,
    `[gabinete] as folhas estao descentralizadas da lombada: desvio de ${fitFolhas?.desvioFolhasPct.toFixed(2)}% (teto 0,45%)`,
  );
  /* ⚠ E A PASTA VOLTA PARA A MESA ANTES DO GESTO: as medidas acima a abriram, e a etapa do voo
     precisa dela FECHADA para medir o gesto do comeco. */
  await setFolder(false);

  /* ⭐ E A MESA TEM UM GESTO, que e o unico do Gabinete: a pasta na mesa se ERGUE, e so com ela
     na mao a folha e legivel. Ordem dele, vendo o jogo rodar: "nao consigo clicar pra pasta com
     a folha subir na tela e eu enxergar melhor".
     📐 O TAMANHO NO ALTO DO VOO E MEDIDO: a 1080 de janela a pasta erguida fecha em 837px de
     altura numa area de 922, e a escala 1 dava 1047 — a peca saia dos dois lados da tela. */
  const flight = async () =>
    page.evaluate(() => {
      const folder = document.querySelector(".folder");
      const area = document.querySelector(".area.cabinet");
      if (!folder || !area) return null;
      const box = folder.getBoundingClientRect();
      const stage = area.getBoundingClientRect();
      return {
        tall: Math.round(box.height),
        inside: box.top >= stage.top - 1 && box.bottom <= stage.bottom + 1,
      };
    });

  /* ⛔ E O CLIQUE E DADO NO QUE ESTA NO CENTRO VISUAL DA PASTA, e nao no seletor dela: a peca
     vive numa arvore 3D, e o ponto que o navegador de teste calcula para `.folder` caiu no
     TAMPO — a prova acusava a mesa por um defeito do proprio clique. Quem responde a pergunta
     "o que o jogador acerta aqui" e `elementFromPoint`, e ela vira a primeira assercao. */
  /* ⛔ E A ESPERA E PELA ANIMACAO ACABAR, e nao por altura repetida: o voo e uma curva que
     desacelera, entao dois quadros consecutivos batem no mesmo pixel arredondado ANTES do fim
     — a prova quebrava o laco cedo e tentava assinar com a pasta a caminho, e falhava uma
     rodada sim, outra nao. Quem sabe se o voo acabou e o navegador. */
  const pousou = async () => {
    await page
      .waitForFunction(
        () => (document.querySelector(".folder")?.getAnimations() ?? []).length > 0,
        undefined,
        { timeout: 2000 },
      )
      .catch(() => {});
    await page.waitForFunction(
      () =>
        (document.querySelector(".folder")?.getAnimations() ?? []).every(
          one => one.playState === "finished" || one.playState === "idle",
        ),
      undefined,
      { timeout: 4000 },
    );
  };

  /* ⚠ E O TOQUE DIZ SE ACERTOU: `elementFromPoint` e a pergunta "o que o jogador acerta aqui",
     e um clique que caiu fora da peca tem de reprovar em vez de virar silencio. */
  /** @param {string} pick */
  const tocar = pick =>
    page.evaluate(seletor => {
      let el = document.querySelector(seletor);
      if (!el) return false;
      if (seletor === ".folder") {
        const cover = el.querySelector(".folder__cover");
        const spread = el.querySelector(".folder__open");
        const shut =
          cover !== null && spread !== null && Number(getComputedStyle(spread).opacity) < 0.5;
        if (shut && cover !== null) el = cover;
      }
      const box = el.getBoundingClientRect();
      const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      if (hit === null || hit.closest(seletor.split(" ").pop() ?? seletor) === null) return false;
      hit.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      return true;
    }, pick);

  const onDesk = await flight();
  /* ⛔ E O CLIQUE VAI NA PECA PINTADA, e nao no centro da CAIXA: a caixa da pasta deixou de
     receber ponteiro quando 321px de madeira vazia estavam abrindo a pasta. Fechada, quem
     responde e a capa; aberta, a foto da pasta. */
  const onTarget = await page.evaluate(() => {
    const spread = document.querySelector(".folder__open");
    const cover = document.querySelector(".folder__cover");
    if (spread === null || cover === null) return false;
    const aberta = Number(getComputedStyle(spread).opacity) > 0.5;
    const box = (aberta ? spread : cover).getBoundingClientRect();
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    if (hit === null || hit.closest(".folder") === null) return false;
    hit.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    return true;
  });
  expect(onTarget, "[gabinete] o centro da pasta nao pertence a pasta — o clique cai na mesa");
  await pousou();
  const inHand = await flight();
  expect(
    onDesk !== null && inHand !== null && inHand.tall > onDesk.tall * 1.05,
    `[gabinete] a pasta nao subiu no clique: ${onDesk?.tall}px na mesa, ${inHand?.tall}px na mao`,
  );
  expect(
    inHand !== null && inHand.inside,
    `[gabinete] a pasta erguida saiu da area: ${inHand?.tall}px de altura`,
  );
  /* ⚠ E O CLIQUE DE LARGAR VAI NA QUINA DA SALA, por medida: `.mail` e um ponto de ancoragem
     de 0x0 — as cartas sao filhas absolutas dele —, e o navegador nao clica no que nao tem
     tamanho. O passeio parou 47 vezes tentando. */
  /* ⭐ E A PASTA NA MAO VIRA CAPTURA, porque e o estado em que o jogador LE o ato: o portao ve
     geometria, e so a imagem responde se o texto esta nitido. */
  await page.screenshot({ path: join(OUT, "gabinete-pasta.png") });

  /* ⛔ E LARGAR DEIXOU DE TER CANTO: com a pasta centralizada na TELA ela ocupa ~1030x707 no
     meio da janela, e o canto (40,40) da area caiu DENTRO dela — o clique virava marca em vez
     de largar. Quem manda o evento e a sala, que e onde o ouvinte mora. */
  await page.evaluate(() =>
    document.querySelector(".room")?.dispatchEvent(new MouseEvent("click", { bubbles: true })),
  );
  /* ⚠ E A ESPERA E POR ASSENTAMENTO, e nao por relogio: sem cabeca o quadro chega irregular, e
     um numero fixo pegava a mola a caminho — 15px acima da mesa numa rodada, 31 na seguinte. A
     prova esperava com relogio e acusava a mesa por causa do proprio compasso. */
  await pousou();
  const backDown = await flight();
  /* ⚠ A VOLTA SE COBRA COM FOLGA DE 20px, e ela e ABSOLUTA: sem cabeca o quadro chega mais
     devagar e a mola assenta uns pixels acima da mesa. Em porcentagem a folga encolhia junto
     com a peca — a mesma sobra de 16px passou de 3% para 5% quando a pasta diminuiu. Uma pasta
     que ficou na mao mede 500px a mais. */
  expect(
    backDown !== null && onDesk !== null && Math.abs(backDown.tall - onDesk.tall) <= 20,
    `[gabinete] a pasta nao voltou para a mesa: ${backDown?.tall}px contra ${onDesk?.tall}px`,
  );

  /* ⭐ 1b — O VOO INTERROMPIDO NAO SALTA, e esta e a prova da arquitetura inteira. Largar a
     pasta no MEIO da subida tem de continuar do ponto em que ela esta: a curva e analitica,
     entao a posicao e a velocidade do instante saem da conta e o voo novo parte dali.
     ⛔ COM TRANSICAO CSS ISTO FALHA POR CONSTRUCAO — interrompida, ela recomeca do zero, e a
     peca salta para o alvo antigo antes de voltar. O salto e o que esta prova mede. */
  /* ⛔ E O CORTE E MEDIDO DENTRO DA PAGINA, num `evaluate` so: entre esperar do lado do teste e
     medir do lado da pagina cabe o voo inteiro — a prova via 707px onde queria ver o meio,
     porque a pagina estrangulada atrasa o `waitForFunction` e o voo acaba na espera. */
  const salto = await page.evaluate(async () => {
    const pasta = document.querySelector(".folder");
    const room = document.querySelector(".room");
    if (pasta === null) return { parado: 0, meio: 0, logoApos: 0, fim: 0 };
    const alto = () => pasta.getBoundingClientRect().height;
    /** @returns {Promise<void>} */
    const quadro = () => new Promise(r => requestAnimationFrame(() => r()));
    /* ⚠ E ELA GARANTE O PROPRIO ESTADO INICIAL: o gesto atravessa a pintura, entao uma prova
       que herda a pasta no ar mede o voo inteiro como se fosse o comeco dele. */
    const assentar = async () => {
      for (let i = 0; i < 240; i++) {
        await quadro();
        if (pasta.getAnimations().every(one => one.playState !== "running")) return;
      }
    };
    if (alto() > 600) {
      room?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await assentar();
    }
    const parado = alto();
    /* ⛔ E O TOQUE VAI NA PECA PINTADA: o centro da CAIXA e madeira vazia desde que a pasta
       deixou de receber ponteiro pela caixa. */
    const spread = document.querySelector(".folder__open");
    const cover = document.querySelector(".folder__cover");
    const aberta = spread !== null && Number(getComputedStyle(spread).opacity) > 0.5;
    const caixa = ((aberta ? spread : cover) ?? pasta).getBoundingClientRect();
    document
      .elementFromPoint(caixa.left + caixa.width / 2, caixa.top + caixa.height / 2)
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    /* No meio do voo, que e onde a velocidade e maior e um salto apareceria inteiro. */
    for (let i = 0; i < 240; i++) {
      await quadro();
      const one = pasta.getAnimations().find(each => each.playState === "running");
      if (one !== undefined && Number(one.currentTime ?? 0) >= 140) break;
    }
    const meio = alto();
    room?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await quadro();
    await quadro();
    const logoApos = alto();
    /* E devolve a pasta a mesa: o gesto atravessa a pintura, e uma prova que sai com ela no ar
       deixa as 24 medidas seguintes olhando uma pasta que ocupa a tela. */
    await assentar();
    return {
      parado: Math.round(parado),
      meio: Math.round(meio),
      logoApos: Math.round(logoApos),
      fim: Math.round(alto()),
    };
  });
  expect(
    salto.meio > salto.parado * 1.1,
    `[gabinete] a pasta nao estava em voo quando a prova a interrompeu: ${salto.meio}px ` +
      `contra ${salto.parado}px na mesa`,
  );
  expect(
    Math.abs(salto.logoApos - salto.meio) < salto.meio * 0.2,
    `[gabinete] o voo interrompido SALTOU: ${salto.meio}px no corte, ${salto.logoApos}px dois ` +
      `quadros depois`,
  );
  expect(
    Math.abs(salto.fim - salto.parado) <= 20,
    `[gabinete] a prova do salto saiu com a pasta no ar: ${salto.fim}px contra ${salto.parado}px`,
  );

  expect((await page.locator(".vit").count()) === 4, "[barra] os quatro sinais vitais nao vieram");
  await checkTopbar("barra");
  await page.screenshot({ path: join(OUT, "gabinete.png"), fullPage: true });

  /* 1a — O EMAIL E A OUTRA METADE DA TELA QUE SE PARTIU, e a geometria se remede aqui porque
     o vao mudou de TAMANHO e nao so de lugar: a caixa deixou a coluna de 432px e ficou com a
     largura do tabuleiro. */
  await page.click('.rail [data-section="email"]');
  /* ⛔ E A ESPERA E PELA MESA SAIR, E NAO PELO RELOGIO: a troca de tela e uma view transition
     do navegador, e a cena anterior fica na pagina ate ela terminar — medido, 274 a 445ms. Com
     400 fixos o passeio media o texto da Caixa CONTRA A MADEIRA, e reprovava 21 contrastes de
     uma vez. ⛔ E TIRAR A MESA DO DOM NAO BASTA: o navegador continua pintando o SNAPSHOT dela
     ate a animacao do pseudo-elemento acabar, e sobravam 7. E a mesma licao da mola: espera-se
     o estado, e nao o compasso. */
  await page.waitForFunction(() => document.querySelectorAll(".room").length === 0);
  /* ⛔ E A ANIMACAO NASCE DEPOIS DE O DOM TROCAR: `startViewTransition` aplica a pintura e so
     entao comeca o cross-fade — a espera de cima passava no VAO entre os dois, com o snapshot
     da mesa ainda na tela. Um quadro de folga para ela existir, e ai espera-se ela acabar. */
  await page.waitForTimeout(120);
  await page.waitForFunction(() =>
    document.getAnimations().every(one => {
      /* `pseudoElement` mora em `KeyframeEffect`, e o tipo do efeito e o pai dele. */
      const alvo = /** @type {{ pseudoElement?: string | null }} */ (one.effect ?? {});
      return !String(alvo.pseudoElement ?? "").startsWith("::view-transition");
    }),
  );
  await checkOverflow("email");
  await checkClipped("email");
  await checkSwallowed("email");
  await checkEllipsized("email");
  await checkClamped("email");
  await checkContrast("email");
  await checkNoPageScroll("email");
  await page.screenshot({ path: join(OUT, "email.png"), fullPage: true });

  /* 1b — A POSSE PERGUNTA, e ela e a primeira decisao do mandato. ⚠ A ASSERCAO DO GABINETE
     CONTINUA VALENDO e nao foi afrouxada: os tres eixos sao BOTOES, e nao `input` nem
     `select` — a pergunta mora na carta, e a carta mudou de tela e nao de forma. */
  expect(
    (await page.locator(".letter__pledge").count()) === 3,
    "[posse] a carta de posse nao trouxe os tres eixos do discurso",
  );
  const opcoes = await page.locator(".letter__pledge .letter__choice").count();
  expect(opcoes >= 7, `[posse] o discurso ofereceu ${opcoes} compromissos`);

  /* ⚠ E MARCAR TEM DE MARCAR: o gesto escreve no rascunho do mes, e um botao que nao muda de
     estado e uma decisao que o jogador acha que tomou. */
  await page.locator('[data-pledge="priority"]').first().click();
  await page.waitForTimeout(200);
  expect(
    (await page.locator('.letter__choice[aria-pressed="true"]').count()) === 1,
    "[posse] marcar um compromisso nao marcou nada",
  );
  /* E clicar de novo desmarca — nao prometer e uma escolha, e ela tem caminho de volta. */
  await page.locator('[data-pledge="priority"]').first().click();
  await page.waitForTimeout(200);
  expect(
    (await page.locator('.letter__choice[aria-pressed="true"]').count()) === 0,
    "[posse] o compromisso marcado nao desmarcou",
  );
  await checkClipped("posse");
  await checkEllipsized("posse");
  /* ⚠ A CARTA DA POSSE E A MAIS ALTA DO JOGO — 875px com o discurso —, e foi ela que revelou
     que a carta aberta nao tinha contencao nenhuma: ela crescia e furava a tela travada. */
  await checkNoPageScroll("posse");

  /* 1b — E O RAIL LEVA AO LUGAR DE DECIDIR. ⚠ ERA O BOTAO DO CARTAO ate 22/08/2026, e ele
     saiu com a reformulacao da coluna: duas fichas tinham porta e duas nao, e o rail ja leva
     as duas telas que aqueles botoes abriam. */
  await page.click('.rail [data-section="congress"]');
  await page.waitForTimeout(600);
  await checkOverflow("congresso");
  await checkClipped("congresso");
  await checkSwallowed("congresso");
  await checkEllipsized("congresso");
  await checkClamped("congresso");
  await checkContrast("congresso");
  expect(
    (await page.locator(".tally__forecast").count()) === 0,
    "[congresso] a mesa sem pauta mostrou placar",
  );

  /* 2 — UMA AREA, pelo rail. */
  await viaRail(page, "health");
  await page.waitForTimeout(600);
  await checkOverflow("area");
  await checkClipped("area");
  await checkSwallowed("area");
  await checkEllipsized("area");
  await checkClamped("area");
  await checkContrast("area");
  expect((await page.locator(".dial").count()) > 0, "[area] o orcamento veio sem programas");

  /* ⚠ A CORRENTE TEM DUAS METADES E AS DUAS TEM DE TER LINHA: uma area sem saida seria uma
     area que nao alimenta nada, e o catalogo garante o contrario — o bloco vazio de um lado
     e a forma como este item morreria em silencio. */
  expect(
    (await page.locator(".chain__half").count()) === 2,
    "[area] a corrente nao veio com as duas metades",
  );
  expect(
    (await page.locator(".chain__half .annex__line").count()) >= 3,
    "[area] a corrente veio sem elo nenhum",
  );

  /* ⚠ E A LINHA DO ORCAMENTO COME O GASTO CHEIO, e nao a parte acima do piso — a Previdencia
     e onde a diferenca grita: R$ 2,4 bi de discricionario contra R$ 126,7 de gasto cheio, e a
     MALHA consome o segundo. Sem esta checagem a corrente anunciaria +0,02 onde o motor poe
     +1,22, e nada falharia. */
  await viaRail(page, "welfare");
  await page.waitForTimeout(400);
  const verba = await page
    .locator(".chain__half")
    .first()
    .locator(".annex__value")
    .first()
    .innerText();
  expect(
    Number(verba.replace("+", "").replace("−", "-").replace(",", ".")) > 0.5,
    `[area] a corrente da Previdencia diz que a verba poe ${verba} — ela le o discricionario, e nao o gasto cheio`,
  );
  await viaRail(page, "health");
  await page.waitForTimeout(400);

  /* 3 — O ORCAMENTO GRANULAR. */
  const dial = page.locator(".dial__slider").first();
  await dial.focus();
  for (let step = 0; step < 100; step++) await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(200);

  expect(
    (await page.locator('.dial[data-rite="law"], .dial[data-rite="amendment"]').count()) > 0,
    "[area] furar o piso nao mudou o rito de nenhuma linha",
  );
  await page.screenshot({ path: join(OUT, "area.png"), fullPage: true });

  /* 4 — E O ORCAMENTO VIRA PAUTA SOZINHO. */
  await page.click('[data-section="congress"]');
  await page.waitForTimeout(600);
  expect(
    (await page.locator(".mesa__title").count()) === 1,
    "[mesa] o orcamento movido nao produziu pauta",
  );
  expect(
    (await page.locator(".tally__forecast").count()) === 1,
    "[mesa] a pauta nao trouxe placar",
  );

  /* 5 — A VERBA MOVE O PLACAR. */
  const before = Number((await page.locator(".tally__forecast").innerText()).match(/\d+/)?.[0]);
  const sliders = page.locator(".bench__slider");
  const benches = await sliders.count();
  for (let index = 0; index < benches; index++) {
    await sliders.nth(index).focus();
    for (let step = 0; step < 4; step++) await page.keyboard.press("ArrowRight");
  }
  await page.waitForTimeout(150);
  const after = Number((await page.locator(".tally__forecast").innerText()).match(/\d+/)?.[0]);
  expect(after > before, `[mesa] comprar verba nao moveu o placar: ${before} → ${after}`);
  await page.screenshot({ path: join(OUT, "mesa.png"), fullPage: true });
  await checkContrast("mesa");

  /* 6 — ESTOURAR O CAIXA acende a linha de dinheiro. */
  for (let index = 0; index < 4; index++) {
    await sliders.nth(index).focus();
    for (let step = 0; step < 20; step++) await page.keyboard.press("ArrowRight");
  }
  await page.waitForTimeout(150);
  expect(
    (await page.locator('.tally__cash[data-fits="false"]').count()) === 1,
    "[mesa] a promessa estourou o caixa e a linha de dinheiro nao acusou",
  );
  await page.screenshot({ path: join(OUT, "mesa-estourada.png"), fullPage: true });

  /* 7 — O MES ANDA, E ELE PRESTA CONTAS SEM INTERROMPER. */

  /* ANTES DO PRIMEIRO MES o painel diz que esta esperando, e nao fica em branco: bloco vazio
     ao lado de controles que funcionam lê como defeito. */
  expect(
    (await page.locator(".report.empty--quiet").count()) === 1,
    "[relatorio] antes do primeiro mes o painel nao anunciou a espera",
  );

  await page.click("#advance");
  await page.waitForTimeout(700);

  expect(
    (await page.locator("#noticeDialog[open]").count()) === 0,
    "[relatorio] o mes resolvido abriu um modal — ele tem de ser painel",
  );
  const verdict = await page.locator(".report__verdict").innerText();
  expect(
    /aprovada|rejeitada|decretada/i.test(verdict),
    `[relatorio] o veredito veio como "${verdict}"`,
  );
  /* ⚠ O NUMERO E COBRADO CONTRA O CATALOGO, e nao digitado. */
  expect(
    (await page.locator(".report__table tbody tr").count()) === CATALOG.parties.length,
    `[relatorio] a tabela trouxe ${await page.locator(".report__table tbody tr").count()} bancadas e o catalogo tem ${CATALOG.parties.length}`,
  );
  await page.screenshot({ path: join(OUT, "relatorio.png"), fullPage: true });
  await checkContrast("relatorio");

  /* ⚠ 7a-bis — A CARTA ABERTA MORRE COM O MES. `openDispatch` so era escrito no clique e nunca
     limpo: um clique num aviso velho prendia o jogador nele por 20 meses medidos, com o painel
     mostrando o aviso enquanto o botao cobrava o silencio de outra carta. */
  await page.click('.rail [data-section="email"]');
  await page.waitForTimeout(400);
  const linhas = await page.locator(".tray__row").count();
  if (linhas > 1) {
    await page.locator(".tray__row").last().click();
    await page.waitForTimeout(200);
    /* ⚠ `paint()` REESCREVE A TELA INTEIRA, e o foco ia junto: medido, ele caia em `BODY` nos
       tres gestos da bandeja, e voltar ao botao recem-apertado custava OITO tabs. */
    const comFoco = await page.evaluate(() => {
      const node = document.activeElement;
      return node instanceof HTMLElement ? (node.dataset["dispatch"] ?? node.tagName) : "nada";
    });
    expect(
      comFoco === (await page.locator(".tray__row").last().getAttribute("data-dispatch")),
      `[caixa] o clique na linha jogou o foco do teclado em "${comFoco}"`,
    );
    const presa = await page
      .locator('.tray__row[aria-current="true"]')
      .getAttribute("data-dispatch");
    await page.click("#advance");
    await page.waitForTimeout(700);
    const agora = await page
      .locator('.tray__row[aria-current="true"]')
      .getAttribute("data-dispatch");
    /* ⚠ A CARTA CLICADA ATRAVESSA O MES, e esta guarda ja cobrou o CONTRARIO: ela exigia que a
       bandeja voltasse para o topo. Palavras dele: "quando eu avanco um mes, nao pode mudar a
       mensagem que esta clicada, tem que ficar naquela ate que eu mesmo mude". */
    expect(
      agora === presa,
      `[caixa] o mes virou e a carta aberta trocou de ${presa} para ${agora}`,
    );
  }

  /* ⚠ 7a½ — A MESA CABE, E ELA MUDA COM O MES. Aqui media a coluna de seis blocos, que saiu;
     o que ficou tem duas medidas, e as duas ja falharam de verdade nesta mesa.
     📐 O TEXTO DO ATO ESTOUROU A FOLHA em 40px: a rubrica saia cortada pela borda e caia por
     cima da linha do Diario Oficial. O tamanho do ato anda com o mes, entao a folha se mede
     mes a mes e nao so no primeiro.
     ⛔ E CARTA ATRAS DA PASTA E A COISA QUE ELE PROIBIU: numa moldura menor elas cairam 67px
     atras dela. As posicoes sao em % e as pecas em px, entao encolher a mesa aproxima as duas
     sem encolher nenhuma. */
  /** @param {string} where */
  async function checkDeskFits(where) {
    /* ⛔ O QUE ESTA MEDIDA COBRA E O ARRANJO, e arranjo e o estado de REPOUSO: erguida, a pasta
       ocupa a tela e cobre as cartas por desenho, que nao e o defeito. O gesto atravessa a
       pintura de proposito, entao a prova poe a pasta na mesa antes de medir. */
    await page.evaluate(() => {
      const room = document.querySelector(".room");
      const pasta = document.querySelector(".folder");
      if (room && pasta && pasta.getBoundingClientRect().height > 600) {
        room.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      }
    });
    await pousou();

    /* ⚠ AS DUAS FOLHAS SE MEDEM, e nao a primeira: o parecer cresce com o mes tanto quanto o
       ato — nome de grupo longo, valor de seis digitos —, e medir so uma deixaria a outra
       estourar em silencio. */
    const over = await page.evaluate(() =>
      [...document.querySelectorAll(".sheet")].reduce(
        (worst, sheet) => Math.max(worst, sheet.scrollHeight - sheet.clientHeight),
        0,
      ),
    );
    expect(over !== null && over <= 1, `[${where}] o papel nao coube na folha: ${over}px alem`);

    const behind = await page.evaluate(() => {
      const folder = document.querySelector(".folder");
      if (!folder) return null;
      /* ⛔ E A CAIXA DA PASTA DEIXOU DE SER A PECA QUE SE VE, quando ela aprendeu a fechar: a
         face esquerda gira para cima da direita, entao a metade de layout que ela deixou fica
         vazia e invisivel. Medir por ela acusou 20 meses com a carta mais a direita em 396 e a
         capa comecando em 588 — 192px de folga chamados de sobreposicao.
         ⭐ QUEM MANDA E A TINTA: fechada, a peca e a capa; aberta, e a pasta inteira. */
      const cover = folder.querySelector(".folder__cover");
      const spread = folder.querySelector(".folder__open");
      const shut =
        cover !== null && spread !== null && Number(getComputedStyle(spread).opacity) < 0.5;
      const box = (shut && cover !== null ? cover : folder).getBoundingClientRect();
      const cruzam = [...document.querySelectorAll(".envelope")].filter(letter => {
        const one = letter.getBoundingClientRect();
        const across = Math.min(one.right, box.right) - Math.max(one.left, box.left);
        const down = Math.min(one.bottom, box.bottom) - Math.max(one.top, box.top);
        return across > 1 && down > 1;
      }).length;
      /* ⚠ E A ACUSACAO DIZ O ESTADO DA PASTA: erguida ela ocupa a tela e cobre tudo por
         desenho, o que nao e o defeito que esta medida existe para pegar — sem isto a prova
         acusa o arranjo por causa de um gesto que ficou aberto. */
      return { cruzam, alta: Math.round(box.height), erguida: box.height > 600 };
    });
    expect(
      behind !== null && behind.cruzam === 0,
      `[${where}] ${behind?.cruzam} carta(s) cairam atras da pasta ` +
        `(pasta a ${behind?.alta}px, ${behind?.erguida ? "ERGUIDA" : "na mesa"})`,
    );
  }

  /* ⚠ E ELA MEDE O GABINETE, entao o passeio VOLTA para la: a etapa acima acaba no email, e a
     mesa nao existe nele — a medicao vinha `null` e a acusacao se repetia 24 vezes. */
  await page.click('.rail [data-section="cabinet"]');
  await page.waitForTimeout(400);

  /* ⚠ VINTE E QUATRO MESES, e o numero e medido: os dois meses em que a coluna estourava eram
     o 23 e o 35, e uma janela de doze nao alcancava nenhum dos dois. */
  for (let month = 0; month < 24; month++) {
    await page.click("#advance");
    await page.waitForTimeout(45);
    await checkDeskFits(`gabinete mes ${month + 2}`);
  }

  /* 7b — O MES E REPETIVEL. */
  const beforeRun = await page.locator("#turn").innerText();
  for (let month = 0; month < 3; month++) {
    await page.click("#advance");
    await page.waitForTimeout(700);
  }
  const afterRun = await page.locator("#turn").innerText();
  expect(
    beforeRun !== afterRun,
    `[turno] tres cliques em "avancar" e o mes nao andou: ${beforeRun} → ${afterRun}`,
  );
  /* Ele visitava o Gabinete no mes 1, onde a caixa so tem a carta de posse, e a peca central
     do ciclo 9 — o prazo, a tarja e as duas saidas — nao aparecia em captura nenhuma. */
  for (let month = 0; month < 8; month++) {
    if ((await page.locator(".letter__choices").count()) > 0) break;

    /* ⚠ SEM PAGAR A BANCADA A MESA NUNCA PAUTA, e por isso este trecho compra antes de
       avancar. */
    /* ⚠ E O TEXTO PRECISA SER LEI, e nao remanejamento. */
    await viaRail(page, "health");
    await page.waitForTimeout(400);
    const dials = page.locator(".dial__slider");
    const count = await dials.count();
    for (let index = 0; index < Math.min(count, 3); index++) {
      await dials.nth(index).focus();
      for (let step = 0; step < 30; step++) await page.keyboard.press("ArrowLeft");
    }

    await page.click('[data-section="congress"]');
    await page.waitForTimeout(400);
    const buy = page.locator(".bench__slider");
    const seats = await buy.count();
    for (let index = 0; index < seats; index++) {
      await buy.nth(index).focus();
      for (let step = 0; step < 10; step++) await page.keyboard.press("ArrowRight");
    }
    await page.click('[data-section="email"]');
    await page.waitForTimeout(300);
    await page.click("#advance");
    await page.waitForTimeout(700);
  }

  const asking = await page.locator(".letter__choices").count();
  if (asking > 0) {
    /* A TARJA SO EXISTE ONDE HA PRAZO, e a prova disso e geometrica: a carta que pergunta tem
       `data-urgency`, e as outras nao tem nenhum. */
    expect(
      (await page.locator(".letter[data-urgency]").count()) > 0,
      "[caixa] a carta que pergunta saiu sem tarja de gravidade",
    );
    expect(
      (await page.locator(".letter__due").count()) > 0,
      "[caixa] a carta que pergunta saiu sem prazo legivel",
    );
    await checkOverflow("caixa com pergunta");
    await checkClipped("caixa com pergunta");
    /* ⚠ ESTE ESTADO ERA O UNICO SEM O TERCEIRO IRMAO, e e justamente aqui que o indice mostra
       o nome do relator ao lado do prazo, na coluna de 179px. A checagem existia, via o
       defeito, e nao era chamada onde ele mora. */
    await checkEllipsized("caixa com pergunta");
    await checkContrast("caixa com pergunta");

    /* ⚠ E AGORA TODA CARTA DO MES E ABERTA, e nao so a que pergunta: o passeio media UMA
       carta por percurso, e a auditoria que abre TODAS achou 13 cortes que ele nao via —
       "Partido dos Trabalhadores Unidos" pedindo 218px numa coluna de 152, dentro do anexo da
       carta. Uma carta por passeio e uma amostra de um, e o defeito mora na que nao foi
       sorteada. */
    const cartas = await page.locator(".tray__row").count();
    for (let index = 0; index < cartas; index++) {
      await page.locator(".tray__row").nth(index).click();
      await page.waitForTimeout(120);
      await checkEllipsized(`carta ${index + 1} de ${cartas}`);
      await checkClipped(`carta ${index + 1} de ${cartas}`);
    }
    await checkNoOverlap("caixa com pergunta", ".letter");

    /* ⚠ A TARJA DE GRAVIDADE E O CANAL QUE DIZ QUE A CARTA TEM PRAZO, e ela sumia: cabecalho e
       rodape saem com margem negativa do recuo CHEIO, e o recuo da carta com tarja e menor.
       Medido antes do conserto: os dois a -7px da folha, invadindo o indice, com os 4px da
       tarja cobertos. */
    const tarja = await page.evaluate(() => {
      const letter = document.querySelector(".tray__open .letter[data-urgency]");
      if (!letter) return null;
      const box = letter.getBoundingClientRect();
      const edge = parseFloat(getComputedStyle(letter).borderLeftWidth);
      const worst = [".letter__head", ".letter__foot"]
        .map(pick => letter.querySelector(pick))
        .filter(node => node !== null)
        .map(node => node.getBoundingClientRect().left - box.left);
      return { edge, over: Math.round((edge - Math.min(...worst)) * 100) / 100 };
    });
    if (tarja) {
      expect(
        tarja.over <= 0.5,
        `[caixa com pergunta] o cabecalho ou o rodape cobre ${tarja.over}px dos ${tarja.edge} da tarja`,
      );
    }
    await page.screenshot({ path: join(OUT, "carta-pergunta.png"), fullPage: true });
  }

  /* 7c — UM CLIQUE NA CAIXA NAO MEXE NA MESA, e esta checagem lia as SETE SETAS da coluna,
     que sairam com ela. O que a mesa mostra do mes e o ATO, entao o ato virou a leitura: ele
     recomeca do rateio, que e a mesma funcao que o turno executa.
     ⚠ ELA ATRAVESSA AS DUAS TELAS de proposito — o defeito que pega e o de uma pintura mexer
     na outra, e sao tres pinturas entre as duas leituras. */
  /* ⛔ `.stack .act__body` E NAO `.act__body`: a pasta tem DUAS faces desde o parecer, e as
     duas usam o corpo do documento — o seletor solto casava com duas e o passeio parava. */
  const oAto = () => page.locator(".stack .act__body").innerText();
  await page.click('.rail [data-section="cabinet"]');
  await page.waitForTimeout(300);
  const antesDoClique = await oAto();
  expect(antesDoClique.trim() !== "", "[gabinete] o ato veio vazio — a checagem nao mede nada");
  await page.click('.rail [data-section="email"]');
  await page.waitForTimeout(300);
  await page.locator(".tray__row").first().click();
  await page.waitForTimeout(300);
  await page.click('.rail [data-section="cabinet"]');
  await page.waitForTimeout(300);
  const depoisDoClique = await oAto();
  expect(depoisDoClique === antesDoClique, "[gabinete] um clique na caixa reescreveu o ato");

  /* E A ETAPA SEGUINTE E DA CAIXA OUTRA VEZ. */
  await page.click('.rail [data-section="email"]');
  await page.waitForTimeout(300);

  /* 7d — O FOCO ATRAVESSA O CLIQUE NUMA CARTA NAO LIDA, e esta checagem nasceu VERMELHA. A
     de 7a-bis ja cobrava foco, e passava: ela clica no mes 2, quando a unica carta ja esta
     lida. Clicar numa NAO lida vira `data-unread` na mesma pintura, e a marca do foco era
     montada com o dataset inteiro — o seletor gravado antes nao casava depois. */
  const naoLidas = page.locator('.tray__row[data-unread="true"]');
  expect(
    (await naoLidas.count()) > 0,
    "[caixa] nenhuma carta nao lida sobrou — a checagem do foco nao mede nada",
  );
  const alvoNaoLido = await naoLidas.first().getAttribute("data-dispatch");
  await naoLidas.first().click();
  await page.waitForTimeout(300);
  const focoNaoLido = await page.evaluate(() => {
    const node = document.activeElement;
    return node instanceof HTMLElement ? (node.dataset["dispatch"] ?? node.tagName) : "nada";
  });
  expect(
    focoNaoLido === alvoNaoLido,
    `[caixa] o clique numa carta nao lida jogou o foco em "${focoNaoLido}", e nao em "${alvoNaoLido}"`,
  );

  await viaRail(page, "health");
  await page.waitForTimeout(600);
  await checkOverflow("area depois do mes");
  await checkClipped("area depois do mes");
  await checkContrast("area depois do mes");

  /* O QUE FOI DECIDIDO ESTA NO PROPRIO CONTROLE, e nao numa lista de leis em vigor: a lista
     morreu junto com o catalogo de pautas, e a pergunta que ela respondia — o que ja esta
     valendo? */
  expect((await page.locator(".dial").count()) > 0, "[area] o orcamento sumiu depois do mes");
  await page.screenshot({ path: join(OUT, "area-depois.png"), fullPage: true });

  /* 7c — O PLACAR, e ele so tem sentido AQUI, depois de quatro meses terem acontecido: numa
     partida recem-aberta a serie esta vazia e o painel nao teria tendencia nenhuma para
     desenhar — que e o estado em que uma escada quebrada passa despercebida. */
  await page.click('[data-section="finance"]');
  await page.waitForTimeout(600);
  await checkOverflow("financas");
  await checkClipped("financas");
  await checkSwallowed("financas");
  await checkEllipsized("financas");
  await checkClamped("financas");
  await checkContrast("financas");

  expect(
    (await page.locator(".ledger__row").count()) > 12,
    "[financas] o painel abriu sem as linhas do placar",
  );

  /* A AUSENCIA DE CONTROLE E A INFORMACAO PRINCIPAL DA TELA, e ela e verificavel: nenhum
     controle e nenhum botao dentro do palco. */
  expect(
    (await page.locator("#main input, #main button").count()) === 0,
    "[financas] o placar ofereceu algo para mexer",
  );

  /* E A LINHA SUBIU DE VERDADE. */
  const lines = await page.locator(".ledger__spark polyline").evaluateAll(nodes =>
    nodes.map(node => {
      const points = node.getAttribute("points") ?? "";
      return new Set(points.split(" ").map(pair => pair.split(",")[1])).size;
    }),
  );
  expect(
    lines.some(heights => heights > 1),
    `[financas] nenhuma serie variou na linha: ${lines.join(" ")}`,
  );

  /* A CAPTURA ESPERA A TRANSICAO ACABAR. */
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(OUT, "financas.png"), fullPage: true });

  /* 8 — A PARTIDA ATRAVESSA O NAVEGADOR. */
  /* ⚠ E O RASCUNHO DO MES TAMBEM, e antes ele morria inteiro: medido, a resposta marcada numa
     carta sumia no recarregamento — `aria-pressed="accept"` antes, nenhuma depois —, e com ela
     iam os niveis, as faixas e a verba montados no mes. */
  await viaRail(page, "health");
  await page.waitForTimeout(400);
  const medidor = page.locator(".dial__slider").first();
  await medidor.focus();
  for (let passo = 0; passo < 6; passo++) await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(300);
  const rascunho = await medidor.inputValue();
  await page.click('.rail [data-section="cabinet"]');
  await page.waitForTimeout(300);

  const monthBefore = await page.locator("#turn").innerText();
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const monthAfter = await page.locator("#turn").innerText();
  expect(
    monthBefore === monthAfter,
    `[save] o mes era ${monthBefore} e voltou ${monthAfter} depois de recarregar`,
  );

  /* A TELA RETOMADA ABRE NO GABINETE, e nao na area em que se estava: `screen` e memoria de
     sessao e nao entra no save. ⚠ E ELA SUBIU PARA CA na separacao: la embaixo media DEPOIS
     de o passeio ja ter trocado de tela duas vezes, e provava o proprio clique. */
  /* ⚠ `.stack .sheet` E NAO `.sheet`: a pasta tem duas faces, e as duas sao assinadas — o
     parecer pela Casa Civil e o ato pelo presidente. Quem prova que a mesa voltou e o ato. */
  expect(
    (await page.locator(".stack .sheet .signature").count()) === 1,
    "[save] a tela retomada nao renderizou",
  );

  await viaRail(page, "health");
  await page.waitForTimeout(400);
  const voltou = await page.locator(".dial__slider").first().inputValue();
  expect(
    voltou === rascunho,
    `[rascunho] o mes estava em ${rascunho} e voltou ${voltou} depois de recarregar`,
  );
  await page.click('.rail [data-section="email"]');
  await page.waitForTimeout(400);
  /* ⚠ PARA BAIXO O INDICE ROLA DE PROPOSITO, e esta checagem ja cobrou o contrario: ela
     defendia o teto de 7 linhas, e o teto caiu porque com blocos de mes ele mostrava "MAR" com
     2 das 5 cartas do mes. Para o LADO continua proibido. */
  /* Medida no comeco, com uma carta na mesa, esta prova ficaria verde para sempre sem
     defender nada. */
  const tray = await page.evaluate(() => {
    const list = document.querySelector(".tray__list");
    if (!list) return null;
    const save = JSON.parse(window.localStorage.getItem("republica-simulator:partida") ?? "{}");

    /* ⚠ DUAS LINHAS QUE LEEM IGUAL DENTRO DO MESMO BLOCO. Entre blocos e permitido: o
       cabecalho do mes separa. Dentro dele nao ha nada separando, e ai o jogador escolhe no
       escuro — que e o achado 24, dado como fechado uma vez sem prova nenhuma.
       ⚠ E O PRAZO NAO CONTA COMO DISTINCAO, medido: comparar a linha INTEIRA deixava passar
       exatamente o caso relatado — "assunto identico, remetente identico, e so a linha de
       prazo, que e a menor e mais apagada, separando as duas". */
    /** @type {{ month: string, lines: string[] }[]} */
    const blocks = [];
    for (const item of list.children) {
      if (item.classList.contains("tray__month")) {
        blocks.push({ month: item.textContent ?? "", lines: [] });
        continue;
      }
      const row = item.querySelector(".tray__row");
      if (!row) continue;
      const subject = row.querySelector(".tray__subject")?.textContent ?? "";
      const from = row.querySelector(".tray__from")?.textContent ?? "";
      blocks.at(-1)?.lines.push(`${subject} · ${from}`.replace(/\s+/g, " ").trim());
    }
    const twins = blocks
      .filter(block => block.lines.length !== new Set(block.lines).size)
      .map(block => block.month);

    return {
      x: list.scrollWidth - list.clientWidth,
      rows: list.querySelectorAll(".tray__row").length,
      /* ⚠ A CAIXA TEM DUAS FONTES desde a versao 19 do save: as cartas e o fechamento de cada
         mes, que virou registro guardado em vez de cartao montado na hora. */
      letters:
        (Array.isArray(save.mail) ? save.mail.length : -1) +
        (Array.isArray(save.months) ? save.months.length : 0),
      months: [...list.querySelectorAll(".tray__month")].map(node => node.textContent ?? ""),
      twins,
    };
  });
  if (tray) {
    expect(tray.x <= 1, `[gabinete] o indice da bandeja rola ${tray.x}px para o lado`);
    /* ⚠ NADA E ESCONDIDO: se um teto voltar, ele reprova aqui. */
    expect(
      tray.rows === tray.letters,
      `[gabinete] o indice mostrou ${tray.rows} das ${tray.letters} cartas do save`,
    );
    /* ⚠ E O CALENDARIO SO ANDA PARA TRAS: um mes repetido e a bagunca que ele reportou. */
    expect(
      tray.months.length === new Set(tray.months).size,
      `[gabinete] um mes apareceu duas vezes no indice: ${tray.months.join(" → ")}`,
    );
    /* ⚠ E DUAS LINHAS NUNCA LEEM IGUAL NO MESMO BLOCO. */
    expect(
      tray.twins.length === 0,
      `[gabinete] duas linhas leem igual dentro do bloco ${tray.twins.join(", ")}`,
    );
  }

  /* ⛔ E ANTES DE RECOMECAR, A MESA E USADA: o voo e a rubrica vivem em variavel de modulo, e
     sem limpa-las a partida NOVA abria com o ato de jan/2027 JA RUBRICADO e a pasta na mao —
     710px contra 448 na mesa, medido. A epigrafe e funcao pura do mes, entao ela se repete
     entre partidas e comparar por ela nao separa duas mesas. */
  await page.click('.rail [data-section="cabinet"]');
  /* ⛔ E A ESPERA E PELA TROCA DE TELA ACABAR: enquanto a view transition roda, o navegador
     pinta um SNAPSHOT por cima da pagina, e `elementFromPoint` devolve o pseudo-elemento —
     o clique caia fora da pasta e a prova acusava a mesa por causa do proprio compasso. */
  await page.waitForFunction(() => document.querySelectorAll(".room").length === 1);
  await page.waitForFunction(() =>
    document.getAnimations().every(one => {
      const alvo = /** @type {{ pseudoElement?: string | null }} */ (one.effect ?? {});
      return !String(alvo.pseudoElement ?? "").startsWith("::view-transition");
    }),
  );
  expect(await tocar(".folder__cover"), "[recomecar] o centro da pasta nao pertence a pasta");
  await pousou();
  /* ⛔ E O TOQUE VAI NA EPIGRAFE, e nao no centro da folha: as oito pastas do Art. 2 moram no
     meio do ato, e um `[data-protect]` sob o ponto medio devolve o clique como MARCA — a
     rubrica nunca corria e a prova acusava a mesa por causa da propria mira. */
  expect(await tocar(".stack .sheet .epigraph"), "[recomecar] a epigrafe nao recebeu o toque");
  await page.waitForTimeout(200);
  expect(
    (await page.locator(".stack .sheet").getAttribute("data-signed")) === "true",
    "[recomecar] a prova nao conseguiu assinar, e sem isso ela deixa de medir o que mede",
  );
  const naMao = await page.locator(".folder").evaluate(node => node.getBoundingClientRect().height);

  /* ⛔ E MARCAR UMA AREA COM A PASTA ERGUIDA REPINTA A SALA, e a sala nova nascia sem
     `--phone-x`: ele so se mede com a pasta na mesa, e o telefone ia para -271px e ficava la
     depois de largar. O passeio nunca marcava com a pasta no ar, e o portao ficou verde. */
  const foneAntes = await page
    .locator(".phone")
    .evaluate(node => node.getBoundingClientRect().left);
  expect(await tocar(".act__folders [data-protect]"), "[recomecar] a area nao recebeu a marca");
  await page.waitForFunction(() => document.querySelectorAll(".room").length === 1);
  const foneDepois = await page
    .locator(".phone")
    .evaluate(node => node.getBoundingClientRect().left);
  expect(
    Math.abs(foneDepois - foneAntes) < 2,
    `[recomecar] o telefone mudou de lugar na repintura: ${foneAntes}px antes, ${foneDepois} depois`,
  );

  /* E RECOMECAR PEDE DOIS CLIQUES. */
  await page.click("#restart");
  await page.waitForTimeout(150);
  expect(
    (await page.locator("#turn").innerText()) === monthAfter,
    "[recomecar] o primeiro clique ja apagou a partida",
  );
  await page.click("#restart");
  await page.waitForTimeout(300);

  /* ⚠ E O SEGUNDO CLIQUE ABRE A POSSE, e nao recomeca: desde 22/08/2026 o jogador escreve o
     proprio nome antes de o estado existir. A partida so troca quando o formulario fecha. */
  expect(
    await page
      .locator("#swearDialog")
      .evaluate(node => /** @type {HTMLDialogElement} */ (node).open),
    "[posse] o segundo clique nao abriu a posse",
  );
  expect(
    (await page.locator("#turn").innerText()) === monthAfter,
    "[posse] a partida trocou ANTES de o jogador tomar posse",
  );

  expect(
    await page
      .locator("#swearParty")
      .evaluate(
        node => /** @type {{ value: string }} */ (/** @type {unknown} */ (node)).value === "",
      ),
    "[posse] o seletor ja vinha com uma bancada marcada, e a escolha e do jogador",
  );
  await page.fill("#swearName", "Teste da Silva");
  /* ⚠ SEM BANCADA O FORMULARIO NAO FECHA, e e de proposito: filiacao e condicao de
     elegibilidade, entao o `required` do seletor e a regra, e nao um capricho de validacao. */
  await page.selectOption("#swearParty", "trabalhistas-unidos");
  await page.locator('input[name="treatment"][value="senhora"]').click();
  await page.click("#swearOk");
  await page.waitForTimeout(600);
  expect(
    (await page.locator("#turn").innerText()) !== monthAfter,
    "[posse] tomar posse nao recomecou a partida",
  );
  /* ⚠ NO GABINETE O RAIL E O DOCK, e o dock e so icones: o nome mora no bloco do governo, que
     so aparece nas outras telas. Le-se o texto do bloco, e nao o que esta pintado. */
  expect(
    ((await page.locator(".rail__gov").textContent()) ?? "").includes("Teste da Silva"),
    "[posse] o nome digitado nao chegou a tela",
  );

  /* ⛔ E A MESA NOVA NASCE LIMPA, nas duas metades: o ato sem rubrica e a pasta na mesa. */
  expect(
    (await page.locator(".stack .sheet").getAttribute("data-signed")) === "false",
    "[posse] a partida nova abriu com o ato ja assinado",
  );
  const naMesa = await page
    .locator(".folder")
    .evaluate(node => node.getBoundingClientRect().height);
  expect(
    naMesa < naMao * 0.95,
    `[posse] a partida nova abriu com a pasta na mao: ${Math.round(naMesa)}px contra ${Math.round(naMao)}px erguida`,
  );

  /* ⚠ E A CARTA DA POSSE MORA NO EMAIL desde a separacao: recomecar devolve o jogador ao
     Gabinete, e a bandeja passou a estar a uma tela de distancia. */
  await page.click('.rail [data-section="email"]');
  await page.waitForTimeout(400);

  /* ⚠ E O TRATAMENTO ATRAVESSA A CARTA: sete frases da interface dependiam dele, e ate hoje
     diziam "o senhor" para toda presidenta. */
  expect(
    (await page.locator(".tray__open .letter").innerText()).includes("a senhora"),
    "[posse] a carta continuou tratando a presidenta por 'o senhor'",
  );

  /* ⚠ E O DEFEITO QUE ELA PEGOU CONTINUA REGISTRADO, porque a licao dele nao e sobre
     telefone: os quatro cartoes do Gabinete se desenhavam uns por cima dos outros em todo
     aparelho de 720px para baixo, e a razao de ninguem ter visto era que a perna do celular
     estava organizada pelo que PARECIA arriscado — o placar denso, a mesa larga — e nao pelo
     que o jogador de fato ve primeiro. */

  /* ── A LINHA DO ANEXO, E ELA SO EXISTE DEPOIS DE ALGUNS MESES ─────────────── ⚠ A CHECAGEM
     DE CORTE NASCEU SEM ALCANCE: ela roda nos pontos de troca de tela, e no mes 1 a bandeja
     nao tem carta com anexo — o passeio ficou verde com a coluna da SOMA cortada. Aqui ela
     vai ATE a peca: avanca ate uma carta com anexo aparecer, abre, e so entao mede.
     ⚠ ELA MEDIA `.annex__line`, QUE SAIU: as quatro tabelas viraram `.annex__line`, e a
     guarda `annexes` recusa o retorno de qualquer uma. O que continua sendo medido aqui e o
     que so o navegador ve — se a peca CORTA na largura da folha. */
  await page.click('.rail [data-section="email"]');
  await page.waitForTimeout(400);
  for (let month = 0; month < 10 && (await page.locator(".annex__line").count()) === 0; month++) {
    await page.click("#advance");
    await page.waitForTimeout(420);
    const rows = await page.locator(".tray__row").count();
    for (let row = 0; row < rows; row++) {
      await page
        .locator(".tray__row")
        .nth(row)
        .click({ timeout: 3000 })
        .catch(() => {});
      await page.waitForTimeout(90);
      if ((await page.locator(".annex__line").count()) > 0) break;
    }
  }
  expect(
    (await page.locator(".annex__line").count()) > 0,
    "[anexo] nenhuma carta trouxe a linha de anexo",
  );
  await checkClipped("carta com anexo");

  /* ── A SEGUNDA JANELA ────────────────────────────────────────────────────────
     ⚠ O PASSEIO RODAVA NUMA ALTURA SO, 980 — e era exatamente a UNICA em que o Gabinete
     cabia: a 900 um cartao inteiro descia para baixo da dobra e nada acusava, porque a
     pagina nao crescia. 900 e a altura util de laptop mais comum que existe. */
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const secao of ["cabinet", "email", "congress", "finance"]) {
    await page.click(`.rail [data-section="${secao}"]`);
    await page.waitForTimeout(600);
    await checkOverflow(`900px/${secao}`);
    await checkClipped(`900px/${secao}`);
    await checkSwallowed(`900px/${secao}`);
    await checkEllipsized(`900px/${secao}`);
    await checkClamped(`900px/${secao}`);
    /* ⛔ E A ROLAGEM SO ENTROU AQUI AGORA: a segunda janela nasceu com cinco checagens e sem
       esta, entao os 94px que o Gabinete rolava a 1440x900 nunca tiveram quem os visse. As
       outras duas telas rolam de proposito. */
    if (secao === "cabinet" || secao === "email") await checkNoPageScroll(`900px/${secao}`);
  }
  await page.click('.rail [data-section="cabinet"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(OUT, "gabinete-900.png"), fullPage: true });

  /* ── A POSSE, E A BANCADA QUE ELA ESCOLHE ─────────────────────────────────── ⚠ ELA VEM NO
     FIM DE PROPOSITO: escolher partido recomeca a partida, e o percurso inteiro acima mede o
     jogo SEM partido, que e como o simulador roda e como um save da versao 20 abre. */
  await page.click('.rail [data-section="cabinet"]');
  await page.waitForTimeout(300);
  await page.click("#restart");
  await page.waitForTimeout(200);
  await page.click("#restart");
  await page.waitForTimeout(400);

  expect(
    (await page.locator("#swearParty option:not([disabled])").count()) === 9,
    "[posse] o seletor de partido nao ofereceu as nove bancadas do catalogo",
  );
  await checkEllipsized("posse");
  await page.screenshot({ path: join(OUT, "posse.png"), fullPage: true });

  /* A MAIOR BANCADA, porque e a que mais muda o jogo: 145 das 513 cadeiras. */
  await page.selectOption("#swearParty", "liberais-conservadores");
  await page.click("#swearOk");
  await page.waitForTimeout(700);
  await page.click('.rail [data-section="congress"]');
  await page.waitForTimeout(500);

  expect(
    (await page.locator('.bench[data-own="true"]').count()) === 1,
    "[congresso] a bancada do presidente nao saiu marcada, ou saiu mais de uma",
  );
  await checkOverflow("congresso com partido");
  await checkClipped("congresso com partido");
  await checkEllipsized("congresso com partido");
  await checkContrast("congresso com partido");
  await page.screenshot({ path: join(OUT, "mesa-partido.png"), fullPage: true });

  /* ── A FONTE QUE CHEGA TARDE ────────────────────────────────────
     ⚠ A BARRA MEDE TIPO PARA SE JUSTIFICAR, E MEDE UMA VEZ SO. Medida antes de a fonte chegar,
     ela grava a largura da fonte de reserva e nada a revisa. A fonte e local e costuma chegar a
     tempo, entao o defeito ficava invisivel — e o portao piscava vermelho sem nada por tras.
     Com 300ms de atraso as duas linhas do bloco do mes vazavam 5px, toda vez. */
  const late = await context.newPage();
  await late.route("**/vendor/fonts/**", async route => {
    await new Promise(resolve => setTimeout(resolve, 300));
    await route.continue();
  });
  await late.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
  await late.evaluate(() => document.fonts.ready);
  await late.waitForTimeout(300);
  await checkTopbar("barra com a fonte atrasada", late);
  await late.close();

  expect(noise.length === 0, `console sujo: ${noise.join(" | ")}`);

  await browser.close();
} finally {
  server.kill();
}

for (const line of report) process.stdout.write(`  ${line}\n`);
process.stdout.write(failures > 0 ? `\n${failures} achado(s)\n` : "\npasseio verde\n");
process.exit(failures > 0 ? 1 : 0);
