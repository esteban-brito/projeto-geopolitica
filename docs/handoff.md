# Retomada

> **Ponto de retomada único do projeto.** Numa sessão sem memória da conversa, leia este
> arquivo e depois [`standards.md`](standards.md).
>
> ⚠ **AQUI SÓ ENTRA O QUE É VERIFICÁVEL HOJE** — o estado que um comando confirma, a fila,
> a decisão viva e o achado ainda aberto. **Narrativa de sessão vai para
> [`journal.md`](journal.md)**, e não volta. Seções datadas de sessão foram para lá em
> 10/09/2026; aqui ficou só o que ainda decide alguma coisa.
>
> **Economia de contexto (10/09/2026, para gastar menos token por sessão):** ler arquivo com
> `limit`/`offset`, `grep` antes de ler inteiro, nunca reler o que a guarda já prova, uma
> sessão por item com `handoff` relido no início — sessão de 200 mensagens recarrega o
> histórico inteiro a cada resposta.

---

## ▶ COMECE POR AQUI

### ✔ Estado — 15/09/2026 02:05 (portão verde, commitado)

Commit mais recente: o de 15/09 02:05 (`git log -1`), que fechou a sessão inteira por ordem
dele: 18 arquivos modificados + `tests/suites/spring.mjs`, `docs/research/11-fotorealismo-da-mesa.md`,
`assets/phone.webp` e `assets/CREDITOS.md` novos. Ele mandou revisar antes de commitar; a revisão
achou e corrigiu um defeito, e no meio dela vieram três ordens: o telefone vira imagem real, o
voo da pasta fica liso, e algarismos nas teclas. Tudo feito (bloco abaixo). `npm run validate`
verde na árvore final:
**13 guardas · 66 sintéticas · 331 provas · passeio verde**. Hierarquia, ordem dele de 15/09:
**ele, depois Claude, depois Gemini — e sempre delegar algo ao Gemini** (canal `agentapi`,
conversa `883734d6-…`; receita na memória do Claude).

▶ **15/09 — a revisão, o voo liso e o telefone de foto:**

1. ⛔ **Defeito real, medido e coberto:** marcar uma área com a pasta erguida repinta a sala, e a
   sala nova nascia sem `--phone-x` (ele só se mede com a pasta na mesa) — o telefone ia para
   `left: -271px` e ficava lá depois de largar. O passeio nunca marcava com a pasta no ar.
   Agora o valor é de módulo em `cabinet.mjs` e se reescreve a cada pintura; prova nova na etapa
   "recomeçar" do passeio (reprova sem a correção: `1130px antes, -271 depois`).
2. ⭐ **O FPS DO VOO CAÍA POR CAUSA DO PASSEIO DA LUZ, e não do couro.** Trace do Chrome no
   voo: `--light-angle` animado no `:root` (`20-material.css`) herdava para a árvore inteira —
   45 recálculos de estilo de 627 elementos (7,9ms cada, 356ms em 700ms), 651 pinturas, GPU a
   82%. Sem ele: 13ms, 4 pinturas, GPU a 12%, pior quadro 20,1 → 4,2ms. `tmp/jank.mjs`: p95 21ms
   e 4–6 quadros perdidos com, **p95 4,3ms e 0 perdidos sem** (Gemini mediu o mesmo: mediana
   8,3 / 4,3 / 0). 📐 **O couro e a fibra não custam nada sem ele** — o "grão ou 20 fps" de 13/09
   media o passeio, não o grão. O passeio saiu; o ângulo ficou no `initial-value` do
   `@property`. ⚠ Ele já tinha custado 9,7 fps no ofício e 28,3 no `.tray__month` — três vítimas
   do mesmo defeito, e só agora a causa.
3. ⭐ **O TELEFONE É IMAGEM GERADA, VISTA DE CIMA** (`assets/phone.webp`, 720×639, 101 KB):
   ele propôs gerar no DALL-E; o ChatGPT gerou duas a partir do meu prompt (telefone de teclas
   vermelho estilo WE 2500, zênite, teclas e cartão em branco, sem sombra no chão, fundo liso) e
   o Gemini uma; foi a segunda do ChatGPT — a mais zenital, corpo de ~1000px, já com alfa.
   Origem em `assets/CREDITOS.md`; sem licença de terceiros. Tratamento em `tmp/assar-fone.mjs`
   (alfa 252/253 → 255, corte, 720 de largura, exposição 0,95 e 1 → 0,88 de cima para baixo).
   Na tela: **420px** (a 300 media o mesmo que o envelope; a 500 ele viu "demais"), corpo de
   ~232px; o corpo fica no meio do vão (a caixa recua 32px) e no vão curto o cordão entra por
   baixo da pasta (`z-index` 2 < 3). Sombras por `drop-shadow` (contato 0,88, penumbra 0,6) e
   uma poça de contato (`.phone::before`, ideia do Gemini). Número no cartão `2027-0148`, 11px.
   **Algarismos nas teclas, ordem dele:** 12 `<b>` numa grade 3×4 medida no arquivo (colunas
   350,5/412/473,5 de 720, linhas 300/355/410,5/466 de 639), 11px; a caixa do algarismo é a da
   tecla (57%×63% do passo) porque com a célula inteira o passeio media 4,27 de contraste — o
   corpo vermelho entrava na amostra.
   ⛔ **Duas versões morreram antes, medidas:** o vetor (553 linhas, 78°, destoava das matérias
   de foto) e a foto do Commons («Dialog röd», CC BY-SA 3.0, Dialog de disco a 65°) — mesmo
   recortada por `r − max(g,b)`, desfranjada e com a luz da sala assada, ele viu "muito na cara
   que é imagem". O fio claro em volta dela era a máscara de nitidez misturando o preto dos
   pixels transparentes na borda — se voltar a afiar imagem com alfa, só no miolo. O recorte
   por cor ficou em `tmp/recorte.mjs`. ⚠ O Gemini editou `46-desk.css` por ordem dele
   (255px, `rotateX(15deg)`): o `rotateX` quebrava a animação do toque e desalinhava o cartão;
   saiu, e a poça de contato ficou.
