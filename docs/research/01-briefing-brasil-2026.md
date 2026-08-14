# Briefing de pesquisa 01 — o Brasil de 2026

> Para pesquisa externa. O que volta daqui vira **catálogo de dados** do simulador
> (`src/data/`), e cada número tem um endereço já definido no código. Escrito na
> sexta sessão, 13/08/2026.

## Como responder

Isto não é um pedido de texto — é um pedido de **tabela preenchível**. Para cada
número:

| campo        | exigência                                                            |
| ------------ | -------------------------------------------------------------------- |
| **valor**    | com unidade explícita (R$ bi/ano, % do PIB, % da RCL, cadeiras)      |
| **ano-base** | 2026 sempre que existir; se for 2025 ou LOA 2026, dizer qual         |
| **fonte**    | órgão e documento (LOA, STN, IBGE, BCB, Tesouro, Câmara)             |
| **disputa**  | se há divergência relevante entre fontes, dar a faixa e quem diverge |

**Prefira faixa a falso precisão.** "Entre 45 e 55 bi, dependendo se inclui X" é
uma resposta melhor que "50 bi" sem qualificação. O simulador tolera faixa; ele
não tolera número inventado com cara de exato.

**Onde não houver dado público, diga que não há.** Ausência declarada é
utilizável; preenchimento otimista contamina o modelo inteiro e o defeito aparece
três telas depois da causa.

---

## Bloco 0 — a pergunta de postura (responder primeiro)

Hoje todo arquivo de dados do projeto carrega o aviso: _"ficção com inspiração na
realidade; nenhum número aqui cita fonte porque nenhum é afirmação sobre o
Brasil"_. Usar números reais **inverte essa postura**.

- Existe risco jurídico ou reputacional relevante em um simulador que use valores
  orçamentários reais, citados e datados, para um país e um governo existentes?
- Como jogos comparáveis (Democracy 4, Power & Revolution / Geopolitical
  Simulator) tratam isso — usam dados reais, e com que ressalva?

---

## Bloco 1 — o preço de um voto (PRIORIDADE MÁXIMA)

Este bloco define `seatPrice`, que é **o número mais importante do jogo**: ele é o
câmbio entre dinheiro e voto, e é ele que decide se comprar o Congresso custa uma
saúde inteira ou um troco.

1. **Emendas parlamentares 2026** — valor total autorizado, separado por tipo:
   individuais (RP6), de bancada estadual (RP7), de comissão (RP8) e de relator
   (RP9, se ainda existir). Quanto é **impositivo** e quanto o Executivo ainda
   consegue represar?
2. **Por parlamentar** — qual o valor da emenda individual de um deputado em 2026?
   E de um senador?
3. **O que mudou depois das decisões do STF de 2024/2025** sobre rastreabilidade e
   transparência das emendas — o Executivo perdeu ou manteve poder de barganha?
4. **Cargos como moeda** — quantos cargos de livre nomeação (DAS/FCPE) existem no
   Executivo federal, quantos são efetivamente loteados a partidos, e existe
   alguma estimativa pública do "valor" de um ministério ou de uma diretoria de
   estatal numa negociação?
5. **Existe estimativa acadêmica ou jornalística** do custo médio, em reais de
   emenda, para converter um voto na Câmara? Qualquer estudo de economia política
   brasileira que tenha tentado medir isso.

---

## Bloco 2 — o orçamento, e o que dele é intocável (PRIORIDADE MÁXIMA)

Este bloco vira `src/data/programs.mjs` e é o coração da mecânica nova: cada
programa tem um **piso legal** e um **teto**, e o jogador só cruza esses limites
por lei ou por emenda constitucional. Preciso saber **onde estão as paredes**.

6. **Receita e despesa da União em 2026** — receita primária total, despesa
   primária total, obrigatória, discricionária, e quanto do "discricionário"
   sobra de fato depois das emendas impositivas e do custeio inadiável.
7. **Composição da despesa obrigatória**, em R$ bi/ano, item a item: RGPS urbano e
   rural, RPPS, pessoal ativo, inativos e pensionistas, BPC/LOAS, abono salarial,
   seguro-desemprego, complementação da União ao FUNDEB, piso da saúde, sentenças
   judiciais e precatórios, subsídios e subvenções.
8. **Para cada item acima: o que é o piso, juridicamente?** Constituição, lei
   complementar, lei ordinária ou decisão administrativa? **Esta é a pergunta que
   mais importa** — ela define quais movimentos exigem PEC (308 votos), quais
   exigem lei (257) e quais o presidente faz de caneta.
