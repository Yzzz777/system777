"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense } from "react";

function CallbackHandler() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code) {
      signIn("discord", {
        code,
        state: state || "",
        callbackUrl: "/bot/dashboard",
        redirect: true,
      }).catch((err) => {
        setError(err.message || "Error al autenticar con Discord");
      });
    } else {
      setError("No se recibió código de autorización de Discord");
    }
  }, [searchParams]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="glass rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Error de Autenticación</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <a href="/login" className="inline-flex items-center gap-2 rounded-xl bg-[#5865F2] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4752c4] transition-colors">
            Intentar de Nuevo
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#5865F2] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Conectando con Discord...</p>
      </div>
    </main>
  );
}

export default function DiscordCallbackPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="w-8 h-8 border-2 border-[#5865F2] border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
