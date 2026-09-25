# Arquitetura Institucional e Governança do Brasil Real

> **Rascunho de pesquisa do Gemini — não validado como referência factual**  
> **Status:** Entregue; triagem rápida do Codex realizada; revisão de fontes pendente  
> **Data de Referência:** 23/09/2026  
> **Autoridade:** Pesquisa autorizada pelo usuário; coordenação do Codex não equivale a aprovação do conteúdo  
> **Escopo:** Exclusivamente descritivo e analítico (`docs/research/13-real-brazil-institutions.md`). Sem alterações em código de domínio, telas, testes ou dados calibrados.

---

## Nota de triagem do Codex — 23/09/2026

A entrega organiza temas relevantes e três casos candidatos a estudo, mas não atende ainda
ao requisito de pesquisa profunda rastreável e atualizada. O texto recebido não contém URLs
de fontes, datas de consulta ou evidências suficientes para confirmar sua atualidade.
Referências bibliográficas e números de leis não provam que cada afirmação foi verificada.
O corpo abaixo permanece como registro da entrega, sujeito a correção; não incorporar suas
afirmações ao motor ou à calibragem antes da revisão.

- **Erro de código confirmado:** nas seções 2.3 e 10.1, a alegação de que `Program.yield`
  já existe no catálogo é incorreta. `src/data/programs.mjs` contém `weight` e `lag`;
  o rendimento atual pertence à área. Esta nota prevalece sobre essas passagens.
- **Design não aprovado:** ministro assegurar 40 votos, indicação política reduzir competência,
  cautelar automática, colapso inevitável e sanções imediatas contrariam a exigência de
  consequências condicionais e atores autônomos. São generalizações do autor, não regras aceitas.
- **Números sem sustentação suficiente:** percentuais orçamentários, popularidade abaixo de 20%,
  juros acima de 30% e prazos de obras/efeitos precisam de fonte, período e contexto; não calibrar
  o jogo com esses valores. Separar receita, despesa primária e orçamento total.
- **Revisão jurídica pendente:** conferir especialmente quadro de competências, hipóteses de
  perda de cargos, responsabilização dita automática, precatórios/intervenção, ritos e efeitos
  dos casos citados, organização administrativa e atualidade da jurisprudência sobre estatais.
- **Comparações internacionais pendentes:** verificar Argentina e Singapura em fontes próprias,
  inclusive as afirmações sobre poderes do CPIB; distinguir prática, lei e interpretação.
- **Retomada:** conferir fontes oficiais e casos, corrigir afirmações e só então aproveitar
  conclusões no plano. O usuário pediu encerrar por hoje; nenhum novo lote foi disparado.

---

## 1. Resumo Executivo

O sistema político e administrativo brasileiro é frequentemente sintetizado como um **presidencialismo de coalizão** (conceito cunhado por Sérgio Abranches em 1988) inserido em um arcabouço constitucional que combina prerrogativas imperiais de agenda para o Poder Executivo com contrapesos institucionais de extrema densidade e fragmentação partidária.

O Presidente da República no Brasil dispõe de instrumentos formais de indução legislativa e orçamentária entre os mais fortes das democracias contemporâneas (iniciativa exclusiva em leis orçamentárias e organização da administração pública, edição de medidas provisórias com força de lei imediata e poder de veto parcial ou total). No entanto, o exercício real desse poder é delimitado por três restrições estruturais:

1. **Hiperfragmentação Legislativa:** Nenhum partido elege mais do que 15% a 20% das cadeiras da Câmara dos Deputados desde a redemocratização. Qualquer maioria exige a articulação de blocos heterogêneos, distribuindo ministérios, cargos da administração indireta e emendas orçamentárias em troca de sustentação legislativa (_disciplina partidária negociada_).
2. **Rigidez Orçamentária e Fiscal Extrema:** Mais de 90% das receitas primárias da União estão vinculadas a despesas obrigatórias fixadas pela Constituição Federal de 1988 (CF/88) ou por legislação complementar (Previdência Social, folha de pessoal ativo e inativo, pisos constitucionais de Saúde e Educação, benefícios assistenciais e pagamento de precatórios). A margem discricionária real do Presidente para investimentos e novos programas situa-se entre 5% e 10% do orçamento federal.
3. **Judicialização Ampla e Controle Externo Permanente:** O Supremo Tribunal Federal (STF) atua como árbitro frequente das disputas entre Executivo e Legislativo, provocado por um rol amplíssimo de legitimados ativos (CF, art. 103), enquanto o Tribunal de Contas da União (TCU) e o Ministério Público Federal (MPF) exercem fiscalização prévia e concomitante que impõe limites severos à discricionariedade presidencial.

Portanto, **capacidade estatal no Brasil não é um duto direto de conversão financeira instantânea**. Gastar recursos não se traduz mecanicamente em entrega pública no mesmo mês. Cada intervenção do Executivo atravessa ritos de contratação pública (Lei nº 14.133/2021), licenças ambientais, repasses federativos descentralizados (SUS, Fundeb) e a inércia burocrática dos órgãos de execução.

Projetos de ruptura institucional ou inflexão sistêmica radical (sejam de viés libertário, estatizante/comunista, corporativista ou desenvolvimentista autoritário) não colidem apenas com vetos retóricos da oposição; colidem com travas constitucionais imutáveis (_cláusulas pétreas_), reações judiciais cautelares instantâneas, paralisação de transferências orçamentárias, risco soberano de dívida e eventual perda da sustentação política que deflagra o processo de impeachment.

---

## 2. Reexame Crítico da Revisão Anterior

Em análises preliminares elaboradas em rodadas anteriores do projeto, foram consolidadas premissas analíticas que se revelaram imprecisas ou simplificadoras diante da realidade institucional brasileira e da arquitetura do repositório. Este documento formaliza as seguintes correções:

### 2.1. A Falácia dos "37 Ministérios = 37 Telas"

A crítica anterior sustentou que acomodar a realidade do Executivo federal exigiria modelar 37 ou 38 telas ou botões no menu do simulador. Isso confunde **entidade institucional** com **camada de apresentação e abstração sistêmica**:

- A Lei nº 14.600/2023, em seus arts. 17 e 18, distingue expressamente os **Ministérios** em sentido estrito dos órgãos da Presidência da República cujos titulares detêm a **prerrogativa e o status de Ministro de Estado** (Casa Civil, Secretaria de Relações Institucionais, Secretaria de Comunicação Social, Gabinete de Segurança Institucional, Advocacia-Geral da União e Controladoria-Geral da União).
- Na prática de governo, o Planalto opera através de um núcleo duro de coordenação política e econômica (_colegiado central_) e ministérios setoriais agrupados por áreas de política pública.
- Para o simulador, a representação de ministérios não impõe proliferação inútil de interfaces no dock. Trata-se de associar figuras de autoridade, lealdade partidária, competência técnica e atribuições funcionais às pastas, cujas ações repercutem no fluxo orçamentário e de governabilidade, sem poluição da visão de comando do jogador.

### 2.2. O Status do Ciclo 29 e a Carta de Arquivamento (Achado 66)

A tese de que a introdução da "Carta de Arquivamento de Impeachment" (Achado 66) resolveria o fechamento do Ciclo 29 foi uma superestimação funcional:

- A Carta de Arquivamento é um evento de resolução narrativa para uma crise institucional aguda. Ela não supre as pendências de teste, poda de prosa e validações estruturais exigidas para o encerramento do Ciclo 29.
- O arquivamento de um pedido de impeachment no Brasil real é ato de soberania e discricionariedade política do Presidente da Câmara dos Deputados (com base na Lei nº 1.079/1950 e no Regimento Interno da Câmara), mas raramente encerra a pressão se a causa fiscal ou popular subjacente permanecer em deterioração.

### 2.3. O Descompasso do Modelo de Capacidade: Yield e Lag

Na revisão anterior, foi hipotetizado que os campos `weight` e `lag` já atuavam plenamente na equação mensal da malha:

