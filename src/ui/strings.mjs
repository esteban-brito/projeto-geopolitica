/* TEXTO DA INTERFACE — todo ele, num lugar so. */

/* Copia duplicada nao acusa nada enquanto ninguem mexe; o defeito nasce na primeira vez que
   alguem ajusta uma das duas, e a partir dali o menu chama a tela de um nome e a tela se
   chama de outro. */
const TERMOS = {
  /* Os nomes das telas. O menu e o titulo tem de dizer a mesma coisa. */
  cabinet: "Gabinete",
  finance: "Finanças",
  estado: "O Estado",

  /* Os tres estados de uma bancada. */
  /* ⚠ RECUSAR E O MESMO ATO NAS DUAS CHANTAGENS, e por isso a palavra e uma so. */
  refuse: "Recusar",
  refuseCost: "o grupo esquenta, e a caldeira não esfria depressa",

  simpleMajority: "maioria simples",

  loyal: "com o governo",
  obstructing: "obstruindo",
  ruptured: "em ruptura",

  /* As tres rupturas. Elas eram duas listas identicas dentro de `cabinet`.

     ⚠ A TERCEIRA CHAMAVA-SE "Base no Congresso" E MENTIA. Ela mede a pressao do
     fisiologismo — sobe quando ele te abandona, e rompe ACIMA de 86 —, enquanto a
     barra superior mostra "Base 436", que sao cadeiras e sobe quando melhora. As duas
     ficam visiveis juntas na abertura, e o jogador lia "Base no Congresso 0" como
     "nao tenho base", tendo 436 de 513. Mesma palavra, sentido invertido, 130px de
     distancia. O nome certo e o que a CALDEIRA ja usa para o mesmo grupo. */
  social: "Opinião pública",
  /* ⚠ OS DOIS SAIRAM DA METAFORA, por ordem dele: "chega de poesia, quero algo
     mais tecnico e bem claro pro novo jogador". "Capital" nao diz quem e, e "o baixo clero" e
     giria de Congresso — quem nunca jogou le as duas e nao sabe de quem a tela esta falando.
     ⚠ E "Parlamentares" NAO PODE VIRAR "base": a regua chamou-se "Base no Congresso" e o
     jogador lia "Base no Congresso 0" como "nao tenho base" tendo 436 de 513. */
  economic: "Setor privado",
  political: "Parlamentares",

  /* O carimbo do fim, e ele e o mesmo no cartao da CALDEIRA e no fecho. */
  removed: "MANDATO INTERROMPIDO",
  removedNote: "a Câmara autorizou o afastamento",

  /* Duas copias divergiriam no dia em que alguem ajustasse uma delas, e ai o jogo passaria a
     ensinar duas mecanicas onde ha uma. */
  plenaryJudged: "o plenário votou um texto que você assinou",

  mandatorySpend: "Despesa obrigatória",
  ceilingRule: "Teto do arcabouço",
  seatsWord: "cadeiras",
  moodWord: "humor",
  perMonthWord: "no mês",
  /* ⚠ ELA TEVE DOIS CONSUMIDORES E AGORA TEM UM, e a reducao foi o conserto: o card da posse
     imprimia a MESMA leitura do bloco do dinheiro a um palmo de distancia, numa tela que nao
     rola. O literal compartilhado provava que eram a mesma coisa e ninguem perguntou se ela
     devia aparecer duas vezes — consistencia nao e o mesmo que nao-redundancia. */
  roomLine: "Sobra para o mês",
  /* ⚠ O PESO ZERO PRECISA DE FRASE E NAO DE "0%", e ela e a mesma no cartao da caldeira e na
     carta da fervura: um grupo que nao entra na conta da ruptura economica nao pesa POUCO. */
  noWeight: "não pesa",
  revenueWord: "Receita",

  /* Unidades e grandezas, ditas uma vez. */
  month: "mês",
  months: "meses",
  perYear: "/ano",
  of: "de",
  /* A preposicao antes de um numero, e ela e a mesma na janela da tendencia e na marca. */
  at: "em",
  gdp: "PIB",
  inflation: "Inflação",
  approval: "Aprovação",
  grossDebt: "Dívida bruta",
  country: "O país",
  onTable: "Em pauta",
  delivers: "entrega",
  /* ⚠ CANETA E UM RITO SO. */
  pen: "caneta",
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

/* ⚠ O TRATAMENTO E UMA TROCA, E NAO DUAS LISTAS DE FRASE. Sete frases da interface citavam
   "o senhor" com todas as letras, e o gerador de nomes sorteia feminino e masculino na mesma
   proporcao: metade das partidas tratava a presidenta por "o senhor" durante 48 meses.

   ⚠ E DEDUZIR PELO NOME DEIXOU DE SER POSSIVEL quando o nome passou a ser DIGITADO — entao a
   escolha e do jogador, feita junto com o nome, e mora no save. Duas listas paralelas de
   frase seriam duas traducoes do mesmo texto divergindo na primeira edicao; um marcador e
   uma troca mantem UMA frase. */
/* O padrao e o masculino porque e o que a partida sem escolha ja usava; ele existe como
   CONSTANTE para nao ser um literal repetido em cada assinatura. */
export const DEFAULT_TREATMENT = /** @type {"senhor"} */ ("senhor");

const TRATAMENTO = /** @type {const} */ ({
  senhor: { voce: "o senhor", titulo: "Presidente" },
  senhora: { voce: "a senhora", titulo: "Presidenta" },
});

export const UI = {
  /* AS SECOES SAO A TABELA DE MOTORES, e nao uma lista de telas desejadas. */
  /* A NAVEGACAO E POR PODERES E LUGARES, e nao por area de governo. */
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
    title: TERMOS.cabinet,
    /* ⚠ A ESPERA E DITA, e nao escondida. */
    /* ⚠ SAO DOIS ESTADOS VAZIOS DIFERENTES, e so um deles existe hoje. */
    inboxSigned: "Todo mês que você resolve chega aqui, assinado pela Casa Civil.",
    inboxWaiting:
      "O que ainda não chega é o resto da república: o líder que cobra a diretoria prometida, a lei que o relator devolveu mudada, o tribunal que derrubou o que passou. Quem escreve primeiro é a tramitação.",
    /* ⚠ A FRASE DO LEITOR DE TELA MORA AQUI, e não dentro do desenho: quem lê por som recebe
       a MESMA descrição que o olho recebe, e descrição escrita dentro de uma view é a única
       frase da interface que ninguém revisa. */
    /* ── AS LEGENDAS DOS QUATRO BLOCOS ─────────────────────────────────────── ⚠ ELAS
       VOLTARAM, e cinco delas tinham SAIDO antes. A premissa daquela
       retirada era que o numero grande nomeava o bloco sozinho; sem numero grande, uma lista
       que abre em "O mercado" nao diz de que assunto ela e. A da Rua nao se redigita — ela e
       a mesma palavra do rail, e teclar de novo e como um vocabulario comeca a divergir. */
    blockCongress: "A Câmara",
    blockVault: "Dinheiro do mês",
    blockBoiler: "Quem pode derrubar",
    blockStreet: "Aprovação por renda",
    baseLine: "Apoiam o governo",
    of: TERMOS.of,
    /* ⚠ O ROTULO DIZ O QUE O NUMERO E, e nao onde ele mora: "base no plenario" e jargao de
       quem ja joga. E a frase abaixo dele existe para o risco de latao na barra deixar de ser
       um traco sem explicacao — ela e o unico texto do bloco, e paga o proprio pixel. */
    lawPasses: "uma lei passa com",
    congressAction: "negociar",
    vaultFree: TERMOS.roomLine,
    /* ⚠ A FRASE DA A BASE DO PERCENTUAL, e sem ela "95%" nao diz 95% de que. */
    vaultOfRevenue: "da receita de",
    vaultBiggest: "Maior gasto preso:",
    vaultLocked: "Preso por lei",
    /* O defeito é real mesmo fora do teste: duas leituras vizinhas passariam a abrir com a
       mesma palavra. */
    vaultTaken: "Já comprometido",
    /* ⚠ ELE DIZ O EXCESSO, e nao repete o total. */
    vaultOver: "Passa do que cabe",
    /* A LEGENDA DO ARCO. */
    /* ⚠ A RESPOSTA A PERGUNTA QUE O JOGADOR FAZ PRIMEIRO. */
    /* ── A CALDEIRA ──────────────────────────────────────────────────────────── ⚠ ELA MEDE
       QUEM CONSEGUE TE DERRUBAR, e a Rua logo abaixo mede quem te aprova. */
    /* Ele esta certo, e o defeito tem nome — a metafora estava fazendo o trabalho que o
       SUBTITULO de cada linha ja faz: cada grupo diz o que quer, logo abaixo do nome. */
    /* AS TRÊS RUPTURAS, e o processo só abre com as três juntas — presidentes não caem por um
       fator só. */
    ruptureSocial: TERMOS.social,
    ruptureEconomic: TERMOS.economic,
    rupturePolitical: TERMOS.political,
    rompeu: "rompeu:",
    /* Os três nomes são os mesmos de `ruptureSocial` e irmãs, e não uma segunda tradução:
       dois nomes para a mesma ruptura é como um vocabulário começa a divergir. */
    trinityTitle: "Risco de queda",
    /* OS TRES NOMES DIZEM QUEM ABANDONA, e nao uma imagem. */
    trinity: {
      social: TERMOS.social,
      economic: TERMOS.economic,
      political: TERMOS.political,
    },
    /* O LADO EM QUE CADA UMA ROMPE, e ele vem do motor: a social rompe quando CAI, as outras
       duas quando SOBEM. */
    trinityBelow: "rompe abaixo de",
    trinityAbove: "rompe acima de",
    /* O rótulo do medidor, para leitor de tela. */
    boilerMeter: "de 100 de pressão",
    /* A MESMA FORMA DA CAMARA: uma frase curta explica o risco de latao na barra, e o numero
       dentro dela usa a cor da marca. */
    /* ⚠ O VERBO ERA "rompem acima de" E COLIDIA COM A FAIXA DO TOPO, que diz "rompe acima de"
       sobre o MESMO grupo com outro numero — mesma palavra, mesmo verbo, 86 e 68 a um palmo
       numa tela que nao rola. O que este limiar significa esta escrito no motor: em `boil` o
       grupo ABANDONA o governo; quem "rompe" e a ruptura, e ela tem limiar proprio e maior. */
    boilerBreaks: "abandonam acima de",
    /* A ponte entre a frase e a segunda marca da barra do fiador. */
    boilerAt: TERMOS.at,
    boilerShare: `do ${TERMOS.economic.toLowerCase()}`,
    /* ⚠ E O PESO ZERO PRECISA DE FRASE PROPRIA, e não de "0%". */
    boilerNoShare: `${TERMOS.noWeight} no ${TERMOS.economic.toLowerCase()}`,
    /* ⚠ O QUARTO CANAL MORTO DO PLANO: a fatia de cada grupo na ruptura economica era
       calculada, formatada e entregue SO ao leitor de tela. Um dos quatro pesa zero, e quem
       enxerga gastava capital acalmando um grupo que nao conta para a conta que ele tenta
       nao perder. O rotulo passou a diz-lo, e o `aria-label` continua dizendo tambem. */
    boilerNoWeight: TERMOS.noWeight,
    /* ⚠ E O CARIMBO DO CERCO. */
    siege: "PROCESSO ABERTO",
    /* ⚠ O CARIMBO DO FIM. */
    fallen: TERMOS.removed,
    fallenNote: TERMOS.removedNote,
    siegeNote: "cada voto custa o triplo até o plenário decidir",
  },
  /* A JANELA DA TENDENCIA — e ela e dita porque ela VARIA.
     ATRASO dela — a MALHA guarda `lag + 1` valores —, entao a Educacao consegue
     olhar 12 meses para tras e a Saude so consegue olhar 3. Duas telas mostravam
     essas variacoes sem dizer contra o que comparavam, e a de area chamava todas
     de "em 12 meses", inclusive as seis que nao tinham doze meses guardados. */
  window: {
    over: TERMOS.at,
    month: TERMOS.month,
    months: TERMOS.months,
  },
  /* ── DE QUEM É ESTE GOVERNO ──────────────────────────────────────────────── ⚠ O JOGADOR
     ERA A ÚNICA PESSOA SEM NOME num jogo em que sete outras tinham. */
  gov: {
    /* se aproxima é a mesma distância euclidiana que ECLUSA usa para votar. */
    nearest: "governa mais perto",
    /* ⚠ QUEM NÃO MOVEU NADA NÃO É DE CENTRO. */
    untouched: "ainda governa o orçamento que herdou",
    /* ⚠ A ASSINATURA NÃO TEM TEXTO PRÓPRIO, e a ausência é a correção de um defeito do mesmo
       dia: ela dizia "leitura de Fulano" logo abaixo do rótulo "A LEITURA DO MÊS" — a mesma
       palavra duas vezes, em dois pesos. */
  },
  /* ── A CAIXA DE ENTRADA ──────────────────────────────────────────────────── ⚠ A PRIMEIRA
     CARTA DE VERDADE é o mês que fechou, e ela existia o tempo todo. */
  inbox: {
    /* ── O CERCO FALANDO ────────────────────────────────────────────────────── ⚠ ESTAS
       FRASES NASCERAM DE UMA MEDIÇÃO, e ela é o achado mais desconfortável de : num governo
       passivo chegavam ZERO cartas em 44 meses, e o processo de impeachment abria no mês 43
       no meio desse silêncio. */
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
    /* ⚠ A FRASE COMUM É O QUE FAZ A CARTA VALER: uma ruptura sozinha não derruba ninguém, e
       sem isso o aviso soaria como sentença. */
    ruptureNote: "São três, e o processo só abre com as três abertas ao mesmo tempo.",
    siegeSubject: "O processo foi aberto",
    siegeBody:
      "As três rupturas se abriram juntas, e o pedido de afastamento foi protocolado. Ele não se fecha porque a rua melhorou: quem o encerra é o plenário.",
    siegeVote: "A Câmara vota no mês que vem, e afastar exige",
    siegeOf: TERMOS.of,
    siegePrice: "Até lá cada cadeira custa",
    siegeAction: "Ir ao Congresso",
    /* ⚠ PROTOCOLADO NAO E DERROTA, e a distincao nasceu de um defeito medido: a carta do mes
       dizia "derrubada" para um texto que tinha acabado de ser ESCRITO. */
    filed: "protocolado",
    passed: "aprovada",
    rejected: "derrubada",
    voted: "o plenário deu",
    /* ⚠ AS TRES SAIRAM com as tres linhas que elas costuravam: o anexo "o mes em
       tres leituras" ja mostra as mesmas com o ANTES ao lado, e o corpo as repetia so com o
       depois. Frase que sobrevive a peca que a usava e o que a segunda metade desta guarda
       existe para achar. */
    seeMonth: "ver o mês",
    /* ⚠ O VAZIO MUDOU DE FRASE quando a primeira carta passou a existir. */
    firstLead: "O primeiro mês ainda não foi resolvido",
    quietLead: "Nada espera resposta",
    ceilingSubject: "O teto do arcabouço fechou",
    ceilingBody:
      "O gasto do ano encostou no limite da regra. Enquanto ele estiver fechado não há discricionário para emenda — e sem emenda a base não se compra de volta.",
    ceilingNote: "o que sobra para o mês:",
    minoritySubject: "O governo perdeu a maioria",
    minorityBody: "As cadeiras que respondem ao governo caíram abaixo da maioria simples.",
    /* ⚠ ELA ERA UMA COSTURA ENTRE DOIS NUMEROS — "436 de 513, e a maioria fecha em 257" — e os
       dois viraram cards. Sobrou o denominador, que qualifica o primeiro. */
    quietMonth: "Nenhum texto foi a plenário neste mês.",
    ruptureLegend: "O que falta para abrir o processo",
    minorityNote: "de 513",
    /* O QUORUM DA LEI COMUM, e ele e o mesmo TERMO que a Camara usa no Gabinete. */
    majority: TERMOS.simpleMajority,
    /* ⚠ AS CINCO FRASES SAO NEUTRAS EM NUMERO, e o defeito era consumado:
       elas foram escritas para nomes de grupo no singular — "O mercado passou do ponto" — e os
       nomes viraram plurais quando o vocabulario deixou de ser metafora. A tela imprimia
       "Parlamentares passou do ponto" e "e ele carrega 30%". Nenhuma guarda alcanca
       concordancia; o conserto e nao depender dela. */
    boilingSubject: "rompeu com o governo:",
    boilingBody: "A pressão passou do ponto de fervura, e o apoio ao governo acabou.",
    boilingNote: "ponto de fervura",
    boilingPressure: "Pressão do grupo",
    boilingWeight: "Peso na ruptura econômica",
    boilingNoWeight: TERMOS.noWeight,

    /* ── OS TRES RELATORIOS DO MES ──────────────────────────────────────────── ⚠ ELES CHEGAM
       POR TEMPO, e nao por evento — sao a unica especie assim. */
    /* AS CINCO NOTAS SAO AS DE `SONDA`, e os nomes sao os que o jogador usa. "Carestia" e
       nao "inflacao" porque quem sente preco no supermercado nao chama de indice; "ordem"
       e nao "seguranca" porque a area ja se chama Seguranca e o mesmo nome em dois papeis
       e o defeito que a guarda `vocabulary` existe para pegar. */
    annexLegend: "o que pesou em cada classe",
    annexNote: {
      prices: "carestia",
      jobs: "emprego",
      services: "serviços",
      safety: "ordem",
      economy: "economia",
    },
    annexTotal: "soma",
    /* ── O ANEXO DO CAIXA ─────────────────────────────────────────────────────
       Os quatro sao a identidade do LASTRO, e nao uma selecao de numeros bonitos: receita
       menos obrigatoria e o que EXISTE, o teto e o que a regra deixa gastar, e o menor dos
       dois e o que se pode empenhar. */
    annexVault: "de onde vem o que sobra",
    /* ⚠ TRES DOS QUATRO SAO OS ROTULOS DE FINANCAS, e a guarda `vocabulary` cobrou a copia no
       primeiro `check` — com razao, e por uma razao que vale mais que a duplicacao: **o anexo
       e Financas dizem o MESMO numero**, e no dia em que um deles mudasse de nome o jogador
       leria dois nomes para a mesma linha do orcamento. */
    annexVaultRow: {
      revenue: TERMOS.revenueWord,
      mandatory: TERMOS.mandatorySpend,
      ceiling: TERMOS.ceilingRule,
      allowance: "Empenhável",
    },
    annexSeats: "bancada por bancada",
    annexSeatsCol: TERMOS.seatsWord,
    annexMoodCol: TERMOS.moodWord,
    annexMoveCol: TERMOS.perMonthWord,
    /* ⚠ OS DOIS DESCONTOS PESAM IGUAL EM TODA CLASSE, e por isso eles ficam no PE e nao numa
       coluna: credibilidade nao tem classe, e desgaste de cargo tambem nao. */
    /* ── O ANEXO DO BALANCO ─────────────────────────────────────────────────── ⚠ ELE E A
       TABELA QUE TORNA OS TRES AVULSOS DISPENSAVEIS NO MES CALMO: antes e depois das tres
       leituras, lado a lado. */
    annexBalance: "o mês em três leituras",
    annexBalanceWas: "antes",
    annexBalanceNow: "agora",
    annexBalanceRow: {
      street: "aprovação",
      seats: TERMOS.seatsWord,
      vault: "o que sobra",
    },

    /* Diz o tamanho, e nao diz QUANTO v3 "Aprovação cai a 21%"   — noticia. */
    headline: {
      "street.rose": "Aprovação sobe a",
      "street.fell": "Aprovação cai a",
      /* ⚠ AS DUAS PASSARAM A FALAR NO NIVEL, e as outras quatro ja falavam: com
         a pastilha de variacao ao lado do assunto, "Base perde 157 cadeiras" e "▼157" diziam o
         MESMO numero duas vezes. O assunto carrega o que o presidente TEM; a pastilha carrega
         o quanto andou. */
      "seats.rose": "Base sobe a",
      "seats.fell": "Base cai a",
      /* ⚠ "CAIXA" E NAO "DISCRICIONARIO", e a troca e de LARGURA e nao de vocabulario:
         "Discricionário cai a R$ 11,3 bi" tem 31 caracteres e quebra em duas linhas num
         indice de 208px — e cada quebra custa 18px de uma coluna que tem 630. */
      "vault.rose": "Caixa sobe a",
      "vault.fell": "Caixa cai a",
    },
    headlineSeats: TERMOS.seatsWord,
    /* a que menos sustenta vêm de `weighed` e `notes`, que SONDA passou a devolver hoje. */
    pollClosed: "A pesquisa fechou o mês em",
    pollGood: "de ótimo ou bom",
    pollDown: "abaixo do mês passado.",
    pollUp: "acima do mês passado.",
    pollPoint: "ponto",
    pollPoints: "pontos",
    /* ⚠ AS CINCO VIRARAM DUAS: elas eram os pedacos de duas FRASES coladas em
       volta de um numero — "O que sustenta o senhor é economia, e é na Alta renda que ela pesa
       mais" —, e as duas leituras desceram para cards. Num card a legenda nomeia e o valor
       responde, entao a costura da frase deixou de existir. */
    pollHolds: "O que sustenta",
    pollDrags: "O que puxa para baixo",
    seatsBody: "As cadeiras que respondem ao governo fecharam o mês em",
    seatsOf: "de 513, e a maioria simples fecha em",
    seatsHint: "Sem ela, nada do que {v} assinar chega ao plenário.",
    vaultBody: "O que sobra para o mês fechou em",
    vaultHint: "É desse dinheiro que sai emenda, e é ele que compra voto.",

    /* ⚠ `reportUnit` MORREU JUNTO COM O TEMPLATE COMUM. */

    /* ── AS CARTAS DA TRAMITAÇÃO ───────────────────────────────────────────── ⚠ ELAS SÃO O
       QUE TRANSFORMA A GAVETA EM MECÂNICA. */
    tabled: "Pautei o seu texto",
    tabledBody: "Ele vai ao relator, e volta de lá no mês que vem.",
    reported: "Devolvi o seu texto com uma emenda",
    reportedSaved: "salvei",
    forgotten: "O seu texto morreu na gaveta",
    forgottenBody: "Seis meses sem ser pautado. Ele não perdeu a votação — ela nunca aconteceu.",
    passedBill: "O plenário aprovou",
    rejectedBill: "O plenário derrubou",
    /* Numa folha que estica até 630px isso é um ofício com cabeçalho, assunto e **430px de
       papel em branco** — e a espécie que sofria era a do desfecho do texto que o jogador
       escreveu, negociou e pagou. */
    passedBillBody:
      "O texto virou norma, e ela vale a partir de agora. Desfazê-la exige outro texto que a revogue pelo nome.",
    passedBillAction: "Ver a lei em vigor",
    rejectedBillBody:
      "O texto caiu no plenário. A faixa segue a que estava, e ele não volta sozinho: quem o quiser de novo assina outro.",
    /* ── A PERGUNTA, E ELA É A ÚNICA COISA NESTA TELA QUE ESPERA VOCÊ ───────── ⚠ AS DUAS
       SAÍDAS CUSTAM, e a frase de cada uma diz o quê. */
    amendmentChoices: {
      accept: "Aceitar a emenda",
      acceptCost: "o texto vai a plenário sem o que ele salvou",
      block: "Travar o texto",
      blockCost: "ele volta para a gaveta, e o relógio dela não reinicia",
    },
    /* ── A CHANTAGEM ────────────────────────────────────────────────────────── ⚠ AS DUAS
       SAÍDAS DIZEM ONDE DÓI, e são lugares DIFERENTES: ceder cobra no caixa deste mês,
       recusar cobra na paciência do grupo. */
    demandBody: "quer o programa de volta em",
    demandCutBody: "quer o programa cortado de volta para",
    /* ⚠ O SILENCIO AQUI RECUSA, e essa frase e o inverso da irma dela na emenda. */
    spiteWarns: "Se você não responder, ele lê como recusa.",
    conceded: "Você cedeu, e a verba volta neste mês.",
    refused: "Você recusou, e ele não esquece depressa.",
    demandChoices: {
      accept: "Ceder",
      acceptCost: "a verba volta, e ela sai da mesma bolsa deste mês",
      block: TERMOS.refuse,
      blockCost: TERMOS.refuseCost,
    },
    /* ⚠ CEDER AO MERCADO NAO CUSTA DINHEIRO — CUSTA O PROGRAMA. */
    demandCutChoices: {
      accept: "Cortar",
      acceptCost: "o gasto cai neste mês, e a área sente no índice",
      block: TERMOS.refuse,
      blockCost: TERMOS.refuseCost,
    },
    /* ⚠ O PREÇO DO SILÊNCIO É DITO ANTES, e essa frase é a razão de o prazo ser mecânica em
       vez de relógio: é saber o que acontece se você não responder que transforma ignorar
       numa ESCOLHA. */
    silenceWarns: "Se você não responder, a emenda vale.",
    dueIn: "vence em",
    dueNow: "vence neste mês",
    months: TERMOS.months,
    month: TERMOS.month,
    /* O DESFECHO — e ele fica na bandeja um mês depois de fechado, porque um inbox que apaga
       o que você deixou vencer esconde justamente que você vem deixando vencer. */
    accepted: "Você aceitou a emenda.",
    blocked: "Você travou o texto. Ele voltou para a gaveta.",
    silenced: "O prazo venceu sem resposta. A emenda valeu.",
    /* ── A CARTA DE POSSE ──────────────────────────────────────────────────── ⚠ ELA EXISTE
       PORQUE A PRIMEIRA TELA DO JOGO TINHA A PEÇA CENTRAL VAZIA. */
    inauguration: "O país que {v} recebe",
    /* ⚠ AS DUAS ERAM FIM DE FRASE e viraram LEGENDA DE CARD: num card a legenda
       nomeia e o valor responde, entao a costura em volta do numero deixou de existir. */
    inheritedMandatory: "Obrigatória do ano",
    inheritedLead: "O orçamento em vigor é o do seu antecessor até {v} escrevê-lo.",
  },
  /* A BARRA SUPERIOR — os sinais vitais, e eles nunca somem da tela. */
  vitals: {
    gdp: TERMOS.gdp,
    inflation: TERMOS.inflation,
    approval: TERMOS.approval,
    base: "Base",
  },
  /* OS TRES VERBOS DE GOVERNAR, e a ordem em que aparecem na tela de area e o custo de
     executar cada um: alocar nao precisa de ninguem, pautar precisa do Congresso, e vigente
     ja foi decidido e so cobra. */
  area: {
    /* O ORÇAMENTO GRANULAR. */
    /* ⚠ A CABECA DA AREA PASSOU A DIZER QUE AREA E ESTA. */
    programs: "O orçamento",
    thisArea: "esta área",
    outlook: "Para onde vai",
    /* O PISO É ANUNCIADO EM TODA LINHA, e não só quando é atravessado. */
    floor: "piso",
    ofMonth: "do mês",
    available: "disponíveis",
    committed: "já comprometidos nas outras áreas",
    holding: "parado",
    perYear: TERMOS.perYear,
    /* OS TITULOS DAS TRES COLUNAS DE NUMERO. */
    /* A COLUNA DO BOTÃO tem título só para quem lê por leitor de tela: na tela ele seria um
       rótulo em cima de um botão que já diz o que faz. */
  },
  /* AS LEIS DA ÁREA — o segundo bloco, e o mais novo do jogo. */
  laws: {
    title: "As leis desta área",
    hint: "o que elas obrigam, o que autorizam, e quem as protege",
    obliges: "obriga",
    allows: "autoriza até",
    noFloor: "não obriga nada",
    noCeiling: "sem teto",
    /* QUEM PROTEGE A FAIXA. */
    guard: {
      none: "sem lei",
      law: "lei ordinária",
      constitution: "constituição",
    },
    /* O QUE MUDA quando o jogador move uma faixa: ela deixa de ser a lei vigente e passa a
       ser um texto em votação. */
    was: "hoje",
  },
  /* O INSTRUMENTO E ETIQUETA NA LINHA, e nao tela propria. */
  /* `budget` E O QUARTO RITO, e ele é a ausência de um: o orçamento que a lei já autorizou,
     executado por quem foi eleito para executá-lo. */
  instrument: {
    budget: TERMOS.pen,
    law: "lei",
    amendment: "emenda",
    decree: TERMOS.pen,
  },
  instrumentHint: {
    /* ⚠ `budget` FALTAVA AQUI, e o buraco imprimia INGLÊS na tela. */
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
  /* A meta de inflação, o teto e a carga vêm do catálogo e chegam à tela por parâmetro —
     número digitado aqui seria um segundo lugar para a calibragem divergir, e o rótulo é quem
     sempre esquece de ser atualizado. */
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
    interest: "Juros da dívida",
    /* A DISTINCAO QUE O ARCABOUCO FAZ, dita na linha: juro não disputa com hospital — ele
       engorda a dívida. */
    outsideCeiling: "fora do teto",
    debt: "A dívida",
    /* ⚠ O PRÊMIO DE RISCO PRECISAVA APARECER, senão ele seria motor invisível — que é o
       defeito que o ciclo 5 nomeou: sete pessoas decidiam toda votação e nenhuma aparecia. */
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
    /* Sem estas palavras a tela continuaria anunciando "acima do quórum" para uma votação que
       não vai acontecer, que é a terceira vez que este projeto encontra a mesma família de
       defeito. */
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
    /* ⚠ O QUE O PLACAR PROMETE MUDOU DE TEMPO. */
    willFile: "este texto vai para a gaveta",
    forecastLater: "previsão para quando ele chegar ao plenário",
    country: "O que o país entrega",
    agenda: TERMOS.onTable,
    /* ── A GENTE DO CONGRESSO ───────────────────────────────────────────────── ⚠ SETE
       PESSOAS DECIDIAM O PREÇO DE TODA VOTAÇÃO E NENHUMA APARECIA.
       ELENCO gera nome, cargo, ambição e memória; o jogador
       pagava um bloco, a memória do líder mudava o valor em silêncio, e ele nunca
       soube que existia um líder. Motor que o jogador não vê não é profundidade,
       é custo. */
    office: {
      speaker: "presidente da Câmara",
      senate: "presidente do Senado",
      rapporteur: "relator do orçamento",
      leader: "líder de bancada",
    },
    /* ⚠ SÓ UMA DELAS TEM PREÇO HOJE, e a tela não finge o contrário. */
    ambition: {
      succession: "quer o Planalto em 2030",
      cabinet: "quer um ministério",
      state: "quer o governo do estado",
      court: "quer uma vaga no tribunal",
      seat: "quer continuar onde está",
    },
    /* O QUE A AMBIÇÃO DE SUCESSÃO CUSTA, dito onde ela aparece: é o único termo do elenco que
       dinheiro não compra, e o jogador precisa saber disso antes de gastar com ele — não
       depois. */
    successionPrice: "reconhece menos do que recebe",
    /* A MEMÓRIA EM PORTUGUÊS. */
    memoryGood: "negocia como quem já recebeu",
    memoryBad: "cobra a promessa que você não pagou",
  },
  mesa: {
    empty: "Nada em pauta",
    emptyHint: "escolha uma ação numa das áreas — ou avance o mês assim mesmo",
    swap: "trocar",
    needs: "precisa de",
    promises: "promete",
    fits: "cabe",
    /* ⚠ ELA DIZIA O CONTRÁRIO DO MOTOR, e a captura pegou. */
    over: "não cabe — o caixa honra",
    below: "abaixo do quórum",
    above: "acima do quórum",
    decree: "vale sem passar pelo plenário",
    bench: "bancada",
    mood: TERMOS.moodWord,
    result: "resultado",
    funding: "verba",
    seats: TERMOS.of,
    /* ⚠ O QUE A COLUNA DIZ NUM MES SEM PAUTA. */
    leads: "arrasta",
  },
  mood: {
    loyal: TERMOS.loyal,
    obstructing: TERMOS.obstructing,
    broken: TERMOS.ruptured,
  },
  approvalParts: {
    good: "Ótimo/bom",
    fair: "Regular",
    poor: "Ruim/péssimo",
  },
  /* Sao 49 frases nesse estado, e nenhuma delas quebrava nada: elas so faziam a proxima
     sessao acreditar que a peca existia. */
  /* O VEREDITO É POR MOTIVO, e não por nível. */
  verdict: {
    contingency: "O teto fechou: a obrigatória consome o orçamento, e não há emenda a pagar",
    rupture: "Bancada rompida — ela vota contra por menos do que custa trazê-la de volta",
    minority: "A base não chega à maioria; cada voto agora tem preço de leilão",
    obstruction: "Há bancada obstruindo: o governo ainda passa, mas paga pedágio em tudo",
    tight: "Governo em equilíbrio instável — maioria simples, e nada além dela",
    /* Uma revisão externa apontou a frase por estar solta na tela; olhando de perto, o
       defeito era pior — ela afirmava o contrário do resto do Gabinete. */
    comfortable: "Base folgada e o teto ainda abre; a janela não fica aberta muito tempo",
  },
  /* O RELATÓRIO DO MÊS. */
  report: {
    panel: "O mês passado",
    /* O relatório é memória de tela e não entra no save, então quem retoma a partida amanhã
       cai aqui — e um painel em branco ao lado de controles que funcionam lê como defeito,
       não como ausência. */
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
    /* vocabulario de CASCATA, e nao de presidente) e ocupa a segunda linha do unico
       botao que o jogador aperta todo mes. */
    advance: "Avançar o mês",
    /* O BOTÃO DO MÊS PASSADO SAIU. */
    /* ⚠ O BOTAO DO FIM DIZ O QUE ACONTECEU e aponta o que fazer, e a legenda aqui se paga
       pela mesma regra do reinicio: ela chega no momento em que a informacao muda a decisao —
       o jogador acabou de descobrir que nao ha mais mes, e precisa saber que ha outra
       partida. */
    silenceOne: "fecha sem resposta:",
    silenceMany: "perguntas fecham sem resposta",
    ended: "O mandato acabou",
    endedHint: "nova partida, ao pé da coluna",
    restart: "Nova partida",
    /* ── A POSSE ─────────────────────────────────────────────────────────────
       O jogador era a unica pessoa sem nome proprio num jogo em que oito outras tinham,
       e o nome sorteado nao era dele. */
    swearTitle: "Quem toma posse",
    swearName: "Seu nome",
    swearHow: "Como a Casa Civil deve tratá-lo",
    swearSir: TRATAMENTO.senhor.voce,
    swearMadam: TRATAMENTO.senhora.voce,
    swearOk: "Tomar posse",
    swearCancel: "Voltar",
    restartConfirm: "Apagar mesmo?",
    restartConfirmHint: "clique de novo para confirmar",
    close: "Entendi",
  },
  /* A PARTIDA ATRAVESSA O FECHAR DO NAVEGADOR. */
  save: {
    refusedTitle: "A partida anterior não pôde ser retomada",
    refusedBody:
      "O save guardado é de uma versão anterior do jogo e não pode ser convertido sem inventar o que faltava nele. " +
      "Ele foi preservado no navegador, e esta partida começa do primeiro mês.",
  },
  /* O Planalto não tem tela de derrota — a partida JÁ é um mandato de 48 meses, sem vitória e
     sem placar. */
  closing: {
    eyebrow: "a prestação de contas",
    /* O QUE A BARRA SUPERIOR DIZ NO LUGAR DO ANO. */
    ended: "mandato encerrado",
    title: "O mandato",
    months: "meses de mandato",
    /* OS DOIS CARIMBOS. */
    removed: TERMOS.removed,
    removedNote: TERMOS.removedNote,
    served: "MANDATO CUMPRIDO",
    servedNote: "os quatro anos terminaram",
    country: "O país que {v} entrega",
    approval: TERMOS.approval,
    approvalNote: "ótimo e bom",
    debt: TERMOS.grossDebt,
    debtNote: "sobre o PIB",
    written: "O que ficou escrito",
    /* Um mandato sem lei nenhuma é um fato sobre o governo, e a frase diz isso — não deixa um
       espaço vazio que parece defeito de tela. */
    noLaws: "Nenhuma lei foi escrita neste mandato. O país terminou com as regras que {v} recebeu.",
    abandoned: "Abandonaram o governo:",
    noneAbandoned: "Nenhum grupo abandonou o governo.",
  },
  trend: {
    up: "▲",
    down: "▼",
    flat: "—",
  },
};

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
