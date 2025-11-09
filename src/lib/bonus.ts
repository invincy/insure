import bonusDecl from '../data/bonusDeclaration.json';

export interface BonusDeclaration {
  simpleReversionaryPerThousand: number;
  finalAdditionalPerThousand: number;
  note?: string;
}

export interface MaturityResult {
  basicSumAssured: number;
  simpleReversionaryBonus: number;
  finalAdditionalBonus: number;
  totalMaturity: number;
}

/**
 * estimateMaturity - pure function using local bonus declaration file
 * Maturity = SA + (SA/1000 * simpleReversionary * term) + (SA/1000 * finalAdditional)
 * Round to nearest ₹100 as requested.
 */
export function estimateMaturity(sumAssured: number, term: number, pptOrUnused?: number): MaturityResult {
  const decl = bonusDecl as BonusDeclaration;
  if (sumAssured <= 0) throw new Error('sumAssured must be positive');
  if (term <= 0) throw new Error('term must be positive');

  const thousands = sumAssured / 1000;
  const simple = decl.simpleReversionaryPerThousand * term * thousands;
  const finalAdd = decl.finalAdditionalPerThousand * thousands;
  const raw = sumAssured + simple + finalAdd;
  // round to nearest 100
  const rounded = Math.round(raw / 100) * 100;

  return {
    basicSumAssured: sumAssured,
    simpleReversionaryBonus: Math.round(simple),
    finalAdditionalBonus: Math.round(finalAdd),
    totalMaturity: rounded,
  };
}

export const BONUS_DECLARATION = bonusDecl as BonusDeclaration;
