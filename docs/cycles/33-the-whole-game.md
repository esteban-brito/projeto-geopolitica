# Ciclo 33 — O jogo inteiro

> Ordem do Diretor do Jogo em 26/09/2026. **Situação: aprovado por ele em 26/09; é o plano em vigor.**
> A decisão 10 (retratos) segue aberta. Ele absorve, sem apagar, os lotes A1–F e
> E1.0a–E1.8 do [mapa de migração](../spec/migration-map.md) §6 e as fases do
> [ciclo 32](32-the-new-interface.md). Cada peça tem etapa neste documento.
> A régua são as [partidas-teste de Xi e Lee](../spec/the-test-playthroughs.md). Uma partida
> inspirada em Milei pode entrar depois, se ele ordenar. Ela não faz parte deste aceite.

> **Atualização de escopo — 29/09:** a etapa 1 incorpora a direção de
> [governo variável](../spec/dynamic-government.md) e do [piloto](../archive/government-pilot-2026-09-30.md).
> As 38 cadeiras descrevem a abertura; não limitam estruturas posteriores. Preparo depende de
> experiências conhecidas e trabalho vigente, sem especialistas perfeitos garantidos por pasta.
> A [auditoria dos planos](../archive/plan-audit-2026-09-29.md) registra contratos e dependências a fechar; suas
> propostas não substituem a ordem de etapas aprovada pelo Diretor.

## 1. O jogo e seus pilares

Você preside o Brasil real, tenta transformá-lo, paga os custos e vê o que de fato mudou.

- **Brasil real e fiel.** Constituição, calendário, caixa e competências têm fonte. Pessoas e empresas
  jogáveis têm nomes inventados, conforme ADR 0003 citado em [CLAUDE.md](../../CLAUDE.md).
- **Tudo tem preço.** Mesmo uma tentativa fora da lei chega a destinatários que podem obedecer,
  recusar, denunciar ou reagir. Não existe resposta automática de “proibido”.
- **A cadeia é visível.** QUERER ≠ PROPOR ≠ APROVAR ≠ PROMULGAR ≠ EXECUTAR ≠ CONSOLIDAR.
  Uma mudança consolidada ainda pode ser revertida ([jogo em uma página](../spec/game-in-one-page.md)).
- **A resistência tem autor.** Quem perde usa os recursos, a informação e a competência que possui.
  A VONTADE decide por pessoa; um índice agregado não vota, processa nem comanda tropas.
- **Pessoas têm rosto.** Deputados, ministros, juízes, jornalistas e governadores falam e decidem
  conforme sua posição, sua memória e o que souberam.
- **A tela pergunta ao motor.** A previsão usa a mesma função da resolução, filtrada pela visão
  presidencial. O estado oculto não aparece como certeza.

As [partidas-teste](../spec/the-test-playthroughs.md) têm três degraus: poder dentro da
Constituição, erosão por leis e emendas, e ruptura por tentativa fora da lei. Lee testa a
profundidade econômica e administrativa. Xi testa instituições e força. Juntas cobrem as rotas
que este plano precisa entregar. Cada fio deve ter decisão, reação e resultado no jogo.

## 2. Estrutura da partida e jogabilidade

### Relógios e começo

- O mandato dura quatro anos: começa em **5 de janeiro de 2027** e termina em **4 de janeiro de
  2031** (CF, art. 82, com a EC 111/2021). O jogo hoje fecha um turno por mês.
- O fechamento mensal atualiza orçamento, economia, execução e opinião. O registro preserva o que
  cada ator sabia antes de cada decisão. O mês não antecipa divulgação de dado público (lote C3).
- A semana organiza a agenda, crises e prazos. São três turnos por dia, conforme
  [a semana](../spec/the-week.md). B1, B3, B4 e B6 trazem esse relógio sem perder o fechamento mensal.
- O momento é uma decisão em cena. A agenda mostra o que exige atenção; outros atores agem mesmo
  quando o Presidente escolhe outro assunto. Não há ponto abstrato de ação.
- A criação pede nome, tratamento, nascimento, sexo, uma das seis trajetórias e um dos 16 partidos
  ([ciclo 32](32-the-new-interface.md) §6b; [partidos](../spec/the-parties.md)). Candidatura exige
  brasileiro nato, filiação partidária e 35 anos (CF, arts. 12 e 14).
- A posse oferece a estrutura dos ministérios, nomes para as pastas e a formação da base. O
  [protótipo da posse](../spec/the-posse-port.md) fixa o hemiciclo sem abas; o motor ainda precisa
  da calibragem da base descrita no ciclo 32, fase 2.
- A eleição das Mesas ocorre em **1º de fevereiro de 2027** (CF, art. 57 §4º). O apoio presidencial
  muda a disputa, mas os parlamentares votam. A lua de mel é uma janela política, não um bônus
  fixo: a base, a opinião e os primeiros custos determinam sua duração ([jogo em uma página](../spec/game-in-one-page.md)).

### Calendário que altera decisões

| data ou janela                    | fato jogável                               | fundamento e consequência                                                                                                                               |
| --------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5 jan 2027                        | posse presidencial                         | CF, art. 82, EC 111/2021; começa a agenda e o mandato.                                                                                                  |
| 6 jan 2027                        | posse dos 27 governadores                  | EC 111/2021; começam relações e compromissos estaduais.                                                                                                 |
| 1º fev 2027                       | eleição das Mesas                          | CF, art. 57 §4º; presidências controlam pauta e recebimento de denúncia.                                                                                |
| 2 fev–17 jul; 1º ago–22 dez       | sessões ordinárias anuais                  | CF, art. 57; B4 conta dias de sessão e recesso.                                                                                                         |
| até 15 abr                        | envio anual da LDO                         | ADCT, art. 35 §2º; atraso cria disputa orçamentária.                                                                                                    |
| até 31 ago                        | envio anual da PLOA; PPA no primeiro ano   | ADCT, art. 35 §2º; a proposta passa pelo Congresso.                                                                                                     |
| até 60 dias da abertura da sessão | contas do exercício anterior ao Congresso  | CF, art. 84 XXIV; TCU examina e Congresso julga.                                                                                                        |
| 1º fev 2029                       | nova eleição das Mesas                     | a CF, art. 57 §4º, fixa só a de 2027; a de 2029 segue os regimentos: VERIFICAR data. A pauta e os acordos podem mudar.                                  |
| 1º e 29 out 2028                  | eleição municipal e eventual segundo turno | CF, art. 29 II; o IBGE conta 5.570, e o Distrito Federal e Fernando de Noronha não elegem prefeito: VERIFICAR total vigente antes de carregar catálogo. |
| 6 e 27 out 2030                   | eleição geral e eventual segundo turno     | CF, art. 77; renovam-se 513 cadeiras da Câmara e um terço do Senado, 27 cadeiras: CF, arts. 45, 46 §§1º–2º, e 77.                                       |

O calendário inclui também recessos, prazos de medida provisória, votações, relatórios bimestrais,
vagas institucionais e obras. Cada prazo nasce de fonte jurídica ou recebe **VERIFICAR** antes de
virar regra. A pesquisa R2 do [mapa](../spec/migration-map.md) §6.2 confere divulgações e sessões.

### Pressão inicial, finais e balanço

O partido inicial muda o custo da coalizão. No protótipo, o PLI começa com 1 voto firme e o PCN
com 205 ([journal](../journal.md), entrada 93); a regra está no [modelo da base](../spec/the-base-model.md).
A trajetória altera confiança e acesso conforme o [ciclo 32](32-the-new-interface.md) §6b. A
semente altera elenco e eventos; cada sorteio registra a posição consumida. Nenhuma trajetória
garante vitória ou bloqueia ação.

A partida pode terminar no prazo constitucional, por renúncia, impeachment ou ruptura consolidada
ou fracassada. Uma ruptura fracassada pode levar a prisão ou exílio, conforme decisões de atores
competentes e fatos registrados. A reeleição em 2030 segue a CF, art. 14 §5º. A continuidade num
segundo mandato depende da decisão 4 do §11.

