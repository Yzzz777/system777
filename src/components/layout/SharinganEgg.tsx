"use client";

/**
 * Easter egg: Sharingan a pantalla completa.
 * Se activa con el código Konami o con 3 clics seguidos en el logo (evento
 * `system777:sharingan`). Respeta prefers-reduced-motion (no se muestra).
 * SVG procedural: no usa ningún asset de la obra.
 */

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

function SharinganSvg() {
  const tomoe = [0, 120, 240];
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-hidden="true"
      className="h-[46vmin] w-[46vmin] drop-shadow-[0_0_60px_rgba(255,30,54,0.55)]"
    >
      <defs>
        <radialGradient id="egg-iris" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#e8283b" />
          <stop offset="70%" stopColor="#c81628" />
          <stop offset="100%" stopColor="#8d0f1d" />
        </radialGradient>
        <g id="egg-tomoe">
          <circle cx="50" cy="30" r="6.8" fill="#0a0a0f" />
          <path
            d="M44.6 33.8 C 41.6 37.6, 38.4 40.6, 36.4 44.6 C 41.6 42.4, 48.8 40.4, 55.4 35.4 Z"
            fill="#0a0a0f"
          />
        </g>
      </defs>
      <circle cx="50" cy="50" r="47" fill="url(#egg-iris)" />
      <circle cx="50" cy="50" r="47" fill="none" stroke="#2c0a10" strokeWidth="3" />
      <circle cx="50" cy="50" r="35" fill="#d91b2d" opacity="0.55" />
      <circle cx="50" cy="50" r="9.5" fill="#0a0a0f" />
      {tomoe.map((deg) => (
        <use key={deg} href="#egg-tomoe" transform={`rotate(${deg} 50 50)`} />
      ))}
    </svg>
  );
}

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
      timer = window.setTimeout(() => setShow(false), 2400);
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
      className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-black/45"
      aria-hidden="true"
    >
      <div className="egg-pop">
        <div className="egg-spin">
          <SharinganSvg />
        </div>
      </div>
      <span className="sr-only">Easter egg: sharingan</span>
    </div>
  );
}
