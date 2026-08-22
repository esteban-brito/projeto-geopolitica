/* A CORRESPONDENCIA — o unico lugar do jogo que espera uma resposta.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   as cartas guardadas, o que o mes produziu, as ordens e o mes
   devolve  as cartas do mes seguinte, e o que venceu no caminho

   Este arquivo NAO E UM MOTOR e nao tem codinome, pela mesma razao de
   `passage.mjs`: nada aqui inventa preco. Ele decide QUANDO uma pergunta chega e
   QUANDO ela deixa de estar aberta; quem cobra e a tramitacao.

   ── POR QUE A CAIXA PRECISAVA VIRAR ESTADO ──────────────────────────────────
   Ate 16/08/2026 ela era um MURAL: lia os eventos do ultimo turno, desenhava, e no
   mes seguinte eles sumiam sozinhos. Sem resposta, sem prazo e sem consequencia —
   e um inbox onde tudo espera para sempre, ou onde nada espera, e uma lista de
   avisos com moldura de documento.

   ⚠ E ISSO CUSTOU MAIS DEPOIS DA TRAMITACAO, e nao menos. O jogador passou a ver o
   relator emendar o texto dele e a nao poder fazer nada a respeito: a peca mais
   sofisticada do projeto era, do lado de quem joga, inteiramente passiva. Medido:
   a politica `agenda` aprova 3 de 24 textos em 48 meses, e o presidente assiste aos
   21 morrerem.

   ── AS DUAS NATUREZAS, E A DIVISAO E A MECANICA ─────────────────────────────
     AVISO      `due` nulo. A Mesa pautou; o texto morreu na gaveta; o plenario
                decidiu. Nao ha o que responder, e prazo em aviso e relogio sem
                decisao;
     PERGUNTA   `due` no futuro. O relator emendou: aceitar ou travar? Ela SEGURA o
                texto onde ele esta ate ser respondida.

   E o prazo e o que separa uma bandeja de uma lista de tarefas.

   ── O SILENCIO ACEITA ────────────────────────────────────────────────────────
   Prazo vencido sem resposta: a emenda do relator vale. Nao e castigo inventado —
   e como uma tramitacao real anda, e e o que faz o prazo doer sem o motor fabricar
   uma punicao.

   ⚠ E A CARTA DIZ ISSO ANTES DE VENCER. Um dossie externo pediu o contrario — "se
   o prazo estourar, a base despenca automaticamente, SEM AVISO PREVIO" — e isso e
   o inverso da doutrina: informacao que chega depois da decisao e recibo. E saber o
   preco do silencio que transforma ignorar em ESCOLHA. */

/**
 * @typedef {import("../state/state.mjs").Letter} Letter
 * @typedef {import("./passage.mjs").Bill} Bill
 */

/* QUANTOS MESES UMA PERGUNTA FICA ABERTA. Dois, e o numero e primeiro chute
   declarado, como o PIVOT de ECLUSA e o TABLE da Mesa.

   ⚠ O QUE NAO E CHUTE E ELE SER MAIOR QUE UM. Com um mes, "responder" e "responder
   agora": a carta chega no fechamento e vence no fechamento seguinte, e ai o prazo
   nao compete com nada — ele so adia o clique em um turno. O prazo so vira mecanica
   quando cabe MAIS DE UMA COISA dentro dele, porque ai o jogador escolhe o que
   responder primeiro, e escolher e o jogo. */
export const ANSWER_TIME = 2;

