# Corte vertical — o começo do jogo e a estatal de energia

> **Situação:** vigente — a estatal de energia, etapa 3 do ciclo 33.

> Versão 3, 25/09/2026. É a primeira aplicação da [gramática das regras](rules-grammar.md), com os
> nomes da [especificação mestra](master-spec.md). O critério de aceite é o da especificação,
> §21.4. O plano de construção são os lotes E1 do [mapa de migração](migration-map.md), §6.4, hoje nas
> etapas 1, 3 e 4 do [ciclo 33](../cycles/33-the-whole-game.md). Os
> fatos e os links estão na [pesquisa 14](../research/14-the-state-energy-company.md). Desenho,
> sem código.

## 1. Por que a estatal

- **Ela se joga para lados opostos:** vender, manter, estatizar mais. Cada caminho mexe no fisco, no
  preço, no Congresso, na Justiça e nas pessoas, por mecanismos diferentes. Isso responde ao
  achado 77: a decisão do contingenciamento não pesava em nada no modelo.
- **Ela absorve a candidata anterior.** A medida provisória, que era a candidata principal do
  mapa, está dentro do corte: a subvenção sai por medida provisória, e a privatização da
  Eletrobras começou por uma.
- **Ela absorve o ciclo 20** (as empresas), que nunca começou.

**Enerbras** é fictícia e inspirada na Petrobras (ADR 0003). Os números de partida são os da
Petrobras, com fonte e data. Ela substitui a alavanca `petroleo-e-gas` de `src/data/rules.mjs`,
hoje uma barra de 0 a 100. O `reach` de 620 e o `initial` de 62 se recalibram no lote E1.1, e só
com ordem dele.

## 2. O começo: montar o governo

Decidido por ele em 25/09: toda partida começa assim. Os fatos estão na
[pesquisa 15](../research/15-forming-the-government.md).

1. **5 de janeiro de 2027, a posse.** Há 38 cadeiras de ministro. O jogador escolhe quem senta em
   cada uma: gente do seu partido, de outros partidos ou técnicos. Cada pasta dada a outro partido
   rende votos na estimativa da assessoria, que pode errar. O quanto cada partido vota com o
   governo se calibra com os dados abertos da Câmara.
2. **No mesmo dia, pode reorganizar os ministérios** por medida provisória: juntar, criar, extinguir.
   Foi o que os presidentes fizeram em 2019 e em 2023. A medida precisa virar lei em até 120 dias,
   sem contar o recesso.
3. **Indica o líder do governo** na Câmara, com 20 vice-líderes.
4. **1º de fevereiro, a eleição da Mesa.** A Câmara e o Senado escolhem os seus presidentes, por voto
   secreto. Na Câmara são 257 votos no primeiro turno, ou segundo turno entre os dois primeiros. O
   jogador apoia, negocia ou enfrenta. Quem vence monta a pauta de cada mês e decide se recebe um
   pedido de impeachment.

Cada escolha mostra as três linhas. Por exemplo, dar Minas e Energia a um partido do centro custa
uma pasta que serviria ao seu projeto, faz esse partido e os rivais dele reagirem, e vale na hora.
O resultado da abertura é a base do governo, estimada, e quem controla a pauta.

**O que é internacional fica de fora** (ordem dele, 25/09): geopolítica, guerras e choques de
preço lá fora entram numa atualização futura, listada no jogo. Até lá, o mundo lá fora fica parado
num nível declarado [DESENHO]. Recomendação: a média de 2025, antes do choque de 2026 (FALTA a
pesquisa). A política de preços da Enerbras continua valendo contra essa referência parada.

## 3. A ficha da Enerbras

É o `company` da especificação (§16.5), com os campos de estatal. Valores da Petrobras, 20-F de
2025, salvo onde marcado.

