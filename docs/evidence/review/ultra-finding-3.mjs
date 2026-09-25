/* Achado 3: durante `html:active-view-transition`, o .rail ainda tem lente inline? */
import { chromium } from "playwright";
const BASE = "http://127.0.0.1:5173";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 980 } });
await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });

const amostrar = alvo => page.evaluate(async alvo => {
  const rail = document.querySelector(".rail");
  const out = [];
  const t0 = performance.now();
  const item = [...document.querySelectorAll(".rail [data-section]")].find(b => (b.dataset.section ?? "") === alvo);
  if (!item) return { erro: "sem item " + alvo, itens: [...document.querySelectorAll(".rail [data-section]")].map(b => b.dataset.section) };
  item.click();
  for (let i = 0; i < 40; i++) {
    await new Promise(r => requestAnimationFrame(r));
    const cs = getComputedStyle(rail);
    out.push({
      t: Math.round(performance.now() - t0),
      vt: document.documentElement.matches(":active-view-transition"),
      flow: rail.dataset.flow,
      inline: rail.style.getPropertyValue("--glaze").slice(0, 12),
      bf: cs.backdropFilter.slice(0, 22),
    });
  }
  return out;
}, alvo);

const ida = await amostrar("estado");
if (ida.erro) { console.log(ida); await browser.close(); process.exit(1); }
console.log("gabinete -> estado (coluna):");
console.log(ida.filter(s => s.vt).map(s => `${s.t}ms vt flow=${s.flow} inline='${s.inline}' bf=${s.bf}`).slice(0, 4).join("\n") || "  (nenhum quadro com view transition ativa)");
const volta = await amostrar("cabinet");
console.log("estado -> gabinete (dock):");
const dur = volta.filter(s => s.vt);
console.log(dur.map(s => `${s.t}ms vt flow=${s.flow} inline='${s.inline}' bf=${s.bf}`).slice(0, 4).join("\n") || "  (nenhum quadro com view transition ativa)");
console.log(`quadros na transicao: ${dur.length}; com lente inline durante ela: ${dur.filter(s => s.inline.startsWith("url")).length}; backdrop-filter != none durante ela: ${dur.filter(s => s.bf !== "none").length}`);
await browser.close();
