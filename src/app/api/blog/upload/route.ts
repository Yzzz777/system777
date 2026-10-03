import { NextRequest, NextResponse } from "next/server";
import { addBlogFile } from "@/lib/db";
import { isOwner } from "@/lib/adminAuth";

export const runtime = "edge";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  try {
    if (!(await isOwner(req))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const postId = formData.get("postId") as string | null;

    if (!file || !postId) {
      return NextResponse.json({ error: "file y postId requeridos" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Archivo supera el máximo de 10 MB" }, { status: 413 });
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
