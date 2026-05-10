import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "business.json");

export async function GET() {
  const fileData = fs.readFileSync(filePath, "utf-8");

  return Response.json(JSON.parse(fileData));
}