- Uma inspeção direta em `src/domain/capacity/index.mjs` comprova que `capacity` calcula o índice de entrega multiplicando a verba agregada da área (`allocation[area.id]`) pelo rendimento da área (`area.yield`). `weight` e `lag` constam no catálogo estático (`src/data/programs.mjs`), mas não são calculados individualmente no fechamento mensal do domínio; não há `Program.yield` implementado.
- Portanto, defender que existia um delay mecânico calibrado de 1 a 12 meses era uma hipótese de design desejável, e não o comportamento comprovado do código executável.

### 2.4. A Natureza das Nomeações: Para Além do Mero "Fisiologismo"

A redução das nomeações ministeriais e cargos de confiança a mero clientelismo ou "toma lá, dá cá" corrompe a compreensão da gestão pública brasileira:

- Embora o loteamento político seja real para assegurar votos em plenário, ministérios carregam agendas corporativas, bases sindicais ou empresariais, representação territorial (bancadas estaduais) e corpos burocráticos próprios.
- A substituição de um ministro técnico ou de liderança setorial por um operador partidário sem qualificação frequentemente destrói a capacidade de execução orçamentária da pasta, gerando contingenciamentos forçados e escândalos de gestão que repercutem no TCU.

---

## 3. Rotina Presidencial e Governança do Planalto

### 3.1. A Agenda Real do Presidente

O cotidiano do Presidente da República no Palácio do Planalto é dominado por despachos de alinhamento com seu núcleo de governo, interlocuções federativas e gerenciamento permanente de crises:

- **Despachos Matinais com o Núcleo Duro:** Reuniões bilaterais ou trilaterais com a **Casa Civil** (coordenação dos ministérios e governança dos projetos estruturantes), a **Fazenda** (quadro fiscal, arrecadação, relação com mercado e Banco Central), a **Secretaria de Relações Institucionais - SRI** (contabilidade de votos no Congresso, atendimento a parlamentares e líderes partidários) e a **Secretaria de Comunicação Social - Secom** (pesquisas de opinião, gestão de narrativa e contenção de crises de imagem).
- **Despachos Jurídicos (SAJ/Casa Civil e AGU):** Análise e assinatura de atos normativos. Nenhum decreto, projeto de lei ou medida provisória sobe à mesa presidencial sem o crivo prévio da Subchefia de Assuntos Jurídicos (SAJ), que atesta a constitucionalidade e a adequação à técnica legislativa para evitar anulações judiciais imediatas pelo STF.
- **Audiências Institucionais e Federativas:** Reuniões com os Presidentes da Câmara e do Senado, ministros do STF, governadores de estado (especialmente em crises de segurança pública ou renegociação de dívidas estaduais) e lideranças de confederações empresariais (CNI, CNA, Febraban) e centrais sindicais.
- **Viagens e Eventos Públicos:** Entrega de obras, anúncios de crédito (ex.: Plano Safra) e solenidades militares, utilizadas como termômetro popular e projeção simbólica de liderança.

### 3.2. Os Filtros Técnicos, Políticos e Jurídicos do Planalto

```
                       +----------------------------------+
                       |     PRESIDENTE DA REPÚBLICA      |
                       +-----------------+----------------+
                                         |
         +-------------------------------+-------------------------------+
         |                               |                               |
+--------v---------+            +--------v---------+            +--------v---------+
|    CASA CIVIL    |            |       SRI        |            |       AGU        |
| - SAJ (Legal)    |            | - Articulação    |            | - Defesa Judicial|
| - Gestão/PAC     |            | - Emendas/Votos  |            | - Pareceres CF   |
+--------+---------+            +--------+---------+            +--------+---------+
         |                               |                               |
         +-------------------------------+-------------------------------+
                                         |
                                         v
                         +---------------+---------------+
                         |    PUBLICAÇÃO NO D.O.U. /     |
                         |   ENVIO AO CONGRESSO/STF      |
                         +-------------------------------+
```

- **Casa Civil da Presidência da República:** É o centro operacional da administração federal. Supervisiona a execução dos programas prioritários de governo, resolve disputas de competência entre ministérios setoriais e abriga a SAJ. Qualquer proposta de política pública que demande decreto ou projeto de lei é submetida ao crivo da SAJ quanto à conformidade com a CF/88, a Lei de Responsabilidade Fiscal (LRF) e a jurisprudência consolidada do STF.
- **Secretaria de Relações Institucionais (SRI):** Responsável pelo mapa de votos do Congresso. Monitora o comportamento das bancadas partidárias, administra a liberação e o empenho das emendas parlamentares e negocia indicações políticas em segundo e terceiro escalões (diretorias de estatais, superintendências regionais de órgãos como Incra, Codevasf, Dnit).
- **Advocacia-Geral da União (AGU):** Representa judicialmente o Presidente e a União em mandados de segurança, Ações Diretas de Inconstitucionalidade (ADIs) e litígios no STF, além de emitir pareceres vinculantes que pacificam interpretações de leis na administração direta.
- **Gabinete de Segurança Institucional (GSI):** Responsável pela proteção física presidencial, segurança cibernética e articulação básica de informações estratégicas de estado.

### 3.3. O Espectro do Poder Presidencial (Art. 84 da CF/88)

A autoridade presidencial no Brasil varia de um comando direto irrestrito até a impossibilidade jurídica formal:

| Grau de Autonomia                                                                 | Ações Correspondentes                                                                                                                                                                                                                                                                                                                                                                                                                                      | Limites e Contrapesos                                                                                                                                                                                                                                                              |
| :-------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Poder de Caneta Direto** _(Decisão unilateral por assinatura)_                  | - Edição de decretos regulamentares (art. 84, IV).<br>- Decretos de organização administrativa que não aumentem despesa nem criem órgãos (art. 84, VI - _decreto autônomo_).<br>- Nomeação e exoneração _ad nutum_ de Ministros de Estado e cargos comissionados livres.<br>- Veto total ou parcial a projetos de lei aprovados pelo Congresso (art. 66).<br>- Concessão de indulto e comutação de penas (art. 84, XII).                                   | - Decretos não podem inovar na ordem jurídica contra a lei (sujeitos a sustação pelo Congresso via PDL e controle do STF).<br>- Vetos presidenciais podem ser derrubados por maioria absoluta do Congresso.<br>- Indultos sofrem controle do STF em casos de desvio de finalidade. |
| **Iniciativa Privativa e Proposição** _(O Presidente propõe, o Congresso aprova)_ | - Envio do PPA, LDO e LOA (art. 165).<br>- Projetos de lei sobre criação de cargos, fixação de vencimentos e regime jurídico de servidores públicos (art. 61, § 1º).<br>- Edição de Medidas Provisórias com relevância e urgência (art. 62).<br>- Propostas de Emenda à Constituição (art. 60, II).                                                                                                                                                        | - MPs trancam pauta após 45 dias e perdem eficácia se não votadas em 120 dias (60 + 60).<br>- O Congresso pode alterar o texto original via Projeto de Lei de Conversão (PLV).<br>- PECs exigem aprovação por 3/5 em dois turnos na Câmara e no Senado.                            |
| **Poder Negociado** _(Depende de aprovação prévia do Senado)_                     | - Nomeação de Ministros do STF, Tribunais Superiores e Procurador-Geral da República (PGR).<br>- Nomeação de Diretores e Presidente do Banco Central.<br>- Nomeação de Diretores de Agências Reguladoras.<br>- Designação de Chefes de Missão Diplomática permanente.                                                                                                                                                                                      | - Sabatina e votação secreta na Comissão e no Plenário do Senado Federal.<br>- Risco real de rejeição se a base governista for minoritária ou indisciplinada.                                                                                                                      |
| **Poder de Indução e Influência Indireta**                                        | - Orientação de crédito de bancos públicos (BNDES, BB, Caixa).<br>- Sinalização de políticas de preços e investimentos em estatais mistas.<br>- Narrativa e priorização na comunicação pública.                                                                                                                                                                                                                                                            | - Lei das Estatais (Lei nº 13.303/2016) e governança de mercado (CVM, acionistas minoritários).<br>- Autonomia da autoridade monetária (BC).                                                                                                                                       |
| **Fora do Alcance Presidencial** _(Vedado pela Constituição)_                     | - Criar impostos ou aumentar alíquotas sem lei (salvo exceções regulatórias do art. 153: II, IE, IPI, IOF).<br>- Gastar verbas sem autorização orçamentária ou crédito extraordinário justificado.<br>- Demitir servidores públicos estáveis sem processo administrativo disciplinar.<br>- Demitir dirigentes de Agências Reguladoras e Banco Central durante o mandato legal fixo.<br>- Anular sentenças ou decisões judiciais do STF e outros tribunais. | - Nulidade absoluta do ato.<br>- Enquadramento automático em Crime de Responsabilidade (Lei nº 1.079/1950 e art. 85 da CF) ou Improbidade Administrativa.                                                                                                                          |

