# Governo variável: ministérios, competências e pessoas

**Proposta para discussão — 28/09/2026. Não implementada nem incorporada à especificação canônica.**

**Rascunho histórico, superado em 29/09 quanto às quantidades e cotas:** o Diretor esclareceu
que os números eram exemplos. As tabelas e contagens abaixo permanecem como material exploratório,
não requisitos, limites ou garantias de encaixe. Vale o contrato atualizado de governo variável.

Detalhamento de 29/09: [contrato de governo variável](../spec/dynamic-government.md),
seção de competências, trajetórias e preparo. Ela especifica limites das 30 trajetórias e
distingue as 80 composições alternativas da partição de um governo com 80 ministérios simultâneos.
As relações de encaixe abaixo permanecem hipóteses; ainda não são resultados de um cálculo.

## 1. Decisões que este desenho respeita

- O jogador pode manter, juntar e extinguir ministérios na posse. **Dividir** só desfaz uma junção feita pelo jogador. Criar uma pasta nova será uma ação própria quando essa opção entrar no jogo.
- A aparência, a ficha e os controles atuais da posse são o contrato visual. A lógica por trás deles passa a consultar o mesmo estado e as mesmas funções que o motor usará.
- Os demais cargos, incluindo a AGU e os cargos da Presidência, preservam seus caminhos jurídicos particulares. A estrutura de ministérios não decide por eles.
- Existem **30 tipos de trajetória profissional**, sem nome, partido, ideologia ou pessoa predeterminada. Pessoas fictícias nascem desses tipos por semente, com identidade estável e atributos próprios.
- Nomes de ministérios, palavras-chave e sinônimos ajudam a interpretar uma escolha; nunca determinam, sozinhos, efeito, preparo, destino ou custo.
- O sistema precisa operar com 5, 32 ou 80 ministérios e continuar funcionando após reformas no meio do mandato, recarga de save e derrota de uma proposta no Congresso.

## 2. O que existe hoje e o que precisa nascer

O protótipo tem 38 cargos iniciais, sendo 32 ministérios e seis cargos da Presidência/AGU. Os 32 ministérios listam **131 rótulos de trabalho**; os outros seis, 21. São frases de interface, não unidades legais ou econômicas verificadas. A proposta de extinção é escolhida por `DEST`, `SPLIT` e `PARTNERS` em `tmp/posse/parts/data-now.js`. A conta política usa `TOTAL = 38`, e criar uma pasta acrescenta peso sem revisar esse denominador. As 812 fichas vêm de perfis por cargo, 33 notáveis fixos e políticos gerados com identidade amarrada ao cargo.

No jogo principal, `src/data/cabinet.mjs` define 38 cadeiras; `src/state/state.mjs` recusa nomeação para outra cadeira; `src/application/cabinet.mjs` mede a coalizão pelo total fixo; `src/application/world.mjs` gera o indicado com ID `partido:cadeira`; apenas sete ministros têm papel ativo no contingenciamento. As oito `areas` e os 38 `programs` representam resultados e alocação de recursos, não donos exclusivos de competências.

Já existem peças a preservar: geração determinística de pessoas em `src/domain/cast/`, normas e rotas na aplicação, e vocabulário canônico de `CREATE`, `ABOLISH`, `MERGE`, `SPLIT`, `TRANSFER_POWER`, `APPOINT` e `DISMISS` na especificação mestra. O mecanismo genérico `body/status` ainda está marcado como não implementado em `docs/spec/rules-grammar.md`.

## 3. Modelo de domínio proposto

### 3.1. Competência: o átomo transferível

Uma competência tem ID estável e descreve **verbo + objeto + público/território + instrumento**, com escopo, fonte jurídica, relações com programas e órgãos participantes. Exemplo:

`human-rights-ombudsman = receber e encaminhar denúncias + violações de direitos humanos + pessoas afetadas + ouvidoria nacional`.

Outro átomo, `general-ministry-ombudsman`, representa a ouvidoria comum que cada ministério deve prever; são trabalhos distintos. O art. 28 da Lei 14.600 descreve a primeira função, e o art. 50 trata da segunda. A mesma frase “ouvidoria” não pode fundi-las automaticamente.

