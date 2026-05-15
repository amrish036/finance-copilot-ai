import Groq from "groq-sdk";

import { analyzeScenario } from "@/lib/ai/financial-tools";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages = body.messages || [];

    const financialAnalysis = analyzeScenario();

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "system",
          content: `
You are an AI mortgage and finance advisor.

You MUST use the provided financial analysis data to answer users accurately.

FINANCIAL ANALYSIS:

Monthly repayment: ${Math.round(financialAnalysis.mortgage.monthlyRepayment)}

Estimated borrowing power: ${Math.round(financialAnalysis.affordability.estimatedBorrowingPower)}

Risk level: ${financialAnalysis.affordability.affordabilityStatus}

Your role:
- explain affordability
- discuss repayment risks
- explain budgeting
- provide educational insights
- avoid pretending to be a licensed advisor
- encourage financially safe decisions

Be concise and practical.
            `,
        },

        ...messages,
      ],
    });

    return Response.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
