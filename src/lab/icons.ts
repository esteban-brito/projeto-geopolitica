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
