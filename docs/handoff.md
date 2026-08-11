# Retomada

> **Ponto de retomada único do projeto.** Numa sessão sem memória da conversa,
> leia este arquivo e depois `docs/standards.md`. O nome deste arquivo é estável
> de propósito: ponteiro com data envelhece e obriga a mover arquivo.

## Estado em 11/08/2026

Quarta sessão. **O jogo agora roda um mandato inteiro sem tela nenhuma.** Os dois
motores existentes deixaram de ser peças soltas: eles se acoplam pelo orçamento,
a lealdade decai e responde, e um simulador de terminal produz a série temporal
de 48 meses em milissegundos. Tudo commitado em
`https://github.com/esteban-brito/projeto-geopolitica` (branch `main`).

| verificação        | estado                                                |
| ------------------ | ----------------------------------------------------- |
| `npm run validate` | **verde de ponta a ponta**                            |
| `npm run check`    | 9 guardas · 36 provas sintéticas · verde              |
| `npm test`         | **81 propriedades** · verde (eram 68)                 |
| `npm run simulate` | mandato de 48 meses, quatro políticas                 |
| `npm run screen`   | **não foi rodado nesta sessão** — ver achado 9        |
| fps do material    | 240,3 × 240,3 do controle — medido na sessão passada  |
| CI                 | GitHub Actions rodando `npm run validate` a cada push |

## O que mudou nesta sessão

**ECLUSA ficou inteiro.** Faltava a metade que o handoff anterior cobrava:

- **obstrução** (<50) e **ruptura** (<20) como dois degraus declarados — "a base
  obstrui" e "a base rompeu" são situações políticas distintas, e não dois pontos
  de uma reta;
- **`settle`**, o assentamento mensal da lealdade: decaimento de 1,5, afago de
  12 × verba **paga**, e traição de 25 × o buraco entre prometido e pago. A
  assimetria é o ponto — prometer 1,0 e entregar 0 custa mais do que dois meses
  de afago cheio devolvem.

**O acoplamento está ligado**, em `src/application/turn.mjs` — a camada de
aplicação, que nasceu nesta sessão. A ordem em que ele chama os motores **é** a
mecânica: o teto diz quanto cabe, a promessa é confrontada com o que cabe, e a
votação acontece com a verba **paga**. Prometer não move voto nenhum. Como o
contingenciamento é aritmética e não escolha, existe agora um caminho em que o
governo promete de boa fé, não entrega e perde a base — crise política sem evento
roteirizado, que era o buraco declarado desde a segunda sessão.

**O estado cresceu e virou versão 3**: `loyalty` e `fiscal` são campos
serializados. Save da versão 2 é **recusado**, e a recusa está justificada em
`src/state/save.mjs` — completá-lo com zeros abriria a partida com o Congresso
inteiro em ruptura, que é um estado de jogo válido e portanto indistinguível de
um defeito.

**O catálogo fiscal ganhou duas entradas**: `seatPrice` (0,09 — o câmbio entre os
dois motores, que traduz "verba de 0 a 1" em bilhões) e `initialDiscretionary`
(330, que com a obrigatória forma a âncora do arcabouço).

**`npm run simulate`** roda o mandato sob quatro políticas-sonda.

## Achados fechados

Os itens **2** e **3** da lista anterior deixaram de existir: a lealdade decai, e
emenda paga sai do discricionário com o contingenciamento zerando a entrega.

## Achados abertos — o que EU veria primeiro na próxima sessão

Os quatro primeiros são **medidos**, e o instrumento que os mediu está no repo.

1. **Quatro das seis pautas passam sem um centavo na lealdade de abertura.** Com
   verba zero e lealdade 70, contra os 257 necessários: reforma administrativa
   295, programa habitacional 286, abertura comercial 273, PEC da segurança 259.
   A consequência aparece na simulação — a política `agenda` aprova **5 de 6 nos
   primeiros sete meses** e depois passa 41 meses sem ter o que fazer. O primeiro
   ano do mandato não tem negociação nenhuma. É o achado mais grave da lista;

