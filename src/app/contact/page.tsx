"use client";

import { useState, useEffect } from "react";
import { Mail, MessageCircle, Send, Loader2, CheckCircle, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { FadeIn } from "@/components/ui/Animations";

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
      if (res.ok) { setSuccess(true); setError(""); setForm({ name: "", email: "", subject: "", message: "" }); }
    } catch { setError("Error al enviar el mensaje. Intenta de nuevo."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Contáctanos</h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">¿Tienes una pregunta? Nos encantaría saber de ti.</p>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <FadeIn delay={0.1}>
            <div>
              <h2 className="text-2xl font-bold text-white">Ponte en Contacto</h2>
              <div className="mt-8 space-y-6">
                <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-4 rounded-2xl glass p-5 transition-all hover:border-[#00FF88]/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00FF88]/10"><Mail className="h-5 w-5 text-[#00FF88]" /></div>
                  <div><div className="text-sm font-medium text-white">Correo</div><div className="text-sm text-gray-400">{siteConfig.contact.email}</div></div>
                </a>
                <a href={siteConfig.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl glass p-5 transition-all hover:border-[#00FF88]/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366]/10"><MessageCircle className="h-5 w-5 text-[#25D366]" /></div>
                  <div><div className="text-sm font-medium text-white">WhatsApp</div><div className="text-sm text-gray-400">{siteConfig.contact.whatsapp}</div></div>
                </a>
                <div className="flex items-center gap-4 rounded-2xl glass p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00C8FF]/10"><MapPin className="h-5 w-5 text-[#00C8FF]" /></div>
                  <div><div className="text-sm font-medium text-white">Ubicación</div><div className="text-sm text-gray-400">Disponible en Todo el Mundo</div></div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="glass rounded-2xl p-8">
              {success ? (
                <div className="flex flex-col items-center py-12">
                  <CheckCircle className="h-16 w-16 text-[#00FF88]" />
                  <h3 className="mt-4 text-xl font-bold text-white">¡Mensaje Enviado!</h3>
                  <p className="mt-2 text-sm text-gray-400">Te responderemos en 24 horas.</p>
                  <button onClick={() => setSuccess(false)} className="mt-6 rounded-xl bg-[#00FF88] px-6 py-2.5 text-sm font-semibold text-black hover:bg-[#00CC6A]">Enviar Otro</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-xl font-bold text-white">Enviar Mensaje</h2>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-300">Nombre</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-300">Correo</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="tu@ejemplo.com" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-300">Asunto</label>
                    <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="¿Cómo podemos ayudar?" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-300">Mensaje</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="Cuéntanos más..." />
                  </div>
                  {error && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
                      {error}
                    </div>
                  )}
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
