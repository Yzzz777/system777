import Link from "next/link";

export const runtime = "edge";

export default async function VerifyCallbackPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const code = params.code;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
      <div className="glass rounded-2xl p-10 max-w-md w-full text-center">
        {code ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-[#00FF88]/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✅</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Verificación Completada</h1>
            <p className="text-gray-400 mb-6">
              Tu cuenta de Discord ha sido verificada correctamente.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[#00FF88] px-6 py-3 text-sm font-semibold text-black hover:bg-[#00CC6A] transition-colors"
            >
              Volver al Inicio
            </Link>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Error de Verificación</h1>
            <p className="text-gray-400 mb-6">
              No se recibió el código de verificación. Intenta de nuevo desde Discord.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Volver al Inicio
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
