/* AS ENTRADAS — o que cada tela precisa saber, derivado do motor e nunca guardado. */

import { OPENING_MONTH } from "../state/state.mjs";
import {
  CATALOG,
  HORIZON,
  SEATS,
  SIMPLE_MAJORITY,
  THRESHOLDS,
  boilerOf,
  chainOf,
  forecast,
  governmentOf,
  ledger,
  left,
  outlook,
  pledgesOf,
  pollFrom,
  settlement,
  silences,
  situationOf,
  trajectory,
} from "../public/index.mjs";
import { describeMail, describeMonth, trayHtml } from "../ui/screens/inbox.mjs";
import { INFLATION_CEILING, lawNow, session } from "./session.mjs";

/* ── O QUE A TELA PRECISA SABER, derivado e nunca guardado ────────────────── */

/**
 * Previsao delegada a forecast (camara manual invertia 275 de 1.012 votacoes, 27,2%, ate 35 votos).
 */
export function mesaInput() {
  const seen = forecast(session.state, session.orders, CATALOG);
  const bill = seen.agenda.proposal;

  return {
    bill,
    areaLabel: CATALOG.areas.find(area => area.id === bill?.area)?.label ?? "",
    quorum: seen.agenda.quorum,
    parties: CATALOG.parties,
    ruling: session.state.party ?? null,
    loyalty: session.state.loyalty,
    funding: session.orders.funding,
    forecast: seen.whip,
    byBloc: seen.byBloc,
    blocs: seen.blocs,
    band: seen.band,
    seatPrice: CATALOG.fiscal.seatPrice,
    room: seen.share.room,
    demand: seen.share.demand,
    thresholds: THRESHOLDS,
  };
}

/** Consolidado fiscal derivado exclusivamente de ledger. */
export function financeInput() {
  const { budget, interest, debt, debtRatio, premium } = ledger(
    session.state,
    session.orders,
    CATALOG,
  );

  return {
    macro: session.state.macro,
    budget,
    interest,
    debt,
    debtRatio,
    premium,
    series: session.state.series,
    target: CATALOG.macro.inflationTarget,
    ceiling: INFLATION_CEILING,
    areas: CATALOG.areas,
    index: session.state.capacity.index,
    /* Serie historica longa para exibicao (diferente do buffer de atraso da malha). */
    history: session.state.series.areas,
  };
}

/**
 * Correspondencias formatadas com dados de governo e contexto fiscal.
 * @param {ReadonlyArray<import("../state/state.mjs").Letter>} mail
 */
export function dispatchesOf(mail) {
  const current = situationOf(session.state, CATALOG);
  const { budget } = ledger(session.state, session.orders, CATALOG);
  const share = settlement(session.state, session.orders, CATALOG);
  const gov = governmentOf(session.state, CATALOG);
  return describeMail({
    mail,
    people: gov.people,
    treatment: gov.treatment,
    left: letter => left(letter, session.state.month),
    inherited: { mandatory: budget.mandatory, room: share.room },
    answered: session.orders.mail,
    pledges: pledgesOf(CATALOG),
    platform: { ...session.state.platform, ...session.orders.platform },
    lobbies: CATALOG.lobbies,
    siege: boilerOf(session.state, CATALOG),
    chamber: { base: current.base, majority: SIMPLE_MAJORITY, seats: SEATS },
    months: session.state.months,
    segments: CATALOG.segments,
    parties: CATALOG.parties,
  });
}

export function emailInput() {
  const gov = governmentOf(session.state, CATALOG);

  return {
    resolved: session.state.month > OPENING_MONTH,
    inbox: trayHtml({
      open: session.openDispatch,
      seen: [...session.readMail],
      dispatches: [
        /* Relatorios de meses fechados preservados no historico e ordenados na bandeja. */
        ...session.state.months.map(
          (/** @type {import("../state/state.mjs").MonthCard} */ fechado) =>
            describeMonth({ report: fechado, adviser: gov.adviser }),
        ),
        ...dispatchesOf(session.state.mail),
      ],
    }),
  };
}

/**
 * Grupo mais proximo do proprio limiar relativo (pressure / boil).
 *
 * @param {ReadonlyArray<{ label: string, pressure: number, boil: number }>} lobbies
 */
