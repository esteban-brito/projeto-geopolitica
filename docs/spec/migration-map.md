# Mapa de migração — código atual contra a especificação mestra

> **Estado:** revisão de 24/09/2026, depois da resposta dele e do ChatGPT à primeira versão.
> Nada aqui foi implementado. Responde ao §25.2 da [especificação](master-spec.md):
> mapa `especificação → código`, reuso, estado duplicado, conflitos e a menor migração segura.
> Postura: o código existente converge para a especificação com a menor migração
> conceitualmente correta; não se reescreve o jogo porque existe um documento novo.

## Como ler

- **REUTILIZAR** — fica como está, ou quase.
- **ADAPTAR** — a ideia serve; muda interface, ritmo, fonte de estado ou quem chama.
- **SUBSTITUIR** — incompatibilidade conceitual real, dita no bloco.
- **[VERIFICADO]** — conferido em fonte oficial nesta sessão, com a fonte ao lado.
  **[VERIFICAR]** — falta conferir. **[ABERTO]** — pode esperar sem prejuízo.
- `arquivo:linha` aponta o trecho lido. Número sem fonte não entra.

## 1. A resposta curta

Metade do jogo já faz, em escala menor, o que a especificação pede: o `settlement` é uma
previsão que pergunta à mesma conta do turno; a `compose` decide sozinha se uma mudança é
execução, lei ou emenda constitucional; a ESTRATO resolve hierarquia, vigência, gatilho e
revogação; prometer e pagar já são coisas distintas; o `simulate` já é um laboratório. O que
colide de verdade:

| colisão                                                   | onde                                      | destino                                       |
| --------------------------------------------------------- | ----------------------------------------- | --------------------------------------------- |
| o voto é sorteado por bancada                             | `congress/index.mjs:300`, `turn.mjs:1294` | SUBSTITUIR quando o deputado decidir          |
| o afastamento abre sozinho quando três limiares coincidem | `turn.mjs:1517`, `pressure/index.mjs:84`  | ADAPTAR: limiar vira percepção; alguém decide |
| quem vota e a tela leem o estado verdadeiro               | `turn.mjs:520`, `:835`; lista no §5.6     | ADAPTAR: leem o que sabem                     |
| o Congresso não tem gente: 9 bancadas e 8 pessoas-bancada | `cast/index.mjs` `benches()`              | ADAPTAR: deputados individuais                |

LASTRO, CORRENTE, MALHA e SONDA não são substituídos pelo ActorEngine e continuam na frequência
própria de cada um. A semana é unidade de avanço do jogador, e entra como relógio por cima.

## 2. O que foi medido

- save no mês 48, política passiva: **35.387 bytes** (`series` 12.749, `norms` 7.181, `mail`
  6.333, `months` 5.203);
- `playMonth` **0,64 ms** por mês; `settlement` **0,125 ms** por chamada (Node, 48 meses);
- 334 provas: `screens` 46, `turn` 42, `congress` 27, `agenda` 26, `norms` 23, `save` 15, `cast`
  15, `budget` 15, `random` 14, `catalog` 14, `capacity` 14, `passage` 13, `state-reducer` 11,
  `platform` 11, `pressure` 10, `opinion` 9, `mail` 7, `chain` 7, `spring` 6, `calendar` 5,
  `economy` 4; mais 13 guardas;
- `state.month`: 59 referências em 5 arquivos de `src/`; mês em `src/ui` e `src/app`: 76
  referências em 14 arquivos;
- o único sorteio do jogo é o do voto: `unit(` e `take(` aparecem só em
  `congress/index.mjs:300`. O elenco usa hash.

## 3. Fidelidade — o que o código supõe e o Brasil real diz

