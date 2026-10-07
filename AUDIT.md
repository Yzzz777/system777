# AUDIT.md — jrsystem7777.com (antes de remodelación)

- **Fecha:** 2026-10-03
- **Agente:** OpenCode + MiMo-Code
- **Repo:** `/home/yzz777/Escritorio/proyectos x/system777`
- **Producción:** https://jrsystem7777.com (Cloudflare Pages)
- **Alcance:** inspección estática + ejecución local + inspección con Playwright (Chromium 153)
- **Regla aplicada:** auditoría sin modificar código. System 777 y el contador NO se tocaron.
- **Actualizado:** 2026-10-05 — cierre tras las fases 0–5 → ver **§13 Estado final** y **§14 Validación**.

---

## 1. Stack detectado

| Item | Valor |
|---|---|
| Framework | Next.js **15.3.3** (App Router) |
| React | 19.1.0 |
| TypeScript | 5.x — `tsc --noEmit` → **0 errores** |
| CSS | Tailwind **v4** (`@import "tailwindcss"` + `@theme`) |
| Animación | framer-motion 12.7, gsap 3.15, lenis 1.0.42 |
| 3D | three 0.185, @react-three/fiber 9.7, @react-three/drei 10.7 (**instalados, no usados en ninguna ruta**) |
| Auth | next-auth 5 beta + credenciales propias (`/api/auth/*`) |
| DB | Neon PostgreSQL (`@neondatabase/serverless`) |
| Deploy | Cloudflare Pages vía `@cloudflare/next-on-pages` + wrangler |
| Gestor | npm (`package-lock.json`) |
| Git | rama `main`; **58 cambios sin commitear** (borrados masivos de `academy/`, `admin/`, `api/admin/*`, posts de blog estáticos) |

Scripts: `dev`, `build`, `start`, `lint` (`eslint`).

---

## 2. Estructura y rutas

### Rutas públicas (200)

| Ruta | Contenido |
|---|---|
| `/` | Homepage (Hero, About, Skills, Tech, Cyber, Projects, System 777, Blog, Anuncios, Biblioteca, Contacto) |
| `/about` | **Contenido de academia falso** (ver §5) |
| `/technologies` | Stack con logos Devicon |
| `/cybersecurity` | Áreas + herramientas |
| `/projects` | 5 proyectos + file tree de YZ |
| `/blog` | Blog con posts hardcodeados (ver §5) |
| `/library` | Biblioteca con datos falsos (ver §5) |
| `/contact` | Formulario → Discord webhook |
| `/bot`, `/bot/commands`, `/bot/status`, `/bot/dashboard` | Sección System 777 |
| `/login` | Login Discord OAuth |
| `/privacy`, `/terms` | Legales |
| `/t/[userId]/[guildId]` | Ruta de IP tracking (route handler) |

### Rutas rotas

| Ruta | Estado | Dónde se enlaza |
|---|---|---|
| `/register` | **404** | Navbar (botón "Registrarse"), `/about` |
| `/community` | **404** | `/about` |
| `/announcements` | **404** | Footer |
| `/dashboard`, `/dashboard/settings` | **307 → /login** (página inexistente) | Navbar (menú de sesión) |
| `/admin`, `/admin/blog` | **404** (borrados sin commitear) | Navbar, `AdminLayout` |
| `/community` | **404** | `/about` |
| 404 personalizada | **No existe** `not-found.tsx` | — |

### APIs

| Endpoint | Estado | Problema |
|---|---|---|
| `GET /api/bot/stats` | 200 | **Devuelve datos inventados en fallback** (§5) |
| `GET/POST/DELETE /api/blog/posts` | 200 | **Sin autenticación**: cualquiera crea/borra posts (§7) |
| `POST /api/blog/upload` | 200 | **Sin autenticación**: subida arbitraria de archivos (§7) |
| `GET /api/blog/file/[id]` | 200 | Descarga pública (aceptable si el contenido es público) |
| `POST /api/contact` | 200 | Sin rate limit (riesgo bajo) |
| `GET /api/auth/*` | 200 | `session` → `null` sin sesión |

