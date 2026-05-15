import { calculateAffordability, calculateMortgage } from "@/lib/calculations";

export function analyzeScenario() {
  const affordability = calculateAffordability({
    annualIncome: 180000,
    monthlyExpenses: 4000,
    monthlyDebts: 500,
    interestRate: 6.1,
  });

  const mortgage = calculateMortgage({
    loanAmount: 900000,
    interestRate: 6.1,
    loanTermYears: 30,
  });

  return {
    affordability,
    mortgage,
  };
}
