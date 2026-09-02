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
} from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  FadeIn,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
  HoverScale,
} from "@/components/ui/Animations";
import StudyTimeCounter from "@/components/StudyTimeCounter";

const studyStartDate = new Date("2023-01-01");

/* ===================== PARTICLES ===================== */
function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 15,
    duration: 10 + Math.random() * 20,
    size: 1 + Math.random() * 2,
  }));
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
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

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
    if (!ms) return "N/A";
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    return d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`;
  };

  return (
    <div className="glass glass-hover rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`h-3 w-3 rounded-full ${stats?.online ? "bg-[#00FF88] status-online" : "bg-red-500"}`} />
        <span className="text-sm font-medium text-white">{stats?.online ? "System 777 Online" : "Offline"}</span>
        <BotIcon className="ml-auto h-4 w-4 text-[#5865F2]" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Server className="h-4 w-4 text-[#5865F2]" />
          <span>{stats?.guilds ?? "—"} servers</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="h-4 w-4 text-[#00C8FF]" />
          <span>{stats?.users?.toLocaleString() ?? "—"} users</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Wifi className="h-4 w-4 text-[#00FF88]" />
          <span>{stats?.ping ?? "—"}ms</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="h-4 w-4 text-[#FFD93D]" />
          <span>{formatUptime(stats?.uptime ?? 0)}</span>
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

const techData = [
  { name: "JavaScript", icon: "JS", color: "#F7DF1E", level: 90 },
  { name: "TypeScript", icon: "TS", color: "#3178C6", level: 70 },
  { name: "Python", icon: "Py", color: "#3776AB", level: 85 },
  { name: "React", icon: "Re", color: "#61DAFB", level: 75 },
  { name: "Next.js", icon: "Nx", color: "#FFFFFF", level: 70 },
  { name: "Node.js", icon: "No", color: "#339933", level: 80 },
  { name: "HTML", icon: "H5", color: "#E34F26", level: 95 },
  { name: "CSS", icon: "CS", color: "#1572B6", level: 90 },
  { name: "SQL", icon: "SQ", color: "#FF8C42", level: 75 },
  { name: "C", icon: "C", color: "#A8B9CC", level: 50 },
  { name: "C++", icon: "C+", color: "#00599C", level: 45 },
  { name: "C#", icon: "C#", color: "#239120", level: 40 },
  { name: "Linux", icon: "Li", color: "#FCC624", level: 90 },
  { name: "Docker", icon: "Dk", color: "#2496ED", level: 65 },
  { name: "Git", icon: "Gi", color: "#F05032", level: 85 },
  { name: "Cloudflare", icon: "CF", color: "#F38020", level: 70 },
  { name: "PostgreSQL", icon: "PG", color: "#4169E1", level: 70 },
  { name: "Redis", icon: "Rd", color: "#DC382D", level: 50 },
];

const cyberAreas = [
  { name: "Seguridad Web", icon: Globe, desc: "Pentesting y auditorías" },
  { name: "Vulnerabilidades", icon: Shield, desc: "Análisis y explotación" },
  { name: "APIs", icon: Lock, desc: "Hardening REST/GraphQL" },
  { name: "Autenticación", icon: Lock, desc: "OAuth, JWT, MFA" },
  { name: "OSINT", icon: Eye, desc: "Inteligencia abierta" },
  { name: "Hardening", icon: Server, desc: "Servidores seguros" },
  { name: "Redes", icon: Wifi, desc: "Seguridad de red" },
  { name: "Automatización", icon: Zap, desc: "Scripts de seguridad" },
  { name: "Anti-Raid", icon: Shield, desc: "Protección Discord" },
  { name: "Moderación", icon: Users, desc: "Bots automatizados" },
  { name: "Forensics", icon: Activity, desc: "Análisis digital" },
  { name: "SOC", icon: Brain, desc: "Red/Blue team" },
];

const projects = [
  {
    name: "System 777",
    desc: "Bot avanzado para Discord con moderación, música, economía, niveles, protección anti-raid y 91+ comandos.",
    color: "#5865F2",
    github: "https://github.com/Yzzz777/system-777",
    web: "https://jrsystem7777.com",
    status: "Activo",
    tech: ["Node.js", "Discord.js", "PostgreSQL"],
  },
  {
    name: "Dashboard",
    desc: "Panel de administración web con gestión de servidores, usuarios, analytics y control del bot.",
    color: "#7C3AED",
    github: "https://github.com/Yzzz777/system777",
    web: "https://12e022de.system777.pages.dev",
    status: "Activo",
    tech: ["Next.js", "Cloudflare", "Neon"],
  },
  {
    name: "Portfolio Web",
    desc: "Este sitio web. Portafolio personal con blog, biblioteca y sistema de archivos.",
    color: "#00FF88",
    github: "https://github.com/Yzzz777/system777",
    web: "https://jrsystem7777.com",
    status: "Activo",
    tech: ["Next.js", "Tailwind", "Framer Motion"],
  },
];

const botFeatures = [
  { icon: Shield, name: "Moderación", desc: "Ban, kick, warn, timeout, AutoMod.", color: "#00FF88" },
  { icon: Zap, name: "Protección", desc: "Anti-raid, anti-nuke, whitelist.", color: "#FFD93D" },
  { icon: Terminal, name: "Terminal VPS", desc: "Control del servidor desde Discord.", color: "#00C8FF" },
  { icon: Brain, name: "JARVIS AI", desc: "IA con LLaMA 3.3 70B vía Groq.", color: "#7C3AED" },
  { icon: Music, name: "Música", desc: "YouTube, Spotify, cola.", color: "#EB459E" },
  { icon: Activity, name: "Economía", desc: "Monedas, banco, daily, slots.", color: "#F38020" },
  { icon: Star, name: "Niveles", desc: "XP, rewards, leaderboard.", color: "#5865F2" },
  { icon: Rocket, name: "Premium", desc: "Planes normal, pro, max.", color: "#00FF88" },
];

const recentPosts = [
  { title: "Next.js 15 nuevas características", category: "Framework", date: "2024-01-15" },
  { title: "Roadmap ético hacking 2025", category: "Ciberseguridad", date: "2024-02-10" },
  { title: "Mejores prácticas cybersecurity 2025", category: "Seguridad", date: "2024-03-05" },
];

const announcements = [
  { title: "System 777 — Nuevos 9 sistemas de whitelist", type: "success", content: "Granular whitelist añadida." },
  { title: "Nuevo plan Pro disponible", type: "info", content: "Recursos ilimitados y mentoría." },
  { title: "Parche de seguridad crítico", type: "warning", content: "Actualización urgente aplicada." },
];

/* ===================== MAIN ===================== */
export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div className="relative">
      {/* Background layers */}
      <div className="grid-bg" />
      <Particles />

      {/* Dynamic glow following mouse */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(0,255,136,0.06), transparent 60%)`,
        }}
      />

      <div className="relative z-10">
        {/* =================== HERO =================== */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated orbs */}
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 8, repeat: Infinity }} className="absolute left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-[#00FF88]/10 blur-[150px]" />
          <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.25, 0.1] }} transition={{ duration: 10, repeat: Infinity, delay: 3 }} className="absolute right-[10%] bottom-[20%] h-[400px] w-[400px] rounded-full bg-[#5865F2]/10 blur-[130px]" />
          <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.2, 0.08] }} transition={{ duration: 12, repeat: Infinity, delay: 1 }} className="absolute left-[50%] top-[60%] h-[300px] w-[300px] rounded-full bg-[#7C3AED]/10 blur-[120px]" />

          <div className="relative mx-auto max-w-6xl px-4 py-20 text-center">
            {/* Banner GIF */}
            <FadeIn>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative mx-auto mb-8 max-w-2xl"
              >
                <div className="relative w-full h-48 sm:h-64 rounded-3xl overflow-hidden border border-white/5">
                  <Image src="/banner.gif" alt="Banner" fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/60 via-transparent to-[#050508]/60" />

                  {/* Profile avatar overlapping banner */}
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full border-4 border-[#050508] overflow-hidden avatar-glow">
                        <Image src="/profile.png" alt="Ángel" width={96} height={96} className="h-full w-full object-cover" />
                      </div>
                      <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-[#050508] bg-[#00FF88] status-online" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </FadeIn>

            {/* Name + Username */}
            <FadeIn delay={0.2}>
              <div className="mt-16">
                <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl">
                  Ángel
                </h1>
                <div className="mt-2 flex items-center justify-center gap-3">
                  <span className="holographic rounded-full px-4 py-1 text-sm font-bold text-black">Yzzz 777</span>
                  <span className="flex items-center gap-1.5 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/5 px-3 py-1 text-xs text-[#00FF88]">
                    <span className="h-2 w-2 rounded-full bg-[#00FF88] status-online" />
                    Online
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* Bio */}
            <FadeIn delay={0.3}>
              <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400 leading-relaxed">
                Programación, ciberseguridad, Linux, automatización y bots de Discord.
                <br />
                <span className="text-gray-500">Más de 3 años aprendiendo y construyendo.</span>
              </p>
            </FadeIn>

            {/* Social buttons */}
            <FadeIn delay={0.4}>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                  >
                    <s.icon className="h-4 w-4" />
                    {s.name}
                    <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </FadeIn>

            {/* Counter */}
            <FadeIn delay={0.5}>
              <div className="mt-12">
                <StudyTimeCounter startDate={studyStartDate} />
              </div>
            </FadeIn>

            {/* Scroll indicator */}
            <FadeIn delay={0.8}>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="mt-16">
                <ChevronRight className="mx-auto h-6 w-6 rotate-90 text-gray-600" />
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
                    Soy <span className="text-white font-semibold">Ángel</span>, conocido como <span className="gradient-text font-semibold">Yzzz 777</span>. Llevo aproximadamente 3 años estudiando programación y ciberseguridad de forma autodidacta y práctica.
                  </p>
                  <p>
                    Mis intereses incluyen programación, desarrollo web, Linux, ciberseguridad, automatización, bots de Discord, APIs, sistemas y bases de datos. No invento experiencia profesional — todo lo que muestro es lo que realmente sé y he construido.
                  </p>
                  <p>
                    Mi proyecto principal es <span className="text-[#5865F2] font-semibold">System 777</span>, un bot avanzado para Discord con moderación, música, economía, niveles y protección. También administro este sitio y un panel de administración completo.
                  </p>
                </div>
              </TiltCard>
            </FadeInUp>
          </div>
        </section>

        {/* =================== TECNOLOGÍAS =================== */}
        <section className="py-24 relative">
          <div className="mx-auto max-w-7xl px-4">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/5 px-4 py-1.5 text-xs text-[#00FF88] mb-4">
                  <Code className="h-3 w-3" /> Stack
                </span>
                <h2 className="text-4xl font-bold text-white sm:text-5xl">Tecnologías</h2>
                <p className="mx-auto mt-4 max-w-xl text-gray-400">Tecnologías que domino y estudio</p>
              </div>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {techData.map((t) => (
                <StaggerItem key={t.name}>
                  <TiltCard className="tech-badge glass glass-hover rounded-xl p-4 text-center cursor-default">
                    <div
                      className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-lg text-xs font-bold"
                      style={{ backgroundColor: t.color + "18", color: t.color }}
                    >
                      {t.icon}
                    </div>
                    <h3 className="text-xs font-semibold text-white">{t.name}</h3>
                    <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${t.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: t.color }}
                      />
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
                <p className="mx-auto mt-4 max-w-xl text-gray-400">Áreas de conocimiento en seguridad informática</p>
              </div>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {cyberAreas.map((area) => (
                <StaggerItem key={area.name}>
                  <TiltCard className="glass glass-hover rounded-xl p-5 cursor-default">
                    <area.icon className="mb-3 h-5 w-5 text-[#00C8FF]" />
                    <h3 className="text-sm font-semibold text-white">{area.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">{area.desc}</p>
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
              </div>
            </FadeIn>
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <StaggerItem key={p.name}>
                  <TiltCard className="glass glass-hover rounded-2xl overflow-hidden h-full">
                    {/* Color bar top */}
                    <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${p.color}, transparent)` }} />
                    <div className="p-7">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-white">{p.name}</h3>
                        <span className="shrink-0 rounded-full bg-[#00FF88]/10 px-3 py-1 text-xs font-medium text-[#00FF88]">{p.status}</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">{p.desc}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
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
                <p className="mx-auto mt-4 max-w-2xl text-gray-400">El bot definitivo para Discord. Moderación, música, economía y protección.</p>
              </div>
            </FadeIn>

            {/* Live Status */}
            <FadeIn delay={0.1}>
              <div className="mx-auto max-w-lg mb-12">
                <DiscordStatus />
              </div>
            </FadeIn>

            {/* Features grid */}
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {botFeatures.map((f) => (
                <StaggerItem key={f.name}>
                  <TiltCard className="glass glass-hover rounded-xl p-5 cursor-default">
                    <f.icon className="mb-3 h-5 w-5" style={{ color: f.color }} />
                    <h3 className="text-sm font-semibold text-white">{f.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">{f.desc}</p>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* CTA */}
            <FadeIn delay={0.3}>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://discord.com/oauth2/authorize?client_id=1502804306125132057&permissions=8&integration_type=0&scope=applications.commands+bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-xl bg-[#5865F2] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4752c4] hover:shadow-[0_0_30px_rgba(88,101,242,0.3)]"
                >
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
                    <p className="mt-1 text-sm text-gray-500">{post.date}</p>
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
                    <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${a.type === "success" ? "bg-[#00FF88]" : a.type === "warning" ? "bg-[#FFD93D]" : "bg-[#00C8FF]"}`} />
                    <div>
                      <h3 className="font-semibold text-white text-sm">{a.title}</h3>
                      <p className="mt-0.5 text-xs text-gray-400">{a.content}</p>
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
                </div>
                <Link href="/library" className="flex items-center gap-1 text-sm font-medium text-[#00FF88] hover:underline">
                  Ver todo <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </FadeIn>
            <div className="glass glass-hover rounded-2xl p-16 text-center glow-line">
              <Download className="mx-auto mb-4 h-12 w-12 text-gray-700" />
              <p className="text-gray-400 font-medium">Próximamente</p>
              <p className="text-sm text-gray-600 mt-1">Documentos, archivos y recursos descargables</p>
            </div>
          </div>
        </section>

        {/* =================== CONTACTO =================== */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00FF88]/[0.02] to-transparent" />
          <div className="relative mx-auto max-w-4xl px-4">
            <FadeInUp>
              <TiltCard className="glass glass-hover rounded-3xl p-12 text-center">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">Contacto</h2>
                <p className="mx-auto mt-4 max-w-xl text-gray-400">¿Quieres hablar? Encuéntrame en mis redes o escríbeme.</p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="https://discord.gg/system777" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 rounded-xl bg-[#5865F2] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4752c4] hover:shadow-[0_0_30px_rgba(88,101,242,0.3)]">
                    <MessageSquare className="h-4 w-4" /> Discord
                  </a>
                  <a href="https://github.com/Yzzz777" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/5">
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                  <a href="https://www.instagram.com/yzz.yzx?igsi=ZndvczI3bnZncWtj&utm_source=qr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/5">
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
