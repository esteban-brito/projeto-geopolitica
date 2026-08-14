/* A PAUTA DERIVADA — de quanto o jogador moveu para o que o Congresso vota.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   os programas, o nivel vigente de cada um, e o nivel pedido
   devolve  uma proposta com posicao no plano, ameaca, custo e RITO

   ── POR QUE ELA NAO E MOTOR ──────────────────────────────────────────────────
   Ela mora na camada de aplicacao pela mesma razao que `situationOf`: compoe
   CATALOGO e ESTADO, e motor nenhum chama outro motor. O ECLUSA recebe a
   proposta pronta e nao sabe de onde ela veio — e e justamente por nao saber que
   ele nao precisou mudar uma linha para o catalogo de pautas prontas morrer.

   ── A LEI CENTRAL: A POSICAO E SOMBRA, E NAO CONTROLE ────────────────────────
   O jogador nunca arrasta um cursor no plano `economico × liberdades`. Ele mexe
   em leitos, em vacinacao, em universidade — e a posicao da proposta e CALCULADA
   do que ele moveu.

   Isso responde a objecao que `bills.mjs` levantou, e que estava certa: controle
   vetorial livre viraria problema de otimizacao, porque bastaria arrastar o
   projeto ate o meio da maior bancada. Aqui nao ha atalho, porque nao ha cursor:
   para empurrar a proposta ate o centrao e preciso FINANCIAR o que o centrao
   quer, com dinheiro do mesmo caixa, mudando o pais de verdade. O vetor e a
   fatura, e nao o volante.

     Δ_p       = nivel_pedido − nivel_vigente
     peso_p    = |Δ_p| × custo_p              ← o quanto o movimento pesa em dinheiro
     posicao_p = Δ_p > 0 ? pos_p : (100 − pos_p)
     economico = Σ peso_p × economico_p / Σ peso_p

   ── O CORTE E O ESPELHO ──────────────────────────────────────────────────────
   A linha do meio e o coracao da mecanica. Gastar mais num programa poe a
   proposta ONDE O PROGRAMA ESTA; corta-lo poe no LADO OPOSTO. Cortar atencao
   basica e uma proposta de direita, e ninguem escreveu isso em lugar nenhum —
   cai da formula.

   Sem o espelho, cortar e ampliar a saude produziriam a MESMA posicao, e as duas
   bancadas votariam igual nas duas — que e o oposto de tudo o que se sabe sobre
   como o Congresso se comporta.

   ── O PESO E EM DINHEIRO, e nao em pontos de controle ───────────────────────
   `|Δ| × custo`, e nao `|Δ|` sozinho. Mover a vacinacao de 58 para 20 e mover a
   aposentadoria urbana de 78 para 40 sao dois movimentos de tamanho parecido no
   controle e de tamanhos incomparaveis no pais: um vale 16 bilhoes e o outro 477.
   Peso em pontos faria a vacinacao dominar a posicao de uma proposta que, no
   mundo, e sobre previdencia.

   ── O RITO SAI DO CONTEUDO ───────────────────────────────────────────────────
   O jogador NUNCA escolhe "lei" ou "emenda". Ele move controles, e o rito e
   consequencia de quais paredes o movimento derrubou. Um dial de intensidade que
   deixasse o jogador escolher o rito seria o menu de pautas voltando com outro
   nome — e o menu e exatamente o que este arquivo existe para aposentar. */

import { quorumOf } from "../data/bills.mjs";
import { MONTHS_PER_YEAR } from "../data/regime.mjs";
import { POWER_STEPS } from "../data/rules.mjs";

/* O catalogo raciocina em ANO, porque orcamento e uma peca anual; o turno e um
   mes. A divisao mora aqui e em nenhum outro lugar — o mesmo cuidado que o
   LASTRO toma com a regra fiscal. */
const MONTHLY = 1 / MONTHS_PER_YEAR;