---

## 4. Ministérios, Autarquias, Agências Reguladoras e Estatais

A máquina administrativa brasileira divide-se formalmente entre **Administração Direta** e **Administração Indireta** (Decreto-Lei nº 200/1967):

```
+------------------------------------------------------------------------+
|                          PODER EXECUTIVO FEDERAL                       |
+-----------------------------------+------------------------------------+
                                    |
     +------------------------------+------------------------------+
     |                                                             |
+----v-------------------------+             +---------------------v-------------------------+
|     ADMINISTRAÇÃO DIRETA     |             |            ADMINISTRAÇÃO INDIRETA             |
+------------------------------+             +-----------------------------------------------+
| - Presidência e Secretarias  |             | - Autarquias (INSS, IBAMA, Banco Central*)    |
| - Ministérios Setoriais      |             | - Fundações Públicas (FUNAI, IBGE)            |
| - Subordinação hierárquica   |             | - Empresas Públicas (Caixa, Correios, BNDES)  |
|   e cargos demissíveis       |             | - Sociedades de Economia Mista (Petrobras, BB)|
|   ad nutum                   |             | - Agências Reguladoras (ANEEL, ANATEL, ANVISA)|
+------------------------------+             +-----------------------------------------------+
```

_\*Nota: O Banco Central adquiriu status autárquico especial com autonomia legal reforçada pela LC nº 179/2021._

### 4.1. Ministérios Setoriais e Dinâmica de Nomeação

- Os ministérios são extensões funcionais do Presidente da República. O titular da pasta comanda a formulação de diretrizes, assina portarias regulamentares, ordena despesas e supervisiona os órgãos vinculados.
- Na composição da Esplanada, o Presidente equilibra pastas estritamente partidárias (que trazem bancadas de deputados), pastas corporativo-temáticas (como Meio Ambiente, Direitos Humanos ou Povos Indígenas, que atendem à base militante e à sociedade civil) e pastas de sustentação econômica e de gestão (Fazenda, Planejamento, Gestão e Inovação).

### 4.2. Agências Reguladoras (Lei Geral das Agências - Lei nº 13.848/2019)

- As agências reguladoras (Anvisa, Anatel, Aneel, ANP, ANTT, ANS, Antaq, Ancine, ANA, ANM) possuem natureza de **autarquias de regime especial**.
- **Blindagem Institucional:** Seus conselheiros e diretores são nomeados pelo Presidente após aprovação pelo Senado, mas cumprem **mandatos fixos e não coincidentes** (em regra de 5 anos), sendo vedada a recondução.
- **Inamovibilidade Relativa:** Os diretores só perdem o cargo antes do término do mandato em virtude de renúncia, condenação judicial transitada em julgado ou processo administrativo disciplinar por falta grave. **O Presidente da República não pode demitir um diretor de agência por divergência técnica ou tarifária.**
- Decisões sobre reajustes de tarifas de energia, autorização de fármacos, regras de telecomunicações ou concessões de rodovias pertencem privativamente ao colegiado da agência, exigindo consulta pública e Análise de Impacto Regulatório (AIR).

### 4.3. Empresas Estatais e a Lei nº 13.303/2016

- As empresas estatais federais operam sob dois regimes: **Empresas Públicas** com capital 100% estatal (Caixa Econômica Federal, BNDES, Correios, Embrapa, Serpro) e **Sociedades de Economia Mista** com capital aberto listado em bolsa e controle acionário da União (Petrobras, Banco do Brasil).
- **A Lei das Estatais (Lei nº 13.303/2016):** Criada no pós-Operação Lava Jato, impôs severos critérios de governança:
  - Criação de Comitês de Elegibilidade e Auditoria.
  - Vedações expressas para cargos de direção estatutária a dirigentes partidários, ministros de estado e participantes ativos de campanhas eleitorais nos 36 meses anteriores (_quarentena_).
- **A Disputa da ADI 7331 (STF):** Em março de 2023, o ministro Ricardo Lewandowski concedeu medida cautelar suspendendo parte dos dispositivos que proibiam a indicação de lideranças políticas para diretorias e conselhos de estatais. Embora o plenário do STF tenha mantido em julgamento virtual a possibilidade de flexibilização cautelar, a nomeação continua submetida aos estatutos sociais de governança e à fiscalização da Comissão de Valores Mobiliários (CVM) e da Lei das S.A. (Lei nº 6.404/1976).
- **Responsabilidade Fiduciária:** Administradores de estatais de capital aberto respondem civil e criminalmente por atos contrários ao interesse da companhia em prol de interesses puramente eleitorais do controlador governamental (ex.: congelamento artificial de preços de combustíveis que gere prejuízo comprovado à estatal pode ensejar ações civis e denúncias na CVM).

---

## 5. Congresso Nacional e Poder Judiciário

### 5.1. O Bicameralismo Federativo

O Congresso Nacional é composto por duas casas com prerrogativas e dinâmicas eleitorais distintas:

1. **Câmara dos Deputados (513 deputados):** Representação proporcional populacional dos estados e do Distrito Federal (com piso de 8 e teto de 70 deputados por unidade da federação). Mandato de 4 anos. É a casa iniciadora da maioria dos projetos de lei e das emendas constitucionais, além de ser o juízo de admissibilidade para autorização de processos de impeachment presidencial (exigindo 2/3 dos votos, ou 342 votos).
2. **Senado Federal (81 senadores):** Representação paritária dos entes federativos (3 senadores por estado e DF, eleitos por maioria simples/dupla para mandatos de 8 anos, renovados alternadamente a cada 4 anos por 1/3 e 2/3). O Senado atua como câmara revisora das leis federais, mas detém competência privativa para:
   - Sabatinar e aprovar autoridades (STF, PGR, BC, Agências, Embaixadas).
   - Autorizar e fiscalizar o endividamento público de estados e municípios.
   - Processar e julgar o Presidente da República nos crimes de responsabilidade após autorização da Câmara.
   - Processar e julgar Ministros do STF em crimes de responsabilidade.

### 5.2. O Colégio de Líderes, Comissões e a Coalescência

- **Presidência da Câmara e do Senado:** Têm o poder soberano de pauta. O Presidente da Câmara define monocraticamente quando e se um projeto vai ao plenário, qual relator é designado e se denúncias de impeachment são admitidas ou engavetadas.
- **Colégio de Líderes:** Reunião semanal onde os líderes das bancadas partidárias e blocos parlamentares pactuam as votações da semana com o Presidente da Casa.
- **Comissão de Constituição e Justiça (CCJ):** Comissão temática mais poderosa; avalia a constitucionalidade e a técnica legislativa das matérias, podendo aprovar projetos em caráter conclusivo (sem necessidade de ida ao plenário).
- **Taxa de Coalescência (Octavio Amorim Neto):** Mensura o grau em que a distribuição de pastas ministeriais reflete exatamente a força proporcional dos partidos que compõem a bancada parlamentar governista. Quando a taxa de coalescência é baixa (o presidente privilegia seu partido íntimo e alija parceiros com muitos assentos), a disciplina partidária despenca, exigindo custos operacionais muito mais elevados de emendas orçamentárias e concessões pontuais a cada votação.

### 5.3. Ritos Normativos: MP, PDL, PEC e Lei Ordinária/Complementar

