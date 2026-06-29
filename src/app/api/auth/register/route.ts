import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ensureUsersTable, createUser } from "@/lib/db";
import { z } from "zod";

export const runtime = "edge";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers and underscores"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const RATE_LIMIT_STORE = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = RATE_LIMIT_STORE.get(ip);

  if (!record || now > record.resetAt) {
    RATE_LIMIT_STORE.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) return false;

  record.count++;
  return true;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many registration attempts. Try again later." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { name, email, username, password } = parsed.data;

    await ensureUsersTable();

    const { findUserByEmail, findUserByUsername } = await import("@/lib/db");
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await createUser({ name, email, username, password: hashedPassword });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (err: unknown) {
    console.error("Register error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