/**
 * @typedef {import("../data/programs.mjs").Program} Program
 * @typedef {import("../data/rules.mjs").Rule} Rule
 * @typedef {import("../state/state.mjs").Band} Band
 *
 * @typedef {object} Breach
 * @property {string} programId
 * @property {"floor" | "ceiling"} side - qual parede foi atravessada
 * @property {string} rite - o rito que ESTA parede exige
 *
 * @typedef {object} Move
 * @property {Program} program
 * @property {number} delta - pontos de intensidade, com sinal
 * @property {number} weight - `|delta| × cost`; o peso na media ponderada
 * @property {number} spend - bilhoes/ano que este movimento acrescenta (ou poupa)
 * @property {string} rite - o rito que ESTE movimento sozinho exigiria
 * @property {"level" | "floor" | "ceiling"} [kind] - o que se moveu; nivel por padrao
 *
 * @typedef {object} Proposal
 * @property {string} id
 * @property {string} label
 * @property {string} area - a area de maior peso; o ASSUNTO da proposta
 * @property {string} instrument - `budget`, `law` ou `amendment`
 * @property {number} economic
 * @property {number} liberty
 * @property {number} threat
 * @property {number} fiscalImpact - positivo POUPA, negativo custa
 *
 * @typedef {object} Agenda
 * @property {Move[]} moves - so o que se moveu
 * @property {Breach[]} breaches
 * @property {Proposal | null} proposal - nulo quando nada se moveu
 * @property {number} quorum - votos necessarios; zero quando nao vai a plenario
 * @property {number} spend - bilhoes/ano que o conjunto acrescenta
 */

/* O RITO DE CADA PAREDE, e a ordem e a da exigencia. `budget` nao e instrumento
   de verdade: e a ausencia de um — o orcamento que a lei ja autoriza, executado
   por quem foi eleito para executa-lo. */
const RITES = ["budget", "law", "amendment"];

/* QUE RITO CADA GUARDA COBRA quando o piso e atravessado.

   `none` NAO E DESCUIDO. Ha programa cujo piso nao e lei nenhuma — e apenas onde
   o contrato esta hoje. Investimento, ciencia e tecnologia sao exatamente isso, e
   contingencia-los ate o osso e uma jogada que presidente brasileiro faz sem
   pedir licenca a ninguem. O modelo tem de deixar, porque o mundo deixa. */
const FLOOR_RITE = { none: "budget", law: "law", constitution: "amendment" };

/**
 * @param {string} a
 * @param {string} b
 * @returns {string} o mais exigente dos dois
 */
function harder(a, b) {
  return RITES.indexOf(a) >= RITES.indexOf(b) ? a : b;
}

/**
 * O RITO DEPOIS DO PODER DO EXECUTIVO — a janela de Overton, em uma funcao.
 *
 * Cada degrau de poder derruba UMA exigencia: emenda vira lei, lei vira caneta.
 * E isto que faz "o que e impossivel no mes 1 passa rindo no mes 40" ser
 * mecanica em vez de promessa — mas repare no que NAO acontece aqui: o preco nao
 * some, ele muda de lugar. Para chegar ao poder que derruba um rito, o jogador
 * teve de aprovar uma emenda de ameaca 0,95, que e a pauta mais cara que este
 * catalogo produz.
 *
 * ⚠ E ISTO E METADE DO PRECO, declarado. A outra metade e a tensao institucional
 * — o caminho em que concentrar poder derruba o governo por fora do Congresso.
 * Enquanto ela nao existir, um presidente com base folgada concentra poder e nao
 * sofre nada por isso, e esse e o buraco conhecido deste desenho.
 *
 * @param {string} rite
 * @param {number} power de 0 a 100
 * @returns {string}
 */
function underPower(rite, power) {
  let drops = 0;
  for (const step of POWER_STEPS) if (power >= step.at) drops = Math.max(drops, step.drops);
  const index = RITES.indexOf(rite);
  return RITES[Math.max(0, index - drops)] ?? rite;
}

