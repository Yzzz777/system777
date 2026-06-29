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
  Edit2,
  Trash2,
  Eye,
  Clock,
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

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  status: "publicado" | "borrador";
  excerpt: string;
}

const initialPosts: Post[] = [
  {
    id: 1,
    title: "Guía Completa de React 2024",
    author: "Carlos Ruiz",
    date: "2024-05-15",
    status: "publicado",
    excerpt: "Todo lo que necesitas saber sobre las nuevas características de React en 2024.",
  },
  {
    id: 2,
    title: "Introducción a la Ciberseguridad",
    author: "Laura Martínez",
    date: "2024-05-12",
    status: "publicado",
    excerpt: "Primeros pasos en el mundo de la ciberseguridad para principiantes.",
  },
  {
    id: 3,
    title: "Machine Learning para Principiantes",
    author: "Alex Chen",
    date: "2024-05-10",
    status: "borrador",
    excerpt: "Una introducción amigable al machine learning y sus aplicaciones.",
  },
  {
    id: 4,
    title: "Las Mejores Prácticas de CSS en 2024",
    author: "María García",
    date: "2024-05-08",
    status: "publicado",
    excerpt: "Técnicas modernas de CSS que todo desarrollador debería conocer.",
  },
  {
    id: 5,
    title: "Docker para Desarrolladores",
    author: "David Park",
    date: "2024-05-05",
    status: "borrador",
    excerpt: "Aprende a containerizar tus aplicaciones con Docker paso a paso.",
  },
  {
    id: 6,
    title: "TypeScript Avanzado",
    author: "Carlos Ruiz",
    date: "2024-05-01",
    status: "publicado",
    excerpt: "Técnicas avanzadas de TypeScript para proyectos empresariales.",
  },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [filter, setFilter] = useState<"todos" | "publicado" | "borrador">("todos");

  const filtered = posts.filter((p) => filter === "todos" || p.status === filter);

  const toggleStatus = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "publicado" ? "borrador" : "publicado" }
          : p
      )
    );
  };

  const deletePost = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const published = posts.filter((p) => p.status === "publicado").length;
  const drafts = posts.filter((p) => p.status === "borrador").length;

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
                item.href === "/admin/blog"
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
            <h1 className="text-2xl font-bold text-white">Gestión del Blog</h1>
            <p className="mt-1 text-sm text-gray-400">
              {published} publicados &middot; {drafts} borradores
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-[#00FF88] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#00FF88]/90">
            <Plus className="h-4 w-4" />
            Nuevo Artículo
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          {(["todos", "publicado", "borrador"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-1.5 text-xs font-medium capitalize ${
                filter === f
                  ? "bg-[#00FF88]/10 text-[#00FF88]"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {f === "todos" ? "Todos" : f}
            </button>
          ))}
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs text-gray-500 uppercase">
                  <th className="px-6 py-4">Artículo</th>
                  <th className="px-6 py-4 hidden md:table-cell">Autor</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Fecha</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00FF88]/10">
                          <FileText className="h-4 w-4 text-[#00FF88]" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-white truncate max-w-xs">{post.title}</div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">{post.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-400">{post.author}</td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {post.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(post.id)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          post.status === "publicado"
                            ? "bg-[#00FF88]/10 text-[#00FF88]"
                            : "bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        {post.status === "publicado" ? "Publicado" : "Borrador"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-500">
              No se encontraron artículos.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
