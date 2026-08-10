/* CORRENTE — o passo macroeconomico do mes.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   estado macro, deltas de CASCATA, politica monetaria
   devolve  PIB, inflacao, juros, cambio, desemprego do mes

   CALIBRACAO — a distincao que nao pode ser confundida aqui:
     · NIVEL e estado inicial calibram contra dado real (BCB, IBGE, Tesouro), com
       a fonte citada no proprio dado;
     · RESPOSTA e elasticidade NAO tem contrafactual — nao existe serie historica
       de "o que teria acontecido se". Elas calibram contra faixa de literatura
       ou, na falta dela, contra sinal e ordem de grandeza.
   Tratar a segunda como se fosse a primeira e inventar precisao. */

export {};
