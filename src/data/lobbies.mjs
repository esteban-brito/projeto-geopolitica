/* OS GRUPOS DE PRESSAO — quem consegue derrubar um presidente.
   ══════════════════════════════════════════════════════════════════════════════

   ⚠ ELES NASCERAM DE UM NUMERO, e nao de uma vontade de ter mais motores. Medido em
   16/08/2026, depois de o orcamento passar a rodar deficit: a politica que NAO TOCA
   EM NADA termina o mandato com a melhor divida do quadro. Governar custa, nao
   governar nao custa, e o contrapeso nao existia — nada podia derrubar o presidente.

   E o ciclo 4 ja tinha escrito a frase dois ciclos antes de ela ter consequencia
   medida: "sem derrota possivel, 'tudo tem preco' era so aritmetica".

   ── LOBBY NAO E SEGMENTO DE OPINIAO, E A DISTINCAO E O MOTIVO DE ISTO EXISTIR ──
   A SONDA responde QUEM APROVA o governo; estes respondem QUEM CONSEGUE DERRUBA-LO.
   Sao perguntas diferentes, e a segunda nao tinha motor.

   ⚠ E POR ISSO A RUA NAO ESTA NESTA LISTA. Um dossie externo propos cinco grupos, e
   o quinto — "as ruas" — leria satisfacao, inflacao e desemprego. A SONDA ja lê os
   tres. Seriam duas verdades sobre a mesma opiniao, e o proprio dossie declarava a
   regra que isso quebra. A rua entra na queda como CONDICAO, e nao como ator: ela e
   a ruptura social, medida onde ela ja e medida.

   ── A REGRA DA EXCLUSAO MUTUA ────────────────────────────────────────────────
   Cada lobby le UM lugar, e nenhum le o mesmo lugar que outro. Dois grupos que
   cobrassem pela mesma coisa pelo mesmo caminho seriam um grupo com dois nomes, e a
   pressao deles seria a mesma variavel contada duas vezes.

     o mercado         o LASTRO      a divida acima da herdada
     o fisiologismo    a ECLUSA      o rateio: quanto da promessa o caixa honrou
     o setor produtivo a MALHA       os indices de agricultura e industria
     as forcas de ordem a MALHA      os indices de seguranca e defesa

   ⚠ OS DOIS ULTIMOS LEEM O MESMO MOTOR E NAO O MESMO LUGAR, e a diferenca importa:
   a MALHA produz um indice POR AREA, e as areas de um sao disjuntas das do outro. O
   que a regra proibe e dois lobbies subindo pelo mesmo numero — e uma safra ruim nao
   move a prontidao militar.

   ── A PRESSAO SOBE POR AUSENCIA DE ENTREGA, E ESSA E A EXIGENCIA CENTRAL ──────
   ⚠ Se ela subisse so por ACAO CONTRARIA, este motor trabalharia contra o proprio
   proposito: o jogador aprenderia que mexer e perigoso e parar e seguro, e o projeto
   teria trocado "nao fazer nada e fiscalmente otimo" por "nao fazer nada e
   politicamente seguro" — a mesma doenca com um motor novo sustentando ela.

   Presidentes caem por paralisia tanto quanto por audacia. Por isso o descontentamento
   de cada grupo e medido contra um PONTO DE SATISFACAO, e nao contra o que o governo
   fez: quem nao entrega esquenta a caldeira do mesmo jeito que quem contraria.

   ── TODOS FICTICIOS, E O ADR 0003 VALE PARA ORGANIZACAO COMO VALE PARA GENTE ──
   Nenhuma entidade real, nenhuma sigla que exista. Os quatro sao ARQUETIPOS
   reconheciveis — o jogador lê "o mercado" e sabe o que esperar, do mesmo jeito que
   lê "Centrao" — e nenhum deles afirma nada sobre uma associacao que existe. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const LOBBY_SCHEMA = {
  id: { kind: "id" },
  label: { kind: "text" },
  /* O QUE ELE COBRA, em uma linha, e ela vai para a tela. */
  wants: { kind: "text" },
  /* A POSICAO NO PLANO, como bloco e pessoa ja tem. Ela existe para o preco de
     agradar um lobby sair da MESMA distancia euclidiana que ECLUSA usa — e nao de
     uma formula nova. */
  economic: { kind: "number", min: 0, max: 100 },
  liberty: { kind: "number", min: 0, max: 100 },
  /* O CANAL: qual motor produz o descontentamento dele. Ver a regra da exclusao
     mutua, acima. */
  reads: { kind: "text", values: ["debt", "share", "capacity"] },
  /* AS AREAS QUE ELE REPRESENTA, e so para quem lê `capacity`. Vazio nos outros. */
  areas: { kind: "text", optional: true },
  /* QUANTO ELE PESA na ruptura economica da queda, de 0 a 1. */
  weight: { kind: "number", min: 0, max: 1 },
};

