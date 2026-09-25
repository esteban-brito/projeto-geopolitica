# O mundo vivo — a "IA" do jogo

> Proposta, versão 0, 25/09/2026, a pedido dele: revisar a "IA" do jogo e quão vivo ele será.
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

## Decisões dele

- **Sem diretor de drama:** o ritmo vem só do calendário real e das pessoas?
- **A imprensa como atores com interesses próprios,** que decidem o que investigar e publicar?
