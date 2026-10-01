# Governo variável — contrato de implementação

> Decisão do Diretor do Jogo em 28/09/2026: ministérios e pessoas da posse deixam de ser listas de
> destinos e fichas por cadeira. Este documento descreve o contrato novo. O protótipo v2o é a
> referência visual; seus dados fixos são um retrato anterior.

**Estado ao encerrar em 28/09:** contrato em elaboração; o ensaio estrutural está em
`prototypes/government/`, sem integração ao jogo, ao save ou à posse. A implementação foi
interrompida a pedido do Diretor para encerrar a sessão. Em 29/09 foram autorizadas correções
pontuais no experimento após revisão; a integração continua pendente. As provas abaixo são metas de aceite,
não resultados já obtidos. Consulte o README do experimento antes de retomar.

O piloto isolado de 29/09 representa sete trabalhos em quatro ministérios, relações institucionais
tipadas e evidência qualitativa de quatro currículos. Ele não fecha o preparo de 1 a 6, a
continuidade de serviços ou a rota jurídica; esses continuam como critérios de integração.

## Unidade do sistema

**Correção expressa do Diretor em 29/09:** números como 30 trajetórias e 80 ministérios eram
exemplos, não limites, cotas ou critérios de aceite. Cabe à arquitetura definir e justificar
granularidade, repertório e ensaios de escala. Também ficam retiradas as cotas de encaixes e a
garantia de preparo máximo por tipo que o planejamento havia derivado daqueles exemplos.

Direção de 29/09: alta fidelidade institucional com decisões divertidas e rotina administrativa
resumida. O [piloto de realismo e jogabilidade](government-pilot-2026-09-30.md) aplica essa direção a Direitos
Humanos, Saúde e Defesa, com fontes primárias, relações institucionais e contraexemplos.

Uma **competência** é um trabalho identificável do Estado. Tem ID estável, descrição em português,
verbo, objeto, público ou território quando aplicável, instrumento, proveniência, termos de busca
e vínculos com programas existentes. A frase resumida da posse é material de partida para revisão,
não uma nova autorização legal. Competências com o mesmo substantivo podem ser diferentes: receber
denúncias de direitos humanos e manter a ouvidoria comum de um órgão não são o mesmo trabalho.

Cada competência tem exatamente um responsável principal ativo, salvo uma lacuna expressa que o
jogo deve mostrar e cobrar. Participação conjunta e consulta são relações separadas. Reformar um
ministério conserva IDs e trabalho; não cria receita, capacidade nem programa. Os oito indicadores
de `src/data/areas.mjs` e os 38 programas continuam sendo resultados e rubricas, não ministérios.

O responsável principal é definido por papel: conduzir política, executar, financiar, regular ou
supervisionar não são sinônimos. O piloto detalha essa revisão: transferir uma política não altera
automaticamente executores, autonomia ou cadeia de comando. O mapa estrutural do experimento
ainda não implementa essas relações.

Um **órgão** tem ID independente do nome, tipo jurídico, estado de vigência e titular. Os 32
ministérios da abertura são a configuração inicial. Os cinco cargos da Presidência e a AGU têm
tipos e caminhos próprios. A configuração ativa fica no save; estruturas mais concentradas ou
mais especializadas são estados da mesma partida. Um órgão criado pode não receber competência; isso custa
estrutura, sem produzir benefício material por seu nome.

Um **ato** registra a operação, as competências afetadas, a estrutura anterior, a rota jurídica,
a vigência e o resultado. Proposta, vigência provisória, aprovação, rejeição e consolidação são
fases distintas. Desfazer uma junção feita pelo jogador usa sua trilha; trabalho transferido depois
da junção não volta silenciosamente. A regra jurídica é consultada pelo mecanismo de normas do jogo,
sem duplicar a conta na tela. Referências: [Constituição, arts. 62, 84 e 88](https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm)
e [Lei 14.600/2023](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14600.htm).

## Pessoas e preparo

Trajetórias são compostas de fatos de formação, trabalho, escala e resultados. Padrões de carreira
podem orientar a geração, sem catálogo de tamanho fixo, nome, partido, ideologia, fama ou nota pronta.
Pessoas fictícias são instâncias geradas por
semente e ordinal, com ID independente do cargo, memória e disponibilidade persistidas. Visitar,
ordenar ou passar o mouse numa lista não consome sorteio nem cria pessoas. A indicação de partido
usa o mesmo cadastro de pessoas.

