/* TEXTO DA INTERFACE — todo ele, num lugar so.
   ══════════════════════════════════════════════════════════════════════════════
   Nenhuma frase vive solta dentro de um template. Duas razoes praticas: revisar
   copia passa a ser ler um arquivo em vez de cacar por quarenta; e o dia em que
   alguem quiser outro idioma, a fronteira ja existe — sem que isso custe uma
   camada de i18n agora. */

/* ── O VOCABULARIO COMPARTILHADO ──────────────────────────────────────────────
   ══════════════════════════════════════════════════════════════════════════════

   ⚠ ELE NASCEU DE UMA CONTAGEM, em 18/08/2026: **vinte e tres frases da interface
   estavam escritas duas vezes**, e uma delas — "opinião pública" — duas vezes
   DENTRO DO MESMO OBJETO. Copia duplicada nao acusa nada enquanto ninguem mexe; o
   defeito nasce na primeira vez que alguem ajusta uma das duas, e a partir dali o
   menu chama a tela de um nome e a tela se chama de outro.

   ⚠ E NEM TODA REPETICAO ENTROU AQUI. O que entra e o que E A MESMA COISA e tem de
   continuar sendo: o nome de uma tela no menu e no titulo dela, o nome de um estado
   de bancada onde quer que ele apareca, o carimbo do afastamento. O que NAO entra e
   o que hoje coincide e pode divergir por decisao — "Aprovada" no aviso da carta e
   "Aprovada" no placar do relatorio sao a mesma palavra por acaso, e no dia em que
   uma delas ganhar sujeito a outra nao muda junto.

   O TESTE PARA ENTRAR: se as duas mudassem juntas OBRIGATORIAMENTE, e uma so. */
const TERMOS = {
  /* Os nomes das telas. O menu e o titulo tem de dizer a mesma coisa. */
  cabinet: "Gabinete",
  finance: "Finanças",
  estado: "O Estado",

  /* Os tres estados de uma bancada. Eles apareciam em `mood` e em `cabinet.arch*`
     com as mesmas palavras em dois — e com palavras DIFERENTES no terceiro:
     "rompida" contra "em ruptura", para o mesmo estado do mesmo motor. */
  loyal: "com o governo",
  obstructing: "obstruindo",
  ruptured: "em ruptura",

  /* As tres rupturas. Elas eram duas listas identicas dentro de `cabinet`. */
  social: "Opinião pública",
  economic: "Capital",
  political: "Base no Congresso",

  /* O carimbo do fim, e ele e o mesmo no cartao da CALDEIRA e no fecho. */
  removed: "MANDATO INTERROMPIDO",
  removedNote: "a Câmara autorizou o afastamento",

  /* Unidades e grandezas, ditas uma vez. */
  month: "mês",
  months: "meses",
  perYear: "/ano",
  of: "de",
  gdp: "PIB",
  inflation: "Inflação",
  approval: "Aprovação",
  grossDebt: "Dívida bruta",
  country: "O país",
  onTable: "Em pauta",
  delivers: "entrega",
  /* ⚠ CANETA E UM RITO SO. `instrument.budget` saía com maiuscula e
     `instrument.decree` com minuscula — a mesma palavra em duas grafias, e o CSS
     faz caixa alta nos dois, entao a divergencia esperava um dia em que alguem
     tirasse o `text-transform`. */
  pen: "caneta",
};

