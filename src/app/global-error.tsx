"use client";

import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body style={{ background: "#04070e", color: "#eef6fb", fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "1rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0 }}>Error de la aplicación</h1>
          <p style={{ opacity: 0.7, maxWidth: 420, fontSize: "0.9rem" }}>
            Ocurrió un error inesperado. Reintenta; si persiste, vuelve al inicio.
          </p>
          {error?.digest ? <p style={{ opacity: 0.4, fontSize: "0.75rem" }}>Código: {error.digest}</p> : null}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              onClick={() => reset()}
              style={{ background: "#00e5ff", color: "#04070e", border: 0, borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer" }}
            >
              Reintentar
            </button>
            <Link
              href="/"
              style={{ color: "#eef6fb", border: "1px solid rgba(150,200,255,0.3)", borderRadius: 10, padding: "10px 20px", fontWeight: 700, textDecoration: "none" }}
            >
              Inicio
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
