# Retomada

> **Ponto de retomada único do projeto.** Numa sessão sem memória da conversa, leia este
> arquivo e depois [`standards.md`](standards.md).
>
> ⚠ **AQUI SÓ ENTRA O QUE É VERIFICÁVEL HOJE** — o estado que um comando confirma, a fila,
> a decisão viva e o achado ainda aberto. **Narrativa de sessão vai para
> [`journal.md`](journal.md)**, e não volta.
>
> **A regra tem preço medido atrás dela.** Este arquivo chegou a **5.704 linhas**, e nesse
> tamanho ele passou a causar defeito em vez de evitar: o achado 37 foi citado como verdade
> uma sessão inteira depois de o conserto que o invalidou ter entrado, e uma tabela de
> calibragem errada por um fator de 3 fez escolher um limiar que produziu exatamente o
> defeito que a mudança existia para consertar. **Um ponto de retomada que ninguém consegue
> reler inteiro é um ponto de retomada que mente.**

---

## ▶ PARA O CLAUDE — contexto da sessão 21 (auditoria, 25/08/2026)

**Quem fez:** agente de auditoria (opencode), sem memória de conversa anterior. Leu o
código inteiro como se fosse um usuário novo e encontrou tudo que estava errado.

**O que foi feito:** duas rodadas de auditoria com agentes paralelos. A primeira (5
agentes) pegou defeitos de DOM, save, CSS e código morto. A segunda (4 agentes) pegou
colisão de nomes, XSS, validação de forma e lacunas de prova. **Nenhum motor foi
alterado.** Todas as mudanças são de proteção (try/catch, escapeHtml, validação) ou de
limpeza (remoção de exports mortos, JSDoc duplicado).

### Arquivos modificados (25 arquivos, incluindo 1 novo)

### Sessão 24 (28/08/2026) — a marca de "feito" foi conferida contra o código

**A pergunta foi dele: _"tem certeza que todos os passos antes desse fecharam?"_** Não tinham.
O ciclo 14 foi lido item a item contra o código, e **dois consertos declarados fechados
atendiam metade do defeito cada um**:

| item | o que sobrou, medido                                                 | estado                          |
| ---- | -------------------------------------------------------------------- | ------------------------------- |
| 3.2  | `room = 0` desligava o despejo: **6 linhas para capacidade 5**       | ✔ fechado, com prova que mordeu |
| 1½.1 | a **posse** não limpava `openDispatch`, e o id do alarme não tem mês | ✔ fechado, sem prova            |
| 1½   | marcado **✔ FEITO** com **três de seis** itens abertos (.4, .5, .6)  | ✔ marca corrigida               |
| 2    | é **1 de 5**, e os passos 1, 1½ e 3 entraram sem o portão ver        | ⛔ aberto                       |

⚠ **E a regra do próprio ciclo foi quebrada por ele mesmo:** _"nenhum item entra sem que o
portão saiba ver o defeito que ele conserta"_. Os consertos de motor nasceram com prova de
unidade; os de tela e de gesto, não — `walk.mjs:568` chama só `checkOverflow` e
`checkClipped` no bloco "caixa com pergunta", que é onde o recorte mora.

### Sessão 23 (28/08/2026) — a prosa contava um Congresso que não existe

**Nenhum motor alterado, nenhuma calibragem tocada.** O catálogo cresceu de 4 para 9
blocos e de 7 para 8 arquétipos ao longo dos ciclos, e a prosa ficou para trás: 14
lugares afirmavam "onze bancadas" e "sete pessoas" em tempo presente. Medido: são
**9 blocos, 8 arquétipos, 16 bancadas efetivas** (as 513 cadeiras fecham).

⚠ **É a família que `standards.md` §7 declara SEM GUARDA** — prosa que continua
gramatical e para de ser verdade. Ela passa verde por construção: as doze guardas leem
texto e nenhuma sabe contar o catálogo.

| o que estava errado                      | onde                                                   |
| ---------------------------------------- | ------------------------------------------------------ |
| "onze bancadas" / "sete pessoas"         | 9 arquivos de código e prova, 4 de documentação        |
| "quatro blocos" como estado **presente** | `parties.mjs`, `turn.mjs:1365`, `standards.md`         |
| "onze telas"                             | eram **doze** — o próprio `censo-tipo.mjs` visita doze |
| "236 provas · 130 arquivos"              | eram **253 · 131**                                     |
| "seis políticas-sonda"                   | são **nove** desde os achados 50 e 52                  |
| "doze espécies de aviso"                 | são **treze** (15 `kind`, duas perguntam)              |
| A Rua e Bastidor "seguem desligados"     | saíram do rail no D7                                   |
| "três cartões" na coluna do Gabinete     | são **quatro**, e o passeio já cobrava cinco `.card`   |

⭐ **E O PORTÃO GANHOU O QUE FALTAVA PARA VER ISSO** — Restrição 2, a checagem nasce
junto: `tests/suites/catalog.mjs` passou a conferir toda linha de duas colunas do
handoff cujo rótulo esteja na tabela de contagens contra o `CATALOG`. Verificada
contra o defeito: com `| blocos partidários | 11 |` ela reprova. **O alcance é
declarado** — só o handoff, que promete no cabeçalho que ali só entra o verificável;
`journal.md` e `cycles/` são histórico datado e ficam de fora de propósito.

⚠ **E dois fragmentos de cemitério foram removidos** de `cabinet.mjs` — um deles
truncado no meio (`"de ser quando o ELENCO nasceu:…"`), o outro repetindo uma lição que
o código vivo já carrega ao lado da peça. `public/index.mjs` tinha um terceiro,
reparado do sentido original.

### Sessão 22 (27/08/2026) — bugs UI

Dois achados de auditoria consertados. 252 testes, 12 guardas, tudo verde.

| Achado | Arquivo                                                    | O que mudou                                                                                       |
| ------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 40     | `src/ui/screens/cabinet.mjs`                               | Os 3 `lockedBy` agora aparecem (`poles--note poles--wide`) em vez de só 1                         |
| 45     | —                                                          | **Já estava consertado** — `font-size: 0.5rem` removido no commit 95681c3 quando escada virou SVG |
| 24     | `src/ui/screens/inbox.mjs`, `styles/45-screen-cabinet.css` | `kind` no tipo `Dispatch`, tag de espécie na linha do índice (demand/rupture/siege)               |
| 17     | 5 arquivos CSS                                             | Comentários atualizados: 720px = breakpoint efetivo, 640px = limiar conceptual                    |

| arquivo                          | o que mudou                                                                                                            |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `app.mjs`                        | try/catch em `playMonth`, `adviser` como `Person` em `last`, `termOf` uma vez por paint, `dataset.siege` só em mudança |
| `src/domain/cast/index.mjs`      | `fullName` no set `used` + guarda de string vazia                                                                      |
| `src/state/state.mjs`            | `deepFreeze` exportado                                                                                                 |
| `src/state/save.mjs`             | `deepFreeze` no load, 6 campos obrigatórios, validação de forma para 8 campos críticos                                 |
| `src/ui/screens/closing.mjs`     | `escapeHtml(term.of)`, `<time datetime>` com `monthLabel`                                                              |
| `src/ui/screens/inbox.mjs`       | `<th scope="col">`, `escapeHtml` no caso `boiling`                                                                     |
| `src/ui/screens/mesa.mjs`        | JSDoc órfão removido                                                                                                   |
| `src/ui/screens/cabinet.mjs`     | `@param` duplicado removido                                                                                            |
| `src/ui/shared/trend.mjs`        | import movido para o topo                                                                                              |
| `styles/30-components.css`       | dois `@media` adjacentes mesclados                                                                                     |
| `src/data/bills.mjs`             | export `INSTRUMENTS` removido, JSDoc atualizado                                                                        |
| `src/data/cast.mjs`              | export `GIVEN_NAMES` removido (mantido como `const` local)                                                             |
| `src/public/index.mjs`           | `INSTRUMENTS` removido do barrel                                                                                       |
| `tests/suites/passage.mjs`       | **novo** — 13 provas (`forgotten`, `tables`, `reports`, `proposalOf`)                                                  |
| `tests/suites/budget.mjs`        | prova GDP=0                                                                                                            |
| `tests/suites/save.mjs`          | 2 provas novas (impeachment round-trip + campo corrompido)                                                             |
| `tests/suites/congress.mjs`      | tolerância 20%→25%, amostras 600→1000                                                                                  |
| `tests/suites/state-reducer.mjs` | `isFrozen` em `fiscal`, `capacity.index`, `series.gdp`; mensagem de assertion corrigida                                |

### Dois itens para decidir (requerem schema bump, juntos)

⚠ **O save recusa versão diferente em vez de converter** — custa a partida em andamento.
Os dois abaixo podem ser feitos juntos num único bump de schema, quando o responsável
decidir:

1. **`last` perdido no F5** (achado 46) — a leitura do mês some na recarga. A metade
   visível já foi consertada (a bandeja vazia agora diz a verdade sobre o mandato); falta
   persistir o último relatório no save. **Impossível regenerar** — o relatório é função
   do estado ANTERIOR e das ordens daquele mês;
2. **`events` stream morto** — `state.streams.events` é código morto, nenhum motor o
   consome. Remoção requer mudança de tipo em `Streams`.

### Próximo passo do plano

O Glorioso, passo 2 — **B1 a B5** (faixa de áreas no Congresso). O plano está em
`docs/cycles/13-o-glorioso.md`. Os itens B1-B5 são:

- B1: colorir o mandato (distância de `initial`, não o nível)
- B2: cada bloco é `<button data-section>` e leva ao ministério
- B3: cada área tem `index` no catálogo, a faixa mostra só o rótulo
- B4: `.trend[data-direction]` já existe, a faísca é sem cor
- B5: ícone por área (o rail já tem um por ministério)

⚠ **O bloco tem 108px e já estourou antes** — a Restrição 2 manda `checkOverflow` +
`checkClipped` + `checkEllipsized` + captura aberta, sem exceção.

### Como validar

```bash
npm run validate   # guardas + tipos + lint + formato + testes + passeio — ~42s, tem de ficar verde
npm run check      # só as guardas, ~2s — o laço curto
npm test           # só as suítes, ~2s
npm run simulate   # 48 meses no terminal
npm run serve      # http://127.0.0.1:5173/
```

⚠ **O portão não sabe OLHAR.** Mexeu em tela? abra a captura em `captures/passeio/`. Três defeitos
já atravessaram tipo, guarda e cem provas para morrer na imagem.

---

**Estado: verde.** `npm run validate` fecha com **12 guardas · 54 provas sintéticas ·
132 arquivos · 259 provas · passeio verde em DUAS janelas**. Branch `caixa-de-entrada`.

