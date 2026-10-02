# ADR 0003 — o mundo é real, as pessoas são inventadas

> **Situação:** aceita. Toda pessoa do jogo tem nome inventado. Os papéis que pesam no 1º ano se
> inspiram em quem ocupa o cargo de verdade (papel, ideologia, temperamento), nunca no nome nem na
> história; o nome real só aparece em `docs/research/`.
>
> **Data:** 14/08/2026 · **Decidido por:** o Diretor, ao escolher os atores do
> [ciclo 4](../archive/cycles/04-the-republic-responds.md): _"porém nomes fictícios sempre,
> inspirados em pessoas reais"_ · **Emendas:** 24/09/2026 e 01/10/2026

## Contexto

O ciclo 4 pôs **gente** no jogo. Até ali o jogo negociava com quatro blocos partidários abstratos; a
partir dele existem o presidente da Câmara, o relator, os líderes, ministros do STF, governadores e
editores de veículo, pessoas com ambição própria, memória do que foi feito com elas e mandato que
começa e acaba.

A pergunta era imediata: essas pessoas têm nome de quem? E ela chegou num projeto que já tinha ido
na direção oposta com os dados: desde o ciclo 2 os números são reais, citados e datados (R$ 982,5 bi
do RGPS, 15% da RCL para a saúde, R$ 40 bi por ponto de Selic).

## Decisão

> **Toda pessoa do jogo é fictícia.** Nome inventado, arquétipo reconhecível, inspiração na
> realidade, e **nunca** a identidade de alguém que existe ou existiu.

O contraste com os dados é deliberado: **o mundo é real; as pessoas são inventadas.** Um jogo com o
orçamento verdadeiro e gente de mentira é honesto; orçamento inventado e gente real seriam os dois
defeitos ao mesmo tempo.

Vale para todo personagem nomeado: parlamentar, ministro de Estado, ministro de tribunal,
governador, jornalista, sindicalista, empresário, militar. Vale também para **organizações que agem
como personagem** (veículo de imprensa, central sindical, federação empresarial, empresa), que
ganham nome inventado em vez da marca de uma organização real. Setor, porte e números de referência
podem ser reais, com fonte e ano-base.

Continua real o que descreve o mundo, e não pessoas: rubricas do orçamento, regras fiscais, quórum,
número de cadeiras, calendário eleitoral, indicadores macroeconômicos e arquétipos políticos como
"centrão", "bancada ruralista" e "bancada evangélica".

## Por quê

1. **Um jogo em que se corrompe, chantageia e derruba gente não pode fazer isso com gente que
   existe.** A mecânica central é comprar voto, quebrar promessa, medir venalidade e explorar
   ambição. Atribuir isso a uma pessoa real é uma afirmação sobre ela que nenhum motor sustenta.
2. **Personagem gerado muda de partida para partida.** Um elenco fixo com nomes conhecidos seria
   decorado em duas partidas. Gerado da semente, cada mandato tem um Congresso diferente e continua
   reprodutível, que é a regra que sustenta o save, o simulador e a calibragem.
3. **Nome real envelhece.** Um jogo com o Congresso de 2026 estaria errado em 2027, e a correção
   seria eterna.

## Consequências

- o elenco sai de `src/data/` (nomes e arquétipos) por um gerador determinístico, alimentado pela
  semente da partida;
- nenhum nome real de pessoa entra no catálogo. Não há guarda executável honesta para isso (uma
  lista de nomes proibidos seria incompleta por definição); a regra está no
  [`AGENTS.md`](../../AGENTS.md), se cobra em revisão e consta de `docs/standards.md` §7, entre o
  que não tem guarda;
- a semelhança é de arquétipo, e o jogo pode e deve ser reconhecível: o presidente da Câmara que
  engaveta pedido de impeachment em troca de espaço no governo é um personagem verdadeiro sobre a
  política brasileira sem ser uma afirmação sobre ninguém;
- citar uma figura histórica encerrada, como um presidente do século passado num texto de contexto,
  pede ADR nova.

## Emendas

### 24/09/2026 — empresas

Por decisão do Diretor, "empresa" passou a constar da lista de organizações que agem como
personagem. A regra não mudou; ficou explícita para as empresas que a especificação mestra modela
com agência própria.

### 01/10/2026 — o elenco inspirado na vida real

Por ordem do Diretor, os cerca de 40 papéis que pesam no primeiro ano do mandato têm **inspiração
fixa** na pessoa real que ocupa o cargo: os 11 do STF, PGR, BC, comandantes, TCU, imprensa e
mercado; depois do 2º turno de 25/10/2026, presidentes das Casas, líderes e governadores, com as
bancadas reais de 2027.

- **O que vem da pessoa real:** o papel, a ideologia e o temperamento públicos, e os prazos que o
  calendário real impõe ao cargo (mandato, aposentadoria compulsória aos 75 anos);
- **o que nunca vem:** o nome, episódio real na história do personagem, crime, vida privada e frase
  atribuída. O nome continua saindo da semente;
- **onde o nome real aparece:** só na pesquisa que documenta a inspiração, com fonte e data
  ([pesquisa 21](../research/21-inspired-cast.md)). O catálogo de `src/data/` não leva nome real.

A terceira razão continua valendo: a inspiração envelhece. Cada uma leva a data em que foi
conferida, e a lista se revisa quando o cargo troca de dono.
