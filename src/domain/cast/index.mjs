/* ELENCO — a republica ganha gente, e a gente lembra.
   recebe   os blocos, os arquétipos, o vocabulário de nomes e uma semente
   devolve  as pessoas do mandato, e o preço que a memória de cada uma cobra

   As pessoas são GERADAS da semente: um elenco fixo seria decorado em duas partidas, e o
   mandato continua reproduzível — a regra que sustenta save, simulador e calibragem.

   ⚠ DETERMINÍSTICO NÃO E ALEATÓRIO, e a distinção responde ao risco R4 da auditoria: o
   gerador distribui dentro de faixas que o catálogo declara. Um Congresso com 90% de
   extremistas não seria sorteio infeliz, seria esquema mal escrito — e disso há guarda.

   ⚠ UMA PESSOA E UM BLOCO DE UM SÓ, e por isso ECLUSA não mudou uma linha para atende-la.
   O que ela tem A MAIS são MEMÓRIA e AMBIÇÃO. */

/**
 * @typedef {import("../../data/parties.mjs").Party} Party
 * @typedef {import("../../data/cast.mjs").Archetype} Archetype
 * @typedef {import("../../data/cast.mjs").CastParameters} CastParameters
 * @typedef {import("../../state/random.mjs").Stream} Stream
 * @typedef {object} Person
 * @property {string} id
 * @property {string} name - inventado, sempre; ver o ADR 0003
 * @property {"f" | "m"} gender - sai do vocabulario de nomes, e a tela so o usa para escolher
 * a silhueta do sinete: não há rosto, e um rosto inventado seria a cara de alguém
 * @property {string} archetype
 * @property {string} label - o arquetipo em uma linha, para a tela
 * @property {string} bloc - o bloco de onde ela sai
 * @property {string} office - o cargo; um de `OFFICES`
 * @property {number} economic
 * @property {number} liberty
 * @property {number} venalityEconomic
 * @property {number} venalityLiberty
 * @property {string} ambition - o que ela quer; um de `AMBITIONS`
 * @property {string} portfolio - a pasta que ela quer, e so `cabinet` a cobra: a tela a
 * nomeia, e quem não quer ministério nunca a usa
 * @property {number} reach - fracao da bancada que ela de fato arrasta
 * @typedef {object} Memory o saldo de cada pessoa com o governo, de -cap a +cap
 * @typedef {Record<string, number>} Ledger
 */

/* QUANTO DA BANCADA OS LÍDERES PODEM LEVAR, no máximo, somados. */
const CROWD = 0.85;

/** @param {number} value @param {number} min @param {number} max */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * UM NÚMERO DERIVADO DE UM TEXTO, entre 0 e 1 — determinístico e sem estado.
 *
 * Cada motor que sorteia tem o fluxo dele, para que calibrar um não desloque o outro. Um
 * elenco que puxasse do mesmo fluxo faria acrescentar um personagem mudar o resultado de
 * todas as votações do mandato — o defeito que `streamFrom` existe para impedir.
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
 * ⚠ FUNÇÃO PURA E SEM FLUXO: mesma semente e mesmo catálogo devolvem exatamente as mesmas
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
 * @param {ReadonlyArray<string>} input.areas - os ids das pastas que o governo tem
 * @param {ReadonlyMap<string, "f" | "m">} input.genderOf
 * @returns {Person[]}
 */
