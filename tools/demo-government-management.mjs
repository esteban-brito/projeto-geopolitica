import { writeFile } from "node:fs/promises";
import {
  openingPilotGovernment,
  PILOT_WORK,
  PILOT_PEOPLE,
} from "../prototypes/government/pilot-cases.mjs";
import { openingPilotOperations } from "../prototypes/government/operations-cases.mjs";
import { queueAdvice, runManagement } from "../prototypes/government/management.mjs";

const government = openingPilotGovernment();
const goals = ["rights-intake", "rights-followup", "rights-education"];
/** @type {Array<{id: string, person: import("../prototypes/government/pilot.mjs").PilotPerson, mode: import("../prototypes/government/management.mjs").ManagementMode, consult: boolean}>} */
const cases = [
  {
    id: "ombudsman-familiar",
    person: PILOT_PEOPLE.rightsOmbudsman,
    mode: "familiar-first",
    consult: false,
  },
  {
    id: "educator-familiar",
    person: PILOT_PEOPLE.rightsEducator,
    mode: "familiar-first",
    consult: false,
  },
  {
    id: "educator-directed",
    person: PILOT_PEOPLE.rightsEducator,
    mode: "goals-first",
    consult: false,
  },
  {
    id: "educator-advised",
    person: PILOT_PEOPLE.rightsEducator,
    mode: "familiar-first",
    consult: true,
  },
];
const scenarios = Object.fromEntries(
  cases.map(scenario => {
    /** @type {import("../prototypes/government/management.mjs").ManagementState} */
    let state = { operations: openingPilotOperations(), advice: [], history: [] };
    if (scenario.consult)
      state = queueAdvice(government, state, PILOT_WORK, PILOT_PEOPLE.rightsOmbudsman, {
        id: "advice-intake",
        team: "rights-coordination",
        work: "rights-intake",
        effort: 1,
      });
    const input = {
      government,
      works: PILOT_WORK,
      minister: scenario.person,
      adviser: scenario.consult ? PILOT_PEOPLE.rightsOmbudsman : null,
      office: "human-rights",
      goals,
      mode: scenario.mode,
      state,
    };
    const periods = [];
    for (let period = 0; period < 4; period++) {
      const result = runManagement(
        government,
        state,
        PILOT_WORK,
        scenario.person,
        "human-rights",
        goals,
        scenario.mode,
      );
      periods.push(result);
      state = result.state;
    }
    return [scenario.id, { input, periods }];
  }),
);
const evidence = {
  date: "2026-09-30",
  scope: "Ensaio sintético de agenda e consulta, isolado do jogo principal.",
  assumptions: [
    "Preferência por trabalho familiar é uma estratégia de ensaio escolhida explicitamente, não uma lei sobre ministros.",
    "Só episódios conhecidos compõem a avaliação; título, nome da pasta e histórico oculto não a alteram.",
    "Ordem presidencial tem prioridade própria e pode antecipar atendimento sem reforma ou consulta.",
    "Consulta usa a equipe existente antes dos repasses e trabalhos, por ordem de solicitação; é uma hipótese revisável.",
    "Parecer concluído pode orientar a agenda seguinte, fica na pasta que o recebeu e não muda currículo ou acesso a registros.",
    "O esforço da consulta é custo de oportunidade; não há folha adicional nem produtividade extra por currículo.",
    "Fundos continuam separados; escolher executor diferente altera o fundo que paga, sem criar verba.",
    "Quatro períodos abstratos e sete trabalhos fechados; os casos não provam qualidade gerencial, equilíbrio ou diversão.",
  ],
  scenarios,
};
const serialized = `${JSON.stringify(evidence, null, 2)}\n`;
const target = process.argv[2];
if (target) await writeFile(target, serialized, "utf8");
else process.stdout.write(serialized);
