# Mecânicas de referência — Paradox, Football Manager, Geo-Political Simulator

> ⚠ **NADA AQUI FOI IMPLEMENTADO, e nada aqui foi acordado.** É a leitura de um
> dossiê externo de 16/08/2026 contra o código que existe — o que já roda, o que roda
> ao contrário do que ele supõe, e o que vale a pena guardar.
>
> Este arquivo não é um ciclo. Ele existe para que uma ideia boa não se perca e para
> que uma ideia já implementada não seja implementada de novo.

## A tese do dossiê, e ela está certa

> _"Eles não têm scripts fechados, eles têm motores que colidem."_

É a mesma frase que o projeto escreve desde o ciclo 2 — o rito é consequência, o
logrolling existe sem ninguém escrever "logrolling", a armadilha da privatização é
aritmética do LASTRO e não um evento redigido. **Concordar com a tese não valida as
quatro propostas**, e é a distinção que este documento faz.

## ⚠ O que ele supõe do motor, e o que o motor faz — quarta vez seguida

| o dossiê supõe                                                      | o código diz                                                                                                                                                             |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| _"a ECLUSA resolve a votação em um único turno"_                    | **falso desde 15/08**: gaveta → relatoria → plenário, um estágio por mês                                                                                                 |
| _"gere um jabuti — uma emenda parasita do relator"_                 | **já existe**: `reports` em `passage.mjs` escreve a exceção, e a carta diz **qual alavanca ele salvou**                                                                  |
| _"o motor TEMPORAL joga os dados a cada mês"_                       | **TEMPORAL não roda.** `src/domain/events/` não é importado por ninguém — nem por `turn.mjs`, nem pela fachada. Vale o mesmo para **CASCATA** e **DELTA**                |
| _"e se o preço do ELENCO não fosse visível?"_                       | o preço **já é derivado e não declarado**: `venalityEconomic` e `venalityLiberty` por bloco, mais `venalityShift` por pessoa. A mecânica que ele pede para criar já roda |
| _"um segmento específico: caminhoneiros, professores, agronegócio"_ | a SONDA segmenta por **renda** — baixa 42%, média 38%, alta 20%. Não existe segmento por profissão                                                                       |

> **Duas das quatro ideias se apoiam num motor que é só contrato.** Não é detalhe de
> implementação: é a diferença entre "ligue o que está pronto" e "escreva um motor".

## O que vale, em ordem

### 1. ⭐ A emenda vira PERGUNTA — e é exatamente o verbo que falta

**A melhor coisa do dossiê, e ele não sabe por quê.** Ele acha que está propondo o
jabuti; o jabuti já existe. O que ele propõe de novo é uma frase:

> _"Aceitar a emenda ou travar a lei?"_

Hoje o relator emenda e **o jogador assiste**. `reports` decide sozinho, a carta
informa, e o texto segue. O handoff já pede um verbo para a tramitação — _"retirar de
pauta"_ —, e este é o verbo **chegando com uma razão para existir**: em vez de um
botão genérico de desistir, uma decisão concreta, num mês concreto, sobre um texto que
o jogador escreveu.

E ele encaixa no que já está na fila: é o **primeiro consumidor natural de
`state.mail` com prazo**. Uma carta que pergunta é a única que justifica um prazo, e
um prazo é a única coisa que faz vencer significar alguma coisa.

⚠ **A pergunta que o projeto tem de responder antes de escrever isto: quanto custa
cada lado?** Aceitar a emenda custa no LASTRO — o jabuti é despesa. Travar custa
tempo **e** custa com o relator, que teve o trabalho recusado. **Se um dos dois lados
sair de graça, a escolha é falsa**, e uma escolha falsa é pior que nenhuma: ela ensina
o jogador a clicar sem ler.

### 2. A promessa condicional — e metade dela já roda, mas é a metade errada

Hoje a promessa do Planalto é **verba**: `offered`, o rateio, o calote, a memória que
cobra depois. Ela é **implícita** — o jogador nunca promete nada, ele apenas deixa de
pagar. O que o dossiê acrescenta é uma promessa que é **ato com data**: _"libere R$ X
na saúde em até dois meses"_.

