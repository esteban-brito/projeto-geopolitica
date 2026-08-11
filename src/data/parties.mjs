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
/** @type {ReadonlyArray<Party>} */
export const PARTIES = [
  {
    id: "esquerda",
    label: "Esquerda",
    economic: 20,
    liberty: 80,
    venalityEconomic: 0.2,
    venalityLiberty: 0.1,
    seats: 108,
  },
  {
    id: "centro-esquerda",
    label: "Centro-esquerda",
    economic: 45,
    liberty: 70,
    venalityEconomic: 0.45,
    venalityLiberty: 0.3,
    seats: 96,
  },
  {
    id: "centrao",
    label: "Centrão",
    economic: 70,
    liberty: 35,
    venalityEconomic: 0.95,
    venalityLiberty: 0.6,
    seats: 205,
  },
  {
    id: "direita-liberal",
    label: "Direita liberal",
    economic: 92,
    liberty: 60,
    venalityEconomic: 0.08,
    venalityLiberty: 0.4,
    seats: 104,
  },
];

/** O total de cadeiras da Camara dos Deputados. */
export const SEATS = 513;

/** Votos necessarios para maioria simples, com o plenario cheio. */
export const SIMPLE_MAJORITY = Math.floor(SEATS / 2) + 1;

/* TRES QUINTOS, o quorum de emenda constitucional. Ele obriga a trazer gente que
   nao gosta de voce, e e por isso que a emenda e o lugar natural das moedas que
   nao sao dinheiro.

   O NUMERO SE SUSTENTA NA ENTREGA, e nao na aritmetica de cadeiras — a distincao
   custou uma prova vermelha. Duas duplas SOMAM mais de 308 no papel: esquerda
   mais centrao dao 313, centrao mais direita liberal dao 309. O que nenhuma dupla
   consegue e ENTREGAR 308, porque adesao de bancada nunca e integral nem com
   verba cheia e lealdade cheia. Quem confundir as duas coisas vai concluir que
   uma dupla basta, e vai calibrar o jogo errado. */
export const QUALIFIED_MAJORITY = Math.ceil((SEATS * 3) / 5);
