"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Github,
  Terminal,
  Shield,
  Server,
  Cpu,
  Bot as BotIcon,
  Users,
  Wifi,
  Clock,
  Globe,
  Lock,
  Eye,
  Zap,
  Network,
  Radar,
  Gauge,
  MessageSquare,
  Music,
  Coins,
  BarChart3,
  Ticket,
  Sparkles,
  FileCode,
  BookOpen,
  Download,
  Mail,
  CheckCircle2,
  CircleDot,
} from "lucide-react";
import StudyTimeCounter from "@/components/StudyTimeCounter";
import HeroCanvas from "@/components/three/HeroCanvas";
import RealEye from "@/components/RealEye";
import TiltBanner from "@/components/TiltBanner";
import { motion, useScroll, useTransform } from "framer-motion";
import { siteConfig } from "@/lib/config";
import { useBotStats, formatUptime, NA } from "@/lib/useBotStats";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const studyStartDate = new Date("2023-01-01");

/* =========================================================
   REVEAL — motion controlado, con fallback reduced-motion
   ========================================================= */
function Reveal({
  children,
  delay = 0,
  className = "",
  blur = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  blur?: boolean;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  type RevealProps = {
    ref?: React.Ref<HTMLElement>;
    style?: React.CSSProperties;
    className?: string;
    children?: ReactNode;
  };
  const Component = Tag as unknown as React.ComponentType<RevealProps>;
  return (
    <Component
      ref={ref}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={`reveal ${blur ? "reveal-blur" : ""} ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Component>
  );
}

/* =========================================================
   ESTADO EN VIVO DEL BOT (hook compartido, datos reales)
   ========================================================= */

function BotStatusStrip() {
  const { stats, loaded } = useBotStats();
  const online = stats?.available !== false && stats?.online === true;
  const uptime = formatUptime(stats?.uptime);

  const items = [
    { icon: Server, label: "Servidores", value: stats?.guilds != null ? String(stats.guilds) : NA },
    { icon: Users, label: "Usuarios", value: stats?.users != null ? stats.users.toLocaleString("es") : NA },
    { icon: Wifi, label: "Ping", value: stats?.ping != null ? `${stats.ping} ms` : NA },
    { icon: Clock, label: "Uptime", value: uptime ?? NA },
  ];

  return (
    <div className="terminal-strip w-full overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[var(--line)] px-3 py-2">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${online ? "bg-[var(--brand)] status-online" : "bg-[var(--text-3)]"}`}
        />
        <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-wide text-[var(--text-2)]">
          system777@vps:~$ status
        </span>
        <span className="ml-auto font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-3)]">
          {!loaded ? "conectando…" : online ? "online" : "sin conexión"}
        </span>
      </div>
      <dl className="grid grid-cols-2 divide-x divide-y divide-[var(--line)] sm:grid-cols-4 sm:divide-y-0">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2 px-3 py-2.5">
            <it.icon aria-hidden className="h-3.5 w-3.5 shrink-0 text-[var(--data)]" />
            <div className="min-w-0">
              <dt className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.14em] text-[var(--text-3)]">
                {it.label}
              </dt>
              <dd className="truncate font-[family-name:var(--font-mono)] text-[13px] text-[var(--text)]">
                {it.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* =========================================================
   CONTENIDO — todo real, sin cifras inventadas
   ========================================================= */
const techGroups = [
  {
    title: "Languages",
    items: [
      ["JavaScript", "javascript"],
      ["TypeScript", "typescript"],
      ["Python", "python"],
      ["C", "c"],
      ["C++", "cplusplus"],
      ["C#", "csharp"],
      ["Java", "java"],
    ],
  },
  {
    title: "Frontend",
    items: [
      ["HTML5", "html5"],
      ["CSS3", "css3"],
      ["React", "react"],
      ["Next.js", "nextjs"],
      ["Tailwind CSS", "tailwindcss"],
    ],
  },
  {
    title: "Backend & Data",
    items: [
      ["Node.js", "nodejs"],
      ["PostgreSQL", "postgresql"],
      ["MySQL", "mysql"],
      ["Redis", "redis"],
      ["Discord.js", "discordjs"],
    ],
  },
  {
    title: "Infrastructure",
    items: [
      ["Linux", "linux"],
      ["Docker", "docker"],
      ["Git", "git"],
      ["Cloudflare", "cloudflare"],
      ["PM2", "pm2"],
    ],
  },
] as const;

const devicon = (name: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-original.svg`;

const cyberAreas = [
  { icon: Shield, title: "Anti-Raid & Anti-Nuke", level: "Proyecto real", desc: "Detección de raid, bloqueo de masivas joins y protección de canales implementada en System 777.", color: "var(--brand)" },
  { icon: Zap, title: "AutoMod", level: "Proyecto real", desc: "Word filter, anti-spam, anti-caps, anti-link, anti-zalgo y whitelist granular por sistema.", color: "var(--brand)" },
  { icon: Lock, title: "Authentication", level: "Practicando", desc: "OAuth2 con Discord, sesiones con cookies, JWT y control de acceso en el dashboard.", color: "var(--data)" },
  { icon: Globe, title: "Web Security", level: "Estudiando", desc: "XSS, SQLi, CSRF y buenas prácticas de hardening aplicadas a mis propias apps.", color: "var(--warn)" },
  { icon: Server, title: "Hardening", level: "Practicando", desc: "Ubuntu con firewall, SSH, permisos mínimos y servicios expuestos solo cuando toca.", color: "var(--data)" },
  { icon: Network, title: "Networking", level: "Estudiando", desc: "Puertos, DNS, túneles, segmentación y análisis de tráfico.", color: "var(--warn)" },
  { icon: Radar, title: "Monitoring", level: "Proyecto real", desc: "Monitoreo de VPS, logs del bot, alertas y estadísticas públicas en tiempo real.", color: "var(--brand)" },
  { icon: Cpu, title: "Automation", level: "Proyecto real", desc: "Scripts de seguridad, respuestas automáticas y despliegues repetibles.", color: "var(--brand)" },
];

const projects = [
  {
    name: "System 777",
    kind: "Discord Bot + Infra",
    desc: "Bot multifunción con moderación, protección anti-raid, tickets, economía, niveles, música, terminal de VPS e IA. Corriendo 24/7 en VPS con PM2 y dashboard propio.",
    tech: ["Node.js", "Discord.js", "PostgreSQL", "PM2", "Express"],
    status: "Activo",
    color: "var(--system)",
    github: "https://github.com/Yzzz777/system-777",
    live: "/bot",
    liveLabel: "Ver System 777",
  },
  {
    name: "jrsystem7777.com",
    kind: "Web · Portafolio",
    desc: "Este sitio: Next.js 15, Tailwind v4, blog con base de datos, autenticación con Discord y despliegue en Cloudflare Pages.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Neon Postgres", "Cloudflare"],
    status: "Activo",
    color: "var(--brand)",
    github: "https://github.com/Yzzz777/system777",
    live: "/",
    liveLabel: "Estás aquí",
  },
  {
    name: "YZ Terminal",
    kind: "IA local · Asistente de voz",
    desc: "Asistente con LLM local (Ollama): detección de palabra de voz, STT/TTS, control del PC, skills de Spotify, Gmail y navegador, con cliente WebSocket hacia el VPS.",
    tech: ["Python", "Ollama", "FastAPI", "WebSocket"],
    status: "En desarrollo",
    color: "var(--data)",
    github: null,
    live: null,
    liveLabel: null,
  },
  {
    name: "IP Tracker",
    kind: "Seguridad",
    desc: "Endpoint que registra IP, ubicación, ISP y user agent desde un link de verificación, y avisa al owner por DM en Discord.",
    tech: ["TypeScript", "Edge Runtime", "Discord.js"],
    status: "Proyecto real",
    color: "var(--warn)",
    github: "https://github.com/Yzzz777/system-777",
    live: null,
    liveLabel: null,
  },
];

const systemFeatures = [
  { icon: Shield, title: "Moderación", desc: "Ban, kick, warn, timeout, nuke, cases, logs y notas de mod." },
  { icon: Zap, title: "Protección", desc: "Anti-raid, anti-nuke, automod y whitelist granular por sistema." },
  { icon: Ticket, title: "Tickets", desc: "Paneles, categorías, formularios, transcripts y calificación." },
  { icon: Coins, title: "Economía", desc: "Balance, banco, daily, work, slots, rob y ranking." },
  { icon: BarChart3, title: "Niveles", desc: "XP por mensaje, rank, leaderboard, logros y embed personalizable." },
  { icon: Music, title: "Música", desc: "Cola, controles, volumen y loop desde YouTube/Spotify." },
  { icon: Terminal, title: "Terminal VPS", desc: "Ejecuta comandos en el servidor directamente desde Discord." },
  { icon: Sparkles, title: "JARVIS", desc: "Asistente con IA (Groq) para controlar el bot en tiempo real." },
];

const premiumPlans = [
  { name: "Normal", price: "$4.99/mes" },
  { name: "Pro", price: "$9.99/mes" },
  { name: "Max", price: "$19.99/mes" },
];

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  created_at: string;
  published?: boolean;
}

const libraryResources = [
  {
    icon: Github,
    title: "Código fuente de System 777",
    desc: "Repositorio público del bot: comandos, sistemas y dashboard.",
    href: "https://github.com/Yzzz777/system-777",
    external: true,
    color: "var(--system)",
  },
  {
    icon: FileCode,
    title: "Código de este sitio",
    desc: "Frontend, blog y API de jrsystem7777.com.",
    href: "https://github.com/Yzzz777/system777",
    external: true,
    color: "var(--brand)",
  },
  {
    icon: BookOpen,
    title: "Referencia de comandos",
    desc: "Todos los comandos de System 777 con uso y descripción.",
    href: "/bot/commands",
    external: false,
    color: "var(--data)",
  },
  {
    icon: Gauge,
    title: "Estado del bot",
    desc: "Servidores, usuarios, ping y uptime en tiempo real.",
    href: "/bot/status",
    external: false,
    color: "var(--warn)",
  },
];

/* =========================================================
   HOME
   ========================================================= */
export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  /* Motion estilo Apple — gate post-hidratación para reduced-motion
     (SSR y primer render del cliente son idénticos: sin desajuste) */
  const [allowMotion, setAllowMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const upd = () => setAllowMotion(!mq.matches);
    upd();
    mq.addEventListener?.("change", upd);
    return () => mq.removeEventListener?.("change", upd);
  }, []);
  const { scrollY } = useScroll();
  const portraitY = useTransform(scrollY, [0, 700], [0, -70]);
  const portraitScale = useTransform(scrollY, [0, 700], [1, 0.96]);
  const textY = useTransform(scrollY, [0, 700], [0, -38]);
  const textFade = useTransform(scrollY, [300, 700], [1, 0.55]);
  const eyeY = useTransform(scrollY, [0, 700], [0, -140]);

  useEffect(() => {
    let alive = true;
    fetch("/api/blog/posts")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (alive && Array.isArray(data)) setPosts(data.filter((p: BlogPost) => p.published !== false));
      })
      .catch(() => alive && setPosts([]));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="relative">
      <div className="grid-bg" aria-hidden />
      <div className="bg-vignette" aria-hidden />

      <div className="relative z-10">
        {/* ============================ HERO ============================ */}
        <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:pb-24">
          <HeroCanvas />
          <motion.div
            aria-hidden
            style={allowMotion ? { y: eyeY } : undefined}
            className="pointer-events-none absolute right-[3%] top-[7%] z-0 w-[clamp(84px,12vw,190px)] sm:right-[4%]"
          >
            <RealEye />
          </motion.div>
          <div
            aria-hidden
            className="ring-deco left-[-140px] top-[60px] h-[340px] w-[340px] opacity-70"
          />
          <div
            aria-hidden
            className="ring-deco right-[-120px] top-[220px] h-[260px] w-[260px] opacity-60"
          />

          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
            {/* Retrato (parallax al hacer scroll) */}
            <motion.div
              style={allowMotion ? { y: portraitY, scale: portraitScale } : undefined}
              className="order-2 mx-auto w-full max-w-[340px] lg:order-1 lg:max-w-none"
            >
              <Reveal>
                <div className="relative">
                  <div className="portrait-glow" aria-hidden />
                  <div className="portrait-frame aspect-[3/4] w-full">
                    <Image
                      src="/angel.webp"
                      alt="Retrato de Ángel, creador de Yzzz 777"
                      fill
                      priority
                      sizes="(max-width: 1024px) 340px, 420px"
                      className="object-cover object-top"
                    />
                    <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
                      <span className="chip !border-[var(--line-strong)] !bg-black/55 backdrop-blur">
                        ÁNGEL · YZZZ 777
                      </span>
                      <span className="chip !border-[rgba(0,255,136,0.4)] !bg-black/55 text-[var(--brand)] backdrop-blur">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] status-online" />
                        ONLINE
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </motion.div>

            {/* Texto */}
            <motion.div
              style={allowMotion ? { y: textY, opacity: textFade } : undefined}
              className="order-1 lg:order-2"
            >
              <Reveal delay={60} blur>
                <span className="eyebrow">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
                  {siteConfig.tagline}
                </span>
              </Reveal>

              <Reveal delay={120} blur>
                <h1 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.75rem,9vw,5rem)] font-bold leading-[0.95] tracking-tight">
                  Ángel
                </h1>
              </Reveal>

              <Reveal delay={180}>
                <p className="mt-3 flex flex-wrap items-center gap-3 text-[clamp(1.05rem,2.6vw,1.5rem)] font-medium text-[var(--text-2)]">
                  <span className="gradient-text font-semibold">Yzzz 777</span>
                  <span aria-hidden className="h-4 w-px bg-[var(--line-strong)]" />
                  <span className="font-[family-name:var(--font-mono)] text-[0.95em] text-[var(--text-3)]">
                    developer · systems · cybersecurity
                  </span>
                </p>
              </Reveal>

              <Reveal delay={240}>
                <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-[var(--text-2)]">
                  Autodidacta desde 2023. Construyo cosas que se usan de verdad: sitios, bots de
                  Discord, automatizaciones y servidores Linux. Mantengo{" "}
                  <span className="text-[var(--text)]">System 777</span> en VPS y sigo aprendiendo
                  seguridad aplicada mientras lo hago.
                </p>
              </Reveal>

              <Reveal delay={300}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button render={<Link href="/projects" />}>
                    Ver proyectos
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" render={<Link href="/contact" />}>
                    <Mail aria-hidden className="h-4 w-4" />
                    Contactar
                  </Button>
                  <Button variant="outline" render={<a href="#system777" />}>
                    <BotIcon aria-hidden className="h-4 w-4" />
                    System 777
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={360} className="mt-8">
                <BotStatusStrip />
              </Reveal>
            </motion.div>
          </div>

          {/* Contador */}
          <Reveal delay={120} className="relative z-10 mx-auto mt-12 max-w-7xl">
            <div className="panel p-4 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="eyebrow">
                  <CircleDot aria-hidden className="h-3 w-3" />
                  Tiempo aprendiendo
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-3)]">
                  desde 2023-01-01 · sin parar
                </span>
              </div>
              <StudyTimeCounter startDate={studyStartDate} />
            </div>
          </Reveal>
        </section>

        {/* ============================ ABOUT ============================ */}
        <section id="about" className="border-t border-[var(--line)] px-4 py-[var(--section-y)] sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <Reveal blur>
              <div className="section-head !mb-0">
                <span className="eyebrow">01 — Sobre mí</span>
                <h2>Qué hago y por qué</h2>
                <p className="!text-[var(--text-3)] !text-sm">
                  Sin títulos inventados, sin empresas que no existen. Solo lo que construí y
                  mantengo.
                </p>
              </div>
            </Reveal>

            <Reveal delay={80} className="space-y-5">
              <div className="panel p-6 sm:p-8">
                <div className="space-y-4 text-[1.0625rem] leading-relaxed text-[var(--text-2)]">
                  <p>
                    Soy <span className="font-semibold text-[var(--text)]">Ángel</span>, conocido
                    como <span className="gradient-text font-semibold">Yzzz 777</span>. Empecé a
                    programar en serio a inicios de 2023 y desde entonces no he parado: primero
                    web, después Linux y servidores, después bots y seguridad.
                  </p>
                  <p>
                    Hoy construyo y mantengo{" "}
                    <span className="text-[var(--text)]">System 777</span> — un bot de Discord con
                    moderación, protección, tickets, economía, niveles y control del VPS — junto
                    con su dashboard y este portafolio.
                  </p>
                  <p>
                    Mis lenguajes principales son{" "}
                    <span className="text-[var(--text)]">JavaScript</span>,{" "}
                    <span className="text-[var(--text)]">TypeScript</span>,{" "}
                    <span className="text-[var(--text)]">Python</span> y{" "}
                    <span className="text-[var(--text)]">C#</span>, sobre una base de Linux,
                    PostgreSQL y Cloudflare.
                  </p>
                  <p className="border-l-2 border-[rgba(0,255,136,0.35)] pl-4 text-sm italic text-[var(--text-3)]">
                    No invento empleos, certificaciones ni métricas. Si está aquí, es porque lo
                    hice, lo uso o lo estoy estudiando de verdad.
                  </p>
                </div>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Globe, label: "Construyo", value: "Sitios, dashboards y APIs" },
                  { icon: Terminal, label: "Automatizo", value: "Bots, scripts y despliegues" },
                  { icon: Server, label: "Opero", value: "VPS Linux, PM2, túneles" },
                  { icon: Shield, label: "Me interesa", value: "Seguridad y sistemas" },
                ].map((i) => (
                  <li key={i.label} className="panel panel-hover flex items-start gap-3 p-4">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--brand-dim)]">
                      <i.icon aria-hidden className="h-4 w-4 text-[var(--brand)]" />
                    </span>
                    <span className="min-w-0">
                      <span className="stat-label block">{i.label}</span>
                      <span className="mt-1 block text-sm text-[var(--text)]">{i.value}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ============================ TECNOLOGÍAS ============================ */}
        <section
          id="tecnologias"
          className="border-t border-[var(--line)] bg-[var(--bg-raised)] px-4 py-[var(--section-y)] sm:px-6"
        >
          <div className="mx-auto max-w-7xl">
            <Reveal blur>
              <div className="section-head">
                <span className="eyebrow">02 — Tecnologías</span>
                <h2>Con qué trabajo</h2>
                <p>
                  Solo herramientas que uso en proyectos reales, organizadas por capa. Sin rellenar
                  cuadrículas.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {techGroups.map((group, gi) => (
                <Reveal key={group.title} delay={gi * 70}>
                  <div className="panel h-full p-5">
                    <h3 className="stat-label mb-4 text-[var(--brand)]">{group.title}</h3>
                    <ul className="space-y-2">
                      {group.items.map(([name, icon]) => (
                        <li key={name} className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[var(--line)] bg-white/[0.03]">
                            <Image
                              src={devicon(icon)}
                              alt=""
                              width={18}
                              height={18}
                              loading="lazy"
                              className="h-[18px] w-[18px] object-contain"
                            />
                          </span>
                          <span className="text-sm text-[var(--text-2)]">{name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={140} className="mt-6">
              <Link
                href="/technologies"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--brand)] hover:underline"
              >
                Ver tecnologías en detalle <ArrowUpRight aria-hidden className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ============================ CYBERSECURITY ============================ */}
        <section
          id="cybersecurity"
          className="border-t border-[var(--line)] px-4 py-[var(--section-y)] sm:px-6"
        >
          <div className="mx-auto max-w-7xl">
            <Reveal blur>
              <div className="section-head">
                <span className="eyebrow">03 — Cybersecurity</span>
                <h2>Seguridad con nivel honesto</h2>
                <p>
                  Distingo entre lo que estoy estudiando, lo que practico y lo que ya corre en
                  producción. Nada de “experto” sin prueba.
                </p>
              </div>
            </Reveal>

            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {cyberAreas.map((a, i) => (
                <Reveal as="li" key={a.title} delay={(i % 4) * 60}>
                  <div className="panel panel-hover h-full p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/[0.04]">
                        <a.icon aria-hidden className="h-4.5 w-4.5" style={{ color: a.color }} />
                      </span>
                      <span
                        className="chip"
                        style={{
                          color: a.color,
                          borderColor: `color-mix(in srgb, ${a.color} 35%, transparent)`,
                        }}
                      >
                        {a.level}
                      </span>
                    </div>
                    <h3 className="mt-4 text-[15px] font-semibold">{a.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-3)]">
                      {a.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={140} className="mt-6">
              <Link
                href="/cybersecurity"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--brand)] hover:underline"
              >
                Ver área de seguridad completa <ArrowUpRight aria-hidden className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ============================ PROJECTS ============================ */}
        <section
          id="proyectos"
          className="border-t border-[var(--line)] bg-[var(--bg-raised)] px-4 py-[var(--section-y)] sm:px-6"
        >
          <div className="mx-auto max-w-7xl">
            <Reveal blur>
              <div className="section-head">
                <span className="eyebrow">04 — Projects</span>
                <h2>Lo que he construido</h2>
                <p>
                  Cada ficha con su estado real. Si falta información, lo digo en lugar de
                  rellenarla.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((p, i) => (
                <Reveal key={p.name} delay={(i % 2) * 80}>
                  <article className="panel panel-hover flex h-full flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="stat-label" style={{ color: p.color }}>
                          {p.kind}
                        </span>
                        <h3 className="mt-2 text-xl font-bold">{p.name}</h3>
                      </div>
                      <Badge
                        variant="outline"
                        className="shrink-0 font-mono"
                        style={{
                          color: p.color,
                          borderColor: `color-mix(in srgb, ${p.color} 35%, transparent)`,
                        }}
                      >
                        {p.status}
                      </Badge>
                    </div>

                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--text-2)]">
                      {p.desc}
                    </p>

                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {p.tech.map((t) => (
                        <li key={t}>
                          <Badge variant="outline" className="font-mono">
                            {t}
                          </Badge>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
                      {p.github && (
                        <Button
                          variant="outline"
                          size="sm"
                          render={
                            <a href={p.github} target="_blank" rel="noopener noreferrer" />
                          }
                        >
                          <Github aria-hidden className="h-3.5 w-3.5" />
                          GitHub
                        </Button>
                      )}
                      {p.live && (
                        <Button variant="outline" size="sm" render={<Link href={p.live} />}>
                          <Globe aria-hidden className="h-3.5 w-3.5" />
                          {p.liveLabel}
                        </Button>
                      )}
                      {!p.live && !p.github && (
                        <span className="chip !text-[var(--text-3)]">Información próximamente</span>
                      )}
                      {!p.live && p.github && p.name === "YZ Terminal" && (
                        <span className="chip !text-[var(--text-3)]">
                          Demo: información próximamente
                        </span>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120} className="mt-6">
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--brand)] hover:underline"
              >
                Todos los proyectos <ArrowUpRight aria-hidden className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ============================ SYSTEM 777 ============================ */}
        <section id="system777" className="relative overflow-hidden px-4 py-[var(--section-y)] sm:px-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(88,101,242,0.14),transparent_70%)]"
          />
          <div className="relative mx-auto max-w-7xl">
            <Reveal blur>
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="section-head !mb-0">
                  <span className="eyebrow" style={{ color: "#8f97ff" }}>
                    <BotIcon aria-hidden className="h-3 w-3" />
                    05 — Proyecto insignia
                  </span>
                  <h2>
                    <span
                      className="bg-gradient-to-r from-[#7f8cff] via-[#5865F2] to-[#9b6bff] bg-clip-text text-transparent"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      System 777
                    </span>
                  </h2>
                  <p>
                    Infraestructura propia: bot de Discord + dashboard + VPS. No es una tarjeta más
                    del portafolio, es el producto que opero a diario.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button
                    variant="system"
                    render={
                      <a
                        href="https://discord.com/oauth2/authorize?client_id=1502804306125132057&permissions=8&integration_type=0&scope=applications.commands+bot"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    Invitar bot
                    <ArrowUpRight aria-hidden className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" render={<Link href="/bot" />}>
                    Ver más
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={40} className="mt-6">
              <TiltBanner src="/system777-banner.webp" alt="System 777 — banner del bot" />
            </Reveal>

            <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
              {/* Features */}
              <ul className="grid gap-3 sm:grid-cols-2">
                {systemFeatures.map((f, i) => (
                  <Reveal as="li" key={f.title} delay={(i % 2) * 60}>
                    <div className="panel h-full p-5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[rgba(88,101,242,0.16)]">
                          <f.icon aria-hidden className="h-4 w-4 text-[#8f97ff]" />
                        </span>
                        <h3 className="text-[15px] font-semibold">{f.title}</h3>
                      </div>
                      <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--text-3)]">
                        {f.desc}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ul>

              {/* Status + infra */}
              <Reveal delay={80} className="space-y-3">
                <System777StatusPanel />

                <div className="panel p-5">
                  <h3 className="stat-label mb-3">Infraestructura</h3>
                  <ul className="space-y-2 text-sm text-[var(--text-2)]">
                    {[
                      ["VPS Linux", "servidor propio, bot 24/7"],
                      ["PM2", "proceso y reinicios automáticos"],
                      ["Túnel Cloudflare", "bot-api.jrsystem7777.com"],
                      ["Dashboard", "OAuth2 + 40+ APIs REST"],
                    ].map(([k, v]) => (
                      <li key={k} className="flex items-start justify-between gap-3">
                        <span className="font-[family-name:var(--font-mono)] text-[12.5px] text-[var(--text)]">
                          {k}
                        </span>
                        <span className="text-right text-[12.5px] text-[var(--text-3)]">{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="panel p-5">
                  <h3 className="stat-label mb-3">Premium (planes del bot)</h3>
                  <div className="flex flex-wrap gap-2">
                    {premiumPlans.map((p) => (
                      <Badge key={p.name} variant="outline" className="font-mono text-[13px]">
                        {p.name} · <span className="text-[var(--brand)]">{p.price}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============================ BLOG ============================ */}
        <section
          id="blog"
          className="border-t border-[var(--line)] bg-[var(--bg-raised)] px-4 py-[var(--section-y)] sm:px-6"
        >
          <div className="mx-auto max-w-7xl">
            <Reveal blur>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="section-head !mb-0">
                  <span className="eyebrow">06 — Blog</span>
                  <h2>Notas y publicaciones</h2>
                </div>
                <Button variant="outline" size="sm" render={<Link href="/blog" />}>
                  Ir al blog
                  <ArrowUpRight aria-hidden className="h-4 w-4" />
                </Button>
              </div>
            </Reveal>

            <div className="mt-8">
              {posts === null ? (
                <ul
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  aria-busy="true"
                  aria-label="Cargando publicaciones"
                >
                  {[0, 1, 2].map((i) => (
                    <li key={i} className="panel p-5">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="mt-4 h-5 w-3/4" />
                      <Skeleton className="mt-3 h-4 w-full" />
                      <Skeleton className="mt-2 h-4 w-2/3" />
                    </li>
                  ))}
                </ul>
              ) : posts.length === 0 ? (
                <div className="panel p-8 text-center">
                  <p className="text-sm text-[var(--text-2)]">
                    Todavía no hay publicaciones reales. Estoy escribiendo la primera.
                  </p>
                  <p className="mt-2 text-xs text-[var(--text-3)]">
                    No muestro artículos de ejemplo: cuando publique, aparecerán aquí.
                  </p>
                </div>
              ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.slice(0, 3).map((p, i) => (
                    <Reveal as="li" key={p.id} delay={i * 60}>
                      <Link href="/blog" className="panel panel-hover block h-full p-5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {p.category || "General"}
                          </Badge>
                          <time
                            dateTime={p.created_at}
                            className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-3)]"
                          >
                            {new Date(p.created_at).toLocaleDateString("es-ES")}
                          </time>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold leading-snug">{p.title}</h3>
                        {p.excerpt && (
                          <p className="mt-2 line-clamp-3 text-sm text-[var(--text-3)]">
                            {p.excerpt}
                          </p>
                        )}
                      </Link>
                    </Reveal>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* ============================ BIBLIOTECA ============================ */}
        <section id="biblioteca" className="border-t border-[var(--line)] px-4 py-[var(--section-y)] sm:px-6">
          <div className="mx-auto max-w-7xl">
            <Reveal blur>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="section-head !mb-0">
                  <span className="eyebrow">07 — Biblioteca</span>
                  <h2>Recursos públicos</h2>
                  <p className="!text-sm">
                    Solo enlaces que existen de verdad. No hay archivos de ejemplo ni contadores de
                    descargas falsos.
                  </p>
                </div>
                <Button variant="outline" size="sm" render={<Link href="/library" />}>
                  Ver biblioteca
                  <ArrowUpRight aria-hidden className="h-4 w-4" />
                </Button>
              </div>
            </Reveal>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {libraryResources.map((r, i) => {
                const inner = (
                  <>
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.04]"
                      style={{ color: r.color }}
                    >
                      <r.icon aria-hidden className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 font-semibold text-[var(--text)]">
                        {r.title}
                        {r.external ? (
                          <ArrowUpRight aria-hidden className="h-3.5 w-3.5 text-[var(--text-3)]" />
                        ) : (
                          <ArrowRight aria-hidden className="h-3.5 w-3.5 text-[var(--text-3)]" />
                        )}
                      </span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-[var(--text-3)]">
                        {r.desc}
                      </span>
                    </span>
                  </>
                );
                return (
                  <Reveal as="li" key={r.title} delay={(i % 2) * 70}>
                    {r.external ? (
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="panel panel-hover flex items-start gap-4 p-5"
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link href={r.href} className="panel panel-hover flex items-start gap-4 p-5">
                        {inner}
                      </Link>
                    )}
                  </Reveal>
                );
              })}
            </ul>

            <Reveal delay={120} className="mt-5">
              <p className="flex items-center gap-2 text-xs text-[var(--text-3)]">
                <Download aria-hidden className="h-3.5 w-3.5" />
                Descargas directas: disponibles cuando publique archivos reales.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ============================ CONTACTO ============================ */}
        <section
          id="contacto"
          className="border-t border-[var(--line)] bg-[var(--bg-raised)] px-4 py-[var(--section-y)] sm:px-6"
        >
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <div className="panel p-8 text-center sm:p-12">
                <span className="eyebrow justify-center">08 — Contacto</span>
                <h2 className="mt-4 text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold">
                  ¿Hablamos?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-[var(--text-2)]">
                  Colaboraciones, dudas técnicas o simplemente charla. La vía más rápida es
                  Discord; también estoy en GitHub e Instagram.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    render={
                      <a
                        href={siteConfig.social.discord}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <MessageSquare aria-hidden className="h-4 w-4" />
                    Discord
                  </Button>
                  <Button variant="outline" render={<Link href="/contact" />}>
                    <Mail aria-hidden className="h-4 w-4" />
                    Enviar mensaje
                  </Button>
                  <Button
                    variant="outline"
                    render={
                      <a
                        href={siteConfig.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <Github aria-hidden className="h-4 w-4" />
                    GitHub
                  </Button>
                </div>

                <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[var(--text-3)]">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 aria-hidden className="h-3.5 w-3.5 text-[var(--brand)]" />
                    Respondo por Discord
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 aria-hidden className="h-3.5 w-3.5 text-[var(--brand)]" />
                    Formulario llega directo al owner
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Eye aria-hidden className="h-3.5 w-3.5 text-[var(--brand)]" />
                    Sin newsletters ni spam
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   PANEL DE STATUS SYSTEM 777
   ========================================================= */
function System777StatusPanel() {
  const { stats, loaded } = useBotStats(30000);
  const ready = loaded && !!stats;
  const online = stats?.available !== false && stats?.online === true;
  const uptime = formatUptime(stats?.uptime);

  const rows = [
    ["Servidores", stats?.guilds != null ? String(stats.guilds) : NA],
    ["Usuarios", stats?.users != null ? stats.users.toLocaleString("es") : NA],
    ["Comandos", stats?.commands != null ? String(stats.commands) : NA],
    ["Ping", stats?.ping != null ? `${stats.ping} ms` : NA],
    ["Uptime", uptime ?? NA],
    ["Memoria", stats?.memory ? `${stats.memory} MB` : NA],
  ];

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center gap-3 border-b border-[var(--line)] px-5 py-4">
        <span
          className={`h-2.5 w-2.5 rounded-full ${ready && online ? "bg-[var(--brand)] status-online" : "bg-[var(--text-3)]"}`}
        />
        <span className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text)]">
          {stats?.tag ? stats.tag : "System 777"}
        </span>
        {!ready ? (
          <Skeleton className="ml-auto h-5 w-24" aria-label="Consultando estado" />
        ) : (
          <Badge
            variant="outline"
            className="ml-auto font-mono"
            style={{
              color: online ? "var(--brand)" : "var(--text-3)",
              borderColor: online ? "rgba(0,255,136,0.4)" : undefined,
            }}
          >
            {online ? "online" : "offline"}
          </Badge>
        )}
      </div>
      <dl className="grid grid-cols-2 sm:grid-cols-3">
        {rows.map(([label, value], idx) => (
          <div
            key={label}
            className={`border-[var(--line)] px-4 py-3.5 ${idx % 2 === 0 ? "border-r sm:border-r" : ""} ${idx < 4 ? "border-b" : ""} ${idx === 2 ? "sm:border-r" : ""} ${idx === 4 ? "sm:border-r" : ""}`}
          >
            <dt className="stat-label">{label}</dt>
            <dd className="mt-1 font-[family-name:var(--font-mono)] text-[15px] text-[var(--text)]">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-[var(--line)] px-5 py-3">
        <p className="text-[11px] text-[var(--text-3)]">
          Datos en vivo desde la API del bot. Si el servicio cae, se muestra “No disponible” en
          lugar de números inventados.
        </p>
      </div>
    </div>
  );
}
