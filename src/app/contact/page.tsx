"use client";

import { useState, useEffect } from "react";
import { Mail, MessageCircle, Send, Loader2, CheckCircle, MapPin, Github, Instagram, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";
import { FadeIn } from "@/components/ui/Animations";

const socials = [
  { name: "GitHub", icon: Github, href: siteConfig.social.github, color: "#FFFFFF", desc: "Codigo y proyectos" },
  { name: "Discord", icon: MessageCircle, href: siteConfig.social.discord, color: "#5865F2", desc: "Unete al servidor" },
  { name: "Instagram", icon: Instagram, href: siteConfig.social.instagram, color: "#E4405F", desc: "Sigueme" },
  { name: "Email", icon: Mail, href: "mailto:contacto@jrsystem7777.com", color: "#00FF88", desc: "Escríbeme directo" },
];

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setError("");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(data.error || "Error al enviar. Intenta de nuevo.");
      }
    } catch {
      setError("Error al enviar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Contacto</h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">Tienes un proyecto, pregunta o simplemente quieres saludar</p>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          {/* Social */}
          <FadeIn delay={0.1}>
            <div>
              <h2 className="text-2xl font-bold text-white">Redes</h2>
              <div className="mt-8 space-y-4">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl glass p-5 transition-all hover:border-white/20">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: s.color + "15" }}>
                        <Icon className="h-5 w-5" style={{ color: s.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{s.name}</div>
                        <div className="text-xs text-gray-500">{s.desc}</div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                    </a>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center gap-3 rounded-2xl glass p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00C8FF]/10">
                  <MapPin className="h-5 w-5 text-[#00C8FF]" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Ubicacion</div>
                  <div className="text-xs text-gray-500">Disponible en linea</div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Form */}
          <FadeIn delay={0.2}>
            <div className="glass rounded-2xl p-8">
              {success ? (
                <div className="flex flex-col items-center py-12">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                    <CheckCircle className="h-16 w-16 text-[#00FF88]" />
                  </motion.div>
                  <h3 className="mt-4 text-xl font-bold text-white">Mensaje Enviado</h3>
                  <p className="mt-2 text-sm text-gray-400">Te responderé pronto.</p>
                  <button onClick={() => setSuccess(false)} className="mt-6 rounded-xl bg-[#00FF88] px-6 py-2.5 text-sm font-semibold text-black hover:bg-[#00CC6A]">Enviar Otro</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-xl font-bold text-white">Escríbeme</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-300">Nombre</label>
                      <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="Tu nombre" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-300">Correo</label>
                      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="tu@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-300">Asunto</label>
                    <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="¿Sobre que?" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-300">Mensaje</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="Cuentame..." />
                  </div>
                  {error && <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">{error}</div>}
                  <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00FF88] py-3 text-sm font-semibold text-black transition-all hover:bg-[#00CC6A] disabled:opacity-50">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {loading ? "Enviando..." : "Enviar Mensaje"}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