4. **Instrumentos novos em `tmp/`** (fora do git): `trace-voo.mjs` + `trace-lê.mjs` (trace do
   Chrome no voo, resumo por thread), `recorte.mjs` (o recorte da foto), `thumb.mjs`,
   `sheet.mjs`, `zoom.mjs`, `fundo-xadrez.mjs`, `anims.mjs`.

▶ **O que sobra da mesa é decisão dele, e está na fila:** a carta aberta NA MESA (Etapa 3) depende
da pergunta do `rotateX` (pesquisa 10 §6.2); o calendário foi recusado; os objetos mudos, "não
agora". Achados 63 e 64 são escrita dele.

▶ **Noite de 13/09 — fotorealismo, e onde ele parou (ordem dele: "vamos finalizar por aqui"):**

1. ⛔ **Filtro de luz no telefone: testado e RECUSADO por ele.** O alfa borrado como mapa de altura
   (`feDiffuseLighting` + `feSpecularLighting`, a receita da cera) dá a toda aresta o mesmo
   chanfro e ao cabo uma faixa de brilho borrada — _"brilhoso, cartunesco, nada fotorealista"_.
   Saiu inteiro; e com ele saíram, por ordem dele, o clarão do platô, o tom aceso (`--phone-lit`
   morreu) e todo gleam. Sobrou: grão de plástico (multiply), fone em contorno único com
   concordância (o "osso de cachorro" acabou), cabo com volume de tubo (véu preto em gradiente),
   nicho do berço em gradiente, cordão com lado de sombra. 📐 Custo do voo: o grão do telefone
   não mede (jank igual com e sem).
2. **Número no quadro:** inventado, em `UI.phone.number`, 8,5px na tela (hoje `2027-0148`, no
   cartão da foto — ver 15/09).
3. **Pasta:** grão de couro calculado (`leather()`: ruído + `feDiffuseLighting` pela luz da sala,
   branco com alfa = brilho do grão, composto normal sobre o preto — o que `screen` daria), assado
   em bitmap por `bake()` na carga; borda de 8px com espessura; reflexo 0,15 → 0,2.
   📐 ~~E ELE CUSTA NA SUBIDA~~ — **remedido em 15/09: não custa.** Os 55–61 fps e 4–10 quadros
   perdidos "com o grão" eram o passeio da luz (ver 15/09); sem ele o couro e a fibra dão o
   mesmo p95 de 4,3ms que a pasta nua.
4. **Papel:** sombra na lombada (10%, oclusão de contato) e fio de luz de cima para baixo.
   **Lacre e feltro:** a mesma luz de tudo (250°/52°); o lacre tinha ponto de luz próprio.
5. ⛔ **Grão de foto sobre a cena inteira: tentado e não cabe.** `.shell` isola (o vidro precisa)
   e a madeira está fora dele — o `mix-blend-mode` nunca a alcança e a área clareava com borda
   nítida. Cada matéria leva o próprio grão.
6. **O caminho para o telefone FOTOREALISTA é foto** — feito em 15/09 (ver acima).
7. **Gemini:** pesquisa 11 (`docs/research/11-fotorealismo-da-mesa.md`) e a tabela de auditoria
   das 8 regras no journal; `screen` 26,8 × 27,2 na máquina dele ocupada (não cite).

▶ **Tarde de 13/09 — a luz da sala e o telefone:**

1. ⭐ **UMA LUZ para a sala inteira**, declarada em `00-tokens.css`: `--light-dx: 0.36` (alta,
   atrás da beira de cima, 20° à esquerda) e quatro classes de sombra — `--cast-contact`,
   `--cast-flat` (folha, 6px), `--cast-thin` (envelope, 10px), `--cast-thick` (pasta e vidro,
   24px). Pasta, folhas, pilha, emboss, envelope, abas, lacre, telefone e os três níveis de vidro
   caem todos para baixo e 0,36 para a direita por px de queda. ⛔ **A mesa tinha duas luzes:**
   as projetadas caíam retas e o lacre, as abas e a pilha caíam para a direita a 0,5 — ele viu
   "sombras que não parecem padronizadas". O clarão do tampo andou 105px para a esquerda, para
   onde a luz está. O telefone só diz a queda de cada sombra (`--drop` inline, RUNTIME) e o CSS a
   inclina; o filtro `#wax-shadow` saiu do SVG (a sombra do lacre é `drop-shadow` CSS).
2. **Telefone maior, mais alto e mais à direita, ordem dele:** caixa 278×283 = a tinta (era
   290×268 com 40px de margem transparente), escala 1,22 (9% acima), `top: 45%` (era 52%).
   ⭐ **O X é medido por `fitDesk`** (`--phone-x`, RUNTIME): meio do vão entre a pasta e a beira
   visível da janela. Em % da cena ele não andava — na de 1440 o vão tem 309px para 272 de
   aparelho, e ele pediu "mais à direita" olhando a de 1920 (monitor dele). Medido: 16px de
   cada lado na de 1440, 128 na de 1920.
3. **Docs:** pesquisa 10 emendada nos 4 pontos; handoff limpo (blocos cumpridos foram para o
   journal via `tmp/handoff-para-journal.md`); `--bevel-zenith` (aresta de cima dos três vidros,
   `20-material.css`) e o feltro do envelope regranulado (`texture.mjs`, 0,95/1,5 → 1,7/0,85)
   estavam na árvore desde a madrugada sem registro — registrados aqui.
4. **Medições do Gemini nesta máquina (75Hz):** achado 65, subida da pasta com a promoção de GPU
   aplicada — pior quadro 23,1ms, p95 18,2, 73–74 fps, 1 perdido (o 83ms não se reproduz); com
   a penumbra inclinada, 18,2 / 18,1 / 68 fps / 0 perdidos — não custou. Achado 62 —
   `.go__label` a 19,15 em 4 rodadas, fechado como não reproduzido.
