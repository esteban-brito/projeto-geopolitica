# Protótipo da posse em transformação

A tela da posse do Claude (revisão local v2o de 27/09), ligada ao motor do jogo e à
estrutura variável de ministérios. É um ensaio isolado: não entra na partida nem no save.

## Abrir

```bash
node tools/prepare-posse.mjs   # gera tmp/build/posse.html a partir de vendor/posse/
npm run serve
```

- versão em transformação: <http://127.0.0.1:5173/tmp/build/posse.html>;
- original do Claude, para comparar: <http://127.0.0.1:5173/vendor/posse/live.html>.

F5 recomeça a posse do zero.

O runtime do canvas (`vendor/posse/rt/`) não vai para o Git: é código do claude.ai sem licença
declarada, e o repositório é público. Uma cópia está em `tmp/history/posse/rt/`.

## De onde vem cada parte

| caminho                          | o que é                                                                     |
| -------------------------------- | --------------------------------------------------------------------------- |
| `vendor/posse/`                  | a tela do Claude e os retratos; o runtime do canvas fica fora do Git        |
| `tools/prepare-posse.mjs`        | troca trechos da tela original pelas consultas ao motor e à estrutura       |
| `prototypes/posse/browser.mjs`   | a sessão em memória que a tela consulta (`PosseEngine`)                     |
| `prototypes/posse/bridge.mjs`    | traduz partidos e pastas do protótipo para os IDs do motor                  |
| `prototypes/posse/structure.mjs` | junta, extingue, cria, transfere e renomeia pela estrutura de `government/` |
| `prototypes/posse/paths.mjs`     | os caminhos acima, num lugar só                                             |

A fonte da tela é `vendor/posse/project/Posse.dc.html`. Ela foi montada por 15 patches sobre
`Hibrido.dc.html`. A cadeia está em `tmp/history/posse/` e em
`tmp/history/posse-v2o-source.zip`, e em 01/10 remontou o arquivo idêntico byte a byte. Para
remontar, copie a cadeia de volta para `tmp/posse/`: o `patch-v2l.mjs` procura
`tmp/asset-sources/portraits/` a partir dali.

## O que funciona e o que falta

- **Funciona:** a base da abertura vem do motor (`posseOf`); as reformas mudam uma estrutura única
  por IDs e conservam as 152 atribuições; a busca de destino aceita `e`, `ou`, `não` e parênteses.
- **Falta:** depois de qualquer reforma, a estimativa da base fica pendente, porque o valor
  político de uma estrutura variável não tem modelo. Também faltam currículos nas fichas,
  custos, vigência e o rito da medida provisória.

## Provas

```bash
node --test tests/suites/posse-structure.mjs tests/suites/posse-bridge.mjs tests/suites/posse-reforms.mjs
node tests/browser/posse.mjs             # nomeação, foto, F5
node tests/browser/posse-reforms.mjs     # criar, transferir, renomear, desistir
node tests/browser/posse-controls.mjs    # teclado, foco, movimento reduzido
node tests/browser/posse-motion.mjs      # abertura e F5 sem template cru
node tests/browser/posse-comparison.mjs  # original contra transformada, 42 percursos
node tools/audit-posse-ui.mjs            # CSS e métodos de interação contra o original
```

As provas de navegador sobem servidor próprio e gravam em `captures/probes/posse/` e
`tmp/reports/posse/`. Elas ficam fora do `validate`.
