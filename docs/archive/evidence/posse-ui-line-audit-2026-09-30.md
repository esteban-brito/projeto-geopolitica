# Comparação linha por linha da UI da posse — 30/09/2026

Referência: [original do Claude](../../../tmp/posse/live.html). Comparada: [versão transformada](../../../tmp/posse/engine.html). O original foi preservado. Esta auditoria cobre apresentação e interação; apenas localiza as alterações de dados e cálculos, sem aprovar sistemas por aparência.

## O que foi comparado integralmente

- 2 blocos de CSS, 159 linhas: conteúdo idêntico, incluindo keyframes, transições, curvas, sombras, máscaras, filtros, cores, fontes e foco.
- HTML inteiro: 461 linhas na referência e 463 na versão nova. As únicas adaptações são entrada ESM, ocultação inicial do template, legenda da base e dois campos condicionais.
- Catálogos e auxiliares anteriores ao componente: todos conferidos. Apenas as tabelas e os textos de precedente/distribuição fixa solicitados foram removidos. Ícones SVG, retratos, desenho das fichas e demais auxiliares conservados.
- Geometria dos ministérios e hemiciclo, eventos de seleção, botões e variantes, formulário do Presidente, cerimônia, linha de candidato e montagem da ficha: comparações exatas dos blocos. A única adaptação visual dos círculos é buscar o ícone original do perfil de uma pasta criada.
- Runtime: o mesmo arquivo do Claude, SHA-256 82ab863dabf94f79db1b4ced13046a03425dcd255e97a5e42c60b6e8035fea34; igual ao inventário feito antes desta recuperação.

## Métodos de interação

| Método | Linhas no original | Resultado |
| --- | ---: | --- |
| constructor | 4 | Inicializa a ponte antes da primeira renderização; estado inicial do Claude conservado. |
| local | 9 | Idêntico |
| tipAt | 4 | Idêntico |
| moveTip | 8 | Idêntico |
| placeTip | 10 | Idêntico |
| componentDidUpdate | 4 | Idêntico |
| componentDidMount | 1 | Idêntico |
| showCard | 20 | Idêntico |
| showParty | 10 | Idêntico |
| placeParty | 10 | Idêntico |
| moveParty | 1 | Idêntico |
| hideParty | 5 | Idêntico |
| hideCard | 12 | Idêntico |
| syncInert | 9 | Idêntico |
| syncFocus | 9 | Idêntico |
| focusOn | 19 | Troca somente o texto quando a estimativa não está disponível; posicionamento e eventos conservados. |
| focusOff | 12 | Idêntico |
| lockIn | 21 | Idêntico |

Os 16 métodos sem adaptação são cópias exatas. Os outros dois preservam todo o gesto: o construtor ganha a inicialização e focusOn troca uma linha de texto quando a estimativa falta. lockIn conserva o voo de 560 ms, a curva cubic-bezier(.2,.8,.2,1) e o pulso de 520 ms com atraso de 440 ms.

## Todas as diferenças localizadas

Números referem-se às linhas dos dois HTMLs no estado auditado. Inserções indicam o ponto de inserção no original. O [diff completo](../../evidence/posse-ui-line-diff-2026-09-30.patch) e os [trechos antes/depois em JSON](../../evidence/posse-ui-line-audit-2026-09-30.json) permitem verificar cada linha sem truncamento.

