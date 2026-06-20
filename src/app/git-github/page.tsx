"use client";

import Link from "next/link";
import { GitBranch, GitPullRequest, GitMerge, Code, BookOpen } from "lucide-react";
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem } from "@/components/ui/Animations";

const sections = [
  { title: "¿Qué es Git?", content: "Git es un sistema de control de versiones distribuido que rastrea cambios en el código fuente durante el desarrollo de software. Permite que múltiples desarrolladores trabajen en el mismo proyecto simultáneamente sin conflictos.", icon: GitBranch },
  { title: "¿Qué es GitHub?", content: "GitHub es una plataforma basada en la nube para control de versiones y colaboración. Proporciona una interfaz web para repositorios Git, facilitando compartir código, revisar cambios y gestionar proyectos.", icon: Code },
  { title: "Pull Requests", content: "Los Pull Requests son una forma de proponer cambios a un repositorio. Permiten revisión de código, discusión y pruebas antes de fusionar los cambios en la rama principal.", icon: GitPullRequest },
  { title: "Ramas y Merge", content: "Las ramas permiten trabajar en funcionalidades de forma independiente. Merge combina cambios de diferentes ramas. Git Flow proporciona un enfoque estructurado para las estrategias de ramificación.", icon: GitMerge },
];

const commands = [
  { cmd: "git init", desc: "Inicializar un nuevo repositorio" },
  { cmd: "git clone <url>", desc: "Clonar un repositorio remoto" },
  { cmd: "git add .", desc: "Preparar todos los cambios" },
  { cmd: 'git commit -m "mensaje"', desc: "Confirmar cambios preparados" },
  { cmd: "git push origin main", desc: "Subir al remoto" },
  { cmd: "git pull", desc: "Obtener últimos cambios" },
  { cmd: "git branch <nombre>", desc: "Crear una nueva rama" },
  { cmd: "git checkout <rama>", desc: "Cambiar a una rama" },
  { cmd: "git merge <rama>", desc: "Fusionar una rama" },
  { cmd: "git log --oneline", desc: "Ver historial de confirmaciones" },
  { cmd: "git stash", desc: "Almacenar cambios temporalmente" },
  { cmd: "git reset HEAD~1", desc: "Deshacer última confirmación" },
];

export default function GitGitHubPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4">
        <FadeIn>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00FF88]/10"><GitBranch className="h-6 w-6 text-[#00FF88]" /></div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Hub de Git y GitHub</h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">Guía completa de control de versiones con Git y colaboración con GitHub</p>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-16 space-y-8">
          {sections.map((s) => (
            <StaggerItem key={s.title}>
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00FF88]/10"><s.icon className="h-6 w-6 text-[#00FF88]" /></div>
                  <h2 className="text-2xl font-bold text-white">{s.title}</h2>
                </div>
                <p className="mt-4 text-gray-400 leading-relaxed">{s.content}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp delay={0.2}>
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Comandos Esenciales</h2>
            <div className="glass rounded-2xl overflow-hidden">
              <div className="divide-y divide-white/5">
                {commands.map((c) => (
                  <div key={c.cmd} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5">
                    <code className="shrink-0 rounded-lg bg-[#00FF88]/10 px-3 py-1.5 text-sm font-mono text-[#00FF88]">{c.cmd}</code>
                    <span className="text-sm text-gray-400">{c.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.3}>
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Flujo de Trabajo Git Flow</h2>
            <div className="glass rounded-2xl p-8">
              <div className="space-y-4">
                {[
                  { step: 1, title: "Crear Rama de Funcionalidad", desc: "git checkout -b feature/mi-funcionalidad" },
                  { step: 2, title: "Trabajar y Confirmar", desc: "Hacer cambios, preparar y confirmar regularmente" },
                  { step: 3, title: "Subir y Crear PR", desc: "Subir rama y crear un Pull Request" },
                  { step: 4, title: "Revisión de Código", desc: "El equipo revisa, discute y aprueba los cambios" },
                  { step: 5, title: "Fusionar a Develop", desc: "Hacer squash o merge del PR en la rama develop" },
                  { step: 6, title: "Desplegar a Producción", desc: "Fusionar develop en main para el release" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00FF88] text-sm font-bold text-black">{s.step}</div>
                    <div><h3 className="font-semibold text-white">{s.title}</h3><p className="text-sm text-gray-400">{s.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.4}>
          <div className="mt-16 glass neon-glow rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white">¿Listo para Dominar Git?</h2>
            <p className="mt-2 text-gray-400">Toma nuestro curso completo de Git y GitHub para convertirte en experto en control de versiones.</p>
            <Link href="/course/git-github-complete" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#00FF88] px-8 py-3 text-sm font-semibold text-black hover:bg-[#00CC6A]">
              <BookOpen className="h-4 w-4" /> Empezar Curso
            </Link>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}
