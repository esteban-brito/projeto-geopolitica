# Retomada

> **Ponto de retomada único do projeto.** Numa sessão sem memória da conversa,
> leia este arquivo e depois `docs/standards.md`. O nome deste arquivo é estável
> de propósito: ponteiro com data envelhece e obriga a mover arquivo.

## Estado em 13/08/2026

Quinta sessão. **O jogo saiu do terminal.** A Mesa e as seis áreas existem, são
navegáveis, e um mês inteiro se decide com o mouse: escolher a ação, comprar
bancada, alocar verba, avançar. O que a tela mostra enquanto o jogador decide sai
das **mesmas funções** que o turno vai executar — nenhuma conta é refeita por
fora.

| verificação        | estado                                                           |
| ------------------ | ---------------------------------------------------------------- |
| `npm run validate` | **verde de ponta a ponta**                                       |
| `npm run check`    | 9 guardas · 36 provas sintéticas · 75 arquivos · verde           |
| `npm test`         | **105 propriedades** · verde (eram 81)                           |
| `npm run simulate` | mandato de 48 meses, quatro políticas-sonda                      |
| `npm run screen`   | **rodado** · console limpo nos três viewports, sem rolagem       |
| fps do material    | 240,3 × 226,5 do controle — os dois no teto de 240 Hz do monitor |
| `npm run walk`     | **novo, e verde** — a tela usada como se joga                    |
| CI                 | GitHub Actions rodando `npm run validate` a cada push            |

## O que mudou nesta sessão

**A tela virou o jogo.** `app.mjs` deixou de despachar `advanceMonth` de andaime e
passa a chamar `playMonth`. O rail lista as **áreas de governo**, e não motores:
quem quer mexer na saúde entra em Saúde, e o instrumento — lei, emenda, caneta —
virou etiqueta na linha da ação.

**A Mesa** mostra a pauta, as quatro bancadas com humor e controle de verba, e o
resumo: `312 ± 14 · precisa de 257`. A **banda** é a peça mais importante dessa
tela — `312` sozinho afirma um placar que o motor não promete, e o jogador que
confia nele aprende a desconfiar da tela na primeira derrota por três votos.

**A área** tem os três verbos na ordem do custo de executar: alocar não precisa de
ninguém, pautar precisa do Congresso, vigente já foi decidido e só cobra. A linha
que a faz virar decisão é `R$ 26,9 bi disponíveis · R$ 18,1 bi já prometidos às
outras áreas` — sem ela seriam seis controles independentes.

**`settlement` nasceu**, e é o que impede a tela de mentir: a previsão da Mesa
vota com a verba que o caixa **honra**, e não com a prometida. Enquanto a promessa
cabe no mês as duas são a mesma coisa; quando estoura, a Mesa anunciava um placar
que o turno não produzia — e podia dizer "acima do quórum" numa votação que o
rateio derrubava.

**O que já está em vigor não volta à pauta.** A sessão passada tinha uma guarda na
lista do estado, que se recusava a guardar o mesmo id duas vezes. Ela resolvia só
o sintoma visível: o mês continuava votando, o índice da área subia de novo e o
**impacto fiscal era somado outra vez**. Uma reforma aprovada seis vezes cobrava
seis, com a lista mostrando uma linha só. A recusa agora é da ordem inteira, e a
prova falha se alguém a remover.

**Três defeitos que só a tela em uso mostrou**, e por isso `npm run walk` existe:

- o controle de alocação abria no **meio** de uma faixa de 0 a 100. `max="25,04"`
  com vírgula é valor inválido, e o navegador descarta o atributo em silêncio.
  Node não lê atributo — nenhuma prova de unidade podia ver. Agora existe `attr`,
  e `tests/suites/screens.mjs` confere todo atributo numérico de toda tela;
- a legenda das colunas se sobrepunha: cabeçalho e linha mediam colunas em `ch`
  com fontes de tamanhos diferentes, então `10ch` valia 55px numa e 85px na outra;
- a coluna dizia **despesa/ano** e mostrava o sinal do **resultado**. No catálogo,
  positivo poupa — então `−48` aparecia como corte de gasto, sendo gasto novo.

