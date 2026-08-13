/* FORMATACAO — numero vira texto aqui, e em nenhum outro lugar.
   ══════════════════════════════════════════════════════════════════════════════

   O motor raciocina em bilhoes com casas decimais infinitas; a tela mostra
   "R$ 3,2 bi". A conversao entre os dois e uma decisao de interface e nao de
   modelo, entao ela mora na camada de interface — e num arquivo so, porque
   virgula decimal escrita a mao em quinze templates e como uma tela passa a ter
   dois formatos de numero sem ninguem decidir isso. */

/**
 * Numero com virgula decimal, do jeito que se escreve em portugues.
 *
 * @param {number} value
 * @param {number} [digits]
 * @returns {string}
 */
export function num(value, digits = 1) {
  /* `-0` existe em ponto flutuante e imprime como "-0,0", que numa tabela de
     orcamento parece defeito. O zero e zero. */
  const safe = Object.is(value, -0) ? 0 : value;
  return safe.toFixed(digits).replace(".", ",");
}

/**
 * O MESMO NUMERO, para o NAVEGADOR ler — e nao o jogador.
 *
 * ⚠ Ela existe por causa de um defeito medido, e o defeito era invisivel.
 * `num` escreve virgula decimal porque e assim que se escreve em portugues, e
 * virgula dentro de `max`, `min` ou `value` de um `<input>` e valor INVALIDO:
 * o navegador nao reclama, nao avisa e nao quebra — ele descarta o atributo e
 * usa o padrao dele. Num controle deslizante o padrao e teto 100 e valor no
 * MEIO da faixa, entao o controle de alocacao abria em 50 com teto de 100
 * enquanto o modelo o dava como zero com teto de 25. A tela e o jogo
 * discordavam em silencio, e o jogador via a discordancia como um controle que
 * "comeca no meio".
 *
 * Toda vez que um numero for para dentro de um atributo, ele passa por aqui.
 *
 * @param {number} value
 * @param {number} [digits]
 * @returns {string}
 */
export function attr(value, digits = 2) {
  return (Object.is(value, -0) ? 0 : value).toFixed(digits);
}

/**
 * Bilhoes de reais, com a unidade junto.
 *
 * @param {number} value
 * @param {number} [digits]
 */
export function money(value, digits = 1) {
  return `R$ ${num(value, digits)} bi`;
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
 * Percentual inteiro a partir de uma fracao de 0 a 1.
 *
 * @param {number} fraction
 */
export function percent(fraction) {
  return `${Math.round(fraction * 100)}%`;
}

/**
 * Variacao com sinal explicito. O `+` e obrigatorio: sem ele, "3" e "−3" tem
 * pesos visuais diferentes e a coluna deixa de ser comparavel de relance.
 *
 * @param {number} value
 * @param {number} [digits]
 */
export function signed(value, digits = 0) {
  const rounded = Number(value.toFixed(digits));
  if (rounded > 0) return `+${num(value, digits)}`;
  /* O menos tipografico, e nao o hifen. Numa coluna de numeros o hifen e curto
     demais e desalinha a leitura. */
  if (rounded < 0) return `−${num(Math.abs(value), digits)}`;
  return num(0, digits);
}

/* A ESCADA DE BLOCOS, oito degraus. Ela desenha tendencia sem canvas, sem SVG e
   sem biblioteca — e num rail estreito ela cabe onde um grafico nao caberia. */
const BLOCKS = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];

/**
 * Uma serie de 0 a 100 desenhada em blocos.
 *
 * A ESCALA E ABSOLUTA e nao relativa a serie. Normalizar pelo minimo e maximo
 * faria uma oscilacao de dois pontos parecer um desabamento — o desenho ficaria
 * dramatico justamente quando nao ha nada acontecendo, que e o oposto do que uma
 * faixa de tendencia serve para dizer.
 *
 * @param {ReadonlyArray<number>} values
 * @param {number} [width] quantos degraus mostrar, do fim da serie
 * @returns {string}
 */
export function sparkline(values, width = 6) {
  /* UM PONTO NAO E TENDENCIA. Com uma leitura so a escada desenha um bloco
     solitario, que na tela lê como sujeira de renderizacao e nao como
     informacao — e foi assim que ela apareceu no primeiro mes da partida, ao
     lado de cada um dos seis indices. Tendencia precisa de dois pontos; com
     menos que isso, o certo e nao desenhar nada. */
  if (values.length < 2) return "";
  const shown = values.slice(-width);
  return shown
    .map(value => {
      const step = Math.min(
        BLOCKS.length - 1,
        Math.max(0, Math.floor((value / 100) * BLOCKS.length)),
      );
      return BLOCKS[step] ?? BLOCKS[0];
    })
    .join("");
}
