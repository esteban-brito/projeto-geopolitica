# Ciclo 5 — a república ganha rosto

> Acordado na nona sessão, 15/08/2026, a partir da **parte 2 de uma auditoria
> externa** sobre a interface e de uma releitura minha do que ela diagnosticou.
> O pedido do responsável foi curto: _"monte um plano usando tudo isso como base +
> o seu pensamento criterioso e profundo como um designer de jogos"_.
>
> ⚠ **Este ciclo não abre motor novo.** Tudo o que ele mostra sai de LASTRO,
> ECLUSA, MALHA, SONDA, ELENCO, CORRENTE e ESTRATO — que já rodam. É um ciclo de
> **legibilidade**: o modelo já sabe mais coisas do que a tela conta.

## O diagnóstico, e ele é mais fundo que o da auditoria

A auditoria diz que o Planalto _"parece um SaaS corporativo"_ e que falta "sabor".
O sintoma está certo. A causa não é fonte nem textura.

Um simulador de 95% tabelas como o Football Manager nunca deixa de parecer futebol
por três razões, e o Planalto não tem nenhuma:

1. **Ninguém se dirige ao jogador.** Toda tela descreve um sistema em terceira
   pessoa. A coisa mais próxima de alguém falando com o presidente é a linha do
   veredito — e ela é anônima, que foi o que a auditoria pegou;
2. **Não há outros com nome e continuidade.** O jogo tem **sete pessoas** com
   nome, arquétipo, ambição e memória, e **nenhuma tela mostra uma**. O jogador
   paga uma bancada, a memória do líder muda o preço em silêncio, e ele nunca
   soube que existia um líder;
3. **O jogador é ninguém.** O jogo nunca diz quem ele é. A barra diz "1º MANDATO ·
   ANO 1" — o mandato de quem? Não é um jogo sobre a sua presidência; é um painel
   sobre o Brasil.

E há uma quarta, que a auditoria não viu: **o mês não tem batida.** Toda tela
mostra o mesmo estado o tempo todo. Uma presidência é um calendário — abre com
notícia, gasta-se negociando, fecha com voto e resultado. Planilha é atemporal;
jogo tem compasso.

> **A crítica da auditoria e a Parte 3 do ciclo 4 são o mesmo problema visto de
> dois lados.** A tramitação é o que dá compasso ao mês e conteúdo à Caixa de
> Entrada. Este ciclo não é um desvio da Parte 3 — é a preparação dela.

## As quatro decisões, respondidas

| #   | decisão                   | resposta                                                                                                                                                                                                                                                                  |
| --- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Casa Civil no elenco?** | **Sim.** Um oitavo personagem que não vota (alcance zero), só aconselha. É o que dá **voz** ao jogo — o "assistant manager" do FM — e é o elemento diegético mais valioso disponível. Está fora da onda 1 do ciclo 4, e a exceção é declarada aqui                        |
| 2   | **O hemiciclo**           | **Sim, e a recusa anterior caducou.** A razão escrita era _"o modelo não tem deputado individual, tem quatro blocos"_; o ELENCO acabou com isso — são **11 bancadas com contagem de cadeiras**. Continua recusada a taxonomia "governista/oposição", que o modelo não tem |
| 3   | **Papel**                 | **Sim, e escopado.** Papel não é um segundo vidro: é a superfície reservada ao **texto de registro** — lei e carta. Aparece em mais lugar nenhum                                                                                                                          |
| 4   | **Brasão da República**   | **Não.** Símbolos nacionais têm uso regulado (Lei 5.700/1971), e um brasão oficial faz o jogo parecer produto do governo. Faixa presidencial e paleta institucional não têm esse problema                                                                                 |

---

## As partes

### Parte A — a mentira · ✔ FEITA em 15/08/2026

**A Mesa anunciava um placar que o turno não produzia, em 27,2% das votações.**

O entrypoint montava a câmara à mão: `whipCount` com os **quatro** blocos do
catálogo, a verba crua e a lealdade crua. O turno vota, desde a oitava sessão, com
as **onze** bancadas do ELENCO, a verba com crédito de memória e desconto de
ambição dentro, e a **aprovação da rua** deslocando a resistência — `standing`, que
a tela nem passava.

| medido em 1.012 votações |                 |
| ------------------------ | --------------- |
| divergência máxima       | **35 votos**    |
| vereditos **invertidos** | **275 — 27,2%** |

