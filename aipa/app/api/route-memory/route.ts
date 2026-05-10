import { client } from "@/lib/ai";

import fs from "fs";
import path from "path";

const businessPath = path.join(
  process.cwd(),
  "data",
  "business.json"
);

const dietPath = path.join(
  process.cwd(),
  "data",
  "diet.json"
);

const exercisePath = path.join(
  process.cwd(),
  "data",
  "exercise.json"
);

export async function POST(req: Request) {
  const body = await req.json();

  const classifierPrompt = `
You are an AI classifier.

Classify the user message into ONE category:

BUSINESS
DIET
EXERCISE
NONE

User Message:
${body.message}

Return ONLY category name.
`;

  const classification =
    await client.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "system",
          content: classifierPrompt,
        },
      ],
    });

  const category =
    classification.choices[0].message.content?.trim();

  const summarizerPrompt = `
Summarize this user update into concise memory.

User Message:
${body.message}

Examples:
- User completed homepage UI.
- User consumed 2200 calories today.
- User completed push workout.

If not useful return:
NO_UPDATE
`;

  const summaryResponse =
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
    summaryResponse.choices[0].message.content?.trim();

  if (!memory || memory === "NO_UPDATE") {
    return Response.json({
      success: true,
    });
  }

  let targetPath = businessPath;

  if (category === "DIET") {
    targetPath = dietPath;
  }

  if (category === "EXERCISE") {
    targetPath = exercisePath;
  }

  const data = JSON.parse(
    fs.readFileSync(targetPath, "utf-8")
  );

  data.aiNotes =
    (data.aiNotes || "") +
    "\n" +
    `[${new Date().toLocaleDateString()}] ` +
    memory;

  fs.writeFileSync(
    targetPath,
    JSON.stringify(data, null, 2)
  );

  return Response.json({
    success: true,
    category,
  });
}