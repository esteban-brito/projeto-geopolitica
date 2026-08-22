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
     orcamento parece defeito. O zero e zero.

     ⚠ E NAO E SO O `-0` EXATO — foi o que a captura mostrou. O hiato do produto
     saiu "-0,0%" no painel de Financas com um valor de -0,0002: ele nao e `-0`,
     entao a comparacao com `Object.is` o deixava passar, e `toFixed` arredondava a
     magnitude para zero mantendo o sinal. O resultado e um numero que afirma
     "negativo" e mostra "zero" na mesma tinta.
     Quem decide agora e a LEITURA, e nao o valor cheio: se o arredondado e zero, o
     que se imprime e zero. E a mesma regra que ja governa o tom das linhas de
     Financas e o vermelho do estouro no cofre — onde a tela mostra zero, ela
     mostra zero nas duas linguagens. */
  const safe = Number(value.toFixed(digits)) === 0 ? 0 : value;
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
  /* ⚠ OS ESPACOS SAO INQUEBRAVEIS, e a razao apareceu numa captura: numa coluna
     estreita a linha quebrava entre o numero e a unidade e sobrava um "bi" sozinho
     no comeco da linha seguinte. Uma quantia partida ao meio deixa de ser uma
     quantia — o olho lê "R$ 5,0" e "bi" como duas coisas, e por um instante o
     numero perde a ordem de grandeza. Valor e unidade sao uma palavra so. */
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

/* ⚠ A ESCADA DE BLOCOS MORREU EM 21/08/2026, e o registro dela fica porque a razao de
   ela ter nascido era boa: `["▁","▂",...,"█"]` desenhava tendencia sem canvas, sem SVG e
   sem biblioteca, e — a frase original — "num rail estreito ela cabe onde um grafico nao
   caberia". O rail estreito dela nao existe mais desde 14/08, quando a barra superior
   absorveu a coluna da direita.

   ⚠ E O QUE A MATOU FOI UMA MEDICAO, e nao gosto. Um bloco tem OITO alturas, e a altura
   de cada um e uma fracao do CORPO DA FONTE: a 0,5rem — o tamanho que o painel usa — o
   degrau 1 tem UM PIXEL. Um indicador que vive no terco de baixo da propria regua sai
   como uma fileira de tracos de um pixel colada na linha de base, e o olho lê o
   SUBLINHADO do numero, e nao um grafico. Nas capturas de Financas: `R$ 12,75 tri ______`
   e `3,3% _______`.

   ⚠ E NAO HA TAMANHO QUE CONSERTE, o que custou tres capturas para provar. Medido a
   0,5 / 0,7 / 0,9rem: a altura da linha NAO muda (37px nos tres, o painel fecha em 1188
   nos tres), entao o corpo nao era caro — mas a 0,9rem a escada invade a coluna da nota
   ao lado, e a 0,7rem ela continua um traco, porque o problema nunca foi o corpo: e a
   razao entre a barra e a celula do glifo.

   O MESMO EXPERIMENTO REPROVOU A ESCADA NA BARRA SUPERIOR, no mesmo dia e pelo mesmo
   motivo. Ver o achado 44. */

/* A LINHA, e ela e o instrumento certo para a pergunta "para onde isto vem indo".
   ══════════════════════════════════════════════════════════════════════════════
   ⚠ SVG INLINE, e a convencao ja e do projeto: o sinete e o arco do plenario desenham
   assim ha sessoes — sem biblioteca, sem canvas, sem build. O que ela ganha sobre a
   escada e uma coisa so, e ela e decisiva: a linha usa a ALTURA INTEIRA da caixa
   independentemente de onde o valor mora na regua. Um indice de 3% contra uma regua de
   0 a 15% desenha uma curva de verdade, e nao um risco de um pixel.

   `preserveAspectRatio="none"` deixa a caixa esticar sem que o desenho precise saber
   quanto ela mede; `vector-effect="non-scaling-stroke"` impede que esse esticamento
   engrosse o traco num eixo e afine no outro — sem ele, a mesma linha sai gorda em
   Financas e fina no Congresso, porque as duas caixas tem proporcoes diferentes.

   ⚠ A REGUA CONTINUA SENDO PARAMETRO, e a razao nao mudou: normalizar pelo minimo e
   pelo maximo da propria serie faria uma oscilacao de dois pontos parecer um
   desabamento — o desenho ficaria dramatico justamente quando nao ha nada acontecendo.
   Quem sabe em que faixa um indicador vive e quem o mostra, e as faixas moram em
   `shared/trend.mjs`. */

/* O QUADRO INTERNO, e ele e arbitrario de proposito: a caixa real vem do CSS, e estes
   numeros so precisam de proporcao entre si. A folga de 2 em cima e embaixo existe para
   o traco nao ser cortado ao meio quando a serie encosta no teto ou no chao da regua. */
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
  /* UM PONTO NAO E TENDENCIA. Com uma leitura so a linha vira um ponto solitario, que
     na tela lê como sujeira de renderizacao e nao como informacao — e foi assim que a
     escada apareceu no primeiro mes da partida, ao lado de cada um dos seis indices. */
  if (values.length < 2) return "";

  const [floor, ceiling] = range;
  /* Faixa degenerada nao existe em chamada valida, e uma divisao por zero aqui
     produziria `NaN` atravessando o atributo `points` — o navegador descarta a
     polilinha inteira em silencio, e o defeito sai como uma caixa vazia plausivel. */
  const span = ceiling - floor || 1;

  const shown = values.slice(-width);
  const last = shown.length - 1;
  const reach = FRAME.height - 2 * FRAME.pad;

  const points = shown
    .map((value, index) => {
      const share = Math.min(1, Math.max(0, (value - floor) / span));
      const x = (index / last) * FRAME.width;
      /* O EIXO Y CRESCE PARA BAIXO EM SVG, entao o valor alto tem de virar coordenada
         BAIXA. Esquecer esta inversao desenha a serie de cabeca para baixo, e o desenho
         continua plausivel — e o pior tipo de defeito de grafico. */
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