Preparo é uma estimativa presidencial, de 1 a 6, da cobertura das competências atuais da pasta
pela experiência conhecida daquela pessoa. A ficha expõe os fatos e as lacunas usados na conta.
Fama e afinidade política continuam separadas. Uma fusão pode baixar o preparo; 6 não é garantido.
Uma trajetória pode ser relevante para diferentes trabalhos, conforme as evidências. Não há cota
de encaixes nem garantia de nota máxima. O rascunho em `docs/archive/dynamic-government-design-2026-09-28.md`
preserva exemplos históricos; suas contagens não definem a arquitetura nem validam o preparo.

## Busca, recomendação e interface

Nome livre, palavras-chave e sinônimos ajudam a encontrar competências e a explicar sugestões da
Casa Civil. A busca devolve IDs e ambiguidades; não transfere trabalho nem inventa efeitos por
similaridade de texto. A recomendação considera trabalho, instrumento, capacidade, titular e
conflitos. O jogador confirma o destino de cada competência. Ausência de precedente histórico não
é critério de escolha.

O hemiciclo, as fichas e os gestos aprovados permanecem: **Manter**, **Juntar**, **Extinguir** e
escolha de titular. **Dividir** aparece somente para desfazer junção feita pelo jogador. Criar uma
pasta nova é uma ação própria. Quando a quantidade superar a capacidade geométrica dos anéis,
a navegação mantém alvos acessíveis com mouse e teclado, sem empilhar círculos.

## Provas de aceite

1. Toda competência da abertura tem um responsável; operações conservam o conjunto e não duplicam
   trabalho. Fusões, extinções, criações e desfazimentos preservam histórico e nomeações coerentes.
2. Cenários de concentração, especialização e crescimento passam por save, recarga, proposta rejeitada e avanço do
   mandato. O apoio político é derivado da estrutura ativa e não cresce sem limite por fatiamento.
3. Trajetórias coerentes geram diferenças explicáveis de preparo para trabalhos distintos.
   Cobertura, diversidade e escassez são medidas, sem cotas artificiais por carreira ou órgão.
4. Números da posse vêm das consultas do motor sob a visão presidencial. A tela mantém os controles
   e o teste de navegador verifica mouse, teclado, foco e geometria nos tamanhos do projeto.
5. `validate`, simulações adversariais e revisão independente aprovam a implementação. Passar nos
   testes técnicos, por si, não aprova o equilíbrio do jogo.

## Detalhamento proposto em 29/09 — competências, trajetórias e preparo

Esta seção é uma proposta de arquitetura para revisão do Diretor. Ainda não altera o gerador,
as notas, a UI ou os dados do jogo. Os coeficientes de preparo continuam sem calibração.

### 1. Da frase exibida ao trabalho que o motor entende

O inventário preserva 152 descrições: 131 dos ministérios e 21 dos demais cargos. Uma descrição
pode originar várias competências; duas descrições podem referenciar a mesma competência.
A decomposição precisa guardar esse mapa, inclusive descrições ainda sem interpretação segura.
Nada é descartado por não caber imediatamente no vocabulário.

| Registro            | Conteúdo e responsabilidade                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `SourceDescription` | ID do inventário, texto original, origem e estado da revisão.                               |
| `Competency`        | ID permanente, verbo, objeto, público, território, instrumento e requisitos de experiência. |
| `SourceMapping`     | Descrição de origem, competências resultantes e justificativa da separação ou equivalência. |
| `Responsibility`    | Competência, responsável principal, participantes, vigência e ato de origem.                |
| `ProgramLink`       | Programa existente, relação causal e função exercida; sem efeito material inventado.        |
| `SearchTerm`        | Expressão, conceito canônico, contexto e ambiguidades conhecidas.                           |

O ID definitivo é atribuído uma vez. Corrigir uma frase não pode recriá-lo: o importador atual
deriva IDs do texto e serve apenas ao inventário provisório. A migração guardará aliases dos
IDs antigos. Trocar o ministério responsável também não muda o ID da competência.

