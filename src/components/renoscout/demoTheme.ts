// src/components/renoscout/demoTheme.ts
// RenoScout brand tokens — mirror the real app (indigo -> coral on dark navy).
// Single source of truth for the embedded scripted demo. See spec §0.

export const RENOSCOUT = {
  indigo: '#6366F1',
  coral: '#FF6B35',
  gradient: 'linear-gradient(135deg, #6366F1 0%, #FF6B35 100%)',
  pageBg: '#0A0B1E',
  cardBg: '#12142b',
  cardBorder: 'rgba(255,255,255,0.08)',
  textMuted: '#9aa0b4',
} as const;

export const VERDICT = {
  buy: { color: '#34D399', label: 'Kup' },
  consider: { color: '#FBBF24', label: 'Rozważ' },
  pass: { color: '#F87171', label: 'Odrzuć' },
} as const;

export type VerdictKind = keyof typeof VERDICT;
