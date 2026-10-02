# Journal

O que cada sessão fez e por quê, da mais velha para a mais nova. Uma entrada por sessão:
`### N · título — dd/mm/aaaa`, depois o que mudou, o número que sustenta e o que ficou para depois.
Estado de hoje se lê no [handoff](handoff.md); número daqui se remede antes de repetir. O registro
de 13/08 a 30/09/2026 está congelado em [`docs/archive/journal-2026-08-13-to-09-30.md`](archive/journal-2026-08-13-to-09-30.md).

### 123 · O Claude volta, confere o Codex e fecha a organização — 01/10/2026

De 28 a 30/09 ele trabalhou só com o Codex, porque a cota do Claude tinha acabado. Ele acha o
Codex muito inferior e me deu a decisão sobre o que se aproveita. Antes de mexer, li os
contratos, o handoff, as especificações, o plano de organização, a auditoria dos planos, o
rascunho arquivado de 28/09 e o código novo, e joguei o protótipo no navegador.

O que o Codex deixou e se sustenta: a estrutura de ministérios por IDs (`prototypes/government/index.mjs`),
com inversas que preservam transferências posteriores, e a busca booleana nas atribuições. O que
roda só em prova: `pilot`, `operations`, `demand` e `management`, com unidades inventadas. A tela
nova é o HTML do Claude com trechos trocados por texto dentro de `prototypes/posse/tools/prepare-posse.mjs`.

Jogando a posse, achei cinco defeitos: "Vai para Escolher destino." com o nome do botão na frase;
destinos na ordem do ID interno; a base vira "—" e o hemiciclo apaga depois de qualquer reforma;
uma reação genérica da chefe de gabinete sem motor atrás; atribuições em minúscula só na criação.
Os 49 erros de template no console já existiam no original. Não consertei: funcionalidade segue
suspensa até ele testar.

A organização fechou. A fase 0 mostrou `check` com 43 achados de `tokens`: o HTML gerado da posse
estava em `prototypes/`, e a guarda lia o CSS do protótipo. A saída foi para `tmp/build/posse.html`,
idêntica byte a byte, e o gerador passou a calcular o caminho relativo. A guarda não mudou. A
cadeia de 15 patches remontou `Posse.dc.html` idêntico numa cópia, desde que ache
`tmp/asset-sources/portraits/`; ela também está inteira no ZIP de `docs/evidence/`. Então
`tmp/posse/` foi movida para `tmp/history/posse/`, e os 33 registros soltos para
`tmp/history/recovery-2026-09-30/`: 119 arquivos, hash igual antes e depois, nada apagado. O
verificador de retratos do Codex passou a ler `vendor/` e gravar em `tmp/reports/`. As cinco
provas de navegador da posse e a auditoria da UI passaram; nenhuma evidência congelada mudou.

Os backups de `Desktop/cld-backups/` foram abertos e comparados por hash com a pasta de hoje. Os
bundles e os `.tar.gz` de 28 e 29/09 não têm nada sem cópia além de versões antigas. O `.tgz` de
26/09 guarda 140 arquivos únicos: as três auditorias da posse pelo Codex e peças antigas da
montagem. Tudo está no mesmo disco, e o remoto parou em 24/09.

READMEs dos dois protótipos (de 250 para 50 linhas no do governo), guia do agente, mapas de
capturas e evidências e o handoff foram reescritos; o handoff caiu de 804 para cerca de 600
linhas, com a narrativa de 28 a 30/09 já guardada nas entradas 103 a 122.

### 124 · Limpeza aprovada: repositório público, ensaios do Codex e a posse — 01/10/2026

Ele aprovou o plano inteiro. O repositório no GitHub é público e não recebia push desde 24/09.
Antes de publicar, os três commits locais do dia foram refeitos sem o runtime do canvas (React
com licença MIT mais código do claude.ai sem licença declarada) e sem o ZIP de 9,5 MB; os dois
ficaram no disco, e o runtime passou a ser ignorado. Saíram também 3,1 MB sem uso de
`prototypes/posse/vendor/project/`. O push levou `caixa-de-entrada` de `ed9f2cc` até hoje, e a branch
remota `acoplamento-e-simulador`, igual ao `main`, foi apagada. Com o histórico publicado, a
pasta `Desktop/cld-backups/` (350 MB) foi apagada; os relatórios em texto das três auditorias
da posse de 26/09 ficaram em `tmp/history/posse-audits-2026-09-26/`.

