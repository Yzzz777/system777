export const siteConfig = {
  name: "Yzzz 777",
  description: "Portafolio personal de Ángel — Programación, Ciberseguridad, Proyectos y System 777",
  url: "https://jrsystem7777.com",
  owner: {
    name: "Ángel",
    username: "Yzzz 777",
    discordId: "1376047332709240884",
  },
  social: {
    github: "https://github.com/Yzzz777",
    instagram: "https://www.instagram.com/yzz.yzx?igsi=ZndvczI3bnZncWtj&utm_source=qr",
    tiktok: "https://www.tiktok.com/@yzz.yzx",
    discord: "https://discord.gg/system777",
  },
  colors: {
    primary: "#00FF88",
    secondary: "#00C8FF",
    accent: "#7C3AED",
    background: "#0A0A0A",
    surface: "#121212",
  },
};

export const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Sobre mí", href: "/about" },
  { label: "Tecnologías", href: "/technologies" },
  { label: "Cybersecurity", href: "/cybersecurity" },
  { label: "Proyectos", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Biblioteca", href: "/library" },
  { label: "System 777", href: "/bot", children: [
    { label: "Inicio", href: "/bot" },
    { label: "Comandos", href: "/bot/commands" },
    { label: "Estado", href: "/bot/status" },
    { label: "Dashboard", href: "/bot/dashboard" },
  ]},
  { label: "Contacto", href: "/contact" },
];

export const technologies = [
  { name: "Python", category: "Lenguajes", level: "Avanzado" },
  { name: "JavaScript", category: "Lenguajes", level: "Avanzado" },
  { name: "TypeScript", category: "Lenguajes", level: "Intermedio" },
  { name: "HTML", category: "Frontend", level: "Avanzado" },
  { name: "CSS", category: "Frontend", level: "Avanzado" },
  { name: "React", category: "Frontend", level: "Intermedio" },
  { name: "Next.js", category: "Frontend", level: "Intermedio" },
  { name: "Node.js", category: "Backend", level: "Intermedio" },
  { name: "SQL", category: "Bases de datos", level: "Intermedio" },
  { name: "C", category: "Lenguajes", level: "Básico" },
  { name: "C++", category: "Lenguajes", level: "Básico" },
  { name: "C#", category: "Lenguajes", level: "Básico" },
  { name: "Linux", category: "DevOps", level: "Avanzado" },
  { name: "Docker", category: "DevOps", level: "Intermedio" },
  { name: "Discord.js", category: "Herramientas", level: "Avanzado" },
  { name: "Git", category: "Herramientas", level: "Avanzado" },
  { name: "Cloudflare", category: "DevOps", level: "Intermedio" },
  { name: "PostgreSQL", category: "Bases de datos", level: "Intermedio" },
  { name: "Redis", category: "Bases de datos", level: "Básico" },
  { name: "AWS", category: "DevOps", level: "Básico" },
];

export const cybersecurityAreas = [
  { name: "Seguridad Web", desc: "Testing de penetración, auditorías, vulnerabilidades web" },
  { name: "Análisis de Vulnerabilidades", desc: "Finding and exploiting security weaknesses" },
  { name: "Forensics", desc: "Investigación digital y análisis de evidencia" },
  { name: "SOC Operations", desc: "Monitorización y operaciones Red/Blue team" },
  { name: "Seguridad APIs", desc: "Testing y hardening de APIs REST/GraphQL" },
  { name: "Autenticación", desc: "OAuth, JWT, MFA y sistemas de login" },
  { name: "Hardening", desc: "Secure configuration de servidores y apps" },
  { name: "Redes Seguras", desc: "Seguridad de infraestructura de red" },
  { name: "OSINT Defensivo", desc: "Inteligencia abierta para defensa" },
  { name: "Automatización", desc: "Scripts y herramientas de seguridad" },
  { name: "Anti-Raid", desc: "Protección contra ataques de raid en Discord" },
  { name: "Moderación", desc: "Sistemas de moderación automatizados" },
];
