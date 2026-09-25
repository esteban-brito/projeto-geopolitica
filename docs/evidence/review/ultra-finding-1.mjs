/* Achado 1: responder a carta aberta, e ver se a carta na mao troca. */
import { chromium } from "playwright";
const BASE = "http://127.0.0.1:5173";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 980 } });
page.on("pageerror", e => console.log("ERRO DE PAGINA:", e.message));
await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });

const lista = () => page.evaluate(() => [...document.querySelectorAll(".envelope[data-letter]")].map(e => ({
  i: e.dataset.letter, urgente: e.dataset.urgent ?? e.className.includes("urgent"),
  botoes: document.querySelector(`.post__sheet[data-letter="${e.dataset.letter}"] [data-letter][data-answer]`) !== null,
  id: document.querySelector(`.post__sheet[data-letter="${e.dataset.letter}"] [data-letter][data-answer]`)?.dataset.letter ?? null,
})));
const naMao = () => page.evaluate(() => {
  const sheet = document.querySelector(".post__sheet:not([hidden])");
  if (!sheet) return null;
  const b = sheet.querySelector("[data-letter][data-answer]");
  return { idx: sheet.dataset.letter, id: b?.dataset.letter ?? null, txt: sheet.textContent.trim().slice(0, 50) };
});

let l = await lista();
for (let m = 0; m < 44 && !(l.length >= 2 && l.some(x => x.botoes)); m++) {
  await page.click("#advance"); await page.waitForTimeout(600);
  l = await lista();
}
console.log("mes avancado; mesa:", l);
const alvo = l.find(x => x.botoes && x.i !== String(l.length - 1)) ?? l.find(x => x.botoes);
if (!alvo) { console.log("nenhuma carta com botao; nao da para reproduzir"); await browser.close(); process.exit(0); }
await page.click(`.envelope[data-letter="${alvo.i}"]`); await page.waitForTimeout(500);
const antes = await naMao();
console.log("na mao ANTES:", antes);
await page.locator(`.post__sheet[data-letter="${alvo.i}"] [data-letter][data-answer] >> nth=0`).click({ force: true });
await page.waitForTimeout(600);
console.log("mesa DEPOIS:", await lista());
const depois = await naMao();
console.log("na mao DEPOIS:", depois);
if (depois === null) console.log("→ a carta fechou ao responder");
else if (depois.id !== antes.id) console.log("⚠ ACHADO 1 CONFIRMADO: a carta na mao trocou de", antes.id, "para", depois.id);
else console.log("→ a mesma carta continua na mao (indice", depois.idx, ")");
await browser.close();
