/* SUITE · O ELENCO — a republica ganha gente, e a gente lembra.
   O que esta suite cobra nao e "os nomes saem bonitos": e que gerar gente da semente nao
   quebre nenhuma das quatro coisas que o projeto inteiro se apoia — o plenario fechar, o
   mandato se refazer, o motor nao sortear por fora e o catalogo mandar no que se gera. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import { benches, cast, offered, remember } from "../../src/domain/cast/index.mjs";
import { CATALOG } from "../../src/data/catalog.mjs";
import { AMBITIONS, ARCHETYPES, FIRST_NAMES, GENDER_OF, SURNAMES } from "../../src/data/cast.mjs";
import { AREAS } from "../../src/data/areas.mjs";
import { PARTIES } from "../../src/data/parties.mjs";
import { SEATS } from "../../src/data/regime.mjs";
import { settlement } from "../../src/application/turn.mjs";
import { DEFAULT_SEED, createState } from "../../src/state/state.mjs";

/** @param {number} seed */
const castOf = seed =>
  cast({
    seed,
    parties: PARTIES,
    archetypes: ARCHETYPES,
    firstNames: FIRST_NAMES,
    surnames: SURNAMES,
    ambitions: AMBITIONS,
    areas: AREAS.map(area => area.id),
    genderOf: GENDER_OF,
  });

/* MUITAS SEMENTES, e nao uma. */
const anySeed = fc.integer({ min: 0, max: 4294967295 });

test("O PLENARIO FECHA, em qualquer semente", () => {
  /* A prova do defeito medido. */
  fc.assert(
    fc.property(anySeed, seed => {
      const people = castOf(seed);
      const { benches: chamber } = benches({
        people,
        parties: PARTIES,
        memory: {},
        parameters: CATALOG.cast,
      });

      const total = chamber.reduce((sum, bench) => sum + bench.seats, 0);
      assert.equal(total, SEATS, `a camara fechou com ${total} cadeiras`);

      /* E NENHUMA BANCADA NEGATIVA. */
      for (const bench of chamber) {
        assert.ok(bench.seats > 0, `${bench.label} entrou com ${bench.seats} cadeiras`);
      }
    }),
    { numRuns: 300 },
  );
});

test("SOBRA BLOCO EM TODA SEMENTE: o Congresso nao vira sete individuos", () => {
  /* O teto de alcance existe para o bloco continuar existindo. */
  fc.assert(
    fc.property(anySeed, seed => {
      const { benches: chamber } = benches({
        people: castOf(seed),
        parties: PARTIES,
        memory: {},
        parameters: CATALOG.cast,
      });

      for (const party of PARTIES) {
        const rest = chamber.find(bench => bench.id === party.id);
        assert.ok(rest && rest.seats > 0, `o bloco ${party.id} desapareceu da Camara`);
      }
    }),
    { numRuns: 200 },
  );
});

test("EXISTE CENTRO PARA GOVERNAR, e ninguem tem maioria sozinho", () => {
  /* A propriedade que a auditoria externa pediu por outro caminho, e que responde ao risco R4
     sem precisar de distribuicao normal nenhuma: para TODA semente, nenhuma bancada isolada
     decide o plenario, e ha centro suficiente para montar uma maioria. */
  fc.assert(
    fc.property(anySeed, seed => {
      const { benches: chamber } = benches({
        people: castOf(seed),
        parties: PARTIES,
        memory: {},
        parameters: CATALOG.cast,
      });

      const majority = Math.floor(SEATS / 2) + 1;
      for (const bench of chamber) {
        assert.ok(
          bench.seats < majority,
          `${bench.label} sozinho tem ${bench.seats} cadeiras e decide tudo`,
        );
      }

      /* O TETO DE 45 SAIU DE MEDICAO, e nao de gosto: em 400 sementes a janela mais estreita
         ficou entre 15,6 e 31,8 pontos, contra 72 de distancia entre a esquerda e a direita
         liberal. */
      const sorted = [...chamber].sort((a, b) => a.economic - b.economic);
      let narrowest = Infinity;

      for (let start = 0; start < sorted.length; start++) {
        let seats = 0;
        for (let end = start; end < sorted.length; end++) {
          seats += sorted[end]?.seats ?? 0;
          if (seats >= majority) {
            narrowest = Math.min(
              narrowest,
              (sorted[end]?.economic ?? 0) - (sorted[start]?.economic ?? 0),
            );
            break;
          }
        }
      }

      assert.ok(
        narrowest <= 45,
        `a coalizao contigua mais estreita abrange ${narrowest.toFixed(1)} pontos — ` +
          `so da para governar juntando extremos`,
      );
    }),
    { numRuns: 200 },
  );
});

