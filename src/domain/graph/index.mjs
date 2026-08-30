/* DELTA — catalogo de ligacoes, estado e deltas viram nos e arestas com peso e sinal. */

/* ⚠ AS LIGACOES SAO LIDAS DO CATALOGO, e nao escritas aqui: `yield`, `decay`, `feeds`,
   `force` e `lag` ja dizem quem alimenta quem, com que peso e com que atraso. Uma segunda
   lista declarando as mesmas arestas divergiria da MALHA no primeiro ajuste de calibragem —
   e a corrente passaria a explicar um jogo que nao e o que roda. */

/**
 * @typedef {import("../../data/areas.mjs").Area} Area
 * @typedef {object} Link uma aresta da corrente
 * @property {"spend" | "decay" | "capacity" | "channel"} kind
 * @property {string} from - id da area, ou `budget` quando a ponta e a verba do mes
 * @property {string} to - id da area, ou o canal (`revenue`, `mandatory`)
 * @property {number} weight - o peso do catalogo, COM SINAL
 * @property {number} lag - meses ate o efeito chegar
 * @property {"points" | "factor"} unit - a unidade do EFEITO que esta aresta entrega
 * @property {number} [half] - a meia-vida, em meses; so no desgaste
 */

/* O CANAL `capacity` NAO E UM DESTINO, e sim um caminho: ele desemboca numa area, e a area
   e que alimenta o proprio canal dela. Por isso `to` traz o alvo e nao a palavra. */
const CHANNEL_UNIT = /** @type {const} */ ({
  revenue: "factor",
  mandatory: "factor",
  capacity: "points",
});

/**
 * A MEIA-VIDA DE UM ESTOQUE QUE VAZA POR FRACAO, em meses.
 *
 * ⚠ ELA E A LEITURA DE `decay` EM LINGUAGEM DE JOGADOR: "perde 4,2% ao mes" nao diz quanto
 * tempo o jogador tem, e "metade em 16 meses" diz. A identidade e a mesma dos dois lados.
 *
 * @param {number} decay - a fracao do estoque que vaza por mes
 * @returns {number} meses; `Infinity` quando nada vaza
 */
export function halfLifeOf(decay) {
  if (decay <= 0) return Infinity;
  if (decay >= 1) return 0;
  return Math.log(2) / -Math.log(1 - decay);
}

/**
 * A CORRENTE DE UMA AREA — o que a alimenta, e o que ela alimenta.
 *
 * @param {object} input
 * @param {ReadonlyArray<Area>} input.areas
 * @param {string} input.id - a area perguntada
 * @param {string} input.target - a area que recebe o canal `capacity`
 * @returns {{ into: Link[], out: Link[] }} vazio dos dois lados quando o id nao existe
 */
export function linksOf({ areas, id, target }) {
  const area = areas.find(one => one.id === id);
  if (area === undefined) return { into: [], out: [] };

  /** @type {Link[]} */
  const into = [
    { kind: "spend", from: "budget", to: id, weight: area.yield, lag: 0, unit: "points" },
    {
      kind: "decay",
      from: id,
      to: id,
      weight: -area.decay,
      lag: 0,
      unit: "points",
      half: halfLifeOf(area.decay),
    },
  ];

  /* A AREA ALVO E A UNICA QUE RECEBE DE OUTRA, e o catalogo diz quais entram: o canal
     `capacity` e o unico que uma area exerce sobre outra. */
  if (id === target) {
    for (const other of areas) {
      if (other.feeds !== "capacity") continue;
      into.push({
        kind: "capacity",
        from: other.id,
        to: id,
        weight: other.force,
        lag: other.lag,
        unit: "points",
      });
    }
  }

  /* ⚠ UM CANAL POR AREA, e o catalogo o garante — "nenhuma area usa dois". A saida e uma
     aresta so, e nao uma lista que finge escolha. */
  const feeds = /** @type {keyof typeof CHANNEL_UNIT} */ (area.feeds);
  /** @type {Link[]} */
  const out = [
    {
      kind: feeds === "capacity" ? "capacity" : "channel",
      from: id,
      to: feeds === "capacity" ? target : feeds,
      weight: area.force,
      lag: area.lag,
      unit: CHANNEL_UNIT[feeds] ?? "factor",
    },
  ];

  return { into, out };
}
