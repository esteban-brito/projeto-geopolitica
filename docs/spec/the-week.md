# A semana de governo

> **Situação:** vigente — desenho aprovado em 25/09; ainda não implementado.

> Versão 1, 25/09/2026. Decisões dele numa conversa sobre jogabilidade; detalha o loop "semana a
> semana" do [jogo em uma página](../archive/game-in-one-page-2026-09-25.md) e a especificação mestra §4 e §5. Marcas da
> [gramática](rules-grammar.md): [VERIFICADO], [DESENHO], FALTA.

## O relógio

- **O botão avança uma semana.** Dentro dela há 7 dias, cada um com três turnos: manhã, tarde e
  noite (decisão dele).
- **O jogador marca compromissos nos turnos.** O que ocupa cada turno:
  - reunião no Planalto, com ministro, governador, líderes, empresários, sindicato: 1 turno;
  - viagem a um estado (obra, tragédia, evento): o dia inteiro;
  - jantar político no Alvorada, onde se negocia voto: a noite;
  - entrevista ou fala à imprensa: 1 turno;
  - reunião com todos os ministros: meio dia.
- **Os custos de cada compromisso são [DESENHO]** até a medição da agenda real (FALTA: o site do
  Planalto publica a agenda do dia, mas bloqueia leitura automática; medir no navegador).
- **Algumas coisas já vêm marcadas:** votação agendada, prazo legal, reunião do Banco Central, datas
  nacionais.

## Quem está disponível

- **O Congresso vota de terça a quinta.** Medido nos dados abertos da Câmara, de fevereiro de 2025 a
  24/09/2026: 3.356 votações em plenário, em 169 dias; terça 57 dias, quarta 54, quinta 39, segunda
  17, sexta 2, sábado e domingo nenhum. De terça a quinta são 89% dos dias [VERIFICADO]. No jogo,
  deputados e senadores estão em Brasília de terça a quinta, às vezes na segunda, e nos estados no
  resto da semana. O Senado ainda não foi medido (FALTA).
- **Visitar estados** cabe melhor de sexta a segunda.

## A agenda é pública

O Planalto publica todo dia a agenda do Presidente. No jogo, quem ele recebe vira sinal: cada grupo
lê o encontro do seu jeito.

## O telefone

- **Receber ligações:** chegam como assuntos na mesa, que a Casa Civil filtra.
- **Ligar:** sem limite fixo (decisão dele). Três freios, aceitos por ele em 25/09:
  - **o tempo:** uma rodada de ligações ocupa um turno, e nela cabem várias pessoas;
  - **o peso:** a ligação vale menos que o encontro; serve para pedir, pressionar ou acalmar, e não
    fecha acordo grande, que pede encontro;
  - **o desgaste:** ligações seguidas para a mesma pessoa perdem efeito e começam a irritar.
- **No motor:** o peso é a qualidade da evidência na crença (A2a); o acordo grande é regra dos
  compromissos (A3); o desgaste é a memória de cada pessoa. Os números são [DESENHO].

## O que acontece com o que o Presidente não cuidou

1. **A Casa Civil filtra.** Na mesa aparece o que o chefe da Casa Civil, nomeado na posse, mandou
   subir. Um bom mostra o que importa; um fraco ou desleal deixa uma crise escondida.
2. **Cada assunto tem um dono, o ministro da área,** que decide pela VONTADE, com a personalidade e
   a lealdade dele. Sem gastar turno, o Presidente pode deixar uma orientação de uma linha: segure,
   resolva do seu jeito, me traga de novo.
3. **Os prazos da lei correm sozinhos.** Lei aprovada tem 15 dias úteis para sanção ou veto, e o
   silêncio é sanção (CF, art. 66 §§1º e 3º, [VERIFICADO]); a medida provisória cai em 120 dias sem
   contar o recesso (CF, art. 62).
4. **As pessoas lembram** quem não foi recebido.
5. **A crise ignorada cresce:** do ministério ao jornal, do jornal ao Congresso, do Congresso à
   Justiça. Cada degrau encarece a solução.
6. **O Vice pode ir no lugar do Presidente** em eventos e viagens (decisão dele). O Presidente
   economiza o dia; o Vice ganha visibilidade, e ele tem ambição própria.

## No motor

A semana como unidade é a trilha B do [mapa de migração](migration-map.md) (B1 a B6). Os
compromissos são ações do vocabulário da especificação (§12.5); as pessoas decidem pela VONTADE; a
orientação de uma linha é uma ação do Presidente para o ministro.