/* QUANTOS MESES UMA CARTA JA FECHADA CONTINUA NA BANDEJA.
   ⚠ A PERGUNTA ABERTA NAO SAI NUNCA — ela sai quando fecha. Este numero governa o
   OUTRO lado: o aviso, e a pergunta ja respondida.

   Um foi escolhido contra as duas alternativas erradas, e as duas sao tentadoras:

     ZERO   o aviso morre no mesmo mes, e a bandeja volta a ser o mural que este
            ciclo veio consertar — o jogador nunca ve o desfecho de nada, porque o
            desfecho chega junto com o mes seguinte;
     NUNCA  48 meses de "a Mesa pautou" empilhados. E o oposto do que a bandeja
            existe para dizer: com cinquenta papeis dentro, a pergunta com prazo
            correndo vira mais um deles.

   Com um, o mes que fechou continua na mesa enquanto o novo comeca — que e onde
   papel de verdade fica — e some quando deixa de ser novidade.

   ⚠ E ELE SUBIU DE 1 PARA 24 EM 21/08/2026, por decisao do responsavel: "o empilhamento
   deve servir pra sempre — quando eu pulo o mes as mensagens do mes anterior devem
   continuar". Com um mes de retencao, a bandeja se esvaziava sozinha e a PILHA nunca
   tinha o que empilhar: o freio era o relogio, e nao o espaco.

   ⚠ A TROCA E DE FREIO, E NAO DE DOUTRINA. O "NUNCA" acima continua recusado — 48 meses
   de "a Mesa pautou" empilhados sao o mural que este arquivo veio consertar. O que mudou
   e QUEM freia: agora e a pilha da tela, que mostra onze e nunca descarta uma pergunta,
   e nao um contador de meses que apagava papel que o jogador ainda nao tinha lido.

   ⚠ E ISSO SO E SEGURO PORQUE O PESO ESTA NA COR. Numa bandeja indiferenciada, vinte e
   quatro cartas sao um mural; numa em que o movimento grande grita e o pequeno sussurra,
   sao um arquivo que se varre de relance. A frase e do responsavel: "e so fazer um jogo
   de cores, o olho vai focar no que importa". */
export const KEEP = 24;

/* QUANTAS CARTAS FECHADAS O ESTADO CARREGA, no maximo.
   ⚠ ELE EXISTE PORQUE `KEEP` DEIXOU DE SER UM FREIO. Com um mes de retencao, o freio era
   o relogio; com vinte e quatro, a bandeja acumula de verdade — e um mandato de 48 meses
   com tres relatorios por mes chegaria a 144 papeis no save se ninguem contasse.

   VINTE E QUATRO E O DOBRO DA PILHA VISIVEL, e a folga e de proposito: a pilha mostra
   onze e protege as perguntas, entao ela precisa de mais candidatos do que cabem para
   ter o que escolher. Guardar exatamente onze faria o teto da tela virar o teto do
   ESTADO, e ai mudar o recuo de uma linha apagaria correspondencia. */
const CARRY = 24;

/**
 * A CARTA DA EMENDA — a unica pergunta que o jogo faz hoje.
 *
 * O id e deterministico e amarrado ao TEXTO, e nao ao mes: um mesmo projeto nao
 * pode gerar duas perguntas sobre a mesma relatoria se ele voltar a passar por ela.
 * Se voltar — e ele volta, quando o jogador TRAVA —, a carta nova e outra porque o
 * relator escreveu outro relatorio, e o sufixo do mes e o que as distingue.
 *
 * @param {object} input
 * @param {Bill} input.bill
 * @param {number} input.month
 * @param {string[]} input.except - as alavancas que a emenda retira
 * @param {string} input.saved - o rotulo do que o relator salvou
 * @returns {Letter}
 */
export function amendment({ bill, month, except, saved }) {
  return {
    id: `reported:${bill.id}:${month}`,
    kind: "reported",
    month,
    due: month + ANSWER_TIME,
    subject: bill.label,
    bill: bill.id,
    except,
    saved,
    from: null,
    lever: null,
    level: null,
    was: null,
    now: null,
    weight: null,
    answer: null,
    closedAt: null,
  };
}

