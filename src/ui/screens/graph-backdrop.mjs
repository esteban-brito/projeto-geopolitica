/* O GRAFO DE FUNDO — o substrato do vidro.
   ══════════════════════════════════════════════════════════════════════════════

   POR QUE ELE EXISTE ANTES DO MOTOR. Vidro nao lê como material sobre um fundo
   liso: o olho separa vidro de plastico fosco pela diferenca entre a coisa
   nitida e a mesma coisa borrada. Sem estrutura atras, `backdrop-filter` custa
   GPU e nao entrega imagem. O substrato, portanto, e requisito do material —
   nao acabamento.

   O LAYOUT E DETERMINISTICO E ESTATICO, e as duas coisas sao decisao:

     · DETERMINISTICO porque a captura visual de regressao precisa comparar duas
       execucoes do mesmo codigo. Um layout sorteado faria toda captura divergir
       e o instrumento de prova perderia o sentido;
     · ESTATICO porque `backdrop-filter` sobre um fundo EM MOVIMENTO obriga o
       compositor a reamostrar o que esta atras a cada quadro — a condicao exata
       que derrubou uma tela para 31 fps no projeto anterior.

   Quando DELTA (o motor do grafo) existir, as posicoes passam a vir de uma
   simulacao de forca rodando em Web Worker, que CONVERGE e so entao desenha.
   O contrato desta funcao nao muda: nos e arestas entram, SVG sai. */

/**
 * @typedef {object} GraphNode
 * @property {number} x
 * @property {number} y
 * @property {number} r
 * @property {boolean} hub
 */

/**
 * Layout radial em tres aneis. Sem aleatoriedade: as posicoes saem de uma
 * progressao angular irracional (o angulo aureo), que distribui os nos sem
 * alinha-los em raios visiveis — o mesmo motivo pelo qual sementes de girassol
 * nao formam fileiras.
 *
 * @param {number} count
 * @returns {GraphNode[]}
 */
export function layout(count) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  /** @type {GraphNode[]} */
  const nodes = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const radius = 120 + Math.sqrt(t) * 420;
    const angle = i * golden;
    const hub = i % 7 === 0;
    nodes.push({
      x: 500 + Math.cos(angle) * radius * 1.28,
      y: 350 + Math.sin(angle) * radius * 0.86,
      r: hub ? 5.5 : 2.6,
      hub,
    });
  }
  return nodes;
}

/**
 * Liga cada no ao vizinho mais proximo entre os anteriores. Produz uma arvore
 * conexa — que e a forma que um grafo de causalidade tem — em vez de uma teia
 * uniforme, e custa O(n²) sobre algumas dezenas de nos.
 *
 * @param {GraphNode[]} nodes
 * @returns {Array<[GraphNode, GraphNode]>}
 */
export function edges(nodes) {
  /** @type {Array<[GraphNode, GraphNode]>} */
  const out = [];
  for (let i = 1; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node) continue;
    let best = -1;
    let bestDistance = Infinity;
    for (let j = 0; j < i; j++) {
      const other = nodes[j];
      if (!other) continue;
      const distance = (node.x - other.x) ** 2 + (node.y - other.y) ** 2;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = j;
      }
    }
    const target = nodes[best];
    if (target) out.push([node, target]);
  }
  return out;
}

/**
 * @param {number} [count]
 * @returns {string} markup SVG completo do substrato
 */
export function graphSvg(count = 64) {
  const nodes = layout(count);
  const lines = edges(nodes)
    .map(([a, b]) => `<path class="graph__edge" d="M${r(a.x)} ${r(a.y)}L${r(b.x)} ${r(b.y)}"/>`)
    .join("");
  const halos = nodes
    .filter(node => node.hub)
    .map(node => `<circle class="graph__halo" cx="${r(node.x)}" cy="${r(node.y)}" r="18"/>`)
    .join("");
  const dots = nodes
    .map(node => `<circle class="graph__node" cx="${r(node.x)}" cy="${r(node.y)}" r="${node.r}"/>`)
    .join("");
  return (
    `<svg class="graph" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" ` +
    `xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">` +
    `${halos}${lines}${dots}</svg>`
  );
}

/** @param {number} n */
function r(n) {
  return Math.round(n * 10) / 10;
}