Cada competência pode ter um órgão **responsável principal**, órgãos de execução conjunta ou consulta, vínculo com nenhum ou vários programas e exigências legais próprias. A titularidade muda com um ato de reorganização; os parâmetros fiscais e de resultado dos programas continuam no lugar até uma decisão que realmente os modifique. Uma competência sem programa representado no jogo ainda pode gerar custo administrativo, conflito e reação; ela não ganha um efeito inventado.

### 3.2. Órgão: estrutura variável

Um órgão tem `id` imutável, nome exibido editável, tipo jurídico, competências recebidas, titular, data de vigência e histórico de origem. Nome igual não identifica o mesmo órgão. Mudar “Fazenda” para “Economia” não transfere automaticamente tributos; transferir a administração tributária muda trabalho mesmo sem renomear.

O conjunto inicial vem do catálogo, mas o conjunto **ativo** pertence ao estado da partida. Criar, extinguir, juntar e desfazer junção alteram esse conjunto e deixam uma trilha reversível. A estrutura legal proposta, a que tem efeito provisório e a consolidada precisam ter estado distinto quando o rito exigir; uma votação posterior não pode apagar silenciosamente nomeações e responsabilidades intermediárias.

### 3.3. Pessoa: instância gerada, carreira como evidência

O tipo de carreira contém apenas fatos de experiência: formação, cargos exercidos, ações executadas, escala da gestão e competências demonstradas. **Não contém nome, gênero, partido, ideologia, posição moral ou nota pronta por ministério.**

Uma pessoa recebe ID pela semente e por um ordinal de geração, independentemente da cadeira. Nome, partido, crenças, fama, temperamento, memória e ambição são atributos da instância, com proveniência própria. Nomeá-la em outro órgão não troca seu passado nem sua identidade. Uma pessoa ocupa no máximo um cargo incompatível de cada vez.

Abrir a lista, passar o mouse ou ordenar candidatos **não cria pessoas**. A partida materializa um lote ordenado de candidatos ao iniciar ou ao ampliar o governo; cada sorteio usa o fluxo injetado e grava a posição consumida no estado. A lista lê esse lote. Quando uma nova busca for necessária, ela é uma transição explícita da partida e preserva IDs já conhecidos. Assim, visitar primeiro Defesa ou Saúde não muda quem existe no país.

O preparo exibido é uma **estimativa presidencial de 1 a 6**, calculada para o conjunto atual de competências do órgão com base em experiência demonstrada, escala, direção de equipes e lacunas. Uma fusão ampla pode reduzir o preparo de todos os candidatos; o sistema não promete um 6 para uma pasta inventada que combine assuntos sem especialista plausível. Afinidade ideológica continua separada de preparo.

### 3.4. Relações, não tabelas por nome

As relações centrais são:

`competência ↔ órgão ativo` (responsável/participante), `competência ↔ programa` (efeito existente), `tipo de carreira ↔ competência` (evidência de preparo), `pessoa ↔ tipo de carreira` (histórico), `pessoa ↔ cargo` (nomeação), `ato ↔ alterações` (vigência e reversão).

O sistema pode guardar vocabulário curado de sinônimos, como “segurança alimentar” e “abastecimento”, mas precisa distinguir “segurança pública” de “segurança alimentar” e “defesa nacional” de “defesa do consumidor”. O texto vira IDs canônicos antes de qualquer cálculo. Se houver ambiguidade, a proposta mostra as interpretações e pede escolha; não inventa uma competência ou um efeito.

O domínio continua ESM puro, sem DOM, relógio, dependência de runtime ou IA por API. Uma ferramenta de IA pode sugerir sinônimos para revisão humana fora da partida; o motor calcula todos os efeitos.

## 4. Regras das operações

| Gesto na posse               | Mudança de estado                                                                                        | Regra essencial                                                                                                    |
| :--------------------------- | :------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| Manter                       | Confirma a estrutura vigente e abre a escolha de titular.                                                | Nenhuma competência muda de dono.                                                                                  |
| Juntar                       | Cria o vínculo de fusão e concentra competências e titularidade em um órgão ativo.                       | Cada competência mantém ID e peso; o evento guarda as duas origens.                                                |
| Extinguir                    | A Casa Civil propõe destino **para cada competência**; o jogador pode ajustar e assinar.                 | Nenhuma competência desaparece. Destino baixo em preparo/capacidade continua possível, com custo visível.          |
| Dividir, apenas após junção  | Desfaz uma fusão criada pelo jogador usando o evento original.                                           | Mudanças posteriores são preservadas ou apresentadas como conflito explícito; não há restauração cega de snapshot. |
| Criar, quando chegar ao jogo | Abre um órgão e transfere competências escolhidas de órgãos existentes; pode deixar um órgão sem função. | Nome livre é permitido. Um nome sem competência não gera efeito; o órgão vazio ainda tem custo administrativo.     |

