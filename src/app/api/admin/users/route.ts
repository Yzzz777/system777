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

    await sql`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      username TEXT UNIQUE,
      password TEXT NOT NULL,
      avatar TEXT,
      bio TEXT,
      role TEXT DEFAULT 'STUDENT',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`;

    const users = await sql`SELECT id, email, name, username, role, created_at FROM users ORDER BY created_at DESC`;
    return NextResponse.json({ users });
  } catch (err: unknown) {
    console.error("Admin users error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
