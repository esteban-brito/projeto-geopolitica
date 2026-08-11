/* MALHA — a capacidade do Estado de entregar.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   os indices por area, a alocacao do mes, o impacto das acoes aprovadas
   devolve  os indices novos, o historico, e a pressao que eles fazem no modelo

   ── O QUE ELE MODELA, EM UMA FRASE ───────────────────────────────────────────
   Servico publico e um estoque que vaza. Ele cai sozinho todo mes, sobe com
   dinheiro empenhado, salta com reforma estrutural, e cobra a conta com atraso.

   ── AS TRES FORCAS SOBRE O INDICE ────────────────────────────────────────────
     DECAIMENTO   — vaza sozinho, e e ele que impede "resolver a saude" de uma
                    vez. Sem decaimento, o jogo teria um estado final em que
                    tudo esta em 100 e nao ha mais o que decidir;
     ALOCACAO     — verba do discricionario, mes a mes, sem passar por ninguem;
     ACAO         — reforma estrutural move o indice de uma vez, e e a unica
                    forma de dar um salto. Mas ela custa votacao.

   Alocacao e acao NAO sao redundantes: uma e continua e reversivel, a outra e
   pontual e permanente. Quem so aloca nunca sai do lugar contra o decaimento de
   uma area cara; quem so legisla ve o salto evaporar.

   ── O ATRASO, E POR QUE ELE E UM HISTORICO E NAO UMA FILA ────────────────────
   O indice muda HOJE; o efeito dele sobre o modelo chega `lag` meses depois. A
   forma obvia seria uma fila de efeitos agendados, e ela seria pior: um efeito
   agendado no mes 3 continuaria valendo no mes 27 mesmo que o indice tivesse
   desabado no mes 4, e o jogador colheria um beneficio que nao existe mais.

   Aqui o que se guarda e o HISTORICO do indice, e o modelo consome o valor de
   `lag` meses atras. A consequencia certa cai de graca: parar de investir hoje
   so dói daqui a `lag` meses, e voltar a investir hoje so paga daqui a `lag`
   meses. Ninguem colhe o que nao plantou, e ninguem escapa do que plantou.

   ── OS TRES CANAIS, E O SINAL ────────────────────────────────────────────────
     revenue    multiplica a receita;
     mandatory  multiplica a despesa obrigatoria;
     capacity   soma pontos no indice de OUTRA area, e por isso e o unico canal
                que fecha um ciclo entre areas.

   O sinal de `force` decide a direcao, e duas areas do mesmo canal empurram para
   lados opostos de proposito — servico de saude bom REDUZ a obrigatoria, e
   cobertura previdenciaria boa a AUMENTA. Ver `src/data/areas.mjs`.

   ── O QUE ELE NAO FAZ, declarado ─────────────────────────────────────────────
   Nao sorteia. Capacidade instalada nao muda por acaso, muda por decisao e por
   abandono — e os dois sao do jogador. Os unicos motores autorizados a sortear
   sao TEMPORAL e ECLUSA. */

/**
 * @typedef {import("../../data/areas.mjs").Area} Area
 *
 * @typedef {object} Pressure
 * @property {number} revenue - multiplicador da receita; 1 e neutro
 * @property {number} mandatory - multiplicador da despesa obrigatoria; 1 e neutro
 *
 * @typedef {object} Outcome
 * @property {Record<string, number>} index - o indice de cada area, agora
 * @property {Record<string, number[]>} history - o mais antigo na frente
 * @property {Record<string, number>} effective - o valor que o modelo consome hoje
 * @property {Pressure} pressure
 */

/* O ponto neutro chega por parametro em vez de ser importado do catalogo: o
   dominio recebe o que precisa, e um motor que alcanca dado direto e um motor
   que nao da para testar com outra tabela. */

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * O valor que o modelo consome AGORA: o indice de `lag` meses atras.
 *
 * ⚠ ENQUANTO O BUFFER NAO ENCHE, VALE O DE ABERTURA — e a primeira versao errava
 * exatamente aqui. Ela devolvia `past[0]`, o mais antigo REGISTRADO, e num
 * historico que comeca vazio isso e o valor do mes corrente: uma area de atraso
 * 24 entregava o salto ao modelo no mesmo mes em que ele aconteceu, e o dilema
 * inteiro da educacao — pagar agora e colher depois do mandato — simplesmente
 * nao existia. A suite pegou no primeiro `assert`.
 *
 * A leitura certa e que a capacidade herdada ja estava em vigor antes da posse:
 * nos primeiros `lag` meses, o que chega ao modelo e o pais que o presidente
 * recebeu, e nao o que ele acabou de fazer.
 *
 * @param {number[] | undefined} past
 * @param {number} fallback
 * @param {number} lag
 */
function delayed(past, fallback, lag) {
  if (past === undefined || past.length < lag + 1) return fallback;
  return past[0] ?? fallback;
}

