/* FORMATAÇÃO — número vira texto aqui, e em nenhum outro lugar. */

/**
 * Número com vírgula decimal, do jeito que se escreve em português.
 *
 * @param {number} value
 * @param {number} [digits]
 * @returns {string}
 */
export function num(value, digits = 1) {
  /* ⚠ NÃO BASTA PEGAR O `-0` EXATO: -0,04 com uma casa imprime "-0,0", que e um sinal de
     menos na frente de um zero. Quem decide e o valor JÁ ARREDONDADO. */
  const safe = Number(value.toFixed(digits)) === 0 ? 0 : value;
  return safe.toFixed(digits).replace(".", ",");
}

/**
 * O MESMO, PARA ATRIBUTO — sem vírgula, que o CSS e o SVG não leem.
 *
 * @param {number} value
 * @param {number} [digits]
 * @returns {string}
 */
export function attr(value, digits = 2) {
  return (Object.is(value, -0) ? 0 : value).toFixed(digits);
}

/* ONDE O BILHÃO VIRA TRILHÃO. */
const TRILLION = 1000;

/**
 * Reais, na maior unidade em que o número ainda e legível.
 *
 * @param {number} value em BILHOES, que e a moeda de todo motor do jogo
 * @param {number} [digits]
 */
export function money(value, digits = 1) {
  /* UMA CASA A MAIS NO TRILHÃO, para a troca de unidade não custar precisão: com uma só,
     receita de 2653,5 bi e de 2749,9 bi imprimem as duas "R$ 2,7 tri", e o painel passa a
     mostrar dois meses diferentes como se fossem o mesmo. */
  /* ⚠ OS ESPAÇOS SÃO INQUEBRAVEIS, e a razão apareceu numa captura: numa coluna estreita a
     linha quebrava entre o número e a unidade e sobrava um "bi" sozinho no começo da linha
     seguinte. */
  if (Math.abs(value) >= TRILLION) return `R$ ${num(value / TRILLION, digits + 1)} tri`;
  return `R$ ${num(value, digits)} bi`;
}

/**
 * Inteiro, para cadeira e voto — que não existem pela metade.
 *
 * @param {number} value
 */
export function seats(value) {
  return String(Math.round(value));
}

/**
 * Porcentagem, e o padrão e SEM casa. Juro e inflação pedem uma: 10,5% e 11,0% de Selic são
 * dois países diferentes para quem paga a dívida, e arredondar os dois para 11% apagaria a
 * decisão do Banco Central.
 *
 * @param {number} fraction
 * @param {number} [digits]
 */
export function percent(fraction, digits = 0) {
  if (digits === 0) return `${Math.round(fraction * 100)}%`;
  return `${num(fraction * 100, digits)}%`;
}

/**
 * Variação com sinal explícito.
 *
 * @param {number} value
 * @param {number} [digits]
 */
export function signed(value, digits = 0) {
  const rounded = Number(value.toFixed(digits));
  if (rounded > 0) return `+${num(value, digits)}`;
  /* O menos tipográfico, e não o hifen. */
  if (rounded < 0) return `−${num(Math.abs(value), digits)}`;
  return num(0, digits);
}

/* O QUADRO INTERNO, e ele e arbitrário de propósito: a caixa real vem do CSS, e estes números
   só precisam de proporção entre si. */
const FRAME = { width: 100, height: 24, pad: 2 };

/**
 * Uma série desenhada como linha, contra uma faixa DECLARADA.
 *
 * @param {ReadonlyArray<number>} values
 * @param {number} [width] quantos meses mostrar, do fim da serie
 * @param {readonly [number, number]} [range] o piso e o teto da regua
 * @returns {string}
 */
export function sparkline(values, width = 6, range = [0, 100]) {
  /* UM PONTO NÃO E TENDÊNCIA. */
  if (values.length < 2) return "";

  const [floor, ceiling] = range;
  /* Faixa degenerada não existe em chamada valida, e uma divisão por zero aqui produziria
     `NaN` atravessando o atributo `points` — o navegador descarta a polilinha inteira em
     silêncio, e o defeito sai como uma caixa vazia plausível. */
  const span = ceiling - floor || 1;

  const shown = values.slice(-width);
  const last = shown.length - 1;
  const reach = FRAME.height - 2 * FRAME.pad;

  const points = shown
    .map((value, index) => {
      const share = Math.min(1, Math.max(0, (value - floor) / span));
      const x = (index / last) * FRAME.width;
      /* Esquecer esta inversão desenha a série de cabeça para baixo, e o desenho continua
         plausível — e o pior tipo de defeito de gráfico. */
      const y = FRAME.height - FRAME.pad - share * reach;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    `<svg class="spark" viewBox="0 0 ${FRAME.width} ${FRAME.height}" ` +
    `preserveAspectRatio="none" aria-hidden="true">` +
    `<polyline class="spark__line" vector-effect="non-scaling-stroke" points="${points}" />` +
    `</svg>`
  );
}
