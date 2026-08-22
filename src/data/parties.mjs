/* OS BLOCOS PARTIDARIOS — o espaco ideologico do Congresso.
   ══════════════════════════════════════════════════════════════════════════════

   ⚠ TUDO AQUI E FICCAO com inspiracao na realidade, que e decisao fechada do
   projeto. Nenhum numero desta tabela cita fonte porque NENHUM deles e
   afirmacao sobre o Brasil — e essa e a diferenca entre um numero declarado
   como ficcao e um numero inventado que vira divida silenciosa. No minuto em
   que alguem tratar o 0,95 do centrao como dado, o projeto passou a afirmar
   coisa que nao pode sustentar.

   BLOCOS, E NAO PARTIDOS. Fase 1 modela quatro blocos e nao trinta legendas: o
   que a votacao precisa saber e onde o voto esta no espaco ideologico e quanto
   ele custa, e trinta linhas com a mesma matematica nao ensinam nada a mais ao
   jogador. Partido individual entra quando houver motivo de jogo para ele
   existir separado.

   ── O ESPACO ─────────────────────────────────────────────────────────────────
   Duas dimensoes independentes, cada uma de 0 a 100:

     `economic` — pauta economica. 0 e maxima intervencao, 100 e maximo mercado;
     `liberty`  — liberdades individuais. 0 e maximo controle sobre a pessoa,
                  100 e maxima liberdade pessoal.

   Duas dimensoes e nao uma porque o eixo unico esquerda-direita nao consegue
   representar o caso mais comum do Congresso brasileiro: a bancada liberal na
   economia e restritiva nos costumes. Num eixo so ela teria de ficar em algum
   lugar do meio, que e onde ela justamente nao esta.

   O SEGUNDO EIXO E LIBERDADE, E NAO "COSTUMES", e a distincao ja se pagou duas
   vezes nesta bancada. Chamado de costumes, ele so acomoda pauta moral, e entao
   nao existe onde por um governo economicamente liberal e politicamente
   autoritario — censura a imprensa e proibicao de droga cairiam em eixos
   diferentes. Chamado de liberdade pessoal, que e o eixo Y do Nolan original,
   os dois casos caem no MESMO lugar: restringir o que a pessoa pode fazer.
   A bancada de fe e o governo autoritario discordam do MOTIVO e concordam da
   POSICAO — e posicao e a unica coisa que a votacao precisa saber.

   ── A VENALIDADE ─────────────────────────────────────────────────────────────
   Venalidade (0 a 1) e o quanto a distancia ideologica CEDE a dinheiro — nao o
   tamanho da resistencia. A distincao decide a formula inteira, e o dossie de
   origem a trocou: la a resistencia era MULTIPLICADA pela venalidade, o que
   deixava a direita liberal (0,10) com um decimo da resistencia ideologica, ou
   seja, comprada de graca. E o oposto do comportamento descrito na mesma
   tabela. Ver `src/domain/congress/` para a forma corrigida.

   ELA E UMA POR EIXO, E NAO UMA SO. Um escalar unico nao consegue expressar o
   comportamento mais caracteristico do Congresso brasileiro: O PRECO DEPENDE DO
   ASSUNTO. A bancada de fe vende barato em pauta economica e nao vende a preco
   nenhum em pauta moral; a bancada liberal faz o inverso, negocia costumes e
   nao entrega a propria pauta economica por cargo algum. Com um numero so,
   qualquer das duas fica errada em metade das votacoes.

   O custo de descobrir isso depois seria refazer o balanceamento inteiro, e por
   isso a divisao entra antes de a formula existir. A suite exige que ao menos um
   bloco seja ASSIMETRICO — dois numeros iguais em toda a tabela devolveriam o
   escalar por outro nome, e a distincao morreria sem ninguem notar. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const PARTY_SCHEMA = {
  id: { kind: "id" },
  label: { kind: "text" },
  sigla: { kind: "text" },
  /* ⚠ O ARTIGO E VOCABULARIO, e por isso ele mora no catalogo e nao no template.
     A tela escreve "governa mais perto DO Centrao" e "DA Esquerda" — a contracao
     pede genero, e genero e propriedade do nome. Montada na view, ela viraria uma
     tabela de excecoes escondida numa string, e o quinto bloco que o catalogo
     ganhasse sairia com a preposicao errada sem nada acusar. */
  article: { kind: "text" },
  economic: { kind: "number", min: 0, max: 100 },
  liberty: { kind: "number", min: 0, max: 100 },
  venalityEconomic: { kind: "number", min: 0, max: 1 },
  venalityLiberty: { kind: "number", min: 0, max: 1 },
  seats: { kind: "number", min: 0, max: 513 },
};

