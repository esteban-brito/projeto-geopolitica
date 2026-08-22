/* SONDA — opiniao publica por segmento.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   indicadores DIVULGADOS (com defasagem), o servico publico, o mes
   devolve  a satisfacao de cada segmento e a aprovacao na escala de pesquisa

   ── DUAS DECISOES QUE JA ESTAVAM FECHADAS NO CONTRATO, e as duas valem ──────
     · a escala nao e um numero de 0 a 100. Ela replica a forma de uma pesquisa
       real — otimo/bom, regular, ruim/pessimo — porque e assim que a informacao
       chega ao presidente, e porque media estavel escondendo polarizacao e
       justamente a leitura que interessa;
     · o motor le o indicador DIVULGADO, nunca o do mes corrente. Um presidente
       tambem nao sabe o PIB do mes em que esta. A defasagem e MECANICA: ela e o
       que faz uma correcao demorar a aparecer, e o que faz o jogador impaciente
       corrigir duas vezes o mesmo problema.

   ── POR QUE ELE NASCEU AGORA, e nao antes ───────────────────────────────────
   Porque so agora existe o que ele consome. Ate a CORRENTE nascer nao havia
   inflacao nem desemprego, e uma aprovacao construida sobre indice de area
   sozinho seria um segundo indice de area com outro nome. A aprovacao ficou
   FORA DA TELA por tres sessoes com esta razao escrita — "quem a produz e SONDA,
   que nao existe" —, e este arquivo e o que a traz de volta.

   ── A SATISFACAO E UM ESTOQUE, E NAO UMA CONTA DO MES ───────────────────────
   Ninguem acorda com uma opiniao nova sobre o governo. O que este motor calcula
   e um ALVO — o quanto a vida justifica satisfacao hoje — e depois arrasta a
   satisfacao de ontem na direcao dele. Sem a inercia, uma inflacao ruim isolada
   derrubaria o governo num mes e o mes seguinte o devolveria, e a serie viraria
   ruido em vez de historia.

   ⚠ E A DESCIDA E MAIS RAPIDA QUE A SUBIDA. E o achado mais consistente da
   literatura de opiniao publica, e sem ele o jogo ensinaria que da para deixar a
   popularidade desabar e recuperar depois — que e o erro que acaba com mandato.

   ── O QUE ELE NAO FAZ, declarado ────────────────────────────────────────────
   Evento e escandalo (dependem de TEMPORAL), enquadramento de imprensa (depende
   do elenco do ciclo 4), recorte regional e religioso. Nenhum e necessario para
   a aprovacao TER PRECO, que e a razao de este motor existir agora. */

/**
 * @typedef {import("../../data/opinion.mjs").Segment} Segment
 * @typedef {import("../../data/opinion.mjs").OpinionParameters} OpinionParameters
 *
 * @typedef {object} Approval a escala de pesquisa, em pontos que somam 100
 * @property {number} good - "otimo/bom"
 * @property {number} fair - "regular"
 * @property {number} poor - "ruim/pessimo"
 *
 * @typedef {object} Released o que a populacao JA SABE quando o mes comeca
 * @property {number} inflation - ao ano, em fracao
 * @property {number} unemployment - em fracao da forca de trabalho
 * @property {number} growth - crescimento real anualizado, em fracao
 *
 * @typedef {object} OpinionInput
 * @property {Record<string, number>} mood - a satisfacao de cada segmento, de 0 a 100
 * @property {Released} released
 * @property {number} services - o servico publico percebido, de 0 a 100
 * @property {number} safety - a ordem percebida, de 0 a 100
 * @property {number} [betrayal] - a fracao da promessa que o caixa NAO honrou
 * @property {number} [tenure] - meses no cargo; o desgaste cresce com eles
 * @property {ReadonlyArray<Segment>} segments
 * @property {OpinionParameters} parameters
 *
 * @typedef {object} OpinionOutput
 * @property {Record<string, number>} mood - a satisfacao do mes seguinte
 * @property {Approval} approval - a leitura nacional, na escala de pesquisa
 * @property {Record<string, Approval>} bySegment - a mesma escala, por segmento
 *
 * ── A CONTA, e ela existe para a tela poder EXPLICAR ─────────────────────────
 * ⚠ OS QUATRO CAMPOS ABAIXO ENTRARAM EM 21/08/2026, e ate entao esta funcao calculava
 * todos eles e os descartava. A referencia e o Democracy 4: la o jogo inteiro e a cadeia
 * causal visivel — o jogador ve POR QUE cada grupo mudou. Aqui a cadeia existia completa
 * e morria dentro do laco.
 *
 * @property {Record<string, number>} notes - as cinco notas nacionais, de 0 a 100
 * @property {number} betrayal - quanto a promessa quebrada tirou de todo mundo
 * @property {number} wear - quanto o desgaste do cargo tirou de todo mundo
 * @property {Record<string, Record<string, number>>} weighed - cada nota JA PESADA, por
 *   segmento. ⚠ E ela e pesada AQUI e nao na view: multiplicar nota por peso do lado de
 *   la daria dois lugares fazendo a mesma conta, e o segundo divergiria do primeiro no
 *   dia em que um peso mudasse — que e o dia em que o anexo precisa estar certo
 */