| #   | premissa do código                                                      | o que é                                                                                                                                                                                                                  | estado                                                                                                                                                                                                                                                                                                                                           |
| --- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 70  | posse em 1º de janeiro (`state.mjs`)                                    | 5 de janeiro, pela EC 111/2021 (art. 82), a partir da eleição de 2026: mandato de 05/01/2027 a 05/01/2031                                                                                                                | **VERIFICADO** — [Senado](https://www12.senado.leg.br/radio/1/noticia/2026/01/05/posse-presidencial-em-2027-sera-em-5-de-janeiro-e-governadores-tomam-posse-no-dia-6), [TRE-PR](https://www.tre-pr.jus.br/comunicacao/noticias/2024/Janeiro/data-da-posse-de-presidente-e-governadores-e-alterada-para-5-e-6-de-janeiro-respectivamente)         |
| 71  | a verba de emenda é moeda discricionária do presidente (`turn.mjs:417`) | emendas individuais somam 2% da RCL do exercício anterior e têm execução obrigatória (CF art. 166, §§ 9º e 11, EC 126/2022)                                                                                              | **VERIFICADO** o percentual e a obrigatoriedade — [Câmara/CMO](https://www2.camara.leg.br/atividade-legislativa/comissoes/comissoes-mistas/cmo/noticias/nota-explicativa-sobre-emendas-individuais-apos-a-emenda-constitucional-no-126-22). **VERIFICAR** bancada, comissão, cronograma, impedimento técnico e o que o Executivo de fato negocia |
| 72  | perder o plenário da Câmara derruba o presidente (`turn.mjs:1523-1536`) | 2/3 da Câmara admitem a acusação; o Senado julga crime de responsabilidade; a suspensão começa quando o Senado instaura, e cessa em 180 dias sem julgamento (art. 86); condenar exige 2/3 do Senado (art. 52 par. único) | **VERIFICADO** — texto dos arts. 86 e 52 reproduzido em busca com a página do [STF](https://portal.stf.jus.br/constituicao-supremo/artigo.asp?abrirBase=CF&abrirArtigo=86); o Planalto recusou conexão                                                                                                                                           |
| —   | o Congresso funciona todo mês                                           | sessão legislativa de 2/2 a 17/7 e de 1/8 a 22/12 (art. 57, EC 50/2006)                                                                                                                                                  | **VERIFICADO** — [STF, art. 57](https://portal.stf.jus.br/constituicao-supremo/artigo.asp?abrirBase=CF&abrirArtigo=57)                                                                                                                                                                                                                           |
| —   | a gaveta mata um texto em 6 meses (`passage.mjs`, `DRAWER_LIFE`)        | **legado não validado**: parâmetro de design sem base institucional apresentado como rito. Na Câmara, o arquivamento seria por fim de legislatura (RICD art. 105)                                                        | **VERIFICAR** (R4). Fica só pela compatibilidade; não entra na ESTRATO, no calendário nem no Congresso novo                                                                                                                                                                                                                                      |
| —   | um texto votado por mês                                                 | regra de jogo, não de instituição                                                                                                                                                                                        | sai com a tramitação em dias                                                                                                                                                                                                                                                                                                                     |
| 73  | o líder no Senado arrasta cadeiras da Câmara                            | defeito de modelagem: `benches()` não filtra cargo, e `senate-centrao` leva 35% a 55% das cadeiras da Câmara do partido                                                                                                  | conferido no código                                                                                                                                                                                                                                                                                                                              |
| 74  | a carga tributária move o PIB                                           | canal morto: `turn.mjs:1451-1452` passa a mesma carga como `taxLoad` e `baseTaxLoad`                                                                                                                                     | conferido no código                                                                                                                                                                                                                                                                                                                              |

Cada achado se corrige na etapa que toca o sistema (§6). Nada marcado **VERIFICAR** vira coeficiente, procedimento ou regra canônica do motor novo antes da pesquisa correspondente. O 71 não se corrige trocando uma moeda
por outra: exige a pesquisa R1 antes da mecânica nova.

## 4. Subsistema por subsistema

Cada bloco responde às dez perguntas: **1** o que faz · **2** que problema de jogo resolve ·
**3** fonte de estado · **4** quem depende · **5** colisão · **6** veredito · **7** menor
mudança · **8** o que quebra · **9** provas que continuam · **10** prova nova.

### 4.1 Turno e calendário — `application/turn.mjs`, `application/calendar.mjs`, `data/regime.mjs`

1. `playMonth` é uma transação mensal: fecha cartas, anda a tramitação (um voto por mês), assenta
   lealdade e memória, roda MALHA, LASTRO, CORRENTE, SONDA e CALDEIRA, decide o afastamento,
   monta a posição do mês seguinte, escreve cartas e séries. `calendarOf` é função pura do mês
   com quatro marcos reais (mínimo, LDO, PLOA, bimestral).
2. Um mês com causa e efeito; um ano fiscal com forma.
3. `state.month` (0 a 48). Constantes: `MONTHS_PER_TERM = 48`, `SERIES_LENGTH = 48`
   (`turn.mjs:1704`), `DRAWER_LIFE = 6`, `ANSWER_TIME = 2`, `KEEP` e `CARRY = 24`.
4. O botão de avançar (`handlers.mjs:113`, única chamada), o `simulate`, 42 provas do turno.
5. §4 (semana), §14.3 (votação em data própria), §12 (iniciativa explícita, não pacote mensal).
6. **ADAPTAR.** `playMonth` não morre; vira o fechamento mensal chamado pelo relógio.
7. Relógio em dias por cima (§5.1).
8. Nada em W1. Em W2, as provas que supõem um voto por mês.
9. As de LASTRO, CORRENTE, MALHA, SONDA e as do turno que medem o fechamento.
10. **Equivalência pela projeção legada** (§5.1).

### 4.2 Estado e save — `state/state.mjs`, `state/save.mjs`

1. `GameState` imutável, um redutor com uma ação (`monthResolved`), save = JSON do estado,
   versão diferente recusada (`SCHEMA_VERSION = 20`), checagem de forma de cada campo.
2. Determinismo e save honesto.
3. O `GameState`. O elenco não é gravado: sai da semente.
4. Tudo.
5. Nenhuma de conceito (§18.13).
6. **REUTILIZAR.** O padrão "núcleo gerado da semente, só o mutável gravado" mantém o save
   pequeno com centenas de atores.
7. Campos novos por etapa; uma ação nova no redutor por tipo de avanço.
8. `SCHEMA_VERSION` sobe; saves antigos são recusados (decisão de 24/09: sem conversor).
9. As 15 de save.
10. Continuidade semanal: salvar e carregar em qualquer semana continua como continuaria sem o
    save.

### 4.3 Aleatoriedade — `state/random.mjs`

1. Fluxos nomeados, semeados e contados.
2. Reprodutibilidade.
3. `state.streams.congress`, único fluxo gravado.
4. `vote()` e o plenário do afastamento.
5. Nenhuma no mecanismo. Muda a doutrina escrita no cabeçalho ("só TEMPORAL e ECLUSA
   sorteiam"): ECLUSA perde a licença quando o deputado decidir; a pesquisa ganha uma.
6. **REUTILIZAR.**
7. Fluxos novos só com consumidor (`polls`, `world`). O `congress` sai na etapa D1.
8. Nada.
9. As 14 de `random`.
10. Uma por fluxo novo.

| uso hoje                               | classe                   | onde                         | destino                           |
| -------------------------------------- | ------------------------ | ---------------------------- | --------------------------------- |
| desvio do voto por bancada             | **substituindo agência** | `congress/index.mjs:300`     | temporário; sai na etapa D1       |
| plenário do afastamento (mesmo `vote`) | **substituindo agência** | `turn.mjs:1523`              | sai com a CALDEIRA adaptada (F)   |
| nome, ambição, pasta, desvio, alcance  | geração, por hash        | `cast/index.mjs`             | fica; padrão a copiar             |
| nome do presidente                     | geração, por hash        | `cast/index.mjs` `president` | fica                              |
| choque de oferta                       | mundo, injetado de fora  | `economy/index.mjs:79`       | choque exógeno, com fluxo próprio |
| pesquisa                               | observação — não existe  | `opinion/index.mjs` `pollOf` | nasce na etapa C1                 |

O comentário "Sorteio 50%" em `state.mjs:108` está velho: o tratamento é escolha do jogador
(`handlers.mjs:174-176`).

A troca que tira o sorteio do voto sem tirar a incerteza do jogador: cada deputado nasce com
traços que o governo não conhece (geração, por hash). A estimativa do governo erra porque não
sabe esses traços, não porque um dado rolou no dia (§20.3 da especificação).

### 4.4 ELENCO — `domain/cast/index.mjs`, `data/cast.mjs`

1. Gera 8 pessoas de 8 arquétipos com nome, gênero, posição, venalidade, ambição (5 tipos),
   pasta e alcance. `remember` assenta a memória (-cap a +cap); `benches` faz de cada pessoa uma
   bancada de uma; `offered` muda o valor da verba pela ambição.
2. Gente com nome e memória; Congresso diferente por partida.
3. Núcleo derivado da semente; memória em `state.memory`.
4. `settlement`, `governmentOf`, `advanceBills`, tela.
5. §9.13 (fábrica por papel), §9.2, §9.8 (relação direcional), §9.9 (memória de evento).
6. **ADAPTAR.** Ficam o gerador por hash, o ADR 0003 e a separação núcleo/mutável. A
   memória-escalar vira relação mais memória de evento.
7. O gerador produz `ACTOR.person` com os campos do §9.2; os 8 arquétipos seguem focais.
8. As provas de `benches` e `offered`.
9. As de geração (mesma semente, nomes sem repetição, arquétipo novo não muda os outros).
10. "Trocar só a personalidade muda a decisão em cenário controlado" (§20.1).

### 4.5 ECLUSA — `domain/congress/index.mjs`

1. `whipCount`: previsão por bancada (distância com a dispersão do texto como terceiro eixo,
   venalidade × verba, ameaça à máquina, rua, curva logística, comparecimento pela lealdade com
   degraus de obstrução e ruptura). `vote`: o mesmo, mais um desvio sorteado por bancada.
   `settle`: a lealdade do mês. Leituras: `baseCount`, `baseSplit`, `baseVenality`, `seating`,
   `dispersion`.
2. Aprovar custa; comprar tem limite; prometer e não pagar custa mais que não prometer.
3. `state.loyalty`, `state.streams.congress`.
4. `settlement`, `forecast`, `advanceBills`, `tables`, afastamento, tela do Congresso.
5. §14.5, §18.14, §20.3, §10.4, §7.3.
6. **ADAPTAR como ancestral e regressão comportamental; SUBSTITUIR o sorteio.** A fórmula atual
   não é a função definitiva do deputado: carrega premissas antigas (bancada no lugar do
   indivíduo, lealdade escalar, verba como moeda, sorteio, logística agregada). Pesos e forma
   matemática se recalibram no ActorEngine individual.
7. No laboratório, deputados individuais cujo comportamento tem de reproduzir os
   comportamentos válidos abaixo. No jogo, `whipCount` sobrevive como leitura provisória até a
   estimativa do governo sobre as crenças dele existir (D2).
8. As provas do sorteio: "o DIA muda com a semente", "a votação consome um saque POR BANCADA",
   "A BANDA MEDE O SORTEIO", "A BANDA NAO E O PIOR CASO", "base insatisfeita e base
   IMPREVISIVEL". A série muda em D1, por projeto.
9. **Os comportamentos a preservar, cada um já provado hoje:**

   | comportamento                         | prova de hoje                                                  |
   | ------------------------------------- | -------------------------------------------------------------- |
   | orientação partidária importa         | "O SEU PARTIDO NAO SE COMPRA", "E ELA SO VALE PARA A SUA"      |
   | compromisso importa; romper custa     | "PROMESSA QUEBRADA CUSTA BASE", "O CONGRESSO RESPONDE AO PAGO" |
   | base eleitoral importa                | "A RUA PESA NA VOTACAO"                                        |
   | pauta importa                         | "O PRECO DEPENDE DO ASSUNTO", "O PACOTE PAGA PELO TAMANHO"     |
   | ameaça e interesse importam           | "A MAQUINA SE DEFENDE"                                         |
   | presença importa                      | "lealdade no chao derruba a entrega", "A RUPTURA E UM DEGRAU"  |
   | nada passa de graça, nada é invotável | "o caminho facil NAO existe", "NENHUMA PAUTA E INVOTAVEL"      |
   | pagar nunca afasta                    | "verba NUNCA reduz a adesao"                                   |

   Viram provas de comportamento sobre deputados individuais; o texto de cada uma troca
   "bancada" e "verba" pelo que o modelo novo tiver.

10. Os oito do §20.3 (o do Senado depois de D3).

### 4.6 SONDA — `domain/opinion/index.mjs`, `data/opinion.mjs`

1. Três segmentos de renda (42%, 38%, 20%), satisfação 0 a 100 por segmento; alvo de cinco
   notas com peso por segmento, menos traição e desgaste; inércia assimétrica; a população lê
   inflação e desemprego divulgados, com defasagem (`release`); a pesquisa é função
   determinística da satisfação.
2. A rua responde ao país que sente.
3. `state.mood`.
4. ECLUSA, ELENCO, CALDEIRA, cartas, fecho, tela.
5. A pesquisa é a verdade; quem vota lê a verdade; não há canal de informação.
6. **ADAPTAR.** Os segmentos são o estado agregado da sociedade. A defasagem de divulgação já é
   um embrião do modelo de informação.
7. Preservar os três segmentos, o `step`, a inércia, os indicadores divulgados; acrescentar a
   pesquisa como observação (C1). Um modelo fatorizado (geografia, valores, temas) vem depois,
   quando se souber que problema de jogo ele resolve (§5.5).
8. Nada em C1. Em C2 (quem vota lê a pesquisa) a série muda.
9. As 9 de `opinion`.
10. "Duas pesquisas no mesmo mês divergem dentro da margem e não movem a satisfação"; "quem não
    recebeu a pesquisa não muda de crença".

### 4.7 LASTRO — `domain/budget/index.mjs`

1. Receita = PIB × carga × fatores; obrigatória cresce com taxa real e inflação; teto do
   arcabouço com a fração do exercício; folga; primário contra meta e banda; dívida.
2. Déficit é possível; teto legal não é caixa.
3. `state.fiscal`.
4. `settlement`, `ledger`, `nextPosition`, `situationOf`, Finanças.
5. Nenhuma de conceito.
6. **REUTILIZAR.** Mensal.
7. Nenhuma agora. Extensões futuras com etapa própria: receita por base (B1 do ciclo 30,
   achado 26); o tratamento das emendas depois da pesquisa R1.
8. Nada.
9. As 15 de `budget`.
10. As das extensões.

Premissa a revisar: o rateio (`ratio`, `protect`) é automático e proporcional, dentro de
`settlement`. No Brasil é decisão do Executivo a cada relatório bimestral — com calendário, uma
data, e com ela um Momento Presidencial (candidato de corte, §6.3).

### 4.8 CORRENTE — `domain/economy/index.mjs`

1. Hiato, Phillips, Taylor com suavização, Okun, população; `carry`; `premiumOf`.
2. Gastar tem efeito; dívida vira juro; juro freia o PIB.
3. `state.macro`.
4. `playMonth`, `ledger`, opinião, gatilhos de norma.
5. Nenhuma. A regra de Taylor é o BC como regra, e a especificação aceita isso.
6. **REUTILIZAR.** Mensal.
7. Nenhuma agora. **[ABERTO]** Selic só nas reuniões do Copom; o mandato do presidente do BC
   (LC 179/2021, **[VERIFICAR]**) como Momento Presidencial cujo efeito é parâmetro da regra.
8. Nada.
9. As 4 de `economy`.
10. Nenhuma para a migração.

### 4.9 ESTRATO — `domain/norms/index.mjs`

1. Pilha de normas de faixa com hierarquia, especificidade, recência e ordem; gatilho, vacatio,
   vigência, exceção, revogação, vinculação à receita; norma dormente com motivo.
2. Reformar é desmontar; a lei derrubada não volta sozinha.
3. `state.norms` (fontes); faixas **derivadas** a cada leitura.
4. `settlement`, `bandsOf`, `lockedBy`, `agenda`, `passage`, fecho, tela de regras.
5. É o embrião de `LEGAL_SOURCE` → `GAME_RULE` (§13). Faltam cláusulas não numéricas, mais
   níveis (lei complementar, decreto, medida provisória), cláusulas pétreas, vigência em datas,
   fonte oficial por norma.
6. **ADAPTAR — e antes de qualquer `LegalResolver` novo.** Decisão de 24/09: a ESTRATO se
   generaliza; um resolvedor novo só entra se a generalização se mostrar inviável.
7. Generalizar `Norm.kind`; datas; `official_ref` nas 44 normas herdadas.
8. As provas que supõem mês na vigência.
9. As 23 de `norms`.
10. "Apagar a projeção e reconstruí-la das fontes dá o mesmo valor"; "o histórico de uma regra
    sai das fontes, sem registro próprio".

### 4.10 MALHA — `domain/capacity/index.mjs`

1. Oito índices: decaimento, rendimento, atraso por área, canal de capacidade (educação →
   indústria, 24 meses), canais de receita e obrigatória.
2. O país muda devagar.
3. `state.capacity`.
4. `settlement`, CORRENTE, SONDA, CALDEIRA, áreas, `outlook`, `trajectory`.
5. §16.2: tipos de execução distintos. `Program.weight` e `Program.lag` ninguém lê.
6. **ADAPTAR**, mais tarde.
7. Nenhuma agora. O gancho `impacts` (salto por ação aprovada, hoje sempre `{}`) serve para a
   obra entregue.
8. Nada.
9. As 14 de `capacity`.
10. "A obra entregue entra por `impacts` no mês da entrega".

### 4.11 DELTA — `domain/graph/index.mjs`, `application/chain.mjs`

1. O grafo causal da MALHA, lido do catálogo; `chainOf` diz por que uma área mudou.
2. Causalidade legível.
3. Nenhum.
4. Tela das áreas.
5. Nenhuma. É o trace do mundo material.
6. **REUTILIZAR.** 7–10. Nada muda; as 7 de `chain` ficam.

### 4.12 CALDEIRA — `domain/pressure/index.mjs` e o afastamento em `turn.mjs`

1. Quatro grupos com estoque de pressão; queixa do mês; inércia assimétrica; exigência por carta;
   três rupturas; as três juntas abrem o processo sozinhas (`turn.mjs:1517`); o presidente
   sobrevive com 172 votos; a cadeira custa 3 vezes mais no cerco (`SIEGE_PRICE`).
2. Governo que não entrega cai; governo que entrega não cai.
3. `state.pressure`, `state.impeachment`, `state.fallen`.
4. `playMonth`, cartas, fecho, Estado.
5. §15.1, §23.1, §17.5; fidelidade do achado 72.
6. Por parte:
   - `heat` → **ADAPTAR**, sem supor dono. O estoque pode sobreviver como sinal agregado; só vira
     estado de um ator onde houver ator (tabela abaixo);
   - `rupture` → **ADAPTAR** em detector: percepção de oportunidade e de legitimidade para quem
     pode agir;
   - a abertura automática → **SUBSTITUIR**: o presidente da Câmara decide receber um pedido que
     alguém protocolou;
   - `SIEGE_PRICE` → **SUBSTITUIR**: o poder de barganha é derivado (§10.9);
   - a carta de exigência → **ADAPTAR** em `REQUEST` com prazo. Silêncio não é resposta: o prazo
     expira, e o grupo interpreta a falta de resposta pelo contexto dele (especificação §10.2).
7. O automatismo mora em duas linhas (`:1517`, `:1523`). Tirá-las preserva o resto.
8. "O PROCESSO SO ABRE COM AS TRES RUPTURAS JUNTAS", "O PROCESSO DA UM TURNO DE LEILAO",
   "SOBREVIVER AO PLENARIO ARQUIVA", "O PLENARIO DO AFASTAMENTO GASTA FLUXO".
9. "A INACAO ESQUENTA", "ELA SOBE MAIS RAPIDO DO QUE DESCE", "A PRESSAO FICA ENTRE 0 E 100",
   "QUEM NAO PESA NAO ABANDONA O CAPITAL", "O MERCADO PEDE CORTE", e a principal, com outra
   forma: "A QUEDA ACONTECE, e ela NAO acontece com um governo que entrega".
10. A mesma condição com dois presidentes da Câmara diferentes dá dois resultados, e o trace diz
    por quê.

O que cada grupo é, sem antropomorfizar:

| grupo        | o que o código lê                     | o que é no mundo                                                 | classificação proposta                                                                                               |
| ------------ | ------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| mercado      | dívida contra a herdada               | comportamento agregado com preço observável                      | **indicador agregado**; o preço já está em `premiumOf`. Organizações concretas (federações) só se precisarem agir    |
| fisiologismo | verba entregue às bancadas            | deputados e partidos do centrão                                  | **rede de atores que já existe**: são os partidos e pessoas da ECLUSA. O estoque e a lealdade leem o mesmo fato (§8) |
| produtivo    | índices de infraestrutura e indústria | confederações e empresas de setor                                | **agregado** agora; organização concreta quando empresas e setores entrarem                                          |
| ordem        | índices de segurança e defesa; peso 0 | instituições com hierarquia (Forças Armadas, polícias estaduais) | **instituições**, não grupo de pressão; decidir com cuidado quando entrarem                                          |

O afastamento sai do primeiro corte vertical. Entra depois dele, com o Senado no rito de
responsabilização (etapa F).

### 4.13 Pauta — `application/agenda.mjs`

1. `compose` compara nível pedido com vigente e faixas pedidas com vigentes, decide o rito de
   cada movimento, rebaixa pelo poder do Executivo e monta uma proposta do mês.
2. O jogador diz o país que quer; o jogo diz o que isso exige.
3. Nenhuma: pura.
4. `settlement`, `passage`, tela, `stanceOf`.
5. Embrião do Motor de Intenção e do resolvedor para `ALLOCATE` e `SET_LIMIT`. Colide num
   ponto: um pacote por mês, avaliado pelo centro.
6. **ADAPTAR.**
7. `INITIATIVE` explícita por texto; a ordem de execução segue como ordem permanente aplicada no
   fechamento.
8. "O PACOTE PAGA PELO TAMANHO", "REPETIR A ORDEM NÃO COBRA DUAS VEZES".
9. As de rito e rateio.
10. "A mesma cláusula tem o mesmo rito sozinha ou acompanhada".

### 4.14 Tramitação — `application/passage.mjs`

1. Gaveta, relatoria, plenário; a Mesa pauta se o presidente da Câmara tende ao sim (0,38); o
   relator retira a alavanca machucada mais próxima dele quando o texto machuca duas ou mais; a
   gaveta mata em 6 meses; um voto por mês.
2. Ter voto não basta; o relator muda o texto.
3. `state.bills`.
4. Turno, cartas, tela.
5. §14.3–14.4. `except` já é "a tramitação remove cláusula". Colide: Mesa e relator são regra
   fixa; não há Senado; a gaveta de 6 meses não tem fonte (§3).
6. **ADAPTAR.**
7. Tempo em dias e votação em data de sessão (B4); depois, Mesa e relator como atores.
   `DRAWER_LIFE` é legado não validado: fica só enquanto a compatibilidade pedir e é substituído
   pelo que R4 encontrar (quem controla a pauta, quando há arquivamento, fim de legislatura,
   desarquivamento, rito por tipo de proposição).
8. As 13 de `passage`.
9. "O relator não esvazia o texto"; "sem presidente da Câmara a gaveta não existe".
10. "No recesso ninguém vota"; "o mesmo texto com outro relator sai diferente".

### 4.15 Correspondência — `application/mail.mjs`

1. Cartas com 16 tipos, prazo em meses, resposta aceitar/recusar/silêncio; o silêncio aceita a
   emenda do relator e recusa a exigência de um grupo; retenção de 24 meses.
2. O único lugar que espera resposta.
3. `state.mail`.
4. Turno, tramitação, Email, Gabinete.
5. Os 16 tipos misturam pedido, aviso, alarme e relatório. §6.6: o Email é canal.
6. **ADAPTAR.** A carta vira apresentação de um evento dirigido ao presidente; a resposta é
   `RESPOND`. O silêncio não é resposta: a emenda do relator que vale salvo objeção é um ato com
   padrão; a exigência de um grupo é um pedido com prazo. As duas semânticas de hoje sobrevivem
   por esse caminho, sem regra universal.
7. Prazo em dias (B3); carta como vista derivada do evento (depois de A2).
8. As 7 de `mail`; parte das 18 referências a mês do `inbox.mjs`.
9. "O silêncio na chantagem recusa, ao contrário da emenda" — reescrita como "o padrão da
   emenda vale salvo objeção; o pedido do grupo expira".
10. "Toda carta aponta um evento; refazer a bandeja dos eventos dá a mesma bandeja".

### 4.16 Plataforma — `application/platform.mjs`

1. Três compromissos da posse, julgados no fim; quebrar tira satisfação.
2. Promessa pública com cobrança.
3. `state.platform`.
4. SONDA, fecho.
5. É um `COMMITMENT` público (§10.4).
6. **ADAPTAR** o armazenamento. 7. Entra no livro de compromissos (A3 no laboratório, D1 no
   jogo). 8. Nada até lá. 9. As 11 de `platform`. 10. "A promessa da posse e a promessa ao líder
   usam o mesmo objeto".

### 4.17 `simulate` — `tools/simulate.mjs`

1. 48 meses no terminal com política-sonda, partido e semente; imprime a série do handoff.
2. Calibragem e regressão.
3. Nenhuma.
4. Laço de motor; handoff.
5. §19.2 pede laboratório com código de produção: é isto.
6. **ADAPTAR.** Casa do laboratório.
7. Modo de cenário com catálogo sintético. O padrão `catalog = CATALOG` como parâmetro, em quase
   toda função de `turn.mjs`, permite rodar produção com 20 deputados sintéticos.
8. Nada. 9. A série mensal. 10. O relatório "por que o ator X fez Y" (§19.6).

### 4.18 Interface — `src/ui/`, `src/app/`

1. Treze endereços; dock no Gabinete, coluna fora dele; barra superior.
2. Governar com a mão.
3. `session`; o jogo só pela fachada.
4. O jogador.
5. §6. Descartada é a obrigação de oito botões de área, não as áreas. §6.1 e invariante 21: a
   tela lê o que a Presidência sabe (§5.6).
6. Gabinete, barra, dock e Email → **REUTILIZAR**; o resto → **ADAPTAR** na etapa de UI.
7. Nenhuma antes de B6. Em B1 o botão continua mensal, e por baixo avança semanas até o
   fechamento: um caminho de código só.
8. `screens` e passeio, na etapa de UI.
9. Macaco, pílula, gaveta, diálogo e as 30 asserções de interação.
10. Por etapa.

### 4.19 Normas herdadas e catálogos — `src/data/`

1. 38 programas em 8 áreas, 6 regras, 9 partidos (513 cadeiras), 4 grupos, 3 segmentos, 4
   marcos; 44 normas herdadas.
2. O mundo real com número e fonte.
3. Os catálogos.
4. Tudo.
5. §13.2 exige `official_ref`; hoje a fonte está em comentário.
6. **ADAPTAR** por dado — inventário com prova, cabe num lote do Gemini.
7. Campo `source` validado pelo esquema.
8. Nada. 9. As 14 de `catalog`. 10. A guarda de esquema cobra `source` nas herdadas.

`bills.mjs` é catálogo morto fora `quorumOf` (achado aberto). `REGIME.qualifiedShare` e
`removalShare` são regras reais escritas como constante: viram fonte jurídica quando a ESTRATO
generalizada existir, para que uma PEC possa mudá-las.

## 5. Os temas transversais

### 5.1 Semana sobre mês

| caminho                | o que é                                                                                                 | defeito                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **W1 — casca interna** | relógio em dias; ao cruzar o fim de um mês civil, `playMonth` roda inteiro                              | sozinho, três de quatro semanas vazias: não chega ao jogador (decisão de 24/09) |
| **W2 — duas metades**  | o fechamento material fica mensal; tramitação, cartas e prazos ganham data; a iniciativa vira explícita | é o que dá conteúdo à semana; exige a iniciativa explícita                      |
| W3 — tudo semanal      | converter taxas para sete dias                                                                          | nenhum ganho; quebra calibragem e série                                         |

**Decisões de 24/09:** W1 interno; a semana chega ao jogador em W2; `state.date` é a autoridade
temporal; `state.month` fica em W1 como espelho de compatibilidade, escrito na mesma transação,
com prova de igualdade, e sai quando os consumidores migrarem; semana civil como direção, com a
primeira parcial; o calendário real é a autoridade.

**A prova de W1 — projeção legada.** Estado byte a byte não serve: `state.date` e o que vier
depois mudam o estado inteiro. A prova compara só o que os 48 `playMonth` de hoje produzem:

```text
legacyProjection(state) = o GameState de hoje sem schemaVersion:
  seed, president, platform, party, month, mood, loyalty, fiscal, macro, capacity,
  series, levels, norms, months, bills, mail, pressure, impeachment, fallen, memory, streams

48 playMonth legados  ==  avanços semanais que atravessam os mesmos 48 fechamentos,
                          comparados pela legacyProjection, com igualdade exata
```

A função mora em `tests/`, não em `src/`: é instrumento de prova, não arquitetura. Ela vence
quando B3 e B4 mudarem a semântica de cartas e textos — e vence por decisão, não por falha: o
lote que a aposenta registra qual regra mudou de propósito, por que o comportamento antigo deixa
de ser contrato, e entrega a prova nova que o substitui. Remover uma prova porque começou a
falhar não é aposentá-la. Dali em diante vale a **projeção
material** na política passiva (sem ordens, sem textos): `fiscal`, `macro`, `capacity`,
`series`, `mood`, `loyalty`, `memory`, `pressure`, `levels`, `norms`. A lista exata se fecha
no lote que a usar, com uma regra: entra na projeção todo campo cuja matemática o lote não
mudou.

**Calendário civil contra efeitos calibrados em mês inteiro** — registrado, não resolvido
(especificação §4.5):

- primeiro mês parcial (05/01 a 31/01/2027);
- últimos dias do mandato (01/01 a 05/01/2031);
- 2028 bissexto;
- quando o fechamento mensal acontece dentro da semana que cruza o fim do mês;
- o que as séries registram;
- onde um efeito proporcional à fração do período faz sentido.

W1 preserva a equivalência por compatibilidade: janeiro de 2027 fecha como mês inteiro, e o
mandato de W1 termina no 48º fechamento, em 31/12/2030, deixando 01/01 a 05/01/2031 fora. É uma
escolha de compatibilidade declarada, não o calendário final: W2 decide.

O que evita a semana artificial é o calendário institucional real — sessão legislativa (art.
57, **VERIFICADO**), reuniões do Copom, divulgações do IBGE, relatório bimestral, LDO, PLOA,
eleições —, cada regularidade como regra com fonte (pesquisa R2). A primeira versão deste mapa
dizia "sessões de terça a quinta": era suposição minha, e sai.

**[ABERTO]** "Avançar até o próximo assunto": depende de medir quantas semanas quietas W2 produz.

### 5.2 `EVENT` — mínimo, medido antes de sofisticar

Os dois testes e a forma mínima estão na especificação §7.5. Decisão de 24/09: **nada de coleta
de lixo, marcação por referência, contador agregado ou compactação agora.** A ordem é criar o
evento mínimo, rodar o laboratório, contar eventos por semana, medir o save e o tempo, e só
então decidir retenção.

**A identidade.** `e:<dia>:<ordem>` não fica congelado. O problema: com uma ordem global do dia,
um evento não relacionado emitido antes renumera todos os seguintes. Dentro de uma rodada isso
continua determinístico, mas quebra três coisas — a comparação de traces entre duas versões do
código (diferença falsa em tudo), provas que fixam um id, e a estabilidade quando a ordem de
emissão depende da ordem de processamento (acrescentar um ator renumera os outros).

| alternativa                                                                | estável contra evento não relacionado               | custo                                        |
| -------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------- |
| ordem global do dia                                                        | não                                                 | nenhum                                       |
| **contador local por emissor**: dia + emissor + n-ésimo evento dele no dia | sim; só um evento do mesmo emissor renumera os dele | legível; é o padrão do elenco (chave por id) |
| hash do conteúdo causal                                                    | sim                                                 | desempate para eventos idênticos; ilegível   |

Recomendo o contador local por emissor; decide-se no laboratório (A2).

`ACTION` e `EVENT` continuam separados (decisão de 24/09, especificação §7.5), ligados por
referência nos dois sentidos, sem cópia do conteúdo.

### 5.3 Cognição e processamento

Correção da primeira versão, que misturava os dois:

- **cognição** (heurístico ↔ deliberativo) é regra do ActorEngine e muda resultado. Escolhida
  por saliência, conflito entre objetivos, risco, compromisso, informação nova e prazo. Não é
  gravada: sai da situação a cada decisão e fica registrada no trace;
- **processamento** (dormente ↔ ativo ↔ focal) é classificação do agendador e da interface.
  Não é estado canônico do ator, não é gravada e nem precisa existir como tipo no domínio:
  são rótulos do agendador e do diagnóstico.

A garantia que torna a separação verificável é uma **equivalência semântica**: a avaliação
completa (todos os atores elegíveis) e a agendada (só os que têm causa válida para despertar)
produzem as mesmas ações, as mesmas mudanças persistentes, os mesmos compromissos e os mesmos
eventos materialmente relevantes. Logs, traces de otimização e custo podem diferir. Isso vira
prova no laboratório (A5) e é a forma executável da invariante 18.

Consequência de projeto: toda condição temporal necessária a uma decisão está agendada ou é
derivável, e o agendador não deixa de acordar ninguém por falta de clique. As causas de
despertar candidatas (especificação §9.14, não congeladas): nova informação relevante, prazo,
acompanhamento agendado, mudança de regra, mudança material em objetivo acompanhado, pedido ou
ação recebida, evento relacionado, falha ou conclusão do plano, oportunidade detectável.

`FOCAL` muda só a superfície (quem aparece na tela) e, no máximo, quanto do trace se guarda.

### 5.4 O ActorEngine não vira deus

```text
src/domain/actors/   percepção → crença → escolha de intenção → escolha de ação, e o trace
                     recebe o estado do ator, a informação que chegou, o repertório válido
                     e os termos de avaliação — os dois últimos vêm de fora
src/application/     monta o repertório (a ESTRATO generalizada diz o que é válido),
                     monta os termos (o voto, o fisco), executa as ações e grava os eventos
```

A ECLUSA fornece comportamento para o voto, como ancestral; o BC segue regra de Taylor; o mercado
segue preço; a opinião segue agregada. Só vira ator quem decide. A guarda `boundaries` não impede
um motor de importar outro (hoje nenhum importa, conferido com `grep`); a guarda nova entra em A1.

### 5.5 Opinião pública — mínimo primeiro, fatorizado depois

Preservar: os três segmentos, o `step`, a inércia, os indicadores divulgados. Acrescentar: a
pesquisa como observação (evento de publicação: instituto, data, amostra, margem; valor = função
do estado + erro amostral do fluxo `polls`). Atores formam crença pela pesquisa publicada e pelo
contato com a base; ninguém lê o estado.

Depois disso, e só quando se souber que problema de jogo resolve, um modelo **fatorizado**:
dimensões independentes que se somam — uma distribuição geográfica independente da renda,
modificadores territoriais, valores por tema — em vez do produto `renda × UF × idade × religião
× ideologia × tema`.

Correção da primeira versão: `REGIONAL_DELIVERY` não exige pesquisa regional. O deputado avalia
entrega pela obra na base, pelo emprego, pela infraestrutura, pelo serviço, pelos atores locais.
Isso pede geografia dos **efeitos materiais**, não necessariamente da **opinião**. A decisão
sobre geografia fica aberta.

### 5.6 A visão presidencial — o que hoje lê verdade oculta

A regra (especificação §6.1, invariante 21, CLAUDE.md) é epistemológica. Antes de qualquer
objeto, a lista das consultas que precisarão dela, com o que a Presidência realmente sabe:

| consulta de hoje                                                    | onde a tela lê                                         | o que é                                         | o que a Presidência sabe                                     | lote   |
| ------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------ | ------ |
| `pollFrom(state.mood)`                                              | `inputs.mjs:162`, `:198`; `paint.mjs:230`; `brief.mjs` | a opinião verdadeira                            | a última pesquisa publicada                                  | C1     |
| `state.macro` do mês                                                | `inputs.mjs:64`; `paint.mjs:233`                       | inflação, PIB e desemprego verdadeiros de agora | o divulgado, com a defasagem do calendário do IBGE           | C3     |
| `state.loyalty`, `situationOf`                                      | `inputs.mjs:42`, `:85`, `:160`; `paint.mjs:126`        | a lealdade verdadeira de cada bancada           | a estimativa do líder do governo                             | D2     |
| `forecast` (placar)                                                 | `inputs.mjs:33`; `congress.mjs`                        | adesão verdadeira de todas as bancadas          | a estimativa do governo sobre crenças dele                   | D2     |
| `governmentOf` e as pessoas de `forecast` (ambição, pasta, memória) | `inputs.mjs:88`, `:108`, `:163`                        | motivação privada e saldo de memória            | reputação e o que foi dito ou visto                          | D2     |
| `boilerOf`                                                          | `inputs.mjs:99`, `:161`; `phone.mjs`                   | estoque interno de pressão e limiares           | sinais públicos: notas, protestos, declarações, preço        | F      |
| `state.capacity.index`, `alertsOf`                                  | `inputs.mjs:74`, `:214`; `paint.mjs:135`, `:174`       | o índice verdadeiro de cada área                | os indicadores do próprio governo, com defasagem e qualidade | depois |
| `outlook`, `trajectory`, `chainOf`                                  | `inputs.mjs:219-240`                                   | projeção a partir do estado verdadeiro          | projeção técnica a partir do que se sabe                     | depois |
| `ledger`, `passageOf`, `lockedBy`, `bandsOf`, `calendarOf`, cartas  | vários                                                 | contas e atos do próprio governo                | conhecidos: ficam como estão                                 | —      |
| `termOf`                                                            | `paint.mjs:194`                                        | balanço do mandato                              | **[ABERTO]** se o fecho revela o oculto                      | —      |

Não se cria um objeto `PresidentialView` agora. Cada linha migra no lote indicado.

### 5.7 Informação, `ASSERT` e evento — o modelo mínimo

Compartilham conteúdo e têm semânticas diferentes. Decisões de 24/09: `ACTION` e `EVENT`
continuam separados; `PROPOSITION` não vira objeto agora. O modelo que tira a cópia sem apagar a
causalidade:

| passo                 | onde mora                                                                                                                                                                        | gravado?                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| intenção de comunicar | no plano da `INTENTION` do ator                                                                                                                                                  | como parte do plano       |
| ação executada        | `ACTION` do tipo `ASSERT`: ator, canal, audiência, conteúdo, e referência aos eventos que gerou                                                                                  | sim                       |
| ocorrência            | `EVENT` que referencia a ação; uma ação pode gerar vários, falhar sem gerar o esperado, e há eventos que nenhum ator causou                                                      | sim                       |
| conteúdo              | representação estruturada compartilhável (sujeito, atributo, valor), guardada uma vez; repasse, vazamento e notícia **referenciam** em vez de copiar                             | uma vez                   |
| informação recebida   | derivada da audiência e do canal **no momento do evento**, registrada na crença de quem recebeu (`source_refs`); repasse ou distorção por outro ator é outra ação com seu evento | não como registro próprio |
| crença formada        | estado do ator: estimativa, confiança, `source_refs`                                                                                                                             | sim                       |

`PROPOSITION` vira objeto só diante de necessidade concreta: várias ações referenciando a mesma
proposição, proveniência, contradição formal, deduplicação, investigação, cadeia longa de
transmissão ou identidade estável. O que forçaria um registro próprio de informação recebida:
distorção ou atraso por receptor que não seja ato de outro ator. `OBSERVATION` fica aberta: não
se grava por padrão.

### 5.8 ADR 0003 contra a especificação

O ADR determina: toda pessoa do jogo é fictícia (nome inventado, arquétipo reconhecível); vale
para todo personagem nomeado e para organização que age como personagem; continuam reais
rubricas, regras fiscais, quórum, cadeiras, calendário eleitoral, indicadores e arquétipos
políticos; o elenco sai de gerador determinístico pela semente; não há guarda executável; figura
histórica exige ADR novo.

Confronto: sem colisão. §2.7 ("instituição não é ocupante") é a mesma regra; §9.13 é uma versão
mais rica do mesmo gerador; veículos, jornalistas e partidos já estavam cobertos. A única lacuna
era a empresa, e o ADR foi emendado em 24/09. A especificação ganhou o §3.4 apontando para ele.

### 5.9 Desempenho — o que medir

Hoje: 0,64 ms por mês, 0,125 ms por `settlement`, 35 KB de save. Nenhum limite se congela
antes do laboratório.

| ponto de custo                      | ordem esperada                               | saída barata                                   |
| ----------------------------------- | -------------------------------------------- | ---------------------------------------------- |
| informação pública chegando a todos | eventos × audiência                          | crença por tema; lote por canal                |
| deliberação                         | atores com algo a processar × ações × termos | poucos; repertório pequeno                     |
| voto                                | parlamentares × cláusulas                    | aritmética simples                             |
| relações                            | até 594² direcionadas                        | esparsas: só as que diferem do padrão derivado |
| save e `deepFreeze`                 | proporcional ao estado                       | medir antes de reter menos                     |
| a tela perguntando                  | uma estimativa por repintura                 | lê crença, não simula futuro                   |

A5 mede 20, 100, 513 e 594 atores; 1, 52 e 209 semanas; tempo por semana (mediana e p95) no Node
e no navegador; bytes de save por semana; eventos por semana; e a prova de equivalência do
agendador (§5.3).

## 6. Sequência incremental

Cada lote é pequeno e isolável, fecha com `validate` verde e com a prova da coluna da direita
caindo contra o código anterior. "Trilhas" quer dizer independência de arquitetura, não trabalho
simultâneo: um lote de cada vez.

### 6.1 Os lotes

| lote | trilha          | o quê                                                                                                                                                                                                                   | prova que fecha                                                                                                                            | série                |
| ---- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| A1   | comportamento   | tipos mínimos, ActorEngine genérico com trace, guarda "motor não importa motor"; cenário de 3 atores                                                                                                                    | §20.1: plano persiste a variação pequena; choque força reconsideração; informação diferente, decisão diferente; mesma semente, mesmo trace | imóvel               |
| A2   | comportamento   | evento mínimo; ação `ASSERT` → evento → crença, conteúdo por referência; identidade do evento decidida                                                                                                                  | informação não teleporta; mentira descoberta só por evidência; eventos contados                                                            | imóvel               |
| A3   | comportamento   | compromisso, relação e memória; `REQUEST`/`COMMIT`/`RESPOND`; prazo que expira; silêncio sem ação                                                                                                                       | §20.2                                                                                                                                      | imóvel               |
| A4   | comportamento   | Congresso sintético (20 deputados, 4 partidos, 2 líderes, 1 relator, 1 iniciativa de 4 cláusulas)                                                                                                                       | §20.3 sem Senado; as regressões da ECLUSA (§4.5, item 9)                                                                                   | imóvel               |
| A5   | comportamento   | agendador e medição 20 → 100 → 513 → 594                                                                                                                                                                                | equivalência semântica: avaliação completa = avaliação agendada; tabela de desempenho                                                      | imóvel               |
| B1   | tempo           | `state.date` autoridade, `state.month` espelho, mandato por regra; o botão avança semanas até o fechamento                                                                                                              | `legacyProjection` exata; continuidade semanal; passeio sem mudança                                                                        | imóvel               |
| B3   | tempo           | prazos de carta em dias                                                                                                                                                                                                 | as de `mail` reescritas; projeção material                                                                                                 | imóvel               |
| B4   | tempo           | tramitação em dias de sessão, com recesso; entra o calendário legislativo com fonte (R2, R4); ainda com o pacote mensal                                                                                                 | "no recesso ninguém vota"; projeção material na política passiva                                                                           | pode mudar — remedir |
| B5   | tempo           | `INITIATIVE` explícita; `compose` como resolvedor de `ALLOCATE` e `SET_LIMIT`                                                                                                                                           | "a mesma cláusula tem o mesmo rito sozinha ou acompanhada"                                                                                 | muda                 |
| B6   | tempo           | a semana chega ao jogador (W2 fechado); contar semanas quietas                                                                                                                                                          | passeio novo; a contagem decide o botão "próximo assunto"                                                                                  | —                    |
| C1   | epistemologia   | pesquisa como observação; a tela mostra a pesquisa                                                                                                                                                                      | §4.6, item 10                                                                                                                              | imóvel               |
| C2   | epistemologia   | quem vota lê a pesquisa publicada                                                                                                                                                                                       | "quem não recebeu não muda de crença"                                                                                                      | muda                 |
| C3   | epistemologia   | a barra lê o indicador divulgado; entra o calendário de divulgação com fonte (R2)                                                                                                                                       | a tela nunca mostra o mês antes da divulgação                                                                                              | imóvel               |
| D1   | convergência    | deputados individuais votam no jogo; sai o fluxo `congress`; relação e memória substituem lealdade e memória-escalar; o fato da verba entregue existe uma vez, com efeitos derivados por mecanismos distintos. Exige R1 | §20.3 no jogo; as regressões da ECLUSA                                                                                                     | muda                 |
| D2   | convergência    | a estimativa do governo sobre as crenças dele: placar, base e pessoas na tela                                                                                                                                           | a tela nunca mostra adesão verdadeira; a estimativa erra por informação                                                                    | imóvel               |
| D3   | convergência    | Senado legislativo (81) no rito ordinário                                                                                                                                                                               | "Câmara e Senado chegam a resultados diferentes"                                                                                           | muda                 |
| E0   | convergência    | ensaio: contingenciamento bimestral como Momento Presidencial (calendário real, fisco, informação, decisão, execução)                                                                                                   | §21.4 reduzido, sem Congresso                                                                                                              | —                    |
| E1   | convergência    | corte vertical completo: medida provisória fictícia (candidata principal, §6.3)                                                                                                                                         | §21.4, jogado por ele                                                                                                                      | —                    |
| F    | depois do corte | CALDEIRA adaptada e Senado no rito de responsabilização; empresas; ministérios; mídia; UI                                                                                                                               | por lote                                                                                                                                   | —                    |

Ordem decidida em 24/09: a trilha A primeiro. B e C são lotes curtos que podem entrar entre os
de A quando reduzirem risco, nunca no mesmo lote. A antiga etapa 4 virou B3, B4, B5 e A2, cada
um com prova menor.

O critério para unir ou separar é a menor mudança que prova uma propriedade nova sem carregar
riscos não relacionados. Pelo critério, três ajustes:

- **B2 saiu.** Era calendário como dado sem consumidor; dado sem consumidor já produziu catálogo
  morto aqui (`bills.mjs`). O calendário legislativo entra com B4 e o de divulgação com C3, cada
  um com fonte;
- **D1 virou D1 e D2.** Deputados votando (muda a série) e a tela lendo a estimativa do governo
  (não muda a série) são riscos diferentes. O Senado legislativo passou a D3;
- **E1 virou E0 e E1.** O ensaio do contingenciamento prova o Momento Presidencial com poucos
  sistemas; a medida provisória prova o ciclo inteiro.

São 19 lotes. Nenhum dos outros se une a outro sem juntar um lote que muda a série com um que
não muda, ou uma mudança de motor com uma de tela.

### 6.2 Pesquisas que destravam lotes (sem código)

| #   | pergunta                                                                                                                                                                 | destrava   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| R1  | emendas hoje: individuais, de bancada, de comissão; cronograma, impedimento técnico, transparência; o que o Executivo negocia de fato                                    | D1         |
| R2  | calendário institucional real: sessões deliberativas, reuniões do Copom, divulgações do IBGE e do Tesouro, prazos da LDO e da PLOA, data do relatório bimestral          | B4, C3, E0 |
| R3  | o rito que o corte vertical escolhido usar (por exemplo, a medida provisória: comissão mista, prazos, sobrestamento)                                                     | E1         |
| R4  | quando proposição fica sem deliberação, quem controla a pauta, arquivamento, fim de legislatura, desarquivamento, rito por tipo de proposição (RICD art. 105 a conferir) | B4         |

### 6.3 Corte vertical — três candidatos

Nenhum reproduz a história: todos são fictícios e podem terminar de formas diferentes.

| critério                            | 1 · decreto fiscal inspirado no IOF                                                                  | 2 · medida provisória                                                                                                                                                                         | 3 · contingenciamento bimestral                                                       |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| o que é                             | o Executivo sobe por decreto um tributo regulatório para fechar um buraco                            | o Executivo edita uma MP (por exemplo, socorro após enchente) que vale na hora e precisa virar lei                                                                                            | a receita frustra, o relatório bimestral obriga a cortar, os ministros disputam       |
| cobertura                           | fisco, rota `DIRECT_ACT`, reação do Congresso por decreto legislativo, controle judicial, informação | escolha de rota (MP ou projeto), as duas Casas, prazo em dias, negociação com relator, fisco, execução antes da aprovação                                                                     | fisco, atores do governo, informação imperfeita sobre a receita, Momento Presidencial |
| complexidade jurídica               | alta: a natureza extrafiscal é controvertida                                                         | média: rito fixado no art. 62 (60 + 60 dias, sobrestamento em 45 — **VERIFICADO**, [art. 62](https://normas.leg.br/?urn=urn%3Alex%3Abr%3Afederal%3Aconstituicao%3A1988-10-05%3B1988%21art62)) | baixa                                                                                 |
| atores                              | 5 a 7                                                                                                | 5 a 8                                                                                                                                                                                         | 3 a 5                                                                                 |
| trajetórias divergentes             | altas                                                                                                | altas: convertida, emendada, caduca, rejeitada                                                                                                                                                | médias                                                                                |
| depende do que não existe           | canal tributário, Senado, controle judicial                                                          | Senado legislativo, prazos em dias, iniciativa explícita                                                                                                                                      | A1–A3, B1 e a data do bimestral (R2)                                                  |
| valor de jogo                       | alto                                                                                                 | alto: o relógio da MP é pressão real e trava a pauta da Casa                                                                                                                                  | médio; não exercita o Congresso                                                       |
| testa o ciclo de vida da iniciativa | parcial                                                                                              | inteiro, inclusive `IN_FORCE` antes de `APPROVED`                                                                                                                                             | não                                                                                   |

Inclinação dele em 24/09, que é também a minha: **3** como ensaio (E0); **2**, a medida
provisória fictícia, como candidata principal do primeiro corte completo (E1), à frente do IOF;
**1** num corte posterior, quando houver controle judicial. Nada congelado: a comparação se refaz
antes de E1, com o que os lotes A e B tiverem mostrado.

Por que a medida provisória testa a arquitetura: o presidente age; o instrumento já produz efeito;
nasce uma `LEGAL_SOURCE`; a projeção `GAME_RULE` muda; atores percebem; o efeito material começa;
o Congresso recebe; negocia; cláusulas mudam; Câmara; Senado; conversão, alteração ou perda de
eficácia; consequências. Ação, formalização, vigência, aprovação, execução e consolidação
aparecem separadas, sem depender do Judiciário.

## 7. Desafios à especificação — estado

| #   | desafio                           | resultado de 24/09                                                                          |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | `GAME_RULE` e histórico derivados | aceito; na especificação §13.1, §13.3, §13.8                                                |
| 2   | informação, `ASSERT` e evento     | `ACTION` ≠ `EVENT`, ligados por referência; `PROPOSITION` adiada (especificação §7.5, §8.1) |
| 3   | `OBSERVATION`                     | aberto; não gravar por padrão (especificação §8.1)                                          |
| 4   | camadas de simulação              | trocado pela separação cognição × processamento (especificação §9.7, §9.14; aqui §5.3)      |
| 5   | comunicação e fato material       | aceito; princípio 9 e §11.2                                                                 |
| 6   | "a tela pergunta"                 | aceito; especificação §6.1 e invariante 21; CLAUDE.md                                       |
| 7   | vocabulário de 90 verbos          | mantido como recomendação: crescer por caso; a especificação já adia o congelamento         |
| 8   | emendas e moeda                   | registrar, pesquisar (R1), não trocar por moeda simplificada; especificação §14.10          |
| 9   | novo: agendador verificável       | "processar todos = processar os escolhidos" exige prazo como despertar agendado (§5.3)      |

## 8. Estado duplicado e conceito com dois nomes no código atual

1. **Lealdade por partido e memória por pessoa** — mesmo conceito, dois motores (`settle` e
   `remember`, mesma forma). Viram relação e memória em D1.
2. **O estoque do fisiologismo e a lealdade das bancadas do centrão** — os dois leem a verba
   entregue (`grievanceOf`, `reads: "share"`; `settle`). Não se presume que sejam a mesma coisa:
   um fato pode gerar confiança num ator, recálculo de objetivo em outro e pressão num agregado,
   e esses efeitos podem ser legítimos e diferentes. O defeito é outro: hoje são duas barras
   paralelas codificando a mesma reação, sem mecanismo que explique a diferença. **Regra de
   migração:** o fato causal (a verba prometida e a entregue) existe uma vez; cada efeito
   diferente sai de um mecanismo diferente e explicável. A duplicação não entra no ActorEngine.
   Resolve-se em D1.
3. **O balanço do mês gravado duas vezes** — `months[].balance` e as cartas `street`, `seats`,
   `vault` (`turn.mjs:1602-1668`). Pequeno.
4. **A aprovação com quatro nomes** — `mood` (satisfação), `good` (ótimo/bom), `standing` (o
   `good` passado ao voto) e `street` (o `standing` normalizado contra 35). São transformações
   diferentes do mesmo estado; não é estado duplicado, mas o nome esconde que é a mesma
   verdade — e é exatamente a leitura que C2 troca pela pesquisa.
5. **SONDA e CALDEIRA** usam a mesma suavização assimétrica. Primitiva comum possível.
6. **O senador que arrasta deputados** (achado 73).
7. **Dado morto:** `Program.weight`, `Program.lag`, `bills.mjs` fora `quorumOf`.

## 9. O que não se pode perder

- prometer e pagar como coisas distintas;
- a defasagem de divulgação;
- a previsão que pergunta à mesma função, agora sobre a crença;
- a queda mais rápida que a subida, em rua, pressão e memória;
- o relator que retira cláusula;
- as duas semânticas do silêncio de hoje, agora pelo contexto (§4.15);
- o rateio com proteção: proteger tudo estoura a bolsa;
- a ESTRATO inteira;
- o gerador por hash;
- a série mensal como regressão;
- o catálogo como parâmetro;
- venda, dividendo e folha das estatais no fisco (`turn.mjs:295-341`);
- o canal educação → indústria, 24 meses.

## 10. Ciclo 30 e docs antigos

Obsoleto como direção não é inútil como evidência. Nada é apagado.

| item                           | veredito                  | o que se reaproveita                                                             |
| ------------------------------ | ------------------------- | -------------------------------------------------------------------------------- |
| A1–A3                          | feitos                    | as provas ficam                                                                  |
| A4 carta do arquivamento       | adiar para F              | tipo e vocabulário; o arquivamento vira evento                                   |
| A5 nits                        | largar                    | `vote()` sai em D1; `settlement` custa 0,125 ms                                  |
| A6 lista de bugs dele          | vale                      | cada um vira prova                                                               |
| A7 3º ultrareview em `src/ui`  | adiar                     | rende mais no núcleo novo, depois de A1–A2                                       |
| B1 piso que anda com a receita | vale, independente        | a ESTRATO já vincula (`bound`); falta o LASTRO separar RCL e receita de impostos |
| B2 quem comparece              | obsoleto como fórmula     | as regras de quórum e as quatro regras de 31/08 viram critério de calibragem     |
| B3 calendário político         | absorvido por B4, C3 e R2 | eleições de outubro de 2028 e 2030; Lei 9.504 art. 73 e LRF como regras          |
| B4 decreto tributário          | vale                      | primeiro `DIRECT_ACT`; candidato 1 de corte                                      |
| B5 coalizão com forma          | obsoleto como regra       | a coalescência vira leitura derivada                                             |
| B6 contrapoder                 | absorvido pelo §15        | pesquisa 04 §3.7                                                                 |
| B7 email e save                | parcial                   | o rascunho já sobrevive ao recarregar; o email que leva à decisão entra em E1    |
| B8 a rua com consequência      | absorvido pelo §5.5       | achado 20                                                                        |

O ciclo 29 segue aberto (prosa do domínio, poda do `tmp/`) e não bloqueia nada aqui.

## 11. Decisões

### 11.1 Tomadas em 24/09

| decisão                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------- |
| laboratório primeiro; tempo como trilha independente, sem trabalho simultâneo                                    |
| W1 interno; a semana chega ao jogador em W2                                                                      |
| `state.date` é a autoridade; `state.month` espelho temporário na mesma transação, com prova                      |
| semana civil como direção; calendário real é a autoridade; primeira semana parcial                               |
| saves antigos recusados durante a reforma                                                                        |
| cognição separada de processamento; processamento derivado e não gravado                                         |
| avaliação agendada semanticamente equivalente à completa; condição temporal sempre agendada ou derivável         |
| `ACTION` ≠ `EVENT`, ligados por referência, até o laboratório provar que a distinção não vale nada               |
| `PROPOSITION` não é objeto canônico agora                                                                        |
| CLAUDE.md, AGENTS.md, agent-brief e standards dizem a mesma coisa: a tela mostra o que a Presidência sabe        |
| direção final: 513 deputados e 81 senadores individuais; facções emergentes, não substitutas                     |
| "empresa" no ADR 0003                                                                                            |
| achados de fidelidade com VERIFICADO e VERIFICAR; nada em VERIFICAR vira regra antes da pesquisa                 |
| gaveta de 6 meses: legado não validado, fora da ESTRATO, do calendário e do Congresso novo                       |
| o fato causal existe uma vez; efeitos diferentes por mecanismos diferentes e explicáveis                         |
| prova que deixa de valer é aposentada por decisão registrada e substituída pela prova da nova propriedade        |
| corte vertical: ensaio com contingenciamento; medida provisória fictícia como candidata principal, não congelada |

### 11.2 Abertas

| tema                                                 | bloqueia A1?                                                                                                   | quando se decide                             |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| **codinome do ActorEngine**                          | **sim**: a guarda `codenames` reprova motor novo em `src/domain/` sem codinome, e codinome é nome dado por ele | antes de A1                                  |
| botão "avançar até o próximo assunto"                | não                                                                                                            | B6                                           |
| geografia e valores na opinião                       | não                                                                                                            | depois de C2                                 |
| persistência de `OBSERVATION`                        | não                                                                                                            | A2                                           |
| identidade do evento                                 | não                                                                                                            | A2                                           |
| normalização concreta do conteúdo                    | não                                                                                                            | A2                                           |
| causas de despertar (lista final)                    | não                                                                                                            | A5                                           |
| retenção e compactação de eventos                    | não                                                                                                            | depois de A5 medido                          |
| localStorage ou IndexedDB                            | não                                                                                                            | depois de A5                                 |
| calendário civil contra efeitos mensais (§5.1)       | não                                                                                                            | B3–B5                                        |
| corte vertical definitivo (§6.3)                     | não                                                                                                            | antes de E1                                  |
| o que o Executivo negocia em torno das emendas       | não                                                                                                            | R1, antes de D1                              |
| Selic por data do Copom; mandato do presidente do BC | não                                                                                                            | quando houver Momento Presidencial econômico |
| mercado, produtivo e ordem como organização          | não                                                                                                            | F                                            |
| o fecho revela o oculto?                             | não                                                                                                            | UI                                           |
| vocabulário além do protótipo                        | não                                                                                                            | B5 em diante                                 |
| tudo do §23.3 da especificação                       | não                                                                                                            | —                                            |

## 12. Revisão cruzada

| procura                                       | achado                                                                                                                                                                                                                                                                              | onde se trata  |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| estado duplicado                              | lealdade × memória; fisiologismo × lealdade do centrão; balanço gravado duas vezes                                                                                                                                                                                                  | §8; D1         |
| mesmo conceito, nomes diferentes              | aprovação com quatro nomes; `GAME_RULE` e faixa da ESTRATO são a mesma projeção                                                                                                                                                                                                     | §8; §4.9       |
| motor que virou deus                          | risco no ActorEngine; contido por repertório e termos vindos de fora e pela guarda nova                                                                                                                                                                                             | §5.4; A1       |
| agregado virando ator sem agência             | mercado, produtivo e ordem; a primeira versão punha o `heat` todo como estado de organização                                                                                                                                                                                        | §4.12          |
| otimização que muda comportamento             | as camadas da primeira versão; agora separadas, com prova de equivalência do agendador                                                                                                                                                                                              | §5.3; A5       |
| conhecimento oculto vazando                   | tela: dez consultas; atores: o voto lê a rua verdadeira                                                                                                                                                                                                                             | §5.6; C2       |
| sorteio substituindo agência                  | `vote()` e o plenário do afastamento                                                                                                                                                                                                                                                | §4.3; D1, F    |
| regra histórica ou suposta como universal     | gaveta de 6 meses; um voto por mês; `SIEGE_PRICE = 3`; as três rupturas; posse em 1º de janeiro; "terça a quinta" da primeira versão; o IOF de 2025 como roteiro                                                                                                                    | §3; §5.1; §6.3 |
| compatibilidade temporária virando permanente | `state.month` espelho (sai em B); `legacyProjection` (em `tests/`, vence em B3–B4); `vote()` (D1) e `whipCount` por bancada (D2); `pollFrom(mood)` no voto (C2); o botão mensal por cima das semanas (B6); o estoque do fisiologismo (D1); a abertura automática do afastamento (F) | §6.1           |
| sistema sofisticado antes da necessidade      | coleta de lixo de eventos, objeto de proposição, `PresidentialView`, IndexedDB, opinião fatorizada, vocabulário completo — todos adiados                                                                                                                                            | §11.2          |
