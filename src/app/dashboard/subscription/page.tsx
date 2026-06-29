"use client";

import Link from "next/link";
import { ArrowLeft, Check, Star, Zap, Crown } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/ui/Animations";

const currentPlan = {
  name: "Gratis",
  price: 0,
  features: ["Acceso a cursos básicos", "Foros de comunidad", "5 recursos/mes", "Certificación básica"],
};

const plans = [
  { name: "Starter", price: 9.99, period: "/mes", features: ["20+ cursos premium", "50 recursos/mes", "Certificación Starter", "Soporte por email", "Chat con instructores"], icon: Zap, color: "#00C8FF" },
  { name: "Pro", price: 29.99, period: "/mes", features: ["Todos los cursos premium", "Recursos ilimitados", "Certificación Pro", "Sesiones de mentoría", "Soporte prioritario", "Rol en Discord", "Chat premium", "Llamadas de voz/video", "Reuniones Zoom", "Grupos de estudio"], icon: Star, color: "#00FF88", popular: true },
  { name: "Enterprise", price: 99.99, period: "/mes", features: ["Todo lo del Pro", "Rutas personalizadas", "Gestión de equipos", "Acceso API", "Soporte dedicado", "Branding personalizado", "Dashboard analítico", "Reuniones 1-a-1 ilimitadas", "Tutoría personalizada"], icon: Crown, color: "#FFD93D" },
];

const benefits = [
  { title: "Chat en tiempo real", description: "Habla directamente con instructores y estudiantes premium", icon: "💬" },
  { title: "Llamadas de voz y video", description: "Sesiones 1-a-1 con tus instructores favoritos", icon: "📞" },
  { title: "Reuniones por Zoom", description: "Workshops, mentorías y sesiones grupal en vivo", icon: "🎥" },
  { title: "Certificados premium", description: "Certificados verificables para tu portfolio profesional", icon: "🏆" },
  { title: "Soporte prioritario", description: "Respuesta en menos de 2 horas para problemas urgentes", icon: "⚡" },
  { title: "Contenido exclusivo", description: "Cursos y recursos que no están disponibles para usuarios gratuitos", icon: "🔒" },
];

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-5xl px-4">
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF88] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>

        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Tu Suscripción</h1>
            <p className="mt-3 text-gray-400">Gestiona tu plan y desbloquea funcionalidades premium</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="glass rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">Plan Actual: {currentPlan.name}</h2>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">Activo</span>
                </div>
                <p className="mt-1 text-sm text-gray-400">${currentPlan.price}/mes</p>
              </div>
              <Link href="/premium/checkout" className="rounded-xl bg-[#00FF88] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#00CC6A]">
                Actualizar Plan
              </Link>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              {currentPlan.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-400">
                  <Check className="h-4 w-4 text-[#00FF88]" /> {f}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-2 text-center">Beneficios Premium</h2>
            <p className="text-sm text-gray-400 text-center mb-6">Todo lo que obtienes al actualizar a premium</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <div key={b.title} className="glass rounded-xl p-5">
                  <div className="text-2xl mb-3">{b.icon}</div>
                  <h3 className="font-semibold text-white">{b.title}</h3>
                  <p className="mt-1 text-sm text-gray-400">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div>
            <h2 className="text-xl font-bold text-white mb-6 text-center">Planes Disponibles</h2>
            <StaggerContainer className="grid gap-6 sm:grid-cols-3">
              {plans.map((plan) => (
                <StaggerItem key={plan.name}>
                  <HoverScale>
                    <div className={`glass rounded-2xl p-6 h-full flex flex-col ${plan.popular ? "border-[#00FF88]/30" : ""}`}>
                      {plan.popular && (
                        <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-[#00FF88]/10 px-3 py-1 text-xs font-medium text-[#00FF88] w-fit">
                          <Star className="h-3 w-3" /> Más Popular
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: plan.color + "15" }}>
                          <plan.icon className="h-5 w-5" style={{ color: plan.color }} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                          <div>
                            <span className="text-2xl font-bold text-white">${plan.price}</span>
                            <span className="text-sm text-gray-500">{plan.period}</span>
                          </div>
                        </div>
                      </div>
                      <ul className="mt-6 space-y-3 flex-1">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00FF88]" />{f}
                          </li>
                        ))}
                      </ul>
                      <Link href={`/premium/checkout?plan=${plan.name.toLowerCase()}`} className={`mt-6 block rounded-xl py-2.5 text-center text-sm font-semibold transition-all ${plan.popular ? "bg-[#00FF88] text-black hover:bg-[#00CC6A]" : "border border-white/10 text-white hover:bg-white/5"}`}>
                        {plan.name === "Enterprise" ? "Contactar" : "Elegir Plan"}
                      </Link>
                    </div>
                  </HoverScale>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
