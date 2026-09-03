"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Bot, Globe, Shield, Code2, Terminal, ChevronRight, FileText, Folder, File, ArrowLeft } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/ui/Animations";

interface FileNode { name: string; type: "file" | "dir"; size?: string; desc?: string; children?: FileNode[]; }

const projectTree: FileNode[] = [
  { name: "YZ", type: "dir", children: [
    { name: "pc_client", type: "dir", desc: "Cliente PC Windows 24/7", children: [
      { name: "main.py", type: "file", size: "4.2 KB", desc: "Punto de entrada + verificacion Ollama" },
      { name: "wake_word.py", type: "file", size: "3.1 KB", desc: "Deteccion 'Oye YZ' (Whisper tiny)" },
      { name: "voice_engine.py", type: "file", size: "5.8 KB", desc: "STT (faster-whisper) + TTS (edge-tts)" },
      { name: "nlp_processor.py", type: "file", size: "2.9 KB", desc: "NLP con Ollama local (gratis)" },
      { name: "ws_client.py", type: "file", size: "3.4 KB", desc: "WebSocket -> VPS (reconexion automatica)" },
      { name: "config.py", type: "file", size: "1.2 KB", desc: "Configuracion del cliente" },
      { name: "skills", type: "dir", children: [
        { name: "os_control.py", type: "file", size: "4.5 KB", desc: "apps, volumen, apagar/reiniciar" },
        { name: "system_monitor.py", type: "file", size: "2.8 KB", desc: "CPU/RAM/disco/red" },
        { name: "spotify_skill.py", type: "file", size: "3.6 KB", desc: "control Spotify" },
        { name: "focus_mode.py", type: "file", size: "1.9 KB", desc: "modo concentracion" },
        { name: "file_manager.py", type: "file", size: "2.3 KB", desc: "archivos" },
        { name: "gmail_skill.py", type: "file", size: "4.1 KB", desc: "leer/enviar correos" },
        { name: "web_browser.py", type: "file", size: "3.7 KB", desc: "Playwright (Chrome)" },
        { name: "social_media.py", type: "file", size: "2.5 KB", desc: "subir disenos" },
        { name: "screen_ext.py", type: "file", size: "3.2 KB", desc: "segundo monitor (Weylus/ADB)" },
      ]},
      { name: ".env.example", type: "file", size: "0.5 KB", desc: "Plantilla de variables" },
      { name: "requirements.txt", type: "file", size: "0.3 KB", desc: "Dependencias Python" },
    ]},
    { name: "vps_server", type: "dir", desc: "Servidor VPS (jrsystem7777.com)", children: [
      { name: "server.py", type: "file", size: "6.1 KB", desc: "FastAPI + WebSocket relay" },
      { name: "auth.py", type: "file", size: "2.4 KB", desc: "JWT login" },
      { name: "panel", type: "dir", desc: "PWA movil" },
      { name: "requirements.txt", type: "file", size: "0.2 KB", desc: "Dependencias" },
    ]},
    { name: "yz_terminal.py", type: "file", size: "8.3 KB", desc: "Terminal principal de YZ" },
    { name: "test_rules.py", type: "file", size: "1.7 KB", desc: "Tests de reglas NLP" },
    { name: "setup_final.py", type: "file", size: "3.2 KB", desc: "Setup final del sistema" },
    { name: "redeploy_fix.py", type: "file", size: "2.1 KB", desc: "Fix de redeploy" },
    { name: "install_ollama.py", type: "file", size: "1.8 KB", desc: "Instalador de Ollama" },
    { name: "get_token.py", type: "file", size: "1.1 KB", desc: "Obtener token JWT" },
    { name: "fix_vps_env.py", type: "file", size: "1.5 KB", desc: "Fix variables VPS" },
    { name: "deploy_vps.py", type: "file", size: "2.8 KB", desc: "Deploy al VPS" },
    { name: "setup_ollama_portable.ps1", type: "file", size: "1.4 KB", desc: "Setup Ollama portable PowerShell" },
    { name: "YZ_TERMINAL.bat", type: "file", size: "0.3 KB", desc: "Launcher bat" },
    { name: "INICIAR_YZ.bat", type: "file", size: "0.2 KB", desc: "Iniciar YZ" },
    { name: "launch_yz_silent.vbs", type: "file", size: "0.1 KB", desc: "Lanzador silencioso VBS" },
    { name: "SETUP.md", type: "file", size: "7.2 KB", desc: "Guia completa de setup" },
    { name: "yz_live.log", type: "file", size: "12.5 KB", desc: "Log en vivo" },
    { name: "yz_live.log.err", type: "file", size: "2.3 KB", desc: "Log de errores" },
  ]},
];

