# Auditoria dos planos — 29/09/2026

O planejamento tem uma direção consistente, mas ainda não forma um contrato de implementação
inteiramente coerente. A auditoria encontrou **12 achados**: contradições documentais, dependências
insuficientemente explícitas e aceites que precisam de provas mais precisas. Eles não são 12 bugs
novos demonstrados no jogo. A integração do governo variável continua pendente.

Pedido: revisar todos os planos, investigar e auditar. Retrato: branch `caixa-de-entrada`, HEAD
`a75ef108ac54f96311ea16abb83a2eb41ac6c87e`, com trabalho local anterior preservado. A auditoria
alterou documentação e gravou evidência; não modificou o motor, calibragem, testes ou saves.

## 1. Abrangência e método

Foram rastreados **16 documentos de especificação, 33 ciclos, três ADRs e 20 pesquisas**, além
do índice, contratos dos agentes e handoff. Contratos ativos, etapas, dependências e aceites foram
confrontados em detalhe. Ciclos históricos passaram por triagem de abertura, situação, estrutura
e reaproveitamento no mapa; não houve releitura integral de cada parágrafo histórico. Pesquisas
tiveram triagem e consulta dirigida; suas marcas de verificação não foram tomadas como nova
conferência de todos os fatos. As verificações externas desta rodada se concentraram em MP e
separação fiscal de estatais.

A auditoria distingue jogo existente, protótipo executável, proposta e decisão aprovada. Uma
dependência planejada não é bug por ainda faltar. O achado existe quando documentos prescrevem
comportamentos incompatíveis, um portão não prova sua promessa ou falta delimitar um pré-requisito.

| Documento ativo                                      | Papel e resultado da revisão                                                                |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [Especificação mestra](../spec/master-spec.md)       | Autoridade de arquitetura; calendário, informação, agência, fontes e aceites confrontados.  |
| [Jogo em uma página](../spec/game-in-one-page.md)    | Promessa e loop; referência ao plano corrente corrigida.                                    |
| [Gramática](../spec/rules-grammar.md)                | Rota, portão, efeito e ciclo; achados P05–P09.                                              |
| [Mapa de migração](../spec/migration-map.md)         | Reuso, transição, lotes e descartes; achados P01, P07 e P10.                                |
| [Corte da estatal](../spec/vertical-slice-energy.md) | Cadeia material e fiscal; achados P08–P10.                                                  |
| [Checklist](../spec/presidential-checklist.md)       | Conteúdo e cobertura datada; aprovação e implementação agora distinguidas na abertura.      |
| [Mapa da interface](../spec/interface-map.md)        | Direção visual e consultas; precisa da visão presidencial de P10.                           |
| [Ministério](../spec/the-cabinet.md)                 | Proposta anterior; premissas substituídas agora sinalizadas.                                |
| [Modelo da base](../spec/the-base-model.md)          | Modelo transitório confrontado com ECLUSA e suas provas; P11.                               |
| [Partidos](../spec/the-parties.md)                   | Catálogo e restrições deliberadas; não revogadas por esta auditoria.                        |
| [Mundo vivo](../spec/the-living-world.md)            | Agência mensal existente e lote futuro de imprensa; não equivale ao mundo semanal completo. |
| [Porte da posse](../spec/the-posse-port.md)          | Distinção entre fonte visual, conta do protótipo e consulta do jogo.                        |
| [Semana](../spec/the-week.md)                        | Agenda, disponibilidade e escalada; P04.                                                    |
| [Partidas-teste](../spec/the-test-playthroughs.md)   | Dezesseis fios e versões; necessidade de aceites operacionais em P12.                       |
| [Governo variável](dynamic-government-2026-09-30.md) | Experiências, preparo e integração; P02–P03.                                                |
| [Piloto](government-pilot-2026-09-30.md)             | Recorte, contrafactual e limites; base do próximo portão.                                   |

