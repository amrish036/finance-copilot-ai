"use client";

import { Card } from "@/components/ui/card";

import { calculateMortgage } from "@/lib/calculations/mortgage";

import { formatCurrency } from "@/lib/utils";

const scenarios = [
  {
    name: "Scenario A",
    loanAmount: 800000,
    interestRate: 5.9,
    loanTermYears: 30,
  },

  {
    name: "Scenario B",
    loanAmount: 950000,
    interestRate: 6.3,
    loanTermYears: 30,
  },

  {
    name: "Scenario C",
    loanAmount: 650000,
    interestRate: 5.7,
    loanTermYears: 25,
  },
];

export function ScenarioComparison() {
  const results = scenarios.map((scenario) => ({
    ...scenario,

    result: calculateMortgage({
      loanAmount: scenario.loanAmount,
      interestRate: scenario.interestRate,
      loanTermYears: scenario.loanTermYears,
    }),
  }));

  return (
    <Card className="mt-10 rounded-3xl border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Scenario Comparison</h2>

        <p className="mt-2 text-slate-400">
          Compare mortgage scenarios and evaluate long-term affordability.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="pb-4">Scenario</th>

              <th className="pb-4">Loan Amount</th>

              <th className="pb-4">Interest Rate</th>

              <th className="pb-4">Monthly Repayment</th>

              <th className="pb-4">Total Interest</th>
            </tr>
          </thead>

          <tbody>
            {results.map((scenario) => (
              <tr key={scenario.name} className="border-b border-white/5">
                <td className="py-5 font-medium">{scenario.name}</td>

                <td className="py-5">{formatCurrency(scenario.loanAmount)}</td>

                <td className="py-5">{scenario.interestRate}%</td>

                <td className="py-5">
                  {formatCurrency(scenario.result.monthlyRepayment)}
                </td>

                <td className="py-5">
                  {formatCurrency(scenario.result.totalInterest)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
