/* OS PROGRAMAS — a menor coisa em que o presidente mexe.
   ══════════════════════════════════════════════════════════════════════════════

   ⚠ ESTES NUMEROS SAO REAIS, E CITAM FONTE. O catalogo mudou de postura em
   13/08/2026: ele deixou de ser "ficcao com inspiracao na realidade" e passou a
   carregar as rubricas do orcamento federal brasileiro, datadas. O que segue
   ficcao e o que o MODELO faz com elas.

   ANCORAS DE 2024/2025, e todo valor deste arquivo se pendura nelas:

     orcamento primario da Uniao      ~R$ 2.300 bi   (STN)
     RGPS — previdencia social         R$ 982,5 bi   (PLOA 2025)
     pessoal e encargos                R$ 398,1 bi   (Tesouro Transparente)
     piso da saude — 15% da RCL        R$ 231,0 bi   (CF art. 198 §2º I)
     piso da educacao — 18% da RLI     R$ 114,8 bi   (CF art. 212)
     BPC e assistencia                 R$ 112,0 bi   (MDS/STN)
     discricionario livre              R$ 160–180 bi (STN)

   As REPARTICOES INTERNAS de saude, educacao e seguranca vieram medidas — sao os
   percentuais de execucao de cada ministerio (SIOP, MEC/INEP, MJSP). As de
   previdencia, producao e fazenda ainda sao estimativa de proporcao, e ficam
   declaradas como tal ate a pesquisa fecha-las.

   ── POR QUE ELE EXISTE, E O QUE ELE APOSENTA ─────────────────────────────────
   O jogo escolhia acoes numa LISTA: seis pautas por area, prontas, com posicao
   ideologica e impacto fiscal digitados a mao. O responsavel recusou o desenho
   com uma frase que e o diagnostico inteiro — "onde tem criatividade nisso e
   liberdade?" — e ele esta certo: um menu de seis pautas responde "qual dessas
   voce quer?", e a pergunta do cargo e "quanto de cada coisa o pais vai ter?".

   Com programa, o jogador escreve o orcamento. A pauta deixa de ser escolhida e
   passa a ser DERIVADA do que ele moveu — ver `src/application/agenda.mjs`.

   ── A POSICAO E DO GASTO, E NAO DA PAUTA ────────────────────────────────────
   Cada programa carrega onde ELE fica no plano `economico × liberdades`. Isso e
   o que faz a mecanica funcionar sem cursor nenhum na tela: quem gasta mais em
   atencao basica empurra a proposta para onde a atencao basica esta, e quem
   CORTA a mesma atencao basica empurra para o lado oposto. Cortar programa de
   esquerda e ato de direita, e ninguem escreveu essa regra em lugar nenhum.

   ⚠ AS POSICOES SAO AS UNICAS COISAS AQUI QUE NAO SAO DADO. Elas sao leitura
   politica, e nenhuma fonte publica as mede. Ficam declaradas como julgamento.

   ── O PISO E A UNICA PAREDE DO JOGO, E ELA E DE LEI ─────────────────────────
   `floor` e ate onde a caneta alcanca. Abaixo dele o movimento deixa de ser
   decisao de orcamento e vira mudanca de lei, e `guard` diz de que tamanho e a
   lei: `law` cobra o rito ordinario, `constitution` cobra emenda.

   ⚠ ELE NAO E TRAVA DE INTERFACE. O controle na tela atravessa o piso; o que
   muda ao atravessar e o RITO. E a diferenca entre "voce nao pode" e "isso custa
   308 votos", e ela e a doutrina do projeto inteiro.

   ── O QUE AINDA NAO ESTA AQUI, declarado ────────────────────────────────────
   Os pisos de saude e educacao sao PROPORCIONAIS na Constituicao — 15% da receita
   corrente liquida e 18% da receita liquida de impostos —, e portanto encolhem
   sozinhos quando a arrecadacao cai, ao contrario da previdencia, que e valor
   absoluto e nao cede. Aqui eles entram como piso ABSOLUTO calibrado no valor de
   2025. Modelar a flutuacao exige o LASTRO separar RCL e RLI da receita, e fica
   declarada como ausente em vez de aproximada em silencio.

   DEFESA NAO E UMA AREA, e deveria ser. A folha militar mora dentro de "pessoal
   do Executivo" e os projetos estrategicos nao existem no catalogo. Isso passa a
   importar quando a ruptura militar entrar no jogo — ate la, criar a setima area
   seria uma tela sem decisao dentro. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/* O QUE PROTEGE O PISO, e portanto quanto custa fura-lo. Derivado e nao
   declarado por acao: o rito sai do conteudo do movimento, e uma acao com o
   quorum digitado a mao seria uma regra nova que ninguem escreveu. */
