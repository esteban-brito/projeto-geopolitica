/* AS SUPERFICIES DA MESA — e as tres nascem de ruido, e nao de imagem.

   ⚠ ELAS SAO RASTERIZADAS UMA VEZ. Nenhuma anima e nenhuma entra no laco de quadro: a tela
   as escreve na carga e o compositor cuida do resto. Medido na bancada, a mesa inteira e o
   tampo pelado ficam a 1,1 fps de distancia — ruido.

   ⛔ E O `var()` NAO ATRAVESSA O DATA URI: o SVG e um documento isolado, entao a cor de um
   token do documento de fora nao chega la dentro. Tudo aqui e cinza, e a cor entra por
   `background-blend-mode` no CSS. */

/**
 * ⚠ `encodeURIComponent` CODIFICA O QUE NAO PRECISA — espaco vira %20, aspas viram %22, e um
 * SVG de 968 bytes sai com 1562. Trocando aspas dupla por simples e escapando so o que o data
 * URI exige, ele sai com 1068: 31,6% a menos.
 *
 * ⛔ E QUEM CHAMA NAO PRE-ESCAPA NADA. Ela troca `%` ANTES de `#`, entao um `%23` ja escrito
 * na origem vira `%2523` e volta como `%23`, que nao e cor: todo `fill` cai para o preto
 * inicial do SVG e a superficie sai chapada. Custou uma tabua preta inteira.
 *
 * @param {string} svg
 * @returns {string} a `url()` pronta para o CSS
 */
export function svgUrl(svg) {
  const lean = svg
    .replace(/"/g, "'")
    .replace(/%/g, "%25")
    .replace(/#/g, "%23")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/\s+/g, " ");
  return `url("data:image/svg+xml,${lean}")`;
}

/**
 * A FIBRA DO PAPEL — ruido cinza puro, sem relevo. E a do ato, que e liso.
 *
 * @param {{ freq: number, octaves: number, force: number }} input
 * @returns {string}
 */
export function fibre({ freq, octaves, force }) {
  return svgUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">` +
      `<filter id="f">` +
      `<feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${octaves}" seed="4"/>` +
      `<feColorMatrix type="saturate" values="0"/>` +
      `</filter>` +
      `<rect width="200" height="200" filter="url(#f)" opacity="${force}"/>` +
      `</svg>`,
  );
}

/**
 * O FELTRO DO ENVELOPE — e ele tem RELEVO, calculado por `feDiffuseLighting` sobre o ruido.
 *
 * ⛔ A MEDIA TEM DE FICAR PERTO DE 1, E NAO DE 0,5: ele entra em `multiply`, e a 0,50 o brilho
 * do papel cai pela metade — o branco saia cinza esverdeado. Com ganho 0,3 sobre 0,71 a media
 * da 0,952 e o desvio 2,7%; com 0,6 sobre 0,45 ela nao anda (0,935) e o desvio dobra.
 * ⛔ E `color-interpolation-filters` TEM DE SER `sRGB`: no linearRGB do padrao a media do ruido
 * nao e a que a conta acima assume.
 *
 * @returns {string}
 */
export function felt() {
  return svgUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">` +
      `<filter id="p" x="0" y="0" width="100%" height="100%"` +
      ` color-interpolation-filters="sRGB">` +
      `<feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="5" seed="9" result="n"/>` +
      `<feDiffuseLighting in="n" surfaceScale="1.5" diffuseConstant="1" lighting-color="#ffffff">` +
      `<feDistantLight azimuth="135" elevation="56"/>` +
      `</feDiffuseLighting>` +
      `<feColorMatrix type="matrix" values="` +
      `0.6 0 0 0 0.45  0 0.6 0 0 0.45  0 0 0.6 0 0.45  0 0 0 0 1"/>` +
      `</filter>` +
      `<rect width="300" height="300" filter="url(#p)"/>` +
      `</svg>`,
  );
}
