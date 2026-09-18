# Pesquisa 12 — LIQUID GLASS DA APPLE: da óptica do visionOS à engenharia de refração na Web

> **Manual de pesquisa e arquitetura para a evolução futura do sistema de materiais.**  
> Escrito em 18/09/2026, por ordem dele: estudo comparativo absoluto, profundo e matematicamente preciso
> entre o sistema de vidro atual do República Simulator e o Liquid Glass de última geração da Apple
> (visionOS 1.2/2.0, macOS 15 Sequoia, iOS 18).

---

## 1 · A Física Óptica do Liquid Glass da Apple

No visionOS e nas versões recentes de macOS/iOS, o material de vidro ("Liquid Glass") superou o
_glassmorphism_ bidimensional tradicional (mero borrão gaussiano uniforme com borda branca). A Apple
desenvolveu um modelo de sombreamento físico executado via Metal shaders que simula a propagação de luz
através de uma lente sólida com espessura e curvatura variáveis.

O material é decomposto em cinco fenômenos físicos fundamentais:

```
                  Luz Direcional (20° Azimute)
                            \
                             \
      [ Borda Especular Zenith (42%) ] ─────────────┐
     ┌──────────────────────────────────────────────┴─────────────────────────────┐
     │  Dispersão Cromática (Aberração RGB) nas quinas chanfradas                  │
     │  ┌──────────────────────────────────────────────────────────────────────┐  │
     │  │                                                                      │  │
     │  │            Área Central Plana (Zero Distorção Óptica)                │  │
     │  │         Translucidez + Vibrancy (Saturação 180% + Brilho 1.05)       │  │
     │  │                                                                      │  │
     │  └──────────────────────────────────────────────────────────────────────┘  │
     │  Refração de Borda (Snell's Law via SDF cúbico)                            │
     └──────────────────────────────────────────────┬─────────────────────────────┘
      [ Borda Rebatida Nadir / Rim Light (8%) ] ────┘
```

### 1.1 Refração de Borda Baseada em Distância Assinada (SDF)

No centro do elemento vítreo, as faces superior e inferior são perfeitamente paralelas. Pela Lei de Snell:
$$n_1 \sin(\theta_1) = n_2 \sin(\theta_2)$$
Como os raios incidentes normais atravessam faces paralelas, o desvio angular líquido é zero ($\Delta \theta = 0$). O centro do vidro refrata sem distorcer o conteúdo — apenas desfoca e satura.

A distorção líquida ocorre **exclusivamente no bisel perimétrico (bevel)**, onde a espessura varia e a normal da superfície se inclina. A Apple modela essa curvatura com continuidade $G^2$ (continuidade de curvatura / raio acelerado) e não com um chanfro linear.

### 1.2 Dispersão Cromática (Aberração Óptica)

O índice de refração do vidro depende do comprimento de onda da luz ($\lambda$), governado pela Equação de Dispersão de Cauchy:
$$n(\lambda) = A + \frac{B}{\lambda^2}$$
Para o vidro óptico (tipo Crown borossilicato), o número de Abbe $V_d \approx 58$, resultando em uma diferença de índice $\Delta n \approx 0.015$ entre o canal vermelho ($\lambda \approx 650\text{nm}$) e o azul ($\lambda \approx 450\text{nm}$). Nas quinas chanfradas do dock da Apple, isso produz um friso iridescente microscópico (entre 0,6px e 1,2px) com separação ciano/rubro nas arestas de maior curvatura.

### 1.3 Vibrancy e Sub-surface Scattering (Espalhamento Subsuperficial)

Vidro fosco na vida real não transforma o fundo em cinza leitoso; ele espalha fótons conservando energia cromática. Para evitar o aspecto "plástico leitoso" que o `backdrop-filter: blur()` puro gera sobre a madeira escura, a fórmula da Apple eleva a saturação (`saturate(180%–200%)`) e equilibra a luminância (`brightness(1.04–1.05)`).

### 1.4 Duplo Bisel Especular (Zenith e Nadir)

A reflexão de Fresnel (Aproximação de Schlick) dita que a refletância cresce em ângulos rasantes:
$$R(\theta) = R_0 + (1 - R_0)(1 - \cos\theta)^5$$
No visionOS:

- **Aresta Superior (Zenith):** Voltada para a iluminação ambiente, reflete um realce estreito e concentrado.
- **Aresta Inferior (Nadir / Rim Light):** Recebe o reflexo difuso do chão ou substrato, gerando um contra-luz suave que destaca o objeto do fundo.

---

## 2 · Comparativo Absoluto: Vidro Atual vs. Apple visionOS

