/* ECLUSA — o Congresso: deixa passar, ao preco da negociacao.
   ══════════════════════════════════════════════════════════════════════════════
   recebe   bancadas, proposta, moeda oferecida (cargos, emendas), historico de
            barganha, fluxo de aleatoriedade proprio
   devolve  votos por bancada, resultado, custo pago, ressentimento acumulado

   INVARIANTE: nenhum modulo desta camada pode ler NOME de partido. O
   comportamento sai de atributos — ideologia, fisiologismo, bancadas tematicas —
   e a guarda prova isso por dois lados: varre o codigo atras de nome proprio e
   exige que trocar todas as siglas nao mova nenhum resultado.
   Sem isso, o dia em que o jogador renomear os partidos o motor muda de
   comportamento. */

export {};
