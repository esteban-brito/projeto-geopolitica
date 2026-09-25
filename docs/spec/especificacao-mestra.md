# República Simulator — Especificação de Arquitetura, Simulação e Design

> **Versão do documento:** 1.0
> **Status:** especificação canônica de design e arquitetura
> **Data:** 24/09/2026
> **Autoridade de design:** direção do projeto
> **Escopo:** experiência presidencial, simulação social, instituições, política pública, execução e plano de implementação.
>
> A versão **1.0 deste documento não corresponde à versão do jogo**. Ela estabelece a primeira baseline formal e coerente da arquitetura de design.
>
> Este arquivo não é diário, changelog nem transcrição de discussão. Registra somente decisões vigentes, hipóteses relevantes, questões abertas e critérios verificáveis.

## Convenções de maturidade

- **[ATUAL]** — estado conhecido da implementação existente.
- **[DECISÃO]** — requisito ou direção aceita.
- **[HIPÓTESE]** — proposta plausível ainda não validada.
- **[ABERTO]** — decisão ainda necessária.
- **[DESCARTADO]** — caminho explicitamente abandonado.
- **[VERIFICAR]** — fato institucional/jurídico que exige fonte primária atual antes de virar regra executável.
- **[VERIFICADO]** — fato conferido em fonte oficial, com a fonte citada no ponto de uso.

## Convenções técnicas

- Prosa e interface: **PT-BR**.
- Identificadores internos: **inglês**.
- Enums e ações: `UPPER_SNAKE_CASE`.
- Campos: `snake_case`.
- Motores/componentes: `PascalCase`.
- As três convenções acima de caixa (`UPPER_SNAKE_CASE`, `snake_case`, `PascalCase`) valem para os schemas e exemplos deste documento. Não ordenam migração do JavaScript existente, que segue a convenção do repositório (`camelCase` em campos).
- Um conceito possui **uma única fonte de estado**.
- Informação derivável não deve ser mantida como estado paralelo.
- Fenômenos equivalentes reutilizam o mesmo objeto, ciclo e motor.
- Otimização pode alterar custo computacional; não pode alterar o resultado lógico da simulação.

---

# 1. VISÃO DO PRODUTO

## 1.1. Fantasia central

**[DECISÃO]**

República Simulator simula **a experiência de governar o Brasil a partir da Presidência da República**.

O jogador possui poder real, mas não controle total. Governa por meio de instituições, pessoas, instrumentos jurídicos, orçamento, negociação, comunicação e capacidade administrativa.

O mundo:

- possui atores com iniciativa própria;
- continua agindo sem o jogador;
- distribui informação de forma imperfeita;
- impõe limites jurídicos, políticos, materiais e temporais;
- preserva consequências de decisões anteriores;
- aceita projetos políticos muito diferentes sem presets ideológicos.

## 1.2. Fórmula

> **Realismo no motor. Poder, conflito, pessoas e consequências na superfície.**

Realismo não significa reproduzir burocracia por completo.

Uma complexidade merece superfície quando cria:

- decisão;
- risco;
- restrição;
- oportunidade;
- conflito;
- compromisso;
- informação relevante;
- compreensão causal.

O restante deve ser automatizado, resumido ou mantido em profundidade opcional.

## 1.3. Regra-mãe

> **“Quero fazer X” é uma pergunta ao Brasil, não um comando ao jogo.**

O sistema pode concluir que:

- o Presidente possui competência direta;
- é necessária uma norma;
- é necessária alteração constitucional;
- outra instituição precisa decidir;
- existem múltiplas rotas;
- há controvérsia jurídica;
- a ordem vigente bloqueia o objetivo;
- é possível tentar agir fora da competência, sujeito à adesão, resistência e consequências.

## 1.4. Não objetivos

**[DECISÃO]**

O jogo não pretende ser:

- simulador de burocracia documental;
- RTS da administração pública;
- gestor operacional de empresas estatais;
- dashboard de indicadores;
- árvore ideológica;
- chatbot político;
- narrativa roteirizada com escolhas falsas.

---

# 2. PRINCÍPIOS DE ARQUITETURA E DESIGN

**[DECISÃO]**

1. O Presidente influencia; não controla o país inteiro.
2. O mundo age autonomamente.
3. Toda alavanca relevante possui custo, limite ou consequência.
4. Tentativa, autorização, aprovação, vigência, execução e consolidação são fases distintas.
5. Consequências importantes precisam de causa rastreável.
6. Pessoas alteram comportamento; não são modificadores cosméticos.
7. Instituição não é sinônimo de ocupante.
8. Informação faz parte da simulação.
9. Comunicação altera crenças, compromissos e incentivos. Não altera diretamente estado material sem um mecanismo causal modelado (`fala → informação → crença/expectativa → decisão/comportamento → efeito material`).
10. Estratégia universalmente ótima indica falha de balanceamento.
11. Determinismo não significa previsibilidade para o jogador.
12. Histórias devem emergir das regras.
13. O Brasil real é o ponto de partida, não o destino político obrigatório.
14. Complexidade é revelada sob demanda.
15. O jogador não precisa dominar Direito para governar.
16. O jogo não julga coerência ideológica.
17. Uma ordem presidencial não implica execução automática.
18. Informação não teleporta entre atores.
19. Preferência privada, posição pública, compromisso e intenção podem divergir.
20. Profundidade econômica serve à Presidência, não à microgestão empresarial.
21. Fenômenos equivalentes compartilham objetos e motores.
22. Estado duplicado é defeito arquitetural.
23. IA generativa não participa da lógica de runtime.
24. O texto apresentado ao jogador nunca é a fonte da decisão simulada.

---

# 3. BASE DE INTEGRAÇÃO ATUAL

## 3.1. Estado conhecido

**[ATUAL]**

A base existente já possui, em algum grau:

- simulação determinística/reproduzível;
- representação da Câmara com 513 cadeiras;
- orçamento e regras fiscais;
- macroeconomia;
- opinião pública;
- elenco de atores;
- capacidade estatal;
- separação entre domínio e interface;
- infraestrutura de testes e simulações longas.

**[DECISÃO]**
O código existente deve ser inspecionado antes de qualquer migração. Esta seção é contexto de integração, não contrato de implementação detalhado.

## 3.2. Interface reaproveitável

**[ATUAL]**
A direção considera aproveitáveis, ainda que profundamente refináveis:

- Gabinete;
- barra superior;
- dock inferior;
- Email.

Todo o restante pode ser reestruturado.

## 3.3. Problema a corrigir

A profundidade atual aparece excessivamente como:

- índices;
- controles;
- telas;
- relatórios;
- abstrações.

A nova arquitetura deve expor principalmente:

- pessoas;
- conflitos;
- decisões;
- negociações;
- compromissos;
- execução;
- consequências rastreáveis.

## 3.4. Mundo real, pessoas inventadas

**[DECISÃO]**

Instituições, regras jurídicas, estrutura política e contexto brasileiro são reais. Pessoas e organizações que agem como personagem — inclusive empresas identificáveis no jogo — são fictícias, com inspiração reconhecível. A regra completa está no ADR 0003 do repositório.

---

# 4. TEMPO, CALENDÁRIO E RITMO

## 4.1. Unidade de avanço

**[DECISÃO]**

A experiência principal é semanal.

- calendário real;
- mandato completo;
- datas reais quando relevantes;
- prazos institucionais preservados;
- sistemas atualizados em sua frequência natural.

A semana é a unidade de avanço do jogador, não a frequência obrigatória de todos os sistemas. Atores e eventos agem quando há causa; Congresso e prazos seguem o calendário institucional; economia, fisco, capacidade e opinião seguem a frequência própria de cada um.

**[DECISÃO]** O calendário real é a autoridade temporal:

- a semana é a semana civil; a primeira pode ser parcial;
- “mês” não vira 30 dias e “semana” não vira sete dias contados às cegas;
- regularidades institucionais (dias de sessão, reuniões, divulgações) entram como regra com fonte, nunca como constante suposta.

**[DECISÃO]** A primeira experiência completa é um mandato presidencial de quatro anos, representado por regra e calendário, não por constante espalhada no código. Reeleição, quando existir, abre novo mandato.

**[VERIFICADO]** O mandato começa em 5 de janeiro do ano seguinte à eleição (CF art. 82, pela EC 111/2021, a partir da eleição de 2026): o primeiro mandato do jogo vai de 05/01/2027 a 05/01/2031. Fonte: Senado Notícias, 05/01/2026; TRE-PR.

## 4.2. Eventos dentro da semana

Um evento pode surgir quando sua causa ocorrer.

Exemplos:

- votação em data própria;
- publicação econômica em calendário próprio;
- obra avançando continuamente;
- notícia surgindo durante a semana;
- negociação alterando intenção antes do próximo avanço.

## 4.3. Semana tranquila

**[DECISÃO]**

Deve existir `ADVANCE_WEEK` sem punição arbitrária quando nenhuma intervenção presidencial for necessária.

Uma semana pode conter:

- crise;
- negociação;
- decisão;
- acompanhamento;
- nenhuma demanda presidencial relevante.

## 4.4. Compressão futura

**[ABERTO]**

Um modo rápido/mensal pode existir futuramente como compressão do mesmo motor.

Não deve criar:

- segunda simulação;
- regras paralelas;
- arquitetura específica agora.

**[DESCARTADO]**

- “4 semanas = 1 mês”;
- 48 turnos mensais como experiência principal;
- pontos fixos de ação presidenciais.

## 4.5. Calendário civil e efeitos mensais

**[ABERTO]**

Os motores mensais existentes foram calibrados em passos de mês inteiro; o mandato real começa em 05/01 e termina em 05/01. A implementação deve decidir, de forma explícita e não silenciosa:

- o primeiro mês parcial (05/01 a 31/01);
- os últimos dias do mandato (01/01 a 05/01 do quinto ano);
- o ano bissexto de 2028;
- o momento do fechamento mensal;
- o que as séries registram;
- onde um efeito proporcional à fração do período faz sentido e onde não faz.

---

# 5. EXPERIÊNCIA PRESIDENCIAL

## 5.1. Momento Presidencial

**[DECISÃO]**

A principal unidade de gameplay é o **Momento Presidencial**.

Um momento sobe à superfície quando:

- só o Presidente pode decidir;
- sua presença altera materialmente o resultado;
- existe arbitragem entre objetivos;
- há custo político ou institucional relevante;
- uma oportunidade pode desaparecer;
- um conflito escalou;
- uma decisão anterior retornou.

Rotina sem valor decisório permanece no motor.

## 5.2. Estrutura de um momento

Um Momento Presidencial pode conter:

1. **Gancho** — telefonema, reunião, manchete, documento, derrota, oportunidade ou alerta.
2. **Conflito** — ao menos duas posições plausíveis.
3. **Estado informacional** — conhecido, estimado, contestado ou desconhecido.
4. **Alavancas** — decidir, negociar, condicionar, delegar, adiar, vetar, propor, priorizar, recuar, comunicar ou exigir alternativa.
5. **Reação imediata** — atores e instituições respondem.
6. **Execução** — o mundo continua sem exigir supervisão constante.
7. **Retorno posterior** — o assunto reaparece quando houver causa.

## 5.3. Níveis de atenção

- **PULSO** — importante conhecer; ação presidencial não necessária.
- **PRESSÃO** — pode exigir atenção; delegar ou não intervir é válido.
- **DECISÃO** — existe uma escolha presidencial capaz de alterar materialmente a trajetória; não agir também pode produzir um resultado.

## 5.4. Consequência em três horizontes

- **imediato:** reação humana, política ou comunicacional;
- **intermediário:** execução e efeitos materiais;
- **longo prazo:** dependências, segunda ordem e legado.

## 5.5. Atenção presidencial

**[DECISÃO]**

Não utilizar “mana” ou pontos abstratos de ação.

Limites emergem de:

- agenda;
- prazos;
- viagens;
- compromissos;
- crises;
- simultaneidade;
- necessidade de acompanhamento;
- capacidade de delegação;
- qualidade da equipe.

Assumir pessoalmente uma pauta pode elevar prioridade, mas também criar expectativa, compromisso público, cobrança e custo de recuo.

---

# 6. INTERFACE E NAVEGAÇÃO

## 6.1. Princípio

**[DECISÃO]**

> **As telas representam formas de exercer a Presidência, não a taxonomia completa do Estado.**

Requisitos:

- alta responsividade;
- Liquid Glass refinado;
- hierarquia visual forte;
- profundidade sob demanda;
- baixa poluição;
- transições coerentes;
- informação resumida antes do detalhe.

**[DECISÃO]** A interface do jogador consulta a visão presidencial do mundo, não o estado oculto, salvo quando aquele fato for efetivamente conhecido pela Presidência. Vale para Congresso, economia, pesquisas, execução, empresas, inteligência e crises. A regra é epistemológica, não uma obrigação de classe: não exige um objeto único de “visão presidencial”; exige que cada consulta mostrada ao jogador leia só o que a Presidência sabe, pela mesma função que os atores do governo usam para estimar.

## 6.2. Gabinete

**[HIPÓTESE]**

O Gabinete é o melhor candidato a tela inicial.

Pode concentrar:

- decisões;
- pressões;
- retornos;
- compromissos;
- objetos contextuais.

Possíveis objetos:

- telefone → pessoas/chamadas;
- pasta → decisões/documentos;
- envelope → correspondência;
- jornal/tablet → esfera pública;
- agenda → compromissos.

Não deve virar feed de notificações.

## 6.3. Barra superior

Mostrar apenas sinais realmente globais:

- data;
- avanço do tempo;
- poucos alertas críticos.

Evitar painel permanente de dezenas de indicadores.

## 6.4. Navegação principal

**[ABERTO]**

Candidatos:

- Gabinete;
- Email;
- Congresso;
- Governo;
- Finanças;
- Estado/Regras.

Nomes e quantidade não estão congelados.

## 6.5. Governo

**[HIPÓTESE]**

Áreas como Saúde, Energia e Educação continuam profundas no motor, mas não precisam ocupar a navegação principal individualmente.

Um agregador `Governo` pode concentrar:

- ministérios;
- responsáveis;
- programas;
- execução;
- problemas;
- histórico;
- assuntos ativos.

## 6.6. Email

Canal para:

- mensagens;
- pedidos;
- convites;
- relatórios;
- anexos;
- acompanhamentos;
- informação restrita.

Não tratar Email como “lista de quests”.

---

# 7. MODELO DE DOMÍNIO CANÔNICO

## 7.1. Regra de propriedade do estado

**[DECISÃO]**

Cada fato persistente deve possuir uma fonte de verdade.

Uma representação secundária pode existir como:

- índice;
- cache;
- projeção de UI;
- relatório;
- visão derivada.

Ela não pode se tornar uma segunda autoridade de estado.

## 7.2. Ontologia mínima

Objetos fundamentais:

| Grupo      | Objeto         | Função                                                                                          |
| ---------- | -------------- | ----------------------------------------------------------------------------------------------- |
| Mundo      | `EVENT`        | ocorrência registrada que pode alterar estado                                                   |
| Mundo      | `ASSET`        | ativo material/financeiro relevante                                                             |
| Mundo      | `PROJECT`      | empreendimento com execução temporal                                                            |
| Informação | `OBSERVATION`  | evidência obtida sobre o mundo                                                                  |
| Informação | `INFORMATION`  | proposição transmitida por uma fonte/canal                                                      |
| Agência    | `ACTOR`        | entidade capaz de decidir/agir                                                                  |
| Agência    | `BELIEF`       | estado epistemológico interno de um ator                                                        |
| Agência    | `GOAL`         | resultado buscado                                                                               |
| Agência    | `INTENTION`    | plano atualmente adotado                                                                        |
| Agência    | `ACTION`       | ato executável no mundo                                                                         |
| Agência    | `RELATION`     | vínculo direcional persistente entre atores                                                     |
| Agência    | `MEMORY`       | referência semântica a evento passado relevante                                                 |
| Social     | `COMMITMENT`   | obrigação assumida por um ator                                                                  |
| Política   | `CLAUSE`       | unidade semântica de mudança pública                                                            |
| Política   | `INITIATIVE`   | tentativa estruturada de alterar o mundo                                                        |
| Jurídico   | `LEGAL_SOURCE` | instrumento/fonte jurídica versionada, baseline ou in-game                                      |
| Jurídico   | `GAME_RULE`    | regra consolidada usada pela simulação — projeção calculada das fontes, nunca fonte persistente |

`FACT` não é um segundo objeto: o fato verdadeiro reside no estado do mundo.

## 7.3. Valores derivados

**[DECISÃO]**

Não armazenar como barras independentes quando puderem ser derivados:

- **reputação** → crenças e memórias distribuídas nos outros atores;
- **alinhamento** → posições, objetivos e contexto;
- **obrigação social/política** → compromissos e memórias;
- **credibilidade** → confiança + expertise + histórico de afirmações;
- **poder de barganha** → dependência, alternativas, pivotalidade, urgência e substituibilidade;
- **conhecimento público** → distribuição de informação;
- **conhecimento presidencial** → informação/beliefs acessíveis ao Presidente.

Caches são permitidos para performance desde que invalidados por fonte de estado.

## 7.4. Especialização por subtipo

Um objeto pode ter subtipos sem criar novo motor.

Exemplos:

- `ACTION.social`;
- `ACTOR.person`;
- `ACTOR.organization`;
- `ACTOR.institution`;
- `ASSET.company_equity`;
- `PROJECT.infrastructure`.

Subtipo muda dados válidos e repertório, não a lógica fundamental.

## 7.5. Evento mínimo

**[DECISÃO]**

Um fato vira `EVENT` quando passa em pelo menos um teste:

1. algo vai citá-lo depois pela identidade — memória, compromisso, causa, fonte de crença, origem de norma;
2. é uma mudança discreta e datada que um ator pode perceber e à qual pode reagir.

Não são eventos: a evolução contínua (estado e séries), leituras derivadas (previsões, regras consolidadas) e planos (estado do ator).

**[DECISÃO]** `ACTION` e `EVENT` são conceitos diferentes:

- `ACTION` — o que um ator escolheu, tentou ou executou;
- `EVENT` — o que ocorreu no mundo e pode ser percebido, causar efeitos ou entrar no histórico.

Uma ação executada normalmente gera ou referencia eventos (`veto da cláusula X` → `o veto de X ocorreu em T`). A distinção fica porque há casos em que ela importa: a ação tentada que falha, a execução parcial, a ação que produz vários eventos, o evento que nenhuma ação causou. Os dois se ligam por referência (a ação aponta os eventos que gerou; o evento aponta a ação ou a causa), e o conteúdo não é copiado inteiro nos dois. A distinção vale até o laboratório provar que ela não produz valor.

Forma mínima conceitual:

```yaml
event:
  id: ...
  type: ...
  occurred_at: ...
  actors: [...]
  subjects: [...]
  cause_refs: [...]
  tags: [...]
  payload: ...
```

**[ABERTO]**

- a forma do identificador: determinística e estável — inserir um evento não relacionado não deve renumerar os outros;
- retenção e compactação: entram só quando a medição mostrar necessidade. Até lá, eventos citados por memória, compromisso ou outra referência precisam continuar resolvíveis.

---

# 8. MODELO DE INFORMAÇÃO

## 8.1. Cadeia epistemológica

**[DECISÃO]**

