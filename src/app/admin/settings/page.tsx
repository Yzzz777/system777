"use client";

import { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import {
  Save,
  Globe,
  Mail,
  Image,
  Palette,
  Github,
  MessageCircle,
  Twitter,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "System 777",
    description: "Plataforma de aprendizaje en línea para desarrolladores.",
    logoUrl: "",
    primaryColor: "#00FF88",
    contactEmail: "admin@system777.com",
    github: "https://github.com/system777",
    discord: "https://discord.gg/system777",
    twitter: "https://twitter.com/system777",
  });

  const update = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin" className="mb-2 inline-block text-sm text-[#00FF88] hover:underline">
            &larr; Volver al Panel
          </Link>
          <h1 className="text-2xl font-bold text-white">Configuración del Sitio</h1>
          <p className="mt-1 text-sm text-gray-400">Administra la configuración general</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-[#00FF88] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#00FF88]/90"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Guardado
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Globe className="h-5 w-5 text-[#00FF88]" />
            Información General
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Nombre del Sitio</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => update("siteName", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Descripción</label>
              <textarea
                value={settings.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">URL del Logo</label>
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Image className="h-5 w-5 text-gray-500" aria-label="Logo" />
                </div>
                <input
                  type="text"
                  value={settings.logoUrl}
                  onChange={(e) => update("logoUrl", e.target.value)}
                  placeholder="https://ejemplo.com/logo.png"
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Palette className="h-5 w-5 text-[#00FF88]" />
            Apariencia
          </h2>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Color Primario</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => update("primaryColor", e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => update("primaryColor", e.target.value)}
                className="w-32 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50"
              />
              <div className="flex gap-2">
                {["#00FF88", "#00C8FF", "#7C3AED", "#FFD93D", "#FF6B6B"].map((c) => (
                  <button
                    key={c}
                    onClick={() => update("primaryColor", c)}
                    className={`h-7 w-7 rounded-full border-2 ${settings.primaryColor === c ? "border-white" : "border-transparent"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Mail className="h-5 w-5 text-[#00FF88]" />
            Contacto
          </h2>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Email de Contacto</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50"
            />
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Globe className="h-5 w-5 text-[#00FF88]" />
            Redes Sociales
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                <Github className="h-3.5 w-3.5" /> GitHub
              </label>
              <input
                type="url"
                value={settings.github}
                onChange={(e) => update("github", e.target.value)}
                placeholder="https://github.com/usuario"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50"
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                <MessageCircle className="h-3.5 w-3.5" /> Discord
              </label>
              <input
                type="url"
                value={settings.discord}
                onChange={(e) => update("discord", e.target.value)}
                placeholder="https://discord.gg/..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50"
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                <Twitter className="h-3.5 w-3.5" /> Twitter / X
              </label>
              <input
                type="url"
                value={settings.twitter}
                onChange={(e) => update("twitter", e.target.value)}
                placeholder="https://twitter.com/usuario"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
