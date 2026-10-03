/**
 * Transición de ruta (App Router): se remonta en cada navegación.
 * Entrada por CSS (`.page-enter`) — idéntico en servidor y cliente (sin
 * hidratación frágil) y desactivado automáticamente por
 * `prefers-reduced-motion` vía la regla global de animation-duration.
 */

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div data-page-template className="page-enter">
      {children}
    </div>
  );
}
