# Pesquisa 22 — o Jev, da TypeSafe AI, e onde ele serviria ao jogo

> Conferida em 02/10/2026, nas fontes da própria empresa. Avaliação do Claude; nada aqui é decisão.

## O que é

O Jev é um modelo de IA da TypeSafe AI (São Francisco, fundada em 2024), lançado em acesso
antecipado em 15/09/2026. A empresa o chama de "modelo Sistema Um": em vez de escrever texto, ele
recebe o estado de um programa e perguntas tipadas e devolve, numa passada só, respostas tipadas
com probabilidade calibrada e grau de confiança ([anúncio][anuncio], [documentação][docs]).

- **Tipos de resposta:** escolha entre opções (até 255), nota numa rubrica e verdadeiro/falso;
- **velocidade e preço:** de 70 a 500 ms; US$ 0,042 por milhão de tokens de entrada, saída grátis;
- **onde roda:** só por API, na nuvem; as fontes não citam uso sem rede;
- **limites:** não gera texto, não lê imagem; as fontes não dizem se a mesma entrada dá sempre a
  mesma resposta.

## Onde serviria

Só fora do jogo, e só se o Diretor reabrir a [ADR 0001](../adr/0001-ai-stays-out-of-the-turn.md),
que hoje proíbe IA por API dentro e fora da partida.

1. **Jogador sintético nos testes** (o melhor uso): escolher, entre as ações válidas, as que um
   jogador faria, no lugar do sorteio cego do macaco. As partidas se gravam e o teste as repete,
   então o determinismo fica. Partidas parecidas com as de gente acham defeito que o sorteio não acha.
2. **Classificar dado em massa:** por exemplo, as 152 atribuições de ministérios por área, ou as
   propostas reais da pesquisa 07 nos eixos economia × liberdades. O resultado vira dado estático
   revisado, como manda a [ADR 0002](../adr/0002-ai-generates-vocabulary-not-effect.md).

## Onde não serve

- **Atores decidindo na partida:** quebra o determinismo e o jogo sem rede; com centenas de decisões
  por mês, seriam segundos de espera por turno;
- **busca em linguagem natural na partida:** exige rede; sinônimos escritos fora do jogo resolvem;
- **o gargalo real do projeto:** pesquisa com fonte e calibragem medida; a probabilidade do modelo é
  opinião dele, não fonte.

## Recomendação

Não usar agora. Se o Diretor quiser, o candidato é o jogador sintético dos testes, com ordem dele e
ADR nova.

[anuncio]: https://typesafe.ai/blog/introducing-system-one-models-and-jev
[docs]: https://docs.typesafe.ai/introduction