test("A MESMA SEMENTE DA A MESMA GENTE, e sementes diferentes dao gente diferente", () => {
  /* A regra que sustenta save, simulador e calibragem. */
  assert.deepEqual(castOf(DEFAULT_SEED), castOf(DEFAULT_SEED));

  const names = new Set();
  for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
    names.add(
      castOf(seed)
        .map(person => person.name)
        .join("|"),
    );
  }
  assert.ok(names.size >= 7, `oito sementes produziram so ${names.size} elencos distintos`);
});

test("NINGUEM E HOMONIMO na mesma partida, NEM DE PRIMEIRO NOME, NEM DE SOBRENOME", () => {
  /* Dois sujeitos com o mesmo nome num elenco deste tamanho nao e sabor local: e um
     defeito que o jogador lê como bug, e que a identidade por `id` esconderia do motor mas
     nao dos olhos. */
  fc.assert(
    fc.property(anySeed, seed => {
      const names = castOf(seed).map(person => person.name);
      const firsts = names.map(name => name.split(" ")[0]);
      const lasts = names.map(name => name.split(" ").slice(1).join(" "));

      assert.equal(new Set(names).size, names.length, `nomes repetidos: ${names.join(", ")}`);
      assert.equal(
        new Set(firsts).size,
        firsts.length,
        `primeiro nome repetido: ${names.join(", ")}`,
      );
      assert.equal(new Set(lasts).size, lasts.length, `sobrenome repetido: ${names.join(", ")}`);
    }),
    { numRuns: 300 },
  );
});

test("A PESSOA NASCE ONDE O BLOCO ESTA, e nao num ponto qualquer do plano", () => {
  /* O que a mantem reconhecivel. */
  fc.assert(
    fc.property(anySeed, seed => {
      for (const person of castOf(seed)) {
        const archetype = ARCHETYPES.find(item => item.id === person.archetype);
        const bloc = PARTIES.find(party => party.id === person.bloc);
        assert.ok(archetype && bloc);

        const expected = bloc.economic + archetype.economicShift;
        assert.ok(
          Math.abs(person.economic - expected) <= 4.001 ||
            person.economic === 0 ||
            person.economic === 100,
          `${person.name} nasceu em ${person.economic.toFixed(1)} e o arquetipo pede ${expected}`,
        );
      }
    }),
    { numRuns: 200 },
  );
});

/* ═══ A MEMORIA ══════════════════════════════════════════════════════════════ */

test("A TRAICAO PESA MAIS QUE O FAVOR, e e a mesma assimetria de SONDA", () => {
  /* Sem ela o jogo ensinaria que da para queimar alguem e comprar de volta pelo mesmo preco —
     e ai a memoria seria um numero que anda, e nao uma relacao. */
  const people = castOf(DEFAULT_SEED);
  const blocs = Object.fromEntries(PARTIES.map(party => [party.id, 1]));
  const nothing = Object.fromEntries(PARTIES.map(party => [party.id, 0]));

  const paid = remember({
    people,
    memory: {},
    promised: blocs,
    paid: blocs,
    parameters: CATALOG.cast,
  });
  const broken = remember({
    people,
    memory: {},
    promised: blocs,
    paid: nothing,
    parameters: CATALOG.cast,
  });

  /* ⚠ SO QUEM ARRASTA BANCADA ENTRA NA CONTA, e a exclusao e o modelo e nao uma folga. */
  const bench = people.filter(person => person.reach > 0);
  assert.ok(bench.length > 0, "nenhuma pessoa arrasta bancada");

  for (const person of bench) {
    const gained = paid[person.id] ?? 0;
    const lost = broken[person.id] ?? 0;
    assert.ok(gained > 0, `${person.name} nao creditou nada com verba cheia`);
    assert.ok(lost < 0, `${person.name} nao debitou nada com promessa quebrada`);
    assert.ok(
      Math.abs(lost) > gained,
      `${person.name}: traicao ${lost.toFixed(2)} nao pesa mais que o favor ${gained.toFixed(2)}`,
    );
  }
});

