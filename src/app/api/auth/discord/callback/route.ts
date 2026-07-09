import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", req.url));
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = "https://jrsystem7777.com/api/auth/discord/callback";

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=config", req.url));
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
      const errText = await tokenRes.text();
      console.error("Discord token exchange failed:", tokenRes.status, errText);
      return NextResponse.redirect(new URL("/login?error=token_exchange", req.url));
    }

    const tokens = await tokenRes.json();

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userRes.ok) {
      console.error("Discord user fetch failed:", userRes.status);
      return NextResponse.redirect(new URL("/login?error=user_fetch", req.url));
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
      expiresAt: Date.now() + tokens.expires_in * 1000,
    };

    const jwt = btoa(JSON.stringify(sessionData));

    const response = NextResponse.redirect(new URL("/bot/dashboard", req.url));
    response.cookies.set("system777_session", jwt, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: tokens.expires_in,
    });

    return response;
  } catch (error) {
    console.error("Discord OAuth error:", error);
    return NextResponse.redirect(new URL("/login?error=internal", req.url));
  }
}
