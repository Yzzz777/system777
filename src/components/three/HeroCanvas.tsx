"use client";

/**
 * Contenedor de la escena 3D del hero.
 *
 * Cadenas de decisión (docs/3D.md):
 *   sin WebGL / reduced-motion  → composición CSS estática (fallback)
 *   con WebGL                   → carga diferida de NetworkScene (dynamic, ssr:false)
 *                                 pausa/desmonta la escena cuando sale del viewport
 */

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { getTier, hasWebGL, prefersReducedMotion, type Tier } from "./quality";

const NetworkScene = dynamic(() => import("./NetworkScene"), {
  ssr: false,
  loading: () => null,
});

function StaticFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 68% 32%, rgba(0,229,255,0.12), transparent 70%), radial-gradient(45% 40% at 22% 72%, rgba(96,165,250,0.10), transparent 70%), radial-gradient(40% 35% at 80% 78%, rgba(89,241,255,0.09), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.055) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage:
            "radial-gradient(75% 65% at 55% 45%, #000 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(75% 65% at 55% 45%, #000 20%, transparent 80%)",
        }}
      />
      <span className="absolute left-[18%] top-[30%] h-1.5 w-1.5 rounded-full bg-[#00e5ff]/70 shadow-[0_0_14px_2px_rgba(0,229,255,0.5)]" />
      <span className="absolute left-[72%] top-[24%] h-1 w-1 rounded-full bg-[#60a5fa]/70 shadow-[0_0_12px_2px_rgba(96,165,250,0.5)]" />
      <span className="absolute left-[64%] top-[66%] h-1.5 w-1.5 rounded-full bg-[#59f1ff]/70 shadow-[0_0_14px_2px_rgba(89,241,255,0.45)]" />
      <span className="absolute left-[32%] top-[74%] h-1 w-1 rounded-full bg-[#00e5ff]/60" />
    </div>
  );
}

export default function HeroCanvas({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState(false);
  const [tier, setTier] = useState<Tier>("low");
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reason, setReason] = useState<"init" | "nogl" | "reduced" | "ready">("init");

  useEffect(() => {
    const gl = hasWebGL();
    const rm = prefersReducedMotion();
    if (!gl) return setReason("nogl");
    if (rm) return setReason("reduced");
    const ok = gl && !rm;
    if (!ok) return;
    setTier(getTier());
    setSupported(true);
    setReason("ready");

    // carga diferida: el contenido principal se pinta primero
    const t = window.setTimeout(() => setLoaded(true), 180);

    const io = new IntersectionObserver(
      (entries) => setVisible(entries[0]?.isIntersecting ?? false),
      { rootMargin: "250px 0px" }
    );
    if (hostRef.current) io.observe(hostRef.current);

    // si el usuario pasa a reduced-motion en caliente, retiramos la escena
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (mq.matches) {
        setSupported(false);
        setLoaded(false);
      }
    };
    mq.addEventListener?.("change", onChange);

    return () => {
      window.clearTimeout(t);
      io.disconnect();
      mq.removeEventListener?.("change", onChange);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      data-hero={supported ? (loaded ? "scene" : "loading") : reason}
      data-tier={tier}
      data-visible={String(visible)}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {supported && loaded ? (
        <NetworkScene tier={tier} active={visible} />
      ) : (
        <StaticFallback />
      )}
    </div>
  );
}
