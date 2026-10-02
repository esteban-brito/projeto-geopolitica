/* Reproduz os achados 1 e 2 do ultrareview: Esc depois de repintar, e a carta que troca de indice. */
import { chromium } from "playwright";
const BASE = "http://127.0.0.1:5173";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 980 } });
page.on("pageerror", e => console.log("ERRO DE PAGINA:", e.message));
await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });

const abertas = () => page.locator(".post__sheet:not([hidden])").count();
const ouvintes = () => page.evaluate(() => {
  /* conta quantos handlers de keydown o documento tem, por instrumentacao */
  return globalThis.__keydown ?? "sem instrumentacao";
});

/* ACHADO 2 — Esc depois de uma repintura do gabinete */
let n = await page.locator(".envelope[data-letter]").count();
console.log("envelopes na mesa:", n);
if (n === 0) {
  /* avanca ate aparecer carta */
  for (let i = 0; i < 6 && n === 0; i++) {
    await page.click("#advance"); await page.waitForTimeout(700);
    n = await page.locator(".envelope[data-letter]").count();
  }
  console.log("envelopes depois de avancar:", n);
}
await page.click(".envelope[data-letter] >> nth=0"); await page.waitForTimeout(500);
console.log("A. abriu:", await abertas());
await page.keyboard.press("Escape"); await page.waitForTimeout(450);
console.log("A. Esc antes de repintar -> abertas:", await abertas(), "(esperado 0)");

/* repinta o gabinete sem sair dele: marca uma area para proteger */
/* abre a pasta pela capa, como o passeio, e marca uma area */
await page.click(".folder__cover", { force: true }); await page.waitForTimeout(900);
const protect = page.locator(".act__folders [data-protect] >> nth=0");
await protect.click({ force: true }); await page.waitForTimeout(400);
console.log("repintou: aria-pressed =", await protect.getAttribute("aria-pressed"));

await page.click(".envelope[data-letter] >> nth=0"); await page.waitForTimeout(500);
console.log("B. abriu de novo:", await abertas());
await page.keyboard.press("Escape"); await page.waitForTimeout(450);
console.log("B. Esc DEPOIS de repintar -> abertas:", await abertas(), "(esperado 0; se 1, achado 2 confirmado)");

/* ACHADO 1 — responder a carta aberta e ver qual carta fica na mao */
await page.evaluate(() => document.querySelectorAll(".post__sheet").forEach(s => { s.hidden = true; }));
const info = () => page.evaluate(() => {
  const sheet = document.querySelector(".post__sheet:not([hidden])");
  if (!sheet) return null;
  const h = sheet.querySelector("h1,h2,h3,.letter__title,[class*=title]");
  return { idx: sheet.dataset.letter, titulo: (h?.textContent ?? sheet.textContent).trim().slice(0, 60) };
});
const lista = () => page.evaluate(() => [...document.querySelectorAll(".envelope[data-letter]")].map(e => e.dataset.letter + ":" + (e.getAttribute("aria-label") ?? e.textContent.trim()).slice(0, 40)));
console.log("lista antes:", await lista());
/* abre a ULTIMA carta (a mais provavel de mudar de posicao) */
const last = n - 1;
await page.click(`.envelope[data-letter="${last}"]`); await page.waitForTimeout(500);
const antes = await info();
console.log("C. na mao:", antes);
const botao = page.locator(`.post__sheet[data-letter="${last}"] [data-letter][data-answer] >> nth=0`);
console.log("C. botoes de resposta na folha:", await botao.count());
if (await botao.count()) {
  await botao.click(); await page.waitForTimeout(500);
  console.log("lista depois:", await lista());
  const depois = await info();
  console.log("C. na mao depois de responder:", depois);
  console.log(depois && antes && depois.titulo !== antes.titulo ? "⚠ ACHADO 1 CONFIRMADO: a carta na mao trocou" : "achado 1: a carta na mao e a mesma (ou fechou)");
}
await browser.close();
