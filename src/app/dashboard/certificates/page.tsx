"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/components/Providers";
import { ArrowLeft, Award, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/ui/Animations";
import Certificate from "@/components/Certificate";

const courseNames: Record<string, string> = {
  "html-fundamentals": "Fundamentos de HTML",
  "css-masterclass": "Masterclass de CSS",
  "javascript-complete": "Guía Completa de JavaScript",
  "react-complete": "Curso Completo de React",
  "nextjs-mastery": "Dominio de Next.js",
  "python-complete": "Curso Completo de Python",
  "ethical-hacking": "Hacking Ético Completo",
  "linux-admin": "Administración de Linux",
  "discord-js-bot": "Desarrollo de Bots con Discord.js",
  "nodejs-backend": "Desarrollo Backend con Node.js",
  "postgresql-database": "PostgreSQL Completo",
  "kubernetes-docker": "Docker y Kubernetes",
  "git-github-complete": "Git y GitHub Completo",
  "typescript-complete": "TypeScript Completo",
};

export default function CertificatesPage() {
  const { data: session } = useSession();
  const [certificates, setCertificates] = useState<{ id: string; course_slug: string; completed_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewCert, setViewCert] = useState<{ courseName: string; date: string; id: string } | null>(null);

  useState(() => {
    if (session?.user) {
      fetch("/api/enroll")
        .then((r) => r.json())
        .then((data) => {
          if (data.enrollments) {
            const completed = data.enrollments
              .filter((e: { completed: boolean }) => e.completed)
              .map((e: { id: string; course_slug: string; enrolled_at: string }) => ({
                id: e.id,
                course_slug: e.course_slug,
                completed_at: e.enrolled_at,
              }));
            setCertificates(completed);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  });

  if (!session?.user) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <Award className="mx-auto h-12 w-12 text-gray-600" />
          <h2 className="mt-4 text-xl font-bold text-white">Inicia sesión para ver tus certificados</h2>
          <Link href="/login" className="mt-4 inline-block rounded-xl bg-[#00FF88] px-6 py-2.5 text-sm font-semibold text-black">Iniciar Sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-5xl px-4">
        <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF88] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>

        <FadeIn>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Mis Certificados</h1>
            <p className="mt-1 text-sm text-gray-400">Certificados profesionales descargables en PNG y PDF</p>
          </div>
        </FadeIn>

        {viewCert && (
          <FadeIn>
            <div className="mb-8">
              <button onClick={() => setViewCert(null)} className="mb-4 text-sm text-gray-400 hover:text-[#00FF88]">← Volver a la lista</button>
              <div className="flex justify-center overflow-x-auto">
                <Certificate
                  studentName={session.user?.name || "Estudiante"}
                  courseName={viewCert.courseName}
                  completionDate={new Date(viewCert.date).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                  certificateId={viewCert.id}
                />
              </div>
            </div>
          </FadeIn>
        )}

        {!viewCert && (
          <div className="grid gap-4 sm:grid-cols-2">
            {certificates.map((cert) => (
              <FadeIn key={cert.id}>
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD93D]/10">
                      <Award className="h-6 w-6 text-[#FFD93D]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{courseNames[cert.course_slug] || cert.course_slug}</h3>
                      <p className="text-xs text-gray-500">Completado el {new Date(cert.completed_at).toLocaleDateString("es-ES")}</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 mb-4">
                    <p className="text-xs text-gray-500">ID de verificación</p>
                    <p className="font-mono text-sm text-[#00FF88]">SYS777-{cert.course_slug.substring(0, 4).toUpperCase()}-{cert.id.substring(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewCert({
                        courseName: courseNames[cert.course_slug] || cert.course_slug,
                        date: cert.completed_at,
                        id: `SYS777-${cert.course_slug.substring(0, 4).toUpperCase()}-${cert.id.substring(0, 8).toUpperCase()}`,
                      })}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#00FF88] py-2.5 text-sm font-semibold text-black hover:bg-[#00CC6A] transition-colors"
                    >
                      <Award className="h-4 w-4" /> Ver Certificado
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        {!loading && certificates.length === 0 && !viewCert && (
          <FadeIn>
            <div className="glass rounded-2xl p-12 text-center">
              <Award className="mx-auto h-12 w-12 text-gray-600" />
              <h3 className="mt-4 text-lg font-semibold text-white">Sin certificados aún</h3>
              <p className="mt-2 text-sm text-gray-400">Completa cursos para obtener certificados profesionales descargables</p>
              <Link href="/courses" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#00FF88] px-6 py-2.5 text-sm font-semibold text-black">
                <CheckCircle2 className="h-4 w-4" /> Explorar Cursos
              </Link>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