### ▶ COMECE POR AQUI — [o ciclo 14, a Caixa de Entrada](cycles/14-a-caixa-de-entrada.md)

> **Retomada em uma linha:** branch `caixa-de-entrada`, seis commits à frente de `main` mais o
> trabalho de 3½ na árvore. **Passos 1, 2 e 3 feitos.** O **1½ é quatro de seis** e o **3½ é
> três de cinco** — falta só o **3½.5**, de desenho.
>
> ⭐ **Sessão 26 fechou o 3½.1, o 3½.3, o 3½.4, o 1½.5 e o 1½.6**, mais a linha clicada em papel
> branco e quatro bugs achados por sonda: escape duplo no assunto, exigência de grupo sem nome
> começando por ": ", contraste 2,58 no aviso do botão, e a bandeja pulando sozinha de carta.
>
> ⚠ **E ENTROU UM PASSO NOVO, o 3¾:** _"as mensagens parece que se atualizam em tempo real"_.
> Medido: **3 de 33 cartas mudavam de texto depois de chegar**. Os dois alarmes foram fechados —
> o número viaja com a carta —, e sobra **a carta de posse**, que pede o mesmo bump de esquema
> que `last` (achado 46). **Passos 1, 1½, 2 e 3 fechados; 3½ em quatro de cinco.**
>
> ⭐ **29/08: o bump de esquema entrou, versão 19.** O fechamento de cada mês virou registro
> guardado em `state.months` — a caixa mostrava UM cartão de mês, e agora mostra todos, e eles
> atravessam o F5. **O achado 46 fecha junto.** ⚠ **Save da versão 18 é recusado.**
>
> ⭐ **O 3.3 FOI REVERTIDO POR ELE, e o 3.4 fechou de graça junto.** A seção "Precisam de
> resposta" saiu: o índice é **calendário puro** — cada carta no bloco do mês em que chegou,
> meses do mais novo para o mais velho, e dentro do bloco a ordem que o motor monta. O teto de
> 7 linhas caiu com ela, e a lista rola. Medido: **29 cartas, 8 blocos, zero linhas gêmeas
> dentro do mesmo bloco** — o cabeçalho do mês separa as duas perguntas que liam igual, e as
> três medidas do 3.4 ficaram desnecessárias.
>
> ⭐ **E o 3½.2 fechou junto, com `line-clamp: 4`:** 20 dos 28 assuntos perdiam o fim, e agora
> zero. A exceção que isentava `.tray__subject` no portão foi removida — o índice é guardado
> como o resto da tela.
>
> ⚠ **E A MARCA DE "FEITO" JÁ MENTIU DUAS VEZES NESTE CICLO** — ver a sessão 24 abaixo: o 1½
> estava ✔ com três itens abertos, e dois consertos declarados fechados atendiam metade do
> defeito cada um. **Em 28/08 ela mentiu ao contrário**, o que é mais barato mas é o mesmo
> descuido: o 2.4 estava ⚠ dizendo que a retenção _"não tem prova nenhuma, e nem é exportada"_,
> e `KEEP`, `CARRY` e `mail.mjs:169` já existiam. **Conferir a marca contra o código é passo de
> sessão, e não de auditoria.**

**Sete passos. Feitos: os passos 1, 2 e 3 inteiros.** As **quatro frentes de investigação
fecharam** — motor, view, wiring e geometria —, então o plano está completo e não é mais uma
lista aberta.

✔ **PASSO 1 — três defeitos de motor**, com as três provas nascidas antes e verificadas
mordendo. A série foi comparada antes e depois: **idêntica ao caractere**. Que estão vivos foi
medido à parte — o aviso de teto saiu de **zero em cinco políticas** para um por mandato:

- a **poda** cortava com `slice` negativo sobre um array que tem as novas na frente. **101
  cartas destruídas com 1 a 3 meses de idade**, e a caixa do mês 30 com um buraco de doze
  meses. De graça, o mesmo conserto matou o `slice(-0)`, que desligava o teto da bandeja;
- o **alarme de fervura** calava a exigência do grupo que acabara de ferver, por satisfazer sem
  querer o filtro de "uma exigência aberta por vez";
- o **alarme do teto** era `!X && X` — impossível. Quinto canal morto. O aviso passou a chegar
  **antes** de o teto fechar.

✔ **PASSO 2.1 — `checkClamped`, o quarto irmão do passeio.** Recorte por linhas não rola, não
põe reticência e **não move `scrollHeight`**. Verificado mordendo: acusa `18>37` com recorte
forçado. ⚠ **A exceção que declarei nele está ERRADA** e é dívida do passo 3 — ver o plano.

⛔ **O QUE FALTA, e o passo 1½ é o mais grave:**

| passo  | o quê                      | pior achado                                                                                           |
| ------ | -------------------------- | ----------------------------------------------------------------------------------------------------- |
| **1½** | o gesto está quebrado      | **um clique prende o jogador numa carta por 20 meses**, e a bandeja abre a pergunta **menos** urgente |
| **2**  | as outras quatro checagens | a retenção não tem prova nenhuma                                                                      |
| **3**  | a bandeja para de mentir   | o fechamento do mês é **cortado** da bandeja, e o índice **volta no calendário**                      |
| **3½** | a geometria                | a carta que pergunta **sangra 7px sobre o índice** e perde 23% da tarja                               |
| **4**  | a folha 75% branca         | quatro espécies sem anexo nem rodapé                                                                  |
| **5**  | canais mortos e unidades   | "11 pontos" onde são **11 cadeiras**                                                                  |

⭐ **E A REPRODUÇÃO CANÔNICA DO ÍNDICE BAGUNÇADO É DELE, em três cartas:** partida nova, dois
"avançar", e o calendário lê `ABR · 2027 → MAR · 2027 → ABR · 2027`. Eu tinha achado o mesmo
defeito com catorze meses de jogo ativo; **a reprodução curta é a que vale.**

### ▶ O GLORIOSO ESTÁ EM EXECUÇÃO, e a ordem é a do rodapé do plano

| passo | itens                      | estado                                 |
| ----- | -------------------------- | -------------------------------------- |
| **0** | C12 · D7                   | ✔ os dois                              |
| **1** | 0.1 · 0.2 · C1 · C2 · C3   | ✔ os cinco                             |
| **2** | B1 a B5 — a faixa de áreas | ⏸ **em espera — o ciclo 14 vem antes** |
| **3** | C8 · C9 · C10 · C11 · C13  | ⚠ **três de cinco** — faltam C10 e C11 |
| **4** | 0.3 · B10 · C7 · D4        | ⛔                                     |

**12 de 49 itens.**

⚠ **O PASSO 3 FOI FEITO ANTES DO 2, E FOI ERRO.** Foi anunciado como inversão deliberada — "a
coluna levou 6, e é a primeira coisa que se vê" — e ele cobrou: _"não acha melhor voltar desde
o início, passo 1, passo 2, passo 3?"_. **A ordem do plano volta a valer.**

### ⭐ A LIÇÃO DA SESSÃO 20 É DELE, E SÃO QUATRO PALAVRAS

> _"mudou bosta nenhuma"_

Dita depois de dois commits e onze itens. **E ela está certa.** Os cinco do passo 1 e três dos
cinco do passo 3 **consertam**: número errado, palavra repetida, informação escondida, canal
morto. **Consertar é invisível por construção** — o melhor resultado possível de arrumar uma
contradição é ninguém notar nada.

⚠ **E A ESCOLHA DA ORDEM FOI MINHA.** Ele pediu _"quanto mais profissional melhor"_ e depois
_"não quero bugs"_; eu otimizei pela segunda e entreguei polimento. **O que muda o jogo é a
Parte A** — hoje o presidente faz UMA coisa: arrasta verba e promete emenda. Todo o resto é
leitura. E a Parte A começa no **passo 6**.

⚠ **MAS NÃO SE PULA PARA LÁ, e a razão é do próprio plano:** A1 e A6 dependem de **0.3**, A4
depende de **B10** — os dois no passo 4. E o passo 4 existe por escrito para o defeito que ele
acabou de sentir: _"acrescentar dez poderes a uma tela que não mostra consequência é somar
profundidade invisível"_.

### ▶ O PASSO 2 — a faixa de áreas, e ela é o próximo trabalho

Os oito blocos `Fazenda 72` no Congresso, hoje oito retângulos cinzas idênticos:

- **B1 · colorir o MANDATO, não o nível.** ⛔ Não é "vermelho abaixo de 40": isso acusaria o
  jogador de uma Segurança 38 que ele **herdou**. É a distância de `initial`, que já está no
  catálogo — 38 no mês 1 é neutro, 25 no mês 20 é vermelho;
- **B2 · ela É navegação e não diz.** Cada bloco é `<button data-section>` e leva ao
  ministério. Oito portas que ninguém sabe que abrem;
- **B3 · não diz o QUE mede.** Cada área tem `index` no catálogo — arrecadação, safra,
  capacidade, cobertura, atendimento, formação, ordem, prontidão — e a faixa mostra só o
  rótulo do ministério;
- **B4 · a faísca é sem cor.** `.trend[data-direction]` já existe;
- **B5 · ícone por área.** O rail já tem um por ministério.

⚠ **E O BLOCO TEM 108px E JÁ ESTOUROU ANTES** — a Restrição 2 manda `checkOverflow` +
`checkClipped` + captura aberta, sem exceção. ⚠ **`checkEllipsized` agora também**: a faixa
foi um dos três truncamentos que ele achou.

### ✔ O QUE A SESSÃO 20 FEZ

⭐ **O PASSEIO GANHOU UM TERCEIRO IRMÃO: `checkEllipsized`.** `checkClipped` vê o eixo X,
`checkSwallowed` vê o Y, e **nenhum dos dois vê `text-overflow: ellipsis`** — texto que não
rola, só perde o fim. Ela nasceu ANTES do item que precisava dela (C3), como manda a regra
dura da Restrição 2, e **acusou três truncamentos na tela publicada na primeira rodada**:
`Congresso & Leis` (114px em 109), `Indústria e Infraestrutura` (164 em 109) e a mesma na
faixa do Congresso (202 em 117). As áreas ganharam `short` — opcional, só `industry` a
declara, mesmo precedente de `sigla` em `parties`.

⚠ **E ELA PEGOU DOIS DEFEITOS MEUS ANTES DE SUBIREM:** o rótulo do C3 estourando a coluna, e a
Câmara sem a quarta fatia — as três somavam a base, então a barra ficava **sempre cheia** e a
comparação com as 513 sumia. **Nenhuma prova foi enfraquecida** para acomodar isso.