Saíram os ensaios `pilot`, `operations`, `demand` e `management` (3.118 linhas com provas e
demos): um motor de capacidade paralelo à MALHA, que a especificação proíbe no laboratório. As
ideias que valiam foram para o contrato consolidado do governo variável (127 linhas no lugar de
1.084). O piloto, a auditoria dos planos, o plano de organização, `world-design.md` e as seções
longas do handoff foram para `docs/archive/`; os achados P04 a P12 da auditoria entraram no
handoff, que caiu de 804 para 381 linhas.

Quatro defeitos da posse foram consertados no gerador, cada um com prova de navegador que caiu
antes (`tests/browser/posse/defects.mjs`). A comparação e a auditoria de UI declaram a única
mudança de texto. Brechas fechadas: `prototypes/` entrou nos tipos e no verificador de links,
que achou 22 referências a arquivos apagados ou movidos; `npm run posse` roda as seis provas e
a auditoria; `npm run serve` gera a posse antes de subir. `validate` verde com 471 testes.

Depois do push, ele disse que o F5 da posse não está polido e que o foco é só a versão nova,
podendo refazê-la do zero. Gravado quadro a quadro: a frase da idade mínima aparece inteira aos
130 ms, fora da animação; o brilho de fundo para numa borda em y = 800; as fontes vêm do Google
Fonts; com a CPU 4 vezes mais lenta, a montagem trava 158 ms e a animação, 55 ms. A frase cita
a Lei 15.230/2025, conferida no Planalto: a idade do candidato ao Executivo conta na data da posse.

### 125 · Limpeza, fases 1 a 4: um contrato, uma autoridade por assunto, acentos — 01/10/2026

**Um contrato.** `AGENTS.md` junta leis, fluxo, agentes e mapa do código; `CLAUDE.md` e
`GEMINI.md` só o importam. O Codex saiu. O verificador de retratos dele virou
`tests/browser/posse/review-portraits.mjs` e dá o mesmo relatório na folha aprovada B
(`3:unusual-vertical-position`).

**Uma autoridade por assunto.** Foram 34 documentos para `docs/archive/` (ciclos 01–31, o jogo em
uma página, o mapa das telas, o estudo de porte da posse), mais o journal até 30/09, congelado.
Especificações, ciclos e pesquisas ganharam índice com situação. Um script moveu os arquivos e
corrigiu 179 referências; zero links quebrados. O ciclo 34 foi reescrito para a posse dentro do
jogo: estrutura em `src/domain/structure/`, save 22, seis fases.

**Acentos.** Foram 7.336 palavras de 691 formas inequívocas, em 132 arquivos, só em comentário,
nome de teste e documento ativo. Cada arquivo foi conferido: sem diacríticos, igual ao HEAD. O
`prose-only` deu código idêntico em 90 dos 115 arquivos de código; nas outras 25 suítes só mudou
o nome dos testes. A forma ambígua (`e`/`é`, `esta`/`está`, `a`/`à`) fica para um lote do Gemini.

Três guardas liam a prosa só em ASCII. A `material` procurava `MECA O FPS`. A `prose` tomava o
"o" final de "aprovação" por artigo e não conhecia "até", "após" e "já": uma frase cortada em
"até" passava, provado contra a guarda antiga. A `naming` tirava strings por regex e saía de fase
numa regex literal com aspas. As três foram consertadas sem afrouxar; a `naming` agora lê pelo
tokenizador `acorn`, declarado em `devDependencies`, e ganhou duas provas; a `prose`, uma. Entrou
a 14ª guarda, `accents`, com 678 palavras em `tests/lib/accents.mjs`, e `tools/accent-only.mjs`
para conferir lote de acento.

