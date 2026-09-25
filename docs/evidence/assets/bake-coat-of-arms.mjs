/* O BRASAO DA REPUBLICA no timbre: a imagem dele (tmp/brasao-origem.png, 1254x1254, alfa), cortada
   pela tinta e assada a 192px — 68px de layout na folha de 720, que sai a 44px na tela a dpr 1
   e 130 a dpr 3. Nitidez raio 1 ganho 0,8: as estrelas tem 2px. uso: node tmp/assar-brasao.mjs */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto("about:blank");
const src = readFileSync("tmp/brasao-origem.png").toString("base64");
const r = await page.evaluate(async src => {
  const bmp = await createImageBitmap(await (await fetch("data:image/png;base64," + src)).blob());
  const W0 = bmp.width, H0 = bmp.height;
  const c0 = new OffscreenCanvas(W0, H0); const x0 = c0.getContext("2d"); x0.drawImage(bmp, 0, 0);
  const d0 = x0.getImageData(0, 0, W0, H0).data;
  let minX = W0, maxX = 0, minY = H0, maxY = 0;
  for (let y = 0; y < H0; y++) for (let x = 0; x < W0; x++) if (d0[(y * W0 + x) * 4 + 3] > 16) {
    if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  const cw = maxX - minX + 1, ch = maxY - minY + 1;
  const W = 192, H = Math.round(ch * W / cw);
  const cv = new OffscreenCanvas(W, H); const cx = cv.getContext("2d");
  cx.imageSmoothingQuality = "high";
  cx.drawImage(c0, minX, minY, cw, ch, 0, 0, W, H);
  const im = cx.getImageData(0, 0, W, H); const d = im.data;
  const blur = new Float32Array(W * H * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) for (let c = 0; c < 3; c++) {
    let s = 0, n = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
      s += d[(yy * W + xx) * 4 + c]; n++;
    }
    blur[(y * W + x) * 4 + c] = s / n;
  }
  for (let p = 0; p < W * H; p++) { if (d[p * 4 + 3] < 8) continue; for (let c = 0; c < 3; c++) { const i = p * 4 + c; d[i] = Math.max(0, Math.min(255, d[i] + 0.8 * (d[i] - blur[i]))); } }
  cx.putImageData(im, 0, 0);
  const blob = await cv.convertToBlob({ type: "image/webp", quality: 0.92 });
  const buf = new Uint8Array(await blob.arrayBuffer());
  let s = ""; for (const b of buf) s += String.fromCharCode(b);
  return { b64: btoa(s), w: W, h: H, bytes: buf.length, tinta: [cw, ch] };
}, src);
writeFileSync("assets/brasao.webp", Buffer.from(r.b64, "base64"));
console.log(`assets/brasao.webp: ${r.w}x${r.h}, ${(r.bytes / 1024).toFixed(0)} KB, tinta ${r.tinta.join("x")}`);
await browser.close();
