/* A TELA DE AREA — um molde, sete instancias.
   ── ELA DEIXOU DE SER UM MENU Ate esta tela oferecia SEIS PAUTAS PRONTAS por area, e o
   jogador escolhia uma. */

import { escapeHtml } from "../shared/html.mjs";
import { attr, money, seats, signed, sparkline } from "../shared/format.mjs";
import { headHtml } from "../shared/head.mjs";
import { WINDOW, trendOf, windowLabel } from "../shared/trend.mjs";
import { UI, labelOf } from "../strings.mjs";
import { bandOf, riteFor, riteForBand } from "../../application/agenda.mjs";

export { riteFor as riteOf };

/**
 * A FORMA QUE O CONTROLE PRECISA, e nada alem dela.
 *
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

/* Esta funcao era uma COPIA da regra de `agenda.mjs`, escrita para a linha poder se marcar
   como cara enquanto o jogador arrasta — com um aviso, no lugar dela, dizendo que as duas iam
   divergir. */

/**
 * A LEITURA de um programa: o que muda enquanto o controle e arrastado.
 *
 * @param {object} input
 * @param {Dial} input.program
 * @param {number} input.level
 * @param {import("../../state/state.mjs").Band} [input.band] a faixa PEDIDA
 * @returns {string}
 */
export function programReadHtml({ program, level, band = bandOf(program) }) {
  /* SO A PARTE ACIMA DO PISO CUSTA DISCRICIONARIO. */
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
 * UM PROGRAMA — nome, o que a intensidade significa, e o controle.
 *
 * @param {object} input
 * @param {Dial} input.program
 * @param {number} input.level
 * @param {import("../../state/state.mjs").Band} [input.band] a faixa PEDIDA
 * @returns {string}
 */
function programHtml({ program, level, band = bandOf(program) }) {
  const rite = riteFor({ ...program, ...band }, level);

  /* A FAIXA VIGENTE VIRA POSICAO NO PROPRIO TRILHO, escrita em estilo inline porque ela e
     DADO — onde a lei comeca e onde ela acaba, naquele programa — e nao decisao de paleta. */
  /* ⚠ `data-guard` ENTROU NO CONTROLE DE VERBA, e ele so existia na linha de LEI: e o dado que
     diz se o piso daquela alavanca e caneta, lei ou Constituicao, e quem consome e a zona
     abaixo do piso no trilho. Sem ele aqui, a severidade aparecia so no bloco de baixo. */
  return (
    `<div class="dial" data-rite="${escapeHtml(rite)}" ` +
    `data-guard="${escapeHtml(program.guard)}" ` +
    `style="--floor:${attr(band.floor)};--ceiling:${attr(band.ceiling)}">` +
    `<div class="dial__head">` +
    `<span class="dial__name">${escapeHtml(program.label)}</span>` +
    `<span class="dial__unit">${escapeHtml(program.unit)}</span>` +
    `</div>` +
    /* O CONTROLE FICA FORA DA PARTE QUE SE REPINTA: trocar o HTML de um `<input type=range>`
       no meio de um arrasto arranca o elemento que o ponteiro esta segurando, e o arrasto
       morre no primeiro pixel. */
    `<input class="dial__slider" type="range" min="0" max="100" step="1" ` +
    `value="${attr(level)}" data-program="${escapeHtml(program.id)}" ` +
    `aria-label="${escapeHtml(`${program.label} — ${program.unit}`)}" />` +
    `<span class="dial__read" data-read="${escapeHtml(program.id)}">` +
    programReadHtml({ program, level, band }) +
    `</span>` +
    `</div>`
  );
}

/* ── AS LEIS DA AREA ───────────────────────────────────────────────────────── O bloco mais
   novo da tela, e o que muda o tamanho do jogo. */

/**
 * A LEITURA de uma lei: o que ela obriga, o que autoriza, e se mudou.
 *
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

  /* O RITO SO APARECE QUANDO A LEI FOI MOVIDA, e ele vem do motor: mexer numa faixa protegida
     pela Constituicao custa emenda, e numa sem lei nenhuma custa lei — porque plantar uma
     vinculacao onde nao havia e criar uma. */
  const badge = moved
    ? `<span class="badge" data-instrument="${escapeHtml(riteForBand(program.guard))}">` +
      `${escapeHtml(labelOf(UI.instrument, riteForBand(program.guard)))}</span>`
    : `<span class="law__guard">` + `${escapeHtml(labelOf(UI.laws.guard, program.guard))}</span>`;

  /* O QUE VALE HOJE CONTINUA A VISTA enquanto o texto esta em votacao. */
  const before = moved
    ? `<small>${escapeHtml(UI.laws.was)} ${seats(band.floor)}–${seats(band.ceiling)}</small>`
    : "";

  return `<span class="law__terms">${floor} · ${ceiling} ${before}</span>${badge}`;
}