5. **Cada envelope é um botão para a Caixa** (ciclo 25 §3.3, passo 5: "clicar leva ao Email"):
   `<button data-section="email">` com `aria-label` que diz se a carta vence (`UI.envelope`),
   o gesto do rail e do telefone. Prova nova em `screens.mjs` (331ª). A carta aberta NA MESA
   (Etapa 3) continua sendo ciclo, e depende da pergunta do `rotateX` (pesquisa 10 §6.2).

▶ **Madrugada de 13/09 (Claude + Antigravity):**

1. **Voo da pasta (Etapa 2):** EDO analítica `curveOf` em `spring.mjs`, Web Animations API em `cabinet.mjs`, velocidade na interrupção `whereIs`, 6 provas em `spring.mjs`.
2. **Telefone Western Electric 2500 refeito** (Claude desenha, Gemini mede/critica/documenta — canal direto pelo `agentapi` do Antigravity): projeção em mm reais a 78°, zero cor literal no JS, zero filtro, teclas e cordão gerados, algarismo a 8,5px (sem letras, sem número no quadro: abaixo de 8px é texto falso). A versão anterior (vista frontal, ~30 cores literais, 4 filtros, letras de 3,5px) foi substituída inteira.
3. **Envelopes redesenhados:** tamanho nativo de 155px em `46-desk.css` (sem o serrilhado de `clip-path`), recuo para 22,5% e leque 40px/62px sem colisão com a pasta.
4. **Otimização de GPU da pasta (achado 65):** `FLOOR = 0.001` no JS, `transform: translateZ(0)` nos casts, `will-change: transform; isolation: isolate;` na `.folder`.
5. **A luz da sala sobre o tampo** (`40-shell.css`, `.backdrop` do Gabinete): clarão branco em `soft-light` no terço superior e `multiply` nas quinas. Croma 80,2% → 73,2%, luz 61,7 → 74,3.

▶ **O punhado saiu de cima da pasta — 13/09, e o diagnóstico anterior estava errado.**
A proposta de `78px` → `60px` recuperava 9,7px de 57,3. O que a medição no navegador mostrou:
a janela de 1440 mostra **1196,8px** do Gabinete e punhado + pasta + telefone somam **1207,8**
encostados — **as três peças não cabem.** A causa é de 11/09: a pasta recuou de 52% para 47% e
cresceu de 0,40 para 0,44, e o punhado só andou de 27% para 25%.
⭐ **Resolvido sem encolher peça nenhuma:** `.mail` de 25% para **22,5%** e o leque de
`78px/92px` para **40px/62px**. Sobram 11px até a pasta, e 34px de envelope saem pela beira
esquerda — a área corta a cena de propósito (`overflow: hidden`, comentário ao lado).
📐 **Alternativa medida e recusada:** envelope de 155 para 130 também fechava o portão, e
custava 16% da carta.

✔ **Telefone v2 fechado em 13/09 03:30** (projeção a 78°, zero cor literal, zero filtro); a
revisão da v1, o plano e a auditoria (achado 66) estão no journal de 13/09.

⭐ **A guarda `orphans` passou a ver duas espécies novas, e as três achadas eram reais:** o
seletor de ESTADO que ninguém escreve (`[data-vence]` contra `data-urgent` — a carta que vence
nunca ficava vermelha), e a classe que só sobrevivia porque o nome dela aparecia fora de
texto — `.desk` casava com o `href` de `46-desk.css`, `.verdict` com uma variável de JS. 59 +
11 linhas de folha morta saíram.

✔ **A pesquisa 09 virou checklist puro do cargo** ([09](research/09-o-checklist-do-cargo.md)):
33 itens em 5 blocos + ciclo de sobrevivência + tabela de quorums, Realpolitik em cada item,
zero referência ao jogo. Fonte: auditoria do Gemini, cruzada contra código e norma —
acertou Realpolitik (LC 200/2023, ADI 6.457, Decreto 12.790/2025), errou quorums (54→41
senadores, 172→171 deputados).

✔ **LC 210/2024 conferida contra o texto oficial** (PLP 175/2024, ADPF 854): emendas
submetidas a contingenciamento e bloqueio paritário (arts. 7º e 8º); Pix e bancada com plano
prévio e TCU. Integrado aos itens 1.4 e 2.1 da pesquisa 09.

✔ **A pesquisa 10 (animações Apple e Liquid Glass) fechada e auditada — 11/09** ([10](research/10-animacoes-nivel-apple-e-liquid-glass.md)):
manual de engenharia de baixo nível cobrindo EDO analítica com velocidade inicial $v_0$ para
CSS `linear()` na GPU, incompressibilidade 3D de Poisson ($S_y = 1/\sqrt{S_x}$), telemetria com janela
de 45ms contra o finger dwell, e substituição de filtros SVG dinâmicos (inviáveis na web por restrição
de segurança e queda de fps na CPU em telas Retina) por Liquid Glass analítico em CSS
(`backdrop-filter` mais Schlick Fresnel em `box-shadow` inset). Base pronta para a etapa 2.

✔ **E ELA FOI EMENDADA EM 13/09 nos quatro pontos da auditoria de 11/09** — blocos CAUTION em
§1.4 (transição interrompida recomeça do zero), §2.5 (o corte se procura: 1,347 e não 1,22),
§2.6–2.8 (cada ponto leva a posição; o gerador que vale é `curveOf`) e §6.2 (`rotateX` no
envelope é pergunta para ele). A narrativa da auditoria está no journal de 13/09.

### ✔ A mesa — 08/09/2026

A cena tem o tamanho da foto — **1916×821**, o mesmo número em `DESIGN` e no `.room` — e só
ENCOLHE (`fitDesk` fecha em `Math.min(1, …)`). Clique na pasta **pega**; na mão, marca marca,
papel assina (rubrica corre), fora larga. Leitura a **86% da altura visível, medida, nada
cortado**. ⭐ `dressDesk` mora em `cabinet.mjs`, não no entrypoint.
⚠ **O 1206×806 desta seção era de 08/09 e sobreviveu em quatro comentários de código** até a
auditoria de 11/09 — um deles dizia 1672×940 e 1206×806 no mesmo bloco, 34 linhas abaixo do
aviso "mexeu na foto? estes números mudam juntos".

