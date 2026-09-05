/* ELENCO — a republica ganha gente, e a gente lembra.
   recebe   os blocos, os arquetipos, o vocabulario de nomes e uma semente
   devolve  as pessoas do mandato, e o preco que a memoria de cada uma cobra

   As pessoas sao GERADAS da semente: um elenco fixo seria decorado em duas partidas, e o
   mandato continua reproduzivel — a regra que sustenta save, simulador e calibragem.

   ⚠ DETERMINISTICO NAO E ALEATORIO, e a distincao responde ao risco R4 da auditoria: o
   gerador distribui dentro de faixas que o catalogo declara. Um Congresso com 90% de
   extremistas nao seria sorteio infeliz, seria esquema mal escrito — e disso ha guarda.

   ⚠ UMA PESSOA E UM BLOCO DE UM SO, e por isso ECLUSA nao mudou uma linha para atende-la.
   O que ela tem A MAIS sao MEMORIA e AMBICAO. */

/**
 * @typedef {import("../../data/parties.mjs").Party} Party
 * @typedef {import("../../data/cast.mjs").Archetype} Archetype
 * @typedef {import("../../data/cast.mjs").CastParameters} CastParameters
 * @typedef {import("../../state/random.mjs").Stream} Stream
 * @typedef {object} Person
 * @property {string} id
 * @property {string} name - inventado, sempre; ver o ADR 0003
 * @property {"f" | "m"} gender - sai do vocabulario de nomes, e a tela so o usa para escolher
 * a silhueta do sinete: nao ha rosto, e um rosto inventado seria a cara de alguem
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
 * nomeia, e quem nao quer ministerio nunca a usa
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

    /* A PASTA SAI DE CHAVE PROPRIA, e por isso ela nao desloca ninguem: nome, ambicao e
       alcance continuam saindo dos mesmos hashes, e toda partida ja salva refaz o mesmo
       elenco. */
    const portfolio = areas[Math.floor(hashed(`${base}:portfolio`) * areas.length)] ?? "";

    /* ── O DESVIO DO BLOCO ─────────────────────────────────────────────────── A pessoa nasce
       ONDE O BLOCO ESTA e se desloca pelo arquetipo, e nao num ponto qualquer do plano. */
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
    const full = `${first ?? ""} ${last ?? ""}`.trim();
    if (full && !used.has(full) && !used.has(first ?? "") && !used.has(last ?? "")) {
      name = full;
      break;
    }
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

    /* O DECAIMENTO VEM PRIMEIRO, e o do mes entra por cima. */
    const decayed = was * parameters.memoryDecay;

    /* ⚠ TRAIR O PROPRIO PARTIDO CUSTA O DOBRO, e o favor NAO vale o dobro: a assimetria e a
       mesma da memoria comum, e aqui ela e mais forte — quem e da casa acha que a verba ja
       era dele, e cobra a promessa quebrada como deslealdade, nao como negocio ruim. */
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
 * ⚠ CADA AMBICAO OLHA COISA DIFERENTE. Um peso proprio para cada uma daria cinco precos da
 * MESMA oferta; o que muda e a PERGUNTA que o sujeito faz ao que voce poe na mesa. A bancada
 * continua sem ambicao, e por isso a linha de base do jogo nao se move.
 *
 * @param {object} input
 * @param {ReadonlyArray<Person>} input.people
 * @param {ReadonlyArray<Party>} input.parties
 * @param {Record<string, number>} input.funding - por BLOCO, de 0 a 1
 * @param {Record<string, number>} input.credit - por PESSOA, de -1 a 1
 * @param {CastParameters} input.parameters
 * @param {number} [input.street] - a rua contra o ponto neutro, de -1 a 1; quem a normaliza
 * e quem compoe, porque o ponto neutro e de ECLUSA e ha um so
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

    /* ── O QUE CADA AMBICAO OLHA ────────────────────────────────────────────── A sucessao e
       o tribunal descontam a verba; o governo do estado a valoriza. Os tres mexem no que o
       dinheiro compra, e por isso multiplicam. */
    const drag =
      person.ambition === "succession"
        ? parameters.successionDrag
        : person.ambition === "court"
          ? parameters.courtDrag
          : 0;
    const lift = person.ambition === "state" ? parameters.stateLift : 0;

    /* A rua e a pasta nao sao dinheiro, e por isso SOMAM em vez de multiplicar: elas movem o
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
