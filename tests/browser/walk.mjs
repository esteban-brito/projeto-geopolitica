/* O PASSEIO — a tela usada como se joga, num navegador de verdade.
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE ELE EXISTE, e a resposta e uma lista de defeitos que nada mais pegou.
   `npm run screen` abre a pagina e mede o custo do material; ele nunca CLICA em
   nada, entao so ve a tela de abertura. Numa sessao a Mesa e as areas nasceram
   inteiras, com tipo verde, guarda verde e 99 provas verdes — e tres defeitos
   que so aparecem quando alguem usa:

     · o controle de alocacao abria no MEIO de uma faixa de 0 a 100. `max="25,04"`
       com virgula e valor invalido, e o navegador descarta o atributo calado.
       Node nao lê atributo, entao nenhuma prova de unidade podia ver;
     · a legenda das colunas se sobrepunha, porque cabecalho e linha mediam suas
       colunas em `ch` com fontes de tamanhos diferentes;
     · a Mesa previa o placar com a verba PROMETIDA enquanto o turno vota com a
       PAGA — e a divergencia so aparece no mes em que o caixa nao cobre.

   O QUE ELE NAO E: uma suite de unidade. Ele nao entra em `npm run validate`,
   pela mesma razao de `screen-cost.mjs` — sobe servidor, abre navegador e demora.
   E ele nao substitui prova nenhuma: o que ele acha vira prova em
   `tests/suites/screens.mjs`, que e onde o defeito fica preso.

   Rode com: npm run walk */

import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { ROOT } from "../lib/project.mjs";

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

  /* Sem cabeca aqui, e COM cabeca no `screen-cost`. A diferenca e o que cada um
     mede: aquele precisa de GPU de verdade para o fps significar alguma coisa;
     este so precisa de layout e de eventos, e os dois sao iguais nos dois modos. */
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 980 } });
  const page = await context.newPage();

  /** @type {string[]} */
  const noise = [];
  page.on("console", message => {
    if (message.type() === "error" || message.type() === "warning") noise.push(message.text());
  });
  page.on("pageerror", error => noise.push(String(error)));
  page.on("requestfailed", request => noise.push(`404/erro: ${request.url()}`));

  /** @param {string} where */
  async function checkOverflow(where) {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(!overflow, `[${where}] a tela rola na horizontal`);
  }

  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
  await checkOverflow("mesa vazia");

  /* 1 — A MESA VAZIA nao anuncia placar nenhum. */
  expect(
    (await page.locator(".tally__forecast").count()) === 0,
    "[mesa vazia] a mesa sem pauta mostrou placar",
  );

  /* 2 — UMA AREA, pelo rail. */
  await page.click('[data-section="health"]');
  await page.waitForTimeout(600);
  await checkOverflow("area");
  expect((await page.locator(".action-row").count()) > 0, "[area] a lista de acoes veio vazia");

  /* 3 — O CONTROLE DE ALOCACAO. Doze passos de 0,1 sao R$ 1,2 bi, e nenhum
     outro numero: se o atributo tiver formato errado, o navegador abre o
     controle no meio da propria faixa e a leitura sai em dezenas. */
  const allot = page.locator(".allot__slider");
  await allot.focus();
  for (let step = 0; step < 12; step++) await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(150);
  const read = await page.locator("#allotRead").innerText();
  expect(
    read.includes("R$ 1,2 bi"),
    `[area] doze passos do controle deram "${read.split("\n")[0]}" em vez de R$ 1,2 bi`,
  );
  await page.screenshot({ path: join(OUT, "walk-area.png"), fullPage: true });

  /* 4 — PAUTAR leva a Mesa com a acao escolhida. */
  await page.locator(".action-row__pick").first().click();
  await page.waitForTimeout(600);
  expect(
    (await page.locator(".mesa__title").count()) === 1,
    "[mesa] escolher uma acao nao levou a Mesa",
  );
  expect(
    (await page.locator(".tally__forecast").count()) === 1,
    "[mesa] a pauta nao trouxe placar",
  );

  /* 5 — A VERBA MOVE O PLACAR.
     A VERBA VAI PARA AS QUATRO BANCADAS, e nao para a primeira: a adesao e
     limitada em 1, entao uma bancada que ja entrega tudo o que tem nao entrega
     mais por dinheiro nenhum. Comprando so da primeira, a prova acusava a tela
     de nao reagir quando quem nao reagia era o modelo — e com razao, porque uma
     lei de piso de enfermagem ja tem a esquerda inteira. */
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

  /* 7 — O MES ANDA, E ELE PRESTA CONTAS. O relatorio abre sozinho: e a
     consequencia do botao, e nao um lugar que se visita. Enquanto ele esta
     aberto, nada atras dele e clicavel — o `<dialog>` nativo entrega inercia do
     fundo, e o passeio tem de fechar antes de continuar, como o jogador faz. */
  const title = await page.locator(".mesa__title").innerText();

  await page.click("#advance");
  await page.waitForTimeout(700);

  expect(
    await page.locator("#monthDialog").evaluate(node => node.hasAttribute("open")),
    "[relatorio] o mes foi resolvido e o relatorio nao abriu",
  );
  const verdict = await page.locator(".report__verdict").innerText();
  expect(
    /aprovada|rejeitada|decretada/i.test(verdict),
    `[relatorio] o veredito veio como "${verdict}"`,
  );
  expect(
    (await page.locator(".report__table tbody tr").count()) === 4,
    "[relatorio] a tabela nao trouxe as quatro bancadas",
  );
  await page.screenshot({ path: join(OUT, "walk-relatorio.png") });
  await page.click("#monthDialogClose");
  await page.waitForTimeout(200);

  /* E ele fica guardado: o botao do rail reabre o ultimo mes. */
  expect(
    !(await page.locator("#review").isDisabled()),
    "[relatorio] o botao de reabrir continuou desligado depois do primeiro mes",
  );
  await page.click("#review");
  await page.waitForTimeout(200);
  expect(
    await page.locator("#monthDialog").evaluate(node => node.hasAttribute("open")),
    "[relatorio] reabrir o ultimo mes nao abriu nada",
  );
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);

  for (let month = 0; month < 2; month++) {
    await page.click("#advance");
    await page.waitForTimeout(700);
    await page.click("#monthDialogClose");
    await page.waitForTimeout(150);
  }
  await page.click('[data-section="health"]');
  await page.waitForTimeout(600);
  await checkOverflow("area depois do mes");

  const standing = await page.locator(".action-list--done").innerText();
  expect(standing.includes(title), `[area] "${title}" passou e nao apareceu em vigor`);
  const offered = await page.locator(".action-list:not(.action-list--done)").innerText();
  expect(!offered.includes(title), `[area] "${title}" ja esta em vigor e continua sendo oferecida`);
  await page.screenshot({ path: join(OUT, "walk-area-depois.png"), fullPage: true });

  /* 8 — O CELULAR, com a mesma sequencia ja no estado avancado. */
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  await checkOverflow("celular · area");
  await page.click('[data-section="mesa"]');
  await page.waitForTimeout(600);
  await checkOverflow("celular · mesa");
  await page.screenshot({ path: join(OUT, "walk-celular.png"), fullPage: true });

  expect(noise.length === 0, `console sujo: ${noise.join(" | ")}`);

  await browser.close();
} finally {
  server.kill();
}

for (const line of report) process.stdout.write(`  ${line}\n`);
process.stdout.write(failures > 0 ? `\n${failures} achado(s)\n` : "\npasseio verde\n");
process.exit(failures > 0 ? 1 : 0);
