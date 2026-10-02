# Pesquisa 14 — a estatal de energia: regras, números e episódios reais

> Consulta em 25/09/2026, feita pelo Claude nas fontes oficiais: Planalto, STF, SEC (20-F da
> Petrobras), Petrobras, ANP, IBGE, Fazenda e MME. Atende às seis pesquisas do
> [corte vertical](../spec/vertical-slice-energy.md). Marcas: **VERIFICADO** (li o texto na
> fonte do link), **PARCIAL** (a fonte oficial existe, mas só li o resumo da busca), **FALTA** (sem
> fonte oficial achada). Número derivado aparece como conta, nunca como dado.
>
> O jogo começa em 05/01/2027. Estes são os últimos dados reais em 25/09/2026, e o ponto de partida
> se revê antes de lançar. As marcas seguem a [gramática](../spec/rules-grammar.md).

## Os cinco achados que mudam o desenho

1. **A Petrobras está fora do programa de privatização.** A Lei 9.491 não se aplica a quem exerce
   o monopólio do art. 177 da Constituição. Vender o controle pede uma lei própria, como a da
   Eletrobras. Vender as ações que sobram acima de 50% + 1 das ordinárias cabe no PND.
2. **Segurar o preço pela empresa tem trava escrita.** O estatuto só deixa a União impor preço
   abaixo do mercado com lei ou regulamento, contrato publicado e **compensação prévia paga pela
   União**. Fora disso é abuso do controlador, e o minoritário processa.
3. **O mandato de 2027 começaria no meio de um choque real.** Por ordem dele (25/09), o que é
   internacional entra numa atualização futura; este achado fica guardado para ela. Em 2026, um conflito no Oriente Médio
   fechou e ameaçou bloquear o Estreito de Ormuz. O Brent chegou a US$ 100. O governo respondeu
   com cinco medidas provisórias de subvenção, um corte de PIS/Cofins por decreto e a mistura de
   etanol a 32%. Em setembro, o diesel da Petrobras custa 46% menos que o importado.
4. **Nomear o presidente da empresa tem filtro legal.** Não pode ser ministro, dirigente de
   partido nos últimos 36 meses nem dirigente sindical. O STF manteve o filtro em 2024.
5. **Consolidado não é irreversível, e há caso real.** A Eletrobras foi privatizada em 2022. Em
   2023 a Presidência foi ao STF contra o limite de voto da União. Em 2025 veio um acordo: a União
   indica 3 dos 10 conselheiros, sem voltar a controlar a empresa.

## 1. O regime jurídico (pesquisa 1)

