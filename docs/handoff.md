# Retomada

> Ponto de retomada único. **Aqui só entra o que é verificável hoje:** estado, fila, decisões
> vivas, achados abertos e a série. Narrativa vai para [`journal.md`](journal.md). Número com data
> envelhece: remeça antes de repetir. A tabela de contagens é cobrada por
> `tests/suites/catalog.mjs`; a série, por quem mexe no motor.

## Para retomar em um minuto

- **01/10, organização fechada.** O lote de 30/09 terminou:
  - `tmp/posse/` foi para `tmp/history/posse/`, e os 33 registros soltos para
    `tmp/history/recovery-2026-09-30/`. São 119 arquivos, com hash igual antes e depois, e nada
    foi apagado ([registro](evidence/workspace-organization-close-2026-10-01.json));
  - a versão da posse ligada ao motor agora é gerada em `tmp/build/posse.html`. Em `prototypes/`,
    a guarda `tokens` lia o CSS do protótipo e dava 43 achados;
  - as 5 provas de navegador da posse passaram nas duas alturas;
  - READMEs dos protótipos, guia do agente e mapas de capturas e evidências foram reescritos.

  `validate` verde em 01/10: 13 guardas, 68 sintéticas, zero links quebrados, tipos, lint,
  formato, 531 testes, passeio e macaco (60 ações, semente 7, zero achados). Funcionalidades
  novas seguem suspensas até ele testar o protótipo. Journal, entrada 123.

- **28–30/09, trabalho só do Codex.** A cota do Claude tinha acabado, e a revisão independente
  nunca aconteceu (a tentativa deu 429). Ordem dele em 01/10: o Claude decide o que se aproveita
  e o que se refaz. O que existe:
  - em `prototypes/government/`: estrutura variável de ministérios por IDs, 152 atribuições e
    busca com `e`, `ou`, `não`; `pilot`, `operations`, `demand` e `management` só rodam em
    provas, com unidades inventadas;
  - em `prototypes/posse/` e `vendor/posse/`: a posse do Claude ligada ao motor;
  - o plano em [piloto](spec/government-pilot.md) §11 e o contrato em
    [governo variável](spec/dynamic-government.md);
  - a [auditoria dos planos](plan-audit.md), com 12 achados;
  - um conserto no redutor (`appoint` tira a pessoa da pasta anterior; exonerar vaga não muda o
    estado), com prova em `tests/suites/posse-flow.mjs`.

  A história está no journal, entradas 103 a 122. A lógica nova da tela vive como texto dentro
  de `tools/prepare-posse.mjs`, trocada por substituição sobre o HTML do Claude.

- **Defeitos vistos no protótipo em 01/10**, ainda sem conserto:
  1. a frase "Vai para Escolher destino." leva o nome do botão;
  2. a lista de destinos sai na ordem do ID interno;
  3. depois de qualquer reforma, a base vira "—" e o hemiciclo apaga;
  4. a chefe de gabinete diz "os partidos podem votar contra a medida" sem motor atrás;
  5. as atribuições aparecem em minúscula na criação de pasta e com maiúscula no resto.

  Os 49 erros do template cru no console e a tela fixa em 1280 px já estavam no original.

- **Backups em `Desktop/cld-backups/`**, analisados em 01/10:
  - os dois bundles estão íntegros e todos os commits deles já estão no repositório;
  - os `.tar.gz` de 28 e 29/09 não guardam nada sem cópia além de versões antigas de documentos;
  - só `cld-posse-2026-09-26.tgz` tem conteúdo único: 140 arquivos (38 MB), quase todos das três
    auditorias da posse pelo Codex (relatórios, capturas, logs) e peças antigas da montagem.

  Tudo está no mesmo disco. O `origin/caixa-de-entrada` parou em 24/09, então nenhum commit
  desde então existe fora deste computador.

- **direção (25/09):** sandbox ideológico com regras reais; realismo acima de tudo. Os documentos
  de design, do mais geral ao mais concreto: [especificação mestra](spec/master-spec.md) 1.1
  (autoridade) → [jogo em uma página](spec/game-in-one-page.md) (promessa e loop) →
  [gramática das regras](spec/rules-grammar.md) (como toda regra real vira peça) →
  [corte vertical](spec/vertical-slice-energy.md) (a abertura e a estatal) →
  [mapa de migração](spec/migration-map.md) (o plano). Os fatos estão na
  [pesquisa 14](research/14-the-state-energy-company.md) e na
  [pesquisa 15](research/15-forming-the-government.md); as 40 ações do cargo, no
  [checklist do Presidente](spec/presidential-checklist.md); a interface nova, no
  [mapa das telas](spec/interface-map.md). Em conflito, vale o mais recente;
- **o modelo da base está no motor (26/09):** 16 partidos, save na versão 21, a lealdade é a
  chance do partido, um líder por bloco (15 arquétipos) e as provas de `tests/suites/base.mjs`.
  Desenho em [o modelo da base](spec/the-base-model.md) §7; achados 86 e 87 abertos.