/**
 * @typedef {object} Party
 * @property {string} id
 * @property {string} label - o nome que a interface mostra; ATRIBUTO, nao identidade
 * @property {string} sigla - a sigla, e ela e o nome CURTO da bancada na tela estreita.
 *   ⚠ TODA SIGLA E INVENTADA e nenhuma existe no registro do TSE. Isso e conferido a
 *   mao e nao por guarda: a ADR 0003 proibe carregar a marca de uma organizacao real,
 *   e sigla e a marca mais curta que existe
 * @property {string} [article] - a contracao com que a prosa se refere a ele: `do`, `da`.
 *   ⚠ OPCIONAL PORQUE UMA BANCADA NEM SEMPRE E UM BLOCO: desde o ELENCO, `benches`
 *   monta bancadas a partir de PESSOAS, e uma pessoa se refere pelo nome — nao ha
 *   contracao a fazer com "Onofre Bastos Quirino". O campo e do vocabulario dos
 *   quatro blocos do catalogo, e `catalogViolations` cobra os quatro.
 * @property {number} economic
 * @property {number} liberty
 * @property {number} venalityEconomic - o preco de ceder em pauta economica
 * @property {number} venalityLiberty - o preco de ceder em liberdades individuais
 * @property {number} seats
 */

/* As 513 cadeiras da Camara, repartidas. O total e conferido pela suite: uma
   soma que nao fecha 513 nao e erro de digitacao inofensivo, e uma votacao cujo
   quorum nunca bate.

   A ASSIMETRIA DE CADA BLOCO tem razao declarada, e nao e enfeite:

     esquerda        cede um pouco em economia por cargo, quase nada em costumes
     centro-esquerda hibrida nos dois, e e por isso que ela e a fiel da balanca
     centrao         vende quase tudo, e ainda assim menos em costumes — e nele
                     que a bancada de fe mora enquanto ela nao existir sozinha
     direita-liberal O INVERSO EXATO: nao entrega a pauta economica por preco
                     nenhum, e negocia costumes com relativa facilidade */
/* ── ONDE CADA BLOCO CAI NO EIXO, E ISSO PASSOU A VIR DA REALIDADE ───────────
   ⚠ A POSICAO DA ESQUERDA FOI RECALIBRADA EM 20/08/2026 contra o espectro partidario
   brasileiro, com a lista de registrados no TSE como fonte:
   https://www.tse.jus.br/partidos/partidos-registrados-no-tse

   ⚠ E O QUE ENTROU FOI A POSICAO, E NUNCA O NOME. A ADR 0003 e explicita nos dois
   sentidos: "organizacoes que agem como personagem ganham nome proprio inventado em vez
   de carregarem a marca de uma organizacao real" — e um partido aqui negocia, vende voto
   e tem venalidade medida, entao ele E personagem. Mas a mesma ADR diz que os ARQUETIPOS
   politicos continuam reais, porque "centrao" e "bancada ruralista" descrevem fenomenos
   e nao pessoas. Posicao no eixo e fenomeno.

   ── O DEFEITO QUE A MEDICAO ACHOU ─────────────────────────────────────────────
   Com a esquerda em **20**, o modelo punha **73 cadeiras medias no primeiro quinto do
   eixo** — a faixa da intervencao maxima, que e onde mora o marxismo revolucionario. No
   Brasil real essa faixa nao tem **uma unica cadeira** na Camara: as legendas dela sao
   pequenas e sem representacao federal.

   A esquerda brasileira COM ASSENTO e desenvolvimentista e estatizante, e nao
   revolucionaria: ela cede em economia por cargo, que e o que a venalidade dela ja dizia
   neste mesmo catalogo — e quem recusa o mercado por principio nao cede por cargo. Em 32
   ela cai no segundo quinto, que e onde ela esta.

   ── ⚠ E O EIXO DAQUI NAO E A REGUA ESQUERDA-DIREITA ───────────────────────────
   Esta e a correcao que quase me fez errar duas posicoes de uma vez. O eixo do modelo e
   ECONOMICO — "0 e maxima intervencao, 100 e maximo mercado" —, e o espectro de
   IDENTIDADE (extrema esquerda ... extrema direita) e outra regua. As duas se parecem
   nas pontas e divergem no meio, e e no meio que mora o Congresso brasileiro:

     · o CENTRAO fica em **70** e nao no centro, e a razao e a Camara real: o bloco que
       detem a fatia do orcamento e opera a maquina — o mesmo que este catalogo modela
       com venalidade 0,95 — vota com o mercado quando o mercado paga. Move-lo para o
       centro por causa do NOME seria desenhar a regua de identidade por cima da
       economica, e ai a fita passaria a mentir sobre quem entrega voto por dinheiro;
     · a DIREITA LIBERAL fica em **92** sem ser "extrema direita" de identidade: maximo
       mercado e uma posicao economica, e o liberalismo classico nao e reacionarismo. A
       fita nomeia os polos dela pelo que eles sao — *intervencao* e *mercado* —, e nunca
       "esquerda" e "direita", exatamente por isto.

   ── ⚠ E A DISTRIBUICAO DE CADEIRAS NAO FOI MEXIDA, de proposito ───────────────
   Ela e ACHADO, e nao conserto. Medido contra a Camara eleita: o modelo tem ~204
   cadeiras a esquerda do centro e ~104 na direita liberal; a Camara real tem ~130 a
   esquerda e ~266 somando direita fisiologica e liberal. **O Congresso do jogo pende
   para a esquerda e o de verdade pende para a direita**, e corrigir isso muda a
   DIFICULDADE do jogo inteiro — um presidente de esquerda joga outro jogo. Quem decide
   isso e o responsavel. Ver o achado 40 na retomada. */
