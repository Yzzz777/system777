"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Github, Twitter, Globe } from "lucide-react";
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem, HoverScale } from "@/components/ui/Animations";
import Image from "next/image";

const profiles = [
  {
    name: "Linus Torvalds",
    role: "Creador de Linux y Git",
    country: "Finlandia 🇫🇮",
    bio: "Ingeniero de software finlandés-estadounidense que creó el kernel de Linux y el sistema de control de versiones Git. Su trabajo alimenta la mayoría de servidores, smartphones y supercomputadoras del mundo.",
    achievements: ["Creó el kernel de Linux (1991)", "Creó Git (2005)", "Premio Pionero IEEE", "Premio Tecnología del Milenio"],
    funFact: "Linux ejecuta el 96.3% de los 1 millón de servidores web más importantes del mundo",
    color: "#FCC624",
    initials: "LT",
    category: "Open Source",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Linus_Torvalds_in_Helsinki.jpg/440px-Linus_Torvalds_in_Helsinki.jpg",
    social: { github: "https://github.com/torvalds" },
  },
  {
    name: "Bill Gates",
    role: "Cofundador de Microsoft",
    country: "Estados Unidos 🇺🇸",
    bio: "Empresario, desarrollador de software y filántropo estadounidense. Cofundó Microsoft, que se convirtió en la empresa de software para computadoras personales más grande del mundo.",
    achievements: ["Cofundó Microsoft", "Creó MS-DOS y Windows", "Persona más rica (varios años)", "Fundación Bill y Melinda Gates"],
    funFact: "Microsoft Windows se ejecuta en más de 1,400 millones de dispositivos",
    color: "#00ADEF",
    initials: "BG",
    category: "Sistemas Operativos",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bill_Gates_in_2023.png/440px-Bill_Gates_in_2023.png",
    social: { twitter: "https://twitter.com/BillGates" },
  },
  {
    name: "Guido van Rossum",
    role: "Creador de Python",
    country: "Países Bajos 🇳🇱",
    bio: "Programador neerlandés que creó el lenguaje de programación Python en 1991. Python es ahora uno de los lenguajes más populares y versátiles del mundo.",
    achievements: ["Creó Python (1991)", "BDFL de Python por 30 años", "Ingeniero Senior de Google", "Ingeniero Técnico de Microsoft"],
    funFact: "Python es #1 en el índice TIOBE y potencia la IA/ML en todo el mundo",
    color: "#3776AB",
    initials: "GV",
    category: "Programación",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Guido_van_Rossum_OSCON_2006.jpg/440px-Guido_van_Rossum_OSCON_2006.jpg",
    social: { github: "https://github.com/gvanrossum" },
  },
  {
    name: "Brendan Eich",
    role: "Creador de JavaScript",
    country: "Estados Unidos 🇺🇸",
    bio: "Programador estadounidense que creó JavaScript en 1995 mientras trabajaba en Netscape. También cofundó el proyecto Mozilla y creó el navegador Brave.",
    achievements: ["Creó JavaScript (1995)", "Cofundó Mozilla", "Creó Brave Browser", "Premio Brendan Eich"],
    funFact: "JavaScript se ejecuta en cada navegador web del mundo — el 97% de todos los sitios web",
    color: "#F7DF1E",
    initials: "BE",
    category: "Programación",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Brendan_Eich_Mozilla_Foundation_official_photo.jpg/440px-Brendan_Eich_Mozilla_Foundation_official_photo.jpg",
    social: { twitter: "https://twitter.com/BrendanEich" },
  },
  {
    name: "Dennis Ritchie",
    role: "Creador de C y Unix",
    country: "Estados Unidos 🇺🇸",
    bio: "Científico informático estadounidense que creó el lenguaje de programación C y codesarrolló el sistema operativo Unix en Bell Labs. Su trabajo sentó las bases de la computación moderna.",
    achievements: ["Creó el lenguaje C", "Codesarrolló Unix", "Premio Turing (1983)", "Medalla Nacional de Tecnología"],
    funFact: "El lenguaje C es la base de la mayoría de sistemas operativos, bases de datos y compiladores",
    color: "#555555",
    initials: "DR",
    category: "Sistemas Operativos",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Dennis_Ritchie_2011.jpg/440px-Dennis_Ritchie_2011.jpg",
    social: {},
  },
  {
    name: "James Gosling",
    role: "Creador de Java",
    country: "Canadá 🇨🇦",
    bio: "Científico informático canadiense que creó el lenguaje de programación Java en 1995 en Sun Microsystems. Java se ejecuta en miles de millones de dispositivos en todo el mundo.",
    achievements: ["Creó Java (1995)", "Padre de Java", "Medalla de Honor IEEE", "Premio ACM a Sistema de Software"],
    funFact: "Java se ejecuta en 3,000 millones de dispositivos — desde teléfonos Android hasta servidores empresariales",
    color: "#ED8B00",
    initials: "JG",
    category: "Programación",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/James_Gosling_2008.jpg/440px-James_Gosling_2008.jpg",
    social: {},
  },
  {
    name: "Ada Lovelace",
    role: "Primera Programadora",
    country: "Reino Unido 🇬🇧",
    bio: "Matemática británica que escribió el primer algoritmo destinado a ser procesado por una máquina. Es ampliamente considerada la primera programadora de la historia.",
    achievements: ["Primer algoritmo de computación", "Visionaria de la computación", "Lenguaje Ada nombrado en su honor", "Pionera de la informática"],
    funFact: "Sus notas sobre el motor de Babbage contenían el primer algoritmo publicado — en 1843",
    color: "#FF6B9D",
    initials: "AL",
    category: "Programación",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Ada_Lovelace_portrait.jpg/440px-Ada_Lovelace_portrait.jpg",
    social: {},
  },
  {
    name: "Mark Zuckerberg",
    role: "Cofundador de Meta",
    country: "Estados Unidos 🇺🇸",
    bio: "Empresario de medios y emprendedor de internet estadounidense que cofundó Facebook (ahora Meta). Transformó las redes sociales y el desarrollo web.",
    achievements: ["Creó Facebook/Meta", "Meta Quest VR", "React de código abierto", "La plataforma social más grande"],
    funFact: "React, creado por Meta, lo usan millones de desarrolladores en todo el mundo",
    color: "#1877F2",
    initials: "MZ",
    category: "Desarrollo Web",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Mark_Zuckerberg_F8_2019_Keynote_%2832831578717004%29.jpg/440px-Mark_Zuckerberg_F8_2019_Keynote_%2832831578717004%29.jpg",
    social: { twitter: "https://twitter.com/fuckaboragezuck" },
  },
  {
    name: "Ryan Dahl",
    role: "Creador de Node.js y Deno",
    country: "Estados Unidos 🇺🇸",
    bio: "Desarrollador de software estadounidense que creó Node.js en 2009, revolucionando el JavaScript del lado del servidor. Después creó Deno como un runtime mejorado.",
    achievements: ["Creó Node.js (2009)", "Creó Deno", "Premio JSConf", "Pionero de E/S basada en eventos"],
    funFact: "Node.js impulsa Netflix, PayPal, LinkedIn y miles de empresas más",
    color: "#339933",
    initials: "RD",
    category: "Backend",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/440px-Node.js_logo.svg.png",
    social: { github: "https://github.com/ry" },
  },
  {
    name: "Evan You",
    role: "Creador de Vue.js",
    country: "China 🇨🇳",
    bio: "Desarrollador de software chino-estadounidense que creó Vue.js en 2014. Vue.js se ha convertido en uno de los frameworks frontend más populares para crear aplicaciones web.",
    achievements: ["Creó Vue.js", "Creó Vite", "Modo Vapor", "Millones de descargas mensuales"],
    funFact: "Vue.js es el framework frontend con más estrellas en GitHub",
    color: "#4FC08D",
    initials: "EY",
    category: "Frontend",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/440px-Vue.js_Logo_2.svg.png",
    social: { github: "https://github.com/yyx990803" },
  },
  {
    name: "Guillermo Rauch",
    role: "Creador de Next.js",
    country: "Argentina 🇦🇷",
    bio: "Desarrollador de software argentino-estadounidense, CEO de Vercel. Creó Next.js que se convirtió en el framework React más popular para aplicaciones en producción.",
    achievements: ["Creó Next.js", "CEO de Vercel", "Pionero de React Server Components", "Lideró Next.js 15"],
    funFact: "Next.js lo usan TikTok, Twitch, Hulu, Netflix y The Washington Post",
    color: "#000000",
    initials: "GR",
    category: "Full Stack",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nextjs-logo.svg/440px-Nextjs-logo.svg.png",
    social: { twitter: "https://twitter.com/raaboraguchig" },
  },
  {
    name: "Gavin Wood",
    role: "Creador de Solidity y Ethereum",
    country: "Reino Unido 🇬🇧",
    bio: "Científico informático británico que cofundó Ethereum y creó Solidity, el lenguaje de programación para contratos inteligentes en blockchain.",
    achievements: ["Cofundó Ethereum", "Creó Solidity", "Creó Polkadot", "Fundador de Parity Technologies"],
    funFact: "Solidity potencia miles de millones en aplicaciones DeFi y NFT",
    color: "#363636",
    initials: "GW",
    category: "Blockchain",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/440px-Ethereum_logo_2014.svg.png",
    social: { github: "https://github.com/gavofyork" },
  },
];