9. **As vinculações constitucionais** — saúde (15% da RCL) e educação (18% da
   receita de impostos): valores em 2026, e o que exatamente entra na base de
   cálculo.
10. **O arcabouço fiscal (LC 200/2023)** — a banda de crescimento real da despesa
    (mínimo e máximo), o percentual do crescimento da receita, a meta de resultado
    primário de 2026 e 2027, e **os gatilhos** que disparam quando a meta não é
    cumprida.
11. **Precatórios** — regime atual depois das mudanças de 2021–2025, valor de 2026,
    e se ainda estão dentro ou fora do limite de despesa.

---

## Bloco 3 — os ministérios, programa a programa (PRIORIDADE ALTA)

Para **cada** área abaixo: orçamento total 2026 e as **cinco a seis maiores ações
orçamentárias**, com valor em R$ bi/ano, indicador físico (leitos, alunos,
famílias, efetivo) e a natureza jurídica do piso.

12. **Saúde** — Atenção Primária/PAB, Média e Alta Complexidade (MAC), Farmácia
    Popular, SAMU, Programa Nacional de Imunizações, Mais Médicos, e o custo da
    judicialização da saúde.
13. **Educação** — complementação da União ao FUNDEB, PNAE (alimentação), PNATE
    (transporte), universidades federais (custeio e pessoal separados), institutos
    federais, FIES e PROUNI, Pé-de-Meia, piso do magistério.
14. **Previdência e Assistência** — RGPS por clientela, BPC (valor e número de
    beneficiários), benefícios por incapacidade, Bolsa Família (custo anual, nº de
    famílias, valor médio), e a regra de reajuste do salário mínimo em vigor.
15. **Segurança** — Fundo Nacional de Segurança Pública, PF, PRF, sistema
    prisional federal, e o status da PEC da Segurança Pública.
16. **Produção e infraestrutura** — Novo PAC (valor e execução real), desembolsos
    do BNDES, Plano Safra (volume e subsídio equalizado), desonerações e renúncias
    fiscais por setor.
17. **Defesa** — orçamento total, quanto é pessoal e inativo, quanto é
    investimento, e os programas estratégicos (submarino, Gripen, Astros).

**Para cada ação, a pergunta que se repete:** quanto dela um presidente consegue
cortar sozinho, e quanto exige mudar a lei?

---

## Bloco 4 — os tributos (PRIORIDADE ALTA)

Vira a área **Economia**, onde cada alíquota é um controle contínuo.

18. **Arrecadação federal 2026 por tributo**, em R$ bi/ano: IRPF, IRPJ, CSLL,
    PIS/COFINS, IPI, IOF, contribuição previdenciária patronal e do trabalhador,
    Imposto de Importação, CIDE.
19. **Alíquotas vigentes e suas faixas legais** — o que o Executivo altera por
    decreto (IOF, IPI, II têm exceção à anterioridade?) e o que exige lei.
20. **Reforma tributária (EC 132/2023)** — cronograma de transição CBS/IBS ano a
    ano até 2033, alíquota de referência estimada, o que já vale em 2026, o
    Imposto Seletivo, o cashback e a cesta básica.
21. **Isenção do IR até R$ 5 mil e a tributação de altas rendas** — status legal
    em 2026, custo da renúncia e receita esperada da compensação.
22. **Carga tributária bruta total** (% do PIB) e a divisão federal / estadual /
    municipal.
23. **Elasticidades** — existe estimativa brasileira para: quanto o PIB responde a
    1 p.p. de aumento da carga tributária; multiplicador fiscal do investimento
    público **versus** transferência de renda; e a relação de Okun (quanto de
    desemprego por ponto de PIB)?

---

## Bloco 5 — o Congresso, e uma correção que o jogo talvez precise (PRIORIDADE ALTA)

Hoje o simulador tem **só a Câmara** e usa 257 votos como quórum de lei ordinária.
Desconfio que isso está tecnicamente errado, e preciso confirmar antes de decidir
se corrijo ou se declaro a simplificação.

24. **Confirmar os quóruns reais**: lei ordinária (maioria dos presentes com
    quórum mínimo de 257 presentes?), lei complementar (257 votos?), PEC (308 em
    dois turnos na Câmara **e** 49 em dois turnos no Senado?), derrubada de veto
    (257 + 41 em sessão conjunta?), medida provisória (prazo, trancamento de
    pauta, comissão mista).
