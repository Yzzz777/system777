"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Phone } from "lucide-react";
import { FadeIn } from "@/components/ui/Animations";

const contactOptions = [
  { title: "Chat en Vivo", description: "Habla con nosotros en tiempo a través de la plataforma", icon: MessageSquare, color: "#00FF88", action: "/premium/chat" },
  { title: "Email", description: "Envíanos un correo y te respondemos en menos de 24h", icon: Mail, color: "#00C8FF", action: "mailto:rksagmita@jrsystem7777.com" },
  { title: "WhatsApp", description: "Escríbenos por WhatsApp para soporte rápido", icon: Phone, color: "#25D366", action: "https://wa.me/18495659903" },
];

const messages = [
  { from: "SYSTEM 777", subject: "Bienvenido a la academia", preview: "Gracias por unirte a SYSTEM 777. Aquí tienes todo lo que necesitas para empezar...", time: "Hoy", read: true },
  { from: "Soporte", subject: "Tu cuenta está activa", preview: "Tu registro fue exitoso. Ya puedes acceder a todos los cursos gratuitos...", time: "Ayer", read: true },
  { from: "System 777", subject: "Nuevo curso disponible", preview: "Se ha publicado un nuevo curso de React que te puede interesar...", time: "27 Jun", read: false },
];

export default function MessagesPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF88] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>

        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-white">Mensajes</h1>
            <p className="mt-3 text-gray-400">Contacto y mensajes de SYSTEM 777</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid gap-4 sm:grid-cols-3 mb-10">
            {contactOptions.map((opt) => (
              <Link key={opt.title} href={opt.action} className="glass rounded-2xl p-6 text-center hover:border-white/10 transition-all block">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: opt.color + "15" }}>
                  <opt.icon className="h-6 w-6" style={{ color: opt.color }} />
                </div>
                <h3 className="font-semibold text-white">{opt.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{opt.description}</p>
              </Link>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Bandeja de Entrada</h2>
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-4 rounded-xl px-4 py-4 transition-colors hover:bg-white/5 cursor-pointer ${!msg.read ? "border-l-2 border-[#00FF88]" : ""}`}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00FF88]/10 text-sm font-bold text-[#00FF88]">
                    {msg.from[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${!msg.read ? "font-semibold text-white" : "font-medium text-gray-300"}`}>{msg.from}</span>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <div className="text-sm font-medium text-white">{msg.subject}</div>
                    <div className="mt-1 text-xs text-gray-500 truncate">{msg.preview}</div>
                  </div>
                  {!msg.read && <div className="mt-2 h-2 w-2 rounded-full bg-[#00FF88]" />}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
