/* A MESA — onde o mes se resolve. Views PURAS.
   ══════════════════════════════════════════════════════════════════════════════
   Nenhuma funcao daqui toca o DOM, lê o relogio ou guarda estado. Elas recebem
   dado e devolvem string. Quem aplica ao documento e `app.mjs`.

   ── A TELA QUE NAO NAVEGA ────────────────────────────────────────────────────
   Um turno inteiro se decide aqui. As areas sao onde se vai quando se QUER
   olhar; a Mesa e onde se decide, e ela mostra de uma vez as tres coisas que a
   decisao precisa: o que esta em pauta, quanto cada bancada entrega com a verba
   oferecida ate agora, e se o caixa cobre o que foi prometido.

   ── `241 ± 14`, E NAO `241` ──────────────────────────────────────────────────
   A banda e a coisa mais importante desta tela. `241` afirma um placar que o
   motor nao promete: a previsao e deterministica e o DIA nao e. O jogador que
   confia no numero cru aprende a desconfiar da tela na primeira vez que perder
   por tres votos — e aprender a desconfiar da tela e o pior que uma interface de
   simulacao pode ensinar.

   Com a banda, a tela diz exatamente o que o modelo sabe: a tendencia e
   conhecida, o dia nao. E comprar mais verba ESTREITA a banda sem nunca zera-la,
   o que da ao jogador uma segunda coisa para comprar alem de votos.

   ── O QUE E CERTEZA E O QUE E RISCO ──────────────────────────────────────────
   Distincao deliberada, e ela aparece na hierarquia visual. O rateio e
   DETERMINISTICO: dada a promessa e a folga, o corte e uma conta, e a tela o
   afirma sem ressalva. O placar e SORTEADO: a tela mostra a faixa. Mostrar o
   rateio como "risco de 12%" inventaria incerteza que nao existe. */

import { escapeHtml } from "../shared/html.mjs";
import { money, percent, seats, signed, sparkline } from "../shared/format.mjs";
import { headHtml } from "../shared/head.mjs";
import { sigilHtml } from "../shared/sigil.mjs";
import { UI } from "../strings.mjs";

/**
 * @typedef {import("../../data/areas.mjs").Area} Area
 * @typedef {import("../../application/agenda.mjs").Proposal} Bill
 * @typedef {import("../../data/parties.mjs").Party} Party
 * @typedef {import("../../domain/congress/index.mjs").Forecast} Forecast
 */

/* O estado de humor de uma bancada, como a tela o nomeia. Os limiares chegam do
   motor: redigita-los aqui seria garantir que um dia a tela chame de
   "obstruindo" quem o motor ja trata como rompida. */
/**
 * O rotulo de um instrumento. Ele passa por aqui em vez de indexar direto porque
 * `bill.instrument` e texto vindo do catalogo, e catalogo e dado editavel: um
 * instrumento novo digitado errado tem de aparecer como o proprio id na tela, e
 * nao derrubar a pintura inteira.
 *
 * @param {Record<string, string>} table
 * @param {string} key
 */
function labelOf(table, key) {
  return table[key] ?? key;
}

/**
 * @param {number} loyalty
 * @param {{ obstruction: number, rupture: number }} thresholds
 */
function moodOf(loyalty, thresholds) {
  if (loyalty < thresholds.rupture) return "broken";
  if (loyalty < thresholds.obstruction) return "obstructing";
  return "loyal";
}

/**
 * A FAIXA DE INDICES — seis medidores, uma linha, sempre visivel.
 *
 * Ela existe para o jogador enxergar de relance a area que ele abandonou. Com
 * seis telas separadas, so se descobre clicando em seis lugares — e e assim que
 * um jogador deixa de olhar.
 *
 * TRES LEITURAS EM UM MEDIDOR, e cada uma responde uma pergunta diferente: o
 * NUMERO diz onde a area esta, a ESCADA diz para onde ela vem indo, e a BARRA
 * diz o que nenhum dos dois diz — de que lado do ponto neutro ela caiu. O ponto
 * neutro chega do catalogo pelo `--neutral`, que o entrypoint injeta: 50 e regra
 * de jogo, e nao valor de paleta.
 *
 * @param {object} input
 * @param {ReadonlyArray<Area>} input.areas
 * @param {Record<string, number>} input.index
 * @param {Record<string, number[]>} input.history
 * @returns {string}
 */
