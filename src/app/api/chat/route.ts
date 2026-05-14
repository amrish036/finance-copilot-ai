import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages = body.messages || [];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `
You are a professional AI mortgage and finance assistant.

Your role:
- help users understand affordability
- explain mortgage concepts
- discuss budgeting and repayments
- provide educational financial insights
- NEVER claim to be a licensed financial advisor
- NEVER provide guaranteed financial outcomes
- Always encourage responsible borrowing

Keep responses:
- concise
- practical
- beginner friendly
- financially responsible
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
