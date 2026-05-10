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

export async function GET() {
  const businessData = JSON.parse(
    fs.readFileSync(businessPath, "utf-8")
  );

  const dietData = JSON.parse(
    fs.readFileSync(dietPath, "utf-8")
  );

  const exerciseData = JSON.parse(
    fs.readFileSync(exercisePath, "utf-8")
  );

  const prompt = `
You are AIPA.

You are starting the user's workday.

Your tone:
- proactive
- concise
- intelligent
- motivating
- natural like a real PA

Review all available information.

BUSINESS GOALS:
${businessData.monthlyGoals}

BUSINESS TASKS:
${businessData.weeklyTasks}

BUSINESS NOTES:
${businessData.aiNotes}

DIET GOALS:
${dietData.dietGoals}

DIET NOTES:
${dietData.aiNotes}

EXERCISE PLAN:
${exerciseData.exercisePlan}

EXERCISE NOTES:
${exerciseData.aiNotes}

Generate:
- short daily review
- what user should focus on
- ask 2-3 useful followup questions

Keep under 120 words.
`;

  const response =
    await client.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
    });

  return Response.json({
    message:
      response.choices[0].message.content,
  });
}