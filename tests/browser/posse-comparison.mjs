import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { POSSE_FILES } from "../../prototypes/posse/paths.mjs";
import { COMPETENCIES } from "../../prototypes/government/competencies.mjs";
import { governmentViolations } from "../../prototypes/government/index.mjs";

/** @typedef {import("playwright").Page} Page */
/** @typedef {{ version: string, height: number, steps: string[], errors: string[], consoles: string[], requests: string[], checkpoints: Record<string, unknown> }} Report */

const port = "5206";
const folder = `${POSSE_FILES.captures}/comparison`;
const gameKeys = ["partida", "partida-recusada", "interface", "rascunho"];
/** @type {Report[]} */
const reports = [];
const server = spawn(process.execPath, ["tools/serve-static.mjs"], {
  env: { ...process.env, PORT: port },
  stdio: "ignore",
  windowsHide: true,
});

/** @param {Page} page */
async function settled(page) {
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        animation =>
          animation.effect?.getTiming().iterations === Infinity ||
          animation.playState === "finished" ||
          animation.playState === "idle",
      ),
  );
}

/** @param {Page} page @param {Report} report @param {string} name @param {() => Promise<unknown>} action */
async function gesture(page, report, name, action) {
  await action();
  assert.deepEqual(report.errors, [], `${report.version}: ${name}`);
  assert.deepEqual(report.consoles, [], `${report.version}: ${name}`);
  assert.deepEqual(report.requests, [], `${report.version}: ${name}`);
  assert.equal(await page.locator(".curtain.on").count(), 0, `gabinete após ${name}`);
  assert.equal(await page.locator(".dot").count(), 513);
  report.steps.push(name);
}

/** @param {Page} page */
async function geometry(page) {
  await settled(page);
  return page.evaluate(() => {
    const root = document.querySelector('[data-root="posse"]');
    if (!root) throw new Error("raiz ausente");
    const origin = root.getBoundingClientRect();
    const rect = (/** @type {Element} */ element) => {
      const box = element.getBoundingClientRect();
      return [box.x - origin.x, box.y - origin.y, box.width, box.height].map(
        value => Math.round(value * 10) / 10,
      );
    };
    return {
      root: [origin.width, origin.height].map(value => Math.round(value * 10) / 10),
      nodes: [...root.querySelectorAll("button.node")].map(element => ({
        id: element.getAttribute("data-seat"),
        rect: rect(element),
        icon: element.querySelector("path")?.getAttribute("d"),
      })),
      dots: [...root.querySelectorAll(".dot")].map(rect),
      panel: [...root.querySelectorAll(".panel:has(.step)")].map(rect),
    };
  });
}

/** @param {Page} page @param {string} withOffice */
async function proposeMerge(page, withOffice) {
  const panel = page.locator(".panel:has(.step)");
  await panel.getByRole("button", { name: new RegExp("^Juntar com outro ministério") }).click();
  const option = panel.getByRole("button", { name: withOffice, exact: true });
  if (!(await option.count()))
    await panel.getByRole("button", { name: "Ver todos os ministérios", exact: true }).click();
  await option.click();
  assert.equal(await panel.getByText("Qual nome fica?", { exact: true }).isVisible(), true);
}

/** @param {Page} page */
async function signMerge(page) {
  const panel = page.locator(".panel:has(.step)");
  const labels = await panel.locator(".scroll button .label").allTextContents();
  const name = labels.filter(label => label !== "Voltar").at(-1);
  assert.ok(name);
  await panel.getByRole("button", { name }).click();
}

/** @param {Page} page */
async function structure(page) {
  return page.evaluate(() => Reflect.get(globalThis, "PosseEngine")?.government ?? null);
}

