# Memória de trabalho do Codex — República Simulator

> Criada em 26/09/2026 a pedido expresso do Diretor do Jogo para preservar o estudo desta conversa dentro do repositório. Destina-se ao Codex; não é uma ordem ao Claude, nem outra autoridade de design. Arquivo versionável, portanto visível a quem acessar o repositório.

> **01/10:** `tmp/posse/` foi arquivada em `tmp/history/posse/`; a tela está em `vendor/posse/` e a versão ligada ao motor sai de `tools/prepare-posse.mjs`. Caminhos `tmp/posse/` abaixo são da época.

## Ao retomar

1. Confirme que o `package.json` declara `republica-simulator` e rode `git status --short`. Preserve trabalho alheio.
2. Leia `AGENTS.md` e `docs/agent-brief.md`. Em `docs/handoff.md`, leia **Para retomar em um minuto**, **Estado**, **Fila** e **Decisões vivas**; abra achados, código, testes e especificações conforme a tarefa. O usuário pediu em 28/09 para estar sempre estudado: mantenha o contexto vivo por essas fontes e aprofunde a área da tarefa. Não releia todo o histórico só para recuperar contexto.
3. Trate este arquivo como memória datada. Se houver divergência, a ordem atual do usuário, o código e os documentos canônicos atuais prevalecem. Não repita números antigos como se fossem medição nova.

## O que aprendi sobre o projeto

- É um simulador da Presidência do Brasil, com pessoas fictícias e instituições reais. A direção aprovada em 25/09 é um **sandbox ideológico com regras reais**: o jogador tenta transformar o país, encontra resistência com autor e paga consequências. Nenhum teste verde decide se uma mecânica é interessante ou equilibrada.
- O jogo implementado ainda usa **48 turnos mensais**. A especificação leva o avanço à **semana**, com fechamento mensal. Não confundir comportamento atual, protótipo, proposta de ciclo e design aprovado.
- O projeto é um site estático de ESM no navegador, sem build e sem dependências de runtime. O domínio é puro e recebe aleatoriedade por fluxo com semente. `src/application/` compõe motores; `src/public/` é a fachada da interface; `src/state/` guarda estado e RNG.
- A interface deve perguntar ao mesmo motor que resolve a jogada e mostrar apenas a **visão presidencial**, nunca a verdade oculta como certeza. Uma decisão percorre etapas distintas: querer, propor, aprovar, promulgar, executar e consolidar.
- Desde a noite de 26/09 o motor tem os mesmos 16 partidos do protótipo da posse (`src/data/parties.mjs`, ids em minúsculas como `pcn`), e a lealdade de cada partido é a chance de votar com o governo ([o modelo da base](../docs/spec/the-base-model.md)). O voto segue por bancada; a variação por deputado compõe os votos firmes. A posse está em `tmp/posse/`, com revisão local v2o das fichas; a versão 43 do canvas recebeu os retratos da Presidência. Protótipo não é integração no jogo.
- A interface existente usa Liquid Glass. O ciclo 32 planeja refazê-la sobre o motor existente, com direção Apple + Football Manager + Civilization + Valorant. Vidro somente sobre superfície parada; movimento usa mola. A posse é a primeira tela e a referência para as outras.
- O ciclo 33, **O jogo inteiro**, foi conferido pelo Claude e aprovado pelo usuário em 26/09: é o plano em vigor. A etapa 1 (Presidente, posse e base) está em construção.
- Na etapa 1, o E1.0a e o modelo da base estão no motor. Faltam criação e trajetória do Presidente, reforma ministerial, convites, notáveis e integração da posse (E1.0d–f). A eleição da Mesa (E1.0b) passou para a etapa 4. A revisão local v2o tem 812 fichas: 656 políticos, 123 técnicos e 33 notáveis. Os 123 técnicos cobrem 41 pastas possíveis, inclusive três criáveis no protótipo; o catálogo do jogo tem 38 cadeiras iniciais.

## Pessoas, papéis e preferências do usuário

- **30/09, última ordem antes de desligar:** parar implementação e apenas fechar os registros.
  A organização cuidadosa é a prioridade da próxima sessão; novas funcionalidades estão
  suspensas. O lote foi interrompido no meio da migração de caminhos. Ler primeiro o handoff
  e o checkpoint da organização; não concluir que a limpeza terminou ou que o portão foi
  repetido. Há originais preservados em `tmp/posse/` e guias ainda com caminhos antigos.

- **30/09:** foco exclusivo na transformação do protótipo da posse. Preservar e comparar a
  versão do Claude também em animações, transições, hover, fichas e F5; CSS idêntico e captura
  estática não bastam. Reutilizar controles e efeitos aprovados. Eliminar precedentes históricos
  e reação genérica como critério de reforma; buscar por atribuições e conservar seus IDs.
  O Diretor pediu atualizações detalhadas ao vivo e autorizou organizar a área de trabalho,
  retirar lixo verificado e ativar Remote Control. Medições, entregas e fila ficam no handoff.

