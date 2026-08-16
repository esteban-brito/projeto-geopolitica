/* A TRAMITACAO — o texto deixa de ser instantaneo.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   os textos protocolados, a camara, o mes e o catalogo
   devolve  os textos um estagio adiante, e o que deles chegou ao plenario

   Este arquivo nao e um motor e nao tem codinome — ele COMPOE, como `agenda.mjs`
   e `turn.mjs`. E a razao de ele nao ser motor e a decisao central desta parte:
   NADA aqui inventa preco. A Mesa decide com `whipCount`, o relator escolhe com a
   mesma distancia euclidiana que ECLUSA usa, e o plenario vota com `vote`. O que
   esta parte acrescenta e TEMPO.

   ── A LINHA QUE SEPARA O QUE ESPERA DO QUE NAO ESPERA JA EXISTIA: E O RITO ────
   `budget` e execucao orcamentaria — a lei ja autorizou, e pedir voto para
   executar o orcamento seria inventar um rito que nao existe no mundo. Continua
   imediato. `law` e acima viram TEXTO, e texto tramita.

   E por isso a mudanca nao quebra o jogo que existia: o presidente que so remaneja
   verba dentro das faixas nao sente diferenca nenhuma. Quem legisla e que passa a
   esperar.

   ── TRES ESTAGIOS, UM POR MES ────────────────────────────────────────────────
     GAVETA      o presidente da Camara decide se pauta. E o poder mais real do
                 sistema brasileiro, e o jogo nao o tinha: um texto que a Mesa nao
                 quer NAO PERDE A VOTACAO — ele nunca acontece, e o jogador
                 descobre que perdeu sem nunca ter perdido nada;
     RELATORIA   o texto volta MUDADO;
     PLENARIO    a votacao, que o jogo ja sabe fazer.

   Um texto ordinario leva tres meses da caneta ao efeito, e e isso que faz o mes
   40 ser diferente do mes 4: o que nao foi protocolado a tempo nao vira lei dentro
   do mandato.

   ── A MESA NAO GANHA FORMULA PROPRIA ─────────────────────────────────────────
   "Ele pauta?" e a mesma pergunta que "ele votaria a favor?", e a resposta sai de
   `whipCount` sobre uma bancada de UM SO — o presidente da Camara ja tem posicao,
   venalidade e memoria como qualquer bancada. Uma segunda formula criaria um preco
   que diverge do preco do voto dele, e o jogador nao teria como prever nenhum dos
   dois.

   ⚠ O LIMIAR FICA ABAIXO DE MEIO, e isso e a mecanica e nao calibragem frouxa:
   PAUTAR NAO E APOIAR — e deixar o plenario decidir, e isso custa menos que
   assinar embaixo. Com o limiar em meio, a Mesa vira um segundo veto pelo mesmo
   preco, e o jogador paga duas vezes pela mesma adesao.

   ── O RELATOR ESCREVE A EXCECAO QUE A GRAMATICA JA EXECUTA ───────────────────
   O `salvo` da Parte 1 existia sem ninguem para escreve-lo. O relator e esse ator,
   e o que ele salva NAO E SORTEADO: entre as alavancas que o texto machuca, ele
   protege a mais proxima dele no plano `economico × liberdades` — a mesma
   distancia que ECLUSA usa para decidir voto, agora com outro interesse.

   E o que torna o jabuti LEGIVEL: o jogador olha o relator, ve a posicao dele, e
   preve qual pedaco volta intacto. Jabuti sorteado seria ruido; jabuti previsivel
   e uma peca de negociacao.

   ⚠ COM NORMA POR ALAVANCA, "SALVO X" E "X SAI DO TEXTO". A gramatica expressa o
   `salvo` como `target.except`, e isso so tem sentido num alvo de AREA ou de TUDO —
   uma norma que fala de uma alavanca so nao tem do que excetuar. Como `enact`
   escreve uma norma por alavanca (ver a prosa dela: uma norma por alavanca, e nao
   uma por lado), a excecao do relator se realiza retirando a alavanca protegida do
   texto. O efeito no mundo e identico, e o preco cai junto — que e o que o ciclo
   quis dizer com "ele nao mexe no rito: o preco vem do que o texto AINDA derruba".

   ── O QUE ESTE ARQUIVO NAO FAZ ───────────────────────────────────────────────
   Nao sorteia nada. A gaveta e a relatoria sao deterministicas; o unico sorteio da
   tramitacao e o do dia da votacao, e ele continua dentro de `vote`, com o fluxo
   que vive no estado. Um mandato inteiro continua se refazendo da semente. */