export function capacityStripHtml({ areas, index, history }) {
  const gauges = areas
    .map(area => {
      const value = index[area.id] ?? area.initial;
      const past = history[area.id] ?? [];
      const trend = sparkline(past.length > 0 ? past : [value]);

      return (
        `<button class="gauge" type="button" data-section="${escapeHtml(area.id)}">` +
        `<span class="gauge__label">${escapeHtml(area.label)}</span>` +
        `<span class="gauge__read">` +
        `<span class="gauge__value" data-numeric>${seats(value)}</span>` +
        `<span class="gauge__trend" aria-hidden="true">${trend}</span>` +
        `</span>` +
        `<span class="gauge__track" style="--index:${seats(value)}" aria-hidden="true"></span>` +
        `</button>`
      );
    })
    .join("");

  /* A FAIXA E UMA SUPERFICIE SO, com seis campos — e nao seis laminas
     enfileiradas. Caixa e peso, e seis pesos para dizer coisas do mesmo nivel e
     o ruido que a regra de forma dos componentes existe para impedir.

     ⚠ E ELA DEIXOU DE SER VIDRO em 15/08/2026. Ela era `glass-support` porque
     morava solta no tabuleiro, ao lado da mesa; agora ela e um BLOCO dentro da
     lamina do Congresso, e vidro dentro de vidro e o defeito que o sistema visual
     inteiro existe para impedir. O que separa um bloco do outro e a legenda e o
     espaco, como em Financas e na area. */
  return `<div class="gauges">${gauges}</div>`;
}

/* ONDE A MEMORIA DEIXA DE SER RUIDO. Abaixo disto o saldo e um residuo de
   decaimento e nao uma relacao — anunciar "negocia como quem ja recebeu" por causa
   de 0,02 ensinaria o jogador a ler significado onde nao ha nenhum. */
const MEMORY_FLOOR = 0.08;

/**
 * UMA PESSOA DA BANCADA — e ela e a peca que faltava na tela inteira.
 *
 * ⚠ ELA NAO E UM CONTROLE. O jogador paga o BLOCO, e nao a pessoa: e o desenho do
 * ciclo 4, e mexer nisso seria inventar mecanica. O que esta linha faz e mostrar
 * PARA ONDE vai o que ele paga, e por que dois blocos com a mesma verba entregam
 * numeros diferentes — porque dentro deles ha gente com alcance, ambicao e
 * memoria distintos.
 *
 * @param {object} input
 * @param {{ id: string, name: string, office: string, role: string, ambition: string,
 *           seats: number, votes: number, reach: number, memory: number }} input.person
 * @param {boolean} input.voting
 * @returns {string}
 */