A proposta da Casa Civil ordena destinos por sobreposição de competências, instrumento de execução, experiência administrativa, capacidade disponível e conflitos entre papéis. Apresenta **por que** cada destino foi sugerido. Precedente histórico, quando verificado, é informação separada da sugestão. A ausência de precedente não aciona um destino genérico “mais próximo”.

As rotas constitucionais, legais e de medida provisória continuam no mecanismo jurídico existente. O art. 84, VI, `a`, da Constituição limita o decreto quando houver criação ou extinção de órgão; o art. 88 remete criação e extinção de ministérios à lei. A interface da posse conserva seus controles legais atuais enquanto o motor passa a registrar vigência e consequência reais. Fontes: [Constituição](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm), [Lei 14.600](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14600.htm).

### Exemplo completo: extinguir Direitos Humanos

A tela conserva **Extinguir → proposta da Casa Civil → mudar a divisão → Assinar**. Internamente, a função de promoção de direitos por público, a ouvidoria nacional, a educação em direitos, o combate à discriminação e a cooperação nacional/internacional saem como competências distintas; o art. 28 da Lei 14.600 contém mais detalhe do que as quatro frases resumidas do protótipo.

| Competência                                    | Destino que a Casa Civil poderia sugerir                                                                   | Justificativa exibível; não é destino obrigatório                                                                                                |
| :--------------------------------------------- | :--------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| Educação em direitos humanos                   | Educação                                                                                                   | Já administra redes e currículo; receberia dever especializado e carga adicional.                                                                |
| Ouvidoria **nacional de direitos humanos**     | Justiça, com estrutura especializada                                                                       | Uma ouvidoria comum da CGU ou de outro ministério não equivale automaticamente a esta função. A escolha exige preservar o serviço especializado. |
| Cooperação internacional sobre direitos        | Relações Exteriores, como participante; outro órgão segue responsável pela política material               | Negociações internacionais se distinguem do atendimento e da política interna.                                                                   |
| Proteção por público e combate à discriminação | Combinação justificada entre Igualdade Racial, Mulheres, Povos Indígenas, Desenvolvimento Social e Justiça | O destino depende do público e da ação: acolher, fiscalizar, promover ou processar não são o mesmo verbo.                                        |

Ao assinar, o jogo registra cada transferência e a rota jurídica, retira o titular da pasta extinta, recalcula o preparo estimado dos titulares que receberão trabalho e aponta quem sofre perda de coordenação ou capacidade. Se uma opção tiver preparo baixo, ela continua selecionável e mostra custo. A reação de grupos e serviços segue as competências e os públicos atingidos; a frase “não há caso real parecido” deixa de ser critério de decisão. Se o ato perder vigência, a trilha informa o que deve voltar e quais nomeações ou transferências posteriores precisam de resolução.

## 5. Preparo, indicação e cobertura

O cálculo do preparo consulta as competências **do cargo naquele momento**. Proposta conceitual: cobertura ponderada de experiência direta + experiência transferível + direção na escala exigida − lacunas relevantes − sobrecarga da pasta. Pesos e cortes numéricos só serão fechados com exemplos adversariais e simulação; inserir um `6` fixo por tipo ou cargo recriaria o problema atual. A ficha explica a nota com fatos de carreira conhecidos pela Presidência.

Trinta tipos não significam trinta pessoas. O gerador pode produzir tantas instâncias distintas quantas forem necessárias, por semente e ordinal estável, sem criar elenco fixo. A lista “Sugeridos / Partidos / Outros” continua com o mesmo comportamento visual. Indicações partidárias são pessoas do mesmo sistema; o ID não inclui o ministério. Cada indicação deve respeitar disponibilidade, histórico e critérios jurídicos do cargo.

### Trinta tipos de trajetória profissional

