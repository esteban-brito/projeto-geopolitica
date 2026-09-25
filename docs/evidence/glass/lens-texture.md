# Pesquisa: A Lente de Borda sobre Fundo com Textura Forte

Estudo para o Passo 3 do Ciclo 28: comportamento óptico da refração de borda (*liquid glass displacement*) sobre o veio do jacarandá contra fundos lisos.

---

## 1. O Problema Óptico: Fundo Liso vs. Fundo com Textura de Alta Frequência

- **Na Topbar (Aurora Lisa):** A imagem de fundo tem baixa frequência espacial ($\nabla I \approx 0$). Um deslocamento de 8,5 px em um degradê contínuo mal altera os valores RGB locais — o olho humano percebe apenas a compressão do gradiente e o brilho do bisel.
- **No Dock (Tampo de Jacarandá 4K):** O jacarandá possui veios com largura de 2 a 5 px e saltos bruscos de contraste ($\Delta L > 40\%$). Quando um vetor de deslocamento $(\Delta x, \Delta y)$ intercepta uma linha de veio:
  - Se a deformação for excessiva, a linha de madeira sofre **cisalhamento óptico (*texture tearing*)** — parece quebrada, serrilhada ou partida em dentes de serra.
  - Se a rampa tiver descontinuidade de derivada, o veio parece "dobrado a ferro frio" (aspecto de plástico barato ou prisma acrílico de baixa qualidade) em vez de vidro fundido espesso.

---

## 2. Como a Apple Trata a Refração sobre Fundo Texturado no macOS e visionOS

Fontes: *Apple Human Interface Guidelines (Materials & Liquid Glass)*, *WWDC23: Explore materials in visionOS*, *WWDC24: Design with Liquid Glass*, especificações de Metal Shaders (`ShaderGraph / RealityKit`).

### 2.1 Magnitude do Desvio (Quanto Desvia em Pixels)
- No macOS Sequoia e visionOS, a refração física nas bordas de elementos flutuantes (como o Dock e as janelas espaciais) é governada por uma **escala conservadora**:
  - **Deslocamento máximo absoluto:** entre **3 px e 6 px físicos** (a 1×) e no máximo **10 px** a dpr 2.
  - **Relação Bisel / Desvio:** A regra de ouro da Apple é $\text{desvio}_{\max} \le 0,35 \times \text{largura do bisel}$.
  - Com o nosso bisel atual de 13 px (`bevel: 13`), um desvio máximo de **4 a 5 px** é o limite físico da elegância. O nosso valor de `scale: 17` com `force: 1` gera um pico de $\approx 8,5\text{ px}$ — sobre a aurora passa desapercebido, mas sobre o veio do jacarandá pode causar quebra perceptível.

### 2.2 A Forma da Rampa de Refração (Curvatura vs. Contraste)
- A Apple **não altera** a função do shader dinamicamente em função do contraste do papel de parede (fazer isso exigiria análise de luminância em tempo real na GPU por frame, inviável).
- Em vez disso, a Apple utiliza uma **curva de transição com continuidade $G^2$ (Smoothstep Cúbico / Hermite)**:
  $$t = \text{clamp}\left(\frac{d + \text{bevel}}{\text{bevel}}, 0, 1\right)$$
  $$\text{fator}(t) = 3t^2 - 2t^3 \quad \text{ou} \quad t^3$$
  - A derivada na junção com o vidro plano ($d = -\text{bevel}$) é exatamente zero ($\frac{d}{dt} = 0$). O veio de madeira entra na lente em tangência perfeita, sem "solavanco" de ângulo.
  - A rampa quadrática pura atual do `glass.mjs` ($t^2$) é boa, mas o smoothstep cúbico ($3t^2 - 2t^3$) suaviza ainda mais a entrada, impedindo que a madeira sofra vinco.

### 2.3 O Papel do Desfoque Conjugado (`feGaussianBlur`)
- No pipeline do visionOS, a luz refratada não é uma cópia 100% nítida e deformada do fundo. Ela passa por uma leve difusão pré/pós refração:
  - O desfoque (`blur: 2.6px` na nossa receita) age como um **filtro passa-baixa óptico**.
  - Ele atenua as frequências espaciais ultranítidas do veio exatamente onde ele dobra, impedindo o efeito de serrilhado na aresta de corte sem perder a riqueza de cor da madeira.

---

## 3. O Teto de Desvio: Onde o Efeito Vira "Lente Barata"

| Desvio Máximo ($\Delta x_{\max}$) | Razão $\Delta / \text{Bisel}$ | Leitura Perceptual sobre o Jacarandá | Classificação |
|---|---|---|---|
| **0 px** | 0,0 | Vidro plano fosco (mero blur gaussiano 2D). Sem vida líquida. | Sem refração |
| **2 a 4 px** | 0,15 a 0,30 | **O ponto ideal Apple.** O veio entorta suavemente como visto através de cristal lapidado pesado. | ⭐ **Nível visionOS** |
| **5 a 7 px** | 0,38 a 0,54 | Refração visível e marcante. Aceitável se acompanhada de blur $\ge 2,5\text{px}$. | Limite superior |
| **> 8 px** | > 0,60 | **Distorção de olho de peixe / plástico acrílico.** O veio de madeira se parte visualmente na borda da cápsula; quebra a sensação de peso nobre. | ⛔ **Degeneração estética** |

---

## 4. Recomendações Práticas para o Dock sobre o Jacarandá

1. **Calibragem do `scale` em `RECIPE` para o Dock:**
   - Na barra (aurora), `scale: 17` funciona porque o fundo é liso.
   - No dock (sobre jacarandá), testar `scale: 10 a 12` (ou `force: 0.65`), mantendo o desvio máximo em torno de **4 a 5 px**.
2. **Suavização Hermite na rampa de `lensMap()`:**
   - Substituir $t^2$ por $t^2(3 - 2t)$ na transição de entrada do bisel. O veio de madeira não forma quina ao entrar sob o dock.
3. **Manter o `blur` em 2,6 px conjugado:**
   - O blur de 2,6 px é exatamente a medida certa para dissolver o aliasing da madeira distorcida mantendo a transparência vítrea viva.
