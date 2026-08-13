# ADR 0001 — a IA fica fora do turno

**Data:** 13/08/2026 · **Estado:** aceita · **Decidido por:** delegação explícita do
responsável ("você decide tudo sobre IA e todo esse tipo de coisa").

## Contexto

O norte do projeto é **criatividade sem limite artificial**: o jogador tenta a
jogada que quiser — comunista, ultracapitalista, anarquista, monarquista, a
jogada Lee Kuan Yew — e o mundo responde. Surgiu daí a ideia de usar um modelo de
linguagem para decidir esse tipo de coisa: se o comunismo "deu certo", quanto
capital fugiu, o que o mundo faz em resposta.

O exemplo que abriu a discussão foi preciso: _"um país comunista só daria certo
se fosse como a China, ou como a Coreia do Norte, que recebe ajuda da China"_.

## Decisão

**Nenhum número que o modelo consome vem de um modelo de linguagem.** A IA nunca
entra dentro de `playMonth`, nunca decide um efeito e nunca arbitra se uma
política funcionou.

Ela entra em **três lugares, todos fora do laço determinístico**:

1. **Geração de catálogo, antes do jogo rodar.** A IA propõe ações — rótulo,
   área, instrumento, posição no plano, `threat`, impacto fiscal e de índice. A
   saída passa pelo validador de esquema e pelas guardas que já existem, é
   revisada a mão na calibragem, e vira **arquivo estático commitado**. O jogador
   nunca fala com IA nenhuma. É o uso de maior valor hoje: o gargalo da
   criatividade é o catálogo de 36 ações, e não os motores;
2. **Veredito de fim de mandato.** Ela lê a série determinística de 48 meses já
   produzida e escreve a análise do que aconteceu. Acontece uma vez, latência não
   importa, e é _interpretação_ — o número continua sendo do motor;
3. **Narração.** Manchete, discurso, reação da rua, sobre estado já calculado.
   Camada opcional: se ela falhar ou estiver desligada, o jogo funciona igual.

## Por que a IA não decide

Quatro razões concretas, e nenhuma é estilística:

1. **O determinismo é estrutural.** Existe a prova `o mandato inteiro se refaz da
semente e das ordens`. Dela dependem o **save**, o **simulador** de 48 meses em
   milissegundos, a **varredura de calibragem** que ainda vai nascer e boa parte
   das 105 propriedades. Mesma semente e mesmas ordens com resultado diferente
   derruba as quatro coisas juntas;
2. **Sem determinismo não há calibragem.** Não se calibra o que não se pode medir
   mil vezes. Hoje quatro políticas-sonda rodam e se comparam; com IA no meio,
   cada rodada é uma amostra cara de uma distribuição desconhecida;
3. **O jogador precisa poder APRENDER o modelo.** A promessa do jogo é a cadeia
   causal legível — "aprovar o programa habitacional antecipa o contingenciamento
   em 11 meses" é uma frase que o jogador descobre, testa e reusa. Com a IA
   decidindo não há modelo a aprender: há um narrador a agradar, e a estratégia
   degenera em engenharia de prompt;
4. **Número de IA é infalsificável.** O projeto inteiro é construído contra
   número que nenhum motor sustenta — foi por isso que a aprovação saiu da tela.
   Um número vindo de um modelo de linguagem não tem motor por definição: guarda
   nenhuma, prova nenhuma e teste nenhum o alcançam.

Soma-se o custo bruto: site estático, zero build e zero dependência de runtime.
IA dentro do turno significa servidor, chave, latência de segundos por mês jogado
e fim do jogo offline.

## O que substitui a IA no problema que a motivou

A distinção China / Coreia do Norte / Venezuela **é uma mecânica**, e cabe em três
variáveis — duas delas já existem ou já foram decididas:

| variável                        | China | Coreia do Norte | Venezuela | estado no projeto              |
| ------------------------------- | ----- | --------------- | --------- | ------------------------------ |
| capacidade de entrega do Estado | alta  | baixa           | baixa     | **existe** — MALHA, seis áreas |
| coerção / tensão institucional  | alta  | total           | média     | **decidida**, não construída   |
| patrono externo                 | —     | essencial       | ausente   | não existe — fase 2            |

Regra é melhor que IA em tudo o que importa aqui: é determinística, é calibrável,
é testável e o jogador **consegue descobrir**. O exemplo que motivou a ideia de
IA é, na verdade, a prova de que faltam variáveis de modelo — não inteligência.

## Alternativas recusadas

- **IA decidindo efeitos no turno.** Recusada pelas quatro razões acima;
- **IA como árbitro do "deu certo".** Mesma recusa: o veredito tem de sair do
  estado, e o estado tem de sair dos motores. A IA pode _narrar_ o veredito;
- **Negociação em linguagem natural com as bancadas.** Não recusada — adiada com
  os olhos abertos. É a única coisa da lista que motor nenhum faz, e por isso é
  atraente; mas reintroduz todos os problemas acima. Fica para quando houver
  motor suficiente para que ela seja enfeite, e não mecânica.

## Consequências

- O gargalo da criatividade passa a ser atacado por **geração de catálogo
  offline**, e não por inteligência em runtime;
- O jogo continua rodando sem rede, sem chave e sem servidor;
- Qualquer camada de IA que entrar depois é **opcional por construção**: o jogo
  tem de continuar jogável com ela desligada.
