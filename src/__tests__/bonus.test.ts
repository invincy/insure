/**
 * Unit tests for bonus.ts - Maturity estimation functions
 * LIC Jeevan Lakshya (733)
 * 
 * Run with: npm test (or vitest if configured)
 */

import { estimateMaturity, calculateInstallments, formatCurrency } from '../utils/bonus';
import type { BonusConfig } from '../types/planContext';

describe('estimateMaturity', () => {
  it('should calculate maturity with zero bonuses', () => {
    const result = estimateMaturity({
      sumAssured: 200000,
      term: 20,
      ppt: 17,
      bonus: {
        simpleReversionaryPerThousand: 0,
        finalAdditionalPerThousand: 0,
      },
    });

    expect(result.basicSumAssured).toBe(200000);
    expect(result.simpleReversionaryBonus).toBe(0);
    expect(result.finalAdditionalBonus).toBe(0);
    expect(result.totalMaturity).toBe(200000);
  });

  it('should calculate maturity with simple reversionary bonus only', () => {
    // Example: ₹50 per ₹1,000 per year for 17 years
    // SA = ₹2,00,000 = 200 thousands
    // Simple Bonus = 50 × 17 × 200 = ₹1,70,000
    const result = estimateMaturity({
      sumAssured: 200000,
      term: 20,
      ppt: 17,
      bonus: {
        simpleReversionaryPerThousand: 50,
        finalAdditionalPerThousand: 0,
      },
    });

    expect(result.basicSumAssured).toBe(200000);
    expect(result.simpleReversionaryBonus).toBe(170000);
    expect(result.finalAdditionalBonus).toBe(0);
    expect(result.totalMaturity).toBe(370000);
  });

  it('should calculate maturity with both bonus types', () => {
    // Example from documentation:
    // SA = ₹2,00,000 = 200 thousands
    // Simple Bonus = 50 × 17 × 200 = ₹1,70,000
    // Final Bonus = 30 × 200 = ₹6,000
    // Total = ₹2,00,000 + ₹1,70,000 + ₹6,000 = ₹3,76,000
    const result = estimateMaturity({
      sumAssured: 200000,
      term: 20,
      ppt: 17,
      bonus: {
        simpleReversionaryPerThousand: 50,
        finalAdditionalPerThousand: 30,
      },
    });

    expect(result.basicSumAssured).toBe(200000);
    expect(result.simpleReversionaryBonus).toBe(170000);
    expect(result.finalAdditionalBonus).toBe(6000);
    expect(result.totalMaturity).toBe(376000);
  });

  it('should handle fractional bonus calculations with rounding', () => {
    // Test rounding behavior with non-round numbers
    const result = estimateMaturity({
      sumAssured: 200000,
      term: 13,
      ppt: 10,
      bonus: {
        simpleReversionaryPerThousand: 47.5,
        finalAdditionalPerThousand: 25.25,
      },
    });

    // 47.5 × 10 × 200 = 95,000
    // 25.25 × 200 = 5,050
    expect(result.simpleReversionaryBonus).toBe(95000);
    expect(result.finalAdditionalBonus).toBe(5050);
    expect(result.totalMaturity).toBe(300050);
  });

  it('should throw error for negative sum assured', () => {
    expect(() => {
      estimateMaturity({
        sumAssured: -100000,
        term: 20,
        ppt: 17,
        bonus: { simpleReversionaryPerThousand: 0, finalAdditionalPerThousand: 0 },
      });
    }).toThrow('Sum Assured must be positive');
  });

  it('should throw error when PPT exceeds term', () => {
    expect(() => {
      estimateMaturity({
        sumAssured: 200000,
        term: 15,
        ppt: 20,
        bonus: { simpleReversionaryPerThousand: 0, finalAdditionalPerThousand: 0 },
      });
    }).toThrow('PPT cannot exceed Term');
  });

  it('should work with Age 40, Term 25 example', () => {
    // Age 40, Term 25, PPT 22
    // SA = ₹2,00,000
    // Assume bonus: 45 per thousand per year + 20 final
    const result = estimateMaturity({
      sumAssured: 200000,
      term: 25,
      ppt: 22,
      bonus: {
        simpleReversionaryPerThousand: 45,
        finalAdditionalPerThousand: 20,
      },
    });

    // Simple: 45 × 22 × 200 = ₹1,98,000
    // Final: 20 × 200 = ₹4,000
    // Total: ₹2,00,000 + ₹1,98,000 + ₹4,000 = ₹4,02,000
    expect(result.simpleReversionaryBonus).toBe(198000);
    expect(result.finalAdditionalBonus).toBe(4000);
    expect(result.totalMaturity).toBe(402000);
  });
});

