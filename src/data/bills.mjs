/* AS ACOES — tudo o que o presidente pode pautar ou decretar.
   ══════════════════════════════════════════════════════════════════════════════

   ⚠ FICCAO com inspiracao na realidade, como todo o catalogo. Os titulos evocam
   debates reconheciveis de proposito — reconhecimento e o que faz o jogador ter
   intuicao sobre quem vai votar como antes de entender a matematica —, mas
   nenhum numero aqui e afirmacao sobre proposta real nenhuma.

   PAUTA PRONTA E NAO VETOR LIVRE. O jogador escolhe O QUE pautar, QUANDO e
   QUANTO liberar, e nao onde a lei fica no mapa. Controle vetorial livre viraria
   um problema de otimizacao — bastaria arrastar o projeto para o meio da maior
   bancada — e o jogo deixaria de ser sobre negociar para ser sobre calibrar um
   cursor.

   ── AS TRES VIAS, E ELAS SAO TRES JOGOS ──────────────────────────────────────
   O instrumento nao e rotulo de realismo: ele decide o recurso que a acao
   consome, e por isso cada via faz uma pergunta diferente.

     `law`        257 votos. "Quem eu convenco com verba?" — o jogo que ja
                  existia, e o grosso do catalogo;
     `amendment`  308 votos. "Como eu monto tres quintos?" Nenhuma coalizao de
                  duas bancadas fecha, entao dinheiro sozinho nao basta;
     `decree`     nenhum voto. "Vale agir agora e pagar depois?" O efeito e
                  imediato e a conta chega em atrito com quem foi passado por
                  cima.

   ── O TERMO DE AMEACA, e o defeito que ele conserta ──────────────────────────
   `threat` (0 a 1) e o quanto a pauta ataca a MAQUINA — foro privilegiado,
   emendas, cargo, impunidade. Ele existe porque distancia e venalidade sozinhas
   nao conseguem dizer "eu nao voto na lei que me acaba".

   O buraco foi medido, e nao suposto. Rodando o vetor anticorrupcao contra o
   catalogo real, o centrao aparecia como o bloco MAIS PROXIMO (resistencia 23,5
   de um maximo de 141) e o mais barato de comprar — ou seja, ele votaria alegre
   pela propria extincao por preco modico.

   A correcao inverte a relacao habitual. Normalmente a venalidade REDUZ a
   resistencia; numa pauta que ataca a maquina ela a AUMENTA, porque o que esta
   sob ataque e a propria moeda da barganha. Ver `src/domain/congress/`.

   ── POR QUE O FIM DO FORO E LEI, E NAO EMENDA ────────────────────────────────
   Decisao consciente, e ela custou uma medicao. Com `threat` 0,95, a pauta
   alcanca 297 votos no melhor cenario possivel — verba cheia e lealdade cheia.
   Isso passa com folga em 257 e NAO alcanca 308. Como emenda, ela seria a unica
   acao do catalogo literalmente impossivel, e o principio do projeto e que tudo
   tem um jeito de ser feito: o que separa o possivel do impossivel e o preco.

   Havia duas saidas. Baixar a ameaca para caber em 308 destruiria a unica
   demonstracao extrema do termo que o catalogo tem. Deixa-la em 257 preserva as
   duas coisas — a pauta segue a mais cara do jogo, e segue possivel. A prova
   `NENHUMA PAUTA E INVOTAVEL` cobra isso a cada execucao, agora contra o quorum
   DE CADA ACAO e nao mais contra um so. */

import { QUALIFIED_MAJORITY, SIMPLE_MAJORITY } from "./regime.mjs";

/** @typedef {import("./schema.mjs").Schema} Schema */

/** As tres vias. Ordenadas por quanto custa executar, da mais cara para a mais barata. */
export const INSTRUMENTS = /** @type {const} */ (["amendment", "law", "decree"]);

/** @type {Schema} */
export const BILL_SCHEMA = {
  id: { kind: "id" },
  label: { kind: "text" },
  area: { kind: "id" },
  instrument: { kind: "text" },
  economic: { kind: "number", min: 0, max: 100 },
  liberty: { kind: "number", min: 0, max: 100 },
  threat: { kind: "number", min: 0, max: 1 },
  fiscalImpact: { kind: "number", min: -400, max: 400 },
  impact: { kind: "number", min: -20, max: 20 },
};