function personHtml({ person, voting }) {
  /* A MEMORIA VIRA FRASE, e a faixa morta no meio e declarada: sem histórico é um
     estado, e não um zero. */
  const memory =
    person.memory > MEMORY_FLOOR
      ? { tone: "good", text: UI.congress.memoryGood }
      : person.memory < -MEMORY_FLOOR
        ? { tone: "poor", text: UI.congress.memoryBad }
        : { tone: "none", text: UI.congress.memoryNone };

  const ambition = labelOf(UI.congress.ambition, person.ambition);
  /* ⚠ SO A SUCESSAO GANHA O PRECO ESCRITO AO LADO, porque so ela tem preco hoje.
     Pendurar uma consequencia nas outras quatro seria a tela prometendo mecanica
     que o motor nao tem — e e a mesma regra que manteve a aprovacao fora da tela
     por tres sessoes. */
  const price =
    person.ambition === "succession"
      ? ` <em>— ${escapeHtml(UI.congress.successionPrice)}</em>`
      : "";

  return (
    `<div class="person" data-office="${escapeHtml(person.office)}">` +
    sigilHtml({
      name: person.name,
      office: person.office,
      reach: person.reach,
      role: person.role,
    }) +
    `<span class="person__who">` +
    `<b class="person__name">${escapeHtml(person.name)}</b>` +
    `<span class="person__role">${escapeHtml(labelOf(UI.congress.office, person.office))}</span>` +
    `</span>` +
    `<span class="person__note">` +
    `<span class="person__ambition">${escapeHtml(ambition)}${price}</span>` +
    `<span class="person__memory" data-tone="${memory.tone}">${escapeHtml(memory.text)}</span>` +
    `</span>` +
    `<span class="person__votes" data-numeric>` +
    (voting
      ? `${seats(person.votes)} <small>${escapeHtml(UI.mesa.seats)} ${seats(person.seats)}</small>`
      : `<small>${escapeHtml(UI.mesa.seats)} ${seats(person.seats)}</small>`) +
    `</span>` +
    `</div>`
  );
}

/**
 * A LINHA DE UMA BANCADA. Ela carrega a historia inteira daquele bloco: humor,
 * estado, verba oferecida, custo, quantas cadeiras isso compra — e, desde
 * 15/08/2026, a GENTE que mora dentro dele.
 *
 * @param {object} input
 * @param {Party} input.party
 * @param {number} input.loyalty
 * @param {number} input.funding de 0 a 1
 * @param {number} input.votes
 * @param {number} input.seatPrice
 * @param {{ obstruction: number, rupture: number }} input.thresholds
 * @param {boolean} input.voting
 * @param {ReadonlyArray<Parameters<typeof personHtml>[0]["person"]>} [input.people]
 */
function benchHtml({ party, loyalty, funding, votes, seatPrice, thresholds, voting, people = [] }) {
  const mood = moodOf(loyalty, thresholds);

  /* O CONTROLE FICA FORA DA PARTE QUE SE REPINTA, e isso e requisito de gesto e
     nao de organizacao: trocar o HTML de um `<input type=range>` no meio de um
     arrasto ARRANCA o elemento que o ponteiro esta segurando, e o arrasto morre
     no primeiro pixel. Por isso a leitura numerica vive num filho proprio, que e
     o unico que a atualizacao ao vivo substitui. */
  return (
    `<div class="bench" data-mood="${mood}" data-party="${escapeHtml(party.id)}">` +
    `<span class="bench__name">${escapeHtml(party.label)}</span>` +
    `<span class="bench__mood" data-numeric title="${escapeHtml(UI.mood[mood])}">` +
    `${seats(loyalty)}<i aria-hidden="true"></i></span>` +
    `<input class="bench__slider" type="range" min="0" max="100" step="5" ` +
    `value="${Math.round(funding * 100)}" data-party="${escapeHtml(party.id)}" ` +
    `aria-label="${escapeHtml(`${UI.mesa.funding} — ${party.label}`)}" />` +
    `<span class="bench__read" data-read="${escapeHtml(party.id)}">` +
    benchReadHtml({ party, funding, votes, seatPrice, voting }) +
    `</span>` +
    /* ── A GENTE MORA DENTRO DO BLOCO, e a aninhagem e a mecanica ──────────────
       Voce paga o BLOCO; o bloco e feito de gente; a gente entrega diferente. Uma
       lista de onze bancadas irmas diria que o lider e o bloco sao a mesma coisa —
       e o desenho do ciclo 4 e o oposto: uma pessoa e uma bancada de um so DENTRO
       da dela, e o resto do bloco continua votando pela ideologia do bloco. */
    (people.length > 0
      ? `<div class="bench__people">` +
        people.map(person => personHtml({ person, voting })).join("") +
        `</div>`
      : "") +
    `</div>`
  );
}

