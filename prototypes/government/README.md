# Experimento de governo variável

Ministérios como estrutura variável: o trabalho do Estado tem identidade própria, e a pasta é só
quem responde por ele. Ensaio isolado, sem consumidor no jogo e sem campo no save. O desenho
está em [governo variável](../../docs/spec/dynamic-government.md); a história, no journal (entradas 103 a 122).

## Os módulos

| arquivo            | o que faz                                                                                     | quem usa           |
| ------------------ | --------------------------------------------------------------------------------------------- | ------------------ |
| `index.mjs`        | criar, juntar, desfazer junção, extinguir, recriar, transferir e renomear, por IDs            | protótipo da posse |
| `competencies.mjs` | as 152 frases da posse v2o como trabalhos com ID; inventário provisório, sem revisão jurídica | protótipo da posse |
| `work-search.mjs`  | busca nas atribuições, com `e`, `ou`, `não`, parênteses e sinônimos declarados                | protótipo da posse |

Os ensaios de 29 e 30/09 (`pilot`, `operations`, `demand`, `management`) saíram em 01/10: eram um
motor de capacidade paralelo à MALHA, com unidades inventadas e nenhum consumidor. As ideias
estão no contrato; o código, no histórico do Git.

## Provas e comandos

```bash
node --test tests/suites/government-*.mjs       # 24 provas, incluídas no npm test
node tools/import-posse-work.mjs --output tmp/reports/competencies.mjs
```

As medições de 30/09 dos ensaios apagados ficam congeladas em
`docs/evidence/government-*-2026-09-30.json`. O importador lê
`vendor/posse/project/Posse.dc.html`; sem `--output`, reescreve `competencies.mjs`.

## O que falta antes de integrar

- revisão independente: a tentativa de 30/09 não chegou a analisar nada;
- decomposição jurídica das 152 frases; hoje uma frase pode juntar papéis diferentes;
- valor político de uma estrutura variável, sem que fatiar pastas fabrique apoio;
- currículos gerados por semente e preparo calculado pela evidência;
- rito da medida provisória, com vigência e perda de eficácia.
