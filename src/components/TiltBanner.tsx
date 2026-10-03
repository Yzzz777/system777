"use client";

/**
 * Banner de System 777 con inclinación 3D al mover el puntero (parallax).
 * Desactivado con prefers-reduced-motion o en dispositivos sin hover.
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function TiltBanner({ src, alt }: { src: string; alt: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hover = window.matchMedia("(hover: hover)");
    const upd = () => setEnabled(!rm.matches && hover.matches);
    upd();
    rm.addEventListener?.("change", upd);
    hover.addEventListener?.("change", upd);
    return () => {
      rm.removeEventListener?.("change", upd);
      hover.removeEventListener?.("change", upd);
    };
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setMoving(true);
    setTilt({ x: -py * 7, y: px * 10 });
  };

  const reset = () => {
    setMoving(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={wrap}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ perspective: "1200px" }}
      className="panel overflow-hidden p-0"
    >
      <div
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${moving ? 1.03 : 1})`,
          transition: `transform ${moving ? 120 : 450}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          transformStyle: "preserve-3d",
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={1181}
          height={472}
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
