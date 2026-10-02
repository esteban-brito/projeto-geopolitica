/* O GABINETE — as 38 cadeiras de Ministro de Estado da Lei 14.600/2023 (art. 17, os 32
   ministérios; art. 2º é a lista dos Ministros de Estado, as 5 da Presidência e a AGU),
   conferidas no Planalto (pesquisa 15). `area` liga a cadeira que defende a verba
   de uma área do jogo; as pastas que dividem uma área com ela (Transportes, Minas e Energia,
   Desenvolvimento Social) ficam sem ligação até a área se dividir. */

/** @typedef {import("./schema.mjs").Schema} Schema */

/**
 * @typedef {object} Seat
 * @property {string} id
 * @property {string} label - o nome da lei
 * @property {"ministry" | "presidency" | "agu"} kind
 * @property {string} [area] - a área do jogo cuja verba ela defende
 */

/** @type {Schema} */
export const SEAT_SCHEMA = {
  id: { kind: "id" },
  label: { kind: "text" },
  kind: { kind: "text", values: ["ministry", "presidency", "agu"] },
  area: { kind: "id", optional: true },
};

/** @param {string} id @param {string} label @param {string} [area] @returns {Seat} */
const ministry = (id, label, area) =>
  area ? { id, label, kind: "ministry", area } : { id, label, kind: "ministry" };

/** @type {ReadonlyArray<Seat>} */
export const CABINET = [
  ministry("agricultura-e-pecuaria", "Ministério da Agricultura e Pecuária", "agriculture"),
  ministry("cidades", "Ministério das Cidades"),
  ministry("cultura", "Ministério da Cultura"),
  ministry("ciencia-tecnologia-e-inovacao", "Ministério da Ciência, Tecnologia e Inovação"),
  ministry("comunicacoes", "Ministério das Comunicações"),
  ministry("defesa", "Ministério da Defesa", "defense"),
  ministry(
    "desenvolvimento-agrario",
    "Ministério do Desenvolvimento Agrário e Agricultura Familiar",
  ),
  ministry(
    "integracao-e-desenvolvimento-regional",
    "Ministério da Integração e do Desenvolvimento Regional",
  ),
  ministry(
    "desenvolvimento-social",
    "Ministério do Desenvolvimento e Assistência Social, Família e Combate à Fome",
  ),
  ministry("direitos-humanos", "Ministério dos Direitos Humanos e da Cidadania"),
  ministry("fazenda", "Ministério da Fazenda", "treasury"),
  ministry("educacao", "Ministério da Educação", "education"),
  ministry(
    "empreendedorismo",
    "Ministério do Empreendedorismo, da Microempresa e da Empresa de Pequeno Porte",
  ),
  ministry("esporte", "Ministério do Esporte"),
  ministry("gestao-e-inovacao", "Ministério da Gestão e da Inovação em Serviços Públicos"),
  ministry("igualdade-racial", "Ministério da Igualdade Racial"),
  ministry(
    "desenvolvimento-industria",
    "Ministério do Desenvolvimento, Indústria, Comércio e Serviços",
    "industry",
  ),
  ministry("justica-e-seguranca-publica", "Ministério da Justiça e Segurança Pública", "security"),
  ministry("meio-ambiente", "Ministério do Meio Ambiente e Mudança do Clima"),
  ministry("minas-e-energia", "Ministério de Minas e Energia"),
  ministry("mulheres", "Ministério das Mulheres"),
  ministry("pesca-e-aquicultura", "Ministério da Pesca e Aquicultura"),
  ministry("planejamento-e-orcamento", "Ministério do Planejamento e Orçamento"),
  ministry("portos-e-aeroportos", "Ministério de Portos e Aeroportos"),
  ministry("povos-indigenas", "Ministério dos Povos Indígenas"),
  ministry("previdencia-social", "Ministério da Previdência Social", "welfare"),
  ministry("relacoes-exteriores", "Ministério das Relações Exteriores"),
  ministry("saude", "Ministério da Saúde", "health"),
  ministry("trabalho-e-emprego", "Ministério do Trabalho e Emprego"),
  ministry("transportes", "Ministério dos Transportes"),
  ministry("turismo", "Ministério do Turismo"),
  ministry("controladoria-geral-da-uniao", "Controladoria-Geral da União"),
  { id: "casa-civil", label: "Casa Civil da Presidência da República", kind: "presidency" },
  {
    id: "secretaria-geral",
    label: "Secretaria-Geral da Presidência da República",
    kind: "presidency",
  },
  {
    id: "relacoes-institucionais",
    label: "Secretaria de Relações Institucionais da Presidência da República",
    kind: "presidency",
  },
  {
    id: "comunicacao-social",
    label: "Secretaria de Comunicação Social da Presidência da República",
    kind: "presidency",
  },
  {
    id: "seguranca-institucional",
    label: "Gabinete de Segurança Institucional da Presidência da República",
    kind: "presidency",
  },
  { id: "advocacia-geral-da-uniao", label: "Advocacia-Geral da União", kind: "agu" },
];
