# Ciclo 12 — o jogo olha para frente · ⚠ PROPOSTA, NÃO COMEÇADA

> Escrito em 24/08/2026, a pedido dele — _"qual a próxima grande etapa na sua opinião?"_ —
> e a resposta saiu de duas medições feitas antes de opinar, não de leitura.
>
> ⚠ **NADA AQUI FOI IMPLEMENTADO E NADA FOI ACORDADO.** Ele foi escrito para não se perder
> enquanto um dossiê externo é avaliado.
>
> ⚠ **E ELE CORRIGE UMA AFIRMAÇÃO MINHA, feita duas horas antes de medir:** eu disse que
> _"o país é quase inerte"_ e repeti o achado 49 como se fosse verdade corrente. **Está
> errado**, e o achado 52 já tinha corrigido metade disso. A medição abaixo corrige o resto.

## A medição que produziu este ciclo

`tmp/velocidade.mjs` — concentra TUDO numa área (todos os programas dela a 100, todos os
outros no piso) por 48 meses, e compara com um governo que não toca em nada.

| área              | diferença ao fim | maior delta mensal | 1 ponto visível em |
| ----------------- | ---------------- | ------------------ | ------------------ |
| Segurança         | **+60,9**        | 2,38               | mês 1              |
| Indústria e Infra | **+51,9**        | 1,95               | mês 1              |
| Agricultura       | +13,3            | 0,61               | mês 2              |
| Saúde             | +8,9             | 0,40               | mês 3              |
| Educação          | +3,7             | 0,20               | mês 6              |
| Defesa            | +3,5             | 0,22               | mês 7              |
| Fazenda           | +3,1             | 0,12               | mês 9              |
| Previdência       | **+0,7**         | 0,06               | mês 22             |

**O país responde. O que ele não faz é responder por igual — o fator entre as pontas é 87×.**

⚠ **E A FORMA DA CURVA CARREGA A MECÂNICA MAIS PROFUNDA DO JOGO, que ninguém consegue ver:**
Agricultura sobe a 75,8 no mês 24 e **cai a 71,3** no 48. Fazenda, Previdência, Educação e
Defesa fazem o mesmo. Concentrar numa área derruba as outras, a capacidade derrubada derruba
a receita, e a receita derrubada derruba a área que estava sendo alimentada. **O cobertor
curto existindo como aritmética, e não como frase.**

## O diagnóstico, e ele não é de motor

> **Toda leitura do jogo tem horizonte de UM mês, e toda decisão paga em 12 a 48.**

A tela de área projeta um mês: ela imprime `61 → 61`. Numa área que anda **0,40 por mês**,
essa leitura é **matematicamente incapaz** de mostrar a decisão que o jogador acabou de
tomar. A tendência olha para trás. A faísca olha para trás. **Nada no jogo olha para frente
além de trinta dias.**

O jogador arrasta 38 controles, avança o mês e não vê nada — não porque nada aconteceu, mas
porque a única janela que a tela oferece é pequena demais para o efeito caber dentro dela.

⚠ **E O PROJETO JÁ SABIA A METADE DISSO SEM LIGAR OS PONTOS.** O achado 52 registra: _"o país
premia COMPROMISSO SUSTENTADO e pune rotação. Nenhuma tela do jogo diz isso ao jogador, e é a
regra mais importante que ele precisaria saber."_ A causa de ninguém dizer é esta: não há
peça na interface capaz de dizer, porque nenhuma alcança o mês 12.

> **É o ciclo 5 outra vez, e a frase dele vale sem trocar uma palavra: _"motor que o jogador
> não vê não é profundidade — é custo."_** Só que desta vez o que ele não vê não é uma pessoa,
> é o TEMPO.

## O que é, e o que NÃO é

**É:** rodar `playMonth` para frente, com as ordens do jogador congeladas, sobre uma cópia do
estado, e desenhar a série que sai.

**Não é** mecânica nova, número novo, motor novo, nem campo novo no save. É a mesma função que
o turno vai executar, perguntada com um horizonte maior — que é literalmente a doutrina da
casa: _"a tela pergunta ao motor, e não refaz a conta"_.

⚠ **E O CUSTO FOI MEDIDO ANTES DE PROPOR**, porque é o único risco técnico real:

| horizonte | custo  |
| --------- | ------ |
| 1 mês     | 0,8ms  |
| 6 meses   | 1,9ms  |
| 12 meses  | 3,0ms  |
| 24 meses  | 5,3ms  |
| 48 meses  | 10,3ms |

**24 meses custam 5,3ms.** Cabe num quadro com folga. O arrasto já repinta só as leituras
(`refresh`), então a projeção entra onde a leitura já entra.

