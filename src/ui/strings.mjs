/* TEXTO DA INTERFACE — todo ele, num lugar so.
   ══════════════════════════════════════════════════════════════════════════════
   Nenhuma frase vive solta dentro de um template. Duas razoes praticas: revisar
   copia passa a ser ler um arquivo em vez de cacar por quarenta; e o dia em que
   alguem quiser outro idioma, a fronteira ja existe — sem que isso custe uma
   camada de i18n agora. */

export const UI = {
  approvalLabel: "Aprovação do governo",
  approvalParts: {
    good: "Ótimo/bom",
    fair: "Regular",
    poor: "Ruim/péssimo",
  },
  context: {
    month: "Mês",
    mandate: "Mandato",
    congress: "Base aliada",
    situation: "Situação",
  },
  situation: {
    crisis: "Crise",
    stable: "Estável",
    growth: "Alta",
  },
  verdict: {
    crisis: "A rua cobra resposta — e o Congresso sabe disso",
    stable: "Governo em equilíbrio instável",
    growth: "Capital político em alta; a janela não fica aberta muito tempo",
  },
  actions: {
    advance: "Avançar o mês",
    advanceHint: "resolve o turno e propaga os efeitos",
    inspect: "Abrir o evento",
    inspectHint: "demonstra o padrão de diálogo",
  },
  dialog: {
    title: "Padrão de diálogo",
    body: "Este é o <dialog> nativo: foco, inércia do fundo, Escape e camada superior vêm do navegador, não de JavaScript escrito à mão.",
    close: "Entendi",
  },
  trend: {
    up: "▲",
    down: "▼",
    flat: "—",
  },
};
