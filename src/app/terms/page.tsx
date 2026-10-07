"use client";

import Link from "next/link";
import { FadeIn } from "@/components/ui/Animations";
import { siteConfig } from "@/lib/config";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Aceptación",
    body: (
      <>
        Al usar jrsystem7777.com, el bot <span className="text-[var(--text)]">System 777</span> o
        su dashboard, aceptas estos Términos de Servicio. Si no estás de acuerdo, no uses el
        servicio.
      </>
    ),
  },
  {
    title: "2. Qué ofrecemos",
    body: (
      <>
        Un portafolio personal con blog y documentación, un bot de Discord gratuito
        (<span className="text-[var(--text)]">System 777</span>) con funciones de moderación,
        protección, tickets, economía y niveles, y un dashboard privado de administración al que
        se accede con cuenta de Discord.
      </>
    ),
  },
  {
    title: "3. Uso aceptable",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Úsalos solo con fines legales y respetando las normas de Discord.</li>
        <li>
          No intentes eludir permisos, abusar del bot en servidores donde no tienes autorización
          ni comprometer la seguridad del servicio.
        </li>
        <li>
          El comando de terminal del bot solo está disponible para el propietario del bot; su uso
          por terceros no existe y se consideraría acceso no autorizado.
        </li>
      </ul>
    ),
  },
  {
    title: "4. Planes premium",
    body: (
      <>
        El bot es gratuito. Los planes opcionales (Normal $4.99/mes, Pro $9.99/mes, Max
        $19.99/mes) desbloquean funciones avanzadas y se contratan por los canales indicados en
        Discord o en la sección Premium del sitio. Los precios y condiciones de pago vigentes se
        indican siempre en el punto de compra; para dudas sobre pagos o reembolsos, escribe por{" "}
        <a
          href={siteConfig.social.discord}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--brand)] hover:underline"
        >
          Discord
        </a>
        .
      </>
    ),
  },
  {
    title: "5. Propiedad intelectual",
    body: (
      <>
        El diseño, los textos y el código de este sitio son de su autor. Los repositorios
        publicados en{" "}
        <a
          href={siteConfig.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--brand)] hover:underline"
        >
          GitHub
        </a>{" "}
        se usan bajo la licencia indicada en cada repositorio. No copiés ni redistribuyas el
        contenido como propio.
      </>
    ),
  },
  {
    title: "6. Disponibilidad",
    body: (
      <>
        El servicio se presta “tal cual”. El bot corre 24/7 pero puede haber caídas,
        mantenimiento o cambios de funcionalidad sin aviso previo. El estado en vivo está en{" "}
        <Link href="/bot/status" className="text-[var(--brand)] hover:underline">
          /bot/status
        </Link>
        .
      </>
    ),
  },
  {
    title: "7. Limitación de responsabilidad",
    body: (
      <>
        No somos responsables de daños indirectos derivados del uso del sitio o del bot, incluidas
        interrupciones del servicio o pérdida de datos del servidor causadas por configuraciones
        del propio servidor.
      </>
    ),
  },
  {
    title: "8. Cambios en estos términos",
    body: (
      <>
        Podemos actualizar estos términos; la fecha de la última actualización aparece arriba. El
        uso continuado tras un cambio implica su aceptación.
      </>
    ),
  },
  {
    title: "9. Contacto",
    body: (
      <>
        Preguntas sobre estos términos: por{" "}
        <a
          href={siteConfig.social.discord}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--brand)] hover:underline"
        >
          Discord
        </a>{" "}
        o el{" "}
        <Link href="/contact" className="text-[var(--brand)] hover:underline">
          formulario de contacto
        </Link>
        .
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4">
        <FadeIn>
          <span className="eyebrow">Legal</span>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(1.9rem,5vw,3rem)] font-bold tracking-tight text-[var(--text)]">
            Términos de Servicio
          </h1>
          <p className="mt-2 font-[family-name:var(--font-mono)] text-sm text-[var(--text-3)]">
            Última actualización: Octubre 2026
          </p>
          <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-[var(--text-2)]">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="mb-3 text-xl font-semibold text-[var(--text)]">{s.title}</h2>
                <div>{s.body}</div>
              </section>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
