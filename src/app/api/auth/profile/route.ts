import { NextRequest, NextResponse } from "next/server";
import { verifySession, signSession } from "@/lib/sessionCrypto";

export const runtime = "edge";

type SessionData = {
  id?: string;
  username?: string;
  global_name?: string;
  avatar?: string;
  banner?: string | null;
  bio?: string | null;
  pronouns?: string | null;
  accent_color?: number | null;
  theme_colors?: number[] | null;
  avatar_decoration?: { asset: string; sku_id?: string } | null;
  frame_url?: string | null;
  discriminator?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
};

function avatarUrl(id: string | undefined, avatar: string | null | undefined): string | null {
  if (!id || !avatar) return null;
  const ext = avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${id}/${avatar}.${ext}?size=256`;
}

function bannerUrl(id: string | undefined, banner: string | null | undefined): string | null {
  if (!id || !banner) return null;
  const ext = banner.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/banners/${id}/${banner}.${ext}?size=600`;
}

// Recorre un objeto/arr buscando la primera URL absoluta (assets del frame).
function pickUrl(v: unknown): string | null {
  if (typeof v === "string") return v.startsWith("http") ? v : null;
  if (Array.isArray(v)) {
    for (const item of v) {
      const r = pickUrl(item);
      if (r) return r;
    }
    return null;
  }
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    for (const key of ["static_image_url", "animated_image_url", "url", "image", "src"]) {
      const r = pickUrl(o[key]);
      if (r) return r;
    }
    for (const val of Object.values(o)) {
      const r = pickUrl(val);
      if (r) return r;
    }
  }
  return null;
}

// El frame (marco de perfil) solo se renderiza si la respuesta trae una URL
// absoluta verificable; nunca se inventan rutas de CDN.
function extractFrameUrl(prof: Record<string, unknown> | null): string | null {
  if (!prof) return null;
  const up = prof.user_profile as Record<string, unknown> | undefined;
  const user = prof.user as Record<string, unknown> | undefined;
  const candidates: unknown[] = [
    up?.frame,
    up?.profile_frame,
    prof.frame,
    prof.profile_frame,
    user?.frame,
    user?.profile_frame,
  ];
  const collectibles = prof.collectibles;
  if (Array.isArray(collectibles)) {
    for (const c of collectibles) {
      if (c && typeof c === "object" && (c as Record<string, unknown>).type === 3) candidates.push(c);
    }
  } else if (collectibles && typeof collectibles === "object") {
    candidates.push((collectibles as Record<string, unknown>).frame);
  }
  for (const c of candidates) {
    const url = pickUrl(c);
    if (url) return url;
  }
  return null;
}

function buildProfile(s: SessionData) {
  const decoration = s.avatar_decoration?.asset
    ? { asset: s.avatar_decoration.asset, skuId: s.avatar_decoration.sku_id ?? null, url: `https://cdn.discordapp.com/avatar-decoration-presets/${s.avatar_decoration.asset}.png` }
    : null;
  return {
    id: s.id ?? null,
    globalName: s.global_name || s.username || null,
    username: s.username ?? null,
    discriminator: s.discriminator ?? null,
    avatarUrl: avatarUrl(s.id, s.avatar),
    bannerUrl: bannerUrl(s.id, s.banner),
    bio: s.bio || null,
    pronouns: s.pronouns || null,
    accentColor: typeof s.accent_color === "number" ? s.accent_color : null,
    themeColors: Array.isArray(s.theme_colors) && s.theme_colors.length > 0 ? s.theme_colors : null,
    decoration,
    frameUrl: s.frame_url || null,
  };
}

async function refreshDiscordToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: number } | null> {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  try {
    const res = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }).toString(),
    });
    if (!res.ok) return null;
    const tokens = await res.json();
    return { accessToken: tokens.access_token, expiresAt: Date.now() + tokens.expires_in * 1000 };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("system777_session")?.value;
  if (!cookie) return NextResponse.json({ profile: null });

  try {
    const parsed = await verifySession(cookie);
    if (!parsed) return NextResponse.json({ profile: null });
    let sessionData = parsed as SessionData;

    if (!sessionData.accessToken || (sessionData.expiresAt && Date.now() > sessionData.expiresAt)) {
      if (sessionData.refreshToken) {
        const refreshed = await refreshDiscordToken(sessionData.refreshToken);
        if (refreshed) {
          sessionData = { ...sessionData, accessToken: refreshed.accessToken, expiresAt: refreshed.expiresAt };
        }
      }
    }

    if (sessionData.accessToken) {
      try {
        const res = await fetch("https://discord.com/api/users/@me", {
          headers: { Authorization: `Bearer ${sessionData.accessToken}` },
          cache: "no-store",
        });
        if (res.ok) {
          const u = await res.json();
          sessionData = {
            ...sessionData,
            username: u.username ?? sessionData.username,
            global_name: u.global_name ?? sessionData.global_name,
            avatar: u.avatar ?? sessionData.avatar,
            banner: u.banner || sessionData.banner || null,
            bio: u.bio || sessionData.bio || null,
            accent_color: typeof u.accent_color === "number" ? u.accent_color : sessionData.accent_color ?? null,
            avatar_decoration: u.avatar_decoration_data ?? sessionData.avatar_decoration ?? null,
            theme_colors: sessionData.theme_colors ?? null,
          };

          // El endpoint oficial /users/@me no incluye la bio (se omite en
          // OAuth2); el endpoint de perfil (comunidad) sí la devuelve.
          // Best-effort: si Discord lo rechaza, se conserva lo de la sesión.
          try {
            const pr = await fetch(`https://discord.com/api/v10/users/${u.id}/profile?with_mutual_guilds=false`, {
              headers: { Authorization: `Bearer ${sessionData.accessToken}` },
              cache: "no-store",
              signal: AbortSignal.timeout(6000),
            });
            if (pr.ok) {
              const prof = await pr.json();
              const up = (prof?.user_profile ?? {}) as Record<string, unknown>;
              const pu = (prof?.user ?? {}) as Record<string, unknown>;
              const themeColors = Array.isArray(up.theme_colors)
                ? (up.theme_colors as unknown[]).filter((n): n is number => typeof n === "number")
                : null;
              sessionData = {
                ...sessionData,
                bio: (typeof up.bio === "string" && up.bio) || (typeof pu.bio === "string" && pu.bio) || sessionData.bio || null,
                pronouns: (typeof up.pronouns === "string" && up.pronouns) || sessionData.pronouns || null,
                theme_colors: themeColors && themeColors.length > 0 ? themeColors : sessionData.theme_colors ?? null,
                accent_color: typeof up.accent_color === "number" ? up.accent_color : sessionData.accent_color ?? null,
                banner: (typeof up.banner === "string" && up.banner) || sessionData.banner || null,
                avatar_decoration: (pu.avatar_decoration_data as SessionData["avatar_decoration"]) ?? sessionData.avatar_decoration ?? null,
                frame_url: extractFrameUrl(prof) || sessionData.frame_url || null,
              };
            }
          } catch {
            /* perfil no disponible: seguimos con lo de /users/@me */
          }

          const response = NextResponse.json({ profile: buildProfile(sessionData) });
          response.cookies.set("system777_session", await signSession(sessionData as unknown as Record<string, unknown>), {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60,
          });
          return response;
        }
      } catch {
        /* sin red: devolvemos lo que hay en sesión */
      }
    }

    return NextResponse.json({ profile: buildProfile(sessionData) });
  } catch {
    return NextResponse.json({ profile: null });
  }
}
