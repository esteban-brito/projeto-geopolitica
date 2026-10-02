/* PALAVRAS QUE SÓ EXISTEM COM ACENTO em português, tiradas dos documentos do projeto: entra só
   a forma cuja grafia sem acento aparece em menos de 2% das ocorrências. Fica de fora a ambígua
   e a que também é verbo ou outra palavra: e/é, esta/está, a/à, tem/têm, divida/dívida,
   renuncia/renúncia, pais/país. */

const PAIRS = `
acao ação · acessivel acessível · acoes ações · acumulo acúmulo · acusacao acusação · acusacoes acusações · afirmacao afirmação · agricola agrícola
agua água · alcancadas alcançadas · alcancado alcançado · alcancar alcançar · alcancava alcançava · alcancavel alcançável · alcancou alcançou · aleatorio aleatório
alem além · alguem alguém · alivio alívio · alocacao alocação · alteracao alteração · amanha amanhã · ambar âmbar · ambicao ambição
ambicoes ambições · ameaca ameaça · analitica analítica · analiticas analíticas · ancoras âncoras · angulo ângulo · animacao animação · animacoes animações
anonima anônima · apareca apareça · aplicacao aplicação · aprovacao aprovação · aprovacoes aprovações · arbitrario arbitrário · arcabouco arcabouço · area área
areas áreas · aritmetica aritmética · arquetipo arquétipo · arquetipos arquétipos · arrecadacao arrecadação · arvore árvore · assercao asserção · assimetrica assimétrica
assimetrico assimétrico · assistencia assistência · ate até · atencao atenção · ativacao ativação · atras atrás · ausencia ausência · automatica automática
automaticas automáticas · automatico automático · autoritaria autoritária · avaliacao avaliação · avaliacoes avaliações · avanca avança · avancar avançar · avanco avanço
balanco balanço · basica básica · beneficio benefício · bilhao bilhão · binaria binária · bonus bônus · bordo bordô · botao botão
botoes botões · braco braço · brasao brasão · ca cá · cabeca cabeça · cabecalho cabeçalho · caiam caíam · caido caído
cairam caíram · cairem caírem · calendario calendário · camera câmera · capsula cápsula · cartao cartão · cartoes cartões · catalogo catálogo
celula célula · celulas células · citacao citação · clausulas cláusulas · cobranca cobrança · codigo código · coincidencia coincidência · colecao coleção
colisao colisão · combinacao combinação · combinacoes combinações · comeca começa · comecam começam · comecando começando · comecar começar · comecaria começaria
comecava começava · comeco começo · comecou começou · comentario comentário · comentarios comentários · comissao comissão · comparacao comparação · comparaveis comparáveis
complementacao complementação · compoe compõe · compressao compressão · concluido concluído · conclusao conclusão · condicao condição · confianca confiança · configuracao configuração
confirmacao confirmação · confortavel confortável · consequencia consequência · constroi constrói · construcao construção · construida construída · contencao contenção · conteudo conteúdo
conteudos conteúdos · contracao contração · contradicao contradição · contraditorias contraditórias · contrario contrário · contribuicao contribuição · convencao convenção · conveniencia conveniência
conversao conversão · conviccao convicção · copias cópias · correcao correção · correspondencia correspondência · credito crédito · crenca crença · crencas crenças
criterio critério · dai daí · dao dão · datilografo datilógrafo · decima décima · decisao decisão · decisoes decisões · declaracao declaração
declaracoes declarações · decoracao decoração · defensavel defensável · deficit déficit · definicao definição · deformacao deformação · degrades degradês · demao demão
democratico democrático · dependencia dependência · descricao descrição · desoneracao desoneração · despadronizacao despadronização · destruida destruída · destruidas destruídas · deteccao detecção
deterioracao deterioração · deterministica determinística · deterministico determinístico · diagnostico diagnóstico · dialogo diálogo · dialogos diálogos · diario diário · diferenca diferença
dificil difícil · digito dígito · digitos dígitos · dinamica dinâmica · dinamico dinâmico · direcao direção · direcoes direções · diretorio diretório
discricionaria discricionária · discricionarias discricionárias · discricionario discricionário · discussao discussão · disfarcada disfarçada · dispersao dispersão · disponiveis disponíveis · disponivel disponível
dissidencia dissidência · distincao distinção · distribuicao distribuição · divergencia divergência · divisao divisão · divisoes divisões · documentacao documentação · doi dói
dossie dossiê · doutrinaria doutrinária · dramatico dramático · duplicacao duplicação · duracao duração · economica econômica · economico econômico · edicao edição
editavel editável · eleicao eleição · elevacao elevação · empirico empírico · empurrao empurrão · endereco endereço · enderecos endereços · entao então
envoltorio envoltório · epigrafe epígrafe · epoca época · equacoes equações · equilibrio equilíbrio · escavacao escavação · espaca espaça · espacamentos espaçamentos
espaco espaço · espacos espaços · especie espécie · especies espécies · estagio estágio · estagios estágios · estao estão · estatica estática
estaticas estáticas · estatico estático · estaticos estáticos · estatistica estatística · estavel estável · estrategicos estratégicos · excecao exceção · excecoes exceções
excelencia excelência · excelentissimo excelentíssimo · exclusao exclusão · execucao execução · executavel executável · exercicio exercício · exibicao exibição · exigencia exigência
exigencias exigências · existencia existência · exogeno exógeno · expansao expansão · explicacao explicação · explicito explícito · expoe expõe · exportacao exportação
exposicao exposição · extensao extensão · extraido extraído · faisca faísca · faiscas faíscas · familia família · familias famílias · ficcao ficção
financas finanças · fisica física · fisico físico · fisiologico fisiológico · flutuacao flutuação · forcada forçada · forcar forçar · forcas forças
formatacao formatação · formulario formulário · formulas fórmulas · fracao fração · fracoes frações · frequencia frequência · funcao função · funcoes funções
fusao fusão · gemeo gêmeo · generica genérica · generico genérico · genero gênero · geometrica geométrica · geracao geração · graca graça
grafico gráfico · grao grão · gravacao gravação · ha há · historia história · historica histórica · historico histórico · homonimo homônimo
homonimos homônimos · icone ícone · icones ícones · identica idêntica · identicas idênticas · identico idêntico · identicos idênticos · ideologica ideológica
ideologico ideológico · iluminacao iluminação · implementacoes implementações · implicita implícita · impossivel impossível · imutavel imutável · inalcancaveis inalcançáveis · inalcancavel inalcançável
inclinacao inclinação · incluido incluído · incluidos incluídos · independencia independência · indicacao indicação · indice índice · indices índices · indistinguivel indistinguível
industria indústria · inercia inércia · inflacao inflação · ingles inglês · inicio início · inspiracao inspiração · instancias instâncias · instantaneo instantâneo
inteligencia inteligência · intencao intenção · interpolacao interpolação · interrupcao interrupção · intuicao intuição · invalido inválido · inversao inversão · inves invés
invisivel invisível · irma irmã · irmao irmão · irmaos irmãos · irmas irmãs · ja já · jacaranda jacarandá · jogavel jogável
juizo juízo · juncao junção · juridico jurídico · juridiques juridiquês · justificacao justificação · laco laço · lamina lâmina · lanca lança
lancar lançar · latao latão · le lê · legitima legítima · legitimo legítimo · legivel legível · licao lição · lider líder
lideres líderes · ligacoes ligações · lingua língua · liquido líquido · luminancia luminância · macroeconomicos macroeconômicos · mao mão · maquina máquina
marcacao marcação · mascara máscara · matematica matemática · materia matéria · maxima máxima · maximo máximo · meca meça · mecanica mecânica
medicao medição · medio médio · memoria memória · merito mérito · mes mês · metalico metálico · metrica métrica · migracao migração
milhao milhão · minima mínima · minimos mínimos · ministerio ministério · ministerios ministérios · minuscula minúscula · minusculas minúsculas · minusculo minúsculo
miuda miúda · modulo módulo · modulos módulos · monoespacada monoespaçada · movel móvel · mudanca mudança · multiplos múltiplos · mutavel mutável
nao não · navegacao navegação · necessarios necessários · negacao negação · negociacao negociação · ninguem ninguém · nitido nítido · niveis níveis
nivel nível · numerica numérica · numerico numérico · numero número · numeros números · obrigacao obrigação · obrigatoria obrigatória · obrigatorio obrigatório
obrigatorios obrigatórios · obstrucao obstrução · obvio óbvio · ocorrencia ocorrência · ocorrencias ocorrências · oficio ofício · oficios ofícios · omissao omissão
opcao opção · opcoes opções · operacao operação · operacoes operações · opiniao opinião · oposicao oposição · orcamentaria orçamentária · orcamentarias orçamentárias
orcamentario orçamentário · orfa órfã · orfao órfão · orfas órfãs · organizacao organização · orgaos órgãos · orientacao orientação · oscilacao oscilação
otimo ótimo · padrao padrão · pagina página · paises países · papeis papéis · paragrafo parágrafo · paragrafos parágrafos · parametrizacao parametrização
parametro parâmetro · parametros parâmetros · parenteses parênteses · pe pé · peca peça · pecas peças · pedaco pedaço · pedacos pedaços
percepcao percepção · perceptivel perceptível · periodo período · persistencia persistência · pessimo péssimo · pilula pílula · plastico plástico · plausivel plausível
poe põe · poem põem · policia polícia · politicas políticas · politico político · pontuacao pontuação · portao portão · portugues português
posicao posição · posicoes posições · possiveis possíveis · possivel possível · precedencia precedência · precisao precisão · preco preço · preferencia preferência
premio prêmio · presenca presença · pressao pressão · prestacao prestação · previdencia previdência · previdenciaria previdenciária · previsao previsão · previsivel previsível
primaria primária · primario primário · privilegio privilégio · procedencia procedência · producao produção · proibe proíbe · projecao projeção · projecoes projeções
prontidao prontidão · propagacao propagação · proporcao proporção · proposito propósito · propria própria · proprias próprias · proprio próprio · proprios próprios
protecao proteção · prototipo protótipo · proxima próxima · proximo próximo · publicacao publicação · publico público · punicao punição · puxao puxão
qualificacao qualificação · quorum quórum · raizes raízes · rapida rápida · razao razão · razoavel razoável · razoes razões · reacao reação
recem recém · recencia recência · recessao recessão · recomeca recomeça · recomecar recomeçar · reconheciveis reconhecíveis · reconhecivel reconhecível · reconsideracao reconsideração
reconstruido reconstruído · reeleicao reeleição · refatoracao refatoração · referencias referências · reformulacao reformulação · refracao refração · regiao região · regua régua
reguas réguas · reinicio reinício · relacao relação · relatorio relatório · relogio relógio · remocao remoção · renderizacao renderização · reparticao repartição
repertorio repertório · repeticao repetição · repetivel repetível · reproduzivel reproduzível · reputacao reputação · requisicao requisição · residuo resíduo · resistencia resistência
responsavel responsável · restricao restrição · retangulos retângulos · retencao retenção · reticencia reticência · reune reúne · reutilizaveis reutilizáveis · revisao revisão
revogacao revogação · rodape rodapé · rotulo rótulo · rotulos rótulos · ruido ruído · saiam saíam · saida saída · saidas saídas
saido saído · sairam saíram · saisse saísse · sao são · satisfacao satisfação · saturacao saturação · saudavel saudável · secao seção
secoes seções · seguranca segurança · selecao seleção · senao senão · separacao separação · sequencia sequência · serie série · series séries
servicos serviços · sessao sessão · sessoes sessões · setima sétima · silencio silêncio · simbolo símbolo · simetrica simétrica · simetricas simétricas
simulacao simulação · sintetica sintética · sinteticas sintéticas · sintetico sintético · situacao situação · so só · sobreposicao sobreposição · solitario solitário
solucao solução · suavizacao suavização · substancia substância · subtracao subtração · subvencao subvenção · sucessao sucessão · superavit superávit · superficie superfície
superficies superfícies · supersessao supersessão · sustentacao sustentação · tabua tábua · tambem também · tao tão · tecnico técnico · tendencia tendência
tentacao tentação · teorico teórico · tercos terços · termino término · termometro termômetro · territorio território · tipografica tipográfica · tipografico tipográfico
titulo título · titulos títulos · tolerancia tolerância · traco traço · tracos traços · traducao tradução · traicao traição · tramitacao tramitação
transferencia transferência · transformacao transformação · translucida translúcida · translucido translúcido · tras trás · tres três · triangulo triângulo · tributaria tributária
tributario tributário · trilhao trilhão · ultima última · ultimo último · ultimos últimos · unica única · unico único · urgencia urgência
usuario usuário · util útil · utilitario utilitário · validacao validação · validas válidas · validos válidos · vao vão · vaos vãos
variacao variação · variacoes variações · variavel variável · ve vê · verificacao verificação · verificavel verificável · versao versão · versoes versões
vespera véspera · veu véu · vigencia vigência · vigilancia vigilância · vinculacao vinculação · vinculacoes vinculações · violacao violação · virgula vírgula
visao visão · visiveis visíveis · visivel visível · vocabulario vocabulário · votacao votação · votacoes votações
`;

/** @type {Map<string, string>} */
export const ACCENTED = new Map(
  PAIRS.split(/\s*·\s*|\n/)
    .map(pair => pair.trim())
    .filter(Boolean)
    .map(pair => /** @type {[string, string]} */ (pair.split(" "))),
);
