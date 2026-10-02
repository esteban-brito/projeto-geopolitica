import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { POSSE_FILES } from "../../../prototypes/posse/paths.mjs";

/** @typedef {import("playwright").Page} Page */
/** @typedef {{version: string, height: number, reduced: boolean, party: unknown, keyboard: unknown, animations: unknown}} Report */
const port = "5209";
/** @type {Report[]} */
const reports = [];
const server = spawn(process.execPath, ["tools/serve-static.mjs"], {
  env: { ...process.env, PORT: port },
  stdio: "ignore",
  windowsHide: true,
});

/** @param {Page} page @param {string} phase */
async function inert(page, phase) {
  const entries = await page.locator('[data-root="posse"]').evaluate(root =>
    [...root.children].map(element => ({
      phase: element.getAttribute("data-phase"),
      curtain: element.classList.contains("curtain"),
      active: element.classList.contains("on"),
      inert: element instanceof HTMLElement && element.inert,
    })),
  );
  assert.ok(entries.length);
  for (const entry of entries)
    assert.equal(
      entry.inert,
      entry.curtain ? !entry.active : phase !== "posse",
      `${phase}: somente a tela ativa recebe foco`,
    );
}

/** @param {Page} page @param {import("playwright").Locator} button */
async function enter(page, button) {
  await button.focus();
  await page.keyboard.press("Enter");
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
  await mkdir(`${POSSE_FILES.captures}/controls`, { recursive: true });
  await mkdir(POSSE_FILES.reports, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const height of [980, 900]) {
      for (const reduced of [false, true]) {
        for (const version of ["live", "engine"]) {
          const context = await browser.newContext({
            viewport: { width: 1440, height },
            reducedMotion: reduced ? "reduce" : "no-preference",
          });
          const page = await context.newPage();
          await page.addInitScript(() => {
            /** @type {{target: string, timing: EffectTiming, frames: Keyframe[] | PropertyIndexedKeyframes | null}[]} */
            const animations = [];
            Reflect.set(window, "posseControlAnimations", animations);
            const animate = Element.prototype.animate;
            /** @this {Element} @param {Keyframe[] | PropertyIndexedKeyframes | null} frames @param {number | KeyframeAnimationOptions} [options] */
            Element.prototype.animate = function (frames, options) {
              const result = animate.call(this, frames, options);
              if (this.matches(".fly, .pulse"))
                animations.push({
                  target: this.className,
                  frames,
                  timing: result.effect?.getTiming() || {},
                });
              return result;
            };
          });
          await page.goto(
            `http://127.0.0.1:${port}/${version === "live" ? POSSE_FILES.reference : POSSE_FILES.preview}`,
          );
          await page.waitForSelector('.curtain.on[data-phase="create"]');
          await inert(page, "create");
          await page.locator('[data-party="mdn"]').focus();
          await page.waitForSelector("[data-pcard].on");
          const party = await page.locator("[data-pcard].on").evaluate(element => {
            const box = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return {
              box: [box.x, box.y, box.width, box.height],
              transition: style.transition,
              radius: style.borderRadius,
              filter: style.backdropFilter,
            };
          });
          const [x, y, width, cardHeight] = party.box;
          assert.ok(
            x !== undefined && y !== undefined && width !== undefined && cardHeight !== undefined,
          );
          assert.ok(x >= 0 && y >= 0 && x + width <= 1440 && y + cardHeight <= height);
          await page.keyboard.press("Tab");
          const keyboard = await page.evaluate(() => ({
            nextParty: document.activeElement?.getAttribute("data-party"),
            inActiveScreen: Boolean(
              document.activeElement?.closest('.curtain.on[data-phase="create"]'),
            ),
            focusOutline: document.activeElement
              ? getComputedStyle(document.activeElement).outline
              : null,
          }));
          assert.equal(keyboard.inActiveScreen, true);
          assert.ok(keyboard.nextParty);
          await page.fill('[data-f="name"]', "Ana Souza");
          await page.fill('[data-f="birth"]', "1975-04-12");
          await page.selectOption('[data-f="uf"]', "MG");
          await enter(page, page.locator('[data-party="mdn"]'));
          await enter(page, page.locator('[data-path="politico"]'));
          await enter(page, page.locator('[data-act="swear"]'));
          await page.waitForSelector('.curtain.on[data-phase="intro"]');
          await inert(page, "intro");
          await enter(page, page.locator('[data-act="skip"]'));
          await page.waitForFunction(() => !document.querySelector(".curtain.on"));
          await inert(page, "posse");
          await enter(page, page.locator('button.node[data-seat="saude"]'));
          const panel = page.locator(".panel:has(.step)");
          await enter(page, panel.getByRole("button", { name: /^Manter/ }));
          await enter(page, panel.locator("button.row").first());
          const animations = await page.evaluate(() =>
            Reflect.get(window, "posseControlAnimations"),
          );
          assert.equal(
            animations.length,
            reduced ? 0 : 2,
            "voo e pulso respeitam movimento reduzido",
          );
          if (!reduced) {
            assert.deepEqual(
              animations.map((/** @type {{target: string, timing: EffectTiming}} */ item) => ({
                target: item.target,
                duration: item.timing.duration,
                delay: item.timing.delay,
                easing: item.timing.easing,
              })),
              [
                {
                  target: "fly",
                  duration: 560,
                  delay: 0,
                  easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
                },
                {
                  target: "pulse",
                  duration: 520,
                  delay: 440,
                  easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
                },
              ],
            );
          }
          await page.waitForFunction(() => !document.querySelector(".fly, .pulse"));
          await enter(page, page.locator('[data-act="finish"]'));
          await page.waitForSelector('.curtain.on[data-phase="photo"]');
          await inert(page, "photo");
          if (!reduced)
            await page.screenshot({
              path: `${POSSE_FILES.captures}/controls/${version}-keyboard-${height}.png`,
            });
          await enter(page, page.getByRole("button", { name: "Voltar à posse", exact: true }));
          await inert(page, "posse");
          reports.push({ version, height, reduced, party, keyboard, animations });
          process.stdout.write(
            `${version} ${height} movimento ${reduced ? "reduzido" : "normal"}: teclado, foco, nomeação e retorno passaram.\n`,
          );
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
  for (const report of reports) {
    const original = reports.find(
      other =>
        other.version === "live" &&
        other.height === report.height &&
        other.reduced === report.reduced,
    );
    assert.ok(original);
    assert.deepEqual(
      report.party,
      original.party,
      "ficha partidária no foco preserva geometria e superfície",
    );
    assert.deepEqual(report.keyboard, original.keyboard, "tabulação e foco visível do Claude");
    assert.deepEqual(
      report.animations,
      original.animations,
      "voo e pulso conservam trajetórias, curvas, durações e atrasos",
    );
  }
  await writeFile(
    `${POSSE_FILES.reports}/controls.json`,
    JSON.stringify(
      {
        scope:
          "Oito percursos de teclado, ficha partidária no foco, isolamento da tela ativa, cerimônia, seleção, nomeação, keyframes do voo e pulso, foto e retorno; movimento normal e reduzido, duas versões, 1440×980/900.",
        reports,
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  server.kill();
}
