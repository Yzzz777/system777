import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ensureUsersTable, findUserByEmail, createActivityLog } from "@/lib/db";

export const runtime = "edge";

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
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }

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

    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      username: user.username,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    const jwt = btoa(JSON.stringify(sessionData));

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, username: user.username },
    });

    response.headers.set(
      "Set-Cookie",
      `system777_session=${jwt}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
    );

    return response;
  } catch (err: unknown) {
    console.error("Login error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
