/* O ELENCO — o vocabulario com que a republica ganha gente. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/* ⚠ ELAS TINHAM UM ANDAR SOCIAL SO, E ISSO ERA UM DEFEITO DE MATERIA-PRIMA. */

/* ⚠ O GENERO MORA NA MESMA LINHA DO NOME, e nao numa segunda lista: o sinete precisa dele
   para escolher a silhueta, e duas listas paralelas seriam duas fontes da mesma verdade —
   divergiriam no dia em que alguem acrescentasse um nome so numa delas.
   A ORDEM E A MESMA DE ANTES, e isso importa: o gerador sorteia por indice a partir da
   semente, entao reordenar trocaria o elenco inteiro de toda partida ja salva. */

/** @typedef {{ name: string, gender: "f" | "m" }} Given */

/** @type {ReadonlyArray<Given>} */
const GIVEN_NAMES = [
  /* A geracao que ja estava aqui — e ela FICA. */
  { name: "Adalberto", gender: "m" },
  { name: "Belarmino", gender: "m" },
  { name: "Custódio", gender: "m" },
  { name: "Dalva", gender: "f" },
  { name: "Eurico", gender: "m" },
  { name: "Filomena", gender: "f" },
  { name: "Genésio", gender: "m" },
  { name: "Hermínia", gender: "f" },
  { name: "Januário", gender: "m" },
  { name: "Leocádia", gender: "f" },
  { name: "Lourival", gender: "m" },
  { name: "Nazaré", gender: "f" },
  { name: "Onofre", gender: "m" },
  { name: "Quitéria", gender: "f" },
  { name: "Sebastiana", gender: "f" },
  { name: "Ubirajara", gender: "m" },
  { name: "Valdomiro", gender: "m" },
  { name: "Zulmira", gender: "f" },
  /* A GERACAO DO MEIO — quem se elegeu pela primeira vez nos anos 90 e hoje preside comissao. */
  { name: "Adriano", gender: "m" },
  { name: "Beatriz", gender: "f" },
  { name: "Cláudio", gender: "m" },
  { name: "Denise", gender: "f" },
  { name: "Fábio", gender: "m" },
  { name: "Gilmar", gender: "m" },
  { name: "Heloísa", gender: "f" },
  { name: "Jorge", gender: "m" },
  { name: "Márcia", gender: "f" },
  { name: "Nilson", gender: "m" },
  { name: "Renata", gender: "f" },
  { name: "Sérgio", gender: "m" },
  { name: "Vera", gender: "f" },
  { name: "Wagner", gender: "m" },
  /* A GERACAO NOVA — o primeiro mandato. */
  { name: "Bruno", gender: "m" },
  { name: "Camila", gender: "f" },
  { name: "Diego", gender: "m" },
  { name: "Ícaro", gender: "m" },
  { name: "Juliana", gender: "f" },
  { name: "Letícia", gender: "f" },
  { name: "Rafael", gender: "m" },
  { name: "Tainá", gender: "f" },
  { name: "Thiago", gender: "m" },
  { name: "Yasmin", gender: "f" },
];

/** @type {ReadonlyArray<string>} */
export const FIRST_NAMES = GIVEN_NAMES.map(given => given.name);

/** ⚠ Ele nasce da MESMA lista, entao nao ha o que divergir. */
export const GENDER_OF = new Map(GIVEN_NAMES.map(given => [given.name, given.gender]));

