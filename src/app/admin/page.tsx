"use client";

import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, FileText, MessageSquare, ShoppingCart, BarChart3, Settings, Shield, LogOut, Bell, TrendingUp, DollarSign, Eye, ChevronRight } from "lucide-react";

const stats = [
  { label: "Usuarios Totales", value: "12,486", change: "+12%", icon: Users, color: "#00FF88" },
  { label: "Cursos Totales", value: "254", change: "+5%", icon: BookOpen, color: "#00C8FF" },
  { label: "Ingresos", value: "$48,295", change: "+18%", icon: DollarSign, color: "#7C3AED" },
  { label: "Visitas", value: "156K", change: "+8%", icon: Eye, color: "#FFD93D" },
];

const recentUsers = [
  { name: "María García", email: "maria@ejemplo.com", role: "Estudiante", joined: "Hace 2 horas" },
  { name: "Alex Chen", email: "alex@ejemplo.com", role: "Estudiante", joined: "Hace 5 horas" },
  { name: "Sarah Wilson", email: "sarah@ejemplo.com", role: "Instructor", joined: "Hace 1 día" },
  { name: "Carlos Ruiz", email: "carlos@ejemplo.com", role: "Estudiante", joined: "Hace 2 días" },
];

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

export default function AdminPage() {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r border-white/5 bg-[#0A0A0A] lg:block">
        <div className="p-6">
          <div className="flex items-center gap-2 text-lg font-bold"><Shield className="h-5 w-5 text-[#00FF88]" /><span className="text-white">Panel Admin</span></div>
        </div>
        <nav className="space-y-1 px-3">
          {adminNav.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
              <item.icon className="h-4 w-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-white/5 p-3">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
            <LogOut className="h-4 w-4" />Volver al Panel
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
            <p className="mt-1 text-sm text-gray-400">Gestiona tu plataforma</p>
          </div>
          <button className="relative rounded-xl border border-white/10 p-2.5 text-gray-400 hover:bg-white/5 hover:text-white">
            <Bell className="h-5 w-5" /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: s.color + "15" }}><s.icon className="h-5 w-5" style={{ color: s.color }} /></div>
                <span className="flex items-center gap-1 text-xs text-[#00FF88]"><TrendingUp className="h-3 w-3" /> {s.change}</span>
              </div>
              <div className="mt-3 text-2xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Usuarios Recientes</h2>
              <Link href="/admin/users" className="text-sm text-[#00FF88] hover:underline">Ver Todos</Link>
            </div>
            <div className="mt-4 space-y-3">
              {recentUsers.map((user, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00FF88]/10 text-xs font-bold text-[#00FF88]">{user.name.split(" ").map(n => n[0]).join("")}</div>
                    <div><div className="text-sm font-medium text-white">{user.name}</div><div className="text-xs text-gray-500">{user.email}</div></div>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-400">{user.role}</span>
                    <div className="mt-1 text-xs text-gray-500">{user.joined}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white">Acciones Rápidas</h2>
            <div className="mt-4 space-y-2">
              {[
                { label: "Crear Nuevo Curso", href: "/admin/courses/new", icon: BookOpen },
                { label: "Escribir Artículo", href: "/admin/blog/new", icon: FileText },
                { label: "Gestionar Usuarios", href: "/admin/users", icon: Users },
                { label: "Ver Analíticas", href: "/admin/analytics", icon: BarChart3 },
                { label: "Configuración", href: "/admin/settings", icon: Settings },
              ].map((action) => (
                <Link key={action.href} href={action.href} className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                  <div className="flex items-center gap-3"><action.icon className="h-4 w-4 text-[#00FF88]" />{action.label}</div>
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
