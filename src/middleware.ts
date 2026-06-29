import { NextResponse } from "next/server";

const securityHeaders = [
  ["X-Frame-Options", "DENY"],
  ["X-Content-Type-Options", "nosniff"],
  ["Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  ["Permissions-Policy", "camera=(self), microphone=(self), geolocation=()"],
  ["X-XSS-Protection", "1; mode=block"],
];

export function middleware() {
  const response = NextResponse.next();

  for (const [key, value] of securityHeaders) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
