export const T = {
  // ─── Backgrounds ────────────────────────────────────────────────────────────
  bg:       '#06060F',
  surface:  '#0B0B18',
  card:     '#0F0F1C',
  elevated: '#141426',
  overlay:  '#1A1A2E',

  // ─── Borders ────────────────────────────────────────────────────────────────
  border:       'rgba(255,255,255,0.06)',
  borderMid:    'rgba(255,255,255,0.10)',
  borderBright: 'rgba(255,255,255,0.18)',

  // ─── Brand ──────────────────────────────────────────────────────────────────
  primary:      '#6366F1',
  primaryLight: '#818CF8',
  primaryDim:   'rgba(99,102,241,0.12)',
  primaryGlow:  'rgba(99,102,241,0.30)',
  accent:       '#8B5CF6',
  accentDim:    'rgba(139,92,246,0.12)',

  // ─── Status ─────────────────────────────────────────────────────────────────
  success:     '#10B981',
  successDim:  'rgba(16,185,129,0.12)',
  warning:     '#F59E0B',
  warningDim:  'rgba(245,158,11,0.12)',
  danger:      '#EF4444',
  dangerDim:   'rgba(239,68,68,0.12)',
  info:        '#3B82F6',
  cyan:        '#06B6D4',
  rose:        '#F43F5E',

  // ─── Text ───────────────────────────────────────────────────────────────────
  text1: '#F1F5F9',
  text2: '#94A3B8',
  text3: '#475569',

  // ─── Chart palette ──────────────────────────────────────────────────────────
  chart: ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E'] as string[],

  // ─── Typography ─────────────────────────────────────────────────────────────
  sans: '"Inter", -apple-system, "SF Pro Display", BlinkMacSystemFont, sans-serif',
  mono: '"SF Mono", "Fira Code", "JetBrains Mono", monospace',

  // ─── Radii ──────────────────────────────────────────────────────────────────
  r4:  '4px',
  r6:  '6px',
  r8:  '8px',
  r12: '12px',
  r16: '16px',
  r20: '20px',
} as const;