- **Medida Provisória (CF, art. 62):** Instrumento de eficácia imediata editado pelo Presidente da República em casos de _relevância e urgência_. Vigora por 60 dias, prorrogáveis por igual período. É analisada por comissão mista e depois pelos plenários da Câmara e do Senado. Se não for apreciada em até 45 dias da publicação, entra em regime de urgência, trancando a pauta de votações da casa legislativa onde tramita. É vedada em matérias penais, eleitorais e de direito processual, ou que reservem lei complementar.
- **Projeto de Decreto Legislativo (PDL - CF, art. 49, V):** É o freio de emergência do Congresso Nacional para **sustar os atos normativos do Poder Executivo que exorbitem do poder regulamentar** ou dos limites de delegação legislativa. Não passa pelo crivo de sanção ou veto presidencial; promulgada pelo Presidente do Congresso, a anulação entra em vigor imediatamente.
- **Proposta de Emenda à Constituição (PEC - CF, art. 60):** Exige votação em dois turnos em ambas as Casas, com aprovação mínima de **3/5 dos votos** em cada turno (308 deputados e 49 senadores). Não há possibilidade de veto presidencial. O art. 60, § 4º define as **cláusulas pétreas**, imunes a qualquer abolição por emenda:
  1. A forma federativa de Estado;
  2. O voto direto, secreto, universal e periódico;
  3. A separação dos Poderes;
  4. Os direitos e garantias individuais.

### 5.4. O Ciclo Orçamentário e as Emendas Impositivas

A gestão orçamentária é regida pelo tripé **PPA** (Plano Plurianual - 4 anos), **LDO** (Lei de Diretrizes Orçamentárias - metas anuais e contingenciamentos) e **LOA** (Lei Orçamentária Anual):

- **O Fim do Orçamento Puramente Autorizativo:** Historicamente, o orçamento brasileiro era considerado estritamente autorizativo: o Executivo decidia discricionariamente o que pagar e quando pagar. A partir das Emendas Constitucionais nº 86/2015, 100/2019 e 105/2019, o Congresso instituiu o **orçamento impositivo**:
  - **Emendas Individuais (art. 166, § 9º):** Reserva de até 2% da receita corrente líquida federal para emendas de deputados e senadores, de execução obrigatória.
  - **Emendas Especiais ("Emendas Pix" - art. 166-A):** Modalidade em que o recurso federal é repassado diretamente a estados e municípios sem necessidade de convênio prévio com ministérios técnicos.
  - **Emendas de Bancada Estadual (art. 166, § 12):** Alocação de bancadas regionais para grandes obras estaduais, também de execução obrigatória (até 1% da receita corrente líquida).
- **A Lei Complementar nº 210/2024:** Fruto da crise deflagrada pelo STF em 2024, estabeleceu que todas as transferências especiais e emendas de comissão exigem planos de trabalho prévios, indicação nominal do autor no portal de transparência e respeito aos impedimentos técnicos apontados pelos ministérios setoriais.

### 5.5. O STF e o Controle de Constitucionalidade

O Supremo Tribunal Federal é o guardião da Constituição e atua como uma corte política de última instância:

- **Ações Diretas no Controle Concentrado:**
  - **ADI (Ação Direta de Inconstitucionalidade):** Questiona lei federal ou estadual que contraria a CF.
  - **ADC (Ação Declaratória de Constitucionalidade):** Confirma a presunção de constitucionalidade de ato federal contestado em tribunais inferiores.
  - **ADPF (Arguição de Descumprimento de Preceito Fundamental):** Combate atos do poder público (inclusive pré-constitucionais ou municipais) que firam pilares essenciais da ordem jurídica.
- **Legitimados Ativos (CF, art. 103):** Podem acionar o STF: o Presidente da República, as Mesas da Câmara e do Senado, Mesas de Assembleias Legislativas, Governadores, o Procurador-Geral da República, o Conselho Federal da OAB, partidos políticos com representação no Congresso e confederações sindicais/entidades de classe de âmbito nacional. Na prática, **qualquer partido político com 1 deputado pode levar uma disputa governamental para julgamento no STF**.
- **Decisões Monocráticas vs. Plenário:** Ministros relatores concedem medidas liminares cautelares monocraticamente em casos urgentes, suspendendo a eficácia de leis federais, portarias ou decretos presidenciais antes do pronunciamento do colegiado.
- **Advocacia-Geral da União (AGU), Procuradoria-Geral da República (PGR) e TCU:**
  - O **PGR** chefia o Ministério Público da União, com mandato de 2 anos (reconduzível) após aprovação do Senado; possui exclusividade na persecução penal de autoridades com foro privilegiado perante o STF e plena autonomia na propositura de ADIs.
  - O **TCU** é órgão auxiliar do Congresso Nacional na fiscalização contábil, financeira, orçamentária e patrimonial da União. Não anula leis, mas tem poderes cautelares para suspender licitações irregulares, ordenar a indisponibilidade de bens de gestores e emitir o **Parecer Prévio sobre as Contas do Presidente da República** (CF, art. 71, I). Um parecer recomendando a rejeição das contas (como ocorrido com as _pedaladas fiscais_ em 2015) serve de lastro técnico irrefutável para abertura de processo de impeachment.

---

## 6. Federação, Sociedade e Poderes com Autonomia

### 6.1. O Federalismo Fiscal e Político

O Brasil é uma federação trina composta por União, 26 Estados + Distrito Federal e 5.570 Municípios, todos entes autônomos (CF, art. 18):

- **Fundos de Participação (FPE e FPM):** A União arrecada os tributos de base mais ampla (Imposto de Renda e IPI) e é obrigada a repassar parcelas automáticas aos estados (FPE) e aos municípios (FPM). Não há subordinação hierárquica entre o Presidente e um Governador ou Prefeito.
- **Modelos de Gestão Compartilhada:**
  - **SUS (Sistema Único de Saúde):** Opera por pactuação nas Comissões Intergestores Bipartite (CIB - Estado e Municípios) e Tripartite (CIT - Ministério da Saúde, Estados e Municípios). O Governo Federal provê financiamento normativo, mas quem opera as redes e hospitais municipais são os prefeitos e governadores.
  - **Fundeb:** Fundo de desenvolvimento da educação básica baseado em fundos contábeis estaduais com complementação financeira direta da União.
- **Peso Político dos Governadores:** Governadores de estados populosos (São Paulo, Minas Gerais, Rio de Janeiro, Bahia, Rio Grande do Sul) exercem liderança expressiva sobre as bancadas federais de seus estados na Câmara, podendo consolidar ou implodir maiorias legislativas do Planalto.

### 6.2. Autonomia do Banco Central (Lei Complementar nº 179/2021)

- O Banco Central do Brasil é autarquia de natureza especial sem vinculação ministerial e com autonomia técnica, operacional, administrativa e financeira.
- **Mandatos Fixos Descasados:** O Presidente e os 8 Diretores do Banco Central cumprem mandatos de 4 anos não coincidentes com o mandato do Presidente da República:
  - O Presidente do BC assume no dia 1º de janeiro do 3º ano do mandato do Presidente da República.
  - A exoneração só pode ocorrer a pedido, por condenação judicial transitada em julgado ou por comprovado e recorrente descumprimento dos objetivos do banco, devendo ser aprovada pelo plenário do Senado Federal por maioria absoluta.
- **Metas de Inflação e o COPOM:** O Conselho Monetário Nacional (CMN - composto pelo Ministro da Fazenda, Ministro do Planejamento e Presidente do BC) fixa as metas de inflação. O Comitê de Política Monetária (Copom) do BC decide monocraticamente a cada 45 dias a taxa Selic. **O Presidente da República não tem autoridade legal para baixar a taxa básica de juros por canetada.** Críticas públicas presidenciais ao nível da taxa de juros geram aumento do prêmio de risco, desvalorização cambial e elevação da curva futura de juros.

### 6.3. As Forças Armadas (CF, art. 142)

