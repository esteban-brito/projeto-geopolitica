import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, posix, resolve } from "node:path";
import { POSSE_FILES } from "../prototypes/posse/paths.mjs";

const root = resolve(import.meta.dirname, "..");
const source = resolve(root, POSSE_FILES.source);
const target = resolve(root, POSSE_FILES.preview);
const up = posix.relative(posix.dirname(POSSE_FILES.preview), "") + "/";
let html = (await readFile(source, "utf8")).replace(/\r\n/g, "\n");

/** @param {string} before @param {string} after */
function replace(before, after) {
  if (html.split(before).length !== 2)
    throw new Error(`ponto de conexão ausente ou repetido: ${before.slice(0, 75)}`);
  html = html.replace(before, after);
}

replace(
  '<script src="./support.js"></script>',
  `<base href="${up}${POSSE_FILES.vendor}/"><script type="module" src="${up}prototypes/posse/browser.mjs"></script><style>body{margin:0;background:#070b14}</style>`,
);
replace("<x-dc>", "<x-dc hidden>");
replace(
  "created: [], gone: {}, last: '' };\n  }\n  local(e)",
  "created: [], gone: {}, last: '' };\n    this.state = globalThis.PosseEngine.start(this.state);\n  }\n  local(e)",
);
replace(
  "    const picks = only(S.picks);",
  "    const picks = only(S.picks);\n    const engine = globalThis.PosseEngine.bind(P, PEOPLE, { into: S.into, gone: S.gone, created: S.created });\n    const engineCurrent = engine.use(picks);\n    const engineParty = function (pk, id) { const s = engine.support(pk); return s && s.parties.find(function (p) { return p.id === globalThis.PosseEngine.partyIds[id]; }); };",
);
const start = html.indexOf("    const sharesOf = function (pk)");
const end = html.indexOf("    const votes = votesOf(picks);", start);
if (start < 0 || end < 0) throw new Error("bloco da estimativa não encontrado");
html =
  html.slice(0, start) +
  `    const sharesOf = function (pk) { const out = {}; PARTIES.forEach(function (p) { const q = engineParty(pk, p.id); out[p.id] = q ? q.share : 0; }); return out; };
    const chanceOf = function (p, share) { const s = engine.support(picks); const q = s && s.parties.find(function (x) { return x.id === globalThis.PosseEngine.partyIds[p.id]; }); return q ? q.chance : 0; };
    const stanceOf = function (p, share) { return p.id === OWN ? 'gov' : NEVER[p.id] ? 'opo' : share > 0 ? 'base' : distOf(p) > (PRAG[p.id] ? 70 : 45) ? 'opo' : 'ind'; };
    const byParty = {};
    DOTS.forEach(function (d) { (byParty[d.party] = byParty[d.party] || []).push(d); });
    const depChance = function (d, c) { return globalThis.PosseEngine.deputy(d.party, byParty[d.party].indexOf(d), c); };
    const votesOf = function (pk) { const s = engine.support(pk), out = { total: s ? s.probable : 0 }; PARTIES.forEach(function (p) { const q = engineParty(pk, p.id); out[p.id] = q ? q.expected : 0; }); return out; };
    const sumOf = function (v) { return v.total; };
    const shares = sharesOf(picks);
    const chance = {}, stance = {};
    PARTIES.forEach(function (p) { const q = engineParty(picks, p.id); chance[p.id] = q ? q.chance : 0; stance[p.id] = stanceOf(p, shares[p.id]); });
    const firmOf = function (pk) { const s = engine.support(pk); return s ? s.firm : 0; };
    const firmByParty = function (pk, pid) { const q = engineParty(pk, pid); return q ? q.firm : 0; };
` +
  html.slice(end);