/**
 * @typedef {object} Lobby
 * @property {string} id
 * @property {string} label
 * @property {string} wants
 * @property {number} economic
 * @property {number} liberty
 * @property {string} reads - `debt`, `share` ou `capacity`
 * @property {string} [areas] - ids separados por espaco; so quando `reads` e `capacity`
 * @property {number} weight
 */

/** @type {ReadonlyArray<Lobby>} */
export const LOBBIES = [
  {
    id: "mercado",
    label: "O mercado",
    /* ELE NAO PEDE LEI, EXIGE SUPERAVIT — e essa e a diferenca dele para os outros
       tres: nao ha o que assinar para agrada-lo, so o que deixar de gastar. */
    wants: "que a dívida pare de crescer",
    /* No extremo liberal do eixo economico, e indiferente no de liberdades: o credor
       da divida nao tem opiniao sobre costumes. */
    economic: 88,
    liberty: 55,
    reads: "debt",
    weight: 0.35,
  },
  {
    id: "fisiologismo",
    label: "O baixo clero",
    /* ⚠ FOME DE EXECUCAO, E NAO IDEOLOGIA. Por isso ele fica no centro dos dois eixos:
       a distancia ideologica dele para qualquer governo e pequena, e o que o move e
       exclusivamente o caixa. E o unico dos quatro que se compra. */
    wants: "que a torneira das emendas fique aberta",
    economic: 50,
    liberty: 50,
    reads: "share",
    weight: 0.3,
  },
  {
    id: "produtivo",
    label: "O setor produtivo",
    wants: "estrada, crédito e safra escoada",
    economic: 76,
    liberty: 58,
    reads: "capacity",
    areas: "agriculture industry",
    weight: 0.35,
  },
  {
    id: "ordem",
    label: "As forças de ordem",
    /* O unico dos quatro que se move no eixo das LIBERDADES, e e por isso que ele
       existe separado: um governo pode agradar o mercado e o produtivo ao mesmo tempo
       e ter este contra, porque o que ele cobra nao e dinheiro. */
    wants: "prontidão, efetivo e a folha protegida",
    economic: 62,
    liberty: 22,
    reads: "capacity",
    areas: "security defense",
    weight: 0,
  },
];

/** @type {Schema} */
export const PRESSURE_SCHEMA = {
  rise: { kind: "number", min: 0, max: 1 },
  cool: { kind: "number", min: 0, max: 1 },
  boil: { kind: "number", min: 0, max: 100 },
  streetFloor: { kind: "number", min: 0, max: 100 },
  brokerBoil: { kind: "number", min: 0, max: 100 },
  demandAt: { kind: "number", min: 0, max: 100 },
  spite: { kind: "number", min: 0, max: 1 },
};

