"use client";

import { useMemo, useState } from "react";

import { Card, Input } from "@/components/ui";

import { calculateMortgage } from "@/lib/calculations";

import { formatCurrency } from "@/lib/utils";

import { MortgageChart } from "@/components";

export function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState(800000);

  const [interestRate, setInterestRate] = useState(6.1);

  const [loanTermYears, setLoanTermYears] = useState(30);

  const result = useMemo(() => {
    return calculateMortgage({
      loanAmount,
      interestRate,
      loanTermYears,
    });
  }, [loanAmount, interestRate, loanTermYears]);

  return (
    <>
      <Card className="rounded-3xl border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur border-top:-4 border-blue-500">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Mortgage Calculator
          </h2>

          <p className="mt-2 text-slate-400">
            Estimate your monthly repayments and total loan costs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Loan Amount
            </label>

            <Input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="border-white/10 bg-slate-950/50 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Interest Rate (%)
            </label>

            <Input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="border-white/10 bg-slate-950/50 text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Loan Term (Years)
            </label>

            <Input
              type="number"
              value={loanTermYears}
              onChange={(e) => setLoanTermYears(Number(e.target.value))}
              className="border-white/10 bg-slate-950/50 text-white"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Card className="rounded-2xl border-white/10 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-400">Monthly Repayment</p>

            <p className="mt-3 text-3xl font-bold">
              {formatCurrency(result.monthlyRepayment)}
            </p>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-400">Total Repayment</p>

            <p className="mt-3 text-3xl font-bold">
              {formatCurrency(result.totalRepayment)}
            </p>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-slate-900/80 p-6">
            <p className="text-sm text-slate-400">Total Interest</p>

            <p className="mt-3 text-3xl font-bold">
              {formatCurrency(result.totalInterest)}
            </p>
          </Card>
        </div>
      </Card>
      <div className="mt-10">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Loan Balance Over Time</h3>

          <p className="text-sm text-slate-400">
            Visualize how your mortgage balance decreases across the loan term.
          </p>
        </div>

        <Card className="rounded-2xl border-white/10 bg-slate-900/80 p-6">
          <MortgageChart data={result.amortizationSchedule} />
        </Card>
      </div>
    </>
  );
}

export default MortgageCalculator;