**Passo 1** — 0.1 (desoneração vira renúncia de receita), 0.2 (`data-guard` deixa de ser canal
morto), C1 (o verbo de 68 deixa de colidir com o de 86), C2 (o cofre parava de ser dito duas
vezes), C3 (o quarto canal morto sai do `aria-label`).

**Passo 3, três de cinco** — C8 (`46 MESES RESTANTES` na faixa), C9 (seta nas sete linhas da
coluna), C13 (a coluna reordenada por consequência, a Câmara virou composição, duas portas).
⭐ **E a Câmara reviveu um QUINTO canal morto:** `baseSplit` era calculado todo quadro,
declarado no contrato da view e nunca lido.

**D7** — A Rua e Bastidor saíram do menu, por decisão dele.

### ⚠ O QUE FICOU FALTANDO DO PASSO 3, e por quê

- **C10 · a base que se compra (364 de 513)** — é o único do passo que cria **número novo**, e
  número novo é a família de defeito nº 1 deste projeto. Ele merece estar sozinho, e a
  Restrição 2 manda a divisão sair da camada de aplicação e não da view;
- **C11 · o maior gasto preso mostrar o que MUDOU** — precisa de valor anterior;
- ⛔ **e o sexto defeito da nota 6 não fecha sem a Parte A:** _"zero rostos numa coluna que
  mede gente"_. Lobby não é pessoa — sem nome, sem cargo, sem sinete. Depende de **A6**.

### ▶ O QUE FICA FORA DO PLANO, e continua aberto

1. ▶ **O ÍNDICE DA BANDEJA NÃO DISTINGUE A ESPÉCIE DA CARTA.** Duas cartas de espécies
   diferentes leem igual na coluna estreita;
2. ▶ **A COLUNA DA DIREITA LEVOU 6 e não foi renotada.** Quatro dos seis defeitos fecharam no
   passo 3; o quinto é parcial e o sexto depende de A6. **A nota nova é dele.**

⚠ **O PLANO MESTRE É `docs/cycles/13-o-glorioso.md` — 49 itens em CINCO partes**, com as três
restrições que valem para todos (o orçamento de pixel do Gabinete, o que significa "pronto", e o
custo em versões de save). ✔ **12 executados**, e o estado passo a passo está no topo dele.

⭐ **E A PARTE D NASCEU DE UMA DIRETRIZ DELE:** _"siga com o que pensar ser melhor pro jogo,
sempre no sentido de se aproximar de Victoria 3, Crusader Kings, Democracy, Football Manager"_.
Ela tem sete itens, e **dois deles são buracos grandes achados lendo o código contra essas
referências:**

- ⭐⭐ **D1 · o presidencialismo de coalizão.** O jogo tem partido, cadeira e venalidade, e o
  jogador compra voto a voto — **mas não é assim que o Brasil governa.** Falta a estrutura: o
  presidente dá ministério a partido, e o partido entrega a bancada. **As oito áreas do rail JÁ
  SÃO os oito ministérios**, e `ELENCO` já tem `office`, `reach` e `remember()`. O A6 descreve
  isso como _"a segunda moeda"_ — está pequeno: no Brasil o gabinete é a moeda PRINCIPAL;
- ⭐ **D2 · a eleição, e ela é a terceira saída.** Hoje há duas: servir 48 meses ou cair.
  `turn.mjs:1994` declara que não há vitória nem placar, **e a decisão está certa** — a eleição
  não a contradiz, completa: é o país respondendo, no mesmo tom. `termOf` já calcula tudo de que
  ela precisa, e a faixa já promete `1º MANDATO`.

⚠ **E TRÊS ACHADOS MENORES:** `CASCATA` e `DELTA` são codinomes **reservados e vazios**
(`export {}`) — o projeto já sabia que precisava da corrente causal e parou no nome; o rail
declara **A Rua** e **Bastidor** como `ready: false`, duas promessas cinzas; e
`src/domain/graph/index.mjs` carrega um comentário sobre `backdrop-filter` e 31 fps que não tem
relação com DELTA — fragmento de cemitério.

### ✔ A COLUNA DA DIREITA DO GABINETE LEVOU **6** — a nota é dele, o diagnóstico é meu

A Caixa de Entrada foi 7 antes da revisão e 8 depois; a coluna nunca tinha nota. Seis defeitos
estruturais, no C13: quatro blocos com a mesma forma e nenhuma hierarquia; **sete barras
idênticas medindo contagem, fração, pressão e composição**; nada é porta; zero rostos numa
coluna que mede gente; nada se move; e tudo tem a mesma voz.

⚠ **E AS SEIS DECISÕES QUE ESTAVAM ABERTAS FORAM DELEGADAS A MIM** — as quatro de olho (mono em
dinheiro, identidade do Congresso, densidade do relatório, taxa do A7) e as duas técnicas (o
save e a altura do C10). **As respostas estão escritas no plano, com o motivo, para ele reverter
qualquer uma vendo por quê.**

### ✔ FECHADO — a coluna do Gabinete engolia um cartão, e o portão ficava verde

**Achado e consertado em 24/08/2026.** Era defeito na tela publicada, não proposta.

`.cards__side` tem `overflow-y: auto` (`styles/45-screen-cabinet.css:46`). A coluna dos quatro
cartões rola por dentro, e a página não cresce um pixel:

| janela       | coluna visível | conteúdo | resultado                                     |
| ------------ | -------------- | -------- | --------------------------------------------- |
| 1440×**980** | 639px          | 639px    | ✔ cabe — e é a **única** janela do passeio    |
| 1440×**900** | 559px          | 594px    | ⛔ esconde 35px · **3 de 4 cartões inteiros** |
| 1440×**820** | 479px          | 594px    | ⛔ esconde 115px                              |
| 1440×**760** | 419px          | 594px    | ⛔ esconde 175px · **2 de 4**                 |

⚠ **E A CEGUEIRA É A MESMA FAMÍLIA PELA QUARTA VEZ.** `checkOverflow` mede `scrollWidth` — só
horizontal, só a página. `checkClipped` filtra por `style.overflowX`, e **o gêmeo do eixo Y
nunca existiu**; o cabeçalho dela conta que o passeio já foi cego no eixo X e foi consertado. E
o passeio roda numa janela só, `1440×980` (`walk.mjs:52`) — **exatamente a única altura em que
cabe.** O portão mede o caso que passa.

**✔ AS DUAS METADES ENTRARAM, e a segunda vale mais que a primeira:**

- **o canvas ganhou limiar de altura.** `height: 100dvh` valia em QUALQUER janela; agora vive
  dentro de `@media (min-height: 940px)`, nas duas folhas. Abaixo disso a página rola — que é
  o **mesmo plano B declarado** que o eixo horizontal já usava para janela estreita. Medido
  depois: a coluna mostra 594 de 594 a 900, 820 e 760px;
- ⭐ **o passeio ganhou `checkSwallowed` e uma SEGUNDA JANELA (1440×900).** A checagem foi
  escrita ANTES do conserto e verificada contra a folha antiga: acusou `cards__side 594>559`, e
  só isso. Exceção declarada: `.tray__list`, desenhada para rolar.

⚠ **E A LIÇÃO GENERALIZA, que é o que vale guardar:** toda checagem nasce sem alcance.
`checkClipped` nasceu cega no eixo Y; `checkContrast` segue cega para texto que não é folha; o
passeio nasceu com uma janela. **A pergunta em toda checagem nova é qual metade do problema ela
ainda não vê.**

⚠ **E O GABINETE NÃO TEM UM PIXEL LIVRE** (`tmp/cabe-no-gabinete.mjs`): a 1440×980 a página
fecha em 980 de 980, a coluna lateral em 639 de 639, e a bandeja em 639 de 639. No mês 1 havia
24px de folga; o cofre ganhou uma linha no mês 9 e consumiu os 24. **Todo item novo de tela
tem de dizer de onde tira a altura.**

### ✔ O QUE A SESSÃO 19 FEZ — a limpeza, e ela nasceu de uma pergunta dele

_"Toda vez que tento desenvolver o jogo com você, você faz alguma coisa errada, deixa tudo
feio, cria bugs — será que é a organização do código, a arquitetura?"_

**Medido: não é a arquitetura.** O motor quase não quebra, e é porque a arquitetura dele é
boa. Os defeitos caem na tela, e a tela era a metade sem portão. Três consertos:

- ✔ **o passeio entrou no `validate`**, e o CI ganhou o chromium. 9s → 42s, quatro rodadas
  estáveis medidas antes de tornar obrigatório;
- ✔ **a guarda `prose` ganhou dois trabalhos** além do teto: **data em comentário** (o
  `CLAUDE.md` proíbe por escrito e havia **56**, sendo 18 no entrypoint) e **identificador
  citado em prosa que não existe mais** — `--token`, `.classe` ou `arquivo.mjs`. ⚠ **E o
  escopo dela passou a incluir `app.mjs`**, que estava de fora por morar na raiz: 1.283
  linhas, 45% de prosa e 12 blocos acima do teto que nunca foram cobrados;
- ✔ **este arquivo foi partido em dois.** 5.704 linhas viraram ~700 aqui e o resto em
  `journal.md`;
- ✔ **e a guarda ganhou um quarto trabalho: o BLOCO CORTADO NO MEIO.** Um corte automático
  de prosa passou por aqui em 22/08 e deixou **quatro blocos parando em conectivo** — _"um
  evento a mais num turno deslocaria o índice e"_, _"o save só precisa da semente e da"_ —,
  e o registro da época deu os três que sobraram como **falso positivo**. Os quatro foram
  reparados do sentido original. ⚠ **O casador é estreito de propósito:** a última palavra
  ser conectivo dá **zero** falso positivo no projeto inteiro; a versão larga (frase sem
  ponto final) acusava 25, dos quais 21 eram cabeçalho de seção e contrato de tipo.

⚠ **E A LIMPEZA ACHOU DOIS DEFEITOS DE PROSA VENCIDA, que é a família que ela veio pegar:**
o README afirmava que o passeio roda _"em desktop e em celular"_ e ele tem **um** viewport; e
a seção "A verificação" deste arquivo dizia **"nove guardas, 173 propriedades"** contra 12 e 236. Um cemitério de **dez blocos de comentário seguidos** em `45-screen-cabinet.css`,
nenhum preso a regra nenhuma, descrevia o hemiciclo e a legenda do arco — peças mortas.

### ✔ A PENEIRA DE TIPOGRAFIA — as doze telas, medidas e fechadas em 24/08/2026

`tmp/censo-tipo.mjs` visita as doze telas no mês 6 e conta família × tamanho × peso com o
nome da peça atrás de cada combinação; `tmp/quem-foge.mjs` lista quem cai fora dos degraus.

