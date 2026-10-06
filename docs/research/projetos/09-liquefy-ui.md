# liquefy-ui/liquefy-ui (effd873, 2026-10-06) — @liquefy-ui/core 1.1.0 + react, MIT

## Arquitetura (core ~2.100 linhas)
- REFRAÇÃO = SVG `backdrop-filter: url()` (Chromium apenas; detecção: CSS.supports + 'userAgentData'
  ou window.chrome). WebKit/Gecko "parseiam e descartam o deslocamento" → material CSS.
- Mapa de deslocamento gerado por um WebGL2 COMPARTILHADO (1 contexto oculto, preserveDrawingBuffer),
  até 640 px de lado, lido como imagem para feImage. ResizeObserver regera.
- Dispersão: três feDisplacementMap (um por canal, isolado com feColorMatrix) com escalas diferentes.
- ORNAMENTOS (rim, glow sob o ponteiro, ripple, sheen, sparkle, iridescência) = segundo WebGL2
  compartilhado; cada componente é desenhado no canvas oculto e COPIADO (drawImage) para o canvas 2D
  do próprio componente. Comentário: "Browsers hard-cap live WebGL contexts (~16 per page), so a
  canvas per component silently kills its siblings." → 1 contexto + N canvases 2D baratos.

## Geometria / óptica — achados medidos
- Perfil do bisel t^curve (curve=2). Comentário com MEDIÇÃO: a calota esférica 1−sqrt(1−t²) tem
  inclinação infinita na borda → o deslocamento salta de 0 ao máximo em 1 px e "o fundo dobra
  sobre si mesmo" nas pontas arredondadas. Potência mantém a inclinação finita.
- `maximumCompression = 0.88`: o aperto da borda é limitado para que o mapeamento de amostras seja
  INJETIVO (um-para-um) — inclusive com a escala extra do canal vermelho na dispersão.
  → Regra geral para nós: |det J| do mapeamento de refração > 0 em todo pixel, senão aparece dobra
  espelhada. Vale para Snell também (o perfil squircle tem f′→∞ na borda).
- Deslocamento = −normal_SDF · profile; centro neutro sem máscara.
- Wobble "jelly": domínio do SDF deformado por ondas angulares sin(3θ+15t)·0,62 + sin(5θ−10t+1,7)·0,38
  com amplitude ∝ energia `u_wobble` — borda que oscila de verdade, não só escala.
- Ripple: anel gaussiano que se expande do ponto do clique com decaimento exp.

## Física
- SpringValue (stiffness 210, damping 21, mass 1), semi-implícito, subpasso ≤ 1/120 s, dt
  limitado a [1/240, 1/15], para quando |v| e |x−alvo| < 0,001 (permite parar o loop).
- Elastic pull: superfície "se inclina" para o ponteiro ANTES de ele chegar; queda medida da BORDA
  (não do centro) → dock com itens de tamanhos diferentes reage como uma linha; queda quadrática;
  stretch por eixo com −0,5 no outro (≈ conservação de área).
- Um único listener global de pointermove + rAF despacha para todos os registrados; rects em cache
  invalidados em scroll/resize.

## Reaproveitar
- Injetividade como invariante de projeto (clamp de compressão).
- Perfil com inclinação finita (ou suavizar a quina do squircle).
- Elastic pull medido da borda; stretch com compensação.
- Listener global único + cache de rects.
- Respeitar prefers-reduced-transparency / reduced-motion.

## Evitar
- Ornamentos que não nascem da geometria (sparkle, iridescência animada) — "efeito para mostrar".
- SVG backdrop-filter como caminho principal.
