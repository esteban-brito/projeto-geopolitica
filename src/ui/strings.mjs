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

  /* ⚠ A LEGENDA DO BLOCO E A PONTA DA CORRENTE SAO A MESMA COISA: o bloco onde o jogador poe
     a verba e o no de onde a verba sai. Renomear um sem o outro faria a corrente apontar para
     um bloco que a tela chama de outro nome, na mesma tela. */
  budget: "O orçamento",

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
  seatWord: "cadeira",
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
  /* ⚠ O PONTO PERCENTUAL E A UNIDADE DA RUA, e ela e dita na barra do topo e no parecer da
     pasta — duas telas, a mesma grandeza. */
  point: "ponto",
  points: "pontos",
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
  /* ⚠ A MESA E O FECHO JULGAM A MESMA PROMESSA, e por isso o veredito e uma palavra so: duas
     copias diriam "quebrada" no mes 6 e "nao cumprida" no mes 48 sobre o mesmo compromisso. */
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
    /* ⚠ A CAIXA GANHOU ENDERECO PROPRIO, e a palavra e dele: "quero que sejam EMAIL,
       exatamente igual a um EMAIL". O Gabinete que sobrou e o painel — o que o pais esta —, e
       o email e o que o mundo diz. Duas perguntas diferentes disputavam a mesma tela. */
    email: "Email",
    congress: "Congresso & Leis",
    finance: TERMOS.finance,
    ministries: "Ministérios",
    estado: TERMOS.estado,
    /* O ponto do rail tem rotulo porque cor sozinha nao e leitura. A queda e de `initial`,
       e nao do nivel: e por isso que a frase fala em CAIU, e nao em "baixo". */
    watch: "Caiu 10 pontos ou mais desde a posse",
    alert: "Caiu 20 pontos ou mais desde a posse",
    /* ⚠ `street`, `backstage` E `pending` SAIRAM COM AS DUAS ENTRADAS CINZAS DO MENU. Elas
       prometiam duas telas que nao existem, e frase declarada sem quem a alcance e o que esta
       guarda existe para pegar — deixa-las aqui seria a promessa sobrevivendo a retirada. */
  },
  /* O GABINETE — a tela inicial, e a unica que so resume. */
  cabinet: {
    title: TERMOS.cabinet,
    /* ⚠ A ESPERA E DITA, e nao escondida. */
    /* ⚠ SAO DOIS ESTADOS VAZIOS DIFERENTES, e so um deles existe hoje. */
    inboxSigned: "Todo mês que você resolve chega aqui, assinado pela Casa Civil.",
    inboxWaiting:
      "O que ainda não chega é o resto da república: o líder que cobra a diretoria prometida, a lei que o relator devolveu mudada, o tribunal que derrubou o que passou. Quem escreve primeiro é a tramitação.",
    baseLine: "Apoiam o governo",
    congressAction: "negociar",
    vaultFree: TERMOS.roomLine,
    /* OS TRES NOMES DIZEM QUEM ABANDONA, e nao uma imagem. */
    trinity: {
      social: TERMOS.social,
      economic: TERMOS.economic,
      political: TERMOS.political,
    },
    /* O LADO EM QUE CADA UMA ROMPE, e ele vem do motor: a social rompe quando CAI, as outras
       duas quando SOBEM. */
    trinityBelow: "abaixo de",
    trinityAbove: "acima de",
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
    /* ⚠ "MAIS PERTO DE", E NÃO "É": dizer "seu governo é de centro-esquerda" importaria uma
       taxonomia que o modelo não tem. Dizer de quem ele se aproxima é a mesma distância
       euclidiana que ECLUSA usa para votar. */
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
    /* ⚠ ELA SUBSTITUI O TITULO DA TELA, por ordem dele: "Gabinete" ocupava uma faixa inteira
       para dizer o nome de uma tela que o rail ja marca, e a legenda que sobrou nomeia a peca
       que o jogador de fato usa. */
    title: "Caixa de entrada",
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
    /* ⚠ ELE AVISA ANTES, e o tempo verbal é a correção: a condição do motor era `!X && X` e a
       carta nunca saiu. Agora ela sai no mês em que o teto AINDA está aberto, porque
       informação que chega depois da decisão é recibo. */
    ceilingSubject: "O teto do arcabouço fecha no mês que vem",
    ceilingBody:
      "O gasto do ano vai encostar no limite da regra. Com ele fechado não há discricionário para emenda — e sem emenda a base não se compra de volta.",
    ceilingNote: "o que sobra para o mês:",
    /* ⚠ ELA ANUNCIA O PRAZO, e é a metade que faltava do A3: o decreto já escolhe quem o corte
       poupa, e o jogador descobria o corte pela bolsa encolhida — nunca pela data que o decide.
       ⛔ E ELA NÃO DIZ "rateio": o jogador vê o dinheiro sumir, e a palavra do motor não
       explica nada a quem está decidindo onde ele some. */
    contingencySubject: "O relatório bimestral fecha no mês que vem",
    contingencyBody:
      "O balanço do bimestre é publicado, e é nele que se decide o contingenciamento. Se você proteger uma área do corte, o corte cai mais fundo nas outras.",
    contingencyLegend: "O corte deste mês",
    contingencyNote: "quanto do pedido o mês pagou:",
    minoritySubject: "O governo perdeu a maioria",
    minorityBody: "As cadeiras que respondem ao governo caíram abaixo da maioria simples.",
    /* ⚠ ELA ERA UMA COSTURA ENTRE DOIS NUMEROS — "436 de 513, e a maioria fecha em 257" — e os
       dois viraram cards. Sobrou o denominador, que qualifica o primeiro. */
    quietMonth: "Nenhum texto foi a plenário neste mês.",
    ruptureLegend: "O que falta para abrir o processo",
    /* O QUORUM DA LEI COMUM, e ele e o mesmo TERMO que a Camara usa no Gabinete. */
    /* ⚠ AS CINCO FRASES SAO NEUTRAS EM NUMERO, e o defeito era consumado:
       elas foram escritas para nomes de grupo no singular — "O mercado passou do ponto" — e os
       nomes viraram plurais quando o vocabulario deixou de ser metafora. A tela imprimia
       "Parlamentares passou do ponto" e "e ele carrega 30%". Nenhuma guarda alcanca
       concordancia; o conserto e nao depender dela. */
    boilingSubject: "rompeu com o governo:",
    boilingBody: "A pressão passou do ponto de fervura, e o apoio ao governo acabou.",
    boilingNote: "ponto de fervura",
    /* ── AS LEGENDAS DOS BLOCOS ─────────────────────────────────────────────── ⚠ TODO ANEXO
       E UM BLOCO COM LEGENDA, e a padronizacao e dele: "blocos dentro de blocos, tudo
       identico". O que fica FORA de bloco e so a abertura da mensagem. */
    /* ⚠ NEUTRA DE PROPOSITO: o MESMO bloco serve a exigencia e a fervura, e "o grupo que
       exige" mentia na carta em que ele nao exige nada — ele rompeu. O nome do grupo ja esta
       no assunto das duas. */
    blockGroup: "o que este grupo pesa",
    blockRuptures: "o que falta para cada ruptura",
    blockChamber: "a Câmara neste mês",
    /* ⚠ "Se compram" e a palavra do jogador, e nao "venalidade": a pergunta que ela responde
       e _quantos destes me abandonam quando eu parar de pagar?_ Ela e QUALIFICADOR do nome, e
       nao linha propria — linha propria estourou a coluna em 557 contra 518. */
    baseBought: "se compram",
    /* ⚠ O PLACAR JA ESTAVA NO SAVE, no cartao do mes, e a carta ao lado chegava vazia: o
       jogador escrevia uma lei, esperava dois meses e lia "o plenario derrubou" sem saber se
       faltaram tres votos ou noventa. As duas leituras pedem jogadas opostas. */
    blockPlenary: "como o plenário votou",
    blockVotes: "Votos a favor",
    blockQuorum: "Para passar",
    blockMissed: "faltaram",
    blockSpare: "sobraram",
    blockProcess: "o processo de afastamento",
    blockInherited: "o que {v} recebe",
    /* ⚠ A DISTANCIA E O QUE DECIDE, e nao o valor cru: "faltam 28" responde a pergunta que o
       jogador faz olhando a carta, e o valor sozinho obriga a conta de cabeca. */
    blockMissing: "faltam",
    blockOpen: "rompeu",
    boilingPressure: "Pressão do grupo",
    boilingWeight: "Peso na ruptura econômica",
    boilingNoWeight: TERMOS.noWeight,

    /* ── OS TRES RELATORIOS DO MES ──────────────────────────────────────────── ⚠ ELES CHEGAM
       POR TEMPO, e nao por evento — sao a unica especie assim. */
    /* AS CINCO NOTAS SAO AS DE `SONDA`, e os nomes sao os que o jogador usa. "Carestia" e
       nao "inflacao" porque quem sente preco no supermercado nao chama de indice; "ordem"
       e nao "seguranca" porque a area ja se chama Seguranca e o mesmo nome em dois papeis
       e o defeito que a guarda `vocabulary` existe para pegar. */
    annexLegend: "o humor de cada classe, e o que pesa nela",
    annexNote: {
      prices: "carestia",
      jobs: "emprego",
      services: "serviços",
      safety: "ordem",
      economy: "economia",
    },
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
    /* ⚠ O ROTULO DEIXOU DE PROMETER A LISTA INTEIRA, e a carta deixou de traze-la: quem lista
       bancada por bancada e a tela do Congresso. */
    annexSeats: "quem se moveu neste mês",
    annexSeatsRest: "e mais",
    /* ⚠ OS DOIS DESCONTOS PESAM IGUAL EM TODA CLASSE, e por isso eles ficam no PE e nao numa
       coluna: credibilidade nao tem classe, e desgaste de cargo tambem nao. */
    annexDiscounts: "o que desconta de todas",
    annexDiscount: {
      betrayal: "credibilidade quebrada",
      wear: "desgaste do cargo",
    },
    /* ── O ANEXO DO BALANCO ─────────────────────────────────────────────────── ⚠ ELE E A
       TABELA QUE TORNA OS TRES AVULSOS DISPENSAVEIS NO MES CALMO: antes e depois das tres
       leituras, lado a lado. */
    annexBalance: "o mês em três leituras",
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
    /* ⚠ NADA AQUI É INVENTADO: o número e a direção vêm da carta, e a nota que mais sustenta
       e a que menos sustenta vêm de `weighed` e `notes`. Recomendação sem número atrás
       seria o modelo opinando, e isso o projeto recusa. */
    pollClosed: "A pesquisa fechou o mês em",
    pollGood: "de ótimo ou bom",
    pollDown: "abaixo do mês passado.",
    pollUp: "acima do mês passado.",
    pollPoint: TERMOS.point,
    pollPoints: TERMOS.points,
    /* ⚠ AS CINCO VIRARAM DUAS: elas eram os pedacos de duas FRASES coladas em
       volta de um numero — "O que sustenta o senhor é economia, e é na Alta renda que ela pesa
       mais" —, e as duas leituras desceram para cards. Num card a legenda nomeia e o valor
       responde, entao a costura da frase deixou de existir. */
    pollHolds: "O que sustenta",
    pollDrags: "O que puxa para baixo",
    seatsBody: "As cadeiras que respondem ao governo fecharam o mês em",
    /* ⚠ O 513 ESTAVA TECLADO AQUI E NA CARTA DA MINORIA, com o motor tendo o numero ao lado:
       a carta do cerco ja o lia de `boilerOf`. Duas frases digitadas mentiriam no dia em que
       a Camara mudasse de tamanho. */
    of: TERMOS.of,
    /* ⚠ "para" e nao "de": a linha diz quantas cadeiras FALTAM PARA o quorum, e "faltam de
       257" le como se 257 fosse a origem da conta. */
    forWord: "para",
    seatsMajority: ", e a maioria simples fecha em",
    /* ⚠ A UNIDADE E CADEIRA, e a carta dizia "11 pontos" reusando o rotulo da PESQUISA. */
    seat: TERMOS.seatWord,
    seats: TERMOS.seatsWord,
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
    /* ⚠ O PLURAL SAIU PORQUE ELE ERA INALCANCAVEL: medido em 48 meses, `left` devolve 0 ou 1
       e mais nada — o prazo e de dois meses e a carta so aparece no mes seguinte ao que a
       escreveu. Ver `urgencyOf`, que perdeu a terceira faixa pela mesma medicao. */
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
    /* ── O DISCURSO DE POSSE — a primeira pergunta do mandato ────────────────
       ⚠ ELA RESOLVE O MÊS 1 TER ZERO DECISÕES: o botão desta carta era `ver o mês`, que é
       navegação. Agora ela pergunta o que este governo veio fazer — e pergunta com o NOME do
       compromisso, não com a frase inteira: "entregar ordem acima do que recebi" repete o que
       o eixo já diz, e a carta ficou 60px mais alta do que a folha comporta por causa disso.
       ⚠ E NÃO RESPONDER É UMA RESPOSTA, e não um muro: quem avança calado governa sem
       plataforma — e termina o mandato sem nada contra o que ser medido. */
    pledgePriority: "A prioridade",
    pledgeFiscal: "A meta fiscal",
    pledgeReform: "A reforma",
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
    programs: TERMOS.budget,
    thisArea: "esta área",
    outlook: "Para onde vai",
    /* O horizonte e escrito por extenso porque "24m" ao lado de um indice le como unidade do
       indice. */
    inMonths: (/** @type {number} */ months) => `em ${months} meses`,
    /* ⚠ A PREMISSA E DITA, e nao subentendida: a curva nao roda votacao. */
    frozen: "sem votação no período",
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
  /* ── A CORRENTE — o que move este índice, e o que ele move ────────────────
     ⚠ ELA FALA EM LINGUAGEM DE JOGADOR, e o motor fala em `yield`, `force` e `lag`: "R$ 1 bi
     rende 0,64" é a mesma coisa que `yield: 0.6358`, e só a primeira responde a alguém que
     está decidindo quanto pôr na Segurança. */
  chain: {
    title: "A corrente",
    hint: "de onde vem, e para onde vai",
    /* ⚠ SEM ARTIGO E SEM O NOME DO ÍNDICE, e a razão é gramatical: sete dos oito índices são
       femininos e "atendimento" não é, e uma legenda montada com artigo diria "o que move a
       atendimento" na Saúde. */
    into: "O que move este índice",
    out: "O que este índice move",
    /* AS DUAS PONTAS DE DENTRO: a verba que entra, e o que vaza sozinho. */
    budget: TERMOS.budget,
    perBillion: (/** @type {string} */ points) => `R$ 1 bi rende ${points}`,
    decay: "O desgaste",
    half: (/** @type {number} */ months) => `metade em ${months} meses`,
    /* Uma área que não vaza não existe no catálogo de hoje; a frase existe para o dia em que
       existir, e para a peça nunca imprimir "metade em Infinity meses". */
    forever: "não se desgasta",
    /* O ATRASO É A METADE DA CORRENTE QUE NINGUÉM VÊ: a educação leva 24 meses para chegar à
       indústria, e o mês em que ela chega não é o mês em que se gastou.
       ⚠ E A SAÍDA NÃO PROMETE FUTURO: o valor ao lado é o que está chegando HOJE, vindo do
       índice de 24 meses atrás. "Chega em 24 meses" faria o número ler como previsão, e ele
       é medição — o defeito que a captura pegou antes de o bloco entrar.
       ⚠ E O CASO ZERO É FRASE PRÓPRIA: duas áreas do catálogo agem no mês em que se gasta. */
    lagged: (/** @type {number} */ months) => `com ${months} meses de atraso`,
    prompt: "no mesmo mês",
    came: (/** @type {number} */ months) => `de ${months} meses atrás`,
    cameNow: "deste mês",
    /* OS DOIS CANAIS QUE NÃO SÃO ÁREA — e é assim que o orçamento os chama. */
    channel: {
      revenue: "A receita",
      mandatory: "A despesa obrigatória",
      capacity: "A capacidade",
    },
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
    ofGdp: "do PIB",
    missing: "abaixo da banda",
    interest: "Juros da dívida",
    /* A DISTINCAO QUE O ARCABOUCO FAZ, dita na linha: juro não disputa com hospital — ele
       engorda a dívida. */
    outsideCeiling: "fora do teto",
    debt: "A dívida",
    /* ⚠ O PRÊMIO DE RISCO PRECISAVA APARECER, senão ele seria motor invisível — que é o
       defeito que o ciclo 5 nomeou: o elenco decidia toda votação e nenhum nome aparecia. */
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
    ambition: {
      succession: "quer o Planalto em 2030",
      cabinet: "quer um ministério",
      state: "quer o governo do estado",
      court: "quer uma vaga no tribunal",
      seat: "quer continuar onde está",
    },
    /* A pasta entra no lugar do genérico quando o motor a nomeia. */
    cabinetOf: "quer o ministério da",
    /* O QUE CADA AMBIÇÃO CUSTA, dito onde ela aparece: o jogador precisa saber disso antes de
       gastar com o sujeito — não depois. */
    /* ⚠ CURTAS PORQUE ELAS SE REPETEM: com oito pessoas e cinco ambições, a semente de
       abertura dá quatro `state` — e a captura mostrou quatro linhas iguais de 45 caracteres,
       uma debaixo da outra. Encurtar é o que a tela pode fazer; o resto é o sorteio. */
    ambitionPrice: {
      succession: "reconhece menos do que recebe",
      cabinet: "barateia se a pasta receber",
      state: "emenda vale mais para ele",
      court: "dinheiro o move pouco",
      seat: "segue a sua aprovação",
    },
    /* A MEMÓRIA EM PORTUGUÊS. */
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
  /* O VEREDITO É POR MOTIVO, e não por nível. */
  verdict: {
    blocked: "O teto fechou: a obrigatória consome o orçamento, e não há emenda a pagar",
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
    blocked: "o teto fechou: a obrigatória sozinha já fura o arcabouço",
    country: TERMOS.country,
  },
  actions: {
    /* ⚠ UMA LEGENDA SÓ SE PAGA QUANDO DIZ O QUE O RÓTULO NÃO DIZ. "Avançar o mês" seguido
       de "resolve o turno e propaga os efeitos" falhava nos dois lados: repetia o rótulo em
       jargão de motor ("propagar" é vocabulário de CASCATA, e não de presidente) e ocupava
       a segunda linha do único botão que o jogador aperta todo mês. */
    advance: "Avançar",
    /* O BOTÃO DO MÊS PASSADO SAIU. */
    /* ⚠ O BOTAO DO FIM DIZ O QUE ACONTECEU e aponta o que fazer, e a legenda aqui se paga
       pela mesma regra do reinicio: ela chega no momento em que a informacao muda a decisao —
       o jogador acabou de descobrir que nao ha mais mes, e precisa saber que ha outra
       partida. */
    /* ⛔ O SUBSTANTIVO SAIU E O VERBO FICOU: a coluna da legenda tem 185px, e
       "7 perguntas fecham sem resposta" pedia 226. O que a legenda existe para dizer e o
       PRECO de avancar, e o preco esta no verbo. */
    silenceOne: "fecha sem resposta",
    silenceMany: "fecham sem resposta",
    ended: "O mandato acabou",
    restart: "Nova partida",
    /* ── A POSSE ─────────────────────────────────────────────────────────────
       O jogador era a unica pessoa sem nome proprio num jogo em que oito outras tinham,
       e o nome sorteado nao era dele. */
    swearTitle: "Quem toma posse",
    swearName: "Seu nome",
    swearParty: "Seu partido",
    swearPartyEmpty: "escolha uma bancada",
    /* A frase diz a REGRA, e não o efeito: o efeito o jogador lê na tela do Congresso, onde a
       sua bancada aparece marcada. */
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
  /* A PARTIDA ATRAVESSA O FECHAR DO NAVEGADOR. */
  save: {
    refusedTitle: "A partida anterior não pôde ser retomada",
    refusedBody:
      "O save guardado é de uma versão anterior do jogo e não pode ser convertido sem inventar o que faltava nele. " +
      "Ele foi preservado no navegador, e esta partida começa do primeiro mês.",
  },
  /* O jogo não tem tela de derrota — a partida JÁ é um mandato de 48 meses, sem vitória e
     sem placar. */
  closing: {
    eyebrow: "a prestação de contas",
    /* O QUE A BARRA SUPERIOR DIZ NO LUGAR DO ANO. */
    ended: "mandato encerrado",
    /* ⚠ QUANTOS FALTAM, e a faixa nunca disse: ela anunciava o ANO e o jogador nao tinha como
       saber se uma reforma de 24 meses ainda cabia no que sobrava. */
    /* O PRAZO QUE VENCE NESTE MES: ele nao tem numero, e escrever "0 meses" seria pior
       que nao dizer nada. */
    now: "agora",
    monthLeft: `${TERMOS.month} restante`,
    monthsLeft: `${TERMOS.months} restantes`,
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
    /* ── O QUE FOI PROMETIDO, E O QUE FOI ENTREGUE ────────────────────────────
       ⚠ ELE É O CRITÉRIO QUE O FECHO NUNCA TEVE: até aqui ele mostrava de-onde-para-onde, e
       de-onde-para-onde sem promessa não é julgamento — é extrato. */
    promised: "O que {v} prometeu",
    kept: TERMOS.kept,
    broken: TERMOS.broken,
    /* Não prometer nada é uma escolha, e o preço dela aparece aqui: um mandato sem nada
       contra o que ser medido. */
    noPledges:
      "Nenhum compromisso foi assumido na posse. O mandato terminou sem nada contra o que ser medido.",
    written: "O que ficou escrito",
    /* Um mandato sem lei nenhuma é um fato sobre o governo, e a frase diz isso — não deixa um
       espaço vazio que parece defeito de tela. */
    noLaws: "Nenhuma lei foi escrita neste mandato. O país terminou com as regras que {v} recebeu.",
    abandoned: "Abandonaram o governo:",
    noneAbandoned: "Nenhum grupo abandonou o governo.",
  },
  /* 📗 O PARECER — a exposicao de motivos que a Casa Civil junta a minuta, e ela e a face
     esquerda da pasta de despacho. ⛔ O vocativo NAO leva "Excelentissimo": o Decreto
     9.758/2019 o vedou, e o Manual de Redacao e de 2018. */
  brief: {
    city: "Brasília",
    unit: "Secretaria Especial de Análise Governamental",
    /** @param {number} number @param {number} year */
    kind: (number, year) => `EXPOSIÇÃO DE MOTIVOS Nº ${number}/${year}/CC`,
    vocative: "Senhor Presidente da República,",
    lead: "Submeto à sua decisão o corte deste mês. Abaixo, o que a Casa Civil apurou.",
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
    /** ⚠ O CARGO CONCORDA COM QUEM ASSINA: o elenco sorteia homem e mulher na mesma
     * proporcao, e "Ministro" sob o nome de uma ministra e o mesmo defeito que o tratamento
     * do presidente ja consertou.
     * @param {boolean} she */
    role: she => `${she ? "Ministra" : "Ministro"} de Estado Chefe da Casa Civil`,
  },
  /* O ENVELOPE — para quem le por som; na tela ele e um objeto, e o vermelho e o prazo. */
  envelope: {
    waiting: "Carta na mesa. Abrir a Caixa.",
    due: "Carta que vence este mês. Abrir a Caixa.",
  },
  /* O TELEFONE — as duas frases sao para quem le por som; na tela ele e so um objeto. */
  phone: {
    /* O numero no quadro do aparelho: inventado, como toda pessoa deste jogo — e nao o do
       Planalto real. Prefixo que nao existe na lista da Anatel. ⚠ SEM DDD: o cartao da foto
       tem 52px de largura, e com "(61) " o numero quebrava em duas linhas a 8,5px. */
    number: "2027-0148",
    quiet: "Telefone. Ninguém ligou.",
    /** @param {string} who */
    ringing: who => `O telefone toca: ${who} rompeu com o governo. Abrir a carta.`,
  },
  /* 📗 O DECRETO — a forma e do governo e a escrita e do jogo. O que NAO se simplifica e o
     que todo brasileiro reconhece: "entra em vigor na data de sua publicacao". */
  decree: {
    presidency: "Presidência da República",
    chief: "Casa Civil",
    legal: "Subchefia para Assuntos Jurídicos",
    /** @param {string} date */
    title: date => `DECRETO DE ${date.toUpperCase()}.`,
    summary: "Diz quanto cada ministério pode gastar este mês, e quais não entram no corte.",
    preamble:
      "O PRESIDENTE DA REPÚBLICA, no uso da atribuição que lhe dá o art. 84 da Constituição,",
    enacts: "D E C R E T A :",
    /** @param {string} room @param {string} share */
    first: (room, share) =>
      `Art. 1º  O mês tem ${room} para gastar. Os ministérios recebem ${share} do que pediram.`,
    second:
      "Art. 2º  Ficam fora do corte as pastas marcadas. O que elas deixarem de ceder, as outras pagam:",
    third: "Art. 3º  Este Decreto entra em vigor na data de sua publicação.",
    /** @param {string} date @param {number} independence @param {number} republic */
    close: (date, independence, republic) =>
      `Brasília, ${date}; ${independence}º da Independência e ${republic}º da República.`,
    gazette: "Este texto não substitui o publicado no Diário Oficial da União.",
  },

  trend: {
    up: "▲",
    down: "▼",
    flat: "—",
  },
};

/* 📗 OS MESES POR EXTENSO, e eles moram aqui porque sao TEXTO DE INTERFACE: o motor guarda o
   indice, e o Manual de Redacao manda a data com o mes em MINUSCULA e sem zero a esquerda. */
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
