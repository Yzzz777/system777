import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = url.searchParams.toString();

  // Redirect to Auth.js callback handler
  const authCallbackUrl = new URL("/api/auth/callback/discord", req.url);
  if (params) {
    authCallbackUrl.search = params;
  }

  return NextResponse.redirect(authCallbackUrl);
}
