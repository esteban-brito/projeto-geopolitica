/* AS ALAVANCAS DE REGRA — politica que nao se mede em reais.
   ══════════════════════════════════════════════════════════════════════════════

   ⚠ CALIBRAGEM PROVISORIA, declarada. Os valores sao ordem de grandeza; a
   pesquisa que vai fecha-los (bloco 7 de `docs/research/01-briefing-brasil-2026.md`) nao
   voltou. As PROPORCOES entre eles carregam o desenho e sobrevivem a troca.

   ── POR QUE ELAS EXISTEM ─────────────────────────────────────────────────────
   `programs.mjs` expressa "quanto o pais gasta em que". Isso cobre bem o governo
   que administra, e nao cobre NADA do governo que refunda: privatizar, estatizar,
   concentrar poder no Executivo. O custo orcamentario dessas jogadas e quase
   zero, e sao justamente elas que fazem a jogada ancap e a monarquista existirem.

   Com so as alavancas de verba, "privatizar tudo" viraria arrastar todo controle
   para o piso — o que nao e privatizar, e deixar de pagar. Sao coisas diferentes:
   uma muda de dono, a outra abandona.

   ── ELAS USAM A MESMA DERIVACAO ──────────────────────────────────────────────
   Nada aqui e um verbo num menu. Sao controles continuos de 0 a 100, com posicao
   propria no plano, e entram na MESMA media ponderada de `agenda.mjs`. O que muda
   e a moeda do peso: em verba e o custo anual, aqui e o ALCANCE — quanto do pais
   aquilo toca, tambem em bilhoes, para as duas familias serem comparaveis.

   Privatizar e arrastar propriedade para 0. Estatizar, para 100.

   ── OS TRES CANAIS FISCAIS DA PROPRIEDADE ────────────────────────────────────
   Estatal nao e so simbolo: ela entra no orcamento por tres portas, e o jogo do
   `dividend` contra o `payroll` e o dilema inteiro.

     DIVIDENDO  o que a estatal devolve ao Tesouro por ano. Some quando se vende;
     FOLHA      o que ela custa em pessoal, e ela e despesa OBRIGATORIA. Some
                junto — e para alguns setores isso vale mais que o dividendo;
     VENDA      a receita extraordinaria do mes em que se privatiza. Ela e
                deliciosa e e uma armadilha: entra uma vez, levanta a ancora do
                arcabouco do ano seguinte, e no ano depois o teto encolhe contra
                uma obrigatoria que continuou crescendo.

   Ninguem escreveu "armadilha da privatizacao". E aritmetica do LASTRO.

   ── O PODER DO EXECUTIVO E OUTRA COISA ───────────────────────────────────────
   Ele nao tem canal fiscal. O que ele faz e mexer no RITO: quanto mais alto, mais
   coisa a caneta alcanca sem passar pelo Congresso — o que exigia emenda passa a
   exigir lei, e o que exigia lei passa a nao exigir nada.

   E a janela de Overton com endereco no codigo, e o preco dela ja existe: com
   `threat` perto de 1, a proposta que o levanta e a mais cara que este jogo
   consegue produzir, porque ela ataca a moeda de barganha de quem vota. Nao ha
   muro; ha um preco absurdo, e ele cai conforme a base cresce.

   ⚠ O PRECO ESTA PELA METADE, e fica declarado: falta a tensao institucional —
   o caminho em que concentrar poder derruba o governo pela porta do golpe ou do
   impeachment. Hoje o unico freio e o Congresso. */

/* AS DUAS FAMILIAS DE REGRA, e o esquema as COBRA — ver `values` em `schema.mjs`.
   Ela sobe para antes do esquema porque ele a le. */
export const FAMILIES = /** @type {const} */ (["property", "power"]);

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const RULE_SCHEMA = {
  id: { kind: "id" },
  family: { kind: "text", values: FAMILIES },
  label: { kind: "text" },
  unit: { kind: "text" },
  economic: { kind: "number", min: 0, max: 100 },
  liberty: { kind: "number", min: 0, max: 100 },
  threat: { kind: "number", min: 0, max: 1 },
  reach: { kind: "number", min: 0, max: 5000 },
  initial: { kind: "number", min: 0, max: 100 },
  floor: { kind: "number", min: 0, max: 100 },
  ceiling: { kind: "number", min: 0, max: 100 },
  guard: { kind: "text" },
  dividend: { kind: "number", min: 0, max: 1 },
  payroll: { kind: "number", min: 0, max: 1 },
  sale: { kind: "number", min: 0, max: 5 },
};

/** As familias. `property` tem canal fiscal; `power` mexe no rito. */

/**
 * @typedef {object} Rule
 * @property {string} id
 * @property {string} family - uma de `FAMILIES`
 * @property {string} label
 * @property {string} unit - o que a intensidade significa no mundo
 * @property {number} economic
 * @property {number} liberty
 * @property {number} threat
 * @property {number} reach - quanto do pais isto toca, em bilhoes
 * @property {number} initial
 * @property {number} floor
 * @property {number} ceiling
 * @property {string} guard - o que protege o piso
 * @property {number} dividend - fracao de `reach` que volta ao Tesouro por ano, a 100
 * @property {number} payroll - fracao de `reach` que vira folha obrigatoria, a 100
 * @property {number} sale - fracao de `reach` arrecadada ao vender os 100 pontos
 */

