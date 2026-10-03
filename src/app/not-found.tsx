import Link from "next/link";
import { SearchX, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="grid-bg" aria-hidden />
      <div className="relative w-full max-w-lg text-center">
        <span className="eyebrow justify-center">
          <SearchX aria-hidden className="h-3 w-3" />
          Error 404
        </span>
        <h1 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2.25rem,7vw,3.5rem)] font-bold tracking-tight">
          Página no encontrada
        </h1>
        <p className="mt-4 text-[var(--text-2)]">
          La ruta que buscas no existe o fue movida durante la remodelación del sitio.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            <Home aria-hidden className="h-4 w-4" />
            Volver al inicio
          </Link>
          <Link href="/projects" className="btn btn-ghost">
            <ArrowLeft aria-hidden className="h-4 w-4" />
            Ver proyectos
          </Link>
        </div>
        <p className="mt-8 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-3)]">
          jrsystem7777.com · 404
        </p>
      </div>
    </div>
  );
}
