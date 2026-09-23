/* Tela de area ministerial: indicadores, alavancas orcamentarias, leis e projecoes. */

import { escapeHtml } from "../shared/html.mjs";
import { attr, money, num, seats, signed, sparkline } from "../shared/format.mjs";
import { lineHtml } from "../shared/annex.mjs";
import { headHtml } from "../shared/head.mjs";
import { WINDOW, trendOf, windowLabel } from "../shared/trend.mjs";
import { UI, labelOf } from "../strings.mjs";
import { bandOf, riteFor, riteForBand } from "../../application/agenda.mjs";

export { riteFor as riteOf };

/**
 * @typedef {import("../../data/areas.mjs").Area} Area
 * @typedef {import("../../data/programs.mjs").Program} Program
 * @typedef {object} Dial
 * @property {string} id
 * @property {string} label
 * @property {string} unit
 * @property {number} initial
 * @property {number} floor
 * @property {number} ceiling
 * @property {string} guard
 * @property {number} [cost]
 */

/**
 * @param {object} input
 * @param {Dial} input.program
 * @param {number} input.level
 * @param {import("../../state/state.mjs").Band} [input.band] a faixa PEDIDA
 * @returns {string}
 */
export function programReadHtml({ program, level, band = bandOf(program) }) {
  const monthly =
    program.cost === undefined
      ? null
      : (Math.max(0, level - band.floor) / 100) * program.cost * (1 / 12);
  const rite = riteFor({ ...program, ...band }, level);

  return (
    `<span class="dial__level" data-numeric>${seats(level)}</span>` +
    `<span class="dial__cost" data-numeric>${monthly === null ? "" : money(monthly)}</span>` +
    `<span class="dial__rite" data-rite="${escapeHtml(rite)}">` +
    (rite === "budget"
      ? `${escapeHtml(UI.area.floor)} ${seats(band.floor)}`
      : `<span class="badge" data-instrument="${escapeHtml(rite)}">` +
        `${escapeHtml(labelOf(UI.instrument, rite))}</span>`) +
    `</span>`
  );
}

/**
 * @param {object} input
 * @param {Dial} input.program
 * @param {number} input.level
 * @param {import("../../state/state.mjs").Band} [input.band] a faixa PEDIDA
 * @returns {string}
 */
function programHtml({ program, level, band = bandOf(program) }) {
  const rite = riteFor({ ...program, ...band }, level);

  /* O atributo data-guard indica a severidade da vinculacao no proprio trilho orcamentario. */
  return (
    `<div class="dial" data-rite="${escapeHtml(rite)}" ` +
    `data-guard="${escapeHtml(program.guard)}" ` +
    `style="--floor:${attr(band.floor)};--ceiling:${attr(band.ceiling)}">` +
    `<div class="dial__head">` +
    `<span class="dial__name">${escapeHtml(program.label)}</span>` +
    `<span class="dial__unit">${escapeHtml(program.unit)}</span>` +
    `</div>` +
    /* Input mantido fora do container repintado para preservar captura de ponteiro em arrasto. */
    `<input class="dial__slider" type="range" min="0" max="100" step="1" ` +
    `value="${attr(level)}" data-program="${escapeHtml(program.id)}" ` +
    `aria-label="${escapeHtml(`${program.label} — ${program.unit}`)}" />` +
    `<span class="dial__read" data-read="${escapeHtml(program.id)}">` +
    programReadHtml({ program, level, band }) +
    `</span>` +
    `</div>`
  );
}

/**
 * @param {object} input
 * @param {Dial} input.program
 * @param {import("../../state/state.mjs").Band} input.band a faixa VIGENTE
 * @param {import("../../state/state.mjs").Band} input.asked a faixa PEDIDA
 * @returns {string}
 */
