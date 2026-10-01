import { writeFile } from "node:fs/promises";
import {
  operationPlans,
  OPERATION_PRIORITY,
  MANAGEMENT_PRIORITY,
} from "../prototypes/government/operations-cases.mjs";
import { runOperations } from "../prototypes/government/operations.mjs";
import { institutionalView } from "../prototypes/government/pilot.mjs";
import { PILOT_WORK, PILOT_INSTITUTIONS } from "../prototypes/government/pilot-cases.mjs";

const plans = operationPlans();
const experiments = [
  ...Object.entries(plans).map(([name, plan]) => ({ name, plan, priority: OPERATION_PRIORITY })),
  { name: "keepPrioritized", plan: plans.keep, priority: MANAGEMENT_PRIORITY },
];
const scenarios = Object.fromEntries(
  experiments.map(({ name, plan, priority }) => {
    let state = plan.operations;
    const periods = [];
    for (let period = 0; period < 5; period++) {
      const result = runOperations(plan.government, state, priority);
      state = result.state;
      periods.push({
        period: state.period,
        delivered: state.jobs.filter(job => job.executionLeft === 0).map(job => job.work),
        spent: state.funds.reduce((n, fund) => n + fund.spent, 0),
        pending: result.pending,
        trace: result.trace,
      });
    }
    return [
      name,
      {
        opening: plan.operations,
        priority,
        owners: plan.government.owner,
        legalUnresolved: institutionalView(plan.government, PILOT_WORK, PILOT_INSTITUTIONS).flatMap(
          work =>
            work.links
              .filter(link => link.needsLegalReassignment)
              .map(link => ({ work: work.id, institution: link.institution })),
        ),
        periods,
        finalFunds: state.funds,
      },
    ];
  }),
);

const evidence = {
  date: "2026-09-30",
  scope: "Ensaio isolado; não é campanha do jogo, balanço real ou aprovação jurídica.",
  assumptions: [
    "Períodos, esforço e caixa são unidades sintéticas; não equivalem a semanas, pessoas ou reais.",
    "Sete trabalhos administrativos conhecidos, sem novas chegadas, uma preparação e uma execução por trabalho.",
    "O trabalho representa um lote administrativo; cada denúncia não exige decisão de ministro.",
    "Capacidade por equipe igual a um; caixa inicial total igual a 14; cada execução custa uma unidade.",
    "Repasse da fusão requer duas unidades de esforço; os demais, uma. São hipóteses dos pacotes, não taxas por verbo.",
    "Equipes existentes já financiadas; a transição disputa seu esforço, sem cobrança adicional de folha.",
    "Compartilhar acesso não revoga acesso antigo; nenhuma autorização jurídica ou proteção de dados é implementada.",
    "Executores administrativos e rede educativa adicionais são exemplos sintéticos, não novos órgãos reais.",
    "Currículos não viram multiplicadores de entrega; nomeação e experiência continuam no parecer qualitativo.",
    "Prioridades e abertura iguais nas quatro comparações; a gestão e os repasses dos pacotes são explícitos.",
    "O quinto cenário mantém a estrutura e muda somente prioridade, para testar a alternativa de gestão.",
  ],
  priority: OPERATION_PRIORITY,
  scenarios,
};
const serialized = `${JSON.stringify(evidence, null, 2)}\n`;
const target = process.argv[2];
if (target) await writeFile(target, serialized, "utf8");
else process.stdout.write(serialized);
