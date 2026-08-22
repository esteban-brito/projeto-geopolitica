/* Escape central.
   Toda string que vira HTML passa por aqui — inclusive as que "obviamente" sao seguras hoje,
   porque o catalogo vai ser EDITAVEL pelo jogador e nesse dia nenhuma string e obviamente
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
