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
const OUT = join(ROOT, "captures");

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

  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
  await checkOverflow("gabinete");
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
  await page.screenshot({ path: join(OUT, "walk-gabinete.png"), fullPage: true });

  /* 1b — E O CARTAO LEVA AO LUGAR DE DECIDIR. */
  await page.click('.card__action[data-section="congress"]');
  await page.waitForTimeout(600);
  await checkOverflow("congresso");
  expect(
    (await page.locator(".tally__forecast").count()) === 0,
    "[congresso] a mesa sem pauta mostrou placar",
  );

  /* 2 — UMA AREA, pelo rail. */
  await page.click('[data-section="health"]');
  await page.waitForTimeout(600);
  await checkOverflow("area");
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
  await page.screenshot({ path: join(OUT, "walk-area.png"), fullPage: true });

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
  await page.screenshot({ path: join(OUT, "walk-mesa.png"), fullPage: true });

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
  await page.screenshot({ path: join(OUT, "walk-mesa-estourada.png"), fullPage: true });

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
  await page.screenshot({ path: join(OUT, "walk-relatorio.png"), fullPage: true });

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
    await checkNoOverlap("caixa com pergunta", ".letter");
    await page.screenshot({ path: join(OUT, "walk-carta-pergunta.png"), fullPage: true });
  }

  await page.click('[data-section="health"]');
  await page.waitForTimeout(600);
  await checkOverflow("area depois do mes");

  /* O QUE FOI DECIDIDO ESTA NO PROPRIO CONTROLE, e nao numa lista de leis em vigor: a lista
     morreu junto com o catalogo de pautas, e a pergunta que ela respondia — o que ja esta
     valendo? */
  expect((await page.locator(".dial").count()) > 0, "[area] o orcamento sumiu depois do mes");
  await page.screenshot({ path: join(OUT, "walk-area-depois.png"), fullPage: true });

  /* 7c — O PLACAR, e ele so tem sentido AQUI, depois de quatro meses terem acontecido: numa
     partida recem-aberta a serie esta vazia e o painel nao teria tendencia nenhuma para
     desenhar — que e o estado em que uma escada quebrada passa despercebida. */
  await page.click('[data-section="finance"]');
  await page.waitForTimeout(600);
  await checkOverflow("financas");

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
  await page.screenshot({ path: join(OUT, "walk-financas.png"), fullPage: true });

  /* 8 — A PARTIDA ATRAVESSA O NAVEGADOR. */
  const monthBefore = await page.locator("#turn").innerText();
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const monthAfter = await page.locator("#turn").innerText();
  expect(
    monthBefore === monthAfter,
    `[save] o mes era ${monthBefore} e voltou ${monthAfter} depois de recarregar`,
  );
  /* ⚠ E O INDICE DA BANDEJA NAO ROLA — nem para o lado, nem para baixo. */
  /* Medida no comeco, com uma carta na mesa, esta prova ficaria verde para sempre sem
     defender nada. */
  const tray = await page.evaluate(() => {
    const list = document.querySelector(".tray__list");
    if (!list) return null;
    return {
      x: list.scrollWidth - list.clientWidth,
      y: list.scrollHeight - list.clientHeight,
      rows: list.querySelectorAll(".tray__row").length,
    };
  });
  if (tray) {
    expect(tray.x <= 1, `[gabinete] o indice da bandeja rola ${tray.x}px para o lado`);
    expect(
      tray.y <= 1,
      `[gabinete] o indice rola ${tray.y}px para baixo com ${tray.rows} linhas — a pilha estourou`,
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
  await page.waitForTimeout(600);
  expect(
    (await page.locator("#turn").innerText()) !== monthAfter,
    "[recomecar] o segundo clique nao recomecou a partida",
  );

  /* ⚠ E O DEFEITO QUE ELA PEGOU CONTINUA REGISTRADO, porque a licao dele nao e sobre
     telefone: os quatro cartoes do Gabinete se desenhavam uns por cima dos outros em todo
     aparelho de 720px para baixo, e a razao de ninguem ter visto era que a perna do celular
     estava organizada pelo que PARECIA arriscado — o placar denso, a mesa larga — e nao pelo
     que o jogador de fato ve primeiro. */

  expect(noise.length === 0, `console sujo: ${noise.join(" | ")}`);

  await browser.close();
} finally {
  server.kill();
}

for (const line of report) process.stdout.write(`  ${line}\n`);
process.stdout.write(failures > 0 ? `\n${failures} achado(s)\n` : "\npasseio verde\n");
process.exit(failures > 0 ? 1 : 0);
