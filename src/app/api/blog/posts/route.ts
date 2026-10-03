import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, createBlogPost, deleteBlogPost, getBlogPost } from "@/lib/db";
import { isOwner } from "@/lib/adminAuth";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const owner = await isOwner(req);
    // Público solo ve publicados; el owner también ve los borradores.
    const posts = await getBlogPosts(!owner);
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isOwner(req))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: "title y slug son requeridos" }, { status: 400 });
    }
    const existing = await getBlogPost(body.slug);
    if (existing) {
      return NextResponse.json({ error: "Ya existe un post con ese slug" }, { status: 409 });
    }
    const post = await createBlogPost(body);
    return NextResponse.json({ ok: true, post });
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
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });
    await deleteBlogPost(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