replace(
  "      finish: function () { set({ phase: 'photo', hoverP: null }); },",
  "      finish: function () { engine.capture(picks); set({ phase: 'photo', hoverP: null }); },",
);
replace(
  "    const created = S.created;",
  "    const government = globalThis.PosseEngine.structure(S, LABEL);\n    const created = S.created;",
);
replace(
  "    const ownParts = function (id) { return members(id).reduce",
  "    const ownParts = function (id) { if (government) return globalThis.PosseEngine.parts(government, id); return members(id).reduce",
);
replace(
  "        const into = Object.assign({}, S.into), names = Object.assign({}, S.names), pk = Object.assign({}, S.picks), d = Object.assign({}, S.decided);\n        into[absorbed] = keeper; names[keeper] = name; d[keeper] = true; delete d[absorbed];",
  "        const change = globalThis.PosseEngine.merge(S, LABEL, keeper, absorbed, name);\n        const into = change ? change.into : Object.assign({}, S.into), names = change ? change.names : Object.assign({}, S.names), pk = Object.assign({}, S.picks), d = Object.assign({}, S.decided);\n        if (!change) { into[absorbed] = keeper; names[keeper] = name; } d[keeper] = true; delete d[absorbed];",
);
replace(
  "set({ into: into, names: names, picks: pk, invites: inv, decided: d, sel: keeper",
  "set({ government: change ? change.government : null, gone: change ? change.gone : S.gone, into: into, names: names, picks: pk, invites: inv, decided: d, sel: keeper",
);
replace(
  "function () { const into = Object.assign({}, S.into), names = Object.assign({}, S.names), d = Object.assign({}, S.decided); kids.forEach(function (k) { delete into[k]; delete d[k]; }); delete names[sel]; set({ into: into, names: names, decided: d, pending: null, last: T.separated",
  "function () { const change = globalThis.PosseEngine.split(S, LABEL, sel), into = change ? change.into : Object.assign({}, S.into), names = change ? change.names : Object.assign({}, S.names), d = Object.assign({}, S.decided); kids.forEach(function (k) { if (!change) delete into[k]; delete d[k]; }); if (!change) delete names[sel]; set({ government: change ? change.government : null, gone: change ? change.gone : S.gone, into: into, names: names, decided: d, pending: null, last: T.separated",
);
replace(
  '<span class="eyebrow">Votos firmes · estimativa</span>',
  '<span class="eyebrow">Base estrutural · estimativa</span>',
);
replace(
  "      baseNote: 'Uns '",
  "      baseNote: engineCurrent.status === 'unknown' ? engineCurrent.reason : 'Apoio estrutural; a reação ocorre ao longo dos meses. Uns '",
);
replace("firm: firm, firmPct:", "firm: engineCurrent.status === 'unknown' ? '—' : firm, firmPct:");
replace("base: base, basePct:", "base: engineCurrent.status === 'unknown' ? '—' : base, basePct:");
replace(
  "+ firm + ' votos firmes e uns ' + base + ' prováveis',",
  "+ (engineCurrent.status === 'estimated' ? firm + ' votos firmes e uns ' + base + ' prováveis' : engineCurrent.reason),",
);
replace(
  "last: text + (firm2 !== firm ? T.base(firm2, b2) : '')",
  "last: engineCurrent.status === 'estimated' ? text + (firm2 !== firm ? T.base(firm2, b2) : '') : 'Nomeação registrada. ' + engineCurrent.reason",
);
replace(
  "gain: v > 0 ? '+' + v : v < 0 ? '−' + (-v) : '0',",
  "gain: engineCurrent.status === 'unknown' ? '—' : v > 0 ? '+' + v : v < 0 ? '−' + (-v) : '0',",
);
replace(
  "const brings = hp.kind === 'party' ?",
  "const brings = engineCurrent.status === 'unknown' ? engineCurrent.reason : hp.kind === 'party' ?",
);
replace(
  "last: T.fired(holder.name, label(sel))",
  "last: engineCurrent.status === 'unknown' ? 'Exoneração registrada. ' + engineCurrent.reason : T.fired(holder.name, label(sel))",
);
replace(
  "hint: x[2] + '. Toque para ordenar.'",
  "hint: x[0] === 'votes' && engineCurrent.status === 'unknown' ? engineCurrent.reason : x[2] + '. Toque para ordenar.'",
);
replace(
  "el.querySelector('[data-tl]').textContent = st + ' · ' + p.seats + ' deputados · vota com o governo ' + ch + '% das vezes';",
  "el.querySelector('[data-tl]').textContent = globalThis.PosseEngine.current.status === 'unknown' ? p.seats + ' deputados · ' + globalThis.PosseEngine.current.reason : st + ' · ' + p.seats + ' deputados · vota com o governo ' + ch + '% das vezes';",
);
for (const name of ["HIST", "DEST", "SPLIT", "PRE", "PARTNERS"]) {
  const pattern =
    name === "HIST"
      ? /^const HIST = \[[\s\S]*?^\];\n/m
      : new RegExp("^const " + name + " = [^\\n]*\\n", "m");
  const match = html.match(pattern);
  if (!match) throw new Error(`regra legada ausente: ${name}`);
  replace(match[0], "");
}
for (const field of ["noPrecedent", "reaction"]) {
  const match = html.match(new RegExp("^  " + field + ":[^\\n]*\\n", "m"));
  if (!match) throw new Error(`texto legado ausente: ${field}`);
  replace(match[0], "");
}
replace(" Existiu em 2018.", "");
replace(" Existiu até 2016.", "");
replace(
  "const label = function (id) { if (S.names[id])",
  "const label = function (id) { if (!id) return 'Escolher destino'; if (S.names[id])",
);
replace(
  "    mem.forEach(function (m) { (PARTNERS[m] || []).forEach(function (q) { const r = live(q); if (r && r !== sel && r !== 'agu' && suggested.indexOf(r) < 0) suggested.push(r); }); });\n",
  "",
);
const proposalStart = html.indexOf("    const proposeFor = function (id) {");
const proposalEnd = html.indexOf("    let question =", proposalStart);
if (proposalStart < 0 || proposalEnd < 0) throw new Error("proposta legada ausente");
replace(
  html.slice(proposalStart, proposalEnd),
  "    const proposeFor = function (id) { return { dest: ownParts(id).map(function () { return null; }) }; };\n",
);
replace("        const setAll = members(lead).concat(members(q));\n", "");
replace(
  "        HIST.forEach(function (h) { if (setAll.length >= 2 && setAll.every(function (k) { return h.set.indexOf(k) >= 0; })) actions.push(act(h.name, h.note, function () { mergeInto(lead, q, h.name, T.merged(both, h.name)); })); });\n",
  "",
);
const prior = ", pre: pr.pre";
if (html.split(prior).length !== 3) throw new Error("duas propostas históricas esperadas");
html = html.replaceAll(prior, "");
replace(
  "        question = 'Para onde vai “' + parts[i].text + '”?';\n        suggested.concat(rest).forEach(function (q) { actions.push(act(label(q), q === pend.dest[i] ? 'Destino atual' : '', function () { const dest = pend.dest.slice(); dest[i] = q; set({ pending: { kind: 'end', dest: dest, edit: true, pick: null } }); })); });",
  `        question = pend.bulk ? 'Para onde vai todo o trabalho?' : 'Para onde vai “' + parts[i].text + '”?';
        const found = globalThis.PosseEngine.destinations(suggested.concat(rest).map(function (q) { return { id: q, parts: ownParts(q).concat(incoming(q)) }; }), S.destinationQuery || '');
        note = found.reason;
        found.matches.forEach(function (match) { const q = match.id; const why = S.destinationQuery ? match.parts.map(function (pt) { return pt.text; }).join(' · ') : ''; actions.push(act(label(q), (q === pend.dest[i] ? 'Destino atual. ' : '') + why, function () { const dest = pend.bulk ? pend.dest.map(function () { return q; }) : pend.dest.slice(); if (!pend.bulk) dest[i] = q; set({ destinationQuery: '', pending: { kind: 'end', dest: dest, edit: true, pick: null } }); })); });
        actions.push(act('Voltar', '', function () { set({ destinationQuery: '', pending: { kind: 'end', dest: pend.dest, edit: true, pick: null } }); }));`,
);
replace(
  "        const sign = act('Assinar', 'A medida provisória sai com esta divisão.', function () {",
  "        const complete = pend.dest.every(function (q) { return q && active.indexOf(q) >= 0 && q !== sel; });\n        const sign = act('Assinar', complete ? 'A medida provisória sai com esta divisão.' : 'Escolha o destino de todas as atribuições.', function () {\n          if (!complete) { set({ pending: { kind: 'end', dest: pend.dest, edit: true, pick: null } }); return; }",
);
replace("        sign.cls += ' wide';", "        sign.cls += complete ? ' wide' : ' wide off';");
replace(
  "          question = 'A Casa Civil propõe esta divisão:';",
  "          question = 'Distribuição das atribuições:';",
);
replace(
  "          note = (pend.pre || T.noPrecedent) + T.reaction(holderOf(sel) ? holderOf(sel).name : '');",
  "          note = complete ? '' : 'Escolha os destinos em Mudar a divisão.';",
);
replace(
  "          suggested.forEach(function (q) { actions.push(act('Tudo para ' + label(q), '', function () { set({ pending: { kind: 'end', dest: parts.map(function () { return q; }), edit: true, pick: null } }); })); });",
  "          actions.push(act('Tudo para um órgão', '', function () { set({ destinationQuery: '', pending: { kind: 'end', dest: pend.dest, edit: true, bulk: true, pick: 0 } }); }));",
);
replace(
  "pinned.push(wide('Voltar à proposta da Casa Civil',",
  "pinned.push(wide('Recomeçar a distribuição',",
);
replace(
  "'O ministério acaba. A Casa Civil propõe para onde vai o trabalho.'",
  "'O ministério acaba. Você distribui as atribuições entre os órgãos ativos.'",
);
replace(
  '<span class="label" style="flex-shrink: 0;">{{question}}</span>',
  '<span class="label" style="flex-shrink: 0;">{{question}}</span>\n<sc-if value="{{hasDestinationSearch}}" hint-placeholder-val="{{ false }}"><label class="stack" style="gap: 6px;"><span class="caption">Buscar nas atribuições</span><input class="field" data-f="destination-query" type="text" placeholder="Ex.: segurança e não alimentar" value="{{destinationQuery}}" onChange="{{setDestinationQuery}}"></label></sc-if>',
);
replace(
  "      question: question, note: note,",
  "      hasDestinationSearch: step === 1 && S.pending && S.pending.kind === 'end' && S.pending.pick !== null && S.pending.pick !== undefined, destinationQuery: S.destinationQuery || '', setDestinationQuery: function (e) { set({ destinationQuery: e.target.value }); },\n      question: question, note: note,",
);
replace(
  "const partsOf = function (m) { return PARTS[m]",
  "const partsOf = function (m) { if (government) return globalThis.PosseEngine.parts(government, m).map(function (pt) { return pt.text; }); return PARTS[m]",
);
replace(
  "const incoming = function (id) { const out = [];",
  "const incoming = function (id) { if (government) return []; const out = [];",
);
replace(
  "const weightOf = function (id) { return members(id).length",
  "const weightOf = function (id) { if (government) return globalThis.PosseEngine.weight(government, id); return members(id).length",
);
replace(
  ". Para o partido que o receber, vale por ' + mem.length + ' ministérios.",
  ". Concentra as atribuições dessas pastas.",
);
replace(
  "    if (inc.length) seatJob +=",
  "    if (government && !ownParts(sel).length) seatJob = 'Sem atribuições neste momento.';\n    if (inc.length) seatJob +=",
);
replace(
  "          const gone = Object.assign({}, S.gone), pk = Object.assign({}, S.picks), d = Object.assign({}, S.decided);\n          gone[sel] = parts.map(function (pt, k) { return { from: pt.from, text: pt.text, w: pt.w, dest: pend.dest[k] }; });",
  "          const change = globalThis.PosseEngine.abolish(S, LABEL, sel, Object.fromEntries(parts.map(function (pt, k) { return [pt.id, pend.dest[k]]; })));\n          const gone = change ? change.gone : Object.assign({}, S.gone), pk = Object.assign({}, S.picks), d = Object.assign({}, S.decided);\n          if (!change) gone[sel] = parts.map(function (pt, k) { return { from: pt.from, text: pt.text, w: pt.w, dest: pend.dest[k] }; });",
);
replace(
  "set({ gone: gone, picks: pk, invites: inv, decided: d, sel: targets[0],",
  "set({ government: change ? change.government : null, into: change ? change.into : S.into, names: change ? change.names : S.names, gone: gone, picks: pk, invites: inv, decided: d, sel: targets[0] || rest[0],",
);
replace(
  "        incFrom.forEach(function (x) { actions.push(act('Recriar '",
  "        (government ? Object.keys(S.gone) : incFrom).forEach(function (x) { actions.push(act('Recriar '",
);
replace(
  "function () { const gone = Object.assign({}, S.gone); delete gone[x]; set({ gone: gone, sel: x,",
  "function () { const change = globalThis.PosseEngine.restore(S, LABEL, x), gone = change ? change.gone : Object.assign({}, S.gone); if (!change) delete gone[x]; set({ government: change ? change.government : null, into: change ? change.into : S.into, names: change ? change.names : S.names, gone: gone, sel: x,",
);
replace(
  "    const created = S.created;",
  "    const created = S.created;\n    const baseLabel = function (id) { const birth = created.find(function (c) { return c.id === id; }); return LABEL[id] || (birth && birth.label) || id; };\n    const personSeat = function (id) { const birth = created.find(function (c) { return c.id === id; }); return birth ? birth.profile || birth.from : id; };",
);
replace(
  "        const change = globalThis.PosseEngine.merge(S, LABEL, keeper, absorbed, name);",
  "        const change = globalThis.PosseEngine.merge(S, LABEL, keeper, absorbed, name);\n        if (!change && government) { set({ last: 'Vínculo institucional pendente para esta reforma.' }); return; }",
);
replace(
  "          const change = globalThis.PosseEngine.abolish(S, LABEL, sel, Object.fromEntries(parts.map(function (pt, k) { return [pt.id, pend.dest[k]]; })));",
  "          const change = globalThis.PosseEngine.abolish(S, LABEL, sel, Object.fromEntries(parts.map(function (pt, k) { return [pt.id, pend.dest[k]]; })));\n          if (!change && government) { set({ last: 'Vínculo institucional pendente para esta reforma.' }); return; }",
);
replace(
  "    const plain = OFFICIAL[sel].replace(",
  "    const plain = (OFFICIAL[sel] || label(sel)).replace(",
);
replace("      const lead = mem[0];", "      const lead = personSeat(mem[0]);");
replace(
  "d: ICON[id] || ICON['casa-civil']",
  "d: ICON[id] || ICON[personSeat(id)] || ICON['casa-civil']",
);
replace(
  "vb: ICON_VB[id] || ICON_VB['casa-civil']",
  "vb: ICON_VB[id] || ICON_VB[personSeat(id)] || ICON_VB['casa-civil']",
);
const labelReturns = "return LABEL[k];";
if (html.split(labelReturns).length !== 6)
  throw new Error("cinco consultas de rótulo de origem esperadas");
