import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const BOT_URL = process.env.BOT_API_URL;

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const apiPath = path.join("/");
  const url = new URL(req.url);
  const targetUrl = `${BOT_URL}/api/${apiPath}${url.search}`;

  try {
    const cookie = req.cookies.get("system777_session")?.value;
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (cookie) {
      try {
        const session = JSON.parse(atob(cookie));
        if (session.accessToken) {
          headers["Authorization"] = `Bearer ${session.accessToken}`;
        }
      } catch {}
    }

    const res = await fetch(targetUrl, { headers, signal: AbortSignal.timeout(10000) });
    const data = await res.text();

    return new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return NextResponse.json({ error: "Bot no disponible", details: String(err) }, { status: 502 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const apiPath = path.join("/");
  const targetUrl = `${BOT_URL}/api/${apiPath}`;

  try {
    const body = await req.text();
    const cookie = req.cookies.get("system777_session")?.value;
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (cookie) {
      try {
        const session = JSON.parse(atob(cookie));
        if (session.accessToken) {
          headers["Authorization"] = `Bearer ${session.accessToken}`;
        }
      } catch {}
    }

    const res = await fetch(targetUrl, { method: "POST", headers, body, signal: AbortSignal.timeout(10000) });
    const data = await res.text();

    return new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
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
    const cookie = req.cookies.get("system777_session")?.value;
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (cookie) {
      try {
        const session = JSON.parse(atob(cookie));
        if (session.accessToken) {
          headers["Authorization"] = `Bearer ${session.accessToken}`;
        }
      } catch {}
    }

    const res = await fetch(targetUrl, { method: "PUT", headers, body, signal: AbortSignal.timeout(10000) });
    const data = await res.text();

    return new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return NextResponse.json({ error: "Bot no disponible", details: String(err) }, { status: 502 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const apiPath = path.join("/");
  const targetUrl = `${BOT_URL}/api/${apiPath}`;

  try {
    const cookie = req.cookies.get("system777_session")?.value;
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (cookie) {
      try {
        const session = JSON.parse(atob(cookie));
        if (session.accessToken) {
          headers["Authorization"] = `Bearer ${session.accessToken}`;
        }
      } catch {}
    }

    const res = await fetch(targetUrl, { method: "DELETE", headers, signal: AbortSignal.timeout(10000) });
    const data = await res.text();

    return new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return NextResponse.json({ error: "Bot no disponible", details: String(err) }, { status: 502 });
  }
}
