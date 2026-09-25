# Reformulação do mundo e dos ministérios — proposta em discussão

> **Superado como direção em 24/09/2026** pela [especificação mestra](spec/master-spec.md).
> Fica como histórico e evidência: o estudo do código, a avaliação da revisão do Gemini e o caso
> do IOF de 2025 continuam válidos como registro. O piloto de Energia não é o primeiro passo; o
> primeiro passo está no [mapa de migração](spec/migration-map.md).

## Direção do usuário e estado da proposta

Em 23/09/2026, o usuário avaliou o jogo atual como malfeito e chato e pediu uma reformulação
voltada à jogabilidade e ao realismo. Quer pessoas com personalidades, inteligência e iniciativa,
e empresas fictícias com inspiração clara na vida real. Essa direção prevalece sobre a ordem
anterior das tarefas de manutenção. Quantidade de pastas, modelo de atores e piloto abaixo
são propostas do Codex; ainda não são sistemas implementados nem escolhas aprovadas pelo usuário.

Este documento substitui o rascunho `tmp/history/world-design-proposal.md` como referência desta proposta.
O estado do trabalho e a fila continuam no [handoff](handoff.md).

A [pesquisa entregue pelo Gemini](research/13-real-brazil-institutions.md) recebeu apenas triagem
rápida: faltam fontes rastreáveis e há erros e generalizações sinalizados na abertura. Não é
base factual validada nem substitui as decisões deste plano; revisão aprofundada fica para retomada.

O usuário esclareceu que o jogo está no início do desenvolvimento: planos e soluções podem
mudar e serão discutidos entre ele, Codex, Claude e Gemini. Sua prioridade é o realismo e a
máxima fidelidade ao que um presidente realmente é e faz. Propostas anteriores não são
compromissos definitivos; o usuário mantém a autoridade final.

Como orientação de modelagem, distinguir o que o presidente decide diretamente, o que depende
de negociação ou de outras instituições e o que ele apenas influencia ou acompanha. Pessoas
e empresas devem ter autonomia compatível com seu papel. Simplificações precisam ser explícitas
e avaliadas pelo quanto preservam essas relações, sem transformar o presidente em controlador
direto de toda a sociedade.

## O que o código permite afirmar

- O jogo tem oito áreas e 38 programas. `spendOf` agrega a verba por área, e a MALHA recebe
  essa soma. Para a capacidade, um bilhão pago em dois programas diferentes da mesma área
  usa o mesmo rendimento direto. Os programas ainda diferem em custo, limites e efeitos na
  proposta política: não são equivalentes em todos os sistemas.
- `Program.weight` e `Program.lag` existem no catálogo, mas não entram na conta de capacidade
  mensal. `yield` existe em `Area`; não há um `yield` individual de programa pronto para ativar.
- ELENCO gera ambição, posição política, alcance e memória. Não há ocupação de ministérios,
  relações persistentes entre pessoas ou planejamento autônomo de empresas.
- TEMPORAL e CASCATA contêm apenas contratos vazios. Empresas seguem planejadas no ciclo 20.

Fontes: [programas](../src/data/programs.mjs), [agregação do gasto](../src/application/agenda.mjs),
[capacidade](../src/domain/capacity/index.mjs), [composição mensal](../src/application/turn.mjs)
e [pessoas](../src/domain/cast/index.mjs).

## Avaliação da resposta do Gemini

Revisão recebida no arquivo `A proposta do Codex toca no ponto.md`, enviado pelo usuário.

| Ponto da revisão                                                     | Avaliação do Codex                                                                                                                                                          |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Diferenciar consequências dos programas                              | Concordo. A agregação atual elimina diferenças materiais importantes.                                                                                                       |
| Controlar o escopo e preservar uma interface compreensível           | Concordo. Quantidade de instituições simuladas não exige igual quantidade de itens no dock.                                                                                 |
| Codex teria proposto 37 telas antes de tornar o jogo jogável         | Não corresponde à proposta: setores, ministérios e navegação já eram distinguidos. O número final de pastas permanece aberto.                                               |
| A carta de arquivamento deve obrigatoriamente vir antes              | Ela continua sendo uma lacuna de comunicação, mas a prioridade atual do usuário é reformular a experiência. Não é dependência técnica desse estudo.                         |
| Fazer a carta fecha o ciclo 29                                       | Incorreto: permanecem pendências de prosa e de inventário/poda. O ciclo não foi declarado fechado.                                                                          |
| Basta ativar `weight`, `lag` e `yield` de programas                  | Incompleto: falta definir o significado dos efeitos, seus estados e atrasos; `yield` individual nem existe. Os números sugeridos de 1 e 12 meses são hipóteses sem medição. |
| Contratar técnico melhora execução; demitir indicado rompe a bancada | Pode ser um resultado, não uma regra universal. Competência, vínculos partidários, influência e disposição a romper devem variar separadamente.                             |
| Limitar para sempre a oito ou dez pastas                             | Não adoto esse limite sem teste. Começar com poucas entidades para testar o modelo é uma decisão diferente do tamanho final do país.                                        |

