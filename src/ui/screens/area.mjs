/* A TELA DE AREA — um molde, sete instancias. Views PURAS.
   ══════════════════════════════════════════════════════════════════════════════

   ── ELA DEIXOU DE SER UM MENU ────────────────────────────────────────────────
   Ate 13/08/2026 esta tela oferecia SEIS PAUTAS PRONTAS por area, e o jogador
   escolhia uma. O responsavel a recusou com a frase que virou o diagnostico do
   ciclo — "onde tem criatividade nisso e liberdade?" — e a recusa estava certa:
   um menu responde "qual dessas voce quer?", e a pergunta do cargo e "quanto de
   cada coisa o pais vai ter?".

   Agora ela e o ORCAMENTO. Um controle por programa, e o que o jogador escreve
   aqui vira, sozinho, a pauta que o Congresso vota — a posicao ideologica da
   proposta e calculada do que ele moveu, em `src/application/agenda.mjs`.

   ── O PISO E UMA MARCA, E NAO UMA PAREDE ─────────────────────────────────────
   Cada controle vai de 0 a 100 e ATRAVESSA o piso legal. O que muda ao atravessar
   nao e a possibilidade, e o PRECO: a linha troca de "isto cabe na caneta" para
   "isto precisa de 257 votos" — ou de 308, quando o piso e constitucional.

   Essa e a diferenca entre "voce nao pode" e "isso custa", e ela e a doutrina do
   projeto inteiro. Um controle que travasse no piso ensinaria que a lei e um
   limite da INTERFACE; atravessando, ele ensina que a lei e um limite do MUNDO,
   e que mundos se mudam.

   ── A LINHA QUE FAZ A TELA VIRAR DECISAO ─────────────────────────────────────
   "14,7 disponiveis · 12,1 ja comprometidos nas outras areas".

   Sem ela seriam trinta controles independentes, e mover um nao significaria
   nada. Com ela, investir na saude e NAO investir na seguranca — porque a bolsa e
   uma so, e a emenda para o Congresso sai da mesma.

   ── O INDICE MOSTRA TENDENCIA, E NAO SO NIVEL ────────────────────────────────
   `61` sozinho nao diz nada. `61 ▁▂▃▃▂▁ −24 em 12 meses` diz que o jogador esta
   afundando a saude ha um ano — que e a informacao de que ele precisa para
   decidir, e nao o numero de hoje. */

import { escapeHtml } from "../shared/html.mjs";
import { attr, money, seats, signed, sparkline } from "../shared/format.mjs";
import { UI } from "../strings.mjs";
import { bandOf, riteFor, riteForBand } from "../../application/agenda.mjs";

export { riteFor as riteOf };

/**
 * @typedef {import("../../data/areas.mjs").Area} Area
 * @typedef {import("../../data/programs.mjs").Program} Program
 *
 * A FORMA QUE O CONTROLE PRECISA, e nada alem dela. Programa e regra sao a mesma
 * primitiva na tela: nome, unidade, faixa e guarda. O custo e OPCIONAL porque so
 * a familia de verba tem custo mensal — regra cobra em outra moeda.
 *
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
 * @param {Record<string, string>} table
 * @param {string} key
 */
function labelOf(table, key) {
  return table[key] ?? key;
}

/* O RITO VEM DO MOTOR, e a tela nao tem opiniao sobre ele.
   ⚠ A DIVIDA FOI PAGA, e ela cobrou juros em menos de uma hora. Esta funcao era
   uma COPIA da regra de `agenda.mjs`, escrita para a linha poder se marcar como
   cara enquanto o jogador arrasta — com um aviso, no lugar dela, dizendo que as
   duas iam divergir. Divergiram: quando o teto passou a respeitar a guarda, a
   tela continuou cobrando "lei" para tudo, e levar o Executivo ao maximo — romper
   a divisao de poderes — aparecia por 257 votos em vez de 308.

   Aviso em comentario nao impede nada. Uma fonte so, impede. */

/**
 * A LEITURA de um programa: o que muda enquanto o controle e arrastado.
 *
 * ⚠ A FAIXA QUE VALE AQUI E A PEDIDA, e nao a que esta em vigor. Se o jogador
 * derrubou o piso no bloco das leis, o gasto abaixo dele deixa de ser violacao —
 * o texto e um so, e a mesma lei que derruba o piso autoriza o gasto. E
 * exatamente o que `compose` faz, e a tela nao pode dizer "emenda" numa linha que
 * o motor vai cobrar como execucao orcamentaria.
 *
 * @param {object} input
 * @param {Dial} input.program
 * @param {number} input.level
 * @param {import("../../state/state.mjs").Band} [input.band] a faixa PEDIDA
 * @returns {string}
 */