`WORLD_STATE → OBSERVATION → INFORMATION → BELIEF`

### `OBSERVATION`

Evidência obtida diretamente ou por instrumento.

```yaml
observation:
  subject: ...
  value: ...
  observer: ...
  observed_at: ...
  quality: ...
```

### `INFORMATION`

Proposição transmitida.

```yaml
information:
  proposition: ...
  source: ...
  channel: ...
  audience: [...]
  created_at: ...
```

### `BELIEF`

Interpretação interna.

```yaml
belief:
  subject: ...
  estimate: ...
  confidence: ...
  source_refs: [...]
  updated_at: ...
```

### Conteúdo compartilhado sem apagar a causalidade

**[DECISÃO]** O conteúdo comunicado não é copiado a cada passo. Mas a intenção de comunicar, a ação executada, o fato de ela ter ocorrido, a informação recebida e a crença formada continuam distinguíveis causalmente. Um mesmo conteúdo pode ser referenciado por vários desses passos.

**[DECISÃO]** `PROPOSITION` não é objeto canônico agora. O conteúdo de uma afirmação, de uma informação recebida e o sujeito e a estimativa de uma crença usam uma representação estruturada compartilhável, sem entidade persistente própria. Ela vira objeto só diante de necessidade concreta: várias ações referenciando exatamente a mesma proposição, proveniência, contradição formal, deduplicação, investigação, cadeia longa de transmissão ou identidade estável.

**[ABERTO]** O modelo concreto de normalização do conteúdo.

**[ABERTO]** A persistência de `OBSERVATION`. Uma observação pode ser efêmera, virar evento, ser mantida como evidência ou virar fonte de crença na hora; a escolha depende de proveniência, memória, investigação e depuração. Não persistir por padrão só porque o conceito existe na ontologia.

## 8.2. Consequências

O modelo permite:

- erro honesto;
- mentira;
- informação incompleta;
- informação desatualizada;
- versões concorrentes;
- imprensa descobrindo antes do governo;
- atores diferentes formando crenças diferentes.

Informação nunca teleporta.

## 8.3. Justiça para o jogador

Evitar:

- consequência exata demais antes de existir base;
- surpresa arbitrária;
- ocultar risco que o Presidente teria meios razoáveis de conhecer.

Preferir:

- fato conhecido;
- estimativa;
- risco identificado;
- incerteza explícita;
- informação indisponível.

Surpresa relevante deve ser explicável retrospectivamente.

---

# 9. MODELO DE ATORES

## 9.1. Um único motor

**[DECISÃO]**

`ActorEngine` governa a decisão de todos os atores simulados.

Pipeline:

`EVENT → PERCEPTION → BELIEF → GOAL → INTENTION → ACTION → EVENT`

Tipos:

- `PERSON`;
- `ORGANIZATION`;
- `INSTITUTION`.

Partidos, empresas, sindicatos, associações e outros coletivos podem usar o mesmo motor quando possuírem agência relevante.

Uma instituição só deve ser `ACTOR` quando houver decisão coletiva própria a modelar. Regras institucionais não precisam virar “personagem”.

**[DECISÃO]** O mesmo vale para grupos e agregados. Um conceito coletivo pode ser indicador agregado, rede de atores, organização concreta, coalizão temporária ou percepção construída por atores. Só vira `ACTOR` o que tiver decisão própria. Um agregado não é antropomorfizado para caber no `ActorEngine`.

**[DECISÃO]** O `ActorEngine` é genérico: percepção, crença, intenção, escolha de ação e trace. O repertório válido e os termos de avaliação de cada domínio chegam de fora, pela camada que compõe os motores. Ele não absorve a economia, o fisco, a capacidade nem a opinião agregada.

## 9.2. Estado do ator

### Núcleo

Muda raramente:

- valores;
- tolerância a risco;
- horizonte temporal;
- persistência;
- reciprocidade;
- respeito a normas;
- tolerância a ambiguidade.

### Trajetória

Muda lentamente:

- carreira;
- cargos;
- expertise;
- vínculos territoriais/socialmente relevantes;
- afiliações;
- histórico de atuação.

### Estado ativo

- crenças;
- objetivos;
- intenções;
- conjunto/fila de assuntos sob atenção.

Atenção do ator representa **seleção de assuntos relevantes**, não uma barra de energia.

Compromissos, relações e memórias permanecem em seus objetos canônicos e são apenas referenciados pelo ator.

## 9.3. Motivações e objetivos

**[HIPÓTESE]**

Motivações persistentes candidatas:

- `REELECTION`;
- `POLICY_LEGACY`;
- `CAREER_ASCENT`;
- `PARTY_POWER`;
- `REGIONAL_DELIVERY`;
- `IDEOLOGICAL_PROJECT`;
- `INSTITUTIONAL_DEFENSE`;
- `PUBLIC_REPUTATION`;
- `NETWORK_POWER`;
- `SELF_PRESERVATION`.

Objetivos são contextuais.

Conceitualmente:

`priority = motivation × relevance × opportunity × urgency × perceived_viability`

Manter poucos objetivos ativos.

## 9.4. Identidade

**[HIPÓTESE]**

Fontes de identidade podem ter pesos diferentes:

```yaml
identity_weights:
  party: ...
  constituency: ...
  personal_values: ...
  institution: ...
  career: ...
  relationships: ...
```

Esses pesos não são “lealdade”.

## 9.5. Quatro leituras políticas

**[DECISÃO]**

O jogo deve distinguir:

1. **preferência privada** — derivada de valores, objetivos e crenças;
2. **posição pública** — derivada de ações públicas válidas;
3. **compromissos** — consultados no `COMMITMENT` ledger;
4. **intenção atual** — registrada em `INTENTION`.

Elas podem divergir sem duplicar a mesma informação.

## 9.6. Intenção e persistência

```yaml
intention:
  goal_id: ...
  plan: [...]
  reconsider_if: [...]
  abandon_if: [...]
```

O ator não reotimiza tudo a cada tick.

Reconsideração ocorre diante de mudança material:

- informação relevante;
- falha do plano;
- custo/risco substancial;
- prazo;
- compromisso conflitante;
- mudança de autoridade ou opções.

## 9.7. Dois modos de decisão

**[DECISÃO]** O modo cognitivo é regra do comportamento modelado e pode mudar o resultado. Ele é escolhido pelo estado do próprio ator e da situação — saliência, conflito entre objetivos, risco, compromisso, informação nova, prazo —, nunca por desempenho ou pela interface.

### Heurístico

Para baixa saliência e situações rotineiras.

### Deliberativo

Para conflito, risco, compromisso, informação nova, prazo ou oportunidade relevante.

Avaliação conceitual:

```text
utility(action) =
expected_goal_effect
+ commitment_effect
+ relation_effect
+ plan_coherence
- perceived_risk
- action_cost
- breach_cost
- uncertainty
```

Não congelar coeficientes antes de prototipagem/calibração.

Racionalidade é limitada:

- conjunto percebido de ações é finito;
- crenças são imperfeitas;
- horizonte é limitado;
- solução suficiente pode vencer o ótimo teórico.

Empates devem ser determinísticos.

## 9.8. Relações

`RELATION` é direcional:

```yaml
relation:
  from: ...
  to: ...
  trust: ...
  access: ...
  rivalry: ...
```

- `trust` — confiança na palavra/conduta;
- `access` — facilidade efetiva de contato;
- `rivalry` — competição persistente relevante.

Não armazenar `alignment`, `obligation` ou `credibility` se puderem ser derivados conforme a seção 7.

## 9.9. Memória

```yaml
memory:
  actor: ...
  event_id: ...
  target: ...
  salience: ...
  relevance_tags: [...]
  occurred_at: ...
```

Memória referencia eventos; não copia o mundo inteiro.

Pode preservar:

- compromisso cumprido/quebrado;
- ajuda;
- humilhação;
- concessão;
- vitória conjunta;
- derrota atribuída;
- falsidade descoberta.

Saliência pode diminuir. Eventos críticos podem permanecer durante todo o mandato.

## 9.10. Competência e repertório

Competência/expertise altera:

- qualidade de estimativa;
- detecção de risco;
- planejamento;
- negociação;
- execução;
- atualização de crença.

Ações possíveis derivam de:

`actor_type + role + institution + context + rules`

Nunca permitir ação fora da competência apenas para facilitar a IA.

## 9.11. Iniciativa autônoma

Um ator pode agir sem provocação presidencial quando:

`trigger + active_goal + valid_action + sufficient_expected_value`

O mundo não espera o Presidente.

## 9.12. Organizações e facções

Organizações usam o mesmo `ActorEngine`.

Partido pode possuir:

- objetivos;
- estratégia;
- liderança;
- recursos;
- posição pública;
- conflitos internos.

**[HIPÓTESE]**
Uma facção começa como coordenação entre atores. Só vira `ACTOR.organization` persistente quando passa a manter objetivos, coordenação e liderança próprias.

## 9.13. Fábrica de atores

**[DECISÃO]**

Não sortear atributos de forma independente.

Pipeline:

`ROLE → CAREER → POLITICAL_ANCHORS → MOTIVATIONS → DECISION_STYLE → RELATIONS → INITIAL_GOALS → INITIAL_BELIEFS`

Biografia só existe quando altera gameplay.

Ator focal deve ser resumível por:

```text
QUER
TEME
CONFIA EM
PRECISA DE
NÃO ACEITA
PLANO ATUAL
```

## 9.14. Níveis de processamento

**[DECISÃO]** Dois conceitos separados:

- **cognição** — heurístico ↔ deliberativo (§9.7): regra do comportamento, parte do `ActorEngine`;
- **processamento e superfície** — dormente ↔ ativo ↔ focal: classificação do agendador e da interface.

A classificação de processamento não é estado canônico do ator. É derivada do que há para processar:

- `DORMANT` — nenhum assunto relevante processável chegou ao ator;
- `ACTIVE` — há assunto relevante;
- `FOCAL` — envolvimento direto em assunto presidencial ou situação de superfície.

Um ator dormente nunca consulta o estado verdadeiro do mundo. Ele mantém identidade, estado estrutural, relações, memórias e as últimas crenças; acorda só por causa válida que lhe chegue.

**[HIPÓTESE]** Causas de despertar, a confirmar no laboratório:

- nova informação relevante;
- prazo;
- acompanhamento agendado;
- mudança de regra;
- mudança material em objetivo acompanhado;
- pedido ou ação recebida;
- evento relacionado;
- falha ou conclusão do plano;
- oportunidade detectável.

**[DECISÃO]** Toda condição temporal necessária a uma decisão está agendada ou é derivável. O agendador não deixa de acordar um ator porque ninguém interagiu com ele.

A classificação não muda a decisão: dois atores com o mesmo estado cognitivo e a mesma informação decidem igual, esteja um deles focal na interface ou não.

**[DECISÃO]** Equivalência semântica do agendador: a avaliação completa (todos os atores elegíveis examinados) e a avaliação agendada (só os atores com causa válida para despertar) produzem as mesmas ações, as mesmas mudanças persistentes de estado, os mesmos compromissos e os mesmos eventos materialmente relevantes. Logs internos, traces de otimização e custo computacional podem diferir.

Performance:

- ativação por tags;
- índices;
- cache invalidável;
- processamento em lote quando logicamente equivalente.

## 9.15. Explicabilidade

Toda decisão relevante produz `decision_trace`:

```yaml
decision_trace:
  actor: ...
  action: ...
  active_goals: [...]
  decisive_beliefs: [...]
  decisive_commitments: [...]
  rejected_actions: [...]
  top_reasons: [...]
```

O trace serve para:

- testes;
- debug;
- balanceamento;
- explicação;
- geração textual.

Não é UI de jogador.

---

# 10. PROTOCOLO SOCIAL E COMPROMISSOS

## 10.1. Regra

**[DECISÃO]**

Não existem motores paralelos para:

- conversa;
- negociação;
- promessa;
- ameaça;
- blefe;
- disciplina;
- vazamento.

Interação social é um subtipo de `ACTION` processado pelo `ActorEngine`.

## 10.2. Primitivas

```text
ASSERT
REQUEST
COMMIT
RESPOND
```

### `ASSERT`

Comunica uma proposição.

### `REQUEST`

Solicita ação de outro ator.

### `COMMIT`

Vincula o próprio ator a uma ação futura ou condicional.

### `RESPOND`

Responde a ação anterior:

```text
ACCEPT
REJECT
DEFER
```

**[DECISÃO]** Silêncio não é `RESPOND`. Nenhuma resposta é nenhuma ação social. O efeito do silêncio vem do contexto, nunca de uma regra universal `SILÊNCIO = REJEITAR`:

- pedido com prazo → expira;
- ato que vale salvo objeção → a ausência de ação deixa o padrão ocorrer;
- negociação informal → a contraparte interpreta o silêncio;
- pedido político → pode ficar pendente ou ser tratado como recusa pelo outro ator.

A interpretação pertence ao ator ou à regra do contexto.

## 10.3. Ação social

```yaml
action:
  type: SOCIAL
  kind: ASSERT | REQUEST | COMMIT | RESPOND
  actor: ...
  target: ...
  content: ...
  condition: ...
  channel: ...
  audience: [...]
  thread_id: ...
  timestamp: ...
```

`thread_id` organiza histórico; não cria fonte de estado adicional.

## 10.4. Compromisso

`COMMIT` cria um único objeto persistente:

```yaml
commitment:
  id: ...
  promisor: ...
  beneficiary: ...
  action: ...
  activation_condition: ...
  deadline: ...
  visibility: ...
  witnesses: [...]
  source_action_id: ...
  status: ACTIVE
```

Estados finais:

- `FULFILLED`;
- `BREACHED`;
- `EXPIRED`;
- `WITHDRAWN`;
- `SUPERSEDED`.

Renegociação cria novo compromisso e marca o anterior como `SUPERSEDED`.

Não duplicar a promessa dentro do ator, da negociação ou do Congresso.

## 10.5. Acordo e contraproposta

Não existe objeto obrigatório `PROPOSAL`.

Um acordo é composição de:

- `REQUEST`s;
- `COMMITMENT`s;
- `RESPOND`s;
- mesmo `thread_id`.

Contraproposta = novos movimentos sociais no mesmo thread.

## 10.6. Fenômenos derivados

- **ameaça** = `COMMIT` condicional cuja consequência é percebida como negativa;
- **aviso** = `ASSERT` sobre consequência fora do controle do emissor;
- **pressão** = `REQUEST` em contexto de dependência, urgência ou custo;
- **mentira factual** = `ASSERT` incompatível com a crença privada do emissor;
- **blefe** = distância entre sinal/compromisso e intenção ou capacidade percebida;
- **omissão** = informação conhecida não transmitida;
- **vazamento** = transmissão de informação restrita para audiência não autorizada;
- **quebra de promessa** = ação observada incompatível com `COMMITMENT`;
- **traição** = interpretação/memória resultante de expectativa, ação e relação.

Nenhum desses conceitos recebe motor próprio.

## 10.7. Descoberta de engano

**[DECISÃO]**

Mentira ou blefe não são “descobertos” por porcentagem abstrata.

Descoberta exige evidência incompatível chegar ao ator relevante.

## 10.8. Canal e audiência

Canal e audiência pertencem à própria ação social.

Canais candidatos:

- reservado;
- reunião;
- telefone/mensagem;
- documento;
- bancada/partido;
- imprensa;
- pronunciamento público.

Eles alteram:

- observadores;
- persistência;
- risco de disseminação;
- custo de recuo;
- força do sinal.

## 10.9. Negociação

**[HIPÓTESE]**

O mesmo `ActorEngine` deve avaliar:

- acordo proposto;
- alternativa sem acordo;
- compromissos existentes;
- crenças sobre a contraparte;
- prazo;
- riscos.

Poder de barganha não é barra persistente.

É derivado, entre outros fatores, de:

- pivotalidade;
- alternativas;
- dependência;
- urgência;
- substituibilidade;
- capacidade percebida de impor custo;
- informação assimétrica.

## 10.10. Contato espontâneo e controle de spam

**[HIPÓTESE]**

Contato ocorre quando o valor esperado de interagir supera:

- custo de atenção;
- custo político;
- alternativas melhores;
- custo do canal.

Regras adicionais:

- não regenerar contato semanticamente idêntico sem nova informação, prazo, audiência ou mudança material;
- evitar reabrir thread sem nova informação, prazo ou oportunidade;
- atores de baixa relevância preferem canais/representantes apropriados;
- liderança pode agregar demandas de grupos.

Isso evita “WhatsApp Simulator” sem usar limite arbitrário de mensagens.

## 10.11. Texto

A fala é apresentação.

Ela pode variar por:

- papel;
- relação;
- canal;
- formalidade;
- contexto.

Nunca pode inventar:

- motivo;
- compromisso;
- informação;
- ameaça;
- certeza

que não existam no estado da simulação.

---

# 11. MÍDIA E ESFERA PÚBLICA

## 11.1. Reutilização do núcleo

**[DECISÃO]**

Não existe `MediaAI`.

- jornalista/veículo → `ACTOR`;
- notícia/declaração → `INFORMATION`;
- entrevista → ações sociais;
- vazamento → fenômeno derivado do protocolo social.

## 11.2. Funções

Mídia atua como:

- **sensor** — descobre/recebe informação;
- **amplificador** — altera alcance e saliência;
- **arena** — aumenta custo público de posições e compromissos.

Comunicação não altera diretamente estado material sem um mecanismo causal modelado (princípio 9).

## 11.3. Veículos

**[HIPÓTESE]**

Dimensões úteis:

- alcance;
- confiança percebida por públicos/atores (distribuída, não um escalar universal);
- especialização;
- prioridades editoriais;
- rede de fontes;
- velocidade;
- rigor;
- interesses;
- histórico com atores.

Evitar um único eixo `bias = esquerda/direita`.

## 11.4. Plataformas digitais

Modelar de forma agregada:

- nichos;
- viralização;
- militância;
- boatos;
- desmentidos;
- atores influentes;
- ciclos de atenção.

Não simular milhões de usuários.

## 11.5. Superfície

Mídia aparece onde cria decisão:

- Gabinete;
- Email;
- Momento Presidencial;
- acompanhamento de pauta.

Aba própria somente se provar valor de gameplay.

---

# 12. MOTOR DE INTENÇÃO E POLÍTICA PÚBLICA

## 12.1. Objetivo

**[DECISÃO]**

O jogador deve poder tentar projetos políticos variados sem:

- preset ideológico;
- árvore específica por doutrina;
- IA generativa;
- domínio prévio de Direito;
- catálogo pequeno de políticas fechadas.

## 12.2. Pipeline

`INTENÇÃO HUMANA`
→ `REPRESENTAÇÃO CANÔNICA`
→ `CLAUSES`
→ `VALIDAÇÃO SEMÂNTICA`
→ `LEGAL_RESOLUTION`
→ `ROTA INSTITUCIONAL`
→ `NEGOCIAÇÃO`
→ `ATO/NORMA`
→ `EXECUÇÃO`
→ `CONSEQUÊNCIAS`.

## 12.3. Compositor

Formato geral:

`AÇÃO + OBJETO + ALVO + MECANISMO + INTENSIDADE + CONDIÇÕES`

A UI mostra somente parâmetros compatíveis.

## 12.4. Campo textual opcional

**[HIPÓTESE]**