export function closestToBreak(lobbies) {
  let worst = null;
  for (const lobby of lobbies) {
    if (lobby.boil <= 0) continue;
    if (worst === null || lobby.pressure / lobby.boil > worst.pressure / worst.boil) worst = lobby;
  }
  return worst === null ? null : { label: worst.label, pressure: worst.pressure, boil: worst.boil };
}

/**
 * Cartas na mesa (do mes fechado e vencendo), com urgentes no topo.
 * @param {number} closed
 * @param {Set<string>} dying
 */
export function onDesk(closed, dying) {
  const here = session.state.mail
    .filter(letter => letter.month === closed || dying.has(letter.id))
    .sort((a, b) => Number(dying.has(a.id)) - Number(dying.has(b.id)));
  const dispatches = dispatchesOf(here);
  return here.map(letter => ({
    urgent: dying.has(letter.id),
    dispatch: dispatches.find(dispatch => dispatch.id === letter.id) ?? null,
  }));
}

export function cabinetInput() {
  const share = settlement(session.state, session.orders, CATALOG);
  const { budget } = ledger(session.state, session.orders, CATALOG);
  const current = situationOf(session.state, CATALOG);
  const boiler = boilerOf(session.state, CATALOG);
  const street = pollFrom(session.state.mood, CATALOG.segments, CATALOG.opinion);
  const gov = governmentOf(session.state, CATALOG);

  /* Identifica correspondencias vencidas via silences. */
  const quiet = silences({
    mail: session.state.mail,
    orders: session.orders.mail,
    month: session.state.month,
  });
  const dying = new Set(quiet.map(letter => letter.id));

  /* O mes fechado vem do ultimo relatorio (evita subtracao na tela em 48 meses). */
  const closed = session.state.months[0]?.month ?? session.state.month;

  return {
    room: share.room,
    ratio: share.ratio,
    president: gov.president.name,
    month: session.state.month,
    areas: CATALOG.areas,
    protect: session.orders.protect ?? [],
    brief: {
      month: session.state.month,
      chief: gov.adviser?.name ?? "",
      she: gov.adviser?.gender === "f",
      room: share.room,
      mandatory: budget.mandatory,
      revenue: budget.revenue,
      base: current.base,
      majority: SIMPLE_MAJORITY,
      worst: closestToBreak(boiler.lobbies),
      standing: street.good,
      /* Referencia anterior preservada em framed para comparacao. */
      was:
        session.framed === null
          ? null
          : pollFrom(session.framed.mood, CATALOG.segments, CATALOG.opinion).good,
      impeachment: boiler.impeachment,
    },
    /* Mesa exibe correspondencias recentes e urgentes (ate 25 cartas no mandato, 36 dos 48 meses). */
    letters: onDesk(closed, dying),
    /* Quantidade de despachos pendentes de resposta. */
    sheets: session.state.mail.filter(letter => letter.due !== null && letter.answer === null)
      .length,
    boiling: boiler.lobbies.find(lobby => lobby.boiling)?.label ?? null,
  };
}

/**
 * @param {import("../public/index.mjs").Area} area
 */
export function areaInput(area) {
  const value = session.state.capacity.index[area.id] ?? area.initial;
  const share = settlement(session.state, session.orders, CATALOG);
  const spent = share.asked[area.id] ?? 0;

  /* Projecao delegada ao motor com gasto cheio rateado (Previdencia: R$ 2,4 bi contra R$ 126,7 bi; errava 5 de 8 areas). */
  const ahead = outlook(session.state, session.orders, CATALOG);
  const curve = trajectory(session.state, session.orders, CATALOG);

  return {
    area,
    value,
    history: session.state.series.areas[area.id] ?? [],
    programs: CATALOG.programs.filter(program => program.area === area.id),
    levels: session.orders.levels,
    spent,
    room: share.room,
    committed: share.demand - spent,
    projected: ahead.index[area.id] ?? value,
    idle: ahead.idle[area.id] ?? value,
    /* Horizonte evita leitura inerte a 1 mes (area anda 0,40 por mes; leitura saia 61 → 61). */
    horizon: HORIZON,
    ahead: curve.index[area.id]?.at(-1) ?? value,
    aheadIdle: curve.idle[area.id]?.at(-1) ?? value,
    bands: lawNow(),
    requestedBands: session.orders.bands,
    /* Corrente calculada sobre funded cheio (evita anunciar +0,02 onde motor lanca +1,22). */
    chain: chainOf(session.state, area.id, share.funded[area.id] ?? 0),
    ratio: share.ratio,
    areas: CATALOG.areas,
  };
}
