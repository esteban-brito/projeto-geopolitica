/* DELTA — catálogo de ligações, estado e deltas viram nós e arestas com peso e sinal. */

/* ⚠ AS LIGAÇÕES SÃO LIDAS DO CATÁLOGO, e não escritas aqui: `yield`, `decay`, `feeds`,
   `force` e `lag` já dizem quem alimenta quem, com que peso e com que atraso. Uma segunda
   lista declarando as mesmas arestas divergiria da MALHA no primeiro ajuste de calibragem —
   e a corrente passaria a explicar um jogo que não é o que roda. */

/**
 * @typedef {import("../../data/areas.mjs").Area} Area
 * @typedef {object} Link uma aresta da corrente
 * @property {"spend" | "decay" | "capacity" | "channel"} kind
 * @property {string} from - id da área, ou `budget` quando a ponta é a verba do mês
 * @property {string} to - id da área, ou o canal (`revenue`, `mandatory`)
 * @property {number} weight - o peso do catálogo, COM SINAL
 * @property {number} lag - meses até o efeito chegar
 * @property {"points" | "factor"} unit - a unidade do EFEITO que esta aresta entrega
 * @property {number} [half] - a meia-vida, em meses; só no desgaste
 */

/* O CANAL `capacity` NÃO É UM DESTINO, e sim um caminho: ele desemboca numa área, e a área
   é que alimenta o próprio canal dela. Por isso `to` traz o alvo e não a palavra. */
const CHANNEL_UNIT = /** @type {const} */ ({
  revenue: "factor",
  mandatory: "factor",
  capacity: "points",
});

/**
 * A MEIA-VIDA DE UM ESTOQUE QUE VAZA POR FRAÇÃO, em meses.
 *
 * ⚠ ELA É A LEITURA DE `decay` EM LINGUAGEM DE JOGADOR: "perde 4,2% ao mês" não diz quanto
 * tempo o jogador tem, e "metade em 16 meses" diz. A identidade é a mesma dos dois lados.
 *
 * @param {number} decay - a fração do estoque que vaza por mês
 * @returns {number} meses; `Infinity` quando nada vaza
 */
export function halfLifeOf(decay) {
  if (decay <= 0) return Infinity;
  if (decay >= 1) return 0;
  return Math.log(2) / -Math.log(1 - decay);
}

/**
 * A CORRENTE DE UMA ÁREA — o que a alimenta, e o que ela alimenta.
 *
 * @param {object} input
 * @param {ReadonlyArray<Area>} input.areas
 * @param {string} input.id - a área perguntada
 * @param {string} input.target - a área que recebe o canal `capacity`
 * @returns {{ into: Link[], out: Link[] }} vazio dos dois lados quando o id não existe
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

  /* A ÁREA ALVO É A ÚNICA QUE RECEBE DE OUTRA, e o catálogo diz quais entram: o canal
     `capacity` é o único que uma área exerce sobre outra. */
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

  /* ⚠ UM CANAL POR ÁREA, e o catálogo o garante — "nenhuma área usa dois". A saída é uma
     aresta só, e não uma lista que finge escolha. */
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