/**
 * A LEITURA de uma bancada: o que muda enquanto o controle e arrastado.
 *
 * @param {object} input
 * @param {Party} input.party
 * @param {number} input.funding
 * @param {number} input.votes
 * @param {number} input.seatPrice
 * @param {boolean} input.voting
 * @returns {string}
 */
export function benchReadHtml({ party, funding, votes, seatPrice, voting }) {
  const cost = funding * party.seats * seatPrice;

  return (
    `<span class="bench__share" data-numeric>${percent(funding)}</span>` +
    `<span class="bench__cost" data-numeric>${money(cost)}</span>` +
    `<span class="bench__votes" data-numeric>` +
    (voting ? `${seats(votes)} <small>${escapeHtml(UI.mesa.seats)} ${party.seats}</small>` : "—") +
    `</span>`
  );
}

/**
 * A MESA inteira.
 *
 * @param {object} input
 * @param {Bill | null} input.bill
 * @param {string} input.areaLabel
 * @param {number} input.quorum zero quando a acao nao vai a plenario
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.loyalty
 * @param {Record<string, number>} input.funding
 * @param {Forecast | null} input.forecast
 * @param {Record<string, number>} input.byBloc votos que cada BLOCO entrega, ja somados
 * @param {ReadonlyArray<{ id: string,
 *   people: ReadonlyArray<Parameters<typeof personHtml>[0]["person"]> }>} input.blocs
 *   os blocos com a GENTE dentro, montados pela camada de aplicacao
 * @param {number} input.band
 * @param {number} input.seatPrice
 * @param {number} input.room o discricionario que cabe no mes
 * @param {number} input.demand tudo o que foi prometido no mes — emenda e areas
 * @param {{ obstruction: number, rupture: number }} input.thresholds
 * @returns {string}
 */