/** @param {number} value */
function clamp100(value) {
  return Math.min(100, Math.max(0, value));
}

/**
 * A FAIXA VIGENTE DE UMA ALAVANCA — a lei que a governa hoje.
 *
 * ⚠ O CATALOGO E O PADRAO, E NAO A VERDADE. Desde que as faixas viraram estado, o
 * que `programs.mjs` declara e a faixa DE ABERTURA: as leis que o presidente
 * encontra em vigor no dia da posse. Quem quiser saber o piso de hoje pergunta
 * aqui, e quem nao passar `bands` recebe o dia da posse — que e a resposta certa
 * para quem esta montando um caso de teste ou lendo o catalogo cru.
 *
 * @param {{ id: string, floor: number, ceiling: number }} lever
 * @param {Record<string, Band>} [bands]
 * @returns {Band}
 */
export function bandOf(lever, bands) {
  const band = bands?.[lever.id];
  return {
    floor: band?.floor ?? lever.floor,
    ceiling: band?.ceiling ?? lever.ceiling,
  };
}

/**
 * O RITO DE MEXER NA PROPRIA FAIXA — de LEGISLAR, e nao de gastar.
 *
 * ── POR QUE O MINIMO E LEI, INCLUSIVE ONDE NAO HA LEI NENHUMA ────────────────
 * Um programa de guarda `none` nao tem piso legal: o piso dele e so onde o
 * contrato esta hoje, e atravessa-lo custa caneta. Mas PLANTAR um piso ali nao e
 * atravessar coisa nenhuma — e criar uma vinculacao que nao existia, e vinculacao
 * se cria por lei. E o que o ciclo chamou de "criar uma lei": por uma faixa onde
 * nao havia. Um piso novo obriga o sucessor; um teto novo o proibe.
 *
 * Onde JA HA lei, o preco e o mesmo de atravessa-la — mexer numa faixa protegida
 * pela Constituicao custa os mesmos 308 votos que furar essa faixa custa hoje.
 * Nao ha tabela nova: a guarda ja dizia tudo.
 *
 * @param {string} guard
 * @returns {string}
 */
export function riteForBand(guard) {
  return harder("law", FLOOR_RITE[/** @type {keyof typeof FLOOR_RITE} */ (guard)] ?? "law");
}

/**
 * O RITO QUE UMA ALAVANCA SOZINHA EXIGE naquele nivel.
 *
 * ⚠ ELA EXISTE PARA A TELA PARAR DE REDIGITAR A REGRA, e a divida que ela paga
 * durou menos de uma hora. `area.mjs` tinha uma copia desta logica para poder
 * marcar a linha cara enquanto o jogador arrasta; a copia ficou para tras quando
 * o teto passou a respeitar a guarda, e o resultado foi a tela anunciando "lei"
 * numa jogada que o motor cobrava como emenda. Levar o Executivo ao teto — que e
 * romper a divisao de poderes — aparecia por 257 votos.
 *
 * Nenhum aviso teria pego isso: os dois lados estavam certos sozinhos. A unica
 * correcao que fecha a classe inteira e nao haver dois lados.
 *
 * @param {{ id?: string, floor: number, ceiling: number, guard: string }} lever
 * @param {number} level
 * @param {number} [power]
 * @param {Record<string, Band>} [bands] as faixas VIGENTES; sem elas, as da posse
 * @returns {string}
 */
export function riteFor(lever, level, power = 0, bands) {
  const guard = FLOOR_RITE[/** @type {keyof typeof FLOOR_RITE} */ (lever.guard)] ?? "law";
  const band = bandOf({ id: lever.id ?? "", ...lever }, bands);

  let rite = "budget";
  if (level < band.floor) rite = harder(rite, guard);
  if (level > band.ceiling) rite = harder(rite, harder("law", guard));

  return underPower(rite, power);
}

