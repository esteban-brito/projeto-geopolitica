/* ASSA OS DOIS ENVELOPES NA LARGURA DE TELA: 392px = 196 CSS px a DPR 2, UMA reamostragem so a
   partir da origem limpa (1297px), e mascara de nitidez de raio 1 e ganho 1,4.
   📐 Medido na mesa (Sobel so dentro do envelope, tmp/envelope-caminho.mjs): o arquivo de 720px
   dava 32,2 a DPR 1 e 22,8 a DPR 2; este da 35,4 e 29,6. Ganho 1,0 dava 34,7 / 27,6; um
   arquivo de 178px so para DPR 1 dava os mesmos 35,4 e piorava DPR 2 (22,4) — nao vale image-set.
   uso: node tmp/assar-envelopes-tela.mjs */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const LARGURA = 392, GANHO = 1.4, RAIO = 1, QUALIDADE = 0.9;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto("about:blank");

for (const [entrada, saida] of [
  ["tmp/env-creme-limpo.webp", "assets/envelope.webp"],
  ["tmp/env-vermelho-limpo.webp", "assets/envelope-urgent.webp"],
]) {
  const src = readFileSync(entrada).toString("base64");
  const r = await page.evaluate(async ({ src, LARGURA, GANHO, RAIO, QUALIDADE }) => {
    const bmp = await createImageBitmap(await (await fetch("data:image/webp;base64," + src)).blob());
    const h = Math.round(bmp.height * LARGURA / bmp.width);
    const cv = new OffscreenCanvas(LARGURA, h);
    const cx = cv.getContext("2d");
    cx.imageSmoothingQuality = "high";
    cx.drawImage(bmp, 0, 0, LARGURA, h);
    const im = cx.getImageData(0, 0, LARGURA, h);
    const { width: W, height: H, data: d } = im;
    const blur = new Float32Array(W * H * 4);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) for (let c = 0; c < 3; c++) {
      let s = 0, n = 0;
      for (let dy = -RAIO; dy <= RAIO; dy++) for (let dx = -RAIO; dx <= RAIO; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
        s += d[(yy * W + xx) * 4 + c]; n++;
      }
      blur[(y * W + x) * 4 + c] = s / n;
    }
    /* so na tinta: a beira transparente nao ganha halo */
    for (let p = 0; p < W * H; p++) {
      if (d[p * 4 + 3] < 8) continue;
      for (let c = 0; c < 3; c++) {
        const i = p * 4 + c;
        d[i] = Math.max(0, Math.min(255, d[i] + GANHO * (d[i] - blur[i])));
      }
    }
    cx.putImageData(im, 0, 0);
    const blob = await cv.convertToBlob({ type: "image/webp", quality: QUALIDADE });
    const buf = new Uint8Array(await blob.arrayBuffer());
    let s = ""; for (const b of buf) s += String.fromCharCode(b);
    return { b64: btoa(s), w: W, h: H, bytes: buf.length };
  }, { src, LARGURA, GANHO, RAIO, QUALIDADE });
  writeFileSync(saida, Buffer.from(r.b64, "base64"));
  console.log(`${saida}: ${r.w}x${r.h}, ${(r.bytes / 1024).toFixed(0)} KB`);
}
await browser.close();
