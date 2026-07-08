"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { BookOpen, Clock, Users, Star, ArrowLeft, Check, Lock, Play, ChevronRight, Shield, X, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { useSession } from "@/components/Providers";
import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/ui/Animations";

interface Lesson {
  title: string;
  duration: string;
  free: boolean;
  videoId?: string;
  content?: string;
}

interface CourseData {
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
  curriculum: { title: string; lessons: Lesson[] }[];
  requirements: string[];
  whatYouLearn: string[];
}

export default function CourseClient({ course, freeLessons, totalLessons }: { course: CourseData; freeLessons: number; totalLessons: number }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeLesson, setActiveLesson] = useState<{ sectionIdx: number; lessonIdx: number } | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [quizMode, setQuizMode] = useState(false);
  const [quizSectionIdx, setQuizSectionIdx] = useState(0);
  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const quizData: Record<number, { question: string; options: string[]; correct: number }[]> = {
    0: [
      { question: "Que significa HTML?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"], correct: 0 },
      { question: "Cual es la etiqueta para crear un enlace?", options: ["<link>", "<a>", "<href>", "<url>"], correct: 1 },
      { question: "Que etiqueta se usa para imagenes?", options: ["<picture>", "<img>", "<image>", "<src>"], correct: 1 },
    ],
    1: [
      { question: "Que propiedad CSS controla el tamanio del texto?", options: ["text-size", "font-size", "text-style", "font-style"], correct: 1 },
      { question: "Que valor de display crea un layout flexbox?", options: ["display: block", "display: flex", "display: inline", "display: grid"], correct: 1 },
      { question: "Que propiedad CSS crea un grid?", options: ["display: table", "display: flex", "display: grid", "display: layout"], correct: 2 },
    ],
    2: [
      { question: "Como se declara una constante en JavaScript?", options: ["var", "let", "const", "define"], correct: 2 },
      { question: "Que metodo selecciona un elemento por ID?", options: ["querySelector", "getElementById", "getElement", "findElement"], correct: 1 },
      { question: "Que evento se dispara al hacer clic?", options: ["onhover", "onclick", "onscroll", "onload"], correct: 1 },
    ],
    3: [
      { question: "Que hook gestiona el estado en React?", options: ["useEffect", "useState", "useRef", "useMemo"], correct: 1 },
      { question: "Que hook ejecuta efectos secundarios?", options: ["useState", "useCallback", "useEffect", "useReducer"], correct: 2 },
      { question: "Que retorna useState?", options: ["Un valor", "Una funcion", "[valor, setter]", "Un objeto"], correct: 2 },
    ],
    4: [
      { question: "Que framework es para React en el servidor?", options: ["Express", "Next.js", "Fastify", "NestJS"], correct: 1 },
      { question: "Que permite App Router en Next.js?", options: ["Solo rutas GET", "Layouts anidados", "Solo SSR", "Solo CSR"], correct: 1 },
      { question: "Que son los Server Components?", options: ["Componentes con CSS", "Componentes renderizados en servidor", "Componentes estaticos", "Componentes de clase"], correct: 1 },
    ],
    5: [
      { question: "Como se imprime en Python?", options: ["console.log()", "echo()", "print()", "write()"], correct: 2 },
      { question: "Que tipo de dato es [1, 2, 3]?", options: ["Tuple", "List", "Array", "Dictionary"], correct: 1 },
      { question: "Como se define una funcion en Python?", options: ["function", "def", "func", "define"], correct: 1 },
    ],
    6: [
      { question: "Que es el hacking etico?", options: ["Hackear sin permiso", "Pentesting autorizado", "Robar datos", "Crear virus"], correct: 1 },
      { question: "Que herramienta escanea puertos?", options: ["Wireshark", "Nmap", "Metasploit", "Burp Suite"], correct: 1 },
      { question: "Cuantas fases tiene el pentesting?", options: ["3", "4", "5", "7"], correct: 2 },
    ],
    7: [
      { question: "Que comando muestra archivos en Linux?", options: ["dir", "ls", "show", "list"], correct: 1 },
      { question: "Que comando cambia de directorio?", options: ["move", "cd", "goto", "switch"], correct: 1 },
      { question: "Que comando crea una carpeta?", options: ["create", "mkdir", "newdir", "makedir"], correct: 1 },
    ],
    8: [
      { question: "Que framework se usa para bots de Discord?", options: ["discord.py", "Discord.js", "Discord API", "BotPress"], correct: 1 },
      { question: "Que son los Slash Commands?", options: ["Comandos de teclado", "Comandos con /", "Comandos de mouse", "Comandos voice"], correct: 1 },
      { question: "Que libreria maneja eventos en Discord.js?", options: ["events.js", "Node.js EventEmitter", "on.js", "discord-events"], correct: 1 },
    ],
    9: [
      { question: "Que es Node.js?", options: ["Un navegador", "Runtime de JavaScript", "Un lenguaje", "Un framework"], correct: 1 },
      { question: "Que framework web es Express?", options: ["Frontend", "Backend", "Base de datos", "DevOps"], correct: 1 },
      { question: "Que modulo gestiona paquetes?", options: ["yarn", "npm", "pip", "cargo"], correct: 1 },
    ],
    10: [
      { question: "Que tipo de base de datos es PostgreSQL?", options: ["NoSQL", "Relacional", "Graph", "Key-Value"], correct: 1 },
      { question: "Que clausula filtra resultados?", options: ["ORDER BY", "WHERE", "GROUP BY", "HAVING"], correct: 1 },
      { question: "Que JOIN retorna todas las filas?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"], correct: 1 },
    ],
    11: [
      { question: "Que es Docker?", options: ["Un lenguaje", "Una plataforma de containers", "Un editor", "Una base de datos"], correct: 1 },
      { question: "Que archivo define un container?", options: ["config.yml", "Dockerfile", "container.json", "docker.xml"], correct: 1 },
      { question: "Que comando crea un container?", options: ["docker create", "docker run", "docker start", "docker init"], correct: 1 },
    ],
    12: [
      { question: "Que es un pentest?", options: ["Un ataque real", "Una auditoria de seguridad", "Una configuracion", "Un script"], correct: 1 },
      { question: "Que framework de explotacion es popular?", options: ["Wireshark", "Nmap", "Metasploit", "Snort"], correct: 2 },
      { question: "Que es post-explotacion?", options: ["Atacar", "Mantener acceso y mover lateralmente", "Escaneo", "Reconocimiento"], correct: 1 },
    ],
    13: [
      { question: "Que es un firewall?", options: ["Un antivirus", "Un filtro de trafico de red", "Un proxy", "Un router"], correct: 1 },
      { question: "Que protocolo analiza paquetes?", options: ["FTP", "Wireshark", "DHCP", "ARP"], correct: 1 },
      { question: "Que es IDS?", options: ["Sistema de deteccion de intrusiones", "Sistema de archivos", "Servidor DNS", "Sistema de respaldo"], correct: 0 },
    ],
    14: [
      { question: "Que es React Native?", options: ["Un framework web", "Una plataforma movil con React", "Una libreria CSS", "Un servidor"], correct: 1 },
      { question: "Que es Expo?", options: ["Una DB", "Una plataforma para React Native", "Un editor", "Un testing tool"], correct: 1 },
      { question: "Para que plataformas compila React Native?", options: ["Solo Android", "Solo iOS", "iOS y Android", "Solo web"], correct: 2 },
    ],
    15: [
      { question: "Que es Django?", options: ["Un frontend framework", "Un framework web Python", "Una DB", "Un lenguaje"], correct: 1 },
      { question: "Que es ORM en Django?", options: ["Un lenguaje de marcado", "Mapeo objeto-relacional", "Un protocolo", "Un editor"], correct: 1 },
      { question: "Que comando crea un proyecto Django?", options: ["django create", "django-admin startproject", "django init", "django new"], correct: 1 },
    ],
    16: [
      { question: "Que es AWS?", options: ["Un framework", "Un proveedor de cloud computing", "Un lenguaje", "Un navegador"], correct: 1 },
      { question: "Que servicio provee computacion virtual?", options: ["S3", "EC2", "RDS", "Lambda"], correct: 1 },
      { question: "Que servicio es almacenamiento?", options: ["EC2", "Lambda", "S3", "VPC"], correct: 2 },
    ],
    17: [
      { question: "Que es malware?", options: ["Software benigno", "Software malicioso", "Hardware", "Red"], correct: 1 },
      { question: "Que analisis ejecuta el codigo?", options: ["Estatico", "Dinamico", "Manual", "Blind"], correct: 1 },
      { question: "Que es una sandbox?", options: ["Un editor", "Un entorno aislado de analisis", "Un antivirus", "Un firewall"], correct: 1 },
    ],
    18: [
      { question: "Que es Git?", options: ["Un editor", "Un sistema de control de versiones", "Un lenguaje", "Un navegador"], correct: 1 },
      { question: "Que comando crea un repositorio?", options: ["git new", "git init", "git create", "git start"], correct: 1 },
      { question: "Que comando sube cambios?", options: ["git push", "git upload", "git send", "git sync"], correct: 0 },
    ],
    19: [
      { question: "Que es TypeScript?", options: ["Un framework", "JavaScript con tipos estaticos", "Un navegador", "Una DB"], correct: 1 },
      { question: "Como se define un tipo?", options: ["var x: number", "let x = number", "type x = number", "int x"], correct: 2 },
      { question: "Que son las interfaces?", options: ["Archivos CSS", "Contratos de tipo para objetos", "Base de datos", "APIs REST"], correct: 1 },
    ],
  };

  const currentLesson = activeLesson
    ? course.curriculum[activeLesson.sectionIdx]?.lessons[activeLesson.lessonIdx]
    : null;

  const checkEnrollment = useCallback(async () => {
    if (!session?.user) return;
    try {
      const res = await fetch(`/api/enroll?course=${course.slug}`);
      const data = await res.json();
      if (data.enrollment) {
        setEnrolled(true);
      }
    } catch {}
  }, [session, course.slug]);

  useEffect(() => {
    checkEnrollment();
  }, [checkEnrollment]);

  const handleEnroll = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    setEnrolling(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: course.slug }),
      });
      const data = await res.json();
      if (data.success) {
        setEnrolled(true);
      }
    } catch {}
    setEnrolling(false);
  };

  const handleStartCourse = () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    if (!enrolled) {
      handleEnroll();
    }
    for (let i = 0; i < course.curriculum.length; i++) {
      for (let j = 0; j < course.curriculum[i].lessons.length; j++) {
        if (course.curriculum[i].lessons[j].free || !course.isPremium) {
          setActiveLesson({ sectionIdx: i, lessonIdx: j });
          return;
        }
      }
    }
  };

  const handleLessonClick = (sectionIdx: number, lessonIdx: number) => {
    const lesson = course.curriculum[sectionIdx].lessons[lessonIdx];
    if (lesson.free || !course.isPremium || enrolled) {
      setActiveLesson({ sectionIdx, lessonIdx });
    }
  };

  const markLessonComplete = (sectionIdx: number, lessonIdx: number) => {
    const key = `${sectionIdx}-${lessonIdx}`;
    const newCompleted = new Set(completedLessons);
    newCompleted.add(key);
    setCompletedLessons(newCompleted);

    const totalAccessible = course.curriculum.reduce((acc, section) => {
      return acc + section.lessons.filter(l => l.free || !course.isPremium || enrolled).length;
    }, 0);
    const progress = Math.round((newCompleted.size / totalAccessible) * 100);

    fetch("/api/enroll", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseSlug: course.slug, progress }),
    }).catch(() => {});
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-6xl px-4">
        <Link href="/courses" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#00FF88] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver a Cursos
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <FadeIn>
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="rounded-full bg-[#00C8FF]/10 px-3 py-1 text-xs font-medium text-[#00C8FF]">{course.category}</span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">{course.level}</span>
                  {course.isPremium && (
                    <span className="rounded-full bg-[#7C3AED]/20 px-3 py-1 text-xs font-medium text-[#7C3AED] flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Premium
                    </span>
                  )}
                  {enrolled && (
                    <span className="rounded-full bg-[#00FF88]/20 px-3 py-1 text-xs font-medium text-[#00FF88] flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Inscrito
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white sm:text-4xl">{course.title}</h1>
                <p className="mt-4 text-gray-400 leading-relaxed">{course.description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {course.students.toLocaleString()} estudiantes</span>
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-[#FFD93D] text-[#FFD93D]" /> {course.rating}</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> {totalLessons} lecciones</span>
                </div>
                <div className="mt-4 text-sm text-gray-500">Instructor: <span className="text-gray-300">{course.instructor}</span></div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-4">Lo que aprenderás</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {course.whatYouLearn.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00FF88]" />
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-4">Temas del curso</h2>
                <div className="flex flex-wrap gap-2">
                  {course.topics.map((topic) => (
                    <span key={topic} className="rounded-full bg-[#00FF88]/10 px-4 py-2 text-sm text-[#00FF88]">{topic}</span>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6">Contenido del Curso</h2>
                <div className="space-y-4">
                  {course.curriculum.map((section, i) => (
                    <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white">{section.title}</h3>
                        <span className="text-xs text-gray-500">{section.lessons.length} lecciones</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        {section.lessons.map((lesson, j) => {
                          const isAccessible = lesson.free || !course.isPremium || enrolled;
                          const lessonKey = `${i}-${j}`;
                          const isCompleted = completedLessons.has(lessonKey);
                          return (
                            <button
                              key={j}
                              onClick={() => handleLessonClick(i, j)}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors ${
                                isAccessible ? "hover:bg-white/5 cursor-pointer" : "cursor-default"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4 text-[#00FF88]" />
                                ) : isAccessible ? (
                                  <Play className="h-4 w-4 text-[#00FF88]" />
                                ) : (
                                  <Lock className="h-4 w-4 text-gray-600" />
                                )}
                                <span className={`text-sm text-left ${isAccessible ? "text-gray-300" : "text-gray-500"}`}>{lesson.title}</span>
                                {lesson.free && <span className="rounded-full bg-[#00FF88]/10 px-2 py-0.5 text-[10px] text-[#00FF88]">Gratis</span>}
                                {lesson.videoId && <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] text-red-400">Video</span>}
                              </div>
                              <span className="text-xs text-gray-600">{lesson.duration}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-4">Requisitos</h2>
                <ul className="space-y-2">
                  {course.requirements.map((req) => (
                    <li key={req} className="flex items-start gap-2 text-sm text-gray-400">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-gray-600" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-1">
            <FadeIn delay={0.1}>
              <div className="glass sticky top-24 rounded-2xl p-6">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-white">
                    {course.price === 0 ? "Gratis" : `$${course.price}`}
                  </div>
                  {course.isPremium && <div className="text-sm text-gray-500">Acceso premium incluido</div>}
                </div>
                {course.isPremium ? (
                  <Link href={`/premium/checkout?course=${course.slug}`} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] py-3 text-sm font-semibold text-white transition-all hover:bg-[#6D28D9]">
                    <Shield className="h-4 w-4" /> Obtener Premium
                  </Link>
                ) : (
                  <button
                    onClick={handleStartCourse}
                    disabled={enrolling}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00FF88] py-3 text-sm font-semibold text-black transition-all hover:bg-[#00CC6A] disabled:opacity-50"
                  >
                    {enrolling ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Inscribiendo...</>
                    ) : enrolled ? (
                      <><Play className="h-4 w-4" /> Continuar Curso</>
                    ) : (
                      <><Play className="h-4 w-4" /> Empezar Gratis</>
                    )}
                  </button>
                )}
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Duración</span><span className="text-white">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Nivel</span><span className="text-white">{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Lecciones</span><span className="text-white">{totalLessons}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Acceso</span><span className="text-white">De por vida</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Certificado</span><span className="text-white">Sí</span>
                  </div>
                </div>
                {freeLessons > 0 && (
                  <div className="mt-6 rounded-xl bg-[#00FF88]/5 p-4 text-center">
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold text-[#00FF88]">{freeLessons} lecciones gratis</span> disponibles
                    </p>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {activeLesson && currentLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setActiveLesson(null)}>
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">{currentLesson.title}</h3>
                <p className="text-sm text-gray-500">{course.curriculum[activeLesson.sectionIdx].title} · {currentLesson.duration}</p>
              </div>
              <button onClick={() => setActiveLesson(null)} className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {currentLesson.videoId && (
              <div className="mb-6 aspect-video rounded-xl overflow-hidden bg-[#121212]">
                <iframe
                  src={`https://www.youtube.com/embed/${currentLesson.videoId}`}
                  title={currentLesson.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {currentLesson.content && (
              <div className="rounded-xl bg-white/[0.02] border border-white/5 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-[#00FF88]" />
                  <h4 className="font-semibold text-white">Contenido de la Lección</h4>
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed whitespace-pre-line">
                  {currentLesson.content}
                </div>
              </div>
            )}

            {!currentLesson.videoId && !currentLesson.content && (
              <div className="rounded-xl bg-white/[0.02] border border-white/5 p-8 text-center">
                <Play className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                <p className="text-gray-400">Contenido de la lección próximamente disponible</p>
              </div>
            )}

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => {
                  if (activeLesson.lessonIdx > 0) {
                    setActiveLesson({ ...activeLesson, lessonIdx: activeLesson.lessonIdx - 1 });
                  } else if (activeLesson.sectionIdx > 0) {
                    const prevSection = course.curriculum[activeLesson.sectionIdx - 1];
                    setActiveLesson({ sectionIdx: activeLesson.sectionIdx - 1, lessonIdx: prevSection.lessons.length - 1 });
                  }
                }}
                disabled={activeLesson.sectionIdx === 0 && activeLesson.lessonIdx === 0}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-gray-400 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => markLessonComplete(activeLesson.sectionIdx, activeLesson.lessonIdx)}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-[#00FF88] hover:bg-white/5"
              >
                <Check className="h-4 w-4 inline mr-1" /> Marcar Completada
              </button>
              <button
                onClick={() => {
                  const section = course.curriculum[activeLesson.sectionIdx];
                  if (activeLesson.lessonIdx < section.lessons.length - 1) {
                    setActiveLesson({ ...activeLesson, lessonIdx: activeLesson.lessonIdx + 1 });
                  } else if (activeLesson.sectionIdx < course.curriculum.length - 1) {
                    setQuizMode(true);
                    setQuizSectionIdx(activeLesson.sectionIdx);
                    setQuizQuestionIdx(0);
                    setQuizScore(0);
                    setQuizSelected(null);
                    setQuizAnswered(false);
                    setQuizComplete(false);
                  }
                }}
                disabled={activeLesson.sectionIdx === course.curriculum.length - 1 && activeLesson.lessonIdx === course.curriculum[activeLesson.sectionIdx].lessons.length - 1}
                className="rounded-xl bg-[#00FF88] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#00CC6A] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}

      {quizMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setQuizMode(false)}>
          <div className="w-full max-w-2xl glass rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {quizComplete ? "Resultados del Quiz" : `Quiz - ${course.curriculum[quizSectionIdx].title}`}
                </h3>
                {!quizComplete && (
                  <p className="text-sm text-gray-500">Pregunta {quizQuestionIdx + 1} de 3</p>
                )}
              </div>
              <button onClick={() => setQuizMode(false)} className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            {!quizComplete ? (
              <>
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-[#00FF88] transition-all" style={{ width: `${((quizQuestionIdx) / 3) * 100}%` }} />
                </div>
                <p className="text-lg text-white mb-6">{quizData[quizSectionIdx]?.[quizQuestionIdx]?.question}</p>
                <div className="space-y-3">
                  {quizData[quizSectionIdx]?.[quizQuestionIdx]?.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!quizAnswered) setQuizSelected(idx);
                      }}
                      disabled={quizAnswered}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm text-left transition-all ${
                        quizAnswered
                          ? idx === quizData[quizSectionIdx][quizQuestionIdx].correct
                            ? "border-[#00FF88] bg-[#00FF88]/10 text-[#00FF88]"
                            : idx === quizSelected
                            ? "border-red-500 bg-red-500/10 text-red-400"
                            : "border-white/5 bg-white/[0.02] text-gray-500"
                          : quizSelected === idx
                          ? "border-[#00FF88] bg-[#00FF88]/10 text-[#00FF88]"
                          : "border-white/5 bg-white/[0.02] text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  {!quizAnswered ? (
                    <button
                      onClick={() => {
                        if (quizSelected !== null) {
                          setQuizAnswered(true);
                          if (quizSelected === quizData[quizSectionIdx][quizQuestionIdx].correct) {
                            setQuizScore((s) => s + 1);
                          }
                        }
                      }}
                      disabled={quizSelected === null}
                      className="rounded-xl bg-[#00FF88] px-6 py-2.5 text-sm font-semibold text-black hover:bg-[#00CC6A] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Verificar
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (quizQuestionIdx < 2) {
                          setQuizQuestionIdx((q) => q + 1);
                          setQuizSelected(null);
                          setQuizAnswered(false);
                        } else {
                          setQuizComplete(true);
                        }
                      }}
                      className="rounded-xl bg-[#00FF88] px-6 py-2.5 text-sm font-semibold text-black hover:bg-[#00CC6A]"
                    >
                      {quizQuestionIdx < 2 ? "Siguiente" : "Ver Resultados"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl font-bold text-[#00FF88] mb-4">{quizScore}/3</div>
                <p className="text-gray-400 mb-2">
                  {quizScore === 3 ? "Perfecto! Dominas esta seccion." : quizScore >= 2 ? "Buen trabajo! Repasa lo que falte." : "Sigue practicando, tu puedes!"}
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <button
                    onClick={() => { setQuizMode(false); }}
                    className="rounded-xl border border-white/10 px-6 py-2.5 text-sm text-gray-400 hover:bg-white/5"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      if (activeLesson) markLessonComplete(quizSectionIdx, course.curriculum[quizSectionIdx].lessons.length - 1);
                      setQuizMode(false);
                    }}
                    className="rounded-xl bg-[#00FF88] px-6 py-2.5 text-sm font-semibold text-black hover:bg-[#00CC6A]"
                  >
                    Completar Leccion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