---

## 3. Componentes y dependencias relevantes

### Componentes usados
`layout/Navbar`, `layout/Footer`, `Providers`, `ThemeProvider`, `ThemePicker`, `NotificationBell`, `StudyTimeCounter`, `ui/Animations` (FadeIn, FadeInUp, Stagger*, HoverScale, FloatingElement, Typewriter, GlowPulse).

### Componentes muertos (0 imports) — deuda técnica
`Announcements`, `Projects`, `Library`, `Technologies`, `Cybersecurity`, `Blog`, `BlogPost`, `Certificate`, `RichTextEditor`, `AdminLayout` → **10 archivos** que contienen datos falsos y warnings de lint, sin uso.

### Dependencias sin uso
`three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `@studio-freight/lenis`, `html2canvas`, `jspdf`, `stripe`, `resend`, `bcryptjs` — ninguna aparece en rutas activas (pesan en el install/build).

---

## 4. Consola, red, responsive (Playwright, 13 rutas × 10 anchos)

### Errores de consola / runtime

| Ruta | Hallazgo | Severidad |
|---|---|---|
| `/` | **`Hydration failed`** (server/client no coinciden: `StudyTimeCounter` calcula la hora en el initializer + `Math.random()` en `Particles`) | **Crítica** |
| `/bot/commands` | **12×** `Encountered two children with the same key` (keys duplicadas en la lista de comandos) | Alta |
| `/bot/commands` | **Overflow horizontal**: `scrollWidth 1620 > clientWidth 1440` | Alta |
| `/no-existe` | 404 de recursos (esperado, sin página custom) | Baja |

### Bug crítico de navegación

En `/` el `<header>` queda **permanentemente en `translateY(-100px)` → la navbar NO se ve** en la portada (medido: `navY = -100` en 3/3 corridas, sigue en -100 a los 6 s). Está relacionado con el fallo de hidratación: framer-motion aplica `initial={{y:-100}}` y nunca ejecuta `animate`. En otras rutas es intermitente (`/bot` -100 a 1 s y 0 a 3 s; `/blog` -53 a 2,5 s).

### Responsive (home)

| Ancho | Overflow horizontal |
|---|---|
| 320, 375, 390, 430 | No |
| 768, 820, 1024 | No |
| 1280, 1440, 1920 | No |

- Menú móvil: **funciona** (hamburger abre 21 enlaces).
- Único overflow detectado: `/bot/commands` a 1440.

### Imágenes
- `imgs` sin `alt`: **0** en todas las rutas.
- `imgs` rotas: **0**.

### Teclado / foco
- Tab recorre logo → nav → CTA. `outline: auto 1px` presente (foco visible del navegador), **sin estilo de foco propio** (`:focus-visible` no definido en el design system).

### Contador
- Presente y funcional: `03 AÑOS / 09 MESES / 02 DÍAS …` se actualiza cada segundo.
- **Causa del fallo de hidratación** de la portada (valor inicial distinto en servidor y cliente).
- No respeta `prefers-reduced-motion` de forma explícita (depende del `* { animation-duration }` global).

---

## 5. Datos falsos, placeholders y contenido antiguo (bloqueante)

### 5.1 `/about` — academia inventada
- "Fundada en 2022", "**más de 10,000 estudiantes en más de 50 países**", "**250+ Cursos con Expertos**", "**95% Satisfacción Estudiantil**", "Nuestra misión", "Nuestra Historia".
- CTAs a `/register` y `/community` (**404**).
- **No representa a Ángel / Yzzz 777.** Debe reescribirse por completo.

### 5.2 `/api/bot/stats` — estadísticas fabricadas
```js
const FALLBACK = { guilds: 50, users: 5000, ping: 0, uptime: 0, online: true, commands: 100 }
```
Se devuelve **`online: true` y números inventados** cuando `BOT_API_URL` está vacío o el tunnel cae. En producción con el tunnel activo responde datos reales (hoy: `guilds: 30, users: 583, ping: 79, commands: 91`), pero **si el servicio cae la web miente**.

### 5.3 Blog — posts falsos, API nunca consultada
- `src/app/blog/page.tsx` usa `defaultPosts` hardcodeados (3 posts con fechas 2026-03-01/02-20/02-10) y **nunca hace `fetch("/api/blog/posts")`**.
- `GET /api/blog/posts` devuelve `[]` → no hay contenido real.
- Home muestra 3 posts ficticios distintos (`recentPosts`, fechas 2024).
- **Cualquiera puede crear y eliminar posts** (botón "Nuevo Post" público + `DELETE` sin auth).

### 5.4 Biblioteca — archivos y descargas inventados
- `src/app/library/page.tsx`: 8 archivos con tamaños y **descargas (15, 42, 28, 35, 19, 67, 12, 23)** inventados; ninguno descarga nada.
- `src/components/Library.tsx` (muerto): otra lista distinta (`database-backup.rar` 15.3 MB, `config.env.example`…).
- Home: 6 archivos ficticios con **128, 89, 45, 312, 12, 234 descargas**; incluye "Database Backup" (no publicable) y "Design System 45.6 MB".

### 5.5 Anuncios — inventados
Home + `Announcements.tsx`: "Mantenimiento programado domingo 20 de octubre", "Nuevo plan Pro $29.99/mes", "**Nuevo curso de Linux — Academia Linux 35 cursos**" (la academia ya no existe), "Parche de seguridad crítico".

### 5.6 Cifras desactualizadas o inventadas en varias páginas
| Dato | Dónde | Problema |
|---|---|---|
| "21 servidores y 4,600+ usuarios" | Home (About + Proyecto System 777) | API real: 30 guilds / 583 users → **desactualizado** |
| "10,000+ visitas" | `components/Projects.tsx` | **Inventado** |
| "Servers / Active" | `components/Projects.tsx` | **Placeholder** sin dato |
| "Servidores 50+", "Uptime 99.9%" | `/bot` | **Inventado** |
| "10,000+ estudiantes", "250+ cursos" | `/about` | **Inventado** |
| Filtros "Bots/Web" de Projects | `components/Projects.tsx` | Filtro roto (`includes("bots")` nunca matchea) → lista vacía |
| Premium $4.99/$9.99/$19.99 | Home + `/bot` | **Sí coinciden** con `premiumGate.js` del bot → dato real, conservar |

### 5.7 Proyectos (`/projects`)
- Contenido mayormente real (System 777, jrsystem7777.com, YZ Terminal, IP Tracker, AutoMod v2).
- `YZ Terminal` → `live: "#" (roto). `IP Tracker` → `live: "https://jrsystem7777.com/t"` (**no existe** como página; solo `/t/[userId]/[guildId]`).
- `Dashboard System 777` en home apunta a un dominio de preview viejo (`12e022de.system777.pages.dev`).