/**
 * UMA LEI — o piso e o teto de uma alavanca, como dois controles.
 *
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
 * O BLOCO INTEIRO das leis de uma area.
 *
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
 * A tela inteira de uma area.
 *
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
 * @param {Record<string, import("../../state/state.mjs").Band>} [input.bands] as leis VIGENTES
 * @param {Record<string, import("../../state/state.mjs").Band>} [input.requestedBands] as PEDIDAS
 * @returns {string}
 */
export function areaHtml(input) {
  const { area, value, history, bands = {}, requestedBands = {} } = input;

  /* Agora chega `state.series.areas`, que guarda 48 meses de todas as oito. */
  const past = history.length > 0 ? history : [value];
  const moved = trendOf(value, past);

  /* A captura do passeio o pegou em out/2027, com a Saude anunciando um zero verde. */
  const shift = Number((moved?.delta ?? 0).toFixed(0));

  const head = headHtml({
    title: area.label,
    reading: {
      label: area.index,
      value:
        `<p class="head__value" data-numeric>${seats(value)}` +
        `<span class="area__spark" aria-hidden="true">${sparkline(past, WINDOW)}</span></p>` +
        /* Duas regras para o mesmo conceito e como uma paleta comeca a divergir: a que ficar
           de fora do proximo ajuste vira a cor errada. */
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
    /* Uma revisao externa a descreveu como "texto solto espremido no vazio", e o defeito era
       pior do que a diagramacao: posta DEPOIS, ela e a conclusao de uma decisao que o jogador
       ja tomou. */
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

  /* AS LEIS VEM DEPOIS DO ORCAMENTO, e a ordem e a mesma dos tres verbos: o jogador chega
     para gastar, esbarra numa parede, e SO ENTAO desce para o bloco que move a parede. */
  const laws = lawsHtml({
    programs: input.programs,
    bands,
    requestedBands,
  });

  /* UMA LAMINA POR TELA. */
  return `<section class="area glass-stage">${head}${budget}${laws}${outlook}</section>`;
}

/**
 * A BOLSA — o que cabe no mes contra o que ja esta comprometido.
 *
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
 * A PROJECAO — para onde o indice vai com o que esta pedido.
 *
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
  /* ⚠ O HORIZONTE E A LEITURA PRINCIPAL, e o mes que vem virou nota: com 0,40 de passo mensal a
     area imprimia `61 → 61` na tela onde o jogador acabou de mexer — leitura incapaz de mostrar
     a decisao. Sem horizonte a peca cai na leitura antiga, e nao mente. */
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
    /* ⚠ A CURVA DECLARA O QUE ELA NAO SIMULA. O plenario fica parado dentro dela — projetar com
       votacao seria prever um voto que nao aconteceu —, e uma projecao que esconde a propria
       premissa e um numero inventado com aparencia de motor. */
    `<small>${escapeHtml(UI.area.frozen)}</small>`
  );
}

/**
 * E o mesmo defeito que a prosa de `riteOf` narra ter custado uma hora na tela de area: aviso
 * em comentario nao impede nada, uma fonte so impede.
 *
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