Exemplo: quórum 308, a Mesa anuncia **327 · ACIMA DO QUÓRUM**, o turno produz
**299** e a pauta cai.

Três coisas foram feitas, e só a terceira fecha a classe:

1. **`forecast()` na camada de aplicação** — devolve a pauta, o placar, a banda e o
   que cada bloco entrega, tudo da mesma câmara que `playMonth` usa. A tela
   pergunta; não monta;
2. **uma prova** — _"a Mesa e o turno preveem com a MESMA câmara"_, verificada
   mordendo: revertido o conserto, ela acusa _"a Mesa previu 312,0 e o turno
   centrou em 300,0"_;
3. **`whipCount` e `dispersion` saíram da fachada.** Este é o conserto de verdade.
   Enquanto a porta errada estiver aberta, alguém entra por ela — e foi assim que o
   defeito nasceu, sem ninguém quebrar nada: o ELENCO e a SONDA chegaram, e a tela
   ficou para trás em silêncio.

> **A lição, e ela é a terceira da mesma família.** A Mesa já previu com a verba
> prometida enquanto o turno pagava a rateada; a tela já remontou a legislação por
> fora antes de `bandsOf`. Toda vez a causa foi a mesma: **dois lugares montando a
> mesma pergunta.** Oferecer a porta certa não basta — é preciso fechar a errada.

Dois defeitos menores caíram junto: a **banda `±`** era calculada sobre 4 blocos
enquanto `vote` sorteia 11 vezes (erros independentes somam em quadratura, então
ela anunciava incerteza maior que a real), e a **soma das linhas** da Mesa não
batia com o placar, porque cada linha encontrava apenas a bancada _restante_ do
bloco — o que sobrou dele depois de os líderes saírem.

### Parte B — a república ganha rosto · ✔ FEITA em 15/08/2026

Tudo aqui sai de motor que já roda. Nenhum número novo.

**B1 · A bancada vira gente.** Com a Parte A, a Mesa passa a poder listar as onze
bancadas — sete delas são pessoas. Cada linha ganha nome, **cargo**, arquétipo em
uma linha, e a **memória dita em português**: _"lembra da verba de março"_,
_"cobra a promessa que você não pagou"_. A ambição aparece onde ela é preço:
_"quer o Planalto em 2030 — reconhece menos do que recebe"_.

A estrutura honesta é o bloco **contendo** as pessoas: você paga o bloco, o bloco é
feito de gente, e a gente entrega diferente. O controle continua por bloco.

**B2 · O sinete.** Cada pessoa precisa de identidade visual. **Não foto** — seria
fingir um retrato que não temos. Um **monograma em sinete**, gerado da semente como
o nome, com a forma vindo do cargo e o tom vindo do bloco. Determinístico, SVG
inline, zero dependência. Serve a Mesa hoje e a Caixa de Entrada depois — porque
_"ih, carta do líder do Centrão"_ só funciona se a cara vier antes do texto.

