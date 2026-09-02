"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Code, Terminal, Layers, Cloud, Database, MessageSquare, Rocket, Lock, Target, Fingerprint } from "lucide-react";
import { FadeIn } from "@/components/ui/Animations";

const cyberAreas = [
  { id: 1, icon: Shield, name: "Seguridad Web", color: "#00C8FF", description: "Testing de penetración, auditorías, vulnerabilidades web" },
  { id: 2, icon: Code, name: "Análisis de Vulnerabilities", color: "#00C8FF", description: "Finding and exploiting security weaknesses" },
  { id: 3, icon: Terminal, name: "Forensics", color: "#7C3AED", description: "Investigación digital y análisis de evidencia" },
  { id: 4, icon: Layers, name: "SOC Operations", color: "#FFD93D", description: "Monitorización y operaciones Red/Blue team" },
  { id: 5, icon: Database, name: "Análisis SOC", color: "#FF8C42", description: "Gestión de incidentes y alertas de seguridad" },
  { id: 6, icon: Cloud, name: "Seguridad APIs", color: "#FF9900", description: "Testing y hardening de APIs REST/GraphQL" },
  { id: 7, icon: MessageSquare, name: "Autenticación", color: "#FF6B6B", description: "OAuth, JWT, MFA y sistemas de login" },
  { id: 8, icon: Rocket, name: "Hardening", color: "#EB459E", description: "Secure configuration de servidores y apps" },
  { id: 9, icon: Lock, name: "Redes Seguras", color: "#7C3AED", description: "Seguridad de infraestructura de red" },
  { id: 10, icon: Target, name: "OSINT Defensivo", color: "#FEE75C", description: "Inteligencia abierta para defensa" },
  { id: 11, icon: Fingerprint, name: "Automatización", color: "#FCC624", description: "Scripts y herramientas de seguridad" },
];

const categories = [
  { name: "Todas", value: "all" },
  { name: "Redes", value: "networks" },
  { name: "Aplicaciones", value: "apps" },
  { name: "Cryptography", value: "crypto" },
  { name: "Forensics", value: "forensics" },
  { name: "Governance", value: "governance" },
];

export default function CybersecurityPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const stored = localStorage.getItem("cyberCategory");
    if (stored) {
      setSelectedCategory(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cyberCategory", selectedCategory);
  }, [selectedCategory]);

  const filteredAreas = selectedCategory === "all"
    ? cyberAreas
    : cyberAreas.filter((a) => a.name.toLowerCase().includes(selectedCategory));

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ciberseguridad</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              Áreas de conocimiento e interés en seguridad informática
            </p>
          </div>
        </FadeIn>

        <div className="mt-8 flex flex-col sm:flex-row gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.value
                  ? "bg-[#00FF88] text-black"
                  : "border border-white/10 text-white hover:bg-white/5"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAreas.map((area) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: area.id * 0.08 }}
              className="glass rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl mb-4"
                style={{ backgroundColor: area.color + "15" }}
              >
                <area.icon className="h-5 w-5" style={{ color: area.color }} />
              </div>
              <h3 className="text-lg font-semibold text-white">{area.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{area.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}