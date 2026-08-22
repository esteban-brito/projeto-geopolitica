/* A FITA DO PLENÁRIO — a Câmara em cinco faixas, da esquerda à direita. View PURA.
   ══════════════════════════════════════════════════════════════════════════════

   ── ELA SUBSTITUIU O HEMICICLO, E A SUBSTITUIÇÃO É A DECISÃO ────────────────
   O hemiciclo desenhava 513 círculos num arco e custava 170px de uma coluna de 899.
   Duas auditorias externas independentes o leram como pixel caro, e as duas leram o
   MÊS 1 — onde elas estão certas: as bancadas nascem no mesmo humor e o arco inteiro
   sai de uma cor só.

   ── O QUE CADA COISA DIZ, e por que nada repete nada ────────────────────────
     LARGURA          quantas cadeiras aquela faixa tem — a soma fecha em 513
     ORDEM E COR      onde ela está no eixo econômico, da esquerda à direita
     PREENCHIMENTO    quanto daquela faixa responde ao governo, hoje
     A LINHA          onde a maioria simples fecha

   ⚠ A COR ERA O HUMOR E ISSO ERA DUPLICAÇÃO: no motor, `delivered = cadeiras ×
   moodFactor(lealdade)`, então o comprimento preenchido JÁ É o humor em forma
   contínua. Liberada, a cor passou a dizer a posição — a única coisa que o desenho
   não dizia.

   ⚠ E ELA PASSOU A DESENHAR CINCO BLOCOS, E NÃO ONZE, em 20/08/2026. O responsável
   olhou a versão anterior e disse: "a barra ali do congresso tá muito confusa". Ele
   estava certo, e a causa era geométrica: as onze bancadas eram desenhadas uma a uma,
   e duas vizinhas da MESMA faixa saíam como dois blocos da mesma cor separados por um
   vão — o olho lia uma fronteira onde não havia nenhuma, e contava mais divisões do
   que o eixo tem. Agora as vizinhas de mesma faixa se somam num bloco só: o número de
   divisões na tela passa a ser o número de divisões que existem.

   ── AS CORES SÃO AS QUE ELE PEDIU, e a ordem é a dele ───────────────────────
   Vermelho, vermelho alaranjado, amarelo, verde e verde azulado escuro. Elas foram
   escolhidas por ele olhando a tela, e a escolha VENCE a regra que este projeto tinha
   sobre cor de bancada — ver a nota nos tokens, onde a colisão está registrada por
   escrito em vez de resolvida em silêncio.

   ⚠ E A FITA NÃO ESCREVE UMA PALAVRA DENTRO DE SI, que era o pedido original: os
   únicos nomes ficam embaixo, e são os dois POLOS, com o vocabulário do próprio
   catálogo — `economic` é declarado de 0 a 100, "0 é máxima intervenção, 100 é máximo
   mercado". Escrever "esquerda" e "direita" importaria uma taxonomia que o modelo não
   tem: ele tem DUAS dimensões. */

import { escapeHtml } from "./html.mjs";
import { seats } from "./format.mjs";
import { UI } from "../strings.mjs";

/* CINCO FAIXAS. Cinco é o que o olho ordena sem chave: com sete a rampa vira
   gradiente e a posição de um bloco deixa de ser legível; com três, o centro engole
   metade da Câmara. */
const STOPS = 5;

/**
 * EM QUE FAIXA DO EIXO UMA BANCADA CAI.
 *
 * ⚠ A RÉGUA É DO CATÁLOGO, e não desta view: `economic` é declarado de 0 a 100 em
 * `parties.mjs`. Dividir uma régua declarada em quintos iguais é quantização; o que
 * seria invenção é escolher pontos de corte próprios, e não há nenhum aqui.
 *
 * @param {number} economic de 0 a 100
 * @returns {number} de 1 a 5
 */
function stopOf(economic) {
  const index = Math.floor((economic / 100) * STOPS);
  return Math.min(STOPS, Math.max(1, index + 1));
}

/**
 * @param {object} input
 * @param {ReadonlyArray<{ id: string, label: string, economic: number, seats: number,
 *   delivered: number, mood: string }>} input.benches
 * @param {number} input.total o plenário inteiro
 * @param {number} input.majority quantos votos fecham uma maioria simples
 * @returns {string}
 */
export function ribbonHtml({ benches, total, majority }) {
  /* AS FAIXAS SE SOMAM, e a soma é o conserto da confusão. Cada faixa junta as
     cadeiras e a entrega de todas as bancadas que caem nela — e uma faixa sem
     ninguém não vira bloco, pela mesma regra que governava a legenda do arco: só
     entra no desenho quem tem cadeira. */
  /** @type {Map<number, { seats: number, delivered: number }>} */
  const bands = new Map();
  for (const bench of benches) {
    const stop = stopOf(bench.economic);
    const band = bands.get(stop) ?? { seats: 0, delivered: 0 };
    band.seats += bench.seats;
    band.delivered += bench.delivered;
    bands.set(stop, band);
  }

  const blocks = [...bands.entries()]
    .sort(([a], [b]) => a - b)
    .map(([stop, band]) => {
      /* ⚠ A FRAÇÃO ENTREGUE É A ÚNICA CONTA DESTA VIEW. Quem produz `delivered` é o
         motor — aqui só se decide onde a fronteira entre cheio e vazio cai dentro do
         bloco. */
      const held = band.seats > 0 ? Math.min(1, band.delivered / band.seats) : 0;

      return (
        `<span class="ribbon__bench" data-axis="${stop}" ` +
        `style="flex-grow:${band.seats.toFixed(1)}">` +
        `<span class="ribbon__held" style="flex-basis:${(held * 100).toFixed(1)}%"></span>` +
        `</span>`
      );
    })
    .join("");

  const held = benches.reduce((sum, bench) => sum + bench.delivered, 0);

  /* ONDE A LINHA CAI. Ela é posição e não valor, então vai em estilo inline — a
     mesma exceção declarada do `--floor` no trilho do orçamento. */
  const at = total > 0 ? (majority / total) * 100 : 50;

  return (
    `<div class="ribbon" role="img" ` +
    `aria-label="${escapeHtml(
      `${Math.round(held)} de ${total} ${UI.cabinet.ribbonRead} ` +
        `${bands.size} ${UI.cabinet.ribbonBenches} ${majority}`,
    )}">` +
    blocks +
    `<span class="ribbon__majority" style="left:${at.toFixed(2)}%"></span>` +
    `</div>` +
    /* ⚠ CINCO CORES SEM CHAVE É UM GRÁFICO QUE SÓ O AUTOR LÊ, e este projeto já pagou
       um dia inteiro por isso. Mas a chave de uma RAMPA não é uma lista de cinco
       itens: é o nome dos dois POLOS — quem sabe onde ficam as pontas ordena o meio
       sozinho. E o número da maioria fica no centro porque é onde a linha cai. */
    `<p class="ribbon__key">` +
    `<span>${escapeHtml(UI.cabinet.axisLeft)}</span>` +
    `<b>${escapeHtml(UI.cabinet.majority)} <span data-numeric>${seats(majority)}</span></b>` +
    `<span>${escapeHtml(UI.cabinet.axisRight)}</span>` +
    `</p>`
  );
}
