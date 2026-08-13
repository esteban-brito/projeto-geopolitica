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
    opinion: "Opinião",
    graph: "Rede",
    pending: "ainda não existe",
  },
  /* OS TRES VERBOS DE GOVERNAR, e a ordem em que aparecem na tela de area e o
     custo de executar cada um: alocar nao precisa de ninguem, pautar precisa do
     Congresso, e vigente ja foi decidido e so cobra. */
  area: {
    allocate: "Alocar",
    propose: "Pautar",
    standing: "Vigente",
    ofMonth: "do mês",
    available: "disponíveis",
    committed: "já prometidos às outras áreas",
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
  /* O INSTRUMENTO E ETIQUETA NA LINHA, e nao tela propria. Ele decide o quorum e
     o rito; nao decide onde a acao mora. Quem quer mexer na saude entra em
     Saude — nao precisa saber antes se aquilo e lei, emenda ou decreto. */
  instrument: {
    law: "lei",
    amendment: "emenda",
    decree: "caneta",
  },
  instrumentHint: {
    law: "maioria simples",
    amendment: "três quintos",
    decree: "sem votação",
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
    /* O BOTÃO DO EVENTO VIROU O BOTÃO DO MÊS PASSADO. O diálogo nativo deixou de
       demonstrar um padrão e passou a carregar o relatório — e um botão que abre
       uma demonstração ao lado de um jogo que funciona é andaime pedindo para
       ser confundido com funcionalidade. */
    review: "O mês passado",
    reviewHint: "reabre o relatório do último turno",
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
