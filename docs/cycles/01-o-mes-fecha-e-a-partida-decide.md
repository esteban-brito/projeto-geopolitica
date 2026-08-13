# Ciclo 1 — o mês fecha, e a partida vira decisão

> Combinado na quinta sessão, em 13/08/2026, depois que a Mesa e as seis áreas
> entraram. O estado verificado do projeto está em [`../handoff.md`](../handoff.md);
> este arquivo é o que ficou **acordado fazer**, e por quê.

A divisão em duas partes não é por tamanho — é por **natureza da decisão**. A
Parte 1 tem resposta certa e não precisa de escolha humana (com uma exceção, o
item 1.4). A Parte 2 é calibragem: o instrumento e a medição são trabalho de
sessão, mas o número escolhido é decisão do responsável, e nenhum se gira sem ela.

## Onde o ciclo parou

| item                             | estado                        |
| -------------------------------- | ----------------------------- |
| 1.1 O relatório do mês           | **feito** · verde no passeio  |
| 1.2 Salvar e continuar           | não começado                  |
| 1.3 Base aliada de verdade       | não começado                  |
| 1.4 Situação, veredito e o tinte | não começado · decisão em (b) |
| 1.5 O ano do mandato             | não começado                  |
| 1.6 A lista de ações vira tabela | não começado                  |
| Parte 2 inteira                  | não começada                  |

> **Parada pedida em 13/08/2026**, com o 1.1 fechado: há um plano externo a ser
> avaliado antes de seguir. O que está commitado está verde — `validate`, `walk` e
> `screen` — e nada ficou pela metade na árvore.

---

## Parte 1 — o mês fecha como ciclo, e a tela para de mentir

**Tema:** nada na tela sem motor atrás, e o turno vira ciclo completo — decidir,
executar, **saber o que aconteceu**, continuar.

### 1.1 O relatório do mês

`playMonth` devolve um `report` com placar, deriva por bancada, prometido contra
pago, contingenciamento e o que a alocação moveu. O entrypoint **descartava tudo**:
o jogador apertava "Avançar o mês" e a tela trocava em silêncio.

Sem isso o ciclo não fecha. A decisão não tem consequência legível, e a banda
`± 14` nunca é confrontada com o dia — que é justamente o que ensina a lê-la.

O `<dialog>` nativo já estava montado como demonstração de padrão; ele passa a
carregar o relatório, e o botão que abria a demonstração passa a reabrir o último
mês.

### 1.2 Salvar e continuar

`serialize`/`deserialize` versão 5 existem, testados, e **nenhuma linha os
chamava**. Fechar o navegador perdia o mandato.

### 1.3 Base aliada de verdade

`"247 / 513"` era literal digitado ao lado de números reais. A conta vira função
do ECLUSA — quantas cadeiras a base entrega numa votação neutra —, porque a tela
não pode inventar conta que o motor não fez.

### 1.4 Situação, veredito e o tinte do ambiente

Congelados desde que o `advanceMonth` de andaime saiu de cena, e junto com eles a
cor do ambiente da tela inteira.

**Decisão tomada:** eles passam a sair do que TEM motor — contingenciamento
(LASTRO) e ruptura da base (ECLUSA). Não é opinião pública, e portanto não invade
SONDA: é o **estado do governo**, e quem pode compô-lo é a camada de aplicação,
que é a única que enxerga os dois motores.

A alternativa considerada era retirá-los até SONDA existir, como a aprovação foi
retirada. Foi recusada porque a situação não depende de opinião para existir: um
governo com o teto fechado e a base rompida está em crise mesmo que ninguém
tenha perguntado à população.

### 1.5 O ano do mandato

`"1º · ano 1"` — o mandato era calculado e o ano era fixo.

### 1.6 A lista de ações vira tabela de verdade

`<ul>` com grade e legenda solta: quem lê por leitor de tela ouve
`308 · −140 · +8` sem cabeçalho por célula. `<table>` com `<th scope="col">`
resolve, e a grade continua sendo CSS.

### 1.7 O passeio cresce junto

Cada item acima entra em `npm run walk`, e o que der para prender em Node vira
propriedade em `tests/suites/screens.mjs`.

---

## Parte 2 — a partida vira decisão

**Tema:** hoje não existe escassez de capital político. Enquanto isso valer, tela
nova nenhuma melhora a partida — o jogador não escolhe, ele aperta os botões na
ordem que quiser.

### 2.1 O instrumento primeiro: a varredura

`simulate` roda **uma** política por vez. Calibrar assim é girar um número, reler
o relatório e confiar na memória. A varredura roda o mandato sob N combinações e
imprime a tabela: aprovadas, meses de contingenciamento, dívida final, mês da
ruptura.

**Ela vem antes de qualquer mudança de número.** Sem instrumento, calibragem é
opinião com aparência de medição.

### 2.2 A resistência do Congresso

Alavancas: lealdade de abertura (70), `PIVOT 58`, `SPREAD 16`, `THREAT_WEIGHT 85`.
O alvo se declara **antes** de girar — algo como "na abertura, no máximo um terço
do catálogo passa de graça", contra a metade de hoje.

### 2.3 O catálogo: o preço de cada ação

O sinal fiscal do catálogo pende para "poupa", e é isso que faz a agenda cheia ser
fiscalmente melhor que a inação. A pergunta é de desenho: quantas ações **deveriam**
custar dinheiro?

### 2.4 A dívida: juros como premissa declarada

LASTRO não cobra juros porque juros dependem da Selic, que é CORRENTE, que não
existe. Enquanto isso, o resultado primário é estruturalmente positivo e a dívida
desce sozinha — **nenhum número de dívida na tela significa alguma coisa hoje**.

Proposta: uma taxa como premissa explícita, do mesmo jeito que o PIB já entra, com
o custo declarado no cabeçalho.

### 2.5 O fim do foro privilegiado

251 votos com verba cheia contra 257 exigidos. Única pauta impossível na abertura.
Vira desenho declarado — "a pauta que ataca a máquina exige capital acumulado" — ou
vira alcançável. Uma linha em qualquer direção, mas a linha precisa ser escolhida.

### 2.6 Faxina e registro

`simulate.mjs` para de guardar `memory.passed`: `state.enacted` já é a fonte. E
cada número escolhido vira **ADR** em `docs/adr/`, que hoje está vazio —
calibragem sem razão registrada é calibragem que a próxima sessão desfaz sem saber
que está desfazendo.