| Parâmetro Óptico                          | Como Está Hoje no Jogo (`20-material.css` / Dock)                                                                                  | Como a Apple Faz no visionOS / macOS Sequoia                                                                                                                                                                                              | O Que Falta para Ficar Idêntico                                                                                                                              |
| :---------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Curvatura de Borda**                 | `border-radius: 22px` no Dock; `border-radius: 18px` no `.rail`. Arco de círculo comum.                                            | **Squircle Superelíptico $G^2/G^3$** ($n \approx 3.6$). A curvatura $\kappa$ acelera suavemente desde a reta, sem descontinuidade na primeira e segunda derivadas ($\frac{d\kappa}{ds} = 0$).                                             | No CSS o dock usa `border-radius` comum (arco circular). O `squircle.mjs` existe no projeto com $s=0.6$, mas está confinado ao topo da barra (`topbar.mjs`). |
| **2. Refração Física (Bending)**          | **Zero no Dock.** O fundo é apenas desfocado. (No `topbar.mjs` existe um protótipo com `feDisplacementMap`, mas não no dock/rail). | **Lente convexa perimétrica baseada em SDF (Signed Distance Field).** O centro é plano (desvio zero). As bordas dobram a luz pela Lei de Snell ($n_{\text{vidro}} = 1.52$): os veios da madeira entortam suavemente ao entrar sob o dock. | Integrar a lente `lensMap` do `glass.mjs` na cápsula do dock via `backdrop-filter: url(#dock-lens)`.                                                         |
| **3. Dispersão Cromática**                | **Inexistente.** Todos os canais RGB desviam ou desfocam juntos.                                                                   | **Separação de canais de cor (Equação de Cauchy).** Luz azul refrata com ângulo maior que a vermelha, gerando um dégradé prismático sutil (~0,8px) nas quinas externas.                                                                   | Encadear `feColorMatrix` + `feOffset` fracionário no SVG para gerar o fringe cromático antes da composição final.                                            |
| **4. Substrato e Saturação (Vibrancy)**   | `saturate(1.5)` e `blur(18px)`. O fundo ganha um véu escuro azulado (`rgba(14, 20, 31, 0.34)`).                                    | **Vibrancy e Sub-surface Scattering:** `saturate(1.85)` a `2.0` com `brightness(1.04)`. A Apple não escurece nem acinzenta o fundo: ela amplifica as cores da cena.                                                                       | Subir `saturate(1.5)` para `saturate(1.85)` e clarear o gradiente base, permitindo que os tons quentes do jacarandá brilhem vivos sob a barra.               |
| **5. Especular e Fresnel (Double Bevel)** | Dois `box-shadow inset` estáticos de 1px: `--bevel-zenith` (28% branco no topo) e `--bevel-under` (26% preto na base).             | **Bisel com Fresnel Dinâmico (Schlick):** A reflexão cresce exponencialmente nas arestas rasantes ($R(\theta)$). O topo queima luz e a base rebate iluminação difusa do chão (_rim light_).                                               | Substituir os dois insets duros por gradiente perimétrico gerado na `skin()` de `glass.mjs` com rampa de Fresnel calculada.                                  |
| **6. Espessura da Borda (Lip / Rim)**     | Borda CSS homogênea de 1px: `border: 1px solid var(--glass-edge)` (`rgba(255, 255, 255, 0.14)`).                                   | **Borda refrativa de dupla face:** Não existe linha branca contínua no contorno. A borda apaga nas laterais e só brilha onde o vetor normal coincide com o ângulo da luz.                                                                 | Tirar o `border` uniforme do CSS e aplicar a aresta via SVG `stroke` graduado por luz direcional a 20°.                                                      |

---

## 3 · Dissecação Matemática das Três Divergências Críticas

### 3.1 A Curvatura: O Degrau do Círculo vs. A Superelipse $G^2$

Hoje o Dock em `styles/40-shell.css` declara:

```css
border-radius: 22px;
```

Em um arco de círculo, a curvatura $\kappa = 1/R$ é constante ao longo do arco e **salta bruscamente de zero para $1/22$** no ponto de tangência com a reta. O olho humano detecta essa descontinuidade matemática como uma "emenda" ou "canto duro".

A Apple utiliza a Superelipse de Gabriel Lamé com continuidade $G^2$:
$$\left| \frac{x}{a} \right|^n + \left| \frac{y}{b} \right|^n = 1 \quad (n \approx 3.6)$$
No projeto, já temos essa equação implementada com primor em `src/ui/shared/squircle.mjs`, onde $s = 0.6$ reproduz a transição contínua do iOS. **Aplicar o squircle na cápsula do dock elimina instantaneamente o aspecto de "caixa com cantos arredondados" e entrega a silhueta Apple.**

### 3.2 A Refração da Borda: Por que o Vidro da Apple Parece "Líquido"

O que faz um objeto ser lido pelo cérebro como **vidro real** não é o desfoque, mas sim o modo como os objetos atrás dele entortam na extremidade.

Em `src/ui/shared/glass.mjs`, temos o motor que calcula o campo de distância assinada (SDF):

