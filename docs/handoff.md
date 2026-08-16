# Retomada

> **Ponto de retomada único do projeto.** Numa sessão sem memória da conversa,
> leia este arquivo e depois `docs/standards.md`. O nome deste arquivo é estável
> de propósito: ponteiro com data envelhece e obriga a mover arquivo.

## ▶ COMECE AQUI — estado em 16/08/2026

**Está tudo verde e nada está pela metade.** Nenhum arquivo ficou num estado
intermediário, nenhuma prova está desligada e nenhum `TODO` foi deixado no código.
`validate`, `walk` e `simulate` rodados no fim.

⚠ **A nona sessão atravessou a virada do dia e continuou.** O que ela entregou, em
ordem: a **tramitação** (ciclo 4 Parte 3), os **ciclos 5 e 6** inteiros, o **ciclo 9**
(a carta pede resposta), a **Parte A do ciclo 7** (o vocabulário), e a **Parte 2 do
ciclo 4** (o muro do caixa e a vinculação). Mais os ciclos 7, 8 e 10 escritos e não
começados.

⚠ **Três coisas são mais fáceis de errar que o resto, e estão sinalizadas abaixo:**
qual tabela de série é a de hoje (há quatro, e três são históricas); que o achado 1d
**deixou de ser um problema fiscal**; e que o ciclo 10 é o centro de cinco documentos.

### Os ciclos, num quadro só

| ciclo                                                                          | estado                                                                                            |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| **4** — a república responde                                                   | Partes 6, 10a, 10b, 1, 5, **3** e **2** feitas. Falta a **queda** (→ ciclo 10), a **4** e a **8** |
| [**5** — a república ganha rosto](cycles/05-a-republica-ganha-rosto.md)        | **inteiro**                                                                                       |
| [**6** — a sala de guerra](cycles/06-a-sala-de-guerra.md)                      | **inteiro** — o item que faltava virou o ciclo 9                                                  |
| [**7** — o Congresso tem cara](cycles/07-o-congresso-tem-cara.md)              | ✔ **Parte A feita**; B e C não começadas                                                          |
| [**8** — o mapa e o rastro](cycles/08-o-mapa-e-o-rastro.md)                    | ⚠ proposta · não começada                                                                         |
| [**10** — quem derruba um presidente](cycles/10-quem-derruba-um-presidente.md) | ⭐ **proposta · é o centro de cinco documentos**                                                  |
| [**9** — a carta pede resposta](cycles/09-a-carta-pede-resposta.md)            | ✔ **FEITO** — o jogador ganhou um verbo na tramitação                                             |

### ▶ O QUE VEM AGORA

**1. ⚠ A onda 2 do [ciclo 10](cycles/10-quem-derruba-um-presidente.md) — e ela fecha o
que a onda 1 deixou aberto**, que é mais importante que começar coisa nova:

- **a rua tem de cansar de quem não entrega** (achado 29). Hoje a SONDA pune o calote
  e o serviço ruim, e não pune a AUSÊNCIA — um governo que nunca prometeu nada nunca
  traiu ninguém. É por isso que o passivo ainda sobrevive;
- **dois dos quatro lobbies nunca se movem** (achado 30) — e dois lobbies decorativos
  numa tela que promete que eles derrubam presidentes é pior que não tê-los.

**2. Recalibrar a tramitação** (achados 22 e 28), com o funil medido antes.

**3. Achado 26** (receita corrente líquida) e **[ciclo 8](cycles/08-o-mapa-e-o-rastro.md)**
(o mapa e o rastro).

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

⚠ **Há outras três tabelas de série neste arquivo, e as três são HISTÓRICAS.** Elas
medem o efeito de uma mudança específica no dia em que ela entrou, e cada uma foi
superada pela seguinte. Estão marcadas onde aparecem. **Calibrar contra qualquer uma
delas seria ajustar o parafuso contra um jogo que não existe mais.**

