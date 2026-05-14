"use client";

import { useMemo, useState } from "react";

import { Card, Input } from "@/components/ui";

import { calculateAffordability } from "@/lib/calculations";

import { formatCurrency } from "@/lib/utils";

export function AffordabilityCalculator() {
  const [annualIncome, setAnnualIncome] = useState(180000);

  const [monthlyExpenses, setMonthlyExpenses] = useState(4000);

  const [monthlyDebts, setMonthlyDebts] = useState(500);

  const [interestRate, setInterestRate] = useState(6.1);

  const result = useMemo(() => {
    return calculateAffordability({
      annualIncome,
      monthlyExpenses,
      monthlyDebts,
      interestRate,
    });
  }, [annualIncome, monthlyExpenses, monthlyDebts, interestRate]);

  return (
    <Card className="mt-10 rounded-3xl border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Affordability Analyzer</h2>

        <p className="mt-2 text-slate-400">
          Understand your borrowing power and financial health.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Annual Income
          </label>

          <Input
            type="number"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(Number(e.target.value))}
            className="border-white/10 bg-slate-950/50 text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Monthly Expenses
          </label>

          <Input
            type="number"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
            className="border-white/10 bg-slate-950/50 text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Monthly Debts
          </label>

          <Input
            type="number"
            value={monthlyDebts}
            onChange={(e) => setMonthlyDebts(Number(e.target.value))}
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
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl border-white/10 bg-slate-900/80 p-6">
          <p className="text-sm text-slate-400">Monthly Income</p>

          <p className="mt-3 text-2xl font-bold">
            {formatCurrency(result.monthlyIncome)}
          </p>
        </Card>

        <Card className="rounded-2xl border-white/10 bg-slate-900/80 p-6">
          <p className="text-sm text-slate-400">Available Budget</p>

          <p className="mt-3 text-2xl font-bold">
            {formatCurrency(result.availableMonthlyBudget)}
          </p>
        </Card>

        <Card className="rounded-2xl border-white/10 bg-slate-900/80 p-6">
          <p className="text-sm text-slate-400">Borrowing Power</p>

          <p className="mt-3 text-2xl font-bold">
            {formatCurrency(result.estimatedBorrowingPower)}
          </p>
        </Card>

        <Card className="rounded-2xl border-white/10 bg-slate-900/80 p-6">
          <p className="text-sm text-slate-400">Risk Level</p>

          <p className="mt-3 text-2xl font-bold">
            {result.affordabilityStatus}
          </p>
        </Card>
      </div>
    </Card>
  );
}