### 5.8 Bug de formato: uptime
`page.tsx` trata `uptime` como **milisegundos** pero la API devuelve **segundos** (`process.uptime()`). Resultado: muestra `0h 0m` en vez de `18m`.

---

## 6. SEO

- **Título idéntico en todas las rutas**: "System 777 — Bot de Discord".
- **Descripción idéntica** en todas las rutas (además habla de un bot, no del portafolio).
- Sin `canonical`, sin `og:image`, sin `twitter:card`.
- **No existe** `sitemap.xml`, `robots.txt`, `manifest`.
- Ninguna página define `export const metadata` (todas son `"use client"`).
- `favicon.ico` presente en `src/app`.

---

## 7. Seguridad

| Hallazgo | Severidad | Estado |
|---|---|---|
| `POST /api/blog/posts` y `DELETE` **sin autenticación** | **Alta** | Confirmado |
| `POST /api/blog/upload` **sin autenticación** (sube binarios a la DB) | **Alta** | Confirmado |
| Botón "Nuevo Post" visible para todo visitante en `/blog` | **Alta** | Confirmado |
| `.env` **no está en git** (`.gitignore` correcto, nunca trackeado) | OK | Verificado |
| `.env.example` sin secretos | OK | Verificado |
| Headers de seguridad (X-Frame, nosniff, Referrer-Policy, Permissions-Policy) | OK | `next.config.ts` |
| `middleware` protege `/bot/dashboard` con cookie `system777_session` | OK | Pero `/dashboard` redirige a login sin página propia |
| `POST /api/contact` sin rate limit | Media | Webhook de Discord configurable por env |
| Ruta `/t/[userId]/[guildId]` (IP tracking) expuesta públicamente | Media | Requiere revisión de intención antes de exponerla en el portafolio |
| Credenciales en memorias MD del escritorio (Client Secret de Discord) | Media | **Fuera del repo**, pero documentadas en claro en `/home/yzz777/Escritorio/mds/*` |