⛔ **Seis defeitos que tipo+guarda+323 provas aprovaram, e a captura pegou:** `url()` em
custom property resolve contra a folha — caminho tem de ser absoluto; `--paper-ink`
duplicado derrubou o remetente a 2,84 (virou `--letter-ink`, hoje 4,5); marcas herdavam
botão antigo (1,24 nas oito — hoje tinta do documento + círculo de caneta); ato estourava
40px (rubrica 13px acima do DOU); seletor `data-assinado` vs `data-signed`; rubrica nascia
inteira e apagava em 1,1s. Mais três: clique do passeio caía no tampo (hoje clica via
`elementFromPoint`); `.mail` é âncora 0×0; espera virou assentamento, não relógio.

⭐ **A MESA É O CHÃO DO GABINETE — 11/09.** A madeira é `assets/jacaranda.webp` (1916×821, WebP
q=0,97, 709 KB) e ela é o **substrato da janela** (`.backdrop`, em `40-shell.css`): a barra e o
rail refratam madeira, que é o que liquid glass faz — vidro sobre o lugar, não ao lado. A cena
(`.room`, 1916×821, o mesmo número em `DESIGN`) é transparente e só carrega as peças.
⛔ **A foto passa pura, 1:1, vista de cima:** `fitDesk` fecha em `Math.min(1, …)`, `contain`
sobre o tamanho exato, sem tampo, sem verniz, sem grão, sem véu, sem inclinação — a árvore 3D
saiu inteira, e no substrato a saturação de 1,5, o grão e a tinta da situação se desligam no
Gabinete. A única coisa que toca a foto são 44px de degradê na beira inferior, para `--bg-deep`.
📐 **Preço declarado:** em janela mais alta que 821px sobra fundo da UI embaixo da beira.
📐 **Custo:** `npm run screen` 76,3 com material × 73,7 de controle — dentro do ruído.

⭐ **Uma luz só (refeita em 13/09 — ver o Estado):** toda sombra da sala sai de `--light-dx` e das
quatro classes `--cast-*` de `00-tokens.css`, e cai para baixo e 0,36 para a direita; o véu do gesto e a vinheta apagam para `--bg-deep`, e não
para o preto. **A pasta é preta**, ordem dele, com a costura clara — fio preto sobre couro preto
não é ponto de seleiro. Pasta a 47% da cena, punhado a 22,5% (11px de folga da pasta; 34px de
envelope saem pela beira esquerda em 1440, de propósito), telefone no meio do vão medido por
`fitDesk`. ⚠ **Trocou a foto?** `DESIGN`, o `.room`, o `.backdrop` e
toda % de `.folder` e `.mail` mudam juntos.

⛔ **`place-items` não centra a cena:** a célula da grade cresce até 1916px e transborda para a
direita — quem centra a célula é `place-content`. Custou uma pasta cortada na beirada.

✔ **A carta que vence ficou visível — 10/09.** O bloco dela nunca tinha rodado (seletor morto).
Papel de `#9a2620` para **`#bd4436`, decisão dele**, com a cera escurecida junto: o lacre saiu
de **1,49** de contraste para **3,08**. Escurecer só a cera não salvava — o teto era 2,6.

⛔ **E a mesa passava 47 dos 48 meses SEM correspondência**, porque `arrived` comparava
`letter.month` com `state.month` — e o turno grava a carta com o mês que fechou e devolve o
estado no seguinte. Erro de um mês, nada falhava. Hoje o mês fechado sai de `state.months[0]`,
e cada carta chega dizendo se vence (antes o punhado marcava as ÚLTIMAS N, e as duas listas
divergem). Medido: correspondência em **23 de 30 meses**, e a primeira carta vermelha do jogo
no **mês 28** — depois dela, mês 31 e mês 34. Pico simultâneo de **3 envelopes**, contra o
teto de 8 da tabela de queda.

📐 **O correio, em 48 meses passivos:** a caixa fecha com **25 cartas**, chega alguma em **27
meses**, **7 pedem resposta** e **7 meses** têm carta vencendo. ⚠ **A primeira que PERGUNTA só
chega no mês 26** — metade do mandato sem ninguém pedir nada, e a pasta fica com uma folha só
até lá (vai com o achado 48/37).

✔ **A PASTA TEM DUAS FACES — 10/09.** ⛔ **Não existe "boletim da Casa Civil"**: o ciclo 25 §3.2
pediu peça sem lastro. O que vai à mesa é a **pasta de despacho**, e dentro dela a Exposição de
Motivos com o parecer de mérito (SAG) — então as seis leituras do ciclo 21 são a **face esquerda
da pasta**, em parágrafos numerados. ⛔ **Sem barra e sem régua, por ordem dele:** _"nenhum
elemento além do que um ser humano escreveria"_. O limiar mora na frase.
📗 **Vocativo `Senhor Presidente da República`** — o Decreto 9.758/2019 vedou "Excelentíssimo",
e o Manual de Redação é de 2018. Norma nova vence manual velho.

📐 **O papel ganhou resolução própria (`--paper`, 720px) e chega à tela com ~500** — textura
ampliada borra, reduzida fica nítida; e `-webkit-font-smoothing: antialiased` saiu da folha,
que era metade do borrão. Os envelopes seguem a mesma conta: 360px reduzidos por
`--envelope-fit`, e a diagonal da aba deixou de sair em escada. Custo medido em `npm run screen`:
**64,0 fps com material contra 66,1 de controle — delta 2,1**, no teto do monitor.

⛔ **A MOLA ANDAVA POR QUADRO, e agora anda por relógio.** Com `dt` fixo de 1/60, largar a pasta
levava **3s** num navegador a 12 fps. Hoje o tempo real é dividido em subpassos de 1/120 — a
1/20 num gesto de 0,26s o amortecimento inverte de sinal e a peça **explodiu para 12.878px** na
primeira tentativa. Volta em 700ms no headless.

