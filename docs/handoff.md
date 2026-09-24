# Retomada

> Ponto de retomada único. **Aqui só entra o que é verificável hoje:** estado, fila, decisões
> vivas, achados abertos e a série. Narrativa vai para [`journal.md`](journal.md). Número com data
> envelhece: remeça antes de repetir. A tabela de contagens é cobrada por
> `tests/suites/catalog.mjs`; a série, por quem mexe no motor.

## Estado — 23/09/2026, portão verde, contrato universal AGENTS.md e governança tripartite

- **Pesquisa do Gemini entregue; não validada:** triagem rápida em
  [real-brazil-institutions.md](research/real-brazil-institutions.md). Faltam URLs e comprovação
  de atualidade; repete erro sobre `Program.yield` e propõe consequências automáticas e números
  sem fonte suficiente. Cabeçalho corrigido e ressalvas registradas. Gemini declarou repouso;
  nenhum novo lote enviado. Retomar pela verificação de fontes, sem usar o rascunho como regra;
- **Direção atual de design:** usuário pediu reformulação para tornar o jogo jogável e realista,
  com pessoas de personalidades diferentes e empresas fictícias inspiradas na realidade.
  Estudo e avaliação da resposta do Gemini em [world-design.md](world-design.md); piloto de
  Energia é proposta do Codex, ainda não implementada nem selecionada pelo usuário;
- **Ciclo 29 (simplificar) em curso.** Itens 2 e 3 feitos (`app.mjs` modularizado, menu com 3
  chaves). Item 1: lotes 1 a 5 conferidos (`state.mjs` 19%, `turn.mjs` 14%, `inbox.mjs` 11%,
  `cabinet.mjs` 15%, `paint.mjs` 11%, `inputs.mjs` 13%, `strings.mjs` 8%, `styles/46-desk.css` 4%,
  lote 5: `session.mjs` 46% → 19%, `handlers.mjs` 38% → 11%, código idêntico). Item 5
  inventariado e 18 backups efêmeros arquivados em `tmp/arquivo/`. Item 4: 30 asserções de
  interação no passeio (seções 5, 9, 10 e 11) + macaco; as dez novas cobrem verba e aviso
  modal. Portão completo verde em 139,2s; oscilação anterior registrada no achado 69. Lote 6 conferido
  (`glass.mjs` 38% → 18%, `agenda.mjs` 34% → 16%, `area.mjs` 32% → 12%, código idêntico), e o
  lote 6b devolveu as fontes em `tmp/` e a alternativa reprovada que o lote 6 tinha apagado;
- **lote Codex/Gemini de 23/09:** `budget/index.mjs` 41% → 22%; `opinion/index.mjs` 44% → 25%.
  Código sem comentários idêntico e 95 linhas de contrato JSDoc preservadas, conferidos pelo
  Codex contra as cópias anteriores e o HEAD. A meta global de prosa continua pendente;
- **prosa do jogo:** os três piores arquivos de tela/aplicação saíram da lista com o lote 6.
  Global e domínio estão por remedir após o lote Codex/Gemini; referências anteriores: ~21%
  global antes do lote 6 e 41% no domínio antes desta rodada;
- **revisão externa:** 2 dos 3 ultrareviews grátis gastos, 9 achados, os 9 reproduzidos, 7
  corrigidos, 2 nits na fila. Branches `base-ultra`, `base-motor` e `motor-review` existem;
- **portão:** 13 guardas · 67 sintéticas · 334 provas · passeio verde em 1440×980 e 1440×900 ·
  macaco (60 ações, semente 7) verde. `validate` **139,2s** na rodada final de 23/09, após uma
  falha intermitente do passeio (achado 69). Log: `tmp/codex-validate.log`. Série do `simulate` imóvel;
- **rodar é barato:** pintura 3-5ms, abertura 600ms, morph do dock 205-232 fps.

## Fila, em ordem

1. **reformulação da experiência** — desenvolver a proposta de [world-design.md](world-design.md)
   com foco em iniciativa de pessoas e empresas e consequências distintas das políticas.
   Revisar a entrega do Gemini a partir da nota de triagem e conferir fontes antes de incorporá-la.
   A ordem abaixo preserva as pendências anteriores; não bloqueia o estudo da nova direção;
2. **decisão da poda de `tmp/` (Item 5)** — proposta pronta em `tmp/inventario-item5.md`: apagar os
   18 backups efêmeros (`*.antes.*`, `*.new.*`) e mover scripts ad-hoc dormentes para `tmp/arquivo/`
   após o sim dele;