A referência a “37 ministérios” precisa de data e critério: a
[Lei 14.600 consolidada, arts. 17 e 18](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14600.htm)
distingue a relação de ministérios dos outros cargos cujos titulares são ministros de Estado
e incorpora alterações posteriores. Essa contagem não define o desenho da interface.
A afirmação de que toda a estrutura existe por fisiologismo é uma interpretação política
do revisor; não a adotamos como explicação universal ou parâmetro do motor.

## Modelo a testar

### Liberdade de projeto político

O usuário esclareceu que não quer interpretar Lula nem ficar limitado ao projeto de qualquer
governo real. Quer poder tentar transformações radicais, citando comunismo, fascismo, reformas
inspiradas em Milei e uma trajetória inspirada em Singapura. São referências de possibilidades,
não equivalências entre esses projetos nem especificações históricas já pesquisadas.

O Brasil real fornece condições iniciais, instituições e mecanismos; não determina o destino
da partida. O modelo deve permitir tentar mudar as próprias regras e instituições, inclusive
por atos de ruptura. Distinguir tentativa, validade jurídica, execução e consolidação: uma ordem
presidencial não se realiza só por ter sido emitida. Oposição institucional, adesão dos executores,
recursos, tempo e consequências humanas, econômicas e políticas precisam ter causas observáveis.

Não oferecer uma troca instantânea de regime por rótulo ideológico. Projetos devem emergir de
medidas e mudanças concretas, permitindo combinações próprias. Não garantir sucesso nem impor
fracasso por preferência ideológica do motor. A possibilidade de tentar não implica que todo
objetivo seja alcançável em qualquer estado ou dentro de um mandato de 48 meses. Se uma trajetória
exigir continuidade além desse horizonte, discutir o escopo com o usuário; não alterar o mandato
implicitamente. Repressão e violações de direitos, quando simuladas, devem produzir consequências
para pessoas e instituições, sem aparecer apenas como bônus de eficiência.

### Experiência presidencial e referência institucional

O usuário escolheu combinar reuniões e conversas com documentos e despachos, tomando o
governo brasileiro real, inclusive o governo Lula e a atuação do STF, como referência.
Isso não altera a escolha de personagens fictícios. A proposta é que uma mesma questão
tenha documentos, interlocutores, decisões formais e acompanhamento persistente.

Base institucional: [Constituição, arts. 2, 49, 62, 84, 87 e 102](https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm).
Presidente e ministros têm competências próprias; Congresso e Judiciário são poderes
independentes. Projeto de lei, medida provisória, decreto, sanção e veto exigem tratamentos
distintos. O STF decide processos dentro de suas competências; não funciona como uma bancada
cujo apoio o presidente compra. Contestação judicial precisa de objeto, legitimidade, rito
e fundamentação; não deve nascer apenas de um medidor abstrato de hostilidade.

