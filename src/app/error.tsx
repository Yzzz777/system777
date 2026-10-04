"use client";

import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="eyebrow justify-center">Error</span>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold">Algo salió mal</h1>
      <p className="mt-3 max-w-md text-sm text-[var(--text-2)]">
        La sección encontró un problema inesperado. Puedes reintentar sin perder nada.
      </p>
      {error?.digest ? (
        <p className="mt-2 text-xs text-[var(--text-3)]">Código: {error.digest}</p>
      ) : null}
      <div className="mt-6 flex gap-3">
        <button onClick={() => reset()} className="btn btn-primary">
          Reintentar
        </button>
        <Link href="/" className="btn btn-ghost">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
