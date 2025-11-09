/**
 * Types for Plan Context (Premium Selection) module
 * LIC Jeevan Lakshya (733)
 */

export interface BonusConfig {
  /** Simple Reversionary Bonus per ₹1,000 Sum Assured (₹) */
  simpleReversionaryPerThousand: number;
  /** Final Additional Bonus per ₹1,000 Sum Assured (₹) */
  finalAdditionalPerThousand: number;
}

export interface PremiumCell {
  age: number;
  term: number;
  /** Premium Paying Term = Term - 3 */
  ppt: number;
  /** Annual premium in ₹ (from LIC brochure, excl. taxes) */
  annualPremium: number;
}

export interface InstallmentOption {
  mode: 'annual' | 'halfYearly' | 'quarterly' | 'monthly';
  label: string;
  labelGu: string;
  amount: number;
  /** Multiplier applied to annual premium (approximate) */
  multiplier: number;
  isApproximate: boolean;
}

export interface MaturityEstimate {
  /** Basic Sum Assured (₹) */
  basicSumAssured: number;
  /** Vested Simple Reversionary Bonus (₹) */
  simpleReversionaryBonus: number;
  /** Final Additional Bonus (₹) */
  finalAdditionalBonus: number;
  /** Total estimated maturity benefit (₹) */
  totalMaturity: number;
}

export interface PlanSelection {
  age: number;
  term: number;
  ppt: number;
  sumAssured: number;
  annualPremium: number;
  totalPremiumPaid: number;
  estimatedMaturity: MaturityEstimate;
  installmentOptions: InstallmentOption[];
}

export type Language = 'en' | 'gu';