- **a posse do Claude:** estrutura aprovada na versão 25 do
  [canvas](https://claude.ai/artifact/CHQmb6ksyKpYxdR8BBEnuM); a versão 43 acrescentou os retratos
  da Presidência; a revisão local v2o das 812 fichas (27/09) não foi publicada. Na v2o, a ficha
  fica 2,2 s ao sair do nome, as notas 1–2 são vermelhas, 3 verde amarelado, 4–5 verdes e 6
  dourado, e o botão da criação sorteia todos os campos com idade mínima de 35 anos;
- **commits:** o último é `a75ef10` (26/09, 22:58); o journal guarda a lista por etapa. Ele
  autorizou commit ao fim de cada etapa validada; push e merge seguem pedindo ordem;
- **git:** tudo na branch `caixa-de-entrada`; `origin/caixa-de-entrada` está em `ed9f2cc` (24/09).
  O `main` local e o remoto estão parados em 27/08; o merge é decisão dele;
- **backup de 26/09, antes da interface nova:** a marca `antes-da-interface-nova` no git, mais
  `cld-backup-2026-09-26.bundle` e `cld-posse-2026-09-26.tgz`, hoje em `Desktop/cld-backups/`;
- **fora do repositório:** a quarentena `Desktop/cld-quarentena-tmp/` (750 MB) foi apagada em
  26/09 com o sim dele; em 30/09 saíram 182 arquivos redundantes da Área de Trabalho
  ([inventário](evidence/workspace-cleanup-2026-09-30.md)).

## Estado — 27/09/2026: base no motor, posse em protótipo, E0 pausado

- **a direção e os documentos de 25/09.** Depois do playtest do E0, ele definiu o jogo: um sandbox
  ideológico sob regras reais. A pesquisa da estatal foi feita pelo Claude nas fontes oficiais
  (pesquisa 14), porque o ChatGPT não pesquisa. A [gramática](spec/rules-grammar.md) padroniza
  toda regra em sete peças com os nomes da especificação, que subiu para a versão 1.1
  (`PROVISIONAL_MEASURE`, `DIRECT_ENTERPRISE` e a marca `[DESENHO]`). O corte vertical está na
  versão 3, e o mapa ganhou os oito lotes do E1 (§6.4) e as decisões de 25/09 (§11.1b);
- **o E0 está implementado, commitado (`febd0b5`) e pausado** ([ciclo 31](cycles/31-the-bimonthly-cut.md)):
  o decreto de proteção até o relatório bimestral (`state.decree`), o limite das emendas pela CF
  art. 166 § 18, sete ministros no ELENCO, o parecer e a reunião (`contingency.mjs`), o ensaio
  (`scenario.mjs`) e a cena na mesa. A reunião foi reprovada no playtest, e a causa era o modelo:
  a decisão do corte não pesa (achado 77);
- **os lotes A1, A1.1, A1.2 e A2a estão feitos e commitados** (`98c1abc`, `a690248`, `5ba154c`):
  a VONTADE em `src/domain/actors/`, com contrato endurecido, valor separado da urgência e a
  crença por evidência (`belief.mjs`). A história está no journal, entradas 42 a 44. A dívida da
  avaliação montada pela aplicação está no A4 do mapa. No E0, a VONTADE decide pelos ministros
  na reunião do corte, que o jogo ainda não abre fora do ensaio;
- **padronização de 24/09, com as decisões dele:** todo caminho versionado em inglês,
  kebab-case e sem acento (docs, assets, licença, skills — agora `check`, `walk`, `simulate`,
  `validate` —, capturas e `tmp/`); nomes da UI que diziam outra coisa corrigidos
  (`screens/congress.mjs`, `shared/vitals.mjs`, `50-screen-congress.css`,
  `46-screen-cabinet-desk.css`); contratos vazios TEMPORAL e CASCATA removidos; a evidência
  citada pelo código versionada em `docs/evidence/` (30 arquivos, 2,2 MB, congelada);
  `tools/prose-only.mjs` no lugar de `tmp/so-prosa.mjs`; `npm run links`
  (`tools/check-links.mjs`) dentro do `validate`, com zero referências quebradas. A pasta
  `cld` manteve o nome. `tmp/` agora tem `agents/`, `asset-sources/` e `history/`;
- **Autoridade de design:** [especificação mestra](spec/master-spec.md), versão 1.1 em 25/09; a 1.0 foi revisada em 24/09 só com as decisões aceitas por ele: convenção de caixa limitada aos schemas,
  comunicação, calendário real e posse, visão presidencial, evento mínimo, `GAME_RULE` como
  projeção, cognição × processamento, silêncio não é resposta, agregado não vira ator,
  parlamentares individuais, Senado em duas entregas, `ACTION` ≠ `EVENT`, `PROPOSITION` adiada,
  equivalência semântica do agendador, invariantes 21–23. `world-design.md` superado, preservado;
- **mapa de migração** revisado em [spec/migration-map.md](spec/migration-map.md): projeção
  legada no lugar de "byte a byte", calendário civil registrado, visão presidencial com as dez
  consultas que leem verdade oculta, modelo mínimo de informação, três candidatos de corte
  vertical (ensaio: contingenciamento; candidata principal: medida provisória fictícia), 19
  lotes pequenos em três trilhas (A comportamento primeiro, B tempo, C epistemologia) e 4
  pesquisas. Decisões tomadas e abertas no §11. Em 25/09 o E1 passou a ser a estatal, em oito
  lotes (§6.4);
- **a tela mostra o que a Presidência sabe:** a mesma lei em `CLAUDE.md`, `AGENTS.md`,
  `agent-brief.md` e `standards.md` §5. Os três primeiros apontam `docs/spec/` como autoridade de
  design e plano em vigor; o índice dos ciclos também. **ADR 0003** explicita empresa;
- **`tmp/` podado em 24/09, com o sim dele:** ficaram as 59 entradas citadas por doc, código,
  estilo, crédito ou prova; depois a evidência leve foi para `docs/evidence/` e o resto se
  organizou em `tmp/agents/`, `tmp/asset-sources/` e `tmp/history/`. As outras 662
  (693 MB) estão em quarentena fora do repositório, em `Desktop/cld-quarentena-tmp/`, com
  `LEIA.md` listando cada uma; ela foi apagada em 26/09 com o sim dele. A mesma quarentena
  recebeu as capturas fora da regra de `captures/` (25 MB) e o `.playwright-mcp/` (33 MB);
- medido para o mapa: save no mês 48 com 35.387 bytes; `playMonth` 0,64 ms; `settlement`
  0,125 ms;
- **Pesquisa do Gemini entregue; não validada:** triagem rápida em
  [13-real-brazil-institutions.md](research/13-real-brazil-institutions.md). Faltam URLs e comprovação
  de atualidade; repete erro sobre `Program.yield` e propõe consequências automáticas e números
  sem fonte suficiente. Cabeçalho corrigido e ressalvas registradas. Gemini declarou repouso;
  nenhum novo lote enviado. Retomar pela verificação de fontes, sem usar o rascunho como regra;
- **direção anterior (23/09) superada pela especificação:** [world-design.md](world-design.md)
  fica como histórico. O piloto de Energia de 23/09 era o setor inteiro; o corte de 25/09 é uma
  empresa só;
- **Ciclo 29 (simplificar) em curso.** Itens 2 e 3 feitos (`app.mjs` modularizado, menu com 3
  chaves). Item 1: lotes 1 a 5 conferidos (`state.mjs` 19%, `turn.mjs` 14%, `inbox.mjs` 11%,
  `cabinet.mjs` 15%, `paint.mjs` 11%, `inputs.mjs` 13%, `strings.mjs` 8%, `styles/46-screen-cabinet-desk.css` 4%,
  lote 5: `session.mjs` 46% → 19%, `handlers.mjs` 38% → 11%, código idêntico). Item 5
  inventariado e 18 backups efêmeros arquivados em `tmp/history/archive/`, apagada em 26/09 com o sim dele. Item 4: 30 asserções de
  interação no passeio (seções 5, 9, 10 e 11) + macaco; as dez novas cobrem verba e aviso
  modal. Portão completo verde em 139,2s; oscilação anterior registrada no achado 69. Lote 6 conferido
  (`glass.mjs` 38% → 18%, `agenda.mjs` 34% → 16%, `area.mjs` 32% → 12%, código idêntico), e o
  lote 6b devolveu as fontes em `tmp/` e a alternativa reprovada que o lote 6 tinha apagado;
- **lote Codex/Gemini de 23/09:** `budget/index.mjs` 41% → 22%; `opinion/index.mjs` 44% → 25%.
  Código sem comentários idêntico e 95 linhas de contrato JSDoc preservadas, conferidos pelo
  Codex contra as cópias anteriores e o HEAD. A meta global de prosa continua pendente;
- **prosa do jogo:** os três piores arquivos de tela/aplicação saíram da lista com o lote 6.
  Global e domínio estão por remedir após o lote Codex/Gemini; referências anteriores: ~21%
  global antes do lote 6 e 41% no domínio antes desta rodada;
- **revisão externa:** 2 dos 3 ultrareviews grátis gastos, 9 achados, os 9 reproduzidos, 7
  corrigidos, 2 nits na fila. As branches dos ultrareviews foram apagadas em 24/09 (só locais;
  recriáveis): `base-ultra` 679f043, `base-motor` bb7ce9d, `motor-review` fc78e27. Também
  `acoplamento-e-simulador` 137a94a (segue no remoto) e `backup-auditoria-26-08-2026` 4bf8c51;
- **portão:** 13 guardas · 68 sintéticas · 423 provas · passeio verde em 1440×980 e 1440×900 ·
  macaco (60 ações, semente 7) verde · `links` com zero quebradas. `validate` verde em 28/09;
  série do `simulate` remedida em 26/09 nas seis sondas;
- **rodar é barato:** pintura 3-5ms, abertura 600ms, morph do dock 205-232 fps.

## Fila, em ordem

**Agora (01/10):** a organização fechou; funcionalidades novas seguem suspensas.

1. **Ele testa o protótipo da posse** (`prototypes/posse/README.md`). Os achados do teste,
   reproduzidos, entram antes de qualquer ampliação; os cinco defeitos de 01/10 (bloco acima)
   são a primeira fila de consertos, com ordem dele.
2. **Revisão do trabalho do Codex pelo Claude**, que decide o que fica e o que se refaz:
   o conserto do redutor, `posse.mjs` na fachada, a estrutura e a busca, o gerador por
   substituição de texto e os quatro ensaios só de prova.
3. **O plano do protótipo**, depois do teste: o [piloto](spec/government-pilot.md#11-transformar-o-protótipo-da-posse--execução-em-3009),
   §11 (currículos nas fichas, consequências, valor político da estrutura variável).

**Depois, o plano do jogo inteiro** (ciclo 33), que não é requisito para testar o protótipo:

1. **Etapa 1 do [ciclo 33](cycles/33-the-whole-game.md), Presidente e posse**, aprovado em 26/09.
   O E1.0a e [o modelo da base](spec/the-base-model.md) já estão no motor. Faltam criação e
   trajetória do Presidente, reforma ministerial, convites, notáveis e a posse no jogo (E1.0d–f).
   O E1.0b, a eleição da Mesa, passou para a etapa 4 (decisão 1);
2. **Etapa 2, casca e Gabinete** (ciclo 32 fase 3, B1, B3 e B6);
3. **Etapa 3, a estatal** (E1.1 a E1.8);
4. **Etapa 4, o Congresso inteiro** (com o E1.0b, a eleição da Mesa); depois dela, o marco jogável:
   ele joga 2027 inteiro antes da etapa 5. A régua do aceite são as
   [partidas-teste](spec/the-test-playthroughs.md) Xi e Lee (pesquisas 19 e 20, conferidas), e o
   [ciclo 33](cycles/33-the-whole-game.md) foi conferido pelo Claude e aprovado por ele em 26/09
   (decisões 1, 5 e 9 tomadas; a 10, retratos, aberta: serão imagens que ele gera no ChatGPT);
5. **achado 81**, antes de fechar o E0; não bloqueia o E1;
6. **achado 69** — investigar a oscilação da prova de voo interrompido;
7. **carta do arquivamento** (achado 66), adiada para o lote F (mapa §10);
8. **prosa de `src/domain`** (referência anterior: 41%; meta ≤ 20%);
9. **3º ultra: `src/ui` inteira**, depois de fechar o ciclo 29;
10. **ciclo 30** — [`cycles/30-depth-and-proofs.md`](cycles/30-depth-and-proofs.md): ele marca os
    candidatos que entram.

## Decisões vivas

- **01/10, o trabalho do Codex:** ele usou o Codex de 28 a 30/09 porque a cota do Claude acabou,
  e o considera muito inferior. O Claude decide o que se aproveita e o que se refaz. Ele achou
  interessantes as ideias do plano do Codex para o protótipo. Pediu também plano antes de executar.
- **30/09, organização antes de funcionalidade:** planejar organização, nomes, distribuição e
  limpeza antes de executar. Fechada em 01/10.

- **30/09, prioridade de entrega corrigida:** o Diretor quer testar somente o novo protótipo
  por enquanto. Auditar, desenvolver e aprimorar durante o teste. Não prosseguir com o porte
  do jogo completo por inferência; a sequência 1–4 permanece como plano posterior.
  Ordem explícita para a sessão de teste: F5 reinicia tudo; não persistir escolhas do protótipo.

- **30/09, UI do protótipo:** copiar e adaptar o original do Claude; conferir linha por linha
  markup, CSS, botões, hover, fichas, foco, rolagem, funções de interação, animações e transições.
  Não misturar essa auditoria de apresentação com aprovação de motores. Código visual permanece
  na fonte preservada; `prepare-posse.mjs` gera somente a versão experimental. Novos controles
  usam as peças existentes. F5 deve conservar a entrada suave do original.

- **30/09, repertório estrutural:** retirar completamente precedente histórico, ministérios
  próximos fixos e reação genérica na extinção. Palavras-chave e composição flexível pesquisam
  trabalho por ID; não fabricam poder, recursos, competências ou experiência. Complexidade vem
  de responsabilidade, pessoa, equipe, recurso, instituição e consequência com estado conservado.

- **30/09, organização e comunicação:** inventariar antes de retirar redundâncias; conservar
  fontes, história única e hashes verificáveis. Autorizada a organização da Área de Trabalho e
  a retirada de lixo gerado. Relatar o que está sendo feito e a próxima etapa ao vivo. Autorizado
  Remote Control para iPhone; não expor códigos temporários em arquivos.

- **29/09, governo variável:** os números usados pelo Diretor eram ilustrativos. Não impor
  quantidade de carreiras, ministérios ou encaixes. Planejar por responsabilidade, experiência,
  capacidade e consequências; equilibrar fidelidade e diversão. Evitar burocracia repetitiva.

- **26/09, a trajetória do Presidente** — seis origens na criação (político experiente, militar, jurista,
  empresário, ativista, celebridade); ordem dele: têm de pesar no jogo. Proposta no
  [ciclo 32](cycles/32-the-new-interface.md), §6b, para a fase 2;
- **26/09, a posse e a base** — ordens dele: a base do começo segue o protótipo (o Presidente
  começa com o próprio partido e monta a base com ministérios e negociação), aprimorado e fiel à
  realidade, com pesquisa antes do motor; a posse é a primeira tela e o padrão das outras; o começo
  do jogo cria o Presidente (nome, partido, sexo, data de nascimento e mais);
- **26/09, a interface nova** — ordem dele: o motor fica e a interface recomeça do zero sobre a
  fundação; estilo fixado em Apple + Football Manager + Civilization + Valorant; reaproveitar o que
  prestar do Liquid Glass e dos menus ([ciclo 32](cycles/32-the-new-interface.md));
- **26/09, o visual da posse** — ele aprovou a estrutura da versão 25 do protótipo. No mesmo dia
  fixou o estilo Apple + Football Manager + Civilization + Valorant para a interface nova; a posse é
  refeita nesse estilo na fase 1 do [ciclo 32](cycles/32-the-new-interface.md);
- **26/09, o ministério** ([proposta v0](spec/the-cabinet.md)) — ordens dele: aumentar e diminuir
  os ministérios tem de estar no jogo, com realismo; dá para chamar gente de fora da política, com
  33 notáveis de nome inventado (esporte, TV, internet, música, cinema, academia, negócios); a
  posse é o híbrido dos protótipos B e C (o D do canvas). Os notáveis são elenco fixo, com
  temperamento que varia pela semente. Fama e afinidade, de 1 a 5, aparecem para todas as pessoas;
  preparo chegava a 6 nos três especialistas técnicos de cada pasta no protótipo de 27/09;
  essa garantia foi retirada pela direção de 29/09. O preparo novo depende da experiência
  conhecida e do trabalho vigente, sem máximo garantido.
  A língua solta saiu, porque cabe no preparo. A tela da posse é um hemiciclo com um painel
  só: para cada ministério, primeiro o que fazer com ele, depois quem comanda. Viram os lotes E1.0d, E1.0e e E1.0f;
- **25/09, o mundo vivo, lote 2 no jogo** — o desgaste de ficar na base cresce com a distância
  ideológica do governo; quem sai critica um governo fraco a cada 3 meses; cada crítica pesa sobre
  quem ficou. A VONTADE ganhou o gatilho da oportunidade (especificação §9.14). Quem pediu espera 3
  meses; quem foi atendido não ameaça nem sai por 3 meses; dois partidos não pedem a mesma cadeira;
- **25/09, o mundo vivo, lote 1 no jogo** (ordem dele: "crie uma IA viva", carta branca) — 14 pessoas
  (7 porta-vozes e 7 ministros) decidem pela VONTADE todo mês e escrevem cartas com autor: pedem
  pasta ou verba, ameaçam, reclamam, desembarcam, pedem demissão. Sem diretor de drama; a imprensa
  entra como atores no lote 3. O simulador começa com o governo montado na posse (`--cabinet
proportional`, o padrão), porque a posse é obrigatória;
- **25/09, o mundo vivo (proposta, histórico)** — revisão da "IA": hoje o mundo é feito de termômetros (16
  tipos de carta nascem de limiares; o Congresso vota por fórmula; só a reunião do corte usa a
  VONTADE). A proposta põe cada acontecimento com autor e motivo, o agendador acordando só quem tem
  motivo, o filtro da Casa Civil e o ritmo vindo do calendário real. Duas decisões dele pendentes
  em [o mundo vivo](spec/the-living-world.md);
- **25/09, a semana** (decisões dele) — o botão avança uma semana; dentro dela, 7 dias com manhã,
  tarde e noite; o Vice pode ir no lugar do Presidente; o Congresso fica de terça a quinta, o que a
  Câmara confirma: 89% dos 169 dias com votação em plenário desde fev/2025. Telefonar não tem
  limite fixo: os freios são o tempo (a rodada ocupa um turno), o peso (ligação não fecha acordo
  grande) e o desgaste com a mesma pessoa. Tudo em
  [a semana de governo](spec/the-week.md);
- **25/09, laboratório sem pressa** — ele gosta de experimentos e não tem pressa de entregar o
  jogo pronto. Toda tela nova nasce em dois ou três protótipos para ele comparar antes do código;
- **25/09, a interface será quase toda reformulada** — o motor, a regra da visão presidencial e as
  provas ficam; as telas saem do [mapa das telas](spec/interface-map.md), uma por lote, e a antiga só
  sai quando a nova cobre tudo. Os três protótipos da posse esperam a escolha dele;
- **25/09, o GPT-6** — o Astra vale para a revisão adversarial de um lote inteiro e para jogar o
  jogo como leigo; pesquisa e crítica de desenho vão no Sol, mais barato
  ([pesquisa 16](research/16-openai-gpt6-for-the-project.md)). Ele tem o Plus (R$ 100 por mês): o
  Astra está no Codex e no Work, com 5 a 45 mensagens a cada cinco horas;
- **25/09, foco nacional** (ordem dele) — o que é internacional (geopolítica, guerras, crises lá
  fora) entra numa atualização futura, e o jogo mostra ao jogador a lista das próximas
  atualizações. Até lá, o mundo lá fora fica parado num nível declarado. O jogador escolhe
  qualquer partido no início;
- **25/09, as duas recomendações** (ordem dele): a rota fora da ordem fica fora do corte da
  estatal. A abertura com o subsídio do diesel foi revogada no mesmo dia pelo foco nacional; o jogo
  abre com o jogador montando o governo (decisão dele): ministros, aliados e a eleição da Mesa;
- **25/09, a gramática e a especificação 1.1** — toda regra real se escreve com ação, rota,
  avaliação, portão, ficha, efeito e ciclo, com os nomes da especificação; a tela mostra três
  linhas (quanto custa, quem reage, quanto tempo). Três camadas de fidelidade: fonte para o que o
  jogador toca, episódio real para o efeito agregado, `[DESENHO]` declarado para o resto;
- **25/09, pesquisa** — o ChatGPT não pesquisa; toda pesquisa com fonte é do Claude. No Planalto o
  WebFetch leva ECONNRESET: baixa-se com `curl` e lê-se o texto. PDF sai com `pdftotext`;
- **25/09, o que é o jogo** — sandbox ideológico com regras reais: o jogador tenta qualquer
  projeto de país (comunista, ancap, nacionalista, monarquista...), o Brasil resiste pelas
  instituições reais, e o fim mostra o país deixado. **Realismo acima de tudo.** Desenho em
  [game-in-one-page.md](spec/game-in-one-page.md). O primeiro corte jogável passa a ser a estatal
  de energia fictícia, porque ela se joga para lados opostos. A revisão do ChatGPT, aceita: eixos só internos (a tela mostra fatos concretos), resistência nasce de quem perde (não de "radicalidade"), caminhos com trade-off, a cadeia querer ≠ … ≠ consolidar, fim sem julgamento, jogadas compostas sem rótulo ideológico. Acréscimos do Claude: o mundo interrompe, a atenção é o recurso escasso, janelas reais do mandato;
- **25/09, playtest do E0** — a reunião em papel foi reprovada ("não parece jogo"). Três protótipos
  de cena também não pegaram, e a causa não era a tela: a decisão do corte não pesa em nada no
  modelo (achado 77). Lições: encontro vira cena com rostos, fala curta e humana, nada de pop-up, e
  toda decisão mostra o que arrisca. O E0 fica pausado (commitado depois, `febd0b5`);
- **25/09, E0 v1 implementado** (commitado depois, `febd0b5`; [ciclo 31](cycles/31-the-bimonthly-cut.md)). Pelo
  bloqueio, os ministros viraram sete (um por pasta, a Fazenda como guardiã), e o rateio passou a
  respeitar a CF art. 166, § 18 (EC 100/2019, **VERIFICADO** no site da Câmara): a emenda não perde
  mais que a proporção das demais discricionárias; as sondas não protegem, e a série ficou imóvel.
  `src/application/contingency.mjs` (parecer e reunião, pelo `settlement` e pelo `decide()`),
  `src/application/scenario.mjs` (ensaio do mês 21), ministros em `src/data/ministers.mjs` e no
  ELENCO. Achado do playtest de bancada: quando contestar a maior pasta protegida é a melhor
  alternativa, todos os ministros fazem o mesmo e a personalidade some;
- **25/09, conclusões provisórias do E0** — a Fazenda entra como guardiã e parecerista da
  restrição fiscal, não como competidora simétrica das pastas: enquanto a proteção cabe no
  espaço, a distribuição não mexe no primário dela. "≥ 2 ministros materiais" é só hipótese da
  sonda de medição, não a regra de frequência do Momento Presidencial;
- **25/09, duas decisões dele para o E0, pelo realismo** — (1) os ministros lembram entre
  bimestres: entra junto com os ministros, porque campo no save sem consumidor é dado morto;
  (2) o decreto de proteção vale até o próximo relatório bimestral: **feito** (`febd0b5`).
  `state.decree` guarda as áreas protegidas; o turno o zera no mês do relatório e o rascunho do
  mês seguinte nasce dele. Entrou fora dos campos obrigatórios do save, como o partido, e por
  isso nenhum save antigo foi recusado nem o esquema subiu. Motor e série imóveis;
- **25/09, mudança de prioridade** — depois do commit do A2a, a trilha A pausou e o E0 veio à
  frente. No mesmo dia o E0 foi jogado e pausado, e o E1 (a estatal) passou à frente; o A2b
  espera. Revisão: um lote → implementação → uma revisão principal → correção → commit;
  rodada só de papel apenas diante de bloqueio real. Nota para o A2b: uma evidência causal pode
  gerar várias transmissões (João conta o mesmo a dois jornais) sem virar duas linhagens causais,
  mas pode virar duas linhagens percebidas;
- **25/09, notas da revisão do A1.1, antes do A2** — `risk` como fração do ganho é provisório:
  não cobre a alternativa que perde além do ganho. `cost` genérico não volta; custo material é
  efeito, e tempo, atenção e oportunidade nascem dos mecanismos que os produzirem. No A2 a
  `confidence` alimenta a incerteza epistemológica; a incerteza objetiva do resultado (alta
  confiança em 30% de falha) fica possível, sem entrar agora;
- **24/09, codinomes provisórios** — os codinomes dos motores (inclusive VONTADE, escolhido
  por ele para o motor de agência) serão revistos numa etapa própria de nomenclatura. Não
  influenciam a arquitetura nem aparecem para o jogador; a guarda `codenames` já os barra em
  código executável, o que inclui os textos da interface;
- **23/09, liberdade de projeto político** — o jogador não interpreta Lula. O usuário quer
  poder tentar transformações radicais, incluindo comunismo, fascismo e trajetórias inspiradas
  em Milei ou Singapura. Brasil real como ponto de partida, não destino obrigatório. Modelar
  medidas, resistências e consequências, distinguindo tentativa de sucesso; detalhamento em
  [world-design.md](world-design.md). Não houve alteração do horizonte de 48 meses;
- **23/09, experiência presidencial** — usuário escolheu combinar reuniões/conversas e
  documentos/despachos, usando o funcionamento real do governo brasileiro, do governo Lula
  e do STF como referência. Proposta e caso documentado do IOF de 2025 em
  [world-design.md](world-design.md); não confundir episódio histórico com situação atual;
- **23/09, prioridade reafirmada pelo usuário** — máxima fidelidade ao que um presidente
  realmente é e faz. O jogo está no início; planos e soluções permanecem revisáveis em discussão
  entre usuário, Codex, Claude e Gemini, com decisão final do usuário. Preservar essa abertura
  nas propostas de [world-design.md](world-design.md);
- **23/09, reformulação** — prioridade do usuário: jogabilidade, realismo, pessoas com inteligência
  e personalidade e empresas fictícias reconhecíveis. Número de pastas permanece aberto.
  A revisão do Gemini foi confrontada com código e direção atual em [world-design.md](world-design.md).
  Não adotar prazos arbitrários de efeito, crise obrigatória por mês ou equivalência entre
  indicação política e incompetência. São critérios propostos pelo Codex, não calibragem aprovada;
- **23/09, noite** — usuário autorizou o Codex a assumir implementação e coordenação com Gemini
  durante a ausência do Claude. Arquivos exclusivos por lote; Codex confere respostas, comandos
  e diffs do Gemini e centraliza a validação de navegador. Relatório do agente não substitui prova;
- **23/09** — governança tripartite (Claude, GPT, Gemini) e contrato universal em [`AGENTS.md`](../AGENTS.md):
  separação entre verdade de engenharia (guardas e testes) e verdade de design (sondas de 48 meses);
  regra de independência entre autor e revisor (quem implementa não aprova sozinho); o usuário é a autoridade
  máxima de design;
- **23/09** — achado 68 fechado: o comentário da rolagem em `src/app/paint.mjs` agora declara o
  regime (abaixo de 940px quem rola é a página, `list.scrollTop` fica em 0);
- **23/09** — o Gemini commitou com `git commit -am` e varreu arquivo fora do lote. Regra nova
  no canal: `git add` por nome, nunca `-am`;
- **23/09** — guia compacto [`docs/agent-brief.md`](agent-brief.md) (162 linhas) para retomada econômica:
  evita que agentes leiam 30 ciclos e 12 pesquisas em loop agêntico (lição: varredura cega no Codex consumiu
  6,5M tokens e 95% da cota de 5h). Sessões abrem por `agent-brief.md` + Estado/Fila do handoff;
- **21/09** — sobreviver ao plenário do afastamento **arquiva** o processo; ele reabre se as
  três rupturas coincidirem de novo. Prova em `pressure.mjs`;
- **21/09** — os 2 nits do ultra (`settlement()` refaz o elenco a cada leitura; `vote()` não usa
  `take()`) são qualidade, não bug: fila, não conserto;
- **21/09** — todo achado se reproduz antes de mexer, e vira prova. Regra do `CLAUDE.md`;
- **21/09** — bug relatado pelo Gemini só entra com reprodução (tela, passo, o que apareceu);
- **05/09** — a base visual é o Liquid Glass; base é ponto de partida, não teto;
- **04/09** — IA por API não entra, nem em partida nem fora dela. O ciclo 19 será reescrito
  como avaliador;
- **31/08 — base acordada, nenhuma executada:** o email leva até a tela · o save fica para depois
  · o piso da saúde e da educação anda com a receita (remede a série) · a votação olha quem
  compareceu (4 regras de equilíbrio). Veredito de cada uma no §10 do mapa: a presença vira ação
  do deputado, e as 4 regras viram critério de calibragem;
- **21/08** — não recalibrar a capacidade antes da reformulação das empresas (achado 53);
- **sem resposta dele:** a lista de bugs que ele viu ("são muitos, nem sei como escrever").

## Achados abertos

Um achado que fecha sai daqui para o journal. Número com data: remeça antes de repetir.

- **86. Nenhuma sonda segura a base (25/09; remedido em 26/09 com os 16 partidos).** Nas seis
  sondas há 13 desembarques; em `agenda`, até o mês 28, e só o PBR fica (20 de 42 aprovadas). Com
  todos servidos pela bancada, ninguém sai com 24% de aprovação; com 19%, saem primeiro os
  distantes; com 15% ou menos, quase todos saem no mesmo mês, sem o atraso de meses do PMDB em 2016. Âncoras a pesquisar com fonte (VERIFICAR): a aprovação quando o centrão ficou com
  Bolsonaro em 2021, a de Dilma quando o PMDB rompeu, e a base de Temer em 2017 e 2018. O
  cenário das provas do mundo passou de 24% para 19% de aprovação (`tests/suites/world.mjs`);
- **87. A pauta de conteúdo é generosa (26/09).** Sem o multiplicador de lealdade, a emenda de corte
  na saúde do passeio aparece com 437 votos previstos, contra 386 antes, e a base é 383. O
  multiplicador escondia a logística da pauta (`PIVOT` 58, `SPREAD` 16), que ninguém calibrou
  contra votação real. Calibrar na etapa 4, com o Congresso inteiro;
- **88. Os retratos da Presidência (26/09), pendências dele.** Os 12 rostos das duas folhas
  aparentam de 25 a 45 anos; para disputar é preciso ter 35, e os presidentes reais tomaram posse
  entre 57 e 75. As próximas folhas pedem rostos de 45 a 70. Só a Presidência usa os rostos novos:
  ministros, candidatos e a chefe de gabinete seguem desenhados por código até a decisão 10 do
  [ciclo 33](cycles/33-the-whole-game.md). Fontes em `tmp/asset-sources/portraits/` (com `LEIA.md`);
  recortes em `vendor/posse/avatar-standard.json`;
- **85. As provas do lote 1 do mundo vivo nasceram depois do código (25/09).** Fora da ordem da
  regra. Compensação feita: duas sabotagens (a recusa que não fere; aceitar sem nomear) derrubaram
  as provas certas;
- **81. O limite do § 18 vale para as emendas do jogo? (25/09) — VERIFICAR antes de fechar o
  E0.** O art. 166, § 18 limita só as programações dos §§ 11 e 12 (individuais e de bancada de
  execução obrigatória). A emenda do jogo é a verba prometida às bancadas (`turn.mjs`, achado 71),
  e pode não ser só isso. Não bloqueia o playtest;
- **76. Defesa e Previdência não têm custo político (25/09).** Nenhum canal de opinião ou
  pressão lê essas áreas; a "ordem" lê Segurança e Defesa com peso 0. Proteger Saúde, Educação e
  Infra por 48 meses no jogo passivo: aprovação 12 → 12, dívida 89,9% → 90,0%, Segurança 25,4 →
  21,1. Cortar onde ninguém reclama é realista; sair de graça, não. Calibragem é decisão dele;
- **77. A distribuição do corte quase não tem consequência material (25/09, corrigido). A
  resposta é o lote E1.4.** A
  primeira versão dizia "no jogo prudente o corte é 1,5%": era só o primeiro mês de corte do
  `herdado`, cujo corte cresce até 100%. Medido depois: a `agenda` nunca corta (refaz o gasto
  mensal ao espaço); um plano anual parado dá cortes de 10%–40% em 10 dos 24 relatórios. Mas
  proteger Saúde, Educação e Infra em todo relatório por 4 anos: aprovação 6 → 6, dívida 89,8% →
  89,8%, Infra +1,0, Segurança −0,3. A MALHA lê o gasto total da área; o discricionário cortado é
  fatia pequena, e a resposta é lenta. Liga com 35 e 53;
- **80. Lei pode deixar nível abaixo do piso vigente, e a execução a desfaz (25/09) — a investigar.**
  Na medição do E0 (variante antiga da `agenda` com plano anual), a lei do mês 14 levou
  `aposentadoria-urbana` de 78 para 66 com o piso vigente ainda em 78 (`bandsOf`): a obrigatória
  caiu 116 bi/ano pelo `relief` (`turn.mjs:1776`), e no mês 16 um pedido de 78, dentro da faixa,
  desfez a reforma sem lei. A série oficial não passa por isso (a `agenda` nunca sobe o nível de
  volta). Pergunta para a ESTRATO: a lei que baixa o nível abaixo do piso deveria baixar o piso?;
- **70. A posse é em 5 de janeiro (24/09) — VERIFICADO.** EC 111/2021, art. 82: mandato de
  05/01/2027 a 05/01/2031 (Senado, TRE-PR; mapa §3). `state.mjs` diz 1º de janeiro. Lote B1;
- **71. Emenda individual é impositiva (24/09) — VERIFICADO em parte.** 2% da RCL, execução
  obrigatória (CF art. 166 §§ 9º e 11, EC 126/2022; nota da CMO). **VERIFICAR** bancada,
  comissão, cronograma, impedimento técnico e o que o Executivo negocia (pesquisa R1). A ECLUSA
  usa a verba prometida como moeda discricionária (`turn.mjs:417`). Não se troca por outra moeda
  simplificada. Lote D1;
- **72. O afastamento cai na Câmara (24/09) — VERIFICADO.** Perder na Câmara derruba o presidente
  (`turn.mjs:1523-1536`). Arts. 86 e 52: 2/3 da Câmara admitem, o Senado julga, suspensão ao
  instaurar, 180 dias, condenação por 2/3 do Senado. Lote F, depois do corte vertical;
- **73. O senador arrasta deputados (24/09).** `benches()` não filtra cargo: `senate-centrao`
  leva de 35% a 55% das cadeiras da Câmara do partido dele. Lote D1;
- **75. A gaveta de 6 meses é legado não validado (24/09) — VERIFICAR.** `DRAWER_LIFE = 6` é
  parâmetro de design apresentado como rito. Fica só pela compatibilidade; não entra na ESTRATO,
  no calendário nem no Congresso novo. Na Câmara o arquivamento seria por fim de legislatura
  (RICD art. 105, a conferir, pesquisa R4). Lote B4. Nada marcado VERIFICAR vira coeficiente,
  procedimento ou regra canônica antes da pesquisa;
- **74. O canal tributário está morto (24/09).** `turn.mjs:1451-1452` passa a mesma carga como
  `taxLoad` e `baseTaxLoad`; `taxDelta` é sempre zero. Liga com o item B4 do ciclo 30;

- **69. Prova de voo interrompido oscilou (23/09).** Em `npm.cmd run validate`, a pasta mediu
  719px no corte e 569px dois quadros depois: diferença de 150px, acima do limite de 20%.
  A prova e o código do voo não foram alterados; a prova roda antes das dez asserções novas.
  O passeio inicial e a repetição completa passaram. Causa ainda não isolada; nenhum limite
  foi afrouxado. Evidência: `docs/evidence/gate/validate-flight-failure-2026-09-23.log`; rodada final verde em
  `docs/evidence/gate/validate-final-2026-09-23.log`;
- **66. A carta do arquivamento não existe (21/09).** Ver fila 4;
- **65. `--paper` é cor nos tokens e largura na folha (18/09).** `00-tokens.css` declara
  `--paper: #ffffff`; `.sheet` redeclara `--paper: 720px`. Hoje nada lê a cor dentro da folha; a
  primeira que ler recebe `720px`. Renomear a largura mexe em 15 `calc()` de `46-screen-cabinet-desk.css`;
- **64. O parecer soma mês com ano (11/09).** `UI.brief.treasury` põe `room` (do mês) ao lado de
  `mandatory` e `revenue` (anualizados) e ninguém diz isso. A frase é dele; aberto;
- **63. A promessa da posse saiu do Gabinete (11/09).** Segue no relatório do turno, sumiu da
  mesa. Entra como parágrafo do parecer, ou fica só no fechamento?;
- **53. Não recalibrar a capacidade antes das empresas (21/08).** As empresas entram no E1.1. Pergunta sem resposta: quanto
  tempo uma decisão leva para mudar o país — hoje mais que um mandato em 6 de 8 áreas;
- **52. As sondas espalham; o país premia compromisso sustentado (21/08).** Concentrar 48 meses
  na Saúde: 61 → 71,5; rodar o foco: 61 → 65. Nenhuma tela diz isso;
- **48/37. A Caixa pergunta em 22 de 48 meses passivos; `reported` deu zero.** O relator só
  emenda texto que machuca 2+ alavancas, e ninguém diz isso ao jogador;
- **47. As réguas de Finanças descrevem país 20× mais volátil que o modelo (21/08).** Inflação:
  0,2 de 20 traços em 12 meses. Falta medir no governo ativo. Decisão dele;
- **45. Escadas de Finanças a 0,5rem = 1px por traço (21/08).** Decisão dele;
- **40. "Quem trava a obrigatória" imprime um de três (21/08).** `lockedBy` devolve três;
- **35. Saúde decai rápido na prosa e é das mais lentas no modelo (63 meses de meia-vida).**
  Decidir é recalibrar `yield`/`cost`;
- **22. O que morre antes do plenário (gaveta, relatoria) segue sem medição.** Sonda
  `legislador`: 2 de 39. `ANSWER_TIME = 2` é primeiro chute;
- **23. Travar custa só o relógio.** Se sair de graça, mexer na memória do relator;
- **7/8/10/11/12/26/28.** ECLUSA é primeiro chute (`PIVOT 58`, `SPREAD 16`, `THREAT 85`);
  `bills.mjs` não é catálogo morto: o jogo não o usa, mas é o conjunto de moções das provas da
  ECLUSA (`congress.mjs`) e o catálogo o valida — sai em D1, com essas provas (24/09);
  `Program.weight` e `Program.lag` ninguém lê — decide-se na adaptação da MALHA; `state.norms` cresce sem poda e sem tela; vinculação incide sobre
  a bruta e no mundo é sobre a líquida (RCL — pede terceira fatia de receita); prêmio de risco só
  morde fora da faixa jogada;
- **20. A rua precifica voto e mais nada.** SONDA não toca índice, receita nem despesa. É ciclo;
- **16. Ambições com preço — sobra o sorteio (04/09).** Decisão dele;
- **67. O passeio leva 72s (21/09).** Já foram 120: `pousou()` esperava 2s por animação que não
  vinha, 24 vezes. O que sobra, medido por trecho: laço do anexo 9s, carta na mesa 6s, seção 9
  5s, posse 4s, fonte atrasada 4s; 73 esperas fixas somam 27s. Instrumento: cópia do passeio com
  `mark()` por seção (feito à mão em 21/09, não ficou no repo).

## Como revisar de fora

`/code-review ultra <base>` lê o diff da branch corrente contra `<base>`, teto de 8.000 linhas e
500 arquivos. A branch inteira contra `main` tem 33.000 linhas, então:

- **um trecho recente:** base num commit antigo (`base-ultra` = `679f043`, 18/09 → 7.924 linhas);
- **uma pasta inteira:** base = HEAD sem a pasta; revisada = base com a pasta de volta
  (`base-motor` / `motor-review`, árvore igual à `caixa-de-entrada` por hash). Por três pontos o
  diff de HEAD contra a base sem a pasta é **vazio** — o ancestral comum tem de ser a base;
- achado dela é hipótese até reproduzir. Placar: 9 achados, 9 verdadeiros; detalhe às vezes
  errado (o "pior em dezembro" do teto caiu no meio do ano).

## A série que calibra

Seis das nove sondas (`concentra`, `favoritos`, `legislador` escolhem em vez de espalhar e se
medem à parte). 48 meses, semente padrão, sem partido, governo montado na posse (`--party` compara
outro jogo: com PCN, `agenda` dá 20/42; com PCS, 16/41). Remedidas em 30/09, semente 20270101,
após corrigir remanejamento no redutor; as seis linhas reproduziram os resultados de 26/09.

| política     | dívida/PIB | votações     | indústria | segurança |
| ------------ | ---------- | ------------ | --------- | --------- |
| `herdado`    | 89,9%      | 0 de 0       | 48 → 27   | 38 → 25   |
| `agenda`     | 90,0%      | **20 de 42** | 48 → 20   | 38 → 20   |
| `base`       | 90,7%      | **17 de 42** | 48 → 20   | 38 → 20   |
| `piso`       | 90,9%      | 5 de 37      | 48 → 15   | 38 → 15   |
| `explorador` | 91,8%      | 0 de 6       | 48 → 25   | 38 → 17   |
| `promessa`   | 92,3%      | 2 de 4       | 48 → 19   | 38 → 17   |

Mexeu em `src/data/`, `src/domain/`, `src/application/` ou `src/state/`? remeça esta tabela no
mesmo commit, mesmo que ela não mude.

**A série mudou em 26/09:** 16 partidos, 15 líderes (um por bloco, fora PML e PLI) e a base como
chance. Antes: `agenda` 22 de 43, `base` 18 de 42, `piso` 5 de 26, `explorador` 0 de 0,
`promessa` 0 de 3 e 92,4%. Todas as sondas têm 13 desembarques; em `agenda`, os 13 saem até
o mês 28 e só o PBR fica; sem gabinete (`--cabinet none`), `agenda` aprova 2 de 43 e 14 desembarcam. A linha "a vida"
do simulador conta os gestos de cada sonda.

## O que existe

**Tela:** barra fixa (data, vitais, avançar) + rail (coluna acima de 1181px de largura; dock no
Gabinete) + treze endereços: Gabinete, Email, Congresso & Leis, Finanças, oito áreas, Estado; o
fecho ocupa o Gabinete. Gabinete é a Mesa (cena 1916×821, que só encolhe): pasta com o ato e o
contingenciamento, envelopes que erguem a carta ao centro, telefone. Email é a Caixa em tela
cheia. Vocabulário único em `src/ui/shared/annex.mjs` (guarda `annexes`).

**Dados:** 16 blocos · 513 cadeiras · 8 áreas · 38 programas · 6 regras · 4 grupos de pressão ·
3 faixas de renda · 15 arquétipos.

| coleção            | quantos |
| ------------------ | ------- |
| blocos partidários | 16      |
| cadeiras           | 513     |
| áreas              | 8       |
| programas          | 38      |
| regras             | 6       |
| grupos de pressão  | 4       |
| faixas de renda    | 3       |
| arquétipos         | 15      |

**Motores:** LASTRO (receita, teto, `blocked` × `atRisk`) · ECLUSA (`whipCount`/`vote`/`settle`)
· MALHA (índices, `pushOf`/`liftOf`) · SONDA · ELENCO (semente, sem fluxo de RNG) · CORRENTE
(hiato, Phillips, Taylor, Okun, `carry`) · ESTRATO (faixa derivada, nunca guardada) · DELTA (lido
do catálogo) · VONTADE (agência genérica; o mundo vivo a usa todo mês, em `application/world.mjs`). Os contratos vazios TEMPORAL
e CASCATA saíram em 24/09 e voltam quando tiverem código.

**Composição:** `agenda.mjs` (proposta, rateio) · `turn.mjs` (`bandsOf` → `settlement` →
`ledger` → `situationOf` → `playMonth`) · `public/` (fachada; `boundaries` prova) ·
`simulate.mjs` (nove sondas).

**Verificação de 01/10:** 13 guardas · 68 sintéticas · 531 provas · passeio dentro do `validate`
(geometria, recorte, contraste no pixel, 1440×980 e 1440×900).

## O que ainda não existe

- **empresas com estrutura** — a estatal entra nos lotes E1;
- **choques exógenos** (o antigo TEMPORAL) — o canal `shock` de CORRENTE existe e ninguém o alimenta no jogo;
- **carta do arquivamento** do processo de afastamento (achado 66);
- **tensão institucional** — variável de estado, não motor;
- **contraste em texto com filho elemento** — o medidor não alcança (`standards.md` §7);
- **layout de força para o DELTA** — grafo lido, peça que desenha não;
- **Liquid Glass de alta fidelidade** — especificação em `research/12`; implementação futura;
- **GitHub Pages** — só CI por enquanto.

## Decisões fechadas que não se reabrem sem pedido

Fase 1 só o Brasil · 48 turnos mensais hoje, e a semana é direção da especificação · inglês no código, português na prosa · cascata
declarada · codinomes de motor · zero build/runtime · lealdade serializada · motor nenhum chama
outro · Congresso responde ao pago · rateio proporcional · âncora é o teto que vigorou · tela
pergunta, previsão usa o pago · rascunho morre com o mês, salvo o decreto de proteção, que vale até o relatório bimestral (ordem dele, 25/09) · tudo é alavanca com preço · posição
calculada, rito sai do conteúdo, jogador não inventa substantivo · catálogo cita fonte · Finanças
sem controle · ordem entre normas total (hierarquia, especificidade, recência, escrita) · geral
não revoga especial sem nomear · faixa derivada, nunca guardada · pessoa é semente (save guarda
memória) · elenco sem RNG · ambição é preço, traição pesa mais que favor · déficit primário tem de
rodar · preço escala com dispersão · layout é promessa · sem presidente sem partido (CF 14, §3º,
V) · federação = coligação com preço para romper · barreira pode matar o partido no ano 4.
**Princípio: tudo tem um jeito de ser feito — o que separa o possível do impossível é o preço.**

Referências de jogo: Football Manager, Democracy 4, Suzerain, Crusader Kings, Victoria 3 e Hearts
of Iron, da Paradox; Geopolitical Simulator.

## Fontes de modelagem

Campo real em [`docs/research/`](research/) (pesquisas 01 a 16); a 09 é o checklist do cargo e a
04 lista os sete buracos por realismo ganho. Correções do dossiê externo estão na prosa de cada
arquivo de dado (`parties`, `fiscal`, `macro`, `congress`, `economy`, `turn`).
