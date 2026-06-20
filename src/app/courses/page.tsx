"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Clock, Users, Star, BookOpen, Filter } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/ui/Animations";

const allCourses = [
  { slug: "html-fundamentals", title: "Fundamentos de HTML", category: "Programación", level: "Principiante", duration: "8h", students: 2500, rating: 4.9, instructor: "System 777", price: 0, isPremium: false },
  { slug: "css-masterclass", title: "Masterclass de CSS", category: "Desarrollo Web", level: "Principiante", duration: "12h", students: 2100, rating: 4.8, instructor: "System 777", price: 0, isPremium: false },
  { slug: "javascript-complete", title: "Guía Completa de JavaScript", category: "Programación", level: "Intermedio", duration: "25h", students: 3200, rating: 4.9, instructor: "System 777", price: 0, isPremium: false },
  { slug: "react-complete", title: "Curso Completo de React", category: "Frontend", level: "Intermedio", duration: "30h", students: 1800, rating: 4.8, instructor: "System 777", price: 29.99, isPremium: true },
  { slug: "nextjs-mastery", title: "Dominio de Next.js", category: "Full Stack", level: "Avanzado", duration: "35h", students: 1500, rating: 4.9, instructor: "System 777", price: 39.99, isPremium: true },
  { slug: "python-complete", title: "Curso Completo de Python", category: "Programación", level: "Principiante", duration: "20h", students: 2800, rating: 4.8, instructor: "System 777", price: 0, isPremium: false },
  { slug: "ethical-hacking", title: "Hacking Ético Completo", category: "Ciberseguridad", level: "Intermedio", duration: "40h", students: 1200, rating: 4.9, instructor: "System 777", price: 49.99, isPremium: true },
  { slug: "linux-admin", title: "Administración de Linux", category: "Linux", level: "Principiante", duration: "15h", students: 1900, rating: 4.7, instructor: "System 777", price: 0, isPremium: false },
  { slug: "discord-js-bot", title: "Desarrollo de Bots con Discord.js", category: "Discord", level: "Intermedio", duration: "20h", students: 900, rating: 4.8, instructor: "System 777", price: 19.99, isPremium: true },
  { slug: "nodejs-backend", title: "Desarrollo Backend con Node.js", category: "Backend", level: "Intermedio", duration: "25h", students: 1600, rating: 4.8, instructor: "System 777", price: 29.99, isPremium: true },
  { slug: "postgresql-database", title: "PostgreSQL Completo", category: "Bases de Datos", level: "Intermedio", duration: "18h", students: 800, rating: 4.7, instructor: "System 777", price: 0, isPremium: false },
  { slug: "kubernetes-docker", title: "Docker y Kubernetes", category: "DevOps", level: "Avanzado", duration: "22h", students: 700, rating: 4.9, instructor: "System 777", price: 39.99, isPremium: true },
  { slug: "penetration-testing", title: "Pruebas de Penetración", category: "Ciberseguridad", level: "Avanzado", duration: "35h", students: 600, rating: 4.9, instructor: "System 777", price: 59.99, isPremium: true },
  { slug: "network-security", title: "Seguridad de Redes", category: "Ciberseguridad", level: "Intermedio", duration: "20h", students: 950, rating: 4.8, instructor: "System 777", price: 29.99, isPremium: true },
  { slug: "react-native-mobile", title: "Desarrollo Móvil con React Native", category: "Móvil", level: "Intermedio", duration: "28h", students: 1100, rating: 4.7, instructor: "System 777", price: 34.99, isPremium: true },
  { slug: "python-django", title: "Python Django Full Stack", category: "Backend", level: "Intermedio", duration: "32h", students: 1300, rating: 4.8, instructor: "System 777", price: 34.99, isPremium: true },
  { slug: "cloud-aws", title: "Cloud Computing con AWS", category: "Cloud", level: "Intermedio", duration: "25h", students: 850, rating: 4.8, instructor: "System 777", price: 39.99, isPremium: true },
  { slug: "malware-analysis", title: "Análisis de Malware", category: "Ciberseguridad", level: "Experto", duration: "30h", students: 400, rating: 4.9, instructor: "System 777", price: 69.99, isPremium: true },
  { slug: "git-github-complete", title: "Git y GitHub Completo", category: "Programación", level: "Principiante", duration: "8h", students: 2200, rating: 4.7, instructor: "System 777", price: 0, isPremium: false },
  { slug: "typescript-complete", title: "TypeScript Completo", category: "Programación", level: "Intermedio", duration: "15h", students: 1700, rating: 4.8, instructor: "System 777", price: 0, isPremium: false },
];

const categories = ["Todos", "Programación", "Desarrollo Web", "Frontend", "Backend", "Full Stack", "Móvil", "Ciberseguridad", "Linux", "Discord", "Cloud", "DevOps", "Bases de Datos"];
const levels = ["Todos los Niveles", "Principiante", "Intermedio", "Avanzado", "Experto"];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [level, setLevel] = useState("Todos los Niveles");

  const filtered = allCourses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "Todos" || c.category === category;
    const matchLevel = level === "Todos los Niveles" || c.level === level;
    return matchSearch && matchCategory && matchLevel;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Explorar Cursos</h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">{allCourses.length}+ cursos de programación, ciberseguridad y más</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Buscar cursos..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#00FF88]/50">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#00FF88]/50">
              {levels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((course) => (
            <StaggerItem key={course.slug}>
              <HoverScale>
                <Link href={`/course/${course.slug}`} className="group glass rounded-2xl overflow-hidden block">
                  <div className="relative h-40 bg-gradient-to-br from-[#00FF88]/10 to-[#00C8FF]/10">
                    <div className="absolute inset-0 flex items-center justify-center"><BookOpen className="h-12 w-12 text-[#00FF88]/30" /></div>
                    {course.isPremium ? (
                      <div className="absolute right-3 top-3 rounded-full bg-[#7C3AED] px-2 py-0.5 text-xs font-medium text-white">Premium</div>
                    ) : (
                      <div className="absolute right-3 top-3 rounded-full bg-[#00FF88] px-2 py-0.5 text-xs font-medium text-black">Gratis</div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-medium text-[#00C8FF]">{course.category}</div>
                    <h3 className="mt-1 text-lg font-semibold text-white group-hover:text-[#00FF88] transition-colors line-clamp-1">{course.title}</h3>
                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.students.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-[#FFD93D] text-[#FFD93D]" /> {course.rating}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">{course.price === 0 ? "Gratis" : `$${course.price}`}</span>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-400">{course.level}</span>
                    </div>
                  </div>
                </Link>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {filtered.length === 0 && (
          <div className="mt-20 text-center">
            <Filter className="mx-auto h-12 w-12 text-gray-600" />
            <p className="mt-4 text-gray-400">No se encontraron cursos con esos filtros</p>
          </div>
        )}
      </div>
    </div>
  );
}