try {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/${POSSE_FILES.reference}`)).ok) break;
    } catch {
      /* início do servidor */
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  await mkdir(folder, { recursive: true });
  await mkdir(POSSE_FILES.reports, { recursive: true });
  const original = (await readFile(POSSE_FILES.reference, "utf8")).replace(/\r\n/g, "\n");
  const engine = (await readFile(POSSE_FILES.preview, "utf8")).replace(/\r\n/g, "\n");
  const styles = (/** @type {string} */ html) =>
    [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(match => match[1]);
  assert.deepEqual(styles(engine), styles(original), "CSS deve ser exatamente o do Claude");
  const prelude = (/** @type {string} */ html) =>
    html.slice(
      html.indexOf('<script type="text/x-dc"'),
      html.indexOf("class Component extends DCLogic"),
    );
  let expected = prelude(original);
  for (const name of ["HIST", "DEST", "SPLIT", "PRE", "PARTNERS"]) {
    const pattern =
      name === "HIST"
        ? /^const HIST = \[[\s\S]*?^\];\n/m
        : new RegExp("^const " + name + " = [^\\n]*\\n", "m");
    assert.equal([...expected.matchAll(new RegExp(pattern.source, "gm"))].length, 1, name);
    expected = expected.replace(pattern, "");
    assert.equal(new RegExp("\\b" + name + "\\b").test(engine), false, `${name}: lógica retirada`);
  }
  expected = expected
    .replace(/^  noPrecedent:[^\n]*\n/m, "")
    .replace(/^  reaction:[^\n]*\n/m, "")
    .replace(" Existiu em 2018.", "")
    .replace(" Existiu até 2016.", "");
  assert.equal(
    prelude(engine),
    expected,
    "só as regras históricas e destinos fixos saem; dados, retratos e ícones preservados",
  );
  for (const text of [
    "Não há caso real parecido",
    "Quem depende deste ministério vai reagir",
    "T.noPrecedent",
    "pend.pre",
    "T.reaction",
  ])
    assert.equal(engine.includes(text), false, text);
  const browser = await chromium.launch({ headless: true });
  try {
    for (const height of [980, 900]) {
      const geometries = [];
      for (const version of ["live", "engine"]) {
        const context = await browser.newContext({ viewport: { width: 1440, height } });
        const page = await context.newPage();
        page.setDefaultTimeout(10000);
        /** @type {Report} */
        const report = {
          version,
          height,
          steps: [],
          errors: [],
          consoles: [],
          requests: [],
          checkpoints: {},
        };
        reports.push(report);
        page.on("pageerror", error => report.errors.push(error.message));
        page.on("console", message => {
          if (!["error", "warning"].includes(message.type())) return;
          const text = message.text();
          const template =
            text.includes("{{") &&
            (/^Error: <(?:path|svg)> attribute/.test(text) ||
              text.startsWith("The specified value"));
          const font = message.location().url.startsWith("https://fonts.googleapis.com/");
          if (!template && !font) report.consoles.push(text);
        });
        page.on("requestfailed", request => {
          if (request.url().startsWith("http://127.0.0.1:")) report.requests.push(request.url());
        });
        page.on("response", response => {
          if (response.url().startsWith("http://127.0.0.1:") && response.status() >= 400)
            report.requests.push(`${response.status()} ${response.url()}`);
        });
        try {
          await page.goto(
            `http://127.0.0.1:${port}/${version === "live" ? POSSE_FILES.reference : POSSE_FILES.preview}`,
          );
          await page.waitForSelector('[data-sex="f"]');
          assert.deepEqual(
            report.consoles,
            [],
            "o runtime captura exceções no console, além de pageerror",
          );
          await page.fill('[data-f="name"]', "Ana Souza");
          await page.click('[data-sex="f"]');
          assert.equal(await page.inputValue('[data-f="name"]'), "Ana Souza");
          await page.fill('[data-f="birth"]', "1995-04-12");
          await page.selectOption('[data-f="uf"]', "MG");
          await page.click('[data-party="mdn"]');
          await page.click('[data-path="politico"]');
          assert.equal(
            await page
              .locator('[data-act="swear"]')
              .evaluate(element => element.classList.contains("off")),
            true,
          );
          await page.fill('[data-f="birth"]', "1975-04-12");
          await page.click('[data-face="1"]');
          await page.screenshot({ path: `${folder}/${version}-create-${height}.png` });
          await page.click('[data-act="swear"]');
          await page.click('[data-act="skip"]');
          await page.waitForFunction(() => document.querySelectorAll(".curtain.on").length === 0);
          assert.equal(await page.locator("button.node").count(), 38);
          geometries.push(await geometry(page));
          const panel = page.locator(".panel:has(.step)");
          await gesture(page, report, "abrir e manter Saúde", async () => {
            await page.click('button.node[data-seat="saude"]');
            await panel.getByRole("button", { name: /^Manter/ }).click();
            assert.ok((await panel.locator("button.row").count()) >= 8);
          });
          await gesture(page, report, "filtros, ordenação, ficha e rolagem", async () => {
            for (const label of ["Outros", "Partidos", "Sugeridos", "Partidos"])
              await panel.locator(".seg").getByRole("button", { name: label, exact: true }).click();
            for (const label of ["Fama", "Preparo", "Afinidade", "Votos"]) {
              const button = panel
                .locator(".cols")
                .getByRole("button", { name: label, exact: true });
              await button.click();
              assert.equal(
                await button.evaluate(element => element.classList.contains("on")),
                true,
              );
              await button.click();
            }
            await panel.locator("button.row .name").first().hover();
            assert.equal(await page.locator("[data-card].on").count(), 1);
            await panel.locator("button.row").last().scrollIntoViewIfNeeded();
            await panel.locator("button.row").first().scrollIntoViewIfNeeded();
          });
          const keeper = await panel.locator("button.row .name").first().innerText();
          await gesture(page, report, "nomear, substituir e exonerar", async () => {
            await panel.locator("button.row").first().click();
            assert.ok(
              (
                await page.locator('button.node[data-seat="saude"]').getAttribute("aria-label")
              )?.includes(keeper),
            );
            const replacement = await panel.locator("button.row .name").nth(1).innerText();
            await panel.locator("button.row").nth(1).click();
            assert.ok(
              (
                await page.locator('button.node[data-seat="saude"]').getAttribute("aria-label")
              )?.includes(replacement),
            );
            await panel.getByRole("button", { name: "Exonerar", exact: true }).click();
            assert.ok(
              (
                await page.locator('button.node[data-seat="saude"]').getAttribute("aria-label")
              )?.includes("sem ministro"),
            );
            await panel.locator("button.row").first().click();
            await panel.getByRole("button", { name: "Próximo sem ministro", exact: true }).click();
            await page.click('button.node[data-seat="direitos"]');
            await panel.getByRole("button", { name: /^Manter/ }).click();
            await panel.locator("button.row").first().click();
          });
          const absorbed = await panel.locator(".holder .label").innerText();
          const opening = await structure(page);
          await gesture(
            page,
            report,
            "cancelar a junção sem alterar estrutura ou titulares",
            async () => {
              await page.click('button.node[data-seat="saude"]');
              await panel.getByRole("button", { name: "Voltar ao passo 1", exact: true }).click();
              await proposeMerge(page, "Direitos Humanos");
              await panel.getByRole("button", { name: "Voltar", exact: true }).click();
              assert.equal(await page.locator("button.node").count(), 38);
              assert.deepEqual(await structure(page), opening);
            },
          );
          await gesture(
            page,
            report,
            "juntar duas pastas mantendo um titular e liberando o outro",
            async () => {
              await proposeMerge(page, "Direitos Humanos");
              await signMerge(page);
              assert.equal(await page.locator("button.node").count(), 37);
              assert.equal(await page.locator('button.node[data-seat="direitos"]').count(), 0);
              assert.equal(await panel.locator(".holder .label").innerText(), keeper);
              const advisor = await page.locator('[data-root="posse"]').innerText();
              assert.ok(advisor.includes(absorbed));
              if (version === "engine") {
                const government = await structure(page);
                assert.deepEqual(governmentViolations(government), []);
                assert.deepEqual(government.inventory, opening.inventory);
                for (const work of COMPETENCIES)
                  assert.equal(
                    government.owner[work.id],
                    work.office === "direitos-humanos" ? "saude" : work.office,
                  );
                assert.ok(
                  (await panel.locator("button.row .gain").allTextContents()).every(
                    value => value === "—",
                  ),
                );
                assert.equal(
                  await page.evaluate(() => Reflect.get(globalThis, "PosseEngine").current.status),
                  "unknown",
                );
              }
              report.checkpoints.joined = await structure(page);
            },
          );
          await gesture(page, report, "encadear uma segunda junção", async () => {
            await panel.getByRole("button", { name: "Voltar ao passo 1", exact: true }).click();
            await proposeMerge(page, "Educação");
            await signMerge(page);
            assert.equal(await page.locator("button.node").count(), 36);
          });
          await page.screenshot({ path: `${folder}/${version}-joined-${height}.png` });
          await gesture(page, report, "desfazer pelo histórico e repetir a junção", async () => {
            await panel.getByRole("button", { name: "Voltar ao passo 1", exact: true }).click();
            await panel.getByRole("button", { name: new RegExp("^Desfazer a junção") }).click();
            assert.equal(await page.locator("button.node").count(), 38);
            if (version === "engine") {
              const government = await structure(page);
              assert.deepEqual(government.owner, opening.owner);
              assert.deepEqual(governmentViolations(government), []);
              assert.equal(
                await page.evaluate(() => Reflect.get(globalThis, "PosseEngine").current.status),
                "estimated",
              );
            }
            await proposeMerge(page, "Direitos Humanos");
            await signMerge(page);
            await panel.getByRole("button", { name: "Voltar ao passo 1", exact: true }).click();
            await panel.getByRole("button", { name: new RegExp("^Desfazer a junção") }).click();
            assert.equal(await page.locator("button.node").count(), 38);
          });
          await gesture(page, report, "extinguir e recriar pelo fluxo preservado", async () => {
            await page.click('button.node[data-seat="turismo"]');
            await panel.getByRole("button", { name: /^Extinguir/ }).click();
            if (version === "engine") {
              assert.equal(
                await panel
                  .getByRole("button", { name: /^Assinar/ })
                  .evaluate(element => element.classList.contains("off")),
                true,
              );
              await panel.getByRole("button", { name: "Mudar a divisão", exact: true }).click();
              await panel.getByRole("button", { name: "Tudo para um órgão", exact: true }).click();
              const search = panel.getByRole("textbox", { name: "Buscar nas atribuições" });
              await search.fill("segurança");
              await search.press("Tab");
              const choices = panel.locator(".scroll button .label");
              assert.deepEqual(
                (await choices.allTextContents()).sort(),
                ["Desenvolvimento Social", "Segurança Institucional", "Justiça", "Voltar"].sort(),
              );
              await search.fill("segurança e não alimentar");
              await search.press("Tab");
              assert.deepEqual(
                (await choices.allTextContents()).sort(),
                ["Segurança Institucional", "Justiça", "Voltar"].sort(),
              );
              await search.fill("segurança ou abracadabra");
              await search.press("Tab");
              assert.equal(await choices.count(), 1);
              assert.equal(
                await panel.getByText(new RegExp("Sem correspondência para")).isVisible(),
                true,
              );
              await search.fill("patrimônio");
              await search.press("Tab");
              await panel.getByRole("button", { name: /^Cultura\b/ }).click();
              assert.equal(
                await panel
                  .getByRole("button", { name: /^Assinar/ })
                  .evaluate(element => element.classList.contains("off")),
                false,
              );
              await page.screenshot({ path: `${folder}/${version}-destinations-${height}.png` });
              report.checkpoints.keywordSearch = {
                ambiguity: ["alimentar", "pública", "da informação"],
                negation: true,
                unknownPreserved: true,
                batchDestination: "cultura",
              };
            }
            await panel.getByRole("button", { name: /^Assinar/ }).click();
            assert.equal(await page.locator("button.node").count(), 37);
            if (version === "engine") {
              const government = await structure(page);
              assert.equal(
                government.owner[COMPETENCIES.find(work => work.office === "turismo")?.id ?? ""],
                "cultura",
              );
              assert.deepEqual(governmentViolations(government), []);
            }
            await panel.getByRole("button", { name: /^Recriar Turismo/ }).click();
            assert.equal(await page.locator("button.node").count(), 38);
            if (version === "engine")
              assert.deepEqual((await structure(page)).owner, opening.owner);
          });
          await gesture(
            page,
            report,
            "dividir e desistir da criação pelo fluxo preservado",
            async () => {
              await page.click('button.node[data-seat="justica"]');
              const back = panel.getByRole("button", { name: "Voltar ao passo 1", exact: true });
              if (await back.count()) await back.click();
              const beforeIds = new Set(
                await page
                  .locator("button.node")
                  .evaluateAll(nodes => nodes.map(node => node.getAttribute("data-seat"))),
              );
              const divide = panel.getByRole("button", { name: /^Dividir: criar/ }).first();
              await divide.click();
              assert.equal(await page.locator("button.node").count(), 39);
              const ids = await page
                .locator("button.node")
                .evaluateAll(nodes => nodes.map(node => node.getAttribute("data-seat")));
              const added = ids.find(id => id && !beforeIds.has(id));
              assert.ok(added);
              report.checkpoints.dividedIcon = await page
                .locator(`button.node[data-seat="${added}"] svg path`)
                .getAttribute("d");
              await page.locator(`button.node[data-seat="${added}"]`).click();
              await panel.getByRole("button", { name: "Voltar ao passo 1", exact: true }).click();
              await panel.getByRole("button", { name: /^Desistir de criar/ }).click();
              assert.equal(await page.locator("button.node").count(), 38);
            },
          );
          await page.click('[data-act="finish"]');
          await settled(page);
          assert.equal(await page.locator(".curtain.on").count(), 1);
          if (version === "engine") {
            const snapshot = await page.evaluate(
              () => Reflect.get(globalThis, "PosseEngine").snapshot,
            );
            assert.equal(snapshot.status, "estimated");
            assert.equal(Object.keys(snapshot.state.cabinet).length, 1);
            assert.equal(snapshot.state.president.name, "Ana Souza");
            report.checkpoints.snapshot = snapshot;
          }
          await page.screenshot({ path: `${folder}/${version}-photo-${height}.png` });
          await page.getByRole("button", { name: "Voltar à posse", exact: true }).click();
          if (version === "engine") {
            await gesture(
              page,
              report,
              "extinções encadeadas e recriação preservam transferências posteriores",
              async () => {
                const route = async (
                  /** @type {string} */ source,
                  /** @type {string} */ query,
                  /** @type {string} */ target,
                ) => {
                  await page.click(`button.node[data-seat="${source}"]`);
                  await panel.getByRole("button", { name: /^Extinguir/ }).click();
                  await panel.getByRole("button", { name: "Mudar a divisão", exact: true }).click();
                  await panel
                    .getByRole("button", { name: "Tudo para um órgão", exact: true })
                    .click();
                  const search = panel.getByRole("textbox", { name: "Buscar nas atribuições" });
                  await search.fill(query);
                  await search.press("Tab");
                  await panel
                    .getByRole("button", { name: new RegExp("^" + target + "(?:\\s|$)") })
                    .click();
                  await panel.getByRole("button", { name: /^Assinar/ }).click();
                };
                await route("turismo", "patrimônio", "Cultura");
                await route("cultura", "universidades", "Educação");
                assert.equal(await page.locator("button.node").count(), 36);
                const tourism = COMPETENCIES.filter(work => work.office === "turismo");
                let government = await structure(page);
                assert.deepEqual(governmentViolations(government), []);
                for (const work of tourism) assert.equal(government.owner[work.id], "educacao");
                await panel.getByRole("button", { name: /^Recriar Turismo/ }).click();
                assert.equal(await page.locator("button.node").count(), 37);
                assert.equal(
                  await panel
                    .getByText("Sem atribuições neste momento.", { exact: true })
                    .isVisible(),
                  true,
                );
                for (const work of tourism)
                  assert.equal((await structure(page)).owner[work.id], "educacao");
                await panel.getByRole("button", { name: /^Recriar Cultura/ }).click();
                assert.equal(await page.locator("button.node").count(), 38);
                government = await structure(page);
                assert.deepEqual(governmentViolations(government), []);
                for (const work of tourism) assert.equal(government.owner[work.id], "cultura");
                assert.equal(
                  await page.evaluate(() => Reflect.get(globalThis, "PosseEngine").current.status),
                  "unknown",
                );
                report.checkpoints.chainedAbolitions = government;
                await page.screenshot({ path: `${folder}/engine-chained-${height}.png` });
              },
            );
          }
          await page.evaluate(keys => {
            for (const key of keys)
              localStorage.setItem(`republica-simulator:${key}`, `preserved:${key}`);
            localStorage.setItem(
              "republica-posse-bridge-v1",
              '{"version":1,"state":{"phase":"photo"}}',
            );
          }, gameKeys);
          for (let reload = 0; reload < 2; reload++) {
            await page.reload();
            await page.waitForSelector('[data-sex="f"]');
            assert.equal(await page.inputValue('[data-f="name"]'), "");
            assert.equal(await page.locator("button.node").count(), 38);
            assert.equal(await page.locator("button.node .face.filled").count(), 0);
            if (version === "engine") {
              assert.equal(
                await page.evaluate(() => localStorage.getItem("republica-posse-bridge-v1")),
                null,
              );
              assert.equal(
                await page.evaluate(() => Reflect.get(globalThis, "PosseEngine").snapshot),
                null,
              );
            }
            for (const key of gameKeys)
              assert.equal(
                await page.evaluate(key => localStorage.getItem(`republica-simulator:${key}`), key),
                `preserved:${key}`,
              );
          }
          report.steps.push("foto, retorno, dois F5 e preservação do armazenamento principal");
          assert.deepEqual(report.errors, []);
          assert.deepEqual(report.consoles, []);
          assert.deepEqual(report.requests, []);
          process.stdout.write(
            `${version} 1440×${height}: ${report.steps.length} percursos passaram.\n`,
          );
        } catch (error) {
          await page.screenshot({
            path: `${folder}/${version}-failure-${height}.png`,
            fullPage: true,
          });
          await writeFile(
            `${folder}/failure.json`,
            JSON.stringify({ report, error: String(error) }, null, 2),
          );
          throw error;
        } finally {
          await context.close();
        }
      }
      assert.deepEqual(
        geometries[1],
        geometries[0],
        `hemiciclo, ícones, painel e 513 pontos preservados em ${height}`,
      );
      const pair = reports.filter(report => report.height === height);
      assert.equal(
        pair[1]?.checkpoints.dividedIcon,
        pair[0]?.checkpoints.dividedIcon,
        "o atalho de criação conserva o ícone do Claude",
      );
    }
  } finally {
    await browser.close();
  }
  await writeFile(
    `${POSSE_FILES.reports}/comparison.json`,
    `${JSON.stringify({ scope: "Comparação da cópia Claude com a ponte; CSS e catálogo visual preservados, descontadas apenas as tabelas históricas/destinos fixos e os textos retirados a pedido. Geometria, gestos, junções, busca, extinções encadeadas, recriação e F5. Juntar, desfazer, extinguir e recriar ministérios e os atalhos de criação usam o estado canônico. Reforma de órgão da Presidência conserva proposta e estrutura quando o vínculo institucional ainda não está modelado. Criação livre, renomeação e transferência têm prova específica em posse-reforms.mjs. Erros de template SVG/date na leitura inicial e a fonte externa indisponível são comuns às duas versões e registrados como limites.", cssSha256: createHash("sha256").update(styles(original).join("\n")).digest("hex"), reports }, null, 2)}\n`,
  );
} finally {
  server.kill();
}
