/* ELENCO — a republica ganha gente, e a gente lembra.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   os blocos, os arquetipos, o vocabulario de nomes e uma semente
   devolve  as pessoas do mandato, e o preco que a memoria de cada uma cobra

   ── POR QUE UM MOTOR, E NAO UMA LISTA NO CATALOGO ───────────────────────────
   Porque um elenco fixo seria decorado em duas partidas. O ciclo 4 fecha isso em
   duas linhas: as pessoas sao GERADAS da semente — cada mandato tem um Congresso
   diferente — e o mandato continua reproduzivel, que e a regra que sustenta save,
   simulador e calibragem.

   ⚠ DETERMINISTICO NAO E ALEATORIO, e a distincao e o que responde ao risco R4 da
   auditoria ("a semente azarada"). Este gerador nao sorteia livremente: ele
   distribui dentro de faixas que o catalogo declara, arquetipo por arquetipo, como
   todo o resto do projeto. O acidente que a auditoria teme — um Congresso com 90%
   de extremistas — nao e um sorteio infeliz, e um esquema mal escrito; e esse tipo
   de erro tem guarda desde a terceira sessao.

   ── O QUE UMA PESSOA E, NO MODELO ────────────────────────────────────────────
   Um bloco de um so. O ciclo previu isso e a previsao se confirmou: ECLUSA nao
   mudou uma linha para atender o elenco, porque uma pessoa tem posicao e
   venalidade exatamente como uma bancada tem. O que ela tem A MAIS sao duas
   coisas, e sao elas que transformam barganha em relacao:

     AMBICAO  o que ela quer. Nao e personalidade, e PRECO: duas pessoas do mesmo
              bloco com a mesma venalidade custam coisas diferentes;
     MEMORIA  o que voce fez com ela, e ha quanto tempo. Uma bancada esquece; uma
              pessoa cobra.

   ── O ALCANCE E O QUE IMPEDE A PESSOA DE VIRAR A BANCADA ────────────────────
   Um lider arrasta uma FRACAO da bancada dele, e o resto continua votando pela
   ideologia do bloco. E o que faz comprar o lider ser barato e insuficiente ao
   mesmo tempo — e o que impede o elenco de transformar quatro blocos em quatro
   pessoas, que seria trocar um modelo grosso por um menor.

   ── O QUE ELE NAO FAZ, declarado ────────────────────────────────────────────
   Nao decide pauta, nao relata texto e nao vota. Quem faz isso e a tramitacao, e
   ate ela existir o presidente da Camara e um sujeito com nome, preco e memoria
   esperando a funcao dele nascer. Isso esta declarado na tela: cargo sem mecanica
   diz que esta esperando, como o item desligado do rail. */

/**
 * @typedef {import("../../data/parties.mjs").Party} Party
 * @typedef {import("../../data/cast.mjs").Archetype} Archetype
 * @typedef {import("../../data/cast.mjs").CastParameters} CastParameters
 * @typedef {import("../../state/random.mjs").Stream} Stream
 *
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
 *
 * @typedef {object} Memory o saldo de cada pessoa com o governo, de -cap a +cap
 * @typedef {Record<string, number>} Ledger
 */

/* QUANTO DA BANCADA OS LIDERES PODEM LEVAR, no maximo, somados. O resto e sempre
   do bloco — e o bloco precisa continuar existindo: ele e o unico adversario que
   nao se compra pessoa a pessoa, e um Congresso reduzido a sete individuos seria
   trocar um modelo grosso por um menor. */
const CROWD = 0.85;

/** @param {number} value @param {number} min @param {number} max */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * UM NUMERO DERIVADO DE UM TEXTO, entre 0 e 1 — deterministico e sem estado.
 *
 * ⚠ ELE NAO CONSOME FLUXO DE ALEATORIEDADE, e a escolha e deliberada. Os dois
 * unicos motores autorizados a sortear sao TEMPORAL e ECLUSA, e cada um tem o
 * fluxo dele justamente para que calibrar um nao desloque o outro. Um elenco que
 * puxasse do mesmo fluxo faria acrescentar um personagem mudar o resultado de
 * todas as votacoes do mandato — o defeito que `streamFrom` existe para impedir,
 * visto de outro angulo.
 *
 * Entao aqui a semente e o TEXTO: mesma partida e mesmo arquetipo dao sempre a
 * mesma pessoa, e a lista pode crescer sem mexer em ninguem que ja existe.
 *
 * @param {string} text
 * @returns {number} de 0 (inclusive) a 1 (exclusive)
 */