Os órgãos abaixo são **exemplos para testar** o encaixe, não chaves que o gerador consultará. “Alto” significa que a experiência pode sustentar preparo máximo naquela composição inicial; “médio” indica experiência aproveitável, não uma nota imutável. Os nomes dos tipos identificam carreiras, nunca personagens.

| Tipo                                            | Experiência observável, sem identidade nem posição política                                             | Exemplo alto                                  | Dois exemplos médios                     |
| :---------------------------------------------- | :------------------------------------------------------------------------------------------------------ | :-------------------------------------------- | :--------------------------------------- |
| 01. Coordenador federal                         | Dirigiu articulação entre ministérios e uma reforma administrativa de grande escala.                    | Casa Civil / Gestão                           | Planejamento; Relações Institucionais    |
| 02. Negociador federativo                       | Executou pactos entre União, estados e municípios, fundos regionais e resposta territorial a desastres. | Relações Institucionais / Integração Regional | Cidades; Casa Civil                      |
| 03. Gestor de participação e cidadania          | Organizou consultas públicas, conselhos de direitos e diálogo com movimentos sociais.                   | Secretaria-Geral / Direitos Humanos           | Cultura; Igualdade Racial                |
| 04. Gestor de comunicação pública               | Dirigiu comunicação governamental e serviços de radiodifusão ou telecomunicações.                       | Comunicação Social / Comunicações             | Cultura; Gestão                          |
| 05. Advogado público                            | Chefiou consultoria jurídica e defesa judicial de ente público.                                         | AGU                                           | Justiça; Gestão                          |
| 06. Auditor governamental                       | Chefiou auditorias, correição e avaliação de programas públicos.                                        | CGU                                           | Fazenda; Gestão                          |
| 07. Gestor fazendário                           | Dirigiu arrecadação e aduana e supervisionou operações públicas de crédito ou dívida.                   | Fazenda                                       | Planejamento; CGU                        |
| 08. Planejador orçamentário                     | Montou orçamento plurianual e avaliou execução de políticas públicas.                                   | Planejamento                                  | Fazenda; Gestão                          |
| 09. Diplomata                                   | Conduziu negociações, serviços consulares e cooperação sobre migração em postos internacionais.         | Relações Exteriores                           | Indústria e Comércio; Justiça            |
| 10. Oficial de defesa                           | Comandou estrutura militar e planejou logística e defesa nacional.                                      | Defesa                                        | GSI; Integração Regional                 |
| 11. Gestor de inteligência                      | Dirigiu proteção institucional, inteligência ou resposta a ameaças estratégicas.                        | GSI                                           | Defesa; Justiça                          |
| 12. Gestor de segurança pública                 | Coordenou polícia, investigação e cooperação entre forças de segurança.                                 | Justiça e Segurança Pública                   | GSI; CGU                                 |
| 13. Gestor de saúde                             | Dirigiu rede de saúde, vigilância e fornecimento de insumos em grande escala.                           | Saúde                                         | Desenvolvimento Social; Gestão           |
| 14. Gestor cultural e esportivo                 | Administrou equipamentos, fomento cultural, esporte e promoção de destinos.                             | Cultura / Esporte / Turismo                   | Educação; Desenvolvimento Social         |
| 15. Gestor de ensino                            | Dirigiu rede de escolas ou universidade e avaliação educacional.                                        | Educação                                      | Ciência e Tecnologia; Cultura            |
| 16. Gestor de pesquisa e infraestrutura digital | Dirigiu pesquisa aplicada, inovação e redes digitais públicas.                                          | Ciência e Tecnologia / Comunicações           | Educação; Gestão                         |
| 17. Gestor de assistência social                | Coordenou proteção territorial, cadastro de famílias e ações de segurança alimentar.                    | Desenvolvimento Social                        | Direitos Humanos; Cidades                |
| 18. Atuário previdenciário                      | Administrou benefícios e projeções financeiras de regimes previdenciários.                              | Previdência                                   | Fazenda; Trabalho                        |
| 19. Mediador trabalhista                        | Dirigiu fiscalização do trabalho, emprego ou negociação coletiva.                                       | Trabalho                                      | Justiça; Desenvolvimento Social          |
| 20. Ouvidor de direitos humanos                 | Operou sistema de denúncias e proteção a vítimas de violações de direitos.                              | Direitos Humanos                              | Mulheres; Igualdade Racial               |
| 21. Gestor de igualdade                         | Executou políticas de enfrentamento à discriminação racial e de gênero.                                 | Igualdade Racial / Mulheres                   | Direitos Humanos; Desenvolvimento Social |
| 22. Gestor de política indígena                 | Trabalhou com terras, proteção de comunidades e articulação territorial.                                | Povos Indígenas                               | Meio Ambiente; Desenvolvimento Agrário   |
| 23. Agrônomo extensionista                      | Dirigiu assistência técnica, pesquisa aplicada e defesa sanitária da produção agropecuária.             | Agricultura / Desenvolvimento Agrário         | Pesca; Integração Regional               |
| 24. Gestor agrário                              | Executou reforma agrária, crédito e compras públicas da agricultura familiar.                           | Desenvolvimento Agrário                       | Agricultura; Desenvolvimento Social      |
| 25. Gestor de pesca e aquicultura               | Administrou registro, licenças, produção e infraestrutura pesqueira.                                    | Pesca e Aquicultura                           | Agricultura; Meio Ambiente               |
| 26. Gestor ambiental                            | Dirigiu conservação, fiscalização, manejo de biomas e planos de adaptação climática.                    | Meio Ambiente                                 | Agricultura; Povos Indígenas             |
| 27. Engenheiro de energia e recursos minerais   | Regulou geração, redes elétricas, combustíveis e exploração mineral.                                    | Minas e Energia                               | Ciência e Tecnologia; Meio Ambiente      |
| 28. Planejador urbano                           | Dirigiu projetos de habitação, saneamento e mobilidade urbana.                                          | Cidades                                       | Integração Regional; Transportes         |
| 29. Engenheiro de logística                     | Planejou rodovias, ferrovias, portos, aeroportos e cadeias de transporte.                               | Transportes / Portos e Aeroportos             | Integração Regional; Cidades             |
| 30. Gestor de desenvolvimento produtivo         | Executou política industrial, redes de pequenas empresas e desenvolvimento setorial.                    | Indústria e Comércio / Empreendedorismo       | Fazenda; Turismo                         |