Verbos iniciais propostos: formular, coordenar, executar, financiar, regular, fiscalizar,
licenciar, registrar, avaliar, pesquisar, negociar, representar, receber, encaminhar e proteger.
Cada verbo terá sentido definido; relações entre verbos são explícitas e direcionais.
Experiência em receber denúncias não comprova experiência em investigar crimes.

Exemplos de decomposição para o jogo, ainda sujeitos à conferência de escopo e fonte:

| Descrição encontrada               | Trabalhos a distinguir                                                                  | Erro evitado                                                              |
| ---------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Vigilância em saúde e sanitária    | Monitorar riscos epidemiológicos; fiscalizar riscos sanitários.                         | Tratar toda vigilância como a mesma experiência.                          |
| Universidades e pesquisa           | Coordenar ensino superior; fomentar pesquisa.                                           | Transformar todo administrador universitário em pesquisador especialista. |
| Ouvidoria de direitos humanos      | Receber denúncias; encaminhar e acompanhar providências.                                | Equiparar acolhimento a investigação ou decisão judicial.                 |
| Política de pesca e aquicultura    | Formular política de pesca; formular política de aquicultura.                           | Presumir domínio técnico idêntico de captura e cultivo.                   |
| Moeda, crédito e bancos            | Identificar os trabalhos representados e seus participantes antes de atribuir controle. | Concluir que o titular controla tudo o que aparece no rótulo.             |
| Terras de comunidades tradicionais | Especificar público, território e ação de cada responsabilidade.                        | Duplicar automaticamente trabalho mencionado por várias pastas.           |

Critério de separação: trabalhos podem ter destinos, instrumentos, requisitos ou efeitos
diferentes. Critério de equivalência: mesmo trabalho e mesmo escopo, confirmado na revisão;
coincidência de palavra não basta. Nenhuma decomposição nova altera rotas jurídicas nesta etapa.

Cada competência terá uma massa de trabalho de referência. Decompô-la reparte essa massa;
nunca cria peso adicional por aumentar o número de linhas. O esforço administrativo varia
com população, serviços e demanda representados, preservando a referência usada na comparação.
Participantes não recebem cópias da mesma massa. Dependências ficam em relações identificáveis.

### 2. Experiências combináveis para gerar histórias

Cada trajetória combina episódios sujeitos a cronologia, formação, instrumentos e escala.
Padrões de carreira ajudam a gerar sequências plausíveis; não são classes fechadas de pessoas.
Uma pessoa não herda todas as especializações de um padrão. A tabela abaixo é um repertório
exploratório legado: seus números são referências de revisão, não quantidade exigida de tipos.

Acrescentar um padrão somente quando representa uma diferença útil ainda ausente. Unificar
padrões redundantes; decompor os que concedem experiências incompatíveis. A suficiência será
avaliada pela diversidade e pelos erros observados, não por atingir uma contagem.

