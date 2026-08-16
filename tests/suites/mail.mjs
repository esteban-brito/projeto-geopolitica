/* A CORRESPONDENCIA — o que esta suite cobra e que a carta SEJA uma decisao.
   ══════════════════════════════════════════════════════════════════════════════
   Nao e "as cartas aparecem": e que o prazo, o silencio e as duas saidas produzam
   consequencia diferente uma da outra. Uma caixa de entrada em que responder e nao
   responder dao no mesmo e um mural com botao.

   ⚠ A PROVA MAIS IMPORTANTE DAQUI E A QUARTA, e ela existe por um defeito medido:
   `pending` consultava a caixa de ANTES do fechamento do mes, entao a carta que o
   jogador acabava de responder ainda constava como aberta e o texto esperava por ela
   PARA SEMPRE. Oito meses de mandato, nas tres saidas, e nenhum texto saiu da
   relatoria — com tudo verde. Ele nao derrubava nada: ele travava. */

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
  /* ⚠ AS DUAS METADES SAO A MESMA DECISAO. Se o vencimento nao resolvesse, o prazo
     seria um relogio decorativo; se a carta vencida sumisse, o jogador perderia
     justamente a informacao de que ele vem deixando vencer — e um inbox que apaga o
     proprio historico de omissao esconde o padrao que ele existe para revelar. */
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
  /* ⚠ ESTE E O UNICO MES EM QUE A ORDEM IMPORTA, e errar nele e o tipo de defeito
     que faz um jogador desconfiar da interface para sempre: ele respondeu, viu a
     carta marcada, avancou o mes e o jogo tratou como se ele nao tivesse respondido.
     Quem responde no ultimo mes respondeu. */
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
  /* A assimetria e a mecanica: o que espera VOCE nao pode sumir por decurso de
     prazo da bandeja — so por decurso do prazo DELA, que e outra coisa. */
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
  /* ⚠ A PROVA QUE FALTAVA, e o defeito que ela acusa nao derruba nada: ele TRAVA.
     `pending` lia a caixa de ANTES do fechamento, entao a carta recem-respondida
     ainda segurava o texto, e a tramitacao parava de existir com tudo verde.

     A classe e conhecida — ler o estado ANTES do passo que o turno acabou de dar —,
     e e a mesma familia do achado 14. */
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
  /* ⚠ E O QUE `left` DEVOLVE E A UNICA FONTE DA GRAVIDADE NA TELA. Se ela contasse
     meses para um aviso, a bandeja teria contagem regressiva em papel que nao pede
     nada — que e a ansiedade decorativa que este ciclo recusou por escrito. */
  fc.assert(
    fc.property(anyMonth, month => {
      const aviso = notice({ kind: "forgotten", id: "texto-1", subject: "Reforma", month });
      assert.equal(aviso.due, null, "o aviso nasceu com prazo");
      assert.equal(left(aviso, month), null, "o aviso ganhou contagem regressiva");

      const pergunta = question(month);
      assert.equal(left(pergunta, month), ANSWER_TIME, "a pergunta nasceu sem prazo legivel");

      /* Respondida, ela para de contar: o relogio de uma decisao ja tomada nao e
         informacao, e uma tarja que continuasse acesa mandaria o jogador responder
         de novo. */
      const closed = settle({ mail: [pergunta], orders: { [pergunta.id]: "accept" }, month });
      assert.equal(left(/** @type {Letter} */ (closed.mail[0]), month), null);
    }),
    { numRuns: 200 },
  );
});
