"use client";

/**
 * Ojo real (animación WebP del usuario, no procedural).
 *
 * - `public/eye/sharingan-spin.webp`: secuencia real de activación (gira → mangekyo)
 * - proximidad del puntero → "se activa": escala, halo rojo y anillo más rápido
 * - prefers-reduced-motion → primer frame estático, sin animación CSS
 * - `unoptimized` para que Next no reencode y pierda la animación
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function RealEye({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const upd = () => setReduce(mq.matches);
    upd();
    mq.addEventListener?.("change", upd);

    let raf = 0;
    let last = false;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrapRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.width === 0) return;
        const d = Math.hypot(
          e.clientX - (r.left + r.width / 2),
          e.clientY - (r.top + r.height / 2)
        );
        const hit = d < r.width * 0.75 + 90;
        if (hit !== last) {
          last = hit;
          setNear(hit);
        }
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      mq.removeEventListener?.("change", upd);
    };
  }, []);

  const active = !reduce && near;

  return (
    <div
      ref={wrapRef}
      data-eye={reduce ? "reduced" : active ? "active" : "idle"}
      className={`pointer-events-none relative mx-auto aspect-square w-full ${className}`}
      aria-hidden="true"
    >
      {/* halo rojo */}
      <span
        className={`eye-glow ${active ? "is-active" : ""}`}
        aria-hidden
      />
      {/* anillo orbitando */}
      <svg viewBox="0 0 100 100" className={`eye-orbit ${active ? "is-active" : ""}`} aria-hidden>
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="rgba(255,42,66,0.55)"
          strokeWidth="1.2"
          strokeDasharray="4 7"
        />
      </svg>
      {/* animación real */}
      <div className="eye-float">
        <Image
          src={reduce ? "/eye/sharingan-spin-static.webp" : "/eye/sharingan-spin.webp"}
          alt=""
          width={500}
          height={300}
          unoptimized
          draggable={false}
          className={`eye-img h-full w-full rounded-full border border-[rgba(255,42,66,0.35)] object-cover shadow-[0_0_40px_rgba(255,30,54,0.25)] ${active ? "is-active" : ""}`}
        />
      </div>
    </div>
  );
}
