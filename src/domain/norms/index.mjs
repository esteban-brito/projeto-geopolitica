/* ESTRATO — as normas em vigor, e qual delas manda.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   as normas escritas, as alavancas que existem, o mes e os indicadores
   devolve  a faixa vigente de cada alavanca, o que esta de pe e o que dorme

   O codinome e o mecanismo: normas se depositam em camadas, a mais nova fica por
   cima, e o que vale num ponto qualquer e o que a coluna diz naquele ponto. Nada
   e apagado quando se legisla — se sobrepoe.

   ── POR QUE UM MOTOR, E NAO UM CAMPO DO ESTADO ───────────────────────────────
   Ate 14/08/2026 a lei do pais era `state.bands`: um piso e um teto por alavanca,
   guardados como numero e sobrescritos quando o plenario aprovava. Aquilo bastava
   para "mover o piso da saude" e nao bastava para mais nada — porque uma lei nao
   e um numero, e uma frase, e frases tem autor, prazo, condicao e inimigos.

   O que o numero solto nao conseguia expressar, e que este motor expressa:

     · uma norma que vale ENQUANTO a divida passar de 80% do PIB, e que liga e
       desliga sozinha sem ninguem votar de novo;
     · uma norma que vale POR 24 MESES, e some;
     · uma norma que alcanca uma AREA inteira, SALVO uma alavanca — o jabuti;
     · uma norma que REVOGA outra, que e o que faz reformar significar desmontar;
     · e a consequencia de todas: elas se ACUMULAM. O presidente nao recebe um
       piso, recebe uma pilha — e e por isso que o presidente brasileiro real nao
       tem dinheiro. Nao e falta de caixa, e excesso de texto.

   ── A ORDEM ENTRE NORMAS CONTRADITORIAS E DECLARADA, e nao emergente ─────────
   Duas normas que mandam coisas diferentes sobre o mesmo piso precisam de um
   desempate que o jogador consiga prever ANTES de escrever a segunda. Sem regra
   declarada, quem decide e a ordem do array — e ai o mesmo par de leis produz
   paises diferentes conforme a ordem em que foram digitadas.

   A ordem, e ela e total (nunca ha empate, porque o ultimo criterio e unico):

     1. HIERARQUIA    constitucional > ordinaria > contrato. Lei nao derroga
                      Constituicao, e nenhuma quantidade de leis ordinarias
                      soma o bastante para derrogar uma;
     2. ESPECIFICIDADE  alavanca > area > tudo. E a excecao vencendo a regra
                      geral pelo segundo caminho: alem do `salvo`, que RETIRA o
                      alvo, uma norma que fala de uma alavanca so vence a que
                      fala de todas;
     3. RECENCIA      a mais nova vence. `enactedAt` e o mes em que ela passou;
     4. ESCRITA       na duvida, a que foi escrita depois — o indice no array.
                      Ele existe para o resultado nunca depender de ordenacao
                      instavel, e nao para ser regra jogavel.

   ⚠ HIERARQUIA VEM ANTES DE RECENCIA, e a inversao seria o defeito mais caro
   possivel aqui: uma lei ordinaria aprovada em marco passaria por cima de uma
   clausula constitucional de janeiro, e o preco de 308 votos deixaria de comprar
   qualquer coisa que durasse. Emenda se derruba com emenda.

   ⚠ E ESPECIFICIDADE VEM ANTES DE RECENCIA, o que tem uma consequencia que so
   apareceu quando a primeira prova da suite falhou contra o motor: uma norma de
   area escrita no mes 30 NAO alcanca uma alavanca que ja tem norma propria de
   mesma hierarquia. Isso e o brocardo — lei geral posterior nao revoga lei
   especial anterior — e ele nao esta aqui por elegancia juridica: sem ele, uma
   unica norma de alcance `all` escrita no fim do mandato apagaria a legislacao
   inteira do pais de uma vez, e reformar viraria um botao.

   O caminho para a regra geral vencer a especial existe, e e o que uma PEC de
   verdade faz: NOMEAR o que ela revoga. O preco nao muda; o texto e que fica mais
   longo, e portanto mais visivel para quem vota nele. E por isso que a revogacao
   nao e um enfeite da gramatica — ela e a unica ferramenta de desmonte que existe.

   ── A FAIXA INVERTIDA NAO E IMPEDIDA, e isso e decisao antiga ────────────────
   Duas normas vencedoras podem cruzar: um piso de 60 e um teto de 40 na mesma
   alavanca. O projeto ja decidiu o que fazer com isso quando o controle de faixa
   nasceu — "uma faixa invertida e um texto absurdo, e texto absurdo se derrota no
   plenario, nao se impede no controle". Entao este motor NAO conserta: ele
   devolve o que as normas dizem, e quem paga o preco de um texto absurdo e quem o
   aprovou. Consertar aqui seria o motor decidindo que uma lei quis dizer outra
   coisa.

   ── O QUE ELE NAO SABE, e de proposito ──────────────────────────────────────
   Ele nao conhece programa, area, orcamento nem Constituicao brasileira. Ele
   recebe alavancas com um GRUPO (que a aplicacao preenche com a area de um
   programa ou a familia de uma regra) e devolve faixas. Motor nenhum chama outro
   motor, e este nao seria o primeiro. */