- As Forças Armadas (Marinha, Exército e Aeronáutica) são instituições nacionais permanentes e regulares, baseadas na hierarquia e na disciplina, sob a autoridade suprema do Presidente da República.
- **Destinação Constitucional:** Destinam-se à defesa da Pátria, à garantia dos poderes constitucionais e, por iniciativa de qualquer destes, da lei e da ordem (operações de GLO).
- **Vedação Política:** O militar em serviço ativo não pode estar filiado a partidos políticos nem exercer atividade político-partidária ou greve.
- **Realidade Corporativa e Orçamentária:** As Forças Armadas possuem interesses corporativos densos: previdência militar diferenciada, fundos de pensão, saúde própria e grandes projetos de investimento estratégico (Programa de Submarinos - Prosub, caças Gripen, blindados Guarani). O Presidente comanda formalmente por intermédio do Ministério da Defesa (criado em 1999 para firmar a chefia civil), mas rupturas ou interferências ilegais em planos de carreira provocam atritos institucionais severos.
- **Interpretação do STF sobre o Art. 142:** No julgamento da ADI 6457 (concluído em 2024), o STF pacificou por unanimidade que a Constituição não atribui às Forças Armadas o papel de "poder moderador" nem autoriza intervenção militar arbitrária sobre outros poderes da República.

### 6.4. Corporações, Grupos de Pressão e Mídia

- **Agronegócio (Bancada Ruralista / FPA):** A Frente Parlamentar da Agropecuária congrega mais de 300 deputados e senadores. Defende pautas de segurança jurídica da terra, flexibilização de defensivos, crédito agrícola subsidiado (Plano Safra) e opõe-se a demarcações de terras indígenas ou exigências ambientais que firam o direito de propriedade.
- **Setor Financeiro e Grandes Indústrias (Febraban, CNI, Fiesp):** Exercem influência decisiva sobre a precificação da dívida pública, câmbio e confiança de investimentos. A ameaça de fuga de capitais disciplina decisões ministeriais.
- **Centrais Sindicais e Movimentos Sociais (CUT, Força Sindical, MST, MTST):** Base tradicional de mobilização de governos de esquerda, com capacidade de paralisar transportes ou realizar ocupações em caso de reformas trabalhistas ou ausência de reforma agrária.
- **Bancada Evangélica / Religiosa:** Articulada em pautas morais, costumes e isenções tributárias para templos de qualquer culto (CF, art. 150, VI, 'b').
- **Imprensa e Plataformas Digitais:** A cobertura de escândalos de corrupção ou colapso de serviços públicos no Brasil tem efeito acelerador na formação da opinião pública, alterando instantaneamente a disposição de parlamentares governistas em votar matérias impopulares.

---

## 7. Economia, Orçamento e Capacidade Estatal

### 7.1. A Anatomia das Despesas Obrigatórias e a Rigidez Fiscal

O orçamento público brasileiro possui uma das maiores rigidezes do mundo:

```
+------------------------------------------------------------------------+
|                 ORÇAMENTO GERAL DA UNIÃO (DESPESAS PRIMÁRIAS)          |
+------------------------------------------------------------------------+
|                                                                        |
| [===========================================================] [====]   |
|                                                                        |
|        DESPESAS OBRIGATÓRIAS (90% a 95%)                     DISCRIC.  |
| - Benefícios da Previdência Social (INSS/RPPS)                (5%-10%) |
| - Folha de Pagamento e Encargos de Pessoal                   - Custeio |
| - Pisos Constitucionais de Saúde e Educação                  - Obras   |
| - Benefício de Prestação Continuada (BPC / LOAS)             - Equips. |
| - Sentenças Judiciais e Precatórios                                    |
| - Seguro-Desemprego e Abono Salarial                                   |
+------------------------------------------------------------------------+
```

- **Pisos Constitucionais:**
  - **Saúde (CF, art. 198, § 2º):** Aplicação mínima obrigatória correspondente a percentual da Receita Corrente Líquida da União (historicamente restabelecido em 15% da RCL).
  - **Educação (CF, art. 212):** Aplicação obrigatória mínima correspondente a 18% da receita resultante de impostos.
- **Precatórios (Sentenças Judiciais Transitadas em Julgado):** Dívidas originadas de derrotas judiciais definitivas da União. Seu não pagamento configura crime de responsabilidade e acarreta intervenção federal.
- **Margem Discricionária:** A verba discricionária é a única que o governo pode remanejar livremente para investimentos públicos, obras civis, compras de equipamentos militares ou custeio ordinário das universidades e delegacias. Diante de qualquer frustração de receitas, **o contingenciamento recai integralmente sobre essa pequena parcela**, paralisando obras e contratos.

### 7.2. Marcos Fiscais: Da LRF ao Novo Arcabouço Fiscal

- **Lei de Responsabilidade Fiscal (Lei Complementar nº 101/2000):**
  - Estabelece tetos estritos de gastos com pessoal para os poderes (União: Executivo máximo de 37,9%, Judiciário 6%, Legislativo/TCU 2,5%, MPU 0,6% da RCL).
  - Obriga a definição de metas anuais de resultado primário e limites de dívida pública.
  - Proíbe operações de crédito entre a União e o Banco Central (_vedação à emissão direta de moeda para cobrir rombos orçamentários_).
- **O Novo Arcabouço Fiscal (Lei Complementar nº 200/2023):**
  - Substituiu o Teto de Gastos da EC nº 95/2016.
  - **Regra de Crescimento Real:** O crescimento anual dos gastos públicos da União está limitado a uma banda entre **0,7% (piso)** e **2,5% (teto)** acima da inflação (IPCA).
  - **Proporcionalidade da Receita:** Os gastos só podem crescer até o equivalente a **70% do crescimento real da arrecadação** dos 12 meses anteriores. Se o governo descumprir o centro da meta de resultado primário fixado na LDO, a taxa de expansão é rebaixada para **50% do crescimento da receita**.
  - **Gatilhos de Ajuste:** O descumprimento contínuo impõe vedações a novos concursos públicos, congelamento de criação de cargos e proibição de novos benefícios fiscais.

### 7.3. O Ciclo Real de Capacidade: Empenho, Liquidação e Pagamento

No setor público brasileiro, **não existe compra ou realização financeira sem tramitação orçamentária prévia**:

1. **Empenho:** Reserva legal da dotação orçamentária para um fornecedor ou serviço específico. A despesa está contratada, mas nada foi construído ou entregue.
2. **Liquidação:** Verificação física e documental de que a obra foi construída ou o bem foi entregue segundo as especificações do contrato (medição de engenharia, notas fiscais).
3. **Pagamento:** Emissão da ordem bancária de repasse financeiro pelo Tesouro Nacional.

- **Restos a Pagar (RAP):** Despesas empenhadas em um ano e não pagas até 31 de dezembro rolam para exercícios futuros. Um excesso crônico de restos a pagar estrangula o orçamento do mandato seguinte.
- **A Nova Lei de Licitações (Lei nº 14.133/2021):** Exige editais públicos detalhados, estudos técnicos preliminares, matrizes de risco e prazos de impugnação de 10 a 60 dias úteis. Projetos de grande infraestrutura exigem licenciamento prévio ambiental (LP, LI, LO junto ao Ibama/órgãos estaduais), levando de 18 a 36 meses entre a decisão política presidencial e a primeira pá de terra no canteiro de obras.

---

## 8. Transformações Radicais e Limites Institucionais

O simulador visa oferecer liberdade autêntica para que o jogador tente governar de acordo com diferentes visões políticas ou projetos de transformação estrutural (desde modelos estatizantes/comunistas até reformas de choque ultraliberais à Milei ou o desenvolvimentismo tecnocrático de Singapura), sem bloqueios artificiais de código (`if (proibido) return`).

Para tanto, é indispensável compreender as **fricções, custos sistêmicos e reações institucionais** que cada rumo gera na ordem republicana brasileira.

### 8.1. Modelos de Comparação Internacional e a Realidade Brasileira

#### Caso A: O Modelo de Choque Fiscal e Desregulamentação (Inspirado na Argentina de Javier Milei - 2023-Presente)

- **Mecanismos Utilizados na Argentina:**
  - _DNU 70/2023:_ Decreto de Necessidade e Urgência gigante que revogou centenas de leis ordinárias (leis de aluguéis, comércio, abastecimento e bases estatais) de uma só canetada.
  - _Ley Bases (Lei nº 27.742):_ Obtenção de delegação legislativa em matérias administrativa, econômica e financeira, além de privatizações e incentivos ao investimento (RIGI).
  - _Ajuste Fiscal via "Motosierra y Licuación":_ Paralisação total de novas obras públicas federais (_obra pública cero_), corte drástico de repasses a províncias e erosão inflacionária real do valor de pensões e salários públicos.