/**
 * A CHANTAGEM — a segunda pergunta que o jogo faz, e a primeira que vem de FORA da
 * tramitacao.
 *
 * ⚠ ELA EXISTE PORQUE QUATRO GRUPOS TINHAM PRESSAO E NENHUMA VOZ. A CALDEIRA nasceu no
 * ciclo 10 com posicao no plano, memoria e um instrumento declarado em prosa —
 * "o agronegocio para a safra, a Faria Lima precifica a divida" — e nenhum deles fazia
 * nada alem de somar para a queda. Um lobby que so sabe derrubar presidente e um lobby
 * que fica calado quarenta e sete meses.
 *
 * ── O QUE ELE EXIGE, E POR QUE NAO E DINHEIRO ───────────────────────────────
 * ⚠ O DECIMO DOSSIE PROPUNHA UM PRECO EM BILHOES — "[Ceder: custa R$ 4 bi]" —, e isso
 * seria uma SEGUNDA MOEDA. O ciclo 10 ja recusou uma: "o projeto tem uma bolsa de
 * proposito, e e isso que faz comprar o Congresso custar saude".
 *
 * Ele exige uma ALAVANCA, e o preco dela ja existe: mover um nivel dentro da faixa e
 * caneta — nao pede voto a ninguem — e sai do MESMO discricionario que paga a emenda.
 * O jogador nao aprende um preco novo; ele descobre que a bolsa ficou menor.
 *
 * ── E O NIVEL EXIGIDO NAO E INVENTADO ───────────────────────────────────────
 * E o nivel que aquele programa tinha NA POSSE. Um lobby nao pede um numero novo: ele
 * pede DE VOLTA o que foi cortado. Isso tem tres consequencias que nenhuma delas
 * precisou ser escrita:
 *
 *   · a exigencia so nasce quando o jogador de fato cortou, entao ela e consequencia
 *     da jogada dele e nao um evento que caiu do ceu;
 *   · ela e sempre pagavel, porque o pais ja gastou aquilo uma vez;
 *   · e ela nunca pede mais do que o mundo suportava — nao ha inflacao de exigencia.
 *
 * @param {object} input
 * @param {{ id: string }} input.lobby
 * @param {{ id: string, label: string }} input.program
 * @param {number} input.level - o nivel da posse
 * @param {number} input.month
 * @returns {Letter}
 */
export function demand({ lobby, program, level, month }) {
  return {
    /* O ID AMARRA GRUPO E ALAVANCA, e nao o mes: o mesmo grupo nao abre duas
       exigencias sobre o mesmo programa. Se ele voltar a exigir depois de a primeira
       fechar, o sufixo do mes e o que as distingue. */
    id: `demand:${lobby.id}:${program.id}:${month}`,
    kind: "demand",
    month,
    due: month + ANSWER_TIME,
    subject: program.label,
    bill: null,
    except: [],
    saved: null,
    from: lobby.id,
    lever: program.id,
    level,
    was: null,
    now: null,
    weight: null,
    answer: null,
    closedAt: null,
  };
}

/**
 * UM AVISO — o que aconteceu, e nao ha o que responder.
 *
 * @param {object} input
 * @param {"tabled" | "forgotten" | "passed" | "rejected"} input.kind
 * @param {string} input.id - o id do texto de que ele fala
 * @param {string} input.subject
 * @param {number} input.month
 * @returns {Letter}
 */
export function notice({ kind, id, subject, month }) {
  return {
    id: `${kind}:${id}:${month}`,
    kind,
    month,
    due: null,
    subject,
    bill: id,
    except: [],
    saved: null,
    from: null,
    lever: null,
    level: null,
    was: null,
    now: null,
    weight: null,
    /* O AVISO JA CHEGA FECHADO: nao ha o que responder, e por isso ele envelhece a
       partir do mes em que chegou. */
    answer: null,
    closedAt: month,
  };
}

