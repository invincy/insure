/**
 * Official LIC Jeevan Lakshya (733) brochure premiums
 * Sum Assured: ₹2,00,000
 * Annual premiums (excluding taxes)
 * 
 * Data source: LIC Jeevan Lakshya Plan 733 official brochure
 * Last updated: 2025
 */

import { PremiumCell } from '../types/planContext';

/**
 * Premium matrix indexed by age, then term
 * PPT (Premium Paying Term) = Term - 3
 * 
 * Only combinations explicitly listed in the brochure are included.
 */
export const BROCHURE_PREMIUMS: Record<number, Record<number, number>> = {
  20: {
    18: 15000,  // PPT 15
    20: 11711,  // PPT 17
    25: 9006,   // PPT 22
  },
  30: {
    18: 15200,  // PPT 15
    20: 11858,  // PPT 17
    25: 9222,   // PPT 22
  },
  40: {
    18: 16000,  // PPT 15
    20: 12495,  // PPT 17
    25: 10074,  // PPT 22
  },
  50: {
    18: 18000,  // PPT 15
  },
};

/** Sum Assured for all brochure premiums */
export const BROCHURE_SUM_ASSURED = 200000;

/** Available ages in brochure */
export const AVAILABLE_AGES = [20, 30, 40, 50] as const;

/** All possible terms in brochure */
export const ALL_TERMS = [18, 20, 25] as const;

/**
 * Get all valid premium cells from brochure data
 */
export function getAllPremiumCells(): PremiumCell[] {
  const cells: PremiumCell[] = [];
  
  for (const age of AVAILABLE_AGES) {
    const termsForAge = BROCHURE_PREMIUMS[age];
    if (!termsForAge) continue;
    
    for (const [termStr, annualPremium] of Object.entries(termsForAge)) {
      const term = parseInt(termStr, 10);
      const ppt = term - 3;
      
      cells.push({
        age,
        term,
        ppt,
        annualPremium,
      });
    }
  }
  
  return cells;
}

/**
 * Get premium for a specific age and term combination
 * Returns null if combination not available in brochure
 */
export function getPremium(age: number, term: number): number | null {
  const termsForAge = BROCHURE_PREMIUMS[age];
  if (!termsForAge) return null;
  
  const premium = termsForAge[term];
  return premium ?? null;
}

/**
 * Check if a specific age/term combination exists in brochure
 */
export function isValidCombination(age: number, term: number): boolean {
  return getPremium(age, term) !== null;
}

/**
 * Get all available terms for a specific age
 */
export function getTermsForAge(age: number): number[] {
  const termsForAge = BROCHURE_PREMIUMS[age];
  if (!termsForAge) return [];
  
  return Object.keys(termsForAge).map(t => parseInt(t, 10)).sort((a, b) => a - b);
}
