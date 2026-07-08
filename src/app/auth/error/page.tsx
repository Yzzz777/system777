"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errors: Record<string, string> = {
    Configuration: "Error de configuración del servidor. Contacta al administrador.",
    AccessDenied: "Acceso denegado. No se pudo autenticar con Discord.",
    Verification: "El enlace de verificación ha expirado o ya fue usado.",
    Default: "Ocurrió un error durante la autenticación.",
  };

  const message = errors[error || ""] || errors.Default;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
      <div className="glass rounded-2xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">❌</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Error de Autenticación</h1>
        <p className="text-gray-400 mb-2">{message}</p>
        {error && (
          <p className="text-xs text-gray-600 mb-6">Código: {error}</p>
        )}
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5865F2] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4752c4] transition-colors"
          >
            Intentar de Nuevo
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="w-8 h-8 border-2 border-[#5865F2] border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <ErrorContent />
    </Suspense>
  );
}