/**
 * COMPOE A PAUTA a partir do que o jogador moveu.
 *
 * ⚠ FUNCAO PURA. Mesmos programas, mesmos niveis e mesmo pedido devolvem
 * exatamente a mesma pauta — nenhum sorteio, nenhum relogio, nenhum estado.
 *
 * @param {object} input
 * @param {ReadonlyArray<Program>} input.programs
 * @param {ReadonlyArray<Rule>} [input.rules] - as alavancas de regra
 * @param {Record<string, number>} input.levels - o nivel VIGENTE de cada alavanca
 * @param {Record<string, number>} input.requested - o nivel PEDIDO; ausente = sem mudanca
 * @param {number} [input.power] - o poder do Executivo VIGENTE, de 0 a 100
 * @param {Record<string, Band>} [input.bands] - as faixas VIGENTES; a lei de hoje
 * @param {Record<string, Band>} [input.requestedBands] - as faixas PEDIDAS; a lei proposta
 * @returns {Agenda}
 */
export function compose({
  programs,
  rules = [],
  levels,
  requested,
  power = 0,
  bands,
  requestedBands,
}) {
  /** @type {Move[]} */
  const moves = [];
  /** @type {Breach[]} */
  const breaches = [];

  let weightTotal = 0;
  let economic = 0;
  let liberty = 0;
  let threat = 0;
  let spend = 0;
  let rite = "budget";

  /** @type {Record<string, number>} */
  const byArea = {};

  /* AS DUAS FAMILIAS ENTRAM NA MESMA VARREDURA, e essa e a decisao de desenho
     que faz o resto funcionar. Um programa e uma regra sao a mesma primitiva com
     moedas diferentes: `cost` mede quanto o movimento custa por ano, `reach` mede
     quanto do pais ele toca. Os dois viram peso na mesma media ponderada, e por
     isso privatizar a Petrobras e cortar a merenda podem ir no MESMO texto e o
     Congresso ve uma proposta so — que e o logrolling existindo por construcao. */
  for (const lever of [...programs, ...rules]) {
    const program = /** @type {Program & Partial<Rule>} */ (lever);
    const size = program.cost ?? program.reach ?? 0;
    const from = clamp100(levels[program.id] ?? program.initial);
    const to = clamp100(requested[program.id] ?? from);
    const delta = to - from;

    /* ── A LEI DESTA ALAVANCA, ANTES E DEPOIS ─────────────────────────────────
       `band` e o que vale hoje; `asked` e o que o texto propoe. Quando o jogador
       nao toca na faixa, os dois sao o mesmo objeto e nada abaixo muda de
       comportamento — que e a garantia de que trazer as leis para o estado nao
       reescreveu o jogo que ja existia. */
    const band = bandOf(program, bands);
    const asked = requestedBands?.[program.id] ?? band;

    const floorDelta = asked.floor - band.floor;
    const ceilingDelta = asked.ceiling - band.ceiling;

    /* ⚠ O NIVEL E JULGADO CONTRA A FAIXA PEDIDA, E NAO CONTRA A VIGENTE. E aqui
       que a jogada nova aparece: derrubar o piso da saude de 59 para 30 E baixar o
       gasto para 35 no MESMO texto. Julgado contra a faixa vigente, o segundo
       movimento seria uma segunda violacao e o pacote pagaria duas vezes pela
       mesma decisao; julgado contra a pedida, o texto e um so — a emenda que
       derruba o piso ja contem a autorizacao para gastar abaixo dele.

       E nao ha desconto escondido nisso: mexer na faixa custa, no minimo, o mesmo
       que atravessa-la custava. O jogador nao economiza votos — ele deixa de
       comprar duas vezes o mesmo voto. */
    for (const [side, moved] of /** @type {const} */ ([
      ["floor", floorDelta],
      ["ceiling", ceilingDelta],
    ])) {
      if (moved === 0) continue;

      const weightOfBand = Math.abs(moved) * size;
      const towardsBand = moved > 0;

      /* A FAIXA CARREGA A POSICAO DO PROGRAMA, com o mesmo espelho do nivel:
         ampliar o que a lei obriga e um ato do lado do programa; soltar a
         obrigacao e o ato oposto. Vincular receita a saude e uma proposta de
         esquerda; desvincular e de direita, e ninguem escreveu isso. */
      economic += weightOfBand * (towardsBand ? program.economic : 100 - program.economic);
      liberty += weightOfBand * (towardsBand ? program.liberty : 100 - program.liberty);
      threat += weightOfBand * program.threat;
      weightTotal += weightOfBand;
      byArea[program.area] = (byArea[program.area] ?? 0) + weightOfBand;

      const own = underPower(riteForBand(program.guard), power);
      rite = harder(rite, own);

      /* ELE NAO GASTA NO MES, e a omissao e a verdade do modelo: mover um piso
         nao empenha um real hoje. Ele muda quanto do orcamento passa a ser
         OBRIGATORIO — e essa conta e permanente, e quem a faz e o turno, na
         virada. Somar aqui contaria o mesmo efeito duas vezes. */
      moves.push({
        program,
        delta: moved,
        weight: weightOfBand,
        spend: 0,
        rite: own,
        kind: side,
      });
    }

    /* PARADO NAO E MOVIMENTO. Um programa que nao mudou nao entra na media com
       peso zero — ele nao entra, ponto. Somar zeros e barato e engana: a lista de
       `moves` passaria a ter 33 linhas todo mes, e a tela que a mostra deixaria
       de dizer o que o jogador fez. */
    if (delta === 0) continue;

    const weight = Math.abs(delta) * size;
    /* REGRA NAO CUSTA DISCRICIONARIO. O efeito fiscal dela — dividendo, folha,
       venda — nao e gasto do mes: e outra conta, e quem a faz e o turno. */
    const contribution = program.cost === undefined ? 0 : (delta / 100) * program.cost;

    /* O ESPELHO. Ver o cabecalho: cortar um programa e a proposta oposta a
       amplia-lo, e nao a mesma proposta com sinal trocado no dinheiro. */
    const towards = delta > 0;
    economic += weight * (towards ? program.economic : 100 - program.economic);
    liberty += weight * (towards ? program.liberty : 100 - program.liberty);

    /* A AMEACA NAO ESPELHA, e a assimetria e deliberada. Ameacar a maquina e
       ameacar a maquina: cortar a Policia Federal nao "desameaca" ninguem — ela
       simplesmente deixa de ser uma pauta sobre a maquina. O termo mede o quanto
       o assunto TOCA a barganha, e tocar nao tem sinal. */
    threat += weight * program.threat;

    weightTotal += weight;
    spend += contribution;
    byArea[program.area] = (byArea[program.area] ?? 0) + weight;

    let own = "budget";

    if (to < asked.floor) {
      const required = FLOOR_RITE[/** @type {keyof typeof FLOOR_RITE} */ (program.guard)] ?? "law";
      breaches.push({ programId: program.id, side: "floor", rite: required });
      own = harder(own, required);
    }

    /* FURAR O TETO E LEI NO MINIMO, e a guarda pode cobrar mais. Piso e o que a
       lei OBRIGA; teto e o que ela AUTORIZA. Gastar acima do autorizado exige
       credito novo, e credito novo passa pelo Congresso — inclusive num programa
       cujo piso nao e lei nenhuma.

       ⚠ E A GUARDA PESA NOS DOIS LADOS, o que so ficou obvio quando a alavanca de
       poder chegou. A primeira versao cobrava "lei" para todo teto furado, e com
       isso levar o Executivo ao maximo — que e literalmente romper um limite
       constitucional — custava 257 votos. O limite nao sabe de que lado ele foi
       atravessado; quem sabe o preco e a Constituicao. */
    if (to > asked.ceiling) {
      const required = riteForBand(program.guard);
      breaches.push({ programId: program.id, side: "ceiling", rite: required });
      own = harder(own, required);
    }

    /* O RITO DE CADA MOVIMENTO FICA GUARDADO NELE, e nao so o do pacote. E o que
       permite o turno separar as duas naturezas quando a votacao cai: o que era
       execucao orcamentaria acontece de qualquer jeito — a lei ja autorizava —, e
       so o que dependia de voto morre com a derrota. Sem isto, um pacote de dez
       remanejamentos triviais e uma reforma constitucional teria de ser tudo ou
       nada, e o jogador perderia o mes inteiro por causa da parte ambiciosa. */
    /* ⚠ O PODER QUE VALE E O VIGENTE, e nunca o pedido. Se a proposta pudesse
       usar o poder que ela mesma cria, uma emenda que leva o Executivo a 85 se
       autorizaria a passar por caneta — e o jogo teria uma jogada que se aprova
       sozinha. O degrau so vale no mes seguinte, depois de o Congresso ter
       concedido. */
    own = underPower(own, power);
    rite = harder(rite, own);
    moves.push({ program, delta, weight, spend: contribution, rite: own, kind: "level" });
  }

  /* NENHUM MOVIMENTO NAO VIRA PROPOSTA. A alternativa seria devolver um vetor em
     (50, 50) — uma proposta centrista fantasma, que o ECLUSA votaria com prazer e
     que ninguem escreveu. Ausencia de pauta e ausencia, e a unica forma honesta
     de mostra-la e nao mostrar. */
  if (weightTotal === 0) {
    return { moves, breaches, proposal: null, quorum: 0, spend: 0 };
  }

  /* O ASSUNTO E A AREA DE MAIOR PESO. Uma proposta que mexe em seis areas ainda
     precisa de um endereco na tela, e o endereco honesto e onde o dinheiro se
     moveu mais — nao a primeira da lista, que seria a ordem do catalogo virando
     afirmacao sobre o mundo. */
  const area = Object.entries(byArea).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";

  const proposal = {
    id: "pauta-composta",
    label: labelOf(moves),
    area,
    instrument: rite,
    economic: economic / weightTotal,
    liberty: liberty / weightTotal,
    threat: threat / weightTotal,
    /* O SINAL SEGUE A CONVENCAO DO CATALOGO: positivo POUPA. Gastar mais e
       `spend` positivo, e portanto impacto fiscal negativo. */
    fiscalImpact: -spend,
  };

  return {
    moves,
    breaches,
    proposal,
    /* O QUORUM SAI DA MESMA FUNCAO QUE O CATALOGO USAVA. `budget` nao esta na
       lista de instrumentos dela e cai no padrao de maioria simples — por isso a
       ausencia de votacao e decidida AQUI, e nao la: uma execucao orcamentaria
       nao vai a plenario, e devolver 257 para ela seria a tela pedindo votos para
       uma coisa que ninguem vota. */
    quorum: rite === "budget" ? 0 : quorumOf(proposal),
    spend,
  };
}

