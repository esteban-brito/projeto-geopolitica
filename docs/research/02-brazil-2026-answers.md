# Respostas 01 — o que voltou, e o que fazer com isso

> Resposta parcial ao [briefing 01](01-brazil-2026-briefing.md), recebida na sexta sessão,
> 13/08/2026. Cobre os blocos 1, 2 (parcial) e 5 (parcial). **Cada número aqui
> ainda precisa da fonte e do ano-base antes de entrar no catálogo** — o que
> voltou veio sem citação, e o briefing pedia citação de propósito.

## Bloco 0 — a postura, decidida

**Números reais entram**, com fonte e data, e o aviso de ficção de cada arquivo de
dado muda de texto: deixa de dizer "nenhum número aqui é afirmação sobre o Brasil"
e passa a dizer o que são — valores reais, citados e datados, num modelo que é
ficção no que **faz** com eles.

## O que chegou utilizável

### Quóruns (confirma a suspeita, e o motor está errado hoje)

| rito                       | regra real                                     | o jogo hoje |
| -------------------------- | ---------------------------------------------- | ----------- |
| Lei ordinária (art. 47)    | maioria dos **presentes**, com 257 de presença | 257 votos   |
| Lei complementar (art. 69) | 257 votos (maioria absoluta)                   | —           |
| PEC (art. 60 §2º)          | 308 votos, **dois turnos**, **e o Senado**     | 308 votos   |

**A lei ordinária pode passar com 129 votos** num plenário esvaziado. O jogo exige
257 para tudo que não é emenda, e portanto pune o jogador cobrando o dobro do que
a Constituição cobra.

### Pisos constitucionais (o `floor` da Parte 2 tem endereço)

- **Saúde:** mínimo de **15% da Receita Corrente Líquida** da União;
- **Educação:** mínimo de **18% da receita líquida de impostos** da União.

Os dois só se mexem por PEC — `entrenched: true`, 308 votos.

### Emendas individuais impositivas

**R$ 38 a 40 milhões por deputado, por ano** (base 2024, projetado para 2025/2026).

---

## Achado 1 — o `seatPrice` está 28× acima da emenda real, e isso NÃO é um erro

