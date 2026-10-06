# Liquid Glass Lab — instruções para o agente

Protótipo independente. Não tem relação de código com o jogo da branch `main`; não leve nada
daqui para lá sem pedido explícito.

## Leia nesta ordem

1. `README.md` — como rodar e o estado atual (o que está pronto, o que falta);
2. `docs/research/01-engenharia-reversa.md` — decisões por subsistema e o plano V0→V5. A §11 traz
   a revisão após a pesquisa externa; uma decisão marcada ⚠ foi corrigida pela medição.

## Regras

- **Português na prosa e na interface; inglês no código.**
- **Equilíbrio entre qualidade e desempenho** é o critério: uma técnica entra se a diferença
  aparece numa captura lado a lado e o custo cabe no orçamento medido.
- **A física mora na CPU uma vez** (`src/glass/optics.ts`); o shader lê, não reimplementa. Se o
  WGSL precisar de uma conta nova, ela ganha espelho em TS e teste de paridade.
- **Nada é criado ou destruído por quadro** (texturas, buffers, bind groups): pool e cache.
- **HTML-in-Canvas só dentro do seu adaptador** de `BackgroundSource`; nenhuma chamada da API
  escapa dele.
- **Sugestões de pesquisa externa** passam por comparar → testar → medir → decidir, nunca entram
  direto.

## Fluxo

```bash
npm run check      # tipos
npm test           # óptica por readback; tem de ficar verde
node tests/capture.mjs   # olhe os PNGs em captures/ — o teste não sabe olhar
```

Mexeu em material ou shader? Gere as capturas e **abra** as imagens antes de dizer que está
pronto. Neste contêiner o WebGPU é SwiftShader: tempos não valem nada, e o canvas da página do
laboratório perde a GPU (é do ambiente; os testes usam o modo `offscreen`).