const projects = [
  { title: "System 777", desc: "Bot de Discord multiproposito con 100+ comandos, moderacion, musica, economia, niveles, tickets y proteccion anti-raid.", tags: ["Node.js", "Discord.js", "Express", "PostgreSQL"], color: "#5865F2", icon: Bot, github: "https://github.com/Yzzz777/system-777", live: "https://jrsystem7777.com/bot", category: "Bot" },
  { title: "jrsystem7777.com", desc: "Portafolio personal con Next.js 15, Tailwind v4, Neon PostgreSQL. Blog, biblioteca, tecnologias y dashboard.", tags: ["Next.js", "TypeScript", "Tailwind", "Cloudflare"], color: "#00FF88", icon: Globe, github: "https://github.com/Yzzz777/system777", live: "https://jrsystem7777.com", category: "Web" },
  { title: "YZ Terminal", desc: "Asistente de voz con IA local (Ollama). STT + TTS, skills de control de PC, Spotify, Gmail, navegador y segundo monitor.", tags: ["Python", "Ollama", "WebSocket", "FastAPI"], color: "#7C3AED", icon: Terminal, github: "https://github.com/Yzzz777", live: "#", category: "IA", hasTree: true },
  { title: "IP Tracker", desc: "Sistema de rastreo de IPs integrado en el bot. Captura IP, ubicacion, ISP y user agent.", tags: ["TypeScript", "Edge Runtime", "Discord.js"], color: "#00C8FF", icon: Shield, github: "https://github.com/Yzzz777/system-777", live: "https://jrsystem7777.com/t", category: "Seguridad" },
  { title: "AutoMod v2", desc: "Moderacion automatica: anti-zalgo, anti-duplicate, anti-token, anti-NSFW, whitelist y presets.", tags: ["Discord.js", "Node.js", "Regex"], color: "#FEE75C", icon: Shield, github: "https://github.com/Yzzz777/system-777", category: "Seguridad" },
];

function FileIcon({ node }: { node: FileNode }) {
  if (node.type === "dir") return <Folder className="h-4 w-4 text-[#FEE75C]" />;
  const ext = node.name.split(".").pop() || "";
  const colors: Record<string, string> = { py: "#3776AB", js: "#F7DF1E", ts: "#3178C6", ps1: "#012456", bat: "#C1F12E", vbs: "#8B8B8B", md: "#FFFFFF", txt: "#95A5A6", log: "#95A5A6", err: "#ED4245" };
  return <File className="h-4 w-4" style={{ color: colors[ext] || "#95A5A6" }} />;
}

function FileTree({ nodes, depth = 0 }: { nodes: FileNode[]; depth?: number }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ YZ: true, pc_client: true, vps_server: false, skills: false });

  return (
    <div className={depth > 0 ? "ml-4 border-l border-white/5 pl-3" : ""}>
      {nodes.map((node) => (
        <div key={node.name}>
          <button onClick={() => node.type === "dir" && setExpanded({ ...expanded, [node.name]: !expanded[node.name] })} className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm transition-colors ${node.type === "dir" ? "hover:bg-white/5 cursor-pointer" : ""}`}>
            {node.type === "dir" && <ChevronRight className={`h-3 w-3 text-gray-500 transition-transform ${expanded[node.name] ? "rotate-90" : ""}`} />}
            {node.type === "file" && <span className="w-3" />}
            <FileIcon node={node} />
            <span className="text-white font-mono text-xs">{node.name}</span>
            {node.size && <span className="text-gray-600 text-xs ml-auto">{node.size}</span>}
          </button>
          {node.type === "dir" && expanded[node.name] && node.children && (
            <FileTree nodes={node.children} depth={depth + 1} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Proyectos</h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">Mis proyectos: bots, webs, IA y herramientas de seguridad</p>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <StaggerItem key={p.title}>
              <HoverScale>
                <div className="glass rounded-2xl p-6 h-full flex flex-col cursor-pointer" onClick={() => setSelectedProject(p)}>
                  <div className="flex items-start justify-between">
                    <motion.div whileHover={{ rotate: 5 }} className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: p.color + "15" }}>
                      <p.icon className="h-6 w-6" style={{ color: p.color }} />
                    </motion.div>
                    <span className="text-xs rounded-full px-2 py-0.5" style={{ backgroundColor: p.color + "15", color: p.color }}>{p.category}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm text-gray-400 flex-1">{p.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((tag) => <span key={tag} className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-gray-400">{tag}</span>)}
                  </div>
                  <div className="mt-5 flex gap-3">
                    {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/10"><Github className="h-3.5 w-3.5" /> Codigo</a>}
                    <span className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-gray-300">Ver mas <ChevronRight className="h-3.5 w-3.5" /></span>
                  </div>
                </div>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelectedProject(null)}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass rounded-2xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl" style={{ backgroundColor: selectedProject.color + "15" }}>
                      <selectedProject.icon className="h-7 w-7" style={{ color: selectedProject.color }} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedProject.title}</h2>
                      <span className="text-xs rounded-full px-2 py-0.5 mt-1 inline-block" style={{ backgroundColor: selectedProject.color + "15", color: selectedProject.color }}>{selectedProject.category}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedProject(null)} className="text-gray-500 hover:text-white"><ArrowLeft className="h-5 w-5" /></button>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">{selectedProject.desc}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.tags.map((tag) => <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">{tag}</span>)}
                </div>

                {selectedProject.hasTree && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Folder className="h-4 w-4 text-[#FEE75C]" /> Estructura del Proyecto</h3>
                    <div className="rounded-xl bg-black/30 border border-white/5 p-4">
                      <FileTree nodes={projectTree} />
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {selectedProject.github && <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors"><Github className="h-4 w-4" /> Ver en GitHub</a>}
                  {selectedProject.live && selectedProject.live !== "#" && <a href={selectedProject.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-black transition-colors" style={{ backgroundColor: selectedProject.color }}><ExternalLink className="h-4 w-4" /> Ver en vivo</a>}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
