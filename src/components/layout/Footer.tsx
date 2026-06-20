import Link from "next/link";
import { Terminal, Mail, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";

const footerLinks = {
  Academia: [
    { label: "Programación", href: "/academy/programming" },
    { label: "Ciberseguridad", href: "/academy/cybersecurity" },
    { label: "Desarrollo Discord", href: "/academy/discord" },
    { label: "Linux", href: "/academy/linux" },
  ],
  Recursos: [
    { label: "Git & GitHub", href: "/git-github" },
    { label: "Sistemas Operativos", href: "/operating-systems" },
    { label: "Blog", href: "/blog" },
    { label: "Comunidad", href: "/community" },
    { label: "Tienda", href: "/shop" },
  ],
  Empresa: [
    { label: "Sobre Nosotros", href: "/about" },
    { label: "Contacto", href: "/contact" },
    { label: "Privacidad", href: "/privacy" },
    { label: "Términos", href: "/terms" },
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
              Academia tecnológica profesional para programación, ciberseguridad y nuevas tecnologías.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF88]">
                <Mail className="h-4 w-4" /> {siteConfig.contact.email}
              </a>
              <a href={siteConfig.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF88]">
                <MessageCircle className="h-4 w-4" /> WhatsApp
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
            <span className="text-xs text-gray-500">Powered by Next.js · Hostinger · Cloudflare</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