| Tipo | Núcleo da descrição e variação permitida                                                                     | Evidência que não vem automaticamente                                      |
| ---- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| 01   | Coordenou programas entre órgãos e implantou mudanças administrativas; varia a escala e o setor.             | Especialização técnica nos serviços coordenados.                           |
| 02   | Negociou execução conjunta entre entes e acompanhou entregas territoriais; pode ter atuado em desastres.     | Comando operacional de emergência sem episódio específico.                 |
| 03   | Organizou conselhos, consultas e acompanhamento de demandas coletivas.                                       | Prestação de serviços especializados de proteção a vítimas.                |
| 04   | Dirigiu comunicação pública e produção ou distribuição de informação.                                        | Engenharia de telecomunicações ou gestão de espectro.                      |
| 05   | Produziu pareceres, conduziu processos e coordenou equipes jurídicas em matérias definidas.                  | Experiência policial, econômica ou gerencial ampla só pelo diploma.        |
| 06   | Auditou contas, contratos ou programas e acompanhou providências; especialidade varia.                       | Capacidade de operar todos os serviços que auditou.                        |
| 07   | Administrou arrecadação, aduana ou operações financeiras públicas; combinações exigem episódios.             | Domínio simultâneo de bancos, tributos e dívida sem experiência.           |
| 08   | Elaborou orçamento, planejou programas e avaliou execução.                                                   | Especialização clínica, militar ou tecnológica por ter financiado o setor. |
| 09   | Negociou acordos e coordenou relações internacionais, cooperação ou serviços consulares.                     | Comando militar ou investigação policial.                                  |
| 10   | Comandou unidades e planejou operações, pessoal e logística de defesa em escala definida.                    | Gestão policial, diplomática ou cibernética sem experiência específica.    |
| 11   | Coordenou análise de ameaças e proteção institucional; especialização física ou digital é explicitada.       | Domínio universal de inteligência, fronteiras e cibersegurança.            |
| 12   | Dirigiu investigação, policiamento ou cooperação de segurança pública.                                       | Experiência militar ou judicial deduzida do cargo.                         |
| 13   | Geriu serviços de saúde; episódios distinguem atenção, vigilância, pesquisa e insumos.                       | Proficiência em todas as especialidades sanitárias.                        |
| 14   | Administrou equipamentos e programas de cultura, esporte ou turismo; escolhe uma base e passagens coerentes. | Nota máxima nos três setores por reunir seus nomes na descrição.           |
| 15   | Dirigiu ensino, formação de professores ou gestão universitária com responsabilidades identificadas.         | Pesquisa especializada ou gestão de todas as etapas educacionais.          |
| 16   | Dirigiu pesquisa, inovação ou infraestrutura digital; cada ramo tem projetos e equipe próprios.              | Conhecimento técnico de qualquer tecnologia.                               |
| 17   | Coordenou assistência, cadastro ou segurança alimentar e redes de atendimento territorial.                   | Gestão clínica ou previdenciária especializada.                            |
| 18   | Administrou benefícios e analisou sustentabilidade de regimes; distingue operação e atuária.                 | Domínio de toda política social ou macroeconomia.                          |
| 19   | Executou políticas de emprego, negociação coletiva ou fiscalização laboral.                                  | Experiência em todos esses instrumentos sem passagens correspondentes.     |
| 20   | Operou denúncias, encaminhamento e proteção de vítimas com públicos definidos.                               | Poder investigativo ou experiência em qualquer grupo vulnerável.           |
| 21   | Planejou e executou políticas contra discriminação e avaliou acesso a serviços.                              | Experiência idêntica em todos os públicos atingidos.                       |
| 22   | Atuou em políticas indígenas, proteção territorial e articulação com comunidades.                            | Gestão ambiental ou fundiária genérica por proximidade temática.           |
| 23   | Dirigiu extensão, pesquisa ou defesa agropecuária; formação e projetos definem o ramo.                       | Habilitação em todas as espécies, técnicas e atividades pesqueiras.        |
| 24   | Executou desenvolvimento agrário, crédito, compras ou assistência à agricultura familiar.                    | Administração de qualquer empresa ou conhecimento agronômico universal.    |
| 25   | Administrou pesca ou aquicultura, registros e infraestrutura; combinações requerem trajetória.               | Mesma experiência em captura, cultivo e conservação.                       |
| 26   | Geriu conservação, fiscalização ou política ambiental em territórios definidos.                              | Epidemiologia, mineração ou operação elétrica.                             |
| 27   | Planejou ou regulou energia ou recursos minerais, com projetos em segmentos identificados.                   | Domínio simultâneo de eletricidade, combustíveis e mineração.              |
| 28   | Planejou habitação, saneamento ou mobilidade e coordenou execução urbana.                                    | Experiência em toda infraestrutura por ser engenheiro ou urbanista.        |
| 29   | Dirigiu redes e projetos logísticos; modais e instrumentos são registrados.                                  | Experiência automática em aviação, navegação e transporte terrestre.       |
| 30   | Executou desenvolvimento produtivo e apoio empresarial em setores e escalas definidos.                       | Especialização em qualquer indústria ou instrumento financeiro.            |

Os tipos 04, 14, 16, 21, 23 e 30 já eram amplos no rascunho; o detalhamento também torna
explícitas as especializações dos tipos 07, 11, 13, 27 e 29. As variações não podem servir para
trocar silenciosamente de currículo a cada pasta visitada. Um currículo permanece o mesmo.