25. **Composição da Câmara em 2026** — cadeiras por partido, e o agrupamento em
    blocos que a imprensa e a ciência política efetivamente usam. Se houver uma
    métrica publicada de posicionamento ideológico dos partidos brasileiros (tipo
    Bolsa de Valores Políticos, survey de especialistas, ou análise de votações
    nominais), ela vale ouro.
26. **O Senado** — composição, e **o quanto ele efetivamente barra**. Preciso
    decidir se ele entra no modelo ou se fica declarado como ausente; um dado sobre
    frequência de rejeição no Senado ajuda a decidir.
27. **Impeachment** — rito completo, quóruns (342 na Câmara para admitir? 54 no
    Senado para condenar?), prazos, e quem controla a pauta (o poder do presidente
    da Câmara sobre o pedido).
28. **Taxa histórica de aprovação** — que percentual das proposições do Executivo
    o Congresso aprova, em governos de coalizão ampla versus governos minoritários?
    Isso calibra diretamente o defeito medido no jogo (26 votações, 26 aprovações).

---

## Bloco 6 — macroeconomia (PRIORIDADE MÉDIA)

Vira o motor **CORRENTE**.

29. **PIB nominal 2026** (R$ tri), crescimento real, PIB per capita, e população
    com projeção de crescimento até 2030.
30. **Selic** — nível atual e trajetória esperada; **meta de inflação** e o regime
    (contínua desde 2025?); IPCA corrente e projeções Focus.
31. **Dívida bruta e líquida** em % do PIB, **custo médio de carregamento**, e o
    **perfil**: quanto é prefixado, indexado à Selic, ao IPCA e ao câmbio. O
    percentual atrelado à Selic é crucial — é ele que faz juro alto virar dívida.
32. **Mercado de trabalho** — desemprego (PNAD Contínua), taxa de participação,
    informalidade, e massa salarial.
33. **Regra de reação do Banco Central** — existe estimativa publicada de uma
    função de reação (tipo Taylor) para o BCB, com os coeficientes?
34. **Autonomia do BC (LC 179/2021)** — confirmar se é lei complementar (e portanto
    mudável com 257 votos) ou se exige PEC. Mandatos do presidente e diretores.

---

## Bloco 7 — estatais, propriedade e poder (PRIORIDADE MÉDIA)

Vira o catálogo de **alavancas de regra**: privatizar, estatizar, regular,
concentrar poder.

35. **As maiores estatais federais** — receita, lucro, dividendos pagos à União,
    número de empregados e valor de mercado: Petrobras, Banco do Brasil, Caixa,
    Correios, EMBRAPA, EPE, e as remanescentes.
36. **O que é preciso, juridicamente, para privatizar cada tipo** — autorização
    legislativa específica, lei geral de desestatização, ou decisão do Executivo?
    O que a Constituição protege explicitamente?
37. **Os poderes do Executivo sem o Congresso** — medida provisória (limites
    materiais), decreto autônomo (art. 84), contingenciamento, veto, indicação ao
    STF e a agências, e nomeações em geral.
38. **As cláusulas pétreas** (art. 60 §4º) — o que exatamente não pode ser objeto de
    emenda, e qual é o precedente do STF sobre tentar.
39. **Forças Armadas** — efetivo, orçamento e, mais importante: existe **algum
    indicador público** que sirva de proxy para "alinhamento das Forças Armadas ao
    governo"? Se não existe, diga — vou modelar como estado interno e declarar a
    ausência.
40. **Tensão institucional** — existe índice publicado (V-Dem, Freedom House,
    Economist Democracy Index, ou algum brasileiro) que meça erosão democrática e
    que possa servir de escala calibrada em vez de eu inventar uma de 0 a 100?

---

## Bloco 8 — o que faz um governo cair (PRIORIDADE MÉDIA)

41. **Os dois impeachments brasileiros** — em Collor e Dilma, quais foram os
    indicadores no mês da abertura do processo: aprovação popular, tamanho da base
    na Câmara, inflação, desemprego? São os dois únicos pontos calibrados que
    existem, e valem mais que qualquer teoria.
42. **Aprovação presidencial** — série histórica de Datafolha/Quaest por governo, e
    quais indicadores econômicos ela historicamente segue com que defasagem
    (inflação de alimentos? desemprego? renda?).
43. **Segmentação da opinião** — como os institutos cortam a população (renda,
    escolaridade, região, religião), e existe medida de como cada segmento reage a
    política específica?
