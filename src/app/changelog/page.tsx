import Link from "next/link";
import { ArrowUpRight, CircleDot, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/* Entradas reales: cada grupo corresponde a commits del repositorio
   (fechas y hashes verificados con `git log`). Sin versiones inventadas. */
const releases = [
  {
    date: "2026-10-05",
    title: "Auditoría y QA en producción",
    commits: ["1bca3c3", "1cdb736", "8226154", "9db9652"],
    items: [
      "QA con Playwright sobre el dashboard: 8 pestañas del panel con la API mockeada, 0 errores en consola.",
      "401 explícito en el dashboard: reintento con token refrescado y aviso + /login si persiste.",
      "Pestañas conectadas al bot: Permisos de Roles, Broadcast e id de guardado.",
      "Auditoría cerrada: manifest, canonical/noindex del panel, lint limpio y dependencias muertas fuera.",
      "Lighthouse: Accesibilidad 100 · Best Practices 100 · SEO 100.",
    ],
  },
  {
    date: "2026-10-04",
    title: "Rediseño “Cian Ártico”",
    commits: ["1f3e516", "a28aeb8", "9c79d5b", "578814a", "61573bf", "37a18d2"],
    items: [
      "Nueva identidad visual: paleta cian, tipografías Syne / Manrope / JetBrains Mono y tokens de diseño.",
      "Integración de shadcn/ui (21 componentes) adaptada a la identidad del sitio.",
      "Motion avanzado: transiciones de ruta, parallax tipo Apple y pill en la navegación.",
      "Preview del panel de tickets con estilo Discord real: author, thumbnail, campo de categorías, footer, select y botones.",
      "Fixes: dropdown de Base UI, aviso de más de 25 categorías y overflow horizontal a 320px.",
    ],
  },
  {
    date: "2026-10-03",
    title: "De plantilla a portafolio real",
    commits: ["49cf5b6", "4cea40b", "d0ee2d6", "429cac3", "bd4f5bc"],
    items: [
      "Remodelación completa a portafolio personal: SEO, accesibilidad, responsive y blog con autenticación.",
      "Estadísticas del bot en vivo desde la API (sin cifras inventadas).",
      "Retiro de 9 dependencias sin uso y cookie de sesión firmada.",
      "Easter eggs: animaciones 3D del Sharingan, tilt del banner y ojo interactivo.",
      "TEST_REPORT.md con la auditoría y la verificación en producción.",
    ],
  },
  {
    date: "2026-09-03",
    title: "Páginas nuevas y fin de la era académica",
    commits: ["7059a3d", "beb36ce", "58dcbaf", "f1ce279", "c753c5e"],
    items: [
      "Se eliminó el contenido de academia y el sitio pasó a portafolio personal.",
      "Páginas nuevas o reescritas: technologies, cybersecurity, projects, library, blog, contact y bot.",
      "Logos reales de tecnologías con Devicon y estado honesto de Discord («No disponible» cuando cae).",
      "Blog funcional con uploads y proyectos con árbol de archivos.",
    ],
  },
  {
    date: "2026-07-20",
    title: "Dashboard del bot: tickets y autenticación",
    commits: ["a495205", "616a864", "b403706", "541e0a7", "c264813"],
    items: [
      "Pestañas de tickets con contenido real: Forms, Behavior y Logs.",
      "Dropdowns propios en todas las secciones del panel.",
      "Autenticación cross-origin: cookies SameSite=None, endpoint de token y proxy de APIs.",
      "Sistema de notificaciones de streamers (YouTube/Kick/TikTok) con sus endpoints.",
      "Múltiples fixes de guardado de configuraciones (tickets, welcome, autorole).",
    ],
  },
] as const;

const roadmap = [
  {
    title: "Pruebas reales de Verificación → Desactivar",
    desc: "Comprobar en producción que desactivar la verificación borra el mensaje publicado en el canal.",
  },
  {
    title: "Visor de logs de tickets",
    desc: "Integrar el visor de transcripts de tickets en el dashboard (fase pendiente de la auditoría).",
  },
  {
    title: "Optimización de rendimiento",
    desc: "Diferir la carga del GIF del hero y reducir el payload inicial (Performance es el puntaje bajo actual).",
  },
  {
    title: "Webhook del formulario de contacto",
    desc: "Configurar DISCORD_CONTACT_WEBHOOK para que los mensajes del formulario lleguen por Discord.",
  },
  {
    title: "Aviso de librería de YouTube",
    desc: "Resolver el aviso «Could not load youtube library» que aparece en los logs del bot (preexistente).",
  },
];

export default function ChangelogPage() {
  return (
    <div className="relative px-4 pb-[var(--section-y)] pt-10 sm:px-6 sm:pt-14">
      <div className="grid-bg" aria-hidden />
      <div className="bg-vignette" aria-hidden />
      <div className="relative mx-auto max-w-4xl">
        <div className="text-center">
          <span className="eyebrow justify-center">Historial</span>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2rem,5.5vw,3.25rem)] font-bold tracking-tight">
            Changelog
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-2)]">
            Cambios reales de este sitio, tomados de los commits del repositorio. Sin versiones ni
            fechas inventadas.
          </p>
        </div>

        {/* Historial */}
        <ol className="mt-12 space-y-6">
          {releases.map((r) => (
            <li key={r.date} className="panel p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-2 text-[var(--brand)]">
                  <CircleDot aria-hidden className="h-3.5 w-3.5" />
                  <time
                    dateTime={r.date}
                    className="font-[family-name:var(--font-mono)] text-[13px] font-semibold"
                  >
                    {new Date(r.date + "T12:00:00Z").toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </span>
                <h2 className="flex-1 text-lg font-bold">{r.title}</h2>
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--text-2)]">
                {r.items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--brand)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {r.commits.map((c) => (
                  <li key={c}>
                    <Badge variant="outline" className="font-mono text-[11px] text-[var(--text-3)]">
                      {c}
                    </Badge>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        {/* Roadmap */}
        <section id="roadmap" className="mt-14">
          <div className="section-head">
            <span className="eyebrow">
              <Map aria-hidden className="h-3 w-3" />
              Roadmap
            </span>
            <h2>Pendientes conocidos</h2>
            <p>
              Cosas que sé que faltan, sacadas de la auditoría y de las notas del proyecto. No es
              una promesa de fechas: es la lista honesta de lo siguiente.
            </p>
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {roadmap.map((r) => (
              <li key={r.title} className="panel panel-hover p-5">
                <h3 className="text-[15px] font-semibold">{r.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-3)]">{r.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-center text-xs text-[var(--text-3)]">
          ¿Quieres ver el detalle completo?{" "}
          <a
            href="https://github.com/Yzzz777/system777"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[var(--brand)] hover:underline"
          >
            Commits en GitHub <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
          </a>
          {" · "}
          <Link href="/bot" className="text-[var(--brand)] hover:underline">
            Novedades de System 777
          </Link>
        </p>
      </div>
    </div>
  );
}
