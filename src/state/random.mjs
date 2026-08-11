/* O FLUXO DE ALEATORIEDADE — semeado, contado e serializavel.
   ══════════════════════════════════════════════════════════════════════════════

   O padrao travado diz: fluxo injetado, proprio de cada motor que sorteia. Este
   arquivo e o fluxo. Sorteio ambiente esta proibido no dominio e a guarda
   `boundaries` recusa — nao por purismo, mas porque replay determinstico e a
   unica forma de depurar e balancear um jogo sistemico. Sem ele, "o Congresso
   derrubou minha lei" nunca e reproduzivel, e portanto nunca e investigavel.

   ── CONTADO, E NAO ENCADEADO ─────────────────────────────────────────────────
   A escolha estrutural deste arquivo. Um gerador comum guarda estado interno e
   avanca mutando-o; para salvar a partida seria preciso serializar esse estado
   interno, que e detalhe de implementacao e muda quando o gerador muda.

   Aqui o valor e FUNCAO PURA de (semente, indice). O fluxo inteiro e um par de
   inteiros — semente e quantos saques ja houve —, e disso vem tudo:

     · SALVAR e escrever dois numeros. Nao existe "estado interno esquecido";
     · REPLAY e reexecutar do indice zero e obter exatamente a mesma sequencia;
     · IMUTABILIDADE sai de graca: sacar devolve um fluxo NOVO, e o antigo
       continua valido — que e o que permite o motor ser funcao pura;
     · VOLTAR ATRAS e subtrair do contador.

   ── UM FLUXO POR MOTOR, E POR QUE ISSO NAO E DETALHE ─────────────────────────
   TEMPORAL e ECLUSA sacam de fluxos INDEPENDENTES, derivados do nome. Com um
   fluxo unico compartilhado, um evento a mais num turno deslocaria o indice e
   MUDARIA O RESULTADO DE UMA VOTACAO que nao tem nada a ver com ele. Ao
   balancear a frequencia de eventos, toda votacao do jogo mudaria junto — e a
   sessao inteira de calibragem viraria ruido.

   ── O MISTURADOR ─────────────────────────────────────────────────────────────
   `splitmix32`: multiplicacao, deslocamento e ou-exclusivo. Ele nao e
   criptografico e nao precisa ser — o que se exige aqui e avalanche (mudar um
   bit da entrada muda metade dos bits da saida) e independencia entre indices
   vizinhos, e a suite mede as duas. */

/* A CONSTANTE DE WEYL, a parte fracionaria da razao aurea em 32 bits. Ela
   incrementa o indice com passo irracional, que e o que impede indices vizinhos
   de cairem em regioes vizinhas da saida. */
const GOLDEN = 0x9e3779b9;

/**
 * @typedef {object} Stream
 * @property {number} seed - inteiro sem sinal de 32 bits
 * @property {number} draws - quantos saques ja sairam deste fluxo
 */

/**
 * Mistura semente e indice num inteiro de 32 bits.
 *
 * `Math.imul` e obrigatorio: `*` em JavaScript promove para ponto flutuante de
 * 64 bits e PERDE os bits baixos numa multiplicacao de 32 bits, que sao
 * exatamente os bits que o misturador precisa preservar.
 *
 * @param {number} seed
 * @param {number} index
 * @returns {number} inteiro sem sinal de 32 bits
 */
export function mix(seed, index) {
  let z = (seed + Math.imul(index, GOLDEN)) >>> 0;
  z = Math.imul(z ^ (z >>> 16), 0x21f0aaad) >>> 0;
  z = Math.imul(z ^ (z >>> 15), 0x735a2d97) >>> 0;
  return (z ^ (z >>> 15)) >>> 0;
}

/**
 * Deriva um inteiro de 32 bits a partir de um texto. Usado para o NOME do fluxo
 * virar semente propria, e assim `events` e `congress` nunca coincidirem.
 *
 * @param {string} text
 * @returns {number}
 */
export function hash(text) {
  let value = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    value = Math.imul(value ^ text.charCodeAt(i), 0x01000193) >>> 0;
  }
  return value >>> 0;
}

/**
 * Abre um fluxo nomeado a partir da semente da partida.
 *
 * @param {number} seed semente da partida
 * @param {string} name nome do fluxo, e portanto do motor que saca dele
 * @returns {Stream}
 */
export function streamFrom(seed, name) {
  return { seed: mix(seed >>> 0, hash(name)), draws: 0 };
}

/**
 * Saca um numero em [0, 1).
 *
 * Devolve o fluxo AVANCADO em vez de mexer no recebido: quem saca precisa
 * continuar sendo funcao pura, e um gerador que muta por dentro contamina todo
 * motor que o toca.
 *
 * @param {Stream} stream
 * @returns {{ value: number, stream: Stream }}
 */
export function unit(stream) {
  const raw = mix(stream.seed, stream.draws);
  return {
    /* 2^32 e nao 2^32 - 1: dividir pelo maximo INCLUIRIA o 1,0, e um sorteio
       que pode devolver exatamente 1 estoura toda faixa escrita como `[min,
       max)` — o defeito aparece uma vez em quatro bilhoes e nunca se reproduz. */
    value: raw / 4294967296,
    stream: { seed: stream.seed, draws: stream.draws + 1 },
  };
}

/**
 * Saca um inteiro entre `min` e `max`, os dois inclusive.
 *
 * @param {Stream} stream
 * @param {number} min
 * @param {number} max
 * @returns {{ value: number, stream: Stream }}
 */
export function integer(stream, min, max) {
  const drawn = unit(stream);
  const span = Math.floor(max) - Math.ceil(min) + 1;
  if (span <= 0) return { value: Math.ceil(min), stream: drawn.stream };
  return { value: Math.ceil(min) + Math.floor(drawn.value * span), stream: drawn.stream };
}

/**
 * Saca `count` numeros de uma vez. Existe porque o caso comum de ECLUSA e um
 * saque POR BANCADA, e encadear a mao o fluxo devolvido a cada passo e onde se
 * esquece de usar o fluxo novo — defeito que nao quebra nada e simplesmente faz
 * todas as bancadas sortearem o mesmo numero.
 *
 * @param {Stream} stream
 * @param {number} count
 * @returns {{ values: number[], stream: Stream }}
 */
export function take(stream, count) {
  /** @type {number[]} */
  const values = [];
  let current = stream;
  for (let i = 0; i < count; i++) {
    const drawn = unit(current);
    values.push(drawn.value);
    current = drawn.stream;
  }
  return { values, stream: current };
}
