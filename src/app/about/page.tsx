"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Github,
  Code,
  Terminal,
  Server,
  Shield,
  BookOpen,
  Eye,
  Mail,
} from "lucide-react";

const principles = [
  {
    icon: Eye,
    title: "Sin datos inventados",
    desc: "No publico empleos, clientes, certificaciones ni métricas que no existan. Si no lo hice, no aparece.",
  },
  {
    icon: BookOpen,
    title: "Autodidacta real",
    desc: "Empecé en 2023 leyendo documentación y rompiendo cosas. Sigo así: cada sistema de este sitio lo aprendí usándolo.",
  },
  {
    icon: Code,
    title: "Código que se mantiene",
    desc: "Prefiero pocas cosas bien hechas: repositorios ordenados, commits claros y cero dependencias de relleno.",
  },
  {
    icon: Shield,
    title: "Seguridad por defecto",
    desc: "Auth donde toca, mínimos privilegios en el VPS y respuestas honestas cuando un servicio cae.",
  },
];

const whatIDo = [
  {
    icon: Code,
    title: "Desarrollo web",
    desc: "Next.js, React, TypeScript y Tailwind. Este portafolio y el dashboard de System 777 están hechos con ese stack.",
    href: "/projects",
    linkLabel: "Ver proyectos",
  },
  {
    icon: Terminal,
    title: "Bots y automatización",
    desc: "Discord.js, scripts de Python y APIs. System 777 nació como un bot de moderación y creció hasta ser infraestructura.",
    href: "/bot",
    linkLabel: "Ver System 777",
  },
  {
    icon: Server,
    title: "Infraestructura Linux",
    desc: "VPS con Ubuntu, PM2, túneles de Cloudflare, backups y monitoreo. El bot corre 24/7 en mi servidor.",
    href: "/bot/status",
    linkLabel: "Estado del bot",
  },
];

export default function AboutPage() {
  return (
    <div className="relative px-4 pb-[var(--section-y)] pt-10 sm:px-6 sm:pt-14">
      <div className="grid-bg" aria-hidden />
    <div className="bg-vignette" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        {/* Cabecera */}
        <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
          <div className="relative mx-auto w-full max-w-[240px]">
            <div className="portrait-frame aspect-[3/4] w-full">
              <Image
                src="/angel.webp"
                alt="Retrato de Ángel, creador de Yzzz 777"
                fill
                sizes="240px"
                className="object-cover object-top"
              />
            </div>
          </div>
          <div>
            <span className="eyebrow">Sobre mí</span>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2rem,5.5vw,3.25rem)] font-bold leading-tight tracking-tight">
              Hola, soy <span className="gradient-text">Ángel</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-[var(--text-2)]">
              También conocido como <span className="text-[var(--text)]">Yzzz 777</span>. Aprendo a
              programar desde 2023 y construyo herramientas que uso yo mismo: un bot de Discord, su
              dashboard, este sitio y scripts para mi servidor. Me interesa entender cómo funcionan
              las cosas por dentro — redes, Linux y seguridad — más que coleccionar tecnologías de
              moda.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/projects" className="btn btn-primary">
                Ver proyectos
                <ArrowUpRight aria-hidden className="h-4 w-4" />
              </Link>
              <a
                href="https://github.com/Yzzz777"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <Github aria-hidden className="h-4 w-4" />
                GitHub
              </a>
              <Link href="/contact" className="btn btn-ghost">
                <Mail aria-hidden className="h-4 w-4" />
                Contacto
              </Link>
            </div>
          </div>
        </div>

        {/* Qué hago */}
        <section className="mt-16">
          <div className="section-head">
            <span className="eyebrow">01 — Qué hago</span>
            <h2>Tres frentes, un mismo stack</h2>
            <p>Todo lo que ves en este sitio cae en una de estas categorías.</p>
          </div>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {whatIDo.map((w) => (
              <li key={w.title} className="panel panel-hover flex h-full flex-col p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--brand-dim)]">
                  <w.icon aria-hidden className="h-5 w-5 text-[var(--brand)]" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{w.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-2)]">{w.desc}</p>
                <Link
                  href={w.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--brand)] hover:underline"
                >
                  {w.linkLabel}
                  <ArrowUpRight aria-hidden className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Historia honesta */}
        <section className="mt-16">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="panel p-6 sm:p-8">
              <span className="eyebrow">02 — Cómo empecé</span>
              <div className="mt-5 space-y-4 text-[1.0625rem] leading-relaxed text-[var(--text-2)]">
                <p>
                  Empecé a inicios de 2023 con lo básico: HTML, CSS y JavaScript. Después llegaron
                  los bots de Discord, porque quería automatizar lo que hacía a mano en mis
                  servidores.
                </p>
                <p>
                  De ahí pasé a Linux de verdad: un VPS, un firewall, PM2 para mantener procesos
                  vivos y túneles para exponer servicios. Ese camino es el que me llevó a
                  seguridad — primero por necesidad (proteger mis propios servicios), después por
                  curiosidad.
                </p>
                <p>
                  Hoy mantengo <span className="text-[var(--text)]">System 777</span> en producción
                  y este portafolio encima de él. No soy senior ni digo serlo: soy alguien que
                  construye, rompe, arregla y vuelve a empezar.
                </p>
              </div>
            </div>

            <div className="panel p-6 sm:p-8">
              <span className="eyebrow">03 — Cómo trabajo</span>
              <ul className="mt-5 space-y-4">
                {principles.map((p) => (
                  <li key={p.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-white/[0.05]">
                      <p.icon aria-hidden className="h-4 w-4 text-[var(--data)]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold text-[var(--text)]">
                        {p.title}
                      </span>
                      <span className="mt-0.5 block text-[13.5px] leading-relaxed text-[var(--text-3)]">
                        {p.desc}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16">
          <div className="panel p-8 text-center sm:p-10">
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-bold">¿Trabajamos juntos?</h2>
            <p className="mx-auto mt-3 max-w-xl text-[var(--text-2)]">
              Respondo por Discord y por el formulario del sitio. Sin formularios eternos ni
              newsletters.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn btn-primary">
                Enviar mensaje
              </Link>
              <Link href="/technologies" className="btn btn-ghost">
                Ver tecnologías
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
