import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BOT_API = process.env.BOT_API_URL ?? "";

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  permissions: string;
}

interface BotGuild {
  id: string;
  name: string;
  icon: string | null;
  members: number;
}

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

function parseSessionCookie(cookie: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(cookie));
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  if (!BOT_API) {
    return NextResponse.json({ error: "BOT_API_URL no configurada" }, { status: 503 });
  }

  try {
    let botGuilds: BotGuild[] = [];
    try {
      const botGuildsRes = await fetch(`${BOT_API}/api/public/guilds`, { cache: "no-store" });
      if (botGuildsRes.ok) {
        botGuilds = await botGuildsRes.json() as BotGuild[];
      }
    } catch {}

    const botGuildIds = new Set(botGuilds.map((g) => g.id));

    let userGuilds: DiscordGuild[] = [];
    let accessToken: string | null = null;

    const sessionCookie = req.cookies.get("system777_session")?.value;
    if (sessionCookie) {
      const session = parseSessionCookie(sessionCookie);
      if (session) {
        if (session.accessToken && session.expiresAt && Date.now() < (session.expiresAt as number)) {
          accessToken = session.accessToken as string;
        } else if (session.refreshToken) {
          const refreshed = await refreshDiscordToken(session.refreshToken as string);
          if (refreshed) accessToken = refreshed;
        }
      }
    }

    if (accessToken) {
      try {
        const userGuildsRes = await fetch("https://discord.com/api/v10/users/@me/guilds", {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        });
        if (userGuildsRes.ok) {
          userGuilds = await userGuildsRes.json() as DiscordGuild[];
        }
      } catch {}
    }

    if (userGuilds.length > 0) {
      const ADMIN = 0x8;
      const merged = userGuilds
        .map((g) => {
          const bot = botGuilds.find((b) => b.id === g.id);
          return {
            id: g.id,
            name: g.name,
            icon: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png` : null,
            members: bot?.members ?? 0,
            inBot: botGuildIds.has(g.id),
            isAdmin: (parseInt(g.permissions) & ADMIN) === ADMIN,
          };
        })
        .sort((a, b) => (b.inBot ? 1 : 0) - (a.inBot ? 1 : 0));
      return NextResponse.json(merged);
    }

    if (botGuilds.length > 0) {
      return NextResponse.json(botGuilds.map((g) => ({
        id: g.id,
        name: g.name,
        icon: g.icon,
        members: g.members,
        inBot: true,
        isAdmin: true,
      })));
    }

    return NextResponse.json([]);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
