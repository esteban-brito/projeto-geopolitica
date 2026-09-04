# CICLO 22 — A LEI QUE VOCÊ ESCREVE

> **Escrito em 04/09/2026.** Ele executa a
> [pesquisa 07](../research/07-a-lei-que-o-jogador-escreve.md), que passou **33 propostas de um
> plano de governo real** pela gramática do motor.
>
> Pedido dele, em duas frases:
>
> - _"se ela Lei por exemplo funcionasse plenamente dentro do meu jogo, acredito que muitas
>   outras leis funcionariam também"_;
> - _"quero um simulador de presidente do brasil mais realista e fiel que exista no mundo"_.
>
> ⚠ **Ele depende do [ciclo 19](19-a-voz.md), e a dependência é dura:** uma lei que o jogador
> inventa **não tem preço** enquanto o preço vier de `threat` escrito à mão no catálogo.

---

## 1 · ⭐ A TESE: uma lei não é um texto, é uma frase com encaixes

📐 **E o jogo já tem dez dos onze encaixes.** Medido em `src/domain/norms/index.mjs`:

| encaixe          | campo               | existe?     |
| ---------------- | ------------------- | ----------- |
| **o verbo**      | `kind`              | ⚠ **um só** |
| quem             | `target.scope`      | ✔           |
| o salvo          | `target.except`     | ✔           |
| o quanto         | `floor` · `ceiling` | ✔           |
| o vinculado      | `share`             | ✔           |
| o enquanto       | `trigger`           | ✔           |
| a partir de      | `from`              | ✔           |
| por quanto tempo | `months`            | ✔           |
| no lugar de      | `repeals`           | ✔           |
| a que preço      | `guard`             | ✔           |
| por que dorme    | `Sleep`             | ✔           |

```
@property {"band"} kind - o unico tipo de clausula que existe hoje
```

⛔ **Toda lei deste jogo diz a mesma frase:** _"o programa X gasta no mínimo A e no máximo B"_.
E ⚠ **o canal é ainda mais estreito que a gramática**: o jogador só manda `bands` — gatilho,
exceção, vacatio, vigência e revogação **são executados e ninguém os escreve** (achado 11).

⭐ **Então este ciclo não constrói uma gramática. Ele constrói VERBOS e abre o CANAL.**

---

## 2 · ⛔ O PROBLEMA QUE VEM ANTES DE TODOS: de onde saem as coordenadas

**Uma lei que o jogador inventa precisa de posição no mapa ideológico, e ele não pode digitá-la.**

📐 Hoje `economic`, `liberty` e `threat` vêm do catálogo, programa por programa, e `agenda.mjs`
tira a média ponderada pelo quanto cada um se moveu. Funciona porque **o catálogo é revisado à
mão**.

⛔ **Se o jogador escolher a própria ameaça, ele escolhe o próprio preço** — e "tudo tem preço"
vira "nada tem preço".

⭐ **A REGRA DESTE CICLO, e ela vale para os seis verbos:**

> **A coordenada de uma lei sai do que ela FAZ, nunca do que o jogador diz que ela é.**
> O nome é livre porque o nome não faz nada. A posição é derivada dos encaixes.

**Como cada encaixe empurra a coordenada:**

| o que a lei faz                         | para onde empurra                                   |
| --------------------------------------- | --------------------------------------------------- |
| põe dinheiro em transferência de renda  | economia à esquerda                                 |
| tira dinheiro de transferência de renda | economia à direita                                  |
| baixa o rito de alguma coisa            | liberdade para baixo — é concentração de poder      |
| alcança `all` em vez de uma alavanca    | ⭐ **dispersão sobe** — o texto fica mais caro      |
| revoga norma com `guard: constitution`  | ameaça sobe                                         |
| tem gatilho por indicador               | ameaça sobe: ela volta sozinha, e ninguém a reabriu |
| tem vigência curta                      | ameaça desce — ela caduca sozinha                   |

⚖ **E o teste de aceitação é aritmético:** escrever à mão, pelos encaixes, uma lei igual a uma
que já está no catálogo **tem de dar as mesmas coordenadas**. Se der diferente, a derivação está
errada e não entra.

---

## 3 · OS SEIS VERBOS, e a ordem é por quanto cada um compra

📐 Das 33 propostas apuradas na pesquisa 07:

| #     | verbo       | o que ele faz                    | abre  | motor      | depende  |
| ----- | ----------- | -------------------------------- | ----- | ---------- | -------- |
| **1** | `spend`     | criar e extinguir programa       | **7** | não        | ciclo 19 |
| **2** | `tax`       | mexer em alíquota                | **3** | liga canal | —        |
| **3** | `condition` | condicionar dinheiro a resultado | **4** | abre motor | 1, entes |
| **4** | `body`      | criar órgão com mandato próprio  | **4** | abre motor | 3        |
| **5** | `power`     | concentrar ou devolver poder     | **5** | médio      | —        |
| **6** | `status`    | mudar o estatuto de um ente      | **5** | grande     | entes    |