| Bloco | Original | Transformado | Classificação e revisão |
| ---: | --- | --- | --- |
| 1 | 6 | 6 | **Inicialização:** Carrega a ponte ESM; o mesmo runtime do Claude permanece responsável pela UI. |
| 2 | 9 | 9 | **F5:** Oculta o template até o runtime estar pronto; elimina a exposição do HTML sem processamento. Não altera keyframes. |
| 3 | 188 | 188 | **Texto:** Identifica o número como estimativa estrutural; mantém classe, tamanho e posição. |
| 4 | 282 | 282–283 | **Campos novos:** Nome e busca reutilizam stack, caption e field no painel original. Visíveis somente nas operações que os exigem. |
| 5 | 532–533 | 534–535 | **Texto removido:** Retira duas referências históricas dos atalhos de divisão, conforme solicitado. |
| 6 | 536–545 | 538 | **Critério removido:** Elimina HIST, DEST, SPLIT e PRE. Não redesenha componentes. |
| 7 | 595 | 587 | **Critério removido:** Elimina PARTNERS; lista de destinos passa a consultar os trabalhos atuais. |
| 8 | 927–928 | 918 | **Texto removido:** Elimina T.noPrecedent e T.reaction integralmente. |
| 9 | 1039 | 1028 | **Inicialização:** Liga a inicialização sem mudar o estado inicial do Claude. |
| 10 | 1161 | 1151 | **Informação disponível:** Na dica da bancada, altera somente o texto quando não há estimativa; gesto e posicionamento idênticos. |
| 11 | 1219 | 1209 | **Dados:** Obtém a estrutura atual para a tela; nenhuma regra de apresentação é alterada nesta linha. |
| 12 | 1220 | 1211–1212 | **Compatibilidade de IDs:** Resolve nomes e perfil visual de pastas criadas; reutiliza os catálogos do Claude. |
| 13 | 1226–1230 | 1219–1223 | **Dados:** Adapta nomes, atribuições e pesos à estrutura atual. Regra estrutural fica fora desta aprovação de UI. |
| 14 | 1238 | 1231–1233 | **Dados:** Conecta a consulta da base. Não cria componente ou animação. |
| 15 | 1240–1247 | 1236–1237 | **Cálculo:** Substitui a conta de apoio por consulta da ponte; fora da avaliação de UI. |
| 16 | 1249 | 1239 | **Cálculo:** Retira a antiga conta individual para usar a consulta da ponte no bloco seguinte. |
| 17 | 1252–1253 | 1241–1243 | **Cálculo:** Consulta apoio individual e total; mantém geometria dos pontos, conferida em bloco completo. |
| 18 | 1256–1258 | 1246–1248 | **Cálculo:** Consulta estimativas por partido; não altera os estilos ou eventos dos pontos. |
| 19 | 1288 | 1278 | **Ícones:** Pasta criada reutiliza o ícone e viewBox do perfil original; tamanhos, cores, posições e click preservados. |
| 20 | 1321 | 1311 | **Compatibilidade de IDs:** Permite título de pasta criada sem acesso a OFFICIAL inexistente; mesmo componente. |
| 21 | 1323–1324 | 1313–1315 | **Texto e dados:** Descrição reflete atribuições atuais e pasta vazia; remove promessa de poder por número de pastas. |
| 22 | 1331 | 1322 | **Critério removido:** Retira sugestões fixas de parceiros; opções usam a lista atual. |
| 23 | 1333–1342 | 1323–1324 | **Distribuição:** Começa com destinos a escolher e aplica a proposta aos controles existentes; sem destino histórico automático. |
| 24 | 1348–1349 | 1330–1333 | **Operação:** Juntar consulta a estrutura. Vínculo institucional pendente conserva a proposta; regra fica fora da auditoria de UI. |
| 25 | 1353 | 1337 | **Operação:** Guarda a estrutura resultante da junção; conserva seleção, mensagem e titular pelos mesmos controles. |
| 26 | 1363 | 1347–1380 | **Controles novos:** Criar, renomear e transferir usam act, classes e painel do Claude; confirmação, seleção e retorno explícitos. |
| 27 | 1372–1373 | 1390 | **Nome:** Junção conserva nomes atuais, inclusive renomeações; não altera a apresentação do botão. |
| 28 | 1375 | 1392 | **Critério removido:** Retira nomes sugeridos por HIST; permanece o botão com os dois nomes. |
| 29 | 1381–1382 | 1397–1401 | **Destinos:** Escolha individual ou em lote e busca por atribuições atuais. Botões originais, com retorno à divisão. |
| 30 | 1385–1387 | 1404–1410 | **Operação:** Assinar exige destinos completos e consulta a estrutura; regra fora da avaliação de UI. |
| 31 | 1390 | 1413 | **Operação:** Atualiza seleção após extinção com destino válido; mesma tela e mensagem-base. |
| 32 | 1392 | 1415 | **Estado do botão:** Assinar usa wide off enquanto faltam destinos; reutiliza o estado off original. |
| 33 | 1394 | 1417 | **Texto:** Troca a proposta da Casa Civil por distribuição das atribuições. |
| 34 | 1397 | 1420 | **Texto:** Retira precedente/reação genérica e explica a escolha de destinos pendente. |
| 35 | 1405–1406 | 1428–1429 | **Distribuição:** Escolha em lote e recomeço reutilizam os botões; não retomam destinos históricos. |
| 36 | 1412–1413 | 1435–1437 | **Operações e controles:** Extinção explícita, atalhos de divisão e três novas ações no painel; estilos originais conservados. |
| 37 | 1415–1417 | 1439–1441 | **Operações inversas:** Desfazer, recriar e desistir consultam a estrutura atual; mesmas variantes de botão e painel. |
| 38 | 1425 | 1449 | **Compatibilidade de IDs:** Lista de pessoas de nova pasta usa o perfil original, mantendo os retratos e as fichas. |
| 39 | 1482 | 1506 | **Informação disponível:** Mensagem de nomeação não inventa apoio após reforma; movimento do retrato continua em lockIn, idêntico. |
| 40 | 1492 | 1516 | **Informação disponível:** Ganho vira travessão se desconhecido. Todas as demais propriedades, classes e eventos da linha são idênticos. |
| 41 | 1497 | 1521 | **Informação disponível:** Ficha declara estimativa ausente; montagem, estatísticas e estilo são os originais. |
| 42 | 1506 | 1530 | **Informação disponível:** Hint de ordenação por votos declara a lacuna; os quatro botões e seu click conservados. |
| 43 | 1514 | 1538 | **Informação disponível:** Mensagem de exoneração declara apoio desconhecido; botão e remoção do titular usam os gestos existentes. |
| 44 | 1561 | 1585 | **Captura:** Registra a seleção antes da foto; transição para photo e hover permanecem iguais. |
| 45 | 1563 | 1587 | **Informação disponível:** Resumo da foto declara lacuna da estimativa; molduras e animações continuam originais. |
| 46 | 1566 | 1590 | **Informação disponível:** Legenda e travessão na base desconhecida; mesmo medidor e classes. |
| 47 | 1572 | 1596–1597 | **Campos novos:** Liga os dois campos condicionais ao estado; classes e eventos do restante do painel preservados. |