export const GUARDS = /** @type {const} */ (["none", "law", "constitution"]);

/** @type {Schema} */
export const PROGRAM_SCHEMA = {
  id: { kind: "id" },
  area: { kind: "id" },
  label: { kind: "text" },
  unit: { kind: "text" },
  economic: { kind: "number", min: 0, max: 100 },
  liberty: { kind: "number", min: 0, max: 100 },
  threat: { kind: "number", min: 0, max: 1 },
  cost: { kind: "number", min: 0, max: 2000 },
  initial: { kind: "number", min: 0, max: 100 },
  floor: { kind: "number", min: 0, max: 100 },
  ceiling: { kind: "number", min: 0, max: 100 },
  guard: { kind: "text" },
  /* ⚠ A VINCULACAO, e ela e OPCIONAL de proposito: a esmagadora maioria dos
     programas obriga por PONTOS, e so tres obrigam por FRACAO DA RECEITA.

     Quando ela existe, ela SUBSTITUI o piso — a norma herdada nasce com `share` em
     vez de `floor`, e o piso em pontos passa a ser derivado da receita do mes. Ver
     `inherited` em `src/domain/norms/`.

     A DIFERENCA E QUE UM PISO VINCULADO ANDA. O pais cresce, a receita cresce, e a
     conta da saude cresce sozinha; o pais encolhe e ela aperta sozinha. Um piso em
     pontos nao faz nem uma coisa nem outra — ele fica onde esta enquanto o mundo se
     move debaixo dele. */
  bound: { kind: "number", min: 0, max: 1, optional: true },
  weight: { kind: "number", min: 0, max: 5 },
  lag: { kind: "number", min: 0, max: 48 },
};

/**
 * @typedef {object} Program
 * @property {string} id
 * @property {string} area - a area de governo a que ele pertence
 * @property {string} label - o nome que a interface mostra
 * @property {string} unit - o que a intensidade significa no mundo
 * @property {number} economic - onde ESTE gasto fica no eixo economico
 * @property {number} liberty - onde ele fica no eixo de liberdades
 * @property {number} threat - o quanto mexer nele ataca a maquina
 * @property {number} cost - bilhoes/ano com o programa em intensidade 100
 * @property {number} initial - a intensidade herdada na posse, de 0 a 100
 * @property {number} floor - ate onde a caneta alcanca sem mudar a lei
 * @property {number} ceiling - o teto que a lei vigente permite
 * @property {string} guard - o que protege o piso; um de `GUARDS`
 * @property {number} [bound] - a VINCULACAO, em fracao da receita. Ausente na maioria,
 *   e a ausencia significa "obriga por pontos, e nao por fracao"
 * @property {number} weight - o peso dele no indice da area
 * @property {number} lag - meses ate o efeito chegar
 */