export const UI = {
  mark: "Planalto",
  /* AS SECOES SAO A TABELA DE MOTORES, e nao uma lista de telas desejadas. Cada
     uma que ainda nao existe entra DESLIGADA e diz isso — menu que oferece o que
     nao abre ensina o jogador a desconfiar do menu inteiro. */
  /* A NAVEGACAO E POR PODERES E LUGARES, e nao por area de governo. Ela ja foi
     organizada por motor (menu com formato de codigo) e por instrumento (menu que
     obriga a saber o rito antes do assunto); a terceira forma, por area, valeu
     enquanto o jogo era so orcamento. Com legislar virando atividade propria, o
     Congresso deixa de ser um instrumento e vira um LUGAR — e a regra antiga
     sobrevive um nivel abaixo: quem quer mexer na saude entra em Ministerios. */
  nav: {
    cabinet: TERMOS.cabinet,
    congress: "Congresso & Leis",
    finance: TERMOS.finance,
    ministries: "Ministérios",
    estado: TERMOS.estado,
    street: "A Rua",
    backstage: "Bastidor",
    pending: "ainda não existe",
  },
  /* O GABINETE — a tela inicial, e a unica que so resume. */
  cabinet: {
    eyebrow: "o resumo da república",
    title: TERMOS.cabinet,
    inbox: "Caixa de entrada",
    /* ⚠ A ESPERA E DITA, e nao escondida. A Caixa de Entrada e a peca central
       desta tela e ela so tem o que dizer quando o Congresso, o relator e o
       tribunal existirem para escrever. Um inbox com tres tipos de carta ensina a
       ignorar a tela onde o jogo inteiro vai acontecer. */
    /* ⚠ SAO DOIS ESTADOS VAZIOS DIFERENTES, e so um deles existe hoje.
       "Nenhuma pendencia na mesa" afirma que o sistema CHECOU e nao achou nada — e
       nao ha sistema. Duas revisoes externas pediram essa frase, e ela e a certa
       para o dia em que a tramitacao existir; hoje ela seria a tela mentindo com
       educacao. O que se diz enquanto isso e o que se sabe: que a mesa ainda nao
       recebe, o que vai chegar nela, e o que falta para isso. E a mesma postura do
       item desligado no rail, e a que manteve a aprovacao fora da tela por tres
       sessoes. */
    /* ⚠ A NOTA FOI REESCRITA em 15/08/2026, e o motivo é que ela prometia o que já
       tinha chegado. Ela dizia "a caixa nasce quando o Congresso passar a
       escrever" — e a caixa nasceu antes disso: o mês que fecha cai aqui como
       carta assinada. O que continua verdade é mais estreito, e é o que ela diz
       agora: o Executivo já escreve, e os OUTROS poderes ainda não. */
    inboxWaiting:
      "Todo mês que você resolve chega aqui, assinado pela Casa Civil. O que ainda não chega é o resto da república: o líder que cobra a diretoria prometida, a lei que o relator devolveu mudada, o tribunal que derrubou o que passou. Quem escreve primeiro é a tramitação.",
    congress: "O Congresso",
    congressAction: "negociar",
    vault: "O cofre da União",
    vaultFree: "cabe no mês",
    vaultLocked: "obrigatória",
    vaultTaken: "o orçamento escrito já consome",
    /* ⚠ ELE DIZ O EXCESSO, e nao repete o total. "já consome R$ 14,5 bi" logo
       abaixo de "cabe R$ 14,2 bi" obriga o jogador a subtrair de cabeca para
       descobrir a unica coisa que importa — e a subtracao e trabalho da tela. */
    vaultOver: "o orçamento escrito passa do que cabe em",
    street: "Aprovação por renda",
    seats: "de 513",
    reading: "a leitura do mês",
    /* A LEGENDA DO ARCO. Tres cores sem chave e um grafico que so o autor lê —
       e este arco passou um dia inteiro assim, com as fatias certas e ninguem
       sabendo o que elas diziam. */
    archLoyal: TERMOS.loyal,
    archObstructing: TERMOS.obstructing,
    archRuptured: TERMOS.ruptured,
    /* ⚠ A RESPOSTA A PERGUNTA QUE O JOGADOR FAZ PRIMEIRO. Ele olha "obrigatória
       95%" e pergunta por quê; a resposta do Planalto e diferente da que ele
       espera — nao e falta de caixa, e excesso de TEXTO, e cada real preso tem uma
       norma com nome e hierarquia atras dele. */
    vaultWho: "e quem trava",
    /* ── A CALDEIRA ────────────────────────────────────────────────────────────
       ⚠ ELA MEDE QUEM CONSEGUE TE DERRUBAR, e a Rua logo abaixo mede quem te
       aprova. São perguntas diferentes, e por isso são dois cartões e não um. */
    /* ⚠ ELE SE CHAMAVA "AS PLACAS TECTONICAS" ate 16/08/2026, e o responsavel matou a
       metafora com uma frase: "expressoes que nao da pra entender nada, pura cara de
       IA". Ele esta certo, e o defeito tem nome — a metafora estava fazendo o trabalho
       que o SUBTITULO de cada linha ja faz: cada grupo diz o que quer, logo abaixo do
       nome. O rotulo poetico so atrasava a leitura.

       ⚠ E A REGRA QUE SAI DAQUI vale para toda tela: rotulo nomeia a COISA; a metafora,
       se ela se paga, mora na prosa do arquivo e nao na interface. */
    boiler: "Grupos de pressão",
    boiling: "fervendo",
    /* AS TRÊS RUPTURAS, e o processo só abre com as três juntas — presidentes não
       caem por um fator só. */
    ruptureSocial: TERMOS.social,
    ruptureEconomic: TERMOS.economic,
    rupturePolitical: TERMOS.political,
    ruptureNone: "nenhuma ruptura aberta",
    rompeu: "rompeu:",
    /* ── A TRINDADE, e ela é a leitura que faltava ─────────────────────────────
       ⚠ ELA DIZ O QUE AINDA SEGURA O GOVERNO DE PÉ, e não quantas romperam. Um
       contador — "2 de 3" — mede o tamanho do perigo e esconde a única coisa
       acionável: QUAL delas ainda não rompeu.

       Os três nomes são os mesmos de `ruptureSocial` e irmãs, e não uma segunda
       tradução: dois nomes para a mesma ruptura é como um vocabulário começa a
       divergir. Aqui o mapa é por id, porque quem os enumera é o motor. */
    trinityTitle: "Risco de queda",
    trinityHold: "as três, juntas",
    trinityNone: "as três romperam",
    /* OS TRES NOMES DIZEM QUEM ABANDONA, e nao uma imagem. "Quem sustenta" era o
       fisiologismo por perifrase — o jogador tinha de deduzir de quem se falava. */
    trinity: {
      social: TERMOS.social,
      economic: TERMOS.economic,
      political: TERMOS.political,
    },
    /* O LADO EM QUE CADA UMA ROMPE, e ele vem do motor: a social rompe quando CAI,
       as outras duas quando SOBEM. Sem dizer o lado, o número ao lado do limiar
       não significa nada. */
    trinityBelow: "rompe abaixo de",
    trinityAbove: "rompe acima de",
    /* O rótulo do medidor, para leitor de tela. */
    boilerMeter: "de 100 de pressão",
    /* ⚠ E O CARIMBO DO CERCO. Ele é mono porque é a máquina do Estado carimbando —
       não é medição nem nome. */
    siege: "PROCESSO ABERTO",
    /* ⚠ O CARIMBO DO FIM. Ele é mono pela mesma razão do outro: é a máquina do
       Estado carimbando. E a frase é seca de propósito — o Planalto não tem tela de
       derrota nem placar, porque a partida JÁ é um mandato. Cair é o mandato
       terminar antes, e o que muda é a data. */
    fallen: TERMOS.removed,
    fallenNote: TERMOS.removedNote,
    siegeNote: "cada voto custa o triplo até o plenário decidir",
  },
  /* A JANELA DA TENDENCIA — e ela e dita porque ela VARIA.
     ⚠ ELA NAO E ENFEITE DE COPIA. O historico de cada area tem o comprimento do
     ATRASO dela — a MALHA guarda `lag + 1` valores —, entao a Educacao consegue
     olhar 12 meses para tras e a Saude so consegue olhar 3. Duas telas mostravam
     essas variacoes sem dizer contra o que comparavam, e a de area chamava todas
     de "em 12 meses", inclusive as seis que nao tinham doze meses guardados.
     Numero de variacao sem janela declarada nao e leitura: e adivinhacao. */
  window: {
    over: "em",
    month: TERMOS.month,
    months: TERMOS.months,
  },
  /* ── DE QUEM É ESTE GOVERNO ────────────────────────────────────────────────
     ⚠ O JOGADOR ERA A ÚNICA PESSOA SEM NOME num jogo em que sete outras tinham. A
     barra dizia "1º MANDATO · ANO 1" — o mandato de quem? —, e nenhuma tela se
     dirigia ao presidente. */
  gov: {
    president: "presidente",
    /* ⚠ "MAIS PERTO DE", E NÃO "É". O modelo não tem regiões batizadas no plano
       `econômico × liberdades`; o que ele tem são quatro blocos com posição
       declarada, e eles são os únicos marcos com nome que existem. Dizer "seu
       governo é de centro-esquerda" importaria uma taxonomia que o modelo não tem
       — que é o que já se recusou duas vezes a duas auditorias. Dizer de quem ele
       se aproxima é a mesma distância euclidiana que ECLUSA usa para votar. */
    nearest: "governa mais perto",
    /* ⚠ QUEM NÃO MOVEU NADA NÃO É DE CENTRO. Ele não exerceu ideologia nenhuma, e
       tudo o que está em vigor foi o antecessor que escreveu. Imprimir o centro do
       plano aqui seria inventar uma posição para quem não tomou nenhuma. */
    untouched: "ainda governa o orçamento que herdou",
    /* ⚠ A ASSINATURA NÃO TEM TEXTO PRÓPRIO, e a ausência é a correção de um
       defeito do mesmo dia: ela dizia "leitura de Fulano" logo abaixo do rótulo
       "A LEITURA DO MÊS" — a mesma palavra duas vezes, em dois pesos. Uma
       assinatura de verdade não se anuncia: é um traço e um nome, e o traço mora
       no template porque é pontuação e não frase. */
  },
  /* ── A CAIXA DE ENTRADA ────────────────────────────────────────────────────
     ⚠ A PRIMEIRA CARTA DE VERDADE é o mês que fechou, e ela existia o tempo todo.
     O relatório do turno é produzido desde a quinta sessão e estava enterrado num
     bloco no rodapé do Congresso — uma tela que o jogador pode não visitar. O
     resultado de uma decisão chegando onde talvez ninguém olhe é a definição de
     consequência invisível. */
  inbox: {
    /* ── O CERCO FALANDO ──────────────────────────────────────────────────────
       ⚠ ESTAS FRASES NASCERAM DE UMA MEDIÇÃO, e ela é o achado mais desconfortável
       de 18/08/2026: num governo passivo chegavam ZERO cartas em 44 meses, e o
       processo de impeachment abria no mês 43 no meio desse silêncio. O país
       desmoronava — aprovação em 13%, dois grupos fora do governo, a Câmara reunida
       para afastar o presidente — e a única notícia disso era uma barra num cartão
       da coluna da direita.

       ⚠ E NENHUMA DELAS INVENTA MECÂNICA. Cada uma diz o que ACONTECEU e o que
       aquilo arma; os dois números do cerco vêm do motor, e a régua com o valor e o
       limiar de cada ruptura já mora no Gabinete. A carta é o que chega a quem não
       estava olhando para a régua. */
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
        "O fisiologismo concluiu que sustentar o senhor custa mais do que derrubá-lo — e ele é o último a virar, porque ganha dinheiro sustentando.",
    },
    /* ⚠ A FRASE COMUM É O QUE FAZ A CARTA VALER: uma ruptura sozinha não derruba
       ninguém, e sem isso o aviso soaria como sentença. São três, e o processo só
       abre com as três juntas — é isso que dá ao jogador o que fazer. */
    ruptureNote: "São três, e o processo só abre com as três abertas ao mesmo tempo.",
    siegeSubject: "O processo foi aberto",
    siegeBody:
      "As três rupturas se abriram juntas, e o pedido de afastamento foi protocolado. Ele não se fecha porque a rua melhorou: quem o encerra é o plenário.",
    siegeVote: "A Câmara vota no mês que vem, e afastar exige",
    siegeOf: TERMOS.of,
    siegePrice: "Até lá cada cadeira custa",
    siegeAction: "Ir ao Congresso",
    /* ⚠ PROTOCOLADO NAO E DERROTA, e a distincao nasceu de um defeito medido: a
       carta do mes dizia "derrubada" para um texto que tinha acabado de ser
       ESCRITO. Ela lia `enacted` — que desde a tramitacao significa "algum texto
       venceu o plenario hoje" — contra a pauta que o jogador acabou de assinar, e
       as duas deixaram de ser a mesma coisa. Perder e uma coisa; esperar e outra, e
       confundi-las ensina o jogador a achar que o Congresso o rejeitou quando na
       verdade ninguem votou nada. */
    filed: "protocolado",
    passed: "aprovada",
    rejected: "derrubada",
    voted: "o plenário deu",
    street: "a rua fechou o mês em",
    seeMonth: "ver o mês",
    /* ⚠ O VAZIO MUDOU DE FRASE quando a primeira carta passou a existir. Ele dizia
       "a mesa ainda não recebe correspondência", e isso deixou de ser verdade no
       instante em que o mês passou a cair aqui — o que é verdade agora é mais
       simples: nenhum mês foi resolvido ainda. A declaração do que AINDA falta
       (Congresso, relator e tribunal escrevendo) continua na nota abaixo, porque
       ela continua sendo o estado real do projeto. */
    firstLead: "O primeiro mês ainda não foi resolvido",
    /* ── AS CARTAS DA TRAMITAÇÃO ─────────────────────────────────────────────
       ⚠ ELAS SÃO O QUE TRANSFORMA A GAVETA EM MECÂNICA. Sem elas o jogador vê o
       texto sumir e não sabe se a Mesa engavetou, se o relator o esvaziou ou se o
       plenário o derrubou — e mecânica que só mostra ESTADO é obstáculo; a que
       mostra CAUSA é jogada. Cada uma tem um remetente de verdade, e o remetente é
       quem de fato decidiu: o presidente da Câmara pauta, o relator relata, o
       plenário vota. */
    tabled: "Pautei o seu texto",
    tabledBody: "Ele vai ao relator, e volta de lá no mês que vem.",
    reported: "Devolvi o seu texto com uma emenda",
    reportedBody: "Ele vai a plenário no mês que vem.",
    reportedSaved: "salvei",
    forgotten: "O seu texto morreu na gaveta",
    forgottenBody: "Seis meses sem ser pautado. Ele não perdeu a votação — ela nunca aconteceu.",
    passedBill: "O plenário aprovou",
    rejectedBill: "O plenário derrubou",
    /* ── A PERGUNTA, E ELA É A ÚNICA COISA NESTA TELA QUE ESPERA VOCÊ ─────────
       ⚠ AS DUAS SAÍDAS CUSTAM, e a frase de cada uma diz o quê. Um par de botões
       genéricos — "sim" e "não" — obrigaria o jogador a descobrir o preço depois
       de pagar, e informação que chega depois da decisão é recibo. */
    amendmentChoices: {
      accept: "Aceitar a emenda",
      acceptCost: "o texto vai a plenário sem o que ele salvou",
      block: "Travar o texto",
      blockCost: "ele volta para a gaveta, e o relógio dela não reinicia",
    },
    /* ── A CHANTAGEM ──────────────────────────────────────────────────────────
       ⚠ AS DUAS SAÍDAS DIZEM ONDE DÓI, e são lugares DIFERENTES: ceder cobra no
       caixa deste mês, recusar cobra na paciência do grupo. Um par que custasse na
       mesma moeda não seria uma escolha, seria um preço com duas etiquetas.

       E o texto não promete número que o motor não produz: "sai da mesma bolsa" é
       verdade e é tudo o que se pode afirmar antes de o mês fechar — quanto sai
       depende do rateio, e prometer um valor aqui seria a Mesa anunciando um placar
       que o turno não entrega. */
    demandBody: "quer o programa de volta em",
    /* ⚠ O SILENCIO AQUI RECUSA, e essa frase e o inverso da irma dela na emenda. A
       diferenca nao e de tom: um lobby que exige e nao recebe resposta NAO entende que
       ganhou, e prometer o contrario faria o jogador aprender uma regra errada e jogar
       contra ela por meses. */
    spiteWarns: "Se você não responder, ele lê como recusa.",
    conceded: "Você cedeu, e a verba volta neste mês.",
    refused: "Você recusou, e ele não esquece depressa.",
    demandChoices: {
      accept: "Ceder",
      acceptCost: "a verba volta, e ela sai da mesma bolsa deste mês",
      block: "Recusar",
      blockCost: "o grupo esquenta, e a caldeira não esfria depressa",
    },
    /* ⚠ O PREÇO DO SILÊNCIO É DITO ANTES, e essa frase é a razão de o prazo ser
       mecânica em vez de relógio: é saber o que acontece se você não responder que
       transforma ignorar numa ESCOLHA. Um dossiê externo pediu o contrário — que a
       consequência chegasse "sem aviso prévio" —, e vencimento surpresa ensina o
       jogador a desconfiar da tela. */
    silenceWarns: "Se você não responder, a emenda vale.",
    dueIn: "vence em",
    dueNow: "vence neste mês",
    months: TERMOS.months,
    month: TERMOS.month,
    /* O DESFECHO — e ele fica na bandeja um mês depois de fechado, porque um inbox
       que apaga o que você deixou vencer esconde justamente que você vem deixando
       vencer. */
    accepted: "Você aceitou a emenda.",
    blocked: "Você travou o texto. Ele voltou para a gaveta.",
    silenced: "O prazo venceu sem resposta. A emenda valeu.",
    /* ── A CARTA DE POSSE ────────────────────────────────────────────────────
       ⚠ ELA EXISTE PORQUE A PRIMEIRA TELA DO JOGO TINHA A PEÇA CENTRAL VAZIA. O
       Gabinete é 3fr de Caixa de Entrada contra 2fr de cartões, e no minuto zero a
       coluna maior não tinha nada — o pior momento do jogo, e o primeiro.

       E ela não inventa nada: cada número aqui já existe nos motores, e a carta só
       os junta na ordem em que um chefe de gabinete os entregaria. */
    inauguration: "O país que o senhor recebe",
    inheritedMandatory: "da despesa do ano é obrigatória, e ela não passa pela sua caneta",
    inheritedRoom: "é o que sobra para o mês, depois do que já está comprometido",
    inheritedLead: "O orçamento em vigor é o do seu antecessor até o senhor escrevê-lo.",
  },
  /* A BARRA SUPERIOR — os sinais vitais, e eles nunca somem da tela. */
  vitals: {
    gdp: TERMOS.gdp,
    inflation: TERMOS.inflation,
    approval: TERMOS.approval,
    base: "Base",
    advance: "Avançar",
  },
  /* OS TRES VERBOS DE GOVERNAR, e a ordem em que aparecem na tela de area e o
     custo de executar cada um: alocar nao precisa de ninguem, pautar precisa do
     Congresso, e vigente ja foi decidido e so cobra. */
  area: {
    /* O ORÇAMENTO GRANULAR. "Alocar" e "Pautar" saíram: o jogador não escolhe
       mais entre alocar verba e pautar uma lei — ele escreve o orçamento, e o
       rito de cada linha é consequência de onde ele parou o controle. */
    /* ⚠ A CABECA DA AREA PASSOU A DIZER QUE AREA E ESTA. Ela mostrava
       "ATENDIMENTO / 61" — o nome do indice e o numero dele —, e era a unica tela
       do jogo que nao se apresentava: o nome do ministerio so existia no rail. As
       outras quatro usam `categoria / nome`, e "Ministério" e a categoria desta. */
    ministry: "Ministério",
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
    perYear: TERMOS.perYear,
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
    budget: TERMOS.pen,
    law: "lei",
    amendment: "emenda",
    decree: TERMOS.pen,
  },
  instrumentHint: {
    /* ⚠ `budget` FALTAVA AQUI, e o buraco imprimia INGLÊS na tela. `labelOf` cai no
       id cru quando não acha a chave — o que é de propósito, para um instrumento
       digitado errado no catálogo aparecer em vez de sumir —, e a linha da pauta
       saía "CANETA · Saúde · budget · resultado −26,5/ano". Regra do projeto:
       português na interface, inglês no código. */
    budget: "o Congresso já autorizou",
    law: "maioria simples",
    amendment: "três quintos",
    decree: "sem votação",
  },
  estado: {
    eyebrow: "o patrimônio e o poder",
    title: TERMOS.estado,
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
    eyebrow: "as contas da União",
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
    /* ⚠ O PRÊMIO DE RISCO PRECISAVA APARECER, senão ele seria motor invisível — que é
       o defeito que o ciclo 5 nomeou: sete pessoas decidiam toda votação e nenhuma
       aparecia. Ele entrou em 16/08 e encarece cada real do estoque; sem uma linha na
       tela, o jogador veria a dívida crescer mais rápido e não saberia por quê.

       E ele SÓ APARECE QUANDO EXISTE. Um "0,00 p.p." todo mês ensinaria o olho a
       pular a linha inteira — a mesma razão que esconde a linha do dinheiro quando não
       houve promessa. */
    premium: "Prêmio de risco",
    premiumNote: "o que o mercado cobra acima da básica",
    gross: TERMOS.grossDebt,
    overGdp: "Dívida sobre o PIB",
    ceiling: "Teto do arcabouço",
    headroom: "Folga até o teto",
    untilCeiling: "o que o teto ainda deixa gastar",
    squeezed: "a obrigatória sozinha já fura o teto",
    country: TERMOS.country,
    perYear: TERMOS.perYear,
    perMonth: "no mês",
  },
  /* ⚠ O CONGRESSO GANHOU CABECA E VIROU UMA LAMINA SO em 15/08/2026. Ele era a
     unica tela do jogo com TRES pecas de vidro soltas — a faixa de indices, a mesa
     e o relatorio — e a unica sem cabeca nenhuma: a tela onde o mes se decide nao
     dizia o proprio nome. Agora ela tem a mesma forma das outras quatro: uma
     lamina, uma cabeca, e blocos com legenda dentro. */
  congress: {
    eyebrow: "o poder legislativo",
    /* ── A TRAMITAÇÃO ────────────────────────────────────────────────────────
       ⚠ O TEXTO DEIXOU DE VALER NO MÊS EM QUE É ESCRITO em 15/08/2026. Ele entra
       na GAVETA, passa pela Mesa, volta da relatoria e só então vai a plenário —
       três estágios, um por mês. Sem estas palavras a tela continuaria anunciando
       "acima do quórum" para uma votação que não vai acontecer, que é a terceira
       vez que este projeto encontra a mesma família de defeito. */
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
    /* ⚠ O QUE O PLACAR PROMETE MUDOU DE TEMPO. Ele continua sendo a previsão do
       plenário — mesma conta, mesma câmara —, mas o plenário é daqui a três meses.
       Anunciar "acima do quórum" sem dizer QUANDO seria prometer um mês que não é
       este. */
    willFile: "este texto vai para a gaveta",
    forecastLater: "previsão para quando ele chegar ao plenário",
    country: "O que o país entrega",
    agenda: TERMOS.onTable,
    /* ── A GENTE DO CONGRESSO ─────────────────────────────────────────────────
       ⚠ SETE PESSOAS DECIDIAM O PREÇO DE TODA VOTAÇÃO E NENHUMA APARECIA. O
       ELENCO gera nome, cargo, ambição e memória desde 14/08/2026; o jogador
       pagava um bloco, a memória do líder mudava o valor em silêncio, e ele nunca
       soube que existia um líder. Motor que o jogador não vê não é profundidade,
       é custo. */
    office: {
      speaker: "presidente da Câmara",
      senate: "presidente do Senado",
      rapporteur: "relator do orçamento",
      leader: "líder de bancada",
    },
    /* ⚠ SÓ UMA DELAS TEM PREÇO HOJE, e a tela não finge o contrário. `succession`
       é a única que o motor cobra — quem quer o Planalto em 2030 reconhece menos
       da verba que recebe. As outras quatro estão declaradas no catálogo e são
       INERTES até a tramitação e a queda existirem, e por isso elas aparecem como
       o que são: quem a pessoa é, e não um preço. Ver o achado 16 da retomada. */
    ambition: {
      succession: "quer o Planalto em 2030",
      cabinet: "quer um ministério",
      state: "quer o governo do estado",
      court: "quer uma vaga no tribunal",
      seat: "quer continuar onde está",
    },
    /* O QUE A AMBIÇÃO DE SUCESSÃO CUSTA, dito onde ela aparece: é o único termo do
       elenco que dinheiro não compra, e o jogador precisa saber disso antes de
       gastar com ele — não depois. */
    successionPrice: "reconhece menos do que recebe",
    /* A MEMÓRIA EM PORTUGUÊS. Ela chega ao Congresso como verba JÁ PAGA, então a
       frase diz exatamente isso: o sujeito negocia como quem já recebeu. */
    memoryGood: "negocia como quem já recebeu",
    memoryBad: "cobra a promessa que você não pagou",
    memoryNone: "sem histórico com o seu governo",
    delivers: TERMOS.delivers,
  },
  mesa: {
    onTable: TERMOS.onTable,
    empty: "Nada em pauta",
    emptyHint: "escolha uma ação numa das áreas — ou avance o mês assim mesmo",
    swap: "trocar",
    forecast: "Previsão",
    needs: "precisa de",
    promises: "promete",
    fits: "cabe",
    /* ⚠ ELA DIZIA O CONTRÁRIO DO MOTOR, e a captura pegou. O texto era "não cabe —
       o rateio vai cortar", e o número impresso ao lado é o que CABE: "promete
       R$ 13,8 bi · não cabe — o rateio vai cortar R$ 13,7 bi" lê-se como "vão cortar
       quase tudo", quando o corte de verdade era de R$ 0,1 bi.

       O verbo agora é o mesmo do relatório do mês — "o caixa honrou" —, e os dois
       lados da frase voltam a comparar grandezas da mesma natureza: o que se promete
       e o que se paga. Um vocabulário, dois lugares. */
    over: "não cabe — o caixa honra",
    below: "abaixo do quórum",
    above: "acima do quórum",
    decree: "vale sem passar pelo plenário",
    bench: "bancada",
    mood: "humor",
    result: "resultado",
    delivers: TERMOS.delivers,
    funding: "verba",
    cost: "custo",
    seats: TERMOS.of,
    /* ⚠ O QUE A COLUNA DIZ NUM MES SEM PAUTA. Ela imprimia "de 76" — metade de uma
       frase, com o antecedente faltando —, porque votos só existem contra um texto
       em votação. Isto é o que continua verdadeiro todo mês: quantos aquela pessoa
       arrasta. */
    leads: "arrasta",
  },
  /* ⚠ OS TRES SAIRAM DE `TERMOS`, e o terceiro estava DIVERGENTE: ele dizia
     "rompida" enquanto o mesmo estado do mesmo motor era "em ruptura" no arco do
     Gabinete. Duas palavras para um estado ensinam o jogador a procurar uma
     diferenca que nao existe. */
  mood: {
    loyal: TERMOS.loyal,
    obstructing: TERMOS.obstructing,
    broken: TERMOS.ruptured,
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
    /* ⚠ ELA DIZIA "caixa livre" E SE CONTRADIZIA COM O CARTÃO LOGO ABAIXO, que
       anunciava o orçamento passando do que cabe em R$ 5,0 bi. Uma revisão externa
       apontou a frase por estar solta na tela; olhando de perto, o defeito era
       pior — ela afirmava o contrário do resto do Gabinete.

       A causa é que `situationOf` mede outra coisa: ela pergunta se o TETO fechou,
       com empenho zero, e não se as ordens DESTE mês cabem. As duas leituras são
       legítimas e diferentes, e o texto é que prometia a segunda entregando a
       primeira. Agora ele diz o que de fato foi medido. */
    comfortable: "Base folgada e o teto ainda abre; a janela não fica aberta muito tempo",
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
    country: TERMOS.country,
  },
  actions: {
    /* ── AS LEGENDAS DE BOTAO SAIRAM em 16/08/2026 ─────────────────────────────
       Pedido do responsavel: "tire esses textos, frases e palavras inuteis".

       ⚠ A REGRA QUE SOBRA E O TESTE: uma legenda so se paga quando ela diz algo que o
       ROTULO nao diz. "Avancar o mes" seguido de "resolve o turno e propaga os efeitos"
       falha nos dois lados — repete o rotulo em jargao de motor ("propaga os efeitos" e
       vocabulario de CASCATA, e nao de presidente) e ocupa a segunda linha do unico
       botao que o jogador aperta todo mes.

       ⚠ E A DO REINICIO ERA PIOR: ela explicava o obvio ANTES do perigo. O aviso de
       verdade e a confirmacao — "Apagar mesmo?" —, e essa fica, porque ela chega no
       momento em que a informacao muda a decisao. */
    advance: "Avançar o mês",
    /* O BOTÃO DO MÊS PASSADO SAIU. Ele reabria o relatório num diálogo; o
       relatório agora é painel fixo da Mesa e está sempre à vista. Botão que
       abre o que já está aberto é ruído com aparência de funcionalidade. */
    /* ⚠ O BOTAO DO FIM DIZ O QUE ACONTECEU e aponta o que fazer, e a legenda aqui
       se paga pela mesma regra do reinicio: ela chega no momento em que a
       informacao muda a decisao — o jogador acabou de descobrir que nao ha mais
       mes, e precisa saber que ha outra partida. */
    ended: "O mandato acabou",
    endedHint: "nova partida, ao pé da coluna",
    restart: "Nova partida",
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
  /* ── O FECHO DO MANDATO ────────────────────────────────────────────────────
     ⚠ AS DUAS SAÍDAS TÊM O MESMO TOM, e isso é decisão e não descuido. O Planalto
     não tem tela de derrota — a partida JÁ é um mandato de 48 meses, sem vitória e
     sem placar. Quem cai e quem cumpre leem a mesma tela; o que muda é o carimbo e
     a data. Um "você perdeu" aqui inventaria um objetivo que o jogo nunca teve. */
  closing: {
    eyebrow: "a prestação de contas",
    /* O QUE A BARRA SUPERIOR DIZ NO LUGAR DO ANO. Ela contava "2º mandato · ano 1"
       para quem atravessava os quatro anos — um mandato que nunca teve eleição. */
    ended: "mandato encerrado",
    title: "O mandato",
    months: "meses de mandato",
    /* OS DOIS CARIMBOS. São mono pela mesma razão dos outros dois do jogo: é a
       máquina do Estado carimbando, e não uma medição nem um nome. */
    removed: TERMOS.removed,
    removedNote: TERMOS.removedNote,
    served: "MANDATO CUMPRIDO",
    servedNote: "os quatro anos terminaram",
    country: "O país que o senhor entrega",
    approval: TERMOS.approval,
    approvalNote: "ótimo e bom",
    debt: TERMOS.grossDebt,
    debtNote: "sobre o PIB",
    written: "O que ficou escrito",
    /* ⚠ AUSÊNCIA DECLARADA. Um mandato sem lei nenhuma é um fato sobre o governo, e
       a frase diz isso — não deixa um espaço vazio que parece defeito de tela. */
    noLaws:
      "Nenhuma lei foi escrita neste mandato. O país terminou com as regras que o senhor recebeu.",
    abandoned: "Abandonaram o governo:",
    noneAbandoned: "Nenhum grupo abandonou o governo.",
  },
  trend: {
    up: "▲",
    down: "▼",
    flat: "—",
  },
};
