/* OS GLIFOS — 16px, traco de `currentColor`, e eles sao UM conjunto para o projeto inteiro.
   ⚠ ELES MORAVAM EM `rail.mjs`, e sairam de la quando a coluna do Gabinete passou a pedir os
   mesmos: dois arquivos com o mesmo desenho e como uma paleta comeca a divergir. */

/* Icones em SVG inline, 16px, traco de `currentColor`. */
export const ICONS = /** @type {Record<string, string>} */ ({
  cabinet:
    '<rect x="2.5" y="4.5" width="11" height="9" rx="2"/><path d="M6 4.5V3.2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.3"/><path d="M2.5 8.5h11"/>',
  congress: '<path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h7"/><circle cx="12" cy="11.5" r="1.6"/>',
  /* Uma linha subindo dentro de uma moldura: o placar e uma serie, e nao um cofre. */
  finance:
    '<rect x="2.5" y="2.5" width="11" height="11" rx="3"/><path d="m5 10.5 2.4-2.6 2 1.7 2.6-3"/>',
  treasury: '<rect x="2.5" y="4.5" width="11" height="8" rx="2"/><path d="M10 8.5h3.5"/>',
  /* Um talo com duas folhas para a lavoura, e a silhueta de fabrica para o parque produtivo. */
  agriculture:
    '<path d="M8 13.5V6"/><path d="M8 8.5C8 6 6 4.5 3.5 4.5 3.5 7 5.5 8.5 8 8.5z"/>' +
    '<path d="M8 7.5c0-2.5 2-4 4.5-4 0 2.5-2 4-4.5 4z"/>',
  industry: '<path d="M2.5 13.5h11"/><path d="M3.5 13.5V7l3.5 2.5V7l3.5 2.5V4.5h2v9"/>',
  welfare:
    '<path d="M8 13.5S2.5 10.2 2.5 6.6A2.6 2.6 0 0 1 8 5a2.6 2.6 0 0 1 5.5 1.6c0 3.6-5.5 6.9-5.5 6.9z"/>',
  health: '<path d="M8 3.5v9M3.5 8h9"/><rect x="2.5" y="2.5" width="11" height="11" rx="3"/>',
  education:
    '<path d="M8 3 14.5 6 8 9 1.5 6z"/><path d="M4.5 7.4v3.4c0 .9 1.6 1.7 3.5 1.7s3.5-.8 3.5-1.7V7.4"/>',
  security: '<path d="M8 2.5 13 4.5v4c0 3-2.2 4.6-5 5.5-2.8-.9-5-2.5-5-5.5v-4z"/>',
  opinion: '<path d="M13.5 9a2 2 0 0 1-2 2H6l-3.5 2.5V4.5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2z"/>',
  estado: '<path d="M8 2.5 2.5 5.5v1h11v-1z"/><path d="M4 6.5v5M8 6.5v5M12 6.5v5M2 13.5h12"/>',
  /* ⚠ DOIS VITAIS USAVAM GLIFO DE OUTRO SIGNIFICADO ate a barra ser refeita: `finance` e a
     tela de Financas — uma linha dentro de uma MOLDURA, a mesma caixa que saiu dos icones —,
     e `graph` e o grafo de causas. Nenhum dos dois nomeia PIB nem preco.
     ⚠ E O TRACO DO PIB E 1,9 E NAO 1,3: com o traco comum a mancha media 11 contra 18, 19 e
     20 dos outros tres — tres hastes soltas poem menos tinta que um contorno fechado. */
  /* A seta dupla do botao de avancar: o gesto de atravessar o mes, e nao um enfeite. */
  chevron: '<path d="M3.5 3.5 8 8l-4.5 4.5"/><path d="M9 3.5 13.5 8 9 12.5"/>',
  gdp: '<g stroke-width="1.9"><path d="M3.6 13V9"/><path d="M8 13V5.8"/><path d="M12.4 13V3"/></g>',
  /* A etiqueta de preco: nenhum outro glifo do conjunto e uma etiqueta. */
  prices:
    '<path d="M8.7 2.6h4a.7.7 0 0 1 .7.7v4a1 1 0 0 1-.3.7l-5.4 5.4a1 1 0 0 1-1.4 0' +
    'L2.6 9.7a1 1 0 0 1 0-1.4L8 2.9a1 1 0 0 1 .7-.3z"/><circle cx="10.9" cy="5.1" r="1"/>',
  /* ⚠ OS DOIS ULTIMOS NASCERAM COM A COLUNA DO GABINETE, e nao com o rail: nenhuma tela
     tinha glifo para RISCO nem para GRUPO DE PRESSAO. O triangulo de aviso e o unico simbolo
     de alerta que nao precisa ser aprendido; o grupo e tres silhuetas, porque quem derruba um
     governo e gente e nao um indicador. */
  risk: '<path d="M8 2.6 14.5 13.4h-13z"/><path d="M8 6.6v3.2"/><path d="M8 11.6h.01"/>',
  pressure:
    '<circle cx="5" cy="5.6" r="1.9"/><circle cx="11" cy="5.6" r="1.9"/>' +
    '<path d="M1.8 12.6c0-1.9 1.4-3.1 3.2-3.1s3.2 1.2 3.2 3.1"/>' +
    '<path d="M7.8 12.6c0-1.9 1.4-3.1 3.2-3.1s3.2 1.2 3.2 3.1"/>',
  graph:
    '<circle cx="4" cy="4.5" r="1.6"/><circle cx="12" cy="6.5" r="1.6"/>' +
    '<circle cx="7" cy="12" r="1.6"/><path d="m5.5 5 5 1.2M11 7.8 8.2 10.7M4.9 6l1.6 4.5"/>',
});

/* Formas genericas para uma area que o catalogo ganhar depois. */
export const FALLBACK = '<rect x="2.5" y="2.5" width="11" height="11" rx="3"/>';

/**
 * O glifo de uma chave, ou a forma generica.
 *
 * @param {string} key
 * @param {string} [className]
 * @returns {string}
 */
export function iconHtml(key, className = "icon") {
  return (
    `<svg class="${className}" viewBox="0 0 16 16" aria-hidden="true" fill="none" ` +
    `stroke="currentColor" stroke-width="1.4" stroke-linecap="round" ` +
    `stroke-linejoin="round">${ICONS[key] ?? FALLBACK}</svg>`
  );
}
