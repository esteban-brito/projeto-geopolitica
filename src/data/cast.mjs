/* O ELENCO — o vocabulario com que a republica ganha gente.
   ══════════════════════════════════════════════════════════════════════════════

   ⚠ TODA PESSOA DESTE JOGO E FICTICIA, e isto e o ADR 0003 — nao cautela
   juridica, DESENHO, e as duas razoes pesam igual:

     · um jogo em que se corrompe, chantageia e derruba gente de nome real AFIRMA
       coisas sobre pessoas vivas que nenhum motor sustenta. E a mesma regra que
       governa os numeros, aplicada a gente: o catalogo pode dizer que um deputado
       ficticio de arquetipo centrao cobra caro; nao pode dizer isso de ninguem;
     · personagem GERADO e personagem que muda de partida para partida. Um elenco
       fixo com nomes reais seria decorado em duas partidas; um gerado da semente
       da a cada mandato um Congresso diferente — e mantem o mandato reproduzivel,
       que e a regra que sustenta save, simulador e calibragem.

   ── O QUE ESTE ARQUIVO NAO CONTEM, e a lista e a guarda ──────────────────────
   Nenhum nome de politico brasileiro, vivo ou morto. Nenhum sobrenome que, no
   Brasil, funcione como identidade politica por si so — a familia que se reconhece
   pelo sobrenome esta fora, e ela esta fora inclusive quando o primeiro nome
   mudaria tudo, porque o que se reconhece e o sobrenome.

   ⚠ A COLISAO ACIDENTAL E POSSIVEL E ESTA DECLARADA. Com nomes comuns, alguma
   combinacao vai coincidir com o nome de alguem que existe — e o proprio ADR diz
   que nao ha casador honesto para isso: uma lista de proibidos seria incompleta
   por definicao e acusaria sobrenomes comuns. O que da para fazer, e esta feito, e
   nao usar como materia-prima nenhum nome que carregue identidade politica.

   ── OS ARQUETIPOS SAO O CONTRATO COM O JOGADOR ──────────────────────────────
   Um personagem gerado precisa ser LEGIVEL em uma linha, senao ele e ruido com
   nome proprio. O arquetipo e o que o torna reconhecivel sem ser ninguem: o
   jogador ve "cacique do centrao" e ja sabe o que esperar, do mesmo jeito que ve
   "Centrao" hoje — a diferenca e que agora esse alguem tem memoria do que voce
   fez com ele em marco.

   Cada arquetipo declara FAIXAS, e nao valores. O gerador sorteia dentro delas, e
   e por isso que "deterministico" nao e "aleatorio": ele distribui dentro do que o
   catalogo autoriza, como todo o resto do projeto. Ver o risco R4 do ciclo 4. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/* ── OS NOMES ────────────────────────────────────────────────────────────────
   Duas listas que o gerador combina. Elas sao dado, e nao codigo, pelo mesmo
   motivo de todo o resto do catalogo: quem quiser trocar o vocabulario troca o
   arquivo, e a validacao continua valendo.

   ⚠ ELAS TINHAM UM ANDAR SOCIAL SO, E ISSO ERA UM DEFEITO DE MATERIA-PRIMA.
   Ate 16/08/2026 os 27 primeiros nomes eram TODOS arcaicos — Belarmino,
   Godofredo, Marcolino, Prudencio, Teodolino — e a maioria dos sobrenomes era
   composta: Caldeira Nunes, Guimaraes Passos, Hollanda Cavalcanti. Nao existia
   COMBINACAO possivel que nao soasse a coronel de 1890.

   E o defeito nao era de sorteio: nenhuma semente o conserta, porque nao havia o
   que sortear. O gerador tinha entropia; o vocabulario e que tinha um andar so.
   Uma auditoria externa leu o elenco inteiro como "clones aristocraticos" e
   acertou o sintoma — o diagnostico e que oito arquetipos de LIDERANCA nascidos
   de um vocabulario de oligarquia produzem sempre a mesma pessoa.

   ⚠ E O CUSTO NAO FICAVA NO CADASTRO: o nome entra em TODO texto gerado — a
   assinatura da leitura do mes, o remetente de cada carta da tramitacao, o dossie
   da bancada. Vies de vocabulario e vies da voz do jogo inteiro, e por isso ele
   foi consertado ANTES de escrever as cartas novas do ciclo 9.

   ── O ALVO E FAIXA, E NAO SUBSTITUICAO ──────────────────────────────────────
   Trocar tudo por nome moderno erraria igual, na direcao oposta: uma Camara em
   que ninguem tem mais de quarenta anos e tao falsa quanto uma em que ninguem
   tem menos de setenta. As listas passam a atravessar GERACOES e REGIOES — o
   Genesio de 1950 convive com a Tabata de 1990, porque as duas convivem no
   Congresso real.

   O SOBRENOME COMPOSTO CONTINUA EXISTINDO, e volta a significar o que deveria:
   LINHAGEM. Quando ele era o padrao da casa, nao dizia nada; sendo minoria, ele
   volta a marcar quem carrega familia — e a diferenca entre um Sarmento e um
   Hollanda Cavalcanti passa a ser legivel.

   ⚠ E O ADR 0003 CONTINUA MANDANDO em cada linha nova: nenhum nome de politico
   brasileiro, e nenhum sobrenome que funcione como identidade politica por si so.
   A colisao acidental segue declarada no cabecalho deste arquivo — com nome comum
   ela e inevitavel, e ficou MAIS provavel agora, o que e o preco aceito de um
   vocabulario que parece o pais. */

