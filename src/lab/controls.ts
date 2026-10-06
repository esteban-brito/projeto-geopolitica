/** Minimal DOM builders for the panel. Each control reads its value from a getter so presets and
 * drags can refresh it with `refresh()`. */

export interface Control {
  element: HTMLElement;
  refresh(): void;
}

export function group(title: string, open: boolean, controls: Control[]): Control {
  const details = document.createElement("details");
  details.className = "group";
  details.open = open;
  const summary = document.createElement("summary");
  summary.textContent = title;
  const body = document.createElement("div");
  body.className = "group__body";
  for (const c of controls) body.append(c.element);
  details.append(summary, body);
  return { element: details, refresh: () => controls.forEach((c) => c.refresh()) };
}

export function slider(opts: {
  label: string;
  min: number;
  max: number;
  step: number;
  get: () => number;
  set: (v: number) => void;
  format?: (v: number) => string;
}): Control {
  const field = document.createElement("label");
  field.className = "field";
  const head = document.createElement("span");
  head.className = "field__head";
  const name = document.createElement("span");
  name.className = "field__label";
  name.textContent = opts.label;
  const value = document.createElement("span");
  value.className = "field__value";
  head.append(name, value);
  const input = document.createElement("input");
  input.type = "range";
  input.min = String(opts.min);
  input.max = String(opts.max);
  input.step = String(opts.step);
  const fmt = opts.format ?? ((v: number) => v.toFixed(opts.step < 1 ? 2 : 0));
  const refresh = () => {
    const v = opts.get();
    input.value = String(v);
    value.textContent = fmt(v);
  };
  input.addEventListener("input", () => {
    opts.set(Number(input.value));
    value.textContent = fmt(Number(input.value));
  });
  field.append(head, input);
  refresh();
  return { element: field, refresh };
}

export function segmented<T extends string>(opts: {
  label?: string;
  options: readonly { id: T; label: string }[];
  get: () => T;
  set: (v: T) => void;
}): Control {
  const field = document.createElement("div");
  field.className = "field";
  if (opts.label) {
    const name = document.createElement("span");
    name.className = "field__label";
    name.textContent = opts.label;
    field.append(name);
  }
  const bar = document.createElement("div");
  bar.className = "segmented";
  bar.setAttribute("role", "group");
  const buttons = opts.options.map((o) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = o.label;
    b.addEventListener("click", () => {
      opts.set(o.id);
      refresh();
    });
    bar.append(b);
    return [o.id, b] as const;
  });
  const refresh = () => {
    const current = opts.get();
    for (const [id, b] of buttons) b.setAttribute("aria-pressed", String(id === current));
  };
  field.append(bar);
  refresh();
  return { element: field, refresh };
}

export function select<T extends string | number>(opts: {
  label: string;
  options: readonly { id: T; label: string }[];
  get: () => T;
  set: (v: T) => void;
}): Control {
  const field = document.createElement("label");
  field.className = "field";
  const name = document.createElement("span");
  name.className = "field__label";
  name.textContent = opts.label;
  const el = document.createElement("select");
  for (const o of opts.options) {
    const option = document.createElement("option");
    option.value = String(o.id);
    option.textContent = o.label;
    el.append(option);
  }
  el.addEventListener("change", () => {
    const found = opts.options.find((o) => String(o.id) === el.value);
    if (found) opts.set(found.id);
  });
  const refresh = () => {
    el.value = String(opts.get());
  };
  field.append(name, el);
  refresh();
  return { element: field, refresh };
}

export function toggle(opts: { label: string; get: () => boolean; set: (v: boolean) => void }): Control {
  const field = document.createElement("label");
  field.className = "toggle";
  const name = document.createElement("span");
  name.textContent = opts.label;
  const input = document.createElement("input");
  input.type = "checkbox";
  input.addEventListener("change", () => opts.set(input.checked));
  field.append(name, input);
  const refresh = () => {
    input.checked = opts.get();
  };
  refresh();
  return { element: field, refresh };
}

export function button(label: string, onClick: () => void): Control {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "button";
  b.textContent = label;
  b.addEventListener("click", onClick);
  return { element: b, refresh: () => {} };
}

export function hint(render: () => string): Control {
  const p = document.createElement("p");
  p.className = "hint";
  p.style.margin = "0";
  const refresh = () => {
    p.innerHTML = render();
  };
  refresh();
  return { element: p, refresh };
}

/** Colour picker over a linear-RGB triple (the material stores linear light). */
export function color(opts: { label: string; get: () => [number, number, number]; set: (v: [number, number, number]) => void }): Control {
  const field = document.createElement("label");
  field.className = "toggle";
  const name = document.createElement("span");
  name.textContent = opts.label;
  const input = document.createElement("input");
  input.type = "color";
  const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const toSrgb = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);
  const hex = (v: [number, number, number]) =>
    `#${v.map((c) => Math.round(Math.max(0, Math.min(1, toSrgb(c))) * 255).toString(16).padStart(2, "0")).join("")}`;
  input.addEventListener("input", () => {
    const n = parseInt(input.value.slice(1), 16);
    opts.set([toLinear(((n >> 16) & 255) / 255), toLinear(((n >> 8) & 255) / 255), toLinear((n & 255) / 255)]);
  });
  field.append(name, input);
  const refresh = () => {
    input.value = hex(opts.get());
  };
  refresh();
  return { element: field, refresh };
}