- **Fricções e Contrapesos Argentinos:**
  - O Congresso rejeitou partes fundamentais das propostas iniciais, forçando a retirada de mais de metade dos artigos da Lei de Bases.
  - O Senado argentino rejeitou o DNU 70/2023 em votação preliminar.
  - A Justiça do Trabalho declarou a inconstitucionalidade dos capítulos de reforma trabalhista do DNU 70/2023.
  - Os governadores provinciais travaram embates tributários retendo fundos ou acionando a Suprema Corte argentina.
- **Transposição para o Brasil Real (O que Acontece se o Jogador Tenta Isso no Simulador):**
  - **Limites da Medida Provisória:** No Brasil, o art. 62 da CF veda expressamente MP sobre matéria penal, processual, eleitoral, organização do Judiciário/MP ou que vise à retenção de bens e poupança. A emissão de um "superdecreto" revogando leis estruturantes é sustada em questão de dias pelo Congresso Nacional via **PDL (art. 49, V)**.
  - **Inviabilidade da "Licuación" Total:** Os pisos constitucionais de Saúde e Educação (atrelados à receita) e a indexação do piso do INSS ao salário mínimo (CF, art. 7º, IV e art. 201, § 2º) impedem o governo de desvalorizar deliberadamente benefícios previdenciários abaixo do mínimo sem emenda constitucional aprovada por 3/5.
  - **Reação Judicial Instantânea:** Cautelares de relatores do STF suspendem qualquer ato do Executivo que tente extinguir empresas públicas sem lei autorizativa aprovada pelo Congresso (tese fixada pelo STF na ADI 5624).
  - **Custos Sistêmicos:** Paralisação imediata dos serviços básicos estatais, greves de servidores com estabilidade, perda da base no Congresso e queda vertiginosa de popularidade para faixas abaixo de 20%, abrindo caminho para impeachment.

#### Caso B: O Modelo Desenvolvimentista e Capitalismo de Estado (Inspirado em Singapura - 1965-Presente)

- **Mecanismos Utilizados em Singapura:**
  - _Hegemonia Parlamentar Absoluta:_ O Partido de Ação Popular (PAP) detém supermaioria parlamentar contínua desde a independência, sob um sistema parlamentarista unicameral.
  - _Poupança Compulsória e Habitação Pública:_ O _Central Provident Fund_ (CPF) retém entre 20% e 37% dos salários de cidadãos e empregadores, direcionando poupança forçada para financiar habitação pública em massa (_HDB_ - onde moram mais de 80% da população) e infraestrutura.
  - _Fundos Soberanos e Estatais Globais:_ Temasek Holdings e GIC gerenciam participações estratégicas globais com governança impiedosamente meritocrática e foco em retorno sobre o capital.
  - _Controle Social e Anticorrupção Rigoroso:_ O _Corrupt Practices Investigation Bureau_ (CPIB) responde diretamente ao Primeiro-Ministro com poderes investigativos ilimitados, sem as garantias de processo ordinário de matriz liberal.
- **Fricções e Incompatibilidades com a Federação Brasileira:**
  - **Diferença de Escala e Diversidade:** Singapura é uma cidade-estado de 730 km² sem federação, estados ou municípios. O Brasil possui território continental de 8,5 milhões de km², extrema disparidade regional e 5.570 prefeituras autônomas.
  - **Impossibilidade de Centralização Forçada:** A União não pode dispor compulsoriamente do FGTS ou da poupança privada para fundos soberanos especulativos sem colidir frontalmente com o direito de propriedade (CF, art. 5º, XXII) e o controle difuso de constitucionalidade.
  - **Inexistência de Mandato Autoritário:** No Brasil, qualquer tentativa de subordinação do Ministério Público ou da Polícia Federal à chefia do Executivo gera denúncias imediatas no STF e desobediência funcional respaldada pela lei orgânica dessas carreiras (Lei nº 8.625/1993 e LC nº 75/1993).

#### Caso C: O Modelo de Estatização Ampla ou Ruptura Socialista/Comunista

- **Mecanismos Hipotéticos de Governo:** Expropriação forçada de grandes indústrias e bancos, moratória unilateral das dívidas públicas interna e externa, controle rígido de capitais e preços, e subordinação das forças de segurança à organização de bases populares.
- **Fricções e Reações Institucionais no Brasil Real:**
  - **Cláusula de Indenização Prévia e Justa (CF, art. 5º, XXIV):** A desapropriação por necessidade pública ou interesse social exige **justa e prévia indenização em dinheiro**. A expropriação sumária sem pagamento é ato juridicamente nulo; juízes federais emitem mandados de reintegração de posse imediatos.
  - **Colapso da Moeda e Dívida Soberana:** A quebra de contratos financeiros leva a fuga massiva de capitais internacionais e nacionais, hiperinflação cambial, colapso na rolagem dos títulos do Tesouro Nacional (Selic disparando além de 30% ou descolamento total do mercado de crédito) e escassez imediata de insumos básicos e combustíveis.
  - **Reação Federativa e Militar:** Governadores de oposição acionam suas Polícias Militares e rompem canais de cooperação com a União. As Forças Armadas resistem a ordens que contrariem decisões expressas do STF, criando impasse de cadeia de comando que deságua na deposição formal do governante por crime de responsabilidade.

### 8.2. O Custo das Rupturas e os "Estados de Exceção Constitucionais"

A CF/88 previu instrumentos estritamente delimitados para tempos de crise grave, mas cercou-os de controles intransponíveis:

- **Estado de Defesa (art. 136):** Visa restabelecer a ordem pública ameaçada por grave instabilidade ou calamidades de grandes proporções. Decretado pelo Presidente após ouvir o Conselho da República e o Conselho de Defesa Nacional, mas deve ser **submetido em 24 horas ao Congresso Nacional**, que decide por maioria absoluta.
- **Estado de Sítio (art. 137 a 139):** O Presidente **solicita autorização prévia ao Congresso Nacional** para decretá-lo nos casos de comoção grave de repercussão nacional, ineficácia do Estado de Defesa ou estado de guerra. O Congresso mantém-se em funcionamento permanente e designa uma comissão de 5 membros para fiscalizar e acompanhar todas as medidas do Executivo.
- **O Preço de um "Autogolpe":** No ambiente institucional e geopolítico contemporâneo, a tentativa de fechamento do Congresso ou intervenção armada no STF resulta em:
  1. Isolamento internacional imediato (sanções financeiras dos EUA e da União Europeia, suspensão do Mercosul via Protocolo de Ushuaia, bloqueio de crédito pelo Banco Mundial e FMI);
  2. Paralisação do comércio exterior (embargos imediatos sobre carne, soja e minério de ferro);
  3. Greve de investimentos e fuga generalizada de divisas;
  4. Ruptura na coesão do próprio aparelho de segurança (revolta ou inação de comandos intermediários diante de ordens manifestamente ilegais, puníveis pelo Código Penal Militar).

---

## 9. Casos Concretos Documentados

Para fundamentar as interações institucionais descritas, examinam-se três casos emblemáticos recentes da história institucional brasileira que comprovam o equilíbrio de forças real entre Executivo, Legislativo e Judiciário:

### Caso 1: A Disputa do IOF (Julho de 2025)

_O conflito em torno do poder de caneta tributário do Executivo versus a sustação pelo Congresso e a mediação judicial pelo STF._

```
[Executivo emite Decretos IOF]
        |
        v
[Congresso aprova PDL 176/2025 revogando decretos]
        |
        v
[Governo ajuíza ADIs 7827/7839 e ADC 96 no STF]
        |
        v
[STF (Moraes) concede liminar congelando tudo]
        |
        v
[Audiência de Conciliação fracassa]
        |
        v
[STF arbitra decisão salomônica: valida alíquotas ordinárias, veda risco sacado e proíbe retroatividade]
```