| cláusula                          | caminho real                                                                                                                                                                              | se o jogador usar o instrumento errado                    | marca e fonte                                                                                                                 |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| vender o controle da empresa-mãe  | lei que mude o art. 62 da Lei 9.478 ("no mínimo, cinquenta por cento das ações, mais uma ação, do capital votante"); o STF exige autorização legislativa e licitação para vender a matriz | decreto: **ineficaz**, o controle não muda                | VERIFICADO: [Lei 9.478][l9478], arts. 61–62; [STF, ADI 5624][adi5624], cautelar referendada em 06/06/2019 (mérito: VERIFICAR) |
| a mesma venda pelo PND            | não serve: a lei do PND não se aplica a quem exerce o monopólio do art. 177                                                                                                               | incluir no PND por decreto: **ineficaz** para o controle  | VERIFICADO: [Lei 9.491][l9491], art. 3º                                                                                       |
| vender ações, mantendo 50% + 1 ON | PND: vale para "as ações excedentes" ao mínimo do controle da Petrobras; o Presidente inclui por decreto, por recomendação do CND. Sem licitação só se não houver perda de controle       | —                                                         | VERIFICADO: Lei 9.491, art. 2º §2º e art. 6º I; ADI 5624                                                                      |
| vender subsidiária                | sem lei, com procedimento competitivo que respeite o art. 37 da Constituição                                                                                                              | venda sem disputa: **discutível**                         | VERIFICADO: ADI 5624                                                                                                          |
| criar subsidiária ou associar-se  | a lei já autoriza a Petrobras a criar subsidiárias que se associem a outras empresas                                                                                                      | —                                                         | VERIFICADO: Lei 9.478, art. 64; CF, art. 37 XX                                                                                |
| comprar participação em empresa   | a Constituição pede autorização legislativa "em cada caso"; se a autorização genérica do art. 64 basta, e os limites do CADE, ficam a conferir                                            | —                                                         | CF art. 37 XX VERIFICADO; alcance do art. 64 e CADE: **FALTA**                                                                |
| golden share                      | a União pode deter ação de classe especial com vetos listados no estatuto; o CND aprova a criação                                                                                         | —                                                         | VERIFICADO: Lei 9.491, arts. 6º II "d" e 8º                                                                                   |
| política de preços pela empresa   | a Diretoria executa a diretriz do Conselho (2022). Preço fora do mercado só com lei ou regulamento, contrato, custo discriminado e compensação prévia da União                            | ordem sem compensação: **discutível** (abuso de controle) | VERIFICADO: [estatuto][estatuto], art. 3º §§3–7; Lei 13.303, arts. 4º §1º e 8º §2º; [Lei 6.404][l6404], arts. 117 e 238       |
| blindar por PEC                   | três quintos, em dois turnos, em cada Casa; promulgada pelas Mesas, sem sanção                                                                                                            | —                                                         | VERIFICADO: [CF][cf], art. 60 §§2º–3º                                                                                         |
| blindar por lei                   | lei ordinária; outra lei desfaz                                                                                                                                                           | —                                                         | VERIFICADO pela regra geral                                                                                                   |
| nomear presidente e conselho      | 10 anos na área ou 4 em cargo de direção; vedados ministro, dirigente de partido ou de campanha nos últimos 36 meses e dirigente sindical                                                 | nomeação vedada: **discutível**                           | VERIFICADO: [Lei 13.303][l13303], art. 17; [STF, ADI 7331][adi7331], 09/05/2024                                               |
| mexer no imposto do combustível   | a CIDE sobe e desce por ato do Executivo; o PIS/Cofins da gasolina caiu por decreto em 09/09/2026                                                                                         | —                                                         | CIDE VERIFICADO (CF, art. 177 §4º I "b"); base legal do PIS/Cofins: **FALTA**                                                 |
| subvencionar o combustível        | medida provisória que autoriza a subvenção, com crédito extraordinário, paga pela ANP a produtor e importador que abatem o valor na nota                                                  | —                                                         | VERIFICADO: MPs de 2026, ver o item 5                                                                                         |

**Royalties.** São 10% da produção de cada campo, pagos por mês. A regra incide sobre a produção,
não sobre quem é o dono, e por isso a venda da empresa não muda o que o estado produtor recebe.
VERIFICADO: Lei 9.478, art. 47.

## 2. A empresa em números (pesquisa 2)

Fonte: [20-F de 2025][f20], entregue à SEC em 09/04/2026. VERIFICADO, salvo onde marcado.

