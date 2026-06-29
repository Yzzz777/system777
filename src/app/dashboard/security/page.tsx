"use client";

import Link from "next/link";
import { ArrowLeft, Key, Smartphone, AlertTriangle } from "lucide-react";
import { FadeIn } from "@/components/ui/Animations";
import { useState } from "react";

export default function SecurityPage() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-3xl px-4">
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF88] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>

        <FadeIn>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Seguridad</h1>
            <p className="mt-1 text-sm text-gray-400">Gestiona la seguridad de tu cuenta</p>
          </div>
        </FadeIn>

        <div className="space-y-4">
          <FadeIn delay={0.1}>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00FF88]/10">
                    <Key className="h-5 w-5 text-[#00FF88]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Cambiar Contraseña</h3>
                    <p className="text-xs text-gray-500">Actualiza tu contraseña regularmente</p>
                  </div>
                </div>
                <button onClick={() => setShowChangePassword(!showChangePassword)} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
                  Cambiar
                </button>
              </div>
              {showChangePassword && (
                <div className="mt-4 space-y-3 border-t border-white/5 pt-4">
                  <input type="password" placeholder="Contraseña actual" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" />
                  <input type="password" placeholder="Nueva contraseña" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" />
                  <input type="password" placeholder="Confirmar nueva contraseña" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" />
                  <button className="rounded-xl bg-[#00FF88] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#00CC6A]">Guardar Contraseña</button>
                </div>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00C8FF]/10">
                  <Smartphone className="h-5 w-5 text-[#00C8FF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Autenticación de Dos Factores</h3>
                  <p className="text-xs text-gray-500">Añade una capa extra de seguridad</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-white/5 p-4">
                <p className="text-sm text-gray-400">Próximamente disponible. Estamos implementando 2FA para mayor seguridad.</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B6B]/10">
                  <AlertTriangle className="h-5 w-5 text-[#FF6B6B]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Zona de Peligro</h3>
                  <p className="text-xs text-gray-500">Acciones irreversibles</p>
                </div>
              </div>
              <div className="mt-4">
                <button className="rounded-xl border border-red-500/20 px-5 py-2.5 text-sm text-red-400 hover:bg-red-500/10">
                  Eliminar Cuenta
                </button>
                <p className="mt-2 text-xs text-gray-500">Esta acción es permanente y no se puede deshacer</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