O balanço compara fatos medidos a 2027: economia, serviços, direitos, instituições e distribuição
de poder. Ele separa mudança anunciada, aprovada, executada, observada e consolidada. Mostra o
regime praticado ([especificação mestra](../spec/master-spec.md) §17.3–17.4) e os efeitos que
amadurecem depois de 2030, como moradia e investimento da partida Lee. O jogo apresenta esses
resultados; o jogador os julga.

### Exemplo: um mês da partida Xi

**[DESENHO: sequência de jogo, sem resultado pré-fixado.]** O Presidente abre o Gabinete e vê um
relatório de integridade. Em Governo, ele publica um decreto de conduta para diárias, aviões e
presentes (CF, art. 84 VI a; fio Xi 1). Em Dinheiro, ele propõe verba para CGU e PF na LOA.
Em Instituições, ele consulta a chefia da PF e nomeia um delegado de classe especial para a
direção-geral (Lei 9.266/1996, art. 2º-C). Em Congresso, ele negocia relatoria e pastas para
formar a maioria de uma PEC (CF, art. 60 §2º; fio Xi 3). Em Correspondência, responde ao líder
com uma proposta de emendas sujeita à LOA. Essas são cinco ações da sequência [DESENHO].

O líder pode condicionar o apoio; um delegado pode defender autonomia; jornalistas podem apurar
o uso da PF. A VONTADE decide a reação a partir da informação recebida. O fechamento do mês paga
a verba que venceu o rito, registra o estágio da PEC e atualiza a estimativa da base. A votação,
a investigação e o custo fiscal podem ficar para o mês seguinte. A tela não atribui à PEC um
efeito que ainda não foi executado.

### Exemplo: um mês da partida Lee

**[DESENHO: sequência de jogo, sem resultado pré-fixado.]** O Presidente abre País e vê a fila de
moradia e o indicador divulgado. Em Governo, ele escolhe dirigentes técnicos para a estatal,
respeitando a Lei 13.303/2016, art. 17. Em Compositor, propõe um programa de moradia e uma
alteração do FGTS por lei (Lei 8.036/1990, art. 15; Lei 14.620/2023). Em Congresso, negocia o
texto e o custo. Em Federação, pede a um prefeito terreno e zoneamento (CF, art. 30 VIII). Em
Eleições, consulta a previsão mensal de 2028. Essas são cinco ações da sequência [DESENHO].

Empregadores reagem ao custo do FGTS; prefeitos podem aceitar ou pedir contrapartida; a base pode
preferir cargos políticos. O mês fecha com despesa autorizada, capacidade de execução e pesquisa
publicada. Casa nenhuma aparece como entregue antes de terreno, contrato, obra e medição. A obra,
o efeito sobre a eleição e o legado ficam para os meses seguintes (fios Lee 2, 3 e 6).

## 3. Catálogo de ações jogáveis

Cada linha é uma intenção. O compositor oferece as rotas permitidas pelo objeto e calcula custo,
quórum, prazo, órgão e risco com o resolvedor da [especificação](../spec/master-spec.md) §13.11.
“Quem trava” indica uma decisão de ator ou um rito que pode falhar. O jogador ainda pode tentar
uma ordem fora da competência, com a cadeia descrita ao fim desta seção. Números de checklist
apontam para o [checklist presidencial](../spec/presidential-checklist.md). Etapa é §6.

### A. Governo

| ação                                                                         | rota                                                                                                                                                                                                | quem pode travar                                     | checklist | etapa |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | --------- | ----- |
| Nomear ou exonerar os 38 ministros                                           | nomeação; CF, arts. 84 I e 87; Lei 14.600/2023                                                                                                                                                      | indicado pode recusar; partido pode sair da base     | 1, 5      | 1     |
| Criar, fundir, extinguir ou dividir ministério                               | MP ou lei, CF, arts. 61 §1º II e, e 88; decreto não cria nem extingue órgão, art. 84 VI a                                                                                                           | Congresso pode derrubar a MP; coalizão pode romper   | 2         | 1, 4  |
| Nomear estatais, agências e cargos                                           | nomeação ou ato de gestão; Lei 13.303/2016, art. 17                                                                                                                                                 | conselho, filtros legais, indicado e TCU             | 3         | 3, 5  |
| Nomear diretor-geral da PF                                                   | nomeação entre delegados de classe especial; Lei 9.266/1996, art. 2º-C                                                                                                                              | indicado, carreira e controle judicial               | 3, 22     | 5     |
| Regulamentar lei e organizar conselho ou secretaria sem órgão novo nem gasto | decreto dentro da competência; CF, art. 84 IV e VI a                                                                                                                                                | Congresso por decreto legislativo, Justiça, gestores | 4         | 4, 5  |
| Reformar o gabinete no mandato                                               | nomeação, MP ou lei conforme a mudança; CF, arts. 84 I e 88                                                                                                                                         | partido, Congresso, ministros atingidos              | 1, 2      | 1, 4  |
| Pedir salário de ministro e propor o de carreira                             | ministro: decreto legislativo, competência exclusiva do Congresso, sem sanção, CF, art. 49 VIII; carreira: lei de iniciativa do Presidente, art. 61 §1º II a; acima do teto do STF, PEC, art. 37 XI | Congresso, teto do STF, servidores e imprensa        | 41        | 4, 9  |
| Abrir concurso e formar carreira                                             | ato de gestão e lei orçamentária; CF, art. 37 II                                                                                                                                                    | orçamento, órgãos executores e Congresso             | 33        | 9     |

### B. Congresso

| ação                              | rota                                                                                             | quem pode travar                                       | checklist | etapa |
| --------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | --------- | ----- |
| Oferecer pastas, cargos e emendas | influência e atos de gestão; CF, art. 166                                                        | líder, deputado, regras das emendas e caixa            | 5, 12     | 1, 4  |
| Designar líder do governo         | nomeação política; RICD, art. 11                                                                 | bancada e líder indicado                               | 6         | 1     |
| Apoiar candidato à Mesa           | influência; CF, art. 57 §4º                                                                      | deputados ou senadores em voto secreto                 | 7         | 4     |
| Propor PL ou PLP                  | proposta; PLP pede 257 deputados e 41 senadores, CF, art. 69                                     | relator, Mesa, Câmara, Senado e sanção                 | 8         | 4     |
| Propor PEC                        | proposta; 308 deputados e 49 senadores em dois turnos em cada Casa, CF, art. 60 §2º              | Mesas, plenários e STF em controle posterior           | 8         | 4, 5  |
| Editar MP                         | MP; 60 + 60 dias, parados no recesso; pauta sobrestada no 46º dia; CF, art. 62 §§3º, 4º, 6º e 7º | Congresso, vedações do art. 62 §1º e STF               | 10        | 3, 4  |
| Pedir urgência constitucional     | proposta; 45 dias por Casa, CF, art. 64                                                          | Câmara, Senado e condições do projeto                  | 9         | 4     |
| Sancionar ou vetar                | ato presidencial em 15 dias úteis, CF, art. 66 §1º                                               | veto cai com 257 deputados e 41 senadores, art. 66 §4º | 11        | 4     |
| Negociar texto, relator e pauta   | influência e protocolo social                                                                    | relator, Mesa, partidos e parlamentares                | 5, 8      | 4     |
| Pedir lei delegada                | proposta ao Congresso; CF, art. 68                                                               | Congresso delimita ou recusa a delegação               | 36        | 4     |
| Pedir plebiscito ou referendo     | influência; CF, art. 49 XV; Lei 9.709/1998                                                       | Congresso decide convocação                            | 29        | 4     |

### C. Dinheiro

| ação                               | rota                                                     | quem pode travar                               | checklist | etapa |
| ---------------------------------- | -------------------------------------------------------- | ---------------------------------------------- | --------- | ----- |
| Enviar PPA, LDO e LOA              | proposta orçamentária; CF, arts. 84 XXIII e 165          | Congresso, restrições fiscais e execução       | 13        | 4     |
| Distribuir gasto e contingenciar   | ato de gestão dentro da LOA e da LRF                     | vinculações, receita, ministros, Congresso     | 14, 15    | 3, 4  |
| Abrir crédito                      | lei ou MP conforme o crédito; CF, art. 167 V e §3º       | Congresso, requisito de urgência e caixa       | 14, 17    | 4     |
| Alterar tributo                    | lei; decreto só nos casos da CF, arts. 153 §1º e 177 §4º | Congresso, Judiciário, contribuintes           | 16        | 4, 5  |
| Criar subsídio                     | lei, MP ou orçamento com fonte de custeio                | Congresso, LASTRO, TCU e beneficiários rivais  | 17        | 3, 4  |
| Alterar mínimo e programas sociais | lei com impacto recorrente; CF, art. 7º IV               | Congresso, orçamento, beneficiários            | 18        | 9     |
| Pagar emendas aprovadas            | execução da LOA; CF, art. 166                            | disponibilidade, impedimento técnico, controle | 12        | 4     |