- **Contexto e Ação do Executivo:** Com o objetivo de compensar frustrações fiscais e preservar as metas do Arcabouço Fiscal sem necessitar de aprovação legislativa de novas leis, o Presidente da República editou Decretos majorando as alíquotas do Imposto sobre Operações Financeiras (IOF) para certas operações de crédito e câmbio, valendo-se da exceção constitucional da legalidade estrita conferida pelo art. 153, § 1º da CF/88.
- **A Reação Legislativa:** O Congresso Nacional, sob liderança de bancadas empresariais e da oposição, entendeu que o decreto desbordou da função meramente regulatória e configurou excesso normativo com viés puramente arrecadatório. Em votação célere na Câmara e no Senado, foi aprovado o **Projeto de Decreto Legislativo (PDL) nº 176/2025**, revogando integralmente a majoração das alíquotas com base no art. 49, V da CF.
- **A Batalha no STF:**
  - O Governo acionou o STF através das **ADIs 7827 e 7839** e da **ADC 96**, sustentando que o Congresso usurpou competência privativa do Chefe do Executivo ao cassar um poder tributário explicitamente previsto na Constituição.
  - O relator, Ministro Alexandre de Moraes, proferiu decisão cautelar monocrática em **04/07/2025**, suspendendo temporariamente tanto os efeitos do PDL do Congresso quanto as alíquotas majoradas do decreto governamental, convocando uma audiência de conciliação.
  - A audiência realizada em **15/07/2025** no Supremo, reunindo o Ministro da Fazenda, o AGU e líderes do Congresso, terminou sem consenso.
- **A Solução Arbitrada:**
  - Em **16/07/2025**, o Ministro Moraes proferiu nova decisão restabelecendo parcialmente o decreto presidencial (validando as alíquotas gerais), mas excluindo expressamente operações sensíveis questionadas pelo mercado (como a tributação de "risco sacado").
  - Em **18/07/2025**, o Ministro complementou a liminar vedando qualquer cobrança retroativa das alíquotas durante o período do impasse.
- **Lição para o Jogo:** O Presidente pode usar o poder de caneta tributário (IOF/IPI/II/IE), mas se a medida afetar interesses profundos no Congresso, os parlamentares aprovam um PDL em 48 horas. A disputa termina nas mãos de um único ministro do STF, que arbitra os termos finais da política fiscal.

---

### Caso 2: A Crise das Emendas Parlamentares e Emendas Pix (2024)

_A suspensão judicial do orçamento legislativo e a repactuação do pacto tripartite de governabilidade._

- **Contexto e Disputa:** A expansão das emendas impositivas (especialmente as Emendas Especiais / "Emendas Pix" criadas pela EC nº 105/2019 e as emendas de comissão) permitiu que deputados e senadores destinassem bilhões de reais diretamente a redutos eleitorais sem projeto técnico, sem plano de trabalho aprovado pelos ministérios e sem identificação clara de quem determinou a transferência nos sistemas públicos.
- **A Intervenção do STF (Agosto de 2024):**
  - Provocado pelo PSOL e pela Associação Contas Abertas nas **ADIs 7688, 7695 e 7697**, o Ministro Flávio Dino determinou monocraticamente a **suspensão imediata da execução de todas as emendas parlamentares impositivas** que não comprovassem critérios mínimos de rastreabilidade, publicidade e transparência.
  - A decisão bloqueou bilhões em pagamentos às vésperas das eleições municipais de 2024, provocando uma crise institucional sem precedentes entre o Judiciário e o Congresso Nacional.
- **A Paralisia Legislativa e a Reação do Congresso:**
  - Deputados e senadores reagiram retaliando a pauta prioritária do Executivo, paralisando a votação de matérias do Ministério da Fazenda e acelerando PECs voltadas a limitar os poderes cautelares dos ministros do STF.
- **A Cúpula dos Três Poderes (20/08/2024):**
  - Diante do colapso das votações, realizou-se um almoço institucional no Supremo Tribunal Federal reunindo o Presidente da República, os Presidentes da Câmara e do Senado e ministros do STF. Ficou pactuado que as emendas seriam liberadas apenas mediante criação de uma nova lei regulamentadora.
- **O Desfecho Normativo:**
  - O Congresso aprovou em regime de urgência a **Lei Complementar nº 210/2024** (sancionada em novembro de 2024), estabelecendo a obrigatoriedade de identificação nominal dos parlamentares, a fiscalização prévia pelo TCU, a apresentação de plano de trabalho detalhado no portal Transferegov e a priorização de obras inacabadas.
- **Lição para o Jogo:** A moeda de troca da governabilidade (emendas orçamentárias) não é imune a choques institucionais. O controle de legalidade e transparência pelo STF pode cortar subitamente a irrigação da base aliada, exigindo habilidade do Presidente para recompor a relação com o Congresso sem violar decisões judiciais mandatórias.

---

### Caso 3: O Marco Legal do Saneamento Básico (2023)

_A derrota do decreto presidencial diante da maioria pró-mercado e a capitulação tática do Planalto._

- **Contexto:** Em 2020, o Congresso promulgou o Novo Marco do Saneamento Básico (Lei nº 14.026/2020), que exigia concorrência obrigatória por licitação e proibia a renovação sem concorrência dos contratos de programa celebrados entre municípios e as companhias estaduais de saneamento públicas.
- **A Ofensiva Regulamentar do Executivo:**
  - Em abril de 2023, recém-empossado, o Presidente da República atendeu a demandas de governadores aliados e entidades sindicais e editou os **Decretos nº 11.466 e 11.467**.
  - Os decretos alteravam profundamente o regulamento federal para flexibilizar as exigências de comprovação da capacidade econômico-financeira das estatais e permitir a prorrogação de contratos sem licitação aberta, beneficiando as companhias estaduais públicas.
- **A Reação Legislativa Esmagadora:**
  - O setor privado, investidores e a liderança da Câmara dos Deputados classificaram o decreto como retrocesso e quebra de segurança jurídica.
  - Em maio de 2023, a Câmara dos Deputados aprovou com placar contundente de **295 votos a favor e 136 contra** o **PDL nº 98/2023**, derrubando os principais trechos dos decretos presidenciais.
- **A Negociação e o Recuo Governamental:**
  - Diante da certeza de que o Senado repetiria a derrota, o Planalto abriu negociações com a liderança do Senado e associações privadas de infraestrutura.
  - Em julho de 2023, o Presidente revogou expressamente os polêmicos decretos e publicou os **Decretos nº 11.598 e 11.599**, fruto de texto de compromisso que manteve as travas da concorrência privada e previu condições de transição aceitas pelas lideranças parlamentares.
- **Lição para o Jogo:** Usar canetada regulamentar (decreto) para desmanchar reformas consolidadas por lei aprovada pelo Congresso resulta em derrota avassaladora em plenário. O Presidente é forçado a recuar para evitar a humilhação política de ver seu decreto anulado formalmente pelo Poder Legislativo.

---

## 10. Propostas de Mecânicas Hipotéticas para o Simulador

As seguintes proposições constituem **hipóteses de design** e caminhos de evolução futuros para discussão entre o Usuário, Codex, Claude e Gemini, sem violar os contratos atuais do repositório (zero build, zero dependências externas, domínio puro, sem relógio, sem `Math.random`):

```
                   +---------------------------------------+
                   |       GABINETE MINISTERIAL            |
                   | - Pasta Nomeada (Ator do Cast)        |
                   | - Capital Político vs. Competência    |
                   +-------------------+-------------------+
                                       |
                   +-------------------v-------------------+
                   |         EXECUÇÃO DE PROGRAMAS         |
                   | - Yield Diferenciado (Setor)          |
                   | - Lag de Capacidade (1 a 12 turnos)   |
                   +-------------------+-------------------+
                                       |
                   +-------------------v-------------------+
                   |        RISCO INSTITUCIONAL            |
                   | - Fricção Normativa (Decretos)        |
                   | - Gatilhos de PDL / Ação no STF       |
                   +---------------------------------------+
```

### 10.1. Diferenciação de Lag e Yield nos Programas da MALHA

