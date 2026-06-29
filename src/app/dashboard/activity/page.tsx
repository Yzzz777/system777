"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Award, LogIn, Settings } from "lucide-react";
import { FadeIn } from "@/components/ui/Animations";

const activities = [
  { action: "Completaste la lección: React Hooks", time: "Hace 2 horas", icon: BookOpen, color: "#00FF88" },
  { action: "Obtuviste certificado: JavaScript Básico", time: "Hace 1 día", icon: Award, color: "#FFD93D" },
  { action: "Te inscribiste en: Hacking Ético", time: "Hace 3 días", icon: BookOpen, color: "#00C8FF" },
  { action: "Iniciaste sesión", time: "Hace 3 días", icon: LogIn, color: "#7C3AED" },
  { action: "Actualizaste tu perfil", time: "Hace 5 días", icon: Settings, color: "#FF6B6B" },
  { action: "Completaste la lección: DOM Manipulation", time: "Hace 1 semana", icon: BookOpen, color: "#00FF88" },
];

export default function ActivityPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-3xl px-4">
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF88] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>

        <FadeIn>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Actividad Reciente</h1>
            <p className="mt-1 text-sm text-gray-400">Historial de tus acciones en la plataforma</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="glass rounded-2xl p-6">
            <div className="space-y-1">
              {activities.map((activity, i) => (
                <div key={i} className="flex items-start gap-4 rounded-xl px-4 py-4 transition-colors hover:bg-white/5">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: activity.color + "15" }}>
                    <activity.icon className="h-4 w-4" style={{ color: activity.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">{activity.action}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