## O plano

### Parte A — `trajectory` na camada de aplicação

A décima sexta porta da fachada. Recebe o estado, as ordens e um horizonte; devolve as séries
que a tela desenha.

- ⚠ **ELA É `outlook` COM HORIZONTE, e não uma peça nova.** `outlook` já projeta UM mês com e
  sem as ordens do jogador, e já resolve o defeito de a tela refazer a conta — ela é a sétima
  ocorrência da família mais cara daqui, e a correção dela é o molde;
- **duas curvas, sempre**: _mantendo isto_ e _sem tocar em nada_. Uma curva sozinha não diz
  se o movimento é do jogador ou do mundo, e é essa distinção que o contrafactual do `outlook`
  já existe para dar;
- ⚠ **ELA É DETERMINÍSTICA POR CONSTRUÇÃO, e isso precisa ser dito**: a projeção roda sobre
  uma cópia do estado, com a mesma semente e os mesmos saques. As mesmas ordens dão sempre a
  mesma curva; mexer num controle muda a curva, que é o ponto. **E ela não pode tocar o fluxo
  real** — o estado projetado é jogado fora.

### Parte B — a tela de área passa a mostrar a trajetória

Onde hoje se lê `61 → 61`, passa a ler a curva de 24 meses com o contrafactual ao lado.

⚠ **É AQUI QUE AS SEIS ÁREAS MUDAS PARAM DE MENTIR.** O rail promete oito alavancas e o
modelo entrega duas: Previdência anda **0,7 ponto em 48 meses**. Com a trajetória, ela mostra
`71 → 71 em 24 meses` e o jogador **aprende a regra real** — aquela área é lei, não é caneta.
**Isso é honestidade de interface, e não conserto de motor**: o modelo está certo, um
presidente não move cobertura previdenciária com discricionário. Quem promete demais é a tela.

### Parte C — a dívida e o risco de queda ganham horizonte

Finanças mostra dívida/PIB projetada; a Trindade mostra para onde as três rupturas vão.

⚠ **A TRINDADE É A DE MAIOR VALOR E A DE MAIOR RISCO.** Ela é a leitura que decide a partida,
e uma projeção ali diria _"o processo abre no mês 41 se você mantiver isto"_ — que é a
informação mais valiosa do jogo inteiro. **Mas ela também é a que mais pode virar profecia**:
uma curva que anuncia a queda pode fazer o jogador jogar contra o gráfico em vez de contra o
país. **Decidir depois de A e B estarem na tela, e não antes.**

## O que ele RECUSA, e por quê

- ⛔ **recalibrar as seis áreas mudas.** É o achado 53: a reformulação substitui exatamente o
  modelo que seria ajustado, e o segundo giro apaga o primeiro. E provavelmente estaria
  errado — o modelo está descrevendo o Brasil corretamente;
- ⛔ **tutorial ou onboarding antes disto.** Ensina a operar um painel cujos mostradores não se
  movem. A curva é o onboarding: ninguém precisa explicar "compromisso sustentado" quando a
  linha despenca ao trocar de foco no mês 12;
- ⛔ **mais cartas que perguntam.** O achado 37 é real, mas perguntar sobre um mundo cujas
  respostas o jogador não enxerga é acrescentar voz a um interlocutor invisível.

## O que ele NÃO resolve, declarado

- **o jogo continua com uma espécie de carta que pergunta em doze.** Achado 37/48;
- **a dívida continua terminando em ~90% faça o que fizer.** Achado 49;
- **quatro dos cinco indicadores de Finanças continuam sem se mover.** Achado 47 — e a
  trajetória vai tornar isso MAIS visível, não menos. É bom: transforma um achado em algo que
  o jogador vê, e força a decisão;
- **e a pergunta de desenho que fica aberta é a maior do projeto:** _qual velocidade este jogo
  quer ter?_ Hoje ela é consequência aritmética de uma identidade calibrada área por área, e
  **ninguém escolheu**. A trajetória não decide isso — ela é o instrumento que torna a escolha
  visível pela primeira vez, com a curva na tela.

## As ferramentas desta análise moram em `tmp/`, que o git ignora

- `tmp/velocidade.mjs` — as duas tabelas acima: quanto uma área anda concentrando tudo nela,
  e em quantos meses o jogador vê um ponto de diferença contra não fazer nada;
- `tmp/censo-tipo.mjs` — o censo de família × tamanho × peso das onze telas, com o nome da
  peça atrás de cada combinação;
- `tmp/quem-foge.mjs` — quem cai fora dos degraus declarados da escala.