| campo                                                                    | valor de partida                                                                                                |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| controle                                                                 | a lei manda a União ter 50% + 1 das ações com voto; ela tem 50,26% (07/04/2026)                                 |
| propriedade                                                              | União 29,02% do total; BNDES e BNDESPar 8,03%, só preferenciais; outros 61,21%                                  |
| tamanho                                                                  | 79% do refino do país; 43.199 empregados na controladora; valor de mercado de US$ 74,8 bilhões                  |
| saúde financeira                                                         | lucro de US$ 19,6 bilhões; dívida bruta de US$ 69,8 bilhões; caixa livre de R$ 91,6 bilhões (2025)              |
| dividendos                                                               | cerca de R$ 41 bilhões de 2025; cerca de R$ 12 bilhões direto para a União (conta)                              |
| investimento                                                             | US$ 20,3 bilhões em 2025, 84% em exploração e produção                                                          |
| preço em set/2026, com o choque; no jogo, recalculado com o mundo parado | gasolina A a R$ 2,65 contra paridade de R$ 3,73; diesel A a R$ 3,51 contra R$ 6,51 (ANP, semana até 12/09/2026) |
| missão pública                                                           | o objeto do art. 61 da Lei 9.478                                                                                |
| royalties                                                                | 10% da produção de cada campo, a quem for o dono                                                                |

## 4. As ações do jogador

Ações do vocabulário da especificação (§12.5), sobre uma empresa. Servem depois para bancos e
Correios. O jogador combina como quiser; a ideologia é o que resulta, descrita no fim (§17).