export function mesaHtml(input) {
  const { bill, forecast, quorum } = input;
  const voting = quorum > 0 && forecast !== null;

  /* ⚠ O SOBRANCELHO "EM PAUTA" SAIU DAQUI em 15/08/2026, e ele saiu por um defeito
     que a captura pegou no mesmo dia em que ele nasceu. Quando o Congresso virou
     uma lamina so, a legenda do bloco passou a dizer "Em pauta" — e este parrafo
     dizia a mesma coisa uma linha abaixo, em dois pesos diferentes. Titulo repetido
     em dois tamanhos e a marca de uma tela remendada, e foi exatamente por isso que
     o rotulo do relatorio saiu junto. Quem nomeia a secao e a secao. */
  const head = bill
    ? `<h2 class="mesa__title">${escapeHtml(bill.label)}</h2>` +
      `<p class="mesa__meta">` +
      `<span class="badge" data-instrument="${escapeHtml(bill.instrument)}">` +
      `${escapeHtml(labelOf(UI.instrument, bill.instrument))}</span>` +
      `<span>${escapeHtml(input.areaLabel)}</span>` +
      `<span>${escapeHtml(labelOf(UI.instrumentHint, bill.instrument))}` +
      (voting ? ` · ${seats(quorum)}` : "") +
      `</span>` +
      /* O NUMERO VEM ANTES DA UNIDADE, e com o sinal explicito: a versao
         anterior escrevia "/ano -34,0", que se lê como uma unidade seguida de um
         numero solto. E o menos e o tipografico, o mesmo da coluna da area —
         dois sinais de menos diferentes na mesma grandeza sao dois formatos de
         numero na mesma tela. */
      `<span>${escapeHtml(UI.mesa.result)} ` +
      `${signed(bill.fiscalImpact, 1)}${escapeHtml(UI.area.perYear)}</span>` +
      `<button class="mesa__swap" type="button" data-section="${escapeHtml(bill.area)}">` +
      `${escapeHtml(UI.mesa.swap)}</button>` +
      `</p>`
    : /* O VAZIO USA A PECA DE VAZIO, e nao um paragrafo com outro nome. Ele era
         `mesa__eyebrow` + `mesa__meta` — as mesmas classes do TITULO de uma pauta
         real —, entao "Nada em pauta" saia com o peso de um assunto em discussao. O
         Gabinete ja tinha a forma certa para isto: chamada centrada respondendo
         "isto esta quebrado?", e a prosa embaixo respondendo "por que?". Uma forma
         so para os dois estados vazios do jogo. */
      `<div class="empty">` +
      `<p class="empty__lead">${escapeHtml(UI.mesa.empty)}</p>` +
      `<p class="empty__note">${escapeHtml(UI.mesa.emptyHint)}</p>` +
      `</div>`;

  /* ⚠ OS VOTOS DA LINHA VEM SOMADOS DO MOTOR. Esta linha procurava a bancada de
     mesmo id que o bloco, e depois do ELENCO isso encontra apenas o RESTO do bloco
     — o que sobrou dele depois de os lideres saírem com a fracao que arrastam. As
     quatro linhas somavam menos que o placar impresso logo abaixo delas, e nada
     acusava, porque cada linha estava certa sozinha. */
  const peopleOf = new Map(input.blocs.map(bloc => [bloc.id, bloc.people]));

  const benches = input.parties
    .map(party =>
      benchHtml({
        party,
        loyalty: input.loyalty[party.id] ?? 0,
        funding: input.funding[party.id] ?? 0,
        votes: input.byBloc[party.id] ?? 0,
        seatPrice: input.seatPrice,
        thresholds: input.thresholds,
        voting,
        people: peopleOf.get(party.id) ?? [],
      }),
    )
    .join("");

  /* O RESUMO E UMA REGIAO VIVA, e por uma razao de teclado: quem move o controle
     com as setas nao ve o placar mudar de canto de olho — ele precisa ouvir. Sao
     tres linhas curtas, entao o anuncio cabe entre um passo e o seguinte. */
  /* ⚠ ELA DEIXOU DE SER UMA LAMINA em 15/08/2026, e passou a ser o miolo de um
     bloco. A mesa era `glass-stage` porque era a peca principal de uma tela feita
     de tres vidros soltos; com o Congresso virando uma lamina so, ela e uma secao
     como "As contas" em Financas. Quem embrulha agora e `congressHtml`. */
  return (
    `<section class="mesa">` +
    `<div class="mesa__head">${head}</div>` +
    `<div class="mesa__benches">${benches}</div>` +
    `<div class="tally" id="tally" aria-live="polite">${tallyHtml(input)}</div>` +
    `</section>`
  );
}

/**
 * A TELA DO CONGRESSO INTEIRA — uma lamina, uma cabeca, tres blocos.
 *
 * ⚠ ELA NASCEU DE UMA REVISAO DE FORMA, e o desvio que ela corrige era o maior do
 * projeto: esta era a UNICA tela montada como tres pecas de vidro empilhadas no
 * tabuleiro — a faixa de indices, a mesa e o relatorio —, e a UNICA sem cabeca. As
 * outras quatro dizem quem sao ("o placar / Financas", "a moldura / O Estado"); a
 * tela onde o mes de fato se decide nao dizia nada, e o jogador so sabia onde
 * estava pelo item aceso no rail.
 *
 * O EMBRULHO MORA AQUI, E NAO NO ENTRYPOINT. `app.mjs` concatenava as tres pecas a
 * mao, o que punha decisao de forma no arquivo que nao pode ter nenhuma — quem
 * desenha o Congresso passaria a ter de lembrar que a lamina dele vive no wiring.
 * Toda view traz o proprio elemento de fora, e esta traz o dela.
 *
 * @param {object} input
 * @param {string} input.gauges a faixa de indices, ja montada
 * @param {string} input.mesa a mesa de negociacao, ja montada
 * @param {string} input.report o relatorio do mes passado, ja montado
 * @returns {string}
 */
