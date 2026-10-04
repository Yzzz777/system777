"use client";

import Link from "next/link";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span className="eyebrow justify-center">Dashboard</span>
      <h1 className="mt-4 text-2xl font-black text-white">Sección no disponible</h1>
      <p className="mt-3 max-w-md text-sm text-gray-400">
        Esta sección del dashboard encontró un problema con los datos del bot. Tu configuración no se ha perdido.
      </p>
      {error?.digest ? <p className="mt-2 text-xs text-gray-600">Código: {error.digest}</p> : null}
      <div className="mt-6 flex gap-3">
        <button onClick={() => reset()} className="btn btn-primary">
          Reintentar
        </button>
        <Link href="/bot/dashboard" className="btn btn-ghost">
          Volver al dashboard
        </Link>
      </div>
    </div>
  );
}
