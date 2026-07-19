export default {
  async fetch(request, env) {
    const BOT_URL = env.BOT_API_URL;
    if (!BOT_URL) {
      return Response.json({ error: "BOT_API_URL no configurado" }, { status: 500 });
    }
    try {
      const body = request.method !== "GET" ? await request.text() : undefined;
      const res = await fetch(BOT_URL + "/api/public/guilds", {
        method: request.method,
        headers: { "Content-Type": "application/json" },
        body,
      });
      const data = await res.text();
      return new Response(data, { status: res.status, headers: { "Content-Type": "application/json" } });
    } catch {
      return Response.json({ error: "Bot no disponible" }, { status: 502 });
    }
  }
};
