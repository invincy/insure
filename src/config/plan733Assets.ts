// Central asset mapping for Plan 733 hero. Updated to match your folder structure.
// Files are located in /public/images/plans/jeevnalakshya/

export const plan733Assets = {
  // Primary single-path assets (use these directly from components)
  coin: '/images/plans/jeevnalakshya/jeevan-lakshya.png',
  path: '/images/plans/jeevnalakshya/path.png',
  figures: '/images/plans/jeevnalakshya/dad&daughter.png',
  // Keep girl as an array so GirlFigure can fallback between several sources
  girl: [
    '/images/plans/jeevnalakshya/girl.png',
    '/images/plans/jeevnalakshya/dad&daughter.png',
  ],
  maturityPill: '/images/plans/jeevnalakshya/maturity.png',
  deathPill: '/images/plans/jeevnalakshya/death.png',
  thenPill: '/images/plans/jeevnalakshya/10sa.png',
  // Life stage assets
  career: '/images/plans/jeevnalakshya/career.png',
  goals: '/images/plans/jeevnalakshya/goals.png',
  marriage: '/images/plans/jeevnalakshya/marriage.png',
  study: '/images/plans/jeevnalakshya/study.png',
  background: '/images/plans/jeevnalakshya/backgrond.png', // keep original spelling
} as const;

export type AssetKey = keyof typeof plan733Assets;