Um episódio registra intervalo temporal, papel, ações, objetos, instrumentos, público,
território, escala de equipe/recursos e resultados conhecidos, com origem da informação.
Resultados não surgem como títulos elogiosos: realizar um projeto e obter seu resultado são
fatos separados. Sobreposição de empregos incompatíveis e formação posterior ao uso exigem
validação. Formação, atuação técnica e direção são evidências distintas.

### 3. Geração, identidade e disponibilidade

Fluxo proposto: semente da partida → fluxo dedicado de pessoas → ordinal → trajetória →
episódios coerentes → atributos da pessoa → registro persistido. O ordinal nunca inclui o cargo.
O esquema guarda versão do gerador, episódios materializados e posição do fluxo. Uma atualização
do catálogo não reescreve personagens de uma partida salva.

O jogo já tem `streamFrom` e contagem de saques em `src/state/random.mjs`. O gerador atual de
`src/domain/cast/index.mjs` usa hashes de semente e arquétipo para parte do elenco; ele não é
substituível automaticamente pelo fluxo proposto. Será necessário um adaptador explícito que
preserve líderes, memória, vínculos partidários e IDs existentes.

Na abertura, gerar um lote nacional independente da ordem de visita às pastas. Uma busca
posterior é uma ordem explícita com tempo/custo e resultado persistido; refazer a consulta ou
recarregar a página não sorteia novamente. Ampliar a estrutura pode expor escassez;
criar ministérios não fabrica candidatos perfeitos. Novas gerações acontecem em transições
definidas da simulação, não em eventos de UI.

Disponibilidade e incompatibilidade de cargos são consultas separadas do preparo. Indicações
partidárias selecionam pessoas desse mesmo cadastro. A mesma pessoa pode aparecer em várias
consultas, mas a nomeação verifica a ocupação atual. Fama, partido e ideologia não entram no
tipo profissional nem elevam preparo técnico.

### 4. Cálculo explicável do preparo

A entrada contém pessoa, conjunto de competências do cargo, requisitos de escala e evidências
acessíveis à Presidência. A saída contém nota estimada, cobertura por competência, lacunas,
evidências utilizadas e versão da regra. Dado desconhecido não é prova de incapacidade.

Para cada competência `c` e episódio conhecido `e`, comparar objeto, ação, instrumento,
escopo e responsabilidade exercida. Cada relação fica classificada como direta, transferível,
insuficiente ou desconhecida, com justificativa. Relações transferíveis são curadas e direcionais:
fiscalizar contratos não equivale a prestar atendimento de saúde, mesmo no mesmo hospital.

Proposta de agregação, ainda sem coeficientes calibrados:

```text
evidence(e, c) = compatibilidade conjunta das dimensões relevantes do episódio
coverage(person, c) = melhor evidência válida, com corroboração limitada
technical = soma(workMass(c) × coverage(person, c)) / soma(workMass(c))
preparation = faixa(technical, liderança, escala, amplitude, lacunas críticas)
```

A compatibilidade conjunta impede montar uma falsa experiência direta juntando o objeto de
um emprego ao verbo de outro. Experiências complementares podem justificar transferência
parcial, com origem explícita. Duplicar a mesma passagem não aumenta cobertura; tempo de
experiência tem ganho limitado. Relações curadas não fazem fechamento transitivo automático:
se A ajuda B e B ajuda C, isso não torna A experiência em C.

A média técnica sozinha é insuficiente: direção de equipes, escala e lacunas críticas limitam
a faixa final. Amplitude deriva da diversidade de trabalho e das interfaces de coordenação,
nunca do número de nomes ou linhas do catálogo. Trabalho executável por equipes não exige
que o ministro detenha todas as habilitações operacionais; avalia-se sua responsabilidade de
direção. A competência da equipe é outra entrada da capacidade administrativa.

As seis faixas propostas descrevem evidência: 1, pouca correspondência conhecida; 2, experiência
adjacente restrita; 3, cobertura parcial; 4, cobertura relevante com lacunas; 5, cobertura ampla
e direção compatível; 6, cobertura muito ampla, escala compatível e ausência de lacuna crítica
conhecida. Os cortes e tetos precisam de casos de referência e calibração antes de virar código.
Sem informação suficiente, a consulta sinaliza incerteza em vez de inventar uma nota exata.
Seu encaixe na ficha existente será revisado sem acrescentar telas ou controles nesta etapa.