/** @type {ReadonlyArray<string>} */
export const FIRST_NAMES = [
  /* A geracao que ja estava aqui — e ela FICA. Um Congresso sem nenhum Genesio
     seria tao improvavel quanto um so de Genesios. */
  "Adalberto",
  "Belarmino",
  "Custódio",
  "Dalva",
  "Eurico",
  "Filomena",
  "Genésio",
  "Hermínia",
  "Januário",
  "Leocádia",
  "Lourival",
  "Nazaré",
  "Onofre",
  "Quitéria",
  "Sebastiana",
  "Ubirajara",
  "Valdomiro",
  "Zulmira",
  /* A GERACAO DO MEIO — quem se elegeu pela primeira vez nos anos 90 e hoje
     preside comissao. E a faixa que faltava inteira, e e a mais numerosa numa
     Camara de verdade. */
  "Adriano",
  "Beatriz",
  "Cláudio",
  "Denise",
  "Fábio",
  "Gilmar",
  "Heloísa",
  "Jorge",
  "Márcia",
  "Nilson",
  "Renata",
  "Sérgio",
  "Vera",
  "Wagner",
  /* A GERACAO NOVA — o primeiro mandato. Ela existe no Congresso real e nao
     existia aqui, e a ausencia dela fazia o plenario inteiro parecer velho. */
  "Bruno",
  "Camila",
  "Diego",
  "Ícaro",
  "Juliana",
  "Letícia",
  "Rafael",
  "Tainá",
  "Thiago",
  "Yasmin",
];

/** @type {ReadonlyArray<string>} */
export const SURNAMES = [
  /* SIMPLES — e agora eles sao a MAIORIA, que e a proporcao do pais. O sobrenome
     de uma linha e o de quem chegou sem familia atras, e essa e a maior parte de
     qualquer bancada. */
  "Alencastro",
  "Bonfim",
  "Camargo",
  "Dourado",
  "Espíndola",
  "Fontenele",
  "Gaspar",
  "Itaparica",
  "Jucundo",
  "Lustosa",
  "Macedo",
  "Nascimento",
  "Ourives",
  "Prata",
  /* ⚠ NAO PONHA "Quirino" SOLTO AQUI: existe "Bastos Quirino" na lista de
     compostos, e o desempate por pedaco compara STRING — os dois passariam como
     sobrenomes distintos e o jogador leria dois Quirinos na mesma bancada. Eco de
     sobrenome e a colisao que o desempate nao pega, e a lista e o unico lugar
     onde ela se evita. */
  "Peçanha",
  "Rebouças",
  "Sarmento",
  "Tolentino",
  "Uchôa",
  "Veloso",
  "Xavier",
  "Zamith",
  /* COMPOSTOS — minoria de proposito. Ver a nota do topo: composto so significa
     LINHAGEM enquanto nao for o padrao. */
  "Arruda Bezerra",
  "Bastos Quirino",
  "Caldeira Nunes",
  "Guimarães Passos",
  "Hollanda Cavalcanti",
  "Lacerda Coutinho",
  "Pontes Vilela",
  "Queiroz Sampaio",
  "Valadares Pinto",
];

/* ── OS CARGOS DA ONDA 1 ─────────────────────────────────────────────────────
   O ciclo 4 declara a ordem das ondas, e a primeira e a que a tramitacao exige:
   sem presidente da Camara, "quem decide o que vai a voto" nao tem resposta. */