Esta tabela é um primeiro repertório, não a matriz final. Antes de qualquer implementação, cada tipo precisa ser descrito por evidências canônicas e testado nos sentidos **tipo → cargos** e **cargo → candidatos**. Os tipos 04, 14, 16, 21, 23 e 30 são amplos e devem passar por revisão de plausibilidade: um currículo não ganha preparo máximo para todas as funções apenas porque a carreira tem nome abrangente.

## 6. O teste dos 80 e o limite real da liberdade

O benchmark começa com 32 ministérios e seis outros cargos. Divide 48 conjuntos de competências ministeriais para chegar a **80 ministérios e 86 cargos totais**, sem tocar nos seis cargos de outra natureza. As 131 frases atuais são suficientes em quantidade bruta para ensaiar a divisão, mas precisam de decomposição semântica e conferência jurídica antes de virar 131 competências.

O cenário deve misturar Fazenda/tributos/dívida, Saúde/vigilância/insumos, Educação/escolas/universidades, Defesa/forças/logística, Segurança/PF/fronteiras, Desenvolvimento Social/renda/alimentos, Direitos Humanos/ouvidoria/educação, Meio Ambiente/florestas/clima, Agricultura/agrodefesa/extensão, Transportes/rodovias/ferrovias, Portos/aeroportos, Trabalho/emprego/fiscalização, Cultura/esporte/turismo, Comunicações/telecom/digital e funções transversais. Também testa uma versão com apenas cinco ministérios por fusão. O benchmark é dado de prova, **não lista de ministérios que o jogador pode escolher**.

### Oitenta composições para o ensaio

Esta lista é uma **hipótese de cobertura**, não a saída do futuro motor nem uma proposta de lei. Cada linha indica o tipo com melhor preparo esperado e dois tipos com experiência aproveitável. A partição exata das competências originais ainda precisa de revisão para impedir que um mesmo trabalho seja contado duas vezes. Os seis cargos da Presidência/AGU ficam fora dos 80 ministérios deste ensaio.

