/* AS AREAS DE GOVERNO — onde o presidente pensa que esta mexendo.
   ══════════════════════════════════════════════════════════════════════════════

   ⚠ FICCAO com inspiracao na realidade, como todo o catalogo. Nenhum numero aqui
   cita fonte porque nenhum e afirmacao sobre o Brasil.

   ── POR QUE AREA, E NAO MOTOR NEM INSTRUMENTO ────────────────────────────────
   A navegacao ja foi organizada de duas formas erradas antes desta. Por MOTOR
   (`congress`, `economy`, `opinion`) e um menu com formato de codigo: ninguem
   acorda querendo visitar o motor de opiniao. Por INSTRUMENTO (lei, emenda,
   decreto) e um menu com formato de regra: obriga a saber o rito antes de achar
   o assunto.

   Presidente pensa em ASSUNTO. Quem quer mexer na saude entra em Saude e
   encontra la tudo o que da para fazer a respeito — alocar verba, pautar lei,
   decretar. O instrumento vira ETIQUETA na linha, e continua valendo tudo o que
   valia: e ele que decide se sao 257 votos, 308, ou nenhum.

   ── OITO, E ELAS SE ENCAIXAM ─────────────────────────────────────────────────
   Nao sao oito paineis paralelos. Cada area empurra uma parte DIFERENTE do
   modelo, e o desenho e uma cadeia fechada:

     Fazenda      financia todas as outras;
     Agricultura  devolve para a Fazenda, via PIB — e tem bancada propria;
     Industria    devolve pela mesma porta, e e a que depende da Educacao;
     Previdencia  E a despesa obrigatoria, em pessoa;
     Saude        abandonada, faz a obrigatoria subir;
     Seguranca    idem, pelo sistema prisional;
     Educacao     alimenta a capacidade da Industria — daqui a dois anos;
     Defesa       cuidada, encarece — e e o unico indice cujo motivo de existir
                  ainda nao existe: ela vai ser o escudo contra a ruptura.

   O `lag` da educacao e 24 de proposito, e ele e o dilema politico mais honesto
   que este jogo consegue produzir: o retorno chega DEPOIS do mandato acabar.
   Quem investe nela paga o custo e nao colhe o beneficio; quem a abandona so e
   cobrado pelo sucessor.

   ── O INDICE, E POR QUE ATE A FAZENDA TEM UM ────────────────────────────────
   Toda area tem um indice de 0 a 100 que decai sozinho e sobe com verba. A
   Fazenda quase ficou de fora — ela tem receita, nao "servico" — e isso teria
   quebrado o molde e obrigado a interface a ter duas telas de area em vez de
   uma. O indice dela e ARRECADACAO: a eficiencia da cobranca, que erode sozinha
   quando ninguem fiscaliza e responde a investimento em maquina de arrecadar.
   E real, e faz as seis serem a mesma coisa. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/* PARA ONDE O INDICE VOLTA. Tres canais, e nenhuma area usa dois — se usasse,
   o efeito de uma alocacao ficaria impossivel de atribuir, que e exatamente o
   defeito que o motor de propagacao existe para nao ter.

     revenue   — multiplica a receita do exercicio;
     mandatory — indice baixo EMPURRA a despesa obrigatoria para cima;
     capacity  — alimenta o indice de outra area, e por isso e o unico com
                 atraso longo. */
export const CHANNELS = /** @type {const} */ (["revenue", "mandatory", "capacity"]);

/** @type {Schema} */
export const AREA_SCHEMA = {
  id: { kind: "id" },
  label: { kind: "text" },
  index: { kind: "text" },
  initial: { kind: "number", min: 0, max: 100 },
  /* FRACAO DO ESTOQUE POR MES, e nao pontos por mes — ver a prosa de `decay`
     abaixo e o cabecalho da MALHA. O teto de 1 e a natureza da coisa: uma area que
     perdesse mais que 100% do que tem por mes nao e uma area, e um erro de digitacao. */
  decay: { kind: "number", min: 0, max: 1 },
  yield: { kind: "number", min: 0, max: 5 },
  feeds: { kind: "text", values: CHANNELS },
  force: { kind: "number", min: -10, max: 10 },
  lag: { kind: "number", min: 0, max: 48 },
};

/* O PONTO NEUTRO. Acima dele o indice ajuda, abaixo ele cobra — e nao existe
   area que "so ajuda". Fixo em 50 e nao por area de proposito: se cada uma
   tivesse o seu, comparar dois indices na faixa da Mesa deixaria de significar
   coisa alguma, e a faixa e justamente para comparar. */