## Conferência no navegador

A [comparação de gestos](posse-comparison-recovery-2026-09-30.json) passou em 42 percursos agrupados, nas duas versões e em 1440×980/900: criação, cerimônia, filtros, ordenação, hover, fichas, nomeação, troca, remanejamento, exoneração, junções e inversas, extinção, distribuição, divisão, foto, retorno e duas recargas. A versão nova também foi exercitada com extinções encadeadas e restauração fora de ordem.

A [medição do movimento](posse-motion-2026-09-30.json) cobre 16 aberturas/recargas, incluindo atraso controlado de 300 ms. Antes, a versão nova expunha o template cru; [registro anterior](../../evidence/posse-motion-before-2026-09-30.json). Depois, ambas tiveram zero quadros de template exposto, quadros intermediários da entrada e as mesmas durações, curvas e atrasos. Quatro percursos adicionais mediram cerimônia, hover, ficha, passo e foto, comparando as propriedades computadas e preservação dos elementos entre renderizações.

[Criação, renomeação e transferência](posse-reforms-2026-09-30.json) passaram nas duas alturas com ícone herdado da Saúde, campo de nome, filtro por atribuição, pessoa remanejada sem duplicação, pasta vazia, desistência e F5. A operação institucional ainda pendente conserva o estado e a proposta na tela.

A [conferência de teclado e controles](../../evidence/posse-controls-2026-09-30.json) passou em oito percursos: duas versões, duas alturas, movimento normal e reduzido. Tabulação, foco visível, ficha partidária ao receber foco e isolamento da tela ativa são iguais. Os keyframes completos do voo e pulso são idênticos, inclusive posições e escalas; com movimento reduzido nenhum dos dois é emitido. Cerimônia, seleção, nomeação, foto e retorno foram acionados por teclado.

A igualdade do código de apresentação não prova todas as combinações possíveis de conteúdo, zoom ou crescimento ilimitado da estrutura. Revisão independente dos sistemas continua pendente. Novos achados de UI devem ser reproduzidos e corrigidos pela referência do Claude.

Reproduzir a comparação estática: `node tools/audit-posse-ui.mjs`. As provas dinâmicas estão em `tests/browser/posse-comparison.mjs`, `posse-motion.mjs`, `posse-reforms.mjs` e `posse-controls.mjs`.
