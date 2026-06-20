"use client";

import Link from "next/link";
import { LayoutDashboard, BookOpen, Award, Settings, LogOut, Clock, TrendingUp, Bell, CreditCard, Shield, ChevronRight } from "lucide-react";

const stats = [
  { label: "Cursos Inscritos", value: "5", icon: BookOpen, color: "#00FF88" },
  { label: "Certificados", value: "2", icon: Award, color: "#00C8FF" },
  { label: "Horas Aprendidas", value: "48", icon: Clock, color: "#7C3AED" },
  { label: "Nivel de Habilidad", value: "Intermedio", icon: TrendingUp, color: "#FFD93D" },
];

const enrolledCourses = [
  { title: "Guía Completa de JavaScript", progress: 75, total: 42, completed: 31 },
  { title: "Curso Completo de React", progress: 40, total: 60, completed: 24 },
  { title: "Hacking Ético Completo", progress: 15, total: 80, completed: 12 },
];

const sidebarItems = [
  { label: "Panel", icon: LayoutDashboard, href: "/dashboard", active: true },
  { label: "Mis Cursos", icon: BookOpen, href: "/dashboard/courses" },
  { label: "Certificados", icon: Award, href: "/dashboard/certificates" },
  { label: "Actividad", icon: Clock, href: "/dashboard/activity" },
  { label: "Suscripción", icon: CreditCard, href: "/dashboard/subscription" },
  { label: "Seguridad", icon: Shield, href: "/dashboard/security" },
  { label: "Configuración", icon: Settings, href: "/dashboard/settings" },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r border-white/5 bg-[#0A0A0A] lg:block">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00FF88]/10 text-sm font-bold text-[#00FF88]">JD</div>
            <div>
              <div className="text-sm font-semibold text-white">Juan Pérez</div>
              <div className="text-xs text-gray-500">@juanperez</div>
            </div>
          </div>
        </div>
        <nav className="space-y-1 px-3">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${item.active ? "bg-[#00FF88]/10 text-[#00FF88]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
              <item.icon className="h-4 w-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-white/5 p-3">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
            <LogOut className="h-4 w-4" />Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Panel de Control</h1>
            <p className="mt-1 text-sm text-gray-400">Bienvenido de nuevo, Juan!</p>
          </div>
          <button className="relative rounded-xl border border-white/10 p-2.5 text-gray-400 hover:bg-white/5 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#00FF88]" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: s.color + "15" }}>
                <s.icon className="h-5 w-5" style={{ color: s.color }} />
              </div>
              <div className="mt-3 text-2xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Continuar Aprendiendo</h2>
            <Link href="/dashboard/courses" className="text-sm text-[#00FF88] hover:underline">Ver Todos</Link>
          </div>
          <div className="mt-4 space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.title} className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">{course.title}</h3>
                  <span className="text-sm text-[#00FF88]">{course.progress}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#00FF88] to-[#00C8FF] transition-all" style={{ width: `${course.progress}%` }} />
                </div>
                <div className="mt-2 text-xs text-gray-500">{course.completed} de {course.total} lecciones completadas</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white">Acciones Rápidas</h2>
            <div className="mt-4 space-y-2">
              {[
                { label: "Explorar Cursos", href: "/courses" },
                { label: "Ver Certificados", href: "/dashboard/certificates" },
                { label: "Actualizar Perfil", href: "/dashboard/settings" },
                { label: "Unirse a la Comunidad", href: "/community" },
              ].map((action) => (
                <Link key={action.href} href={action.href} className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                  {action.label}<ChevronRight className="h-4 w-4 text-gray-500" />
                </Link>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white">Actividad Reciente</h2>
            <div className="mt-4 space-y-4">
              {[
                { text: "Completaste la lección: React Hooks", time: "Hace 2 horas" },
                { text: "Obtuviste certificado: JavaScript Básico", time: "Hace 1 día" },
                { text: "Te inscribiste en: Hacking Ético", time: "Hace 3 días" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-[#00FF88]" />
                  <div>
                    <div className="text-sm text-gray-300">{activity.text}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
