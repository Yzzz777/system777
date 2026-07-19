export async function onRequestGet(context) {
  const clientId = context.env.DISCORD_CLIENT_ID;
  if (!clientId) {
    return new Response("Missing DISCORD_CLIENT_ID", { status: 500 });
  }
  const url = new URL("https://discord.com/api/oauth2/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", "https://jrsystem7777.com/api/auth/discord/callback");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "identify guilds email");
  return Response.redirect(url);
}