Por que vale:

- é a única ideia da lista que faz a Caixa de Entrada devolver ao jogador **as
  decisões dele mesmo**, e não só as do mundo. Uma bandeja onde só chega notícia é uma
  bandeja de notícias;
- ela **aterrissa na régua legal**: o pagamento acontece no mesmo controle que já
  mostra onde a lei para. A peça de interface desta sessão ganharia uma segunda razão
  de existir sem uma linha de CSS nova.

⚠ **E ela só funciona se for verificável pelo motor.** A promessa tem de ser dita em
termos que o estado saiba conferir — uma alavanca, um nível, um mês. Promessa em prosa
livre é promessa que ninguém pode cobrar, e uma dívida que o motor não sabe ler vira
sabor.

### 3. O dossiê e a névoa — a intuição certa, na direção errada

**Esconder o elenco agora desfaria um ciclo inteiro**, cuja tese é literal: _"motor
que o jogador não vê não é profundidade — é custo"_. Sete pessoas decidiam o preço de
toda votação e nenhuma aparecia; foi isso que o ciclo 5 consertou.

⚠ **E a versão concreta que ele propõe quebra a doutrina:** _"se o atributo oculto
for Ideológico, o dinheiro é recusado"_ é `if (proibido) return` — um muro. A regra do
projeto é **"tudo tem preço, nada tem muro"**: nada se recusa, a taxa de câmbio é que
fica péssima. **E é literalmente o que a venalidade por eixo já calcula.**

O que **de fato** falta não é névoa: é a tela não dizer **a que cada pessoa responde**.
O motor sabe que o líder da esquerda é menos venal que o próprio bloco
(`venalityShift: -0,06`, com a razão escrita ao lado no catálogo) e o jogador não tem
como saber. **Isso é legibilidade, não espionagem** — e é barato.

Se um dia a névoa entrar, ela deve cobrir a **memória** e não o caráter: quanto o
sujeito ainda cobra de você é informação que se descobre negociando; quem ele é, não.

### 4. A greve — o buraco é real, o desenho ainda não serve

**A queixa de fundo procede, e é um buraco de verdade:** a rua **precifica voto e mais
nada**. Aprovação desloca a resistência da ECLUSA e nunca toca no país físico. Um
governo detestado governa um país que funciona igual.

Mas o desenho proposto não pluga:

- ele quer segmento por **profissão** e a SONDA tem segmento por **renda**. Somar um
  segundo eixo de segmentação é motor, não conserto;
- ele entrega o efeito por **CASCATA** e **TEMPORAL**, que **não rodam**;
- _"os medidores vermelhos estouram"_ é o inverso da regra do projeto: vermelho é
  crise, e uma greve legítima não é um defeito do país.

**Isto é um ciclo, e um ciclo grande.** Fica registrado como buraco (achado 20) e não
se começa por conta própria.

## ⚠ O defeito de forma do dossiê inteiro, e ele importa mais que os quatro itens

**As quatro ideias ACRESCENTAM; nenhuma remove, e nenhuma termina o que está pela
metade.** Quatro mecânicas novas empilhadas sobre uma tramitação em que o jogador
**ainda não pode agir** deixariam o jogo mais fundo no arquivo e menos jogável na
tela — que é exatamente o defeito que este projeto vem pagando caro.

A ordem não muda:

1. **o verbo** — e a proposta 1 é a melhor forma dele;
2. **a calibragem da tramitação**, e só depois do verbo, porque não se calibra uma
   mecânica que o jogador não consegue jogar;
3. **mecânica nova**, e a candidata é a proposta 2.

## O que se leva como inspiração, e não como item

- _"não é um pop-up: o índice despenca fisicamente"_ — é a doutrina do projeto dita
  por um terceiro, e vale guardar para o dia em que a rua ganhar dentes. Consequência
  que aparece como aviso modal é consequência que o jogador dispensa com um clique;
- **o preço de um voto não é uma escala, é um tipo.** Dinheiro, cargo e pauta são
  moedas diferentes, e hoje o Planalto só tem uma. A venalidade por eixo é o começo
  disso e não o fim — mas isto é anotação de longo prazo, e não fila.
