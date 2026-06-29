"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  ShoppingCart,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  Plus,
  X,
  ToggleLeft,
  ToggleRight,
  Star,

} from "lucide-react";

const adminNav = [
  { label: "Panel", icon: LayoutDashboard, href: "/admin" },
  { label: "Usuarios", icon: Users, href: "/admin/users" },
  { label: "Cursos", icon: BookOpen, href: "/admin/courses" },
  { label: "Blog", icon: FileText, href: "/admin/blog" },
  { label: "Mensajes", icon: MessageSquare, href: "/admin/messages" },
  { label: "Tienda", icon: ShoppingCart, href: "/admin/store" },
  { label: "Analíticas", icon: BarChart3, href: "/admin/analytics" },
  { label: "Seguridad", icon: Shield, href: "/admin/security" },
  { label: "Configuración", icon: Settings, href: "/admin/settings" },
];

interface Course {
  id: number;
  title: string;
  category: string;
  level: string;
  price: number;
  active: boolean;
  isPremium: boolean;
  description: string;
}

const initialCourses: Course[] = [
  { id: 1, title: "Desarrollo Web Full Stack", category: "Programación", level: "Intermedio", price: 49.99, active: true, isPremium: true, description: "Aprende a crear aplicaciones web completas desde cero." },
  { id: 2, title: "Introducción a Python", category: "Programación", level: "Principiante", price: 29.99, active: true, isPremium: false, description: "Curso básico para aprender Python desde cero." },
  { id: 3, title: "Diseño UI/UX con Figma", category: "Diseño", level: "Principiante", price: 39.99, active: true, isPremium: true, description: "Domina las herramientas de diseño de interfaces." },
  { id: 4, title: "Machine Learning con TensorFlow", category: "Data Science", level: "Avanzado", price: 79.99, active: false, isPremium: true, description: "Construye modelos de inteligencia artificial." },
  { id: 5, title: "Marketing Digital", category: "Marketing", level: "Principiante", price: 19.99, active: true, isPremium: false, description: "Estrategias efectivas de marketing online." },
  { id: 6, title: "Ciberseguridad Práctica", category: "Seguridad", level: "Intermedio", price: 59.99, active: true, isPremium: true, description: "Protege sistemas y redes de amenazas." },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "Programación",
    level: "Principiante",
    price: 0,
    isPremium: false,
  });

  const toggleActive = (id: number) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const addCourse = () => {
    if (!newCourse.title) return;
    setCourses((prev) => [
      ...prev,
      { ...newCourse, id: Date.now(), active: true },
    ]);
    setNewCourse({ title: "", description: "", category: "Programación", level: "Principiante", price: 0, isPremium: false });
    setShowModal(false);
  };

  const deleteCourse = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r border-white/5 bg-[#0A0A0A] lg:block">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2 text-lg font-bold">
            <Shield className="h-5 w-5 text-[#00FF88]" />
            <span className="text-white">Panel Admin</span>
          </Link>
        </div>
        <nav className="space-y-1 px-3">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                item.href === "/admin/courses"
                  ? "bg-[#00FF88]/10 text-[#00FF88]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-white/5 p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Volver al Panel
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/admin" className="mb-2 inline-block text-sm text-[#00FF88] hover:underline">
              &larr; Volver al Panel
            </Link>
            <h1 className="text-2xl font-bold text-white">Gestión de Cursos</h1>
            <p className="mt-1 text-sm text-gray-400">{courses.length} cursos</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#00FF88] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#00FF88]/90"
          >
            <Plus className="h-4 w-4" />
            Crear Curso
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-lg px-3 py-1.5 text-xs ${viewMode === "grid" ? "bg-[#00FF88]/10 text-[#00FF88]" : "bg-white/5 text-gray-400"}`}
          >
            Cuadrícula
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-lg px-3 py-1.5 text-xs ${viewMode === "list" ? "bg-[#00FF88]/10 text-[#00FF88]" : "bg-white/5 text-gray-400"}`}
          >
            Lista
          </button>
        </div>

        {viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <div key={course.id} className="glass rounded-2xl p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00FF88]/10">
                    <BookOpen className="h-5 w-5 text-[#00FF88]" />
                  </div>
                  <button onClick={() => toggleActive(course.id)} title={course.active ? "Desactivar" : "Activar"}>
                    {course.active ? (
                      <ToggleRight className="h-6 w-6 text-[#00FF88]" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-500" />
                    )}
                  </button>
                </div>
                <h3 className="mt-3 font-semibold text-white">{course.title}</h3>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">{course.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-gray-400">{course.category}</span>
                  <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-gray-400">{course.level}</span>
                  {course.isPremium && (
                    <span className="flex items-center gap-1 rounded-full bg-[#FFD93D]/10 px-2.5 py-0.5 text-xs text-[#FFD93D]">
                      <Star className="h-3 w-3" /> Premium
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-[#00FF88]">${course.price}</span>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-xs text-gray-500 uppercase">
                    <th className="px-6 py-4">Curso</th>
                    <th className="px-6 py-4 hidden md:table-cell">Categoría</th>
                    <th className="px-6 py-4 hidden sm:table-cell">Nivel</th>
                    <th className="px-6 py-4">Precio</th>
                    <th className="px-6 py-4 hidden sm:table-cell">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{course.title}</div>
                        <div className="text-xs text-gray-500">{course.category}</div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-gray-400">{course.level}</td>
                      <td className="px-6 py-4 hidden sm:table-cell text-gray-400">{course.level}</td>
                      <td className="px-6 py-4 font-semibold text-[#00FF88]">${course.price}</td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <button onClick={() => toggleActive(course.id)}>
                          {course.active ? (
                            <span className="rounded-full bg-[#00FF88]/10 px-2.5 py-0.5 text-xs text-[#00FF88]">Activo</span>
                          ) : (
                            <span className="rounded-full bg-gray-500/10 px-2.5 py-0.5 text-xs text-gray-400">Inactivo</span>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => deleteCourse(course.id)} className="rounded-lg p-2 text-red-400 hover:bg-red-500/10">
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Crear Nuevo Curso</h2>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-gray-400 hover:bg-white/5">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-gray-400">Título</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50"
                  placeholder="Nombre del curso"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Descripción</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50"
                  placeholder="Descripción del curso"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Categoría</label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50"
                  >
                    <option>Programación</option>
                    <option>Diseño</option>
                    <option>Data Science</option>
                    <option>Marketing</option>
                    <option>Seguridad</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Nivel</label>
                  <select
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50"
                  >
                    <option>Principiante</option>
                    <option>Intermedio</option>
                    <option>Avanzado</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Precio ($)</label>
                  <input
                    type="number"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Tipo</label>
                  <button
                    onClick={() => setNewCourse({ ...newCourse, isPremium: !newCourse.isPremium })}
                    className={`flex w-full items-center gap-2 rounded-xl border px-4 py-2.5 text-sm ${
                      newCourse.isPremium ? "border-[#FFD93D]/30 bg-[#FFD93D]/5 text-[#FFD93D]" : "border-white/10 bg-white/5 text-gray-400"
                    }`}
                  >
                    <Star className="h-4 w-4" />
                    {newCourse.isPremium ? "Premium" : "Gratuito"}
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5">
                  Cancelar
                </button>
                <button onClick={addCourse} className="flex-1 rounded-xl bg-[#00FF88] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#00FF88]/90">
                  Crear Curso
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
