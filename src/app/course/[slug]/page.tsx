import Link from "next/link";
import CourseClient from "./CourseClient";

const allCourses: Record<string, {
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  students: number;
  rating: number;
  instructor: string;
  price: number;
  isPremium: boolean;
  topics: string[];
  curriculum: { title: string; lessons: { title: string; duration: string; free: boolean; videoId?: string; content?: string }[] }[];
  requirements: string[];
  whatYouLearn: string[];
}> = {
  "html-fundamentals": {
    slug: "html-fundamentals", title: "Fundamentos de HTML", category: "Programación", level: "Principiante", duration: "8h", students: 2500, rating: 4.9, instructor: "System 777", price: 0, isPremium: false,
    description: "Aprende HTML desde cero. Crea páginas web estructuradas y semánticas con las mejores prácticas.",
    topics: ["Etiquetas HTML", "Formularios", "HTML Semántico", "Multimedia", "Accesibilidad", "SEO Básico"],
    requirements: ["Ningún conocimiento previo", "Un navegador web", "Ganas de aprender"],
    whatYouLearn: ["Crear páginas web desde cero", "HTML semántico y accesible", "Formularios interactivos", "Integrar multimedia", "Buenas prácticas de SEO"],
    curriculum: [
      { title: "Introducción a HTML", lessons: [
        { title: "Qué es HTML", duration: "15 min", free: true, videoId: "u5vWFfZ6Csc", content: "HTML (HyperText Markup Language) es el lenguaje de marcado estándar para crear páginas web.\n\n¿Qué aprenderás?\n- Qué es HTML y para qué sirve\n- Cómo funciona un navegador web\n- Estructura básica de un documento HTML\n\nEjemplo básico:\n<!DOCTYPE html>\n<html lang=\"es\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Mi primera página</title>\n</head>\n<body>\n  <h1>¡Hola Mundo!</h1>\n  <p>Mi primera página web</p>\n</body>\n</html>\n\nHTML usa \"etiquetas\" para estructurar el contenido. Las etiquetas van entre corchetes angulares < > y por lo general vienen en pares: una de apertura y una de cierre." },
        { title: "Tu primer archivo HTML", duration: "20 min", free: true, videoId: "u5vWFfZ6Csc", content: "Para crear tu primer archivo HTML necesitas:\n\n1. Un editor de código (VS Code, Sublime Text, etc.)\n2. Un navegador web (Chrome, Firefox, etc.)\n\nPasos:\n1. Crea un archivo llamado index.html\n2. Escribe el código HTML básico\n3. Abre el archivo en tu navegador\n\n<!DOCTYPE html>\n<html lang=\"es\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Mi Primera Página</title>\n</head>\n<body>\n  <h1>¡Bienvenido!</h1>\n  <p>Esta es mi primera página web creada con HTML.</p>\n</body>\n</html>\n\nGuarda el archivo y ábrelo con doble clic. Verás tu página en el navegador." },
        { title: "Estructura básica de un documento", duration: "25 min", free: false, videoId: "u5vWFfZ6Csc", content: "Todo documento HTML tiene esta estructura:\n\n<!DOCTYPE html> - Declara que es un documento HTML5\n<html> - Elemento raíz\n<head> - Metadatos, título, enlaces a CSS\n<body> - Todo el contenido visible\n\nEtiquetas importantes en <head>:\n- <meta charset=\"UTF-8\"> - Codificación de caracteres\n- <meta name=\"viewport\"> - Diseño responsive\n- <title> - Título en la pestaña del navegador\n- <link rel=\"stylesheet\"> - Enlazar archivos CSS\n- <script> - Enlazar archivos JavaScript" }
      ]},
      { title: "Etiquetas Fundamentales", lessons: [
        { title: "Títulos y párrafos", duration: "20 min", free: false, videoId: "u5vWFfZ6Csc", content: "HTML tiene 6 niveles de títulos:\n\n<h1>Título principal</h1> - El más importante\n<h2>Subtítulo</h2>\n<h3>Título de nivel 3</h3>\n<h4>h4</h4>\n<h5>h5</h5>\n<h6>h6</h6>\n\nPárrafos:\n<p>Este es un párrafo de texto. Puedes escribir todo lo que quieras aquí.</p>\n\nSaltos de línea:\n<br> - Salto de línea\n<hr> - Línea horizontal separadora\n\nFormato de texto:\n<strong>Texto en negrita</strong>\n<em>Texto en cursiva</em>\n<mark>Texto resaltado</mark>\n<small>Texto pequeño</small>" },
        { title: "Listas y enlaces", duration: "25 min", free: false, videoId: "u5vWFfZ6Csc" },
        { title: "Imágenes y multimedia", duration: "30 min", free: false, videoId: "u5vWFfZ6Csc" }
      ]},
      { title: "Formularios", lessons: [
        { title: "Inputs y tipos de datos", duration: "30 min", free: false, videoId: "u5vWFfZ6Csc" },
        { title: "Validación de formularios", duration: "25 min", free: false, videoId: "u5vWFfZ6Csc" }
      ]}
    ]
  },
  "css-masterclass": {
    slug: "css-masterclass", title: "Masterclass de CSS", category: "Desarrollo Web", level: "Principiante", duration: "12h", students: 2100, rating: 4.8, instructor: "System 777", price: 0, isPremium: false,
    description: "Domina CSS para crear diseños espectaculares. Flexbox, Grid, animaciones y responsive design.",
    topics: ["Selectores CSS", "Flexbox", "CSS Grid", "Animaciones", "Responsive Design", "Variables CSS"],
    requirements: ["Conocimientos básicos de HTML", "Editor de código"],
    whatYouLearn: ["Layouts modernos con Flexbox y Grid", "Diseño responsive profesional", "Animaciones CSS", "Variables y funciones CSS"],
    curriculum: [
      { title: "Fundamentos de CSS", lessons: [
        { title: "Selectores y especificidad", duration: "20 min", free: true, videoId: "wRNinF7YQqQ", content: "CSS (Cascading Style Sheets) se usa para estilizar páginas HTML.\n\nTipos de selectores:\n\nSelector de elemento:\np { color: blue; }\n\nSelector de clase:\n.clase { color: red; }\n\nSelector de ID:\n#id { color: green; }\n\nSelectores descendentes:\ndiv p { color: yellow; }\n\nEspecificidad:\n1. Inline styles (1000)\n2. ID selectors (100)\n3. Class selectors (10)\n4. Element selectors (1)\n\nCuanto mayor sea la especificidad, el estilo tendrá más prioridad." },
        { title: "Box Model", duration: "25 min", free: false, videoId: "wRNinF7YQqQ", content: "El Box Model es fundamental en CSS. Cada elemento es una caja con:\n\n- Content: El contenido real\n- Padding: Espacio interno\n- Border: Borde de la caja\n- Margin: Espacio externo\n\nEjemplo:\n.caja {\n  width: 200px;\n  padding: 20px;\n  border: 2px solid #000;\n  margin: 10px;\n}\n\nTotal width = 200 + 20*2 + 2*2 + 10*2 = 264px\n\nUsa box-sizing: border-box para que el padding y border se incluyan en el ancho total." }
      ]},
      { title: "Layouts Modernos", lessons: [
        { title: "Flexbox completo", duration: "40 min", free: false, videoId: "wRNinF7YQqQ", content: "Flexbox es un sistema de layout unidimensional.\n\nContenedor flex:\n.container {\n  display: flex;\n  justify-content: center; /* Eje principal */\n  align-items: center; /* Eje cruzado */\n  gap: 20px;\n}\n\nPropiedades del eje principal:\n- flex-start\n- flex-end\n- center\n- space-between\n- space-around\n- space-evenly\n\nPropiedades del eje cruzado:\n- stretch\n- flex-start\n- flex-end\n- center\n\nPropiedades de los hijos:\n- flex-grow: 1\n- flex-shrink: 0\n- flex-basis: 200px\n- order: 1" },
        { title: "CSS Grid", duration: "45 min", free: false, videoId: "wRNinF7YQqQ", content: "CSS Grid es un sistema de layout bidimensional.\n\nContenedor grid:\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: auto;\n  gap: 20px;\n}\n\nCrear layouts complejos:\n.grid {\n  display: grid;\n  grid-template-columns: 200px 1fr 200px;\n  grid-template-rows: 60px 1fr 60px;\n  grid-template-areas:\n    \"header header header\"\n    \"sidebar main aside\"\n    \"footer footer footer\";\n}\n\n.grid-item-header { grid-area: header; }\n.grid-item-sidebar { grid-area: sidebar; }\n.grid-item-main { grid-area: main; }\n.grid-item-aside { grid-area: aside; }\n.grid-item-footer { grid-area: footer; }" }
      ]}
    ]
  },
  "javascript-complete": {
    slug: "javascript-complete", title: "Guía Completa de JavaScript", category: "Programación", level: "Intermedio", duration: "25h", students: 3200, rating: 4.9, instructor: "System 777", price: 0, isPremium: false,
    description: "JavaScript desde lo básico hasta avanzado. DOM, APIs, async/await, patrones de diseño y más.",
    topics: ["Variables y Tipos", "Funciones", "DOM Manipulation", "Async/Await", "APIs REST", "Patrones de Diseño"],
    requirements: ["Conocimientos de HTML y CSS", "Lógica básica de programación"],
    whatYouLearn: ["JavaScript moderno (ES6+)", "Manipulación del DOM", "Programación asíncrona", "Consumo de APIs", "Patrones de diseño"],
    curriculum: [
      { title: "Fundamentos", lessons: [
        { title: "Variables y tipos de datos", duration: "30 min", free: true, videoId: "W6NZfCO5SIk", content: "JavaScript tiene 3 formas de declarar variables:\n\nlet - Variable que puede cambiarse\nconst - Constante que no puede cambiarse\nvar - Forma antigua (evitar usar)\n\nlet nombre = \"Juan\";\nconst PI = 3.1416;\n\nTipos de datos:\n- String: \"texto\" o 'texto'\n- Number: 42, 3.14\n- Boolean: true, false\n- Undefined: variable sin valor\n- Null: valor vacío intencional\n- Object: { clave: valor }\n- Array: [1, 2, 3]\n\ntypeof \"hola\" // \"string\"\ntypeof 42 // \"number\"\ntypeof true // \"boolean\"" },
        { title: "Operadores y condicionales", duration: "25 min", free: true, videoId: "W6NZfCO5SIk" },
        { title: "Bucles", duration: "20 min", free: false, videoId: "W6NZfCO5SIk" }
      ]},
      { title: "Funciones y Objetos", lessons: [
        { title: "Funciones", duration: "35 min", free: false, videoId: "W6NZfCO5SIk" },
        { title: "Objetos y arrays", duration: "40 min", free: false, videoId: "W6NZfCO5SIk" }
      ]},
      { title: "DOM y Eventos", lessons: [
        { title: "Selección de elementos", duration: "25 min", free: false, videoId: "W6NZfCO5SIk" },
        { title: "Event listeners", duration: "30 min", free: false, videoId: "W6NZfCO5SIk" }
      ]}
    ]
  },
  "react-complete": {
    slug: "react-complete", title: "Curso Completo de React", category: "Frontend", level: "Intermedio", duration: "30h", students: 1800, rating: 4.8, instructor: "System 777", price: 29.99, isPremium: true,
    description: "React desde cero hasta profesional. Hooks, Context, Redux, Routing y proyectos reales.",
    topics: ["JSX", "Components", "Hooks", "Context API", "Redux", "React Router", "Testing"],
    requirements: ["JavaScript intermedio", "HTML y CSS", "Node.js básico"],
    whatYouLearn: ["Crear aplicaciones SPA con React", "Hooks avanzados", "Estado global con Context/Redux", "Routing profesional", "Testing de componentes"],
    curriculum: [
      { title: "Introducción a React", lessons: [
        { title: "Qué es React y JSX", duration: "30 min", free: true, videoId: "SqcY0GlETPk", content: "React es una librería de JavaScript para construir interfaces de usuario.\n\nJSX es una extensión de JavaScript que parece HTML:\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hola, React!</h1>\n      <p>Mi primera app con React</p>\n    </div>\n  );\n}\n\nJSX permite usar JavaScript dentro del HTML:\nfunction App() {\n  const nombre = \"Carlos\";\n  return (\n    <div>\n      <h1>Hola, {nombre}!</h1>\n      <p>2 + 2 = {2 + 2}</p>\n    </div>\n  );\n}" },
        { title: "Componentes y Props", duration: "35 min", free: true, videoId: "SqcY0GlETPk" }
      ]},
      { title: "Hooks", lessons: [
        { title: "useState y useEffect", duration: "40 min", free: false, videoId: "SqcY0GlETPk" },
        { title: "useContext y useReducer", duration: "45 min", free: false, videoId: "SqcY0GlETPk" }
      ]}
    ]
  },
  "nextjs-mastery": {
    slug: "nextjs-mastery", title: "Dominio de Next.js", category: "Full Stack", level: "Avanzado", duration: "35h", students: 1500, rating: 4.9, instructor: "System 777", price: 39.99, isPremium: true,
    description: "Next.js 15 completo. App Router, Server Components, API Routes, SSR, ISR y deployment.",
    topics: ["App Router", "Server Components", "API Routes", "SSR/ISR", "Middleware", "Authentication"],
    requirements: ["React intermedio", "JavaScript avanzado", "Node.js"],
    whatYouLearn: ["Next.js 15 App Router", "Server Components y Server Actions", "SSR e ISR", "API Routes", "Deploy en Cloudflare/Vercel"],
    curriculum: [
      { title: "Fundamentos", lessons: [
        { title: "Instalación y estructura", duration: "25 min", free: true, videoId: "xnOwOBYaA3w" },
        { title: "App Router vs Pages Router", duration: "30 min", free: true, videoId: "xnOwOBYaA3w" }
      ]}
    ]
  },
  "python-complete": {
    slug: "python-complete", title: "Curso Completo de Python", category: "Programación", level: "Principiante", duration: "20h", students: 2800, rating: 4.8, instructor: "System 777", price: 0, isPremium: false,
    description: "Python desde cero. Variables, funciones, POO, manejo de archivos y proyectos prácticos.",
    topics: ["Variables", "Funciones", "POO", "Archivos", "Módulos", "Virtual Environments"],
    requirements: ["Ningún conocimiento previo", "Computadora con internet"],
    whatYouLearn: ["Programar en Python", "Programación orientada a objetos", "Manipulación de archivos", "Crear scripts automatizados"],
    curriculum: [
      { title: "Fundamentos", lessons: [
        { title: "Instalación y configuración", duration: "15 min", free: true, videoId: "fWjsdhR3z3c", content: "Python es un lenguaje de programación de alto nivel, fácil de aprender.\n\nInstalación:\n1. Ve a python.org/downloads\n2. Descarga Python 3.x\n3. Marca \"Add Python to PATH\"\n4. Haz clic en Install Now\n\nVerificar instalación:\npython --version\n\nTu primer programa:\nprint(\"¡Hola, Mundo!\")\n\nVariables:\nnombre = \"Carlos\"\nedad = 25\nprint(f\"Hola, soy {nombre} y tengo {edad} años\")" },
        { title: "Variables y tipos", duration: "25 min", free: true, videoId: "fWjsdhR3z3c" }
      ]}
    ]
  },
  "ethical-hacking": {
    slug: "ethical-hacking", title: "Hacking Ético Completo", category: "Ciberseguridad", level: "Intermedio", duration: "40h", students: 1200, rating: 4.9, instructor: "System 777", price: 49.99, isPremium: true,
    description: "Hacking ético profesional. Reconocimiento, escaneo, explotación, post-explotación y reportes.",
    topics: ["Reconocimiento", "Escaneo de puertos", "Explotación", "Post-explotación", "Reportes", "Kali Linux"],
    requirements: ["Conocimientos de redes", "Linux básico", "Lógica de programación"],
    whatYouLearn: ["Metodología de pentesting", "Uso de Kali Linux y herramientas", "Explotación de vulnerabilidades", "Escribir reportes profesionales"],
    curriculum: [
      { title: "Introducción", lessons: [
        { title: "¿Qué es el hacking ético?", duration: "20 min", free: true, videoId: "4-CHU6cWfWA", content: "El hacking ético es la práctica de probar sistemas de información para encontrar vulnerabilidades de forma autorizada.\n\nFases del Pentesting:\n1. Reconocimiento - Recopilar información sobre el objetivo\n2. Escaneo - Identificar puertos y servicios abiertos\n3. Obtención de acceso - Explotar vulnerabilidades\n4. Mantener acceso - Asegurar persistencia\n5. Borrado de huellas - Eliminar rastros\n\nHerramientas de Kali Linux:\n- Nmap: Escaneo de puertos\n- Metasploit: Framework de explotación\n- Burp Suite: Testing de apps web\n- Wireshark: Análisis de tráfico\n- John the Ripper: Crackeo de contraseñas\n- Hydra: Fuerza bruta" },
        { title: "Entorno de laboratorio", duration: "30 min", free: true, videoId: "4-CHU6cWfWA" }
      ]}
    ]
  },
  "linux-admin": {
    slug: "linux-admin", title: "Administración de Linux", category: "Linux", level: "Principiante", duration: "15h", students: 1900, rating: 4.7, instructor: "System 777", price: 0, isPremium: false,
    description: "Administra servidores Linux. Terminal, permisos, servicios, redes y seguridad.",
    topics: ["Terminal", "Permisos", "Gestión de procesos", "Servicios", "Firewall", "SSH"],
    requirements: ["Una computadora", "Ganas de aprender Linux"],
    whatYouLearn: ["Navegar por la terminal", "Gestionar usuarios y permisos", "Configurar servicios", "Seguridad básica en Linux"],
    curriculum: [
      { title: "Introducción", lessons: [
        { title: "Instalación de Linux", duration: "25 min", free: true, videoId: "zIdv2NDRExI", content: "Linux es un sistema operativo de código abierto.\n\nDistribuciones populares:\n- Ubuntu: Para principiantes\n- Debian: Muy estable\n- CentOS/RHEL: Para servidores\n- Kali Linux: Para seguridad\n\nComandos básicos:\nls - Listar archivos\ncd - Cambiar directorio\npwd - Directorio actual\nmkdir - Crear carpeta\nrm - Eliminar archivos\ncp - Copiar archivos\nmv - Mover/renombrar\nchmod - Cambiar permisos\nchown - Cambiar propietario\nsudo - Ejecutar como root" },
        { title: "Terminal básica", duration: "30 min", free: true, videoId: "zIdv2NDRExI" }
      ]}
    ]
  },
  "discord-js-bot": {
    slug: "discord-js-bot", title: "Desarrollo de Bots con Discord.js", category: "Discord", level: "Intermedio", duration: "20h", students: 900, rating: 4.8, instructor: "System 777", price: 19.99, isPremium: true,
    description: "Crea bots de Discord profesionales con Discord.js v14. Slash commands, embeds, sistemas.",
    topics: ["Discord.js v14", "Slash Commands", "Embeds", "Sistemas de tickets", "Música", "Economía"],
    requirements: ["JavaScript intermedio", "Node.js", "Una cuenta de Discord"],
    whatYouLearn: ["Crear bots con Discord.js v14", "Slash commands e interacciones", "Sistemas de tickets y verificación", "Bots de música y economía"],
    curriculum: [
      { title: "Fundamentos", lessons: [
        { title: "Setup de Discord.js", duration: "25 min", free: true, videoId: "KZ3tIGHU314" },
        { title: "Primer bot", duration: "30 min", free: true, videoId: "KZ3tIGHU314" }
      ]}
    ]
  },
  "nodejs-backend": {
    slug: "nodejs-backend", title: "Desarrollo Backend con Node.js", category: "Backend", level: "Intermedio", duration: "25h", students: 1600, rating: 4.8, instructor: "System 777", price: 29.99, isPremium: true,
    description: "Node.js completo para backend. Express, bases de datos, autenticación y APIs REST.",
    topics: ["Node.js", "Express.js", "REST APIs", "MongoDB", "JWT", "WebSockets"],
    requirements: ["JavaScript intermedio", "HTML/CSS básico"],
    whatYouLearn: ["Crear APIs RESTful", "Autenticación con JWT", "Conexión a bases de datos", "WebSockets y tiempo real"],
    curriculum: [
      { title: "Fundamentos", lessons: [
        { title: "Node.js y npm", duration: "20 min", free: true, videoId: "ENrzD9HAZK4" },
        { title: "Express.js", duration: "30 min", free: true, videoId: "ENrzD9HAZK4" }
      ]}
    ]
  },
  "postgresql-database": {
    slug: "postgresql-database", title: "PostgreSQL Completo", category: "Bases de Datos", level: "Intermedio", duration: "18h", students: 800, rating: 4.7, instructor: "System 777", price: 0, isPremium: false,
    description: "PostgreSQL desde básico hasta avanzado. Consultas, JOINs, índices, optimización y más.",
    topics: ["SQL", "JOINs", "Índices", "Transacciones", "Funciones", "Optimización"],
    requirements: ["Lógica básica", "Una computadora"],
    whatYouLearn: ["Escribir consultas SQL complejas", "Diseñar bases de datos", "Optimizar rendimiento", "Gestionar transacciones"],
    curriculum: [
      { title: "Fundamentos", lessons: [
        { title: "Instalación de PostgreSQL", duration: "15 min", free: true, videoId: "n2Fluyr3lbc" },
        { title: "SELECT y WHERE", duration: "25 min", free: true, videoId: "n2Fluyr3lbc" }
      ]}
    ]
  },
  "kubernetes-docker": {
    slug: "kubernetes-docker", title: "Docker y Kubernetes", category: "DevOps", level: "Avanzado", duration: "22h", students: 700, rating: 4.9, instructor: "System 777", price: 39.99, isPremium: true,
    description: "Docker y Kubernetes para producción. Containers, orquestación, CI/CD y microservicios.",
    topics: ["Docker", "Docker Compose", "Kubernetes", "Helm", "CI/CD", "Microservicios"],
    requirements: ["Linux básico", "Experiencia con servidores", "Redes básicas"],
    whatYouLearn: ["Crear y gestionar containers", "Orquestar con Kubernetes", "CI/CD pipelines", "Arquitectura de microservicios"],
    curriculum: [
      { title: "Docker", lessons: [
        { title: "Containers básicos", duration: "30 min", free: true, videoId: "DQdB7wFEygo" },
        { title: "Dockerfile", duration: "25 min", free: true, videoId: "DQdB7wFEygo" }
      ]}
    ]
  },
  "penetration-testing": {
    slug: "penetration-testing", title: "Pruebas de Penetración", category: "Ciberseguridad", level: "Avanzado", duration: "35h", students: 600, rating: 4.9, instructor: "System 777", price: 59.99, isPremium: true,
    description: "Pentesting profesional. Metasploit, Burp Suite, explotación de web apps y redes.",
    topics: ["Metasploit", "Burp Suite", "Web App Pentest", "Network Pentest", "Wireless", "Social Engineering"],
    requirements: ["Hacking ético intermedio", "Linux avanzado", "Redes"],
    whatYouLearn: ["Metodología profesional de pentest", "Herramientas profesionales", "Explotación de aplicaciones web", "Reportes para clientes"],
    curriculum: [
      { title: "Preparación", lessons: [
        { title: "Lab de pentesting", duration: "30 min", free: true, videoId: "4-CHU6cWfWA" },
        { title: "Metodología PTES", duration: "25 min", free: true, videoId: "4-CHU6cWfWA" }
      ]}
    ]
  },
  "network-security": {
    slug: "network-security", title: "Seguridad de Redes", category: "Ciberseguridad", level: "Intermedio", duration: "20h", students: 950, rating: 4.8, instructor: "System 777", price: 29.99, isPremium: true,
    description: "Seguridad de redes. Firewalls, IDS/IPS, VPN, análisis de tráfico y hardening.",
    topics: ["Firewalls", "IDS/IPS", "VPN", "Wireshark", "Nmap", "Hardening"],
    requirements: ["Redes básicas", "Linux básico"],
    whatYouLearn: ["Configurar firewalls", "Detectar intrusiones", "Analizar tráfico de red", "Hardenar servidores"],
    curriculum: [
      { title: "Fundamentos", lessons: [
        { title: "Modelo OSI y seguridad", duration: "25 min", free: true, videoId: "X-O1-l0gP5Q" },
        { title: "Herramientas de escaneo", duration: "30 min", free: true, videoId: "X-O1-l0gP5Q" }
      ]}
    ]
  },
  "react-native-mobile": {
    slug: "react-native-mobile", title: "Desarrollo Móvil con React Native", category: "Móvil", level: "Intermedio", duration: "28h", students: 1100, rating: 4.7, instructor: "System 777", price: 34.99, isPremium: true,
    description: "Crea apps móviles para iOS y Android con React Native. Navegación, state, APIs nativas.",
    topics: ["React Native", "Expo", "Navegación", "State Management", "APIs Nativas", "Publicación"],
    requirements: ["React intermedio", "JavaScript avanzado", "Node.js"],
    whatYouLearn: ["Crear apps para iOS y Android", "Navegación y routing móvil", "Acceder a APIs nativas", "Publicar en App Store/Play Store"],
    curriculum: [
      { title: "Introducción", lessons: [
        { title: "React Native vs Flutter", duration: "20 min", free: true, videoId: "SqcY0GlETPk" },
        { title: "Setup con Expo", duration: "25 min", free: true, videoId: "SqcY0GlETPk" }
      ]}
    ]
  },
  "python-django": {
    slug: "python-django", title: "Python Django Full Stack", category: "Backend", level: "Intermedio", duration: "32h", students: 1300, rating: 4.8, instructor: "System 777", price: 34.99, isPremium: true,
    description: "Django completo. Models, Views, Templates, REST API, autenticación y deployment.",
    topics: ["Django ORM", "Views y Templates", "Django REST", "Autenticación", "Deploy", "Testing"],
    requirements: ["Python intermedio", "HTML/CSS básico", "SQL básico"],
    whatYouLearn: ["Crear apps web con Django", "REST APIs con DRF", "Autenticación y autorización", "Deploy en producción"],
    curriculum: [
      { title: "Fundamentos", lessons: [
        { title: "Instalación y primer proyecto", duration: "25 min", free: true, videoId: "fWjsdhR3z3c" },
        { title: "Models y ORM", duration: "35 min", free: true, videoId: "fWjsdhR3z3c" }
      ]}
    ]
  },
  "cloud-aws": {
    slug: "cloud-aws", title: "Cloud Computing con AWS", category: "Cloud", level: "Intermedio", duration: "25h", students: 850, rating: 4.8, instructor: "System 777", price: 39.99, isPremium: true,
    description: "AWS completo. EC2, S3, RDS, Lambda, VPC, IAM y arquitecturas serverless.",
    topics: ["EC2", "S3", "RDS", "Lambda", "VPC", "IAM", "CloudFormation"],
    requirements: ["Linux básico", "Redes básicas", "Conocimiento de servidores"],
    whatYouLearn: ["Servicios core de AWS", "Infraestructura como código", "Serverless con Lambda", "Seguridad en la nube"],
    curriculum: [
      { title: "Introducción", lessons: [
        { title: "AWS Global Infrastructure", duration: "20 min", free: true, videoId: "Nzv-tzU-UAw" },
        { title: "Creando tu cuenta AWS", duration: "15 min", free: true, videoId: "Nzv-tzU-UAw" }
      ]}
    ]
  },
  "malware-analysis": {
    slug: "malware-analysis", title: "Análisis de Malware", category: "Ciberseguridad", level: "Experto", duration: "30h", students: 400, rating: 4.9, instructor: "System 777", price: 69.99, isPremium: true,
    description: "Análisis estático y dinámico de malware. Reverse engineering y forensics.",
    topics: ["Análisis Estático", "Análisis Dinámico", "Reverse Engineering", "Forensics", "Sandbox", "IOCs"],
    requirements: ["Ciberseguridad avanzada", "Linux", "Assembly básico"],
    whatYouLearn: ["Analizar malware en sandbox", "Reverse engineering de binarios", "Extraer IOCs", "Informes de incidentes"],
    curriculum: [
      { title: "Introducción", lessons: [
        { title: "Tipos de malware", duration: "25 min", free: true, videoId: "X-O1-l0gP5Q" },
        { title: "Setup de laboratorio", duration: "30 min", free: true, videoId: "X-O1-l0gP5Q" }
      ]}
    ]
  },
  "git-github-complete": {
    slug: "git-github-complete", title: "Git y GitHub Completo", category: "Programación", level: "Principiante", duration: "8h", students: 2200, rating: 4.7, instructor: "System 777", price: 0, isPremium: false,
    description: "Git y GitHub desde cero. Commits, branches, merge, pull requests y workflows.",
    topics: ["Git Básico", "Branches", "Merge y Rebase", "GitHub", "Pull Requests", "Git Flow"],
    requirements: ["Ningún conocimiento previo"],
    whatYouLearn: ["Control de versiones con Git", "Trabajar en equipo con GitHub", "Branching strategies", "CI/CD con GitHub Actions"],
    curriculum: [
      { title: "Fundamentos", lessons: [
        { title: "Instalación de Git", duration: "10 min", free: true, videoId: "mJ-qvsxPHpY", content: "Git es un sistema de control de versiones distribuido.\n\nInstalación:\nUbuntu: sudo apt install git\nMac: brew install git\nWindows: git-scm.com\n\nConfiguración:\ngit config --global user.name \"Tu Nombre\"\ngit config --global user.email \"tu@email.com\"\n\nComandos básicos:\ngit init - Inicializar repositorio\ngit add . - Agregar archivos\ngit commit -m \"mensaje\" - Guardar cambios\ngit status - Ver estado\ngit log - Ver historial" },
        { title: "Primer commit", duration: "15 min", free: true, videoId: "mJ-qvsxPHpY" }
      ]}
    ]
  },
  "typescript-complete": {
    slug: "typescript-complete", title: "TypeScript Completo", category: "Programación", level: "Intermedio", duration: "15h", students: 1700, rating: 4.8, instructor: "System 777", price: 0, isPremium: false,
    description: "TypeScript completo. Tipos, interfaces, generics, utility types y proyectos.",
    topics: ["Tipos Básicos", "Interfaces", "Generics", "Utility Types", "Decorators", "Modules"],
    requirements: ["JavaScript intermedio"],
    whatYouLearn: ["Tipado estático en JavaScript", "Interfaces y tipos avanzados", "Generics y utility types", "Integración con frameworks"],
    curriculum: [
      { title: "Fundamentos", lessons: [
        { title: "¿Por qué TypeScript?", duration: "15 min", free: true, videoId: "zQnBQ4tB3ZA" },
        { title: "Tipos básicos", duration: "25 min", free: true, videoId: "zQnBQ4tB3ZA" }
      ]}
    ]
  },
};

export function generateStaticParams() {
  return Object.keys(allCourses).map((slug) => ({ slug }));
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = allCourses[slug];

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold text-white">Curso no encontrado</h1>
        <p className="mt-4 text-gray-400">El curso que buscas no existe.</p>
        <Link href="/courses" className="mt-8 rounded-xl bg-[#00FF88] px-6 py-3 text-sm font-semibold text-black hover:bg-[#00CC6A]">
          Ver todos los cursos
        </Link>
      </div>
    );
  }

  const freeLessons = course.curriculum.flatMap(s => s.lessons.filter(l => l.free)).length;
  const totalLessons = course.curriculum.flatMap(s => s.lessons).length;

  return <CourseClient course={course} freeLessons={freeLessons} totalLessons={totalLessons} />;
}
