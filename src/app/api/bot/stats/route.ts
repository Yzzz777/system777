import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const BOT_API = process.env.BOT_API_URL ?? "";

// Respuesta honesta cuando no hay datos reales: nunca inventamos cifras.
const OFFLINE = {
  available: false,
  online: false,
  tag: "System 777",
  guilds: null,
  users: null,
  ping: null,
  uptime: null,
  memory: null,
  commands: null,
};

export async function GET() {
  if (!BOT_API) {
    return NextResponse.json(OFFLINE, {
      headers: { "Cache-Control": "public, s-maxage=5" },
    });
  }
  try {
    const r = await fetch(`${BOT_API}/api/public/stats`, { cache: "no-store" });
    if (!r.ok) {
      return NextResponse.json(OFFLINE, { headers: { "Cache-Control": "public, s-maxage=5" } });
    }
    const data = await r.json();
    return NextResponse.json({ available: true, ...data }, {
      headers: { "Cache-Control": "public, s-maxage=10" },
    });
  } catch {
    return NextResponse.json(OFFLINE, { headers: { "Cache-Control": "public, s-maxage=5" } });
  }
}
