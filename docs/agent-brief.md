# Guia compacto para agentes

> Estudo consolidado em 23/09/2026 a pedido do usuário, para economizar contexto e cota
> nas próximas sessões. Leia este guia uma vez e consulte as fontes por necessidade.
> Estado e fila atualizados continuam exclusivamente em [handoff.md](handoff.md).

## Retomar sem estudar tudo de novo

1. Leia este arquivo e confira `git status --short`, preservando alterações existentes.
2. Leia somente Estado, Fila e Decisões vivas do handoff; procure ali os achados da tarefa.
3. Antes de editar, consulte os contratos aplicáveis em [CLAUDE.md](../CLAUDE.md),
   [co-development.md](../.agents/rules/co-development.md) e [standards.md](standards.md).
4. Abra o código e as provas do assunto. Leia o ciclo específico se precisar da intenção.
5. Consulte pesquisas e histórico apenas para uma dúvida concreta. Para o journal,
   prefira busca dirigida ou as últimas 150 linhas, conforme o contrato local.

Não inventarie nem releia todos os documentos em toda abertura. Não execute o portão ou
uma simulação apenas para se ambientar. Não crie outra documentação de retomada paralela.
Atualize este guia quando a arquitetura mudar; mantenha progresso e medições no handoff.

## O jogo e a intenção

Simulador de presidência brasileira: mandato de 05/01/2027 a 05/01/2031 (achado 70), hoje jogado
em 48 turnos mensais; a [especificação mestra](spec/master-spec.md) leva o avanço para a semana.
Governar significa escolher prioridades sob restrições herdadas e pagar as consequências.
O rito e o custo de uma decisão vêm do seu conteúdo. Liberdade com preço é a direção de
design; não é uma afirmação de que toda liberdade planejada já exista no código.

O jogador distribui recursos entre 38 programas de oito áreas, negocia com nove partidos
(513 cadeiras), altera pisos e tetos legais e dispõe de seis alavancas de propriedade/poder.
Personagens fictícios, gerados pela semente, têm ambições, influência e memória. Serviços
demoram a responder; prometer não equivale a pagar; aprovar não equivale a entregar.

O mandato termina por prazo ou afastamento. O fecho mostra o país deixado, leis e promessas;
não há uma pontuação única que defina bom governo. Sobreviver não prova que a estratégia
produziu um país melhor. Testes verdes tampouco provam equilíbrio ou ausência de exploits.

O mundo se inspira no Brasil; pessoas são fictícias. Valores reais exigem fonte e data.
As pesquisas contêm propostas, afirmações a conferir e decisões superadas: não são prova
jurídica nem descrição automática da implementação atual.

## Contratos essenciais

- Site estático, ESM de navegador, sem build nem dependências de runtime. Ferramentas de
  desenvolvimento estão em `package.json`.
- Domínio puro: sem DOM, relógio ou `Math.random`. RNG com semente e posição persistida.
  Motores não chamam outros motores: a aplicação define a composição e sua ordem.
- A interface consulta a mesma conta usada pelo motor, sem segunda previsão, e mostra o que a
  Presidência sabe, nunca o estado oculto (especificação §6.1, invariante 21).
- Português na interface e na prosa; inglês em código, identificadores e caminhos.
- Não alterar testes/guardas ou calibragem para fazer validação passar; não remover contratos
  JSDoc. Não mudar persistência/esquema sem escopo autorizado.
- Reproduzir achados antes de corrigir. Mudança importante exige revisão independente.
  GPT atua principalmente na auditoria adversarial e no game design; o usuário decide.
- Não iniciar sistemas/ciclos, apagar arquivos de trabalho ou publicar alterações por inferência.
- Preferências antigas não viram proibições eternas. Distinguir ordem do usuário, medição e
  opinião do agente; a ordem atual do usuário prevalece.
- IA por API foi descartada pelo usuário. O caminho proposto é avaliação determinística de
  interesses, não texto gerado definindo efeitos de jogo.

## Mapa do código

