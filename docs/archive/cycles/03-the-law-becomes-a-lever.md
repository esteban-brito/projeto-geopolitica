# Ciclo 3 — a lei vira alavanca

> Pedido na sexta sessão, 13/08/2026, depois que a Parte 3 do ciclo 2 fechou.
> Este arquivo **substitui a Parte 7 do ciclo 2** (Finanças e Economia), que era
> menor do que o que foi pedido.

## O pedido

1. **Finanças** vira painel: PIB, dívida, despesas, tudo — e **nada para editar**;
2. **Fazenda** vira impostos: alterar os que existem e **criar novos**;
3. **Produção** muda de nome;
4. **Toda área ganha uma aba de legislação**, onde se **cria, altera e exclui**
   leis sobre aquela área.

## A ideia que sustenta os quatro

O item 4 parece o mais difícil e é o mais fácil, porque **o modelo já tem leis
dentro dele** — só não as chama assim.

Toda alavanca tem uma faixa `[piso, teto]` e uma guarda que diz quem pode
atravessá-la. **Isso é uma lei.** O piso da atenção básica em 59 pontos não é um
número de interface: é a vinculação constitucional da saúde existindo como
mecânica. Hoje ela mora no catálogo e é imutável.

> **A aba de legislação é a tela onde as faixas deixam de ser catálogo e passam a
> ser estado.**

E aí os três verbos caem sozinhos:

| verbo na tela       | o que é no modelo                                                       |
| ------------------- | ----------------------------------------------------------------------- |
| **alterar** uma lei | mover o piso ou o teto de uma alavanca                                  |
| **criar** uma lei   | pôr uma faixa onde não havia — um piso novo obriga; um teto novo proíbe |
| **excluir** uma lei | soltar a faixa (piso a 0, teto a 100) e devolver aquilo à caneta        |

Nada disso é um objeto novo. É a mesma primitiva, apontada para si mesma:
**alavancas que movem as faixas de outras alavancas.** E o preço já existe —
mexer numa faixa protegida por `constitution` custa 308 votos, exatamente como
atravessá-la custa hoje.

## O que o jogador cria, e o que ele não cria

Esta é a decisão de desenho que faz "liberdade quase infinita" ser computável:

> **O jogador não inventa substantivos. Ele compõe restrições sobre substantivos
> que existem.**

Criar uma lei é escolher **sobre qual alavanca**, **qual lado da faixa**, e **em
que ponto**. Criar um imposto é escolher **sobre qual base**, **qual alíquota** e
**que nome dar**. O vocabulário é fechado — trinta e sete alavancas e sete bases
tributárias — e as combinações não são.

A alternativa (texto livre, efeito inventado) exigiria alguém interpretando a
intenção do jogador, e esse alguém seria a IA. Fica anotado: **quando a IA
entrar, é aqui que ela entra** — traduzir "quero acabar com o foro privilegiado"
na combinação de faixas que isso significa. O modelo abaixo não depende dela, e é
compatível com ela.

---

## Parte 1 — as faixas saem do catálogo e viram estado

**Tamanho:** médio. **Depende de:** nada.

`state.bands: Record<alavancaId, { floor, ceiling }>`, nascendo do catálogo. O
que o catálogo passa a declarar é a faixa **de abertura** e a **guarda** — quem
protege aquela lei —, e a guarda continua imutável, porque ela é a natureza da
norma e não o conteúdo dela.

`compose` passa a comparar contra a faixa do estado. Uma proposta pode conter
**movimento de nível e movimento de faixa no mesmo texto**, e aí aparece a jogada
que hoje não existe:

> Derrubar o piso da saúde de 59 para 30 **e** baixar o gasto para 35 na mesma
> lei. Sem a mudança de faixa, o segundo movimento seria emenda; com ela, o texto
> é um só e a emenda já contém a autorização.

`schemaVersion` sobe para 8.

## Parte 2 — a aba de legislação, em toda área

**Tamanho:** médio. **Depende de:** Parte 1.

Cada área ganha um segundo bloco listando **as leis que a governam** — uma linha
por faixa, com o que ela obriga, o que ela proíbe, e quem a protege:

```
Atenção básica          piso 59   ▓▓▓░░░░░   teto 100    CONSTITUIÇÃO
Assistência farmacêutica piso 52  ▓▓▓░░░░░   teto 100    LEI
Vigilância e imunização  —        ░░░░░░░░   teto 100    LEI      [criar piso]
```