Caso real para estudar: a disputa do IOF em 2025. O Congresso sustou decretos presidenciais;
houve judicialização, suspensão dos atos dos dois poderes, audiência sem acordo em 15/07
e restabelecimento parcial pelo relator em 16/07. Fontes:
[audiência no STF](https://noticias.stf.jus.br/postsnoticias/audiencia-sobre-iof-termina-sem-acordo-e-partes-pedem-que-stf-decida-controversia/)
e [decisão do relator](https://noticias.stf.jus.br/postsnoticias/stf-restabelece-parcialmente-decreto-que-eleva-aliquotas-do-iof/).
É um episódio datado, não uma descrição do estado jurídico atual nem uma sequência obrigatória
para toda política. A agenda presidencial de 23/09/2026 não pôde ser verificada nesta consulta.

Tradução proposta para o jogo: receber nota técnica e alternativas; reunir responsáveis;
negociar quando necessário; formalizar a decisão pelo instrumento adequado; acompanhar
execução e contestações. Conversas geram compromissos e pedidos de revisão, mas não substituem
automaticamente atos formais. Delegar precisa permitir cobrança posterior. Os resultados
variam conforme atores e circunstâncias, sem reproduzir desfechos históricos por roteiro.

### Atores e consequências

**Pessoas:** objetivos persistentes, competência, relações, ambição, tolerância a risco e memória
de fatos. Elas percebem apenas a informação disponível, avaliam ações que podem executar e
podem negociar, esperar, propor, cumprir ou romper. Personalidade precisa mudar decisões diante
da mesma situação. Cargo político não determina competência; demissão não determina perda
automática de todos os votos de uma bancada.

**Empresas:** interesses e decisões próprios, com recursos, compromissos e resultados materiais.
No piloto, registrar somente os fluxos necessários à decisão escolhida. Investimento deve ter
origem de recursos, prazo e entrega; uma transferência pública não pode reaparecer como dinheiro
novo. Emprego, preços e produção só entram onde houver um mecanismo explicável e dados para
calibrá-lo. Nomes são fictícios; setor e porte terão fonte e ano-base.

**Ministérios e resultados:** a pasta tem responsáveis, instrumentos e competências. Os resultados
do país são medidos separadamente, e podem ser afetados por várias pastas. Navegação pode agrupar
assuntos e destacar prioridades, independentemente do total de instituições representadas.

**Programas:** distinguir custeio de serviço existente, construção de capacidade, transferências,
crédito, renúncia tributária e regulação. Um único atraso por programa não resolve essa diferença.
Resultados terão unidades e causas próprias antes de receber pesos e coeficientes.

**Informação e ritmo:** iniciativas surgem de objetivos, recursos e acontecimentos. Esperar é uma
ação válida. Não exigir crise ou conflito em todo mês. Agrupar pedidos e destacar os relevantes
para permitir ao jogador delegar e manter prioridades. A previsão usa as mesmas regras do turno,
mas não revela objetivos ocultos nem garante resultados de negociações ainda incertas.

“Inteligência” significa aqui escolha autônoma com memória e informação limitada. A decisão
vigente de não usar IA por API continua valendo; a expressão do usuário não foi interpretada
como autorização para mudá-la. Mesma semente e mesmas ordens devem reproduzir o mandato.

## Piloto proposto e sequência

1. Mapear em alto nível as competências para evitar sobreposições. Detalhar somente o necessário
   ao primeiro piloto; o catálogo completo não é uma condição para começar a experimentar.
2. Testar Energia: um ministro, uma empresa estatal fictícia, uma privada e interlocutores
   parlamentares já existentes. Começar por uma decisão de investimento com financiamento,
   prazo e entrega. Preços regulados, comércio externo e um mercado financeiro completo não
   são requisitos desse primeiro experimento.
3. Fazer pessoas e empresas iniciarem pedidos e responderem ao histórico do governo. Integrar
   negociação, execução e consequências observáveis numa partida de 48 meses.
4. Jogar e comparar estratégias antes de expandir. Depois testar uma pasta com funcionamento
   diferente, como Saúde, e revisar o modelo comum antes de estendê-lo às demais.

## Critérios para avaliar o piloto

- O mundo toma iniciativas mesmo quando o jogador conserva suas ordens; nem toda pessoa age todo mês.
- Trocar personalidade ou relações altera decisões em cenários controlados, não apenas o texto.
- Investir, adiar e recusar têm consequências distintas, com origem dos recursos e prazos rastreáveis.
- Uma política útil em um contexto pode ter custos ou perder valor em outro. Sondas com várias
  sementes procuram estratégias dominantes; resultados favoráveis não provam sua inexistência.
- O jogador consegue explicar quem pediu, por que respondeu e o que aconteceu. Esse critério
  exige partidas observadas e avaliação do usuário, além dos testes automatizados.
- Antes de expandir, conferir integração com orçamento, normas, bancada, opinião e persistência.
  O plano de migração do save deve preceder alterações no esquema; não foi implementado neste estudo.

As pesquisas antigas orientam perguntas. Competências legais, fontes numéricas e prazos propostos
precisam de verificação antes de virar regras. As pendências do ciclo 29 permanecem registradas;
nenhuma estimativa de sessões nesta discussão é um prazo medido.