Pasta vazia não recebe 6 nem divide por zero: o resultado é “sem atribuições para avaliar”.
Uma pasta com informação incompleta retorna avaliação parcial. Nomeação com preparo baixo
continua possível; a nota descreve consequências e necessidades de apoio, não cria um veto.

Exemplos que a implementação terá de explicar, sem atribuir números antes da calibração:

- Oficial com comando e logística cobre direção e logística de defesa; diplomata pode cobrir
  negociação internacional relacionada à defesa, sem herdar experiência de comando.
- Ouvidor cobre acolhimento e encaminhamento de denúncias; experiência genérica de auditoria
  ajuda processos de controle, mas não comprova proteção especializada a vítimas.
- Renomear Saúde para “Saúde e Inovação” mantém a nota. Transferir pesquisa tecnológica para
  a pasta muda a avaliação somente pelo novo trabalho e seus requisitos.
- Fundir Saúde e Defesa pode elevar a cobertura de alguma pessoa e reduzi-la para outra.
  Nenhuma delas ganha 6 pela soma de dois rótulos favoráveis.

### 5. Busca e sugestão de destinos

A busca normaliza grafia e consulta expressões completas, sinônimos e contexto. Uma expressão
ampla retorna candidatos com sua ambiguidade. “Segurança” não escolhe sozinha entre segurança
alimentar, pública, institucional e da informação. Termos negados não viram seleções positivas;
texto não reconhecido permanece sem correspondência. Renomear uma pasta nunca transfere trabalho.

Depois de escolhidas as competências, a Casa Civil compara os destinos ativos por trabalho
existente, instrumentos, capacidade disponível, dependências e conflitos. Usa o catálogo de
competências, não nomes de ministérios. Empates ficam visíveis e têm ordenação estável por ID.
Sem destino tecnicamente bom, mostra lacunas e alternativas; não fabrica um precedente.

Preparo do titular é uma informação da comparação, sem substituir capacidade de equipe,
orçamento e serviços. A ficha deve poder explicar separadamente: “há estrutura para receber”
e “o titular tem pouca experiência nesta função”. A reação política depende de trabalho,
públicos e interesses atingidos. O jogador confirma a distribuição no fluxo já existente.

### 6. Cobertura e escala sem cotas artificiais

Selecionar casos de referência pelas diferenças que expõem: especialização, trabalho transversal,
instrumentos distintos, escala, informação incompleta e experiência transferível. Fixar os
currículos antes de avaliá-los e incluir casos positivos e negativos. O cálculo recebe fatos,
não o resultado desejado. Falta de candidato perfeito pode ser coerente com o cenário.

Medir famílias de trabalho sem experiência representada, currículos redundantes, concentração
de indicações, falsa equivalência e incerteza. Uma lacuna pode exigir novo padrão, melhor
evidência ou reconhecimento de escassez; a escolha precisa de justificativa.

Separar variedade de composições possíveis e quantidade de órgãos ativos simultaneamente.
Na estrutura simultânea, preservar responsabilidades por papel sem duplicação. Fazenda e
Arrecadação não podem receber o mesmo trabalho integral apenas por aparecerem numa lista.

Ensaiar crescimento progressivo, concentração extrema e reformas encadeadas, usando a estrutura
inicial como referência. Medir tempo de consulta, tamanho do save, comportamento do gerador e
acessibilidade. Os tamanhos dos ensaios serão escolhidos por risco e medição. O teste existente
de 80 para 5 órgãos permanece como um caso sintético; não é teto nem prova universal de suporte.

Casos frágeis a revisar primeiro: comunicação pública versus telecomunicações; cultura versus
esporte e turismo; inteligência versus cibersegurança; orçamento versus gestão clínica; ambiente
versus vigilância epidemiológica; logística geral versus operação de aeroportos. Preservar a
lacuna é preferível a declarar que uma palavra resolve a diferença.

### 7. Lotes e critérios para começar a integração

