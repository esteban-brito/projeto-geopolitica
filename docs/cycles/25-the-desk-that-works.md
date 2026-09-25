# CICLO 25 — A MESA QUE FUNCIONA

> **Escrito em 06/09/2026, por ordem dele.** As palavras que decidem o documento inteiro:
>
> _"nada de painéis flutuando em cima de uma mesa, ou coisa do tipo… quero realismo físico, e um
> gabinete realista que FUNCIONE."_
>
> ⛔ **E ela matou o esboço que eu tinha acabado de desenhar.** Eu tinha proposto quatro
> retângulos com legenda em cima — a bandeja, a pasta, a margem, o calendário — pousados sobre a
> madeira. **Isso é o Gabinete de hoje com textura embaixo.** É exatamente a coisa que ele
> recusou, e eu a desenhei sem perceber.
>
> Ele executa a [pesquisa 08](../research/08-the-presidents-desk.md) e substitui o arranjo do
> [ciclo 21](21-the-desk.md), que foi construído inteiro em 04/09 e reprovado por ele em 05/09.

---

## 1 · ⭐ A TESE: uma mesa não tem painéis. Tem papel e tem objetos

**Uma tela de jogo precisa de dez números e cinco ações. Uma mesa real não tem números.** A
contradição parece fatal, e ela não é — porque um presidente de verdade recebe muita informação
por dia, e ela chega por **dois canais, e só dois**:

| canal                       | o que é                                          | o que ele entrega                     |
| --------------------------- | ------------------------------------------------ | ------------------------------------- |
| 📄 **o papel**              | um documento impresso, com timbre e texto        | **número lido** — densidade ilimitada |
| 🪵 **a propriedade física** | espessura, quantidade, altura, cor da borda, som | **número visto** — sem ler nada       |

⭐ **O segundo canal é o que um HUD não tem, e é melhor que ele:** você vê que a pilha está grossa
antes de contar. A espessura chega antes da leitura.

> ⚖ **A REGRA QUE SUBSTITUI O FILTRO DO CICLO 21, e ela não o nega — mede outra coisa:**
>
> **Um número LIDO é papel. Um número VISTO é objeto. O que não é nem um nem outro não entra
> na mesa.**

⚠ **O filtro do ciclo 21 continua valendo inteiro** — _"cada linha tem de mudar uma decisão que o
jogador está prestes a tomar"_. Ele mede **relevância**; esta regra mede **forma**. Uma leitura
tem de passar nas duas.

---

## 2 · 📐 O QUE ISSO CUSTA, medido — e é menos do que parece

⭐ **O vocabulário de leitura NÃO muda, e é o que faz este ciclo ser barato.** A peça
`src/ui/shared/annex.mjs` já é uma linha de _nome · pista · valor · nota_, e a guarda `annexes`
já proíbe tabela e régua desenhada à mão. 📐 **E ela já troca de substância por contexto:**
`.annex__who` lê `--sheet-ink-rgb`, e `.letter__annexes` a remonta para dentro da carta.

⛔ **O que muda é a SUBSTÂNCIA embaixo dela, e ela é um token:** 📐 hoje `--sheet` é `#0c1220`,
uma lâmina azul-escura. **Ninguém escreve peça nova — o papel vira papel.**

📐 **E a bancada já provou a matéria**, em `tmp/gabinete.html`, com 63 controles: jacarandá de
cinco camadas, couro de três, a folha A4 pelo Manual de Redação e o relevo seco do
Decreto nº 80.739/1977.

---

## 3 · ⭐⭐ A MESA — cinco objetos, e o vazio é a obra

📗 **O Gabinete real do Planalto é modernista e quase vazio** (pesquisa 08 §3). Em Niemeyer o
vazio é a obra. **Não é a escrivaninha vitoriana entulhada** — essa é a Casa Branca, e é o que
todo jogo do gênero já faz.