export function programReadHtml({ program, level, band = bandOf(program) }) {
  /* SO A PARTE ACIMA DO PISO CUSTA DISCRICIONARIO. O gasto ate o piso e a lei
     sendo cumprida, e ele ja esta na despesa obrigatoria — mostra-lo aqui faria
     o jogador somar o mesmo real duas vezes ao conferir a linha de caixa.

     ⚠ ALAVANCA DE REGRA NAO TEM CUSTO MENSAL, e a coluna fica vazia em vez de
     mostrar zero: privatizar nao custa discricionario nenhum, e um "R$ 0,0 bi" ali
     ensinaria que a jogada e de graca — quando ela cobra em dividendo perdido, em
     folha e em voto. */
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

  /* A MARCA DO PISO E POSICAO NO PROPRIO CONTROLE, escrita em estilo inline
     porque ela e DADO — onde a lei para, naquele programa — e nao decisao de
     paleta. E a mesma excecao declarada da faixa de indices na Mesa. */
  return (
    `<div class="dial" data-rite="${escapeHtml(rite)}" style="--floor:${attr(band.floor)}">` +
    `<div class="dial__head">` +
    `<span class="dial__name">${escapeHtml(program.label)}</span>` +
    `<span class="dial__unit">${escapeHtml(program.unit)}</span>` +
    `</div>` +
    /* O CONTROLE FICA FORA DA PARTE QUE SE REPINTA: trocar o HTML de um
       `<input type=range>` no meio de um arrasto arranca o elemento que o
       ponteiro esta segurando, e o arrasto morre no primeiro pixel. */
    `<input class="dial__slider" type="range" min="0" max="100" step="1" ` +
    `value="${attr(level)}" data-program="${escapeHtml(program.id)}" ` +
    `aria-label="${escapeHtml(`${program.label} — ${program.unit}`)}" />` +
    `<span class="dial__read" data-read="${escapeHtml(program.id)}">` +
    programReadHtml({ program, level, band }) +
    `</span>` +
    `</div>`
  );
}

