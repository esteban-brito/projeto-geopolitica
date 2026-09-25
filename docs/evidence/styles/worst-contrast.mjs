/* CONTRASTE DE PIOR CASO NA BARRA NUA: sem a faixa de vidro, cada texto fica sobre o veio do
   jacarandá, que tem claro e escuro. A media esconde o defeito — aqui o fundo e medido com o
   TEXTO ESCONDIDO, e o que conta e o pixel mais claro debaixo dele. uso: node tmp/contraste-pior.mjs */
import { chromium } from "playwright";

const lum = ([r, g, b]) => {
  const f = v => { v /= 255; return v > 0.04045 ? ((v + 0.055) / 1.055) ** 2.4 : v / 12.92; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const razao = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);

const ALVOS = [
  [".topbar__name b:first-child", "REPUBLICA"],
  [".topbar__name b:last-child", "SIMULATOR"],
  [".topbar__seal", "brasao"],
  [".vit__label", "rotulo do indicador"],
  [".vit__value", "valor do indicador"],
  [".when__date", "mes"],
  [".when__note", "nota do mes"],
  [".go__label", "AVANCAR"],
  [".rail__item .rail__label", "dica do dock (so no hover)"],
];

const browser = await chromium.launch({ headless: true });
for (const [w, h] of [[1440, 900], [1920, 937]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:5173/");
  await page.waitForTimeout(1300);
  console.log(`\n## ${w}x${h}`);
  console.log("| texto | tinta | pior pixel do fundo | razao | AA |");
  console.log("|---|---|---|---|---|");
  for (const [sel, nome] of ALVOS) {
    const dados = await page.evaluate(s => {
      const node = document.querySelector(s);
      if (!node) return null;
      const r = node.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return null;
      const st = getComputedStyle(node);
      const cor = st.color.match(/\d+/g).slice(0, 3).map(Number);
      /* ⚠ A OPACIDADE ENTRA NA CONTA: tinta a 0,82 sobre madeira NAO e a tinta cheia, e ler so
         `color` superestimava o contraste em 1,7 ponto. O alfa do proprio `color` vai junto. */
      const alfa = Number(st.opacity) * (Number(st.color.match(/[\d.]+/g)[3] ?? 1) || 1);
      return { cor, alfa, x: Math.floor(r.left), y: Math.floor(r.top), w: Math.ceil(r.width), h: Math.ceil(r.height) };
    }, sel);
    if (!dados) { console.log(`| ${nome} | — | — | (nao encontrado) | |`); continue; }
    const tag = await page.addStyleTag({ content: `${sel}{visibility:hidden}` });
    await page.waitForTimeout(150);
    const png = (await page.screenshot({ clip: { x: dados.x, y: dados.y, width: dados.w, height: dados.h } })).toString("base64");
    await tag.evaluate(n => n.remove());
    const fundo = await page.evaluate(async b => {
      const bmp = await createImageBitmap(await (await fetch("data:image/png;base64," + b)).blob());
      const cv = new OffscreenCanvas(bmp.width, bmp.height), cx = cv.getContext("2d");
      cx.drawImage(bmp, 0, 0);
      const { data: d } = cx.getImageData(0, 0, bmp.width, bmp.height);
      let pior = [0, 0, 0], maior = -1;
      for (let i = 0; i < d.length; i += 4) {
        const L = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
        if (L > maior) { maior = L; pior = [d[i], d[i + 1], d[i + 2]]; }
      }
      return pior;
    }, png);
    const tinta = dados.cor.map((c, i) => Math.round(c * dados.alfa + fundo[i] * (1 - dados.alfa)));
    const r = razao(tinta, fundo);
    console.log(
      `| ${nome} | rgb(${dados.cor})${dados.alfa < 0.999 ? ` a ${dados.alfa.toFixed(2)}` : ""} | ` +
        `rgb(${fundo}) | ${r.toFixed(2)}:1 | ${r >= 4.5 ? "passa" : "⛔ REPROVA"} |`,
    );
  }
  await page.close();
}
await browser.close();
