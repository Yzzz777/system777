export default {
  async fetch(request, env) {
    const BOT_URL = env.BOT_API_URL;
    if (!BOT_URL) {
      return Response.json({ error: "BOT_API_URL no configurado" }, { status: 500 });
    }

    const url = new URL(request.url);
    const apiPath = url.pathname.replace("/api/bot/proxy/", "");
    const targetUrl = BOT_URL + "/api/" + apiPath + url.search;

    const headers = { "Content-Type": "application/json" };

    try {
      const body = request.method !== "GET" ? await request.text() : undefined;
      const res = await fetch(targetUrl, { method: request.method, headers, body });
      const data = await res.text();
      return new Response(data, {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      return Response.json({ error: "Bot no disponible" }, { status: 502 });
    }
  }
};
