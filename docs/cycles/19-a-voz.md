# CICLO 19 — O MUNDO TEM OPINIÃO

> **Reescrito em 04/09/2026.** Ele era "A VOZ", e era um plano de integração de IA por API. A
> decisão dele matou o caminho e manteve o destino:
>
> _"não quero gastar mais nenhum centavo com o jogo, então não pretendo integrar uma IA, o que eu
> quero é de alguma forma criar uma IA, ou algo parecido, no meu jogo, por exemplo, pretendo criar
> personalidades para as pessoas, mídia, e tudo mais, assim as coisas vão acontecendo
> naturalmente."_
>
> ⭐ **E a [pesquisa 07](../research/07-a-lei-que-o-jogador-escreve.md) §4 achou a resposta: a IA
> que faz um mundo parecer vivo é o AVALIADOR, e não o gerador.** Este ciclo constrói o
> avaliador. Ele é o alicerce do [ciclo 22](22-a-lei-que-voce-escreve.md) — **sem ele, uma lei que
> o jogador inventa não tem preço**, porque `threat` é escrito à mão, texto por texto.

---

## 1 · 📐 O QUE JÁ EXISTE, e é mais do que qualquer plano deste projeto assumiu

**O avaliador não nasce do zero. Metade dele roda em produção, com prova.**

`whipCount`, em `src/domain/congress/index.mjs`, faz hoje isto **para cada bancada**:

```
distância  = a distância ideológica em TRÊS eixos (economia, liberdade, dispersão)
venalidade = o quanto ESTA bancada se compra NESTA direção
resistência = distância × (1 − venalidade × verba paga)
            + ameaça × venalidade × peso
            − rua × peso
adesão     = logística(resistência)
```

⭐ **Isso já é uma função de utilidade por agente.** Cada bancada olha a sua proposta e responde
_"isto é bom para mim?"_ com o próprio eixo, a própria venalidade e o próprio humor.

**E `agenda.mjs` já compõe a proposta a partir do que o jogador moveu**, sem ninguém ter escrito
aquela lei: economia, liberdade, ameaça e dispersão saem da **média ponderada dos programas
tocados**, com o peso sendo o quanto cada um se moveu.

📐 **Ou seja: o jogo já precifica uma pauta que ninguém previu.** O que ele não faz é o resto.

---

## 2 · ⛔ OS TRÊS BURACOS, e eles são o ciclo inteiro

| #   | buraco                                                             | consequência de jogo                                              |
| --- | ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| 1   | **só a bancada avalia.** O lobby e a rua não têm opinião sobre lei | você aprova uma lei que destrói o setor produtivo e ele não reage |
| 2   | **a pessoa não avalia nada.** 📐 4 das 5 ambições são inertes      | oito pessoas com nome e história respondem todas igual            |
| 3   | **o mundo não AGE.** 📐 100% dos textos nascem do jogador          | a oposição só vota não. Não há o que vetar, nem o que noticiar    |

---

## 3 · ⭐ ITEM 1 — A RUA E O LOBBY PASSAM A LER A LEI

**Hoje a rua entra na votação como UM número global** — `standing`, a aprovação do governo, que
desloca a resistência de todas as bancadas igualmente. **A rua não sabe do que a lei trata.**

📐 **E o lobby não olha lei nenhuma.** Ele lê a MALHA, ferve e chantageia. Uma lei que arrasa a
área dele passa sem que ele diga uma palavra.

**As duas peças já sabem o que precisam saber:**

- 📐 `SEGMENT` reparte a rua em **três faixas de renda**, cada uma com aprovação própria;
- 📐 cada `LOBBY` tem `wants`, alcance e ponto de fervura, e **dois deles já leem a MALHA**;
- 📐 e a `Proposal` já carrega `byArea` — **quanto de cada área a pauta moveu**.

⭐ **O encaixe é direto:** a lei move áreas; o lobby quer áreas; o segmento é atendido por áreas.
Cada um soma o que ganha e o que perde, e devolve **um deslocamento próprio da resistência** no
lugar do `standing` único.

**O que muda no jogo:** cortar a Previdência deixa de custar "aprovação" e passa a custar **a
faixa de baixa renda e o grupo que a defende**, com nome. E aí a mesma lei tem preços diferentes
em governos diferentes, porque a composição da rua é diferente.