| Onde                                                        | Responsabilidade                                                  |
| ----------------------------------------------------------- | ----------------------------------------------------------------- |
| `src/data/`                                                 | Catálogos, parâmetros, esquemas e validação de referências        |
| `src/domain/budget/` — LASTRO                               | Receita, obrigatória, teto, primário e dívida                     |
| `src/domain/congress/` — ECLUSA                             | Adesão, voto com RNG, lealdade, promessa versus pagamento         |
| `src/domain/capacity/` — MALHA                              | Estoques de serviços, desgaste, retorno do gasto e atrasos        |
| `src/domain/economy/` — CORRENTE                            | PIB, inflação, juros, desemprego e custo da dívida                |
| `src/domain/opinion/` — SONDA                               | Opinião por renda, inércia, desgaste e traição                    |
| `src/domain/norms/` — ESTRATO                               | Faixas, vinculações, gatilhos, exceções, vigência e revogação     |
| `src/domain/cast/` — ELENCO                                 | Pessoas, influência, ambições e memória                           |
| `src/domain/pressure/` — CALDEIRA                           | Pressão dos quatro grupos e três rupturas                         |
| `src/domain/graph/` — DELTA                                 | Relações causais extraídas dos parâmetros de capacidade           |
| `src/domain/actors/` — VONTADE                              | Agência genérica: crença, objetivo, intenção, ação e trace        |
| `src/application/turn.mjs`                                  | Composição mensal e consultas do estado/previsão                  |
| `src/application/agenda.mjs`                                | Deriva proposta, ideologia, dispersão e rito dos movimentos       |
| `src/application/passage.mjs`, `mail.mjs`                   | Tramitação e correspondência com prazo                            |
| `src/application/platform.mjs`, `calendar.mjs`, `chain.mjs` | Promessas, calendário fiscal e leitura causal                     |
| `src/public/index.mjs`                                      | Fachada para consumidores; evita acesso cru a contas parciais     |
| `src/state/`                                                | Estado imutável, reducer, serialização e fluxos aleatórios        |
| `src/app/`                                                  | Sessão, composição de entradas da UI, pintura, eventos e diálogos |
| `src/ui/screens/`, `src/ui/shared/`, `styles/`              | Telas, peças e apresentação                                       |

## Como o mês funciona

`settlement(state, orders)` é o centro compartilhado das previsões e da execução: resolve
normas, distingue ordens imediatas das que esperam lei, calcula espaço, rateio e pagamentos,
e monta o Congresso com pessoas, memória e partido do presidente.

`playMonth` resolve respostas e tramitação, atualiza lealdade/memória, aplica decisões,
executa capacidade, orçamento, macroeconomia e opinião; calcula pressão e afastamento;
grava cartas, séries e o próximo estado. A ordem exata é mecânica: leia a função ao alterá-la.

- Execução dentro da faixa é imediata; lei/PEC passa por gaveta, relatoria e plenário.
  A gaveta de seis meses e o voto único por turno são regras de jogo legadas, sem fonte
  institucional (achado 75): não são rito brasileiro.
- O relator pode preservar uma parte de um pacote. Cartas têm prazo: silêncio aceita a
  emenda do relator, mas recusa a exigência de um grupo. Avançar não depende de responder.
- Constituição vence lei; especificidade vem antes de recência. Ausência de norma significa
  ausência de restrição. A gramática é mais rica que o canal atual de autoria de ordens.
- Déficit é possível. Teto legal não é caixa disponível. Proteger áreas do rateio transfere
  cortes às outras; proteger tudo pode estourar a bolsa e piorar a conta fiscal.
- A MALHA recebe gasto total, incluindo a parte obrigatória. Desgaste e atrasos diferem entre
  áreas; educação influencia capacidade industrial com atraso de 24 meses.
- Opinião não acompanha instantaneamente os indicadores. Pressão aquece/esfria com inércia.
  Rupturas social, econômica e política juntas abrem o processo; há uma janela de negociação,
  com preço político maior, antes do plenário. Sobreviver arquiva; pode haver nova abertura.
- `outlook` projeta um mês. `trajectory` congela alocações e roda capacidade por 24 meses,
  sem simular futuras votações e toda a economia. Não apresentá-la como previsão completa.
