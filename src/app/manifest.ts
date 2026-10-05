import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "System 777 — bot de Discord de Ángel (Yzzz 777)",
    short_name: "System 777",
    description:
      "Comandos, estado en vivo y panel de control de System 777: moderación, protección, economía, niveles y tickets en Discord.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#04070e",
    theme_color: "#00E5FF",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/logo.png", sizes: "192x192", type: "image/png" },
    ],
  };
}
