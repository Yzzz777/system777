# REDESIGN_PLAN.md — jrsystem7777.com v2

- **Fecha:** 2026-10-03
- **Base:** `AUDIT.md` (misma fecha)
- **Marca:** Yzzz 777 / Ángel
- **Objetivo:** portafolio personal moderno, tecnológico, rápido y con identidad propia, sin perder System 777 ni el contador.
- **Regla:** este documento es plan. La implementación es un paso aparte y validado por fase.

---

## 1. Dirección visual

> **Yzzz 777 — Developer · Systems · Cybersecurity**

| Atributo | Decisión |
|---|---|
| Modo | Dark, casi negro, con profundidad por capas (no por glassmorphism) |
| Personal | Retrato real de Ángel + voz en primera persona; nada de copy corporativo |
| Tecnológico | Grid fino, mono para datos, micro-labels tipo terminal, estado en vivo |
| Futurista | Motion controlado (reveal + hover), sin neón constante ni gradientes genéricos |
| Premium | Superficies planas con borde de 1px, sombras profundas y discretas, espacio generoso |
| Identidad propia | Verde eléctrico **solo** como firma de Yzzz 777; violeta Discord **solo** dentro de System 777 |

### Evitar
Plantillas de IA, exceso de glassmorphism, neón por todos lados, gradientes morado/azul de manual, animaciones sin propósito, tarjetas idénticas repetidas 40 veces, cifras inventadas.

---

## 2. Design system (tokens centralizados en `globals.css`)

### Tipografía (3 familias máximo)
| Rol | Fuente | Uso |
|---|---|---|
| Display | **Space Grotesk** (ya cargada con `next/font`) | H1/H2, cifras del contador |
| Body | **Inter** (ya cargada) | Texto corrido, UI |
| Mono | `ui-monospace, SFMono-Regular, Menlo, monospace` (**sin descargar**) | Labels, datos técnicos, terminal |

Sin añadir descargas de fuentes → sin coste de rendimiento.

### Color (tokens, no valores sueltos)
```
--bg            #05050A     fondo base
--bg-raised     #0A0A11     secciones alternas
--surface       #0E0E16     tarjetas
--surface-2     #14141F     tarjetas elevadas / hover
--line          rgba(255,255,255,.07)   borde base
--line-strong   rgba(255,255,255,.14)   borde hover
--text          #F2F4F8     texto principal  (contraste AA sobre --bg)
--text-2        #A7ADBD     texto secundario (≈7:1)
--text-3        #767D8E     metadatos        (≈4.6:1 mínimo, evita gray-600)
--brand         #00FF88     firma Yzzz 777
--brand-dim     rgba(0,255,136,.14)
--data          #45C8FF     datos / estado / gráficos
--system        #5865F2     EXCLUSIVO de la sección System 777
--warn / --err  #FFC53D / #FF5C5C
```

### Espaciado, radios, sombras
- Escala 8px: `--s1: .25rem … --s16: 4rem` (+ `--section-y` responsivo).
- Radios: `--r-sm 8px`, `--r-md 14px`, `--r-lg 22px`, `--r-full`.
- Sombras: `--shadow-1` (reposo), `--shadow-2` (hover), `--glow-brand` (solo CTA y foco).

### Motion
- `--dur-fast 140ms`, `--dur 240ms`, `--dur-slow 520ms`.
- `--ease-out cubic-bezier(.16,1,.3,1)`.
- Reglas: reveal una sola vez (`once`), stagger máximo 60ms, sin animar layout en móvil.
- **`prefers-reduced-motion: reduce`** desactiva reveal, parallax, partículas y tilt (no solo acorta duración).

### Componentes compartidos
`.panel`, `.panel-hover`, `.eyebrow`, `.section-head`, `.btn`, `.btn-primary`, `.btn-ghost`, `.chip`, `.stat`, `.divider-glow`, `.focus-ring` (`:focus-visible` global: 2px `--brand` + offset).

---

## 3. Estructura de la nueva home

1. **Hero** — retrato real `public/angel.webp`, "Ángel / Yzzz 777", especialidad, 2 CTAs, strip tipo terminal con estado real del bot, contador integrado, elemento visual tecnológico (grid + anillos, no partículas en móvil).
2. **About** — narrativa en primera persona: quién soy, qué hago, qué construyo, qué me interesa. Sin cifras de academia.
3. **Technologies** — categorías: Languages · Frontend · Backend · Data · Infrastructure · Tools. Solo tecnologías reales que ya usa.
4. **Cybersecurity** — áreas reales con **nivel honesto**: `Estudiando` / `Practicando` / `Proyecto real (System 777)`.
5. **Projects** — fichas reales con estado honesto e `Información próximamente` donde falte.
6. **System 777** — bloque propio tipo *producto/infraestructura*: identidad violeta, status en vivo real, features, VPS/PM2, Premium, CTA invitar. No es "una tarjeta más".
7. **Blog** — carga real desde `/api/blog/posts`; si no hay posts → estado honesto, sin posts falsos.
8. **Biblioteca** — solo recursos reales/enlaces públicos; nada de descargas inventadas.
9. **Contacto** — formulario + redes.

