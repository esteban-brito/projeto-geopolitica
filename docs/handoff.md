# Retomada

> Ponto de retomada único. **Aqui só entra o que é verificável hoje:** estado, fila, decisões
> vivas, achados abertos e a série. Narrativa vai para [`journal.md`](archive/journal-2026-08-13-to-09-30.md). Número com data
> envelhece: remeça antes de repetir. A tabela de contagens é cobrada por
> `tests/suites/catalog.mjs`; a série, por quem mexe no motor.

## Para retomar em um minuto

- **01/10, limpeza e organização**, aprovadas por ele (journal 123 a 129): um contrato só para os
  agentes ([`AGENTS.md`](../AGENTS.md)); índice com situação em cada pasta de `docs/`; o que foi
  superado em `docs/archive/`; 7.336 palavras acentuadas, cobradas pela guarda `accents`; o achado
  69 fechado; `tmp/` e `docs/evidence/` limpos. O repositório foi refeito como um mapa: a árvore está no [README](../README.md#o-mapa).
- **`validate` verde em 01/10:** 14 guardas, 74 sintéticas, zero links quebrados, tipos, lint,
  formato, 471 testes, passeio e macaco; o passeio passa com os 12 núcleos ocupados.
- **a posse:** ele escolheu refazê-la dentro do jogo, com o save 22
  ([ciclo 34](cycles/34-posse-rebuilt.md)). O protótipo segue em `npm run serve` e
  <http://127.0.0.1:5173/tmp/build/posse.html>; os defeitos dele, medidos em 01/10, estão no ciclo 34.
- **a direção:** a [visão](vision.md) manda (rascunho de 01/10, espera a aprovação dele); abaixo
  dela, as [especificações](spec/README.md) e o plano em vigor, o [ciclo 33](cycles/33-whole-game.md).
- **o modelo da base está no motor (26/09):** 16 partidos, save na versão 21, a lealdade é a
  chance do partido, um líder por bloco (15 arquétipos); desenho em
  [o modelo da base](spec/base-model.md) §7.
- **a posse do Claude:** estrutura aprovada na versão 25 do
  [canvas](https://claude.ai/artifact/CHQmb6ksyKpYxdR8BBEnuM), retratos na 43; a revisão local v2o
  das 812 fichas (27/09) não foi publicada.
- **git:** a branch `caixa-de-entrada` está publicada; o `main` parou em 27/08 e o merge entra
  depois do teste dele. Commit ao fim de cada etapa validada; push liberado com o plano aprovado.
- **o que só existe neste disco:** `tmp/asset-sources/` (49 MB, fontes dos retratos e da madeira),
  `tmp/history/` e o runtime do canvas. Uma cópia fora do computador depende dele;
- **marca no Git:** `antes-da-interface-nova` (26/09), o estado antes de recomeçar a interface.

## Estado do motor e do processo

As seções longas de antes de 01/10 estão inteiras em [handoff arquivado](archive/handoff-2026-10-01.md).

- **E0** (o corte do bimestre, [ciclo 31](archive/cycles/31-the-bimonthly-cut.md)): implementado em
  `febd0b5` e pausado em 25/09. A reunião foi reprovada no playtest porque a decisão do corte não
  pesa no modelo (achado 77).
- **VONTADE:** lotes A1, A1.1, A1.2 e A2a commitados (`98c1abc`, `a690248`, `5ba154c`); o mundo
  vivo, lotes 1 e 2, decide por ela todo mês ([o mundo vivo](spec/living-world.md)). O A2b espera.
- **Autoridade de design:** a [visão](vision.md) e, abaixo dela, a
  [especificação mestra](spec/master-spec.md) 1.1; o [mapa de migração](spec/migration-map.md)
  (referência) guarda os lotes e as consultas que ainda leem o oculto (§5.6).
- **Ciclo 29 (simplificar):** itens 2 e 3 feitos; a meta de prosa (até 20% no jogo, 25% por
  arquivo) segue aberta, com o domínio perto de 41% na última medida.
- **Revisão externa:** 2 dos 3 ultrareviews grátis gastos; 9 achados, os 9 reproduzidos e 7
  corrigidos. As bases (`base-ultra` `679f043`, `base-motor` `bb7ce9d`, `motor-review` `fc78e27`)
  foram apagadas e se recriam pelos hashes.
- **Pesquisa 13** (do Gemini): não validada; nada dela vira regra sem fonte conferida.
- **Medido:** save no mês 48 com 35.387 bytes; `playMonth` 0,64 ms; `settlement` 0,125 ms;
  pintura de 3 a 5 ms; abertura em 600 ms.

## Fila, em ordem

**Agora**, nesta ordem:

1. **Acentos de contexto** (`e`/`é`, `esta`/`está`, `a`/`à`, `tem`/`têm`), lote do Gemini em
   `tmp/agents/to-gemini.md`: a parte A está feita (`212a8ac`, 20 arquivos, 1.345 palavras); faltam
   B (`src/shell/`, `src/ui/`, `src/main.mjs`, `styles/`), C (`src/data/`), D (`tests/`, `tools/`,
   `prototypes/`) e, por último, E (`docs/`). Cada parte se confere por
   `node tools/accent-only.mjs --ignore-case <arquivos>` e pela revisão do sentido dos pares
   ambíguos com `node tmp/review-accents.mjs <arquivos>` antes do commit;
2. **Elenco inspirado na vida real**, no escopo das decisões vivas: feitos a emenda do ADR 0003 e a
   [pesquisa 21](research/21-inspired-cast.md); falta TCU, comandantes, imprensa, mercado e um
   perfil com fonte para cada ministro. Os eleitos entram depois de 25/10/2026;
3. **As partidas Xi e Lee escritas** como se ele jogasse Geopolitical Simulator, Democracy 4 ou
   Football Manager; servem de régua, leitura e roteiro de teste; no jogo pronto, com desfecho realista
   mesmo que fracassem; depois de 25/10;
4. **O [ciclo 34](cycles/34-posse-rebuilt.md)**, a posse dentro do jogo: espera a ordem dele.

**O plano do jogo inteiro** é o [ciclo 33](cycles/33-whole-game.md), aprovado em 26/09; a etapa
1 (Presidente e posse) contém o ciclo 34. Fora dele, nesta ordem: o achado 81, antes de fechar o
E0; a carta do arquivamento (achado 66, lote F); a prosa de `src/domain` (41%, meta de 20%); o 3º
ultrareview, de `src/ui`; e os candidatos do [ciclo 30](archive/cycles/30-depth-and-proofs.md), que
ele marca.

## Decisões vivas

Ordens dele que ainda guiam o trabalho, da mais nova para a mais antiga. As que viraram regra estão
no [`AGENTS.md`](../AGENTS.md), na [visão](vision.md) ou nas especificações. O texto inteiro de
todas, em 01/10, está em [decisões e achados de 01/10](archive/handoff-findings-2026-10-01.md).

- **01/10, a organização:** criar, apagar, mover e renomear o que for preciso para o repositório
  ficar arquitetado "como um mapa"; limpeza e profissionalismo sempre; plano antes de executar.
- **01/10, o elenco:** cerca de 40 papéis que pesam no 1º ano; nome inventado; papel, ideologia e
  temperamento inspirados no real, sem episódio real; os eleitos esperam o 2º turno de 25/10/2026.
- **01/10, a interface evolui a partir da atual** (revisa 26/09): a posse se constrói dentro do
  jogo, no sistema de desenho que existe, e substitui o formulário de nova partida; save 22
  autorizado.
- **01/10, objetivos antes de construir:** a [visão](vision.md) espera a aprovação dele.
- **29/09 e 30/09, o governo variável:** sem cota fixa de carreiras ou ministérios; palavra-chave
  acha trabalho por ID e não fabrica poder ([contrato](spec/dynamic-government.md)).
- **26/09, o começo:** a base segue o protótipo, pesquisada antes do motor; o jogo cria o
  Presidente, e as seis trajetórias (político, militar, jurista, empresário, ativista,
  celebridade) pesam.
- **26/09, o ministério:** criar e fundir pastas com realismo; 33 notáveis de nome inventado; fama
  e afinidade de 1 a 5 para todos.
- **26/09, o ciclo 33:** aprovado (decisões 1, 5 e 9); a rota fora da lei entra na etapa 10,
  "contanto que seja realista, pode tudo".
- **25/09, o jogo:** encontro vira cena com rosto e fala curta, sem pop-up; toda decisão mostra
  quanto custa, quem reage e quanto tempo leva.
- **25/09, laboratório sem pressa:** tela nova nasce em dois ou três protótipos para ele comparar.
- **23/09, o cargo:** máxima fidelidade ao que um presidente faz; nenhum prazo de efeito nem crise
  obrigatória sem fonte.
- **pendente desde 21/09:** a lista de bugs que ele viu; cada um vira prova quando chegar.

## Achados abertos

Um achado que fecha sai daqui para o journal. Número com data: remeça antes de repetir. O texto
inteiro de cada um, em 01/10, está em [decisões e achados de 01/10](archive/handoff-findings-2026-10-01.md).

- **P04–P12 (29/09):** os contratos da [auditoria dos planos](archive/plan-audit-2026-09-29.md):
  relógio civil, MP, sobrestamento, `POWER_STEPS`, contas da estatal, portão jurídico, recorte de
  informação, voto firme e aceite;
- **88 (26/09):** os retratos da Presidência aparentam 25 a 45 anos; as próximas folhas pedem 45 a 70;
- **87 (26/09):** a pauta de conteúdo é generosa (437 votos previstos para uma base de 383);
  calibrar na etapa 4;
- **86 (25/09):** nenhuma sonda segura a base; com 15% de aprovação ou menos, quase todos desembarcam
  no mesmo mês; faltam âncoras com fonte (2016, 2017–2018 e 2021);
- **81 (25/09):** o limite do art. 166, § 18 vale para as emendas do jogo? Verificar antes de fechar
  o E0;
- **80 (25/09):** lei pode deixar o nível abaixo do piso, e a execução a desfaz; pergunta para a ESTRATO;
- **77 (25/09):** a distribuição do corte quase não tem consequência material; a resposta é o E1.4;
- **76 (25/09):** Defesa e Previdência não têm custo político; calibragem é decisão dele;
- **75 (24/09):** a gaveta de 6 meses (`DRAWER_LIFE`) é legado não validado; lote B4;
- **74 (24/09):** o canal tributário está morto: `taxDelta` é sempre zero;
- **73 (24/09):** o senador arrasta deputados, porque `benches()` não filtra cargo; lote D1;
- **72 (24/09):** o afastamento cai na Câmara; pelos arts. 86 e 52, a Câmara admite e o Senado
  julga; lote F;
- **71 (24/09):** a emenda individual é impositiva (2% da RCL); falta verificar bancada e comissão;
  lote D1;
- **70 (24/09):** a posse é em 05/01/2027 (EC 111/2021), e `state.mjs` diz 1º de janeiro; lote B1;
- **67 (21/09):** o passeio leva cerca de 100 s (medido em 01/10); em 21/09, 73 esperas fixas
  somavam 27 s;
- **66 (21/09):** a carta do arquivamento não existe; lote F;
- **65 (18/09):** `--paper` é cor nos tokens e largura na folha;
- **64 (11/09):** o parecer soma mês com ano sem dizer;
- **63 (11/09):** a promessa da posse saiu do Gabinete;
- **53 (21/08):** não recalibrar a capacidade antes das empresas (E1.1);
- **52 (21/08):** o país premia compromisso sustentado, e nenhuma tela diz isso;
- **48 e 37:** a Caixa pergunta em 22 de 48 meses passivos; o relator só emenda texto que fere duas
  alavancas ou mais;
- **47 e 45 (21/08):** as réguas de Finanças; decisão dele;
- **40:** "quem trava a obrigatória" imprime um de três;
- **35:** Saúde decai rápido na prosa e devagar no modelo (63 meses de meia-vida);
- **22 e 23:** o que morre antes do plenário segue sem medição; travar custa só o relógio;
- **7, 8, 10, 11, 12, 26 e 28:** os primeiros chutes da ECLUSA (`PIVOT 58`, `SPREAD 16`,
  `THREAT 85`) e dados sem leitor (`Program.weight`, `Program.lag`, `state.norms` sem poda);
- **20:** a rua precifica voto e mais nada;
- **16 (04/09):** ambições com preço; sobra o sorteio, decisão dele.

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
medem à parte). 48 meses, semente padrão, sem partido, governo montado na posse (`--party` compara
outro jogo: com PCN, `agenda` dá 20/42; com PCS, 16/41). Remedidas em 30/09, semente 20270101,
após corrigir remanejamento no redutor; as seis linhas reproduziram os resultados de 26/09.

| política     | dívida/PIB | votações     | indústria | segurança |
| ------------ | ---------- | ------------ | --------- | --------- |
| `herdado`    | 89,9%      | 0 de 0       | 48 → 27   | 38 → 25   |
| `agenda`     | 90,0%      | **20 de 42** | 48 → 20   | 38 → 20   |
| `base`       | 90,7%      | **17 de 42** | 48 → 20   | 38 → 20   |
| `piso`       | 90,9%      | 5 de 37      | 48 → 15   | 38 → 15   |
| `explorador` | 91,8%      | 0 de 6       | 48 → 25   | 38 → 17   |
| `promessa`   | 92,3%      | 2 de 4       | 48 → 19   | 38 → 17   |

Mexeu em `src/data/`, `src/domain/`, `src/application/` ou `src/state/`? remeça esta tabela no
mesmo commit, mesmo que ela não mude.

**A série mudou em 26/09:** 16 partidos, 15 líderes (um por bloco, fora PML e PLI) e a base como
chance. Antes: `agenda` 22 de 43, `base` 18 de 42, `piso` 5 de 26, `explorador` 0 de 0,
`promessa` 0 de 3 e 92,4%. Todas as sondas têm 13 desembarques; em `agenda`, os 13 saem até
o mês 28 e só o PBR fica; sem gabinete (`--cabinet none`), `agenda` aprova 2 de 43 e 14 desembarcam. A linha "a vida"
do simulador conta os gestos de cada sonda.

## O que existe

**Tela:** barra fixa (data, vitais, avançar) + rail (coluna acima de 1181px de largura; dock no
Gabinete) + treze endereços: Gabinete, Email, Congresso & Leis, Finanças, oito áreas, Estado; o
fecho ocupa o Gabinete. Gabinete é a Mesa (cena 1916×821, que só encolhe): pasta com o ato e o
contingenciamento, envelopes que erguem a carta ao centro, telefone. Email é a Caixa em tela
cheia. Vocabulário único em `src/ui/components/annex.mjs` (guarda `annexes`).

**Dados:** 16 blocos · 513 cadeiras · 8 áreas · 38 programas · 6 regras · 4 grupos de pressão ·
3 faixas de renda · 15 arquétipos.

| coleção            | quantos |
| ------------------ | ------- |
| blocos partidários | 16      |
| cadeiras           | 513     |
| áreas              | 8       |
| programas          | 38      |
| regras             | 6       |
| grupos de pressão  | 4       |
| faixas de renda    | 3       |
| arquétipos         | 15      |

**Motores:** LASTRO (receita, teto, `blocked` × `atRisk`) · ECLUSA (`whipCount`/`vote`/`settle`)
· MALHA (índices, `pushOf`/`liftOf`) · SONDA · ELENCO (semente, sem fluxo de RNG) · CORRENTE
(hiato, Phillips, Taylor, Okun, `carry`) · ESTRATO (faixa derivada, nunca guardada) · DELTA (lido
do catálogo) · VONTADE (agência genérica; o mundo vivo a usa todo mês, em `application/world.mjs`). Os contratos vazios TEMPORAL
e CASCATA saíram em 24/09 e voltam quando tiverem código.

**Composição:** `agenda.mjs` (proposta, rateio) · `turn.mjs` (`bandsOf` → `settlement` →
`ledger` → `situationOf` → `playMonth`) · `public/` (fachada; `boundaries` prova) ·
`simulate.mjs` (nove sondas).

**Verificação de 01/10:** 14 guardas · 74 sintéticas · 531 provas · passeio dentro do `validate`
(geometria, recorte, contraste no pixel, 1440×980 e 1440×900).

## O que ainda não existe

- **empresas com estrutura** — a estatal entra nos lotes E1;
- **choques exógenos** (o antigo TEMPORAL) — o canal `shock` de CORRENTE existe e ninguém o alimenta no jogo;
- **carta do arquivamento** do processo de afastamento (achado 66);
- **tensão institucional** — variável de estado, não motor;
- **contraste em texto com filho elemento** — o medidor não alcança (`standards.md` §7);
- **layout de força para o DELTA** — grafo lido, peça que desenha não;
- **Liquid Glass de alta fidelidade** — especificação em `research/12`; implementação futura;
- **GitHub Pages** — só CI por enquanto.

## Decisões fechadas que não se reabrem sem pedido

Fase 1 só o Brasil · 48 turnos mensais hoje, e a semana é direção da especificação · inglês no código, português na prosa · cascata
declarada · codinomes de motor · zero build/runtime · lealdade serializada · motor nenhum chama
outro · Congresso responde ao pago · rateio proporcional · âncora é o teto que vigorou · tela
pergunta, previsão usa o pago · rascunho morre com o mês, salvo o decreto de proteção, que vale até o relatório bimestral (ordem dele, 25/09) · tudo é alavanca com preço · posição
calculada, rito sai do conteúdo, jogador não inventa substantivo · catálogo cita fonte · Finanças
sem controle · ordem entre normas total (hierarquia, especificidade, recência, escrita) · geral
não revoga especial sem nomear · faixa derivada, nunca guardada · pessoa é semente (save guarda
memória) · elenco sem RNG · ambição é preço, traição pesa mais que favor · déficit primário tem de
rodar · preço escala com dispersão · layout é promessa · sem presidente sem partido (CF 14, §3º,
V) · federação = coligação com preço para romper · barreira pode matar o partido no ano 4.
**Princípio: tudo tem um jeito de ser feito — o que separa o possível do impossível é o preço.**

Referências de jogo: Football Manager, Democracy 4, Suzerain, Crusader Kings, Victoria 3 e Hearts
of Iron, da Paradox; Geopolitical Simulator.

## Fontes de modelagem

Campo real em [`docs/research/`](research/) (pesquisas 01 a 16); a 09 é o checklist do cargo e a
04 lista os sete buracos por realismo ganho. Correções do dossiê externo estão na prosa de cada
arquivo de dado (`parties`, `fiscal`, `macro`, `congress`, `economy`, `turn`).
