/* SONDA — opiniao publica por segmento.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   indicadores DIVULGADOS (com defasagem), eventos, historico
   devolve  aprovacao por segmento na escala otimo-bom / regular / ruim-pessimo

   DUAS DECISOES DE MODELO QUE JA ESTAO FECHADAS:

     · a escala nao e um numero de 0 a 100. Ela replica a forma de uma pesquisa
       real, porque e assim que a informacao chega ao presidente e e isso que
       torna a leitura interessante: media estavel escondendo polarizacao;
     · o motor le o indicador DIVULGADO, nunca o real do mes corrente. Um
       presidente tambem nao sabe o PIB do mes em que esta. A defasagem e
       mecanica, nao limitacao. */

export {};
