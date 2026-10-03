# Tools — Inventario de herramientas y decisiones del stack

| Herramienta | Versión / fuente | Para qué está | Nota de calidad |
| --- | --- | --- | --- |
| Next.js | 15.3.3 | App Router, SSR/ISR, API routes | proyecto actual, sin migraciones en curso |
| React | ^19.1.0 | UI | use client donde hay estado/observer |
| Tailwind CSS | v4 | utilidades + tokens en `globals.css` | sin `@apply` masivo; clases de dominio (`.panel`, `.btn`, `.chip`) |
| framer-motion | instalado | micro/medio movimiento (usos puntuales) | `design-motion-principles` como referencia de easing |
| three | 0.186.1 | escena 3D del hero | ver `docs/3D.md` |
| @react-three/fiber | 9.8.1 | declarativa para three | Canvas con `dpr` limitado y pausa fuera de viewport |
| next/image | Next | imágenes optimizadas | `priority` solo en above-the-fold (retrato, logo) |
| lucide-react | instalado | iconografía | sin iconos decorativos en titulares |
| ESLint (next/core-web-vitals + ts) | con Next | 0 avisos en CI local | |
| TypeScript | `tsc --noEmit` | chequeo de tipos | 0 errores |
| Playwright | tests manuales | verificación visual en 5 anchos | capturas en `/tmp/opencode/shots/` |
| wrangler | Pages | deploy de `.vercel/output/static` | `CI=1 npx @cloudflare/next-on-pages` |
| GitHub Actions | `Deploy to Cloudflare Pages` | deploy en cada push a `main` | |

## Decisiones

- **Deps fuera del alcance** (`gsap`, `html2canvas`, `jspdf`, `stripe`, `zod`, `drei`, `lenis`, `motion`…): desinstaladas; no hay código que las use.
- **Fuentes**: `--font-display` Space Grotesk, `--font-body` Inter (candidato a migrar a Plus Jakarta Sans por la guía `high-end-visual-design`).
- **Sesión**: cookies firmadas HMAC-SHA256 (`src/lib/sessionCrypto.ts`, secreto `AUTH_SECRET`). Sin JWT de NextAuth para la sesión principal.
- **Owner**: `OWNER_DISCORD_ID` en `src/lib/owner.ts`.
- **Skills**: instaladas con `npx skills add … --project --agent "*"` en `.agents/skills/` y enlazadas en `.opencode/skills/` (`3d-web-experience`, `react-three-fiber`, `design-motion-principles`, `high-end-visual-design`).