---

## 8. Performance

| Item | Medición | Problema |
|---|---|---|
| `public/banner.gif` | **1.9 MB**, 18 frames, 540×304 | Asset principal del hero; se carga con `priority` + `unoptimized` en todas las visitas |
| `public/profile.png` | 40 KB (WebP 640×640) | Aceptable |
| Devicons externos | 19 `<img>` a `cdn.jsdelivr.net` | Terceros, sin `width/height` fijos |
| `three`, `r3f`, `drei`, `gsap`, `lenis`, `jspdf`, `html2canvas` | instalados | **0 usos** en rutas activas → install/build más pesados |
| Lighthouse | No ejecutado | Pendiente en fase de validación |
| Componentes pesados | Dashboard (~1900 líneas) se sirve en `/bot/dashboard` | Correcto (ruta aparte), pero sin `dynamic import` |

---

## 9. Accesibilidad

| Item | Estado |
|---|---|
| Navegación por teclado | Funciona (Tab reaches nav + CTA) |
| Foco visible | **Solo el default del navegador**; sin `:focus-visible` propio |
| `alt` en imágenes | OK (0 sin alt) |
| Labels en formularios | OK en `/contact` y `/blog` |
| Headings | `/bot/status` **sin `<h1>`**; `/bot` genera `h1` con texto concatenado ("System 777El Bot Definitivo") |
| Contraste | Textos `gray-500/600` sobre fondo casi negro → **bajo contraste** en metadatos y descripciones |
| Controles solo-hover | Menú "System 777" del navbar se abre **solo con hover** (no accesible por teclado en desktop) |
| `prefers-reduced-motion` | Regla global existe en `globals.css`, pero framer-motion no la consulta |

---

## 10. Lint

- `npm run lint` → **46,843 problemas** porque ESLint escanea `.next/` (build) y no tiene `ignores`.
- `npx eslint src` → **0 errores, 45 warnings** (imports sin usar, `<img>` en vez de `<Image>`).
- Falta ignorar `.next`, `_deploy`, `functions`, `node_modules`.

---

## 11. Prioridades

### P0 — Bloqueantes (rompen la web)
1. **Navbar invisible en la portada** (hidratación + `initial={{y:-100}}`).
2. **Hydration error** en `/` por `StudyTimeCounter` + `Particles`.
3. **Datos inventados**: `/about` (academia), `/api/bot/stats` (fallback), blog (posts), biblioteca (archivos/descargas), anuncios, cifras de `/bot`.
4. **Endpoints de blog sin autenticación** (crear/borrar/subir).
5. Enlaces 404: `/register`, `/community`, `/announcements`, `/dashboard`, `/admin`.

### P1 — Importantes
6. Overflow horizontal en `/bot/commands` + keys duplicadas.
7. Uptime tratado como ms en vez de segundos.
8. SEO: título/descripción únicos por página, canonical, OG, sitemap, robots.
9. Página 404 propia.
10. ESLint escanea `.next`.
11. Home: cifras desactualizadas (21 servidores / 4.600 usuarios) → usar datos reales o quitarlas.
12. `/projects`: enlaces `#` y `/t` rotos.

