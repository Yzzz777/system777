export const runtime = "edge";

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = "https://jrsystem7777.com/api/auth/discord/callback";

  if (!clientId) {
    return new Response("Missing DISCORD_CLIENT_ID", { status: 500 });
  }

  const url = new URL("https://discord.com/api/oauth2/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "identify guilds email");

  return Response.redirect(url);
}