/** @type {ReadonlyArray<Rule>} */
export const RULES = [
  /* ── PROPRIEDADE ───────────────────────────────────────────────────────────
     Um controle por setor. O eixo economico e onde a proposta cai quando se
     ESTATIZA; privatizar cai no espelho, como toda alavanca. */
  {
    id: "petroleo-e-gas",
    family: "property",
    label: "Petróleo e gás",
    unit: "participação da União no setor",
    economic: 26,
    liberty: 48,
    /* AMEACA ALTA: a maior estatal do pais e o maior loteamento de diretoria que
       existe. Mexer nela e mexer no que o Congresso considera propriedade sua. */
    threat: 0.4,
    reach: 620,
    initial: 62,
    floor: 0,
    ceiling: 100,
    guard: "law",
    /* Dividendo alto e folha baixa: a estatal do petroleo PAGA ao Tesouro. Vende-
       la e trocar renda permanente por caixa de uma vez, que e o argumento
       fiscal contra a privatizacao — e ele e verdadeiro neste setor. */
    dividend: 0.055,
    payroll: 0.022,
    sale: 0.85,
  },
  {
    id: "bancos-publicos",
    family: "property",
    label: "Bancos públicos",
    unit: "participação da União no crédito",
    economic: 24,
    liberty: 50,
    threat: 0.35,
    reach: 480,
    initial: 70,
    floor: 0,
    ceiling: 100,
    guard: "law",
    dividend: 0.045,
    payroll: 0.03,
    sale: 0.7,
  },
  {
    id: "energia-eletrica",
    family: "property",
    label: "Energia elétrica",
    unit: "participação da União na geração e transmissão",
    economic: 30,
    liberty: 50,
    threat: 0.25,
    reach: 340,
    /* JA MAJORITARIAMENTE PRIVADO na abertura, e isso e afirmacao sobre o mundo:
       o setor foi desestatizado antes desta partida comecar. Reestatizar e uma
       jogada que existe, e ela custa comprar de volta. */
    initial: 28,
    floor: 0,
    ceiling: 100,
    guard: "law",
    dividend: 0.03,
    payroll: 0.02,
    sale: 0.75,
  },
  {
    id: "correios-e-logistica",
    family: "property",
    label: "Correios e logística",
    unit: "participação da União na entrega e nos portos",
    economic: 32,
    liberty: 52,
    threat: 0.2,
    reach: 90,
    initial: 84,
    floor: 0,
    ceiling: 100,
    guard: "law",
    /* O CASO INVERSO DO PETROLEO: folha maior que dividendo. Aqui a conta fiscal
       da privatizacao FECHA — e e por isso que os dois estao no catalogo. Se
       todos fossem iguais, privatizar seria sempre certo ou sempre errado, e a
       alavanca deixaria de ter decisao dentro. */
    dividend: 0.008,
    payroll: 0.055,
    sale: 0.45,
  },
  {
    id: "saneamento-e-agua",
    family: "property",
    label: "Saneamento e água",
    unit: "participação pública na rede",
    economic: 22,
    liberty: 54,
    threat: 0.15,
    reach: 150,
    initial: 66,
    floor: 0,
    ceiling: 100,
    guard: "law",
    dividend: 0.012,
    payroll: 0.03,
    sale: 0.6,
  },

  /* ── PODER ─────────────────────────────────────────────────────────────────
     Uma alavanca so, e ela e a mais perigosa do jogo. */
  {
    id: "poder-do-executivo",
    family: "power",
    label: "Poder do Executivo",
    unit: "o quanto se decide sem passar pelo Congresso",
    /* NEUTRA EM ECONOMIA e no chao em liberdades. Concentrar poder nao e de
       esquerda nem de direita — e vertical, e o eixo de liberdades e o unico que
       sabe dizer isso. */
    economic: 50,
    liberty: 3,
    /* A MAIOR AMEACA DO CATALOGO INTEIRO, e por definicao: esta pauta tira poder
       exatamente de quem a vota. Nenhuma verba reduz este termo — e o que faz a
       jogada autoritaria ser cara sem ser proibida. */
    threat: 0.95,
    reach: 900,
    initial: 30,
    /* ⚠ A FAIXA E UM PONTO, e nao um intervalo — e essa e a diferenca entre esta
       alavanca e todas as outras. Num programa, a faixa e o espaco que a lei
       DEIXA o Executivo executar sozinho; aqui nao ha espaco nenhum: a divisao de
       poder e onde a Constituicao a pos, e mexer nela em qualquer direcao e
       emendar. Piso e teto colados em 30 fazem qualquer movimento furar parede,
       que e a verdade — e nao um caso especial escrito no motor. */
    floor: 30,
    ceiling: 30,
    guard: "constitution",
    dividend: 0,
    payroll: 0,
    sale: 0,
  },
];

/* ── O QUE O PODER FAZ COM O RITO ───────────────────────────────────────────
   Cada degrau derruba UMA exigencia: emenda vira lei, lei vira caneta. Dois
   degraus levam da Constituicao a canetada.

   OS LIMIARES SAO GROSSOS DE PROPOSITO. Um poder de 55 nao pode "quase" derrubar
   um rito — ou derruba ou nao derruba, porque o jogador precisa saber de que lado
   da linha ele esta antes de gastar 308 votos para atravessa-la. */
export const POWER_STEPS = [
  { at: 60, drops: 1 },
  { at: 85, drops: 2 },
];
