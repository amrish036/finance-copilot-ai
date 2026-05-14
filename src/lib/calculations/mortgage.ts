export type MortgageInput = {
  loanAmount: number;
  interestRate: number;
  loanTermYears: number;
};

export type AmortizationRow = {
  month: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
};

export type MortgageResult = {
  monthlyRepayment: number;
  totalRepayment: number;
  totalInterest: number;
  amortizationSchedule: AmortizationRow[];
};

export function calculateMortgage({
  loanAmount,
  interestRate,
  loanTermYears,
}: MortgageInput): MortgageResult {
  if (loanAmount <= 0 || interestRate <= 0 || loanTermYears <= 0) {
    return {
      monthlyRepayment: 0,
      totalRepayment: 0,
      totalInterest: 0,
      amortizationSchedule: [],
    };
  }

  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTermYears * 12;

  const monthlyRepayment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1);

  const totalRepayment = monthlyRepayment * totalPayments;

  const totalInterest = totalRepayment - loanAmount;

  let remainingBalance = loanAmount;

  const amortizationSchedule: AmortizationRow[] = [];

  for (let month = 1; month <= totalPayments; month++) {
    const interestPaid = remainingBalance * monthlyRate;

    const principalPaid = monthlyRepayment - interestPaid;

    remainingBalance -= principalPaid;

    amortizationSchedule.push({
      month,
      principalPaid,
      interestPaid,
      remainingBalance: remainingBalance > 0 ? remainingBalance : 0,
    });
  }

  return {
    monthlyRepayment,
    totalRepayment,
    totalInterest,
    amortizationSchedule,
  };
}
