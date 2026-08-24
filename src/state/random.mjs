/* O FLUXO DE ALEATORIEDADE — semeado, contado e serializavel.
   TEMPORAL e ECLUSA sacam de fluxos INDEPENDENTES, derivados do nome. Com um
   fluxo unico compartilhado, um evento a mais num turno deslocaria o indice e mudaria o
   resultado de uma votacao que nao tem relacao nenhuma com ele. */

/* A CONSTANTE DE WEYL, a parte fracionaria da razao aurea em 32 bits. */
const GOLDEN = 0x9e3779b9;

/**
 * @typedef {object} Stream
 * @property {number} seed - inteiro sem sinal de 32 bits
 * @property {number} draws - quantos saques ja sairam deste fluxo
 */

/**
 * Mistura semente e indice num inteiro de 32 bits.
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
 * Deriva um inteiro de 32 bits a partir de um texto.
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
 * @param {Stream} stream
 * @returns {{ value: number, stream: Stream }}
 */
export function unit(stream) {
  const raw = mix(stream.seed, stream.draws);
  return {
    /* 2^32 e nao 2^32 - 1: dividir pelo maximo INCLUIRIA o 1,0, e um sorteio que pode
       devolver exatamente 1 estoura toda faixa escrita como `[min, max)` — o defeito aparece
       uma vez em quatro bilhoes e nunca se reproduz. */
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
