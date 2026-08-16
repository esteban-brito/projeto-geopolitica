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
   papel de verdade fica — e some quando deixa de ser novidade. */
export const KEEP = 1;

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
    /* O AVISO JA CHEGA FECHADO: nao ha o que responder, e por isso ele envelhece a
       partir do mes em que chegou. */
    answer: null,
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

  return { mail: next, resolved };
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
