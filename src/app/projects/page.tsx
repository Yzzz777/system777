"use client";

import { useEffect, useRef, useState } from "react";
import {
  Github,
  Globe,
  Bot,
  Shield,
  Terminal,
  X,
  Folder,
  File,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

interface FileNode {
  name: string;
  type: "file" | "dir";
  size?: string;
  children?: FileNode[];
}

const projectTree: FileNode[] = [
      { name: "INICIAR_YZ.bat", type: "file", size: "814 B" },
      { name: "SETUP.md", type: "file", size: "5.4 KB" },
      { name: "YZ_TERMINAL.bat", type: "file", size: "158 B" },
      { name: "deploy_vps.py", type: "file", size: "2.6 KB" },
      { name: "fix_vps_env.py", type: "file", size: "1.7 KB" },
      { name: "get_token.py", type: "file", size: "1.3 KB" },
      { name: "install_ollama.py", type: "file", size: "2.2 KB" },
      { name: "launch_yz_silent.vbs", type: "file", size: "144 B" },
      { name: "pc_client", type: "dir", children: [
          { name: ".env.example", type: "file", size: "2.4 KB" },
          { name: "config.py", type: "file", size: "2.4 KB" },
          { name: "logs", type: "dir", children: [
              { name: "patches", type: "dir", children: [
                ] },
            ] },
          { name: "main.py", type: "file", size: "2.0 KB" },
          { name: "nlp_processor.py", type: "file", size: "7.4 KB" },
          { name: "requirements.txt", type: "file", size: "1012 B" },
          { name: "self_healer.py", type: "file", size: "6.5 KB" },
          { name: "skills", type: "dir", children: [
              { name: "__init__.py", type: "file", size: "2.4 KB" },
              { name: "file_manager.py", type: "file", size: "1.3 KB" },
              { name: "focus_mode.py", type: "file", size: "874 B" },
              { name: "gmail_skill.py", type: "file", size: "2.6 KB" },
              { name: "os_control.py", type: "file", size: "4.8 KB" },
              { name: "screen_ext.py", type: "file", size: "4.3 KB" },
              { name: "social_media.py", type: "file", size: "2.7 KB" },
              { name: "spotify_skill.py", type: "file", size: "2.8 KB" },
              { name: "system_monitor.py", type: "file", size: "1.2 KB" },
              { name: "web_browser.py", type: "file", size: "1.2 KB" },
            ] },
          { name: "voice_engine.py", type: "file", size: "2.5 KB" },
          { name: "wake_word.py", type: "file", size: "2.6 KB" },
          { name: "ws_client.py", type: "file", size: "2.5 KB" },
        ] },
      { name: "redeploy_fix.py", type: "file", size: "1.8 KB" },
      { name: "setup_final.py", type: "file", size: "1.8 KB" },
      { name: "setup_ollama_portable.ps1", type: "file", size: "1.6 KB" },
      { name: "test_rules.py", type: "file", size: "463 B" },
      { name: "vps_server", type: "dir", children: [
          { name: ".env.example", type: "file", size: "419 B" },
          { name: "auth.py", type: "file", size: "1.4 KB" },
          { name: "panel", type: "dir", children: [
              { name: "app.js", type: "file", size: "11.0 KB" },
              { name: "index.html", type: "file", size: "628 B" },
              { name: "manifest.json", type: "file", size: "411 B" },
              { name: "style.css", type: "file", size: "13.4 KB" },
            ] },
          { name: "requirements.txt", type: "file", size: "112 B" },
          { name: "server.py", type: "file", size: "7.8 KB" },
        ] },
      { name: "yz_live.log", type: "file", size: "1.5 KB" },
      { name: "yz_live.log.err", type: "file", size: "9.6 KB" },
      { name: "yz_terminal.py", type: "file", size: "20.2 KB" },
    ];

type Project = {
  title: string;
  kind: string;
  desc: string;
  tags: string[];
  color: string;
  status: string;
  github: string | null;
  live: string | null;
  liveLabel?: string;
  hasTree?: boolean;
};

const projects: Project[] = [
  {
    title: "System 777",
    kind: "Bot de Discord",
    desc: "Multipropósito: moderación, protección anti-raid y anti-nuke, automod, tickets, economía, niveles, música, utilidades y control del VPS. Corre 24/7 con PM2 y tiene dashboard propio con OAuth2.",
    tags: ["Node.js", "Discord.js", "PostgreSQL", "Express", "PM2"],
    color: "#5865F2",
    status: "Activo",
    github: "https://github.com/Yzzz777/system-777",
    live: "/bot",
    liveLabel: "Ver ficha del bot",
  },
  {
    title: "jrsystem7777.com",
    kind: "Web · Portafolio",
    desc: "Este sitio: Next.js 15 con App Router, Tailwind v4, blog con base de datos, autenticación con Discord y despliegue en Cloudflare Pages.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Cloudflare"],
    color: "#00FF88",
    status: "Activo",
    github: "https://github.com/Yzzz777/system777",
    live: "/",
    liveLabel: "Estás aquí",
  },
  {
    title: "YZ Terminal",
    kind: "IA local · Asistente de voz",
    desc: "Asistente con LLM local (Ollama): detección de palabra de voz, STT/TTS, control del PC, skills de Spotify, Gmail y navegador, con cliente WebSocket hacia el VPS y panel PWA.",
    tags: ["Python", "Ollama", "FastAPI", "WebSocket"],
    color: "#7C3AED",
    status: "En desarrollo",
    github: null,
    live: null,
    hasTree: true,
  },
  {
    title: "IP Tracker",
    kind: "Seguridad",
    desc: "Endpoint integrado en el bot que registra IP, ubicación, ISP y user agent desde un link de verificación y avisa al owner por DM en Discord.",
    tags: ["TypeScript", "Edge Runtime", "Discord.js"],
    color: "#00C8FF",
    status: "Proyecto real",
    github: "https://github.com/Yzzz777/system-777",
    live: null,
  },
  {
    title: "AutoMod v2",
    kind: "Moderación",
    desc: "Filtros anti-zalgo, anti-duplicados, anti-tokens, anti-NSFW, whitelist y presets por servidor, con comandos de configuración.",
    tags: ["Discord.js", "Node.js", "Regex"],
    color: "#FEE75C",
    status: "Proyecto real",
    github: "https://github.com/Yzzz777/system-777",
    live: null,
  },
];