| política     | dívida/PIB | votações     |
| ------------ | ---------- | ------------ |
| `herdado`    | **83,6%**  | 0 de 0       |
| `agenda`     | 84,4%      | **16 de 32** |
| `base`       | 84,9%      | 18 de 31     |
| `piso`       | 86,8%      | 2 de 24      |
| `explorador` | 87,8%      | 0 de 0       |
| `promessa`   | **89,1%**  | 0 de 3       |

**E a queda, medida em 60 meses** — o critério foi declarado antes: alcançável por um
governo ruim, inalcançável por um mediano.

| governo                   | processo | queda      |
| ------------------------- | -------- | ---------- |
| passivo, não paga ninguém | nunca    | sobrevive  |
| corta tudo e não paga     | nunca    | sobrevive  |
| paga metade               | mês 48   | **mês 49** |
| promete tudo e não honra  | mês 47   | **mês 48** |

⚠ **O achado 1d SOBREVIVE, e agora com causa medida:** o presidente ausente ainda
termina com a melhor dívida do quadro. A causa não é mais o muro do caixa — é a MALHA:
cortar tudo destrói a capacidade do Estado, a capacidade derruba o fator de
arrecadação, e a receita cai junto. Austeridade extrema quebrando a arrecadação é um
fenômeno real; o que continua estranho é **não fazer nada** ser a melhor jogada fiscal.

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
preço, o país tem placar.** O [ciclo 2](cycles/02-tudo-e-uma-alavanca.md) aposentou o
catálogo de pautas prontas — o presidente escreve o orçamento programa a programa
e a pauta é **derivada** do que ele moveu. O
[ciclo 3](cycles/03-a-lei-vira-alavanca.md) fechou quase inteiro: a CORRENTE
existe, Finanças mostra o que ela faz, a Produção virou duas áreas e as faixas
saíram do catálogo para o estado.

> ## ⚠ O NORTE MUDOU na sétima sessão — leia o ciclo 4 antes de retomar
>
> [`cycles/04-a-republica-responde.md`](cycles/04-a-republica-responde.md) é o
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

| verificação        | estado                                                    |
| ------------------ | --------------------------------------------------------- |
| `npm run validate` | **verde de ponta a ponta**                                |
| `npm run check`    | 9 guardas · 36 provas sintéticas · 122 arquivos · verde   |
| `npm test`         | **213 propriedades** · verde (eram 152)                   |
| `npm run simulate` | as seis políticas — ver **A SÉRIE DE HOJE**, no topo      |
| `npm run walk`     | verde — desktop e celular, **e o Gabinete no celular**    |
| `npm run screen`   | verde — 240,4 fps com material × 240,1 sem (ver achado 4) |
| CI                 | GitHub Actions rodando `npm run validate` a cada push     |

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
ter diegese: _"o Planalto deixou de parecer um jogo e assumiu a estética de um SaaS
corporativo... faz você se sentir um contador analisando planilhas"_. Ela virou o
[ciclo 5](cycles/05-a-republica-ganha-rosto.md), com o diagnóstico reescrito e as
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
`cycles/04-a-republica-responde.md`, na seção da Parte 3. Ele foi escrito e
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
Planalto, existem quatro blocos com lealdade e dois limiares. As duas auditorias
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

## Achados abertos — o que EU veria primeiro na próxima sessão

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
projeto é "tudo tem preço, nada tem muro". Em todo lugar do Planalto a pergunta é
_quanto custa_; aqui, e só aqui, ela é _pode?_.

**O desenho da correção está escrito** na Parte 2 do
[ciclo 4](cycles/04-a-republica-responde.md): a receita se divide em três
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
nada pode te derrubar. É o [ciclo 10](cycles/10-quem-derruba-um-presidente.md).

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

**2. O rateio corta quase sempre — e ele DEIXOU DE SER CONSTANTE em 16/08.** Remedido
depois de o muro do caixa cair:

| política  | meses com corte, de 48 | a partir de |
| --------- | ---------------------- | ----------- |
| `herdado` | **41**                 | out/2027    |
| `piso`    | **44**                 | mar/2027    |
| `base`    | 48                     | mar/2027    |
| `agenda`  | 48                     | mar/2027    |

