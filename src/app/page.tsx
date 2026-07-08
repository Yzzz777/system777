"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code, Shield, Terminal, MessageSquare, Cloud, Database,
  ArrowRight, Users, BookOpen, Award, Zap, Globe,
  ChevronRight, Star, Play, Cpu, Layers, Rocket, Server,
  Bot as BotIcon, Music, Coins, BarChart3, Lock
} from "lucide-react";
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem, HoverScale, GlowPulse, FloatingElement } from "@/components/ui/Animations";

const features = [
  { icon: Code, title: "Programación", desc: "HTML, CSS, JS, React, Next.js, Python, Java y más de 20 lenguajes y frameworks.", color: "#00FF88" },
  { icon: Shield, title: "Ciberseguridad", desc: "Hacking ético, pruebas de penetración, forensics, análisis SOC y operaciones Red/Blue.", color: "#00C8FF" },
  { icon: Terminal, title: "Linux y DevOps", desc: "Administración de Linux, gestión de servidores, Docker, Kubernetes, CI/CD.", color: "#7C3AED" },
  { icon: MessageSquare, title: "Desarrollo Discord", desc: "Crea bots con Discord.js/Py, tickets, verificación, economía y sistemas de música.", color: "#FF6B6B" },
  { icon: Cloud, title: "Cloud Computing", desc: "AWS, Azure, GCP, Cloudflare, arquitecturas serverless y despliegue en la nube.", color: "#FFD93D" },
  { icon: Database, title: "Bases de Datos", desc: "PostgreSQL, MySQL, MongoDB, Redis, diseño, optimización y escalabilidad.", color: "#FF8C42" },
];

const academies = [
  { name: "Academia de Programación", courses: 85, icon: Code, color: "#00FF88", slug: "programming" },
  { name: "Academia de Ciberseguridad", courses: 45, icon: Shield, color: "#00C8FF", slug: "cybersecurity" },
  { name: "Academia Discord Dev", courses: 30, icon: MessageSquare, color: "#7C3AED", slug: "discord" },
  { name: "Academia Linux", courses: 35, icon: Terminal, color: "#FF6B6B", slug: "linux" },
  { name: "Academia Cloud", courses: 25, icon: Cloud, color: "#FFD93D", slug: "cloud" },
  { name: "Academia de Bases de Datos", courses: 20, icon: Database, color: "#FF8C42", slug: "databases" },
];

const plans = [
  { name: "Gratis", price: "$0", period: "/para siempre", features: ["Acceso a cursos básicos", "Foros de comunidad", "5 recursos/mes", "Certificación básica"], cta: "Empezar Gratis", popular: false },
  { name: "Starter", price: "$9.99", period: "/mes", features: ["Todo lo del plan Gratis", "20+ cursos premium", "50 recursos/mes", "Certificación Starter", "Soporte por email"], cta: "Obtener Starter", popular: false },
  { name: "Pro", price: "$29.99", period: "/mes", features: ["Todo lo del Starter", "Todos los cursos premium", "Recursos ilimitados", "Certificación Pro", "Sesiones de mentoría", "Soporte prioritario", "Rol en Discord"], cta: "Ser Pro", popular: true },
  { name: "Enterprise", price: "$99.99", period: "/mes", features: ["Todo lo del Pro", "Rutas de aprendizaje personalizadas", "Gestión de equipos", "Acceso API", "Soporte dedicado", "Branding personalizado", "Dashboard analítico"], cta: "Contactar", popular: false },
];

const testimonials = [
  { name: "Alex Rodriguez", role: "Desarrollador Full Stack", text: "SYSTEM 777 transformó mi carrera. Los cursos de ciberseguridad son de nivel mundial.", avatar: "AR" },
  { name: "María Santos", role: "Ingeniera DevOps", text: "El contenido de Linux y DevOps es increíblemente práctico. Conseguí mi trabajo soñado!", avatar: "MS" },
  { name: "Carlos Méndez", role: "Desarrollador de Bots Discord", text: "Los mejores recursos de desarrollo Discord que existen. Construí 5 bots después de los cursos.", avatar: "CM" },
];

const stats = [
  { icon: Users, value: "10,000+", label: "Estudiantes Activos", color: "#00FF88" },
  { icon: BookOpen, value: "250+", label: "Cursos", color: "#00C8FF" },
  { icon: Award, value: "500+", label: "Recursos", color: "#7C3AED" },
  { icon: Globe, value: "50+", label: "Países", color: "#FFD93D" },
];

