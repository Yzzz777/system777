/**
 * Detección de capacidades para la capa 3D (WebGL + nivel de calidad).
 *
 * Reglas (ver docs/3D.md):
 *  - Sin WebGL            → composición CSS estática (fallback)
 *  - prefers-reduced-motion → fallback estático también (sin animación 3D)
 *  - Móvil / pocos cores → tier "low"  (pocas partículas, dpr 1)
 *  - Desktop potente      → tier "high"
 */

export type Tier = "high" | "low";

export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: false });
    return !!gl;
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getTier(): Tier {
  if (typeof navigator === "undefined") return "low";
  const ua = navigator.userAgent || "";
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4;
  const width = window.innerWidth;

  if (isMobile) return "low";
  if (cores >= 8 && memory >= 8 && width >= 1024) return "high";
  if (cores >= 4 && width >= 768) return "high";
  return "low";
}
