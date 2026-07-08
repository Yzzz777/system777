"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Terminal, Eye, EyeOff, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "", confirmPassword: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (form.password !== form.confirmPassword) { setError("Las contraseñas no coinciden"); setLoading(false); return; }
    if (form.password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres"); setLoading(false); return; }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, username: form.username, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error en el registro"); setLoading(false); return; }
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const loginData = await loginRes.json();
      if (loginData.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch { setError("Algo salió mal"); setLoading(false); }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-b from-[#00FF88]/5 via-transparent to-transparent" />
      <div className="glass w-full max-w-md rounded-2xl p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00FF88]/10">
            <Terminal className="h-6 w-6 text-[#00FF88]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Crear Cuenta</h1>
          <p className="mt-2 text-sm text-gray-400">Únete a SYSTEM 777 y empieza a aprender</p>
        </div>
        {error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Nombre Completo</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="Juan Pérez" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Nombre de Usuario</label>
            <input type="text" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="juanperez" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Correo Electrónico</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="tu@ejemplo.com" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Contraseña</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="Mín. 8 caracteres" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Confirmar Contraseña</label>
            <input type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="••••••••" />
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-400">
            <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-white/10 bg-white/5" />
            <span>Acepto los <Link href="/terms" className="text-[#00FF88] hover:underline">Términos de Servicio</Link> y la <Link href="/privacy" className="text-[#00FF88] hover:underline">Política de Privacidad</Link></span>
          </div>
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00FF88] py-3 text-sm font-semibold text-black transition-all hover:bg-[#00CC6A] disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-[#00FF88] hover:underline">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}
