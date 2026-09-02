"use client";

import Link from "next/link";
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
  BookOpen,
  FileText,
  Bell,
  Download,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  FadeIn,
  FadeInUp,
  StaggerContainer,
  StaggerItem,
  HoverScale,
} from "@/components/ui/Animations";
import StudyTimeCounter from "@/components/StudyTimeCounter";

const studyStartDate = new Date("2023-01-01");

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

const features = [
  { icon: Code, title: "Programación", desc: "HTML, CSS, JS, React, Next.js, Python, Java y más de 20 lenguajes y frameworks.", color: "#00FF88" },
  { icon: Shield, title: "Ciberseguridad", desc: "Hacking ético, pruebas de penetración, forensics, análisis SOC y operaciones Red/Blue.", color: "#00C8FF" },
  { icon: Terminal, title: "Linux y DevOps", desc: "Administración de Linux, gestión de servidores, Docker, Kubernetes, CI/CD.", color: "#7C3AED" },
];

const techData = [
  { name: "JavaScript", icon: "JS", color: "#F7DF1E" },
  { name: "TypeScript", icon: "TS", color: "#3178C6" },
  { name: "Python", icon: "Py", color: "#3776AB" },
  { name: "React", icon: "Re", color: "#61DAFB" },
  { name: "Next.js", icon: "Nx", color: "#FFFFFF" },
  { name: "Node.js", icon: "No", color: "#339933" },
  { name: "HTML", icon: "H5", color: "#E34F26" },
  { name: "CSS", icon: "CS", color: "#1572B6" },
  { name: "SQL", icon: "SQ", color: "#FF8C42" },
  { name: "C", icon: "C", color: "#A8B9CC" },
  { name: "C++", icon: "C+", color: "#00599C" },
  { name: "C#", icon: "C#", color: "#239120" },
  { name: "Linux", icon: "Li", color: "#FCC624" },
  { name: "Docker", icon: "Dk", color: "#2496ED" },
  { name: "Git", icon: "Gi", color: "#F05032" },
  { name: "Cloudflare", icon: "CF", color: "#F38020" },
];

const cyberAreas = [
  "Seguridad Web", "Análisis de Vulnerabilidades", "Seguridad APIs", "Autenticación",
  "OSINT Defensivo", "Hardening", "Redes Seguras", "Automatización",
  "Anti-Raid", "Moderación", "Forensics", "SOC Operations",
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
    name: "Dashboard System 777",
    desc: "Panel de administración web con gestión de servidores, usuarios, analytics y control del bot en tiempo real.",
    color: "#7C3AED",
    github: "https://github.com/Yzzz777/system777",
    web: "https://12e022de.system777.pages.dev",
    status: "Activo",
    tech: ["Next.js", "Cloudflare Pages", "Neon"],
  },
];

const botStats = [
  { label: "Comandos", value: "91+" },
  { label: "Servidores", value: "21" },
  { label: "Usuarios", value: "4,622" },
  { label: "Sistemas", value: "12" },
];

const botFeatures = [
  { icon: Shield, name: "Moderación", desc: "Ban, kick, warn, timeout, AutoMod y más." },
  { icon: Zap, name: "Protección", desc: "Anti-raid, anti-nuke, anti-spam, whitelist." },
  { icon: Terminal, name: "Terminal VPS", desc: "Control directo del servidor desde Discord." },
  { icon: BotIcon, name: "JARVIS AI", desc: "Asistente IA con LLaMA 3.3 70B vía Groq." },
];

const recentPosts = [
  { title: "Next.js 15 nuevas características", category: "Framework", date: "2024-01-15" },
  { title: "Roadmap ético hacking 2025", category: "Ciberseguridad", date: "2024-02-10" },
  { title: "Ciberseguridad mejores prácticas 2025", category: "Ciberseguridad", date: "2024-03-05" },
];