- **Problema Atual:** Em `src/domain/capacity/index.mjs`, o ganho de entrega é calculado agregando toda a despesa na área (`allocation[area.id] * area.yield`).
- **Hipótese de Evolução:** Incorporar os atributos existentes de `src/data/programs.mjs` (`weight`, `lag`, `yield` por programa) no cálculo mensal:
  - _Transferências de Renda Imediatas (ex.: Bolsa Família / Auxílio Emergencial):_ `lag: 1` turno, `popularYield: alto`, `capacityYield: baixo` (efeito rápido no ânimo popular e consumo, sem acúmulo de infraestrutura duradoura).
  - _Obras e Infraestrutura Pesada (ex.: Rodovias, Ferrovias, Refinarias):_ `lag: 12` a `24` turnos, `popularYield: nulo no curto prazo`, `capacityYield: muito alto no longo prazo` (exige sustentação de gasto durante vários turnos antes de render frutos econômicos).

### 10.2. Gabinete Ministerial com Atributos Duplos (Capacidade Técnica vs. Peso Político)

- **Problema Atual:** O elenco (`src/data/cast.mjs`) possui atores com preferências de pasta, mas a nomeação de ministros ainda não é um vetor de estado que afeta diretamente o domínio.
- **Hipótese de Evolução:** Vincular pastas a ministros nomeados pelo jogador, cada um com atributos explícitos:
  - `politicalWeight` (assentos parlamentares que o ministro assegura na coalizão e disciplina de bancada);
  - `technicalCapacity` (multiplicador que reduz perdas de eficiência e acelera a liquidação das despesas da pasta);
  - `integrityRisk` (probabilidade determinística de incidentes de improbidade que geram investigações do TCU/MPF).
  - _Dilema do Jogador:_ Nomear um ministro do "Centrão" traz 40 votos na Câmara, mas derruba a velocidade de entrega técnica e aumenta o risco de escândalos no TCU. Nomear um acadêmico brilhante maximiza a capacidade da pasta, mas gera rebelião na base aliada no Congresso.

### 10.3. A Trava da Rigidez Orçamentária no Domínio Orçamentário (`BUDGET`)

- **Problema Atual:** O orçamento do jogo oferece flexibilidade relativamente ampla para o jogador mover sliders de áreas sem sentir o estrangulamento da lei.
- **Hipótese de Evolução:** Dividir as dotações de cada área em **Despesa Obrigatória Inflexível** (folha de servidores da área, benefícios vinculados por lei) e **Despesa Discricionária** (investimentos livres):
  - Cortar despesa obrigatória exige PEC de reforma administrativa/previdenciária (com custo severo de capital político e 308 votos na Câmara).
  - Movimentações rápidas de slider afetam apenas a fração discricionária. Se a arrecadação cair, o contingenciamento é acionado automaticamente para cumprir as regras do Arcabouço Fiscal.

### 10.4. Fricção Normativa e a Mecânica de "Risco Institucional"

- **Problema Atual:** Atos do governo raramente encontram reação jurídica processual proporcional fora de crises pré-definidas.
- **Hipótese de Evolução:** Decretos ou atos executivos que ultrapassem os limites legais geram um índice de **Fricção Institucional**:
  - Se a fricção for moderada, o Congresso pode pautar um **PDL de Sustação** (forçando o jogador a despender capital político para enterrar o projeto).
  - Se a medida violar cláusula pétrea ou direito adquirido, uma **Ação Direta no STF** é deflagrada por um partido de oposição, suspendendo o efeito da medida e impondo desgaste de popularidade ao presidente.

---

## 11. Fontes Consultadas e Lacunas Mapeadas

### 11.1. Legislação e Atos Normativos Fundamentais

1. **Constituição da República Federativa do Brasil de 1988:**
   - Arts. 5º e 60 (Direitos fundamentais e cláusulas pétreas);
   - Arts. 61 e 62 (Processo legislativo e medidas provisórias);
   - Art. 84 (Competências privativas do Presidente da República);
   - Arts. 102 e 103 (Competências do STF e legitimados do controle de constitucionalidade);
   - Arts. 142 (Forças Armadas);
   - Arts. 165 a 169 (Orçamento, emendas impositivas e limites de gastos);
   - Arts. 198 e 212 (Pisos da Saúde e Educação).
2. **Normas Orçamentárias e Administrativas:**
   - **Lei Complementar nº 101/2000:** Lei de Responsabilidade Fiscal (LRF);
   - **Lei Complementar nº 200/2023:** Regime Fiscal Sustentável (Novo Arcabouço Fiscal);
   - **Lei Complementar nº 179/2021:** Autonomia do Banco Central do Brasil;
   - **Lei Complementar nº 210/2024:** Marco regulatório e de transparência das emendas parlamentares;
   - **Lei nº 14.600/2023:** Organização básica dos órgãos da Presidência da República e dos Ministérios;
   - **Lei nº 13.303/2016:** Estatuto jurídico das empresas públicas e sociedades de economia mista (Lei das Estatais);
   - **Lei nº 13.848/2019:** Lei Geral das Agências Reguladoras;
   - **Lei nº 14.133/2021:** Nova Lei de Licitações e Contratos Administrativos;
   - **Lei nº 1.079/1950:** Define os crimes de responsabilidade e regula o processo de impeachment;
   - **Decreto-Lei nº 200/1967:** Organização da administração federal.

### 11.2. Jurisprudência do Supremo Tribunal Federal

- **ADIs 7827, 7839 e ADC 96 (2025):** Liminares e modulações sobre o poder regulamentar do IOF e sustação por PDL (Rel. Min. Alexandre de Moraes).
- **ADIs 7688, 7695 e 7697 (2024):** Decisões cautelares que suspenderam a execução das emendas parlamentares e exigiram transparência e rastreabilidade (Rel. Min. Flávio Dino).
- **ADI 7331 MC (2023):** Suspensão cautelar de quarentenas e vedações de dirigentes políticos em empresas estatais (Rel. Min. Ricardo Lewandowski).
- **ADI 6457 (2024):** Delimitação do art. 142 da CF e afastamento unânime da tese de "poder moderador" das Forças Armadas (Rel. Min. Luiz Fux).
- **ADI 5624 (2019):** Exigência de autorização legislativa para alienação do controle acionário de empresas estatais matrizes (Rel. Min. Ricardo Lewandowski).

### 11.3. Literatura Acadêmica e Conceitual Canônica

- **ABRANCHES, Sérgio Henrique.** _Presidencialismo de coalizão: o dilema institucional brasileiro_. Dados – Revista de Ciências Sociais, Rio de Janeiro, v. 31, n. 1, 1988.
- **AMORIM NETO, Octavio.** _Presidencialismo e governabilidade no Brasil republicano_. Rio de Janeiro: FGV Editora, 2006. (Conceito de taxa de coalescência e disciplina de bancada).
- **FIGUEIREDO, Argelina Cheibub; LIMONGI, Fernando.** _Executivo e Legislativo na nova ordem constitucional_. Rio de Janeiro: FGV Editora, 1999. (Poder de agenda e produção legislativa do Executivo no pós-88).

### 11.4. Lacunas Mapeadas e Limites de Verificação

- **Preços Informais de Moeda Política de Emendas:** Não existem métricas públicas e unívocas sobre a quantidade exata de milhões de reais em emendas por voto favorável em plenário; trata-se de precificação situacional que oscila dependendo do risco de desgaste eleitoral da matéria (ex.: votação de imposto sobre consumo vs. concessão de honraria).
- **Disparidade Burocrática Interministerial:** A capacidade de execução varia enormemente entre ministérios com carreiras típicas de Estado estruturadas (como Fazenda, Ipea e Banco Central) e ministérios setoriais historicamente desidratados de quadro funcional (como Turismo, Pesca ou Esporte), dado que o simulador ainda não reflete no detalhe.
- **Incerteza na Jurisprudência Definitiva das Estatais:** O mérito final da ADI 7331 (Lei das Estatais) no STF permanece sujeito a alterações e modulações pelos ministros na composição do Plenário, constituindo um terreno de segurança jurídica instável.
