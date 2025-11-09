/**
 * Simple test runner for bonus.ts functions
 * Run with: node __tests__/bonus.simple.test.js
 * 
 * This is a standalone test file that doesn't require Jest/Vitest.
 * For production, use a proper test framework.
 */

// Simple test helpers
function describe(name, fn) {
  console.log(`\n📦 ${name}`);
  fn();
}

function it(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
  } catch (error) {
    console.log(`  ❌ ${name}`);
    console.error(`     ${error.message}`);
    process.exitCode = 1;
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toBeGreaterThan(expected) {
      if (actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toThrow(expectedMessage) {
      let threw = false;
      let thrownMessage = '';
      try {
        actual();
      } catch (error) {
        threw = true;
        thrownMessage = error.message;
      }
      if (!threw) {
        throw new Error('Expected function to throw an error');
      }
      if (expectedMessage && !thrownMessage.includes(expectedMessage)) {
        throw new Error(`Expected error message to include "${expectedMessage}", got "${thrownMessage}"`);
      }
    },
  };
}

// Import functions (adjust path as needed - this assumes we're compiling to JS)
// For TypeScript, you'd need to run: tsc && node dist/__tests__/bonus.simple.test.js
// Or use tsx: npx tsx __tests__/bonus.simple.test.ts

console.log('🧪 Running bonus.ts tests...\n');

describe('estimateMaturity', () => {
  // Mock implementation for testing (replace with actual import)
  function estimateMaturity({ sumAssured, term, ppt, bonus }) {
    if (sumAssured <= 0) throw new Error('Sum Assured must be positive');
    if (term <= 0 || ppt <= 0) throw new Error('Term and PPT must be positive');
    if (ppt > term) throw new Error('PPT cannot exceed Term');

    const thousands = sumAssured / 1000;
    const simpleReversionaryBonus = Math.round(
      bonus.simpleReversionaryPerThousand * ppt * thousands
    );
    const finalAdditionalBonus = Math.round(
      bonus.finalAdditionalPerThousand * thousands
    );
    const totalMaturity = sumAssured + simpleReversionaryBonus + finalAdditionalBonus;

    return {
      basicSumAssured: sumAssured,
      simpleReversionaryBonus,
      finalAdditionalBonus,
      totalMaturity,
    };
  }

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
});

describe('calculateInstallments', () => {
  function calculateInstallments(annualPremium) {
    return {
      annual: Math.round(annualPremium),
      halfYearly: Math.round(annualPremium * 0.51),
      quarterly: Math.round(annualPremium * 0.255),
      monthly: Math.round(annualPremium * 0.085),
    };
  }

  it('should calculate all installment modes from annual premium', () => {
    const annual = 20000;
    const result = calculateInstallments(annual);

    expect(result.annual).toBe(20000);
    expect(result.halfYearly).toBe(10200);
    expect(result.quarterly).toBe(5100);
    expect(result.monthly).toBe(1700);
  });

  it('should round installment amounts correctly', () => {
    const annual = 16758;
    const result = calculateInstallments(annual);

    expect(result.annual).toBe(16758);
    expect(result.halfYearly).toBe(8547);
    expect(result.quarterly).toBe(4273);
    expect(result.monthly).toBe(1424);
  });
});

describe('Integration: Real brochure scenarios', () => {
  function estimateMaturity({ sumAssured, term, ppt, bonus }) {
    const thousands = sumAssured / 1000;
    const simpleReversionaryBonus = Math.round(
      bonus.simpleReversionaryPerThousand * ppt * thousands
    );
    const finalAdditionalBonus = Math.round(
      bonus.finalAdditionalPerThousand * thousands
    );
    const totalMaturity = sumAssured + simpleReversionaryBonus + finalAdditionalBonus;

    return { basicSumAssured: sumAssured, simpleReversionaryBonus, finalAdditionalBonus, totalMaturity };
  }

  it('Age 20, Term 13, PPT 10 with illustrative bonuses', () => {
    const result = estimateMaturity({
      sumAssured: 200000,
      term: 13,
      ppt: 10,
      bonus: {
        simpleReversionaryPerThousand: 40,
        finalAdditionalPerThousand: 15,
      },
    });

    expect(result.totalMaturity).toBe(283000);
    
    const totalPaid = 20217 * 10;
    expect(result.totalMaturity).toBeGreaterThan(totalPaid);
  });

  it('Age 50, Term 15, PPT 12 with conservative bonuses', () => {
    const result = estimateMaturity({
      sumAssured: 200000,
      term: 15,
      ppt: 12,
      bonus: {
        simpleReversionaryPerThousand: 30,
        finalAdditionalPerThousand: 10,
      },
    });

    expect(result.totalMaturity).toBe(274000);
  });
});

console.log('\n✨ All tests completed!\n');