export function cast({
  seed,
  parties,
  archetypes,
  firstNames,
  surnames,
  ambitions,
  areas,
  genderOf,
}) {
  /** @type {Person[]} */
  const people = [];
  /** @type {Set<string>} */
  const used = new Set();

  for (const archetype of archetypes) {
    const bloc = parties.find(party => party.id === archetype.bloc);
    /* ARQUÉTIPO ÓRFÃO NÃO VIRA PESSOA, e não vira em silêncio: quem valida o catálogo e
       `catalogViolations`, e ele acusa o id que não existe. */
    if (!bloc) continue;

    const base = `${seed}:${archetype.id}`;

    /* Sem o desempate, dois arquétipos podiam receber o mesmo nome na mesma partida — e dois
       sujeitos homônimos num Congresso de doze pessoas não e sabor local, e um defeito que o
       jogador lê como bug. */
    let name = "";
    for (let attempt = 0; attempt < firstNames.length * surnames.length; attempt++) {
      const first = firstNames[Math.floor(hashed(`${base}:first:${attempt}`) * firstNames.length)];
      const last = surnames[Math.floor(hashed(`${base}:last:${attempt}`) * surnames.length)];
      const full = `${first ?? ""} ${last ?? ""}`.trim();
      if (full && !used.has(full) && !used.has(first ?? "") && !used.has(last ?? "")) {
        name = full;
        break;
      }
    }
    const [taken = "", ...rest] = name.split(" ");
    used.add(taken);
    const surname = rest.join(" ");
    if (surname) used.add(surname);

    const ambition = ambitions[Math.floor(hashed(`${base}:ambition`) * ambitions.length)] ?? "seat";

    /* A PASTA SAI DE CHAVE PRÓPRIA, e por isso ela não desloca ninguém: nome, ambição e
       alcance continuam saindo dos mesmos hashes, e toda partida já salva refaz o mesmo
       elenco. */
    const portfolio = areas[Math.floor(hashed(`${base}:portfolio`) * areas.length)] ?? "";

    /* ── O DESVIO DO BLOCO ─────────────────────────────────────────────────── A pessoa nasce
       ONDE O BLOCO ESTA e se desloca pelo arquétipo, e não num ponto qualquer do plano. */
    const jitter = (/** @type {string} */ axis) => (hashed(`${base}:${axis}`) - 0.5) * 8;

    people.push({
      id: archetype.id,
      name,
      gender: genderOf.get(name.split(" ")[0] ?? "") ?? "m",
      archetype: archetype.id,
      label: archetype.label,
      bloc: bloc.id,
      office: archetype.office,
      economic: clamp(bloc.economic + archetype.economicShift + jitter("economic"), 0, 100),
      liberty: clamp(bloc.liberty + archetype.libertyShift + jitter("liberty"), 0, 100),
      venalityEconomic: clamp(bloc.venalityEconomic + archetype.venalityShift, 0, 1),
      venalityLiberty: clamp(bloc.venalityLiberty + archetype.venalityShift, 0, 1),
      ambition,
      portfolio,
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
 * UM TRAÇO DA PESSOA, tirado da semente dentro de uma faixa: a mesma pessoa tem o mesmo
 * orgulho em toda partida com a mesma semente, e o save não precisa guardá-lo.
 * @param {number} seed
 * @param {string} id - quem
 * @param {string} name - qual traço
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function trait(seed, id, name, min, max) {
  return min + (max - min) * hashed(`${seed}:${id}:agency:${name}`);
}

/**
 * Um presidente com o mesmo nome do líder do Centrao não e sabor local — e um defeito que o
 * jogador lê como bug, e há uma prova cobrando isso para o elenco .
 *
 * @param {object} input
 * @param {number} input.seed
 * @param {ReadonlyArray<Person>} input.people o elenco ja gerado, para nao repetir
 * @param {ReadonlyArray<string>} input.firstNames
 * @param {ReadonlyArray<string>} input.surnames
 * @returns {{ id: string, name: string, office: string }}
 */
export function president({ seed, people, firstNames, surnames }) {
  /* ⚠ POR PEDAÇO, PELA MESMA RAZÃO DE `cast`: um presidente "Jorge Camargo" ao lado de um
     relator "Jorge Queiroz Sampaio" lê como defeito de gerador, e o presidente e a pessoa que
     a tela cita com mais frequência. */
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
    const full = `${first ?? ""} ${last ?? ""}`.trim();
    if (full && !used.has(full) && !used.has(first ?? "") && !used.has(last ?? "")) {
      name = full;
      break;
    }
  }

  return { id: "president", name, office: "president" };
}

/**
 * @typedef {object} Minister
 * @property {string} id
 * @property {string} area
 * @property {string} person - quem ocupa a cadeira: o nomeado, ou o papel quando a cadeira está vaga
 * @property {string | null} party
 * @property {string} name
 * @property {"f" | "m"} gender
 * @property {number} riskAversion
 * @property {number} persistence
 * @property {number} hope - o prior de que o Presidente aceite o que ele pede
 * @property {number} fiscal - o peso do espaço fiscal contra a verba da pasta
 */

/**
 * OS MINISTROS DO CORTE: mesma semente, mesmas pessoas. O cargo vem do papel; a semente escolhe
 * o nome e os traços dentro das faixas dele.
 * @param {object} input
 * @param {number} input.seed
 * @param {ReadonlyArray<import("../../data/ministers.mjs").MinisterRole>} input.roles
 * @param {ReadonlyArray<string>} input.taken - nomes já usados na partida
 * @param {ReadonlyArray<string>} input.firstNames
 * @param {ReadonlyArray<string>} input.surnames
 * @param {ReadonlyMap<string, "f" | "m">} input.genderOf
 * @param {Record<string, { id: string, name: string, party: string | null }>} [input.sitting] - quem o
 * Presidente nomeou, por cadeira; cadeira vaga fica com o interino que a semente gera
 * @returns {Minister[]}
 */
export function ministers({ seed, roles, taken, firstNames, surnames, genderOf, sitting = {} }) {
  /** @type {Set<string>} */
  const used = new Set();
  for (const name of taken) {
    const [first = "", ...rest] = name.split(" ");
    used.add(first);
    used.add(rest.join(" "));
  }
  return roles.map(role => {
    const base = `${seed}:${role.id}`;
    let first = "";
    let last = "";
    for (let attempt = 0; attempt < firstNames.length * surnames.length; attempt++) {
      first = firstNames[Math.floor(hashed(`${base}:first:${attempt}`) * firstNames.length)] ?? "";
      last = surnames[Math.floor(hashed(`${base}:last:${attempt}`) * surnames.length)] ?? "";
      if (first && last && !used.has(first) && !used.has(last)) break;
    }
    used.add(first);
    used.add(last);
    const named = sitting[role.seat];
    const person = named ? named.id : role.id;
    const self = named ? `${seed}:${named.id}` : base;
    /** @param {string} trait @param {number} min @param {number} max */
    const pick = (trait, min, max) => min + (max - min) * hashed(`${self}:${trait}`);
    const name = named ? named.name : `${first} ${last}`;
    return {
      id: role.id,
      area: role.area,
      person,
      party: named ? named.party : null,
      name,
      gender: genderOf.get(name.split(" ")[0] ?? "") ?? "m",
      riskAversion: pick("risk", role.riskMin, role.riskMax),
      persistence: pick("persist", role.persistMin, role.persistMax),
      hope: pick("hope", role.hopeMin, role.hopeMax),
      fiscal: pick("fiscal", role.fiscalMin, role.fiscalMax),
    };
  });
}

/**
 * Se fosse outro fato, existiriam duas versões do que aconteceu naquele mês — e elas
 * divergiriam exatamente no mês em que o teto fechou, que e o mês em que o jogador precisa
 * entender por que todo mundo o abandonou.
 *
 * A TRAIÇÃO PESA MAIS QUE O FAVOR, e a assimetria e a mesma de SONDA. Sem ela o
 * jogo ensinaria que da para queimar alguém e comprar de volta pelo mesmo preço —
 * e ai a memória seria um número que anda, e não uma relação.
 * @param {object} input
 * @param {ReadonlyArray<Person>} input.people
 * @param {Ledger} input.memory - o saldo de cada pessoa, no inicio do mes
 * @param {Record<string, number>} input.promised - por BLOCO, de 0 a 1
 * @param {Record<string, number>} input.paid - por BLOCO, de 0 a 1
 * @param {CastParameters} input.parameters
 * @param {string | null} [input.ruling] - a bancada que elegeu o presidente
 * @returns {Ledger}
 */
export function remember({ people, memory, promised, paid, parameters, ruling = null }) {
  /** @type {Ledger} */
  const next = {};

  for (const person of people) {
    const was = memory[person.id] ?? 0;
    const offered = clamp(promised[person.bloc] ?? 0, 0, 1);
    const honoured = clamp(paid[person.bloc] ?? 0, 0, 1);
    const broken = Math.max(0, offered - honoured);

    /* O DECAIMENTO VEM PRIMEIRO, e o do mês entra por cima. */
    const decayed = was * parameters.memoryDecay;

    /* ⚠ TRAIR O PRÓPRIO PARTIDO CUSTA O DOBRO, e o favor NÃO vale o dobro: a assimetria e a
       mesma da memória comum, e aqui ela e mais forte — quem e da casa acha que a verba já
       era dele, e cobra a promessa quebrada como deslealdade, não como negocio ruim. */
    const betrayal =
      ruling !== null && person.bloc === ruling
        ? parameters.betrayalWeight * 2
        : parameters.betrayalWeight;

    const moved =
      honoured * parameters.favourWeight * person.reach - broken * betrayal * person.reach;

    next[person.id] = clamp(decayed + moved, -parameters.memoryCap, parameters.memoryCap);
  }

  return next;
}

/**
 * A PESSOA COMO UMA BANCADA — e e assim que ela chega ao Congresso.
 *
 * exatamente o que crédito de confiança significa, e o que permite ECLUSA
 * continuar sem saber que o elenco existe.
 * termo de ECLUSA pela mesma razão: o que esta em disputa não e o preço, e a vaga.
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
       contra uma Camara que não existe, e nenhuma tela denunciaria, porque cada bancada
       estaria certa sozinha. */
    const claimed = leaders.reduce((sum, person) => sum + person.reach, 0);
    const scale = claimed > CROWD ? CROWD / claimed : 1;

    let handed = 0;

    for (const person of leaders) {
      const seats = Math.round(party.seats * person.reach * scale);
      if (seats <= 0) continue;
      handed += seats;

      const saved = memory[person.id] ?? 0;
      /* O CRÉDITO E EM UNIDADES DE VERBA, de -1 a 1, porque e assim que ECLUSA lê dinheiro. */
      credit[person.id] = clamp(saved / parameters.memoryCap, -1, 1);

      benches.push({
        id: person.id,
        label: person.name,
        /* ⚠ A SIGLA DE UMA PESSOA E A DA BANCADA DELA, e não uma legenda própria: o que este
           bloco monta e uma bancada de UM — o sujeito que arrasta uma fatia do próprio
           partido —, e inventar uma sigla para ele diria que ele fundou um partido. */
        sigla: party.sigla,
        /* A SUCESSÃO ENTRA COMO DISTANCIA, e não como venalidade menor: quem quer a vaga não
           fica mais caro, fica mais LONGE — e distancia e o que dinheiro compra pela metade. */
        economic: person.economic,
        liberty: person.liberty,
        venalityEconomic: person.venalityEconomic,
        venalityLiberty: person.venalityLiberty,
        seats,
      });
    }

    /* O QUE SOBRA DA BANCADA continua sendo a bancada: mesma posição, mesma venalidade, menos
       cadeiras. */
    const rest = party.seats - handed;
    if (rest > 0) benches.push({ ...party, seats: rest });
  }

  return { benches, credit };
}

/**
 * A VERBA QUE CADA BANCADA VÊ, com o crédito de memória somado.
 *
 * ⚠ CADA AMBIÇÃO OLHA COISA DIFERENTE. Um peso próprio para cada uma daria cinco precos da
 * MESMA oferta; o que muda e a PERGUNTA que o sujeito faz ao que voce põe na mesa. A bancada
 * continua sem ambição, e por isso a linha de base do jogo não se move.
 *
 * @param {object} input
 * @param {ReadonlyArray<Person>} input.people
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.funding - por BLOCO, de 0 a 1
 * @param {Record<string, number>} input.credit - por PESSOA, de -1 a 1
 * @param {CastParameters} input.parameters
 * @param {number} [input.street] - a rua contra o ponto neutro, de -1 a 1; quem a normaliza
 * e quem compõe, porque o ponto neutro e de ECLUSA e há um só
 * @param {Record<string, number>} [input.byArea] - quanto cada pasta esta acima ou abaixo do
 * gasto de abertura, de -1 a 1
 * @returns {Record<string, number>}
 */
export function offered({ people, parties, funding, credit, parameters, street = 0, byArea = {} }) {
  /** @type {Record<string, number>} */
  const table = {};

  for (const party of parties) table[party.id] = clamp(funding[party.id] ?? 0, 0, 1);

  for (const person of people) {
    const fromBloc = clamp(funding[person.bloc] ?? 0, 0, 1);
    const saved = credit[person.id] ?? 0;

    /* ── O QUE CADA AMBIÇÃO OLHA ────────────────────────────────────────────── A sucessão e
       o tribunal descontam a verba; o governo do estado a valoriza. Os três mexem no que o
       dinheiro compra, e por isso multiplicam. */
    const drag =
      person.ambition === "succession"
        ? parameters.successionDrag
        : person.ambition === "court"
          ? parameters.courtDrag
          : 0;
    const lift = person.ambition === "state" ? parameters.stateLift : 0;

    /* A rua e a pasta não são dinheiro, e por isso SOMAM em vez de multiplicar: elas movem o
       sujeito mesmo quando a emenda e zero. */
    const crowd = person.ambition === "seat" ? parameters.seatStreet * street : 0;
    const desk =
      person.ambition === "cabinet"
        ? parameters.cabinetLift * clamp(byArea[person.portfolio] ?? 0, -1, 1)
        : 0;

    table[person.id] = clamp(fromBloc * (1 - drag + lift) + saved + crowd + desk, -1, 1);
  }

  return table;
}
