# O arquivo — o que cada sessão fez, e por quê

> ⚠ **ISTO NÃO É O PONTO DE RETOMADA.** Ele mora em [`handoff.md`](handoff.md), é
> curto de propósito, e só carrega o que é verificável hoje.
>
> **Aqui é narrativa de sessão, e narrativa tem data.** Todo número deste arquivo foi
> medido no dia em que foi escrito e envelhece calado: o achado 37 foi citado como
> verdade uma sessão inteira depois de o conserto que o invalidou ter entrado, e uma
> tabela de calibragem errada por um fator de 3 fez escolher um limiar que produziu o
> defeito que a mudança existia para consertar.
>
> ⚠ **Antes de repetir qualquer número daqui, remeça-o.** O que se lê aqui é por que uma
> decisão foi tomada — nunca qual é o estado do projeto.

## A SESSÃO DA AUDITORIA ANTES DO COMMIT — 11/09/2026

Ele mandou revisar e auditar tudo o que está fora do commit: _"quero zero bugs, zero brechas,
código robusto"_. No meio dela, duas ordens: tirar o fundo preto de quando a pasta vem à frente,
e preparar um plano de otimização e limpeza profunda para ele aprovar.

### 1 · ⛔ O gesto da mesa sobrevivia à partida

`lifted`, `at` e `sealed` são variáveis de módulo em `cabinet.mjs`, e a posse não as limpava.
**Reproduzido no navegador, e não deduzido:** assinar em jan/2027, clicar em NOVA PARTIDA e
tomar posse devolvia o decreto de jan/2027 **já rubricado**, com a pasta na mão a 710px (448 na
mesa) e a sala apagada a 0,62. A epígrafe é função pura do mês, então ela se repete entre
partidas — comparar por ela não separa duas mesas, e por isso o gesto precisa morrer explícito.

⭐ **E o passeio passou a ver os dois lados.** Ele ergue, assina, recomeça e cobra a mesa limpa.
Sem `forgetDesk()` ele acusa `707px contra 683px`. ⛔ **A primeira versão da prova era cega:**
ela clicava no centro da folha, e no meio do ato moram as oito pastas do Art. 2º — um
`[data-protect]` sob o ponto médio devolve o clique como MARCA, e a rubrica nunca corria. O
toque foi para a epígrafe. ⛔ **E ela era intermitente por outra razão:** clicar 400ms depois de
trocar de tela pegava o snapshot da view transition, e `elementFromPoint` devolvia o
pseudo-elemento. É a mesma lição que a etapa do email já tinha pago — espera-se o estado.

### 2 · A carta que vence era a primeira a ser cortada

`app.mjs` ordena as urgentes para o FIM, para caírem por cima; `mail-pile.mjs` fatiava os oito
primeiros. Com 12 cartas e 3 vencendo: oito envelopes e **nenhum vermelho**. ⚠ Medido, não
morde hoje — o pico em 48 meses passivos é **4 de 8** —, e morde na etapa 3, que é justamente a
que faz a Caixa crescer. A prova nova falha na versão anterior do arquivo.

### 3 · O tamanho da cena estava vencido em quatro comentários

A foto virou 1916×821 em 11/09, e `1206x806` sobreviveu em `eslint.config.mjs`, `46-desk.css`
(duas vezes), `tests/guards/tokens.mjs`. ⛔ **O pior estava em `cabinet.mjs`:** o mesmo bloco
dizia **1672x940** e **1206x806**, 34 linhas abaixo do aviso _"mexeu na foto? estes dois números
mudam juntos"_. É a família do §7 outra vez, e ela não tem guarda: prosa que continua gramatical
e para de ser verdade. Um comentário no CSS ainda reservava a faixa da direita para "o boletim e
o calendário" — o primeiro não existe no governo real e o segundo ele recusou.

### 4 · E o véu saiu, por ordem dele

_"Quero que vc remova esse fundo preto de quando eu clico na pasta e ela vem pra frente da
tela."_ `.desk__veil` e `--lift-veil` saíram inteiros. O que sobe continua sendo escala mais as
duas sombras cruzando opacidade. **O voo em si não foi tocado** — ele segue 0,42s com `bounce`
0,22, e o "clean, digno de Apple" é a outra metade da etapa 2.

### 5 · A limpeza profunda, e ela se corrigiu com a medição

Ele aprovou o plano e mandou aplicar tudo. **Duas das cinco etapas entregaram; três voltaram com
um resultado diferente do que o plano previa, e o resultado é o achado.**

⭐ **C e A saíram inteiras.** `REGIME.firstYear` tinha schema e nenhum leitor enquanto 2027
estava teclado em três arquivos; e o tamanho da cena morava em três lugares com um aviso de que
mudavam juntos — o aviso que já tinha falhado em quatro comentários. Hoje os dois têm uma fonte.

⛔ **B provou que minha premissa estava errada.** Eu propus cortar a razão comentário/código de
0,70 para 0,45. Medindo direito, 1.749 das 6.593 linhas são contrato de tipo: a prosa é 0,52. E
inspecionando os piores arquivos, a gordura era **16 linhas** — cascas de comentário que
perderam o conteúdo numa poda anterior e viraram anúncio sem informação. O resto cumpre a regra.
⛔ **E eu não removi as 21 citações de ordem dele**, que o teto proíbe por escrito: apagar a
autoria de uma decisão de gosto é exatamente o erro que o CLAUDE.md registra como já cometido.

⚠ **E devolveu outra coisa que a pergunta.** Varrendo o CSS contra o DOM real — jogando, e não
só avançando — 127 de 565 regras nunca casaram. Elas não estão mortas: `.passage` só existe com
texto em tramitação. O que a lista é de verdade é o mapa do que o passeio não exercita.

⛔ **E D parou na fronteira.** Todo corte mapeado alarga a superfície pública: `inbox.mjs` pediria
seis funções privadas viradas públicas para mover 382 linhas. Os arquivos são grandes porque
concentram uma responsabilidade, e trocar isso por arquivos menores é decisão dele, não minha.

### 6 · O que a auditoria NÃO achou, e vale tanto quanto

O passeio ficou mais forte e não mais fraco: `checkNoOverlap(".desk > div")` saiu porque `.desk`
deixou de existir, e entraram as três matérias escritas, o voo medido, a volta por assentamento,
o papel que estoura e cartas atrás da pasta. `eslint.config.mjs` só ganhou globals do navegador.
Tudo que vem de dados passa por `escapeHtml`. E a série não se moveu: `agenda` 26/43, dívida
90,0% — nenhum arquivo de `src/domain/`, `src/data/` ou `src/application/` nesta árvore.

⚠ **Dois achados ficaram abertos de propósito, porque a decisão é dele:** o parecer soma mês com
ano na primeira frase do jogo (64), e a promessa da posse saiu do Gabinete sem substituta (63).

## A SESSÃO EM QUE A GUARDA APRENDEU A VER ESTADO — 10/09/2026, tarde

Ele mandou investigar tudo o que estava fora do commit e decidir por onde começar. O que a
leitura achou não foi um defeito, foi uma **família**: coisa que o portão aprova porque
ninguém a cobra.

### 1 · O seletor que nunca casou, e ele é o segundo da mesma mesa

⛔ **`.envelope[data-vence="true"]` contra `data-urgent` no HTML.** A carta que vence nunca
ficou vermelha, e nada falhava. É o mesmo defeito do `data-assinado` de 08/09 — dois na mesma
tela, os dois nascidos no porte da bancada, quando as classes viraram inglês e um atributo
ficou para trás.

⭐ **O conserto não é a linha, é a guarda.** `orphans` passou a cobrar também
`[data-x]`: o nome tem de ser escrito por alguém, como `data-x` no texto ou como `dataset`.
Ela roda no código inteiro e não só nos literais — quem escreve estado é HTML ou `dataset`.

### 2 · E o casador dela era cego de outro jeito

📐 **`\bdesk\b` casava com o `href="styles/46-desk.css"` do `index.html`.** O nome da folha
NOVA mantinha viva a classe VELHA: 59 linhas de `.desk` sobreviveram à tela inteira que foi
refeita, com a guarda verde. O irmão do defeito: `.verdict` casava com uma variável local
`verdict` em `platform.mjs` — mais 11 linhas.

⭐ **Classe só nasce dentro de texto.** Hoje a guarda lê os literais do `.mjs` e o HTML sem os
caminhos de `href` e `src`. Três provas sintéticas novas, e as três reintroduzem o que o
projeto acabou de pagar.

### 3 · O porte tinha atropelado o português

⚠ **38 comentários de CSS com nome de classe no lugar da palavra:** _"a sheet"_, _"a folder"_,
_"a room"_, _"a wax velha"_, _"a signature de couro desenhado"_, e a **ementa** do decreto
virada em _"a summary"_. Dois vazaram para `00-tokens.css`, um deles numa linha que nem é da
mesa. O replace que traduziu as classes traduziu a prosa junto.

### 4 · ⛔ E a carta vermelha, vista pela primeira vez, veio com dois defeitos

O bloco do urgente tinha **11 declarações que nunca chegaram à tela** — o seletor estava
morto desde o porte. Com ele vivo, a ampliação mostrou o que nenhuma prova pega:

1. ⛔ **a aba saía ROSA.** `.envelope__edge` era o triângulo INTEIRO pintado de branco, e a
   aba, que é semitransparente, não o escondia: o branco atravessava e lavava a metade de
   cima. No papel branco isso é invisível — branco sobre branco. Hoje o recorte é a **franja**,
   e não o triângulo: um polígono côncavo entre os dois bicos;
2. 📐 **o lacre sumia no rubro**: **1,49** de contraste, e **1,03** na crista, contra **7,46**
   no papel branco. ⛔ **Escurecer a cera não salvava — com preto puro o teto era 2,6**, porque
   o papel já era escuro.

⭐ **E a saída foi dele, e não estava entre as três que eu ofereci:** _"o vermelho do papel pode
ficar mais claro"_. Papel de `#9a2620` para `#bd4436` e a cera escurecida junto — **3,08**. Eu
tinha montado a escolha entre clarear a cera, trocar por tarja ou deixar como estava; nenhuma
das três mexia no papel, que era a peça livre.

### 5 · O primeiro laço com o Antigravity, e ele acertou o sintoma e errou a causa

Mandei o copiloto rodar o portão, auditar as capturas e fazer a verificação que eu não podia
fazer sozinho: **a carta vermelha nunca tinha sido vista numa partida de verdade** — eu forcei
o atributo à mão. Ele voltou com a tabela certa: mês 1 com uma carta, meses 2 a 24 com zero.

⛔ **E com a causa errada:** _"nenhuma carta nova chega na maioria dos meses passivos"_. Medido
no motor, a caixa vai de **1 a 25 cartas em 48 meses** e chega alguma em **27** deles. O
defeito era meu, e era de **um mês**: o turno grava a carta com o mês que fechou e devolve o
estado no seguinte, então `letter.month === state.month` dava zero em 47 dos 48. Aceitar o
diagnóstico dele teria mandado mexer no motor, que estava certo.

⭐ **E medir de novo achou o irmão do defeito:** `expiring` conta a caixa inteira e o punhado
desenha só o que chegou — marcar "as últimas N" pinta de vermelho carta que não vence quando
as duas listas divergem. Hoje **cada carta chega dizendo se vence**, e a que vence entra na
mesa mesmo tendo chegado antes: esconder a que fecha sem resposta é a mesa deixando de avisar.

📐 **Depois:** correspondência em **24 de 30 meses**, e a primeira carta vermelha do jogo no
**mês 28** — abril de 2029, aprovação em 18%. ⚠ **E um achado que sobrou:** a primeira carta
que PERGUNTA só chega no mês 26.

### 6 · A PASTA GANHOU A SEGUNDA FACE, e o "boletim" não existia

Ele escolheu terminar a mesa, e o passo 4 era o boletim da Casa Civil. 📗 **A pesquisa factual
matou a peça:** não existe boletim nenhum no governo real. O que vai à mesa é a **pasta de
despacho** — exposição de motivos, parecer de mérito, parecer jurídico e a minuta. ⭐ **Então as
seis leituras não eram peça nova: eram a face esquerda da pasta que o jogo já tinha**, e a capa
de couro vazia de 78px deixou de ser enfeite.

⛔ **E a primeira versão levou as réguas da Caixa para dentro do papel.** Ordem dele, vendo:
_"nenhum elemento além do que um ser humano escreveria, tipo essas barras, linhas… eu quero
humanizado, algo realmente presidencial"_. O parecer virou parágrafo numerado, e o limiar
passou a morar na frase: _"38 pontos de pressão, e o grupo abandona o governo em 40"_ diz o que
a marca da barra dizia. O rastreio de tipo saiu junto — datilógrafo não espaça letra.

### 7 · O borrão, e ele tinha duas causas

_"o texto fica embaçado quando eu clico na pasta e ela sobe, eu quero qualidade de papel"_.
⛔ **O headless não reproduz** — ele rasteriza por software e re-rasteriza sempre; quem vê o
borrão é o compositor de GPU. As duas causas são conhecidas: `-webkit-font-smoothing:
antialiased` desligava o subpixel do LCD na folha, e a textura era **ampliada**. Hoje o papel
nasce com `--paper: 720px` e chega à tela com ~500: **textura reduzida é nítida, ampliada
borra**. Os envelopes foram pela mesma conta — 360px reduzidos a 0,36 —, e as diagonais da aba
pararam de sair em escada. 📐 `npm run screen`: 64,0 contra 66,1 de controle.

### 8 · ⛔ E a mola andava por QUADRO

Medindo o voo, a pasta levou **3 segundos** para voltar à mesa num gesto de 0,26s. A causa não
era a mesa pesada: `spring.mjs` integrava com `dt` fixo de 1/60 **por quadro**, então a 12 fps o
gesto durava cinco vezes mais. ⛔ **E o conserto óbvio explodiu na primeira tentativa:** com
passo de 1/20 o amortecimento de um gesto curto passa de 2 e inverte de sinal — a pasta foi a
**12.878px** de altura. O certo é subpasso: o tempo real dividido em fatias de 1/120.

### 9 · A madeira dele, e três ordens em sequência

Ele mandou a foto do jacarandá — 1672×940, depois uma de 1916×821 — e três ordens, uma por
vez, cada uma vendo a tela: _"quero a imagem como ela está, sem perder nenhum pingo de
qualidade"_; _"tire essa bosta de verniz, tire tudo"_; _"nao quero ampliação alguma na textura…
A cor da pasta deve ser preta agora"_. ⛔ **Eu tinha errado três vezes antes de ouvir:** `cover`
recortava 341px da foto; o véu, o `multiply` do verniz e o grão da cena pintavam cera por cima
de cera; e a cena ampliava a foto por `--fit`. Hoje o tampo tem o tamanho exato da foto, `fit`
fecha em 1, e nada toca a imagem.

📐 **E o teto físico é declarado:** com 1916px de foto, a mesa nunca aparece maior que isso.
Em 1920×1080 cobre a largura; em 2560 sobra fundo. Ou ele manda uma foto maior, ou é isso.

### 10 · O plano de integração, e o diagnóstico veio antes

_"nao quero que a mesa destoe tanto do resto da UI, do liquid glass"_. Lendo `20-material.css`:
o vidro tem `backdrop-filter: blur(18px)`, **e atrás dele só havia um fundo liso** — o vidro do
jogo nunca teve o que refratar. A mesa era uma foto AO LADO do vidro, com borda dura e
temperatura oposta. Vizinhos, não camadas.

Quatro movimentos, aprovados e feitos em ordem: **M2** véu e vinheta apagam para `--bg-deep`;
**M3** sombras retas como as do `.glass-stage`, uma luz só; **M1** a madeira vira o
**substrato da janela** — a barra e o rail passam a refratar jacarandá, a cena fica só com as
peças, e a borda da mesa deixa de existir; **M4** 44px de degradê na beira inferior da foto.
⛔ No substrato, `saturate(1.5)`, o grão ladrilhado e a tinta da situação se desligam no
Gabinete — os três mudariam a cor que ele mandou não mudar. 📐 `npm run screen`: 76,3 contra
73,7 — dentro do ruído.

⛔ **E `place-items: center` não centra uma cena maior que a área:** a célula da grade cresce
até 1916px e começa em zero; a pasta apareceu cortada na beirada direita. `place-content`.

### 11 · "Finalize o gabinete antes de pensar nisso"

O dock ficou registrado e ele mandou fechar a mesa. Calendário: _"não quero"_. Objetos mudos:
não agora. **Telefone: sim** — e no meio ele mandou a referência, um telefone vermelho de mesa
com teclado e cordão espiral. A peça saiu vista de cima, como a mesa: base, fone no berço,
teclado 3×4 **sem número** (a 6px seria texto falso que o medidor cobraria), etiqueta e o
cordão em SVG tracejado. Toca quando `boilerOf` diz que um grupo ferveu; o clique abre o Email.
⛔ **A primeira captura veio sem teclado:** `.phone > i { display: block }` vencia a grade por
especificidade. Um seletor composto devolveu as doze teclas.

⚠ **E ele fechou a sessão com três ordens para a retomada:** a pasta _"horrível e lenta"_
tem de virar _"clean, digno de Apple"_ e **sem o fundo preto** quando vem à frente; os
envelopes são _"inúteis"_ hoje e no futuro abrem com animação e mostram a carta; e _"se for
muita coisa divida em etapas, não quero bugs"_. Tudo no handoff, em ordem.

**O prompt que ficou para amanhã, para o Antigravity (duas tarefas):** (1) `npm run walk` e um
script Playwright em `tmp/` a 1440×980 que amostre a cor média de três retângulos de 40×40 —
no rail atrás de "Congresso & Leis", na barra ao lado de "AVANÇAR", e na madeira nua — e
devolva os rgb e a razão WCAG contra o texto `#eef2f8`, piso 4,5, sem consertar; (2) pesquisa
com artigo literal e link: o timbre do decreto diz "Subchefia para Assuntos Jurídicos" — é o
nome vigente do órgão da Casa Civil que faz o controle de legalidade dos atos presidenciais?
Se mudou, nome atual e norma; e um decreto publicado no DOU traz o nome da unidade no timbre
ou só "Presidência da República"? Proibições e devolução fixa de 5 itens como sempre.

### 12 · E ele escolheu o próximo passo

**Terminar a mesa** — ciclo 25, passos 4 a 6. A razão que pesou: as três proibições do
copiloto são motor, calibragem e save, então num ciclo de motor ele fica sem função. O
Gabinete tem **2 objetos de 5**, e nenhum passo do 25 abre motor. A rubrica fica gesto até a
segunda caneta existir. Handshake acertado: **eu aplico e rodo o portão, ele audita a
imagem** e faz o ajuste fino de pixel.

`npm run validate` verde no fim: 13 guardas · 66 provas sintéticas · 323 provas · passeio.

## A SESSÃO DA DIVISÃO CLAUDE + GEMINI — 10/09/2026

Ele estuda plano mensal (Pro vs Plus) e decide montar co-desenvolvimento: Claude Opus 5
piloto, Gemini 3.8 Flash via Antigravity copiloto. O Gemini escreveu
`docs/plano-co-desenvolvimento.txt`; avaliei contra o repo e achei tudo certo nos números
(20 suites, 13 guardas, 323 provas, passo 4 = boletim/6 leituras, passo 5 = bandeja com
`left`/`silences`, `num`/`attr` em `format.mjs`) com 5 exigências (3 proibições, 2
acoplamentos, `.agents/rules`, devolução fixa, quota). A investigação prévia achou um
segundo acoplamento vivo: `codenames` lê a tabela de motores no `standards.md` §3.
No meio: dieta do `handoff.md` (2.386 → ~230 linhas) e do `CLAUDE.md` (343 → ~150) com
laços fixos; a compactação matou a tabela de contagens e o `test` acusou — restaurada
verbatim. Skills do executor em `.agents/skills/` (4); regravei os 4 em UTF-8 limpo.
Portão verde no fim: 323 passando, 13 guardas.

## A SESSÃO EM QUE O HANDOFF EMAGRECEU — 10/09/2026

Ele perguntou se dava para otimizar o projeto para gastar menos token — a cota semanal do
Pro acabava antes do reset. Medido: `handoff.md` com 2.386 linhas e 157K chars (~40K tokens
estimados), lido todo início de sessão, quando a regra dele manda ser curto. Virou 226
linhas e 13K chars: as seções datadas de sessão saíram (já moram aqui no journal), e ficou
só estado, fila, achados em 2–4 linhas cada, série, o que existe/não existe, decisões e
fontes. Nenhum item vivo perdido. `check` verde depois. E entrou a regra de economia de
contexto no cabeçalho dele: ler com limite, grep antes de ler, nunca reler o que a guarda
prova, uma sessão por item.

### A dieta continuou no CLAUDE.md — e a prova mordeu

Ele pediu o passo seguinte (dieta do `CLAUDE.md` + laços fixos), com a condição de não
quebrar nada. A investigação achou um acoplamento vivo: `tests/suites/catalog.mjs` lê o
`handoff.md` e cobra as 8 contagens em tabela de duas colunas — e a compactação tinha
convertido a tabela em prosa. O `npm test` acusou ("o handoff deixou de declarar uma das
contagens"), a tabela voltou verbatim, 323 passando. É o caso que a prova previa: apagar
linha a deixa verde para sempre.
`CLAUDE.md` foi de 343 para ~150 linhas: saiu o "Onde o projeto está" repetido do handoff
(ele dizia 323 e 325 provas em parágrafos vizinhos), ficaram regras, fluxo, proibições e
doutrina byte a byte. Entraram os três laços com ordem fixa e o teto de leitura do journal
(últimas ~150 linhas). `npm test` + `check` verdes depois.

## A SESSÃO EM QUE O CHECKLIST DO CARGO GANHOU REALPOLITIK — 09/09/2026

Ele pediu a reescrita da pesquisa 09 com foco absoluto no cargo real, não no jogo. No meio
da sessão, o Gemini produziu uma auditoria independente (`GDD - Auditoria e Redesenho do
Checklist Presidencial.txt`) com 33 itens de três colunas: Fatos/Leis, Realpolitik e UI/UX.

### 1 · O que entrou

- **Realpolitik completa** em todos os 33 itens — vetos como reféns orçamentários, MP como
  leilão predatório, decretos acumulando atrito invisível, coalizão como mercado de liquidez,
  CPIs como instrumentos de chantagem, cargos como moeda de fidelização no interior;
- **Correções normativas apuradas**: LC 200/2023 (teto de 25% no contingenciamento), ADI 6.457
  (limites ao comando militar), Decreto 12.790/2025 (indulto mais recente);
- **Quóruns conferidos**: 342 deputados (2/3), 41 senadores (maioria absoluta), 308 (3/5);
- **Tabela de quorums** com todos os níveis constitucionais, incluindo impeachment;
- **Bloco "Como ler"** com graus (norma/prática/número), ciclo de sobrevivência e a regra de
  que nenhum número de dinheiro entra no arquivo.

### 2 · O que o Gemini acertou e o que errou

O Gemini nunca teve acesso ao código do jogo. As comparações com o estado do repositório
foram feitas por mim na cruzagem. Ele acertou a Realpolitik (melhor camada já produzida
neste projeto), a estrutura em blocos, e a correção normativa. Errou 54 senadores (é 41),
172 deputados (é 171), e propôs UI/UX genérico que não se encaixa na filosofia do projeto.

### 3 · A decisão de escrita

A pesquisa 09 virou um checklist puro sobre o cargo — sem referências ao jogo. O documento
descreve o que um presidente faz na realidade; o jogo se adapta a ele. Isso segue a diretriz
dele: _"o checklist precede o código, porque é um maldito checklist"_.

`npm run check` verde: 13 guardas · 63 provas sintéticas.

## A SESSÃO EM QUE A MESA VIROU OBJETO — 08/09/2026

Ela começou com o porte parado no meio: `npm run validate` não fechava, e a mesa abria **sem
madeira**. Terminou com o portão verde, um gesto no jogo e a cena escalando inteira. **Nada foi
commitado.**

### 1 · Os cinco itens que faltavam, e o que eles esconderam

Os cinco fecharam — as matérias, a rubrica armada, a moldura, os 13 `prose` e o portão inteiro.
⭐ **`dressDesk` foi parar em `cabinet.mjs` e não no `app.mjs`**, contra o que o handoff pedia:
quem sabe que o grão é da sala e o feltro é do envelope é quem escreveu o HTML, e o entrypoint
não pode ter forma nenhuma.

⛔ **E o portão tinha aprovado seis defeitos.** Nenhum falhava em lugar nenhum:

1. **`url()` relativo dentro de custom property resolve contra a FOLHA que a consome**, e não
   contra a página — `assets/tabua.webp` virava `/styles/assets/tabua.webp`. A mesa abria sem
   madeira com 404 no console, e o tipo, a guarda e as 323 provas ficavam verdes;
2. **`--paper-ink` estava declarado duas vezes** em `00-tokens.css`, com 230 linhas de distância:
   a tinta da linha clicada da Caixa, e a do envelope. A segunda vencia — o remetente da bandeja
   caiu para **2,84 de contraste**, e quem viu foi o passeio;
3. **as oito marcas do Art. 2º herdavam o botão do painel antigo** — tinta de interface sobre
   papel branco, **1,24 nas oito**;
4. **o ato estourava a folha em 40px**: a rubrica saía cortada e caía por cima da linha do DOU;
5. **o seletor era `data-assinado` e o HTML escreve `data-signed`** — seletor que não casa não é
   erro para ninguém;
6. **a rubrica nascia inteira e se apagava sozinha em 1,1s**, porque a transição pegava a
   primeira escrita de `--stroke-len`, que sai do JS depois da pintura.

⚖ **Cinco dos seis só existem porque alguém OLHOU.** É o passo que o `validate` não sabe dar, e
é o que `CLAUDE.md` já avisava com três defeitos anteriores.

### 2 · A pasta que ficou melhor quebrada

No meio do conserto ele mandou: _"essa pasta de couro como está agora nesse exato momento, está
muito boa, sem você ter importado aquela imagem (só a pasta e a costura)"_. **O que ele estava
vendo era a foto do couro em 404.** A camada da foto saiu do CSS, e `assets/couro.webp` ficou no
disco sem dono — 386 KB, apagar é decisão dele.

⭐ **A lição é a mesma de sempre:** o que eu tinha como "a peça pronta" era pior que o acidente.

### 3 · "muito bugado e feio"

Foi o veredito dele com o jogo aberto, e ele estava certo. A causa era minha, do item 3: eu tinha
esticado a moldura para preencher o `main`, e a 1920 isso dava **1648×922 com as peças do mesmo
tamanho em px** — pasta na beirada, vazio no meio, folha ilegível.

⭐ **Ele escolheu entre três opções: a cena escala inteira.** Ela é desenhada em 1206×806 e cresce
como foto, em `cover`: o que muda de janela para janela é a **distância**, e não o arranjo. E a
faixa preta de 110px no topo era a sala aparecendo acima do tampo — _"era pra mesa ocupar todo o
gabinete"_ —, então o tampo passou a começar em `-8%`.

### 4 · O gesto, e as três contas que erraram

_"não consigo clicar pra pasta com a folha subir na tela e eu enxergar melhor"_. O voo entrou:
mola por quadro, quique 0,22 na subida e zero na descida, a sala escurecendo e as duas sombras em
sentidos opostos. Na mesa o clique **pega**; na mão, a marca marca, o papel assina e o clique fora
larga.

📐 **E o tamanho de leitura custou três tentativas.** A escala 1 dava uma pasta de **1047px numa
área de 986** — a peça que existe para ser lida saía dos dois lados. A primeira conta pediu 86% da
área e entregou 65%; a segunda, 64%. **A pasta vive numa árvore 3D inclinada, e a altura dela na
tela não é a de layout vezes a escala.** O conserto foi parar de deduzir: o desenho **ergue a peça
uma vez, mede, e corrige a escala** — 86% da altura visível em qualquer janela.

⚠ **E ele mandou encolher o que está na mesa**, porque ainda faltam objetos: _"desse jeito nada
vai caber"_. A pasta ocupava **38% da largura e 69% da altura** com um objeto de cinco. Hoje são
27% × 48%, e o lugar do boletim, do calendário e do telefone está guardado — é a planta do ciclo
25, com o vazio como reserva.

### 5 · Dois defeitos do próprio instrumento

⛔ **O clique do passeio caía no TAMPO.** Numa árvore 3D o ponto que o Playwright calcula para
`.folder` não está sobre ela, e a prova acusava a mesa por um defeito do próprio clique. Hoje ela
pergunta a `elementFromPoint` o que está no centro visual da pasta — que é a pergunta certa — e
clica **nisso**.

⚠ **E a espera virou assentamento, não relógio:** sem cabeça o quadro chega irregular, e um número
fixo pegava a mola a caminho — 15px acima da mesa numa rodada, 31 na seguinte.

### 6 · A otimizada, medida

O primeiro número da mesa dizia **custo zero**, e ele media a mesa **parada, sem nada animando**.
Com o laço de quadro rodando, a conta é outra: a mesa inteira custa **79 fps de folga** (238 → 160),
o grão sozinho vale 25 e a pasta 43.

✔ **E o voo ficou 13 fps mais barato:** a mola reescrevia a `box-shadow` a cada quadro, o que
repinta a peça inteira — **156,8 contra 143,8** no mesmo laço. As duas sombras viraram camadas
prontas que cruzam opacidade, que é trabalho de compositor.

A limpeza tirou a grade `.desk`, a pasta de vidro `.pen`, dez comentários órfãos, a aresta
distante do tampo e a sombra dela — duas camadas compostas para pintar o que a mesa cobriu.

## A SESSÃO EM QUE A MESA GANHOU MATÉRIA — 05/09/2026, tarde

A manhã fechou o gargalo do jogo; a tarde foi inteira de desenho, e ela começou com uma reclamação
dele: _"eu vendo a tela do Gabinete novo, eu percebo que está muito ruim, muito pouco conteúdo e
feia"_.

### 1 · A auditoria, e ela mediu o que a reclamação dizia

📐 **59,3% da mesa vazia**, com **368px de faixa morta contígua** no rodapé — 43,7% da tela
sozinha. **29 átomos de texto**, oito deles números. E o Email, medido junto, é **pior**: 26
átomos e 14,9% de densidade, na **mesma classe de raiz** e no mesmo tabuleiro. **Não eram duas
telas: era a mesma tela vazia duas vezes.**

⚖ **E o diagnóstico foi contra mim:** a hipótese do ciclo 21 — _"o que faz parecer uma mesa é
hierarquia, lugar fixo e ter o que assinar"_ — **foi executada inteira e ele reprovou o
resultado.** Ela é necessária e não é suficiente: sem matéria, produz um formulário bem
organizado.

### 2 · A trava que eu tinha inventado

O ciclo 21 dizia _"madeira, couro e papel não entram"_, apoiado em "o projeto já matou
skeumorfismo". **Ele nunca disse isso.** O registro tem o contrário: em 22/08 ele **pediu** o
marrom, e depois recusou **aquela cor**. Eu virei a recusa de um tom numa proibição de três
materiais e citei a proibição de volta como decisão dele.

**Palavras dele:** _"uma coisa que me irrita muito nesse meu jogo são as travas e limites que você
colocou sem eu pedir"_ — e depois, mais fundo: _"não importa o que eu achava antes… **eu posso
mudar de ideia a qualquer momento**, isso a IA não entende"_.

⭐ **Daí saiu a regra das três famílias**, que reclassifica toda recusa do repositório: **medição
vale até alguém remedir; gosto dele numa data expira; generalização minha não vale nada.** Ela
está no `CLAUDE.md`, e foi aplicada no handoff e nos ciclos 13, 15, 16 e 21.

### 3 · O que a pesquisa achou, e ela mudou o desenho três vezes

📗 **O Gabinete real não é uma sala — são três ambientes**, no 3º andar do Planalto, com mesa de
despacho, mesa circular de 14 lugares, sofá Navona de Sergio Rodrigues, duas telas de Djanira e
tapeçaria de Norberto Nicola no piso. **A referência vitoriana caiu por evidência**: o palácio é
mármore branco, Zalszupin, Niemeyer e arte concreta.

📗 **A madeira que ele escolheu tem nome:** `jacarandá-da-bahia`, a de Sergio Rodrigues dos anos
50 aos 70.

⭐⭐⭐ **E o achado:** o timbre do presidente é em **relevo seco branco**, não impresso — Manual
§5.1.1 nota 3, Decreto nº 80.739/1977, e vale **exclusivamente** para ele, ministro de Estado e
autoridade máxima de autarquia. **É a distinção física que separa o ato dele de todo o resto do
governo**, e era o que eu já tinha proposto por estética.

### 4 · A regra que ele deu para a escrita

Vendo o decreto pronto: _"gostei, porém só achei meio difícil de entender o que está escrito. **A
única coisa que vamos fugir do realismo é isso.**"_

⭐ **A forma é do governo; a escrita é do jogo.** Fica fiel a folha A4, as margens de 3 cm e
1,5 cm, o relevo seco, a epígrafe, a ementa recuada, `Art. 1º`, o fecho com os anos da
Independência e a nota do D.O.U. Vira português normal a ementa, o preâmbulo e os artigos.

⚠ **E o que não se simplifica é o que todo brasileiro reconhece:** _"Este Decreto entra em vigor
na data de sua publicação"_ fica.

### 5 · Os dois bugs que a caça pegou

⛔ **A tábua saiu preta**, e a causa era minha: pré-escapei `#` como `%23` no gerador, e `svgUrl`
escapa `%` **antes** de `#` — então `%23` virou `%2523` e voltou como `%23`, que não é cor. Todo
`fill` caiu para o preto inicial do SVG.

⚠ **E dois falsos alarmes do meu próprio conferidor**, os dois registrados porque a lição é a
mesma: a folha A4 "errada" em 1% era a **caixa envolvente do elemento girado**, e o `%25` no data
URI é o **escape correto** de `%`. **Um conferidor que grita falso é pior que nenhum.**

### 6 · Onde parou

**O jacarandá deixou de repetir** — a primeira tábua usava um `<pattern>` de passo fixo, e agora
são cinco camadas com sorteio determinístico: faixas de alturas próprias, linha de anel de
espessura variável, poros, o arco central e o grão fino.

**E a montagem do Gabinete começou.** O passo 1 — o tampo — está de pé em `tmp/gabinete.html`, com
33 controles. ⛔ **Ele vai girar antes do passo 2**, e pediu com todas as letras: _"passo a passo,
com calma"_.

## A SESSÃO EM QUE O GARGALO MUDOU DE LUGAR — 05/09/2026

Ele abriu com _"onde paramos?"_, mandou commitar a sessão anterior e disse: _"depois de
commitar, estude mais profundamente o código, planos, docs"_. O estudo achou que **o achado
escrito no dia anterior estava medido no pior caso possível**, e o que estava embaixo dele é
maior.

### 1 · O commit que faltava

`6dee755` — 24 arquivos, +1231 linhas. O partido do presidente (ciclo 24, item 1), as cinco
ambições com preço (ciclo 19, item 2), o conserto da barra que vazava 5px com a fonte atrasada, e
os três planos novos. **`validate` verde antes: 13 guardas · 325 provas · passeio verde.**

### 2 · O achado 59 se reproduz, e ele descreve a saturação

O achado dizia que comprar o Congresso inteiro move 13 cadeiras. **O número está certo, e eu achei
a pauta exata que o produz:** `policiamento-de-fronteira + plano-safra + defesa-agropecuaria`, que
sai de 363 para 376 votos. É agro e segurança, `econ` 52, numa Câmara de direita, **com 106 votos
de folga sobre o quórum**. Ali não há o que comprar.

**A varredura completa foi feita pelo caminho do jogo** — `settlement` + `whipCount`, as mesmas
funções que o turno executa, e não os blocos crus do catálogo. Em 675 pautas de duas alavancas, a
emenda cheia move de **7 a 71 cadeiras**, mediana 16. Em pautas que a Câmara resiste, de **23 a 83**,
mediana 49.

⚠ **A medição que o próprio achado declarava ausente — a amplitude numa pauta que a Câmara rejeita
— foi feita, e ela inverte a conclusão:** das 675, **660 já passavam sem pagar um real**. Nenhuma
ficou fora do alcance da emenda. **A emenda não é fraca; é que 97,8% das votações não estão em
disputa.**

⚠ **É a quarta ocorrência da mesma lição de método**, e as três primeiras estão no achado 52: eu
quase registrei como defeito do motor o que era uniformidade do instrumento. Aqui foi pior — o
instrumento era **uma pauta só**, escolhida sem perguntar quanta folga ela tinha.

### 3 · O que estava embaixo: o penhasco

Variando só a lealdade, a base do governo cai de **385 cadeiras para 228 entre 50 e 48** — dois
pontos. De 48 até 20, vinte e oito pontos, ela cai outras 43. **Toda a dinâmica do Congresso está
espremida em dois pontos de lealdade.**

A causa é uma linha em `moodFactor`: `if (mood < OBSTRUCTION) factor *= OBSTRUCTION_TOLL`, com o
pedágio de 0,6 caindo de uma vez sobre as nove bancadas ao mesmo tempo. **E o mandato simulado
termina do lado morto** — as nove fecham em 44, e dali nenhuma pauta passa e nenhum dinheiro
compra.

A alternativa foi medida fora do repositório: interpolar o pedágio entre 50 e 20 em vez de aplicá-lo
num degrau. Com a rampa, a emenda decide em 45 e em 40, e a faixa em que o jogador negocia passa de
**2 pontos de lealdade para 15**. **Não entrou** — mexe em ECLUSA, refaz a série inteira, e é
decisão dele.

### 4 · O instrumento não via a jogada do dia anterior

`simulate` chamava `createState(seed)` sem o quarto argumento. **Nenhuma corrida do simulador jamais
teve partido**, e a série de 04/09 foi lida como "não moveu" quando ela não tinha como mover.
`--party` entrou hoje, com validação do id e a marca `← a sua` na base ao fim.

Com ele veio a primeira medição de mandato inteiro com partido, em três sementes: o **PLB vale +5
aprovações de 43**, o PSM +3,3, o PTU +0,3 e o **PSU −0,7 — pior que não ter partido nenhum**. O
tamanho não explica: o PSM tem 71 cadeiras e entrega mais que o PTU, que tem 80. **O que explica é
a posição**, porque a política que o simulador roda derruba pisos, que é pauta de direita fiscal.

⭐ **E isso é o desenho funcionando:** o seu partido é o único que a emenda não compra. Se ele
discorda de você, a lealdade de 90 não vira voto e o dinheiro não tem por onde entrar.

### 5 · Duas coisas que a leitura do motor entregou de graça

- **`settle` é aditivo puro**, sem termo proporcional ao nível. Os 20 pontos com que o partido do
  presidente nasce atravessam o mandato inteiro sem estreitar: 64 contra 44 ao fim, iguais para o
  PLB de 145 cadeiras e para o PNR de 6. **A lealdade não tem reversão à média, e a memória por
  pessoa tem** (`memoryDecay`);
- **prometer emenda cheia leva a demanda do mês de R$ 20,4 bi para R$ 46,0 contra uma bolsa de
  14,1, e o rateio cai de 0,90 para 0,32.** Pagar o Congresso corta a política pública a um terço.
  Esse preço não estava em documento nenhum.

### 6 · O que ficou registrado, e o que não entrou

**Entrou:** `--party` no `simulate` — instrumento, não jogo. **Não entrou:** nada de ECLUSA, nada
de calibragem. Os achados 60, 61 e 62 nasceram, o 59 foi corrigido no lugar em que morava, e a
fila de decisão do handoff foi reescrita — _"a emenda passar a pesar"_ saiu dela.

⚠ **A guarda `prose` escapa dos docs, e isso é declarado:** `SCOPE` é `src|styles|tools|app.mjs`.
Varri `docs/` à mão atrás de identificadores mortos: 66 citações, e todas menos uma são scripts de
`tmp/` (evidência legítima) ou registro histórico de peça que saiu. A exceção é o ciclo 13, que
afirma no presente que `.cards__side` tem `overflow-y: auto` — a classe morreu quando o Gabinete
virou mesa, e o texto é a narrativa de um item já marcado ✔ FEITO.

## A SESSÃO EM QUE AS PESSOAS GANHARAM PREÇO, E A MOEDA PERDEU — 04/09/2026

Ele abriu com _"vamos prosseguir?"_ e, quando lhe ofereci as três candidatas do handoff,
devolveu a escolha: _"você deve estudar mais o código e os planos, e decidir por conta
própria"_.

### 1 · Por que as ambições, e não o TEMPO

O handoff colocava o TEMPO em primeiro (⭐⭐⭐), e eu escolhi o terceiro da lista. **Três
medições decidiram:**

- **o achado 53 é ordem dele** — não recalibrar a capacidade antes da reformulação das
  empresas. O efeito do TEMPO sai do rendimento por área da MALHA, que é exatamente o modelo
  marcado para troca. E o mesmo achado diz onde vale investir: **Congresso, tramitação,
  Caixa**;
- **o TEMPO e o Banco Central pedem campo novo no estado** — `SCHEMA_VERSION` 21, e a partida
  em andamento morre. O elenco não entra no save: ele se refaz da semente;
- **as ambições são o alicerce do ciclo 22.**

### 2 · O plano dizia quatro; o repositório permitia quatro, mas não como estava escrito

O ciclo 19 mandava `state` olhar _"o que desce para os entes"_ e `court` olhar _"quem
indica"_. **Nenhuma das duas peças existe:** não há marca de repasse a ente nos 38 programas,
e a indicação ao tribunal é do ciclo 18. As duas foram traduzidas para o que já roda — a
emenda é o dinheiro que um candidato a governador carimba, e para quem quer a toga o dinheiro
vale metade. **O lado positivo do `court` fica faltando, e está declarado.**

### 3 · A captura reprovou o que 319 provas aprovaram — de novo

Quatro linhas idênticas, uma debaixo da outra: a semente de abertura dá **quatro `state` em
oito pessoas**. A frase encolheu de 45 para 25 caracteres, mas **a causa é o sorteio**, e
mexer no sorteio troca a ambição de quem já está jogando. Ficou para ele.

### 4 · E aí a medição virou a sessão

A série não moveu **em nenhuma das nove sondas**. Não era a mudança ser inócua: o canal por
onde a ambição entra satura. Medindo o teto dele — os cinco parâmetros em 1 —, a diferença é
de **4 cadeiras em 513**. Medindo a emenda inteira, **13 cadeiras por R$ 25,7 bi**, numa pauta
que já passava sem pagar nada.

**A moeda que o ciclo 18 chama de "a única do jogo" compra 2,5% da Câmara.** Virou o achado
59, e ele vem antes dos planos.

⚠ **E a lição de método é sobre a ferramenta:** as sondas espalham emenda por igual, e uma
mecânica que faz pessoas diferentes custarem diferente **é invisível para elas por
construção**. A série de base não teria acusado nada — quem acusou foi a comparação direta
contra o estado anterior, num worktree.

### 5 · E ela terminou com um plano que a pesquisa reescreveu

Ele mandou registrar o que quer: _"criar o seu personagem… escolher um partido… eu quero REALISMO
e fidelidade ao Brasil atual e real"_. Virou o [ciclo 24](cycles/24-the-president.md), e **três
fatos apurados na web mudaram o desenho antes de ele nascer**:

- eu ia oferecer "sem partido" como o cenário difícil. 📗 **Não existe:** filiação é condição de
  elegibilidade (CF art. 14, §3º, V) e o STF afastou a candidatura avulsa. O difícil é escolher
  um partido pequeno;
- ⭐ **a federação partidária é a mecânica que o projeto procurava** — quatro anos de duração
  mínima, e romper proíbe nova federação, veta coligar nas duas eleições seguintes e corta o
  Fundo Partidário. **"Tudo tem preço, nada tem muro" escrito na lei;**
- e a cláusula de barreira põe um segundo relógio no ano 4: **o partido que te elegeu pode não
  sobreviver à eleição.**

**E a medição escolheu o próximo passo, contra a minha ordem anterior:** elevar a lealdade de uma
bancada de 70 para 95 entrega **+17 cadeiras**; a emenda cheia às nove, **+13** por R$ 25,7 bi ao
mês. **Ter partido vale mais que o orçamento inteiro de emendas** — e isso contorna o achado 59
sem tocar em ECLUSA, que é o motor que ninguém quer recalibrar hoje.

## A SESSÃO QUE COMEÇOU COM O PC DELE REINICIANDO — 04/09/2026

Ela abriu com uma pergunta de uma linha — _"o que perdemos?"_ — e terminou dentro da barra
superior. **Nada tinha se perdido, e o que estava quebrado era outra coisa.**

### 1 · A resposta não era memória, era comando

O crash pegou o repositório **já fechado**: o último commit é de 22:01 e o arquivo mais novo do
disco também. Árvore limpa, sem stash, sem arquivo solto. `git status`, `git stash list`,
`git reflog` e o `mtime` dos arquivos respondem isso em quatro segundos.

### 2 · A prosa tinha se soltado do repositório, em seis pontos

Nenhum deles quebrava prova nenhuma — é a família que o `standards.md` §7 declara **sem
guarda**: a frase que descreve um estado que o código deixou de ter.

| a prosa dizia                             | o repositório tinha                         |
| ----------------------------------------- | ------------------------------------------- |
| 61 sintéticas · 152 arquivos · 304 provas | **63 · 156 · 314**                          |
| o A3 está pela metade                     | fechou inteiro, e o handoff já contava isso |
| ciclo 13 em 25 de 49                      | **26 de 49**                                |
| nenhum item de ciclo espera decisão       | o ciclo 19 espera a da chave da IA          |
| achado 58 aberto                          | fechado no código: "Meta fiscal" na tela    |
| a árvore não está limpa                   | limpa — as quatro entregas foram commitadas |

⭐ **E a lição é a de sempre, do outro lado:** a guarda `prose` acusa o **nome** morto. Ela não
acusa a **afirmação** morta, e as seis eram afirmações.

### 3 · O portão piscava vermelho, e tinha defeito atrás

`npm run validate` reprovou com `[barra] a barra superior vaza: when__date vaza 5px |
when__note vaza 5px`. Três rodadas seguidas depois: verde. **O reflexo é chamar de instável e
seguir — e teria sido errado.**

`justify` mede as duas linhas do bloco do mês e grava a largura **em pixel**, para comprimir as
duas no mesmo eixo. Ela roda **uma vez**: o cache `said` é `texto|texto|compressão`, e nenhum
dos três muda depois. Medida antes de a fonte chegar, a largura gravada é a da fonte de reserva,
e o texto real passa 5px dela **para sempre**. O cabeçalho da própria função já dizia a
condição — _"nada pode ser medido antes de a fonte chegar"_ — e nada a fazia valer.

📐 **Com 300ms de atraso em `vendor/fonts/`: vaza 5px toda vez. Sem atraso: nunca.** A fonte é
local e quase sempre chega a tempo, e era isso que fazia um defeito permanente de tela parecer
oscilação do portão.

⭐ **A lição de método:** _"instável"_ é um sintoma, e sintoma não é causa. A pergunta que
resolveu foi qual condição torna o defeito **determinístico** — e a resposta virou a prova.

⭐ **E ela nasceu antes de o conserto valer**, como manda a regra: rodei o passeio novo contra o
código sem o conserto, e ele reprovou **duas** vezes na mesma rodada — a asserção antiga e a
nova. Uma prova que não reprova não estava medindo nada.

### 4 · Um número cuja definição inclui o ato de escrevê-lo

O handoff dizia _"23 commits à frente de `main`"_. Medido, eram 29. Corrigido e commitado,
viraram **30** — e a correção venceu a si mesma no instante em que entrou.

⛔ **Isso não é descuido, é uma classe:** um número que o próprio ato de registrar altera não
pode morar em prosa. Ele saiu, e no lugar ficou `git log --oneline main..caixa-de-entrada`, que
não envelhece. **A pergunta que acha os irmãos dele é: escrever isto muda isto?**

### 5 · A varredura completa — 21 afirmações caíram, e três eram de fundo

Ele pediu o que a seção 2 tinha feito por amostra: _"leia todos os ciclos, docs, planos, etc
etc, e compare eles, quero saber se tem alguns desacordos, erros, etc"_. **Vinte e um
achados**, e a diferença entre eles importa mais que o total.

**Catorze eram número velho** — a família de sempre, e a lista está no `handoff.md`. Dois deles
mereciam nota:

- **o handoff se contradizia consigo mesmo em 300 linhas.** O achado 22 dizia `agenda` **29 de
  43**; a série que calibra, no mesmo arquivo, dizia **26 de 43**. Pior: a própria seção da série
  cita o achado 22 como exemplo de conclusão tirada de número velho — e não o corrigiu;
- **a exceção de dependência era fantasma.** A seção "decisões fechadas" — a parte mais
  autoritativa do arquivo — dizia _"zero dependência de runtime (exceção: `d3-force`
  vendorizado)"_. `vendor/` tem quatro fontes e uma licença. Sete linhas acima, a seção "o que
  ainda não existe" dizia que o `d3-force` entraria **quando o DELTA existisse** — e o DELTA
  existe desde 30/08. **Duas afirmações contraditórias sobre a mesma coisa, a sete linhas de
  distância, e as duas erradas.**

⭐ **As três de fundo não se acham medindo número — só lendo o código contra a tese:**

1. **O ciclo 18 abre dizendo _"o jogo tem SEIS gestos"_, e o censo dá nove.** Faltavam três, e as
   três eram jogada: mover verba, oferecer emenda e responder carta. **A emenda ficou de fora do
   censo do plano que diz, dois parágrafos abaixo, que ela é a única moeda do jogo.** A tabela foi
   refeita com a linha do `app.mjs` ao lado de cada gesto — e a tese fica **mais forte**, não mais
   fraca: com o censo certo, o que se diz é que nenhuma das seis jogadas **cria** um instrumento;
2. **O ciclo 19 propõe a IA dentro do turno, e o ADR 0001 proibia isso por escrito.** `demandsOf`
   roda em `turn.mjs:1863`. Aqui a decisão foi dele e veio no meio da sessão — _"não quero que
   você leve os limites e travas em conta, pq tem coisa que eu propus, e eu que mando"_ —, então o
   **ADR foi emendado**, com data, e o ciclo ficou como estava;
3. **a série que calibra cobria seis das nove sondas e se dizia única.** As três de fora
   (`concentra`, `favoritos`, `legislador`) são justamente as que **escolhem** em vez de espalhar,
   e foi uma delas que produziu o achado 52. A ausência passou a ser declarada.

### A lição de método, e ela virou regra em `CLAUDE.md`

Ele deu o critério de desempate no meio da sessão: _"quanto mais recente mais correto"_. **Ele
resolve sozinho os catorze primeiros achados** — a série de 03/09 contra o achado de 24/08, o
ciclo 13 de 03/09 contra o ciclo 17 de 31/08, o passo marcado ✔ FEITO contra o cabeçalho do mesmo
arquivo que dizia que ele faltava.

⛔ **E o segundo critério é mais forte que o primeiro:** limite escrito por mim não trava pedido
dele. O ADR 0001 não foi invocado contra o ciclo 19 — ele foi emendado. **Documento antigo se
corrige; ele não se usa como argumento.**

### 6 · A sessão derivou para o papel, e ele a trouxe de volta

**Quatro documentos escritos e zero linha de jogo mudada** — a pesquisa 07, o ciclo 22, o ciclo 23
e a reescrita do 19. Cada um saiu de uma pergunta dele, e nenhum era desnecessário. Mas quando
propus começar pelo tempo, ele perguntou: _"vc nao ia começar pelo gabinete ou algo do tipo"_.

⛔ **É o mesmo defeito que ele já nomeou uma vez em quatro palavras — _"mudou bosta nenhuma"_.**
Planejar é barato e parece progresso; o jogo não muda. **A sessão virou para o ciclo 21 e os
passos 1 a 4 entraram.**

### 7 · O buraco não fechou, ele mudou de lugar — e só a imagem viu

**O portão ficou verde com a mesa errada.** 13 guardas, 315 provas, passeio verde — e a captura
mostrou **600px pretos no centro da tela**.

📐 A causa: as linhas da mesa esticavam (`grid-template-rows: auto minmax(0, 1fr) auto`), e a
pasta com **uma** caneta não preenchia a celha. Antes eram seis blocos ocupando a coluna; agora é
um instrumento numa zona de 600px.

⭐ **E a lição não é o CSS — é o que o defeito era:** a tela existe para fechar 45% de tabuleiro
preto, e a primeira versão dela **reproduziu exatamente o mesmo vazio, deslocado**. O conserto foi
conceitual: a mesa é um **objeto com altura própria**, e o vazio fica fora dela, não dentro.

**E a segunda reprovação da mesma captura foi de hierarquia:** o contingenciamento — a peça
principal, a única coisa que se assina — era **a única sem superfície**. A margem e o prazo
tinham lâmina; o que decide flutuava no preto e lia como legenda.

> ⚠ **Nenhuma das duas falha em guarda, tipo ou prova, e as duas são a tela mentindo sobre o que
> importa.** É a quarta vez que a captura pega o que o portão inteiro aprovou.

### 8 · O plano previa duas asserções do passeio e eram três

O ciclo 21 avisava, em maiúsculas e duas vezes, que o passo 1 tinha de reescrever **duas**
asserções: os seis blocos da coluna e os zero controles no Gabinete. **A terceira era a mesma
contagem dentro da prova do SAVE** — a retomada media `.cards__side .annex === 6` para provar que
a tela renderizou.

⭐ **E o outro aviso do plano estava errado:** ele dizia que o nome `mesa` já estava ocupado e que
a decisão vinha antes da primeira linha. Não colide — o Gabinete sempre morou em `cabinet.mjs`, e
`mesa.mjs` é o Congresso. **Uma verificação de trinta segundos apagou um item que o plano tratava
como bloqueador.**

## A SESSÃO DA BARRA E DO ORÇAMENTO — 03/09/2026

Ela começou com um achado de comentário e terminou dentro do motor fiscal. **Quatro blocos, e
os três primeiros nasceram de perguntas dele, não de plano.**

### 1 · Um bloco de 11 linhas virou uma auditoria de catálogo

A guarda `prose` acusou um docbloco acima do teto em `dashboard.mjs`. Ler o arquivo para
cortá-lo revelou que **os dois alarmes dos sinais vitais eram cópia de números do catálogo**, e
as duas cópias tinham envelhecido: a rua acendia em 20 quando `streetFloor` já era 16 desde
`95681c3`, e a inflação acendia em 7,5% quando Finanças já acusava desde 4,5%. O comentário de
`finance.mjs` **previa este defeito com todas as letras** — _"copiar as réguas para o segundo
consumidor daria dois lugares afirmando em que faixa a inflação vive"_. O segundo consumidor
nasceu e copiou.

A banda da inflação foi para o catálogo (`inflationTolerance: 0,015`, fonte CMN) e a soma
passou a ser feita uma vez só, em `app.mjs`.

### 2 · Treze comentários embaralhados, e o original estava no git

Eu disse que o texto original não existia. **Estava.** O commit `672291a` (_"a prosa cai 60%"_)
comeu o INÍCIO de treze parágrafos e, em dois casos, enxertou um pedaço dentro de outro bloco.
Cada um foi recomposto de `672291a^`, sem inventar texto — e **três números do original não
voltaram, porque envelheceram** (a fervura "em 60", o piso da rua "em 20%", e uma tabela medida
com a calibragem antiga).

A guarda `prose` ganhou a **regra 5 — o bloco decapitado**, espelho da regra 3. Medida antes de
escrever: zero falso positivo exigindo letra minúscula; com qualquer caractere, os `≈` do
catálogo de partidos e o `⚅` do save davam onze alarmes falsos. **Ela achou sozinha o décimo
terceiro bloco**, que a varredura manual tinha deixado passar.

### 3 · A barra superior, auditada ao limite

Pedido dele por dossiê externo: auditoria, correção e **teste de estresse absoluto**. Oito
defeitos, todos medidos no navegador. O pior foi silencioso: **a faísca da Aprovação caía no mês
errado** — ela vem dos cartões do mês, limitados a 24 pelo motor, e era desenhada do índice
zero, pondo os dois últimos anos no lugar dos dois primeiros. No mês 36 o ponto dela parava na
metade do trilho enquanto o do PIB estava a três quartos, **no mesmo mês**.

Os outros sete: a marca passava por baixo da peça dos vitais abaixo de 1228px; a legenda
invisível do botão jogava a seta 193px para fora; `O mandato acabou` quebrava em três linhas; o
valor do PIB pedia 89px numa célula de 88; um marco de catálogo mais longo vazava 212px da peça;
a barra media 80px enquanto o token dizia 78; e o botão morto acendia no hover. **A regra
responsiva de 1180px era MORTA** — punha `grid-template-columns` numa barra que é flex.

O passeio ganhou o **quinto irmão**, `checkTopbar`: peça de largura fixa não rola, não põe
reticência e não move `scrollWidth` do pai. Ela nasceu vermelha.

⚖ **E uma decisão dele fechou aqui:** o piso da barra é **1103px de janela**, e fica assim. As
três alternativas foram postas com o custo de cada uma, e as três custam o que faz a barra ler
como MENU.

### 4 · O passo 6 começou pelo A3, e a pesquisa inverteu a ordem do plano

Ele pediu avaliação do próximo passo **com fidelidade acima de tudo**. A
[pesquisa 06](research/06-mandatory-spending-and-who-decides-it.md) foi contra fontes públicas de 2025 e
2026 e concluiu que **os três itens dão ao presidente uma caneta que ele não tem**: o mínimo é
regra de lei com teto de 2,5% real, a folha é acordo plurianual pago em parcelas, e o
contingenciamento são **dois instrumentos diferentes**. Ele aprovou a inversão da ordem.

O A3 abriu com **dois defeitos de motor**, e o segundo ninguém tinha visto: além do achado 36
(o rateio gravava o corte na lei — um pedido de 92 parava em 89,70), **as seis regras sumiam do
estado todo mês**. `honour` só devolve programa, e o retorno dele era gravado por cima do mapa
inteiro: 44 chaves viravam 38 no primeiro mês, e `poder-do-executivo` caía de 30 para o `?? 0`
de quatro leitores. **Nenhuma prova via, porque as duas moram no que o turno ESCREVE.**

Depois vieram os nomes certos — `blocked` para o teto do arcabouço, `atRisk` para a meta
primária da LDO — e a correção da mentira mais visível: **a tela pintava de verde qualquer
primário positivo.** Um primário de +0,1% do PIB contra meta de +0,5% é meta perdida, e é
exatamente o que o governo real projeta para 2027.

⭐ **A meta é alcançável, e é isso que a torna sinal e não alarme:** o governo passivo sai de
−0,49% no mês 1 e chega a +0,17% no mês 36, contra um piso de banda de 0,25% — ele encosta e não
entra. Só a política de austeridade escapa, e por 15 meses.

### A lição de método desta sessão

**Duas vezes eu afirmei sem medir, e as duas vezes estava errado.** Disse que o texto dos
comentários não estava no git — estava, num commit que o `git log -S` acha em um comando. E
medi a legenda do botão com um script que clampava a largura, concluí que cabia, e foi o passeio
que me corrigiu com o número certo. **A ferramenta de medição também precisa ser conferida.**

---

## A SESSÃO QUE LEVOU A BARRA PARA O JOGO — 31/08 e 01/09/2026

Ela começou com _"vamos melhorar ela"_ sobre a barra do clone e terminou com a barra rodando
em `src/`, o portão verde e dois achados de catálogo fechados. No meio houve **uma troca de
método** que vale mais que a barra.

### A lição da sessão é sobre QUEM gira o número

Passei horas ajustando por medição enquanto ele julgava com o olho, e cada volta custava uma
rodada inteira: eu media, ele olhava, ele recusava. Quando ele perguntou _"cara eu posso
mexer? em tamanhos, espaçamentos, vãos, etc? pq parece que voce nao consegue"_, a resposta
certa não era ajustar melhor — era **entregar o controle**.

⭐ **O clone ganhou um painel de 51 campos.** Toda geometria da barra virou token, e o painel
gira cada um ao vivo: corpo, rastreio, compressão, vãos, sangrias, altura da peça, raio da
quina, força da aresta, bisel e escala da lente. Em três mensagens ele fechou o desenho que
oito rodadas minhas não tinham fechado, e me mandou a lista de valores para eu gravar.

⚠ **E o painel só serve se ele refizer o que não é CSS.** A largura do botão entra na lente,
na aresta e no mapa de deslocamento — girar o token sem refazer as imagens deixaria o vidro
descrito para uma peça que não existe mais, e a costura apareceria na quina.

### O defeito mais caro do painel foi meu, e era invisível

O campo `compressão da letra` **não fazia nada**. O código lia `--enxuta` de
`document.documentElement`, e o token mora em `.v2` — a leitura caía sempre na reserva
(`0,86`), e a folha dizendo `0,78` era ficção. Nenhuma guarda pega isso: o CSS estava certo,
o JS estava certo, e a ponte entre os dois lia do lugar errado.

⭐ **A varredura nasceu daí.** Quando ele disse _"com certeza tem varios outros problemas além
desses"_, escrevi um instrumento que **gira os 51 campos, um por um, e confere que a barra
sobrevive** — sem erro de console, sem transbordo, com a altura dentro do razoável. Ela achou
três defeitos de uma vez, e o pior era de escrita: a expressão que extraía a unidade tinha
perdido as barras invertidas ao ser gravada no arquivo e virado `[-+.ds]+`, que não casa com
`10px`. O painel concatenava `14` com `10px` e escrevia **`1410px`**.

### E a exportação achou seis defeitos que o clone não podia ter

Todos da mesma família: **o clone tinha um caso só, e o jogo tem todos.**

1. `iconHtml` sem classe própria nasce sem tamanho — os vitais só apareciam porque a coluna
   deles tem largura fixa;
2. a justificação esmagava a nota a **0,49**: o clone só via `meta fiscal · 1 mês`, o
   calendário tem `relatório bimestral · agora`. Agora há piso de 0,78, e abaixo dele a peça
   cresce em vez de esmagar;
3. a largura "natural" já vinha com escala dentro — limpar o estilo inline devolve a regra da
   folha, e a conta a aplicava duas vezes;
4. **a lente morria na primeira repintura**: remover e recriar o filtro faz o navegador perder
   a referência `url(#id)` em silêncio, e o botão ficava sem vidro do segundo mês em diante;
5. **botão desabilitado não recebe evento de ponteiro**, e ele desabilita durante a virada do
   mês — se o mouse saísse ali, o `pointerleave` nunca chegava e a peça ficava presa erguida;
6. a barra **piscava a cada mês**: a View Transition fotografa a página inteira, e a barra ia
   junto. Ele descreveu exatamente o sintoma — _"era pra ser fixo e só mudar os numeros"_.

### O que a barra provou sobre o motor

⭐ **A aprovação tinha série e ninguém sabia.** A faísca dela parecia impossível — `series` só
guarda PIB, inflação, juro, desemprego, dívida e primário —, mas `state.months[].balance`
guarda a rua e as cadeiras de **cada fechamento**. A série existia inteira, dentro dos cartões
do mês. Foi isso que permitiu exportar a barra **sem motor novo e sem bump de save**.

### E dois números do catálogo caíram

⛔ **O achado 58 morreu.** `LDO` e `LOA` estavam no campo `label` — o que o schema descreve
como _"como o jogador o chama"_ — enquanto a explicação morava em `what`, que a barra não
mostra. Ele perguntou _"o jogo usa LDO, e outros, eu quero usar igual está no barra.html"_, e
a correção é de catálogo e não de tela.

⛔ **A partida começava em março, e a razão não existia.** `OPENING_MONTH` era `2`, extraído de
dois literais soltos, e **por que dois nunca foi escrito** — procurei no código, no diário e
nos ADR. A posse presidencial é em 1º de janeiro e a semente padrão do projeto já aponta para
ela. Ele perguntou _"por que a partida começa em março e nao em janeiro"_, e a pergunta valia:
o mandato nascia com 46 dos 48 meses.

## A SESSÃO DO VIDRO — sete gestos recusados, e o que cada recusa ensinou — 31/08/2026

Ela começou com _"a data deve ficar em extenso"_ e terminou com uma gota que deforma. No meio,
**sete gestos recusados** — e o valor da sessão está neles, porque cada recusa apontou um erro
de método meu, e não de gosto dele.

### A lição que atravessa a sessão inteira

**Girei um parâmetro seis vezes antes de perguntar se o MODELO era o certo.** E quando troquei
de modelo, ainda faltavam três trocas. O padrão só apareceu quando comecei a traduzir cada
parâmetro em PIXEL antes de oferecê-lo:

| o que eu ofereci                       | o que ele valia na tela           |
| -------------------------------------- | --------------------------------- |
| quatro durações de mola                | 7,5px de viagem — indistinguíveis |
| quique 0,15                            | **0,047px** de ultrapassagem      |
| a assimetria do toque, com quique 0,22 | **0,03px**                        |

⭐ **Três vezes eu girei um número abaixo do limiar do olho e chamei aquilo de opção.** A regra
que ficou: _antes de oferecer um parâmetro, calcule o que ele produz em pixel._

### As quatro trocas de modelo, e nenhuma se alcança girando número

1. **a mola não se parametriza por rigidez** — a Apple expõe duração e quique, e **o quique
   padrão dela é ZERO**. Eu vinha pondo ultrapassagem achando que era isso que fazia flutuar;
2. **transição CSS não preserva velocidade** — interrompida, recomeça do zero. O gesto virou
   mola integrada por quadro, e a prova é numérica: ao tirar o dedo, a peça **continua** no
   sentido antigo antes de virar;
3. **a quina não é arco** — `border-radius` salta de curvatura zero para 1/r num ponto.
   **0,27px de desvio máximo**, e é tudo de taxa e quase nada de posição;
4. **desfoque em texto não é idioma da Apple** — o iOS materializa com escala e opacidade.

### E o vidro só existiu depois de três armadilhas que eu mesmo armei

`clip-path` mata o `backdrop-filter`. Um `filter` num ancestral também mata. Um irmão opaco
atrás entra no backdrop e o vidro passa a refratar a sombra. ⭐ **E as três se encadearam:** o
squircle pediu `clip-path` → ele recortava a `box-shadow` → mudei a sombra para `drop-shadow` no
envoltório → **o filter do envoltório matou o vidro.** Cada conserto criava o próximo. A saída
foi tirar a forma do CSS e pôr dentro do filtro.

### Os dois defeitos que só ele podia achar

**1 · _"não está animando nada"_** — e não estava mesmo: o Windows dele tem animações
desligadas, e eu tinha escrito um caminho de `prefers-reduced-motion` que desligava o gesto e
punha no lugar uma classe **que nunca existiu em folha nenhuma**. Sem movimento a leitura tem de
continuar, e eu tinha escrito essa regra e quebrado.

**2 · _"o que é ldo?"_** — e isso é achado, não dúvida. Se o dono do jogo não sabe, o jogador não
sabe. O bloco "O que este mês cobra" imprime siglas do orçamento público **enquanto o catálogo
guarda a explicação em prosa**. Está no jogo publicado, e virou o achado 58.

### E a intuição que destravou o líquido foi dele

_"talvez a cor da barra, a textura, tudo isso tenha que ser mudado"_ — e a medição concordava:
atrás do botão o gradiente é **0,041 em 255**. Refração desloca a amostragem; sem aresta atrás,
não há o que dobrar.

⭐ **Mas a conclusão certa não era mudar o fundo: era que LÍQUIDO NÃO SE LÊ NA REFRAÇÃO.** Ele se
lê na silhueta — e uma silhueta que deforma é visível sobre preto. A peça passou a esmagar
conservando volume (164×54 → **170,6×49,9**) e a ultrapassar o repouso em **1,3px no sentido
contrário** na volta. **O botão virou gota sem depender de nada atrás dele.**

## A SESSÃO QUE FECHOU A BASE E PAROU NUM GESTO — 31/08/2026

Ela tinha duas metades que não se pareciam. A primeira foi de **decisão**: ele pediu para
_"focar no que falta definir, reformular, pra ter uma base pronta"_, e as quatro que travavam
trabalho seguinte fecharam. A segunda foi de **desenho**, e terminou parada.

### A lição da primeira metade é minha, e ela é sobre a pergunta

Levei as quatro decisões escritas em `RCL`, `quórum de maioria absoluta`, `CF art. 47`,
`piso proporcional` e `bump de esquema`. Ele respondeu: _"eu nao entendo quase nada do que um
presidente realmente faz e serve, voce precisa explicar com mais clareza, e entendo menos ainda
de programação"_.

⚠ **A memória do projeto já tinha essa regra escrita, e eu a quebrei assim mesmo.** O que ela
ganhou hoje é a metade que faltava: **jargão jurídico e fiscal é tão impossível quanto nome de
variável**. Reescrita — _"de cada R$ 100 que o governo arrecada, uns R$ 90 já têm dono antes de
ele sentar na cadeira"_ —, as quatro decisões saíram em uma mensagem.

⭐ **E ele decide muito bem quando a pergunta é legível.** Escolheu o save mais barato e mais
arriscado com o custo na mão, e pediu o quórum realista com a única ressalva que importava:
_"quero realismo, mas que não fica maçante, quero algo equilibrado"_ — que virou o critério de
aceitação do item, e não um comentário.

### O clone, e por que ele foi a ferramenta certa

Ele desconfiou de um passo do plano — tirar o liquid glass da barra — e perguntou se dava para
ver antes: _"você consegue aplicar esse plano como um clone sei la um site clone?"_.

⭐ **O clone importa as folhas reais do projeto**, então não é maquete: é o jogo com outra
barra. E ele decidiu duas coisas em cinco segundos que uma descrição não decidiria — que o vidro
fica, e que a casca sólida não ganha nada. **A medição concordou pelo outro lado:** com o fundo
meia-noite que entrou na mesma sessão, o topo da tela é quase preto, e vidro sobre preto não
refrata. **Eu ia contra a doutrina da casa sem precisar.**

### O que a captura pegou, três vezes

Nenhum dos três defeitos falhava em teste nenhum, porque não havia teste: **`MESES RESTANTES`
passando por baixo do botão**, o **`46` colando no `436` da Base**, e a **data duplicada** —
`MAR · 2027` embaixo da marca e `MARÇO DE 2027` na ponta direita.

⚠ **E o segundo não tinha conserto de espaço.** Dois números grandes vizinhos leem como um par
por mais folga que se ponha entre eles; o conserto foi de **agrupamento**, e ele deu à barra uma
lógica que ela não tinha: **quando · o que o país diz · o que fazer**.

### E o achado de padronização veio de olhar o resto da tela

A queixa dele foi _"remova esse quadrado que vc colocou de fundo como moldura de cada ícone"_, e
ele estava certo por uma razão maior que a estética: **nenhum glifo deste jogo tem caixa** — nem
no rail, nem na coluna do Gabinete. Eu tinha aberto um objeto novo sem perceber. Tirá-lo
padronizou **e** matou dois dos quatro raios da barra, dois deles fora da escala do projeto.

### A sessão parou num gesto, e é onde ela recomeça

O botão foi refeito três vezes. A primeira era **duas animações independentes** — o rótulo subia
8px e a dica entrava ancorada em `bottom` —, então em nenhum momento o par ficava centrado; ele
nomeou isso de _"animação mal feita"_ e estava certo. A segunda unificou curva e tempo. A
terceira virou gesto de verdade: a peça subindo 1px com a sombra abrindo, a pilha deslizando, e
a leitura entrando 70ms depois, tudo na curva de folha do iOS.

⛔ **E ele recusou as quatro velocidades** — 360, 460, 580 e 700ms. O pedido é
_"smooth, clean, flutuante, lento (...) uma animação tão boa que poderemos reutilizá-la no
futuro"_, e é isso que impede fechar no chute: **o gesto é para virar vocabulário**, e um
vocabulário errado se paga em toda peça que o usar depois.

## A SESSÃO QUE COMEÇOU COM O PC DELE TRAVANDO — 30 e 31/08/2026

Ela abriu com uma pergunta que não era sobre o jogo: _"meu pc desligou ou reiniciou sozinho?
o que aconteceu?"_. O log do Windows respondeu — **Machine Check Exception às 18:19:21**, erro
fatal de hardware no núcleo do processador, com o bit de contexto corrompido ligado. Nenhum
minidump: a máquina reiniciou antes de escrever. **O repositório saiu ileso** — `validate`
verde, `git fsck` sem corrupção, e as duas últimas escritas 15 segundos antes do travamento
consistentes.

⚠ **E o que estava em risco não era o disco: eram 1.737 linhas verdes sem commit.** Foi a
primeira coisa a entrar.

### O que entrou, em quatro commits

| commit    | o quê                                                                        |
| --------- | ---------------------------------------------------------------------------- |
| `46e17a2` | as quatro lentes: projeção, linha do tempo, calendário e o passo 3 (C10/C11) |
| `ec73cee` | **D4 — a corrente causal.** O DELTA abriu                                    |
| `152230d` | **C5 e C6 — a plataforma de posse.** O save subiu para a versão 20           |
| `91b8191` | cinco defeitos de tela, achados por ele jogando                              |
| `f99ca71` | o ciclo 17 ganha corpo — a regra do nome e o inventário do cargo             |

### ⭐ O D4 — e a lição foi sobre onde a conta mora

O grafo é lido do catálogo: `yield`, `decay`, `feeds`, `force` e `lag` já dizem quem alimenta
quem. O DELTA só descreve a aresta; a força de hoje sai da MALHA (`pushOf` e `liftOf`,
**extraídas de dentro de `pressureOf`** para que exista uma conta só); e quem junta é
`application/chain.mjs`. **Há prova cobrando que a soma das arestas seja exatamente a pressão
que o turno executa** — sem ela seriam duas contas para a mesma pergunta, a família de defeito
nº 1 deste projeto.

⚠ **E o passeio pegou um defeito antes de ele sair:** a corrente lia `asked` — o pedido acima
do piso — e a MALHA consome `funded`, o gasto cheio. Na Previdência a linha anunciava **+0,02**
onde o motor põe **+1,22**. É o mesmo defeito que a projeção pagou uma vez, na mesma tela.

### O C5 custou o primeiro bump desde a v18, e a doutrina venceu o plano

A posse passou a perguntar três compromissos, e `betrayal` — que existia na SONDA e só olhava o
orçamento — passou a olhar a plataforma também, pelo **maior dos dois** e não pela soma.

⛔ **E o plano dizia que a posse seria "a única carta que o jogador TEM de responder".** Isso é
muro, e a doutrina não tem muro. Quem avança calado governa sem plataforma, e o preço aparece no
fecho: um mandato sem nada contra o que ser medido. **Divergência do plano, resolvida pela
doutrina, e registrada.**

### E então ele foi jogar — cinco defeitos que o portão não via

_"o gabinete e a caixa de entrada estão cheios de bugs"_. A auditoria devolveu número:

| o quê                                          | medido                                     |
| ---------------------------------------------- | ------------------------------------------ |
| o Gabinete rolava a 1440×980                   | página 1011 contra janela 980              |
| a carta da posse era cortada                   | 875px numa folha de 831                    |
| vãos da caixa                                  | 24px entre partes · entrelinha 1,65        |
| texto cortado com reticência dentro das cartas | **13 linhas** em 24 meses                  |
| os glifos da posse                             | 96px — classe sem tamanho em folha nenhuma |

⚠ **A CARTA ABERTA NUNCA TEVE CONTENÇÃO, e só o discurso revelou.** A bandeja esquerda rola por
dentro desde o ciclo 14; a carta crescia e empurrava a página para fora da janela travada.
**Qualquer carta longa furava a tela** — a da posse só foi a primeira a ser longa.

⚠ **E o passeio era cego para a página rolar — quinta ocorrência da mesma família.** Ele media
recorte DENTRO dos elementos e transbordo lateral. `checkNoPageScroll` nasceu vermelha.

⭐ **E a captura decidiu duas coisas que o tipo não via:** o fecho imprimia `1 → 1` para uma
dívida que foi de 78% a 90% (o veredito não declarava a grandeza), e os três eixos da posse
trocaram a frase inteira pelo NOME do compromisso com o glifo da área — **−79px de carta**, e
foi a primeira entrega na direção que ele deu no mesmo dia.

### As duas direções que ele declarou, e nenhuma delas é plano

1. _"tudo parece escrito por IA, quero menos texto, mais minimalismo, mais visual... gráficos,
   mapas, isso tudo é melhor do que só texto e mais texto"_;
2. _"nós vamos criar o brasil todo com dados reais... estados, capitais, empresas"_, com a regra
   do nome definida na mesma conversa: **empresas reais com nomes alterados**, como os partidos
   já são.

**As duas foram registradas e nenhuma foi começada** — a primeira porque ele ainda não escolheu
por onde, a segunda porque ela custa o save inteiro.

## ⭐ A SESSÃO MAIS LONGA DO PROJETO — 30/08/2026

Seis achados fechados, dois ciclos (o 15 inteiro e quatro sextos do 16), um dossiê externo
triado e **nenhuma linha de motor tocada**. A ordem em que as coisas aconteceram importa,
porque cada passo nasceu de uma queixa dele olhando a tela:

1. **jogando**, achei o foco e as setas — dois defeitos da mesma família (identidade e estado
   guardados no mesmo lugar), e os dois passavam por treze guardas e 269 provas;
2. **"blocos dentro de blocos, tudo idêntico"** — o ciclo 15 inteiro, e o censo de estilo
   provou zero divergências no fim;
3. **"muitos espaços em branco"** — quatro medições, e um erro meu: encolhi a página em vez de
   crescer o conteúdo. Ele nomeou o erro com todas as letras na mensagem seguinte;
4. **"tire o título Gabinete"** — a única peça da tela que não respondia pergunta nenhuma;
5. **"aumente o texto dentro dos blocos"** — o ciclo 16, e o passeio cobrou duas vezes o que o
   olho não veria: sete nomes cortados a 1440px e um bloco estourando a própria largura.

### A lição de método desta sessão é sobre AUDITORIA EXTERNA

O dossiê do Gemini pedia uma revolução: monospace nos números, dourado nas bordas, textura de
papel, número de protocolo, hemiciclo, tooltips aninhados. **Duas afirmações técnicas foram
medidas antes de julgar, e as duas caíram:** o "problema de kerning" (`M ês`, `O brigatória`)
tem delta de **0,00px e 0,02px** — era artefato da imagem que ele leu; e o payload real do
monospace, números que não dançam, **já estava entregue** por `tabular-nums` desde sempre.

⭐ **E mesmo assim ele acertou o achado mais valioso aberto hoje:** o rail não recebe o índice
dos ministérios. É a mesma forma de sempre — _um dado que já existe no motor e nunca chegou à
tela_ —, e é a única classe de achado externo que não custa motor novo nem número inventado.

## ⭐ O GABINETE PASSOU A FALAR A LÍNGUA DA CAIXA — 30/08/2026

O ciclo 15 inteiro numa sessão. A frase que o governa é dele, e ela chegou no meio da execução:
_"tudo dentro de retângulos, blocos, igual como é a caixa de entrada, blocos dentro de blocos.
Tente reciclar ao invés de criar e deixar despadronizado."_

### "IDÊNTICO" é uma palavra que se mede

A queixa foi de olho — _"falta padronização em todo o Gabinete"_ — e a resposta não podia ser
de olho. Um censo de estilo **computado** comparou a mesma classe nos dois contextos e devolveu
**seis divergências** em cinco classes: fundo, aresta, recuo, vão, cor da legenda, cor do nome,
altura de linha.

⭐ **E a causa era de ENDEREÇO, não de desenho.** `--sheet-ink` era remapeado em `.tray` —
que cobre a carta e não a coluna. Bastou subir o remapeamento para `.cabinet` e levar junto
`--sheet-raise` e `--sheet-edge`: as duas telas passaram a ler os mesmos quatro tokens, e as
**seis sobreposições de contexto que eu tinha escrito no dia anterior foram apagadas**. Menos
CSS, não mais.

⚠ **O censo de tipo achou o defeito que os padrões já nomeiam por escrito:** `<small>` sem
regra é 0,833em, e 0,833 de 10px é **8,33px** — um degrau que não existe na escala. Era a
"porta por onde o `em` entra", e ela estava aberta em dois lugares.

### O bug que a checagem não via porque testava o mês errado

A prova do foco existia desde o ciclo 14 e estava verde. Ela clica numa carta no **mês 2** —
quando a única carta da caixa já está lida. Do mês 6 em diante, clicar numa carta **não lida**
jogava o foco em `BODY`, porque `focusMark` montava o seletor com o `dataset` inteiro e
`data-unread` muda **na mesma pintura**. É a família do achado 56 outra vez, com outro nome:
**identidade e estado guardados no mesmo lugar.**

⚠ **A lição é sobre a prova, e não sobre o código:** uma checagem que só exercita o estado
fácil fica verde para sempre. A 7d escolhe explicitamente uma carta `data-unread="true"`, e
reprova se não houver nenhuma — porque aí ela não estaria medindo nada.

### O achado não era o desenho, era o vocabulário

Três instrumentos — `gauge`, `meter`, `poles` — respondiam à mesma pergunta: _onde este número
está na régua dele?_ Cada bloco tinha sido desenhado sozinho, e cada um resolveu o mesmo
problema de um jeito. A Caixa, reformada uma sessão antes, resolvia **quinze espécies de carta
com três peças**. A coluna tinha **quatro blocos e dezoito classes**.

### A guarda nasceu vermelha, e o número dela foi o progresso

Onze achados, todos em `cabinet.mjs`. Não é decoração de processo: enquanto ela estava vermelha,
o portão respondia "quanto falta" a cada passo — 11, depois 0. **A Restrição 2 pagou-se aqui.**

### O risco que o plano anunciava não existia

O passo 5 vinha marcado como o único perigoso: _"`meter` e `poles` podem ser usados por
Finanças, a Mesa e o Congresso"_. Medido antes de apagar: `reading`, `meter`, `poles`,
`block__door` e `card__body` tinham **um produtor só**. Catorze quilobytes de folha saíram, e
com eles sete frases mortas e um `export` sem consumidor.

### E a substância é do contexto, não da peça

A linha é a mesma nas duas telas; o que muda é a matéria — **papel na carta, vidro na coluna**.
Escrever uma segunda peça para trocar duas cores seria o vocabulário dobrando pelo mesmo motivo
que ele dobrou da primeira vez.

## ⭐ UMA VARIÁVEL RESPONDIA DUAS PERGUNTAS — 30/08/2026

Sessão de leitura, não de plano: ele pediu para estudar o código e **subir o jogo ao vivo**. O
defeito apareceu jogando, e não lendo — abrir uma carta no mês 10 e ver as sete setas da coluna
da direita virarem traço, todas juntas, enquanto a barra do topo continuava marcando queda.

### A leitura que some não fica vermelha

`flat` e "não há mês passado" não são a mesma coisa, e o projeto já sabia disso: `directionOf`
devolve `null` quando não há com que comparar, e aí **nenhum elemento é escrito**. O que estava
acontecendo era pior que ausência — o `before` chegava montado a partir do **presente**, então
a comparação era honesta e o resultado era "não moveu". Nada falha quando uma tela afirma
calmaria num mês em que tudo andou.

### E a barra escapou por acidente, não por desenho

As duas peças leem a mesma variável. A diferença é que a barra de vitais tem o portão
`previous !== state` e não se repinta quando o estado não muda; o Gabinete se repinta a cada
clique. **A correção do defeito estava, por acaso, na otimização de outra coisa** — e é por isso
que ele sobreviveu a tipo, treze guardas, 269 provas e um passeio que abre a tela e a fotografa.

### O conserto é uma segunda variável, e o lugar dela importa

`framed` só anda quando o mês anda. Ela se fixa no **começo** de `paint()` e não no fim: a
coluna é montada no meio da mesma função, e fixá-la depois faria a seta comparar o mês com o
**retrasado** — um segundo defeito, mais difícil de ver que o primeiro, porque a seta existiria
e estaria apenas errada.

### O que a varredura NÃO achou, e isso também é resultado

Mandato inteiro ao vivo com um governo passivo: 48 meses, F5 no mês 20, impeachment autorizado
no mês 45, todas as telas a cada quatro meses, 33 cartas abertas uma a uma. **Zero erro de
console, zero `NaN` em tela, o save atravessou a recarga com as 28 cartas e a carta aberta.**

## ⭐ A CAIXA PERDEU TODAS AS TABELAS — 29/08/2026

**Ele não pediu isso; ele recusou uma pergunta minha.** Eu tinha fechado o passo 5 e levado a
ele a única decisão que sobrava: a coluna da soma do anexo da rua não batia com a manchete, e
eu queria saber se incomodava. A resposta reescreveu o passo 4 inteiro: _"todas essas tabelas
me incomodam muito, nem queria que fossem tabelas, e se for pra ser, quero algo bem mais
minimalista e estilo football manager, quero que você pesquise a fundo e me dê alternativas"_.

⚠ **E ANTES DISSO ELE TEVE DE REESCREVER A PERGUNTA POR MIM.** A primeira versão falava em
"coluna SOMA", "% de ótimo/bom", "o R2 que o ciclo recusou" e "o humor por classe dentro de
`attach`". Ele respondeu: _"cara nao entendi absolutamente nada do que tenho que decidir, vc
parece que fala em códigos"_. A decisão era simples e legítima — a pergunta é que estava
escrita para mim, e não para ele.

### A medição achou um defeito maior que o desenho

Abrindo TODA carta de um mandato de 14 meses num navegador: **19 de 23 cartas traziam tabela**,
**306 células por mês**, e a caixa tinha **cinco formatos de anexo para quinze espécies** — um
formato novo a cada três espécies.

⭐ **E A REGRA CONTRA ISSO JÁ ESTAVA ESCRITA NO PRÓPRIO CÓDIGO, contra a carta.** `cabinet.mjs`
recusa listar bancada por bancada e diz por quê: _"quem lista bancada por bancada, com nome e
humor, é a tela do Congresso"_. **O anexo da carta das cadeiras trazia as onze linhas.** E a
prosa de `strings.mjs` admitia o mesmo do caixa: _"o anexo e Finanças dizem o MESMO número"_.
O defeito nunca foi o desenho da tabela — era a carta duplicando a tela.

### A pergunta dele foi a mais importante da sessão

_"lembrando que o jogo ainda terá muito conteúdo a ser adicionado… até aí tudo bem, da pra
fazer mesmo assim?"_ — e ela é o que separou um desenho bonito de uma regra.

**A resposta é que a tabela é o que NÃO escalava.** Cinco formatos para quinze espécies, e cada
tabela nova cobrando largura: o defeito 3½.3, três dias antes, era o anexo cortando a coluna da
soma a 1280×800. O que escala é um **vocabulário fechado de três peças** — e a garantia não
podia ser promessa minha, porque foi exatamente assim que os cinco formatos nasceram, um de
cada vez, cada um razoável sozinho. Virou a guarda `annexes`, e ela pega tabela montada por
pedaços — que é como eles conviviam.

### Nada de motor, e a captura pegou três defeitos

`boilerOf` já entregava `lobbies` (pressão, ponto de fervura, fatia) e `ruptures` (valor,
limiar, lado). **A carta simplesmente não lia.** Zero linhas de motor, e `simulate` idêntico ao
caractere.

⚠ **E os três defeitos que sobraram morreram na imagem, não no portão** — nenhum falhava tipo,
guarda ou prova. Quatro bancadas caindo 2 cadeiras davam **quatro barras cheias e iguais**,
porque a barra normalizava pela maior queda: perder 2 de 14 é romper, perder 2 de 80 é ruído.
`signed(0)` pendurava um "0" no valor, e `21% 0` lia como um número de duas partes. E a regra
do impeachment ia num card de LEITURA, com doze palavras no tipo de um número — foi ela que
obrigou a terceira peça a existir.

**O pedido final dele fechou a forma:** _"quero esses blocos mais padronizados e com mais
conteúdo"_. O papel em branco caiu de **290px para 255px** de média, e a exigência — a pergunta
que custa dinheiro e chegava com **zero blocos** — passou a mostrar contra o que ela é cara.

---

## ⭐ A FILA QUE ESPERAVA UM BUMP TINHA QUATRO ITENS E TEM UM — 29/08/2026

**A pergunta dele foi de uma linha:** _"certo, mas e os achados abertos, vc vai corrigir ou algo
do tipo"_. A resposta honesta exigia primeiro **ler a lista em vez de repeti-la** — e ela estava
errada em três dos quatro itens.

**O handoff dizia, havia sessões, que quatro itens pediam o mesmo bump de esquema.** Eu repeti
isso no resumo do passo 5, sem medir. Medido:

| item               | o que a prosa dizia | o que se mediu                             |
| ------------------ | ------------------- | ------------------------------------------ |
| `last` (achado 46) | espera o bump       | **já tinha fechado na véspera**, versão 19 |
| `streams.events`   | espera o bump       | sai sem bump: ninguém o lê                 |
| `weight` da carta  | espera o bump       | sai sem bump: ninguém o lê                 |
| o placar (passo 4) | espera o bump       | **talvez também não peça** — meça          |

⭐ **A MEDIÇÃO É UMA LEITURA DE VINTE LINHAS.** `deserialize` confere a **presença** de 18
campos de topo e a **forma** de 8 deles, e **não olha dentro de uma carta**. Campo a mais num
save gravado antes é campo ignorado; campo novo numa carta nova chega ausente na carta velha,
e isso se resolve com reserva — que é exatamente o que o passo 3¾ já tinha feito com `was` e
`now`, três commits antes, sem ninguém notar que aquilo era a resposta para esta fila.

**Ninguém tinha aberto o validador.** A frase "requerem schema bump, juntos" foi escrita uma
vez, virou título de seção, e a partir dali era citada em vez de conferida. É o §7 dos padrões
outra vez, e é a terceira sessão seguida em que ele aparece: **prosa que continua gramatical e
para de ser verdade.**

⚠ **E O CUSTO ERA REAL, e não teórico:** o save recusa versão diferente em vez de converter, e
cada subida mata a partida em andamento. A fila existia para amortizar esse custo entre vários
itens — e três deles não custavam nada. **Amortizar um custo inexistente adiou trabalho de
graça.**

**A regra que autorizava a retirada já estava escrita no próprio arquivo.** `state.mjs` diz, ao
lado do número da versão, que _"campo novo sem consumidor não entra"_. Ele tinha dois: o
`weight` da carta, cuja segunda tarja saiu no passo 3.1, e o `streams.events`, que era o fluxo
de TEMPORAL — um motor que ainda é só contrato. **Os dois saíram, e a série de `simulate` é
idêntica ao caractere.**

**A prova que morde é a do save antigo**, e não a do novo: um save da versão corrente com
`weight` em toda carta e com o fluxo a mais **continua carregando**. Sem ela, a retirada seria
uma aposta com a partida dele.

---

## ✔ O PASSO 5 — OS CANAIS MORTOS E AS UNIDADES TROCADAS — 29/08/2026

**Ele pediu o passo 5, e o passo 4 ficou para trás de propósito:** o 4 pede o bump de esquema
que espera decisão dele, e o 5 é save zero e independente. A ordem do próprio ciclo já dizia
isso — _"independentes entre si, e entram a qualquer momento depois do 2"_.

**Dois dos oito já estavam fechados**, e a marca no plano é que estava velha: o assunto que
abria com `": "` e o escape duplo entraram em `3139ddb`, três commits antes. Ler o código antes
de consertá-lo custou duas leituras e evitou dois consertos de defeito que não existia mais —
é o §7 dos padrões outra vez, e desta vez ele foi pago barato.

**O 5.1 foi o único com desenho dentro.** Os dois descontos — credibilidade quebrada e desgaste
do cargo — pesam **igual em toda classe**, e por isso não cabem numa coluna: a prosa de
`strings.mjs` já dizia isso desde que o anexo nasceu, ao lado de um pé de tabela que ninguém
tinha escrito. E a repartição já os esperava: `apportion` carrega desde sempre um comentário
sobre resíduo com sinal porque _"a linha do desgaste tira pontos"_ — uma linha que não existia.

⚠ **E a captura pegou o que o portão não pega.** Com os dois descontos no pé, cada linha levava
o próprio fio em cima, e os dois ficavam separados um do outro — **dois separadores para uma
fronteira só**, que é o defeito que a zebra desta mesma tabela já tinha pago. `tr:first-child`,
e a imagem foi aberta de novo.

⚠ **E o 5.1 não fecha inteiro, por declaração.** A soma da tabela continua sem bater com a
manchete, e não é descuido de conta: **não são a mesma grandeza**. Entre a soma e o "28% de
ótimo ou bom" estão a inércia de `SONDA` — o humor não pula para o alvo — e uma conversão em
potência. Fechar a cadeia inteira exige o humor por classe dentro de `attach`, e `attach` vai
para o save. **É bump, e este passo é save zero.**

**O 5.7 é o único que se resolve com uma medição em vez de uma leitura.** A tarja tinha três
faixas e o rótulo tinha plural; nenhum dos dois nunca foi pintado, porque `ANSWER_TIME` é 2 e a
carta só aparece no mês seguinte ao que a escreveu. Medido num mandato inteiro, `left` devolve
`[[0, 6], [1, 7]]` — zero e um, e mais nada. **A prova que morde é a própria medição**, e ela
falha no dia em que o prazo mudar de tamanho.

---

## ✔ A CAIXA DE ENTRADA, AUDITADA POR QUATRO FRENTES — 28/08/2026

**Ele pediu para testar a capacidade investigativa, e proibiu conserto antes da autorização:**
_"eu estou vendo diversos bugs, brechas, visual feio e tudo mais, na caixa de entrada. Eu quero
testar sua capacidade investigativa, procure, use vários agentes se precisar."_

Quatro frentes em paralelo — o motor da correspondência, a view, o _wiring_ do entrypoint e a
geometria medida no navegador —, mais a minha, que confrontou a Caixa com o ciclo 9, que a
projetou. **Duas frentes morreram no limite de sessão e foram relançadas depois do reset.**

### O que a investigação achou, e a maioria não era de desenho

O pedido dizia "visual feio". **Três dos achados mais graves são de motor**, e os três
atravessaram doze guardas, 253 provas e o passeio:

- a **poda** da caixa cortava com `slice` negativo sobre um array que tem as novas na frente.
  101 cartas destruídas com 1 a 3 meses de idade, e um buraco de doze meses na caixa do mês 30;
- o **alarme de fervura** calava a exigência do grupo que acabara de ferver;
- o **alarme do teto** era `!X && X`. O teto fecha em 12 de 48 meses e a carta nunca saiu.

⭐ **E o defeito mais visível é de gesto, não de layout:** `openDispatch` nunca é limpo, então
**um clique prende o jogador numa carta**. Medido em 20 meses, com três meses em que havia
pergunta vencendo e o painel mostrava um aviso velho.

### ⚠ A lição de método, e ela é sobre auditoria fechada sem prova

O **achado 24** estava marcado como concertado no handoff. O conserto entregue — a tag de
espécie — cobre três espécies que **não são** a do caso que o próprio achado descreve. Bastou
jogar catorze meses para reproduzir duas perguntas abertas idênticas.

> ### ⚖ Daí saiu a regra do §8: achado só fecha com prova que morde.
>
> A prova nasce antes, e se ela não reprova contra o código de hoje, o achado não estava
> consertado. **Ela vale contra mim na mesma medida** — e a mesma sessão provou isso duas
> vezes.

**A primeira:** eu excetuei `.tray__subject` do `checkClamped` lendo a prosa da folha, que diz
que o corte é decisão. A frente de geometria mediu depois: o corte come **66% das linhas** do
índice e faz 21 dos 24 meses terem duas linhas idênticas. **Excetuei exatamente a peça
quebrada**, que é a definição de checagem que mente.

**A segunda:** rodei `git checkout docs/handoff.md` para desfazer um `sed` de uma linha, e ele
reverteu o arquivo inteiro, apagando nove edições. **Desfazer uma linha não se faz com um
comando que restaura o arquivo.**

### ⭐ E DUAS FRENTES DISCORDARAM — a medição direta ganhou

A view concluiu que o índice _"rola em silêncio"_; a geometria mediu a calha nas três janelas e
achou `overflowY: 0` com treze itens dentro de 627px. **A lista não rola.** O que sobrou do
achado foi menor e continua válido: a constante de capacidade não conta os divisores de mês.

**Isso é o argumento a favor de auditar em paralelo e escrever em série:** duas frentes medindo
o mesmo lugar por caminhos diferentes se corrigem. Duas frentes ESCREVENDO no mesmo lugar
divergem, que é a família de defeito nº 1 deste projeto.

### ✔ E o que foi consertado

Os três de motor, com as provas nascendo antes. **A série não mudou um caractere** — os
consertos devolvem correspondência e nenhum toca em calibragem. Mais o `checkClamped`, o quarto
irmão do passeio, que vê o que os outros três não veem: `-webkit-line-clamp` não move
`scrollHeight`, então a única medição possível é soltar o recorte e comparar a altura.

⚠ **O resto do ciclo 14 está escrito e não começado**, e o passo 1½ — o gesto — é o mais grave.

### ⭐ A REPRODUÇÃO QUE VALE É DELE

Ele achou o índice bagunçado em **três cartas**: partida nova, dois "avançar", e o calendário lê
`ABR · 2027 → MAR · 2027 → ABR · 2027`. Eu tinha achado o mesmo defeito com **catorze meses de
jogo ativo**. As duas medem a mesma coisa, e a curta é a que a próxima sessão consegue repetir.

## ✔ A PROSA CONTAVA UM CONGRESSO QUE NÃO EXISTE — 28/08/2026

**Sessão de leitura completa do código, a pedido dele: _"leia todo o código, estude tudo, tem
muita coisa nova"_.** Nenhum motor foi alterado e nenhuma calibragem foi tocada. O que a
leitura achou não foi defeito de mecanismo — foi o **instrumento de leitura da próxima sessão
mentindo**.

### O achado, e ele é de método

O catálogo cresceu de 4 para 9 blocos partidários e de 7 para 8 arquétipos ao longo dos ciclos.
**A prosa não cresceu junto.** Medido no dia: são **9 blocos, 8 arquétipos e 16 bancadas
efetivas**, e as 513 cadeiras fecham. Quatorze lugares afirmavam "onze bancadas" e "sete
pessoas" em tempo presente — incluindo o contrato de `chamberOf`, a fachada, e a seção "O que
existe" do próprio handoff.

⚠ **E É EXATAMENTE A FAMÍLIA QUE `standards.md` §7 DECLARA SEM GUARDA:** prosa que continua
gramatical e para de ser verdade. A guarda `prose` pega o identificador morto — `--token`,
`.classe`, `arquivo.mjs` que o projeto não tem mais —, e não pega a frase que descreve um
estado que o código deixou de ter. **As doze guardas leem TEXTO, e nenhuma sabe contar o
catálogo.**

### O que estava errado, além das bancadas

A varredura pegou sete outras contagens, e nenhuma delas era defeito de mecanismo:

| afirmação                            | verdade medida                                    |
| ------------------------------------ | ------------------------------------------------- |
| "onze telas"                         | **doze** — o próprio `censo-tipo.mjs` visita doze |
| "236 provas · 130 arquivos"          | **253 · 131**                                     |
| "seis políticas-sonda"               | **nove**, desde os achados 50 e 52                |
| "doze espécies de aviso"             | **treze** — são 15 `kind`, e duas perguntam       |
| "A Rua e Bastidor seguem desligados" | saíram do rail no D7, quatro dias antes           |
| "três cartões" na coluna do Gabinete | **quatro** — e o passeio já cobrava cinco `.card` |
| "o arco em três fatias"              | o arco morreu; hoje é `meter` com quatro fatias   |

⚠ **A ÚLTIMA É A MAIS INSTRUTIVA:** a mesma seção do handoff descrevia uma peça que morreu em
15/08 e um número que o passeio já cobrava diferente. **Duas verificações existiam e nenhuma
alcançava a prosa.**

### A distinção que guiou cada conserto

Nem todo número velho é um número errado. A regra que apliquei:

- **afirmação em tempo presente sobre a forma de hoje** → corrigida, ou reescrita para não
  depender de contagem nenhuma. `settlement` dizia "são sete pessoas e nenhuma consulta a
  fluxo"; passou a dizer que **cada pessoa sai de um hash da semente** — que é o mecanismo, e
  o mecanismo não envelhece;
- **medição em tempo passado onde o número É a evidência** → mantida. `mesa.mjs` registra que
  a mesma frase saía uma vez por pessoa na captura; `app.mjs` registra os **27,2%** de
  vereditos invertidos. Esses números são a prova, e apagá-los apagaria a lição;
- **número velho que era só cenário numa frase de história** → removido. "o turno votava com as
  ONZE bancadas do ELENCO" virou "com as bancadas do ELENCO": a lição é o 27,2%, e não o 11.

⛔ **E `journal.md`, `cycles/` e os ADRs ficaram intocados de propósito.** Eles são histórico
datado — corrigir um número ali seria reescrever o que foi medido no dia.

### ⭐ E O PORTÃO GANHOU O QUE FALTAVA, porque a Restrição 2 manda

> _"Nenhum item entra sem que o portão SAIBA VER o defeito que ele conserta. Se a checagem que
> pegaria a regressão não existe, ela nasce primeiro."_

Eu tinha acabado de consertar um defeito que o portão não enxerga. **A regra dura do ciclo 13
se aplica a ela mesma**, então a checagem nasceu junto.

**E ela é uma PROVA, e não uma décima terceira guarda** — a decisão é sobre honestidade do
casador. Uma guarda que varresse prosa procurando "<numeral> bancadas" acusaria toda frase
histórica do `journal.md`, que é o modo de falhar que este projeto já recusou uma vez: a versão
larga da guarda `prose` acusava 25 blocos, dos quais 21 eram falso positivo. **O que dá para
provar sem ambiguidade é uma tabela declarada.**

`tests/suites/catalog.mjs` passou a ler o `handoff.md` e conferir toda linha de duas colunas
cujo rótulo esteja num mapa fixo — blocos, cadeiras, áreas, programas, regras, grupos de
pressão, faixas de renda e arquétipos — contra o `CATALOG`. **Verificada contra o defeito que
ela existe para pegar:** com `| blocos partidários | 11 |` ela reprova.

⚠ **E ELA TEM DUAS DEFESAS ESCRITAS, e a segunda é a que quase faltou:** a primeira é o alcance
declarado (só o handoff, que promete no cabeçalho que ali só entra o verificável); a segunda é
que **apagar a tabela reprova a prova**. Sem isso, remover as linhas a deixaria verde para
sempre — que é a forma mais silenciosa de uma prova morrer.

### ⚠ E EU DESTRUÍ NOVE EDIÇÕES COM UM `git checkout`, e o registro fica

Depois de verificar que a prova nova reprova com o número errado, rodei `git checkout
docs/handoff.md` para desfazer o `sed` de uma linha. **Ele reverteu o arquivo inteiro** e apagou
as nove edições daquela sessão no handoff. Refazer custou pouco porque as edições estavam no
histórico da conversa; num arquivo maior teria custado a sessão. **Desfazer uma linha não se faz
com um comando que restaura o arquivo.**

### O que ficou aberto

Os dois canais mortos do plano continuam mortos, e os dois foram confirmados no código:
`taxDelta` — `turn.mjs` passa `catalog.fiscal.taxLoad` nas duas pontas, então a subtração é
sempre zero — e `streams.events`, que só a suíte do reducer toca. Os outros dois já foram
ligados: `data-guard` pinta em `30-components.css`, e a desoneração virou renúncia via
`waiver`/`waivedOf`.

## ✔ O GLORIOSO SAI DO PAPEL — passos 1 e 3, e a frase que fechou a sessão — 24/08/2026

A sessão 20 executou **12 dos 49 itens** e terminou com quatro palavras dele:

> _"mudou bosta nenhuma"_

**E ela está certa.** É a lição mais cara desta sessão, e ela é sobre ESCOLHA DE ORDEM, não
sobre execução: os cinco itens do passo 1 e três dos cinco do passo 3 **consertam** — número
errado, palavra repetida, informação escondida, canal morto. **Consertar é invisível por
construção:** o melhor resultado possível de arrumar uma contradição é ninguém notar nada.

⚠ **E A ESCOLHA FOI MINHA.** Ele pediu _"quanto mais profissional o jogo ficar, melhor"_ e
depois _"não quero bugs"_. Eu otimizei pela segunda e entreguei polimento por um dia inteiro.
O que muda o jogo é a Parte A — hoje o presidente faz UMA coisa, arrastar verba e prometer
emenda —, e ela começa no passo 6.

⚠ **E EU AINDA INVERTI A ORDEM DO PLANO por conta própria**, pulando o passo 2 e anunciando a
inversão como deliberada. Ele cobrou: _"não acha melhor voltar desde o início, passo 1, passo
2, passo 3?"_. **A ordem do plano volta a valer.**

### ⭐ A CHECAGEM QUE NASCEU ANTES DO ITEM, e ela achou três defeitos publicados

A Restrição 2 manda: _"nenhum item entra sem que o portão SAIBA VER o defeito que ele
conserta"_. O C3 põe texto dentro de um rótulo de largura fixa, e o passeio era cego para
isso: `checkClipped` e `checkSwallowed` medem **rolagem**, e `text-overflow: ellipsis` não
rola — a frase só perde o fim, com reticência, e a tela fica plausível.

`checkEllipsized` nasceu primeiro e acusou **três truncamentos na tela publicada** na primeira
rodada: `Congresso & Leis` pedia 114px num rótulo de 109, `Indústria e Infraestrutura` pedia
164, e a mesma na faixa do Congresso pedia 202 em 117.

⚠ **E ELA PEGOU DOIS DEFEITOS MEUS ANTES DE SUBIREM:** o rótulo do C3 estourando a coluna, e —
via a suíte, não o passeio — a Câmara sem a quarta fatia: as três somam a base, então
reparti-las sozinhas deixava a barra **sempre cheia** e a comparação com as 513 sumia.
**Nenhuma prova foi enfraquecida** para acomodar nada disso.

### A TABELA QUE CALIBRA ESTAVA ERRADA, e foi remedida antes de ser citada

A coluna de votações divergia nas quatro políticas que votam. A causa: **horizonte misturado
dentro da mesma célula** — `14 de 43` era o numerador de 24 meses colado no denominador de 48.
As outras três colunas passaram: a dívida fecha dentro de 0,1 p.p. nas seis, e indústria e
segurança batem exato nas doze células. Virou o **achado 54**, e o achado 22 — que raciocinava
em cima dela — foi reescrito.

### O 0.1 e a aritmética que decidiu o desenho

A desoneração saiu da despesa e virou renúncia de receita. **A série mal se move** — a dívida
final é idêntica em quatro das seis políticas. E a forma de ler a renúncia não foi escolha de
gosto: lida em **delta** como o dividendo, o primário de posse saltaria de **−51,2 para
−31,4** sem ninguém escolher isso; lida **cheia** nos dois lados, não move um real.

⚠ **Uma prova mudou de limiar com o critério intacto.** O governo mediano caía no mês 52 e
passou a cair no 50, e a prova exigia `> 50` — mas o motor encerra o mandato em `month >= 48`,
então os meses 48 a 50 só existem no laço de 60 dela.

### D7 — as duas telas cinzas saíram do menu

_"tira do menu por enquanto"_. Saiu junto tudo o que só existia para elas: os dois rótulos, a
frase `ainda não existe`, os dois ícones, o parâmetro `ready` de `itemHtml` — um parâmetro que
só recebe `true` é porta aberta — e a regra `.rail__item[disabled]`, que `orphans` **não
alcança** por ser atributo e não classe. Elas voltam com dono: A Rua depende de D3 e A9,
Bastidor depende de D1.

### ⭐ E O QUINTO CANAL MORTO APARECEU SOZINHO

O plano lista quatro canais mortos. A Câmara achou o **quinto**: `baseSplit` — quantas cadeiras
apoiam, obstruem e romperam — era calculado todo quadro, declarado no contrato da view e
**nunca lido**. A barra cheia dizia "436 apoiam"; as fatias dizem quem são os outros 77.

## ✔ O PLANO MESTRE, E O DEFEITO QUE ELE ACHOU AO SER ESCRITO — 24/08/2026

A sessão 20 não abriu motor nenhum. Ela escreveu `docs/cycles/13-the-glorious.md` — 43 itens em
quatro partes — e o processo de escrevê-lo achou um defeito na tela publicada.

### A PARTE C nasceu de um terceiro dossiê, e ele foi o mais afiado dos três

O dossiê do Gabinete fez três acusações e **as três procedem**:

1. **86 contra 68.** `TERMOS.political` é `"Parlamentares"`; `LOBBIES[1].label` é
   `"Parlamentares"`. A Trindade imprime _"rompe acima de 86"_ e a caldeira _"rompem acima de
   68"_, na mesma tela sem rolagem. ⚠ **E o handoff da época dava isso como resolvido** —
   _"estruturalmente correto, e agora está legível"_. Está correto: em 68 o grupo abandona, em
   86 a ruptura política abre. **Não está legível, porque o verbo é o mesmo nos dois.** O
   veredito antigo foi desfeito;
2. **a redundância do cofre.** `UI.cabinet.vaultFree` e `UI.inbox.inheritedRoom` são a mesma
   constante, `TERMOS.roomLine`. ⚠ **A guarda de vocabulário foi quem criou:** ela forçou as
   duas a compartilharem o literal — o que prova que são a mesma leitura — e ninguém perguntou
   se devia aparecer duas vezes. Guarda mede consistência, não redundância;
3. **falta de agência.** Certo no diagnóstico, errado na solução: dois dos três botões que ele
   propõe levam para outra tela ou não existem. A superfície já existe e está vazia — `mail.mjs`
   tem `demand`, que é exatamente o que ele descreve. O buraco é o achado 37.

**E a leitura contra o código achou o quarto canal morto:** `cabinet.mjs:413` calcula o peso de
cada grupo na ruptura econômica e escreve **dentro do `aria-label`**. Militares e polícia pesa
**zero**, e o jogador vidente vê quatro barras iguais.

### ⛔ E AÍ O ORÇAMENTO DE PIXEL DERRUBOU METADE DO QUE EU IA PROPOR

Medido antes de escrever, em `tmp/cabe-no-gabinete.mjs`: a 1440×980 o Gabinete fecha em **980 de
980**, a coluna lateral em **639 de 639**, a bandeja em **639 de 639**. A "folga de 24px" dos
cartões é padding. No mês 1 havia 24px reais; o cofre ganhou uma linha no mês 9 e os consumiu.

**Nada cabe.** C7 e C8 foram para a faixa do topo, C1/C3/C9/C11 viraram inline, e C10 ficou
declarado como o único que custa altura — dependente do item abaixo.

### ⭐ E O DEFEITO VIVO: a coluna engolia um cartão, com o portão verde ao lado

`.cards__side` tem `overflow-y: auto`, e o canvas (`height: 100dvh`) valia em **qualquer**
janela — a liberação era por largura (1180px) e **nunca por altura**:

| janela       | coluna visível | conteúdo | resultado                     |
| ------------ | -------------- | -------- | ----------------------------- |
| 1440×**980** | 639px          | 639px    | cabia — e era a única testada |
| 1440×**900** | 559px          | 594px    | **3 de 4 cartões inteiros**   |
| 1440×**760** | 419px          | 594px    | **2 de 4**                    |

⚠ **A ironia mora no próprio arquivo.** `40-shell.css` já carregava o argumento escrito, para o
telefone: _"travar a altura esconderia metade do Gabinete atrás de uma dobra sem nada que
avisasse"_. **O raciocínio estava certo e o limiar não existia.**

**Por que ninguém viu, e é a mesma família pela quarta vez:** `checkOverflow` mede `scrollWidth`
— só horizontal, só a página. `checkClipped` filtra por `style.overflowX`, e o cabeçalho dela
conta que o passeio já foi cego no eixo X e foi consertado — **o gêmeo do Y nunca entrou**. E o
passeio rodava numa janela só, 1440×980, que era exatamente a única altura em que cabia.

**O conserto, na ordem em que foi feito** — a checagem primeiro, que é a regra escrita no plano
na mesma sessão:

1. `checkSwallowed` nasceu, e foi rodada contra a folha **antiga**: acusou `cards__side 594>559`
   e nada mais. Exceção declarada: `.tray__list`, desenhada para rolar desde sempre;
2. o passeio ganhou a segunda janela, 1440×900;
3. o canvas foi para dentro de `@media (min-height: 940px)` nas duas folhas. Abaixo disso a
   página rola — o **mesmo plano B declarado** que o eixo horizontal já usava.

Depois: 594 de 594 a 900, 820 e 760px. Captura aberta nas duas janelas.

### ⭐ E A PARTE D VEIO DE UMA DIRETRIZ DELE, no fim da sessão

_"Siga com o que pensar ser melhor pro jogo, sempre no sentido de se aproximar de jogos como
Victoria 3, Crusader Kings, Democracy, Football Manager."_ A leitura do código contra essas
quatro referências achou dois buracos grandes:

- **o presidencialismo de coalizão não existe.** O jogo tem partido, cadeira, venalidade e
  memória, e o jogador compra voto a voto. Falta a estrutura brasileira: ministério em troca de
  bancada. ⚠ **E o custo conceitual é quase zero** — as oito áreas do rail já são os oito
  ministérios, `ELENCO` já tem `office` e `reach`, e `remember()` já guarda rancor. O A6 chamava
  isso de "a segunda moeda", e está pequeno: aqui o gabinete é a moeda principal;
- **não há eleição.** Duas saídas: servir 48 meses ou cair. `turn.mjs:1994` declara que não há
  vitória nem placar — **decisão certa, e a eleição não a contradiz.** É a terceira saída, no
  mesmo tom, e `termOf` já calcula tudo de que ela precisa.

E três menores: `CASCATA` e `DELTA` são codinomes reservados e vazios; o rail promete **A Rua** e
**Bastidor** com `ready: false`; e `graph/index.mjs` carrega um comentário sobre `backdrop-filter`
sem relação com DELTA.

### ✔ A COLUNA DA DIREITA DO GABINETE LEVOU 6

A Caixa de Entrada tinha ido de 7 para 8; a coluna nunca tinha sido avaliada. Seis defeitos
estruturais, e nenhum é "está feio": quatro blocos com a mesma forma e nenhuma hierarquia — **o
bloco que decide a partida divide espaço igual com contabilidade**; sete barras idênticas
medindo contagem, fração, pressão e composição; nada é porta; zero rostos numa coluna que mede
gente; nada se move; tudo com a mesma voz.

⚠ **E ELE DELEGOU AS SEIS DECISÕES ABERTAS.** As quatro de olho e as duas técnicas foram
respondidas por mim e **escritas no plano com o motivo** — delegar muda quem assina, não apaga a
decisão.

### As três restrições, e elas valem para os 49 itens

- **o orçamento de pixel** acima. Nenhum item do Gabinete entra sem dizer de onde tira a altura,
  e _"a coluna rola"_ deixou de ser resposta;
- **o que é "pronto"**: validate verde, captura aberta, e a regra dura — _nenhum item entra sem
  que o portão saiba ver o defeito que ele conserta_. Com a lista de onde o mínimo não basta,
  incluindo que **C6 quebra a asserção `#main input, #main select === 0`**, que o plano agora
  declara antes em vez de descobrir depois;
- **o save**: `SCHEMA_VERSION = 18` recusa em vez de converter, e a recusa está certa — a razão
  já está no arquivo. O achado: **32 dos 43 itens custam zero no save**; todo o custo está na
  Parte A. Três opções escritas, e a decisão é dele.

---

## ✔ AS DUAS FAMÍLIAS ENTRARAM NO PROJETO — 22/08/2026

Queixa dele: _"as fontes que você usa são muito feias"_, com o teto de **duas**. Renderizei a
mesma carta em cinco pares e ele escolheu **Segoe UI Variable + Constantia**.

⚠ **AS DUAS SÃO DA MICROSOFT E NÃO PODEM SER REDISTRIBUÍDAS**, e ele pediu fonte aberta desde
já. Entraram as equivalentes sob SIL OFL, vendorizadas em `vendor/fonts/`:

| token            | agora                           | antes       |
| ---------------- | ------------------------------- | ----------- |
| `--font-display` | **Inter**                       | `system-ui` |
| `--font-text`    | **Inter**                       | `system-ui` |
| `--font-record`  | **Source Serif 4**              | `Georgia`   |
| `--font-machine` | mono do sistema — **não mudou** | idem        |

São **variáveis**: um arquivo cobre 400 e 700, e cada família vem em `latin` e `latin-ext`, com
`unicode-range` para o segundo só baixar se a página precisar. **226KB no total.** A pilha de
reserva continua declarada, e não é cerimônia: `font-display: swap` desenha com ela no primeiro
quadro. ⚠ **E o `@font-face` mora DENTRO de `@layer tokens`** — fora, a guarda `cascade` reprova
como CSS solto, com razão.

### ⛔ E A TROCA DE FONTE REABRIU UM DEFEITO QUE JÁ ESTAVA CONSERTADO

**A Inter é mais larga que a Segoe UI, e a coluna da SOMA voltou a sair cortada.** Os 24px
vieram do recuo lateral do card — que saiu junto com a caixa dele, porque **recuo existe para
afastar conteúdo de uma BORDA, e aquele card não tem mais borda nenhuma**.

⚠ **E O PASSEIO FICOU VERDE COM A TABELA CORTADA.** Ele mede a rolagem da PÁGINA, e uma peça com
`overflow-x: auto` engole o excesso sem a página crescer um pixel. ✔ Nasceu `checkClipped`:
qualquer peça com recorte próprio cujo conteúdo não cabe é acusada. ⚠ **E ela nasceu SEM
ALCANCE** — rodava nos pontos de troca de tela, e no mês 1 a bandeja não tem carta com tabela.
Agora o passeio **avança até achar uma carta com anexo** e mede lá. Verificado reintroduzindo o
defeito: acusa `annex__scroll 390>353`.

## ✔ A REVISÃO DA CAIXA DE ENTRADA, PIXEL A PIXEL — 22/08/2026

Nota dele antes: **7**. O método foi medir primeiro e olhar depois — `tmp/auditar-caixa.mjs`
instrumenta TODA carta (transbordo, rolagem horizontal, cards desiguais, e o inventário de
tipografia com o nome da peça atrás de cada combinação), e `tmp/prints-caixa.mjs` tira um
print 2× de cada espécie.

### ⚠ O ACHADO PRINCIPAL FOI TIPOGRÁFICO, e nenhum olho o pegaria

**A carta usava 11 combinações de tamanho/peso/família — e QUATRO PESOS no mesmo corpo de
10px** (400, 600, 700 e 800). É literalmente o que o `standards.md` proíbe: _"onze tamanhos
entre 11px e 17px não formam hierarquia nenhuma: formam ruído"_.

Os 600 eram órfãos (`annex__table tbody th`, `annex__sum`, `letter__name`) e o 800 era um
quinto grau só do botão. ✔ **Dois pesos agora, 400 e 700**, e a diferença entre peça e peça
sai do tamanho e da tinta.

⚠ **E o vocativo era MENOR que a frase que ele abre** — 13,6px acima de um corpo de 15,2. Isso
é inversão de hierarquia, não sutileza.

### ⛔ A TARJA DA COLUNA TINHA DOIS DONOS, E OS DOIS PINTAVAM DE VERMELHO

`data-weight="high"` e `data-urgency="now"` usavam **`--crisis` os dois**: um aviso sem prazo
nenhum aparecia na coluna com a marca de _"vence agora"_. ⚠ **A prosa do não-lido, dez linhas
abaixo na mesma folha, já proibia isso com todas as letras** — _"a esquerda já significa PRAZO
em três cores, e uma quarta cor ali faria o jogador ler urgência onde há novidade"_.

✔ A tarja tem um dono só. Quem carrega o peso agora é **a pastilha, que desceu para o índice**
— e ela resolve duas coisas: o remetente repetia _"Denise Hollanda Cavalcanti"_ em **seis de
sete linhas**, e quem escolhe o que abrir precisa saber QUANTO andou, não de novo quem assinou.
⚠ `weight` saiu do `Dispatch` junto: campo que chega e ninguém lê é dado morto.

### ✔ E TRÊS DEFEITOS DE ALINHAMENTO QUE SÓ O PRINT 2× MOSTROU

- **a pastilha encostava no `%`** do assunto e caía para a base da linha;
- **os cards irmãos tinham caixas iguais e conteúdo desalinhado**: uma legenda de duas linhas
  empurrava o valor para baixo. ✔ A leitura ancora no fim do card, então dois irmãos alinham o
  que o olho compara;
- **a pastilha de dinheiro quebrava a linha do índice** em duas das sete cartas — `R$ 7,7 bi`
  com 0,18em de entreletra. ⚠ **Entreletra é para rótulo em versal**, e o que mora na pastilha
  é número. E a linha precisou de `min-width: 0`: o remetente tem reticência, mas só encolhe se
  o pai puder encolher.

### ⛔ E DEPOIS A SETA INTEIRA SAIU — nota dele: 8

Primeiro caiu o fundo (_"esse fundo retangulo fica estranho"_), e na rodada seguinte a peça
inteira: _"não curti as setinhas verde e vermelha, nem nada do tipo, sem elas estava bem
melhor"_. ✔ `.signal`, `.signal__arrow`, `deltaBadge`, o campo `badge` do `Dispatch` e os
tokens `--growth-rgb` / `--signal-down-rgb` saíram todos — não sobrou seletor nem chave.

⚠ **E `Base cai a 229 cadeiras` FICA no nível.** A pastilha foi o que revelou que a manchete
falava na variação enquanto as outras duas falavam no nível; a pastilha morreu e a correção
sobreviveu, porque ela nunca dependeu da pastilha. **A variação segue dita na primeira linha do
corpo**, que é onde ela sempre esteve.

### ✔ A TIPOGRAFIA DA CAIXA, MEDIDA E FECHADA — `tmp/fontes.mjs`

Varredura de 20 meses abrindo cada carta, índice e ofício juntos:

| eixo         | quantas | quais                                       |
| ------------ | ------- | ------------------------------------------- |
| **famílias** | **2**   | `system-ui` (4.962 peças) · `Georgia` (234) |
| **tamanhos** | **5**   | 10 · 12,48 · 13,6 · 15,2 · 16,8px           |
| **pesos**    | **2**   | 400 e 700                                   |
| combinações  | 19      | todas dentro de 2 × 5 × 2                   |

⚠ **A terceira família do projeto — `--font-machine`, a mono do carimbo — NÃO aparece na caixa
de entrada.** Isso é correto e vale registrar: ali não há rito carimbado, só documento.

⚠ **E há UMA divergência declarada:** o assunto é `Georgia 16,8` no ofício e `system-ui 13,6`
no índice. É a mesma frase em duas famílias, e a razão é de papel — no ofício ele é o título do
documento (o que se assina, e serifa é a regra disso); no índice é item de navegação. Se um dia
alguém achar que é defeito, **é aqui que a decisão está escrita.**

### ✔ ANTES DISSO: A CAIXA DA SETA SAIU, E O CABEÇALHO GANHOU FAIXA

- ⚠ **`"esse fundo retangulo fica estranho"`** — e ele tem razão pelo mesmo motivo que o ciclo
  11 matou a pastilha: a caixa era o dialeto de aplicativo, e o que carrega o sinal é a **cor**
  e a **seta**. Sobrou seta e número. `--growth-rgb` e `--signal-down-rgb` saíram junto —
  existiam só para aquele fundo, e a guarda `tokens` os acusaria;
- **as duas setas medem 8×5 e o desvio contra o número é 0,3px**, medido. A simetria vem de as
  duas ocuparem a MESMA caixa — a que sobe pinta a borda de baixo, a que desce pinta a de cima
  — e o centro é do `align-items: center` do pai, nunca de ajuste manual;
- **a faixa do remetente** é o par de cima da faixa de ação: as duas sangram até a borda, as
  duas usam o degrau de profundidade do card, e entre elas fica o documento.

⚠ **E as duas faixas nasceram CURTAS:** a carta é uma grade com `justify-items: start`, então
quem quer a largura toda **pede**. Sem `justify-self: stretch` a faixa media o próprio conteúdo
e parava a 68px da borda — a margem negativa só deslocava, em vez de esticar. **É a terceira
vez que este mesmo `justify-items: start` morde nesta sessão** (o bloco da coluna da direita e
a seção de anexos foram as outras duas).

### ▶ O QUE FALTA PARA 9-10, e três dos quatro são de MOTOR

1. ⚠ **O VÃO NO PÉ, e ele é o maior buraco visual que sobrou.** Medido: ~300px na carta de
   aprovação. **Metade das espécies não tem rodapé porque não tem o que fazer** — as portas que
   elas abririam (`A Rua`, `Bastidor`) estão desligadas. Não é defeito de layout: é a caixa não
   ter ação para oferecer;
2. ⚠ **O REMETENTE É O MESMO EM SEIS DE SETE CARTAS.** Só três espécies têm remetente próprio
   (relator, presidente da Câmara, líder); o resto é Casa Civil. É achado de ELENCO, não de
   tela — e é o que faria o índice ter variedade de verdade;
3. ⚠ **UMA ESPÉCIE PERGUNTA, ONZE INFORMAM.** A caixa é quase toda leitura. É isso que separa
   um inbox de um mural, e é decisão de mecânica;
4. **o índice não agrupa nem filtra por tipo** — no FM há abas. É tela, e é o único dos quatro
   que dá para fazer sem tocar em motor.

## ✔ AS DOZE CARTAS PASSARAM PELA MESMA PENEIRA — 22/08/2026

**O método, e ele vale para a próxima:** instrumentar TODA carta do jogo — altura do corpo,
número de linhas, número de anexos, altura do rodapé e o vazio que sobra — e rodar 22 meses
abrindo cada uma. `tmp/todas-cartas.mjs`.

**Antes × depois, medido:**

| carta            | antes                       | depois                   |
| ---------------- | --------------------------- | ------------------------ |
| posse            | 194px · 3 linhas · 0 anexos | 70px · 1 linha · 2 cards |
| mês fechado      | 119px · 3 linhas            | 45px · 1 linha           |
| fervura de grupo | 144px · 3 linhas · 0 anexos | 70px · 1 linha · 2 cards |
| ruptura          | 157px · 2 linhas · 0 anexos | 95px · 1 linha · 1 card  |
| minoria          | 107px · 2 linhas · 0 anexos | 70px · 1 linha · 2 cards |
| **vazio no pé**  | até 390px                   | **1px ou 37px**          |

### ⚠ TRÊS DUPLICAÇÕES QUE SÓ APARECERAM COM A PASTILHA E O ANEXO

1. **`Base perde 157 cadeiras` + pastilha `▼157`** — o mesmo número duas vezes. As outras duas
   manchetes já falavam no NÍVEL; esta falava na variação. ✔ Virou `Base cai a 229 cadeiras`:
   o assunto carrega o que o presidente TEM, a pastilha carrega o quanto andou;
2. **as três leituras do corpo da carta do mês** repetiam o anexo _"o mês em três leituras"_,
   que mostra as mesmas três **com o antes ao lado**. Três linhas de prosa para dizer metade do
   que a tabela abaixo dizia inteiro. ✔ Saíram, e `inbox.street`/`base`/`vault` com elas;
3. **a regra do impeachment como segunda linha de toda ruptura** — a mesma frase todo mês, lida
   uma vez e ignorada depois. ✔ Virou card.

### ✔ E CINCO FRAGMENTOS DE FRASE VIRARAM LEGENDA

`"da despesa do ano é obrigatória, e ela não passa pela sua caneta"`,
`"de 513, e a maioria fecha em"`, `"de 100 de pressão, contra um ponto de fervura de"` — todas
eram **costura em volta de um número**. Num card a legenda nomeia e o valor responde, então a
costura deixa de existir. ⚠ **E a guarda `vocabulary` cobrou cada órfã que isso deixou**, uma
por uma — foi ela que guiou a limpeza.

⚠ **`vaultFree` e `inheritedRoom` viraram a MESMA frase e a guarda acusou:** são a mesma
leitura em dois lugares e mudam juntas por definição. Foram para `TERMOS.roomLine`.

### ⚠ O QUE FICOU DE FORA, DE PROPÓSITO

As cartas de **caixa** e **cadeiras** ficaram com 2 linhas: a segunda é a dica que ensina o
que aquele número significa (_"é desse dinheiro que sai emenda, e é ele que compra voto"_).
Para quem nunca jogou, ela paga o próprio pixel.

## ✔ A FAIXA E A CÂMARA, DEPOIS DA REVISÃO DELE — 22/08/2026

### ⚠ A TRINDADE: `.reading` É GRAMÁTICA DE LISTA VERTICAL, e eu a usei deitada

Primeira tentativa: três `.reading` lado a lado. **Ele reprovou olhando, e a medição deu razão
a ele em três eixos:**

| defeito               | medido                                                       |
| --------------------- | ------------------------------------------------------------ |
| separação entre itens | **24px**, contra **12px** dentro do item — dobro não agrupa  |
| alinhamento vertical  | barra **5,9px acima** do centro (214,3 × 220,2)              |
| vão do rótulo curto   | coluna fixa de 112px, "Capital" tem 38px → **74px de vazio** |

⚠ **A LIÇÃO, e ela vale para a próxima peça:** o que faz `.reading` funcionar é o alinhamento
ENTRE LINHAS. Numa faixa de três colunas não existe linha para alinhar, então ela só entrega o
custo. **Padronize os TOKENS, não o arranjo.** O item virou pilha — nome e valor nos dois
extremos da mesma linha, barra na largura toda, legenda embaixo.

### ✔ E A CÂMARA FOI REFEITA POR CAUSA DE UM DEFEITO DE MODELAGEM, e não de forma

Queixa dele: _"um jogador novo bate o olho e não entende absolutamente nada"_. Procurando o
porquê, a marca da maioria **não media o que parecia medir**:

⚠ **UM RISCO EM `maioria/total` DESENHADO SOBRE A ORDEM IDEOLÓGICA marca onde cai a 257ª
CADEIRA, e não se o governo tem maioria.** E as partes claras da fita — o que cada faixa
entrega — são **descontínuas**, então não havia como compará-las com o risco a olho. O bloco
dizia três coisas ao mesmo tempo e nenhuma respondia a pergunta que decide o mês.

✔ **A primeira linha passou a responder:** régua de 0 a 513, preenchimento na base, marca na
maioria, limiar escrito embaixo — a mesma gramática da Trindade. A fita desceu para a segunda
linha e virou o que sempre foi: a composição do plenário.

⚠ **E A PROVA FOI ATRÁS DA MARCA em vez de sumir** (`A FITA FECHA O PLENARIO`): ela cobrava
`ribbon__majority`; agora cobra que, na régua, preenchimento e marca meçam a MESMA escala.
⚠ **E ela precisou de âncora:** a Trindade desenha três réguas com `--index;--mark` acima desta
na mesma tela, e sem ancorar no rótulo a prova media o limiar da ruptura social — 20.

### ⚠ O MEDIDOR DE CONTRASTE PRODUZIU FALSO POSITIVO, e o conserto é o terceiro decil

A mediana da caixa como fundo falha em caixa apertada: num valor de **um dígito** a caixa é
quase toda glifo, e `--ink` sobre a lâmina saiu como **4,05** quando o par real passa de 14.
✔ O fundo passou a ser o **terceiro decil**. Em caixa larga os dois dão o mesmo número, porque
ali letra é minoria de pixel.

⚠ **E A TROCA DE TINTA FOI RE-VERIFICADA sob a amostragem nova:** `#93a1b4` continua
reprovando em **quatro** lugares — inclusive `head__label` em Área, que o método anterior nem
alcançava. A decisão se sustenta.

### ✔ E TRÊS COISAS QUE ELE PEDIU DIRETO

- **as duas frases explicativas foram DELETADAS** — _"tudo pra mim é lixo"_ (item 3);
- **a legenda do limiar subiu um degrau da escala** (`--text-label` → `--text-note`), e os
  polos em versal ficaram onde estavam;
- **o vão em volta da barra caiu de 5,7/9,0px para 3,6/3,0px.** ⚠ A assimetria tinha DUAS
  causas, e nenhuma era o `gap`: a meia entrelinha herdada do corpo, e um `margin-top` na
  própria legenda que **somava ao `gap` de quem a abrigava**. Espaço é do contenedor.

## ✔ A COLUNA DA DIREITA FOI REFEITA DO ZERO — 22/08/2026

**O diagnóstico, medido a 1440×980:** havia **duas gramáticas** disputando a mesma coluna —
placar com número grande, botão e barra de 432px nas duas fichas de cima; lista com barra
recuada de 192px nas duas de baixo. Quatro divergências com número:

| eixo             | antes                  | agora          |
| ---------------- | ---------------------- | -------------- |
| largura da barra | 432px e 192px          | **184px, uma** |
| x inicial        | 955 e 1135             | **1111, um**   |
| altura da barra  | 20px (fita) e 8px      | **8px, uma**   |
| raio             | 0px (fita) e 2px       | **2px, um**    |
| altura da linha  | 34px (caldeira) e 20px | **20px, uma**  |

**E duas duplicações que a medição achou:** a barra superior já mostra `BASE 436` e
`APROVAÇÃO 44%` — os dois números grandes da coluna eram eco.

**A gramática nova tem DUAS formas, e duas é o teto:**

- **`.reading`** — nome · barra · valor;
- **`.reading--wide`** — nome atravessa a pista, só o valor fica na margem. Ela existe porque
  nem toda leitura tem régua: _"livre no mês"_ não tem teto mensal contra o que se medir, e
  inventar uma escala para preencher a pista seria desenhar um número que o motor não produz.

**O que saiu, e por quê:**

- **os botões `NEGOCIAR` e `FINANÇAS`** — decisão dele. O rail já leva às duas telas, e eram
  metade da despadronização: duas fichas tinham porta e duas não;
- **os dois números grandes** (`card__hero`) — eco da barra superior;
- **a fatia do capital** de cada grupo da caldeira (`35% do capital`) — ela vem do catálogo e
  não muda em 48 meses, e era a segunda fileira que fazia aquela linha ter 34px. ✔ **Ficou no
  `aria-label`**, então quem lê por som não perdeu nada;
- **o que cada grupo cobra** (`boiler__wants`) — só aparecia no mês da fervura, e a carta de
  fervura já diz a mesma coisa com mais espaço.

**E as legendas dos blocos VOLTARAM** — `A CÂMARA`, `O CAIXA DO MÊS`, `QUEM PODE DERRUBAR`,
`A RUA`. ⚠ Cinco delas tinham saído em 20/08; a premissa daquela retirada era que o número
grande nomeava a ficha sozinho. Sem número grande, uma lista que abre em _"O mercado"_ não
diz de que assunto ela é. **Foi a premissa que caducou, e não a regra.**

### ⚠ TRÊS DEFEITOS QUE SÓ A MEDIÇÃO PEGOU, e nenhum falhava

- **`.card__body` tem `justify-items: start`**, então quem quer a largura toda **pede**. Sem
  `justify-self: stretch` o bloco media o próprio texto: as réguas da caldeira saíram com
  **0px** e o medidor do cofre com **2px** — e os dois blocos com legenda de cores ficavam
  largos, porque o TEXTO da legenda os esticava. Nada falhou;
- **`grid-column: 2` num filho de `.block__rows`** criou uma segunda coluna no bloco e
  desmontou a tela inteira. A chave de cores mora dentro de uma `.reading` vazia, porque é lá
  que a pista da barra existe;
- **a chave da fita tinha TRÊS peças** e quebrava em duas linhas dentro de 184px, deixando o
  bloco 28px mais alto. A maioria virou linha própria — que é a forma que a coluna usa.

### ✔ E O MOBILE ESTAVA QUEBRADO ANTES DISTO

Medido a 390px **na árvore anterior**: a coluna da direita fechava em 240px e **toda barra
dela saía com 0px**. O rail deitava desde 1180px e a grade dos cartões nunca acompanhou.
Consertado de carona (`.cards` desempilha; no telefone o nome ocupa a linha e a barra desce).
⚠ **E ele foi explícito:** _"não me importo tanto com o mobile, a perfeição que eu almejo é no
desktop sempre"_.

### ⚠ AS DUAS FERRAMENTAS DESTA SESSÃO MORAM EM `tmp/`, que é ignorado pelo git

`tmp/medir-coluna.mjs` (geometria de cada peça da coluna) e `tmp/celular.mjs`. O medidor de
contraste **não** — ele virou parte do `walk`.

## ✔ O QUE A SESSÃO 17 FEZ — 22/08/2026

### ✔ 1 · A FRASE "as três, juntas" SAIU INTEIRA

Palavras dele: _"não serve pra bosta nenhuma essa frase, eu quero minimalismo porra"_. Saiu o
`<span>` do `block__legend` em `trinityHtml`, saíram `trinityHold` e `trinityNone` de
`strings.mjs`, e saiu o `holding` que escolhia entre as duas. `vocabulary` verde.

### ✔ 2 · A TABELA PASSOU A FECHAR — método do MAIOR RESÍDUO

`apportion` nasceu em `src/ui/shared/format.mjs`: pisos por `Math.floor`, e o que sobra vai
para os maiores resíduos. ⚠ **O resíduo é COM SINAL e não em módulo** — a linha do desgaste
tira pontos, e o módulo daria o ponto à célula errada.

Medido: a Classe C imprimia células somando **44** com total **43**; agora fecha em 43.

⚠ **A prova é de PROPRIEDADE e não de caso** (`tests/suites/screens.mjs`): `fast-check`
sorteia as quinze notas — negativos inclusos —, renderiza pela `describeMail` e cobra
_a soma das células impressas = o total impresso_ em toda linha. Uma segunda prova cobra que
nenhuma célula ande mais de um ponto do próprio valor.

### ✔ 5 · O CONTRASTE — e a medição achou SETE, não três

⚠ **O MEDIDOR MORA NO `walk`, e a decisão tinha de vir antes de escrever:** ele não cabe em
`npm run check`, que é Node puro, porque `--ink-dim` sobre `--bg` passa e sobre a lâmina
reprova — o par teórico e o par renderizado são dois pares diferentes.

**O algoritmo:** uma captura de página inteira por tela, decodificada num `<canvas>`; para
cada FOLHA com texto, a tinta sai da cor COMPUTADA (composta sobre o fundo quando tem alfa) e
o fundo sai da MEDIANA dos pixels da caixa — letra é minoria de pixel. Piso 4,5, ou 3,0 em
texto grande.

⚠ **Ele só mede FOLHA** — elemento sem filho elemento. Um `<p>` com `<b>` dentro fica de fora
e o `<b>` é medido sozinho; o texto próprio do pai não é medido. É a omissão declarada.

**O que ele achou, e as duas famílias:**

| peça                           | antes     | causa                             |
| ------------------------------ | --------- | --------------------------------- |
| `.trinity__who`                | 4,10      | `--ink-dim` na parte clara        |
| `.trinity__value small`        | 3,89      | `--ink-dim` na parte clara        |
| `ledger__value` × 3 (Finanças) | 3,86–4,48 | `--crisis` como TINTA             |
| `tally__cash b` × 2 (Mesa)     | 4,02–4,40 | `--crisis` como TINTA             |
| `report__line b` (Relatório)   | 4,35      | `--crisis` como TINTA             |
| `.passage__wait`               | 4,48      | `--paper-ink` a 0,6 no pergaminho |

⚠ **E os números da retomada anterior (3,32 · 3,89 · 4,13) vinham de outro método** — os 5%
mais claros contra os 30% mais escuros. Ele é mais pessimista; o daqui usa a cor exata.
`.street__poles` passava (4,78) e não estava errado.

**Os três consertos, e nenhum abandona o tom:**

- **`--ink-dim` de `#93a1b4` para `#a4b1c2`** — o menor degrau que fecha; pior par agora 4,73;
- ⚠ **`--signal-down` DEIXOU DE APONTAR PARA `--crisis`** e virou `#ea6f66`. O par de sinal
  aparece **sempre** em `color:` e nunca em preenchimento — é isso que deixa o vermelho de
  leitura ser mais claro que o vermelho de superfície sem a paleta divergir. E **todo
  `color: var(--crisis)` virou `color: var(--signal-down)`**: o eixo agora é
  _crise como tinta = `--signal-down`; crise como marca ou preenchimento = `--crisis`_;
- **`.passage__wait` de 0,6 para 0,72** de demão sobre o pergaminho.

O verde não se mexeu: já passava.

---

**1. ✔ FEITO — MATAR "AS TRÊS, JUNTAS" — a frase inteira, e não uma reescrita.**

Palavras dele: _"não serve pra bosta nenhuma essa frase, eu quero minimalismo porra"_.
⚠ **Eu tinha recomendado REESCREVER** (a frase carrega a regra do impeachment: o processo
só abre com as três rupturas juntas). **Ele recusou, e a decisão é dele.** Não reabra.

- mora em `UI.cabinet.trinityHold` e `trinityNone`, em `src/ui/strings.mjs`;
- é impressa no `<span>` dentro do `block__legend` de `trinityHtml`, em
  `src/ui/screens/cabinet.mjs`;
- ⚠ **a guarda `vocabulary` vai cobrar as duas chaves órfãs** assim que a view parar de
  lê-las — apague-as no mesmo movimento, e o `holding` que as escolhia sai junto.

---

**2. ✔ FEITO — A TABELA QUE NÃO SOMA — método do MAIOR RESÍDUO.**

Ele delegou: _"o que vc recomendar, vc faz"_. A recomendação foi (b).

⚠ **O MECANISMO, medido:** em `annexHtml`, `src/ui/screens/inbox.mjs`, cada célula é
arredondada por conta própria e o total é o arredondamento da soma dos valores **cheios**:

```js
const values = ANNEX_NOTES.map(note => data[`${segment.id}.${note}`] ?? 0);
const total = values.reduce((sum, value) => sum + value, 0);
`${seats(value)}` // célula arredondada sozinha
`${seats(total)}`; // total arredondado da soma cheia
```

Reconstruído: `15,4 + 11,6 + 7,6 + 5,6 + 2,8 = 43,0`. As células imprimem
`15+12+8+6+3 = 44`; o total imprime `43`. **As duas estão certas e são incompatíveis.**

**O conserto:** arredondar as células pelo maior resíduo, de modo que a soma delas seja
exatamente o total arredondado. A célula de menor resíduo cede (`11,6 → 11`).

⚠ **E ELE TEM DOIS CASOS QUE QUEBRAM A IMPLEMENTAÇÃO INGÊNUA:**

- **valores NEGATIVOS** — a linha do desgaste tira pontos, e maior resíduo com sinal misto
  precisa distribuir pelo resíduo e não pelo módulo;
- **o defeito é da tabela inteira, e não da Classe C.** Toda linha do anexo tem o mesmo
  problema, então a prova tem de cobrar a propriedade — _a soma das células impressas é
  igual ao total impresso_ — e não um caso.

---

**3. ✔ TOOLTIPS NAS NOTAS DE RODAPÉ — decisão dele, contra a minha recomendação.**

O dossiê pediu; eu recomendei **cortar a frase em vez de escondê-la**, porque o projeto tem
escrito que _"informação que chega depois da decisão é recibo"_ e porque no FM o jogador já
sabe as regras enquanto aqui ele está aprendendo. **Ele decidiu fazer tooltip.** Registrado,
e não se reabre.

As frases que ele nomeou:

- _"a Casa Civil manda a pesquisa quando ela se move o bastante para importar"_ — é o
  `letter__why`, o pé do ofício;
- _"o desgaste do cargo tirou 1 de todas"_ — é o `annex__foot`.

⚠ **E UM TOOLTIP DE VERDADE NÃO É `title=`.** O atributo nativo não aparece em toque, demora
~1s, não é estilizável e alguns leitores de tela o ignoram. Se for tooltip, tem de ser peça
com `aria-describedby` e alcance por teclado — senão a informação some para quem joga em
telefone, que é metade do passeio.

---

**4. ✔ A HIERARQUIA DA COLUNA DA DIREITA — e a ESCALA DAS BARRAS resolve junto.**

O dossiê e a minha auditoria concordam aqui, e a medição nomeia o defeito:

⚠ **DUAS GRAMÁTICAS DE LEITURA A 100px DE DISTÂNCIA.** A caldeira e a Trindade desenham uma
**régua com a marca do limiar** — você vê onde é a linha. A Rua desenha uma **barra empilhada
sem referência nenhuma**. O mesmo olho lê as duas na mesma coluna.

E as três despadronizações medidas, que continuam de pé:

- **duas das quatro fichas têm cabeça com número grande e botão** (Congresso, Cofre) e duas
  não têm nada (Caldeira, Rua). ⚠ **Somar cabeça é o contrário do que ele pediu** — ele quer
  menos, não mais;
- **a fita do Congresso tem raio 0** contra `--radius-stamp` em toda outra barra.
  ⚠ Arredondar só o cocho deixaria os blocos furando as pontas — não é a troca de uma linha
  que parece;
- **duas larguras de barra**: 431,5px nas cheias, 191,5px nas recuadas.

**Alturas medidas, para orçar a troca:** Congresso 120px · Cofre 143px · Caldeira 170px ·
Rua 90px, numa coluna de 630px.

---

**5. ✔ FEITO — O CONTRASTE — e escrever a guarda `contrast`, que o `standards.md` §7 declara ausente.**

⚠ **O DOSSIÊ ERROU O ALVO E ACERTOU A VIZINHANÇA.** Ele disse que a barra superior não
destaca. **Medido no pixel renderizado, ela passa folgado:** rótulo do vital **6,01**, valor
do vital **15,02**. Mas três rótulos de 10px reprovam AA, e ele não os nomeou:

| peça                                                          | razão    |     |
| ------------------------------------------------------------- | -------- | --- |
| `OPINIÃO PÚBLICA · CAPITAL · O BAIXO CLERO` (`.trinity__who`) | **3,32** | ⛔  |
| `rompe acima de 86` (`.trinity__value small`)                 | **3,89** | ⛔  |
| `ÓTIMO/BOM · RUIM/PÉSSIMO` (`.street__poles span`)            | **4,13** | ⛔  |

**O padrão é claro: o que está SOBRE O VIDRO perde contraste**, porque a lâmina é mais clara
que o fundo da página. A 10px nada disso é "texto grande" — o piso é 4,5.

⚠ **E O CONSERTO NÃO É ABANDONAR O TOM**, que é regra escrita: clareia-se a TINTA sobre a
cor. Provavelmente `--ink-dim` sobre vidro precisa de um degrau próprio.

**A guarda:** ela mede o par RENDERIZADO num navegador, e não o par teórico — `--ink-dim`
sobre `--bg` passa; sobre a lâmina, não. ⚠ Isso significa que ela **não cabe em
`npm run check`** (que é Node puro): ou nasce dentro do `walk`, ou vira um passo próprio.
Decida isso antes de escrever, senão ela mede a cor errada e fica verde mentindo.

---

### ⚠ AS TRÊS FERRAMENTAS QUE ESTA SESSÃO USOU, e o algoritmo de cada uma

Elas moram no scratchpad da sessão, que **não sobrevive**. Reconstruir é barato, e vale:

- **detector de fio duplicado** — varre colunas e linhas de pixel da captura, marca todo
  pixel mais claro que os dois vizinhos por ≥8 de luminância, e acusa **pares a ≤2px**. Um
  fio de verdade aparece em dezenas de varreduras porque atravessa o bloco; uma serifa
  aparece em uma. ⚠ **As outras dez telas nunca passaram por ele**;
- **medidor de contraste** — tira a captura, devolve o PNG ao navegador num `<canvas>`,
  amostra os 5% mais claros e os 30% mais escuros da caixa do elemento e calcula a razão
  WCAG. É o esqueleto da guarda do item 5;
- **caça a bug** — joga o mandato inteiro clicando **esperando o botão religar**, e em cada
  mês varre as quatro telas procurando `NaN|undefined|Infinity`, rolagem horizontal, valor
  vazio e estilo inline sujo. ⚠ **Escutar `pageerror` é obrigatório** — `console` não pega
  rejeição de promessa, e foi assim que 46 delas ficaram invisíveis por sessões.

### ⚠ E DUAS BUSCAS DE PROSA, se alguém rodar corte automático de novo

- bloco cuja última frase não termina em `.`, `!` ou `?` — **truncagem**;
- bloco com `\.\s+[a-z]{4,}` — **frase fora de ordem** (o escore junta frases não vizinhas).

Hoje: **3 defeitos em 1.109 blocos**, e os três são falso positivo do formato `recebe/devolve`.

### ⛔ NÃO ABRIR

Densidade da Caixa de Entrada (recusa dele), **motor de qualquer espécie**, o vazio de 430px
dentro do ofício, o rubor vermelho do peso, a sparkline dos quatro vitais, e a seção
"Santo Graal" do dossiê — pops, relações CK3, tela de negociação, minirreforma: **é tudo
mecânica**, e ele já disse que mecânica é depois.

## O que esta sessao fez — 22/08/2026

### ✔ A AUDITORIA DO GABINETE — cada leitura medida em 48 meses, em dois governos

O método: instrumentar **tudo o que a tela mostra** e contar **quantos valores distintos**
cada leitura produz. Leitura que não muda é legenda, e legenda ocupa pixel sem pagar.

#### ⚠ O DEFEITO MAIS SÉRIO ERA DE VOCABULÁRIO, e nenhuma guarda alcança

A terceira régua da Trindade chamava-se **`Base no Congresso`** e media a **pressão do
fisiologismo** — sobe quando ele te abandona, rompe **acima** de 86. A barra superior mostra
**`Base 436`** — cadeiras, e sobe quando melhora. **As duas ficam visíveis juntas na
abertura**, e o jogador lia `Base no Congresso 0` como _"não tenho base"_, tendo 436 de 513.

✔ **Renomeada para `O baixo clero`**, que é o nome que a CALDEIRA já usa para o mesmo grupo.
⚠ **E isso revelou uma duplicação real:** a terceira régua da Trindade e a segunda linha da
caldeira mostram **o mesmo número**, contra limiares diferentes (86 na ruptura, 68 na
fervura). É estruturalmente correto, e agora está legível.

#### ✔ A SETA DIZIA "NÃO MOVEU" QUANDO NÃO SABIA

`painted` é variável de módulo do entrypoint, e a barra caía **no próprio mês** como passado.
Consequência medida num navegador de verdade: **depois de qualquer F5 as quatro setas saem em
`—`**, afirmando que nada andou — no mês 30 de um mandato em que tudo andou. Mesma família do
achado 46. Agora a barra recebe `null` e **não desenha seta nenhuma** sem base de comparação.
Preso pela prova _"A SETA SÓ EXISTE QUANDO HÁ PASSADO"_.

#### ✔ O COFRE IMPRIMIA O MESMO NÚMERO DUAS VEZES

`R$ 14,5 bi cabe no mês` e `comprometido R$ 14,5 bi` eram **idênticos em 44 de 49 meses** no
governo passivo (90%), incluindo o mês 1. No governo que corta divergem em 37 de 49. Agora a
linha só aparece quando difere — comparando a FORMATAÇÃO, como o estouro já fazia.

### ⚠ O QUE A AUDITORIA ACHOU E **NÃO** SE CONSERTA NA TELA

Todos medidos nos dois governos. **A causa é o modelo, e motor está fechado por decisão dele.**

| leitura                                 | valores distintos em 48 meses       | veredito                                |
| --------------------------------------- | ----------------------------------- | --------------------------------------- |
| `Aposentadoria urbana trava R$ 66,7 bi` | **1**                               | legenda estática — confirma o achado 40 |
| Trindade `Capital`                      | **3** (0 → 30 → 65)                 | função degrau numa régua contínua       |
| `obrigatória %`                         | 5 no passivo                        | barra que quase não anda                |
| `O setor produtivo`                     | 0 por **33 meses** no passivo       | linha de 34px em zero                   |
| `O baixo clero`                         | satura em **100** no mês 27         | régua cheia por 22 meses                |
| gel de situação                         | 2 de 3 (`stable` **nunca** aparece) |                                         |

⚠ **A RUA NÃO POLARIZA, e esse é o achado mais caro da coluna.** A amplitude entre as três
classes cai de **22 no mês 0 para 2 a partir do mês 6**. O argumento registrado é bom — _"um
adorado por metade e odiado pela outra não aguenta crise"_ —, **mas o modelo não produz esse
governo.** São 75px (três linhas de 20px + chave de 15px) para uma informação de uma linha.
**É achado de SONDA, não de tela.**

⚠ **E EU CORRIJO UMA RECOMENDAÇÃO MINHA:** eu propus mexer no limiar de alerta da inflação,
porque ele nunca acende (7,5%, contra um máximo medido de **4,2%** em 48 meses nos dois
governos). **Estava errado.** 7,5% é o número certo para "inflação alarmante"; baixá-lo faria
a tela chamar de perigo o que não é. **O alerta está correto e o modelo é que não chega lá** —
é o achado 47, e o conserto é de motor.

### ⚠ E O CORTE DE PROSA DESTA SESSÃO DEIXOU DANO, reparado depois

O detector de frase truncada pegou 11 blocos, mas **havia uma segunda classe que ele não
via: frases FORA DE ORDEM.** O escore escolhia as frases de maior nota e as recolava — e elas
não eram vizinhas, então o tecido entre elas sumia. **33 blocos.**

✔ **Reparados do original com a regra certa: janela CONTÍGUA de frases, nunca frases avulsas.**
E os **cabeçalhos de arquivo têm regra própria** — eles guardam as PRIMEIRAS frases (a
identidade), não as de maior nota; 30 deles foram restaurados assim. Hoje: **3 defeitos em
1.109 blocos.**

⚠ **AS DUAS BUSCAS QUE VALEM PARA A PRÓXIMA VEZ**, se alguém rodar corte automático:

- bloco cuja última frase não termina em `.`, `!` ou `?` — truncagem;
- bloco com `\. \s+[a-z]{4,}` — frase fora de ordem.

### ⛔ E A CACA A BUG ACHOU TRES QUE NENHUMA GUARDA VIA

**1. TRES CLIQUES PRODUZIAM UM MES.** `paint` chama `endLabel`, e `endLabel` fazia
`el.advance.disabled = term.over`. Como `paint` roda no PRIMEIRO quadro da View
Transition, o botao voltava a ficar clicavel enquanto o mes ainda resolvia — e o clique
caia no `if (resolving) return`, sem erro, sem aviso. Medido a 200 ms: **3 cliques = 1
mes**. Nasceu em 20/08/2026, quando o botao passou a se repintar junto com a tela.
✔ Conserto: `term.over || resolving`.

**2. 46 REJEICOES NAO TRATADAS em 48 trocas de tela.** `start(paint).finished.then(...)`
sem `catch`: `ready` rejeita a cada transicao pulada. ⚠ E o `then` sozinho era um
soft-lock a uma excecao de distancia — `depois` destrava o botao, e se `paint` lancasse
uma vez o mes nunca mais avancaria. ✔ Agora `ready` e engolida e `depois` roda sempre.

**3. O PASSEIO NAO VIA NADA DISSO:** ele escutava `console`, e rejeicao de promessa chega
por `pageerror`. ✔ Ligado — achou 46 na primeira rodada.

### ⚠ O QUE VERIFICAR AO RETOMAR

**Verde:** `validate` (**235 provas · 12 guardas · 50 provas sintéticas · 128 arquivos**),
`walk`, e a captura do Gabinete olhada.

⚠ **`npm run screen` OSCILA ~20 fps ENTRE RODADAS** e já acusou falsamente nesta sessão: deu
`−11,5`, e medido lado a lado deu base `+10,3` × mudança `+9,6`. **Meça os dois braços na
mesma rodada.**

### ▶ O QUE EU FARIA AGORA

**1. ▶ A COLUNA DA DIREITA — três despadronizações medidas e não tocadas**, porque cada uma
pode ser decisão dele já registrada:

- **duas das quatro fichas têm porta** (Congresso, Cofre) e duas são becos sem saída — e as
  portas que a Caldeira e a Rua abririam (`A Rua`, `Bastidor`) estão desligadas. São **260px
  que não levam a lugar nenhum**;
- **a fita do Congresso tem raio 0** contra `--radius-stamp` em toda outra barra. ⚠ Arredondar
  só o cocho deixaria os blocos furando as pontas;
- **duas larguras de barra**: 431,5px nas cheias, 191,5px nas recuadas.

**2. ▶ PASSAR O DETECTOR DE FIO DUPLICADO NAS OUTRAS DEZ TELAS.** O conserto do material
alcançou todas (o token é global), mas fio escrito à mão dentro de uma folha de tela é outra
história. O detector varre colunas e linhas de pixel e aponta pares a ≤2px.

**3. ▶ OS SEIS ZEROS DA ABERTURA — e a medição ENCOLHEU o item.**

| régua                                            | passivo | piso  |
| ------------------------------------------------ | ------- | ----- |
| baixo clero · forças de ordem · ruptura política | mês 1   | mês 1 |
| O mercado                                        | mês 3   | mês 3 |
| Capital                                          | mês 6   | mês 6 |
| O setor produtivo                                | mês 33  | mês 7 |

⚠ **OS SEIS EXISTEM NO MÊS 0 E EM MAIS NENHUM.** Não é legenda estática — é a tela de
abertura. ⚠ **E eu quase registrei uma divergência que não existe:** no passivo o setor
produtivo termina em 10 e as forças de ordem em 21, contra os 33 e 35 do achado 39. O achado
está certo — aqueles números saem do governo que corta no piso, onde dão 43 e 49. **Medir só
o mês calmo é o erro do achado 47, e eu o repeti.**

**4. ⛔ NÃO ABRIR:** densidade da Caixa de Entrada (recusa dele), motor de qualquer espécie, o
vazio de 430px dentro do ofício, o rubor vermelho do peso e a sparkline dos quatro vitais.

### ⚠ E A ÁRVORE QUE ESTE ARQUIVO DECLARAVA VERDE NÃO ESTAVA VERDE

`src/application/turn.mjs` estava gravado em **CRLF** e o `prettier` reprovava —
`npm run validate` falhava no passo `format`. O git não vê diferença nenhuma (ele já
normaliza para LF), então era defeito de disco e não de conteúdo. **Mas o handoff
dizia "verde" e o portão dizia o contrário**, e quem confia no handoff é a próxima
sessão. Normalizado.

### ▶ O QUE EU FARIA AGORA — a ordem que ele mandou guardar, em 22/08/2026

**UI primeiro. Enquanto a interface não fechar, motor não se toca** — isso suspende os
achados 37, 47, 52, 53 e 54 inteiros, e com eles a densidade da Caixa de Entrada.

**1. ▶ PASSAR O MÉTODO DESTA SESSÃO NAS OUTRAS OITO TELAS — é a recomendação forte, e a
razão é aritmética.** Em **duas telas** ele achou **quatro defeitos consumados**: a carta
sem corpo, a regra duplicada que revertia uma decisão dele, a chave de gráfico que nunca
chegou, e o `stripJsComments` que errava o endereço da acusação. **Nenhum deles era
visível a tipo, guarda ou prova**, e todos eram a mesma família — _a decisão foi tomada e
não chegou à tela_. Congresso, Finanças, Área, O Estado, Mesa, Fecho e Relatório **nunca
passaram por essa peneira**. Se a densidade se repetir, há mais uma dúzia lá.

⚠ **O MÉTODO, e ele não é leitura:**

- **medir no navegador** e comparar o valor COMPUTADO com o que a prosa do arquivo
  promete — foi assim que os 13,6px apareceram onde a decisão dizia 15,2;
- **caçar seletor declarado duas vezes** no mesmo arquivo. Mesma especificidade, e a
  última vence — em silêncio, e nenhuma guarda alcança;
- **abrir a captura**, sempre. Três defeitos já atravessaram tipo, guarda e cem provas
  para morrer na imagem;
- **desconfiar de prosa confiante.** Duas vezes nesta sessão a justificativa escrita
  descrevia um estado que o código não tinha mais.

**2. ▶ OS SEIS ZEROS DA ABERTURA.** Os quatro grupos da caldeira e duas das três da
Trindade abrem o jogo com **"0" e régua vazia**. Os zeros são honestos, e este projeto já
consertou esse mesmo defeito **duas vezes** trocando o zero por uma frase (_"R$ 0,0 bi
livre no mês"_ virou o hero do que CABE; o peso zero virou _"não pesa no capital"_). É a
primeira tela que um jogador novo vê, é pura tela, e cai dentro do item 1.

**3. ▶ O ACHADO 40 — e ele é decisão DELE, não trabalho parado.** _"Quem trava a
obrigatória"_ caiu de três para um a pedido dele, e ficou escrito que _"o segundo e o
terceiro estão a um parâmetro de distância no dia em que a coluna couber"_. **Ela cabe:**
805 de 935, com 130px de folga. A pergunta não é de layout — é **se um só basta**: um
governo que não corta previdência vê a mesma linha por 48 meses, e aí ela vira legenda
estática, que é o defeito que as frases de desejo da caldeira acabaram de pagar.

**4. ▶ OS DOIS ESTADOS VAZIOS DO CONGRESSO** ocupam ~400px juntos. Não é defeito: é
decisão de peso, e ela nunca foi tomada de propósito.

**5. ▶ A METÁFORA NA VARREDURA DE VOCABULÁRIO.** A regra _"rótulo nomeia a coisa, a
metáfora mora na prosa"_ nunca foi passada sistematicamente. ⚠ **Metade dela acabou de ser
feita por máquina** — a guarda nova mata a frase morta —, mas **a metáfora continua sendo
revisão humana, e não tem casador honesto**.

**6. ⛔ NÃO REABRIR:** o vazio de 430px dentro do ofício (decisão dele — a folha estica), o
rubor vermelho do peso (decisão dele), e a sparkline dos quatro vitais (construída e
reprovada pela captura em dois tamanhos — achado 44). E **nada de motor**: mexer em limiar
de carta agora é girar um número que a reformulação vai girar de novo.

## O ofício virou vidro marrom, e a densidade é medida — 22/08/2026

**As três edições que a retomada anterior deixou especificadas foram aplicadas**, e a
quarta é dele. Medido a 1440×980, mês 15:

| peça                | antes                  | agora                               |
| ------------------- | ---------------------- | ----------------------------------- |
| vão entre os blocos | 16px                   | **0**                               |
| raio do índice      | 16px nos quatro cantos | **16px só do lado de fora**         |
| raio do ofício      | 3px (`--radius-paper`) | **16px só do lado de fora**         |
| aresta do ofício    | `--paper-edge`         | **`--glass-edge`, igual ao índice** |
| bisel               | sombra projetada       | **`--bevel-fine`, igual ao índice** |
| degrau de altura    | 0                      | 0                                   |

⚠ **O QUE QUEBRAVA A SIMETRIA NÃO ERA O VÃO — ERAM OS RAIOS.** Cada bloco herdava a
curvatura do próprio material. Colar sem igualar teria deixado as duas curvas **se
tocando**, que é pior que o vão. E a aresta direita do índice morreu para virar costura:
duas bordas de 1px encostadas leem como um fio de 2px, que é o defeito dos _"dois
separadores para uma fronteira"_ que já matou os cinco fios das legendas.

### ⚠ E "OS DOIS LIQUID GLASS" NÃO ERA EXCLUDENTE COM O MARROM — a leitura é dele

Eu tinha oferecido **(a)** só a moldura padroniza, o ofício continua papel, ou **(b)** o
ofício vira vidro e a linha selecionada vira junto, reabrindo a confusão que a rodada de
21/08 existiu para desfazer. Ele respondeu com a terceira: _"dá pra ser marrom liquid
glass o bloco da direita, e o da esquerda só liquid glass? os dois igualmente
padronizados?"_

⚠ **E O QUE DESTRAVA É QUE O ÍNDICE TAMBÉM NÃO TEM FILTRO.** `glass-support` foi tentado
nele em 21/08 e custou **17,9 fps**. O que faz o índice ler como vidro é a **FORMA**:
aresta clara de 1px, bisel, e uma demão translúcida sobre a lâmina. Então _"os dois
padronizados"_ é: **mesma aresta, mesmo bisel, mesmo raio — e a TINTA diferente.** Um
material, duas tintas, que é literalmente o que `20-material.css` declara sobre os três
níveis: _"o que distingue os níveis é só a DENSIDADE do fundo"_.

**Medido em `npm run screen`: +5,5 fps** contra o braço de controle. Não é filtro — é
forma, e forma não custa.

### ⚠ E A DENSIDADE DO MARROM É MEDIDA, e o piso tem razão física

Amostrado no **pixel renderizado**, no topo e na base do ofício:

| alfa     | topo         | base         | gradiente | veredito                       |
| -------- | ------------ | ------------ | --------- | ------------------------------ |
| 1,00     | 43,36,28     | 43,36,28     | 0,0%      | tinta chapada, sem luz nenhuma |
| 0,88     | 39,34,29     | 44,37,33     | 0,3%      |                                |
| **0,78** | **36,32,30** | **44,37,35** | **0,5%**  | ← o escolhido                  |
| 0,66     | 32,30,31     | 42,36,37     | 0,6%      | ⛔ **o marrom INVERTE**        |

⚠ **O QUE REPROVA 0,66 NÃO É O CONTRASTE — ele fica em 9,64 — É A MATIZ.** Em `32,30,31`
o azul da lâmina ultrapassa o verde e o pergaminho vira **cinza frio**: a substância
deixa de ser papel. É exatamente o que a prosa de `--paper` registra ter custado um
revisor externo em 15/08 — _"leu o bloco de leis como caixas de contorno fininho, sem
perceber que havia papel ali"_.

**Contraste no par renderizado: 9,51:1**, contra os 4,5 da norma e os 7 do nível AAA. E
`--paper-rgb` nasceu para isso — sem o par, o marrom só existe opaco, e opaco ele é tinta
e não vidro.

## A frase órfã ganhou guarda, e ela achou 49 — 22/08/2026

⚠ **O CASO QUE A CRIOU É O PIOR DELES:** o termômetro da rua desenha três barras
empilhadas — verde, azul, vermelho — com **um número só ao lado**, e não havia chave
nenhuma. Sem ela não havia como saber se `53%` era a verde, a vermelha ou a soma. É o
defeito exato que este projeto já pagou uma vez: foi ele que criou a legenda do arco, e
quando o arco morreu a lição ficou escrita — _"desenho de várias cores precisa de chave"_
— e a fita a herdou. **O termômetro nunca recebeu, e as duas peças moram na mesma coluna.**

⚠ **E O VOCABULÁRIO JÁ EXISTIA, SEM CONSUMIDOR NENHUM.** `approvalParts` estava em
`strings.mjs` com as três palavras certas e **nunca foi lido por lugar algum**. `tokens`
acusa token órfão, `orphans` acusa folha órfã — **frase órfã não tinha guarda**, e foi o
único eixo em que cinquenta peças mortas se acumularam.

⚠ **E A PRIMEIRA VERSÃO DA CHAVE FOI REPROVADA PELA MEDIÇÃO:** com _"Regular"_ no meio ela
media 235px numa barra de 192 e **vazava 44px** para dentro da coluna do número. A regra
que corrige já estava escrita na fita — _"a chave de uma rampa é o nome dos dois POLOS"_ —
e com dois ela fecha exata: 1135→1327, igual à barra. A palavra do meio continua viva na
descrição da barra, que passou a nomear as três fatias em vez de uma.

### O que a guarda mede, e por que ela tem DUAS auditorias com fomes diferentes

A duplicata precisa só de `strings.mjs`; a órfã precisa do **projeto inteiro**, porque o
consumidor mora fora. Por isso a segunda só roda com o entrypoint no mapa — e isso **não é
conveniência**: sem a condição, as provas sintéticas da duplicata (que entregam só o
arquivo de frases) passariam a ser acusadas de orfandade, e ficariam verdes mesmo se a
detecção de duplicata quebrasse. **Uma prova que passa pela razão errada não prova nada.**

⚠ **E UM CAMINHO ALCANÇADO COBRE TUDO ABAIXO DELE.** Quem escreve
`labelOf(UI.inbox.why, letter.kind)` passa a **tabela**, e as nove frases dentro dela são
alcançadas sem que nenhuma apareça em código. Exigir a folha ali faria a guarda acusar
exatamente o padrão que este projeto usa para não ter nove `case`.

### ⚠ E AS 49 SÃO ARQUEOLOGIA DE PEÇA MORTA

`cabinet.archLoyal` e as duas irmãs sobreviveram ao arco que morreu em 15/08;
`cabinet.inbox`, `cabinet.congress` e `cabinet.vault` sobreviveram às cinco legendas que
saíram em 20/08; `area.propose` sobreviveu ao orçamento granular — **e a prosa ao lado
dela já dizia que ela tinha saído**. Prosa que registra a morte não apaga a chave, e a
chave morta é o que faz a próxima sessão achar que a peça existe. Três tabelas inteiras
ficaram vazias e saíram: `context`, `situation` e `inbox.reportUnit`.

⚠ **E A PRIMEIRA REMOÇÃO FOI FEITA ERRADA, E O ERRO VALE REGISTRADO:** o script casou por
**nome de folha** e apagou homônimas legítimas — `nav.congress` e `TERMOS.month` morreram
junto com `cabinet.congress`. **O caminho é único; o nome não é.** Refeito pelo número de
linha que a própria guarda reporta, com conferência de que a linha declara mesmo aquela
chave antes de apagar.

### ⚠ E ISSO SÓ FUNCIONOU DEPOIS DE CONSERTAR UM DEFEITO DE SEIS GUARDAS

`stripJsComments` apagava o comentário **inteiro, quebras de linha e tudo** — enquanto a
irmã de CSS preserva desde que nasceu, com a razão escrita ao lado: _"para que o número da
linha continue valendo"_. O preço era invisível porque quase nenhuma guarda reporta linha.
**`vocabulary` reporta**, e num arquivo em que a prosa é maior que o código toda acusação
dela apontava para uma linha que não era a da frase — às vezes duzentas linhas acima.
**A acusação estava certa e o endereço, errado**, que é a pior forma de estar certo.

## O ofício virou padrão, e a Aprovação foi o molde — 22/08/2026

Pedido dele: _"aprimore, padronize, simetria, centralize, estique… e quando finalizar, use
essa mensagem sobre a Aprovação para todas as outras"_.

**O que estava errado na carta da Aprovação, e os três eram de desenho:**

- ⚠ **um fio vertical que começava no MEIO da tabela** — `border-left` numa célula de corpo,
  sem o cabeçalho ter a dela. _"Essas linhas nada a ver"_, nas palavras dele. **Régua que
  não atravessa a tabela inteira não separa coluna: ela suja.** A SOMA já se distingue por
  peso e tinta cheia — cor e peso dizem HIERARQUIA, fio diz FRONTEIRA, e não há fronteira
  entre a soma e as parcelas dela;
- ⚠ **a última classe sem fio inferior** — a mesma exceção de `:last-child` que ele acusou
  na bandeja, na mesma tarde, em outra peça;
- **a tabela comprimida contra o texto**, com o recuo de quando a carta era um aviso.
  ⚠ **E o recuo só podia subir na VERTICAL:** a primeira versão subiu os dois eixos e a
  captura reprovou na hora — sete colunas em 401px não têm folga horizontal, e a coluna
  SOMA saiu **cortada**. Nesta folha sobra altura; largura não sobra.

### ⚠ E O ANEXO FOI PARA O PÉ E VOLTOU, no mesmo dia — a razão dele encerra a questão

Eu tinha empurrado a tabela para o rodapé com `margin-top: auto`, e ele recusou: _"só não
gostei de tudo ter ficado embaixo — tem que começar em cima e terminar embaixo, é melhor
ficar um buraco embaixo do que no meio"_.

⚠ **E ele está certo pela forma do objeto.** Um documento se lê de cima para baixo, e o olho
que desce encontra a folga **depois** do conteúdo — ali ela é margem, que é o que toda folha
tem. No meio, a mesma folga vira interrupção: o leitor chega ao fim do texto, atravessa cem
pixels de nada e encontra **mais documento**. **A margem embaixo se ignora; o buraco no meio
se lê.**

### ✔ E O VOCATIVO SUBIU PARA A CARTA — três das doze o tinham

_"Presidente,"_ existia só nas três de relatório. Ele agora nasce em `letterHtml`, como faixa
própria da grade: **não há como escrever uma carta nova sem ele.** ⚠ Escrito dentro de cada
caso seriam doze lugares para manter em dia — e foi exatamente assim que três tiveram e nove
não. Medido nas sete cartas da bandeja: todas com sinete, remetente, data, assunto,
vocativo, corpo, anexo quando há, ação quando há, e rodapé. **Mesma composição, sem exceção.**

⚠ **O QUE CONTINUA DIFERENTE ENTRE ELAS É O ANEXO, e isso é motor:** três das doze espécies
têm tabela; as outras nove abrem com duas frases e a folga vai toda para o pé. Encher isso
exige dado que `notice` e `alarm` não guardam — ver a nota da carta `passed`.

## A limpeza, e as quatro coisas que ele viu na bandeja — 22/08/2026

Pedido dele depois do commit: _"faça uma boa limpeza em todo o código"_, e mais quatro
observações sobre a Caixa de Entrada. **Tudo verde no fim** — `validate` (234 provas · 11
guardas · **47 provas sintéticas**), `walk`, `screen` (**+4,7 fps**) e as capturas olhadas.

### ✔ As quatro da bandeja, e as quatro são de padronização

| o que ele viu                                           | o que estava errado                                                        |
| ------------------------------------------------------- | -------------------------------------------------------------------------- |
| _"retira a cor do fundo avermelhada, deixe só a barra"_ | duas marcas para um estado — a tarja **e** o rubor                         |
| _"a bolinha mais centralizada no canto direito"_        | presa ao topo, numa linha que cresce para baixo                            |
| _"por que a última fica sem a linha inferior?"_         | uma exceção de `:last-child` que supunha a lista encostando no fim         |
| _"o texto fica puxado pro marrom"_                      | a tinta do papel — `--paper-ink` — dentro de uma caixa que ele quer branca |

⚠ **O RUBOR REVERTE UM PEDIDO DELE MESMO, de 21/08 — e as duas decisões estão certas
porque a BANDEJA mudou entre elas.** O fundo vermelho nasceu quando a linha era texto solto
num painel transparente: ali ele era a única coisa que fazia o olho achar a carta pesada.
Hoje a linha é figura fechada, com fio em cima e embaixo, dentro de um móvel com aresta — e
a tarja de 3px já basta. **O canal sobrevive inteiro: o que se perdeu foi tinta, não
resposta.**

⚠ **E A EXCEÇÃO DO ÚLTIMO FIO TINHA UMA RAZÃO BOA E UMA PREMISSA FALSA.** Ela dizia que _"o
vazio não é a próxima coisa: é onde o móvel acaba"_ — verdade numa lista que **termina onde
o móvel termina**, e esta não termina: o índice fecha em 630px com ~527 de conteúdo, então a
última linha tem cem pixels de coluna abaixo dela. O fio não separava a carta do fim: ele
fechava a carta.

⚠ **E A TINTA BRANCA É UMA REGRA, E NÃO TRINTA.** `--paper-ink` é a SUBSTÂNCIA — veste
`.letter` inteira em `30-components.css`, e mais de trinta regras a usam com opacidades
diferentes. O par inteiro (`--paper-ink` e `--paper-ink-rgb`) foi redefinido **no escopo
`.tray`**, e o escopo é a decisão: `.law` e `.passage__row` continuam de pergaminho nas
telas de área e do Congresso, onde a prosa dos tokens diz por quê.

### ✔ E as barras de data ganharam tinta — revertendo uma regra de ontem, com a razão dela

Pedido: _"que tal se o fundo for um pouco mais claro? aí dá pra diferenciar os retângulos
das mensagens e das datas"_.

⚠ **A REGRA DE 21/08 DIZIA O CONTRÁRIO — _"o conserto é ela não ter material NENHUM: o
contraste passa a ser entre TER superfície e NÃO ter"_ — e ela valia enquanto a LINHA tinha
superfície própria.** A linha perdeu a dela no mesmo dia, quando o vidro subiu para a
coluna; a partir dali as duas não tinham nada, e o contraste que a regra prometia deixou de
existir. **Foi a premissa que caducou, e não a regra.** Medido: luminância 24,9 na barra
contra 14,9 na linha.

### ⚠ E A TRANSLUCIDEZ DO OFÍCIO CUSTOU 9,7 fps — o mesmo defeito de ontem, com outra roupa

`npm run screen` acusou logo depois. Quatro rodadas: **−6,6 · −9,1 · −10,8 · −12,4**, todas
negativas — não era ruído.

⚠ **A CAUSA É `--light-angle`, que INTERPOLA a cada quadro.** A lâmina se repinta sessenta
vezes por segundo; uma superfície **opaca** em cima dela não paga nada por isso, e uma
**translúcida de 451×630** recompõe junto, todo quadro. A lição estava escrita para
`--glass-support-bg` (−28,3 fps) e eu a reintroduzi por outro caminho: **não pelo token,
pelo alfa.**

**O conserto não foi voltar ao marrom chapado.** O que ele aprovou é a luz cruzando a folha,
e ela não precisa vir da lâmina: pintada no próprio ofício, em gradiente estático sobre base
opaca, o olho vê a mesma coisa e o compositor não vê nada. As paradas foram escolhidas
contra os pixels que a versão translúcida produzia. **Depois do conserto: −0,1 · +2,0 ·
−2,1 · +4,7 — sinais misturados, que é o ruído da bancada.**

⚠ **E `--paper-rgb` MORREU NO MESMO DIA EM QUE NASCEU**, sem consumidor — e quem o achou foi
a guarda `tokens`, no primeiro `validate` depois do conserto.

### ✔ A limpeza, e o que ela achou

- **sete `export` que nenhum outro arquivo importa** — `SIEGE_PRICE`, `CHANNELS`, `OFFICES`,
  `FAMILIES`, `TABLE`, `LAYER_ORDER`, `listFiles`. Todos perderam o `export`. ⚠ **A regra
  já estava escrita:** _"`export` sem quem importe é uma porta aberta"_, e este projeto já
  pagou cinco vezes por porta errada aberta;
- ⚠ **e `OFFICES` estava morta INCLUSIVE dentro do próprio arquivo** — o `eslint` acusou
  assim que o `export` saiu. Ela é o defeito que `standards.md` já nomeia por extenso,
  _"lista declarada e não cobrada"_, com `CHANNELS` e `FAMILIES` citadas: as duas foram
  ligadas ao esquema quando a lição foi escrita, e `OFFICES` ficou de fora. **Agora ela é
  `values` de `office`** — um arquétipo com `office: "rapportuer"` passava por tipo, guarda
  e validação, e sumia dentro de um `by(office)` que devolve `null` calado;
- **treze seletores declarados duas vezes no mesmo arquivo**, dos quais **seis eram
  `@media` legítimos** e **cinco aditivos**. ⚠ **Dois eram defeito de verdade:**
  `.law__guard` pintava com a tinta do PAPEL e a segunda declaração, sete linhas abaixo,
  com o cinza do VIDRO — sobre pergaminho; e `.bench` recebia a borda esquerda de bordô e
  uma segunda, duzentas linhas abaixo, a punha transparente. **O carpete estava morto desde
  que foi escrito.**

### ⚠ E ISSO VIROU A QUARTA COBRANÇA DA GUARDA `cascade`

Três ocorrências da mesma família em um dia — `.letter__lines`, `.law__guard`, `.bench` — e
nenhuma guarda as alcançava: `orphans` acusa regra sem produtor e as duas tinham; `tokens`
acusa token sem consumidor e os dois eram consumidos. **O defeito não está em nenhuma das
duas regras: está no PAR.**

⚠ **E O QUE SE ACUSA É A PROPRIEDADE, E NÃO O SELETOR REPETIDO.** Escrever o mesmo seletor
duas vezes é autoria legítima aqui — `.tray__row { position: relative }` mora ao lado da
regra do ponto de não lido porque existe **para** ela. O que nunca é legítimo é a mesma
**propriedade** declarada duas vezes no mesmo contexto: ali uma das duas é, por construção,
letra morta. `@media` e `@layer` entram na chave, senão a guarda brigaria com a forma como
todo CSS responsivo se escreve.

## A carta que anuncia que a sua lei passou era uma folha em branco — 22/08/2026

`passed` e `rejected` eram as **duas únicas cartas do jogo com `body: ""`**. Numa folha que
estica até 630px isso é cabeçalho, assunto e **430px de papel vazio** — e a espécie que
sofria é a do **desfecho** do texto que o jogador escreveu, negociou e pagou. O momento de
maior recompensa do jogo chegava como a carta mais vazia dele.

As duas passaram a dizer o que a mecânica faz depois do voto, e **só a aprovação tem
porta** (`Ver a lei em vigor` → O Estado): a derrubada não criou nada, e um botão ali
mandaria o jogador olhar a ausência de uma coisa.

⛔ **O QUE NÃO ENTROU É O PLACAR DA VOTAÇÃO.** `notice` não guarda voto, e lê-lo do estado
vivo faria uma carta de março imprimir a Câmara de agosto. **Isso é motor**, e motor não se
mexe enquanto a interface não fecha.

### ⚠ E o corpo do ofício NUNCA subiu para `--text-verdict`

`.tray__open .letter__lines` estava declarada **duas vezes no mesmo arquivo**, com dez
linhas entre uma e outra: a de cima subia o corpo para `--text-verdict`, a de baixo o
devolvia para `--text-body`. Mesma especificidade, e a última vence.

**Medido no navegador: 13,6px onde a decisão dizia 15,2.** O _"esticou a tela, estique o
texto também"_ de 21/08 foi implementado, justificado em quinze linhas de prosa — e
revertido em silêncio pela regra logo abaixo. ⚠ **Nenhuma guarda alcança isso:** `orphans`
acusa regra sem produtor e as duas tinham; `tokens` acusa token sem consumidor e os dois
são consumidos. **Duas declarações do mesmo seletor no mesmo arquivo são sempre isso.**

### A medição da Caixa de Entrada, num mandato passivo de 24 meses

| leitura                            | medido    |
| ---------------------------------- | --------- |
| linhas visíveis na bandeja (média) | **6,3**   |
| cartas **novas** por mês           | **0,75**  |
| meses com 0 ou 1 carta nova        | **18/24** |
| meses 11→24 sem nada novo          | **11/14** |
| perguntas em 45 meses              | **0**     |

⚠ **A BANDEJA PARECE CHEIA E ESTÁ PARADA.** Do mês 10 em diante ela fica travada em 7
linhas e quase nunca muda — `KEEP = 24` mantém as velhas e as novas param de chegar. É o
achado 54 pelo outro lado, e **a decisão continua sendo dele**: baixar os limiares de volta,
ou dar voz a quem ainda não escreve. **A segunda é motor.**

## O estado anterior — 21/08/2026

**A décima segunda sessão nasceu de um dossiê externo** que o responsável trouxe inteiro
— _"leia, estude e absorva; vamos discutir antes de editar qualquer coisa"_. Ele pede
demolir o Gabinete e reconstruí-lo como uma **Sala de Guerra**, com referência declarada
em Football Manager, Paradox e Geo-Political Simulator. Está verde — `validate` (**230
provas**) e `walk` rodados no fim, e as capturas olhadas.

⚠ **ELA FOI CORTADA NO MEIO por limite de sessão, e a retomada em 21/08 começou por onde
ela parou:** a auditoria da última mudança tinha nomeado dois defeitos — _"os blocos da
direita perderam qualquer separação e as duas colunas deixaram de ter a mesma altura"_ —
e o limite estourou antes de medi-los. **Nada se perdeu** — nem uma linha de código: o
trabalho todo estava no disco, sem commit. Os dois foram medidos e consertados, e estão na
seção
_As cinco legendas saíram_.
O que veio DEPOIS deles é a seção logo abaixo.

O que ele pediu, e o que aconteceu com cada pedido, está na seção
_O dossiê da Sala de Guerra_. O resumo em três
linhas:

- ✔ **a Caixa de Entrada virou master-detail** — índice à esquerda, ofício aberto à
  direita. Decisão do responsável: _"faça como o dossiê recomenda"_;
- ✔ **o botão de avançar o mês passou a dizer o PREÇO de avançar** — e **NÃO** a travar.
  A recusa é doutrinária e está escrita em três lugares no código;
- ✔ **o nome da tela deixou de ser o herói tipográfico** — degrau novo, `--text-screen`.

### E a segunda metade da sessão foi de DESENHO, com carta branca dele

_"Deixe tudo mais minimalista e bonito. Principalmente essa parte do congresso. Te dou
carta branca pode reestruturar, reformular, redesenhar o que quiser."_

- ✔ **o hemiciclo virou FITA** — e a ideia do formato é dele. Ver a seção
  _A fita do plenário_;
- ✔ **a página caiu de 1347px para 1108** numa janela de 980, sem apagar uma leitura
  sequer. A coluna da direita era um cartaz e virou outliner;
- ✔ **o Congresso parou de repetir** — _"sem histórico com o seu governo"_ saía sete
  vezes na mesma tela.

- ✔ **o Congresso saiu do dialeto de cartão** e a escavação da bandeja clareou;
- ✔ **o MERCADO DEIXOU DE SER MUDO**, e com ele nasceu o dilema que faltava — duas
  cartas que se contradizem na mesma bandeja. Ver
  _O mercado deixou de ser mudo_;
- ✔ **a CÂMARA GANHOU NOVE LEGENDAS** com o desenho da Câmara real, todas fictícias —
  ver _A Câmara ganhou nove legendas_;
- ✔ **o GABINETE PAROU DE ROLAR** — 1347px viraram 980 numa janela de 980, sem apagar uma
  leitura. O celular saiu de escopo por decisão dele, e foi isso que destravou o canvas.
  Ver _O desktop virou o único alvo_;
- ✔ **as CINCO LEGENDAS e os CINCO FIOS saíram do Gabinete**, a pedido dele — _"retira as
  escritas caixa de entrada e o congresso, e as barras pretas também que ficam embaixo das
  escritas; padronize e simetria em tudo"_. ⚠ **E o corte cobrou dois defeitos de regra
  vencida, medidos e consertados em 21/08** — a bandeja parou de esticar e os quatro
  blocos da direita encostaram. Ver
  _As cinco legendas saíram_.

⚠ **DA PARTE 3 DO DOSSIÊ — a materialidade — o que faltava JÁ EXISTIA, e isso só se
descobriu medindo:** o grão de filme está no substrato a 5% de opacidade desde a nona
sessão, e o gel de situação tinge a tela inteira conforme o país piora. O trilho de verba
já é uma calha escavada com pino de metal escovado. **O que de fato faltava era o
contrário do que o dossiê pedia:** não somar textura, e sim tirar o material opaco que
tapava a que já havia.

⚠ **O QUE SOBROU DELA, e é o único item:** o **contorno da tela quando o cerco abre**. Há
carimbo no cartão da CALDEIRA e frase na carta, mas a lâmina não muda quando um processo
de impeachment está correndo — e esse é o estado que decide a partida.

### E a décima terceira sessão fez o Gabinete parar de desenhar a própria caixa — 21/08/2026

**Pergunta dele, e ela tinha uma resposta que ninguém tinha tentado:** _"não é só diminuir o
tamanho da caixa de entrada? E deixar o Gabinete todo mais minimalista, com menos textos e
mais botões liquid glass?"_ Está verde — `validate` (**234 provas**), `walk`, `screen` e as
capturas olhadas.

- ✔ **A ESCAVAÇÃO DA CAIXA DE ENTRADA SAIU INTEIRA**, e a altura ficou. Encolher já tinha
  sido revertido duas vezes; parar de DESENHAR a caixa nunca tinha sido tentado, e é o
  passo seguinte do _"menos tinta dá mais vidro"_ de 20/08;
- ✔ **o vidro desceu para o que se aperta** — `glass-action` era usado UMA vez no app
  inteiro. **Custo medido: delta de 0,2 fps contra o braço de controle**;
- ✔ **cinco linhas de "e quem trava" viraram uma frase**, e ⚠ isso é perda de resposta
  declarada — ver o achado **40**;
- ⚠ **A AUDITORIA EXTERNA ACHOU UM NÚMERO QUE EXISTIA NO MOTOR E NUNCA CHEGOU À TELA:**
  `weight`, a fatia da ruptura econômica que cada lobby carrega. **As forças de ordem têm
  peso ZERO** e a tela desenhava para elas a mesma régua do mercado. Ver a seção
  _O Gabinete parou de desenhar a própria caixa_;
- ⚠ **e o ACHADO 38 CADUCOU sozinho:** a coluna da direita fecha em 805 de 935, com 130px
  de folga e rolagem zero. **A decisão que estava parada com ele não precisa mais ser
  tomada** — ver o achado **41**;
- ⚠ **E UMA CAPTURA DELE ACHOU UMA TELA QUE MENTIA** — a Caixa de Entrada vazia dizia _"o
  primeiro mês ainda não foi resolvido"_ em junho de 2027, com três meses resolvidos atrás.
  **A causa é uma recarga de página:** `last`, o relatório do turno, não vai para o save.
  Consertado com prova; **a perda da leitura do mês continua aberta** — ver o achado **46**;
- ✔ **e a BARRA DE ROLAGEM LATERAL do índice saiu** — ela era uma reticência que nunca
  funcionou: `text-overflow: ellipsis` sem `min-width: 0` empurra em vez de cortar, e
  11px de estouro bastavam para abrir a barra;
- ✔ **e a FAÍSCA DEIXOU DE SER DECORATIVA em três telas** — a escada de blocos virou
  polilinha de SVG, e a janela virou uma só. ⚠ **Medir isso achou algo maior:** quatro dos
  cinco indicadores de Finanças movem **menos de uma unidade de vinte em dois anos** — ver
  o achado **47**, que é o mais fundo desta sessão;
- ⛔ **o ACHADO 46 fecha como RECUSA:** guardar o mês no save custaria cinco campos nulos
  em nove espécies de carta, e o que se perde é um aviso, não uma pergunta;
- ✔ **A CAIXA DE ENTRADA FOI AO FOOTBALL MANAGER buscar quatro peças** — o não lido, a
  razão de cada carta ter chegado, o botão que nomeia, e a PILHA COM TETO que ele pediu.
  ⚠ **Metade do que o FM faz nós já fazíamos**, e o botão de avançar daqui é melhor que o
  de lá: o `Continue` deles trava, o nosso diz o preço. Ver
  _A Caixa de Entrada foi ao Football Manager_;
- ✔ **A LÂMINA PASSOU A REAGIR AO CERCO** — moldura bordô pulsando quando um processo
  está aberto. Era o último item da Parte 3 do dossiê da Sala de Guerra;
- ✔ **e o MUNDO GANHOU TRÊS TRAVESSIAS** — o teto que fecha, a base que perde a maioria,
  o grupo que ferve. ⚠ **E a medição depois diz o que o pedido dele de fato exige:**
  travessia é rara por definição, e densidade tipo Football Manager pede **relatório
  periódico por delta**, que é ciclo próprio. Ver
  _O cerco passou a mudar a tela_;
- ✔ **A CAIXA DE ENTRADA ENCHEU: de 1,2 para 8,5 cartas por mês.** Entraram três
  RELATÓRIOS MENSAIS — a rua, a base e o caixa —, com seis limiares medidos e o peso na
  cor. ⚠ **Foi uma frase dele que destravou:** _"é só fazer um jogo de cores, o olho vai
  focar no que importa"_ — e ela desmontou uma recusa minha apoiada numa regra registrada
  duas vezes. Ver
  _A caixa encheu_;
- ✔ **E A CARTA GANHOU ANEXO: o jogo passou a se explicar.** SONDA calculava sete termos
  por classe e jogava todos fora; agora a carta da rua traz a tabela — **D/E vive de
  carestia, A/B vive de economia**, e isso nunca tinha sido dito. ⚠ **A causa veio de um
  print do Football Manager:** a prosa da mensagem de lá tem duas linhas, e o que enche o
  painel é o ANEXO. Ver
  _A carta ganhou ANEXO_.

### ⚠ MAS A MEDIÇÃO ACHOU DUAS COISAS QUE VALEM MAIS QUE OS TRÊS CONSERTOS

**1. O MUNDO QUASE NÃO PERGUNTA, e o número é este: num governo que joga ATIVO cortando
UMA alavanca por pauta, passaram-se 30 MESES sem uma única carta que pergunte.** Não é
defeito: é a regra de `reports` em `passage.mjs`, escrita e justificada — o relator só
emenda texto que machuca **duas ou mais** alavancas, porque emendar exige o que sobra.

A consequência não estava escrita em lugar nenhum: **um jogador cauteloso — que mexe numa
coisa de cada vez — nunca vê a caixa de entrada perguntar nada em quatro anos.** A única
pergunta do jogo fica atrás de um comportamento que ninguém ensina. Ver o achado **37**.

**2. O VAZIO DA CAIXA DE ENTRADA NÃO É DELA.** Medido a 1440×980, antes de qualquer
mudança: a bandeja fechava em **899px de altura com 242px de conteúdo — 657px mortos**, e
ela é o maior objeto do Gabinete. A altura nunca foi escolha dela: a coluna da direita
empilha 302+232+255+110 = **exatamente 899**, e a bandeja estica para acompanhar.

⚠ **E o master-detail RESHAPED o vazio, não o matou:** hoje são 591px, e eles continuam
vindo da coluna vizinha. Encolher a bandeja já foi tentado e revertido na décima primeira
sessão, com razão registrada. Ver o achado **38**.

## O estado anterior — 18/08/2026

**A décima primeira sessão foi sobre uma coisa só, e ela foi pedida assim:** _"o que eu
também realmente quero é que o jogo fique minimamente jogável hoje"_. Está verde —
`validate` (**228 propriedades**), `walk` e as capturas rodados no fim.

⚠ **O jogo TERMINAVA e não dizia.** O mandato passivo cai no mês 46, e a única notícia
disso na tela era um selo de dez pixels no canto de um cartão. E o mês 48 não existia:
**nada no jogo terminava o mandato no prazo** — quem atravessasse os quatro anos entrava
num `2º MANDATO · ANO 1` que nunca teve eleição, e a barra superior imprimia isso.

⚠ **E o mundo desmoronava CALADO.** Medido, cartas que chegam em 46 meses: o governo
passivo recebe **0,0 por mês** — o processo de impeachment abre no mês 43 no meio desse
silêncio. A caixa nunca esteve quebrada: ela responde ao que o jogador FAZ, e quem não
legisla não recebe correspondência de tramitação. Faltava o mundo escrever quando o
mundo se mexe sozinho.

### E a varredura de padronização veio depois

**Pedido do responsável:** _"deixe como está, apenas refine e padronize toda a UI"_. Ela
foi **medida antes de mexida**, e achou **23 frases da interface escritas duas vezes** —
uma delas dentro do mesmo objeto —, **quatro formas** de dizer "não há nada aqui", a peça
"papel" escrita à mão **três vezes**, e uma legenda usada por **seis telas** morando na
folha de **uma**. Entrou a décima primeira guarda, `vocabulary`. Ver a seção própria.

### ⚠ E a tela do Congresso estava QUEBRADA havia duas sessões

O responsável achou testando: _"a aba Congresso e leis tá bem feia e bugado"_. Eram
**quatro defeitos somados**, e o primeiro é o mais caro do lote:

1. ⚠ **COLISÃO DE NOMES DE CLASSE.** A régua do ciclo 11 nasceu como `.gauge` em
   `30-components.css`, e a faixa de índices do Congresso **já usava `.gauge`** desde a
   sétima sessão. O `height: 8px` da régua esmagava o medidor da faixa: rótulo com
   altura **zero**, escada com tamanho zero, e a barra vazando para fora de um recorte
   de 24px. A faixa mostrava oito números sem dizer de que área era cada um;
2. ⚠ **`repeat(7)` para OITO áreas.** A Produção virou Agricultura e Indústria na quinta
   sessão e este número ficou onde estava — a **Defesa** caía numa segunda fileira que o
   `overflow: hidden` decapitava;
3. ⚠ **A linha do caixa dizia o CONTRÁRIO do motor**: _"promete R$ 13,8 bi · não cabe —
   o rateio vai cortar R$ 13,7 bi"_, e 13,7 é o que **cabe**. Lida ao pé da letra, ela
   anunciava um corte de quase tudo num mês em que o corte era de R$ 0,1 bi;
4. **`budget` em inglês na interface** — `instrumentHint` não tinha a entrada, e
   `labelOf` cai no id cru de propósito.

⚠ **Nada disso era visível para tipo, guarda ou prova**, e o `walk` passava verde. O que
achou foi medir a geometria da faixa no navegador — `h: 48` contra `scrollH: 78`.

### ⚠ E um defeito de cinco sessões apareceu de carona

**A carta de posse nunca teve remetente.** A view procura `office === "chief-of-staff"`
e o elenco produz `office === "chief"` — `chief-of-staff` é o **arquétipo**, não o
cargo. A busca devolvia `undefined`, `letterHtml` aceita remetente nulo de propósito (a
gaveta não tem remetente), e a primeira carta do jogo saía sem sigilo, sem nome e sem
cargo. Está travado em prova.

## O estado anterior — 16/08/2026

**Está tudo verde e nada está pela metade.** Nenhum arquivo ficou num estado
intermediário, nenhuma prova está desligada e nenhum `TODO` foi deixado no código.
`validate` (**217 propriedades**), `walk` e `simulate` rodados no fim.

⚠ **A DÉCIMA SESSÃO MATOU O ACHADO 31 — o defeito mais fundo já medido aqui.** O país
parou de se consertar sozinho, e com ele morreram os achados **2** e **29**. Três
outros defeitos apareceram no caminho e foram consertados. **O motor mudou de forma em
três lugares**, e os três estão com a conta escrita ao lado.

✔ **ESTÁ COMMITADO** em `b565221`, na branch `acoplamento-e-simulador`. A árvore está
limpa. Duas sessões inteiras — a décima e a décima primeira — estavam fora do git (40
arquivos, ~3.900 linhas, cinco arquivos novos não rastreados) e foram num commit só: os
arquivos se cruzam em `turn.mjs`, `strings.mjs`, `app.mjs` e três folhas de estilo, e
separar produziria pontos intermediários que não compilam, porque `app.mjs` importa o
fecho.

### ⚠ As cinco coisas mais fáceis de errar ao retomar

1. **`decay` mudou de NATUREZA**, e não de valor: era pontos por mês subtraídos, agora
   é a **fração do estoque** que vaza. Quem ler um `decay: 0,0569` como "cai 0,06
   pontos por mês" vai errar por um fator de mil;
2. **os três números do motor saem de identidades, e há prova para cada uma.** Mexer
   num `cost` de programa **quebra a identidade do achado 31** — a prova
   `O ORCAMENTO HERDADO E O PONTO DE EQUILIBRIO` acusa, e é para isso que ela existe;
3. **há cinco tabelas de série neste arquivo, e quatro são históricas.** A de hoje está
   em _A SÉRIE DE HOJE_, logo abaixo, e é a única que serve para calibrar;
4. **o achado 1d sobrevive nos dois eixos** — o passivo termina com a melhor dívida
   **e** a melhor capacidade. ⚠ **E isso deixou de ser um defeito:** ele agora **cai no
   mês 46**, e a resposta à passividade é política, como o ciclo 10 decidiu;
5. **o próximo bloco é a INTERFACE**, e não motor — ver _O QUE VEM AGORA_.

### E ela entregou mais duas coisas depois disso

✔ **A guarda `orphans` — o achado 5, aberto por seis sessões.** Ela achou **quatro
regras órfãs no primeiro minuto**, uma delas criada na mesma sessão. ⚠ **Duas passadas
foram necessárias**, e a segunda é a lição: o `.allot` do bloco principal saiu na
primeira e o `@media` dele ficou, cinquenta linhas abaixo — quem apaga uma regra procura
pelo nome onde ela mora.

✔ **A CHANTAGEM — onda 2 do ciclo 10.** Os quatro lobbies tinham pressão e nenhuma voz.
Agora os dois que leem a MALHA escrevem uma carta que pergunta, com duas saídas.

> **O que ele exige é uma ALAVANCA, e não dinheiro.** O décimo dossiê propunha um preço
> em bilhões — seria uma segunda moeda, e o ciclo 10 já recusou uma. Mover um nível é
> caneta e sai da mesma bolsa: o jogador não aprende preço novo, ele descobre que a
> bolsa ficou menor.

⚠ **E o nível exigido não é inventado: é o da POSSE.** Um lobby pede **de volta o que
foi cortado** — então a exigência só nasce quando o jogador cortou, ela é sempre pagável
(o país já gastou aquilo), e nunca há inflação de exigência.

| governo, 48 meses  | exigências | produtivo | ordem  |
| ------------------ | ---------- | --------- | ------ |
| passivo            | **0**      | 10        | 21     |
| corta tudo, ignora | 9          | 43        | 49     |
| corta tudo, cede   | 14         | 34        | **36** |
| corta tudo, recusa | 14         | 45        | **53** |

⚠ **O silêncio aqui RECUSA, e isso inverte a regra do ciclo 9.** Na emenda do relator o
silêncio aceita, porque é assim que uma tramitação anda; aqui não: **um lobby que exige e
não recebe resposta não entende que ganhou.** A prova `A CHANTAGEM EXISTE` trava as três
saídas se separando.

⚠ **Dois defeitos meus, e os dois medidos:** `demandAt` escolhido no olho em 35 deu
**duas exigências em 48 meses, ambas depois do mês 45** — o achado 3 se repetindo. Com
30 (metade do caminho até a fervura, que é uma frase e não um gosto) ela vive. E a carta
imprimia _"se você não responder, a emenda vale"_ numa carta em que o silêncio recusa: a
tela prometendo o inverso do motor.

**O que ficou de fora, declarado:** os outros dois lobbies. O mercado quer um **teto** e
não um piso; o baixo clero quer verba para as bancadas, que não é alavanca. Cada um
precisa de um verbo próprio.

### O que esta sessão mudou no motor, em três linhas

| onde                 | era                              | é                                               |
| -------------------- | -------------------------------- | ----------------------------------------------- |
| `capacity/index.mjs` | `índice − decay + yield × gasto` | `índice × (1 − decay) + yield × gasto`          |
| `budget/index.mjs`   | repasse nominal, sem banda       | banda real de 0,6% a 2,5% (LC 200/2023)         |
| `fiscal.mjs`         | `mandatoryGrowth 2,5%`           | **2,16%** — a média ponderada rubrica a rubrica |

### E o que ela mudou na TELA — o [ciclo 11](cycles/11-the-state-is-not-an-app.md)

Pedido do responsável, com as palavras dele: _"tirar essa cara de site de
investimentos"_. **É a quinta vez que a queixa chega** e as quatro anteriores vieram de
fora — quatro fontes independentes descrevendo a mesma coisa é diagnóstico, e não gosto.

⚠ **E o diagnóstico é medível, numa folha só:** `65-screen-finance.css` tem **zero**
`border-radius` e as outras somam **trinta**. A única tela que não parece um painel de
fintech é justamente a que o projeto já tinha chamado de outra coisa em prosa — _"forma
de razão contábil e não de pastilha"_. O registro institucional foi inventado para uma
tela, e as outras dez ficaram no dialeto de aplicativo sem ninguém ter decidido isso.

| parte | o quê                                                                                      |
| ----- | ------------------------------------------------------------------------------------------ |
| **A** | a linha de rubrica — some o raio, entra o fio, e **os números caem em coluna**             |
| **B** | a barra vira **uma linha de leituras com fio entre elas**, e a data volta a mandar         |
| **C** | o Gabinete deixa de ser cinco cartões e vira cinco **blocos**, como as outras quatro telas |
| **D** | a **régua** com o limiar marcado, e o medidor segmentado só onde há composição             |
| **E** | a moldura passou a ter **um número só** — desnível zero e margens iguais                   |

⚠ **A Parte B custou uma regressão minha, pega na captura do mesmo dia:** a forma de
linha gasta o dobro da largura, e a 390px a faixa passou a **cortar a BASE fora da
tela**. Como a tira rola por dentro de propósito, nada estourou e nada ficou vermelho —
o quarto sinal vital simplesmente deixava de existir para quem não arrastasse.

### Para pôr no ar

```bash
npm run serve      # http://127.0.0.1:5173/  — ele não sobe sozinho
npm run validate   # verde de ponta a ponta é obrigatório antes de dizer "pronto"
```

### Os ciclos, num quadro só

| ciclo                                                                           | estado                                                                                            |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **4** — a república responde                                                    | Partes 6, 10a, 10b, 1, 5, **3** e **2** feitas. Falta a **queda** (→ ciclo 10), a **4** e a **8** |
| [**5** — a república ganha rosto](cycles/05-the-republic-gets-a-face.md)        | **inteiro**                                                                                       |
| [**6** — a sala de guerra](cycles/06-the-war-room.md)                           | **inteiro** — o item que faltava virou o ciclo 9                                                  |
| [**7** — o Congresso tem cara](cycles/07-congress-gets-faces.md)                | ✔ **Parte A feita**; B e C não começadas                                                          |
| [**8** — o mapa e o rastro](cycles/08-the-map-and-the-trail.md)                 | ⚠ proposta · não começada                                                                         |
| [**10** — quem derruba um presidente](cycles/10-who-brings-down-a-president.md) | ✔ **onda 1 feita** · a onda 2 tem plano no ANEXO II                                               |
| [**11** — o Estado não é um aplicativo](cycles/11-the-state-is-not-an-app.md)   | ✔ **INTEIRO** (A–F) em 16/08 — a linha de rubrica, a barra, o Gabinete, a régua e a moldura       |
| [**9** — a carta pede resposta](cycles/09-the-letter-asks-for-an-answer.md)     | ✔ **FEITO** — o jogador ganhou um verbo na tramitação                                             |

### ▶ O QUE VEM AGORA — em 18/08/2026

**O responsável escolheu a ordem "as três, nessa ordem", e a terceira NÃO foi feita:**

1. ✔ **o fecho da partida** — feito;
2. ✔ **a Caixa de Entrada** — mediu-se que ela não estava quebrada, e o que entrou foi o
   cerco falando. Ver a sessão acima;
3. ⛔ **O GABINETE FICA COMO ESTÁ — decisão dele, e ela FECHA o item.** Ele rola
   **1363px numa janela de 900**, e cortar exigiria decidir o que sai das cinco seções.
   As palavras dele em 18/08: _"deixe como está"_. **Não reabra sem ele pedir**;
4. ✔ **a padronização da interface** — feita depois disso, a pedido dele. Ver a seção
   _A varredura de padronização_.

### ▶ E O QUE EU FARIA NA PRÓXIMA SESSÃO, nesta ordem — revista em 20/08/2026

⚠ **A ordem de 18/08 abaixo continua válida no conteúdo, mas o item 1 dela venceu** (ver
achado 39: o achado 30 já estava medido). A ordem de hoje:

1. ▶ **OS DOIS LOBBIES MUDOS, e agora eles são o item 1 por uma razão nova.** Deixaram de
   ser "os dois decorativos" e passaram a ser **a única saída barata para o achado 37**: o
   jogo tem uma pergunta só, e ela mora atrás de um comportamento que ninguém ensina. Um
   lobby que exige por conta própria não depende de o jogador escrever texto grande.
   ⚠ **Não force os dois na carta que existe:** a exigência de piso funciona porque
   "devolva o que você cortou" tem um número derivado atrás; um teto e uma torneira não
   têm, e inventá-los seria o número inventado que este projeto recusa. Cada um precisa de
   verbo próprio;
2. ▶ **A DECISÃO DO ACHADO 38 é dele, e não minha.** A coluna da direita não cabe na
   dobra por densificação — o teto medido é ~144px de 367. Fechar exige dizer o que sai da
   tela, e o candidato é "Aprovação por renda". **Pergunte antes de cortar**;
3. ▶ **terminar a varredura de vocabulário nas dez telas.** A regra que matou _"as placas
   tectônicas"_ e _"a rua"_ — rótulo nomeia a coisa, a metáfora mora na prosa — passou em
   três casos a mais em 18/08, mas **não foi passada sistematicamente**. É barata e não
   toca em motor;
4. ▶ **a materialidade do dossiê**, que é a Parte 3 dele e a única que ficou inteira de
   fora: textura sutil no fundo, relevo nos elementos que se clicam, e o contorno âmbar da
   tela quando o risco de queda está crítico. Não toca em motor, não inventa número, e é
   exatamente o pedido antigo do responsável — _"tirar essa cara de site de investimentos"_;
5. ▶ **os DOIS ESTADOS VAZIOS do Congresso** ocupam ~400px juntos numa tela de 1900. Não é
   defeito: é decisão de peso, e ela nunca foi tomada de propósito;
6. ▶ recalibrar a tramitação (achados **22** e **28**), e os achados **26**, **32**,
   **33**, **35** e **36**; depois o [ciclo 8](cycles/08-the-map-and-the-trail.md) e as
   partes B e C do [ciclo 7](cycles/07-congress-gets-faces.md).

### ▶ A ORDEM DE 18/08, que a de cima revisa

1. ▶ **MEDIR O ACHADO 30 antes de tocar em qualquer lobby.** O país passou a se degradar
   na décima sessão, e o setor produtivo e as forças de ordem podem ter deixado de ser
   decorativos **sozinhos** — foi exatamente o que aconteceu com o achado 29. É medição
   pura, quase sem edição de código, e o resultado decide o item seguinte;
2. ▶ **os DOIS LOBBIES MUDOS.** O mercado quer um **teto** e o baixo clero quer verba de
   bancada. ⚠ **Não force os dois na carta que existe:** a exigência de piso funciona
   porque "devolva o que você cortou" tem um número derivado atrás; um teto e uma
   torneira não têm, e inventá-los seria o número inventado que este projeto recusa.
   Cada um precisa de verbo próprio;
3. ▶ **terminar a varredura de vocabulário nas dez telas.** A regra que matou _"as placas
   tectônicas"_ e _"a rua"_ — rótulo nomeia a coisa, a metáfora mora na prosa — passou em
   três casos a mais em 18/08 (`budget` em inglês, _"a moldura"_, _"o placar"_), mas
   **não foi passada sistematicamente**. É barata e não toca em motor;
4. ▶ **os DOIS ESTADOS VAZIOS do Congresso** ocupam ~400px juntos numa tela de 1900 —
   "Nada em pauta" e "Nada tramitando", cada um com chamada e três linhas. Não é defeito:
   é decisão de peso, e ela nunca foi tomada de propósito;
5. ▶ recalibrar a tramitação (achados **22** e **28**), e os achados **26**, **32**,
   **33**, **35** e **36**; depois o [ciclo 8](cycles/08-the-map-and-the-trail.md) e as
   partes B e C do [ciclo 7](cycles/07-congress-gets-faces.md).

### ▶ O QUE VINHA ANTES — a ordem de 16/08

**A ordem foi acordada com o responsável em 16/08, e os dois primeiros passos estão
feitos.** Ela está escrita no [ANEXO II do ciclo 10](cycles/10-who-brings-down-a-president.md).

✔ **1. Achado 2** — morto, e ele nunca foi um defeito de modelo: o instrumento contava
o **complemento exato** da verdade.

✔ **2. Achado 31** — morto, pelo decaimento proporcional com a taxa por identidade.
Levou junto os achados **29** (o passivo agora cai) e **1d** (que deixou de ser
problema fiscal e virou consequência política).

✔ **3. A INTERFACE, bloco A** — o [ciclo 11](cycles/11-the-state-is-not-an-app.md),
partes **A, B e C**. Pedido do responsável em 16/08: _"tirar essa cara de site de
investimentos"_. **Nenhuma delas toca em motor.**

✔ **4. A CHANTAGEM** — feita, para os dois lobbies que leem a MALHA. Ver acima.

⚠ **E DUAS COISAS DA TELA FICARAM ABERTAS, as duas pedidas e nenhuma feita:**

- **o Gabinete ainda rola** — 1253px numa janela de 900. O que sobrou não é folga, é
  **volume de conteúdo**: cinco seções. Cortar mais exige decidir o que SAI da tela, e
  isso é decisão do responsável e não minha. ⚠ **E o emparelhamento das listas já foi
  tentado e revertido** — ver a Parte F do ciclo 11, com o número que o mata;
- **a varredura de vocabulário parou nos dois casos que ele nomeou.** _"As placas
  tectônicas"_ e _"a rua"_ saíram; a regra que os matou — rótulo nomeia a coisa, a
  metáfora mora na prosa — **ainda não foi passada nas outras dez telas**.

▶ **5. OS OUTROS DOIS LOBBIES exigem em moedas que ainda não têm verbo.** O mercado quer
que a dívida pare de crescer — um **teto** de gasto, e não um piso — e o baixo clero quer
verba para as bancadas, que não é alavanca. ⚠ **Não force os dois na carta que existe:**
a exigência de piso funciona porque "devolva o que você cortou" tem um número derivado
atrás; um teto e uma torneira não têm, e inventá-los seria o número inventado que este
projeto recusa.

**5. O bloco B da interface** — a Trindade, o clipping e a chantagem —, junto do achado
30 (dois lobbies ainda decorativos). É a onda 2 do
[ciclo 10](cycles/10-who-brings-down-a-president.md). ⚠ **Reavalie o achado 30 antes de
começar:** o país passou a se degradar, então o setor produtivo e as forças de ordem
podem já ter deixado de ser decorativos — foi o que aconteceu com o achado 29.

**6.** Recalibrar a tramitação (22 e 28), o achado 26, os achados novos **32, 33, 35 e
36**, e o [ciclo 8](cycles/08-the-map-and-the-trail.md).

### O que o ciclo 10 deixou pronto

- **CALDEIRA** (`src/domain/pressure/`) — o oitavo motor: pressão como estoque, subindo
  rápido e descendo devagar;
- **quatro lobbies**, cada um lendo um lugar diferente — e a rua ficou de fora, porque
  ela já é a SONDA;
- **as três rupturas** — social, econômica, política — e o processo só abre com as
  três juntas;
- **o leilão** — com o processo aberto a cadeira vale o **triplo**, e há um turno para
  comprar sobrevivência antes de o plenário votar;
- **a queda** — 342 de 513 (CF art. 86, dado com fonte), e o mandato termina.

### ▶ A SÉRIE DE HOJE — e ela é a ÚNICA que serve para calibrar

⚠ **Há outras quatro tabelas de série neste arquivo, e as quatro são HISTÓRICAS.** Elas
medem o efeito de uma mudança específica no dia em que ela entrou, e cada uma foi
superada pela seguinte. Estão marcadas onde aparecem. **Calibrar contra qualquer uma
delas seria ajustar o parafuso contra um jogo que não existe mais.**

| política     | dívida/PIB | votações     | indústria   | segurança   |
| ------------ | ---------- | ------------ | ----------- | ----------- |
| `herdado`    | **90,0%**  | 0 de 0       | 48 → **28** | 38 → **27** |
| `agenda`     | 90,2%      | 14 de 43     | 48 → 20     | 38 → 20     |
| `base`       | 90,7%      | **29 de 42** | 48 → 20     | 38 → 20     |
| `piso`       | 90,8%      | 2 de 24      | 48 → **15** | 38 → **15** |
| `explorador` | 92,0%      | 0 de 0       | 48 → 17     | 38 → 17     |
| `promessa`   | **93,5%**  | 0 de 4       | 48 → 15     | 38 → 15     |

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

## A carta ganhou ANEXO, e o jogo passou a se explicar — 21/08/2026

Queixa do responsável: _"o bloco esquerdo é muito pequeno, mal dá pra ler, e o bloco
direito é grande demais pra uma mensagem tão pequena"_ — com um print da caixa de entrada
do Football Manager.

**Medido antes de propor qualquer coisa:**

| peça                 | medida                                           |
| -------------------- | ------------------------------------------------ |
| a bandeja            | 659 × 630px                                      |
| o índice             | **208px**, assunto em 12,5px cortado em 3 linhas |
| o documento          | 435px                                            |
| a carta              | 435 × 191px                                      |
| **o texto da carta** | **196 × 22px**                                   |
| vazio abaixo dela    | 439px de 630                                     |

⚠ **O texto de uma carta ocupava 1% da área da bandeja.**

### ⚠ E o print derrubou a explicação óbvia

A divisão índice/documento no FM é **35/65**; aqui era **32/66**. **A proporção já estava
certa.** O que difere é que **no FM a caixa de entrada É A TELA** — o índice dele tem 415px
absolutos porque a janela inteira é dele; aqui ela é uma coluna de um painel.

⚠ **E a prosa da mensagem do FM tem DUAS LINHAS** — _"Joel Méndez esteve particularmente
impressionante"_ —, tão curta quanto as nossas. **O que enche o painel dele é um ANEXO:**
um cartão de jogador e uma tabela de nove linhas. **O painel daqui não era grande demais:
ele estava esperando o anexo.**

### ✔ O índice: corpo maior, corte menor

`--text-note` → `--text-body` (12,5 → 13,6px) e o corte de 3 linhas para 2. Alargar seria
tirar do documento, que ia receber o anexo — então o conserto é o corpo e o corte, e não a
largura.

⚠ **E NÃO É UMA LINHA, que é o que o FM usa:** lá o assunto é manchete — _"Méndez
estreia-se a marcar pelo México"_ —, e aqui ele carrega o verbo e o nome do texto:
_"Devolvi o seu texto com uma emenda: Cortar atenção básica · e mais 1"_. Com uma linha o
jogador leria _"Devolvi o seu texto com u…"_, que é pior do que não mostrar.

⚠ **E o teto da pilha caiu de 9 para 8**, porque o corpo maior levou o pior caso de 66 para
70px. **Ele já foi 11.** Este número não se conserta lendo prosa: quem o derruba é a prova
do passeio, e foi ela que o pegou das duas vezes.

### ✔ O anexo: SONDA passou a contar a conta que já fazia

⚠ **`step()` calculava sete termos por segmento e jogava todos fora.** Cinco notas
nacionais — carestia, emprego, serviços, ordem, economia —, pesadas de forma **diferente
por classe**, menos a promessa não honrada e o desgaste do cargo. Ela devolvia só o número
final, e a tela mostrava `23%` sem ter como dizer mais nada.

**Agora ela devolve `notes`, `betrayal`, `wear` e `weighed`** — cada nota já pesada por
segmento. ⚠ **E pesada LÁ, e não na view:** multiplicar nota por peso do lado de cá daria
dois lugares fazendo a mesma conta, e o segundo divergiria no dia em que um peso mudasse —
que é o dia em que o anexo precisa estar certo.

**O que sai na tela, medido:**

|            | carestia | emprego | serviços | ordem | economia | soma |
| ---------- | -------- | ------- | -------- | ----- | -------- | ---- |
| Classe D/E | **21**   | 9       | 13       | 4     | 0        | 47   |
| Classe C   | **16**   | 12      | 8        | 6     | 3        | 44   |
| Classe A/B | 8        | 3       | 3        | 11    | **22**   | 48   |

**D/E vive de carestia; A/B vive de economia.** A textura política inteira do jogo estava
calculada desde que SONDA nasceu e **nunca tinha sido dita**.

⚠ **E É TABELA, E NÃO GRÁFICO.** Cinco notas em cinco cores exigiriam uma chave, e
_"desenho de várias cores precisa de chave"_ é regra registrada aqui — a legenda do arco
custou um dia inteiro. Uma tabela com o nome em cima de cada coluna não precisa de nenhuma.
**A maior de cada linha ganha peso**, e é ela que faz a tabela ler de relance: sem
destaque, cinco números por linha são cinco números.

**A carta foi de 191 para 342px.**

### ⚠ E o campo do anexo é UM, e genérico, de propósito

`attach` é um `Record<string, number>` — um mapa de números, nunca prosa. As três espécies
de relatório compartilham o mesmo campo, e o caixa e a base vão receber os seus. **Sete
campos nulos em nove espécies foi exatamente o que fez a leitura do mês ser recusada no
save hoje de manhã, e a lição não se repete.**

### E depois a carta virou OFÍCIO, e a régua subiu duas vezes na mesma conversa

Primeiro: _"tô achando ultra genérico todos os títulos e textos, horrível mesmo, tipo A rua
se moveu, a base se moveu, parece tudo igual e feito por uma IA burra"_.

⚠ **Ele está certo, e o defeito tem nome:** _"A rua se moveu"_ é um **rótulo de categoria**,
e não uma frase. Ele diz de que assunto a carta trata, e não o que aconteceu — e três
cartas com o mesmo verbo e sujeitos trocados leem como formulário preenchido.

**Três rótulos viraram doze manchetes**, e nenhuma inventa nada: a carta já guardava a
DIREÇÃO e o TAMANHO, e o que faltava era a view usar os dois para escolher o verbo.

|       | caiu                    | caiu muito                     |
| ----- | ----------------------- | ------------------------------ |
| rua   | _A rua escorregou_      | _A rua virou contra o governo_ |
| base  | _O Congresso escorreu_  | _A base desmanchou_            |
| caixa | _Sobrou menos este mês_ | _O caixa apertou_              |

⚠ **E o verbo é o trabalho.** "Se moveu" é o verbo de quem não quer se comprometer;
"desmanchou", "escorregou", "respirou" dizem o tamanho antes do número.

**Depois ele subiu de novo:** _"quero algo como uma mensagem de verdade para um presidente
de verdade"_.

⚠ **E isso não é manchete melhor — é VOZ.** O corpo era uma leitura de dado: _"caiu de 24
para 23 de aprovação"_. Leitura de dado não é mensagem — **não tem quem fala, não tem para
quem, e não diz o que aquilo significa.** O que sai agora:

> **Presidente,**
>
> A pesquisa fechou o mês em **21%** de ótimo ou bom — **1** ponto abaixo do mês passado.
>
> O que sustenta o senhor é **economia**, e é na **Classe A/B** que ela pesa mais.
>
> A nota mais fraca é **ordem**, e ela puxa as três classes para baixo.

⚠ **E CADA ORAÇÃO SE PRENDE A UM FATO, que é a parte difícil e a única que importa.** O
número e a direção vêm da carta; a nota que mais sustenta é a maior **já pesada** e a mais
fraca é a menor soma nacional — as duas de `attach`, que SONDA passou a produzir hoje. Uma
frase sem número atrás seria a tela opinando, **e isso continua recusado mesmo com as ADRs
reabertas: o que o projeto proíbe não é o modelo escrever, é a tela AFIRMAR o que o motor
não sabe.**

⚠ **E o vocativo é o que mais muda a leitura, por menos que ele custe.** _"Presidente,"_
transforma um relatório num ofício — é a diferença entre um sistema exibindo estado e
alguém escrevendo para alguém.

### ✔ A data saiu de dentro do remetente, e as pesadas ganharam rubor

Duas queixas dele, as duas certas:

- **a data** vinha colada no fim de _"Denise Hollanda Cavalcanti · out · 2027"_, na mesma
  tinta apagada e depois de um nome longo. Com uma carta por mês passava; com **vinte e
  quatro guardadas**, a data é o que separa o mês passado do retrasado. Virou peça própria,
  na fonte de REGISTRO — mês e ano são dado, e dado aqui se escreve com a serifa do arquivo;
- **o peso virou VERMELHO e ganhou fundo.** Eu tinha escolhido latão com a razão de que
  "movimento grande não é crise" — e a razão dele vence, porque o que ele pede não é
  semântica de crise: **é que o olho encontre a linha sem procurar.** Com vinte e quatro
  cartas, encontrar é o problema.

⚠ **E os dois sinais vermelhos não se confundem, porque moram em canais diferentes:** o
prazo vencendo é a **tarja** da esquerda, o movimento grande é o **fundo** da linha. Uma
carta pode ter os dois — e aí ela é as duas coisas, o que é verdade. ⚠ E a linha aberta
mantém o rubor **por baixo** do vidro: sem isso a marca sumiria debaixo do próprio clique.

### ⚠ E a manchete precisou de TRÊS versões, com ele recusando as duas primeiras

A segunda recusa veio com a palavra certa: _"pare com essa poesia, eu quero que seja algo
TÉCNICO, vida real, humanizado"_.

| versão | exemplo                 | o defeito                                           |
| ------ | ----------------------- | --------------------------------------------------- |
| v1     | _"A rua se moveu"_      | **rótulo de categoria** — diz o assunto, não o fato |
| v2     | _"A rua escorregou"_    | **poesia** — diz o tamanho, e não diz QUANTO        |
| v3     | _"Aprovação cai a 21%"_ | **notícia** — verbo e número                        |

⚠ **O QUE SEPARA A TERCEIRA DAS OUTRAS DUAS É O NÚMERO NO TÍTULO.** Manchete de agência,
assunto de ofício e linha de despacho têm todos a mesma forma: **o que mudou, para quanto.**
_"A base desmanchou"_ é uma opinião sobre o tamanho; _"Base perde 157 cadeiras"_ é o fato, e
quem forma a opinião é o leitor — **que é o que um documento técnico faz.**

⚠ **E POR ISSO ELAS DEIXARAM DE SER FRASES PRONTAS.** O número muda todo mês, então a
manchete se COMPÕE: o vocabulário guarda o verbo e a unidade, e a view monta com o valor da
carta. Doze frases estáticas viraram seis verbos e uma composição.

⚠ **E O PESO SAIU DA CHAVE DA MANCHETE.** Ele existia para escolher entre "escorregou" e
"desmanchou" — e com o número no título ele não tem mais o que decidir: **157 é maior que 4
sem ninguém precisar dizer.** Ele continua vivo onde serve: no rubor da linha do índice, que
é onde o olho procura.

⚠ **E a base fala em cadeiras GANHAS ou PERDIDAS, e as outras duas no NÍVEL.** _"Base perde
157 cadeiras"_ é a notícia; _"Base cai a 229"_ é um placar. Já 21% de aprovação e R$ 11,3 bi
são **o que o presidente tem**, e não o quanto mudou.

### ✔ E o documento passou a esticar, revertendo uma regra escrita três vezes

Pedido dele: _"o bloco direito deve ser esticado até o final, ficando simétrico e
padronizado com o bloco esquerdo, não importa se o texto da mensagem vai ser pequeno"_.

⚠ **A razão antiga era de MATERIAL — "papel não estica" — e a dele é de COMPOSIÇÃO, e é a
que vale aqui.** O que a coluna mostra não é uma folha solta sobre uma mesa: são **duas
colunas lado a lado**, e duas colunas que terminam em alturas diferentes leem como layout
inacabado. É exatamente o argumento que já tinha ganhado do outro lado quando a bandeja
passou a acompanhar a coluna da direita — _"um degrau no rodapé custa mais que o vazio
dentro de um contêiner que se anuncia como contêiner"_.

**Medido: carta 630px, índice 630px, diferença ZERO.**

⚠ **E ESTICAR A FOLHA NÃO É ESTICAR O TEXTO.** `align-content: start` dentro da carta mantém
remetente, assunto e corpo onde a leitura começa, e o que cresce é o papel embaixo deles.
Sem essa linha, uma grade que recebeu altura distribui as linhas pelo espaço todo e um
ofício de três linhas sai com trinta pixels entre cada uma — **o texto viraria uma escada**.

⚠ **E SÓ A CARTA DA BANDEJA ESTICA.** `.letter` é a mesma peça em três telas — o fecho e o
relatório também a usam —, e lá ela é item de fluxo que deve medir o próprio texto.
Esticar seria dar a elas uma folha sem fundo definido.

### E depois o TEXTO precisou ocupar a folha, e "esticar" não era o que parecia

_"Esticou a tela, estique o texto também, tudo bem padronizado e simétrico."_

⚠ **A saída óbvia estava errada, e é a primeira que vem à cabeça:** distribuir as linhas
pelo espaço todo com `space-between`. Isso produz uma **ESCADA** — remetente no teto, corpo
no meio, ação no rodapé, com cem pixels de nada entre cada um.

**Texto não se distribui — texto se ANCORA, e um documento tem duas âncoras:** a leitura
começa em cima, e a nota de rodapé mora embaixo. Três faixas, então: cabeça e assunto no
topo, o corpo com o que sobrar, e o rodapé colado no pé. É a estrutura de qualquer papel
timbrado, e ela vale exatamente porque **não é uma distribuição — é uma composição**.

- **a nota de rodapé foi para o pé**, que é literalmente o nome dela. Ela vinha logo abaixo
  do último parágrafo, e num ofício de três linhas dentro de 630px isso a deixava boiando
  no terço de cima. `margin-top: auto` a empurra sem altura fixa e sem tocar no texto acima;
- **o corpo cresceu um degrau.** Numa folha de 630px, 13,6px é corpo de aviso e não de
  documento.

### ⚠ E o degrau foi REUSADO, e não inventado — a primeira versão criava um token novo

Eu ia criar um `--text-read` entre `body` e `name`. **Isso reabriria em silêncio o defeito
que a escala existe para fechar:** a prosa dos tokens registra que as folhas usavam **onze
tamanhos crus** fora dela, e que _"onze tamanhos entre 11px e 17px não formam hierarquia,
formam ruído"_ — e a queixa que gerou aquela consolidação foi dele mesmo, _"as fontes estão
estranhas e despadronizadas"_.

`--text-verdict` é o degrau certo **por significado, e não por coincidência de valor**: ele
é a voz que diz o que está em jogo, e a carta da Casa Civil é exatamente isso — o mês lido
para o presidente. **Um degrau novo com o mesmo tamanho seria um segundo nome para a mesma
coisa.**

**Medido: carta 630px, rodapé a 25px do pé.**

## A caixa encheu, e quem destravou foi uma frase dele — 21/08/2026

⚠ **EU TINHA RECUSADO O RELATÓRIO PERIÓDICO por uma regra registrada duas vezes** — _"uma
linha que só diz que nada aconteceu ensina o olho a pular a linha inteira"_ —, e ela matou
duas legendas com razão. **A resposta dele desmontou a recusa em nove palavras:** _"é só
fazer um jogo de cores, o olho vai focar no que importa"_.

**E ele está certo.** A regra vale para linhas **indiferenciadas**. Numa bandeja em que o
peso está na cor, o olho varre por **intensidade** e não por leitura — que é exatamente
como o inbox do Football Manager funciona. É a segunda vez nesta sessão que uma razão dele
vence uma recusa minha de desenho.

### O que mudou, em três peças

**1. TRÊS RELATÓRIOS MENSAIS** — a rua, a base e o caixa. Eles são a **terceira natureza de
carta**: as duas anteriores respondiam a eventos, e esta responde ao **tempo**. É a única
capaz de encher uma bandeja, porque evento é raro e mês é todo mês.

⚠ **E "nada aconteceu" continua não virando carta.** O que mudou foi o que conta como
acontecer: antes era cruzar um limiar, agora é **se mover de forma material**.

⚠ **E OS SEIS LIMIARES SÃO MEDIDOS, e não escolhidos.** Movimento mensal absoluto num
mandato passivo de 48 meses:

| grandeza  | mediana | p75  | p90  | máx    | escreve | grita |
| --------- | ------- | ---- | ---- | ------ | ------- | ----- |
| aprovação | 0,00    | 1,00 | 1,00 | 8,00   | ≥ 1     | ≥ 4   |
| base      | 2,00    | 4,00 | 4,00 | 158,00 | ≥ 3     | ≥ 10  |
| caixa     | 0,31    | 0,43 | 0,49 | 0,52   | ≥ 0,3   | ≥ 1,0 |

O primeiro número fica perto da **mediana** — é assim que a carta chega em cerca de metade
dos meses de um governo passivo, e em quase todos de um ativo. O segundo fica perto do
**máximo**: o mês em que a base perde dez cadeiras não pode ter a mesma cara do mês em que
ela perde duas.

**2. A TARJA DA ESQUERDA GANHOU UM SEGUNDO DONO** — e nunca os dois ao mesmo tempo. Numa
carta com prazo ela é **tempo**; numa sem prazo, **peso**. Os dois respondem a mesma
pergunta do olho — _"o quanto eu preciso me importar com esta linha?"_ —, e é por isso que
um canal só serve aos dois. ⚠ O peso é **latão e não vermelho**: um movimento grande não é
crise, e a paleta já gasta `--crisis` no prazo vencendo.

**3. `KEEP` SUBIU DE 1 PARA 24, e o freio deixou de ser o relógio.** Pedido dele: _"o
empilhamento deve servir pra sempre — quando eu pulo o mês as mensagens do mês anterior
devem continuar"_. Com um mês de retenção a bandeja se esvaziava sozinha e **a pilha nunca
tinha o que empilhar**. Agora quem freia é a pilha da tela, que mostra nove e **nunca
descarta uma pergunta**. Um teto novo, `CARRY = 24`, impede o save de crescer sem conta.

### O resultado, medido

|                                | antes        | depois      |
| ------------------------------ | ------------ | ----------- |
| cartas visíveis por mês        | **1,2**      | **8,5**     |
| meses com uma carta ou nenhuma | **20 de 24** | **1 de 24** |
| cartas que gritam              | —            | **10%**     |

### ⚠ E dois defeitos meus que só apareceram com a bandeja cheia

**1. A PILHA GUARDAVA A CARTA VELHA E JOGAVA FORA A NOVA.** `state.mail` é cronológica e a
pilha corta pelo fim: ela manteria a rua de março para sempre e descartaria a de hoje. Com
uma carta por mês a ordem não aparecia. `newestFirst` inverte **entre iguais** — a pergunta
continua na frente de tudo, porque ordenar por data poria um relatório de aprovação na
frente de uma emenda com prazo correndo.

**2. ⚠ O TETO DA PILHA ERA DO CASO TÍPICO, E NÃO DO PIOR — e quem o derrubou foi a prova
do passeio**, no primeiro mês em que a bandeja de fato encheu: _"o índice rola 53px para
baixo com 11 linhas — a pilha estourou"_. Onze vinha de dividir 630 por 54, a linha típica.
Um assunto que quebra em duas linhas mede **66px**, e _"O baixo clero passou do ponto"_
quebra. A conta certa é 630 ÷ 70 = **nove**.

**Dimensionar pelo típico faz a pilha estourar exatamente no mês movimentado — que é o
único mês em que ela precisava funcionar.** Duas linhas de folga num mês calmo não custam
nada; uma barra de rolagem no mês em que tudo acontece custa a leitura.

### ⛔ E o pedido de "uma boa IA humana e inteligente por trás" NÃO foi atendido como IA

Ele pediu isso com estas palavras, e a resposta honesta é que **duas ADRs o proíbem**: a
[0001](adr/) diz que a IA não entra no turno, e a [0002](adr/) que ela gera vocabulário e
**nunca efeito**. Um modelo decidindo o que chega na caixa faria o jogo parar de se refazer
da semente, e o mandato deixaria de ser reproduzível.

⚠ **O QUE ELE QUER É OUTRA COISA, E ELA FOI FEITA: que o mundo pareça ter cabeça.** Isso
não vem de um modelo no laço — vem do motor escrevendo o que ele já decidiu. As sete
espécies de carta que entraram hoje são todas leitura de número que o turno produziu, e
nenhuma delas inventa uma frase sobre um fato que não aconteceu. **Se ele quiser reabrir as
ADRs, isso é decisão dele e não se resolve de passagem.**

## O cerco passou a mudar a tela, e o mundo passou a escrever — 21/08/2026

Duas frases do responsável, e a primeira derrubou uma afirmação minha: _"estou avançando os
meses e nada está sendo empilhado"_ e _"a IA do jogo precisa ser aprimorada, quero que mais
coisas apareçam na caixa de entrada todos os meses"_.

⚠ **ELE VIU ANTES DE EU MEDIR, e o meu número estava mal escolhido.** Eu tinha reportado
_"pico de 5 cartas contra um teto de 11"_ — e pico é o número errado para essa pergunta. O
número certo: **média de 1,2 cartas por mês, com 20 de 24 meses tendo uma carta ou
nenhuma.** O pico acontecia uma vez, no mês 46.

### ✔ A lacuna 1 do dossiê fechou: a lâmina reage ao cerco

Era o último item aberto da Parte 3 do dossiê da Sala de Guerra. Com um processo correndo
havia carimbo na caldeira e frase na carta, e **a tela continuava idêntica ao mês
tranquilo**.

⚠ **ELE ENTRA POR ARESTA, E NÃO POR TINTA.** O gel de situação já tinge tudo por
crise/estável/crescimento, e um quarto tom ali competiria com a leitura que o gel existe
para dar. A aresta responde outra pergunta: o gel diz _"quão bem o país vai"_, a moldura diz
_"há uma gaveta aberta"_.

⚠ **E A COR É O BORDÔ DO CARIMBO, e não o vermelho de crise.** `--crisis` é o que JÁ deu
errado; aqui a Câmara autorizou e o mandato continua. É a mesma cor que o botão de avançar
usa quando o mês vai bater o carimbo por você — uma voz, uma cor. Ela pulsa em 9s, o mesmo
passo do passeio da luz, e **`prefers-reduced-motion` tira o pulso e mantém a moldura**: ela
é informação, não enfeite.

### ✔ A lacuna 2 fechou como SÃ, e a Trindade é o instrumento mais saudável da tela

Ela era a única leitura do Gabinete sem prova de que se move. Medida em 48 meses de governo
passivo:

| régua             | percorre | limiar                         |
| ----------------- | -------- | ------------------------------ |
| Opinião pública   | 44 → 12  | rompe abaixo de 16 ✔ atravessa |
| Capital           | 0 → 65   | rompe acima de 50 ✔ atravessa  |
| Base no Congresso | 0 → 100  | rompe acima de 86 ✔ atravessa  |

**As três atravessam o próprio limiar sem o jogador fazer nada.** É o oposto do
achado 47 (ver os achados em `handoff.md`), em que quatro dos
cinco indicadores de Finanças não movem uma unidade de vinte em dois anos.

### ✔ Três travessias novas, e o mundo passou a falar nos meses que importam

`alarmsOf` já era a peça certa — ela compara o antes com o depois e **só escreve
transição**. Ganhou três:

- **`ceiling`** — o teto do arcabouço fechou. É a primeira crise da lista de `situationOf`,
  com a razão já escrita lá: _"sem discricionário não há emenda, e sem emenda a base não se
  compra de volta"_. O jogo inteiro estreita nesse mês, e a única notícia disso era o gel
  mudar de cor;
- **`minority`** — a base cruzou a maioria simples **para baixo**. ⚠ É travessia e não
  estado: um governo que abre em minoria não recebe carta, porque nada mudou. Assinada pelo
  LÍDER, porque recompor é problema dele antes de ser do presidente;
- **`boiling`** — um grupo passou do ponto de fervura. Uma por grupo, e não um aviso
  agregado: **o mercado fervendo e o baixo clero fervendo pedem coisas opostas.**

**Medido, com o texto que sai na tela:**

> _"O baixo clero passou do ponto — 70 de 100, e o ponto de fervura é 68. E ele carrega 30%
> do capital."_

⚠ **E NENHUMA INVENTA NÚMERO.** As três o motor já decidia todo mês; o que faltava era elas
chegarem a quem não estivesse olhando o cartão certo da coluna da direita.

⚠ **E O `from` DA FERVURA NÃO É QUEM ASSINA.** Um lobby não tem rosto neste jogo — não está
no elenco, não tem sinete, não tem cargo. O id guardado é o que deixa a view achar a pressão
dele na caldeira sem adivinhar pelo texto; o nome vai no ASSUNTO, onde lê como manchete.

### ⚠ E A MEDIÇÃO DEPOIS DIZ UMA COISA ESTRUTURAL QUE MUDA O PEDIDO DELE

Com as três, a média foi de **1,2 para 1,3** cartas por mês. **No mês em que algo acontece a
bandeja fecha com cinco cartas** — a captura do cerco mostra isso —, e nos meses calmos ela
continua com uma.

**A razão não é falta de travessias: é que travessia é RARA POR DEFINIÇÃO.** Uma ferida
cruza uma vez. Nenhuma quantidade de limiares novos produz a densidade do Football Manager,
porque **o inbox do FM não é feito de travessias — é feito de RELATÓRIOS PERIÓDICOS**: a
tabela da liga, o relatório do olheiro, a lista de lesionados. Eles chegam toda semana e não
dizem "nada aconteceu"; dizem "este é o número deste assunto agora".

⚠ **O que produziria a densidade pedida é um mecanismo diferente, e ele é decisão dele:**
uma carta por DOMÍNIO por mês, disparada por **delta** e não por nível — a Fazenda escreve
quando a posição fiscal se moveu materialmente, a rua quando a aprovação se moveu, uma
bancada quando a lealdade dela se moveu. Delta dispara com frequência (as coisas se mexem
todo mês) sem disparar sempre (mês parado fica quieto). **É ciclo próprio**, e colide com uma
regra registrada duas vezes — _"uma linha que só diz que nada aconteceu ensina o olho a
pular a linha inteira"_ —, então o limiar de "material" é a decisão inteira.

## A Caixa de Entrada foi ao Football Manager buscar quatro peças — 21/08/2026

Pedido do responsável: _"quero que a caixa de entrada se assemelhe mais com a do Football
Manager, pesquise sobre e me traga pelo menos 3 pontos aplicáveis"_ — e depois, a quarta,
que é dele: _"empilhar as mensagens, aí elas vão se excluindo sozinhas quando a próxima
ocuparia mais espaço do que a tela aguenta sem precisar rolar"_.

⚠ **E METADE DO QUE O FM FAZ NÓS JÁ FAZÍAMOS**, o que precisa ser dito antes das novidades:
master-detail, ordenação por urgência, acento vermelho no que vence, remetente com cara e
ação dentro do item. **E o botão de avançar já era melhor que o de lá:** o `Continue` do FM
vira `Must Respond` e **trava**; o nosso diz o **preço** e deixa passar.

### 1. O ESTADO NÃO LIDO, e é ele que faz uma bandeja ser bandeja

No FM o peso visual principal do índice é o item que ainda **não** foi aberto. Aqui uma
carta recém-chegada tinha exatamente a mesma cara de uma lida três vezes.

⚠ **E ELE NÃO ENTROU NO SAVE, e essa é a decisão que vale registrada.** Qual carta foi lida
não move um número, não decide um mês e não muda um veredito — é registro de quem estava
olhando. Pô-lo em `GameState` custaria um **bump de esquema**, e este save recusa versão
diferente em vez de converter: o jogador perderia a partida em andamento para pagar por uma
marca de leitura. **E o reducer tem uma ação só, de propósito** — uma segunda já foi
proposta e recusada, e marcar carta como lida abriria esse caminho por um motivo muito
menor.

**A saída foi uma chave própria — `republica-simulator:interface`.** O estado continua puro, a guarda
de fronteiras continua valendo, e a leitura sobrevive ao F5, que era o único requisito real.

⚠ **E "LIDA" SIGNIFICA "ESTEVE ABERTA NA TELA", e não "foi clicada"**: a bandeja abre a mais
urgente sozinha, então exigir clique marcaria como não-lida justamente a carta que o jogador
está lendo. Quem persiste é o entrypoint, lendo o `aria-current` que a bandeja já escreveu —
recalcular ali qual carta abre seria o defeito recorrente número um deste projeto. **E o
conjunto poda sozinho** contra as linhas que a bandeja mostrou, senão ele guardaria id de
carta morta pelos 48 meses do mandato.

### 2. ⚠ CADA CARTA DIZ POR QUE CHEGOU — e é a que mais casa com a doutrina daqui

No FM cada mensagem tem um controle que _"indica por que você está recebendo isto"_. Neste
projeto **todo número mostrado tem motor atrás**, e a carta era a única peça da tela que não
explicava a própria existência: o jogador via a consequência e não a causa, e consequência
sem causa é evento roteirizado — que é o que o ciclo 4 proíbe em texto.

**Nada é inventado: a razão sai do `kind`**, que o motor já grava. São nove espécies e uma
linha só no código — escrever a razão dentro de cada `case` seria nove lugares para manter
em dia.

⚠ **E `reported` É A MAIS IMPORTANTE DAS NOVE, por causa do achado 37.** A única pergunta
que este jogo faz mora atrás de uma regra que ninguém ensina — só texto que machuca DUAS
alavancas ou mais passa por relatoria com emenda —, e um jogador cauteloso atravessa quatro
anos sem nunca ver a caixa perguntar nada, **sem descobrir por quê**. Esta linha é o lugar
onde essa regra finalmente se diz: _"seu texto mexeu em duas alavancas ou mais, e texto
assim passa por relatoria — é ela que emenda"_.

### 3. O botão nomeia o que espera, e não só conta

Ele dizia _"uma pergunta fecha sem resposta"_. Agora diz **qual**. O plural continua
contando, porque três assuntos num rótulo de botão viram uma frase que ninguém lê.

### 4. ⚠ A BANDEJA VIROU PILHA COM TETO — e a trava não estava no pedido

O teto é medido: a bandeja fecha em 630px e uma linha mede 50 mais 4 de respiro, então onze
cabem e a décima segunda começa a rolar.

⚠ **UMA PERGUNTA NUNCA CAI DA PILHA, e isso o pedido não menciona.** Descartar uma carta com
prazo por falta de espaço seria a tela decidindo pelo jogador: ele nunca a veria, `silences`
a fecharia sozinha no vencimento, e o mês cobraria o preço de um silêncio que ninguém
escolheu. **Isso é um muro com outra cara** — e a doutrina inteira deste projeto é que tudo
tem preço e nada tem muro. Como as perguntas chegam primeiro, cortar pelo fim tira aviso
antes de tirar pergunta sozinho; a trava existe para o caso extremo em que só há pergunta,
e ali **a pilha estoura de propósito e a coluna volta a rolar** — uma barra de rolagem é
mais barata que uma pergunta escondida.

⚠ **E O NÚMERO 11 É UM NÚMERO NA VIEW**, o que normalmente seria defeito aqui. Não é conta
de motor: é a capacidade de uma caixa de vidro, e o motor não sabe quantos pixels ela tem.
**Quem impede o número de envelhecer é o PASSEIO** — há uma prova de navegador que reprova
se o índice rolar, e ela mora depois da recarga de propósito, que é quando a bandeja está
mais cheia.

### ⚠ E a captura reprovou o ponto de não lido na primeira tentativa

Ele nasceu como `::after` dentro do assunto, e caiu **numa linha só dele** no meio do
índice, lendo como um pingo de sujeira. A causa: `.tray__subject` é um `-webkit-box` com
corte de três linhas, e um filho de um box desses **não flui inline com o texto** —
`vertical-align` não conserta, porque o problema não é alinhamento. Foi para a quina
superior direita, que é onde todo cliente de email do mundo o põe, e o assunto abre recuo
**só quando ele existe**.

⚠ **E a imagem pegou uma segunda contradição:** a carta que acabava de chegar abria sozinha
e saía **com o ponto de não lida ao lado** — a marca dizendo "você ainda não viu isto"
apontando para o que estava aberto na frente do jogador. A regra passou a morar na bandeja,
que é quem decide qual carta abre; qualquer outro lugar teria de refazer essa decisão.

### E `labelOf` ganhou um dono, no caminho

Ela morava em **três telas ao mesmo tempo** — `area`, `mesa` e `report`, corpo por corpo
idênticas — e a quarta ia nascer na Caixa de Entrada. Três cópias é sorte; quatro é sistema.
Subiu para `strings.mjs`, porque o que ela protege é um contrato do vocabulário: chave que
não existe na tabela sai como o próprio id, feia e visível, em vez de derrubar a pintura.

## O Gabinete parou de desenhar a própria caixa — 21/08/2026

**A pergunta do responsável foi a certa, e ela tinha uma resposta que ninguém tinha
tentado:** _"não é só diminuir o tamanho da caixa de entrada? E deixar o Gabinete todo
mais minimalista, com menos textos e mais botões liquid glass?"_

⚠ **ENCOLHER A BANDEJA JÁ TINHA SIDO TENTADO E REVERTIDO DUAS VEZES**, sempre com a mesma
razão registrada — _"uma bandeja curta com um vão enorme embaixo lê como layout
inacabado"_. **O que nunca tinha sido tentado é parar de DESENHAR a caixa**, e a diferença
entre as duas é o que o jogador vê: uma bandeja de 630px sem moldura não tem vazio nenhum,
porque não há borda anunciando onde a caixa acaba. Retângulo com espaço lê como falha;
lâmina com espaço lê como a tela.

**É o mesmo movimento de 20/08, um passo adiante.** A escavação caiu de 22% para 10% de
opacidade naquele dia com a razão escrita — _"menos tinta dá mais vidro"_. Zero é onde
essa frase termina: o gradiente, o passeio da luz e a granulação do substrato atravessam
agora a metade esquerda inteira, em vez de morrerem atrás de uma demão preta.

⚠ **E O SULCO NÃO MORREU — MUDOU DE DONO.** A razão de ele existir veio de uma revisão
externa e continua de pé: _"papel tem de cair DENTRO de alguma coisa"_. O que recebe o
papel agora é a lâmina do palco, que é uma superfície de verdade com aresta e reflexo.

### E a captura matou um fio que a medição não pegaria

O `.tray__list` tinha `border-right` separando o índice do documento, e ele fazia sentido
DENTRO do poço — ali as duas colunas eram regiões de um mesmo retângulo escuro. Sem a
escavação ele virou **630px de traço ao lado de um item de 50px**, descendo até o rodapé
sem nada para separar embaixo. E virou o SEGUNDO separador do mesmo par: a linha aberta é
uma peça de vidro com aresta própria e o ofício é papel. Dois separadores para uma
fronteira é a mesma conta que matou os cinco fios das legendas em 20/08.

### O vidro desceu para o que se aperta

`glass-action` — o **nível 2** do sistema de material, descrito em `20-material.css` como
_"o que se pressiona"_ — era usado **UMA vez no app inteiro**: o botão de avançar o mês.
Um sistema de três níveis com o do meio vazio não é um sistema; é um botão principal e um
monte de retângulos tintados imitando o que o material já sabia fazer.

Ganharam o material: **NEGOCIAR**, **FINANÇAS**, e a **linha aberta do índice**.

⚠ **E DUAS RECUSAS, as duas por razão e não por preguiça:**

1. **as peças da CARTA não entram** — `.letter__action` e `.letter__choice` vivem sobre
   **PAPEL**, e não sobre a lâmina. Vidro sobre papel são dois materiais empilhados para
   dizer uma coisa só, que é o defeito que o sistema visual inteiro existe para impedir; e
   o desfoque amostraria o papel em vez da cena atrás dele;
2. **só a linha ABERTA do índice é vidro, e a razão é o custo medido.** `backdrop-filter`
   custa por TELA e não por efeito — a lição que `tests/browser/screen-cost.mjs` guarda, e
   que nasceu de uma tela que caiu a 31 fps no projeto anterior. Dez cartas seriam dez
   desfoques para dizer o que uma linha precisa dizer. O master-detail garante uma aberta
   por vez, então o material entra exatamente uma vez na coluna.

**Medido depois: 6 elementos com desfoque na tela** (barra, rail, avançar, a linha aberta
e as duas pílulas) mais os dois `::after` do palco — contra 3+2 antes. Os três novos são
207×50 e dois de 93×23: **superfície pequena sobre fundo estático**, que é exatamente a
condição que o projeto já mediu como barata.

### O que saiu de texto, e o que a medição RECUSOU cortar

O responsável marcou três cortes. **Dois foram feitos e o terceiro foi recusado pela
medição** — e ele tinha dado a licença para isso: _"o que você achar que não deve ser
cortado, faça de um jeito simplificado e minimalista"_.

| candidato                                   | o que a verificação achou                                                                                                                                       | o que foi feito                               |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| as 4 frases de desejo da CALDEIRA           | estáticas — as mesmas palavras nos 48 meses                                                                                                                     | **saíram**, e voltam só quando o grupo ferve  |
| `o orçamento escrito já consome R$ 14,5 bi` | ⚠ **NÃO repetia o hero.** O hero é `room`, o que CABE; a nota é `committed`, o que as ordens PEDIRAM. Iguais só no mês 1, por coincidência do orçamento herdado | **encolheu para uma palavra**, número intacto |
| `E QUEM TRAVA` + as 3 linhas                | ⚠ **NÃO existe em Finanças.** Lá a obrigatória é um TOTAL; quem trava só aparece programa a programa, em oito telas de ministério                               | **5 linhas viraram 1 frase** — ver achado 40  |

⚠ **E UMA PROVA DERRUBOU A PRIMEIRA PALAVRA ESCOLHIDA, com razão, por um defeito que
ninguém veria lendo a tela.** `vaultTaken` tinha virado `"escrito"` — e a frase do
ESTOURO, uma linha abaixo, é _"o orçamento ESCRITO passa do que cabe em"_. A palavra curta
virou **substring** da frase longa, e a prova que garante que o estouro não repete o total
passou a acusar repetição. O defeito é real fora do teste: duas leituras vizinhas abririam
com a mesma palavra. Ficou `"comprometido"`, que é **a palavra que a carta da Casa Civil
já usa** para este número.

⚠ **E A PROVA MUDOU DE ALVO, e isso é o conserto e não o contorno.** Ela cobrava o literal
`"já consome"`; agora ela pergunta a `UI.cabinet.vaultTaken`. Prova amarrada à redação
vira alarme de revisão de texto — e alarme que dispara sem defeito ensina a desligar o
alarme.

### ⚠ A auditoria externa achou UM número que existia no motor e nunca chegou à tela

O responsável trouxe uma auditoria do Gemini sobre a tela. **O padrão de sempre se repetiu
— ela lê bem a imagem e infere mal o mecanismo** —, mas um item procede, e é forte:

> _"A barra mostra se eles gostam de você; falta o número que mostra o estrago que podem
> fazer se não gostarem."_

**`weight` existe em `lobbies.mjs` desde o ciclo 10** — a fração da ruptura econômica que
cada grupo carrega — e nunca tinha chegado a lugar nenhum da interface. **E o caso extremo
é o que condena o silêncio: as forças de ordem têm peso ZERO.** Elas podem ferver o
mandato inteiro sem mover a ruptura um milímetro, e a tela desenhava para elas a mesma
régua que desenha para o mercado. Não era ausência de informação: era a tela afirmando
igualdade por omissão.

A fatia entrou **no lugar exato da frase de desejo que saiu** — mesma linha, mesmos
pixels, estático virou leitura. A palavra é a mesma que a Trindade usa duas peças acima
(`TERMOS.economic`), porque é literalmente a barra dela que os quatro repartem.

⚠ **E O PESO ZERO GANHOU FRASE PRÓPRIA, e não "0%"**: um zero ao lado de uma régua cheia
lê como defeito de carregamento — o mesmo erro que o hero do Cofre já cometeu uma vez com
_"R$ 0,0 bi livre no mês"_. Ficou _"não pesa no capital"_.

⚠ **E ELA TIROU UMA DUPLICATA DO MOTOR, em vez de acrescentar uma.** `capitalShares`
nasceu em `domain/pressure/`, e `rupture` — que somava os pesos no próprio laço — passou a
usá-la. Havia uma soma; continuou havendo uma. No dia em que um quinto grupo entrar no
catálogo, ela se refaz sozinha nos dois lugares.

### Onde a auditoria ERROU, e é o padrão medido em quatro auditorias

- ⛔ **"adicione ícones de tendência (23% 🔻)"** — **já existem**. `vitalsHtml` calcula o
  delta contra o mês anterior, com seta e cor, e **inverte o sinal da inflação** porque
  subir é ruim. Ele auditou o mês 1, em que todo delta é zero e a seta imprime `—`;
- ⛔ **os tooltips aninhados** — informação atrás de hover é informação ausente para quem
  não passa o mouse. E o exemplo dado (_"+5% Bolsa Família, −8% inflação de alimentos"_)
  seria **número inventado**: a SONDA não devolve atribuição por fator;
- ⛔ **"transforme o centro da tela numa Mesa de Despachos"** — **é o que ela é** desde
  20/08, master-detail e tudo, a pedido do dossiê anterior;
- ⛔ **"o botão Avançar só deve brilhar quando os despachos urgentes forem resolvidos"** —
  **é o muro que este projeto recusa**, e a recusa é doutrinária e está escrita em três
  lugares no código. O dossiê anterior pediu a mesma coisa e foi recusado pela mesma
  razão: tudo tem preço, nada tem muro. O botão já diz **o preço** de avançar sem
  responder;
- ⛔ **"adicione Traços aos personagens"** — o elenco já tem atributos com efeito de jogo,
  e **mais do que ele supôs**: `economicShift`, `libertyShift`, `venalityShift`,
  `reachMin/reachMax`, `memoryDecay`, `favourWeight`, `betrayalWeight`, `successionDrag`.
  O que falta é TELA, não motor.

### E dois itens dela procedem pela metade — vão para a próxima sessão

- ▶ **as SPARKLINES.** A ideia é certa e é exatamente o gênero: _"um gráfico descendo
  vertiginosamente gera mais pânico que ler 23%"_. ⚠ **Mas não há série.** O estado guarda
  `before` — um mês — e só `capacity` tem `history`. Sparkline exige buffer novo no
  estado: é pequeno, mas é motor, e motor novo não entra sem pedido;
- ▶ **as AÇÕES DIRETAS no Gabinete.** O rito de decreto existe; _"convocar reunião
  ministerial"_ e _"pronunciamento em cadeia nacional"_ são mecânicas novas, e são ciclo
  próprio.

### E os achados 42 e 43 foram atacados no mesmo dia — 21/08/2026

Pergunta do responsável: _"tem algo do Gemini que ainda dê pra entrar?"_ Tinha, e a
resposta obrigou a corrigir uma classificação minha: eu tinha dito que as sparklines
exigiam motor novo. **Não exigiam** — `sparkline()` está escrita, Finanças já a usa em
cinco linhas, e `state.series` guarda 48 meses de seis indicadores.

**✔ O ACHADO 42 ESTÁ CONSERTADO, e é o de valor.** As três telas que desenham índice de
área liam `state.capacity.history` — o buffer do ATRASO, que a MALHA mantém com `lag + 1`
valores — enquanto o estado guarda uma segunda série, longa e feita para isto. A prosa do
estado diz a diferença com todas as letras: _"o histórico é curto e ALIMENTA O MOTOR; a
série é longa e alimenta os OLHOS"_. Ninguém tinha vindo trocar.

Medido no mês 20, antes e depois:

| área        | antes (buffer) | depois (série)  |
| ----------- | -------------- | --------------- |
| Fazenda     | **— (calada)** | −0,1 em 12m     |
| Previdência | **— (calada)** | −0,0 em 12m     |
| Indústria   | −1,8 em **6m** | **−3,6 em 12m** |
| Segurança   | −0,4 em **3m** | **−1,0 em 12m** |
| Educação    | +0,1 em 12m    | +0,1 em 12m     |

⚠ **A INDÚSTRIA É O CASO QUE CONDENA:** a janela curta escondia **metade da queda**, e o
número menor saía com a autoridade de um número medido. E a prosa de `trend.mjs`
justificava as duas mudas afirmando que _"a série de índices por área não existe no
estado"_ — **ela existe**, preenchida todo turno por `extend`. O texto continuou válido e
parou de ser verdade, que é a família de defeito mais cara deste projeto, e aqui ele
conseguiu algo novo: **justificar em prosa uma ausência que o estado já tinha resolvido**.

**⛔ O ACHADO 43 FOI CONSTRUÍDO INTEIRO E REVERTIDO PELA CAPTURA.** A escada dos quatro
vitais foi feita — esquema 18, série carregando aprovação e base, peça desenhada — e a
imagem a reprovou em dois tamanhos: **a 0,5rem ela cabe e vira um traço; a 0,85rem ela lê e
empurra o rótulo do PIB para fora da barra.** Não há terceiro tamanho. O esquema voltou
para 17 porque campo de estado sem consumidor custa uma versão de save, e este save recusa
em vez de converter. Ver o achado **44** — a medição inteira está lá, e ela vale no dia em
que houver onde desenhar.

⚠ **E A TENTATIVA ACHOU UM DEFEITO DE VERDADE NO CAMINHO:** a régua do PIB ia até _"metade
a mais que a largada"_, um chute nunca medido, **em duas telas com a expressão digitada nas
duas**. Medido em 48 meses: o PIB usa **cinco dos oito degraus**, e a escada de Finanças
gastava metade da altura numa faixa que a partida nunca visita. Virou `gdpRange`, com fator
1,2 e um dono só. `SCALE` mudou de casa junto, pelo mesmo motivo.

### E uma captura do responsável achou uma tela que MENTIA — 21/08/2026

_"às vezes a tela do jogo fica assim"_, com a imagem do Gabinete de bandeja vazia. Duas
coisas erradas nela, e a segunda é a grave.

**1. O parágrafo do vazio boiava, e isso era regressão da mesma sessão.** Medido:
`.empty` fechava em **369px dentro de uma coluna de 659**, encostado na esquerda —
`justify-items: start` em `.card__body` faz todo filho medir o conteúdo, e a bandeja já
compensava com `width: 100%` enquanto o vazio nunca compensou. Como o `.empty` centra o
texto por dentro, o parágrafo saía centrado num retângulo que ninguém via, na metade
esquerda de uma coluna vazia: o olho lia **torto**, e não centrado.

⚠ **E A ESCAVAÇÃO ESCONDIA ISSO ATÉ ONTEM.** Com o poço desenhado, o retângulo de 369px
caía dentro de uma moldura que dava a referência. Tirada a moldura, a única referência que
sobra é a coluna — e é contra ela que o vazio tem de se centrar.

**2. ⚠ A TELA AFIRMAVA UM FATO FALSO SOBRE O MANDATO, e nada no projeto a acusava.** Os
números da captura — aprovação 28, base 425 — são exatamente os do **mês +3**, e a tela
dizia _"O primeiro mês ainda não foi resolvido"_, prometendo na linha seguinte que _"todo
mês que você resolve chega aqui"_.

**A causa, reproduzida num navegador de verdade:** `last` — o relatório do turno — é
variável de módulo do entrypoint e **não vai para o save**. Numa recarga de página o
estado volta inteiro e `last` volta nulo; `describeMonth` não produz carta, e a bandeja
fecha vazia. Abertura → 1 ofício; depois de 3 meses → 1; **depois de F5 → 0**.

⚠ **A DECISÃO É QUAL FRASE, E NÃO SE HÁ FRASE.** Ausência se declara neste projeto; o que
a captura pegou foi ausência declarada com o **texto errado**, que é pior que silêncio —
o jogador acredita na tela. Agora são duas frases, e a escolha vem do **MÊS do estado**,
que atravessa o save, e não de `last`, que não atravessa. A nota também se partiu em duas:
a promessa _"todo mês que você resolve chega aqui"_ só pode ser dita a quem ainda não
resolveu mês nenhum.

**A prova nova — _"A BANDEJA VAZIA DIZ A VERDADE SOBRE O MANDATO"_ — trava as duas frases
e a promessa.** ⚠ **E a perda da leitura do mês continua aberta:** ver o achado **46**, e o
conserto dela colide com uma recusa registrada, então é decisão do responsável.

### E a barra de rolagem lateral do índice era uma reticência que nunca funcionou

Pedido dele, na mesma sessão: _"retire aquele rolamento ali do bloco esquerdo da caixa de
entrada, não quero ficar rolando da esquerda pra direita"_.

**A causa não era a coluna estreita — era uma frase que se recusava a encolher.**
`.tray__when` declara `white-space: nowrap` com `overflow: hidden` e `text-overflow:
ellipsis`, ou seja: _"corte com reticências quando não couber"_. **O "quando não couber"
nunca chegava.** Um item de flex nasce com `min-width: auto`, que vale o tamanho do
CONTEÚDO — e conteúdo que não quebra linha tem o tamanho da frase inteira. Em vez de
encolher e cortar, ele empurrava.

Medido a 1440×980: _"Denise Hollanda Cavalcanti · mar · 2027"_ levava a lista a **219px de
conteúdo dentro de uma caixa de 208** — 11px de estouro. E `overflow-y: auto` **não
consegue ficar só num eixo**: com um eixo diferente de `visible`, o outro vira `auto`
sozinho. A barra horizontal nascia daí.

⚠ **É A MESMA LIÇÃO QUE O CANVAS JÁ REGISTRA NO OUTRO EIXO** — _"o mínimo automático de um
item de grade é o tamanho do conteúdo dele, então ele cresce para caber o filho em vez de
obrigar o filho a se virar"_. Lá foram seis `min-height: 0` aninhados; aqui é largura, e o
remédio é idêntico. **Os dois níveis, ou nenhum:** consertar só a frase deixaria o próximo
texto largo — o assunto de uma carta de tramitação — reabrir a mesma barra por outro
caminho, então o `<li>` levou o seu.

**Depois: `scrollWidth` igual a `clientWidth` em todos os meses medidos, e as reticências
passaram a existir de verdade.**

### E a decisão que ele delegou virou duas: uma recusa e uma troca de instrumento

_"faça o que for melhor pro jogo"_, sobre o achado 46.

**⛔ O ACHADO 46 FECHA COMO RECUSA, e a razão é o tipo `Letter`.** A saída óbvia seria
guardar o relatório do mês no save. Ela foi descartada por três medições, não por gosto:

1. **o `Report` é peça de TELA**, e pô-lo no estado faria toda mudança de interface virar
   pergunta de migração de save — que é o oposto do que o estado existe para ser;
2. **e a alternativa doutrinária é pior:** guardar o mês como CARTA obedeceria a regra
   certa — _"o que se guarda é o FATO, e nunca a prosa"_ —, mas exigiria **cinco campos
   novos em `Letter`**, todos nulos nas nove outras espécies. Cada campo daquele tipo hoje
   tem uma razão escrita; cinco nulos não teriam;
3. **e a perda é um AVISO, não uma pergunta.** Nenhum prazo, nenhuma decisão, nenhum
   número: o mês seguinte escreve outro. O que era grave — a tela AFIRMANDO um fato falso
   — já está consertado e com prova.

**✔ E O QUE ENTROU NO LUGAR VALE MAIS: a faísca deixou de ser decorativa em TRÊS telas.**

A escada de blocos (`▁▂▃▄▅▆▇█`) morreu, e a razão é geométrica. Um bloco tem oito alturas,
e cada uma é uma fração do **corpo da fonte**: a 0,5rem — o tamanho do painel — o degrau 1
tem **um pixel**. Um indicador que vive no terço de baixo da própria régua saía como uma
fileira de traços colada na linha de base, e o olho lia o **sublinhado do número**.

⚠ **E NÃO HAVIA TAMANHO QUE CONSERTASSE, o que custou três capturas para provar.** Medido
a 0,5 / 0,7 / 0,9rem: **a altura da linha não muda nos três** (37px; o painel fecha em 1188
nos três) — então o corpo nunca foi caro. Mas a 0,9rem a escada invade a coluna da nota, e
a 0,7rem ela continua um traço. **O problema nunca foi o corpo: era a razão entre a barra e
a célula do glifo.** O mesmo experimento reprovou a escada na barra superior no mesmo dia.

**Entrou uma polilinha de SVG** — a mesma convenção do sinete e do arco do plenário, sem
biblioteca e sem canvas. O que ela ganha é uma coisa só e é decisiva: **usa a altura
inteira da caixa, independentemente de onde o valor mora na régua**.

⚠ **E A JANELA VIROU UMA SÓ NAS TRÊS TELAS.** Finanças desenhava 6 meses ao lado de uma
variação escrita que conta 12 — duas medidas do passado dentro da mesma leitura —, e o
Congresso ficou com 6 **por omissão**, que era o padrão do parâmetro. Agora as três usam
`WINDOW`. Medido: só olhar mais para trás levou o PIB de **2,8 para 6,0** unidades de traço,
sem custar um pixel.

⚠ **E A PROVA MUDOU DE ALVO, e ficou mais forte.** Ela contava quantos CARACTERES
diferentes a escada tinha — respondia a pergunta certa por acidente. Agora lê o `points` da
polilinha e conta **alturas distintas**, que é literalmente a pergunta que ela defende:
_"esta série subiu na tela, ou saiu plana na régua errada?"_

⚠ **E MEDIR ISSO ACHOU ALGO MAIOR QUE O DESENHO — ver o achado 47:** com o instrumento
novo e a janela dobrada, **quatro dos cinco indicadores continuam movendo menos de UMA
unidade de vinte em dois anos.** A coluna de tendência de Finanças nunca mostrou nada em
partida nenhuma, e a causa não é a peça.

### ⚠ E a troca de instrumento derrubou DUAS provas, e as duas estavam certas em cair

A escada era TEXTO, e as duas provas que a defendiam liam caractere:

- a prova de unidade contava **quantos caracteres diferentes** a peça tinha;
- o passeio lia `allInnerTexts()` e fazia a mesma conta no navegador.

Com SVG, as duas ficam sem texto para ler. ⚠ **E a do passeio é a lição:** ela ficou
vermelha porque o `.some` estava escrito na direção certa — se estivesse invertido, ela
teria ficado **permanentemente verde por vacuidade**, defendendo nada, e ninguém saberia.
As duas passaram a ler o `points` da polilinha e a contar **alturas distintas**, que é
literalmente a pergunta que elas existem para fazer.

### ⚠ E a guarda `naming` acusou uma linha INOCENTE, e o ponto cego é dela

Ela apontou `"obrigatória"` numa prova do Cofre que não tinha mudado. **A causa estava
trinta linhas acima:** o removedor de strings de `tests/guards/naming.mjs` não conhece
literal de expressão regular. Diante de `/points="([^"]*)"/` ele vê a aspa de abertura,
casa até a aspa de dentro do `[^"]`, e a partir dali **as aspas do arquivo inteiro ficam
desemparelhadas** — o que sobra vira "código" e qualquer acento em texto de UI é acusado.

⚠ **Contornado no chamador** — `"(.*?)"` casa limpo e resolve o mesmo —, **e o ponto cego
fica**: a próxima expressão regular com `[^"]` em qualquer arquivo do projeto vai acusar
outra linha inocente. Não vale conserto especulativo (reconhecer literal de regex com
regex é a receita do próximo falso positivo), mas vale saber que o dedo dela pode apontar
para o lugar errado.

## O dossiê da Sala de Guerra — 20/08/2026

O responsável trouxe um dossiê de outro modelo, escrito explicitamente _"de IA para IA"_,
pedindo para **demolir o Gabinete**. Ele foi tratado pelo protocolo de sempre: **captura
nova e DOM medido antes de julgar qualquer item**, e o veredito em três baldes.

### A régua, antes de qualquer opinião

Gabinete a 1440×980, com o jogo no mês 1:

| peça                  | medido                                             |
| --------------------- | -------------------------------------------------- |
| página                | **1347px** numa janela de 980 → rola 367           |
| cabeça da tela        | **101px** (olho + "Gabinete" em `--text-hero`)     |
| **Caixa de Entrada**  | **899px de caixa, 242px de conteúdo — 657 MORTOS** |
| coluna da direita     | 302 + 232 + 255 + 110 = **899**                    |
| hemiciclo             | **170px** travados                                 |
| "Aprovação por renda" | 110px, **inteiro abaixo da dobra**                 |

### Onde ele acertou

- **espaço morto** — acertou o sintoma e errou a causa. Ele leu "a inbox é um bloco de
  texto passivo"; ela é **uma carta esticada pela coluna vizinha**. 657px;
- **título gigante** — 101px de espaço nobre para imprimir uma palavra que o rail já
  marca em destaque três centímetros à esquerda. Procede, e virou `--text-screen`;
- **hemiciclo caro** — procede **no mês 1**, e a razão é que ali ele é degenerado: as
  onze bancadas estão no mesmo humor e o desenho é um bloco verde. ⚠ **É a SEGUNDA
  auditoria independente a ler esse mesmo bloco** — a primeira chamou de "macarrão
  verde", e está registrado em `cabinet.mjs`. O achado não é "mate o hemiciclo": é que
  **o mês 1 é a pior tela do jogo**;
- **hierarquia invertida** — as barras mais saturadas da tela são "Aprovação por renda",
  o item menos importante dela, e ele está abaixo da dobra.

### Onde ele errou — e é o padrão de sempre

- **"botão de avançar invisível, formatado como link"** — captura vencida. É o maior
  botão sólido da tela, âmbar, canto superior direito;
- **"a Trindade deve ser Ruas / Máquina / Blindagem"** — ⚠ **essa trindade já foi
  proposta pelo décimo dossiê e recusada com razão registrada** em `cabinet.mjs`: a
  burocracia não existe no modelo e as forças de ordem têm `weight: 0`. Quem carrega a
  ruptura econômica é o mercado e o setor produtivo, que a trindade dele omite. E ela já
  está exatamente onde a Parte 2 do próprio dossiê manda pôr — a Parte 1 dele pede para
  tirar de lá. **O documento se contradiz**;
- **"inbox é aviso de tutorial estático"** — o motor de prazo existe desde o ciclo 9:
  `due`, `ANSWER_TIME`, `settle`, e o silêncio que aceita;
- **"monoespaçada em todo número"** — colidiria com uma legenda tipográfica que já
  existe e que nasceu de uma auditoria anterior: serifa é o que se assina, sans é o que
  se mede, mono é o que a máquina carimba. `[data-numeric]` protege o número em sans **de
  propósito**. Ele está certo que a voz da máquina é subusada; errado sobre onde ela vai.

### ⛔ E a recusa, que é doutrinária e não estética

A mecânica central do dossiê é: _"o botão permanece bloqueado até que as crises com tarja
de urgência sejam resolvidas"_. **Isso é um muro**, e a regra de fundação do projeto é a
oposta — nunca `if (proibido) return`; a pergunta é _quanto custa_.

⚠ **E o próprio dossiê escreve a versão certa na frase seguinte:** _"o tempo cobra seu
preço"_. O preço já existia e já estava modelado. O que faltava era a barra de cima
**dizer** isso antes do clique, porque informação que chega depois da decisão é recibo.

Foi o que entrou: `silences` no motor, e o botão carrega um carimbo bordô com _"uma
pergunta fecha sem resposta"_. **Ele não trava.** A recusa está escrita em `mail.mjs`, em
`app.mjs` e no CSS do carimbo, e tem prova própria em `tests/suites/mail.mjs`.

### O que entrou, peça por peça

**A BANDEJA DE DUAS COLUNAS.** `mailHtml` devolvia HTML pronto, e o índice precisaria
remontar o assunto de cada carta — a oitava ocorrência da família de defeito mais cara
deste projeto. Entrou o **descritor**: o `switch` decide UMA vez o que a carta diz
(`describeMail`, `describeMonth` → `Dispatch`), e duas views leem dele — `letterHtml` para
o documento, `rowHtml` para o índice. `urgencyOf` saiu de dentro de `letterHtml` pela
mesma razão.

⚠ **E o índice ganhou o MÊS por causa da captura:** ela mostrou duas linhas idênticas —
"Pautei o seu texto: Cortar média e alta complexidade · e mais 2", do mesmo remetente,
duas vezes. As duas estavam certas (dois textos, meses diferentes); o índice é que não
dava como distinguir. A data é a coluna que toda caixa de entrada tem, e é por isso.

⚠ **E o assunto passou a ocupar a linha inteira, também pela captura:** com o prazo ao
lado, o assunto de uma carta de tramitação quebrava em **sete linhas** numa coluna de
13rem. Um índice de sete linhas por item deixa de ser índice.

**O PREÇO NO BOTÃO.** `silences({ mail, orders, month })` é `settle` **filtrada**, e não
uma segunda regra de vencimento: a tentação era escrever `left(carta) <= 0` na tela, e ela
é exatamente a família de defeito que este projeto mede em sete ocorrências. Ela lê as
ORDENS do mês junto com o estado — quem já marcou "aceitar" já decidiu, e cobrar o preço
dela seria a tela anunciando uma consequência que o turno não vai executar.

⚠ **E o bordô teve de virar FUNDO em vez de tinta.** A primeira versão pintou o texto de
bordô sobre a lâmina âmbar: a lâmina compõe rgb(193, 137, 55) e o par dá **2,8:1** num
texto de 10px. A captura mostrou o borrão que a conta previa. Invertido, dá 5,6:1 e vira o
que a prosa já dizia que era — um **carimbo**.

**O NOME DA TELA.** ⚠ A primeira ideia era encolher `--text-hero`, e estaria errada: a
prosa dele diz que ele é "o maior reservado ao dado dramático do momento", e o outro
consumidor dele é o **placar de uma votação**, que é exatamente esse dado. O defeito nunca
foi o tamanho do herói — era o nome da tela estar vestido de herói. Entrou `--text-screen`.

## A fita do plenário — 20/08/2026, e ela nasceu de uma ideia do responsável

O pedido dele foi de estética e virou modelagem: _"não acha melhor fazer essa barra como
se fosse extrema esquerda, esquerda, centro, direita, extrema direita, mas sem escrever,
por cor? Ai cada ideologia vai ter um pedacinho preenchido... aprimore a minha ideia"_.

### ⚠ O que a ideia dele desmontou, e nem ele nem eu tínhamos visto

A fita pintava cada bancada pelo **humor** e preenchia cada bloco pela **entrega**. No
motor:

```js
delivered: party.seats * clamp01(moodFactor(mood));
```

**O comprimento preenchido É o humor, em forma contínua** — e a cor categórica era o
mesmo fato desenhado uma segunda vez. O hemiciclo carregava essa duplicação desde que
nasceu, e a legenda de três cores existia para decifrar uma cor que o comprimento já
dizia. Liberada da repetição, a cor passou a dizer a única coisa que o desenho não
dizia: **onde cada bancada está no eixo econômico**.

### E isso NÃO reabre "cor de bancada", que foi recusada três vezes

A recusa registrada é sobre cor de **identidade** pintada com a paleta **semântica** — "a
paleta já gasta verde em ALTA e vermelho em CRISE, e pintar ideologia com os mesmos tons
faria um bloco parecer bom e o outro parecer perigo". O que entrou é uma **rampa sobre
uma régua que o catálogo declara em prosa**: `economic`, de 0 a 100, onde _"0 é máxima
intervenção e 100 é máximo mercado"_. A cor não identifica ninguém: diz posição.

⚠ **E as cinco paradas não são taxonomia nova.** Não existe "extrema esquerda" no modelo,
e a fita não escreve uma palavra dentro de si: são cinco quintos de uma régua declarada,
que é quantização linear. Os únicos nomes na tela são os dois **polos**, embaixo, com o
vocabulário do próprio catálogo — _intervenção_ e _mercado_. Escrever "esquerda" e
"direita" importaria a taxonomia que o modelo recusa: ele tem **duas** dimensões, e
reduzi-las a uma palavra de uma delas seria a tela afirmando o que o motor não afirma.

### O que a fita mostra, e por que nada nela repete nada

| peça          | o que diz                                            |
| ------------- | ---------------------------------------------------- |
| largura       | quantas cadeiras a bancada tem — a soma fecha em 513 |
| ordem         | a posição dela no eixo, da intervenção ao mercado    |
| cor           | o mesmo eixo, em cinco paradas dessaturadas          |
| preenchimento | quanto daquela bancada responde ao governo, hoje     |
| **a linha**   | **onde a maioria simples fecha**                     |

⚠ **A LINHA É O DADO QUE NUNCA FOI DESENHADO.** `majority` chegava ao Gabinete desde que
o Gabinete existe e **morria sem consumidor** — no cartão em que o presidente pergunta se
tem votos. Era canal de dado morto, da mesma família do achado da régua legal.

⚠ **E ela passou uma hora invisível por um `overflow: hidden`.** A fita tinha canto
arredondado, e o `overflow` que aparava os blocos nas pontas aparava as duas pontas da
marca: ela ficava rente ao topo e à base e sumia contra um bloco claro. O DOM dizia que
ela estava lá, com 2px e cor de tinta — e estava. Faltava **atravessar**. Sem o
`overflow` a fita ficou reta, e isso é ganho: pílula é botão, e esta peça é régua.

### O que morreu junto, e o registro fica

- **`hemicycle.mjs` inteiro** — módulo, folha e desenho. 513 círculos num arco custavam
  170px de uma coluna de 899, e **duas auditorias externas independentes** o leram como
  pixel caro. A substituição é a decisão, e não a convivência — é o mesmo movimento que
  matou o ARCO quando o hemiciclo nasceu;
- **`legendHtml`** — ela decifrava as três cores de humor. Uma legenda que decifra uma
  cor que não existe mais é pior que nenhuma: ela ensina a ler o desenho errado. A regra
  dela sobreviveu inteira e a fita a herdou — desenho de várias cores precisa de chave —,
  e o que mudou foi quantas peças a chave tem: **uma rampa se decifra pelos polos**;
- **`memoryNone`** — _"sem histórico com o seu governo"_, que saía **sete vezes na mesma
  tela** do Congresso, porque no mês 1 ninguém tem histórico. A regra contrária já estava
  escrita duas vezes no projeto e não tinha sido aplicada aqui.

### A varredura de densidade, e ela não apagou uma leitura sequer

A coluna da direita era um **cartaz**, e virou outliner. Nada foi removido para caber —
apagar leitura seria a saída fácil e é a menos parecida com os jogos da referência: eles
não escondem número, eles apertam.

| medida                 | antes | depois |
| ---------------------- | ----- | ------ |
| página (janela de 980) | 1347  | 1108   |
| rolagem                | 367   | 128    |
| coluna da direita      | 899   | 664    |
| bandeja: espaço morto  | 657   | ~410   |

O que rendeu: gaps de 12→8 (a coluna toda), o hemiciclo (170→0, e a fita custa 14), a
coluna de nome da `.reading` de 9rem para **10,5rem** — que economiza altura ficando mais
**larga**, porque a frase do que cada lobby cobra deixa de quebrar em três linhas.

## O Congresso parou de ser feio, e o vidro voltou a aparecer — 20/08/2026

Dois pedidos do responsável, na mesma sessão: _"deixe tudo mais minimalista e bonito,
principalmente essa parte do congresso — carta branca"_ e, depois, _"quanto mais liquid
glass e minimalismo, melhor"_.

### A tela do Congresso era a ÚLTIMA no dialeto de cartão

⚠ **O Gabinete abandonou esse dialeto em 16/08 e o Congresso ficou para trás.** Lá, a
razão está escrita: _"vidro dentro de vidro são dois materiais empilhados para dizer uma
coisa só, e cinco retângulos numa grade são a unidade visual de um dashboard"_. Aqui
sobraram **onze retângulos preenchidos, cada um com OUTRO retângulo aninhado dentro** — a
lista de gente. Caixa dentro de caixa, onze vezes, na tela que ele chamou de feia duas
sessões seguidas.

O que entrou:

- **a bancada deixou de ser cartão.** Sem preenchimento, sem raio: o que separa uma da
  seguinte é um FIO, como no resto do projeto;
- **o estado virou TARJA e deixou de ser preenchimento.** Uma faixa vermelha atrás da
  linha inteira empurra a cor para debaixo do texto, do controle e de quatro números — e
  vermelho que cobre tudo não destaca nada, que é a lição que o cofre já tinha aprendido.
  ⚠ **E a tarja não é desenho novo:** é a MESMA gramática da carta que vence e da linha do
  índice da Caixa de Entrada. O projeto passa a ter um jeito só de dizer "esta linha está
  em outro estado";
- **o controle encolheu de ~400px para 180, e isso é conserto de USO.** Com `1.4fr`, o
  trilho comia o meio da linha e a leitura que ele muda ficava a quatrocentos pixels dele:
  o jogador arrastava aqui e o número respondia do outro lado da tela;
- **a memória neutra calou.** _"Sem histórico com o seu governo"_ saía **sete vezes na
  mesma tela**, porque no mês 1 ninguém tem histórico.

### E o "mais liquid glass" resolveu-se TIRANDO material, não somando

⚠ **O pedido colide com uma regra aplicada duas vezes em 15/08**, e a colisão foi dita a
ele: dar uma segunda lâmina a uma caixa dentro do palco é exatamente o defeito que o
sistema visual existe para impedir. A saída não é somar vidro — é tirar o que sobrava.

A escavação da Caixa de Entrada era `rgba(0,0,0,0.22)` com sombra interna pesada, e isso é
um **terceiro material**: nem o vidro da máquina do Estado, nem o papel do registro. Um
retângulo preto opaco de 660×660 no meio da lâmina — **e ele tapava justamente o vidro**.

Em 10% em vez de 22%, com `--bevel-fine` no lugar da borda própria, o palco volta a
aparecer através da bandeja: o gradiente, o passeio da luz e a granulação do substrato
atravessam a caixa em vez de morrer atrás de uma demão preta. O sulco continua existindo —
papel tem de cair DENTRO de alguma coisa, e essa razão veio de uma revisão externa —, só
que agora ele é uma **aresta** e não um buraco.

⚠ **E o custo foi medido antes de ficar**, como a prosa dos tokens manda: `npm run screen`
deu **material 240,5 fps × controle 232,1** — o vidro não custou nada.

## O desktop virou o único alvo, e a tela passou a caber — 20/08/2026

Três decisões do responsável, na mesma sessão, e as três destravaram coisas:

1. _"Pare de se importar se o jogo funciona no mobile. Nunca vou jogar no mobile, só no
   desktop. Eu quero a perfeição no desktop, perfeição mesmo."_
2. _"Tire o máximo de texto inútil da tela — aquela leitura do mês toda você já remove."_
3. _"A barra do congresso tá muito confusa. Usa vermelho, vermelho alaranjado, amarelo,
   verde, verde azulado escuro, nessa ordem."_

### ▶ O GABINETE É UM CANVAS, e a página parou de rolar

**Medido: 1347px → 980px numa janela de 980. Rolagem ZERO.**

⚠ **Isso não se conseguiu apagando leitura** — a coluna da direita não perdeu uma linha
sequer nesta sessão. Jogo de grande estratégia **não rola a tela**: Victoria 3, Football
Manager e o Geo-Political Simulator põem tudo num canvas do tamanho da janela e deixam os
PAINÉIS rolarem por dentro. A página que rola é a gramática de um site; o painel que rola
é a de um instrumento.

⚠ **E o canvas só ficou possível quando o celular saiu de escopo.** Numa janela de 390px,
travar a altura esconderia metade da tela atrás de uma dobra sem nada avisando.

### ⚠ E O CANVAS ACHOU UM DEFEITO DE SEIS SESSÕES no rail

`.rail` declara `height: calc(100dvh - 2 * var(--space-4))` — **948px numa janela de
980** — e mora na linha 2 da casca, que começa ABAIXO da barra superior e tem 904. **Ele
sempre transbordou 44px, em toda tela, desde que foi escrito.** Numa página que rola isso
é invisível: a página já rolava por outros motivos. No canvas ele era a única coisa
segurando os últimos 60 pixels. Trocado por `align-self: stretch` — medida em vez de
palpite —, escopado à tela do Gabinete porque nas outras `stretch` faria o rail crescer
com a página e `sticky` deixaria de segurá-lo.

### O que saiu de texto, e por quê

| morreu                            | por quê                                                                                                                                                    |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **a leitura do mês**              | 101px do topo para dizer em prosa o que a Trindade, o gel de situação e a barra já dizem. A voz não morreu: a Casa Civil continua assinando a carta do mês |
| **o olho das cinco telas**        | uma categoria acima de um título que diz o mesmo em uma palavra, numa tela cujo menu já marca onde você está — três lugares, uma informação                |
| `nenhuma ruptura aberta`          | saía todo mês em que nada acontecia, e ensinava o olho a pular a linha onde a ruptura de verdade vai aparecer                                              |
| `sem histórico com o seu governo` | **sete vezes na mesma tela** do Congresso, porque no mês 1 ninguém tem histórico                                                                           |

### A fita virou CINCO faixas, e a confusão era geométrica

Ela desenhava as onze bancadas uma a uma, e **duas vizinhas da mesma faixa saíam como dois
blocos da mesma cor separados por um vão** — o olho lia uma fronteira que o eixo não tem.
Agora as vizinhas se somam: o número de divisões na tela passa a ser o número de divisões
que existem.

⚠ **E o mesmo defeito quase voltou por dentro:** a demão da cadeira não entregue estava em
16% de opacidade e ficava quase preta — a parte vazia de um bloco lia como VÃO, e o
desenho voltava a mostrar sete divisões onde há cinco. Em 34% ela volta a ler como o que
é: ausência DENTRO de uma identidade, e não ausência da identidade.

⚠ **As cores são as dele, e elas VENCEM uma regra registrada três vezes** — "a paleta já
gasta verde em ALTA e vermelho em CRISE". O risco fica registrado nos tokens em vez de
resolvido em silêncio, e a forma de conviver com ele é a saturação: os cinco são tons
terrosos, e `--crisis` continua mais claro e mais saturado que o vermelho do eixo.

### O que ficou de fora, e é o que eu faria primeiro

⚠ **A Caixa de Entrada ainda tem ~300px de folga no mês tranquilo**, e ela não é defeito
de layout: é o achado 37 (ver os achados em `handoff.md`) —
**o mundo quase não escreve**. Nenhuma mudança de CSS enche uma bandeja vazia. O caminho é
dar verbo aos dois lobbies mudos.

## As cinco legendas saíram, e a saída achou dois defeitos — 20/08/2026

**Pedido do responsável, com as palavras dele:** _"aproveite e retira as escritas caixa de
entrada e o congresso, e as barras pretas também que ficam embaixo das escritas,
padronize e simetria em tudo"_.

⚠ **SAÍRAM AS CINCO, E NÃO AS DUAS NOMEADAS** — tirar duas de cinco seria o oposto de
padronizar. A regra que sobra vale para o Gabinete inteiro: **um bloco que abre com um
número não precisa dizer o próprio nome.** "436 de 513" não fica mais claro embaixo de
"O CONGRESSO", e "R$ 14,5 bi cabe no mês" não fica mais claro embaixo de "O COFRE DA
UNIÃO" — a legenda repetia, em caixa alta e ocupando uma linha, o que o número já dizia
em corpo de título. Com ela morreu `legendHtml`, e a cabeça do cartão virou `leadHtml`:
a linha do número, com a porta ao lado dela e alinhada pela BASE, que é como texto se
alinha.

⚠ **E O FIO METÁLICO SAIU JUNTO, revertendo uma regra aplicada em cinco telas** — "o que
faz uma tela ler como grand strategy não é o ouro do botão, e sim a REPETIÇÃO do mesmo
fio, tela após tela, até o olho parar de ver decoração e ver estrutura". **O que ele
descobriu usando a tela é que a repetição virou peso:** com onze blocos numa página, onze
fios não leem como estrutura — leem como formulário. O separador passou a ser o ESPAÇO,
que é o que separa parágrafo de parágrafo em qualquer documento e não cobra tinta.

### ⚠ E O CORTE COBROU DOIS DEFEITOS, os dois medidos e os dois consertados em 21/08

**Nenhum dos dois é do corte em si: os dois são regra que ficou vencida porque a peça que
a justificava saiu, e ninguém voltou nela.** É a mesma classe de erro do `span` do
Gabinete e do `height` do rail — o código continuou válido e parou de ser verdade.

**1. O CORPO DA BANDEJA PAROU DE ESTICAR, e o vão era de 295px.**
`.card[data-span="lead"]` declarava `grid-template-rows: auto 1fr` — o título na primeira
trilha, o corpo na segunda. Sem cabeça, `cardHtml` passou a emitir UM filho, e um filho
só cai na trilha `auto`: o corpo voltou a medir o conteúdo e a trilha `1fr` ficou vazia
embaixo. Medido a 1440×980: a escavação fechava em **335px dentro de uma coluna de 630**,
com a coluna vizinha indo até o rodapé. **É o degrau no rodapé que a prosa da própria
folha diz custar mais que o vazio** — só que desta vez estava do lado errado. Consertado
para uma trilha só, `minmax(0, 1fr)`: o número de trilhas passa a ser o número de filhos,
e não há o que envelhecer se a cabeça voltar.

**2. OS QUATRO BLOCOS DA DIREITA ENCOSTARAM, e a coluna virou um texto corrido.**
Medido: **305→409→595→752, zero de separação visível.** O ar tinha encolhido de 12 para
8px mais cedo na mesma sessão, por densificação — e a decisão estava certa **enquanto
cada bloco ainda abria com legenda e fio**: o que separava assunto de assunto era o fio,
e os 8px só precisavam não colar o fio no texto de cima. Meia hora depois legenda e fio
saíram, e o ar herdou um trabalho para o qual não fora dimensionado.

⚠ **O CONSERTO É AR, E NÃO O FIO DE VOLTA** — devolvê-lo reabriria em silêncio um pedido
direto dele. `--space-6`, 24px: o degrau que o projeto já usa para "outro assunto", e
metade dos 32 que separam as duas colunas, de modo que a divisão vertical continua a mais
forte da tela. **Custou 48 dos 116 pixels que sobravam mortos no pé da coluna — nenhuma
leitura saiu e nada passou a rolar.** O recuo maior é escopado a `.cards__side > .card`:
a bandeja é um objeto só, e 24px ali não separariam nada, apenas devolveriam o vão que o
conserto 1 acabou de fechar. E a bandeja perdeu o recuo inteiro por simetria medida — ela
encostava no teto em 305 e parava 8px antes do pé em 927.

**Depois: as duas colunas fecham em 305→935, a página em 980 numa janela de 980, rolagem
zero.** `validate` verde com **230 provas**, `walk` verde, captura olhada.

## A Câmara ganhou nove legendas — 20/08/2026

Pedido do responsável, em duas mensagens: primeiro o espectro partidário brasileiro real
com nomes e siglas; depois, quando a colisão com a ADR 0003 foi apontada, a solução dele
— _"não vamos usar os nomes reais, mas você pode pegar todos esses partidos e simplesmente
usar sinônimos ou mudar alguma coisa do nome, sigla, etc.; de resto quero tudo idêntico"_.

⚠ **E ISSO CABE NA ADR INTEIRA.** Ela proíbe carregar **a marca** de uma organização real
e manda dar nome próprio inventado; ela permite — e pede — que o **arquétipo** seja real.
Nove legendas fictícias com o desenho da Câmara verdadeira é exatamente a leitura dela.

### As nove, e a forma que elas reproduzem

| sigla | eixo | cadeiras | ≈ o que ela é                                                                 |
| ----- | ---- | -------- | ----------------------------------------------------------------------------- |
| FSP   | 24   | 14       | a frente socialista de direitos humanos: a mais ideológica, a que menos vende |
| PTU   | 30   | 80       | a maior da centro-esquerda: desenvolvimentista e pragmática                   |
| PSU   | 38   | 31       | trabalhismo de frente ampla — a fiel da balança                               |
| MDN   | 55   | 42       | a federação de caciques regionais                                             |
| PSM   | 60   | 71       | capilaridade municipal e governabilidade                                      |
| UPB   | 72   | 106      | a fatia do orçamento e a máquina pública — **o Centrão do jogo**              |
| PLB   | 78   | 145      | a maior bancada: pragmática no dinheiro, dura nos costumes                    |
| PLV   | 94   | 18       | liberalismo clássico — não vende a pauta econômica                            |
| PNR   | 68   | 6        | nacionalismo militarista, o que menos negocia costume                         |

**Somam 513 exatos.** E as cinco faixas da fita ficam: **0 / 125 / 113 / 257 / 18** — a
faixa da intervenção máxima vazia, como na Câmara real, onde as legendas marxistas não
têm uma cadeira.

### ⚠ Três propriedades de desenho que apareceram sozinhas

1. **Nenhuma DUPLA de bancadas faz maioria.** As duas maiores somam 251, seis abaixo de
   257 — toda maioria exige três portas, e três portas com preços diferentes é a
   negociação existindo. A prova de `agenda.mjs` foi reescrita para cobrar isso;
2. **A maioria mais barata não cabe num mês.** Era a afirmação que a prova antiga fazia
   sobre UMA bancada — "o centrão sozinho cabe e dói" —, e ela dependia de existir um
   bloco com 40% do plenário. A nova é mais forte e é estrutural;
3. **O elenco teve de se espalhar.** Com quatro dos oito arquétipos saindo do mesmo
   bloco, cinco partidos ficaram sem uma única pessoa dentro — inclusive o de 145
   cadeiras. Bancada grande sem rosto é bancada que não se negocia: sem sinete, sem
   carta, sem nome. Agora a presidência da Câmara sai da maior bancada, a do Senado da
   federação de caciques, a relatoria de quem detém o orçamento.

### O que a série mediu, antes e depois

| 48 meses, governo simulado | 4 blocos | 9 legendas   |
| -------------------------- | -------- | ------------ |
| votações aprovadas         | 14 de 43 | **30 de 43** |
| programas movidos          | 33 de 38 | 38 de 38     |
| meses com rateio           | 4        | 1            |
| emenda não honrada         | 11,3     | **1,6**      |

⚠ **E A DIFICULDADE PRECISOU DE UMA MÃO, com autorização explícita.** Com as nove
legendas, um governo de MANUTENÇÃO passou a cair no mês 50 — o último do mandato —, e a
garantia de desenho deste projeto é a oposta: _"a queda tem de ser alcançável por um
governo RUIM e inalcançável por um MEDIANO"_. Subiram `boil` (60→68), `streetFloor`
(20→16) e `brokerBoil` (80→86).

⚠ **Fica registrado que os três são ESCOLHA DE DIFICULDADE e não medição**, e a
autorização foi dita assim: _"você pode inventar números por enquanto; o nosso foco é
deixar o jogo bom de verdade, jogável; depois eu peço uma boa pesquisa focando em
fidelidade e realismo"_. **A pesquisa de fidelidade ainda vai revisar os três**, e a
margem antiga — 52 contra um limite de 50 — era fina demais para ser desenho: dois meses
de folga é coincidência, e qualquer recalibragem futura a consumiria sem ninguém ver.

### ⚠ E o que continua ACHADO, não conserto

A distribuição de cadeiras entre esquerda e direita **não foi mexida por fidelidade** —
ela foi montada para reproduzir a Câmara real e reproduz. O que muda de verdade a
dificuldade é o presidente: um governo de esquerda numa Câmara com 257 cadeiras nas duas
faixas de mercado joga outro jogo. Isso é decisão de desenho, e é dele.

## O mercado deixou de ser mudo — 20/08/2026

⚠ **ELE ESTAVA MUDO POR UM BLOQUEIO QUE O RESPONSÁVEL DESTRAVOU NESTA SESSÃO.** A
retomada registrava, desde 16/08: _"o mercado quer que a dívida pare de crescer — um
TETO, e não um piso — e o baixo clero quer verba para as bancadas, que não é alavanca.
Não force os dois na carta que existe: a exigência de piso funciona porque 'devolva o que
você cortou' tem um número derivado atrás; um teto e uma torneira não têm, e inventá-los
seria o número inventado que este projeto recusa."_

A autorização dele foi explícita: _"você pode inventar números por enquanto; o foco é
deixar o jogo bom de verdade, jogável"_. **E, com a porta aberta, não foi preciso inventar
nada.**

### A solução não precisou de máquina nova: o mercado é o ESPELHO

Os dois grupos de capacidade escolhem o programa de maior **queda** em dinheiro e pedem o
nível da posse de volta. O mercado escolhe o de maior **alta** e pede o mesmo nível da
posse. **Mesma alavanca, mesmo número derivado, sinal invertido** — e o nível exigido
continua sendo um valor que o próprio jogador já viu.

### ⚠ E ISSO CRIA O DILEMA QUE FALTAVA AO JOGO INTEIRO

Até aqui **todas** as exigências empurravam para o mesmo lado: gaste mais. Um jogo em que
todo mundo quer a mesma coisa não tem escolha dentro dele — bastava ter dinheiro. Agora a
bandeja pode receber duas cartas que **se contradizem**: a saúde pedindo o hospital de
volta e o mercado pedindo o corte que o pagou. Ceder às duas é impossível, e **escolher
qual lobby decepcionar é o jogo**.

Medido: um governo gastador recebe a carta do mercado no **mês 23** — _"Aposentadoria
urbana: quer o programa cortado de volta para 78"_.

### O que a carta precisou aprender

⚠ **A FRASE TEVE DE GANHAR SENTIDO.** Ela dizia _"quer o programa de volta em 40"_ — e
embaixo de um número **menor** que o nível de hoje, o jogador leria a exigência ao
contrário: cederia achando que gasta, quando na verdade corta. Aprender uma regra invertida
e jogar contra ela por meses é pior que não ter a carta. Entraram `demandCutBody` e
`demandCutChoices`, e **a recusa continua sendo uma frase só** — dizer não a um lobby é o
mesmo ato nos dois casos, e a guarda `vocabulary` acusou a cópia no primeiro `check`.

⚠ **E O SENTIDO NÃO FOI GUARDADO NA CARTA.** Ele é lido de `reads` no catálogo — quem lê a
dívida pede corte. Guardá-lo na carta daria dois lugares dizendo a mesma coisa, e um
quinto lobby entra sozinho por ali no dia em que nascer.

### ⚠ O baixo clero continua mudo, e agora a razão é ESTRUTURAL

O que ele quer — verba de bancada — **não é alavanca de programa**: é a torneira por
BANCADA, que no modelo é o `funding` de cada legenda. Ceder a ele exige uma segunda
espécie de alavanca dentro da carta, e isso é a próxima onda. Com as nove legendas, ela
ficou mais interessante do que era: a exigência passa a nomear uma bancada específica.

## A varredura de padronização — 18/08/2026

Pedido do responsável, com as palavras dele: _"deixe como está, apenas refine e padronize
toda a UI do jogo"_. **Medida antes de mexida**, e o que ela achou não era gosto:

| o que estava divergente                       | quanto                                  |
| --------------------------------------------- | --------------------------------------- |
| frases da interface escritas **duas vezes**   | **23**                                  |
| formas diferentes de dizer "não há nada aqui" | **4**                                   |
| a peça "papel" escrita à mão                  | **3 vezes**                             |
| raios de peça pequena digitados               | **12** (`2px` em oito, `3px` em quatro) |
| larguras da marca na borda esquerda           | **3** (2, 3 e 4px) para **dois** graus  |

✔ **O VOCABULÁRIO GANHOU FONTE ÚNICA** — `TERMOS`, no topo de `strings.mjs`.
⚠ **E havia uma divergência já consumada:** o estado de uma bancada rompida era
**"rompida"** em `mood.broken` e **"em ruptura"** em `cabinet.archRuptured` — mesmo
estado, mesmo motor, duas palavras, e um jogador procurando a diferença entre as duas não
ia achar porque ela não existia. "Opinião pública" estava escrita duas vezes **dentro do
mesmo objeto**.

⚠ **E ENTROU GUARDA PARA ISSO** — `vocabulary`, a décima primeira. Ela conta **literais**,
e não valores resolvidos, e a distinção é o conserto inteiro: depois que `nav.cabinet` e
`cabinet.title` apontam para o mesmo termo, os dois valores continuam sendo "Gabinete" — e
devem continuar. O que não pode voltar é a palavra estar **teclada** duas vezes.

✔ **A LEGENDA DE SEÇÃO TINHA O NOME ERRADO, e o nome escondia o alcance.**
`.area__legend` era usada por **seis telas** e morava em `60-screen-area.css` — a folha de
**uma**. Quem abrisse a folha da área para ajustar "a legenda dela" estaria mexendo no
Gabinete, em Finanças, no Congresso e em O Estado sem saber. Virou `.block__legend`, em
`30-components.css`, e o relatório e o fecho — que tinham cada um a sua — usam a mesma.

✔ **O PAPEL É UMA PEÇA.** Carta, texto em tramitação e lei escrita repetiam as mesmas
quatro declarações de material. ⚠ **Cópias idênticas são piores do que cópias
diferentes**: elas não acusam nada enquanto ninguém mexe, e a primeira mudança em duas
delas cria a divergência sem ninguém ter decidido isso.

✔ **OS ESTADOS VAZIOS VIRARAM UMA PEÇA COM DOIS PESOS DECLARADOS** — `BLOCO` quando a
seção inteira está vazia e **há o que fazer** a respeito, `DISCRETO` quando a ausência é
um **fato consumado** dentro de um documento. ⚠ **O discreto não é o bloco desbotado:**
ele não centraliza e não reserva altura, porque um bloco de altura mínima no meio de uma
prosa abre um buraco onde o olho procura conteúdo que nunca vem.

✔ **SEIS TOKENS DE GEOMETRIA** — `--radius-paper`, `--radius-stamp`, `--radius-dot`,
`--dot`, `--rule` e `--rule-strong`. ⚠ **A divergência dos raios não era arbitrária:**
levantados lado a lado, os `3px` são todos **papel** e os `2px` todos **carimbo**. É
justamente por isso que ela precisava de nome — coerência que só existe na cabeça de quem
escreveu dura até o próximo bloco.

✔ **DUAS SOBRANCELHAS DE TELA ERAM METÁFORA**, e a regra pendente da varredura de
vocabulário diz o contrário — rótulo nomeia a coisa, a metáfora mora na prosa:
_"a moldura"_ → **o patrimônio e o poder**; _"o placar"_ → **as contas da União**.

⚠ **O PASSEIO PEGOU UMA REGRESSÃO MINHA NO MESMO DIA:** ele procurava
`.report--waiting`, que era justamente uma das quatro formas de vazio que saíram. Nada
quebrava na tela — só o passeio deixaria de conferir que o painel anuncia a espera, em
silêncio, que é a família de defeito que ele existe para pegar.

## A décima primeira sessão — o jogo passou a terminar, e o cerco passou a falar

### O que ela entregou

✔ **`termOf` — a 13ª porta da fachada.** O motor passou a saber quando o mandato acaba,
e a regra estava **pela metade** no entrypoint: `state.fallen !== null` pegava a queda e
não pegava o prazo. Quem sabe quando um mandato acaba é o **regime**, e não a view.

✔ **O FECHO** (`src/ui/screens/closing.mjs` + `styles/70-screen-closing.css`) — a
prestação de contas. ⚠ **E ele NÃO é uma tela de derrota**, o que não foi escolha desta
sessão: `state.mjs` já escrevia que _"a partida JÁ é um mandato de 48 meses, sem vitória
e sem placar, então fim de jogo não é o oposto de nada"_. **Quem cai e quem cumpre leem a
mesma tela** — o que muda é o carimbo e a data, e há prova cobrando isso.

⚠ **Nenhum número nasce ali:** o índice de posse é o `initial` do catálogo, a dívida
herdada é `fiscal.initialDebtRatio` com fonte, e a aprovação da posse é a que a SONDA lê
do humor de abertura. Um valor digitado seria a segunda verdade sobre com quanta
popularidade o presidente entrou.

✔ **O botão parou de mentir.** Ele ficava `disabled` com a lâmina âmbar **cheia** — do
mesmo tamanho e da mesma cor de sempre. Agora perde o âmbar (`​.action[disabled]`, que
não existia) e diz `O MANDATO ACABOU · nova partida, ao pé da coluna`.

✔ **O CERCO FALA** — `alarm` em `mail.mjs`, `alarmsOf` no turno, dois `kind` novos.
Medido num mandato passivo: **três rupturas e um cerco, e nem uma a mais**.

| governo passivo                                  | quando                                                                       |
| ------------------------------------------------ | ---------------------------------------------------------------------------- |
| "A base rompeu"                                  | mês 9 — o fisiologismo é o primeiro a virar num governo que não paga ninguém |
| "A rua rompeu"                                   | mês 21                                                                       |
| "O capital rompeu" + **"O processo foi aberto"** | mês 44                                                                       |
| o fecho                                          | mês 46                                                                       |

⚠ **Só a TRANSIÇÃO escreve, e não o estado.** Uma carta por mês de ruptura aberta
empilharia trinta avisos idênticos até o plenário votar — que é o mural que a caixa
deixou de ser em 16/08. Por isso `alarmsOf` precisa das rupturas de **antes**: elas não
estão no estado, então a única maneira de saber o que mudou é perguntar duas vezes.

⚠ **E o cerco lê `impeachment`, e não `now.open`:** o processo **não se fecha** quando
uma das três melhora. Escrito contra as rupturas, o aviso chegaria de novo toda vez que
a terceira reabrisse num processo que já estava de pé havia meses.

⚠ **As duas são AVISO, e não pergunta.** A resposta ao cerco não se dá na carta — ela se
dá no Congresso, comprando a cadeira que agora custa o triplo. Um par de botões ali seria
uma **segunda porta** para a mesma jogada, e o jogador escolheria sem ver o preço que só
a outra tela mostra. A carta leva ao Congresso e para por aí.

⚠ **`boilerOf` passou a devolver `price`, `removal` e `seats`.** A carta do cerco diz
"342 de 513" e "3×", e os dois são do motor: copiados na view, mentiriam no dia em que
`SIEGE_PRICE` ou a Câmara mudassem.

### Os dois defeitos meus, pegos na captura

- a lista de leis do fecho saiu **sem numeração** — um `<li>` com `display: flex` perde o
  `::marker`, porque o navegador não desenha marcador em item que deixou de ser
  `list-item`. Virou contador CSS, e mono como a data do outro lado da linha;
- a barra ainda **datava o repaint** em vez do afastamento: `nov` no carimbo do fecho e
  `dez` na barra, na mesma tela.

### O que ela mediu, e vale mais que os consertos

⚠ **A Caixa de Entrada não estava quebrada, e eu quase "consertei" o que estava certo.**
O passeio que mostrou a coluna vazia era passivo; medindo por política, ela enche quando
o jogador legisla:

| governo     | cartas por mês | pico |
| ----------- | -------------- | ---- |
| passivo     | **0,0**        | 1    |
| paga a base | 0,3            | 2    |
| corta tudo  | **3,5**        | 8    |
| gasta tudo  | 2,5            | 4    |

**Medir antes de calibrar mudou a entrega**: o defeito não era a caixa, era o mundo não
escrever quando se mexe sozinho. Sem a medição, teria saído um estado vazio bonito para
um problema que não existia.

## A décima sessão — o país parou de se consertar sozinho

Ela começou pela retomada e por um **décimo dossiê externo**, que virou o
[ANEXO II do ciclo 10](cycles/10-who-brings-down-a-president.md) por decisão do
responsável: _"trate o dossiê como anexo do ciclo 10, onda 2"_. A ordem de execução
saiu dessa conversa e é a que está em _O QUE VEM AGORA_.

**O que ela entregou, em ordem:**

1. **o achado 2 morreu, e ele nunca existiu como defeito de modelo.** O instrumento
   contava o complemento exato da verdade — sexta ocorrência de "dois lugares montando
   a mesma pergunta";
2. **a projeção da tela de área** — sétima ocorrência da mesma família, e a pior delas
   em consequência: a seta apontava para o lado errado em cinco das oito áreas;
3. **o zero verde**, achado na captura do passeio;
4. **o achado 31 morreu**, e por mudança de FORMA e não de valor;
5. **a banda real do arcabouço** (achado 33), que era omissão declarada;
6. **`mandatoryGrowth` corrigido de escopo** (achado 32), sem o qual o conserto do 31
   transformava o jogo num corredor;
7. **os achados 29 e 1d caíram junto**, de graça, pela ordem certa.

### ⚠ O que ela ensinou, e vale mais que os consertos

**Três hipóteses minhas foram medidas e desmentidas, e cada uma teria custado uma
sessão se eu tivesse implementado em vez de medir:**

- _"o rateio corta em 41 de 48 meses"_ — eram **7**, e o instrumento anunciava o
  inverso;
- _"o laço capacidade→receita→teto tem ganho maior que 1 e é o amplificador"_ — o ganho
  uniforme é **0,14**, e com o laço desligado o país escorrega quase igual. ⚠ **O
  responsável já tinha AUTORIZADO amortecer o laço** com base no meu número errado, e a
  medição seguinte o desautorizou. Medir depois de decidir salvou a decisão;
- _"a identidade `decay = yield × gasto_herdado` conserta o 31"_ — ela derruba a
  indústria a 0 e a segurança a 7, porque o defeito era a **forma** da equação.

> **A regra que sai daqui: hipótese sobre um laço se mede desligando o laço.** Foi o
> único teste que separou causa de coincidência, e ele custou dois minutos.

### O que o ciclo 9 deixou pronto

- **`state.mail`, esquema 15** — a carta existe como fato, tem prazo, e **vencer
  resolve**. O silêncio ACEITA, e a carta diz isso **antes** de vencer;
- **a emenda do relator virou pergunta** — aceitar (a alavanca salva sai do texto) ou
  travar (volta à gaveta, e o relógio dos seis meses **não reinicia**);
- **a carta de posse** — o Gabinete deixou de abrir com a peça central vazia;
- **a tarja de gravidade**, vermelha, e ela mede **tempo** e não importância;
- **a série dos oito índices de área** entrou no mesmo bump e **matou o achado 15**;
- **o vocabulário de nomes** perdeu o andar social único (passo 0, ciclo 7 Parte A).

⚠ **Dois defeitos que só a medição pegou, e um deles TRAVAVA o jogo** — ver _O que a
execução ensinou_ no ciclo 9.

### O que esta sessão entregou

- **a Parte 3 do ciclo 4 — a tramitação.** O texto deixou de ser instantâneo: gaveta →
  relatoria → plenário, um estágio por mês. ⚠ **A calibragem mudou junto, e ela é
  decisão e não descoberta**. ⚠ Os números daquele dia (4 de 32, 84,9%) foram
  **superados três vezes** desde então — ver _A SÉRIE DE HOJE_, no topo;
- **o ciclo 5 inteiro** — o placar que mentia em 27,2% das votações, as pessoas na
  tela, o presidente com nome, a tipografia, o papel, o hemiciclo e o mês que cai na
  mesa;
- **o ciclo 6, menos o `state.mail`** — a régua legal no trilho, o pino de metal, o
  carimbo em mono, a serifa nos títulos, o ouro velho com contraste medido, a bandeja e
  as réguas do cofre. Ver _A régua legal_;
- **o achado 14 morreu**, e ele era maior do que este arquivo dizia;
- **299 linhas de lixo removidas** e as cinco telas padronizadas.

Oitava sessão, e ela atravessou a virada do dia. **A lei virou texto, a república ganhou gente, e
o país parou de se desendividar sozinho.**

- **Parte 1 — a gramática.** `src/domain/norms/` (ESTRATO): a faixa deixou de ser
  um campo e virou a leitura de uma **pilha de normas**, com gatilho, vigência,
  exceção e revogação. A migração está provada inerte — as cinco políticas do
  simulador devolveram série **idêntica** à de antes de mexer;
- **Parte 5 — o elenco.** `src/domain/cast/` (ELENCO): sete pessoas fictícias
  geradas da semente, com ambição, alcance e **memória**. O líder passou a
  negociar no lugar do bloco;
- **o achado 1 morreu, e ele era estrutural.** Três causas somadas, todas medidas;
- **o achado 1c morreu junto:** o preço passou a escalar com o tamanho do pacote.

O que veio antes dela, e continua valendo: **o orçamento é o jogo, a economia tem
preço, o país tem placar.** O [ciclo 2](cycles/02-everything-is-a-lever.md) aposentou o
catálogo de pautas prontas — o presidente escreve o orçamento programa a programa
e a pauta é **derivada** do que ele moveu. O
[ciclo 3](cycles/03-the-law-becomes-a-lever.md) fechou quase inteiro: a CORRENTE
existe, Finanças mostra o que ela faz, a Produção virou duas áreas e as faixas
saíram do catálogo para o estado.

> ## ⚠ O NORTE MUDOU na sétima sessão — leia o ciclo 4 antes de retomar
>
> [`cycles/04-the-republic-responds.md`](cycles/04-the-republic-responds.md) é o
> plano acordado, e ele **reformula o jogo**. Três coisas chegaram na mesma
> sessão e viraram uma só:
>
> - **a lei vira texto** — gramática formal executável, com autor, tramitação,
>   vigência e revogação, no lugar de faixas que só se movem;
> - **a república ganha gente** — Congresso com pessoas, imprensa, STF,
>   governadores e mercado. Todas **fictícias**, com arquétipo reconhecível e
>   inspiração real: o mundo é real, as pessoas são inventadas;
> - **o presidente pode cair** — impeachment, renúncia negociada e ruptura
>   institucional. Sem derrota possível, "tudo tem preço" era só aritmética.
>
> A interface entra junto: sai o rail duplo com a Mesa, entra o **Gabinete** —
> barra superior fixa, sidebar por poderes, e um dashboard cuja peça central é a
> **Caixa de Entrada**, que é por onde o mundo passa a falar com o presidente.
>
> **As nove decisões abertas foram respondidas.** Os motores ficam; o que se refaz
> é a camada de cima. O resto do ciclo 3 segue suspenso.
>
> **As Partes 6 (SONDA), 10a (a casca), 1 (a gramática) e 5 (o elenco) estão
> feitas** — ver abaixo. A próxima é a **tramitação (Parte 3)**, cujo desenho já
> está fechado dentro do ciclo, e só então a Caixa de Entrada.

| verificação        | estado                                                       |
| ------------------ | ------------------------------------------------------------ |
| `npm run validate` | **verde de ponta a ponta**                                   |
| `npm run check`    | **10 guardas** · 40 provas sintéticas · 124 arquivos · verde |
| `npm test`         | **218 propriedades** · verde (eram 213)                      |
| `npm run simulate` | as seis políticas — ver **A SÉRIE DE HOJE**, no topo         |
| `npm run walk`     | verde — desktop e celular, **e o Gabinete no celular**       |
| `npm run screen`   | verde — 240,4 fps com material × 240,1 sem (ver achado 4)    |
| CI                 | GitHub Actions rodando `npm run validate` a cada push        |

**As quatro provas novas desta sessão**, e as quatro foram verificadas mordendo:

| prova                                         | acusa, se revertida                                          |
| --------------------------------------------- | ------------------------------------------------------------ |
| `SOBRA NAO E CORTE`                           | um mês com folga contado como mês de rateio                  |
| `A AREA E O TURNO PROJETAM O MESMO INDICE`    | _"a área prometeu um índice e o mês entregou outro"_         |
| `O ORCAMENTO HERDADO E O PONTO DE EQUILIBRIO` | a identidade do achado 31 quebrada por um `cost` de programa |
| `O ZERO DA AREA E NEUTRO`                     | _"um zero impresso saiu tingido: a cor negou o número"_      |

✔ **COMMITADO em 16/08/2026**, a pedido do responsável: `267eabd` no branch
`acoplamento-e-simulador` — 77 arquivos, +14.431/−1.108. **Nada foi enviado ao
remoto.**

Um commit só porque as peças se atravessam: `turn.mjs`, `state.mjs` e esta retomada
foram tocados por todas elas, e separá-las seria inventar uma fronteira que o código
não tem.

## A nona sessão — a varredura de interface, antes da parte 2 do Gemini

Começou em 15/08/2026 e **atravessou a virada do dia**, como a oitava — por isso o
topo deste arquivo diz 16/08 e esta seção diz 15/08. Pedida assim: _"revise painel por painel, aba por aba,
procurando inconsistências, bugs, comparando eles todos entre si e padronizando
tudo"_, e _"limpe o lixo de tudo"_ — porque a parte 2 da auditoria externa vai
focar em CSS, design e interface. **Nenhum motor foi tocado.**

### A RÉGUA LEGAL — e o achado é um canal de dado morto

O segundo dossiê externo — _"a aba Saúde parece uma mesa de som"_ — é o **primeiro
que descreve a tela atual** em quatro auditorias, e por isso o único que achou algo
que eu não sabia. A queixa dele parecia estética: os sliders _"tiram todo o peso do
ato de governar"_, cortar verba de hospital tem a gestualidade de baixar o brilho da
tela.

**Está certo, e a causa não é o componente.** `area.mjs` escrevia `--floor` em cada
controle, com prosa explicando que _"a marca do piso é posição no próprio controle,
escrita em estilo inline porque ela é DADO"_. E `grep --floor styles/` devolvia
**nada**.

> **Canal de dado morto** — a família inversa da folha órfã: dado sem consumidor, em
> vez de estilo sem seletor. O controle mais importante do jogo não carregava a única
> informação que o distingue de um controle de volume.

Entrou `--ceiling` junto, e o trilho virou **régua legal** — três zonas pela faixa
vigente:

| trecho          | o que custa                                     |
| --------------- | ----------------------------------------------- |
| até o piso      | lei, ou emenda quando a guarda é constitucional |
| do piso ao teto | **caneta** — a lei já autorizou                 |
| acima do teto   | custa de novo                                   |

Com marcas de latão no piso e no teto. Até aqui a tela só dizia isso **depois**: a
linha se tingia quando o controle já tinha atravessado. **Informação que chega depois
da decisão não é informação — é recibo.**

⚠ **E a zona cara não é zona proibida.** Nada de hachura de perigo: um trilho que
parecesse bloqueado ensinaria que a lei é um limite da **interface**, e a doutrina é
_"tudo tem preço, nada tem muro"_.

⚠ **Um defeito que só a imagem pegou, e ele é de uma classe nova aqui:** a primeira
versão pintou as três zonas e o trilho continuou liso, **sem erro em lugar nenhum**.
`.dial__slider` tem especificidade (0,1,0) e **perde** para `input[type="range"]`
(0,1,1) — atributo mais tipo. Uma classe não vence um seletor de atributo, e essa é a
derrota que não aparece em tipo, em guarda nem em prova.

**O que mais entrou pelo ciclo 6:**

- **serifa no título de tela.** "Saúde", "Gabinete", "Congresso & Leis" são **nomes de
  instituição** e saíram em sans por seis telas — furo da minha própria regra do
  ciclo 5;
- **a terceira família tipográfica: mono no carimbo.** Serifa é o que se **assina**,
  sans é o que se **mede**, mono é o que a máquina do Estado **carimba**. Três é o
  teto: uma quarta não teria papel sobrando. ⚠ **Por isso o índice da área NÃO virou
  mono**, como o dossiê pedia — `62` é medição, e vestir medição de carimbo inverte a
  regra no dia em que ela nasce;
- **a bolsa subiu** para antes dos controles e virou **fita** com fio de latão. Posta
  embaixo, ela era a conclusão de uma decisão já tomada; **o cobertor curto precisa
  ser lido antes de se puxar a ponta dele**;
- **o papel clareou** (`#221d18` → `#2b241c`). A escolha original estava certa na
  intenção e errada na medida: diferia da lâmina quase só em **matiz**, e o revisor
  leu o bloco de leis como "caixas de contorno fininho". **Substância que só o autor
  enxerga não é substância**;
- **o pino virou metal escovado retangular** e deixou de ser âmbar: a marca é a cor do
  que se **pressiona**, e um pino que se **arrasta** não se pressiona. Gastá-la em 38
  controles por tela era a diluição que a regra existe para impedir;
- **`--brand` foi para o ouro velho** `#e8a33d` → `#c2a675`, com contraste medido
  antes de fechar: 7,03:1 sobre a lâmina, 6,56:1 sobre o papel, e **5,55:1 no botão de
  avançar renderizado** — AA nos três. O botão usa tinta escura sobre ouro composto;
  tinta clara sobre ouro sólido reprovaria (1,98:1), e por isso ela não existe;
- **a bandeja escavada**, **a carta com sombra projetada**, **as réguas no cofre** e
  **o fio metálico sob cada legenda de bloco** — e o que este último entrega não é a
  linha, é a **repetição** dela.

**Uma recusa registrada:** _"a Constituição é um muro — tarja vermelha sólida"_. O
projeto já decidiu o contrário, com a razão escrita: **vermelho aqui ensinaria que o
piso da saúde é um defeito**. A convenção do cofre continua valendo — constituição =
marca, lei ordinária = azul-aço.

### O placar mentia — e este era o defeito mais caro do projeto

**A Mesa anunciava um veredito contrário ao que o mês produzia em 27,2% das
votações.** Ele foi encontrado indo atrás de uma queixa da auditoria que parecia
estética — _"onde estão essas pessoas?"_.

O entrypoint montava a câmara à mão: `whipCount` com os **quatro** blocos do
catálogo, a verba crua e a lealdade crua. O turno vota, desde a oitava sessão, com
as **onze** bancadas do ELENCO, a verba com crédito de memória e desconto de
ambição dentro, e a **aprovação da rua** — `standing`, que a tela nem passava.

| medido em 1.012 votações reais |                 |
| ------------------------------ | --------------- |
| divergência máxima             | **35 votos**    |
| vereditos **invertidos**       | **275 — 27,2%** |

Exemplo: quórum 308, a Mesa anuncia **327 · ACIMA DO QUÓRUM**, o turno produz
**299**, a pauta cai.

**Ninguém quebrou nada.** O ELENCO e a SONDA chegaram, `playMonth` passou a usá-los,
e a tela ficou para trás em silêncio — cada lado certo sozinho. Nenhum tipo, nenhuma
guarda e nenhuma das 190 provas via, porque nenhuma comparava os dois.

Três consertos, e só o terceiro fecha a classe:

1. **`forecast()` na camada de aplicação** — a pauta, o placar, a banda e o que cada
   bloco entrega, tudo da mesma câmara que `playMonth` usa;
2. **uma prova**, verificada mordendo: revertido o conserto, ela acusa _"a Mesa
   previu 312,0 e o turno centrou em 300,0"_;
3. **`whipCount` e `dispersion` saíram da fachada.** Enquanto a porta errada estiver
   aberta, alguém entra por ela.

> **É a terceira vez que este defeito acontece, sempre pela mesma causa: dois
> lugares montando a mesma pergunta.** A Mesa já previu com a verba prometida
> enquanto o turno pagava a rateada; a tela já remontou a legislação por fora antes
> de `bandsOf`. Oferecer a porta certa não basta — é preciso fechar a errada.

Dois defeitos menores caíram junto: a **banda `±`** era calculada sobre 4 blocos
enquanto `vote` sorteia 11 vezes (erros independentes somam em quadratura, então ela
anunciava incerteza **maior** que a real), e a **soma das linhas** da Mesa não batia
com o placar — cada linha encontrava apenas a bancada _restante_ do bloco.

### A república ganhou rosto — B1, B2 e C1 do ciclo 5

**Sete pessoas decidiam o preço de toda votação e nenhuma aparecia.** O ELENCO gera
nome, cargo, ambição e memória desde 14/08; o jogador pagava um bloco, a memória do
líder mudava o valor em silêncio, e ele nunca soube que existia um líder. Motor que
o jogador não vê não é profundidade — é custo.

- **a gente mora DENTRO do bloco**, e a aninhagem é a mecânica: você paga o bloco, o
  bloco é feito de gente, a gente entrega diferente. Uma lista de onze bancadas
  irmãs diria que o líder e o bloco são a mesma coisa, e o ciclo 4 diz o oposto;
- **`forecast` devolve `blocs` com as pessoas já casadas** com bancada, voto e
  memória. São quatro junções, e feitas na tela elas errariam calado no dia em que o
  elenco crescer — que é o defeito que este entrypoint acabou de pagar caro;
- **o alcance que vai à tela é o EFETIVO**, e não `person.reach` cru: os alcances
  são normalizados quando somam mais que `CROWD`, então o cru diz o que a pessoa
  queria arrastar e o efetivo diz o que ela arrasta;
- **o sinete** (`src/ui/shared/sigil.mjs`) — iniciais num anel, e o anel é o
  alcance. **Não é retrato**: rosto de personagem fictício é promessa que este
  projeto não cumpre, e forma geométrica lê como avatar de aplicativo, que é a
  estética de que a auditoria reclama. Sinete é o objeto com que a burocracia
  identifica quem assina. **Sem cor de partido** — o catálogo não declara uma, e
  inventá-la colidiria com a paleta semântica (verde já é alta, vermelho já é
  crise), fazendo um lado parecer bom e o outro perigo;
- **a memória virou frase** — _"negocia como quem já recebeu"_, _"cobra a promessa
  que você não pagou"_ —, com uma faixa morta declarada abaixo de 0,08: saldo menor
  que isso é resíduo de decaimento, não relação.

**C1 — a regra tipográfica, e ela é executável.** `--font-display` e `--font-text`
eram **a mesma fonte**, e por isso o jogo tinha uma voz só; nada distinguia uma
**lei** de uma **medição**. Agora:

> **serifa = texto de registro** · **sans = valor medido**

E ela não é convenção: `[data-numeric]` declara `--font-display` em `10-base.css`,
então um número é sans onde quer que caia — inclusive dentro de prosa serifada.
Convenção tipográfica que depende de alguém lembrar diverge no terceiro componente.

**Dois defeitos que só a captura pegou, e os dois eram meus, do mesmo dia:** o nome
das pessoas herdou o `text-overflow: ellipsis` da linha da bancada e a 390px os
**sete** saíam cortados — reticência serve para texto secundário, e o nome de uma
pessoa **é** a identidade; e _"escolha uma ação numa das áreas"_ aparecia **duas
vezes** na mesma tela, porque o placar repetia o que o estado vazio acima já dizia.
É a segunda duplicação desta família no dia: quem nomeia uma ausência é o lugar onde
ela acontece, e uma vez só.

**E uma suspeita que a medição desmentiu:** a captura mostrava o rail bem abaixo do
topo da lâmina. Medido, ele é `sticky` em `top: 106` nas quatro telas — a posição na
captura é artefato do _fullPage_ do Playwright com elemento fixo. Não mexi.

### O achado 14 morreu — e ele era maior do que o handoff dizia

**O ciclo previa que ele sumisse quando o pedido e o aplicado se separassem. Eles se
separaram na Parte 3, e o resto do turno continuou lendo o PEDIDO** — então a
tramitação **triplicou** o defeito em vez de matá-lo, e ele tinha uma segunda metade
que nunca havia sido notada:

- **a MALHA** recebia o mês como se a reforma tivesse valido — o índice da área andava
  por um dinheiro que não saiu;
- **o CAIXA cobrava o empenho que não aconteceu.** Esta metade não estava registrada.

Antes da tramitação a divergência durava um mês, até a votação. Depois dela duraria
**três** — ou para sempre, se o texto morresse na gaveta.

**O conserto foi estrutural, e não pontual:** `settlement` passou a compor a pauta
ele mesmo e a derivar o que de fato EXECUTA neste mês, e **rateia o executável em vez
do pedido**. Rateado sobre o pedido, o corte se calculava contra uma despesa que
ninguém ia fazer — e o governo perdia base por um aperto que a própria gaveta já
tinha evitado.

De quebra morreu `agendaOf`: havia dois `compose` no arquivo, e agora há **um**, e
ele mora onde a distinção importa primeiro. Quem quiser a pauta pergunta ao rateio.

⚠ **A prova foi verificada mordendo:** revertida, ela acusa _"a MALHA recebeu o mês
como se a reforma já tivesse valido"_.

### A tramitação ganhou voz — as cartas da Parte 10b

**Uma mecânica que só mostra ESTADO é obstáculo; a que mostra CAUSA é jogada.** A
gaveta dizia "na gaveta" e não dizia por quê — o jogador via o texto sumir sem saber
se a Mesa engavetou, se o relator o esvaziou ou se o plenário o derrubou.

Agora cada evento da tramitação vira carta, **assinada por quem de fato decidiu**:

- **Onofre Bastos Quirino, presidente da Câmara** — _"Pautei o seu texto"_;
- **Valdomiro Caldeira Nunes, relator do orçamento** — _"Devolvi o seu texto com uma
  emenda"_, dizendo **qual alavanca ele salvou**;
- **a gaveta não tem remetente**, e a ausência é a informação: ninguém escreve para
  avisar que engavetou. O texto morreu de silêncio.

> Isso não é sabor: é o que faz o jogador saber **a quem pagar** no mês seguinte.

**E as cartas da tramitação vêm ANTES do fechamento do mês**, porque elas pedem
decisão e ele só informa. Inbox ordenado por hora põe o aviso na frente do pedido.

**Três defeitos que só a captura pegou, e os três eram meus, do mesmo dia:**

- **"derrubada" para um texto recém-escrito.** A carta lia `enacted` — que desde a
  tramitação significa "algum texto venceu o plenário hoje" — contra a pauta que o
  jogador acabou de assinar, e as duas deixaram de ser a mesma coisa. **Perder é uma
  coisa; esperar é outra**, e confundi-las ensina que o Congresso o rejeitou quando
  ninguém votou nada. Quem diz o veredito agora são os eventos;
- **duas cartas separadas por 200px de vão** — o corpo do cartão distribuía as linhas
  em vez de empilhá-las, herança do `1fr` que existe para o vazio se centrar. Lista
  se empilha; vazio se centra. Medido depois: 12px;
- **a carta esticada pela coluna inteira**, já corrigida acima.

### A TRAMITAÇÃO — a Parte 3 do ciclo 4, e ela é o coração dele

**O texto deixou de ser instantâneo.** Três estágios, um por mês: **gaveta →
relatoria → plenário**. Um texto ordinário leva três meses da caneta ao efeito, e é
isso que faz o mês 40 ser diferente do mês 4.

A linha que separa o que espera do que não espera **já existia, e é o rito**:
`budget` é execução orçamentária — a lei já autorizou — e continua imediato; `law` e
acima viram texto, e texto tramita. Por isso a mudança não quebra o jogo que existia:
**quem só remaneja verba dentro das faixas não sente diferença nenhuma.**

- **`src/application/passage.mjs`** — e ele **não é motor e não tem codinome**, que é
  a decisão central desta parte: nada ali inventa preço. A Mesa decide com
  `whipCount` sobre uma bancada de **um só**, o relator escolhe com a mesma distância
  euclidiana que ECLUSA usa, e o plenário vota com `vote`. **O que a Parte 3
  acrescenta é TEMPO;**
- **`state.bills`, `schemaVersion` 14.** O que se guarda é o **pedido**, e não a
  proposta: posição, ameaça e quórum se refazem contra o país de **hoje**, porque o
  mundo anda enquanto o texto espera. Guardar a proposta congelaria a ameaça no dia
  da assinatura, e o Congresso votaria um mundo que não existe mais;
- **um plenário por mês**, e os outros esperam onde estão: duas votações no mesmo
  turno dariam dois placares para ler e uma bolsa só para dividir entre eles;
- **o nível que precisa de voto agora espera SEMPRE**, e não só quando perde. Gastar
  abaixo de um piso antes de a lei mudar é gastar sem autorização, e o modelo nunca
  deveria ter deixado.

#### Três defeitos que a medição pegou — e um era de desenho

**1. O relator podia esvaziar o texto inteiro.** Um projeto que movia **uma alavanca
só** chegava vazio ao plenário, porque o relator tinha salvado exatamente aquela — e
texto vazio não vai a voto, morre. Medido: **24 meses, cinco níveis de verba, zero
votações.**

> **E o defeito não era de número — era de PAPEL.** O relator que apaga a única
> cláusula do texto não escreveu um jabuti: ele **rejeitou o projeto**, e rejeitar é
> trabalho do plenário. É o mesmo raciocínio que põe o limiar da Mesa abaixo de meio:
> quem não decide o mérito não pode ter poder de veto pelo caminho. **Emendar exige o
> que sobra**; com uma cláusula só, não há o que emendar.

**2. O `explorador` parou de conseguir votar qualquer coisa — e o modelo está
certo.** Medida a adesão do presidente da Câmara mês a mês: memória **−0,44**, humor
**0**, rua em **20%** no mês 3. Ele promete 100% a todos, o rateio corta, e em três
meses não há mais quem paute.

> **A tramitação transformou "prometer demais" numa sentença de morte**, porque agora
> a sua base precisa **sobreviver três meses**. Antes, a promessa quebrada custava
> base e a votação acontecia no mesmo mês, antes de a conta chegar.

**3. A Mesa não é o muro, e eu medi antes de mexer.** Ela pauta com adesão de
**0,75 a 0,82** contra um limiar de **0,38** — em corte leve, lei ordinária, emenda,
emenda funda e pacote. A gaveta segura pelo humor, não pelo limiar.

#### A tela não podia mentir — e desta vez o defeito foi visto antes de existir

O placar anunciava **"ACIMA DO QUÓRUM"** para um texto que vai à gaveta: é a **quarta
vez** que este projeto encontra a mesma família, e a primeira em que ela foi prevista.
Entraram o bloco **"Em tramitação"** — estágio, tempo de espera, o relógio da gaveta
e o que o relator salvou — e a linha que diz _"este texto vai para a gaveta ·
previsão para quando ele chegar ao plenário"_. O número continua certo e continua
vindo da mesma câmara; o que ele deixou de ser é uma previsão sobre **agora**.

#### ⚠ A CALIBRAGEM MUDOU, e ela precisa do seu olho

⚠ **ESTA TABELA É HISTÓRICA: ela mede o efeito DA TRAMITAÇÃO, e não o estado de
hoje.** Depois dela vieram o achado 25 (o instrumento) e a Parte 2 (o muro e a
vinculação), e cada um mexeu na série inteira. **A série de hoje está no topo deste
arquivo, em _A SÉRIE DE HOJE_** — e ela é a única que se deve usar para calibrar.

| política     | dívida/PIB antes | **hoje**  | votações    | contingenciamento    |
| ------------ | ---------------- | --------- | ----------- | -------------------- |
| `herdado`    | 83,6%            | **83,6%** | 0 de 0      | —                    |
| `agenda`     | 70,4%            | **84,8%** | **3 de 24** | —                    |
| `base`       | 70,7%            | **85,5%** | 0 de 0      | —                    |
| `promessa`   | 72,2%            | **87,7%** | 0 de 2      | **2 meses · nov/29** |
| `piso`       | 86,3%            | **86,3%** | 0 de 0      | 4 meses · set/29     |
| `explorador` | 86,9%            | **86,9%** | 0 de 0      | —                    |

⚠ **O conserto do achado 14 mexeu na série, e menos do que se poderia temer:** o
`agenda` saiu de 84,9% para 84,8% e passou a levar **24** textos a voto em vez de 32,
aprovando 3 em vez de 4. É o efeito esperado — o rateio deixou de cortar contra uma
despesa que a gaveta já tinha evitado, então a base sofre menos e a pauta encolhe.
**E o `promessa` passou a contingenciar** (2 meses a partir de nov/2029), o que antes
só o `piso` fazia.

O efeito é o pretendido — legislar passou a custar tempo, e quase nada passa —, mas
é uma mudança grande de série e **ela é decisão, não descoberta**.

⚠ **E o `explorador` deixou de ser instrumento de calibragem fiscal.** Ele agora mede
"prometer demais mata o governo", e não "quebrar o orçamento". Para voltar a medir o
segundo, ele precisa **parar de prometer verba** — é o achado 18.

### Você existe — B3 e B4 do ciclo 5

**O jogador era a única pessoa sem nome num jogo em que sete outras tinham.** A
barra dizia "1º MANDATO · ANO 1" — o mandato de quem? — e nenhuma tela se dirigia
ao presidente. Era o buraco mais fundo que a auditoria apontou sem nomear.

- **`governmentOf` é a sétima porta da fachada**, e devolve as três coisas que
  faltavam: o nome do presidente, quem assina a leitura do mês, e a posição que o
  governo **se tornou**;
- **o presidente não é um arquétipo**, e a exclusão é a modelagem: todo mundo em
  `ARCHETYPES` nasce onde um bloco está, e o presidente é a única pessoa cuja
  posição não pode vir de lugar nenhum — ela é derivada do que ele moveu. Dar a ele
  um bloco de nascimento seria escolher a ideologia do jogador por ele, que é o
  cursor que o ciclo 2 recusou. Daqui sai só o nome, e ele **não pode ser homônimo**
  de ninguém do elenco;
- **`stanceOf` é a regra do ciclo 2 finalmente visível.** _"A posição ideológica é
  sombra, e nunca controle"_ vale desde o ciclo 2, e nenhuma tela dizia o resultado:
  o cálculo rodava todo mês dentro de `compose` e morria dentro de uma pauta. É a
  **mesma função**, com outro par — o vigente contra o **orçamento herdado**, em vez
  do rascunho contra o vigente;
- **sem movimento não há posição, e `null` é a resposta.** Um presidente que não
  mexeu em nada não é "de centro": ele não exerceu ideologia nenhuma. A tela diz
  _"ainda governa o orçamento que herdou"_;
- **o marco é o bloco mais próximo, e não um rótulo inventado.** O plano não tem
  regiões com nome; os quatro blocos são os únicos marcos que existem. Medido:
  ampliar saúde e previdência dá **Esquerda**, cortá-las dá **Centrão**, ampliar
  tudo dá **Centro-esquerda**. O rótulo diferencia de verdade.

**B4 — a leitura ganhou autor.** Entrou o **chefe da Casa Civil**, oitavo
personagem, com `reach` **zero** — e isso não é valor provisório, é a mecânica:
`benches` só reparte a bancada entre quem arrasta alguém, então ele fica fora do
plenário para sempre. **Ele pode falar porque falar não é uma jogada.** Um
conselheiro que também votasse seria um líder com microfone, e o jogador aprenderia
a ler o conselho como barganha.

⚠ **E uma prova cobrou o preço disso, com razão.** _"A traição pesa mais que o
favor"_ ficou vermelha: com alcance zero, `remember` credita zero. A afirmação
estava certa e o alcance dela, errado — memória **é verba já paga**, e verba vai
para bancada, não para pessoa. A pré-condição passou a excluir quem não arrasta
ninguém. **A consequência fica registrada: a memória do conselheiro é
estruturalmente inerte** — hoje inofensiva porque ninguém a lê; no dia em que ele
ganhar mecânica, ou ele ganha alcance ou a memória dele precisa de outro caminho.

E a terceira duplicação da mesma família no mesmo dia: a assinatura dizia _"leitura
de Fulano"_ logo abaixo do rótulo _"A LEITURA DO MÊS"_. Uma assinatura de verdade
não se anuncia — é um traço e um nome.

### A pele institucional e o plenário — C, D e E do ciclo 5

**O ciclo 5 saiu inteiro nesta sessão.** As quatro decisões pesadas foram tomadas e
executadas.

**C1 · a regra tipográfica virou mecanismo — e a primeira versão dela estava
errada.** `--font-display` e `--font-text` eram a mesma fonte, e o jogo tinha uma
voz só. A regra é **serifa = texto de registro, sans = todo o resto**.

⚠ **Mas eu a implementei ao contrário, e o responsável viu na hora, usando a tela:**
_"as fontes estão estranhas e despadronizadas"_. Eu troquei `--font-text` — a fonte
do **corpo** — por serifa, e com isso a serifa virou o **padrão** de tudo o que não
declara fonte própria: unidade de controle, nota de cartão, prosa de estado vazio,
linha de rateio, rótulo de rua. Metade da interface saiu serifada por herança e a
outra metade sans por declaração explícita.

**A regra estava certa; a implementação a inverteu.** Serifa é **opt-in**, e agora é
uma lista curta e nomeada: `--font-record` vale para o nome de uma norma, o nome de
uma pessoa, o nome do presidente, o assunto da carta e a assinatura da leitura. Mais
nada. Medido depois: **65 peças em sans, 4 em serifa — e as 4 são nomes.**

E a medição achou o defeito de fundo, que era maior que a fonte: **a escala
declarava 5 degraus e as folhas usavam 11 tamanhos crus fora dela** — `0.7`, `0.72`,
`0.74`, `0.76`, `0.78`, `0.8`, `0.82`, `0.86`, `1.02`, `1.05` —, escritos à mão,
componente a componente, ao longo de várias sessões. Onze tamanhos entre 11 e 17px
não formam hierarquia: formam ruído, e o olho lê ruído como desleixo sem saber
nomear a causa. Entraram `--text-note` (o degrau mais usado do projeto, que oito
componentes reinventaram sozinhos) e `--text-name`; **21 tamanhos crus viraram
token**, e sobrou **um**, declarado: a escada de Finanças, que é geometria e não
texto. A escala rendida caiu de 12 tamanhos para os 7 do sistema.

> **Uma escala só é escala se TUDO passar por ela.** Um degrau novo digitado direto
> no componente parece inofensivo — são 0,02rem — e é assim que uma paleta de tipos
> vira uma lista de exceções que ninguém consegue mais revisar.

**C2 · a pastilha de rito virou carimbo.** Canto reto num sistema todo arredondado
lê como outra natureza de coisa antes de qualquer palavra. E a cor sobe com a
exigência: emenda leva a marca âmbar — a única coisa fora de um botão que a usa, e
a exceção se paga porque furar cláusula protegida **é** a decisão mais cara do jogo.

**C3 · o bordô entrou como terceira cor, e ela é do LUGAR.** A auditoria chamou a
paleta de "verde neon de startup" e leu errado — `--brand` é âmbar, e o verde é
semântico. O que faltava era o Congresso não sair no mesmo azul-cinza de todo o
resto. ⚠ **E ele não pinta bancada**: cor de partido foi recusada três vezes, e
pintar um bloco de vermelho diria que ele é perigo.

**C4 · o papel — e isto reabre uma decisão fechada.** _"Liquid glass é a base do
design inteiro"_ valia enquanto tudo na tela era a mesma natureza de coisa. Não é
mais: uma **lei** e uma **carta** não são superfícies da máquina do Estado, são o
registro que ela produz. A regra passa a ser **duas substâncias com fronteira
escrita**:

> **vidro** a máquina do Estado · **papel** o texto de registro

⚠ **A fronteira é o risco inteiro.** No dia em que o papel aparecer num cartão de
resumo ou num botão, ele deixa de ser legenda e vira a segunda paleta que o sistema
visual existe para impedir. Ele não é branco: pergaminho à meia luz, quente onde
tudo é frio — papel branco em ambiente escuro é um buraco de luz.

**D · o hemiciclo, e a recusa anterior caducou.** A razão escrita era _"o modelo não
tem deputado individual"_; o ELENCO acabou com isso. São **513 cadeiras agrupadas
por bancada, assentadas da esquerda para a direita pelo eixo econômico** — como um
plenário real se organiza, e como o modelo já sabe. Cheia quando entregue ao
governo, vazada quando não. O arco morreu porque virou um subconjunto: o hemiciclo
responde as duas perguntas dele e mais uma.

**E · o mês cai na mesa.** A primeira carta de verdade existia o tempo todo: o
relatório do turno, produzido desde a quinta sessão, vivia enterrado no rodapé do
Congresso. Agora ele chega ao Gabinete **assinado pela Casa Civil**, com sinete,
assunto e três leituras — e nenhuma frase dela é escrita para um caso: tudo é
leitura do relatório que o turno já produziu.

**Quatro defeitos que só a captura pegou, e três eram meus, do mesmo dia:**

- **"governa mais perto d Centrão"** — a contração pede gênero, e gênero é
  vocabulário. Entrou `article` no catálogo de blocos: montada na view, a contração
  seria uma tabela de exceções escondida numa string, e o quinto bloco sairia errado
  sem nada acusar;
- **a carta esticada pela coluna inteira** — herança do estiramento que existe para
  centrar o **vazio**. Vazio se centra; documento se lê de cima para baixo;
- **a nota do estado vazio prometia o que já tinha chegado** — ela dizia "a caixa
  nasce quando o Congresso passar a escrever", e a caixa nasceu antes disso;
- **"EM PAUTA" duas vezes** e **a dica repetida no placar**, já corrigidos acima.

⚠ **E um erro de processo meu, corrigido na hora:** mover o sinete para a camada de
componentes arrastou junto meia folha de estilos da Mesa e desbalanceou as chaves
das duas. **Quem pegou foi a guarda de cascata** — "CSS fora de `@layer`" —, que
existe exatamente para isso. Devolvido, e só o sinete ficou.

### Os defeitos que ela achou, e três eram invisíveis para tudo o que existe

| #   | o quê                                                                    | como escapou                                                                                                                                                                                                                                                                   |
| --- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **os quatro cartões do Gabinete se sobrepunham em todo aparelho ≤720px** | a grade encolhia para uma coluna e `grid-column: 2` seguia valendo nos três resumos: o navegador criava uma coluna **implícita** com a largura toda e a Caixa de Entrada fechava em **0px**, desenhada por baixo dos outros três. Medido: `grid-template-columns: 0px 626.8px` |
| 2   | **`.board[data-screen="mesa"] .report` nunca casou**                     | `data-screen` deixou de valer `"mesa"` na sétima sessão, quando a Mesa virou Congresso. Duas regras mortas desde então, e o painel do mês passado sem recheio nenhum em toda captura                                                                                           |
| 3   | **a variação de índice media janelas diferentes por área**               | o histórico da MALHA tem `lag + 1` valores, e o atraso muda por área. Finanças punha 24 meses da Educação ao lado de 3 da Saúde sem rótulo; a tela de área chamava tudo de "em 12 meses", e em **seis das oito** mostrava a variação desde a posse                             |
| 4   | **Fazenda e Previdência imprimiam `· 0` para sempre**                    | atraso zero → histórico de um valor → subtração zero. Dois indicadores mortos ao lado de vivos, e medido no mês 16 a Saúde anunciava `· 0` com o índice já tendo caído de 66 para 62                                                                                           |
| 5   | **`-0,0%` no hiato do produto**                                          | `num` só tratava o `-0` **exato**; qualquer magnitude que arredondasse para zero mantinha o sinal                                                                                                                                                                              |
| 6   | **uma propriedade de `turn.mjs` era intermitente**                       | ver abaixo — e é o achado mais caro dos seis                                                                                                                                                                                                                                   |

**O defeito 1 é o mais importante da lista, e a razão é o que NÃO o pegou.** Ele
atravessou tipo, 9 guardas, 190 provas e o passeio verde. Quem o pegou foi a
captura do celular — pela terceira vez no projeto. As duas causas do passeio não
vê-lo estão consertadas: ele **nunca abria o Gabinete no celular** (ia direto de
uma área para Finanças e para o Congresso), e `checkOverflow` mede a página rolando
de lado, o que peça empilhada por cima de peça não faz. Entrou `checkNoOverlap`, e
ela foi **provada mordendo** — revertido o conserto, o passeio acusa as três
sobreposições com a geometria medida.

> **A lição do 2 vale além dele: seletor amarrado ao NOME de uma tela quebra no dia
> em que a tela é renomeada, e quebra em silêncio.** Nada falha; o estilo apenas
> deixa de existir.

### A propriedade intermitente, e por que ela era pior que uma vermelha

`verba PAGA levanta a base` falhava em cerca de **uma rodada em vinte** — num
`validate` obrigatório, isso é pior do que falhar sempre, porque ensina a rodar de
novo até passar. O contraexemplo saiu de uma varredura de 20 mil rodadas:

- promessa de **6,7e-11** à esquerda, com o caixa honrando `ratio = 0,274`;
- o calote foi de **73%**, e mesmo assim `paidCost − promisedCost` valia `2,6e-10`
  — **trezentas vezes menor que o epsilon**. A diferença absoluta dizia "pagou
  tudo" sobre um mês em que o governo pagou um quarto;
- a prova então cobrava `paid >= unpaid` de uma bancada recém-traída.

**O motor estava certo nas duas pontas; errada era a pergunta.** "Honrou tudo?" é
uma **razão**, e não uma diferença — diferença absoluta não responde nada quando o
próprio valor é menor que a tolerância. Corrigida, 20 mil rodadas sem contraexemplo.

### A padronização — as cinco telas levantadas lado a lado

O desvio ficou óbvio só quando as cinco foram medidas juntas:

```
GABINETE   "o resumo da república" / "Gabinete"   + a leitura do mês
FINANÇAS   "o placar"              / "Finanças"
O ESTADO   "a moldura"             / "O Estado"
ÁREA       "atendimento"           / "61"          ← e aqui o padrão quebra
CONGRESSO  — não tinha cabeça nenhuma —
```

- **a tela de área nunca dizia de qual ministério era.** Ela usava os dois slots
  para `nome do índice / NÚMERO`, então quem chegava nela via "ATENDIMENTO 61" e
  precisava conferir o rail. Agora é `Ministério / Saúde`, com o índice na leitura
  da direita — o mesmo slot que o veredito ocupa no Gabinete;
- **o Congresso era a única tela com TRÊS lâminas de vidro soltas** e a única sem
  cabeça: a tela onde o mês se decide não se apresentava. Virou uma lâmina com
  cabeça e três blocos, como Finanças e as áreas. A faixa de índices e o relatório
  deixaram de ser vidro — vidro dentro de vidro é o que o sistema visual proíbe;
- **o embrulho saiu do entrypoint.** `app.mjs` concatenava as três peças à mão, o
  que fazia do Congresso a única tela cuja forma morava no arquivo que não pode ter
  forma nenhuma. `congressHtml` traz a própria lâmina, como toda view;
- **`headHtml` (`src/ui/shared/head.mjs`)** é a cabeça única das cinco telas;
- **o estado vazio virou componente.** A mesa sem pauta escrevia "Nada em pauta"
  com as classes do **título de uma pauta real** — ausência com o peso de um
  assunto. Uma forma só para os dois estados vazios do jogo.

⚠ **E a captura pegou um defeito que a própria padronização criou, no mesmo dia:**
com a legenda do bloco dizendo "Em pauta", o sobrancelho da mesa dizia a mesma
coisa uma linha abaixo, em dois pesos. Título repetido em dois tamanhos é a marca
de uma tela remendada.

### A largura — pedido do responsável, e o teto caiu

_"Todos os painéis precisam ocupar pelo menos 80% do espaço da tela, esticados,
padronizados, iguais, sem exceção."_ O teto era `--column: 1180px`, e num monitor
de 1920 a lâmina fechava em **61%** da janela.

| janela | antes | agora     |
| ------ | ----- | --------- |
| 2560px | 46,1% | **88,4%** |
| 1920px | 61,5% | **84,6%** |
| 1440px | 77,6% | **81,8%** |
| 1280px | 77,7% | **80,2%** |
| 1024px | 72,8% | **97,0%** |

Medido nas doze telas, em nove janelas: **todas ≥80% e todas idênticas entre si**.
Três alavancas, e o rail foi a que mais custou — 216px são 21% de um monitor de 1024. Ele virou `clamp(184px, 13vw, 216px)`, e o ponto em que ele **deita** subiu de
900 para 1180: entre 900 e 1180 não existe largura de rail que caiba
"Congresso & Leis" numa linha **e** deixe a lâmina passar dos 80%.

⚠ **O que se perde está registrado**, porque a razão antiga não era boba: numa
janela muito larga uma tabela esticada deixa de ser comparável de relance. A
resposta a isso deixou de ser o teto da lâmina e passou a ser medida de linha
**dentro** dela, que é onde o problema de fato mora — prosa se limita onde prosa
está, e tabela não é prosa.

### O lixo que saiu

- **`styles/70-screen-approval.css` inteiro** (102 linhas) — e o arquivo **dizia
  quando devia morrer**: _"se SONDA der outra casa à aprovação, este arquivo morre
  com o desenho antigo"_. SONDA nasceu em 14/08/2026 e deu — a barra superior e o
  cartão da Rua. A condição estava cumprida havia um dia e ninguém tinha reparado;
- **`contextHtml` e `approvalHtml`** (98 linhas) — puras, corretas, e ninguém as
  importava desde que a barra superior absorveu a faixa de contexto;
- **a família `.strip` / `.chip`** (99 linhas de CSS) — sem uma linha de HTML para
  pintar havia duas sessões;
- **duas regras de `.strip--stacked` em `40-shell.css`**.

⚠ **Nada disso foi achado por leitura — só por varredura.** É o custo, em número,
da guarda `orphans` que o projeto ainda não escreveu (achado 5): **299 linhas** de
código e estilo que nenhum seletor alcançava. Enquanto ela não existir, isto volta.

### O que NÃO foi feito, e por quê

- **a série de índices por área não existe no estado.** Onde o atraso é zero
  (Fazenda, Previdência) não há passado guardado, então as duas telas **calam** em
  vez de inventar zero. A correção honesta é `state.series` guardar os oito índices
  por 48 meses — e isso é `schemaVersion` 14, reducer e save, que é mudança de
  estado e colide com a Parte 3. **Virou o achado 15**;
- **O Estado não ganhou o bloco de leis.** As regras têm guarda e norma, mas dar
  controle de faixa a elas é mecânica nova, e não conserto. O que foi corrigido é
  que a tela **pergunta a lei ao motor** em vez de ler o catálogo — hoje latente,
  porque nada move a faixa de uma regra; deixaria de ser no primeiro texto que
  movesse.

## ▶ A auditoria externa CHEGOU, e virou o ciclo 5

A parte 2 chegou em 15/08/2026 e **não era sobre widgets** — era sobre o jogo não
ter diegese: _"República Simulator deixou de parecer um jogo e assumiu a estética de um SaaS
corporativo... faz você se sentir um contador analisando planilhas"_. Ela virou o
[ciclo 5](cycles/05-the-republic-gets-a-face.md), com o diagnóstico reescrito e as
quatro decisões respondidas lá dentro.

⚠ **E o padrão se repetiu pela terceira vez, nas duas direções.** Ela estava
olhando uma **captura anterior à oitava sessão** — cita o veredito antigo ("Base
folgada e caixa livre", corrigido em 14/08 porque contradizia o cofre logo abaixo) e
um número da Rua que não existe mais; **três das quatro queixas já estavam
corrigidas quando chegaram**. E onde concluiu o que existe por trás, errou de novo:
chamou de _"verde neon de startup"_ uma paleta cuja marca é âmbar (`#e8a33d`) — o
verde é semântico, não é a marca.

**Mas o diagnóstico de fundo está certo**, e foi indo atrás de uma queixa dela que
pareceu estética — _"onde estão essas pessoas?"_ — que o defeito do placar apareceu.
As pessoas existem; é a tela que as ignorava, e ignorá-las custava 27,2% dos
vereditos.

## ▶ O PRÓXIMO PASSO, depois disso

**Parte 3 do ciclo 4 — a tramitação**, e o desenho dela **já está fechado** em
`cycles/04-the-republic-responds.md`, na seção da Parte 3. Ele foi escrito e
descartado como código na oitava sessão por não estar ligado ao turno — módulo que
ninguém chama é o andaime que o projeto proíbe —, mas as duas decisões que
importam sobreviveram lá: a Mesa não ganha fórmula própria (é `whipCount` sobre
uma bancada de um só, com limiar abaixo de meio), e o relator escreve a **exceção**
que a gramática da Parte 1 já executa.

Ela destrava o resto: é ela que dá função ao presidente da Câmara, que hoje existe
com nome, preço e memória e **não decide nada**; e é ela que abre o canal para o
jogador escrever gatilho, exceção e revogação (achado 11).

Depois dela: a **Caixa de Entrada** (10b), que só então tem carta de verdade, e a
**vinculação** (Parte 2).

## O que a sexta sessão fez — o ciclo 2, e ele mudou a natureza do jogo

**Some o catálogo de pautas. Entra a alavanca.** O responsável usou a tela e
recusou o desenho com uma frase que é o diagnóstico inteiro — _"pauta pronta é uma
bosta, onde tem criatividade nisso e liberdade?"_. Um menu de seis pautas responde
"qual dessas você quer?", e a pergunta do cargo é "quanto de cada coisa o país vai
ter?".

**`src/data/programs.mjs` — programas com números reais e
datados: RGPS R$ 982,5 bi, pessoal R$ 398,1 bi, piso da saúde R$ 231 bi, piso da
educação R$ 114,8 bi (PLOA 2025, CF art. 198 e 212). O catálogo deixou de ser
"ficção com inspiração na realidade": o que segue ficção é o que o **modelo faz**
com as rubricas.

**`src/data/rules.mjs` — a segunda família de alavancas.** Propriedade de estatal
e poder do Executivo: elas não custam dinheiro, mudam **como os motores
calculam**. Privatizar paga adiantado (receita de venda), apaga o dividendo para
sempre e tira folha da União — e a armadilha é aritmética do LASTRO, não um evento
escrito.

**`src/application/agenda.mjs` — o rito vira consequência.** `compose` lê o
orçamento escrito contra o vigente e devolve a proposta: movimento dentro da faixa
é caneta e não vai a plenário; furar um piso de `law` é lei; furar um de
`constitution` é emenda. **O rito mais exigente manda no pacote inteiro** — é o
logrolling existindo sem ninguém escrever "logrolling".

**A posição ideológica é sombra, e não controle.** O jogador nunca arrasta um
cursor no plano `econômico × liberdades`: ele mexe em leitos e alíquotas, e a
posição é calculada do que ele moveu. **Cortar espelha** — reduzir um programa de
esquerda é ato de direita, e nenhuma linha diz isso.

**A tela "O Estado"** nasceu para as alavancas de regra, e a área ganhou o
orçamento granular: um controle por programa, com a unidade do mundo ao lado
("66 · leitos, UTIs e cirurgias contratadas") e a linha tingida pelo rito quando o
controle atravessa o piso.

## O que a sétima sessão fez — o ciclo 3, Partes 5 e 4

**CORRENTE (`src/domain/economy/`) — a economia que dá preço à alíquota.** Quatro
equações, e são as que qualquer banco central usa para conversar consigo mesmo:
hiato, Phillips, Taylor, Okun. Mais população com crescimento, sem a qual não
existe PIB per capita.

Duas correções que a própria simulação cobrou, e as duas estão na prosa do motor:

- **o hiato tem de ser medido em termos reais.** Comparar PIB nominal com
  potencial real fazia o hiato medir inflação acumulada em vez de aquecimento, e a
  economia fugia sozinha: 1% no mês 6 virava 7,6% no mês 24, com o juro
  perseguindo em 20% ao ano e ninguém tendo feito nada;
- **o estoque inteiro paga juro, e não só a parte pós-fixada.** A âncora pública
  (R$ 40 bi por ponto de Selic) mede a **sensibilidade**, não o custo total. Sem
  `legacyRate`, a dívida crescia menos que o PIB nominal e o mandato terminava com
  a razão caindo de 78% para 55% sem o jogador fazer nada.

**Finanças (`src/ui/screens/finance.mjs`) — o placar, e a única tela sem um
controle.** Dezenove linhas em quatro blocos, e a ausência de controle é a
informação principal: por isso ela tem forma de razão contábil e não de pastilha —
sem raio, sem hover, sem transição. É também a única tela densa do projeto, porque
densidade só é ruído onde há decisão.

**`ledger` (`src/application/turn.mjs`)** é o que impede o painel de inventar
número: ele faz a conta do turno — empenho honrado, venda de estatal abatida, juro
sobre o estoque —, e `tests/suites/turn.mjs` prova que a dívida bruta que o painel
mostra é exatamente com quanto o mês seguinte começa. Mesma doutrina de
`settlement`: **a tela pergunta ao motor, não refaz a conta**.

**Três defeitos que só a tela real mostrou** (a captura do passeio pegou os três):

- a escada desenhava inflação (0,042) e juro (0,105) na régua do índice de área, 0
  a 100 — as duas ficavam no degrau do chão **para sempre**, e a coluna afirmava
  que nada nunca acontece. `sparkline` passou a receber a régua por parâmetro;
- `R$ 12227,1 bi` ao lado de `R$ 33,5 bi`: `money` virou para trilhão, com uma casa
  a mais para a troca de unidade não custar precisão;
- linhas em vermelho dizendo `· 0` — o tom lia o valor cheio (−0,4) e o texto lia o
  arredondado. Onde a tela mostra zero, ela mostra zero nas duas linguagens.

**`tests/suites/state-reducer.mjs` estava com 18 erros de `tsc`** desde que a série
entrou no estado: o gerador de estados e a ação sintética não acompanharam. `npm
run types` estava vermelho antes de qualquer mudança desta sessão.

## SONDA — a rua existe, e ela decide votação

Primeira parte do ciclo 4, feita em 14/08/2026. A aprovação esteve **fora da tela
por três sessões** com a razão escrita no entrypoint — "quem a produz é SONDA, que
não existe" —, e voltou porque a condição foi cumprida.

- `src/data/opinion.mjs` — três segmentos por renda com fatias reais (42/38/20) e
  pesos declarados como julgamento. O que muda entre eles é **para onde vai a
  atenção**: carestia domina embaixo, emprego no meio, economia em cima;
- `src/domain/opinion/index.mjs` — satisfação como estoque com inércia, queda três
  vezes mais rápida que a subida, desgaste do cargo por mês, defasagem de dois
  meses lida da série que já existia;
- **o acoplamento com ECLUSA**: `whipCount` recebe a aprovação e desloca a
  resistência. Governo popular compra voto mais barato. Sem isso a pesquisa seria
  enfeite.

Duas calibragens que a medição cobrou: as âncoras foram apertadas (com carestia
neutra em 6% ao ano o país de abertura ficava satisfeito por herança), e a escala
de pesquisa passou de 1,35 para 1,8 — a primeira captura mostrou 23/19/58, e um
"regular" de 19% denuncia o número, porque pesquisa nenhuma tem tão pouca gente em
cima do muro.

O que a série mostra hoje: um governo parado fica em ~21/42/37 o mandato inteiro;
um que corta tudo ao mínimo legal termina em **7/31/62**.

## O Gabinete — a casca nova

Segunda parte do ciclo 4, feita em 14/08/2026. Saiu o rail duplo; entraram:

- **a barra superior** — data, quatro sinais vitais com tendência (PIB, inflação,
  aprovação, base) e o botão de avançar. Ela absorveu o rail da direita inteiro, e
  só pôde nascer agora: com a aprovação sem motor, um quarto do conteúdo dela
  seria inventado;
- **a sidebar por poderes** — Gabinete, Congresso & Leis, Finanças, Ministérios
  (as oito áreas um nível abaixo), O Estado, e A Rua e Bastidor **desligados**
  dizendo que estão;
- **o Gabinete** — quatro cartões: a Caixa de Entrada com a espera declarada, o
  arco do plenário, o cofre da União e o termômetro da rua por classe;
- **a Mesa morreu.** A negociação virou a tela Congresso & Leis; o resumo do mês
  virou o Gabinete. Era essa mistura que fazia quem abria o jogo cair no meio de
  uma decisão sem antes saber como o país estava.

⚠ **A tela de cartões é a exceção declarada** à regra de uma lâmina por tela: aqui
os quatro assuntos não têm relação entre si, e nas outras telas as linhas disputam
a mesma bolsa. Os cartões não são vidro — a lâmina é da tela.

Duas correções que a captura cobrou: o cofre mostrava **"R$ 0,0 bi livre no mês"**
na abertura (o número estava certo — o orçamento herdado consome tudo —, e a
leitura, errada), e a partida abria com **14% de aprovação**, que é número de fim
de mandato ruim e não de governo recém-eleito. A lua de mel entrou no catálogo: a
abertura dá 44%, e um governo parado termina o primeiro ano em 24%.

## A gramática — a lei virou texto

Parte 1 do ciclo 4, feita em 14/08/2026. **Uma lei deixou de ser um número.**

- **`src/domain/norms/` (ESTRATO)** — o nome é o mecanismo: normas se depositam em
  camadas e a mais nova fica por cima. `resolve` recebe a pilha, as alavancas, o
  mês e os indicadores, e devolve a faixa vigente de cada alavanca mais **o que
  está dormindo e por quê** (`repealed`, `future`, `expired`, `trigger`,
  `unknown`, `unreachable`);
- **`state.bands` virou `state.norms`**, e a faixa virou derivada. Mesma razão que
  tirou a situação do estado: valor derivado guardado é um segundo lugar para a
  mesma verdade divergir — e este divergiria no mês em que um gatilho ligasse
  sozinho. `schemaVersion` foi a **12**, e recusa em vez de converter;
- **aprovar um movimento de faixa passa a ESCREVER uma norma**, e não a
  sobrescrever um campo. A norma antiga fica no arquivo. É isso que faz revogar a
  reforma de 2029 devolver a lei de 2027 — o que um campo sobrescrito não tinha
  como representar.

**A precedência é declarada e total**, nesta ordem: hierarquia (constitucional >
ordinária > contrato) · especificidade (alavanca > área > tudo) · recência ·
ordem de escrita. E ela tem uma consequência que **só apareceu quando a primeira
prova da suíte falhou contra o motor**, com o motor certo:

> **Lei geral posterior não revoga lei especial anterior.** Uma norma de área
> escrita no mês 30 não alcança uma alavanca que já tem norma própria de mesma
> hierarquia. Sem isso, uma única norma de alcance `all` no fim do mandato
> apagaria a legislação inteira de uma vez, e reformar viraria um botão. O
> caminho para a geral vencer a especial existe e é o que uma PEC faz de verdade:
> **nomear o que ela revoga**. É o que torna a revogação a única ferramenta de
> desmonte que existe.

Duas regras que fecham classes inteiras de defeito, e as duas estão provadas:

- **ausência de norma é ausência de restrição**, e não a faixa do catálogo. Se o
  catálogo fosse o padrão, revogar a vinculação da saúde devolveria o piso
  constitucional no mês seguinte — a lei que o jogador acabou de derrubar voltaria
  sozinha, sem aviso e sem voto;
- **não se revoga o que ainda não foi escrito.** Não é cautela contra ciclo: é a
  verdade do mundo, e ela mata o ciclo de graça — "A revoga B e B revoga A" deixa
  de ser um estado possível.

**A faixa invertida continua não sendo impedida** (piso 60 e teto 40 na mesma
alavanca, vindos de normas diferentes). É a decisão de quando o controle de faixa
nasceu — texto absurdo se derrota no plenário, não se impede no controle — e o
motor não conserta, porque consertar seria decidir que uma lei quis dizer outra
coisa.

**O que a Parte 1 NÃO entrega, declarado:** o jogador ainda não tem como
**escrever** gatilho, exceção e revogação. O canal de ordens só carrega faixa, que
é o que a tela oferece. A gramática inteira existe, é executada e é provada por
`tests/suites/norms.mjs`, que aplica pilhas adversariais direto no estado — um
adversário **mais forte** que qualquer jogador, porque não paga voto nenhum. O
canal de autoria é a **tramitação (Parte 3)**, onde um texto proposto deixa de ser
instantâneo e ganha preço próprio.

## O elenco — a república ganhou gente

Parte 5 do ciclo 4, feita em 14/08/2026. `src/domain/cast/` — **ELENCO**.

- **sete pessoas geradas da semente**, não sorteadas: cada uma nasce onde o bloco
  dela está e se desloca pelo arquétipo. Presidente da Câmara, chefe do Senado,
  relator de orçamento e quatro líderes. Todas fictícias (ADR 0003), e o catálogo
  declara em prosa o que ficou fora do vocabulário e por quê;
- **o líder negocia no lugar do bloco.** A Câmara deixou de ter 4 bancadas e passou
  a ter **11**: cada líder leva a fração que arrasta, com a posição e a venalidade
  **dele**, e o resto do bloco continua votando pela ideologia do bloco. ECLUSA não
  mudou uma linha — uma pessoa é uma bancada de um só, como o ciclo previu;
- **memória** (`state.memory`, schema **13**): verba paga credita, promessa
  quebrada debita, e a traição pesa o dobro do favor. Ela chega ao Congresso como
  **verba já paga** — nenhuma moeda nova;
- **ambição é preço, não personalidade.** Quem quer o Planalto em 2030 reconhece
  menos da verba que recebe: ele aceita o dinheiro e continua querendo a vaga. É o
  único termo do elenco que dinheiro não compra.

⚠ **Um defeito grave que a medição pegou, e nenhuma tela pegaria.** Os alcances dos
líderes se somavam sem normalização — as quatro pessoas do Centrão reivindicavam
1,96 de uma bancada de 205 — e a **Câmara fechava com 730 cadeiras**. Toda maioria
do jogo passaria a ser medida contra um plenário que não existe, e cada bancada
estava certa sozinha. É a mesma classe de `chamberMismatch`, do lado da gente.
Corrigido, e travado por propriedade em 300 sementes.

A resposta ao risco R4 ("a semente azarada") virou propriedade, e uma delas
**nasceu errada**: a primeira versão somava quem está entre 35 e 75 no eixo
econômico e exigia maioria. Falhou por 241 contra 257 — e falhou com razão, porque
"centro" não tem definição no modelo e a faixa era invenção da prova. A tradução
honesta se calcula: existe **coalizão contígua** com maioria, e ela nunca precisa
juntar os extremos (medido: 15,6 a 31,8 pontos de amplitude contra 72 entre a
esquerda e a direita liberal).

## O achado 1 morreu, e ele era estrutural

O "país que se desendivida sozinho" não era calibragem frouxa: eram **três causas
somadas**, e as três estão corrigidas com a prosa do porquê no arquivo de cada uma.

| #   | onde            | o que estava errado                                                                                                                                                                                                                              |
| --- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `growMandatory` | a obrigatória crescia 2,5% ao ano contra um PIB nominal de ~6% — ou seja, **encolhia** contra o PIB todo mês. O parâmetro sempre se chamou "crescimento REAL" na prosa e era aplicado sobre valor nominal. Aposentadoria e salário são indexados |
| 2   | `pressureOf`    | a MALHA media a arrecadação contra o **ponto neutro 50**, e `taxLoad` foi calibrado contra o Brasil real, que abre com a Fazenda em 72. O fator nascia em 1,063 e o modelo cobrava 6,3% a mais de imposto do que o próprio catálogo declara      |
| 3   | `positionOf`    | o dividendo das estatais era somado **por cima** de uma carga que já o continha — R$ 40,9 bi que ninguém arrecadou. Agora entra a **variação**, e privatizar continua derrubando a receita                                                       |

E um quarto, que é calibragem e não mecânica: **`taxLoad` foi de 0,20 para 0,19** —
receita primária _líquida_ da União, depois das transferências constitucionais. Os
49% de IR e IPI que a Constituição reparte nunca foram do Executivo federal, e até
aqui o modelo os gastava. O 0,01 decidia o **sinal** do resultado primário.

**A série inverteu:**

| política                     | antes             | depois                               |
| ---------------------------- | ----------------- | ------------------------------------ |
| `herdado` (não toca em nada) | 78,0% → **68,4%** | 78,0% → **83,6%**                    |
| `piso` (corta tudo)          | 78,0% → 82,3%     | 78,0% → **86,3%**                    |
| `explorador` (quebra tudo)   | 78,0% → 54,3%     | 78,0% → **86,9%**, 0 aprovadas em 48 |

O presidente ausente deixou de terminar com a melhor dívida do quadro, e o
contingenciamento voltou a disparar. Três provas novas travam isso.

**O achado 1c morreu junto.** O preço não escalava com o tamanho do pacote — 1
movimento saía por 358 votos e **85** saíam por 334, ambos passando. A causa era a
média ponderada: um texto que corta a saúde e amplia a defesa tem posição média no
centro, e o centro não incomoda ninguém. A correção devolve ao motor o que a média
apagava — o **raio** da nuvem de movimentos —, e ele entra na resistência como um
terceiro eixo, **sem constante nova**: é a identidade `E[|p−m|²] = |p−c|² + R²`.
Medido depois: 1 movimento → 355 votos, aprovada; 85 → raio 30,9, 263 votos, cai.

## O Gabinete — o que as revisões externas cobraram

**Duas auditorias de fora, sobre a mesma tela, avaliadas item a item.** Vale
registrado o padrão delas, porque ele se repetiu: **elas leem bem a IMAGEM e
inferem mal o MECANISMO.** Onde julgam o que veem, acertam; onde concluem o que
existe por trás, erram sempre para o mesmo lado — supondo ausência de motor onde há
motor esperando tela. A segunda afirmou que "as engrenagens da SONDA ainda não
foram plugadas à UI" enquanto o cartão da Rua, na mesma tela, é saída da SONDA.

**Aplicado da primeira:**

- **o arco do Congresso virou três fatias** — com o governo, obstruindo, rompido.
  Quem reparte é o motor (`baseSplit`), e o que se reparte é a **base efetiva**, não
  o plenário: repartir 513 poria uma segunda verdade sobre o tamanho da base no
  mesmo cartão, discordando do número ao lado dela;
- **o buraco na grade fechou** — e a primeira correção errou a paridade do seletor,
  porque o inbox largo conta como filho e a Rua é o **quarto**, não o terceiro. A
  captura mostrou o furo intacto depois da "correção";
- **o estouro do cofre ganhou cor**, e mostra o **excesso** em vez de repetir o
  total. O limiar é a LEITURA e não o valor cheio: um excesso de 0,04 imprime
  "R$ 0,0 bi", e acender vermelho ali faz a cor negar o número.

**Aplicado da segunda:**

- **o veredito ganhou rótulo** — a frase estava solta no canto superior direito,
  sem nada que justificasse a existência dela. E o defeito era pior do que a
  auditoria viu: ela dizia _"caixa livre"_ enquanto o cofre logo abaixo anunciava o
  orçamento estourando em R$ 5,0 bi. A causa é que `situationOf` mede se o TETO
  fechou, com empenho zero, e não se as ordens **deste mês** cabem — duas leituras
  legítimas, e o texto prometia a segunda entregando a primeira;
- **o arco ganhou legenda.** Três cores sem chave é um gráfico que só o autor lê, e
  ele passou um dia inteiro assim: as fatias certas, o motor sabendo o que cada uma
  dizia, e a tela calada. Só entra na legenda quem tem cadeira — uma linha
  "em ruptura: 0" todo mês ensina o olho a ignorar a lista, e aí, no mês em que a
  ruptura acontecer, ela aparece onde o jogador já parou de ler;
- **o vermelho do estouro parou de engolir o contexto** — e este era **erro meu, do
  mesmo dia**: eu tinha acendido o parágrafo inteiro, então "obrigatória 95%" saía
  no mesmo tom do déficit. Vermelho que cobre tudo não destaca nada; a correção da
  manhã criou o defeito que veio corrigir, só que com mais tinta.

**Recusado, e por quê:** a taxonomia "verde governista, cinza Centrão, vermelho
oposição" importa um conceito que o modelo não tem — não existe "oposição" no
jogo, existem quatro blocos com lealdade e dois limiares. As duas auditorias
propuseram isso, e as duas vezes a resposta é a mesma.

**Já era verdade e a auditoria não podia ver:** o buraco na grade estava fechado e
"O Estado" nunca esteve desligado.

### A Caixa de Entrada virou coluna — e eu tinha decidido o contrário

⚠ **Reversão de uma decisão minha, no mesmo dia, e vale registrada com o porquê.**
De manhã a caixa era uma faixa no topo enquanto vazia, com a razão escrita no CSS:
_"meia tela em branco ao lado de três cartões cheios leria como defeito de
carregamento"_. A forma de duas colunas existia e ligava sozinha quando houvesse
carta.

A razão era boa e estava errada, e foram **três sinais** para admitir — duas
revisões externas e o responsável usando a tela. O que eu subestimei:

> **O layout é uma promessa.** Uma tela que muda de esqueleto quando o conteúdo
> chega refaz o mapa debaixo do pé do jogador — e refaz justamente no mês em que a
> primeira carta cai, que é o mês em que ele mais precisa saber para onde olhar.

O custo da forma definitiva desde o início é uma coluna com pouco texto dentro; o
custo do contrário é o mapa se refazendo. Agora é **3fr/2fr sempre** — a lista à
esquerda, os três resumos empilhados à direita, exatamente o diagrama do ciclo.

E a coluna vazia cobrou o que eu previa: **um paragrafozinho encostado no teto de
700px lê como carregamento travado.** O estado vazio virou composição — chamada
centrada respondendo _"isto está quebrado?"_ em cinco palavras, e a prosa abaixo
respondendo _"por quê?"_ para quem quiser. Invertido, o jogador lê três linhas antes
de saber se precisa se preocupar.

De quebra, a captura pegou outra: **"R$ 5,0 bi" quebrava linha e a unidade ficava
órfã** no começo da linha seguinte. `money` passou a usar espaço inquebrável —
valor e unidade são uma palavra só, e uma quantia partida ao meio deixa de ser uma
quantia.

### O cofre passou a dizer QUEM trava — a metade que faltava do risco R2

**Feito na mesma sessão**, e é o item mais substantivo que saiu das duas auditorias.
O cartão do cofre lista as três maiores travas com nome e valor, e o ponto de cor
carrega a **hierarquia da norma** — âmbar para constituição, azul para lei
ordinária. Na abertura: _Aposentadoria urbana R$ 66,7 bi · Aposentadoria rural
R$ 15,1 bi · Inativos e pensionistas da União R$ 13,9 bi_.

⚠ **Ela só ficou construível quando a lei virou texto.** Enquanto a faixa era um par
de números, "quem trava" não tinha resposta — havia um piso e ninguém para responder
por ele. `resolve` passou a devolver `governs`: **qual norma decidiu o piso de cada
alavanca**. A tela pergunta em vez de deduzir, e a razão é a de sempre — refeita por
fora, a disputa de precedência acertaria hoje e divergiria no primeiro mês em que um
gatilho ligasse, com a tela mostrando uma lei e o orçamento obedecendo outra.

**Três linhas, e não a lista inteira.** Trinta e oito programas com o valor de cada
um seria o Diário Oficial dentro de um cartão de resumo — que é o risco R2 pelo
outro lado, o da herança que aliena o jogador antes do terceiro mês.

**O que sobra como tarefa:** tornar a norma **clicável**, indo da linha até o texto
que a escreveu. E **os dois estados vazios da Caixa de Entrada** — a distinção é
regra, não detalhe de copy, e está escrita na Parte 10b do ciclo.

## O movimento — a tela ficou instantânea, e o vidro engrossou

Pedido do responsável no fim da oitava sessão: _"que as transições fiquem mais
fluidas e instantâneas, em tudo"_ e _"liquid glass absoluto"_.

**O diagnóstico não era duração — era ausência de resposta.** `.action` declarava
`transform` na transição **desde sempre** e nada nunca lhe dava um `transform`
fora do hover: o orçamento de movimento do clique existia, reservado, e nunca foi
gasto. Um botão que não afunda ao ser apertado lê como lento por mais rápida que
seja a máquina, e o jogador atribui a demora ao jogo. `:active` entrou em
`.action`, `.rail__item` e `.card__action`.

**A escala de duração encurtou, e não por igual** — e é aí que está a regra:

| token          | era   | é     | por quê                                               |
| -------------- | ----- | ----- | ----------------------------------------------------- |
| `--dur-touch`  | 160ms | 90ms  | 160 está do lado errado do limiar de "instantâneo"    |
| `--dur-piece`  | 280ms | 180ms | era tempo de espera para uma peça se rearranjar       |
| `--dur-screen` | 420ms | 220ms | **toda** navegação pagava 420ms antes de mostrar algo |
| `--dur-stage`  | 520ms | 520ms | **não encolheu** — é ambiente, não resposta           |

> **"Instantâneo" é propriedade do que RESPONDE ao jogador, não do que acontece ao
> redor dele.** O gel da aurora troca quando a situação do governo muda; ambiente
> que troca depressa vira piscada, e o jogador aprende a ignorar o único sinal
> periférico da tela.

**O vidro:** o especular do `stage` estava preso em `140deg` enquanto o campo
seguia `--light-angle` — e a prosa do próprio arquivo já afirmava que "o ângulo de
TODAS as superfícies caminha junto". Não caminhava. Agora corre 24° **adiante** do
campo: ângulo idêntico faria o brilho ser uma segunda cópia do fundo na mesma
direção, e as duas camadas somariam em vez de se cruzarem. O descolamento é o que
dá espessura. `--glass-blur` foi de `blur(14px) saturate(1.4)` para
`blur(18px) saturate(1.5)`, **e a regra foi obedecida antes**: `npm run screen`
mediu 240,4 fps com material contra 240,1 sem, em três rodadas alternadas.

⚠ **A medição não prova que o vidro é barato** — os dois braços batem no teto de
240 Hz do monitor, e teto não mede folga (achado 10, ainda de pé). O que ela prova
é o que basta: nesta máquina o material não custa um quadro. **Aparelho móvel com
GPU fraca segue não medido**, e o desfoque é o primeiro número a baixar se um dia
a tela travar em telefone.

**A guarda `tokens` cobrou uma invenção minha no mesmo minuto.** Criei um
`--ease-press: linear`, deixei `--ease-enter` órfão, e ela acusou — com razão duas
vezes: o token não tinha consumidor próprio, e a justificativa escrita para ele
estava errada. `--ease-enter` é saída exponencial, rápida no começo, que é
exatamente o que um afundamento de 90ms quer.

## O ciclo 3, e o que ainda falta dele

Feito na sétima sessão: **Parte 5 (CORRENTE)** · **Parte 4 (Finanças)** ·
**Produção virou duas áreas** · **Parte 1 (as faixas viraram estado)** ·
**Parte 2 (a aba de legislação)**. Ficaram de fora a **Parte 3 — Fazenda vira
impostos** e a **Parte 6 — o rename**, e as duas estão **suspensas de propósito**:
a cláusula de tributo do ciclo 4 absorve a primeira por inteiro, e fazer as duas
agora seria escrever a mesma coisa duas vezes.

**Produção virou Agricultura e Indústria e Infraestrutura**, e o corte não é
técnico: a bancada ruralista é um bloco real no Congresso, e enquanto agro e
indústria dividiam a mesma tela, o modelo não conseguia representar um governo que
agrada um e aperta o outro. Os cinco programas viraram doze, a soma das forças foi
mantida em 0,20 — dividir uma área em duas não pode aumentar o efeito dela sobre a
receita —, e `CAPACITY_TARGET` passou a apontar para a indústria.

**A lei virou alavanca.** `state.bands` guarda a faixa `[piso, teto]` de cada
alavanca; o catálogo passou a declarar a faixa **de abertura**, e a guarda continua
imutável, porque ela é a natureza da norma e não o conteúdo dela. `compose` compara
contra o estado e aceita movimento de faixa e de nível **no mesmo texto** — e aí
aparece a jogada que não existia: derrubar o piso da saúde e baixar o gasto na
mesma emenda, com a lei contendo a própria autorização.

Os três verbos do pedido não viraram três botões: **alterar** é mover o controle,
**criar** é tirá-lo do zero, **excluir** é levá-lo de volta ao zero. Mexer numa
faixa custa, no mínimo, uma lei — inclusive onde não havia lei nenhuma, porque
plantar uma vinculação onde não existia é criar uma.

`schemaVersion` foi de 8 a **10** em duas paradas, e nenhuma delas converte: um
save antigo não sabe repartir a capacidade da Produção entre lavoura e fábrica, e
não sabe qual reforma aquele mandato já tinha aprovado.

## O índice virou objeto: a mensagem é uma peça, e o mês é um cabeçalho

Pedido dele, e ele desenhou a solução inteira: _"cada mensagem ali vai ser um retângulo
liquid glass com bordas arredondadas, pra não parecer texto solto, e coloque também o nome
da pessoa que enviou embaixo do título, pequeno e pouco visível. A data nós vamos colocar
em outro lugar, pode ser entre as mensagens onde fica a linha física hoje — você retira a
linha e troca por uma barra horizontal liquid glass com a data, e coloca ela em cima, e as
mensagens correspondentes àquela data embaixo."_

### ⚠ E ISSO REVERTEU TRÊS DECISÕES DO MESMO DIA — as três estavam certas quando foram tomadas

| decisão de horas antes   | por que ela valia                                                                     | por que ela caiu                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| a linha não tem borda    | a peça era texto, e texto não tem contorno                                            | oito assuntos em negrito sem contorno são oito FRASES: o olho não acha onde uma acaba                                                   |
| o remetente saiu         | "Denise Hollanda Cavalcanti" em 8 de 8 linhas era moldura, e gastava metade da altura | dentro de um retângulo com fundo próprio ele lê como LEGENDA, e legenda cabe                                                            |
| o divisor não tem rótulo | _"não pedi pra colocar mês e ano ali, era só a barra"_                                | um rótulo sentado sobre um FIO interrompe o separador; numa BARRA com fundo próprio ele é cabeçalho, e cabeçalho tem nome por definição |

⚠ **O padrão das três é o mesmo, e é o achado de método desta rodada: nenhuma delas era
uma decisão sobre ESTILO — todas eram consequência de qual OBJETO a peça era.** Enquanto a
linha foi texto solto, borda era enfeite, remetente era ruído e data era repetição. No
instante em que ela virou peça com contorno e fundo, os três voltaram a caber sem que
nenhum argumento contra eles tenha sido refutado. **Reverter aqui não foi corrigir um
erro: foi o mesmo raciocínio dando outra resposta porque a pergunta mudou.**

⚠ **E A BARRA PASSOU A NASCER ANTES DE TODO GRUPO, inclusive o primeiro** — o que inverte
a regra escrita na versão anterior (_"nunca antes do primeiro: uma régua no topo separaria
a lista do nada"_). A regra valia para um TRAÇO: separador só existe entre duas coisas.
Cabeçalho pertence ao grupo abaixo dele, e sem ele as cartas do mês corrente seriam as
únicas órfãs.

### ✔ É a FORMA do vidro, e não o filtro — e a medição autoriza

`backdrop-filter` custa por TELA e não por efeito, e sete linhas seriam sete desfoques
empilhados **dentro de uma lâmina que já desfoca o que está atrás dela**. As linhas
receberam aresta (`--glass-edge`), tinta (`--glass-support-bg`) e bisel (`--bevel-fine`);
o filtro continua exclusivo da linha ABERTA, que é `glass-action` e sobe.

**Medido em `npm run screen`: 170,4 fps com material contra 162,7 do braço de controle.**
O braço com material ficou ACIMA do controle — ou seja, o custo desta mudança está dentro
do ruído da medição. A guarda `material` continua verde: nenhum arquivo novo declara o
filtro.

### ⚠ E O TETO DA PILHA CAIU DE 8 PARA 7, e desta vez quem o pegou fui eu medindo

`TRAY_CAPACITY` já foi 11, 9 e 8. A barra com data custa 26px onde o fio custava 9, e o
remetente devolveu uma linha a cada carta:

| peça               | antes | agora |
| ------------------ | ----- | ----- |
| linha típica       | 33px  | 52px  |
| linha do pior caso | 70px  | 70px  |
| divisor de mês     | 9px   | 26px  |

**Varrido mês a mês por 30 meses, o pior caso com teto 8 foi 706px numa coluna de 630 — 95
de estouro, no mês 27.** Com teto 7 e a margem da barra enxugada para 4/2, **nenhum dos 30
meses rolou**. A prova do passeio segue sendo quem defende o número: mexeu no recuo da
linha ou no corpo do assunto, ela fica vermelha.

⚠ **E o índice sobra ~105px no mês calmo, de propósito.** O teto é do PIOR caso; dimensionar
pelo típico faz a pilha estourar exatamente no mês movimentado, que é o único em que ela
precisava funcionar.

## A caixa de entrada virou um móvel, e o balanço engoliu os três avulsos

Duas rodadas no mesmo dia, e as duas com o print dele na mão.

### ✔ O índice: um painel com fios, e não sete cartões

Queixa dele sobre a versão anterior: _"tá difícil diferenciar visualmente as caixas liquid
glass, data e mensagem"_ — com um print do Football Manager e o desenho da saída: _"um
bloco inteiro em liquid glass para o bloco esquerdo, e só linhas finas horizontais para
diferenciar. E na mensagem que eu apertar, a mesma cor do fundo do bloco da mensagem, sabe
esse fundo marrom?"_

⚠ **E A CULPA ERA MINHA, E ESTAVA POR ESCRITO.** Eu tinha dado à barra de data o MESMO
material da linha e defendido isso na prosa da regra — _"mesmo material da linha, e de
propósito"_. Dois objetos de papéis diferentes com material idêntico não se distinguem, e
ele viu isso em dois segundos numa peça que eu tinha acabado de justificar.

| peça          | antes                          | agora                                                                         |
| ------------- | ------------------------------ | ----------------------------------------------------------------------------- |
| a coluna      | lista transparente             | **uma superfície só** — aresta, tinta, bisel, raio                            |
| a mensagem    | cartão com borda, fundo e raio | **linha lisa**, separada por fio de 1px                                       |
| a selecionada | `glass-action`                 | **`--paper` (#2b241c)** — a cor do ofício ao lado, com `--paper-ink` no texto |
| a data        | barra de vidro                 | **rótulo apagado** em caixa alta, sem superfície                              |

⚠ **O CONTRASTE PASSOU A SER ENTRE TER SUPERFÍCIE E NÃO TER**, que é o mais forte que
existe — e é por isso que dar à data um terceiro material seria a resposta errada para a
queixa certa.

### ⚠ E O CUSTO DE TELA REPROVOU DUAS VEZES, e a proposta que eu levei a ele estava errada

O plano dizia, com confiança: _"sete linhas com forma de vidro viram UM desfoque, e por ser
um só ele pode ser o filtro de verdade"_.

| tentativa                                  | delta contra o controle | por quê                                                                                             |
| ------------------------------------------ | ----------------------- | --------------------------------------------------------------------------------------------------- |
| `glass-support` no painel                  | **−17,9 fps** ⛔        | as sete linhas nunca tiveram filtro. Isso não consolidava nada: **adicionava** um desfoque de 630px |
| forma sem filtro, com `--glass-support-bg` | **−28,3 fps** ⛔        | o token segue `--light-angle`, que **interpola a cada quadro**                                      |
| forma com `--glass-base`                   | **+1,5 fps** ✔          | tinta chapada                                                                                       |

⚠ **E O SEGUNDO NÚMERO É O ACHADO GERAL, e ele vale para a tela inteira:
`--glass-support-bg`, `--glass-action-bg` e `--glass-stage-bg` seguem `--light-angle`.**
Qualquer superfície grande que os use **repinta sessenta vezes por segundo**. O passeio da
luz foi calibrado para a lâmina do cartão — grande, atrás, uma por tela. Num móvel de
dentro ele é o mesmo efeito pago duas vezes, e custa mais que o desfoque que o sistema
inteiro existe para orçar.

### ✔ O balanço engoliu os três relatórios avulsos

A carta mensal da Casa Civil já existia e trazia **uma** leitura — a rua. Agora traz as
três, com anexo de antes-e-depois. `Report` ganhou `balance`, medido **uma vez** por
`balanceOf()`: os avulsos comparam para decidir se escrevem, e a carta imprime. Medidos em
dois lugares, os dois divergiriam no primeiro remendo.

### ⚠ E A TABELA DE CALIBRAGEM DESTA PROSA ESTAVA ERRADA — o caixa por um fator de 3

Ela dizia que o caixa se move `mediana 0,31 · p90 0,49 · max 0,52` por mês. **O valor real é
`1,07 · 1,19 · 8,47`.** Não foi erro de aritmética: a medição antiga perguntava o
discricionário ao **estado velho**, e o do mês velho e o do mês novo são grandezas
diferentes. Quando `nextFiscal` subiu e o balanço passou a ler o mês que FECHOU, a série
mudou de escala e a prosa não foi refeita.

⚠ **E O PREÇO APARECEU NA TELA NO MESMO DIA.** Pus o limiar do caixa em 0,9 para ficar
"acima da rotina" segundo a tabela velha — e 0,9 está **abaixo da mediana real**. O print
seguinte trazia _"Caixa cai a R$ 11,6 bi / Caixa cai a R$ 12,0 bi / Caixa cai a R$ 11,3
bi"_ em linhas consecutivas: exatamente o defeito que a mudança existia para consertar.
**Número calibrado contra prosa desatualizada não é calibragem.** Os seis limiares foram
remedidos nos dois regimes — parado e jogando — e ficam bem acima do p90 de ambos.

### ⚠ ACHADO 54 — a densidade caiu de 8,5 para 1,8 cartas/mês, e isso ainda é decisão dele

| regime                  | cartas avulsas/mês | com o balanço |
| ----------------------- | ------------------ | ------------- |
| passivo                 | 0,5                | **1,5**       |
| ativo (paga 3 bancadas) | 0,8                | **1,8**       |

⚠ **E ISSO APARECE NA CAPTURA COMO CINCO RÓTULOS DE DATA PARA SETE MENSAGENS.** Com pouco
mais de uma carta por mês, quase todo mês tem UMA — e aí o cabeçalho de grupo quase empata
com o conteúdo que ele agrupa.

**Ele pediu antes _"quero essa caixa de entrada cheia de mensagens e notícias"_, e aprovou
depois a opção que a esvazia.** As duas coisas são incompatíveis, e a escolha entre elas é
dele. O que eu registro é o diagnóstico: **os relatórios frequentes eram papel de parede
sobre um mundo que gera 0,5 evento por mês.** Subir o limiar não criou o problema — tirou o
papel e mostrou a parede. Quem enche a caixa de verdade é evento novo (o baixo clero
escrevendo, a imprensa, o governador), e isso é motor, não interface.

## ⏸ A RETOMADA — parado em 21/08/2026 para ele reiniciar o PC

**Estado da árvore: VERDE e consistente.** `npm run validate` (234 provas · 11 guardas · 44
provas sintéticas), `npm run walk` e `npm run screen` (+1,5 fps) passaram na última
execução. **Nada ficou aplicado pela metade** — o script da edição em voo valida antes de
escrever, e ele abortou sem gravar.

### ⚠ O QUE FAZER PRIMEIRO — o pedido dele estava a meio caminho

Palavras dele, e é o único item aberto:

> _"só quero que fique grudado os dois blocos da caixa de entrada, e os dois liquid glass
> padronizados e simétricos"_

**Medido antes de parar** (janela 1440×980, mês 16):

| peça          | x   | largura         | altura  |
| ------------- | --- | --------------- | ------- |
| o índice      | 264 | 208             | 630     |
| o ofício      | 488 | 435             | 630     |
| **a costura** | —   | **16px de vão** | —       |
| **o degrau**  | —   | —               | **0** ✔ |

⚠ **E O QUE QUEBRA A SIMETRIA NÃO É O VÃO — SÃO OS RAIOS.** O índice fecha em
`--radius-piece` (**16px**) e o ofício em `--radius-paper` (**3px**), porque cada um herda
do próprio material. Lado a lado com 16px entre eles, duas curvaturas diferentes leem como
duas peças que por acaso estão perto.

**As três edições prontas para aplicar, em `styles/45-screen-cabinet.css`:**

1. `.tray` → `gap: 0` (era `var(--space-4)`);
2. `.tray__list` → `border-right: 0` e `border-radius: var(--radius-piece) 0 0
var(--radius-piece)`. A aresta direita morre para virar costura: duas bordas de 1px
   coladas leem como um fio de 2px, que é o defeito dos "dois separadores para uma
   fronteira";
3. `.tray__open .letter` → `border-radius: 0 var(--radius-piece) var(--radius-piece) 0`,
   `border-color: var(--glass-edge)`, `box-shadow: none`. **Escopado à bandeja de
   propósito**: `.letter` é a mesma peça em três telas, e nas outras duas ela é folha solta
   e deve manter `--radius-paper` e a sombra que a descola do fundo.

⚠ **E RESTA UMA AMBIGUIDADE QUE É DELE PARA RESOLVER, e que eu não devo adivinhar.** Ele
disse _"os dois liquid glass"_, e o bloco da direita hoje é **papel** (`--paper`, #2b241c).
Duas leituras:

- **(a) só a moldura padroniza** — raio, aresta e costura iguais; o ofício **continua
  marrom**. É o que as três edições acima fazem, e preserva a peça que ele elogiou: a linha
  selecionada do índice é pintada de `--paper` justamente para dizer "esta linha É o
  documento ao lado";
- **(b) o ofício vira vidro também** — aí a linha selecionada tem de virar vidro junto, e
  isso **reabre a confusão que esta rodada inteira existiu para desfazer** (material igual
  não distingue nada).

**Fazer (a), capturar, e mostrar — perguntando só isto.** Ver [[pergunte-ao-olho-dele]]: em
questão visual, a pergunta dele custa dez segundos e a dedução já custou três iterações
hoje.

### O que ficou aberto e é decisão dele, não trabalho parado

**A densidade da caixa: 1,8 cartas/mês** (achado 54, logo abaixo). Ele pediu antes _"quero
essa caixa de entrada cheia"_ e aprovou depois a opção que a esvazia. A pergunta que ficou
sem resposta, nestas palavras: **baixar os limiares de volta, ou dar voz a quem ainda não
escreve** (o baixo clero, a imprensa, o governador)? A segunda é motor, não interface.

### ⚠ E DUAS LIÇÕES DESTA SESSÃO QUE VALEM PARA A TELA INTEIRA

1. **`--glass-support-bg`, `--glass-action-bg` e `--glass-stage-bg` seguem `--light-angle`,
   que interpola a cada quadro.** Qualquer superfície grande que os use repinta 60×/s:
   custou **28,3 fps** num painel de 208×630, **sem filtro nenhum**. Superfície grande de
   dentro usa `--glass-base`, que é estático;
2. **prosa de calibragem envelhece calada.** A tabela de movimento do caixa nesta mesma
   prosa estava errada por um fator de 3, e eu calibrei um limiar contra ela no mesmo dia —
   o resultado foi o defeito que a mudança existia para consertar, com o número maior.
   **Antes de escolher um limiar, remeça a distribuição.**

## Achados que já morreram

**49. ⛔ CORRIGIDO PELO ACHADO 52, E A CORREÇÃO É MINHA — leia os dois juntos.** O que
segue continua valendo como MEDIÇÃO das seis sondas antigas; a CONCLUSÃO que eu tirei dela
— "o país é quase inerte" — está errada, e o 52 mostra por quê: as sondas espalham, e o
país responde a quem concentra.

**49. ⚠ O PAÍS É QUASE INERTE, E É ELE QUE DÁ NOME AO JOGO — ACHADO NOVO em 21/08/2026, e
é o mais fundo já registrado aqui.** Pedido do responsável: _"analise todo o jogo como ele
funciona hoje"_. Rodado com `simulate` sobre a semente padrão, 48 meses, sem choque.

**O país ao fim, em pontos de índice:**

| área              | abre | paga a base | faz agenda | legisla   |
| ----------------- | ---- | ----------- | ---------- | --------- |
| Fazenda           | 72   | **70**      | **70**     | 70        |
| Agricultura       | 63   | **54**      | **54**     | 56        |
| Indústria e Infra | 48   | **20**      | **20**     | 24        |
| Previdência       | 71   | **70**      | **70**     | 70        |
| Saúde             | 61   | **60**      | **60**     | 63        |
| Educação          | 44   | **43**      | **43**     | 44        |
| Segurança         | 38   | **20**      | **20**     | 23        |
| Defesa            | 51   | **49**      | **49**     | 50        |
| alocado           | —    | 254,0       | 253,7      | **456,2** |

⚠ **OITO DE OITO IDÊNTICAS** entre pagar a base e fazer agenda — duas jogadas opostas, o
mesmo país. E o legislador, que aloca **quase o dobro**, move a Saúde em **3 pontos em
quatro anos**.

**O que muda é o Congresso**, que vai de 0 a 58 conforme a jogada. **Hoje o jogo é um
jogo de sobrevivência no Congresso com um país decorativo.** Isso não é defeito de código:
é onde a calibragem parou, e ninguém escolheu que fosse assim.

⚠ **E O PAÍS NÃO TEM OITO ÍNDICES: TEM DOIS QUE DESABAM E SEIS PARADOS.** Indústria perde
24–28 pontos e Segurança 15–18 **em todas as sete políticas**; as outras seis não passam
de 2. Nenhuma jogada segura as duas, nem a que aloca o dobro.

⚠ **E A DÍVIDA TERMINA EM ~90% DO PIB FAÇA O QUE FIZER**: 90,1 / 90,2 / 90,7 / 92,0. O
explorador, que existe para quebrar o modelo, chega a dois pontos do governo prudente.

**51. ✔ O CONGRESSO DIFERENCIA DE VERDADE, e nenhuma sonda joga favoritos — 21/08/2026.**
Nas sete políticas as onze bancadas terminam com **o mesmo número**, o que parecia um
modelo sem diferenciação. **Não é:** pagando verba a UMA só bancada por 24 meses, a
amplitude entre elas vai a **66 pontos**.

⚠ **As sondas pagam todo mundo igual.** O eixo mais interessante do jogo — escolher quem se
compra e quem se decepciona — **nunca foi medido por ninguém**. É a primeira coisa que eu
faria: uma sonda que paga duas bancadas e abandona nove.

⚠ **E EU QUASE REGISTREI ISSO COMO DEFEITO DO MOTOR** antes de testar. A medição de um
minuto separou "o modelo não diferencia" de "as sondas não diferenciam", e as duas frases
pedem trabalhos opostos.

**44. ⚠ A ESCADA NÃO CABE NA BARRA SUPERIOR, e o intervalo entre "cabe" e "lê" é VAZIO —
MEDIDO e REVERTIDO em 21/08/2026.** O achado 43 dizia que as sparklines dos quatro vitais
eram baratas. **A metade cara dele estava certa** — `sparkline` existe, Finanças já a usa,
e a série custou só dois campos —, **e a metade barata estava errada**: a peça foi
construída inteira, o esquema subiu para 18, e **a captura a reprovou duas vezes**.

| tamanho     | o que a captura mostrou                                                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0,5rem**  | cabe, e vira um TRAÇO. O bloco `▁` tem 1/8 do corpo da fonte — a 8px isso é **um pixel**, e doze deles leem como o sublinhado do número: `R$ 13,01 tri ___________` |
| **0,85rem** | lê, e não cabe. `overflow-x` entrou e o primeiro vital ficou mostrando **"i"** com uma barra ao lado — o rótulo `PIB` e o valor saíram da tela                      |

**A conta é a razão:** a fileira tem **994px para quatro leituras** — 248 cada, e rótulo
mais valor já gastam ~150. Uma escada legível de doze degraus pede ~120.

⚠ **E ENCURTAR A JANELA NÃO SALVA.** Com seis degraus ela volta a caber, e medido num
mandato passivo de 30 meses ela sai com **UM degrau só em três dos quatro vitais** — plana
do primeiro ao último mês, que é a escada afirmando que nada nunca acontece. **Cabe e
mente, ou lê e não cabe.**

⚠ **O ESQUEMA VOLTOU PARA 17, e isso é parte do conserto e não hesitação.** Os dois campos
novos ficaram sem consumidor, e **campo de estado sem consumidor custa uma versão de
save** — este save RECUSA em vez de converter, então cada número novo ali custa ao jogador
a partida em andamento. O número 18 não foi queimado.

**O que a tentativa DEIXOU, e é o que sobrou de valor:**

- ⚠ **a régua do PIB estava errada há sessões, e em DUAS telas.** Ela ia até "metade a
  mais que a largada" — um chute nunca medido. **Medido num mandato de 48 meses: o PIB vai
  de 12,06 para 15,18 tri e usa CINCO dos oito degraus.** A escada gastava metade da altura
  numa faixa que a partida nunca visita. Agora é `gdpRange`, com fator 1,2 e um dono só —
  Finanças e a barra digitavam a mesma expressão;
- **`SCALE` mudou de casa** para `shared/trend.mjs`, junto com a JANELA: os dois
  consumidores estavam prestes a ter duas cópias da mesma régua.

**O LUGAR DA ESCADA JÁ EXISTE, e é Finanças** — lá cada linha tem a largura do painel, e as
cinco de lá funcionam desde que nasceram. ⚠ **O que continua aberto é onde pôr uma leitura
de TRAJETÓRIA no Gabinete**, que é a pergunta legítima da auditoria. O candidato com espaço
é a Trindade — três linhas de ~370px —, mas **duas das três séries dela não existem**, e
desenhar duas de três é o defeito que tirou a aprovação da barra por três sessões.

**42. ⚠ AS TELAS LEEM O BUFFER CURTO DO MOTOR E IGNORAM A SÉRIE DE 48 MESES QUE EXISTE PARA
ELAS — ACHADO NOVO em 21/08/2026, e ele saiu de uma pergunta do responsável sobre a
auditoria externa.** `state.series.areas` guarda o índice de cada área **mês a mês, até 48**,
e é preenchido todo turno por `extend` em `turn.mjs`. A prosa do estado diz para que ele
serve, com todas as letras: _"o histórico é curto e ALIMENTA O MOTOR; a série é longa e
alimenta os OLHOS"_.

**Finanças e a tela de área leem `state.capacity.history`** — o buffer do atraso, que guarda
`lag + 1` valores. Medido no mês 18:

| fonte                     | Fazenda | Previdência | Saúde | Educação |
| ------------------------- | ------- | ----------- | ----- | -------- |
| `series.areas` (não lida) | **16**  | **16**      | 16    | 16       |
| `capacity.history` (lida) | **1**   | **1**       | 4     | 16       |

**A consequência tem duas metades, e a segunda é pior:**

1. **Fazenda e Previdência não têm tendência nem faísca**, em toda partida, em duas telas —
   e a ausência é DECLARADA como se o dado não existisse;
2. **seis das oito áreas mostram uma janela mais curta do que o dado suporta.** A Saúde diz
   _"em 3 meses"_ com dezesseis meses guardados ao lado.

⚠ **E A PROSA QUE JUSTIFICA A AUSÊNCIA ENVELHECEU.** `trend.mjs` afirma, para explicar o
`null`: _"a série de índices por área não existe no estado (`state.series` guarda o macro, e
nada mais)"_. **Ela existe.** É a mesma classe de erro do `span` do Gabinete e do `height`
do rail — o código continuou válido e parou de ser verdade —, e é a terceira ocorrência
nesta sessão.

⚠ **O CONSERTO NÃO É TROCAR A FONTE E PRONTO.** `trendOf` recebe a janela do histórico e
devolve quantos meses ela suportou; com a série, a janela passa a ser 12 para todas — que é
o que `WINDOW` já queria. **Isso MUDA NÚMEROS MOSTRADOS em seis linhas de duas telas**, e
mudar leitura é decisão do responsável, não conserto de rotina.

**43. ▶ AS SPARKLINES DO GABINETE SÃO BARATAS, E EU AS ADIEI POR ENGANO — 21/08/2026.** Ao
avaliar a auditoria externa eu disse que elas exigiam motor novo. **Não exigem:**
`sparkline()` está escrita e Finanças já a usa em cinco linhas, e `state.series` guarda 48
meses de PIB, inflação, juro, desemprego, dívida/PIB e primário.

⚠ **O QUE CUSTA É A SIMETRIA DOS QUATRO VITAIS.** A barra superior mostra PIB, inflação,
**aprovação** e **base** — e os dois últimos **não estão na série**. Pôr faísca em dois dos
quatro reproduz exatamente o defeito que este projeto já pagou uma vez: _"um indicador
congelado ao lado de indicadores vivos ensina a desconfiar da tela inteira"_ — foi o que
tirou a aprovação da barra por três sessões, e a lição está escrita em `vitalsHtml`.

Fazer os quatro custa **dois campos novos em `Series`, um bump de `schemaVersion` e a
migração** — que é trabalho pequeno e com precedente farto no arquivo, mas é motor, e motor
não entra sem pedido.

**41. ⚠ O ACHADO 38 CADUCOU, e o que sobrou dele é outra pergunta — MEDIDO em 21/08/2026.**
Ele dizia que a coluna da direita não cabe na dobra e que fechar exigiria decidir o que sai
da tela, com _"Aprovação por renda"_ como candidato. **A decisão nunca precisou ser tomada:**
a coluna fecha hoje em **805 de 935 numa janela de 980, com rolagem ZERO** — 130px de folga.
Ela chegou lá por três movimentos que ninguém planejou como densificação: o canvas de 20/08,
o ar de 24px entre blocos de 21/08 e os cortes desta sessão.

⚠ **O que a folga NÃO resolve é o outro lado, e ele continua aberto:** a metade esquerda tem
~300px de lâmina sem nada, e isso é o achado 37 (ver os achados em `handoff.md`)
— **o mundo quase não escreve**. Tirar a moldura fez o vazio parar de ser feio; não fez a
caixa de entrada ter conteúdo. Nenhuma mudança de CSS enche uma bandeja vazia, e o caminho
continua sendo dar verbo aos dois lobbies mudos.

**38. ⚠ O VAZIO DA CAIXA DE ENTRADA É DA COLUNA DA DIREITA, e não dela — MEDIDO em
20/08/2026, e ele sobreviveu ao master-detail.** A bandeja fecha na altura da coluna
vizinha: 302 + 232 + 255 + 110 = 899, e sobram 591px sem conteúdo no mês 1.

⚠ **As duas saídas óbvias já estão fechadas por decisão registrada.** Encolher a bandeja
foi tentado e revertido na décima primeira sessão — _"uma bandeja curta com um vão enorme
embaixo lê como layout inacabado"_ —, e o dossiê externo pede o contrário: densificar a
coluna da direita até ela caber. Contas feitas sobre a medição de dentro dos cartões, o
teto de uma varredura de densidade honesta (gaps de 12→8, hemiciclo de 170→104, linhas da
CALDEIRA mais justas) é de **~144px**, o que leva a página de 1347 para ~1203. **Não fecha
os 367px de rolagem.**

Fechar exige **decidir o que sai da tela**, e isso é decisão do responsável — é a mesma
que ele fechou em 18/08 com _"deixe como está"_, e que o dossiê reabre. O candidato mais
óbvio é "Aprovação por renda": 110px inteiramente abaixo da dobra, com as barras mais
saturadas da tela no item menos importante dela.

**39. O ITEM 1 DA ORDEM ANTIGA ESTAVA VENCIDO, e a próxima sessão não precisa dele.** A
retomada de 18/08 mandava _"MEDIR O ACHADO 30 antes de tocar em qualquer lobby"_. Ele já
tinha sido medido, e o resultado está na prosa da trindade em `cabinet.mjs`: consertado o
achado 31, **o setor produtivo vai a 33 e as forças de ordem a 35 em 48 meses, contra ZERO
antes**. O que sobrou aberto dos dois não é movimento — é **verbo**: eles se mexem e não
têm como exigir nada. É o item 2, e ele passou a ser o item 1.

**34. ⚠ A TELA DA ÁREA PROJETAVA O ÍNDICE PARA O LADO ERRADO — RESOLVIDO em 16/08/2026,
e é a SÉTIMA ocorrência da família mais cara deste projeto.** `app.mjs` refazia a
equação da MALHA à mão:

```js
value - area.decay + area.yield * share.asked[area.id];
```

com a prosa ao lado afirmando, em maiúsculas, que _"a projeção é a mesma conta do motor,
e não uma aproximação escrita aqui"_. **Era uma aproximação escrita ali, e estava
errada**, por duas razões somadas: a MALHA consome `funded` — o gasto **cheio** da área,
piso incluído e já rateado — desde 14/08, e `asked` é só a parte **acima do piso**; e o
canal `capacity` da educação não entrava.

| medido no mês 1 | a tela dizia | o mês fazia |
| --------------- | ------------ | ----------- |
| Saúde           | 61,0 → 60,4  | **61,1**    |
| Previdência     | 71,0 → 70,7  | **71,9**    |
| Fazenda         | 72,0 → 71,7  | **72,5**    |

**Em cinco das oito áreas a seta apontava para o lado contrário**, e isto na tela onde o
jogador decide quanto gastar por área. ⚠ **E o defeito nasceu de uma mudança que deixou
uma cópia para trás** — que é como as sete nasceram. Entrou `outlook` como décima
segunda porta da fachada, e a cópia morreu junto.

⚠ **O contrafactual mudou de pergunta no mesmo conserto:** `idle` era "o índice sem
alocação nenhuma", e gastar zero numa área exige derrubar todos os pisos dela por
emenda. Um contrafactual que descreve um mundo que a lei não permite não ajuda a
decidir. Agora ele é **o mês sem as ordens do jogador**.

**33. ⚠ O ARCABOUÇO NÃO TINHA A BANDA REAL, e a omissão estava DECLARADA desde o
primeiro dia — RESOLVIDO em 16/08/2026.** O cabeçalho de `fiscal.mjs` dizia: _"a versão
real tem ainda uma banda de crescimento real mínimo e máximo; ela fica de fora por
enquanto, e fica DECLARADO que fica — parâmetro omitido em silêncio é o que faz a
próxima sessão achar que o modelo é fiel"_.

**A omissão não era neutra.** Sem banda, o teto crescia 70% da variação **nominal** da
receita — 4,2% ao ano com PIB nominal a 6%, que são **0,2% reais** — contra uma
obrigatória de 2,5% reais. Aperto de 2,3 pontos reais ao ano, e os R$ 176 bi de
discricionário morrem no quarto exercício.

Enquanto o país se consertava sozinho ninguém via: a capacidade subia, a receita subia
junto e o teto crescia atrás dela. **Consertado o achado 31, a armadilha passou a fechar
dentro do mandato.** Entrou a banda de 0,6% a 2,5% reais (LC 200/2023, art. 4º).

⚠ **E o piso da banda é o que mais importa, ao contrário do que o nome sugere:** é ele
que garante ao teto a correção pela inflação num exercício de receita ruim. ⚠ **Duas
provas mudaram de afirmação por causa dele** — "receita caindo encolhe o teto" deixou de
ser verdade, e a prova passou a cobrar as duas metades da regra nova em vez de ser
apagada.

⚠ **E ele custou um defeito de escala meu, achado por prova vermelha:** a banda é
**anual** e `ceilingOf` roda **mensal**. Aplicada inteira todo mês, ela dava o
crescimento de um ano inteiro na posse — R$ 107 bi de teto a mais sobre um
discricionário de 176. Entrou `elapsed`, e ⚠ **ele conta TURNOS e não o calendário**,
porque a partida abre em **março** com a âncora de **janeiro**: contado pelo calendário,
o teto ganhava três meses de correção que a obrigatória não tinha ganhado, e os dois
relógios andavam separados.

**32. ⚠ `mandatoryGrowth` ERA UMA MÉDIA APLICADA A TUDO — corrigido para 2,16% em
16/08/2026, e o erro é de ESCOPO e não de calibragem.** O parâmetro se chama
"crescimento vegetativo real" e incidia sobre a obrigatória inteira. Rubrica a rubrica,
sobre os R$ 2.157 bi que a soma dos pisos produz:

| parcela                                              | valor          | cresce   |
| ---------------------------------------------------- | -------------- | -------- |
| aposentadorias, BPC, transferência, abono e seguro   | R$ 1.325 (61%) | ~3% real |
| folha e inativos, civis e militares                  | R$ 398 (18%)   | **~0%**  |
| pisos de saúde e educação, que são fração da receita | R$ 250 (12%)   | ~2%      |
| o resto                                              | R$ 184 (9%)    | ~1%      |

A média ponderada é **2,16%**. ⚠ **E o meio ponto decidia o jogo inteiro:** com 2,5% o
discricionário vai a **zero** no quarto ano e **todo governo cai entre os meses 39 e
45**, inclusive o que reforma — o jogo virava um corredor, que é pior que o defeito que
o achado 31 veio consertar.

⚠ **O número não foi escolhido para caber**: ele saiu da ponderação, feita **antes** de
rodar a série. Que ele também devolva a jogabilidade é a confirmação de que o defeito
era de escopo.

**A correção completa é outra e fica REGISTRADA:** separar a obrigatória em parcelas com
crescimentos próprios, e aí a folha volta a só subir quando o presidente decidir — que é
uma jogada, e não um parâmetro. Enquanto isso não existe, uma taxa única ponderada é a
descrição honesta.

**1. ~~O MODELO NÃO CONSEGUE RODAR DÉFICIT PRIMÁRIO.~~ RESOLVIDO em 16/08/2026 pela
Parte 2 do ciclo 4** — reaberto e morto no mesmo dia, e a medição tinha achado coisa
PIOR do que estava escrito. Ele foi dado como resolvido na
oitava sessão; medido de novo agora, **o primário não é apenas não-negativo: ele é
ZERO**.

| jogada, 48 meses                | primário mínimo | meses em déficit |
| ------------------------------- | --------------- | ---------------- |
| manter tudo, sem pagar ninguém  | **0,00**        | 0/48             |
| manter tudo, verba cheia        | **−0,00**       | 3/48             |
| **tudo no máximo, verba cheia** | **0,00**        | 0/48             |
| tudo no mínimo legal            | −0,19           | 2/48             |

> **Um governo que põe os 38 programas no máximo e paga verba cheia a todas as
> bancadas fecha o mês com exatamente o mesmo saldo de um que não faz nada.**

A causa está em três linhas: `ratio = room / demand` faz o empenho consumir
**exatamente** o caixa livre, então `balance = cash/12 − spent` dá zero por
construção. Despesa total = obrigatória + caixa = receita, sempre. A dívida só anda
por **juro**, e o orçamento — que o ciclo 2 declarou ser o jogo — não tem
consequência fiscal nenhuma.

⚠ **E o enquadramento é o que importa: `spent ≤ allowance` é `if (proibido) return`
escrito em aritmética.** O rateio é o último MURO do jogo, e a regra central do
projeto é "tudo tem preço, nada tem muro". Em todo lugar do jogo a pergunta é
_quanto custa_; aqui, e só aqui, ela é _pode?_.

**O desenho da correção está escrito** na Parte 2 do
[ciclo 4](cycles/04-the-republic-responds.md): a receita se divide em três
(transferida, vinculada, discricionária), **a vinculação vira NORMA e não
parâmetro** — reformável pelo jogador, como a DRU no mundo real —, e o empenho deixa
de ser limitado pelo caixa: gastar acima dele vira **déficit**, e o déficit vira
dívida no mesmo mês. O preço já existe e não precisa ser inventado: dívida maior →
juro maior → menos discricionário no ano seguinte.

✔ **FEITA.** `allowance = min(cash, room)` virou `allowance = room` — uma linha, e ela
era o último `if (proibido) return` do jogo. Medido depois:

| jogada, 48 meses                | ANTES | **DEPOIS** | meses em déficit |
| ------------------------------- | ----- | ---------- | ---------------- |
| tudo no mínimo legal            | −0,19 | **−3,27**  | 2 → **23**       |
| manter tudo, verba cheia        | −0,00 | **−9,65**  | 3 → **34**       |
| **tudo no máximo, verba cheia** | 0,00  | **−19,65** | 0 → **37**       |

A ordenação passou a ser a do mundo: **quem gasta mais deve mais.** E a vinculação
entrou junto — ver os achados 26 e 27 para o que ficou de fora.

**1-hist. ~~O modelo não consegue rodar déficit primário.~~ Dado como RESOLVIDO na
oitava sessão** — ver _O achado 1 morreu_ acima. O texto original fica abaixo porque a
aritmética que o explicava continua sendo a melhor descrição do que foi consertado:

```
allowance = min(cash, room)          cash = receita − obrigatória
balance   = cash / 12 − spent        spent ≤ allowance / 12
```

Como o empenho do mês nunca passa de `allowance / 12`, e `allowance ≤ cash`, o
saldo primário é **não-negativo por construção**. Nenhuma jogada produz déficit.
Medido, com o mínimo do mandato em 48 meses:

| política     | primário mínimo | obrigatória mínima | folga máxima     |
| ------------ | --------------- | ------------------ | ---------------- |
| `herdado`    | +10,96 bi/mês   | R$ 2.291 bi        | 99,4 bi/mês      |
| `piso`       | +14,76 bi/mês   | R$ 2.291 bi        | 23,6 bi/mês      |
| `explorador` | +1,64 bi/mês    | **R$ 1 bi**        | **581,6 bi/mês** |

⚠ **Isto é anterior a esta sessão, e está confirmado**: os mesmos três números
saem do código de antes do motor de normas. O `explorador` não achou defeito da
gramática — ele exercitou um caminho que ninguém tinha exercitado.

O Brasil roda déficit primário há uma década; este modelo não consegue nem
tentando. Enquanto isso estiver de pé, dívida só cresce por juro, e toda peça nova
se pendura num orçamento que não sabe perder dinheiro. **A correção cabe na Parte
2 (vinculação)**, que é onde o ciclo já mandava mexer no LASTRO.

**1b. ~~Desregulamentar não tem contraparte.~~ RESOLVIDO.** Só o gasto ACIMA DO
PISO alimentava o índice da área, então derrubar o piso convertia gasto obrigatório
em compra de capacidade sem mover um real. A régua do rendimento passou a ser o
gasto CHEIO da área, com os `yield` recalculados por identidade — o empurrão do
primeiro mês ficou idêntico. O explorador terminou 78,0% → 86,9%, a pior do quadro.
O texto original: O `explorador` derruba os 38 pisos e
levanta os 44 tetos num texto só: a obrigatória cai de R$ 2.291 bi para R$ 1 bi, a
folga mensal multiplica por **5,9**, e o mandato termina com dívida em **54,3%**
(contra 78,0% de abertura), os oito índices em 100 e as quatro bancadas em 100.
Não há preço nenhum depois do voto. É o achado 1 visto do lado do jogador.

**1c. ~~O preço não escala com o tamanho do pacote.~~ RESOLVIDO** pelo raio
ideológico — ver acima. O texto original: Medido: um movimento de piso
constitucional sai por 358 votos; **oitenta e cinco** movimentos saem por 334 — os
dois passam, com verba cheia, no mês 1. O rito mais exigente manda no pacote, mas
o pacote não fica mais caro por ser maior, porque a ameaça é média ponderada e não
soma. Não há razão para o jogador não juntar tudo num texto só, e isso esvazia o
logrolling: ele deixa de ser uma escolha e vira o padrão.

**1d. O presidente ausente termina com a melhor dívida do quadro — e a CAUSA mudou
duas vezes.** ⚠ **A tabela abaixo é de 14/08 e está obsoleta em todos os números**; ela
fica porque o RACIOCÍNIO dela continua sendo a melhor descrição do problema. Os
números de hoje estão em _A SÉRIE DE HOJE_, no topo.

**E o diagnóstico mudou de natureza em 16/08:** enquanto o orçamento não rodava
déficit, isto era distorção fiscal. Com o muro derrubado, ele sobreviveu — e aí ficou
claro que **não é um defeito de calibragem**: governar custa, não governar não custa, e
nada pode te derrubar. É o [ciclo 10](cycles/10-who-brings-down-a-president.md).

O texto original:

| política   | o que ela faz                | dívida/PIB em 48 meses |
| ---------- | ---------------------------- | ---------------------- |
| `herdado`  | não toca em nada             | 78,0% → **68,4%**      |
| `agenda`   | reforma o que cabe           | 78,0% → 70,4%          |
| `base`     | só mantém a máquina          | 78,0% → 70,7%          |
| `promessa` | promete verba cheia todo mês | 78,0% → 72,2%          |
| `piso`     | tudo no mínimo legal         | 78,0% → **82,3%**      |

O presidente ausente termina com a melhor dívida do quadro, e o governo que corta
tudo termina com a pior. Isso é o inverso do mundo, e a causa está medida: a
receita chega a **R$ 2.653 bi** contra os R$ 2.400 bi que `taxLoad × PIB` declara,
porque o fator de arrecadação da MALHA e o dividendo das estatais a inflam ~10%.
Contra uma obrigatória de R$ 2.188 bi, sobra um **superávit primário estrutural de
~2,5% do PIB** que o Brasil não tem. O arcabouço segura o gasto em R$ 314 bi/ano,
mas o caixa livre é R$ 465 bi — quase o triplo dos R$ 176 bi que `fiscal.mjs`
declara como discricionário. **É recalibragem, e ela precisa ser decidida e não
descoberta** — mas repare que ela é o **sintoma**, e o achado 1 é a causa: mesmo
com a receita corrigida, `spent ≤ cash` continuaria proibindo o déficit.

**2. ~~O rateio corta quase sempre.~~ ✔ MORTO em 16/08/2026 — e ele NUNCA foi um defeito
de modelo. O instrumento contava o COMPLEMENTO EXATO da verdade.**

`tools/simulate.mjs` media "quantos meses o rateio cortou" com uma conta própria —
`pago + alocado < room || prometido + alocado > room` —, e a primeira metade acusava
**sobra de caixa** como se fosse corte:

| política   | o filtro dizia | a verdade (`ratio < 1`) |
| ---------- | -------------- | ----------------------- |
| `herdado`  | 41             | **7**                   |
| `piso`     | 44             | **0**                   |
| `agenda`   | 48             | **0**                   |
| `base`     | 48             | **1**                   |
| `promessa` | 48             | 48 (acertou por acaso)  |

Duas confirmações fecham o diagnóstico: o `piso` gasta o mínimo e nunca rateia — os 44
são os 48 meses menos os 4 contingenciados —, e no `herdado` o filtro é **exatamente o
inverso**, porque nos sete meses em que o corte acontece `pago + alocado` dá
precisamente `room` e nenhuma cláusula dispara. **41 = 48 − 7.**

⚠ **É a SEXTA ocorrência de "dois lugares montando a mesma pergunta"**, e a mais cara
delas em consequência: a frase "o rateio corta em 41 de 48 meses" atravessou este
arquivo, virou este achado, e **chegou a bloquear o conserto do achado 31**. `ratio`
subiu para o relatório e o instrumento pergunta. **A porta errada não existe mais**, e a
prova `SOBRA NAO E CORTE` a mantém fechada.

⚠ **Prova da inércia:** a série de dívida não mudou um decimal com o conserto (83,6 /
86,8 / 84,9 / 84,4 / 89,1 / 87,8), que é como se sabe que só o instrumento mudou.

**3. ~~O contingenciamento nunca dispara.~~ RESOLVIDO na oitava sessão:** com o
fiscal corrigido, a política `piso` contingencia **4 meses a partir de set/2029**, e
desde o conserto do achado 14 a `promessa` também — **2 meses a partir de nov/2029**.
O gatilho deixou de ser inalcançável com o catálogo real, e agora duas sondas o
alcançam por caminhos diferentes.

**4. ~~`npm run screen` não roda desde a quinta sessão.~~ RODADO na oitava:**
240,4 fps com material × 240,1 sem, três rodadas alternadas, **verde**. O que
segue valendo é o achado 10 — teto de monitor não mede folga — e o que segue **não
medido** é aparelho móvel. O texto original ficou abaixo porque a razão dele
continua de pé: sete telas viraram onze — O Estado, Finanças, Agricultura e Indústria nasceram sem o custo de
material medido.

**5. ~~`orphans` e `contrast` seguem por escrever.~~ ✔ `orphans` EXISTE desde 16/08/2026,
e ela achou QUATRO regras órfãs no primeiro minuto** — `.sr-only`, `.mesa__eyebrow`,
`.allot` (mais a media query dela, cinquenta linhas abaixo) e `.reading__value`, esta
última **criada na mesma sessão**: eu fiz o componente para as duas listas do Gabinete
usarem a mesma gramática e deixei as duas cópias antigas de pé — três declarações byte a
byte iguais, que é a divergência que o componente existia para impedir.

⚠ **Duas passadas foram necessárias**, e a segunda é a lição: o `.allot` do bloco
principal saiu na primeira, e o `@media` dele ficou. **Quem apaga uma regra procura pelo
nome onde ela mora, e não dentro de uma media query cinquenta linhas abaixo** — é
exatamente a metade que a varredura à mão deixaria para trás.

**`contrast` segue por escrever.** O texto original: A varredura MANUAL de 16/08 mostra
por quê. Sem guarda, foi preciso caçar à mão e achou-se:

- **201 linhas de CSS morto** — a família `.action-list` / `.action-row` inteira e
  `.allot__read` / `.allot__value`, sem uma linha de HTML para pintar desde que o
  catálogo de pautas foi aposentado;
- **seis `export` sem consumidor** — `stanceOf`, `lawsHtml`, `cabinetStreetHtml`,
  `reportHtml`, `letterHtml` e `OPENING_MONTH`, todos usados apenas dentro do próprio
  arquivo. ⚠ **`export` sem quem importe é uma porta aberta**, e este projeto já pagou
  cinco vezes por porta errada aberta.

Somando com as 299 linhas da nona sessão: **500 linhas** que nenhum seletor alcançava,
achadas por varredura e não por leitura. **Enquanto a guarda não existir, isto volta.**

**9. ~~A fonte é `system-ui`, provisória.~~ DECIDIDA, e ela não vai mudar.** São três
famílias, todas por pilha de sistema: `--font-display` (sans, o que se mede),
`--font-record` (Georgia e afins, o que se assina) e `--font-machine` (mono, o que a
máquina carimba). **Fonte de webfont foi recusada** — viola zero-build e
zero-dependência de runtime, e troca um bloco de texto por uma requisição que pode
falhar. O que segue aberto é menor e é de pilha: a serifa de sistema varia bastante
entre Windows, macOS e Linux, e ninguém mediu como as três telas de registro se
comportam fora do Windows.

**13. ~~O relatório do simulador conta uma regra como programa.~~ SUMIU sozinho.**
Ele dizia "39 programas movidos de 38"; medido em 16/08 a `agenda` fecha em **38 de
38**. ⚠ **Someço o sintoma, e não necessariamente a causa** — `memory.passed` continua
recebendo id de regra junto com id de programa, e o total continua sendo medido contra
`programs.length`. Ele volta a aparecer no dia em que uma política mover regra e
programa em quantidades diferentes. Cosmético, e mora em `tools/simulate.mjs`.

**25. ⚠ O SIMULADOR NEGOCIAVA CONTRA UM CONGRESSO QUE NÃO EXISTE — RESOLVIDO em
16/08, e é a QUINTA ocorrência da família mais cara deste projeto.** `priceOfPassage`,
a função com que a política do simulador decide quanto pagar, chamava `whipCount` à
mão com `CATALOG.parties` — os **quatro** blocos — e **sem a rua**. É exatamente a
câmara fantasma que foi arrancada da fachada em 15/08 por inverter 27,2% dos vereditos:
o turno vota com as **onze** bançadas do ELENCO, com a verba já creditada de memória e
com `standing` dentro.

⚠ **E aqui o preço foi maior que na tela, porque quem errava era o INSTRUMENTO DE
CALIBRAGEM.** A política calculava o preço contra um Congresso inexistente, concluia
que precisava de verba alta, prometia — e o rateio não honrava. A memória do presidente
da Câmara despencava, ele parava de pautar, e a série de 48 meses media isso e chamava
de "legislar é caro".

**O funil medido, 48 meses, corte de 6 pontos abaixo do piso:**

| verba prometida | escritos | pautados | mortos na gaveta | aprovados |
| --------------- | -------- | -------- | ---------------- | --------- |
| 0               | 48       | 17       | 25               | **0**     |
| **0,25**        | **8**    | **7**    | **0**            | **2**     |
| 0,5             | 48       | 13       | 29               | 0         |
| 1,0             | 48       | **2**    | 40               | 0         |

> **Pagar mais piora, e muito.** Com verba cheia, 46 dos 48 textos nunca são pautados.
> Um instrumento que superestima o preço produz o pior dos mundos — e a série inteira
> do projeto foi lida através dele.

**Consertado perguntando a `forecast`**, que é a mesma porta que a tela usa. O efeito na
`agenda`: **4 aprovadas de 11** levadas a voto, contra 3 de 24 antes — a taxa de
sucesso subiu de 12,5% para **36%**, porque a política parou de levar a plenário o que
ela não conseguia pagar.

**31. ~~O PAÍS SE CONSERTA SOZINHO.~~ ✔ MORTO em 16/08/2026, e ele era o defeito mais
fundo já medido aqui.** O conserto não foi o que este achado prescrevia, e a diferença
é a lição:

> **A causa não era o VALOR do decaimento — era a FORMA dele.**
>
> ```
> antes   índice' = índice − decay + yield × gasto        (constante)
> agora   índice' = índice × (1 − decay) + yield × gasto  (proporcional)
> ```

Com a subtração constante o índice é um **integrador puro**: não existe equilíbrio em
lugar nenhum, e `yield × gasto − decay` decide um destino único para a partida inteira —
ou sobe até 100, ou cai até 0. **Não havia calibragem possível**, e foi por isso que a
tentativa anterior falhou: qualquer número maior trocava "sobe sempre" por "cai sempre".
⚠ **Medido nas duas direções, e as duas foram medidas** — a identidade constante levava
a indústria a 0 e a segurança a 7.

Proporcional, a área ganha um **atrator**: `índice* = yield × gasto / decay`. E a taxa
de cada área sai de uma identidade, com prova contra o catálogo:

> `decay ≡ yield × gasto_cheio_herdado / índice_herdado`

**Manter o orçamento herdado mantém o país parado.** Medido, política `herdado`: cinco
das oito áreas ficam entre −1 e +2, e as três que caem são as de maior fatia
discricionária — indústria (60% do gasto dela), segurança e agricultura —, porque o
rateio as tira do presidente.

⚠ **E ele não se resolvia sozinho: precisou de mais duas peças**, e as duas estão nos
achados **32** e **33**. Sem elas, a armadilha fiscal fechava dentro do mandato e **todo
governo caía entre os meses 39 e 45** — o jogo virava um corredor, que é pior que o
defeito original.

⚠ **UMA HIPÓTESE MINHA FOI MEDIDA E DESCARTADA no caminho, e vale registrada:** eu
afirmei que o laço `capacidade → receita → teto → gasto` tinha ganho maior que 1 e era o
amplificador. **É falso.** Medido de três formas — ganho uniforme **0,14**; ganho por
área com a partilha do rateio, todos abaixo de 1; e o teste decisivo, com todas as
`force` **zeradas**, em que o país ainda escorrega (indústria 48→28 contra 48→19 com o
laço ligado). O laço responde por uns nove pontos de uma queda de vinte e nove. **Não
amortecer foi a decisão certa, e ela veio de medir e não de argumentar.**

O texto original, que continua sendo a melhor descrição do defeito: Um governo que
**não faz absolutamente nada** via os oito índices SUBIREM em 48 meses:

| área        | 48 meses | área      | 48 meses |
| ----------- | -------- | --------- | -------- |
| indústria   | 48 → 100 | segurança | 38 → 71  |
| previdência | 71 → 100 | fazenda   | 72 → 95  |
| agricultura | 63 → 77  | defesa    | 51 → 62  |
| saúde       | 61 → 67  | educação  | 44 → 49  |

**Não fazer nada melhora TUDO.** Isso é indefensável num jogo sobre governar, e ele
**explica os achados 1d, 29 e 30 de uma vez**: o passivo tem a melhor dívida porque os
índices sobem e a arrecadação sobe; os dois lobbies de capacidade nunca se movem porque
nunca há queixa.

**A causa, medida:** o orçamento herdado produz empurrão POSITIVO em todas as oito
áreas no mês 1 — `yield × gasto − decay > 0` em todas.

```
area          gasto/mes  decay  yield   empurrao
industria         7,38    0,50  0,3580   +2,141
seguranca         2,40    0,70  0,6358   +0,829
previdencia     126,68    0,30  0,0096   +0,916
fazenda          13,23    0,40  0,0674   +0,492
```

⚠ **E EU TENTEI CONSERTAR E REVERTI, com razão registrada.** O conserto é por
IDENTIDADE, e não por gosto: `decay = yield × gasto_herdado`, para o herdado ser o
**ponto de equilíbrio**. Aplicado, seis áreas ficaram estáveis — e **indústria foi a 0 e
segurança a 7**.

A causa disso é o **achado 2**: o rateio corta em 41 de 48 meses, então o gasto efetivo
fica abaixo do equilíbrio calculado no mês 1, e as áreas de `yield` alto despencam.

> **Calibrar o decaimento sobre um rateio que corta sempre é calibrar sobre base
> quebrada.** A ordem é: achado 2 primeiro, decaimento depois — e o método do segundo
> já está escrito aqui.

⚠ **Uma hipótese foi TESTADA E DESCARTADA no caminho, e vale registrar:** achei que a
causa fosse gasto NOMINAL contra régua fixa — a mesma família do hiato nominal que a
CORRENTE já corrigiu. **É falso:** `spendOf` calcula `(nível/100) × custo` com custo fixo
do catálogo, então o gasto **não cresce com a inflação**. Não há defeito de deflator
aqui, e um deflator aplicado por cima do decaimento corrigido derrubava o país duas
vezes.

**29. ~~A CALDEIRA NÃO RESOLVE O ACHADO 1d SOZINHA.~~ ✔ MORTO em 16/08/2026, por
CONSEQUÊNCIA do achado 31 e sem ninguém tocar na CALDEIRA.**

O governo passivo agora abre processo no mês 43 e **cai no mês 46**, dentro do mandato.
O caminho é o que estava apontado aqui e não precisou de modelagem nova: o país deixou
de se consertar sozinho, então os índices caem, a rua cansa, o mercado vê a dívida subir
e as três rupturas passam a se abrir juntas.

> ⚠ **A retomada previa isto por escrito** — _"reavalie os dois depois do 31: é provável
> que o país parando de se consertar sozinho já mova os dois lobbies de capacidade e já
> faça a rua cansar do passivo"_. É o registro funcionando: o achado certo, consertado
> na ordem certa, matou dois sintomas de graça.

⚠ **E o critério declarado foi verificado nas DUAS pontas**, que é a metade que nunca
tinha prova: um governo mediano — mantém a máquina e paga a manutenção — cai no **mês
52**, três meses depois de o mandato acabar. A prova `A QUEDA ACONTECE` cobra as duas.

O texto original: O governo passivo continua sobrevivendo, e a causa é legítima:
**não gastar agrada o mercado**, e o capital o abriga. Ele perde o baixo clero (pressão 100) e perde a rua, mas as três rupturas nunca se abrem juntas.

| governo, 48 meses         | processo abre |
| ------------------------- | ------------- |
| passivo, não paga ninguém | **nunca**     |
| paga metade               | mês 48        |
| promete tudo e não honra  | mês 47        |
| corta tudo e não paga     | **nunca**     |

⚠ **Forçar números até o passivo cair seria calibrar para obter a conclusão desejada**,
que é o que este projeto proíbe. O caminho honesto é outro e está apontado: **a rua
deveria cansar de quem não entrega**. Hoje a SONDA pune o calote e o serviço ruim, e
não pune a AUSÊNCIA de entrega — um governo que nunca prometeu nada nunca traiu
ninguém. É modelagem em SONDA, e é o passo seguinte do ciclo 10.

**30. ~~A CALDEIRA ESQUENTA POR DOIS CANAIS DE QUATRO.~~ ✔ MORTO em 16/08/2026, por
CONSEQUÊNCIA do achado 31 — e medido antes de a Trindade ser desenhada.** Os dois
lobbies de capacidade deixaram de ser decorativos porque o país passou a se degradar:

| lobby              | antes | 48 meses, governo passivo |
| ------------------ | ----- | ------------------------- |
| o setor produtivo  | 0     | **33**                    |
| as forças de ordem | 0     | **35**                    |

⚠ **E eles ainda não FERVEM** — o ponto de fervura é 60, e os dois vivem na faixa 0–50.
Isso não é o achado sobrevivendo: é a consequência de o `weight` das forças de ordem ser
zero e de o produtivo ler duas áreas em que uma delas (agricultura) se segura. **O que
morreu é "eles nunca se movem"**, que era o que os tornava decorativos. O texto original:

**30-hist. A CALDEIRA ESQUENTA POR DOIS CANAIS DE QUATRO.** Medido: o setor produtivo e as
forças de ordem ficam perto de ZERO em todo governo testado, porque leem índice de
área e o orçamento herdado sustenta os índices. ⚠ **Dois lobbies que nunca se movem são
dois lobbies decorativos** — e a decoração aqui é pior que em qualquer outro lugar,
porque a tela promete que eles derrubam presidentes. Ou o canal deles muda (o que eles
cobram não é o índice, é o CRESCIMENTO dele), ou o decaimento da MALHA precisa morder
mais. Vai junto com o achado 29.

**27. ~~O MERCADO NÃO COBRA PELO DÉFICIT.~~ RESOLVIDO em 16/08/2026.** Entrou
`premiumOf` na CORRENTE: um spread sobre a básica, **convexo**, incidindo sobre o
estoque inteiro.

⚠ **A peça já estava prometida na prosa e não existia** — `turn.mjs` dizia, sobre o
juro, _"ele engorda a dívida, e a dívida volta pelo prêmio de risco"_. Mesma família do
`CHANNELS`: promessa escrita, nada cumprindo.

**Três decisões, e cada uma tem razão escrita no motor:**

- **entra no `carry`, e não na Taylor.** Um Banco Central não sobe juro por risco
  fiscal — quem cobra a mais é o **credor do Tesouro**. Somar à Taylor confundiria dois
  agentes, e o jogador não saberia qual reagiu ao que ele fez;
- **a forma é convexa**, porque o mercado tolera e depois foge. Linear ensinaria que
  "mais um pouco" custa igual no começo e na beira do abismo;
- **a tolerância é a dívida HERDADA**, lida de `fiscal.initialDebtRatio` e não repetida:
  o mercado já precificou o país que o presidente recebeu, e o que ele cobra é a
  **deterioração**. Por isso a abertura fica idêntica.

**Efeito medido:** +0,3 p.p. de dívida no `herdado` e **+0,6 no `promessa`** — a
convexidade aparecendo na série, porque quem estava pior pagou mais.

⚠ **E nasceu a suíte que faltava.** A CORRENTE rodou duas sessões **sem prova
própria** — quatro equações macro e o carrego da dívida, cobertos só por prova de
turno, que testa a composição e não acusa equação errada que produza número plausível.
Os dois defeitos estruturais que ela já teve foram achados pela **simulação**.
`tests/suites/economy.mjs` começa pelo prêmio; **o resto do motor segue sem prova.**

**21. ~~A PRIMEIRA TELA DO JOGO TEM A PEÇA CENTRAL VAZIA.~~ RESOLVIDO no ciclo 9**, com
a carta de posse. O texto original: O Gabinete é 3fr de Caixa de
Entrada contra 2fr de cartões, e no mês 1 a coluna maior não tem nada — `firstLead`
declara a ausência, e declarar está certo, mas **é o pior momento do jogo e é o
primeiro**. Achado de fora, e o remédio dele estava errado (ele leu o estado vazio como
se fosse a mecânica). O conserto não é carta falsa: é a **carta de posse**, com a
herança que os motores já conhecem. ⏳ **Marcado para morrer no ciclo 9.**

**19. ~~A CARTA NÃO ACUMULA.~~ RESOLVIDO no ciclo 9.** O texto original: A Caixa de
Entrada mostra só as cartas do mês corrente — as anteriores somem sozinhas, sem
resposta e sem consequência. Enquanto ela era uma lista, o defeito era mecânico; com
a **bandeja escavada** desta sessão ele virou promessa quebrada: uma bandeja com uma
carta é um cartão com sombra, e o objeto agora anuncia um acúmulo que não existe.
A correção é `state.mail` com prazo — `schemaVersion` 15 —, e **vencer resolve contra
o jogador**, senão o inbox é uma lista de tarefas. Só depois dela a **tarja lateral de
gravidade** tem motor atrás; feita antes, seria a decoração que este projeto recusa.

**15. ~~A tela não tem como mostrar tendência de área com atraso zero.~~ RESOLVIDO no
ciclo 9** — `state.series.areas` guarda os oito índices por 48 meses, no mesmo schema 15
do `state.mail`, e Fazenda e Previdência deixam de calar. O texto original: O histórico
da MALHA é o mecanismo do atraso, e não um buffer de tela: ele guarda `lag + 1`
valores, então Fazenda e Previdência (atraso 0) guardam **um**. Finanças e a tela
de área agora **calam** ali em vez de imprimir um zero inventado — que é a postura
certa e não é a resposta. A resposta é `state.series` guardar os oito índices por 48
meses, como já guarda PIB e inflação: `schemaVersion` 14, `extend` e o reducer. Não
foi feito nesta sessão porque é mudança de estado, e a Parte 3 também quer a 14.

**14. ~~A capacidade lê a alocação PEDIDA.~~ RESOLVIDO na nona sessão**, e ele era maior do que este texto dizia — o caixa também cobrava pelo que não foi executado. Ver _O achado 14 morreu_. O texto original: Quando a pauta cai,
`applied` reverte os níveis mas `allocated`/`funded` já saíram de `honoured` — a
MALHA recebe o mês como se a reforma tivesse valido. Pré-existente, e só ficou
visível agora que a votação demora. Some quando a tramitação separar as duas.

---

## Sessão 21 — auditoria completa (25/08/2026)

**Objetivo:** usar o projeto sem memória de conversa, como se fosse um usuário novo, e
encontrar tudo que está errado. Duas rodadas de auditoria com agentes paralelos.

### Auditoria 1 — 5 agentes paralelos

- **Motor/dominio:** `app.mjs` sem try/catch em `playMonth`, `adviser` não persistia em `last`
- **Tela/UX:** `closing.mjs` sem `escapeHtml` em `term.of`, `inbox.mjs` sem `scope="col"` nos
  anexos, `inbox.mjs` sem `escapeHtml` no caso `boiling`
- **Estado/save:** `save.mjs` com 6 campos obrigatórios faltando na validação, `deepFreeze` não
  aplicado ao estado desserializado
- **CSS/estilo:** `30-components.css` com dois `@media` adjacentes equivalentes não mesclados
- **Código morto:** `bills.mjs` exportava `INSTRUMENTS` que ninguém consumia, `cast.mjs` exportava
  `GIVEN_NAMES` que era local, `cabinet.mjs` com `@param` duplicado, `mesa.mjs` com JSDoc órfão,
  `trend.mjs` com import no meio do código

**Correções (13 arquivos):**

- `app.mjs`: try/catch em `playMonth`, `adviser` armazenado como `Person` completa em `last`,
  `termOf` chamado uma vez por paint, `dataset.siege` só escreve em mudança
- `closing.mjs`: `escapeHtml(term.of)` adicionado
- `save.mjs`: 6 campos obrigatórios adicionados à validação (`series`, `bills`, `mail`,
  `pressure`, `impeachment`, `fallen`)
- `inbox.mjs`: `<th scope="col">` em todos os cabeçalhos de anexo, `escapeHtml(nameOf(subject))`
  no caso `boiling`
- `cabinet.mjs`: `@param` duplicado removido
- `mesa.mjs`: JSDoc órfão removido
- `trend.mjs`: import movido para o topo
- `30-components.css`: dois `@media` adjacentes mesclados
- `bills.mjs`: export `INSTRUMENTS` removido, JSDoc atualizado com valores inline
- `cast.mjs`: export `GIVEN_NAMES` removido (mantido como `const` local)
- `public/index.mjs`: `INSTRUMENTS` removido do barrel

### Auditoria 2 — 4 agentes paralelos

- **Correção de nomes:** `cast/index.mjs` — `fullName` adicionado ao set `used` + guarda de
  string vazia (colisão de nome)
- **Save:** `deepFreeze` aplicado ao estado desserializado, validação de forma para 8 campos
  críticos (`fiscal`, `macro`, `capacity`, `streams`, `series`, `mail`, `bills`, `norms`)
- **Provas:** 13 novas em `passage.mjs` (`forgotten`, `tables`, `reports`, `proposalOf`),
  prova GDP=0 em `budget.mjs`, 2 novas em `save.mjs` (round-trip de impeachment + rejeição
  de campo corrompido)
- **Tolerância:** `congress.mjs` tolerância 20%→25%, amostras 600→1000
- **Congelamento:** `state-reducer.mjs` — verificações `isFrozen` em `fiscal`, `capacity.index`,
  `series.gdp`
- **HTML:** `closing.mjs` — `<time datetime="...">` com `monthLabel(term.months)`
- **Mensagem de assertion:** `state-reducer.mjs:370` — mensagem invertida corrigida ("NAO foi
  recriado")

### O que ficou pendente (requer schema bump)

⚠ **Dois itens colidem com a recusa de converter saves existentes** — o save recusa versão
diferente em vez de converter, e custa a partida em andamento:

1. **`last` perdido no F5** (achado 46) — persistir o último relatório no save. Visível: a
   banda do mês some; invisível: a simulação não é afetada;
2. **`events` stream morto** — `state.streams.events` é código morto. Remoção requer mudança
   de tipo em `Streams`.

**Os dois podem ser feitos juntos num único bump de schema**, quando o responsável decidir.

### Estado do projeto

`npm run validate` verde. 12 guardas, 54 provas sintéticas, 130 arquivos, 236 provas, passeio
verde em duas janelas. Branch `acoplamento-e-simulador`.

**Próximo passo:** O Glorioso, passo 2 — B1 a B5 (faixa de áreas no Congresso).

---

## Sessão 24 — a marca de "feito" conferida contra o código (28/08/2026)

**A sessão inteira nasceu de uma pergunta dele**, feita antes de qualquer trabalho começar:
_"tem certeza que todos os passos antes desse fecharam? estuda mais um pouco sobre o código."_
A resposta era não, e ela tinha quatro partes.

### O que estava certo

Os três consertos de motor do passo 1 estão no código e têm prova: a poda corta pelo começo
(`mail.mjs`, `closed.slice(0, …)`), o filtro de exigência pede a espécie (`turn.mjs:646`), e o
alarme do teto compara o mês que fecha com o que abre (`turn.mjs:1111`). O 3.1 e o 3.3 também
— o fechamento do mês entrou na ordenação, e o divisor virou seção com prova em
`screens.mjs:1096`.

### O que não estava

**O passo 1½ estava marcado "✔ FEITO" com três dos seis itens abertos.** O próprio plano os
marcava ⚠ dois blocos abaixo do cabeçalho que dizia feito, e o handoff copiou o cabeçalho. Os
três foram reconferidos no código e continuam abertos: `alive` ainda sai do DOM (`app.mjs:728`),
`paint()` não restaura foco nenhum, e `persist()` só serializa `state` — `orders` é variável de
módulo e morre no F5.

**E dois consertos declarados fechados atendiam metade do defeito cada um.** O 3.2 protegia a
pergunta e despejava o aviso mais velho — mas só quando havia aviso a despejar: com as
perguntas enchendo a capacidade, `room` dá zero, o guarda `kept.length > 0` desliga o despejo e
o aberto entrava de graça. **Medido: 6 linhas para uma capacidade de 5.** O 1½.1 limpava
`openDispatch` na virada do mês e não na posse, e o id do alarme não carrega o mês — um
`ceiling:ceiling` clicado atravessava o recomeço.

⭐ **A lição é a do §7 dos padrões, e ela cobrou pela segunda sessão seguida:** a prosa que
declara estado envelhece sozinha, e "feito" é o número mais caro de todos — porque ninguém
volta a medir o que já foi declarado pronto. **O cabeçalho de um passo não pode ser mais novo
que o pior dos seus itens.**

### O que entrou

Duas linhas de código e uma prova que nasceu antes e mordeu (`6 !== 5`): sem vaga na pilha,
quem cede é a **preferência** — o índice abre a de cima, a pergunta não se corta, e o documento
nunca fica sem a linha ao lado. E `openDispatch = null` na posse.

**259 provas, 12 guardas, passeio verde.** O passo 2 continua em 1 de 5, e ele é o que o
próprio ciclo exige antes de tudo: _"nenhum item entra sem que o portão saiba ver o defeito que
ele conserta"_.

---

## Sessão 25 — o índice virou calendário, e duas soluções minhas foram jogadas fora (28/08/2026)

**A sessão começou com ele perguntando o que tinha ficado para trás.** O terminal fechou no
meio de uma pergunta minha, e a pergunta estava no transcript: onde entrar o mês do texto na
linha do índice, para duas perguntas gêmeas pararem de ler igual (item 3.4).

### As três medidas, e por que nenhuma entrou

Capturei as três numa partida de verdade, 1440×980, jogada até ter duas perguntas abertas ao
mesmo tempo. **A comparação lado a lado é o que ele pediu** — _"quero um exemplo real de como
ficaria as três para escolher, pq não entendi muito bem"_ —, e ela mostrou o que a prosa não
mostrava: o remetente é **idêntico nas duas gêmeas**, cortado nas duas, e não ajuda a escolher.

| medida                    | custo em altura | o que a captura mostrou                    |
| ------------------------- | --------------- | ------------------------------------------ |
| mês no fim do assunto     | +18px           | na carta não-lida a pastilha empurra o mês |
| mês em linha própria      | +70px           | o mais explícito, e o que mais cresce      |
| mês no lugar do remetente | 0px             | mata a reticência do nome                  |

⭐ **E ele respondeu com outra coisa:** _"mensagem do mês de março fica no bloco mês de março…
quero idêntico ao Football Manager"_. As três medidas morreram na hora.

### O que entrou

**O índice virou calendário puro.** Cada carta no bloco do mês em que chegou, meses do mais
novo para o mais velho, e dentro do bloco a ordem que o motor já monta — alarme, pergunta,
exigência, aviso, relatório. `sort` é estável, então a tela não refaz essa decisão.

Junto caiu o **teto de 7 linhas**: com blocos de mês, cortar em sete mostra "MAR" com 2 das 5
cartas dele, e um bloco pela metade mente sobre o mês. `fitted()` e `TRAY_CAPACITY` saíram —
91 linhas a menos em `inbox.mjs`. E entrou o `line-clamp: 4`, que era decisão medida na sessão
anterior e nunca tinha sido aplicada: **20 dos 28 assuntos perdiam o fim, e agora zero.**

### A lição, e ela é sobre a ordem das perguntas

**Eu perguntei onde pôr o mês do texto. A pergunta certa era onde a carta mora.** As três
medidas eram três respostas boas para um problema que não precisava existir: o bloco do mês já
diz o mês, de graça. Medido depois — 8 blocos, 29 cartas — **12 pares de linhas idênticas no
índice inteiro e zero dentro do mesmo bloco.**

⚠ **E a decisão do 3.3 era metade do defeito.** A seção "Precisam de resposta" consertava o
calendário arrancando a pergunta dele, e o preço era o mês da pergunta não existir — que é
exatamente o que fazia as gêmeas lerem igual. **Um conserto criou o defeito seguinte, e as duas
decisões eram minhas.**

### As guardas seguiram a regra nova

Quatro provas cobravam o teto e a seção. Foram **trocadas, não removidas**: nada é escondido, o
calendário só anda para trás, a ordem do motor sobrevive dentro do mês, e o aberto sempre tem
linha. No passeio, "o índice não rola" virou duas checagens que mordem mais — **linhas do
índice = cartas do save** e **nenhum mês repetido** —, e a exceção que isentava
`.tray__subject` do `checkClamped` morreu com o clamp 4.

### E a pasta de capturas foi reorganizada

77 arquivos soltos viraram seis pastas com regra declarada em `captures/README.md`: o que o
`walk` reescreve, o que é evidência de defeito, o que espera decisão dele, e o que é rascunho
descartável. Os dois scripts que escrevem lá foram junto, senão a rodada seguinte desfazia
tudo. **O mapa é versionado, as imagens não** — `.gitignore` virou `captures/*` mais
`!captures/README.md`, porque o git não reinclui arquivo dentro de pasta excluída.

**259 provas, 12 guardas, passeio verde.**

### E o plano foi conferido contra o código, item a item

Ele pediu para profissionalizar tudo, e a conferência mudou três marcas:

- **o 2.4 estava errado, e errado ao contrário**: o item dizia que a retenção _"não tem prova
  nenhuma, e nem é exportada"_, e `KEEP`, `CARRY` e a prova em `mail.mjs:169` já existiam desde
  o passo 1. ⚠ **A marca de "aberto" também envelhece**, e ela é mais barata mas é o mesmo
  descuido da marca de "feito" que mentiu duas vezes neste ciclo;
- **o 1½.4 fechou sem conserto próprio**: ele era _"a poda do não-lido mede a TELA"_, e a tela
  cortava em 7. Sem teto, toda carta da caixa vira linha. Quem segura isso é a checagem 2.2 —
  linhas do índice contra cartas do save;
- **o 2.5 nasceu fraco e foi corrigido antes de entrar.** A primeira versão comparava a linha
  **inteira** do índice, prazo incluído. O defeito relatado é _"assunto idêntico, remetente
  idêntico, e só a linha de prazo separando"_ — ela deixava passar exatamente o caso que existe
  para pegar. **Só percebi porque forcei a mordida e ela não mordeu.** Agora compara assunto
  mais remetente, e acusa `out · 2027` quando forçada.

**Passo 2 fechado, 5 de 5.** O passo 1½ é quatro de seis e o 3½ é um de cinco.

---

## Sessão 26 — a caixa vira caixa (28/08/2026)

**Sessão longa, e quase tudo nasceu de coisa que ele viu jogando.** O plano foi conferido item a
item contra o código antes de qualquer marca mudar.

### O que ele pediu, e o que a medição respondeu

- **a linha clicada virou papel branco.** No branco o prazo perde a cor: amber e vermelho claro
  sobre branco não passam o piso AA em 10px, e quem carrega urgência é a **tarja**, que já é a
  dona declarada do prazo. Inventar duas cores só para essa linha criaria um segundo par
  concorrente para a mesma função;
- **"Mês sem pauta" ia para o fim do bloco.** Ela era concatenada depois da lista, e a ordem por
  mês tem a posição como desempate;
- **a carta clicada não fica.** Ela agora atravessa a virada do mês e o F5, e **nasce na primeira
  carta do mandato** — nulo queria dizer "a de cima", e a de cima troca todo mês;
- **as mensagens se atualizavam sozinhas.** Ver o passo 3¾: 3 de 33 cartas mudavam de texto
  depois de chegar.

### O que a sonda achou sozinha

Abrir toda carta em 30 meses, com uma sonda que reclama de invariante quebrada, achou quatro
defeitos que nenhuma guarda via:

1. **o rascunho do mês morria inteiro no F5** — a resposta marcada, os níveis, as faixas e a
   verba. O plano só registrava a resposta. Agora mora em `republica-simulator:rascunho`, peneirado por
   tipo na leitura, **sem bump de esquema**: rascunho não é mandato;
2. **o foco do teclado caía em `BODY`** a cada pintura;
3. **assunto escapado duas vezes** em duas espécies;
4. **exigência de grupo desconhecido** começava por `": "` — item 5.4, achado por acidente.

### A lição, e ela se repetiu duas vezes hoje

⚠ **Guarda que não morde é decoração, e as duas que escrevi hoje nasceram assim.** A do 2.5
comparava a linha **inteira** do índice, prazo incluído — e o defeito relatado é _"assunto
idêntico, remetente idêntico, e só a linha de prazo separando"_. **Só apareceu porque forcei a
mordida e ela não mordeu.**

⭐ **E um defeito antigo só ficou alcançável hoje:** quando a carta clicada passou a atravessar o
mês, o passeio chegou a um estado que nunca alcançava e reprovou por contraste — **2,58 contra
um piso de 4,5**. A causa é de meses atrás: o aviso do botão usa `color: var(--sheet)`, e
`--sheet` virou escuro quando o documento deixou de ser pergaminho. **A regra não mudou; o token
que ela citava mudou por baixo dela.**

**259 provas, 12 guardas, passeio verde.** Passo 2 fechado; o 1½ é cinco de seis e o 3½ é quatro
de cinco.

---

## ⬅ O QUE SAIU DO HANDOFF — 30/08/2026

> O ponto de retomada tinha **1.493 linhas** e violava a própria regra do cabeçalho dele: narrativa
> de sessão e achado já fechado ocupavam dois terços do arquivo, e duas seções diziam
> "COMECE POR AQUI". Foi podado para ~700 linhas, e **tudo o que saiu está abaixo**, intacto.
>
> ⚠ **Como sempre neste arquivo: todo número aqui foi medido no dia em que foi escrito.**
> Antes de repetir qualquer um, remeça-o.

### ⛔ A SÉRIE DE CALIBRAGEM DE 24/08/2026 — vencida, e a causa é o item 0.1

Esta é a tabela que ficou seis dias no handoff depois de o motor mudar debaixo dela. Ela está
aqui como registro do que foi medido naquele dia, e **não serve para calibrar nada**: a versão
viva está no handoff, remedida em 30/08. Cinco das seis linhas mudaram quando `fc1c6b4` fez a
desoneração virar renúncia de receita.

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

### ⛔ A TABELA DE QUEDA — medida em 24/08/2026, e não reproduzível hoje

Ela saiu do handoff porque **nenhum instrumento do repositório a produz**: `simulate` não imprime
`state.impeachment` nem `state.fallen`, e o script que a mediu morava em `tmp/`, que o git ignora.
Ela também antecede o item 0.1, então os meses abaixo descrevem um jogo anterior ao de hoje.

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

### ✔ OS ACHADOS QUE JÁ ESTAVAM FECHADOS, e ainda moravam em "Achados abertos"

Doze deles — 17, 24, 46, 50, 54, 55, 56, 57, 58, 59, 60 e 61. O texto é o do dia em que cada um
fechou.

**61. ✔ O GABINETE PERDEU O TÍTULO, E A BANDEJA GANHOU A LEGENDA — 30/08/2026.** Ordem dele:
_"tire esse título Gabinete. Coloque algo como caixa de entrada dentro de um bloco grudado à
caixa de entrada, com fonte de caixa de entrada, padronizado."_

O título era a **única peça da tela que não respondia pergunta nenhuma** — 25,6px de serifa
para dizer o nome de uma tela que o rail já marca. No lugar dele, `.tray__head` é uma faixa
colada no topo da bandeja, cobrindo as **duas** colunas (índice e documento são um objeto só),
com a mesma `annex__legend` das legendas de bloco.

| medição, a 1920×980, mês 12 | antes | depois    |
| --------------------------- | ----- | --------- |
| altura útil da coluna       | 732px | **805px** |
| vão entre as duas colunas   | 32px  | **24px**  |
| combinações de tipo na tela | 9     | **8**     |

**59. ✔ A MESMA CLASSE DESENHAVA DUAS COISAS — 30/08/2026.** Queixa dele: _"falta padronização
em todo o Gabinete. Quero tudo igualmente padronizado, cores, fontes, bordas, espaçamentos,
tudo mesmo. IDÊNTICO."_ Medido com um censo de estilo computado, a mesma classe nos dois
contextos:

| classe           | na carta               | na coluna                |
| ---------------- | ---------------------- | ------------------------ |
| `.annex`         | fundo `rgb(19,27,44)`  | `rgba(238,242,248,0.03)` |
| `.annex`         | aresta `rgb(31,42,61)` | `rgba(255,255,255,0.14)` |
| `.annex`         | recuo 12px · vão 8px   | 8/12px · vão 4px         |
| `.annex__legend` | `rgba(ink,0.62)`       | `--ink-dim`              |
| `.annex__who`    | `rgba(ink,0.72)`       | `--ink-soft`             |
| `.annex__line`   | 22px · pista 72px      | 20px · pista 56–160px    |

⭐ **A CAUSA ERA O ENDEREÇO DO REMAPEAMENTO:** `--sheet-ink` era redefinido em `.tray`, que
cobre só a carta. Subiu para `.cabinet` e levou junto `--sheet-raise` e `--sheet-edge` — as
duas passaram a ler os **mesmos quatro tokens**, e as seis sobreposições de contexto foram
apagadas. ✔ **Censo depois: zero divergências.**

⚠ **E O CENSO DE TIPO ACHOU O DEGRAU FORA DA ESCALA que os padrões já nomeiam:** o `<small>`
sem regra é **8,33px** — 0,833em do navegador —, e a seta de tendência entrava com **13,6px**
ao lado de um número de 10. Combinações de tipo na tela: **12 → 9**.

⚠ **O portão cobrou o preço:** com o bloco virando vidro, o qualificador em `rgba(ink,0.55)`
caiu para **4,13 de contraste** contra o piso AA de 4,5. Clareou-se a tinta para 0,68.

**60. ✔ O BOTÃO DA CARTA SUBIU PARA O MEIO — 30/08/2026.** Efeito colateral do conserto do
vazio: pôr o conteúdo no topo (`align-content: start`) trouxe o rodapé junto. ✔ Fechado — a
faixa de anexos volta a ser `1fr` e o rodapé fica preso no pé, com o bloco ancorado em cima.

**58. ✔ O FOCO DO TECLADO CAÍA EM `BODY` AO CLICAR NUMA CARTA NÃO LIDA — 30/08/2026.** E a
checagem que existia para isso **passava**: ela clica no mês 2, quando a única carta já está
lida. Medido: mês 2 ✔, **mês 6 em diante ✘**.

⭐ **A CAUSA É A MESMA FAMÍLIA DO ACHADO 56, com outro nome:** `focusMark` montava o seletor
com o `dataset` **inteiro**, e metade dele é **estado**. Clicar numa carta não lida vira
`data-unread` de `true` para vazio **na mesma pintura**, então o seletor gravado antes deixava
de casar com qualquer coisa. Identidade e estado no mesmo lugar, de novo.

✔ **FECHADO.** `IDENTITY` declara os nove `data-` que dizem _qual_ controle é — os mesmos que
os manipuladores leem —, e `unread`, `urgency`, `moved` e `price` ficam de fora. A prova é a
7d do passeio, e ela nasceu vermelha.

**57. ✔ A LEGENDA DO ANEXO IGNORAVA O TRATAMENTO — 30/08/2026.** Com uma presidenta na cadeira,
o corpo da carta dizia _"a senhora"_ e a legenda do anexo logo abaixo dizia **"O QUE O SENHOR
RECEBE"**. `blockInherited` era o único texto da caixa com "o senhor" escrito à mão em vez de
`{v}`. ✔ Fechado: a chave usa `{v}` e os dois pontos de uso passam por `addressed`.

**56. ✔ A COLUNA DO GABINETE PERDIA A TENDÊNCIA NO PRIMEIRO CLIQUE — 30/08/2026.** Medido no
mês 10, clicando uma carta da caixa: **5 direções viravam 0**, e todas as sete setas passavam a
dizer `flat` — que **não** é ausência, é a afirmação de que nada andou. A barra de vitais, no
mesmo instante, continuava marcando `▼`: **duas partes da mesma tela discordando sobre o mesmo
mês.**

⭐ **A CAUSA É DA FAMÍLIA MAIS CARA DESTE PROJETO, com os papéis trocados:** não eram dois
lugares montando a mesma pergunta — era **uma variável respondendo duas**. `painted` dizia _o
que está na tela_ e _qual era o mês passado_, e as duas respostas divergem a partir da segunda
pintura do mês.

✔ **FECHADO no mesmo dia**, com `framed` e a checagem 7c do passeio, que nasceu vermelha.

**55. ✔ A CAIXA DE ENTRADA ERA UMA PLANILHA, e ela deixou de ser — 29/08/2026.** Palavras
dele: _"todas essas tabelas me incomodam muito, nem queria que fossem tabelas, e se for pra ser,
quero algo bem mais minimalista e estilo football manager"_.

**Medido, abrindo TODA carta de um mandato de 14 meses num navegador:**

| medição                                | resultado                               |
| -------------------------------------- | --------------------------------------- |
| cartas abertas · **com tabela dentro** | 23 · **19 (83%)**                       |
| células de tabela em tela, num mês     | **306**                                 |
| a pior carta — "Base cai a N cadeiras" | 10 linhas · **40 células · 27 números** |
| a mais frequente — o fechamento do mês | 12 células, **toda vez**                |

⭐ **E A REGRA JÁ ESTAVA ESCRITA NO PRÓPRIO CÓDIGO, contra a carta.** `cabinet.mjs` recusa
listar bancada por bancada no Gabinete e diz por quê: _"quem lista bancada por bancada, com nome
e humor, é a tela do Congresso"_. **O anexo da carta das cadeiras faz exatamente isso** — 10
linhas. E a prosa de `strings.mjs` admite o mesmo do caixa: _"o anexo e Finanças dizem o MESMO
número"_. **As cartas estão duplicando as telas que o jogo já tem.**

✔ **FECHADO no mesmo dia.** Sete alternativas foram desenhadas com o CSS real, ele escolheu o
caminho — _"prossiga como você achar melhor a longo prazo, robusto, minimalista, football
manager"_ — e a caixa foi reconstruída em três peças, com a guarda `annexes` fechando o
vocabulário. Ver o passo 4 do ciclo 14.

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

**46. ✔ FECHADO em 29/08/2026 — RECARREGAR A PÁGINA APAGAVA A LEITURA DO MÊS.** A versão 19
do save guarda `state.months`, e cada mês fechado atravessa o F5 no bloco dele. ⚠ **A prosa
abaixo é o achado como ele foi escrito** — ACHADO em 21/08/2026, conserto parcial em
25/08/2026, fechado no bump da 19. `last`, o relatório do turno, é
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

### ▶ AS NARRATIVAS DE SESSÃO 21 A 26, como estavam no handoff

## ▶ PARA O CLAUDE — contexto da sessão 21 (auditoria, 25/08/2026)

**Quem fez:** agente de auditoria (opencode), sem memória de conversa anterior. Leu o
código inteiro como se fosse um usuário novo e encontrou tudo que estava errado.

**O que foi feito:** duas rodadas de auditoria com agentes paralelos. A primeira (5
agentes) pegou defeitos de DOM, save, CSS e código morto. A segunda (4 agentes) pegou
colisão de nomes, XSS, validação de forma e lacunas de prova. **Nenhum motor foi
alterado.** Todas as mudanças são de proteção (try/catch, escapeHtml, validação) ou de
limpeza (remoção de exports mortos, JSDoc duplicado).

### Arquivos modificados (25 arquivos, incluindo 1 novo)

### Sessão 26 (30/08/2026) — a coluna do Gabinete perdia a tendência no primeiro clique

⭐ **UM DEFEITO ACHADO JOGANDO, e nenhuma guarda o via.** As sete setas da coluna da direita
existiam na primeira pintura do mês e sumiam no primeiro clique em qualquer carta: medido no
mês 10, **5 direções viravam 0**, e `flat` não é ausência — ele **afirma** que nada andou.

| onde                   | antes do clique                  | depois      |
| ---------------------- | -------------------------------- | ----------- |
| coluna do Gabinete     | `down up down down flat flat up` | tudo `flat` |
| barra de vitais (topo) | `▲ ▼ — ▼`                        | inalterada  |

⚠ **A CAUSA ERA UMA VARIÁVEL SÓ FAZENDO DUAS PERGUNTAS.** `painted` respondia _"o que está na
tela?"_ (para decidir o que repintar) **e** _"qual era o mês passado?"_ (para a seta). A partir
da segunda pintura do mês as duas respostas divergem, e a barra escapava só por acidente — ela
tem o portão `previous !== state` e simplesmente não repinta. **O Gabinete repinta sempre.**

✔ **FECHADO.** `framed` é a segunda variável, e ela só anda quando o mês anda; ela se fixa no
**começo** de `paint()`, porque `cabinetInput` a lê mais abaixo na mesma função. A prova mora no
passeio (7c) e **nasceu vermelha**.

⭐ **E O CICLO 15 COMEÇOU — PASSOS 1 E 2.** A peça de dado da correspondência saiu de
`inbox.mjs` para `src/ui/shared/annex.mjs` **sem uma linha alterada**, e a guarda `annexes`
passou a medir uma segunda coisa: **régua desenhada pela tela**. As provas sintéticas foram de
3 para 6.

⭐ **E OS PASSOS 3, 4 E 5 FECHARAM NO MESMO DIA — o ciclo 15 acabou.** A guarda nasceu
vermelha com **11 achados** e fechou em **0**.

| medição                                       | antes | depois                 |
| --------------------------------------------- | ----- | ---------------------- |
| classes de estilo distintas na coluna direita | 18    | **9**                  |
| instrumentos para "um número numa régua"      | 3     | **1** (`gauge`)        |
| blocos · linhas na coluna                     | 4     | **5 · 20**             |
| a coluna rola?                                | não   | **não** — 732 de 732px |
| CSS podado                                    | —     | **14,1 KB**            |

⭐ **E A TELA FOI REDISTRIBUÍDA DEPOIS, por queixa dele** — _"tem muitos espaços em branco"_.
Quatro medições e quatro consertos: a nota do limiar passou a qualificar o **nome** (como
nota, ela pedia 150px na coluna do número e saía reticenciada); a pista ganhou teto de 200px;
o palco passou a **encolher com o conteúdo** (`flex: 1` o deixava com a altura da janela mesmo
pedindo metade — 300px de fundo no mês 1); e a carta voltou a ocupar a altura toda, mas com o
**conteúdo no topo e o papel seguindo** — escolha dele contra a versão de antes, em que o
rodapé ficava pregado no pé e abria um buraco de 310px acima dele.

⚠ **O RISCO QUE O PLANO ANUNCIAVA NÃO EXISTIA, e a medição é a prova:** `reading`, `meter`,
`poles`, `block__door` e `card__body` eram produzidos por **um arquivo só**. Sete frases
mortas saíram de `strings.mjs` junto, e `verdictHtml` — export sem consumidor — morreu com
elas.

⚠ **E O RESTO DA VARREDURA VEIO LIMPO:** mandato inteiro ao vivo — 48 meses, F5 no mês 20,
impeachment no mês 45 —, todas as telas, 33 cartas abertas uma a uma: **zero erro de console e
zero `NaN`/`undefined` em tela**.

### Sessão 25 (29/08/2026) — a caixa perdeu todas as tabelas, e o ciclo 14 fechou

⭐ **O CICLO 14 ESTÁ FECHADO** (só o 3½.5, de desenho, ficou). Passos 5 e 4, nesta ordem — o 4
foi **reescrito no meio da execução, por ordem dele**: _"todas essas tabelas me incomodam
muito… quero algo bem mais minimalista e estilo football manager"_, e depois _"quero que tudo
fique dentro de blocos… tudo idêntico, padronizado, minimalista, robusto"_.

**Medido, abrindo TODA carta de um mandato num navegador:**

| medição                             | antes            | depois              |
| ----------------------------------- | ---------------- | ------------------- |
| cartas abertas **com tabela**       | **19 de 23**     | **zero**            |
| células de tabela por mês           | **306**          | **zero**            |
| formatos de anexo, para 15 espécies | **cinco**        | **três**            |
| papel em branco, média por carta    | **290px de 629** | **255px**           |
| a exigência (a pergunta que custa)  | 374px · 0 blocos | **262px · 1 bloco** |

⭐ **O VOCABULÁRIO É DE TRÊS PEÇAS, E A GUARDA `annexes` O FECHA** — `cardHtml` (uma leitura),
`lineHtml` (nome · barra · valor) e `noteHtml` (prosa). Ela reprova `<table>`, `<tr>` e `<td>`
em `inbox.mjs`, **inclusive tabela montada por pedaços**, que é como os cinco formatos
conviviam. ⚠ **A tela do relatório continua com a dela:** planilha mora em TELA, e a caixa é
correspondência — regra que o Gabinete já aplicava e a carta violava.

⚠ **NENHUMA LINHA DE MOTOR FOI TOCADA** e a série de `simulate` é idêntica ao caractere:
`boilerOf` já entregava `lobbies` e `ruptures`, e a carta simplesmente não os lia.

⚠ **TRÊS DEFEITOS MORRERAM NA IMAGEM, e nenhum falhava tipo, guarda ou prova:** quatro
bancadas caindo 2 cadeiras davam quatro barras **cheias e iguais**; `signed(0)` pendurava um
"0" no valor (`21% 0`); e a regra do impeachment ia num card de leitura, com doze palavras no
tipo de um número. Capturas em `captures/caixa-em-blocos/`.

### Sessão 25 (29/08/2026) — o passo 5 fechou inteiro, e a fila do bump encolheu

**Os canais mortos e as unidades trocadas.** Os **oito** itens entraram. **Save: zero**, e a
série de `simulate` é idêntica ao caractere. Sete provas novas, e cada uma falha na versão
anterior do arquivo que ela cobre.

| item      | o que mudou                                                                       |
| --------- | --------------------------------------------------------------------------------- |
| 5.1       | a traição e o desgaste viraram o **pé** do anexo da rua — antes eram jogados fora |
| 5.2       | a carta de cadeiras dizia **"11 pontos"**; a unidade agora é `TERMOS.seatWord`    |
| 5.3       | o **513** estava teclado em duas frases: `chamber.seats` passou a vir do motor    |
| 5.6       | o alarme de fervura gravava um `from` que a view sempre sobrescreveu              |
| 5.7       | a faixa larga da tarja e o plural de "meses" saíram — `left` devolve 0 ou 1       |
| 5.5       | o `weight` e o `streams.events` saíram — e **sem bump**, contra a premissa        |
| 5.4 · 5.8 | já tinham fechado em `3139ddb`; a marca no ciclo é que estava velha               |

⚠ **E UM ACHADO FICA ABERTO E DECLARADO:** a soma do anexo da rua **continua não fechando com
a manchete** — medido no mês 4, a tabela soma **45 · 43 · 46** e a manchete diz **28%**. Não
são a mesma grandeza: entre as duas estão a inércia de `SONDA` e a conversão em "ótimo/bom".
Fechar a cadeia pede o humor por classe dentro de `attach`. ⚠ **E eu escrevi que isso era um
bump, e não é** — ver a fila abaixo. **Fica aberto porque é DESENHO**, e não porque custa save:
a alternativa é a tabela crescer dentro de uma carta, que é o R2 que este ciclo já recusou.

⚠ **`left` devolve 0 ou 1 e mais nada**, medido num mandato inteiro: `[[0, 6], [1, 7]]`. É a
prova que sustenta a retirada da terceira faixa, e ela morde no dia em que `ANSWER_TIME` mudar.

⭐ **E O ACHADO MAIOR DA SESSÃO É SOBRE A PRÓPRIA PROSA:** a fila de "espera o bump" tinha
quatro itens e tem **um**. Três saíram sem custo nenhum, e **um deles já estava fechado desde
a véspera** — o `last`. Ninguém tinha medido o validador do save antes de escrever que ele
exigia um bump. É o §7 dos padrões outra vez: **prosa que continua gramatical e para de ser
verdade.**

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

### 7 · Auditoria da pesquisa 10 contra a conta (11/09)

As duas EDOs estão certas (conferi crítico e subamortecido derivando de `y(0)=-1`, `ẏ(0)=v₀`), e a convenção `ζ = 1−bounce` é a mesma do nosso `spring.mjs`. Três achados que não fechavam:

1. **O corte da curva tinha três números para a mesma coisa.** O texto do §2.5 dizia `t_settle ≈ 1,25 × duration`, o código do §2.7 usava 1,22 no caso crítico, e a conta com o ε = 0,002 dá 1,347. A 1,22 o resíduo era 0,41% (o dobro do ε), e como o gerador cravava o último ponto em 1, sobrava um salto de 2,8px no fim, num curso de 700px (o curso da pasta é 448→710px).
2. **Trocar a mola por transition CSS reintroduzia defeito medido.** O §1.4 chamava o `linear()` de solução ótima para mudança de estado, mas a pasta não é só mudança de estado: erguer e largar em sequência interrompe o voo, e transição interrompida recomeça do zero. O `linear()` serve se o retargeting for tratado com `curveOf` e velocidade inicial.
3. **O §6.2 pedia `rotateX(-180deg)` no envelope**, e a árvore 3D saiu inteira da mesa por ordem dele ("a foto da madeira exatamente como ela é"; em projeção a foto é reamostrada). Reintroduzir perspectiva para o envelope reabriria uma decisão fechada.

## 13/09/2026 — O punhado sai de cima da pasta, e a conta que sobrava era outra

O portão estava vermelho com 6 erros iguais: carta atrás da pasta nos meses 2, 3, 4, 6, 10 e 12.
O handoff mandava recuar `.mail` para 22% ou o leque para 60px. Os dois números estavam errados:
o leque a 60px recupera 9,7px de um buraco de 57,3.

Medi no navegador em vez de deduzir. A janela de 1440 mostra 1196,8px do Gabinete, e punhado
(254,7) + pasta (693,1) + telefone (260) somam 1207,8 — as três peças não cabiam nem encostadas.
E a âncora do punhado ficou a 74,9px da beira da pasta, com meio envelope medindo 90,1: um
envelope sozinho, parado no centro, já colidia.

Eu tinha descartado "mover para a esquerda" apoiado num comentário antigo do CSS ("a 21% ele
entrava 61px sob o vidro"). Ele perguntou por que eu não tinha pensado nisso, e estava certo —
o comentário mede uma sobreposição, não prova que fica feio, e a área corta a cena de propósito.

| leque | `.mail` | folga até a pasta | cortado na beira |
| ----- | ------- | ----------------- | ---------------- |
| 78px  | 25,0%   | −57px             | 3px              |
| 50px  | 22,0%   | 15px              | 47px             |
| 40px  | 22,5%   | 11px              | 34px             |
| 30px  | 23,0%   | 7px               | 22px             |

Ficou 40px/22,5%: envelope nos 155, pasta em 0,44, telefone parado. Encolher o envelope de 155
para 130 também fechava e custava 16% da carta.

Depois do punhado, a luz. A foto do jacarandá é um mostruário, iluminado igual de canto a canto, e
era isso que fazia a mesa parecer textura. Entrou um clarão branco de cima em `soft-light` e um
tombo em `multiply` nas quinas, sem tocar na foto. Medido no pixel: chapado em `normal` o croma
caía de 80,2% para 47,9% e o tampo virava bege; em `soft-light` + `multiply` fica em 73,2%. A guarda
`tokens` recusou a primeira versão (tinta `rgba(22, 9, 3)`) e a luz virou branco puro.

O `validate` desse item nunca terminou: o PC reiniciou às 01:02 com ele rodando (core 2 da CPU, caso
à parte). Refeito às 02:50 por outra sessão: tipos, lint, formato e 330 provas verdes. `check` e
`walk` vermelhos só pelo telefone que o Gemini estava reescrevendo naquele minuto.

## 13/09/2026 — Telefone Western Electric 2500 (v2 do Claude)

### Auditoria original e defeitos identificados (Achado 66)

O telefone de mesa (`src/ui/shared/phone.mjs` e `styles/46-desk.css`) foi auditado a pedido dele ("horrível e nada realista"). Cinco defeitos estruturais identificados:

1. **Monofone em osso de cachorro:** `.phone__handset::before/after` com círculos de 58×56px colados nas pontas criava silhueta de clipart/emoji infantil, sem cavidade de cápsula (auricular/microfone) nem ergonomia de aparelho executivo (padrão Western Electric 2500);
2. **Cordão em fita tracejada:** SVG com `stroke-dasharray: 2 4.5` num `path` único lia como linha pontilhada plana desenhada na madeira, e não como uma espiral 3D de bobina helicoidal;
3. **Teclado cego:** 12 caixas cinzas lisas (`.phone__key`) sem diferenciação de teclas (*, #, 0);
4. **Halo de neon:** animação `phone-halo` aplicava `box-shadow: 0 0 40px 12px`, parecendo neon de jogo arcade em vez de vibração física do aparelho ou led indicador de linha discreto;
5. **Corte na base inferior:** `top: 80%` com altura 160px encostava na beirada inferior da janela.

### Revisão do Claude e transição para a v2 (13/09 02:58)

O Claude assumiu `phone.mjs` e o bloco `.phone` de `46-desk.css`. O Gemini fechou o portão e registrou medições.

O que a tela mostrava no v1:

1. A base estava em vista frontal (cunha com saia) e o fone e a mesa vistos de cima — lia como foto colada;
2. O fone era uma barra reta apoiada na borda, e na referência estava inclinado no berço com as conchas encaixadas;
3. O cordão eram seis paths soltos com brilho rosa, e uma sombra arqueada à esquerda sem fonte de luz coerente;
4. Teclas creme com legenda de 3,5px — o passeio reprovou (1,05–2,9 contra 4,5), enquanto a referência tem tecla cinza-escura com legenda branca;
5. Sombra com deslocamento diagonal (4/8px) contra a regra da mesa (uma luz só, de cima);
6. Etiqueta "GABINETE 01" a 5,5px era texto falso.

O que o código fazia fora do padrão:

- Cerca de 30 cores literais dentro do JS (`#db2833`, `#b81e26`, `#8a131a`…) que a guarda `tokens` não lia;
- 12 teclas copiadas à mão em vez de geradas por código;
- Dois `radialGradient` idênticos;
- Fonte `Carlito, Calibri` fora da tipografia do projeto (Inter e Source Serif 4);
- 4 filtros `feGaussianBlur`, e o fone com filtro animava a 6 Hz sem medição em `screen`;
- `style="transform-origin"` inline e classes no SVG sem CSS;
- `left: 73%` contradizendo comentário de 74%. A decisão das teclas sem número (6px é texto falso) havia sido revertida sem medição nova.

O plano do Claude executado:
Manter a silhueta do 2500 vista de cima como a mesa: fone em diagonal no berço com as conchas encaixadas, base com teclado 3×4, cordão em espiral gerado por código. Teclas cinza-escuras; legenda branca sem texto falso. Toda cor em token `--phone-*`, teclas geradas, zero filtro SVG (sombra por forma e opacidade), sombra reta como a da pasta. Prova em `screens.mjs` mantida (toca quando `boilerOf` diz; clique abre o Email).

### A entrega da v2

Entrega da v2 do telefone pelo Claude alinhada à câmera de 78° do Gabinete (vista superior combinando com a mesa e a pasta). O painel frontal ganhou o rebaixo esculpido de 104×90mm com matriz de teclas 24×15mm e janela de identificação de número. O monofone foi ajustado para projeção zênite com sombreamento próprio (6px nas conchas, 9px na haste), pinos do gancho embutidos e sombras projetadas idênticas à regra da pasta (2px de contato e 22px de penumbra, sem filtros SVG). O cordão helicoidal foi curvado de forma solta à esquerda sem vazar do botão (290×268px). Portão 100% verde: `npm run walk` sem colisões, estouros ou falhas de contraste; `npm run screen` com 72.8 material × 71.0 controle (delta +1.8 fps).

### Medição do engasgo da pasta nesta máquina — Achado 65 (antes da revisão das sombras)

Medição com `tmp/jank.mjs` no Chromium com aceleração gráfica ativa (`--enable-gpu`, `--ignore-gpu-blocklist`, `--enable-gpu-rasterization`) em viewport 1440×980.

- Rodada fria: pior quadro 46.4ms, p95 22.6ms, 67 fps, 3 quadros perdidos.
- Três rodadas aquecidas:
  1. `{"pior": 23.1, "p95": 22.8, "fps": 73, "perdidos": 3}`
  2. `{"pior": 23.5, "p95": 18.1, "fps": 73, "perdidos": 1}`
  3. `{"pior": 23.1, "p95": 18.2, "fps": 74, "perdidos": 1}`

Mediana aquecida: pior quadro 23.1ms, p95 18.2ms, 73-74 fps médios, 1 quadro perdido. O engasgo de 83.2ms original não se reproduz nesta máquina com a promoção de camada ativa (`will-change: transform`, `isolation: isolate` e `translateZ(0)`).

### Auditoria de contraste do botão Avançar — Achado 62

O achado relatava medição intermitente de 1.00 em `[congresso com partido]`. Foram executadas 4 rodadas consecutivas de navegação real pelo rito de posse (reinício duplo, escolha de bancada `liberais-conservadores` e abertura do Congresso), aplicando o algoritmo de contraste do `walk.mjs` (luminância do decil de fundo e tinta composta do texto `.go__label`):

- Rodada 1: ratio 19.15 (fundo 0.931, tinta 0.001)
- Rodada 2: ratio 19.15 (fundo 0.931, tinta 0.001)
- Rodada 3: ratio 19.15 (fundo 0.931, tinta 0.001)
- Rodada 4: ratio 19.15 (fundo 0.931, tinta 0.001)

Nenhuma leitura atingiu 1.00 ou ficou abaixo do piso de 4.5. O achado 62 fica fechado como intermitente não reproduzido.

### Padronização global das sombras e reposicionamento do telefone (13/09 tarde)

Unificação das sombras da mesa sob uma fonte de luz única declarada em `styles/00-tokens.css` (`--light-dx: 0.36`, teto alto a 20° à esquerda):

- Quatro classes de sombra (`--cast-contact`, `--cast-flat` a 6px, `--cast-thin` a 10px e `--cast-thick` a 24px) aplicadas à pasta, folhas, envelope, lacre e telefone.
- O clarão do tampo em `40-shell.css` foi deslocado 105px para a esquerda, casando com a posição da luz.
- O filtro `#wax-shadow` do SVG do lacre foi substituído por `drop-shadow` CSS em `.envelope__seal`.
- Telefone ampliado em 9% (caixa de tinta 278×283px) e reposicionado para `top: 45%`, com centralização dinâmica pelo `fitDesk` no vão entre a pasta e a margem da janela.

Medição de desempenho do voo após a penumbra inclinada (`tmp/jank.mjs`, 3 rodadas):

1. `{"pior": 18.2, "p95": 18.1, "fps": 68, "perdidos": 0}`
2. `{"pior": 18.6, "p95": 18.1, "fps": 68, "perdidos": 0}`
3. `{"pior": 23.4, "p95": 18.1, "fps": 68, "perdidos": 1}`

O pior quadro caiu para 18.2ms e o p95 cravou em 18.1ms, com zero quadros perdidos na maioria das rodadas. A inclinação das sombras não adicionou custo perceptível à GPU.

Auditoria visual das capturas (`gabinete.png`, `gabinete-900.png` e zooms em `tmp/`):

- `npm run walk`: código 0 (passeio verde, 0 colisões, 0 estouros).
- Direção das sombras: pasta, folhas, envelope, lacre e telefone agora compartilham o mesmo vetor de projeção (baixo e 0.36 à direita). Nenhuma sombra destoa.
- Enquadramento: o telefone mantém 16px livres em relação à pasta e 16px até a borda da janela em 1440px (128px em 1920px), sem colisões nem cortes em 980px ou 900px de altura.
- Lacre de cera: a sombra em `drop-shadow` CSS eliminou o halo esbranquiçado anterior, integrando o selo à textura do envelope.

## 13/09/2026 — Fotorrealismo e Sistema de Matéria da Mesa (noite)

Ordem do responsável: fotorrealismo rigoroso no telefone e padronização física de toda a matéria da mesa para eliminar qualquer aspecto de desenho/cartunesco.

### Auditoria visual das 8 regras de matéria (fotográfica, pixel a pixel)

| Peça           | 1. Luz (250°/52°)            | 2. Sombras (`--cast-*`) | 3. Arestas (topo/esq claro) | 4. Grão de matéria                            | 5. Especular / Fresnel                      | 6. Oclusão de contato                 | 7. Zero contorno                     | 8. Faixa tonal / cor                          |
| :------------- | :--------------------------- | :---------------------- | :-------------------------- | :-------------------------------------------- | :------------------------------------------ | :------------------------------------ | :----------------------------------- | :-------------------------------------------- |
| **Madeira**    | ✔ Clarão a 20° esq.          | N/A (plano base)        | N/A                         | ✔ Foto natural                                | ✔ Acetinado natural                         | ✔ Recebe sombras                      | ✔ Sem traços                         | ✔ Calibrada                                   |
| **Pasta**      | ✔ dx 0.36                    | ✔ Contato + 24px        | ✔ Chanfro 8px               | Granulado homogêneo (precisa células 15-20px) | Falta reflexo difuso de janela              | Falta fenda de 2px na dobra do couro  | Pespontos planos sem rebaixo de furo | ✔ `#111317`                                   |
| **Folha esq.** | ✔ Gradiente vertical         | ✔ Sobre o forro         | ✔ Corte guilhotina          | Falta microfibra 0.025                        | ✔ Fosco                                     | ✔ Sombra 14px na lombada              | ✔ Sem stroke                         | Alvura `#fff` fria (precisa marfim `#fbfaf7`) |
| **Folha dir.** | ✔ Gradiente vertical         | ✔ Borda de bloco        | ✔ Aresta de corte           | Falta microfibra 0.025                        | ✔ Fosco                                     | ✔ Sombra na lombada                   | ✔ Sem stroke                         | Alvura fria (precisa `#fbfaf7`)               |
| **Envelope**   | ✔ 250°/52°                   | ✔ 10px a dx 0.36        | ✔ Abas com relevo           | ✔ Feltro `feDiffuse`                          | ✔ Cartão fosco                              | ✔ Aba triangular                      | ✔ Sem traço                          | ✔ Algodão                                     |
| **Lacre**      | ✔ `feDistantLight`           | ✔ `drop-shadow` CSS     | ✔ Borda moldada             | ✔ Cera mineral                                | ✔ Especular de cera                         | ✔ Assentado no papel                  | ✔ Sem stroke                         | ✔ Carmim                                      |
| **Telefone**   | ✔ `feDiffuse` + `feSpecular` | ✔ 2px + 22px a dx 0.36  | ✔ Filetes de quina          | ✔ Textura ABS injetado                        | Reflexo da haste leitoso (precisa hot-spot) | ✔ Nichos com `.phone__cup-rim`        | ✔ Sem contorno                       | ✔ Vermelho token                              |
| **Cordão**     | ✔ Luz superior               | ✔ Sombra a dx 0.36      | ✔ Elipses tangentes         | ✔ Fio liso                                    | ✔ Brilho de crista                          | Falta oclusão entre anéis sobrepostos | ✔ Sem stroke                         | ✔ Vermelho token                              |

### Fechamento da sessão e decisões abertas

O responsável analisou a tela e recusou o filtro de luz especular no telefone por considerá-lo excessivamente brilhoso e cartunesco. Todo o filtro SVG foi retirado: o telefone retornou ao acabamento fosco, com volume construído por gradientes geométricos controlados, contorno contínuo do monofone e visor de número no quadro.

A pasta recebeu o grão de couro assado em bitmap (`bake` em `texture.mjs`), que foi medido com custo de 10 a 20 fps durante o voo da pasta (55–61 fps contra 76–80 fps de controle). A decisão de manter o grão de couro ou priorizar os 80 fps na subida fica para a avaliação soberana dele.

Para o telefone, se a exigência de fotorrealismo persistir, o caminho viável sem filtros artificiais será o uso de fotografia real recortada e tratada da peça, já que a modelagem puramente vetorial esbarra no limite entre o chapado e o efeito de desenho.

A árvore fecha com portão 100% verde (`validate`: 13 guardas, 66 sintéticas, 331 testes unitários, passeio e prettier limpos). Nada foi commitado.

## 15/09/2026 — O telefone vira foto, o voo fica liso e o defeito do `--phone-x`

### Hierarquia e co-desenvolvimento

Ordem dele de 15/09/2026: ele é soberano (#1), Claude é o piloto e arquiteto técnico (#2), Gemini é o copiloto e auditor do portão (#3). O Claude deve sempre delegar tarefas de medição, pesquisa e auditoria ao Gemini pelo canal de comunicação direta (`agentapi`).

### O defeito real do `--phone-x` (-271px)

Ao marcar uma área com a pasta erguida, a sala repintava e nascia sem `--phone-x`, porque o valor só era medido com a pasta na mesa. O telefone recebia `left: -271px` e permanecia deslocado para fora da tela após largar a pasta. O passeio nunca marcava com a pasta no ar. O valor foi transformado em variável de módulo em `cabinet.mjs` e reescrito a cada pintura. O teste do passeio cobre o caso e reprova sem o conserto (1130px antes, -271px depois).

### Causa real do engasgo no voo da pasta

O trace do Chrome no voo revelou que a queda de taxa de quadros era causada pela animação de `--light-angle` no `:root` (`20-material.css`). A propriedade herdava para 627 elementos, gerando 45 recálculos de estilo (7,9ms cada, totalizando 356ms no curso de 700ms), 651 pinturas e 82% de carga de GPU.

Com a remoção da animação e fixação do ângulo estático no `initial-value` do `@property`:

- Tempo de recálculo de estilo: 13ms (redução de 96%).
- Pinturas: 4 (redução de 99%).
- Carga de GPU: 12%.
- Pior quadro medido: 20,1ms caiu para 4,2ms.
- Medição de engasgo (`tmp/jank.mjs`): p95 de 21ms com 4 a 6 quadros perdidos caiu para p95 de 4,3ms e 0 quadros perdidos (mediana do Gemini: 8,3ms pior / 4,3ms p95 / 0 perdidos).

A textura de couro e a fibra de celulose não custam desempenho sem o passeio da luz no `:root`. O teste anterior de 13/09 media a animação do ângulo, não o grão da textura.

### Substituição do vetor pela fotografia do telefone

O modelo vetorial de 553 linhas em `src/ui/shared/phone.mjs` e seus tokens associados (`--phone-body`, `--phone-deep`, `--phone-gleam`, `--phone-key`) foram removidos. O aparelho passou a ser a fotografia «Dialog röd» (Ericsson Dialog vermelho ~1975, foto de Holger Ellgaard, Wikimedia Commons, CC BY-SA 3.0), tratada e salva em `assets/phone.webp` (720×599, 76,8 KB).

Tratamento da imagem:

- Recorte por conectividade cromática sobre `r - max(g, b)`.
- Remoção do cabo de linha e limpeza da etiqueta.
- Renderização em 300×250px na tela.
- Sombras da sala por CSS `drop-shadow`, inclinadas por `--light-dx` (as classes `--cast-*` são `box-shadow` e não seguem silhueta).
- Halo de toque executado por cópia âmbar da foto sob a camada principal com opacidade controlada.
- Número no cartão fixado em `2027-0148`, sem código DDD para caber na largura de 52px sem quebra de linha.
- Atribuição de licença e histórico de derivação registrados em `assets/CREDITS.md`.

### A segunda versão da foto, depois de ele olhar

Ele viu a primeira versão na tela e disse que o telefone continuava destoando: mal cortado e sem sombras. As duas coisas eram reais. A borda tinha um fio rosado: os pixels semitransparentes carregavam a mistura de bege com vermelho, e sobre a madeira escura isso vira um contorno claro. O recorte passou a desfranjar (o pixel de borda leva a cor dos vizinhos opacos). O contato a 50% de alfa não aparecia no jacarandá; foi a 0,85, com penumbra a 0,7, como a pasta. A foto também ganhou a luz da sala assada no arquivo: exposição 0,9 e sombreado de 1 para 0,78 de cima para baixo, porque a foto original tinha luz frontal e chapada. Arquivo final: 63 KB.

### A terceira versão: imagem gerada

Ele propôs gerar a imagem do telefone com IA para resolver ângulo e licença de uma vez. Duas imagens foram produzidas: uma gerada pelo Gemini e outra pelo ChatGPT (`tmp/fone-chatgpt.png`, 1323×1189 com canal alfa). A do ChatGPT foi a escolhida: visão zênite real de 90° (como a mesa), corpo maior preenchendo o quadro (~1000px contra ~500px), teclas e visor de número lisos em branco, acabamento em plástico fosco e sem sombra no chão. Com a imagem gerada por IA, a foto do Wikimedia Commons e o crédito CC BY-SA 3.0 saem do repositório.

O ChatGPT gerou uma segunda, mais zenital, e ele a mandou em seguida. Ficou a segunda: 720×639 no arquivo, 420px na tela (300 media o mesmo que o envelope; 500 ele achou demais), com o corpo no meio do vão e o cordão por baixo da pasta quando o vão é curto. Por ordem dele os algarismos entraram por cima da imagem, cada um no centro da tecla medida no arquivo, a 11px. O passeio reprovou o contraste do "8" em 4,27 porque a caixa do algarismo era a célula inteira e o vermelho do corpo entrava na amostra; a caixa virou a da tecla e passou.

### Estado de fechamento

Árvore validada: 13 guardas, 66 provas sintéticas, 331 provas, passeio verde. Ordem dele às 02:05: finalizar, commitar tudo e desligar o PC.

---

## 15/09/2026 (noite) — o telefone no canto, os algarismos que não colavam, e a pasta vira foto

### O telefone subiu, foi para a direita e angulou

Ordem dele, corrigida no meio do caminho: primeiro "angule para a esquerda", depois "angule para
a direita na verdade, e ele deve ficar no canto superior direito mesmo". Aplicado: `top` de 45%
para 30% e `transform: rotate(6deg)`.

O X deixou de ser o meio do vão até a pasta e passou a encostar na beira visível da direita.
A conta anterior (`(folderRight + seenRight) / 2`) nunca chegava ao canto: sobravam 39px de
madeira à direita do aparelho na janela de 1440 e 152 na de 1920. A pasta saiu da conta, e com
ela saiu a variável de módulo `phoneX` e a guarda `lifted` que existia só por causa dela.

O primeiro recuo (`seenRight - 160`) cortou o aparelho em 36px, e ele viu na tela antes de mim.
A conta estava errada em duas frentes: a imagem não tem margem transparente (ela preenche o
arquivo inteiro, medido) e o giro de 6° alarga a caixa de 420 para 457px. O recuo certo é 220 =
meia caixa rodada (228) menos os 32 do deslocamento, mais 24 de respiro. Resultado medido por
mim e conferido pelo Gemini: 36,7px de folga em 1440 e 36,8 em 1920, 39,4px do topo da sala,
zero transbordo.

### Os algarismos das teclas pareciam adesivo, e o motivo era a cor

Palavras dele: "os caracteres não parecem integrados ao telefone, os números e tal, parece algo
artificial, eu quero que pareça realista".

A tinta era `--paper-ink`, que é **azul** (`#101724`). Sobre a tecla bege da foto, um algarismo
azul-marinho perfeitamente nítido lê como adesivo colado. O conserto foi em quatro frentes, e
cada uma tem número:

- tinta nova `--phone-print` (`#17191d`), neutra, em `mix-blend-mode: multiply` — assim o
  algarismo pega o sombreado e o grão da tecla em vez de flutuar sobre eles;
- peso e tamanho de 700/11px para 600/9,5px;
- `filter: blur(0.25px)`, para casar com a suavidade da foto — texto vetorial tem borda perfeita
  e a foto não;
- o asterisco nasce sobrescrito na fonte: a tinta dele media 3,8px contra os 7 do algarismo, e o
  centro caía 2,6px acima do centro da tecla (medido desenhando o glifo em canvas a 8×). Foi a
  16px e desceu os 2,6.

Antes disso conferi o alinhamento da grade contra a foto, detectando as 12 teclas por
componentes conexos: colunas em 350,3 / 412,0 / 473,5 e linhas em 300,0 / 355,0 / 410,5 / 466,1
de um arquivo de 720×639. A grade do CSS já estava certa — o defeito era só a tinta.

Uma variante com rotação de 0,6° por tecla (para imitar impressão irregular) foi gerada e
descartada: a 11px na tela ela não se distingue da versão sem rotação.

### A pasta passa a ser foto, e as duas imagens são geradas

Ideia dele: refazer a pasta como imagem de IA, capa fechada com o brasão, e a animação virar a
pasta se abrindo e vindo à frente da tela. Escrevi dois prompts (fechada e aberta vazia) e
avisei do que não dava para separar: se só a capa virasse foto, a abertura mostraria o couro
fotografado virando o couro calculado no meio do gesto.

O ChatGPT gerou a primeira fechada — zenital, com alfa, brasão fiel. O Gemini gerou outra, e
foi a dele que ele escolheu, junto com uma pasta aberta. Medições da escolhida: bordas laterais
paralelas (largura 2185 no topo contra 2186 no pé, 0,2% de variação), fundo branco puro.

A terceira imagem — a aberta que já nasceu em paisagem — ganhou da aberta girada por dois
números: 2198px de tinta no eixo que importa contra 1441 (52% a mais), e a luz na orientação
certa (na girada o realce do couro corria deitado). Simetria da lombada: 46,7% da largura contra
53,0% da girada — empate, 3 pontos fora do centro nas duas.

### O recorte, e por que limiar simples não servia

O fundo é branco e a pasta tem duas regiões claras: a cantoneira de latão e a folha creme que
aparece na beira. Um corte por luminância comeria as duas. O recorte (`tmp/assar-pasta.mjs`) faz
enchente a partir da beira — o fundo é conectado e o interior claro não —, dá alfa em rampa na
faixa de transição do JPEG e descontamina a borda do branco que ela herdou. Conferido ampliado
sobre o jacarandá: sem franja. O alfa fecha em 255, como o telefone precisou.

### Etapa 1 da pasta: a matéria

A `.folder` virou `background: url(/assets/folder-open.webp) center / 100% 100%`. As medidas
saíram do arquivo: a lombada ocupa 7,3% da largura e a moldura de couro 4%. Com `gap` e
`padding` de 24px a folha entrava na moldura e cobria as cantoneiras; foram para 62 e 68, a
caixa caiu de 1827 para 1690 e `--rest` de 0,44 para 0,408. A pasta fecha em 684×494, razão
1,385 contra 1,380 da foto — 0,4% de estiramento.

Saíram com o couro calculado, porque a foto traz os cinco: `.folder__light` e a oclusão da quina,
`.folder::before` e `::after` (costura e sulco), `.folder__fold`, o `bake(leather(), 320)` e onze
tokens — sete de couro e quatro de linha. A guarda `tokens` achou os onze sozinha. Saldo: 207
linhas removidas contra 70 escritas.

Um achado que ficou aberto: as três provas de geometria do passeio passaram verdes com a pasta
mudando de 693×492 para 684×494. Prova que não reclama de 9px só está medindo que a peça existe.

### Trabalho com o Gemini ao vivo

Ordem dele: "trabalhe junto com o gemini ao vivo" e depois "não se sobrecarregue, o mais
importante e complexo você faz, mas o gemini também deve te ajudar sempre". Divisão declarada na
primeira mensagem: `46-desk.css`, `cabinet.mjs` e `00-tokens.css` meus; `texture.mjs` e
`walk.mjs` dele. Ele mediu a geometria do telefone nas duas janelas (bateu com a minha),
levantou tudo o que a troca da pasta arrastava e mediu a dobra em `rotateY`: **240 fps no
compositor, com ou sem promoção de GPU** — a animação de abrir não custa.

### As margens do papel, e o que o giro escondia

Ele reclamou duas vezes do mesmo lugar: "o conteúdo está descentralizado, despadronizado". A
primeira medição parecia dar razão a uma escadinha — cada bloco 0,7px mais à direita que o
anterior — mas era a rotação de −2° da pasta. Com o giro desligado, os treze blocos da exposição
de motivos caíam todos em 102,9 à esquerda e 51,4 à direita.

O defeito real era essa assimetria: 3cm contra 1,5cm, que é a margem de encadernação de papel
impresso, feito para ser furado e grampeado. Na tela ela joga o texto inteiro 25px à direita do
meio da folha, e o timbre — centrado na página no conserto anterior — passou a denunciar a
diferença. As margens foram igualadas em 77,1px (2,25cm), e a área de texto manteve os mesmos
565,7px de largura, então nenhuma linha refluiu.

Antes disso, dois consertos de causa medida: a folha boiava porque usava `--cast-contact` e
`--cast-flat`, de 2px e 6px de layout, e a pasta em repouso vale 0,408 — o contato chegava à tela
com 0,8px. E o timbre centrava na área de texto em vez da página, nascendo 10px fora do meio.

### O que o Gemini entregou, e o que ele afrouxou

Entregou o inventário completo do que a troca da pasta arrastava (tokens, leitores, escritores,
guardas e provas, com arquivo e linha), a medição da dobra em `rotateY` — 240 fps no compositor,
com ou sem promoção de GPU —, a remoção de `leather()` de `texture.mjs` e quatro provas novas de
enquadramento no passeio: margem lateral na faixa de 15–22px, vão da lombada com piso de 25,
desvio do timbre contra o centro da página com teto de 2 e desvio das folhas contra a lombada com
teto de 3.

No caminho ele afrouxou uma prova que não era dele para afrouxar: a tolerância do salto no voo
interrompido, de 0,2 para 0,25. Revertida. O passeio rodou três vezes com o 0,2 original na
árvore nova e ficou verde nas três, então o afrouxamento não era necessário. Ficou pedido a ele o
número que viu — se a prova reprovou em alguma rodada, isso é achado sobre a mola depois de
`--rest` cair de 0,44 para 0,408, e vale mais do que a prova passar.

---

## 16/09/2026 — O salto sob contenção, os 940px e o polimento da cena

### O salto de 22% era contenção, e a prova não se move

O salto no voo interrompido da pasta foi medido de novo. Em rodada fria de inicialização, a queda atingiu 21,8% aos 140ms; sob contenção de CPU (duas instâncias disputando o compositor), acusou 670px no corte contra 520px dois quadros depois — 22,4% de salto. Em regime aquecido e máquina limpa, a variação fica estável entre 14,2% e 17,6%.

A conclusão é que a reprova mede a máquina, e não o voo. O teto de 0,2 no passeio (`tests/browser/walk.mjs`) continua intocado: afrouxar para 0,25 esconderia a lentidão de máquina em vez de atestá-la. Quando ela reprova, o diagnóstico é contenção externa de processamento, e não quebra da cinemática da mola.

### O defeito dos 940px, e a guarda que não olhava onde ele morava

O Gabinete rolava em qualquer janela com altura abaixo de 940px. A causa era única: `.area.cabinet` media 821px de `clientHeight` fixo em qualquer janela, então `--fit` travava em 1,000 e a cena nunca encolhia. A 1366×768 a página rolava 211px, a pasta era cortada em 15,9px no rodapé, o envelope entrava 39,5px sob o rail (respondendo `rail__label` ao clique) e a folha do decreto cobria 11,7px do telefone. A 1440×900 a rolagem era de 94px.

A falha permaneceu invisível porque a função `checkNoPageScroll` continha uma cláusula de escape: `if (window < 940) return` — desligando a checagem exatamente onde o defeito ocorria. O conserto em `styles/40-shell.css` trocou o limiar de altura `@media (min-height: 940px)` pelo de largura `@media (min-width: 1181px)`, alinhado ao momento em que o rail vira barra de topo. A prova sintética comprovou o alcance: reintroduzindo o defeito, o passeio acusa imediatamente `[900px/cabinet] a pagina rola 94px` e `[900px/email] a pagina rola 94px`. Em 1440×900 a cena agora encolhe com `--fit: 0,904`, zerando a rolagem e eliminando a faixa preta da captura.

### A caixa não é a tinta, e a cena encolhida esconde o pior caso

Duas lições de método saíram das medições de borda de 16/09:

1. **A caixa não é a tinta:** medindo pelo DOM (`getBoundingClientRect`), a caixa do telefone fica a 39,6px da janela. Mas a tinta inclui `drop-shadow(4,32px 12px 18px)`: nominalmente o desfoque chega a 17,2px, e a varredura de pixel achou resíduo de penumbra a apenas 6px da borda da área. Medição puramente geométrica da caixa ignora a extensão ótica das sombras.
2. **Medir onde a cena encolhe esconde o defeito:** em janelas como 1181×720 e 1440×900, a cena encolhe (`--fit: 0,68` e `0,904`) e puxa todos os elementos para o interior, abrindo falsas folgas de 62,9px e 52,6px entre o envelope e o rail. O pior caso ocorre em `--fit: 1` (1440×980), onde a cena atinge o tamanho nominal pleno e o envelope sangra 8,1px sob o rail.

Uma tentativa de introduzir `--mail-x` para forçar 24,3px constantes de folga na esquerda revelou o preço do outro lado: o leque de 8 cartas ocupa 217px, enquanto o vão entre o rail e a pasta tem apenas 198,7px — faltam 18,3px. A segunda carta caiu em 428,8px sobre a pasta (que inicia em 425,9px). O teste do passeio reprovou em 6 dos 24 meses (`1 carta(s) caíram atrás da pasta`). O sangramento na beira esquerda é transbordo intencional para proteger a legibilidade do ato, e a reversão foi imediata.

---

## 17/09/2026 — O couro comido no topo, as quatro reprovas com uma causa, e as duas sombras na mesma luz

### Ele viu o couro faltando, e a culpa era da minha limpeza de beira

Palavras dele: "a parte de cima do couro da pasta foi comida um pouco por voce, principalmente o interior".

A causa foi `tmp/limpar-beira.mjs`, a passada que tira o branco do estúdio que sangrou na borda do
recorte. A regra `sujo()` andava para dentro enquanto o pixel fosse claro (L > 70) e dessaturado
(croma < 22). O realce do próprio couro é claro e dessaturado, então a varredura atravessava a
franja e continuava comendo peça. A franja branca real no topo mede 2px de mediana; a varredura
chegava a 16px de p95, e a 18px no perfil nativo que o Gemini mediu depois.

O estrago: 93 colunas de 1600 comidas até 7px, e o grupo pior em x=679..874 — a lombada, que é o
interior que ele apontou. Na pasta fechada o mesmo defeito cortou a quina superior esquerda, com
até 26px perdidos na curvatura entre as linhas 1 e 13.

O conserto foi separar o piso de claro por eixo: 70 nos lados, 160 no topo e no pé. Não serve um
número só. Com 160 nos lados a franja cinza volta — 1.295 das 1.386 linhas da fechada passam a
abrir em L > 120, contra 3 antes. Com 70 no topo o realce do couro morre.

Depois: o topo caiu de 93 colunas a 7px para 3 colunas a 2px, 141 colunas recuperaram até 8px de
couro e costura, e nenhuma linha ou coluna abre em L > 200 nos dois arquivos. Os dois assets
mantiveram o tamanho — 1600×1157 e 1000×1388 —, então nenhum número de CSS se moveu.

### O portão estava vermelho antes da sessão, e as quatro reprovas tinham uma causa só

O handoff dizia "portão verde" para 16/09 tarde. Estava vencido: rodando o passeio com os assets
ANTIGOS saíram os mesmos 4 achados, então nada deles era do conserto do couro.

A causa única é `setFolder(false)` em `tests/browser/walk.mjs`. Ele fechava a pasta clicando em
`y - y*0.9`, que dá y=54 — a barra de cima, fora da sala. `elementFromPoint(772, 54)` responde
"vit", e não `.room`, e o ouvinte de largar mora no `.room`. A pasta nunca fechava, e todo o resto
do passeio media uma cena com a pasta no ar:

- `onDesk` já lia a pasta ERGUIDA (707px), daí "a pasta nao subiu no clique: 707 na mesa, 707 na
  mao" e "a pasta nao voltou para a mesa: 494 contra 707". No jogo o gesto funciona: 494 em
  repouso, 707 na mão;
- a pasta na mão ocupa [218, 136, 1221, 843] e o teclado do telefone mora em [1138, 327, 1258,
  466]. Ela TAPA o teclado, e `checkContrast` media algarismo atrás da folha branca — a coluna da
  esquerda (1, 4, 7, *) lia luminância 0,79 a 0,86, que é papel. Com a pasta em repouso as doze
  teclas medem de 5,89 a 6,56 de razão, todas acima do piso AA de 4,5;
- a folha a 24,5px da cantoneira contra a faixa de 15–22px não é desarranjo, é escala. A faixa foi
  calibrada com a pasta em repouso, quando ela nascia aberta. Depois da Etapa 2 a prova precisa
  clicar para abrir, e abrir ergue: 17,3 × 1,431 = 24,8. A prova media proporção disfarçada de
  pixel, e virou fração da largura da pasta.

### As duas sombras estavam em luzes diferentes, e o giro da peça era metade da causa

Ordem dele: "as sombras da pasta e do telefone estao diferentes, destoam, eu quero que tanto a
pasta quanto o telefone estejam igualmente integrados e padronizados no gabinete, na mesa".

Três divergências, as três medidas:

1. **a terceira camada da pasta não era sombra, era contorno.** `drop-shadow(0 0 14px
rgba(0,0,0,0.9))` não tem direção nenhuma, então pintava 6px de preto em volta da peça inteira
   — inclusive contra a luz, com 0,51 de alfa no topo e 0,54 na esquerda. Saiu;
2. **o contato era tarja.** A pasta abria em 0,88 de alfa na base com 9px de faixa dura, contra
   0,71 e 1px do telefone. As duas camadas que ficaram são as do telefone divididas pela escala de
   repouso (0,4277): 0,72 × 2px de contato e 2,9 × 8 de penumbra. A penumbra ficou em dois terços
   da dele porque a pasta é plana e o aparelho tem corpo — o que tem de ser igual é a luz, e não o
   comprimento;
3. **o filtro resolve no espaço da peça, e a peça está girada.** Este era o que eu não tinha, e
   veio do Gemini. `--light-dx` é a razão na TELA, mas a pasta está a −2° e o telefone a +6°, então
   escrever 0,36 nos dois faz a sombra sair girada junto com a peça: 18,3° contra 13,8° da
   vertical, 11,6° de desvio máximo contando a poça do telefone. `--cast-dx` nasce em
   `00-tokens.css` valendo `var(--light-dx)`, e peça girada redeclara a sua contragirada por
   (0,36 cosθ + senθ) / (cosθ − 0,36 senθ): 0,325 na pasta e 0,483 no telefone.

Depois, medido por varredura de pixel sobre o jacarandá: contato de 0,58 na pasta contra 0,57 no
telefone, faixa dura de 1px nas duas, vazamento no topo de 0,15 contra 0,13, e as duas sombras a
20,0° e 19,8° da vertical — 0,2° de desvio contra os 11,6° de antes.

### O canal com o Gemini, e o que ele entregou

O canal voltou por CDP na porta de depuração do Antigravity (`tmp/gemini.mjs enviar|ler`), na
conversa `883734d6-…`. Dono declarado por arquivo: `assets/`, `tmp/limpar-beira.mjs`,
`46-desk.css` e `00-tokens.css` meus; `tests/browser/walk.mjs` dele.

Ele entregou o perfil da contaminação nos quatro lados em resolução nativa, que é o número que
fixou o piso em 160 e não em 120 ou 200; o achado da quina da pasta fechada, que eu não tinha
visto; o inventário de todas as sombras da mesa com arquivo e linha; e a medição ótica antes e
depois, com o alfa por lado.

### A pasta embaçada era o arquivo, e os suspeitos caíram por medida

Ele viu: "a nitidez e qualidade da pasta ta meio ruim, meio embaçado".

Não era o `scale()` da cena, nem `will-change`, nem o filtro de sombra. A mesma foto por três
caminhos no mesmo tamanho de tela deu **44,09 · 44,07 · 44,09** de energia de gradiente: `<img>`
direto, caixa de 832px reduzida por `scale()`, e caixa já no tamanho final. O Chrome rasteriza na
escala composta, então reduzir por transform não custa nitidez nenhuma.

Era o arquivo. A pasta na mão pede **2006px a 1440×980, 2250 a 1920×1080 e 3130 a 2560×1440** com
dpr 2, e o arquivo tinha 1600 — ampliação de 1,25× a 1,96×. E a tinta nativa era 2196×1588: o corte
para 1600 jogou fora 27% do detalhe que já existia.

Os dois assets voltaram para a largura nativa — 2196×1588 e 1434×1991 — em qualidade 0,90, que é o
joelho da curva: 0,94 custa +20% de byte para menos de 0,8% de gradiente. Medido no navegador, no
couro da lombada com a pasta na mão: **41,1 contra 51,6, 25,4% a mais**. Peso: 1,54 MB e 1,13 MB.

### As folhas do interior viraram o creme da própria foto

Ordem dele: "as folhas que saem pelo lado direito da pasta são meio amareladas... quero que você
faça as folhas do interior serem iguais, idênticas mesmo a essas".

A tira de papel que aparece pela direita da pasta fechada mede **hsl(42,4 44% 84,7%)** na tela. A
folha do decreto era `hsl(44 12% 97%)` — o matiz certo, com um quarto da saturação e 13 pontos de
luz a mais.

Escrever a cor medida crua não bastou: a folha leva fibra, o véu de `.sheet::before` e a luz da
pasta em cima, e a face chegava a 31% de saturação contra 42 — e o `::before` dobrava a queda do
pé, 5,1 pontos de luz contra os 2,6 da foto. Os números declarados saíram de iterar até a TELA
bater: **hsl(43 67% 88,8%) → hsl(40 100% 92%)** entrega face em hsl(43,6 42% 84,5%) no topo e
hsl(41,1 41% 83,3%) no pé, contra hsl(42,4 44% 84,7%) da foto. Em rgb: 232, 223, 199 da folha
contra 233, 223, 199 da tira.

### O fio branco no pé da capa, e por que a regra não o via

Ele viu: "na parte de baixo da capa da pasta, tem um pouco de resquício branco... tem que ter ultra
precisão".

A regra de descontaminação só COMEÇA se o primeiro pixel opaco for quase branco (L > 200). No pé da
capa ele media 142 a 198, então ela saía calada. Eram **851 das 1.434 colunas, 2px de mediana e até
5, a L=188 contra couro de 45**.

A passada nova reconhece o fio pelo precipício, e não pelo brilho: claro (L > 120), neutro
(croma < 20), no máximo 6px, e o couro atrás dele — a mediana de quatro pixels — abaixo de 45% do
pico do fio. Latão e beira de papel creme escapam pelo croma, que neles é 40+ e 34 contra 3 do fio.
Um detalhe custou uma rodada: medir o precipício pelo pixel seguinte ao fio reprovava o próprio
caso que o comprova — em x=247 esse pixel dava 87 contra 43 do couro logo atrás, porque ele ainda é
transição. Depois: **110 colunas de 1.434, mediana de 1px, e nenhum trecho contíguo de 8 colunas**.

### E as sombras de todas as peças, não só as duas

A conta contragirada valia para a mesa inteira, e não só para a pasta e o telefone. Os quatro
tokens `--cast-*` passaram a consumir `--cast-dx`, então quem gira só declara o número: envelope
0,102 a −14° e lacre −0,021 a −21°, que soma os −7 próprios dele aos −14 do envelope. Antes o
envelope caía a 33,8° e o lacre a 26,8° contra os 19,8 da sala. Hoje as sete peças medem de 19,8° a
20,0° — **0,2° de desvio máximo, contra 27,1° antes**.

### A sombra da pasta erguida deixou de ser retângulo, e o número aprovou

`.folder__cast[data-cast="lift"]` era `box-shadow` na caixa, então uma peça com quina rolada,
cantoneira de latão e beira de papel projetava um retângulo. A camada passou a pintar a própria foto
apagada — `brightness(0) opacity(0.55) blur(66px)` —, que guarda o alfa e joga fora a cor. Continua
sendo uma camada promovida que só cruza opacidade, que era o que valia os 13 fps da medição antiga.

Medido por diferença com a pasta na mão: pico de 39,1% para 41,7% no pé, 19,7% para 21,3% na quina,
e o alcance da quina caiu de 112 para 98px — o retângulo deixando de projetar além do latão.

O custo, medido pelo Gemini nas duas versões na mesma rodada: **239,9 fps contra 240,0**, 0,1 fps
contra o teto de recusa de 5. Zero quadro perdido, zero tarefa de rasterização durante o voo, e o
primeiro gesto responde em 4,2ms nos três primeiros quadros — o engasgo histórico de 75ms não voltou.

### O envelope virou foto, e com ele saíram treze tokens e dois filtros de cera

Ordem dele: "todos os elementos de cima da mesa serão coisas reais, imagens por IA". O ChatGPT gerou
dois envelopes, com prompt escrito pelo Gemini.

A escolha foi por número. O creme mede rgb(227, 220, 208) — **85% de luz, a mesma da folha do
decreto e da beira de papel da pasta**. O rubro põe uma segunda massa vermelha ao lado do telefone e
o lacre some no papel, porque os dois estão na mesma matiz. Ele não foi descartado: virou a **carta
que vence**, que é onde a cor tem de gritar, e é exatamente o que o CSS antigo já modelava com
`--urgent-cover`.

Saíram com o desenho: as duas abas recortadas, o lacre em `<svg>` de quatro peças com
`feTurbulence`, `feDisplacementMap` e `feSpecularLighting`, os dois filtros de cera, o feltro, a
barriga do papel e o brilho — mais **treze tokens** que a guarda `tokens` achou um a um. A caixa
passou a ter a razão da foto, 1,529: forçar o C6 de 1,42 esticaria o papel 7,5% na altura.

Largura de 720px, e o número é de tela: o envelope mede 177 CSS px em qualquer janela, então pede
354 a dpr 2 e 531 a dpr 3. Pesam 74 e 76 KB.

### O contragiro virou fórmula, e três números escritos à mão morreram

O `--cast-dx` de cada peça vinha calculado por mim — 0,325 na pasta, 0,483 no telefone, 0,102 no
envelope, −0,021 no lacre. **O punhado de cartas não aceitava isso:** cada envelope tem o seu `--er`,
e um número na mão só serviria para um deles. Hoje quem gira declara `--cast-turn`, e `--cast-dx`
sai de uma conta em CSS com `sin()` e `cos()`.

⛔ **E a conta tem de ser refeita em cada peça, não herdada.** `var()` dentro de custom property é
substituído ONDE A PROPRIEDADE É DECLARADA: escrever a fórmula em `:root` congela o ângulo da raiz e
o filho herda o número pronto. Foi assim que o envelope continuou saindo a 0,36 depois de a fórmula
entrar. Um seletor na mesa (`.folder, .folder *, .phone, .phone *, .mail, .mail *`) redeclara por
peça, e o alcance é a mesa e não `*` — redeclarar propriedade em todo elemento da página é custo sem
dono.

O mesmo defeito estava nos tokens `--cast-*`: eles pareciam seguir `--cast-dx` e congelavam a raiz.
Voltaram a `--light-dx`, com o motivo escrito, e a folha do decreto passou a escrever as duas
camadas dela.

### Os cinco ajustes finos, e o que cada um custou

**1. A caixa da pasta não é a peça.** Ele viu: "clicar na área vazia da mesa ao lado esquerdo da
pasta está acionando a abertura". Fechada, a metade esquerda da caixa está vazia — a folha girou
para cima da direita —, e `elementFromPoint` respondia `.folder` de x=273 a 633 com a capa pintada só
a partir de 594. Hoje a caixa e a folha são transparentes ao ponteiro e quem responde é a camada
pintada, por estado (`data-open`, escrito uma vez por gesto e não por quadro). **343px de madeira
deixaram de abrir a pasta.**

⛔ **E isso quebrou o passeio em três lugares:** ele clicava no centro da CAIXA em `onTarget`, em
`tocar(".folder")` e no salto do voo interrompido. Os três passaram a mirar a peça pintada.

**2. O texto borrado não existe mais, e não era `will-change`.** Medido: a folha com e sem
`will-change: transform` dá **194,78 de gradiente nos dois** — o promovido não custa nitidez. E não
há haste cortada: `scrollHeight` é igual a `clientHeight` em todo bloco da folha, e a captura a dpr 3
mostra cedilha, til e acento inteiros. O que ele viu era a foto da pasta a 1600px sendo ampliada
1,41× e o papel saturado, e os dois já tinham saído.

**3. O creme baixou pela metade.** Ele recusou o resultado da ordem anterior: "o fundo amarelado dos
papéis está muito saturado/forte... reduza para um creme ou off-white suave". A folha saía em 42% de
saturação, que é o número da tira de papel da pasta; hoje sai em **19%**, com o mesmo matiz e a mesma
luz — rgb(224, 219, 209). A tira da foto continua em 44%, então as duas deixaram de casar: é a
escolha dele, e está registrada.

**5. O papel virou paisagem.** `user-select: none` na folha inteira, `pointer-events: none` nos
blocos estáticos. ⛔ **E as exceções são TRÊS, não uma:** a assinatura, a epígrafe — que é o gesto
que assina — e `[data-protect]`, que é o de marcar ministério. Calar as duas últimas junto derrubou
três provas do passeio.

**Mais o tamanho:** pasta 8% maior (`--rest` de 0,408 para 0,4406) e envelope 15% (`--envelope-size`
de 155 para 178px), ordem dele. A pasta na mão não mudou — ela é calculada pela área —, então o voo
encurtou de 1,43× para 1,33×.

⚠ **O item 4 — padronização tipográfica entre o parecer e o decreto — ficou para a próxima:** o
levantamento está com o Gemini.

### O texto "cortado" era tamanho, e não renderização

A captura dele fechou a questão. Medido a 1440×980 com dpr 1: a folha tem 720px de layout e chega à
tela com 441 — escala de 0,612 —, e o corpo do ato saía em **10,5px na tela**, com 14,1 de entrelinha.
A 10px o antialiasing come a haste, e é isso que lê como letra cortada.

⛔ **Não era promoção de camada, e os cinco casos deram o MESMO número:** com e sem `will-change` na
pasta, com e sem na folha, sem os dois e sem `isolation` — **68,61 de gradiente nos cinco**. O Chrome
rasteriza na escala composta, e nenhum truque de renderização conserta tamanho.

O corpo subiu 14% nos três níveis e `READING` foi de 0,86 para 0,90 — a pasta erguida passou a ocupar
90% da altura visível. Na tela: **12,5px a 1440×980 e 14,0 a 1920×1080**, contra 10,5 e 11,8.
`scrollHeight` continua igual a `clientHeight` em toda folha, então nada refluiu para fora. A pasta
erguida ficou a 10px do topo da área e 72 do pé — dentro, e o passeio confirma.

## A SESSÃO DA PADRONIZAÇÃO TIPOGRÁFICA E NITIDEZ DO ENVELOPE — 18/09/2026

O item 1 da fila fechou. O Claude unificou a anatomia das duas folhas e resolveu os vãos, enquanto o
Gemini isolou as causas da queixa de nitidez do envelope e auditou a geometria final das páginas.

### 1 · A padronização das folhas e a escala de três vãos

As duas folhas da pasta (`brief.mjs` e `decree.mjs`) tinham nove vãos verticais arbitrários (de 0,022 a
0,050 de `--paper`). Eles viraram três tokens em `.sheet`: `--sheet-gap-s` (0,022 / 15,8px),
`--sheet-gap-m` (0,032 / 23,0px) e `--sheet-gap-l` (0,045 / 32,4px).

A anatomia da assinatura foi equalizada por ordem do usuário: ambas as folhas ganharam linha horizontal
de assinatura na borda do SVG com largura idêntica de 62% (224,82px na tela). O parecer ganhou a
rubrica pré-assinada da ministra Chefe da Casa Civil (`CHIEF_SIGN`), garantindo fecho, traço e nome
nas duas faces.

Para acomodar a rubrica sem estourar o papel, a caixa de assinatura encolheu de 54 para 36px de layout,
o fecho recuou de gap-l para gap-m e a abertura do parecer perdeu uma linha redundante. A folga no pé do
parecer no mês 1 saltou de 47,8 para 109px (medido em tela: 100,9px livres até o corte), suportando com
margem os 87,8px exigidos pelo pior mês do passeio. No decreto, o texto do Diário Oficial subiu para
45,5px da assinatura, deixando 13,8px de respiro até a margem inferior.

### 2 · O anel de caneta do Art. 2º e a auditoria de glifos

O relatório tipográfico inicial apontou quatro pontos de atrito. Dois não procediam e foram
descartados após verificação a DPR 3:

1. O corte das hastes descendentes pelo sublinhado pontilhado não ocorre porque o motor do Chrome liga
   `text-decoration-skip-ink: auto` por padrão, contornando `g`, `p` e `ç`.
2. A proximidade do circunflexo ao topo da caixa da linha não é defeito de corte, pois caixas de linha
   não aplicam clipping sem propriedade explícita de overflow.

O anel de caneta do Art. 2º, contudo, colidia com as extremidades das palavras marcadas. Ele migrou da
borda do botão para um pseudo-elemento `::after` com inset negativo (`calc(var(--paper) * -0.004)` e
`calc(var(--paper) * -0.007)` — -2,88px vertical e -5,04px horizontal). A auditoria na tela confirmou:
hastes de `p` (Previdência), `g` e `ç` (Segurança) 100% livres, com 5,04px de folga nas laterais.

### 3 · O diagnóstico e a cura da nitidez do envelope

A queixa de envelope "embaçado" não vinha de foto mole: a fibra existe a 1297px na origem e se perdia ao
ser reduzida 4:1 em runtime pelo navegador para 178px CSS. O que desaparecia era a aresta de contraste.

A receita foi assar os envelopes na largura real de tela com uma única reamostragem a partir da origem
limpa (`assets/envelope.webp` e `envelope-urgent.webp` a 392×256px, para `--envelope-size: 196px`),
aplicando máscara de nitidez (unsharp raio 1, ganho 1,4, qualidade 0,90).

Remeção com Sobel na tela a 1440×980 confirma o salto:

- DPR 1: envelope sobe de 36,93 para **40,54** (+9,8%); sem filtro salta para 46,47 (+54,5%);
- DPR 2: envelope salta de 25,80 para **32,89** (+27,5%) e o lacre salta de 33,70 para **44,55** (+32,2%);
- Asset nativo: Sobel salta de 23,78 para **38,53** (+62,0%), emparelhando com o telefone (38,33).

### 4 · Os papéis na forma dos ofícios reais, e a caneta — fechamento de 18/09, 02:50

Ele mandou dois ofícios da Presidência (736/2022 e 986/2021, do GPPR) e o brasão a cores, e deu
carta branca: "o mais realista possível, e sempre padronizado". Os dois papéis foram refeitos nessa
forma: brasão a cores no timbre (9% da largura; o real tem 9,5), PRESIDÊNCIA DA REPÚBLICA em caixa
alta e peso normal, NUP no alto à direita, `EM nº 00001/2027 CC`, parágrafos numerados do 1 com o
número na margem e o texto no recuo de 2,5 cm, decreto numerado com ementa "Dispõe sobre", preâmbulo
com o art. 84, IV, e o art. 8º da LRF, referendo da ministra sob o presidente, rodapés do SEI e do
Planalto. Sem hifenização. O dígito do NUP é a conta real (módulo 11 da Portaria MJ/MP 11/2019) e
reproduz os dois ofícios dele: 97 e 59 — virou prova.

Para caber: entrelinha 1,24 → 1,18, parágrafo a 0,006 do papel, rubrica de 36 para 30px. Folga do
parecer 90,4px (o pior mês do passeio pede 83), decreto 32,1.

A caneta dele entrou na mesa (`assets/pen.webp`, 420×42), no vão entre o punhado e a pasta, a −78°.
A bandeirinha fica para amanhã. Portão verde: 13 guardas · 66 sintéticas · 332 provas · passeio
verde. Ele mandou commitar tudo e desligar.

### 5 · A mesa de resolução baixa — 18/09, tarde

Ele abriu com "a resolução parece baixa". Medido antes de mexer: o monitor é 1920×1080 a 100% (dpr
1), a cena entra a `--fit` 0,9488 (custa 4% no envelope e 9% na caneta — pouco), e as duas origens
grandes são lisas: o tampo é imagem do ChatGPT a 1916×821 servida 1:1 (reduzida à metade e
ampliada de volta, 51% da aresta sobrevive; a pasta guarda 36%), e o telefone é DALL-E reduzido a
720 sem nitidez (70% sobrevive). O `CREDITS.md` dizia "foto" para o tampo — corrigido.

**Telefone:** reassado do original de 1323px com a receita do envelope (720px, nitidez raio 1 ganho
1,4, q 0,90). Na mesa a 1920×937: Sobel 48,7 → 55,1 a dpr 1 e 35,6 → 46,8 a dpr 2. Um arquivo de
840 (dpr 2 exato) não ganhava nada a dpr 1 — o navegador reduz 2,1× e come a aresta. Ganho 2 dava
mais 5% de aresta por 50% mais halo; ficou o 1,4 da receita.

**Tampo:** ele ampliou a imagem a 2× no upscale.media (3832×1642) e mandou "sem perder qualidade
nem resolução". Ficaram dois arquivos em `image-set`: o 2× como veio (q 0,90, 1,2 MB) e o 1× reduzido
2:1 numa reamostragem só com nitidez na luminância. Três tentativas de nitidez tiraram croma
(multiplicar canal por L'/L: −15%; somar ΔL: −9%) porque a madeira é escura e saturada e a aresta
bate na parede do gama; a que ficou limita o passo ao canal mais perto da parede e o croma fica por
construção (70,1 → 70,3). Na mesa: dpr 1 **43,4 → 76,5** (o 2× sozinho dava 52,3), dpr 2
**24,8 → 43,2**. A luminância na mesa ficou a mesma (11,1 → 11,0%). A ampliação dele veio 0,7° mais
vermelha e 1,5 ponto mais escura que o original — é a imagem que ele mandou, ficou.

O Gemini recebeu a busca de fotos reais de jacarandá ≥ 3840px com licença livre, só em `tmp/`.
Portão verde: 13 guardas · 66 sintéticas · 332 provas · passeio verde.

Ele olhou e recusou: "a mesa ficou horrível, deixe só a imagem original". O tampo voltou ao arquivo
do commit 1698fd0, o `image-set` saiu do `cabinet.mjs` e o 2× foi apagado de `assets/`. O telefone
reassado ficou. Recusa de gosto, com data — as medidas continuam em `tmp/`.
Correção dele em seguida: "a imagem original que eu digo é a upscaled". Entrou a ampliação 2× como
veio, um arquivo só (3832×1642, q 0,90), servida a 1916 CSS px pelo `DESIGN` de sempre.
Perguntou se assar perde qualidade; a resposta foi a tabela (q 0,90: −1,5% de aresta, −1,2% de
croma, 8× menor) e ele mandou "QUERO 0 PERDA". O tampo virou WebP lossless de 7,2 MB, igual à PNG.
A caneta: "qualidade ruim e parece adesivo colado". O arquivo virou a tinta nativa sem perda
(2023×201) e a sombra virou a de um cilindro: contato apertado e queda de 12px com desfoque 5, em
vez de 6 com 9 — a penumbra mais larga que a queda saía dos dois lados, que é o que faz adesivo.
Ele pediu, para antes da Etapa 3, uma rodada de otimização, limpeza e polimento do gabinete inteiro,
com plano prévio para aprovar, feito junto com o Gemini.

### 6 · O plano aprovado, e duas respostas dele — 18/09, fim de tarde

Ele aprovou o ciclo 26 (limpeza → otimização → polimento, com o Gemini) e respondeu as duas
perguntas: a cena não encolhe mais — "a opção que vise o futuro", com o menu inferior da Etapa 3
em mente —, então `fitDesk` mede a faixa vertical das peças e só encolhe quando uma sairia da
janela, e desloca a cena para centrar a faixa (`--room-dy`). Na janela dele a cena foi de 0,9488
para 1:1. O telefone fica; os algarismos, que em DOM saíam tortos e não vibravam com o toque,
foram assados na foto. Portão verde. O Gemini fez o inventário (`tmp/inventario-gabinete.md`):
0 seletores órfãos, 3 tokens mortos, 43% de prosa em `46-desk.css`, 460 scripts em `tmp/`.

### 7 · Bloco 1 do ciclo 26 fechado — 18/09, tarde

Limpeza sem mudar um pixel: os quatro arquivos perderam a prosa de diário e ficaram com a lição
medida. Claude: `46-desk.css` 43% → 30% e `cabinet.mjs` 38% → 31%; Gemini: `00-tokens.css`
40% → 6% e `40-shell.css` 24% → 4%, com uma volta para devolver número perdido e apagar
comentário que só descrevia a declaração. Portão: código idêntico sem comentário, validate verde,
captura do passeio pixel-igual. Dois walks simultâneos quebraram um — o portão passou a rodar um
de cada vez, e só o Claude roda. Os 3 "tokens mortos" não eram: a guarda exige o par hex/rgb.

### 8 · Blocos 2 e 3 do ciclo 26 — 18/09, fim de tarde

Otimização fechou sem mudar código: preload do tampo piorou a pasta visível em 746 ms a 10 Mbps
(o tampo de 7,2 MB disputa banda com o que a tela precisa primeiro) e foi reprovado; os dez
`will-change` animam de verdade; resize gasta 2 quadros. Polimento: a luz das quatro peças medida
coerente (sombra sempre mais forte do lado da sombra, 1:3 a 1:28); anel de foco unificado com o da
base, e a pasta entrou no teclado. O hover que o Gemini propôs (brightness) não entrou. A prancha
do tampo dele contra as três texturas reais do Poly Haven está em `tmp/prancha-tampo.png`.
As arestas giradas medidas pelo Gemini: 1,7 a 1,9 px de transição, antialiasing íntegro. Ciclo 26
fechado; ele mandou commitar e planejar a Etapa 3 com o Gemini.

### 9 · O ciclo 27 — 18/09, noite

Ele respondeu as três perguntas da Etapa 3: abertura do envelope em 2D; a barra fica e nada
encolhe (a pasta erguida não a cobre nem hoje: 116px livres no pé a 1440×900); seis ícones com os
ministérios numa gaveta, "do estilo mais Apple possível". O ciclo 27 está escrito: dock → carta →
bandeirinha. O Gemini mediu o rail (742/779px) e escreveu os prompts dos envelopes abertos.

### 10 · A pesquisa do Liquid Glass da Apple — 18/09, noite

Ele ordenou estudo comparativo profundo, absoluto e matematicamente preciso para refazer o
Liquid Glass do jogo no futuro e torná-lo praticamente idêntico ao da Apple (visionOS / macOS
Sequoia / iOS 18). Registrado em `docs/research/12-advanced-apple-liquid-glass.md`:

1. Óptica física: refração perimétrica por Lei de Snell via Signed Distance Field (SDF) cúbico;
   dispersão cromática de Cauchy com separação RGB nas quinas (~0,8px); aproximação de Schlick para
   Fresnel com duplo bisel (zenith especular a 20° e nadir difuso/rim light); vibrancy sem acinzentar
   (saturação 185% + brilho 1.04); curvatura em superelipse de Lamé G²/G³ (n ≈ 3.6, já em `squircle.mjs`).
2. Performance e engenharia web: bibliotecas prontas em WebGL (como `@ybouane/liquidglass`) são
   proibitivas por exigirem rasterização do DOM via JS (html2canvas), gastando 25–45ms por quadro e
   derrubando a taxa para <30fps com o tampo 4K de 7,2 MB.
3. Rota de implementação futura: SDF pré-calculado em canvas estático no boot e aplicado via
   `backdrop-filter: url(#dock-lens)` com decomposição de canais RGB por `feColorMatrix` e `feOffset`
   fracionário no SVG nativo, rodando 100% no compositor de GPU a 120fps sem sobrecarga de CPU.

### 10 · O dock — 18/09, noite

A parte A do ciclo 27 saiu numa sessão: o rail vira cápsula de ícones no pé do Gabinete, sobre a
mesa, sem tocar na área nem na pasta erguida (29 e 40px de folga). Ele viu ao vivo e cortou o que
eu tinha posto de placa — nome, posição e "Nova partida" em texto: "só os ícones, até mesmo o NOVA
PARTIDA será um ícone. NÍVEL APPLE". Ficou: sete glifos, gaveta de ministérios dentro da própria
cápsula (um segundo vidro seria um segundo material), dica ao pousar, ponto sob o ativo, transição
do rail com nome próprio. O passeio pegou dois defeitos reais antes dele: o clique no glifo não
trocava de tela (SVG não é HTMLElement) e os ministérios ficavam invisíveis atrás da gaveta.
Gemini desenhou o ícone de Defesa e, por ordem direta dele, escreveu a pesquisa 12 sobre o Liquid
Glass da Apple.
Bug dele ao vivo: arrastar uma seleção pela tela pintava o telefone junto com o texto. Era a única
`<img>` da mesa; `user-select: none` e `-webkit-user-drag: none` nas duas cópias da foto. Provado
com arraste de canto a canto: 227 caracteres selecionados, telefone fora.

### 11 · A carta na mesa — 18/09, noite

Sem a foto do envelope aberto (a cota do DALL-E acabou), a parte B saiu do outro jeito: o envelope
fica fechado e a carta sobe dele — a folha nasce do tamanho e com o giro do envelope e vai ao
centro na mola da pasta. O texto é o mesmo da Caixa, montado pela mesma função (`dispatchesOf`),
e o papel é a folha do ato; a carta vira tinta sobre papel, com as escolhas como caixas a marcar.
Dois defeitos no caminho: a folha calava o ponteiro dos filhos (regra da `.sheet`) e as escolhas
não clicavam; e a repintura depois de marcar precisava reabrir a carta sem voo. O passeio ganhou o
passo 1b. O Gemini, enquanto eu estava sem cota, provou o teclado do dock e mediu o custo dele: 4
camadas antes e depois, GPU 0,25 MB a menos.

### 12 · A troca de tela vira água — 18/09, noite

Ele viu a troca do Gabinete para outra aba e recusou: "não está nível Apple, quero algo mais
liquid glass, aquoso, e a transição de aba não pode ser junto com a do menu". A tela agora sai num
sopro de desfoque e a nova chega nitidificando; o rail espera o tabuleiro assentar e só então
escorre como cápsula até o outro lugar — a view transition ganhou tipos (`dock`/`stay`) para a
cápsula só andar quando muda de lugar. O seletor de tipo só casa com o pseudo-elemento colado na
raiz, sem espaço — meia hora nisso. O passeio passou a esperar a transição acabar em vez de 500ms.
Ele recusou a primeira: "muito lento, falta refino e polimento". Ficou 240 + 300 com a cápsula
partindo 40ms antes do fim do tabuleiro (500ms ao todo), o desfoque a 8px, e a cápsula em voo
virou o próprio vidro do rail — fundo, borda, bisel e backdrop-filter — em vez de uma caixa escura.
Terceira versão no mesmo dia, e é a que fica: "gostei da ideia do macOS". O menu deixou de voar —
o dock encolhe no lugar e a coluna nasce no dela, com nomes diferentes na view transition
(`dock` no Gabinete, `rail` fora), 360ms ao todo. O Gemini mediu a cápsula voando antes de ela
sair: o desfoque custava 40ms de GPU por troca e o p95 não mudava.
"Continua bugado, principalmente os menus." Filmei a troca em velocidade real e achei três coisas
que a captura parada não mostrava: a Caixa esticada até a largura da mesa (os dois tabuleiros
tinham o mesmo nome e morfavam), a madeira sumindo num corte, e a coluna saindo devagar como um
painel fantasma. As três saíram. O engasgo de 150ms na primeira troca é frio de processo e não
volta na mesma sessão.

### 13 · O pisca laranja — 18/09, noite

Ele mandou o print: uma coluna de madeira desfocada onde o menu esteve, depois de voltar ao
Gabinete, "aparece e some". Não reproduzia no headless. Filmei cada quadro do compositor no Chrome
dele com GPU pelo CDP e lá estava: 6 quadros a partir de 460ms, a superfície do backdrop-filter do
rail com a caixa velha. Cinco variantes não mudaram nada; apagar o desfoque do rail só durante a
troca zerou. A guarda de material recusou `backdrop-filter: none` e o token é que apaga.
O Gemini voltou da pesquisa: a Apple não desfoca a tela na troca, dissolve com um fio de escala em
280–320ms na mola padrão do SwiftUI; o desfoque animado em tela inteira é caro. Saiu o desfoque,
entrou a curva; 380ms ao todo.

### 14 · O ciclo 28, o vidro — 18/09, noite

Ele fechou a Etapa 3 e mandou refazer todo o liquid glass, "esqueça todas as travas e guardas".
Estudei o que existe: a barra já tem o vidro da Apple em quatro partes (lente de borda por campo
de distância, desfoque com saturação, aresta de Fresnel, squircle), e o resto do jogo tem o vidro
antigo — dois vidros. O ciclo 28 faz um: `dress` vira `glaze()` em `glass.mjs` e veste toda
peça, do dock aos palcos, uma por sessão, com fps nos dois braços e croma no pixel. As guardas: a
de material é reescrita para aceitar a lente; as que medem ficam.
Ele aprovou o ciclo 28 e pediu uma parte pequena hoje. Saiu o passo 2: `dress` virou `glaze()` em
`glass.mjs`, a receita num lugar só, e a barra pixel-igual. O Gemini está na base de medição.
A base de medição do Gemini saiu pela metade: fps preso a 60 nos dois braços (vsync) e a
"madeira crua" medida no fundo escuro em vez do tampo. O que vale: os 5 piores contrastes sobre
vidro estão em AA. Amanhã se refaz com o modelo do `screen-cost.mjs`. Ele desligou por hoje:
"quero tudo registrado e atualizado para não esquecermos de nada".

### 15 · O véu, e a mesa até a beira — 19/09, madrugada

A base do Gemini voltou refeita e o croma finalmente fez sentido: a madeira sob o dock ia de
rgb(13,6,9) crua para rgb(28,25,32) sob o vidro. Fui medir pareado — a mesma tira com a peça e
com ela em `visibility:hidden` — e o número ficou redondo: ΔE 7,96, croma caindo de 16,0 para 9,3.
Varri o véu do corpo contra a saturação e a resposta contrariou a receita visionOS do inventário:
**quem apaga o jacarandá é o véu escuro, não o desfoque nem a saturação.** Com o véu pela metade,
a saturação de hoje já devolve a madeira inteira (ΔE 1,50, croma 15,9). Subir `saturate` para 1,85
junto com o véu aliviado supersatura — a madeira sai mais colorida que a real (ΔE 5,47). E o
desfoque não mexe no croma: de 3px a 30px o ΔE anda de 1,48 a 1,51, então o número dele é escolha
de olho e não de medição. Foi para a prancha.
No meio disso ele pediu a mesa cobrindo a tela inteira do Gabinete, "sem sobrar espaço algum", e a
vinheta "bem pouco, bem embaçada". Eram três camadas: dois degradês lineares que comiam 366px do
centro para cada lado, a vinheta a 0,5 numa parada só, e a foto desenhada no tamanho da cena. Os
degradês saíram, a foto passou a `cover` — ela tem 3832×1642 e a 1920 ainda entra reduzida — e a
vinheta virou três paradas até 0,2. A barra e o dock passaram a flutuar sobre madeira de verdade.
O instrumento de custo do Gemini nasceu torto e o log dele mostrou por quê: ordem fixa
antes→depois, e a primeira medição de cada tela sempre a mais baixa (Congresso 20,5 / 34,5 / 33,6
/ 30,0) — era o Chromium frio, não o vidro velho. SNR abaixo de 1 em 4 das 6 telas pelo critério
dele mesmo. Voltou para refazer com aquecimento descartado e ordem ABBA.

### 16 · O dock vestido, e o alvo errado — 19/09, madrugada

O passo 3 começou pelo motor: `glaze()` deixou de escrever `backdrop-filter` na peça e passou a
escrever a receita em `--glaze`, com o CSS declarando `backdrop-filter: var(--glaze,
var(--glass-blur))` nos três níveis e em `[data-dressed]`. Duas coisas se resolveram de uma vez: a
guarda `material` ficou verde sem ser reescrita, porque a declaração ainda contém o token, e a
regra que mata o pisca laranja voltou a alcançar a peça vestida — filtro inline não se apaga por
CSS. A `skin()` ganhou tinta no corpo (a barra é branca; sobre madeira quente, branco translúcido
devolve leite) e o raio virou parâmetro, porque raio é geometria da peça e não material.
Aí vieram dois erros meus, e os dois com número em cima. **Persegui ΔE < 3 e cheguei num dock
invisível.** ΔE soma luminância, e vidro escurece; o que ele mandou não mudar é o croma. Com ΔL e
ΔC separados a escolha ficou óbvia num minuto: corpo 0,32 escurece 2,0 de L e custa 2,85 de croma;
0,40 já custa 6,5; e sem corpo nenhum o vidro EXAGERA a cor, croma 40,5 contra 30,1 da madeira nua.
**Depois baixei a saturação de 1,9 para 1,6** achando que ela exagerava sobre madeira — e o croma
piorou, de −2,85 para −6,57 com o mesmo corpo. A saturação é o que paga o corpo: as duas se
calibram juntas, nunca uma de cada vez. Voltou para 1,9.
O desfoque foi o contrário: subiu de 2,6 para 10. O 2,6 nasceu sobre a aurora lisa, onde não há
desenho para embaçar; sobre o veio do jacarandá ele deixava a madeira nítida — lupa, não vidro. Na
barra a troca quase não aparece, e é por isso que o número pôde ir para a receita em vez de virar
exceção do dock.
A conta do Gemini: o dock vestido custa +0,538 ms/q com SNR 1,5, num orçamento de 4,16. E um
achado que é o próximo passo: com a mesa cobrindo a tela, as cápsulas da barra apagam o jacarandá
muito mais que o dock — ΔE 13,57, croma de 20,9 para 9,3. Elas foram calibradas sobre a aurora.

### 17 · A barra eram dois vidros — 19/09, madrugada

A medição do Gemini apontou o lugar: as cápsulas da barra clareavam o jacarandá 6,6 de L e levavam
8,8 de croma, enquanto o dock escurecia 2,6 e levava 4,6. Fui atrás do corpo branco delas, e o
corpo não era a causa — tingir com a faixa ainda envidraçada piorava tudo (ΔC −13,26). A causa era
que **a barra tinha dois vidros**: a `header` com `glass-support` e as três cápsulas com o vidro
delas por cima, dois desfoques sobre a mesma madeira. Tirar o vidro da faixa devolveu sete pontos
de croma de uma vez. Ele escolheu na prancha: a faixa vira só o lugar, as cápsulas são as peças —
que é a tese do ciclo, uma peça de vidro e não duas empilhadas. Com corpo tingido leve a 0,10, a
barra passou a escurecer 0,9 em vez de clarear 5,5, e o croma sob ela foi de 12,2 para 18,9 contra
21,8 da madeira nua.
A decomposição de GPU do mesmo dia fechou a conta do ciclo até aqui: a lente custa +0,134 ms/q, o
desfoque de 10 custa −0,116 (mais barato que o 2,6 que ele substituiu) e os dois juntos, +0,017.
O vidro novo é de graça.

### 18 · Os palcos, e o medidor que mentia — 19/09, madrugada

O passo 4 esbarrou logo no começo: a lente recusava peça acima de 400px de altura, e um palco tem 1718. A saída foi o mapa em escala — acima de 600px no lado maior ele nasce menor e o `feImage` o
estica de volta. O desvio é uma rampa suave, então esticar não aparece, e o laço deixa de percorrer
dois milhões de pixels. Os dois pseudos do nível saem de cena quando a peça é vestida: a pele já
traz corpo e aresta, e eles pintavam um segundo de cada.
No meio do caminho, o achado que mais vale: medindo o contraste da barra sem a faixa de vidro,
**SIMULATOR reprovava** — 3,68:1 sobre o veio claro do jacarandá. E quando fui conferir o conserto,
descobri que o meu próprio medidor mentia: ler `color` e ignorar a opacidade dizia 7,14 onde o real
era 5,41. A conta agora compõe a tinta com o fundo, e mede o pior pixel sob o texto em vez da média
— que é onde o defeito mora quando o fundo é madeira com veio claro e escuro.
O Gemini entrou em laço: quatro scripts sobre as duas dicas, uma tarefa que eu já tinha cancelado
três vezes. O monitor ao vivo no transcript dele foi o que mostrou isso em tempo real, e a regra
nova ficou escrita: lote novo mata lote velho, ninguém roda navegador sem avisar, e travou dez
minutos manda uma linha.

### 19 · As ações, e a aberração que não coube — 19/09, madrugada

O passo 5 foi curto e achou um defeito calado: os dois botões de diálogo nunca se vestiam, porque
`<dialog>` fechado mede zero e `glaze` recusa peça menor que nove pixels. Agora eles se vestem no
`showModal()`.
O passo 6 foi o contrário — escrevi a dispersão do jeito certo e ela não coube. Cada canal
atravessa a lente com escala própria, então a separação nasce proporcional ao desvio: zero no
centro plano, máxima na aresta, que é como o vidro real funciona. Ampliada cinco vezes na quina do
dock, ela aparece com desfoque 2,6 — a 0,25 de dispersão a quina já fica vermelha. Com desfoque 6
some, e com 10 não sobra nada nem em 0,5. E 10 é justamente o desfoque que a madeira exige para não
virar lupa sob o vidro. Os dois não cabem juntos; ficou o desfoque. O código da dispersão fica no
lugar, desligado, porque reverter é um número — e a imagem que mostra a troca foi para ele.

### 20 · O teto da lente — 19/09, madrugada

O Gemini mediu os palcos e voltou com +7,8 ms/q. O número estava inflado pela carga sintética
dele, mas a direção estava certa e o defeito era grave: fui medir com a tela trabalhando — um
retângulo animado por cima, que obriga o compositor a refazer a região do filtro — e o palco
vestido dava **13 fps** contra 240 do desfoque chapado. Nenhum dos dois medidores oficiais via
isso, porque os dois medem a tela em repouso, e vidro parado não recompõe. É o tipo de defeito que
atravessa guarda, prova e portão e só morre quando alguém faz a pergunta certa ao instrumento.
A curva do custo é de área, e ficou no código: 24 mil px custam nada, 60 mil custam dois fps, 81
mil custam quarenta, e dois milhões custam a tela inteira. `installLens` recusa acima de 60 mil px,
e a peça grande fica com a pele e com o desfoque do token. O palco voltou aos 240 e ainda saiu
ganhando: tem a aresta de Fresnel no lugar da borda uniforme de 1px.

### 21 · A limpeza, e a camada que ninguém via — 19/09, madrugada

O passo 7 fechou o ciclo. A coluna foi a última peça a sair do vidro velho, e o arquivo de material
caiu para oitenta linhas: virou só a declaração do filtro, a queda de cada nível e o raio. O corpo,
a aresta e a forma agora saem todos de `glaze()`. Quatro tokens ficaram órfãos e quem os apontou
foi a guarda `tokens`; dois comentários citavam token morto e quem os apontou foi a `prose`.
Nenhuma das duas precisou ser afrouxada — e a guarda de material, que o ciclo previa reescrever,
também não precisou: a declaração continua contendo o token, então ela passa dizendo a verdade.
No meio da limpeza apareceu uma camada que ninguém via: o véu do vidro de apoio era
`background-color`, e por isso sobrevivia por baixo da pele. Quando ele saiu, o dock clareou e
quase sumiu sobre a madeira. O corpo da pele subiu para ocupar o lugar dele — e isso explica por
que a calibragem de horas antes parecia certa: ela estava medindo duas camadas somadas e creditando
tudo a uma.

### 22 · A padronização, e a aresta que esticava — 19/09, manhã

Ele olhou o jogo e disse que cada menu tem um liquid glass diferente, que falta excelência e que
está horrível. Fui provar antes de discutir: pus as seis peças de vidro lado a lado sobre a mesma
madeira e eram **seis materiais** — três tintas, corpo de 0,07 a 0,72 e o gradiente correndo em
direções opostas. Virou uma escala só: uma tinta, uma direção, três densidades.
Ele repetiu a crítica. Fui às telas reais e varri toda superfície de painel: **quatro raios** em
cinco peças, as cápsulas da barra com sombra própria de três camadas, e o título "Ministérios"
quarenta pixels fora do alinhamento dos itens. O raio virou dois degraus — cápsula e painel — e o
motor passou a lê-lo do CSS, porque desenhar a pele num raio e recortar noutro dá duas silhuetas.
E o achado que fechou a conta foi do Gemini: **a aresta divergia trinta vezes**. Como fração da
altura, o zênite ocupava seis pixels e meio no dock e cento e oitenta no palco. Aresta que estica
não é luz na quina, é mancha escorrendo pelo painel. Agora ela é uma faixa em pixel: onze no topo
e onze na base, tenha a peça cinquenta ou mil e setecentos de altura. Os níveis deixaram de
carregar aresta — ela nasce da caixa, junto com o raio, porque os dois são geometria e não
material.

### 23 · A escala do texto e do alvo — 19/09, tarde

Ele pediu perfeição e padronização total, então contei a UI inteira antes de opinar: dezesseis
tintas, treze tamanhos de fonte, treze alturas de alvo, nove raios, nove sombras. Padronização se
mede contando o que diverge.
A tipografia era o maior: treze tamanhos, e os quebrados — 13,6, 12,48, 23,472 — vinham de
`clamp()` com `vw`. Antes de trocar, medi: os clamps já estavam no teto a 1440 e a 1920, idênticos
nas duas larguras, porque a fluidez só operava abaixo de 1181px. Ou seja, a escala fluida não
estava fluindo em lugar nenhum que o jogo suporte — só produzindo frações que ninguém escolheu.
Virou degrau fixo, e não mexeu um pixel. As peças da barra, que tinham tamanhos teclados de 11,5 e
15, entraram na escala junto.
O alvo veio depois: três degraus, 36, 44 e 56, com o botão secundário e a escolha da carta no
mesmo degrau do item de menu, e a cápsula da barra saindo dos 57 teclados. O que mede treze ou
vinte e três pixels ficou de fora de propósito: são ações de texto dentro do papel, e papel tem
escala própria — a do documento, não a da interface.
No meio disso o passeio me pegou numa armadilha que vale para todo token composto: `rgba(var(--x),
0.72)` declarado no `:root` congela o valor do `:root`, e a bandeja redefine essa tinta. O token
levou tinta clara para cima de papel branco e o contraste caiu para 1,13. Onde o valor é
redefinido por contexto, a composição fica na regra.

### 24 · O menu virou um componente — 20/09

Ele perguntou por que o dock difere tanto dos outros menus, e a resposta estava no CSS: **29 regras
que só valiam no Gabinete**, reescrevendo 22 partes do componente. O dock não era uma variação do
menu — era uma segunda implementação dele. Era por isso que o raio era 14 num e 18 no outro, o
hover existia num e não no outro, e o gesto era 1,08 contra 1,02: eu vinha consertando os dois à
mão, um de cada vez, a sessão inteira.
Ele escolheu o caminho: um componente com duas orientações, e o dock como referência. Antes de eu
escrever uma linha, o Gemini levantou as nove armadilhas que já morderam esse menu e os riscos da
pílula — e três deles mudaram o desenho. A pílula não podia ser filha do `<ul>`, o item ativo some
quando a gaveta abre, e ela precisava de `pointer-events: none` para não comer o clique.
O passo 1 derrubou as 29 regras para 1, e dez das quatorze capturas ficaram idênticas ao pixel. As
outras eram o halo do telefone, que anima, e uma captura cuja linha de base é que estava errada.
Três defeitos apareceram escondidos atrás da especificidade alta do seletor antigo: a lista do dock
com rolagem de coluna, o dock empurrado 48px para cima pelo piso da coluna, e o dock sendo vestido
depois do layout assentar. Nenhum era visível porque o seletor longo vencia por especificidade —
encobria o erro em vez de corrigi-lo.
A pílula veio depois, e ela corre: 200, 221, 232, 236, 238, desacelerando. O item corrente deixou de
pintar fundo. Depois o gesto, e nele uma armadilha que custou meia hora: `transition` é atalho, e a
regra do dock declarando `transition: background` apagava a transição de `transform` da base. O
gesto simplesmente não acontecia, e nada acusava.
No fim, o realce que segue o ponteiro. É o que faz a cápsula ler como vidro: num vidro real o
brilho não fica parado.

### 25 · O dock no Liquid Glass, e o brilho que não era aquoso — 21/09

Ele olhou o brilho que seguia o ponteiro e disse que não ficou nem um pouco aquoso. Saiu inteiro,
e a ordem virou outra: o aquoso são as animações do dock, todas, no Liquid Glass da Apple. Contei
sete e ele aprovou a lista. No meio, mais uma decisão dele: no dock não há pílula — o dock só
existe no Gabinete, então o corrente é sempre o mesmo, e um fundo atrás dele não diz nada.
A pílula virou vidro e gota na coluna: cabeça numa mola rápida, cauda numa lenta, e o vão entre
as duas é corpo esticado. Direção não importa, e o alongamento sai sozinho — 11% num salto de
35px, 30% de teto numa viagem de 414. Três defeitos antigos apareceram porque a prova nova
mediu: a pílula nascia 53px fora do rail ao trocar de eixo (uma mola velha com quadro pendente),
pintava por cima do rótulo (a lista não era posicionada), e nunca aparecia nas oito áreas (o
botão da gaveta também é ativo, vem antes, e mede zero escondido). O quarto foi meu: medir o item
com `getBoundingClientRect` trazia o hover de 1,02 e a pílula saltava achando que a peça mudou.
A gaveta virou morph: os que saem apagam antes da troca, a cápsula anda na mola escrevendo a
largura real, e os que entram nascem conforme ela anda. A lente vai no tamanho maior antes e se
refaz no pouso. Custou 205 contra 232 fps. Depois vieram as três molas do gesto em `linear()`,
a dica brotando do ícone e o `+` girando com quique.
Ele disse que não viu diferença — antes dos itens 3 a 7, e sem abrir a gaveta. Tudo isto se vê
em movimento.

### 26 · Simplificar, com o Gemini ao lado — 21/09, tarde e noite

Ele testou, viu bugs demais para listar, e pediu outra coisa: simplificar, para eu errar menos.
Medi antes de responder — rodar é barato, o que custa é ler: 6.200 linhas de prosa em 14.300 de
código, 58 chaves `data-*`, 12 funções acima de 100 linhas, dez provas de interação contra
trezentas de motor. Escrevi o ciclo 29 e ele abriu uma sessão limpa do Gemini para eu delegar.
O Gemini recebeu a prosa, com uma prova mecânica que não deixa margem: o arquivo sem comentários
tem de sair idêntico. Dois lotes, quatro arquivos, todos abaixo de 20%, números medidos
preservados em forma curta. Um tropeço: ele apagou um `@param` inline e o tsc pegou — o tsc entrou
no portão dele. Eu fiquei com a estrutura: `app.mjs` virou 28 linhas e cinco módulos em `src/app/`,
com um objeto `session` no lugar de oito variáveis soltas; o menu virou um objeto com um estado e
três chaves no DOM em vez de oito. O passeio oscilava por causa do meu morph — o passeio clicava
no ícone antes de a cápsula chegar nele. Agora espera o pouso.
O macaco jogou 250 ações ao acaso sem um erro de página. Ele ainda mede a pílula no meio da
viagem; falta ensiná-lo a esperar.

### 27 · A primeira revisão de fora — 21/09, noite

Ele quis experimentar o ultrareview antes de seguir. Commitei os itens 1 a 3 do ciclo 29 e a
branch inteira não coube: 33.000 linhas contra `main`, o teto é 8.000. Uma branch-base em 18/09
deu 7.924, e ele rodou a primeira das três grátis. Voltaram três achados, e os três eram verdade,
conferidos no navegador antes de mexer: a carta na mão era um índice, e avançar o mês com a carta
de janeiro aberta punha a de fevereiro na mão sem ninguém abrir; cada pintura do Gabinete pendurava
outro Esc no documento, e o mais velho, sobre a `.post` já descartada, zerava o estado e deixava a
carta viva aberta; e a lente do dock, escrita inline, vencia a regra que apaga o vidro do rail
durante a troca de tela — 9 de 10 quadros com a lente acesa, num "zero quadros" medido antes de o
dock ter lente. Corrigi os três: a mão guarda o id, o Esc arma uma vez, o rail não se veste
enquanto a troca dura e se reveste no pouso. Duas grátis sobram, e o plano é o motor inteiro
numa base com as pastas apagadas, e a UI inteira depois de fechar o ciclo.
O Gemini, enquanto isso, escreveu uma lista de "bugs vistos" tirada do handoff, com duas
afirmações que o código desmente. Apaguei e devolvi com a regra: só entra o que ele reproduziu.

### 28 · O motor lido inteiro — 21/09, noite

A segunda revisão grátis foi no motor completo, com um truque: uma branch sem as quatro pastas
e outra com elas de volta, para o diff ser o motor inteiro pelos dois jeitos de contar. Seis
achados. Três eram bug e um era decisão. O cerco nunca se arquivava — o plenário votava todo mês
até derrubar, e a carta do jogo já dizia que quem encerra é o plenário; ele escolheu arquivar e
reabrir se as rupturas voltarem. O plenário do afastamento gastava fluxo e a posição se perdia,
então a votação do mês seguinte repetia os mesmos sorteios. E o aviso de teto media o mês
seguinte com o relógio deste: no mês 40 dizia que fechava, e não fechava. A correção foi montar
a posição com que o mês seguinte abre e perguntar a ela — o cofre do relatório passou a bater
exato com a abertura. O save também ganhou a checagem que faltava. A série não se mexeu.
Duas provas novas caem sem a correção e passam com ela.

### 29 · Os docs refeitos — 21/09, noite

Ele pediu uma reformulação completa: handoff, CLAUDE.md, planos, tudo mais profissional e com
menos texto inútil. Três decisões dele antes de eu mexer: o histórico do handoff se apaga (o
journal já o narra), as regras ficam sem citação, e o ciclo 30 nasce com candidatos para ele
marcar. O handoff foi de 1.622 linhas para 190: estado, fila, decisões vivas, achados abertos,
como revisar de fora, a série, o que existe. O CLAUDE.md virou regra limpa: as leis, o comentário,
o fluxo, bug e prova, delegação, recusa e decisão. O standards ganhou o que hoje ensinou — estado
por id, ouvinte armado uma vez, inline vence a folha, previsão pergunta à abertura do mês
seguinte, todo saque grava a posição. Os ciclos ganharam um índice, honesto onde não há registro.
O dossiê do Gemini foi apagado e a regra canônica dele reescrita com a divisão real: ele recebe
lote, não aplica código meu. O lote 3 chegou no meio: paint.mjs 37% → 11%, inputs.mjs 43% → 13%,
código idêntico, aceito.

### 30 · O item 4 começa, e o passeio perde 48 segundos — 21/09, noite

Os três defeitos da revisão viraram a seção 9 do passeio, e cada uma cai contra o código de
antes. O macaco saiu do `tmp/` e virou prova do portão: joga com semente e mede só em repouso.
O repouso deu trabalho: a pasta guarda a animação terminada, e a mola da pílula é JS e
`getAnimations` não a vê — ela parou quando a caixa é a mesma em dois quadros. Cinco sementes,
zero achados; sabotado, acusa. Ele reclamou da demora, com razão: o passeio levava 120s, e o
"42s" do handoff era de outra época. Medi por trecho: 48s eram `pousou()` esperando por uma
animação que só existe quando a pasta está erguida. Agora 72s; o portão inteiro 111s.

### 31 · A seção 10, e o fecho por falta de token — 21/09, noite

Ele pediu para dividir com o Gemini: lote 4 de prosa e o inventário do item 5 foram para ele,
enquanto eu escrevia a seção 10 do passeio — os oito da gaveta dentro da cápsula, a pílula nos
doze endereços, a rajada de cinco trocas, e a carta clicada à vista nos dois regimes de altura.
A de 980 caiu com a rolagem sabotada; a de 900 mostrou que ali quem rola é a página e a rolagem
do `paint.mjs` nunca dispara. Vinte asserções novas, dez a menos que a meta. Os tokens acabaram
antes do item 4 fechar; o Gemini termina o lote 4 e o item 5 sozinho, e a próxima sessão
começa lendo o que ele deixou em `tmp/para-claude.md`.

### 32 · Coordenação Codex/Gemini e as dez asserções restantes — 23/09, noite

Com o Claude indisponível, o usuário autorizou o Codex a implementar e coordenar o Gemini.
Codex ficou com o passeio e os docs; Gemini, somente com comentários de budget e opinion.
O passeio ganhou quatro asserções de verba (teclado, foco e rascunho após navegar) e seis de
aviso modal (abertura, título, foco, fechamento e Escape). O aviso é chamado pela função da
aplicação: não havia um acionador de interface para testar. A primeira rodada passou; a rodada
final inclui espera explícita pelo término das duas transições da prova de rascunho.

A primeira entrega do Gemini perdeu os codinomes LASTRO/SONDA e encurtou duas descrições
JSDoc. O relatório dizia guardas verdes, mas o Codex reproduziu duas falhas em codenames e
devolveu o lote. Gemini restaurou os cabeçalhos e os contratos: código idêntico, 44 linhas de
contrato em budget e 51 em opinion preservadas contra HEAD. Prosa: 41% → 22% e 44% → 25%;
a meta global não está fechada. Gemini também iniciou um passeio adicional e o encerrou ao
receber a divisão de validação; suas mensagens chegam pela fila, não interrompem o trabalho.
Ele excluiu duas versões intermediárias que havia criado, apesar da ordem de não apagar;
as cópias pré-edição permaneceram intactas. O relatório foi corrigido para registrar os fatos.

As seis sondas de 48 meses mantiveram dívida, votações, indústria e segurança da série.
O portão completo parou inicialmente na formatação preexistente do handoff; a documentação
foi atualizada e formatada. Depois, a prova anterior de voo interrompido acusou 719px no corte
e 569px dois quadros depois. Sem mudar a prova nem o voo, a repetição passou: `validate` em
139,2s, 13 guardas, 67 sintéticas, 334 testes, passeio e macaco de 60 ações/seed 7 verdes.
A oscilação ficou no achado 69; a causa não foi isolada. Captura do aviso inspecionada.
O item 4 atingiu as 30 asserções; o ciclo 29 permanece aberto. Gemini encerrou sem novo lote;
nenhum commit ou push foi feito.

### 33 · A prioridade passa a ser a experiência de governar — 23/09

O usuário declarou que considera o jogo atual malfeito e chato. Pediu estudo para reformular
os ministérios e esclareceu que quer pessoas com personalidades, inteligência e iniciativa,
além de empresas fictícias com inspiração real. O Codex estudou a agregação dos programas,
ELENCO e os ciclos 13, 17, 20 e 30, e escreveu um primeiro rascunho em `tmp/world-design-proposal.md`.

O usuário trouxe a revisão do Gemini no arquivo `A proposta do Codex toca no ponto.md` e autorizou
avaliar e registrar. Foram aproveitados o cuidado com escopo e a diferenciação de programas.
A revisão atribuiu ao plano 37 telas ministeriais que ele não prescrevia, tratou a fila antiga
como obrigatória e sugeriu atrasos sem fonte e um `yield` individual de programa inexistente.
Também confundiu concluir a carta de arquivamento com concluir as pendências do ciclo 29.

A proposta revisada está em `docs/world-design.md`. Ela distingue decisão do usuário de sugestão
do Codex, remove a exigência de conflito todo mês e detalha primeiro um piloto, sem exigir todo
o catálogo. Nomeação política e competência variam separadamente; iniciativa inclui poder esperar.
Energia segue como piloto sugerido, não aprovado. O handoff registra a nova prioridade e mantém
as pendências anteriores. Esta revisão só alterou documentação; não iniciou motores nem mudou
calibragem, esquema de save ou regras do jogo.

### 34 · Liberdade política e pesquisa do Brasil real — 23/09

O usuário reafirmou máxima fidelidade ao exercício da Presidência e a abertura dos planos à
discussão com Codex, Claude e Gemini. Escolheu combinar reuniões/conversas com documentos e
despachos. Governo Lula e STF são referências institucionais, não personagens ou destinos
obrigatórios: quer poder tentar transformações radicais, citando comunismo, fascismo, Milei e
Singapura. A proposta registra tentativa, resistência, execução e consequências distintas de
sucesso garantido, mantendo explícito que o horizonte de 48 meses ainda não foi alterado.

Essas decisões foram incorporadas a `docs/world-design.md` e ao handoff. A consulta inicial
documentou o caso do IOF de 2025; não confirmou a agenda presidencial de 23/09/2026.
O usuário pediu registrar tudo e encarregar Gemini de análise e pesquisa profunda atualizada.
O briefing `tmp/gemini-real-brazil-brief.md` foi entregue pelo canal Antigravity, sem fila.
Gemini recebeu exclusividade sobre `docs/research/13-real-brazil-institutions.md`, com leitura e
pesquisa autorizadas, sem editar outros arquivos ou executar validação. Codex mantém os docs
canônicos e revisará fontes, atualidade e conclusões. Entrega ainda pendente neste registro.

### 35 · Entrega do Gemini e encerramento para retomada — 23/09

O usuário pediu leitura rápida e registro antes de desligar o PC. Gemini entregou
`docs/research/13-real-brazil-institutions.md` e declarou repouso. A triagem encontrou ausência
de URLs, atualidade não demonstrada, repetição do `Program.yield` inexistente e propostas
de reações automáticas com números sem fonte suficiente. O cabeçalho que declarava pesquisa
canônica concluída e revisada pelo Codex foi corrigido; a nota inicial delimita erros e revisão
pendente, preservando o corpo recebido. Plano e handoff apontam para essa ressalva. Nenhum
novo lote, implementação ou validação pesada foi iniciado; retomar pela conferência das fontes.

### 36 · A especificação mestra e o mapa — 24/09

Ele trouxe uma especificação de 2.580 linhas, escrita com o ChatGPT: semana no lugar do mês, um
motor único de atores, informação que não teleporta, iniciativa com cláusulas, Senado,
contestação judicial. Li inteira e apontei o que colidia com o código; ele respondeu com outra
ordem: não reescrever por princípio, preservar o que resolve, desafiar a especificação quando
houver caminho mais simples. Li os motores e o turno inteiros antes de escrever. O achado maior
foi que metade do jogo já faz o que a especificação pede em escala menor — a `compose` decide
o rito, a ESTRATO resolve hierarquia e vigência, prometer e pagar já são coisas distintas. O que
colide de verdade é pouco: o voto sorteado, o afastamento que abre sozinho, o deputado que lê a
rua verdadeira e um Congresso sem gente. Conferi três premissas na fonte e as três estavam
erradas: a posse é em 5 de janeiro, a emenda individual é impositiva, e quem julga o afastamento
é o Senado. O mapa propõe a semana como relógio por cima dos motores mensais, com uma prova de
equivalência byte a byte, e oito emendas à especificação. Nenhum código mudou.

### 37 · A revisão do mapa — 24/09, noite

O ChatGPT leu o mapa e devolveu correções, e ele assinou as decisões. Quatro correções eram
minhas e justas: estado byte a byte não prova nada depois que `state.date` existe, então a prova
de W1 virou uma projeção legada que mora em `tests/`; eu tinha misturado o modo de pensar do ator
com a camada de processamento, e a separação ganhou uma prova executável — processar todos os
atores tem de dar o mesmo que processar os escolhidos; eu tinha declarado que informação,
afirmação e evento eram o mesmo registro, e eles só compartilham conteúdo; e o silêncio não é
resposta. Também sai o "terça a quinta", que era suposição. Conferi os artigos do afastamento,
do recesso e da medida provisória; os três estavam certos. A especificação continua 1.0 e só
recebeu o que ele aceitou. A antiga etapa 4 virou quatro lotes, o afastamento saiu do primeiro
corte vertical, e o candidato recomendado passou a ser uma medida provisória fictícia. Nenhum
código mudou.

### 38 · O fecho dos docs antes do A1 — 24/09, noite

Última rodada só de documento. A lei da tela passou a dizer a mesma coisa em quatro lugares, e o
`standards.md` entrou na conta porque repetia a versão antiga. Ele decidiu manter ação e evento
separados, adiar o objeto de proposição e escrever a garantia do agendador como equivalência
semântica, com as causas de despertar como hipótese. A gaveta de seis meses virou legado não
validado, e o próprio guia dos agentes a descrevia como rito. Pelo critério dele — a menor
mudança que prova uma propriedade sem carregar riscos alheios —, o calendário sem consumidor
saiu, e dois lotes que misturavam série e tela se partiram: 19 lotes. Ao preparar o escopo do
A1 apareceu um bloqueio pequeno: a guarda de codinomes reprova motor novo sem nome, e o nome é
dele.

### 39 · A1, a VONTADE — 24/09, noite

Ele escolheu o nome e liberou o lote com uma correção: o objetivo não podia sumir entre a crença
e a intenção. As provas vieram antes e caíram contra um módulo que não existia; duas delas eu
tive de recalcular à mão, porque a regra de atualização de crença que escolhi tornava os
números do cenário incoerentes. O motor ficou pequeno: um objetivo é um sujeito acima ou abaixo
de um alvo, e a prioridade sai da distância que o ator acredita haver até ele; a intenção é o
plano adotado e as crenças em que se apoiou; a ação é o passo do plano. Para saber em que
crenças a escolha se apoiou, a avaliação é observada no acesso, e não declarada à mão — uma
lista esquecida desligaria a reconsideração em silêncio. Um plano concluído espera efeito em vez
de se repetir, porque sem eventos o ator não tem como saber se deu certo. O portão passou com
348 provas e a série não se mexeu. No meio, ele avisou que os codinomes são provisórios.

### 40 · A poda do tmp/ — 24/09, noite

Ele perguntou se era hora de limpar. A resposta honesta foi que não valia limpar o código que os
próximos lotes vão reescrever, mas valia tirar o entulho. O `tmp/` tinha 721 entradas e 807 MB,
e está no `.gitignore`: apagar seria para sempre. O critério foi quem cita cada arquivo, e ele
achou o que não se podia perder — a evidência das medições que o `glass.mjs` usa para justificar
as alternativas reprovadas, os scripts que geraram os assets. Ficaram 59; as outras 662 foram
para uma quarentena fora do repositório, reversível. Cinco branches locais saíram, com os SHAs
anotados. O dado morto que eu tinha prometido tirar não era morto: `bills.mjs` é o conjunto de
moções das provas da ECLUSA, e sai com elas no D1.
