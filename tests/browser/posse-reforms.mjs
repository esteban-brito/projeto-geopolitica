import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { POSSE_FILES } from "../../prototypes/posse/paths.mjs";
import { governmentViolations } from "../../prototypes/government/index.mjs";

/** @typedef {import("playwright").Page} Page */
const port = "5208";
const folder = `${POSSE_FILES.captures}/reforms`;
const reports = [];
const server = spawn(process.execPath, ["tools/serve-static.mjs"], {
  env: { ...process.env, PORT: port },
  stdio: "ignore",
  windowsHide: true,
});

/** @param {Page} page */
async function government(page) {
  return page.evaluate(() => Reflect.get(window, "PosseEngine").government);
}

try {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/${POSSE_FILES.preview}`)).ok) break;
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
      const context = await browser.newContext({ viewport: { width: 1440, height } });
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      /** @type {string[]} */
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("console", message => {
        const text = message.text();
        const template =
          text.includes("{{") &&
          (/^Error: <(?:path|svg)> attribute/.test(text) || text.startsWith("The specified value"));
        if (
          message.type() === "error" &&
          !template &&
          !message.location().url.startsWith("https://fonts.googleapis.com/")
        )
          errors.push(text);
      });
      await page.goto(`http://127.0.0.1:${port}/${POSSE_FILES.preview}`);
      await page.fill('[data-f="name"]', "Ana Souza");
      await page.fill('[data-f="birth"]', "1975-04-12");
      await page.selectOption('[data-f="uf"]', "MG");
      await page.click('[data-party="mdn"]');
      await page.click('[data-path="politico"]');
      await page.click('[data-act="swear"]');
      await page.click('[data-act="skip"]');
      const opening = await government(page);
      assert.ok(opening);
      const panel = page.locator(".panel:has(.step)");
      const healthIcon = await page
        .locator('button.node[data-seat="saude"] svg path')
        .getAttribute("d");
      await page.click('button.node[data-seat="saude"]');
      await panel.getByRole("button", { name: /^Manter/ }).click();
      await panel.locator(".seg").getByRole("button", { name: "Partidos", exact: true }).click();
      const person = await panel.locator("button.row .name").first().innerText();
      await panel.locator("button.row").first().click();
      await panel.getByRole("button", { name: "Voltar ao passo 1", exact: true }).click();
      await panel.getByRole("button", { name: /^Criar outro minist/ }).click();
      await page.fill('[data-f="office-name"]', "Saúde Digital");
      await page.locator('[data-f="office-name"]').press("Tab");
      await page.fill('[data-f="destination-query"]', "SUS");
      await page.locator('[data-f="destination-query"]').press("Tab");
      const work = panel.locator(".scroll button").filter({ hasText: "SUS" }).first();
      assert.equal(await work.count(), 1);
      await work.click();
      await panel.getByRole("button", { name: "Criar ministério", exact: false }).click();
      assert.equal(await page.locator("button.node").count(), 39);
      const created = await government(page);
      assert.deepEqual(governmentViolations(created), []);
      const office = Object.values(created.offices).find(item => item.label === "Saúde Digital");
      assert.ok(office);
      assert.equal(
        await page.locator(`button.node[data-seat="${office.id}"] svg path`).getAttribute("d"),
        healthIcon,
        "a pasta criada reutiliza o ícone do perfil existente",
      );
      const selected = Object.keys(created.owner).filter(id => created.owner[id] === office.id);
      assert.equal(selected.length, 1);
      const workId = selected[0];
      assert.ok(workId);
      assert.deepEqual(created.inventory, opening.inventory);
      await page.click('button.node[data-seat="saude"]');
      assert.equal(await panel.locator(".holder .label").innerText(), person);
      await page.locator(`button.node[data-seat="${office.id}"]`).click();
      await panel.getByRole("button", { name: /^Renomear minist/ }).click();
      await page.fill('[data-f="office-name"]', "Centro Nacional de Serviços");
      await page.locator('[data-f="office-name"]').press("Tab");
      await panel.getByRole("button", { name: /^Confirmar nome/ }).click();
      const renamed = await government(page);
      assert.deepEqual(renamed.owner, created.owner);
      assert.equal(renamed.offices[office.id].label, "Centro Nacional de Serviços");
      await panel.getByRole("button", { name: /^Juntar com outro minist/ }).click();
      await panel.getByRole("button", { name: "Ver todos os ministérios", exact: true }).click();
      await panel.getByRole("button", { name: "Casa Civil", exact: true }).click();
      await panel
        .locator(".scroll button")
        .filter({ hasText: "Os dois nomes ficam juntos" })
        .click();
      assert.equal(
        await page.locator("button.node").count(),
        39,
        "a proposta institucional pendente conserva a estrutura",
      );
      assert.deepEqual((await government(page)).owner, renamed.owner);
      assert.equal(await panel.getByText("Qual nome fica?", { exact: true }).isVisible(), true);
      await panel.getByRole("button", { name: "Voltar", exact: true }).click();
      await panel.getByRole("button", { name: /^Manter/ }).click();
      await panel.locator(".seg").getByRole("button", { name: "Partidos", exact: true }).click();
      await panel.locator("button.row").first().click();
      assert.equal(await panel.locator(".holder .label").innerText(), person);
      await page.click('button.node[data-seat="saude"]');
      assert.equal(await panel.locator(".holder .label").innerText(), "Sem ministro");
      await page.locator(`button.node[data-seat="${office.id}"]`).click();
      await panel.getByRole("button", { name: "Voltar ao passo 1", exact: true }).click();
      await panel.getByRole("button", { name: /^Transferir atribui/ }).click();
      await panel.locator(".scroll button").filter({ hasText: "SUS" }).first().click();
      await panel.getByRole("button", { name: /^Escolher destino/ }).click();
      await page.fill('[data-f="destination-query"]', "educação básica");
      await page.locator('[data-f="destination-query"]').press("Tab");
      await panel.getByRole("button", { name: /^Educa/ }).click();
      await panel.getByRole("button", { name: /^Confirmar transfer/ }).click();
      const transferred = await government(page);
      assert.equal(transferred.owner[workId], "educacao");
      assert.equal(
        await panel.getByText("Sem atribuições neste momento.", { exact: true }).isVisible(),
        true,
      );
      await page.screenshot({ path: `${folder}/engine-empty-${height}.png` });
      await panel.getByRole("button", { name: /^Desistir de criar/ }).click();
      assert.equal(await page.locator("button.node").count(), 38);
      const canceled = await government(page);
      assert.equal(canceled.owner[workId], "educacao");
      assert.deepEqual(governmentViolations(canceled), []);
      assert.equal(
        await page.evaluate(() => Reflect.get(window, "PosseEngine").current.status),
        "unknown",
      );
      await page.click('[data-act="finish"]');
      assert.equal(
        await page.evaluate(() => Reflect.get(window, "PosseEngine").snapshot.status),
        "unknown",
      );
      await page.getByRole("button", { name: "Voltar à posse", exact: true }).click();
      await page.reload();
      await page.waitForSelector('[data-f="name"]');
      assert.equal(await page.inputValue('[data-f="name"]'), "");
      assert.deepEqual((await government(page)).owner, opening.owner);
      assert.deepEqual(errors, []);
      reports.push({
        height,
        office: office.id,
        work: workId,
        person,
        states: { created, renamed, transferred, canceled },
        errors,
      });
      await context.close();
      process.stdout.write(
        `Criação livre, nomeação, renomeação, transferência e cancelamento: 1440×${height} passaram.\n`,
      );
    }
  } finally {
    await browser.close();
  }
  await writeFile(
    `${POSSE_FILES.reports}/reforms.json`,
    `${JSON.stringify({ scope: "Gestos no runtime real para criação por ID, nome livre, remanejamento da mesma pessoa, transferência com busca, cancelamento conservando trabalho posterior, foto com apoio desconhecido e F5.", reports }, null, 2)}\n`,
  );
} finally {
  server.kill();
}