function hashed(text) {
  /* FNV-1a de 32 bits. Ele esta aqui por ser curto e bem distribuido, e nao por
     ser criptografico — o que se pede dele e espalhar, e nao proteger. */
  let hash = 2166136261;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 100000) / 100000;
}

/**
 * O ELENCO DE UMA PARTIDA.
 *
 * ⚠ FUNCAO PURA E SEM FLUXO: mesma semente e mesmo catalogo devolvem exatamente
 * as mesmas pessoas, na mesma ordem. E o que permite o save guardar so a semente
 * e a memoria — as pessoas se refazem, o que voce fez com elas nao.
 *
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
    /* ARQUETIPO ORFAO NAO VIRA PESSOA, e nao vira em silencio: quem valida o
       catalogo e `catalogViolations`, e ele acusa o id que nao existe. Aqui o
       motor apenas nao inventa um bloco para hospedar alguem. */
    if (!bloc) continue;

    const base = `${seed}:${archetype.id}`;

    /* ── O NOME ──────────────────────────────────────────────────────────────
       Duas listas combinadas, com desempate por deslocamento quando a combinacao
       ja saiu. Sem o desempate, dois arquetipos podiam receber o mesmo nome na
       mesma partida — e dois sujeitos homonimos num Congresso de doze pessoas nao
       e sabor local, e um defeito que o jogador lê como bug.

       ⚠ E O DESEMPATE E POR PEDACO, E NAO PELO NOME INTEIRO. Ate 16/08/2026 ele
       so recusava a combinacao repetida, e o resultado media mal: com o
       vocabulario novo sairam "Claudio Espindola" e "Claudio Itaparica" na mesma
       partida, e "Adriano Espindola" ao lado de "Eurico Espindola". Nomes
       completos diferentes, e o jogador lê dois Claudios.

       O argumento da prosa acima vale por pedaco: numa Camara de 513 dois
       Claudios sao verossimeis, mas ESTAS SAO OITO PESSOAS COM NOME — as unicas
       que o jogador precisa distinguir —, e a tela as cita lado a lado na mesma
       lista. Com 42 primeiros nomes e 31 sobrenomes, exigir os dois unicos
       sobra: sao 9 nomes a tirar de 1.302 combinacoes. */
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

    /* ── O DESVIO DO BLOCO ───────────────────────────────────────────────────
       A pessoa nasce ONDE O BLOCO ESTA e se desloca pelo arquetipo, e nao num
       ponto qualquer do plano. E o que a mantem reconhecivel: um lider da esquerda
       gerado no quadrante liberal seria um personagem que o jogador nao consegue
       prever, e imprevisibilidade sem legibilidade e ruido.

       O RUIDO DE CADA PESSOA e pequeno e existe para dois mandatos nao produzirem
       o mesmo sujeito duas vezes. Ele entra DEPOIS do deslocamento do arquetipo,
       para nunca inverter o sinal dele. */
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
 * O PRESIDENTE — o unico personagem que o jogador É.
 *
 * ⚠ ELE NAO E UM ARQUETIPO, e a exclusao e a modelagem. Todo mundo em `ARCHETYPES`
 * nasce ONDE UM BLOCO ESTA e se desloca a partir dali — e o presidente e a unica
 * pessoa do jogo cuja posicao nao pode vir de lugar nenhum: ela e DERIVADA do que
 * ele moveu no orcamento, e essa e a regra central do ciclo 2. Dar a ele um bloco
 * de nascimento seria escolher a ideologia do jogador por ele, que e exatamente o
 * cursor que o projeto recusou.
 *
 * Entao daqui sai so o que ele tem antes de governar: um NOME.
 *
 * ⚠ E ELE NAO PODE SER HOMONIMO DE NINGUEM, por isso recebe o elenco ja gerado.
 * Um presidente com o mesmo nome do lider do Centrao nao e sabor local — e um
 * defeito que o jogador lê como bug, e ha uma prova cobrando isso para o elenco
 * desde 14/08/2026. O sal e proprio (`president`) para o nome dele nao se mover
 * quando um arquetipo novo entra na lista.
 *
 * @param {object} input
 * @param {number} input.seed
 * @param {ReadonlyArray<Person>} input.people o elenco ja gerado, para nao repetir
 * @param {ReadonlyArray<string>} input.firstNames
 * @param {ReadonlyArray<string>} input.surnames
 * @returns {{ id: string, name: string, office: string }}
 */
