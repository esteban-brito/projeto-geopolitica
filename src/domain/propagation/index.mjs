/* CASCATA — propagacao de efeitos.
   ══════════════════════════════════════════════════════════════════════════════
   O coracao do modelo: um efeito declarado vira muitos, com defasagem e
   decaimento. E o UNICO motor autorizado a aplicar delta ao estado — se outro
   escrevesse direto, o grafo passaria a mentir sobre o que causou o que.

   recebe   efeitos vigentes com sua defasagem, estado atual
   devolve  delta do mes por indicador

   Contrato declarado antes da implementacao de proposito: fixar a fronteira e
   o que impede o motor de nascer amarrado a quem o chama. */

export {};
