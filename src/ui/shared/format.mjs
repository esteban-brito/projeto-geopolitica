/* FORMATACAO — numero vira texto aqui, e em nenhum outro lugar. */

/**
 * Numero com virgula decimal, do jeito que se escreve em portugues.
 *
 * @param {number} value
 * @param {number} [digits]
 * @returns {string}
 */
export function num(value, digits = 1) {
  /* ⚠ E NAO E SO O `-0` EXATO — foi o que a captura mostrou. */
  const safe = Number(value.toFixed(digits)) === 0 ? 0 : value;
  return safe.toFixed(digits).replace(".", ",");
}

/**
 * ⚠ Ela existe por causa de um defeito medido, e o defeito era invisivel.
 *
 * @param {number} value
 * @param {number} [digits]
 * @returns {string}
 */
export function attr(value, digits = 2) {
  return (Object.is(value, -0) ? 0 : value).toFixed(digits);
}

/* ONDE O BILHAO VIRA TRILHAO. */
const TRILLION = 1000;

/**
 * Reais, na maior unidade em que o numero ainda e legivel.
 *
 * @param {number} value em BILHOES, que e a moeda de todo motor do jogo
 * @param {number} [digits]
 */
export function money(value, digits = 1) {
  /* UMA CASA A MAIS NO TRILHAO, para a troca de unidade nao custar precisao: com uma so,
     receita de 2653,5 bi e de 2749,9 bi imprimem as duas "R$ 2,7 tri", e o painel passa a
     mostrar dois meses diferentes como se fossem o mesmo. */
  /* ⚠ OS ESPACOS SAO INQUEBRAVEIS, e a razao apareceu numa captura: numa coluna estreita a
     linha quebrava entre o numero e a unidade e sobrava um "bi" sozinho no comeco da linha
     seguinte. */
  if (Math.abs(value) >= TRILLION) return `R$ ${num(value / TRILLION, digits + 1)} tri`;
  return `R$ ${num(value, digits)} bi`;
}

/**
 * Inteiro, para cadeira e voto — que nao existem pela metade.
 *
 * @param {number} value
 */
export function seats(value) {
  return String(Math.round(value));
}

/**
 * ⚠ ELA EXISTE PORQUE ARREDONDAR CADA CELULA SOZINHA FAZ A LINHA NAO FECHAR, e o anexo da
 * pesquisa imprimia as duas contas certas e incompativeis: `15,4 + 11,6 + 7,6 + 5,6 + 2,8`
 * saia como `15+12+8+6+3 = 44` nas celulas e `43` no total, que e a soma cheia arredondada.
 * O metodo do maior residuo distribui o que sobra: a celula de menor residuo cede.
 *
 * @param {ReadonlyArray<number>} values
 * @returns {number[]} inteiros que somam exatamente `Math.round(soma dos valores)`
 */
export function apportion(values) {
  const floors = values.map(value => Math.floor(value));
  const seated = floors.reduce((sum, value) => sum + value, 0);
  const total = Math.round(values.reduce((sum, value) => sum + value, 0));

  /* ⚠ O RESIDUO E COM SINAL, E NAO EM MODULO. A linha do desgaste tira pontos, e com sinal
     misto o modulo ordenaria pela distancia do zero: `-2,4` pareceria residuo 0,4 e ganharia
     o ponto que cabia a `3,6`. `Math.floor` desce `-2,4` para `-3`, e o residuo e 0,6. */
  const order = values
    .map((value, index) => ({ index, rest: value - (floors[index] ?? 0) }))
    .sort((a, b) => b.rest - a.rest || a.index - b.index);

  /* Cada celula ja levou o proprio piso, entao o que falta esta entre zero e o numero delas;
     o limite defende so do residuo de ponto flutuante. */
  const up = Math.min(values.length, Math.max(0, total - seated));

  const cells = [...floors];
  for (let index = 0; index < up; index++) {
    const pick = order[index];
    if (pick) cells[pick.index] = (cells[pick.index] ?? 0) + 1;
  }
  return cells;
}

/**
 * Ja juro e inflacao MUDAM de significado na primeira decimal: 10,5% e 11,0% de Selic sao
 * dois paises diferentes para quem paga a divida, e arredondar os dois para 11% apagaria a
 * decisao do Banco Central.
 *
 * @param {number} fraction
 * @param {number} [digits]
 */
export function percent(fraction, digits = 0) {
  if (digits === 0) return `${Math.round(fraction * 100)}%`;
  return `${num(fraction * 100, digits)}%`;
}

/**
 * Variacao com sinal explicito.
 *
 * @param {number} value
 * @param {number} [digits]
 */
export function signed(value, digits = 0) {
  const rounded = Number(value.toFixed(digits));
  if (rounded > 0) return `+${num(value, digits)}`;
  /* O menos tipografico, e nao o hifen. */
  if (rounded < 0) return `−${num(Math.abs(value), digits)}`;
  return num(0, digits);
}

/* Um bloco tem OITO alturas, e a altura de cada um e uma fracao do CORPO DA FONTE: a 0,5rem —
   o tamanho que o painel usa — o degrau 1 tem UM PIXEL. */

/* Um indice de 3% contra uma regua de 0 a 15% desenha uma curva de verdade, e nao um risco de
   um pixel. */

/* O QUADRO INTERNO, e ele e arbitrario de proposito: a caixa real vem do CSS, e estes numeros
   so precisam de proporcao entre si. */
const FRAME = { width: 100, height: 24, pad: 2 };

/**
 * Uma serie desenhada como linha, contra uma faixa DECLARADA.
 *
 * @param {ReadonlyArray<number>} values
 * @param {number} [width] quantos meses mostrar, do fim da serie
 * @param {readonly [number, number]} [range] o piso e o teto da regua
 * @returns {string}
 */
export function sparkline(values, width = 6, range = [0, 100]) {
  /* UM PONTO NAO E TENDENCIA. */
  if (values.length < 2) return "";

  const [floor, ceiling] = range;
  /* Faixa degenerada nao existe em chamada valida, e uma divisao por zero aqui produziria
     `NaN` atravessando o atributo `points` — o navegador descarta a polilinha inteira em
     silencio, e o defeito sai como uma caixa vazia plausivel. */
  const span = ceiling - floor || 1;

  const shown = values.slice(-width);
  const last = shown.length - 1;
  const reach = FRAME.height - 2 * FRAME.pad;

  const points = shown
    .map((value, index) => {
      const share = Math.min(1, Math.max(0, (value - floor) / span));
      const x = (index / last) * FRAME.width;
      /* Esquecer esta inversao desenha a serie de cabeca para baixo, e o desenho continua
         plausivel — e o pior tipo de defeito de grafico. */
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