export function lawReadHtml({ program, band, asked }) {
  const moved = asked.floor !== band.floor || asked.ceiling !== band.ceiling;

  const floor =
    asked.floor <= 0
      ? escapeHtml(UI.laws.noFloor)
      : `${escapeHtml(UI.laws.obliges)} <b data-numeric>${seats(asked.floor)}</b>`;

  const ceiling =
    asked.ceiling >= 100
      ? escapeHtml(UI.laws.noCeiling)
      : `${escapeHtml(UI.laws.allows)} <b data-numeric>${seats(asked.ceiling)}</b>`;

  const badge = moved
    ? `<span class="badge" data-instrument="${escapeHtml(riteForBand(program.guard))}">` +
      `${escapeHtml(labelOf(UI.instrument, riteForBand(program.guard)))}</span>`
    : `<span class="law__guard">` + `${escapeHtml(labelOf(UI.laws.guard, program.guard))}</span>`;

  const before = moved
    ? `<small>${escapeHtml(UI.laws.was)} ${seats(band.floor)}–${seats(band.ceiling)}</small>`
    : "";

  return `<span class="law__terms">${floor} · ${ceiling} ${before}</span>${badge}`;
}

/**
 * @param {object} input
 * @param {Dial} input.program
 * @param {import("../../state/state.mjs").Band} input.band
 * @param {import("../../state/state.mjs").Band} input.asked
 * @returns {string}
 */
function lawHtml({ program, band, asked }) {
  const moved = asked.floor !== band.floor || asked.ceiling !== band.ceiling;

  /** @param {"floor" | "ceiling"} side */
  const slider = side =>
    `<input class="law__slider" type="range" min="0" max="100" step="1" ` +
    `value="${attr(asked[side])}" data-band="${escapeHtml(program.id)}" ` +
    `data-side="${side}" ` +
    `aria-label="${escapeHtml(
      `${program.label} — ${side === "floor" ? UI.laws.obliges : UI.laws.allows}`,
    )}" />`;

  return (
    `<div class="law" data-guard="${escapeHtml(program.guard)}" data-moved="${moved}" ` +
    `style="--floor:${attr(asked.floor)};--ceiling:${attr(asked.ceiling)}">` +
    `<span class="law__name">${escapeHtml(program.label)}</span>` +
    `<span class="law__band">${slider("floor")}${slider("ceiling")}</span>` +
    `<span class="law__read" data-law="${escapeHtml(program.id)}">` +
    lawReadHtml({ program, band, asked }) +
    `</span>` +
    `</div>`
  );
}

/**
 * @param {import("../../application/chain.mjs").Strand} strand
 * @param {"into" | "out"} side de que metade da corrente ela e
 * @param {(id: string) => string} nameOf
 * @returns {string}
 */
function strandHtml(strand, side, nameOf) {
  const aside =
    strand.kind === "spend"
      ? UI.chain.perBillion(num(strand.weight, 2))
      : strand.kind === "decay"
        ? Number.isFinite(strand.half ?? Infinity)
          ? UI.chain.half(Math.round(strand.half ?? 0))
          : UI.chain.forever
        : side === "into"
          ? strand.lag === 0
            ? UI.chain.cameNow
            : UI.chain.came(strand.lag)
          : strand.lag === 0
            ? UI.chain.prompt
            : UI.chain.lagged(strand.lag);

  return lineHtml({
    who:
      strand.kind === "decay" ? UI.chain.decay : nameOf(side === "into" ? strand.from : strand.to),
    aside,
    /* Duas casas decimais em pontos evitam exibir 0,0 ao lado de rendimento de 0,03 por bilhao. */
    value: strand.unit === "factor" ? `${signed(strand.now * 100, 1)}%` : signed(strand.now, 2),
  });
}

/**
 * @param {object} input
 * @param {{ into: ReadonlyArray<import("../../application/chain.mjs").Strand>,
 * out: ReadonlyArray<import("../../application/chain.mjs").Strand> }} input.chain
 * @param {ReadonlyArray<Area>} input.areas o catalogo, so para o nome de quem esta na ponta
 * @returns {string}
 */
export function chainHtml({ chain, areas }) {
  /** @param {string} id */
  const nameOf = id =>
    id === "budget"
      ? UI.chain.budget
      : (areas.find(area => area.id === id)?.label ?? labelOf(UI.chain.channel, id));

  const into = chain.into.map(strand => strandHtml(strand, "into", nameOf)).join("");
  const out = chain.out.map(strand => strandHtml(strand, "out", nameOf)).join("");

  return (
    `<div class="chain__half">` +
    `<h4 class="chain__legend">${escapeHtml(UI.chain.into)}</h4>${into}</div>` +
    `<div class="chain__half">` +
    `<h4 class="chain__legend">${escapeHtml(UI.chain.out)}</h4>${out}</div>`
  );
}

