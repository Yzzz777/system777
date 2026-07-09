import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "edge";
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

export async function GET() {
  if (!BOT_API) {
    return NextResponse.json({ error: "BOT_API_URL no configurada" }, { status: 503 });
  }

  try {
    const botGuildsRes = await fetch(`${BOT_API}/api/public/guilds`, { cache: "no-store" });
    if (!botGuildsRes.ok) return NextResponse.json({ error: "Bot offline" }, { status: 502 });

    const botGuilds = await botGuildsRes.json() as BotGuild[];
    const botGuildIds = new Set(botGuilds.map((g) => g.id));

    let userGuilds: DiscordGuild[] = [];
    let accessToken: string | null = null;

    try {
      const session = await auth();
      accessToken = (session as unknown as Record<string, unknown>)?.accessToken as string | null;
    } catch {}

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

    return NextResponse.json(botGuilds.map((g) => ({
      id: g.id,
      name: g.name,
      icon: g.icon,
      members: g.members,
      inBot: true,
      isAdmin: true,
    })));
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
