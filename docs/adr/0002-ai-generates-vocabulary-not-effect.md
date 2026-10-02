# ADR 0002 — a IA gera vocabulário, nunca efeito

> **Situação:** aceita. A IA pode escrever vocabulário; nunca um efeito. Quem escreve é o agente que
> trabalha no repositório, nunca uma chamada de API ([ADR 0001](0001-ai-stays-out-of-the-turn.md)).
>
> **Data:** 14/08/2026 · **Decidido por:** o Diretor, por recomendação do Claude, na sétima sessão ·
> **Refina:** [ADR 0001](0001-ai-stays-out-of-the-turn.md)

## Contexto

A ADR 0001 fechou a porta grande, IA no turno, e deixou aberta a geração de catálogo antes de o jogo
rodar, com a saída passando por validador, guardas e revisão.

Na sétima sessão o Diretor trouxe uma proposta externa que passava por essa porta e levava o
projeto para o lado errado:

> Gerar **5.000 leis** com um modelo de linguagem, cada uma já com posição ideológica, ameaça e
> impacto fiscal calculados, num `leis.json`. No jogo, o jogador busca por texto e recebe a carta
> pronta. _"Custo zero na hora de jogar. 5.000 opções que parecem infinitas."_

A porta da ADR 0001 era larga demais para separar isso de um uso legítimo. Esta ADR faz a separação.

## Decisão

**A IA pode gerar vocabulário. Ela não pode gerar efeito.**

| ela pode gerar                                         | ela não pode gerar                     |
| ------------------------------------------------------ | -------------------------------------- |
| o nome de uma alavanca e o que a intensidade significa | o custo dela                           |
| a faixa de abertura e a guarda que a protege           | quanto ela move um indicador           |
| a posição no plano `econômico × liberdades`            | a ameaça à máquina, quando calculável  |
| sinônimos e frases de busca que apontam para alavancas | qualquer número que um motor derivaria |

O critério que separa os dois é um só:

> **Se o número pode ser derivado do modelo, ele nunca é gerado. Se é uma afirmação sobre o mundo
> que nenhum motor produz, é dado, e dado gerado entra por validador, guarda e revisão humana, como
> qualquer outro.**

O custo de um programa não é opinião: é a rubrica do orçamento federal, em `programs.mjs`, com fonte
e data. O impacto fiscal de uma reforma também não é: é a conta do piso que caiu, e o ciclo 2 gastou
uma parte inteira para transformá-lo de número digitado em consequência.

## Por quê

A biblioteca de 5.000 leis foi recusada por quatro razões:

1. **Ela é o catálogo de pautas prontas, 138 vezes maior.** O ciclo 2 nasceu da frase do Diretor,
   _"pauta pronta é uma bosta, onde tem criatividade nisso e liberdade?"_, e a resposta não era ter
   mais pautas: era derivá-las do que o jogador moveu.
2. **Busca com autocompletar é um menu.** Um campo de texto na frente de uma lista finita continua
   sendo uma lista finita, e agora o jogador nem vê as opções.
3. **O número deixa de ser explicável.** Quando o jogador arrasta a atenção básica, o custo sai da
   conta `nível × custo ÷ 12`, e ele pode aprender a regra. Uma carta que diz "−18 bi/ano" porque um
   modelo escreveu 18 não tem cadeia causal.
4. **Número de IA é infalsificável** (razão 4 da ADR 0001): guarda, prova e teste nenhum alcançam
   5.000 valores que ninguém consegue conferir à mão.

## Onde a IA entra

A gramática do [ciclo 4](../archive/cycles/04-the-republic-responds.md) precisa de um vocabulário
grande: trabalho, penal, drogas, armas, costumes, imprensa, eleitoral, regulação setorial. São
centenas de alavancas com faixa, guarda e posição, e escrevê-las à mão é o gargalo real.

O produto da IA é uma lista de substantivos com faixa e guarda, nunca uma lista de consequências.
Cada item nasce como proposta e passa pelo validador de esquema, pelas guardas e pela revisão na
calibragem.

A busca continua existindo, com outro papel: em vez de puxar uma carta pronta, ela traduz "quero
acabar com o foro privilegiado" na combinação de cláusulas que isso significa, usando os sinônimos e
as frases escritos fora do jogo, e o jogador vê a combinação antes de propor. A busca sugere o texto;
o motor cobra o preço.

## Consequências

- o [ciclo 4](../archive/cycles/04-the-republic-responds.md) recusa a biblioteca na análise das
  propostas externas e aponta para cá;
- todo dado escrito por IA é commitado, revisado e datado, e o arquivo diz que nasceu assim, como
  `programs.mjs` diz de onde vieram as rubricas;
- um número gerado que precise entrar sem derivação possível vira ADR nova, e não um `if` num
  gerador.

## Emendas

### 01/10/2026 — a busca sem modelo em tempo de jogo

Com a emenda de 29/09 da ADR 0001, a tradução da busca não chama modelo nenhum durante a partida:
ela usa os sinônimos e as frases de busca que a IA escreveu fora do jogo e que a revisão aprovou.
