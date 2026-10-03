"use client";

/**
 * Sharingan 3D (referencia estética, geometría procedural — sin assets de Naruto).
 *
 * - disco cilíndrico con iris rojo, pupila y 3 tomoe (magatama) generados con Shape
 * - gira lento de forma pasiva; al acercarse el puntero "se activa":
 *   giro rápido, pulso de escala y halo rojo intenso
 * - posición reactiva a la relación de aspecto (visible en móvil)
 * - sin luces puntuales: ambientLight + materiales básicos/estándar
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ChidoriArcs from "./ChidoriArcs";

type Vec2 = { x: number; y: number };

/** Cola del tomoe: coma curva procedural */
function tomoeTailShape() {
  const s = new THREE.Shape();
  s.moveTo(-0.32, -0.2);
  s.bezierCurveTo(-0.44, -0.52, -0.28, -0.8, 0.04, -0.92);
  s.bezierCurveTo(-0.02, -0.6, 0.1, -0.38, 0.32, -0.2);
  s.closePath();
  return s;
}

function Tomoe({ shape }: { shape: THREE.Shape }) {
  return (
    <group>
      {/* cabeza */}
      <mesh position={[0, 0.1, 0]}>
        <circleGeometry args={[0.4, 40]} />
        <meshBasicMaterial color="#0a0a0f" />
      </mesh>
      {/* cola */}
      <mesh>
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial color="#0a0a0f" />
      </mesh>
    </group>
  );
}

export default function Sharingan({
  pointer,
  activeRef,
  basePosition = [15, 14.5, -10],
  scale = 1.15,
}: {
  pointer: React.RefObject<Vec2>;
  activeRef?: React.RefObject<number>;
  basePosition?: [number, number, number];
  scale?: number;
}) {
  const root = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const act = useRef(0);
  const responsive = useRef(1);
  const tail = useMemo(() => tomoeTailShape(), []);
  const proj = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const g = root.current;
    if (!g) return;
    const cam = state.camera as THREE.PerspectiveCamera;

    // posición: más cerca del centro en pantallas estrechas
    const aspect = cam.aspect || 1;
    const k = THREE.MathUtils.clamp(aspect / 1.6, 0.4, 1);
    const narrow = aspect < 1 ? 0.7 : 1;
    g.position.set(basePosition[0] * k * narrow, basePosition[1], basePosition[2]);
    responsive.current = narrow;

    // proximidad del puntero (NDC de la escena vs. posición proyectada)
    proj.copy(g.position).project(cam);
    const px = pointer.current?.x ?? 0;
    const py = pointer.current?.y ?? 0; // y hacia abajo
    const d = Math.hypot(px - proj.x, -py - proj.y);
    const target = d < 0.4 ? 1 : 0;
    act.current += (target - act.current) * Math.min(1, delta * 4);
    const a = act.current;
    if (activeRef) activeRef.current = a;

    const t = state.clock.elapsedTime;
    if (spin.current) spin.current.rotation.z -= delta * (0.22 + a * 3.4);
    g.rotation.x = Math.sin(t * 0.4) * 0.14;
    g.rotation.y = Math.cos(t * 0.32) * 0.18;
    const s = scale * (responsive.current || 1) * (1 + Math.sin(t * 2.2) * 0.012 + a * 0.06);
    g.scale.setScalar(s);

    if (halo.current) {
      const m = halo.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.05 + a * 0.3 + Math.sin(t * 3) * 0.03;
    }
  });

  return (
    <group ref={root} position={basePosition} scale={scale}>
      {/* halo (aditivo) */}
      <mesh ref={halo} position={[0, 0, -0.06]}>
        <circleGeometry args={[3.1, 64]} />
        <meshBasicMaterial
          color="#ff2438"
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <group ref={spin}>
        {/* disco (cara frontal hacia la cámara) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[2.7, 2.7, 0.22, 72]} />
          <meshStandardMaterial color="#0b0b11" roughness={0.55} metalness={0.1} />
        </mesh>
        {/* aro exterior */}
        <mesh position={[0, 0, 0.12]}>
          <ringGeometry args={[2.55, 2.7, 72]} />
          <meshBasicMaterial color="#2a0c10" />
        </mesh>
        {/* iris */}
        <mesh position={[0, 0, 0.12]}>
          <circleGeometry args={[2.5, 72]} />
          <meshBasicMaterial color="#b71425" />
        </mesh>
        {/* iris interior (profundidad) */}
        <mesh position={[0, 0, 0.13]}>
          <circleGeometry args={[1.9, 72]} />
          <meshBasicMaterial color="#d01b2d" />
        </mesh>
        {/* pupila */}
        <mesh position={[0, 0, 0.14]}>
          <circleGeometry args={[0.52, 48]} />
          <meshBasicMaterial color="#0a0a0f" />
        </mesh>

        {/* 3 tomoe */}
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
            <group position={[0, 1.55, 0.15]} rotation={[0, 0, -0.9]}>
              <Tomoe shape={tail} />
            </group>
          </group>
        ))}
      </group>

      {/* chidori: destellos que siguen al ojo */}
      <ChidoriArcs activeRef={act} />
    </group>
  );
}
