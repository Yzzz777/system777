/**
 * Cookie de sesión firmada (HMAC-SHA256 con AUTH_SECRET).
 *
 * Formato: `<payload-base64>.<firma-base64>`
 *
 * - El payload sigue siendo base64(JSON) a secas para que el código cliente
 *   que hace `atob(valor.split(".")[0])` siga funcionando.
 * - La firma se calcula sobre el payload con HMAC-SHA256 (Web Crypto, edge-safe).
 * - Si falta AUTH_SECRET se degrada al comportamiento anterior (sin firma) para
 *   no bloquear el login; en producción AUTH_SECRET está configurado.
 */

const encoder = new TextEncoder();

function bytesToB64(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

async function getKey(): Promise<CryptoKey | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

let warned = false;
function warnOnce() {
  if (warned) return;
  warned = true;
  console.warn("[session] AUTH_SECRET no definido: la cookie de sesión se sirve SIN firma.");
}

export async function signSession(data: Record<string, unknown>): Promise<string> {
  const payload = btoa(JSON.stringify(data));
  const key = await getKey();
  if (!key) {
    warnOnce();
    return payload;
  }
  const sig = bytesToB64(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payload))));
  return `${payload}.${sig}`;
}

export async function verifySession(
  raw: string | undefined | null
): Promise<Record<string, unknown> | null> {
  if (!raw) return null;

  const dot = raw.indexOf(".");
  const payload = dot === -1 ? raw : raw.slice(0, dot);
  const sig = dot === -1 ? "" : raw.slice(dot + 1);

  const key = await getKey();
  if (!key) {
    warnOnce();
  } else {
    if (!sig) return null; // cookie fabricada / sin firma
    let ok = false;
    try {
      ok = await crypto.subtle.verify(
        "HMAC",
        key,
        (() => {
          const bin = atob(sig);
          const out = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
          return out;
        })(),
        encoder.encode(payload)
      );
    } catch {
      ok = false;
    }
    if (!ok) return null;
  }

  try {
    const data = JSON.parse(atob(payload));
    if (!data || typeof data !== "object") return null;
    return data as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Comprueba firma + expiración. Devuelve la sesión o null. */
export async function verifySessionFresh(
  raw: string | undefined | null
): Promise<Record<string, unknown> | null> {
  const data = await verifySession(raw);
  if (!data) return null;
  const exp = data.expiresAt as number | undefined;
  if (exp && Date.now() > exp) return null;
  return data;
}
