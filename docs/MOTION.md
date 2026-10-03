# Motion — Sistema de movimiento

Capa de animación del sitio. Fuentes de método: skills instaladas
(`design-motion-principles`, `high-end-visual-design`).

## Niveles

| Nivel | Uso | Ejemplos |
| --- | --- | --- |
| **Micro** | confirmación de interacción | hover, focus, toggles, chips |
| **Medio** | cambios de estado | menú móvil, dropdowns, reveals de scroll |
| **Grande** | entradas / cambios de contexto | hero escalonado, salto de página |

Un elemento en un solo nivel por animación. Nada simultáneo compite en dos niveles.

## Tokens

- Duración: `150 ms` micro · `250 ms` medio · `400–500 ms` grande.
- Easing por defecto: `cubic-bezier(0.22, 1, 0.36, 1)` (salida suave).
  Entradas con desaceleración, salidas más rápidas (la salida nunca se retrasa).
- Transform y opacity como canales: sin animar ancho, alto, top o color si se
  puede evitar (layout thrashing).

## Reveals (scroll)

Clase `.reveal` / `.reveal.is-visible` en `globals.css`, activada por
`IntersectionObserver` en el componente `Reveal` (`src/app/page.tsx`):

- Umbral: `threshold 0.08`, `rootMargin "0px 0px -8% 0px"` — entra cuando la
  sección está de verdad a la vista, no antes.
- Retardo escalonado con `--reveal-delay` (0–360 ms): el hero entra por capas
  (eyebrow → título → subtítulo → párrafo → CTAs → strip).
- Se desconecta el observer tras la primera intersección: corre una sola vez.
- Opt-in `blur` (prop del componente → clase `.reveal-blur`): los títulos
  (eyebrow/h1 del hero y los 7 `section-head`) entran desenfocados
  (`blur(10px)` → `blur(0)`) en el mismo canal de transición. Sólo texto:
  el `filter` crea bloque contenedor y no debe envolver `position: fixed`.

## Transición de ruta

`src/app/template.tsx` (App Router remonta `template` en cada navegación) pinta
`<div data-page-template class="page-enter">`: keyframes CSS `page-enter`
(opacity 0→1 + `translateY(18px)`→0, 450 ms, easing de tokens). CSS puro —
idéntico en servidor y cliente (sin desajuste de hidratación) y desactivado para
`prefers-reduced-motion` por la regla global `animation-duration: 0.001ms`.

## Barra de progreso de scroll

`ScrollProgress.tsx`: fija `fixed inset-x-0 top-0 z-[60]`, 2.5 px, gradiente
brand→data→`#5865f2`, `scaleX` ligado a `scrollYProgress` (framer). Se oculta
tras el montaje si hay `prefers-reduced-motion` (gate post-hidratación: el SSR
y el primer render del cliente son idénticos).

## Parallax del hero (estilo Apple)

En `HomePage` (`src/app/page.tsx`), ligado a `useScroll()` con rango 0–700 px:

| Capa | Transform |
| --- | --- |
| Retrato | `y 0→-70`, `scale 1→0.96` |
| Texto | `y 0→-38`, `opacity 1→0.55` (desde 300 px) |
| Ojo real | `y 0→-140` (más rápido: profundidad) |

Gate `allowMotion` (estado + `matchMedia` en `useEffect`, arranca en `false`):
sin `prefers-reduced-motion` las capas reciben `style`; con la señal no se pasa
`style` alguno. Efecto: SSR e hidratación idénticos (nunca `useReducedMotion()`
durante el render), y los usuarios reduced no reciben parallax.

## Pill de navegación activo

`Navbar.tsx` marca la ruta activa con `<motion.span layoutId="nav-pill">`
(fondo + ring, muelle 380/32) que **se desliza** entre Inicio/Proyectos/… al
navegar; hijos del dropdown y menú móvil usan estado estático (sin `layoutId`).
`MotionConfig reducedMotion="user"` en `Providers.tsx` hace que framer omita
transforms/layout para quienes lo piden. `aria-current="page"` + `data-nav-link`
en cada enlace.

## Reglas duras

- `prefers-reduced-motion: reduce` → todo a `opacity:1; transform:none`
  (`@media` en `globals.css`). Animación **y** escena 3D respetan la señal, además
  de React (`HeroCanvas` reacciona en caliente).
- Ninguna animación bloquea el clic: el botón debe ser estable y presionable desde
  el primer frame. Decoración con `pointer-events-none` (ver incidencia del
  overlay que tapaba el botón de Discord en `/login`).
- Sin bucles infinitos decorativos en el contenido principal; lo que respira
  (pulso de estado, deriva de la escena 3D) es sutil, lento y no distrae.
- Sin animaciones de layout en datos vivos (contador, uptime): los números cambian
  con transición de color/altura mínima, nunca con rebotes.

## Iconografía de estado

- Hamburger → X: componente `Navbar` (`open ? <X/> : <Menu/>`) con transición.
- Estados (`status-online`): pulso de opacidad, 2 s, sin movimiento de
  posición.

## Easter egg (Sharingan)

- Disparadores: **código Konami** o **3 clics seguidos en el logo** de la navbar
  (evento `system777:sharingan`).
- Animación: **secuencia real** del usuario — `public/eye/eye-activation.webp`
  (33 frames · 90 ms · 2,97 s por ciclo) con `egg-pop` (3 s: entra, se mantiene
  un ciclo completo, sale) sobre fondo `bg-black/55`; `pointer-events-none` para
  no tocar la página.
- `prefers-reduced-motion: reduce` → **no se muestra jamás** (el componente sale
  antes de pintar y la ruta 3D tampoco monta escena).

## Ojo real del hero

`RealEye.tsx` + `public/eye/sharingan-spin.webp` (animación real, no
procedural): flotación `eye-float` (7 s), halo `eye-glow` y anillo
`eye-orbit` (26 s/rev); proximidad del puntero → `active` (escala 1.08, halo
100 %, anillo 4 s/rev). Reduced-motion → frame estático. Ver `docs/3D.md`.

## Banner con inclinación 3D

`TiltBanner.tsx`: el banner de System 777 se inclina con el puntero
(`rotateX`/`rotateY` ≤ 7°/10° + escala 1.03), amortiguado con
`cubic-bezier(0.22, 1, 0.36, 1)`; sólo con `hover: hover` y sin
`prefers-reduced-motion`.

