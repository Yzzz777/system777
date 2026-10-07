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
    const rawPostId = formData.get("postId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "file requerido" }, { status: 400 });
    }
    // Sin postId los archivos van al "bucket" general del sitio.
    const postId = (rawPostId || "general").trim();
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(postId)) {
      return NextResponse.json({ error: "postId inválido" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Archivo supera el máximo de 10 MB" }, { status: 413 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) {
      bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    const base64 = btoa(bin);

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
