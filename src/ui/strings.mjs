/* TEXTO DA INTERFACE — todo ele, num lugar so. Centralizado para evitar divergencia de nomes. */

const TERMOS = {
  /* Os nomes das telas. O menu e o titulo tem de dizer a mesma coisa. */
  cabinet: "Gabinete",
  finance: "Finanças",
  estado: "O Estado",

  /* Recusar e o mesmo ato nas duas chantagens. */
  refuse: "Recusar",
  refuseCost: "o grupo esquenta, e a caldeira não esfria depressa",

  simpleMajority: "maioria simples",

  /* Legenda do bloco e ponta da corrente compartilham o mesmo nome. */
  budget: "O orçamento",

  loyal: "com o governo",
  obstructing: "obstruindo",
  ruptured: "em ruptura",

  /* Nomeado Opinião pública para evitar confusão com a base parlamentar (436 de 513 a 130px). */
  social: "Opinião pública",
  /* Termos técnicos e claros sem metáforas poéticas. */
  economic: "Setor privado",
  political: "Parlamentares",

  /* O carimbo do fim, e ele e o mesmo no cartao da CALDEIRA e no fecho. */
  removed: "MANDATO INTERROMPIDO",
  removedNote: "a Câmara autorizou o afastamento",

  plenaryJudged: "o plenário votou um texto que você assinou",

  mandatorySpend: "Despesa obrigatória",
  ceilingRule: "Teto do arcabouço",
  seatsWord: "cadeiras",
  seatWord: "cadeira",
  moodWord: "humor",
  perMonthWord: "no mês",
  roomLine: "Sobra para o mês",
  /* Peso zero exige frase explicita no cartao e na carta. */
  noWeight: "não pesa",
  revenueWord: "Receita",

  /* Unidades e grandezas, ditas uma vez. */
  point: "ponto",
  points: "pontos",
  month: "mês",
  months: "meses",
  perYear: "/ano",
  of: "de",
  at: "em",
  gdp: "PIB",
  inflation: "Inflação",
  approval: "Aprovação",
  grossDebt: "Dívida bruta",
  country: "O país",
  onTable: "Em pauta",
  delivers: "entrega",
  pen: "caneta",
  kept: "cumprida",
  broken: "não cumprida",
};

/**
 * O ROTULO DE UMA CHAVE, com o proprio id como reserva.
 *
 * @param {Record<string, string>} table
 * @param {string} key
 * @returns {string}
 */
export function labelOf(table, key) {
  return table[key] ?? key;
}

/* Tratamento dinamico com marcador {v} no lugar de duplicar listas de frases. */
export const DEFAULT_TREATMENT = /** @type {"senhor"} */ ("senhor");

const TRATAMENTO = /** @type {const} */ ({
  senhor: { voce: "o senhor", titulo: "Presidente" },
  senhora: { voce: "a senhora", titulo: "Presidenta" },
});

