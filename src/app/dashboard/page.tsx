"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, BookOpen, Award, Settings, LogOut, Clock, TrendingUp, Bell, CreditCard, Shield, ChevronRight, Video, MessageSquare, Phone, Calendar } from "lucide-react";

const sidebarItems = [
  { label: "Panel", icon: LayoutDashboard, href: "/dashboard", active: true },
  { label: "Mis Cursos", icon: BookOpen, href: "/dashboard/courses" },
  { label: "Certificados", icon: Award, href: "/dashboard/certificates" },
  { label: "Chat Premium", icon: MessageSquare, href: "/premium/chat", premium: true },
  { label: "Llamadas", icon: Phone, href: "/premium/calls", premium: true },
  { label: "Reuniones Zoom", icon: Calendar, href: "/premium/meetings", premium: true },
  { label: "Agendar Zoom", icon: Video, href: "/premium/schedule", premium: true },
  { label: "Actividad", icon: Clock, href: "/dashboard/activity" },
  { label: "Suscripción", icon: CreditCard, href: "/dashboard/subscription" },
  { label: "Seguridad", icon: Shield, href: "/dashboard/security" },
  { label: "Configuración", icon: Settings, href: "/dashboard/settings" },
];

interface Enrollment {
  id: string;
  course_slug: string;
  progress: number;
  completed: boolean;
  enrolled_at: string;
}

const courseNames: Record<string, string> = {
  "html-fundamentals": "Fundamentos de HTML",
  "css-masterclass": "Masterclass de CSS",
  "javascript-complete": "Guía Completa de JavaScript",
  "react-complete": "Curso Completo de React",
  "nextjs-mastery": "Dominio de Next.js",
  "python-complete": "Curso Completo de Python",
  "ethical-hacking": "Hacking Ético Completo",
  "linux-admin": "Administración de Linux",
  "discord-js-bot": "Desarrollo de Bots con Discord.js",
  "nodejs-backend": "Desarrollo Backend con Node.js",
  "postgresql-database": "PostgreSQL Completo",
  "kubernetes-docker": "Docker y Kubernetes",
  "penetration-testing": "Pruebas de Penetración",
  "network-security": "Seguridad de Redes",
  "react-native-mobile": "Desarrollo Móvil con React Native",
  "python-django": "Python Django Full Stack",
  "cloud-aws": "Cloud Computing con AWS",
  "malware-analysis": "Análisis de Malware",
  "git-github-complete": "Git y GitHub Completo",
  "typescript-complete": "TypeScript Completo",
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/enroll")
        .then((r) => r.json())
        .then((data) => {
          if (data.enrollments) setEnrollments(data.enrollments);
        })
        .catch(() => {});
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00FF88] border-t-transparent" />
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user;
  const initials = (user.name?.[0] || user.email?.[0] || "U").toUpperCase();
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.completed).length;
  const avgProgress = totalCourses > 0 ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / totalCourses) : 0;

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r border-white/5 bg-[#0A0A0A] lg:block">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00FF88]/10 text-sm font-bold text-[#00FF88]">{initials}</div>
            <div>
              <div className="text-sm font-semibold text-white">{user.name || "Usuario"}</div>
              <div className="text-xs text-gray-500">@{user.username || user.email?.split("@")[0]}</div>
            </div>
          </div>
        </div>
        <nav className="space-y-1 px-3">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${item.active ? "bg-[#00FF88]/10 text-[#00FF88]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
              <item.icon className="h-4 w-4" />{item.label}
              {"premium" in item && item.premium && <span className="ml-auto rounded-full bg-[#7C3AED]/20 px-1.5 py-0.5 text-[10px] text-[#7C3AED]">Premium</span>}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-white/5 p-3">
          <button onClick={() => signOut()} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
            <LogOut className="h-4 w-4" />Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Panel de Control</h1>
            <p className="mt-1 text-sm text-gray-400">Bienvenido de nuevo, {user.name?.split(" ")[0] || "Usuario"}!</p>
          </div>
          <button className="relative rounded-xl border border-white/10 p-2.5 text-gray-400 hover:bg-white/5 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#00FF88]" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Cursos Inscritos", value: totalCourses.toString(), icon: BookOpen, color: "#00FF88" },
            { label: "Completados", value: completedCourses.toString(), icon: Award, color: "#00C8FF" },
            { label: "Progreso Promedio", value: `${avgProgress}%`, icon: TrendingUp, color: "#7C3AED" },
            { label: "Rol", value: user.role || "Estudiante", icon: Shield, color: "#FFD93D" },
          ].map((s) => (
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
            {enrollments.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                <p className="text-gray-400">Aún no te has inscrito en ningún curso</p>
                <Link href="/courses" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#00FF88] px-6 py-2.5 text-sm font-semibold text-black hover:bg-[#00CC6A]">
                  Explorar Cursos
                </Link>
              </div>
            ) : (
              enrollments.slice(0, 5).map((enrollment) => (
                <Link key={enrollment.id} href={`/course/${enrollment.course_slug}`} className="glass rounded-2xl p-5 block hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{courseNames[enrollment.course_slug] || enrollment.course_slug}</h3>
                    <span className="text-sm text-[#00FF88]">{enrollment.progress}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#00FF88] to-[#00C8FF] transition-all" style={{ width: `${enrollment.progress}%` }} />
                  </div>
                  {enrollment.completed && (
                    <div className="mt-2 text-xs text-[#00FF88]">Completado</div>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white">Acciones Rápidas</h2>
            <div className="mt-4 space-y-2">
              {[
                { label: "Explorar Cursos", href: "/courses" },
                { label: "Chat Premium", href: "/premium/chat" },
                { label: "Reuniones Zoom", href: "/premium/meetings" },
                { label: "Llamadas", href: "/premium/calls" },
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
              {enrollments.length === 0 ? (
                <p className="text-sm text-gray-500">Sin actividad reciente</p>
              ) : (
                enrollments.slice(0, 3).map((e) => (
                  <div key={e.id} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-[#00FF88]" />
                    <div>
                      <div className="text-sm text-gray-300">
                        {e.completed ? "Completaste" : "Estás en"}: {courseNames[e.course_slug] || e.course_slug}
                      </div>
                      <div className="text-xs text-gray-500">{e.progress}% completado</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