⚠ **O que falta na mesa:** a rubrica não é estado (some ao virar o mês, assinar não custa nada)
— **decidido em 10/09: fica gesto até a segunda caneta existir**, porque assinar uma coisa só
não dá o que decidir. Calendário: recusado em 11/09. Telefone: pronto.

▶ **O plano em vigor é terminar a mesa** (ciclo 25, passos 4–6), decisão dele em 10/09: o
Gabinete tem 2 objetos de 5, e nenhum passo abre motor.

📐 **O fps se remede a cada mudança de matéria, e o número de 08/09 (238→160) foi medido em
outro teto de monitor — não o cite.** O de hoje está na seção da pasta. `npm run screen` fora
do portão, e os dois braços na mesma rodada.

### ✔ O partido — ciclo 24, item 1 (04/09/2026)

Lealdade 90 vs 70, emenda não compra o próprio partido, trair custa o dobro, tela marca
qual é a sua. **Sem bump de save** (prova cobra). `simulate --party` existe; base sem
partido: `agenda` **26 de 43**. Sobram origem, chapa/coligação, tela da eleição — e o ciclo
24 paga o `SCHEMA_VERSION` 21 uma vez só pelos quatro.

| jogada                         | o que vale de verdade                                                 |
| ------------------------------ | --------------------------------------------------------------------- |
| emenda cheia às nove           | **7–71 cadeiras**, mediana 16 (em pauta resistida: 23–83, mediana 49) |
| melhor partido (PLB), 48 meses | **+5 aprovações de 43**                                               |
| pior (PSU)                     | **−0,7** — pior que não ter partido                                   |

**Escolher partido é escolher com quem você concorda por 48 meses** (posição, não tamanho).
`"A emenda passar a pesar" saiu da fila` — o canal já entrega 71; o conserto é o achado 60.

### ⛔ A fila — o Congresso não disputa (05/09/2026)

675 pautas: **97,8% passam sem pagar um real** (folga mediana 54 votos); lealdade 50→48
derruba a base de **385 para 228** (degrau 0,6 em `moodFactor`, nas nove bancadas de uma
vez); abaixo de 50 nada passa e nenhum dinheiro compra. Rampa 50→20 medida fora do repo
abre faixa de negociação de 2 para 15 pontos — **mexe em ECLUSA, série se refaz, decisão
dele**. `settle` é aditivo puro: os +20 do partido atravessam o mandato sem estreitar.

| #   | o quê                           | onde                                         | custo                 |
| --- | ------------------------------- | -------------------------------------------- | --------------------- |
| ▶ 1 | ⭐⭐⭐ **ciclo 24** (itens 2–4) | [ciclo 24](cycles/24-o-presidente.md)        | médio                 |
| 2   | ⛔ **penhasco da lealdade**     | achado 60                                    | baixo, mexe em ECLUSA |
| 3   | ⭐⭐⭐ **o TEMPO**              | [ciclo 23](cycles/23-o-corpo-politico.md) A1 | médio, trava no 53    |
| 4   | ⭐⭐ **o BANCO CENTRAL**        | ciclo 23, C1                                 | médio                 |

▶ **A MESA, EM ETAPAS — ordens dele de 11/09. Calendário: recusado. Objetos mudos: não agora.**

✔ **Etapa 1 fechada — o telefone.** Hoje é a v2 (ver o Estado); toca quando `boilerOf` diz que um
grupo ferveu, clique abre o Email, prova em `screens.mjs`. Tokens `--phone-*` (7).

✔ **Tarefas do Antigravity (journal §11) respondidas — 11/09:** contraste do vidro sobre
madeira é pleno (todas as áreas com texto `#eef2f8` superam WCAG 4,5); SAJ é o nome vigente
(Decreto 12.002/2024), com DOU usando apenas "PRESIDÊNCIA DA REPÚBLICA" no cabeçalho e SAG
nos pareceres de mérito.

⭐ **A AUDITORIA ANTES DO COMMIT — 11/09.** Ele mandou revisar tudo o que está fora do commit
antes de ele entrar. Portão verde no fim: **13 guardas · 66 sintéticas · 324 provas · passeio**,
e a série de `simulate` idêntica (`agenda` 26/43, dívida 90,0%) — nenhum arquivo de
`src/domain/`, `src/data/` ou `src/application/` foi tocado nesta árvore.

⛔ **O bug que ela achou é de partida, e ele é visível:** `lifted`, `at` e `sealed` moram em
variável de módulo em `cabinet.mjs`, e nada os limpava na posse. **Reproduzido no navegador:**
assinar em jan/2027 → NOVA PARTIDA → o decreto de jan/2027 da partida nova nasce
`data-signed="true"`, com a pasta na mão a **710px** (448 na mesa) e a sala apagada. A epígrafe
é função pura do mês, então ela se repete entre partidas e comparar por ela não separa duas
mesas. Conserto: `forgetDesk()`, chamada no `submit` da posse. **O passeio passou a ver os dois
lados** — ele ergue, assina, recomeça e cobra a mesa limpa; sem o conserto acusa `707px contra
683px`.

⛔ **E a brecha: a carta que vence era a primeira a ser cortada.** `app.mjs` põe as urgentes no
FIM (para caírem por cima) e `mail-pile.mjs` fatiava os 8 primeiros — com 12 cartas e 3
vencendo, saíam oito envelopes e **nenhum vermelho**. Não mordia hoje (pico medido de **4 de 8**
em 48 meses passivos), e morde no dia em que a Caixa crescer, que é a etapa 3. Hoje o corte
preserva a urgente. Prova em `screens.mjs`, e ela falha na versão anterior.

✔ **Etapa 2, primeira metade — o véu saiu (ordem dele em 11/09, vendo a tela).** `.desk__veil`
e `--lift-veil` foram removidos inteiros: a pasta vem à frente e a madeira fica como está. O
que sobe continua sendo escala + as duas sombras cruzando opacidade.

