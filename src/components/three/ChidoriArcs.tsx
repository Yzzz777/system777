"use client";

/**
 * Chidori — destellos eléctricos sutiles alrededor del Sharingan.
 * Geometría procedural (casillos finos), parpadeo determinista por índice.
 * Aparecen cuando el Sharingan está activo (proximidad del puntero).
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function ChidoriArcs({
  activeRef,
  count = 7,
}: {
  activeRef: React.RefObject<number>;
  count?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const shards = useRef<(THREE.Mesh | null)[]>([]);

  const layout = useMemo(() => {
    const rnd = mulberry32(42);
    return Array.from({ length: count }, () => ({
      angle: rnd() * Math.PI * 2,
      radius: 3.3 + rnd() * 1.5,
      len: 0.8 + rnd() * 0.8,
      z: -0.2 + rnd() * 0.8,
      tilt: (rnd() - 0.5) * 1.6,
      phase: rnd() * Math.PI * 2,
      speed: 5 + rnd() * 6,
    }));
  }, [count]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const a = activeRef.current ?? 0;
    g.visible = a > 0.05;
    if (!g.visible) return;
    const t = state.clock.elapsedTime;
    layout.forEach((cfg, i) => {
      const m = shards.current[i];
      if (!m) return;
      const flash = Math.sin(t * cfg.speed + cfg.phase);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = (flash > 0.8 ? 0.75 : 0.04) * a;
      m.visible = mat.opacity > 0.02;
    });
  });

  return (
    <group ref={group} visible={false}>
      {layout.map((cfg, i) => (
        <group key={i} rotation={[0, 0, cfg.angle]}>
          <mesh
            ref={(el) => {
              shards.current[i] = el;
            }}
            position={[cfg.radius, 0, cfg.z]}
            rotation={[0, 0, Math.PI / 2 + cfg.tilt]}
          >
            <planeGeometry args={[0.07, cfg.len]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#8f6bff" : "#5ad9ff"}
              transparent
              opacity={0}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
