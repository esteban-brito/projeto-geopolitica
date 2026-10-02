# Governo variável — o contrato

> **Situação:** vigente — o contrato do governo variável.

> Versão consolidada de 01/10/2026. Junta o [contrato de 28 a 30/09](../archive/dynamic-government-2026-09-30.md)
> e o [piloto](../archive/government-pilot-2026-09-30.md), escritos pelo Codex sem revisão
> independente; os dois seguem no arquivo, com fontes, casos e contraexemplos completos.
> Marcas da [especificação mestra](master-spec.md): [VERIFICADO], [DESENHO], [HIPÓTESE].

## As ordens dele

- **28/09:** ministérios e pessoas da posse deixam de ser listas fixas. O jogador mantém, junta,
  extingue, cria e reorganiza pastas, e o trabalho do Estado sobrevive a tudo isso.
- **29/09:** números como 30 trajetórias e 80 ministérios eram exemplos, não cotas. Fidelidade
  com diversão; rotina administrativa resumida; nenhum especialista perfeito garantido por pasta.
- **30/09:** sai o critério de "caso histórico parecido" e a reação genérica pelo verbo. Entram
  palavras-chave e composição livre. Ele quer testar o protótipo antes de qualquer integração.

## 1. O trabalho e quem responde por ele

Um **trabalho** é uma responsabilidade identificável do Estado: verbo, objeto, público ou
território e instrumento, com ID estável. "Receber denúncias de direitos humanos" e "manter a
ouvidoria comum de um ministério" são trabalhos diferentes, apesar da palavra igual. As 152
frases da posse v2o (`prototypes/government/competencies.mjs`) são material de partida, ainda
sem decomposição jurídica: uma frase pode juntar papéis diferentes.

Responder por um trabalho não é fazer tudo nele. Os papéis são distintos: conduzir a política,
executar, financiar, regular, supervisionar e participar. Transferir a condução não move o
executor, a agência nem a cadeia de comando:

- o SUS tem direção em cada esfera e pactuação entre gestores (Lei 8.080/1990, arts. 9 e 14-A) [VERIFICADO];
- a Anvisa é autarquia especial com autonomia administrativa (Lei 9.782/1999, arts. 3º e 4º) [VERIFICADO];
- as Forças têm comandantes próprios, sob o Ministro da Defesa e a autoridade suprema do
  Presidente (LC 97/1999, arts. 1º, 3º e 4º) [VERIFICADO].

## 2. O órgão e o ato

Um **órgão** tem ID independente do nome, tipo (ministério, Presidência, AGU), titular e
vigência. Renomear não transfere trabalho; transferir não exige renomear. Uma pasta pode ficar
vazia: custa estrutura e não rende nada pelo nome.

Um **ato** registra a operação, os trabalhos atingidos, a estrutura anterior, a rota e a
vigência. Criar e extinguir ministério exige lei ou medida provisória; decreto só reorganiza o
que não cria órgão nem gasta mais (CF, arts. 48 XI, 61, 62, 84 VI "a" e 88) [VERIFICADO].
Proposta, vigência provisória, aprovação e consolidação são estados diferentes. Desfazer uma
junção pela trilha estrutural **não** é a perda de eficácia de uma MP: a CF manda disciplinar as
relações criadas durante a vigência (art. 62, §§ 3º e 11) [VERIFICADO], e o rito tem de mostrar o
que cessa e o que já produziu efeito.

## 3. O valor político da estrutura

É o que falta para a base deixar de sumir depois de uma reforma. Três grandezas separadas [DESENHO]:

- **massa de trabalho:** a soma dos pesos dos trabalhos. Juntar ou transferir conserva; dividir
  reparte, nunca multiplica;
- **valor da nomeação:** o trabalho que a pasta administra, mais um prestígio de ter ministério
  que rende cada vez menos a cada pasta nova, normalizado pelo total de cargos ativos;
- **custo de estrutura:** equipe mínima por órgão e coordenação entre órgãos que dividem uma política.

A propriedade é obrigatória antes de qualquer número: fatiar um trabalho em dez pastas não
multiplica por dez o trabalho, a capacidade nem os votos. Comparar 5, 38 e 80 pastas com os
mesmos partidos tem de mostrar ganho limitado e custo crescente. A posse e o mês usam a mesma
consulta; onde o modelo faltar, a tela declara a estimativa pendente, como hoje.

