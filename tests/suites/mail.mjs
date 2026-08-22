/* A CORRESPONDENCIA — o que esta suite cobra e que a carta SEJA uma decisao.
   Nao e "as cartas aparecem": e que o prazo, o silencio e as duas saidas produzam
   consequencia diferente uma da outra. */

import assert from "node:assert/strict";
import test from "node:test";
import fc from "fast-check";
import {
  ANSWER_TIME,
  KEEP,
  amendment,
  left,
  notice,
  pending,
  settle,
  silences,
} from "../../src/application/mail.mjs";

/** @typedef {import("../../src/state/state.mjs").Letter} Letter */

const anyMonth = fc.integer({ min: 0, max: 47 });

/** @param {number} month */
function question(month) {
  return amendment({
    bill: /** @type {any} */ ({ id: "texto-1", label: "Reforma" }),
    month,
    except: ["aposentadoria-urbana"],
    saved: "Aposentadoria urbana",
  });
}

test("O SILENCIO ACEITA — e a carta vencida NAO some", () => {
  /* ⚠ AS DUAS METADES SAO A MESMA DECISAO. */
  fc.assert(
    fc.property(anyMonth, month => {
      const letter = question(month);
      const closed = settle({ mail: [letter], orders: {}, month: month + ANSWER_TIME });

      assert.equal(closed.resolved.length, 1, "o prazo venceu e nada foi resolvido");
      assert.equal(closed.mail[0]?.answer, "silence", "o silencio nao virou resposta");
      assert.equal(closed.mail.length, 1, "a carta vencida sumiu da bandeja");
    }),
    { numRuns: 200 },
  );
});

test("A RESPOSTA GANHA DO RELOGIO no mes exato do vencimento", () => {
  /* ⚠ ESTE E O UNICO MES EM QUE A ORDEM IMPORTA, e errar nele e o tipo de defeito que faz um
     jogador desconfiar da interface para sempre: ele respondeu, viu a carta marcada, avancou
     o mes e o jogo tratou como se ele nao tivesse respondido. */
  fc.assert(
    fc.property(anyMonth, fc.constantFrom("accept", "block"), (month, answer) => {
      const letter = question(month);
      const closed = settle({
        mail: [letter],
        orders: { [letter.id]: answer },
        month: month + ANSWER_TIME,
      });

      assert.equal(closed.mail[0]?.answer, answer, "o relogio ganhou de quem respondeu a tempo");
    }),
    { numRuns: 200 },
  );
});

test("A PERGUNTA ABERTA NUNCA ENVELHECE; a fechada sai depois de KEEP meses", () => {
  /* A assimetria e a mecanica: o que espera VOCE nao pode sumir por decurso de prazo da
     bandeja — so por decurso do prazo DELA, que e outra coisa. */
  fc.assert(
    fc.property(anyMonth, fc.integer({ min: 0, max: 40 }), (month, wait) => {
      const open = question(month);
      /* Fica aberta enquanto o prazo dela nao chega, por mais que a bandeja ande. */
      const later = Math.min(month + Math.min(wait, ANSWER_TIME - 1), 47);
      const kept = settle({ mail: [open], orders: {}, month: later });
      assert.equal(kept.mail.length, 1, "a pergunta aberta caiu da bandeja");
      assert.equal(kept.mail[0]?.answer, null, "a pergunta aberta foi resolvida cedo demais");

      const aviso = notice({ kind: "tabled", id: "texto-1", subject: "Reforma", month });
      const old = settle({ mail: [aviso], orders: {}, month: month + KEEP + 1 });
      assert.equal(old.mail.length, 0, "o aviso velho ficou na bandeja para sempre");
    }),
    { numRuns: 200 },
  );
});

test("A PERGUNTA RESPONDIDA DEIXA DE SEGURAR O TEXTO — e este era o defeito", () => {
  /* ⚠ A PROVA QUE FALTAVA, e o defeito que ela acusa nao derruba nada: ele TRAVA. */
  fc.assert(
    fc.property(anyMonth, fc.constantFrom("accept", "block"), (month, answer) => {
      const letter = question(month);

      assert.ok(pending([letter], "texto-1"), "a pergunta aberta nao segurou o texto");

      const closed = settle({ mail: [letter], orders: { [letter.id]: answer }, month });
      assert.equal(
        pending(closed.mail, "texto-1"),
        undefined,
        "a pergunta respondida continuou segurando o texto",
      );
    }),
    { numRuns: 200 },
  );
});

test("O AVISO NAO TEM PRAZO, e a pergunta tem — e a tarja le isso", () => {
  /* ⚠ E O QUE `left` DEVOLVE E A UNICA FONTE DA GRAVIDADE NA TELA. */
  fc.assert(
    fc.property(anyMonth, month => {
      const aviso = notice({ kind: "forgotten", id: "texto-1", subject: "Reforma", month });
      assert.equal(aviso.due, null, "o aviso nasceu com prazo");
      assert.equal(left(aviso, month), null, "o aviso ganhou contagem regressiva");

      const pergunta = question(month);
      assert.equal(left(pergunta, month), ANSWER_TIME, "a pergunta nasceu sem prazo legivel");

      /* Respondida, ela para de contar: o relogio de uma decisao ja tomada nao e informacao,
         e uma tarja que continuasse acesa mandaria o jogador responder de novo. */
      const closed = settle({ mail: [pergunta], orders: { [pergunta.id]: "accept" }, month });
      assert.equal(left(/** @type {Letter} */ (closed.mail[0]), month), null);
    }),
    { numRuns: 200 },
  );
});

test("O PRECO DE AVANCAR E O QUE O MES DECIDE SOZINHO — e nunca o que ja foi decidido", () => {
  /* ⚠ ESTA PROVA EXISTE POR UMA RECUSA, e a recusa e doutrinaria. */
  fc.assert(
    fc.property(anyMonth, month => {
      const pergunta = question(month);

      /* ABERTA E LONGE DO PRAZO: o mes nao decide nada, e o botao nao cobra nada. */
      assert.equal(
        silences({ mail: [pergunta], orders: {}, month }).length,
        0,
        "o botao cobrou preco de uma pergunta que ainda tem prazo",
      );

      /* NO MES DO VENCIMENTO, SEM RESPOSTA: e ai que o clique decide por ele. */
      const vencendo = month + ANSWER_TIME;
      const quiet = silences({ mail: [pergunta], orders: {}, month: vencendo });
      assert.equal(quiet.length, 1, "o mes ia fechar uma pergunta e o botao nao disse");
      assert.equal(quiet[0]?.answer, "silence", "o que fechou nao fechou por silencio");

      /* ⚠ RESPONDIDA, O PRECO SOME NO MESMO INSTANTE. */
      for (const answer of ["accept", "block"]) {
        assert.equal(
          silences({ mail: [pergunta], orders: { [pergunta.id]: answer }, month: vencendo }).length,
          0,
          `o botao cobrou preco de uma pergunta ja respondida com ${answer}`,
        );
      }

      /* O AVISO NUNCA ENTRA NA CONTA: ele nao tem prazo, e nao ha o que o silencio decida
         nele. */
      const aviso = notice({ kind: "forgotten", id: "texto-9", subject: "Reforma", month });
      assert.equal(
        silences({ mail: [aviso], orders: {}, month: month + ANSWER_TIME + KEEP + 1 }).length,
        0,
        "o aviso entrou no preco de avancar",
      );
    }),
    { numRuns: 200 },
  );
});
