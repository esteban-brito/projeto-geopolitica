# Custo da Transição Líquida (1920×937, 5× G2E e 5× E2G por braço)
Métrica (10 transições)           | Voo com Desfoque (antigo) | Voo sem Desfoque (filtro off) | macOS 360ms (commit 961112e)
----------------------------------|---------------------------|-------------------------------|-----------------------------
Quadros perdidos totais (gaps>20) | 4 quadros (0,4 / trans)   | 4 quadros (0,4 / trans)       | 7 quadros (0,7 / trans)
Pior quadro — G2E (Gabinete→Email)| 150,7 ms (setup inicial)  | 30,3 ms                       | 152,9 ms (setup inicial)
Pior quadro — E2G (Email→Gabinete)| 23,3 ms                   | 29,4 ms                       | 23,8 ms
Pior quadro geral                 | 150,7 ms                  | 30,3 ms                       | 152,9 ms
Percentil 95 (p95 do quadro)      | 17,2 ms                   | 17,3 ms                       | 17,4 ms
Mediana do intervalo de quadro    | 2,7 ms                    | 0,9 ms                        | 5,8 ms
Tempo total de GPU ativa         | 1193,9 ms                 | 789,4 ms                      | 782,5 ms
Tempo de GPU por transição       | 119,4 ms / transição      | 78,9 ms / transição           | 78,3 ms / transição (−34,4%)
Veredito do custo               | Base voo c/ blur 10/12px  | −40,5 ms GPU; sem blur        | 78,3 ms GPU (tão leve quanto sem blur; blur 8px)