### D. Economia e Estado empresário

| ação                                           | rota                                                                                                                                     | quem pode travar                                                     | checklist | etapa |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------- | ----- |
| Orientar, vender ou comprar estatal            | gestão, lei ou MP conforme ativo e controle; Lei 13.303/2016                                                                             | diretoria, Congresso, TCU, CADE, Justiça, minoritários               | 19        | 3     |
| Privatizar ou conceder serviço                 | lei, PND e atos de execução; Lei 9.491/1997                                                                                              | Congresso, TCU, Justiça, comprador, trabalhadores                    | 20        | 3     |
| Usar BNDES, BNDESPar, Caixa e Banco do Brasil  | orientação e decisões de seus órgãos; limites legais e balanços separados                                                                | diretoria, risco de crédito, TCU, caixa                              | 32        | 3, 9  |
| Criar moradia e alterar FGTS                   | lei; Lei 8.036/1990, art. 15, contribuição de 8% do empregador; Lei 14.620/2023                                                          | Congresso, empregadores, Caixa, prefeitos                            | 42        | 9     |
| Desapropriar terreno                           | decreto e indenização prévia em dinheiro, CF, art. 5º XXIV; pagar terreno urbano ocioso em títulos é poder do prefeito, art. 182 §4º III | proprietário, juiz e orçamento; o prefeito decide o caso do art. 182 | 42        | 9     |
| Atrair investimento e abrir zona de exportação | gestão da ApexBrasil e rito da Lei 11.508/2007                                                                                           | empresas, governos locais e órgão licenciador                        | 43        | 9     |
| Dar incentivo fiscal                           | lei com compensação; LRF, art. 14                                                                                                        | Congresso, LASTRO, TCU, concorrentes                                 | 43        | 9     |
| Reunir governo, empresas e centrais            | decreto de conselho sem órgão novo ou gasto, CF, art. 84 VI a                                                                            | convidados podem recusar; Congresso fiscaliza                        | 43        | 9     |
| Mudar regra trabalhista                        | lei; precedente Lei 13.467/2017                                                                                                          | Congresso, centrais, Justiça do Trabalho                             | 43        | 9     |

### E. Instituições

| ação                                 | rota                                                                                                            | quem pode travar                               | checklist | etapa |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | --------- | ----- |
| Indicar ministro do STF              | nomeação após vaga, aprovação de 41 senadores; 11 cadeiras, CF, art. 101; saída compulsória aos 75, LC 152/2015 | indicado, Senado, calendário da vaga           | 22        | 5     |
| Indicar ministro do STJ              | nomeação após vaga; 33 cadeiras, CF, art. 104                                                                   | indicado, Senado e requisitos da cadeira       | 22        | 5     |
| Indicar membro do TCU                | nomeação no terço presidencial; CF, art. 73 §2º I                                                               | Senado e requisitos constitucionais            | 22        | 5     |
| Indicar PGR                          | nomeação de membro da carreira para 2 anos, com 41 senadores; CF, art. 128 §1º                                  | indicado, Senado, MPF                          | 22        | 5     |
| Indicar presidente e diretores do BC | nomeação com Senado; diretoria de 9; presidência só no terceiro ano, LC 179/2021                                | Senado, mandatos fixos e autonomia legal       | 21        | 5     |
| Nomear comandantes e AGU             | nomeação; CF, art. 84 XIII e XVI; LC 97/1999                                                                    | indicado, cadeia de comando, custo político    | 25, 22    | 5, 8  |
| Propor PEC sobre tribunais           | proposta; CF, arts. 60 e 101                                                                                    | Congresso e STF em controle de cláusula pétrea | 8, 22     | 4, 5  |

### F. Federação

| ação                                | rota                                                                    | quem pode travar                           | checklist | etapa |
| ----------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------ | --------- | ----- |
| Negociar com governador ou prefeito | influência, convênio e protocolo social                                 | governo local, assembleia, bancada e caixa | 31        | 8     |
| Transferir verba ou firmar convênio | ato de gestão dentro do orçamento                                       | execução local, prestação de contas e TCU  | 31        | 8     |
| Acionar Força Nacional              | cooperação e atos do arranjo vigente: VERIFICAR rito antes de codificar | governador, coordenação, efetivo           | 31        | 8     |
| Decretar intervenção federal        | decreto nos casos da CF, art. 34; Congresso em 24 horas, art. 36 §1º    | Congresso, governador, STF e execução      | 26        | 8     |
| Negociar dívida estadual            | lei, contrato e transferência conforme caso: VERIFICAR rito             | governador, Congresso, Tesouro             | 31        | 8     |

### G. Ordem e Forças

| ação                      | rota                                                                                                   | quem pode travar                              | checklist | etapa |
| ------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------- | --------- | ----- |
| Empregar GLO              | decreto; CF, art. 142; LC 97/1999, art. 15                                                             | comandantes, execução, Congresso e STF        | 25        | 8     |
| Decretar estado de defesa | decreto; CF, art. 136, até 30 dias e uma prorrogação; Congresso decide em 10 dias por maioria absoluta | Congresso, STF e agentes executores           | 27        | 8     |
| Pedir estado de sítio     | autorização prévia do Congresso; CF, art. 137                                                          | Congresso, STF e agentes executores           | 27        | 8     |
| Trocar comandantes        | nomeação; CF, art. 84 XIII; LC 97/1999                                                                 | comandantes, oficiais e Congresso             | 25        | 8     |
| Dar indulto               | decreto; CF, art. 84 XII                                                                               | Judiciário, vítimas e controle constitucional | 23        | 8     |
| Propor penas maiores      | lei; CF, arts. 22 I e 61                                                                               | Congresso, Judiciário e sociedade             | 8         | 8     |

### H. Comunicação

| ação                                               | rota                                                          | quem pode travar                         | checklist | etapa |
| -------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------- | --------- | ----- |
| Falar em cadeia nacional, entrevista ou rede       | influência e comunicação oficial                              | audiência, veículos e fatos verificáveis | 28        | 7     |
| Fazer publicidade institucional ou campanha cívica | ato de gestão; CF, art. 37 §1º, sem promoção pessoal          | controle, imprensa e público             | 46        | 7, 9  |
| Orientar EBC nos limites legais                    | gestão e nomeações                                            | direção, controles e público             | 28        | 7     |
| Processar crítico                                  | queixa-crime ou indenização; CP, arts. 138–141; CF, art. 5º X | juiz decide; imprensa acompanha          | 45        | 7     |
| Propor lei de plataformas                          | lei; CF, arts. 5º IX e 220                                    | Congresso, STF, plataformas e usuários   | 8, 28     | 7     |

### I. Sociedade

| ação                                 | rota                                                                                | quem pode travar                         | checklist | etapa |
| ------------------------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------- | --------- | ----- |
| Fazer reforma agrária                | desapropriação e execução; CF, art. 184                                             | juiz, proprietário, orçamento, execução  | 34        | 9     |
| Demarcar terra indígena              | processo administrativo e homologação; Decreto 1.775/1996: VERIFICAR rito           | comunidades, ocupantes, Justiça          | 35        | 9     |
| Autorizar obra sob licença ambiental | processo do órgão competente: VERIFICAR regra por obra                              | órgão licenciador, comunidades, Justiça  | 31        | 9     |
| Mudar educação ou saúde              | lei, orçamento, pactuação e execução: VERIFICAR competência específica por política | Congresso, estados, municípios, gestores | 13, 14    | 9     |
| Negociar segurança com governadores  | cooperação; PMs subordinadas aos governadores, CF, art. 144 §6º                     | governador, comando policial, orçamento  | 25, 31    | 8     |

### J. Política