| Ciclos rastreados | Disposição nesta auditoria                                                                                                                           |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01–06             | Histórico de fundação; não reabre implementação só por existir promessa antiga.                                                                      |
| 07–12             | Partes feitas e propostas não iniciadas separadas pelo [índice](../cycles/README.md); Congresso, rastro e projeção confrontados com a direção atual. |
| 13                | Antigo plano mestre, hoje referência; coalizão, eleição, autonomia e causalidade confrontadas com ciclo 33 e mapa.                                   |
| 14–16             | Correspondência e formas anteriores do Gabinete; histórico de provas e decisões visuais.                                                             |
| 17–18             | Ambição do Brasil inteiro e poderes; conteúdo reaproveitado pelo checklist e ciclo 33.                                                               |
| 19                | API descartada; permanece a direção de avaliação determinística.                                                                                     |
| 20                | Empresas absorvidas pelo corte da estatal.                                                                                                           |
| 21–28             | Mesa, normas, corpo político, Presidente e polimento; versões anteriores não competem com o plano atual.                                             |
| 29                | Trabalho residual de simplificação permanece aberto; não bloqueia automaticamente o ciclo 33.                                                        |
| 30                | Itens classificados pelo mapa §10; receitas por base e provas continuam exigindo destino explícito.                                                  |
| 31                | E0 implementado e pausado por resultado de playtest; não declarado novamente aprovado.                                                               |
| 32                | Direção de interface e portões absorvidos pelo ciclo 33.                                                                                             |
| 33                | Plano aprovado em vigor; ordem preservada, dependências e aceites auditados.                                                                         |

As três [ADRs](../adr/) foram confrontadas: domínio determinístico, vocabulário sem efeitos de LLM
e pessoas fictícias permanecem. A antiga emenda de API da ADR 0001 ganhou aviso de perda de
vigência. A escolha dos notáveis fixos exige explicitar sua exceção de geração, sem abandonar
identidade fictícia ou usar uma tabela de preparo por pasta.

Nas pesquisas, 01–02 são insumos econômicos a conferir; 03 é referência de mecânicas; 04, 06,
07, 09 e 13 tratam cargo, fisco e instituições; 05, 08 e 10–12 são histórico visual; 14–15
sustentam estatal e posse; 17–18 sustentam base e partidos; 19–20 sustentam Xi e Lee. A pesquisa
16 é uma comparação datada de produtos, não um requisito de jogo; preços não foram reutilizados.
Nenhuma hipótese da pesquisa 13 foi promovida a fato validado nesta rodada.

## 2. Achados e prioridades

**P1**: fechar antes da integração ou da etapa que depende do contrato. **P2**: corrigir
orientação ou precisão de documentação. Nenhum P0 foi demonstrado nesta auditoria de planos.

| ID  | Prioridade | Achado                                                                            | Situação após esta rodada                                             |
| --- | ---------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| P01 | P2         | Autoridade e estado apontavam planos diferentes.                                  | Referências corrigidas; retratos históricos preservados.              |
| P02 | P1         | Governo variável coexistia com especialistas perfeitos e destinos por nome.       | Premissas antigas sinalizadas; adaptação dos notáveis pendente.       |
| P03 | P1         | Expansão do catálogo antecedia a prova de consequência do piloto.                 | Sequência textual reconciliada; portão material ainda não executado.  |
| P04 | P1         | Semana civil, blocos de sete dias e calendário final não fecham o mesmo contrato. | Aberto; proposta de provas abaixo.                                    |
| P05 | P1         | Inversa de reforma e ciclo linear não resolvem vigência e efeitos de MP.          | Distinção já correta no piloto; adaptação canônica pendente.          |
| P06 | P1         | Resumo de sobrestamento pode bloquear matérias indevidas.                         | Exceção oficial registrada; consumidor e provas pendentes.            |
| P07 | P1         | Barra de poder rebaixa rito sem mudança institucional demonstrada.                | Reproduzido; gramática marcada como legado; motor permanece.          |
| P08 | P1         | Ficha da estatal e fiscal legado podem misturar empresa e Tesouro.                | Aritmética e fonte conferidas; novo contrato contábil pendente.       |
| P09 | P1         | Chance de portão e duração de um caso podem substituir agência e procedimento.    | Aberto; delimitação necessária antes de E1.6.                         |
| P10 | P1         | Informação mínima e alguns pré-requisitos não têm corte antecipado explícito.     | Aberto; matriz proposta abaixo.                                       |
| P11 | P2         | Votos firmes e igualdade das chances são descritos com precisão excessiva.        | Divergência medida; motor transitório identificado.                   |
| P12 | P1         | Alcance de regimes e taxas de desfecho ainda não têm protocolo suficiente.        | Aberto; não justifica calibragem para procurar uma semente vencedora. |

