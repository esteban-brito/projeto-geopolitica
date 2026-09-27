# O mundo vivo — a "IA" do jogo

> Versão 2, 25/09/2026. A proposta v0 foi aceita pela ordem dele ("crie uma IA viva", carta
> branca, realismo acima de tudo), e os lotes 1 e 2 estão no jogo.
> Detalha a [especificação mestra](master-spec.md) §9 (atores), §10 (protocolo social), §11
> (mídia) e §14.11 (agenda autônoma do Congresso). "IA" aqui é decisão determinística de pessoas
> simuladas; IA por API não entra (ADR 0001 e 0002, e a decisão de 04/09).

## Como está hoje

- **O jogo tem 16 tipos de carta, e todas nascem de uma conta:** um número cruza um limite (a
  pressão ferve, a base rompe, o teto fecha) e a carta sai. Ninguém decide mandá-la.
- **O Congresso vota por bancada, por fórmula.** Nenhum deputado propõe nada sozinho.
- **Há 8 pessoas com ambição e memória:** os líderes das bancadas.
- **O afastamento abre sozinho** quando três indicadores coincidem.
- **O motor de decisão (VONTADE) existe e está provado:** objetivo, intenção, risco e crença por
  evidência. Hoje só a reunião do corte o usa, e ela está pausada.

Resumo: hoje o mundo é feito de termômetros, e não de pessoas.

## O que faz um mundo parecer vivo

1. **Coisas acontecem sem o jogador.** A especificação diz: "o mundo não espera o Presidente".
2. **Cada acontecimento tem um autor com motivo.** O escândalo sai porque alguém vazou; a greve,
   porque o sindicato decidiu parar.
3. **Duas partidas nunca são iguais,** porque as pessoas são diferentes, sabem coisas diferentes e
   reagem ao que o jogador fez.

## Como deve funcionar

Toda semana:

1. **Só acorda quem tem motivo:** um prazo, uma notícia que chegou, um pedido, uma oportunidade
   (especificação §9.14). Quem não tem motivo dorme, e isso não muda nenhuma decisão.
2. **Quem acorda decide pela VONTADE:** espera, age, pede ou promete, pela personalidade, pela
   ambição, pelo que sabe e pelo que lembra.
3. **A ação vira acontecimento** e chega só a quem pôde ver. A informação não se teletransporta: é a
   crença por evidência do A2a.
4. **O que chega à Presidência passa pelo chefe da Casa Civil,** e vira assunto da mesa.
5. **Na sexta, o relatório mostra o que a Presidência sabe,** e o porquê que ela conseguiu descobrir.

**O repertório é do cargo, com a rota e o preço da [gramática](rules-grammar.md):**

- o deputado propõe projeto, vota, pede cargo, assina CPI, troca de partido;
- o governador pede verba, apoia ou critica em público;
- o sindicato negocia ou para;
- o jornal investiga e publica;
- quem tem legitimidade vai ao STF;
- o ministro executa, pede, vaza ou pede demissão.

## Quem são os atores, em camadas

- **Sempre relevantes:** os 38 ministros, os presidentes da Câmara e do Senado, os líderes dos 9
  partidos, o Vice e o presidente do Banco Central.
- **Acordados quando o assunto os toca:** os 27 governadores, o STF e o procurador-geral, as centrais
  sindicais, as confederações empresariais, as igrejas, os movimentos, os caminhoneiros e alguns
  veículos de imprensa.
- **Os 594 parlamentares, um a um:** o lote D1 do mapa. A maior parte dorme e acorda nas votações.
- **Sem vontade própria:** o mercado, a opinião por segmento e a economia são números, e não
  pessoas (especificação §9.1).

## Regras para a vida não virar caos

- **Nada nasce sorteado do nada.** A aleatoriedade fica na personalidade de cada um, pela semente, e
  em quem descobre o quê.
- **O ritmo vem do calendário real e das pessoas:** votações, prazos da lei, relatório bimestral,
  eleições de 2028 e 2030. Proposta: nenhum "diretor de drama" que injeta crise para manter a emoção.
  Semana calma existe e passa com um botão.
- **Tudo se explica:** cada acontecimento guarda a cadeia de quem fez e por quê (especificação §9.15).
- **O texto sai de vocabulário escrito,** e nunca de IA gerando efeito (ADR 0002).

## Como medir se ficou vivo

No `simulate`, uma sonda passiva, em que o jogador não faz nada por 48 meses, deve mostrar:

- acontecimentos por semana, por origem;
- 100% deles com autor;
- semanas quietas, mas não a maioria;
- sementes diferentes produzindo mundos diferentes.

## O que já existe e o que falta

- **Existe:** a decisão (A1 a A1.2), a crença por evidência (A2a), a reunião do corte e o elenco com
  ambição.
- **Falta, pela ordem do [mapa](migration-map.md):** os pedidos, as promessas e a memória entre pessoas
  (A3); o agendador (A5); o repertório por cargo; a passagem do acontecimento para a mesa, com o filtro
  da Casa Civil; os parlamentares individuais (D1).
- **A abertura já começa isso:** os ministros nomeados decidem pela VONTADE, e o presidente da Câmara
  vira uma pessoa no E1.0c.

## Decidido em 25/09

- **Sem diretor de drama:** o ritmo vem do calendário real e das pessoas.
- **A imprensa entra como atores com interesses próprios,** no lote 3.

