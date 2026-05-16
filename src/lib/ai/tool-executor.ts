import { tools } from "./tools";

export async function executeTool(toolName: string, args: any) {
  switch (toolName) {
    case "calculateMortgage":
      return tools.calculateMortgage({
        loanAmount: args.loanAmount ?? 900000,

        interestRate: args.interestRate ?? 6.1,

        loanTermYears: args.loanTermYears ?? 30,
      });

    case "calculateAffordability":
      return tools.calculateAffordability({
        annualIncome: args.annualIncome ?? 180000,

        monthlyExpenses: args.monthlyExpenses ?? 4000,

        monthlyDebts: args.monthlyDebts ?? 500,

        interestRate: args.interestRate ?? 6.1,
      });

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