2. **O fim do foro privilegiado exige lealdade 75, e a partida começa em 70 e
   decai.** Nem com verba cheia ele passa na abertura: só abre se o jogador
   construir lealdade **acima do ponto de partida**. Isso pode ser um bom desenho
   — a pauta que ataca a máquina exige capital político acumulado — mas hoje é
   acidente de calibragem, e não decisão. Vale transformar em decisão;

3. **A dívida não é pressão nenhuma.** Ela CAI em todas as quatro políticas
   (78% → entre 71% e 77%). A causa é conhecida e está declarada: LASTRO não
   cobra juros, porque juros dependem da Selic, que é CORRENTE. Enquanto isso não
   existir, o resultado primário é estruturalmente positivo e a dívida desce
   sozinha. Nenhum número de dívida na tela significa coisa alguma hoje;

4. **A armadilha fiscal fecha tarde, e o decaimento da lealdade é o relógio que
   manda.** Com PIB parado, o contingenciamento chega em abr/2030 na política
   `agenda` e jan/2031 na `parado` — ou seja, no fim do mandato. Já a base sai de
   70 e chega a zero por decaimento puro no mês 47, o que é quase exatamente a
   duração do mandato: coincidência de calibragem, não desenho. Os dois relógios
   precisam ser escolhidos, e não descobertos.
   **O que funciona bem:** aprovar o programa habitacional (−140/ano) antecipa o
   contingenciamento em **11 meses**. A cadeia causal é legível e sai da
   aritmética;

5. **A calibragem de ECLUSA continua sendo um primeiro chute**, como já estava
   declarado: `PIVOT 58`, `SPREAD 16`, `THREAT_WEIGHT 85` e os seis `threat`.
   Agora existe instrumento para conferir contra comportamento de mandato, e não
   só contra testes;

6. **`seatPrice` 0,09 tem razão declarada e nenhuma validação.** Ele saiu de uma
   razão — comprar as 513 cadeiras custa 46,2 e no mês cabem 26,9, então o
   plenário inteiro é inalcançável e há o que escolher. A prova
   `o preco da cadeira traduz verba em bilhoes` em `tests/suites/turn.mjs` cobra
   que continue inalcançável se alguém mexer no número;

7. **O quórum é sempre maioria simples.** O catálogo não carrega o tipo do
   projeto, então a PEC da segurança pública passa por 257 quando deveria exigir 308. É uma linha no esquema de pautas e uma no turno;

8. **A fonte é `system-ui`**, provisória — herdado, não tocado nesta sessão;

9. **`npm run screen` não foi rodado nesta sessão.** `src/state/state.mjs` passou
   a importar o catálogo, o que muda o grafo de módulos que o navegador carrega.
   O que **foi** verificado: o grafo inteiro da tela resolve em Node e as quatro
   views ainda renderizam. O que **não** foi: navegador de verdade, console limpo,
   rolagem horizontal e fps. Rodar é o primeiro passo da próxima sessão que
   tocar na tela;

10. **O benchmark de fps continua não medindo nada** — os dois braços ficam no
    teto de 240 Hz do monitor. Herdado da sessão anterior.

## O que existe

### A tela

Inalterada nesta sessão. Casca com dois rails na estrutura do Football Manager
2020, sistema de vidro em três níveis (`stage` · `action` · `support`), substrato
de aurora em CSS puro, e cinco itens do rail desligados de propósito.

**A tela ainda não sabe nada do que foi construído nesta sessão.** Ela mostra
aprovação e situação — que são andaime — e o botão de turno chama `advanceMonth`,
que é o reducer de andaime. O mandato jogável existe só no terminal.

### Os dados (`src/data/`)

Quatro blocos partidários no plano de Nolan, venalidade **por eixo**, seis pautas
com posição, `threat` e impacto fiscal, parâmetros fiscais com o preço da cadeira,
e um validador de esquema que não conserta nada.

