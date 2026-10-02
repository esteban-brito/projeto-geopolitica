# ADR 0001 — a IA fica fora do turno

> **Situação:** aceita. Nenhum modelo de linguagem entra no turno nem no jogo, por API ou por
> qualquer outra via. O que a IA escreve entra como dado revisado, pela
> [ADR 0002](0002-ai-generates-vocabulary-not-effect.md).
>
> **Data:** 13/08/2026 · **Decidido por:** o Diretor, que delegou a decisão ao Claude ("você
> decide tudo sobre IA e todo esse tipo de coisa") · **Emendas:** 04/09/2026 (revogada) e
> 29/09/2026

## Contexto

O norte do projeto é **criatividade sem limite artificial**: o jogador tenta a jogada que quiser —
comunista, ultracapitalista, anarquista, monarquista, a jogada Lee Kuan Yew — e o mundo responde.
Surgiu daí a ideia de usar um modelo de linguagem para decidir esse tipo de coisa: se o comunismo
"deu certo", quanto capital fugiu, o que o mundo faz em resposta.

O exemplo que abriu a discussão foi preciso: _"um país comunista só daria certo se fosse como a
China, ou como a Coreia do Norte, que recebe ajuda da China"_.

## Decisão

**Nenhum número que o modelo consome vem de um modelo de linguagem.** A IA nunca entra em
`playMonth`, nunca decide um efeito e nunca arbitra se uma política funcionou.

Ela entra num lugar só, fora do jogo: **o catálogo, antes de o jogo rodar.** O agente que escreve no
repositório propõe ações, rótulos e vocabulário; a saída passa pelo validador de esquema e pelas
guardas, é revisada na calibragem e vira arquivo estático commitado. O jogador nunca fala com IA
nenhuma.

O texto de 13/08 previa mais dois lugares, o veredito de fim de mandato e a narração em tempo de
jogo (manchete, discurso, reação da rua). Os dois caíram com a emenda de 29/09.

## Por quê

Quatro razões, e nenhuma é de estilo:

1. **O determinismo é estrutural.** Existe a prova de que o mandato inteiro se refaz da semente e
   das ordens. Dela dependem o save, o simulador de 48 meses, a calibragem e boa parte das provas.
   Mesma semente e mesmas ordens com resultado diferente derrubam tudo isso junto.
2. **Sem determinismo não há calibragem.** Não se calibra o que não se pode medir mil vezes. Com IA
   no meio, cada rodada vira uma amostra cara de uma distribuição desconhecida.
3. **O jogador precisa poder aprender o modelo.** A promessa do jogo é a cadeia causal legível:
   "aprovar o programa habitacional antecipa o contingenciamento em 11 meses" é uma frase que o
   jogador descobre, testa e reusa. Com a IA decidindo, não há modelo a aprender; há um narrador a
   agradar, e a estratégia vira engenharia de prompt.
4. **Número de IA é infalsificável.** Um número vindo de um modelo de linguagem não tem motor por
   definição: guarda, prova e teste nenhum o alcançam.

Soma-se o custo: o site é estático, sem build e sem dependência de runtime. IA no turno significa
servidor, chave, segundos de espera por mês jogado e o fim do jogo sem rede.

## O que substitui a IA no problema que a motivou

A distinção China / Coreia do Norte / Venezuela é uma **mecânica**, e cabe em três variáveis:

| variável                        | China | Coreia do Norte | Venezuela | estado em 13/08                |
| ------------------------------- | ----- | --------------- | --------- | ------------------------------ |
| capacidade de entrega do Estado | alta  | baixa           | baixa     | existia: MALHA                 |
| coerção e tensão institucional  | alta  | total           | média     | decidida, ainda não construída |
| patrono externo                 | —     | essencial       | ausente   | não existia                    |

Regra é melhor que IA em tudo o que importa aqui: é determinística, calibrável, testável, e o
jogador consegue descobri-la. O exemplo que motivou a ideia de IA mostra que faltavam variáveis no
modelo, não inteligência.

## Alternativas recusadas

- **IA decidindo efeitos no turno**, pelas quatro razões acima;
- **IA como árbitro do "deu certo"**: o veredito sai do estado, e o estado sai dos motores;
- **negociação em linguagem natural com as bancadas**: adiada em 13/08 por ser a única coisa da
  lista que motor nenhum faz; recusada em 29/09, com toda IA em tempo de jogo.

## Consequências

- a criatividade cresce por catálogo escrito fora do jogo, e não por inteligência em tempo de jogo;
- o jogo roda sem rede, sem chave e sem servidor;
- reabrir a questão pede ordem do Diretor e ADR novo.

## Emendas

### 04/09/2026 — a IA escolhe dentro do turno (revogada)

Por ordem do Diretor, o [ciclo 19](../archive/cycles/19-the-voice.md) propôs que `demandsOf`
perguntasse à IA qual chantagem o lobby faria no mês, escolhendo só entre opções que o motor já
tinha precificado, com o determinismo garantido por cache pela ficha do mês. O critério de aceite
era mecânico: `npm run simulate` de 48 meses tinha de dar a mesma série antes e depois. A emenda
foi revogada pela de 29/09, e nada dela entrou no código.

### 29/09/2026 — IA por API não entra

O Diretor descartou a integração por API, como registram a abertura do
[ciclo 19](../archive/cycles/19-the-voice.md) e as leis do [`AGENTS.md`](../../AGENTS.md): IA por
API não entra, nem em partida nem fora dela. Caem o veredito e a narração por modelo, o cache de
respostas e a emenda de 04/09. Ficam o domínio determinístico e o vocabulário estático revisado da
[ADR 0002](0002-ai-generates-vocabulary-not-effect.md).
