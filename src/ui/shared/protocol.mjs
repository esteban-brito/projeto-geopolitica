/* O NUP — o numero unico de protocolo do processo no SEI, que os dois papeis da pasta carregam no
   alto a direita, como os oficios reais da Presidencia. 00001 e o codigo da Presidencia da
   Republica na tabela de orgaos; a sequencia e a da EM do ano; o ano e o do mandato. */

import { monthParts } from "../../state/state.mjs";

/**
 * 📗 O DIGITO VERIFICADOR E MODULO 11 (Portaria Interministerial MJ/MP 11/2019, Anexo): os 15
 * algarismos pesam 16..2 da esquerda para a direita, resto da divisao por 11, DV = 11 − resto,
 * com 10 → 0 e 11 → 1; o segundo DV repete a conta sobre os 16 algarismos, com pesos 17..2.
 *
 * @param {string} digits os 15 algarismos, sem pontuacao
 * @returns {string} os dois digitos
 */
export function nupCheck(digits) {
  /** @param {string} value */
  const dv = value => {
    const sum = [...value].reduce((acc, ch, i) => acc + Number(ch) * (value.length + 1 - i), 0);
    const rest = 11 - (sum % 11);
    return rest === 10 ? 0 : rest === 11 ? 1 : rest;
  };
  const first = dv(digits);
  return `${first}${dv(digits + first)}`;
}

/**
 * O PROTOCOLO DO MES: a EM e numerada por ano, e o processo dela leva o mesmo numero.
 *
 * @param {number} month o mes do mandato
 * @returns {{ number: number, year: number, nup: string }}
 */
export function protocolOf(month) {
  const { year } = monthParts(month);
  const number = (month % 12) + 1;
  const organ = "00001";
  const sequence = String(number).padStart(6, "0");
  const digits = `${organ}${sequence}${year}`;
  return { number, year, nup: `${organ}.${sequence}/${year}-${nupCheck(digits)}` };
}
