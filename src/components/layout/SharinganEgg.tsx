"use client";

/**
 * Easter egg: activación real del Sharingan a pantalla completa.
 * Se activa con el código Konami o con 3 clics seguidos en el logo (evento
 * `system777:sharingan`). Respeta prefers-reduced-motion (no se muestra).
 * Animación: `public/eye/eye-activation.webp` (secuencia real del usuario,
 * 33 frames · 90 ms · 2,97 s por ciclo).
 */

import Image from "next/image";
import { useEffect, useState } from "react";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function SharinganEgg() {
  const [show, setShow] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const upd = () => setReduce(mq.matches);
    upd();
    mq.addEventListener?.("change", upd);

    let idx = 0;
    let timer: number | undefined;

    const fire = () => {
      if (mq.matches) return;
      setShow(true);
      window.clearTimeout(timer);
      // un ciclo completo de la animación (33 × 90 ms)
      timer = window.setTimeout(() => setShow(false), 3000);
    };

    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      idx = k === KONAMI[idx] ? idx + 1 : k === KONAMI[0] ? 1 : 0;
      if (idx === KONAMI.length) {
        idx = 0;
        fire();
      }
    };
    const onEgg = () => fire();

    window.addEventListener("keydown", onKey);
    window.addEventListener("system777:sharingan", onEgg);
    return () => {
      mq.removeEventListener?.("change", upd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("system777:sharingan", onEgg);
      window.clearTimeout(timer);
    };
  }, []);

  if (reduce || !show) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-black/55 px-4"
      aria-hidden="true"
    >
      <div className="egg-pop">
        <Image
          src="/eye/eye-activation.webp"
          alt=""
          width={500}
          height={283}
          unoptimized
          draggable={false}
          className="w-[min(86vw,640px)] rounded-[18px] border border-[rgba(255,42,66,0.35)] shadow-[0_0_90px_rgba(255,30,54,0.45)]"
        />
      </div>
      <span className="sr-only">Easter egg: activación del sharingan</span>
    </div>
  );
}
