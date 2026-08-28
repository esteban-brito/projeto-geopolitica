/* CUSTO DA TELA — o fps do material, medido contra um braco de controle. */

import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";
import { ROOT } from "../lib/project.mjs";

const PORT = 5199;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = join(ROOT, "captures", "custo");

const VIEWPORTS = [{ name: "desktop", width: 1440, height: 900 }];

/* E o unico jeito de o delta medido ser do FILTRO e nao de outra coisa. */
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

  /* GPU LIGADA E VSYNC ATIVO. */
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
      /* MEDIDA ALTERNADA, e nao uma de cada. */
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
