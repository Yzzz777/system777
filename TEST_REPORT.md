# TEST_REPORT.md — jrsystem7777.com v2 (remodelación)

> Fecha: 03/10/2026 · Servidor bajo prueba: **build de producción** (`npm run build` + `next start -p 3002`)
> Herramienta: **Playwright 1.63** (chromium, `--no-sandbox`), sin MCP
> Scripts: `/tmp/opencode/pw/full-audit.js`, `nav-test.js`, `dd-final.js`, `img-check.js`, `perf.js`
> Reportes crudos: `/tmp/opencode/full-report-v2.json`

---

## 1. Alcance

| Bloque | Detalle |
|---|---|
| Rutas | 15: `/`, `/about`, `/technologies`, `/cybersecurity`, `/projects`, `/blog`, `/library`, `/contact`, `/bot`, `/bot/commands`, `/bot/status`, `/login`, `/privacy`, `/terms`, `/no-existe-xyz` (404) |
| Anchos | 6: 320, 375, 768, 1024, 1440, 1920 px |
| Checks por combinación | errores de consola/`pageerror`, overflow horizontal, presencia de `h1` |
| Extra | crawl de enlaces internos, teclado/a11y, `prefers-reduced-motion`, imágenes rotas, APIs, build, tsc, eslint, rendimiento |

**Total: 90 combinaciones ruta × ancho.**

---

## 2. Resultados

### 2.1 Consola, layout y encabezados

| Check | Resultado |
|---|---|
| Errores de consola / `pageerror` | **0** en las 14 rutas válidas (los únicos 6 avisos son el `404` de recursos esperado en la ruta de prueba `/no-existe-xyz`) |
| Overflow horizontal | **0 / 90** (antes: `/bot/commands` con scrollW 1620 > 1440) |
| `h1` presente | **15 / 15** (antes: `/bot/status` sin `h1`) |
| Hydration errors | **0** (antes: `/` por `StudyTimeCounter` + partículas) |
| Navbar visible en `/` | **true** a 1440 px, `top: 0` (antes: `translateY(-100%)` la dejaba invisible) |

### 2.2 SEO

| Check | Resultado |
|---|---|
| Títulos únicos por página | 14/14 rutas propias con título propio (`Entrar · Yzzz 777`, `Comandos de System 777`, …) |
| Descripción meta | presente en todas las rutas revisadas |
| `metadataBase`, OG, twitter, canonical | en `layout.tsx` + canonical por segmento (12 `layout.tsx` nuevos) |
| `/sitemap.xml` | **200**, 13 URLs |
| `/robots.txt` | **200**, con `Disallow` de `/api/`, `/bot/dashboard`, `/login`, `/admin` |
| 404 | ruta inexistente → **HTTP 404** + `not-found.tsx` propio (título = home, contenido propio; el 404 no se indexa) |

### 2.3 Enlaces internos (crawl)

- **15 enlaces internos distintos** recogidos en las páginas públicas → **0 rotos** (todos 200).
- Sin `href="#"`, sin `/register`, `/community`, `/announcements`, `/dashboard` ni `/t` huérfanos.

### 2.4 Accesibilidad y teclado

| Check | Resultado |
|---|---|
| Skip link (`Tab` al cargar) | Primer foco = `a.skip-link` “Saltar al contenido” |
| `:focus-visible` | `outline: 2px solid` visible en el segundo foco |
| Dropdown “System 777” | foco → `aria-expanded=false` → **Enter → `true`** con enlaces `Inicio/Comandos/Estado/Dashboard` → **Escape → `false`**; hover también abre (mejora sobre el antiguo solo-hover) |
| Menú móvil (375 px) | botón `aria-expanded` **false → true**, panel de 661 px con 12 enlaces, **Escape cierra** (false) |
| Diálogo de proyecto (`/projects`) | `role="dialog"` + `aria-modal="true"`, foco inicial en botón “Cerrar”, **Escape cierra** |
| Diálogo de post (`/blog`) | mismas garantías (Escape + foco) |
| `prefers-reduced-motion: reduce` | 50 elementos `.reveal`, **0 ocultos** (revelado apagado de verdad) |
| Imágenes rotas | **0** en `/`, `/about`, `/technologies` tras scroll completo (1 request falso de CDN en una pasada se reprodujo sola) |

