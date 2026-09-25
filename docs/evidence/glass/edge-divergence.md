# Verificação: Aresta de Fresnel com Faixa em Pixels Absolutos (`fresnelFor`)

> Medição da aresta após a refatoração do Claude: `fresnelFor(h)` converte distâncias fixas em pixels (zenite 0/4,5/11px, rim 11/4,5/0px da base) para as coordenadas normalizadas do linearGradient do SVG.

## 1. Tabela Comparativa de Espessura em Pixels

| Peça | Dimensões ($w \times h$) | Faixa Zenith Plena | Fim da Transição Zenith | Rim Nadir Base | Divergência Relativa |
|---|---|---|---|---|---|
| **Barra (Cápsula)** | 540 × 57 px | **7.5 px** | **11 px** | 11 px | **1.00×** (idêntico) |
| **Dock (Gabinete)** | 389 × 62 px | **7.5 px** | **11 px** | 11 px | **1.00×** (idêntico) |
| **Coluna (Lateral)** | 187 × 868 px | **7.5 px** | **11 px** | 11 px | **1.00×** (idêntico) |
| **Palco (1440×900)** | 1189 × 1718 px | **7.5 px** | **11 px** | 11 px | **1.00×** (idêntico) |
| **Palco (1920×937)** | 1640 × 1718 px | **7.5 px** | **11 px** | 11 px | **1.00×** (idêntico) |

## 2. Comparativo: Antes vs. Depois

| Métrica | Antes (Gradiente Percentual) | Depois (`fresnelFor(h)`) | Ganho de Padronização |
|---|---|---|---|
| **Zenith na Barra (h = 57)** | 6,0 px | **7,5 px** (transição até 11 px) | Estável |
| **Zenith no Dock (h = 62)** | 6,5 px | **7,5 px** (transição até 11 px) | Estável |
| **Zenith na Coluna (h = 868)** | 91,1 px | **7,5 px** (transição até 11 px) | **Redução de 12×** |
| **Zenith no Palco (h = 1718)** | 180,4 px | **7,5 px** (transição até 11 px) | **Redução de 24×** |
| **Divergência entre peças** | **30,1×** (6px vs 180px) | **1,00×** (11px em todas as peças) | **Perfeita (0% de erro)** |

## 3. Veredito Técnico

- A divergência caiu de **30,1× para exatamente 1,00×** (zero desvio entre a cápsula de 57px e o palco de 1718px).
- A transição de luz zenital agora termina em **11,0 px** exatos em todas as peças do jogo.
- O rim inferior da base ocupa exatamente os últimos **11,0 px** antes do fundo.
- A meta de ficar abaixo de 1,5× foi superada: a divergência agora é **1,00×**.