⭐ **A LIMPEZA PROFUNDA — aprovada por ele em 11/09, e ela se corrigiu com a medicao.**

✔ **C · duplicacao.** `REGIME.firstYear` existia no catalogo com schema e **nenhum leitor**,
enquanto 2027 estava teclado em `state.mjs`, `brief.mjs` e `decree.mjs`. Hoje `monthParts` le o
catalogo e os dois documentos perguntam a ele. `governmentOf` saiu de 3 chamadas por montagem
para 1, nas duas telas (custo medido: 0,059ms cada — e limpeza, nao desempenho).

✔ **A · a cena tem UMA fonte de tamanho.** 1916×821 morava em `DESIGN`, no `.room` e no
`.backdrop`, com um aviso de que as tres mudavam juntas — e o aviso falhou em quatro
comentarios. Hoje `dressDesk` escreve `--room-w` e `--room-h`, o CSS os le **sem fallback** (um
fallback seria a copia de volta) e os dois entraram na lista RUNTIME de `tokens`.

⚠ **B · a poda: a gordura era pequena, e o numero que eu citei estava errado.** As 6.593 linhas
de comentario incluem **1.749 de contrato de tipo**, que e contrato e fica. A prosa real e 4.858
— razao 0,52, e nao 0,70. Inspecionando os quatro piores arquivos e varrendo o repo com dois
detectores, o que saiu foram **16 linhas**: cabecalho que prometia quatro itens e listava um,
JSDoc comecando no meio de uma frase, dois blocos para o mesmo campo, dois comentarios orfaos de
um instrumento que saiu do arquivo, e `/* O CONTRASTE FOI MEDIDO antes de fechar. */` — que
afirma a medicao e nao diz o numero. ⭐ **O resto da prosa cumpre a regra**, e a meta de 0,45 que
eu propus so se atingiria apagando razao boa. ⛔ **E as 21 citacoes de ordem dele em comentario
NAO saem**, apesar de a regra do teto as proibir: elas carregam a autoria de decisoes de gosto,
e este repositorio ja pagou caro por perder isso.

⚠ **E · o CSS nao tem regra morta alem do que a `orphans` ja pega.** Varredura contra o DOM
real — 30 meses, todas as telas, tres janelas, pasta erguida, pasta protegida, ato assinado,
alavancas movidas, cartas abertas e respondidas: **127 de 565 regras nunca casaram**, e elas nao
sao mortas. `.passage` e `.tally` (13 regras) so existem com texto em tramitacao; os
`::view-transition` so durante a troca. ⭐ **O que a lista e de verdade e um mapa do que o
passeio nao exercita** — 127 regras que podem quebrar sem nada acusar. Vale virar ferramenta do
repo num ciclo proprio.

⛔ **D · os arquivos grandes NAO foram cortados, e a medicao e a razao.** Todo corte mapeado
ALARGA a superficie publica em vez de reduzi-la: em `turn.mjs`, `playMonth` tem 463 linhas e usa
quase todas as 24 funcoes privadas; em `inbox.mjs`, extrair os 382 linhas de anexo obrigaria a
exportar **seis** funcoes hoje privadas — de 4 exports para 10. Os dois sao grandes porque
concentram uma responsabilidade coesa. ⚠ Fica aberto, e a pergunta e dele: alargar a superficie
vale o arquivo menor?

📐 **O fps remedido aqui — 11/09, quatro rodadas.** O Antigravity devolveu `58,7 × 55,3 (delta
+3,4)`; nesta máquina deu **−5,5 · −2,6 · −2,3** (uma quarta rodada saiu inválida, 1,0 × 1,0). A
conclusão dele está certa — está dentro do ruído e abaixo do limiar de 5 do script —, mas o SINAL
não: aqui o material sempre CUSTA, nunca ganha. ⚠ Número de `screen` é da máquina que mediu.

✔ **ETAPA 2 FECHADA — o voo é RESOLVIDO, e não integrado por quadro (11/09).**
`curveOf` em `spring.mjs` resolve a EDO do oscilador amortecido nos três regimes, com velocidade
inicial, e entrega a curva como `linear()`. O voo virou **uma animação por peça no compositor**:
`LIFT` 0,30s e `DROP` 0,26s, os dois com `bounce: 0` — amortecimento crítico, sem quique e sem
rotação, ordem dele.
📐 **O número que sustenta:** o gesto pede **0 quadros e 0 escritas de estilo** à thread
principal, contra ~24 `requestAnimationFrame` e ~72 escritas do laço anterior. `npm run screen`
não mexe (−2,1 e −6,5, a mesma faixa) — e não devia: ele mede a tela parada, não o gesto.
⭐ **E A INTERRUPÇÃO NÃO SALTA, que é a razão de tudo isto.** Largar a pasta no meio da subida
parte do ponto e do impulso em que ela está — quem tem `x(t)` tem `x'(t)`, então posição e
velocidade saem da CONTA e não de uma medição entre quadros. Prova nova no passeio, e ela
reprova quando o voo passa a recomeçar do alvo (que é o que a transição CSS faz).
📗 **Seis provas novas em `tests/suites/spring.mjs`** cobram a física, não o formato: a
analítica contra a derivada numérica nos três regimes, `v₀` honrado, quique zero que não
ultrapassa. Uma delas pegou um erro de sinal meu no superamortecido — `(r2−r1)` por `(r1−r2)` —
que dava posição certa nas duas pontas e caminho errado no meio.

⛔ **E UM QUARTO ACHADO NA PESQUISA 10, e este quebra o movimento.** O §2.6 manda amostrar em
`t_i = settle·(i/N)^1.2` e o gerador do §2.7 emite `linear(v0, v1, …)` **sem as posições**. O CSS
espaça os pontos sozinho, então a amostragem densa no arranque sai esticada: medido, a pasta
chegava a **489px aos 120ms onde a conta pede 635**. Cada ponto tem de levar a posição
(`0.0415 3.59%`), e é assim que `curveOf` emite.
📐 **E o assentamento é PROCURADO, não constante:** a busca fecha em 0,426s para `LIFT`, contra
os 0,366s que o `1,22 × duração` do §2.7 daria.