⚖ **Restrição:** o `standing` global **não sai** — ele vira o piso, e o deslocamento por área
entra por cima. Trocar um pelo outro faria a série se refazer inteira sem ninguém ter escolhido.

---

## 4 · ✔ ITEM 2 — AS QUATRO AMBIÇÕES INERTES GANHAM PREÇO — **FEITO em 04/09/2026**

> **Entrou inteiro, e o achado que ele produziu é maior que ele.** As cinco ambições passaram a
> olhar coisa diferente, a tela de cada uma diz o preço, e 4 provas novas cobram o canal. ⚠ **Mas
> o peso medido é de 1 cadeira em 380 — e com os cinco parâmetros no TETO, 4 em 513.** A causa
> não é o parâmetro: a emenda inteira, de 0 a 100%, compra **13 cadeiras de 513** por R$ 25,7
> bi/mês, numa pauta que já passava. **A ambição modula uma moeda que não pesa.** Ver o achado
> 59 do [handoff](../handoff.md), e a decisão que ele abre.

📐 **Medido:** `offered`, em `src/domain/cast/index.mjs`, traduz dinheiro em adesão pessoal. A
única linha que olha ambição é esta:

```js
const drag = person.ambition === "succession" ? parameters.successionDrag : 0;
```

**Quem quer um ministério, o governo do estado, uma vaga no tribunal ou só se reeleger recebe o
mesmo tratamento de quem não quer nada.** As quatro são sorteadas, aparecem na tela do Congresso
e não movem uma linha do motor. É o achado 16 do handoff e o item 10 do [ciclo 18](18-a-caneta.md).

⭐ **E o conserto não é dar um número diferente a cada uma — é fazer cada uma olhar COISA
DIFERENTE.** É isso que separa personalidade de constante:

| ambição      | o que ela quer       | o que ela passa a olhar                                                    |
| ------------ | -------------------- | -------------------------------------------------------------------------- |
| `succession` | o Planalto em 2030   | ✔ já desconta a verba: aceita o dinheiro e continua querendo o cargo       |
| `seat`       | continuar onde está  | ⭐ **a RUA.** Ele vota com a sua aprovação, e contra ela quando ela cai    |
| `cabinet`    | um ministério        | **a área dele.** Lei que engorda a pasta que ele quer o compra mais barato |
| `state`      | o governo do estado  | **o que desce para os entes**, e não o programa federal                    |
| `court`      | uma vaga no tribunal | **quem indica.** Dinheiro o move pouco; a indicação o move inteiro         |

⭐ **O `seat` é o mais barato e o mais brasileiro dos cinco:** `standing` já está dentro do
`whipCount`. O baixo clero que segue a popularidade é uma linha de código e é literatura.

⭐ **E o `court` fecha o círculo com o ciclo 18:** três vagas do Supremo caem nos meses 16, 28 e
48, e a indicação passa pelo Senado. **A ambição já está sorteada e já está na tela** — falta ela
ter preço.

**O que muda no jogo:** a mesma oferta sua recebe respostas diferentes, porque as pessoas querem
coisas diferentes. É a definição de personalidade, e ela sai de graça de um sorteio que já roda.

---

## 5 · ITEM 3 — O MUNDO PROTOCOLA TEXTO

📐 **100% dos textos deste jogo nascem do jogador**, e é por isso que não existe veto: não há o
que vetar.

**Com o item 2 na mão, isso vira barato:** uma pessoa com ambição e alcance de bancada tem motivo
próprio para escrever. O que ela protocola sai da ambição dela e do que está ruim para ela —
**pelo mesmo avaliador, com o sinal invertido**.

⭐ **E isso destrava três itens de outros ciclos de uma vez:** o **veto** (item 8 do ciclo 18)
passa a ter objeto; a **derrubada de veto** ganha sentido; e o **jornal** ganha o que noticiar
num mês em que o governo não fez nada.

⚠ **É o item que abre motor deste ciclo**, e ele não divide sessão com os outros dois.

---

## 6 · ITEM 4 — O JORNAL, e ele não precisa de modelo nenhum

