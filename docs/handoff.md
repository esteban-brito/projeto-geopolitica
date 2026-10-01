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
  - o plano em [piloto](spec/dynamic-government.md) §11 e o contrato em
    [governo variável](spec/dynamic-government.md);
  - a [auditoria dos planos](archive/plan-audit-2026-09-29.md), com 12 achados;
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

## Estado do motor e do processo

As seções longas de antes de 01/10 estão inteiras em [handoff arquivado](archive/handoff-2026-10-01.md).

- **E0** (o corte do bimestre, [ciclo 31](cycles/31-the-bimonthly-cut.md)): implementado em
  `febd0b5` e pausado em 25/09. A reunião foi reprovada no playtest porque a decisão do corte não
  pesa no modelo (achado 77).
- **VONTADE:** lotes A1, A1.1, A1.2 e A2a commitados (`98c1abc`, `a690248`, `5ba154c`); o mundo
  vivo, lotes 1 e 2, decide por ela todo mês ([o mundo vivo](spec/the-living-world.md)). O A2b espera.
- **Autoridade de design:** a [especificação mestra](spec/master-spec.md) 1.1; o
  [mapa de migração](spec/migration-map.md) liga cada subsistema à especificação.
- **Ciclo 29 (simplificar):** itens 2 e 3 feitos; a meta de prosa (até 20% no jogo, 25% por
  arquivo) segue aberta, com o domínio perto de 41% na última medida.
- **Revisão externa:** 2 dos 3 ultrareviews grátis gastos; 9 achados, os 9 reproduzidos e 7
  corrigidos. As bases (`base-ultra` `679f043`, `base-motor` `bb7ce9d`, `motor-review` `fc78e27`)
  foram apagadas e se recriam pelos hashes.
- **Pesquisa 13** (do Gemini): não validada; nada dela vira regra sem fonte conferida.
- **Medido:** save no mês 48 com 35.387 bytes; `playMonth` 0,64 ms; `settlement` 0,125 ms;
  pintura de 3 a 5 ms; abertura em 600 ms.

## Fila, em ordem

**Agora (01/10):** a organização fechou; funcionalidades novas seguem suspensas.

1. **Ele testa o protótipo da posse** (`prototypes/posse/README.md`). Os achados do teste,
   reproduzidos, entram antes de qualquer ampliação; os cinco defeitos de 01/10 (bloco acima)
   são a primeira fila de consertos, com ordem dele.
2. **Revisão do trabalho do Codex pelo Claude**, que decide o que fica e o que se refaz:
   o conserto do redutor, `posse.mjs` na fachada, a estrutura e a busca, o gerador por
   substituição de texto e os quatro ensaios só de prova.
3. **O plano do protótipo**, depois do teste: [governo variável](spec/dynamic-government.md) §7,
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

Ordens dele, da mais nova para a mais antiga. O texto inteiro de cada uma, até 01/10, está no
[handoff arquivado](archive/handoff-2026-10-01.md).

- **01/10, o trabalho do Codex:** de 28 a 30/09 ele usou o Codex porque a cota do Claude acabou, e
  o considera muito inferior. O Claude decide o que se aproveita. Limpeza e profissionalismo
  sempre; plano antes de executar, e ele autoriza.
- **30/09, o protótipo da posse:** testar só o protótipo, e aprimorar durante o uso; F5 recomeça
  sem guardar escolhas. A tela é a do Claude, comparada linha por linha; controle novo usa as
  peças existentes. Sem precedente histórico, sem ministérios "próximos" fixos e sem reação
  genérica: palavras-chave acham trabalho por ID e não fabricam poder, recurso nem experiência.
- **29/09, governo variável:** os números dele eram exemplos; nada de cota de carreiras,
  ministérios ou encaixes. Planejar por responsabilidade, experiência, capacidade e consequência.
- **26/09, a interface nova:** o motor fica e a interface recomeça sobre a fundação, no estilo
  Apple + Football Manager + Civilization + Valorant ([ciclo 32](cycles/32-the-new-interface.md)).
  A posse é a primeira tela e o padrão das outras; a estrutura da versão 25 está aprovada.