▶ **Etapa 3 — os envelopes.** Hoje _"inúteis"_: só decoram. Mostram o que chegou no fechamento
(0 a 3 por mês, medido; 23 de 30 meses com alguma) — ele pula meses e acha pouco. 💡 **Futuro
dele:** clicar num envelope abre com animação e mostra o **texto da carta dentro dele** — a
Caixa na mesa, uma carta por vez. É ciclo (a carta já existe em `inbox.mjs`; a peça é nova).

💡 **Ideia dele para ciclo futuro (11/09): no Gabinete o rail desce e vira um DOCK** — barra
horizontal só de ícones no pé da tela; em qualquer outra tela volta à borda esquerda. Coerente
com a mesa como chão (vidro flutua sobre o lugar). Antes de desenhar: os 8 ministérios sob um
ícone só (13 sem rótulo é demais), medir a altura que sobra para a pasta em 900px, e animar
a mudança pela view transition da troca de tela (`view-transition-name`), não por mola.

Passo 5 do ciclo 21 (a MP) aberto, pede sessão própria. **Antes da primeira linha:**
`standards.md`, o ciclo escolhido, a captura em `captures/passeio/`.

## Achados abertos

Um achado citado aqui pode não morar mais aqui — os que fecharam saíram para o
[`journal.md`](journal.md). Número com data envelhece: antes de repetir um, remeça-o.

**64. ⛔ O PARECER SOMA MÊS COM ANO na primeira frase que o jogador lê (11/09).**
`UI.brief.treasury` escreve _"O mês tem R$ 14,1 bi para gastar. A despesa obrigatória come
R$ 2,15 tri dos R$ 2,26 tri de receita"_. 📐 `room` é do MÊS (`settlement`); `mandatory` e
`revenue` são **anualizados** — está escrito em `src/domain/budget/index.mjs:23`. Nada na frase
diz isso, e quem lê conclui que o mês fecha 2 tri no vermelho. A tela antiga separava os dois
em blocos com legenda própria e não induzia a soma. **Conserto é escolher a frase, e a escrita
do jogo é dele** — por isso fica aberto e não foi mexido.

**63. A promessa da posse saiu do Gabinete e não voltou (11/09).** O painel a mostrava
(`platformOf` + `betrayalOf`), o parecer tem cinco parágrafos e nenhum é ela, e a prova
"A PROMESSA QUEBRADA APARECE DURANTE O JOGO" foi removida sem substituta. Ela segue viva no
relatório do turno (`turn.mjs:2337`), então não sumiu do jogo — sumiu da mesa. ⚠ E o ciclo 25
§3.2 prometia que ela viraria **uma linha do papel**. Aberto: entra como 6º parágrafo do
parecer, ou fica só no fechamento?

**53. ⛔ NÃO RECALIBRAR A CAPACIDADE antes da reformulação das empresas (decisão dele,
21/08).** `decay`/`yield` serão trocados; número girado hoje se gira duas vezes. Onde vale
investir: Congresso, tramitação, Caixa. Pergunta sem resposta: quanto tempo uma decisão
leva para mudar o país (hoje: mais que um mandato em 6 de 8 áreas — ninguém escolheu).

**52. As SONDAS espalham, não o país que é inerte (21/08).** Concentrar 48 meses na Saúde:
61→71,5; rodar o foco: 61→65. Seis das oito áreas têm meia-vida maior que o mandato
(Educação: 79 meses). O país premia compromisso sustentado (+10,5 vs +4) e nenhuma tela diz
isso. Lição: antes de chamar de defeito do motor, faça a pergunta que o instrumento nunca fez.

**48/37. A Caixa pergunta em 22 de 48 meses passivos** (`demand` 29 carta-meses); `reported`
deu **zero** — relator só emenda texto que machuca 2+ alavancas (`passage.mjs`), e ninguém
diz isso ao jogador. Baixar o limiar reabre o defeito que a regra consertou.

**47. As réguas de Finanças descrevem país 20× mais volátil que o modelo produz (21/08).**
Inflação 0,2 de 20 traços em 12 meses. Falta medir no governo ATIVO para decidir: régua
larga ou modelo parado. Decisão dele nos dois ramos.

**45. Escadas de Finanças a 0,5rem = 1px por traço (21/08).** Menos grave que na barra
(variação escrita ao lado); engordar mexe em 18 linhas de tela densa por decisão. Decisão dele.

**40. "Quem trava a obrigatória" caiu de três para um (21/08):** `Aposentadoria urbana trava
R$ 66,7 bi` numa frase. O 2º e 3º estão a um parâmetro (`lockedBy` devolve três, a tela
imprime dois). Aberto: um só basta?

**35. Saúde decai rápido na prosa, é das mais lentas na identidade (63 meses de meia-vida).**
Uma das duas está errada; decidir é recalibrar `yield`/`cost`. Registrado no catálogo também.

**36. A catraca do rateio (fechada no A3, 03/09):** `honour` não grava mais o corte no
estado; `blocked` (teto) ≠ `atRisk` (meta); relatório bimestral avisa antes. Reversível pelo
jogador; deixa de ser no dia em que alguém automatizar.

**22. Tramitação NÃO estrangulada (remedido 03/09):** `agenda` 26/43, `base` 34/41. O que
morre antes do plenário (gaveta, relatoria) segue sem medição — sonda `legislador`: 2 de 39.
`ANSWER_TIME = 2`, primeiro chute declarado. Taxa de aprovação: ler na série, nunca aqui.

**23. Travar custa só o relógio** (texto volta à gaveta com `writtenAt` intacto). Se sair de
graça, o canal da ofensa (memória do relator) é onde mexer — ofensa não é calote.

