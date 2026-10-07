import { NextRequest, NextResponse } from "next/server";
import { verifySession, signSession } from "@/lib/sessionCrypto";

export const runtime = "edge";

type SessionData = {
  id?: string;
  username?: string;
  global_name?: string;
  avatar?: string;
  banner?: string | null;
  bio?: string | null;
  accent_color?: number | null;
  discriminator?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
};

function avatarUrl(id: string | undefined, avatar: string | null | undefined): string | null {
  if (!id || !avatar) return null;
  const ext = avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${id}/${avatar}.${ext}?size=256`;
}

function bannerUrl(id: string | undefined, banner: string | null | undefined): string | null {
  if (!id || !banner) return null;
  const ext = banner.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/banners/${id}/${banner}.${ext}?size=600`;
}

function buildProfile(s: SessionData) {
  return {
    id: s.id ?? null,
    globalName: s.global_name || s.username || null,
    username: s.username ?? null,
    discriminator: s.discriminator ?? null,
    avatarUrl: avatarUrl(s.id, s.avatar),
    bannerUrl: bannerUrl(s.id, s.banner),
    bio: s.bio ?? null,
    accentColor: typeof s.accent_color === "number" ? s.accent_color : null,
  };
}

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
    return { accessToken: tokens.access_token, expiresAt: Date.now() + tokens.expires_in * 1000 };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("system777_session")?.value;
  if (!cookie) return NextResponse.json({ profile: null });

  try {
    const parsed = await verifySession(cookie);
    if (!parsed) return NextResponse.json({ profile: null });
    let sessionData = parsed as SessionData;

    if (!sessionData.accessToken || (sessionData.expiresAt && Date.now() > sessionData.expiresAt)) {
      if (sessionData.refreshToken) {
        const refreshed = await refreshDiscordToken(sessionData.refreshToken);
        if (refreshed) {
          sessionData = { ...sessionData, accessToken: refreshed.accessToken, expiresAt: refreshed.expiresAt };
        }
      }
    }

    if (sessionData.accessToken) {
      try {
        const res = await fetch("https://discord.com/api/users/@me", {
          headers: { Authorization: `Bearer ${sessionData.accessToken}` },
          cache: "no-store",
        });
        if (res.ok) {
          const u = await res.json();
          sessionData = {
            ...sessionData,
            username: u.username ?? sessionData.username,
            global_name: u.global_name ?? sessionData.global_name,
            avatar: u.avatar ?? sessionData.avatar,
            banner: u.banner ?? null,
            bio: u.bio ?? null,
            accent_color: typeof u.accent_color === "number" ? u.accent_color : null,
          };
          const response = NextResponse.json({ profile: buildProfile(sessionData) });
          response.cookies.set("system777_session", await signSession(sessionData as unknown as Record<string, unknown>), {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60,
          });
          return response;
        }
      } catch {
        /* sin red: devolvemos lo que hay en sesión */
      }
    }

    return NextResponse.json({ profile: buildProfile(sessionData) });
  } catch {
    return NextResponse.json({ profile: null });
  }
}
