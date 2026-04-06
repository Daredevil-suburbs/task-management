export const Colors = {
  bgPrimary:    '#0a0a0f',
  bgSecondary:  '#111118',
  bgCard:       '#16161f',
  bgHover:     ' #1e1e2a',

  purpleLight:  '#c084fc',
  purple:        '#a855f7',
  purpleDark:   '#7c3aed',
  purpleGlow:   'rgba(168, 85, 247, 0.2)',

  gold:          '#f59e0b',
  goldLight:    '#fcd34d',
  goldDark:     '#d97706',
  goldGlow:     'rgba(245, 158, 11, 0.2)',

  textPrimary:  '#f1f0ff',
  textSecondary:'#a09ab8',
  textMuted:    '#5c5678',

  border:        'rgba(168, 85, 247, 0.15)',
  borderHover:  'rgba(168, 85, 247, 0.4)',

  danger:        '#ef4444',
  success:       '#22c55e',
  info:          '#3b82f6',

  rankE: '#9ca3af',
  rankD: '#60a5fa',
  rankC: '#34d399',
  rankB: '#f59e0b',
  rankA: '#f97316',
  rankS: '#a855f7',
};

export const Ranks = ['E', 'D', 'C', 'B', 'A', 'S'];

export const RankColors = {
  E: Colors.rankE,
  D: Colors.rankD,
  C: Colors.rankC,
  B: Colors.rankB,
  A: Colors.rankA,
  S: Colors.rankS,
};

export const PriorityColors = {
  LOW:    '#60a5fa',
  MEDIUM: Colors.gold,
  HIGH:   '#f97316',
};
