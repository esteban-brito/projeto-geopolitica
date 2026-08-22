/* ESTRATO — a pilha de normas lida como faixa vigente, com precedencia declarada,
   gatilho reavaliado por turno, vigencia, excecao e revogacao. */

/* O que o numero solto nao conseguia expressar, e que este motor expressa: · uma norma que
   vale ENQUANTO a divida passar de 80% do PIB, e que liga e desliga sozinha sem ninguem votar
   de novo; · uma norma que vale POR 24 MESES, e some; · uma norma que alcanca uma AREA
   inteira, SALVO uma alavanca — o jabuti; · uma norma que REVOGA outra, que e o que faz
   reformar significar desmontar; · e a consequencia de todas: elas se ACUMULAM. */

/**
 * VINCULACAO, e ela e o que separa um piso de um piso que anda ⚠ `share` E `floor` SAO A
 * MESMA CLAUSULA DITA EM DUAS UNIDADES, e nunca as duas ao mesmo tempo: uma norma que
 * declarasse as duas teria dois pisos disputando entre si dentro de si mesma.
 *
 * @typedef {"lever" | "group" | "all"} Scope o alcance de um alvo
 * @typedef {object} Target
 * @property {Scope} scope
 * @property {string} [id] - a alavanca ou o grupo; ausente quando o alcance e `all`
 * @property {ReadonlyArray<string>} [except] - o SALVO: alavancas que escapam
 * @typedef {object} Trigger o `enquanto`
 * @property {string} indicator - o nome do indicador lido
 * @property {"above" | "below"} op
 * @property {number} value
 * @typedef {object} Norm
 * @property {string} id
 * @property {"band"} kind - o unico tipo de clausula que existe hoje
 * @property {Target} target
 * @property {number} [floor] - o que ela OBRIGA, em pontos; ausente quando nao fala
 * de piso
 * @property {number} [share] - o que ela OBRIGA, em FRACAO DA RECEITA CORRENTE. E a
 * @property {number} [ceiling] - o que ela AUTORIZA
 * @property {string} guard - a natureza dela: `none`, `law` ou `constitution`
 * @property {number} enactedAt - o mes em que passou; 0 e herdada da posse
 * @property {number} [from] - a VACATIO: so vale a partir deste mes
 * @property {number} [months] - a VIGENCIA: por quantos meses, a partir de `from`
 * @property {Trigger} [trigger]
 * @property {ReadonlyArray<string>} [repeals] - o que ela derruba
 * @typedef {object} Lever a alavanca vista por este motor, e nada mais que isso
 * @property {string} id
 * @property {string} [group] - a area de um programa, a familia de uma regra
 * @property {number} [cost] - quanto custa ela inteira por ano, e ele so existe para
 * converter VINCULACAO em pontos. Uma alavanca sem custo nao pode ser vinculada:
 * nao ha como dizer que fracao da receita ela consome
 * @typedef {object} Band
 * @property {number} floor
 * @property {number} ceiling
 * @typedef {"repealed" | "future" | "expired" | "trigger" | "unknown" | "unreachable"} Sleep
 * @typedef {object} Dormant uma norma escrita que nao esta valendo, e por que
 * @property {Norm} norm
 * @property {Sleep} reason
 * @typedef {object} NormsInput
 * @property {ReadonlyArray<Norm>} norms - na ordem em que foram escritas
 * @property {ReadonlyArray<Lever>} levers - todas as que existem
 * @property {number} month - o mes corrente
 * @property {Record<string, number>} [indicators] - o que os gatilhos leem
 * @property {number} [revenue] - a receita corrente do ano, sobre a qual a VINCULACAO
 * incide. Ausente, toda norma de `share` fica DORMENTE por `unknown` — porque um
 * piso de "15% da receita" sem receita nao e zero, e indeterminado
 * @typedef {object} NormsOutput
 * @property {Record<string, Band>} bands - a faixa vigente de CADA alavanca
 * @property {Record<string, string>} governs - qual norma decidiu o PISO de cada alavanca
 * @property {Norm[]} active
 * @property {Dormant[]} dormant
 */

/* A HIERARQUIA, em numero. */
const RANK = { none: 0, law: 1, constitution: 2 };

/* A ESPECIFICIDADE, em numero. */
const REACH = { lever: 2, group: 1, all: 0 };

