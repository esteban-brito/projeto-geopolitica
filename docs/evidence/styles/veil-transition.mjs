/* O VEU NA TROCA DE ABA: filma a saida do Gabinete quadro a quadro e mede a luminancia da
   FAIXA DO TOPO — se ela salta de um quadro para o outro, o veu nao acompanha a transicao. */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const browser = await chromium.launch({
  headless: false,
  args: ["--enable-gpu", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:5173/");
await page.waitForTimeout(1500);

const cdp = await page.context().newCDPSession(page);
const quadros = [];
cdp.on("Page.screencastFrame", async e => {
  quadros.push({ t: Date.now(), data: e.data });
  await cdp.send("Page.screencastFrameAck", { sessionId: e.sessionId }).catch(() => {});
});
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 70, everyNthFrame: 1 });
const t0 = Date.now();
await page.click(".rail__item[data-section='congress']");
await page.waitForTimeout(900);
await cdp.send("Page.stopScreencast");

/* A faixa do topo, onde o veu vive. */
const luz = await page.evaluate(async fotos => {
  const saida = [];
  for (const f of fotos) {
    const bmp = await createImageBitmap(await (await fetch("data:image/jpeg;base64," + f.data)).blob());
    const cv = new OffscreenCanvas(bmp.width, 60), cx = cv.getContext("2d");
    cx.drawImage(bmp, 0, 0);
    const { data: d } = cx.getImageData(0, 0, bmp.width, 60);
    let L = 0;
    for (let i = 0; i < d.length; i += 4) L += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
    saida.push(Number((L / (d.length / 4)).toFixed(1)));
  }
  return saida;
}, quadros.map(q => ({ data: q.data })));

console.log("quadro · ms desde o clique · luminancia da faixa do topo");
quadros.forEach((q, i) => console.log(`${String(i).padStart(3)} · ${String(q.t - t0).padStart(5)} · ${luz[i]}`));
let maiorSalto = 0, onde = 0;
for (let i = 1; i < luz.length; i++) {
  const d = Math.abs(luz[i] - luz[i - 1]);
  if (d > maiorSalto) { maiorSalto = d; onde = i; }
}
console.log(`\nmaior salto entre quadros vizinhos: ${maiorSalto.toFixed(1)} no quadro ${onde} (${quadros[onde].t - t0}ms)`);
writeFileSync("tmp/veu-quadros.json", JSON.stringify(luz));
await browser.close();
