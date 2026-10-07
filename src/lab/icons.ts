/** Stroke icons, 20 px, drawn in currentColor. */
const svg = (body: string) =>
  `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const ICONS = {
  circle: svg('<circle cx="10" cy="10" r="6.5"/>'),
  capsule: svg('<rect x="2.5" y="6.5" width="15" height="7" rx="3.5"/>'),
  rounded: svg('<rect x="3" y="5" width="14" height="10" rx="3"/>'),
  squircle: svg('<path d="M10 3.5c5.2 0 6.5 1.3 6.5 6.5s-1.3 6.5-6.5 6.5S3.5 15.2 3.5 10 4.8 3.5 10 3.5Z"/>'),
  panel: svg('<rect x="2.5" y="4" width="15" height="12" rx="2.2"/><path d="M5.5 8h6M5.5 11h4"/>'),
  add: svg('<path d="M10 4.5v11M4.5 10h11"/>'),
  remove: svg('<path d="M4.5 6h11M8 6V4.5h4V6M6 6l.7 9.5h6.6L14 6"/>'),
  tune: svg('<path d="M4 6h7M15 6h1M4 14h1M9 14h7"/><circle cx="13" cy="6" r="2"/><circle cx="7" cy="14" r="2"/>'),
  upload: svg('<path d="M10 13V4.5M6.5 8 10 4.5 13.5 8M4.5 15.5h11"/>'),
  close: svg('<path d="M5.5 5.5l9 9M14.5 5.5l-9 9"/>'),
} as const;

/** What sits on the glasses in the lab: one symbol each, like a toolbar's buttons. */
export const SYMBOLS = [
  svg('<path d="M7 5.2v9.6L15 10z"/>'),
  svg('<circle cx="8.8" cy="8.8" r="4.8"/><path d="M12.4 12.4 16 16"/>'),
  svg('<path d="M10 16s-6-3.6-6-8a3.3 3.3 0 0 1 6-1.9A3.3 3.3 0 0 1 16 8c0 4.4-6 8-6 8Z"/>'),
  svg('<circle cx="10" cy="10" r="3.2"/><path d="M10 2.8v1.6M10 15.6v1.6M2.8 10h1.6M15.6 10h1.6M4.9 4.9 6 6M14 14l1.1 1.1M4.9 15.1 6 14M14 6l1.1-1.1"/>'),
  svg('<path d="M4 6h12M4 10h12M4 14h12"/>'),
  svg('<path d="M8 15.5V5.5l8-1.8v10"/><circle cx="6" cy="15.5" r="2"/><circle cx="14" cy="13.7" r="2"/>'),
] as const;

