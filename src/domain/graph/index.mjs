/* DELTA — a rede de causa e efeito, derivada para leitura.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   catalogo de ligacoes, estado, deltas do turno
   devolve  nos e arestas com peso e sinal, prontos para render

   ELE NAO SIMULA NADA. E uma projecao do que os outros motores fizeram — se ele
   calculasse qualquer coisa por conta propria, o grafo deixaria de ser a
   explicacao do modelo e viraria um segundo modelo.

   O layout de forca roda em Web Worker e CONVERGE antes de desenhar. Isso nao e
   otimizacao: `backdrop-filter` sobre fundo em movimento obriga o compositor a
   reamostrar o que esta atras a cada quadro, e foi essa condicao que derrubou
   uma tela para 31 fps no projeto anterior. Grafo parado e o que torna o vidro
   possivel por cima dele. */

export {};
