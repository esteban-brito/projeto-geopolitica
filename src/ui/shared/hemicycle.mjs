/* O HEMICICLO — 513 cadeiras, e o plenario deixa de ser uma abstracao. View PURA.
   ══════════════════════════════════════════════════════════════════════════════

   ── A RECUSA ANTERIOR CADUCOU, e vale registrado por que ────────────────────
   Duas auditorias externas pediram o semicirculo de cadeiras, e as duas vezes ele
   foi recusado com esta razao escrita em `cabinet.mjs`: "desenhar 513 pontos
   exigiria saber onde cada cadeira senta, e o modelo nao tem deputado individual —
   ele tem quatro blocos".

   ⚠ A RAZAO ERA VERDADEIRA E DEIXOU DE SER em 14/08/2026, quando o ELENCO nasceu.
   A Camara passou a ter ONZE bancadas com contagem de cadeiras propria, e o modelo
   sabe exatamente quantas cadeiras cada uma tem. Desenhar 513 pontos agrupados por
   bancada nao afirma nada que o modelo nao saiba: ele nao diz QUEM senta em cada
   cadeira — diz quantas cadeiras cada bancada ocupa, que e a mesma informacao que o
   numero ao lado ja dava, mostrada de um jeito que o olho lê de uma vez.

   ── O QUE ELE ACRESCENTA AO ARCO, e o arco nao morre por isso ───────────────
   O arco reparte a BASE EFETIVA (436) por saude — leal, obstruindo, rompida — e
   responde "quao saudavel e minha base?". O hemiciclo desenha a CAMARA INTEIRA
   (513) e responde outra pergunta, que a tela nunca respondeu: "de que ela e
   feita?". Quantas bancadas existem, e de que tamanho. Sao duas perguntas, e a
   segunda nao substitui a primeira.

   ── AS CORES SAO AS DA SAUDE, e nao um vocabulario de partido ───────────────
   ⚠ COR DE PARTIDO FOI RECUSADA TRES VEZES, e a razao nao mudou: o modelo nao tem
   "oposicao", e a paleta ja gasta verde em ALTA e vermelho em CRISE — pintar
   ideologia com os mesmos tons faria um bloco parecer bom e o outro parecer perigo.
   Entao a composicao aparece pelo AGRUPAMENTO, e nao pela cor: cada bancada e uma
   cunha contigua, separada da vizinha por um vao, e o tamanho dela se lê no espaco
   que ela ocupa.

   ── A ORDEM E IDEOLOGICA, e ela sai do motor ────────────────────────────────
   As bancadas sao assentadas da esquerda para a direita pela posicao ECONOMICA
   delas, que e como um plenario de verdade se organiza — e que o modelo ja sabe,
   porque e o mesmo eixo com que ECLUSA decide quem vota a favor. Nenhum numero novo:
   uma ordenacao.

   ── A CADEIRA CHEIA E A CADEIRA VAZADA ──────────────────────────────────────
   Preenchida quando aquela cadeira esta ENTREGUE ao governo, vazada quando nao.
   Quem faz essa conta e `seating`, no motor — a mesma `moodFactor` que produz o
   numero da base. A tela nao arredonda por fora: ela pergunta e desenha. */

import { escapeHtml } from "./html.mjs";

/* ── A GEOMETRIA ─────────────────────────────────────────────────────────────
   FILEIRAS, e nao um anel so: 513 pontos numa unica curva seriam pontos de menos
   de um pixel num cartao de 340px. Oito fileiras poem cerca de 64 cadeiras em
   cada uma, que e o ponto em que um circulo de 2,4 de raio ainda se distingue do
   vizinho.

   AS FILEIRAS DE FORA LEVAM MAIS CADEIRAS, porque sao mais compridas — a fatia de
   cada uma e proporcional ao raio dela. Distribuir igual apertaria as de dentro e
   deixaria as de fora ralas, e o desenho pareceria um erro de calculo. */
const ROWS = 8;
const INNER = 26;
const OUTER = 47;

/**
 * OS 513 LUGARES, do mais a esquerda ao mais a direita.
 *
 * @param {number} total
 * @returns {{ x: number, y: number }[]}
 */
