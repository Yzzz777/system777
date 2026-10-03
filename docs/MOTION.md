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
