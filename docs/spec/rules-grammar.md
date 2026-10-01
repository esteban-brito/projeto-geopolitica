# A gramática das regras

> Versão 2, 25/09/2026. Pedido dele: juntar realismo, diversão e padronização num país com leis
> demais. Detalha a [especificação mestra](master-spec.md) §1.2, §12, §13, §16 e §22, com os nomes
> dela. Fatos da [pesquisa 14](../research/14-the-state-energy-company.md). Marcas da
> especificação: **[VERIFICADO]**, **[VERIFICAR]**, **[HIPÓTESE]** e **[DESENHO]**. Nas
> pesquisas, **PARCIAL** é fonte oficial conhecida e não lida, e **FALTA** é sem fonte achada.

## A regra de ouro

A fórmula da especificação é "realismo no motor; poder, conflito, pessoas e consequências na
superfície" (§1.2). Na tela ela vira isto: **o jogador nunca lê uma lei.** Cada escolha mostra
três linhas: **quanto custa, quem reage e quanto tempo leva.** O artigo só aparece a quem o
pedir.

Toda mudança no país se escreve com as mesmas sete peças: ação, rota, avaliação, portão, ficha,
efeito e ciclo. Cada peça tem um nome na especificação, e a gramática não inventa outro.

## 1. A ação: o que o jogador pede

A ação é o verbo do vocabulário canônico (§12.5), aplicado a um objeto (§12.6). Exemplos do
corte da estatal:

| ação                               | exemplo real                                                |
| ---------------------------------- | ----------------------------------------------------------- |
| `SELL_STAKE`                       | BR Distribuidora: a Petrobras caiu a 37,5% em 2019          |
| `RELINQUISH_CONTROL` e `PRIVATIZE` | Eletrobras, 2022                                            |
| `ACQUIRE_STAKE` e `NATIONALIZE`    | recomprar uma distribuidora; nacionalizar um banco          |
| `DIRECT_ENTERPRISE` (novo)         | a política de preços da estatal                             |
| `SUBSIDIZE`                        | R$ 1,12 por litro de diesel (MP 1.363/2026)                 |
| `SET_TAX_RATE`                     | PIS/Cofins da gasolina R$ 0,63 menor por litro (09/09/2026) |
| `APPOINT`                          | o presidente da estatal, dentro do art. 17 da Lei 13.303    |

**Ação e mecanismo são dois níveis, e não dois nomes.** A ação é o que o jogador pede. O
mecanismo é como o motor executa a norma: o `kind` da cláusula na ESTRATO, que a
[pesquisa 07](../research/07-the-law-the-player-writes.md) mapeou em 33 propostas reais.

| mecanismo (`kind`) | ações que ele executa                                     | no motor hoje |
| ------------------ | --------------------------------------------------------- | ------------- |
| `band`             | `SET_LIMIT` sobre o gasto de um programa                  | roda          |
| `spend`            | `ALLOCATE`, `CUT_ALLOCATION`, `SUBSIDIZE`, `TRANSFER`     | quase         |
| `tax`              | `TAX`, `SET_TAX_RATE`                                     | canal morto   |
| `power`            | `CENTRALIZE`, `DECENTRALIZE`, `DECLARE_STATE_OF_DEFENSE`  | meio existe   |
| `condition`        | `REQUIRE` com condição                                    | não existe    |
| `body`             | `CREATE` e `ABOLISH` de órgão                             | não existe    |
| `status`           | `MERGE` e `SPLIT` de entes                                | não existe    |
| `own` (novo)       | `ACQUIRE_STAKE`, `SELL_STAKE`, `NATIONALIZE`, `PRIVATIZE` | não existe    |
| `direct` (novo)    | `DIRECT_ENTERPRISE`                                       | não existe    |

`own` também dá lugar à reserva de Bitcoin, que a pesquisa 07 deixou sem mecanismo. Uma ação ou
um mecanismo novo só entram quando uma proposta real não cabe nos que existem (§12.5).

## 2. A rota: com que instrumento

A rota é o `route.kind` do resolvedor (§13.5). A tabela dá as propriedades padronizadas de cada
uma, conferidas na Constituição em 25/09/2026.

