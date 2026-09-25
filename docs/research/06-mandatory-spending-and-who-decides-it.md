# A obrigatória, e quem de fato a decide

> **A tese:** o passo 6 do ciclo 13 mira certo — 61% do orçamento realmente sai de A1, A2 e
> A3 — mas **os três itens dão ao presidente uma caneta que ele não tem**. Nenhum dos três é
> uma alavanca do Executivo no Brasil real: o mínimo é regra de LEI com teto, a folha é ACORDO
> multianual que passa por lei, e o contingenciamento são **dois instrumentos diferentes** que
> o jogo hoje trata como um só.
>
> ⭐ **E isso é boa notícia, não má.** A doutrina da casa é _"tudo tem preço, nada tem muro"_.
> Cada uma dessas travas é exatamente um preço: existe caminho, e ele passa pelo Congresso —
> que é o motor que o jogo já tem.

**Escrito em 03/09/2026**, contra o catálogo em `src/data/fiscal.mjs` e `src/data/programs.mjs`
e contra fontes públicas de 2025 e 2026. **Todo número aqui tem fonte no rodapé.**

---

## A1 · O salário mínimo — o item mais forte, e o mais mal modelado

### O que o plano diz

> _"A peça: uma alavanca **anual**. O reajuste real escolhido escala o custo dos cinco
> programas indexados, e `mandatoryGrowth` deixa de ser constante e passa a ser derivado."_

### O que o Brasil faz

**O presidente NÃO escolhe o reajuste real.** A regra está em lei desde 2023 e foi apertada em
2024: o reajuste é **INPC de 12 meses até novembro, mais a variação real do PIB de dois anos
antes, com o ganho real limitado a 2,5%** — o teto da banda do arcabouço.

O PLOA 2027, enviado em 31/08/2026, aplica a regra na frente de todo mundo:

| ano  | valor     | reajuste | composição                 |
| ---- | --------- | -------- | -------------------------- |
| 2025 | R$ 1.518  | —        | —                          |
| 2026 | R$ 1.621  | +6,79%   | +R$ 103                    |
| 2027 | R$ 1.741¹ | +7,4%    | INPC 4,93% + **2,3% real** |

¹ proposto no PLOA; o valor final depende do INPC fechado até novembro de 2026.

⭐ **E A ÂNCORA DE CUSTO EXISTE, PÚBLICA E EXATA — é o achado mais valioso desta pesquisa.**
Cada **R$ 1** a mais no mínimo custa:

- **R$ 400 milhões/ano** pela conta do Ministério do Planejamento e Orçamento;
- **R$ 413,2 milhões/ano** pelas Consultorias de Orçamento da Câmara e do Senado.

Os R$ 120 do reajuste de 2027 custam, por essa régua, **~R$ 49,6 bi/ano**. **O jogo não precisa
de fator de escala inventado: ele pode calcular o custo.**

### ⛔ Três erros de fidelidade no item como está escrito

**1 · O reajuste acima da regra é LEI, e não caneta.** Para dar mais de 2,5% real o presidente
precisa mudar a lei do reajuste — Congresso, ou MP que o Congresso tem de aprovar. **A decisão
real não é _"quanto eu dou"_, é _"eu gasto capital político para mudar a regra?"_.** Sem isso,
A1 é uma barra deslizante de fantasia.

**A forma certa são três posições, e não um slider:**

| posição             | custa o quê                          | passa por onde |
| ------------------- | ------------------------------------ | -------------- |
| **cumprir a regra** | nada — o presidente assina o decreto | ninguém        |
| **acima da regra**  | permanente, e o preço é uma votação  | **ECLUSA**     |
| **abaixo da regra** | economiza, e cobra na rua com juros  | **ECLUSA**     |

**2 · A transferência de renda NÃO é indexada ao mínimo, e o catálogo a conta como se fosse.**
O comentário em `fiscal.mjs` agrupa _"aposentadoria urbana e rural, BPC, transferência de renda,
abono e seguro"_ nos R$ 1.325 bi que _"crescem sozinhos pela regra do salário mínimo"_. O
Bolsa Família tem **valor próprio em lei** (R$ 600 por família mais adicionais) e não acompanha
o mínimo. **Ele cresce por decisão, não por indexação — que é justamente o que o catálogo já
diz sobre ele em `programs.mjs`** (`guard: "law"`, piso móvel). As duas prosas se contradizem.

**3 · Só o benefício NO PISO escala com o mínimo.** Cerca de dois terços dos benefícios do RGPS
valem exatamente um mínimo; o resto é corrigido pelo INPC. ⚠ **Mas isso não pede modelagem** —
o R$ 413,2 mi/R$ 1 é empírico e já embute a proporção. **Modelar a repartição seria refazer uma
conta que a fonte já fez.**

---

