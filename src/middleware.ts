import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/sessionCrypto";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("system777_session")?.value;

  // Protected routes
  const protectedPaths = ["/dashboard", "/bot/dashboard"];
  const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (isProtected) {
    const data = await verifySession(session);
    const exp = typeof data?.expiresAt === "number" ? data.expiresAt : undefined;
    // Sesión sin caducidad o ya caducada → login.
    const valid = !!data && exp !== undefined && Date.now() <= exp;
    // /bot/dashboard habla con la API del bot: sin accessToken de Discord
    // todas las pestañas devuelven 401 y la UI se quedaba vacía en silencio.
    const needsDiscordToken = request.nextUrl.pathname.startsWith("/bot/dashboard") && !data?.accessToken;
    if (!valid || needsDiscordToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/bot/dashboard/:path*"],
};