/** @type {ReadonlyArray<string>} */
/* ⚠ `chief` ENTROU EM 15/08/2026 E É DE OUTRA NATUREZA que os quatro anteriores.
   Os quatro primeiros são cargos do LEGISLATIVO — quem os ocupa tem cadeira, entrega
   voto e cobra preço. O chefe da Casa Civil é do Executivo: ele é nomeado pelo
   próprio jogador, não vota, e a função dele é ser a voz que fala com o presidente.
   O que separa os dois grupos no modelo não é este rótulo, é o alcance: `benches`
   só conhece quem arrasta alguém. */
const OFFICES = ["speaker", "senate", "rapporteur", "leader", "chief"];

/* ── AS AMBICOES ─────────────────────────────────────────────────────────────
   O que a pessoa QUER, e e isso que a distingue de uma bancada. Uma bancada
   esquece; uma pessoa cobra, e cobra na moeda dela.

   ⚠ ELAS NAO SAO PERSONALIDADE, SAO PRECO. Cada ambicao diz o que compra aquele
   sujeito mais barato que dinheiro — e por isso duas pessoas do mesmo bloco, com
   a mesma venalidade, podem custar coisas completamente diferentes. */

/** @type {ReadonlyArray<string>} */
export const AMBITIONS = [
  /* Quer o Planalto em 2030, e por isso ganha com o governo fraco. E a unica
     ambicao que torna a pessoa ADVERSARIA por construcao. */
  "succession",
  /* Quer um ministerio. Barato de agradar e caro de manter: o cargo se da uma
     vez e a lealdade dele passa a depender de nao o perder. */
  "cabinet",
  /* Quer o governo do proprio estado. Ele troca voto por obra, e some do
     Congresso no ano eleitoral. */
  "state",
  /* Quer uma vaga no tribunal. E a ambicao mais longa e a mais cara: ela so se
     paga uma vez no mandato, e compra quase tudo ate la. */
  "court",
  /* Quer continuar onde esta. O mais comum, e o mais util: ele negocia por
     dinheiro, como o modelo sempre supos. */
  "seat",
];

/** @type {Schema} */
export const ARCHETYPE_SCHEMA = {
  id: { kind: "id" },
  label: { kind: "text" },
  bloc: { kind: "id" },
  /* ⚠ `values` ENTROU EM 22/08/2026, e a lista existia desde 15/08 SEM NINGUEM COBRA-LA.
     `OFFICES` estava declarada logo acima, a prosa do tipo dizia "o cargo que ele ocupa;
     UM DE `OFFICES`" — e nada verificava: um arquetipo com `office: "rapportuer"` passaria
     por tipo, guarda e validacao, e sumiria dentro de um `by(office)` que nao casa com
     nada. E o `by()` da Caixa de Entrada devolve `null` calado, entao a carta sairia sem
     remetente em vez de falhar.

     ⚠ E ESTE E O DEFEITO QUE `standards.md` JA NOMEIA — "lista declarada e nao cobrada" —,
     com `CHANNELS` e `FAMILIES` citadas por nome. As duas foram ligadas ao esquema quando
     a licao foi escrita; `OFFICES` ficou de fora e ninguem voltou. O que a achou foi a
     limpeza: sem consumidor nenhum, ela e uma lista que o arquivo declara e esquece. */
  office: { kind: "text", values: OFFICES },
  economicShift: { kind: "number", min: -40, max: 40 },
  libertyShift: { kind: "number", min: -40, max: 40 },
  venalityShift: { kind: "number", min: -0.5, max: 0.5 },
  reachMin: { kind: "number", min: 0, max: 1 },
  reachMax: { kind: "number", min: 0, max: 1 },
};

/**
 * @typedef {object} Archetype
 * @property {string} id
 * @property {string} label - como o jogador reconhece o sujeito em uma linha
 * @property {string} bloc - o bloco de onde ele sai
 * @property {string} office - o cargo que ele ocupa; um de `OFFICES`
 * @property {number} economicShift - o quanto ele se afasta do bloco, no eixo economico
 * @property {number} libertyShift - idem, no eixo de liberdades
 * @property {number} venalityShift - o quanto ele e mais (ou menos) venal que o bloco
 * @property {number} reachMin - fracao MINIMA da bancada que ele de fato arrasta
 * @property {number} reachMax - fracao maxima
 */