/* A CALIBRAGEM DA CALDEIRA, e ela e PRIMEIRO CHUTE DECLARADO — como o PIVOT de
   ECLUSA, o TABLE da Mesa e o ANSWER_TIME da carta.

   ⚠ O QUE NAO E CHUTE E A DESIGUALDADE `cool < rise`: reputacao se perde mais rapido
   do que se recupera, e uma caldeira simetrica seria um pendulo — bastaria alternar
   quem se agrada para nunca esquentar nada. Com 0,18 contra 0,06, um mes de descaso
   custa cerca de tres meses de atencao para desfazer.

   E `brokerBoil` MAIOR que `boil` tambem nao e chute: o fisiologismo e o ultimo a
   virar porque ele ganha dinheiro sustentando. Enquanto houver torneira, ele fica.

   O PONTO DE FERVURA em 60 saiu de MEDICAO, e o criterio foi declarado ANTES: a queda
   tem de ser alcancavel por um governo ruim e inalcancavel por um mediano. Medido em
   48 meses, com o mercado parando em 65 num governo que promete tudo e nao paga:

     passivo, nao paga ninguem          nunca abre
     paga metade                        abre no mes 48
     promete tudo e nao honra           abre no mes 47
     corta tudo e nao paga              nunca abre

   ⚠ E O GOVERNO PASSIVO SOBREVIVER E UM RESULTADO, e nao um defeito de calibragem:
   nao gastar AGRADA o mercado, e o capital o abriga. Ele perde o baixo clero e perde
   a rua — mas nao cai. A CALDEIRA torna a passividade perigosa e nao a torna fatal, e
   forcar numeros ate ela ser fatal seria calibrar para obter a conclusao desejada.
   Ver o achado 29.

   O PISO DA RUA em 20% e o unico com ancora fora do jogo: e a ordem de grandeza em
   que uma presidencia brasileira perdeu sustentacao popular a ponto de o Congresso se
   mover. Ele e ordem de grandeza, e nao afirmacao — por isso esta aqui e nao numa
   tabela com fonte. */
/* ── A CHANTAGEM, e os dois numeros dela ────────────────────────────────────
   ⚠ `demandAt` TEM DE SER MENOR QUE `boil`, e isso NAO e chute: uma exigencia que so
   chega depois de o grupo ja ter abandonado o governo e um RECIBO, e a regra do
   projeto e que informacao depois da decisao nao e informacao. A chantagem existe
   para o jogador poder agir ANTES — e por isso ela chega na metade do caminho.

   TRINTA E A METADE DO CAMINHO ate o ponto de fervura, e o numero e essa frase e nao
   uma escolha: o grupo aguentou metade do que aguentaria antes de abandonar o governo,
   e ai falou. ⚠ Comecei em 35, sem razao nenhuma alem de gosto, e a medicao mostrou o
   preco de um chute: DUAS exigencias em 48 meses, as duas depois do mes 45 — instrumento
   que nunca dispara e o achado 3 deste projeto se repetindo.

   `spite` e o que uma exigencia RECUSADA acrescenta a queixa do mes, e ele e a unica
   coisa que a chantagem soma a CALDEIRA. ⚠ E ele nao precisa de memoria propria: a
   pressao JA e um estoque com inercia, entao um mes de queixa alta continua doendo
   nos meses seguintes sozinho. Guardar um rancor a parte seria a mesma verdade em
   dois lugares — e o rancor de quem foi recusado e exatamente o que a caldeira
   guarda. */
export const PRESSURE = {
  rise: 0.18,
  cool: 0.06,
  /* ⚠ OS TRES SUBIRAM EM 20/08/2026, e a razao e JOGABILIDADE — declarada como tal
     pelo responsavel: "voce pode inventar numeros por enquanto; o nosso foco e deixar
     o jogo bom de verdade, jogavel; depois eu peco uma boa pesquisa focando em
     fidelidade". Fica registrado que estes tres sao ESCOLHA DE DIFICULDADE e nao
     medicao, e que a pesquisa de fidelidade ainda os vai revisar.

     ⚠ O QUE ELES CONSERTAM ESTA MEDIDO: com a Camara de nove legendas, um governo de
     MANUTENCAO — que aperta o orcamento ate caber no teto e paga so a base — via a
     ruptura politica abrir no mes 12 e caia no mes 50, no ultimo mes do mandato. A
     garantia de desenho deste projeto e a oposta e esta escrita numa prova: "a queda
     tem de ser alcancavel por um governo RUIM e inalcancavel por um MEDIANO".

     ⚠ E A MARGEM ERA FINA DEMAIS ANTES DISSO, o que e um defeito por si: o mediano
     caia no mes 52 contra um limite de 50. Dois meses de folga nao e desenho, e
     coincidencia — qualquer recalibragem futura a consumiria sem ninguem ver. */
  boil: 68,
  streetFloor: 16,
  brokerBoil: 86,
  demandAt: 30,
  spite: 0.25,
};