/**
 * @param {object} input
 * @param {{ into: ReadonlyArray<import("../../application/chain.mjs").Strand>,
 * out: ReadonlyArray<import("../../application/chain.mjs").Strand> }} input.chain
 * @param {ReadonlyArray<Area>} input.areas
 * @returns {string}
 */
function chainBlockHtml(input) {
  return (
    `<section class="area__block">` +
    `<h3 class="block__legend">${escapeHtml(UI.chain.title)}` +
    `<span class="area__empty">${escapeHtml(UI.chain.hint)}</span>` +
    `</h3>` +
    `<div class="chain" id="areaChain">${chainHtml(input)}</div>` +
    `</section>`
  );
}

/**
 * @param {object} input
 * @param {ReadonlyArray<Dial>} input.programs
 * @param {Record<string, import("../../state/state.mjs").Band>} input.bands
 * @param {Record<string, import("../../state/state.mjs").Band>} input.requestedBands
 * @returns {string}
 */
function lawsHtml({ programs, bands, requestedBands }) {
  const rows = programs
    .map(program => {
      const band = bandOf(program, bands);
      return lawHtml({ program, band, asked: requestedBands[program.id] ?? band });
    })
    .join("");

  return (
    `<section class="area__block">` +
    `<h3 class="block__legend">${escapeHtml(UI.laws.title)}` +
    `<span class="area__empty">${escapeHtml(UI.laws.hint)}</span>` +
    `</h3>` +
    `<div class="laws" id="areaLaws">${rows}</div>` +
    `</section>`
  );
}

/**
 * @param {object} input
 * @param {Area} input.area
 * @param {number} input.value o indice corrente
 * @param {ReadonlyArray<number>} input.history
 * @param {ReadonlyArray<Program>} input.programs os programas DESTA area
 * @param {Record<string, number>} input.levels a intensidade pedida de cada um
 * @param {number} input.spent bilhoes que ESTA area consome no mes
 * @param {number} input.room o discricionario do mes
 * @param {number} input.committed o que ja foi prometido fora desta area
 * @param {number} input.projected o indice ao fim do mes com esta alocacao
 * @param {number} input.idle o indice ao fim do mes sem alocacao nenhuma
 * @param {boolean} [input.protectedNow] se o decreto do mes ja poupa esta area do corte
 * @param {number} [input.ratio] a fracao do pedido que o caixa honra
 * @param {Record<string, import("../../state/state.mjs").Band>} [input.bands] as leis VIGENTES
 * @param {Record<string, import("../../state/state.mjs").Band>} [input.requestedBands] as PEDIDAS
 * @param {{ into: ReadonlyArray<import("../../application/chain.mjs").Strand>, out: ReadonlyArray<import("../../application/chain.mjs").Strand> }} [input.chain] a corrente
 * @param {ReadonlyArray<Area>} [input.areas] o catalogo, so para nomear a outra ponta
 * @returns {string}
 */
export function areaHtml(input) {
  const { area, value, history, bands = {}, requestedBands = {} } = input;

  const past = history.length > 0 ? history : [value];
  const moved = trendOf(value, past);

  const shift = Number((moved?.delta ?? 0).toFixed(0));

  const head = headHtml({
    title: area.label,
    reading: {
      label: area.index,
      value:
        `<p class="head__value" data-numeric>${seats(value)}` +
        `<span class="area__spark" aria-hidden="true">${sparkline(past, WINDOW)}</span></p>` +
        (moved === null
          ? ""
          : `<p class="trend area__delta"` +
            ` data-direction="${shift > 0 ? "up" : shift < 0 ? "down" : "flat"}"` +
            ` data-numeric>${signed(moved.delta)} ` +
            `<small>${escapeHtml(windowLabel(moved.months))}</small></p>`),
    },
  });

  const dials = input.programs
    .map(program =>
      programHtml({
        program,
        level: input.levels[program.id] ?? program.initial,
        band: requestedBands[program.id] ?? bandOf(program, bands),
      }),
    )
    .join("");

  const budget =
    `<section class="area__block">` +
    `<h3 class="block__legend">${escapeHtml(UI.area.programs)}` +
    `<span class="area__total" data-numeric>${escapeHtml(UI.area.thisArea)} ` +
    `${money(input.spent)}</span>` +
    `</h3>` +
    `<p class="allot__pool" id="areaPool">` +
    poolHtml(input) +
    `</p>` +
    `<div class="dials" id="areaDials">${dials}</div>` +
    `</section>`;

  const outlook =
    `<section class="area__block">` +
    `<h3 class="block__legend">${escapeHtml(UI.area.outlook)}</h3>` +
    `<p class="allot__projection" id="areaOutlook" data-numeric>` +
    outlookHtml(input) +
    `</p>` +
    `</section>`;

  const laws = lawsHtml({
    programs: input.programs,
    bands,
    requestedBands,
  });

  const chain =
    input.chain === undefined
      ? ""
      : chainBlockHtml({ chain: input.chain, areas: input.areas ?? [input.area] });

  return `<section class="area glass-stage">${head}${budget}${laws}${outlook}${chain}</section>`;
}