| ação                                      | rota                                                                                                     | quem pode travar                                    | checklist | etapa |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | --------- | ----- |
| Apoiar candidatos em 2028 e disputar 2030 | influência e campanha; CF, art. 14 §5º; Lei 9.504/1997: VERIFICAR vedações concretas                     | partidos, TSE, eleitores e imprensa                 | 37        | 6     |
| Alterar o sistema eleitoral               | PEC para sair do proporcional, CF, art. 45; art. 16 exige mais de um ano; MP vedada pelo art. 62 §1º I a | Congresso, TSE e STF                                | 44        | 6     |
| Lidar com vice e sucessão                 | negociação e rito constitucional, CF, arts. 79 e 80                                                      | vice, Mesas, STF conforme vacância                  | 39        | 6, 11 |
| Renunciar                                 | declaração formal; CF, art. 79: VERIFICAR forma legal antes de implementar                               | sucessão e reação política, sem veto ao ato pessoal | 40        | 11    |

### K. Tentativas fora da lei

Estas ações usam `EXTRALEGAL_ATTEMPT` (master-spec §13.11 e §17.5). A tentativa entra no
registro antes da resposta dos destinatários. A cor da rota indica risco jurídico; ela não
promete sucesso. A etapa 10 completa a cadeia. A versão legal de cada objetivo permanece no
catálogo acima ou nas [partidas-teste](../spec/the-test-playthroughs.md).

| ação                                                         | rota                                                             | quem pode travar                           | checklist | etapa |
| ------------------------------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------ | --------- | ----- |
| Usar PF ou ABIN contra adversários                           | tentativa fora da lei; Lei 13.869/2019; CF, art. 85              | agente, MP, juiz, STF, Congresso           | 47        | 10    |
| Descumprir decisão judicial                                  | tentativa fora da lei; Lei 1.079/1950, art. 12                   | órgãos executores, STF, Congresso          | 48        | 10    |
| Censurar ou exigir licença de jornal                         | tentativa fora da lei; CF, art. 220 §§2º e 6º                    | veículo, STF, Congresso, plataformas       | 49        | 10    |
| Prender sem ordem judicial fora das exceções constitucionais | tentativa fora da lei; CF, art. 5º LXI                           | policial, juiz, MP, Defensoria             | 50        | 10    |
| Comprar votos no Congresso                                   | tentativa fora da lei; CP, art. 333; AP 470, STF, 2012           | parlamentar, MP, STF e Mesas               | 52        | 10    |
| Usar banco público para despesa do Tesouro                   | tentativa fora da lei; LRF, art. 36; Lei 1.079/1950, arts. 10–11 | direção do banco, TCU, Congresso           | 53        | 10    |
| Adiar eleição ou fechar Congresso                            | tentativa fora da lei; CP, arts. 359-L e 359-M, Lei 14.197/2021  | TSE, Mesas, governadores, Forças e STF     | 51        | 10    |
| Afastar ministros do STF sem rito                            | tentativa fora da lei; CF, arts. 52 II e 101                     | ministros, Senado, STF e Forças            | 48, 51    | 10    |
| Convocar outra constituinte                                  | tentativa fora da lei; CF só prevê emenda no art. 60             | Congresso, STF, TSE, governadores e Forças | 54        | 10    |

Cada tentativa percorre `ACTION → destinatários → resolução jurídica → adesão ou recusa →
execução ou falha → reações → responsabilização ou consolidação` (master-spec §17.5).
O processo conserva a identidade de quem executou e de quem recusou. Prisão em flagrante e as
hipóteses militares previstas na CF, art. 5º LXI, seguem o rito legal e não esta tentativa.

| tentativa                           | quem recebe e pode recusar                                        | quem reage                            | como pode acabar                                                                        |
| ----------------------------------- | ----------------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------- |
| PF ou ABIN como arma                | DG, delegado ou servidor recusa, cumpre ou vaza                   | MPF, juiz, imprensa e CPI             | investigação contida, abuso punido ou captura institucional com prova pública posterior |
| Decisão judicial ignorada           | ministro e órgão executor recusam a ordem presidencial            | STF, Congresso, Forças e mercado      | decisão cumprida, crise institucional, impeachment ou escalada                          |
| Jornal censurado                    | EBC, autoridade administrativa e plataforma podem recusar a ordem | veículo, jornalistas, STF e Congresso | ordem falha, liminar a suspende ou censura persiste enquanto instituições cedem         |
| Prisão sem ordem                    | policial e comandante podem recusar; custódia chega ao juiz       | MP, Defensoria, juiz, STF e rua       | soltura por habeas corpus, responsabilização ou detenção ilegal persistente             |
| Voto comprado                       | parlamentar e operador podem recusar ou denunciar                 | MP, Mesas, STF e imprensa             | proposta cai, corrupção é apurada ou voto passa sob risco de anulação e punição         |
| Banco paga o Tesouro                | diretoria e controle interno podem recusar operação               | TCU, Congresso, mercado e Justiça     | operação barrada, contas rejeitadas, impeachment ou dano fiscal consolidado             |
| Eleição adiada ou Congresso fechado | TSE, comandantes e governadores podem recusar mobilização         | Mesas, STF, rua, estados e imprensa   | eleição mantida, ruptura fracassada com responsabilização ou ruptura consolidada        |
| Ministro do STF afastado            | segurança, comando e Senado podem recusar a ordem                 | STF, Congresso, Forças e governadores | ministro fica, tentativa gera crise ou força sustenta remoção de fato                   |
| Constituinte imposta                | Mesas, TSE, governadores e comandantes podem recusar convocação   | STF, partidos, rua e imprensa         | convocação falha, acordo político busca PEC ou ruptura muda o regime praticado          |

Nenhuma coluna acima garante frequência ou prazo. A VONTADE decide adesão ou recusa com a
informação que recebeu. TOGA [PROPOSTA] e o rito de responsabilidade decidem efeitos jurídicos.
QUARTEL [PROPOSTA] mede ordens, comando e capacidade de execução sem substituir decisões de pessoas.

## 4. Atores do mundo

O mundo segue o Brasil real, com pessoas inventadas (ADR 0003). Cada pessoa organizada decide
pela VONTADE, conforme memória, objetivo, informação recebida e repertório. A população não vira
milhões de agentes individuais: a SONDA acompanha públicos por renda e região; partidos,
movimentos e lideranças transformam opinião em pedidos e ação. ELENCO cria identidades estáveis.