**B3 · O jogador existe.** A sidebar deixa de dizer só "PLANALTO" e passa a dizer
de quem é o governo: o nome do presidente e **a posição que ele se tornou** — que
`compose` já calcula e ninguém mostra. É a decisão do ciclo 2 (_"a posição é
sombra, nunca controle"_) virando visível: **o jogo conta quem você virou a partir
do que você moveu.**

**B4 · A leitura do mês ganha autor.** O chefe da Casa Civil assina o veredito. Ele
não vota, não relata e não tem alcance — ele **fala**. É o único personagem do jogo
cuja função é dirigir-se ao jogador.

### Parte C — a pele institucional · ✔ FEITA em 15/08/2026

**C1 · Duas famílias tipográficas, e a divisão é uma legenda.** Hoje
`--font-display` e `--font-text` são **ambos** `system-ui`.

> **serifa = texto de registro** (lei, carta, nome, ofício) ·
> **sans = valor medido** (todo número, toda tabela)

Não é decoração: passa a ser possível saber de relance se o que se lê é **norma**
ou **medição**. Pilha de sistema, sem build e sem download.

**C2 · O selo no lugar da pastilha.** As tarjas de rito já existem — EMENDA, LEI
ORDINÁRIA, CONSTITUIÇÃO. Como **carimbo**, carregam o peso que a mecânica já tem.

**C3 · O bordô entra como terceira cor institucional.** A auditoria chamou a paleta
de _"verde neon de startup"_ e leu errado: `--brand` é `#e8a33d`, âmbar — o verde é
**semântico** (alta/leal), não é a marca. O que falta é o bordô do Legislativo e do
Judiciário, para o Congresso e o STF não serem o mesmo azul-cinza de todo o resto.

**C4 · O papel.** Superfície reservada a lei e carta, e a nenhuma outra coisa.
A regra de material passa a ser **duas substâncias com fronteira declarada**: vidro
para a máquina do Estado, papel para o texto de registro. É a mudança mais
transformadora do ciclo e a mais arriscada — se ela vazar para fora do texto de
registro, vira a segunda paleta que o sistema visual existe para impedir.

### Parte D — o hemiciclo · ✔ FEITA em 15/08/2026

**513 cadeiras, cor por bancada, preenchidas se estão com o governo e vazadas se
não.** Composição e apoio na mesma imagem, sem inventar nada: o modelo sabe quantas
cadeiras cada uma das onze bancadas tem, e sabe a lealdade de cada uma.

⚠ **O arco atual não morre por isso, e a distinção importa.** O arco reparte a
**base efetiva** por saúde (leal / obstruindo / rompida) e responde _"quão saudável
é minha base?"_. O hemiciclo responde _"do que a Câmara é feita?"_. São duas
perguntas, e a segunda não substitui a primeira.

### Parte E — o mês cai na mesa · ✔ FEITA em 15/08/2026

Hoje o resultado do mês fica enterrado num bloco no rodapé do Congresso — uma tela
que o jogador pode não visitar. Ele deve **cair no Gabinete**, que é onde o mês
começa. É literalmente a primeira carta da Caixa de Entrada, e ela **não depende da
tramitação**: _"o mês fechou assim"_ é leitura de estado que já existe.

E é a ponte para a Parte 3 do ciclo 4: quando a tramitação existir, o inbox já terá
forma, remetente e sinete.

---

## O que este ciclo NÃO faz, declarado

- **"Datafolha/Ipec" num selo de pesquisa.** Recusado. Atribuir número fabricado a
  instituto real é o inverso exato do ADR 0003 — o mundo é real, as **pessoas e
  organizações** são inventadas. A forma do selo entra; o nome é fictício;
- **manchetes de jornal.** A imprensa é a onda 2 da Parte 5 e não tem motor.
  Manchete escrita à mão é evento roteirizado, que o ciclo 4 proíbe. Manchete
  **derivada da série da SONDA** entra quando a imprensa existir — _"pico
  histórico"_ é computável;
- **retrato de personagem.** Sinete sim, foto não;
- **brasão da República.** Ver decisão 4.

## A ordem

| #   | parte                            | por quê aí                                                  |
| --- | -------------------------------- | ----------------------------------------------------------- |
| 1   | **A — o placar** ✔               | não é estética: é o jogo mentindo em 27% dos votos          |
| 2   | **B1 + B2** ✔                    | resolve a maior parte da crítica e não depende de nada novo |
| 3   | **C1 + C2** ✔                    | baratíssimo, e muda a "alma" mais que qualquer widget       |
| 4   | **B3 + B4** ✔                    | pequeno, e transforma "painel do Brasil" em "seu governo"   |
| 5   | **C3 + C4 + D** ✔                | as decisões pesadas, depois de as baratas provarem o rumo   |
| 6   | **E** ✔ **+ Parte 3 do ciclo 4** | a batida do mês e a tramitação são a mesma obra             |

## Uma nota sobre a auditoria que originou este ciclo

**Ela estava olhando uma captura anterior à oitava sessão.** Cita o veredito antigo
(_"Base folgada e caixa livre"_, corrigido em 14/08 porque contradizia o cofre logo
abaixo) e um número da Rua que não existe mais. **Três das quatro queixas dela já
estavam corrigidas quando chegaram** — o mesmo padrão das duas anteriores, agora
pela terceira vez.

E ela repete o erro de mecanismo já registrado: onde julga o que **vê**, acerta;
onde conclui o que existe **por trás**, erra — chamou de "verde de startup" uma
paleta âmbar, e pediu gente sem perceber que a gente já existe e é o motor que a
tela ignora.

**Mesmo assim é a crítica externa mais útil que o projeto recebeu.** Porque não é
sobre um widget: é sobre o jogo não ter diegese — e nisso ela está inteiramente
certa.
