# `docs/evidence/` — a evidência que o código cita

Cada arquivo aqui é citado por um comentário de código, uma folha de estilo ou os créditos dos
assets: é a medição que sustenta uma alternativa reprovada ou o script que gerou um asset.
**Evidência é congelada:** ela não passa por guarda, lint nem formatação, e não se edita. Se a
medição mudar, entra um arquivo novo.

Quando nada vivo cita mais um arquivo, ele vai para `docs/archive/evidence/`. Relatório que se
regenera não entra aqui: os da posse vão para `tmp/reports/posse/`.

| pasta     | o que guarda                                                   | quem cita               |
| --------- | -------------------------------------------------------------- | ----------------------- |
| `glass/`  | medições do vidro: área da lente, textura, aresta, palcos      | `src/ui/core/glass.mjs` |
| `styles/` | medições de transição, contraste, faixa e curvas de gesto      | as folhas em `styles/`  |
| `assets/` | os scripts que assaram os assets a partir das fontes originais | `assets/CREDITS.md`     |

Os scripts de `assets/` leem fontes pesadas que continuam fora do Git, em `tmp/asset-sources/`.
Eles citam os caminhos da época em que rodaram, documentam como o asset foi feito e não rodam a
partir de um clone limpo.