/** @param {number} value */
function clamp100(value) {
  return Math.min(100, Math.max(0, value));
}

/**
 * NOTA DE 0 A 100 PARA UM INDICADOR EM QUE MENOS E MELHOR.
 *
 * `anchor` e o ponto em que ele deixa de incomodar — e nao a meta tecnica: gente
 * nao comemora inflacao na meta, gente para de reclamar. `span` e a distancia
 * adiante em que ele passa a dominar a conversa.
 *
 * @param {number} value
 * @param {number} anchor
 * @param {number} span
 */
function lowerIsBetter(value, anchor, span) {
  return clamp100(50 - ((value - anchor) / span) * 50);
}

/**
 * A MESMA NOTA para um indicador em que MAIS e melhor.
 *
 * @param {number} value
 * @param {number} anchor
 * @param {number} span
 */
function higherIsBetter(value, anchor, span) {
  return clamp100(50 + ((value - anchor) / span) * 50);
}

/**
 * Um mes de opiniao publica.
 *
 * ⚠ FUNCAO PURA e sem sorteio. Ela nao conhece o mes corrente do jogo: quem
 * decide qual indicador ja foi divulgado e quem a chama, e por isso a defasagem
 * nao pode ser esquecida aqui dentro — ela chega pronta em `released`.
 *
 * @param {OpinionInput} input
 * @returns {OpinionOutput}
 */
export function step(input) {
  const { released, parameters: p, segments } = input;

  /* AS QUATRO NOTAS QUE O PAIS INTEIRO RECEBE. Elas sao as mesmas para todo
     mundo — o que muda entre os segmentos e o PESO de cada uma, e e so isso que
     faz a mesma politica agradar uns e irritar outros. Uma nota por segmento
     seria modelar percepcoes diferentes do mesmo fato, e isso e imprensa, que
     ainda nao existe. */
  const notes = {
    prices: lowerIsBetter(released.inflation, p.priceAnchor, p.priceSpan),
    jobs: lowerIsBetter(released.unemployment, p.jobAnchor, p.jobSpan),
    services: clamp100(input.services),
    safety: clamp100(input.safety),
    economy: higherIsBetter(released.growth, p.growthAnchor, p.growthSpan),
  };

  /* A PROMESSA QUEBRADA CHEGA A RUA, e nao so ao Congresso. O rateio que corta
     emenda corta obra inaugurada e convenio assinado — e a conta politica disso
     existia de um lado so ate aqui. Ela pesa igual em todo segmento porque o que
     ela mede e credibilidade, e credibilidade nao tem classe. */
  const betrayal = Math.min(1, Math.max(0, input.betrayal ?? 0)) * p.broken;

  /* ⚠ O DESGASTE DO CARGO, e ele cresce com o mandato. Governo se gasta: cada mes
     acumula decisao que desagradou alguem, promessa que nao coube e cansaco. Sem
     ele a serie subia sozinha ate o fim do mandato, porque um pais com indicadores
     dentro das ancoras produz alvo alto e a inercia so persegue o alvo.

     E ele e o que faz manter a rua ser TRABALHO: quem quiser terminar popular tem
     de entregar mais a cada ano, e nao apenas evitar erro. */
  const wear = Math.max(0, input.tenure ?? 0) * p.wearRate;

  /** @type {Record<string, number>} */
  const mood = {};
  /** @type {Record<string, Approval>} */
  const bySegment = {};
  /* QUANTO CADA NOTA VALEU PARA CADA SEGMENTO, ja pesado. E o que o anexo desenha, e a
     soma de uma linha destas menos traicao e desgaste E o alvo daquela classe. */
  /** @type {Record<string, Record<string, number>>} */
  const weighed = {};
  let weighted = 0;
  let shareTotal = 0;

  for (const segment of segments) {
    const target = clamp100(
      notes.prices * segment.prices +
        notes.jobs * segment.jobs +
        notes.services * segment.services +
        notes.safety * segment.safety +
        notes.economy * segment.economy -
        betrayal -
        wear,
    );

    const current = input.mood[segment.id] ?? segment.initial;

    /* A INERCIA, E A ASSIMETRIA DENTRO DELA. Subir arrasta devagar; cair arrasta
       `fallSpeed` vezes mais rapido. O `min` com 1 existe porque uma inercia
       negativa faria a satisfacao ultrapassar o alvo e oscilar — e opiniao
       publica que oscila e ruido, nao historia. */
    const pull = Math.min(1, (1 - p.inertia) * (target < current ? p.fallSpeed : 1));
    const next = clamp100(current + (target - current) * pull);

    mood[segment.id] = next;
    bySegment[segment.id] = pollOf(next, p);
    weighed[segment.id] = {
      prices: notes.prices * segment.prices,
      jobs: notes.jobs * segment.jobs,
      services: notes.services * segment.services,
      safety: notes.safety * segment.safety,
      economy: notes.economy * segment.economy,
    };
    weighted += next * segment.share;
    shareTotal += segment.share;
  }

  /* A MEDIA E PONDERADA PELA POPULACAO, e o divisor e a soma real das fatias e
     nao 1: um catalogo que nao some exatamente 1 devolveria uma aprovacao
     silenciosamente menor, e o defeito apareceria como "o governo e impopular"
     tres telas adiante. */
  const national = shareTotal > 0 ? weighted / shareTotal : 0;

  /* ⚠ A CONTA SAI JUNTO DO RESULTADO desde 21/08/2026, e ate aqui ela era CALCULADA E
     JOGADA FORA: `step` sabia exatamente por que cada classe mudou de humor — cinco notas
     pesadas uma a uma, menos a traicao e o desgaste — e devolvia so o numero. A tela
     mostrava "23%" e nao tinha como dizer nada alem disso.

     ⚠ E DEVOLVER A CONTA E O CONTRARIO DE REFAZE-LA. A alternativa seria a view multiplicar
     nota por peso para montar o anexo, e ai haveria dois lugares somando a mesma coisa —
     o defeito recorrente numero um deste projeto. Quem multiplica e quem ja multiplicava;
     o que mudou e que agora ele conta o que fez.

     A REFERENCIA E O DEMOCRACY 4, e ela e do responsavel: o jogo inteiro daquele e a
     cadeia causal visivel. Aqui a cadeia existia, completa, e era muda. */
  return { mood, approval: pollOf(national, p), bySegment, notes, betrayal, wear, weighed };
}