/** @type {ReadonlyArray<Program>} */
export const PROGRAMS = [
  /* ── PREVIDENCIA — R$ 1.585 bi, ou 69% do orcamento primario ────────────────
     A area onde a liberdade do presidente e menor, e o catalogo diz isso com o
     numero em vez de com adjetivo: em quatro dos seis programas o piso COINCIDE
     com o gasto de hoje. Nao ha caneta que reduza — so emenda.

     E entender por que ela e tao grande e entender o jogo: um jogador que queira
     dinheiro para qualquer outra coisa vai olhar para ca primeiro, porque e aqui
     que o dinheiro esta. E vai descobrir que o preco e constitucional. */
  {
    id: "aposentadoria-urbana",
    area: "welfare",
    label: "Aposentadoria urbana",
    unit: "benefícios do regime geral",
    economic: 28,
    liberty: 55,
    threat: 0,
    /* RGPS urbano — a maior parcela dos R$ 982,5 bi do regime geral. */
    cost: 1026,
    initial: 78,
    floor: 78,
    ceiling: 92,
    guard: "constitution",
    weight: 1,
    lag: 0,
  },
  {
    id: "aposentadoria-rural",
    area: "welfare",
    label: "Aposentadoria rural",
    unit: "benefícios sem contribuição prévia",
    /* MAIS A ESQUERDA QUE A URBANA de propósito: o rural e beneficio sem
       contribuicao previa, ou seja, transferencia pura. E a linha que a direita
       fiscal ataca primeiro em toda reforma. */
    economic: 18,
    liberty: 52,
    threat: 0,
    cost: 239,
    initial: 76,
    floor: 76,
    ceiling: 90,
    guard: "constitution",
    weight: 0.7,
    lag: 0,
  },
  {
    id: "amparo-assistencial",
    area: "welfare",
    label: "Amparo assistencial",
    unit: "idosos e pessoas com deficiência atendidos",
    economic: 15,
    liberty: 62,
    threat: 0,
    /* BPC/RMV — R$ 112,0 bi no PLOA 2025, indexado ao salario minimo. */
    cost: 156,
    initial: 72,
    floor: 72,
    ceiling: 88,
    guard: "constitution",
    weight: 0.8,
    lag: 0,
  },
  {
    id: "abono-e-seguro-desemprego",
    area: "welfare",
    label: "Abono e seguro-desemprego",
    unit: "trabalhadores amparados",
    economic: 25,
    liberty: 58,
    threat: 0,
    cost: 122,
    initial: 74,
    floor: 74,
    ceiling: 90,
    guard: "constitution",
    weight: 0.5,
    lag: 0,
  },
  /* TRANSFERENCIA DE RENDA e a linha mais movel desta area, e por isso a mais
     politica: o piso e o valor do beneficio em lei, e acima dele o programa se
     amplia ou encolhe na caneta. E o unico lugar da previdencia onde um
     presidente decide alguma coisa sem pedir licenca. */
  {
    id: "transferencia-de-renda",
    area: "welfare",
    label: "Transferência de renda",
    unit: "famílias no programa",
    economic: 8,
    liberty: 60,
    threat: 0,
    cost: 243,
    initial: 70,
    floor: 58,
    ceiling: 100,
    guard: "law",
    weight: 0.9,
    lag: 1,
  },
  {
    id: "inativos-da-uniao",
    area: "welfare",
    label: "Inativos e pensionistas da União",
    unit: "servidores aposentados",
    economic: 42,
    liberty: 50,
    threat: 0.2,
    /* Parcela CIVIL de inativos dentro dos R$ 398,1 bi de pessoal e encargos; o
       resto esta em `pessoal-do-executivo` e — desde 13/08/2026 — em
       `folha-e-inativos-militares`, que saiu daqui para a area de Defesa. */
    cost: 209,
    initial: 80,
    floor: 80,
    ceiling: 92,
    guard: "constitution",
    weight: 0.3,
    lag: 0,
  },

  /* ── SAUDE — R$ 240 bi, com piso constitucional de R$ 231 ───────────────────
     A reparticao interna e MEDIDA: 52% em media e alta complexidade, 28% em
     atencao primaria, 12% em assistencia farmaceutica, 8% em vigilancia e
     imunizacao (SIOP, 2024/2025).

     E ela e a demonstracao de por que a composicao existe. Atencao primaria e
     prevencao: barata por atendimento, paga em anos, e some do noticiario. Alta
     complexidade e fila, e ela aparece no jornal de hoje. Um governo que so apaga
     incendio esvazia a base que evita o incendio do ano que vem — e o `lag` de
     cada um cobra isso sem que exista evento nenhum escrito. */
  {
    id: "media-e-alta-complexidade",
    area: "health",
    label: "Média e alta complexidade",
    unit: "leitos, UTIs e cirurgias contratadas",
    economic: 34,
    liberty: 55,
    threat: 0,
    cost: 189,
    initial: 66,
    floor: 63,
    ceiling: 100,
    guard: "constitution",
    /* ⚠ VINCULADA — art. 198. A fracao NAO foi inventada: ela e a calibragem de
       abertura relida em outra unidade, 63 pontos x R$ 189 bi / R$ 2.280 bi de
       receita. Por isso o mes 1 fica IDENTICO ao que era antes de a vinculacao
       existir, e a diferenca so aparece a partir do segundo mes — mesmo padrao que
       provou inerte a migracao das faixas para normas.
       Somada a atencao basica, a saude fecha em 8,0% da receita bruta. O numero
       constitucional e 15% da RECEITA CORRENTE LIQUIDA, que e menor que a bruta; o
       modelo ainda nao separa as duas, e a omissao esta declarada no achado 26. */
    bound: 0.052224,
    weight: 1.2,
    lag: 1,
  },
  {
    id: "atencao-basica",
    area: "health",
    label: "Atenção básica",
    unit: "equipes de saúde da família",
    economic: 22,
    liberty: 58,
    threat: 0,
    cost: 108,
    initial: 62,
    floor: 59,
    ceiling: 100,
    guard: "constitution",
    /* VINCULADA — art. 198, a outra metade da saude. Ver a nota da media e alta. */
    bound: 0.027947,
    weight: 1,
    lag: 6,
  },
  {
    id: "assistencia-farmaceutica",
    area: "health",
    label: "Assistência farmacêutica",
    unit: "medicamentos distribuídos",
    economic: 20,
    liberty: 60,
    threat: 0,
    cost: 53,
    initial: 55,
    floor: 52,
    ceiling: 100,
    guard: "law",
    weight: 0.6,
    lag: 3,
  },
  {
    id: "vigilancia-e-imunizacao",
    area: "health",
    label: "Vigilância e imunização",
    unit: "cobertura vacinal e resposta a surtos",
    economic: 18,
    /* O PROGRAMA MENOS LIBERAL DA SAUDE, e nao por engano: vigilancia e o poder
       de fechar, interditar e obrigar. Quem a expande expande o Estado sobre a
       vida privada, e o eixo tem de dizer isso. */
    liberty: 36,
    threat: 0,
    cost: 33,
    initial: 58,
    floor: 55,
    ceiling: 100,
    guard: "law",
    weight: 0.7,
    lag: 6,
  },

  /* ── EDUCACAO — R$ 130 bi, com piso constitucional de R$ 115 ────────────────
     Reparticao medida: 48% em ensino superior, 35% na complementacao ao Fundeb,
     11% em educacao profissional, 6% em bolsas de pesquisa (MEC/INEP, LOA 2024).

     Aqui mora o dilema mais honesto do jogo, e ele e temporal: o retorno chega
     DEPOIS do mandato. `areas.mjs` ja diz isso com `lag: 24`, e os programas
     repartem o atraso. */
  {
    id: "universidades-federais",
    area: "education",
    label: "Universidades federais",
    unit: "vagas e custeio das federais",
    economic: 16,
    liberty: 72,
    threat: 0,
    cost: 107,
    initial: 58,
    floor: 51,
    ceiling: 100,
    guard: "law",
    weight: 0.9,
    lag: 24,
  },
  {
    id: "complementacao-ao-fundeb",
    area: "education",
    label: "Complementação ao Fundeb",
    unit: "estados socorridos no piso por aluno",
    economic: 20,
    liberty: 58,
    threat: 0,
    cost: 64,
    initial: 72,
    floor: 72,
    ceiling: 90,
    guard: "constitution",
    /* ⚠ VINCULADA — art. 212. Ela e a unica da educacao, e o Fundeb e de fato a
       parcela que a Uniao complementa por regra de receita; o resto da educacao
       federal e discricionario, e continua sendo. */
    bound: 0.020211,
    weight: 1.1,
    lag: 12,
  },
  {
    id: "educacao-profissional",
    area: "education",
    label: "Educação profissional",
    unit: "matrículas em ensino técnico",
    economic: 30,
    liberty: 62,
    threat: 0,
    cost: 26,
    initial: 54,
    floor: 46,
    ceiling: 100,
    guard: "law",
    weight: 0.8,
    lag: 18,
  },
  {
    id: "bolsas-de-pesquisa",
    area: "education",
    label: "Bolsas de pesquisa",
    unit: "bolsistas de mestrado e doutorado",
    economic: 14,
    liberty: 74,
    threat: 0,
    cost: 17,
    initial: 48,
    floor: 36,
    ceiling: 100,
    guard: "law",
    weight: 0.7,
    lag: 24,
  },

  /* ── SEGURANCA — R$ 30 bi, e quase tudo discricionario ──────────────────────
     Reparticao medida: 42% Policia Federal, 25% policiamento de fronteira e
     rodovias, 23% fundo nacional, 10% sistema penitenciario (MJSP, 2024/2025).

     A area de piso mais baixo do catalogo, e portanto a de maior liberdade de
     caneta — que e o que faz dela a alavanca populista descrita em `areas.mjs`:
     sobe rapido, cai rapido, e nao precisa do Congresso para nenhuma das duas.

     E e onde o eixo de LIBERDADES faz o trabalho pesado. Todo programa daqui fica
     abaixo de 45: policia e o Estado sobre o corpo das pessoas, e um governo que
     so investe em seguranca desloca a propria posicao para o autoritarismo sem
     nunca ter pautado uma lei autoritaria. */
  {
    id: "policia-federal",
    area: "security",
    label: "Polícia Federal",
    unit: "efetivo e operações",
    economic: 46,
    liberty: 38,
    /* A PF INVESTIGA O CONGRESSO, e por isso ela e o programa de gasto com maior
       ameaca do catalogo: fortalece-la e mexer na maquina de quem vota. */
    threat: 0.45,
    cost: 29,
    initial: 44,
    floor: 14,
    ceiling: 100,
    guard: "law",
    weight: 0.9,
    lag: 3,
  },
  {
    id: "policiamento-de-fronteira",
    area: "security",
    label: "Policiamento de fronteira",
    unit: "cobertura de rodovias e divisas",
    economic: 48,
    liberty: 36,
    threat: 0.05,
    cost: 18,
    initial: 42,
    floor: 13,
    ceiling: 100,
    guard: "law",
    weight: 0.7,
    lag: 3,
  },
  {
    id: "fundo-de-seguranca-publica",
    area: "security",
    label: "Fundo de segurança pública",
    unit: "repasses a estados e municípios",
    economic: 40,
    liberty: 42,
    threat: 0,
    cost: 19,
    initial: 36,
    floor: 8,
    ceiling: 100,
    guard: "none",
    weight: 1,
    lag: 6,
  },
  {
    id: "sistema-prisional",
    area: "security",
    label: "Sistema prisional",
    unit: "vagas e gestão penitenciária",
    economic: 44,
    liberty: 28,
    threat: 0,
    cost: 9,
    initial: 32,
    floor: 10,
    ceiling: 100,
    guard: "law",
    weight: 0.8,
    lag: 12,
  },

  /* ── AGRICULTURA — R$ 52 bi, e ela e uma area porque tem BANCADA ─────────────
     Ate 14/08/2026 tudo isto morava dentro de "Producao", numa linha so chamada
     "credito ao produtor". O corte em area propria nao e organizacional: a
     bancada ruralista e um bloco real no Congresso, e enquanto agro e industria
     dividiam a mesma tela, cortar os dois era um gesto so — o modelo nao tinha
     como representar um governo que agrada o agro e aperta a industria, que e uma
     das combinacoes mais comuns da politica brasileira.

     ⚠ O CUSTO FISCAL DO AGRO NAO E O VOLUME DE CREDITO. O Plano Safra anuncia
     centenas de bilhoes em credito; o que sai do orcamento e a EQUALIZACAO — a
     diferenca entre o juro cobrado do produtor e o juro de mercado. Confundir os
     dois poria R$ 400 bi numa area que custa R$ 52 bi, e o jogador aprenderia
     errado o tamanho de cada coisa.

     ⚠ A REPARTICAO INTERNA E ESTIMATIVA, e nao medicao, com uma excecao: a
     Embrapa e a subvencao economica ao credito rural tem ordem de grandeza
     publicada. O resto esta escrito com a estrutura em mente e troca quando a
     pesquisa fechar. */
  {
    id: "plano-safra",
    area: "agriculture",
    label: "Plano Safra",
    unit: "equalização de juros do crédito rural",
    economic: 56,
    liberty: 52,
    threat: 0,
    cost: 24,
    initial: 60,
    /* O PISO E ALTO E NAO E LEI DE ORCAMENTO: a equalizacao e obrigacao de
       contrato ja assinado, e contrato de safra dura anos. Um governo pode nao
       renovar; nao pode deixar de pagar o que ja contratou. */
    floor: 32,
    ceiling: 100,
    guard: "law",
    weight: 1.2,
    lag: 6,
  },
  {
    id: "agricultura-familiar",
    area: "agriculture",
    label: "Agricultura familiar",
    unit: "crédito e compras institucionais",
    /* A METADE DE ESQUERDA DO AGRO, e ela existe para a area nao ser um bloco
       ideologico unico: quem quiser agradar o campo tem duas portas, e elas
       empurram a proposta para lados OPOSTOS do eixo economico. */
    economic: 22,
    liberty: 58,
    threat: 0,
    cost: 11,
    initial: 55,
    floor: 30,
    ceiling: 100,
    guard: "law",
    weight: 0.9,
    lag: 6,
  },
  {
    id: "seguro-rural",
    area: "agriculture",
    label: "Seguro rural",
    unit: "prêmio subvencionado por hectare",
    economic: 48,
    liberty: 50,
    threat: 0,
    cost: 5,
    initial: 42,
    /* PISO ZERO, E ELE E VERDADE DOLOROSA: a subvencao ao premio e das primeiras
       coisas a cair quando o caixa aperta, porque nao ha lei nenhuma segurando —
       e o produtor so descobre no ano da seca. */
    floor: 0,
    ceiling: 100,
    guard: "none",
    weight: 0.6,
    lag: 3,
  },
  {
    id: "defesa-agropecuaria",
    area: "agriculture",
    label: "Defesa agropecuária",
    unit: "fiscalização sanitária e vegetal",
    /* ELA E O QUE SUSTENTA A EXPORTACAO, e por isso o piso e alto: um foco de
       febre aftosa fecha mercado la fora em uma semana, e reabrir leva anos. E o
       programa mais barato do catalogo com a maior consequencia por real. */
    economic: 44,
    liberty: 46,
    threat: 0,
    cost: 4,
    initial: 48,
    floor: 35,
    ceiling: 100,
    guard: "law",
    weight: 0.7,
    lag: 6,
  },
  {
    id: "pesquisa-e-extensao-rural",
    area: "agriculture",
    label: "Pesquisa e extensão rural",
    unit: "cultivares, embrapa e assistência técnica",
    economic: 30,
    liberty: 66,
    threat: 0,
    cost: 5,
    initial: 50,
    floor: 20,
    ceiling: 100,
    guard: "none",
    weight: 0.8,
    /* VINTE E QUATRO MESES, como a educacao e pela mesma razao: cultivar nova
       leva safras para chegar ao campo. Quem corta a pesquisa agricola nao sente
       neste mandato — sente no seguinte. */
    lag: 24,
  },
  {
    id: "estoques-reguladores",
    area: "agriculture",
    label: "Estoques reguladores",
    unit: "compras públicas e preço mínimo",
    /* O INSTRUMENTO MAIS DIRIGISTA DO CATALOGO agricola: o Estado comprando para
       segurar preco. Esquerda no eixo economico e baixo no de liberdades, porque
       e intervencao direta em mercado. */
    economic: 24,
    liberty: 44,
    threat: 0,
    cost: 3,
    initial: 40,
    floor: 15,
    ceiling: 100,
    guard: "law",
    weight: 0.5,
    lag: 3,
  },

  /* ── INDUSTRIA E INFRAESTRUTURA — R$ 169 bi ──────────────────────────────────
     O aparelho produtivo e o gargalo dele, na mesma area de proposito: rodovia
     ruim e energia cara sao o custo Brasil, e separa-los em duas telas faria
     parecer que da para consertar um sem o outro.

     Area de retorno lento com aparencia de rapido: ela devolve pela porta do PIB,
     e obra nao vira PIB no mes do cheque. E ela e a que depende da EDUCACAO —
     `CAPACITY_TARGET` aponta para ca, com vinte e quatro meses de atraso. */
  {
    id: "transportes-e-logistica",
    area: "industry",
    label: "Transportes e logística",
    unit: "rodovias, ferrovias e portos em obra",
    economic: 38,
    liberty: 54,
    threat: 0,
    cost: 58,
    initial: 52,
    /* O PISO MAIS BAIXO DO CATALOGO INTEIRO, e ele e verdade dolorosa: obra e a
       primeira coisa que um governo apertado contingencia, porque e a unica
       grande o bastante para fazer diferenca e desprotegida o bastante para
       ceder. Nao ha lei nenhuma segurando. */
    floor: 12,
    ceiling: 100,
    guard: "none",
    weight: 1.2,
    lag: 12,
  },
  {
    id: "energia-e-transicao",
    area: "industry",
    label: "Energia e transição",
    unit: "encargos, universalização e novas fontes",
    /* ⚠ O ENCARGO E MAIOR QUE A LINHA ORCAMENTARIA, e o catalogo mostra a linha.
       A maior parte do subsidio energetico brasileiro nao passa pelo orcamento:
       ele e cobrado na conta de luz. Modelar isso exigiria uma segunda moeda —
       preco administrado —, e ela nao existe. Fica declarado. */
    economic: 34,
    liberty: 56,
    threat: 0,
    cost: 18,
    initial: 55,
    floor: 30,
    ceiling: 100,
    guard: "law",
    weight: 1,
    lag: 12,
  },
  {
    id: "financiamento-ao-desenvolvimento",
    area: "industry",
    label: "Financiamento ao desenvolvimento",
    unit: "desembolso do banco de fomento",
    economic: 26,
    liberty: 56,
    threat: 0,
    cost: 36,
    initial: 55,
    floor: 20,
    ceiling: 100,
    guard: "law",
    weight: 0.9,
    lag: 12,
  },
  /* DESONERACAO E GASTO, e o catalogo a trata como gasto de proposito: renuncia
     fiscal nao aparece na despesa e faz o mesmo buraco. E o unico programa
     francamente de direita do bloco — cortar desoneracao empurra a proposta para
     a ESQUERDA, que e exatamente o que acontece no mundo. */
  {
    id: "desoneracao-setorial",
    area: "industry",
    label: "Desoneração setorial",
    unit: "folha e faturamento desonerados",
    economic: 82,
    liberty: 56,
    threat: 0.1,
    cost: 31,
    initial: 64,
    floor: 48,
    ceiling: 100,
    guard: "law",
    weight: 0.5,
    lag: 6,
  },
  {
    id: "ciencia-e-tecnologia",
    area: "industry",
    label: "Ciência e tecnologia",
    unit: "fomento à pesquisa aplicada",
    economic: 24,
    liberty: 70,
    threat: 0,
    cost: 17,
    initial: 46,
    floor: 12,
    ceiling: 100,
    guard: "none",
    weight: 0.7,
    lag: 24,
  },
  {
    id: "politica-industrial",
    area: "industry",
    label: "Política industrial",
    unit: "conteúdo local e subvenção à inovação",
    economic: 20,
    liberty: 48,
    /* AMEACA BAIXA E NAO ZERO: conteudo local e escolha de vencedor, e escolher
       vencedor mexe com quem ja ganhou. */
    threat: 0.05,
    cost: 9,
    initial: 45,
    floor: 5,
    ceiling: 100,
    guard: "none",
    weight: 0.6,
    lag: 12,
  },

  /* ── FAZENDA — R$ 198 bi, e 85% disso e folha ───────────────────────────────
     ⚠ A REPARTICAO DA MAQUINA DE COBRAR E ESTIMATIVA. O que e medido aqui e a
     folha: R$ 398,1 bi de pessoal e encargos, repartidos entre este arquivo e
     `inativos-da-uniao`.

     A maquina de arrecadar se paga: o indice desta area e a ARRECADACAO, e ele
     multiplica a receita de todo o resto. Abandona-la e a jogada que parece
     economia e e a mais cara do catalogo — o efeito aparece dois anos depois,
     como receita que nao entrou.

     A FOLHA DO EXECUTIVO MORA AQUI, e o endereco e de conveniencia: ela nao e
     "arrecadacao". Mas ela e a despesa de PESSOAL do governo inteiro, e nao ha
     area de administracao no catalogo — poe-la num ministerio qualquer seria pior,
     e cria-la como setima area confundiria o rail, que lista assunto de governo e
     nao rubrica contabil. Fica declarado que e endereco, e nao afirmacao de que
     folha e receita. */
  {
    id: "pessoal-do-executivo",
    area: "treasury",
    label: "Pessoal do Executivo",
    unit: "servidores ativos da União",
    economic: 40,
    liberty: 50,
    threat: 0.25,
    /* Ativos CIVIS. A folha militar saiu daqui em 13/08/2026 e virou programa
       proprio na area de Defesa — ela e 78% de um orcamento de R$ 130 bi, e
       enterrada aqui dentro ela era invisivel para quem fosse jogar com ela. */
    cost: 171,
    initial: 76,
    floor: 76,
    ceiling: 88,
    guard: "constitution",
    weight: 0.4,
    lag: 0,
  },

  /* ── DEFESA — R$ 130 bi, e 78% disso e folha ────────────────────────────────
     Reparticao medida: 78% folha, inativos e pensionistas; 16% projetos
     estrategicos; 6% operacoes de pronto emprego (Ministerio da Defesa,
     relatorios de gestao 2024/2025).

     ELA E A AREA MAIS RIGIDA DO CATALOGO DEPOIS DA PREVIDENCIA, e a rigidez conta
     a historia: quatro quintos do dinheiro sao gente, e gente militar tem regime
     proprio — mexer nisso exige reforma constitucional, nao decisao de ministro.

     E ela guarda a assimetria mais cruel do jogo, que so vai aparecer quando a
     tensao institucional existir: os 16% de projeto estrategico sao FACEIS de
     cortar e caros de recuperar. Um presidente apertado corta submarino e caca
     no primeiro ano sem sentir nada — e descobre no quarto que cortou justamente
     a coisa que comprava boa vontade de quem decide se ele fica. */
  {
    id: "folha-e-inativos-militares",
    area: "defense",
    label: "Folha e inativos militares",
    unit: "efetivo, reserva e pensionistas",
    economic: 52,
    /* MAIS AUTORITARIA QUE A MEDIA por construcao, e nao por juizo moral: gastar
       com forca armada e ampliar o aparato coercitivo do Estado, e o eixo mede
       isso. Quem financia farda desloca a propria posicao, tenha querido ou nao. */
    liberty: 32,
    threat: 0.15,
    cost: 129,
    initial: 78,
    floor: 78,
    ceiling: 92,
    guard: "constitution",
    weight: 0.4,
    lag: 0,
  },
  {
    id: "projetos-estrategicos",
    area: "defense",
    label: "Projetos estratégicos",
    unit: "submarinos, caças e blindados em contrato",
    economic: 58,
    liberty: 40,
    threat: 0.1,
    cost: 46,
    initial: 46,
    /* PISO BAIXO E DE LEI, que e a combinacao mais perigosa do catalogo: da para
       cortar quase tudo com uma canetada e uma justificativa fiscal, e o preco
       chega anos depois, em contrato rompido e em quem se lembra. */
    floor: 20,
    ceiling: 100,
    guard: "law",
    weight: 1.2,
    lag: 24,
  },
  {
    id: "prontidao-e-operacoes",
    area: "defense",
    label: "Prontidão e operações",
    unit: "garantia da lei e da ordem, fronteiras",
    economic: 54,
    /* O SEGUNDO PROGRAMA MENOS LIBERAL DO CATALOGO, atras so da inteligencia:
       operacao de GLO e tropa na rua, e tropa na rua e o Estado aparecendo
       fardado onde a policia deveria bastar. */
    liberty: 22,
    threat: 0.2,
    cost: 20,
    initial: 40,
    floor: 10,
    ceiling: 100,
    guard: "none",
    weight: 0.9,
    lag: 1,
  },
  {
    id: "fiscalizacao-tributaria",
    area: "treasury",
    label: "Fiscalização tributária",
    unit: "auditores e malha fina",
    economic: 32,
    liberty: 40,
    threat: 0.35,
    cost: 18,
    initial: 66,
    floor: 40,
    ceiling: 100,
    guard: "law",
    weight: 1.2,
    lag: 6,
  },
  {
    id: "cobranca-da-divida-ativa",
    area: "treasury",
    label: "Cobrança da dívida ativa",
    unit: "estoque em execução",
    economic: 36,
    liberty: 44,
    threat: 0.2,
    cost: 10,
    initial: 58,
    floor: 34,
    ceiling: 100,
    guard: "law",
    weight: 0.9,
    lag: 12,
  },
  {
    id: "tecnologia-da-arrecadacao",
    area: "treasury",
    label: "Tecnologia da arrecadação",
    unit: "cruzamento de dados e nota eletrônica",
    economic: 34,
    liberty: 36,
    threat: 0.15,
    cost: 14,
    initial: 50,
    floor: 20,
    ceiling: 100,
    guard: "none",
    weight: 1,
    lag: 12,
  },
  {
    id: "controle-e-auditoria",
    area: "treasury",
    label: "Controle e auditoria",
    unit: "capacidade de auditar o próprio Estado",
    economic: 38,
    liberty: 46,
    /* CONTROLE INTERNO E AMEACA ALTA pela mesma razao da PF: quem audita o gasto
       audita a emenda, e a emenda e a moeda da barganha. */
    threat: 0.5,
    cost: 9,
    initial: 54,
    floor: 30,
    ceiling: 100,
    guard: "law",
    weight: 0.8,
    lag: 12,
  },
];