```
        ╭──────────────────────────────────────────────────────────────╮
        │   a sala — luz de janela, rasante, de um lado só             │
        │ ┌────────────────────────────────────────────────────────┐   │
        │ │  o tampo — jacarandá, veio grande, sangrando pelos lados│   │
        │ │                                                        │   │
   ☎    │ │   ▤▤▤                              ┌ ─ ─ ─ ─ ─ ─ ┐     │   │
   o    │ │   a bandeja                        │  o boletim  │     │   │
telefone│ │   4 envelopes                      │  da Casa    │     │   │
        │ │   ▪ 2 com tarja                    │  Civil      │     │   │
        │ │                                    │             │     │   │
        │ │        ╔═══════════════════╗       │ caixa 14,1  │     │   │
        │ │        ║  A PASTA          ║       │ preso   95% │     │   │
        │ │        ║  DE DESPACHOS     ║       │ maioria 436 │     │   │
        │ │        ║                   ║       │ rua     38% │     │   │
        │ │        ║  ▸ o decreto      ║       │             │     │   │
        │ │        ║    do mês         ║       │ pedem       │     │   │
        │ │        ║  ▸ ▸ ▸ (3 atrás)  ║       │ audiência:  │     │   │
        │ │        ╚═══════════════════╝       │ · o relator │     │   │
        │ │                                    └ ─ ─ ─ ─ ─ ─ ┘     │   │
        │ │                                              ▦▦▦       │   │
        │ │                                          o calendário  │   │
        │ └────────────────────────────────────────────────────────┘   │
        ╰──────────────────────────────────────────────────────────────╯
```

**Nada aí é um cartão.** A pasta é couro, o boletim é papel timbrado, a bandeja é uma bandeja, o
calendário é um bloco de folhas e o telefone é um telefone.

### 3.1 · A PASTA DE DESPACHOS — o centro, e a peça grande

📗 No Brasil o presidente **recebe a pasta**, não um ato solto.

⭐ **E o controle mora DENTRO do documento.** O decreto de contingenciamento já diz, no Art. 2º,
_"as pastas marcadas ficam fora do corte"_ — então **as oito áreas são marcadas no próprio
papel.** O ato que você assina é o ato que você editou. Um presidente rabisca a minuta; ele não
opera um painel ao lado dela.

📐 **Ela cabe N e hoje tem 1**, porque o contingenciamento é a única caneta construída. A MP é o
item 6 do [ciclo 18](18-the-pen.md), o veto é o A7 e a nomeação é o A6 — **os três abrem motor.**

⚠ **A espessura da pasta é o número:** quantos atos esperam, visto sem ler.

### 3.2 · O BOLETIM DA CASA CIVIL — o papel que carrega os números

**As seis leituras da margem do ciclo 21, impressas.** Elas já rodam, já foram escolhidas a dedo
e já passam no filtro da relevância — o que muda é que elas deixam de ser uma coluna de vidro e
viram **um ofício datilografado**.

⛔ **E ele NÃO é a carta de balanço da Casa Civil que já existe na Caixa.** A distinção é o tempo
verbal, e ela é a regra escrita em `standards.md`:

| peça                   | tempo                    | o que diz                        |
| ---------------------- | ------------------------ | -------------------------------- |
| o **boletim**, na mesa | **antes** da decisão     | com o que você decide agora      |
| a **carta**, na Caixa  | **depois** do fechamento | o que o mês deixou — foi e ficou |

> _"Informação que chega depois da decisão não é informação — é recibo."_ A carta é o recibo. O
> boletim é o antes. **Duas peças, dois tempos, e nenhuma refaz a conta da outra.**

⭐ **E a promessa da posse vira uma LINHA dele**, e não a faixa de 58px no alto do olho — é a
recomendação da pesquisa 08 §10.

### 3.3 · A BANDEJA DE CORRESPONDÊNCIA — e ela conserta um defeito medido

⛔ **Hoje o Gabinete não diz quantas cartas esperam nem quantas vencem.** Você avança o mês com
três vencendo e **a mesa não avisa nada**. É a mesma regra do recibo, quebrada.

⭐ **O conserto é um objeto, e o motor já existe:** `left(letter, month)` diz quanto falta para
cada carta, e `silences({ mail, orders, month })` diz **quais este mês fecha sem resposta**.
⚠ **A tela não conta nada por fora** — a prosa de `silences` já registra que escrever
`left(letter) <= 0` na view é a família de defeito mais cara deste projeto, com sete ocorrências.

**A quantidade de envelopes é o número. A tarja vermelha na borda é o prazo.** Clicar leva ao
Email — a mesa não absorve a Caixa, porque ela vai crescer (pesquisa 08 §7.4).