| campo                                 | valor                                                                                                              |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| ações                                 | 12.888.732.761: 7.442.231.382 ordinárias e 5.446.501.379 preferenciais                                             |
| União (07/04/2026)                    | 50,26% das ordinárias; 29,02% do capital total                                                                     |
| BNDES e BNDESPar                      | só preferenciais: 1,05% e 6,98% do total                                                                           |
| outros acionistas                     | 61,21% do total                                                                                                    |
| lucro líquido de 2025                 | US$ 19,634 bilhões                                                                                                 |
| dividendos antecipados de 2025        | R$ 32,535 bilhões (jan–set)                                                                                        |
| complemento de 2025, aprovado em 2026 | duas parcelas de R$ 0,32626409 por ação (maio e junho de 2026). **PARCIAL**                                        |
| regra dos dividendos                  | 45% do fluxo de caixa livre se a dívida bruta estiver no limite; mínimo de US$ 4 bilhões com Brent acima de US$ 40 |
| fluxo de caixa livre de 2025          | R$ 91,635 bilhões                                                                                                  |
| dívida bruta em 31/12/2025            | US$ 69,793 bilhões; líquida, US$ 60,593 bilhões; teto do plano, US$ 75 bilhões                                     |
| investimento de 2025                  | US$ 20,319 bilhões, 84% em exploração e produção                                                                   |
| valor de mercado em 31/12/2025        | US$ 74,8 bilhões                                                                                                   |
| empregados em 31/12/2025              | 43.199 na controladora; mais de 50 mil com as subsidiárias                                                         |
| refino                                | 1.813 mil barris/dia em 10 refinarias, cerca de 79% da capacidade do país (anuário ANP 2025)                       |
| distribuição                          | fora dela desde 2019 (item 4)                                                                                      |

**Conta, não dado:** com o complemento, os dividendos de 2025 somam cerca de R$ 41 bilhões
(32,5 + 0,6525 × 12,89). A União recebe 29% disso direto, cerca de R$ 12 bilhões. BNDES e BNDESPar
recebem mais 8%.

## 3. Do refino à bomba (pesquisa 6) e o peso no IPCA (pesquisa 3)

Semana de 13 a 19/09/2026, R$ por litro. Fontes: [composição da Petrobras][precos], feita com dados
da ANP e do Cepea, e a [síntese semanal da ANP nº 38/2026][sintese]. VERIFICADO.

| parcela                 | gasolina C | diesel B S10 |
| ----------------------- | ---------: | -----------: |
| Petrobras               |       2,08 |         2,83 |
| etanol anidro/biodiesel |       0,93 |         0,80 |
| tributos federais       |       0,24 |         0,32 |
| ICMS                    |       1,57 |         1,17 |
| distribuição e revenda  |       1,72 |         2,01 |
| **bomba**               |   **6,54** |     **7,13** |

- **O ICMS é fixo por litro** e igual em todo o país: R$ 1,57 na gasolina C e R$ 1,17 no diesel
  (Convênios ICMS 15/2023 e 199/2022, alterados em 2025). Ele não sobe junto com o preço da
  empresa.
- **A tabela de tributos federais cheios** é, na gasolina A, PIS de R$ 0,1411, Cofins de
  R$ 0,6514 e CIDE de R$ 0,10. No diesel A são PIS de R$ 0,06261 e Cofins de R$ 0,28889. Os
  R$ 0,24 da tabela acima já refletem o corte de setembro.
- **A mistura:** a ANP usa 32% de etanol (Resolução CNPE 9/2026, de 01/08/2026, por 180 dias,
  prorrogável uma vez). A página da Petrobras ainda diz 30%. A divergência fica registrada.
- **Preço daqui contra o de importação** (sem tributos, semana até 12/09/2026): gasolina A a
  R$ 2,65 contra paridade de R$ 3,73, 29% abaixo. Diesel A a R$ 3,51 contra R$ 6,51, 46% abaixo.
  A paridade é uma estimativa da S&P Global publicada pela ANP. O preço daqui já vem com o
  desconto das subvenções.

**Peso no IPCA de agosto de 2026** ([IBGE, tabela 7060][sidra7060]): gasolina 5,14%; etanol 0,62%;
diesel 0,26%; gás veicular 0,06%; gás de botijão 1,24%. O diesel pesa pouco direto; o efeito dele
vem pelo frete, e esse canal ainda não tem número (**FALTA**).

**Conta, não dado:** R$ 0,10 a mais no litro da gasolina A viram R$ 0,068 na gasolina C (68% da
mistura). Isso é 1,04% da bomba, e cerca de 0,05 ponto no IPCA pelo efeito direto.

## 4. Prazos reais (pesquisa 4)

