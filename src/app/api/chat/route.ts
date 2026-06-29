import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

const messageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1).max(5000),
  type: z.enum(["text", "image", "file"]).default("text"),
});

const conversations: Record<string, { id: string; participants: string[]; messages: { id: string; senderId: string; content: string; type: string; read: boolean; createdAt: string }[] }> = {};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const conversationId = url.searchParams.get("conversationId");

  if (conversationId && conversations[conversationId]) {
    return NextResponse.json({ messages: conversations[conversationId].messages });
  }

  return NextResponse.json({ conversations: Object.values(conversations) });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = messageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { conversationId, content, type } = parsed.data;

    if (!conversations[conversationId]) {
      conversations[conversationId] = { id: conversationId, participants: [], messages: [] };
    }

    const message = {
      id: Date.now().toString(),
      senderId: "current-user",
      content,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };

    conversations[conversationId].messages.push(message);

    return NextResponse.json({ success: true, message });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
