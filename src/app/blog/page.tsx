"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Clock, User, Tag, ArrowRight } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/ui/Animations";

const posts = [
  {
    slug: "system-777-features",
    title: "System 777: Todo lo que Puede Hacer tu Bot",
    category: "Discord",
    author: "System 777",
    date: "2026-03-01",
    readTime: "10 min",
    excerpt: "Tour completo por las 100+ funcionalidades de System 777: moderacion, musica, economia, niveles, tickets, proteccion y mas.",
  },
  {
    slug: "discord-bot-security",
    title: "Protege tu Servidor de Discord: Guia Completa",
    category: "Ciberseguridad",
    author: "System 777",
    date: "2026-02-20",
    readTime: "12 min",
    excerpt: "Anti-raid, anti-nuke, automod, anti-phishing: como proteger tu comunidad de las amenazas mas comunes.",
  },
  {
    slug: "nextjs-15-deploy",
    title: "Deploy de Next.js 15 en Cloudflare Pages",
    category: "Programacion",
    author: "System 777",
    date: "2026-02-10",
    readTime: "8 min",
    excerpt: "Paso a paso para desplegar una app de Next.js 15 en Cloudflare Pages conEdge Runtime.",
  },
  {
    slug: "linux-vps-setup",
    title: "Configura tu VPS con Ubuntu 24.04",
    category: "Linux",
    author: "System 777",
    date: "2026-01-25",
    readTime: "15 min",
    excerpt: "Desde cero: instalacion, configuracion SSH, firewalls, PM2 y despliegue de aplicaciones.",
  },
  {
    slug: "discord-oauth2-webapp",
    title: "Autenticacion con Discord OAuth2 en Next.js",
    category: "Programacion",
    author: "System 777",
    date: "2026-01-15",
    readTime: "10 min",
    excerpt: "Implementa login con Discord en tu web usando NextAuth.js v5 y sesiones seguras.",
  },
  {
    slug: "bot-economy-system",
    title: "Crea un Sistema de Economia para tu Bot",
    category: "Discord",
    author: "System 777",
    date: "2026-01-05",
    readTime: "14 min",
    excerpt: "Monedas, banco, daily, work, slots, rob y ranking: construye una economia completa desde cero.",
  },
];

const allCategories = ["Todos", ...new Set(posts.map((p) => p.category))];

const catColors: Record<string, string> = {
  Discord: "#5865F2",
  Ciberseguridad: "#ED4245",
  Programacion: "#00FF88",
  Linux: "#FCC624",
};

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  const filtered = posts.filter((p) => {
    const matchCat = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Blog</h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">Articulos sobre programacion, ciberseguridad, Discord y Linux</p>
          </div>
        </FadeIn>

        {/* Search */}
        <FadeIn delay={0.1}>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Buscar articulos..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" />
            </div>
          </div>
        </FadeIn>

        {/* Categories */}
        <FadeIn delay={0.15}>
          <div className="mt-6 flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`rounded-full px-4 py-2 text-sm transition-colors ${selectedCategory === cat ? "bg-[#00FF88] text-black" : "border border-white/10 text-gray-400 hover:border-white/20 hover:text-white"}`}>
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Posts */}
        <StaggerContainer className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <StaggerItem key={post.slug}>
              <HoverScale>
                <Link href={`/blog/${post.slug}`} className="group glass rounded-2xl overflow-hidden block">
                  <div className="h-40 bg-gradient-to-br from-[#00FF88]/10 to-[#00C8FF]/10 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Tag className="h-12 w-12 text-white/5" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="rounded-full px-2 py-0.5 font-medium" style={{ backgroundColor: (catColors[post.category] || "#00FF88") + "15", color: catColors[post.category] || "#00FF88" }}>
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500"><Clock className="h-3 w-3" /> {post.readTime}</span>
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-white group-hover:text-[#00FF88] transition-colors line-clamp-2">{post.title}</h2>
                    <p className="mt-2 text-sm text-gray-400 line-clamp-2">{post.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                      <span className="flex items-center gap-1 text-[#00FF88] group-hover:gap-2 transition-all">Leer <ArrowRight className="h-3 w-3" /></span>
                    </div>
                  </div>
                </Link>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {filtered.length === 0 && <div className="mt-20 text-center text-gray-400">No se encontraron articulos</div>}
      </div>
    </div>
  );
}