## A2 · O reajuste da folha — o item mais fraco do passo

### O que o plano diz

> _"Conceder compra paz e engorda a obrigatória para sempre; segurar economiza e cobra em
> serviço entregue."_

### O que o Brasil faz

**Não é um botão de conceder ou segurar. É um acordo plurianual, assinado, pago em parcelas.**

- em 2024 o Executivo fechou **Termos de Acordo com ~98% do funcionalismo federal**,
  reestruturando carreiras até 2026;
- o formato foi **duas parcelas**: **9% em janeiro de 2025** e **5% em abril de 2026**;
- entre 2023 e 2026 os servidores federais acumularam **~27% médios**;
- o instrumento foi **MP e lei** — reajuste de servidor exige **lei específica** e depende de
  dotação prévia e autorização na LOA;
- o **PLOA 2027 põe gatilho fiscal**: o ganho real fica limitado a **0,6% acima da inflação**
  se a meta de resultado primário não for cumprida.

### ⚠ O que falta ao item

**O PARCELAMENTO é a mecânica, e o plano não a viu.** Conceder 14% em duas parcelas separadas
por 15 meses é uma promessa que **um presidente assina e outro paga** — e o jogo já tem a
máquina para isso: `betrayal` cobra promessa quebrada, e a plataforma da posse já é promessa
com prazo. **A parcela é o que torna o item interessante; o "conceder ou segurar" não é.**

**E o gatilho é a trava real:** errar a meta primária **fecha** o reajuste real. Isso liga a
folha ao resultado fiscal sem inventar regra nenhuma.

⛔ **E a greve não existe no jogo.** O plano diz _"greve de servidor é a resposta"_, e não há
resposta nenhuma: os servidores não são grupo de pressão na CALDEIRA. **Ou o item ganha o grupo,
ou a frase sai do plano** — prometer consequência que não existe é o que o §7 chama de prosa
que declara cobertura inexistente.

---

## A3 · O contingenciamento — o melhor item do passo, e o mais barato

### ⭐ O erro central: são DOIS instrumentos, e o jogo tem um

| instrumento           | o que é                                                      | é escolha?              |
| --------------------- | ------------------------------------------------------------ | ----------------------- |
| **bloqueio**          | a despesa não cabe no **limite do arcabouço**                | não — é aritmética      |
| **contingenciamento** | a **receita frustrou** e a meta primária está em risco (LRF) | **sim, e é reversível** |

O jogo hoje tem só o primeiro, e chama de contingenciamento. **O segundo é o que vira jogada.**

### O calendário real já está no jogo

- o gatilho é o **Relatório Bimestral de Avaliação de Receitas e Despesas**;
- o **Decreto de Programação Orçamentária e Financeira** sai **oito dias depois** de o relatório
  ir ao Congresso, e distribui os limites em etapas.

⭐ **O C7 já pôs `relatório bimestral` no calendário do jogo.** A3 não precisa de marco novo:
**ele pendura na peça que o passo 4 já construiu.**

### E o achado 36 se confirma no mundo

O plano registra que hoje o rateio grava o corte no estado e **nada nunca o devolve**. No Brasil
o contingenciamento **se desfaz**:

- em julho de 2025 o governo **descontingenciou** e manteve o bloqueio;
- em junho de 2026 **ampliou o bloqueio para R$ 23,678 bi**.

**O número anda nos dois sentidos, e no jogo ele só desce.**

### ⭐ E a emenda parlamentar é o preço político do corte

Emendas **não são imunes**: num único decreto, de R$ 7,14 bi de emendas, **R$ 4,71 bi foram
contingenciados e R$ 2,42 bi bloqueados**. E a escolha do que **proteger** é pública — em 2025
educação e Banco Central saíram preservados dos cortes.

**Isso fecha o circuito que o jogo já tem:** cortar emenda economiza caixa e **derruba
lealdade de bancada** — `seatPrice` e ECLUSA já sabem cobrar. É o item que mais muda o mês sem
motor novo.

---

## A decisão 3 do handoff — o piso que anda com a receita

**Confirmada pela regra, e ela é melhor do que o handoff supunha.**

- **saúde: 15% da receita corrente líquida**;
- **educação: 18% da receita de impostos**.