### P01. Uma sessão pode retomar a fila errada

O índice dos ciclos apresentava o mapa e a estatal como trabalho corrente, mas a tabela, o
handoff e CLAUDE apontavam o ciclo 33. O jogo em uma página ainda definia E1 como plano inteiro.
O mapa listava o codinome do ActorEngine como bloqueador aberto de A1, embora VONTADE exista.
A ADR 0001 conservava uma emenda permissiva de API sem aviso da decisão posterior de descartá-la.
O checklist ainda esperava aprovação dos itens 41–54, já incluídos no plano aprovado.

Correção feita: referências atuais e avisos de vigência, sem apagar o registro anterior.
Estado operacional continua no handoff. Uma abertura datada de ciclo histórico não vira fila
ativa nem prova de que a implementação ainda está no estado daquela data.

### P02. A nova arquitetura não pode herdar as garantias do catálogo antigo

[O ministério](../spec/the-cabinet.md), §§1, 3 e 4, prescrevia três especialistas com preparo 6 por
pasta, criação apenas por divisão, destinos por assunto parecido e reação ao desaparecimento
do nome. [Governo variável](dynamic-government-2026-09-30.md) e o [piloto](government-pilot-2026-09-30.md)
retiram essas inferências: experiências são persistentes, nomes não atribuem capacidade e
responsabilidade formal não é execução.

O aviso de precedência e o handoff foram corrigidos. As 38 cadeiras continuam configuração de
abertura, não teto. As seis origens presidenciais e os 33 notáveis eram escolhas específicas;
não foram silenciosamente revogados. Falta fechar como os notáveis entram no cadastro comum e
recebem avaliação pelo currículo, preservando a referência visual aprovada.

Prova de fechamento: renomear não altera preparo; pessoa conserva episódios entre consultas;
criar ou dividir não gera candidatos, recursos ou apoio gratuitos; relações de Anvisa, SUS e
comandos não mudam automaticamente com o responsável ministerial.

### P03. O recorte precisa poder fracassar antes de ser multiplicado

O último parágrafo de governo variável mandava avançar até as 152 descrições. O piloto §9 manda
provar responsabilidades, diferenças explicáveis e uma escolha com ganho e perda antes das
outras 139. O experimento atual conserva estrutura e compara evidência; não mede custo,
coordenação, capacidade ou entrega. Sua expansão, sozinha, não resolve a lição do E0.

Correção feita: começar pelo recorte de A com experiências pertinentes de B/C e consequências,
sem exigir conclusão do catálogo inteiro. Prova pendente: manter, fundir, extinguir e especializar
sob os mesmos recursos e informação, com causas que expliquem quando cada alternativa é melhor.
Revisão independente e uso pelo Diretor antecedem a expansão, conforme o piloto.

### P04. O relógio ainda admite duas implementações diferentes

Especificação §4.1 e mapa §5.1 definem semana civil com primeira semana parcial. A semana de
governo descreve sete dias por avanço. O mapa preserva 48 fechamentos em W1, terminando em
31/12/2030 por compatibilidade; o ciclo 33 exige jogar até 04/01/2031. Os dias finais, o primeiro
janeiro parcial e o bissexto continuam abertos na especificação §4.5.

