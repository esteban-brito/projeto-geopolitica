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
nova é o HTML do Claude com trechos trocados por texto dentro de `tools/prepare-posse.mjs`.

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
`vendor/posse/project/`. O push levou `caixa-de-entrada` de `ed9f2cc` até hoje, e a branch
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
antes (`tests/browser/posse-defects.mjs`). A comparação e a auditoria de UI declaram a única
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
`tests/browser/review-portraits.mjs` e dá o mesmo relatório na folha aprovada B
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