/**
 * @typedef {object} Bill
 * @property {string} id
 * @property {string} label
 * @property {string} area - a area de governo a que ela pertence
 * @property {string} instrument - uma de `INSTRUMENTS`
 * @property {number} economic - posicao no eixo economico
 * @property {number} liberty - posicao no eixo de liberdades individuais
 * @property {number} threat - o quanto ataca a maquina; inegociavel por verba
 * @property {number} fiscalImpact - efeito anual no resultado, em bilhoes;
 *   positivo poupa ou arrecada, negativo custa
 * @property {number} impact - quanto move o indice da area, de uma vez
 */

/**
 * Quantos votos a acao exige. Decreto devolve zero: ele nao vai a plenario.
 *
 * O quorum e DERIVADO do instrumento e nao declarado por acao — uma fonte so.
 * Declarado por acao, a primeira lei com 308 digitado a mao viraria uma regra
 * nova que ninguem escreveu.
 *
 * ⚠ ELE PEDE O INSTRUMENTO, E NAO UMA `Bill` INTEIRA, e isso deixou de ser
 * detalhe: a pauta do jogo passou a ser COMPOSTA do orcamento em
 * `src/application/agenda.mjs`, e uma proposta derivada nao tem `impact` nem
 * `id` de catalogo. Exigir a forma inteira aqui obrigaria quem compoe a fabricar
 * campos so para satisfazer uma assinatura — e campo fabricado para agradar tipo
 * e a origem de metade dos numeros que ninguem sabe explicar.
 *
 * @param {{ instrument: string }} bill
 * @returns {number}
 */
export function quorumOf(bill) {
  if (bill.instrument === "amendment") return QUALIFIED_MAJORITY;
  if (bill.instrument === "decree") return 0;
  return SIMPLE_MAJORITY;
}

