import Link from "next/link";
import { Terminal, Github, Instagram, MessageSquare, Music } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Portafolio: [
    { label: "Inicio", href: "/" },
    { label: "Sobre mí", href: "/about" },
    { label: "Proyectos", href: "/projects" },
    { label: "Tecnologías", href: "/technologies" },
    { label: "Cybersecurity", href: "/cybersecurity" },
  ],
  Contenido: [
    { label: "Blog", href: "/blog" },
    { label: "Biblioteca", href: "/library" },
    { label: "Contacto", href: "/contact" },
  ],
  "System 777": [
    { label: "Inicio Bot", href: "/bot" },
    { label: "Comandos", href: "/bot/commands" },
    { label: "Estado", href: "/bot/status" },
    { label: "Dashboard", href: "/bot/dashboard" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[rgba(0,229,255,0.18)] bg-[var(--bg-raised)] shadow-[0_-14px_44px_rgba(0,229,255,0.05)]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)]">
                <Terminal aria-hidden className="h-4 w-4 text-[var(--brand)]" />
              </span>
              <span className="font-[family-name:var(--font-display)] text-[15px] font-bold">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--text-3)]">
              {siteConfig.tagline}. Construyo herramientas reales: web, bots, automatización y
              seguridad.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { href: siteConfig.social.github, label: "GitHub", Icon: Github },
                { href: siteConfig.social.instagram, label: "Instagram", Icon: Instagram },
                { href: siteConfig.social.tiktok, label: "TikTok", Icon: Music },
                { href: siteConfig.social.discord, label: "Discord", Icon: MessageSquare },
              ].map(({ href, label, Icon }) => (
                <Tooltip key={label}>
                  <TooltipTrigger
                    render={
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--line)] text-[var(--text-3)] transition-colors hover:border-[rgba(0,229,255,0.35)] hover:text-[var(--brand)]"
                      />
                    }
                  >
                    <Icon aria-hidden className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>{label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <h2 className="stat-label text-[var(--text-3)]">{title}</h2>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-3)] transition-colors hover:text-[var(--brand)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator className="mt-12" />
        <div className="flex flex-col items-start justify-between gap-3 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-[var(--text-3)]">
            © {new Date().getFullYear()} {siteConfig.owner.name} — {siteConfig.name}. Todo el
            contenido es propio.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-[var(--text-3)] transition-colors hover:text-[var(--text-2)]">
              Privacidad
            </Link>
            <Link href="/terms" className="text-xs text-[var(--text-3)] transition-colors hover:text-[var(--text-2)]">
              Términos
            </Link>
            <span className="text-xs text-[var(--text-3)]">Next.js · Cloudflare Pages</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
