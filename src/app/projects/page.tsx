"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Bot, Globe, Shield, Code2 } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/ui/Animations";

const projects = [
  {
    title: "System 777",
    desc: "Bot de Discord multiproposito con 100+ comandos, moderacion avanzada, musica, economia, niveles, tickets, proteccion anti-raid y dashboard web.",
    tags: ["Node.js", "Discord.js", "Express", "PostgreSQL"],
    color: "#5865F2",
    icon: Bot,
    github: "https://github.com/Yzzz777/system-777",
    live: "https://jrsystem7777.com/bot",
    category: "Bot",
  },
  {
    title: "jrsystem7777.com",
    desc: "Portafolio personal con Next.js 15, Tailwind v4, Neon PostgreSQL. Blog, biblioteca, tecnologias, cybersecurity y dashboard.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Cloudflare"],
    color: "#00FF88",
    icon: Globe,
    github: "https://github.com/Yzzz777/system777",
    live: "https://jrsystem7777.com",
    category: "Web",
  },
  {
    title: "IP Tracker",
    desc: "Sistema de rastreo de IPs integrado en el bot. Captura IP, ubicacion, ISP y user agent. Notificacion DM al owner.",
    tags: ["TypeScript", "Edge Runtime", "Discord.js"],
    color: "#00C8FF",
    icon: Shield,
    github: "https://github.com/Yzzz777/system-777",
    live: "https://jrsystem7777.com/t",
    category: "Seguridad",
  },
  {
    title: "Premium System",
    desc: "Sistema de premium con 3 planes (Normal, Pro, Max), codigos canjeables, cupones, blacklist y gating por servidor.",
    tags: ["Node.js", "JSON DB", "Discord.js"],
    color: "#7C3AED",
    icon: Code2,
    github: "https://github.com/Yzzz777/system-777",
    live: "https://jrsystem7777.com/premium",
    category: "Bot",
  },
  {
    title: "Dashboard Web",
    desc: "Panel de administracion con OAuth2 Discord, gestion de staff, premium, analytics y APIs en tiempo real.",
    tags: ["Express", "OAuth2", "Session", "JSON DB"],
    color: "#EB459E",
    icon: Globe,
    github: "https://github.com/Yzzz777/system-777",
    live: "https://jrsystem7777.com/dashboard",
    category: "Web",
  },
  {
    title: "AutoMod v2",
    desc: "Sistema de moderacion automatica: anti-zalgo, anti-duplicate, anti-token, anti-NSFW, whitelist y presets.",
    tags: ["Discord.js", "Node.js", "Regex"],
    color: "#FEE75C",
    icon: Shield,
    github: "https://github.com/Yzzz777/system-777",
    category: "Seguridad",
  },
];

const categories = ["Todos", "Bot", "Web", "Seguridad"];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Proyectos</h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">Mis proyectos principales: bots, webs y herramientas de seguridad</p>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <StaggerItem key={p.title}>
              <HoverScale>
                <div className="glass rounded-2xl p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between">
                    <motion.div whileHover={{ rotate: 5 }} className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: p.color + "15" }}>
                      <p.icon className="h-6 w-6" style={{ color: p.color }} />
                    </motion.div>
                    <span className="text-xs rounded-full px-2 py-0.5" style={{ backgroundColor: p.color + "15", color: p.color }}>
                      {p.category}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm text-gray-400 flex-1">{p.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-gray-400">{tag}</span>
                    ))}
                  </div>
                  <div className="mt-5 flex gap-3">
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10">
                        <Github className="h-3.5 w-3.5" /> Codigo
                      </a>
                    )}
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-black transition-colors" style={{ backgroundColor: p.color }}>
                        <ExternalLink className="h-3.5 w-3.5" /> Ver mas
                      </a>
                    )}
                  </div>
                </div>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