- **26/09, a posse e a base:** a base do começo segue o protótipo, fiel à realidade e pesquisada
  antes do motor; o começo do jogo cria o Presidente (nome, partido, sexo, nascimento e mais).
  As seis trajetórias (político, militar, jurista, empresário, ativista, celebridade) têm de pesar.
- **26/09, o ministério:** aumentar e diminuir pastas, com realismo; gente de fora da política,
  com 33 notáveis de nome inventado e temperamento que varia pela semente; fama e afinidade de 1
  a 5 para todos.
- **26/09, o ciclo 33:** aprovado (decisões 1, 5 e 9). A rota fora da lei entra na etapa 10,
  "contanto que seja realista, pode tudo"; três destinos extremos têm de ser alcançáveis.
- **25/09, o que é o jogo:** sandbox ideológico com regras reais; realismo acima de tudo
  ([jogo em uma página](spec/game-in-one-page.md)). Foco nacional: o internacional entra numa
  atualização futura, listada no jogo. O jogador escolhe qualquer partido.
- **25/09, lições do playtest do E0:** encontro vira cena com rostos e fala curta; nada de pop-up;
  toda decisão mostra quanto custa, quem reage e quanto tempo leva.
- **25/09, a semana:** o botão avança uma semana, com manhã, tarde e noite; o Vice pode ir no
  lugar do Presidente; telefonar sem limite fixo ([a semana](spec/the-week.md)).
- **25/09, o mundo vivo:** pessoas decidem pela VONTADE, sem diretor de drama; o ritmo vem do
  calendário real ([o mundo vivo](spec/the-living-world.md)).
- **25/09, o E0:** os ministros lembram entre bimestres; o decreto de proteção vale até o
  relatório bimestral seguinte (feito, `state.decree`).
- **25/09, laboratório sem pressa:** tela nova nasce em dois ou três protótipos para ele comparar.
- **25/09, pesquisa:** toda pesquisa com fonte é do Claude; no Planalto, baixar com `curl`, porque
  o WebFetch leva ECONNRESET. O GPT-6 Astra serve à revisão adversarial
  ([pesquisa 16](research/16-openai-gpt6-for-the-project.md)).
- **25/09, processo:** um lote, implementação, uma revisão principal, correção e commit.
- **24/09, codinomes:** provisórios, revistos numa etapa própria; nunca no código executável.
- **23/09, o cargo:** máxima fidelidade ao que um presidente faz, combinando reuniões e
  despachos; empresas fictícias reconhecíveis; nenhum prazo de efeito ou crise obrigatória sem fonte.
- **23/09, o Gemini:** commita com `git add` por nome, nunca `-am`.
- **pendente desde 21/09:** a lista de bugs que ele viu ("são muitos, nem sei como escrever");
  cada um vira prova quando chegar.

## Achados abertos

Um achado que fecha sai daqui para o journal. Número com data: remeça antes de repetir.

- **P04–P12. Contratos abertos da [auditoria dos planos](archive/plan-audit-2026-09-29.md) (29/09).**
  Cada um fecha antes da etapa que depende dele: P04, o relógio (semana civil contra blocos de sete
  dias e o fim do mandato em 04/01/2031); P05, MP com vigência e perda de eficácia, que a inversa
  estrutural não resolve; P06, o sobrestamento por MP não tranca toda a pauta (STF, MS 27.931);
  P07, `POWER_STEPS` rebaixa o rito pela barra de poder, reproduzido em `riteFor`; P08, contas
  da estatal separadas do Tesouro, e o capital da ficha soma só 98,26%; P09, portão jurídico com
  ator e procedimento, não um dado com nome de tribunal; P10, o recorte mínimo de informação de
  cada etapa; P11, voto firme é estimativa (diferença de 1,76 cadeira entre as somas); P12, aceite
  com predicados de regime fixados antes do ensaio;
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