### 3.4 · O CALENDÁRIO DE MESA — o tempo, e ele é o item ⭐⭐⭐ do ciclo 23

**Um bloco de folhas. Você arranca uma por mês.** A espessura do que sobra é quanto resta do
mandato — sem barra de progresso, sem porcentagem.

⚠ **E aqui há um número que eu ia errar: `CARRY` é 24 e o mandato é 48.** 📐 Medido em
`src/application/mail.mjs`. **O save guarda 24 fechamentos, e não 48** — então o bloco **não pode
mostrar 48 folhas arrancadas com história dentro**. O que ele mostra é o mês corrente, os marcos
que vêm (`calendarOf`, que já roda) e **quanto falta**, que sai de `state.month` e é exato.

### 3.5 · O TELEFONE — e ele só toca quando alguém ferve

📐 A `CALDEIRA` já sabe quem está fervendo e a quantos pontos do limiar. Hoje isso é **uma linha
de texto na margem**. ⭐ Um telefone que toca é a mesma informação, vista em vez de lida — e é o
único objeto da mesa que **interrompe**.

### 3.6 · E os objetos que não fazem nada

O copo d'água, os óculos. ⚠ **São eles que separam uma mesa de um painel de controle**, e o
filtro do ciclo 21 não sabe medi-los — ele reprovaria os três por não mudarem decisão nenhuma.
⛔ **Silhueta e sombra, sem textura própria:** madeira num objeto pequeno é o skeumorfismo ruim
de verdade (pesquisa 08 §3.2).

---

## 4 · ⚖ AS TRÊS SUBSTÂNCIAS, e a fronteira é a regra inteira

O sistema visual tinha duas palavras. Esta mesa acrescenta a terceira, e ela precisa de fronteira
declarada ou vira a segunda paleta que o sistema existe para impedir:

| substância  | o que ela é             | onde                                               |
| ----------- | ----------------------- | -------------------------------------------------- |
| **vidro**   | a **interface**         | a barra superior, o rail — o que não é o mundo     |
| **madeira** | o **lugar**             | o tampo, e só ele. Nunca um cartão, nunca um botão |
| **papel**   | o **texto de registro** | o decreto, o boletim, a carta                      |

⭐ **A barra de vidro sobre a mesa de madeira não é contradição — é a distinção que faz a mesa
funcionar.** O vidro é o que você opera; a madeira é onde você está. ⚠ E a barra fica: ela entrou
em 01/09, os 41 tokens dela foram girados por ele, e **nada aqui a toca.**

---

## 5 · ⛔ O QUE A MEDIÇÃO JÁ NEGA — quatro riscos, com número

**1 · ⛔ A MESA NÃO PODE SEGUIR `--light-angle`.** 📐 `--glass-support-bg` no `.tray__month`
custou **28,3 fps sem filtro nenhum**, porque ele interpola a cada quadro. A luz do tampo é
**estática**, e o passeio da luz — se entrar — fica numa camada pequena e isolada.

**2 · ⚠ A MOLDURA ENCOLHE 208px.** 📐 A bancada desenha **1648×842**; o passeio mede o jogo a
**1440×980 e 1440×900**. O arranjo tem de nascer medido a 1440, e a altura de 900 é a que já
derrubou um cartão inteiro para baixo da dobra sem nada acusar.

**3 · ⚠ TEXTO INCLINADO A 11° É MENOS LEGÍVEL, e o conserto já foi provado.** `perspectiva.html`
mostra a folha saindo da inclinação ao ser levantada. ⛔ **Mas isso é um clique por leitura** — e
o boletim é justamente o que se lê de relance. **Ou ele deita mais plano que a pasta, ou o corpo
dele sobe.** `checkContrast` e `checkEllipsized` decidem, e não eu.

**4 · ⚠ O PORTE É TRABALHO, e ele nunca esteve em lista nenhuma.** 📐 Medido em 06/09 na bancada:
**20 `rgba()` e 3 hex crus** em `gabinete.html`, **5 hex** em `materia.mjs` — todos precisam virar
token no par `--x` + `--x-rgb` ou a guarda `tokens` reprova; **4 blocos de comentário acima do
teto de 10 linhas** em `materia.mjs`; e **3 datas em comentário** entre `decreto.mjs` e
`folha.css`, que a guarda `prose` reprova.

---

## 6 · A ORDEM DE EXECUÇÃO