Antes eram **48 em todas as cinco**, e a queixa original era exatamente essa: _"um
corte que nunca some, em nenhuma política, deixa de ser armadilha e vira constante"_.
Duas políticas passaram a ter meses sem corte, o que é a armadilha voltando a ser
armadilha — mas 41 de 48 ainda é quase sempre.

⚠ **E a causa hoje é outra:** com o empenho limitado pelo TETO e não pelo caixa, o
corte deixou de significar "não há dinheiro" e passa a significar "o arcabouço não
autoriza". É uma afirmação fiscal muito mais defensável, e ela entra na recalibragem da
tramitação (achado 22) e não antes.

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

**5. `orphans` e `contrast` seguem por escrever — e a varredura MANUAL de 16/08 mostra
por quê.** Sem guarda, foi preciso caçar à mão e achou-se:

- **201 linhas de CSS morto** — a família `.action-list` / `.action-row` inteira e
  `.allot__read` / `.allot__value`, sem uma linha de HTML para pintar desde que o
  catálogo de pautas foi aposentado;
- **seis `export` sem consumidor** — `stanceOf`, `lawsHtml`, `cabinetStreetHtml`,
  `reportHtml`, `letterHtml` e `OPENING_MONTH`, todos usados apenas dentro do próprio
  arquivo. ⚠ **`export` sem quem importe é uma porta aberta**, e este projeto já pagou
  cinco vezes por porta errada aberta.

Somando com as 299 linhas da nona sessão: **500 linhas** que nenhum seletor alcançava,
achadas por varredura e não por leitura. **Enquanto a guarda não existir, isto volta.**

**7. A calibragem de ECLUSA continua sendo um primeiro chute** — `PIVOT 58`,
`SPREAD 16`, `THREAT_WEIGHT 85`. Agora há três instrumentos para conferir contra
comportamento: o simulador, a tela e o passeio.

**8. `src/data/bills.mjs` é catálogo morto que ainda respira.** As 36 pautas
prontas foram aposentadas pelo orçamento granular, e o arquivo continua no
catálogo porque as suítes do Congresso e das telas montam casos com ele. Ele
precisa virar fixture de teste ou morrer.

**9. ~~A fonte é `system-ui`, provisória.~~ DECIDIDA, e ela não vai mudar.** São três
famílias, todas por pilha de sistema: `--font-display` (sans, o que se mede),
`--font-record` (Georgia e afins, o que se assina) e `--font-machine` (mono, o que a
máquina carimba). **Fonte de webfont foi recusada** — viola zero-build e
zero-dependência de runtime, e troca um bloco de texto por uma requisição que pode
falhar. O que segue aberto é menor e é de pilha: a serifa de sistema varia bastante
entre Windows, macOS e Linux, e ninguém mediu como as três telas de registro se
comportam fora do Windows.

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

**29. A CALDEIRA NÃO RESOLVE O ACHADO 1d SOZINHA — e isto é resultado medido, e não
calibragem frouxa.** O governo passivo continua sobrevivendo, e a causa é legítima:
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

**30. A CALDEIRA ESQUENTA POR DOIS CANAIS DE QUATRO.** Medido: o setor produtivo e as
forças de ordem ficam perto de ZERO em todo governo testado, porque leem índice de
área e o orçamento herdado sustenta os índices. ⚠ **Dois lobbies que nunca se movem são
dois lobbies decorativos** — e a decoração aqui é pior que em qualquer outro lugar,
porque a tela promete que eles derrubam presidentes. Ou o canal deles muda (o que eles
cobram não é o índice, é o CRESCIMENTO dele), ou o decaimento da MALHA precisa morder
mais. Vai junto com o achado 29.

**26. A VINCULAÇÃO INCIDE SOBRE A RECEITA BRUTA, e no mundo real é sobre a CORRENTE
LÍQUIDA.** O art. 198 prende 15% da RCL — depois do que sai para estados e municípios
—, e o modelo ainda tem uma receita só. A consequência está escrita no catálogo e é
conhecida: **as frações deste jogo são menores que as constitucionais porque a base
delas é maior** (a saúde fecha em 8,0% da bruta, e não 15% da líquida). É a metade
"transferência" da Parte 2 do ciclo 4, que **não foi feita**. Consertar exige uma
terceira fatia de receita, e a prova de âncora (`agenda.mjs`) precisa acompanhar.

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

