import { NextRequest } from "next/server";
import { verifySession } from "@/lib/sessionCrypto";

import { OWNER_DISCORD_ID } from "@/lib/owner";

export { OWNER_DISCORD_ID };

/**
 * Verifica en el servidor que la cookie de sesión pertenece al owner.
 *
 * 1. La cookie debe estar firmada con AUTH_SECRET (ver `sessionCrypto`) —
 *    descarta cualquier cookie fabricada a mano.
 * 2. Además se confirma la identidad contra la API de Discord con el access
 *    token guardado: sin eso, un token robado o manipulado no serviría.
 */
export async function isOwner(req: NextRequest): Promise<boolean> {
  const raw = req.cookies.get("system777_session")?.value;
  if (!raw) return false;

  const data = await verifySession(raw);
  if (!data) return false;

  const accessToken = data.accessToken as string | undefined;
  const expiresAt = data.expiresAt as number | undefined;
  if (!accessToken) return false;
  if (expiresAt && Date.now() > expiresAt) return false;

  try {
    const r = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!r.ok) return false;
    const user: { id?: string } = await r.json();
    return user?.id === OWNER_DISCORD_ID;
  } catch {
    return false;
  }
}
