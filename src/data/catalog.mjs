/* O CATALOGO — o indice de todo dado do projeto. */

import { AREAS, AREA_SCHEMA } from "./areas.mjs";
import { BILLS, BILL_SCHEMA } from "./bills.mjs";
import {
  AMBITIONS,
  ARCHETYPES,
  ARCHETYPE_SCHEMA,
  CAST,
  CAST_SCHEMA,
  FIRST_NAMES,
  SURNAMES,
} from "./cast.mjs";
import { FISCAL, FISCAL_SCHEMA } from "./fiscal.mjs";
import { MACRO, MACRO_SCHEMA } from "./macro.mjs";
import { OPINION, OPINION_SCHEMA, SEGMENTS, SEGMENT_SCHEMA } from "./opinion.mjs";
import { PARTIES, PARTY_SCHEMA } from "./parties.mjs";
import { GUARDS, PROGRAMS, PROGRAM_SCHEMA } from "./programs.mjs";
import { REGIME, REGIME_SCHEMA } from "./regime.mjs";
import { RULES, RULE_SCHEMA } from "./rules.mjs";
import { LOBBIES, LOBBY_SCHEMA, PRESSURE, PRESSURE_SCHEMA } from "./lobbies.mjs";
import { collectionViolations, violations } from "./schema.mjs";

export const CATALOG = {
  parties: PARTIES,
  areas: AREAS,
  bills: BILLS,
  programs: PROGRAMS,
  rules: RULES,
  fiscal: FISCAL,
  macro: MACRO,
  segments: SEGMENTS,
  opinion: OPINION,
  archetypes: ARCHETYPES,
  cast: CAST,
  lobbies: LOBBIES,
  pressure: PRESSURE,
  firstNames: FIRST_NAMES,
  surnames: SURNAMES,
  ambitions: AMBITIONS,
};

/**
 * Ele NAO roda sozinho na carga do modulo, e isso e decisao: validacao que dispara no
 * `import` quebra a tela no navegador por causa de um numero errado no catalogo, e o lugar de
 * descobrir isso e a suite, antes de publicar.
 *
 * @returns {string[]} lista vazia quando o catalogo esta integro
 */
export function catalogViolations() {
  return [
    ...collectionViolations(PARTY_SCHEMA, PARTIES, "parties"),
    ...collectionViolations(AREA_SCHEMA, AREAS, "areas"),
    ...collectionViolations(BILL_SCHEMA, BILLS, "bills"),
    ...collectionViolations(PROGRAM_SCHEMA, PROGRAMS, "programs"),
    ...collectionViolations(RULE_SCHEMA, RULES, "rules"),
    ...violations(FISCAL_SCHEMA, FISCAL, "fiscal"),
    ...violations(MACRO_SCHEMA, MACRO, "macro"),
    ...collectionViolations(SEGMENT_SCHEMA, SEGMENTS, "segments"),
    ...violations(OPINION_SCHEMA, OPINION, "opinion"),
    ...violations(REGIME_SCHEMA, REGIME, "regime"),
    ...collectionViolations(ARCHETYPE_SCHEMA, ARCHETYPES, "archetypes"),
    ...violations(CAST_SCHEMA, CAST, "cast"),
    ...collectionViolations(LOBBY_SCHEMA, LOBBIES, "lobbies"),
    ...violations(PRESSURE_SCHEMA, PRESSURE, "pressure"),
    /* REFERENCIA CRUZADA, que nenhum esquema sozinho consegue ver. */
    ...danglingAreas(),
    /* PROGRAMA APONTANDO PARA AREA QUE NAO EXISTE tem sintoma pior que o da lei: a lei some
       da tela, o programa some do ORCAMENTO — e o pais passa a gastar menos do que gasta sem
       ninguem ter decidido nada. */
    ...danglingPrograms(),
    /* GUARDA DESCONHECIDA e o defeito silencioso deste catalogo: quem compoe a pauta cai no
       padrao "lei" para uma guarda que ninguem reconhece, e um piso constitucional digitado
       errado passaria a custar 257 votos em vez de 308. */
    ...unknownGuards(),
    /* As bancadas somam cadeiras e o regime declara quantas existem; se os dois divergirem,
       toda maioria do jogo passa a ser medida contra um plenario que nao existe — e nenhuma
       tela denuncia, porque cada lado esta certo sozinho. */
    ...chamberMismatch(),
    /* A POPULACAO TEM DE FECHAR. */
    ...populationMismatch(),
    /* ARQUETIPO APONTANDO PARA BLOCO QUE NAO EXISTE some do elenco em silencio: a pessoa
       simplesmente nao nasce, e o sintoma e um Congresso com um lider a menos — que e um
       estado de jogo valido e portanto indistinguivel de um defeito. */
    ...danglingArchetypes(),
    /* NOME REPETIDO NO VOCABULARIO nao quebra nada e estreita o elenco em silencio: duas
       entradas iguais viram uma, e o gerador passa a ter menos combinacoes do que o catalogo
       aparenta oferecer. */
    ...duplicateNames(),
  ];
}

/** @returns {string[]} */
function danglingArchetypes() {
  const known = new Set(PARTIES.map(party => party.id));
  return ARCHETYPES.filter(archetype => !known.has(archetype.bloc)).map(
    archetype => `archetypes: "${archetype.id}" sai do bloco "${archetype.bloc}", que nao existe`,
  );
}

/** @returns {string[]} */
function duplicateNames() {
  /** @type {string[]} */
  const found = [];
  for (const [where, list] of /** @type {const} */ ([
    ["firstNames", FIRST_NAMES],
    ["surnames", SURNAMES],
  ])) {
    const seen = new Set();
    for (const name of list) {
      if (seen.has(name)) found.push(`cast: "${name}" aparece mais de uma vez em ${where}`);
      seen.add(name);
    }
  }
  return found;
}

/** @returns {string[]} */
function populationMismatch() {
  const share = SEGMENTS.reduce((total, segment) => total + segment.share, 0);
  if (Math.abs(share - 1) < 1e-9) return [];
  return [`segments: as fatias somam ${share.toFixed(3)} e a populacao e 1`];
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

/** @returns {string[]} */
function danglingPrograms() {
  const known = new Set(AREAS.map(area => area.id));
  return PROGRAMS.filter(program => !known.has(program.area)).map(
    program => `programs: "${program.id}" aponta para a area "${program.area}", que nao existe`,
  );
}

/** @returns {string[]} */
function unknownGuards() {
  const known = new Set(GUARDS);
  return PROGRAMS.filter(program => !known.has(/** @type {never} */ (program.guard))).map(
    program => `programs: "${program.id}" tem guarda "${program.guard}", que nao existe`,
  );
}
