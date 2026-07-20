import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const BOT_URL = process.env.BOT_API_URL;

async function refreshDiscordToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: number } | null> {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  try {
    const res = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId, client_secret: clientSecret,
        grant_type: "refresh_token", refresh_token: refreshToken,
      }).toString(),
    });
    if (!res.ok) return null;
    const tokens = await res.json();
    return { accessToken: tokens.access_token, expiresAt: Date.now() + tokens.expires_in * 1000 };
  } catch { return null; }
}

function parseCookie(cookie: string): Record<string, unknown> | null {
  try { return JSON.parse(atob(cookie)); } catch { return null; }
}

async function getAuthHeaders(req: NextRequest): Promise<{ headers: Record<string, string>; updatedSession?: string }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const cookie = req.cookies.get("system777_session")?.value;
  if (!cookie) return { headers };

  const session = parseCookie(cookie);
  if (!session) return { headers };

  if (session.accessToken && session.expiresAt && Date.now() < (session.expiresAt as number)) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
    return { headers };
  }

  if (session.refreshToken) {
    const refreshed = await refreshDiscordToken(session.refreshToken as string);
    if (refreshed) {
      const updated = { ...session, accessToken: refreshed.accessToken, expiresAt: refreshed.expiresAt };
      headers["Authorization"] = `Bearer ${refreshed.accessToken}`;
      return { headers, updatedSession: btoa(JSON.stringify(updated)) };
    }
  }

  return { headers };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const apiPath = path.join("/");
  const url = new URL(req.url);

  if (!BOT_URL) {
    return NextResponse.json({ error: "BOT_API_URL no configurado" }, { status: 500 });
  }

  const targetUrl = `${BOT_URL}/api/${apiPath}${url.search}`;

  try {
    const { headers, updatedSession } = await getAuthHeaders(req);
    const res = await fetch(targetUrl, { headers });
    const data = await res.text();

    const response = new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
    if (updatedSession) {
      response.cookies.set("system777_session", updatedSession, {
        path: "/", httpOnly: true, secure: true, sameSite: "none", maxAge: 30 * 24 * 60 * 60,
      });
    }
    return response;
  } catch (err) {
    console.error("Proxy error:", targetUrl, err);
    return NextResponse.json({ error: "Bot no disponible", details: String(err) }, { status: 502 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const apiPath = path.join("/");
  const targetUrl = `${BOT_URL}/api/${apiPath}`;

  try {
    const body = await req.text();
    const { headers, updatedSession } = await getAuthHeaders(req);
    const res = await fetch(targetUrl, { method: "POST", headers, body });
    const data = await res.text();

    const response = new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
    if (updatedSession) {
      response.cookies.set("system777_session", updatedSession, {
        path: "/", httpOnly: true, secure: true, sameSite: "none", maxAge: 30 * 24 * 60 * 60,
      });
    }
    return response;
  } catch (err) {
    return NextResponse.json({ error: "Bot no disponible", details: String(err) }, { status: 502 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const apiPath = path.join("/");
  const targetUrl = `${BOT_URL}/api/${apiPath}`;

  try {
    const body = await req.text();
    const { headers, updatedSession } = await getAuthHeaders(req);
    const res = await fetch(targetUrl, { method: "PUT", headers, body });
    const data = await res.text();

    const response = new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
    if (updatedSession) {
      response.cookies.set("system777_session", updatedSession, {
        path: "/", httpOnly: true, secure: true, sameSite: "none", maxAge: 30 * 24 * 60 * 60,
      });
    }
    return response;
  } catch (err) {
    return NextResponse.json({ error: "Bot no disponible", details: String(err) }, { status: 502 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const apiPath = path.join("/");
  const targetUrl = `${BOT_URL}/api/${apiPath}`;

  try {
    const { headers, updatedSession } = await getAuthHeaders(req);
    const res = await fetch(targetUrl, { method: "DELETE", headers });
    const data = await res.text();

    const response = new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
    if (updatedSession) {
      response.cookies.set("system777_session", updatedSession, {
        path: "/", httpOnly: true, secure: true, sameSite: "none", maxAge: 30 * 24 * 60 * 60,
      });
    }
    return response;
  } catch (err) {
    return NextResponse.json({ error: "Bot no disponible", details: String(err) }, { status: 502 });
  }
}