| Nº  | Pasta de ensaio                              | Alto | Médios |
| :-- | :------------------------------------------- | :--- | :----- |
| 01  | Gestão Pública                               | 01   | 08, 06 |
| 02  | Pessoas do Serviço Público                   | 01   | 19, 05 |
| 03  | Planejamento Estratégico                     | 08   | 01, 02 |
| 04  | Orçamento Federal                            | 08   | 07, 06 |
| 05  | Controle Interno                             | 06   | 05, 08 |
| 06  | Auditoria de Programas                       | 06   | 08, 17 |
| 07  | Política Judiciária                          | 05   | 12, 20 |
| 08  | Desenvolvimento Regional                     | 02   | 28, 08 |
| 09  | Tributos                                     | 07   | 08, 06 |
| 10  | Aduana                                       | 07   | 09, 06 |
| 11  | Contas Públicas                              | 08   | 07, 06 |
| 12  | Dívida Pública                               | 08   | 07, 09 |
| 13  | Crédito e Bancos                             | 07   | 08, 30 |
| 14  | Desenvolvimento Industrial                   | 30   | 08, 27 |
| 15  | Micro e Pequenas Empresas                    | 30   | 24, 08 |
| 16  | Comércio Exterior                            | 09   | 30, 07 |
| 17  | Defesa Nacional                              | 10   | 11, 09 |
| 18  | Forças Armadas                               | 10   | 11, 12 |
| 19  | Logística de Defesa                          | 10   | 29, 27 |
| 20  | Segurança Pública                            | 12   | 11, 05 |
| 21  | Polícia Federal                              | 12   | 06, 05 |
| 22  | Proteção de Fronteiras                       | 11   | 12, 09 |
| 23  | Proteção Civil e Desastres                   | 02   | 10, 28 |
| 24  | Cibersegurança                               | 11   | 16, 12 |
| 25  | Gestão do SUS                                | 13   | 17, 08 |
| 26  | Atenção Básica                               | 13   | 17, 15 |
| 27  | Vigilância Sanitária                         | 13   | 26, 23 |
| 28  | Vigilância Epidemiológica                    | 13   | 26, 16 |
| 29  | Medicamentos e Insumos                       | 13   | 16, 30 |
| 30  | Assistência Social                           | 17   | 20, 13 |
| 31  | Renda e Cadastro                             | 17   | 18, 08 |
| 32  | Previdência                                  | 18   | 08, 19 |
| 33  | Educação Básica                              | 15   | 17, 03 |
| 34  | Universidades                                | 15   | 16, 08 |
| 35  | Ciência                                      | 16   | 15, 27 |
| 36  | Inovação                                     | 16   | 30, 08 |
| 37  | Cultura                                      | 14   | 03, 15 |
| 38  | Esporte                                      | 14   | 15, 17 |
| 39  | Turismo                                      | 14   | 30, 09 |
| 40  | Patrimônio Cultural                          | 14   | 26, 15 |
| 41  | Direitos Humanos                             | 03   | 20, 21 |
| 42  | Ouvidoria de Direitos Humanos                | 20   | 06, 05 |
| 43  | Igualdade Racial                             | 21   | 20, 03 |
| 44  | Direitos das Mulheres                        | 21   | 20, 17 |
| 45  | Povos Indígenas                              | 22   | 20, 26 |
| 46  | Direitos de Pessoas com Deficiência e Idosas | 20   | 17, 18 |
| 47  | Infância e Adolescência                      | 17   | 20, 15 |
| 48  | Migração e Refúgio                           | 09   | 20, 05 |
| 49  | Agricultura                                  | 23   | 24, 30 |
| 50  | Defesa Agropecuária                          | 23   | 26, 13 |
| 51  | Pesquisa Agropecuária                        | 23   | 16, 26 |
| 52  | Agricultura Familiar                         | 24   | 23, 17 |
| 53  | Reforma Agrária                              | 24   | 22, 05 |
| 54  | Pesca                                        | 25   | 23, 26 |
| 55  | Aquicultura                                  | 25   | 23, 13 |
| 56  | Segurança Alimentar                          | 17   | 23, 24 |
| 57  | Meio Ambiente                                | 26   | 22, 23 |
| 58  | Florestas                                    | 26   | 22, 23 |
| 59  | Biodiversidade                               | 26   | 16, 23 |
| 60  | Clima                                        | 26   | 27, 02 |
| 61  | Energia Elétrica                             | 27   | 16, 08 |
| 62  | Petróleo e Gás                               | 27   | 30, 06 |
| 63  | Mineração                                    | 27   | 26, 29 |
| 64  | Transição Energética                         | 27   | 26, 30 |
| 65  | Cidades                                      | 28   | 02, 17 |
| 66  | Habitação                                    | 28   | 17, 08 |
| 67  | Saneamento                                   | 28   | 13, 27 |
| 68  | Mobilidade Urbana                            | 28   | 29, 02 |
| 69  | Transportes                                  | 29   | 28, 30 |
| 70  | Ferrovias                                    | 29   | 30, 28 |
| 71  | Portos                                       | 29   | 25, 09 |
| 72  | Aeroportos                                   | 29   | 09, 11 |
| 73  | Relações Exteriores                          | 09   | 02, 05 |
| 74  | Comunicação Digital                          | 16   | 04, 03 |
| 75  | Telecomunicações                             | 16   | 04, 27 |
| 76  | Inclusão Digital                             | 16   | 15, 17 |
| 77  | Serviços Postais                             | 29   | 04, 01 |
| 78  | Radiodifusão                                 | 04   | 16, 05 |
| 79  | Trabalho e Emprego                           | 19   | 17, 30 |
| 80  | Fiscalização do Trabalho                     | 19   | 06, 05 |