/** @type {ReadonlyArray<Party>} */
export const PARTIES = [
  {
    /* ≈ a frente socialista das pautas de direitos humanos e identidade: pequena,
       a mais ideologica da Camara, e a que menos vende. */
    id: "frente-socialista",
    label: "Frente Socialista Popular",
    sigla: "FSP",
    article: "da",
    economic: 24,
    liberty: 92,
    venalityEconomic: 0.1,
    venalityLiberty: 0.05,
    seats: 14,
  },
  {
    /* ≈ a maior legenda da centro-esquerda, em federacao com a comunista
       institucional e a ambientalista. Desenvolvimentista, estatizante e
       PRAGMATICA: ela cede em economia por cargo, e quase nada em costumes. */
    id: "trabalhistas-unidos",
    label: "Partido dos Trabalhadores Unidos",
    sigla: "PTU",
    article: "do",
    economic: 30,
    liberty: 78,
    venalityEconomic: 0.3,
    venalityLiberty: 0.1,
    seats: 80,
  },
  {
    /* ≈ o trabalhismo e o socialismo de frente ampla: educacao publica, soberania
       e composicao com quem governa. E ela a fiel da balanca. */
    id: "socialistas",
    label: "Partido Socialista Unificado",
    sigla: "PSU",
    article: "do",
    economic: 38,
    liberty: 72,
    venalityEconomic: 0.45,
    venalityLiberty: 0.3,
    seats: 31,
  },
  {
    /* ≈ a federacao historica de caciques regionais: compoe governo de qualquer
       matriz, e o preco dela e cargo e emenda. */
    id: "democratas-nacionais",
    label: "Movimento Democrático Nacional",
    sigla: "MDN",
    article: "do",
    economic: 55,
    liberty: 45,
    venalityEconomic: 0.9,
    venalityLiberty: 0.65,
    seats: 42,
  },
  {
    /* ≈ a legenda de capilaridade municipal somada aos restos da social-democracia:
       governabilidade acima de doutrina. */
    id: "social-municipalista",
    label: "Partido Social Municipalista",
    sigla: "PSM",
    article: "do",
    economic: 60,
    liberty: 42,
    venalityEconomic: 0.92,
    venalityLiberty: 0.6,
    seats: 71,
  },
  {
    /* ≈ a federacao que detem a maior fatia do orcamento e opera a maquina publica.
       E o bloco que o jogo chama de CENTRAO: vende quase tudo em economia, e menos
       em costumes. */
    id: "uniao-progressista",
    label: "União Progressista Brasileira",
    sigla: "UPB",
    article: "da",
    economic: 72,
    liberty: 32,
    venalityEconomic: 0.95,
    venalityLiberty: 0.55,
    seats: 106,
  },
  {
    /* ≈ a maior bancada da Camara: burocracia pragmatica no dinheiro e conservadorismo
       duro nos costumes, somada a bancada de fe. Ela negocia verba e NAO negocia
       pauta de costume. */
    id: "liberais-conservadores",
    label: "Partido Liberal Brasileiro",
    sigla: "PLB",
    article: "do",
    economic: 78,
    liberty: 26,
    venalityEconomic: 0.7,
    venalityLiberty: 0.25,
    seats: 145,
  },
  {
    /* ≈ o liberalismo economico classico: privatizacao, Estado menor, e a recusa de
       vender a propria pauta economica por preco algum. O INVERSO EXATO do centrao. */
    id: "liberais",
    label: "Partido Livre",
    sigla: "PLV",
    article: "do",
    economic: 94,
    liberty: 65,
    venalityEconomic: 0.08,
    venalityLiberty: 0.4,
    seats: 18,
  },
  {
    /* ≈ o nacionalismo militarista de retorica antissistema. Pequeno, e o que menos
       negocia costume em toda a Camara. */
    id: "nacionalistas",
    label: "Partido Nacionalista Renovador",
    sigla: "PNR",
    article: "do",
    economic: 68,
    liberty: 12,
    venalityEconomic: 0.35,
    venalityLiberty: 0.05,
    seats: 6,
  },
];

/* O TAMANHO DA CAMARA E AS MAIORIAS MUDARAM DE ENDERECO. Elas nao sao atributo
   das bancadas: sao regra da casa, e agora moram em `regime.mjs` junto com a
   duracao do mandato. Reexportar daqui manteria dois caminhos para o mesmo
   valor, que e como um deles vira o desatualizado. */
