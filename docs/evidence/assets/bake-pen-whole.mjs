/* A CANETA SEM PERDA: a imagem dele (tmp/caneta-origem.png, 2172x724, alfa), cortada pela caixa da
   tinta e NADA mais — WebP lossless na largura nativa (2023px). Ordem dele de 18/09: "QUERO 0 PERDA".
   uso: node tmp/assar-caneta-integra.mjs [saida=assets/pen.webp] [largura=nativa] */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
const [saida = "assets/pen.webp", largura = "0"] = process.argv.slice(2);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto("about:blank");
const src = readFileSync("tmp/caneta-origem.png").toString("base64");
const r = await page.evaluate(async ({ src, largura }) => {
  const bmp = await createImageBitmap(await (await fetch("data:image/png;base64," + src)).blob());
  const W0 = bmp.width, H0 = bmp.height;
  const c0 = new OffscreenCanvas(W0, H0), x0 = c0.getContext("2d"); x0.drawImage(bmp, 0, 0);
  const d0 = x0.getImageData(0, 0, W0, H0).data;
  let minX = W0, maxX = 0, minY = H0, maxY = 0;
  for (let y = 0; y < H0; y++) for (let x = 0; x < W0; x++) if (d0[(y * W0 + x) * 4 + 3] > 16) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  const cw = maxX - minX + 1, ch = maxY - minY + 1;
  const W = Number(largura) || cw, H = Math.round(ch * W / cw);
  const cv = new OffscreenCanvas(W, H), cx = cv.getContext("2d");
  cx.imageSmoothingQuality = "high";
  cx.drawImage(c0, minX, minY, cw, ch, 0, 0, W, H);
  const blob = await cv.convertToBlob({ type: "image/webp", quality: 1 });
  const buf = new Uint8Array(await blob.arrayBuffer());
  let s = ""; for (let i = 0; i < buf.length; i += 8192) s += String.fromCharCode.apply(null, buf.subarray(i, i + 8192));
  return { b64: btoa(s), W, H, bytes: buf.length };
}, { src, largura });
writeFileSync(saida, Buffer.from(r.b64, "base64"));
console.log(`${saida}: ${r.W}x${r.H}, ${(r.bytes / 1024).toFixed(0)} KB, lossless`);
await browser.close();
