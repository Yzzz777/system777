import { NextRequest } from "next/server";

export const OWNER_DISCORD_ID = "1376047332709240884";

/**
 * Verifica en el servidor que la cookie de sesión pertenece al owner.
 * La cookie es base64 (sin firma), por eso se confirma la identidad contra
 * la API de Discord con el access token guardado: sin eso, cualquiera
 * podría fabricarse un id y pasar por admin.
 */
export async function isOwner(req: NextRequest): Promise<boolean> {
  const raw = req.cookies.get("system777_session")?.value;
  if (!raw) return false;

  let data: { accessToken?: string; expiresAt?: number } | null = null;
  try {
    data = JSON.parse(atob(raw));
  } catch {
    return false;
  }
  if (!data?.accessToken) return false;
  if (data.expiresAt && Date.now() > data.expiresAt) return false;

  try {
    const r = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${data.accessToken}` },
      cache: "no-store",
    });
    if (!r.ok) return false;
    const user: { id?: string } = await r.json();
    return user?.id === OWNER_DISCORD_ID;
  } catch {
    return false;
  }
}
