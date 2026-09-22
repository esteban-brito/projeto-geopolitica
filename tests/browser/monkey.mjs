/* O MACACO — joga ao acaso, com semente, e mede em repouso.
   O passeio segue um roteiro; o macaco nao. Ele acha o que acontece na ordem que ninguem
   escreveu: erro de pagina, morph que nao pousa, pilula que fica longe do item, dialogo sem
   saida, tabuleiro vazio. Medir so em repouso e o que tira o ruido: a versao solta acusava a
   pilula 28 vezes em 250 acoes medindo no meio da mola.
   uso: node tests/browser/monkey.mjs [acoes] [semente] */

import { spawn } from "node:child_process";
import { join } from "node:path";
import { chromium } from "playwright";
import { ROOT } from "../lib/project.mjs";

const PORT = 5202;
const BASE = `http://127.0.0.1:${PORT}`;
const ACTIONS = Number(process.argv[2] ?? 60);
const SEED = Number(process.argv[3] ?? 7);
const PILL_SLACK = 2;
const REST_TIMEOUT = 3000;

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

let seed = SEED;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

/* Onde o macaco clica: cada seletor e um gesto que o jogador tem. */
const TARGETS = [
  ".rail [data-section]",
  ".rail__drawer",
  "[data-dispatch]",
  "[data-letter][data-answer]",
  "[data-pledge]",
  "[data-protect]",
  ".envelope[data-letter]",
  "#advance",
  "#noticeClose",
  ".folder__cover",
  ".dial__slider",
  "[data-party]",
];

/** Espera a tela parar: sem troca de tela, sem morph, sem mola na pilula ou na carta. */
/** @param {import("playwright").Page} page */
async function rest(page) {
  try {
    await page.waitForFunction(
      () => {
        const doc = /** @type {{ activeViewTransition?: unknown }} */ (document);
        if (doc.activeViewTransition) return false;
        const rail = document.querySelector(".rail");
        if (rail?.hasAttribute("data-morph")) return false;
        /* So o que esta correndo: a pasta guarda a animacao terminada com `fill: forwards`. */
        const moving = [".post__sheet:not([hidden])", ".folder"]
          .flatMap(sel => [...document.querySelectorAll(sel)])
          .some(node => node.getAnimations().some(one => one.playState === "running"));
        if (moving) return false;
        /* A pilula e mola JS por rAF, invisivel a `getAnimations`: parou quando a caixa dela
           e a mesma de um quadro para o outro. */
        const pill = document.querySelector(".rail__pill");
        const box = pill?.getBoundingClientRect();
        const key = box ? [box.left, box.top, box.width, box.height].join(",") : "";
        const memo = /** @type {{ pillKey?: string }} */ (window);
        const still = memo.pillKey === key;
        memo.pillKey = key;
        return still;
      },
      undefined,
      { timeout: REST_TIMEOUT },
    );
    return true;
  } catch {
    return false;
  }
}

/** O que tem de valer em repouso. */
/** @param {import("playwright").Page} page */
async function invariants(page) {
  return page.evaluate(slack => {
    /** @type {string[]} */
    const out = [];
    const main = document.querySelector("#main");
    if (!main || main.children.length === 0) out.push("tabuleiro vazio");
    for (const dialog of document.querySelectorAll("dialog[open]")) {
      if (!dialog.querySelector("button")) out.push("dialogo aberto sem botao");
    }
    const rail = document.querySelector(".rail");
    if (rail instanceof HTMLElement && rail.dataset["flow"] === "column") {
      const pill = rail.querySelector(".rail__pill");
      const item = [...rail.querySelectorAll(".rail__item--active")].find(
        node => node instanceof HTMLElement && node.offsetWidth > 0,
      );
      if (
        pill instanceof HTMLElement &&
        item instanceof HTMLElement &&
        Number(getComputedStyle(pill).opacity) > 0.5
      ) {
        const a = pill.getBoundingClientRect();
        const b = item.getBoundingClientRect();
        const off = Math.max(Math.abs(a.top - b.top), Math.abs(a.left - b.left));
        if (off > slack) out.push(`pilula a ${Math.round(off)}px do item ativo em repouso`);
      }
    }
    if (
      rail instanceof HTMLElement &&
      rail.dataset["flow"] === "row" &&
      document.documentElement.scrollHeight > window.innerHeight + 2
    ) {
      out.push(
        `pagina rola ${document.documentElement.scrollHeight - window.innerHeight}px no gabinete`,
      );
    }
    return out;
  }, PILL_SLACK);
}

/** @type {string[]} */
const findings = [];
/** @type {string[]} */
const errors = [];
/** @type {string[]} */
const trail = [];
const where = () => trail.slice(-3).join(" › ");

try {
  await waitForServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("pageerror", error => errors.push(`erro de pagina: ${error.message}`));
  page.on("console", message => {
    if (message.type() === "error") errors.push(`console: ${message.text().slice(0, 160)}`);
  });
  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });

  if (await page.locator("#swearDialog[open]").count()) {
    await page.fill("#swearName", "Macaco");
    await page.selectOption("#swearParty", { index: 1 + Math.floor(rnd() * 8) });
    await page.click("#swearOk");
    await rest(page);
  }

  for (let i = 0; i < ACTIONS; i++) {
    const selector = TARGETS[Math.floor(rnd() * TARGETS.length)] ?? "";
    const nodes = page.locator(selector);
    const count = await nodes.count();
    let did = `(nada em ${selector})`;
    if (count > 0) {
      const node = nodes.nth(Math.floor(rnd() * count));
      if (await node.isVisible().catch(() => false)) {
        const tag = await node.evaluate(element => element.tagName).catch(() => "");
        if (tag === "INPUT") {
          await node
            .evaluate(
              (element, value) => {
                /** @type {HTMLInputElement} */ (element).value = String(value);
                element.dispatchEvent(new Event("input", { bubbles: true }));
              },
              Math.floor(rnd() * 100),
            )
            .catch(() => {});
          did = `${selector}=valor`;
        } else if (selector === "#advance" && rnd() < 0.5) {
          did = "(pulou avancar)";
        } else {
          /* Clique em peca coberta nao e defeito: a pasta fechada cobre o ato, a carta cobre a
             mesa. O macaco so anota e segue. */
          const clicked = await node
            .click({ timeout: 1000 })
            .then(() => true)
            .catch(() => false);
          did = clicked ? selector : `${selector} (coberto)`;
        }
      }
    }
    if (rnd() < 0.15) {
      await page.keyboard.press("Escape");
      did += " +Esc";
    }
    trail.push(did);

    /* O ponteiro sai do item antes de medir: o `:hover` escala o item em 1,02 e a pilula
       "erra" por 2px. Ele sai agora e o hover assenta enquanto o repouso espera. */
    await page.mouse.move(720, 500);
    if (!(await rest(page)))
      findings.push(`#${i} apos ${where()}: nao repousou em ${REST_TIMEOUT}ms`);
    await page.waitForTimeout(100);
    for (const fault of await invariants(page)) findings.push(`#${i} apos ${where()}: ${fault}`);
    for (const error of errors.splice(0)) findings.push(`#${i} apos ${where()}: ${error}`);
  }

  const month = await page.evaluate(() =>
    document.querySelector(".when__date")?.textContent?.trim(),
  );
  process.stdout.write(
    `macaco: ${ACTIONS} acoes, semente ${SEED}, chegou em "${month}" · achados: ${findings.length}\n`,
  );
  await browser.close();
} finally {
  server.kill();
}

for (const finding of findings) process.stdout.write(`  ${finding}\n`);
process.exit(findings.length > 0 ? 1 : 0);