test("A MEMORIA NAO ESTOURA O TETO, em nenhum dos dois lados", () => {
  /* Ela e um estoque com limite, e o limite existe para o credito nao virar uma segunda moeda
     infinita: sem teto, dois anos de verba cheia comprariam qualquer votacao para sempre, e a
     barganha do quinto ano deixaria de existir. */
  const people = castOf(DEFAULT_SEED);
  const full = Object.fromEntries(PARTIES.map(party => [party.id, 1]));
  const none = Object.fromEntries(PARTIES.map(party => [party.id, 0]));

  /** @type {Record<string, number>} */
  let credited = {};
  /** @type {Record<string, number>} */
  let debited = {};
  for (let month = 0; month < 120; month++) {
    credited = remember({
      people,
      memory: credited,
      promised: full,
      paid: full,
      parameters: CATALOG.cast,
    });
    debited = remember({
      people,
      memory: debited,
      promised: full,
      paid: none,
      parameters: CATALOG.cast,
    });
  }

  for (const person of people) {
    assert.ok(Math.abs(credited[person.id] ?? 0) <= CATALOG.cast.memoryCap + 1e-9);
    assert.ok(Math.abs(debited[person.id] ?? 0) <= CATALOG.cast.memoryCap + 1e-9);
  }
});

/* UMA PESSOA DE PROVA — so o que `offered` lê. Gerar gente da semente daria uma amostra em
   que a ambicao que se quer medir pode nao existir. */
/** @param {string} ambition @param {string} portfolio */
const someone = (ambition, portfolio = "health") => ({
  id: ambition,
  name: ambition,
  gender: /** @type {"m"} */ ("m"),
  archetype: ambition,
  label: ambition,
  bloc: PARTIES[0]?.id ?? "",
  office: "leader",
  economic: 50,
  liberty: 50,
  venalityEconomic: 0.5,
  venalityLiberty: 0.5,
  ambition,
  portfolio,
  reach: 0.5,
});

const BLOC = PARTIES[0]?.id ?? "";

/** @param {{ street?: number, byArea?: Record<string, number> }} world */
const tableOf = world =>
  offered({
    people: AMBITIONS.map(ambition => someone(ambition)),
    parties: PARTIES,
    funding: { [BLOC]: 0.5 },
    credit: {},
    parameters: CATALOG.cast,
    ...world,
  });

test("A RUA MOVE QUEM QUER CONTINUAR ONDE ESTA, e nao move mais ninguem", () => {
  /* O baixo clero que segue a popularidade — e a prova cobra os DOIS lados: se a rua passasse
     a mover todo mundo, ela viraria um segundo `standing`, que ECLUSA ja aplica. */
  const calm = tableOf({ street: 0 });
  const loved = tableOf({ street: 0.25 });
  const hated = tableOf({ street: -0.25 });

  assert.ok((loved.seat ?? 0) > (calm.seat ?? 0), "governo popular nao baixou o preco dele");
  assert.ok((hated.seat ?? 0) < (calm.seat ?? 0), "governo impopular nao o perdeu");

  for (const ambition of AMBITIONS) {
    if (ambition === "seat") continue;
    assert.equal(loved[ambition], hated[ambition], `a rua moveu ${ambition}`);
  }
});

test("A PASTA ATENDIDA BARATEIA QUEM A QUER, e so a pasta DELE conta", () => {
  const dry = tableOf({});
  const fed = tableOf({ byArea: { health: 0.4 } });
  const other = tableOf({ byArea: { defense: 0.4 } });

  assert.ok((fed.cabinet ?? 0) > (dry.cabinet ?? 0), "a pasta cheia nao barateou o ministro");
  assert.equal(other.cabinet, dry.cabinet, "a pasta de OUTRO moveu o ministro");

  for (const ambition of AMBITIONS) {
    if (ambition === "cabinet") continue;
    assert.equal(fed[ambition], dry[ambition], `a pasta moveu ${ambition}`);
  }
});

test("A MESMA EMENDA VALE COISAS DIFERENTES, e a bancada e o ponto zero", () => {
  /* ⚠ A BANCADA E A REFERENCIA, e nao um numero escrito na prova: ela nao tem ambicao, entao
     o que ela reconhece e exatamente o que foi oferecido. */
  const table = tableOf({});
  const bench = table[BLOC] ?? 0;

  assert.equal(table.seat, bench, "a rua no neutro deslocou quem quer continuar");
  assert.equal(table.cabinet, bench, "a pasta na abertura deslocou quem quer ministerio");
  assert.ok((table.state ?? 0) > bench, "quem disputa o estado nao valorizou a emenda");
  assert.ok((table.succession ?? 0) < bench, "quem quer 2030 nao descontou");
  assert.ok(
    (table.court ?? 0) < (table.succession ?? 0),
    "dinheiro devia mover menos quem quer a toga do que quem quer o Planalto",
  );
});

