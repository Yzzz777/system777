export async function onRequestGet(context) {
  const cookie = context.request.headers.get("Cookie") || "";
  const match = cookie.match(/system777_session=([^;]+)/);
  if (!match) return Response.json({ token: null });

  try {
    const data = JSON.parse(atob(match[1]));

    if (data.accessToken && data.expiresAt && Date.now() < data.expiresAt) {
      return Response.json({ token: data.accessToken });
    }

    if (data.refreshToken) {
      const clientId = context.env.DISCORD_CLIENT_ID;
      const clientSecret = context.env.DISCORD_CLIENT_SECRET;
      if (clientId && clientSecret) {
        try {
          const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: clientId,
              client_secret: clientSecret,
              grant_type: "refresh_token",
              refresh_token: data.refreshToken,
            }).toString(),
          });
          if (tokenRes.ok) {
            const tokens = await tokenRes.json();
            const updated = { ...data, accessToken: tokens.access_token, expiresAt: Date.now() + tokens.expires_in * 1000 };
            const response = new Response(JSON.stringify({ token: tokens.access_token }), {
              headers: { "Content-Type": "application/json" },
            });
            response.headers.set("Set-Cookie", "system777_session=" + btoa(JSON.stringify(updated)) + "; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=" + (30 * 24 * 60 * 60));
            return response;
          }
        } catch {}
      }
    }

    return Response.json({ token: data.accessToken || null });
  } catch {
    return Response.json({ token: null });
  }
}