Campo local pode servir como atalho, não chatbot.

Pipeline:

1. normalizar;
2. tokenizar;
3. resolver aliases;
4. localizar entidades;
5. extrair números/datas/percentuais;
6. gerar interpretações válidas;
7. pedir confirmação quando ambíguo;
8. nunca inventar entidade ou intenção.

Exemplo:

`"acabar com o fundão"`
→ sugestão canônica correspondente ao objeto reconhecido e à ação `ABOLISH`.

## 12.5. Vocabulário canônico

**[HIPÓTESE — v0.2]**

Regra:

> preferir **verbo genérico + objeto**; criar verbo específico apenas quando o efeito/procedimento for realmente distinto.

### Existência, escala e ativos

`CREATE`, `ABOLISH`, `EXPAND`, `REDUCE`, `REPLACE`, `MERGE`, `SPLIT`, `BUILD`, `MODERNIZE`, `LIQUIDATE`.

### Direitos, permissões e regulação

`PROHIBIT`, `PERMIT`, `REQUIRE`, `EXEMPT`, `RESTRICT`, `GUARANTEE`, `REMOVE_GUARANTEE`, `REGULATE`, `DEREGULATE`, `SET_STANDARD`, `LICENSE`, `DELICENSE`, `SET_LIMIT`, `REQUIRE_DISCLOSURE`.

### Fiscal, orçamento e financiamento

`TAX`, `SET_TAX_RATE`, `SUBSIDIZE`, `TRANSFER`, `ALLOCATE`, `CUT_ALLOCATION`, `IMPOSE_CONTINGENCY`, `CAPITALIZE`, `FINANCE`.

### Propriedade, controle e mercado

`ACQUIRE_STAKE`, `SELL_STAKE`, `ASSUME_CONTROL`, `RELINQUISH_CONTROL`, `NATIONALIZE`, `PRIVATIZE`, `CONCESS`, `PUBLIC_PROVIDE`, `OPEN_MARKET`, `RESERVE_MARKET`, `CAP_PRICE`, `SET_MINIMUM_PRICE`.

### Penal e responsabilização

`CRIMINALIZE`, `DECRIMINALIZE`, `SET_PENALTY`, `AMNESTY`, `PARDON`, `COMMUTE_SENTENCE`.

### Organização do Estado

`TRANSFER_POWER`, `CENTRALIZE`, `DECENTRALIZE`, `SET_APPOINTMENT_RULE`, `SET_TERM_RULE`, `SET_ELECTION_RULE`, `SET_SUCCESSION_RULE`.

Criação/extinção de órgão usa `CREATE/ABOLISH`.

### Pessoas e cargos

`APPOINT`, `DISMISS`, `NOMINATE`, `INITIATE_REMOVAL_PROCESS`.

### Processo legislativo

`INTRODUCE`, `ISSUE_PROVISIONAL_MEASURE`, `REQUEST_URGENCY`, `WITHDRAW_PROPOSAL`, `NEGOTIATE_TEXT`, `SANCTION_LAW`, `VETO`, `REGULATE_LAW`.

### Política externa

`RECOGNIZE`, `OPEN_RELATIONS`, `BREAK_RELATIONS`, `NEGOTIATE_TREATY`, `SIGN_TREATY`, `DENOUNCE_TREATY`, `IMPOSE_TRADE_MEASURE`, `REMOVE_TRADE_MEASURE`.

### Exceção e ruptura

`DECLARE_FEDERAL_INTERVENTION`, `DECLARE_STATE_OF_DEFENSE`, `REQUEST_STATE_OF_SIEGE`, `DEFY_INSTITUTION`, `IGNORE_JUDICIAL_ORDER`, `ATTEMPT_EXTRALEGAL_REMOVAL`, `ATTEMPT_EXTRALEGAL_SUSPENSION`, `INITIATE_CONSTITUENT_CHANGE`.

**[ABERTO]**
Congelar o vocabulário somente depois do primeiro protótipo.

## 12.6. Objetos

Catálogo inicial inclui:

- imposto;
- fundo;
- benefício;
- serviço público;
- empresa/estatal;
- participação e controle societário;
- ativo público;
- infraestrutura;
- concessão/PPP;
- setor/mercado;
- direito;
- conduta;
- regra penal;
- regra eleitoral/partidária;
- status religioso;
- órgão/cargo;
- competência federativa;
- atividade regulada;
- programa/política pública;
- relação externa/tratado;
- regra constitucional/judicial;
- item orçamentário;
- proposição legislativa.

## 12.7. Cláusula

```yaml
clause:
  action: TAX
  object: NET_WEALTH
  target: NATURAL_PERSON
  parameters:
    threshold: X
    rate: Y
  geography: FEDERAL
  start_rule: NEXT_VALID_DATE
  exceptions: []
  executor: TAX_ADMINISTRATION
```

Matriz `ação × objeto` valida combinações.

Combinação inválida nunca recebe significado inventado.

## 12.8. Iniciativa

**[DECISÃO]**

`INITIATIVE` é o único objeto para tentativa estruturada de mudança pública.

```yaml
initiative:
  id: ...
  goal: ...
  clauses: [...]
  priority: ...
  sponsors: [...]
  status: DRAFT
  revision: ...
```

Derivados da versão atual da iniciativa:

- `legal_resolution`;
- `rule_diffs`;
- atores/áreas afetados;
- estimativas políticas.

Esses derivados podem ser cacheados com `initiative.revision`, mas são invalidados quando cláusulas ou regras-base mudam.

“Reforma”, “pacote”, “projeto” e nomes políticos são apresentações/contextos, não modelos paralelos.

---

# 13. MODELO JURÍDICO-INSTITUCIONAL

## 13.1. Camadas

**[DECISÃO]**

1. `LEGAL_SOURCE` — instrumento/fonte jurídica versionada.
2. `GAME_RULE` — regra consolidada utilizada pela simulação e interface.
3. `INITIATIVE` — tentativa de alterar regras/estado.

No início da partida, `LEGAL_SOURCE` referencia o Direito brasileiro usado como baseline. Durante a partida, normas e atos produzidos pelo próprio jogo também entram como novas `LEGAL_SOURCE`s.

A simplificação está em `GAME_RULE`.
A rastreabilidade jurídica permanece em `LEGAL_SOURCE`.

**[DECISÃO]** A única fonte persistente é `LEGAL_SOURCE` (e os eventos jurídicos). `GAME_RULE` é projeção calculada:

```text
LEGAL_SOURCE(S) → resolvedor (ESTRATO generalizada) → projeção GAME_RULE
```

A projeção pode ser cacheada, invalidada quando as fontes mudam; nunca vira segunda autoridade. O resolvedor nasce da generalização da ESTRATO existente, e não como um `LegalResolver` novo, a menos que a generalização se mostre inviável.

## 13.2. Fonte jurídica

```yaml
legal_source:
  id: ...
  origin: REAL_BASELINE | IN_GAME
  type: ...
  authority: ...
  effective_from: ...
  effective_to: ...
  official_ref: ...
  originating_initiative: ...
  relevant_extract: ...
```

`official_ref` é obrigatório para baseline real e opcional para instrumentos produzidos na partida.

A versão simplificada nunca sobrescreve a fonte.

## 13.3. Regra jogável

```yaml
game_rule:
  id: PRESIDENTIAL_REELECTION
  domain: ELECTIONS
  current_value: ...
  legal_level: ...
  source_refs: [...]
  constraints: [...]
  dependencies: [...]
  effects: [...]
```

Uma `GAME_RULE` pode consolidar múltiplas fontes. Os campos acima (`current_value`, `constraints`, `dependencies`, `effects`) são da projeção calculada, não de um registro gravado (§13.1).

## 13.4. Catálogo seletivo

Somente modelar norma que altere algo simulável:

- poder;
- competência;
- direito;
- obrigação;
- processo;
- fluxo fiscal;
- capacidade;
- mercado;
- comportamento;
- execução;
- trajetória política.

Não importar “todas as leis do Brasil”.

## 13.5. Resolvedor jurídico

Entrada:

- versão atual das cláusulas;
- `GAME_RULE`s relevantes;
- `LEGAL_SOURCE`s aplicáveis;
- estado jurídico vigente.

A resolução é derivada desses inputs e deve ser recalculada/inutilizada quando eles mudarem.

Saída:

```yaml
legal_resolution:
  assessment: ROUTE_AVAILABLE
  routes:
    - kind: CONSTITUTIONAL_AMENDMENT
      initiator: PRESIDENT_ALLOWED
      institutions: [CHAMBER, SENATE]
      stages: [...]
      constraints: [...]
  reasons: [...]
```

### `assessment`

- `CLEAR_POWER`
- `ROUTE_AVAILABLE`
- `MULTIPLE_ROUTES`
- `CONTESTED`
- `BLOCKED`
- `EXTRALEGAL_ATTEMPT`

### `route.kind`

- `DIRECT_ACT`
- `REGULATION`
- `ORDINARY_LAW`
- `COMPLEMENTARY_LAW`
- `CONSTITUTIONAL_AMENDMENT`
- `BUDGETARY_ROUTE`
- `OTHER_INSTITUTION`
- `CONSTITUENT_CHANGE`
- `OUTSIDE_CURRENT_ORDER`

Avaliação jurídica e tipo de rota são dimensões diferentes.

Não usar porcentagem abstrata de “legalidade”.

## 13.6. Dependências

`GAME_RULE`s formam grafo.

Uma alteração pode:

- invalidar dependência;
- recalcular efeitos;
- exigir cláusula adicional;
- criar conflito.

## 13.7. Ciclo de vida da iniciativa

**[DECISÃO]**

```text
DRAFT
→ PROPOSED
→ IN_PROCESS
→ APPROVED
→ FORMALIZED
→ IN_FORCE
→ EXECUTING
→ IMPLEMENTED
→ CONSOLIDATED
```

