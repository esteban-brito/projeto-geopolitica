/* AS PAUTAS — projetos prontos, cada um um ponto no espaco ideologico.
   ══════════════════════════════════════════════════════════════════════════════

   ⚠ FICCAO com inspiracao na realidade, como todo o catalogo. Os titulos evocam
   debates reconheciveis de proposito — reconhecimento e o que faz o jogador ter
   intuicao sobre quem vai votar como —, mas nenhum numero aqui e afirmacao sobre
   proposta real nenhuma.

   PAUTA PRONTA E NAO VETOR LIVRE. O jogador escolhe QUANDO pautar e QUANTO
   liberar, e nao onde a lei fica no mapa. Controle vetorial livre viraria um
   problema de otimizacao — bastaria arrastar o projeto para o meio da maior
   bancada — e o jogo deixaria de ser sobre negociar para ser sobre calibrar um
   cursor.

   ── O TERMO DE AMEACA, e o defeito que ele conserta ──────────────────────────
   `threat` (0 a 1) e o quanto a pauta ataca a MAQUINA — foro privilegiado,
   emendas, cargo, impunidade. Ele existe porque distancia e venalidade sozinhas
   nao conseguem dizer "eu nao voto na lei que me acaba".

   O buraco foi medido, e nao suposto. Rodando o vetor anticorrupcao contra o
   catalogo real, o centrao aparecia como o bloco MAIS PROXIMO (resistencia 23,5
   de um maximo de 141) e o mais barato de comprar — ou seja, ele votaria alegre
   pela propria extincao por preco modico, e a coalizao com a direita liberal
   passava com 309 cadeiras contra 257 necessarias.

   A correcao inverte a relacao habitual. Normalmente a venalidade REDUZ a
   resistencia; numa pauta que ataca a maquina ela a AUMENTA, porque o que esta
   sob ataque e a propria moeda da barganha. Quanto mais fisiologico o bloco,
   mais cara fica para ele — e verba nenhuma compra esse termo. Ver
   `src/domain/congress/`.

   Isso NAO cria muro: a pauta continua votavel, e quem a aprova e coalizao de
   quem nao vive da maquina. Fica caro, nao proibido. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const BILL_SCHEMA = {
  id: { kind: "id" },
  label: { kind: "text" },
  economic: { kind: "number", min: 0, max: 100 },
  liberty: { kind: "number", min: 0, max: 100 },
  threat: { kind: "number", min: 0, max: 1 },
  fiscalImpact: { kind: "number", min: -400, max: 400 },
};

/**
 * @typedef {object} Bill
 * @property {string} id
 * @property {string} label
 * @property {number} economic - posicao no eixo economico
 * @property {number} liberty - posicao no eixo de liberdades individuais
 * @property {number} threat - o quanto ataca a maquina; inegociavel por verba
 * @property {number} fiscalImpact - efeito anual no resultado, em bilhoes;
 *   positivo poupa ou arrecada, negativo custa
 */

/** @type {ReadonlyArray<Bill>} */
export const BILLS = [
  {
    id: "reforma-administrativa",
    label: "Reforma administrativa",
    economic: 78,
    /* QUASE NEUTRA no eixo de liberdades, e a primeira versao errava nisso: ela
       estava em 30, como se enxugar a maquina restringisse a vida das pessoas.
       O erro nao ficou no papel — a medicao mostrou a direita liberal, que
       deveria adorar esta pauta, entregando 30% dela. Posicao errada no
       catalogo vira comportamento errado no plenario. */
    liberty: 48,
    /* Ameaca MODERADA: mexe em cargo e estabilidade, que sao parte da maquina,
       mas nao tocam em foro nem em emenda — o fisiologico perde conforto, e nao
       a impunidade. A primeira versao chutou 0,55 e a medicao mostrou que era
       alto demais: a pauta empacava em 217 de 257 mesmo com verba e lealdade
       cheias, ou seja, virava parede. O numero e calibragem e mora aqui, no
       catalogo, e nao na formula. */
    threat: 0.35,
    fiscalImpact: 48,
  },
  {
    id: "fim-do-foro-privilegiado",
    label: "Fim do foro privilegiado",
    economic: 50,
    /* Acima do meio: submeter autoridade ao mesmo juiz que julga todo mundo E
       liberdade — o privilegio e o que restringe. Posicionada em 44 ela ficava
       longe da esquerda, que na medicao entregava 11% de uma pauta que ela
       deveria encampar. */
    liberty: 58,
    /* O caso extremo, e a razao de o termo existir. Fiscalmente e quase neutra,
       ideologicamente e centrista — sem o termo de ameaca ela passaria facil. */
    threat: 0.95,
    fiscalImpact: 3,
  },
  {
    id: "pec-seguranca-publica",
    label: "PEC da segurança pública",
    economic: 58,
    liberty: 16,
    threat: 0.1,
    fiscalImpact: -22,
  },
  {
    id: "taxacao-grandes-fortunas",
    label: "Taxação de grandes fortunas",
    economic: 12,
    liberty: 68,
    threat: 0.2,
    fiscalImpact: 32,
  },
  {
    id: "programa-habitacional",
    label: "Programa habitacional",
    economic: 26,
    liberty: 62,
    threat: 0.05,
    fiscalImpact: -140,
  },
  {
    id: "abertura-comercial",
    label: "Abertura comercial",
    economic: 95,
    liberty: 58,
    threat: 0.12,
    fiscalImpact: 18,
  },
];