Há outras ambiguidades: meio dia de reunião em três turnos diários; disponibilidade do Senado
inferida da Câmara embora a fonte seja marcada FALTA; escalada de crise descrita como sequência
fixa até a Justiça. O próprio levantamento da Câmara inclui segundas e sextas: frequência
observada não é proibição. Justiça precisa de provocação, procedimento e competência.

Proposta: manter calendário civil como autoridade, explicitar fronteiras e ordenar efeitos por
data. Testar primeira e última semana, 29/02/2028, semana cruzando mês, recesso e save em qualquer
turno. Uma sequência temporal idêntica deve fechar cada mês uma vez e reproduzir o estado com
ou sem recarga. A escalada deve poder parar quando ninguém recebeu evidência ou decidiu agir.

### P05. Desfazer estrutura não equivale a desfazer a história jurídica

O ministério §1 afirma restauração da estrutura antiga quando a MP cai. O piloto §7 corretamente
distingue `splitMerge` e reversão jurídica. Falta transportar esse contrato à MP mínima da etapa
1 e às rotas gerais. O ciclo linear da especificação §13.7 também precisa representar uma MP
em vigor e executada enquanto sua conversão ainda tramita, como reconhece a gramática §7.

A Constituição prevê disciplina das relações produzidas durante a vigência e preservação sob
condições próprias; não cabe um rollback universal de todos os atos. Fonte primária conferida:
[Constituição, art. 62, §§3º e 11](https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm).

Prova proposta: reforma provisória, nomeação, despesa, transferência posterior e perda de eficácia;
com e sem disciplina legislativa posterior. Preservar identidade e histórico, distinguir o que
cessa de vigorar do que produziu efeitos e listar conflitos. Tramitação, eficácia e execução devem
ser consultáveis simultaneamente, derivadas das mesmas fontes, sem três autoridades paralelas.

### P06. Uma MP não pode congelar qualquer pauta