/**
 * O ALARME — o cerco falando, e ele nao fala de texto nenhum.
 *
 * ⚠ ELE NASCEU DE UMA MEDICAO, e ela e o achado mais desconfortavel desta sessao:
 * num governo passivo chegam ZERO cartas em 44 meses. O processo de impeachment
 * abre no mes 43 e ninguem escreve — o pais desmorona em silencio, com a aprovacao
 * em 13%, dois grupos fora do governo e a Camara reunida para afastar o presidente.
 * A unica noticia disso era uma barra num cartao da coluna da direita.
 *
 *   passivo        media 0,0 cartas por mes   ← e o processo abre no meio disso
 *   paga a base    media 0,3
 *   corta tudo     media 3,5
 *
 * A caixa nao estava quebrada: ela responde ao que o jogador FAZ, e quem nao
 * legisla nao recebe correspondencia de tramitacao. O que faltava era o mundo
 * escrever quando o mundo se mexe sozinho.
 *
 * ⚠ E ELE E AVISO, E NAO PERGUNTA — `due` nulo. A resposta ao cerco nao se da na
 * carta: ela se da no Congresso, comprando a cadeira que agora custa o triplo. Um
 * par de botoes aqui seria uma SEGUNDA porta para a mesma jogada, e o jogador
 * escolheria sem ver o preco que so a outra tela mostra.
 *
 * ⚠ E O ID NAO CARREGA O MES. Ele e `alarme:social` e nao `alarme:social:12`,
 * porque a ruptura que reabre depois de fechar nao e uma noticia nova — e a mesma
 * ferida. Sem isso, uma pressao oscilando em volta do limiar escreveria uma carta
 * por mes, e o inbox viraria o mural que este arquivo inteiro veio consertar.
 *
 * ⚠ E ELE GANHOU TRES ESPECIES NOVAS EM 21/08/2026 — `ceiling`, `minority` e `boiling`
 * —, e a razao e a mesma medicao de sempre, refeita: mesmo DEPOIS de o mercado ganhar
 * verbo, a bandeja fecha com **1,2 cartas por mes** num governo passivo, e **20 de 24
 * meses tem uma carta ou nenhuma**. O responsavel viu antes de eu medir: "estou avancando
 * os meses e nada esta sendo empilhado".
 *
 * ⚠ E AS TRES SAO TRAVESSIA, e nao noticia inventada. O motor ja decide as tres todo mes
 * — o teto que fecha, a base que perde a maioria, o grupo que passa do ponto de fervura —
 * e nenhuma delas tinha como chegar ao jogador que nao estivesse olhando o cartao certo.
 * Nada aqui e vocabulario gerado: e o mundo entregando o que ele ja fez.
 *
 * @param {object} input
 * @param {"rupture" | "siege" | "ceiling" | "minority" | "boiling"} input.kind
 * @param {string} input.id - qual ruptura, qual grupo, ou o cerco
 * @param {string} input.subject
 * @param {number} input.month
 * @param {string | null} [input.from] o id de quem assina, quando ha alguem
 * @returns {Letter}
 */
export function alarm({ kind, id, subject, month, from = null }) {
  return {
    id: `${kind}:${id}`,
    kind,
    month,
    due: null,
    subject,
    bill: null,
    except: [],
    saved: null,
    /* ⚠ `from` DEIXOU DE SER SEMPRE NULO em 21/08/2026, e so a fervura o usa — mas o que
       ele guarda e o FATO de quem ferveu, e nao quem assina a carta. Um lobby nao tem
       rosto neste jogo: ele nao esta no elenco, nao tem sinete e nao tem cargo. Quem
       assina continua sendo a Casa Civil, como em toda carta que o mundo escreve; o nome
       do grupo vai no ASSUNTO, que e onde ele lê como manchete: "O baixo clero passou do
       ponto". Guardar o id aqui e o que permite a view achar a pressao dele na caldeira
       sem adivinhar pelo texto. */
    from,
    lever: null,
    level: null,
    was: null,
    now: null,
    weight: null,
    answer: null,
    /* JA CHEGA FECHADO, como todo aviso: nao ha o que responder aqui. */
    closedAt: month,
  };
}

/**
 * O RELATORIO DE UM DOMINIO — o mundo dizendo, todo mes, o que se mexeu nele.
 *
 * ⚠ ELE E A TERCEIRA NATUREZA DE CARTA, e a primeira que chega SEM nada ter cruzado um
 * limiar. As duas anteriores respondiam a eventos: alguem pautou, alguem emendou, uma
 * ferida abriu. Esta responde ao TEMPO — e e por isso que ela e a unica capaz de encher
 * uma bandeja, porque evento e raro e mes e todo mes.
 *
 * ⚠ E ELA REVERTE UMA REGRA REGISTRADA DUAS VEZES NESTE PROJETO, por decisao do
 * responsavel. A regra era: "uma linha que so diz que nada aconteceu ensina o olho a pular
 * a linha inteira", e ela matou duas legendas com razao. O que ele apontou e que ela vale
 * para linhas INDIFERENCIADAS — e ele esta certo: numa bandeja em que o peso esta na cor, o
 * olho varre por intensidade e nao por leitura, que e exatamente como o inbox do Football
 * Manager funciona. As palavras dele: "e so fazer um jogo de cores, o olho vai focar no que
 * importa".
 *
 * ⚠ E O RELATORIO SO NASCE SE HOUVE MOVIMENTO. "Nada aconteceu" continua nao virando
 * carta — o que mudou e o que conta como acontecer: antes era cruzar um limiar, agora e se
 * mover de forma material. Quem decide o que e material sao os limiares medidos em
 * `turn.mjs`, e nao esta funcao.
 *
 * @param {object} input
 * @param {"street" | "seats" | "vault"} input.kind qual dominio escreve
 * @param {number} input.month
 * @param {number} input.was o valor com que o mes comecou
 * @param {number} input.now o valor com que ele fechou
 * @param {boolean} input.heavy se o movimento foi grande o bastante para gritar
 * @param {Record<string, number>} [input.attach] o anexo — dado ja pesado pelo motor
 * @returns {Letter}
 */
