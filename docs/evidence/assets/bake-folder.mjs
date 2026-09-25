/* Recorta o fundo branco das pastas geradas: enchente a partir da beira (o fundo e conectado,
   entao regiao clara DENTRO da peca — cantoneira, folha creme — sobrevive), alfa parcial na
   faixa de transicao e descontaminacao do branco que a borda herdou. */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const ALVOS = [
  { entrada: "tmp/pasta-v2.jpg", saida: "tmp/pasta-fechada.png", largura: 900 },
  { entrada: "tmp/pasta-aberta-v3.jpg", saida: "tmp/pasta-aberta3.png", largura: 1800 },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto("http://127.0.0.1:5173/index.html", { waitUntil: "networkidle" });

for (const alvo of ALVOS) {
  const b64 = readFileSync(alvo.entrada).toString("base64");
  const png = await page.evaluate(
    async ({ b64, largura, girar }) => {
      const img = new Image();
      img.src = "data:image/jpeg;base64," + b64;
      await img.decode();
      const W = img.naturalWidth, H = img.naturalHeight;
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      const g = c.getContext("2d", { willReadFrequently: true });
      g.drawImage(img, 0, 0);
      const im = g.getImageData(0, 0, W, H);
      const d = im.data;

      /* FUNDO = branco alcancavel pela beira. Limiar solto (230) na enchente e apertado
         (246) para o alfa cheio: entre os dois mora a borda suave do JPEG. */
      const FORA = 246, DENTRO = 215;
      const claro = p => {
        const i = p * 4;
        return Math.min(d[i], d[i + 1], d[i + 2]);
      };
      const fundo = new Uint8Array(W * H);
      const fila = [];
      for (let x = 0; x < W; x++) { fila.push(x, (H - 1) * W + x); }
      for (let y = 0; y < H; y++) { fila.push(y * W, y * W + W - 1); }
      while (fila.length) {
        const p = fila.pop();
        if (fundo[p] || claro(p) < DENTRO) continue;
        fundo[p] = 1;
        const x = p % W, y = (p / W) | 0;
        if (x > 0) fila.push(p - 1);
        if (x < W - 1) fila.push(p + 1);
        if (y > 0) fila.push(p - W);
        if (y < H - 1) fila.push(p + W);
      }

      /* ALFA: 0 no fundo cheio, 1 no que e claramente peca, rampa entre os dois limiares.
         Depois DESCONTAMINA — a borda herdou branco do fundo, e sem isso fica franja. */
      for (let p = 0; p < W * H; p++) {
        const i = p * 4;
        if (!fundo[p]) { d[i + 3] = 255; continue; }
        const v = claro(p);
        const a = v >= FORA ? 0 : Math.min(1, (FORA - v) / (FORA - DENTRO));
        d[i + 3] = Math.round(a * 255);
        if (a > 0.02 && a < 1) {
          for (let k = 0; k < 3; k++)
            d[i + k] = Math.max(0, Math.min(255, Math.round((d[i + k] - (1 - a) * 255) / a)));
        }
      }
      g.putImageData(im, 0, 0);

      /* corte no que sobrou de tinta */
      let minX = W, maxX = -1, minY = H, maxY = -1;
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          if (d[(y * W + x) * 4 + 3] > 16) {
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
          }
        }
      const cw = maxX - minX + 1, ch = maxY - minY + 1;
      const corte = document.createElement("canvas");
      corte.width = cw; corte.height = ch;
      corte.getContext("2d").drawImage(c, minX, minY, cw, ch, 0, 0, cw, ch);

      /* gira e reduz */
      const deitado = girar === 90;
      const escala = largura / (deitado ? ch : cw);
      const fim = document.createElement("canvas");
      fim.width = Math.round((deitado ? ch : cw) * escala);
      fim.height = Math.round((deitado ? cw : ch) * escala);
      const gf = fim.getContext("2d");
      gf.imageSmoothingQuality = "high";
      if (deitado) {
        gf.translate(fim.width, 0);
        gf.rotate(Math.PI / 2);
        gf.drawImage(corte, 0, 0, cw * escala, ch * escala);
      } else {
        gf.drawImage(corte, 0, 0, fim.width, fim.height);
      }
      return { dataUrl: fim.toDataURL("image/png"), w: fim.width, h: fim.height, cortou: [cw, ch] };
    },
    { b64, largura: alvo.largura, girar: alvo.girar ?? 0 },
  );
  writeFileSync(alvo.saida, Buffer.from(png.dataUrl.split(",")[1], "base64"));
  console.log(`${alvo.saida}: ${png.w}x${png.h} (tinta ${png.cortou.join("x")})`);
}
await browser.close();
