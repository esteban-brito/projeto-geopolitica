/* Escape central.
   Toda string que vira HTML passa por aqui — inclusive as que "obviamente" são seguras hoje,
   porque o catálogo vai ser EDITÁVEL pelo jogador e nesse dia nenhuma string e obviamente
   segura. */

/** @param {unknown} value */
export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