/**
 * A GAVETA — o que esta andando, e ha quanto tempo.
 *
 * ⚠ ELA E A METADE VISIVEL DA TRAMITACAO, e sem ela a outra metade seria uma
 * mentira. Com o texto virando instantaneo, "em pauta" e "sendo votado" eram a
 * mesma coisa; agora o que o jogador escreve hoje vai para a gaveta e so vota daqui
 * a tres meses. Uma tela que nao mostrasse a fila deixaria o jogador escrevendo no
 * escuro — ele veria a lei sumir e reaparecer sem saber onde ela esteve.
 *
 * ⚠ O RELOGIO DA GAVETA E DITO. Um texto engavetado morre em seis meses, e sem o
 * numero na tela "na gaveta" seria um estado permanente aos olhos de quem joga —
 * quando na verdade ha uma contagem correndo contra ele.
 *
 * @param {ReadonlyArray<{ id: string, label: string, stage: string, waiting: number,
 *   expires: number | null, instrument: string, quorum: number, saved: string | null }>} bills
 * @returns {string}
 */
export function passageHtml(bills) {
  if (bills.length === 0) {
    return (
      `<div class="empty">` +
      `<p class="empty__lead">${escapeHtml(UI.congress.passageEmpty)}</p>` +
      `<p class="empty__note">${escapeHtml(UI.congress.passageNote)}</p>` +
      `</div>`
    );
  }

  const rows = bills
    .map(bill => {
      /* O RELOGIO SO APARECE NA GAVETA, e so quando ele ja apertou: um "morre em 6"
         no mes em que o texto foi protocolado ensinaria o olho a ignorar a linha. */
      const clock =
        bill.expires !== null && bill.expires <= 3
          ? `<span class="passage__clock">${escapeHtml(UI.congress.expires)} ` +
            `<b data-numeric>${seats(bill.expires)}</b></span>`
          : "";

      return (
        `<div class="passage__row" data-stage="${escapeHtml(bill.stage)}">` +
        `<span class="passage__stage">${escapeHtml(labelOf(UI.congress.stage, bill.stage))}</span>` +
        `<span class="passage__what">` +
        `<b class="passage__label">${escapeHtml(bill.label)}</b>` +
        (bill.saved
          ? `<span class="passage__saved">${escapeHtml(UI.congress.savedBy)} ` +
            `${escapeHtml(bill.saved)}</span>`
          : "") +
        `</span>` +
        `<span class="badge" data-instrument="${escapeHtml(bill.instrument)}">` +
        `${escapeHtml(labelOf(UI.instrument, bill.instrument))}</span>` +
        `<span class="passage__wait" data-numeric>` +
        `${escapeHtml(UI.congress.waiting)} ${seats(bill.waiting)}${clock ? "" : ""}</span>` +
        clock +
        `</div>`
      );
    })
    .join("");

  return `<div class="passage">${rows}</div>`;
}

/**
 * @param {object} input
 * @param {string} input.gauges
 * @param {string} input.mesa
 * @param {string} input.report
 * @param {string} input.passage
 */
export function congressHtml({ gauges, mesa, report, passage }) {
  /* A MESMA CASCA DE BLOCO DE FINANCAS E DA AREA, e nao uma terceira: legenda em
     versalete e o corpo embaixo. Uma forma propria aqui seria a quarta maneira de
     dizer "isto e uma secao desta tela". */
  const block = (/** @type {string} */ legend, /** @type {string} */ body) =>
    `<section class="area__block">` +
    `<h3 class="area__legend">${escapeHtml(legend)}</h3>` +
    body +
    `</section>`;

  return (
    `<section class="area glass-stage">` +
    headHtml({ eyebrow: UI.congress.eyebrow, title: UI.nav.congress }) +
    block(UI.congress.country, gauges) +
    block(UI.congress.agenda, mesa) +
    block(UI.congress.passage, passage) +
    block(UI.report.panel, report) +
    `</section>`
  );
}

