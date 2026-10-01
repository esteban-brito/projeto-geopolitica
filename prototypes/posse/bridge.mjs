import { CATALOG, posseOf } from "../../src/public/index.mjs";
import { createState, reduce, DEFAULT_SEED } from "../../src/state/state.mjs";

/** @type {Readonly<Record<string, string>>} */
export const PARTY_IDS = Object.freeze({
  pct: "pml",
  psu: "pso",
  ecos: "ecos",
  ftb: "pcs",
  ptp: "ptp",
  patria: "patria",
  mdn: "mdn",
  ace: "pbr",
  pdst: "pdst",
  fdn: "fbr",
  unidos: "unidos",
  campo: "pab",
  crista: "acf",
  direita: "pcn",
  fp: "vanguarda",
  liber: "pli",
});

/** @type {Readonly<Record<string, string>>} */
export const OFFICE_IDS = Object.freeze({
  "casa-civil": "casa-civil",
  fazenda: "fazenda",
  planejamento: "planejamento-e-orcamento",
  "relacoes-institucionais": "relacoes-institucionais",
  justica: "justica-e-seguranca-publica",
  defesa: "defesa",
  saude: "saude",
  educacao: "educacao",
  "secretaria-geral": "secretaria-geral",
  comunicacao: "comunicacao-social",
  gsi: "seguranca-institucional",
  agu: "advocacia-geral-da-uniao",
  agricultura: "agricultura-e-pecuaria",
  industria: "desenvolvimento-industria",
  previdencia: "previdencia-social",
  cidades: "cidades",
  cultura: "cultura",
  ciencia: "ciencia-tecnologia-e-inovacao",
  comunicacoes: "comunicacoes",
  agrario: "desenvolvimento-agrario",
  integracao: "integracao-e-desenvolvimento-regional",
  social: "desenvolvimento-social",
  direitos: "direitos-humanos",
  empreendedorismo: "empreendedorismo",
  esporte: "esporte",
  gestao: "gestao-e-inovacao",
  igualdade: "igualdade-racial",
  "meio-ambiente": "meio-ambiente",
  minas: "minas-e-energia",
  mulheres: "mulheres",
  pesca: "pesca-e-aquicultura",
  portos: "portos-e-aeroportos",
  indigenas: "povos-indigenas",
  exteriores: "relacoes-exteriores",
  trabalho: "trabalho-e-emprego",
  transportes: "transportes",
  turismo: "turismo",
  cgu: "controladoria-geral-da-uniao",
});

/**
 * @typedef {{name: string, fem: boolean, party: string}} President
 * @typedef {{key: string, name: string, party?: string | null}} Nominee
 * @typedef {{into: Record<string, string>, gone: Record<string, unknown>, created: unknown[], changedWork?: boolean}} Structure
 */

/** @param {President} president @param {Record<string, string>} picks @param {Readonly<Record<string, Nominee>>} people @param {Structure} structure @param {number} [seed] */
function mapPosse(president, picks, people, structure, seed = DEFAULT_SEED) {
  const unknown = /** @param {string} reason */ reason => ({
    status: /** @type {const} */ ("unknown"),
    reason,
  });
  if (
    Object.keys(structure.into).length ||
    Object.keys(structure.gone).length ||
    structure.created.length ||
    structure.changedWork
  )
    return unknown("A estimativa aguarda os efeitos desta reforma.");
  const party = Object.hasOwn(PARTY_IDS, president.party) ? PARTY_IDS[president.party] : undefined;
  if (!party) return unknown("Escolha um partido para estimar a base.");
  /** @type {Record<string, import("../../src/state/state.mjs").Appointee>} */
  const cabinet = {};
  const assigned = new Set();
  for (const [legacySeat, key] of Object.entries(picks)) {
    const seat = Object.hasOwn(OFFICE_IDS, legacySeat) ? OFFICE_IDS[legacySeat] : undefined;
    const person = Object.hasOwn(people, key) ? people[key] : undefined;
    if (!seat || !person || person.key !== key || assigned.has(key))
      return unknown("Nomeação sem identidade conhecida ou repetida.");
    const affiliation =
      person.party === null || person.party === undefined
        ? null
        : Object.hasOwn(PARTY_IDS, person.party)
          ? PARTY_IDS[person.party]
          : undefined;
    if (affiliation === undefined)
      return unknown("Partido da pessoa sem correspondência conhecida.");
    assigned.add(key);
    cabinet[seat] = { id: key, name: person.name, party: affiliation };
  }
  return { status: /** @type {const} */ ("estimated"), seed, party, cabinet };
}

/** @param {President} president @param {Record<string, string>} picks @param {Readonly<Record<string, Nominee>>} people @param {Structure} structure @param {number} [seed] */
export function previewPosse(president, picks, people, structure, seed = DEFAULT_SEED) {
  const mapped = mapPosse(president, picks, people, structure, seed);
  return mapped.status === "unknown" ? mapped : { status: mapped.status, support: posseOf(mapped) };
}

/** @param {President} president @param {Record<string, string>} picks @param {Readonly<Record<string, Nominee>>} people @param {Structure} structure @param {number} [seed] */
export function readPosse(president, picks, people, structure, seed = DEFAULT_SEED) {
  const mapped = mapPosse(president, picks, people, structure, seed);
  if (mapped.status === "unknown") return mapped;
  const named = president.name.trim();
  let state = createState(
    seed,
    CATALOG,
    named ? { name: named, treatment: president.fem ? "senhora" : "senhor" } : null,
    mapped.party,
  );
  for (const [seat, appointee] of Object.entries(mapped.cabinet))
    state = reduce(state, { type: "appoint", seat, appointee });
  return { status: /** @type {const} */ ("estimated"), state, support: posseOf(state) };
}