**São duas bases diferentes** — exatamente o que a decisão previu (_"o LASTRO passa a devolver
duas bases de receita em vez de uma"_).

⭐ **E há um bônus que ninguém tinha visto: os pisos NÃO obedecem ao teto do arcabouço.** A
despesa geral cresce 70% da receita, limitada a 2,5% real; saúde e educação podem crescer **na
mesma proporção da receita**. A incompatibilidade entre as duas regras é reconhecida
publicamente — e **é uma contradição estrutural real, de graça, para o jogo**: numa recessão os
pisos encolhem sozinhos; num boom eles estouram a banda e espremem todo o resto.

---

## ⚖ Veredito, e a ordem que eu executaria

**O passo está certo no alvo e errado na forma.** Os três itens supõem um presidente com caneta
onde o Brasil tem lei, acordo e relatório bimestral.

⭐ **E a correção não encarece o passo — barateia.** As três travas passam pelo Congresso, e o
Congresso é o motor mais maduro do projeto. **A1 vira uma votação, e não um slider.**

### A ordem, invertida em relação ao plano

| ordem | item   | por quê                                                                                 |
| ----- | ------ | --------------------------------------------------------------------------------------- |
| **1** | **A3** | usa só peça pronta — calendário do C7, rateio, emendas, áreas. **Não toca `src/data/`** |
| **2** | **A1** | tem âncora pública de custo (R$ 413,2 mi por R$ 1) e um caminho de lei já modelável     |
| **3** | **A2** | o mais complexo — acordo plurianual, parcelas, gatilho — e o que menos muda o mês       |

⚠ **O plano manda A1 → A2 → A3. Inverter tem razão medida:** A3 é o único dos três que não mexe
em calibragem, logo é o único que **não obriga remedir a série inteira**. Fazê-lo primeiro
entrega jogo novo com o portão barato.

⭐ **E a decisão 3 (o piso com a receita) deve entrar junto com A1**, não sozinha: as duas mexem
na repartição obrigatória e as duas obrigam remedir a série. **Juntas, pagam a remedição uma vez.**

---

## Fontes

- salário mínimo de 2027 no PLOA, regra e composição —
  [Exame](https://exame.com/economia/governo-anuncia-salario-minimo-de-r-1-741-para-2027/) ·
  [CNN Brasil](https://www.cnnbrasil.com.br/economia/money/macroeconomia/governo-divulga-ploa-com-salario-minimo-de-r-1-741/)
- custo por R$ 1 de mínimo (MPO, e Consultorias da Câmara e do Senado) —
  [Contábeis](https://www.contabeis.com.br/noticias/79014/salario-minimo-de-r-1-741-pode-elevar-despesas-da-uniao) ·
  [InfoMoney](https://www.infomoney.com.br/politica/ajuste-do-salario-minimo-por-que-r120-a-mais-podem-custar-quase-r50-bi-ao-governo/)
- acordos e parcelas do funcionalismo, e o gatilho do PLOA 2027 —
  [CONDSEF](https://www.condsef.org.br/noticias/maioria-dos-servidores-executivo-federal-tera-reajuste-5-partir-abril-2026) ·
  [Metrópoles](https://www.metropoles.com/brasil/governo-federal-limita-reajuste-de-servidores-em-2027-com-gatilho-fiscal) ·
  [Senado](https://www12.senado.leg.br/noticias/materias/2026/03/31/lei-reestrutura-carreiras-do-servico-publico-federal)
- bloqueio × contingenciamento, e o decreto de programação —
  [Exame](https://exame.com/esferabrasil/contingenciamento-e-bloqueio-as-diferencas-no-vocabulario-da-politica-fiscal/) ·
  [Nota Informativa do Senado](https://www12.senado.leg.br/orcamento/documentos/estudos/tipos-de-estudos/notas-tecnicas-e-informativos/ni-dpof-202511-1.pdf)
- emendas contingenciadas e bloqueadas, e o que foi preservado —
  [CNN Brasil](https://www.cnnbrasil.com.br/economia/macroeconomia/governo-detalha-cortes-e-anuncia-bloqueio-de-r-71-bilhoes-em-emendas/) ·
  [Agência Brasil](https://agenciabrasil.ebc.com.br/educacao/noticia/2025-05/educacao-e-bc-sao-preservados-de-cortes-no-orcamento)
- descontingenciamento e ampliação do bloqueio —
  [MPO, julho/2025](https://www.gov.br/planejamento/pt-br/assuntos/noticias/2025/julho/governo-faz-descontingenciamento-mas-mantem-medidas-para-atendimento-das-regras-fiscais) ·
  [MPO, junho/2026](https://www.gov.br/planejamento/pt-br/assuntos/noticias/2026/junho/governo-amplia-bloqueio-para-r-23-678-bilhoes-e-mantem-medidas-para-atendimento-das-regras-fiscais)
- pisos de saúde e educação e a incompatibilidade com a LC 200/2023 —
  [Consultoria de Orçamento da Câmara, NT 20/2023](https://www2.camara.leg.br/orcamento-da-uniao/estudos/2023/nt-n-20-de-2023-pisos-da-saude-e-da-educacao-coma-ec-n126-de-2022-e-a-lc-200-de-2023-1) ·
  [Câmara dos Deputados](https://www.camara.leg.br/noticias/1068548-audiencia-discute-manutencao-de-pisos-constitucionais-de-saude-e-educacao/)
