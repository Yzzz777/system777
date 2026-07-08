import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  let callbackUrl = "/login";

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const body = await req.json();
      callbackUrl = body?.callbackUrl || "/login";
    } catch {}
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    try {
      const text = await req.text();
      const params = new URLSearchParams(text);
      callbackUrl = params.get("callbackUrl") || "/login";
    } catch {}
  }

  const res = NextResponse.json({ url: callbackUrl });
  res.cookies.set("system777_session", "", { path: "/", maxAge: 0 });
  return res;
}

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/login", req.url));
  res.cookies.set("system777_session", "", { path: "/", maxAge: 0 });
  return res;
}
