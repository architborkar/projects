import fs from "fs";
import path from "path";

const filePath = path.join(
  process.cwd(),
  "data",
  "chat.json"
);

export async function POST(req: Request) {
  const body = await req.json();

  fs.writeFileSync(
    filePath,
    JSON.stringify(body.chat, null, 2)
  );

  return Response.json({
    success: true,
  });
}