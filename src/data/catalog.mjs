/* O CATALOGO — o indice de todo dado do projeto.
   ══════════════════════════════════════════════════════════════════════════════

   UM lugar sabe o que existe. Motor nao importa arquivo de dado direto: ele
   recebe o que precisa por parametro, e quem monta o parametro parte daqui.
   A razao e a mesma da fronteira de dominio — dado alcancado de qualquer lugar
   vira dado alterado de qualquer lugar, e ai nao existe mais fronteira de
   validacao, so um costume.

   ESTE ARQUIVO NAO DECLARA DADO. Ele reune e valida. Quem declara e o modulo do
   assunto, ao lado do esquema que o descreve — e `tests/guards/schema.mjs`
   prova que nenhum esquema fica de fora da validacao daqui. */

import { BILLS, BILL_SCHEMA } from "./bills.mjs";
import { FISCAL, FISCAL_SCHEMA } from "./fiscal.mjs";
import { PARTIES, PARTY_SCHEMA } from "./parties.mjs";
import { collectionViolations, violations } from "./schema.mjs";

export const CATALOG = {
  parties: PARTIES,
  bills: BILLS,
  fiscal: FISCAL,
};

/**
 * Confere o catalogo inteiro contra os esquemas declarados.
 *
 * Ele NAO roda sozinho na carga do modulo, e isso e decisao: validacao que
 * dispara no `import` quebra a tela no navegador por causa de um numero errado
 * no catalogo, e o lugar de descobrir isso e a suite, antes de publicar. Quem
 * quiser conferir em runtime chama; quem nao chamar tem a suite cobrindo.
 *
 * @returns {string[]} lista vazia quando o catalogo esta integro
 */
export function catalogViolations() {
  return [
    ...collectionViolations(PARTY_SCHEMA, PARTIES, "parties"),
    ...collectionViolations(BILL_SCHEMA, BILLS, "bills"),
    ...violations(FISCAL_SCHEMA, FISCAL, "fiscal"),
  ];
}
