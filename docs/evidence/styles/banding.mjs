/* Quem e a banda clara a esquerda durante a troca Email → Gabinete: desliga um suspeito por vez e
   mede a luminancia media da faixa x 20..180, y 400..700 no meio da transicao (duracoes 8x). */
import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const suspeitos = {
  nada: "",
  "sem grupo rail": "::view-transition-group(rail){display:none!important}",
  "sem shell::before": ".shell::before{display:none!important}",
  "sem old(root)": "::view-transition-old(root){display:none!important}",
  "sem new(root)": "::view-transition-new(root){display:none!important}",
  "sem grupo board": "::view-transition-group(board){display:none!important}",
};
for (const [nome, css] of Object.entries(suspeitos)) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://127.0.0.1:5173/"); await page.waitForTimeout(800);
  await page.click('.rail [data-section="email"]'); await page.waitForTimeout(800);
  await page.addStyleTag({ content: ":root{--dur-screen:1760ms;--dur-menu:1600ms}" + css });
  await page.click('.rail [data-section="cabinet"]'); await page.waitForTimeout(2200);
  const png = (await page.screenshot({ clip: { x: 20, y: 400, width: 160, height: 300 } })).toString("base64");
  const L = await page.evaluate(async png => { const bmp = await createImageBitmap(await (await fetch("data:image/png;base64," + png)).blob()); const cv = new OffscreenCanvas(bmp.width, bmp.height), cx = cv.getContext("2d"); cx.drawImage(bmp, 0, 0); const d = cx.getImageData(0, 0, bmp.width, bmp.height).data; let s = 0; for (let p = 0; p < d.length; p += 4) s += 0.2126 * d[p] + 0.7152 * d[p + 1] + 0.0722 * d[p + 2]; return (s / (d.length / 4)).toFixed(1); }, png);
  console.log(nome.padEnd(20), "L media da faixa:", L);
  await page.close();
}
await browser.close();