### Os motores

- **LASTRO** (`src/domain/budget/`) — receita do PIB, obrigatória crescendo em
  valor absoluto, teto do arcabouço e gatilho de contingenciamento. Duas
  restrições independentes (caixa e regra) e o menor manda;
- **ECLUSA** (`src/domain/congress/`) — `whipCount` determinístico, `vote` com
  dissidência no dia, `settle` com decaimento, afago e traição. Obstrução e
  ruptura como degraus.

### A composição

- **`src/application/turn.mjs`** — resolve um mês. É onde os dois motores se
  encontram, e onde estão declaradas as três simplificações vivas: quórum único,
  impacto fiscal caindo sempre na despesa obrigatória, e PIB que só anda se quem
  chamar passar a premissa;
- **`tools/simulate.mjs`** — o mandato no terminal, com quatro políticas-sonda.

### A infraestrutura

Fluxo de aleatoriedade contado (o valor é função pura de semente e índice), save
versão 3 que recusa em vez de lançar, nove guardas com provas sintéticas.

## O que ainda não existe

- **TEMPORAL, CASCATA, CORRENTE, SONDA, DELTA** — só os contratos;
- **tensão institucional** — decidido que será variável de estado e não motor
  novo: `risco = f(tensão − escudo)`, o jogador pode ser tão autoritário quanto
  for popular;
- **`orphans` e `contrast`** — precisam de DOM real e de mais de uma tela;
- **`d3-force`** — entra quando DELTA existir, em Worker;
- **GitHub Pages** — decidido ficar só com o CI por enquanto.

## Decisões fechadas que não se reabrem sem pedido

Fase 1 só o Brasil · turno mensal (48 por mandato) · tudo fictício com inspiração
na realidade · inglês no código e português na prosa · seis camadas de estilo ·
codinomes de motor · zero build e zero dependência de runtime (exceção:
`d3-force` vendorizado) · pautas prontas e não vetores livres · lealdade é estado
serializado, não recálculo.

**Fechadas nesta sessão:**

- **motor nenhum chama outro motor.** Quem compõe é a camada de aplicação, e a
  ordem em que ela chama é a mecânica;
- **o Congresso responde ao que foi PAGO**, nunca ao que foi prometido. Ordem
  invertida faria promessa comprar voto, e o orçamento viraria placar;
- **o rateio da falta é proporcional.** O governo não escolhe quem trair quando o
  teto fecha — escolher exigiria uma prioridade que o jogador nunca declarou;
- **a âncora do arcabouço é o TETO que vigorou, e não a despesa realizada.** A
  primeira versão usava o realizado, e a simulação mostrou na hora por que estava
  errado: um governo que gastou pouco via o teto do ano seguinte desabar para o
  próprio gasto — a regra punia a economia. Isso é catraca, não arcabouço.

**Princípio de design:** _tudo tem um jeito de ser feito._ Nenhuma jogada é
bloqueada por regra artificial — o que separa o possível do impossível é o
**preço**. A prova `NENHUMA PAUTA E INVOTAVEL` em `tests/suites/congress.mjs`
existe para cobrar isso. O achado 2 acima é justamente a tensão entre esse
princípio e a calibragem atual: hoje o fim do foro privilegiado é impossível _na
abertura_, e só o preço em lealdade acumulada o abre.

Referências de interface: **Geopolitical Simulator** e **Football Manager 2020**.
Liquid glass é a base do design inteiro, não um efeito de algumas telas.

## Fontes de modelagem

O modelo político-econômico nasceu de um dossiê externo, revisado e corrigido. As
correções estão registradas na prosa de cada arquivo: `src/data/parties.mjs`
(venalidade), `src/data/fiscal.mjs` (despesa obrigatória absoluta),
`src/domain/congress/index.mjs` (as duas parcelas da resistência) e
`src/application/turn.mjs` (a ordem entre orçamento e votação).
