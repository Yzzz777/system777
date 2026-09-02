"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Code, Shield, Terminal, MessageSquare, Cloud, Database,
  ArrowRight, Users, BookOpen, Award, Zap, Globe,
  ChevronRight, Star, Play, Cpu, Layers, Rocket, Server,
  Bot as BotIcon, Music, Coins, BarChart3, Lock
} from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem, HoverScale, GlowPulse } from "@/components/ui/Animations";
import StudyTimeCounter from "@/components/StudyTimeCounter";

const studyStartDate = new Date("2023-01-01");

export default function HomePage() {
  return (
    <>

      <StudyTimeCounter startDate={studyStartDate} />

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
              <StudyTimeCounter startDate={studyStartDate} />
            </div>
          </FadeIn>
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
            <div className="glass rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-white">Programación</h3>
              <p className="text-sm text-gray-400 mt-2">HTML, CSS, JS, React, Next.js, Python, Java y más de 20 lenguajes y frameworks.</p>
              <Link href="/courses" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#00FF88] hover:underline">Saber Más</Link>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-white">Ciberseguridad</h3>
              <p className="text-sm text-gray-400 mt-2">Hacking ético, pruebas de penetración, forensics, análisis SOC y operaciones Red/Blue.</p>
              <Link href="/courses" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#00FF88] hover:underline">Saber Más</Link>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-white">Linux y DevOps</h3>
              <p className="text-sm text-gray-400 mt-2">Administración de Linux, gestión de servidores, Docker, Kubernetes, CI/CD.</p>
              <Link href="/courses" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#00FF88] hover:underline">Saber Más</Link>
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Bot Showcase */}
      <section className="py-24 bg-gradient-to-b from-transparent via-[#5865F2]/[0.02] to-transparent">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#5865F2]/20 bg-[#5865F2]/5 px-4 py-1.5 text-sm text-[#5865F2]">
                <BotIcon className="h-3 w-3" /> Discord Bot
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">System 777 Bot</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-400">El bot definitivo para Discord. Moderación, música, economía, niveles y protección en un solo bot profesional.</p>
            </div>
          </FadeIn>
          <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="glass rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-white">Moderación</h3>
              <p className="text-sm text-gray-400 mt-2">Ban, kick, warn, timeout y más.</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-white">Protección</h3>
              <p className="text-sm text-gray-400 mt-2">Anti-raid, anti-nuke, automod.</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-white">Música</h3>
              <p className="text-sm text-gray-400 mt-2">YouTube, Spotify, cola y controles.</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-white">Economía</h3>
              <p className="text-sm text-gray-400 mt-2">Monedas, banco, daily, slots.</p>
            </div>
          </StaggerContainer>
          <FadeIn delay={0.2}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://discord.com/oauth2/authorize?client_id=1502804306125132057&permissions=8&integration_type=0&scope=applications.commands+bot"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-xl bg-[#5865F2] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4752c4] hover:shadow-[0_0_30px_rgba(88,101,242,0.3)]">
                Explorar Bot <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="https://jrsystem7777.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-[#5865F2]/30 hover:bg-white/5">
                Sitio Web
              </a>
              <a
                href="/bot/dashboard"
                className="flex items-center gap-2 rounded-xl border border-[#7C3AED]/20 bg-[#7C3AED]/5 px-8 py-3.5 text-sm font-semibold text-[#7C3AED] transition-all hover:bg-[#7C3AED]/10">
                <BarChart3 className="h-4 w-4" /> Dashboard
              </a>
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
            <div className="glass rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-white">Academia de Programación</h3>
              <p className="text-sm text-gray-400 mt-2">85 cursos</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-white">Academia de Ciberseguridad</h3>
              <p className="text-sm text-gray-400 mt-2">45 cursos</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-white">Academia Discord Dev</h3>
              <p className="text-sm text-gray-400 mt-2">30 cursos</p>
            </div>
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
            <div className="glass rounded-2xl p-6 flex flex-col border-[\#00FF88]/30">
              <h3 className="text-lg font-semibold text-white">Gratis</h3>
              <span className="text-3xl font-bold text-white">$0</span>
              <span className="text-sm text-gray-500">/para siempre</span>
              <ul className="mt-6 space-y-3 text-sm text-gray-400">
                <li>Acceso a cursos básicos</li>
                <li>Foros de comunidad</li>
                <li>5 recursos/mes</li>
                <li>Certificación básica</li>
              </ul>
              <a href="/register" className="mt-6 block rounded-xl py-2.5 text-center text-sm font-semibold bg-[#00FF88] text-black">Empezar Gratis</a>
            </div>
            <div className="glass rounded-2xl p-6 flex flex-col border-[\#00FF88]/30">
              <h3 className="text-lg font-semibold text-white">Pro</h3>
              <span className="text-3xl font-bold text-white">$29.99</span>
              <span className="text-sm text-gray-500">/mes</span>
              <ul className="mt-6 space-y-3 text-sm text-gray-400">
                <li>Todo lo del Starter</li>
                <li>Todos los cursos premium</li>
                <li>Recursos ilimitados</li>
                <li>Certificación Pro</li>
                <li>Sesiones de mentoría</li>
                <li>Soporte prioritario</li>
                <li>Rol en Discord</li>
              </ul>
              <a href="/register" className="mt-6 block rounded-xl py-2.5 text-center text-sm font-semibold bg-[#00FF88] text-black">Ser Pro</a>
            </div>
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
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="/register" className="group flex items-center gap-2 rounded-xl bg-[#00FF88] px-8 py-3.5 text-sm font-semibold text-black transition-all hover:bg-[#00CC6A]">
                    Empezar Gratis <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <a href="/courses" className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/5">
                    <Play className="h-4 w-4" /> Ver Cursos
                  </a>
                </div>
              </div>
            </GlowPulse>
          </FadeInUp>
        </div>
      </section>
    </>
  );
}