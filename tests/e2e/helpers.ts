import { Page, Request as PwRequest, expect } from "@playwright/test";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const OWNER_ID = "1376047332709240884";
export const GUILD_ID = "111111111111111111";
export const ROLE_ID = "222222222222222222";
export const CHANNEL_ID = "333333333333333333";

export const COMMANDS = [
  { name: "8ball", category: "fun", description: "Pregunta al 8ball" },
  { name: "ban", category: "moderation", description: "Banea a un usuario" },
  { name: "kick", category: "moderation", description: "Expulsa a un usuario" },
  { name: "warn", category: "moderation", description: "Advierte a un usuario" },
  { name: "eco", category: "economy", description: "Economía" },
];

const STATUSES = { servers: 42, guilds: 42, users: 12345, ping: 42, memory: 128 };

/** Cookie de sesión firmada igual que la app (HMAC-SHA256 con AUTH_SECRET del .env). */
export function sessionCookieValue(): string {
  const payload = JSON.stringify({
    id: OWNER_ID,
    username: "tester",
    global_name: "Tester",
    email: "tester@example.com",
    avatar: null,
    accessToken: "fake-discord-token",
    expiresAt: Date.now() + 60 * 60 * 1000,
  });
  const base64 = Buffer.from(payload, "utf8").toString("base64");

  let secret = "";
  try {
    const env = fs.readFileSync(path.join(__dirname, "..", "..", ".env"), "utf8");
    const line = env.split("\n").find((l) => l.trim().startsWith("AUTH_SECRET="));
    if (line) secret = line.slice(line.indexOf("=") + 1).trim().replace(/^"(.*)"$/, "$1");
  } catch {}
  if (!secret) return base64; // sin AUTH_SECRET la app acepta payload sin firma

  const sig = crypto.createHmac("sha256", secret).update(base64).digest("base64");
  return `${base64}.${sig}`;
}

export type Recorded = { method: string; path: string; body: unknown };

export type GuildRow = { id: string; name: string; members: number; isAdmin: boolean; icon: string | null; inBot: boolean };

export type Mocks = { requests: Recorded[]; guilds: GuildRow[]; rolePerms: Record<string, string[]> };

/**
 * Intercepta bot-api (prod) + /api/bot/guilds y devuelve datos falsos.
 * Registra cada request para poder asertar el payload que «habría» ido al bot.
 */
export async function mockApis(page: Page): Promise<Mocks> {
  const state: Mocks = { requests: [], guilds: [], rolePerms: {} };
  state.guilds = [
    { id: GUILD_ID, name: "Servidor de Pruebas", members: 1234, isAdmin: true, icon: null, inBot: true },
    { id: "444444444444444444", name: "Otro Servidor", members: 10, isAdmin: false, icon: null, inBot: true },
  ];

  const record = (method: string, p: string, body: unknown) => state.requests.push({ method, path: p, body });

  // CORS: la app llama con credentials:'include', así que el origen hay que
  // devolverlo ecoado (nunca '*') o el navegador descarta la respuesta.
  const corsFor = (req: PwRequest) => ({
    "Access-Control-Allow-Origin": req.headers()["origin"] || "http://127.0.0.1:3111",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });

  await page.route("https://bot-api.jrsystem7777.com/**", async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const p = url.pathname;
    const method = req.method();
    const CORS = corsFor(req);
    if (method === "OPTIONS") {
      return route.fulfill({ status: 204, headers: CORS, body: "" });
    }
    let body: unknown = null;
    if (method === "POST" || method === "PUT") {
      try { body = req.postDataJSON(); } catch { body = req.postData(); }
    }
    record(method, p, body);

    const json = (data: unknown) =>
      route.fulfill({ status: 200, contentType: "application/json", headers: CORS, body: JSON.stringify(data) });

    if (p === "/api/public/stats") return json({ ok: true, ...STATUSES });
    if (/^\/api\/public\/guild\/[^/]+$/.test(p)) {
      return json({
        ok: true,
        guild: { id: GUILD_ID, name: "Servidor de Pruebas", members: 1234 },
        config: {
          id: GUILD_ID,
          modules: { welcome: true, levels: true, tickets: true },
          logs: {},
          logChannels: {},
          protection: { antispam: false, antiraid: false },
          prefix: "!",
        },
        channels: [
          { id: CHANNEL_ID, name: "general", type: 0 },
          { id: "555555555555555555", name: "voz", type: 2 },
        ],
        roles: [
          { id: ROLE_ID, name: "Moderador", color: "#FF0000" },
          { id: "666666666666666666", name: "Miembro", color: "#00FF00" },
        ],
      });
    }
    if (/^\/api\/public\/ticket\/[^/]+$/.test(p)) {
      return json({ ok: true, config: { panelChannel: "", categories: [], forms: [], autoCloseHours: 0, panelColor: "#00E5FF" } });
    }
    if (/^\/api\/public\/ticket\/[^/]+\/config$/.test(p)) return json({ ok: true, config: {} });
    if (p.endsWith("/roleperms") && method === "GET") {
      return json({ ok: true, rolePerms: state.rolePerms, commands: COMMANDS });
    }
    if (p.endsWith("/roleperms") && method === "POST") {
      const payload = (body ?? {}) as { roleId?: string; deny?: string[] };
      state.rolePerms = payload.roleId && Array.isArray(payload.deny) && payload.deny.length
        ? { ...state.rolePerms, [payload.roleId]: payload.deny }
        : state.rolePerms;
      return json({ ok: true, rolePerms: state.rolePerms });
    }
    if (p === "/api/broadcast") return json({ ok: true });
    if (p.endsWith("/cases/" + GUILD_ID)) return json({ ok: true, cases: [] });
    if (p.endsWith("/activity-logs") || /\/logs$/.test(p)) return json({ ok: true, logs: [] });
    if (p.endsWith("/tickets/list")) return json({ ok: true, tickets: [] });
    if (p.endsWith("/tickets/logs")) return json({ ok: true, logs: [] });
    // Cualquier otro endpoint del bot → ok genérico
    return json({ ok: true });
  });

  await page.route("**/api/bot/guilds", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(state.guilds) })
  );

  return state;
}

/** Sesión válida + mocks + entra al dashboard y selecciona el servidor de pruebas. */
export async function openGuild(page: Page, navLabel?: string): Promise<Mocks> {
  await page.context().addCookies([
    { name: "system777_session", value: sessionCookieValue(), url: "http://127.0.0.1:3111" },
  ]);
  const mocks = await mockApis(page);

  await page.goto("/bot/dashboard");
  await expect(page.getByText("Servidor de Pruebas")).toBeVisible({ timeout: 60_000 });
  await page.getByRole("button", { name: "Configurar" }).first().click();
  await expect(page.getByText("Bienvenido al Panel")).toBeVisible({ timeout: 60_000 });
  // Espera a que loadGuild termine: si no, las secciones guardan con id vacío.
  await expect
    .poll(() => mocks.requests.filter((r) => r.path === `/api/public/guild/${GUILD_ID}`).length, { timeout: 30_000 })
    .toBeGreaterThan(0);

  if (navLabel) {
    await page.getByRole("button", { name: navLabel, exact: true }).click();
  }
  return mocks;
}

/** Selecciona una opción en los Select de Base UI (trigger con aria-label). */
export async function selectOption(page: Page, triggerLabel: string, optionLabel: string) {
  await page.getByRole("combobox", { name: triggerLabel }).or(page.locator(`[aria-label="${triggerLabel}"]`)).first().click();
  await page.getByRole("option", { name: optionLabel }).click();
}