**7/8/10/11/12/26/28.** ECLUSA é primeiro chute (`PIVOT 58`, `SPREAD 16`, `THREAT 85`);
`bills.mjs` é catálogo morto que respira (virar fixture ou morrer); benchmark de fps bate no
teto de 240 Hz; jogador não escreve gatilho/exceção/revogação (rito deve sair do alcance,
não do delta); `state.norms` cresce sem poda e sem tela para a pilha; vinculação incide
sobre bruta e no mundo é sobre líquida (RCL — pede terceira fatia de receita); prêmio de
risco só morde fora da faixa jogada (vai com o 22).

**20. A rua precifica voto e mais nada (metade caiu 16/08).** SONDA não toca índice,
receita nem despesa: governo detestado governa país igual. Desenho proposto não pluga
(segmento por renda × greve por profissão). É ciclo, não conserto.

**16. Ambições com preço (04/09) — sobra o sorteio.** Abertura dá quatro `state` em oito
pessoas; estratificar troca a ambição de quem já joga. Decisão dele.

## ▶ A série que calibra — a ÚNICA que serve para calibrar

Seis das nove sondas (`concentra`, `favoritos`, `legislador` escolhem em vez de espalhar e
se medem à parte). 48 meses, semente padrão, sem partido (`--party` compara outro jogo; com
PLB, `agenda` dá 30/43 — ver fila). Remedida 03/09 após o A3; imóvel em 04/09 nas nove.

| política     | dívida/PIB | votações     | indústria | segurança |
| ------------ | ---------- | ------------ | --------- | --------- |
| `herdado`    | 89,9%      | 0 de 0       | 48 → 27   | 38 → 25   |
| `agenda`     | 90,0%      | **26 de 43** | 48 → 20   | 38 → 20   |
| `base`       | 90,7%      | **34 de 41** | 48 → 20   | 38 → 20   |
| `piso`       | 90,9%      | 5 de 17      | 48 → 15   | 38 → 15   |
| `explorador` | 91,8%      | 0 de 0       | 48 → 25   | 38 → 17   |
| `promessa`   | 92,4%      | 0 de 2       | 48 → 19   | 38 → 17   |

**Mexeu em `src/data/`, `src/domain/` ou `src/application/`? remeça esta tabela no mesmo
commit** — seis dias de raciocínio já correram em cima de tabela velha uma vez.

## O que existe

**Tela:** barra fixa (data, vitais, avançar) + sidebar por poderes e lugares + treze
endereços (Gabinete, Email, Congresso & Leis, Finanças, oito áreas, Estado; fecho ocupa o
Gabinete). Gabinete é MESA desde 04/09 (cena 1916×821, que só encolhe; contingenciamento com as
oito pastas no Art. 2º). Email é a Caixa em tela cheia. Regras: uma lâmina por tela, tela
pergunta ao motor, ausência declarada ≠ disfarçada. Vocabulário único em
`src/ui/shared/annex.mjs` (guarda `annexes`).

**Dados:** 9 blocos · 513 cadeiras · 8 áreas · 38 programas · 6 regras · 4 grupos de pressão
· 3 faixas de renda · 8 arquétipos (cobrado por prova — prosa já mentiu "onze" e "sete").

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

**Motores:** LASTRO (receita, teto, `blocked`×`atRisk`) · ECLUSA (`whipCount`/`vote`/`settle`)
· MALHA (índices, `pushOf`/`liftOf`) · SONDA · ELENCO (semente, sem fluxo de RNG) ·
CORRENTE (hiato, Phillips, Taylor, Okun, `carry`) · ESTRATO (faixa derivada, nunca guardada)
· DELTA (lido do catálogo) · TEMPORAL e CASCATA só contrato (`export {}`).

**Composição:** `agenda.mjs` (proposta, rateio) · `turn.mjs` (`bandsOf`→`settlement`→`ledger`
→`situationOf`→`playMonth`; ordem é mecânica) · `public/` (fachada; `boundaries` prova) ·
`simulate.mjs` (nove sondas; `explorador` tenta quebrar o orçamento).

**Verificação:** 13 guardas · 66 sintéticas · 323 provas · passeio dentro do `validate`
(42s; rolagem, recorte, contraste no pixel). `orphans` cobra classe **e** estado.

## O que ainda não existe

- **TEMPORAL e CASCATA** — só os contratos;
- **tensão institucional** — variável de estado (`risco = f(tensão − escudo)`), não motor;
- **contraste em texto com filho elemento** — o medidor não alcança (`standards.md` §7);
- **layout de força para o DELTA** — grafo lido, peça que desenha não;
- **GitHub Pages** — só CI por enquanto.

## Decisões fechadas que não se reabrem sem pedido

Fase 1 só o Brasil · 48 turnos mensais · inglês no código, português na prosa · cascata
declarada · codinomes de motor · zero build/runtime · lealdade serializada · motor nenhum
chama outro · Congresso responde ao PAGO · rateio proporcional · âncora é o TETO que
vigorou · tela pergunta, previsão usa o pago · rascunho morre com o mês · tudo é alavanca
com preço · posição calculada, rito sai do conteúdo, jogador não inventa substantivo ·
catálogo cita fonte · Finanças sem controle · ordem entre normas total (hierarquia,
especificidade, recência, escrita) · geral não revoga especial sem nomear · faixa
derivada, nunca guardada · pessoa é semente (save guarda memória) · elenco sem RNG ·
ambição é preço, traição pesa mais que favor · déficit primário tem de rodar · preço
escala com dispersão · layout é promessa. **Princípio: tudo tem um jeito de ser feito —
o que separa o possível do impossível é o preço.**

Decisão que saiu (registro): rail listava áreas enquanto o jogo era só orçamento; ciclo 4
trocou por poderes e lugares, áreas em Ministérios. IA por API fora (04/09; ciclo 19 será
reescrito — avaliador, não gerador). Sem presidente sem partido (CF 14, §3º, V); federação
= coligação com preço para romper; barreira pode matar o partido no ano 4.

Referências: Geopolitical Simulator, Football Manager 2020. Liquid glass é a base, não o teto.

## Fontes de modelagem

Dossiê externo revisado; correções na prosa de cada arquivo (`parties`, `fiscal`,
`macro`, `congress`, `economy`, `turn`). Campo real em `docs/research/`.