/* ── OS ARQUETIPOS ───────────────────────────────────────────────────────────
   Um por cargo da onda 1, mais um lider por bloco. O `reach` e o que impede a
   pessoa de virar a bancada inteira: um lider arrasta uma parte dela, e a parte
   que ele NAO arrasta continua votando pela ideologia do bloco. E o que faz
   comprar o lider ser barato e insuficiente ao mesmo tempo.

   ⚠ AS FAIXAS SAO PRIMEIRO CHUTE, declarado como o de ECLUSA e o da MALHA. O que
   NAO e chute e a RAZAO entre elas: o presidente da Camara arrasta mais que
   qualquer lider, porque o poder dele nao vem da bancada — vem da mesa. */

/* ── DE QUE BANCADA SAI CADA CARGO ────────────────────────────────────────────
   ⚠ A DISTRIBUICAO FOI REFEITA EM 20/08/2026, com as nove legendas. Antes QUATRO dos
   oito arquetipos saiam do mesmo bloco, e o resultado era cinco partidos sem uma unica
   pessoa dentro — inclusive o MAIOR deles, com 145 cadeiras. Uma bancada grande sem
   rosto e uma bancada que o jogador nao tem como negociar: o inbox nao recebe carta
   dela, o sinete nao existe, e ela vira uma barra que se arrasta.

   Agora cada cargo sai de onde ele sairia num Congresso de verdade: a presidencia da
   Camara vai para a maior bancada, a do Senado para a federacao de caciques regionais,
   a relatoria do orcamento para quem detem a fatia do orcamento, e a chefia da Casa
   Civil para o partido do proprio presidente.

   ⚠ E OS IDS CONTINUAM DIZENDO "centrao", o que e DIVIDA DECLARADA e nao descuido:
   `speaker-centrao` mora hoje na bancada liberal-conservadora. O id do arquetipo e a
   chave da verba prometida a cada pessoa no estado salvo, entao renomear atravessa o
   save e so vale junto com uma migracao. E o que ele descreve — o arquetipo — nao
   mudou: quem preside a Camara e o sujeito de bancada grande que negocia pauta por
   cargo, chame-se a bancada como se chamar. */
/** @type {ReadonlyArray<Archetype>} */
export const ARCHETYPES = [
  {
    id: "speaker-centrao",
    label: "cacique da Mesa",
    bloc: "liberais-conservadores",
    office: "speaker",
    /* Ele nao e o centro do proprio bloco: quem chega a presidencia da Camara
       chega negociando com todos, e isso o puxa para o meio do plenario. */
    economicShift: -8,
    libertyShift: 4,
    /* MAIS VENAL QUE O PROPRIO CENTRAO, e nao e cinismo do catalogo: o cargo se
       conquista distribuindo, e quem o conquistou deve favores a todos. */
    venalityShift: 0.03,
    reachMin: 0.5,
    reachMax: 0.7,
  },
  {
    id: "senate-centrao",
    label: "chefe do Senado",
    bloc: "democratas-nacionais",
    office: "senate",
    economicShift: -4,
    libertyShift: -6,
    venalityShift: -0.05,
    reachMin: 0.35,
    reachMax: 0.55,
  },
  {
    id: "rapporteur-centrao",
    label: "relator de orçamento",
    bloc: "uniao-progressista",
    office: "rapporteur",
    /* O relator e o cargo mais tecnico e o mais caro: ele nao entrega votos, ele
       entrega TEXTO — e por isso o alcance dele e baixo e o preco nao. */
    economicShift: 2,
    libertyShift: -2,
    venalityShift: 0.02,
    reachMin: 0.1,
    reachMax: 0.25,
  },
  {
    id: "leader-esquerda",
    label: "líder da esquerda",
    bloc: "trabalhistas-unidos",
    office: "leader",
    economicShift: -6,
    libertyShift: 5,
    /* Menos venal que o proprio bloco: quem lidera a esquerda lidera por
       disciplina, e disciplina nao se compra sem custo publico. */
    venalityShift: -0.06,
    reachMin: 0.55,
    reachMax: 0.8,
  },
  {
    id: "leader-centro-esquerda",
    label: "líder do centro",
    bloc: "socialistas",
    office: "leader",
    economicShift: 6,
    libertyShift: -4,
    venalityShift: 0.08,
    reachMin: 0.45,
    reachMax: 0.7,
  },
  {
    id: "leader-centrao",
    label: "líder do Centrão",
    bloc: "social-municipalista",
    office: "leader",
    economicShift: 3,
    libertyShift: 2,
    venalityShift: 0.02,
    reachMin: 0.5,
    reachMax: 0.75,
  },
  {
    id: "leader-direita-liberal",
    label: "líder liberal",
    bloc: "liberais",
    office: "leader",
    economicShift: 5,
    libertyShift: -8,
    venalityShift: 0.04,
    reachMin: 0.5,
    reachMax: 0.75,
  },
  /* ── O CHEFE DA CASA CIVIL — o único que NÃO vota ───────────────────────────
     ⚠ ELE EXISTE PARA O JOGO TER UMA VOZ, e essa é a função inteira dele. Até
     15/08/2026 nenhuma tela do Planalto se DIRIGIA ao presidente: tudo era descrito
     em terceira pessoa, e a leitura do mês — a única frase do jogo escrita para ele
     — chegava sem assinatura, o que uma auditoria externa leu como "texto esquecido
     na tela". Um simulador pesado como o Football Manager nunca deixa de parecer
     futebol porque a diretoria escreve, o auxiliar opina, o jogador bate na porta.
     Aqui não havia ninguém.

     ⚠ `reach` ZERO, E ISSO NÃO É UM VALOR PROVISÓRIO. Ele é a mecânica: `benches`
     só reparte a bancada entre quem arrasta alguém, então um alcance de zero
     mantém o chefe fora do plenário para sempre. Ele não tem cadeira, não entrega
     voto e não muda o preço de nada — e é por isso que ele pode falar sem que
     falar vire uma jogada. Um conselheiro que também votasse seria um líder com
     microfone, e o jogador aprenderia a ler o conselho como barganha.

     ⚠ O BLOCO É DE ONDE ELE VEIO, e não quem ele lidera — e esta é uma afirmação
     de modelagem, declarada como todas as outras deste catálogo. A Casa Civil é a
     pasta da articulação, e articulação no presidencialismo de coalizão passa pelo
     centro: um chefe de Casa Civil é, quase sempre, um quadro do bloco que costura
     a base. A consequência prática é nenhuma, porque a posição dele nunca é
     consultada — ninguém vota com ela. */
  {
    id: "chief-of-staff",
    label: "chefe da Casa Civil",
    bloc: "trabalhistas-unidos",
    office: "chief",
    economicShift: 0,
    libertyShift: 0,
    venalityShift: 0,
    reachMin: 0,
    reachMax: 0,
  },
];