**O passeio.** Durante o trabalho, 4 de 10 rodadas caíram, cada uma numa asserção de tempo. O
diff não muda código. Com os 12 núcleos ocupados, o HEAD caiu 2 de 2 nas mesmas três asserções:
o achado 69 foi reaberto com a receita. E um erro de processo: um `| tail` engoliu o código de
saída do `prettier`, e o commit `7e58739` subiu com 4 arquivos fora do formato, corrigidos no
`dd27945`.

### 126 · O achado 69 fecha: o voo da pasta tinha dois relógios — 01/10/2026

O `validate` caiu 6 vezes em cerca de 13 rodadas no dia, cada vez numa asserção de tempo do
passeio. Com os 12 núcleos ocupados, o HEAD caiu 2 de 2 nas mesmas três. Eram três causas:

- **O voo da pasta (defeito do jogo).** `whereIs` calculava a posição pelo `performance.now()` do
  clique, e a animação WAAPI só começa a contar no quadro seguinte. Com quadro longo, a conta ia à
  frente da pasta pintada, e o voo interrompido partia de um ponto onde ela não estava. A prova
  nova trava a página 150 ms depois de erguer a pasta e mede o salto no corte, antes do próximo
  quadro: no código antigo, 713 px na tela contra 738 px no voo novo. O conserto pergunta à própria
  animação (`currentTime`), e `tune` lê a posição antes de cancelar as animações.
- **A pílula (defeito da prova).** A mola limita o passo por quadro de propósito, e a viagem de
  ~450 ms passava dos 700 ms fixos com a CPU ocupada. A prova agora espera a chegada.
- **A troca de tela (defeito da prova).** Contar as animações `::view-transition` deixa passar o
  vão antes de elas nascerem; o e-mail tinha um remendo de 120 ms. As duas esperas agora perguntam
  `:active-view-transition`, que vale do pedido ao fim da troca.

Depois do conserto: verde sem carga e 2 de 2 verdes com os 12 núcleos ocupados.

### 127 · O repositório como um mapa — 01/10/2026

Ordem dele: criar, apagar, mover e renomear até tudo ficar arquitetado como um mapa. Quatro
etapas, cada uma com portão verde e commit.

- **Documentos:** 18 nomes sem o prefixo "the-"; o handoff caiu de 388 para 254 linhas, com o
  texto inteiro das decisões e dos achados em `docs/archive/`; saíram `tmp/base`, `tmp/reports` e
  o canal do Codex; 11 evidências sem citação foram para o arquivo. O achado 85 fechou: a
  compensação de 25/09 (duas sabotagens) já cobria as provas nascidas depois do código.
- **Assets e protótipo:** as fontes foram para `assets/fonts/` e ganharam o texto da licença OFL,
  que faltava num repositório público; o canvas, as ferramentas e as provas da posse ficaram junto
  do protótipo, e `vendor/` sumiu. A página da posse montava o caminho da ponte a partir de
  `tmp/build/` sob uma `<base>` de outra pasta, e só funcionava porque as duas tinham a mesma
  profundidade.
- **Código:** `app.mjs` virou `src/main.mjs`; `src/app/`, que se confundia com
  `src/application/`, virou `src/shell/`; `src/ui/shared/` se dividiu em `core/` e `components/`.
  As guardas seguiram as pastas sem perder prova.
- **O mapa escrito:** a árvore inteira está no `README.md`; as regras de camada, no `AGENTS.md` §9.

Dois defeitos achados no caminho: a guarda `accents` tomava `the-base-model.md` por inglês e pulava
o comentário inteiro; e a ferramenta de mudança não via arquivos fora do Git, como o runtime do
canvas. Os dois foram corrigidos antes do commit.

### 128 · Os ADRs e a pasta docs no padrão — 02/10/2026

Os três ADRs ganharam um formato só: título `ADR NNNN — frase`, a linha de situação dizendo o que
vale hoje, data, decisor e emendas, e as seções Contexto, Decisão, Por quê, Consequências e Emendas.
A ADR 0001 deixou de descrever como vigentes o veredito e a narração por IA e a emenda de 04/09,
que a ordem de 29/09 (IA por API não entra) tinha derrubado; a ADR 0002 tirou o modelo em tempo de
jogo da busca; a ADR 0003 juntou as emendas de 24/09 e 01/10. A pasta ganhou índice, como as outras.

