---
name: passeio
description: Executa o teste de navegação real via Playwright em 1440x980 e 1440x900 para inspecionar cortes, sobreposições e gerar capturas.
---

# /passeio — Teste de Geometria e Capturas Visuais

Executa o navegador headless Chromium nas duas resoluções de referência:

- `1440-980` (desktop padrão)
- `1440-900` (altura limite que esconde elementos na dobra)

## Procedimento

1. Execute no terminal:
   `npm run walk`
2. Inspecione visualmente as imagens geradas em `captures/passeio/`.
3. Verifique se há cortes de texto, deformações nas sombras ou elementos desalinhados na mesa.
