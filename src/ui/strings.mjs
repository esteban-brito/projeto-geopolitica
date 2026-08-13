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
  verdict: {
    crisis: "A rua cobra resposta — e o Congresso sabe disso",
    stable: "Governo em equilíbrio instável",
    growth: "Capital político em alta; a janela não fica aberta muito tempo",
  },
  actions: {
    advance: "Avançar o mês",
    advanceHint: "resolve o turno e propaga os efeitos",
    inspect: "Abrir o evento",
    inspectHint: "demonstra o padrão de diálogo",
  },
  dialog: {
    title: "Padrão de diálogo",
    body: "Este é o <dialog> nativo: foco, inércia do fundo, Escape e camada superior vêm do navegador, não de JavaScript escrito à mão.",
    close: "Entendi",
  },
  trend: {
    up: "▲",
    down: "▼",
    flat: "—",
  },
};