| camada                                          | o que decide                                           | o que sabe                                                          | competência e limite                                                                    |
| ----------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 513 deputados                                   | pauta, texto, votos, fiscalização, denúncia            | gabinete, partido, emendas, pesquisa publicada e contatos recebidos | Câmara legisla e autoriza processo presidencial; CF, arts. 44, 45 e 51 I.               |
| 81 senadores                                    | texto, votos, indicações, responsabilização            | bancada, estado, informações recebidas e processo público           | Senado legisla e julga responsabilidade; CF, arts. 44, 46 e 52.                         |
| 16 partidos e seus presidentes                  | disciplina, alianças, candidaturas, recursos políticos | preferência interna e pesquisas que receberam                       | agregam pessoas; número e perfis no [catálogo de partidos](../spec/the-parties.md).     |
| líderes, relatores e Mesas                      | distribuição de trabalho, parecer, pauta e negociações | acordos que conhecem, texto e calendário                            | regimentos e CF, art. 57 §4º; não garantem voto alheio.                                 |
| 38 ministros e dirigentes federais              | proposta, gestão, cumprimento ou recusa de ordem       | dados de sua pasta e informes que chegam                            | CF, arts. 84 e 87; 38 pastas na Lei 14.600/2023.                                        |
| 11 ministros do STF                             | liminar, interpretação, julgamento                     | autos e prova processual                                            | CF, art. 101; não agem sem processo e competência.                                      |
| 33 ministros do STJ                             | recursos e uniformização federal                       | autos e precedentes                                                 | CF, art. 104; competência do art. 105.                                                  |
| 7 membros do TSE                                | disputa e controle eleitoral                           | autos, registros e prova eleitoral                                  | CF, art. 119; competências concretas: VERIFICAR antes de codificar.                     |
| 9 ministros do TCU                              | parecer, fiscalização, controle de contas              | documentos e auditorias recebidos                                   | CF, arts. 71 e 73; não votam lei.                                                       |
| PGR e integrantes do MPF                        | investigar, denunciar, provocar controle               | inquéritos, provas e informes                                       | CF, arts. 127–129; legitimidade para ADI, art. 103 VI.                                  |
| DG da PF, delegados e ABIN                      | investigar ou recusar ordem ilícita                    | inquéritos e informações de sua cadeia                              | Lei 9.266/1996, art. 2º-C; Lei 13.869/2019 limita abuso.                                |
| presidente e diretoria de 9 do BC               | política monetária e gestão da autarquia               | séries divulgadas e dados internos                                  | LC 179/2021; mandato impede troca livre.                                                |
| 3 comandantes das Forças                        | cumprir, contestar ou recusar ordem operacional        | ordens, tropa e informação militar recebida                         | CF, art. 142; LC 97/1999; Presidente nomeia, CF, art. 84 XIII.                          |
| 27 governadores                                 | polícia estadual, convênios, reação federativa         | dados estaduais, contatos e pesquisa recebida                       | posse em 6 jan 2027, EC 111/2021; PMs sob governo estadual, CF, art. 144 §6º.           |
| prefeitos                                       | solo urbano, obra e execução local                     | orçamento e pressão de sua cidade                                   | CF, arts. 30 VIII e 182; catálogo municipal agregado até pesquisa específica.           |
| centrais sindicais e confederações empresariais | negociar, apoiar, fazer greve ou campanha              | custos dos membros e informação pública                             | representação, mobilização e ações judiciais quando legitimadas, CF, art. 103 IX.       |
| bancos e empresas                               | crédito, preço, investimento, contratação              | balanço próprio, normas e expectativa                               | lei societária, contratos e regulação; estatal não se confunde com Tesouro.             |
| igrejas, OAB e movimentos                       | mobilizar, denunciar, apoiar, litigar                  | relatos de membros e informação pública                             | OAB pode propor ADI, CF, art. 103 VII; demais atuam nos ritos cabíveis.                 |
| jornalistas, veículos e plataformas             | apurar, publicar, amplificar, corrigir                 | fontes, documentos e evidência recebida                             | CF, arts. 5º IX e 220; audiência e confiança são distribuídas.                          |
| eleitorado por renda e região                   | votar e mudar apoio                                    | preço, serviço, notícia e experiência disponível                    | CF, art. 14; SONDA agrega comportamento, URNA converte em eleição com regra pesquisada. |

Uma instituição tem pessoas, prazo e competência. “O STF reagiu” deve poder ser aberto para
mostrar processo, legitimado, ministros e votos. “O mercado reagiu” precisa mostrar bancos,
empresas ou investidores que tomaram uma decisão; CORRENTE agrega os efeitos materiais.

## 5. Sistemas e contratos entre eles

Os motores existentes continuam donos de sua regra. O [mapa de migração](../spec/migration-map.md)
§4 registra o estado atual. A tabela descreve a ampliação proposta, não trabalho concluído.

| sistema existente | o que já responde             | o que ganha neste plano                                                                           |
| ----------------- | ----------------------------- | ------------------------------------------------------------------------------------------------- |
| LASTRO            | orçamento, caixa e dívida     | empresa com balanço próprio; custo de moradia, subsídio, emenda, incentivo e obra até a entrega.  |
| ECLUSA            | base e votação da Câmara      | voto individual, Senado, Mesa, PLP, PEC em dois turnos, MP, veto e sucessão da pauta.             |
| MALHA             | capacidade e execução         | gestores nomeados, serviço por mérito, obra com etapas, fila e atraso verificável.                |
| CORRENTE          | economia e confiança          | crédito por banco, investimento atrasado, preço da estatal, emprego e efeito regional pesquisado. |
| SONDA             | opinião                       | pesquisas como observações, renda e região, previsão eleitoral com incerteza.                     |
| ESTRATO           | normas e faixas               | rotas completas, competência, vedações, vigência, derrubada e efeito de decisão judicial.         |
| ELENCO            | pessoas e nomes               | instituições, governadores, imprensa, movimentos, notáveis e vínculos persistentes.               |
| CALDEIRA          | pressão e impeachment parcial | rua por interesse concreto, abertura pela Mesa, rito completo e consequências da crise.           |
| DELTA             | causas e efeitos              | rastro de anúncio, ato, execução, medição e atribuição com horizonte temporal.                    |
| VONTADE           | decisão de atores             | repertório por cargo, crença por evidência, recusa, cumprimento, alianças e custo político.       |

Os nomes abaixo são **[PROPOSTA]**. Eles nomeiam regras e projeções novas; não criam um segundo
motor de pessoas. Cada um recebe entrada fechada e devolve resultado puro.

| sistema [PROPOSTA] | entrada e saída                                                                       | fronteira                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| URNA               | opinião por região e partido, regras e candidaturas → votos e cadeiras em 2028 e 2030 | Câmara, Senado e municípios seguem fontes eleitorais; previsão é estimativa da Presidência.       |
| TOGA               | ato, legitimado do CF art. 103, autos e ministros → liminar, julgamento e efeito      | ADI e ADPF seguem rito pesquisado; TSE decide o que lhe compete; VONTADE decide provocar e votar. |
| PACTO              | 27 estados, governadores, polícias, dívida e repasses → acordos e execução local      | CF, arts. 34, 36 e 144 §6º; prefeito não recebe poder do governador.                              |
| MANCHETE           | evento, fonte, veículo, audiência e prazo → informação publicada, alcance e correção  | aplica a cadeia A2/C1–C3; jornalista e veículo seguem VONTADE, conforme master-spec §11.          |
| QUARTEL            | ordem, cadeia de comando, lealdade e meios → adesão, recusa e execução possível       | CF, art. 142 e LC 97/1999; cada comandante decide pela VONTADE.                                   |

**REGIME praticado** e **LEGADO** são leituras derivadas, não motores. REGIME lê eleição,
oposição, imprensa, Judiciário, direitos, força, religião oficial, federalismo e sucessão de fatos executados
(master-spec §17.3–17.4). LEGADO lê projetos, efeitos medidos e fragilidade depois do mandato.
Motor nenhum importa ou chama outro. `src/application/` compõe as entradas, preserva ordem de
evento, semente e visão presidencial, e oferece a mesma consulta à resolução e à tela.

## 6. Ordem de construção

As etapas **0–12 [DESENHO]** organizam os lotes existentes. Dentro de cada etapa, um lote só
começa com a ordem dele, como exige o [mapa](../spec/migration-map.md) §6.4. Etapas com código
fecham com `npm run validate` verde, prova que falhava antes do conserto, auditoria cruzada do
Codex e playtest dele. A auditoria reproduz achados antes de mudar código. A etapa 0 é só
documental e usa o portão deste pedido: Prettier, links e check.

### Etapa 0 — Fundação do plano

As [pesquisas 19 e 20](../spec/the-test-playthroughs.md) sustentam as duas partidas-teste.
Esta etapa absorve o inventário e os protótipos da fase 0 e da fase 1 do ciclo 32. Este ciclo
reúne os fios, telas, calendário, conteúdo, motores e aceites. Um placar **[PROPOSTA]**
no `npm run simulate --policy` deve contar quais dos 16 fios têm versão legal e, quando exigida,
tentativa fora da lei, ambas com reação. O `simulate` não vê tela: a tela de cada fio se conta no
passeio (`tests/browser/`). A contagem atual é **0 fios completos no jogo**;
a posse e a base existem no protótipo (fonte: partidas-teste, “O que falta no jogo hoje”).
Portão: links sem referência quebrada, `npm run check` verde e aprovação do plano pelo Diretor.

### Etapa 1 — Presidente e posse

**Prioridade corrigida pelo Diretor em 30/09: testar somente o novo protótipo.** Disponibilizar
a experiência isolada e auditar, desenvolver e aprimorar durante o uso. O teste não depende
do porte para a entrada principal nem do marco de 2027. A integração fica para depois;
as entregas abaixo continuam como plano, sem ampliar o trabalho atual por inferência.