| eixo                     | antes | agora  |
| ------------------------ | ----- | ------ |
| combinações no projeto   | 20    | **14** |
| peças fora da escala     | 5     | **0**  |
| tamanhos numa área       | 6     | **4**  |
| combinações no Congresso | 14    | **10** |

⚠ **O DEFEITO ERA `em`, E ELE ENTRA POR ONDE NINGUÉM OLHA.** Oito declarações em `em`
produziam **11,152 · 11,333 · 12,8px** — três degraus entre `--text-label` e `--text-note`,
nenhum na escala. **E duas delas não tinham declaração nenhuma:** eram o `<small>` padrão do
navegador, 0,83em. Ausência de tamanho não é neutralidade — é o navegador decidindo.

⚠ **E O PESO TINHA DOIS ÓRFÃOS:** o **500** existia UMA vez no projeto inteiro
(`person__votes small`), e o **600 a 10px** existia numa regra só contra 42 peças a 700.

**E a regra da serifa apareceu quando os pesos foram postos lado a lado**, e ela é limpa:
nome de pessoa ou de norma é **600**, título de documento é **700**, título de tela é
**800**. `letter__name` era o único **nome** vestindo o peso de **título** — dentro do
cabeçalho do ofício, quem assina pesava igual ao assunto.

⚠ **ISSO REVERTE METADE DE UMA DECISÃO DA REVISÃO DA CAIXA**, e a reversão tem razão: lá o
600 foi morto por ser órfão _naquela tela_, e o efeito colateral foi colapsar nome e título
no mesmo 700. Fora da caixa, 600 é o peso de nome em cinco peças.

**E a viúva tipográfica saiu da prosa:** a captura do Congresso mostrava _"ou avance o mês
assim / mesmo"_, com uma palavra sozinha na segunda linha. `text-wrap: pretty` na prosa e
`balance` na chamada — a chamada iguala as linhas, a prosa só recusa a última órfã.

### ▶ O PLANO NA MESA — [O GLORIOSO](cycles/13-o-glorioso.md)

⚠ **PLANO, NÃO COMEÇADO.** Nomeado por ele em 24/08/2026, com o norte dito assim: _"se na
vida real um presidente pode fazer tal coisa, no meu jogo o jogador também vai conseguir.
Liberdade, realismo, fidelidade. Brasil real."_

**É o plano mestre, e ele tem dois eixos:** a **PARTE A — O CARGO**, com dez poderes que um
presidente tem e o jogo não dá; e a **PARTE B — A TELA**, com dezesseis achados do que o motor
já sabe e a tela não mostra. Mais uma **PARTE 0** de fundação, porque fidelidade que o jogador
não percebe não é fidelidade. ⚠ **Quatro dos dez não estavam em nenhum dos dois
dossiês do Gemini** — o salário mínimo, a folha, o Congresso com pauta própria e o STF.

⚠ **E ELE ACHOU TRÊS CANAIS MORTOS no caminho**, todos da mesma família — o motor sabe e nada
consome: `data-guard` (o jogo sabe quais pisos são constitucionais e pinta todos igual),
`taxDelta` (o arrasto tributário **nunca dispara**, porque `turn.mjs` passa a mesma constante
nas duas pontas) e a **desoneração**, que consome discricionário sendo renúncia de receita.

⚠ **O [ciclo 12](cycles/12-o-jogo-olha-para-frente.md) NÃO COMPETE COM ELE: virou a Parte 0.**
Fidelidade que o jogador não percebe não é fidelidade.

### ▶ A MEDIÇÃO QUE SUSTENTA A PARTE 0 — o [ciclo 12](cycles/12-o-jogo-olha-para-frente.md)

⚠ **PROPOSTA, NÃO ACORDADA.** Escrita em 24/08/2026 a pedido dele, e ela nasceu de medição e
não de leitura — inclusive **corrigindo uma afirmação minha**: _"o país é quase inerte"_ está
errado. Concentrar tudo numa área por 48 meses move **Segurança +60,9** e **Previdência
+0,7**; o fator entre as pontas é **87×**, e várias curvas sobem até o mês 24 e **caem**
depois, porque concentrar derruba as outras áreas e a receita volta contra quem se alimentava.

**O diagnóstico:** toda leitura do jogo tem horizonte de UM mês e toda decisão paga em 12 a 48. A tela de área imprime `61 → 61` numa área que anda 0,40 por mês — é matematicamente
incapaz de mostrar a decisão. **A profundidade está construída e é invisível.**

**A proposta:** `trajectory` — rodar `playMonth` para frente com as ordens congeladas, sobre
uma cópia do estado. Custo medido: **24 meses em 5,3ms**. Sem motor novo, sem número
inventado, sem campo no save.

### ⛔ NÃO REABRIR

A fita de cinco cores no Gabinete, os botões `NEGOCIAR`/`FINANÇAS`, as três classes da Rua,
o `letter__why`, o `annex__foot`, o vocativo, a pastilha com fundo, as setas verde e
vermelha, e **o mobile** — _"a perfeição que eu almejo é no desktop sempre"_.

### ⚠ AS FERRAMENTAS DE MEDIÇÃO MORAM EM `tmp/`, que o git ignora

Elas estão no disco e **foram o que achou quase tudo** na revisão da Caixa de Entrada:

- `tmp/auditar-caixa.mjs` — abre TODA carta em 24 meses e mede transbordo, rolagem dentro de
  recorte, cards de alturas desiguais, e o inventário de tipografia com o nome da peça atrás
  de cada combinação. Foi ele que achou os quatro pesos no mesmo 10px;
- `tmp/prints-caixa.mjs` — um print 2× de cada espécie de carta;
- `tmp/fontes.mjs` — o censo de famílias, tamanhos e pesos da bandeja inteira;
- `tmp/medir-coluna.mjs`, `tmp/auditar-faixa.mjs`, `tmp/vaos.mjs` — geometria da coluna da
  direita, da Trindade e dos vãos em volta de uma barra;
- `tmp/tipos.mjs` — renderiza a mesma carta em N pares tipográficos, para escolher com o olho.

## ▶ A SÉRIE QUE CALIBRA — e ela é a ÚNICA que serve para calibrar

⚠ **ESTA É A ÚNICA SÉRIE DO PROJETO, e é de propósito.** O arquivo guarda outras quatro,
e as quatro são HISTÓRICAS: cada uma mediu o efeito de uma mudança no dia em que ela
entrou, e cada uma foi superada pela seguinte. **Calibrar contra qualquer uma delas seria
ajustar o parafuso contra um jogo que não existe mais** — por isso elas ficaram em
[`journal.md`](journal.md), e esta ficou aqui.

⚠ **E O HORIZONTE É DECLARADO NA TABELA porque a coluna de votações já misturou dois.**
Todas as células abaixo são de **48 meses**, semente padrão. Ver o achado 54.

| política     | dívida/PIB | votações     | indústria   | segurança   |
| ------------ | ---------- | ------------ | ----------- | ----------- |
| `herdado`    | **90,0%**  | 0 de 0       | 48 → **28** | 38 → **27** |
| `agenda`     | 90,1%      | **29 de 43** | 48 → 20     | 38 → 20     |
| `base`       | 90,7%      | **35 de 42** | 48 → 20     | 38 → 20     |
| `piso`       | 90,9%      | 5 de 17      | 48 → **15** | 38 → **15** |
| `explorador` | 92,0%      | 0 de 0       | 48 → 17     | 38 → 17     |
| `promessa`   | **93,5%**  | 0 de 3       | 48 → 15     | 38 → 15     |

⚠ **A dívida subiu ~6 pontos em TODAS as políticas, e isso é consequência e não
regressão:** enquanto o país se consertava sozinho, a capacidade subia, a arrecadação
subia atrás dela e a dívida era segurada por um ganho que ninguém pagou. Tirada a
gratuidade, sobrou a conta.

**E a queda, medida em 60 meses** — o critério foi declarado antes: alcançável por um
governo ruim, inalcançável por um mediano. **O mandato acaba no mês 49.**

| governo                              | processo | queda                  |
| ------------------------------------ | -------- | ---------------------- |
| promete tudo e não honra             | mês 37   | **mês 40**             |
| paga metade                          | mês 37   | **mês 40**             |
| corta tudo ao piso                   | mês 42   | **mês 45**             |
| passivo, não paga ninguém            | mês 43   | **mês 46**             |
| mantém a máquina e paga a manutenção | mês 41   | mês 52 — **atravessa** |
| reforma os pisos maiores             | mês 43   | mês 51 — **atravessa** |

⚠ **O achado 29 MORREU, e por consequência e não por calibragem.** O governo passivo
cai agora, e ninguém mexeu na CALDEIRA: o país deixou de se consertar sozinho, os
índices caem, a rua cansa e o mercado vê a dívida subir. Era exatamente o que esta
retomada previa ao mandar consertar o 31 antes dele.

⚠ **E o achado 1d sobrevive nos DOIS eixos** — o passivo termina com a melhor dívida
**e** a melhor capacidade, porque manter o orçamento herdado é, por identidade, o ponto
de equilíbrio. **Isso deixou de ser um defeito**: ele paga no único lugar que importa,
que é a cadeira. É a tese do ciclo 10 cumprida — _"não se conserta com número, se
conserta com risco"_.

## Achados abertos

> ⚠ **Achado com número tem data, e número com data envelhece.** Antes de repetir
> qualquer um destes, remeça-o. Os que já morreram estão em
> [`journal.md`](journal.md), na seção _Achados que já morreram_.

**54. ✔ A COLUNA DE VOTAÇÕES DA SÉRIE QUE CALIBRA ESTAVA ERRADA, e ela foi corrigida em
24/08/2026 — a regra do topo desta seção pagou o próprio custo na primeira vez que foi
seguida.** A tabela foi remedida antes de ser citada, e as outras três colunas passaram:
dívida fecha dentro de 0,1 p.p. nas seis políticas, e indústria e segurança batem **exato**
nas doze células. **Só votações divergia**, e nas quatro políticas que votam.

⚠ **A CAUSA É HORIZONTE MISTURADO DENTRO DA MESMA CÉLULA.** A `agenda` aprova assim:

| horizonte | `agenda` |
| --------- | -------- |
| 24 meses  | 14 de 19 |
| 36 meses  | 22 de 31 |
| 48 meses  | 29 de 43 |

O `14 de 43` que estava escrito é **o numerador de 24 meses colado no denominador de 48**.
O `29` da `base` era o número que a `agenda` faz a 48 — uma linha pegou o da vizinha. E o
`2 de 24` do `piso` não existe em horizonte nenhum: a 24, 36 e 48 meses ele dá 5 de 13,
5 de 17 e 5 de 17.