3. **achado 69 — investigar oscilação da prova de voo interrompido**. Item 4 concluiu a meta de
   30 asserções com portão verde; o aviso é exercitado por `openNotice`, sem acionador na interface;
4. **carta do arquivamento** — quando o presidente sobrevive ao plenário, nada diz isso ao
   jogador (ausência declarada em 21/09, Achado 66). Kind novo de carta: `state.mjs`, `inbox.mjs`,
   `strings.mjs`, vocabulário em `annex.mjs`;
5. **prosa de `src/domain`** (referência anterior: 41%; meta ≤ 20%) — permanece pendente;
6. **3º ultra: `src/ui` inteira** (6.907 linhas) — branch sem `src/ui` + branch com ela de volta,
   só depois de fechar o ciclo 29;
7. **ciclo 30** — [`cycles/30-profundidade-e-provas.md`](cycles/30-profundidade-e-provas.md):
   ele marca os candidatos que entram.

## Decisões vivas

- **23/09, liberdade de projeto político** — o jogador não interpreta Lula. O usuário quer
  poder tentar transformações radicais, incluindo comunismo, fascismo e trajetórias inspiradas
  em Milei ou Singapura. Brasil real como ponto de partida, não destino obrigatório. Modelar
  medidas, resistências e consequências, distinguindo tentativa de sucesso; detalhamento em
  [world-design.md](world-design.md). Não houve alteração do horizonte de 48 meses;
- **23/09, experiência presidencial** — usuário escolheu combinar reuniões/conversas e
  documentos/despachos, usando o funcionamento real do governo brasileiro, do governo Lula
  e do STF como referência. Proposta e caso documentado do IOF de 2025 em
  [world-design.md](world-design.md); não confundir episódio histórico com situação atual;
- **23/09, prioridade reafirmada pelo usuário** — máxima fidelidade ao que um presidente
  realmente é e faz. O jogo está no início; planos e soluções permanecem revisáveis em discussão
  entre usuário, Codex, Claude e Gemini, com decisão final do usuário. Preservar essa abertura
  nas propostas de [world-design.md](world-design.md);
- **23/09, reformulação** — prioridade do usuário: jogabilidade, realismo, pessoas com inteligência
  e personalidade e empresas fictícias reconhecíveis. Número de pastas permanece aberto.
  A revisão do Gemini foi confrontada com código e direção atual em [world-design.md](world-design.md).
  Não adotar prazos arbitrários de efeito, crise obrigatória por mês ou equivalência entre
  indicação política e incompetência. São critérios propostos pelo Codex, não calibragem aprovada;
- **23/09, noite** — usuário autorizou o Codex a assumir implementação e coordenação com Gemini
  durante a ausência do Claude. Arquivos exclusivos por lote; Codex confere respostas, comandos
  e diffs do Gemini e centraliza a validação de navegador. Relatório do agente não substitui prova;
- **23/09** — governança tripartite (Claude, GPT, Gemini) e contrato universal em [`AGENTS.md`](../AGENTS.md):
  separação entre verdade de engenharia (guardas e testes) e verdade de design (sondas de 48 meses);
  regra de independência entre autor e revisor (quem implementa não aprova sozinho); o usuário é a autoridade
  máxima de design;
- **23/09** — achado 68 fechado: o comentário da rolagem em `src/app/paint.mjs` agora declara o
  regime (abaixo de 940px quem rola é a página, `list.scrollTop` fica em 0);
- **23/09** — o Gemini commitou com `git commit -am` e varreu arquivo fora do lote. Regra nova
  no canal: `git add` por nome, nunca `-am`;
- **23/09** — guia compacto [`docs/agent-brief.md`](agent-brief.md) (162 linhas) para retomada econômica:
  evita que agentes leiam 30 ciclos e 12 pesquisas em loop agêntico (lição: varredura cega no Codex consumiu
  6,5M tokens e 95% da cota de 5h). Sessões abrem por `agent-brief.md` + Estado/Fila do handoff;
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

- **69. Prova de voo interrompido oscilou (23/09).** Em `npm.cmd run validate`, a pasta mediu
  719px no corte e 569px dois quadros depois: diferença de 150px, acima do limite de 20%.
  A prova e o código do voo não foram alterados; a prova roda antes das dez asserções novas.
  O passeio inicial e a repetição completa passaram. Causa ainda não isolada; nenhum limite
  foi afrouxado. Evidência: `tmp/codex-validate-flight-failure.log`; rodada final verde em
  `tmp/codex-validate.log`;
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
`agenda` dá 30/43). As seis sondas foram remedidas em 23/09 pelo Codex após o lote de comentários:
imóveis em todas as colunas abaixo. Logs em `tmp/codex-simulate-*.log`.

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
