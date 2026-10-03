import { NextRequest, NextResponse } from "next/server";
import { verifySession, signSession } from "@/lib/sessionCrypto";

export const runtime = "edge";
export const dynamic = "force-dynamic";

async function refreshDiscordToken(refreshToken: string): Promise<string | null> {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  try {
    const res = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }).toString(),
    });
    if (!res.ok) return null;
    const tokens = await res.json();
    return tokens.access_token;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("system777_session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ token: null });
  }

  try {
    const parsed = await verifySession(sessionCookie);
    if (!parsed) return NextResponse.json({ token: null });
    const session = parsed as { accessToken?: string; expiresAt?: number; refreshToken?: string };

    if (session.accessToken && session.expiresAt && Date.now() < (session.expiresAt as number)) {
      return NextResponse.json({ token: session.accessToken });
    }

    if (session.refreshToken) {
      const refreshed = await refreshDiscordToken(session.refreshToken as string);
      if (refreshed) {
        const updated = { ...session, accessToken: refreshed, expiresAt: Date.now() + 3600 * 1000 };
        const res = NextResponse.json({ token: refreshed });
        res.cookies.set("system777_session", await signSession(updated as unknown as Record<string, unknown>), {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 30 * 24 * 60 * 60,
        });
        return res;
      }
    }

    return NextResponse.json({ token: null });
  } catch {
    return NextResponse.json({ token: null });
  }
}
