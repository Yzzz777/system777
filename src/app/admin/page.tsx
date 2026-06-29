"use client";

import Link from "next/link";
import { Users, BookOpen, FileText, BarChart3, Settings, Bell, TrendingUp, DollarSign, Eye, ChevronRight } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const stats = [
  { label: "Usuarios Totales", value: "12,486", change: "+12%", icon: Users, color: "#00FF88" },
  { label: "Cursos Totales", value: "254", change: "+5%", icon: BookOpen, color: "#00C8FF" },
  { label: "Ingresos", value: "$48,295", change: "+18%", icon: DollarSign, color: "#7C3AED" },
  { label: "Visitas", value: "156K", change: "+8%", icon: Eye, color: "#FFD93D" },
];

const recentUsers = [
  { name: "María García", email: "maria@ejemplo.com", role: "Estudiante", joined: "Hace 2 horas" },
  { name: "Alex Chen", email: "alex@ejemplo.com", role: "Estudiante", joined: "Hace 5 horas" },
  { name: "Sarah Wilson", email: "sarah@ejemplo.com", role: "Instructora", joined: "Hace 1 día" },
  { name: "Carlos Ruiz", email: "carlos@ejemplo.com", role: "Estudiante", joined: "Hace 2 días" },
];

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
          <p className="mt-1 text-sm text-gray-400">Gestiona tu plataforma</p>
        </div>
        <button className="relative rounded-xl border border-white/10 p-2.5 text-gray-400 hover:bg-white/5 hover:text-white">
          <Bell className="h-5 w-5" /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl" style={{ backgroundColor: s.color + "15" }}><s.icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: s.color }} /></div>
              <span className="flex items-center gap-1 text-[10px] sm:text-xs text-[#00FF88]"><TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> {s.change}</span>
            </div>
            <div className="mt-2 sm:mt-3 text-xl sm:text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs sm:text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Usuarios Recientes</h2>
            <Link href="/admin/users" className="text-sm text-[#00FF88] hover:underline">Ver Todos</Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentUsers.map((user, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00FF88]/10 text-xs font-bold text-[#00FF88]">{user.name.split(" ").map(n => n[0]).join("")}</div>
                  <div><div className="text-sm font-medium text-white">{user.name}</div><div className="text-xs text-gray-500 hidden sm:block">{user.email}</div></div>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-400">{user.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-white">Acciones Rápidas</h2>
          <div className="mt-4 space-y-2">
            {[
              { label: "Crear Nuevo Curso", href: "/admin/courses", icon: BookOpen },
              { label: "Escribir Artículo", href: "/admin/blog", icon: FileText },
              { label: "Gestionar Usuarios", href: "/admin/users", icon: Users },
              { label: "Ver Analíticas", href: "/admin/analytics", icon: BarChart3 },
              { label: "Configuración", href: "/admin/settings", icon: Settings },
            ].map((action) => (
              <Link key={action.href} href={action.href} className="flex items-center justify-between rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                <div className="flex items-center gap-3"><action.icon className="h-4 w-4 text-[#00FF88]" />{action.label}</div>
                <ChevronRight className="h-4 w-4 text-gray-500" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
