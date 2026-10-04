"use client";

import Image from "next/image";
import { Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Level = "Uso a diario" | "Uso habitual" | "Aprendiendo";

const techStack: { name: string; icon: string; category: string; level: Level; note: string }[] = [
  { name: "JavaScript", icon: "javascript", category: "Lenguajes", level: "Uso a diario", note: "Bots, scripts y frontend" },
  { name: "TypeScript", icon: "typescript", category: "Lenguajes", level: "Uso habitual", note: "Next.js y APIs del sitio" },
  { name: "Python", icon: "python", category: "Lenguajes", level: "Uso habitual", note: "Automatización y utilidades" },
  { name: "C", icon: "c", category: "Lenguajes", level: "Aprendiendo", note: "Base y sistemas" },
  { name: "C++", icon: "cplusplus", category: "Lenguajes", level: "Aprendiendo", note: "Base y sistemas" },
  { name: "C#", icon: "csharp", category: "Lenguajes", level: "Aprendiendo", note: "Proyectos puntuales" },
  { name: "Java", icon: "java", category: "Lenguajes", level: "Aprendiendo", note: "Lectura de código" },

  { name: "HTML5", icon: "html5", category: "Frontend", level: "Uso a diario", note: "Estructura y accesibilidad" },
  { name: "CSS3", icon: "css3", category: "Frontend", level: "Uso a diario", note: "Tailwind y diseño propio" },
  { name: "React", icon: "react", category: "Frontend", level: "Uso habitual", note: "Base de este sitio" },
  { name: "Next.js", icon: "nextjs", category: "Frontend", level: "Uso habitual", note: "App Router, ISR, edge" },
  { name: "Tailwind CSS", icon: "tailwindcss", category: "Frontend", level: "Uso a diario", note: "Sistema de diseño v4" },

  { name: "Node.js", icon: "nodejs", category: "Backend", level: "Uso a diario", note: "Bot, APIs y dashboard" },
  { name: "PostgreSQL", icon: "postgresql", category: "Bases de datos", level: "Uso habitual", note: "Neon en producción" },
  { name: "MySQL", icon: "mysql", category: "Bases de datos", level: "Aprendiendo", note: "Consultas y esquemas" },
  { name: "Redis", icon: "redis", category: "Bases de datos", level: "Aprendiendo", note: "Caché y colas" },

  { name: "Linux", icon: "linux", category: "Infraestructura", level: "Uso a diario", note: "Ubuntu en el VPS" },
  { name: "Docker", icon: "docker", category: "Infraestructura", level: "Aprendiendo", note: "Contenedores y despliegues" },
  { name: "Cloudflare", icon: "cloudflare", category: "Infraestructura", level: "Uso habitual", note: "DNS, túneles y Pages" },
  { name: "PM2", icon: "pm2", category: "Infraestructura", level: "Uso habitual", note: "Procesos 24/7 del bot" },

  { name: "Git", icon: "git", category: "Herramientas", level: "Uso a diario", note: "Versionado y despliegues" },
  { name: "Discord.js", icon: "discordjs", category: "Herramientas", level: "Uso a diario", note: "System 777" },
];

const categories = [...new Set(techStack.map((t) => t.category))];
const levels: Level[] = ["Uso a diario", "Uso habitual", "Aprendiendo"];

const levelColors: Record<Level, string> = {
  "Uso a diario": "var(--brand)",
  "Uso habitual": "var(--data)",
  Aprendiendo: "var(--warn)",
};

const levelHints: Record<Level, string> = {
  "Uso a diario": "Uso en proyectos reales casi todos los días.",
  "Uso habitual": "Lo uso con soltura, aunque no todos los días.",
  Aprendiendo: "Estudiándolo: lo justo para leer código y hacer ejercicios.",
};

const devicon = (name: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-original.svg`;

export default function TechnologiesPage() {
  return (
    <div className="relative px-4 pb-[var(--section-y)] pt-10 sm:px-6 sm:pt-14">
      <div className="grid-bg" aria-hidden />
    <div className="bg-vignette" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <span className="eyebrow justify-center">
            <Layers aria-hidden className="h-3 w-3" />
            Stack real
          </span>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2rem,5.5vw,3.25rem)] font-bold tracking-tight">
            Tecnologías
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-2)]">
            Herramientas que uso en proyectos reales, con una autoevaluación honesta de cuánto las
            manejo. No hay porcentajes inflados.
          </p>
        </div>

        {/* Leyenda */}
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
          {levels.map((level) => (
            <Tooltip key={level}>
              <TooltipTrigger
                render={
                  <Badge
                    variant="outline"
                    tabIndex={0}
                    className="cursor-default font-mono"
                  />
                }
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: levelColors[level] }}
                />
                <span style={{ color: levelColors[level] }}>{level}</span>
                <span className="text-[var(--text-3)]">
                  · {techStack.filter((t) => t.level === level).length}
                </span>
              </TooltipTrigger>
              <TooltipContent>{levelHints[level]}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Categorías */}
        {categories.map((cat) => (
          <section key={cat} className="mt-12">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h2 className="text-xl font-bold sm:text-2xl">{cat}</h2>
              <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--text-3)]">
                {techStack.filter((t) => t.category === cat).length} tecnologías
              </span>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {techStack
                .filter((t) => t.category === cat)
                .map((tech) => (
                  <li key={tech.name} className="panel panel-hover flex items-center gap-4 p-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-[var(--line)] bg-white/[0.03]">
                      <Image
                        src={devicon(tech.icon)}
                        alt=""
                        width={22}
                        height={22}
                        loading="lazy"
                        className="h-[22px] w-[22px] object-contain"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-[var(--text)]">
                        {tech.name}
                      </span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-2">
                        <span
                          className="font-[family-name:var(--font-mono)] text-[11px]"
                          style={{ color: levelColors[tech.level] }}
                        >
                          {tech.level}
                        </span>
                        <span className="truncate text-xs text-[var(--text-3)]">{tech.note}</span>
                      </span>
                    </span>
                  </li>
                ))}
            </ul>
          </section>
        ))}

        <p className="mt-12 text-center text-xs text-[var(--text-3)]">
          Los niveles son autoevaluación, no certificaciones. Si algo está aquí es porque lo usé en
          un proyecto propio o lo estoy estudiando activamente.
        </p>
      </div>
    </div>
  );
}