Gramática §2, corte e ciclo 33 resumem o sobrestamento como trancamento da pauta. Se isso virar
um booleano global, editar uma MP poderia impedir PEC ou lei complementar por via indevida.
Na Câmara, o MS 27.931 delimita o alcance às matérias passíveis de MP. Fonte:
[STF, decisão de 29/06/2017](https://noticias.stf.jus.br/postsnoticias/stf-decide-que-trancamento-de-pauta-da-camara-por-mps-nao-alcanca-todos-os-projetos-e-propostas/).

A exceção entrou na gramática. Falta a prova com MP urgente, PL sujeito ao sobrestamento e
PEC/PLP, distinguindo Casa e tipo de sessão. O rito do Senado e alterações posteriores precisam
da conferência própria antes de codificação; a auditoria não generaliza a prática da Câmara.

### P07. Poder agregado ainda produz uma autorização mágica

O mapa §4.13 descreve rebaixamento pelo poder, mas lista apenas o pacote mensal como colisão.
A gramática apresentava o rebaixamento como regra de concentração. A função real `riteFor`,
com uma mesma faixa protegida por `constitution`, produziu:

| Poder | Rito retornado |
| ----- | -------------- |
| 0     | `amendment`    |
| 60    | `law`          |
| 85    | `budget`       |

Reprodução local: copiar `tmp/history/recovery-2026-09-30/plan-audit-probe.mjs` para `tmp/` (os imports partem de lá) e rodar `node tmp/plan-audit-probe.mjs`; entrada `floor: 50`, `ceiling: 100`,
`guard: "constitution"`, nível pedido 0. A função é de produção; a faixa é sintética.
Resultado preservado na [evidência](../evidence/plan-audit-2026-09-29.json).

Isso é comportamento legado intencional, não regressão atribuída ao protótipo. O plano novo
exige separar competência jurídica e obediência extralegal. A gramática foi marcada; falta
atribuir a retirada de `underPower` ao resolvedor generalizado. Prova: mesmas fontes e cláusula
mantêm o rito legal com qualquer barra; destinatários podem obedecer ou recusar uma tentativa
fora da competência, sem alterar por isso a Constituição. Coeficientes não foram modificados.

### P08. A migração da estatal precisa de contas e unidades antes de calibrar

O corte §8 afirma que a venda retira dividendo e folha do Tesouro. A aplicação atual inclui
`payroll` em alívio permanente da obrigatória (`turn.mjs`, função que calcula `relief`). Para
`petroleo-e-gas`, a proxy na abertura é `620 × 0,022 × 62 / 100 = 8,4568` bilhões por ano.
Isso mede a fórmula existente; não mede uma economia real nem o efeito de uma campanha.

O modelo precisa distinguir empresa dependente de não dependente e transferência ao Tesouro de
custo da própria empresa. A definição legal está na [LRF, art. 2º, III](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm).
A separação de orçamento e resultado, incluindo Petrobras, aparece no
[anexo de riscos fiscais da PLOA 2025](https://www.gov.br/planejamento/pt-br/assuntos/orcamento/orcamentos-anuais/2025/ploa/3_volume_3_incisos_ix_a_xxi__exceto_xiii_e_xv.pdf).
Não copiar a folha corporativa como economia fiscal automática da União.

A ficha do corte também soma apenas **98,26%** do capital: 29,02 + 8,03 + 61,21. O residual de
1,74 ponto precisa ser reconciliado na fonte; esta auditoria não inventa seu proprietário.
Percentual votante, total, capital em circulação e ações próprias precisam de bases explícitas.
Valores em dólar, reais, estoque e fluxo anual também não são entradas intercambiáveis.

Provas propostas: balanços separados; pagador e recebedor em cada venda, emissão, dividendo e
aporte; despesas corporativas sem dupla contagem; venda de subsidiária não creditada diretamente
ao Tesouro; soma das participações reconciliada; conversão de moeda datada. A equivalência fiscal
legada em E1.1 serve à migração, não valida a contabilidade final nem impede correção fundamentada.

### P09. Portão jurídico não pode virar um dado com nome de tribunal

Gramática §4 e E1.6 do mapa combinam prazo de episódio com chance [DESENHO]. A especificação
§§9, 15 e 18.14 exige ator, informação, fundamento e procedimento; sorteio não substitui decisão.
Dez meses entre lei e TCU, por exemplo, não demonstra dez meses de trabalho exclusivo do TCU.
Um caso tampouco fornece distribuição universal de demora ou taxa de aprovação.

Antes de E1.6, separar decisão de provocar, admissibilidade, evidência, julgamento, execução e
demoras externas. A chance exibida pode ser estimativa presidencial; não pode silenciosamente
ser a regra que decide pela instituição. Prova: mesmos autos e estados dos atores produzem a
mesma decisão; informação presidencial incompleta muda a estimativa, não os autos; atraso tem
causa e fonte ou hipótese explícita. Fixar durações por caso permanece hipótese, não calibração validada.

### P10. A ordem macro é aprovada; os cortes de dependência ainda precisam ser escritos

O ciclo 33 entrega previsão eleitoral na etapa 6 e exige reação a pesquisa publicada. A entrega
geral C1–C3 está na etapa 7. Ele já antecipa B4/C3 eleitorais, mas não explicita o recorte de C1
e das crenças que sustenta a previsão anterior. Gabinete e estatal também exibem informação
antes da imprensa completa. A2a existente resolve parte da crença; não publica pesquisas ou
substitui todas as consultas listadas no mapa §5.6.

O mapa §10 preserva separação de RCL e receita de impostos do ciclo 30 B1. Esse trabalho não
ganhou lote claramente delimitado no ciclo 33. R1–R4 são obrigatórios, mas a ressalva genérica
não identifica todas as entregas que bloqueiam. A3 aparece condicional na estatal, embora os
acordos persistentes precisem de compromisso único. Isso exige um recorte mínimo, não antecipar
toda a imprensa ou mudar a ordem aprovada.

| Antes de fechar | Dependência mínima a delimitar                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------------------------------- |
| Etapa 1         | Reforma com eficácia e histórico; nomeações, cadastro comum, continuidade e visão do preparo.                        |
| Etapa 2         | Calendário civil, prazo, fonte de cada informação da mesa e composição causal.                                       |
| Etapa 3         | Contas da estatal, fontes jurídicas dos portões, compromissos realmente usados e informação mínima.                  |
| Etapa 4         | R1/R4, presença e quóruns por rota, substituição de `underPower`, D2 e bases fiscais pertinentes.                    |
| Etapa 6         | Publicação/recebimento de pesquisa, opinião regional necessária, regra eleitoral e previsão acessível à Presidência. |

Prova comum: variar apenas verdade oculta não muda a consulta; receber informação relevante pode
mudá-la; consulta não modifica estado nem gasta RNG. Não é preciso criar `PresidentialView` como
entidade persistente para cumprir isso.

### P11. Voto firme é uma estimativa transitória, não a votação da PEC

Modelo da base §4 diz que voto firme decide emenda/reforma; §7 declara que a votação ainda é
por bancada. `firmCount` conta chances acima de um corte; não é o consumidor que decide o
resultado real de uma PEC. A estimativa precisa ser específica à matéria, presença e informação,
como exige a especificação §14.9. A pesquisa de apoio em votações comuns não valida diretamente
esse corte como previsão de mudança constitucional.

A prova de soma também aceita diferença até cinco cadeiras; não exige igualdade. Na semente
20270101, governo `pcs`, a soma por partido é **326,3001** e por deputado **328,0644**: diferença
**1,7644**. Portanto a afirmação de igualdade exata seria incorreta; o teste observado passa
seu contrato aproximado. Não foi alterado para impor uma precisão nova.

Proposta: explicitar o caráter transitório, usar previsão contextual em D2 e testar sua qualidade
em matérias diversas. Os achados 86 e 87 continuam abertos; a auditoria não os fecha por essas contas.

### P12. Aceite precisa distinguir alcance, probabilidade e equilíbrio

O ciclo 33 §6 exige êxito e fracasso de Xi/Lee e pelo menos uma semente para cada destino extremo.
A especificação §17 deixa dimensões abertas; ainda falta a definição operacional de chegar a um
Brasil parecido com cada país. Sem predicado registrado antes do ensaio, o rótulo pode seguir o
resultado desejado. Uma semente encontrada por busca prova alcance; não mede a probabilidade em
um conjunto não selecionado, nem demonstra ausência de estratégia dominante.

O aceite antigo das partidas pede duas versões de todos os fios, embora Xi 2 e Lee 1 declarem
que não precisam de versão extralegal. O ciclo 33 melhora isso ao dizer versões exigidas; falta
a matriz por fio, sem preencher a contagem com ações semanticamente irrelevantes.

Proposta: registrar por fio ação, rota, reação, execução e atraso; definir predicados de regime
por fatos vigentes/executados; separar sementes de demonstração e conjunto de avaliação fixado
antes de calibrar; relatar tentativas, falhas, resultados e políticas comparáveis. Frequência
depende da distribuição declarada. Não exigir resultados iguais das duas estratégias nem ajustar
dados para satisfazer um rótulo. Aprovação humana e revisão independente continuam necessárias.

## 3. O que foi feito e o que falta

**Feito nesta rodada:** mapa de autoridade e cobertura; confronto dos contratos ativos; consulta
às fontes primárias pertinentes; sonda de funções de produção e aritmética; 12 achados com
provas propostas; correções documentais em índice, ciclo 33, jogo em uma página, ministério,
governo variável, gramática, checklist, mapa, ADR 0001 e handoff. Evidência gravada; journal atualizado.

**Próxima execução recomendada, dentro da etapa 1:**

1. Fechar relações, fontes e experiências testemunha do recorte de Direitos Humanos, Saúde e Defesa.
2. Demonstrar continuidade de equipes, casos, recursos e informação; comparar as quatro escolhas
   com manter a estrutura. Declarar hipóteses de custo, sem calibração disfarçada.
3. Submeter o recorte a revisão independente e uso pelo Diretor; corrigir o que esse portão revelar.
4. Expandir vocabulário e trajetórias, então adaptar geração, estado, coalizão, capacidade e UI.
5. Integrar somente com MP, save/recarga, efeitos, acessibilidade, escala e contratos de visão provados.

Os contratos P04–P12 devem ganhar entrega e portão antes da etapa correspondente. Não é necessário
resolver hoje STF completo, imprensa completa ou ruptura para testar o recorte institucional.

**Ainda faltam:** consequências materiais do piloto; revisão independente; adaptação dos notáveis;
gerador e preparo calibrados; integração ao jogo e ao save; contratos temporais e jurídicos;
contabilidade da estatal; cortes mínimos de informação; sondas Xi/Lee e predicados de regime;
portões completos da interface nova e playtests. A ordem das etapas 1–12 continua a aprovada.

## 4. Provas e limites da conclusão

A sonda local executou sem erro e seus valores estão na [evidência](../evidence/plan-audit-2026-09-29.json).
O script de reprodução foi arquivado em `tmp/history/recovery-2026-09-30/`, pasta ignorada pelo Git.
P07 chama `riteFor` com a entrada descrita; P08 usa a regra de petróleo do catálogo; P11 chama
`openingLoyalty` e `deputyChances` para os 16 partidos. A evidência está versionável, mesmo que
o script temporário não acompanhe um clone.

A rodada anterior de 29/09 fechou `validate` com 462 testes, passeio em 1440×980 e 1440×900 e
macaco de 60 ações, sem achados. Esse resultado está no handoff e no journal 113; não foi uma
validação das propostas deste relatório. As 39 provas do experimento verificam integridade e
informação qualitativa; as seis sondas mensais do jogo não exercitam reformas do protótipo.

Para esta alteração documental, o portão é formatação dos arquivos alterados, referências locais,
guardas e `git diff --check`, como na etapa documental do ciclo 33. A auditoria não promete
mitigação total nem aprova o próprio experimento como revisão independente.

Portão executado nesta auditoria: `check` passou com 13 guardas e 68 provas sintéticas;
`links` encontrou zero referências quebradas; Prettier dos documentos alterados e
`git diff --check` passaram. Não houve nova execução de `validate`, passeio ou simulação:
esta rodada alterou documentação e registrou a sonda, sem modificar o motor.

## 5. Avanço posterior — 30/09

Com autorização do Diretor, o piloto recebeu um recorte operacional isolado: coordenação,
execução, filas, fundos, registros e repasses que disputam capacidade existente. As quatro
escolhas agora têm consequências sintéticas; um quinto cenário verifica mudar prioridade sem
reforma. São 18 provas novas, incluindo 200 cenários de seis períodos com recursos e prioridades
variados. [Estado e limites](government-pilot-2026-09-30.md) e
[evidência](../evidence/government-operations-2026-09-30.json).

É avanço parcial de P03: demonstra a abstração de alguns efeitos antes de expandir vocabulário.
Não fecha P02–P12, não integra o protótipo e não substitui revisão independente, calibração
fundamentada ou teste de uso. Experiência pessoal continua qualitativa e a visão operacional
conhecida ainda é fornecida pelo chamador, sem construtor integrado ao estado oculto.

O `validate` desta execução passou com 480 testes, 13 guardas, links, tipos, lint, formato,
passeio nas duas resoluções e macaco de 60 ações sem achados. As 18 provas novas entraram no
portão sem mudança em guardas ou expectativas antigas. Não houve nova simulação mensal do jogo.