| caso                                | linha do tempo                                                                                                                                | fonte                                             |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Eletrobras, venda do controle       | projeto de lei em 2019; MP 1.031 em 23/02/2021; Lei 14.182 em 12/07/2021; TCU em 18/05/2022; bolsa em 14/06/2022. São 16 meses da MP à oferta | VERIFICADO: [Lei 14.182][l14182], [MME][mme-b3]   |
| modelo usado                        | capitalização, com a União diluída e nenhum acionista votando com mais de 10%                                                                 | VERIFICADO: Lei 14.182, art. 3º                   |
| Eletrobras, a volta parcial         | ADI 7385 em 2023; acordo em abril de 2025; STF homologa em 11/12/2025. A União, com 42% das ordinárias, indica 3 dos 10 conselheiros          | VERIFICADO: [STF][stf-eletro]                     |
| BR Distribuidora, perda do controle | oferta precificada em 23/07/2019 a R$ 24,50 por ação, 349,5 milhões de ações (R$ 8,56 bilhões); com o lote extra, a Petrobras cai a 37,5%     | VERIFICADO: [6-K de 24/07/2019][br6k]             |
| RLAM, venda de refinaria            | contrato em 24/03/2021 (US$ 1,65 bilhão); CADE em 09/06/2021; fechamento em 30/11/2021 (US$ 1,8 bilhão). São 8 meses                          | **PARCIAL**: 6-K da SEC fora do ar na conferência |

## 5. Episódios para calibrar (pesquisa 5)

**Greve dos caminhoneiros, 2018:**

- a indústria caiu 10,9% em maio e subiu 12,5% em junho (mês contra mês, com ajuste sazonal;
  [IBGE, tabela 8888][sidra-pim]);
- o IPCA foi de 0,40% em maio, 1,26% em junho e 0,33% em julho ([IBGE, tabela 1737][sidra]);
- a [MP 838][mp838], de 30/05/2018, subvencionou o diesel em até R$ 0,30 por litro até 31/12/2018 e
  virou a Lei 13.723/2018;
- a data de início da greve ainda não foi conferida em fonte oficial (**FALTA**).

**O choque de 2026:**

| data       | medida                                                                                                                                                                 | fonte                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 12/03/2026 | MP 1.340: diesel com R$ 0,32 por litro até 31/12/2026, e imposto de exportação sobre o diesel                                                                          | VERIFICADO: [Planalto][mp1340]              |
| 13/05/2026 | MP 1.358: gasolina com subvenção igual aos tributos federais, por 2 meses prorrogáveis; custo por conta da ANP, "observada a disponibilidade orçamentária"             | VERIFICADO: [Planalto][mp1358]              |
| 28/05/2026 | a Petrobras sobe a gasolina A em R$ 0,48 e dá R$ 0,44 de desconto pela subvenção; a distribuidora paga R$ 0,04 a mais                                                  | VERIFICADO: [Petrobras][ag-gas]             |
| 30/05/2026 | MP 1.363: diesel com R$ 1,12 por litro, de 01/06 a 31/12/2026                                                                                                          | VERIFICADO: [Planalto][mp1363]              |
| 04/09/2026 | MP 1.389: crédito extraordinário de R$ 6,605 bilhões (R$ 0,998 bilhão para dois períodos da gasolina; R$ 5,607 bilhões para dois do diesel)                            | VERIFICADO: [exposição de motivos][exm1389] |
| 09/09/2026 | decreto corta o PIS/Cofins da gasolina em R$ 0,63 por litro e zera o do etanol até 09/10; nova MP do diesel com R$ 1,00 por litro "enquanto persistir a instabilidade" | VERIFICADO: [Fazenda][faz-set]              |

Da mesma exposição de motivos: o Brasil importa cerca de 10% da gasolina e de 25% a 30% do diesel.

**A troca de política de preços, 2023:** o fim da paridade de importação e a entrada do "custo
alternativo do cliente" e do "valor marginal" estão no 20-F, VERIFICADO. A reação do mercado
naquele dia não tem fonte oficial (**FALTA**).

