/* DEFEITOS DO TESTE DE 01/10 — cada um reproduzido na tela antes do conserto.
   1: "Vai para Escolher destino." levava o rótulo do botão para dentro da frase;
   2: os destinos saíam na ordem do ID interno (Relações Exteriores entre Esporte e Fazenda);
   4: extinguir dizia "os partidos podem votar contra a medida", reação sem motor atrás;
   5: na criação de pasta, as atribuições apareciam em minúscula. */

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import { POSSE_FILES } from "../../../prototypes/posse/paths.mjs";

const port = "5209";
const server = spawn(process.execPath, ["tools/serve-static.mjs"], {
  env: { ...process.env, PORT: port },
  stdio: "ignore",
  windowsHide: true,
});

try {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/${POSSE_FILES.preview}`)).ok) break;
    } catch {
      /* servidor em inicialização */
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.setDefaultTimeout(10000);
    await page.goto(`http://127.0.0.1:${port}/${POSSE_FILES.preview}`);
    await page.fill('[data-f="name"]', "Ana Souza");
    await page.fill('[data-f="birth"]', "1975-04-12");
    await page.selectOption('[data-f="uf"]', "MG");
    await page.click('[data-party="mdn"]');
    await page.click('[data-path="politico"]');
    await page.click('[data-act="swear"]');
    await page.click('[data-act="skip"]');
    const panel = page.locator(".panel:has(.step)");

    await page.click('button.node[data-seat="turismo"]');
    await panel.getByRole("button", { name: /^Extinguir/ }).click();
    await panel.getByRole("button", { name: "Mudar a divisão", exact: true }).click();
    const parts = await panel.locator("button").allInnerTexts();
    assert.ok(
      parts.every(text => !text.includes("Vai para Escolher destino")),
      "defeito 1: o rótulo do botão entrou na frase",
    );

    await panel.getByRole("button", { name: /^Tudo para um / }).click();
    const names = (await panel.locator("button").allInnerTexts())
      .map(text => text.split("\n")[0]?.trim() ?? "")
      .filter(name => name && name !== "Voltar");
    const sorted = [...names].sort((a, b) => a.localeCompare(b, "pt-BR"));
    assert.deepEqual(names, sorted, "defeito 2: destinos fora da ordem alfabética");

    await panel
      .getByRole("button", { name: /^Cultura/ })
      .first()
      .click();
    await panel.getByRole("button", { name: /^Assinar/ }).click();
    const said = await page.locator("body").innerText();
    assert.ok(said.includes("Agora são 37 ministérios"), "a extinção não foi assinada");
    assert.ok(!said.includes("podem votar contra"), "defeito 4: reação sem motor atrás");

    await panel.getByRole("button", { name: /^Criar outro minist/ }).click();
    const lowercase = (await panel.locator("button").allInnerTexts())
      .map(text => text.split("\n")[0]?.trim() ?? "")
      .filter(text => /^\p{Ll}/u.test(text));
    assert.deepEqual(lowercase, [], "defeito 5: atribuição em minúscula");
    process.stdout.write("Posse: os quatro defeitos de 01/10 não se reproduzem.\n");
  } finally {
    await browser.close();
  }
} finally {
  server.kill();
}
