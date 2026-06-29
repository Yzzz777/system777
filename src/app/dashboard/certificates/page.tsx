"use client";

import Link from "next/link";
import { ArrowLeft, Award, Download, ExternalLink } from "lucide-react";
import { FadeIn } from "@/components/ui/Animations";

const certificates = [
  { id: "CERT-001", course: "JavaScript Básico", date: "2026-06-20", uniqueId: "SYS777-JS-2026-A1B2" },
  { id: "CERT-002", course: "HTML & CSS Fundamentals", date: "2026-06-15", uniqueId: "SYS777-HTML-2026-C3D4" },
];

export default function CertificatesPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-5xl px-4">
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF88] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>

        <FadeIn>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Mis Certificados</h1>
            <p className="mt-1 text-sm text-gray-400">Certificados verificables de tus cursos completados</p>
          </div>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2">
          {certificates.map((cert) => (
            <FadeIn key={cert.id}>
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD93D]/10">
                    <Award className="h-6 w-6 text-[#FFD93D]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{cert.course}</h3>
                    <p className="text-xs text-gray-500">Completado el {new Date(cert.date).toLocaleDateString("es-ES")}</p>
                  </div>
                </div>
                <div className="rounded-xl bg-white/5 p-3 mb-4">
                  <p className="text-xs text-gray-500">ID de verificación</p>
                  <p className="font-mono text-sm text-[#00FF88]">{cert.uniqueId}</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                    <Download className="h-4 w-4" /> Descargar
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00FF88]/10 py-2.5 text-sm text-[#00FF88] hover:bg-[#00FF88]/20 transition-colors">
                    <ExternalLink className="h-4 w-4" /> Verificar
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {certificates.length === 0 && (
          <FadeIn>
            <div className="glass rounded-2xl p-12 text-center">
              <Award className="mx-auto h-12 w-12 text-gray-600" />
              <h3 className="mt-4 text-lg font-semibold text-white">Sin certificados aún</h3>
              <p className="mt-2 text-sm text-gray-400">Completa cursos para obtener certificados</p>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
