"use client";

import { useState } from "react";
import { FileText, Download, Search, BookOpen, Code2, Terminal, Shield, Settings, Palette, FileCode } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/ui/Animations";

const files = [
  { name: "Guia de Setup", desc: "Instrucciones de instalacion y configuracion de System 777", icon: Settings, size: "2.4 KB", downloads: 15, color: "#00FF88" },
  { name: "Documentacion de Comandos", desc: "Lista completa de los 100+ comandos disponibles", icon: BookOpen, size: "8.1 KB", downloads: 42, color: "#5865F2" },
  { name: "Configuracion Avanzada", desc: "Variables de entorno, permisos y configuracion del bot", icon: Terminal, size: "3.7 KB", downloads: 28, color: "#7C3AED" },
  { name: "Guia de Seguridad", desc: "Anti-raid, anti-nuke, automod y proteccion de servidores", icon: Shield, size: "5.2 KB", downloads: 35, color: "#ED4245" },
  { name: "Plantillas de Embeds", desc: "Plantillas listas para usar en embeds de Discord", icon: Palette, size: "4.1 KB", downloads: 19, color: "#EB459E" },
  { name: "Codigo Fuente", desc: "Repositorio completo en GitHub con documentacion", icon: Code2, size: "N/A", downloads: 67, color: "#00C8FF" },
  { name: "Scripts de Deploy", desc: "Scripts automatizados para deploy en VPS y Cloudflare", icon: FileCode, size: "1.8 KB", downloads: 12, color: "#FF6B6B" },
  { name: "Template de Bot", desc: "Base para crear tu propio bot con la misma estructura", icon: FileText, size: "6.3 KB", downloads: 23, color: "#FEE75C" },
];

export default function LibraryPage() {
  const [search, setSearch] = useState("");

  const filtered = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Biblioteca</h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">Documentacion, guias y recursos para System 777</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mx-auto mt-8 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Buscar archivos..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" />
            </div>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f) => {
            const Icon = f.icon;
            return (
              <StaggerItem key={f.name}>
                <HoverScale>
                  <div className="glass rounded-2xl p-5 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: f.color + "15" }}>
                      <Icon className="h-5 w-5" style={{ color: f.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white">{f.name}</div>
                      <p className="mt-1 text-xs text-gray-400 line-clamp-2">{f.desc}</p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                        <span>{f.size}</span>
                        <span className="flex items-center gap-1"><Download className="h-3 w-3" /> {f.downloads}</span>
                      </div>
                    </div>
                  </div>
                </HoverScale>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {filtered.length === 0 && <div className="mt-20 text-center text-gray-400">No se encontraron archivos</div>}
      </div>
    </div>
  );
}
