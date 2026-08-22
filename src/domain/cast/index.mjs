/* O acidente que a auditoria teme — um Congresso com 90% de extremistas — nao e um sorteio
   infeliz, e um esquema mal escrito; e esse tipo de erro tem guarda desde a terceira sessao.
   Um bloco de um so. O ciclo previu isso e a previsao se confirmou: ECLUSA nao
   mudou uma linha para atender o elenco, porque uma pessoa tem posicao e
   venalidade exatamente como uma bancada tem. O que ela tem A MAIS sao duas
   coisas, e sao elas que transformam barganha em relacao: */

/**
 * @typedef {import("../../data/parties.mjs").Party} Party
 * @typedef {import("../../data/cast.mjs").Archetype} Archetype
 * @typedef {import("../../data/cast.mjs").CastParameters} CastParameters
 * @typedef {import("../../state/random.mjs").Stream} Stream
 * @typedef {object} Person
 * @property {string} id
 * @property {string} name - inventado, sempre; ver o ADR 0003
 * @property {string} archetype
 * @property {string} label - o arquetipo em uma linha, para a tela
 * @property {string} bloc - o bloco de onde ela sai
 * @property {string} office - o cargo; um de `OFFICES`
 * @property {number} economic
 * @property {number} liberty
 * @property {number} venalityEconomic
 * @property {number} venalityLiberty
 * @property {string} ambition - o que ela quer; um de `AMBITIONS`
 * @property {number} reach - fracao da bancada que ela de fato arrasta
 * @typedef {object} Memory o saldo de cada pessoa com o governo, de -cap a +cap
 * @typedef {Record<string, number>} Ledger
 */

/* QUANTO DA BANCADA OS LIDERES PODEM LEVAR, no maximo, somados. */
const CROWD = 0.85;

/** @param {number} value @param {number} min @param {number} max */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * UM NUMERO DERIVADO DE UM TEXTO, entre 0 e 1 — deterministico e sem estado.
 *
 * unicos motores autorizados a sortear sao TEMPORAL e ECLUSA, e cada um tem o
 * fluxo dele justamente para que calibrar um nao desloque o outro. Um elenco que
 * puxasse do mesmo fluxo faria acrescentar um personagem mudar o resultado de
 * todas as votacoes do mandato — o defeito que `streamFrom` existe para impedir,
 * visto de outro angulo.
 * @param {string} text
 * @returns {number} de 0 (inclusive) a 1 (exclusive)
 */
function hashed(text) {
  /* FNV-1a de 32 bits. */
  let hash = 2166136261;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 100000) / 100000;
}

/**
 * ⚠ FUNCAO PURA E SEM FLUXO: mesma semente e mesmo catalogo devolvem exatamente as mesmas
 * pessoas, na mesma ordem.
 *
 * O ELENCO DE UMA PARTIDA.
 * @param {object} input
 * @param {number} input.seed
 * @param {ReadonlyArray<Party>} input.parties
 * @param {ReadonlyArray<Archetype>} input.archetypes
 * @param {ReadonlyArray<string>} input.firstNames
 * @param {ReadonlyArray<string>} input.surnames
 * @param {ReadonlyArray<string>} input.ambitions
 * @returns {Person[]}
 */
