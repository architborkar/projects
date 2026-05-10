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

  const businessData = JSON.parse(
    fs.readFileSync(businessPath, "utf-8")
  );

  const currentNotes =
    businessData.aiNotes || "";

  const summarizerPrompt = `
You are an AI memory system.

Your job:
- extract important productivity updates
- summarize user progress
- ignore casual conversation
- keep notes concise

Current Notes:
${currentNotes}

User Message:
${body.message}

Write ONE concise memory update.

Examples:
- User completed homepage UI.
- Client meeting moved to Thursday.
- User plans to deploy MVP this week.

If message contains nothing useful, return:
NO_UPDATE
`;

  const response =
    await client.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "system",
          content: summarizerPrompt,
        },
      ],
    });

  const memory =
    response.choices[0].message.content || "";

  if (memory !== "NO_UPDATE") {
    businessData.aiNotes =
      currentNotes +
      "\n" +
      `[${new Date().toLocaleDateString()}] ` +
      memory;

    fs.writeFileSync(
      businessPath,
      JSON.stringify(businessData, null, 2)
    );
  }

  return Response.json({
    success: true,
  });
}