"use client";

import Link from "next/link";
import { FadeIn } from "@/components/ui/Animations";
import { siteConfig } from "@/lib/config";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Qué es este sitio",
    body: (
      <>
        jrsystem7777.com es el portafolio personal de Ángel (Yzzz 777), con blog, estado en vivo
        del bot <span className="text-[var(--text)]">System 777</span> y un panel privado de
        administración al que se accede con Discord. No vende cursos, productos digitales ni
        servicios de educación.
      </>
    ),
  },
  {
    title: "2. Datos que recopilamos",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="text-[var(--text)]">Formulario de contacto</span>: nombre, correo y
          mensaje. Se envían directamente al owner para responderte; no se usan para nada más.
        </li>
        <li>
          <span className="text-[var(--text)]">Inicio de sesión con Discord</span>: si accedes al
          dashboard, guardamos tu ID de Discord, nombre y avatar para mantenerte la sesión.
        </li>
        <li>
          <span className="text-[var(--text)]">Datos de uso del bot</span>: configuración de cada
          servidor y datos generados por los comandos (economía, niveles, warns, tickets),
          almacenados en base de datos.
        </li>
        <li>
          <span className="text-[var(--text)]">Preferencias</span>: el tema visual elegido se
          guarda en tu navegador (localStorage).
        </li>
      </ul>
    ),
  },
  {
    title: "3. Cookies",
    body: (
      <>
        Solo usamos la cookie de sesión (HttpOnly) para mantenerte autenticado en el dashboard. No
        hay cookies de publicidad, análisis ni rastreo de terceros. Puedes borrar la sesión
        cerrando el login cuando quieras.
      </>
    ),
  },
  {
    title: "4. Con quién se comparten datos",
    body: (
      <>
        No vendemos ni alquilamos datos. Los proveedores necesarios para operar el servicio son:{" "}
        <span className="text-[var(--text)]">Discord</span> (autenticación y API del bot),{" "}
        <span className="text-[var(--text)]">Cloudflare</span> (alojamiento y CDN),{" "}
        <span className="text-[var(--text)]">Neon</span> (base de datos) y{" "}
        <span className="text-[var(--text)]">GitHub</span> (código fuente público). Cada uno
        trata los datos según sus propias políticas.
      </>
    ),
  },
  {
    title: "5. Retención y borrado",
    body: (
      <>
        Conservamos los datos mientras la cuenta o el servidor usen el servicio. Puedes pedir la
        eliminación de los datos de tu servidor o de tu sesión escribiendo por{" "}
        <a
          href={siteConfig.social.discord}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--brand)] hover:underline"
        >
          Discord
        </a>{" "}
        o desde el{" "}
        <Link href="/contact" className="text-[var(--brand)] hover:underline">
          formulario de contacto
        </Link>
        .
      </>
    ),
  },
  {
    title: "6. Menores de edad",
    body: (
      <>
        El servicio está dirigido a mayores de 13 años (edad mínima de Discord). No recopilamos
        conscientemente datos de menores de 13 años.
      </>
    ),
  },
  {
    title: "7. Seguridad",
    body: (
      <>
        Las contraseñas se guardan con hash, las peticiones del dashboard verifican sesión y
        permisos, y todo el sitio se sirve por HTTPS. Aun así, ningún sistema es 100% seguro: si
        detectas una vulnerabilidad, repórtala por Discord.
      </>
    ),
  },
  {
    title: "8. Contacto",
    body: (
      <>
        Dudas sobre privacidad: por{" "}
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

export default function PrivacyPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4">
        <FadeIn>
          <span className="eyebrow">Legal</span>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(1.9rem,5vw,3rem)] font-bold tracking-tight text-[var(--text)]">
            Política de Privacidad
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
