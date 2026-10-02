import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { POSSE_FILES } from "../../../prototypes/posse/paths.mjs";

/** @typedef {import("playwright").Page} Page */
/** @typedef {{target: string, opacity: string, transform: string, name: string, duration: string, delay: string, easing: string}} Rise */
/** @typedef {{elapsed: number, rises: Rise[]}} MotionFrame */
/** @typedef {{rawFrames: number, rawFirst: number | null, ready: number | null, frames: MotionFrame[], animations: {name: string, target: string, phase: string | null | undefined}[]}} MotionTrace */
/** @typedef {MotionTrace & {version: string, height: number, delayed: boolean, reload: boolean}} MotionReport */
/** @typedef {{version: string, height: number, recipes: Record<string, unknown>}} InteractionReport */
const port = "5207";
const folder = `${POSSE_FILES.captures}/motion`;
/** @type {MotionReport[]} */
const reports = [];
/** @type {InteractionReport[]} */
const interactions = [];
const server = spawn(process.execPath, ["tools/serve-static.mjs"], {
  env: { ...process.env, PORT: port },
  stdio: "ignore",
  windowsHide: true,
});

/** @param {Page} page */
async function trace(page) {
  await page.addInitScript(() => {
    /** @type {MotionTrace} */
    const result = {
      rawFrames: 0,
      rawFirst: null,
      ready: null,
      frames: [],
      animations: [],
    };
    Reflect.set(window, "posseMotion", result);
    document.addEventListener("animationstart", event => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      result.animations.push({
        name: event.animationName,
        target: target.className,
        phase: target.closest("[data-phase]")?.getAttribute("data-phase"),
      });
    });
    const sample = () => {
      const raw = document.querySelector("x-dc");
      if (raw && getComputedStyle(raw).display !== "none") {
        result.rawFrames++;
        result.rawFirst ??= performance.now();
      }
      const create = document.querySelector('.curtain.on[data-phase="create"]');
      if (create && !raw) {
        result.ready ??= performance.now();
        if (performance.now() - result.ready < 1250) {
          result.frames.push({
            elapsed: performance.now() - result.ready,
            rises: [...create.querySelectorAll(".rise")].map(element => {
              const style = getComputedStyle(element);
              return {
                target: element.className,
                opacity: style.opacity,
                transform: new globalThis.DOMMatrixReadOnly(style.transform).isIdentity
                  ? "none"
                  : style.transform,
                name: style.animationName,
                duration: style.animationDuration,
                delay: style.animationDelay,
                easing: style.animationTimingFunction,
              };
            }),
          });
        } else return;
      }
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
}

/** @param {Page} page @param {string} selector */
async function recipe(page, selector) {
  return page.locator(selector).evaluateAll(elements =>
    elements.map(element => {
      const style = getComputedStyle(element);
      return {
        className: element.className,
        animation: style.animationName,
        duration: style.animationDuration,
        delay: style.animationDelay,
        easing: style.animationTimingFunction,
        fill: style.animationFillMode,
        transition: style.transitionProperty,
        transitionDuration: style.transitionDuration,
        transitionDelay: style.transitionDelay,
        transitionEasing: style.transitionTimingFunction,
        filter: style.filter,
        backdropFilter: style.backdropFilter,
        radius: style.borderRadius,
      };
    }),
  );
}

/** @param {Page} page @param {string} version @param {number} height */
async function ministryMotion(page, version, height) {
  /** @type {Record<string, unknown>} */
  const recipes = {};
  await page.fill('[data-f="name"]', "Ana Souza");
  await page.fill('[data-f="birth"]', "1975-04-12");
  await page.selectOption('[data-f="uf"]', "MG");
  await page.click('[data-party="mdn"]');
  await page.click('[data-path="politico"]');
  await page.click('[data-act="swear"]');
  await page.waitForSelector('.curtain.on[data-phase="intro"]');
  recipes.intro = await recipe(page, '[data-phase="intro"] .rise');
  await page.click('[data-act="skip"]');
  await page.waitForFunction(() => document.querySelectorAll(".curtain.on").length === 0);
  const node = page.locator('button.node[data-seat="saude"]');
  await page.evaluate(() =>
    Reflect.set(window, "motionNode", document.querySelector('button.node[data-seat="saude"]')),
  );
  await node.hover();
  await page.waitForFunction(() => {
    const face = document.querySelector('button.node[data-seat="saude"] .face');
    return face && new globalThis.DOMMatrixReadOnly(getComputedStyle(face).transform).m42 <= -2.99;
  });
  recipes.node = await recipe(page, 'button.node[data-seat="saude"] .face');
  recipes.tip = await recipe(page, 'button.node[data-seat="saude"] .ntip');
  await node.click();
  const panel = page.locator(".panel:has(.step)");
  await panel.getByRole("button", { name: /^Manter/ }).click();
  await panel.locator(".seg").getByRole("button", { name: "Partidos", exact: true }).click();
  await page.evaluate(() =>
    Reflect.set(window, "motionCard", document.querySelector("[data-card]")),
  );
  await panel.locator("button.row .name").first().hover();
  await page.waitForFunction(() => {
    const card = document.querySelector("[data-card].on");
    return card && Number(getComputedStyle(card).opacity) >= 0.99;
  });
  recipes.card = await recipe(page, "[data-card].on");
  const cardBox = await page.locator("[data-card].on").boundingBox();
  assert.ok(
    cardBox &&
      cardBox.x >= 0 &&
      cardBox.y >= 0 &&
      cardBox.x + cardBox.width <= 1440 &&
      cardBox.y + cardBox.height <= height,
    `${version}: ficha dentro da janela`,
  );
  await page.screenshot({ path: `${folder}/${version}-card-${height}.png` });
  await panel.locator("button.row").last().scrollIntoViewIfNeeded();
  await panel.locator("button.row").first().scrollIntoViewIfNeeded();
  await panel.locator("button.row").first().click();
  for (const filter of ["Outros", "Sugeridos", "Partidos"])
    await panel.locator(".seg").getByRole("button", { name: filter, exact: true }).click();
  assert.equal(
    await page.evaluate(
      () =>
        Reflect.get(window, "motionNode") ===
        document.querySelector('button.node[data-seat="saude"]'),
    ),
    true,
    "a seleção e os filtros não remontam o ícone",
  );
  assert.equal(
    await page.evaluate(
      () => Reflect.get(window, "motionCard") === document.querySelector("[data-card]"),
    ),
    true,
    "a ficha usa o mesmo elemento nas transições",
  );
  await page.mouse.move(1250, 20);
  await page.waitForFunction(() => {
    const card = document.querySelector("[data-card]");
    return card && !card.classList.contains("on");
  });
  recipes.closedCard = await recipe(page, "[data-card]");
  await panel.getByRole("button", { name: "Voltar ao passo 1", exact: true }).click();
  recipes.step = await recipe(page, ".panel:has(.step) .enter");
  await page.click('[data-act="finish"]');
  await page.waitForSelector('.curtain.on[data-phase="photo"]');
  recipes.photo = await recipe(page, '[data-phase="photo"] .frame');
  await page.getByRole("button", { name: "Voltar à posse", exact: true }).click();
  assert.equal(await page.locator("button.node").count(), 38);
  assert.equal(await page.locator(".dot").count(), 513);
  interactions.push({ version, height, recipes });
}

try {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/${POSSE_FILES.reference}`)).ok) break;
    } catch {
      /* servidor em inicialização */
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  await mkdir(folder, { recursive: true });
  await mkdir(POSSE_FILES.reports, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const height of [980, 900]) {
      for (const delayed of [false, true]) {
        for (const version of ["live", "engine"]) {
          const context = await browser.newContext({ viewport: { width: 1440, height } });
          const page = await context.newPage();
          await trace(page);
          if (delayed) {
            const entry =
              version === "live" ? "**/dc-runtime.js" : "**/prototypes/posse/browser.mjs";
            await page.route(entry, async route => {
              await new Promise(resolve => setTimeout(resolve, 300));
              await route.continue();
            });
          }
          for (const reload of [false, true]) {
            if (reload) await page.reload({ waitUntil: "domcontentloaded" });
            else
              await page.goto(
                `http://127.0.0.1:${port}/${version === "live" ? POSSE_FILES.reference : POSSE_FILES.preview}`,
                {
                  waitUntil: "domcontentloaded",
                },
              );
            await page.waitForFunction(() => {
              const result = Reflect.get(window, "posseMotion");
              return result?.ready !== null && result.frames.at(-1)?.elapsed > 1200;
            });
            const result = await page.evaluate(() => Reflect.get(window, "posseMotion"));
            reports.push({ version, height, delayed, reload, ...result });
            if (!delayed && reload)
              await page.screenshot({
                path: `${folder}/${version}-${height}-${delayed ? "delayed" : "normal"}-${reload ? "reload" : "open"}.png`,
              });
            process.stdout.write(
              `${version} ${height} ${delayed ? "entrada atrasada" : "normal"} ${reload ? "F5" : "abertura"}: ${result.rawFrames} quadros de template visível, ${result.animations.length} animações.\n`,
            );
          }
          if (!delayed) await ministryMotion(page, version, height);
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
  await writeFile(
    `${POSSE_FILES.reports}/motion.json`,
    `${JSON.stringify({ scope: "Abertura e F5 nas duas resoluções, carga normal e atraso controlado de 300 ms na entrada; sem template cru visível e animação rise preservada. Transições de cerimônia, hover, ficha, passo, foto e retorno; ícone e ficha conservam identidade durante seleção e filtros.", reports, interactions }, null, 2)}\n`,
  );
  for (const report of reports) {
    assert.equal(
      report.rawFrames,
      0,
      `${report.version} ${report.height}: template nunca deve aparecer antes do runtime`,
    );
    assert.ok(
      report.animations.some(
        animation => animation.name === "rise" && animation.phase === "create",
      ),
    );
    assert.ok(
      report.frames.some(frame =>
        frame.rises.some(rise => Number(rise.opacity) > 0 && Number(rise.opacity) < 1),
      ),
      "a entrada precisa ter quadros intermediários",
    );
    assert.ok(
      report.frames.at(-1)?.rises.every(rise => rise.opacity === "1" && rise.transform === "none"),
      "a entrada termina estável",
    );
    const original = reports.find(
      other =>
        other.version === "live" &&
        other.height === report.height &&
        other.delayed === report.delayed &&
        other.reload === report.reload,
    );
    assert.ok(original);
    const recipe = (/** @type {MotionReport} */ item) =>
      item.frames[0]?.rises.map(({ target, name, duration, delay, easing }) => ({
        target,
        name,
        duration,
        delay,
        easing,
      }));
    assert.deepEqual(
      recipe(report),
      recipe(original),
      "mesmas curvas, durações e sequência do Claude",
    );
  }
  for (const interaction of interactions) {
    const original = interactions.find(
      other => other.version === "live" && other.height === interaction.height,
    );
    assert.ok(original);
    assert.deepEqual(
      interaction.recipes,
      original.recipes,
      "as transições e superfícies dos ministérios continuam as do Claude",
    );
  }
  process.stdout.write("Movimento de abertura e F5 preservado em 16 casos.\n");
} finally {
  server.kill();
}
