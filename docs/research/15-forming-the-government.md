# Pesquisa 15 — montar o governo: ministérios, aliados e a eleição da Mesa

> Consulta em 25/09/2026, feita pelo Claude nas fontes oficiais: Planalto (Constituição, Lei
> 14.600/2023, MPs 870/2019 e 1.154/2023), Regimento Interno da Câmara (texto atualizado no site da
> Câmara), Regimento Interno do Senado (edição de 2018, no site do Senado) e dados abertos da
> Câmara. Atende à abertura do jogo, decidida por ele em 25/09: o jogo começa com o jogador montando
> o governo. Marcas da [gramática](../spec/rules-grammar.md).

## O que muda no desenho

1. **São 38 cadeiras de ministro, e o Presidente nomeia e demite quem quiser**, desde que seja
   brasileiro, maior de 21 anos e com direitos políticos.
2. **Reorganizar os ministérios no primeiro dia é real.** Os dois últimos presidentes fizeram isso
   por medida provisória em 1º de janeiro, e o Congresso converteu as duas em lei.
3. **A eleição do presidente da Câmara, em 1º de fevereiro, é a segunda grande jogada.** Quem vence
   monta a pauta de cada mês e decide se recebe um pedido de impeachment. É a pessoa que falta ao
   afastamento do jogo, que hoje abre sozinho quando três limiares coincidem (mapa, §1).
4. **Dar um ministério a um partido não compra votos garantidos.** O quanto cada partido vota com
   o governo se mede com dado oficial: a Câmara publica, em cada votação, a orientação do governo e
   o voto de cada deputado.
5. **O Congresso de 2027 ainda não existe.** Ele sai da eleição de 4 de outubro de 2026. As
   cadeiras do jogo são as de hoje e se atualizam depois do resultado.

## 1. Os ministros

| fato                                                                                                                                                                                | fonte                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| o Presidente nomeia e exonera os ministros                                                                                                                                          | VERIFICADO: CF, art. 84 I                                              |
| ministro é brasileiro, maior de 21 anos, no exercício dos direitos políticos                                                                                                        | VERIFICADO: CF, art. 87                                                |
| a lei cria e extingue ministérios; por decreto, só a organização que não aumenta despesa nem cria ou extingue órgão                                                                 | VERIFICADO: CF, arts. 48 XI, 84 VI "a" e 88                            |
| são 32 ministérios: 31 na lista original e o do Empreendedorismo, incluído em 2024; a Controladoria-Geral da União conta entre eles                                                 | VERIFICADO: [Lei 14.600/2023][l14600], art. 17                         |
| têm status de ministro também: Casa Civil, Secretaria-Geral, Relações Institucionais, Comunicação Social, Gabinete de Segurança Institucional e Advocacia-Geral da União. Total: 38 | VERIFICADO: Lei 14.600/2023, art. 2º e a lista dos Ministros de Estado |
| 1º/01/2019: a MP 870 reorganizou os ministérios; virou a Lei 13.844/2019                                                                                                            | VERIFICADO: [MP 870][mp870]                                            |
| 1º/01/2023: a MP 1.154 reorganizou de novo; virou a Lei 14.600/2023                                                                                                                 | VERIFICADO: [MP 1.154][mp1154]                                         |
| a posse de 2027 é em 5 de janeiro                                                                                                                                                   | VERIFICADO: achado 70 do handoff (EC 111/2021)                         |

Os 32 ministérios, pela ordem da lei: Agricultura e Pecuária; Cidades; Cultura; Ciência,
Tecnologia e Inovação; Comunicações; Defesa; Desenvolvimento Agrário e Agricultura Familiar;
Integração e Desenvolvimento Regional; Desenvolvimento e Assistência Social, Família e Combate à
Fome; Direitos Humanos e Cidadania; Fazenda; Educação; Empreendedorismo, Microempresa e Empresa de
Pequeno Porte; Esporte; Gestão e Inovação em Serviços Públicos; Igualdade Racial; Desenvolvimento,
Indústria, Comércio e Serviços; Justiça e Segurança Pública; Meio Ambiente e Mudança do Clima; Minas
e Energia; Mulheres; Pesca e Aquicultura; Planejamento e Orçamento; Portos e Aeroportos; Povos
Indígenas; Previdência Social; Relações Exteriores; Saúde; Trabalho e Emprego; Transportes;
Turismo; Controladoria-Geral da União.

## 2. A eleição da Mesa