/**
 * O RESUMO — a parte que se repinta a cada movimento do controle.
 *
 * Ela separa CERTEZA de RISCO na propria hierarquia: a previsao vem com banda
 * porque o dia e sorteado; o dinheiro vem sem ressalva porque o rateio e uma
 * conta. Dizer "risco de rateio de 12%" inventaria incerteza que nao existe.
 *
 * @param {object} input
 * @param {Bill | null} input.bill
 * @param {number} input.quorum
 * @param {Forecast | null} input.forecast
 * @param {number} input.band
 * @param {number} input.room
 * @param {number} input.demand
 * @returns {string}
 */
export function tallyHtml({ bill, quorum, forecast, band, room, demand }) {
  const voting = quorum > 0 && forecast !== null;

  /* SEM VOTACAO NAO HA PLACAR, e entao nao ha linha de placar. A primeira versao
     punha um travessao no lugar do numero — no maior degrau da escala, um
     travessao de 4,5rem que ocupava a tela inteira para dizer "nada". E o
     veredito vinha marcado como APROVADO, entao "escolha uma acao numa das
     areas" chegava em verde de vitoria. Ausencia de pauta nao e aprovacao nem
     derrota: e ausencia, e a unica forma honesta de mostra-la e nao mostrar. */
  /* ⚠ O PLACAR MUDOU DE TEMPO, E A TELA TEM DE DIZER ISSO. Ate 15/08/2026 este
     numero era a previsao da votacao DESTE mes; com a tramitacao, o texto que o
     jogador esta escrevendo vai para a gaveta e so vota daqui a tres meses.
     Anunciar "acima do quorum" sem dizer QUANDO seria prometer um mes que nao e
     este — e e exatamente a familia de defeito que esta sessao passou consertando:
     a tela afirmando um resultado que o turno nao vai produzir.
     O NUMERO CONTINUA CERTO, e continua vindo da mesma camara. O que ele deixou de
     ser e uma previsao sobre agora. */
  const call = voting
    ? `<p class="tally__forecast" data-numeric>` +
      `${seats(forecast.votes)} <span class="tally__band">± ${seats(band)}</span> ` +
      `<small>${escapeHtml(UI.mesa.needs)} ${seats(quorum)}</small></p>` +
      `<p class="tally__verdict" data-passes="${forecast.votes >= quorum}">` +
      `${escapeHtml(forecast.votes >= quorum ? UI.mesa.above : UI.mesa.below)}</p>` +
      `<p class="tally__when">${escapeHtml(UI.congress.willFile)} · ` +
      `${escapeHtml(UI.congress.forecastLater)}</p>`
    : /* ⚠ SEM PAUTA, O PLACAR NAO REPETE O ESTADO VAZIO. Esta linha imprimia
         `UI.mesa.emptyHint` — "escolha uma ação numa das áreas" —, que e
         EXATAMENTE a frase que o vazio do bloco acima ja diz, e a captura do
         celular pegou as duas na mesma tela, com pesos diferentes. E o segundo
         defeito desta familia no mesmo dia: quem nomeia uma ausencia e o lugar
         onde ela acontece, e uma vez so.
         O DECRETO CONTINUA SENDO DITO, porque ali ha pauta e nao ha votacao — e
         "vale sem passar pelo plenario" e informacao que nenhum outro lugar da. */
      bill
      ? `<p class="tally__verdict">${escapeHtml(UI.mesa.decree)}</p>`
      : "";

  const fits = demand <= room + 1e-9;

  return (
    call +
    `<p class="tally__cash" data-fits="${fits}">` +
    `${escapeHtml(UI.mesa.promises)} <b data-numeric>${money(demand)}</b> · ` +
    `${escapeHtml(fits ? UI.mesa.fits : UI.mesa.over)} <b data-numeric>${money(room)}</b>` +
    `</p>`
  );
}