A ponte experimental conecta nomeações e consulta estrutural da base à posse, com recarga
do rascunho. Não declarar ministérios variáveis integrados enquanto ainda dependem de catálogo
fixo, nem uma posse visual como prova de efeito no mês seguinte. Visão presidencial, fonte da
regra acionada e revisão independente continuam condições de integração. O aceite humano
da etapa permanece aberto; o teste do protótipo fornece achados para os próximos ajustes.

Entrega criação, trajetória com preço, versão do save, base calibrada, 38 pastas, convites e
reforma ministerial. Absorve ciclo 32, fases 2 e 4, §6b, e E1.0a, E1.0d, E1.0e, E1.0f.
Destrava Xi 2. A fase 4 abre a posse numa entrada isolada; a casca a incorpora na etapa 2.
E1.0d recebe a parte mínima da MP da E1.2 aqui; a rota genérica fica para a etapa 3.
Portão: teste de base para os 16 partidos, posse jogada por ele, `validate` verde e auditoria.

### Etapa 2 — Casca e Gabinete

Entrega barra, menu, entrada, pintura por diferença, agenda semanal e momento em cena. As sete
peças das partidas-teste viram componentes reutilizáveis, mesmo quando o conteúdo de uma peça
chegar em outra etapa. Absorve ciclo 32, fase 3, B1 e B6; B3 traz prazo de correspondência.
Portão: passeio em teclado e tamanhos do ciclo 32 §5, equivalência do mês antigo, desempenho
medido, `validate` verde, auditoria e playtest.

### Etapa 3 — A estatal de energia

Entrega Enerbras, ficha com fonte, cinco canais de consequência, negociação, sete rotas no corte,
portões do caso e tela da transformação. Absorve E1.1–E1.7, E1.2 na extensão necessária e A3
se a negociação exigir. O E0 pausado volta como rotina depois da consequência material. E1.8
é o playtest dele. O portão judicial da estatal é específico; TOGA
o generaliza na etapa 5. Destrava parte de Xi 6 e Lee 5.
Portão: estratégias de venda, controle e compra deixam países distintos após 48 meses (mapa §6.4),
`validate` verde, auditoria e playtest.

### Etapa 4 — Congresso inteiro

Entrega Câmara individual, Senado, Mesas, pauta, relator, texto negociável, PLP, PEC completa,
MP generalizada, urgência, sanção e veto. Absorve A4, D1–D3, E1.0b–E1.0c, generalização E1.2,
B4 e B5. A5 mede os atores antes de ativar a Câmara inteira. A eleição da Mesa de 2027 pode
ocorrer após a posse da etapa 1 porque a etapa 4 completa
seu rito; antes disso, a posse ainda é protótipo isolado, sem promessa de partida completa.
Destrava Xi 3 e parte de Xi 5; Lee 1 e parte de Lee 6.
Portão: Câmara e Senado podem divergir, veto cai só com votos exigidos, `validate` verde,
auditoria e playtest.

### Etapa 5 — Instituições e Justiça

Entrega pessoas, competências, vagas, indicações, ADI e ADPF, liminar, julgamento e tela das
instituições. Absorve A1–A3 onde ainda faltarem, E1.6 generalizado e TOGA [PROPOSTA].
Destrava Xi 1 e 4; Lee 7 na via judicial. Pesquisa de legitimidade, rito e efeitos do
[master-spec](../spec/master-spec.md) §15 antecede qualquer coeficiente.
Portão: ato contestado pode ser mantido, suspenso ou invalidado por processo com legitimado;
`validate` verde, auditoria e playtest.

### Etapa 6 — Eleições

Entrega URNA [PROPOSTA], campanhas, previsão mensal, apuração e cadeiras de 2028 e 2030, além
da tela de eleições. Absorve calendário eleitoral R2 e a parte eleitoral de B4/C3.
Destrava Lee 6 e Xi 5. Regra de distribuição de cadeiras e dados de partida entram só com fonte.
Portão: pesquisa publicada altera a previsão, eleição muda a base futura, `validate` verde,
auditoria e playtest.

### Etapa 7 — Imprensa, rua e informação

Entrega MANCHETE [PROPOSTA], veículos, vazamento, entrevista, plataformas, campanhas cívicas e
reação da rua. Absorve A2, C1–C3 e CALDEIRA adaptada do lote F. Destrava Xi 7 e Lee 7.
Portão: notícia não chega a ator que não a recebeu; a tela não lê dado oculto; `validate` verde,
auditoria e playtest.

### Etapa 8 — Federação e ordem

Entrega PACTO e QUARTEL [PROPOSTA], governadores, prefeitos, polícias, GLO, intervenção, estado
de defesa e estado de sítio. Destrava Xi 8 e Lee 8. A recusa de comando entra aqui; a cadeia
extralegal completa chega na etapa 10. Absorve a parte de federação e Forças do lote F.
Portão: comando e governo estadual podem divergir, prazos constitucionais valem, `validate`
verde, auditoria e playtest.

### Etapa 9 — Longo prazo

Entrega moradia, FGTS, mérito no serviço, investimento, Estado acionista, reforma trabalhista,
campanhas cívicas e LEGADO derivado. Destrava Lee 2–5 e completa Xi 6. Absorve a ampliação de empresa e
ministérios do lote F; preserva a diferença entre ativo, receita e reserva.
Portão: obra madura depois do pagamento, investimento depende da confiança, `validate` verde,
auditoria e playtest.

### Etapa 10 — Fora da lei e regime

Entrega a cadeia integral do master-spec §17.5, responsabilização e impeachment completos,
REGIME praticado e tela de crise. Absorve o rito do Senado e CALDEIRA restante do lote F.
Destrava o degrau 3 das duas partidas. Nenhuma tentativa ganha atalho de resultado.
Portão: a mesma ordem pode falhar ou consolidar conforme atores e semente; `validate` verde,
auditoria e playtest.

### Etapa 11 — Fim e balanço

Entrega sucessão, saídas da partida, comparação com 2027, instituições, regime e legado, com
fonte e estágio de cada efeito. A tela final abre o rastro de qualquer conclusão.
Portão: todo indicador do balanço aponta para fatos registrados, `validate` verde, auditoria e
playtest.

### Etapa 12 — Aceite do jogo inteiro

Sondas `xi` e `lee` em `npm run simulate --policy` percorrem várias sementes. Cada sonda precisa
atingir êxito e fracasso: maioria e PEC, recuo, decisão judicial ou impeachment para Xi;
transformação administrativa, eleição e revés para Lee. A taxa de cada desfecho vai ao handoff.
O Diretor joga as duas. Ordem dele em 26/09: três destinos extremos têm de ser alcançáveis em
alguma partida, mesmo que raros — um Brasil parecido com os Estados Unidos (pela lei), com a
Coreia do Norte ou com o Afeganistão (só por ruptura). Uma sonda por destino mostra ao menos uma
semente em que o REGIME praticado chega lá, e a taxa vai ao handoff. A interface antiga só sai quando o inventário da fase 0 do ciclo 32
estiver coberto pela nova; isso absorve ciclo 32, fases 5 e 6.
Portão: 16 fios com suas versões exigidas, reação e atraso; `validate` verde, auditoria cruzada,
playtest dele e aprovação final. Milei depende de ordem dele; o exterior entra na atualização
internacional prevista no [jogo em uma página](../spec/game-in-one-page.md).

