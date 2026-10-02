/* A PLATAFORMA DE POSSE — o que o presidente prometeu antes de ter o cargo.
   ⚠ O JOGO GERAVA UM PRESIDENTE SEM UMA PROMESSA, e na vida real e o inverso: quem chega ao
   cargo chega devendo o que disse na campanha, e e contra isso que ele e medido por quatro
   anos. Cada compromisso aqui e uma pergunta que o MOTOR sabe responder sozinho — nenhum
   deles precisa de número novo, e e por isso que são estes três eixos e não outros. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/**
 * @typedef {object} Pledge um compromisso que o jogador pode assumir
 * @property {string} id
 * @property {string} axis - o eixo a que ele pertence
 * @property {string} label - a promessa inteira, na boca do candidato. E ela e do FECHO: e la
 * que "entregar ordem acima do que recebi — não cumprida" precisa estar por extenso
 * @property {string} short - o nome do compromisso na carta, em duas palavras. ⚠ A CARTA NAO
 * REPETE A FRASE: o eixo já diz "A PRIORIDADE", e o botão só precisa dizer QUAL
 * @property {string} judged - como ela e julgada, dito para quem vai ser julgado
 */

const AXES = /** @type {const} */ (["priority", "fiscal", "reform"]);

/** @type {Schema} */
export const PLEDGE_SCHEMA = {
  id: { kind: "id" },
  axis: { kind: "text", values: AXES },
  label: { kind: "text" },
  short: { kind: "text" },
  judged: { kind: "text" },
};

/* ⚠ QUANTAS ÁREAS ENTRAM NA LISTA DE PRIORIDADE, e elas NÃO são digitadas aqui: são as que o
   país entrega piores, lidas do catálogo por `initial`. Escrever os três ids seria uma segunda
   verdade sobre quais são as áreas fracas, e ela mentiria no dia em que uma abertura mudasse. */
export const PRIORITY_COUNT = 3;

/* ⚠ AS DUAS METAS FISCAIS SÃO AS QUE O ESTADO JÁ GUARDA: a razão divida/PIB, contra a que foi
   herdada, e a série do primário. Uma terceira meta — "não contingenciar" — foi medida e
   RECUSADA: o contingenciamento e do relatório do mês e não vai para o estado, e prometer o
   que o save não guarda seria uma promessa que não se pode julgar depois de um F5. */

/* ⚠ E NENHUMA DELAS TEM NÚMERO ESCOLHIDO. O alvo de cada uma e o que o presidente RECEBEU:
   a dívida da posse, e o zero do primário. Um "abaixo de 90%" seria número inventado. */

/** @type {ReadonlyArray<Pledge>} */
export const PLEDGES = [
  {
    id: "debt",
    axis: "fiscal",
    label: "entregar a dívida menor do que a recebi",
    short: "Dívida menor",
    judged: "a dívida sobre o PIB, contra a do dia da posse",
  },
  {
    id: "primary",
    axis: "fiscal",
    label: "fechar o último ano no azul",
    short: "Ano no azul",
    judged: "a soma do resultado primário dos últimos doze meses",
  },
  /* ── O EIXO DA REFORMA ────────────────────────────────────────────────────── ⚠ ELE E SOBRE
     O INSTRUMENTO, e não sobre qual lei: prometer mexer numa alavanca especifica seria escolher
     a jogada antes de conhecer o Congresso, e o jogo inteiro e sobre descobrir o preço dela.
     ⚠ E O TERCEIRO QUEBRA POR AÇÃO, e não por omissão — e o único assim. */
  {
    id: "law",
    axis: "reform",
    label: "aprovar ao menos uma lei minha",
    short: "Uma lei",
    judged: "uma norma de lei ordinária promulgada neste mandato",
  },
  {
    id: "amendment",
    axis: "reform",
    label: "mudar a Constituição ao menos uma vez",
    short: "Uma emenda",
    judged: "uma emenda promulgada neste mandato",
  },
  {
    id: "keep",
    axis: "reform",
    label: "não mexer na Constituição",
    short: "Não mexer",
    judged: "nenhuma emenda promulgada neste mandato",
  },
];
