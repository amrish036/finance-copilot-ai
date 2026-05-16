import Groq from "groq-sdk";

import { executeTool } from "@/lib/ai/tool-executor";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function parseMoneyValue(value: string, suffix = "") {
  const amount = Number(value.replace(/,/g, ""));
  const normalizedSuffix = suffix.toLowerCase();

  if (normalizedSuffix === "k") {
    return amount * 1_000;
  }

  if (normalizedSuffix === "m") {
    return amount * 1_000_000;
  }

  return amount;
}

function extractNumberAfter(message: string, keywords: string[]) {
  for (const keyword of keywords) {
    const match = message.match(
      new RegExp(`${keyword}[^0-9]*\\$?([0-9][0-9,.]*)([kKmM])?`, "i"),
    );

    if (match) {
      return parseMoneyValue(match[1], match[2]);
    }
  }

  return undefined;
}

function extractNumberBefore(message: string, keywords: string[]) {
  for (const keyword of keywords) {
    const match = message.match(
      new RegExp(`\\$?([0-9][0-9,.]*)([kKmM])?[^0-9]*${keyword}`, "i"),
    );

    if (match) {
      return parseMoneyValue(match[1], match[2]);
    }
  }

  return undefined;
}

function extractLikelyLoanAmount(message: string) {
  const matches = message.matchAll(/\$?([0-9][0-9,.]*)([kKmM])?/g);

  for (const match of matches) {
    const value = parseMoneyValue(match[1], match[2]);
    const hasMoneySuffix = Boolean(match[2]);
    const hasDollarSign = match[0].startsWith("$");

    if (hasMoneySuffix || hasDollarSign || value >= 10_000) {
      return value;
    }
  }

  return undefined;
}

function inferToolCall(message: string) {
  const lowerMessage = message.toLowerCase();

  if (
    /\b(afford|affordability|borrowing power|borrow|income|salary)\b/.test(
      lowerMessage,
    )
  ) {
    return {
      tool: "calculateAffordability",
      args: {
        annualIncome:
          extractNumberAfter(message, ["income", "salary", "earn"]) ?? 180000,
        monthlyExpenses:
          extractNumberAfter(message, ["expenses", "spending", "costs"]) ??
          4000,
        monthlyDebts:
          extractNumberAfter(message, ["debts", "debt", "loans"]) ?? 500,
        interestRate:
          extractNumberAfter(message, ["interest", "rate"]) ?? 6.1,
      },
    };
  }

  if (/\b(mortgage|repayment|repayments|home loan|loan)\b/.test(lowerMessage)) {
    return {
      tool: "calculateMortgage",
      args: {
        loanAmount:
          extractNumberBefore(message, ["loan", "mortgage", "borrow"]) ??
          extractLikelyLoanAmount(message) ??
          extractNumberAfter(message, ["mortgage", "amount", "borrow"]) ??
          900000,
        interestRate:
          extractNumberAfter(message, ["interest", "rate"]) ?? 6.1,
        loanTermYears:
          extractNumberAfter(message, ["term", "years", "year"]) ??
          extractNumberBefore(message, ["years", "year"]) ??
          30,
      },
    };
  }

  return null;
}

function formatToolResult(
  toolName: string,
  result: Awaited<ReturnType<typeof executeTool>>,
) {
  if (toolName === "calculateMortgage" && "monthlyRepayment" in result) {
    return `Your estimated monthly repayment is ${formatCurrency(
      result.monthlyRepayment,
    )}. Over the life of the loan, you would repay about ${formatCurrency(
      result.totalRepayment,
    )}, including ${formatCurrency(
      result.totalInterest,
    )} in interest. This is an estimate, so compare it against your actual lender rate, fees, and repayment frequency.`;
  }

  if ("estimatedBorrowingPower" in result) {
    return `Your estimated borrowing power is ${formatCurrency(
      result.estimatedBorrowingPower,
    )}. Your available monthly budget is about ${formatCurrency(
      result.availableMonthlyBudget,
    )}, and your debt-to-income ratio is ${formatPercent(
      result.debtToIncomeRatio,
    )}, which looks ${result.affordabilityStatus.toLowerCase()}. This is a guide only; lenders may use different buffers and assessment rules.`;
  }

  return "I calculated the result, but could not format the advice.";
}

function compactToolResult(result: Awaited<ReturnType<typeof executeTool>>) {
  if ("monthlyRepayment" in result) {
    return {
      monthlyRepayment: result.monthlyRepayment,
      totalRepayment: result.totalRepayment,
      totalInterest: result.totalInterest,
    };
  }

  return result;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const latestMessage =
      body.messages?.[body.messages.length - 1]?.content || "";

    const toolCall = inferToolCall(latestMessage);

    if (toolCall) {
      const toolResult = await executeTool(toolCall.tool, toolCall.args);
      const compactResult = compactToolResult(toolResult);

      console.log("TOOL CALL:");
      console.log(toolCall);
      console.log("TOOL RESULT:");
      console.log(compactResult);

      const explanation = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",

        temperature: 0.3,

        max_tokens: 200,

        messages: [
          {
            role: "system",
            content: `
You are a helpful mortgage advisor.

Explain these financial results clearly and concisely.

Tool result:
${JSON.stringify(compactResult)}

Provide practical financial insights.
            `,
          },
          {
            role: "user",
            content: latestMessage,
          },
        ],
      });

      console.log("EXPLANATION MESSAGE:");
      console.log(explanation.choices[0].message);

      const finalMessage =
        explanation.choices[0].message.content?.trim() ||
        formatToolResult(toolCall.tool, toolResult);

      console.log("FINAL MESSAGE:");
      console.log(finalMessage);

      return Response.json({
        message: finalMessage,
      });
    }

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      temperature: 0.4,

      max_tokens: 200,

      messages: [
        {
          role: "system",
          content:
            "You are a helpful finance copilot. Answer clearly and ask for missing numbers when needed.",
        },
        {
          role: "user",
          content: latestMessage,
        },
      ],
    });

    return Response.json({
      message:
        response.choices[0].message.content ||
        "I can help with mortgage repayments, affordability, borrowing power, budgeting, or financial planning questions.",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Something went wrong.",
      },
      {
        status: 500,
      },
    );
  }
}