| passo | o quê                                        | motor          | custo   | estado                      |
| ----- | -------------------------------------------- | -------------- | ------- | --------------------------- |
| 1     | **o tampo** — jacarandá, luz, sombra         | nenhum         | —       | ✔ na bancada                |
| 2     | **a pasta**, com o decreto dentro            | nenhum         | —       | ✔ na bancada                |
| 3     | **o gesto** — assinar, e rasgar para recusar | `spring.mjs`   | pequeno | ▶ assinar já roda           |
| 4     | **o boletim** — as 6 leituras em papel       | ✔ todos rodam  | pequeno | ▶                           |
| 5     | **a bandeja** — `left` e `silences`          | ✔ existem      | pequeno | ▶ conserta defeito medido   |
| 6     | **o calendário de mesa**                     | ✔ `calendarOf` | médio   | ▶ o TEMPO do ciclo 23       |
| 7     | ⭐ **o PORTE** — a bancada vira o jogo       | nenhum         | médio   | ⛔ **não existia em lista** |
| 8     | o telefone, e os objetos que não fazem nada  | ✔ `CALDEIRA`   | pequeno | —                           |

⭐ **Do 3 ao 6, nenhum abre motor.** Tudo lê função que já roda e já tem prova. **O que este ciclo
gasta é forma, e não mecânica** — e é por isso que ele cabe antes do ciclo 24 sem atrapalhá-lo.

⚠ **O passo 7 não é cópia.** No jogo a tela tem barra superior, rail, save, o passeio medindo
geometria em duas janelas, e as guardas `tokens`, `orphans`, `cascade`, `prose` e `annexes`. A
bancada não obedece a nenhuma delas — ela é HTML solto com `<style>` inline e cor crua.

---

## 7 · ⛔ O QUE ESTE CICLO RECUSA

| pedido                              | por quê                                                                      |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| **cartão, painel ou bloco na mesa** | 🗣 ordem dele em 06/09. É a coisa que este ciclo existe para não fazer        |
| **madeira num botão ou num cartão** | a madeira é o tampo. Matéria em peça pequena é o skeumorfismo ruim           |
| **fotografia realista**             | uma foto ao lado de um controle briga                                        |
| **rosto de pessoa**                 | ADR 0003 — um rosto inventado é a cara de alguém                             |
| **48 folhas de história no bloco**  | 📐 `CARRY` é 24. O que se mostra é o mês e o que falta, e os dois são exatos |
| **absorver o Email na mesa**        | ele vai crescer com imprensa e jornal, e não cabe num canto do tampo         |
| **número novo para encher a mesa**  | ⛔ cada objeto lê motor que já roda. Encher com invenção é proibido          |

---

## 8 · ⚖ O TESTE DE ACEITAÇÃO

> **Um estranho olha a tela por três segundos e diz quantos atos esperam, quanta
> correspondência vence e quanto falta do mandato — sem ler um número.**

E os quatro mecânicos:

1. `npm run validate` verde, **e a captura aberta nas duas janelas** — o portão não sabe olhar, e
   três defeitos já atravessaram tipo, guarda e cem provas para morrer na imagem;
2. ⛔ **nenhuma classe de leitura nova.** O boletim e a bandeja falam `annex.mjs`, ou a guarda
   `annexes` reprova — e ela está certa em reprovar;
3. 📐 **o fps medido nos dois braços na mesma rodada**, com a mesa e sem ela. `--light-angle` não
   toca no tampo;
4. ⚠ **a série não se move.** Nenhum passo de 1 a 7 encosta em `src/data/`, `src/domain/` ou
   `src/application/` — se ela mover, alguma coisa foi mexida por engano.

---

## Fontes

📗 [Pesquisa 08 — a mesa do presidente](../research/08-the-presidents-desk.md): o Gabinete real,
o jacarandá-da-bahia, Athos Bulcão, o Manual de Redação da Presidência e o relevo seco do
Decreto nº 80.739/1977, todos apurados e datados em 05/09/2026.

📐 Medições deste documento, feitas em 06/09/2026 neste repositório: `CARRY` em
`src/application/mail.mjs`; `--sheet` em `styles/00-tokens.css`; as janelas do passeio em
`tests/browser/walk.mjs`; e a contagem de cor crua, bloco e data na bancada `tmp/`.