**28. O PRÊMIO DE RISCO SÓ FICA PERCEPTÍVEL DEPOIS DE ~8 p.p. DE DETERIORAÇÃO.** Com
`riskPremium: 0,5`, a dívida a 80% paga **0,01%** e a 89% paga **0,6%**. A progressão é
o desenho — o mercado tolera antes de fugir —, mas a faixa que um mandato de fato
visita é 78%–89%, e nela o prêmio passa quase todo o tempo perto de zero. ⚠ **É
calibragem, e vai junto com o achado 22**: um preço que só morde fora da faixa jogada
é um preço que o jogador nunca sente.

**22. A TRAMITAÇÃO PODE — E PRECISA — SER RECALIBRADA, e agora sem impedimento.**
⚠ **O diagnóstico mudou depois do achado 25**: a `agenda` aprova **4 de 11**, e não 3
de 24. O que parecia tramitação estrangulada era **instrumento quebrado**. O número
atual. Isso pode ser "legislar é caro", que é o efeito
pretendido, ou pode estar estrangulado — e até o ciclo 9 não dava para saber, porque o
jogador não conseguia agir sobre nenhum dos 21 que morriam. ⚠ **E entrou um número novo
na mesma família: `ANSWER_TIME = 2`**, o prazo da pergunta, declarado como primeiro
chute na prosa de `mail.mjs`. O que NÃO é chute está escrito lá: ele tem de ser maior
que um, senão "responder" vira "responder agora" e o prazo não compete com nada.

**23. O PREÇO DE TRAVAR É SÓ O RELÓGIO.** Recusar o relatório devolve o texto à gaveta
com o `writtenAt` intacto — preço real, e talvez barato. Cobrar também na **memória do
relator**, pelo trabalho recusado, seria o preço mais expressivo e exige um canal novo
em ELENCO: `remember` credita por verba prometida e paga, e **uma ofensa não é um
calote**. Se a calibragem do achado 22 mostrar que travar sai de graça, o canal da
ofensa é o lugar certo de mexer.

**24. RÓTULO DE TEXTO NÃO DISTINGUE TEXTO.** Dois projetos escritos em meses diferentes
com o mesmo movimento têm o mesmo rótulo, e a bandeja mostra duas cartas aparentemente
idênticas — visível em `captures/walk-carta-pergunta.png`. Hoje é cosmético; deixa de
ser no dia em que o jogador tiver duas perguntas abertas e precisar escolher entre
elas.

**18. O `explorador` deixou de medir o orçamento.** Com a tramitação ele destrói a
própria base em três meses — promete 100% a todos, o rateio corta, e a memória do
presidente da Câmara vai a −0,44 —, então nada dele chega a votar. Ele continua
sendo uma sonda válida, e agora de outra coisa: **prometer demais mata o governo**.
Para voltar a medir "quebrar o orçamento", que foi o que encontrou o achado 1, ele
precisa **parar de prometer verba**. É mudança de INSTRUMENTO e não de modelo, e por
isso está aqui e não foi feita sozinha.

**20. A RUA PRECIFICA VOTO E MAIS NADA.** A aprovação da SONDA desloca a resistência
da ECLUSA — e para no voto. Ela não toca em índice de área, em receita, em despesa
nem em nada físico: **um governo detestado governa um país que funciona igual.** O
buraco foi apontado de fora e procede; o desenho que veio junto (greve por categoria
profissional, entregue por CASCATA) **não pluga** — a SONDA segmenta por renda, não
por profissão, e CASCATA é só contrato. É um ciclo, e não um conserto. Ver
[`research/03-mecanicas-de-referencia.md`](research/03-mecanicas-de-referencia.md).

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

