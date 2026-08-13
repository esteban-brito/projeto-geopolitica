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

import { AREAS, AREA_SCHEMA } from "./areas.mjs";
import { BILLS, BILL_SCHEMA } from "./bills.mjs";
import { FISCAL, FISCAL_SCHEMA } from "./fiscal.mjs";
import { PARTIES, PARTY_SCHEMA } from "./parties.mjs";
import { REGIME, REGIME_SCHEMA } from "./regime.mjs";
import { collectionViolations, violations } from "./schema.mjs";

export const CATALOG = {
  parties: PARTIES,
  areas: AREAS,
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
    ...collectionViolations(AREA_SCHEMA, AREAS, "areas"),
    ...collectionViolations(BILL_SCHEMA, BILLS, "bills"),
    ...violations(FISCAL_SCHEMA, FISCAL, "fiscal"),
    ...violations(REGIME_SCHEMA, REGIME, "regime"),
    /* REFERENCIA CRUZADA, que nenhum esquema sozinho consegue ver. Acao apontando
       para area que nao existe nao quebra nada na carga — ela simplesmente
       desaparece da tela da area, e o sintoma e "sumiu uma lei", tres telas longe
       da causa, que e um id digitado errado aqui. */
    ...danglingAreas(),
    /* O PLENARIO TEM DE FECHAR. As bancadas somam cadeiras e o regime declara
       quantas existem; se os dois divergirem, toda maioria do jogo passa a ser
       medida contra um plenario que nao existe — e nenhuma tela denuncia, porque
       cada lado esta certo sozinho. */
    ...chamberMismatch(),
  ];
}

/** @returns {string[]} */
function chamberMismatch() {
  const seats = PARTIES.reduce((total, party) => total + party.seats, 0);
  if (seats === REGIME.seats) return [];
  return [`regime: as bancadas somam ${seats} cadeiras e o plenario tem ${REGIME.seats}`];
}

/** @returns {string[]} */
function danglingAreas() {
  const known = new Set(AREAS.map(area => area.id));
  return BILLS.filter(bill => !known.has(bill.area)).map(
    bill => `bills: "${bill.id}" aponta para a area "${bill.area}", que nao existe`,
  );
}
