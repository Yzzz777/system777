"use client";

import {
  Activity,
  Server,
  Users,
  Zap,
  Clock,
  Terminal,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useBotStats, isOnline, formatUptime, NA } from "@/lib/useBotStats";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BotStatusPage() {
  const { stats, loaded } = useBotStats(15000);
  const online = isOnline(stats);
  const uptime = formatUptime(stats?.uptime);

  const items = [
    { icon: Zap, label: "Ping", value: stats?.ping != null ? `${stats.ping} ms` : NA, desc: "Latencia reportada por el bot" },
    { icon: Clock, label: "Uptime", value: uptime ?? NA, desc: "Tiempo activo desde el último reinicio" },
    { icon: Server, label: "Servidores", value: stats?.guilds != null ? String(stats.guilds) : NA, desc: "Guilds donde está el bot" },
    { icon: Users, label: "Usuarios", value: stats?.users != null ? stats.users.toLocaleString("es") : NA, desc: "Usuarios alcanzados" },
    { icon: Terminal, label: "Comandos", value: stats?.commands != null ? String(stats.commands) : NA, desc: "Comandos registrados en Discord" },
    { icon: Activity, label: "API", value: !loaded ? "consultando…" : stats?.available === false ? "sin respuesta" : "respondiendo", desc: "Endpoint de estadísticas públicas" },
  ];

  return (
    <div className="relative px-4 pb-[var(--section-y)] pt-10 sm:px-6 sm:pt-14">
      <div className="relative mx-auto max-w-4xl">
        <div className="text-center">
          <span className="eyebrow justify-center">
            <Activity aria-hidden className="h-3 w-3" />
            Monitoreo público
          </span>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2rem,5.5vw,3.25rem)] font-bold tracking-tight">
            Estado del bot
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[var(--text-2)]">
            Datos en vivo de System 777, actualizados cada 15 segundos.
          </p>
        </div>

        {/* Indicador */}
        <div className="panel mt-8 p-6 text-center sm:p-8">
          <span
            className={`inline-flex items-center gap-3 rounded-full border px-5 py-2.5 ${
              online
                ? "border-[rgba(0,229,255,0.35)] bg-[rgba(0,229,255,0.08)] text-[var(--brand)]"
                : "border-[var(--line-strong)] bg-white/[0.03] text-[var(--text-3)]"
            }`}
          >
            {online ? (
              <Wifi aria-hidden className="h-5 w-5" />
            ) : (
              <WifiOff aria-hidden className="h-5 w-5" />
            )}
            {!loaded ? (
              <Skeleton className="h-6 w-28" aria-label="Consultando estado" />
            ) : (
              <span className="text-lg font-bold">{online ? "En línea" : "Fuera de línea"}</span>
            )}
          </span>
          <p className="mt-4 font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-3)]">
            {stats?.tag ?? "System 777"}
          </p>
        </div>

        {/* Métricas */}
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.label}>
              <Card className="h-full p-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[rgba(0,229,255,0.14)]">
                    <item.icon aria-hidden className="h-4 w-4 text-[#59f1ff]" />
                  </span>
                  <span className="stat-label">{item.label}</span>
                </div>
                {!loaded ? (
                  <Skeleton className="mt-3 h-7 w-24" aria-label={`Cargando ${item.label}`} />
                ) : (
                  <p className="mt-3 font-[family-name:var(--font-mono)] text-xl text-[var(--text)]">
                    {item.value}
                  </p>
                )}
                <p className="mt-1 text-xs text-[var(--text-3)]">{item.desc}</p>
              </Card>
            </li>
          ))}
        </ul>

        {!loaded ? null : stats?.available === false ? (
          <div className="panel mt-4 p-8 text-center">
            <WifiOff aria-hidden className="mx-auto h-8 w-8 text-[var(--text-3)]" />
            <p className="mt-4 text-[var(--text-2)]">No se pudo conectar a la API del bot</p>
            <p className="mt-2 text-sm text-[var(--text-3)]">
              Puede estar caído el servicio o sin configurar la variable de entorno. Aquí no se
              muestran cifras inventadas.
            </p>
          </div>
        ) : null}

        <p className="mt-6 text-center text-xs text-[var(--text-3)]">
          Fuente: API pública del bot vía <code className="text-[var(--data)]">/api/bot/stats</code>
        </p>
      </div>
    </div>
  );
}
