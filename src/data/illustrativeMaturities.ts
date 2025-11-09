const ILLUSTRATIVE_MATURITIES: Record<number, Record<number, { annualPremium: number; totalPaid: number; estMaturity: number }>> = {
  20: {
    13: { annualPremium: 20217, totalPaid: 202170, estMaturity: 298800 },
    15: { annualPremium: 16670, totalPaid: 200040, estMaturity: 318000 },
    20: { annualPremium: 11711, totalPaid: 199087, estMaturity: 382000 },
    25: { annualPremium: 9006, totalPaid: 198132, estMaturity: 520000 },
  },
  30: {
    13: { annualPremium: 20286, totalPaid: 202860, estMaturity: 298800 },
    15: { annualPremium: 16758, totalPaid: 201096, estMaturity: 318000 },
    20: { annualPremium: 11858, totalPaid: 201586, estMaturity: 382000 },
    25: { annualPremium: 9222, totalPaid: 202884, estMaturity: 520000 },
  },
  40: {
    13: { annualPremium: 20678, totalPaid: 206780, estMaturity: 298800 },
    15: { annualPremium: 16758, totalPaid: 201096, estMaturity: 318000 },
    17: { annualPremium: 14798, totalPaid: 207172, estMaturity: 348800 },
    20: { annualPremium: 12495, totalPaid: 212415, estMaturity: 382000 },
    25: { annualPremium: 10074, totalPaid: 221628, estMaturity: 520000 },
  },
  50: {
    13: { annualPremium: 22030, totalPaid: 220300, estMaturity: 298800 },
    15: { annualPremium: 18698, totalPaid: 224376, estMaturity: 318000 },
  },
};

export default ILLUSTRATIVE_MATURITIES;