- **29/09:** números como 30 trajetórias e 80 ministérios eram exemplos, não requisitos. Cabe
  ao agente arquitetar e justificar o repertório, a granularidade e os ensaios. Priorizar
  inteligência do planejamento, fidelidade com diversão e economia de tokens; respostas curtas.

- O usuário é a autoridade final de design. **Claude é o programador e designer principal** e conduz domínio, UI, testes, calibração, documentos e ciclos. Codex contribui sobretudo com auditoria independente, caça a exploits, análise de incentivos, revisão de diffs e propostas fundamentadas. Gemini executa lotes operacionais fechados. Respeitar `AGENTS.md` e `.agents/rules/co-development.md`.
- O usuário quer máxima precisão, eficiência e profundidade em código, auditoria e teste. Prefere progresso concreto a confirmações repetidas. Não iniciar ciclo, publicar, fazer push ou merge por inferência; seguir ordens explícitas atuais.
- Achado do Codex é hipótese até reprodução ou conferência em fonte. Relatar semente, ordens, política, versão, números e cadeia causal. Separar falha técnica, desequilíbrio e exceção de design `[DESENHO]`. Para regra brasileira atual, verificar fonte primária e data.
- O usuário pediu **este documento dentro do repositório e destinado ao Codex** porque teme perder o contexto ao fechar o terminal. Sua ordem expressa prevalece sobre a recomendação antiga do guia de não criar outra nota de retomada. Manter aqui apenas memória útil desta colaboração; estado e medições oficiais ficam no handoff.

## Fontes e caminho de trabalho

- `docs/spec/master-spec.md` é a autoridade de design; `game-in-one-page.md`, `rules-grammar.md`, `vertical-slice-energy.md` e `migration-map.md` detalham promessa, regras, corte e plano. `docs/cycles/` registra decisões e propostas; `docs/research/` pode conter itens `VERIFICAR`.
- `docs/agent-brief.md` tem mapa dos motores, composição mensal, interface e lacunas. `docs/handoff.md` tem o estado vivo, fila, achados e série. `CLAUDE.md` e `docs/standards.md` fixam contratos técnicos.
- Provas de engenharia: `npm run check`, `npm run types`, `npm test`, `npm run walk`, `npm run monkey`, `npm run validate`. Provas de design: `npm run simulate` e `tools/simulate.mjs` com sementes e políticas comparáveis. As políticas são sondas extremas, não adversários completos. Só rodar o portão pertinente à tarefa.
- Não mudar guardas ou testes para aprovar código, nem calibragem para esconder falha. Não remover JSDoc contratual. Não mexer em save/esquema sem escopo autorizado. Mudança importante pede revisão independente.
- Skills pessoais do Codex instaladas nesta conversa: `playwright` para exploração do navegador, `pdf` para documentos, `security-best-practices` quando houver pedido explícito de segurança e `republica-design-audit` para auditoria de mecânicas. São instruções do Codex e não alteram o Claude.

## Retrato da sessão em 26/09/2026

- Datado: confira `git log` e o handoff ao voltar. Na noite de 26/09 o Claude revisou o trabalho dos
  retratos e moveu as fontes: as folhas aprovadas ficam em `tmp/asset-sources/portraits/` (com
  `LEIA.md`), e os recortes em `tmp/posse/avatar-standard.json`, para a montagem do protótipo não
  depender desta pasta. `patch-v2l.mjs` copia as folhas para `project/` e para a raiz de `tmp/posse/`,
  onde o `live.html` as procura; o verificador espera as transições antes de capturar.
- Pendências dos retratos, registradas no handoff: os rostos aparentam de 25 a 45 anos, e presidentes
  reais tomaram posse entre 57 e 75; só a Presidência usa os rostos novos, e o resto do elenco depende
  da decisão 10 do ciclo 33.
- Protocolo do canal (`tmp/agents/`): anunciar cada caminho antes de editar, inclusive fora de
  `src/`, `tests/` e `docs/`; `assets/` é pasta do jogo.

## Estudo de 28/09/2026

- Conferidos o ciclo 33, a base, o ministério, o estudo de porte, a ECLUSA, a composição da coalizão,
  as provas da base e o gerador da posse. O mapa de migração e o estudo de porte conservavam a base
  antiga; foram atualizados com o estado do motor sem apagar o retrato histórico.
- A chance neutra de `whipCount` é 80%, conforme o código e a entrada 101 do journal. Os 75% no
  texto da especificação eram anteriores à prova de duas leis que passavam com uma Câmara inteira
  a 30%. O achado 86 (duração da coalizão) e o 87 (pauta generosa) seguem abertos.
- Antes de relatar avanço ou resultado de portão, confira código, `git status` e handoff atuais;
  memória e resultados datados não substituem uma medição nova. Preserve alterações alheias.
