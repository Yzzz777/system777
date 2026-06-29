"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, CheckCircle } from "lucide-react";
import { FadeIn } from "@/components/ui/Animations";

const enrolledCourses = [
  { title: "Guía Completa de JavaScript", slug: "javascript-complete", progress: 75, total: 42, completed: 31, category: "Programación", image: "JS" },
  { title: "Curso Completo de React", slug: "react-complete", progress: 40, total: 60, completed: 24, category: "Frontend", image: "R" },
  { title: "Hacking Ético Completo", slug: "ethical-hacking", progress: 15, total: 80, completed: 12, category: "Ciberseguridad", image: "HE" },
];

export default function DashboardCoursesPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-5xl px-4">
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF88] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>

        <FadeIn>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Mis Cursos</h1>
            <p className="mt-1 text-sm text-gray-400">Continúa donde lo dejaste</p>
          </div>
        </FadeIn>

        <div className="space-y-4">
          {enrolledCourses.map((course) => (
            <FadeIn key={course.slug}>
              <Link href={`/course/${course.slug}`} className="glass block rounded-2xl p-6 transition-all hover:border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#00FF88]/10 text-lg font-bold text-[#00FF88]">
                    {course.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">{course.title}</h3>
                      <span className="text-sm text-[#00FF88]">{course.progress}%</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{course.category}</p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#00FF88] to-[#00C8FF] transition-all" style={{ width: `${course.progress}%` }} />
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {course.completed}/{course.total} lecciones</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> En progreso</span>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {enrolledCourses.length === 0 && (
          <FadeIn>
            <div className="glass rounded-2xl p-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-600" />
              <h3 className="mt-4 text-lg font-semibold text-white">No tienes cursos inscritos</h3>
              <p className="mt-2 text-sm text-gray-400">Explora nuestros cursos y empieza a aprender</p>
              <Link href="/courses" className="mt-6 inline-flex rounded-xl bg-[#00FF88] px-6 py-3 text-sm font-semibold text-black hover:bg-[#00CC6A]">
                Ver Cursos
              </Link>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