html = html.replaceAll(labelReturns, "return baseLabel(k);");
replace(
  "partsOf(sel).length === PARTS[sel].length",
  "partsOf(sel).length === (PARTS[sel] || []).length",
);
replace(
  "const both = list(members(lead).concat(members(q)).map(function (k) { return baseLabel(k); }));",
  "const both = list([label(lead), label(q)]);",
);
replace(
  "    let question = '', note = '', actions = [], proposal = [], pinned = [];",
  `    const applyStructure = function (change, patch) { if (!change) { set({ last: 'A proposta não pôde ser aplicada. Confira as atribuições e os destinos atuais.' }); return; } set(Object.assign({ government: change.government, into: change.into, names: change.names, gone: change.gone, pending: null, destinationQuery: '', editing: false }, patch || {})); };
    let question = '', note = '', actions = [], proposal = [], pinned = [];`,
);
const newReforms = `      } else if (pend && (pend.kind === 'create' || pend.kind === 'rename')) {
        const creating = pend.kind === 'create', selected = pend.ids || [], parts = ownParts(sel);
        question = creating ? 'Quais atribuições vão para o novo ministério?' : 'Qual nome fica?';
        if (creating) {
          const found = globalThis.PosseEngine.works(parts.map(function (pt) { return { id: pt.id, label: pt.text }; }), S.destinationQuery || '');
          note = found.reason || (selected.length ? selected.length + ' atribuições selecionadas.' : 'Sem seleção, a pasta começa sem atribuições.');
          parts.filter(function (pt) { return found.ids.indexOf(pt.id) >= 0; }).forEach(function (pt) { const checked = selected.indexOf(pt.id) >= 0; actions.push(act((checked ? '✓ ' : '') + pt.text, checked ? 'Selecionada' : 'Permanece onde está até a confirmação.', function () { set({ pending: Object.assign({}, pend, { ids: checked ? selected.filter(function (id) { return id !== pt.id; }) : selected.concat([pt.id]) }) }); }, checked)); });
        } else note = 'O nome muda; atribuições e titular são conservados.';
        const ready = typeof pend.name === 'string' && pend.name.trim().length > 0 && pend.name.trim().length <= 120;
        const confirm = act(creating ? 'Criar ministério' : 'Confirmar nome', ready ? creating ? 'Move somente as atribuições selecionadas.' : 'Registra o nome escolhido.' : 'Preencha o nome.', function () {
          if (!ready) return;
          const change = creating ? globalThis.PosseEngine.create(S, LABEL, pend.name, selected, sel) : globalThis.PosseEngine.rename(S, LABEL, sel, pend.name);
          applyStructure(change, creating && change ? { created: change.created, sel: change.id, last: change.names[change.id] + ' foi criado, sem ministro.' } : { editing: true, last: 'Nome atualizado para ' + pend.name.trim() + '.' });
        }, true);
        if (!ready) confirm.cls += ' off';
        actions.push(confirm); actions.push(back);
      } else if (pend && pend.kind === 'transfer' && pend.target) {
        question = 'Transferir para ' + label(pend.target) + '?';
        note = list(ownParts(sel).filter(function (pt) { return pend.ids.indexOf(pt.id) >= 0; }).map(function (pt) { return pt.text; }));
        actions.push(act('Confirmar transferência', 'A responsabilidade muda; os trabalhos conservam sua identidade.', function () { applyStructure(globalThis.PosseEngine.transfer(S, LABEL, sel, pend.ids, pend.target), { editing: true, last: 'Atribuições transferidas para ' + label(pend.target) + '.' }); }, true));
        actions.push(act('Voltar aos destinos', '', function () { set({ pending: Object.assign({}, pend, { target: null }) }); })); actions.push(back);
      } else if (pend && pend.kind === 'transfer' && pend.destination) {
        question = 'Para onde vão as atribuições selecionadas?';
        const found = globalThis.PosseEngine.destinations(rest.map(function (q) { return { id: q, parts: ownParts(q) }; }), S.destinationQuery || '');
        note = found.reason;
        found.matches.forEach(function (match) { actions.push(act(label(match.id), (S.destinationQuery ? match.parts.map(function (pt) { return pt.text; }).join(' · ') : ''), function () { set({ destinationQuery: '', pending: Object.assign({}, pend, { target: match.id }) }); })); });
        actions.push(act('Voltar às atribuições', '', function () { set({ destinationQuery: '', pending: Object.assign({}, pend, { destination: false }) }); })); actions.push(back);
      } else if (pend && pend.kind === 'transfer') {
        question = 'Quais atribuições serão transferidas?';
        const selected = pend.ids || [], parts = ownParts(sel), found = globalThis.PosseEngine.works(parts.map(function (pt) { return { id: pt.id, label: pt.text }; }), S.destinationQuery || '');
        note = found.reason || selected.length + ' atribuições selecionadas.';
        parts.filter(function (pt) { return found.ids.indexOf(pt.id) >= 0; }).forEach(function (pt) { const checked = selected.indexOf(pt.id) >= 0; actions.push(act((checked ? '✓ ' : '') + pt.text, checked ? 'Selecionada' : '', function () { set({ pending: Object.assign({}, pend, { ids: checked ? selected.filter(function (id) { return id !== pt.id; }) : selected.concat([pt.id]) }) }); }, checked)); });
        const next = act('Escolher destino', selected.length ? '' : 'Selecione uma atribuição.', function () { if (selected.length) set({ destinationQuery: '', pending: Object.assign({}, pend, { destination: true }) }); }, true);
        if (!selected.length) next.cls += ' off'; actions.push(next); actions.push(back);
      } else if (pend && pend.kind === 'merge' && !pend.with) {`;