Estados alternativos:

- `WITHDRAWN`
- `REJECTED`
- `SUSPENDED`
- `INVALIDATED`
- `EXPIRED`

Cada rota pula fases inaplicáveis.

Sanção, promulgação, decreto, nomeação e atos equivalentes são eventos da rota; não ciclos paralelos.

## 13.8. Histórico

**[DECISÃO]** O histórico é consulta derivada das fontes e dos eventos jurídicos, podendo ser cacheada; não é registro paralelo. A forma da consulta:

```yaml
rule_history:
  rule_id: ...
  old_value: ...
  new_value: ...
  instrument: ...
  effective_at: ...
  government: ...
```

## 13.9. Constituição como interface

**[HIPÓTESE]**

A Constituição deve aparecer como **estado atual das regras do país**, não como parede de artigos.

Exemplo de superfície:

```text
PRESIDÊNCIA
Sistema de governo
Mandato
Reeleição
Sucessão
Veto
```

Ações:

- propor alteração;
- ver dependências;
- ver fonte.

Uma visão agregada do “DNA do Estado” pode existir se for totalmente derivada das regras.

## 13.10. Tutorial jurídico reativo

Explicar o Direito quando ele vira barreira ou oportunidade.

O jogador escolhe o objetivo.
O sistema informa:

- por que a rota escolhida é ou não válida;
- quais rotas são possíveis;
- quais instituições participam;
- quais limites importam.

## 13.11. Classes de poder presidencial

São **leituras de superfície** da resolução jurídica.

### `CANETA`

Competência direta.

### `PROPOSTA`

O Presidente pode iniciar, mas depende de outra instituição.

### `INFLUENCIA`

O Presidente não decide o resultado; atua pelo Protocolo Social.

### `FORA_DA_COMPETENCIA`

A ordem vigente não reconhece poder presidencial para produzir diretamente o resultado.

Se o jogador insistir em uma ação extralegal, o sistema pode classificar a tentativa como `EXTRALEGAL_ATTEMPT`. Isso não cria `RuptureEngine`: continua sendo `ACTION → destinatários → decisões → eventos`.

## 13.12. Fidelidade

Simplificar:

- linguagem;
- agrupamento;
- navegação;
- visualização.

Não simplificar:

- competência;
- instituição necessária;
- quórum relevante;
- temporalidade;
- limite constitucional;
- consequência jurídica material.

**[VERIFICAR]**
Cada regra executável deve registrar fonte primária atual e versão.

---

# 14. SIMULAÇÃO LEGISLATIVA E CONGRESSO

## 14.1. Estrutura

**[DECISÃO]**

Modelo federal atual:

- Câmara dos Deputados: 513 cadeiras;
- Senado Federal: 81 cadeiras.

Simular:

- parlamentares;
- partidos;
- federações;
- blocos;
- lideranças;
- presidências das Casas;
- comissões relevantes;
- relatores.

Todos os comportamentos usam `ActorEngine`.

**[DECISÃO]** Direção final: 513 deputados e 81 senadores individuais. Facções podem existir como estrutura emergente ou organizacional, não como substituto do parlamentar. A estratégia de processamento se decide pelas medições do laboratório (20 → 100 → 513 → 594 atores).

**[DECISÃO]** O Senado no processo legislativo ordinário e o Senado no rito de responsabilização presidencial são entregas separadas; o segundo não é requisito do primeiro corte vertical.

## 14.2. Entidades distintas

- partido → organização persistente;
- federação → arranjo partidário conforme regime aplicável;
- bloco → aliança parlamentar da Casa;
- parlamentar → pessoa individual.

Nenhum representa perfeitamente o outro.

## 14.3. Processo legislativo como gameplay

Não reproduzir todo despacho.

Superfície abstrata:

`FORMULAÇÃO`
→ `ROTA`
→ `PROTOCOLO`
→ `PAUTA`
→ `COMISSÃO quando relevante`
→ `RELATORIA`
→ `NEGOCIAÇÃO`
→ `PLENÁRIO`
→ `CASA REVISORA`
→ `RETORNO se necessário`
→ `SANÇÃO/VETO quando aplicável`
→ `REGULAMENTAÇÃO`
→ `EXECUÇÃO`
→ `CONTROLE quando provocado`.

**[VERIFICAR]**
Procedimentos específicos devem ser implementados a partir de fontes regimentais/legais atuais.

## 14.4. Texto negociável

Iniciativas possuem cláusulas.

A tramitação pode:

- manter;
- remover;
- substituir;
- adicionar;
- destacar;
- alterar alcance.

O jogador pode vencer a votação e perder parte do conteúdo original.

## 14.5. Posição parlamentar

Parlamentar avalia cláusulas usando:

- crenças;
- objetivos;
- identidade;
- orientação partidária;
- base;
- compromissos;
- relações;
- risco;
- intenção.

Superfície:

- apoio;
- apoio condicionado;
- indecisão;
- rejeição;
- estratégia procedural.

Não exibir pontuação interna.

## 14.6. Partido e disciplina

Partido decide sua orientação com o mesmo motor.

Orientações de superfície:

- SIM;
- NÃO;
- LIBERADO;
- OBSTRUÇÃO;
- NEGOCIAÇÃO ABERTA.

Orientação influencia; não controla.

Coalizão formal não garante voto.

## 14.7. Pauta, relatoria e presença

Ter votos não basta.

Importam:

- pauta;
- timing;
- urgência quando cabível;
- sequência;
- adiamento;
- obstrução;
- destaques;
- presença;
- comissão;
- relatoria.

Presença é decisão independente da preferência.

## 14.8. Câmara e Senado

A Casa revisora reavalia:

- texto;
- atores;
- coalizão;
- interesses;
- relatoria;
- timing.

Não copiar automaticamente a decisão da outra Casa.

## 14.9. Contagem de votos

O jogador recebe estimativa.

Categorias:

- firme SIM;
- provável SIM;
- negociável;
- provável NÃO;
- firme NÃO;
- incerto/sem contato;
- provável ausência.

Exibir:

- intervalo;
- riscos;
- votos-chave;
- fonte;
- idade da estimativa.

O resultado real só existe quando a votação ocorre.

## 14.10. Negociação parlamentar

Usa exatamente o Protocolo Social.

Objetos negociáveis podem incluir:

- cláusula;
- pauta;
- apoio em outra matéria;
- compromisso programático;
- demanda regional;
- calendário;
- posição governamental legítima;
- execução/orçamento dentro das regras.

Não criar uma estrutura parlamentar própria de promessa.

**[DECISÃO]** Esses objetos não se reduzem a um recurso abstrato único. Uma negociação combina objetos diferentes pelo mesmo protocolo social.

**[VERIFICADO]** As emendas individuais somam 2% da receita corrente líquida do exercício anterior e têm execução obrigatória (CF art. 166, §§ 9º e 11, pela EC 126/2022; nota da CMO da Câmara).

**[VERIFICAR]** O que o Executivo de fato negocia em torno delas — cronograma, impedimento técnico, transparência, emendas de bancada e de comissão — exige pesquisa atual antes de virar mecânica.

## 14.11. Agenda autônoma

O Congresso possui agenda independente.

Pode gerar:

- negociação;
- comissão;
- votação;
- adiamento;
- obstrução;
- urgência;
- mudança de relator;
- alteração de texto;
- conflito interno.

Não esperar ação presidencial.

---

# 15. CONTROLE JUDICIAL E CONTESTAÇÃO

## 15.1. Regra

**[DECISÃO]**

Não utilizar barra abstrata de “hostilidade judicial”.

Uma contestação requer:

- ato/norma;
- fundamento;
- ator legitimado;
- incentivo para agir;
- procedimento;
- decisão.

Quem provoca o controle usa `ActorEngine`.
O rito jurídico define as ações disponíveis.

## 15.2. Consequências possíveis

Uma norma pode ser:

- contestada;
- suspensa;
- interpretada;
- aplicada parcialmente;
- mantida;
- invalidada.

**[VERIFICAR]**
Competências, legitimidade ativa, ritos, efeitos e jurisprudência relevantes devem ser pesquisados antes de codificação.

---

# 16. EXECUÇÃO GOVERNAMENTAL E ECONOMIA

## 16.1. Cadeia causal

**[DECISÃO]**

`INTENTION → INSTRUMENT → AUTHORIZATION → RESOURCE → EXECUTOR → TIME → IMPLEMENTATION → REACTION → DELIVERY → CONSEQUENCE`

Aprovação não equivale a execução.

## 16.2. Tipos de execução

Não tratar como equivalentes:

- custeio;
- investimento;
- transferência;
- crédito;
- subsídio;
- renúncia tributária;
- regulação;
- contratação;
- reforma jurídica;
- comunicação;
- nomeação.

Para consequência importante, o motor deve poder reconstruir:

- causa;
- mecanismo;
- início;
- atraso;
- beneficiados/prejudicados;
- percepção;
- informação presidencial;
- incerteza;
- reversibilidade.

## 16.3. Profundidade econômica

**[DECISÃO]**

- profunda na decisão presidencial;
- média em empresas e projetos;
- baixa na operação cotidiana.

Simular:

- rota política/jurídica;
- propriedade;
- financiamento;
- controle;
- execução;
- consequências.

Abstrair:

- folha individual;
- máquinas;
- fornecedores individuais;
- microestoques;
- operação diária.

> **O jogador governa o Brasil; não administra a empresa.**

## 16.4. Quatro dimensões econômicas

```text
OWNERSHIP
FINANCING
OPERATION
CONTROL
```

Uma iniciativa pode combinar modelos diferentes em cada dimensão.

Não reduzir economia a “público × privado”.

## 16.5. Empresa