| rota (`route.kind`)                  | quem decide                      | votos                                              | relógio do rito                                                               | quem desfaz                                            | fonte                                      |
| ------------------------------------ | -------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------ |
| `OTHER_INSTITUTION`: ato de gestão   | conselho ou diretoria da estatal | a União elege a maioria do conselho                | vale no mês seguinte **[DESENHO]**                                            | o próximo conselho                                     | [VERIFICADO] Lei 6.404, arts. 116 e 238    |
| `DIRECT_ACT` e `REGULATION`: decreto | Presidente                       | nenhum                                             | vale na hora                                                                  | outro decreto; o Congresso pode sustar o que exorbitar | [VERIFICADO] CF, arts. 84 IV e VI e 49 V   |
| `PROVISIONAL_MEASURE`                | Presidente, e depois o Congresso | nenhum para valer; maioria para virar lei          | 60 dias, mais 60; o prazo para no recesso; aos 45 dias tranca a pauta da Casa | cai se não for votada                                  | [VERIFICADO] CF, art. 62 §§3º, 4º, 6º e 7º |
| `ORDINARY_LAW`                       | Congresso, com sanção            | maioria dos votos, com a maioria absoluta presente | com urgência do Presidente, 45 dias em cada Casa, depois tranca a pauta       | outra lei                                              | [VERIFICADO] CF, arts. 47 e 64             |
| `COMPLEMENTARY_LAW`                  | Congresso, com sanção            | maioria absoluta                                   | —                                                                             | outra lei complementar                                 | [VERIFICADO] CF, art. 69                   |
| `CONSTITUTIONAL_AMENDMENT`           | Congresso, sem sanção            | três quintos, em dois turnos, em cada Casa         | —                                                                             | outra emenda                                           | [VERIFICADO] CF, art. 60                   |
| `OUTSIDE_CURRENT_ORDER`              | quem tiver força                 | —                                                  | —                                                                             | quem tiver mais força                                  | especificação §17.5                        |

- **O veto** cai com maioria absoluta de deputados e senadores, em sessão conjunta (CF, art. 66
  §4º, [VERIFICADO]).