O controle de faixa é o **mesmo componente** do controle de nível, e isso é
afirmação: mudar quanto se gasta e mudar quanto a lei obriga a gastar são o mesmo
gesto com preços diferentes.

**Excluir** é levar o piso a 0. **Criar** é tirá-lo de 0. Não há botão de
"excluir lei" — há o controle, e o zero.

## Parte 3 — Fazenda vira impostos

**Tamanho:** médio. **Depende de:** Parte 5 (o preço).

Sete bases, e o jogador põe quantos tributos quiser sobre elas:

| base                   | o que ela mede        | posição          |
| ---------------------- | --------------------- | ---------------- |
| consumo                | o que se compra       | direita          |
| renda física           | o que a pessoa ganha  | esquerda         |
| renda jurídica         | o que a empresa lucra | esquerda         |
| patrimônio             | o que se possui       | esquerda extrema |
| folha                  | quem emprega          | direita          |
| transações financeiras | o que circula         | centro           |
| comércio exterior      | o que entra e sai     | protecionista    |

Cada base tem um **tamanho declarado** (fração do PIB) e uma **elasticidade** —
quanto ela encolhe quando é taxada. A receita de um tributo é
`base × alíquota × (1 − elasticidade × alíquota)`, que é uma curva de Laffer
mínima: **taxar demais arrecada menos**, e o jogador descobre isso na conta e não
num aviso.

**Criar um imposto** é escolher base, alíquota e nome. **Editar** é mover a
alíquota. Os tributos que existem hoje nascem no catálogo com as alíquotas reais.

A **reforma tributária** deixa de ser uma pauta: é substituir tributos sobre
consumo por um só, o que no modelo é zerar três alíquotas e criar uma.

## Parte 4 — Finanças vira painel

**Tamanho:** pequeno-médio. **Depende de:** Parte 5 para metade dos números.

Só leitura. E é a única tela do jogo que pode ser densa, porque ninguém decide
nada nela.

**O que já tem motor hoje:** PIB, PIB per capita, receita, despesa obrigatória,
discricionário, resultado primário do mês, dívida bruta, dívida/PIB, o teto do
arcabouço e a distância até ele, e as sete áreas com índice e tendência.

**O que só existe com a CORRENTE:** inflação, juro, desemprego, custo de
carregamento da dívida.

Série de 48 meses em tudo. **Nada aqui é editável, e isso é a informação
principal da tela**: é o placar, não o console.

## Parte 5 — a CORRENTE mínima, porque imposto sem preço é dinheiro grátis

**Tamanho:** médio-grande. **Depende de:** nada.

Sem ela, subir alíquota é receita de graça e existe uma jogada dominante: taxar
tudo no máximo, pagar o preço político uma vez, e governar com dinheiro infinito
para sempre.

A versão mínima honesta:

- **PIB** responde à carga tributária (a elasticidade da Parte 3), à capacidade da
  Indústria (já existe via MALHA), à propriedade estatal (já existe via regras) e
  ao juro real;
- **inflação** por Phillips com hiato;
- **juro** por Taylor — e é aqui que a autonomia do Banco Central passa a ter
  efeito, fechando uma alavanca que a Parte 3 do ciclo 2 deixou declarada;
- **desemprego** por Okun;
- **juros incidem sobre a dívida** — e a âncora que a pesquisa deu é boa:
  **cada 1 p.p. de Selic custa ~R$ 40 bi/ano**.

Entra **população com crescimento**, sem a qual não existe PIB per capita.

## Parte 6 — o rename

**Tamanho:** trivial.

`treasury` continua **Fazenda** (é o ministério dos tributos, e o nome está
certo). Nasce **Finanças** como área de leitura. **Produção** vira outro nome — e
essa escolha muda o que cabe lá dentro, porque hoje a área carrega infraestrutura,
crédito agrícola, BNDES, desoneração e ciência.

---

## As quatro decisões — RESPONDIDAS em 13/08/2026

**1. A Fazenda tem dois blocos.** Os impostos, e a máquina que os cobra
(fiscalização, dívida ativa, tecnologia, auditoria). O índice de arrecadação
sobrevive, e com ele a jogada de arrecadar mais sem subir alíquota nenhuma.

**2. Produção vira DUAS áreas**, e o corte não é técnico — é político:

- **Agricultura** — Plano Safra, seguro rural, assistência técnica, defesa
  agropecuária, estoques reguladores. Ela existe separada porque **a bancada
  ruralista é um bloco real no Congresso**, e um modelo que trata agro e indústria
  como a mesma coisa não consegue representar isso;
