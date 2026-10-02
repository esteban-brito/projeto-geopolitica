# Organização — checkpoint para desligamento em 30/09/2026

**Pausado expressamente pelo Diretor.** A última ordem foi parar o trabalho e somente
atualizar os registros para continuar amanhã. Não retomar implementação nesta noite.
Organização é a prioridade; funcionalidades novas da posse permanecem suspensas.
O estado operacional é mantido no [handoff](../../handoff.md).

O [plano](../organization-plan-2026-09-30.md) descreve o destino desejado. O
[manifesto inicial](workspace-organization-plan-2026-09-30.json) contém 166 ações planejadas,
caminhos, hashes anteriores e arquivos protegidos. Ele não é uma lista de ações realizadas.
O [registro observado](workspace-organization-checkpoint-2026-09-30.json) distingue cópia,
arquivo ainda presente, movimento, arquivamento e ação não executada, por arquivo.

## O que foi realizado

- Copiados dez arquivos importados para `vendor/posse/`: original `live.html`,
  `avatar-standard.json`, dois retratos na raiz, cinco arquivos de `project/` e o runtime.
  Conteúdo preservado por SHA-256; originais continuam em `tmp/posse/`.
- Criado `prototypes/posse/paths.mjs`, catálogo comum de fonte, referência, entrada,
  runtime, capturas e relatórios. Não contém regra de jogo.
- `tools/prepare-posse.mjs` agora lê `vendor/posse/project/Posse.dc.html` e gera
  `prototypes/posse/index.html`. A página foi gerada. A base relativa dos assets aponta
  para `vendor/posse/`; CSS e métodos de interação continuam sendo os do Claude.
- `prototypes/posse/browser.mjs` consulta o novo caminho do runtime.
- `tools/serve-static.mjs` ganhou compatibilidade para os dois links antigos. O servidor
  principal ainda não foi reiniciado; o código novo será carregado na próxima inicialização.
- `.prettierignore` exclui somente o HTML gerado da posse: formatá-lo separadamente
  quebraria a igualdade com a fonte. O gerador permanece sujeito à formatação normal.
- Movidas as cinco suítes e quatro comandos conforme a tabela abaixo. As versões anteriores
  e o proxy de imports estão em `tmp/history/government-before-organization/`, com os bytes
  anteriores preservados. Nenhuma asserção foi retirada.
- O importador passou a ler a fonte completa preservada. O comentário de reprodução em
  `prototypes/government/competencies.mjs` aponta para o comando novo; os dados não mudaram.
- Movidas 36 capturas para `captures/probes/posse/` e a imagem solta para
  `captures/probes/world/world-ask-post.png`. As provas atualizam suas capturas regeneráveis.
- Os cinco scripts de navegador consultam o catálogo de caminhos. Seus relatórios passam
  a `tmp/reports/posse/`. A auditoria escreve ali `ui-audit.json`, `ui-audit.md` e
  `ui-diff.patch`, sem sobrescrever medições encerradas em `docs/evidence/`.
- READMEs dos dois protótipos receberam aviso de migração incompleta. A revisão integral
  desses guias ainda não foi feita. A memória do Codex registra a última ordem.

| Anterior em `prototypes/government/` | Atual na raiz do projeto |
| --- | --- |
| `government.test.mjs` | `tests/suites/government-structure.mjs` |
| `pilot.test.mjs` | `tests/suites/government-pilot.mjs` |
| `operations.test.mjs` | `tests/suites/government-operations.mjs` |
| `demand.test.mjs` | `tests/suites/government-demand.mjs` |
| `management.test.mjs` | `tests/suites/government-management.mjs` |
| `seed-competencies.mjs` | `tools/import-posse-work.mjs` |
| `operations-demo.mjs` | `tools/demo-government-operations.mjs` |
| `demand-demo.mjs` | `tools/demo-government-demand.mjs` |
| `management-demo.mjs` | `tools/demo-government-management.mjs` |

`tests/suites/government.mjs` era somente cinco imports e saiu da descoberta ativa para
o mesmo arquivo histórico. As suítes são descobertas diretamente por `npm test`.

## Verificações desta migração

- `npm.cmd test`: **531 passaram, zero falhas**. Log em `tmp/reports/posse/unit.log`.
- Os cinco corpos de teste são iguais ao original descontando somente os imports/JSDoc
  relativos. A comparação de hash está no registro observado.
- `node tools/import-posse-work.mjs --output tmp/reports/posse/import-check.mjs`:
  38 cargos e 152 atribuições; comparação profunda com o catálogo existente passou.
- `node tools/audit-posse-ui.mjs`: dois blocos, 159 linhas de CSS idênticas, HTML inteiro
  conferido, 47 blocos do diff anotados. Acrescentada a base de assets à adaptação de entrada.