### P2 — Mejoras
13. Componentes muertos (10 archivos) y dependencias sin uso.
14. `banner.gif` 1.9 MB en el hero.
15. Filtros de `/projects` rotos; `/bot/status` sin `h1`; contraste bajo.
16. Menú desktop "System 777" solo-hover.
17. Falta `:focus-visible` propio.

---

## 12. Criterios de la auditoría

- [x] El proyecto inicia localmente sin errores bloqueantes (dev en `:3002`; `:3000` ocupada por otro servicio)
- [x] Se conoce el framework y sus versiones
- [x] Se identificaron las rutas principales
- [x] Se identificaron componentes y dependencias relevantes
- [x] Se probaron desktop y móvil con Playwright (10 anchos, 13 rutas)
- [x] Se documentaron errores de consola y red
- [x] Se documentaron enlaces rotos
- [x] Se documentaron datos falsos, antiguos o placeholders
- [x] Existe `AUDIT.md`

---

## 13. Estado final (2026-10-05) — cierre de la auditoría

Todo el plan se ejecutó en 6 fases (0–5), **1 commit por fase con aprobación previa**,
repartidas entre el repo del bot (`Yzzz777/system-777`) y el del web (`Yzzz777/system777`):

| Fase | Contenido | Commits |
|---|---|---|
| 0 | Base de comparación | bot `3f00ce1` |
| 1 | Estabilidad: cleanup null-safe (TypeError de horario), flush al apagar, antiRaid/spy con blacklist como objeto, tickets unificados en PostgreSQL, reinicio anti-bucle en errores críticos | bot `86d231c` |
| 2 | Logs sincronizados: modLog canónico (warns/modlogs), config `log_<bucket>`, activityLogs normalizados, trazas de eventos, casos desde `POST /action`, 401 explícito | bot `abe8388` · web `9db9652` |
| 3 | **Permisos de Roles reales** (denegación por rol y comando con endpoints `roleperms` + chequeo en el dispatch), `Broadcast` al endpoint real `/api/broadcast`, race `guild//seccion`, **QA de Playwright con `bot-api` mockeada** | bot `7f1ab33` · web `8226154` |
| 4 | Cierre de restos: `manifest` + canonical/noindex del panel, ESLint limpio, hidratación del contador, `resend`+`src/lib/email` fuera, uptime legible en `/api/analytics` | bot `78a2c32` · web `1cdb736` |
| 5 | Validación: Lighthouse, suite Playwright ampliada y re-auditoría | web `1bca3c3` |

### Hallazgos de §11 — estado

