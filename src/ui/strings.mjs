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
  /* ⚠ ELA VIROU TERMO EM 20/08/2026, quando a fita do plenário passou a nomear a
     linha que ela desenha. A mesma frase já era o RITO de quórum de uma lei
     ordinária — e as duas nomeiam o mesmo limiar da Constituição: se um dia ele
     mudar de nome, muda nos dois lugares ou o jogo passa a ter dois nomes para a
     mesma linha. */
  /* ⚠ RECUSAR E O MESMO ATO NAS DUAS CHANTAGENS, e por isso a palavra e uma so. O
     grupo de capacidade pede verba de volta e o mercado pede corte — os dois lados de
     CEDER sao opostos e tem frases proprias —, mas dizer nao a um lobby e dizer nao a
     um lobby, e a consequencia e identica: ele esquenta. A guarda `vocabulary` acusou
     a copia no primeiro `check`, e ela estava certa. */
  refuse: "Recusar",
  refuseCost: "o grupo esquenta, e a caldeira não esfria depressa",

  simpleMajority: "maioria simples",

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

  /* ⚠ APROVAR E DERRUBAR SAO O MESMO MOTIVO DE CHEGADA, e a guarda `vocabulary` cobrou
     a copia no primeiro `check`. O DESFECHO das duas cartas e oposto — uma diz que passou,
     outra que caiu —, mas a pergunta "por que isto chegou na minha caixa" tem uma resposta
     so: o plenario julgou um texto que voce assinou. Duas copias divergiriam no dia em que
     alguem ajustasse uma delas, e ai o jogo passaria a ensinar duas mecanicas onde ha uma. */
  plenaryJudged: "o plenário votou um texto que você assinou",

  /* ⚠ CINCO ROTULOS SUBIRAM PARA CA EM 21/08/2026, e todos pela mesma razao: o ANEXO da
     carta passou a mostrar as mesmas grandezas que Financas e a Mesa ja nomeavam. A guarda
     `vocabulary` cobrou as cinco copias no primeiro `check`, e ela estava certa por um
     motivo que vale mais que a duplicacao — **a carta e a tela dizem o MESMO numero**, e
     no dia em que um deles mudasse de nome o jogador leria dois nomes para a mesma linha
     do orcamento. */
  mandatorySpend: "Despesa obrigatória",
  ceilingRule: "Teto do arcabouço",
  seatsWord: "cadeiras",
  moodWord: "humor",
  perMonthWord: "no mês",
  revenueWord: "Receita",

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

/**
 * O ROTULO DE UMA CHAVE, com o proprio id como reserva.
 *
 * ⚠ ELA MOROU EM TRES TELAS AO MESMO TEMPO ate 21/08/2026 — `area.mjs`, `mesa.mjs` e
 * `report.mjs`, corpo por corpo identicas —, e a quarta ia nascer na Caixa de Entrada.
 * Tres copias e sorte; quatro e sistema. Ela sobe para ca porque o que ela protege e um
 * contrato do VOCABULARIO: chave que nao existe na tabela sai como o proprio id.
 *
 * E ESSA RESERVA E A RAZAO DE ELA EXISTIR, e nao economia de digitacao: `instrument`,
 * `guard` e `kind` sao texto vindo do CATALOGO, e catalogo e dado que gente edita. Um
 * valor novo digitado errado tem de aparecer cru na tela — feio, visivel, consertavel —
 * e nao derrubar a pintura inteira com `undefined`.
 *
 * @param {Record<string, string>} table
 * @param {string} key
 * @returns {string}
 */
export function labelOf(table, key) {
  return table[key] ?? key;
}

