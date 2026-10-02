import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { POSSE_FILES } from "../../../prototypes/posse/paths.mjs";

const port = "5205";
const server = spawn(process.execPath, ["tools/serve-static.mjs"], {
  env: { ...process.env, PORT: port },
  stdio: "ignore",
  windowsHide: true,
});
const evidence = [];
try {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/index.html`)).ok) break;
    } catch {
      /* servidor em inicialização */
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  await mkdir(POSSE_FILES.captures, { recursive: true });
  await mkdir(POSSE_FILES.reports, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const height of [980, 900]) {
      const context = await browser.newContext({ viewport: { width: 1440, height } });
      const page = await context.newPage();
      /** @type {string[]} */
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`http://127.0.0.1:${port}/${POSSE_FILES.preview}`);
      await page.waitForSelector('[data-f="name"]');
      const gameKeys = ["partida", "partida-recusada", "interface", "rascunho"];
      await page.evaluate(keys => {
        for (const key of keys)
          localStorage.setItem(`republica-simulator:${key}`, `preserved:${key}`);
      }, gameKeys);
      await page.fill('[data-f="name"]', "Ana Souza");
      await page.click('[data-sex="f"]');
      await page.fill('[data-f="birth"]', "1975-04-12");
      await page.selectOption('[data-f="uf"]', "MG");
      await page.click('[data-party="mdn"]');
      await page.click('[data-path="politico"]');
      await page.click('[data-face="1"]');
      await page.click('[data-act="swear"]');
      await page.click('[data-act="skip"]');
      await page.waitForSelector('button.node[data-seat="saude"]');
      await page.click('button.node[data-seat="saude"]');
      await page.getByRole("button", { name: /^Manter/ }).click();
      await page.locator(".seg button", { hasText: "Partidos" }).click();
      await page.locator("button.row").first().click();
      await page.waitForFunction(
        () => Reflect.get(globalThis, "PosseEngine").current?.status === "estimated",
      );
      const before = await page.evaluate(() => ({
        support: Reflect.get(globalThis, "PosseEngine").current,
      }));
      assert.equal(before.support.status, "estimated");
      await page.screenshot({
        path: `${POSSE_FILES.captures}/engine-${height}.png`,
        fullPage: true,
      });
      await page.click('[data-act="finish"]');
      await page.waitForFunction(() => Reflect.get(globalThis, "PosseEngine").snapshot !== null);
      const snapshot = await page.evaluate(() => Reflect.get(globalThis, "PosseEngine").snapshot);
      assert.equal(snapshot.status, "estimated");
      assert.equal(Object.keys(snapshot.state.cabinet).length, 1);
      assert.equal(snapshot.state.president.name, "Ana Souza");
      await page.evaluate(() => {
        if (!localStorage.getItem("republica-posse-bridge-v1")) {
          localStorage.setItem(
            "republica-posse-bridge-v1",
            JSON.stringify({
              version: 1,
              state: {
                pres: { name: "Sessão antiga", fem: false, party: "mdn" },
                picks: {},
                into: {},
                gone: {},
                created: [],
                phase: "photo",
              },
            }),
          );
        }
      });
      await page.reload();
      await page.waitForFunction(() => Boolean(Reflect.get(globalThis, "PosseEngine")?.current));
      assert.equal(
        await page.locator('[data-f="name"]').isVisible(),
        true,
        "F5 deve voltar à criação do Presidente",
      );
      assert.equal(await page.inputValue('[data-f="name"]'), "", "F5 deve limpar o nome anterior");
      const restarted = await page.evaluate(
        keys => ({
          snapshot: Reflect.get(globalThis, "PosseEngine").snapshot,
          support: Reflect.get(globalThis, "PosseEngine").current,
          oldDraft: localStorage.getItem("republica-posse-bridge-v1"),
          gameStorage: Object.fromEntries(
            keys.map(key => [key, localStorage.getItem(`republica-simulator:${key}`)]),
          ),
        }),
        gameKeys,
      );
      assert.equal(restarted.snapshot, null);
      assert.equal(restarted.support.status, "unknown");
      assert.equal(restarted.oldDraft, null);
      assert.deepEqual(
        restarted.gameStorage,
        Object.fromEntries(gameKeys.map(key => [key, `preserved:${key}`])),
      );
      await page.reload();
      await page.waitForSelector('[data-f="name"]');
      assert.equal(await page.inputValue('[data-f="name"]'), "");
      assert.deepEqual(errors, []);
      evidence.push({
        viewport: { width: 1440, height },
        status: "passed",
        support: before.support,
        state: snapshot.state,
        restarted,
        errors,
      });
      await context.close();
    }
  } finally {
    await browser.close();
  }
  await writeFile(
    `${POSSE_FILES.reports}/reset.json`,
    `${JSON.stringify({ scope: "Nomeação e captura mantidas; recarregar reinicia o protótipo mesmo com rascunho antigo, preservando o armazenamento do jogo principal.", cases: evidence }, null, 2)}\n`,
    "utf8",
  );
  process.stdout.write(
    "Posse: nomeação, captura, reinício ao recarregar e preservação dos saves passaram nas duas resoluções.\n",
  );
} finally {
  server.kill();
}
