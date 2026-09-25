# `docs/evidence/` — a evidência que o código cita

Cada arquivo aqui é citado por um comentário de código, uma folha de estilo, uma prova, os
créditos dos assets ou o handoff. É a medição que sustenta uma alternativa reprovada, o script
que gerou um asset, ou o log de um achado. **Evidência é congelada:** ela não passa por guarda,
lint nem formatação, e não se edita — se a medição mudar, entra um arquivo novo.

| pasta     | o que guarda                                                   | quem cita                     |
| --------- | -------------------------------------------------------------- | ----------------------------- |
| `glass/`  | medições do vidro: área da lente, textura, aresta, palcos      | `src/ui/shared/glass.mjs`     |
| `styles/` | medições de transição, contraste, faixa e curvas de gesto      | as folhas em `styles/`        |
| `review/` | as reproduções dos achados do primeiro ultrareview             | `tests/browser/walk.mjs`      |
| `assets/` | os scripts que assaram os assets a partir das fontes originais | `assets/CREDITS.md`           |
| `gate/`   | os logs do portão que registram o achado 69                    | `docs/handoff.md`             |

Os scripts de `assets/` leem fontes pesadas que continuam fora do git, hoje em
`tmp/asset-sources/`. Eles citam os caminhos da época em que rodaram, documentam como o asset
foi feito e não rodam a partir de um clone limpo.