export function cast({ seed, parties, archetypes, firstNames, surnames, ambitions }) {
  /** @type {Person[]} */
  const people = [];
  /** @type {Set<string>} */
  const used = new Set();

  for (const archetype of archetypes) {
    const bloc = parties.find(party => party.id === archetype.bloc);
    /* ARQUETIPO ORFAO NAO VIRA PESSOA, e nao vira em silencio: quem valida o catalogo e
       `catalogViolations`, e ele acusa o id que nao existe. */
    if (!bloc) continue;

    const base = `${seed}:${archetype.id}`;

    /* Sem o desempate, dois arquetipos podiam receber o mesmo nome na mesma partida — e dois
       sujeitos homonimos num Congresso de doze pessoas nao e sabor local, e um defeito que o
       jogador lê como bug. */
    let name = "";
    for (let attempt = 0; attempt < firstNames.length * surnames.length; attempt++) {
      const first = firstNames[Math.floor(hashed(`${base}:first:${attempt}`) * firstNames.length)];
      const last = surnames[Math.floor(hashed(`${base}:last:${attempt}`) * surnames.length)];
      name = `${first ?? ""} ${last ?? ""}`.trim();
      if (!used.has(first ?? "") && !used.has(last ?? "")) break;
    }
    const [taken = "", ...rest] = name.split(" ");
    used.add(taken);
    used.add(rest.join(" "));

    const ambition = ambitions[Math.floor(hashed(`${base}:ambition`) * ambitions.length)] ?? "seat";

    /* ── O DESVIO DO BLOCO ─────────────────────────────────────────────────── A pessoa nasce
       ONDE O BLOCO ESTA e se desloca pelo arquetipo, e nao num ponto qualquer do plano. */
    const jitter = (/** @type {string} */ axis) => (hashed(`${base}:${axis}`) - 0.5) * 8;

    people.push({
      id: archetype.id,
      name,
      archetype: archetype.id,
      label: archetype.label,
      bloc: bloc.id,
      office: archetype.office,
      economic: clamp(bloc.economic + archetype.economicShift + jitter("economic"), 0, 100),
      liberty: clamp(bloc.liberty + archetype.libertyShift + jitter("liberty"), 0, 100),
      venalityEconomic: clamp(bloc.venalityEconomic + archetype.venalityShift, 0, 1),
      venalityLiberty: clamp(bloc.venalityLiberty + archetype.venalityShift, 0, 1),
      ambition,
      reach: clamp(
        archetype.reachMin +
          hashed(`${base}:reach`) * Math.max(0, archetype.reachMax - archetype.reachMin),
        0,
        1,
      ),
    });
  }

  return people;
}

/**
 * Um presidente com o mesmo nome do lider do Centrao nao e sabor local — e um defeito que o
 * jogador lê como bug, e ha uma prova cobrando isso para o elenco .
 *
 * @param {object} input
 * @param {number} input.seed
 * @param {ReadonlyArray<Person>} input.people o elenco ja gerado, para nao repetir
 * @param {ReadonlyArray<string>} input.firstNames
 * @param {ReadonlyArray<string>} input.surnames
 * @returns {{ id: string, name: string, office: string }}
 */
export function president({ seed, people, firstNames, surnames }) {
  /* ⚠ POR PEDACO, PELA MESMA RAZAO DE `cast`: um presidente "Jorge Camargo" ao lado de um
     relator "Jorge Queiroz Sampaio" lê como defeito de gerador, e o presidente e a pessoa que
     a tela cita com mais frequencia. */
  /** @type {Set<string>} */
  const used = new Set();
  for (const person of people) {
    const [first = "", ...rest] = person.name.split(" ");
    used.add(first);
    used.add(rest.join(" "));
  }
  const base = `${seed}:president`;

  let name = "";
  for (let attempt = 0; attempt < firstNames.length * surnames.length; attempt++) {
    const first = firstNames[Math.floor(hashed(`${base}:first:${attempt}`) * firstNames.length)];
    const last = surnames[Math.floor(hashed(`${base}:last:${attempt}`) * surnames.length)];
    name = `${first ?? ""} ${last ?? ""}`.trim();
    if (!used.has(first ?? "") && !used.has(last ?? "")) break;
  }

  return { id: "president", name, office: "president" };
}

/**
 * Se fosse outro fato, existiriam duas versoes do que aconteceu naquele mes — e elas
 * divergiriam exatamente no mes em que o teto fechou, que e o mes em que o jogador precisa
 * entender por que todo mundo o abandonou.
 *
 * A TRAICAO PESA MAIS QUE O FAVOR, e a assimetria e a mesma de SONDA. Sem ela o
 * jogo ensinaria que da para queimar alguem e comprar de volta pelo mesmo preco —
 * e ai a memoria seria um numero que anda, e nao uma relacao.
 * @param {object} input
 * @param {ReadonlyArray<Person>} input.people
 * @param {Ledger} input.memory - o saldo de cada pessoa, no inicio do mes
 * @param {Record<string, number>} input.promised - por BLOCO, de 0 a 1
 * @param {Record<string, number>} input.paid - por BLOCO, de 0 a 1
 * @param {CastParameters} input.parameters
 * @returns {Ledger}
 */
