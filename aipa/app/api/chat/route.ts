import { client } from "@/lib/ai";

import fs from "fs";
import path from "path";

const businessPath = path.join(
  process.cwd(),
  "data",
  "business.json"
);

export async function POST(req: Request) {
  const body = await req.json();

  // Load business data
  const businessData = JSON.parse(
    fs.readFileSync(businessPath, "utf-8")
  );

  const systemPrompt = `
You are AIPA.

You are a smart AI personal assistant.

You help the user:
- track goals
- manage tasks
- stay accountable
- maintain productivity

Be conversational.
Be concise.
Talk like a real PA.

BUSINESS MONTHLY GOALS:
${businessData.monthlyGoals}

BUSINESS WEEKLY TASKS:
${businessData.weeklyTasks}

BUSINESS AI NOTES:
${businessData.aiNotes}
`;

  const response = await client.chat.completions.create({
    model: "deepseek/deepseek-chat",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: body.message,
      },
    ],
  });

  const aiReply =
    response.choices[0].message.content || "";

  return Response.json({
    reply: aiReply,
  });
}