replace("      } else if (pend && pend.kind === 'merge' && !pend.with) {", newReforms);
replace(
  "        CREATE.filter(function (c) { return mem.indexOf(c.from) >= 0 && !made(c.id); }).forEach(function (c) { actions.push(act('Dividir: criar ' + c.label, c.hint + ' Um cargo de ministro a mais.', function () { const d = Object.assign({}, S.decided); d[c.id] = true; d[sel] = true; set({ created: created.concat([c]), decided: d, editing: false, pending: null, last: T.divided(c.label) + T.size(n + 1) }); })); });",
  "        CREATE.filter(function (c) { return government ? ownParts(sel).some(function (pt) { return pt.text === c.part; }) : mem.indexOf(c.from) >= 0 && !made(c.id); }).forEach(function (c) { actions.push(act('Dividir: criar ' + c.label, c.hint + ' Um cargo de ministro a mais.', function () { const d = Object.assign({}, S.decided); if (government) { const selected = ownParts(sel).filter(function (pt) { return pt.text === c.part; }).map(function (pt) { return pt.id; }), change = globalThis.PosseEngine.create(S, LABEL, c.label, selected, sel, c.id); if (!change) { applyStructure(null); return; } d[change.id] = true; d[sel] = true; applyStructure(change, { created: change.created, decided: d, last: T.divided(c.label) + T.size(n + 1) }); } else { d[c.id] = true; d[sel] = true; set({ created: created.concat([c]), decided: d, editing: false, pending: null, last: T.divided(c.label) + T.size(n + 1) }); } })); });\n        if (government) { actions.push(act('Criar outro ministério', 'Escolha o nome e as atribuições.', function () { set({ destinationQuery: '', pending: { kind: 'create', name: '', ids: [] } }); })); actions.push(act('Transferir atribuições', 'Escolha o trabalho e o novo responsável.', function () { set({ destinationQuery: '', pending: { kind: 'transfer', ids: [] } }); })); actions.push(act('Renomear ministério', 'Conserva as atribuições e o titular.', function () { set({ pending: { kind: 'rename', name: label(sel) } }); })); }",
);
replace(
  "if (made(sel)) { const src = created.find(function (c) { return c.id === sel; }).from; actions.push(act('Desistir de criar ' + label(sel), 'O trabalho volta para onde estava.', function () { const into =",
  "if (made(sel)) { const src = created.find(function (c) { return c.id === sel; }).from; actions.push(act('Desistir de criar ' + label(sel), 'O trabalho que continua aqui volta para onde estava.', function () { if (government) { const change = globalThis.PosseEngine.cancelCreation(S, LABEL, sel); if (!change) { set({ last: 'A distribuição mudou desde a criação. Use Extinguir para escolher os destinos atuais.' }); return; } const pk = Object.assign({}, S.picks), inv = Object.assign({}, S.invites), d = Object.assign({}, S.decided); delete pk[sel]; delete inv[sel]; delete d[sel]; applyStructure(change, { picks: pk, invites: inv, decided: d, sel: live(src) || order.find(function (id) { return id !== sel; }), last: T.uncreated(label(sel), label(live(src) || src)) + T.size(n - 1) }); return; } const into =",
);
replace(
  "hasDestinationSearch: step === 1 && S.pending && S.pending.kind === 'end' && S.pending.pick !== null && S.pending.pick !== undefined,",
  "hasDestinationSearch: step === 1 && S.pending && (S.pending.kind === 'end' && S.pending.pick !== null && S.pending.pick !== undefined || S.pending.kind === 'create' || S.pending.kind === 'transfer' && !S.pending.target),",
);
replace(
  '<span class="label" style="flex-shrink: 0;">{{question}}</span>',
  '<span class="label" style="flex-shrink: 0;">{{question}}</span>\n<sc-if value="{{hasOfficeName}}" hint-placeholder-val="{{ false }}"><label class="stack" style="gap: 6px;"><span class="caption">Nome do ministério</span><input class="field" data-f="office-name" type="text" maxlength="120" value="{{officeName}}" onChange="{{setOfficeName}}"></label></sc-if>',
);
replace(
  "      question: question, note: note,",
  "      hasOfficeName: step === 1 && S.pending && (S.pending.kind === 'create' || S.pending.kind === 'rename'), officeName: S.pending && S.pending.name || '', setOfficeName: function (e) { set({ pending: Object.assign({}, S.pending, { name: e.target.value }) }); },\n      question: question, note: note,",
);
replace("T.recreated(LABEL[x])", "T.recreated(baseLabel(x))");
replace("act('Recriar ' + LABEL[x],", "act('Recriar ' + baseLabel(x),");
replace("'Desfaz a extinção. ' + LABEL[x] +", "'Desfaz a extinção. ' + baseLabel(x) +");
await mkdir(dirname(target), { recursive: true });
await writeFile(target, html, "utf8");
process.stdout.write(
  `Preparada ${POSSE_FILES.preview} com consulta do motor e sessão reiniciada ao recarregar.\n`,
);
