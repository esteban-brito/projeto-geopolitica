# Organização do trabalho da posse

> Ordem do Diretor em 30/09/2026: organização é a prioridade atual. Novas funcionalidades
> ficam suspensas enquanto este lote é executado. Este documento planeja a manutenção;
> a fila e o estado verificado continuam somente no [handoff](../handoff.md).

**Fechado em 01/10.** Parte foi feita em 30/09 ([checkpoint](../evidence/workspace-organization-checkpoint-2026-09-30.md))
e o resto em 01/10 ([registro com hash](../evidence/workspace-organization-close-2026-10-01.json)).
Duas mudanças em relação ao texto abaixo:

- a versão gerada da posse saiu de `prototypes/posse/index.html` para `tmp/build/posse.html`.
  Na pasta versionável, a guarda `tokens` lia o CSS do protótipo e dava 43 achados; a saída é
  regenerável e não precisa de Git;
- `tmp/posse/` foi movida inteira para `tmp/history/posse/` (86 arquivos), e os 33 registros
  soltos de 30/09 para `tmp/history/recovery-2026-09-30/`. Nada foi apagado. A cadeia de
  montagem remontou `Posse.dc.html` idêntico antes da mudança.

## Problemas confirmados antes de alterar arquivos

1. Fonte visual, runtime e retratos usados pelo protótipo estão em `tmp/posse/`, ignorado
   pelo Git. Código durável em `prototypes/posse/` depende dessa pasta temporária.
2. Cinco suítes de testes estão em `prototypes/government/`; um arquivo de `tests/suites/`
   apenas as importa. Importador e três comandos de demonstração também estão junto aos módulos.
3. Cinco provas de navegador e a auditoria estática sobrescrevem relatórios datados em
   `docs/evidence/`, embora o mapa dessa pasta declare que medições são congeladas.
4. `captures/posse/` e uma captura solta na raiz estão fora das seis categorias previstas
   em `captures/README.md`. Os geradores continuam escrevendo nesse arranjo.
5. Logs e arquivos de revisão ficam soltos em `tmp/`. Há código antigo de montagem,
   protótipos anteriores e provas históricas misturados à página usada hoje.
6. Guias ativos ainda descrevem parte desse histórico como local de desenvolvimento.
   Resultado anterior, contrato e fila precisam ter papéis distinguíveis.

O inventário inicial desta organização encontrou 669 arquivos regulares fora de `.git/`
e `node_modules/`. A Área de Trabalho já tem `cld`, `cld-backups` e `desktop.ini`.
O estudo anterior dos cinco backups permanece válido enquanto seus hashes forem iguais.

## Distribuição desejada

| Local                                            | Responsabilidade                                                   | Regra                                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `src/`, `styles/`, `assets/`                     | Jogo existente                                                     | Preservar neste lote; não integrar o protótipo durante a arrumação.                   |
| `prototypes/posse/`                              | Página experimental gerada, fachada, projeções e caminhos da posse | Uma entrada atual, gerada exclusivamente da fonte preservada.                         |
| `prototypes/government/`                         | Módulos e casos sintéticos usados pela transformação               | Sem comandos de terminal ou suítes de teste misturados aos módulos.                   |
| `vendor/posse/`                                  | Artefato visual importado do Claude, runtime e retratos            | Preservar bytes e nomes do pacote importado; não formatar ou reescrever sua UI.       |
| `tests/suites/`                                  | Provas unitárias                                                   | Descobertas diretamente por `npm test`; mesmas asserções.                             |
| `tests/browser/`                                 | Provas reais dos gestos                                            | Consultar os caminhos atuais; escrever resultados temporários.                        |
| `tools/`                                         | Servidor, preparação, auditoria, importação e demonstrações        | Comandos em inglês e kebab-case; sem novas dependências.                              |
| `docs/spec/`                                     | Contratos e desenho do jogo/protótipo                              | Separar intenção de implementação; estado atual aponta para o handoff.                |
| `docs/evidence/`                                 | Medições e auditorias encerradas, fonte ZIP de procedência         | Conservar os resultados datados; futuras rodadas não os sobrescrevem.                 |
| `docs/archive/` e `tmp/history/`                 | Planos superados e material de trabalho histórico                  | Preservar autoria, conteúdo único e caminhos registrados na época.                    |
| `captures/probes/posse/`                         | Capturas regeneráveis das provas da posse                          | Geradores e mapa concordam com a localização.                                         |
| `tmp/reports/posse/`                             | Relatórios da rodada atual                                         | Nomes por função, sem datas históricas fixas.                                         |
| `tmp/serve/`                                     | Saída do servidor ativo                                            | Não mover log com processo escrevendo; mudar destino numa reinicialização controlada. |
| `tmp/asset-sources/`, `tmp/agents/`, `tmp/base/` | Fontes pesadas, canal existente e reproduções anteriores da base   | Manter; não classificar como lixo só pelo nome da pasta.                              |
| `C:/Users/esteb/Desktop/cld-backups`             | Cinco backups históricos únicos                                    | Preservar e conferir hashes; não criar outro projeto na Área de Trabalho.             |

## Lotes e alvos

### 1. Fonte durável e caminhos

- Copiar com verificação de hash `tmp/posse/live.html`, `project/`, `rt/` e
  `avatar-standard.json` para `vendor/posse/`. É uma transição: só retirar os caminhos
  antigos depois de provar as entradas novas e os dois links antigos.