- `forecast`, `ledger`, `boilerOf`, `termOf`, `governmentOf` e `passageOf` são consultas úteis.
  `lockedBy` liga gasto obrigatório à norma que o prende.
- Save guarda estado e posição do RNG. Rascunhos de ordens e leitura de cartas ficam separados
  no localStorage. Esquemas incompatíveis são recusados; não assumir migração automática.

## Interface e experiência

Treze endereços: Gabinete, Email, Congresso & Leis, Finanças, oito áreas e Estado.
O Gabinete é uma mesa física vista de cima: jacarandá, pasta com parecer/decreto, envelopes,
caneta e telefone. O jogador marca proteção de áreas no próprio papel. Email é o arquivo de
correspondência; Finanças é leitura; áreas concentram orçamento e leis; Estado reúne regras.

O dock do Gabinete vira coluna fora dele. `app.mjs` apenas conecta os módulos de `src/app/`.
`session.mjs` concentra estado da sessão; `inputs.mjs` consulta a fachada; `paint.mjs` pinta.
Identidade de carta é seu ID, não posição numa lista. Foco, repintura e troca rápida de telas
são contratos de interação, não apenas aparência.

Liquid Glass é a base visual, não uma restrição contra matéria física. `glaze` em
`ui/shared/glass.mjs` aplica a receita comum; `spring.mjs` mantém posição e velocidade nas
interrupções. Custos de filtro, luz animada e recortes têm histórico medido. Consulte os
padrões e medições antes de repeti-los. Capturas existentes ficam em `captures/walk/`.

## Retrato do fim do estudo — conferir no handoff

Ciclo 29 ainda aberto: simplificação/prosa e provas de interação. Modularização do app e
menu feitas; as 30 asserções novas de interação registradas. O ciclo 30 teve veredito item a
item no mapa de migração (24/09); a carta do arquivamento foi adiada para depois do corte vertical.

Lacunas relevantes já registradas: pisos proporcionais com bases fiscais corretas, presença
parlamentar, calendário político, tributação acionável, coalizão por ministérios, contrapoderes,
iniciativa legislativa alheia, empresas e consequências materiais da pressão social.
Não tratar esses planos como sistemas prontos. Não recalibrar capacidade para ocultar a
questão das empresas. Consulte os achados específicos antes de propor solução.

O estudo leu contratos, handoff, padrões, ADRs, 30 ciclos, 12 pesquisas e histórico recente;
cruzou motores, aplicação, catálogos, UI, provas e capturas existentes. Não alterou o jogo.
Foi executado `npm run simulate -- --quiet`: sonda `agenda`, semente 20270101, sem partido,
48 meses, 26 aprovações em 43 votações, dívida final de 90,0% do PIB. Bateu com o handoff;
é referência datada, não prova de equilíbrio. O `validate` não foi reexecutado no estudo.

## Onde buscar e como validar

- Estado/fila/achados/séries: [handoff.md](handoff.md).
- Direção e plano: [especificação mestra](spec/master-spec.md) e
  [mapa de migração](spec/migration-map.md).
- Intenção de cada sistema: [índice dos ciclos](cycles/README.md); ciclo 13 é plano mestre
  histórico, 29 é simplificação e 30 reúne candidatos de profundidade.
- Doutrina sobre IA e ficção: `docs/adr/`. Pesquisa histórica: `docs/research/`.
- Provas: `tests/suites/`; guardas: `tests/guards/`; navegador: `tests/browser/`.
- Simulador e políticas-sonda: `tools/simulate.mjs`. Servidor: `npm run serve` (porta 5173).
- Ao mudar motor: provas pertinentes e simulação, com diferenças explicadas no handoff.
  Ao mudar UI: navegador e inspeção das capturas. Validação completa antes de declarar
  uma mudança pronta, conforme os contratos. Use os scripts de `package.json` e as skills
  locais quando aplicáveis. Não confundir resultados antigos com verificações desta sessão.

Em PowerShell, ler arquivos com `Get-Content -Encoding utf8`; usar `rg` para buscas dirigidas.
Limitar a saída das ferramentas ao necessário evita gastar a cota novamente com texto repetido.
