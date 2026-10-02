# Governo variável — piloto de realismo e jogabilidade

**29/09/2026 · Pesquisa e desenho, sem integração.** Complementa o
[contrato de governo variável](dynamic-government-2026-09-30.md). O Diretor pediu alta fidelidade ao Brasil
com equilíbrio de diversão. Fatos institucionais e propostas de jogo estão separados abaixo.

**Correção do Diretor:** quantidades citadas eram exemplos. Não há número obrigatório de tipos,
ministérios ou encaixes. A arquitetura define repertório e ensaios por necessidade e evidência.

## 1. O que merece virar decisão

**[DECISÃO]** Preservar responsabilidades, instituições, interesses e consequências. Resumir
procedimentos repetitivos. O jogador escolhe projeto, trabalho, responsáveis, recursos e riscos.
A equipe prepara os atos e acompanha a rotina. Isso corresponde à especificação mestra, §1.2:
complexidade aparece quando cria decisão, conflito ou compreensão causal. Visual e botões atuais
permanecem nesta etapa.

| Tema          | O motor preserva                                               | O jogador decide ou entende                              |
| ------------- | -------------------------------------------------------------- | -------------------------------------------------------- |
| Reorganização | Responsabilidades, equipes, recursos, continuidade e vigência. | O que muda, quem ganha poder e qual serviço corre risco. |
| Direito       | Autor competente, instrumento e efeitos da tramitação.         | Caminho, prazo relevante, apoio necessário e risco.      |
| Pessoas       | Passado, preparo por trabalho, interesses e memória.           | Quem nomear e quais limitações compensar.                |
| Administração | Capacidade, carga, dependências e transição.                   | Prioridades; não cada providência operacional.           |
| Política      | Atores afetados, recursos disputados e promessas.              | Com quem negociar e qual custo assumir.                  |

**[DESENHO]** Uma reforma será um pacote revisável no fluxo existente. A Casa Civil apresenta
distribuição inicial explicada; o jogador aceita ou ajusta. Não exigir confirmação individual de
toda atribuição quando a proposta for satisfatória. Interromper a rotina apenas por escolha nova:
verba insuficiente, disputa de destino, perda de vigência ou serviço sem continuidade. Evitar
mensagens repetidas sobre o mesmo conflito ainda não resolvido.

A diversão depende de alternativas com vantagens situacionais, consequências compreensíveis e
possibilidade de recuperação. Ministro preparado pode ter pouco apoio; negociador forte pode
precisar de equipe técnica melhor. Esses custos vêm de características e contexto, sem punição
artificial por profissão ou ideologia. Realismo não exige que toda escolha seja igualmente boa.

## 2. Base temporal e fontes

**[DESENHO]** A data de consulta deste piloto é 29/09/2026. A abertura do jogo está prevista para
2027; fatos posteriores à pesquisa não serão inventados como história. Antes da integração,
congelar a versão institucional e explicitar hipóteses do cenário. Cada save conserva sua versão.

