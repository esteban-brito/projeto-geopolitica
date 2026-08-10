/* TEMPORAL — o choque que chega de fora.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   estado do turno, catalogo de eventos, fluxo de aleatoriedade proprio
   devolve  evento disparado, com efeitos declarados e duracao

   ALEATORIEDADE ENTRA POR PARAMETRO, sempre, e o fluxo e proprio deste motor.
   Duas razoes: uma chamada a mais em qualquer ponto desloca toda a sequencia
   seguinte, e fluxos separados por motor impedem que mexer num deles mova o
   outro. Este e um dos dois unicos motores autorizados a sortear — o outro e
   ECLUSA, porque escolher sob incerteza e a decisao em si. */

export {};
