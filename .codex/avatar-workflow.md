# Padrão dos retratos da posse

Fonte de verdade: `vendor/posse/avatar-standard.json` (a cópia de 26/09 em `tmp/posse/` foi arquivada em 01/10; antes, movido de `.codex/` para a montagem do
protótipo não depender desta pasta). A folha original aprovada está em
`tmp/asset-sources/portraits/posse-approved-sheet.png` (SHA-256
`a8a6250c9b0ccb1df10dda0b102063f9c17573832dd2411d041c1aca53221e6d`).
O arquivo em `tmp/history/posse/codex/avatar-approved-reference.png` é só a cópia usada pelo piloto.
Uma segunda folha foi aprovada sem refinamentos e está em
`tmp/asset-sources/portraits/posse-approved-sheet-b.png`; suas seis posições estão no JSON.
O protótipo usa os três homens e as três mulheres de cada folha, totalizando seis opções
por sexo. `tmp/history/posse/patch-v2l.mjs` aplicava o catálogo ao arquivo `project/Posse.dc.html`.

## Medidas aprovadas

- Folha: 1536 × 1024 px, grade de 3 colunas × 2 linhas, células de 512 × 512 px.
- Retrato na interface: círculo; `background-size: 330% 220%`, equivalente a zoom 1,10 da célula.
- Tamanhos conferidos: 148, 64, 56, 52 e 32 px. A cerimônia usa também 168 px.
- A imagem do busto deve alcançar a borda inferior do círculo; rosto centralizado na horizontal.

| Índice | Centro do rosto na folha (px) | `background-position` aprovado |
| ------ | ----------------------------: | -----------------------------: |
| 1      |                 287,9 × 236,7 |                        `5% 4%` |
| 2      |                 771,2 × 245,2 |                       `50% 4%` |
| 3      |                1248,3 × 233,7 |                       `95% 4%` |
| 4      |                 279,0 × 746,0 |                       `4% 92%` |
| 5      |                 767,5 × 741,5 |                      `50% 92%` |
| 6      |                1271,3 × 744,4 |                      `97% 92%` |

Os centros são medições aproximadas de pixels de pele, não pontos anatômicos exatos. As
posições CSS foram aprovadas visualmente pelo usuário e prevalecem sobre a medição.

## Próximas folhas

1. Pedir sempre a mesma grade, resolução, proporção de busto e estilo desta folha.
2. Executar `node .codex/avatar-batch-review.cjs "caminho/da/folha.png"` na raiz do repositório.
   O comando aceita várias folhas no mesmo lote.
3. Abrir a `contact.png` e o `report.json` gerados em `tmp/reports/avatar-reviews/<hash>/`.
   O contato mostra os seis retratos nos tamanhos reais; o relatório aponta problemas de
   detecção, centralização e altura. Para folhas novas, o centro horizontal é estimado
   automaticamente; a posição vertical mantém a referência aprovada.
4. Conferir o contato inteiro e investigar os retratos sinalizados. A checagem geométrica não
   reconhece mãos deformadas, estilo divergente ou dois rostos parecidos. Se a folha for aceita,
   guardar seu PNG original em `tmp/asset-sources/portraits/`, com hash e posições aprovadas no JSON,
   antes de usar no jogo. As fontes não vão para `assets/`, que é pasta do jogo.

O piloto atual lê o JSON acima. O padrão não depende de lembrar coordenadas de uma conversa.