✔ **E o verbo que já roda, `band`, entrega 6 sozinho** — desvincular os pisos, desindexar a
previdência, mexer no teto do arcabouço, infraestrutura de 2% para 4% do PIB, cortar benefício
tributário e acabar com supersalário. **Seis propostas de um plano de governo real rodam no jogo
de hoje, sem uma linha nova.**

---

## 4 · ⭐ VERBO 1 — `spend`: criar um programa

📐 O jogo tem **38 programas**, cada um com piso, teto, guarda jurídica, área, custo por ponto de
índice e coordenada ideológica. **A máquina inteira existe. Falta a ordem que cria o 39º.**

**O que o jogador escolhe:**

```
NOME       (livre — não faz nada)
ÁREA       uma das oito
QUANTO     bilhões por ano
DE ONDE    ⭐ e esta é a pergunta que faz a jogada doer
RITO       derivado: programa novo com vinculação é lei; sem, é orçamento
```

⭐ **"De onde" é o coração do verbo.** Criar um programa sem dizer de onde sai o dinheiro é
criar déficit, e o LASTRO já cobra isso. Dizer de onde **é revogar ou encolher outro** — e aí a
lei nova carrega o inimigo do programa que ela corta.

⭐ **E `repeals` já existe**, o que torna o par _"acaba com um, cria outro"_ uma jogada de um
gesto só. É exatamente a forma das **Frentes Cidadãs** (que substituem a transferência de renda)
e das **bolsas de mérito** (que substituem as cotas).

**As sete propostas que este verbo abre:** Frentes Cidadãs · desfavelização · superpresídios ·
escolas cívico-militares · SUS digital · AgroBrasil · bolsas de mérito.

⚠ **E o programa novo vai para o SAVE**, porque ele é fato do mandato. É o primeiro bump de
esquema deste ciclo, e ele é inevitável.

---

## 5 · VERBO 2 — `tax`: o decreto que vale hoje

📐 `taxDelta` é lido pela CORRENTE com `taxDrag: 0,35` e **ninguém o escreve**. Canal morto desde
o ciclo 13, e item 3 do [ciclo 18](18-a-caneta.md).

📗 **A norma dá o desenho de graça:** IOF, IPI, imposto de importação e de exportação são exceção
à anterioridade (CF art. 153, §1º) — o presidente muda a alíquota **por decreto, e vale já**.
Imposto de renda, não: a Lei 15.270/2025 nasceu de projeto do Executivo e foi votada.

⭐ **É a caneta mais direta do jogo:** efeito no mês, sem pedir licença, e com preço imediato no
setor privado — que é um grupo de pressão que já existe.

**As três propostas:** desonerar a folha · redução tributária para data centers · regime especial
para terras raras.

---

## 6 · ⭐⭐ VERBO 3 — `condition`: a lei que continua valendo depois que você sai

**É a Lei de Responsabilidade Gerencial, e é o item que muda a natureza do jogo.**

📰 A LRF cobrou **a conta** dos prefeitos; a LRG cobraria **o resultado**: indicadores por
município (IDEB, cobertura vacinal, água tratada, integridade), tutela gerencial com dupla
assinatura para quem fica abaixo, perda de mandato e inelegibilidade de 8 anos para o
reincidente, **mais emenda para quem entrega**, e fundo partidário olhando a qualidade dos
prefeitos do partido.

⭐ **A metade difícil já está pronta:** `trigger` é literalmente _"enquanto o indicador estiver
abaixo de N"_, roda com prova, e o motor sabe dizer que uma norma dorme **porque o gatilho está
desligado**.

⛔ **Faltam duas coisas, e só duas:**

1. **o gatilho hoje liga uma FAIXA; ele precisa ligar uma CONSEQUÊNCIA** — cortar repasse, dar
   emenda, tirar mandato;
2. **um alvo que não é alavanca.**

### 6.1 · ⭐ E o alvo NÃO é um mapa — é uma distribuição

⚠ **A decisão mais importante deste ciclo, e ela economiza o item mais caro do projeto.**

O primeiro instinto é modelar 5.570 municípios. **Isso é um segundo jogo, e a LRG não precisa
dele.** O que a lei faz, do ponto de vista da União, é:

> **quantos municípios estão abaixo do mínimo, e o que isso custa.**

Isso é uma **distribuição por indicador**, não um cadastro. O jogo passa a carregar, por área,
_"a fração dos entes abaixo do corte"_ — e a MALHA, que já produz um índice por área, **já é o
gerador natural dessa fração**.

