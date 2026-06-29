"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Users, BookOpen, FileText, MessageSquare, ShoppingCart, BarChart3, Settings, Shield, LogOut, Menu, X } from "lucide-react";

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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-[#0A0A0A] transform transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between p-6">
          <Link href="/admin" className="flex items-center gap-2 text-lg font-bold"><Shield className="h-5 w-5 text-[#00FF88]" /><span className="text-white">Panel Admin</span></Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <nav className="space-y-1 px-3">
          {adminNav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${pathname === item.href ? "bg-[#00FF88]/10 text-[#00FF88]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
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

      <main className="flex-1 min-w-0">
        <div className="flex items-center gap-3 border-b border-white/5 bg-[#0A0A0A] p-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"><Menu className="h-5 w-5" /></button>
          <span className="text-sm font-bold text-white">Panel Admin</span>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
