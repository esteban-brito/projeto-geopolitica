# ADR 0003 — o mundo é real, as pessoas são inventadas

**Data:** 14/08/2026 · **Estado:** aceita · **Decidido por:** o responsável, ao
escolher os atores do [ciclo 4](../cycles/04-the-republic-responds.md): _"porém
nomes fictícios sempre, inspirados em pessoas reais"_.

## Contexto

O ciclo 4 põe **gente** no jogo. Até aqui o jogo negociava com quatro blocos
partidários abstratos; a partir dele existem o presidente da Câmara, o relator, os
líderes, ministros do STF, governadores e editores de veículo — pessoas com
ambição própria, memória do que foi feito com elas, e mandato que começa e acaba.

A pergunta que isso abre é imediata: essas pessoas têm nome de quem?

E ela chega num projeto que caminhou na direção **oposta** com os dados. Desde o
ciclo 2 os números são reais, citados e datados — R$ 982,5 bi do RGPS, 15% da RCL
para a saúde, R$ 40 bi por ponto de Selic. O catálogo deixou de dizer "ficção com
inspiração na realidade" e passou a citar fonte.

## Decisão

> **Toda pessoa do jogo é fictícia.** Nome inventado, arquétipo reconhecível,
> inspiração na realidade — e **nunca** a identidade de alguém que existe ou
> existiu.

O contraste com os dados é deliberado, e vale como formulação curta da postura do
projeto: **o mundo é real; as pessoas são inventadas.** Um jogo com o orçamento
verdadeiro e gente de mentira é honesto. O contrário — orçamento inventado e gente
real — seria os dois defeitos ao mesmo tempo.

Vale para todo personagem nomeado: parlamentar, ministro de Estado, ministro de
tribunal, governador, jornalista, sindicalista, empresário, militar. Vale também
para **organizações que agem como personagem** — veículo de imprensa, central
sindical, federação empresarial, **empresa** —, que ganham nome próprio inventado em
vez de carregarem a marca de uma organização real. Uma empresa identificável no jogo
tem nome fictício; setor, porte e números de referência podem ser reais, com fonte e
ano-base.

**O que continua real:** rubricas do orçamento, regras fiscais, quórum, número de
cadeiras, calendário eleitoral, indicadores macroeconômicos, e os arquétipos
políticos — "centrão", "bancada ruralista", "bancada evangélica" descrevem
fenômenos, e não pessoas.

## Por quê — e as duas razões pesam igual

**1. Um jogo em que se corrompe, chantageia e derruba gente não pode fazer isso com
gente que existe.** A mecânica central do jogo é comprar voto, quebrar
promessa, medir venalidade e explorar ambição. Atribuir isso a uma pessoa real é
uma afirmação sobre ela que nenhum motor sustenta — e é exatamente a regra que
governa os números do projeto, aplicada a pessoas. O catálogo pode dizer que um
deputado fictício de arquétipo centrão cobra caro por um voto; não pode dizer isso
de ninguém.

**2. Personagem gerado é personagem que muda de partida para partida.** Um elenco
fixo com nomes conhecidos seria decorado em duas partidas, e a terceira viraria
execução de roteiro. Gerado da semente, cada mandato tem um Congresso diferente —
e continua **reprodutível**, que é a regra que sustenta o save, o simulador de 48
meses e a calibragem.

Há uma terceira razão, menor e prática: nomes reais envelhecem. Um jogo com o
Congresso de 2026 estaria errado em 2027, e a correção seria eterna.

## Consequência

- o gerador de elenco vive em `src/data/` (listas de nomes e arquétipos) e é
  consumido por um gerador **determinístico**, alimentado pela semente da partida —
  como todo sorteio do projeto;
- **nenhum nome real de pessoa entra no catálogo.** Não há guarda executável
  honesta para isso — uma lista de nomes proibidos seria incompleta por definição —,
  então ele fica como regra declarada em `CLAUDE.md` e cobrada em revisão. Está
  registrado em `docs/standards.md` §7, entre o que **não** tem guarda;
- a semelhança com pessoas reais é de **arquétipo**, e o jogo pode e deve ser
  reconhecível: o presidente da Câmara que engaveta pedido de impeachment em troca
  de espaço no governo é um personagem verdadeiro sobre a política brasileira sem
  ser uma afirmação sobre ninguém;
- se um dia o jogo quiser citar uma figura histórica encerrada — um presidente do
  século passado, num texto de contexto —, isso vira decisão explícita num ADR
  novo, e não uma exceção informal.

## Emenda — 24/09/2026

Por decisão do responsável, "empresa" passou a constar da lista de organizações que agem
como personagem. A regra não mudou; ficou explícita para as empresas que a especificação
mestra modela com agência própria.