/** @type {ReadonlyArray<Bill>} */
export const BILLS = [
  /* ── FAZENDA ─────────────────────────────────────────────────────────────
     De onde vem o dinheiro. O indice da area e a ARRECADACAO, e repare que ela
     nao anda junto com o resultado fiscal: refinanciar divida ARRECADA agora e
     derruba a eficiencia da cobranca, porque ensina que a proxima anistia vem. */
  {
    id: "reforma-administrativa",
    label: "Reforma administrativa",
    area: "treasury",
    instrument: "amendment",
    economic: 78,
    /* QUASE NEUTRA no eixo de liberdades, e a primeira versao errava nisso: ela
       estava em 30, como se enxugar a maquina restringisse a vida das pessoas.
       O erro nao ficou no papel — a medicao mostrou a direita liberal, que
       deveria adorar esta pauta, entregando 30% dela. */
    liberty: 48,
    /* Ameaca MODERADA: mexe em cargo e estabilidade, que sao parte da maquina,
       mas nao tocam em foro nem em emenda. A primeira versao chutou 0,55 e a
       medicao mostrou que era alto demais: a pauta empacava em 217 de 257 mesmo
       com verba e lealdade cheias, ou seja, virava parede. */
    threat: 0.35,
    fiscalImpact: 48,
    impact: 6,
  },
  {
    id: "reforma-tributaria-do-consumo",
    label: "Reforma tributária do consumo",
    area: "treasury",
    /* CENTRISTA E DE AMEACA BAIXA de proposito, e e ela que demonstra o desenho
       das emendas: uma pauta consensual alcanca os 308 com folga, uma pauta de
       trincheira nao alcanca nunca. Tres quintos nao e um numero maior, e uma
       exigencia de COALIZAO — e coalizao ampla so existe no centro. */
    instrument: "amendment",
    economic: 58,
    liberty: 52,
    threat: 0.18,
    fiscalImpact: 85,
    impact: 9,
  },
  {
    id: "taxacao-grandes-fortunas",
    label: "Taxação de grandes fortunas",
    area: "treasury",
    instrument: "law",
    economic: 12,
    liberty: 68,
    threat: 0.2,
    fiscalImpact: 32,
    impact: 2,
  },
  {
    id: "fim-das-desoneracoes",
    label: "Fim das desonerações setoriais",
    area: "treasury",
    instrument: "law",
    economic: 56,
    liberty: 50,
    /* AMEACA ALTA numa pauta que parece tecnica, e a razao e o que o termo
       modela: desoneracao setorial e moeda de bancada, e tira-la ataca a
       maquina tanto quanto mexer em emenda. */
    threat: 0.42,
    fiscalImpact: 38,
    impact: 4,
  },
  {
    id: "isencao-do-imposto-de-renda",
    label: "Isenção do imposto de renda até 5 salários",
    area: "treasury",
    instrument: "law",
    economic: 30,
    liberty: 62,
    threat: 0.05,
    fiscalImpact: -52,
    impact: -2,
  },
  {
    id: "fiscalizacao-aduaneira",
    label: "Reforço da fiscalização aduaneira",
    area: "treasury",
    instrument: "decree",
    economic: 58,
    liberty: 40,
    threat: 0.3,
    fiscalImpact: 9,
    impact: 6,
  },

  /* ── INDUSTRIA E AGRO ───────────────────────────────────────────────────────
     ⚠ ELAS ERAM UMA AREA SO, e o argumento escrito aqui era que o licenciamento
     expresso e a fiscalizacao ambiental disputavam a MESMA verba na MESMA tela.
     Em 14/08/2026 "Producao" virou duas — Agricultura, e Industria e
     Infraestrutura —, e o argumento inverteu de sinal: o conflito passou a ser
     ENTRE duas telas, que e onde ele acontece no Congresso. As duas pautas
     ambientais ficaram do lado do agro de proposito, porque e a lavoura que elas
     embargam.

     ⚠ ESTE ARQUIVO INTEIRO E CATALOGO APOSENTADO. As pautas prontas morreram
     quando o orcamento granular nasceu — a pauta agora e DERIVADA do que o
     jogador moveu, em `src/application/agenda.mjs`. Ele sobrevive porque as
     suites do Congresso e das telas montam casos com ele, e esta na lista de
     achados do handoff para virar fixture de teste ou morrer. */
  {
    id: "abertura-comercial",
    label: "Abertura comercial",
    area: "industry",
    instrument: "law",
    economic: 95,
    liberty: 58,
    threat: 0.12,
    fiscalImpact: 18,
    impact: 5,
  },
  {
    id: "programa-habitacional",
    label: "Programa habitacional",
    area: "industry",
    instrument: "law",
    economic: 26,
    liberty: 62,
    threat: 0.05,
    fiscalImpact: -140,
    impact: 7,
  },
  {
    id: "marco-do-saneamento",
    label: "Marco legal do saneamento",
    area: "industry",
    instrument: "law",
    economic: 82,
    liberty: 56,
    threat: 0.15,
    fiscalImpact: 14,
    impact: 6,
  },
  {
    id: "reforma-trabalhista",
    label: "Reforma trabalhista",
    area: "industry",
    instrument: "law",
    economic: 88,
    liberty: 54,
    threat: 0.1,
    fiscalImpact: 22,
    impact: 6,
  },
  {
    id: "licenciamento-expresso",
    label: "Licenciamento ambiental expresso",
    area: "agriculture",
    instrument: "amendment",
    economic: 80,
    liberty: 44,
    threat: 0.3,
    fiscalImpact: 8,
    impact: 7,
  },
  {
    id: "fiscalizacao-ambiental",
    label: "Operação de fiscalização ambiental",
    area: "agriculture",
    instrument: "decree",
    economic: 24,
    liberty: 56,
    threat: 0.22,
    fiscalImpact: -11,
    /* IMPACTO NEGATIVO na capacidade, e isso NAO e um julgamento sobre meio
       ambiente: a area mede parque produtivo instalado, e fiscalizar embarga
       obra e frente de lavra no curto prazo. O ganho ambiental nao tem onde ser
       contado enquanto o motor macroeconomico e o de opiniao nao existirem, e
       fingir que tem seria inventar um indicador. Fica declarado como divida. */
    impact: -4,
  },

  /* ── PREVIDENCIA ─────────────────────────────────────────────────────────
     A area cujo indice E a despesa obrigatoria, e por isso `lag` zero. O
     salario minimo mora aqui, e nao em trabalho, porque e por aqui que ele
     morde: ele indexa beneficio, e e essa indexacao que infla a obrigatoria. */
  {
    id: "reforma-da-previdencia",
    label: "Reforma da previdência",
    area: "welfare",
    instrument: "amendment",
    economic: 80,
    liberty: 50,
    threat: 0.38,
    fiscalImpact: 120,
    impact: -9,
  },
  {
    id: "reajuste-do-salario-minimo",
    label: "Reajuste real do salário mínimo",
    area: "welfare",
    instrument: "law",
    economic: 22,
    liberty: 56,
    threat: 0.05,
    fiscalImpact: -78,
    impact: 6,
  },
  {
    id: "desindexacao-do-bpc",
    label: "Desindexação do BPC",
    area: "welfare",
    instrument: "amendment",
    economic: 82,
    liberty: 44,
    threat: 0.34,
    fiscalImpact: 54,
    impact: -7,
  },
  {
    id: "ampliacao-do-bpc",
    label: "Ampliação do BPC",
    area: "welfare",
    instrument: "law",
    economic: 16,
    liberty: 64,
    threat: 0.05,
    fiscalImpact: -46,
    impact: 7,
  },
  {
    id: "pente-fino-nos-beneficios",
    label: "Pente-fino nos benefícios",
    area: "welfare",
    instrument: "decree",
    economic: 74,
    liberty: 36,
    threat: 0.18,
    fiscalImpact: 28,
    impact: -6,
  },
  {
    id: "mutirao-de-pericia",
    label: "Mutirão de perícia médica",
    area: "welfare",
    instrument: "decree",
    economic: 44,
    liberty: 56,
    threat: 0.05,
    fiscalImpact: -7,
    impact: 7,
  },

  /* ── SAUDE ───────────────────────────────────────────────────────────────── */
  {
    id: "piso-da-enfermagem",
    label: "Piso da enfermagem",
    area: "health",
    instrument: "law",
    economic: 22,
    liberty: 58,
    threat: 0.08,
    fiscalImpact: -34,
    impact: 5,
  },
  {
    id: "carreira-medica-federal",
    label: "Carreira médica federal",
    area: "health",
    instrument: "law",
    economic: 30,
    liberty: 54,
    /* Ameaca alta para uma pauta de saude, e com motivo: carreira de Estado
       tira do parlamentar a indicacao de quem ocupa o posto no interior. */
    threat: 0.4,
    fiscalImpact: -48,
    impact: 8,
  },
  {
    id: "farmacia-popular-ampliada",
    label: "Farmácia popular ampliada",
    area: "health",
    instrument: "law",
    economic: 18,
    liberty: 60,
    threat: 0.05,
    fiscalImpact: -27,
    impact: 4,
  },
  {
    id: "gestao-hospitalar-por-resultado",
    label: "Gestão hospitalar por resultado",
    area: "health",
    instrument: "amendment",
    economic: 72,
    liberty: 52,
    threat: 0.3,
    fiscalImpact: 19,
    impact: 6,
  },
  {
    id: "telemedicina-regulamentada",
    label: "Telemedicina regulamentada",
    area: "health",
    instrument: "decree",
    economic: 58,
    liberty: 64,
    threat: 0.05,
    fiscalImpact: -4,
    impact: 5,
  },
  {
    id: "emergencia-sanitaria",
    label: "Emergência sanitária nacional",
    area: "health",
    instrument: "decree",
    economic: 30,
    liberty: 34,
    threat: 0.1,
    fiscalImpact: -22,
    impact: 8,
  },

  /* ── EDUCACAO ────────────────────────────────────────────────────────────
     A area de `lag` 24. Toda acao daqui e cara agora e paga depois do mandato —
     e o catalogo nao compensa isso com impacto maior, de proposito. */
  {
    id: "reforma-do-ensino-medio",
    label: "Reforma do ensino médio",
    area: "education",
    instrument: "law",
    economic: 60,
    liberty: 48,
    threat: 0.2,
    fiscalImpact: -40,
    impact: 7,
  },
  {
    id: "piso-do-magisterio",
    label: "Piso nacional do magistério",
    area: "education",
    instrument: "law",
    economic: 20,
    liberty: 58,
    threat: 0.1,
    fiscalImpact: -52,
    impact: 5,
  },
  {
    id: "escolas-civico-militares",
    label: "Escolas cívico-militares",
    area: "education",
    instrument: "law",
    economic: 56,
    liberty: 22,
    threat: 0.05,
    fiscalImpact: -18,
    impact: 3,
  },
  {
    id: "novo-fundeb",
    label: "Novo FUNDEB ampliado",
    area: "education",
    instrument: "amendment",
    economic: 26,
    liberty: 60,
    threat: 0.24,
    fiscalImpact: -88,
    impact: 10,
  },
  {
    id: "bolsa-de-permanencia",
    label: "Bolsa de permanência universitária",
    area: "education",
    instrument: "decree",
    economic: 24,
    liberty: 66,
    threat: 0.05,
    fiscalImpact: -14,
    impact: 4,
  },
  {
    id: "avaliacao-nacional",
    label: "Avaliação nacional obrigatória",
    area: "education",
    instrument: "decree",
    economic: 62,
    liberty: 46,
    threat: 0.1,
    fiscalImpact: -6,
    impact: 5,
  },

  /* ── SEGURANCA ───────────────────────────────────────────────────────────── */
  {
    id: "pec-seguranca-publica",
    label: "PEC da segurança pública",
    area: "security",
    instrument: "amendment",
    economic: 58,
    liberty: 16,
    threat: 0.1,
    fiscalImpact: -22,
    impact: 7,
  },
  {
    id: "fim-do-foro-privilegiado",
    label: "Fim do foro privilegiado",
    area: "security",
    /* LEI, e nao emenda — a decisao esta justificada no cabecalho deste arquivo:
       com ameaca 0,95 ela alcanca 297 no melhor cenario possivel, o que passa em
       257 e nao alcanca 308. Como emenda seria a unica acao impossivel do
       catalogo, e o projeto nao tem muro, so preco. */
    instrument: "law",
    economic: 50,
    /* Acima do meio: submeter autoridade ao mesmo juiz que julga todo mundo E
       liberdade — o privilegio e o que restringe. */
    liberty: 58,
    /* O caso extremo, e a razao de o termo de ameaca existir. Fiscalmente e
       quase neutra, ideologicamente e centrista — sem o termo ela passaria
       facil. */
    threat: 0.95,
    fiscalImpact: 3,
    impact: 3,
  },
  {
    id: "endurecimento-penal",
    label: "Endurecimento penal",
    area: "security",
    instrument: "law",
    economic: 60,
    liberty: 12,
    threat: 0.05,
    fiscalImpact: -35,
    impact: 5,
  },
  {
    id: "integracao-das-policias",
    label: "Integração das polícias",
    area: "security",
    instrument: "law",
    economic: 56,
    liberty: 30,
    threat: 0.15,
    fiscalImpact: -16,
    impact: 6,
  },
  {
    id: "garantia-da-lei-e-da-ordem",
    label: "Garantia da lei e da ordem",
    area: "security",
    instrument: "decree",
    economic: 54,
    /* O extremo do eixo de liberdade no catalogo. Tropa na rua e o caso que o
       eixo foi desenhado para acomodar: nao e pauta de costumes, e restricao
       direta do que a pessoa pode fazer. */
    liberty: 8,
    threat: 0.1,
    fiscalImpact: -12,
    impact: 6,
  },
  {
    id: "protecao-a-testemunhas",
    label: "Programa de proteção a testemunhas",
    area: "security",
    instrument: "decree",
    economic: 40,
    liberty: 56,
    threat: 0.38,
    fiscalImpact: -9,
    impact: 4,
  },
];