/**
 * @param {object} input
 * @param {number} input.room
 * @param {number} input.committed
 * @param {number} input.spent
 * @returns {string}
 */
export function poolHtml({ room, committed, spent }) {
  const over = committed + spent > room + 1e-9;

  return (
    `<span data-fits="${!over}">` +
    `${escapeHtml(UI.area.ofMonth)} <b data-numeric>${money(room)}</b> ` +
    `${escapeHtml(UI.area.available)} · <b data-numeric>${money(committed)}</b> ` +
    `${escapeHtml(UI.area.committed)}</span>`
  );
}

/**
 * @param {object} input
 * @param {number} input.value
 * @param {number} input.projected o indice no fim do MES que vem
 * @param {number} input.idle o mes que vem sem tocar em nada
 * @param {number} [input.ahead] o indice no fim do HORIZONTE
 * @param {number} [input.aheadIdle] o horizonte sem tocar em nada
 * @param {number} [input.horizon] quantos meses a curva olha
 * @returns {string}
 */
export function outlookHtml({ value, projected, idle, ahead, aheadIdle, horizon }) {
  /* Passo mensal de 0,40 imprimia 61 -> 61 no curto prazo; horizonte visualiza a tendencia acumulada. */
  if (ahead === undefined || horizon === undefined) {
    return (
      `${seats(value)} → ${seats(projected)}` +
      `<small>${escapeHtml(UI.area.holding)}: ${seats(idle)}</small>`
    );
  }

  return (
    `${seats(value)} → ${seats(ahead)}` +
    `<small>${escapeHtml(UI.area.inMonths(horizon))} · ` +
    `${escapeHtml(UI.area.holding)}: ${seats(aheadIdle ?? value)}</small>` +
    /* Projecao assume plenario inalterado sem antecipar votacoes futuras. */
    `<small>${escapeHtml(UI.area.frozen)}</small>`
  );
}

/**
 * @param {object} input
 * @param {ReadonlyArray<Dial>} input.rules
 * @param {Record<string, number>} input.levels
 * @param {Record<string, import("../../state/state.mjs").Band>} [input.bands] as VIGENTES
 * @param {Record<string, import("../../state/state.mjs").Band>} [input.requestedBands] as PEDIDAS
 * @returns {string}
 */
export function estadoHtml({ rules, levels, bands = {}, requestedBands = {} }) {
  const groups = ["property", "power"].map(family => {
    const dials = rules
      .filter(rule => /** @type {{ family?: string }} */ (rule).family === family)
      .map(rule =>
        programHtml({
          program: rule,
          level: levels[rule.id] ?? rule.initial,
          band: requestedBands[rule.id] ?? bandOf(rule, bands),
        }),
      )
      .join("");

    if (!dials) return "";

    return (
      `<section class="area__block">` +
      `<h3 class="block__legend">${escapeHtml(labelOf(UI.estado, family))}</h3>` +
      `<div class="dials">${dials}</div>` +
      `</section>`
    );
  });

  return (
    `<section class="area glass-stage">` +
    headHtml({ title: UI.estado.title }) +
    groups.join("") +
    `</section>`
  );
}