export function remember({ people, memory, promised, paid, parameters }) {
  /** @type {Ledger} */
  const next = {};

  for (const person of people) {
    const was = memory[person.id] ?? 0;
    const offered = clamp(promised[person.bloc] ?? 0, 0, 1);
    const honoured = clamp(paid[person.bloc] ?? 0, 0, 1);
    const broken = Math.max(0, offered - honoured);

    /* O DECAIMENTO VEM PRIMEIRO, e o do mes entra por cima. */
    const decayed = was * parameters.memoryDecay;
    const moved =
      honoured * parameters.favourWeight * person.reach -
      broken * parameters.betrayalWeight * person.reach;

    next[person.id] = clamp(decayed + moved, -parameters.memoryCap, parameters.memoryCap);
  }

  return next;
}

/**
 * A PESSOA COMO UMA BANCADA — e e assim que ela chega ao Congresso.
 *
 * exatamente o que credito de confianca significa, e o que permite ECLUSA
 * continuar sem saber que o elenco existe.
 * termo de ECLUSA pela mesma razao: o que esta em disputa nao e o preco, e a vaga.
 * @param {object} input
 * @param {ReadonlyArray<Person>} input.people
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Ledger} input.memory
 * @param {CastParameters} input.parameters
 * @returns {{ benches: Party[], credit: Record<string, number> }}
 */
export function benches({ people, parties, memory, parameters }) {
  /** @type {Party[]} */
  const benches = [];
  /** @type {Record<string, number>} */
  const credit = {};

  for (const party of parties) {
    const leaders = people.filter(person => person.bloc === party.id && person.reach > 0);

    /* O sintoma seria devastador e silencioso: toda maioria do jogo passaria a ser medida
       contra uma Camara que nao existe, e nenhuma tela denunciaria, porque cada bancada
       estaria certa sozinha. */
    const claimed = leaders.reduce((sum, person) => sum + person.reach, 0);
    const scale = claimed > CROWD ? CROWD / claimed : 1;

    let handed = 0;

    for (const person of leaders) {
      const seats = Math.round(party.seats * person.reach * scale);
      if (seats <= 0) continue;
      handed += seats;

      const saved = memory[person.id] ?? 0;
      /* O CREDITO E EM UNIDADES DE VERBA, de -1 a 1, porque e assim que ECLUSA lê dinheiro. */
      credit[person.id] = clamp(saved / parameters.memoryCap, -1, 1);

      benches.push({
        id: person.id,
        label: person.name,
        /* ⚠ A SIGLA DE UMA PESSOA E A DA BANCADA DELA, e nao uma legenda propria: o que este
           bloco monta e uma bancada de UM — o sujeito que arrasta uma fatia do proprio
           partido —, e inventar uma sigla para ele diria que ele fundou um partido. */
        sigla: party.sigla,
        /* A SUCESSAO ENTRA COMO DISTANCIA, e nao como venalidade menor: quem quer a vaga nao
           fica mais caro, fica mais LONGE — e distancia e o que dinheiro compra pela metade. */
        economic: person.economic,
        liberty: person.liberty,
        venalityEconomic: person.venalityEconomic,
        venalityLiberty: person.venalityLiberty,
        seats,
      });
    }

    /* O QUE SOBRA DA BANCADA continua sendo a bancada: mesma posicao, mesma venalidade, menos
       cadeiras. */
    const rest = party.seats - handed;
    if (rest > 0) benches.push({ ...party, seats: rest });
  }

  return { benches, credit };
}

/**
 * A VERBA QUE CADA BANCADA VÊ, com o credito de memoria somado.
 *
 * @param {object} input
 * @param {ReadonlyArray<Person>} input.people
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.funding - por BLOCO, de 0 a 1
 * @param {Record<string, number>} input.credit - por PESSOA, de -1 a 1
 * @param {CastParameters} input.parameters
 * @returns {Record<string, number>}
 */
export function offered({ people, parties, funding, credit, parameters }) {
  /** @type {Record<string, number>} */
  const table = {};

  for (const party of parties) table[party.id] = clamp(funding[party.id] ?? 0, 0, 1);

  for (const person of people) {
    const fromBloc = clamp(funding[person.bloc] ?? 0, 0, 1);
    const saved = credit[person.id] ?? 0;

    /* A AMBICAO DE SUCESSAO DESCONTA a verba que o sujeito reconhece: ele aceita o dinheiro e
       continua querendo o cargo. */
    const drag = person.ambition === "succession" ? parameters.successionDrag : 0;
    table[person.id] = clamp(fromBloc * (1 - drag) + saved, -1, 1);
  }

  return table;
}
