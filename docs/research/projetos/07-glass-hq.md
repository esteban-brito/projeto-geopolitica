# Glass-HQ/liquid-glass (2860bf6, 2026-10-07) — MIT, @glass-sdk/liquid-glass 0.2.0 (pré-release)

Bun workspaces: packages/liquid-glass (lib), apps/site (exemplos), apps/native-reference (APP
SWIFTUI macOS com o Liquid Glass REAL da Apple para comparação visual lado a lado).

## Arquitetura — "WebGPU como forno, SVG como compositor"
- O WebGPU NÃO desenha a tela. `MaterialRenderer` (vgpu) gera um ATLAS de 4 planos por geometria
  (w, h, radius, dpr, appearance): displacement (RG), mask (cobertura AA), highlight, outline.
  Lê de volta (`target.color.read()`), codifica cada plano em PNG data URL via canvas 2D.
- Cache LRU de 48 entradas por geometria; mover a superfície REUSA os mapas (só mudar tamanho/raio
  regenera). Fila serial de renders (`pending` promise chain).
- `GlassScene` monta UM filtro SVG para a cena inteira (até 64 superfícies, `maxSurfaces`), aplicado
  como backdrop-filter; rAF segue os bounds reais dos controles (translate, resize, press).
  Unidades do filtro normalizadas por width/height (regex no markup — hack).
- Cadeia por superfície: feImage(mapas) → neutral flood → frost (2 gaussianos + feBlend lighten/
  darken + arithmetic) → feComponentTransfer com TABELA de tom (curva por material) → saturate →
  feDisplacementMap → luminância para highlight adaptativo → composição com máscara in/out.
- "Progressive blur": atlas 256×8 com 7 pesos + linha de deslocamento; até 64 regiões; soma de
  gaussianos mascarados (arithmetic).
- A lib "nunca captura o DOM": conteúdo vivo, sem cópia — porque quem lê o backdrop é o navegador.
  Preço: só Chromium faz `backdrop-filter: url()`. Fora dele: degrada (blur).

## Geometria
- `shape()` = CANTO CONTÍNUO estilo Apple: constante 1,5286649466 (extensão da curva do canto
  além do raio nominal, a do "continuous corner" do iOS) + polinômio de 4º grau ajustado para a
  distância; transição para rounded-rect comum em formas pequenas (k). Normal = direção do canto.
  É a melhor aproximação de squircle Apple-like encontrada; analítica e barata.
- Perfil de borda: depth = sat(−d·0,05) (bisel de 20 px), edge = 1 − sqrt((2−depth)·depth)
  (círculo), deslocamento = −n·edge·0,5. Sem Snell.
- Highlight: só no topo/base (|n.y| acima de cos(1,08)), traço de ~1 px + difuso suave;
  "Keep the top/bottom light away from the side outline, including capsules" — regra de design
  tirada da Apple. Outline lateral escuro (sombra de lado).

## Processo (o melhor de todos os repositórios)
- Testes de INVARIANTE NUMÉRICA com readback real de GPU (vgpu/node via Dawn): centro opaco,
  canto vazio, deslocamento com sinal correto, cápsula sem highlight lateral, em dpr 1 e 2.
- `vgpu check --require-validation` valida o WGSL no CI.
- Release exige revisão visual em Chromium, Firefox, Safari, Electron + app nativo.
- Regra: "Refine source material definitions rather than adding a user-facing tuning dashboard."

## Reaproveitar
- Canto contínuo Apple (constante + ajuste) como forma "squircle" analítica.
- Highlight só topo/base; outline lateral escuro (double edge!).
- Testes de shader por readback com invariantes — dá para fazer aqui com SwiftShader.
- Referência nativa para comparação visual (fica como pedido ao usuário com Mac).
- Cache de recursos por geometria; mover não regera.

## Evitar
- SVG backdrop-filter como caminho principal (Chromium-only, sem controle de qualidade/tempo).
- Readback + PNG data URL a cada mudança de geometria (latência de ms; morph contínuo seria caro).