- **O sobrestamento por MP não bloqueia toda matéria.** Na Câmara, alcança matérias passíveis
  de MP; PEC, lei complementar e outras matérias excluídas têm tratamento próprio. Fonte primária
  conferida em 29/09: [STF, MS 27.931](https://noticias.stf.jus.br/postsnoticias/stf-decide-que-trancamento-de-pauta-da-camara-por-mps-nao-alcanca-todos-os-projetos-e-propostas/),
  julgamento de 29/06/2017. O consumidor precisa distinguir matéria, Casa e sessão.
- **A medida provisória não pode tratar de** partido e eleição, direito penal, orçamento (salvo
  crédito extraordinário), retenção de bens ou de poupança, nem do que exige lei complementar
  (CF, art. 62 §1º, [VERIFICADO]). As subvenções de 2026 foram pagas por crédito extraordinário
  aberto por medida provisória.
- **Nenhuma emenda pode abolir** a federação, o voto direto e secreto, a separação dos Poderes e os
  direitos individuais. A República não está na lista (CF, art. 60 §4º, [VERIFICADO]).
- **O relógio do rito é o limite, e não o tempo real.** A Eletrobras levou 16 meses da medida
  provisória à oferta. O tempo real sai do Congresso simulado e dos portões.
- **Legado a substituir, não regra institucional nova:** `POWER_STEPS` rebaixa o rito a 60 e
  85 de poder no motor atual. A barra não demonstra mudança de competência ou Constituição.
  A migração deve distinguir rota jurídica e cumprimento de uma tentativa fora da competência;
  ver a [auditoria dos planos](../archive/plan-audit-2026-09-29.md), P07. Não alterar os coeficientes para ocultar isso.
- **O motor hoje tem três rotas:** decreto, lei e emenda (`src/data/bills.mjs`). A guarda da
  ESTRATO tem `none`, `law` e `constitution`. Faltam o ato de gestão, a medida provisória e a lei
  complementar.

## 3. A avaliação: discutível, bloqueado, fora da ordem

Nada tem muro (§1.3). A avaliação (`assessment`, §13.5) diz o que acontece com a tentativa:

- **`CONTESTED`, discutível:** o ato vale, mas quem tem legitimidade pode derrubá-lo. Quem vai à
  Justiça decide pela VONTADE (§15.1);
- **`BLOCKED`, bloqueado:** a ordem vigente não deixa aquela rota chegar ao efeito;
- **`EXTRALEGAL_ATTEMPT`, fora da ordem:** o Presidente assina assim mesmo. O ato existe como
  tentativa, e o efeito depende de quem obedece. Com as instituições de pé, o esperado é o efeito
  não acontecer.

| tentativa                                     | avaliação                                        | por quê                                |
| --------------------------------------------- | ------------------------------------------------ | -------------------------------------- |
| decreto que vende o controle da Petrobras     | `BLOCKED`; assinar assim mesmo é fora da ordem   | Lei 9.478, art. 62; STF, ADI 5624      |
| vender uma subsidiária sem disputa            | `CONTESTED`                                      | STF, ADI 5624                          |
| nomear um dirigente de partido para a estatal | `CONTESTED`                                      | Lei 13.303, art. 17; STF, ADI 7331     |
| mandar a estatal segurar preço sem compensar  | `CONTESTED`: o minoritário vai à Justiça e à CVM | estatuto, art. 3º; Lei 6.404, art. 117 |
| reter a poupança por medida provisória        | `CONTESTED`, com derrubada provável              | CF, art. 62 §1º II                     |

## 4. O portão: a burocracia vira tempo e risco

TCU, CADE, CVM, licitação e STF não ganham tela. Cada um é um portão com a mesma forma: **quem
decide, quanto demora, qual a chance e quem pode acioná-lo.** O controle judicial segue a
especificação §15: precisa de um ator legitimado, que decide agir pela VONTADE. A tela diz uma
linha, por exemplo "o TCU precisa aprovar; costuma levar meses".

| portão | caso real                                                                                               | o que calibra   |
| ------ | ------------------------------------------------------------------------------------------------------- | --------------- |
| TCU    | Eletrobras: lei em 12/07/2021, aprovação do TCU em 18/05/2022                                           | 10 meses        |
| CADE   | refinaria RLAM: contrato em 24/03/2021, aprovação do CADE em 09/06/2021 (PARCIAL)                       | 2 meses e meio  |
| STF    | ADI 7385, contra o limite de voto da União na Eletrobras: ação em 2023, acordo homologado em 11/12/2025 | cerca de 2 anos |

A chance de cada portão ainda não tem série de casos (FALTA). Até ter, ela é [DESENHO] e aparece
como estimativa da assessoria, que pode errar.

## 5. A ficha: uma forma por tipo de objeto

Toda coisa do mesmo tipo tem a mesma ficha, como no Football Manager, onde todo jogador do mundo
tem os mesmos atributos. Pesquisa-se uma vez por tipo, e cada caso só troca o número.

- **Estatal:** é o `company` da especificação (§16.5), com os campos de estatal. A ficha da
  Petrobras (pesquisa 14, §2) serve depois para Banco do Brasil, Caixa e Correios.
- **Pessoa ou organização:** é o ator da especificação (§9), que decide pela VONTADE com o que
  sabe. No corte: o presidente da estatal, o sindicato, o governador, os caminhoneiros, os
  minoritários e o relator.

## 6. O efeito: cinco canais, três horizontes

Toda ação declara o que muda em cinco canais. A tela junta os cinco nas três linhas da regra de
ouro, e os três horizontes da especificação (§5.4) dizem quando cada um chega.

| canal        | o que mede                      | exemplo real                                                               | linha na tela |
| ------------ | ------------------------------- | -------------------------------------------------------------------------- | ------------- |
| dinheiro     | uma vez ou todo mês             | R$ 6,605 bilhões de crédito extraordinário para as subvenções de 2026      | quanto custa  |
| preço        | pelo peso no IPCA               | a gasolina pesa 5,14%; R$ 0,10 a mais na refinaria dão cerca de 0,05 ponto | quanto custa  |
| pessoas      | quem perde e o que pode acionar | o minoritário na Justiça; o sindicato em greve                             | quem reage    |
| tempo        | quando o efeito chega           | a medida provisória vale na hora; a venda leva meses                       | quanto tempo  |
| durabilidade | quem desfaz, e a que custo      | a política de preços muda no próximo conselho; a emenda pede três quintos  | quanto tempo  |

## 7. O ciclo: querer não é conseguir

O ciclo de vida da iniciativa (§13.7) é a cadeia do [jogo em uma página](game-in-one-page.md):
`DRAFT` → `PROPOSED` → `IN_PROCESS` → `APPROVED` → `FORMALIZED` → `IN_FORCE` → `EXECUTING` →
`IMPLEMENTED` → `CONSOLIDATED`. Cada rota pula as fases que não tem. A medida provisória chega a
`IN_FORCE` antes de `APPROVED`. Consolidado não é irreversível: a Eletrobras privatizada voltou a
ter 3 conselheiros indicados pela União.

## As três camadas de fidelidade

Estendem a regra de pesquisa da especificação (§22.1), e impedem que a pesquisa seja infinita.

- **A. O que o jogador toca** (ação, rota, votos, relógio do rito): fonte oficial obrigatória, com
  link. Marca [VERIFICADO].
- **B. O efeito agregado** (inflação, mercado, portões): calibrado em episódio real com data, como
  a greve de 2018 e o choque de 2026.
- **C. O resto:** [DESENHO], declarado como tal, ou ausente.

Não modelamos 10 mil leis (§13.4). Modelamos as ações do §12.5, sete rotas, poucos portões e uma
ficha por tipo.

## Como aparece na tela

- A assessora fala uma linha: "Vender o controle precisa de lei. Uns 16 meses."
- Cada escolha mostra três linhas: quanto custa, quem reage e quanto tempo leva.
- O artigo abre sob demanda, dentro do detalhe. Nunca em pop-up.
- A rota bloqueada aparece como risco, nunca como botão apagado.

## A prova: jogadas opostas na mesma gramática

Nenhuma jogada tem código próprio (§24). A ideologia sai da combinação, e é descrita no fim
(§17), nunca escolhida.

| jogada                                     | peças                                                                                                                                                                                                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ancap:** vender a Petrobras              | uma lei ordinária muda o art. 62 da Lei 9.478 e o art. 3º da Lei 9.491, e a Petrobras entra no PND. Se a autorização genérica bastar para a empresa-mãe ([VERIFICAR]), as vendas seguintes saem por decreto, com licitação. É o atalho que o jogador descobre |
| **estatista:** recomprar e blindar         | `ACQUIRE_STAKE` numa distribuidora (a autorização em lei: [VERIFICAR]) e uma emenda que só deixa vender por outra emenda. Blindar é subir a rota de uma venda futura; o ancap faz o inverso                                                                   |
| **comunista:** nacionalizar os bancos      | `NATIONALIZE` é desapropriação, com indenização justa, prévia e em dinheiro (CF, art. 5º XXIV, [VERIFICADO]). Custa o valor das empresas. Quem não quer pagar sai da ordem                                                                                    |
| **monarquista:** trocar a forma de governo | emenda: a República não está entre o que emenda nenhuma pode abolir, e a Constituição de 1988 já previu um plebiscito entre república e monarquia (CF, art. 60 §4º; ADCT, art. 2º; [VERIFICADO])                                                              |
| **presidente comum:** montar o governo     | `APPOINT` de ministros de outros partidos, para ter votos. Cada pasta dada é uma pasta que não serve ao seu projeto, e o maior bloco do jogo tem 145 das 513 cadeiras                                                                                         |

## O que existe e o que falta

- **Existe:** o mecanismo `band`; três rotas em `bills.mjs`; a guarda da ESTRATO; `POWER_STEPS`; a
  VONTADE para as pessoas; a inflação na CORRENTE; venda, dividendo e folha das estatais no fisco.
- **Falta, na ordem do plano:** os lotes E1 do [mapa de migração](migration-map.md), §6.4.

## Decidido em 25/09

Por ordem dele, valem as duas recomendações:

- **A rota fora da ordem fica fora do corte da estatal.** Ela existe na gramática e entra depois;
  a estatal já prova as outras seis rotas.
- ~~O primeiro mês do jogo abre com a decisão do subsídio do diesel.~~ Revogada no mesmo dia, por
  ordem dele: o internacional entra numa atualização futura, e o mundo lá fora fica parado até lá.
  O jogo abre com o jogador montando o governo, decisão dele ([corte vertical](vertical-slice-energy.md), §2).