```yaml
company:
  sector: ...
  ownership: ...
  control: ...
  size: ...
  financial_health: ...
  capacity: ...
  investment_plan: ...
  management_quality: ...
```

A entidade econômica `company` guarda estado econômico. Quando a empresa possui agência estratégica relevante, ela referencia um `ACTOR.organization`.

Não duplicar campos econômicos dentro do ator: o `ACTOR` decide; `company` contém propriedade, capacidade e saúde econômica.

Estatal pode acrescentar:

- missão pública;
- supervisão;
- governança;
- necessidade de capital;
- metas estratégicas.

Empresas pequenas podem permanecer agregadas.

## 16.6. Projeto

```yaml
project:
  owner: ...
  operator: ...
  financing: ...
  cost: ...
  deadline: ...
  capacity: ...
  execution: ...
  critical_dependencies: [...]
```

Dependência só sobe à superfície quando altera decisão ou execução.

Formas de entrega:

- obra pública;
- estatal;
- concessão;
- PPP;
- modelo misto.

## 16.7. Setores

**[HIPÓTESE]**

Poucos setores agregados:

- energia;
- petróleo e gás;
- mineração;
- indústria/siderurgia;
- tecnologia;
- agro;
- construção;
- transportes/logística;
- defesa;
- financeiro;
- telecom;
- saúde/fármacos.

Conexões são causais e agregadas.
Não simular cadeia produto-a-produto sem necessidade de gameplay.

## 16.8. Estatização e privatização

Usam o mesmo sistema de propriedade e controle.

Possíveis ações:

- adquirir/vender participação;
- assumir/ceder controle;
- criar empresa estatal;
- reorganizar;
- nacionalizar quando houver rota;
- privatizar;
- liquidar;
- conceder quando aplicável.

O Modelo Jurídico-Institucional resolve competência e rota.

---

# 17. CLASSIFICAÇÃO POLÍTICA E REGIME EMERGENTES

## 17.1. Ideologia como descrição

**[DECISÃO]**

Ideologia descreve o governo e o Estado resultante.
Não desbloqueia ações.

Não usar classes políticas para restringir repertório.

## 17.2. Dimensões

**[ABERTO]**

Dimensões candidatas:

- mercado ↔ direção estatal;
- propriedade privada ↔ estatal/coletiva;
- baixa ↔ alta redistribuição;
- liberdade civil ampla ↔ restritiva;
- pluralismo competitivo ↔ concentrado;
- secular ↔ confessional;
- descentralização ↔ centralização;
- Executivo limitado ↔ concentrado;
- tecnocracia ↔ mobilização político-partidária;
- abertura externa ↔ fechamento/autossuficiência.

Mapa de Nolan pode existir apenas como visualização simplificada.

## 17.3. Perfil praticado

O perfil deve pesar principalmente:

- regra vigente;
- execução;
- consolidação.

Discurso não equivale a transformação material.

## 17.4. Regime

Não existe botão para “virar” determinado regime.

Regime emerge de:

- competição eleitoral;
- oposição;
- imprensa;
- Judiciário;
- separação de Poderes;
- direitos;
- regras eleitorais;
- concentração executiva;
- uso da força;
- religião oficial;
- federalismo;
- sucessão.

## 17.5. Ruptura

Mudança extralegal é cadeia de eventos:

`ACTION`
→ `DESTINATÁRIOS`
→ `LEGAL_RESOLUTION`
→ `ADESÃO/RECUSA`
→ `EXECUÇÃO OU FALHA`
→ `REAÇÕES`
→ `ESCALADA/RESPONSABILIZAÇÃO`
→ `POSSÍVEL CONSOLIDAÇÃO`.

Não criar evento único “golpe/revolução bem-sucedida”.

---

# 18. INVARIANTES TÉCNICOS

**[DECISÃO]**

1. Um único `ActorEngine`.
2. Um único modelo de informação.
3. Um único ledger de `COMMITMENT`.
4. Um único `INITIATIVE` para mudança pública estruturada.
5. Um único ciclo de vida canônico para a iniciativa.
6. Informação é localizada.
7. Nenhum ator lê `world_state` como conhecimento.
8. Planos persistem até existir razão para reconsideração.
9. Relações são direcionais.
10. Reputação é distribuída, não um escalar global.
11. Poder de barganha é derivado.
12. Decisões relevantes produzem `decision_trace`.
13. Mesma seed + versão + estado + ações → mesmo resultado.
14. Imprevisibilidade vem de informação parcial e interação, não de `random()` livre. Aleatoriedade reproduzível pela semente pode existir com função causal clara — geração inicial e de elenco, choques exógenos, eventos de incerteza genuína, amostragem de pesquisas. Ela cria circunstâncias; nunca substitui a decisão de um ator que já tem crenças, objetivos, compromissos, relações e contexto para decidir.
15. Nenhum fenômeno social recebe motor próprio quando puder ser composto pela ontologia canônica.
16. LLM não participa da lógica de runtime.
17. Texto pode mudar sem alterar o resultado da simulação.
18. Otimização de performance não pode mudar a lógica.
19. O laboratório de teste reutiliza código de produção.
20. Regra institucional real só entra como executável depois de validação factual adequada.
21. A interface do jogador consulta a visão presidencial, nunca o estado oculto (§6.1).
22. A classificação de processamento (dormente, ativo, focal) não muda decisão nenhuma, e a avaliação agendada é semanticamente equivalente à completa (§9.14).
23. Projeções (`GAME_RULE`, histórico jurídico, visões derivadas) não são fonte persistente.

---

# 19. PLANO DE IMPLEMENTAÇÃO DO NÚCLEO

## 19.1. Princípio

**[DECISÃO]**

O primeiro protótipo deve existir **dentro do projeto**, reutilizando os módulos reais de domínio.

Não criar:

- programa externo com regras próprias;
- página de teste com cérebro alternativo;
- `CongressAI`;
- `NegotiationAI`;
- `PartyAI`;
- implementação descartável.

## 19.2. Camadas

```text
DOMÍNIO DE PRODUÇÃO
ActorEngine
Information / Belief
Relation / Memory
Social Actions
Commitment Ledger
Initiative
Legal Resolution

        ↓ reutilizado por

LABORATÓRIO DE SIMULAÇÃO
ScenarioRunner
SyntheticCongress
TraceViewer
SimulationReport

        ↓ reutilizado por

JOGO
GameWorld
Gabinete
Email
Congresso
UI
```

Os nomes de classes são sugestivos; a separação de responsabilidade é obrigatória.

## 19.3. Primeira entrega do programador

Antes de alterar o motor, mapear:

- módulos atuais reutilizáveis;
- módulos incompatíveis com a especificação;
- estados duplicados existentes;
- dependências que precisariam mudar;
- testes afetados;
- estratégia de migração.

Mudança conceitual necessária deve ser sinalizada antes de ser consolidada em código.

## 19.4. Laboratório inicial

Cenário:

```text
20 parlamentares sintéticos
4 partidos
2 líderes
1 relator
1 iniciativa
4 cláusulas
```

Sem:

- UI final;
- mapa;
- economia completa;
- save completo;
- 513 deputados;
- sistemas irrelevantes ao teste.

Objetivo: provar comportamento antes de escalar.

## 19.5. Sequência

1. tipos canônicos mínimos;
2. `ActorEngine` + `decision_trace`;
3. informação/crenças;
4. relações/memórias;
5. protocolo social + compromissos;
6. laboratório;
7. Congresso sintético;
8. calibração inicial;
9. Motor de Intenção;
10. resolvedor jurídico;
11. integração iniciativa → Congresso → norma → execução;
12. Momento Presidencial;
13. uma semana jogável;
14. corte vertical;
15. escala para Congresso completo;
16. refinamento de UI;
17. expansão de domínios.

Cada etapa deve passar seus critérios antes da próxima expansão. A ordem concreta em lotes está no mapa de migração do repositório: lotes de tempo e de epistemologia podem entrar entre estas etapas, um de cada vez, sem pular o critério de nenhuma.

## 19.6. Saída de diagnóstico

O laboratório deve responder:

```text
POR QUE O ATOR X FEZ Y?
```

Exemplo:

```text
actor: MP_07
action: VOTE_NO

decisive_goals:
- REGIONAL_DELIVERY

decisive_beliefs:
- CLAUSE_3 harms constituency

party_orientation:
- YES

active_commitments:
- none

decision:
- VOTE_NO
```

A interface final converte causas relevantes em linguagem natural seletiva.

---

# 20. CRITÉRIOS DE ACEITAÇÃO

## 20.1. Atores

Sem evento roteirizado:

- ator mantém plano diante de variação pequena;
- choque material pode forçar reconsideração;
- informação diferente pode produzir decisão diferente;
- especialista pode detectar risco ignorado por outro;
- ator pode iniciar contato sozinho;
- organização e pessoa usam o mesmo motor.

## 20.2. Social

O sistema deve demonstrar:

- `REQUEST`;
- `COMMIT`;
- aceitação/recusa/adiamento;
- contraproposta no mesmo protocolo;
- compromisso cumprido;
- compromisso rompido;
- efeito posterior na confiança/memória;
- posição pública diferente da intenção;
- ameaça emergindo de `COMMIT`;
- mentira sendo descoberta somente por evidência;
- ausência de loops com estado inalterado.

## 20.3. Congresso

O mesmo sistema deve permitir:

- maioria formal perder;
- minoria aprovar com apoio externo;
- orientação partidária sofrer deserção;
- Câmara e Senado chegarem a resultados diferentes;
- relatoria alterar trajetória;
- alteração de cláusula ganhar um grupo e perder outro;
- presença mudar resultado;
- estimativa de votos errar por informação imperfeita, não por RNG arbitrário.

## 20.4. Legalidade

Uma iniciativa:

- não recebe rota incompatível sem explicação;
- não pula instituição necessária;
- separa `assessment` de `route.kind`;
- usa o ciclo de vida único;
- preserva causa rastreável.

## 20.5. Informação

Nenhum ator recebe conhecimento sem:

- observação;
- fonte;
- canal;
- inferência plausível.

## 20.6. Mundo autônomo

Sem intervenção presidencial por várias semanas ainda devem ocorrer:

- ações de terceiros;
- decisões institucionais;
- execução;
- consequências;
- escaladas plausíveis.

## 20.7. Liberdade política

O Motor de Intenção deve representar sem `if ideology == X`:

1. extinguir fundo eleitoral;
2. ampliar dotação de fundo;
3. criar estatal;
4. adquirir participação/controle em empresa;
5. privatizar estatal;
6. nacionalizar setor;
7. construir infraestrutura pública;
8. conceder/estruturar PPP;
9. criar tributo progressivo;
10. reduzir/zerar tributo;
11. ampliar benefício social;
12. extinguir benefício;
13. criminalizar conduta;
14. descriminalizar conduta;
15. ampliar proteção jurídica;
16. restringir liberdade;
17. criar status religioso oficial;
18. descentralizar competência;
19. centralizar competência;
20. alterar regra eleitoral;
21. alterar regra de nomeação;
22. criar órgão;
23. extinguir/reorganizar estrutura;
24. emitir ordem fora da competência;
25. iniciar transformação constitucional ampla.

Se um caso exigir um ramo ideológico específico, revisar a arquitetura.

## 20.8. Cenário econômico de estresse

A mesma campanha deve conseguir tentar:

- criar estatal;
- capitalizá-la;
- adquirir participação privada;
- assumir controle;
- construir infraestrutura;
- usar concessão/PPP;
- nacionalizar quando houver rota válida;
- vender participação;
- privatizar;
- reverter estratégia anterior.

Tudo sem microgestão empresarial obrigatória.

## 20.9. Determinismo

Mesma:

- versão;
- seed;
- estado inicial;
- sequência de ações;

deve reproduzir o mesmo resultado lógico.

---

# 21. CRITÉRIOS DE JOGABILIDADE

## 21.1. Anti-tédio

Uma mecânica sobe à superfície somente se criar:

- escolha;
- risco;
- oportunidade;
- conflito;
- compromisso;
- prioridade;
- problema de informação.

Caso contrário, automatizar ou resumir.

## 21.2. Anti-falsa-profundidade

Preferir:

- poucos atores realmente distintos;
- poucos sistemas que interagem;
- consequências rastreáveis;

a:

- retratos cosméticos;
- telas redundantes;
- modificadores independentes sem causalidade.

## 21.3. Leitura

Resumo primeiro.
Profundidade opcional.

O jogador deve conseguir compreender o conflito rapidamente e abrir detalhes somente quando quiser.

## 21.4. Corte vertical

Antes de expansão ampla, provar uma cadeia completa contendo:

- problema material;
- 2–4 atores relevantes;
- informação imperfeita;
- Momento Presidencial;
- iniciativa;
- rota jurídica/institucional;
- negociação;
- execução;
- reação;
- retorno posterior.

O corte passa se:

- existirem ao menos três estratégias plausíveis;
- atores agirem sem script específico;
- consequência for explicável;
- conflito for legível;
- detalhe adicional for opcional.

---

# 22. PESQUISA E FIDELIDADE

## 22.1. Regra

**[DECISÃO]**

Antes de transformar realidade brasileira em regra executável:

1. separar fato jurídico/institucional de hipótese de design;
2. consultar fonte primária atual;
3. registrar competência;
4. registrar exceções materialmente relevantes;
5. evitar calibração numérica sem evidência;
6. não generalizar decisão judicial específica;
7. versionar alteração legal relevante;
8. distinguir lei, prática administrativa e interpretação.

Quando fidelidade factual conflitar com uma ideia de gameplay:

- verificar primeiro;
- explicar o conflito;
- procurar uma solução fiel;
- abstrair somente de forma consciente.

## 22.2. Fontes estruturais já confirmadas

**[ATUAL — verificado em 24/09/2026]**

- Constituição Federal, fonte oficial do Planalto: processo legislativo e competências presidenciais.
- Portal oficial da Câmara dos Deputados: 513 cadeiras.
- Portal oficial do Senado Federal: 81 cadeiras.

Detalhes de rito continuam sujeitos a verificação específica antes da implementação.

---

# 23. RISCOS, LIMITES E QUESTÕES ABERTAS

## 23.1. Riscos principais

- **Burocracia sem jogo:** modelar rito porque existe.
- **Dashboard disfarçado:** personagem como skin de número.
- **Mundo passivo:** tudo esperar clique.
- **Causalidade invisível:** resultado sem mecanismo.
- **Escopo explosivo:** simular o país inteiro antes de provar o loop.
- **Consequência automática:** `ação X → reação Y` sem atores e condições.
- **Realismo punitivo:** fidelidade usada apenas para bloquear.
- **Roteirização excessiva:** história funciona uma vez, sistema não.
- **Parser que finge entender:** intenção vaga vira ação não confirmada.
- **Estado duplicado:** dois módulos viram autoridade sobre o mesmo fato.
- **Motores paralelos:** subsistema especial resolve o mesmo problema de forma diferente.
- **Protótipo descartável:** laboratório prova algo que o jogo real não reutiliza.

## 23.2. Decisões descartadas

**[DESCARTADO]**

- ideologia como classe/preset;
- botão de regime;
- mídia como modificador direto de aprovação;
- pontos abstratos de ação presidencial;
- UI obrigatoriamente organizada por áreas;
- “4 semanas = 1 mês”;
- nomes de modo “Mandato” e “Planalto”;
- burocracia rotineira como gameplay;
- ator reduzido a modificador;
- IA generativa como requisito de runtime.

## 23.3. Itens adiados

**[ABERTO — não prioritário]**

- modo mensal/rápido;
- plataformas digitais em escala detalhada;
- grande população de empresas individualizadas;
- simulação municipal massiva;
- mercado financeiro hiper detalhado;
- expansão institucional antes do corte vertical.

## 23.4. Questões prioritárias

### Calibração do `ActorEngine`

- limiar heurístico/deliberativo;
- persistência de planos;
- saliência/esquecimento;
- peso de compromissos;
- confiança;
- contato espontâneo;
- diferenças por papel/instituição.

### Negociação

- comparação acordo × alternativa sem acordo;
- poder de barganha derivado;
- geração de contrapropostas;
- custo de recuo público;
- prevenção de spam;
- encerramento de threads.

### Congresso

- procedimentos que merecem superfície;
- pauta;
- relatoria;
- comissões;
- presença;
- calibração Câmara × Senado.

### Jurídico

- esquema final de fontes/regras;
- interpretação;
- jurisprudência;
- mudança de ordem constitucional;
- ruptura.

### Interface

- Gabinete;
- navegação principal;
- Estado/Regras;
- Congresso;
- Governo;
- compositor de iniciativas;
- apresentação de interações sociais.

### Mídia

- veículos;
- jornalistas;
- boatos/desinformação;
- pesquisas;
- ciclos de atenção.

### Fim de mandato

- legado;
- reeleição;
- sucessão;
- continuidade institucional.

## 23.5. Próximo marco

**[DECISÃO]**

Próximo trabalho de implementação:

> **mapear o código atual contra esta especificação e construir o laboratório do `ActorEngine` com Congresso sintético.**

A prioridade é provar:

- autonomia;
- persistência;
- informação localizada;
- negociação;
- compromisso;
- conflito partido × indivíduo;
- causalidade;
- explicabilidade;
- determinismo.

Não escalar para o Congresso completo antes disso.

---

# 24. CRITÉRIO DE SUCESSO

O núcleo do projeto está no caminho correto quando o jogador sente:

> **“Eu consigo tentar quase qualquer projeto político, mas preciso governar um país real para conseguir realizá-lo.”**

E o motor consegue sustentar essa experiência sem:

- roteiro específico por ideologia;
- IA generativa;
- botão mágico;
- efeito sem causa;
- microgestão burocrática;
- sistemas duplicados.

---

# 25. ORIENTAÇÃO AO PROGRAMADOR

## 25.1. Responsabilidade

Esta especificação define:

- comportamento esperado;
- ontologia;
- invariantes;
- fronteiras entre sistemas;
- critérios de aceitação.

A implementação define:

- estrutura concreta de módulos;
- algoritmos;
- persistência;
- performance;
- integração com o repositório;
- testes automatizados;
- ferramentas de diagnóstico.

Não alterar uma decisão conceitual silenciosamente para facilitar implementação.

## 25.2. Primeiro passo obrigatório

Antes de escrever o novo núcleo:

1. ler esta especificação;
2. inspecionar o repositório atual;
3. produzir um mapa `especificação → código existente`;
4. identificar o que pode ser reutilizado;
5. identificar fontes duplicadas de estado;
6. listar conflitos de arquitetura;
7. propor a menor migração segura;
8. preservar testes úteis existentes.

## 25.3. Regra de protótipo

O laboratório pode possuir:

- cenários sintéticos;
- controles de execução;
- visualização de traces;
- relatórios.

Não pode possuir:

- cérebro alternativo;
- regras sociais alternativas;
- Congresso alternativo;
- lógica política exclusiva de teste.

Se uma regra precisa ser reescrita para entrar no jogo, o protótipo provavelmente foi desenhado no lugar errado.

## 25.4. Critério de conclusão da primeira etapa

A primeira etapa termina quando o cenário pequeno demonstra repetidamente:

- comportamento autônomo;
- persistência;
- negociação;
- compromisso;
- informação localizada;
- conflito entre indivíduo e organização;
- decisões explicáveis;
- reprodução determinística.

Só então escalar.
