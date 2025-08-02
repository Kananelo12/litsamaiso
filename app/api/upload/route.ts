/* eslint-disable @typescript-eslint/no-explicit-any */

import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file     = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload the file directly into your default Blob store
    // “uploads/” here becomes the “key prefix” in the Blob store
    const blob = await put(
      `uploads/${Date.now()}-${file.name}`,
      file,
      { access: "public" }
    );

    console.log("BLOB: ", blob)
    console.log("BLOB URL: ", blob.url)

    // blob.url is the public URL to your file
    return NextResponse.json({ url: blob.url });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
