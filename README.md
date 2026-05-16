# Finance Copilot AI

An AI-assisted mortgage and affordability dashboard built with Next.js, React, Tailwind CSS, Recharts, and Groq.

The app helps users estimate mortgage repayments, understand borrowing power, compare scenarios, and ask finance questions through an AI advisor.

Loom Video:

<div>
    <a href="https://www.loom.com/share/03a146fc52784a8797e08b2b33930757" target="_blank" rel="noopener noreferrer">
      <p>Smarter Mortgage - Watch Video</p>
    </a>
    <a href="https://www.loom.com/share/03a146fc52784a8797e08b2b33930757" target="_blank" rel="noopener noreferrer">
      <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/03a146fc52784a8797e08b2b33930757-8ad982d85faa5fb8-full-play.gif#t=0.1">
    </a>
  </div>

## Features

- Mortgage repayment calculator with monthly repayment, total repayment, and total interest estimates
- Affordability analyzer for income, expenses, debts, borrowing power, and risk level
- AI financial advisor powered by Groq
- Scenario comparison table for multiple loan setups
- Currency formatting for Australian dollars
- Chat parsing for values like `500k`, `$650,000`, and `1.2m`

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Groq SDK
- Recharts
- shadcn-style UI primitives

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create `.env.local` in the project root:

```bash
GROQ_API_KEY=your_groq_api_key
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
pnpm dev      # Start the local dev server
pnpm build    # Create a production build
pnpm start    # Start the production server
pnpm lint     # Run ESLint
```

## Project Structure

```text
src/app/page.tsx              Main dashboard page
src/app/api/chat/route.ts     AI chat API route
src/components/               App UI components
src/components/ui/            Shared UI primitives
src/lib/calculations/         Mortgage and affordability calculations
src/lib/ai/                   AI tool registry and executor
src/lib/utils/                Formatting and className helpers
```

## Notes

The calculators are estimates only and should not be treated as financial advice. Real borrowing capacity depends on lender policy, fees, buffers, credit history, dependants, living expenses, and other obligations.

The AI chat route keeps calculator payloads compact before sending data to Groq, so large mortgage amortization schedules do not exceed token limits.
