/* A CORRESPONDÊNCIA — o único lugar do jogo que espera uma resposta.
   recebe  as cartas guardadas, o que o mês produziu, as ordens e o mês devolve as cartas do
   mês seguinte, e o que venceu no caminho Este arquivo NÃO É UM MOTOR e não tem codinome,
   pela mesma razão de `passage.mjs`: nada aqui inventa preço. */

/**
 * @typedef {import("../state/state.mjs").Letter} Letter
 * @typedef {import("./passage.mjs").Bill} Bill
 */

/* QUANTOS MESES UMA PERGUNTA FICA ABERTA. */
export const ANSWER_TIME = 2;

/* QUANTOS MESES UMA CARTA JÁ FECHADA CONTINUA NA BANDEJA. */
export const KEEP = 24;

/* Com um mês de retenção, o freio era o relógio; com vinte e quatro, a bandeja acumula de
   verdade — e um mandato de 48 meses com três relatórios por mês chegaria a 144 papéis no
   save se ninguém contasse. */
export const CARRY = 24;

/**
 * A CARTA DA EMENDA — a única pergunta que o jogo faz hoje.
 *
 * @param {object} input
 * @param {Bill} input.bill
 * @param {number} input.month
 * @param {string[]} input.except - as alavancas que a emenda retira
 * @param {string} input.saved - o rótulo do que o relator salvou
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
    answer: null,
    closedAt: null,
  };
}

/**
 * A CHANTAGEM — a segunda pergunta que o jogo faz, e a primeira que vem de FORA da
 * tramitação.
 *
 * ⚠ ELA EXISTE PORQUE QUATRO GRUPOS TINHAM PRESSÃO E NENHUMA VOZ. A CALDEIRA nasceu no
 * ciclo 10 com posição no plano, memória e um instrumento declarado em prosa —
 * @param {object} input
 * @param {{ id: string }} input.lobby
 * @param {{ id: string, label: string }} input.program
 * @param {number} input.level - o nível da posse
 * @param {number} input.month
 * @returns {Letter}
 */
export function demand({ lobby, program, level, month }) {
  return {
    /* O ID AMARRA GRUPO E ALAVANCA, e não o mês: o mesmo grupo não abre duas exigências sobre
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
    answer: null,
    closedAt: null,
  };
}

/**
 * UM AVISO — o que aconteceu, e não há o que responder.
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
    /* O AVISO JÁ CHEGA FECHADO: não há o que responder, e por isso ele envelhece a partir do
       mês em que chegou. */
    answer: null,
    closedAt: month,
  };
}

/**
 * ⚠ ELE NASCEU DE UMA MEDIÇÃO, e ela é o achado mais desconfortável desta sessão: num governo
 * passivo chegam ZERO cartas em 44 meses.
 *
 * @param {object} input
 * @param {"rupture" | "siege" | "ceiling" | "contingency" | "minority" | "boiling"} input.kind
 * @param {string} input.id - qual ruptura, qual grupo, ou o cerco
 * @param {string} input.subject
 * @param {number} input.month
 * @param {string | null} [input.from] o id de quem assina, quando há alguém
 * @param {number | null} [input.was] o limiar que ele cruzou, quando há um
 * @param {number | null} [input.now] o número que o disparou, no mês em que disparou
 * @returns {Letter}
 */
export function alarm({ kind, id, subject, month, from = null, was = null, now = null }) {
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
    /* ⚠ O NÚMERO VIAJA COM A CARTA, e antes a tela o lia do estado DE HOJE: medido, um alarme
       de fervura do mês 6 mostrava 70 e no mês 7 mostrava 75, e o de minoria ia de 229 para
       227. Carta que muda depois de chegar não é carta. */
    was,
    now,
    answer: null,
    /* JÁ CHEGA FECHADO, como todo aviso: não há o que responder aqui. */
    closedAt: month,
  };
}

