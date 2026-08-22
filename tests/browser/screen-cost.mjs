/* CUSTO DA TELA — o fps do material, medido contra um braco de controle.
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE ESTA SUITE EXISTE ANTES DE QUALQUER SEGUNDA TELA.

   `backdrop-filter` nao e gratuito, e o custo e por TELA e nao por efeito. No
   projeto anterior ele derrubou uma tela EM MOVIMENTO para 31 fps e teve de ser
   removido; a tela que o manteve media 61,2 contra 60,6 do controle, e a
   diferenca entre os dois casos nao foi o filtro — foi a condicao: superficie
   pequena sobre fundo estatico.

   DUAS ARMADILHAS DE MEDICAO, as duas ja pagas la:

     1. HEADLESS SEM GPU MEDE O APARELHO ERRADO. O Playwright rasteriza por
        software por padrao, e nesse regime os DOIS bracos caem juntos — o
        material chega a parecer 1,9 fps mais caro que um controle que nao custa
        nada. Por isso esta suite abre o navegador COM GPU;
     2. SEM BRACO DE CONTROLE, 60 fps nao diz nada. Ele nao distingue "esta bom"
        de "a maquina nao passa de 60". A pergunta certa e se a tela SUSTENTA a
        taxa do monitor, e ela so se responde comparando com a mesma tela sem o
        filtro.

   POR QUE ELA VIVE EM `tests/browser/` E NAO EM `tests/suites/`. Isto aqui nao e
   um arquivo de `node:test`: e um script que sobe servidor, abre um Chromium
   HEADED com GPU e sai com codigo proprio. Ele nao pode entrar em `npm run
   validate`, que precisa ser rapido e rodar sem tela. Separar por diretorio, e
   nao por sufixo no nome, e o que mantem `tests/suites/*` com um significado so.

   Rode com: npm run screen */

import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { ROOT } from "../lib/project.mjs";

const PORT = 5199;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = join(ROOT, "captures");

const VIEWPORTS = [
  /* ⚠ TABLET E CELULAR SAIRAM EM 20/08/2026, por decisao de ESCOPO do responsavel —
     ver a nota em `walk.mjs`. O que sobra e o desktop, e o numero e o que ele usa.
     Medir fps num aparelho que ninguem vai usar nao e cobertura: e ruido com aparencia
     de rigor, e ele custa dois navegadores por rodada. */
  { name: "desktop", width: 1440, height: 900 },
];

/* Desliga o material sem mexer no layout: mesma caixa, mesma cor, mesmo texto.
   E o unico jeito de o delta medido ser do FILTRO e nao de outra coisa. */
const CONTROL_ARM = `
  .glass-stage::after, .glass-action, .glass-support {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }`;

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

/** Conta quadros por `ms` milissegundos. @param {import("playwright").Page} page */
function measureFps(page, ms = 3000) {
  return page.evaluate(duration => {
    return new Promise(resolve => {
      let frames = 0;
      const start = performance.now();
      const tick = () => {
        frames++;
        if (performance.now() - start < duration) requestAnimationFrame(tick);
        else resolve((frames * 1000) / (performance.now() - start));
      };
      requestAnimationFrame(tick);
    });
  }, ms);
}

/** @param {number[]} values */
function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

let failures = 0;
const report = [];

try {
  await waitForServer();
  mkdirSync(OUT, { recursive: true });

  /* GPU LIGADA E VSYNC ATIVO. Sem `--disable-frame-rate-limit` o numero fica
     preso na taxa do monitor, que e exatamente o que queremos saber: a tela
     SUSTENTA os 60? Sem vsync o numero perde sentido no outro extremo. */
  const browser = await chromium.launch({
    headless: false,
    args: ["--enable-gpu", "--ignore-gpu-blocklist", "--enable-gpu-rasterization"],
  });

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();

    /** @type {string[]} */
    const noise = [];
    page.on("console", message => {
      if (message.type() === "error" || message.type() === "warning") noise.push(message.text());
    });
    page.on("pageerror", error => noise.push(String(error)));
    page.on("requestfailed", request => noise.push(`404/erro: ${request.url()}`));

    await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });

    /* O console tem de estar limpo, e SEM filtro de ruido: no projeto anterior
       um filtro para "Failed to load resource" escondeu 404 real por meses. */
    if (noise.length > 0) {
      failures++;
      report.push(`[${viewport.name}] console sujo: ${noise.join(" | ")}`);
    }

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    if (overflow) {
      failures++;
      report.push(`[${viewport.name}] a tela rola na horizontal`);
    }

    await page.screenshot({ path: join(OUT, `${viewport.name}.png`) });

    if (viewport.name === "desktop") {
      /* MEDIDA ALTERNADA, e nao uma de cada. A primeira versao mediu material e
         depois controle, e o material saiu 8 fps MAIS RAPIDO — o que e
         fisicamente impossivel e denuncia a ordem, nao o custo: a segunda
         medicao pega o navegador em outro estado de aquecimento. Alternar e
         tomar a mediana tira a ordem da conta. */
      const glass = [];
      const control = [];
      for (let round = 0; round < 3; round++) {
        glass.push(await measureFps(page, 2000));
        const arm = await page.addStyleTag({ content: CONTROL_ARM });
        control.push(await measureFps(page, 2000));
        await arm.evaluate((/** @type {Element} */ tag) => tag.remove());
      }
      const withGlass = median(glass);
      const withoutGlass = median(control);
      report.push(
        `fps · material ${withGlass.toFixed(1)} × controle ${withoutGlass.toFixed(1)} ` +
          `(delta ${(withGlass - withoutGlass).toFixed(1)}) · 3 rodadas alternadas`,
      );
      if (withoutGlass - withGlass > 5) {
        failures++;
        report.push("o material custa mais de 5 fps contra o controle — reveja a pilha de camadas");
      }
    }

    await context.close();
  }

  await browser.close();
} finally {
  server.kill();
}

for (const line of report) process.stdout.write(`  ${line}\n`);
process.stdout.write(failures > 0 ? `\n${failures} achado(s)\n` : "\ntela verde\n");
process.exit(failures > 0 ? 1 : 0);