/**
 * QUANTO UMA CONFIGURACAO CUSTA NO MES, em bilhoes, e SO A PARTE DISCRICIONARIA.
 *
 * ── A LINHA QUE SEPARA AS DUAS DESPESAS ──────────────────────────────────────
 * O gasto ate o PISO nao e escolha: e a lei sendo cumprida, e ele ja esta dentro
 * da despesa obrigatoria que o LASTRO recebe. O que este calculo devolve e so o
 * que esta ACIMA do piso — o dinheiro que o presidente decide, e o mesmo de onde
 * sai emenda para o Congresso.
 *
 * ⚠ E A DESCOBERTA MAIS DURA DO MODELO: com o catalogo real, a configuracao
 * HERDADA ja consome praticamente todo o discricionario do mes. O jogador nao
 * comeca com um cofre para distribuir; ele comeca com um orcamento inteiro ja
 * comprometido pelo antecessor. Para pagar uma bancada, ele tem de tirar de
 * alguma area — e essa e a primeira decisao de verdade que o jogo faz o jogador
 * tomar. Nao foi desenhado assim: caiu da aritmetica quando os numeros viraram
 * os do Brasil.
 *
 * ⚠ O PISO QUE VALE E O DA LEI VIGENTE, e nao o da posse. Desde que as faixas
 * viraram estado, uma reforma aprovada em marco muda esta conta em abril: piso
 * mais baixo joga gasto do OBRIGATORIO para o DISCRICIONARIO, e o mes seguinte
 * comeca com mais orcamento em disputa — que e exatamente o que desvincular
 * significa, e o oposto do que o jogador costuma esperar de "cortar uma lei".
 *
 * @param {object} input
 * @param {ReadonlyArray<Program>} input.programs
 * @param {Record<string, number>} input.levels
 * @param {Record<string, Band>} [input.bands]
 * @returns {{ byArea: Record<string, number>, byProgram: Record<string, number>, total: number }}
 */
