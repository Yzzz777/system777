"use client";

import Link from "next/link";
import {
  Search,
  Github,
  FileCode,
  BookOpen,
  Gauge,
  Terminal,
  ArrowUpRight,
  Mail,
} from "lucide-react";
import { useState } from "react";

type Resource = {
  title: string;
  desc: string;
  href: string;
  external: boolean;
  icon: typeof Github;
  color: string;
  tag: string;
};

const resources: Resource[] = [
  {
    title: "Código fuente de System 777",
    desc: "Repositorio público del bot: comandos, sistemas de protección, economía y dashboard.",
    href: "https://github.com/Yzzz777/system-777",
    external: true,
    icon: Github,
    color: "var(--system)",
    tag: "GitHub",
  },
  {
    title: "Código de este sitio",
    desc: "Frontend, blog con base de datos, APIs y autenticación con Discord.",
    href: "https://github.com/Yzzz777/system777",
    external: true,
    icon: FileCode,
    color: "var(--brand)",
    tag: "GitHub",
  },
  {
    title: "Referencia de comandos",
    desc: "Todos los comandos de System 777 con uso y descripción, filtrables por categoría.",
    href: "/bot/commands",
    external: false,
    icon: BookOpen,
    color: "var(--data)",
    tag: "Página",
  },
  {
    title: "Estado del bot",
    desc: "Servidores, usuarios, ping y uptime en vivo desde la API pública.",
    href: "/bot/status",
    external: false,
    icon: Gauge,
    color: "var(--warn)",
    tag: "Página",
  },
  {
    title: "Planes premium",
    desc: "Precios y beneficios exactos de Normal, Pro y Max, tal como están en el código.",
    href: "/bot#premium",
    external: false,
    icon: Terminal,
    color: "var(--system-2, #7C3AED)",
    tag: "Sección",
  },
  {
    title: "Sobre mí",
    desc: "Quién soy, cómo trabajo y qué tecnología uso a diario.",
    href: "/about",
    external: false,
    icon: BookOpen,
    color: "var(--brand)",
    tag: "Página",
  },
];

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();
  const filtered = resources.filter(
    (r) => !q || r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q)
  );

  return (
    <div className="relative px-4 pb-[var(--section-y)] pt-10 sm:px-6 sm:pt-14">
      <div className="grid-bg" aria-hidden />
      <div className="relative mx-auto max-w-5xl">
        <div className="text-center">
          <span className="eyebrow justify-center">Recursos</span>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2rem,5.5vw,3.25rem)] font-bold tracking-tight">
            Biblioteca
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-2)]">
            Todo lo público que tengo: repositorios, documentación y páginas de referencia. Aquí
            solo hay enlaces que existen.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-md">
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]"
            />
            <label htmlFor="lib-search" className="sr-only">
              Buscar recursos
            </label>
            <input
              id="lib-search"
              type="search"
              placeholder="Buscar recurso…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input !pl-10"
            />
          </div>
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {filtered.map((r) => {
            const inner = (
              <>
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.05]"
                  style={{ color: r.color }}
                >
                  <r.icon aria-hidden className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 font-semibold text-[var(--text)]">
                    {r.title}
                    {r.external ? (
                      <ArrowUpRight aria-hidden className="h-3.5 w-3.5 text-[var(--text-3)]" />
                    ) : (
                      <ArrowUpRight aria-hidden className="h-3.5 w-3.5 text-[var(--text-3)]" />
                    )}
                  </span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-[var(--text-3)]">
                    {r.desc}
                  </span>
                </span>
                <span className="chip shrink-0 self-start">{r.tag}</span>
              </>
            );
            return (
              <li key={r.title} className="flex">
                {r.external ? (
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="panel panel-hover flex w-full items-start gap-3.5 p-5"
                  >
                    {inner}
                  </a>
                ) : (
                  <Link href={r.href} className="panel panel-hover flex w-full items-start gap-3.5 p-5">
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {filtered.length === 0 && (
          <div className="panel mt-6 p-10 text-center text-sm text-[var(--text-3)]">
            Nada coincide con “{search}”.
          </div>
        )}

        <div className="panel mt-8 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">¿Necesitas algo concreto?</h2>
            <p className="mt-1 text-sm text-[var(--text-3)]">
              Si falta documentación de algo que uso, pídela y la publico aquí.
            </p>
          </div>
          <Link href="/contact" className="btn btn-ghost shrink-0">
            <Mail aria-hidden className="h-4 w-4" />
            Pedir recurso
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--text-3)]">
          Sin contadores de descargas ni archivos de ejemplo: se publican cuando haya archivos
          reales.
        </p>
      </div>
    </div>
  );
}
