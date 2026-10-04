"use client";

/**
 * Barra de progreso de scroll (estilo Apple): fija arriba del todo,
 * ligada a scrollYProgress. Se oculta tras montar si el usuario pide
 * reduced-motion (el gate es post-hidratación: SSR y cliente first-render
 * son idénticos).
 */

import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const upd = () => setHide(mq.matches);
    upd();
    mq.addEventListener?.("change", upd);
    return () => mq.removeEventListener?.("change", upd);
  }, []);

  if (hide) return null;

  return (
    <motion.div
      data-scroll-progress
      aria-hidden="true"
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-0 z-[60] h-[2.5px] origin-left bg-gradient-to-r from-[var(--brand)] via-[var(--data)] to-[#59f1ff]"
    />
  );
}
