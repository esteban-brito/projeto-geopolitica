/* PARAMETROS FISCAIS — as constantes que LASTRO consome.
   ══════════════════════════════════════════════════════════════════════════════

   ⚠ FICCAO com inspiracao na realidade, como o resto do catalogo. Nenhum destes
   numeros cita fonte porque nenhum e afirmacao sobre o Brasil.

   ── A CORRECAO QUE FAZ A ARMADILHA EXISTIR ───────────────────────────────────
   O dossie de origem declarava a despesa obrigatoria como "90% da receita".
   Escrita assim ela NAO e uma restricao: se a despesa e definida como uma fracao
   da receita, o caixa discricionario e sempre os outros 10%, cai junto quando a
   receita cai, e nunca aperta. O gatilho de contingenciamento jamais dispararia.

   A armadilha so existe se a despesa obrigatoria for um VALOR ABSOLUTO que
   cresce por conta propria — salario, aposentadoria e beneficio nao consultam a
   arrecadacao para subir. Entao aqui ela nasce como valor, cresce
   vegetativamente, e a razao despesa/receita e EMERGENTE: comeca perto de 90% e
   sobe sozinha quando o PIB decepciona, espremendo o discricionario contra o
   zero. E o mesmo mecanismo que o dossie descreve em prosa e impede na formula.

   ── O ARCABOUCO ──────────────────────────────────────────────────────────────
   A despesa nao pode crescer mais que `EXPENSE_GROWTH_SHARE` do crescimento da
   receita. A versao real tem ainda uma banda de crescimento real minimo e
   maximo; ela fica de fora por enquanto, e fica DECLARADO que fica — parametro
   omitido em silencio e o que faz a proxima sessao achar que o modelo e fiel. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/** @type {Schema} */
export const FISCAL_SCHEMA = {
  taxLoad: { kind: "number", min: 0, max: 1 },
  mandatoryGrowth: { kind: "number", min: 0, max: 0.2 },
  expenseGrowthShare: { kind: "number", min: 0, max: 1 },
  seatPrice: { kind: "number", min: 0, max: 10 },
  initialGdp: { kind: "number", min: 1 },
  initialMandatory: { kind: "number", min: 1 },
  initialDiscretionary: { kind: "number", min: 0 },
  initialDebtRatio: { kind: "number", min: 0, max: 3 },
};

/**
 * @typedef {object} FiscalParameters
 * @property {number} taxLoad - carga tributaria como fracao do PIB
 * @property {number} mandatoryGrowth - crescimento vegetativo real ao ano
 * @property {number} expenseGrowthShare - o teto do arcabouco
 * @property {number} seatPrice - custo MENSAL de manter uma cadeira a verba cheia
 * @property {number} initialGdp - PIB anual inicial, em bilhoes
 * @property {number} initialMandatory - despesa obrigatoria anual inicial, em bilhoes
 * @property {number} initialDiscretionary - discricionario anual inicial; com a
 *   obrigatoria ele forma a ancora de despesa do primeiro exercicio
 * @property {number} initialDebtRatio - divida bruta sobre PIB
 */

/* ── A RECALIBRAGEM DE 13/08/2026, e o erro que ela conserta ─────────────────
   Os valores anteriores descreviam um pais que nao existe, e o erro tinha uma
   causa unica: `taxLoad` era 0,33 — a carga tributaria BRUTA do Brasil, que soma
   Uniao, estados e municipios. O jogo cobrava tudo para a Uniao, e por isso o
   orcamento federal dele nascia em 3.600 bilhoes contra os ~2.300 reais. Cinquenta
   e seis por cento a mais, e nenhuma tela denunciava: cada numero era plausivel
   sozinho.

   Consequencia que so aparece na jogabilidade: o discricionario nascia em 330
   bilhoes ao ano contra os 160 a 180 reais, ou seja, o jogador tinha o DOBRO do
   dinheiro livre que um presidente tem. Comprar o Congresso era barato, e a
   medicao da sessao anterior — 26 votacoes, 26 aprovacoes — era sintoma disto.

   ⚠ AGORA ESTES NUMEROS CITAM FONTE, e a postura do catalogo mudou junto: eles
   deixaram de ser ficcao inspirada e passaram a ser valores reais, datados. O que
   segue ficcao e o que o MODELO faz com eles. Ver `docs/research/02-respostas-brasil-2026.md`. */

