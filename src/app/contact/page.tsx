"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Loader2, CheckCircle, MessageSquare, Github, Mail, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: "web", subject: "Discord", message: form.message }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setForm({ name: "", message: "" });
      } else {
        setError(data.error || "Error al enviar. Intenta de nuevo.");
      }
    } catch {
      setError("Error de red al enviar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative px-4 pb-[var(--section-y)] pt-10 sm:px-6 sm:pt-14">
      <div className="grid-bg" aria-hidden />
    <div className="bg-vignette" aria-hidden />
      <div className="relative mx-auto max-w-5xl">
        <div className="text-center">
          <span className="eyebrow justify-center">
            <Mail aria-hidden className="h-3 w-3" />
            Contacto
          </span>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2rem,5.5vw,3.25rem)] font-bold tracking-tight">
            Escríbeme
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-2)]">
            El formulario envía el mensaje directo a mi Discord. También puedes escribirme por
            ahí o dejarme un mensaje en GitHub.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Formulario */}
          <div className="panel p-6 sm:p-8">
            {success ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle aria-hidden className="h-12 w-12 text-[var(--brand)]" />
                <h2 className="mt-4 text-xl font-bold">Mensaje enviado</h2>
                <p className="mt-2 text-sm text-[var(--text-2)]">
                  Llegó por Discord. Te respondo lo antes posible.
                </p>
                <Button type="button" onClick={() => setSuccess(false)} className="mt-6">
                  Enviar otro
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--brand-dim)]">
                    <MessageSquare aria-hidden className="h-5 w-5 text-[var(--brand)]" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold">Mensaje directo</h2>
                    <p className="text-xs text-[var(--text-3)]">
                      Se envía por Discord al owner del sitio
                    </p>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-name" className="stat-label mb-1.5 block">
                    Tu nombre
                  </label>
                  <Input
                    id="contact-name"
                    type="text"
                    required
                    maxLength={80}
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="¿Cómo te llamas?"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="stat-label mb-1.5 block">
                    Mensaje
                  </label>
                  <Textarea
                    id="contact-message"
                    required
                    rows={6}
                    maxLength={2000}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Cuéntame lo que necesites…"
                    className="resize-y"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send aria-hidden className="h-4 w-4" />
                  )}
                  {loading ? "Enviando…" : "Enviar por Discord"}
                </Button>

                <p className="text-[11px] text-[var(--text-3)]">
                  Sin newsletter ni spam: solo uso el mensaje para responderte.
                </p>
              </form>
            )}
          </div>

          {/* Vías directas */}
          <div className="space-y-3">
            <a
              href={siteConfig.social.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="panel panel-hover flex items-center gap-3.5 p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(0,229,255,0.14)]">
                <MessageSquare aria-hidden className="h-5 w-5 text-[#59f1ff]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">Discord</span>
                <span className="mt-0.5 block text-[13px] text-[var(--text-3)]">
                  La vía más rápida para responder
                </span>
              </span>
              <ArrowUpRight aria-hidden className="h-4 w-4 shrink-0 text-[var(--text-3)]" />
            </a>

            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="panel panel-hover flex items-center gap-3.5 p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.05]">
                <Github aria-hidden className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">GitHub</span>
                <span className="mt-0.5 block text-[13px] text-[var(--text-3)]">
                  Issues y pull requests en los repos
                </span>
              </span>
              <ArrowUpRight aria-hidden className="h-4 w-4 shrink-0 text-[var(--text-3)]" />
            </a>

            <div className="panel p-5">
              <span className="eyebrow">Antes de escribir</span>
              <ul className="mt-3 space-y-2 text-[13px] text-[var(--text-3)]">
                <li>· Respondo cuando puedo, no soy una empresa con soporte 24/7.</li>
                <li>· Para bugs del bot, indica servidor y comando exacto.</li>
                <li>· No hago auditorías ni pentesting a terceros.</li>
              </ul>
              <div className="mt-4">
                <Link href="/bot" className="text-sm text-[var(--brand)] hover:underline">
                  Ver System 777 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