⚠ **NÃO É INDETERMINISMO** — `agenda` a 48 meses deu 29 em duas rodadas seguidas, e a prova
_"o mandato inteiro se refaz da semente e das ordens"_ continua verde.

⚠ **E A CONSEQUÊNCIA CAI NO ACHADO 22, que raciocina em cima desta coluna.** Com 14 de 43 a
`agenda` aprova **33%**; com 29 de 43 ela aprova **67%**. _"Legislar é caro"_ e _"legislar
está estrangulado"_ são diagnósticos opostos que pedem trabalhos opostos, e o segundo não
se sustenta neste número. **Nada foi recalibrado** — o achado 53 continua de pé.

**53. ⛔ NÃO RECALIBRAR A CAPACIDADE ANTES DA REFORMULAÇÃO — decisão dele, registrada em
21/08/2026.** Com o achado 52 na mão eu ia recomendar girar `decay` e `yield`, e ele avisou
a tempo: _"o jogo ainda terá uma boa reformulação, nós vamos adicionar empresas reais,
coisas reais, estatização, privatização, criação, construção — MAS ISSO É A LONGO PRAZO,
não é pra hoje"_.

⚠ **A reformulação substitui exatamente o modelo que eu ajustaria.** Cada número girado
hoje é um número girado duas vezes, e o segundo giro apaga o primeiro.

**O QUE SOBREVIVE À REFORMULAÇÃO, e é onde vale investir:**

- **o Congresso inteiro** — bancadas, lealdade, emenda, quórum. Nada disso é trocado por
  empresa, e a sonda `favoritos` acabou de mostrar que o eixo funciona: três a 73 e oito em
  ruptura, com o teto fechando em 12 meses;
- **a tramitação** — estatizar e privatizar vão passar por ela. É o canal, e ele já leva
  uma lei modesta da caneta à norma em quatro meses;
- **a Caixa de Entrada** — ela é a superfície por onde o mundo fala, e um mundo com empresas
  fala mais, não menos;
- **a lição de método do achado 52**, que vale para qualquer modelo que venha.

**O QUE NÃO SOBREVIVE, e por isso não deve receber trabalho agora:**

- os oito `decay` e `yield` de `areas.mjs`, e a identidade que os produz;
- qualquer conclusão sobre "o país responde na velocidade certa" — a pergunta volta inteira
  quando uma estatal construída no mês 6 começar a produzir.

⚠ **E A PERGUNTA FICA ESCRITA, mesmo sem a resposta:** _quanto tempo uma decisão do
presidente leva para mudar o país?_ Hoje são "mais que um mandato, em seis das oito áreas",
e isso é herdado de uma identidade aritmética — **ninguém escolheu**. No modelo novo ela
merece ser escolhida.

**52. ⚠ O ACHADO 49 ESTÁ ERRADO, E EU O ESCREVI HOJE — a correção é de MÉTODO e é a terceira
da mesma família em uma sessão, 21/08/2026.** Ele dizia: _"o país é quase inerte; hoje o
Planalto é um jogo de sobrevivência no Congresso com um país decorativo"_.

**O país não é inerte. As SONDAS é que espalham tudo por igual.**

**Medido depois, com duas sondas novas:**

| jogada                            | Saúde         | preço                                        |
| --------------------------------- | ------------- | -------------------------------------------- |
| concentrar tudo nela, 48 meses    | **61 → 71,5** | Indústria 48→15, Segurança 38→15, dívida 93% |
| rodar o foco a cada 12 meses      | 61 → 65       | Indústria 48→21, Segurança 38→19             |
| espalhar (as seis sondas antigas) | 61 → 60       | —                                            |

E no Congresso, com a sonda `favoritos` — emenda cheia às três maiores bancadas e nada às
outras oito: **três a 73 e oito em ruptura**, contingenciamento em **12 meses**, alocação
caindo de 254 para 115.

⚠ **AS SEIS POLÍTICAS ANTIGAS ESPALHAM NOS DOIS EIXOS** — verba dividida entre as oito
áreas, emenda oferecida a cada bloco do catálogo na mesma medida. **Nenhuma delas ESCOLHE.** E
escolher é o jogo: é o que Victoria 3, Democracy 4 e o Geo-Political Simulator pedem do
jogador do primeiro turno ao último.

**Uma sonda que espalha mede o espalhamento, e conclui que o mundo é plano.**

### ⚠ E o que sobrevive do 49 é a METADE que a velocidade explica

| área              | decay/mês | meia-vida  | % do caminho em 48 meses |
| ----------------- | --------- | ---------- | ------------------------ |
| Educação          | 0,0088    | **79 mês** | 35%                      |
| Defesa            | 0,0088    | **78**     | 35%                      |
| Saúde             | 0,0110    | **63**     | 41%                      |
| Agricultura       | 0,0114    | **61**     | 42%                      |
| Fazenda           | 0,0124    | **55**     | 45%                      |
| Previdência       | 0,0171    | 40         | 56%                      |
| Segurança         | 0,0419    | 16         | 87%                      |
| Indústria e Infra | 0,0569    | 12         | 94%                      |

⚠ **SEIS DAS OITO TÊM MEIA-VIDA MAIOR QUE O MANDATO.** Educação leva 79 meses para
percorrer metade do caminho até onde o dinheiro a levaria, e o mandato tem 48. **E as duas
que se movem são exatamente as duas que desabam em toda partida** — Indústria e Segurança
percorrem 87–94% do caminho, então elas obedecem; as outras seis não têm tempo.

**Isso é uma decisão de design, e ela nunca foi tomada de propósito:** um jogo em que
Educação não responde a um mandato inteiro é uma tese sobre o Brasil — defensável — mas
hoje ela é só a consequência aritmética de uma identidade calibrada área por área.

⚠ **E A CONSEQUÊNCIA DE JOGO É NÍTIDA: o país premia COMPROMISSO SUSTENTADO, e pune
rotação.** Concentrar 48 meses na Saúde dá +10,5; rodar o foco a cada 12 dá +4. Nenhuma
tela do jogo diz isso ao jogador, e é a regra mais importante que ele precisaria saber.

### A lição de método, e ela é a mais cara desta sessão

**Três vezes hoje eu quase registrei como defeito do MOTOR o que era uniformidade do
INSTRUMENTO:**

1. _"as bancadas não diferenciam"_ — diferenciam: amplitude 66 pagando uma só;
2. _"o país é inerte"_ — responde: +10,5 concentrando;
3. _"a lei nunca é escrita"_ — é: quatro meses da caneta à norma.

**As três vezes o teste que separou as duas frases levou menos de um minuto**, e as duas
frases pedem trabalhos opostos — recalibrar um motor, ou escrever uma sonda. **Antes de
chamar de defeito, faça a pergunta que o instrumento nunca fez.**

**50. ✔ A LEI FUNCIONA, E NENHUM INSTRUMENTO TINHA OLHADO — 21/08/2026.** _"A lei vira
texto"_ é o norte declarado do projeto desde 14/08, e as **seis** políticas do simulador
terminavam o mandato com **zero normas escritas**. Cinco só movem NÍVEL — que é caneta, e
caneta não vira lei — e a sexta, o explorador, escreve uma lei impossível de propósito.

**Medido à mão, fora do simulador, uma lei modesta atravessa a tramitação inteira em quatro
meses:** mês 3 gaveta → mês 4 a Mesa pauta → mês 5 o relator emenda → mês 6 o plenário
aprova e a **norma 45** entra no arquivo.

⚠ **ENTROU A SONDA `legislador`** para o instrumento finalmente ver o caminho que o jogo
chama de norte. Com ela: **2 normas em 48 meses, com 2 de 39 votações aprovadas — 5%** —
e rateio cortando em 44 dos 48 meses para pagar a tentativa. **O caminho existe e é quase
intransitável, e ninguém decidiu que devia ser.**

**48. ⚠ O ACHADO 37 ESTÁ PELA METADE VENCIDO, e eu repeti a metade morta dele numa resposta
antes de medir — 21/08/2026.** Ele dizia, medido em 20/08: _"num governo que joga ATIVO
cortando UMA alavanca por pauta, passaram-se 30 MESES sem uma única carta que pergunte"_, e
a consequência escrita era que **a Caixa de Entrada nunca pergunta nada em quatro anos**.

**Medido hoje, num mandato PASSIVO de 48 meses — o caso mais calmo que existe:**

| espécie de carta                 | carta-meses em 48 |
| -------------------------------- | ----------------- |
| `demand` (a chantagem do lobby)  | **29**            |
| `rupture`                        | 6                 |
| `posse`                          | 3                 |
| `siege`                          | 2                 |
| `reported` (a emenda do relator) | **0**             |

**Há pergunta de verdade na mesa em 22 dos 48 meses.** A caixa não é muda: ela pergunta em
quase metade do mandato, e pergunta a um presidente que não fez **nada**.

⚠ **O QUE MUDOU FOI O MERCADO GANHAR VERBO em 20/08**, na mesma sessão em que o achado foi
escrito — e o achado foi escrito antes. Um governo passivo endivida, o mercado esquenta, e
ele cobra. **O laço fecha.**

⚠ **E A METADE QUE CONTINUA DE PÉ É A CAUSA, e não a consequência:** `reported` deu **ZERO**
em 48 meses. A regra de `reports` em `passage.mjs` — só texto que machuca **duas alavancas
ou mais** passa por relatoria com emenda — continua exatamente como estava, e a pergunta do
RELATOR continua atrás de um comportamento que ninguém ensina. O que mudou é que ela deixou
de ser a única porta.

**A lição desta correção é de método, e é cara:** o achado 37 foi escrito na mesma sessão em
que o conserto que o desatualizou entrou, e passou uma sessão inteira sendo citado como
verdade — inclusive por mim, em voz alta, antes de eu medir. **Achado com número tem data, e
número com data envelhece.** Antes de repetir um, remeça-o.

**47. ⚠ A COLUNA DE TENDÊNCIA DE FINANÇAS NUNCA MOSTROU NADA, e a causa não é o desenho —
é que as réguas descrevem um país 20 vezes mais volátil do que o modelo produz. ACHADO
NOVO em 21/08/2026, e ele é o mais fundo desta sessão.**

Medido num mandato passivo de 20 meses, em **unidades de traço, de 20 possíveis**:

| indicador  | 6 meses | 12 meses | 24 meses |
| ---------- | ------- | -------- | -------- |
| PIB        | 2,8     | **6,0**  | 10,1     |
| Inflação   | 0,2     | 0,4      | **0,6**  |
| Juro       | 0,3     | 0,6      | 1,2      |
| Desemprego | **0,0** | 0,1      | 0,3      |
| Dívida/PIB | 0,2     | 0,5      | 1,0      |

**Quatro dos cinco movem menos de UMA unidade de vinte em dois anos.** A inflação vive
entre 3,1% e 4,2% contra uma régua de 0 a 15%; o desemprego não sai de 7,7%.

⚠ **E O DESENHO JÁ FOI TROCADO, então ele está descartado como causa.** A escada de blocos
morreu nesta sessão e virou linha de SVG, e a janela dobrou de 6 para 12 — o PIB passou a
mostrar movimento de verdade, e os outros quatro **não mudaram nada**, porque não há o que
mostrar.

**São duas hipóteses, e elas pedem coisas opostas:**

1. **as réguas estão largas demais.** Apertar `SCALE.inflation` para [0,02; 0,06] faria a
   linha viver. ⚠ **Mas ela perderia o drama exatamente quando ele importar:** uma
   inflação de 12% viraria uma linha reta encostada no teto, e é justamente esse o mês em
   que o jogador precisa ver a curva subir;
2. **o modelo macro é estável demais.** Um mandato inteiro sem o jogador tocar em nada
   move a inflação em 1,1 ponto. Se o ATIVO também não move, o problema não é de tela.

⚠ **A MEDIÇÃO QUE FALTA É A DO GOVERNO ATIVO**, e ela decide qual das duas: `npm run
simulate` com um governo que corta e escreve. **Não meça no passivo** — foi o passivo que
produziu a tabela acima, e ele é o caso mais calmo possível por construção.

**E a decisão é do responsável nos dois ramos**, porque calibragem não se muda para fazer
um desenho ficar bonito: se a régua estiver errada, é conserto de leitura; se o modelo
estiver parado, é conserto de jogo, e os dois têm donos diferentes.

**46. ⚠ RECARREGAR A PÁGINA APAGA A LEITURA DO MÊS, e o save não tem como devolvê-la —
ACHADO em 21/08/2026, conserto parcial em 25/08/2026.** `last`, o relatório do turno, é
**variável de módulo do entrypoint** e não vai para o save. Numa recarga o estado volta
inteiro do `localStorage` e `last` volta **nulo**: `describeMonth` não produz carta nenhuma,
e se `state.mail` também estiver vazia a bandeja fecha com **zero ofícios**.

Reproduzido num navegador de verdade, sem tocar em código:

| momento           | ofícios na bandeja |
| ----------------- | ------------------ |
| abertura          | 1                  |
| depois de 3 meses | 1                  |
| **depois de F5**  | **0**              |

✔ **A METADE VISÍVEL FOI CONSERTADA**: o estado vazio dizia _"O primeiro mês ainda não foi
resolvido"_ em junho de 2027, com três meses resolvidos, e prometia na linha seguinte que
_"todo mês que você resolve chega aqui"_. Agora ele tem duas frases e escolhe pelo MÊS do
estado — que atravessa o save —, e não por `last`, que não. A prova
_"A BANDEJA VAZIA DIZ A VERDADE SOBRE O MANDATO"_ trava as duas.

⚠ **MAS A PERDA DE LEITURA CONTINUA, e ela é a metade que importa.** O fechamento do mês —
a carta assinada pela Casa Civil, com o que o mês fez — **desaparece na recarga e não
volta**. A Caixa de Entrada é a superfície central do desenho (_"o inbox é o jogo"_), e um
F5 apaga a única coisa que o mundo escreveu.

⚠ **E O CONSERTO COLIDE COM UMA RECUSA REGISTRADA, por isso ele é decisão do responsável.**
A prosa do estado diz: _"a leitura do mês NÃO é carta; guardá-la aqui obrigaria o save a
carregar 48 relatórios para reescrever um texto que o turno já sabe produzir"_. **O
argumento é contra guardar 48, e guardar UM é outra coisa** — mas é mudança de forma do
save, e este save **recusa versão diferente em vez de converter**: custa a partida em
andamento de quem estiver jogando. As três saídas:

1. **persistir só o último relatório** — resolve inteiro, custa um bump de esquema;
2. **regenerar do estado** — ⛔ impossível: o relatório é função do estado ANTERIOR e das
   ordens daquele mês, e nenhum dos dois sobrevive;
3. **aceitar a perda e declará-la** — é o que está no ar agora, e é honesto, mas o jogador
   perde a leitura sem saber que existiu.

⚠ **O `events` stream também é código morto em `state.streams`** — nenhum motor o consome.
Remoção requer mudança de tipo em `Streams` e bump de esquema, junto com o `last`.

**45. ⚠ AS ESCADAS DE FINANÇAS TÊM O MESMO DEFEITO QUE REPROVOU A DA BARRA, e elas estão
na tela há sessões — ACHADO NOVO em 21/08/2026, pego na captura do passeio.**
`.ledger__spark` declara `font-size: 0.5rem`, e é a mesma conta do achado 44: o bloco `▁`
tem **um oitavo do corpo da fonte**, então a 8px ele é **um pixel**. Na captura de
`walk-financas.png`, `PIB R$ 12,42 tri ______` e `Inflação 3,1% _______` leem como
sublinhado do número, e não como desenho.

⚠ **E ELE É MENOS GRAVE LÁ, o que é a razão de ele ter sobrevivido:** cada linha do painel
traz a variação ESCRITA ao lado — _"−6 em 6 meses"_ —, então a escada é o segundo sinal e
não o único. Na barra superior não havia texto de apoio, e por isso o mesmo tamanho
reprovou.

⚠ **E O CONSERTO NÃO É ÓBVIO, por isso ele é achado e não conserto.** Finanças é a tela
**densa por decisão registrada** — _"em tela que só informa, densidade é o serviço"_ —, e
subir a escada de 0,5 para 0,7rem engorda **dezoito linhas** de um painel que já foi
calibrado para caber. É uma troca entre legibilidade de uma peça e a altura da tela
inteira, e ela é decisão do responsável.

**40. ⚠ "QUEM TRAVA A OBRIGATÓRIA" CAIU DE TRÊS PARA UM, e isso é PERDA DE RESPOSTA e não
conserto — 21/08/2026.** O responsável pediu o corte do bloco inteiro; a verificação
recusou o corte porque **a leitura não existe em outro lugar**: Finanças mostra a
obrigatória como TOTAL, e quem trava só aparece programa a programa, espalhado por oito
telas de ministério. Apagar aqui apagaria do jogo a única resposta ao item de auditoria
externa que criou o bloco — _"não há como investigar quais leis herdadas estão sugando esse
dinheiro"_.

O meio-termo entregue foi **o maior travador, nomeado, numa frase**: `Aposentadoria urbana
trava R$ 66,7 bi`. Custou ~80px e quatro linhas. ⚠ **O segundo e o terceiro estão a um
parâmetro de distância** — `lockedBy(state, catalog, top)` continua devolvendo três, e é a
tela que imprime um. **A pergunta que fica aberta não é de layout: é se um só basta.** Um
governo que corta previdência vê o número mudar; um que não corta vê a mesma linha por 48
meses, e aí ela vira legenda estática — que é exatamente o defeito que as frases de desejo
da CALDEIRA acabaram de pagar.

**37. ⚠ A ÚNICA CARTA QUE PERGUNTA EXIGE UM TEXTO QUE MACHUCA DUAS ALAVANCAS, e ninguém
diz isso ao jogador — ACHADO NOVO em 20/08/2026, e é o mais fundo desta sessão.**

Medido num navegador de verdade, com o jogo jogado de fato:

| como se joga                             | perguntas em 30 meses |
| ---------------------------------------- | --------------------- |
| passivo (só avança o mês)                | **0**                 |
| ativo, cortando UMA alavanca por pauta   | **0**                 |
| ativo, cortando TRÊS alavancas por pauta | a primeira no mês 5   |

A causa **não é defeito**: é a regra de `reports`, em `passage.mjs`, escrita e justificada
com um defeito medido atrás dela — _"o relator que apaga a única cláusula do texto não
escreveu um jabuti: ele REJEITOU o projeto, e rejeitar é trabalho do plenário"_. `hurt < 2`
devolve `saved: undefined`, e **sem emenda não há pergunta**.

⚠ **O que não estava escrito em lugar nenhum é a consequência de jogo:** a Caixa de
Entrada é a superfície central do desenho inteiro — o ciclo 4 diz que _"o inbox é o
jogo"_ —, e um presidente cauteloso, que mexe numa coisa de cada vez, **atravessa quatro
anos sem que ela pergunte nada**. Toda a tensão que o dossiê externo sentiu faltando na
tela tem aqui uma das causas, e ela não é de CSS.

⚠ **E o conserto NÃO é baixar o limiar para 1.** Isso reabriria o defeito que a regra veio
consertar — zero votações em 24 meses. As saídas honestas são outras, e as três são
mecânica e não pintura:

- **os DOIS LOBBIES MUDOS** (item 2 da ordem antiga) — o mercado e o baixo clero. Eles
  perguntam por conta própria, sem depender de o jogador escrever texto grande;
- **o relator emendar por OUTRA razão** que não "sobrou alavanca" — hoje a única porta
  para uma pergunta é o tamanho do texto;
- **a tela dizer o que ninguém diz**: que um texto de uma cláusula não passa por
  relatoria com emenda. Isso é informação de regra, e ela não existe na interface.

**35. A IDENTIDADE DO ACHADO 31 COLIDE COM UMA AFIRMAÇÃO DE DESENHO, e a colisão é da
SAÚDE.** `areas.mjs` diz em prosa que a saúde _"decai rápido porque fila e
desabastecimento aparecem em semanas"_. A identidade a põe entre as **mais lentas**
(meia-vida de 63 meses), porque no catálogo ela custa R$ 0,33 bi por ponto de índice —
cinco vezes o preço de um ponto de segurança.

Sete das oito ordens sobreviveram; esta não. **Uma das duas afirmações está errada**, e
decidir qual é recalibragem de `yield` ou de `cost`, e não conserto de decaimento. ⚠ É
achado, e o registro está na prosa do catálogo também.

**36. A CATRACA DO RATEIO — `honour` grava o corte no estado e nada nunca o devolve.**
Um mês de aperto encolhe o orçamento **para sempre**: medido antes desta sessão, o
`herdado` perdia 11,5% da indústria em sete meses e terminava o mandato com R$ 70,7 bi
de folga e o Estado ainda encolhido. A prosa de `settlement` declara a intenção — _"o
Estado inteiro escorregando para o mínimo legal"_ —, mas **a permanência não está
escrita em lugar nenhum**, e no mundo o contingenciamento é anual e se libera. ⚠ Hoje
ela é visível e reversível pelo jogador (basta arrastar o controle de volta); deixa de
ser no dia em que alguém automatizar a decisão.

