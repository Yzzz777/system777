import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return Response.redirect(new URL("/login?error=no_code", req.url));
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = "https://jrsystem7777.com/api/auth/discord/callback";

  if (!clientId || !clientSecret) {
    return Response.redirect(new URL("/login?error=config", req.url));
  }

  try {
    // Exchange code for tokens
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
      return Response.redirect(new URL("/login?error=token_exchange", req.url));
    }

    const tokens = await tokenRes.json();

    // Get user info
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userRes.ok) {
      return Response.redirect(new URL("/login?error=user_fetch", req.url));
    }

    const user = await userRes.json();

    // Create JWT token (simple base64 for now)
    const sessionData = {
      id: user.id,
      username: user.username,
      global_name: user.global_name,
      avatar: user.avatar,
      discriminator: user.discriminator,
      email: user.email,
      accessToken: tokens.access_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    };

    const jwt = btoa(JSON.stringify(sessionData));

    // Set cookie and redirect
    const response = Response.redirect(new URL("/bot/dashboard", req.url));
    response.headers.set(
      "Set-Cookie",
      `system777_session=${jwt}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${tokens.expires_in}`
    );

    return response;
  } catch (error) {
    console.error("Discord OAuth error:", error);
    return Response.redirect(new URL("/login?error=internal", req.url));
  }
}