/** @type {Schema} */
export const CAST_SCHEMA = {
  memoryDecay: { kind: "number", min: 0, max: 1 },
  favourWeight: { kind: "number", min: 0, max: 100 },
  betrayalWeight: { kind: "number", min: 0, max: 100 },
  memoryCap: { kind: "number", min: 1, max: 200 },
  successionDrag: { kind: "number", min: 0, max: 1 },
};

/**
 * @typedef {object} CastParameters
 * @property {number} memoryDecay - quanto do saldo de favores sobra a cada mes
 * @property {number} favourWeight - o quanto verba PAGA credita na memoria
 * @property {number} betrayalWeight - o quanto promessa quebrada debita
 * @property {number} memoryCap - o teto do saldo, para os dois lados
 * @property {number} successionDrag - o quanto quem quer 2030 resiste a mais
 */

/* ── A MEMORIA ───────────────────────────────────────────────────────────────
   ⚠ ELA E O QUE SEPARA UMA PESSOA DE UMA BANCADA, e o ciclo 4 diz isso em uma
   frase: "uma bancada esquece, uma pessoa cobra".

   O DECAIMENTO E LENTO DE PROPOSITO — 0,96 ao mes deixa metade do saldo de pe
   depois de dezessete meses. A lealdade de bancada decai rapido porque ela e
   humor; memoria pessoal e outra coisa, e um sujeito que foi traido em marco
   ainda lembra disso na eleicao da Mesa de fevereiro.

   E A TRAICAO PESA MAIS QUE O FAVOR, pela mesma razao que a satisfacao de SONDA
   cai tres vezes mais rapido do que sobe: e o achado mais consistente que existe
   sobre reciprocidade, e sem ele o jogo ensinaria que da para queimar alguem e
   comprar de volta pelo mesmo preco. */

/** @type {CastParameters} */
export const CAST = {
  memoryDecay: 0.96,
  favourWeight: 14,
  betrayalWeight: 30,
  memoryCap: 100,
  /* Quem quer o Planalto em 2030 ganha com o governo fraco, e por isso resiste a
     mais mesmo pago. E o unico termo do elenco que dinheiro NAO compra — a mesma
     forma do segundo termo da resistencia de ECLUSA, e pela mesma razao: o que
     esta em disputa nao e o preco, e a vaga. */
  successionDrag: 0.35,
};
