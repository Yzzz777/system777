import Link from "next/link";
import { Terminal, Github, Instagram, MessageSquare } from "lucide-react";
import { siteConfig } from "@/lib/config";

const footerLinks = {
  Personal: [
    { label: "Inicio", href: "/" },
    { label: "Sobre mí", href: "/about" },
    { label: "Tecnologías", href: "/technologies" },
    { label: "Cybersecurity", href: "/cybersecurity" },
    { label: "Proyectos", href: "/projects" },
  ],
  Contenido: [
    { label: "Blog", href: "/blog" },
    { label: "Anuncios", href: "/announcements" },
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
    <footer className="border-t border-white/5 bg-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00FF88]/10">
                <Terminal className="h-4 w-4 text-[#00FF88]" />
              </div>
              <span className="bg-gradient-to-r from-[#00FF88] to-[#00C8FF] bg-clip-text text-transparent">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Programación, ciberseguridad, proyectos y System 777.
            </p>
            <div className="mt-6 flex gap-3">
              <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00FF88] transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00FF88] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={siteConfig.social.discord} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00FF88] transition-colors">
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-[#00FF88] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-400">Privacidad</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-400">Términos</Link>
            <span className="text-xs text-gray-500">Next.js · Cloudflare Pages</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
