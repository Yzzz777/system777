import { test, expect, Page } from "@playwright/test";
import { mockApis } from "./helpers";

const BROKEN = ["/register", "/community", "/announcements", "/dashboard", "/admin"];

async function collectConsole(page: Page) {
  const msgs: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") msgs.push(m.text());
  });
  page.on("pageerror", (e) => msgs.push("PAGEERROR: " + e.message));
  return msgs;
}

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

test.describe("Web pública — checks de la auditoría (AUDIT.md)", () => {
  test("portada: sin errores de hidratación y la navbar está visible", async ({ page }) => {
    const msgs = await collectConsole(page);
    await mockApis(page);
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);

    const hydration = msgs.filter((m) => /hydrat|did not match|Minified React error #4(18|23|25)/i.test(m));
    expect(hydration, "errores de hidratación en la portada").toEqual([]);

    const header = page.locator("header").first();
    await expect(header, "navbar invisible en /").toBeVisible();
    const box = await header.boundingBox();
    expect(box!.y, "navbar escondida (translateY negativo)").toBeGreaterThanOrEqual(0);
  });

  test("404 propia en /no-existe", async ({ page }) => {
    const res = await page.goto("/no-existe");
    expect(res?.status(), "estado HTTP de la ruta inexistente").toBe(404);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("/bot/commands: sin keys duplicadas, sin overflow a 1440 y consola limpia", async ({ page }) => {
    const msgs = await collectConsole(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/bot/commands", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    expect(
      msgs.filter((m) => /same key|Encountered two children/i.test(m)),
      "keys duplicadas en la lista de comandos"
    ).toEqual([]);

    expect(await horizontalOverflow(page), "overflow horizontal en /bot/commands").toBeLessThanOrEqual(0);
    expect(msgs.filter((m) => /hydrat|Failed to load resource/i.test(m))).toEqual([]);
  });

  test("middleware: /bot/dashboard sin sesión redirige a /login", async ({ page }) => {
    await page.goto("/bot/dashboard");
    await page.waitForURL("**/login**");
    expect(page.url()).toContain("/login");
  });

  test("sin enlaces hacia rutas eliminadas de la auditoría", async ({ page }) => {
    for (const url of ["/", "/about", "/blog", "/bot"]) {
      await page.goto(url, { waitUntil: "domcontentloaded" });
      const hrefs = await page.evaluate(() =>
        [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href") ?? "")
      );
      for (const ruta of BROKEN) {
        const malos = hrefs.filter((h) => h === ruta || h.startsWith(ruta + "?") || h.startsWith(ruta + "#"));
        expect(malos, `enlaces a ${ruta} en ${url}`).toEqual([]);
      }
    }
  });

  test("sin overflow horizontal a 320 y 1440", async ({ page }) => {
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/", { waitUntil: "networkidle" });
      expect(await horizontalOverflow(page), `overflow en / a ${width}px`).toBeLessThanOrEqual(0);
    }
  });
});
