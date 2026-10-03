"use client";

import { useEffect, useState } from "react";

export interface BotStats {
  available?: boolean;
  online?: boolean;
  tag?: string;
  guilds?: number | null;
  users?: number | null;
  ping?: number | null;
  uptime?: number | null;
  memory?: string | null;
  commands?: number | null;
}

export const NA = "No disponible";

export function useBotStats(intervalMs = 30000) {
  const [stats, setStats] = useState<BotStats | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/bot/stats");
        if (!r.ok) throw new Error("bad status");
        const data: BotStats = await r.json();
        if (alive) setStats(data);
      } catch {
        if (alive) setStats({ available: false, online: false });
      } finally {
        if (alive) setLoaded(true);
      }
    };
    load();
    const id = setInterval(load, intervalMs);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [intervalMs]);

  return { stats, loaded };
}

export function isOnline(stats: BotStats | null) {
  return !!stats && stats.available !== false && stats.online === true;
}

export function formatUptime(seconds?: number | null) {
  if (!seconds || seconds <= 0) return null;
  const s = Math.floor(seconds);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
