"use client";

import { useState } from "react";

import { Button, Card, Input } from "@/components/ui";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AIAdvisor() {
  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m your AI finance copilot. Ask me about mortgages, repayments, budgeting, or affordability.",
    },
  ]);

  async function sendMessage() {
    if (!input.trim()) return;

    const updatedMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: input,
      },
    ];

    setMessages(updatedMessages);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.message,
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mt-10 rounded-3xl border-white/10 bg-white/5 p-8 text-white shadow-2xl backdrop-blur">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">AI Financial Advisor</h2>

        <p className="mt-2 text-slate-400">
          Ask questions about mortgages, affordability, and financial planning.
        </p>
      </div>

      <div className="h-[400px] space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/40 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[80%] rounded-2xl p-4 ${
              message.role === "user"
                ? "ml-auto bg-sky-500 text-white"
                : "bg-slate-800 text-slate-100"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              sendMessage();
            }
          }}
          placeholder="Ask about mortgages or affordability..."
          className="border-white/10 bg-slate-950/50 text-white"
        />

        <Button onClick={sendMessage} disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </Button>
      </div>
    </Card>
  );
}