/**
 * A SATISFACAO VIRA PESQUISA — de um numero para as tres fatias.
 *
 * ⚠ A CONVERSAO NAO E LINEAR de proposito. "Regular" e a resposta confortavel e
 * as pontas exigem conviccao, entao o meio e largo e os extremos sao caros. Com
 * satisfacao 50 a pesquisa da perto de 30/40/30, que e o retrato de um governo
 * mediano — e nao 50/0/50, que e o que uma conversao linear produziria e que
 * nenhuma pesquisa real mostra.
 *
 * @param {number} mood de 0 a 100
 * @param {OpinionParameters} p
 * @returns {Approval}
 */
function pollOf(mood, p) {
  const share = clamp100(mood) / 100;

  const good = 100 * share ** p.goodSlope;
  const poor = 100 * (1 - share) ** p.poorSlope;

  /* AS TRES FATIAS SOMAM 100 SEMPRE, e o "regular" e o que sobra — nao um quarto
     numero com vida propria. O estado ja tinha esse invariante e ha prova dele
     em `tests/suites/state-reducer.mjs`; quebra-lo aqui apareceria como um
     medidor que nao fecha a barra. */
  const fair = Math.max(0, 100 - good - poor);
  const total = good + poor + fair;

  return {
    good: Math.round((good / total) * 100),
    fair: Math.round((fair / total) * 100),
    poor: 100 - Math.round((good / total) * 100) - Math.round((fair / total) * 100),
  };
}

/**
 * A opiniao de abertura, montada do catalogo.
 *
 * @param {ReadonlyArray<Segment>} segments
 * @returns {Record<string, number>}
 */
export function opening(segments) {
  return Object.fromEntries(segments.map(segment => [segment.id, segment.initial]));
}

/**
 * A LEITURA NACIONAL de uma satisfacao ja conhecida, sem avancar o mes.
 *
 * Ela existe para o estado de abertura e para a tela: as duas precisam da
 * pesquisa sem ter um mes para resolver, e refazer a conversao por fora seria a
 * segunda copia de uma regra que muda.
 *
 * @param {Record<string, number>} mood
 * @param {ReadonlyArray<Segment>} segments
 * @param {OpinionParameters} parameters
 * @returns {Approval}
 */
export function pollFrom(mood, segments, parameters) {
  let weighted = 0;
  let shareTotal = 0;
  for (const segment of segments) {
    weighted += (mood[segment.id] ?? segment.initial) * segment.share;
    shareTotal += segment.share;
  }
  return pollOf(shareTotal > 0 ? weighted / shareTotal : 0, parameters);
}