**17. Dois pontos de quebra convivem sem nada declarar a diferença** — 640px e
720px, mais o 1180px do rail. Lendo os blocos, a intenção existe e é razoável: 720
é o refluxo de tablet e 640 é o colapso de telefone. Mas a atribuição parece
arbitrária (a bancada colapsa em 640, os cartões do Gabinete em 720), e nada
escreve a regra. A peça nova desta sessão — a gente dentro da bancada — foi para
640 **de propósito**, para refluir junto com o pai que a contém; peça aninhada que
quebra antes do pai lê como defeito. Isto é padronização por escrever.

**16. Quatro das cinco ambições do elenco são INERTES.** Só `succession` tem preço
— `successionDrag` em `offered`. `cabinet`, `state`, `court` e `seat` estão
declaradas no catálogo com prosa e não movem nada. A tela passou a mostrá-las como
caracterização (quem a pessoa é), e **só a sucessão leva a consequência escrita ao
lado**, porque é a única que o motor cobra. Elas ganham preço na tramitação e na
queda. Medido de quebra: a distribuição é uniforme em 600 sementes
(20,2/20,2/20,3/20,3/19,0 em 4.200 pessoas) — mas com sete pessoas e cinco
ambições, uma partida pode dar quatro iguais, e a de abertura dá. Não é defeito de
hash; é amostra pequena. Sortear estratificado é decisão de desenho, não conserto.

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

## O que existe

### A tela

**A casca é o Gabinete**, na estrutura do Football Manager 2020: barra superior
fixa com data, quatro sinais vitais e o botão de avançar; sidebar por **poderes e
lugares**, com as oito áreas um nível abaixo em Ministérios. Vidro em três níveis
(`stage` · `action` · `support`) e substrato de aurora em CSS puro. O rail duplo e a
Mesa morreram na sétima sessão.

**Onze telas**: o Gabinete, Congresso & Leis, Finanças, as oito áreas e O Estado.
Dois itens da sidebar seguem desligados **e dizem que estão** — A Rua e Bastidor.

O **Gabinete** é duas colunas: a Caixa de Entrada à esquerda (3fr) e três cartões
empilhados à direita (2fr) — Congresso com o arco em três fatias e legenda, o Cofre
com quem trava o orçamento, e a Rua por classe de renda.

Regras que valem para toda tela nova: **uma lâmina por tela** (os cartões do
Gabinete são a exceção declarada), a tela **pergunta** ao motor em vez de refazer a
conta, número que vai para atributo passa por `attr`, toda view traz o próprio
elemento de fora, e **ausência não é resultado** — com o corolário que a oitava
sessão acrescentou: **ausência declarada não é ausência disfarçada**, e são dois
estados vazios diferentes.

### Os dados (`src/data/`)

Quatro blocos partidários no plano de Nolan com venalidade por eixo; **38
programas** em oito áreas com custo, faixa de abertura, guarda e posição; **6
regras** de propriedade e poder; **7 arquétipos** de gente com o vocabulário de
nomes que os gera (`cast.mjs`, e o ADR 0003 na frente dele); parâmetros fiscais,
macroeconômicos, de opinião, de elenco e do regime; e um validador de esquema que
não conserta nada.

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
- **`tools/simulate.mjs`** — o mandato no terminal, **seis** políticas-sonda. A
  sexta é `explorador`, e ela não governa: derruba todo piso, levanta todo teto,
  gasta o máximo e promete verba cheia, tentando quebrar o orçamento. Foi ela que
  mediu o achado 1. O resumo passou a imprimir o **tamanho do arquivo
  legislativo**, que é o instrumento dos riscos 2 e 8 do ciclo.

### A verificação

Nove guardas com provas sintéticas, **173 propriedades**, e o **passeio**
(`npm run walk`), que usa a tela como se joga e confere console, rolagem, o
controle de alocação, o placar reagindo à verba, a linha de caixa acusando o
estouro, o rito mudando ao furar o piso e a escada de Finanças subindo — em
desktop e em celular.

## O que ainda não existe

- **TEMPORAL, CASCATA, DELTA** — só os contratos;
- **tensão institucional** — decidido que será variável de estado e não motor
  novo: `risco = f(tensão − escudo)`;
- **`orphans` e `contrast`** — as duas guardas seguem por escrever;
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