import { whipCount } from "../domain/congress/index.mjs";
import { compose } from "./agenda.mjs";

/**
 * @typedef {import("../state/state.mjs").Band} Band
 * @typedef {import("../data/parties.mjs").Party} Party
 * @typedef {import("../domain/cast/index.mjs").Person} Person
 *
 * @typedef {"drawer" | "rapporteur" | "floor"} Stage
 *
 * @typedef {object} Bill um texto protocolado, e ele e o TEXTO e nao o efeito
 * @property {string} id
 * @property {number} writtenAt - o mes em que o presidente assinou
 * @property {Stage} stage
 * @property {number} since - o mes em que entrou neste estagio
 * @property {string} label - o assunto, como a tela o chama
 * @property {Record<string, Band>} bands - as faixas que ele pede
 * @property {Record<string, number>} levels - os niveis que ele pede, e so os que
 *   dependem de voto: o que e execucao orcamentaria nunca entra num texto
 * @property {string[]} except - o que o relator salvou; vazio ate a relatoria
 * @property {string} [saved] - o rotulo do que foi salvo, para a tela dizer
 */

/* ⚠ QUANTO DA BANCADA DO PRESIDENTE DA CAMARA BASTA PARA ELE PAUTAR. Abaixo de
   meio de proposito, e a razao esta na prosa do topo: pautar nao e apoiar. O numero
   e primeiro chute declarado, como o PIVOT de ECLUSA — o que NAO e chute e a
   desigualdade: este limiar tem de ser menor que o de aprovar, senao a Mesa vira um
   segundo veto pelo mesmo preco. */
const TABLE = 0.38;

/* QUANTOS MESES UM TEXTO SOBREVIVE NA GAVETA. Seis, e depois disso ele morre sem
   nunca ter ido a voto — que e o destino da esmagadora maioria dos projetos numa
   casa legislativa de verdade, e a razao de "engavetar" ser um verbo. */
const DRAWER_LIFE = 6;

/**
 * O TEXTO COMO PROPOSTA — recomposto contra o pais de HOJE, e nao o de ontem.
 *
 * ⚠ O TEXTO E FIXO E O MUNDO ANDA, e por isso a proposta se refaz a cada estagio.
 * Um texto protocolado em janeiro que chega ao plenario em marco e votado pelo que
 * ele derruba EM MARCO: se outra lei ja tiver baixado aquele piso no meio do
 * caminho, o texto passou a pedir menos, e o preco dele cai sozinho. Guardar a
 * proposta junto do texto congelaria a ameaca no dia da assinatura, e o Congresso
 * votaria um mundo que nao existe mais.
 *
 * @param {Bill} bill
 * @param {object} world
 * @param {Record<string, number>} world.levels - os niveis vigentes
 * @param {Record<string, Band>} world.bands - a lei vigente
 * @param {number} world.power
 * @param {import("../data/catalog.mjs").CATALOG} world.catalog
 */
export function proposalOf(bill, { levels, bands, power, catalog }) {
  /* A EXCECAO DO RELATOR SAI AQUI, e nao no momento de aplicar: ela muda o que o
     texto PEDE, e portanto muda quem ele incomoda e quanto ele custa. */
  const spared = new Set(bill.except);

  /** @type {Record<string, Band>} */
  const asked = {};
  for (const [id, band] of Object.entries(bill.bands)) {
    if (!spared.has(id)) asked[id] = band;
  }

  /** @type {Record<string, number>} */
  const wanted = { ...levels };
  for (const [id, level] of Object.entries(bill.levels)) {
    if (!spared.has(id)) wanted[id] = level;
  }

  return compose({
    programs: catalog.programs,
    rules: catalog.rules,
    levels,
    requested: wanted,
    power,
    bands,
    requestedBands: { ...bands, ...asked },
  });
}

/**
 * A MESA DECIDE — e ela decide com a mesma formula do voto dela.
 *
 * @param {object} input
 * @param {import("./agenda.mjs").Proposal} input.proposal
 * @param {Person | null} input.speaker
 * @param {ReadonlyArray<Party>} input.benches
 * @param {Record<string, number>} input.funding - a verba OFERECIDA, por bancada
 * @param {Record<string, number>} input.loyalty
 * @param {number} input.standing - a rua
 * @returns {{ tabled: boolean, share: number }}
 */
