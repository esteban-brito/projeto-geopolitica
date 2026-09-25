/* O pisca laranja: quadros do compositor no Chrome dele (GPU) na volta ao Gabinete, com uma
   variante de CSS injetada antes. Diz quantos quadros tem a faixa da coluna mais clara que o
   vizinho (> 8 de L) e quando o primeiro aparece. uso: node tmp/screencast-variantes.mjs */
import { chromium } from "playwright";
const variantes = { "como esta (regra no repositorio)": "" };
for (const [nome, css] of Object.entries(variantes)) {
  const browser = await chromium.launch({ headless: false, channel: "chrome", args: ["--window-size=1600,1000"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://127.0.0.1:5173/"); await page.waitForTimeout(1000);
  if (css) await page.addStyleTag({ content: css });
  await page.click('.rail [data-section="email"]'); await page.waitForFunction(() => document.activeViewTransition === null); await page.waitForTimeout(500);
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on("Page.screencastFrame", async f => { frames.push({ t: f.metadata.timestamp, data: f.data }); await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); });
  await cdp.send("Page.startScreencast", { format: "png", everyNthFrame: 1, maxWidth: 1440, maxHeight: 900 });
  await page.waitForTimeout(150);
  await page.click('.rail [data-section="cabinet"]');
  await page.waitForTimeout(1000);
  await cdp.send("Page.stopScreencast");
  const rows = await page.evaluate(async frames => {
    const out = [];
    for (const f of frames) {
      const bmp = await createImageBitmap(await (await fetch("data:image/png;base64," + f)).blob());
      const cv = new OffscreenCanvas(bmp.width, bmp.height), cx = cv.getContext("2d"); cx.drawImage(bmp, 0, 0);
      const d = cx.getImageData(0, 0, bmp.width, bmp.height).data;
      /* aresta media (grao da madeira): a coluna fantasma e vidro desfocado, sem grao */
      const E = (x0, x1) => { let s = 0, n = 0; for (let y = 110; y < 420; y += 2) for (let x = x0; x < x1 - 1; x += 2) { const p = (y * bmp.width + x) * 4; s += Math.abs(d[p] - d[p + 4]); n++; } return s / n; };
      const faixa = E(24, 190), viz = E(240, 406);
      out.push(viz > 2.5 && faixa < viz * 0.25 ? viz - faixa : 0);
    }
    return out;
  }, frames.map(f => f.data));
  const t0 = frames[0]?.t ?? 0;
  const claros = rows.map((d, i) => [d, i]).filter(([d]) => d > 0);
  console.log(nome.padEnd(30), `quadros ${rows.length} · claros ${claros.length}` + (claros.length ? ` · primeiro a ${((frames[claros[0][1]].t - t0) * 1000).toFixed(0)}ms, sem grao em ${claros.length} quadros` : ""));
  await browser.close();
}
