/* ONDE A LENTE VIRA CARA: o mesmo filtro em pecas de area crescente, com a tela trabalhando.
   uso: node tmp/lente-area.mjs */
import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: false,
  args: ["--enable-gpu", "--ignore-gpu-blocklist", "--enable-gpu-rasterization"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:5173/");
await page.waitForTimeout(1400);

/* Uma peca de prova sobre a mesa, do tamanho que se pede, vestida pelo mesmo glaze. */
await page.evaluate(() => {
  const d = document.createElement("div");
  d.id = "prova";
  d.style.cssText = "position:fixed;left:60px;top:120px;z-index:8;pointer-events:none";
  document.body.append(d);
  const carga = document.createElement("div");
  carga.style.cssText =
    "position:fixed;left:20%;top:40%;width:220px;height:220px;z-index:9;pointer-events:none;" +
    "background:linear-gradient(90deg,#7af,#fa7);border-radius:24px;animation:anda 1.4s linear infinite alternate";
  document.body.append(carga);
  const st = document.createElement("style");
  st.textContent = "@keyframes anda{from{transform:translateX(0)}to{transform:translateX(420px)}}";
  document.head.append(st);
});

const fps = (ms = 1600) =>
  page.evaluate(
    d =>
      new Promise(resolve => {
        let n = 0;
        const t0 = performance.now();
        const tick = () => {
          n++;
          if (performance.now() - t0 < d) requestAnimationFrame(tick);
          else resolve((n * 1000) / (performance.now() - t0));
        };
        requestAnimationFrame(tick);
      }),
    ms,
  );

await fps(1200); /* aquecimento */
console.log("| peca | area (px) | fps |");
console.log("|---|---|---|");
for (const [w, h] of [[389, 62], [400, 100], [420, 140], [450, 180], [560, 200], [600, 300]]) {
  await page.evaluate(async ({ w, h }) => {
    const g = await import("/src/ui/shared/glass.mjs");
    const node = document.querySelector("#prova");
    node.style.width = `${w}px`;
    node.style.height = `${h}px`;
    delete node.dataset.dressed;
    delete node.dataset.painted;
    document.querySelector(`svg[data-lens="${node.dataset.lens}"]`)?.remove();
    g.glaze(node, { body: g.STAGE_BODY, edge: g.STAGE_EDGE, r: 24, tint: g.STAGE_TINT });
    node.style.backdropFilter = node.style.getPropertyValue("--glaze");
    node.style.setProperty("-webkit-backdrop-filter", node.style.getPropertyValue("--glaze"));
  }, { w, h });
  await page.waitForTimeout(500);
  const v = await fps();
  console.log(`| ${w}x${h} | ${(w * h / 1000).toFixed(0)} mil | ${v.toFixed(1)} |`);
}
await browser.close();