- **Indústria e Infraestrutura** — BNDES, desoneração setorial, ciência e
  tecnologia, transportes, energia. É o aparelho produtivo e o gargalo dele.

As duas nascem com cinco a seis programas cada, e não com os cinco de hoje
redistribuídos: o pedido foi "bem completo e realista".

**3. A CORRENTE vem primeiro.** Finanças nasce completa e os impostos nascem com
preço. É a parte mais cara e ela destrava as outras três.

**4. Nasce a área de Gestão** — folha civil, cargos comissionados, máquina
administrativa. É onde a reforma administrativa mora, e é onde os ~28 mil cargos
de livre nomeação vão morar quando virarem moeda de negociação com o Congresso.

### O rail depois disto

Mesa · **Finanças** · **Fazenda** · **Gestão** · Previdência · Saúde · Educação ·
Segurança · Defesa · **Agricultura** · **Indústria e Infraestrutura** — onze
seções, contra as oito de hoje.

---

## O texto original das decisões, para referência

**1. Onde fica a máquina de arrecadar.** Você disse que os sliders da Fazenda são
"só impostos". Mas hoje a Fazenda tem fiscalização, dívida ativa, tecnologia da
arrecadação e controle — os programas que fazem o imposto entrar, e são eles que
movem o índice de arrecadação da área. Ou eles ficam num segundo bloco da Fazenda,
ou a área perde o índice.

**2. O nome de Produção**, e o que ele implica. "Indústria" é mais estreito do que
o conteúdo: crédito ao produtor é agro, não indústria. "Desenvolvimento" ou
"Infraestrutura" cobrem melhor. Se for "Indústria" mesmo, o crédito agrícola
precisa sair para outro lugar.

**3. Finanças agora ou depois da CORRENTE.** Agora, ela mostra dez números reais
e declara juro, inflação e desemprego como ausentes. Depois, ela nasce completa —
mas a Fazenda também espera, porque imposto sem preço macroeconômico é dinheiro
grátis.

**4. Onde fica `pessoal-do-executivo`.** São R$ 171 bi de folha civil morando na
Fazenda por conveniência. Com a Fazenda virando impostos, ele fica sem endereço.

## A ordem que eu recomendo

| ordem | parte                           | por quê                                    | estado |
| ----- | ------------------------------- | ------------------------------------------ | ------ |
| 1     | Parte 5 — CORRENTE mínima       | sem ela a Fazenda é dinheiro grátis        | ✔      |
| 2     | Parte 4 — Finanças              | nasce completa                             | ✔      |
| 3     | Parte 1 — faixas viram estado   | destrava tudo, e não depende de nada       | —      |
| 4     | Parte 2 — aba de legislação     | é o pedido maior, e o preço dela já existe | —      |
| 5     | Parte 3 — Fazenda vira impostos |                                            | —      |
| 6     | Parte 6 — rename                | junto da 3                                 | —      |

**A ordem executada trocou de dono na sétima sessão**, e o motivo é a decisão 3
acima: a CORRENTE veio primeiro porque ela era a parte cara, e Finanças veio logo
atrás porque ela é o lugar onde a CORRENTE aparece — um motor macro sem tela é um
motor que ninguém consegue conferir. A legislação continua sendo o pedido maior e
segue sendo a próxima.

### O que a Parte 5 e a Parte 4 deixaram prontas

- **CORRENTE** em `src/domain/economy/` com Phillips, Taylor, Okun e o hiato
  medido em termos reais; `carry` cobra o juro sobre o estoque, e a série de 48
  meses vive em `state.series`. `schemaVersion` foi para 8;
- **Finanças** em `src/ui/screens/finance.mjs`: dezenove linhas em quatro blocos,
  nenhum controle, e todo número vindo de `ledger` — a função da camada de
  aplicação que faz a mesma conta do turno. `tests/suites/turn.mjs` prova que o
  painel e o mês fecham no mesmo estoque de dívida;
- a **escada** aprendeu régua declarada por indicador. Contra a régua do índice de
  área, inflação e juro ficavam no degrau do chão para sempre.

A legislação vem antes dos impostos de propósito: ela é a mecânica mais nova e a
mais barata, e é ela que faz o resto do jogo mudar de tamanho. Impostos sem
CORRENTE seriam um botão quebrado, e um botão quebrado ensina o modelo errado
mais rápido do que qualquer tela ensina o certo.
