/* A CABECA DE UMA TELA — a mesma em todas elas. View PURA.
   ══════════════════════════════════════════════════════════════════════════════

   ── POR QUE ELA VIROU UMA PECA SO ────────────────────────────────────────────
   Porque as cinco telas montavam a propria, e elas nao eram iguais. Levantadas
   lado a lado, o desvio era este:

     GABINETE   "o resumo da república" / "Gabinete"   + a leitura do mes
     FINANCAS   "o placar"              / "Finanças"
     O ESTADO   "a moldura"             / "O Estado"
     AREA       "atendimento"           / "61"          ← e aqui o padrao quebra
     CONGRESSO  — nao tinha cabeca nenhuma —

   Em tres telas o par e `categoria / NOME DA TELA`. Na area ele e
   `nome do indice / NUMERO`, o que significa que a tela de um ministerio nunca
   dizia de qual ministerio ela era: quem chegava nela via "ATENDIMENTO 61" e
   precisava conferir o rail para saber que estava na Saude. E o Congresso, que e
   a tela onde o mes se decide, nao se apresentava de jeito nenhum.

   ── A FORMA, E ELA E UMA SO ──────────────────────────────────────────────────
   A esquerda, QUEM E A TELA: um rotulo de categoria e o nome. A direita, o que
   ela tem a dizer de si mesma AGORA — o veredito no Gabinete, o indice na area —,
   e nada quando nao ha o que dizer.

   ⚠ A LEITURA E OPCIONAL, E O VAZIO E VAZIO. Financas e O Estado nao tem leitura
   de cabeca, e a peca nao inventa uma: um lugar reservado com um travessao dentro
   ensina o olho a procurar informacao onde nunca vai haver. Ausencia declarada
   vale para o layout tambem — o que se declara aqui e nao desenhando nada. */

import { escapeHtml } from "./html.mjs";

/**
 * @param {object} input
 * @param {string} input.eyebrow o rotulo de categoria; o que ESTA tela e
 * @param {string} input.title o nome dela, e ele e sempre um nome
 * @param {{ label: string, value: string }} [input.reading] o que ela diz de si
 *   agora. `value` entra como HTML ja montado, porque em duas telas ele carrega
 *   marcacao — a escada de tendencia e o tom do veredito.
 * @returns {string}
 */
export function headHtml({ eyebrow, title, reading }) {
  return (
    `<div class="area__head">` +
    `<div>` +
    `<p class="area__eyebrow">${escapeHtml(eyebrow)}</p>` +
    `<p class="area__value">${escapeHtml(title)}</p>` +
    `</div>` +
    (reading
      ? `<div class="head__reading">` +
        `<p class="head__label">${escapeHtml(reading.label)}</p>` +
        reading.value +
        `</div>`
      : "") +
    `</div>`
  );
}