**A folha do dashboard virou três**, como a prosa dela mesma mandava: `40-shell`
(a casca e o substrato, agora de todas as telas), `50-screen-mesa`,
`60-screen-area`. A aprovação ficou estacionada em `70-screen-approval`, com a
razão escrita: quem a produz é SONDA, que não existe, e um indicador congelado em
31% ao lado de controles que funcionam ensina a desconfiar da tela inteira.

## Achados fechados

Os itens **7** (quórum sempre maioria simples) e **9** (`npm run screen` não
rodado) deixaram de existir. O quórum sai do instrumento — 257 para lei, 308 para
emenda, zero para caneta — e a tela foi medida em navegador de verdade.

## Achados abertos — o que EU veria primeiro na próxima sessão

Os quatro primeiros são **medidos nesta sessão**, e os dois primeiros são graves.

1. **O catálogo inteiro passa.** Na política `promessa`, **26 votações e 26
   aprovações** — as 36 ações do catálogo viram realidade em 48 meses. Na
   `agenda`, 35 de 36. Um mandato em que dá para aprovar tudo não tem escassez de
   capital político, só de dinheiro e de meses. Na abertura, **13 das 26 pautas
   votáveis passam sem um centavo**, e só uma não passa nem com verba cheia;

2. **Fazer tudo é fiscalmente MELHOR do que não fazer nada, e isso inverte a
   tensão do jogo.** `parado` termina com dívida em **79,5%** e 18 meses de
   contingenciamento; `agenda`, que aprova 35 pautas, termina em **59,5%** e
   nenhum mês de aperto. A armadilha fiscal está punindo a inação e premiando a
   agenda cheia. A causa é conhecida e some quando CORRENTE existir — LASTRO não
   cobra juros —, mas o desenho precisa ser escolhido, e não descoberto;

3. **O fim do foro privilegiado é a única pauta impossível na abertura**: 251
   votos com verba cheia contra 257 exigidos. Pode ser bom desenho — a pauta que
   ataca a máquina exige capital acumulado —, mas continua sendo acidente de
   calibragem e não decisão;

4. **A calibragem de ECLUSA continua sendo um primeiro chute** — `PIVOT 58`,
   `SPREAD 16`, `THREAT_WEIGHT 85`. Agora há dois instrumentos para conferir
   contra comportamento: o simulador e a tela;

5. **A aprovação não existe na tela**, e é a peça que falta para o mês fechar como
   ciclo. Ela volta com SONDA. A view e os estilos estão estacionados juntos, de
   propósito: separá-los faria o retorno vir sem forma;

6. **A lista de ações deveria ser uma tabela de verdade.** Hoje ela é `<ul>` com
   grade, e a legenda das colunas é um parágrafo antes da lista — quem lê por
   leitor de tela ouve `308 · −140 · +8` sem cabeçalho por célula. `<table>` com
   `<th>` resolve, e é a próxima versão dessa lista;

7. **`tools/simulate.mjs` guarda a própria memória do que passou** (`memory.passed`),
   e agora isso duplica `state.enacted`. Duas fontes para o mesmo fato;

8. **A fonte é `system-ui`**, provisória — herdado, não tocado nesta sessão;

9. **O benchmark de fps continua não medindo nada** — os dois braços batem no teto
   de 240 Hz do monitor. Herdado.

## O que existe

### A tela

Casca com dois rails na estrutura do Football Manager 2020, vidro em três níveis
(`stage` · `action` · `support`), substrato de aurora em CSS puro. **Sete telas**:
a Mesa e as seis áreas. Dois itens do rail seguem desligados de propósito —
Opinião e Rede têm contrato de motor e nenhuma tela.

Regras que a sessão fixou e que valem para toda tela nova: **uma lâmina por
tela**, a tela **pergunta** ao motor em vez de refazer a conta, número que vai
para atributo passa por `attr`, toda view traz o próprio elemento de fora, e
**ausência não é resultado** — sem pauta não há placar nem veredito colorido.

### Os dados (`src/data/`)

Quatro blocos partidários no plano de Nolan, venalidade por eixo, **36 ações** em
seis áreas com instrumento, posição, `threat` e impacto fiscal, parâmetros fiscais
com o preço da cadeira, e um validador de esquema que não conserta nada.

### Os motores

