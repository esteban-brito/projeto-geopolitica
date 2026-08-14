# ADR 0002 — a IA gera vocabulário, nunca efeito

**Data:** 14/08/2026 · **Estado:** aceita · **Decidido por:** recomendação minha,
aprovada na conversa da sétima sessão.
**Refina:** [ADR 0001 — a IA fica fora do turno](0001-a-ia-fica-fora-do-turno.md).

## Contexto

O ADR 0001 fechou a porta grande — IA não entra em `playMonth` — e deixou uma
aberta, que na época era o uso de maior valor: **geração de catálogo antes do jogo
rodar**, com a saída passando por validador, guardas e revisão humana.

Na sétima sessão o responsável trouxe uma proposta externa que passa exatamente
por essa porta e leva o projeto para o lado errado:

> Gerar **5.000 leis** com um modelo de linguagem, cada uma já com posição
> ideológica, ameaça e impacto fiscal calculados, entregues num `leis.json`. No
> jogo, o jogador busca por texto e recebe a carta pronta. _"Custo zero na hora de
> jogar. 5.000 opções que parecem infinitas."_

A porta do ADR 0001 é estreita demais para distinguir isso de um uso legítimo, e
foi por isso que este ADR existe.

## Decisão

**A IA pode gerar VOCABULÁRIO. Ela não pode gerar EFEITO.**

| ela pode gerar                                         | ela não pode gerar                     |
| ------------------------------------------------------ | -------------------------------------- |
| o nome de uma alavanca e o que a intensidade significa | o custo dela                           |
| a faixa de abertura e a guarda que a protege           | quanto ela move um indicador           |
| a posição no plano `econômico × liberdades`            | a ameaça à máquina, quando calculável  |
| sinônimos e frases de busca que apontam para alavancas | qualquer número que um motor derivaria |

E o critério que separa os dois é único:

> **Se o número pode ser DERIVADO do modelo, ele nunca é gerado. Se ele é uma
> afirmação sobre o mundo que nenhum motor produz, ele é dado — e dado gerado
> entra por validador, guarda e revisão humana, como qualquer outro.**

O custo de um programa não é opinião: ele é a rubrica do orçamento federal, e está
em `programs.mjs` com fonte e data. O impacto fiscal de uma reforma **também não
é**: ele é a conta do piso que caiu, e o ciclo 2 gastou uma parte inteira para
transformá-lo de número digitado em consequência. Voltar a digitá-lo — mesmo que
por um modelo caríssimo, mesmo que 5.000 vezes — é desfazer isso.

## Por que a biblioteca de 5.000 leis é recusada

1. **Ela é o catálogo de pautas prontas, 138 vezes maior.** O ciclo 2 nasceu da
   frase do responsável — _"pauta pronta é uma bosta, onde tem criatividade nisso
   e liberdade?"_ — e a resposta não era ter mais pautas: era não ter pauta
   nenhuma, e derivá-la do que o jogador moveu;

2. **Busca com autocomplete é um menu.** Um campo de texto na frente de uma lista
   finita continua sendo uma lista finita, com a diferença de que agora o jogador
   não consegue nem ver quais são as opções;

3. **O número deixa de ser explicável.** Hoje, quando o jogador arrasta a atenção
   básica, o custo cai da conta: `nível × custo ÷ 12`. Ele pode aprender a regra,
   prever e reusar. Uma carta que diz "−18 bi/ano" porque um modelo escreveu 18
   não tem cadeia causal — e a promessa do jogo é justamente a cadeia causal
   legível;

4. **Número de IA é infalsificável** (razão 4 do ADR 0001, e ela vale aqui com
   mais força ainda): guarda nenhuma, prova nenhuma e teste nenhum alcançam 5.000
   valores que ninguém consegue conferir a mão.

## O que fica valendo, e é bastante

A gramática do [ciclo 4](../cycles/04-a-republica-responde.md) precisa de um
vocabulário grande — trabalho, penal, drogas, armas, costumes, imprensa,
eleitoral, regulação setorial. São centenas de alavancas com faixa, guarda e
posição, e escrevê-las a mão é o gargalo real.

**É aí que a IA entra**, e o produto dela é uma lista de substantivos com faixa e
guarda — nunca uma lista de consequências. Cada item nasce como proposta, passa
pelo validador de esquema, pelas guardas de identidade e nome, e por revisão
humana na calibragem. O jogador nunca fala com modelo nenhum.

**E a busca continua existindo**, com outro papel: em vez de puxar uma carta
pronta, ela **traduz** — "quero acabar com o foro privilegiado" vira a combinação
de cláusulas que isso significa, e o jogador vê a combinação antes de propor. O
ciclo 3 já tinha reservado esse lugar: _"quando a IA entrar, é aqui que ela
entra"_. Ela sugere o texto; o motor cobra o preço.

## Consequência

- `docs/cycles/04-a-republica-responde.md` recusa a biblioteca na análise das
  propostas externas e aponta para cá;
- qualquer arquivo de dado gerado por modelo é **commitado, revisado e datado**, e
  a prosa do arquivo diz que ele nasceu assim — como `programs.mjs` diz de onde
  vieram as rubricas;
- se um dia um número gerado precisar entrar sem derivação possível, ele vira
  decisão explícita num ADR novo, e não um `if` num gerador.