export const NEUTRAL = 50;

/**
 * @typedef {object} Area
 * @property {string} id
 * @property {string} label - o nome que a interface mostra; ATRIBUTO, nao identidade
 * @property {string} index - como se chama o indice desta area
 * @property {number} initial - o indice de abertura, de 0 a 100
 * @property {number} decay - a FRACAO do indice que vaza por mes
 *
 * ⚠ ELE MUDOU DE NATUREZA EM 16/08/2026, e a mudanca e o achado 31 — o defeito mais
 * fundo ja medido aqui. Ate essa data ele era PONTOS por mes, subtraidos do indice, e
 * com isso o indice era um integrador puro: nao existia equilibrio em lugar nenhum, e
 * cada area tinha um destino unico para a partida inteira. Medido: um governo que nao
 * fazia nada via os OITO indices subirem, industria de 48 a 100.
 *
 * ⚠ E OS OITO NUMEROS NAO FORAM ESCOLHIDOS NO OLHO — cada um sai da identidade que
 * poe o ORCAMENTO DA POSSE no ponto de equilibrio da area:
 *
 *     decay ≡ yield × gasto_cheio_herdado / indice_herdado
 *
 * O equilibrio de uma area e `yield × gasto / decay`; substituindo, ele da exatamente
 * o indice de abertura quando o gasto e o herdado. Manter o que se herdou mantem o
 * pais parado — e essa e a afirmacao que o jogo precisava e nao tinha.
 *
 * ⚠ E ELA CUSTOU UMA AFIRMACAO DE DESENHO, declarada aqui em vez de escondida. A
 * ordem "quem decai rapido" era escolhida a mao, e agora e DERIVADA: a velocidade de
 * uma area passou a ser o inverso do custo por ponto dela (`gasto/indice`). Sete das
 * oito ordens sobreviveram — seguranca e industria continuam as mais rapidas,
 * educacao a mais lenta. **A saude nao**: a prosa de calibragem abaixo diz que ela
 * "decai rapido porque fila e desabastecimento aparecem em semanas", e a identidade a
 * poe entre as mais lentas, porque ela custa R$ 0,33 bi por ponto — cinco vezes o
 * preco de um ponto de seguranca. A colisao e real e fica REGISTRADA: ou a saude e
 * cara demais por ponto no catalogo, ou a frase envelheceu. E achado, e nao conserto.
 * @property {number} yield - quanto o indice sobe por bilhao GASTO no mes na area
 *
 * ⚠ O RENDIMENTO MUDOU DE REFERENCIA EM 14/08/2026, e os numeros cairam uma ordem
 * de grandeza sem que o comportamento de abertura mudasse um decimal. Ate aqui ele
 * media pontos de indice por bilhao ACIMA DO PISO; agora mede por bilhao GASTO na
 * area, piso incluido.
 *
 * A troca conserta o exploit que a politica `explorador` do simulador mediu:
 * derrubar o piso da saude a zero nao muda um real do que o pais gasta em saude,
 * mas movia o gasto inteiro para o balde discricionario — e aquele mesmo dinheiro
 * passava a comprar indice. O mandato terminava com os oito indices em 100 e a
 * divida caindo vinte pontos, sem contraparte nenhuma. O que constroi hospital e o
 * dinheiro que chega ao hospital, e nao o rotulo juridico dele.
 *
 * ⚠ E ELES NAO FORAM ESCOLHIDOS NO OLHO. Cada um saiu de uma identidade, area por
 * area, que preserva EXATAMENTE o empurrao do primeiro mes:
 *
 *     yield_novo × gastoCheio_abertura  ≡  yield_velho × gastoAcimaDoPiso_abertura
 *
 * Por isso a previdencia despencou de 0,5 para 0,0096: ela gasta R$ 126,8 bi por
 * mes e so R$ 2,4 bi disso estavam acima do piso — a razao entre os dois e
 * cinquenta e dois. Um numero pequeno aqui nao diz "a previdencia rende pouco",
 * diz "a previdencia gasta muito", e a distincao e a diferenca entre uma
 * recalibragem e uma troca de regua.
 * @property {string} feeds - o canal de realimentacao; um de `CHANNELS`
 * @property {number} force - com que forca o indice age no canal, COM SINAL
 * @property {number} lag - meses ate o efeito chegar ao canal
 */

