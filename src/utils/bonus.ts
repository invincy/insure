/**
 * Maturity benefit estimation for LIC Jeevan Lakshya (733)
 * 
 * Formula (on survival to maturity):
 * Maturity Benefit = Basic Sum Assured 
 *                  + Vested Simple Reversionary Bonus
 *                  + Final Additional Bonus
 * 
 * All bonuses are illustrative and subject to change.
 * Actual bonuses depend on LIC's performance and are not guaranteed.
 */

import { BonusConfig, MaturityEstimate } from '../types/planContext';

export interface MaturityInput {
  /** Basic Sum Assured (₹) */
  sumAssured: number;
  /** Policy term in years */
  term: number;
  /** Premium Paying Term in years */
  ppt: number;
  /** Bonus configuration (per ₹1,000 SA) */
  bonus: BonusConfig;
}

/**
 * Calculate estimated maturity benefit on survival to maturity
 * 
 * @param input - Policy parameters and bonus assumptions
 * @returns Detailed maturity estimate breakdown
 * 
 * @example
 * const result = estimateMaturity({
 *   sumAssured: 200000,
 *   term: 20,
 *   ppt: 17,
 *   bonus: {
 *     simpleReversionaryPerThousand: 50,
 *     finalAdditionalPerThousand: 30
 *   }
 * });
 * // result.totalMaturity = 200000 + 170000 + 6000 = 376000
 */
export function estimateMaturity(input: MaturityInput): MaturityEstimate {
  const { sumAssured, term, ppt, bonus } = input;

  // Validate inputs
  if (sumAssured <= 0) {
    throw new Error('Sum Assured must be positive');
  }
  if (term <= 0 || ppt <= 0) {
    throw new Error('Term and PPT must be positive');
  }
  if (ppt > term) {
    throw new Error('PPT cannot exceed Term');
  }

  // Calculate number of thousands in Sum Assured
  const thousands = sumAssured / 1000;

  // Simple Reversionary Bonus
  // Accrues for each year premium is paid (PPT years)
  // Total = (Bonus per ₹1,000 per year) × PPT × (SA / 1,000)
  const simpleReversionaryBonus = Math.round(
    bonus.simpleReversionaryPerThousand * ppt * thousands
  );

  // Final Additional Bonus
  // One-time bonus at maturity
  // Total = (Bonus per ₹1,000) × (SA / 1,000)
  const finalAdditionalBonus = Math.round(
    bonus.finalAdditionalPerThousand * thousands
  );

  // Total Maturity Benefit
  const totalMaturity = sumAssured + simpleReversionaryBonus + finalAdditionalBonus;

  return {
    basicSumAssured: sumAssured,
    simpleReversionaryBonus,
    finalAdditionalBonus,
    totalMaturity,
  };
}

/**
 * Calculate installment premiums from annual premium
 * 
 * Multipliers are approximate industry standards:
 * - Half-yearly: ~51% of annual (×2 = 102%)
 * - Quarterly: ~25.5% of annual (×4 = 102%)
 * - Monthly: ~8.5% of annual (×12 = 102%)
 * 
 * @param annualPremium - Annual premium amount (₹)
 * @returns Installment amounts for different payment modes
 */
export function calculateInstallments(annualPremium: number) {
  return {
    annual: Math.round(annualPremium),
    halfYearly: Math.round(annualPremium * 0.51),
    quarterly: Math.round(annualPremium * 0.255),
    monthly: Math.round(annualPremium * 0.085),
  };
}

/**
 * Format currency amount in Indian Rupee format
 * 
 * @param amount - Amount in ₹
 * @param compact - Use compact notation (e.g., 2L instead of 2,00,000)
 * @returns Formatted string with ₹ symbol
 * 
 * @example
 * formatCurrency(200000) // "₹2,00,000"
 * formatCurrency(200000, true) // "₹2L"
 */
export function formatCurrency(amount: number, compact = false): string {
  if (compact && amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(lakhs >= 10 ? 0 : 1)}L`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