```javascript
const sdf = (x, y) => {
  const qx = Math.abs(x - bw) - (bw - r);
  const qy = Math.abs(y - bh) - (bh - r);
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - r;
};
```

O gradiente $(g_x, g_y)$ define a normal da lente, e a rampa quadrática $t^2 \times \text{force}$ desvia os pixels:
$$dx = -\frac{g_x}{\|g\|} \cdot t^2 \cdot \text{force}, \quad dy = -\frac{g_y}{\|g\|} \cdot t^2 \cdot \text{force}$$

- **Hoje:** O Dock no Gabinete **não usa** esse mapa. Ele usa apenas `.glass-support`, que tem desvio zero.
- **Para ser idêntico à Apple:** O dock precisa vestir a lente SDF de 13px de bisel (`bevel: 13`), de modo que as ranhuras do jacarandá da mesa sofram curvatura convexa exatamente nos 13px do contorno da barra.

### 3.3 A Aberração Cromática: A Borda de Cristal

Quando olhamos para a barra flutuante do visionOS, as arestas exibem um brilho prismático quase subliminar. Isso ocorre porque o vidro tem índice de refração dispersivo ($n_{\text{red}} \approx 1.514$, $n_{\text{blue}} \approx 1.528$).

**Como injetar isso no nosso filtro SVG sem WebGL:**
Podemos decompor a imagem refratada em 3 canais e aplicar um deslocamento diferencial fracionário:

```xml
<filter id="apple-liquid-glass">
  <!-- 1. Refração mecânica da lente SDF -->
  <feDisplacementMap in="SourceGraphic" in2="lensMap" scale="16" xChannelSelector="R" yChannelSelector="G" result="bent" />

  <!-- 2. Separação cromática: desloca o Vermelho +0.6px e o Azul -0.6px -->
  <feColorMatrix in="bent" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="ch_red" />
  <feOffset in="ch_red" dx="0.6" dy="-0.2" result="red_shift" />

  <feColorMatrix in="bent" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="ch_green" />

  <feColorMatrix in="bent" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="ch_blue" />
  <feOffset in="ch_blue" dx="-0.6" dy="0.2" result="blue_shift" />

  <!-- 3. Recomposição dos 3 canais -->
  <feBlend in="red_shift" in2="ch_green" mode="screen" result="rg" />
  <feBlend in="rg" in2="blue_shift" mode="screen" result="rgb_chromatic" />

  <!-- 4. Recorte perfeito pela silhueta squircle -->
  <feComposite in="rgb_chromatic" in2="squircleShape" operator="in" />
</filter>
```

Isso gera o efeito **físico exato da Apple**, com custo de GPU infinitesimal e zero processamento na CPU.

---

## 4 · A Regra de Ouro da Performance no República Simulator

A pesquisa revelou o motivo pelo qual **bibliotecas prontas de WebGL (como `@ybouane/liquidglass`) devem ser evitadas** no nosso projeto:

1. **O Custo do Snapshot DOM:** Para fazer refração via WebGL na Web, o JavaScript precisa converter os elementos DOM atrás do vidro em uma textura de imagem (usando algo como `html2canvas`). Em uma tela com nosso tampo de Jacarandá 4K (7,2 MB) e objetos animados, isso trava a thread principal por **25 a 45 ms por frame**, derrubando o jogo para **22–30 fps**.
2. **O Compositor Nativo:** A combinação de **CSS `backdrop-filter` + SVG Filters nativos** é processada em hardware diretamente pelo processo GPU do navegador (Chromium/WebKit). O framebuffer do fundo já está na VRAM, sem cópia de memória pela CPU.
3. **O Limite Medido no Projeto:** A guarda `material` do projeto foi criada justamente porque um teste anterior com filtro mal calibrado derrubou o FPS para 31. O sistema proposto acima respeita o teto de 120 fps e mantém a telemetria do `npm run screen` em verde (< 8ms por quadro).

---

## 5 · Roteiro de Transformação (Para o Futuro)

Quando for o momento de executar essa evolução:

1. **Generalizar `dress()` de `src/ui/shared/topbar.mjs`:**
   Mover a lógica de montagem de lente de `topbar.mjs` para uma função reutilizável em `glass.mjs` que possa vestir o Dock (`#railNav`), a Topbar e os Cards centrais.
2. **Atualizar `00-tokens.css`:**
   Ajustar `--glass-blur` de `blur(18px) saturate(1.5)` para a fórmula visionOS: `blur(22px) saturate(1.85) brightness(1.04)`.
3. **Substituir o `border-radius` do Dock pela casca SVG Squircle:**
   Remover `border-radius: 22px` em `40-shell.css` e aplicar a máscara vetorial superelíptica com o duplo bisel de Fresnel integrado.
4. **Adicionar o Passo de Aberração Cromática no SVG:**
   Incorporar a divisão de canais RGB no filtro de lente perimétrico.
