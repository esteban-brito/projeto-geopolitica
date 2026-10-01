# Experimento de governo variável

Ministérios como estrutura variável: o trabalho do Estado tem identidade própria, e a pasta é só
quem responde por ele. Ensaio isolado, sem consumidor no jogo e sem campo no save. O desenho
está em [governo variável](../../docs/spec/dynamic-government.md) e no
[piloto](../../docs/spec/government-pilot.md); a história, no journal (entradas 103 a 122).

## Os módulos

| arquivo                | o que faz                                                                                     | quem usa           |
| ---------------------- | --------------------------------------------------------------------------------------------- | ------------------ |
| `index.mjs`            | criar, juntar, desfazer junção, extinguir, recriar, transferir e renomear, por IDs            | protótipo da posse |
| `competencies.mjs`     | as 152 frases da posse v2o como trabalhos com ID; inventário provisório, sem revisão jurídica | protótipo da posse |
| `work-search.mjs`      | busca nas atribuições, com `e`, `ou`, `não`, parênteses e sinônimos declarados                | protótipo da posse |
| `pilot.mjs`            | quem conduz, executa e regula cada trabalho; preparo por episódio conhecido, sem nota         | só provas          |
| `pilot-cases.mjs`      | sete trabalhos de Direitos Humanos, Saúde e Defesa, quatro currículos e cinco instituições    | só provas          |
| `operations.mjs`       | filas, equipes, verba e repasses em períodos e unidades sintéticos                            | só provas e demos  |
| `operations-cases.mjs` | abertura sintética das quatro escolhas do piloto                                              | só provas e demos  |
| `demand.mjs`           | entrada contínua de trabalho e recebimento de verba                                           | só provas e demos  |
| `management.mjs`       | agenda do ministro por experiência ou por ordem presidencial; consulta que gasta equipe       | só provas e demos  |

Só os três primeiros chegam a uma tela. Os demais são unidades e períodos inventados, sem
calibragem brasileira; não provam equilíbrio nem qualidade de gestão.

## Provas e comandos

```bash
node --test tests/suites/government-*.mjs       # 84 provas, incluídas no npm test
node tools/demo-government-operations.mjs       # as quatro escolhas e o contrafactual
node tools/demo-government-demand.mjs           # cinco cenários de demanda
node tools/demo-government-management.mjs       # quatro agendas de gestão
node tools/import-posse-work.mjs --output tmp/reports/competencies.mjs
```

As demonstrações imprimem no terminal; com um caminho como argumento, gravam nele. As medições
de 30/09 estão congeladas em `docs/evidence/government-*-2026-09-30.json`: não grave por cima.
O importador lê `vendor/posse/project/Posse.dc.html`; sem `--output`, reescreve
`competencies.mjs`.

## O que falta antes de integrar

- revisão independente: a tentativa de 30/09 não chegou a analisar nada;
- decomposição jurídica das 152 frases; hoje uma frase pode juntar papéis diferentes;
- valor político de uma estrutura variável, sem que fatiar pastas fabrique apoio;
- currículos gerados por semente e preparo calculado pela evidência;
- rito da medida provisória, com vigência e perda de eficácia.