const techIcons = [
  { icon: Code, label: "JavaScript", color: "#F7DF1E" },
  { icon: Cpu, label: "Python", color: "#3776AB" },
  { icon: Shield, label: "Ciberseguridad", color: "#00C8FF" },
  { icon: Terminal, label: "Linux", color: "#FCC624" },
  { icon: Layers, label: "React", color: "#61DAFB" },
  { icon: Server, label: "Node.js", color: "#339933" },
  { icon: Database, label: "SQL", color: "#FF8C42" },
  { icon: Cloud, label: "AWS", color: "#FF9900" },
  { icon: MessageSquare, label: "Discord.js", color: "#7C3AED" },
  { icon: Rocket, label: "Next.js", color: "#FFFFFF" },
];

export default function HomePage() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {techIcons.map((tech) => (
          <FloatingElement key={tech.label} className="absolute opacity-5">
            <tech.icon style={{ color: tech.color }} className="h-8 w-8" />
          </FloatingElement>
        ))}
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00FF88]/5 via-transparent to-transparent" />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#00FF88]/5 blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} className="absolute right-0 top-1/2 h-[400px] w-[400px] rounded-full bg-[#00C8FF]/5 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-32 text-center sm:py-40">
          <FadeIn>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/5 px-4 py-1.5 text-sm text-[#00FF88]">
              <Zap className="h-3 w-3" />
              <span>Academia Tecnológica Profesional</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Domina la{" "}
              <span className="bg-gradient-to-r from-[#00FF88] to-[#00C8FF] bg-clip-text text-transparent">Programación</span>,{" "}
              <span className="text-[#00C8FF]">Ciberseguridad</span>,{" "}
              <span className="text-[#7C3AED]">Linux</span>{" "}
              y Desarrollo Discord
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
              Aprende programación, ciberseguridad, administración de Linux, desarrollo Discord, redes y tecnologías cloud a través de proyectos prácticos, cursos premium y una comunidad activa.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/courses" className="group flex items-center gap-2 rounded-xl bg-[#00FF88] px-8 py-3.5 text-sm font-semibold text-black transition-all hover:bg-[#00CC6A] hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]">
                Explorar Cursos <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/community" className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-[#00FF88]/30 hover:bg-white/5">
                Unirse a la Comunidad
              </Link>
              <Link href="/profiles" className="flex items-center gap-2 rounded-xl border border-[#00C8FF]/20 bg-[#00C8FF]/5 px-8 py-3.5 text-sm font-semibold text-[#00C8FF] transition-all hover:bg-[#00C8FF]/10">
                <Globe className="h-4 w-4" /> Conoce las Leyendas
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4">
              {stats.map((m, i) => (
                <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="text-center">
                  <m.icon className="mx-auto mb-2 h-5 w-5" style={{ color: m.color }} />
                  <div className="text-2xl font-bold text-white">{m.value}</div>
                  <div className="text-sm text-gray-500">{m.label}</div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Tech Marquee */}
      <section className="py-12 border-y border-white/5 overflow-hidden">
        <div className="flex gap-12 animate-marquee">
          {[...techIcons, ...techIcons, ...techIcons].map((tech, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0 opacity-40 hover:opacity-100 transition-opacity">
              <tech.icon style={{ color: tech.color }} className="h-5 w-5" />
              <span className="text-sm text-gray-400 whitespace-nowrap">{tech.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Lo Que Dominarás</h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-400">Currículum completo cubriendo las habilidades tech más demandadas</p>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <HoverScale>
                  <div className="glass rounded-2xl p-6 h-full">
                    <motion.div whileHover={{ rotate: 5 }} className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: f.color + "15" }}>
                      <f.icon className="h-6 w-6" style={{ color: f.color }} />
                    </motion.div>
                    <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
                    <p className="mt-2 text-sm text-gray-400">{f.desc}</p>
                    <Link href="/courses" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#00FF88] hover:underline">
                      Saber Más <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Bot Showcase */}
      <section className="py-24 bg-gradient-to-b from-transparent via-[#5865F2]/[0.02] to-transparent">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#5865F2]/20 bg-[#5865F2]/5 px-4 py-1.5 text-sm text-[#5865F2]">
                <BotIcon className="h-3 w-3" />
                <span>Discord Bot</span>
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">System 777 Bot</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-400">El bot definitivo para Discord. Moderación, música, economía, niveles y protección en un solo bot profesional.</p>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, title: "Moderación", desc: "Ban, kick, warn, timeout y más.", color: "#5865F2" },
              { icon: Lock, title: "Protección", desc: "Anti-raid, anti-nuke, automod.", color: "#7C3AED" },
              { icon: Music, title: "Música", desc: "YouTube, Spotify, cola y controles.", color: "#EB459E" },
              { icon: Coins, title: "Economía", desc: "Monedas, banco, daily, slots.", color: "#FEE75C" },
            ].map((f) => (
              <StaggerItem key={f.title}>
                <HoverScale>
                  <div className="glass rounded-2xl p-6 h-full">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: f.color + "15" }}>
                      <f.icon className="h-6 w-6" style={{ color: f.color }} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
                    <p className="mt-2 text-sm text-gray-400">{f.desc}</p>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <FadeIn delay={0.2}>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/bot" className="group flex items-center gap-2 rounded-xl bg-[#5865F2] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4752c4] hover:shadow-[0_0_30px_rgba(88,101,242,0.3)]">
                Explorar Bot <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_BOT_CLIENT_ID ?? "1502804306125132057"}&permissions=8&integration_type=0&scope=applications.commands+bot`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-[#5865F2]/30 hover:bg-white/5"
              >
                <BotIcon className="h-4 w-4" /> Añadir al Servidor
              </a>
              <Link href="/bot/dashboard" className="flex items-center gap-2 rounded-xl border border-[#7C3AED]/20 bg-[#7C3AED]/5 px-8 py-3.5 text-sm font-semibold text-[#7C3AED] transition-all hover:bg-[#7C3AED]/10">
                <BarChart3 className="h-4 w-4" /> Dashboard
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Academies */}
      <section className="py-24 bg-gradient-to-b from-transparent via-[#00FF88]/[0.02] to-transparent">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Nuestras Academias</h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-400">Academias especializadas para cada camino tech</p>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {academies.map((a) => (
              <StaggerItem key={a.slug}>
                <HoverScale>
                  <Link href={`/academy/${a.slug}`} className="glass rounded-2xl p-6 block">
                    <div className="flex items-center justify-between">
                      <motion.div whileHover={{ scale: 1.1 }} className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: a.color + "15" }}>
                        <a.icon className="h-6 w-6" style={{ color: a.color }} />
                      </motion.div>
                      <span className="text-sm text-gray-500">{a.courses} cursos</span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">{a.name}</h3>
                    <div className="mt-4 flex items-center gap-1 text-sm text-[#00FF88]">
                      Explorar <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Elige Tu Plan</h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-400">Empieza gratis, mejora cuando estés listo</p>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((p) => (
              <StaggerItem key={p.name}>
                <HoverScale>
                  <div className={`glass rounded-2xl p-6 h-full flex flex-col ${p.popular ? "border-[#00FF88]/30" : ""}`}>
                    {p.popular && (
                      <GlowPulse className="rounded-2xl">
                        <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-[#00FF88]/10 px-3 py-1 text-xs font-medium text-[#00FF88]">
                          <Star className="h-3 w-3" /> Más Popular
                        </div>
                      </GlowPulse>
                    )}
                    <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-white">{p.price}</span>
                      <span className="text-sm text-gray-500">{p.period}</span>
                    </div>
                    <ul className="mt-6 space-y-3 flex-1">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                          <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-[#00FF88]" />{f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/register" className={`mt-6 block rounded-xl py-2.5 text-center text-sm font-semibold transition-all ${p.popular ? "bg-[#00FF88] text-black hover:bg-[#00CC6A]" : "border border-white/10 text-white hover:bg-white/5"}`}>
                      {p.cta}
                    </Link>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-transparent via-[#00C8FF]/[0.02] to-transparent">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Lo Que Dicen Nuestros Estudiantes</h2>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <HoverScale>
                  <div className="glass rounded-2xl p-6 h-full">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00FF88]/10 text-sm font-bold text-[#00FF88]">{t.avatar}</div>
                      <div>
                        <div className="text-sm font-semibold text-white">{t.name}</div>
                        <div className="text-xs text-gray-500">{t.role}</div>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-400">&quot;{t.text}&quot;</p>
                    <div className="mt-3 flex gap-0.5">
                      {[1,2,3,4,5].map((i) => <Star key={i} className="h-3 w-3 fill-[#FFD93D] text-[#FFD93D]" />)}
                    </div>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4">
          <FadeInUp>
            <GlowPulse className="rounded-3xl">
              <div className="glass rounded-3xl p-12 text-center">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">¿Listo para Empezar Tu Viaje Tech?</h2>
                <p className="mx-auto mt-4 max-w-xl text-gray-400">Únete a más de 10,000 estudiantes aprendiendo las habilidades que importan. Empieza gratis hoy.</p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link href="/register" className="group flex items-center gap-2 rounded-xl bg-[#00FF88] px-8 py-3.5 text-sm font-semibold text-black transition-all hover:bg-[#00CC6A]">
                    Empezar Gratis <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href="/courses" className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/5">
                    <Play className="h-4 w-4" /> Ver Cursos
                  </Link>
                </div>
              </div>
            </GlowPulse>
          </FadeInUp>
        </div>
      </section>
    </>
  );
}
