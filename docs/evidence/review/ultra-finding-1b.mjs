/* Achado 1, caso (a): carta aberta na mao, avanca o mes. A carta na mao deve ser a mesma ou nenhuma. */
import { chromium } from "playwright";
const BASE = "http://127.0.0.1:5173";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 980 } });
page.on("pageerror", e => console.log("ERRO DE PAGINA:", e.message));
await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
const naMao = () => page.evaluate(() => {
  const sheet = document.querySelector(".post__sheet:not([hidden])");
  if (!sheet) return null;
  return { idx: sheet.dataset.letter, txt: sheet.textContent.replace(/\s+/g, " ").trim().slice(0, 70) };
});
const envelopes = () => page.locator(".envelope[data-letter]").count();
let trocou = 0, mesmo = 0, fechou = 0;
for (let m = 0; m < 40; m++) {
  const n = await envelopes();
  if (n === 0) { await page.click("#advance"); await page.waitForTimeout(500); continue; }
  await page.dispatchEvent(`.envelope[data-letter="0"]`, "click"); await page.waitForTimeout(450);
  const antes = await naMao();
  await page.click("#advance"); await page.waitForTimeout(600);
  const depois = await naMao();
  if (depois === null) fechou++;
  else if (antes && depois.txt === antes.txt) mesmo++;
  else { trocou++; console.log(`mes ${m}: ANTES "${antes?.txt}"\n         DEPOIS "${depois.txt}"`); }
  await page.keyboard.press("Escape"); await page.waitForTimeout(400);
  await page.evaluate(() => document.querySelectorAll(".post__sheet").forEach(s => { s.hidden = true; }));
}
console.log({ trocou, mesmo, fechou });
await browser.close();