| # | Hallazgo | Estado |
|---|---|---|
| P0-1 | Navbar invisible en la portada | ✅ Resuelto (`header fixed`, sin `y:-100`; medido `top: 0`) |
| P0-2 | Hydration error en `/` | ✅ Resuelto (RNG sembrada, three con `ssr:false`, contador con `suppressHydrationWarning`); **0 errores medidos** |
| P0-3 | Datos inventados (`/about`, `/api/bot/stats`, blog, biblioteca, anuncios, cifras de `/bot`) | ✅ Resuelto: contenido real o estados vacíos honestos; fallback de stats con `available:false` |
| P0-4 | Endpoints de blog sin autenticación | ✅ Resuelto (owner-only vía cookie de Discord + `OWNER_DISCORD_ID`; botón "Nuevo post" solo owner) |
| P0-5 | Enlaces a `/register`, `/community`, `/announcements`, `/dashboard`, `/admin` | ✅ Resuelto (navbar/footer/about → rutas vivas; test E2E) |
| P1-6 | Keys duplicadas + overflow horizontal en `/bot/commands` | ✅ Resuelto (clave `category-name`, 0 duplicados; 0 px de overflow a 1440) |
| P1-7 | Uptime tratado como ms | ✅ Resuelto (`formatUptime` en segundos) + panel Analytics con uptime legible |
| P1-8 | SEO (título/descripción iguales, sin canonical/OG/sitemap/robots) | ✅ Resuelto: 14 `generateMetadata`, `sitemap.ts`, `robots.ts`, canonical por ruta, OG/twitter, **`manifest.ts`**, y `/bot/dashboard` con canonical propio + `noindex` |
| P1-9 | Sin página 404 | ✅ `not-found.tsx` (HTTP 404 verificado en prod) |
| P1-10 | ESLint escaneaba `.next` (46.843 problemas) | ✅ `ignores` completo (`.next`, `_deploy`, `functions`, `test-results`…) → **`npx eslint .` = 0 problemas** |
| P1-11 | Cifras desactualizadas ("21 servidores / 4.600 usuarios") | ✅ Resuelto (datos en vivo desde la API) |
| P1-12 | Enlaces rotos y filtro roto en `/projects` | ✅ Resuelto (sin `href="#"`, sin `/t` inexistente, sin filtro muerto) |
| P2-13 | 10 componentes muertos + dependencias sin uso | ✅ Resuelto: componentes borrados; fuera `gsap`, `@studio-freight/lenis`, `jspdf`, `html2canvas`, `stripe`, `@react-three/drei`, **`resend` + `src/lib/email`** (`three`/`fiber` sí se usan en el hero) |
| P2-14 | `banner.gif` 1,9 MB | ✅ Resuelto (hero 373 KB + banner webp 42 KB) |
| P2-15 | `/bot/status` sin `<h1>` | ✅ Resuelto |
| P2-16 | Menú "System 777" solo-hover | ✅ Resuelto (hover + `onClick` + `Escape` + click fuera) |
| P2-17 | Sin `:focus-visible` propio | ✅ Resuelto (`globals.css`) |

**Resto pendiente:** rendimiento (§14).

---

## 14. Validación (2026-10-05)

- **Playwright — 12/12** (`npm run test:e2e`, todo mockeado con `page.route("**://bot-api.jrsystem7777.com/**")`, sin tocar prod):
  - Panel: carga del servidor, flujo completo de Permisos de Roles (persistencia incluida), Broadcast a `/api/broadcast`, Protección, "nada sale sin interceptar", SEO del panel.
  - Pública: hidratación + navbar de la portada, 404 propia, `/bot/commands` (keys/overflow/consola), middleware `307 → /login`, enlaces a rutas eliminadas, responsive 320 y 1440.
- **Lighthouse** (build de producción, perfil móvil simulado): Accesibilidad **100** · Best Practices **100** · SEO **100** · **Performance 33–39** (baseline).
  - Métricas: TBT ~11,5 s · LCP ~10 s · FCP 2,2 s · **CLS 0** · payload 1 MB (GIF 374 KB + webp 120 KB + ~150 KB JS).
  - Causa principal: `scriptEvaluation` 10,4 s en el hilo principal bajo CPU×4.
- **Gates de push**: `tsc --noEmit` 0 · `eslint .` 0 · `next build` exit 0.
- **Bot**: `integrity ✅` 158 archivos · pm2 `system-777` online · `error.log` 0 errores.
- **Deploy final**: GitHub Actions *Deploy to Cloudflare Pages* → run de `1bca3c3` **success** (2026-10-05 04:40 UTC).
  Producción verificada: `/` 200 · `/about` 200 · `/no-existe` **404** · `/manifest.webmanifest` 200 · `/sitemap.xml` 200 · `/bot/dashboard` **307 → `/login`** sin sesión · canonical único por ruta (sin duplicados).

### Pendientes no bloqueantes
1. **Rendimiento** (opcional): aplazar el three.js del hero, reducir el GIF y gatear animaciones con `prefers-reduced-motion`.
2. **Fase 6** (sin empezar): integrar `src/utils/ticketLogViewer.js` (105 líneas, 0 imports) y las pruebas reales de *Verificación → Desactivar*.
3. **Secretos tuyos**: `npx wrangler pages secret put DISCORD_CONTACT_WEBHOOK --project-name=system777` · password VPS (opcional) · aviso de librería YouTube en los logs (preexistente).