| etapa | entrega                          | lotes e fases absorvidos                     | fios destravados                |
| ----- | -------------------------------- | -------------------------------------------- | ------------------------------- |
| 0     | fontes, plano, placar [PROPOSTA] | pesquisas 19–20; ciclo 32 fases 0/1          | régua dos 16 fios               |
| 1     | Presidente, posse, base          | E1.0a/d/e/f; ciclo 32 fases 2/4              | Xi 2                            |
| 2     | casca, Gabinete, semana          | B1/B3/B6; ciclo 32 fase 3                    | suporte de todos                |
| 3     | estatal, consequência, rotas     | E0; E1.1–E1.8; A3 se necessário              | Xi 6 parcial; Lee 5 parcial     |
| 4     | Congresso, Senado, PEC, veto     | A4/A5; D1–D3; E1.0b/c; E1.2 geral; B4/B5     | Xi 3/5 parcial; Lee 1/6 parcial |
| 5     | pessoas, controle judicial       | A1–A3 restantes; E1.6 geral                  | Xi 1/4; Lee 7 parcial           |
| 6     | eleições e previsão              | R2 eleitoral; B4/C3 eleitorais               | Xi 5; Lee 6                     |
| 7     | imprensa, rua, informação        | A2; C1–C3; F mídia/CALDEIRA                  | Xi 7; Lee 7                     |
| 8     | federação e Forças               | F federação/ordem                            | Xi 8; Lee 8                     |
| 9     | obras, investimento, legado      | F empresas/ministérios                       | Lee 2–5; Xi 6 completo          |
| 10    | ruptura, impeachment, regime     | F responsabilização/CALDEIRA                 | degrau 3 de Xi e Lee            |
| 11    | balanço final                    | integração das etapas                        | consequência dos 16 fios        |
| 12    | sondas, playtest, troca          | A5 final; ciclo 32 fase 5 concluída e fase 6 | aceite dos 16 fios              |

### Marco jogável — depois da etapa 4 [PROPOSTA]

O aceite do jogo inteiro só chega na etapa 12. Antes dele, um marco: o ano de 2027 jogado de
ponta a ponta na casca nova, com criação, posse, Mesa, estatal e Congresso inteiro. O Diretor joga
o ano antes de a etapa 5 começar. O que falhar ali pode reordenar as etapas 5 a 11 (decisão 9).

A5 mede 20 → 100 → 513 → 594 agentes antes de ativar todos, como exige o mapa §6.1. A medida
começa antes de povoar cada camada; a tabela final fica na etapa 12. Esta distribuição não
dispensa pesquisas R1–R4 nem as provas de cada lote. Ela fixa onde cada peça entra no jogo.

## 7. Interface inteira: telas, componentes e design

O estilo fixado em 26/09 é **Apple + Football Manager + Civilization + Valorant**
([ciclo 32](32-the-new-interface.md) §2). Apple define hierarquia e movimento; Football Manager
organiza dados e fichas; Civilization dá escala ao hemiciclo e ao mapa; Valorant marca seleção e
decisão. A posse define os tokens comuns. Liquid Glass ocupa só barra, menu e diálogo pequenos
sobre fundo parado. O desfoque de fundo (`backdrop-filter`) só existe nessas três superfícies e
nunca sobre o que anima: no protótipo, ele descartou 32 quadros em 6 saídas (ciclo 32).

Hover não altera estado. Movimento usa `transform` e `opacity`, respeita preferência por movimento
reduzido e não anima centenas de retratos de uma vez. Retratos só são montados enquanto visíveis. O orçamento dos gestos comuns é de 20 ms por quadro com CPU 4× mais lenta
(ciclo 32, §2). O pior quadro medido no hover do nome é 33 ms com CPU 4× ([journal](../journal.md), entrada 87):
referência para reduzir no lote, não meta de desempenho. Cada lote registra trace, máquina e contagem de
quadros; uma regressão medida impede a troca da tela.

| tela                  | o que o jogador faz                                       | componente central                          | leitura do motor                           | etapa |
| --------------------- | --------------------------------------------------------- | ------------------------------------------- | ------------------------------------------ | ----- |
| Criação do Presidente | escolhe identidade, trajetória e partido                  | ficha, retrato e partido                    | ELENCO, ECLUSA, SONDA, VONTADE             | 1     |
| Posse                 | decide estrutura e nomes, monta a base                    | hemiciclo e seleção de ministro             | ELENCO, ECLUSA, VONTADE, MALHA             | 1     |
| Gabinete              | escolhe agenda da semana e resolve momento em cena        | pessoa, pedido, prazo e três linhas         | composição em `src/application/`           | 2     |
| Congresso             | acompanha Câmara, Senado, Mesa, pauta, texto e votos      | dois hemiciclos e trilho de estágios        | ECLUSA, ESTRATO, VONTADE                   | 4     |
| Governo               | nomeia, reforma pastas e acompanha execução               | ministério com responsável e fila           | MALHA, ELENCO, ESTRATO                     | 1, 9  |
| Dinheiro              | envia orçamento, contingencia, cria crédito e vê dívida   | fluxo autorizado, disponível e comprometido | LASTRO, ESTRATO                            | 3, 4  |
| País                  | vê fatos concretos, economia, serviços, opinião e estados | mapa com fonte e data                       | CORRENTE, SONDA, MALHA, PACTO [PROPOSTA]   | 8, 9  |
| Instituições          | indica nomes e acompanha vagas, ações e mandatos          | cadeiras e processos com rostos             | TOGA [PROPOSTA], ELENCO, VONTADE           | 5     |
| Federação             | negocia com governadores e prefeitos                      | mapa e ficha do governo local               | PACTO [PROPOSTA], LASTRO, VONTADE          | 8     |
| Imprensa e rua        | acompanha publicação, entrevista e mobilização            | notícia com fonte e audiência               | MANCHETE [PROPOSTA], CALDEIRA, SONDA       | 7     |
| Eleições              | consulta previsão, apoia campanha e vê resultado          | mapa de voto e cadeiras                     | URNA [PROPOSTA], SONDA, ECLUSA             | 6     |
| Correspondência       | lê, responde, promete e acompanha prazo                   | carta, pessoa e compromisso                 | VONTADE, DELTA e calendário                | 2, 7  |
| Compositor de ação    | escolhe objetivo, rota, texto e preço                     | objetivo → rotas → avaliação → preço        | ESTRATO e composição em `src/application/` | 3, 4  |
| Crise                 | decide resposta a exceção ou ruptura                      | cadeia de destinatários e recusa            | CALDEIRA, TOGA, QUARTEL [PROPOSTA]         | 8, 10 |
| Balanço final         | examina mudança, fragilidade, regime e legado             | comparação com 2027 e rastro                | REGIME e LEGADO derivados; DELTA           | 11    |
| Próximas atualizações | vê conteúdo ainda fora do jogo                            | lista com escopo e dependência              | catálogo de conteúdo com fonte             | 2, 12 |
| Salvar e carregar     | grava ou retoma partida e semente                         | ficha do mandato                            | `src/state/`, versão do save               | 1, 2  |

As [sete peças](../spec/the-test-playthroughs.md) aparecem de forma consistente:

1. **Cartão de ação:** classe, instrumento, quórum contra votos firmes, prazo, caixa e pessoas
   que podem reagir. A estimativa vem da assessoria, com incerteza visível.
2. **Duas versões:** rota constitucional e tentativa fora da lei aparecem lado a lado quando o
   objetivo admite ambas. A segunda expõe destinatários, risco e responsabilidade.
3. **Trilho de estágios:** anúncio, projeto, aprovação, regulamentação, execução, resultado e
   consolidação têm responsável, data e evidência. Fase não concluída não recebe cor de conclusão.
4. **Instituições:** cadeira, ocupante, prazo e competência abrem ficha de pessoa e processo.
5. **Quem reage:** foco ou hover destaca atores que podem agir. O destaque não muda o estado.
6. **Três horizontes:** curto, médio e longo mostram consequência esperada e medição posterior.
   O registro separa o observado da atribuição à medida.
7. **Regime praticado:** diagrama derivado de fatos executados, com histórico mensal; não é ação.

A ficha de pessoa mostra fama, preparo, afinidade, vínculo, memória conhecida e cargo; a de
partido mostra bancada, posição e compromissos. O hemiciclo abre pessoa e voto estimado, com
incerteza onde houver. Toda decisão apresenta três linhas: custo, quem reage e tempo. A previsão
eleitoral abre fonte e data da pesquisa. O LEGADO de Lee aparece como peça adicional no País e
no balanço, com entregas que continuam depois de 2030.

Cada tela nasce de dois ou três protótipos no canvas. O Diretor escolhe ou combina. O lote
constrói a escolha, adiciona passeio no `validate` e compara o inventário da tela antiga. A
antiga sai quando a nova cobre todas as funções. O ciclo 32, fases 1 e 5, rege o processo; a
fase 6 só conclui a troca após o aceite da etapa 12. A aplicação entrega consultas da visão
presidencial; o componente não recompõe voto, saldo ou probabilidade.

## 8. Conteúdo, fonte e produção

