// Assa a imagem gerada do telefone: node tmp/assar-fone.mjs <png-com-alfa> <saida-sem-extensao> [largura]
// Alfa normalizado (>= 230 vira 255), corte pela caixa da tinta, reducao, luz da sala, webp.
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
const [src, out, finalWidth = "720"] = process.argv.slice(2);
const browser = await chromium.launch({ headless: true }); const page = await browser.newPage();
const res = await page.evaluate(async ({ src, finalWidth }) => {
  const img = new Image(); img.src = src; await img.decode();
  const W = img.naturalWidth, H = img.naturalHeight;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true }); g.drawImage(img, 0, 0);
  const id = g.getImageData(0, 0, W, H); const d = id.data;
  const hist = {};
  for (let p = 0; p < W * H; p++) { const a = d[p * 4 + 3]; hist[a] = (hist[a] ?? 0) + 1; if (a >= 230) d[p * 4 + 3] = 255; else if (a < 12) d[p * 4 + 3] = 0; }
  // caixa da tinta
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let p = 0; p < W * H; p++) { if (d[p * 4 + 3] < 8) continue; const x = p % W, y = (p - x) / W; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  // A luz da sala: exposicao 0,95 e 1 → 0,88 de cima para baixo (a imagem ja vem fosca e sombreada)
  for (let p = 0; p < W * H; p++) { if (d[p * 4 + 3] === 0) continue; const x = p % W, y = (p - x) / W; const k = 0.95 * (1 - 0.12 * ((y - y0) / (y1 - y0))); d[p * 4] *= k; d[p * 4 + 1] *= k; d[p * 4 + 2] *= k; }
  g.putImageData(id, 0, 0);
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1; const s = Math.min(1, Number(finalWidth) / cw);
  const o = document.createElement("canvas"); o.width = Math.round(cw * s); o.height = Math.round(ch * s);
  const og = o.getContext("2d"); og.imageSmoothingQuality = "high"; og.drawImage(c, x0, y0, cw, ch, 0, 0, o.width, o.height);
  const top = Object.entries(hist).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return { W, H, box: [x0, y0, x1, y1], out: [o.width, o.height], alfas: top, png: o.toDataURL("image/png"), webp: o.toDataURL("image/webp", 0.9) };
}, { src: `data:image/png;base64,${readFileSync(src).toString("base64")}`, finalWidth });
writeFileSync(out + ".png", Buffer.from(res.png.split(",")[1], "base64"));
writeFileSync(out + ".webp", Buffer.from(res.webp.split(",")[1], "base64"));
console.log(JSON.stringify({ ...res, png: res.png.length, webp: res.webp.length }));
await browser.close();