/**
 * @typedef {"lever" | "group" | "all"} Scope o alcance de um alvo
 *
 * @typedef {object} Target
 * @property {Scope} scope
 * @property {string} [id] - a alavanca ou o grupo; ausente quando o alcance e `all`
 * @property {ReadonlyArray<string>} [except] - o SALVO: alavancas que escapam
 *
 * @typedef {object} Trigger o `enquanto`
 * @property {string} indicator - o nome do indicador lido
 * @property {"above" | "below"} op
 * @property {number} value
 *
 * @typedef {object} Norm
 * @property {string} id
 * @property {"band"} kind - o unico tipo de clausula que existe hoje
 * @property {Target} target
 * @property {number} [floor] - o que ela OBRIGA, em pontos; ausente quando nao fala
 *   de piso
 * @property {number} [share] - o que ela OBRIGA, em FRACAO DA RECEITA CORRENTE. E a
 *   VINCULACAO, e ela e o que separa um piso de um piso que anda
 * @property {number} [ceiling] - o que ela AUTORIZA
 *
 * ⚠ `share` E `floor` SAO A MESMA CLAUSULA DITA EM DUAS UNIDADES, e nunca as duas
 * ao mesmo tempo: uma norma que declarasse as duas teria dois pisos disputando entre
 * si dentro de si mesma. Quando `share` existe, o piso em pontos e DERIVADO dela e da
 * receita do mes.
 *
 * ── POR QUE A VINCULACAO NAO PODE SER UM PISO EM PONTOS ──────────────────────────
 * Um piso fixo em pontos NAO ACOMPANHA A ECONOMIA: o pais cresce, a receita cresce, e
 * a obrigacao com saude continua exatamente onde estava. E o inverso do que o artigo
 * 198 faz — ele prende uma FRACAO, e por isso a conta da saude cresce sozinha quando
 * o pais arrecada mais, e aperta sozinha quando ele arrecada menos.
 *
 * ⚠ E ISSO E O QUE FAZ DESVINCULAR SER UMA JOGADA. Enquanto o piso e um numero, o
 * jogador o abaixa e pronto; com a fracao, ele esta mexendo em quanto do FUTURO esta
 * comprometido — que e o que uma DRU de verdade negocia.
 * @property {string} guard - a natureza dela: `none`, `law` ou `constitution`
 * @property {number} enactedAt - o mes em que passou; 0 e herdada da posse
 * @property {number} [from] - a VACATIO: so vale a partir deste mes
 * @property {number} [months] - a VIGENCIA: por quantos meses, a partir de `from`
 * @property {Trigger} [trigger]
 * @property {ReadonlyArray<string>} [repeals] - o que ela derruba
 *
 * @typedef {object} Lever a alavanca vista por este motor, e nada mais que isso
 * @property {string} id
 * @property {string} [group] - a area de um programa, a familia de uma regra
 * @property {number} [cost] - quanto custa ela inteira por ano, e ele so existe para
 *   converter VINCULACAO em pontos. Uma alavanca sem custo nao pode ser vinculada:
 *   nao ha como dizer que fracao da receita ela consome
 *
 * @typedef {object} Band
 * @property {number} floor
 * @property {number} ceiling
 *
 * @typedef {"repealed" | "future" | "expired" | "trigger" | "unknown" | "unreachable"} Sleep
 *
 * @typedef {object} Dormant uma norma escrita que nao esta valendo, e por que
 * @property {Norm} norm
 * @property {Sleep} reason
 *
 * @typedef {object} NormsInput
 * @property {ReadonlyArray<Norm>} norms - na ordem em que foram escritas
 * @property {ReadonlyArray<Lever>} levers - todas as que existem
 * @property {number} month - o mes corrente
 * @property {Record<string, number>} [indicators] - o que os gatilhos leem
 * @property {number} [revenue] - a receita corrente do ano, sobre a qual a VINCULACAO
 *   incide. Ausente, toda norma de `share` fica DORMENTE por `unknown` — porque um
 *   piso de "15% da receita" sem receita nao e zero, e indeterminado
 *
 * @typedef {object} NormsOutput
 * @property {Record<string, Band>} bands - a faixa vigente de CADA alavanca
 * @property {Record<string, string>} governs - qual norma decidiu o PISO de cada alavanca
 * @property {Norm[]} active
 * @property {Dormant[]} dormant
 */

