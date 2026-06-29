"use client";

import Link from "next/link";
import { ArrowLeft, User, Bell, Globe } from "lucide-react";
import { FadeIn } from "@/components/ui/Animations";
import { useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    name: "Juan Pérez",
    username: "juanperez",
    email: "juan@ejemplo.com",
    bio: "Estudiante de tecnología",
    notifications: true,
    language: "es",
  });

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-3xl px-4">
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF88] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>

        <FadeIn>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Configuración</h1>
            <p className="mt-1 text-sm text-gray-400">Gestiona tu perfil y preferencias</p>
          </div>
        </FadeIn>

        <div className="space-y-4">
          <FadeIn delay={0.1}>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="h-5 w-5 text-[#00FF88]" />
                <h3 className="font-semibold text-white">Perfil</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Nombre completo</label>
                  <input type="text" value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Username</label>
                  <input type="text" value={settings.username} onChange={(e) => setSettings({ ...settings, username: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Email</label>
                  <input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Bio</label>
                  <textarea value={settings.bio} onChange={(e) => setSettings({ ...settings, bio: e.target.value })} rows={3} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50 resize-none" />
                </div>
                <button className="rounded-xl bg-[#00FF88] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#00CC6A]">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="h-5 w-5 text-[#00C8FF]" />
                <h3 className="font-semibold text-white">Notificaciones</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">Notificaciones por email</p>
                    <p className="text-xs text-gray-500">Recibe actualizaciones por correo</p>
                  </div>
                  <button onClick={() => setSettings({ ...settings, notifications: !settings.notifications })} className={`relative h-6 w-11 rounded-full transition-colors ${settings.notifications ? "bg-[#00FF88]" : "bg-white/10"}`}>
                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${settings.notifications ? "left-5.5" : "left-0.5"}`} />
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="h-5 w-5 text-[#7C3AED]" />
                <h3 className="font-semibold text-white">Idioma</h3>
              </div>
              <select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50">
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
