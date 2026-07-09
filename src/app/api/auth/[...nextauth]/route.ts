import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

async function refreshDiscordToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: number } | null> {
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
    return {
      accessToken: tokens.access_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("system777_session")?.value;

  if (!cookie) {
    return NextResponse.json(null);
  }

  try {
    let sessionData = JSON.parse(atob(cookie));

    if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
      if (sessionData.refreshToken) {
        const refreshed = await refreshDiscordToken(sessionData.refreshToken);
        if (refreshed) {
          sessionData = { ...sessionData, accessToken: refreshed.accessToken, expiresAt: refreshed.expiresAt };
          const response = NextResponse.json({
            user: {
              id: sessionData.id,
              name: sessionData.global_name || sessionData.username,
              email: sessionData.email,
              image: sessionData.avatar
                ? `https://cdn.discordapp.com/avatars/${sessionData.id}/${sessionData.avatar}.png`
                : null,
              role: sessionData.role || "STUDENT",
              username: sessionData.username,
            },
            accessToken: sessionData.accessToken,
            expires: new Date(sessionData.expiresAt).toISOString(),
          });
          response.cookies.set("system777_session", btoa(JSON.stringify(sessionData)), {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60,
          });
          return response;
        }
      }
      const res = NextResponse.json(null);
      res.cookies.set("system777_session", "", { path: "/", maxAge: 0 });
      return res;
    }

    const isDiscord = !!sessionData.accessToken;

    return NextResponse.json({
      user: {
        id: sessionData.id,
        name: isDiscord ? (sessionData.global_name || sessionData.username) : sessionData.name,
        email: sessionData.email,
        image: isDiscord && sessionData.avatar
          ? `https://cdn.discordapp.com/avatars/${sessionData.id}/${sessionData.avatar}.png`
          : null,
        role: sessionData.role || "STUDENT",
        username: sessionData.username,
      },
      accessToken: sessionData.accessToken || null,
      expires: new Date(sessionData.expiresAt).toISOString(),
    });
  } catch {
    return NextResponse.json(null);
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
