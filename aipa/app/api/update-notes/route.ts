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

  const currentNotes = businessData.aiNotes || "";

  businessData.aiNotes =
    currentNotes +
    "\n" +
    `[${new Date().toLocaleDateString()}] ` +
    body.note;

  fs.writeFileSync(
    businessPath,
    JSON.stringify(businessData, null, 2)
  );

  return Response.json({
    success: true,
  });
}