function FileIcon({ node }: { node: FileNode }) {
  if (node.type === "dir") return <Folder aria-hidden className="h-4 w-4 text-[#FEE75C]" />;
  const ext = node.name.split(".").pop() || "";
  const colors: Record<string, string> = {
    py: "#3776AB",
    js: "#F7DF1E",
    ts: "#3178C6",
    ps1: "#012456",
    bat: "#C1F12E",
    vbs: "#8B8B8B",
    md: "#FFFFFF",
    txt: "#95A5A6",
    log: "#95A5A6",
    err: "#ED4245",
  };
  return <File aria-hidden className="h-4 w-4" style={{ color: colors[ext] || "#95A5A6" }} />;
}

function FileTree({ nodes, depth = 0, open, toggle }: {
  nodes: FileNode[];
  depth?: number;
  open: Record<string, boolean>;
  toggle: (key: string) => void;
}) {
  return (
    <div className={depth > 0 ? "ml-4 border-l border-[var(--line)] pl-3" : ""}>
      {nodes.map((node) => {
        const key = `${depth}-${node.name}`;
        const isOpen = !!open[key];
        return (
          <div key={key}>
            <button
              type="button"
              onClick={() => node.type === "dir" && toggle(key)}
              aria-expanded={node.type === "dir" ? isOpen : undefined}
              className={`flex w-full items-center gap-2 rounded-[6px] px-2 py-1.5 text-left transition-colors ${
                node.type === "dir" ? "hover:bg-white/[0.05]" : "cursor-default"
              }`}
            >
              {node.type === "dir" ? (
                <ChevronRight
                  aria-hidden
                  className={`h-3 w-3 shrink-0 text-[var(--text-3)] transition-transform ${isOpen ? "rotate-90" : ""}`}
                />
              ) : (
                <span aria-hidden className="w-3 shrink-0" />
              )}
              <FileIcon node={node} />
              <span className="truncate font-[family-name:var(--font-mono)] text-xs text-[var(--text)]">
                {node.name}
              </span>
              {node.size && (
                <span className="ml-auto shrink-0 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-3)]">
                  {node.size}
                </span>
              )}
            </button>
            {node.type === "dir" && isOpen && node.children && (
              <FileTree nodes={node.children} depth={depth + 1} open={open} toggle={toggle} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({ "0-YZ": true, "1-pc_client": true });
  const toggle = (key: string) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="panel max-h-[85vh] w-full max-w-3xl overflow-y-auto p-6 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.05]"
              style={{ color: project.color }}
            >
              {project.kind.startsWith("Bot") ? (
                <Bot aria-hidden className="h-5 w-5" />
              ) : project.kind.startsWith("IA") ? (
                <Terminal aria-hidden className="h-5 w-5" />
              ) : project.kind.startsWith("Web") ? (
                <Globe aria-hidden className="h-5 w-5" />
              ) : (
                <Shield aria-hidden className="h-5 w-5" />
              )}
            </span>
            <div className="min-w-0">
              <h2 id="project-dialog-title" className="truncate text-xl font-bold">
                {project.title}
              </h2>
              <span className="stat-label" style={{ color: project.color }}>
                {project.kind} · {project.status}
              </span>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 rounded-[8px] border border-[var(--line)] p-2 text-[var(--text-3)] transition-colors hover:text-[var(--text)]"
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-[var(--text-2)]">{project.desc}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>

        {project.hasTree && (
          <div className="mt-6">
            <h3 className="stat-label mb-2">Estructura del proyecto (tamaños reales)</h3>
            <div className="max-h-72 overflow-y-auto rounded-[10px] border border-[var(--line)] bg-black/30 p-3">
              <FileTree nodes={projectTree} open={open} toggle={toggle} />
            </div>
            <p className="mt-2 text-[11px] text-[var(--text-3)]">
              Árbol leído del disco local; los tamaños reflejan los archivos del proyecto.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost !px-3.5 !py-2 !text-[13px]"
            >
              <Github aria-hidden className="h-3.5 w-3.5" />
              Ver en GitHub
            </a>
          )}
          {project.live && (
            <a href={project.live} className="btn btn-primary !px-3.5 !py-2 !text-[13px]">
              <Globe aria-hidden className="h-3.5 w-3.5" />
              {project.liveLabel ?? "Ver en vivo"}
            </a>
          )}
          {!project.live && !project.github && (
            <span className="chip">Información próximamente</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <div className="relative px-4 pb-[var(--section-y)] pt-10 sm:px-6 sm:pt-14">
      <div className="grid-bg" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <span className="eyebrow justify-center">Portfolio</span>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2rem,5.5vw,3.25rem)] font-bold tracking-tight">
            Proyectos
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-2)]">
            Todo lo que ves aquí lo construí y lo puedo enseñar: código, demo o archivo en disco.
            Los estados son reales.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li key={p.title} className="flex">
              <article className="panel panel-hover flex h-full w-full flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/[0.05]"
                    style={{ color: p.color }}
                  >
                    {p.kind.startsWith("Bot") ? (
                      <Bot aria-hidden className="h-5 w-5" />
                    ) : p.kind.startsWith("IA") ? (
                      <Terminal aria-hidden className="h-5 w-5" />
                    ) : p.kind.startsWith("Web") ? (
                      <Globe aria-hidden className="h-5 w-5" />
                    ) : (
                      <Shield aria-hidden className="h-5 w-5" />
                    )}
                  </span>
                  <span
                    className="chip shrink-0"
                    style={{
                      color: p.color,
                      borderColor: `color-mix(in srgb, ${p.color} 35%, transparent)`,
                    }}
                  >
                    {p.status}
                  </span>
                </div>

                <span className="stat-label mt-4" style={{ color: p.color }}>
                  {p.kind}
                </span>
                <h2 className="mt-1.5 text-lg font-bold">{p.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-2)]">{p.desc}</p>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
                  <button
                    type="button"
                    onClick={() => setSelected(p)}
                    className="btn btn-ghost !px-3.5 !py-2 !text-[13px]"
                  >
                    Detalles
                    <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                  </button>
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost !px-3.5 !py-2 !text-[13px]"
                    >
                      <Github aria-hidden className="h-3.5 w-3.5" />
                      GitHub
                    </a>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-xs text-[var(--text-3)]">
          Sin métricas inventadas: cuando tenga números reales (usuarios, uptime, descargas), los
          publicaré.
        </p>
      </div>

      {selected && <ProjectDialog project={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