| conteúdo                                                | fonte e regra de entrada                                                                                                                                | uso no jogo                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 38 ministérios                                          | Lei 14.600/2023; alterações posteriores: VERIFICAR antes do catálogo de 2027                                                                            | cadeira, competência, custo, responsável e reforma.          |
| 16 partidos                                             | [catálogo de partidos](../spec/the-parties.md) e [modelo da base](../spec/the-base-model.md)                                                            | bancada, coalizão, candidatura e eleição.                    |
| 27 UFs                                                  | CF, arts. 18 e 32; população e PIB do IBGE: VERIFICAR ano, revisão e números antes de entrar                                                            | governos, serviços, renda e eleição regional.                |
| orçamento e macro de 2027                               | pesquisas 01, 02 e 06 do repositório; revisão de premissas: VERIFICAR                                                                                   | caixa, preço, emprego, dívida e ponto de partida do balanço. |
| estatais com nomes inventados                           | ADR 0003; [pesquisa 14](../research/14-the-state-energy-company.md) para Enerbras                                                                       | ativo, balanço, diretoria, participação e reação.            |
| programas sociais reais                                 | lei de cada programa; MCMV, Lei 14.620/2023; FGTS, Lei 8.036/1990                                                                                       | público, fila, custo, execução e resultado.                  |
| 33 notáveis                                             | [mapa](../spec/migration-map.md) §6.4, E1.0f; pessoas inventadas                                                                                        | convite, fama, preparo e afinidade com preço político.       |
| seca, enchente e queimada                               | caso real com fonte e data: VERIFICAR antes de modelar frequência e custo                                                                               | evento com local, dano, informação e pedido.                 |
| greve de caminhoneiros, operação da PF, CPI e escândalo | caso real com fonte e data: VERIFICAR antes de modelar gatilho e consequência                                                                           | atores iniciam ou respondem conforme competência.            |
| crise cambial                                           | série e caso real com fonte: VERIFICAR antes de calibrar choque                                                                                         | CORRENTE, LASTRO, informação e reação.                       |
| vocabulário                                             | ADR 0002: gerado fora do turno, sem gerar efeito                                                                                                        | fala curta com estado e fonte já decididos pelo motor.       |
| retratos                                                | imagens que o Diretor gera no ChatGPT, fora do jogo (ADR 0002: conteúdo, nunca efeito); nenhuma lembra pessoa real (ADR 0003); quantidade na decisão 10 | identidade legível em ficha, hemiciclo e cena.               |

Cada evento tem ficha com caso fonte, data, lugar, gatilho observável, agentes, conteúdo que
cada um recebe, consequência e teste de plausibilidade. Um evento sem fonte pode existir como
**[DESENHO]**, mas não recebe frequência apresentada como fato. A atualização internacional
fica na tela de Próximas atualizações, conforme decisão de 25/09 no
[jogo em uma página](../spec/game-in-one-page.md).

## 9. Qualidade e portões

- Cada lote de código começa com prova que cai contra o estado anterior e termina com
  `npm run validate` verde. Testes não mudam para esconder defeito; calibração de `src/data/`
  exige pesquisa e decisão própria ([CLAUDE.md](../../CLAUDE.md)).
- O Codex audita cada etapa com diff delimitado, como nas três auditorias da posse registradas
  no [journal](../journal.md). Achado só entra depois de reprodução.
- O Diretor joga a entrega de cada etapa. O aceite informa o que ele fez, o que apareceu, o que
  custou e onde a regra falhou. Um teste verde não substitui o playtest.
- A5 mede a VONTADE em 20 → 100 → 513 → 594 atores, como prescreve o mapa §6.1. A prova compara
  avaliação completa e agendada com a mesma semente. A camada seguinte só liga após essa prova.
- O passeio mede 1280×800, 1440×900, 1920×1080 e zoom de 125% e 150% (ciclo 32 §5), teclado,
  recorte, sobreposição e hover. Captura é inspecionada, não apenas gerada.
- O trace mede o alvo de 20 ms por quadro em gesto comum com CPU 4× (ciclo 32 §2) e acompanha o
  quadro de 33 ms no hover do nome informado para este plano. Retratos fora da vista não pintam.
- As sondas de 48 meses, com várias sementes, procuram estratégia dominante, estagnação e
  ruptura fácil. A taxa de êxito e fracasso das sondas Xi e Lee fica no handoff.
- A tela é testada contra a consulta da aplicação para a mesma posição e visão presidencial.
  Informação oculta não entra por dica, mapa, hover, balanço antecipado ou rótulo de previsão.

## 10. Riscos e contenção

| risco                             | sinal verificável                                 | contenção                                                                                        |
| --------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Custo de 594+ atores              | A5 piora trace ou muda decisão com agendador      | medir nos quatro tamanhos do mapa §6.1; manter equivalência e povoar camadas por lote.           |
| Escopo sem fim                    | lote não fecha uma decisão jogável                | cortar por fio e prova; jogar o marco depois da etapa 4; o resto vai para Próximas atualizações. |
| Fato jurídico ou econômico errado | número sem artigo, pesquisa ou data               | marcar VERIFICAR, pesquisar antes de regra; nenhum coeficiente nasce de palpite.                 |
| Tela refaz conta do motor         | prévia diverge da resolução                       | uma consulta em `src/application/` para tela e resolução; prova de identidade e visão.           |
| Desempenho regride                | trace, captura ou passeio piora após tela nova    | reter a antiga, medir material e retratos, corrigir antes da troca.                              |
| Uma rota domina o jogo            | sonda vence por repetição sem reação proporcional | adversarial de 48 meses e playtest em direções opostas antes de calibrar.                        |

## 11. Decisões abertas para o Diretor do Jogo

1. **Ordem das etapas:** a estatal vem antes do Congresso inteiro? Eleições vêm antes da
   imprensa? Este plano propõe essa ordem para dar primeiro consequência material e depois
   ampliar os ritos; a aprovação fixa a sequência. A fila do [handoff](../handoff.md) punha o
   E1.0b, a eleição da Mesa, logo depois do E1.0a e antes da estatal; este plano o leva à etapa 4.
   Aprovar a ordem aprova essa troca. **Decidido em 26/09: fica a ordem do plano.**
2. **Nomes dos sistemas [PROPOSTA]:** URNA, TOGA, PACTO, MANCHETE e QUARTEL são nomes de
   trabalho. A decisão fixa os nomes antes dos módulos.
3. **Vagas do STF:** usar idades reais dos ministros, sem nomes, com calendário real; ou sortear
   idades pela semente? ADR 0003 exige pessoas inventadas. A opção escolhida precisa fonte ou
   distribuição [DESENHO] explícita.
4. **Segundo mandato:** se o Presidente vencer em 2030, a partida continua ou termina no
   balanço de 4 de janeiro de 2031 (CF, art. 82)?
5. **Rota fora da lei:** ela entra na etapa 10? O [jogo em uma página](../spec/game-in-one-page.md)
   deixou essa rota fora do primeiro corte em 25/09; as partidas-teste exigem a cadeia no jogo
   inteiro. Os itens 47 a 54 do checklist dependem desta resposta. **Decidido em 26/09: entra,
   "contanto que seja realista, pode tudo".**
6. **Horizonte do legado:** mostrar efeito até 2035 ou 2040 **[DESENHO]**? A escolha fixa o
   tempo de obra, dívida e instituições depois do mandato.
7. **Modos de jogo:** oferecer só o cenário real de 2027 ou também uma Câmara personalizada?
   A Câmara personalizada muda a fonte dos votos iniciais e exige rótulo **[DESENHO]**.
8. **Partida Milei:** quando, se houver ordem dele, entra a terceira régua? Até lá, Xi e Lee são
   o aceite; o exterior continua na atualização posterior.
9. **Marco jogável:** o ano de 2027 jogado depois da etapa 4 entra como portão? Proposta deste
   plano: sim, e o resultado dele pode reordenar as etapas 5 a 11. **Decidido em 26/09: sim.**
10. **Retratos:** um por pessoa com rosto (594 parlamentares, mais ministros, juízes e
    governadores) ou um banco menor que se repete com roupa e cor diferentes? O tamanho do arquivo
    e o custo de decodificar a imagem se medem no protótipo da posse antes da escolha.
