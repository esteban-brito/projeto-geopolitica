/* TRATA O TAMPO a partir da origem limpa (tmp/madeira2.png, 1916x821, ChatGPT): escala (1 ou 2),
   mascara de nitidez (raio, ganho), contraste local ("clareza": raio grande, ganho baixo) e
   poro sintetico: ruido esticado ao longo da fibra (tensor de estrutura), so escurecendo.
   uso: node tmp/assar-madeira.mjs saida.webp escala=1 nit=1,1.4 clar=12,0.35 poro=0.06,9 q=0.92 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const [saida, ...kv] = process.argv.slice(2);
const opt = Object.fromEntries(kv.map(s => s.split("=")));
const escala = Number(opt.escala ?? 1);
const [nitR, nitG] = (opt.nit ?? "0,0").split(",").map(Number);
const [claR, claG] = (opt.clar ?? "0,0").split(",").map(Number);
const [porA, porL] = (opt.poro ?? "0,0").split(",").map(Number);
const q = Number(opt.q ?? 0.92);
const src = readFileSync(opt.entrada ?? "tmp/madeira2.png").toString("base64");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto("about:blank");
const r = await page.evaluate(async ({ src, escala, nitR, nitG, claR, claG, porA, porL, q }) => {
  const bmp = await createImageBitmap(await (await fetch("data:image/png;base64," + src)).blob());
  const W = Math.round(bmp.width * escala), H = Math.round(bmp.height * escala);
  const cv = new OffscreenCanvas(W, H), cx = cv.getContext("2d");
  cx.imageSmoothingQuality = "high";
  cx.drawImage(bmp, 0, 0, W, H);
  const im = cx.getImageData(0, 0, W, H), d = im.data, N = W * H;
  /* TUDO AGE NA LUMINANCIA, e os canais seguem por razao: nitidez por canal tirava 2,3 pontos de
     croma (S 82,7 → 80,4, medido em tmp/madeira-medir.mjs), e a cor da madeira nao pode mudar. */
  const rgb = [0, 1, 2].map(c => { const a = new Float32Array(N); for (let p = 0; p < N; p++) a[p] = d[p * 4 + c]; return a; });
  const L0 = new Float32Array(N); for (let p = 0; p < N; p++) L0[p] = 0.2126 * rgb[0][p] + 0.7152 * rgb[1][p] + 0.0722 * rgb[2][p];
  const ch = [Float32Array.from(L0)];
  const boxBlur = (a, r) => {
    if (r <= 0) return a;
    const t = new Float32Array(N), o = new Float32Array(N);
    for (let y = 0; y < H; y++) { let s = 0, n = 0; const row = y * W;
      for (let x = -r; x <= r; x++) if (x >= 0 && x < W) { s += a[row + x]; n++; }
      for (let x = 0; x < W; x++) { t[row + x] = s / n; const xo = x - r, xi = x + r + 1; if (xo >= 0) { s -= a[row + xo]; n--; } if (xi < W) { s += a[row + xi]; n++; } } }
    for (let x = 0; x < W; x++) { let s = 0, n = 0;
      for (let y = -r; y <= r; y++) if (y >= 0 && y < H) { s += t[y * W + x]; n++; }
      for (let y = 0; y < H; y++) { o[y * W + x] = s / n; const yo = y - r, yi = y + r + 1; if (yo >= 0) { s -= t[yo * W + x]; n--; } if (yi < H) { s += t[yi * W + x]; n++; } } }
    return o;
  };
  /* 1. clareza: nitidez de raio grande, ganho baixo — traz o desenho da fibra */
  if (claG > 0) for (const a of ch) { const b = boxBlur(a, Math.round(claR)); for (let p = 0; p < N; p++) a[p] += claG * (a[p] - b[p]); }
  /* 2. poro: ruido esticado ao longo da fibra, escurecendo so */
  let poro = null;
  if (porA > 0) {
    const Ls = boxBlur(ch[0], 1);
    const gx = new Float32Array(N), gy = new Float32Array(N);
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const p = y * W + x; gx[p] = Ls[p + 1] - Ls[p - 1]; gy[p] = Ls[p + W] - Ls[p - W]; }
    const jxx = new Float32Array(N), jyy = new Float32Array(N), jxy = new Float32Array(N);
    for (let p = 0; p < N; p++) { jxx[p] = gx[p] * gx[p]; jyy[p] = gy[p] * gy[p]; jxy[p] = gx[p] * gy[p]; }
    const Jxx = boxBlur(jxx, 6), Jyy = boxBlur(jyy, 6), Jxy = boxBlur(jxy, 6);
    /* ruido branco, determinista */
    let seed = 1234567; const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const noise = new Float32Array(N); for (let p = 0; p < N; p++) noise[p] = rnd() - 0.5;
    poro = new Float32Array(N);
    const half = Math.floor(porL / 2);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const p = y * W + x;
      /* direcao do gradiente; a fibra e perpendicular a ela */
      const th = 0.5 * Math.atan2(2 * Jxy[p], Jxx[p] - Jyy[p]);
      const fx = -Math.sin(th), fy = Math.cos(th);
      let s = 0, n = 0;
      for (let k = -half; k <= half; k++) { const xx = Math.round(x + fx * k), yy = Math.round(y + fy * k); if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; s += noise[yy * W + xx]; n++; }
      poro[p] = s / n;
    }
    /* so o lado escuro, escalado: media de |ruido| ~ 0,1 depois da media de L amostras */
    for (let p = 0; p < N; p++) { const v = Math.max(0, poro[p]) * porA * Math.sqrt(porL) * 4; for (const a of ch) a[p] *= 1 - v; }
  }
  /* 3. nitidez fina */
  if (nitG > 0) for (const a of ch) { const b = boxBlur(a, Math.round(nitR)); for (let p = 0; p < N; p++) a[p] += nitG * (a[p] - b[p]); }
  /* ⛔ E A LUMINANCIA ENTRA SOMADA, e nao multiplicada: por razao (canal x L'/L) o croma medio
     caia 15% (73,2 → 62,3), porque o lado claro da aresta bate no teto do canal e o escuro nao.
     Somar a diferenca de L mantem R-Y, G-Y e B-Y, e o croma so muda onde um canal estoura. */
  /* 📐 E O PASSO PARA NA PAREDE DO GAMA: somando sem limite, G e B batem em 0 no lado escuro e R
     em 255 no claro, e o croma medio ainda caia 9% (70,1 → 63,9). Limitado ao canal mais
     proximo da parede, o croma fica por construcao; o que se perde e nitidez no quase-preto. */
  for (let p = 0; p < N; p++) {
    const r0 = rgb[0][p], g0 = rgb[1][p], b0 = rgb[2][p];
    const dl = Math.max(-Math.min(r0, g0, b0), Math.min(255 - Math.max(r0, g0, b0), ch[0][p] - L0[p]));
    for (let c = 0; c < 3; c++) d[p * 4 + c] = Math.max(0, Math.min(255, Math.round(rgb[c][p] + dl)));
  }
  cx.putImageData(im, 0, 0);
  const blob = await cv.convertToBlob(q >= 1 ? { type: "image/png" } : { type: "image/webp", quality: q });
  const buf = new Uint8Array(await blob.arrayBuffer());
  let s = ""; for (let i = 0; i < buf.length; i += 8192) s += String.fromCharCode.apply(null, buf.subarray(i, i + 8192));
  return { b64: btoa(s), W, H, bytes: buf.length };
}, { src, escala, nitR, nitG, claR, claG, porA, porL, q });
writeFileSync(saida, Buffer.from(r.b64, "base64"));
console.log(`${saida}: ${r.W}x${r.H}, ${(r.bytes / 1024).toFixed(0)} KB`);
await browser.close();
