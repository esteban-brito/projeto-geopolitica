# A visão do jogo

> Rascunho de 01/10/2026, escrito a partir das respostas dele. Quando ele aprovar, este é o
> documento de mais alta autoridade do projeto: a [especificação mestra](spec/master-spec.md)
> diz **como** o jogo funciona, e este diz **o que** ele é e **para que**.

## A promessa

Você assume a Presidência do Brasil real em 5 de janeiro de 2027 e pode tentar qualquer coisa.
O Brasil responde como o Brasil responderia.

## Os quatro pilares, todos ao mesmo tempo

1. **Liberdade total, com preço.** Nenhuma ação é proibida. Quase impossível não é impossível:
   o jogador pode tentar levar o país para o comunismo, o anarcocapitalismo, a monarquia ou uma
   ditadura, e o jogo calcula quem obedece, quem resiste e quanto custa. Ideologia é o que você
   faz, nunca um item de menu.
2. **Ultrarrealismo e fidelidade.** Constituição, ritos, calendário, orçamento e instituições
   reais, com fonte. Pessoas e empresas inventadas, reconhecíveis. Número sem fonte ou motor
   atrás não aparece.
3. **Pessoas e drama.** Tudo passa por gente com rosto, memória, ambição e lealdade: ministros,
   deputados, juízes, jornalistas, governadores. Negociar, prometer, trair e ser traído.
4. **O país muda, e você vê.** Economia, serviços, direitos e instituições se movem com atraso
   e com causa. O fim mostra o país que você deixou, sem dar nota.

**E viciante.** O realismo fica no motor; na tela fica o que gera decisão. A pergunta de
diversão é a dele ao jogar: **"quero jogar mais uma semana?"**. Isso se busca com consequência
que volta, gente que reage, projetos com progresso visível e surpresas que se explicam depois.

## O ritmo é do jogador

O mesmo motor, a mesma partida, e o jogador escolhe quanto quer acompanhar:

- **Presidente presente:** semana a semana, com agenda, reuniões e telefonemas. Um mandato leva
  dezenas de horas;
- **Presidente estrategista:** o tempo corre mês a mês; ministros e Casa Civil resolvem a rotina
  pelo próprio temperamento, e só para na mesa o que só o Presidente decide. Um mandato leva
  poucas horas.

Dá para trocar a qualquer momento. Delegar tem preço: quem decide no seu lugar decide do jeito
dele. Isso cumpre a especificação (§4.4: compressão é o mesmo motor, nunca regra paralela).

## Para quem

Para ele, por enquanto. Sem pressa de lançar, sem tutorial obrigatório, só em português. Cada
etapa termina com ele jogando, e o que ele sentir decide a seguinte.

## O que conta como sucesso

| objetivo     | como se mede                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| liberdade    | as partidas Xi e Lee têm os 16 fios jogáveis; três destinos extremos alcançáveis em alguma semente ([partidas-teste](spec/test-playthroughs.md)) |
| fidelidade   | toda regra que o jogador toca tem fonte; nenhum número inventado na tela                                                                         |
| pessoas      | todo acontecimento tem autor e motivo que se abre na tela                                                                                        |
| país visível | o balanço final aponta o rastro de cada mudança                                                                                                  |
| diversão     | em cada teste dele: quis continuar? onde cansou? nenhuma estratégia vence sempre nas sondas                                                      |
| ritmo        | o mesmo mandato nos dois ritmos; a mesma ordem tem o mesmo efeito, e o que muda é quem decide o que o jogador não decidiu                        |

## O que o jogo não é

Simulador de burocracia; árvore ideológica; painel de indicadores; história roteirizada com
escolha falsa; jogo com IA gerando efeito; produto com prazo.

## Ainda em aberto, sem pressa

Segundo mandato; o mundo lá fora (atualização futura); Câmara personalizada; horizonte do
legado. Estão no [ciclo 33](cycles/33-whole-game.md) §11.
