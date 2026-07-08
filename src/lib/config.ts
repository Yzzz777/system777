export const siteConfig = {
  name: "SYSTEM 777",
  description: "Academia tecnológica profesional para programación, ciberseguridad, Linux y desarrollo Discord",
  url: "https://jrsystem7777.com",
  contact: {
    email: "rksagmita@jrsystem7777.com",
    whatsapp: "+1 849 565 9903",
    whatsappLink: "https://wa.me/18495659903",
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
  { label: "Cursos", href: "/courses" },
  { label: "Academia", href: "/academy", children: [
    { label: "Programación", href: "/academy/programming" },
    { label: "Ciberseguridad", href: "/academy/cybersecurity" },
    { label: "Desarrollo Discord", href: "/academy/discord" },
    { label: "Linux", href: "/academy/linux" },
  ]},
  { label: "Bot", href: "/bot", children: [
    { label: "Dashboard", href: "/bot/dashboard" },
    { label: "Comandos", href: "/bot/commands" },
    { label: "Estado", href: "/bot/status" },
  ]},
  { label: "Leyendas", href: "/profiles" },
  { label: "Blog", href: "/blog" },
  { label: "Comunidad", href: "/community" },
  { label: "Premium", href: "/premium/checkout", children: [
    { label: "Chat Premium", href: "/premium/chat" },
    { label: "Llamadas", href: "/premium/calls" },
    { label: "Reuniones Zoom", href: "/premium/meetings" },
    { label: "Agendar Clase", href: "/premium/schedule" },
    { label: "Obtener Premium", href: "/premium/checkout" },
  ]},
  { label: "Contacto", href: "/contact" },
];

export const courseCategories = [
  "Programación", "Desarrollo Web", "Backend", "Frontend",
  "Full Stack", "Móvil", "IA", "Linux", "Redes", "Servidores",
  "Cloud", "Ciberseguridad", "Discord", "DevOps", "Bases de Datos",
];