/* O SINAL DE `force` CARREGA A DIRECAO, e sem ele o molde nao fecharia. Duas
   areas do mesmo canal empurram para lados opostos, e isso nao e inconsistencia
   — e o mundo:

     SAUDE e SEGURANCA no canal `mandatory` tem forca NEGATIVA: servico bom
     REDUZ a obrigatoria, porque fila vira judicializacao e desordem vira
     presidio. Abandonar cobra;
     PREVIDENCIA no MESMO canal tem forca POSITIVA: cobertura boa AUMENTA a
     obrigatoria, porque beneficio pago e despesa. Cuidar cobra.

   A alternativa era um campo `direction` separado, que seria a mesma
   informacao em dois lugares. A unidade de `force` depende do canal, e isso
   esta declarado: fracao da receita em `revenue`, fracao da obrigatoria em
   `mandatory`, e PONTOS DE INDICE POR MES em `capacity`. */

/* ⚠ O DECAIMENTO DEIXOU DE SER CHUTE EM 16/08/2026 — ele e DERIVADO, area por area,
   pela identidade escrita no `@property {number} decay` acima. O que segue chute e o
   `yield`, o `force` e o `lag`, e eles continuam declarados como tal.

   O que a identidade produz, em meia-vida do estoque sem verba nenhuma:

     industria    12 meses      previdencia   40 meses      defesa     78 meses
     seguranca    16 meses      treasury      55 meses      educacao   79 meses
                                agricultura   61 meses      saude      63 meses

   E a leitura do desenho MUDOU DE LUGAR, porque a velocidade agora e consequencia do
   custo por ponto de cada area (`gasto_herdado / indice`) e nao de uma escolha:

     · SEGURANCA continua a alavanca populista, e agora com a razao explicita: ela
       custa R$ 0,07 bi por ponto, o mais barato do catalogo. Some em meses e volta em
       meses porque e barata, e nao porque alguem digitou 0,7;
     · INDUSTRIA e a mais rapida das oito, e ela e o motivo: 60% do gasto dela e
       discricionario, entao ela e a area que mais sente um aperto de caixa;
     · EDUCACAO segue a mais lenta, e o `lag` de 24 meses continua sendo o dilema —
       abandona-la nao doi neste mandato;
     · PREVIDENCIA tem `lag` zero porque ela nao "afeta" a obrigatoria: ela E a
       obrigatoria. Mexeu, sentiu no mesmo mes;
     · ⚠ SAUDE e a colisao registrada. A frase antiga dizia que ela "decai rapido
       porque fila e desabastecimento aparecem em semanas"; a identidade a poe entre as
       mais lentas, porque no catalogo ela custa R$ 0,33 bi por ponto — cinco vezes o
       preco de um ponto de seguranca. Uma das duas afirmacoes esta errada, e decidir
       qual e recalibragem de `yield` ou de `cost`, e nao conserto de decaimento. */