/* ── AS LEIS DA AREA ─────────────────────────────────────────────────────────
   ══════════════════════════════════════════════════════════════════════════════
   O bloco mais novo da tela, e o que muda o tamanho do jogo. Ate 14/08/2026 a
   faixa `[piso, teto]` era catalogo — o jogador podia atravessa-la pagando o
   preco, e nunca podia MOVE-LA. Uma partida em que as leis sao imutaveis e uma
   partida sobre administrar, e nao sobre governar.

   ── E O MESMO CONTROLE DO ORCAMENTO, DE PROPOSITO ────────────────────────────
   Mudar quanto se gasta e mudar quanto a lei OBRIGA a gastar sao o mesmo gesto
   com precos diferentes, e a tela afirma isso usando a mesma peca. Uma forma
   diferente para a legislacao sugeriria que ela e outra natureza de coisa — e o
   ponto do ciclo inteiro e que nao e: sao alavancas que movem as faixas de outras
   alavancas.

   ── NAO HA BOTAO DE EXCLUIR, E ISSO E A REGRA ────────────────────────────────
   Os tres verbos do pedido — criar, alterar, excluir — sao o mesmo controle em
   tres posicoes. Excluir e levar o piso a zero; criar e tira-lo de zero. Um botao
   de "excluir lei" ao lado de um controle que ja faz isso ensinaria que sao duas
   operacoes diferentes, e a primeira duvida do jogador seria qual das duas usar. */

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

  /* O RITO SO APARECE QUANDO A LEI FOI MOVIDA, e ele vem do motor: mexer numa
     faixa protegida pela Constituicao custa emenda, e numa sem lei nenhuma custa
     lei — porque plantar uma vinculacao onde nao havia e criar uma. */
  const badge = moved
    ? `<span class="badge" data-instrument="${escapeHtml(riteForBand(program.guard))}">` +
      `${escapeHtml(labelOf(UI.instrument, riteForBand(program.guard)))}</span>`
    : `<span class="law__guard">` + `${escapeHtml(labelOf(UI.laws.guard, program.guard))}</span>`;

  /* O QUE VALE HOJE CONTINUA A VISTA enquanto o texto esta em votacao. Sem isso o
     jogador perde a referencia no instante em que arrasta — e a pergunta que ele
     precisa responder e justamente "de quanto para quanto". */
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
    `<div class="law" data-guard="${escapeHtml(program.guard)}" data-moved="${moved}">` +
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
export function lawsHtml({ programs, bands, requestedBands }) {
  const rows = programs
    .map(program => {
      const band = bandOf(program, bands);
      return lawHtml({ program, band, asked: requestedBands[program.id] ?? band });
    })
    .join("");

  return (
    `<section class="area__block">` +
    `<h3 class="area__legend">${escapeHtml(UI.laws.title)}` +
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

  /* A VARIACAO DE DOZE MESES, e nao a do mes: um passo de meio ponto e ruido, e
     doze passos na mesma direcao sao uma politica. */
  const past = history.length > 0 ? history : [value];
  const twelve = value - (past.length >= 12 ? (past.at(-12) ?? area.initial) : area.initial);

  const head =
    `<div class="area__head">` +
    `<div>` +
    `<p class="area__eyebrow">${escapeHtml(area.index)}</p>` +
    `<p class="area__value" data-numeric>${seats(value)}` +
    `<span class="area__spark" aria-hidden="true">${sparkline(past)}</span></p>` +
    `</div>` +
    /* A VARIACAO USA A PECA DE VARIACAO, e nao uma classe propria que repinta o
       mesmo verde. Duas regras para o mesmo conceito e como uma paleta comeca a
       divergir: a que ficar de fora do proximo ajuste vira a cor errada. */
    `<p class="trend area__delta"` +
    ` data-direction="${twelve > 0 ? "up" : twelve < 0 ? "down" : "flat"}"` +
    ` data-numeric>${signed(twelve)} <small>em 12 meses</small></p>` +
    `</div>`;

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
    `<h3 class="area__legend">${escapeHtml(UI.area.programs)}` +
    `<span class="area__total" data-numeric>${escapeHtml(UI.area.thisArea)} ` +
    `${money(input.spent)}</span>` +
    `</h3>` +
    `<div class="dials" id="areaDials">${dials}</div>` +
    /* A LINHA DA BOLSA, e ela e a unica que transforma trinta controles numa
       escolha. `id` proprio porque ela se repinta a cada arrasto sem o controle
       ser reconstruido. */
    `<p class="allot__pool" id="areaPool">` +
    poolHtml(input) +
    `</p>` +
    `</section>`;

  const outlook =
    `<section class="area__block">` +
    `<h3 class="area__legend">${escapeHtml(UI.area.outlook)}</h3>` +
    `<p class="allot__projection" id="areaOutlook" data-numeric>` +
    outlookHtml(input) +
    `</p>` +
    `</section>`;

  /* AS LEIS VEM DEPOIS DO ORCAMENTO, e a ordem e a mesma dos tres verbos: o
     jogador chega para gastar, esbarra numa parede, e SO ENTAO desce para o bloco
     que move a parede. Poe-las em cima ensinaria que legislar e o gesto comum —
     e ele nao e: o mes normal se resolve inteiro no bloco de cima. */
  const laws = lawsHtml({
    programs: input.programs,
    bands,
    requestedBands,
  });

  /* UMA LAMINA POR TELA. As secoes vivem DENTRO da mesma peca, e nao em cartoes
     soltos: elas disputam a mesma bolsa, e separa-las em caixas independentes
     desmancharia justamente a relacao que a tela existe para mostrar. */
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
 * `parado: NN` e a metade que importa. Sem o contrafactual, o jogador ve o indice
 * subir e conclui que investir "funciona"; com ele, ve que boa parte do dinheiro
 * apenas segura o decaimento, e que so o resto anda para frente.
 *
 * @param {object} input
 * @param {number} input.value
 * @param {number} input.projected
 * @param {number} input.idle
 * @returns {string}
 */
export function outlookHtml({ value, projected, idle }) {
  return (
    `${seats(value)} → ${seats(projected)}` +
    `<small>${escapeHtml(UI.area.holding)}: ${seats(idle)}</small>`
  );
}

/**
 * A TELA DO ESTADO — o que a Uniao possui, e quanto poder o Executivo tem.
 *
 * Ela reusa o mesmo controle da area, e isso nao e economia de codigo: e a
 * afirmacao de que as duas familias sao a MESMA primitiva. Privatizar a Petrobras
 * e cortar a merenda se fazem com o mesmo gesto, entram no mesmo texto e sao
 * votadas juntas — e uma tela com outra forma sugeriria o contrario.
 *
 * O QUE MUDA E A COLUNA DO MEIO. Um programa mostra o custo mensal; uma regra
 * mostra vazio, porque ela nao consome discricionario. O preco dela e outro:
 * dividendo que some, folha que fica, e voto.
 *
 * @param {object} input
 * @param {ReadonlyArray<Dial>} input.rules
 * @param {Record<string, number>} input.levels
 * @returns {string}
 */
export function estadoHtml({ rules, levels }) {
  const groups = ["property", "power"].map(family => {
    const dials = rules
      .filter(rule => /** @type {{ family?: string }} */ (rule).family === family)
      .map(rule => programHtml({ program: rule, level: levels[rule.id] ?? rule.initial }))
      .join("");

    if (!dials) return "";

    return (
      `<section class="area__block">` +
      `<h3 class="area__legend">${escapeHtml(labelOf(UI.estado, family))}</h3>` +
      `<div class="dials">${dials}</div>` +
      `</section>`
    );
  });

  return (
    `<section class="area glass-stage">` +
    `<div class="area__head"><div>` +
    `<p class="area__eyebrow">${escapeHtml(UI.estado.eyebrow)}</p>` +
    `<p class="area__value">${escapeHtml(UI.estado.title)}</p>` +
    `</div></div>` +
    groups.join("") +
    `</section>`
  );
}
