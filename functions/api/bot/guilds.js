export async function onRequestGet(context) {
  const BOT_API = context.env.BOT_API_URL;
  if (!BOT_API) {
    return Response.json({ error: "BOT_API_URL no configurada" }, { status: 503 });
  }

  try {
    let botGuilds = [];
    try {
      const botGuildsRes = await fetch(BOT_API + "/api/public/guilds", { cache: "no-store" });
      if (botGuildsRes.ok) {
        botGuilds = await botGuildsRes.json();
      }
    } catch {}

    const botGuildIds = new Set(botGuilds.map((g) => g.id));

    let userGuilds = [];
    let accessToken = null;

    const cookie = context.request.headers.get("Cookie") || "";
    const match = cookie.match(/system777_session=([^;]+)/);
    if (match) {
      try {
        const session = JSON.parse(atob(match[1]));
        if (session.accessToken && session.expiresAt && Date.now() < session.expiresAt) {
          accessToken = session.accessToken;
        }
      } catch {}
    }

    if (accessToken) {
      try {
        const userGuildsRes = await fetch("https://discord.com/api/v10/users/@me/guilds", {
          headers: { Authorization: "Bearer " + accessToken },
          cache: "no-store",
        });
        if (userGuildsRes.ok) {
          userGuilds = await userGuildsRes.json();
        }
      } catch {}
    }

    if (userGuilds.length > 0) {
      const ADMIN = 0x8;
      const merged = userGuilds.map((g) => {
        const bot = botGuilds.find((b) => b.id === g.id);
        return {
          id: g.id,
          name: g.name,
          icon: g.icon ? "https://cdn.discordapp.com/icons/" + g.id + "/" + g.icon + ".png" : null,
          members: bot ? bot.members : 0,
          inBot: botGuildIds.has(g.id),
          isAdmin: (parseInt(g.permissions) & ADMIN) === ADMIN,
        };
      }).sort((a, b) => (b.inBot ? 1 : 0) - (a.inBot ? 1 : 0));
      return Response.json(merged);
    }

    if (botGuilds.length > 0) {
      return Response.json(botGuilds.map((g) => ({
        id: g.id, name: g.name, icon: g.icon, members: g.members, inBot: true, isAdmin: true,
      })));
    }

    return Response.json([]);
  } catch {
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}