| Fonte primária consultada                                                                                                     | Recorte usado                                                               |
| ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [Constituição Federal](https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm)                          | Arts. 61, 62, 84, 87 e 88: atos, ministros e reorganização.                 |
| [Lei 14.600/2023](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14600.htm)                                    | Arts. 24, 28 e 45: áreas de Defesa, Direitos Humanos e Saúde.               |
| [Decreto 11.341/2023, consolidado](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11341.htm)               | Anexo I, art. 10: atividades da Ouvidoria Nacional de Direitos Humanos.     |
| [Competências do MDHC](https://www.gov.br/mdh/pt-br/acesso-a-informacao/institucional/competencias)                           | Referência às alterações dos Decretos 12.334/2024 e 12.770/2025.            |
| [Lei 8.080/1990](https://www.planalto.gov.br/ccivil_03/leis/l8080.htm)                                                        | Arts. 9, 14-A e 16–18: direção por esfera, pactuação e atribuições do SUS.  |
| [Lei 9.782/1999](https://www.planalto.gov.br/ccivil_03/leis/l9782.htm)                                                        | Arts. 3 e 4: natureza e autonomia administrativa da Anvisa.                 |
| [Legislação institucional da Saúde](https://www.gov.br/saude/pt-br/acesso-a-informacao/institucional/competencias/legislacao) | Decreto 11.798/2023 e alterações indicadas: 12.489/2025 e 12.708/2025.      |
| [Lei Complementar 97/1999](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp97.htm)                                          | Arts. 1–4: autoridade presidencial, estruturas das Forças e assessoramento. |
| [Competências da Defesa](https://www.gov.br/defesa/pt-br/acesso-a-informacao/institucional-2/iv-competencias)                 | Referência à estrutura do Decreto 11.337/2023.                              |

**[VERIFICADO]** A página antiga de
[legislação da Saúde](https://www.gov.br/saude/pt-br/acesso-a-informacao/institucional/legislacao)
ainda menciona o Decreto 11.358/2023; a página de competências acima lista o 11.798/2023 e suas
alterações. O catálogo final terá norma, dispositivo, vigência, data de consulta e estado de revisão.
Uma página institucional antiga, sozinha, não fechará a regra.

## 3. Ajuste necessário na arquitetura

**[DESENHO]** “Responsável principal” indica um papel, não controle total sobre um assunto.
Separar relações: `policyLead`, `executor`, `funder`, `regulator`, `supervisor` e `partner`.
Somente relações afetadas juridicamente entram no ato. Instituições e serviços mantêm identidades;
transferir política não duplica equipe nem incorpora automaticamente autarquia. O mapa `owner`
do experimento é uma projeção estrutural da responsabilidade selecionada, sem esses papéis ainda.

**[VERIFICADO]** O SUS tem direção em cada esfera e pactuação entre gestores. A Anvisa tem
natureza de autarquia especial e autonomia administrativa. Transferir trabalho entre ministérios
não converte municípios ou agência em departamentos do titular. Fontes: Lei 8.080, arts. 9 e 14-A;
Lei 9.782, arts. 3–4.

**[VERIFICADO]** As Forças Armadas têm estruturas próprias, subordinadas ao Ministro da Defesa,
sob autoridade suprema do Presidente. Cada Força tem comandante próprio. Fonte: LC 97, arts. 1,
3 e 4. **[DESENHO]** A função genérica de transferir trabalho não será apresentada como autorização
para reescrever essa cadeia; seus efeitos jurídicos precisam de modelagem específica.

## 4. Treze descrições: decomposição inicial

**[HIPÓTESE]** As tabelas propõem 19 famílias de trabalho para as 13 frases existentes. Ainda
sem pesos: público, instrumento e território podem exigir subdivisões. IDs ingleses são propostas;
não substituem os IDs do inventário nesta etapa. Referência temática não encerra a revisão jurídica.

### Direitos Humanos — quatro descrições, seis famílias

Referências: Lei 14.600, art. 28; Decreto 11.341, Anexo I, art. 10.

| Descrição atual                       | Família: ação e objeto                                                                                            | Instrumento e experiência relevante                       |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Promoção dos direitos humanos         | `rights-policy`: formular políticas por público; `rights-coordination`: articular execução.                       | Planejamento, pactos e acompanhamento de entregas.        |
| Ouvidoria de direitos humanos         | `rights-intake`: receber e examinar manifestações; `rights-followup`: encaminhar casos e acompanhar providências. | Atendimento especializado, gestão de casos e articulação. |
| Educação em direitos humanos          | `rights-education`: coordenar ações educativas sobre direitos.                                                    | Formação, materiais e parcerias educacionais.             |
| Combate à violência e à discriminação | `rights-prevention`: coordenar prevenção e proteção no âmbito de direitos humanos.                                | Programas especializados e redes de proteção.             |

**[VERIFICADO]** A Ouvidoria mantém registros, coordena atendimento telefônico e atua em
articulação com outras instituições; isso não equivale à direção de investigação policial ou
decisão judicial. Fonte: Decreto 11.341, Anexo I, art. 10.

**[DESENHO]** Canais e banco de dados são capacidades do serviço. Transferi-lo preserva casos em
andamento e confidencialidade. Separar atendimento de acompanhamento cria uma interface de
coordenação. Públicos são dimensões explícitas: uma pasta para idosos pode receber esse recorte
sem levar os demais públicos ou duplicar a responsabilidade.

### Saúde — quatro descrições, sete famílias

Referências: Lei 14.600, art. 45; Lei 8.080, arts. 9, 14-A e 16–18.

| Descrição atual                 | Família: ação e objeto                                                                                                                       | Instrumento e experiência relevante                          |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Coordenação do SUS              | `health-policy`: formular diretrizes nacionais; `health-federation`: coordenar atuação federal e pactuação.                                  | Planejamento sanitário, financiamento e negociação.          |
| Vigilância em saúde e sanitária | `health-surveillance`: coordenar vigilância epidemiológica; `sanitary-policy`: coordenar política de vigilância sanitária no âmbito federal. | Informação e articulação dos sistemas; executores separados. |
| Insumos e medicamentos          | `health-supply-policy`: planejar necessidades e abastecimento; `health-procurement`: coordenar aquisições sob responsabilidade federal.      | Demanda, contratação, logística e acompanhamento de oferta.  |
| Pesquisa em saúde               | `health-research`: fomentar e coordenar pesquisa em saúde.                                                                                   | Projetos e cooperação científica.                            |

**[DESENHO]** Nomear alguém não aumenta instantaneamente leitos, estoques ou equipes. Preparo
influencia decisões e execução pelos mecanismos modelados, com capacidades e prazos próprios.
Responsabilidades específicas de agências, fundações, hospitais e demais entidades terão registros
separados antes de conectar o piloto a resultados sanitários.

### Defesa — cinco descrições, seis famílias

Referências: Lei 14.600, art. 24; LC 97, arts. 1–4.

| Descrição atual              | Família: ação e objeto                                                                                                  | Instrumento e experiência relevante                          |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Direção das Forças Armadas   | `defense-supervision`: exercer direção superior ministerial; `joint-defense-planning`: coordenar planejamento conjunto. | Direção estratégica e relação com comandos.                  |
| Política de defesa           | `defense-policy`: formular e acompanhar política e estratégia de defesa.                                                | Planejamento e coordenação político-institucional.           |
| Serviço militar              | `military-service-policy`: coordenar a política de serviço militar.                                                     | Planejamento de pessoal e articulação de executores.         |
| Proteção da Amazônia (Sipam) | `amazon-monitoring`: coordenar operação do Sipam e integração de informações.                                           | Monitoramento territorial e integração de dados.             |
| Defesa cibernética           | `cyber-defense`: coordenar capacidades de defesa no domínio cibernético.                                                | Estratégia, equipes especializadas e coordenação pertinente. |

**[DESENHO]** Experiência militar distingue comando, logística, planejamento, tecnologia e
gestão. Posto elevado não comprova tudo. Diplomacia pode ajudar política e relações internacionais
de defesa, sem virar experiência de comando. Defesa cibernética exige experiência específica.

### Sete lacunas temáticas não explicitadas pelas frases

**[VERIFICADO]** A lei descreve assuntos além dos rótulos resumidos. **[HIPÓTESE]** As sete
famílias abaixo devem ser examinadas; não foram silenciosamente incluídas no inventário:

| ID proposto           | Trabalho a representar                                                 | Referência                     |
| --------------------- | ---------------------------------------------------------------------- | ------------------------------ |
| `rights-cooperation`  | Coordenar e acompanhar cooperação em direitos humanos.                 | Lei 14.600, art. 28, VI.       |
| `health-information`  | Coordenar informações de saúde.                                        | Lei 14.600, art. 45, IV.       |
| `health-prevention`   | Coordenar prevenção e promoção de saúde.                               | Lei 14.600, art. 45, III e VI. |
| `health-industry`     | Desenvolver política para produtos e inovação no complexo da saúde.    | Lei 14.600, art. 45, IX.       |
| `defense-budget`      | Planejar e acompanhar orçamento de defesa.                             | Lei 14.600, art. 24, VIII.     |
| `defense-procurement` | Coordenar política de compras e desenvolvimento de produtos de defesa. | Lei 14.600, art. 24, XV.       |
| `defense-relations`   | Coordenar relações internacionais de defesa.                           | Lei 14.600, art. 24, VII.      |

Total: 26 famílias candidatas, sem pretensão de catálogo completo. Defesa ainda tem ensino,
mobilização e outros assuntos no art. 24 a examinar. Cobrir as frases não cobre toda a instituição.

## 5. Pessoas: comparação sem nota por profissão

**[HIPÓTESE]** Exemplos anônimos de episódios para avaliar a explicação do preparo. Não são
pessoas fixas para adicionar ao jogo. Nenhum recebe nota antes da calibração.

| Pasta            | Experiência conhecida                                                           | Cobertura esperada e lacuna                                             |
| ---------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Direitos Humanos | Dirigiu atendimento de denúncias e pactuou encaminhamentos com redes estaduais. | Direta para ouvidoria; verificar política e educação.                   |
| Direitos Humanos | Coordenou consultas e programas de participação de grupos vulneráveis.          | Articulação; falta demonstrar operação de proteção e atendimento.       |
| Direitos Humanos | Dirigiu equipe jurídica em violações e acompanhou reparação de direitos.        | Experiência jurídica; não presumir direção da rede nacional.            |
| Saúde            | Dirigiu rede pública, pactuação, abastecimento e resposta sanitária.            | Cobertura gerencial ampla; verificar escala e especialidades exercidas. |
| Saúde            | Elaborou orçamento e acompanhou execução financeira de programas sanitários.    | Finanças; lacunas em vigilância e gestão assistencial.                  |
| Saúde            | Dirigiu pesquisa e desenvolvimento de insumos.                                  | Ciência e tecnologia; não presumir gestão de rede assistencial.         |
| Defesa           | Dirigiu planejamento conjunto, logística e administração de recursos militares. | Estratégia e gestão; verificar cibernética e diplomacia.                |
| Defesa           | Conduziu negociações de defesa e acompanhou acordos de cooperação.              | Relações e política; não presumir gestão operacional das Forças.        |
| Defesa           | Dirigiu pesquisa e aquisição de sistemas de defesa.                             | Tecnologia e projetos; falta evidência nas demais funções.              |

O teste difícil: especialista pode ter preparo alto para pasta estreita e parcial para a pasta
completa. Cobertura é investigada por evidência, sem quantidade fixa de tipos ou encaixes.
Apoio da equipe pode reduzir risco de execução sem reescrever a experiência pessoal da ficha.

## 6. Quatro decisões completas

Esta seção é **[DESENHO]** a testar. Efeitos são hipóteses causais, ainda sem valores.

### Manter Direitos Humanos e trocar o ministro

Trabalho, casos e serviços continuam. A lista compara pessoas pelas responsabilidades vigentes.
O jogador escolhe cobertura técnica, apoio e confiança. A troca muda prioridades e coordenação,
sem apagar histórico ou entregar serviço por si.

### Juntar Direitos Humanos com Educação

A proposta conserva serviços especializados, apresenta ganho possível de coordenação educativa
e ampliação do trabalho de um titular. Sugere distribuição de equipes e responsabilidades.
Preparo é recalculado; integração pode trazer benefício e custo de transição simultaneamente.
Dividir fica disponível por ser junção do jogador, sujeito ao ato e às mudanças posteriores.

### Extinguir Direitos Humanos

A Casa Civil agrupa destinos por trabalho e justifica cada um. Educação em direitos pode ter
Educação como alternativa; denúncias exigem capacidade especializada; proteção por público
exige examinar as redes existentes. Não há destino fixo ou aprovação presumida. O jogador aceita
o pacote ou ajusta no fluxo atual. O motor conserva casos, equipe, obrigações e orçamento sob
os atos aplicáveis; contabiliza mudanças e interesses atingidos.

Evitar “extinguir = desastre” e “extinguir = economia”. Boa redistribuição pode funcionar;
descoordenação e interrupção de atendimento podem prejudicar resultados. Reações vêm de fatos,
expectativas e interesses, sem bônus ou punição automática pelo verbo escolhido.

### Criar um Ministério da Saúde Digital

Nome livre é aceito. Busca sugere trabalho modelado; não inventa poderes pelo nome. O pacote
pode transferir coordenação de informação em saúde e um recorte de pesquisa digital, preservando
outros recortes. Avalia candidatos, equipe, recursos, executores, apoio e rota de criação.

Comparar manter na Saúde, criar pasta especializada e coordenar entre estruturas existentes.
A última é alternativa futura de modelagem, não botão novo nesta etapa. Especialização pode
dar foco e criar interfaces; manter pode preservar integração e disputar atenção com prioridades.
Nenhuma alternativa cria capacidade grátis.

O mesmo mecanismo deverá operar com estruturas de tamanhos variáveis. A prova inclui custos, nomeações,
coordenação, recarga e acessibilidade. Este piloto não comprova essa escala nem resolve o hemiciclo.

## 7. Tramitação sem trabalho repetitivo

**[VERIFICADO]** Criar e extinguir ministérios tem disciplina legal; decreto do art. 84, VI, a,
não cria nem extingue órgãos. Medidas provisórias exigem relevância e urgência e apreciação
parlamentar. Referência: Constituição, arts. 61, 62, 84 e 88.

**[DESENHO]** O jogador expressa a reforma; o mecanismo jurídico calcula os caminhos. A equipe
prepara documentos. A escolha presidencial trata de desenho, estratégia de aprovação e risco.
Aprovação, vigência e capacidade de operar são estados diferentes.

**[VERIFICADO]** A perda de eficácia de MP tem disciplina própria para relações constituídas
durante sua vigência. Fonte: Constituição, art. 62, §§3º e 11. **[DESENHO]** O `splitMerge`
estrutural não é reversão jurídica: esta precisará compor normas, histórico, nomeações e
continuidade, mostrando conflitos a resolver. Não simplesmente restaurar uma cópia antiga.

Ações fora da competência seguem resistência e consequências da especificação mestra; não são
rota legal com sucesso automático. Os demais cargos e seus fluxos jurídicos existentes continuam
fora desta alteração.

## 8. Provas de diversão e fidelidade

| Prova                       | Resultado exigido                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------- |
| Reforma explicável          | Jogador identifica ganho pretendido, custo e afetados.                                 |
| Pacote automático           | Aceitar sugestão não exige preencher registros internos.                               |
| Controle real               | Ajustar destino muda trabalho e consequências.                                         |
| Fusão versus especialização | Cada estratégia tem contextos favoráveis; nenhuma domina sempre.                       |
| Continuidade                | Reforma não apaga casos, obrigações, pessoas ou recursos.                              |
| Instituições distintas      | Transferir política não transforma agência, município ou comando em cópia do ministro. |
| Candidato incompleto        | Preparo parcial é escolha possível; equipe e prioridades importam.                     |
| Custo conservado            | Fatiamento não multiplica dinheiro, capacidade ou apoio.                               |
| Conflito com saída          | Reforma ruim permite corrigir ou negociar pagando consequências.                       |
| Informação honesta          | Incerteza é visível; previsão usa a visão presidencial.                                |

Medir em sessões: decisões úteis por reforma, passos repetitivos, compreensão das consequências
e concentração das estratégias escolhidas. Comparar ao fluxo atual. Critérios quantitativos
dependem do ensaio, não são fatos institucionais.

## 9. Qualidade do raciocínio: como tentar derrubar o próprio plano

**[DECISÃO]** O Diretor destacou a inteligência do planejamento como prioridade. Nesta proposta,
isso exige explicitar premissas, procurar contraexemplos e mudar o modelo quando a evidência
contrariar a solução. Mais campos, regras ou texto não demonstram melhor planejamento.

### Premissas revistas antes de implementar

| Premissa tentadora                                            | Por que falha                                                                                    | Decisão de arquitetura                                                              |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Todo trabalho tem um único dono, logo basta trocar esse dono. | Política, financiamento, regulação e execução podem pertencer a atores distintos.                | Reorganizar relações tipadas; preservar instituições e serviços.                    |
| Ministérios parecidos são bons destinos.                      | Similaridade de nome não demonstra capacidade nem compatibilidade de instrumento.                | Avaliar continuidade, equipes, dependências e conflito de papéis por função.        |
| Um especialista alto em uma área será alto na pasta toda.     | Pode dominar atendimento e desconhecer coordenação nacional ou orçamento.                        | Avaliar o conjunto real e distinguir direção ministerial de execução especializada. |
| Mais ministérios sempre custam uma quantia fixa adicional.    | Pode haver remanejamento e serviços compartilhados; transição e estrutura têm custos diferentes. | Calcular diferença de recursos antes/depois, sem cobrar duas vezes a mesma equipe.  |
| Fusão sempre melhora coordenação ou sempre sobrecarrega.      | Depende das interfaces removidas, da diversidade do trabalho e da organização interna.           | Derivar efeitos das relações e da carga, sem bônus ou penalidade pelo verbo.        |
| Trinta carreiras que aparecem numa tabela provaram cobertura. | A tabela pode ter sido escrita para confirmar a própria hipótese.                                | Usar currículos testemunha fixos e avaliações independentes do encaixe desejado.    |
| Quanto mais minucioso o catálogo, mais realista.              | Detalhe sem consequência cria manutenção e trabalho repetitivo.                                  | Separar funções quando muda decisão, autoridade, destino, experiência ou efeito.    |

**[DESENHO]** O governo será tratado como uma rede de trabalho e instituições. Ministérios
agrupam responsabilidades nessa rede. O primeiro recorte só modela relações necessárias aos
casos estudados; não tenta simular todos os processos do Estado antes de produzir uma decisão útil.

### Comparação obrigatória com manter a estrutura

Para cada reforma, construir um contrafactual com o mesmo estado inicial, recursos e informação:
o que aconteceria se o governo mantivesse a estrutura e atacasse o problema por gestão?

1. Identificar o problema: fila de atendimento, baixa coordenação, pouca atenção ou disputa de poder.
2. Identificar o mecanismo que a reforma realmente muda: chefe, recurso, interface ou prioridade.
3. Comparar continuidade dos serviços, capacidade, transição, coordenação e reação dos atores.
4. Separar benefício esperado, custo certo e incerteza. Mostrar por que os resultados diferem.
5. Se a reforma só mudar o nome, manter iguais os efeitos materiais. Comunicação e expectativas
   podem mudar se houver mecanismo específico; não atribuir capacidade por retórica.

Exemplo: criar Saúde Digital pode dar direção dedicada a sistemas e integração de dados, mas
se equipes e autoridade continuarem sem condições de executar, o nome novo não resolve o gargalo.
Se a dificuldade era somente contratar um serviço, reorganizar todo o governo pode ser excessivo.
Se diferentes políticas disputavam uma equipe sem prioridade definida, mudar a coordenação pode
ser útil. Esses são cenários de ensaio, não afirmações empíricas já medidas sobre o Brasil.

### Contraexemplos para o primeiro recorte executável

| Caso adversarial                                                                                       | Falha que deve revelar                                          |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Pessoa com o mesmo currículo, mas título de cargo mais prestigioso.                                    | Nota baseada em título em vez de experiência.                   |
| Duas pastas com nomes diferentes e exatamente o mesmo trabalho.                                        | Nota ou sugestão dependente do nome.                            |
| Mesma palavra em direitos humanos, defesa e saúde, com instrumentos diferentes.                        | Correspondência lexical falsa.                                  |
| Transferir função sem equipe, verba ou acesso à informação necessário.                                 | Confusão entre autoridade formal e capacidade efetiva.          |
| Transferir função e conservar a equipe já custeada.                                                    | Cobrança duplicada ou capacidade duplicada.                     |
| Dividir e reunir a mesma estrutura repetidamente.                                                      | Geração gratuita de candidatos, apoio, recursos ou experiência. |
| Entregar 80 pastas a pessoas plausíveis, mas sobrecarregar as mesmas estruturas de execução.           | Contagem de ministros confundida com capacidade do Estado.      |
| Gerador produz o currículo depois de conhecer a nota que precisa obter.                                | Validação circular da cobertura de 30 tipos.                    |
| Juntar educação em direitos com Educação melhora uma interface e enfraquece atendimento especializado. | Modelo incapaz de representar ganho e perda simultâneos.        |
| Reforma melhora o indicador agregado enquanto piora atendimento de um público específico.              | Média escondendo uma consequência que importa para a decisão.   |

### Ordem por incerteza, não pelo tamanho da lista

O próximo recorte executável deve provar primeiro três questões: responsabilidades tipadas
representam as instituições? Experiência explica diferenças sem uma tabela por ministério?
O jogador entende uma escolha com ganho e perda reais usando os controles existentes?

Somente após esse recorte se sustentar, expandir os dados. Se falhar, corrigir a abstração antes
de repetir o defeito nas outras 139 descrições. Não há meta numérica de trajetórias ou ministérios;
uma lacuna fica registrada e provoca revisão, nunca uma nota artificial para fechar contagem.
Revisão independente precisa procurar falhas, não apenas aprovar a intenção. Diversão exige
observação de uso pelo jogador; não pode ser declarada só porque o modelo parece convincente.

## 10. Entrega e sequência

### Recorte operacional autorizado em 30/09

**[HIPÓTESE DE ENSAIO]** O próximo experimento executa trabalhos conhecidos em períodos
abstratos: coordenação, seguida de execução. Equipes, filas, fundos e registros têm IDs estáveis.
Cada equipe dispõe de uma capacidade compartilhada por período; vários destinos nunca copiam
essa capacidade. O custo variável de uma entrega sai do fundo de seu executor, uma única vez.
Trabalho de transição consome a equipe existente; não cobra novamente sua folha já financiada.
Os números dos casos são unidades sintéticas, sem equivalência com reais, pessoas ou semanas.

Trocar condução ministerial não transfere equipe, dinheiro, acesso à informação, executores nem
vínculo jurídico. Um repasse explícito de coordenação consome esforço antes de produzir efeito.
Compartilhar a equipe preserva uma única capacidade. Casos já coordenados continuam no executor
mesmo se o ministério de origem ficar inativo; a pendência jurídica continua separada e visível.
O ensaio não simula a aprovação do ato nem autoriza acesso real a dados protegidos.

Comparar as quatro escolhas com a mesma abertura e prioridades. Renomear ou trocar currículo
sem mudar gestão preserva resultados materiais. Fusão e especialização precisam mostrar ganhos
e perdas por trabalho, com a transição no cálculo. Corrigir a reforma não devolve gasto nem apaga
entregas e filas. A previsão executa a mesma função sobre um retrato conhecido completo; sem
esse retrato, declara incerteza e não consulta a verdade oculta. A integração terá de provar a
construção desse retrato; os casos sintéticos fornecem todos os fatos de forma explícita.

Antes de aprovar: conservação de capacidade e caixa, informação necessária, concorrência entre
trabalhos, transição, recarga, continuidade e correção sem restauração de snapshot. Revisão
independente, consequências políticas, custos reais e teste de uso permanecem pendentes.

### Recorte estrutural — estado em 29/09

Concluídos: recorte de fontes, matriz das 13 descrições, 26 famílias candidatas, nove exemplos
de experiência, quatro decisões e critérios de diversão/fidelidade. Um primeiro ensaio isolado
em `prototypes/government/pilot.mjs` usa sete trabalhos, vínculos por papel e quatro currículos
fixos. Ele compara o mesmo candidato ao manter a pasta e ao fundi-la: a Ouvidoria, a Anvisa e
as Forças Armadas conservam seus papéis registrados quando muda a condução ministerial. Se a
pasta à qual uma instituição está vinculada fica inativa, o ensaio aponta a relação pendente:
isso ocorre com a Ouvidoria ao extinguir Direitos Humanos e com as Forças Armadas ao extinguir
Defesa. Transferir a política sanitária sem extinguir Saúde deixa a Anvisa vinculada à pasta
ativa. A avaliação distingue evidência direta, transferível, não demonstrada e desconhecida;
não atribui nota. As 39 provas do experimento passaram na rodada de 29/09. Um inventário
sintético de casos e equipes agora acusa perda, criação, transferência e vínculo pendente.
O ensaio não calcula capacidade, custo, tramitação, apoio político ou efeito material.
Nenhum prazo ou efeito foi calibrado.

As quatro escolhas da seção 6 agora têm comparação estrutural executável: manter e trocar titular,
fundir, extinguir com destino por trabalho e criar Saúde Digital com informação em saúde.
O resultado expõe movimentação de trabalho, preparo qualitativo e continuidade pendente.
Ainda não permite escolher a melhor estratégia, pois não mede efeitos nem custos.

### Auditoria adversarial do primeiro recorte

Sete falhas reproduzidas antes da correção: mudar o tipo de um caso sem mudar seu ID não
aparecia na comparação; catálogo duplicado ou incompleto gerava parecer parcial; episódios
com o mesmo ID podiam sustentar fatos distintos; uma pessoa cabia em duas pastas sem aviso;
exonerar sem reformar deixava uma vaga invisível; um episódio oculto perdia sua incerteza quando
havia outro conhecido sem relação com o trabalho; e uma nomeação remanescente em pasta extinta
derrubava o parecer. O parecer agora acusa os sete casos. São provas de integridade do recorte,
não validação de equilíbrio ou de viabilidade institucional.
No motor estrutural, a validação também passou a acusar um ID repetido no inventário recarregado;
antes, a conversão direta para `Set` escondia a duplicidade.
As sondas com sementes 20270929 e 20270930 executaram, cada uma, 200 sequências de 20 a 80
reformas. Exercitaram os sete gestos, conservação do inventário, imutabilidade, save/recarga e
recursos do piloto sem achar nova violação. Isso não mede custos, equilíbrio nem viabilidade legal.

A releitura reproduziu quatro contraexemplos adicionais: presença de episódio oculto alterava
o parecer com a mesma evidência visível; ID oculto repetido derrubava a avaliação; a completude
conhecida do registro não distinguia lacuna de incerteza; e uma renomeação que voltava ao nome
da fusão era apagada pela divisão. A avaliação agora valida e usa somente episódios conhecidos.
`knownHistoryComplete` é informação explícita da Presidência, com valor ausente tratado como
registro incompleto. Nos quatro currículos sintéticos, a completude é declarada para o recorte.
Uma terceira prova por propriedades usa 200 históricos, semente 20270931, mantendo a informação
presidencial constante enquanto varia a parte oculta. Nomes têm revisão própria, preservada na
recarga e nas inversas aninhadas; não se infere identidade comparando o texto atual.
As 39 provas do experimento entram no portão canônico: o antigo `government.mjs` (hoje dividido em `tests/suites/government-*.mjs`) registra
as 36 provas locais e `government-fuzz.mjs` executa as três provas por propriedades.
O portão completo passou com 462 testes, passeio nas duas resoluções e 60 ações do macaco sem
achados. A tipagem explícita do experimento passou também com `noUncheckedIndexedAccess`.
As seis sondas de 48 meses reproduziram a série do jogo principal; não exercitam este protótipo.

Próxima execução: conferir as relações propostas com revisão independente e episódios de
carreira reais como casos de referência; decompor escopos e testar efeitos sobre continuidade
de equipes, casos e recursos nas quatro decisões. Só então ampliar às demais descrições e às funções
omitidas pelos rótulos. Integração exige modelo jurídico, save, efeitos e interface verificados.

### Recorte operacional — estado em 30/09

Implementado isoladamente em `prototypes/government/operations.mjs`, com os casos e 17 provas
em arquivos vizinhos; a prova por propriedades está em `tests/suites/government-operations-fuzz.mjs`.
As quatro escolhas têm execução de coordenação e entrega, filas, verba,
registros e transição explícita. Conservam equipes, executores e IDs de trabalho; compartilhar
não duplica capacidade. A prova por propriedades varia recursos, preços e prioridades em 200
cenários de seis períodos, semente 20270930. A previsão usa a mesma função com o retrato conhecido
completo; retrato parcial produz incerteza sem número. O chamador ainda declara sua completude.

No caso de fusão, educação em direitos chega antes e denúncias depois; o total do primeiro período
é igual ao de manter a estrutura, por isso agregado não basta. No caso digital, remanejar a equipe
antecipa informação e deixa outros trabalhos sem coordenação. Mudar prioridade sem reformar
entrega informação ainda antes: a vantagem do recorte não exige criar uma pasta. Correção com
compartilhamento recupera a fila consumindo esforço, sem criar equipe ou devolver dinheiro gasto.
As quatro comparações têm abertura e prioridade iguais; o quinto contrafactual muda só prioridade.

[Evidência reproduzível](evidence/government-operations-2026-09-30.json) e
[instruções de revisão](../../prototypes/government/README.md). Valores e períodos são sintéticos.
Não foram implementadas chegadas contínuas, custos reais de direção, folha recorrente, reação
política, conversão de experiência em gestão, vigência jurídica, autorização de dados ou UI.
Antes de expandir: revisão independente do recorte e das hipóteses, construção verificável da
visão presidencial, ligação entre pessoas e gestão, cenário com demanda contínua e teste de uso.
O motor principal e seu save permanecem sem integração; este ensaio não prova equilíbrio.

O portão completo de 30/09 passou com 480 testes, incluindo 57 do experimento, 13 guardas,
tipos, lint, formatação, links, passeio nas duas resoluções e 60 ações do macaco sem achados.
A tipagem explícita também passou com `noUncheckedIndexedAccess` e `exactOptionalPropertyTypes`.
O navegador exercita o jogo existente; o recorte operacional ainda não tem interface integrada.

### Demanda contínua — contrato do próximo ensaio

**[HIPÓTESE SINTÉTICA]** Entradas de trabalho acrescentam obrigações com ID novo e esforço
inicial íntegro; casos concluídos continuam no histórico. Recurso novo exige recebimento
identificado por fundo, origem e valor. Repetir seu ID não credita caixa novamente. Conservar
`abertura + recebimentos = saldo + gasto`, sem alterar o orçamento inicial para esconder entradas.
Os recebimentos são dados externos do ensaio; não são receita ou aprovação orçamentária do jogo.

Comparar fluxo abaixo da capacidade, sobrecarga com caixa suficiente, falta de caixa e recuperação
com capacidade disponível. Prioridades usam a mesma função operacional; acompanhar fila e espera
por trabalho. Caixa adicional não corrige equipe insuficiente. Reduzir demanda é uma hipótese
de cenário, nunca apagar casos. Conservação, recarga e imutabilidade seguem obrigatórias.

Implementado em `prototypes/government/demand.mjs`, com oito provas locais e uma prova de 100
fluxos de oito períodos na suíte canônica, semente 20270932. Cinco cenários de 12 períodos
separam escassez de caixa e de capacidade. Na sobrecarga, 24 entradas deixam 12 casos pendentes
mesmo com saldo; na recuperação, oito unidades recebidas permitem concluir 12 casos usando
capacidade disponível. [Evidência](evidence/government-demand-2026-09-30.json).

A prova de retomada revelou reinício do calendário e repetição de crédito. A correção parte
do próximo período, verifica as entradas passadas e preserva o histórico. O orçamento inicial
não muda. A revisão independente foi tentada no Claude, mas retornou limite semanal;
[registro](evidence/government-review-attempt-2026-09-30.json). Sem análise ou aprovação.
Nesse recorte ficaram pendentes experiência ligada à gestão, fontes reais, vigência, visão
presidencial e uso. A extensão comportamental abaixo trata da primeira pendência.

Portão desta extensão: `validate` passou com 489 testes, incluindo 66 do experimento, 13 guardas,
tipos, lint, formato, links, passeio nas duas resoluções e macaco sem achados. Tipagem explícita
estrita e `git diff --check` passaram. A prova de navegador continua sendo a do jogo principal.

### Experiência e gestão — recorte comportamental

**[HIPÓTESE DE ENSAIO]** Comparar uma agenda delegada que prefere trabalhos com experiência
conhecida e uma agenda que segue a ordem presidencial. A primeira é uma estratégia de ensaio,
não uma lei sobre ministros. Para a mesma estratégia e prioridades, episódios conhecidos podem
mudar a sequência de trabalhos e suas entregas. Fama, título e nome da pasta não entram na conta.
Não há bônus de capacidade, nota perfeita nem obrigação de escolher trabalho familiar.

Consulta explícita à equipe ocupa sua capacidade existente. O parecer chega ao fim do período
em que se completa; só orienta a próxima agenda. Experiência direta ou transferível do assessor
é evidência de apoio naquele trabalho; não vira experiência pessoal do ministro nem autorização
de acesso a dados. Consulta sem evidência compatível continua possível e não fabrica cobertura.
Registrar fonte, esforço, parecer, prioridade escolhida e execução. Histórico e recarga preservam
o custo, sem reemitir consulta concluída. Informações ocultas não alteram o parecer conhecido.

O recorte verifica um mecanismo de decisão, não habilidade gerencial geral, qualidade substantiva
ou equilíbrio. Ordem presidencial pode resolver a prioridade sem reforma ou consulta; testar
esse contrafactual para não favorecer artificialmente pessoa ou estrutura.

Implementado em `prototypes/government/management.mjs`, com oito provas na suíte canônica.
A consulta reserva capacidade na mesma execução operacional; por hipótese explícita, ocorre
antes de repasses e trabalhos, por ordem de solicitação. O parecer fica na pasta destinatária.
[Quatro comparações reproduzíveis](evidence/government-management-2026-09-30.json): o educador
entrega educação primeiro na agenda familiar; com ordem presidencial, entrega atendimento no
primeiro período. A consulta ao ouvidor entrega atendimento no segundo e conclui os três
trabalhos no quarto, contra o terceiro sem consulta. Nenhum cenário cria equipe ou verba.
Não converter esse resultado em lei de comportamento ou benefício garantido da consulta.
Revisão independente, fontes reais, retrato presidencial, custos, vigência e uso seguem abertos.

## 11. Transformar o protótipo da posse — execução em 30/09

**Escopo definido pelo Diretor:** transformar o funcionamento do protótipo que ele está
testando. Auditar e aprimorar durante o uso. Integrar o jogo completo, o Gabinete, a estatal
ou o mandato de 2027 não é requisito desta entrega. O contrato de governo variável continua
em [dynamic-government.md](dynamic-government-2026-09-30.md); esta seção organiza sua aplicação na tela.

### Estado concreto e material aproveitável

| Frente           | O que existe                                                                                              | O que falta na experiência da posse                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Interface        | Fonte v2o e runtime do Claude preservados; controles de reforma ligados no mesmo painel.                  | Currículos e consequências nas fichas; continuar corrigindo achados de uso pela referência visual.            |
| Estrutura        | Criar, transferir, renomear, juntar, extinguir e desfazer ligados ao estado canônico por `structure.mjs`. | Formalizar propostas, vínculos institucionais, custo e vigência; operações pendentes não mudam o estado.      |
| Atribuições      | 152 frases provisórias com IDs conservados e busca por palavras-chave nos trabalhos atuais.               | Decompor e conferir os escopos antes de afirmar cobertura institucional completa.                             |
| Currículos       | Piloto com episódios conhecidos e avaliação direta, transferível, não demonstrada ou desconhecida.        | Levar a evidência às fichas; o catálogo visual ainda usa preparo definido previamente.                        |
| Pessoas          | Catálogo visual e proposta de geração por semente.                                                        | Cadastro único independente da pasta, episódios coerentes, disponibilidade e indicações do mesmo cadastro.    |
| Consequências    | Filas, equipes, recursos, demanda e gestão em cenários sintéticos executáveis.                            | Mostrar comparações compreensíveis no painel, com unidades declaradas e sem inventar custos brasileiros.      |
| Base parlamentar | Ponte experimental consulta a função estrutural do motor para a abertura sem reforma.                     | Resolver o valor político da estrutura variável; depois de uma reforma a ponte declara a estimativa pendente. |
| Sessão de teste  | `engine.html` isolado; F5 recomeça com a animação do Claude e conserva as chaves do jogo.                 | Continuar a observação do uso; ampliar cobertura de zoom e crescimento conforme achados.                      |

Os testes do jogo principal e os cenários de terminal não demonstram que essas regras já
funcionam nos botões do protótipo. A evidência de cada entrega precisa incluir o gesto na tela.

**Preservar a UI aprovada do Claude:** fonte v2o e `live.html` são a referência visual.
Manter hemiciclo, ícones, painéis, fichas, hover, escala e controles existentes. Trocar a origem
dos dados e a ação de um gesto exige comparação na tela; não redesenhar esses elementos por
conveniência da implementação. A [auditoria linha por linha](evidence/posse-ui-line-audit-2026-09-30.md)
compara integralmente CSS e HTML e registra os 47 blocos de diferença. Dezesseis métodos
de interação são idênticos; os dois adaptados mudam somente inicialização e texto de estimativa.
O navegador conferiu 42 percursos de comparação, 16 aberturas/recargas com movimento,
quatro percursos de transições ministeriais, oito de teclado e movimento reduzido e criação,
transferência e renomeação nas duas alturas. Geometria, keyframes, fichas, ícones e superfícies
foram comparados. Isso não cobre toda combinação de conteúdo, zoom ou escala possível;
a auditoria visual acompanha cada nova ligação.

### Ordem das entregas

**A · Estabilizar a sessão e os gestos.** Reproduzir cada relato com página, sequência e
resultado. F5 abre a criação do Presidente sem nomeações, reformas, seleção ou foto anterior;
o rascunho da versão experimental anterior é descartado. Nomear, trocar titular, navegar,
voltar à estrutura e concluir a posse continuam funcionando. Verificar menus, fechamento,
foco, lista, rolagem e erros de console. Manter uma fila de defeitos reproduzidos separada dos
riscos ainda sem prova. Entregar a correção pequena imediatamente, com regressão no navegador.

Estado de A: o teste de recarga falhou antes da correção e passou depois em 1440×980 e 1440×900,
incluindo rascunho antigo, dois reinícios seguidos, nomeação e captura. Quatro chaves do jogo
principal conservaram seus conteúdos. [Evidência](evidence/posse-reset-2026-09-30.json).
Na recuperação após o desligamento, a página voltou a ser gerada com a fachada atual.
Reproduzida e corrigida também a exposição do template cru durante a carga ESM: a ocultação
inicial conserva a entrada original, com zero quadros expostos em 16 cenários. CSS, tempos
e curvas do Claude não mudaram. Teclado, foco e movimento reduzido foram comparados à referência.
Isso não encerra a observação de todos os conteúdos e configurações futuras.

**B · Fazer as reformas alterarem uma estrutura única.** Adaptar os controles existentes para
`openingGovernment`, `reformGovernment` e suas consultas. A tela projeta esse estado para
anéis, painel e nomes; não calcula uma segunda versão da reforma. Os IDs dos órgãos e trabalhos
permanecem independentes dos rótulos. Estado visual transitório guarda seleção, filtro e foco,
sem ser a origem das responsabilidades. Aplicar o pacote inteiro ou preservar o estado anterior
quando a proposta estiver incompleta; explicar o que falta antes de confirmar.

Sequência de B realizada: juntar duas pastas e desfazer pela tela, conservando as atribuições e
mostrando a situação do titular; depois extinção com destinos por trabalho, recriação,
criação com trabalho transferido e renomeação. Destinos vêm dos órgãos ativos; nome livre e
atribuições ajudam a encontrar os destinos, sem restringir o repertório. A proposta da Casa Civil
precisará apontar fatos de capacidade, dependências e recursos; precedentes históricos e uma
tabela de ministérios próximos não participam dessa decisão. Onde esses fatos faltam, a
distribuição permanece pendente; o jogador pode escolher por trabalho ou em conjunto.

Estado em 30/09 após recuperar a sessão: juntar/desfazer e extinguir/recriar ministérios
mapeados estão ligados ao estado canônico na tela. A consulta projeta os destinos atuais;
o histórico usa revisões por trabalho para conservar transferências posteriores. Uma pasta
recriada pode voltar vazia. A cadeia Turismo → Cultura → Educação, seguida de recriação de
Turismo antes de Cultura, conserva as 152 atribuições e mostra essa situação. Voltar a 38
órgãos não recupera a estimativa de apoio se as responsabilidades ainda diferem da abertura.
Criação com nome livre e atribuições por ID, transferência, renomeação e cancelamento estão
ligados ao mesmo estado. Os três atalhos anteriores de divisão também o usam. Pastas vazias
são possíveis; seu nome não fabrica trabalho, capacidade ou apoio. Cancelar uma criação
conserva trabalhos já transferidos para fora; quando um destino anterior não está ativo ou
há trabalhos recebidos depois, a distribuição precisa ser escolhida na extinção.
Reformas estruturais de órgãos da Presidência mantêm a proposta e a estrutura quando o vínculo
institucional está pendente. A regressão reproduziu a perda do estado após combinar pasta
criada e Casa Civil e passou depois da correção. A AGU mantém sua proposta de PEC.

`work-search.mjs` alimenta o campo do seletor existente. “Segurança” mostra os escopos público,
alimentar e da informação; negação e termos desconhecidos são exercitados na tela. Foram
retiradas as tabelas de precedentes, destinos fixos e parceiros fixos, as sugestões históricas
de nome e a reação genérica. Fonte e `live.html` permanecem preservados para comparação.
[Prova do navegador](evidence/posse-comparison-recovery-2026-09-30.json): duas versões e duas
resoluções, incluindo a cadeia, campos, filtros, hover, nomeações, foto e dois F5 por caso.
O novo campo usa o CSS existente; catálogo visual e geometria inicial permanecem iguais.
[Criação, nome livre e transferência](evidence/posse-reforms-2026-09-30.json) têm percurso
próprio nas duas resoluções, incluindo remanejamento da mesma pessoa e cancelamento posterior.
[Movimento](evidence/posse-motion-2026-09-30.json) confronta 16 aberturas/recargas e as
transições dos ministérios. A preparação da versão nova exibia o template antes do runtime;
ocultá-lo até a montagem eliminou esse intervalo, conservando `rise` e o CSS original.

Aceite de B: cada atribuição mantém identidade e destino; nomeações não duplicam pessoas;
vaga e vínculo institucional pendente aparecem. Desfazer uma junção não apaga uma transferência
posterior nem uma renomeação independente. Alterar só o nome não altera funções, preparo ou
apoio. O navegador exerce a cadeia completa de gestos, incluindo cancelamento e repetição.

**C · Tornar os currículos úteis na escolha.** Conectar o recorte já exercitado às fichas e à
comparação entre candidatos. Mostrar quais trabalhos têm evidência, quais têm lacuna e quais
permanecem desconhecidos. O currículo pertence à pessoa e não muda ao visitar outra pasta.
Uma fusão recalcula a cobertura dessa mesma pessoa sobre o conjunto novo de trabalhos.
Fama e afinidade ficam separadas da experiência; informação oculta não modifica o parecer.

Começar com os episódios coerentes existentes para verificar a leitura na tela. As fichas
sem episódios suficientes indicam avaliação pendente; não deduzir biografia de profissão ou
do preparo antigo. Depois gerar e materializar o cadastro por semente, com cronologia, escala,
resultados e origem conhecidos. Filtrar, ordenar, navegar e passar o mouse não sorteiam pessoas.
Indicação partidária usa esse cadastro. A mesma pessoa mantém ID, currículo e ocupação entre
consultas. Ampliação depende de cobertura observada, sem cotas de trajetórias ou pastas.

Aceite de C: comparar a mesma pessoa antes e depois de uma reforma, duas pessoas com título
igual e histórias distintas, cargo com o mesmo trabalho e outro nome, currículo incompleto e
dados ocultos alterados. Explicar o resultado na ficha. A escala de 1 a 6 só substitui os
números legados após casos de referência, cortes e limites aprovados; não prometer nota 6.

**D · Mostrar consequências e apoio para a decisão.** Conectar as comparações do piloto ao
painel existente: o que muda de responsabilidade, quem continua executando, que equipe disputa
trabalho e onde falta informação ou recurso. Usar a mesma execução de operações e gestão para
prever e resolver o caso. Comparar reforma com manter e mudar prioridade, com a mesma abertura.
Se o ensaio usa unidades sintéticas, dizer isso; não apresentá-las como reais ou semanas.

Para a base, definir primeiro como responsabilidades, recursos e poder ativo se traduzem em
valor político. Criar pastas vazias, fatiar o mesmo trabalho ou desfazer e refazer não pode
fabricar apoio. Não reaproveitar o denominador fixo de 38 cadeiras como se representasse toda
estrutura variável. A consulta, a contagem e os pontos da Câmara usam a mesma regra; estimativa
estrutural não é voto garantido nem previsão exata do mês seguinte. Onde falta modelo, manter
a incerteza explícita também nas etiquetas e nas comparações de candidatos.

Aceite de D: a escolha expõe ganho e perda por trabalho, preserva caixa e capacidade, e admite
correção sem apagar entregas ou devolver gasto. Parecer consome tempo e não concede experiência
ou acesso automaticamente. Nenhuma reforma é superior só por aumentar o número de pastas.

**E · Ampliar pela observação do teste.** Expandir atribuições e trajetórias conforme os casos
que o Diretor tentar e as lacunas verificadas. Exercitar reforma encadeada, concentração e
crescimento, sem tamanho final obrigatório. Conferir teclado, foco, alvos acessíveis, zoom e
resoluções; medir antes de trocar o hemiciclo ou a estratégia de atualização. Reaproveitar
os testes históricos de hover e fichas quando ainda corresponderem ao novo comportamento.
Cada incremento entrega um efeito observável no mesmo protótipo.

### Decisões que ainda exigem raciocínio e prova

1. **Granularidade:** uma frase pode reunir trabalhos e papéis diferentes. Definir a unidade
   que permite transferir responsabilidade sem esconder executores, autonomia ou escopo.
2. **Preparo:** calibrar evidência, direção, escala, amplitude e lacunas críticas; não usar
   média simples, palavras iguais ou título prestigioso como experiência.
3. **Cadastro e aceitação:** definir disponibilidade, incompatibilidades, interesses e custo
   de buscar ou convidar alguém. A regra legada de recusa por afinidade precisa de revisão;
   listar um candidato não prova que o convite foi aceito.
4. **Poder político:** estabelecer o valor da pasta por conteúdo e contexto, o efeito de uma
   vaga e o ritmo da reação partidária. Testar o incentivo antes de ampliar os números exibidos.
5. **Reforma e vigência:** distinguir estrutura desejada, proposta e efeito efetivo. O protótipo
   pode ensaiar uma configuração; não apresentar esse ensaio como aprovação jurídica automática.
6. **Gestão e informação:** provar de onde vem o retrato conhecido, a disponibilidade da equipe
   e o efeito da consulta. Verificar se o custo e o resultado são compreensíveis na decisão.
7. **Interface e escala:** escolher quando resumir, pedir destino ou mostrar conflito, e como
   manter os alvos acessíveis quando os anéis não comportarem a configuração.

Detalhes abertos recebem hipótese e caso de contraste antes do código. Pesquisa normativa
confere fontes primárias e vigência; valores sintéticos não viram calibragem por conveniência.
Auditoria do autor e teste humano orientam ajustes, mas não substituem a revisão independente
antes de fechar sistemas importantes. A tentativa anterior do Claude segue sem análise por
limite semanal; não repetir sem mudança externa. Esse limite não impede testar o protótipo.

### Regra para o próximo lote

Fechar a lacuna institucional de B com proposta, vínculo e vigência definidos; não substituir
o estado canônico pela distribuição legada quando uma operação permanece pendente.
Prosseguir em C: ligar episódios conhecidos às fichas, sem inventar currículo ou
converter as notas legadas em evidência. Não ampliar o catálogo primeiro. Se surgir defeito
reproduzível que interrompe o teste, corrigir
antes. Antes de cada alteração, escrever o comportamento esperado; depois reproduzir o gesto,
verificar o resultado e registrar evidência. A validação do repositório protege contratos,
mas só o navegador prova a ligação com a tela e o Diretor avalia a experiência.
