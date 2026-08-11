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

   ── SEIS, E ELAS SE ENCAIXAM ─────────────────────────────────────────────────
   Nao sao seis paineis paralelos. Cada area empurra uma parte DIFERENTE do
   modelo, e o desenho e uma cadeia fechada:

     Fazenda      financia todas as outras;
     Producao     devolve para a Fazenda, via PIB;
     Previdencia  E a despesa obrigatoria, em pessoa;
     Saude        abandonada, faz a obrigatoria subir;
     Seguranca    idem, pelo sistema prisional;
     Educacao     alimenta a capacidade da Producao — daqui a dois anos.

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
  decay: { kind: "number", min: 0, max: 5 },
  yield: { kind: "number", min: 0, max: 5 },
  feeds: { kind: "text" },
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
 * @property {number} decay - quanto o indice cai por mes sem alocacao nenhuma
 * @property {number} yield - quanto o indice sobe por bilhao alocado no mes
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

/* A CALIBRAGEM E PRIMEIRO CHUTE e esta declarada como tal, igual a de ECLUSA.
   O que NAO e chute e a RAZAO entre os numeros, e ela carrega o desenho:

     · SEGURANCA decai mais rapido (0,7) e rende mais rapido (0,9) que todas.
       E a alavanca populista: some em meses e volta em meses, entao ela sempre
       parece urgente e sempre parece resolvivel;
     · EDUCACAO quase nao decai (0,3) e rende pouco (0,4), mas leva 24 meses
       para pagar. Abandona-la nao doi neste mandato — e esse e o ponto;
     · PREVIDENCIA tem `lag` zero porque ela nao "afeta" a obrigatoria: ela e a
       obrigatoria. Mexeu, sentiu no mesmo mes;
     · SAUDE decai rapido (0,6) porque fila e desabastecimento aparecem em
       semanas, e o custo de abandona-la volta em 3 meses pela porta da
       judicializacao e da emergencia. */
/** @type {ReadonlyArray<Area>} */
export const AREAS = [
  {
    id: "treasury",
    label: "Fazenda",
    index: "arrecadação",
    initial: 72,
    decay: 0.4,
    yield: 0.8,
    feeds: "revenue",
    force: 0.25,
    lag: 0,
  },
  {
    id: "production",
    label: "Produção",
    index: "capacidade",
    initial: 57,
    decay: 0.5,
    yield: 0.6,
    feeds: "revenue",
    force: 0.2,
    /* Obra nao vira PIB no mes em que o cheque e assinado. Seis meses e o
       intervalo curto do catalogo, e existe para a Producao nao ser um botao de
       receita instantanea — se fosse, ela dominaria a Fazenda. */
    lag: 6,
  },
  {
    id: "welfare",
    label: "Previdência",
    index: "cobertura",
    initial: 71,
    decay: 0.3,
    yield: 0.5,
    feeds: "mandatory",
    force: 0.3,
    lag: 0,
  },
  {
    id: "health",
    label: "Saúde",
    index: "atendimento",
    initial: 61,
    decay: 0.6,
    yield: 0.7,
    feeds: "mandatory",
    force: -0.18,
    lag: 3,
  },
  {
    id: "education",
    label: "Educação",
    index: "formação",
    initial: 44,
    decay: 0.3,
    yield: 0.4,
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
    decay: 0.7,
    yield: 0.9,
    feeds: "mandatory",
    force: -0.14,
    lag: 3,
  },
];

/* PARA ONDE A CAPACIDADE DA EDUCACAO VAI. Declarado aqui, e nao dentro do
   motor: e uma afirmacao sobre o mundo do jogo — "gente formada faz o parque
   produtivo render" —, e afirmacao sobre o mundo mora no catalogo. */
export const CAPACITY_TARGET = "production";
