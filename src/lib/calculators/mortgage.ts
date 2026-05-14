export type MortgageInput = {
  loanAmount: number;
  interestRate: number;
  loanTermYears: number;
};

export type MortgageResult = {
  monthlyRepayment: number;
  totalRepayment: number;
  totalInterest: number;
};

export default function calculateMortgage({
  loanAmount,
  interestRate,
  loanTermYears,
}: MortgageInput): MortgageResult {
  if (loanAmount <= 0 || interestRate <= 0 || loanTermYears <= 0) {
    return {
      monthlyRepayment: 0,
      totalRepayment: 0,
      totalInterest: 0,
    };
  }

  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTermYears * 12;

  const monthlyRepayment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1);

  const totalRepayment = monthlyRepayment * totalPayments;

  const totalInterest = totalRepayment - loanAmount;

  return {
    monthlyRepayment,
    totalRepayment,
    totalInterest,
  };
}
