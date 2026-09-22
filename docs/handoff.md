# Retomada

> Ponto de retomada único. **Aqui só entra o que é verificável hoje:** estado, fila, decisões
> vivas, achados abertos e a série. Narrativa vai para [`journal.md`](journal.md). Número com data
> envelhece: remeça antes de repetir. A tabela de contagens é cobrada por
> `tests/suites/catalog.mjs`; a série, por quem mexe no motor.

## Estado — 22/09/2026, portão verde (133s), commit d480f9b (Lotes 4 e 5 fechados, Item 5 inventariado)

- **Ciclo 29 (simplificar) em curso.** Itens 2 e 3 feitos (`app.mjs` modularizado, menu com 3
  chaves). Item 1: lotes 1 a 5 conferidos (`state.mjs` 19%, `turn.mjs` 14%, `inbox.mjs` 11%,
  `cabinet.mjs` 15%, `paint.mjs` 11%, `inputs.mjs` 13%, `strings.mjs` 8%, `styles/46-desk.css` 4%,
  lote 5: `session.mjs` 46% → 19%, `handlers.mjs` 38% → 11%, código idêntico). Item 5
  inventariado e 18 backups efêmeros arquivados em `tmp/arquivo/`. Item 4: 20 asserções de
  interação no passeio (seções 9 e 10) + macaco; faltam 10 asserções;
- **prosa do jogo: ~21%** global (partida 30%; meta ≤ 20%). Piores: `src/domain` 41%,
  `src/ui/shared/glass.mjs` 38%, `src/application/agenda.mjs` 34%, `src/ui/screens/area.mjs` 32%;
- **revisão externa:** 2 dos 3 ultrareviews grátis gastos, 9 achados, os 9 reproduzidos, 7
  corrigidos, 2 nits na fila. Branches `base-ultra`, `base-motor` e `motor-review` existem;
- **portão:** 13 guardas · 67 sintéticas · 334 provas · passeio verde em 1440×980 e 1440×900 ·
  macaco (60 ações, semente 7) verde. `validate` **133s** (passeio 72s, macaco 24s, o resto 12s).
  Série do `simulate` imóvel;
- **rodar é barato:** pintura 3-5ms, abertura 600ms, morph do dock 205-232 fps.

## Fila, em ordem

1. **decisão da poda de `tmp/` (Item 5)** — proposta pronta em `tmp/inventario-item5.md`: apagar os
   18 backups efêmeros (`*.antes.*`, `*.new.*`) e mover scripts ad-hoc dormentes para `tmp/arquivo/`
   após o sim dele;
2. **item 4 — provas de interação**: 20 asserções novas feitas (seções 9 e 10 do passeio). Faltam
   10 para a meta de 30 do Ciclo 29: diálogo de aviso (`openNotice`), verba (interação nos controles
   da Mesa), etc.;
3. **carta do arquivamento** — quando o presidente sobrevive ao plenário, nada diz isso ao
   jogador (ausência declarada em 21/09, Achado 66). Kind novo de carta: `state.mjs`, `inbox.mjs`,
   `strings.mjs`, vocabulário em `annex.mjs`;
4. **prosa de `src/domain`** (41% → ≤ 20%) ou lote 5 de tela/app (`session.mjs` 46%, `handlers.mjs`
   38%, `glass.mjs` 38%);
5. **3º ultra: `src/ui` inteira** (6.907 linhas) — branch sem `src/ui` + branch com ela de volta,
   só depois de fechar o ciclo 29;
6. **ciclo 30** — [`cycles/30-profundidade-e-provas.md`](cycles/30-profundidade-e-provas.md):
   ele marca os candidatos que entram.

## Decisões vivas

- **21/09** — sobreviver ao plenário do afastamento **arquiva** o processo; ele reabre se as
  três rupturas coincidirem de novo. Prova em `pressure.mjs`;
- **21/09** — os 2 nits do ultra (`settlement()` refaz o elenco a cada leitura; `vote()` não usa
  `take()`) são qualidade, não bug: fila, não conserto;
- **21/09** — todo achado se reproduz antes de mexer, e vira prova. Regra do `CLAUDE.md`;
- **21/09** — bug relatado pelo Gemini só entra com reprodução (tela, passo, o que apareceu);
- **05/09** — a base visual é o Liquid Glass; base é ponto de partida, não teto;
- **04/09** — IA por API não entra, nem em partida nem fora dela. O ciclo 19 será reescrito
  como avaliador;
- **31/08 — base acordada, nenhuma executada:** o email leva até a tela · o save fica para depois
  · o piso da saúde e da educação anda com a receita (remede a série) · a votação olha quem
  compareceu (4 regras de equilíbrio);
- **21/08** — não recalibrar a capacidade antes da reformulação das empresas (achado 53);
- **sem resposta dele:** a lista de bugs que ele viu ("são muitos, nem sei como escrever").

## Achados abertos

