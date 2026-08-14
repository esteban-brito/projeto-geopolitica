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

/* ONDE O BILHAO VIRA TRILHAO. A escala troca sozinha porque o jogo passou a
   mostrar as duas ordens de grandeza na MESMA tela: a bolsa do mes anda em
   dezenas de bilhoes, e PIB, receita e divida andam em trilhoes. Escritos na
   mesma unidade, o placar mostra "R$ 12227,1 bi" ao lado de "R$ 33,5 bi", e
   comparar os dois passa a exigir contar digitos — que e exatamente o trabalho
   que a formatacao existe para tirar de quem lê. */
const TRILLION = 1000;

/**
 * Reais, na maior unidade em que o numero ainda e legivel.
 *
 * @param {number} value em BILHOES, que e a moeda de todo motor do jogo
 * @param {number} [digits]
 */
export function money(value, digits = 1) {
  /* UMA CASA A MAIS NO TRILHAO, para a troca de unidade nao custar precisao: com
     uma so, receita de 2653,5 bi e de 2749,9 bi imprimem as duas "R$ 2,7 tri", e
     o painel passa a mostrar dois meses diferentes como se fossem o mesmo. */
  if (Math.abs(value) >= TRILLION) return `R$ ${num(value / TRILLION, digits + 1)} tri`;
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
 * Percentual a partir de uma fracao de 0 a 1, inteiro por padrao.
 *
 * A CASA DECIMAL E OPCIONAL PORQUE ELA SO IMPORTA EM UM LUGAR. Fracao de verba
 * e fatia de bancada nao ganham nada com "37,4%" — o jogador arrasta um controle
 * e le a ordem de grandeza. Ja juro e inflacao MUDAM de significado na primeira
 * decimal: 10,5% e 11,0% de Selic sao dois paises diferentes para quem paga a
 * divida, e arredondar os dois para 11% apagaria a decisao do Banco Central.
 *
 * @param {number} fraction
 * @param {number} [digits]
 */
export function percent(fraction, digits = 0) {
  if (digits === 0) return `${Math.round(fraction * 100)}%`;
  return `${num(fraction * 100, digits)}%`;
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
 * Uma serie desenhada em blocos, contra uma faixa DECLARADA.
 *
 * A ESCALA NUNCA SAI DA PROPRIA SERIE. Normalizar pelo minimo e pelo maximo dos
 * pontos faria uma oscilacao de dois pontos parecer um desabamento — o desenho
 * ficaria dramatico justamente quando nao ha nada acontecendo, que e o oposto do
 * que uma faixa de tendencia serve para dizer.
 *
 * ⚠ A FAIXA E PARAMETRO, E O PADRAO E O INDICE DE AREA. Quando a CORRENTE nasceu,
 * o painel passou a desenhar inflacao (0,042), juro (0,105) e divida sobre PIB
 * (0,78) com a mesma regua de um indice de 0 a 100 — e as tres viravam o degrau
 * mais baixo, para sempre, em qualquer partida. A serie existia, o motor estava
 * certo, e a escada mentia dizendo "nada nunca acontece". Quem sabe em que faixa
 * um indicador vive e quem o mostra, entao a faixa entra por aqui.
 *
 * @param {ReadonlyArray<number>} values
 * @param {number} [width] quantos degraus mostrar, do fim da serie
 * @param {readonly [number, number]} [range] o piso e o teto da regua
 * @returns {string}
 */
export function sparkline(values, width = 6, range = [0, 100]) {
  /* UM PONTO NAO E TENDENCIA. Com uma leitura so a escada desenha um bloco
     solitario, que na tela lê como sujeira de renderizacao e nao como
     informacao — e foi assim que ela apareceu no primeiro mes da partida, ao
     lado de cada um dos seis indices. Tendencia precisa de dois pontos; com
     menos que isso, o certo e nao desenhar nada. */
  if (values.length < 2) return "";

  const [floor, ceiling] = range;
  /* Faixa degenerada nao existe em chamada valida, e uma divisao por zero aqui
     produziria `NaN` que atravessa o `Math.floor` e sai como bloco de baixo em
     toda a serie — um desenho plausivel descrevendo um defeito. */
  const span = ceiling - floor || 1;

  const shown = values.slice(-width);
  return shown
    .map(value => {
      const step = Math.min(
        BLOCKS.length - 1,
        Math.max(0, Math.floor(((value - floor) / span) * BLOCKS.length)),
      );
      return BLOCKS[step] ?? BLOCKS[0];
    })
    .join("");
}