| fato                                                                                                                                                                                                 | fonte                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| cada Casa elege a sua Mesa a partir de 1º de fevereiro do primeiro ano da legislatura, para 2 anos, sem recondução ao mesmo cargo na eleição seguinte                                                | VERIFICADO: CF, art. 57 §4º                              |
| na Câmara, a eleição é em 1º de fevereiro; mandato em outra legislatura não conta como recondução                                                                                                    | VERIFICADO: [RICD][ricd], art. 5º                        |
| na Câmara, o voto é secreto e eletrônico: maioria absoluta (257) no primeiro turno; se ninguém chegar lá, segundo turno entre os dois mais votados, por maioria simples, com metade da Casa presente | VERIFICADO: RICD, art. 7º                                |
| os demais cargos da Mesa se repartem entre os partidos e blocos pela proporção de cadeiras                                                                                                           | VERIFICADO: RICD, art. 7º I                              |
| empate: vence o mais velho entre os de mais legislaturas                                                                                                                                             | VERIFICADO: RICD, art. 7º IV                             |
| no Senado, o voto é secreto, exige maioria de votos com a maioria dos senadores presente; o Presidente é eleito num escrutínio só dele                                                               | VERIFICADO: [RISF][risf] (edição de 2018), arts. 59 e 60 |
| no Senado, a maioria absoluta de 41 votos                                                                                                                                                            | PARCIAL: nota da assessoria do Senado                    |
| a recondução foi julgada pelo STF na ADI 6524, em dezembro de 2020                                                                                                                                   | PARCIAL: citada em nota do RISF                          |
| o presidente do Senado preside o Congresso                                                                                                                                                           | VERIFICADO: CF, art. 57 §5º                              |
| na falta do Presidente e do Vice, assumem o presidente da Câmara, o do Senado e o do STF, nessa ordem                                                                                                | VERIFICADO: CF, art. 80                                  |

## 3. O que o presidente da Câmara controla

- **A pauta:** organiza a agenda do mês seguinte, ouvidos os líderes, e designa a ordem do dia
  (VERIFICADO: RICD, art. 17, alíneas "s" e "t").
- **O impeachment:** qualquer cidadão pode denunciar o Presidente por crime de responsabilidade. O
  presidente da Câmara recebe ou não a denúncia; se recusar, cabe recurso ao plenário. Recebida, ela
  vai a uma comissão especial com todos os partidos (VERIFICADO: RICD, art. 218 §§2º e 3º).

## 4. Os aliados

- **O líder do governo:** o Presidente indica um deputado como líder e mais 20 vice-líderes
  (VERIFICADO: RICD, art. 11).
- **A medida do apoio:** os dados abertos da Câmara dão, em cada votação, a orientação do governo
  e o voto de cada deputado com o partido. Exemplo conferido: na votação 2611313-31, de
  03/09/2026, o governo orientou "sim" e 396 votos nominais estão registrados (VERIFICADO:
  [dados abertos][dados]). Com isso se calcula quanto cada partido vota com o governo. É a
  calibragem da troca "ministério por voto", camada B da gramática; a conta ainda não foi feita
  (FALTA).
- **Quantas pastas cada partido teve em cada governo:** sem fonte oficial achada (FALTA).

## 5. O calendário que o jogo herda

- **A eleição geral é no primeiro domingo de outubro,** e o segundo turno no último (VERIFICADO:
  CF, art. 77). Em 2026, o primeiro turno cai em 4 de outubro.
- **O Senado se renova por um e dois terços, alternadamente,** a cada quatro anos (VERIFICADO: CF,
  art. 46 §2º). Em 2026 são dois terços, 54 cadeiras (conta).
- **As cadeiras do jogo** (`src/data/parties.mjs`: 9 blocos, 513 cadeiras, o maior com 145) são
  as de hoje e se atualizam com o resultado oficial (FALTA até outubro).

## 6. O que isso muda no jogo

- **A abertura tem duas decisões grandes:** quem vai para cada ministério, e quem você apoia para
  presidir a Câmara e o Senado. As duas decidem a força do governo pelo resto do mandato.
- **As 38 cadeiras existem todas.** Na primeira versão, pesam mais as pastas ligadas às 8 áreas do
  jogo, a Fazenda, o Planejamento, a Casa Civil e as Relações Institucionais. As outras servem de
  moeda para os aliados, com peso [DESENHO] até ganharem conteúdo.
- **Reorganizar os ministérios é uma ação** (`CREATE`, `ABOLISH`, `MERGE`) pela rota
  `PROVISIONAL_MEASURE`, com os precedentes de 2019 e 2023.
- **O presidente da Câmara é uma pessoa** (VONTADE): decide a pauta e o impeachment pelo que quer e
  pelo que sabe. O jogador pode apoiar, negociar ou enfrentar.
- **O voto de cada deputado na eleição da Mesa é secreto.** Até os deputados individuais do lote D1,
  a eleição corre por bancada na ECLUSA, e a traição secreta entra como [DESENHO].

[l14600]: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14600.htm
[mp870]: https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2019/mpv/mpv870.htm
[mp1154]: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/mpv/mpv1154.htm
[ricd]: https://www2.camara.leg.br/legin/fed/rescad/1989/resolucaodacamaradosdeputados-17-21-setembro-1989-320110-normaatualizada-pl.html
[risf]: https://www25.senado.leg.br/documents/12427/45868/RISF+2018+Volume+1.pdf/cd5769c8-46c5-4c8a-9af7-99be436b89c4
[dados]: https://dadosabertos.camara.leg.br/api/v2/votacoes/2611313-31/orientacoes
