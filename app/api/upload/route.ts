// app/api/upload/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    // 1. Narrow to File, not Blob
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2. Read file bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Ensure upload dir
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // 4. Use `file.name` safely now
    const filename = `${Date.now()}-${file.name}`;
    const dest = path.join(uploadDir, filename);
    await fs.writeFile(dest, buffer);

    // 5. Return the URL
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message
        : "Internal Server Error";
    return NextResponse.json(
      { error: errorMessage || "Internal Server Error" },
      { status: 500 }
    );
  }
}
