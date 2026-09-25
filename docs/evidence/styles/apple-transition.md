# Transições de Tela: Padrão Apple (HIG/SwiftUI) e View Transitions no Chrome
## 1. Física e Diretrizes da Apple (SwiftUI & HIG)
- SwiftUI Default Spring (iOS 17+, macOS 14+, visionOS): response: 0.55s, dampingFraction: 1.0
  (criticamente amortecida, sem oscilação; developer.apple.com/documentation/swiftui/animation/spring).
- Curva CSS equivalente: cubic-bezier(0.32, 0.72, 0, 1) ou cubic-bezier(0.25, 1, 0.5, 1); duração: 280–320ms.
- HIG Motion & Navigation: Chrome (dock/barras) é âncora espacial fixa; nunca pisca, some ou atrasa
  em relação ao conteúdo. O conteúdo muda por cross-dissolve (opacidade) + leve escala (0.98→1) ou slide.
- Proibição de blur em tela inteira: a Apple NUNCA aplica filter: blur() na viewport durante transições.
  Desfoque é efeito estático de profundidade (backdrop-filter), jamais animador de troca de página.
## 2. Armadilhas de View Transitions no Chromium (developer.chrome.com / W3C)
- filter: blur() animado nos pseudo-elementos (::view-transition-old/new): força o Skia a gerar offscreen
  buffers gigantes a cada quadro (1920×937 = ~28MB VRAM em DPR 2). Gera jank e edge-bleeding severo
  (o fundo vaza pelas bordas, criando a "faixa laranja" ou halos leitosos). developer.chrome.com/docs/web-platform/view-transitions.
- backdrop-filter dentro de elemento nomeado: congela o snapshot estático no momento t=0; não desfoca
  o fundo vivo durante o movimento, gerando placas opacas fantasma e artefatos de blend mode.
- position: fixed: cria novo containing block se houver transform/filter no pai, deslocando a caixa da transição.
- Excesso de grupos nomeados: nomear desk, board, dock, rail, backdrop, topbar e root cria 6+ camadas
  paralelas de rasterização, multiplicando o tempo de GPU e provocando engasgos de sincronia.
- :only-child vs Transition Types: usar :only-child para inferir direção sem active-view-transition-type
  pode colapsar estilos se o DOM sofrer renderizações concorrentes. developer.chrome.com/blog/view-transitions-update.
## 3. Como Interfaces de Alto Nível (Linear, Arc, Apple.com) Fazem Sidebar ↔ Dock
- Linear & Arc: NUNCA morfam sidebar em dock. Tratam chrome como ancoragem: a sidebar colapsa
  lateralmente (translateX(-100%) ou largura 240px→0 com cubic-bezier(0.2, 0, 0, 1) em 180–220ms).
- Apple.com & visionOS: Transições de tela usam fade puro (opacity 0→1) em 200–300ms, sem neblina de blur.
- O chrome não atrasa: sidebar e conteúdo movem-se no mesmo compasso temporal (sem delays de 160ms).