Se eliminan de la home: sección **Anuncios** (contenido inventado) y los 6 archivos de biblioteca falsos.

---

## 4. Reglas de contenido (no negociables)

1. Nada de datos inventados: sin estudiantes, cursos, visitas, uptime 99.9%, descargas falsas.
2. Las cifras del bot salen **siempre** de `/api/bot/stats`; si la API no responde → **"No disponible"**, nunca `0` ni números inventados.
3. El blog muestra solo posts reales de la base de datos.
4. La biblioteca no anuncia archivos que no existen.
5. Cada proyecto con estado explícito: `Activo` / `En desarrollo` / `Información próximamente`.
6. System 777 y el contador **se conservan**.
7. Stack sin cambios: Next.js 15 + Tailwind v4 + framer-motion.

---

## 5. Bugs técnicos a corregir (del auditoría)

| # | Bug | Fix previsto |
|---|---|---|
| 1 | Navbar invisible en `/` (`translateY(-100)` tras fallo de hidratación) | Navbar sin `initial` animado: transición CSS `data-scrolled`; entrada por clase |
| 2 | Hydration error en `/` (`StudyTimeCounter` + `Math.random`) | Contador: render inicial determinista con `suppressHydrationWarning` + arranque en `useEffect`; partículas eliminadas/reemplazadas por CSS estático |
| 3 | Uptime tratado como ms | `formatUptime` en segundos |
| 4 | `/bot/commands`: keys duplicadas + overflow | key única (`cat:name`), wrap/scroll del bloque de usage |
| 5 | Endpoints de blog sin auth | HMAC sobre la cookie de sesión (`AUTH_SECRET`) + ID de owner; 401 en caso contrario |
| 6 | `/api/bot/stats` inventa datos | Responde `{available:false, online:false}` si no hay API/caída |
| 7 | Enlaces 404 (`/register`, `/community`, `/announcements`, `/dashboard`, `/admin`) | Se retiran del nav/footer; `/dashboard` no se enlaza |
| 8 | ESLint escanea `.next` | `ignores` en `eslint.config.mjs` |

---

## 6. SEO

- Título por página: `Ángel — Yzzz 777 · Developer, Systems & Cybersecurity` y variantes por ruta.
- Descripción única por página, `canonical`, `openGraph` (+ `og:image` con `angel.webp`), `twitter:card`.
- `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx`.
- Las páginas client mantienen su `metadata` vía `layout.tsx` de ruta (mínimo y explícito).

## 7. Accesibilidad

- Skip-link "Saltar al contenido".
- `:focus-visible` global visible.
- Menú "System 777" operable con teclado (click + `Escape`, no solo hover).
- Botones/enlaces reales, `alt` descriptivos, un `h1` por página, jerarquía sin saltos.
- Contraste mínimo AA (tokens `--text-2/3` corregidos).

## 8. Performance

- Retrato: WebP 12.5 KB (ya optimizado) con `priority` solo en hero.
- Sin el GIF de 1.9 MB en el hero (se deja el archivo en `public/` hasta aprobación).
- Sin WebGL/Three en móvil (de hecho: **no se usa WebGL** en esta fase → el 3D es CSS/profundidad con fallback trivial).
- Carga diferida de componentes pesados (ya separados por ruta).
- Eliminar 10 componentes muertos y dependencias sin uso sólo tras aprobación (documentado, no se toca en esta fase salvo los archivos muertos que contienen datos falsos).

## 9. Fases de implementación (orden)

```
1. Design system + layout/SEO base + not-found
2. Navbar (fix hidratación) + Footer
3. Hero (angel.webp) + Contador (fix hidratación)
4. About + Technologies + Cybersecurity
5. Projects + System 777 (stats reales + uptime)
6. Blog (API real + auth) + Biblioteca + Contacto
7. Responsive (320→1920) + Motion controlado + A11y
8. Testing Playwright → TEST_REPORT.md
9. Preview → espera "Aprobado para deploy"
```

Tras cada fase: `tsc --noEmit`, `eslint src`, servidor local y verificación con Playwright.

## 10. Definición de terminado

Ver `§21` del plan de remodelación: home navegable, navbar visible, foto real, contador funcionando, proyectos reales, System 777 activo, blog/biblioteca limpios, responsive probado, a11y/SEO/perf revisados, sin secretos, Playwright validado, preview entregada y **deploy solo tras aprobación explícita**.