/* ⚠ E A CORRECAO DE UM DEFEITO QUE O ESTADO ANTERIOR NAO PODIA TER: enquanto a faixa vinha do
   catalogo com o piso da posse como padrao, revogar a vinculacao da saude devolveria o piso
   constitucional original no mes seguinte — a lei que o jogador acabou de derrubar voltaria
   sozinha, sem aviso e sem voto. */
const FREE = { floor: 0, ceiling: 100 };

/** @param {number} value */
function clamp100(value) {
  return Math.min(100, Math.max(0, value));
}

/**
 * POR QUE ELA ESTA DORMINDO — ou `null` quando esta de pe.
 *
 * @param {Norm} norm
 * @param {number} month
 * @param {Record<string, number>} indicators
 * @returns {Sleep | null}
 */
function sleepOf(norm, month, indicators) {
  const from = norm.from ?? norm.enactedAt;
  if (month < from) return "future";
  if (norm.months !== undefined && month >= from + norm.months) return "expired";

  const trigger = norm.trigger;
  if (!trigger) return null;

  const reading = indicators[trigger.indicator];

  /* INDICADOR QUE NINGUEM PASSOU NAO VIRA ZERO, e a diferenca decide partidas: um gatilho de
     "enquanto a divida passar de 80%" lido como zero fica desligado para sempre e ninguem
     nunca sabe. */
  if (typeof reading !== "number" || !Number.isFinite(reading)) return "unknown";

  /* A COMPARACAO E ESTRITA nos dois lados. */
  const on = trigger.op === "above" ? reading > trigger.value : reading < trigger.value;
  return on ? null : "trigger";
}

/**
 * AS ALAVANCAS QUE UM ALVO ALCANCA, ja com o `salvo` descontado.
 *
 * @param {Target} target
 * @param {ReadonlyArray<Lever>} levers
 * @returns {string[]}
 */
function reachOf(target, levers) {
  const spared = new Set(target.except ?? []);

  /* E o mesmo defeito que `danglingPrograms` pega no catalogo, do lado do estado. */
  if (target.scope === "lever") {
    const id = target.id ?? "";
    return levers.some(lever => lever.id === id) && !spared.has(id) ? [id] : [];
  }

  const matches =
    target.scope === "group" ? levers.filter(lever => lever.group === target.id) : levers;

  return matches.map(lever => lever.id).filter(id => !spared.has(id));
}

/**
 * QUEM VENCE, entre dois candidatos ao mesmo lado da mesma faixa.
 *
 * @typedef {object} Claim
 * @property {number} rank
 * @property {number} reach
 * @property {number} enactedAt
 * @property {number} written - o indice no array; o desempate que nunca empata
 * @param {Claim} candidate
 * @param {Claim | undefined} holder
 * @returns {boolean}
 */
function beats(candidate, holder) {
  if (!holder) return true;
  if (candidate.rank !== holder.rank) return candidate.rank > holder.rank;
  if (candidate.reach !== holder.reach) return candidate.reach > holder.reach;
  if (candidate.enactedAt !== holder.enactedAt) return candidate.enactedAt > holder.enactedAt;
  return candidate.written > holder.written;
}

/**
 * Resolve as normas do mes.
 *
 * @param {NormsInput} input
 * @returns {NormsOutput}
 */
