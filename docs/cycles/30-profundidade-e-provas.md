# CICLO 30 — PROFUNDIDADE E PROVAS

> Proposto em 21/09/2026. A parte A entra sem escolha: é o que fecha bug. A parte B são
> candidatos de profundidade do motor, com fonte e custo; **ele marca os que entram**, e o ciclo
> só começa depois do 29 fechado (lote 3, itens 4 e 5).

## 1 · Por que

Ordem dele de 21/09: profissional, mitigar bug, complexidade e inteligência no jogo, pouco texto
inútil. O ciclo 29 cuida do texto e da estrutura. Este cuida de duas coisas que o 29 não cobre:

- **o portão não pega bug de interação nem de previsão.** Dois ultrareviews acharam 9 defeitos
  reais que 13 guardas, 332 provas e o passeio deixaram passar: estado por índice, ouvinte
  repetido, lente inline vencendo a folha, cerco que nunca arquiva, fluxo descartado, previsão
  com estado parcial. Das 334 provas, cerca de dez são de interação;
- **o cargo é maior que o jogo.** A pesquisa 04 lista sete buracos por realismo ganho por
  unidade de trabalho, e três têm fórmula escrita desde 13/08 sem nunca entrar.

## 2 · Regra do ciclo

- todo achado se reproduz antes de mexer e vira prova que **cai** contra o código de hoje;
- motor só entra com a pesquisa citada e a série remedida no mesmo commit;
- prosa em até 20% de tudo que este ciclo toca; comentário só com alternativa reprovada e número;
- o Gemini não toca em motor nem em prova: recebe prosa e inventário;
- nada apagado sem o sim dele; calibragem (`src/data/`) não se gira para passar prova.

## 3 · Parte A — o que fecha bug

| #   | o quê                                                                                                                                                                                                                                  | prova que fecha                                                                                                                                         |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1  | os 3 defeitos do 1º ultra viram provas no passeio                                                                                                                                                                                      | Esc larga a carta depois de repintar; carta na mão tem o mesmo id depois de avançar; 0 quadros com lente no rail durante a troca, e ela volta ao pousar |
| A2  | o macaco vira prova do portão: semente fixa, N ações, espera o repouso (mola da pílula, morph da gaveta) antes de medir                                                                                                                | 0 erros de página; pílula sobre o item ativo em repouso; nenhum clique em peça coberta contado como falha                                               |
| A3  | provas de interação: gaveta (o morph pousa com os 8 dentro da cápsula), pílula (segue o item ativo nas 8 áreas e nos 5 itens), diálogo (abre, fecha, foco volta), verba (o controle move o placar), troca de tela (dissolve sem lente) | ≥ 30 asserções de interação novas em `walk.mjs`, contadas                                                                                               |
| A4  | carta do arquivamento (achado 66): kind novo, texto dele, vocabulário em `annex.mjs`                                                                                                                                                   | sobreviver ao plenário entrega a carta uma vez; cair não entrega                                                                                        |
| A5  | os 2 nits: `vote()` sobre `take()` (mesmo saque, prova de igualdade); `settlement()` memoizado só se a medição mostrar ganho                                                                                                           | série imóvel; igualdade de saque                                                                                                                        |
| A6  | a lista de bugs dele — cada um vira prova antes do conserto                                                                                                                                                                            | uma prova por bug                                                                                                                                       |
| A7  | 3º ultra: `src/ui` inteira (base sem a pasta + branch com ela de volta)                                                                                                                                                                | todo achado reproduzido; corrigido ou registrado                                                                                                        |

## 4 · Parte B — profundidade: os candidatos

Fonte: [pesquisa 04 §3](../research/04-o-cargo-de-presidente.md) (sete buracos), [pesquisa
09](../research/09-o-checklist-do-cargo.md) (checklist do cargo) e a base acordada em 31/08.
Custo em sessões é estimativa; a série se remede em todos.

| #   | candidato                                                                                                | o que muda no jogo                                                                                                                                                  | fonte                                      | custo             |
| --- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ----------------- |
| B1  | **o piso que se move sozinho** — saúde 15% da RCL, educação 18% da receita de impostos                   | em recessão a previdência e a folha não cedem (valor absoluto) e saúde e educação encolhem sozinhas; o LASTRO passa a separar RCL e receita de impostos (achado 26) | 04 §3.2 · CF 198 §2º e 212 · base 31/08    | 2                 |
| B2  | **a votação olha quem compareceu** — maioria dos presentes; abaixo de 257 a sessão não abre              | obstrução vira esvaziamento; lei ordinária passa com menos de 257; a pauta não morre, ela não acontece. As 4 regras de equilíbrio da base de 31/08                  | 04 §3.4 · CF 47 e 69 · base 31/08          | 2                 |
| B3  | **o calendário político** — eleição municipal no mês 21, geral no mês 45                                 | o Congresso esvazia no 2º semestre eleitoral; Lei 9.504 art. 73 e LRF arts. 21 e 42 travam gasto no fim do mandato. Função pura de `month`, como o fiscal           | 04 §3.3 · Lei 9.504/1997 · LC 101/2000     | 1                 |
| B4  | **o decreto tributário** — II, IE, IPI e IOF por ato próprio; IOF, II e IE valem na hora, IPI em 90 dias | o instrumento fiscal mais rápido do cargo; o canal já é lido em `economy/index.mjs:62` e está morto                                                                 | 04 §3.1 · CF 153 §1º e 150 §1º             | 1–2               |
| B5  | **a coalizão com forma** — taxa de coalescência: pastas por partido × cadeiras                           | a base vale o que a divisão dos ministérios espelha; coalescência baixa = governo por MP; demitir ministro vira conta                                               | 04 §3.5 · Abranches (1988) · Amorim Neto   | 3+, ciclo próprio |
| B6  | **o contrapoder** — hoje nada desfaz o que o presidente faz                                              | STF, TCU, MP: ato sem lastro pode cair; tensão institucional vira variável de estado                                                                                | 04 §3.7 · handoff "o que ainda não existe" | 3+, ciclo próprio |
| B7  | **o email leva até a tela · o save** — base de 31/08                                                     | a carta com botão leva à tela que decide; a partida sobrevive ao fechar o navegador com o rascunho                                                                  | base 31/08                                 | 1–2               |
| B8  | **a rua com consequência** (achado 20)                                                                   | SONDA toca receita e índice: governo detestado governa país diferente                                                                                               | ciclo 4 · achado 20                        | ciclo próprio     |

**Recomendação:** B1 + B2 + B3 neste ciclo — os três têm fórmula escrita, custo de 1-2 sessões
cada, e são os que mais mudam o que o jogador sente sem motor novo. B4 logo depois. B5, B6 e B8
são ciclo próprio cada um.

## 5 · O que não entra

- polimento visual sem defeito medido;
- motor sem pesquisa citada;
- IA por API;
- recalibrar a capacidade antes da reformulação das empresas (achado 53).

## 6 · Como fecha

`validate` verde · série reescrita no mesmo commit de cada mudança de motor · asserções de
interação contadas no passeio (≥ 30 novas) · prosa ≤ 20% no que foi tocado · toda prova nova
provada contra o código antigo (cai) · handoff e journal.