const announcements = [
  { title: "Nueva actualización del bot System 777", type: "success", content: "Se han añadido 9 sistemas de whitelist granular." },
  { title: "Nuevo plan Pro disponible", type: "info", content: "Recursos ilimitados y sesiones de mentoría incluidas." },
  { title: "Parche de seguridad crítico", type: "warning", content: "Actualización urgente de seguridad aplicada." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00FF88]/5 via-transparent to-transparent" />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#00FF88]/5 blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute right-0 top-1/2 h-[400px] w-[400px] rounded-full bg-[#00C8FF]/5 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:py-32">
          <FadeIn>
            <div className="mb-8 inline-flex items-center justify-center">
              <div className="h-28 w-28 rounded-full border-4 border-[#00FF88]/30 bg-[#121212] flex items-center justify-center text-4xl font-bold text-[#00FF88] shadow-[0_0_40px_rgba(0,255,136,0.15)]">
                A
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-[#00FF88] to-[#00C8FF] bg-clip-text text-transparent">Ángel</span>
              <span className="text-gray-500 text-2xl sm:text-3xl ml-4">Yzzz 777</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
              Programación, ciberseguridad, Linux, automatización y bots de Discord. Más de 3 años aprendiendo y construyendo.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                  {s.name}
                  <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-12 flex flex-col items-center gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">Llevo aprendiendo</p>
                <StudyTimeCounter startDate={studyStartDate} />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Sobre mí */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4">
          <FadeInUp>
            <div className="glass rounded-3xl p-10 sm:p-12">
              <h2 className="text-3xl font-bold text-white mb-6">Sobre mí</h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Soy <span className="text-white font-semibold">Ángel</span>, conocido como <span className="text-[#00FF88] font-semibold">Yzzz 777</span>. Llevo aproximadamente 3 años estudiando programación y ciberseguridad de forma autodidacta y práctica.
                </p>
                <p>
                  Mis intereses incluyen programación, desarrollo web, Linux, ciberseguridad, automatización, bots de Discord, APIs, sistemas y bases de datos. No invento experiencia profesional ni certificaciones — todo lo que muestro es lo que realmente sé y he construido.
                </p>
                <p>
                  Mi proyecto principal es <span className="text-[#5865F2] font-semibold">System 777</span>, un bot avanzado para Discord con moderación, música, economía, niveles y protección. También administro este sitio web y un panel de administración completo.
                </p>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Tecnologías */}
      <section className="py-24 bg-gradient-to-b from-transparent via-[#00FF88]/[0.02] to-transparent">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Tecnologías</h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-400">Tecnologías que estudio y conozco</p>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {techData.map((t) => (
              <StaggerItem key={t.name}>
                <HoverScale>
                  <div className="glass rounded-xl p-5 text-center">
                    <div
                      className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold"
                      style={{ backgroundColor: t.color + "15", color: t.color }}
                    >
                      {t.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-white">{t.name}</h3>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Ciberseguridad */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Cybersecurity</h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-400">Áreas de conocimiento e interés en seguridad informática</p>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {cyberAreas.map((area) => (
              <StaggerItem key={area}>
                <HoverScale>
                  <div className="glass rounded-xl p-5 text-center">
                    <Shield className="mx-auto mb-3 h-6 w-6 text-[#00C8FF]" />
                    <h3 className="text-sm font-semibold text-white">{area}</h3>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features / Intereses */}
      <section className="py-24 bg-gradient-to-b from-transparent via-[#7C3AED]/[0.02] to-transparent">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Intereses</h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-400">Áreas en las que enfoco mi aprendizaje</p>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <HoverScale>
                  <div className="glass rounded-2xl p-8 text-center">
                    <div
                      className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: f.color + "15" }}
                    >
                      <f.icon className="h-7 w-7" style={{ color: f.color }} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                    <p className="mt-2 text-sm text-gray-400">{f.desc}</p>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Proyectos */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Mis Proyectos</h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-400">Proyectos que he construido y mantengo</p>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-16 grid gap-8 sm:grid-cols-2">
            {projects.map((p) => (
              <StaggerItem key={p.name}>
                <HoverScale>
                  <div className="glass rounded-2xl p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{p.name}</h3>
                        <p className="mt-2 text-sm text-gray-400">{p.desc}</p>
                      </div>
                      <span className="shrink-0 ml-4 rounded-full bg-[#00FF88]/10 px-3 py-1 text-xs font-medium text-[#00FF88]">{p.status}</span>
                    </div>
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
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* System 777 */}
      <section className="py-24 bg-gradient-to-b from-transparent via-[#5865F2]/[0.03] to-transparent">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#5865F2]/20 bg-[#5865F2]/5 px-4 py-1.5 text-sm text-[#5865F2]">
                <BotIcon className="h-3 w-3" /> Discord Bot
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">System 777</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-400">El bot definitivo para Discord. Moderación, música, economía, niveles y protección en un solo bot profesional.</p>
            </div>
          </FadeIn>

          <StaggerContainer className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {botStats.map((s) => (
              <StaggerItem key={s.label}>
                <div className="glass rounded-2xl p-6 text-center">
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-sm text-gray-400 mt-1">{s.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <StaggerContainer className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {botFeatures.map((f) => (
              <StaggerItem key={f.name}>
                <div className="glass rounded-2xl p-6">
                  <f.icon className="mb-3 h-6 w-6 text-[#5865F2]" />
                  <h3 className="font-semibold text-white">{f.name}</h3>
                  <p className="mt-1 text-sm text-gray-400">{f.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.2}>
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

      {/* Blog Preview */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">Blog</h2>
                <p className="mt-2 text-gray-400">Noticias, tutoriales y artículos</p>
              </div>
              <Link href="/blog" className="flex items-center gap-1 text-sm font-medium text-[#00FF88] hover:underline">
                Ver todo <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <StaggerItem key={post.title}>
                <HoverScale>
                  <div className="glass rounded-2xl p-6">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{post.category}</span>
                    <h3 className="mt-2 text-lg font-semibold text-white">{post.title}</h3>
                    <p className="mt-1 text-sm text-gray-400">{post.date}</p>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Anuncios */}
      <section className="py-24 bg-gradient-to-b from-transparent via-[#FFD93D]/[0.02] to-transparent">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">Anuncios</h2>
                <p className="mt-2 text-gray-400">Avisos importantes y actualizaciones</p>
              </div>
              <Link href="/announcements" className="flex items-center gap-1 text-sm font-medium text-[#00FF88] hover:underline">
                Ver todos <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
          <StaggerContainer className="space-y-4">
            {announcements.map((a) => (
              <StaggerItem key={a.title}>
                <div className="glass rounded-2xl p-6 flex items-start gap-4">
                  <Bell className="mt-1 h-5 w-5 shrink-0 text-[#FFD93D]" />
                  <div>
                    <h3 className="font-semibold text-white">{a.title}</h3>
                    <p className="mt-1 text-sm text-gray-400">{a.content}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Biblioteca Preview */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">Biblioteca</h2>
                <p className="mt-2 text-gray-400">Archivos, documentos y recursos descargables</p>
              </div>
              <Link href="/library" className="flex items-center gap-1 text-sm font-medium text-[#00FF88] hover:underline">
                Ver todo <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
          <div className="glass rounded-2xl p-12 text-center">
            <Download className="mx-auto mb-4 h-10 w-10 text-gray-600" />
            <p className="text-gray-400">Próximamente disponible</p>
          </div>
        </div>
      </section>

      {/* CTA / Contacto */}
      <section className="py-24 bg-gradient-to-b from-transparent via-[#00FF88]/[0.02] to-transparent">
        <div className="mx-auto max-w-4xl px-4">
          <FadeInUp>
            <div className="glass rounded-3xl p-12 text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Contacto</h2>
              <p className="mx-auto mt-4 max-w-xl text-gray-400">¿Quieres hablar? Puedes encontrarme en mis redes sociales o escribirme directo.</p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="https://discord.gg/system777" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 rounded-xl bg-[#5865F2] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4752c4]">
                  <MessageSquare className="h-4 w-4" /> Discord
                </a>
                <a href="https://github.com/Yzzz777" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/5">
                  <Github className="h-4 w-4" /> GitHub
                </a>
                <a href="https://www.instagram.com/yzz.yzx?igsi=ZndvczI3bnZncWtj&utm_source=qr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/5">
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>
    </>
  );
}
