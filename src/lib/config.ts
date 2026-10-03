export const siteConfig = {
  name: "Yzzz 777",
  tagline: "Developer · Systems · Cybersecurity",
  description:
    "Portafolio personal de Ángel (Yzzz 777): desarrollo web, sistemas, Linux y ciberseguridad aplicada. Creador de System 777.",
  url: "https://jrsystem7777.com",
  owner: {
    name: "Ángel",
    username: "Yzzz 777",
    // ID de Discord del owner — usado para autorizar la administración del blog.
    discordId: "1376047332709240884",
  },
  social: {
    github: "https://github.com/Yzzz777",
    instagram: "https://www.instagram.com/yzz.yzx",
    tiktok: "https://www.tiktok.com/@yzz.yzx",
    discord: "https://discord.gg/system777",
  },
  colors: {
    primary: "#00FF88",
    secondary: "#45C8FF",
    accent: "#5865F2",
    background: "#05050A",
    surface: "#0E0E16",
  },
};

export type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const navLinks: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Proyectos", href: "/projects" },
  { label: "Tecnologías", href: "/technologies" },
  { label: "Cybersecurity", href: "/cybersecurity" },
  { label: "Blog", href: "/blog" },
  { label: "Biblioteca", href: "/library" },
  {
    label: "System 777",
    href: "/bot",
    children: [
      { label: "Inicio", href: "/bot" },
      { label: "Comandos", href: "/bot/commands" },
      { label: "Estado", href: "/bot/status" },
      { label: "Dashboard", href: "/bot/dashboard" },
    ],
  },
  { label: "Contacto", href: "/contact" },
];
