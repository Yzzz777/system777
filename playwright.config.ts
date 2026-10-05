import { defineConfig, devices } from "@playwright/test";

/**
 * QA del dashboard del bot.
 * Regla dura: TODA llamada a https://bot-api.jrsystem7777.com/** se intercepta
 * con page.route y se responde con datos falsos → nunca se escribe en prod.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  // Fuera del repo: si no, Next (watcher) se reinicia con cada artefacto de Playwright
  outputDir: "/tmp/opencode/pw-results",
  timeout: 120_000,
  expect: { timeout: 30_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3111",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "npm run dev -- -p 3111",
    url: "http://127.0.0.1:3111",
    reuseExistingServer: true,
    timeout: 240_000,
  },
});