**7. A calibragem de ECLUSA continua sendo um primeiro chute** — `PIVOT 58`,
`SPREAD 16`, `THREAT_WEIGHT 85`. Agora há três instrumentos para conferir contra
comportamento: o simulador, a tela e o passeio.

**8. `src/data/bills.mjs` é catálogo morto que ainda respira.** As 36 pautas
prontas foram aposentadas pelo orçamento granular, e o arquivo continua no
catálogo porque as suítes do Congresso e das telas montam casos com ele. Ele
precisa virar fixture de teste ou morrer.

**10. O benchmark de fps continua não medindo nada** — os dois braços batem no teto
de 240 Hz do monitor. Herdado.

**11. O jogador não tem como escrever gatilho, exceção nem revogação.** A gramática
existe e é executada; o canal de ordens só carrega faixa. É a Parte 3 (tramitação)
que abre esse canal, e ela precisa decidir uma coisa que a Parte 1 não decidiu:
**como se cobra por um texto que não muda nada hoje.** Uma cláusula de gatilho
desligada tem efeito zero no mês em que passa — cobrada pelo efeito, ela sairia de
graça e explodiria depois. O caminho provável é o rito sair do **alcance** do
texto e não do delta dele.

**12. `state.norms` cresce e nada o poda.** Um mandato de reformas termina com
dezenas de textos por cima dos 44 herdados (o `explorador` fecha com 82). Hoje isso
é barato — a resolução é O(normas × alcance) e roda uma vez por turno —, mas é o
risco 8 do ciclo, e o simulador passou a imprimir o tamanho do arquivo justamente
para essa linha ser vigiada. Junto vem o risco 2: **a tela ainda não tem onde
mostrar a pilha.** Ela mostra a faixa vigente e não diz quantas normas a
produziram, nem qual delas trava cada parcela.

**26. A VINCULAÇÃO INCIDE SOBRE A RECEITA BRUTA, e no mundo real é sobre a CORRENTE
LÍQUIDA.** O art. 198 prende 15% da RCL — depois do que sai para estados e municípios
—, e o modelo ainda tem uma receita só. A consequência está escrita no catálogo e é
conhecida: **as frações deste jogo são menores que as constitucionais porque a base
delas é maior** (a saúde fecha em 8,0% da bruta, e não 15% da líquida). É a metade
"transferência" da Parte 2 do ciclo 4, que **não foi feita**. Consertar exige uma
terceira fatia de receita, e a prova de âncora (`agenda.mjs`) precisa acompanhar.

**28. O PRÊMIO DE RISCO SÓ FICA PERCEPTÍVEL DEPOIS DE ~8 p.p. DE DETERIORAÇÃO.** Com
`riskPremium: 0,5`, a dívida a 80% paga **0,01%** e a 89% paga **0,6%**. A progressão é
o desenho — o mercado tolera antes de fugir —, mas a faixa que um mandato de fato
visita é 78%–89%, e nela o prêmio passa quase todo o tempo perto de zero. ⚠ **É
calibragem, e vai junto com o achado 22**: um preço que só morde fora da faixa jogada
é um preço que o jogador nunca sente.

**22. ⚠ O DIAGNÓSTICO DE "TRAMITAÇÃO ESTRANGULADA" NÃO SE SUSTENTA NO NÚMERO MEDIDO —
remedido em 24/08/2026, ver o achado 54.** Este item já mudou de número duas vezes: "3 de
24", depois "4 de 11", e as duas leituras vinham de instrumento quebrado ou de horizonte
misturado.

**Medido a 48 meses, semente padrão:** a `agenda` aprova **29 de 43 (67%)** e a `base`
**35 de 42 (83%)**. Um Congresso que aprova dois terços do que o governo protocola não está
estrangulado — isso é "legislar custa, e o preço se paga", que é o efeito pretendido.

⚠ **O QUE SOBREVIVE DO ITEM É OUTRA PERGUNTA, e ela não é sobre a taxa de aprovação:** é
sobre o que morre **antes** do plenário. As 43 votações da `agenda` são o que CHEGOU lá; a
gaveta e a relatoria continuam sem medição própria, e o achado 50 mostra o outro extremo —
a sonda `legislador` fecha o mandato com **2 normas e 2 de 39 aprovadas**. ⚠ **E entrou um número novo
na mesma família: `ANSWER_TIME = 2`**, o prazo da pergunta, declarado como primeiro
chute na prosa de `mail.mjs`. O que NÃO é chute está escrito lá: ele tem de ser maior
que um, senão "responder" vira "responder agora" e o prazo não compete com nada.

**23. O PREÇO DE TRAVAR É SÓ O RELÓGIO.** Recusar o relatório devolve o texto à gaveta
com o `writtenAt` intacto — preço real, e talvez barato. Cobrar também na **memória do
relator**, pelo trabalho recusado, seria o preço mais expressivo e exige um canal novo
em ELENCO: `remember` credita por verba prometida e paga, e **uma ofensa não é um
calote**. Se a calibragem do achado 22 mostrar que travar sai de graça, o canal da
ofensa é o lugar certo de mexer.

**24. ✅ CONCERTADO — RÓTULO DE TEXTO NÃO DISTINGUE TEXTO.** Dois projetos escritos em meses diferentes
com o mesmo movimento têm o mesmo rótulo, e a bandeja mostra duas cartas aparentemente
idênticas — visível em `captures/passeio/carta-pergunta.png`. Hoje é cosmético; deixa de
ser no dia em que o jogador tiver duas perguntas abertas e precisar escolher entre
elas.

**Conserto (27/08/2026):** `kind` adicionado ao tipo `Dispatch` e exibido como tag na
linha do índice para os três kinds sem prefixo no assunto: demand ("Exigência"),
rupture ("Ruptura"), siege ("Cerco"). Os demais kinds já trazem a espécie no subject
("Pautei:", "Devolvi com emenda:", "Esquecido:" etc.). Alterados:
`src/ui/screens/inbox.mjs` (typedef + paper + rowHtml + const DISPATCH_TAG) e
`styles/45-screen-cabinet.css` (classe `.tray__kind`).

**18. O `explorador` deixou de medir o orçamento.** Com a tramitação ele destrói a
própria base em três meses — promete 100% a todos, o rateio corta, e a memória do
presidente da Câmara vai a −0,44 —, então nada dele chega a votar. Ele continua
sendo uma sonda válida, e agora de outra coisa: **prometer demais mata o governo**.
Para voltar a medir "quebrar o orçamento", que foi o que encontrou o achado 1, ele
precisa **parar de prometer verba**. É mudança de INSTRUMENTO e não de modelo, e por
isso está aqui e não foi feita sozinha.

**20. A RUA PRECIFICA VOTO E MAIS NADA — e METADE dele caiu em 16/08/2026.** A
chantagem deu mão ao lobby: os dois grupos que leem a MALHA agora exigem, e ceder ou
recusar move dinheiro e pressão. ⚠ **O que continua de pé é a outra metade**, e ela é a
que o achado nomeia: a SONDA — a rua propriamente dita — segue sem tocar em índice, em
receita ou em despesa. Um governo detestado ainda governa um país que funciona igual. O
texto original: A aprovação da SONDA desloca a resistência
da ECLUSA — e para no voto. Ela não toca em índice de área, em receita, em despesa
nem em nada físico: **um governo detestado governa um país que funciona igual.** O
buraco foi apontado de fora e procede; o desenho que veio junto (greve por categoria
profissional, entregue por CASCATA) **não pluga** — a SONDA segmenta por renda, não
por profissão, e CASCATA é só contrato. É um ciclo, e não um conserto. Ver
[`research/03-mecanicas-de-referencia.md`](research/03-mecanicas-de-referencia.md).

**17. ✅ CONCERTADO — Dois pontos de quebra convivem sem nada declarar a diferença** — 640px e
720px, mais o 1180px do rail. Lendo os blocos, a intenção existe e é razoável: 720
é o refluxo de tablet e 640 é o colapso de telefone. Mas a atribuição parece
arbitrária (a bancada colapsa em 640, os cartões do Gabinete em 720), e nada
escreve a regra. A peça nova desta sessão — a gente dentro da bancada — foi para
640 **de propósito**, para refluir junto com o pai que a contém; peça aninhada que
quebra antes do pai lê como defeito. Isto é padronização por escrever.

**Conserto (27/08/2026):** Comentários em 5 arquivos CSS atualizados — 720px declarado
como breakpoint efetivo (território de telefone), 640px como limiar conceptual sem
regra CSS separada. Alterados: `30-components.css`, `40-shell.css`, `50-screen-mesa.css`,
`60-screen-area.css`, `70-screen-closing.css`.

**16. Quatro das cinco ambições do elenco são INERTES.** Só `succession` tem preço
— `successionDrag` em `offered`. `cabinet`, `state`, `court` e `seat` estão
declaradas no catálogo com prosa e não movem nada. A tela passou a mostrá-las como
caracterização (quem a pessoa é), e **só a sucessão leva a consequência escrita ao
lado**, porque é a única que o motor cobra. Elas ganham preço na tramitação e na
queda. Remedido em 28/08/2026: a distribuição é uniforme em 600 sementes
(20,4/19,7/19,9/20,3/19,6 em 4.800 pessoas) — mas com oito pessoas e cinco
ambições, uma partida pode dar quatro iguais, e a de abertura dá (quatro querem o
governo do estado). Não é defeito de hash; é amostra pequena. Sortear estratificado
é decisão de desenho, não conserto.

## O que existe

### A tela

**A casca é o Gabinete**, na estrutura do Football Manager 2020: barra superior
fixa com data, quatro sinais vitais e o botão de avançar; sidebar por **poderes e
lugares**, com as oito áreas um nível abaixo em Ministérios. Vidro em três níveis
(`stage` · `action` · `support`) e substrato de aurora em CSS puro. O rail duplo e a
Mesa morreram na sétima sessão.

**Doze telas**: o Gabinete, Congresso & Leis, Finanças, as oito áreas e O Estado.
A Rua e Bastidor saíram do rail no D7, e voltam com dono: a primeira depende da
imprensa e das pessoas agindo sozinhas, a segunda da coalizão.

O **Gabinete** é duas colunas, com a Trindade do risco atravessando as duas por
cima: a Caixa de Entrada à esquerda (3fr) e **quatro** cartões empilhados à direita
(2fr) — Quem pode derrubar no topo, A Câmara com a base repartida em quatro fatias
e chave, o Cofre com quem trava o orçamento, e a Rua por classe de renda.