Um achado que fecha sai daqui para o journal. Número com data: remeça antes de repetir.

- **66. A carta do arquivamento não existe (21/09).** Ver fila 4;
- **65. `--paper` é cor nos tokens e largura na folha (18/09).** `00-tokens.css` declara
  `--paper: #ffffff`; `.sheet` redeclara `--paper: 720px`. Hoje nada lê a cor dentro da folha; a
  primeira que ler recebe `720px`. Renomear a largura mexe em 15 `calc()` de `46-desk.css`;
- **64. O parecer soma mês com ano (11/09).** `UI.brief.treasury` põe `room` (do mês) ao lado de
  `mandatory` e `revenue` (anualizados) e ninguém diz isso. A frase é dele; aberto;
- **63. A promessa da posse saiu do Gabinete (11/09).** Segue no relatório do turno, sumiu da
  mesa. Entra como parágrafo do parecer, ou fica só no fechamento?;
- **53. Não recalibrar a capacidade antes das empresas (21/08).** Pergunta sem resposta: quanto
  tempo uma decisão leva para mudar o país — hoje mais que um mandato em 6 de 8 áreas;
- **52. As sondas espalham; o país premia compromisso sustentado (21/08).** Concentrar 48 meses
  na Saúde: 61 → 71,5; rodar o foco: 61 → 65. Nenhuma tela diz isso;
- **48/37. A Caixa pergunta em 22 de 48 meses passivos; `reported` deu zero.** O relator só
  emenda texto que machuca 2+ alavancas, e ninguém diz isso ao jogador;
- **47. As réguas de Finanças descrevem país 20× mais volátil que o modelo (21/08).** Inflação:
  0,2 de 20 traços em 12 meses. Falta medir no governo ativo. Decisão dele;
- **45. Escadas de Finanças a 0,5rem = 1px por traço (21/08).** Decisão dele;
- **40. "Quem trava a obrigatória" imprime um de três (21/08).** `lockedBy` devolve três;
- **35. Saúde decai rápido na prosa e é das mais lentas no modelo (63 meses de meia-vida).**
  Decidir é recalibrar `yield`/`cost`;
- **22. O que morre antes do plenário (gaveta, relatoria) segue sem medição.** Sonda
  `legislador`: 2 de 39. `ANSWER_TIME = 2` é primeiro chute;
- **23. Travar custa só o relógio.** Se sair de graça, mexer na memória do relator;
- **7/8/10/11/12/26/28.** ECLUSA é primeiro chute (`PIVOT 58`, `SPREAD 16`, `THREAT 85`);
  `bills.mjs` é catálogo morto; `state.norms` cresce sem poda e sem tela; vinculação incide sobre
  a bruta e no mundo é sobre a líquida (RCL — pede terceira fatia de receita); prêmio de risco só
  morde fora da faixa jogada;
- **20. A rua precifica voto e mais nada.** SONDA não toca índice, receita nem despesa. É ciclo;
- **16. Ambições com preço — sobra o sorteio (04/09).** Decisão dele;
- **68. A rolagem da linha corrente em `paint.mjs` só vale acima de 940px (21/09).** Abaixo, a
  página rola e `list.scrollTop` nunca dispara; a carta clicada fica à vista pelo foco. Não é
  defeito para o jogador (prova 10d cobre os dois regimes), mas o comentário do código não diz;
- **67. O passeio leva 72s (21/09).** Já foram 120: `pousou()` esperava 2s por animação que não
  vinha, 24 vezes. O que sobra, medido por trecho: laço do anexo 9s, carta na mesa 6s, seção 9
  5s, posse 4s, fonte atrasada 4s; 73 esperas fixas somam 27s. Instrumento: cópia do passeio com
  `mark()` por seção (feito à mão em 21/09, não ficou no repo).

## Como revisar de fora

`/code-review ultra <base>` lê o diff da branch corrente contra `<base>`, teto de 8.000 linhas e
500 arquivos. A branch inteira contra `main` tem 33.000 linhas, então:

- **um trecho recente:** base num commit antigo (`base-ultra` = `679f043`, 18/09 → 7.924 linhas);
- **uma pasta inteira:** base = HEAD sem a pasta; revisada = base com a pasta de volta
  (`base-motor` / `motor-review`, árvore igual à `caixa-de-entrada` por hash). Por três pontos o
  diff de HEAD contra a base sem a pasta é **vazio** — o ancestral comum tem de ser a base;
- achado dela é hipótese até reproduzir. Placar: 9 achados, 9 verdadeiros; detalhe às vezes
  errado (o "pior em dezembro" do teto caiu no meio do ano).

## A série que calibra

Seis das nove sondas (`concentra`, `favoritos`, `legislador` escolhem em vez de espalhar e se
medem à parte). 48 meses, semente padrão, sem partido (`--party` compara outro jogo; com PLB,
`agenda` dá 30/43). Remedida em 21/09 depois do 2º ultra: imóvel.