/* A HIERARQUIA, em numero. `none` nao e descuido: ha faixa que nao e lei nenhuma
   — e apenas onde o contrato esta hoje —, e ela perde para qualquer lei. */
const RANK = { none: 0, law: 1, constitution: 2 };

/* A ESPECIFICIDADE, em numero. */
const REACH = { lever: 2, group: 1, all: 0 };

/* AUSENCIA DE NORMA E AUSENCIA DE RESTRICAO, e nao a faixa do catalogo.
   ⚠ E A CORRECAO DE UM DEFEITO QUE O ESTADO ANTERIOR NAO PODIA TER: enquanto a
   faixa vinha do catalogo com o piso da posse como padrao, revogar a vinculacao
   da saude devolveria o piso constitucional original no mes seguinte — a lei que
   o jogador acabou de derrubar voltaria sozinha, sem aviso e sem voto. Sem norma,
   a caneta alcanca tudo, que e o que "nao ha lei sobre isso" significa. */
const FREE = { floor: 0, ceiling: 100 };

/** @param {number} value */
function clamp100(value) {
  return Math.min(100, Math.max(0, value));
}

/**
 * POR QUE ELA ESTA DORMINDO — ou `null` quando esta de pe.
 *
 * A ordem das perguntas e a da certeza: data e prazo sao aritmetica do calendario
 * e nao dependem de leitura nenhuma; o gatilho depende de um indicador que pode
 * nao ter sido passado, e essa e a unica pergunta que pode falhar por fora.
 *
 * @param {Norm} norm
 * @param {number} month
 * @param {Record<string, number>} indicators
 * @returns {Sleep | null}
 */
function sleepOf(norm, month, indicators) {
  const from = norm.from ?? norm.enactedAt;
  if (month < from) return "future";
  if (norm.months !== undefined && month >= from + norm.months) return "expired";

  const trigger = norm.trigger;
  if (!trigger) return null;

  const reading = indicators[trigger.indicator];

  /* INDICADOR QUE NINGUEM PASSOU NAO VIRA ZERO, e a diferenca decide partidas: um
     gatilho de "enquanto a divida passar de 80%" lido como zero fica desligado
     para sempre e ninguem nunca sabe. A norma dorme com o motivo dito, e quem
     chama consegue acusar — e a mesma postura do validador de catalogo, que
     recusa em vez de consertar. */
  if (typeof reading !== "number" || !Number.isFinite(reading)) return "unknown";

  /* A COMPARACAO E ESTRITA nos dois lados. Uma norma que liga exatamente na
     fronteira e uma norma cujo comportamento depende do ultimo bit de um numero
     que veio de doze meses de juro composto — e "a divida ATINGIU 80%" nao e uma
     condicao que alguem consiga jogar. Passar de 80 e passar. */
  const on = trigger.op === "above" ? reading > trigger.value : reading < trigger.value;
  return on ? null : "trigger";
}

