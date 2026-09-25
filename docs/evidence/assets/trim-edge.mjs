/* DESCONTAMINA A BEIRA: o fundo branco do estudio sangrou nas colunas de fora, e elas ficaram
   CINZA NEUTRO (253,253,253) contra o verde do couro (38,48,44). Corroi a alfa pelas colunas
   sujas e devolve a cor do couro vizinho, com rampa de 2px para a beira nao ficar serrilhada. */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

for (const alvo of [
  /* ⭐ LARGURA NATIVA DA TINTA, e o numero e de tela: a pasta NA MAO pede 2250px a 1920x1080
     com dpr 2, e o corte para 1600 entregava 1,41x de ampliacao — a nitidez media 60,9 de
     gradiente contra 94,0 do nativo. Qualidade 0,90 e o joelho: 0,94 custa +20% de byte para
     menos de 0,8% de gradiente. */
  { entrada: "tmp/nova-fechada.png", saida: "assets/folder-closed.webp", largura: 1434 },
  { entrada: "tmp/nova-aberta.png", saida: "assets/folder-open.webp", largura: 2196 },
]) {
  const b64 = readFileSync(alvo.entrada).toString("base64");
  const r = await page.evaluate(async ({ b64, largura }) => {
    const bmp = await createImageBitmap(await (await fetch("data:image/png;base64," + b64)).blob());
    const W = bmp.width, H = bmp.height;
    const cv = new OffscreenCanvas(W, H); const cx = cv.getContext("2d");
    cx.drawImage(bmp, 0, 0);
    const im = cx.getImageData(0, 0, W, H); const d = im.data;
    const A = p => d[p * 4 + 3];
    const L = p => 0.2126 * d[p*4] + 0.7152 * d[p*4+1] + 0.0722 * d[p*4+2];
    /* ⛔ E A REGRA E CIRURGICA, porque a alternativa ja custou: a primeira versao apagou 40.611
       px com beira de 41 — ela comia a cantoneira de latao e a beira de papel creme, que sao
       claras como a contaminacao. Tres condicoes juntas, e as tres tem numero:
       1. a linha SO e tratada se o primeiro pixel opaco dela for quase branco (L > 200) — onde
          o fundo nao sangrou, nada e tocado;
       2. o pixel tem de ser claro E neutro (croma < 22), e o PISO DE CLARO MUDA POR EIXO:
          70 nos lados, 160 no topo e no pe. ⛔ Com 70 no topo a varredura atravessava o REALCE
          do couro, que tambem e claro e dessaturado — p95 de 16px contra 2 com 160, e ate 7px
          comidos em 93 colunas, as piores na lombada. ⛔ E com 160 nos lados a franja cinza
          voltou: 1.295 das 1.386 linhas da fechada abriam em L > 120, contra 3 antes;
       3. teto de 12px de profundidade, medido — a rampa suja vai de L=253 a L=75 em 10 colunas. */
    const TETO = 12, BRANCO = 200, LADO = 70, TOPO = 160;
    const croma = p => { const i = p * 4; return Math.max(d[i], d[i+1], d[i+2]) - Math.min(d[i], d[i+1], d[i+2]); };
    const sujo = (p, piso) => L(p) > piso && croma(p) < 22;
    let maisFundo = 0;
    const marcar = new Uint8Array(W * H);
    const varrer = (pontos, piso) => {
      let i = 0;
      while (i < pontos.length && A(pontos[i]) < 8) i++;
      if (i >= pontos.length || L(pontos[i]) <= BRANCO) return;
      let n = 0;
      for (; i < pontos.length && n < TETO; i++, n++) {
        if (!sujo(pontos[i], piso)) break;
        marcar[pontos[i]] = 1;
      }
      if (n > maisFundo) maisFundo = n;
    };
    /* ⛔ E A VARREDURA COMECA NA TINTA, e nao na beira do ARQUIVO: a peca comeca a 179px da
       borda, e 60 passos a partir do zero morriam todos no transparente. */
    for (let y = 0; y < H; y++) {
      let e = 0; while (e < W && A(y * W + e) < 8) e++;
      let dd = W - 1; while (dd > 0 && A(y * W + dd) < 8) dd--;
      if (e >= dd) continue;
      varrer(Array.from({ length: 30 }, (_, k) => y * W + e + k), LADO);
      varrer(Array.from({ length: 30 }, (_, k) => y * W + dd - k), LADO);
    }
    for (let x = 0; x < W; x++) {
      let t = 0; while (t < H && A(t * W + x) < 8) t++;
      let b = H - 1; while (b > 0 && A(b * W + x) < 8) b--;
      if (t >= b) continue;
      varrer(Array.from({ length: 30 }, (_, k) => (t + k) * W + x), TOPO);
      varrer(Array.from({ length: 30 }, (_, k) => (b - k) * W + x), TOPO);
    }

    /* ⛔ E SOBRAVA UM FIO BRANCO NO PE DA CAPA, que a regra acima nao via: ela so COMECA se o
       primeiro pixel opaco for quase branco (L > 200), e ali ele media 142 a 198. Eram 851 das
       1.434 colunas, 2px de mediana e ate 5, a L=188 contra couro de 45.
       ⭐ O FIO SE RECONHECE PELO PRECIPICIO, e nao pelo brilho: ele e claro, NEUTRO e o couro
       atras dele cai para menos da metade em 1px. Latao e papel creme sao claros tambem, e
       escapam pelo croma — o latao tem 40+ e a beira de papel 34, contra 3 do fio. */
    const FIO_CLARO = 120, FIO_FUNDO = 90, FIO_TETO = 6, FIO_QUEDA = 0.45;
    const fio = pontos => {
      let i = 0;
      while (i < pontos.length && A(pontos[i]) < 8) i++;
      if (i >= pontos.length || L(pontos[i]) <= FIO_CLARO || croma(pontos[i]) >= 20) return;
      let n = 0, pico = 0;
      while (n < FIO_TETO && L(pontos[i + n]) > FIO_FUNDO && croma(pontos[i + n]) < 20) {
        pico = Math.max(pico, L(pontos[i + n]));
        n++;
      }
      if (n === 0 || n >= FIO_TETO) return;
      /* ⚠ O QUE ESTA ATRAS E A MEDIANA DE QUATRO, e nao o pixel seguinte: o primeiro depois do
         fio ainda e transicao — em x=247 ele media 87 contra 43 do couro, e sozinho reprovava
         o teste de precipicio que ele mesmo comprova. */
      const atras = [1, 2, 3, 4].map(k => L(pontos[i + n + k - 1])).sort((p, q) => p - q);
      if ((atras[1] + atras[2]) / 2 >= pico * FIO_QUEDA) return;
      for (let k = 0; k < n; k++) marcar[pontos[i + k]] = 1;
    };
    for (let y = 0; y < H; y++) {
      let e = 0; while (e < W && A(y * W + e) < 8) e++;
      let dd = W - 1; while (dd > 0 && A(y * W + dd) < 8) dd--;
      if (e >= dd) continue;
      fio(Array.from({ length: 12 }, (_, k) => y * W + e + k));
      fio(Array.from({ length: 12 }, (_, k) => y * W + dd - k));
    }
    for (let x = 0; x < W; x++) {
      let t = 0; while (t < H && A(t * W + x) < 8) t++;
      let b = H - 1; while (b > 0 && A(b * W + x) < 8) b--;
      if (t >= b) continue;
      fio(Array.from({ length: 12 }, (_, k) => (t + k) * W + x));
      fio(Array.from({ length: 12 }, (_, k) => (b - k) * W + x));
    }

    /* Apaga o que foi marcado, e amolece 1px para a beira nao serrilhar. */
    let apagados = 0;
    for (let p = 0; p < W * H; p++) if (marcar[p]) { d[p*4+3] = 0; apagados++; }
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const p = y * W + x;
      if (d[p*4+3] !== 255) continue;
      const vizinhos = [p-1, p+1, p-W, p+W];
      if (vizinhos.some(v => d[v*4+3] === 0)) d[p*4+3] = 150;
    }
    cx.putImageData(im, 0, 0);
    /* corta pela tinta e reduz */
    let minX = W, maxX = -1, minY = H, maxY = -1;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (d[(y*W+x)*4+3] > 16) {
      if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
    const cw = maxX - minX + 1, ch = maxY - minY + 1, esc = largura / cw;
    const fim = new OffscreenCanvas(Math.round(cw * esc), Math.round(ch * esc));
    const gf = fim.getContext("2d");
    gf.imageSmoothingQuality = "high";
    gf.drawImage(cv, minX, minY, cw, ch, 0, 0, fim.width, fim.height);
    const blob = await fim.convertToBlob({ type: "image/webp", quality: 0.9 });
    const buf = new Uint8Array(await blob.arrayBuffer());
    let s = ""; for (const b of buf) s += String.fromCharCode(b);
    return { b64: btoa(s), w: fim.width, h: fim.height, apagados, maisFundo, tinta: [cw, ch] };
  }, { b64, largura: alvo.largura });
  writeFileSync(alvo.saida, Buffer.from(r.b64, "base64"));
  console.log(`${alvo.saida}: ${r.w}x${r.h} | ${r.apagados} px sujos apagados | pior beira ${r.maisFundo}px | tinta ${r.tinta.join("x")}`);
}
await browser.close();
