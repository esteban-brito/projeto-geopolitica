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
            const name = node.className || node.tagName.toLowerCase();
            const parent = node.parentElement?.className || "";
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
  await checkOverflow("gabinete");
  await checkClipped("gabinete");
  await checkSwallowed("gabinete");
  await checkEllipsized("gabinete");
  await checkClamped("gabinete");
  await checkContrast("gabinete");
  await checkNoOverlap("gabinete", ".cards > .card");

  /* 1 — O GABINETE E A TELA INICIAL, e ele nao decide nada. */
  /* CINCO desde 16/08, quando a CALDEIRA entrou. */
  expect((await page.locator(".card").count()) === 5, "[gabinete] os cinco cartoes nao vieram");
  expect(
    (await page.locator("#main input, #main select").count()) === 0,
    "[gabinete] a tela inicial ofereceu um controle",
  );
  expect(
    (await page.locator(".vital").count()) === 4,
    "[barra] os quatro sinais vitais nao vieram",
  );
  await page.screenshot({ path: join(OUT, "gabinete.png"), fullPage: true });

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
  await page.click('[data-section="health"]');
  await page.waitForTimeout(600);
  await checkOverflow("area");
  await checkClipped("area");
  await checkSwallowed("area");
  await checkEllipsized("area");
  await checkClamped("area");
  await checkContrast("area");
  expect((await page.locator(".dial").count()) > 0, "[area] o orcamento veio sem programas");

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
  await page.click('.rail [data-section="cabinet"]');
  await page.waitForTimeout(400);
  const linhas = await page.locator(".tray__row").count();
  if (linhas > 1) {
    await page.locator(".tray__row").last().click();
    await page.waitForTimeout(200);
    const presa = await page
      .locator('.tray__row[aria-current="true"]')
      .getAttribute("data-dispatch");
    await page.click("#advance");
    await page.waitForTimeout(700);
    const agora = await page
      .locator('.tray__row[aria-current="true"]')
      .getAttribute("data-dispatch");
    expect(agora !== presa, `[caixa] o mes virou e a carta aberta continuou sendo ${presa}`);
    expect(
      (await page.locator(".tray__row").first().getAttribute("aria-current")) === "true",
      "[caixa] depois do mes a bandeja nao abriu a carta do topo",
    );
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
    await page.click('[data-section="health"]');
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
    await page.click('[data-section="cabinet"]');
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
    await checkContrast("caixa com pergunta");
    await checkNoOverlap("caixa com pergunta", ".letter");
    await page.screenshot({ path: join(OUT, "carta-pergunta.png"), fullPage: true });
  }

  await page.click('[data-section="health"]');
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
  const monthBefore = await page.locator("#turn").innerText();
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const monthAfter = await page.locator("#turn").innerText();
  expect(
    monthBefore === monthAfter,
    `[save] o mes era ${monthBefore} e voltou ${monthAfter} depois de recarregar`,
  );
  /* ⚠ PARA BAIXO O INDICE ROLA DE PROPOSITO, e esta checagem ja cobrou o contrario: ela
     defendia o teto de 7 linhas, e o teto caiu porque com blocos de mes ele mostrava "MAR" com
     2 das 5 cartas do mes. Para o LADO continua proibido. */
  /* Medida no comeco, com uma carta na mesa, esta prova ficaria verde para sempre sem
     defender nada. */
  const tray = await page.evaluate(() => {
    const list = document.querySelector(".tray__list");
    if (!list) return null;
    const save = JSON.parse(window.localStorage.getItem("planalto:partida") ?? "{}");

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
      letters: Array.isArray(save.mail) ? save.mail.length : -1,
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

  /* A TELA RETOMADA ABRE NO GABINETE, e nao na area em que se estava: `screen` e memoria de
     sessao e nao entra no save. */
  expect((await page.locator(".card").count()) === 5, "[save] a tela retomada nao renderizou");

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

  await page.fill("#swearName", "Teste da Silva");
  await page.locator('input[name="treatment"][value="senhora"]').click();
  await page.click("#swearOk");
  await page.waitForTimeout(600);
  expect(
    (await page.locator("#turn").innerText()) !== monthAfter,
    "[posse] tomar posse nao recomecou a partida",
  );
  expect(
    (await page.locator(".rail").innerText()).includes("Teste da Silva"),
    "[posse] o nome digitado nao chegou a tela",
  );

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

  /* ── A TABELA DO ANEXO, E ELA SO EXISTE DEPOIS DE ALGUNS MESES ────────────── ⚠ A CHECAGEM
     DE CORTE NASCEU SEM ALCANCE: ela roda nos pontos de troca de tela, e no mes 1 a bandeja
     nao tem carta com tabela — o passeio ficou verde com a coluna da SOMA cortada. Aqui ela
     vai ATE a peca: avanca ate uma carta com anexo aparecer, abre, e so entao mede. */
  await page.click('.rail [data-section="cabinet"]');
  await page.waitForTimeout(400);
  for (let month = 0; month < 10 && (await page.locator(".annex__table").count()) === 0; month++) {
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
      if ((await page.locator(".annex__table").count()) > 0) break;
    }
  }
  expect((await page.locator(".annex__table").count()) > 0, "[anexo] nenhuma carta trouxe tabela");
  await checkClipped("carta com anexo");

  /* ── A SEGUNDA JANELA ────────────────────────────────────────────────────────
     ⚠ O PASSEIO RODAVA NUMA ALTURA SO, 980 — e era exatamente a UNICA em que o Gabinete
     cabia: a 900 um cartao inteiro descia para baixo da dobra e nada acusava, porque a
     pagina nao crescia. 900 e a altura util de laptop mais comum que existe. */
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const secao of ["cabinet", "congress", "finance"]) {
    await page.click(`.rail [data-section="${secao}"]`);
    await page.waitForTimeout(600);
    await checkOverflow(`900px/${secao}`);
    await checkClipped(`900px/${secao}`);
    await checkSwallowed(`900px/${secao}`);
    await checkEllipsized(`900px/${secao}`);
    await checkClamped(`900px/${secao}`);
  }
  await page.click('.rail [data-section="cabinet"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(OUT, "gabinete-900.png"), fullPage: true });

  expect(noise.length === 0, `console sujo: ${noise.join(" | ")}`);

  await browser.close();
} finally {
  server.kill();
}

for (const line of report) process.stdout.write(`  ${line}\n`);
process.stdout.write(failures > 0 ? `\n${failures} achado(s)\n` : "\npasseio verde\n");
process.exit(failures > 0 ? 1 : 0);