/**
 * AS ALAVANCAS QUE UM ALVO ALCANCA, ja com o `salvo` descontado.
 *
 * @param {Target} target
 * @param {ReadonlyArray<Lever>} levers
 * @returns {string[]}
 */
function reachOf(target, levers) {
  const spared = new Set(target.except ?? []);

  /* O ALCANCE `lever` E CONFERIDO CONTRA A LISTA, e nao aceito de olhos fechados:
     uma norma que aponta para uma alavanca que nao existe mais — save antigo,
     catalogo remendado — precisa aparecer como norma que nao alcanca ninguem, e
     nao sumir em silencio. E o mesmo defeito que `danglingPrograms` pega no
     catalogo, do lado do estado. */
  if (target.scope === "lever") {
    const id = target.id ?? "";
    return levers.some(lever => lever.id === id) && !spared.has(id) ? [id] : [];
  }

  const matches =
    target.scope === "group" ? levers.filter(lever => lever.group === target.id) : levers;

  return matches.map(lever => lever.id).filter(id => !spared.has(id));
}

/**
 * QUEM VENCE, entre dois candidatos ao mesmo lado da mesma faixa.
 *
 * @typedef {object} Claim
 * @property {number} rank
 * @property {number} reach
 * @property {number} enactedAt
 * @property {number} written - o indice no array; o desempate que nunca empata
 *
 * @param {Claim} candidate
 * @param {Claim | undefined} holder
 * @returns {boolean}
 */
function beats(candidate, holder) {
  if (!holder) return true;
  if (candidate.rank !== holder.rank) return candidate.rank > holder.rank;
  if (candidate.reach !== holder.reach) return candidate.reach > holder.reach;
  if (candidate.enactedAt !== holder.enactedAt) return candidate.enactedAt > holder.enactedAt;
  return candidate.written > holder.written;
}

/**
 * Resolve as normas do mes.
 *
 * ⚠ FUNCAO PURA. Mesmas normas, mesmo mes e mesmos indicadores devolvem
 * exatamente as mesmas faixas — e e isso que faz o mandato inteiro se refazer da
 * semente depois de trinta reformas.
 *
 * @param {NormsInput} input
 * @returns {NormsOutput}
 */
