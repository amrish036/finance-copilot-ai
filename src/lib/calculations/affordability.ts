export type AffordabilityInput = {
  annualIncome: number;
  monthlyExpenses: number;
  monthlyDebts: number;
  interestRate: number;
};

export type AffordabilityResult = {
  monthlyIncome: number;
  availableMonthlyBudget: number;
  estimatedBorrowingPower: number;
  debtToIncomeRatio: number;
  affordabilityStatus: string;
};

export function calculateAffordability({
  annualIncome,
  monthlyExpenses,
  monthlyDebts,
  interestRate,
}: AffordabilityInput): AffordabilityResult {
  const monthlyIncome = annualIncome / 12;

  const availableMonthlyBudget = monthlyIncome - monthlyExpenses - monthlyDebts;

  const stressRate = interestRate + 2;

  const estimatedBorrowingPower =
    (availableMonthlyBudget * 12 * 25) / (stressRate / 5);

  const debtToIncomeRatio =
    ((monthlyExpenses + monthlyDebts) / monthlyIncome) * 100;

  let affordabilityStatus = "Healthy";

  if (debtToIncomeRatio > 50) {
    affordabilityStatus = "High Risk";
  } else if (debtToIncomeRatio > 35) {
    affordabilityStatus = "Moderate";
  }

  return {
    monthlyIncome,
    availableMonthlyBudget,
    estimatedBorrowingPower,
    debtToIncomeRatio,
    affordabilityStatus,
  };
}