/** @type {FiscalParameters} */
export const FISCAL = {
  /* RECEITA PRIMARIA LIQUIDA DA UNIAO sobre o PIB — e nao a carga tributaria
     bruta do pais, nem a receita antes das transferencias. 12.000 × 0,19 = 2.280
     bilhoes. Fonte: STN, Relatorio Resumido de Execucao Orcamentaria.

     ⚠ ERA 0,20 ATE 14/08/2026, e o 0,01 de diferenca decidia o SINAL do resultado
     primario do pais. E o ultimo termo do achado numero um do handoff, e o unico
     que e calibragem e nao mecanica:

       receita 2.400 contra despesa 2.330  →  superavit de 70 bi/ano
       receita 2.280 contra despesa 2.330  →  DEFICIT de 50 bi/ano

     O Brasil roda deficit primario, e o modelo nao conseguia rodar nenhum — nao
     por uma trava, mas porque a receita nascia acima da despesa e o teto do
     arcabouco e uma ancora na DESPESA. Um governo que gastasse ate o limite legal
     ainda sobrava dinheiro, todo mes, para sempre.

     O que muda de fato e o denominador do que se chama receita: 0,20 e a receita
     primaria ANTES das transferencias constitucionais a estados e municipios, e
     quem paga a folha e a previdencia da Uniao e o que sobra DEPOIS delas. Os 49%
     de IR e IPI que a Constituicao reparte nunca foram do Executivo federal — e
     ate aqui o modelo os gastava. */
  taxLoad: 0.19,
  mandatoryGrowth: 0.025,
  /* 70% do crescimento da receita — o numero do arcabouco de verdade.
     Fonte: LC 200/2023. */
  expenseGrowthShare: 0.7,
  /* O PRECO DA CADEIRA e o cambio entre os dois motores: ele traduz "verba
     oferecida", que a votacao entende como fracao de 0 a 1, em bilhoes que saem
     do discricionario. Sem ele os dois motores ficariam em moedas diferentes e o
     acoplamento seria uma regra escrita a mao em vez de uma conta.

     ⚠ ELE NAO E A EMENDA PARLAMENTAR, e a distincao passou a importar agora que o
     resto do catalogo e real. A emenda individual impositiva vale ~R$ 38 mi por
     deputado ao ano, o que daria 0,003 aqui — e a esse preco 6% do caixa compraria
     o plenario inteiro, todo mes, para sempre. A razao e que emenda impositiva nao
     e moeda: e DIREITO, e o deputado a recebe vote como votar. O que se negocia e
     o empenho — quando sai —, e disso quem cuida e `settle`.

     O QUE ESTE NUMERO REPRESENTA e o preco integral da lealdade de uma bancada:
     emenda, ministerio, diretoria de estatal, relatoria, cargo de segundo e
     terceiro escalao. O Executivo federal tem ~28 mil cargos de livre nomeacao e
     ~150 estatais para lotear (fonte: Painel do Funcionalismo/MGI, Portal da
     Transparencia); a emenda e so a parcela com valor publicado.

     O NUMERO SAI DE UMA RAZAO, e nao de gosto: o discricionario nasce perto de 13
     bilhoes por mes, e comprar as 513 cadeiras a verba cheia tem de ser IMPOSSIVEL
     — senao existe jogada dominante e a escolha de a quem pagar deixa de ser
     escolha. A 0,05 o plenario inteiro custa 25,7, quase o dobro do que cabe no
     mes; o centrao sozinho custa 10,3, que cabe e doi. E a MESMA razao de antes:
     quando a escala do orcamento caiu, este numero caiu junto, porque o que ele
     descreve e uma proporcao e nao um valor. */
  seatPrice: 0.05,
  /* PIB nominal de 2025, arredondado. Fonte: IBGE. */
  initialGdp: 12000,
  /* A DESPESA OBRIGATORIA E A SOMA DOS PISOS DOS PROGRAMAS, e nao um numero
     independente: `tests/suites/agenda.mjs` prova que os dois batem. Os valores
     de referencia por rubrica (RGPS 982, pessoal 398, BPC 112, piso da saude 231,
     piso da educacao 115 — PLOA 2025) estao em `programs.mjs`, item a item. */
  initialMandatory: 2154,
  initialDiscretionary: 176,
  /* Divida bruta do governo geral sobre o PIB. Fonte: BCB. */
  initialDebtRatio: 0.78,
};
