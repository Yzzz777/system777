import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "OWNER") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    await sql`CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )`;

    const messages = await sql`SELECT * FROM contact_messages ORDER BY created_at DESC`;
    return NextResponse.json({ messages });
  } catch (err: unknown) {
    console.error("Admin messages error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
