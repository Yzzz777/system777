"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, MessageSquare, Calendar, Flame, ArrowRight, TrendingUp } from "lucide-react";
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem, HoverScale } from "@/components/ui/Animations";

const discussions = [
  { title: "Mejores prácticas para desplegar bots de Discord", author: "BotDev_Pro", replies: 24, category: "Discord", hot: true },
  { title: "Cómo configurar un laboratorio de pruebas de penetración en casa", author: "SecHunter", replies: 31, category: "Ciberseguridad", hot: true },
  { title: "React vs Vue en 2025 - ¿cuál debería aprender?", author: "WebDev101", replies: 18, category: "Programación" },
  { title: "Kubernetes vs Docker Swarm - comparación práctica", author: "CloudNinja", replies: 12, category: "DevOps" },
  { title: "Nuevas funcionalidades del kernel de Linux 6.x", author: "LinuxFan", replies: 15, category: "Linux" },
  { title: "Consejos de bug bounty para principiantes", author: "BugHunter", replies: 42, category: "Ciberseguridad", hot: true },
];

const events = [
  { title: "En Vivo: Construyendo un Bot de Discord desde Cero", date: "25 Jun, 2025", time: "19:00 UTC", attendees: 156, category: "Discord" },
  { title: "Fin de Semana de Desafíos CTF", date: "28-29 Jun, 2025", time: "Todo el Día", attendees: 234, category: "Ciberseguridad" },
  { title: "Sesión de Revisión de Código: Proyectos React", date: "2 Jul, 2025", time: "18:00 UTC", attendees: 89, category: "Programación" },
  { title: "Taller de Administración de Linux", date: "5 Jul, 2025", time: "17:00 UTC", attendees: 112, category: "Linux" },
];

const leaderboard = [
  { rank: 1, name: "CyberNinja_X", points: 15420, badge: "🥇", courses: 42 },
  { rank: 2, name: "CodeMaster_99", points: 12850, badge: "🥈", courses: 38 },
  { rank: 3, name: "LinuxGuru_Pro", points: 11200, badge: "🥉", courses: 35 },
  { rank: 4, name: "DiscordBotKing", points: 9800, courses: 31 },
  { rank: 5, name: "SecResearcher", points: 8950, courses: 29 },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"discussions" | "events" | "leaderboard">("discussions");

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Comunidad</h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">Conecta, aprende y crece con miles de desarrolladores en todo el mundo</p>
          </div>
        </FadeIn>

        <FadeInUp delay={0.1}>
          <div className="mt-8 flex justify-center gap-2">
            {(["discussions", "events", "leaderboard"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-xl px-6 py-3 text-sm font-medium transition-all ${activeTab === tab ? "bg-[#00FF88] text-black" : "border border-white/10 text-gray-400 hover:text-white"}`}>
                {tab === "discussions" ? "Discusiones" : tab === "events" ? "Eventos" : "Clasificación"}
              </button>
            ))}
          </div>
        </FadeInUp>

        {activeTab === "discussions" && (
          <StaggerContainer className="mt-10 space-y-4">
            {discussions.map((d, i) => (
              <StaggerItem key={i}>
                <HoverScale>
                  <div className="glass rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">{d.title}</h3>
                          {d.hot && <span className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-xs text-orange-400"><Flame className="h-3 w-3" /> Popular</span>}
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                          <span>por {d.author}</span>
                          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs">{d.category}</span>
                          <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {d.replies} respuestas</span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-500 shrink-0 mt-1" />
                    </div>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {activeTab === "events" && (
          <StaggerContainer className="mt-10 grid gap-6 sm:grid-cols-2">
            {events.map((e, i) => (
              <StaggerItem key={i}>
                <HoverScale>
                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500"><Calendar className="h-4 w-4" />{e.date} · {e.time}</div>
                    <h3 className="mt-2 text-lg font-semibold text-white">{e.title}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">{e.category}</span>
                      <span className="flex items-center gap-1 text-sm text-gray-400"><Users className="h-3 w-3" /> {e.attendees} asistentes</span>
                    </div>
                    <button className="mt-4 w-full rounded-xl bg-[#00FF88]/10 py-2 text-sm font-medium text-[#00FF88] hover:bg-[#00FF88]/20">Unirse al Evento</button>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {activeTab === "leaderboard" && (
          <StaggerContainer className="mt-10">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="divide-y divide-white/5">
                {leaderboard.map((l) => (
                  <StaggerItem key={l.rank}>
                    <div className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
                      <div className="w-8 text-center text-lg font-bold">{l.badge || `#${l.rank}`}</div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00FF88]/10 text-sm font-bold text-[#00FF88]">{l.name.slice(0, 2).toUpperCase()}</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white">{l.name}</div>
                        <div className="text-xs text-gray-500">{l.courses} cursos completados</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#FFD93D]">{l.points.toLocaleString()} pts</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500"><TrendingUp className="h-3 w-3" /> Activo</div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </div>
          </StaggerContainer>
        )}

        <FadeInUp delay={0.3}>
          <div className="mt-16 glass neon-glow rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white">Únete a la Conversación</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">Más de 10,000 desarrolladores compartiendo conocimiento, resolviendo problemas y construyendo cosas increíbles juntos.</p>
            <Link href="/register" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#00FF88] px-8 py-3.5 text-sm font-semibold text-black transition-all hover:bg-[#00CC6A]">
              Unirse Gratis <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}