export function president({ seed, people, firstNames, surnames }) {
  /* ⚠ POR PEDACO, PELA MESMA RAZAO DE `cast`: um presidente "Jorge Camargo" ao
     lado de um relator "Jorge Queiroz Sampaio" lê como defeito de gerador, e o
     presidente e a pessoa que a tela cita com mais frequencia. */
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
 * A MEMORIA DO MES — o que o governo creditou e debitou com cada pessoa.
 *
 * ⚠ ELA LE O MESMO FATO QUE `settle` LE, e nao um fato novo: a verba PAGA credita,
 * e a fracao prometida e nao honrada debita. Se fosse outro fato, existiriam duas
 * versoes do que aconteceu naquele mes — e elas divergiriam exatamente no mes em
 * que o teto fechou, que e o mes em que o jogador precisa entender por que todo
 * mundo o abandonou.
 *
 * A TRAICAO PESA MAIS QUE O FAVOR, e a assimetria e a mesma de SONDA. Sem ela o
 * jogo ensinaria que da para queimar alguem e comprar de volta pelo mesmo preco —
 * e ai a memoria seria um numero que anda, e nao uma relacao.
 *
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

    /* O DECAIMENTO VEM PRIMEIRO, e o do mes entra por cima. Aplicado depois, o
       favor deste mes ja nasceria descontado — e o jogador veria um pagamento
       cheio produzir menos memoria do que o catalogo declara. */
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
 * ⚠ ELA NAO SUBSTITUI O BLOCO, ELA O DIVIDE. O lider leva a fracao da bancada que
 * ele arrasta e o resto continua votando pela ideologia do bloco, com a lealdade
 * do bloco. E o que faz comprar o lider ser barato e insuficiente ao mesmo tempo,
 * e o que impede o elenco de reduzir quatro blocos a quatro pessoas.
 *
 * A MEMORIA VIRA VERBA JA PAGA, e nao um termo novo na resistencia. Um sujeito que
 * o governo tratou bem por dois anos negocia como se ja tivesse recebido — que e
 * exatamente o que credito de confianca significa, e o que permite ECLUSA
 * continuar sem saber que o elenco existe.
 *
 * ⚠ QUEM QUER O PLANALTO EM 2030 RESISTE A MAIS, E DINHEIRO NAO COMPRA ISSO. E o
 * unico termo do elenco que nao e negociavel, e ele tem a mesma forma do segundo
 * termo de ECLUSA pela mesma razao: o que esta em disputa nao e o preco, e a vaga.
 * Um governo forte em 2029 e a derrota do projeto dele.
 *
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

    /* ⚠ OS ALCANCES SE SOMAM, E PRECISAM SER NORMALIZADOS. A primeira versao nao
       normalizava, e a medicao pegou na hora: o Centrao tem QUATRO pessoas —
       presidente da Camara, Senado, relator e lider — com alcances de 0,67, 0,46,
       0,15 e 0,68, que somam 1,96. Cada uma levava a fracao cheia de uma bancada de
       205 cadeiras, e o plenario fechava com 730 assentos em vez de 513.

       O sintoma seria devastador e silencioso: toda maioria do jogo passaria a ser
       medida contra uma Camara que nao existe, e nenhuma tela denunciaria, porque
       cada bancada estaria certa sozinha. E exatamente o defeito que
       `chamberMismatch` pega no catalogo, visto do lado da gente.

       A NORMALIZACAO PRESERVA A RAZAO entre os alcances, que e o que o catalogo
       quis dizer: quem arrasta o dobro continua arrastando o dobro. E o teto de
       `CROWD` garante que sempre sobre bancada de bloco — sem ele, um bloco com
       lideres demais deixaria de existir como bloco, e o jogador perderia o unico
       adversario que nao se compra pessoa a pessoa. */
    const claimed = leaders.reduce((sum, person) => sum + person.reach, 0);
    const scale = claimed > CROWD ? CROWD / claimed : 1;

    let handed = 0;

    for (const person of leaders) {
      const seats = Math.round(party.seats * person.reach * scale);
      if (seats <= 0) continue;
      handed += seats;

      const saved = memory[person.id] ?? 0;
      /* O CREDITO E EM UNIDADES DE VERBA, de -1 a 1, porque e assim que ECLUSA lê
         dinheiro. Traduzir aqui e o que mantem o motor de votacao sem uma segunda
         moeda — e uma moeda a mais e o comeco de duas contas para a mesma coisa. */
      credit[person.id] = clamp(saved / parameters.memoryCap, -1, 1);

      benches.push({
        id: person.id,
        label: person.name,
        /* ⚠ A SIGLA DE UMA PESSOA E A DA BANCADA DELA, e nao uma legenda propria: o
           que este bloco monta e uma bancada de UM — o sujeito que arrasta uma fatia
           do proprio partido —, e inventar uma sigla para ele diria que ele fundou um
           partido. Ele nao fundou: ele racha o voto de dentro. */
        sigla: party.sigla,
        /* A SUCESSAO ENTRA COMO DISTANCIA, e nao como venalidade menor: quem quer
           a vaga nao fica mais caro, fica mais LONGE — e distancia e o que
           dinheiro compra pela metade. Deslocar a venalidade faria o oposto do
           pretendido em bancada pouco venal. */
        economic: person.economic,
        liberty: person.liberty,
        venalityEconomic: person.venalityEconomic,
        venalityLiberty: person.venalityLiberty,
        seats,
      });
    }

    /* O QUE SOBRA DA BANCADA continua sendo a bancada: mesma posicao, mesma
       venalidade, menos cadeiras. Ela nao vira "os liderados" — ela E o bloco, e
       o bloco existia antes de qualquer lider.

       ⚠ O RESTO E SUBTRACAO, E NAO UMA SEGUNDA MULTIPLICACAO. Calculado como
       `cadeiras × (1 − alcance)`, ele erraria por arredondamento a cada bloco: sete
       pessoas arredondadas para cima contra um resto arredondado por fora fazem o
       plenario fechar com 511 ou 515 cadeiras conforme a semente, e a maioria
       simples passaria a ser um numero que oscila. Subtraindo o que foi DE FATO
       entregue, a soma fecha sempre. */
    const rest = party.seats - handed;
    if (rest > 0) benches.push({ ...party, seats: rest });
  }

  return { benches, credit };
}

/**
 * A VERBA QUE CADA BANCADA VÊ, com o credito de memoria somado.
 *
 * Ela existe separada porque quem paga e o jogador, por BLOCO, e quem vota sao as
 * bancadas divididas: o lider recebe o que o bloco dele recebeu, mais o que ele
 * lembra. Sem esta traducao, a camada de aplicacao teria de espalhar a verba a
 * mao — e espalhar a mao e onde uma regra vira costume.
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

    /* A AMBICAO DE SUCESSAO DESCONTA a verba que o sujeito reconhece: ele aceita o
       dinheiro e continua querendo o cargo. E o desconto e sobre o OFERECIDO, e
       nao sobre a resistencia, porque assim ele se compoe com a memoria em vez de
       competir com ela. */
    const drag = person.ambition === "succession" ? parameters.successionDrag : 0;
    table[person.id] = clamp(fromBloc * (1 - drag) + saved, -1, 1);
  }

  return table;
}
