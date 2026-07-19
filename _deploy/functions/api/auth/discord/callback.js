export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return Response.redirect(new URL("/login?error=no_code", context.request.url));
  }

  const clientId = context.env.DISCORD_CLIENT_ID;
  const clientSecret = context.env.DISCORD_CLIENT_SECRET;
  const redirectUri = "https://jrsystem7777.com/api/auth/discord/callback";

  if (!clientId || !clientSecret) {
    return Response.redirect(new URL("/login?error=config", context.request.url));
  }

  try {
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }).toString(),
    });

    if (!tokenRes.ok) {
      return Response.redirect(new URL("/login?error=token_exchange", context.request.url));
    }

    const tokens = await tokenRes.json();

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: "Bearer " + tokens.access_token },
    });

    if (!userRes.ok) {
      return Response.redirect(new URL("/login?error=user_fetch", context.request.url));
    }

    const user = await userRes.json();

    const sessionData = {
      id: user.id,
      username: user.username,
      global_name: user.global_name,
      avatar: user.avatar,
      discriminator: user.discriminator,
      email: user.email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    };

    const jwt = btoa(JSON.stringify(sessionData));

    const response = new Response(null, {
      status: 302,
      headers: {
        Location: "/bot/dashboard",
        "Set-Cookie": "system777_session=" + jwt + "; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=" + (30 * 24 * 60 * 60),
      },
    });

    return response;
  } catch (error) {
    return Response.redirect(new URL("/login?error=internal", context.request.url));
  }
}