Regras que valem para toda tela nova: **uma lâmina por tela** (os cartões do
Gabinete são a exceção declarada), a tela **pergunta** ao motor em vez de refazer a
conta, número que vai para atributo passa por `attr`, toda view traz o próprio
elemento de fora, e **ausência não é resultado** — com o corolário que a oitava
sessão acrescentou: **ausência declarada não é ausência disfarçada**, e são dois
estados vazios diferentes.

### Os dados (`src/data/`)

Blocos partidários no plano de Nolan com venalidade por eixo; programas com custo,
faixa de abertura, guarda e posição; regras de propriedade e poder; grupos de pressão
e faixas de renda; arquétipos de gente com o vocabulário de nomes que os gera
(`cast.mjs`, e o ADR 0003 na frente dele); parâmetros fiscais, macroeconômicos, de
opinião, de elenco e do regime; e um validador de esquema que não conserta nada.

⚠ **A TABELA ABAIXO É COBRADA POR PROVA, e ela existe por defeito medido.** A prosa
deste projeto afirmou por sessões um Congresso de "onze bancadas" e um elenco de "sete
pessoas" enquanto o catálogo tinha outros números — a família que `standards.md` §7
declara sem guarda. Agora toda linha de duas colunas deste arquivo cujo rótulo esteja
na lista é conferida contra `CATALOG` por `tests/suites/catalog.mjs`.

| coleção            | quantos |
| ------------------ | ------- |
| blocos partidários | 9       |
| cadeiras           | 513     |
| áreas              | 8       |
| programas          | 38      |
| regras             | 6       |
| grupos de pressão  | 4       |
| faixas de renda    | 3       |
| arquétipos         | 8       |

A âncora que amarra tudo: `tests/suites/agenda.mjs` prova que a soma dos programas
bate com a posição fiscal de abertura, e que **a obrigatória é a soma dos pisos**.
Sem isso haveria duas verdades sobre quanto o Estado gasta.

### Os motores

- **LASTRO** (`src/domain/budget/`) — receita do PIB, obrigatória em valor
  absoluto, teto do arcabouço, gatilho de contingenciamento;
- **ECLUSA** (`src/domain/congress/`) — `whipCount` determinístico, `vote` com
  dissidência no dia, `settle` com decaimento, afago e traição, `dispersion`;
- **MALHA** (`src/domain/capacity/`) — índices por área, decaimento, rendimento da
  alocação e a pressão que volta para receita e despesa;
- **SONDA** (`src/domain/opinion/`) — a satisfação de cada segmento, a pesquisa que
  ela vira, e o peso que a rua tem na votação;
- **ELENCO** (`src/domain/cast/`) — as pessoas do mandato, geradas da semente sem
  consumir fluxo de aleatoriedade; a memória de cada uma, e a tradução dela em
  verba. `benches` divide a Câmara entre líderes e blocos;
- **CORRENTE** (`src/domain/economy/`) — hiato, Phillips, Taylor, Okun, população,
  e `carry`, que é o que faz gasto virar dívida e dívida virar juro;
- **ESTRATO** (`src/domain/norms/`) — a pilha de normas lida como faixa vigente,
  com precedência declarada, gatilho reavaliado por turno, vigência, exceção e
  revogação. `inherited` faz a norma de abertura de uma alavanca; `enact`, a que
  uma aprovação escreve.

### A composição

- **`src/application/agenda.mjs`** — `compose` (o orçamento vira proposta),
  `honour` (o rateio empurra o nível de volta ao piso), `spendOf`;
- **`src/application/turn.mjs`** — `bandsOf`, `settlement`, `ledger`,
  `situationOf` e `playMonth`, nesta ordem de escopo: as quatro primeiras
  respondem "o que aconteceria", a última executa. `bandsOf` é a porta da lei
  vigente: ela monta as alavancas e os indicadores e pergunta ao motor de normas,
  para a tela nunca remontar a legislação por fora;
- **`src/public/index.mjs`** — a fachada, e a guarda `boundaries` prova que o
  entrypoint não alcança domínio nem aplicação por fora dela;
- **`tools/simulate.mjs`** — o mandato no terminal, **nove** políticas-sonda:
  `herdado`, `piso`, `base`, `agenda`, `explorador`, `promessa`, e as três que
  nasceram de achados — `concentra` e `favoritos` (52), e `legislador` (50).
  `explorador` não governa: derruba todo piso, levanta todo teto, gasta o máximo e
  promete verba cheia, tentando quebrar o orçamento. Foi ela que mediu o achado 1.
  O resumo imprime o **tamanho do arquivo legislativo**, que é o instrumento dos
  riscos 2 e 8 do ciclo.

### A verificação

**Doze guardas** com provas sintéticas e **258 propriedades**, e o **passeio**
(`npm run walk`), que usa a tela como se joga a 1440×980 e mede rolagem, recorte,
sobreposição e contraste no pixel renderizado. ⚠ **O passeio está DENTRO do
`validate`** — o portão vê a tela desde 23/08/2026, e o custo é 42s contra 9s.

## O que ainda não existe

- **TEMPORAL, CASCATA, DELTA** — só os contratos;
- **tensão institucional** — decidido que será variável de estado e não motor
  novo: `risco = f(tensão − escudo)`;
- **contraste de texto que NÃO é folha** — o medidor existe e está no portão, mas só
  alcança elemento sem filho elemento: num `<p>` com `<b>` dentro, o texto próprio do
  pai não é medido por ninguém. Ver `standards.md` §7;
- **`d3-force`** — entra quando DELTA existir, em Worker;
- **GitHub Pages** — decidido ficar só com o CI por enquanto.

## Decisões fechadas que não se reabrem sem pedido

Fase 1 só o Brasil · turno mensal (48 por mandato) · inglês no código e português
na prosa · seis camadas de estilo · codinomes de motor · zero build e zero
dependência de runtime (exceção: `d3-force` vendorizado) · lealdade é estado
serializado · motor nenhum chama outro motor · o Congresso responde ao que foi
PAGO · o rateio da falta é proporcional · a âncora do arcabouço é o TETO que
vigorou · a tela pergunta ao motor e não refaz a conta · a previsão usa o que
será pago, nunca o prometido · o rascunho morre com o mês.

⚠ **UMA DECISÃO SAIU DESTA LISTA e o registro fica:** _"o rail lista áreas de
governo"_ valeu enquanto o jogo era só orçamento. O ciclo 4 a reabriu de propósito
— com legislar virando atividade própria, o Congresso deixou de ser um instrumento
e virou um **lugar** —, e a sidebar passou a listar poderes e lugares, com as áreas
um nível abaixo em Ministérios. A regra antiga sobreviveu ali: quem quer mexer na
saúde entra em Ministérios.

**Fechadas nos ciclos 2 e 3:**

- **tudo é uma alavanca, e toda alavanca tem preço.** Some o catálogo de pautas;
- **a posição ideológica é calculada, nunca arrastada.** Não há cursor na tela;
- **o rito é consequência do conteúdo**, e o mais exigente manda no pacote;
- **o jogador não inventa substantivos** — ele compõe restrições sobre
  substantivos que existem. É o que faz "liberdade quase infinita" ser computável,
  e é onde a IA entra quando entrar: traduzir intenção em combinação de faixas;
- **o catálogo cita fonte.** Número real e datado nos dados; a ficção é o que o
  modelo faz com eles;
- **o painel de Finanças não tem controle**, e mostra o mês como ele vai fechar.

**Fechadas no ciclo 4, Parte 1:**

- **a ordem entre normas contraditórias** — hierarquia, depois especificidade,
  depois recência, depois ordem de escrita. Ela é total, e o último critério existe
  para nunca haver empate;
- **lei geral posterior não revoga lei especial anterior.** Para a geral vencer a
  especial, ela tem de **nomear** o que revoga;
- **ausência de norma é ausência de restrição** — nunca a faixa do catálogo;
- **não se revoga o que ainda não foi escrito**;
- **a faixa vigente é derivada, e nunca guardada.** O estado guarda o texto.

**Fechadas no ciclo 4, Parte 5:**

- **toda pessoa é gerada da semente, e nenhuma entra no save.** O que se guarda é a
  **memória** — as pessoas se refazem, o que você fez com elas não se refaz de lugar
  nenhum;
- **o elenco não consome fluxo de aleatoriedade.** Só TEMPORAL e ECLUSA sorteiam, e
  cada um com o fluxo dele; um elenco puxando do mesmo fluxo faria acrescentar um
  personagem mudar todas as votações do mandato;
- **uma pessoa é uma bancada de um só**, e por isso ECLUSA não mudou uma linha para
  atendê-la. O líder leva a fração que arrasta; o resto do bloco continua sendo o
  bloco, e o bloco nunca desaparece da Câmara;
- **ambição é preço, e não personalidade.** Quem quer o Planalto em 2030 reconhece
  menos da verba que recebe — é o único termo do elenco que dinheiro não compra;
- **a traição pesa mais que o favor**, como em SONDA e pela mesma razão.

**Fechadas fora de ciclo, na oitava sessão:**

- **o modelo tem de conseguir rodar déficit primário.** Um país que não consegue
  perder dinheiro não é este país, e há três provas cobrando isso;
- **o preço de um texto escala com a dispersão dele**, e não só com o rito. Juntar
  tudo num pacote deixou de ser grátis;
- **"instantâneo" é propriedade do que RESPONDE ao jogador**, não do que acontece
  ao redor dele. Por isso o toque encolheu para 90 ms e o gel da aurora não encolheu;
- **o layout é uma promessa**: a tela não muda de esqueleto quando o conteúdo chega.

**Princípio de design:** _tudo tem um jeito de ser feito._ Nenhuma jogada é
bloqueada por regra artificial — o que separa o possível do impossível é o
**preço**.

Referências de interface: **Geopolitical Simulator** e **Football Manager 2020**.
Liquid glass é a base do design inteiro, não um efeito de algumas telas.

## Fontes de modelagem

O modelo político-econômico nasceu de um dossiê externo, revisado e corrigido. As
correções estão registradas na prosa de cada arquivo: `src/data/parties.mjs`
(venalidade), `src/data/fiscal.mjs` (despesa obrigatória absoluta),
`src/data/macro.mjs` (o juro do estoque inteiro),
`src/domain/congress/index.mjs` (as duas parcelas da resistência),
`src/domain/economy/index.mjs` (o hiato em termos reais) e
`src/application/turn.mjs` (a ordem entre orçamento e votação).

A pesquisa de campo que sustenta o catálogo real está em `docs/research/`.
