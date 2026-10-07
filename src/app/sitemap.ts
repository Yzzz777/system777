import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/projects", priority: 0.9 },
    { path: "/technologies", priority: 0.6 },
    { path: "/cybersecurity", priority: 0.6 },
    { path: "/blog", priority: 0.8 },
    { path: "/changelog", priority: 0.4 },
    { path: "/library", priority: 0.5 },
    { path: "/contact", priority: 0.7 },
    { path: "/bot", priority: 0.9 },
    { path: "/bot/commands", priority: 0.7 },
    { path: "/bot/status", priority: 0.6 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/bot" ? "weekly" : "monthly",
    priority,
  }));
}
