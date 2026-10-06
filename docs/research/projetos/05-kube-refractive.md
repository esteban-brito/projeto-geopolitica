# Kube (kube.io/blog/liquid-glass-css-svg) + @hashintel/refractive 0.0.4

kube.io BLOQUEADO pela rede deste ambiente (e archive.org/archive.ph também). A matemática foi lida
no código do @hashintel/refractive (mesmas funções e nomes que o plano do glass-effect-webgpu cita
como "from kube.io": surfaceEquations.ts, displacementMap.ts, specular.ts, Filter.tsx). Tratar
como a implementação de referência do artigo; conferir o texto quando a rede liberar.

## Modelo de lente (o "Kube model")
- Raio incidente VERTICAL (observador ortográfico olhando de cima), 2D numa seção radial.
- Superfície do bisel: altura y = f(x), x ∈ [0,1] da borda (0) até o fim do bisel (1). Escala:
  altura do bisel = bezelWidth (perfil com proporção 1:1).
- Perfis: convexCircle sqrt(1−(1−x)²); convex(SQUIRCLE) (1−(1−x)⁴)^¼; concave 1−convexCircle;
  lip = mix(convex(2x), concave(x)+0.1, smootherstep(x)).
- Normal: n = (−f′, −1)/|·| com f′ por diferença finita (1e−4).
- Snell: refract com η=1/IOR; k<0 → TIR → deslocamento 0.
- Deslocamento = r.x · (f(x)·bezelWidth + glassThickness) / r.y — o raio viaja até o FUNDO do vidro;
  o fundo é plano e encosta no conteúdo (não há gap; a segunda interface é ignorada).
- LUT de 128 amostras do deslocamento ao longo do raio do bisel; depois cada pixel do mapa busca o
  índice pela distância à borda e ROTACIONA pela direção normal à borda (ângulo).
- Mapa codificado em 8 bits: R=128+dX·127, G=128+dY·127, normalizado por maxDisplacement;
  `feDisplacementMap scale = maxDisplacement·scaleRatio`. Quantização: ±max em 255 níveis →
  com 100 px de máximo, degrau de ~0,8 px (escada visível em refração forte).
- Rounded-rect: no canto, ângulo remapeado dentro da abertura do canto (atan2) — direção
  aproximada, não gradiente verdadeiro do SDF.
- Especular: mapa de aro de ~1 px (sqrt(1−(1−d/1px)²)) × |dot(dir, luz)|, luz a 45°;
  luminanceToAlpha → branco "over". É uma linha de borda modulada por ângulo.
- Pipeline SVG: feGaussianBlur → feDisplacementMap(R,G) → specular (feColorMatrix lumToAlpha →
  feComponentTransfer opacidade → feFlood branco → feComposite in/over). colorInterpolation sRGB.
- "Magnifying glass" (seção do artigo): escala radial do UV para o centro (implementada pelo
  jeantimex como magnifying_scale).

## refractive (HASH) — engenharia
- HOC React: `refractive.div` / `refractive(Component)`; sobrescreve backdropFilter e borderRadius.
- 9-SLICE: o mapa só é calculado para (2·max(radius,bezel)+1)² px, partido em 8 partes e
  recomposto com feImage+feComposite no tamanho do elemento → custo de CPU independente do
  tamanho do elemento; meio esticado.
- ResizeObserver para medir (TODO interno: trocar por objectBoundingBox).
- Detecção: CSS.supports só checa sintaxe → fazem UA sniff (Chrome/Chromium e não iOS). Fora do
  Chromium: só blur nativo, sem refração.

## Kube × refractive
- Mesma física; refractive acrescenta 9-slice, HOC, detecção, flags hideTop/Bottom/Left/Right
  (para vidro encostado em bordas), mas fixa ângulo especular (π/4) e não tem dispersão.

## Port para WGSL (decisão)
- Calcular por PIXEL, em float, sem mapa: d = SDF; x = clamp(d/bezel); f e f′ ANALÍTICOS:
    circle  f′ = (1−x)/sqrt(1−(1−x)²)
    squircle f′ = (1−x)³·(1−(1−x)⁴)^(−3/4)
  (clamp x ≥ ε para evitar ∞ na borda; ou usar n diretamente via forma fechada).
- Direção = ∇SDF analítico (rounded-rect/superelipse) — não atan2 de canto.
- Normal 3D N = normalize(vec3(−f′·∇d, 1)) (com sinal adequado), raio V = (0,0,−1).
- Duas interfaces + gap: dentro do vidro t = refract(V, N, 1/n); caminho até a base plana
  (h(x)+thickness)/|t.z|; ao sair na base plana (normal (0,0,1)) refrata de volta para o ar e
  percorre o gap até o conteúdo. Custa ~20 ALU, dá parâmetro físico "altura de flutuação".
- Dispersão: repetir só o refract com n(λ) por canal (Abbe) — a geometria é a mesma.
- Sem quantização de 8 bits, sem LUT; LUT 1D rgba16f (n_R, n_G, n_B) por material fica como
  otimização SE o perfil acusar ALU (improvável: o custo é amostra de textura).
