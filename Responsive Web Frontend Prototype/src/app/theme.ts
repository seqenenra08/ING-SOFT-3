// ── Shared design tokens ───────────────────────────────────
export const C = {
  bg:        '#f5f1ee',
  surface:   '#ffffff',
  surfaceAlt:'#faf7f5',
  dark:      '#0c0202',
  darkBorder:'#2a1212',
  primary:   '#8b1a1a',
  active:    '#c0392b',
  gold:      '#a16207',
  text:      '#1a0808',
  muted:     '#7a5050',
  subtle:    '#b09898',
  border:    '#e2d5d0',
  tint:      '#fdf0f0',
} as const;

export const accentBar = `linear-gradient(90deg, ${C.primary}, ${C.active}, ${C.gold})`;

export const SH = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 700,
  color: C.text,
} as const;
