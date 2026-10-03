"use client";

/**
 * Escena 3D "Sistema / Network / Developer".
 *
 * - nodos + conexiones (grafo de red: Developer · Systems · Cybersecurity)
 * - campo de partículas con profundidad
 * - grid de infraestructura
 * - reacciona al puntero (parallax) y al scroll (deriva vertical)
 * - sin OrbitControls: nunca captura el scroll/touch
 *
 * Se monta sólo si hay WebGL y el usuario no pidió reducir el movimiento
 * (ver `quality.ts` y `HeroCanvas.tsx`).
 */

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Sharingan from "./Sharingan";
import type { Tier } from "./quality";

type Vec2 = { x: number; y: number };

/** PRNG determinista para que la red sea estable entre renders */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COLORS = [
  new THREE.Color("#00ff88"), // brand
  new THREE.Color("#45c8ff"), // data
  new THREE.Color("#5865f2"), // system
  new THREE.Color("#9dffe0"), // highlight
];

function buildGraph(nodeCount: number, seed: number) {
  const rnd = mulberry32(seed);
  const spread = 15;
  const nodes: THREE.Vector3[] = [];

  for (let i = 0; i < nodeCount; i++) {
    // Distribución tipo nube elipsoidal (más densa en el centro)
    const r = Math.pow(rnd(), 0.65) * spread;
    const theta = rnd() * Math.PI * 2;
    const phi = Math.acos(2 * rnd() - 1);
    nodes.push(
      new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta) * 1.35,
        r * Math.sin(phi) * Math.sin(theta) * 0.75,
        r * Math.cos(phi) * 0.9
      )
    );
  }

  // Conexiones: cada nodo se enlaza con sus 2 vecinos más cercanos
  const pairs = new Set<string>();
  const edges: [THREE.Vector3, THREE.Vector3][] = [];
  for (let i = 0; i < nodes.length; i++) {
    const dists = nodes
      .map((n, j) => ({ j, d: i === j ? Infinity : nodes[i].distanceTo(n) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
    for (const { j } of dists) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (pairs.has(key)) continue;
      pairs.add(key);
      edges.push([nodes[i], nodes[j]]);
    }
  }

  const nodePos = new Float32Array(nodes.length * 3);
  const nodeCol = new Float32Array(nodes.length * 3);
  nodes.forEach((n, i) => {
    nodePos.set([n.x, n.y, n.z], i * 3);
    const c = COLORS[i % COLORS.length];
    nodeCol.set([c.r, c.g, c.b], i * 3);
  });

  const edgePos = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], i) => {
    edgePos.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
  });

  return { nodePos, nodeCol, edgePos, nodeCount: nodes.length, edgeCount: edges.length };
}

function buildParticles(count: number, seed: number) {
  const rnd = mulberry32(seed);
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos.set(
      [(rnd() - 0.5) * 70, (rnd() - 0.5) * 42, (rnd() - 0.5) * 40 - 6],
      i * 3
    );
    const c = COLORS[Math.floor(rnd() * COLORS.length)];
    const dim = 0.35 + rnd() * 0.5;
    col.set([c.r * dim, c.g * dim, c.b * dim], i * 3);
  }
  return { pos, col, count };
}

function buildGrid(size: number, step: number) {
  const half = size / 2;
  const pts: number[] = [];
  for (let i = -half; i <= half; i += step) {
    pts.push(-half, 0, i, half, 0, i);
    pts.push(i, 0, -half, i, 0, half);
  }
  return new Float32Array(pts);
}

function Graph({
  tier,
  pointer,
  scroll,
}: {
  tier: Tier;
  pointer: React.RefObject<Vec2>;
  scroll: React.RefObject<number>;
}) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const particles = useRef<THREE.Group>(null);
  const nodeMat = useRef<THREE.PointsMaterial>(null);
  const edgeMat = useRef<THREE.LineBasicMaterial>(null);

  const graph = useMemo(
    () => buildGraph(tier === "high" ? 48 : 22, 777),
    [tier]
  );
  const dust = useMemo(
    () => buildParticles(tier === "high" ? 340 : 110, 1337),
    [tier]
  );
  const grid = useMemo(() => buildGrid(60, 4), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const d = Math.min(1, delta * 2.5);

    if (outer.current) outer.current.rotation.y = t * 0.045;
    if (particles.current) {
      particles.current.rotation.y = -t * 0.018;
      particles.current.rotation.x = Math.sin(t * 0.12) * 0.05;
    }

    const g = inner.current;
    if (g) {
      const targetY = pointer.current.x * 0.38;
      const targetX = -pointer.current.y * 0.2;
      g.rotation.y += (targetY - g.rotation.y) * d;
      g.rotation.x += (targetX - g.rotation.x) * d;
      g.position.y = -(scroll.current || 0) * 0.0045;
    }

    // pulso sutil de los nodos y "latido" de la red
    if (nodeMat.current) {
      nodeMat.current.size = (tier === "high" ? 0.46 : 0.6) + Math.sin(t * 1.4) * 0.05;
    }
    if (edgeMat.current) {
      edgeMat.current.opacity = 0.22 + Math.sin(t * 0.8) * 0.05;
    }
  });

  return (
    <>
      {/* nube de partículas de fondo */}
      <group ref={particles}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[dust.pos, 3]} />
            <bufferAttribute attach="attributes-color" args={[dust.col, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.16}
            sizeAttenuation
            vertexColors
            transparent
            opacity={0.85}
            depthWrite={false}
          />
        </points>
      </group>

      {/* grafo: nodos + aristas + grid, con parallax */}
      <group ref={outer}>
        <group ref={inner}>
          <points frustumCulled={false}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[graph.nodePos, 3]} />
              <bufferAttribute attach="attributes-color" args={[graph.nodeCol, 3]} />
            </bufferGeometry>
            <pointsMaterial
              ref={nodeMat}
              size={0.46}
              sizeAttenuation
              vertexColors
              transparent
              opacity={0.95}
              depthWrite={false}
            />
          </points>

          <lineSegments frustumCulled={false}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[graph.edgePos, 3]} />
            </bufferGeometry>
            <lineBasicMaterial
              ref={edgeMat}
              color="#00ff88"
              transparent
              opacity={0.22}
              depthWrite={false}
            />
          </lineSegments>

          {/* grid de infraestructura */}
          <lineSegments position={[0, -11, -4]} frustumCulled={false}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[grid, 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="#45c8ff" transparent opacity={0.07} depthWrite={false} />
          </lineSegments>
        </group>
      </group>
    </>
  );
}

export default function NetworkScene({ tier, active = true }: { tier: Tier; active?: boolean }) {
  const pointer = useRef<Vec2>({ x: 0, y: 0 });
  const scroll = useRef(0);
  const shareAct = useRef(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scroll.current = window.scrollY;
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Canvas
      dpr={tier === "high" ? [1, 1.75] : [1, 1.25]}
      camera={{ position: [0, 0, 26], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      performance={{ min: 0.5 }}
      frameloop={active ? "always" : "never"}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <ambientLight intensity={2.4} />
      <Graph tier={tier} pointer={pointer} scroll={scroll} />
      <Sharingan pointer={pointer} activeRef={shareAct} />
    </Canvas>
  );
}