export function resolve({ norms, levers, month, indicators = {}, revenue }) {
  /* ── 1. QUEM ESTA DE PE, E A VARREDURA E DE TRAS PARA FRENTE ────────────────
     Uma norma esta de pe quando o calendario e o gatilho a deixam E quando
     nenhuma norma POSTERIOR que esteja de pe a revogou. A dependencia aponta para
     o futuro, entao a varredura comeca do fim: a ultima norma so depende de si
     mesma, e cada passo para tras ja conhece tudo o que vem depois dele.

     ⚠ E A REVOGACAO SO ALCANCA O QUE VEIO ANTES. Nao e cautela contra ciclo — e a
     verdade do mundo, porque ninguem revoga o que ainda nao foi escrito. Mas ela
     mata o ciclo de graca: "A revoga B e B revoga A" deixa de ser um estado
     possivel, e nao existe pilha de normas que faca este laco nao terminar. */
  /** @type {Map<string, number[]>} */
  const byId = new Map();
  norms.forEach((norm, index) => {
    const found = byId.get(norm.id);
    if (found) found.push(index);
    else byId.set(norm.id, [index]);
  });

  /** @type {Map<number, string[]>} */
  const standing = new Map();
  /** @type {Map<number, Sleep>} */
  const asleep = new Map();
  /** @type {Set<number>} */
  const struck = new Set();

  for (let index = norms.length - 1; index >= 0; index--) {
    const norm = norms[index];
    if (!norm) continue;

    if (struck.has(index)) {
      asleep.set(index, "repealed");
      continue;
    }

    const sleep = sleepOf(norm, month, indicators);
    if (sleep) {
      asleep.set(index, sleep);
      continue;
    }

    /* ⚠ QUEM NAO ALCANCA NINGUEM NAO FAZ NADA — INCLUSIVE NAO REVOGA. O alcance e
       conferido AQUI, junto do calendario e do gatilho, e nao depois: uma norma
       cujo alvo sumiu do catalogo derrubando outra que ainda existe deixaria o
       pais sem a segunda e sem a primeira, por causa de um id que envelheceu. */
    const reached = reachOf(norm.target, levers);
    if (reached.length === 0) {
      asleep.set(index, "unreachable");
      continue;
    }

    standing.set(index, reached);
    for (const id of norm.repeals ?? []) {
      for (const target of byId.get(id) ?? []) {
        if (target < index) struck.add(target);
      }
    }
  }

  /* ── 2. AS FAIXAS ──────────────────────────────────────────────────────────
     Toda alavanca nasce livre e so entao recebe o que as normas mandam. Percorrer
     as normas e nao as alavancas e o que permite uma norma de area custar o mesmo
     que uma de alavanca: o custo e o alcance dela, e nao o tamanho do catalogo. */
  /** @type {Record<string, Band>} */
  const bands = {};
  /* O CUSTO POR ALAVANCA, indexado uma vez. Ele so serve a VINCULACAO, e por isso
     mora aqui e nao no tipo `Band`: quem consome faixa nao precisa saber quanto a
     alavanca custa — precisa saber onde ela pode parar. */
  /** @type {Map<string, number>} */
  const costOf = new Map();
  for (const lever of levers) {
    bands[lever.id] = { ...FREE };
    if (lever.cost !== undefined) costOf.set(lever.id, lever.cost);
  }

  /* ⚠ QUEM DECIDIU O PISO, e nao so qual e o piso. A tela precisa responder "por
     que eu nao tenho dinheiro" apontando o TEXTO que prende cada real — e sem este
     mapa ela teria de refazer a disputa de precedencia por fora para descobrir a
     norma vencedora. Refeita por fora, ela acertaria hoje e divergiria no primeiro
     mes em que um gatilho ligasse: a tela mostraria uma lei e o orcamento
     obedeceria outra. Quem sabe quem venceu e quem julgou. */
  /** @type {Record<string, string>} */
  const governs = {};

  /** @type {Map<string, Claim>} */
  const floorHolder = new Map();
  /** @type {Map<string, Claim>} */
  const ceilingHolder = new Map();

  /** @type {Norm[]} */
  const active = [];

  /* AS VINCULACOES QUE NAO SE DEIXARAM CALCULAR. Ver a nota dentro do laco. */
  /** @type {Set<number>} */
  const unresolved = new Set();

  for (let index = 0; index < norms.length; index++) {
    const norm = norms[index];
    const reached = standing.get(index);
    if (!norm || !reached) continue;

    active.push(norm);

    /** @type {Claim} */
    const claim = {
      rank: RANK[/** @type {keyof typeof RANK} */ (norm.guard)] ?? 0,
      reach: REACH[norm.target.scope] ?? 0,
      enactedAt: norm.enactedAt,
      written: index,
    };

    for (const id of reached) {
      const band = bands[id];
      if (!band) continue;

      /* ⚠ A VINCULACAO VIRA PONTOS AQUI, e nao no catalogo nem na tela: ela e uma
         LEITURA do mes, porque a receita anda. Convertida uma vez e guardada, ela
         seria um piso fixo com nome bonito — exatamente a coisa que ela existe para
         deixar de ser.

         A conversao e a definicao: `share` da receita anual / custo anual cheio da
         alavanca = que fracao dela a lei obriga. Uma alavanca sem custo declarado nao
         pode ser vinculada, e o piso dela fica onde estava. */
      let floor = norm.floor;
      if (norm.share !== undefined) {
        const cost = costOf.get(id);
        if (revenue !== undefined && cost) {
          floor = clamp100((norm.share * revenue * 100) / cost);
        } else {
          /* ⚠ SEM RECEITA OU SEM CUSTO, A VINCULACAO NAO VIRA PISO ZERO — ela vira
             DORMENTE, e a distincao foi paga por uma prova.

             A primeira versao devolvia `undefined` e a alavanca caia para a faixa
             livre: piso zero. E "piso zero" significa NAO HA LEI SOBRE ISSO, quando o
             que aconteceu foi outra coisa inteiramente — nao havia como CALCULAR a
             lei. A vinculacao da saude sumia em silencio, e o pais abria sem piso
             constitucional nenhum sem que nada acusasse.

             Ausencia declarada, e nao ausencia disfarcada — a mesma regra que vale
             para a tela, aplicada ao motor. */
          unresolved.add(index);
          continue;
        }
      }

      if (floor !== undefined && beats(claim, floorHolder.get(id))) {
        floorHolder.set(id, claim);
        band.floor = clamp100(floor);
        governs[id] = norm.id;
      }
      if (norm.ceiling !== undefined && beats(claim, ceilingHolder.get(id))) {
        ceilingHolder.set(id, claim);
        band.ceiling = clamp100(norm.ceiling);
      }
    }
  }

  /** @type {Dormant[]} */
  const dormant = [];
  for (let index = 0; index < norms.length; index++) {
    const norm = norms[index];
    const reason = asleep.get(index) ?? (unresolved.has(index) ? "unknown" : undefined);
    if (norm && reason) dormant.push({ norm, reason });
  }

  return { bands, governs, active, dormant };
}