/**
 * O RELATÓRIO DE UM DOMÍNIO — o mundo dizendo, todo mês, o que se mexeu nele.
 *
 * @param {object} input
 * @param {"street" | "seats" | "vault"} input.kind qual domínio escreve
 * @param {number} input.month
 * @param {number} input.was o valor com que o mês começou
 * @param {number} input.now o valor com que ele fechou
 * @param {Record<string, number>} [input.attach] o anexo — dado já pesado pelo motor
 * @returns {Letter}
 */
export function report({ kind, month, was, now, attach }) {
  return {
    /* O ID CARREGA O MÊS, ao contrário do alarme: o relatório de março e o de abril são duas
       notícias, e não a mesma ferida reaberta. */
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
    attach: attach ?? null,
    answer: null,
    /* JÁ CHEGA FECHADO: não há o que responder a um relatório. */
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
 * O jogador que responde no último mês respondeu — e o contrário faria o relógio ganhar de
 * uma decisão tomada a tempo, que é o defeito que faz um jogador desconfiar da interface para
 * sempre.
 *
 * @param {object} input
 * @param {ReadonlyArray<Letter>} input.mail - a caixa como ela está
 * @param {Record<string, string>} input.orders - o que o jogador respondeu
 * @param {number} input.month - o mês que está fechando
 * @returns {{ mail: Letter[], resolved: Letter[] }}
 */
export function settle({ mail, orders, month }) {
  /** @type {Letter[]} */
  const next = [];
  /** @type {Letter[]} */
  const resolved = [];

  for (const letter of mail) {
    if (letter.due === null || letter.answer !== null) {
      /* ⚠ O QUE JÁ ESTÁ FECHADO ENVELHECE E SAI — ver `KEEP`, e ele envelhece pelo FIM e não
         pelo começo (ver `closedAt` em `state.mjs`). */
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
      /* O SILÊNCIO ACEITA — ver a prosa do topo. */
      const closed = /** @type {Letter} */ ({ ...letter, answer: "silence", closedAt: month });
      next.push(closed);
      resolved.push(closed);
      continue;
    }

    next.push(letter);
  }

  /* Cortar sem separar apagaria uma pergunta com prazo correndo no mês em que a bandeja
     enchesse — e a tela cobraria o preço de um silêncio que o jogador nunca teve chance de
     quebrar. */
  const asking = next.filter(letter => letter.due !== null && letter.answer === null);
  const closed = next.filter(letter => !asking.includes(letter));
  /* ⚠ CORTA PELO FIM, E NÃO PELO COMEÇO, e a direção é o defeito inteiro: o turno monta a
     caixa com as NOVAS na frente, então um `slice` negativo guardava o bloco congelado de
     vinte meses atrás e apagava o que tinha acabado de chegar. Medido em 48 meses: 101 cartas
     destruídas com 1 a 3 meses de idade, e a caixa do mês 30 com um buraco de doze meses.
     ⚠ E ELE CONSERTA UM SEGUNDO DEFEITO DE GRAÇA: `slice(-0)` devolve o array INTEIRO, então
     com a bandeja cheia de perguntas o teto sumia em vez de fechar. `slice(0, 0)` devolve o
     que a aritmética pede. */
  const kept = closed.slice(0, Math.max(0, CARRY - asking.length));

  return {
    mail: next.filter(letter => asking.includes(letter) || kept.includes(letter)),
    resolved,
  };
}

/**
 * Recalcular isso na view seria a conta do motor refeita por fora, que é o defeito recorrente
 * número um deste projeto.
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
 * ── POR QUE ELA NÃO CONTA NADA POR FORA ───────────────────────────────────── ⚠ A TENTAÇÃO
 * ERA ESCREVER `left(letter) <= 0` NA TELA, e ela é exatamente a família de defeito mais cara
 * deste projeto, com sete ocorrências medidas: a view refaz a conta do motor, as duas
 * concordam hoje e divergem no dia da primeira mudança.
 *
 * @param {object} input
 * @param {ReadonlyArray<Letter>} input.mail
 * @param {Record<string, string>} input.orders o que o jogador marcou neste mês
 * @param {number} input.month
 * @returns {Letter[]} as cartas que este mês fecha sem resposta
 */
export function silences({ mail, orders, month }) {
  return settle({ mail, orders, month }).resolved.filter(letter => letter.answer === "silence");
}