## 4. Pessoas e preparo

Pessoas fictícias nascem da semente e de um ordinal, nunca do cargo; o ID não inclui a pasta.
Abrir, ordenar ou passar o mouse numa lista não cria ninguém. Uma busca nova de candidatos é
uma ordem da partida, com custo e resultado gravado. Ampliar a estrutura pode expor escassez.

A trajetória é feita de **episódios**: intervalo, papel, ação, objeto, instrumento, público,
escala e resultado conhecido, com a origem da informação. Formação, atuação técnica e direção
são evidências distintas; realizar um projeto e obter o resultado também.

O **preparo** é a estimativa da Presidência, de 1 a 6, de quanto a experiência conhecida cobre os
trabalhos atuais da pasta. Cada trabalho recebe evidência direta, transferível, insuficiente ou
desconhecida, com a justificativa. Fama, partido, ideologia, título e nome da pasta não entram
na conta. Uma fusão pode baixar o preparo de todos; pasta vazia diz "sem atribuições para
avaliar"; dado desconhecido não é prova de incapacidade; preparo baixo não veta a nomeação.
Os cortes de 1 a 6 só entram com casos de referência e calibragem. A escolha dos 33 notáveis
fixos (ordem de 26/09) ainda tem de entrar nesse mesmo cadastro.

## 5. Busca e sugestão de destinos

A busca encontra trabalhos por expressões, sinônimos declarados, `e`, `ou`, `não` e parênteses
(`prototypes/government/work-search.mjs`). Ela devolve IDs e ambiguidades: "segurança" mostra
alimentar, pública e da informação. Termo desconhecido fica declarado. A busca não transfere
trabalho e não inventa efeito por semelhança de palavra.

A sugestão da Casa Civil, quando existir, compara destinos por trabalho já exercido,
instrumento, capacidade, dependências e conflito de papéis, e mostra por que sugeriu. Nome de
ministério e precedente histórico não são critério. Sem destino bom, mostra a lacuna.

## 6. Como provar que a reforma vale a pena

Toda reforma se compara com manter a estrutura e só mudar a prioridade, a partir do mesmo
estado. Se a reforma só troca o nome, o efeito material é o mesmo. Fusão e especialização
precisam mostrar ganho e perda por trabalho, com a transição no cálculo. Desfazer não devolve
gasto nem apaga entrega. Contraexemplos que a implementação tem de aguentar:

| caso                                               | o defeito que revelaria                                 |
| -------------------------------------------------- | ------------------------------------------------------- |
| mesmo currículo, título mais prestigioso           | nota por título, não por experiência                    |
| duas pastas de nomes diferentes e o mesmo trabalho | nota ou sugestão pelo nome                              |
| a mesma palavra em direitos, defesa e saúde        | correspondência falsa por palavra                       |
| transferir função sem equipe, verba ou acesso      | autoridade formal confundida com capacidade             |
| dividir e reunir a mesma estrutura em série        | candidatos, apoio ou recursos de graça                  |
| 80 pastas sobre as mesmas estruturas de execução   | número de ministros confundido com capacidade do Estado |
| reforma que melhora a média e piora um público     | média escondendo a consequência                         |

## 7. O que existe e a ordem do que falta

**Existe** (01/10): a estrutura por IDs com inversas que preservam transferências posteriores
(`prototypes/government/index.mjs`, 13 provas e uma sonda de 200 sequências), a busca (10
provas), o inventário das 152 frases e a ponte com a tela da posse (`prototypes/posse/`).

**Saiu em 01/10:** os ensaios `pilot`, `operations`, `demand` e `management`. Eram um motor de
capacidade paralelo à MALHA, com unidades inventadas e nenhum consumidor; a especificação
(§25.3) proíbe cérebro alternativo no laboratório. O código está no histórico do Git, e as ideias
que valiam estão acima.

**Falta, nesta ordem, depois do teste dele:**

1. o valor político da estrutura (§3), para a base não sumir depois de uma reforma;
2. currículos por episódio nas fichas e o preparo pela evidência (§4);
3. a decomposição jurídica das 152 frases, começando por Direitos Humanos, Saúde e Defesa;
4. o rito da MP com vigência e perda de eficácia (§2);
5. a integração no jogo: estado, save, coalizão, capacidade e a tela da posse refeita em
   `src/` (ciclo 32, fase 4), com revisão independente.