- **LASTRO** (`src/domain/budget/`) — receita do PIB, obrigatória crescendo em
  valor absoluto, teto do arcabouço e gatilho de contingenciamento;
- **ECLUSA** (`src/domain/congress/`) — `whipCount` determinístico, `vote` com
  dissidência no dia, `settle` com decaimento, afago e traição, `dispersion` para
  a banda da previsão. Obstrução e ruptura como degraus declarados;
- **MALHA** (`src/domain/capacity/`) — índices por área, decaimento, rendimento da
  alocação e a pressão que volta para receita e despesa.

### A composição

- **`src/application/turn.mjs`** — `settlement` (o rateio, que a tela consulta) e
  `playMonth` (o mês, que o botão executa);
- **`src/public/index.mjs`** — a fachada: a única porta do entrypoint, e a guarda
  `boundaries` prova que ele não alcança domínio nem aplicação por fora dela;
- **`tools/simulate.mjs`** — o mandato no terminal, quatro políticas-sonda.

### A verificação

Nove guardas com provas sintéticas, 105 propriedades, o custo do material medido
com GPU (`npm run screen`) e o **passeio** (`npm run walk`), que usa a tela como
se joga e confere console, rolagem, o controle de alocação, o placar reagindo à
verba, a linha de caixa acusando o estouro e a lei aprovada aparecendo em vigor —
em desktop e em celular.

## O que ainda não existe

- **TEMPORAL, CASCATA, CORRENTE, SONDA, DELTA** — só os contratos;
- **tensão institucional** — decidido que será variável de estado e não motor
  novo: `risco = f(tensão − escudo)`;
- **`orphans` e `contrast`** — a condição que os adiava caiu (há sete telas e DOM
  real), e o que entrou no lugar foi o passeio. As duas guardas seguem por
  escrever;
- **`d3-force`** — entra quando DELTA existir, em Worker;
- **GitHub Pages** — decidido ficar só com o CI por enquanto.

## Decisões fechadas que não se reabrem sem pedido

Fase 1 só o Brasil · turno mensal (48 por mandato) · tudo fictício com inspiração
na realidade · inglês no código e português na prosa · seis camadas de estilo ·
codinomes de motor · zero build e zero dependência de runtime (exceção:
`d3-force` vendorizado) · pautas prontas e não vetores livres · lealdade é estado
serializado · motor nenhum chama outro motor · o Congresso responde ao que foi
PAGO · o rateio da falta é proporcional · a âncora do arcabouço é o TETO que
vigorou.

**Fechadas nesta sessão:**

- **a tela não refaz conta do motor — ela pergunta.** Conta refeita por fora
  diverge, e diverge justamente no caso extremo, que é o caso em que o jogador
  precisava do número;
- **a previsão usa o que será pago, nunca o prometido.** É a mesma regra do
  acoplamento, vista do lado da interface;
- **o rail lista áreas de governo**, e não motores nem instrumentos. Um menu de
  motores tem formato de código; um de instrumentos obriga a saber o rito antes
  de achar o assunto;
- **escolher uma ação leva à Mesa.** A área é onde se escolhe; a Mesa é onde se
  negocia — emendar sem ver o placar seria negociar no escuro;
- **o rascunho morre com o mês.** Carregar a verba do mês passado para o próximo
  faria o jogador pagar de novo sem ter decidido.

**Princípio de design:** _tudo tem um jeito de ser feito._ Nenhuma jogada é
bloqueada por regra artificial — o que separa o possível do impossível é o
**preço**. A prova `NENHUMA PAUTA E INVOTAVEL` em `tests/suites/congress.mjs`
existe para cobrar isso, e o achado 3 acima é a tensão viva entre esse princípio
e a calibragem atual.

Referências de interface: **Geopolitical Simulator** e **Football Manager 2020**.
Liquid glass é a base do design inteiro, não um efeito de algumas telas.

## Fontes de modelagem

O modelo político-econômico nasceu de um dossiê externo, revisado e corrigido. As
correções estão registradas na prosa de cada arquivo: `src/data/parties.mjs`
(venalidade), `src/data/fiscal.mjs` (despesa obrigatória absoluta),
`src/domain/congress/index.mjs` (as duas parcelas da resistência) e
`src/application/turn.mjs` (a ordem entre orçamento e votação).
