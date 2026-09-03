import { NextRequest, NextResponse } from "next/server";
import { addBlogFile } from "@/lib/db";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const postId = formData.get("postId") as string | null;

    if (!file || !postId) {
      return NextResponse.json({ error: "file y postId requeridos" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));

    const fileRecord = await addBlogFile({
      postId,
      filename: file.name,
      fileData: base64,
      mime: file.type,
      size: file.size,
    });

    return NextResponse.json({ ok: true, file: fileRecord });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 });
  }
}
