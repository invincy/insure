/**
 * Public bonus configuration (shared)
 * - simpleReversionaryPerThousand: simple reversionary bonus per ₹1,000 SA (example public assumption)
 * - finalAdditionalPerThousand: final additional bonus per ₹1,000 SA
 */
export const DEFAULT_BONUS_CONFIG = {
  simpleReversionaryPerThousand: 50,
  finalAdditionalPerThousand: 30,
} as const;

export type BonusConfig = typeof DEFAULT_BONUS_CONFIG;
