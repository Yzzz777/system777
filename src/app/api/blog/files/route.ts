import { NextRequest, NextResponse } from "next/server";
import { getBlogFiles, deleteBlogFile } from "@/lib/db";
import { isOwner } from "@/lib/adminAuth";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    if (!(await isOwner(req))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId") || undefined;
    const files = await getBlogFiles(postId ?? undefined);
    return NextResponse.json(files);
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await isOwner(req))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");
    if (!fileId) {
      return NextResponse.json({ error: "fileId requerido" }, { status: 400 });
    }
    await deleteBlogFile(fileId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
