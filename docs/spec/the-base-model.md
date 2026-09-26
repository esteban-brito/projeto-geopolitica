# O modelo da base — desenho

Desenho de 26/09, aprovado na direção por ele no mesmo dia: cada deputado tem uma chance de votar
com o governo, e ela depende da distância ideológica, do ministério e da posição declarada do
partido. Calibrado pela [pesquisa 17](../research/17-how-the-base-forms.md). Nada implementado:
é a fase 2 do [ciclo 32](../cycles/32-the-new-interface.md) e espera ordem dele.

## 1. Por que mudar

| modelo           | largada de um Presidente com 42 deputados                                                                       | o que erra                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| jogo de hoje     | 440 de 513: todo partido nasce com lealdade 70, e a lealdade 0 ainda vota em 50% das vezes                      | oposição votando com o governo; nenhum Presidente real começou assim                            |
| protótipo        | 42: só o próprio partido, e cada pasta acende uns 14                                                            | ninguém fora da base vota; na vida real, partido sem pasta vota com o governo até 93% das vezes |
| **este desenho** | votos firmes (chance de 80% ou mais) e prováveis (a soma das chances); no protótipo, 149 firmes e 374 prováveis | —                                                                                               |

Os fatos que o desenho tem de reproduzir, todos da pesquisa 17:

- nenhum partido presidencial de 2003 a 2023 começou com maioria própria (o maior foi o PT, 90);
- partido com ministério vota com o governo entre 67% e 95% das vezes (2023);
- partido sem ministério e fora da oposição, entre 65% e 93% (2019 e 2023);
- oposição, entre 12% e 32% (2019 e 2023);
- apoio médio da Câmara nos oito primeiros meses, entre 63,6% (Dilma 2015) e 81,3% (Lula 2003);
- a presença no gabinete tem efeito robusto no voto; o das emendas individuais é contestado.

## 2. As peças

- **Chance do partido.** Um número de 0 a 1: a fração de votações com orientação do governo em
  que a bancada acompanha. É o que a pesquisa mede, e é o que a tela mostra;
- **três entradas movem a chance:** a distância entre o partido e o governo no diagrama de
  Nolan (as coordenadas `economic` e `liberty` que o catálogo já tem); a parte do gabinete que o
  partido recebe, comparada com o tamanho da bancada; e a posição declarada (base, independente
  ou oposição);
- **a posição declarada é decisão do partido,** tomada pelo líder dele pelo motor de vontade
  (VONTADE): na posse, ao receber ou perder pasta, e quando a popularidade cai. Romper é um fato
  com data, como o PMDB em 29/3/2016;
- **a chance de cada deputado varia em torno da do partido,** sorteada da semente e nunca
  guardada. Um partido de 67% tem gente que vota sempre e gente que quase nunca vota. Os
  partidos heterogêneos, como o União Brasil de 2023, espalham mais;
- **a lealdade continua sendo o estado.** O jogo já guarda a lealdade de 0 a 100 por partido. O
  que muda é o mapa de lealdade para chance (hoje `moodFactor`, com piso de 50%), a largada (hoje
  70 para todos) e o puxão da pasta (hoje 10% da distância até 80 por mês).

## 3. A calibragem

Faixas de partida, todas [DESENHO] dentro dos limites medidos; os números finais saem de rodadas
de `npm run simulate` comparadas com os fatos do §1:

| situação                                    | faixa de chance                                  | âncora                                          |
| ------------------------------------------- | ------------------------------------------------ | ----------------------------------------------- |
| o partido do Presidente                     | 85% a 95%                                        | PSL 85,4% (2019); federação do PT 95,5% (2023)  |
| perto no Nolan, sem pasta, fora da oposição | 65% a 85% (miolo da faixa medida, que vai a 93%) | Podemos 92,9%, PSDB 81,8%, PP 67,4% (2019)      |
| com pasta                                   | 67% a 95%                                        | União Brasil 67,1%, PSD 83,3%, PSB 91,2% (2023) |
| oposição declarada                          | 12% a 32%                                        | PSOL 11,7%, PT 13,1% (2019); PL 31,9% (2023)    |

Sem prazo medido para a reação a uma pasta (a pesquisa não achou estudo causal), o ritmo do puxão
fica [DESENHO] e declarado assim na tela.

## 4. O que a tela mostra

- cada deputado num de três tons: **quase certo** (chance de 80% ou mais), **provável** (de 50% a
  80%) e **improvável** (abaixo de 50%). Os cortes são [DESENHO];
- o placar principal são os **votos firmes**, deputados com chance de 80% ou mais, comparados com
  257 e 308; ao lado, os **prováveis**, a soma das chances numa votação comum. A média real de
  apoio (64% a 81%, pesquisa 17) mede votações comuns, e com ela a largada já passaria de 257: é o
  voto firme que decide emenda e reforma, e é ele que a pasta compra. Tudo com a palavra estimativa;
- a prévia de uma nomeação pergunta ao motor a chance que o partido teria com aquela pasta, pela
  mesma função que o mês usa;
- a etiqueta do partido mostra a chance em número e a posição declarada.

## 5. Onde mexe no código

- `src/domain/congress` (ECLUSA): o mapa de lealdade para chance, a largada pela distância e o
  puxão da pasta. As votações de projeto (`whipCount`) seguem medindo a distância até o projeto;
- `src/domain/actors` (VONTADE): a decisão de posição do partido;
- `src/application`: a composição das duas e a consulta de prévia para a tela;
- `src/state`: a posição declarada entra no estado, com versão nova do save.

## 6. Provas que nascem antes

- um Presidente de partido pequeno ou de centro começa abaixo de 257 votos firmes;
- os prováveis na largada de um Presidente de centro ficam entre 60% e 82% da Câmara (âncora:
  63,6% a 81,3%, Poliarco);
- nenhum partido de oposição declarada passa de 35% de chance na largada;
- um partido perto do governo, sem pasta, fica entre 65% e 93%;
- dar pasta sobe a chance e nunca a leva a 100%;
- a soma das chances por deputado bate com a soma por partido;
- a série de `npm run simulate` reescrita no handoff, com a base do mês 1 dentro das faixas.