export function spendOf({ programs, levels, bands }) {
  /** @type {Record<string, number>} */
  const byArea = {};
  /** @type {Record<string, number>} */
  const byProgram = {};
  let total = 0;

  for (const program of programs) {
    const level = clamp100(levels[program.id] ?? program.initial);
    /* Abaixo do piso o discricionario e ZERO, e nao negativo: cortar abaixo do
       que a lei obriga nao devolve dinheiro para o caixa discricionario, devolve
       para a despesa obrigatoria — que e outra conta, e quem a move e a reforma. */
    const above = Math.max(0, level - bandOf(program, bands).floor);
    const monthly = (above / 100) * program.cost * MONTHLY;

    byProgram[program.id] = monthly;
    byArea[program.area] = (byArea[program.area] ?? 0) + monthly;
    total += monthly;
  }

  return { byArea, byProgram, total };
}

/**
 * O NIVEL QUE O CAIXA REALMENTE HONRA, depois do rateio.
 *
 * O corte empurra cada programa de volta na direcao do PISO, na proporcao do que
 * foi pedido acima dele. E a mesma regra do rateio da emenda, vista do lado do
 * ministerio — e ela e o contingenciamento existindo como mecanica em vez de como
 * palavra: quando falta dinheiro, o Estado inteiro escorrega para o minimo legal,
 * e ninguem escolheu qual programa sofre.
 *
 * @param {object} input
 * @param {ReadonlyArray<Program>} input.programs
 * @param {Record<string, number>} input.levels - o pedido
 * @param {number} input.ratio - de 0 a 1
 * @param {Record<string, Band>} [input.bands] - as faixas VIGENTES
 * @returns {Record<string, number>}
 */
export function honour({ programs, levels, ratio, bands }) {
  /** @type {Record<string, number>} */
  const next = {};
  for (const program of programs) {
    const level = clamp100(levels[program.id] ?? program.initial);
    const above = Math.max(0, level - bandOf(program, bands).floor);
    next[program.id] = level - above * (1 - ratio);
  }
  return next;
}

/**
 * O NOME DA PAUTA, montado do que ela faz.
 *
 * Ele existe porque a tela precisa chamar a proposta de alguma coisa, e "pauta
 * composta" repetido todo mes nao distingue um remanejamento de merenda de uma
 * reforma da previdencia. O criterio e o mesmo do assunto: manda quem pesa mais.
 *
 * @param {Move[]} moves
 * @returns {string}
 */
function labelOf(moves) {
  const ordered = [...moves].sort((a, b) => b.weight - a.weight);
  const first = ordered[0];
  if (!first) return "";

  const verb = first.delta > 0 ? "Ampliar" : "Cortar";
  const rest = ordered.length - 1;

  if (rest === 0) return `${verb} ${first.program.label.toLowerCase()}`;
  return `${verb} ${first.program.label.toLowerCase()} · e mais ${rest}`;
}
