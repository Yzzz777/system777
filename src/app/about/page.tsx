"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Code, Users, Globe, Target, Heart, ArrowRight, Award, Zap } from "lucide-react";
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem, HoverScale } from "@/components/ui/Animations";

const values = [
  { icon: Target, title: "Misión", desc: "Empoderar a la próxima generación de desarrolladores y profesionales de ciberseguridad en todo el mundo.", color: "#00FF88" },
  { icon: Heart, title: "Comunidad", desc: "Construir una comunidad de apoyo donde los estudiantes se ayudan mutuamente a crecer y tener éxito.", color: "#FF6B6B" },
  { icon: Zap, title: "Aprendizaje Práctico", desc: "Proyectos del mundo real, laboratorios prácticos y habilidades relevantes para la industria desde el primer día.", color: "#FFD93D" },
  { icon: Shield, title: "Seguridad", desc: "Enseñar las mejores prácticas de seguridad desde la primera línea de código.", color: "#00C8FF" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00FF88]/5 via-transparent to-transparent" />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-[#00FF88]/5 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <FadeIn>
            <h1 className="text-4xl font-bold text-white sm:text-6xl">Sobre SYSTEM 777</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">Nuestra misión es hacer que la educación tecnológica profesional sea accesible, práctica y orientada a la comunidad.</p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4">
          <FadeInUp>
            <div className="glass rounded-3xl p-12">
              <h2 className="text-3xl font-bold text-white">Nuestra Historia</h2>
              <div className="mt-6 space-y-4 text-gray-400 leading-relaxed">
                <p>SYSTEM 777 nació de una idea simple: todos merecen acceso a educación tecnológica de clase mundial, sin importar su presupuesto. Fundada en 2022, empezamos como una pequeña comunidad de Discord de desarrolladores y entusiastas de la seguridad.</p>
                <p>Hoy, SYSTEM 777 se ha convertido en una academia tecnológica integral que sirve a más de 10,000 estudiantes en más de 50 países. Ofrecemos cursos en programación, ciberseguridad, administración de Linux, desarrollo Discord, cloud computing y más.</p>
                <p>¿Qué nos hace diferentes? Nos enfocamos en el aprendizaje práctico y hands-on. Cada curso incluye proyectos del mundo real, laboratorios interactivos y una comunidad de apoyo.</p>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-transparent via-[#00FF88]/[0.02] to-transparent">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn><div className="text-center"><h2 className="text-3xl font-bold text-white sm:text-4xl">Nuestros Valores</h2><p className="mx-auto mt-4 max-w-2xl text-gray-400">Los principios que guían todo lo que hacemos</p></div></FadeIn>
          <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <HoverScale>
                  <div className="glass rounded-2xl p-6 text-center h-full">
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: v.color + "15" }}>
                      <v.icon className="h-7 w-7" style={{ color: v.color }} />
                    </motion.div>
                    <h3 className="mt-4 text-lg font-semibold text-white">{v.title}</h3>
                    <p className="mt-2 text-sm text-gray-400">{v.desc}</p>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[{ value: "10,000+", label: "Estudiantes en el Mundo", icon: Users }, { value: "250+", label: "Cursos con Expertos", icon: Code }, { value: "50+", label: "Países Alcanzados", icon: Globe }, { value: "95%", label: "Satisfacción Estudiantil", icon: Award }].map((s) => (
              <StaggerItem key={s.label}>
                <HoverScale>
                  <div className="glass rounded-2xl p-6 text-center">
                    <s.icon className="mx-auto h-8 w-8 text-[#00FF88]" />
                    <div className="mt-3 text-3xl font-bold text-white">{s.value}</div>
                    <div className="text-sm text-gray-500">{s.label}</div>
                  </div>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4">
          <FadeInUp>
            <div className="glass neon-glow rounded-3xl p-12 text-center">
              <h2 className="text-3xl font-bold text-white">Únete a Nuestra Comunidad</h2>
              <p className="mx-auto mt-4 max-w-xl text-gray-400">Forma parte de una comunidad global de desarrolladores, profesionales de seguridad y entusiastas de la tecnología.</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/register" className="group flex items-center gap-2 rounded-xl bg-[#00FF88] px-8 py-3.5 text-sm font-semibold text-black transition-all hover:bg-[#00CC6A]">Empezar Gratis <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                <Link href="/community" className="rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/5">Unirse a la Comunidad</Link>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
}
