/* A AURORA — o substrato do vidro.
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE UM SUBSTRATO EXISTE. Vidro nao lê como material sobre fundo liso: o
   olho separa vidro de plastico fosco pela diferenca entre a coisa NITIDA e a
   mesma coisa BORRADA. Sem estrutura atras, `backdrop-filter` custa GPU e nao
   entrega imagem. O substrato e requisito do material, nao acabamento — e essa
   frase e a razao de este arquivo existir, herdada do grafo que ele substitui.

   E POR QUE ELE TEM DUAS CAMADAS, e nao so as manchas de luz:

     · CAMPO — elipses largas e muito borradas. Elas dao LUMINANCIA e MATIZ
       variando pela tela, que e o que o gel de situacao precisa para modular:
       `mix-blend-mode: overlay` multiplica no escuro e clareia no claro, entao
       sobre um fundo de luminancia uniforme ele nao tem o que fazer, e era por
       isso que a situacao do pais quase nao aparecia;
     · GRAO — ruido fino por cima do campo. Ele existe PORQUE o campo e liso:
       gradiente suave desfocado continua sendo o mesmo gradiente suave, e a
       diferenca entre nitido e borrado — a unica coisa que faz o olho ler vidro
       — seria zero. O grao e o detalhe de alta frequencia que o desfoque APAGA,
       e e apagando algo que a lamina prova que existe.

   ESTATICO, e isso e decisao e nao economia. `backdrop-filter` sobre fundo EM
   MOVIMENTO obriga o compositor a reamostrar o que esta atras a cada quadro — a
   condicao exata que derrubou uma tela para 31 fps no projeto anterior. O
   passeio da luz que existe no projeto move o ANGULO do gradiente das laminas,
   que e outra coisa: ele nao mexe no que esta atras delas.

   A COR NAO MORA AQUI. As classes saem daqui e os valores saem do arquivo de
   tokens, como no substrato anterior — `tests/guards/tokens.mjs` recusa cor
   literal fora de la, e a aurora e feita das cores que ja tem papel declarado.
   Ambar fica de fora de proposito: a marca e a cor do que se PRESSIONA, e
   gasta-la no fundo enfraqueceria o unico lugar onde ela precisa funcionar sem
   concorrencia. */

/**
 * Manchas do campo. Posicao e raio em coordenadas do `viewBox`, e a lista e
 * deliberadamente CURTA: aurora e poucas fontes de luz grandes: muitas manchas
 * pequenas viram textura colorida, que e outro efeito.
 *
 * @type {ReadonlyArray<{ cx: number, cy: number, rx: number, ry: number, tone: string }>}
 */
const FIELD = [
  { cx: 180, cy: 140, rx: 380, ry: 300, tone: "cool" },
  { cx: 830, cy: 210, rx: 330, ry: 280, tone: "light" },
  { cx: 700, cy: 620, rx: 430, ry: 320, tone: "cool" },
  /* `counter` e o papel: a mancha que QUEBRA a monocromia, para o vidro ter
     matiz a refratar e nao so claro e escuro. O nome nao diz a cor de proposito
     — os papeis e que sao fechados neste projeto, e a cor que os serve pode
     mudar sem que a estrutura mude junto. */
  { cx: 300, cy: 560, rx: 300, ry: 240, tone: "counter" },
];

/**
 * @returns {string} markup SVG completo do substrato
 */
export function auroraSvg() {
  const blobs = FIELD.map(
    blob =>
      `<ellipse class="aurora__blob" data-tone="${blob.tone}" ` +
      `cx="${blob.cx}" cy="${blob.cy}" rx="${blob.rx}" ry="${blob.ry}"/>`,
  ).join("");

  return (
    `<svg class="aurora" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" ` +
    `xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">` +
    `<defs>` +
    /* A regiao do filtro precisa ser declarada: o padrao e 110% da caixa, e um
       desvio de 90 vaza MUITO alem disso — a mancha sairia com a borda cortada
       reta, que e o oposto de aurora. */
    `<filter id="aurora-soft" x="-60%" y="-60%" width="220%" height="220%">` +
    `<feGaussianBlur stdDeviation="90"/>` +
    `</filter>` +
    /* `fractalNoise` e nao `turbulence`: o primeiro distribui em torno do cinza
       medio e serve como grao; o segundo concentra no escuro e sujaria o campo.
       A dessaturacao vem depois porque ruido colorido lê como artefato de
       compressao, e nao como superficie. */
    `<filter id="aurora-grain" x="0" y="0" width="100%" height="100%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" ` +
    `stitchTiles="stitch"/>` +
    `<feColorMatrix type="saturate" values="0"/>` +
    `</filter>` +
    `</defs>` +
    `<g filter="url(#aurora-soft)">${blobs}</g>` +
    `<rect class="aurora__grain" width="1000" height="700"/>` +
    `</svg>`
  );
}