⭐ **O ganho de jogo é imediato e honesto:** você baixa o corte, mais municípios entram em tutela,
o custo político sobe e a economia fiscal sobe junto. **Você escolhe o número, e o número tem
duas caras.**

⚠ **E isso não fecha a porta do mapa.** Se um dia os 27 estados entrarem (A10, ciclo 17), a
distribuição vira a soma deles. **A ordem é: distribuição primeiro, mapa depois — nunca o
contrário.**

**As quatro propostas:** LRG · reeleição condicionada · fundo partidário por desempenho ·
cláusula antimáfia.

---

## 7 · VERBO 4 — `body`: o órgão que você cria e não consegue demitir

📰 **Comissariado Federal de Gestão Pública** — autarquia nova, vinculada à Fazenda, com
autonomia técnica e **mandato fixo**.

⭐ **O mandato fixo é o desenho de jogo inteiro numa palavra.** Você cria o órgão, nomeia quem o
dirige, e **não pode demiti-lo depois**. Um contrapoder que nasce de uma jogada sua, e que
continua lá quando você mudar de ideia.

📐 **Hoje nada no repositório desfaz uma jogada do jogador exceto o Congresso votando contra
ela** — e este é o contrapoder mais barato de construir, porque o jogador o constrói de graça,
por vontade própria, achando que está se fortalecendo.

**As quatro propostas:** Comissariado · tutela gerencial · tribunal especializado · tribunal do
foro.

---

## 8 · VERBO 5 — `power`: e ele já tem meia perna

📐 `POWER_STEPS` roda: **a 60 a emenda vira lei, a 85 a lei vira caneta.** Uma alavanca contínua
que barateia o rito de tudo, com guarda de PEC.

**Faltam os degraus escritos**, e as cinco propostas que caem neles: Estado de Defesa sucessivo ·
Direito Penal do Inimigo · Lei Antifacção · expulsão de ONGs · **Código de Imprensa**.

⭐ **O Código de Imprensa é a jogada mais perigosa e mais interessante da lista inteira**, e ela
só existe depois do jornal (ciclo 19, item 4): **uma lei que muda como o jogo te avalia.**

---

## 9 · VERBO 6 — `status`: o mais caro, e o último

Mudar o estatuto de um ente: consolidação municipal de 5.570 para 1.656 · autonomia de distrito
para o Rio · restringir o STF a Corte Constitucional · extinguir a Justiça do Trabalho · Zonas
Econômicas Especiais.

⚠ **Nenhuma entra sem entes de verdade**, e por isso ele é o último. **Cinco propostas atrás do
item mais caro do projeto.**

---

## 10 · ⚖ O TESTE DE ACEITAÇÃO DO CICLO INTEIRO

> **O jogador consegue escrever a Lei de Responsabilidade Gerencial, escolhendo encaixes numa
> tela, e o Congresso a precifica sem ninguém ter escrito uma linha sobre ela.**

E os três subtestes, que são mecânicos:

1. **a derivação bate:** montar pelos encaixes uma lei igual a uma do catálogo dá as **mesmas
   coordenadas**;
2. **o preço não se compra:** o jogador não tem campo nenhum que baixe a própria `threat`;
3. **a lei sobrevive ao mandato:** uma norma com gatilho continua ligando e desligando depois do
   mês em que passou, e o fecho a conta como herança.

---

## 11 · ⛔ O QUE ESTE CICLO RECUSA

| pedido                                  | por quê                                                                       |
| --------------------------------------- | ----------------------------------------------------------------------------- |
| **texto livre com efeito**              | o nome é livre porque não faz nada. O efeito sai dos encaixes                 |
| **o jogador escolher a própria ameaça** | é o muro ao contrário: escolher o preço é não ter preço                       |
| **5.570 municípios**                    | ⚠ não é recusa, é ordem: distribuição primeiro, mapa depois                   |
| **reserva de Bitcoin**                  | pede ativo no balanço, e nenhum dos sete verbos a alcança. Ausência declarada |
| **nomes reais**                         | ADR 0003. As 33 entram como **forma jurídica**, nunca como pessoa             |

---

## 12 · ⚖ A RESTRIÇÃO

1. `npm run validate` verde, e **a captura aberta**;
2. **todo verbo mexe em motor** — `simulate` roda e a série se reescreve no mesmo commit;
3. ⚠ **`spend` e `condition` custam bump de esquema.** Programa criado e norma com consequência
   são fatos do mandato, e vão para o save. **Meça antes de bumpar** — cada subida custa a
   partida em andamento;
4. ⛔ **e nenhum verbo inventa número.** Toda coordenada é derivada do que a lei faz, e a
   derivação tem prova.
