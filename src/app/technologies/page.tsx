"use client";

import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/ui/Animations";

const techStack = [
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", category: "Lenguajes", level: "Avanzado", color: "#F7DF1E" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", category: "Lenguajes", level: "Intermedio", color: "#3178C6" },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", category: "Lenguajes", level: "Avanzado", color: "#3776AB" },
  { name: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg", category: "Lenguajes", level: "Basico", color: "#A8B9CC" },
  { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", category: "Lenguajes", level: "Basico", color: "#00599C" },
  { name: "C#", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg", category: "Lenguajes", level: "Basico", color: "#68217A" },
  { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", category: "Lenguajes", level: "Basico", color: "#ED8B00" },
  { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", category: "Frontend", level: "Avanzado", color: "#E34F26" },
  { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", category: "Frontend", level: "Avanzado", color: "#1572B6" },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", category: "Frontend", level: "Intermedio", color: "#61DAFB" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", category: "Frontend", level: "Intermedio", color: "#FFFFFF" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", category: "Backend", level: "Intermedio", color: "#339933" },
  { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", category: "Bases de datos", level: "Intermedio", color: "#4169E1" },
  { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", category: "Bases de datos", level: "Intermedio", color: "#4479A1" },
  { name: "Redis", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg", category: "Bases de datos", level: "Basico", color: "#DC382D" },
  { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", category: "DevOps", level: "Avanzado", color: "#FCC624" },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", category: "DevOps", level: "Intermedio", color: "#2496ED" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", category: "Herramientas", level: "Avanzado", color: "#F05032" },
  { name: "Cloudflare", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg", category: "DevOps", level: "Intermedio", color: "#F38020" },
  { name: "Discord.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/discordjs/discordjs-original.svg", category: "Herramientas", level: "Avanzado", color: "#5865F2" },
];

const categories = [...new Set(techStack.map((t) => t.category))];
const levels = ["Avanzado", "Intermedio", "Basico"];

const levelColors: Record<string, string> = {
  Avanzado: "#00FF88",
  Intermedio: "#00C8FF",
  Basico: "#7C3AED",
};

export default function TechnologiesPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Tecnologias</h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">Las herramientas y lenguajes que uso para crear System 777 y mis proyectos</p>
          </div>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={0.1}>
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-6">
            {levels.map((level) => {
              const count = techStack.filter((t) => t.level === level).length;
              return (
                <div key={level} className="glass rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold" style={{ color: levelColors[level] }}>{count}</div>
                  <div className="mt-1 text-sm text-gray-400">{level}</div>
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* Categories */}
        {categories.map((cat, ci) => (
          <FadeIn key={cat} delay={0.15 + ci * 0.05}>
            <div className="mt-16">
              <h2 className="mb-8 text-2xl font-bold text-white">{cat}</h2>
              <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {techStack
                  .filter((t) => t.category === cat)
                  .map((tech) => (
                    <StaggerItem key={tech.name}>
                      <HoverScale>
                        <div className="glass rounded-2xl p-5 flex items-center gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/5">
                            <img src={tech.icon} alt={tech.name} className="h-8 w-8" style={{ filter: tech.name === "Next.js" ? "invert(1)" : undefined }} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-white">{tech.name}</div>
                            <div className="mt-1 text-xs font-medium" style={{ color: levelColors[tech.level] }}>
                              {tech.level}
                            </div>
                          </div>
                        </div>
                      </HoverScale>
                    </StaggerItem>
                  ))}
              </StaggerContainer>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
