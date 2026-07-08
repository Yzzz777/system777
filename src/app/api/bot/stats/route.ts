import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const BOT_API = process.env.BOT_API_URL ?? "";

const FALLBACK = {
  tag: "System 777#0000",
  avatar: "/avatar.png",
  guilds: 50,
  users: 5000,
  ping: 0,
  uptime: 0,
  memory: "0",
  online: true,
  commands: 100,
};

export async function GET() {
  if (!BOT_API) {
    return NextResponse.json(FALLBACK, {
      headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20" },
    });
  }
  try {
    const r = await fetch(`${BOT_API}/api/public/stats`, { cache: "no-store" });
    if (!r.ok) return NextResponse.json(FALLBACK, { headers: { "Cache-Control": "public, s-maxage=5" } });
    const data = await r.json();
    return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=10" } });
  } catch {
    return NextResponse.json(FALLBACK, { headers: { "Cache-Control": "public, s-maxage=5" } });
  }
}
