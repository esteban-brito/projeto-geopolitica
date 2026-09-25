/* ASSA O TELEFONE COM A NITIDEZ DO ENVELOPE E OS ALGARISMOS NA FOTO: 720px, UMA reamostragem so
   a partir do original (tmp/fone-chatgpt-2.png, 1323px), mascara de nitidez de raio 1 e ganho 1,4,
   e DEPOIS os 12 algarismos e o numero do cartao desenhados em Inter sobre as teclas medidas
   (tmp/teclas-angulo.mjs: colunas 350,5 / 411,4 / 473,4, linhas 300,2 / 355,1 / 411,3 / 467,2;
   angulo do teclado < 0,5 graus). Ordem dele em 18/09: os algarismos em DOM saiam "tortos" a
   9,5px girados 6 graus e nao vibravam com a foto no toque; na foto eles giram e vibram com ela.
   📐 Medido na mesa a 1920x937 (Sobel dentro do aparelho, tmp/fone-caminho.mjs), dpr 1 / dpr 2:
   sem nitidez 48,7 / 35,6; 720 g1,4 55,1 / 46,8; 840 g1,4 48,6 / 48,0; 720 g2 57,8 / 51,5 com
   halo de 23,2% contra 15,6% (tmp/fone-halo.mjs). Ficou 720 g1,4, q 0,90.
   uso: node tmp/assar-fone-tela.mjs [saida=tmp/fone-tela.webp] [largura=720] [ganho=1.4] */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const [saida = "tmp/fone-tela.webp", LARGURA = "720", GANHO = "1.4"] = process.argv.slice(2);
const RAIO = 1, QUALIDADE = 0.9;
const { UI } = await import("../src/ui/strings.mjs");
const NUMERO = UI.phone.number;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
const COLS = [350.5, 411.4, 473.4], ROWS = [300.2, 355.1, 411.3, 467.2];
const src = readFileSync("tmp/fone-chatgpt-2.png").toString("base64");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto("http://127.0.0.1:5173/");
await page.evaluate(() => document.fonts.load('600 16px "Inter"'));
const r = await page.evaluate(async ({ src, LARGURA, GANHO, RAIO, QUALIDADE, NUMERO, KEYS, COLS, ROWS }) => {
  const bmp = await createImageBitmap(await (await fetch("data:image/png;base64," + src)).blob());
  const W = bmp.width, H = bmp.height;
  const c = new OffscreenCanvas(W, H), g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(bmp, 0, 0);
  const id = g.getImageData(0, 0, W, H), d = id.data;
  for (let p = 0; p < W * H; p++) { const a = d[p * 4 + 3]; if (a >= 230) d[p * 4 + 3] = 255; else if (a < 12) d[p * 4 + 3] = 0; }
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let p = 0; p < W * H; p++) { if (d[p * 4 + 3] < 8) continue; const x = p % W, y = (p - x) / W; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  for (let p = 0; p < W * H; p++) { if (d[p * 4 + 3] === 0) continue; const x = p % W, y = (p - x) / W; const k = 0.95 * (1 - 0.12 * ((y - y0) / (y1 - y0))); d[p * 4] *= k; d[p * 4 + 1] *= k; d[p * 4 + 2] *= k; }
  g.putImageData(id, 0, 0);
  const cw = x1 - x0 + 1, ch = y1 - y0 + 1, s = Number(LARGURA) / cw;
  const ow = Math.round(cw * s), oh = Math.round(ch * s);
  const o = new OffscreenCanvas(ow, oh), og = o.getContext("2d");
  og.imageSmoothingQuality = "high";
  og.drawImage(c, x0, y0, cw, ch, 0, 0, ow, oh);
  const im = og.getImageData(0, 0, ow, oh), e = im.data;
  const blur = new Float32Array(ow * oh * 4);
  for (let y = 0; y < oh; y++) for (let x = 0; x < ow; x++) for (let k = 0; k < 3; k++) {
    let sum = 0, n = 0;
    for (let dy = -RAIO; dy <= RAIO; dy++) for (let dx = -RAIO; dx <= RAIO; dx++) {
      const xx = x + dx, yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= ow || yy >= oh) continue;
      sum += e[(yy * ow + xx) * 4 + k]; n++;
    }
    blur[(y * ow + x) * 4 + k] = sum / n;
  }
  for (let p = 0; p < ow * oh; p++) {
    if (e[p * 4 + 3] < 8) continue;
    for (let k = 0; k < 3; k++) { const i = p * 4 + k; e[i] = Math.max(0, Math.min(255, e[i] + Number(GANHO) * (e[i] - blur[i]))); }
  }
  og.putImageData(im, 0, 0);
  /* os algarismos: 9,5px a 420 → 16,3px a 720, peso 600; o asterisco a 16 → 27,4px e desce 4,5;
     o numero em peso 500 no centro do cartao (45,3–69,2% x 80,3–85,8%). Tinta --phone-print em
     multiply, como no CSS que saiu. */
  const k = ow / 420;
  og.globalCompositeOperation = "multiply";
  og.fillStyle = "#17191d";
  og.textAlign = "center"; og.textBaseline = "middle";
  KEYS.forEach((key, i) => {
    const cx0 = COLS[i % 3] * ow / 720, cy0 = ROWS[Math.floor(i / 3)] * oh / 639;
    if (key === "*") { og.font = `600 ${16 * k}px "Inter"`; og.fillText(key, cx0, cy0 + 2.6 * k); }
    else { og.font = `600 ${9.5 * k}px "Inter"`; og.fillText(key, cx0, cy0); }
  });
  og.font = `500 ${9.5 * k}px "Inter"`;
  og.letterSpacing = `${0.2 * k}px`;
  og.fillText(NUMERO, 0.573 * ow, 0.831 * oh);
  og.globalCompositeOperation = "source-over";
  const blob = await o.convertToBlob({ type: "image/webp", quality: QUALIDADE });
  const buf = new Uint8Array(await blob.arrayBuffer());
  let str = ""; for (const b of buf) str += String.fromCharCode(b);
  return { b64: btoa(str), box: [x0, y0, x1, y1], w: ow, h: oh, bytes: buf.length };
}, { src, LARGURA, GANHO, RAIO, QUALIDADE, NUMERO, KEYS, COLS, ROWS });
writeFileSync(saida, Buffer.from(r.b64, "base64"));
console.log(`${saida}: ${r.w}x${r.h}, ${(r.bytes / 1024).toFixed(0)} KB, caixa ${r.box}`);
await browser.close();