function seatsOf(total) {
  /** @type {number[]} */
  const radii = [];
  for (let row = 0; row < ROWS; row++) {
    radii.push(INNER + ((OUTER - INNER) * row) / (ROWS - 1));
  }

  const span = radii.reduce((sum, radius) => sum + radius, 0);

  /** @type {number[]} */
  const perRow = radii.map(radius => Math.round((total * radius) / span));

  /* ⚠ O ARREDONDAMENTO TEM DE FECHAR EM 513, e a sobra vai para a fileira mais
     longa. Sem esta correcao o plenario desenhado teria 511 ou 515 cadeiras
     conforme a aritmetica do dia — e um hemiciclo que nao soma o plenario e
     exatamente o defeito que `chamberMismatch` existe para pegar no catalogo. */
  const drawn = perRow.reduce((sum, count) => sum + count, 0);
  perRow[ROWS - 1] = (perRow[ROWS - 1] ?? 0) + (total - drawn);

  /** @type {{ x: number, y: number, angle: number, radius: number }[]} */
  const places = [];
  radii.forEach((radius, row) => {
    const count = perRow[row] ?? 0;
    for (let index = 0; index < count; index++) {
      /* O SEMICIRCULO VAI DE 180° A 0°, e o meio-passo (`+ 0.5`) e o que impede a
         primeira e a ultima cadeira de encostarem na linha do chao. */
      const t = count === 1 ? 0.5 : (index + 0.5) / count;
      const angle = Math.PI * (1 - t);
      places.push({
        x: 50 + radius * Math.cos(angle),
        y: 52 - radius * Math.sin(angle),
        angle,
        radius,
      });
    }
  });

  /* ⚠ A ORDENACAO E POR ANGULO, E ELA E O QUE TORNA A BANCADA CONTIGUA. Sem ela,
     os lugares sairiam fileira por fileira e uma bancada de 205 cadeiras viraria as
     duas fileiras de dentro inteiras em vez de uma cunha — o desenho pareceria um
     grafico de barras curvas, e nao um plenario. */
  return places.sort((a, b) => b.angle - a.angle).map(({ x, y }) => ({ x, y }));
}

/**
 * @param {object} input
 * @param {ReadonlyArray<{ id: string, label: string, economic: number, seats: number,
 *   delivered: number, mood: string }>} input.benches
 * @param {number} input.total o plenario inteiro
 * @returns {string}
 */
export function hemicycleHtml({ benches, total }) {
  const places = seatsOf(total);

  /* DA ESQUERDA PARA A DIREITA PELO EIXO ECONOMICO — a ordem de um plenario de
     verdade, e o modelo ja tem o eixo. */
  const seated = [...benches].sort((a, b) => a.economic - b.economic);

  let cursor = 0;
  let dots = "";

  for (const bench of seated) {
    const count = Math.round(bench.seats);
    /* QUANTAS DESTAS CADEIRAS O GOVERNO DE FATO TEM. A conta e do motor; aqui so
       se decide onde a fronteira entre cheio e vazado cai dentro da cunha. */
    const filled = Math.round(bench.delivered);

    for (let index = 0; index < count; index++) {
      const place = places[cursor];
      cursor++;
      if (!place) continue;

      dots +=
        `<circle class="seat" data-mood="${escapeHtml(bench.mood)}" ` +
        `data-held="${index < filled}" ` +
        `cx="${place.x.toFixed(2)}" cy="${place.y.toFixed(2)}" r="1.5" />`;
    }

    /* ⚠ O VAO ENTRE BANCADAS E UMA CADEIRA PULADA, e nao um espaco desenhado. E o
       mesmo recurso do arco segmentado, e ele custa uma cadeira de cada cunha — por
       isso o plenario e desenhado com o total CHEIO e o vao sai de dentro dele, em
       vez de o desenho passar a somar 513 mais os vaos. */
    cursor = Math.min(places.length, cursor + 1);
  }

  const held = benches.reduce((sum, bench) => sum + bench.delivered, 0);

  return (
    `<svg class="hemicycle" viewBox="0 0 100 56" role="img" ` +
    `aria-label="${escapeHtml(
      `${Math.round(held)} de ${total} cadeiras respondem ao governo, ` +
        `em ${benches.length} bancadas`,
    )}">${dots}</svg>`
  );
}
