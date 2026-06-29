"use client";

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
  TrendingUp,
  DollarSign,
  Eye,

  ArrowUpRight,
  ArrowDownRight,
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

const stats = [
  { label: "Usuarios Totales", value: "12,486", change: "+12%", up: true, icon: Users, color: "#00FF88" },
  { label: "Cursos Totales", value: "254", change: "+5%", up: true, icon: BookOpen, color: "#00C8FF" },
  { label: "Ingresos Totales", value: "$48,295", change: "+18%", up: true, icon: DollarSign, color: "#7C3AED" },
  { label: "Visitas de Página", value: "156,234", change: "+8%", up: true, icon: Eye, color: "#FFD93D" },
];

const monthlyData = [
  { month: "Ene", users: 120, revenue: 3200 },
  { month: "Feb", users: 180, revenue: 4100 },
  { month: "Mar", users: 250, revenue: 5800 },
  { month: "Abr", users: 310, revenue: 6200 },
  { month: "May", users: 420, revenue: 8900 },
  { month: "Jun", users: 380, revenue: 7500 },
];

const topCourses = [
  { name: "Desarrollo Web Full Stack", students: 1245, revenue: "$12,450" },
  { name: "Introducción a Python", students: 980, revenue: "$7,840" },
  { name: "Diseño UI/UX con Figma", students: 756, revenue: "$9,072" },
  { name: "Machine Learning", students: 534, revenue: "$10,680" },
];

export default function AnalyticsPage() {
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
                item.href === "/admin/analytics"
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
        <div className="mb-6">
          <Link href="/admin" className="mb-2 inline-block text-sm text-[#00FF88] hover:underline">
            &larr; Volver al Panel
          </Link>
          <h1 className="text-2xl font-bold text-white">Analíticas</h1>
          <p className="mt-1 text-sm text-gray-400">Resumen de rendimiento de la plataforma</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: s.color + "15" }}
                >
                  <s.icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
                <span className={`flex items-center gap-1 text-xs ${s.up ? "text-[#00FF88]" : "text-red-400"}`}>
                  {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {s.change}
                </span>
              </div>
              <div className="mt-3 text-2xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <BarChart3 className="h-5 w-5 text-[#00FF88]" />
                Usuarios por Mes
              </h2>
              <span className="text-xs text-gray-500">Últimos 6 meses</span>
            </div>
            <div className="flex items-end gap-3 h-48">
              {monthlyData.map((d) => {
                const maxVal = Math.max(...monthlyData.map((x) => x.users));
                const height = (d.users / maxVal) * 100;
                return (
                  <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs text-gray-400">{d.users}</span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-[#00FF88]/20 to-[#00FF88]/60 transition-all"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-500">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <DollarSign className="h-5 w-5 text-[#00FF88]" />
                Ingresos por Mes
              </h2>
              <span className="text-xs text-gray-500">Últimos 6 meses</span>
            </div>
            <div className="flex items-end gap-3 h-48">
              {monthlyData.map((d) => {
                const maxVal = Math.max(...monthlyData.map((x) => x.revenue));
                const height = (d.revenue / maxVal) * 100;
                return (
                  <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs text-gray-400">${(d.revenue / 1000).toFixed(1)}k</span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-[#7C3AED]/20 to-[#7C3AED]/60 transition-all"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-500">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <TrendingUp className="h-5 w-5 text-[#00FF88]" />
              Cursos Más Populares
            </h2>
            <div className="space-y-3">
              {topCourses.map((course, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00FF88]/10 text-xs font-bold text-[#00FF88]">
                      #{i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{course.name}</div>
                      <div className="text-xs text-gray-500">{course.students} estudiantes</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#00FF88]">{course.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
