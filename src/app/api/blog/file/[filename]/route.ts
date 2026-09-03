import { NextRequest, NextResponse } from "next/server";
import { getBlogFileData, incrementDownload } from "@/lib/db";

export const runtime = "edge";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params;
    const file = await getBlogFileData(filename);
    if (!file || !file.file_data) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    await incrementDownload(filename);

    const binaryStr = atob(file.file_data);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    return new NextResponse(bytes, {
      headers: {
        "Content-Type": file.mime || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.filename}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