### 2.5 Rendimiento (producción, local)

| Ruta | TTFB | DOMContentLoaded | Load | Peticiones | Transfer total |
|---|---|---|---|---|---|
| `/` | 100 ms | 1695 ms | 1696 ms | 16 | 295 KB |
| `/bot` | 44 ms | 683 ms | 1182 ms | 12 | 250 KB |
| `/projects` | 72 ms | 594 ms | 1146 ms | 12 | 249 KB |
| `/blog` | 32 ms | 1526 ms | 1552 ms | 12 | 248 KB |

- First Load JS compartido: **101 kB** (`next build`).
- `banner.gif` (1,9 MB) eliminado: ninguna referencia.
- Iconos de tecnología: ahora `next/image` con `cdn.jsdelivr.net` en `remotePatterns` (lazy + dimensiones fijas).

### 2.6 APIs y seguridad

| Endpoint | Prueba | Resultado |
|---|---|---|
| `GET /api/bot/stats` | sin env `BOT_API_URL` | antes devolvía `FALLBACK` con cifras inventadas; ahora `{available:false,…}` o los datos reales del bot |
| `GET /api/bot/stats` (con API real) | producción | `guilds:30, users:582, ping:54, uptime:6987 s, commands:91` — **uptime en segundos** |
| `GET /api/blog/posts` | público | `[]` o solo **publicados** (los borradores solo si la cookie es del owner) |
| `POST /api/blog/posts` | sin sesión | **401** |
| `DELETE /api/blog/posts` | sin sesión | **401** |
| `POST /api/blog/upload` | sin sesión | **401** (y tope de 10 MB) |
| `POST /api/contact` | payload válido | `{"success":true}` (límites de longitud en cliente) |

La autorización de owner usa `src/lib/adminAuth.ts`: verifica el `id` contra la API de Discord con el `access_token` de la cookie (la cookie en sí es base64 sin firma, por eso no basta leerla).

### 2.7 Calidad de código

| Check | Resultado |
|---|---|
| `npx tsc --noEmit` | **0 errores** |
| `npx eslint src` | **0 errores, 14 warnings** (antes 46.843 problemas: eslint escaneaba `.next`; ahora `ignores` en `eslint.config.mjs`) |
| `npm run build` | **OK**, 21 páginas generadas, solo warnings preexistentes del dashboard |
| Componentes muertos | 11 archivos eliminados (`AdminLayout`, `Announcements`, `Blog`, `BlogPost`, `Certificate`, `Cybersecurity`, `Library`, `NotificationBell`, `Projects`, `RichTextEditor`, `Technologies`) |

---

## 3. Contenido verificado (reglas “nada inventado”)

- Academia ficticia de `/about` (10.000 estudiantes, 250 cursos, 50 países) → reescrita como perfil personal.
- Cifras falsas de `/bot` (`100+`, `27`, `50+`, `99.9%`) → sustituidas por datos en vivo de la API.
- `defaultPosts` del blog → eliminado; solo posts reales de la BD.
- Biblioteca con “descargas 15/42/67” → sustituida por recursos públicos reales (repos, páginas).
- Precios premium comprobados en el código del bot (`premiumGate.js`): `$4.99`, `$9.99`, `$19.99` + sus beneficios literales.
- Retrato real `public/angel.webp` (432×576, 12,5 KB) usado en home y `/about`.
- Contador de aprendizaje desde `2023-01-01`, con `suppressHydrationWarning` (3 años 9 meses, sin error de hidratación).

---

## 4. Conocidos / pendientes

1. **Dashboard `/bot/dashboard`** (35 kB, 180718 líneas): no se rediseñó; concentra los 14 warnings de eslint (hooks deps + `<img>`). Funciona y sigue protegido por middleware.
2. **`/privacy` y `/terms`** conservan el componente `ui/Animations` + framer-motion (único uso vivo); no bloquean (sin errores de consola).
3. **Dependencias sin uso** en `package.json` (`three`, `@react-three/*`, `gsap`, `@studio-freight/lenis`, `html2canvas`, `jspdf`, `stripe`, `zod`): detectadas, **no retiradas aún** para no tocar el lockfile antes del visto bueno.
4. **CDN externo** de iconos (`cdn.jsdelivr.net`): si cae, las tecnologías muestran casilla vacía (el texto sigue visible).
5. Título del **404** = título de home (comportamiento por defecto de Next); no afecta a indexación (HTTP 404).
6. La cookie de sesión del sitio es base64 **sin firma** (heredado): el gate del blog la refuerza verificando contra Discord; un refactor mayor de auth queda fuera del alcance de esta fase.