/**
 * A NORMA DE ABERTURA de uma alavanca — a lei que o presidente encontra em vigor.
 *
 * Ela existe aqui, e nao no estado, porque a forma de uma norma e assunto deste
 * motor: quem monta a partida nao precisa saber que `enactedAt` zero significa
 * herdada, nem que uma clausula de faixa carrega os dois lados no mesmo texto.
 *
 * ⚠ A GUARDA VEM DA ALAVANCA e nao muda nunca, nem quando o jogador reescreve a
 * norma. Ela e a NATUREZA da regra, e nao o conteudo dela: o presidente muda o
 * que a lei manda, e nao de que tamanho e a lei que manda. Uma vinculacao
 * constitucional que virasse ordinaria por decisao do proprio governo seria o
 * Executivo escolhendo quanto custa mudar de ideia.
 *
 * ⚠ E A VINCULACAO NASCE AQUI, quando a alavanca declara `bound`. O piso dela deixa
 * de ser um numero e passa a ser uma FRACAO DA RECEITA — que e o que o artigo 198 faz
 * com a saude e o 212 com a educacao.
 *
 * A fracao NAO E INVENTADA: quem monta a partida a deriva da propria calibragem de
 * abertura, para que o mes 1 fique identico ao que era antes de a vinculacao existir.
 * E o mesmo padrao que provou inerte a migracao das faixas para normas — a mudanca
 * aparece a partir do segundo mes, quando a receita anda e o piso anda com ela.
 *
 * @param {{ id: string, floor: number, ceiling: number, guard: string,
 *   bound?: number }} lever
 * @returns {Norm}
 */
export function inherited(lever) {
  /** @type {Norm} */
  const norm = {
    id: `heranca-${lever.id}`,
    kind: "band",
    target: { scope: "lever", id: lever.id },
    ceiling: lever.ceiling,
    guard: lever.guard,
    enactedAt: 0,
  };

  if (lever.bound !== undefined) norm.share = lever.bound;
  else norm.floor = lever.floor;

  return norm;
}

/**
 * A NORMA QUE UM MOVIMENTO DE FAIXA ESCREVE, quando o plenario a aprova.
 *
 * ⚠ ELA E UMA NORMA NOVA, E NAO A ANTIGA CORRIGIDA. E a diferenca entre um jogo
 * em que se administra e um em que se legisla: a norma de 2027 continua no
 * arquivo depois que a de 2029 passa por cima dela, e e por isso que revogar a de
 * 2029 faz a de 2027 voltar a valer — que e exatamente o que acontece no mundo, e
 * o que um campo sobrescrito nao tem como representar.
 *
 * @param {object} input
 * @param {{ id: string, guard: string }} input.lever
 * @param {number} input.month - o mes em que ela passou
 * @param {number} [input.floor]
 * @param {number} [input.ceiling]
 * @returns {Norm}
 */
export function enact({ lever, month, floor, ceiling }) {
  /** @type {Norm} */
  const norm = {
    id: `${lever.id}-m${month}`,
    kind: "band",
    target: { scope: "lever", id: lever.id },
    guard: lever.guard,
    enactedAt: month,
  };
  if (floor !== undefined) norm.floor = floor;
  if (ceiling !== undefined) norm.ceiling = ceiling;
  return norm;
}