Conferência estrutural desta tabela: 80 linhas numeradas sem repetição, três tipos distintos por linha, 240 relações de encaixe e pelo menos três linhas para cada um dos 30 tipos. Todos os 30 aparecem ao menos uma vez na coluna “Alto”; o tipo 03 também tem encaixe forte na **Secretaria-Geral da Presidência**, um dos seis cargos preservados fora dos 80 ministérios. Essa contagem verifica o desenho da tabela, **não** prova que um currículo gerado receberia a mesma nota do futuro motor.

Invariantes do benchmark:

1. Cada um dos 30 tipos é apto a pelo menos três composições diferentes, com pelo menos uma de preparo máximo em uma composição plausível.
2. Em cada ministério que não seja vazio, a lista consegue mostrar ao menos três pessoas distintas aptas quando o país dispõe desse contingente. Para evitar três cópias da mesma carreira, o benchmark também exige três **tipos diferentes** por pasta. Nesse critério adicional, 80 × 3 = 240 relações tipo/cargo, média de oito cargos por tipo; “três cargos por tipo” isoladamente não cobre os 80. Três pessoas do mesmo tipo satisfariam apenas a primeira condição.
3. Não se promete preparo 6 para toda fusão arbitrária. Escassez de especialistas é consequência válida e precisa aparecer na ficha.
4. Cada competência ativa tem responsável principal verificável ou uma exigência explícita de decisão pendente; funções comuns e funções especializadas não são fundidas por palavra parecida.
5. Nomeações não duplicam pessoa; identidade, características e trajetória resistem a troca de pasta e save/reload.
6. O total de trabalho transferido conserva sua massa; abrir 80 gabinetes acrescenta despesas e coordenação, sem criar 48 vezes mais capacidade ou votos garantidos.
7. Previsão da posse e execução do mês consultam a mesma função. A UI exibe a informação que a Presidência conhece.

“Quase infinita” aqui significa livre combinação, nomeação e redistribuição dos deveres modelados, sem catálogo fechado de ministérios. Nenhum sistema determinístico consegue inventar consequências fiscais e jurídicas confiáveis para uma competência inédita apenas lendo seu nome. Um órgão com nome novo pode nascer; uma competência inédita só recebe efeito quando seus mecanismos forem definidos e validados.

## 7. Incentivos e provas adversariais

A conta política precisa separar três grandezas. **Massa de trabalho** = soma dos pesos das competências, conservada ao transferir ou juntar. **Valor de nomeação** = trabalho realmente administrado pelo órgão mais um prestígio institucional que cresce cada vez menos quando se criam pastas; seu total é normalizado pelo valor de todos os cargos ativos. **Custo de estrutura** = equipe mínima por órgão mais coordenação entre órgãos que dividem uma política. Os parâmetros dessa conta dependem de calibração posterior, mas a propriedade matemática é obrigatória: dividir uma competência em dez órgãos não multiplica por dez o trabalho, a capacidade, o orçamento nem os votos que ela pode render.

