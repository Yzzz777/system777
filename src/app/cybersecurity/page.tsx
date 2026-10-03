"use client";

import Link from "next/link";
import {
  Shield,
  Lock,
  Server,
  Network,
  Radar,
  Cpu,
  Globe,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";

type Level = "Proyecto real" | "Practicando" | "Estudiando";

const areas: {
  icon: typeof Shield;
  title: string;
  level: Level;
  desc: string;
  evidence: string;
}[] = [
  {
    icon: Shield,
    title: "Anti-raid y anti-nuke",
    level: "Proyecto real",
    desc: "Detección de rachas de joins, bloqueo de destrucción masiva de canales y whitelist de confianza.",
    evidence: "Implementado y activo en System 777",
  },
  {
    icon: Lock,
    title: "AutoMod",
    level: "Proyecto real",
    desc: "Filtros de palabras, anti-spam, anti-caps, anti-link y anti-zalgo con configuración por servidor.",
    evidence: "Sistema `/automod` en producción",
  },
  {
    icon: Radar,
    title: "Monitoreo",
    level: "Proyecto real",
    desc: "Vigilancia del VPS, logs del bot, estadísticas públicas y alertas al owner.",
    evidence: "API pública + panel de estado",
  },
  {
    icon: Cpu,
    title: "Automatización",
    level: "Proyecto real",
    desc: "Scripts de seguridad, respuestas automáticas y despliegues repetibles.",
    evidence: "Uso diario en mi infraestructura",
  },
  {
    icon: Lock,
    title: "Autenticación",
    level: "Practicando",
    desc: "OAuth2 con Discord, sesiones con cookies firmadas y control de acceso en el dashboard.",
    evidence: "Implementado en este sitio",
  },
  {
    icon: Server,
    title: "Hardening",
    level: "Practicando",
    desc: "Ubuntu con firewall, SSH con permisos mínimos y servicios expuestos solo cuando hace falta.",
    evidence: "VPS personal en uso",
  },
  {
    icon: Globe,
    title: "Seguridad web",
    level: "Estudiando",
    desc: "XSS, SQLi, CSRF y buenas prácticas que aplico a mis propias aplicaciones.",
    evidence: "Lectura y práctica propia",
  },
  {
    icon: Network,
    title: "Redes",
    level: "Estudiando",
    desc: "Puertos, DNS, túneles, segmentación y análisis de tráfico.",
    evidence: "Base para mi infraestructura",
  },
];

const learning = [
  "Análisis de tráfico y reconocimiento de red",
  "Auditoría web básica (qué mirar y en qué orden)",
  "Gestión de secretos y rotación de credenciales",
  "Respuesta a incidentes: qué revisar primero",
  "Principios de defensa en profundidad",
  "Forense ligero: logs, artefactos y tiempos",
];

const levelColors: Record<Level, string> = {
  "Proyecto real": "var(--brand)",
  Practicando: "var(--data)",
  Estudiando: "var(--warn)",
};

export default function CybersecurityPage() {
  return (
    <div className="relative px-4 pb-[var(--section-y)] pt-10 sm:px-6 sm:pt-14">
      <div className="grid-bg" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <span className="eyebrow justify-center">
            <Shield aria-hidden className="h-3 w-3" />
            Seguridad
          </span>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2rem,5.5vw,3.25rem)] font-bold tracking-tight">
            Cybersecurity
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-2)]">
            Distingo entre lo que ya corre en producción, lo que practico y lo que estoy estudiando.
            Nada de “experto” sin algo que lo demuestre.
          </p>
        </div>

        {/* Leyenda */}
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
          {(Object.keys(levelColors) as Level[]).map((level) => (
            <span key={level} className="chip">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: levelColors[level] }} />
              <span style={{ color: levelColors[level] }}>{level}</span>
              <span className="text-[var(--text-3)]">
                · {areas.filter((a) => a.level === level).length}
              </span>
            </span>
          ))}
        </div>

        {/* Áreas */}
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold sm:text-2xl">Áreas</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {areas.map((a) => (
              <li key={a.title} className="panel panel-hover flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.05]">
                    <a.icon aria-hidden className="h-4.5 w-4.5" style={{ color: levelColors[a.level] }} />
                  </span>
                  <span
                    className="chip shrink-0"
                    style={{
                      color: levelColors[a.level],
                      borderColor: `color-mix(in srgb, ${levelColors[a.level]} 35%, transparent)`,
                    }}
                  >
                    {a.level}
                  </span>
                </div>
                <h3 className="mt-3.5 text-[15px] font-semibold">{a.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--text-2)]">{a.desc}</p>
                <p className="mt-2.5 flex-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-3)]">
                  → {a.evidence}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Estudiando */}
        <section className="mt-12 grid gap-4 lg:grid-cols-2">
          <div className="panel p-6">
            <span className="eyebrow">
              <GraduationCap aria-hidden className="h-3 w-3" />
              En el punto de mira
            </span>
            <h2 className="mt-3 text-xl font-bold">Qué estoy aprendiendo</h2>
            <ul className="mt-4 space-y-2.5">
              {learning.map((l) => (
                <li key={l} className="flex items-start gap-2.5 text-sm text-[var(--text-2)]">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--data)]" />
                  {l}
                </li>
              ))}
            </ul>
          </div>

          <div className="panel p-6">
            <span className="eyebrow">Lo que NO afirmo</span>
            <h2 className="mt-3 text-xl font-bold">Transparencia</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--text-2)]">
              <li className="flex items-start gap-2.5">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--warn)]" />
                No tengo certificaciones oficiales y no las pongo en el CV.
              </li>
              <li className="flex items-start gap-2.5">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--warn)]" />
                No hago pentesting profesional ni ofrezco servicios de auditoría a terceros.
              </li>
              <li className="flex items-start gap-2.5">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--warn)]" />
                No publico herramientas de ataque listas para usar: esto es defensivo.
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/bot" className="btn btn-ghost !px-4 !py-2 !text-[13px]">
                Ver la protección de System 777
                <ArrowUpRight aria-hidden className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