test("A PASTA SAI DE CHAVE PROPRIA — o elenco de uma partida salva nao mudou", () => {
  /* ⚠ ESTA E A PROVA QUE PROTEGE O SAVE. O elenco se refaz da semente a cada abertura: se a
     pasta tivesse entrado no mesmo sorteio da ambicao, toda partida em andamento acordaria
     com outras pessoas — e nenhuma tela denunciaria. */
  fc.assert(
    fc.property(anySeed, seed => {
      const withAreas = castOf(seed);
      const withOthers = cast({
        seed,
        parties: PARTIES,
        archetypes: ARCHETYPES,
        firstNames: FIRST_NAMES,
        surnames: SURNAMES,
        ambitions: AMBITIONS,
        areas: ["outra", "diferente", "qualquer"],
        genderOf: GENDER_OF,
      });

      const same = (/** @type {ReturnType<typeof castOf>} */ people) =>
        people.map(person => ({ ...person, portfolio: "" }));

      assert.deepEqual(same(withAreas), same(withOthers));
      for (const person of withAreas) {
        assert.ok(
          AREAS.some(area => area.id === person.portfolio),
          `${person.name} quer uma pasta que nao existe`,
        );
      }
    }),
  );
});

test("A MEMORIA VIRA VERBA, e quem quer o Planalto cobra a mais", () => {
  /* O credito chega a ECLUSA como dinheiro ja pago — e por isso o motor de votacao continua
     sem saber que o elenco existe. */
  const people = castOf(DEFAULT_SEED);
  const funding = Object.fromEntries(PARTIES.map(party => [party.id, 0.5]));

  const cold = offered({
    people,
    parties: PARTIES,
    funding,
    credit: {},
    parameters: CATALOG.cast,
  });
  const warm = offered({
    people,
    parties: PARTIES,
    funding,
    credit: Object.fromEntries(people.map(person => [person.id, 0.4])),
    parameters: CATALOG.cast,
  });

  for (const person of people) {
    assert.ok(
      (warm[person.id] ?? 0) > (cold[person.id] ?? 0),
      `${person.name} nao reconheceu o credito de memoria`,
    );

    const rival = person.ambition === "succession";
    /* ⚠ O PAR NAO PODE SER A TOGA: `courtDrag` desconta MAIS que `successionDrag`, e comparar
       com ela mediria a ordem dos dois descontos, e nao o desconto da sucessao. */
    const same = people.find(
      other =>
        other.bloc === person.bloc &&
        other.id !== person.id &&
        other.ambition !== "succession" &&
        other.ambition !== "court",
    );
    if (rival && same) {
      assert.ok(
        (cold[person.id] ?? 0) < (cold[same.id] ?? 0),
        `${person.name} quer 2030 e reconheceu a mesma verba que ${same.name}`,
      );
    }
  }
});

test("O TURNO E A TELA VEEM A MESMA CAMARA", () => {
  /* A regra central do projeto, aplicada ao elenco: a previsao da tela e o plenario do turno
     tem de sair da MESMA montagem. */
  const state = createState(7);
  const orders = { funding: Object.fromEntries(PARTIES.map(party => [party.id, 0.3])) };

  const first = settlement(state, orders, CATALOG);
  const second = settlement(state, orders, CATALOG);

  assert.deepEqual(first.benches, second.benches);
  assert.deepEqual(first.offeredPaid, second.offeredPaid);
  assert.deepEqual(
    first.people.map(person => person.id),
    ARCHETYPES.map(archetype => archetype.id),
  );
});

test("TRAIR O PROPRIO PARTIDO CUSTA O DOBRO, e honrar vale o mesmo", () => {
  /* A assimetria e o item inteiro: quem e da casa acha que a verba ja era dele. */
  const people = castOf(DEFAULT_SEED);
  const meu = people[0]?.bloc ?? "";
  const prometido = Object.fromEntries(PARTIES.map(party => [party.id, 1]));
  const nada = Object.fromEntries(PARTIES.map(party => [party.id, 0]));

  const traido = (/** @type {string | null} */ ruling) =>
    remember({
      people,
      memory: {},
      promised: prometido,
      paid: nada,
      parameters: CATALOG.cast,
      ruling,
    });
  const honrado = (/** @type {string | null} */ ruling) =>
    remember({
      people,
      memory: {},
      promised: prometido,
      paid: prometido,
      parameters: CATALOG.cast,
      ruling,
    });

  const fora = traido(null);
  const dentro = traido(meu);
  const pago = honrado(meu);

  for (const person of people) {
    const daCasa = person.bloc === meu;
    if (daCasa && person.reach > 0) {
      assert.ok(
        (dentro[person.id] ?? 0) < (fora[person.id] ?? 0),
        `${person.name} e da casa e a traicao nao doeu mais`,
      );
    } else {
      assert.equal(dentro[person.id], fora[person.id], `${person.name} nao e da casa e mudou`);
    }
    assert.equal(pago[person.id], honrado(null)[person.id], "o favor mudou de peso, e nao devia");
  }
});