/** @type {ReadonlyArray<string>} */
export const SURNAMES = [
  /* SIMPLES — e agora eles sao a MAIORIA, que e a proporcao do pais. */
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
  "Peçanha",
  "Rebouças",
  "Sarmento",
  "Tolentino",
  "Uchôa",
  "Veloso",
  "Xavier",
  "Zamith",
  /* COMPOSTOS — minoria de proposito. */
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

/** @type {ReadonlyArray<string>} */
const OFFICES = ["speaker", "senate", "rapporteur", "leader", "chief"];

/* ── AS AMBICOES ───────────────────────────────────────────────────────────── O que a pessoa
   QUER, e e isso que a distingue de uma bancada. */

/** @type {ReadonlyArray<string>} */
export const AMBITIONS = [
  /* Quer o Planalto em 2030, e por isso ganha com o governo fraco. */
  "succession",
  /* Quer um ministerio. */
  "cabinet",
  /* Quer o governo do proprio estado. */
  "state",
  /* Quer uma vaga no tribunal. */
  "court",
  /* Quer continuar onde esta. */
  "seat",
];

/** @type {Schema} */
export const ARCHETYPE_SCHEMA = {
  id: { kind: "id" },
  label: { kind: "text" },
  bloc: { kind: "id" },
  /* ⚠ E ESTE E O DEFEITO QUE `standards.md` JA NOMEIA — "lista declarada e nao cobrada" —,
     com `CHANNELS` e `FAMILIES` citadas por nome. */
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
   Um por cargo da onda 1, mais um lider por bloco. O `reach` impede a pessoa de virar a
   bancada inteira: o lider arrasta uma parte, e a que ele NAO arrasta continua votando
   pela ideologia do bloco — e e isso que faz compra-lo ser barato e insuficiente ao mesmo
   tempo.

   ⚠ AS FAIXAS SAO PRIMEIRO CHUTE, declarado como o de ECLUSA e o da MALHA. O que NAO e
   chute e a RAZAO entre elas: o presidente da Camara arrasta mais que qualquer lider,
   porque o poder dele vem da mesa e nao da bancada. */

/** @type {ReadonlyArray<Archetype>} */
export const ARCHETYPES = [
  {
    id: "speaker-centrao",
    label: "cacique da Mesa",
    bloc: "liberais-conservadores",
    office: "speaker",
    /* Ele nao e o centro do proprio bloco: quem chega a presidencia da Camara chega
       negociando com todos, e isso o puxa para o meio do plenario. */
    economicShift: -8,
    libertyShift: 4,
    /* MAIS VENAL QUE O PROPRIO CENTRAO, e nao e cinismo do catalogo: o cargo se conquista
       distribuindo, e quem o conquistou deve favores a todos. */
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
    /* O relator e o cargo mais tecnico e o mais caro: ele nao entrega votos, ele entrega
       TEXTO — e por isso o alcance dele e baixo e o preco nao. */
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
    /* Menos venal que o proprio bloco: quem lidera a esquerda lidera por disciplina, e
       disciplina nao se compra sem custo publico. */
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
  /* ── O CHEFE DA CASA CIVIL — o único que NÃO vota ─────────────────────────── ⚠ ELE EXISTE
     PARA O JOGO TER UMA VOZ, e essa é a função inteira dele. */
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
  courtDrag: { kind: "number", min: 0, max: 1 },
  stateLift: { kind: "number", min: 0, max: 1 },
  seatStreet: { kind: "number", min: 0, max: 1 },
  cabinetLift: { kind: "number", min: 0, max: 1 },
};

/**
 * @typedef {object} CastParameters
 * @property {number} memoryDecay - quanto do saldo de favores sobra a cada mes
 * @property {number} favourWeight - o quanto verba PAGA credita na memoria
 * @property {number} betrayalWeight - o quanto promessa quebrada debita
 * @property {number} memoryCap - o teto do saldo, para os dois lados
 * @property {number} successionDrag - o quanto quem quer 2030 resiste a mais
 * @property {number} courtDrag - o quanto quem quer o tribunal desconta da verba
 * @property {number} stateLift - o quanto a emenda vale a mais para quem quer o governo do
 * proprio estado
 * @property {number} seatStreet - o quanto a rua desloca o que o candidato a reeleicao
 * reconhece, por ponto cheio de aprovacao
 * @property {number} cabinetLift - o quanto a pasta atendida vale para quem quer ministerio
 */

/* E A TRAICAO PESA MAIS QUE O FAVOR, pela mesma razao que a satisfacao de SONDA
   cai tres vezes mais rapido do que sobe: e o achado mais consistente que existe
   sobre reciprocidade, e sem ele o jogo ensinaria que da para queimar alguem e
   comprar de volta pelo mesmo preco. */

/** @type {CastParameters} */
export const CAST = {
  memoryDecay: 0.96,
  favourWeight: 14,
  betrayalWeight: 30,
  memoryCap: 100,
  /* Quem quer o Planalto em 2030 ganha com o governo fraco, e por isso resiste a mais mesmo
     pago. */
  successionDrag: 0.35,
  /* ⚠ AS QUATRO SAO PRIMEIRO CHUTE, como as faixas dos arquetipos — o que nao e chute e a
     RAZAO entre elas, e ela e a mesma em todas: nenhuma chega ao peso da emenda cheia, entao
     nenhuma ambicao decide uma votacao sozinha. */
  /* Dinheiro move pouco quem quer uma toga: metade do que move os outros. Falta o outro lado
     — a indicacao —, e ele nao existe no jogo ainda. */
  courtDrag: 0.5,
  /* Quem vai disputar o proprio estado precisa levar obra para casa, e emenda e o unico
     dinheiro do jogo que ele carimba. */
  stateLift: 0.3,
  /* Governo popular compra mais barato o baixo clero, e governo impopular o perde: com 60% de
     otimo/bom ele reconhece 0,125 de emenda a mais, e com 10% o mesmo tanto a menos. */
  seatStreet: 0.5,
  /* Uma pasta 25% acima do gasto de abertura vale 0,1 de emenda para quem a quer. */
  cabinetLift: 0.4,
};
