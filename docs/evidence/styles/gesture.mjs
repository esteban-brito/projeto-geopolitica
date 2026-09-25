import { chromium } from "playwright";
const browser = await chromium.launch({ headless: false, args: ["--window-size=1440,1000", "--window-position=2000,0"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:5173/");
await page.waitForTimeout(800);
if (await page.locator("#swearDialog[open]").count()) {
  await page.fill("#swearName", "Teste"); await page.selectOption("#swearParty", { index: 1 }); await page.click("#swearOk"); await page.waitForTimeout(700);
}
const item = page.locator('.rail__item[data-section="finance"]');
const box = await item.boundingBox();
const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
const sample = (label, ms) => page.evaluate(async ({ label, ms }) => {
  const el = document.querySelector('.rail__item[data-section="finance"]');
  const out = []; const t0 = performance.now(); let last = "";
  await new Promise(done => { const tick = () => {
    const m = new DOMMatrix(getComputedStyle(el).transform); const s = m.a.toFixed(4);
    if (s !== last) { out.push(`${Math.round(performance.now() - t0)}:${s}`); last = s; }
    if (performance.now() - t0 < ms) requestAnimationFrame(tick); else done(); }; requestAnimationFrame(tick); });
  return label + " " + out.filter((_, i) => i % 3 === 0 || i === out.length - 1).join(" ");
}, { label, ms });
await page.evaluate(() => document.addEventListener("click", e => e.stopPropagation(), true));
await page.mouse.move(cx, cy);
console.log(await sample("pousar", 500));
await page.mouse.down();
console.log(await sample("premir", 300));
await page.mouse.up();
console.log(await sample("soltar", 900));
await browser.close();
