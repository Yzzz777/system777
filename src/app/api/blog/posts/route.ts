import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, createBlogPost, deleteBlogPost, getBlogPost } from "@/lib/db";

export const runtime = "edge";

export async function GET() {
  try {
    const posts = await getBlogPosts(false);
    return NextResponse.json(posts);
  } catch (e) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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
  } catch (e) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 });
    await deleteBlogPost(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
