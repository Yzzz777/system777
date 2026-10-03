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
- Animación: SVG procedural centrado con `egg-pop` (2.4 s: entra, pulsa, sale) y
  `egg-spin` (1.5 s/rev); `pointer-events-none` para no tocar la página.
- `prefers-reduced-motion: reduce` → **no se muestra jamás** (el componente sale
  antes de pintar y la ruta 3D tampoco monta escena).

## Banner con inclinación 3D

`TiltBanner.tsx`: el banner de System 777 se inclina con el puntero
(`rotateX`/`rotateY` ≤ 7°/10° + escala 1.03), amortiguado con
`cubic-bezier(0.22, 1, 0.36, 1)`; sólo con `hover: hover` y sin
`prefers-reduced-motion`.

