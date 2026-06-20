import { NextResponse } from "next/server";

const securityHeaders = [
  ["Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com;"],
  ["X-Frame-Options", "DENY"],
  ["X-Content-Type-Options", "nosniff"],
  ["Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  ["Permissions-Policy", "camera=(), microphone=(), geolocation=()"],
  ["X-XSS-Protection", "1; mode=block"],
];

export function proxy(request: Request) {
  const response = NextResponse.next();

  for (const [key, value] of securityHeaders) {
    response.headers.set(key, value);
  }

  const url = new URL(request.url);
  const rateLimitKeys: Record<string, { limit: number; window: number }> = {
    "/api/auth/login": { limit: 5, window: 900000 },
    "/api/auth/register": { limit: 5, window: 900000 },
    "/api/admin": { limit: 10, window: 900000 },
    "/api/contact": { limit: 3, window: 900000 },
  };

  for (const [path, config] of Object.entries(rateLimitKeys)) {
    if (url.pathname.startsWith(path)) {
      response.headers.set("X-RateLimit-Limit", String(config.limit));
      response.headers.set("X-RateLimit-Window", String(config.window));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