describe('calculateInstallments', () => {
  it('should calculate all installment modes from annual premium', () => {
    const annual = 20000;
    const result = calculateInstallments(annual);

    expect(result.annual).toBe(20000);
    expect(result.halfYearly).toBe(10200); // 0.51 × 20000
    expect(result.quarterly).toBe(5100);   // 0.255 × 20000
    expect(result.monthly).toBe(1700);     // 0.085 × 20000
  });

  it('should round installment amounts correctly', () => {
    const annual = 16758; // From Age 30, Term 15
    const result = calculateInstallments(annual);

    expect(result.annual).toBe(16758);
    expect(result.halfYearly).toBe(8547);  // 0.51 × 16758 = 8546.58 → 8547
    expect(result.quarterly).toBe(4273);   // 0.255 × 16758 = 4273.29 → 4273
    expect(result.monthly).toBe(1424);     // 0.085 × 16758 = 1424.43 → 1424
  });

  it('should handle large premium amounts', () => {
    const annual = 100000;
    const result = calculateInstallments(annual);

    expect(result.annual).toBe(100000);
    expect(result.halfYearly).toBe(51000);
    expect(result.quarterly).toBe(25500);
    expect(result.monthly).toBe(8500);
  });
});

describe('formatCurrency', () => {
  it('should format currency in Indian Rupee format', () => {
    expect(formatCurrency(200000)).toBe('₹2,00,000');
    expect(formatCurrency(20217)).toBe('₹20,217');
    expect(formatCurrency(9006)).toBe('₹9,006');
  });

  it('should handle compact notation for lakhs', () => {
    expect(formatCurrency(200000, true)).toBe('₹2L');
    expect(formatCurrency(350000, true)).toBe('₹3.5L');
    expect(formatCurrency(1000000, true)).toBe('₹10L');
  });

  it('should not use compact notation for amounts below 1 lakh', () => {
    expect(formatCurrency(99999, true)).toBe('₹99,999');
    expect(formatCurrency(50000, true)).toBe('₹50,000');
  });

  it('should handle zero and negative amounts', () => {
    expect(formatCurrency(0)).toBe('₹0');
    expect(formatCurrency(-1000)).toBe('-₹1,000');
  });
});

describe('Integration: Real brochure scenarios', () => {
  it('Age 20, Term 13, PPT 10 with illustrative bonuses', () => {
    // Annual premium: ₹20,217 (from brochure)
    // Total paid: ₹20,217 × 10 = ₹2,02,170
    // Assume bonus: 40 per thousand + 15 final
    const result = estimateMaturity({
      sumAssured: 200000,
      term: 13,
      ppt: 10,
      bonus: {
        simpleReversionaryPerThousand: 40,
        finalAdditionalPerThousand: 15,
      },
    });

    // Simple: 40 × 10 × 200 = ₹80,000
    // Final: 15 × 200 = ₹3,000
    // Total: ₹2,00,000 + ₹80,000 + ₹3,000 = ₹2,83,000
    expect(result.totalMaturity).toBe(283000);
    
    // Verify maturity > total paid (should be profitable)
    const totalPaid = 20217 * 10; // ₹2,02,170
    expect(result.totalMaturity).toBeGreaterThan(totalPaid);
  });

  it('Age 50, Term 15, PPT 12 with conservative bonuses', () => {
    // Annual premium: ₹18,698 (from brochure)
    // Total paid: ₹18,698 × 12 = ₹2,24,376
    // Conservative bonus: 30 per thousand + 10 final
    const result = estimateMaturity({
      sumAssured: 200000,
      term: 15,
      ppt: 12,
      bonus: {
        simpleReversionaryPerThousand: 30,
        finalAdditionalPerThousand: 10,
      },
    });

    // Simple: 30 × 12 × 200 = ₹72,000
    // Final: 10 × 200 = ₹2,000
    // Total: ₹2,00,000 + ₹72,000 + ₹2,000 = ₹2,74,000
    expect(result.totalMaturity).toBe(274000);
  });
});
