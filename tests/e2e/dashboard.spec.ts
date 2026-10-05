import { test, expect } from "@playwright/test";
import { openGuild, selectOption, GUILD_ID, ROLE_ID } from "./helpers";

test.describe("Dashboard del bot (QA con mocks — nunca toca bot-api real)", () => {
  test("carga el servidor desde la API y muestra las pestañas conectadas", async ({ page }) => {
    const mocks = await openGuild(page);

    const guildReq = mocks.requests.find((r) => r.path === `/api/public/guild/${GUILD_ID}`);
    const ticketReq = mocks.requests.find((r) => r.path === `/api/public/ticket/${GUILD_ID}`);
    expect(guildReq, "GET public/guild/:id no se llamó").toBeTruthy();
    expect(ticketReq, "GET public/ticket/:id no se llamó").toBeTruthy();

    for (const label of ["Permisos Roles", "Broadcast", "Protección", "Logs de Actividad"]) {
      await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
    }
  });

  test("Permisos de Roles: lista comandos, deniega y guarda la denegación", async ({ page }) => {
    const mocks = await openGuild(page, "Permisos Roles");

    await expect(page.getByText("Sistema de denegación")).toBeVisible();
    await expect(page.getByText("Selecciona un rol para ver y denegar comandos.")).toBeVisible();

    await selectOption(page, "Seleccionar Rol", "@everyone (todo el servidor)");

    await expect(page.getByRole("button", { name: /8ball/ })).toBeVisible();
    await expect(page.getByText(/denegado\(s\)/)).toBeVisible();

    await page.getByRole("button", { name: /8ball/ }).click();
    await expect(page.getByRole("button", { name: /🚫 8ball/ })).toBeVisible();

    await page.getByRole("button", { name: "Guardar permisos" }).click();

    const post = mocks.requests.find((r) => r.method === "POST" && r.path.endsWith("/roleperms"));
    expect(post, "POST roleperms no se llamó").toBeTruthy();
    expect(post!.body).toEqual({ roleId: GUILD_ID, deny: ["8ball"] });

    await expect(page.getByText("Permisos guardados")).toBeVisible();

    // persistencia: si vuelve a entrar, la denegación sigue ahí (mock la recuerda)
    await page.reload();
    await expect(page.getByText("Servidor de Pruebas")).toBeVisible();
    await page.getByRole("button", { name: "Configurar" }).first().click();
    await expect(page.getByText("Bienvenido al Panel")).toBeVisible();
    await page.getByRole("button", { name: "Permisos Roles", exact: true }).click();
    await expect(page.getByText(/Ninguno: todos los roles/)).toHaveCount(0);
  });

  test("Broadcast envía al endpoint real /api/broadcast", async ({ page }) => {
    const mocks = await openGuild(page, "Broadcast");

    await page.locator("textarea").fill("hola desde el QA");
    await page.getByRole("button", { name: "Enviar a todos" }).click();

    const post = mocks.requests.find((r) => r.method === "POST" && r.path === "/api/broadcast");
    expect(post, "POST /api/broadcast no se llamó (antes apuntaba a una ruta inexistente)").toBeTruthy();
    expect(post!.body).toEqual({ message: "hola desde el QA" });

    await expect(page.getByText("Broadcast enviado a todos los servidores")).toBeVisible();
    await expect(page.locator("textarea")).toHaveValue("");
  });

  test("Protección guarda en public/guild/:id/protection", async ({ page }) => {
    const mocks = await openGuild(page, "Protección");

    await page.getByRole("button", { name: "Guardar Protección" }).click();

    const post = mocks.requests.find((r) => r.method === "POST" && r.path === `/api/public/guild/${GUILD_ID}/protection`);
    expect(post, "POST public/guild/:id/protection no se llamó").toBeTruthy();
    expect(post!.body).toBeTruthy();

    await expect(page.getByText("Guardado correctamente")).toBeVisible();
  });

  test("ninguna llamada sale hacia bot-api sin interceptar", async ({ page }) => {
    const mocks = await openGuild(page, "Logs de Actividad");
    await expect(page.getByText("Logs de Actividad").first()).toBeVisible();

    const fuera = mocks.requests.filter((r) => !r.path.startsWith("/api/"));
    expect(fuera, "requests fuera del prefijo /api/").toEqual([]);
    expect(mocks.requests.length).toBeGreaterThan(0);
    expect(ROLE_ID).toBeTruthy();
  });
});