/** @type {ReadonlyArray<Area>} */
export const AREAS = [
  {
    id: "treasury",
    label: "Fazenda",
    index: "arrecadação",
    initial: 72,
    decay: 0.012442,
    yield: 0.0674,
    feeds: "revenue",
    force: 0.25,
    lag: 0,
  },
  /* ── AGRICULTURA E INDUSTRIA, e elas eram UMA ────────────────────────────────
     "Producao" carregava Plano Safra, BNDES, desoneracao, rodovia e ciencia na
     mesma tela. O corte em duas nao e organizacional — e POLITICO, e a razao cabe
     numa frase: a bancada ruralista e um bloco real no Congresso, e um modelo que
     trata agro e industria como a mesma coisa nao consegue representa-la. Enquanto
     as duas eram uma area, "cortar a Producao" era um gesto so; agora sao dois
     gestos com dois inimigos diferentes.

     ⚠ A SOMA DAS DUAS FORCAS E A FORCA QUE A PRODUCAO TINHA (0,20). Dividir uma
     area em duas nao pode aumentar o efeito dela sobre a receita — se aumentasse,
     a recalibragem teria acontecido de contrabando, dentro de uma mudanca que se
     anunciava como organizacao.

     OS INDICES DE ABERTURA SAO UMA AFIRMACAO SOBRE O PAIS: agro competitivo em 63,
     parque industrial encolhido em 48. A media continua perto dos 57 de antes, e a
     diferenca entre os dois e a heranca que o jogador recebe — um setor que rende
     sem ele e outro que so anda se ele empurrar. */
  {
    id: "agriculture",
    label: "Agricultura",
    index: "safra",
    initial: 63,
    /* DECAI DEVAGAR: a lavoura nao desaba no mes em que o crédito atrasa, e o
       ciclo dela e anual e nao mensal. */
    decay: 0.01138,
    yield: 0.3054,
    feeds: "revenue",
    force: 0.08,
    lag: 6,
  },
  {
    id: "industry",
    label: "Indústria e Infraestrutura",
    index: "capacidade",
    initial: 48,
    decay: 0.056913,
    yield: 0.358,
    feeds: "revenue",
    force: 0.12,
    /* Obra nao vira PIB no mes em que o cheque e assinado. Seis meses e o
       intervalo curto do catalogo, e existe para a area nao ser um botao de
       receita instantanea — se fosse, ela dominaria a Fazenda. */
    lag: 6,
  },
  {
    id: "welfare",
    label: "Previdência",
    index: "cobertura",
    initial: 71,
    decay: 0.017147,
    yield: 0.0096,
    feeds: "mandatory",
    force: 0.3,
    lag: 0,
  },
  {
    id: "health",
    label: "Saúde",
    index: "atendimento",
    initial: 61,
    decay: 0.010983,
    yield: 0.0335,
    feeds: "mandatory",
    force: -0.18,
    lag: 3,
  },
  {
    id: "education",
    label: "Educação",
    index: "formação",
    initial: 44,
    decay: 0.008788,
    yield: 0.0356,
    feeds: "capacity",
    force: 6,
    /* DOIS ANOS. O numero e o desenho: um mandato tem 48 meses, entao investir
       em educacao no segundo ano so paga no quarto, e investir no terceiro nao
       paga nunca — para quem investiu. */
    lag: 24,
  },
  {
    id: "security",
    label: "Segurança",
    index: "ordem",
    initial: 38,
    decay: 0.041885,
    yield: 0.6358,
    feeds: "mandatory",
    force: -0.14,
    lag: 3,
  },
  /* ── DEFESA, a setima, e ela entra por uma razao que ainda nao esta no motor ─
     Ela nasceu em 13/08/2026, e o argumento nao foi de completude: a folha
     militar estava enterrada dentro de "pessoal do Executivo" e os projetos
     estrategicos nao existiam em lugar nenhum — 130 bilhoes ao ano sem endereco.
     Isso ja era motivo, mas nao o principal.

     O PRINCIPAL E QUE ELA VAI SER O ESCUDO E A AMEACA. Quando a tensao
     institucional entrar, o risco de ruptura depende de com quem as Forcas
     Armadas estao — e "com quem elas estao" precisa ser um indice que o jogador
     move com dinheiro ao longo de 48 meses, e nao um numero que aparece no mes em
     que ele tenta a jogada radical. Escudo que so existe quando e usado nao e
     escudo: e desculpa.

     ⚠ POR ENQUANTO ELA ALIMENTA `mandatory`, e isso e endereco provisorio
     declarado. Prontidao alta encarece a obrigatoria — 78% do orcamento militar e
     folha e inativo, e cuidar dela cobra, exatamente como a previdencia. O canal
     VERDADEIRO dela e o alinhamento, que nao tem motor. Ficar sem canal nenhum
     seria pior: uma area cujo indice nao faz nada e uma tela que ensina o jogador
     a nao olhar.

     DECAI DEVAGAR E RENDE DEVAGAR, e e a unica assim: equipamento militar dura
     decadas e leva uma para chegar. Abandonar a Defesa nao doi neste mandato — e
     e por isso que quem precisar dela na hora do aperto vai descobrir que devia
     ter comecado no primeiro ano. */
  {
    id: "defense",
    label: "Defesa",
    index: "prontidão",
    initial: 51,
    decay: 0.0088,
    yield: 0.0415,
    feeds: "mandatory",
    force: 0.12,
    lag: 12,
  },
];

/* PARA ONDE A CAPACIDADE DA EDUCACAO VAI. Declarado aqui, e nao dentro do
   motor: e uma afirmacao sobre o mundo do jogo — "gente formada faz o parque
   produtivo render" —, e afirmacao sobre o mundo mora no catalogo.

   ELA APONTA PARA A INDUSTRIA, e nao para a agricultura, e a escolha e de modelo:
   o agro brasileiro rende com tecnologia embarcada e pouca gente, e a industria e
   quem consome formacao em escala. Um pais que abandona a escola perde o parque
   produtivo primeiro. */
export const CAPACITY_TARGET = "industry";
