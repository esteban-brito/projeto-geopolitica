# iyinchao/liquid-glass-studio (f7b28c3, 2026-09-10) — fora da lista; demo de referência popular

WebGL2 (GLSL) + WebGPU (WGSL, port do "STEP==9" do GLSL), React + Leva. 2 shapes fixas (círculo +
retângulo superelíptico), merge por smin polinomial, molas na posição do mouse.

## Óptica
- SDF retângulo com canto SUPERELÍPTICO (p-norma com expoente n "roundness") — distância não-exata
  (p-norma não é distância euclidiana), suficiente para máscara.
- Refração por ângulo: x = 1 − d/espessura; θi = asin(x²) (perfil implícito), θt = asin(sin θi / n),
  edgeFactor = −tan(θt − θi); offset = −normal·edgeFactor·refDistance. Snell "por ângulo".
- Normal por diferença central do SDF unido (×√2·1000 — normalização mágica).
- Dispersão: n_R = 0,98, n_G = 1, n_B = 1,02 escalados por fator; 6 amostras (nítido + borrado por
  canal) misturadas por `blurMixRate`.
- Tint por mix sobre o fundo borrado. Fresnel: pow(1 + d·k + dureza, 5) — faixa de borda
  paramétrica; a cor do Fresnel é o tint clareado em LCH (+20 L·F) → brilho que preserva o matiz.
- GLARE com ângulo: realce em θ e no lado OPOSTO (θ+π) com fator próprio (`glareOppositeFactor`) —
  traço característico do vidro da Apple (dois realces diagonalmente opostos).
- Blur gaussiano multipasso; "blurEdge" mistura nítido/borrado pela altura da borda.

## Reaproveitar
- Realce em lados opostos (luz + contra-luz) com intensidades diferentes.
- Clarear o tint em espaço perceptual (LCH/OKLCH) em vez de somar branco.
## Evitar
- Constantes de normalização mágicas; superelipse não-euclidiana para normais.