export function resolve({ norms, levers, month, indicators = {}, revenue }) {
  /** @type {Map<string, number[]>} */
  const byId = new Map();
  norms.forEach((norm, index) => {
    const found = byId.get(norm.id);
    if (found) found.push(index);
    else byId.set(norm.id, [index]);
  });

  /** @type {Map<number, string[]>} */
  const standing = new Map();
  /** @type {Map<number, Sleep>} */
  const asleep = new Map();
  /** @type {Set<number>} */
  const struck = new Set();

  for (let index = norms.length - 1; index >= 0; index--) {
    const norm = norms[index];
    if (!norm) continue;

    if (struck.has(index)) {
      asleep.set(index, "repealed");
      continue;
    }

    const sleep = sleepOf(norm, month, indicators);
    if (sleep) {
      asleep.set(index, sleep);
      continue;
    }

    /* ⚠ QUEM NAO ALCANCA NINGUEM NAO FAZ NADA — INCLUSIVE NAO REVOGA. */
    const reached = reachOf(norm.target, levers);
    if (reached.length === 0) {
      asleep.set(index, "unreachable");
      continue;
    }

    standing.set(index, reached);
    for (const id of norm.repeals ?? []) {
      for (const target of byId.get(id) ?? []) {
        if (target < index) struck.add(target);
      }
    }
  }

  /** @type {Record<string, Band>} */
  const bands = {};
  /* O CUSTO POR ALAVANCA, indexado uma vez. */
  /** @type {Map<string, number>} */
  const costOf = new Map();
  for (const lever of levers) {
    bands[lever.id] = { ...FREE };
    if (lever.cost !== undefined) costOf.set(lever.id, lever.cost);
  }

  /* Refeita por fora, ela acertaria hoje e divergiria no primeiro mes em que um gatilho
     ligasse: a tela mostraria uma lei e o orcamento obedeceria outra. */
  /** @type {Record<string, string>} */
  const governs = {};

  /** @type {Map<string, Claim>} */
  const floorHolder = new Map();
  /** @type {Map<string, Claim>} */
  const ceilingHolder = new Map();

  /** @type {Norm[]} */
  const active = [];

  /* AS VINCULACOES QUE NAO SE DEIXARAM CALCULAR. Ver a nota dentro do laco. */
  /** @type {Set<number>} */
  const unresolved = new Set();

  for (let index = 0; index < norms.length; index++) {
    const norm = norms[index];
    const reached = standing.get(index);
    if (!norm || !reached) continue;

    active.push(norm);

    /** @type {Claim} */
    const claim = {
      rank: RANK[/** @type {keyof typeof RANK} */ (norm.guard)] ?? 0,
      reach: REACH[norm.target.scope] ?? 0,
      enactedAt: norm.enactedAt,
      written: index,
    };

    for (const id of reached) {
      const band = bands[id];
      if (!band) continue;

      /* ⚠ A VINCULACAO VIRA PONTOS AQUI, e nao no catalogo nem na tela: ela e uma LEITURA do
         mes, porque a receita anda. */
      let floor = norm.floor;
      if (norm.share !== undefined) {
        const cost = costOf.get(id);
        if (revenue !== undefined && cost) {
          floor = clamp100((norm.share * revenue * 100) / cost);
        } else {
          /* ⚠ SEM RECEITA OU SEM CUSTO, A VINCULACAO NAO VIRA PISO ZERO — ela vira DORMENTE,
             e a distincao foi paga por uma prova. */
          unresolved.add(index);
          continue;
        }
      }

      if (floor !== undefined && beats(claim, floorHolder.get(id))) {
        floorHolder.set(id, claim);
        band.floor = clamp100(floor);
        governs[id] = norm.id;
      }
      if (norm.ceiling !== undefined && beats(claim, ceilingHolder.get(id))) {
        ceilingHolder.set(id, claim);
        band.ceiling = clamp100(norm.ceiling);
      }
    }
  }

  /** @type {Dormant[]} */
  const dormant = [];
  for (let index = 0; index < norms.length; index++) {
    const norm = norms[index];
    const reason = asleep.get(index) ?? (unresolved.has(index) ? "unknown" : undefined);
    if (norm && reason) dormant.push({ norm, reason });
  }

  return { bands, governs, active, dormant };
}

/**
 * A NORMA DE ABERTURA de uma alavanca — a lei que o presidente encontra em vigor.
 *
 * @param {{ id: string, floor: number, ceiling: number, guard: string,
 * bound?: number }} lever
 * @returns {Norm}
 */
export function inherited(lever) {
  /** @type {Norm} */
  const norm = {
    id: `heranca-${lever.id}`,
    kind: "band",
    target: { scope: "lever", id: lever.id },
    ceiling: lever.ceiling,
    guard: lever.guard,
    enactedAt: 0,
  };

  if (lever.bound !== undefined) norm.share = lever.bound;
  else norm.floor = lever.floor;

  return norm;
}

/**
 * A NORMA QUE UM MOVIMENTO DE FAIXA ESCREVE, quando o plenario a aprova.
 *
 * @param {object} input
 * @param {{ id: string, guard: string }} input.lever
 * @param {number} input.month - o mes em que ela passou
 * @param {number} [input.floor]
 * @param {number} [input.ceiling]
 * @returns {Norm}
 */
export function enact({ lever, month, floor, ceiling }) {
  /** @type {Norm} */
  const norm = {
    id: `${lever.id}-m${month}`,
    kind: "band",
    target: { scope: "lever", id: lever.id },
    guard: lever.guard,
    enactedAt: month,
  };
  if (floor !== undefined) norm.floor = floor;
  if (ceiling !== undefined) norm.ceiling = ceiling;
  return norm;
}
