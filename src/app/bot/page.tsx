"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot as BotIcon,
  Shield,
  Lock,
  Music,
  Coins,
  BarChart3,
  Ticket,
  Gamepad2,
  MessageSquare,
  Globe,
  Crown,
  Terminal,
  Server,
  Users,
  Wifi,
  Clock,
  Star,
  Sparkles,
} from "lucide-react";
import { useBotStats, isOnline, formatUptime, NA } from "@/lib/useBotStats";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const BOT_CLIENT_ID = process.env.NEXT_PUBLIC_BOT_CLIENT_ID ?? "1502804306125132057";
const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${BOT_CLIENT_ID}&permissions=8&integration_type=0&scope=applications.commands+bot`;

const features = [
  { icon: Shield, title: "Moderación", desc: "Ban, kick, warn, timeout, nuke, slowmode, softban, tempban, casos y logs de moderación." },
  { icon: Lock, title: "Protección", desc: "Anti-raid, anti-nuke, automod con filtros, anti-phishing, anti-alt y whitelist por sistema." },
  { icon: Music, title: "Música", desc: "Reproducción con cola, panel de controles, volumen y loop." },
  { icon: Coins, title: "Economía", desc: "Balance, banco, daily, work, pay, rob, slots y ranking." },
  { icon: BarChart3, title: "Niveles", desc: "XP por mensaje, rank, leaderboard, logros y perfiles con misiones." },
  { icon: Ticket, title: "Tickets", desc: "Paneles con categorías, configuración, transcripts y calificación." },
  { icon: Gamepad2, title: "Diversión", desc: "Trivia, coinflip, poll, hangman, wordle, connect4, tictactoe y más." },
  { icon: MessageSquare, title: "Social", desc: "Perfil con biografía y clan, AFK, matrimonio y acciones sociales." },
  { icon: Globe, title: "Utilidad y red", desc: "UserInfo, serverInfo, recordatorios, giveaways y herramientas de red (ping, traceroute, SSL)." },
  { icon: Crown, title: "Owner", desc: "Comandos globales de dueño: servers, globalban, broadcast, eval y shell." },
];

const premiumPlans = [
  {
    name: "Normal",
    price: "$4.99/mes",
    icon: Star,
    color: "#57F287",
    features: [
      "Custom welcome embeds con imagen y banner",
      "Perfil avanzado con campos extra y badges",
      "Reaction roles ilimitados",
      "Economía +50% ganancias",
      "Soporte prioritario",
    ],
  },
  {
    name: "Pro",
    price: "$9.99/mes",
    icon: Sparkles,
    color: "#5865F2",
    featured: true,
    features: [
      "Todo de Normal",
      "Automod avanzado",
      "Anti-raid con score dinámico",
      "Tickets premium con branding",
      "Backups automáticos diarios",
      "XP x2 en niveles",
    ],
  },
  {
    name: "Max",
    price: "$19.99/mes",
    icon: Crown,
    color: "#F5C518",
    features: [
      "Todo de Pro",
      "AI moderation tools",
      "Live monitoring en tiempo real",
      "API exclusiva de acceso",
      "Automations ilimitadas",
      "Soporte VIP 24/7",
    ],
  },
];

function LiveStats() {
  const { stats, loaded } = useBotStats(30000);
  const online = isOnline(stats);
  const uptime = formatUptime(stats?.uptime);

  const items = [
    { icon: Server, label: "Servidores", value: stats?.guilds != null ? String(stats.guilds) : NA },
    { icon: Users, label: "Usuarios", value: stats?.users != null ? stats.users.toLocaleString("es") : NA },
    { icon: Terminal, label: "Comandos", value: stats?.commands != null ? String(stats.commands) : NA },
    { icon: Wifi, label: "Ping", value: stats?.ping != null ? `${stats.ping} ms` : NA },
    { icon: Clock, label: "Uptime", value: uptime ?? NA },
  ];

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center gap-3 border-b border-[var(--line)] px-5 py-3.5">
        <span
          className={`h-2.5 w-2.5 rounded-full ${online ? "bg-[var(--brand)] status-online" : "bg-[var(--text-3)]"}`}
        />
        <span className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text)]">
          {stats?.tag ?? "System 777"}
        </span>
        {!loaded ? (
          <Skeleton className="ml-auto h-5 w-16" aria-label="Consultando estado" />
        ) : (
          <Badge variant="outline" className="ml-auto font-mono" style={{ color: online ? "var(--brand)" : "var(--text-3)" }}>
            {online ? "online" : "offline"}
          </Badge>
        )}
      </div>
      <dl className="grid grid-cols-2 divide-x divide-y divide-[var(--line)] sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
        {items.map((it) => (
          <div key={it.label} className="px-4 py-3.5">
            <dt className="flex items-center gap-1.5">
              <it.icon aria-hidden className="h-3.5 w-3.5 text-[#59f1ff]" />
              <span className="stat-label">{it.label}</span>
            </dt>
            <dd className="mt-1.5 font-[family-name:var(--font-mono)] text-[15px] text-[var(--text)]">
              {!loaded ? (
                <Skeleton className="h-4 w-16" aria-label={`Cargando ${it.label}`} />
              ) : (
                it.value
              )}
            </dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-[rgba(0,229,255,0.14)] px-5 py-3 text-[11px] text-[var(--text-3)]">
        Datos en vivo de la API pública del bot. Si el servicio no responde se muestra “No
        disponible”, nunca cifras inventadas.
      </p>
    </div>
  );
}

export default function BotHomePage() {
  return (
    <div className="relative px-4 pb-[var(--section-y)] pt-10 sm:px-6 sm:pt-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_45%_at_50%_0%,rgba(0,229,255,0.13),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-7xl">
        {/* Hero */}
        <div className="text-center">
          <span className="eyebrow justify-center">
            <BotIcon aria-hidden className="h-3 w-3" />
            Discord Bot · infraestructura propia
          </span>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.4rem,7vw,4.25rem)] font-bold leading-[1.02] tracking-tight">
            <span className="bg-gradient-to-r from-[#59f1ff] via-[#00e5ff] to-[#60a5fa] bg-clip-text text-transparent">
              System 777
            </span>
            <span className="mt-2 block text-[clamp(1.15rem,3vw,1.75rem)] font-semibold text-[var(--text-2)]">
              Moderación, protección, economía y control del servidor en un solo bot
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-[var(--text-2)]">
            Corriendo 24/7 en mi VPS con PM2, dashboard propio con OAuth2 y una API pública de
            estadísticas. Invítalo gratis o explora sus comandos antes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="system" render={<a href={INVITE_URL} target="_blank" rel="noopener noreferrer" />}>
              Invitar al servidor
              <ArrowRight aria-hidden />
            </Button>
            <Button variant="outline" render={<Link href="/bot/commands" />}>
              Ver comandos
            </Button>
            <Button variant="outline" render={<Link href="/bot/status" />}>
              Estado en vivo
            </Button>
            <Button variant="outline" render={<Link href="/bot/dashboard" />}>
              Dashboard
            </Button>
          </div>
        </div>

        {/* Live stats */}
        <div className="mt-10">
          <LiveStats />
        </div>

        {/* Features */}
        <section className="mt-16">
          <div className="section-head">
            <span className="eyebrow">
              Qué incluye
            </span>
            <h2>Sistemas reales, no promesas</h2>
            <p>
              Cada bloque corresponde a comandos que existen en el bot. La lista completa está en
              la referencia de comandos.
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <li key={f.title} className="panel panel-hover h-full p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[rgba(0,229,255,0.14)]">
                    <f.icon aria-hidden className="h-4.5 w-4.5 text-[#59f1ff]" />
                  </span>
                  <h3 className="text-[15px] font-semibold">{f.title}</h3>
                </div>
                <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--text-3)]">{f.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Premium */}
        <section id="premium" className="mt-16 scroll-mt-24">
          <div className="section-head">
            <span className="eyebrow">
              Premium
            </span>
            <h2>Planes del bot</h2>
            <p>Precios y beneficios tal como están definidos en el código del bot.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {premiumPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`h-full flex-col p-6 ${plan.featured ? "border-[rgba(0,229,255,0.45)] ring-1 ring-[rgba(0,229,255,0.45)]" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <plan.icon aria-hidden className="h-5 w-5" style={{ color: plan.color }} />
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  {plan.featured && <Badge className="ml-auto font-mono">Popular</Badge>}
                </div>
                <p className="mt-3 font-[family-name:var(--font-mono)] text-2xl" style={{ color: plan.color }}>
                  {plan.price}
                </p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13.5px] text-[var(--text-2)]">
                      <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16">
          <div className="panel flex flex-col items-center gap-5 p-8 text-center sm:p-12">
            <h2 className="text-[clamp(1.5rem,3.2vw,2.25rem)] font-bold">
              ¿Lo añadimos a tu servidor?
            </h2>
            <p className="max-w-xl text-[var(--text-2)]">
              Instalación instantánea con permisos completos. Si algo no funciona, el estado del
              bot y los logs son públicos.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="system" render={<a href={INVITE_URL} target="_blank" rel="noopener noreferrer" />}>
                Añadir gratis
                <ArrowUpRight aria-hidden />
              </Button>
              <Button variant="outline" render={<Link href="/contact" />}>
                Hablar con el creador
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