- Gerar a versão experimental em `prototypes/posse/index.html`.
- Criar um único catálogo de caminhos em `prototypes/posse/paths.mjs`, consultado por
  preparação, navegador, provas e auditoria.
- Resolver os assets relativos da versão gerada pela origem importada, conservando
  CSS, retratos, ícones, duração, curvas e funções de interação.
- No servidor local, conservar `/tmp/posse/live.html` e `/tmp/posse/engine.html` como
  caminhos de compatibilidade para os arquivos atuais, sem manter duas fontes divergentes.
- Conservar o HTML experimental anterior como registro da migração em `tmp/history/posse/`.
  Material antigo de montagem permanece ali, separado da entrada usada hoje.

### 2. Provas e comandos nos locais canônicos

| Origem                                        | Destino                                  |
| --------------------------------------------- | ---------------------------------------- |
| `prototypes/government/government.test.mjs`   | `tests/suites/government-structure.mjs`  |
| `prototypes/government/pilot.test.mjs`        | `tests/suites/government-pilot.mjs`      |
| `prototypes/government/operations.test.mjs`   | `tests/suites/government-operations.mjs` |
| `prototypes/government/demand.test.mjs`       | `tests/suites/government-demand.mjs`     |
| `prototypes/government/management.test.mjs`   | `tests/suites/government-management.mjs` |
| `prototypes/government/seed-competencies.mjs` | `tools/import-posse-work.mjs`            |
| `prototypes/government/operations-demo.mjs`   | `tools/demo-government-operations.mjs`   |
| `prototypes/government/demand-demo.mjs`       | `tools/demo-government-demand.mjs`       |
| `prototypes/government/management-demo.mjs`   | `tools/demo-government-management.mjs`   |

Recalcular apenas imports relativos e referências JSDoc da mudança de diretório.
Conferir o corpo dos cinco testes antes/depois descontando somente esses caminhos.
Retirar o antigo `government.mjs` de `tests/suites/` depois de confirmar que as cinco suítes são
descobertas diretamente e a contagem de provas permanece a mesma. Esse arquivo contém
somente imports; nenhuma asserção sai. O importador passa a ler a fonte preservada inteira,
em vez de um fragmento intermediário. As 152 entradas devem permanecer idênticas.

### 3. Resultados, capturas e histórico

- Mover `captures/posse/` para `captures/probes/posse/`; atualizar os cinco geradores.
- Mover `captures/world-ask-post.png` para `captures/probes/world/` e atualizar seu gerador.
- Relatórios atuais: `reset.json`, `comparison.json`, `reforms.json`, `motion.json`,
  `controls.json`, `ui-audit.json`, `ui-audit.md` e `ui-diff.patch` em `tmp/reports/posse/`.
- A auditoria atual deve usar a data da rodada, sem se passar pela medição de 30/09.
  Relatórios encerrados de `docs/evidence/` conservam seus bytes.
- Logs encerrados e material da revisão anterior passam para uma subpasta de
  `tmp/history/`; o manifesto registra origem, destino e hashes.
- Não apagar captura de defeito, decisão aberta, retrato aprovado, fonte de asset,
  backup com versão única ou script histórico apenas por parecer antigo.
- Excluir somente redundância confirmada: arquivo idêntico com fonte retida identificada,
  ou saída substituída que tenha contrato explícito de regeneração. A lista de exclusão
  precisa constar no manifesto antes da retirada. Não apagar por extensão ou por idade.

### 4. Documentação e navegação

- Atualizar `README.md`, os dois READMEs dos módulos, `docs/agent-brief.md`,
  `docs/evidence/README.md`, `captures/README.md` e referências ativas aos comandos movidos.
- Marcar os retratos anteriores de `dynamic-government.md`, `government-pilot.md` e
  `plan-audit.md` como históricos, apontando o estado atual para o handoff.
- Preservar registros datados do journal, ciclos, pesquisas e evidências. Eles não são
  guias de execução atuais; seus caminhos antigos ficam explicados no manifesto.
- Não renomear pastas corretas nem criar outro documento de retomada. Este plano é a
  manutenção solicitada; o handoff é a entrada operacional única.

## Dependências e proteção

Antes de cada movimento, conferir caminho absoluto dentro de `cld`, arquivo regular,
destino inexistente e hash. Não mover atalhos ou diretórios de ferramenta por varredura.
Preservar alterações locais existentes. Movimentos rastreados permanecem sem commit;
não fazer push, não publicar nem limpar o Git.

O manifesto de planejamento lista todos os arquivos elegíveis e classifica os demais.
O registro de execução será separado: decisão planejada não será marcada como realizada.
Campos de medição em evidências antigas não serão reinterpretados como resultado novo.

## Provas necessárias para encerrar

1. Hashes da fonte do Claude, runtime e assets iguais aos anteriores.
2. Corpos das cinco suítes preservados; importador conserva todas as entradas do inventário.
3. Imports, links e contratos JSDoc válidos; nenhuma guarda ou expectativa enfraquecida.
4. Páginas novas e links antigos respondem; runtime e imagens carregam nas duas versões.
5. Comparação da UI, F5, movimento, teclado, nomeações e reformas passa nas duas alturas.
6. Executar `validate`; conferir que relatórios datados antigos conservaram seus hashes.
7. Registrar execução no journal e escrever o handoff por último, incluindo limites ou
   arquivo que não pôde ser retirado. Novas funcionalidades continuam fora deste lote.
