"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Clock, User, Tag } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/ui/Animations";

const posts = [
  { slug: "getting-started-with-linux", title: "Primeros Pasos con Linux: Guía Completa", category: "Linux", author: "System 777", date: "2025-01-15", readTime: "8 min", excerpt: "Aprende los fundamentos de Linux desde cero. Esta guía cubre instalación, comandos básicos, navegación del sistema de archivos y más." },
  { slug: "cybersecurity-best-practices-2025", title: "Mejores Prácticas de Ciberseguridad 2025", category: "Ciberseguridad", author: "System 777", date: "2025-01-12", readTime: "12 min", excerpt: "Mantente adelante de las amenazas con estas prácticas esenciales de ciberseguridad que todo desarrollador debería conocer." },
  { slug: "build-discord-bot-discordjs", title: "Crea Tu Primer Bot de Discord con Discord.js", category: "Discord", author: "System 777", date: "2025-01-10", readTime: "15 min", excerpt: "Tutorial paso a paso para crear un bot de Discord completamente funcional usando Discord.js y Node.js." },
  { slug: "nextjs-15-new-features", title: "Next.js 15: Todas las Nuevas Funcionalidades", category: "Programación", author: "System 777", date: "2025-01-08", readTime: "10 min", excerpt: "Explora las últimas funcionalidades de Next.js 15 incluyendo mejoras de rendimiento, nuevas APIs y experiencia de desarrollo." },
  { slug: "docker-for-beginners", title: "Docker para Principiantes: Contenedoriza Tus Apps", category: "DevOps", author: "System 777", date: "2025-01-05", readTime: "14 min", excerpt: "Aprende Docker desde cero. Entiende contenedores, imágenes, Dockerfiles y cómo desplegar tus aplicaciones." },
  { slug: "ethical-hacking-roadmap", title: "Roadmap Completo de Hacking Ético 2025", category: "Ciberseguridad", author: "System 777", date: "2025-01-03", readTime: "18 min", excerpt: "Un roadmap completo para convertirte en hacker ético. Desde fundamentos de redes hasta pruebas de penetración avanzadas." },
];

const blogCategories = ["Todos", "Programación", "Linux", "Ciberseguridad", "Discord", "DevOps", "Cloud", "IA"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  const filtered = posts.filter((p) => {
    const matchCat = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Blog</h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">Tutoriales, guías y conocimientos sobre programación, ciberseguridad y tecnología</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Buscar artículos..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-6 flex flex-wrap gap-2">
            {blogCategories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`rounded-full px-4 py-2 text-sm transition-colors ${selectedCategory === cat ? "bg-[#00FF88] text-black" : "border border-white/10 text-gray-400 hover:border-white/20 hover:text-white"}`}>
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        <StaggerContainer className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <StaggerItem key={post.slug}>
              <HoverScale>
                <Link href={`/blog/${post.slug}`} className="group glass rounded-2xl overflow-hidden block">
                  <div className="h-48 bg-gradient-to-br from-[#00FF88]/10 to-[#00C8FF]/10" />
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="rounded-full bg-[#00FF88]/10 px-2 py-0.5 text-[#00FF88]">{post.category}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-white group-hover:text-[#00FF88] transition-colors line-clamp-2">{post.title}</h2>
                    <p className="mt-2 text-sm text-gray-400 line-clamp-2">{post.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                      <span>{new Date(post.date).toLocaleDateString("es-ES")}</span>
                    </div>
                  </div>
                </Link>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {filtered.length === 0 && <div className="mt-20 text-center text-gray-400">No se encontraron artículos</div>}
      </div>
    </div>
  );
}
