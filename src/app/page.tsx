import {
  MortgageCalculator,
  AffordabilityCalculator,
  AIAdvisor,
  ScenarioComparison,
} from "@/components";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-16">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur">
            AI-Powered Mortgage Advisor
          </div>

          <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
            Smarter Mortgage Decisions with AI
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Calculate repayments, analyze affordability, and get intelligent
            financial insights with your personal finance copilot.
          </p>
        </div>
        <MortgageCalculator />
        <AffordabilityCalculator />
        <AIAdvisor />
        <ScenarioComparison />
      </div>
    </main>
  );
}