- **Fatiamento lucrativo:** comparar 32, 5 e 80 ministérios com o mesmo trabalho e os mesmos partidos. A coalizão não deve ganhar apoio líquido ilimitado só pela contagem de cadeiras. Prestígio adicional de um ministro pode existir, mas tem teto e custo administrativo e político.
- **Extinção oportunista:** extinguir uma pasta não apaga sua obrigação nem o custo de executá-la. Reações seguem competência e público afetado, e não o nome do ministério.
- **Fusão universal:** juntar tudo em cinco pastas deve aumentar amplitude, dificuldade de comando e conflito de prioridades; não render preparo 6 automático nem o peso político de 32 ministros concentrado em cinco pessoas sem atrito.
- **Indicação em série:** mudar uma pasta de nome ou transferir uma função não deve gerar novas pessoas nem permitir a mesma pessoa em vários cargos.
- **Palavras perigosas:** “segurança alimentar” ≠ “segurança pública”; “defesa do consumidor” ≠ “defesa nacional”; “ouvidoria geral” ≠ “ouvidoria nacional de direitos humanos”. Testar também negação, siglas e frases ambíguas.
- **Tempo e derrota:** assinar uma reforma, nomear, avançar meses, rejeitar o ato e restaurar a situação jurídica aplicável sem perder a história das pessoas e das decisões.
- **Interface de 80 pastas:** com 80 ministérios e os seis outros cargos, os círculos atuais de 32 px ficariam separados por cerca de 14–15 px nos anéis externos; portanto, se sobreporiam. A navegação precisará variar a apresentação do conjunto mantendo os controles e o desenho de cada pasta. Não se pode alegar suporte a 80 com pastas inalcançáveis pelo mouse ou teclado.

## 8. Ordem de execução quando o desenho for aceito

1. **Contrato de competências:** decompor as 131 frases ministeriais e as funções juridicamente relevantes em IDs, fonte, relações com programas e regra de titularidade; registrar ambiguidades sem fabricar efeitos.
2. **Operações puras:** implementar reestruturação, inversas, vigência e preservação de massa; provar 5/32/80, persistência e determinismo antes de ligar a tela.
3. **Pessoas:** substituir perfis por cargo e notáveis fixos pelos 30 tipos de experiência, gerador de instâncias e cálculo explicável de preparo; fazer auditoria cruzada dos currículos.
4. **Política e mundo:** adaptar coalizão, pedidos de partidos, ministros ativos, orçamento administrativo, reações e simulação de 48 meses; comparar estratégias de fatiar, fundir e manter.
5. **Posse e rito:** ligar a mesma consulta ao protótipo, preservar botões e fichas, tratar 80 pastas e integrar proposta/ato/resultado ao jogo. A rota legal permanece no sistema de normas.
6. **Provas independentes:** atualizar testes que hoje exigem 38 cadeiras, criar testes do domínio e passeio real da posse; passar `validate`, `simulate` e revisão adversarial por modelo que não implementou.

Arquivos com acoplamento confirmado: `tmp/posse/parts/data-now.js`, `class-now.js`, `people-catalog.mjs`, `people-logic.js`, `patch-v2o.mjs`, `src/data/cabinet.mjs`, `ministers.mjs`, `areas.mjs`, `programs.mjs`, `src/domain/cast/index.mjs`, `src/application/cabinet.mjs`, `world.mjs`, `contingency.mjs`, `turn.mjs`, `src/state/state.mjs`, `save.mjs`, `src/app/`, `src/ui/`, `tools/simulate.mjs` e as respectivas provas. Editar somente o HTML gerado não altera a fonte do protótipo.

## 9. O que ainda exige validação

Esta proposta ainda não prova que os 30 tipos cobrem 80 composições juridicamente plausíveis, nem calibra os pesos de preparo e coalizão. A matriz depende muito de tipos generalistas: 08 aparece em 19 pastas e 17 em 16, enquanto 18, 21 e 25 aparecem em apenas três. Isso pode ser correto ou sinal de currículo genérico demais; exige revisão por competência. Também não resolve o desenho exato da navegação quando o hemiciclo excede sua capacidade geométrica. Esses são critérios de aceitação, não promessas já cumpridas. A revisão de currículos, fontes jurídicas, equilíbrio político e acessibilidade deve preceder a integração definitiva.