**Sem fonte oficial achada (FALTA):** o efeito da greve dos petroleiros de 2020 e o custo do
controle de preços de 2011 a 2014.

## 6. O que isso muda no corte

- **"Segurar o preço" vira três ferramentas reais.** São elas: mandar a empresa segurar o preço
  (discutível sem compensação, e o minoritário pode ir à Justiça e à CVM), pagar subvenção pelo
  Tesouro (MP e crédito extraordinário, com custo por litro vezes o volume) e cortar tributo por
  decreto (CIDE e PIS/Cofins, com receita perdida). Em 2026 o governo usou as duas últimas.
- **O primeiro mês do jogo já tem uma decisão real.** A subvenção de R$ 1,12 no diesel acaba em
  31/12/2026, e o E32 acaba no fim de janeiro de 2027 se não for prorrogado. Renovar custa
  dinheiro. Deixar acabar sobe o frete.
- **Vender o controle segue o molde da Eletrobras:** lei própria, capitalização, limite de voto e
  golden share, com 16 meses entre a MP e a oferta. E a reversão também tem molde: STF e acordo,
  sem retomar o controle.
- **O presidente da Enerbras** sai de uma lista que respeita o art. 17 da Lei 13.303.
- **Números para o catálogo:** ações e fatias, dividendos, dívida, investimento, empregados,
  refino, composição do preço e peso no IPCA, todos com data. O `reach` de 620 e o `initial` de
  62 da alavanca `petroleo-e-gas` se recalibram com eles, mas só com ordem.

[l9478]: https://www.planalto.gov.br/ccivil_03/leis/l9478.htm
[l9491]: https://www.planalto.gov.br/ccivil_03/leis/l9491.htm
[l13303]: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2016/lei/l13303.htm
[l6404]: https://www.planalto.gov.br/ccivil_03/leis/l6404consol.htm
[cf]: https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm
[adi5624]: https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=413384
[adi7331]: https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=536577
[estatuto]: https://www.sec.gov/Archives/edgar/data/1119639/000129281426002168/ex1-1.htm
[f20]: https://www.sec.gov/Archives/edgar/data/1119639/000129281426002168/pbrform20f_2025.htm
[precos]: https://precos.petrobras.com.br/precos-gasolina
[sintese]: https://www.gov.br/anp/pt-br/assuntos/precos-e-defesa-da-concorrencia/precos/arq-sintese-semanal/2026/sintese-precos-38.pdf
[sidra7060]: https://apisidra.ibge.gov.br/values/t/7060/n1/all/v/66/p/202608/c315/all
[l14182]: https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14182.htm
[mme-b3]: https://www.gov.br/mme/pt-br/assuntos/noticias/cerimonia-de-toque-de-campainha-na-b3-consolida-privatizacao-da-eletrobras
[stf-eletro]: https://noticias.stf.jus.br/postsnoticias/stf-homologa-acordo-sobre-participacao-da-uniao-na-eletrobras/
[br6k]: https://www.sec.gov/Archives/edgar/data/1119639/000156459019025769/pbr-6k_20190724.htm
[sidra]: https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/63/p/201804,201805,201806,201807
[sidra-pim]: https://apisidra.ibge.gov.br/values/t/8888/n1/all/v/11601/p/201804,201805,201806,201807/c544/129314
[mp838]: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/mpv/mpv838.htm
[mp1340]: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/mpv/mpv1340.htm
[mp1358]: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/mpv/mpv1358.htm
[mp1363]: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/mpv/mpv1363.htm
[ag-gas]: https://agencia.petrobras.com.br/w/negocio/petrobras-informa-sobre-ajuste-nos-pre%C3%A7os-de-gasolina%C2%A0
[exm1389]: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/exm/exm-mp-1389-26.pdf
[faz-set]: https://www.gov.br/fazenda/pt-br/assuntos/noticias/2026/setembro/governo-federal-adota-novas-medidas-para-combustiveis-frente-a-oscilacoes-do-petroleo