| política     | dívida/PIB | votações     | indústria | segurança |
| ------------ | ---------- | ------------ | --------- | --------- |
| `herdado`    | 89,9%      | 0 de 0       | 48 → 27   | 38 → 25   |
| `agenda`     | 90,0%      | **26 de 43** | 48 → 20   | 38 → 20   |
| `base`       | 90,7%      | **34 de 41** | 48 → 20   | 38 → 20   |
| `piso`       | 90,9%      | 5 de 17      | 48 → 15   | 38 → 15   |
| `explorador` | 91,8%      | 0 de 0       | 48 → 25   | 38 → 17   |
| `promessa`   | 92,4%      | 0 de 2       | 48 → 19   | 38 → 17   |

Mexeu em `src/data/`, `src/domain/`, `src/application/` ou `src/state/`? remeça esta tabela no
mesmo commit, mesmo que ela não mude.

## O que existe

**Tela:** barra fixa (data, vitais, avançar) + rail (coluna acima de 1181px de largura; dock no
Gabinete) + treze endereços: Gabinete, Email, Congresso & Leis, Finanças, oito áreas, Estado; o
fecho ocupa o Gabinete. Gabinete é a Mesa (cena 1916×821, que só encolhe): pasta com o ato e o
contingenciamento, envelopes que erguem a carta ao centro, telefone. Email é a Caixa em tela
cheia. Vocabulário único em `src/ui/shared/annex.mjs` (guarda `annexes`).

**Dados:** 9 blocos · 513 cadeiras · 8 áreas · 38 programas · 6 regras · 4 grupos de pressão ·
3 faixas de renda · 8 arquétipos.

| coleção            | quantos |
| ------------------ | ------- |
| blocos partidários | 9       |
| cadeiras           | 513     |
| áreas              | 8       |
| programas          | 38      |
| regras             | 6       |
| grupos de pressão  | 4       |
| faixas de renda    | 3       |
| arquétipos         | 8       |

**Motores:** LASTRO (receita, teto, `blocked` × `atRisk`) · ECLUSA (`whipCount`/`vote`/`settle`)
· MALHA (índices, `pushOf`/`liftOf`) · SONDA · ELENCO (semente, sem fluxo de RNG) · CORRENTE
(hiato, Phillips, Taylor, Okun, `carry`) · ESTRATO (faixa derivada, nunca guardada) · DELTA (lido
do catálogo) · TEMPORAL e CASCATA só contrato.

**Composição:** `agenda.mjs` (proposta, rateio) · `turn.mjs` (`bandsOf` → `settlement` →
`ledger` → `situationOf` → `playMonth`) · `public/` (fachada; `boundaries` prova) ·
`simulate.mjs` (nove sondas).

**Verificação:** 13 guardas · 67 sintéticas · 334 provas · passeio dentro do `validate`
(geometria, recorte, contraste no pixel, 1440×980 e 1440×900).

## O que ainda não existe

- **TEMPORAL e CASCATA** — só os contratos;
- **carta do arquivamento** do processo de afastamento (achado 66);
- **tensão institucional** — variável de estado, não motor;
- **contraste em texto com filho elemento** — o medidor não alcança (`standards.md` §7);
- **layout de força para o DELTA** — grafo lido, peça que desenha não;
- **Liquid Glass de alta fidelidade** — especificação em `research/12`; implementação futura;
- **GitHub Pages** — só CI por enquanto.

## Decisões fechadas que não se reabrem sem pedido

Fase 1 só o Brasil · 48 turnos mensais · inglês no código, português na prosa · cascata
declarada · codinomes de motor · zero build/runtime · lealdade serializada · motor nenhum chama
outro · Congresso responde ao pago · rateio proporcional · âncora é o teto que vigorou · tela
pergunta, previsão usa o pago · rascunho morre com o mês · tudo é alavanca com preço · posição
calculada, rito sai do conteúdo, jogador não inventa substantivo · catálogo cita fonte · Finanças
sem controle · ordem entre normas total (hierarquia, especificidade, recência, escrita) · geral
não revoga especial sem nomear · faixa derivada, nunca guardada · pessoa é semente (save guarda
memória) · elenco sem RNG · ambição é preço, traição pesa mais que favor · déficit primário tem de
rodar · preço escala com dispersão · layout é promessa · sem presidente sem partido (CF 14, §3º,
V) · federação = coligação com preço para romper · barreira pode matar o partido no ano 4.
**Princípio: tudo tem um jeito de ser feito — o que separa o possível do impossível é o preço.**

Referências: Geopolitical Simulator, Football Manager 2020.

## Fontes de modelagem

Campo real em [`docs/research/`](research/) (pesquisas 01 a 12); a 09 é o checklist do cargo e a
04 lista os sete buracos por realismo ganho. Correções do dossiê externo estão na prosa de cada
arquivo de dado (`parties`, `fiscal`, `macro`, `congress`, `economy`, `turn`).
