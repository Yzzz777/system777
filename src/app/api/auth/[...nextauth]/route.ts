import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("system777_session")?.value;

  if (!cookie) {
    return NextResponse.json(null);
  }

  try {
    const sessionData = JSON.parse(atob(cookie));

    if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
      const res = NextResponse.json(null);
      res.cookies.set("system777_session", "", { path: "/", maxAge: 0 });
      return res;
    }

    const isDiscord = !!sessionData.accessToken;

    return NextResponse.json({
      user: {
        id: sessionData.id,
        name: isDiscord ? (sessionData.global_name || sessionData.username) : sessionData.name,
        email: sessionData.email,
        image: isDiscord && sessionData.avatar
          ? `https://cdn.discordapp.com/avatars/${sessionData.id}/${sessionData.avatar}.png`
          : null,
        role: sessionData.role || "STUDENT",
        username: sessionData.username,
      },
      accessToken: sessionData.accessToken || null,
      expires: new Date(sessionData.expiresAt).toISOString(),
    });
  } catch {
    return NextResponse.json(null);
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