Na auditoria dos 46 documentos ativos: 10 pesquisas ganharam o título "Pesquisa NN — …"; os ponteiros
para onde a regra mora foram para o `AGENTS.md`; "o responsável" virou "o Diretor"; o revisor de
cada etapa do ciclo 33 deixou de ser o Codex; a especificação mestra aponta para a visão e para o
índice, em vez do jogo em uma página arquivado. Citação histórica correta ficou como estava.

### 129 · A evidência limpa e a parte A dos acentos — 02/10/2026

- **A evidência:** ficaram os 23 arquivos que o código, as folhas e os créditos citam. Saíram 19
  registros de 29/09 a 01/10 (cerca de 5,7 MB), que só o journal e o arquivo citavam, para
  `docs/archive/evidence/`; o registro que a auditoria da posse lê foi para junto do canvas. Dois
  links desses registros já estavam quebrados, porque a pasta não passava pela verificação.
- **Os acentos de contexto, parte A:** o Gemini acentuou 1.345 palavras em 20 arquivos do domínio,
  da aplicação, do estado e da fachada (`212a8ac`). Cada arquivo passou por `tools/accent-only.mjs`
  enquanto ele trabalhava, e o Claude revisou o sentido dos 185 pares ambíguos: todos certos.
- **Um erro do Claude no caminho:** a mudança dele na ferramenta de conferência estava sem commit;
  o Gemini, seguindo o lote, a desfez, e o vigia passou a rodar cego. A ferramenta ganhou
  `--ignore-case` com commit, o vigia passou a acusar qualquer falha, e o `AGENTS.md` ganhou a regra:
  com o Gemini trabalhando, nenhuma mudança do Claude fica sem commit.

### 130 · Os acentos de contexto completos — 02/10/2026

O Gemini acentuou o que só a leitura decide em todo comentário de código e documento ativo, em cinco
partes: A (`212a8ac`), B (`8781a4b`), C (`0c43548`), D (`cc4ab69`) e E (`98b8c84`), com 165
arquivos no total. Um vigia rodava `tools/accent-only.mjs --ignore-case` a cada 20 s; o Claude
revisou o sentido de cada par ambíguo antes de cada commit.

Os erros e como se resolveram:

- o Gemini apagou uma linha de comentário, juntou outra e acrescentou um "de"; a conferência dele
  mesmo pegou os três, e ele desfez antes da devolução;
- uma crase errada passou pela máquina, porque só o sentido a pega ("ficaram verdes às duas
  vezes"); o Claude a corrigiu;
- dois defeitos antigos apareceram na revisão: caracteres chineses no lugar de "cooperação" na
  pesquisa 09, desde 09/09, e "exececao" num comentário de folha. Os dois foram corrigidos.

A medida que o Claude fez da parte E superestimava o trabalho: das 976 linhas sem acento com
palavra ambígua, quase todas tinham "e" conjunção, que está certo. Só a pesquisa 09 estava
inteira sem acento.

### 131 · O Jev, o corretivo do Gemini e a revisão antes de desligar — 02/10/2026

- **O Jev, da TypeSafe AI:** pesquisado nas fontes da empresa, ele devolve decisões tipadas com
  probabilidade, por API. Serviria só fora do jogo (jogador sintético nos testes, equilíbrio com
  estilos, classificar dado) e só com a ADR 0001 reaberta; a avaliação está na
  [pesquisa 22](research/22-typesafe-jev.md) e a ideia, em espera na fila do handoff.
- **O corretivo do Gemini:** os cinco erros dele no lote de acentos viraram regras do lote mecânico
  no `AGENTS.md` §6: só o que o lote pede, conferência antes do próximo arquivo, dúvida e texto
  estranho listados na devolução e nunca corrigidos por conta própria.
- **A revisão antes de desligar:** uma varredura dos arquivos vivos achou dois comandos de exemplo
  com caminho anterior à mudança de pastas, em `docs/standards.md` §9 e no README do protótipo de
  governo; os dois foram corrigidos.