export function report({ kind, month, was, now, heavy, attach }) {
  return {
    /* O ID CARREGA O MES, ao contrario do alarme: o relatorio de marco e o de abril sao
       duas noticias, e nao a mesma ferida reaberta. */
    id: `${kind}:${month}`,
    kind,
    month,
    due: null,
    subject: null,
    bill: null,
    except: [],
    saved: null,
    from: null,
    lever: null,
    level: null,
    was,
    now,
    weight: heavy ? "high" : null,
    attach: attach ?? null,
    answer: null,
    /* JA CHEGA FECHADO: nao ha o que responder a um relatorio. */
    closedAt: month,
  };
}

/**
 * A PERGUNTA ABERTA SOBRE UM TEXTO, se houver.
 *
 * ⚠ E A BUSCA E POR TEXTO, E NAO POR CARTA: quem pergunta "posso avancar?" e a
 * tramitacao, e ela raciocina em texto. Uma carta respondida ou vencida deixa de
 * segurar, e por isso `answer` nulo faz parte da pergunta.
 *
 * @param {ReadonlyArray<Letter>} mail
 * @param {string} bill
 * @returns {Letter | undefined}
 */
export function pending(mail, bill) {
  return mail.find(letter => letter.bill === bill && letter.due !== null && letter.answer === null);
}

/**
 * O MES FECHA A CORRESPONDENCIA — responde o que foi respondido, vence o que
 * venceu, e guarda o resto.
 *
 * ⚠ A ORDEM DE PRECEDENCIA E: RESPOSTA ANTES DE VENCIMENTO, e ela importa no mes
 * exato em que o prazo fecha. O jogador que responde no ultimo mes respondeu — e o
 * contrario faria o relogio ganhar de uma decisao tomada a tempo, que e o defeito
 * que faz um jogador desconfiar da interface para sempre.
 *
 * ⚠ E O QUE VENCE NAO SOME. A carta vencida fica, com `answer` valendo "silence",
 * porque ela e o registro de uma decisao que o jogador tomou por omissao — e um
 * inbox que apaga o que voce deixou vencer esconde justamente a informacao de que
 * voce vem deixando vencer.
 *
 * @param {object} input
 * @param {ReadonlyArray<Letter>} input.mail - a caixa como ela esta
 * @param {Record<string, string>} input.orders - o que o jogador respondeu
 * @param {number} input.month - o mes que esta fechando
 * @returns {{ mail: Letter[], resolved: Letter[] }}
 */
export function settle({ mail, orders, month }) {
  /** @type {Letter[]} */
  const next = [];
  /** @type {Letter[]} */
  const resolved = [];

  for (const letter of mail) {
    if (letter.due === null || letter.answer !== null) {
      /* ⚠ O QUE JA ESTA FECHADO ENVELHECE E SAI — ver `KEEP`, e ele envelhece pelo
         FIM e nao pelo comeco (ver `closedAt` em `state.mjs`). A pergunta ABERTA
         nunca cai por aqui: a condicao so alcanca quem nao tem prazo ou ja tem
         resposta. */
      if (month - (letter.closedAt ?? letter.month) <= KEEP) next.push(letter);
      continue;
    }

    const answered = orders[letter.id];
    if (answered === "accept" || answered === "block") {
      const closed = /** @type {Letter} */ ({ ...letter, answer: answered, closedAt: month });
      next.push(closed);
      resolved.push(closed);
      continue;
    }

    if (month >= letter.due) {
      /* O SILENCIO ACEITA — ver a prosa do topo. */
      const closed = /** @type {Letter} */ ({ ...letter, answer: "silence", closedAt: month });
      next.push(closed);
      resolved.push(closed);
      continue;
    }

    next.push(letter);
  }

  /* ⚠ O TETO DO ESTADO CORTA PELO COMECO, e nunca uma pergunta: `next` chega em ordem de
     chegada, e o que sai e o papel mais velho JA FECHADO. Cortar sem separar apagaria uma
     pergunta com prazo correndo no mes em que a bandeja enchesse — e a tela cobraria o
     preco de um silencio que o jogador nunca teve chance de quebrar. */
  const asking = next.filter(letter => letter.due !== null && letter.answer === null);
  const closed = next.filter(letter => !asking.includes(letter));
  const kept = closed.slice(-Math.max(0, CARRY - asking.length));

  return {
    mail: next.filter(letter => asking.includes(letter) || kept.includes(letter)),
    resolved,
  };
}

