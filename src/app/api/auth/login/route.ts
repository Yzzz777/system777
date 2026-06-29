import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ensureUsersTable, findUserByEmail, createActivityLog } from "@/lib/db";
import { z } from "zod";

export const runtime = "edge";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
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
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many login attempts. Try again in 15 minutes." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    await ensureUsersTable();
    const user = await findUserByEmail(email);

    if (!user || !user.password) {
      await createActivityLog({ userId: "system", action: "FAILED_LOGIN", details: `Failed login for ${email}`, ip });
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      await createActivityLog({ userId: user.id, action: "FAILED_LOGIN", details: "Invalid password", ip });
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await createActivityLog({ userId: user.id, action: "LOGIN", ip });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, username: user.username },
    });
  } catch (err: unknown) {
    console.error("Login error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
