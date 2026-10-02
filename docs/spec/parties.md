# Os partidos

> **Situação:** vigente — os 16 partidos, iguais no motor.

Os 16 partidos da Câmara, iguais no protótipo da posse (versão de 26/09) e no motor
(`src/data/parties.mjs`). Nomes, siglas e perfis são inventados (ADR 0003). As bancadas partem da
Câmara em 26/09/2026 ([pesquisa 18](../research/18-chamber-today.md)) e fecham na distribuição
que ele definiu, com 513 deputados. Nove nascem das ideias do Gemini; os nomes passaram pela
avaliação dele e pela minha, e as posições seguem a classificação dos especialistas de 2022 onde ela
e o perfil concordam. Os pragmáticos e os que nunca entram na base estão nas decisões abaixo.

| sigla     | nome                                         | deputados | Nolan       | economia / costumes | bloco real                       | perfil                                                                                                                               |
| --------- | -------------------------------------------- | --------: | ----------- | ------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| PML       | Partido Marxista-Leninista                   |         1 | Autoritário | 3 / 8               | —                                | Planejamento central, expropriação de bancos e controle da mídia. Subordina direitos civis à disciplina coletiva.                    |
| PSO       | Partido Socialista Operário                  |        12 | Esquerda    | 18 / 78             | PSOL/Rede                        | Moradia popular, direitos trabalhistas, imposto sobre fortunas e direitos trans. Vota contra toda reforma de mercado.                |
| ECOS      | Ecossolidariedade                            |         4 | Esquerda    | 32 / 76             | PSOL/Rede                        | Desmatamento zero, energia limpa e direitos territoriais. Condiciona obras à proteção de povos locais.                               |
| PCS       | Partido da Coalizão Social                   |        90 | Esquerda    | 28 / 62             | PT/PCdoB/PV + PSB                | Emprego, renda e proteção trabalhista. Reúne correntes de esquerda que negociam com governos.                                        |
| PTP       | Partido do Trabalho e da Pátria              |        10 | Esquerda    | 22 / 54             | PDT                              | Estatais estratégicas, indústria naval e direitos trabalhistas. Põe soberania energética e emprego à frente das pautas de costumes.  |
| PATRIA    | Patriota Popular                             |         3 | Autoritário | 25 / 12             | PRD                              | Monopólio estatal de minérios e petróleo, tarifas de importação e disciplina militar. Defende controle da mídia e das fronteiras.    |
| MDN       | Movimento Democrático Nacional               |        52 | Centro      | 58 / 44             | MDB                              | Herança da redemocratização, autonomia regional e acesso a verbas. Reúne líderes locais com posições diversas.                       |
| PBR       | Progressistas do Brasil                      |        42 | Direita     | 62 / 34             | Podemos + Avante + Solidariedade | Centrão de legendas médias, conservador nos costumes. Vota com quem oferece pasta e emenda.                                          |
| PDST      | Partido Democrático Social dos Trabalhadores |        50 | Centro      | 50 / 50             | PSD                              | Transferência de renda, crédito de bancos públicos e campeões nacionais. Loteia estatais e ministérios em troca de governabilidade.  |
| FBR       | Força Brasileira                             |        48 | Direita     | 68 / 32             | União Brasil                     | Fusão de dois partidos de direita, com muitas alas. Ocupa ministérios e vota dividido.                                               |
| UNIDOS    | Unidos pela República                        |        24 | Centro      | 64 / 44             | PSDB/Cidadania                   | Equilíbrio fiscal, concessões e estabilidade institucional. Evita disputas de costumes, mas resiste à sua liberalização.             |
| PAB       | Partido Agrário Brasileiro                   |        38 | Direita     | 60 / 32             | PP                               | Crédito rural, infraestrutura e menos restrições à produção. Negocia apoio conforme os ganhos do setor.                              |
| ACF       | Aliança Cristã pela Família                  |        36 | Direita     | 60 / 24             | Republicanos                     | Família tradicional e restrições ao aborto e às drogas. Mobiliza igrejas e concentra votos em pautas de costumes.                    |
| PCN       | Partido Conservador Nacional                 |        94 | Direita     | 66 / 22             | PL                               | Menos regulação, segurança pública e valores conservadores. Defende proteção a setores nacionais e mobiliza pelas redes.             |
| VANGUARDA | Vanguarda                                    |         8 | Libertário  | 85 / 52             | Novo                             | Privatizações, ajuste fiscal, abertura comercial e menos Estado na economia. Pequeno, disciplinado e forte nas comissões econômicas. |
| PLI       | Partido Libertário                           |         1 | Libertário  | 97 / 97             | Missão                           | Privatização total, impostos mínimos, porte livre de armas e drogas descriminalizadas. Recusa fundo partidário e emendas.            |

Economia é liberdade econômica (0, Estado controla tudo; 100, mercado livre) e costumes é liberdade
individual (0, controle total; 100, liberdade total). Posições, perfis e cores são desenho. A
venalidade do motor é [DESENHO], herdada do bloco equivalente do catálogo de 9.

## Decisões de 26/09

- **O PDST ficou com a vaga do PSD (48) e foi para o centro (50/50).** O perfil dele, partido da máquina que
  entra em qualquer governo, é o comportamento do PSD real; assim ficam 16 partidos sem apagar nenhum bloco.
- **FBR e CONV foram para a direita**, como União Brasil e Podemos na nota dos especialistas; o MDN puxou para
  a centro-direita.
- **O PCS absorveu o bloco do PSB** e ficou com 99; a distribuição final, no último item, o deixou com 90.
- A sigla LIBER lembra um partido em formação no Brasil (Libertários), fora do registro do TSE; ficou por ser
  escolha dele.
- Pedidos dele no fim do dia: LIBER virou PLI (Partido Libertário, anarcocapitalista); FP virou VANGUARDA
  (neoliberalismo, 85/48); PSU virou PSO (Partido Socialista Operário); CONV virou PBR (Progressistas do
  Brasil). "Progressistas" é o nome oficial do PP real e "Libertários" é um partido real em formação: ficaram
  por ordem dele. Revisão contra a Câmara real: PCN a 66/22 (o PL é o mais à direita para os especialistas) e
  PATRIA a 25/12.
- **Fisiologismo (26/09, a partir da análise do Gemini):** MDN, PDST, FBR, PBR, PAB, ACF e UNIDOS são pragmáticos.
  Negociam com qualquer governo: aceitam pasta mesmo longe no Nolan, votam com o governo em pelo menos 55% das
  vezes sem pasta [DESENHO] e só viram oposição acima de 70 de distância. Motivo: União, PP e Republicanos
  aceitaram ministérios de Lula em 2023. O rótulo no Nolan segue os especialistas; o comportamento vem do
  traço. O Gemini também disse que o MDN (38) e o PDST (48) estavam pequenos: são os números reais de hoje.
- **Bancadas por ordem dele (26/09):** PCN 94, PCS 90, MDN 52, PDST 50, FBR 48, PBR 42, PAB 38, ACF 36, UNIDOS 24,
  PSO 12, PTP 10, VANGUARDA 8, ECOS 4, PATRIA 3, PLI 1 e PML 1. A lista dele somava 507; os 6 que faltavam foram
  para o MDN, por escolha dele.
- **Recusa declarada (terceira auditoria do Codex, `tmp/posse/patch-v2k.mjs`):** PML e PLI recusam ministério
  de qualquer Presidente, como dizem os perfis deles, e ficam na oposição.