/**
 * Um mes de capacidade.
 *
 * ORDEM IMPORTA E ESTA FIXA AQUI: o bonus de capacidade e calculado a partir do
 * historico QUE CHEGOU, e nao do indice que este mes esta produzindo. Calculado
 * depois, a educacao alimentaria a producao no mesmo mes em que ela propria
 * mudou, e o `lag` de 24 meses viraria enfeite.
 *
 * @param {object} input
 * @param {ReadonlyArray<Area>} input.areas
 * @param {Record<string, number>} input.index - o indice de cada area, no inicio do mes
 * @param {Record<string, number[]>} input.history
 * @param {Record<string, number>} input.allocation - bilhoes alocados no mes, por area
 * @param {Record<string, number>} [input.impacts] - salto de acao aprovada, por area
 * @param {number} input.neutral - o ponto em que o indice nao ajuda nem cobra
 * @param {string} input.capacityTarget - a area que recebe o canal `capacity`
 * @returns {Outcome}
 */
export function step({ areas, index, history, allocation, impacts = {}, neutral, capacityTarget }) {
  /* 1 — O QUE CHEGOU, com o atraso de cada area ja aplicado. */
  /** @type {Record<string, number>} */
  const incoming = {};
  for (const area of areas) {
    incoming[area.id] = delayed(history[area.id], area.initial, area.lag);
  }

  /* 2 — O CANAL `capacity`, que e o unico que uma area exerce sobre outra. Ele
     entra no calculo do indice, e nao na pressao sobre o modelo. */
  let bonus = 0;
  for (const area of areas) {
    if (area.feeds !== "capacity") continue;
    bonus += (((incoming[area.id] ?? area.initial) - neutral) / 100) * area.force;
  }

  /* 3 — O INDICE NOVO. */
  /** @type {Record<string, number>} */
  const next = {};
  /** @type {Record<string, number[]>} */
  const nextHistory = {};

  for (const area of areas) {
    const before = index[area.id] ?? area.initial;
    const spent = Math.max(0, allocation[area.id] ?? 0);
    const jump = impacts[area.id] ?? 0;
    const inherited = area.id === capacityTarget ? bonus : 0;

    next[area.id] = clamp(before - area.decay + area.yield * spent + jump + inherited, 0, 100);

    /* O historico guarda `lag + 1` valores: o de hoje e os `lag` anteriores.
       Com `lag` zero sobra um so, e o efetivo e o corrente — que e exatamente o
       que "sem atraso" significa. */
    const kept = [...(history[area.id] ?? []), next[area.id] ?? area.initial];
    nextHistory[area.id] = kept.slice(-(area.lag + 1));
  }

  /* 4 — O QUE O MODELO VAI CONSUMIR, ja com o valor novo no historico. */
  /** @type {Record<string, number>} */
  const effective = {};
  for (const area of areas) {
    effective[area.id] = delayed(nextHistory[area.id], area.initial, area.lag);
  }

  return {
    index: next,
    history: nextHistory,
    effective,
    pressure: pressureOf({ areas, history: nextHistory, neutral }),
  };
}

/**
 * A PRESSAO QUE OS INDICES FAZEM NO MODELO, lida de um historico sem avanca-lo.
 *
 * Ela e separada de `step` porque quem resolve o turno precisa dela ANTES de
 * saber a alocacao: o teto do mes depende da receita, a receita depende da
 * arrecadacao, e a arrecadacao e o indice de `lag` meses atras. Se a pressao so
 * saisse do passo, o orcamento teria de ser resolvido duas vezes — ou pior,
 * o jogador poderia financiar a alocacao com a receita que a propria alocacao
 * vai gerar, que e dinheiro nascendo de si mesmo.
 *
 * Multiplicadores em vez de somas: eles compoem sem depender da escala do
 * orcamento, e por isso continuam calibrados quando o PIB do catalogo mudar.
 *
 * @param {object} input
 * @param {ReadonlyArray<Area>} input.areas
 * @param {Record<string, number[]>} input.history
 * @param {number} input.neutral
 * @returns {Pressure}
 */
export function pressureOf({ areas, history, neutral }) {
  let revenue = 1;
  let mandatory = 1;

  for (const area of areas) {
    const value = delayed(history[area.id], area.initial, area.lag);
    const push = ((value - neutral) / 100) * area.force;
    if (area.feeds === "revenue") revenue += push;
    if (area.feeds === "mandatory") mandatory += push;
  }

  /* Multiplicador nunca fica negativo nem zera: receita negativa e despesa
     obrigatoria zerada nao sao estados de jogo, sao aritmetica escapando. O
     piso e generoso de proposito — ele existe para conter o absurdo, e nao para
     calibrar. */
  return { revenue: Math.max(0.25, revenue), mandatory: Math.max(0.25, mandatory) };
}

/**
 * O indice de abertura de cada area, e o historico vazio que o acompanha.
 *
 * @param {ReadonlyArray<Area>} areas
 * @returns {{ index: Record<string, number>, history: Record<string, number[]> }}
 */
export function opening(areas) {
  /** @type {Record<string, number>} */
  const index = {};
  /** @type {Record<string, number[]>} */
  const history = {};
  for (const area of areas) {
    index[area.id] = area.initial;
    history[area.id] = [];
  }
  return { index, history };
}
