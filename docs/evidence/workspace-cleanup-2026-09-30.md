# Organização do repositório e da Área de Trabalho — 30/09/2026

A Área de Trabalho contém agora `cld`, `cld-backups` e o arquivo oculto `desktop.ini`,
que pertence ao Windows. Os cinco backups foram organizados sem apagar histórico:
356.579.535 bytes preservados, com SHA-256 conferido antes e depois da movimentação.
Os arquivos comprimidos foram lidos por membro, sem extrair outro projeto na Área de Trabalho.
Os bundles Git foram verificados. Existem versões e documentos únicos nesses backups.

| Arquivo em `C:/Users/esteb/Desktop/cld-backups` | Bytes |
| --- | ---: |
| cld-backup-2026-09-26.bundle | 18.294.811 |
| cld-gov-prework-2026-09-28.bundle | 18.212.094 |
| cld-gov-prework-2026-09-28.tar.gz | 82.041.612 |
| cld-posse-2026-09-26.tgz | 33.800.969 |
| cld-session-2026-09-29-pre-shutdown.tar.gz | 204.230.049 |

`LEIA.md` nessa pasta explica o conteúdo e a restauração em uma pasta separada.
São registros históricos anteriores às correções atuais; não são um backup desta entrega.

Foram retirados **182 arquivos, 45.771.001 bytes**: cópias extraídas e ZIP redundante
com conteúdo conservado no backup de 29/09; capturas duplicadas; resumos e scripts temporários
da recuperação; diagnósticos superados pelas provas finais. As 12 capturas redundantes de
movimento eram idênticas, por hash, às quatro capturas finais de F5 mantidas. O diff completo
passou de `tmp/` para [evidência permanente da comparação](posse-ui-line-diff-2026-09-30.patch).

O rascunho de arquitetura de 28/09 foi preservado sem mudança de conteúdo em
[arquivo histórico](../archive/dynamic-government-design-2026-09-28.md), e suas referências
foram atualizadas. A autoridade atual continua em [governo variável](../spec/dynamic-government.md)
e [aplicação no protótipo](../spec/government-pilot.md#11-transformar-o-protótipo-da-posse--execução-em-3009).

`tmp/posse/`, os retratos, as referências visuais, os cenários, os resultados históricos,
o Git, as ferramentas e as evidências atuais foram conservados. `live.html`,
`project/Posse.dc.html` e `dc-runtime.js` têm o mesmo SHA-256 do inventário anterior à recuperação.
O original do Claude está intacto. A correção autorizada dos IDs dos dados de teste e seu diff
permanecem registrados; as asserções foram conservadas.

O [registro detalhado](workspace-cleanup-2026-09-30.json) contém o inventário anterior,
hashes, grupos idênticos, membros dos arquivos comprimidos, movimentos, exclusões realizadas
e o resumo posterior em `post_cleanup`. A lista completa dos alvos foi conferida antes da
retirada; arquivos rastreados, atalhos e fontes ativas foram protegidos. A última retirada
usou caminhos literais de arquivos, sem exclusão recursiva.
