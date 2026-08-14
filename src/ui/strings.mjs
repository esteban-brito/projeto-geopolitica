/* TEXTO DA INTERFACE — todo ele, num lugar so.
   ══════════════════════════════════════════════════════════════════════════════
   Nenhuma frase vive solta dentro de um template. Duas razoes praticas: revisar
   copia passa a ser ler um arquivo em vez de cacar por quarenta; e o dia em que
   alguem quiser outro idioma, a fronteira ja existe — sem que isso custe uma
   camada de i18n agora. */

export const UI = {
  mark: "Planalto",
  /* AS SECOES SAO A TABELA DE MOTORES, e nao uma lista de telas desejadas. Cada
     uma que ainda nao existe entra DESLIGADA e diz isso — menu que oferece o que
     nao abre ensina o jogador a desconfiar do menu inteiro. */
  nav: {
    mesa: "Mesa",
    finance: "Finanças",
    estado: "O Estado",
    opinion: "Opinião",
    graph: "Rede",
    pending: "ainda não existe",
  },
  /* OS TRES VERBOS DE GOVERNAR, e a ordem em que aparecem na tela de area e o
     custo de executar cada um: alocar nao precisa de ninguem, pautar precisa do
     Congresso, e vigente ja foi decidido e so cobra. */
  area: {
    /* O ORÇAMENTO GRANULAR. "Alocar" e "Pautar" saíram: o jogador não escolhe
       mais entre alocar verba e pautar uma lei — ele escreve o orçamento, e o
       rito de cada linha é consequência de onde ele parou o controle. */
    programs: "O orçamento",
    thisArea: "esta área",
    outlook: "Para onde vai",
    /* O PISO É ANUNCIADO EM TODA LINHA, e não só quando é atravessado. Um limite
       que só aparece depois de violado é um limite que o jogador descobre
       errando — e o erro aqui custa a pauta do mês. */
    floor: "piso",
    allocate: "Alocar",
    propose: "Pautar",
    standing: "Vigente",
    ofMonth: "do mês",
    available: "disponíveis",
    committed: "já comprometidos nas outras áreas",
    holding: "parado",
    perYear: "/ano",
    total: "total",
    /* OS TITULOS DAS TRES COLUNAS DE NUMERO. Sem eles a linha de uma acao mostra
       `308 · −140 · +8`, que sao tres grandezas diferentes em tres unidades
       diferentes sem nada dizendo qual e qual — e o jogador que adivinha errado
       aprende o modelo errado. */
    action: "ação",
    instrument: "rito",
    /* A COLUNA DO BOTÃO tem título só para quem lê por leitor de tela: na tela
       ele seria um rótulo em cima de um botão que já diz o que faz. */
    decide: "decidir",
    quorum: "quórum",
    /* RESULTADO, e não "despesa". O sinal do catálogo é o do RESULTADO — positivo
       poupa ou arrecada, negativo custa. Sob o título "despesa", o mesmo `−48`
       se lê ao contrário do que ele significa: como corte de gasto, quando é
       gasto novo. Rótulo que inverte o sinal do número é pior que rótulo
       nenhum. */
    fiscal: "resultado/ano",
    lift: "índice",
    nothingStanding: "nada aprovado ainda nesta área",
    nothingLeft: "tudo desta área já foi feito",
  },
  /* AS LEIS DA ÁREA — o segundo bloco, e o mais novo do jogo.
     ⚠ NÃO HÁ VERBO NENHUM AQUI, e a ausência é o desenho. "Criar lei", "alterar"
     e "excluir" existem no que o jogador faz, e não em botões: criar é tirar o
     piso do zero, alterar é movê-lo, excluir é levá-lo de volta a zero. Um botão
     de "excluir lei" ao lado de um controle que já faz isso ensinaria que são
     duas coisas diferentes. */
  laws: {
    title: "As leis desta área",
    hint: "o que elas obrigam, o que autorizam, e quem as protege",
    obliges: "obriga",
    allows: "autoriza até",
    /* PISO ZERO NÃO É "PISO 0" — é a ausência de lei, e dizer o número esconderia
       isso atrás de um algarismo que parece um valor escolhido. */
    noFloor: "não obriga nada",
    noCeiling: "sem teto",
    /* QUEM PROTEGE A FAIXA. Ela é do catálogo e não muda: o jogador altera o que a
       lei manda, nunca de que tipo ela é. */
    guard: {
      none: "sem lei",
      law: "lei ordinária",
      constitution: "constituição",
    },
    /* O QUE MUDA quando o jogador move uma faixa: ela deixa de ser a lei vigente e
       passa a ser um texto em votação. */
    proposed: "em votação",
    was: "hoje",
  },
  /* O INSTRUMENTO E ETIQUETA NA LINHA, e nao tela propria. Ele decide o quorum e
     o rito; nao decide onde a acao mora. Quem quer mexer na saude entra em
     Saude — nao precisa saber antes se aquilo e lei, emenda ou decreto. */
  /* `budget` E O QUARTO RITO, e ele é a ausência de um: o orçamento que a lei já
     autorizou, executado por quem foi eleito para executá-lo. Ele não está em
     `INSTRUMENTS` de propósito — instrumento é o que vai a plenário. */
  instrument: {
    budget: "Caneta",
    law: "lei",
    amendment: "emenda",
    decree: "caneta",
  },
  instrumentHint: {
    law: "maioria simples",
    amendment: "três quintos",
    decree: "sem votação",
  },
  estado: {
    eyebrow: "a moldura",
    title: "O Estado",
    property: "O que a União possui",
    power: "Quanto o Executivo decide sozinho",
  },
  /* FINANCAS — O PLACAR. Os rótulos aqui são mais secos que os do resto do jogo,
     e é de propósito: quem entra nesta tela vem conferir número, e adjetivo em
     painel de leitura é opinião com aparência de dado.
     ⚠ NENHUM NÚMERO É ESCRITO NESTAS FRASES. A meta de inflação, o teto e a carga
     vêm do catálogo e chegam à tela por parâmetro — número digitado aqui seria um
     segundo lugar para a calibragem divergir, e o rótulo é quem sempre esquece de
     ser atualizado. */
  finance: {
    eyebrow: "o placar",
    title: "Finanças",
    economy: "A economia",
    gdp: "PIB",
    perCapita: "PIB por habitante",
    inflation: "Inflação",
    target: "meta de",
    rate: "Juro básico",
    central: "decidido pelo Banco Central",
    unemployment: "Desemprego",
    gap: "Hiato do produto",
    /* A NOTA E NEUTRA NO SINAL de propósito: o hiato é negativo na maior parte de
       uma partida, e uma frase que só descreve o lado positivo — "acima do que o
       país produz" — lê como erro justamente quando o número está abaixo de zero,
       que é quando ele mais importa. */
    gapNote: "distância até o que o país produz sem pressionar preço",
    accounts: "As contas",
    revenue: "Receita",
    mandatory: "Despesa obrigatória",
    ofRevenue: "da receita",
    room: "Discricionário",
    primary: "Resultado primário",
    interest: "Juros da dívida",
    /* A DISTINCAO QUE O ARCABOUCO FAZ, dita na linha: juro não disputa com
       hospital — ele engorda a dívida. */
    outsideCeiling: "fora do teto",
    debt: "A dívida",
    gross: "Dívida bruta",
    overGdp: "Dívida sobre o PIB",
    ceiling: "Teto do arcabouço",
    headroom: "Folga até o teto",
    untilCeiling: "o que o teto ainda deixa gastar",
    squeezed: "a obrigatória sozinha já fura o teto",
    country: "O país",
    perYear: "/ano",
    perMonth: "no mês",
  },
  mesa: {
    onTable: "Em pauta",
    empty: "Nada em pauta",
    emptyHint: "escolha uma ação numa das áreas — ou avance o mês assim mesmo",
    swap: "trocar",
    forecast: "Previsão",
    needs: "precisa de",
    promises: "promete",
    fits: "cabe",
    over: "não cabe — o rateio vai cortar",
    below: "abaixo do quórum",
    above: "acima do quórum",
    decree: "vale sem passar pelo plenário",
    bench: "bancada",
    mood: "humor",
    result: "resultado",
    delivers: "entrega",
    funding: "verba",
    cost: "custo",
    seats: "de",
  },
  mood: {
    loyal: "com o governo",
    obstructing: "obstruindo",
    broken: "rompida",
  },
  approvalLabel: "Aprovação do governo",
  approvalParts: {
    good: "Ótimo/bom",
    fair: "Regular",
    poor: "Ruim/péssimo",
  },
  context: {
    month: "Mês",
    mandate: "Mandato",
    congress: "Base aliada",
    situation: "Situação",
  },
  situation: {
    crisis: "Crise",
    stable: "Estável",
    growth: "Alta",
  },
  /* O VEREDITO É POR MOTIVO, e não por nível. Três frases para três níveis
     diziam "crise" de um jeito só, e crise por teto fechado não se resolve como
     crise por base rompida — uma se paga com dinheiro que não existe, a outra
     com dinheiro que existe. Luz vermelha que não diz qual é a pane é luz
     vermelha que o jogador aprende a ignorar. */
  verdict: {
    contingency: "O teto fechou: a obrigatória consome o orçamento, e não há emenda a pagar",
    rupture: "Bancada rompida — ela vota contra por menos do que custa trazê-la de volta",
    minority: "A base não chega à maioria; cada voto agora tem preço de leilão",
    obstruction: "Há bancada obstruindo: o governo ainda passa, mas paga pedágio em tudo",
    tight: "Governo em equilíbrio instável — maioria simples, e nada além dela",
    comfortable: "Base folgada e caixa livre; a janela não fica aberta muito tempo",
  },
  /* O RELATÓRIO DO MÊS. Ele é a única tela em que a banda da previsão prova que
     era honesta: a Mesa promete uma faixa, e aqui aparece o número que saiu. */
  report: {
    panel: "O mês passado",
    /* A ESPERA TEM DE SER DITA. O relatório é memória de tela e não entra no
       save, então quem retoma a partida amanhã cai aqui — e um painel em branco
       ao lado de controles que funcionam lê como defeito, não como ausência. */
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
    contingency: "o teto fechou: a obrigatória sozinha já fura o arcabouço",
    country: "O país",
  },
  actions: {
    advance: "Avançar o mês",
    advanceHint: "resolve o turno e propaga os efeitos",
    /* O BOTÃO DO MÊS PASSADO SAIU. Ele reabria o relatório num diálogo; o
       relatório agora é painel fixo da Mesa e está sempre à vista. Botão que
       abre o que já está aberto é ruído com aparência de funcionalidade. */
    restart: "Nova partida",
    restartHint: "apaga o mandato e recomeça do primeiro mês",
    restartConfirm: "Apagar mesmo?",
    restartConfirmHint: "clique de novo para confirmar",
    close: "Entendi",
  },
  /* A PARTIDA ATRAVESSA O FECHAR DO NAVEGADOR. E quando ela não atravessa, o
     jogador merece saber por quê: save recusado em silêncio é um mandato que
     desapareceu sem explicação. */
  save: {
    refusedTitle: "A partida anterior não pôde ser retomada",
    refusedBody:
      "O save guardado é de uma versão anterior do jogo e não pode ser convertido sem inventar o que faltava nele. " +
      "Ele foi preservado no navegador, e esta partida começa do primeiro mês.",
  },
  trend: {
    up: "▲",
    down: "▼",
    flat: "—",
  },
};
