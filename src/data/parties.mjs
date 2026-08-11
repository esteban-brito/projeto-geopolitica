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
     `cultural` — pauta de costumes. 0 e maximo conservadorismo, 100 e maximo
                  progressismo.

   Duas dimensoes e nao uma porque o eixo unico esquerda-direita nao consegue
   representar o caso mais comum do Congresso brasileiro: a bancada liberal na
   economia e conservadora nos costumes. Num eixo so ela teria de ficar em algum
   lugar do meio, que e onde ela justamente nao esta.

   ── A VENALIDADE ─────────────────────────────────────────────────────────────
   `venality` (0 a 1) e o quanto a distancia ideologica CEDE a dinheiro — nao o
   tamanho da resistencia. A distincao decide a formula inteira, e o dossie de
   origem a trocou: la a resistencia era MULTIPLICADA pela venalidade, o que
   deixava a direita liberal (0,10) com um decimo da resistencia ideologica, ou
   seja, comprada de graca. E o oposto do comportamento descrito na mesma
   tabela. Ver `src/domain/congress/` para a forma corrigida. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const PARTY_SCHEMA = {
  id: { kind: "id" },
  label: { kind: "text" },
  economic: { kind: "number", min: 0, max: 100 },
  cultural: { kind: "number", min: 0, max: 100 },
  venality: { kind: "number", min: 0, max: 1 },
  seats: { kind: "number", min: 0, max: 513 },
};

/**
 * @typedef {object} Party
 * @property {string} id
 * @property {string} label - o nome que a interface mostra; ATRIBUTO, nao identidade
 * @property {number} economic
 * @property {number} cultural
 * @property {number} venality
 * @property {number} seats
 */

/* As 513 cadeiras da Camara, repartidas. O total e conferido pela suite: uma
   soma que nao fecha 513 nao e erro de digitacao inofensivo, e uma votacao cujo
   quorum nunca bate. */
/** @type {ReadonlyArray<Party>} */
export const PARTIES = [
  { id: "esquerda", label: "Esquerda", economic: 20, cultural: 80, venality: 0.15, seats: 108 },
  {
    id: "centro-esquerda",
    label: "Centro-esquerda",
    economic: 45,
    cultural: 70,
    venality: 0.4,
    seats: 96,
  },
  { id: "centrao", label: "Centrão", economic: 70, cultural: 35, venality: 0.95, seats: 205 },
  {
    id: "direita-liberal",
    label: "Direita liberal",
    economic: 92,
    cultural: 60,
    venality: 0.1,
    seats: 104,
  },
];

/** O total de cadeiras da Camara dos Deputados. */
export const SEATS = 513;

/** Votos necessarios para maioria simples, com o plenario cheio. */
export const SIMPLE_MAJORITY = Math.floor(SEATS / 2) + 1;