| Lote           | Entrega concreta                                                    | Condição de aceite                                                              |
| -------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| A. Vocabulário | Mapa das 152 descrições para competências, relações e ambiguidades. | Nenhuma descrição perdida; escopo e fonte revistos; IDs e massa preservados.    |
| B. Trajetórias | Regras de composição de experiências e currículos de referência.    | Cronologia, diversidade e limites demonstrados sem encaixes obrigatórios.       |
| C. Preparo     | Função pura, explicação por competência e parâmetros versionados.   | Casos de referência e testes adversariais passam sem notas por nome de cargo.   |
| D. Geração     | Lote de pessoas por fluxo dedicado, persistência e consultas.       | Mesma semente e ordens reproduzem pessoas; navegação não consome sorteios.      |
| E. Cobertura   | Cenários por classe de risco e escalas progressivas.                | Cobertura semântica, diversidade e conservação medidas separadamente.           |
| F. Integração  | Adaptadores para estado, nomeações, coalizão, capacidade e posse.   | UI preservada, save, concentração e expansão verificados; revisão independente. |

Provas mínimas além da cobertura: renomear não altera preparo; decompor uma função com massa
conservada não altera o resultado; currículo repetido não ganha experiência; mudar partido não
muda preparo; esconder evidência altera apenas a estimativa conhecida; trocar o cargo não muda
a pessoa; recarregar preserva episódios e RNG; criar pastas vazias não aumenta capacidade;
uma consulta não modifica estado; toda justificativa aponta fatos usados pela mesma conta.

Próximo lote proposto: recorte de A em Direitos Humanos, Saúde e Defesa, com as experiências
testemunha pertinentes de B/C e efeitos de continuidade. Antes de ampliar o inventário, cumprir
o portão do [piloto](government-pilot-2026-09-30.md), §9: comparar reformas com manter a estrutura, usando
os mesmos recursos e informação, e demonstrar ganho e perda materiais explicáveis. A tabela
acima descreve entregas, não exige terminar todo A antes de testar esse recorte. Só depois
expandir o vocabulário e as trajetórias. Conferência jurídica será feita nas fontes primárias
no momento de fechar responsabilidades. Este detalhamento não declara esse levantamento concluído.

### 8. Composição por palavras-chave e raciocínio determinístico — 30/09

**Ordem do Diretor:** eliminar o critério de caso histórico parecido e a reação genérica;
construir um sistema flexível por palavras-chave. A complexidade deve mudar decisões e
consequências. O protótipo conserva a apresentação aprovada. Esta seção aprimora o contrato;
não declara todas as camadas abaixo implementadas.

O caminho de uma escolha é: expressão → trabalhos identificados → proposta de estrutura →
comparação de condições → execução → memória. Nomear “Saúde Digital” não cria dados, equipe,
acesso nem serviço. O jogador escolhe quais trabalhos esse órgão assume; o motor acompanha
o que continua nas instituições executoras e o que precisará mudar de verdade.

| Camada                     | Representação e decisão                                                                                                                                           | Situação concreta                                                                                                                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Descoberta                 | Expressões, aliases explícitos, `e`, `ou`, `não`, parênteses, escopos concorrentes e termos não reconhecidos. Retorna IDs.                                        | `work-search.mjs` funciona no seletor de destinos; dez provas puras e gestos no navegador.                                                                                                |
| Conteúdo do trabalho       | Verbo, objeto, público, território, instrumento, papel institucional, escala, dependências e requisitos com fonte. Um mesmo tema pode ter instrumentos distintos. | As 152 frases têm IDs; sete trabalhos do piloto já distinguem papéis. A decomposição completa permanece pendente.                                                                         |
| Estrutura e continuidade   | Proposta por ID, responsável por trabalho, executores e vínculos separados; histórico de revisões e aplicação integral.                                           | Núcleo estrutural ligado a junção, inversa, extinção/recriação, criação livre, transferência e nome livre. Vínculo institucional de reformas de órgãos da Presidência permanece pendente. |
| Condições para receber     | Trabalho atual, equipe, acesso, recurso, autoridade, fila e dependências conhecidos. Mostra lacunas, sem nota por coincidência lexical.                           | Piloto institucional e operacional exercitado; retrato presidencial completo e comparação geral dos destinos ainda pendentes.                                                             |
| Pessoas e gestão           | Episódios pertencem à pessoa. Compara evidência direta, transferível, não demonstrada e desconhecida; ordens e experiência mudam a agenda.                        | Currículos de contraste e gestão existem no piloto; catálogo visual ainda usa preparo legado.                                                                                             |
| Consequências e interesses | Executa as mesmas regras da previsão; conserva recursos e trabalho, identifica quem ganha poder ou perde acesso e produz memória dos efeitos.                     | Filas, demanda e caixa sintéticos executáveis; ligação à tela, pesos políticos, custos reais e vigência permanecem abertos.                                                               |

