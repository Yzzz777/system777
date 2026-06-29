"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, ArrowLeft, Loader2, Building2, Copy, CheckCircle } from "lucide-react";

const plans = [
  { id: "starter", name: "Starter", price: 9.99, period: "/mes", features: ["20+ cursos premium", "50 recursos/mes", "Certificación Starter", "Soporte por email"] },
  { id: "pro", name: "Pro", price: 29.99, period: "/mes", features: ["Todos los cursos premium", "Recursos ilimitados", "Certificación Pro", "Sesiones de mentoría", "Soporte prioritario", "Rol en Discord", "Chat premium", "Llamadas de voz/video", "Reuniones Zoom"], popular: true },
  { id: "enterprise", name: "Enterprise", price: 99.99, period: "/mes", features: ["Todo lo del Pro", "Rutas personalizadas", "Gestión de equipos", "Acceso API", "Soporte dedicado", "Branding personalizado"] },
];

const bankInfo = {
  bank: "Banreservas",
  country: "República Dominicana",
  accountName: "Angel Suarez",
  accountNumber: "40220845735",
  accountType: "Corriente",
};

function PremiumCheckoutContent() {
  const searchParams = useSearchParams();
  const courseSlug = searchParams.get("course");
  const [selectedPlan, setSelectedPlan] = useState<string>(courseSlug ? "course" : "pro");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", amount: "", reference: "" });

  const planInfo = plans.find(p => p.id === selectedPlan);

  const handleCopy = () => {
    navigator.clipboard.writeText(bankInfo.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: courseSlug ? "course" : "subscription",
          planOrCourse: courseSlug || selectedPlan,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          amount: parseFloat(formData.amount) || planInfo?.price || 0,
          reference: formData.reference,
        }),
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
      else alert(data.error || "Error al enviar");
    } catch {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass max-w-lg rounded-3xl p-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#00FF88]/10">
            <CheckCircle className="h-8 w-8 text-[#00FF88]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Solicitud Enviada!</h1>
          <p className="mt-4 text-gray-400">
            Hemos recibido tu comprobante de pago. Tu solicitud será revisada y el acceso premium se activará en un plazo de <span className="text-white font-medium">24-48 horas</span>.
          </p>
          <p className="mt-2 text-sm text-gray-500">Recibirás un email de confirmación a {formData.email}</p>
          <Link href="/dashboard" className="mt-8 inline-flex rounded-xl bg-[#00FF88] px-8 py-3 text-sm font-semibold text-black hover:bg-[#00CC6A]">
            Ir al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Link href={courseSlug ? `/course/${courseSlug}` : "/"} className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF88] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>

        <div className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00FF88]/10">
            <Building2 className="h-7 w-7 text-[#00FF88]" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            {courseSlug ? `Obtener ${courseSlug.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}` : "Actualizar a Premium"}
          </h1>
          <p className="mt-3 text-gray-400">Paga por transferencia bancaria y activa tu acceso</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {!courseSlug && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Elige tu plan</h2>
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full rounded-2xl border p-5 text-left transition-all ${
                    selectedPlan === plan.id ? "border-[#00FF88]/50 bg-[#00FF88]/5" : "border-white/5 bg-white/[0.02] hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{plan.name}</h3>
                        {plan.popular && <span className="rounded-full bg-[#00FF88]/20 px-2 py-0.5 text-[10px] font-medium text-[#00FF88]">Popular</span>}
                      </div>
                      <div className="mt-1">
                        <span className="text-2xl font-bold text-white">${plan.price}</span>
                        <span className="text-sm text-gray-500">{plan.period}</span>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === plan.id ? "border-[#00FF88] bg-[#00FF88]" : "border-gray-600"
                    }`}>
                      {selectedPlan === plan.id && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Datos Bancarios</h3>
              <div className="rounded-xl bg-white/5 p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Banco</span>
                  <span className="text-white font-medium">{bankInfo.bank}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">País</span>
                  <span className="text-white font-medium">{bankInfo.country}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Titular</span>
                  <span className="text-white font-medium">{bankInfo.accountName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tipo de cuenta</span>
                  <span className="text-white font-medium">{bankInfo.accountType}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">N. de Cuenta</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono font-bold">{bankInfo.accountNumber}</span>
                    <button onClick={handleCopy} className="rounded-lg bg-[#00FF88]/10 p-1.5 text-[#00FF88] hover:bg-[#00FF88]/20">
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-sm">
                  <span className="text-gray-400">Monto a pagar</span>
                  <span className="text-[#00FF88] font-bold text-lg">${courseSlug ? "Consultar" : planInfo?.price}</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">Realiza una transferencia o depósito por el monto indicado</p>
            </div>

            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Datos del Pago</h3>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Nombre completo</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Email</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="tu@email.com" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Teléfono (opcional)</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="809-000-0000" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Monto depositado ($)</label>
                <input type="number" step="0.01" required value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="29.99" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">N. de Referencia / Comprobante</label>
                <input type="text" required value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="Número de referencia del depósito" />
              </div>
              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00FF88] py-3 text-sm font-semibold text-black hover:bg-[#00CC6A] disabled:opacity-50">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {loading ? "Enviando..." : "Enviar Comprobante"}
              </button>
              <p className="text-xs text-center text-gray-500">Tu acceso se activará una vez verificado el pago (24-48h)</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PremiumCheckoutPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#00FF88]" /></div>}>
      <PremiumCheckoutContent />
    </Suspense>
  );
}
