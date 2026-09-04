# CICLO 19 — A VOZ

> **Estado:** ▶ plano, escrito em 03/09/2026. Pedido dele: _"eu quero uma IA mais aprimorada e
> abrangente no meu jogo sim"_.
>
> Ele executa os [ADR 0001](../adr/0001-a-ia-fica-fora-do-turno.md) e
> [0002](../adr/0002-a-ia-gera-vocabulario-nao-efeito.md), que decidiram onde a IA pode entrar e
> nunca foram construídos. Roda em paralelo ao [ciclo 18](18-a-caneta.md), que é o do cargo.

---

## 1 · Onde o jogo está hoje: zero

📐 **Medido:** `package.json` tem `"dependencies": {}`. Não existe biblioteca de IA, chave de
API, nem uma linha chamando modelo nenhum. O jogo roda inteiro sozinho.

Os dois ADRs abriram **três lugares** para ela, e os três estão vazios:

| lugar                        | o que é                                                    | construído |
| ---------------------------- | ---------------------------------------------------------- | ---------- |
| gerar catálogo antes do jogo | a IA propõe ações; o validador e a revisão filtram         | ⛔ não     |
| veredito de fim de mandato   | ela lê os 48 meses já calculados e escreve o que aconteceu | ⛔ não     |
| narração                     | manchete, discurso, reação da rua, sobre estado já fechado | ⛔ não     |

⭐ **Então "mais abrangente" é fácil de entregar: hoje é zero.** Encher os três lugares já é uma
mudança grande, e nenhum deles quebra nada.

---

## 2 · O que trava, e o que não trava

**O que trava é o NÚMERO.** Se a IA decidir quanto uma política custa, a mesma partida com a
mesma semente passa a dar resultados diferentes. Aí:

- 📐 o `simulate` de 48 meses **deixa de valer como prova** — e ele é o que pega erro de
  calibragem hoje;
- 📐 as **314 provas** que comparam duas rodadas passam a falhar sozinhas;
- o save deixa de reconstruir a partida, porque a semente não basta mais.

**O que NÃO trava é a PALAVRA.** E é aí que está quase tudo o que falta no jogo: o jornal que não
existe, o ministro que fala por template, o fecho que mostra números e não conta história.

---

## 3 · ⭐ A regra que faz os dois caberem: o cache pela semente

**O problema parece "IA ou determinismo". Não é.** A saída da IA vira dado guardado, e o dado
guardado é determinístico.

```
o motor fecha o mês  →  produz a FICHA (só números e ids)
   →  a IA lê a ficha e escreve o TEXTO
      →  o texto é guardado com a chave = hash(ficha)
         →  mesma ficha, mesmo texto, sem chamar de novo
```

**As quatro consequências, e elas são a garantia inteira:**

1. **a mesma partida dá o mesmo texto**, porque a ficha é a mesma;
2. **`simulate` e o passeio nunca chamam IA** — eles leem número, e número não passa por ela;
3. **IA desligada ou com erro, o jogo mostra o texto de hoje.** A camada é adicional, nunca
   substituta. Se ela cair, nada quebra;
4. **o texto é auditável**: a ficha que o gerou fica junto, então dá para ver de onde a frase
   saiu.

⛔ **E a regra que não se quebra:** a ficha entra na IA e **só texto sai**. Nada que a IA
devolve vira número, índice, preço ou voto.

---

## 4 · ⭐⭐ E existe um meio-termo: a IA ESCOLHE, o motor PRECIFICA

Isto vai além de narrar, e ainda assim não quebra nada. **A IA nunca inventa a opção — ela
escolhe entre opções que o motor já validou.**

Exemplo concreto, com o que já existe no jogo:

| passo                                                            | quem faz |
| ---------------------------------------------------------------- | -------- |
| calcular a pressão de cada grupo e ver quem passou do ponto      | o motor  |
| listar as chantagens **possíveis** para aquele grupo, com preço  | o motor  |
| **escolher qual delas o lobby faz este mês, e com que palavras** | a IA     |
| cobrar o preço da escolhida                                      | o motor  |

📐 **O jogo já tem a peça:** `demandsOf` monta a chantagem hoje escolhendo por regra fixa. Trocar
a regra fixa por uma escolha da IA **entre as mesmas opções** dá variedade sem mexer em preço.

⚠ **E o determinismo sobrevive pelo mesmo cache da seção 3:** a escolha é guardada com a chave da
ficha. Rodar de novo com a mesma semente devolve a mesma escolha, do cache.

⛔ **O limite é este:** a IA escolhe **entre opções que o motor gerou e precificou**. Ela nunca
cria uma opção nova em partida, nunca muda um preço, e nunca decide se a política funcionou.

---

## 5 · OS QUATRO LUGARES, em ordem de valor

