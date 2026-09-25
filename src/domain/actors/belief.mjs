/* A crença — o que se conclui das evidências de um sujeito. O ator a usa pelo `decide`; um
   agregado, no futuro, pela aplicação, sem outro modelo.
   recebe   a crença anterior, as evidências novas, a descrição do sujeito, o prior de quem crê
            para a família dele e o tick
   devolve  a crença revista, ou nenhuma se não restou evidência válida

   A crença é função do conjunto de evidências, e não da ordem nem do agrupamento em ticks. A
   linhagem é a que quem crê reconhece; a causal nunca chega aqui. O prior só puxa a estimativa
   para a expectativa de quem crê, e nunca cria crença. Peso q/(1−q) e confiança são hipótese de
   laboratório. */

/**
 * @typedef {object} Evidence
 * @property {string} subject
 * @property {number} value - na unidade do sujeito
 * @property {number} quality - de 0 a 1: 0 é nula, 1 é certeza
 * @property {string} source - a fonte como quem crê a percebe
 * @property {string} lineage - a identidade da evidência que quem crê reconhece
 * @property {number} asOf - o instante a que o conteúdo se refere
 * @typedef {object} Entry
 * @property {string} lineage
 * @property {string} source
 * @property {number} value
 * @property {number} quality
 * @property {number} asOf
 * @typedef {object} Belief
 * @property {Entry[]} entries - uma por linhagem viva, em ordem de linhagem
 * @property {number} estimate - na unidade do sujeito
 * @property {number} confidence - de 0 a 1, epistemológica: não é verdade nem probabilidade do fato
 * @property {number} updatedAt - o tick da última evidência válida
 * @typedef {object} SubjectSpec
 * @property {string} family
 * @property {number} material - maior que zero, na unidade do sujeito: a menor mudança que conta
 * @property {"latest-per-source" | "none"} supersede - estado atual, ou fatos que coexistem
 * @typedef {object} Prior a expectativa de quem crê antes de qualquer evidência
 * @property {number} value
 * @property {number} weight - maior que zero, em peso de evidência
 */

const POLICIES = new Set(["latest-per-source", "none"]);

/** @param {string} a @param {string} b */
function byId(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * @param {SubjectSpec | undefined} spec
 * @param {string} subject
 * @returns {SubjectSpec}
 */
export function specified(spec, subject) {
  const valid =
    spec !== undefined &&
    typeof spec.family === "string" &&
    spec.material > 0 &&
    Number.isFinite(spec.material) &&
    POLICIES.has(spec.supersede);
  if (!valid || !spec) {
    throw new Error(`sujeito "${subject}" sem familia, mudanca material e supersessao validas`);
  }
  return spec;
}

/** @param {Entry[]} pool @param {SubjectSpec["supersede"]} policy */
function supersede(pool, policy) {
  if (policy === "none") return pool;
  /** @type {Map<string, number>} */
  const latest = new Map();
  for (const entry of pool) {
    latest.set(entry.source, Math.max(latest.get(entry.source) ?? -Infinity, entry.asOf));
  }
  return pool.filter(entry => entry.asOf === latest.get(entry.source));
}

/* Desempatar cópias divergentes da mesma linhagem pelo valor seria arbitrário: sem modelo de
   distorção, não há critério para dizer qual cópia vale. É erro de quem compôs, e a checagem vem
   antes da supersessão, que escondia a cópia de asOf antigo. Uma linhagem já superada e fora da
   crença não é comparada: guardar identidades superadas só para isso cresceria sem limite. */
/** @param {Entry[]} pool */
function intact(pool) {
  /** @type {Map<string, Entry>} */
  const first = new Map();
  for (const entry of pool) {
    const other = first.get(entry.lineage);
    if (!other) first.set(entry.lineage, entry);
    else if (
      other.source !== entry.source ||
      other.value !== entry.value ||
      other.asOf !== entry.asOf
    ) {
      throw new Error(`linhagem "${entry.lineage}" chegou com conteudos diferentes`);
    }
  }
  return pool;
}

/** @param {Entry[]} pool - cópias da mesma linhagem já conferidas como iguais */
function dedupe(pool) {
  /** @type {Map<string, Entry>} */
  const kept = new Map();
  for (const entry of pool) {
    const other = kept.get(entry.lineage);
    if (!other || entry.quality > other.quality) kept.set(entry.lineage, entry);
  }
  return [...kept.values()].sort((a, b) => byId(a.lineage, b.lineage));
}

/* Com q = 1 o peso seria 1/0. As certezas formam uma classe à parte: pesam igual entre si, e o
   prior e as incertas deixam de pesar. É o limite simétrico da fórmula, sem infinito. */
/**
 * @param {Entry[]} entries - não vazio
 * @param {Prior} prior
 * @param {number} material
 */
function summary(entries, prior, material) {
  const certain = entries.filter(entry => entry.quality === 1);
  const counted = certain.length > 0 ? certain : entries;
  const weights = counted.map(entry =>
    entry.quality === 1 ? 1 : entry.quality / (1 - entry.quality),
  );
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const center =
    counted.reduce((sum, entry, index) => sum + (weights[index] ?? 0) * entry.value, 0) / total;
  const variance =
    counted.reduce(
      (sum, entry, index) => sum + (weights[index] ?? 0) * (entry.value - center) ** 2,
      0,
    ) / total;
  const agreement = 1 / (1 + variance / material ** 2);
  if (certain.length > 0) return { estimate: center, confidence: agreement };
  return {
    estimate: (prior.weight * prior.value + total * center) / (prior.weight + total),
    confidence: (total / (total + prior.weight)) * agreement,
  };
}

/**
 * @param {Belief | undefined} belief
 * @param {ReadonlyArray<Evidence>} evidence - todas sobre o mesmo sujeito
 * @param {SubjectSpec} spec
 * @param {Prior} prior
 * @param {number} tick
 * @returns {Belief | undefined}
 */
export function revise(belief, evidence, spec, prior, tick) {
  const subject = evidence[0]?.subject ?? spec?.family;
  specified(spec, subject);
  if (!(prior && prior.weight > 0 && Number.isFinite(prior.weight + prior.value))) {
    throw new Error(
      `prior da familia "${spec.family}" precisa de valor finito e peso maior que zero`,
    );
  }
  /** @type {Entry[]} */
  const arrived = [];
  for (const item of evidence) {
    const valid =
      Number.isFinite(item.value) &&
      Number.isFinite(item.asOf) &&
      item.quality >= 0 &&
      item.quality <= 1;
    if (!valid)
      throw new Error(`evidencia "${item.lineage}" de "${item.subject}" sem numero valido`);
    if (item.quality === 0) continue;
    const { lineage, source, value, quality, asOf } = item;
    arrived.push({ lineage, source, value, quality, asOf });
  }
  if (arrived.length === 0) return belief;
  const pool = intact([...(belief?.entries ?? []), ...arrived]);
  const entries = dedupe(supersede(pool, spec.supersede));
  return { entries, ...summary(entries, prior, spec.material), updatedAt: tick };
}