export function tables({ proposal, speaker, benches, funding, loyalty, standing }) {
  const seat = speaker ? benches.find(bench => bench.id === speaker.id) : undefined;

  /* ⚠ SEM PRESIDENTE DA CAMARA, A GAVETA NAO EXISTE — e o texto passa direto. Nao
     e cortesia: e a leitura honesta de um Congresso em que ninguem ocupa a Mesa. O
     caso so acontece se o catalogo perder o arquetipo, e a alternativa (segurar
     todo texto para sempre) seria o jogo travar por um dado faltando. */
  if (!seat) return { tabled: true, share: 1 };

  const forecast = whipCount({
    bill: proposal,
    parties: [seat],
    funding: { [seat.id]: funding[seat.id] ?? 0 },
    loyalty: { [seat.id]: loyalty[seat.id] ?? 0 },
    standing,
  });

  const share = seat.seats > 0 ? forecast.votes / seat.seats : 0;
  return { tabled: share >= TABLE, share };
}

/**
 * O RELATOR ESCREVE O JABUTI — e ele protege quem esta mais perto dele.
 *
 * ⚠ O QUE ELE SALVA NAO E O QUE MAIS DOI NO PAIS, e sim o que mais dói NELE. E a
 * diferenca entre um relator e um auditor: ele nao corrige o texto, ele o emenda a
 * favor do proprio lado. A distancia e a mesma que ECLUSA usa para decidir voto —
 * nenhuma formula nova, outro interesse.
 *
 * ⚠ E ELE SALVA UMA SO. Um relator que protegesse tudo o que lhe e proximo
 * esvaziaria qualquer texto, e o jabuti deixaria de ser uma peca de negociacao para
 * virar um veto. Uma alavanca e o que cabe num relatorio sem virar outro texto.
 *
 * @param {object} input
 * @param {Person | null} input.rapporteur
 * @param {import("./agenda.mjs").Agenda} input.agenda a proposta recomposta
 * @param {import("../data/catalog.mjs").CATALOG} input.catalog
 * @returns {{ except: string[], saved: string | undefined }}
 */
export function reports({ rapporteur, agenda, catalog }) {
  if (!rapporteur || agenda.moves.length === 0) return { except: [], saved: undefined };

  const levers = new Map([...catalog.programs, ...catalog.rules].map(lever => [lever.id, lever]));

  /** @type {{ id: string, label: string, distance: number } | null} */
  let closest = null;
  /* QUANTAS ALAVANCAS O TEXTO MACHUCA. Ela decide se ha o que emendar — ver a nota
     no fim desta funcao. */
  let hurt = 0;

  for (const move of agenda.moves) {
    const lever = levers.get(move.program.id);
    if (!lever) continue;

    /* ⚠ SO O QUE O TEXTO MACHUCA ENTRA NA ESCOLHA. Um movimento que AMPLIA nao
       precisa de protecao — proteger o que ja esta sendo ampliado seria o relator
       assinando um jabuti que nao salva ninguem. O corte e o que dói, e e o sinal
       do delta que diz qual e qual. */
    if (move.delta >= 0) continue;
    hurt++;

    const dx = lever.economic - rapporteur.economic;
    const dy = lever.liberty - rapporteur.liberty;
    const distance = dx * dx + dy * dy;

    if (!closest || distance < closest.distance) {
      closest = { id: lever.id, label: lever.label, distance };
    }
  }

  /* ⚠ O RELATOR NAO PODE ESVAZIAR O TEXTO, e esta linha e a correcao de um defeito
     medido no dia em que a tramitacao nasceu: um texto que movia UMA alavanca so
     chegava ao plenario vazio, porque o relator tinha salvado exatamente aquela — e
     um texto vazio nao vai a voto, ele morre. Resultado: NENHUMA emenda de alavanca
     unica sobrevivia a relatoria, em nenhuma calibragem de verba. Medido: 24 meses,
     cinco niveis de verba, zero votacoes.

     ⚠ E O DEFEITO NAO ERA DE NUMERO — ERA DE PAPEL. O relator que apaga a unica
     clausula do texto nao escreveu um jabuti: ele REJEITOU o projeto, e rejeitar e
     trabalho do plenario. E o mesmo raciocinio que faz o limiar da Mesa ficar abaixo
     de meio: quem nao decide o merito nao pode ter poder de veto pelo caminho.

     Emendar exige o que sobra. Com uma clausula so, nao ha o que emendar. */
  if (!closest || hurt < 2) return { except: [], saved: undefined };
  return { except: [closest.id], saved: closest.label };
}

/**
 * QUANTO TEMPO UM TEXTO JA ESPERA NA GAVETA.
 *
 * @param {Bill} bill
 * @param {number} month
 */
export function forgotten(bill, month) {
  return bill.stage === "drawer" && month - bill.writtenAt >= DRAWER_LIFE;
}

export { TABLE, DRAWER_LIFE };
