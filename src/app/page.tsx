"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Github,
  Instagram,
  MessageSquare,
  Bot as BotIcon,
  ExternalLink,
  Code,
  Shield,
  Terminal,
  Zap,
  ArrowRight,
  Globe,
  Download,
  ChevronRight,
  Music,
  Server,
  Users,
  Clock,
  Wifi,
  Activity,
  Sparkles,
  Eye,
  Star,
  Rocket,
  Lock,
  Brain,
  FileCode,
  Database,
  Cloud,
  Cog,
  Palette,
  MessageCircle,
  PenTool,
  Layers,
  CheckCircle,
} from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  FadeIn,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/Animations";
import StudyTimeCounter from "@/components/StudyTimeCounter";

const studyStartDate = new Date("2023-01-01");

/* ===================== PARTICLES ===================== */
function Particles() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<{ id: number; left: string; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    setMounted(true);
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 15,
        duration: 10 + Math.random() * 20,
        size: 1 + Math.random() * 2,
      }))
    );
  }, []);

  if (!mounted) return null;
  return (
    <div className="particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ===================== 3D TILT CARD ===================== */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ===================== DISCORD STATUS ===================== */
interface BotStats {
  guilds: number;
  users: number;
  ping: number;
  uptime: number;
  memory: string;
  online: boolean;
  commands: number;
}

function DiscordStatus() {
  const [stats, setStats] = useState<BotStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const r = await fetch("/api/bot/stats");
        if (r.ok) setStats(await r.json());
      } catch {}
    };
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (ms: number) => {
    if (!ms) return "—";
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    return d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m`;
  };

  return (
    <div className="glass glass-hover rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`h-3 w-3 rounded-full ${stats?.online !== false ? "bg-[#00FF88] status-online" : "bg-red-500"}`} />
        <span className="text-sm font-medium text-white">
          System 777 {stats?.online !== false ? "Online" : "Offline"}
        </span>
        <BotIcon className="ml-auto h-4 w-4 text-[#5865F2]" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Server className="h-4 w-4 text-[#5865F2]" />
          <span>{stats?.guilds ? `${stats.guilds} servidores` : "No disponible"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="h-4 w-4 text-[#00C8FF]" />
          <span>{stats?.users ? `${stats.users.toLocaleString()} usuarios` : "No disponible"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Wifi className="h-4 w-4 text-[#00FF88]" />
          <span>{stats?.ping != null ? `${stats.ping}ms ping` : "No disponible"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="h-4 w-4 text-[#FFD93D]" />
          <span>{stats?.uptime ? formatUptime(stats.uptime) : "No disponible"}</span>
        </div>
      </div>
    </div>
  );
}

/* ===================== DATA ===================== */
const socialLinks = [
  { name: "Discord", icon: MessageSquare, href: "https://discord.gg/system777", color: "#5865F2" },
  { name: "GitHub", icon: Github, href: "https://github.com/Yzzz777", color: "#fff" },
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/yzz.yzx?igsi=ZndvczI3bnZncWtj&utm_source=qr", color: "#E4405F" },
  { name: "TikTok", icon: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.2a8.16 8.16 0 005.58 2.17v-3.45a4.85 4.85 0 01-5.58-2.73V6.69h5.58z"/>
    </svg>
  ), href: "https://www.tiktok.com/@yzz.yzx", color: "#000" },
];

const skills = [
  { icon: Code, name: "Desarrollo Web", desc: "HTML, CSS, JavaScript, React, Next.js — sitios modernos y funcionales.", level: "Avanzado", color: "#00FF88" },
  { icon: FileCode, name: "Programación", desc: "Python, TypeScript, Java, C, C++, C# — lógica, algoritmos y estructuras de datos.", level: "Avanzado", color: "#00C8FF" },
  { icon: Shield, name: "Ciberseguridad", desc: "Pentesting, auditorías, hardening, OSINT defensivo y análisis de vulnerabilidades.", level: "Intermedio", color: "#7C3AED" },
  { icon: Terminal, name: "Linux & Servidores", desc: "Administración de Linux, servidores VPS, shells, permisos y servicios.", level: "Avanzado", color: "#FCC624" },
  { icon: Database, name: "Bases de Datos", desc: "PostgreSQL, MySQL, MongoDB, Redis — diseño, optimización y consultas.", level: "Intermedio", color: "#FF8C42" },
  { icon: BotIcon, name: "Bots de Discord", desc: "Discord.js, comandos slash, tickets, economía, niveles y sistemas complejos.", level: "Avanzado", color: "#5865F2" },
  { icon: Cloud, name: "Cloud & DevOps", desc: "Cloudflare Pages, Workers, Docker, CI/CD y despliegues automatizados.", level: "Intermedio", color: "#F38020" },
  { icon: Cog, name: "Automatización", desc: "Scripts Python, paramiko, cron jobs,PM2, monitoreo y procesos automatizados.", level: "Avanzado", color: "#00FF88" },
  { icon: PenTool, name: "UI/UX Design", desc: "Diseño de interfaces modernas, dark mode, glassmorphism, animaciones fluidas.", level: "Intermedio", color: "#EB459E" },
  { icon: Layers, name: "APIs & Backend", desc: "REST APIs, autenticación, JWT, OAuth, rate limiting y arquitectura de datos.", level: "Intermedio", color: "#00C8FF" },
  { icon: Palette, name: "CSS & Animaciones", desc: "Tailwind CSS, Framer Motion, transiciones, efectos 3D y microinteracciones.", level: "Avanzado", color: "#FFD93D" },
  { icon: MessageCircle, name: "Comunicación", desc: "Documentación técnica, trabajo en equipo, resolución de problemas y mentoría.", level: "Constante", color: "#00FF88" },
];

const techData = [
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg", color: "#F7DF1E", level: 90 },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg", color: "#3178C6", level: 70 },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg", color: "#3776AB", level: 85 },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg", color: "#61DAFB", level: 75 },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg", color: "#FFFFFF", level: 70 },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg", color: "#339933", level: 80 },
  { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg", color: "#E34F26", level: 95 },
  { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg", color: "#1572B6", level: 90 },
  { name: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg", color: "#A8B9CC", level: 50 },
  { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg", color: "#00599C", level: 45 },
  { name: "C#", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg", color: "#239120", level: 55 },
  { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg", color: "#ED8B00", level: 40 },
  { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg", color: "#FF8C42", level: 75 },
  { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg", color: "#FCC624", level: 90 },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg", color: "#2496ED", level: 65 },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg", color: "#F05032", level: 85 },
  { name: "Cloudflare", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cloudflare/cloudflare-original.svg", color: "#F38020", level: 70 },
  { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg", color: "#4169E1", level: 70 },
  { name: "Redis", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg", color: "#DC382D", level: 50 },
];

const cyberAreas = [
  { name: "Seguridad Web", icon: Globe, desc: "Pentesting, auditorías de aplicaciones web, XSS, SQLi y CSRF." },
  { name: "Vulnerabilidades", icon: Shield, desc: "Análisis, clasificación CVSS y explotación controlada." },
  { name: "APIs", icon: Lock, desc: "Hardening de REST/GraphQL, autenticación y rate limiting." },
  { name: "Autenticación", icon: Lock, desc: "OAuth 2.0, JWT, MFA, sesiones y control de acceso." },
  { name: "OSINT", icon: Eye, desc: "Inteligencia abierta, reconocimiento y fingerprinting defensivo." },
  { name: "Hardening", icon: Server, desc: "CIS Benchmarks, minimización de superficie de ataque." },
  { name: "Redes", icon: Wifi, desc: "Firewalls, IDS/IPS, análisis de tráfico y segmentación." },
  { name: "Automatización", icon: Zap, desc: "Scripts de seguridad, escaneo automatizado y respuesta." },
  { name: "Anti-Raid", icon: Shield, desc: "Detección y prevención de ataques de raid en Discord." },
  { name: "Moderación", icon: Users, desc: "AutoMod, word filters, anti-spam y sistemas de warnings." },
  { name: "Forensics", icon: Activity, desc: "Análisis de evidencia digital, logs y cadena de custodia." },
  { name: "SOC", icon: Brain, desc: "Monitoreo, alertas, respuesta a incidentes Red/Blue team." },
];

const projects = [
  {
    name: "System 777",
    desc: "Bot avanzado para Discord con 91+ comandos, moderación completa, música, economía, niveles, protección anti-raid, sistema de tickets, JARVIS AI y control total del VPS desde Discord. Más de 21 servidores y 4,600+ usuarios activos.",
    color: "#5865F2",
    github: "https://github.com/Yzzz777/system-777",
    web: "https://jrsystem7777.com",
    status: "Activo",
    tech: ["Node.js", "Discord.js", "PostgreSQL", "PM2"],
  },
  {
    name: "Dashboard System 777",
    desc: "Panel de administración web completo con gestión de servidores, usuarios, analytics, blogs, archivos, OAuth2 Discord, sistema de tickets y control del bot en tiempo real. Integrado con Cloudflare Pages.",
    color: "#7C3AED",
    github: "https://github.com/Yzzz777/system777",
    web: "https://12e022de.system777.pages.dev",
    status: "Activo",
    tech: ["Next.js", "Cloudflare Pages", "Neon", "OAuth2"],
  },
  {
    name: "Portfolio Web",
    desc: "Este sitio web. Portafolio personal con diseño futurista, efectos 3D, partículas, sistema de blog, biblioteca de archivos, integración con Discord y panel administrativo.",
    color: "#00FF88",
    github: "https://github.com/Yzzz777/system777",
    web: "https://jrsystem7777.com",
    status: "Activo",
    tech: ["Next.js", "Tailwind", "Framer Motion", "Cloudflare"],
  },
];

const botFeatures = [
  { icon: Shield, name: "Moderación", desc: "Ban, kick, warn, timeout, AutoMod, word filter, anti-spam completo.", color: "#00FF88" },
  { icon: Zap, name: "Protección", desc: "Anti-raid, anti-nuke, anti-link, anti-caps, anti-token, whitelist granular.", color: "#FFD93D" },
  { icon: Terminal, name: "Terminal VPS", desc: "Ejecuta comandos en el servidor directamente desde Discord.", color: "#00C8FF" },
  { icon: Brain, name: "JARVIS AI", desc: "Asistente IA con LLaMA 3.3 70B vía Groq, control del bot en tiempo real.", color: "#7C3AED" },
  { icon: Music, name: "Música", desc: "Reproducción desde YouTube, Spotify, cola de reproducción y controles.", color: "#EB459E" },
  { icon: Activity, name: "Economía", desc: "Sistema de monedas, banco, trabajo diario, slots, robo y trading.", color: "#F38020" },
  { icon: Star, name: "Niveles", desc: "Sistema de XP, recompensas por nivel, leaderboard y configuración.", color: "#5865F2" },
  { icon: Rocket, name: "Premium", desc: "Planes normal ($4.99), pro ($9.99), max ($19.99) con beneficios exclusivos.", color: "#00FF88" },
];

const recentPosts = [
  { title: "Next.js 15 nuevas características", category: "Framework", date: "2024-01-15", excerpt: "Resumen de las nuevas funcionalidades en Next.js 15 y cómo aprovecharlas." },
  { title: "Roadmap ético hacking 2025", category: "Ciberseguridad", date: "2024-02-10", excerpt: "Guía completa para iniciar en hacking ético y pentesting profesional." },
  { title: "Mejores prácticas cybersecurity 2025", category: "Seguridad", date: "2024-03-05", excerpt: "Las mejores prácticas de ciberseguridad para proteger tus aplicaciones." },
];

const announcements = [
  { title: "System 777 — 9 sistemas de whitelist añadidos", type: "success", content: "Whitelist granular para moderación, anti-raid, automod y más." },
  { title: "Nuevo plan Pro disponible", type: "info", content: "Recursos ilimitados, mentoría y soporte prioritario." },
  { title: "Parche de seguridad crítico aplicado", type: "warning", content: "Actualización urgente de seguridad en el bot y el dashboard." },
];

/* ===================== MAIN ===================== */
export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div className="relative">
      {/* Background */}
      <div className="grid-bg" />
      <Particles />

      {/* Mouse glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(0,255,136,0.06), transparent 60%)`,
        }}
      />

      <div className="relative z-10">

        {/* =================== HERO =================== */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 8, repeat: Infinity }} className="absolute left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-[#00FF88]/10 blur-[150px]" />
          <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.25, 0.1] }} transition={{ duration: 10, repeat: Infinity, delay: 3 }} className="absolute right-[10%] bottom-[20%] h-[400px] w-[400px] rounded-full bg-[#5865F2]/10 blur-[130px]" />
          <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.2, 0.08] }} transition={{ duration: 12, repeat: Infinity, delay: 1 }} className="absolute left-[50%] top-[60%] h-[300px] w-[300px] rounded-full bg-[#7C3AED]/10 blur-[120px]" />

          <div className="relative mx-auto max-w-5xl px-4 py-20 text-center">
            {/* Banner + Profile */}
            <FadeIn>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative mx-auto max-w-3xl mb-6">
                {/* Banner */}
                <div className="relative w-full aspect-[3/1] rounded-3xl overflow-hidden border border-white/5">
                  <Image src="/banner.gif" alt="Banner" fill className="object-cover" unoptimized priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/20 to-transparent" />
                </div>
                {/* Avatar overlapping */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-[#050508] overflow-hidden avatar-glow bg-[#0c0c12]">
                      <Image src="/profile.png" alt="Ángel" width={96} height={96} className="h-full w-full object-cover" priority />
                    </div>
                  </div>
                </div>
              </motion.div>
            </FadeIn>

            {/* Name */}
            <FadeIn delay={0.2}>
              <div className="mt-10">
                <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl">Ángel</h1>
                <div className="mt-3 flex items-center justify-center gap-3">
                  <span className="holographic rounded-full px-4 py-1 text-sm font-bold text-black">Yzzz 777</span>
                </div>
              </div>
            </FadeIn>

            {/* Bio */}
            <FadeIn delay={0.3}>
              <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-gray-400 leading-relaxed">
                Desarrollador autodidacta apasionado por la programación, la ciberseguridad y los sistemas.
                Creo herramientas reales que la gente usa todos los días.
              </p>
            </FadeIn>

            {/* Social */}
            <FadeIn delay={0.4}>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {socialLinks.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    <s.icon className="h-4 w-4" /> {s.name}
                    <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </FadeIn>

            {/* Counter */}
            <FadeIn delay={0.5}>
              <div className="mt-14">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Tiempo aprendiendo</p>
                <div className="glass rounded-2xl p-6 inline-block">
                  <StudyTimeCounter startDate={studyStartDate} />
                </div>
              </div>
            </FadeIn>

            {/* Scroll */}
            <FadeIn delay={0.8}>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="mt-16">
                <ChevronRight className="mx-auto h-5 w-5 rotate-90 text-gray-700" />
              </motion.div>
            </FadeIn>
          </div>
        </section>

        {/* =================== SOBRE MÍ =================== */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4">
            <FadeInUp>
              <TiltCard className="glass glass-hover rounded-3xl p-10 sm:p-12">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="h-5 w-5 text-[#00FF88]" />
                  <h2 className="text-3xl font-bold text-white">Sobre mí</h2>
                </div>
                <div className="space-y-4 text-gray-400 leading-relaxed">
                  <p>
                    Soy <span className="text-white font-semibold">Ángel</span>, conocido como <span className="gradient-text font-semibold">Yzzz 777</span>. Llevo aproximadamente <span className="text-white font-medium">3 años</span> estudiando programación, sistemas y ciberseguridad de forma autodidacta y práctica.
                  </p>
                  <p>
                    He trabajado en proyectos reales relacionados con:{" "}
                    <span className="text-white">desarrollo web</span>,{" "}
                    <span className="text-white">bots de Discord</span>,{" "}
                    <span className="text-white">automatización</span>,{" "}
                    <span className="text-white">APIs</span>,{" "}
                    <span className="text-white">Linux</span>,{" "}
                    <span className="text-white">servidores</span>,{" "}
                    <span className="text-white">bases de datos</span>,{" "}
                    <span className="text-white">seguridad</span> y{" "}
                    <span className="text-white">sistemas</span>.
                  </p>
                  <p>
                    Mis lenguajes principales incluyen <span className="text-white font-medium">JavaScript</span>, <span className="text-white font-medium">TypeScript</span>, <span className="text-white font-medium">Python</span>, y <span className="text-white font-medium">C#</span> — este último es uno de los que más manejo y en el que tengo más experiencia práctica.
                  </p>
                  <p>
                    Actualmente mantengo <span className="text-[#5865F2] font-medium">System 777</span> — un bot con 91+ comandos, más de 21 servidores y 4,600+ usuarios. También administro este sitio web, un dashboard completo de administración, y sigo aprendiendo cada día.
                  </p>
                  <p className="text-sm text-gray-500 italic border-l-2 border-[#00FF88]/20 pl-4">
                    No invento empleos, empresas, certificaciones ni títulos. Todo lo que muestro aquí es lo que realmente sé, he construido y mantengo activo.
                  </p>
                </div>
              </TiltCard>
            </FadeInUp>
          </div>
        </section>

        {/* =================== SKILLS =================== */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00FF88]/[0.02] to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/5 px-4 py-1.5 text-xs text-[#00FF88] mb-4">
                  <CheckCircle className="h-3 w-3" /> Aprendidas
                </span>
                <h2 className="text-4xl font-bold text-white sm:text-5xl">Skills</h2>
                <p className="mx-auto mt-4 max-w-xl text-gray-400">Habilidades que he desarrollado con años de práctica real</p>
              </div>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((s) => (
                <StaggerItem key={s.name}>
                  <TiltCard className="glass glass-hover rounded-xl p-6 h-full">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: s.color + "15" }}>
                        <s.icon className="h-5 w-5" style={{ color: s.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-white">{s.name}</h3>
                          <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: s.color + "15", color: s.color }}>
                            {s.level}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-gray-400 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* =================== TECNOLOGÍAS =================== */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#00C8FF]/20 bg-[#00C8FF]/5 px-4 py-1.5 text-xs text-[#00C8FF] mb-4">
                  <Code className="h-3 w-3" /> Stack
                </span>
                <h2 className="text-4xl font-bold text-white sm:text-5xl">Tecnologías</h2>
                <p className="mx-auto mt-4 max-w-xl text-gray-400">Lenguajes, frameworks y herramientas que uso en mis proyectos</p>
              </div>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {techData.map((t) => (
                <StaggerItem key={t.name}>
                  <TiltCard className="tech-badge glass glass-hover rounded-xl p-4 text-center cursor-default">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: t.color + "18" }}>
                      <img src={t.icon} alt={t.name} className="h-6 w-6 object-contain" loading="lazy" />
                    </div>
                    <h3 className="text-[11px] font-semibold text-white">{t.name}</h3>
                    <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${t.level}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="h-full rounded-full" style={{ backgroundColor: t.color }} />
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* =================== CYBERSECURITY =================== */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00C8FF]/[0.02] to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#00C8FF]/20 bg-[#00C8FF]/5 px-4 py-1.5 text-xs text-[#00C8FF] mb-4">
                  <Shield className="h-3 w-3" /> Security
                </span>
                <h2 className="text-4xl font-bold text-white sm:text-5xl">Cybersecurity</h2>
                <p className="mx-auto mt-4 max-w-xl text-gray-400">Áreas de seguridad informática que estudio y practico</p>
              </div>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {cyberAreas.map((area) => (
                <StaggerItem key={area.name}>
                  <TiltCard className="glass glass-hover rounded-xl p-5 cursor-default h-full">
                    <area.icon className="mb-3 h-5 w-5 text-[#00C8FF]" />
                    <h3 className="text-sm font-semibold text-white">{area.name}</h3>
                    <p className="mt-1 text-xs text-gray-500 leading-relaxed">{area.desc}</p>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* =================== PROYECTOS =================== */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/5 px-4 py-1.5 text-xs text-[#7C3AED] mb-4">
                  <Rocket className="h-3 w-3" /> Projects
                </span>
                <h2 className="text-4xl font-bold text-white sm:text-5xl">Mis Proyectos</h2>
                <p className="mx-auto mt-4 max-w-xl text-gray-400">Proyectos que he construido, mantengo y uso activamente</p>
              </div>
            </FadeIn>
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <StaggerItem key={p.name}>
                  <TiltCard className="glass glass-hover rounded-2xl overflow-hidden h-full flex flex-col">
                    <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${p.color}, transparent)` }} />
                    <div className="p-7 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-white">{p.name}</h3>
                        <span className="shrink-0 rounded-full bg-[#00FF88]/10 px-3 py-1 text-xs font-medium text-[#00FF88]">{p.status}</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-4 flex-1 leading-relaxed">{p.desc}</p>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {p.tech.map((t) => (
                          <span key={t} className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-gray-400">{t}</span>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <a href={p.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-gray-300 transition-all hover:bg-white/10 hover:text-white">
                          <Github className="h-4 w-4" /> GitHub
                        </a>
                        <a href={p.web} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-gray-300 transition-all hover:bg-white/10 hover:text-white">
                          <Globe className="h-4 w-4" /> Web
                        </a>
                      </div>
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* =================== SYSTEM 777 =================== */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#5865F2]/[0.03] to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#5865F2]/20 bg-[#5865F2]/5 px-4 py-1.5 text-xs text-[#5865F2] mb-4">
                  <BotIcon className="h-3 w-3" /> Discord Bot
                </span>
                <h2 className="text-4xl font-bold text-white sm:text-5xl">
                  <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">System 777</span>
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-gray-400">
                  Bot multifunción para Discord. Moderación, protección, música, economía, niveles y control total del servidor. Desarrollado y mantenido por mí desde cero.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mx-auto max-w-lg mb-12">
                <DiscordStatus />
              </div>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {botFeatures.map((f) => (
                <StaggerItem key={f.name}>
                  <TiltCard className="glass glass-hover rounded-xl p-5 cursor-default">
                    <f.icon className="mb-3 h-5 w-5" style={{ color: f.color }} />
                    <h3 className="text-sm font-semibold text-white">{f.name}</h3>
                    <p className="mt-1 text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <FadeIn delay={0.3}>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="https://discord.com/oauth2/authorize?client_id=1502804306125132057&permissions=8&integration_type=0&scope=applications.commands+bot"
                  target="_blank" rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-xl bg-[#5865F2] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4752c4] hover:shadow-[0_0_30px_rgba(88,101,242,0.3)]">
                  Invitar Bot <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <Link href="/bot" className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-[#5865F2]/30 hover:bg-white/5">
                  Ver más
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* =================== BLOG =================== */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4">
            <FadeIn>
              <div className="flex items-center justify-between mb-12">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#FFD93D]/20 bg-[#FFD93D]/5 px-4 py-1.5 text-xs text-[#FFD93D] mb-3">
                    <Star className="h-3 w-3" /> Blog
                  </span>
                  <h2 className="text-3xl font-bold text-white sm:text-4xl">Últimas publicaciones</h2>
                </div>
                <Link href="/blog" className="flex items-center gap-1 text-sm font-medium text-[#00FF88] hover:underline">
                  Ver todo <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </FadeIn>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <StaggerItem key={post.title}>
                  <TiltCard className="glass glass-hover rounded-xl p-6">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{post.category}</span>
                    <h3 className="mt-2 text-lg font-semibold text-white">{post.title}</h3>
                    <p className="mt-2 text-sm text-gray-400 leading-relaxed">{post.excerpt}</p>
                    <p className="mt-3 text-xs text-gray-600">{post.date}</p>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* =================== ANUNCIOS =================== */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFD93D]/[0.02] to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4">
            <FadeIn>
              <div className="flex items-center justify-between mb-12">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6B6B]/20 bg-[#FF6B6B]/5 px-4 py-1.5 text-xs text-[#FF6B6B] mb-3">
                    <Zap className="h-3 w-3" /> Updates
                  </span>
                  <h2 className="text-3xl font-bold text-white sm:text-4xl">Anuncios</h2>
                </div>
              </div>
            </FadeIn>
            <StaggerContainer className="space-y-3">
              {announcements.map((a) => (
                <StaggerItem key={a.title}>
                  <TiltCard className="glass glass-hover rounded-xl p-5 flex items-start gap-4">
                    <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${a.type === "success" ? "bg-[#00FF88]" : a.type === "warning" ? "bg-[#FFD93D]" : "bg-[#00C8FF]"}`} />
                    <div>
                      <h3 className="font-semibold text-white text-sm">{a.title}</h3>
                      <p className="mt-1 text-xs text-gray-400">{a.content}</p>
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* =================== BIBLIOTECA =================== */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4">
            <FadeIn>
              <div className="flex items-center justify-between mb-12">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/5 px-4 py-1.5 text-xs text-[#00FF88] mb-3">
                    <Download className="h-3 w-3" /> Files
                  </span>
                  <h2 className="text-3xl font-bold text-white sm:text-4xl">Biblioteca</h2>
                  <p className="mt-2 text-gray-400 text-sm">Documentos, scripts, backups y recursos descargables</p>
                </div>
                <Link href="/library" className="flex items-center gap-1 text-sm font-medium text-[#00FF88] hover:underline">
                  Ver todo <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </FadeIn>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "System 777 Docs", desc: "Documentación completa del bot — setup, comandos, configuración.", size: "2.4 MB", downloads: 128, icon: FileCode, color: "#5865F2" },
                { name: "Bot Setup Guide", desc: "Guía paso a paso para configurar System 777 en tu servidor.", size: "8.7 MB", downloads: 89, icon: Terminal, color: "#00FF88" },
                { name: "Database Backup", desc: "Backup de la base de datos del bot con estructura completa.", size: "15.3 MB", downloads: 45, icon: Database, color: "#FF8C42" },
                { name: "Config Example", desc: "Archivo .env.example con todas las variables de entorno necesarias.", size: "3.2 KB", downloads: 312, icon: Cog, color: "#FFD93D" },
                { name: "Design System", desc: "Paleta de colores, tipografía y tokens de diseño del sitio.", size: "45.6 MB", downloads: 12, icon: Palette, color: "#EB459E" },
                { name: "README Project", desc: "Readme principal del proyecto con estructura y comandos útiles.", size: "128 KB", downloads: 234, icon: FileCode, color: "#00C8FF" },
              ].map((f) => (
                <StaggerItem key={f.name}>
                  <TiltCard className="glass glass-hover rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: f.color + "15" }}>
                        <f.icon className="h-5 w-5" style={{ color: f.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white">{f.name}</h3>
                        <p className="mt-1 text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] text-gray-500">{f.size}</span>
                          <span className="text-[10px] text-gray-500 flex items-center gap-1">
                            <Download className="h-3 w-3" /> {f.downloads}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* =================== CONTACTO =================== */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00FF88]/[0.02] to-transparent" />
          <div className="relative mx-auto max-w-4xl px-4">
            <FadeInUp>
              <TiltCard className="glass glass-hover rounded-3xl p-12 text-center">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">Contacto</h2>
                <p className="mx-auto mt-4 max-w-xl text-gray-400">
                  ¿Quieres colaborar, preguntar algo o simplemente hablar? Encuéntrame en mis redes o escríbeme directo.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="https://discord.gg/system777" target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-2 rounded-xl bg-[#5865F2] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4752c4] hover:shadow-[0_0_30px_rgba(88,101,242,0.3)]">
                    <MessageSquare className="h-4 w-4" /> Discord
                  </a>
                  <a href="https://github.com/Yzzz777" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/5">
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                  <a href="https://www.instagram.com/yzz.yzx?igsi=ZndvczI3bnZncWtj&utm_source=qr" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/5">
                    <Instagram className="h-4 w-4" /> Instagram
                  </a>
                </div>
              </TiltCard>
            </FadeInUp>
          </div>
        </section>
      </div>
    </div>
  );
}