📐 **Medido em 03/09/2026:** um governo passivo produz **20 fatos noticiáveis em 16 dos 48
meses**; um que legisla todo mês produz **56, em 32 de 48**. ⛔ **Mesmo o ativo passa 16 meses sem
uma linha**, e coluna vazia em um terço do mandato lê como tela quebrada.

⭐ **Então o jornal noticia o ORDINÁRIO:** o PIB saiu, a inflação veio, a Saúde caiu 2 pontos, o
Congresso não votou nada. **Isso é ficha cheia todo mês.**

**E quem escolhe a manchete é uma regra, não um modelo:** o que mais se moveu, medido em desvio
da própria régua. O texto sai de moldes, e a variedade vem da **combinação** — quem falou, sobre
o quê, com que ângulo, contra quem.

⭐ **O veículo tem linha editorial, e ela é o mesmo avaliador.** O jornal do mercado e o da rua
noticiam o mesmo fato com sinais opostos, porque a utilidade deles tem sinais opostos. **Isso é
uma subtração, não um prompt.**

⚠ **E os veículos seguem o [ADR 0003](../adr/0003-o-mundo-e-real-as-pessoas-sao-inventadas.md):**
imprensa inspirada na real, com **nome alterado** — a mesma regra dos partidos.

---

## 7 · A ORDEM, POR CUSTO

| passo | o quê                                    | motor      | custo   | depende |
| ----- | ---------------------------------------- | ---------- | ------- | ------- |
| ✔ 1   | as quatro ambições ganham preço (item 2) | liga canal | pequeno | feito   |
| **2** | a rua e o lobby leem a lei (item 1)      | liga canal | médio   | —       |
| **3** | o mundo protocola texto (item 3)         | abre motor | grande  | 1       |
| **4** | o jornal (item 4)                        | abre motor | médio   | 3       |

⭐ **O passo 1 era o item mais barato do projeto inteiro com efeito visível, e ele foi.** O
efeito é visível **na tela**, e é lá que ele entrega: cada pessoa diz o que quer e o que isso
custa. ⚠ **No voto ele não entrega**, e o número está no achado 59.

---

## 8 · ⛔ O QUE ESTE CICLO RECUSA

| pedido                                     | por quê                                                                      |
| ------------------------------------------ | ---------------------------------------------------------------------------- |
| **chamar modelo de linguagem**             | decisão dele, 04/09/2026: **zero centavo**. E o avaliador não precisa        |
| **texto de manchete escrito por IA**       | molde + combinação. A variedade vem de quem fala, não de quem escreve        |
| **a IA decidir se uma política funcionou** | [ADR 0001](../adr/0001-a-ia-fica-fora-do-turno.md), e ele continua certo     |
| **nomes reais de veículo**                 | ADR 0003 — nome alterado, como os partidos                                   |
| **conversa livre com um personagem**       | ⚠ não é recusa, é ordem: depois do item 2. Sem a voz definida, vira genérico |

---

## 9 · ⚖ A RESTRIÇÃO

1. `npm run validate` verde, e **a captura aberta**;
2. **todo item aqui mexe em motor** — então `simulate` roda e **a série se reescreve no mesmo
   commit**. ⚠ Os itens 1 e 2 vão mover a série de propósito: eles mudam quem vota o quê;
3. ⛔ **e nenhum item inventa número.** A ambição já é sorteada, a rua já é repartida, o lobby já
   tem alcance. **O avaliador não acrescenta dado — ele liga o que já está no catálogo.**

---

## ⛔ O QUE ESTE CICLO ERA, até 04/09/2026

Ele era um plano de integração de IA por API, escrito em 03/09/2026 a pedido dele — _"eu quero
uma IA mais aprimorada e abrangente no meu jogo sim"_. Tinha quatro lugares (jornal, voz,
veredito, gerador de catálogo), um cache pela ficha do mês para salvar o determinismo, e uma
seção 6 sobre onde morar a chave.

**Morreu a arquitetura, não o destino.** O texto inteiro está no `git log`, e a decisão que o
matou está no [`journal.md`](../journal.md) de 04/09/2026. ⭐ **O ADR 0001 chegou a ser emendado
para permitir a IA dentro do turno** — a emenda fica de pé e não custa nada, mas hoje ela não
tem uso.