---

## 5. Veredicto

- **Fases 1-8 completadas**: design system, layout/SEO, navbar/footer, hero+contador, páginas del portafolio, System 777 con stats reales, blog con API+auth, biblioteca y contacto honestos, responsive 320→1920, a11y y motion controlados, testing Playwright.
- **Servidor de preview**: producción en `http://localhost:3002`.
- **Deploy**: NO realizado. Esperando la frase **“Aprobado para deploy”**.

---

## 6. Deploy y verificación en producción (03/10/2026)

**Ruta de deploy:** commit `49cf5b6` → push a `origin/main` → GitHub Actions
(`Deploy to Cloudflare Pages`, run 37143899788 → **success**) → build con
`@cloudflare/next-on-pages` → `wrangler pages deploy` → Cloudflare Pages.

- Producción: **https://jrsystem7777.com** (deploy instantáneo de Pages)
- Snapshot del deploy: **https://8690fc2c.system777.pages.dev**
- Commit: `49cf5b6 feat: remodelacion a portafolio personal - SEO, a11y, responsive, blog con auth y stats reales`
- CI/CD verificado: el pipeline automático también terminó en `success`, así que
  los próximos pushes a `main` despliegan solos.

### 6.1 Comprobaciones en vivo (curl)

| URL | Estado |
|---|---|
| `/` `/about` `/technologies` `/cybersecurity` `/projects` `/blog` `/library` `/contact` `/bot` `/bot/commands` `/bot/status` `/login` `/privacy` `/terms` | **200** |
| `/no-existe-xyz` | **404** correcto |
| `/sitemap.xml`, `/robots.txt` | **200** |
| `GET /api/bot/stats` | **200** con datos reales: `System 777#7585`, guilds 30, users 582, ping 54 ms, uptime 8946 s |
| `GET /api/blog/posts` | **200** `[]` |
| `POST /api/blog/posts`, `POST /api/blog/upload` sin sesión | **401** |
| `POST /api/contact` | `{"success":true}` |
| Título de home | `Ángel — Yzzz 777 · Developer, Systems & Cybersecurity` (nuevo) |
| Precios premium en `/bot` | `$4.99/mes`, `$9.99/mes`, `$19.99/mes` (reales) |

### 6.2 Auditoría Playwright contra producción (mismo harness)

- **90 checks** (15 rutas × 6 anchos 320-1920): **0 overflow, 0 sin `h1`, 0 errores
  de consola** (únicos avisos: los 404 esperados de la ruta de prueba).
- **15 enlaces internos: 0 rotos.**
- `prefers-reduced-motion`: 50 reveals, **0 ocultos**.
- Dropdown por teclado en vivo: `focus=false → Enter=true` con
  `Inicio/Comandos/Estado/Dashboard → Escape=false` ✅
- Menú móvil (375 px) en vivo (capturas `/tmp/opencode/shots/live375-*.png`):
  cerrado → hamburguesa `aria-expanded=false→true` con los 14 enlaces →
  **Escape lo cierra** y devuelve el foco al botón ✅
- Diálogo de proyecto: `role=dialog` + `aria-modal` + foco en “Cerrar” + Escape ✅
- Imágenes: 23/23 cargadas sin peticiones fallidas (el recuento inicial de
  “rotas” era un muestreo prematuro; re-verificado en frío = 0).

### 6.3 Resultado final

| Métrica | Antes | Después (producción) |
|---|---|---|
| Errores de consola en rutas públicas | presentes | **0** |
| Overflow horizontal (90 checks) | sí (`/bot/commands` 1620>1440) | **0** |
| Rutas sin `h1` | `/bot/status` | **0** |
| Enlaces internos rotos | 4 | **0** |
| Datos inventados en `/bot` | `100+`, `27`, `99.9%` | datos en vivo |
| Creación de posts sin auth | abierta | **401** |
| `defaultPosts` del blog | 10 posts falsos | BD real |
| Títulos/descripciones únicos | genéricos | **13 rutas con metadata propia** |