**Atribuições são registros, não sacos de palavras.** O vocabulário aponta para um trabalho;
não converte automaticamente funções semelhantes em equivalentes. Coordenação, atendimento,
regulação e controle podem mencionar o mesmo público e exigir capacidades diferentes. Os vínculos
são direcionados e têm fonte. Renomear não muda os registros; transferir não transporta
automaticamente um executor autônomo nem lhe concede um acesso que ele não tinha.

**A comparação preserva os motivos.** Para cada destino e trabalho, guardar os fatos usados,
seu grau de conhecimento, requisitos atendidos, dependências ainda abertas, conflito de agenda,
esforço de transição e efeito na fila. Comparar com manter a pasta e mudar a prioridade usando
a mesma abertura. A avaliação admite alternativas com perdas diferentes; ausência de orçamento
ou equipe conhecidos não vira zero custo. Um empate permanece empate, ordenado por ID.

**A execução conserva o mundo.** A proposta aponta responsáveis e remanejamentos explícitos.
O kernel de operações recebe esses remanejamentos, equipes, filas, caixa e ordens; previsão e
execução usam a mesma função. Recursos só entram com recebimento identificado. Criar dez pastas,
repetir uma reforma ou dar dez nomes ao mesmo trabalho não cria dez equipes nem apoio político.
Desfazer estrutura não apaga serviço entregue, gasto ou transferência posterior. Uma solução
incompleta permanece rascunho; falta de evidência permanece incerteza, sem barrar uma escolha
manual de configuração já representável.

**O cadastro sustenta os currículos.** Gerar episódios uma vez por fluxo com semente e manter
cronologia, contexto, escala, funções e evidência conhecidos. A mesma pessoa atravessa nomeações,
fusões e listas com o mesmo ID e história. A ficha explica cobertura e lacunas no trabalho atual;
família profissional, prestígio, partido e o nome da pasta não substituem experiência. O piloto
de gestão permite comparar prioridades e consultas que consomem equipe, sem conceder habilidade.

**A expansão acrescenta conteúdo e regras verificáveis.** Vocabulário é extensível; padrões de
trabalho, relações e episódios são reutilizados em composições. O avaliador opera sobre esses
fatos, sem escrever uma resposta específica para cada par de ministérios. Consultas são puras;
expressões são processadas sem `eval` e sem sorteios. Índices por ID e dependência permitem
reavaliar os trabalhos atingidos por uma reforma; medir antes de acrescentar caches ou trocar
o desenho da tela. A quantidade de combinações cresce com o catálogo e com a estrutura variável;
o conhecimento representado continua finito e suas lacunas precisam aparecer.

O recorte já ligado elimina `HIST`, `PRE`, `DEST`, `SPLIT` e `PARTNERS` na versão gerada, além do
texto de precedente e reação. A busca distingue “segurança alimentar” de “segurança pública”
e conserva os dois resultados para o termo amplo. “Segurança ou termo desconhecido” não ignora
o desconhecido; “não termo desconhecido” não seleciona tudo. Um órgão vazio pode receber trabalho
por escolha manual, mas não aparece como especialista por causa do nome.

O próximo incremento fecha a lacuna institucional das reformas; depois leva episódios conhecidos
e comparações operacionais ao painel. O [piloto, §11](government-pilot-2026-09-30.md#11-transformar-o-protótipo-da-posse--execução-em-3009)
continua sendo a fila de execução. Revisão independente permanece obrigatória para fechar o
sistema; não confundir as provas desta camada com aprovação de toda a arquitetura.
