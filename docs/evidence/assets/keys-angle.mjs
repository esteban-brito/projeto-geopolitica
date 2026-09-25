/* Mede o teclado na imagem do telefone: centroides das 12 teclas claras (L > 150) na regiao do
   teclado, angulo das linhas e das colunas, e o quadro do numero. uso: node tmp/teclas-angulo.mjs */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
const browser = await chromium.launch({ headless: true }); const page = await browser.newPage(); await page.goto("about:blank");
const r = await page.evaluate(async src => {
  const bmp = await createImageBitmap(await (await fetch("data:image/webp;base64," + src)).blob());
  const W = bmp.width, H = bmp.height, cv = new OffscreenCanvas(W, H), cx = cv.getContext("2d"); cx.drawImage(bmp, 0, 0);
  const { data: d } = cx.getImageData(0, 0, W, H);
  const L = p => 0.2126 * d[p * 4] + 0.7152 * d[p * 4 + 1] + 0.0722 * d[p * 4 + 2];
  /* regiao do teclado: 40..75% x 38..80% */
  const x0 = Math.round(W * 0.40), x1 = Math.round(W * 0.75), y0 = Math.round(H * 0.38), y1 = Math.round(H * 0.80);
  const seen = new Uint8Array(W * H); const blobs = [];
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const p = y * W + x; if (seen[p] || d[p * 4 + 3] < 200 || L(p) < 150) continue;
    const stack = [p]; seen[p] = 1; let n = 0, sx = 0, sy = 0, mnx = W, mxx = 0, mny = H, mxy = 0;
    while (stack.length) { const q = stack.pop(); const qx = q % W, qy = (q - qx) / W; n++; sx += qx; sy += qy; if (qx < mnx) mnx = qx; if (qx > mxx) mxx = qx; if (qy < mny) mny = qy; if (qy > mxy) mxy = qy;
      for (const nq of [q - 1, q + 1, q - W, q + W]) { const nx = nq % W, ny = (nq - nx) / W; if (nx < x0 || nx >= x1 || ny < y0 || ny >= y1 || seen[nq] || d[nq * 4 + 3] < 200 || L(nq) < 150) continue; seen[nq] = 1; stack.push(nq); } }
    if (n > 150) blobs.push({ n, cx: sx / n, cy: sy / n, w: mxx - mnx + 1, h: mxy - mny + 1 });
  }
  blobs.sort((a, b) => a.cy - b.cy || a.cx - b.cx);
  return { W, H, blobs };
}, readFileSync("assets/phone.webp").toString("base64"));
console.log(r.W + "x" + r.H, r.blobs.length, "blobs");
for (const b of r.blobs) console.log(`  n=${b.n} centro (${b.cx.toFixed(1)}, ${b.cy.toFixed(1)}) caixa ${b.w}x${b.h}`);
/* linhas: agrupa por cy (passo ~55), ajusta reta por minimos quadrados */
const keys = r.blobs.filter(b => b.w < 60 && b.h < 60 && b.n > 400);
const rows = []; for (const k of keys) { const row = rows.find(rw => Math.abs(rw[0].cy - k.cy) < 25); if (row) row.push(k); else rows.push([k]); }
const fit = pts => { const n = pts.length, mx = pts.reduce((s, p) => s + p[0], 0) / n, my = pts.reduce((s, p) => s + p[1], 0) / n; let sxy = 0, sxx = 0; for (const [x, y] of pts) { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; } return Math.atan2(sxy, sxx) * 180 / Math.PI; };
for (const row of rows) if (row.length >= 2) console.log("linha y~" + row[0].cy.toFixed(0), "angulo", fit(row.map(k => [k.cx, k.cy])).toFixed(2) + "°");
const cols = []; for (const k of keys) { const col = cols.find(c => Math.abs(c[0].cx - k.cx) < 25); if (col) col.push(k); else cols.push([k]); }
for (const col of cols) if (col.length >= 2) console.log("coluna x~" + col[0].cx.toFixed(0), "angulo do eixo", (fit(col.map(k => [k.cy, k.cx]))).toFixed(2) + "° (0 = vertical)");
await browser.close();
