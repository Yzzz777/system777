"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield, Music, Coins, BarChart3, Ticket,
  ArrowRight, Globe,
  MessageSquare, Lock, Gamepad2, Bot as BotIcon,
} from "lucide-react";
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem, HoverScale, GlowPulse } from "@/components/ui/Animations";

const BOT_CLIENT_ID = process.env.NEXT_PUBLIC_BOT_CLIENT_ID ?? "1502804306125132057";
const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${BOT_CLIENT_ID}&permissions=8&integration_type=0&scope=applications.commands+bot`;

const features = [
  { icon: Shield, title: "Moderación", desc: "Ban, kick, warn, timeout, nuke, slowmode y más. Control total de tu servidor.", color: "#5865F2" },
  { icon: Lock, title: "Protección", desc: "Anti-raid, anti-nuke, automod, anti-phishing y whitelist configurable.", color: "#7C3AED" },
  { icon: Music, title: "Música", desc: "Reproduce música de YouTube, Spotify y más. Cola, controles y volumen.", color: "#EB459E" },
  { icon: Coins, title: "Economía", desc: "Sistema de monedas, banco, daily, work, slots, rob y ranking.", color: "#FEE75C" },
  { icon: BarChart3, title: "Niveles", desc: "XP automático, leaderboard, logros, misiones y perfiles.", color: "#57F287" },
  { icon: Ticket, title: "Tickets", desc: "Sistema de soporte con categorías, transcripts y ratings.", color: "#ED4245" },
  { icon: Gamepad2, title: "Diversión", desc: "Blackjack, ruleta, trivia, ship, memes, polls y más.", color: "#FF6B6B" },
  { icon: MessageSquare, title: "Bienvenida", desc: "Mensajes de bienvenida, autoroles, starboard y custom commands.", color: "#00C8FF" },
  { icon: Globe, title: "Network", desc: "Ping, traceroute, nslookup, port scan, SSL check y web status.", color: "#FF8C42" },
];

const stats = [
  { label: "Comandos", value: "100+", color: "#5865F2" },
  { label: "Sistemas", value: "26", color: "#7C3AED" },
  { label: "Categorías", value: "10", color: "#EB459E" },
  { label: "Servidores", value: "50+", color: "#57F287" },
];

export default function BotHomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5865F2]/5 via-transparent to-transparent" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#5865F2]/5 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute right-0 top-1/2 h-[400px] w-[400px] rounded-full bg-[#7C3AED]/5 blur-[100px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <FadeIn>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#5865F2]/20 bg-[#5865F2]/5 px-4 py-1.5 text-sm text-[#5865F2]">
              <BotIcon className="h-3 w-3" />
              <span>Discord Bot Premium</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">System 777</span>
              <br />
              <span className="text-3xl sm:text-5xl lg:text-6xl">El Bot Definitivo para Discord</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
              Moderación avanzada, música, economía, niveles, tickets y protección anti-raid en un solo bot profesional. 100+ comandos, 26 sistemas, todo lo que tu servidor necesita.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-xl bg-[#5865F2] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4752c4] hover:shadow-[0_0_30px_rgba(88,101,242,0.3)]"
              >
                Añadir al Servidor <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                href="/bot/commands"
                className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-[#5865F2]/30 hover:bg-white/5"
              >
                Ver Comandos
              </Link>
              <Link
                href="/bot/dashboard"
                className="flex items-center gap-2 rounded-xl border border-[#7C3AED]/20 bg-[#7C3AED]/5 px-8 py-3.5 text-sm font-semibold text-[#7C3AED] transition-all hover:bg-[#7C3AED]/10"
              >
                <BarChart3 className="h-4 w-4" /> Dashboard
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4">
              {stats.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-white">{m.value}</div>
                  <div className="text-sm text-gray-500">{m.label}</div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Todo lo que Tu Servidor Necesita</h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-400">100+ comandos organizados en 10 categorías para una gestión completa</p>
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
                <h2 className="text-3xl font-bold text-white sm:text-4xl">¿Listo para Proteger Tu Servidor?</h2>
                <p className="mx-auto mt-4 max-w-xl text-gray-400">Invita a System 777 y obtén moderación, música, economía y protección avanzada al instante.</p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a
                    href={INVITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 rounded-xl bg-[#5865F2] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#4752c4]"
                  >
                    Añadir Gratis <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <Link
                    href="/bot/dashboard"
                    className="flex items-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/5"
                  >
                    Abrir Dashboard
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