export const UI = {
  nav: {
    cabinet: TERMOS.cabinet,
    email: "Email",
    congress: "Congresso & Leis",
    finance: TERMOS.finance,
    ministries: "Ministérios",
    ministriesClose: "Fechar ministérios",
    estado: TERMOS.estado,
    /* Rotulo textual explicita queda em pontos desde a posse. */
    watch: "Caiu 10 pontos ou mais desde a posse",
    alert: "Caiu 20 pontos ou mais desde a posse",
  },
  cabinet: {
    title: TERMOS.cabinet,
    inboxSigned: "Todo mês que você resolve chega aqui, assinado pela Casa Civil.",
    inboxWaiting:
      "O que ainda não chega é o resto da república: o líder que cobra a diretoria prometida, a lei que o relator devolveu mudada, o tribunal que derrubou o que passou. Quem escreve primeiro é a tramitação.",
    folder: "Pasta de despachos. Enter pega, Esc larga.",
    baseLine: "Apoiam o governo",
    congressAction: "negociar",
    vaultFree: TERMOS.roomLine,
    trinity: {
      social: TERMOS.social,
      economic: TERMOS.economic,
      political: TERMOS.political,
    },
    /* Direcao de ruptura do motor: social abaixo; economica e politica acima. */
    trinityBelow: "abaixo de",
    trinityAbove: "acima de",
  },
  window: {
    over: TERMOS.at,
    month: TERMOS.month,
    months: TERMOS.months,
  },
  gov: {
    /* Proximidade politica calculada por distancia euclidiana do modelo. */
    nearest: "governa mais perto",
    untouched: "ainda governa o orçamento que herdou",
  },
  inbox: {
    title: "Caixa de entrada",
    /* Rupturas do cerco (governo passivo recebia 0 cartas em 44 meses ate abrir no mes 43). */
    ruptureSubject: {
      social: "A rua rompeu",
      economic: "O capital rompeu",
      political: "A base rompeu",
    },
    ruptureFallback: "Uma ruptura se abriu",
    ruptureBody: {
      social:
        "A aprovação furou o piso, e a rua deixou de ser um custo político para virar uma das condições do afastamento.",
      economic:
        "Metade do capital que financia campanha abandonou o governo. Quem paga a conta de uma eleição está do outro lado.",
      political:
        "O fisiologismo concluiu que sustentar {v} custa mais do que derrubá-lo — e ele é o último a virar, porque ganha dinheiro sustentando.",
    },
    /* A frase comum e o que faz a carta valer: processo exige as 3 rupturas conjuntas. */
    ruptureNote: "São três, e o processo só abre com as três abertas ao mesmo tempo.",
    siegeSubject: "O processo foi aberto",
    siegeBody:
      "As três rupturas se abriram juntas, e o pedido de afastamento foi protocolado. Ele não se fecha porque a rua melhorou: quem o encerra é o plenário.",
    siegeVote: "A Câmara vota no mês que vem, e afastar exige",
    siegeOf: TERMOS.of,
    siegePrice: "Até lá cada cadeira custa",
    siegeAction: "Ir ao Congresso",
    /* Protocolado nao e derrota: distingue texto recem-escrito de votado. */
    filed: "protocolado",
    passed: "aprovada",
    rejected: "derrubada",
    voted: "o plenário deu",
    seeMonth: "ver o mês",
    firstLead: "O primeiro mês ainda não foi resolvido",
    quietLead: "Nada espera resposta",
    /* Alerta preventivo enquanto o teto ainda esta aberto. */
    ceilingSubject: "O teto do arcabouço fecha no mês que vem",
    ceilingBody:
      "O gasto do ano vai encostar no limite da regra. Com ele fechado não há discricionário para emenda — e sem emenda a base não se compra de volta.",
    ceilingNote: "o que sobra para o mês:",
    contingencySubject: "O relatório bimestral fecha no mês que vem",
    contingencyBody:
      "O balanço do bimestre é publicado, e é nele que se decide o contingenciamento. Se você proteger uma área do corte, o corte cai mais fundo nas outras.",
    contingencyLegend: "O corte deste mês",
    contingencyNote: "quanto do pedido o mês pagou:",
    minoritySubject: "O governo perdeu a maioria",
    minorityBody: "As cadeiras que respondem ao governo caíram abaixo da maioria simples.",
    quietMonth: "Nenhum texto foi a plenário neste mês.",
    ruptureLegend: "O que falta para abrir o processo",
    boilingSubject: "rompeu com o governo:",
    boilingBody: "A pressão passou do ponto de fervura, e o apoio ao governo acabou.",
    boilingNote: "ponto de fervura",
    blockGroup: "o que este grupo pesa",
    blockRuptures: "o que falta para cada ruptura",
    blockChamber: "a Câmara neste mês",
    /* Qualificador venal da bancada (evita estourar coluna em 557px contra 518px). */
    baseBought: "se compram",
    blockPlenary: "como o plenário votou",
    blockVotes: "Votos a favor",
    blockQuorum: "Para passar",
    blockMissed: "faltaram",
    blockSpare: "sobraram",
    blockProcess: "o processo de afastamento",
    blockInherited: "o que {v} recebe",
    blockMissing: "faltam",
    blockOpen: "rompeu",
    boilingPressure: "Pressão do grupo",
    boilingWeight: "Peso na ruptura econômica",
    boilingNoWeight: TERMOS.noWeight,
    annexLegend: "o humor de cada classe, e o que pesa nela",
    annexNote: {
      prices: "carestia",
      jobs: "emprego",
      services: "serviços",
      safety: "ordem",
      economy: "economia",
    },
    annexVault: "de onde vem o que sobra",
    annexVaultRow: {
      revenue: TERMOS.revenueWord,
      mandatory: TERMOS.mandatorySpend,
      ceiling: TERMOS.ceilingRule,
      allowance: "Empenhável",
    },
    annexSeats: "quem se moveu neste mês",
    annexSeatsRest: "e mais",
    annexDiscounts: "o que desconta de todas",
    annexDiscount: {
      betrayal: "credibilidade quebrada",
      wear: "desgaste do cargo",
    },
    annexBalance: "o mês em três leituras",
    annexBalanceRow: {
      street: "aprovação",
      seats: TERMOS.seatsWord,
      vault: "o que sobra",
    },
    headline: {
      "street.rose": "Aprovação sobe a",
      "street.fell": "Aprovação cai a",
      "seats.rose": "Base sobe a",
      "seats.fell": "Base cai a",
      /* Caixa no lugar de discricionario evita quebra de linha em 208px. */
      "vault.rose": "Caixa sobe a",
      "vault.fell": "Caixa cai a",
    },
    headlineSeats: TERMOS.seatsWord,
    pollClosed: "A pesquisa fechou o mês em",
    pollGood: "de ótimo ou bom",
    pollDown: "abaixo do mês passado.",
    pollUp: "acima do mês passado.",
    pollPoint: TERMOS.point,
    pollPoints: TERMOS.points,
    pollHolds: "O que sustenta",
    pollDrags: "O que puxa para baixo",
    seatsBody: "As cadeiras que respondem ao governo fecharam o mês em",
    of: TERMOS.of,
    forWord: "para",
    seatsMajority: ", e a maioria simples fecha em",
    seat: TERMOS.seatWord,
    seats: TERMOS.seatsWord,
    seatsHint: "Sem ela, nada do que {v} assinar chega ao plenário.",
    vaultBody: "O que sobra para o mês fechou em",
    vaultHint: "É desse dinheiro que sai emenda, e é ele que compra voto.",
    tabled: "Pautei o seu texto",
    tabledBody: "Ele vai ao relator, e volta de lá no mês que vem.",
    reported: "Devolvi o seu texto com uma emenda",
    reportedSaved: "salvei",
    forgotten: "O seu texto morreu na gaveta",
    forgottenBody: "Seis meses sem ser pautado. Ele não perdeu a votação — ela nunca aconteceu.",
    passedBill: "O plenário aprovou",
    rejectedBill: "O plenário derrubou",
    passedBillBody:
      "O texto virou norma, e ela vale a partir de agora. Desfazê-la exige outro texto que a revogue pelo nome.",
    passedBillAction: "Ver a lei em vigor",
    rejectedBillBody:
      "O texto caiu no plenário. A faixa segue a que estava, e ele não volta sozinho: quem o quiser de novo assina outro.",
    amendmentChoices: {
      accept: "Aceitar a emenda",
      acceptCost: "o texto vai a plenário sem o que ele salvou",
      block: "Travar o texto",
      blockCost: "ele volta para a gaveta, e o relógio dela não reinicia",
    },
    demandBody: "quer o programa de volta em",
    demandCutBody: "quer o programa cortado de volta para",
    /* Silencio na chantagem equivale a recusa. */
    spiteWarns: "Se você não responder, ele lê como recusa.",
    conceded: "Você cedeu, e a verba volta neste mês.",
    refused: "Você recusou, e ele não esquece depressa.",
    demandChoices: {
      accept: "Ceder",
      acceptCost: "a verba volta, e ela sai da mesma bolsa deste mês",
      block: TERMOS.refuse,
      blockCost: TERMOS.refuseCost,
    },
    demandCutChoices: {
      accept: "Cortar",
      acceptCost: "o gasto cai neste mês, e a área sente no índice",
      block: TERMOS.refuse,
      blockCost: TERMOS.refuseCost,
    },
    /* Preco do silencio avisado antes transforma ignorar em escolha. */
    silenceWarns: "Se você não responder, a emenda vale.",
    dueIn: "vence em",
    dueNow: "vence neste mês",
    month: TERMOS.month,
    accepted: "Você aceitou a emenda.",
    blocked: "Você travou o texto. Ele voltou para a gaveta.",
    silenced: "O prazo venceu sem resposta. A emenda valeu.",
    inauguration: "O país que {v} recebe",
    inheritedMandatory: "Obrigatória do ano",
    inheritedLead: "O orçamento em vigor é o do seu antecessor até {v} escrevê-lo.",
    /* Posse define compromissos com nome curto (evita estourar folha em 60px). */
    pledgePriority: "A prioridade",
    pledgeFiscal: "A meta fiscal",
    pledgeReform: "A reforma",
  },
  vitals: {
    gdp: TERMOS.gdp,
    inflation: TERMOS.inflation,
    approval: TERMOS.approval,
    base: "Base",
  },
  area: {
    programs: TERMOS.budget,
    thisArea: "esta área",
    outlook: "Para onde vai",
    inMonths: (/** @type {number} */ months) => `em ${months} meses`,
    frozen: "sem votação no período",
    floor: "piso",
    ofMonth: "do mês",
    available: "disponíveis",
    committed: "já comprometidos nas outras áreas",
    holding: "parado",
    perYear: TERMOS.perYear,
  },
  chain: {
    title: "A corrente",
    hint: "de onde vem, e para onde vai",
    into: "O que move este índice",
    out: "O que este índice move",
    budget: TERMOS.budget,
    perBillion: (/** @type {string} */ points) => `R$ 1 bi rende ${points}`,
    decay: "O desgaste",
    half: (/** @type {number} */ months) => `metade em ${months} meses`,
    forever: "não se desgasta",
    /* Atraso temporal explicita defasagem de efeito entre areas. */
    lagged: (/** @type {number} */ months) => `com ${months} meses de atraso`,
    prompt: "no mesmo mês",
    came: (/** @type {number} */ months) => `de ${months} meses atrás`,
    cameNow: "deste mês",
    channel: {
      revenue: "A receita",
      mandatory: "A despesa obrigatória",
      capacity: "A capacidade",
    },
  },
  laws: {
    title: "As leis desta área",
    hint: "o que elas obrigam, o que autorizam, e quem as protege",
    obliges: "obriga",
    allows: "autoriza até",
    noFloor: "não obriga nada",
    noCeiling: "sem teto",
    guard: {
      none: "sem lei",
      law: "lei ordinária",
      constitution: "constituição",
    },
    was: "hoje",
  },
  instrument: {
    budget: TERMOS.pen,
    law: "lei",
    amendment: "emenda",
    decree: TERMOS.pen,
  },
  instrumentHint: {
    budget: "o Congresso já autorizou",
    law: TERMOS.simpleMajority,
    amendment: "três quintos",
    decree: "sem votação",
  },
  estado: {
    eyebrow: "o patrimônio e o poder",
    title: TERMOS.estado,
    property: "O que a União possui",
    power: "Quanto o Executivo decide sozinho",
  },
  finance: {
    title: TERMOS.finance,
    economy: "A economia",
    gdp: TERMOS.gdp,
    perCapita: "PIB por habitante",
    inflation: TERMOS.inflation,
    target: "meta de",
    rate: "Juro básico",
    central: "decidido pelo Banco Central",
    unemployment: "Desemprego",
    gap: "Hiato do produto",
    gapNote: "distância até o que o país produz sem pressionar preço",
    accounts: "As contas",
    revenue: TERMOS.revenueWord,
    mandatory: TERMOS.mandatorySpend,
    ofRevenue: "da receita",
    room: "Discricionário",
    primary: "Resultado primário",
    ofGdp: "do PIB",
    missing: "abaixo da banda",
    interest: "Juros da dívida",
    outsideCeiling: "fora do teto",
    debt: "A dívida",
    premium: "Prêmio de risco",
    premiumNote: "o que o mercado cobra acima da básica",
    gross: TERMOS.grossDebt,
    overGdp: "Dívida sobre o PIB",
    ceiling: TERMOS.ceilingRule,
    headroom: "Folga até o teto",
    untilCeiling: "o que o teto ainda deixa gastar",
    squeezed: "a obrigatória sozinha já fura o teto",
    country: TERMOS.country,
    perYear: TERMOS.perYear,
    perMonth: TERMOS.perMonthWord,
  },
  congress: {
    passage: "Em tramitação",
    stage: {
      drawer: "na gaveta",
      rapporteur: "com o relator",
      floor: "vai a plenário",
    },
    waiting: "há",
    expires: "morre em",
    savedBy: "o relator salvou",
    passageEmpty: "Nada tramitando",
    passageNote:
      "Mover um piso ou um teto numa área escreve um texto, e texto tramita: gaveta, relatoria e plenário, um mês cada. Remanejar verba dentro do que a lei já autoriza continua valendo na hora.",
    willFile: "este texto vai para a gaveta",
    forecastLater: "previsão para quando ele chegar ao plenário",
    country: "O que o país entrega",
    agenda: TERMOS.onTable,
    office: {
      speaker: "presidente da Câmara",
      senate: "presidente do Senado",
      rapporteur: "relator do orçamento",
      leader: "líder de bancada",
    },
    ambition: {
      succession: "quer o Planalto em 2030",
      cabinet: "quer um ministério",
      state: "quer o governo do estado",
      court: "quer uma vaga no tribunal",
      seat: "quer continuar onde está",
    },
    cabinetOf: "quer o ministério da",
    /* Preco da ambicao encurtado para evitar repeticao excessiva na tela. */
    ambitionPrice: {
      succession: "reconhece menos do que recebe",
      cabinet: "barateia se a pasta receber",
      state: "emenda vale mais para ele",
      court: "dinheiro o move pouco",
      seat: "segue a sua aprovação",
    },
    memoryGood: "negocia como quem já recebeu",
    memoryBad: "cobra a promessa que você não pagou",
  },
  mesa: {
    ownParty: "o seu partido",
    empty: "Nada em pauta",
    emptyHint: "escolha uma ação numa das áreas — ou avance o mês assim mesmo",
    swap: "trocar",
    needs: "precisa de",
    promises: "promete",
    fits: "cabe",
    over: "não cabe — o caixa honra",
    below: "abaixo do quórum",
    above: "acima do quórum",
    decree: "vale sem passar pelo plenário",
    bench: "bancada",
    mood: TERMOS.moodWord,
    result: "resultado",
    funding: "verba",
    seats: TERMOS.of,
    leads: "arrasta",
  },
  mood: {
    loyal: TERMOS.loyal,
    obstructing: TERMOS.obstructing,
    broken: TERMOS.ruptured,
  },
  verdict: {
    blocked: "O teto fechou: a obrigatória consome o orçamento, e não há emenda a pagar",
    rupture: "Bancada rompida — ela vota contra por menos do que custa trazê-la de volta",
    minority: "A base não chega à maioria; cada voto agora tem preço de leilão",
    obstruction: "Há bancada obstruindo: o governo ainda passa, mas paga pedágio em tudo",
    tight: "Governo em equilíbrio instável — maioria simples, e nada além dela",
    comfortable: "Base folgada e o teto ainda abre; a janela não fica aberta muito tempo",
  },
  report: {
    panel: "O mês passado",
    waiting: "Nenhum mês resolvido nesta sessão. Avance para ver o que o turno fez.",
    noBill: "Mês sem pauta",
    passed: "Aprovada",
    rejected: "Rejeitada",
    decreed: "Decretada",
    against: "contra",
    forecastWas: "a previsão era",
    dayGave: "o dia deu",
    benches: "As bancadas",
    paid: "pago",
    votes: "votos",
    drift: "no dia",
    money: "O dinheiro",
    promised: "prometeu",
    honoured: "o caixa honrou",
    room: "cabia",
    cut: "o rateio cortou",
    cutWhy: "a promessa não cabia no mês",
    blocked: "o teto fechou: a obrigatória sozinha já fura o arcabouço",
    country: TERMOS.country,
  },
  actions: {
    advance: "Avançar",
    silenceOne: "fecha sem resposta",
    silenceMany: "fecham sem resposta",
    ended: "O mandato acabou",
    restart: "Nova partida",
    swearTitle: "Quem toma posse",
    swearName: "Seu nome",
    swearParty: "Seu partido",
    swearPartyEmpty: "escolha uma bancada",
    swearPartyHint: "ele te elege, não se vende a você, e cobra o dobro quando você o trai",
    swearHow: "Como a Casa Civil deve tratá-lo",
    swearSir: TRATAMENTO.senhor.voce,
    swearMadam: TRATAMENTO.senhora.voce,
    swearOk: "Tomar posse",
    swearCancel: "Voltar",
    restartConfirm: "Apagar mesmo?",
    restartConfirmHint: "clique de novo para confirmar",
    close: "Entendi",
  },
  save: {
    refusedTitle: "A partida anterior não pôde ser retomada",
    refusedBody:
      "O save guardado é de uma versão anterior do jogo e não pode ser convertido sem inventar o que faltava nele. " +
      "Ele foi preservado no navegador, e esta partida começa do primeiro mês.",
  },
  closing: {
    eyebrow: "a prestação de contas",
    ended: "mandato encerrado",
    now: "agora",
    monthLeft: `${TERMOS.month} restante`,
    monthsLeft: `${TERMOS.months} restantes`,
    title: "O mandato",
    months: "meses de mandato",
    removed: TERMOS.removed,
    removedNote: TERMOS.removedNote,
    served: "MANDATO CUMPRIDO",
    servedNote: "os quatro anos terminaram",
    country: "O país que {v} entrega",
    approval: TERMOS.approval,
    approvalNote: "ótimo e bom",
    debt: TERMOS.grossDebt,
    debtNote: "sobre o PIB",
    promised: "O que {v} prometeu",
    kept: TERMOS.kept,
    broken: TERMOS.broken,
    noPledges:
      "Nenhum compromisso foi assumido na posse. O mandato terminou sem nada contra o que ser medido.",
    written: "O que ficou escrito",
    noLaws: "Nenhuma lei foi escrita neste mandato. O país terminou com as regras que {v} recebeu.",
    abandoned: "Abandonaram o governo:",
    noneAbandoned: "Nenhum grupo abandonou o governo.",
  },
  brief: {
    city: "Brasília",
    unit: "Secretaria Especial de Análise Governamental",
    /** @param {number} number @param {number} year */
    kind: (number, year) => `EM nº ${String(number).padStart(5, "0")}/${year} CC`,
    /** @param {number} number @param {string} protocol */
    footer: (number, protocol) => `EM ${number} SEI ${protocol} / pg. 1`,
    vocative: "Senhor Presidente da República,",
    lead: "Submeto à sua decisão a minuta do decreto deste mês.",
    /** @param {string} room @param {string} mandatory @param {string} revenue */
    treasury: (room, mandatory, revenue) =>
      `O mês tem ${room} para gastar. A despesa obrigatória come ${mandatory} dos ${revenue} de receita, e é ela que aperta o resto.`,
    /** @param {number} base @param {number} majority */
    chamber: (base, majority) =>
      `O governo tem ${Math.round(base)} cadeiras na Câmara. Aprovar uma lei pede ${majority}.`,
    /** @param {string} label @param {number} pressure @param {number} boil */
    pressure: (label, pressure, boil) =>
      `${label} é hoje quem está mais perto de romper: ${pressure} pontos de pressão, e o grupo abandona o governo em ${boil}.`,
    calm: "Nenhum grupo está perto de romper com o governo.",
    /** @param {string} now */
    street: now => `A aprovação está em ${now}.`,
    /** @param {number} points @param {boolean} up */
    streetMoved: (points, up) =>
      `Ela ${up ? "subiu" : "caiu"} ${points} ${points === 1 ? TERMOS.point : TERMOS.points} desde o mês passado.`,
    processNone: "Não há processo de impeachment aberto contra o senhor.",
    /** @param {number} month */
    processOpen: month =>
      `Há processo de impeachment aberto contra o senhor desde o mês ${month + 1}.`,
    close: "Respeitosamente,",
    /**
     * @param {boolean} she
     */
    role: she => `${she ? "Ministra" : "Ministro"} de Estado Chefe da Casa Civil`,
  },
  envelope: {
    waiting: "Carta na mesa. Abrir.",
    due: "Carta que vence este mês. Abrir.",
    open: "Carta aberta. Esc larga.",
  },
  phone: {
    number: "2027-0148",
    quiet: "Telefone. Ninguém ligou.",
    /** @param {string} who */
    ringing: who => `O telefone toca: ${who} rompeu com o governo. Abrir a carta.`,
  },
  decree: {
    presidency: "Presidência da República",
    chief: "Casa Civil",
    legal: "Subchefia para Assuntos Jurídicos",
    /** @param {string} number @param {string} date */
    title: (number, date) => `DECRETO Nº ${number}, DE ${date.toUpperCase()}`,
    summary: "Dispõe sobre o limite de gasto dos ministérios no mês.",
    preamble:
      "O PRESIDENTE DA REPÚBLICA, no uso da atribuição que lhe confere o art. 84, caput, inciso IV, da Constituição, e tendo em vista o disposto no art. 8º da Lei Complementar nº 101, de 4 de maio de 2000,",
    enacts: "DECRETA:",
    /** @param {string} room @param {string} share */
    first: (room, share) =>
      `Art. 1º  O mês tem ${room} para gastar. Os ministérios recebem ${share} do que pediram.`,
    second:
      "Art. 2º  Ficam fora do corte as pastas marcadas. O que elas deixarem de ceder, as outras pagam:",
    third: "Art. 3º  Este Decreto entra em vigor na data de sua publicação.",
    /** @param {string} date @param {number} independence @param {number} republic */
    close: (date, independence, republic) =>
      `Brasília, ${date}; ${independence}º da Independência e ${republic}º da República.`,
    /** @param {string} date o dia da publicação, "5.1.2027" */
    gazette: date => `Este texto não substitui o publicado no DOU de ${date}`,
  },
  trend: {
    up: "▲",
    down: "▼",
    flat: "—",
  },
};

export const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

/**
 * Troca o marcador `{v}` pelo tratamento escolhido.
 *
 * @param {string} text
 * @param {"senhor" | "senhora"} [treatment]
 * @returns {string}
 */
export function addressed(text, treatment = DEFAULT_TREATMENT) {
  return text.replaceAll("{v}", TRATAMENTO[treatment].voce);
}

/**
 * Como o vocativo da carta chama quem preside.
 *
 * @param {"senhor" | "senhora"} [treatment]
 * @returns {string}
 */
export function titleOf(treatment = DEFAULT_TREATMENT) {
  return TRATAMENTO[treatment].titulo;
}