const categories = ["Todos", "Programación", "Sistemas Operativos", "Desarrollo Web", "Frontend", "Backend", "Full Stack", "Open Source", "Blockchain"];

export default function ProfilesPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filtered = selectedCategory === "Todos"
    ? profiles
    : profiles.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[#00FF88]/20 bg-[#00FF88]/5 px-4 py-1.5 text-sm text-[#00FF88]">
              <Star className="h-3 w-3" />
              Leyendas Tech
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Las Mentes Detrás de la Tecnología</h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              Conoce a los visionarios que crearon las tecnologías que usas todos los días
            </p>
          </div>
        </FadeIn>

        <FadeInUp delay={0.2}>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm transition-all ${
                  selectedCategory === cat
                    ? "bg-[#00FF88] text-black font-semibold"
                    : "border border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeInUp>

        <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((person) => (
            <StaggerItem key={person.name}>
              <HoverScale>
                <div className="glass rounded-2xl overflow-hidden h-full flex flex-col transition-all hover:border-white/10">
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#121212] to-[#1a1a1a]">
                    <Image
                      src={person.photo}
                      alt={person.name}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold border-2" style={{ backgroundColor: person.color + "30", color: person.color, borderColor: person.color + "60" }}>
                          {person.initials}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{person.name}</h3>
                          <p className="text-sm text-[#00FF88]">{person.role}</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="rounded-full bg-black/50 backdrop-blur-sm px-2 py-1 text-xs text-gray-300">
                        {person.country}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-sm text-gray-400 leading-relaxed flex-1">{person.bio}</p>

                    <div className="mt-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Logros Clave</h4>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {person.achievements.map((a) => (
                          <span key={a} className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-400">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-[#00FF88]/5 p-3">
                      <p className="text-xs text-[#00FF88]">
                        <span className="font-semibold">Dato curioso:</span> {person.funFact}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      {person.social.github && (
                        <a href={person.social.github} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {person.social.twitter && (
                        <a href={person.social.twitter} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                      <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-500">
                        {person.category}
                      </span>
                    </div>
                  </div>
                </div>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp delay={0.3}>
          <div className="mt-20 glass neon-glow rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white">Sé la Próxima Leyenda</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Todo gran desarrollador empezó en algún lugar. Comienza tu viaje con SYSTEM 777 y escribe tu propio capítulo en la historia de la tecnología.
            </p>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}
