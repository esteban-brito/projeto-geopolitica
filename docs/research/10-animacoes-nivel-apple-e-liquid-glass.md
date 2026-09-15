# Pesquisa 10 — ANIMAÇÕES NÍVEL APPLE E LIQUID GLASS: do modelo físico à engenharia de baixo nível na web

> **Manual definitivo de engenharia para o Claude e a equipe.**  
> Escrito e auditado em 11/09/2026; emendado em 13/09 nos quatro pontos que a auditoria achou
> (os blocos **CAUTION** em §1.4, §2.5, §2.6/§2.7/§2.8 e §6.2). O código que vale é `spring.mjs`.  
> Este documento investiga a arquitetura de baixo nível por trás do CoreAnimation da Apple
> (`RenderServer`, `CASpringAnimation`), da mecânica dos fluidos do Dynamic Island e dos materiais
> refrativos de visionOS. Traduz a óptica física (Fresnel de Schlick, conservação volumétrica 3D)
> e a matemática de interpolação analítica para a Web moderna (ESM puro, CSS `linear()`, compositing
> direto na GPU a 120 fps e telemetria de entrada a 240Hz).

---

## Índice

1. [A Arquitetura do CoreAnimation e o Compositor da Web](#1--a-arquitetura-do-coreanimation-e-o-compositor-da-web)
   - [1.1 Threading e Renderização: RenderServer vs Main Thread](#11-threading-e-renderização-renderserver-vs-main-thread)
   - [1.2 O Compositor Web: O que roda na GPU e o que desce para a CPU](#12-o-compositor-web-o-que-roda-na-gpu-e-o-que-desce-para-a-cpu)
   - [1.3 A Solução no Estado da Arte: Molas Analíticas em CSS `linear()`](#13-a-solução-no-estado-da-arte-molas-analíticas-em-css-linear)
   - [1.4 O Desafio da Interrupção de Gesto (Retargeting)](#14-o-desafio-da-interrupção-de-gesto-retargeting)
2. [Matemática Avançada: A Solução Analítica Exata com Velocidade Inicial](#2--matemática-avançada-a-solução-analítica-exata-com-velocidade-inicial)
   - [2.1 A EDO do Oscilador Harmônico Amortecido](#21-a-edo-do-oscilador-harmônico-amortecido)
   - [2.2 Caso 1: Criticamente Amortecido ($\zeta = 1.0$ — Padrão Apple `.smooth`)](#22-caso-1-criticamente-amortecido-zeta--10--padrão-apple-smooth)
   - [2.3 Caso 2: Subamortecido ($\zeta < 1.0$ — Molas com Quique Controlado)](#23-caso-2-subamortecido-zeta--10--molas-com-quique-controlado)
   - [2.4 Caso 3: Superamortecido ($\zeta > 1.0$ — Movimento Viscoso Denso)](#24-caso-3-superamortecido-zeta--10--movimento-viscoso-denso)
   - [2.5 Critério de Duração Perceptual ($t_{\text{settle}}$) e Limiar Visual](#25-critério-de-duração-perceptual-t_textsettle-e-limiar-visual)
   - [2.6 Amostragem Adaptativa de Curvatura](#26-amostragem-adaptativa-de-curvatura)
   - [2.7 Gerador de Referência em JavaScript Puro (ESM)](#27-gerador-de-referência-em-javascript-puro-esm)
   - [2.8 Exemplo Real de Saída CSS e Vinculação de Folha](#28-exemplo-real-de-saída-css-e-vinculação-de-folha)
3. [Mecânica dos Fluidos e Incompressibilidade Tridimensional](#3--mecânica-dos-fluidos-e-incompressibilidade-tridimensional)
   - [3.1 A Correção da Razão de Poisson 3D ($S_y = 1/\sqrt{S_x}$)](#31-a-correção-da-razão-de-poisson-3d-s_y--1sqrts_x)
   - [3.2 Preservação de Curvatura de Bordas (`border-radius`)](#32-preservação-de-curvatura-de-bordas-border-radius)
   - [3.3 Ponto de Apoio (`transform-origin`) e Preservação Direcional](#33-ponto-de-apoio-transform-origin-e-preservação-direcional)
4. [A Óptica Físico-Matemática do Liquid Glass na Web](#4--a-óptica-físico-matemática-do-liquid-glass-na-web)
   - [4.1 A Aproximação de Fresnel de Schlick](#41-a-aproximação-de-fresnel-de-schlick)
   - [4.2 A Inviabilidade de Filtros SVG Dinâmicos na Web Moderna](#42-a-inviabilidade-de-filtros-svg-dinâmicos-na-web-moderna)
   - [4.3 A Solução de Engenharia: Liquid Glass Analítico em CSS Puro](#43-a-solução-de-engenharia-liquid-glass-analítico-em-css-puro)
5. [Telemetria de Entrada e Inércia do Gesto](#5--telemetria-de-entrada-e-inércia-do-gesto)
   - [5.1 O Descompasso Temporal: 1000Hz/240Hz vs VSync](#51-o-descompasso-temporal-1000hz240hz-vs-vsync)
   - [5.2 A Eliminação de Aliasing com `getCoalescedEvents()`](#52-a-eliminação-de-aliasing-com-getcoalescedevents)
   - [5.3 A Armadilha do Finger Dwell e a Janela Deslizante de 45ms](#53-a-armadilha-do-finger-dwell-e-a-janela-deslizante-de-45ms)
   - [5.4 Implementação do Rastreador de Velocidade (`VelocityTracker`)](#54-implementação-do-rastreador-de-velocidade-velocitytracker)
6. [Matriz de Aplicação Prática no Gabinete Presidencial](#6--matriz-de-aplicação-prática-no-gabinete-presidencial)
   - [6.1 A Pasta Presidencial (Etapa 2 da Mesa)](#61-a-pasta-presidencial-etapa-2-da-mesa)
   - [6.2 Os Envelopes de Correspondência (Etapa 3)](#62-os-envelopes-de-correspondência-etapa-3)
   - [6.3 O Futuro Dock de Vidro no Rodapé](#63-o-futuro-dock-de-vidro-no-rodapé)
   - [6.4 Divisão Operacional de Papéis (Piloto vs Copiloto)](#64-divisão-operacional-de-papéis-piloto-vs-copiloto)
7. [Checklist de Auditoria e Conformidade de Performance](#7--checklist-de-auditoria-e-conformidade-de-performance)

---

## 1 · A Arquitetura do CoreAnimation e o Compositor da Web

### 1.1 Threading e Renderização: RenderServer vs Main Thread

O motivo pelo qual a maioria das animações na web parece "travada", "plástica" ou inconsistente
em comparação com o ecossistema Apple reside na **arquitetura de processos e threads**:

- **No iOS / macOS:** As animações não rodam na thread da aplicação. Quando uma animação de mola
  é disparada no UIKit ou SwiftUI, o framework serializa os parâmetros analíticos da mola
  (`mass`, `stiffness`, `damping`, `initialVelocity`) e os envia via IPC para um processo dedicado
  do sistema operacional chamado `RenderServer` (hospedado dentro do `backboardd` / `WindowServer`).
  Mesmo que a aplicação realize parsing pesado de JSON, garbage collection (GC) agressivo ou trave
  por 100ms, o `RenderServer` continua renderizando a mola a 120Hz cravados diretamente na GPU.
- **Na Web (Abordagem Tradicional):** Se uma física for calculada quadro a quadro dentro de um loop
  de `requestAnimationFrame` (rAF) em JavaScript, ela disputa tempo de CPU na **Main Thread**
  com o parsing de scripts, recalculo de estilo (Style Recalc), layout da árvore do DOM e coleta de
  lixo. Se um único quadro demorar 18ms em vez de 8.3ms, a física sofre "frame drop" (_jank_).

### 1.2 O Compositor Web: O que roda na GPU e o que desce para a CPU

Nos motores modernos (Blink no Chromium, WebKit no Safari, Gecko no Firefox), a pipeline gráfica é dividida em:

1. **Main Thread:** Executa JavaScript, constrói a DOM Tree, processa CSSOM, roda Layout (Reflow) e grava Paint Ops.
2. **Compositor Thread (C++):** Recebe os _tiles_ rasterizados, organiza as camadas (_layers_) e as
   envia para a GPU através do hardware overlay.

| Propriedade Animada                    | Thread de Execução       | Custo por Frame             | Viabilidade a 120 fps           |
| :------------------------------------- | :----------------------- | :-------------------------- | :------------------------------ |
| `transform` (`translate3d`, `scale`)   | **Compositor (GPU)**     | Zero layout, zero paint     | **Perfeita (120 fps cravados)** |
| `opacity`                              | **Compositor (GPU)**     | Zero layout, zero paint     | **Perfeita (120 fps cravados)** |
| `filter` (`blur`, `brightness`)        | **GPU (Parcial)**        | Pode forçar recomposição    | Boa, mas monitorar fill-rate    |
| `top`, `left`, `margin`, `padding`     | **Main Thread (CPU)**    | **Layout + Paint forçados** | **Péssima (Gera jank)**         |
| `width`, `height`, `flex-basis`        | **Main Thread (CPU)**    | **Layout em cascata**       | **Péssima (Gera jank)**         |
| `clip-path`                            | **Main Thread / Raster** | Repintura geométrica        | Instável em resoluções altas    |
| Variáveis (`var(--x)`) sem `@property` | **Main Thread (CPU)**    | Não compõe na GPU           | Desce para a CPU                |

**Regra de Ouro do Projeto:** Toda e qualquer animação física deve atuar **exclusivamente sobre `transform`
e `opacity`**. Nenhuma propriedade dimensional ou geométrica pode ser animada diretamente.

### 1.3 A Solução no Estado da Arte: Molas Analíticas em CSS `linear()`

A função CSS `linear()` (W3C CSS Easing Functions Level 2) permite mapear uma função matemática arbitrária
para uma curva de interpolação estática que **executa 100% dentro da Compositor Thread em C++**:

```
JS (Main Thread)                       Compositor Thread (C++ / GPU)
Resolve EDO analítica (0.1ms) ──►      Executa interpolação a 120 fps
Libera a thread para o jogo            Sem GC, sem layout thrashing, sem jank
```

Em vez de calcular `x(t)` a cada 8ms em JS, calculamos `x(t)` uma única vez na inicialização ou no
disparo da ação, geramos a lista de pontos amostrados e injetamos no CSS.

### 1.4 O Desafio da Interrupção de Gesto (Retargeting)

Diferença crítica entre animações disparadas por evento e animações contínuas:

- **Transição Disparada (State Change):** Quando o jogador clica para abrir a pasta ou fechar um
  painel, a trajetória parte do repouso ($v_0 = 0$) e segue a curva calculada até o alvo. O CSS `linear()`
  serve — **desde que a interrupção seja tratada** (abaixo).
- **Gesto Vivo Interrompido (Drag & Release):** Quando o jogador arrasta a peça na tela e a solta em
  alta velocidade ($v_0 \ne 0$), uma curva estática com $v_0 = 0$ frearia o elemento bruscamente.
  Para preservar o momento mecânico da Apple, o código deve instanciar a EDO analítica **injetando o
  vetor de velocidade real de soltura** $v_0$ na geração da curva CSS `linear()`.

> [!CAUTION]
> **Emenda de 11/09 (auditoria contra a conta):** a pasta do Gabinete NÃO é só mudança de estado.
> Erguer e largar em sequência interrompe o voo, e uma `transition` CSS interrompida **recomeça do
> zero** — é o defeito que a mola existia para evitar. O `linear()` só serve com retargeting: no
> instante do novo clique, ler $x(t)$ e $\dot{x}(t)$ da própria conta e gerar a curva seguinte a
> partir deles. É o que `curveOf` em `src/ui/shared/spring.mjs` faz (`at` e `rate`), com a
> animação disparada pela Web Animations API e não por `transition`.

---

## 2 · Matemática Avançada: A Solução Analítica Exata com Velocidade Inicial

### 2.1 A EDO do Oscilador Harmônico Amortecido

A dinâmica de uma mola física com amortecimento viscoso obedece à equação diferencial de 2ª ordem:

$$m \frac{d^2 x}{dt^2} + c \frac{dx}{dt} + k (x - x_{\text{alvo}}) = 0$$

Normalizando as grandezas para um sistema de massa unitária ($m = 1$), definimos:

- **Frequência angular natural:** $\omega_n = \sqrt{k}$ (determina a rigidez e a rapidez de resposta).
- **Fator de amortecimento:** $\zeta = \frac{c}{2\sqrt{k}}$ (determina a presença ou ausência de oscilação).

Definindo a coordenada de erro em relação ao alvo: $y(t) = x(t) - x_{\text{alvo}}$. Com a condição
inicial de partida $x(0) = 0$ e alvo $x_{\text{alvo}} = 1$, temos $y(0) = -1$ e $\dot{y}(0) = v_0$.

### 2.2 Caso 1: Criticamente Amortecido ($\zeta = 1.0$ — Padrão Apple `.smooth`)

É o modelo canônico da Apple para interfaces de alta sobriedade e elegância institucional: atinge o
repouso absoluto no menor tempo possível sem jamais oscilar além do alvo ($x(t) \le 1.0$ para $v_0 \le \omega_n$):

$$x(t) = 1 - e^{-\omega_n t} \left[ 1 + (\omega_n - v_0) t \right]$$

- **Comportamento com $v_0 = 0$:** $x(t) = 1 - e^{-\omega_n t} (1 + \omega_n t)$. O elemento arranca com
  suavidade e desacelera progressivamente até estacionar de forma assintótica.
- **Comportamento com $v_0 > 0$ (Inércia a favor):** O elemento viaja mais rápido para o destino. Se
  $v_0 > \omega_n$, ele ultrapassa momentaneamente o ponto final (overshoot inercial) e retorna suavemente
  sem jamais oscilar uma segunda vez.

### 2.3 Caso 2: Subamortecido ($\zeta < 1.0$ — Molas com Quique Controlado)

Frequência angular amortecida: $\omega_d = \omega_n \sqrt{1 - \zeta^2}$.

$$x(t) = 1 - e^{-\zeta \omega_n t} \left[ \cos(\omega_d t) + \frac{\zeta \omega_n - v_0}{\omega_d} \sin(\omega_d t) \right]$$

- Para interfaces institucionais, o quique deve ser restrito a $\zeta \ge 0.85$ (quique $< 0.15$).
  Valores de $\zeta < 0.7$ produzem oscilações elásticas excessivas que remetem a brinquedos de desenho
  animado, violando o tom sóbrio de um gabinete de Estado.

### 2.4 Caso 3: Superamortecido ($\zeta > 1.0$ — Movimento Viscoso Denso)

Raízes reais do polinômio característico: $r_{1,2} = -\omega_n (\zeta \mp \sqrt{\zeta^2 - 1})$.

$$x(t) = 1 - \frac{(r_2 + v_0) e^{r_1 t} - (r_1 + v_0) e^{r_2 t}}{r_2 - r_1}$$

- Aplicação recomendada: Gavetas pesadas de madeira maciça ou deslizamento de cofres onde a inércia
  e o atrito do fluido impedem qualquer aproximação rápida.

---

### 2.5 Critério de Duração Perceptual ($t_{\text{settle}}$) e Limiar Visual

Em matemática pura, uma mola analítica leva tempo infinito para atingir $1.0$ exato ($t \to \infty$).
No entanto, para o olho humano e para as telas digitais, a mola **terminou** quando o deslocamento residual
cai abaixo do limiar visual:

$$\epsilon = 0.002 \quad (0,2\% \text{ da distância total, ou } \approx 0.5\text{px numa tela de 1440px})$$

Para o amortecimento crítico ($\zeta = 1$):
$$\omega_n \approx \frac{2\pi}{\text{duration}}$$
No instante $t = \text{duration}$:
$$e^{-2\pi}(1 + 2\pi) \approx 0.001867 \times 7.283 \approx 0.0136 \quad (1,36\%)$$
O limiar estrito de $\epsilon = 0.002$ é atingido, no caso crítico, em $t_{\text{settle}} = 1.347 \times \text{duration}$.

> [!CAUTION]
> **Emenda de 11/09: o corte NÃO é uma constante.** A primeira versão deste texto dizia $1.25$
> aqui, o gerador do §2.7 usava $1.22$, e a conta com o próprio $\epsilon = 0.002$ dá $1.347$. A
> $1.22$ o resíduo do crítico é $0.41\%$ — o dobro do limiar — e, como o gerador crava o último
> ponto em $1$, sobra um salto de $2.8\text{px}$ no fim de um curso de $700\text{px}$ (o da pasta
> é $448 \to 710$). E o número muda com o regime: para um quique de $0.3$ ele passa de $2.0$.
> **O assentamento se procura**, avaliando a curva até o resíduo e a velocidade caírem abaixo de
> $\epsilon$ — 200 avaliações por gesto, em `settleOf` de `spring.mjs`. Medido: $0.426\text{s}$
> para o `LIFT` de $0.30\text{s}$, contra os $0.366$ que $1.22 \times$ daria.

> [!WARNING]
> **A Armadilha da Dilatação Temporal ($2.5\times$):**
> Nunca multiplique a duração por constantes altas como $2.5\times$. Isso faz a animação passar mais
> de metade do seu tempo final imperceptivelmente congelada em $0.999$, gerando sensação de lentidão
> e arrasto pesado no navegador.

---

### 2.6 Amostragem Adaptativa de Curvatura

Dividir o tempo em 50 passos equidistantes é um desperdício geométrico:

- **Fase de Aceleração ($0\% \text{ a } 20\%$ do tempo):** Ocorre mais de $70\%$ da variação de aceleração
  e curvatura. Com passos lineares, sobram apenas 7 pontos para cobrir essa região, gerando arestas
  poligonais visíveis a 120 fps.
- **Fase de Assentamento ($50\% \text{ a } 100\%$ do tempo):** A curva varia menos de $0.02$. Passos
  lineares gastam metade da string do CSS repetindo valores redundantes.

A solução é utilizar uma **amostragem progressiva com concentração de curvatura**:

$$t_i = t_{\text{settle}} \cdot \left( \frac{i}{N} \right)^{1.2}$$

Essa parametrização densifica as amostras nos instantes iniciais de alta energia e espaça suavemente
as amostras na aproximação final assintótica.

> [!CAUTION]
> **Emenda de 11/09: cada ponto tem de levar a POSIÇÃO.** `linear()` espaça os pontos por igual no
> tempo quando eles chegam sem posição — então uma amostragem densa no arranque sai ESTICADA sobre
> a duração toda. Medido: a pasta chegava a $489\text{px}$ aos $120\text{ms}$ onde a conta pede
> $635$, porque os $29\text{ms}$ iniciais estavam espalhados sobre $120$. A forma certa é
> `linear(0 0%, 0.0415 3.59%, …, 1 100%)`, e é assim que `curveOf` emite.

---

### 2.7 Gerador de Referência em JavaScript Puro (ESM)

> [!CAUTION]
> **Emenda de 11/09: o gerador abaixo é o RASCUNHO, e ele erra em dois pontos** — o corte constante
> (`1.22`, §2.5) e a amostra sem posição (§2.6). O gerador que vale é `curveOf` em
> `src/ui/shared/spring.mjs`, coberto por seis provas em `tests/suites/spring.mjs` (a analítica
> contra a derivada numérica nos três regimes, $v_0$ honrado, quique zero que não ultrapassa). Uma
> delas pegou um erro de sinal no superamortecido — `(r2−r1)` por `(r1−r2)` — que dava posição certa
> nas duas pontas e caminho errado no meio. O rascunho fica aqui só para a comparação.

Este módulo utilitário é autocontido, não possui nenhuma dependência externa e pode ser consumido
tanto em tempo de compilação quanto em tempo de execução na interface:

```javascript
/**
 * Gera uma string CSS linear(...) analítica rigorosa equivalente ao CoreAnimation da Apple.
 *
 * @param {Object} options
 * @param {number} options.duration Duração perceptual de assentamento em segundos (ex: 0.32)
 * @param {number} [options.bounce=0] Quique de -1 a 1 (0 = amortecimento crítico puro .smooth)
 * @param {number} [options.v0=0] Velocidade inicial normalizada (1.0 = 100% do curso por segundo)
 * @param {number} [options.points=36] Quantidade de amostras para o CSS (30 a 40 é o ponto ideal)
 * @returns {string} String CSS linear(...) pronta para uso no Compositor
 */
export function generateCssSpring({ duration, bounce = 0, v0 = 0, points = 36 }) {
  const d = Math.max(0.05, duration);
  const zeta = Math.max(0.01, 1 - bounce);
  const omega = (2 * Math.PI) / d;
  const settleTime = d * (zeta < 1 ? 1.35 : 1.22);
  const samples = [];

  for (let i = 0; i <= points; i++) {
    const progress = i / points;
    // Densificação progressiva na fase de aceleração
    const t = Math.pow(progress, 1.2) * settleTime;
    let val;

    if (Math.abs(zeta - 1) < 0.005) {
      // Caso 1: Criticamente amortecido (Apple .smooth)
      val = 1 - Math.exp(-omega * t) * (1 + (omega - v0) * t);
    } else if (zeta < 1) {
      // Caso 2: Subamortecido (Molas com quique)
      const omegaD = omega * Math.sqrt(1 - zeta * zeta);
      const bTerm = (zeta * omega - v0) / omegaD;
      val = 1 - Math.exp(-zeta * omega * t) * (Math.cos(omegaD * t) + bTerm * Math.sin(omegaD * t));
    } else {
      // Caso 3: Superamortecido (Viscoso)
      const disc = Math.sqrt(zeta * zeta - 1);
      const r1 = -omega * (zeta - disc);
      const r2 = -omega * (zeta + disc);
      val = 1 - ((r2 + v0) * Math.exp(r1 * t) - (r1 + v0) * Math.exp(r2 * t)) / (r2 - r1);
    }

    samples.push(Number(val.toFixed(4)));
  }

  // Clampa o valor final exatamente em 1 para garantir estabilidade de repouso
  samples[samples.length - 1] = 1;

  return `linear(${samples.join(", ")})`;
}
```

### 2.8 Exemplo Real de Saída CSS e Vinculação de Folha

Ao instanciar a mola padrão da pasta (`duration: 0.30, bounce: 0, v0: 0`):

```css
:root {
  /* Curva Apple .smooth pré-calculada analiticamente (0 custos de CPU em voo) */
  --spring-smooth: linear(
    0,
    0.0381,
    0.1245,
    0.2398,
    0.3672,
    0.4945,
    0.6128,
    0.7161,
    0.8016,
    0.8687,
    0.9184,
    0.9532,
    0.9761,
    0.9899,
    0.9972,
    1
  );
}

.desk__folder {
  transform: translate3d(0, 0, 0) scale(1);
  transition: transform 300ms var(--spring-smooth);
  will-change: transform;
}

.desk__folder[data-state="reading"] {
  transform: translate3d(var(--read-x), var(--read-y), 0) scale(var(--read-scale));
}
```

> [!CAUTION]
> **Emenda de 11/09: este exemplo NÃO é o que o Gabinete usa, por duas razões medidas.** A lista
> vem sem posições (§2.6), e `transition` recomeça do zero quando interrompida (§1.4). No
> `cabinet.mjs` a curva nasce a cada gesto com a velocidade do instante e vai para
> `element.animate()`, uma animação por peça no compositor: 0 quadros e 0 escritas de estilo na
> thread principal, contra ~24 `requestAnimationFrame` e ~72 escritas do laço anterior.

---

## 3 · Mecânica dos Fluidos e Incompressibilidade Tridimensional

### 3.1 A Correção da Razão de Poisson 3D ($S_y = 1/\sqrt{S_x}$)

No design do Dynamic Island e nos gestos táteis do iOS, elementos interativos reagem a compressões
e estiramentos obedecendo à **conservação contínua de volume**:

$$V = L_x \cdot L_y \cdot L_z = \text{constante} \implies S_x \cdot S_y \cdot S_z = 1$$

Para qualquer objeto sólido e denso (couro, madeira, metal polido, elastômero de vedação) apoiado sobre
o plano da mesa, a deformação transversal se divide igualmente entre a altura $Y$ e a espessura $Z$ ($S_y = S_z$):

$$S_x \cdot S_y^2 = 1 \implies S_y = \frac{1}{\sqrt{S_x}} = S_x^{-0.5}$$

```
   Estiramento Horizontal (Sx = 1.15)
 ┌──────────────────────────────────────┐
 │                                      │   Sy = 1 / sqrt(1.15) ≈ 0.932 (-6.8%)
 │               OBJETO                 │   -> Sensação de material denso e nobre
 └──────────────────────────────────────┘

   Estiramento 2D Incorreto (Sx = 1.15)
 ┌──────────────────────────────────────┐
 │               OBJETO                 │   Sy = 1 / 1.15 ≈ 0.869 (-13.1%)
 └──────────────────────────────────────┘   -> Sensação de chiclete ou bexiga d'água
```

### 3.2 Preservação de Curvatura de Bordas (`border-radius`)

Uma armadilha comum na Web é aplicar `scale(Sx, Sy)` em elementos que possuem cantos arredondados:

- Uma caixa com `border-radius: 12px` sob escala de $(1.15, 0.93)$ transforma o arco do canto em uma
  **elipse distorcida**, com raios assimétricos ($13.8\text{px} \times 11.1\text{px}$).
- **Como contornar:**
  1. **Impacto Leve ($\Delta S < 4\%$):** A distorção no canto fica abaixo de $0.4\text{px}$, imperceptível
     ao olho humano mesmo em monitores de alta densidade.
  2. **Interação Expressiva:** Aplicar a escala geométrica sobre o container envoltório (`.card-wrapper`),
     enquanto os elementos de borda e cantos compensam internamente ou operam via clipagem SVG contínua.

### 3.3 Ponto de Apoio (`transform-origin`) e Preservação Direcional

- No Dynamic Island, a expansão para baixo fixa a borda superior: `transform-origin: top center`.
- Na pasta presidencial, a abertura do fólio ancora na lombada de costura: `transform-origin: left center`.
- No clique de cartas e envelopes, o centro de massa ancora o aperto: `transform-origin: 50% 50%`.

---

## 4 · A Óptica Físico-Matemática do Liquid Glass na Web

### 4.1 A Aproximação de Fresnel de Schlick

A refletividade luminosa $R(\theta)$ de superfícies transparentes polidas varia drasticamente com o
ângulo de observação $\theta$ (medido contra o vetor normal da face):

$$R(\theta) = R_0 + (1 - R_0)(1 - \cos\theta)^5$$

Onde $R_0 = \left( \frac{n_1 - n_2}{n_1 + n_2} \right)^2$. Para vidro e policarbonato no ar ($n_1 = 1.0, n_2 = 1.5$), $R_0 = 0.04$ ($4\%$):

```
                   LUZ AMBIENTE DO TETO
                           │
                           ▼
  Visão Normal (0°) ──► ┌──────┐ ◄── Borda Rasante (85°-90°)
   Reflexão: apenas 4%  │      │      Reflexão: 80% a 100%!
   Transmissão: 96%     │ VIDRO│      (Realce especular concentrado)
  (Madeira nítida atrás)└──────┘
```

- **Conclusão Óptica:** Um vidro realista na interface do computador não se define por esbranquiçar o
  centro, mas por concentrar o **realce especular luminoso na aresta perimetral externa**.

### 4.2 A Inviabilidade de Filtros SVG Dinâmicos na Web Moderna

Pesquisas teóricas frequentemente sugerem encadeamentos de SVG (`feDisplacementMap`, `feMorphology`, `feColorMatrix`):

1. **Bloqueio de Segurança dos Navegadores:** O primitivo `in="BackgroundImage"` foi **removido e proibido**
   em todos os navegadores modernos (Chromium, Safari e Firefox) para impedir ataques de canal lateral
   e vazamento de dados de outros domínios via shaders SVG. Logo, o filtro SVG **não enxerga a foto
   do Jacarandá** — ele só consegue distorcer o que está dentro do próprio elemento.
2. **Queda Drástica de Desempenho:** No WebKit (Safari), filtros SVG complexos desligam a GPU e
   ativam **rasterização por software na CPU**. Em telas Retina ($2\times$ e $3\times$ DPR), isso
   derruba a taxa de renderização para **menos de 25 fps**, causando travamento perceptível.

### 4.3 A Solução de Engenharia: Liquid Glass Analítico em CSS Puro

O padrão que entrega 120 fps no Compositor utiliza a composição analítica acelerada por hardware:

```css
/* Padrão Liquid Glass homologado para o Gabinete Presidencial */
.liquid-glass {
  /* 1. Transparência central obedecendo Fresnel (5% de luz refletida) */
  background: rgba(255, 255, 255, 0.045);

  /* 2. Desfoque de substrato em camada acelerada por GPU */
  backdrop-filter: blur(28px) saturate(135%);
  -webkit-backdrop-filter: blur(28px) saturate(135%);

  /* 3. Arestas de Fresnel de Schlick via box-shadow concêntricas */
  box-shadow:
    /* Realce rasante superior: luz zenital direta do gabinete */
    inset 0 1px 0.5px 0 rgba(255, 255, 255, 0.7),
    /* Perímetro rasante secundário: filete dielétrico suave */ inset 0 0 0 1px
      rgba(255, 255, 255, 0.12),
    /* Oclusão rasante inferior: sombra interna de espessura */ inset 0 -1px 1px 0
      rgba(0, 0, 0, 0.35),
    /* Sombra de projeção na madeira: dispersão volumétrica suave */ 0 16px 40px -12px
      rgba(0, 0, 0, 0.45);

  border-radius: 14px;
}
```

---

## 5 · Telemetria de Entrada e Inércia do Gesto

### 5.1 O Descompasso Temporal: 1000Hz/240Hz vs VSync

Mouses de alta precisão reportam coordenadas a 1000Hz (1ms), e touchpads/telas táteis reportam a 240Hz (4.1ms).
O monitor, entretanto, atualiza a 60Hz (16.6ms) ou 120Hz (8.3ms).

Se o código ouvir apenas eventos comuns de `pointermove`, múltiplos pacotes intermediários de dados
são descartados, introduzindo **Aliasing Temporal** (micro-engasgos na velocidade de arraste).

### 5.2 A Eliminação de Aliasing com `getCoalescedEvents()`

A API de Eventos de Ponteiro do W3C permite recuperar todos os pontos físicos intermediários acumulados
antes do quadro atual:

```javascript
function onPointerMove(event) {
  const events =
    typeof event.getCoalescedEvents === "function" ? event.getCoalescedEvents() : [event];

  for (const e of events) {
    tracker.addPoint(e.clientX, e.clientY, e.timeStamp);
  }
}
```

### 5.3 A Armadilha do Finger Dwell e a Janela Deslizante de 45ms

Quando o ser humano solta o botão do mouse ou ergue o dedo da tela (`pointerup`), ocorre o fenômeno
biomecânico universal do **finger dwell**:

- Nos últimos $8\text{ms}$ a $12\text{ms}$ de contato físico, o atrito da pele e o relaxamento muscular
  fazem o cursor desacelerar bruscamente.
- Se a velocidade $v_0$ for medida apenas nos últimos $8\text{ms}$, o sistema calcula velocidade zero,
  e o documento "cai morto" sem deslizar para o alvo.
- **Solução:** Utilizar um histórico deslizante de **45ms**, aplicando regressão linear que filtra
  quedas bruscas nos instantes finais de desaceleração mecânica.

### 5.4 Implementação do Rastreador de Velocidade (`VelocityTracker`)

```javascript
export class VelocityTracker {
  constructor(windowMs = 45) {
    this.windowMs = windowMs;
    this.points = [];
  }

  addPoint(x, y, timestamp = performance.now()) {
    this.points.push({ x, y, t: timestamp });
    const cutoff = timestamp - this.windowMs;
    while (this.points.length > 2 && this.points[0].t < cutoff) {
      this.points.shift();
    }
  }

  getVelocity() {
    const len = this.points.length;
    if (len < 2) return { vx: 0, vy: 0 };

    const first = this.points[0];
    const last = this.points[len - 1];
    const dt = Math.max(1, last.t - first.t) / 1000;

    return {
      vx: (last.x - first.x) / dt,
      vy: (last.y - first.y) / dt,
    };
  }

  reset() {
    this.points.length = 0;
  }
}
```

---

## 6 · Matriz de Aplicação Prática no Gabinete Presidencial

### 6.1 A Pasta Presidencial (Etapa 2 da Mesa)

- **Parâmetros da Mola:** Amortecimento crítico puro ($\zeta = 1.0, \text{bounce} = 0, \tau = 0.30s, v_0 = 0$).
- **Eliminação do Véu Escurecedor:** O elemento `.desk__veil` deve ser inteiramente descontinuado. A
  madeira Jacarandá deve permanecer visível em todos os quadros.
- **Sensação de Elevação 3D:** A subida e a expansão de escala da pasta devem ser acompanhadas pela
  dilatação contínua da sombra projetada (`box-shadow`), dando a ilusão ótica de que o fólio está se
  aproximando dos olhos do presidente.

### 6.2 Os Envelopes de Correspondência (Etapa 3)

- **Abertura Orgânica da Carta:** Ao clicar num envelope, a aba deve abrir por rotação de perspectiva
  em $X$ (`rotateX(-180deg)`), revelando o papel interno que desliza suavemente para cima antes de expandir.
- **Preservação do Ritmo do Cargo:** O movimento deve durar entre $0.28s$ e $0.34s$, sem quique exagerado,
  simulando o corte limpo de uma espátula de abrir cartas de metal nobre.

> [!CAUTION]
> **Emenda de 11/09: o `rotateX` reabre uma decisão fechada, e a pergunta é dele.** A árvore 3D saiu
> inteira da mesa por ordem dele ("a foto da madeira exatamente como ela é" — em projeção a foto é
> reamostrada), e a mesa inteira é ortográfica, vista de cima. Uma aba que gira em perspectiva é a
> única peça com ponto de fuga na cena. Antes de desenhar a Etapa 3, perguntar a ele: aba em
> perspectiva, ou abertura em 2D (a aba sobe pela escala e a carta desliza)? Não é detalhe de
> implementação.

### 6.3 O Futuro Dock de Vidro no Rodapé

- Quando o jogador estiver no Gabinete, a barra de navegação lateral poderá descer e flutuar no rodapé
  como um **dock de vidro** com os ícones principais.
- A transição entre telas deve utilizar `view-transition-name` nativo do navegador, permitindo que os
  ícones voem para a lateral sem necessidade de cálculos manuais de mola em JavaScript.

### 6.4 Divisão Operacional de Papéis (Piloto vs Copiloto)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      FLUXO DE CO-DESENVOLVIMENTO                        │
├────────────────────────────────────┬────────────────────────────────────┤
│         PILOTO (CLAUDE)            │       COPILOTO (ANTIGRAVITY)       │
├────────────────────────────────────┼────────────────────────────────────┤
│ • Escreve o código de produção     │ • Realiza auditorias matemáticas   │
│ • Aplica as classes em 46-desk.css │ • Mede contraste visual WCAG       │
│ • Ajusta o timing no cabinet.mjs   │ • Mede custo em fps (screen-cost)  │
│ • Roda e mantém o portão verde     │ • Prepara pesquisas e novos modelos│
└────────────────────────────────────┴────────────────────────────────────┘
```

---

## 7 · Checklist de Auditoria e Conformidade de Performance

Antes de homologar qualquer nova animação no repositório, o copiloto e o piloto devem validar:

1. [ ] **Compositor Guarantee:** A animação atua estritamente em `transform` e `opacity`?
2. [ ] **Zero Main-Thread Overhead:** A curva de transição foi gerada via CSS `linear()` analítico ou
       opera em subpassos de relógio sem travar o event loop?
3. [ ] **Fidelidade de Sobriedade:** O quique está cravado em zero ($\text{bounce} = 0$) para atos de Estado?
4. [ ] **Integridade do Substrato:** A madeira Jacarandá permanece visível e nítida sob os elementos de vidro?
5. [ ] **Critério de Contraste WCAG 2.1 AA/AAA:** Todo texto sobre o vidro atinge razão de contraste mínima de $4.5:1$?
6. [ ] **Portão Verde 100%:** `npm run validate` fecha com 13 guardas, 66 provas sintéticas e passeio visual aprovados?
