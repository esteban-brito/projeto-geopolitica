# AndrewPrifer/liquid-dom (dd342ab, 2026-09-07) — NÃO estava na lista; é o mais próximo do que queremos

Monorepo: core (scene graph imperativo + renderer WebGPU), layout (motor estilo SwiftUI), react,
three (pós-composição sobre WebGPURenderer do three), r3f. ~12 mil linhas TS/WGSL.
HTML-in-Canvas: `<canvas layoutsubtree>` + paint events → texturas (API antiga ainda).

## Renderer
- UM device, UM canvas, cena = containers com shapes; shapes empacotados num STORAGE BUFFER
  `array<ShapeData>` (transform inverso 2×3 + geometria + raio + suavização + grid de submersão).
- Pass de vidro: triângulo full-screen, mas o trabalho de blur/métricas é RESTRITO ao AABB da
  união das shapes (bounds acumulados na CPU).
- Ordem de cena (scene-order.ts), alvos ping-pong por nível (gpu-targets.ts) — pool por nível,
  recriado só em resize.
- Interação: hit-test na CPU espelha o SDF da GPU (comentário exige manter os dois em sincronia).

## Blur adaptativo (ADAPTIVE_BLUR_PERF.md — modelo de custo, NÃO medição)
- Escolhe nível L = ceil(log2(raio/raioDenso)); downsample box 4-amostras nível a nível;
  gaussiano separável no nível L; upsample linear nível a nível.
- Custo em leituras por pixel de saída: down(L)=up(L)=4/3(1−4^−L), blur(L)=2·S·4^−L.
  Converge para ~2,67 A em raios grandes, independente do kernel. 13 taps (S=7, σ=3, raio denso
  6 px) é o compromisso: limites de nível em 6/12/24/48/96 px.
- Risco declarado: descontinuidade VISUAL na troca de nível não medida; kernels largos escondem.

## Métricas de fundo (ADAPTIVE_TINT.md)
- Pass de métricas sobre os bounds do container → textura pequena → copyTextureToBuffer →
  mapAsync assíncrono (readback com 1+ frame de atraso, nunca bloqueia).
- Saída em LUZ LINEAR: média RGB, luminância média, P10, P50, P90.
- Política fica FORA do renderer: P50 → smoothstep(0,08; 0,92) → brilho do tint 0,1..0,85;
  debounce (só muda alvo se Δ>0,01 e após 300 ms estável) + suavização exponencial 500 ms.
  Contraste P90−P10 sugerido para alpha.

## Geometria
- Squircle por p-norma (superelipse) no canto: expoente 2 (círculo) → 4 (iOS-like) por
  "cornerSmoothing" 0..1 (default 0,6 = expoente 4). Limita a suavização ao que cabe.
- Perfis com derivada ANALÍTICA (vec2 altura, derivada): convexSquircle = sqrt(1−u⁴) (variante),
  concave, lip com derivada da mistura por smootherstep (regra do produto aplicada). Clamp 1e−4.

## Smooth union — o tratamento mais cuidadoso encontrado
- União "conservadora" de suporte finito: correção só onde |dA−dB| < k, profundidade limitada
  (0,25·k), remapeamento com "aceleração"; pesos derivados → GRADIENTE da união = mistura
  ponderada dos gradientes (sem diferença finita da união).
- "Normal angle gate": raio de mistura reduzido conforme o ângulo entre as normais (acos/π) →
  evita o inchaço quando as bordas são paralelas/alinhadas.
- "Submerged area": grid por shape (CPU) de quanto ela está dentro das outras, filtrado por
  gaussiano 5×5 na GPU → reduz k quando uma forma está submersa na outra (evita "bolha").
- Custo: loop sobre TODAS as shapes por pixel, com gradiente por diferença finita por shape
  (4 SDFs extras) → O(N) por pixel; ok para dezenas, não para centenas sem binning.

## Reaproveitar
- Storage buffer de shapes + transform inverso por shape (rotação/escala/skew de graça).
- Bounds para limitar blur/métricas.
- Blur por nível + modelo de custo (usar e MEDIR a descontinuidade).
- Métricas lineares com percentis + readback assíncrono; política fora do renderer.
- Smooth union conservadora + gate de ângulo + redução por submersão.
- Superelipse com expoente contínuo (morph círculo→squircle é interpolar um número).
- Perfis com derivada analítica.

## Evitar / limites
- HIC ainda na API antiga (layoutsubtree).
- Gradiente por diferença finita por shape no loop (dá para analítico).