## Lote 1, no jogo desde 25/09

- **Quem age:** 21 pessoas desde 26/09, com um líder por bloco dos 16 fora PML e PLI; no lote 1
  eram 14. São os porta-vozes de partido do elenco (o cacique da Mesa, o chefe
  do Senado, o relator do orçamento e os líderes de PCS, PTP, PDST e VANGUARDA; até 26/09, PTU, PSU,
  PSM e Livre) e os 7 ministros das
  pastas das áreas, nomeados ou interinos. O código está em `src/application/world.mjs`, e os
  parâmetros, todos [DESENHO], em `src/data/agency.mjs`.
- **O que querem:** o ministro quer a verba da pasta contra o nível da posse, a dignidade e o cargo.
  O porta-voz quer pastas na proporção da bancada, a verba das emendas, não se desgastar com governo
  impopular e a dignidade. A ambição dele (ministério, estado, sucessão, reeleição, tribunal) decide
  o peso de cada coisa.
- **O que podem fazer:** o ministro pede o programa cortado de volta, reclama em público ou pede
  demissão. O porta-voz pede pasta para um indicado do partido, ameaça votar com independência ou
  desembarca e entrega os cargos. Cada gesto é uma carta com autor, fala no tom da pessoa (educada,
  firme ou seca) e, quando é pedido, dois botões com preço.
- **O que aprendem:** a resposta do Presidente vira crença com qualidade 0,6: uma recusa ensina, mas
  não é certeza. O silêncio vale como recusa. Pedir tem preço: a chance de ouvir não fere a dignidade,
  e o orgulhoso para de pedir antes do humilde. A ameaça repetida vale menos a cada vez. Quem saiu
  espera ser chamado e só volta a pedir com o governo 15 pontos acima do neutro.
- **O que muda no mundo:** a pasta aceita senta o indicado no mês da resposta; o programa aceito
  volta ao nível da posse; o desembarque tira os ministros do partido e leva a bancada à obstrução; a
  demissão deixa a cadeira vaga.

## Lote 2, no jogo desde 25/09

- **Ideologia:** o desgaste de ficar na base cresce com a distância do partido ao governo, medida
  de 0 a 1 pela posição econômica e pela posição nas liberdades. Com peso 1 [DESENHO], o partido
  mais distante sente o dobro.
- **Oposição:** quem saiu critica um governo fraco em público, uma fala a cada 3 meses. A crítica
  é carta com autor.
- **Coro:** cada crítica do mês anterior soma 0,05 [DESENHO] ao desgaste de quem ficou.
- **Oportunidade:** a VONTADE ganhou o gatilho da especificação §9.14. Quem dorme acorda quando
  aparece um caminho que não existia no mês anterior.
- **Paciência e gratidão:** quem pediu espera 3 meses para pedir de novo. Quem foi atendido não
  ameaça nem sai por 3 meses.
- **Uma cadeira, um pedido:** um partido não pede a pasta que outro já pediu e espera resposta.

## O que a medida mostrou

Em 48 meses, com o simulador (`npm run simulate`, linha "a vida"), medido em 25/09 com o catálogo
de 9 partidos (PTU, PSU, PSM e Livre saíram dele em 26/09):

- **No lote 1, com o governo montado na posse** (`agenda`): 8 pedidos de pasta, 13 ameaças, 49 pedidos de verba,
  9 queixas públicas e 6 desembarques. O Partido Livre sai no mês 21; os outros saem juntos no mês
  44, agosto de 2030, com o governo impopular às vésperas da eleição. Nenhuma regra manda isso.
- **Sem ministério nenhum** (`--cabinet none`): os 7 partidos saem até o mês 5, e `agenda` aprova
  2 de 43 votações, contra 32 de 42 com o governo montado.
- **Defeitos achados pela medida e corrigidos:** ninguém aprendia (39 pedidos repetidos em 24
  meses); a ameaça repetida não perdia força; a verba não segurava ninguém; pedir não custava nada; o
  ministro não via o corte, porque a verba era medida contra o próprio pedido do governo.
- **No lote 2** (`agenda`): os 7 partidos saem nos meses 10, 20, 33, 37, 40, 41 e 41, e não mais 5
  de uma vez no mês 44 (achado 83, fechado). A oposição faz 34 críticas. `agenda` aprova 22 de 43
  votações, contra 32 de 42 no lote 1.
- **Defeitos do lote 2, achados pela medida e corrigidos:** quem saía ficava calado para sempre,
  porque a VONTADE não tinha o gatilho da oportunidade; dois partidos levavam a mesma cadeira; o
  partido ganhava a pasta e ameaçava ou saía no mês seguinte.
- **Em aberto:** nenhuma sonda segura a base até o fim do mandato (achado 86 do handoff).

## Os próximos lotes

- **Lote 3, imprensa e Casa Civil:** veículos com linha editorial investigam e publicam; vazamentos têm
  autor; o chefe da Casa Civil filtra o que chega à mesa.
- **Lote 4, calendário:** saída de ministros para disputar eleição, eleições de 2028 e 2030.
- **Lote 5, governadores, sindicatos e setores:** os grupos de pressão viram organizações que decidem.
- **Lote 6, os 594 parlamentares,** com o lote D1 do mapa.