/**
 * QUANTOS MESES FALTAM — e `null` quando nao ha prazo nenhum.
 *
 * ⚠ ELA E A UNICA FONTE DA GRAVIDADE NA TELA. A tarja lateral mede TEMPO, e nao
 * importancia: um assunto grave com prazo largo nao e urgente, e e essa distincao
 * que o jogador precisa para escolher o que responder primeiro. Recalcular isso na
 * view seria a conta do motor refeita por fora, que e o defeito recorrente numero
 * um deste projeto.
 *
 * @param {Letter} letter
 * @param {number} month
 * @returns {number | null}
 */
export function left(letter, month) {
  if (letter.due === null || letter.answer !== null) return null;
  return letter.due - month;
}

/**
 * O QUE ESTE FECHAMENTO DECIDE PELO SILENCIO — e ele e o PRECO de avancar o mes.
 *
 * ── POR QUE ELE EXISTE, e a razao e uma recusa ──────────────────────────────
 * Um dossie externo pediu que o botao de avancar o mes **travasse** enquanto
 * houvesse pergunta urgente sem resposta. Isso e um muro, e a regra de fundacao
 * deste projeto e a oposta: tudo tem preco, nada tem muro. Nunca `if (proibido)
 * return` — a pergunta certa e QUANTO CUSTA, e nao se pode.
 *
 * ⚠ E O PROPRIO DOSSIE ESCREVE A VERSAO CERTA na frase seguinte a do muro: "o tempo
 * cobra seu preco". O preco ja existia e ja estava modelado desde o ciclo 9 — prazo
 * vencido fecha em silencio, e o silencio ACEITA a emenda do relator e RECUSA a
 * exigencia do lobby. O que faltava nao era mecanica: era a barra de cima DIZER isso
 * antes do clique, porque informacao que chega depois da decisao e recibo.
 *
 * ── POR QUE ELA NAO CONTA NADA POR FORA ─────────────────────────────────────
 * ⚠ A TENTACAO ERA ESCREVER `left(letter) <= 0` NA TELA, e ela e exatamente a
 * familia de defeito mais cara deste projeto, com sete ocorrencias medidas: a view
 * refaz a conta do motor, as duas concordam hoje e divergem no dia da primeira
 * mudanca. Prorrogacao de prazo, feriado legislativo, uma carta que vence no fim do
 * ano — qualquer uma delas e o botao passa a prometer um preco que o mes nao cobra.
 *
 * Ela nao tem regra propria: ela **e** `settle`, filtrada. Quem decide o que o
 * silencio alcanca continua sendo um lugar so, e no dia em que essa regra mudar o
 * botao muda junto sem ninguem se lembrar dele.
 *
 * ⚠ E ELA LE AS ORDENS DO MES, e nao so o estado: o jogador que ja marcou "aceitar"
 * numa pergunta ja decidiu, e cobrar o preco dela na barra de cima seria a tela
 * anunciando uma consequencia que o turno nao vai executar.
 *
 * @param {object} input
 * @param {ReadonlyArray<Letter>} input.mail
 * @param {Record<string, string>} input.orders o que o jogador marcou neste mes
 * @param {number} input.month
 * @returns {Letter[]} as cartas que este mes fecha sem resposta
 */
export function silences({ mail, orders, month }) {
  return settle({ mail, orders, month }).resolved.filter(letter => letter.answer === "silence");
}
