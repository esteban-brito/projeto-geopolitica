# Decisões vivas e achados abertos — texto inteiro em 01/10/2026

> Congelado quando o handoff encolheu. O estado de hoje está no [handoff](../handoff.md).

## Decisões vivas

Ordens dele, da mais nova para a mais antiga. O texto inteiro de cada uma, até 01/10, está no
[handoff arquivado](handoff-2026-10-01.md).

- **01/10, o elenco inspirado na vida real:** cerca de 40 papéis que pesam no 1º ano; nome
  inventado; papel, ideologia e temperamento inspirados no real, sem episódio real na história do
  personagem. Os eleitos esperam o 2º turno de 25/10/2026, para entrar com as bancadas reais de 2027.
- **01/10, a interface evolui a partir da atual:** revisa a ordem de 26/09 ("recomeça do zero").
  A posse se constrói dentro do jogo, no sistema de desenho que existe (tokens, fontes, Liquid Glass,
  mola, ícones, textos), e substitui o formulário de nova partida. O estilo do ciclo 32 entra como
  evolução do jogo inteiro, nunca como segunda aparência. Autorizada a versão 22 do save para
  gravar a estrutura de ministérios da posse.
- **01/10, antes de construir, objetivos:** ele pediu auditoria dos planos e objetivos claros, porque
  "nem eu sei o que eu almejo desse jogo". O ciclo 34 espera essa definição.
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
  Apple + Football Manager + Civilization + Valorant ([ciclo 32](../cycles/32-the-new-interface.md)).
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
  ([jogo em uma página](game-in-one-page-2026-09-25.md)). Foco nacional: o internacional entra numa
  atualização futura, listada no jogo. O jogador escolhe qualquer partido.
- **25/09, lições do playtest do E0:** encontro vira cena com rostos e fala curta; nada de pop-up;
  toda decisão mostra quanto custa, quem reage e quanto tempo leva.
- **25/09, a semana:** o botão avança uma semana, com manhã, tarde e noite; o Vice pode ir no
  lugar do Presidente; telefonar sem limite fixo ([a semana](../spec/the-week.md)).
- **25/09, o mundo vivo:** pessoas decidem pela VONTADE, sem diretor de drama; o ritmo vem do
  calendário real ([o mundo vivo](../spec/the-living-world.md)).
- **25/09, o E0:** os ministros lembram entre bimestres; o decreto de proteção vale até o
  relatório bimestral seguinte (feito, `state.decree`).
- **25/09, laboratório sem pressa:** tela nova nasce em dois ou três protótipos para ele comparar.
- **25/09, pesquisa:** toda pesquisa com fonte é do Claude; no Planalto, baixar com `curl`, porque
  o WebFetch leva ECONNRESET. O GPT-6 Astra serve à revisão adversarial
  ([pesquisa 16](../research/16-openai-gpt6-for-the-project.md)).
- **25/09, processo:** um lote, implementação, uma revisão principal, correção e commit.
- **24/09, codinomes:** provisórios, revistos numa etapa própria; nunca no código executável.
- **23/09, o cargo:** máxima fidelidade ao que um presidente faz, combinando reuniões e
  despachos; empresas fictícias reconhecíveis; nenhum prazo de efeito ou crise obrigatória sem fonte.
- **23/09, o Gemini:** commita com `git add` por nome, nunca `-am`.
- **pendente desde 21/09:** a lista de bugs que ele viu ("são muitos, nem sei como escrever");
  cada um vira prova quando chegar.

## Achados abertos

Um achado que fecha sai daqui para o journal. Número com data: remeça antes de repetir.

- **P04–P12. Contratos abertos da [auditoria dos planos](plan-audit-2026-09-29.md) (29/09).**
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
  [ciclo 33](../cycles/33-the-whole-game.md). Fontes em `tmp/asset-sources/portraits/` (com `LEIA.md`);
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

- **66. A carta do arquivamento não existe (21/09).** Está na fila, item 6;
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