- `node tests/browser/posse-comparison.mjs`: **42 percursos agrupados passaram**,
  original e nova entrada em 1440×980/900; nenhum erro ou recurso local ausente no resultado.
- As quatro páginas antigas/novas, dois retratos e o runtime responderam HTTP 200 em 5173.
- As 50 evidências congeladas anteriores conservaram seus hashes. Os cinco backups
  históricos e seu README em `Desktop/cld-backups/` também conservaram os hashes.

**Não foi repetido `validate` após a organização.** O portão completo registrado na
recuperação anterior é histórico. Tipos, lint, formato, links, passeio, macaco e as provas
específicas restantes precisam ser conferidos após concluir este lote. Não declarar o lote pronto.

## Correções ao planejamento e ocorrências

1. As folhas de retratos da raiz eram iguais às de `project/`, mas a página original
   usa caminhos relativos diferentes. A primeira comparação encontrou dois 404. Foram
   copiadas também para a raiz de `vendor/posse/`; a repetição passou. A exclusão planejada
   foi cancelada e nenhum desses arquivos foi apagado.
2. A revisão automática rejeitou os comandos de retirada dos originais dos testes/comandos
   e do proxy, com o motivo disponibilizado `blocked by policy`. Foi adotado arquivamento
   conservador por caminhos explícitos, que terminou. Não há pedido de permissão pendente.
3. Durante a migração dos destinos da auditoria, uma execução ainda escreveu no Markdown
   antigo. O arquivo foi restaurado integralmente e seu hash anterior conferido. A saída
   nova foi corrigida; todas as 50 evidências anteriores estão intactas no checkpoint.
4. A procura não encontrou gerador ativo de `world-ask-post.png`. A imagem foi preservada
   e movida; corrigir a menção a um gerador no plano quando revisar sua documentação.

## O que ainda não foi feito

- Arquivar a pasta antiga `tmp/posse/`, montadores históricos e logs soltos. Os 109
  arquivamentos previstos dessa parte do manifesto não foram executados. Não apagar essa
  pasta: ainda conserva a origem e atende os links do servidor principal carregado antes da mudança.
- Reiniciar o servidor principal para ativar os aliases e provar os links antigos com o
  servidor novo. As provas de navegador usam servidores próprios e testaram as entradas novas.
- Repetir `posse.mjs`, `posse-motion.mjs`, `posse-controls.mjs` e `posse-reforms.mjs` nos
  caminhos migrados. A comparação geral passou; não substitui essas quatro provas.
- Formatar os arquivos modificados e checar tipos/lint/links. Os imports rebased podem
  exigir quebra de linha; não formatar fonte importada nem o HTML gerado.
- Atualizar integralmente os READMEs, mapas de capturas/evidências e o guia do agente;
  distinguir estado histórico e atual nos planos citados. Os avisos atuais apontam esta lacuna.
- Conferir resultados e hashes, executar `validate` e registrar o fechamento da organização.
  Revisão independente dos sistemas permanece pendente, com a tentativa anterior limitada
  pela cota do Claude. Não repetir sem mudança externa.

## Estado dos processos e retomada

No fechamento, não havia teste, migração ou validação em execução. Ficou somente o servidor
local Node PID 3244, porta 5173, com logs `tmp/serve-recovery-20260930.log` e `.err.log`.
Não foi reiniciado nem teve seus logs movidos. Desligar o PC encerra esse servidor.
Remote Control estava conectado anteriormente em `DESKTOP6`; não foi revalidado neste
fechamento. O pareamento do iPhone continua sem confirmação, e nenhum código foi persistido.

Ao retomar, ler `docs/agent-brief.md`, estado/fila/decisões do handoff, este checkpoint e
`git status --short`. Não repetir o estudo integral, a limpeza anterior ou as exclusões do
manifesto sem considerar suas correções. O trabalho é local, com arquivos novos ainda não
adicionados ao Git; nenhum commit, push ou publicação foi feito.

Para abrir após ligar o PC: `npm.cmd run serve`. Entradas atuais:
`http://127.0.0.1:5173/vendor/posse/live.html` e
`http://127.0.0.1:5173/prototypes/posse/index.html`. Os links antigos
`/tmp/posse/live.html` e `/tmp/posse/engine.html` devem continuar disponíveis pelo alias;
conferir essa compatibilidade antes de mover a origem antiga.

O foco da transformação não mudou: estrutura flexível por IDs e palavras-chave, retirada
de precedentes históricos e UI do Claude preservada. Currículos nas fichas, propostas,
vínculos institucionais, custos, vigência, consequências e apoio variável seguem pendentes;
nenhuma funcionalidade dessas foi implementada neste lote de organização.