| ação                         | parâmetros                                                                                                                                                      |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SELL_STAKE`                 | quanto, de que ações, mantendo ou não o controle; também vale para subsidiária                                                                                  |
| `PRIVATIZE`                  | o modelo: venda, ou capitalização com limite de voto, como a Eletrobras; com ou sem golden share                                                                |
| `ACQUIRE_STAKE`              | o alvo (ações, uma distribuidora) e quanto                                                                                                                      |
| `DIRECT_ENTERPRISE`          | política de preços (referência, frequência de reajuste, banda, quanto do desvio a empresa absorve) e investimento; o corte oferece poucos pontos de cada escala |
| blindagem                    | uma norma que sobe a rota de uma venda futura: lei ou emenda                                                                                                    |
| `APPOINT`                    | o presidente da Enerbras                                                                                                                                        |
| `SUBSIDIZE` e `SET_TAX_RATE` | fora da empresa: subvenção por litro e tributo do combustível                                                                                                   |

## 5. As rotas e a avaliação

A assessoria jurídica é uma pessoa e responde em uma linha por ação. Tudo abaixo está
[VERIFICADO] na pesquisa 14, §1.

| ação                             | rota                                                                                                                                          | na rota errada                     |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| vender o controle da empresa-mãe | `ORDINARY_LAW` própria, que mude o art. 62 da Lei 9.478, com licitação (ADI 5624); o PND não serve                                            | por decreto ou pelo PND: `BLOCKED` |
| vender ações mantendo 50% + 1    | `DIRECT_ACT`: decreto que inclui no PND, por recomendação do CND (Lei 9.491, art. 2º §2º)                                                     | —                                  |
| vender uma subsidiária           | `OTHER_INSTITUTION`: a estatal decide, com procedimento competitivo (ADI 5624)                                                                | sem disputa: `CONTESTED`           |
| golden share                     | dentro da privatização; o CND aprova (Lei 9.491, arts. 6º e 8º)                                                                               | —                                  |
| política de preços               | `OTHER_INSTITUTION`: a Diretoria executa a diretriz do Conselho; preço fora do mercado exige lei ou regulamento e compensação prévia da União | sem compensação: `CONTESTED`       |
| blindagem                        | `ORDINARY_LAW` (outra lei desfaz) ou `CONSTITUTIONAL_AMENDMENT`                                                                               | —                                  |
| nomear o presidente da Enerbras  | a União indica e o conselho elege ([VERIFICAR] no estatuto); a lista respeita o art. 17 da Lei 13.303 (ADI 7331)                              | nome vedado: `CONTESTED`           |
| subvenção                        | `PROVISIONAL_MEASURE` com crédito extraordinário                                                                                              | —                                  |
| tributo do combustível           | `DIRECT_ACT` para a CIDE (CF, art. 177 §4º); o PIS/Cofins caiu por decreto em 2026 (base legal: VERIFICAR)                                    | —                                  |

A rota fora da ordem não entra neste corte (decidido em 25/09).

## 6. Quem reage

A tela mostra a estimativa da assessoria, que pode errar, através de pessoas. Nunca a verdade.
Cada ator decide pela VONTADE com o que sabe (A2a). **Nenhuma reação é automática.**

| ator                                | no motor                                    | o que pesa para ele                           | o que pode fazer                           |
| ----------------------------------- | ------------------------------------------- | --------------------------------------------- | ------------------------------------------ |
| presidente da Enerbras              | pessoa, nomeada por você                    | a empresa e o cargo                           | cumprir, resistir, vazar                   |
| sindicato dos petroleiros           | organização                                 | emprego e controle público                    | greve                                      |
| caminhoneiros                       | organização                                 | preço do diesel e frete                       | greve                                      |
| minoritários                        | organização com legitimidade                | lucro e dividendo                             | ir à Justiça e à CVM                       |
| governadores dos estados produtores | pessoas                                     | investimento e emprego no estado              | pressionar as bancadas                     |
| ministro da Fazenda                 | pessoa                                      | o teto e a meta                               | dar parecer contra, resistir               |
| Congresso                           | ECLUSA, e depois deputados individuais (D1) | a pauta de cada bancada                       | converter, emendar ou deixar a medida cair |
| partidos e entidades no STF         | quem tem legitimidade                       | a regra que perdem                            | contestar a rota                           |
| investidores                        | indicador agregado, sem ator (§9.1)         | lucro, risco jurídico, governança             | o preço da ação                            |
| consumidores                        | segmentos da SONDA                          | preço do combustível, pela inflação divulgada | aprovar ou desaprovar                      |

## 7. Tramitação, portões e execução

- **O que pede lei ou emenda** entra na tramitação que já existe. O relator pode tirar cláusulas,
  e aprovar sem a mais polêmica é um resultado possível.
- **O relógio é o mensal de hoje** até o lote B1. Até lá, os 60 + 60 dias da medida provisória
  viram meses, e a aproximação fica declarada.
- **Portões:** o TCU olha a venda; o CADE, a compra; minoritários vão à Justiça e à CVM; os
  legitimados vão ao STF. Os prazos vêm dos casos reais da gramática, §4; a chance é [DESENHO].
- **Vender não é assinar:** é estruturar a oferta ou o leilão, esperar a janela do mercado, liquidar
  e transferir. Foram 16 meses da medida provisória à oferta na Eletrobras, e 8 do contrato ao
  fechamento numa refinaria. Durante a execução tudo pode travar: liminar, greve, mercado ruim.

## 8. As consequências, pelos cinco canais

| ação                       | dinheiro                                         | preço                                                   | pessoas                        | durabilidade                       | o motor já tem                        | falta                                      |
| -------------------------- | ------------------------------------------------ | ------------------------------------------------------- | ------------------------------ | ---------------------------------- | ------------------------------------- | ------------------------------------------ |
| vender o controle          | caixa uma vez; dividendo e folha saem do Tesouro | a refinaria passa a seguir o mercado                    | sindicato, bancadas produtoras | desfazer pede lei e indenização    | LASTRO: `sale`, `dividend`, `payroll` | o valor de mercado como base da venda      |
| vender ações, com controle | caixa menor                                      | —                                                       | mercado                        | ações vendidas não voltam de graça | LASTRO                                | o mesmo                                    |
| comprar uma distribuidora  | gasto hoje, dívida da empresa                    | —                                                       | CADE, mercado                  | o ativo fica no balanço            | LASTRO parcial                        | o balanço da Enerbras                      |
| segurar o preço na empresa | lucro e dividendo menores                        | refinaria abaixo da paridade; 5,14% da gasolina no IPCA | minoritários, investidores     | o próximo conselho muda            | CORRENTE (inflação), SONDA            | o efeito no lucro, calibrado               |
| subvenção                  | custo por litro vezes o volume                   | bomba mais barata                                       | Fazenda, caminhoneiros         | cai com a medida provisória        | LASTRO (gasto)                        | o volume por período (ANP)                 |
| tributo menor              | receita perdida                                  | bomba mais barata                                       | Fazenda                        | outro decreto volta                | `taxDelta`, canal morto               | ligar o canal                              |
| greve                      | produção menor                                   | falta nos postos                                        | todos                          | semanas                            | não existe                            | calibrar em 2018                           |
| investir mais ou menos     | gasto hoje                                       | —                                                       | governadores                   | capacidade anos depois             | MALHA (indústria, com atraso)         | a ligação investimento → índice, calibrada |

O que cada estratégia **expõe**, antes de as pessoas decidirem. O critério da especificação pede
ao menos três estratégias plausíveis (§21.4):

- **vender o controle, abrir o setor, golden share e preço de mercado:** caixa grande uma vez; o
  Tesouro perde o dividendo e a folha; a refinaria segue o mercado. Ficam expostos o emprego, com
  risco de greve, e o apoio das bancadas produtoras;
- **manter o controle, vender subsidiárias e abrir concorrência:** caixa menor, sem lei própria;
  exposto ao TCU, à disputa em cada venda e ao sindicato;
- **aumentar o controle, comprar distribuidora, segurar o preço e blindar por emenda:** gasto hoje;
  lucro, dividendo e caixa da empresa expostos; o minoritário pode ir à Justiça, e o mercado pode
  rebaixar a empresa. É durável na lei e frágil nas finanças.

## 9. O que consolida e o que reverte

Cada ação tem os seus marcos, e nenhum deles é uma barra (§13.7):

- **venda:** contratos assinados, comprador que investiu, indenização para desfazer;
- **golden share e blindagem:** estão no estatuto, na lei ou na Constituição, e o custo de desfazer
  é a rota;
- **política de preços:** nada consolida, porque o próximo conselho muda;
- **compra de ativo:** o ativo fica no balanço, e vender de novo pede outro processo;
- **consolidado não é irreversível:** a Eletrobras privatizada voltou, por acordo homologado no STF,
  a ter 3 conselheiros indicados pela União.

O balanço final mostra quanto de cada mudança ficou nesses marcos.

## 10. O que o jogador faz na tela

1. No começo, monta o governo (§2).
2. Abre a ficha da Enerbras e vê os rostos.
3. Monta as ações, e a assessora diz a rota de cada uma em uma linha.
4. Vê as três linhas de cada ação: quanto custa, quem reage, quanto tempo.
5. Manda cada ação para onde ela precisa ir: Congresso, conselho, decreto.
6. Negocia com quem pode travar: relator, sindicato, governadores.
7. Acompanha a execução pelos marcos: oferta, leilão, liquidação.
8. Vê as consequências chegarem pelas pessoas e pelos números: preço da gasolina, dividendo, valor
   da empresa, greve.
9. No fim, vê o que ficou consolidado.

## 11. O corte passa se

Pela especificação, §21.4: há problema material, de 2 a 4 atores relevantes, informação imperfeita,
um Momento Presidencial, iniciativa, rota, negociação, execução, reação e retorno depois. E mais:

- ao menos três estratégias plausíveis;
- atores que agem sem roteiro;
- consequência explicável e conflito legível;
- detalhe opcional;
- **estratégias opostas deixam países materialmente diferentes em 48 meses** (a lição do achado 77).

## O que fica de fora

O setor inteiro em detalhe (refino, gás, petroquímica, elétrico), os preços por produto, as outras
estatais, a mídia, a semana completa, o Senado no afastamento e a rota fora da ordem.

## Pendências de pesquisa

Da pesquisa 14, ainda sem fonte oficial lida:

- se a autorização genérica basta para vender a empresa-mãe e para comprar empresa, e os limites do
  CADE;
- a base legal do corte de PIS/Cofins por decreto;
- a duração do período de apuração da subvenção e o volume de diesel (ANP);
- o efeito do frete na inflação;
- a reação do mercado à troca de política de 2023, a greve dos petroleiros de 2020, o controle de
  preços de 2011 a 2014 e a data de início da greve de 2018;
- o mérito da ADI 5624: o que se leu é a cautelar referendada, de 2019.
