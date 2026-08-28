/* A CORRESPONDENCIA — o unico lugar do jogo que espera uma resposta.
   recebe  as cartas guardadas, o que o mes produziu, as ordens e o mes devolve as cartas do
   mes seguinte, e o que venceu no caminho Este arquivo NAO E UM MOTOR e nao tem codinome,
   pela mesma razao de `passage.mjs`: nada aqui inventa preco. */

/**
 * @typedef {import("../state/state.mjs").Letter} Letter
 * @typedef {import("./passage.mjs").Bill} Bill
 */

/* QUANTOS MESES UMA PERGUNTA FICA ABERTA. */
export const ANSWER_TIME = 2;

/* QUANTOS MESES UMA CARTA JA FECHADA CONTINUA NA BANDEJA. */
export const KEEP = 24;

/* Com um mes de retencao, o freio era o relogio; com vinte e quatro, a bandeja acumula de
   verdade — e um mandato de 48 meses com tres relatorios por mes chegaria a 144 papeis no
   save se ninguem contasse. */
export const CARRY = 24;

/**
 * A CARTA DA EMENDA — a unica pergunta que o jogo faz hoje.
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
 * @param {object} input
 * @param {{ id: string }} input.lobby
 * @param {{ id: string, label: string }} input.program
 * @param {number} input.level - o nivel da posse
 * @param {number} input.month
 * @returns {Letter}
 */
export function demand({ lobby, program, level, month }) {
  return {
    /* O ID AMARRA GRUPO E ALAVANCA, e nao o mes: o mesmo grupo nao abre duas exigencias sobre
       o mesmo programa. */
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
    /* O AVISO JA CHEGA FECHADO: nao ha o que responder, e por isso ele envelhece a partir do
       mes em que chegou. */
    answer: null,
    closedAt: month,
  };
}

/**
 * ⚠ ELE NASCEU DE UMA MEDICAO, e ela e o achado mais desconfortavel desta sessao: num governo
 * passivo chegam ZERO cartas em 44 meses.
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
    /* O ID CARREGA O MES, ao contrario do alarme: o relatorio de marco e o de abril sao duas
       noticias, e nao a mesma ferida reaberta. */
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
 * @param {ReadonlyArray<Letter>} mail
 * @param {string} bill
 * @returns {Letter | undefined}
 */
export function pending(mail, bill) {
  return mail.find(letter => letter.bill === bill && letter.due !== null && letter.answer === null);
}

/**
 * O jogador que responde no ultimo mes respondeu — e o contrario faria o relogio ganhar de
 * uma decisao tomada a tempo, que e o defeito que faz um jogador desconfiar da interface para
 * sempre.
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
      /* ⚠ O QUE JA ESTA FECHADO ENVELHECE E SAI — ver `KEEP`, e ele envelhece pelo FIM e nao
         pelo comeco (ver `closedAt` em `state.mjs`). */
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

  /* Cortar sem separar apagaria uma pergunta com prazo correndo no mes em que a bandeja
     enchesse — e a tela cobraria o preco de um silencio que o jogador nunca teve chance de
     quebrar. */
  const asking = next.filter(letter => letter.due !== null && letter.answer === null);
  const closed = next.filter(letter => !asking.includes(letter));
  /* ⚠ CORTA PELO FIM, E NAO PELO COMECO, e a direcao e o defeito inteiro: o turno monta a
     caixa com as NOVAS na frente, entao um `slice` negativo guardava o bloco congelado de
     vinte meses atras e apagava o que tinha acabado de chegar. Medido em 48 meses: 101 cartas
     destruidas com 1 a 3 meses de idade, e a caixa do mes 30 com um buraco de doze meses.
     ⚠ E ELE CONSERTA UM SEGUNDO DEFEITO DE GRACA: `slice(-0)` devolve o array INTEIRO, entao
     com a bandeja cheia de perguntas o teto sumia em vez de fechar. `slice(0, 0)` devolve o
     que a aritmetica pede. */
  const kept = closed.slice(0, Math.max(0, CARRY - asking.length));

  return {
    mail: next.filter(letter => asking.includes(letter) || kept.includes(letter)),
    resolved,
  };
}

/**
 * Recalcular isso na view seria a conta do motor refeita por fora, que e o defeito recorrente
 * numero um deste projeto.
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
 * ── POR QUE ELA NAO CONTA NADA POR FORA ───────────────────────────────────── ⚠ A TENTACAO
 * ERA ESCREVER `left(letter) <= 0` NA TELA, e ela e exatamente a familia de defeito mais cara
 * deste projeto, com sete ocorrencias medidas: a view refaz a conta do motor, as duas
 * concordam hoje e divergem no dia da primeira mudanca.
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