|                        | valor                                                 |
| ---------------------- | ----------------------------------------------------- |
| `seatPrice` do jogo    | 0,09 bi/cadeira/**mês** = **R$ 1,08 bi/deputado/ano** |
| emenda individual real | **R$ 38–40 mi/deputado/ano**                          |
| razão                  | **≈ 28×**                                             |

Trocar um pelo outro **destruiria o jogo**. Com o valor real, comprar as 513
cadeiras a verba cheia custaria R$ 1,63 bi por mês contra R$ 25 bi de espaço
discricionário — **6,5% do caixa compra o Congresso inteiro, todo mês, para
sempre**. A escolha central do jogo (a quem pagar) deixaria de existir.

A conta de `fiscal.mjs` foi feita ao contrário, e está declarada lá: o número saiu
da exigência de que comprar o plenário fosse impossível. Ou seja, é **balanço com
aparência de dado**.

### A reconciliação, e ela é a parte boa

Duas coisas explicam a diferença, e as duas são verdadeiras:

**1. Emenda impositiva não é moeda — é direito.** O deputado recebe os R$ 38 mi
**vote ele como votar**. O que é negociável não é o valor, é o **empenho e o
pagamento** — quando sai, e se sai. Isso não é um problema do modelo: é
exatamente o que `settle` já faz, distinguindo `promised` de `paid` e cobrando 25
pontos de lealdade por traição. **O modelo já tem a forma certa; o número é que
não é a emenda.**

**2. `funding = 1.0` nunca foi "a emenda".** É o preço integral da lealdade de uma
bancada — emenda, ministério, diretoria de estatal, relatoria, cargo de segundo e
terceiro escalão. A emenda é a parcela **visível**, e por isso é a única com valor
público.

### O que fazer

- **`seatPrice` continua sendo abstração de custo total**, e o comentário dele
  passa a dizer isso em vez de deixar parecer emenda;
- **a emenda real vira a âncora da escala**: R$ 38 mi/ano ≈ 3,5% do que hoje é
  "verba cheia" mensal. A tela pode passar a nomear a parcela — _"o equivalente à
  emenda individual"_ num ponto da faixa — e aí o jogador tem régua real;
- **a decomposição em moedas** (emenda · cargo · relatoria), cada uma com valor e
  com efeito diferente, vira candidata natural a alavanca de regra. Fica no radar,
  não neste ciclo.

> **Pergunta que ficou sem resposta e importa mais agora:** a nº 4 do briefing —
> quantos cargos de livre nomeação existem e qual o "valor" de um ministério numa
> negociação. Sem ela, os outros 96,5% do preço seguem sem nome.

---

## Achado 2 — os pisos de saúde e educação são PROPORCIONAIS, e isso muda a mecânica

O plano da Parte 2 assumia piso como fração do custo do programa:
`obrigatória = Σ custo_p × piso_p`. Para saúde e educação isso está errado: o piso
é **percentual da receita**, e portanto **se move com a arrecadação**.

A consequência é grande e é de graça:

| despesa            | comportamento do piso | o que acontece quando a receita cai |
| ------------------ | --------------------- | ----------------------------------- |
| previdência, folha | **valor absoluto**    | não cede; espreme o discricionário  |
| saúde, educação    | **% da receita**      | **cai junto**                       |

Ou seja: numa recessão, previdência e folha **não cedem** e saúde e educação
**encolhem sozinhas** — sem que ninguém decida, sem evento roteirizado. É a mesma
natureza da armadilha do arcabouço que o LASTRO já tem, e é uma das coisas mais
verdadeiras que este modelo pode dizer sobre o Brasil.

**Consequência para o dado:** `floor` deixa de ser um número e passa a ter tipo.

```js
floor: { kind: "absolute", value: 40 }
floor: { kind: "revenue-share", base: "rcl", share: 0.15 }   // saúde
floor: { kind: "revenue-share", base: "rli", share: 0.18 }   // educação
```

E `rcl` e `rli` passam a ser saídas do LASTRO, porque hoje ele calcula receita mas
não separa as duas bases.

---

## Achado 3 — a PEC não cabe no jogo como ele está

A resposta confirmou 308 na Câmara e **parou aí**. Faltam duas coisas, e as duas
são exigência do art. 60 §2º:

- **dois turnos** em cada casa;
- **o Senado**: 3/5 de 81 = **49 votos**, também em dois turnos.

O jogo tem só a Câmara. Hoje ele diz "308 e passou", o que **superestima o poder do
presidente** — a PEC real tem quatro votações, e o Senado é onde reforma morre.

**E é mais barato do que parece.** O ECLUSA não sabe que existe "Câmara": ele
recebe uma lista de bancadas com cadeiras e devolve votos. Um Senado é a **mesma
função chamada de novo**, com outra lista de 81 cadeiras. O custo é de interface —
mostrar duas casas — e não de motor.

**Decisão pendente, e é de escopo:** entra neste ciclo ou fica declarado ausente?
Recomendo **declarar ausente por enquanto** e escrever a razão: acrescentar uma
segunda casa antes de as alavancas existirem é construir a parte difícil primeiro,
e o pedido em cima da mesa são os sliders.

---

## Achado 4 — a lei ordinária exige um modelo de presença que não existe

"Maioria dos presentes, com 257 de presença" não é um número diferente: é uma
**mecânica nova**. O jogo não tem noção de quem comparece.

E ela abre uma arma de oposição que hoje não existe: **esvaziar a sessão**. Abaixo
de 257 presentes a votação não abre — a pauta não morre, ela **não acontece**. Isso
é derrota sem ninguém votar contra, e é como obstrução funciona de verdade.

O motor já tem metade disso escrito. `moodFactor` descreve a obstrução em prosa
como _"aparece menos, atrasa, esvazia sessão"_ e depois a aplica só como voto a
menos. Separar **presença** de **voto** é a peça que falta:

```
presentes  = Σ cadeiras × comparecimento(lealdade)
se presentes < 257 → a sessão não abre
maioria    = floor(presentes / 2) + 1
```

Com isso, `quorumOf` deixa de devolver uma constante e passa a devolver uma função
do plenário — e a lei ordinária fica **mais fácil** de aprovar e **mais fácil** de
inviabilizar, ao mesmo tempo. As duas coisas são verdade no Brasil.

---

## O que ainda falta perguntar, em ordem de urgência

1. **Bloco 1, pergunta 4** — cargos como moeda. É a parte que falta do preço do
   voto, e sem ela 96,5% do `seatPrice` segue sem explicação;
2. **Bloco 2, pergunta 7** — a composição da despesa obrigatória, item a item, em
   R$ bi/ano. Sem ela a Parte 2 não tem catálogo;
3. **Bloco 3 inteiro** — os programas por ministério. É o dado que vira slider;
4. **Bloco 2, pergunta 6** — receita e despesa da União 2026, para conferir se
   `initialGdp: 11000` / `initialMandatory: 3270` / `initialDiscretionary: 330`
   descrevem o Brasil ou um país inventado;
5. **Bloco 5, perguntas 26 e 28** — o Senado e a taxa histórica de aprovação. A
   segunda calibra o defeito medido (26 votações, 26 aprovações);
6. **Bloco 4** — tributos, quando a Economia chegar.

**E o pedido de formato vale a pena repetir:** o que voltou veio sem fonte e sem
ano-base. Número sem procedência num catálogo que se declara real é pior do que
número declaradamente fictício — ele parece verificável e não é.