| #      | o quê                            | o que ele resolve                            | custo   |
| ------ | -------------------------------- | -------------------------------------------- | ------- |
| **V1** | ⭐⭐ o **jornal**                | a metade vazia do Email                      | médio   |
| **V2** | ⭐ a **voz das pessoas**         | 8 arquétipos que falam por template          | médio   |
| **V3** | o **veredito de fim de mandato** | o fecho mostra número e não conta história   | pequeno |
| **V4** | o **gerador de catálogo**        | ferramenta de desenvolvimento, não é do jogo | médio   |

### V1 · O jornal — e ele tem uma medição que manda no desenho

📐 **Medido em `tmp/manchetes.mjs`, 48 meses:** um governo passivo produz **20 fatos noticiáveis
em 16 dos 48 meses**; um governo que legisla todo mês produz **56, em 32 de 48**.

⛔ **Mesmo o governo ativo passa 16 meses sem uma linha.** Uma coluna de jornal vazia em um terço
do mandato lê como tela quebrada.

⭐ **Então o jornal não pode noticiar só o extraordinário — ele tem de noticiar o ordinário:** o
PIB saiu, a inflação veio, a Saúde caiu 2 pontos, o Congresso não votou nada. **Isso é ficha
cheia todo mês**, e a IA só precisa escrever.

⚠ **E os veículos seguem o ADR 0003**: imprensa inspirada na real, com **nome alterado** — a
mesma regra dos partidos.

### V2 · A voz das pessoas

📐 O elenco já existe e é fundo: 8 arquétipos, 42 primeiros nomes × 31 sobrenomes, pasta,
alcance de bancada, ambição, e memória com `favor 14 · traição 30 · esquece 4% ao mês`.

**Hoje toda carta é um template com o nome trocado.** Um líder do centrão pede igual a um líder
de esquerda. Com a IA, a ficha manda o que ele quer e quanto custa, e ela escreve **como ele
fala**.

### V3 · O veredito de fim de mandato

O fecho hoje mostra prometido × entregue em número. A IA lê a série inteira e escreve o que
aconteceu — uma vez por partida, sem pressa, e sem tocar em nenhum valor.

### V4 · O gerador de catálogo — e ele não é do jogo

📐 O gargalo do projeto é o catálogo: 8 áreas, os programas, as leis, as pessoas. **A IA propõe
entradas novas, o validador de esquema recusa o que não fecha, eu reviso, e vira arquivo
commitado.** O jogador nunca fala com IA nenhuma, e o jogo publicado não muda.

⭐ **É o de menor risco dos quatro e o de maior efeito no conteúdo.**

---

## 6 · ⛔ O PROBLEMA QUE NÃO TEM RESPOSTA BONITA: onde mora a chave

⚠ **Este é o único ponto do plano que muda o que o projeto É.** A primeira linha do `CLAUDE.md`
diz: _"Site estático: zero build, zero dependência de runtime"_. Chamar um modelo é a primeira
coisa do projeto que precisa de rede em partida.

| caminho                                                  | custo                                                                               |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **o jogador põe a própria chave**, guardada no navegador | o site continua estático. Mas expõe a chave no cliente e só serve para quem tem uma |
| **um servidor pequeno no meio**                          | resolve a chave, e **acaba com o "zero dependência de runtime"**                    |
| **gerar tudo antes e enviar como dado**                  | o site continua estático, mas só cobre o que **não** depende da partida             |

⭐ **E o terceiro cobre mais do que parece.** O jornal precisa da partida, mas os **moldes** de
frase não: dá para gerar antes centenas de formas de dizer _"a inflação subiu"_, guardar como
dado, e a partida escolher pela ficha. **Isso é IA no jogo sem rede nenhuma em partida** — e é o
caminho que eu tomaria primeiro.

---

## 7 · ⛔ O QUE ESTE CICLO RECUSA

| pedido                                     | por quê                                                                                             |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| **a IA decidir se uma política funcionou** | mata o `simulate` e as 314 provas. É o ADR 0001, e ele continua certo                               |
| **a IA calcular preço, índice ou voto**    | ADR 0002. Número tem motor atrás, sempre                                                            |
| **conversa livre com um personagem**       | ⚠ não é recusa, é ordem: só depois de V2. Sem a voz definida, a conversa vira genérica              |
| **a IA escrever regra de jogo em partida** | o catálogo é revisado à mão antes de virar arquivo. Regra que ninguém leu é regra que ninguém cobra |

---

## 8 · POR ONDE COMEÇAR

1. **V4 primeiro, porque não toca no jogo.** O gerador de catálogo é ferramenta: roda aqui,
   produz arquivo, e o site publicado continua igual. Ele já rende conteúdo novo sem decidir
   nada sobre arquitetura;
2. **depois V1, pelo caminho do dado gerado antes** — moldes de frase gerados e commitados, a
   partida escolhendo pela ficha do mês. O jornal enche a metade vazia do Email **sem rede em
   partida**;
3. **V3 e V2 depois**, quando a decisão da chave (seção 6) estiver tomada.

⚖ **E a restrição vale para os quatro:** `npm run validate` verde, e **o `simulate` de 48 meses
tem de dar exatamente a mesma série antes e depois**. Se mudar um número, a IA vazou para dentro
do motor.