export const UI = {
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
    title: TERMOS.cabinet,
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
    /* ⚠ A NOTA VIROU DUAS FRASES EM 21/08/2026, e a divisão é de VERDADE e não de
       estilo. A primeira metade — "todo mês que você resolve chega aqui" — é uma
       PROMESSA, e ela só pode ser dita a quem ainda não resolveu mês nenhum: dita ao
       lado de uma bandeja vazia depois de três meses resolvidos, ela é o texto negando
       o que o jogador acabou de fazer. A segunda metade declara o que o MUNDO ainda não
       escreve, e essa continua verdadeira nos dois casos. */
    inboxSigned: "Todo mês que você resolve chega aqui, assinado pela Casa Civil.",
    inboxWaiting:
      "O que ainda não chega é o resto da república: o líder que cobra a diretoria prometida, a lei que o relator devolveu mudada, o tribunal que derrubou o que passou. Quem escreve primeiro é a tramitação.",
    /* ── A CHAVE DA FITA DO PLENÁRIO — ver `ribbon.mjs` ──────────────────────
       ⚠ OS DOIS POLOS SÃO O VOCABULÁRIO DO CATÁLOGO, e não uma escala nova: a prosa
       de `parties.mjs` declara o eixo com estas palavras — "0 é máxima intervenção,
       100 é máximo mercado". Escrever "esquerda" e "direita" aqui importaria uma
       taxonomia que o modelo não tem: ele tem DUAS dimensões, e reduzir as duas a uma
       palavra de uma delas seria a tela afirmando o que o motor não afirma. */
    /* ⚠ A FRASE DO LEITOR DE TELA MORA AQUI, e não na view — a guarda `naming` a
       expulsou de `ribbon.mjs` e estava certa por uma razão que vale além dela: quem
       lê a fita por som recebe a MESMA descrição que o olho recebe, e uma descrição
       escrita dentro do desenho é a única frase da interface que ninguém revisa. */
    ribbonRead: "cadeiras respondem ao governo, em",
    ribbonBenches: "bancadas ordenadas da maior intervenção ao maior mercado; a maioria fecha em",
    axisLeft: "intervenção",
    axisRight: "mercado",
    majority: TERMOS.simpleMajority,
    congressAction: "negociar",
    vaultFree: "cabe no mês",
    vaultLocked: "obrigatória",
    /* ⚠ SEIS PALAVRAS VIRARAM UMA EM 21/08/2026. A frase inteira era "o orçamento escrito
       já consome", e ela explicava o que o número ao lado dela já dizia. O responsável
       pediu o corte da linha; a medição mostrou que o NÚMERO não podia sair — ele é
       `committed`, e o hero é `room` — e o que sobrou para cortar foram as palavras.

       ⚠ E A PRIMEIRA PALAVRA ESCOLHIDA FOI "escrito", E UMA PROVA A DERRUBOU EM DOIS
       MINUTOS — com razão, e por um defeito que eu não teria visto lendo a tela: a frase
       do ESTOURO, uma linha abaixo, é "o orçamento ESCRITO passa do que cabe em". A
       palavra curta virou substring da frase longa, e a prova que garante que o estouro
       não repete o total passou a acusar repetição onde não havia. O defeito é real
       mesmo fora do teste: duas leituras vizinhas passariam a abrir com a mesma palavra.

       "comprometido" É A PALAVRA QUE A INTERFACE JÁ USA para este número — a carta da
       Casa Civil diz "o que sobra para o mês, depois do que já está comprometido". Usar
       a que já existe é o oposto de inventar um segundo nome para a mesma coisa, que é o
       que a guarda `vocabulary` existe para pegar. */
    vaultTaken: "comprometido",
    /* ⚠ ELE DIZ O EXCESSO, e nao repete o total. "já consome R$ 14,5 bi" logo
       abaixo de "cabe R$ 14,2 bi" obriga o jogador a subtrair de cabeca para
       descobrir a unica coisa que importa — e a subtracao e trabalho da tela. */
    vaultOver: "o orçamento escrito passa do que cabe em",
    seats: "de 513",
    /* A LEGENDA DO ARCO. Tres cores sem chave e um grafico que so o autor lê —
       e este arco passou um dia inteiro assim, com as fatias certas e ninguem
       sabendo o que elas diziam. */
    /* ⚠ A RESPOSTA A PERGUNTA QUE O JOGADOR FAZ PRIMEIRO. Ele olha "obrigatória
       95%" e pergunta por quê; a resposta do Planalto e diferente da que ele
       espera — nao e falta de caixa, e excesso de TEXTO, e cada real preso tem uma
       norma com nome e hierarquia atras dele. */
    /* ⚠ ELE VIROU VERBO EM 21/08/2026. Era o rótulo "e quem trava", em caixa alta, acima
       de uma lista de três; com a lista reduzida ao maior, um título acima de um item só
       é cabeça de parágrafo — e a regra do Gabinete desde 20/08 é que um bloco não diz o
       próprio nome. "Aposentadoria urbana TRAVA R$ 66,7 bi" é uma sentença, e sentença
       carrega sozinha o que o rótulo carregava. */
    vaultWho: "trava",
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
    /* AS TRÊS RUPTURAS, e o processo só abre com as três juntas — presidentes não
       caem por um fator só. */
    ruptureSocial: TERMOS.social,
    ruptureEconomic: TERMOS.economic,
    rupturePolitical: TERMOS.political,
    /* ⚠ `ruptureNone` MORREU EM 20/08/2026 — "nenhuma ruptura aberta". Ela saía todo
       mês em que nada acontecia, que é a maioria dos meses de um governo que funciona, e
       ensinava o olho a pular a linha onde a ruptura de verdade vai aparecer. A razão
       inteira está em `boilerCardHtml`. */
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
    /* ⚠ A FATIA DO CAPITAL, e ela substituiu a frase de desejo em 21/08/2026. A palavra
       é a MESMA que a Trindade usa duas peças acima — `TERMOS.economic` —, porque é
       literalmente a barra dela que estes quatro repartem. Chamar de "capital" aqui e de
       outra coisa ali daria dois nomes ao mesmo limiar do motor, que é exatamente o que a
       guarda `vocabulary` existe para pegar. */
    boilerShare: `do ${TERMOS.economic.toLowerCase()}`,
    /* ⚠ E O PESO ZERO PRECISA DE FRASE PROPRIA, e não de "0%". Um zero ao lado de uma
       régua cheia lê como defeito de carregamento — foi exatamente o erro que o hero do
       Cofre já cometeu uma vez, com "R$ 0,0 bi livre no mês". As forças de ordem não são
       um grupo sem pressão: são um grupo cuja pressão não move esta ruptura, e a frase
       tem de dizer isso em vez de imprimir um algarismo que nega a barra ao lado. */
    boilerNoShare: `não pesa no ${TERMOS.economic.toLowerCase()}`,
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
    /* ⚠ AS DUAS ENTRARAM EM 21/08/2026, e elas sao a metade que faltava do BALANCO.
       A carta da Casa Civil chegava todo mes com UMA leitura — a rua — enquanto tres
       relatorios avulsos escreviam as outras duas do lado dela, todo mes, com o mesmo
       numero. Reunidas aqui, a carta do mes passou a ser o que o nome dela diz, e os
       avulsos voltaram a ser o mes fora da curva. */
    base: "a base fechou o mês em",
    vault: "e o que sobra para o mês, em",
    seeMonth: "ver o mês",
    /* ⚠ O VAZIO MUDOU DE FRASE quando a primeira carta passou a existir. Ele dizia
       "a mesa ainda não recebe correspondência", e isso deixou de ser verdade no
       instante em que o mês passou a cair aqui — o que é verdade agora é mais
       simples: nenhum mês foi resolvido ainda. A declaração do que AINDA falta
       (Congresso, relator e tribunal escrevendo) continua na nota abaixo, porque
       ela continua sendo o estado real do projeto. */
    firstLead: "O primeiro mês ainda não foi resolvido",
    /* ⚠ E ELA GANHOU UMA IRMÃ EM 21/08/2026, porque a frase acima passou a MENTIR num
       caso real que o responsável fotografou: recarregar a página com partida salva
       zera a bandeja — `last`, o relatório do mês, é variável de módulo e não vai para
       o save —, e a tela dizia "o primeiro mês ainda não foi resolvido" em junho de
       2027, com três meses resolvidos atrás.

       ⚠ NÃO É A MESMA AUSÊNCIA, e por isso não é a mesma frase. Uma diz "o jogo ainda
       não começou a te escrever"; a outra diz "não há nada aguardando você agora". A
       segunda é a única verdadeira depois do mês 1, e a regra deste projeto é que
       ausência se declara — não que se declare qualquer coisa. */
    quietLead: "Nada espera resposta",
    /* ── O TETO, A MINORIA E A FERVURA ────────────────────────────────────────
       ⚠ AS TRES CHEGARAM EM 21/08/2026 e as tres dizem uma TRAVESSIA, e nunca um estado:
       o mês em que o chão cedeu, e não os meses em que ele já estava cedido. Um aviso por
       mês de estado empilharia trinta cartas idênticas — o mural que a caixa deixou de
       ser em 16/08.

       E NENHUMA DELAS INVENTA NÚMERO: o teto, a maioria e o ponto de fervura são do
       motor, e a frase é montada em volta deles. */
    ceilingSubject: "O teto do arcabouço fechou",
    ceilingBody:
      "O gasto do ano encostou no limite da regra. Enquanto ele estiver fechado não há discricionário para emenda — e sem emenda a base não se compra de volta.",
    ceilingNote: "o que sobra para o mês:",
    minoritySubject: "O governo perdeu a maioria",
    minorityBody: "As cadeiras que respondem ao governo caíram abaixo da maioria simples.",
    minorityNote: "de 513, e a maioria fecha em",
    /* ⚠ O ASSUNTO DA FERVURA CARREGA O NOME DO GRUPO, montado pela view: "O mercado
       passou do ponto" é uma frase, e "Um grupo passou do ponto" é um formulário. */
    boilingSubject: "passou do ponto",
    boilingBody: "A pressão dele passou do ponto de fervura e ele deixou de sustentar o governo.",
    boilingNote: "de 100, e o ponto de fervura é",
    boilingWeight: "e ele carrega",
    boilingNoWeight: "e ele não pesa na ruptura econômica",

    /* ── OS TRES RELATORIOS DO MES ────────────────────────────────────────────
       ⚠ ELES CHEGAM POR TEMPO, e nao por evento — sao a unica especie assim. Cada um diz
       de onde para onde a grandeza foi, e os dois numeros vem guardados na carta: ler o
       "depois" do estado vivo faria a carta de marco contar o mes de abril na segunda vez
       que fosse aberta. */
    /* ── O ANEXO DA RUA ───────────────────────────────────────────────────────
       ⚠ ELE NASCEU DE UMA OBSERVACAO DO RESPONSAVEL sobre o inbox do Football Manager: a
       mensagem aberta la tem DUAS LINHAS de prosa — tao curta quanto as nossas — e o que
       enche o painel e um ANEXO de dado estruturado. O painel daqui nao era grande demais:
       ele estava esperando o anexo.

       AS CINCO NOTAS SAO AS DE `SONDA`, e os nomes sao os que o jogador usa. "Carestia" e
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
    /* ⚠ TRES DOS QUATRO SAO OS ROTULOS DE FINANCAS, e a guarda `vocabulary` cobrou a
       copia no primeiro `check` — com razao, e por uma razao que vale mais que a
       duplicacao: **o anexo e Financas dizem o MESMO numero**, e no dia em que um deles
       mudasse de nome o jogador leria dois nomes para a mesma linha do orcamento. A carta
       aponta para a tela; a tela e quem batiza. */
    annexVaultRow: {
      revenue: TERMOS.revenueWord,
      mandatory: TERMOS.mandatorySpend,
      ceiling: TERMOS.ceilingRule,
      allowance: "Empenhável",
    },
    /* ── O ANEXO DA BASE ──────────────────────────────────────────────────────
       ⚠ ELE MOSTRA O EIXO QUE O JOGO INTEIRO TEM E NUNCA MOSTROU: onze bancadas somadas
       num "398 cadeiras" escondem que tres estao a 73 e oito em ruptura — e escolher quem
       se compra e quem se decepciona e o jogo. */
    annexSeats: "bancada por bancada",
    /* ⚠ OS TRES JA EXISTIAM: "cadeiras" na manchete da base, "humor" na Mesa e "no mês"
       em Financas. Duas colunas com o mesmo nome escrito em lugares diferentes divergem no
       primeiro ajuste — e a que fica errada e sempre a que ninguem estava olhando. */
    annexSeatsCol: TERMOS.seatsWord,
    annexMoodCol: TERMOS.moodWord,
    annexMoveCol: TERMOS.perMonthWord,
    /* ⚠ OS DOIS DESCONTOS PESAM IGUAL EM TODA CLASSE, e por isso eles ficam no PE e nao
       numa coluna: credibilidade nao tem classe, e desgaste de cargo tambem nao. */
    /* ── O ANEXO DO BALANCO ───────────────────────────────────────────────────
       ⚠ ELE E A TABELA QUE TORNA OS TRES AVULSOS DISPENSAVEIS NO MES CALMO: antes e depois
       das tres leituras, lado a lado. O que o relatorio avulso faz e GRITAR uma delas; o
       que esta tabela faz e deixar o jogador comparar as tres sem abrir nada. */
    annexBalance: "o mês em três leituras",
    annexBalanceWas: "antes",
    annexBalanceNow: "agora",
    annexBalanceRow: {
      street: "aprovação",
      seats: TERMOS.seatsWord,
      vault: "o que sobra",
    },
    annexWear: "o desgaste do cargo tirou",
    annexBetrayal: "e a promessa não honrada tirou",
    annexEveryone: "de todas",

    /* ── AS MANCHETES DO RELATORIO ────────────────────────────────────────────
       ⚠ ELAS JA FORAM TRES ROTULOS E DOZE FRASES, e as duas versoes foram recusadas pelo
       responsavel — a segunda com a palavra certa: "pare com essa poesia, eu quero que
       seja algo TECNICO, vida real, humanizado".

         v1  "A rua se moveu"          — rotulo de categoria. Diz o ASSUNTO, nao o fato
         v2  "A rua escorregou"        — poesia. Diz o tamanho, e nao diz QUANTO
         v3  "Aprovação cai a 21%"     — noticia. Verbo e NUMERO

       ⚠ E O QUE SEPARA A v3 DAS OUTRAS DUAS E O NUMERO NO TITULO. Manchete de agencia,
       assunto de oficio e linha de despacho tem todos a mesma forma: o que mudou, para
       quanto. "A base desmanchou" e uma opiniao sobre o tamanho; "Base perde 12 cadeiras"
       e o fato, e o leitor forma a opiniao sozinho — que e o que um documento tecnico
       faz.

       ⚠ E POR ISSO ELAS DEIXARAM DE SER FRASES PRONTAS: o numero muda todo mes, entao a
       manchete se COMPOE. O que fica aqui e o verbo e a unidade; quem monta e a view, com
       o valor que a carta guarda. */
    headline: {
      "street.rose": "Aprovação sobe a",
      "street.fell": "Aprovação cai a",
      "seats.rose": "Base ganha",
      "seats.fell": "Base perde",
      /* ⚠ "CAIXA" E NAO "DISCRICIONARIO", e a troca e de LARGURA e nao de vocabulario:
         "Discricionário cai a R$ 11,3 bi" tem 31 caracteres e quebra em duas linhas num
         indice de 208px — e cada quebra custa 18px de uma coluna que tem 630. "Caixa cai a
         R$ 11,3 bi" cabe numa linha e diz a mesma coisa; o termo tecnico continua inteiro
         no CORPO da carta, que e onde ha espaco para ele. */
      "vault.rose": "Caixa sobe a",
      "vault.fell": "Caixa cai a",
    },
    headlineSeats: TERMOS.seatsWord,
    /* ⚠ O VERBO CARREGA A DIRECAO, e a primeira versao nao tinha verbo: ela dizia "de 44
       para 40", e a guarda `vocabulary` acusou o "de" contra o `TERMOS.of` de "436 de
       513". Os dois sao a mesma palavra com sentidos diferentes — um e origem, o outro e
       fracao —, e resolver isso com um verbo e melhor do que declarar excecao: a frase
       ficou mais curta de ler e ganhou uma informacao que estava na carta e nao aparecia. */
    /* ── A VOZ DA CARTA ───────────────────────────────────────────────────────
       ⚠ O RESPONSAVEL SUBIU A REGUA: "quero algo como uma mensagem de verdade para um
       presidente de verdade". O corpo do relatorio era uma LEITURA DE DADO — "caiu de 24
       para 23 de aprovação" —, e leitura de dado nao e mensagem: nao tem quem fala, nao
       tem para quem, e nao diz o que aquilo significa.

       ⚠ E NADA AQUI E INVENTADO, o que e a parte dificil. Cada oração se prende a um fato
       que o motor produziu: o número e a direção vêm da carta; a nota que mais sustenta e
       a que menos sustenta vêm de `weighed` e `notes`, que SONDA passou a devolver hoje.
       Uma recomendação sem número atrás seria o modelo opinando, e isso o projeto recusa.

       ⚠ E O VOCATIVO E O QUE MAIS MUDA A LEITURA, por menos que ele custe. "Presidente,"
       transforma um relatório num ofício — é a diferença entre um sistema exibindo estado
       e alguém escrevendo para alguém. */
    vocative: "Presidente,",
    pollClosed: "A pesquisa fechou o mês em",
    pollGood: "de ótimo ou bom",
    pollDown: "abaixo do mês passado.",
    pollUp: "acima do mês passado.",
    pollPoint: "ponto",
    pollPoints: "pontos",
    pollHolds: "O que sustenta o senhor é",
    pollHoldsIn: ", e é na",
    pollHoldsWeighs: "que ela pesa mais.",
    pollDrags: "A nota mais fraca é",
    pollDragsAt: "e ela puxa as três classes para baixo.",
    seatsBody: "As cadeiras que respondem ao governo fecharam o mês em",
    seatsOf: "de 513, e a maioria simples fecha em",
    seatsHint: "Sem ela, nada do que o senhor assinar chega ao plenário.",
    vaultBody: "O que sobra para o mês fechou em",
    vaultHint: "É desse dinheiro que sai emenda, e é ele que compra voto.",

    /* ⚠ `reportUnit` MORREU JUNTO COM O TEMPLATE COMUM. Ela dava a unidade de cada
       relatorio — "de aprovação", "cadeiras com o governo", "de discricionário" — para uma
       frase montada igual para as tres especies. Em 21/08 o corpo virou OFICIO e cada
       especie passou a escrever a propria frase, com a unidade dentro dela; a tabela ficou
       para tras, e com ela `reportRose`, `reportFell` e `reportTo`. */

    /* ── POR QUE ESTA CARTA CHEGOU ─────────────────────────────────────────────
       ⚠ A IDEIA E DO INBOX DO FOOTBALL MANAGER, onde cada item tem um controle que
       "indica por que você está recebendo isto" — e ela é a que mais casa com a doutrina
       deste projeto. Aqui todo número mostrado tem motor atrás; a CARTA era a única peça
       da tela que não explicava a própria existência. O jogador via a consequência e não
       a causa, e consequência sem causa é evento roteirizado — que é o que o ciclo 4
       proíbe em texto.

       ⚠ E NADA AQUI É INVENTADO: a razão sai do `kind`, que o motor já grava na carta.
       É prosa sobre fato existente, e não um segundo lugar decidindo o que aconteceu.

       ⚠ E `reported` É A MAIS IMPORTANTE DAS NOVE, por causa do achado 37: a única
       pergunta que este jogo faz mora atrás de uma regra que ninguém ensina — só texto
       que machuca DUAS alavancas ou mais passa por relatoria com emenda. Um jogador
       cauteloso atravessa quatro anos sem nunca ver a caixa perguntar nada, e nunca
       descobre por quê. Esta linha é o lugar onde essa regra finalmente se diz. */
    why: {
      posse: "você tomou posse, e o orçamento em vigor ainda é o do seu antecessor",
      tabled: "a Mesa pautou um texto que você assinou",
      reported:
        "seu texto mexeu em duas alavancas ou mais, e texto assim passa por relatoria — é ela que emenda",
      forgotten: "seu texto passou do prazo sem a Mesa pautar",
      passed: TERMOS.plenaryJudged,
      rejected: TERMOS.plenaryJudged,
      demand: "você mexeu numa alavanca que este grupo cobra",
      rupture: "uma das três rupturas da queda se abriu",
      siege: "as três rupturas se abriram no mesmo mês, e é isso que abre a gaveta",
      ceiling: "o gasto do ano encostou no limite da regra neste mês",
      minority: "a sua base cruzou a maioria simples para baixo neste mês",
      boiling: "a pressão deste grupo passou do ponto de fervura neste mês",
      /* ⚠ AS TRES RAZOES SAO A MESMA FRASE COM O SUJEITO TROCADO, e isso e de propósito:
         o que o jogador precisa aprender é a REGRA, e ela é uma só — o domínio escreve no
         mês em que se move o bastante, e cala no mês em que não. */
      /* ⚠ AS TRES ERAM A MESMA FRASE COM O SUJEITO TROCADO — "se moveu o bastante neste
         mês para valer uma linha" — e o responsável acusou o conjunto: "parece tudo igual".
         A razão de chegar é a mesma nas três, mas dizê-la três vezes com as mesmas palavras
         é o que faz o rodapé virar ruído. Cada uma diz agora QUEM está falando e por quê. */
      street: "a Casa Civil manda a pesquisa quando ela se move o bastante para importar",
      seats: "o líder conta as cadeiras todo mês, e escreve quando a conta muda",
      vault: "a Fazenda fecha o mês e avisa quando o que sobra muda de tamanho",
    },
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
    reportedSaved: "salvei",
    forgotten: "O seu texto morreu na gaveta",
    forgottenBody: "Seis meses sem ser pautado. Ele não perdeu a votação — ela nunca aconteceu.",
    passedBill: "O plenário aprovou",
    rejectedBill: "O plenário derrubou",
    /* ⚠ AS DUAS NASCERAM DE UMA MEDIÇÃO EM 21/08/2026, e o defeito era o pior da
       Caixa de Entrada: `passed` e `rejected` eram as duas ÚNICAS cartas do jogo com
       `body: ""`. Numa folha que estica até 630px isso é um ofício com cabeçalho,
       assunto e **430px de papel em branco** — e a espécie que sofria era a do
       desfecho do texto que o jogador escreveu, negociou e pagou. O momento de maior
       recompensa do jogo chegava como uma folha vazia.

       ⚠ E NENHUMA DAS DUAS INVENTA FATO. A aprovação vira norma e só cai por outro
       texto que a revogue pelo nome — é o brocardo que `domain/norms/` implementa em
       `repeals`. A derrubada não devolve o texto à Mesa: quem o quiser de novo assina
       outro, porque a fila não guarda o que o plenário já julgou. */
    passedBillBody:
      "O texto virou norma, e ela vale a partir de agora. Desfazê-la exige outro texto que a revogue pelo nome.",
    passedBillAction: "Ver a lei em vigor",
    rejectedBillBody:
      "O texto caiu no plenário. A faixa segue a que estava, e ele não volta sozinho: quem o quiser de novo assina outro.",
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
    /* ⚠ AS DUAS FRASES SAO A MESMA EXIGENCIA EM SENTIDOS OPOSTOS, e desde 20/08/2026 o
       jogo tem as duas. Os grupos de capacidade pedem o que foi CORTADO de volta; o
       mercado pede que o AUMENTO seja desfeito. Uma frase so nas duas cartas faria a do
       mercado dizer "quer o programa de volta em 40" embaixo de um numero MENOR do que o
       nivel de hoje — e o jogador leria a exigencia ao contrario, cedendo achando que
       gasta mais quando na verdade corta. */
    demandBody: "quer o programa de volta em",
    demandCutBody: "quer o programa cortado de volta para",
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
      block: TERMOS.refuse,
      blockCost: TERMOS.refuseCost,
    },
    /* ⚠ CEDER AO MERCADO NAO CUSTA DINHEIRO — CUSTA O PROGRAMA. O par de cima descreve
       o preco de devolver verba; aqui o preco esta do outro lado, e usar a mesma frase
       prometeria uma consequencia que o turno nao executa. */
    demandCutChoices: {
      accept: "Cortar",
      acceptCost: "o gasto cai neste mês, e a área sente no índice",
      block: TERMOS.refuse,
      blockCost: TERMOS.refuseCost,
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
    programs: "O orçamento",
    thisArea: "esta área",
    outlook: "Para onde vai",
    /* O PISO É ANUNCIADO EM TODA LINHA, e não só quando é atravessado. Um limite
       que só aparece depois de violado é um limite que o jogador descobre
       errando — e o erro aqui custa a pauta do mês. */
    floor: "piso",
    ofMonth: "do mês",
    available: "disponíveis",
    committed: "já comprometidos nas outras áreas",
    holding: "parado",
    perYear: TERMOS.perYear,
    /* OS TITULOS DAS TRES COLUNAS DE NUMERO. Sem eles a linha de uma acao mostra
       `308 · −140 · +8`, que sao tres grandezas diferentes em tres unidades
       diferentes sem nada dizendo qual e qual — e o jogador que adivinha errado
       aprende o modelo errado. */
    /* A COLUNA DO BOTÃO tem título só para quem lê por leitor de tela: na tela
       ele seria um rótulo em cima de um botão que já diz o que faz. */
    /* RESULTADO, e não "despesa". O sinal do catálogo é o do RESULTADO — positivo
       poupa ou arrecada, negativo custa. Sob o título "despesa", o mesmo `−48`
       se lê ao contrário do que ele significa: como corte de gasto, quando é
       gasto novo. Rótulo que inverte o sinal do número é pior que rótulo
       nenhum. */
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
  /* FINANCAS — O PLACAR. Os rótulos aqui são mais secos que os do resto do jogo,
     e é de propósito: quem entra nesta tela vem conferir número, e adjetivo em
     painel de leitura é opinião com aparência de dado.
     ⚠ NENHUM NÚMERO É ESCRITO NESTAS FRASES. A meta de inflação, o teto e a carga
     vêm do catálogo e chegam à tela por parâmetro — número digitado aqui seria um
     segundo lugar para a calibragem divergir, e o rótulo é quem sempre esquece de
     ser atualizado. */
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
    /* A NOTA E NEUTRA NO SINAL de propósito: o hiato é negativo na maior parte de
       uma partida, e uma frase que só descreve o lado positivo — "acima do que o
       país produz" — lê como erro justamente quando o número está abaixo de zero,
       que é quando ele mais importa. */
    gapNote: "distância até o que o país produz sem pressionar preço",
    accounts: "As contas",
    revenue: TERMOS.revenueWord,
    mandatory: TERMOS.mandatorySpend,
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
    ceiling: TERMOS.ceilingRule,
    headroom: "Folga até o teto",
    untilCeiling: "o que o teto ainda deixa gastar",
    squeezed: "a obrigatória sozinha já fura o teto",
    country: TERMOS.country,
    perYear: TERMOS.perYear,
    perMonth: TERMOS.perMonthWord,
  },
  /* ⚠ O CONGRESSO GANHOU CABECA E VIROU UMA LAMINA SO em 15/08/2026. Ele era a
     unica tela do jogo com TRES pecas de vidro soltas — a faixa de indices, a mesa
     e o relatorio — e a unica sem cabeca nenhuma: a tela onde o mes se decide nao
     dizia o proprio nome. Agora ela tem a mesma forma das outras quatro: uma
     lamina, uma cabeca, e blocos com legenda dentro. */
  congress: {
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
    /* ⚠ `memoryNone` MORREU EM 20/08/2026 — "sem histórico com o seu governo". Ela
       saía SETE VEZES na mesma tela no mês 1, porque no mês 1 ninguém tem histórico. A
       razão inteira está em `personHtml`; aqui fica o registro de que a frase existiu e
       de que apagá-la foi decisão, e não esquecimento. */
  },
  mesa: {
    empty: "Nada em pauta",
    emptyHint: "escolha uma ação numa das áreas — ou avance o mês assim mesmo",
    swap: "trocar",
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
    mood: TERMOS.moodWord,
    result: "resultado",
    funding: "verba",
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
  approvalParts: {
    good: "Ótimo/bom",
    fair: "Regular",
    poor: "Ruim/péssimo",
  },
  /* ⚠ `context` E `situation` MORRERAM EM 21/08/2026, e o registro fica porque as duas
     contam a mesma historia: `context` era a faixa do rail da direita, que a barra de cima
     substituiu em 15/08; `situation` era "Crise / Estável / Alta", e o veredito por MOTIVO
     — logo abaixo — tomou o lugar dela pela razao escrita ali. As duas pecas sairam da
     tela e as duas tabelas ficaram no arquivo por seis dias, intactas e mudas.

     ⚠ E FOI A GUARDA QUE AS ACHOU, e nao a leitura. Sao 49 frases nesse estado, e nenhuma
     delas quebrava nada: elas so faziam a proxima sessao acreditar que a peca existia. */
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
    /* ── O PRECO DE AVANCAR, e ele e a unica legenda que MUDA de mes para mes ──
       ⚠ ELA PASSA NO TESTE DA LINHA ACIMA COM FOLGA: "Avancar o mes" nao diz que
       DUAS perguntas na mesa vao fechar sozinhas neste clique, e essa e exatamente a
       informacao que muda a decisao — e que, dita depois, viraria recibo.

       ⚠ E ELA CONTA PERGUNTAS, E NAO CARTAS. Aviso nao tem prazo e nao fecha por
       silencio; anunciar "3 cartas" numa bandeja com dois avisos dentro seria a barra
       de cima prometendo um preco que o mes nao cobra. Quem separa uma coisa da outra
       e `silences`, no motor. */
    /* ⚠ ELA PASSOU A NOMEAR EM 21/08/2026, e a ideia e do inbox do Football Manager: la o
       rotulo do botao de avancar muda para dizer O QUE espera, e nao quantos. A diferenca
       e entre saber que ha um preco e saber QUAL — e com uma ou duas cartas na mesa,
       nomear cabe. ⚠ O plural continua contando, porque tres assuntos num rotulo de botao
       viram uma frase que ninguem lê. */
    silenceOne: "fecha sem resposta:",
    silenceMany: "perguntas fecham sem resposta",
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
