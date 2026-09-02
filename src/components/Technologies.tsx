"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code, Shield, Terminal, Layers, Server, Database, Cloud, MessageSquare, Rocket } from "lucide-react";
import { FadeIn } from "@/components/ui/Animations";

const techData = [
  { id: 1, icon: Code, name: "JavaScript", color: "#F7DF1E", category: "Lenguajes" },
  { id: 2, icon: Shield, name: "Ciberseguridad", color: "#00C8FF", category: "Cybersecurity" },
  { id: 3, icon: Terminal, name: "Linux", color: "#FCC624", category: "DevOps" },
  { id: 4, icon: Layers, name: "React", color: "#61DAFB", category: "Frontend" },
  { id: 5, icon: Server, name: "Node.js", color: "#339933", category: "Backend" },
  { id: 6, icon: Database, name: "SQL", color: "#FF8C42", category: "Bases de datos" },
  { id: 7, icon: Cloud, name: "AWS", color: "#FF9900", category: "DevOps" },
  { id: 8, icon: MessageSquare, name: "Discord.js", color: "#7C3AED", category: "Tools" },
  { id: 9, icon: Rocket, name: "Next.js", color: "#FFFFFF", category: "Frontend" },
];

const categories = [
  { name: "Lenguajes", color: "#00FF88" },
  { name: "Frontend", color: "#61DAFB" },
  { name: "Backend", color: "#339933" },
  { name: "Bases de datos", color: "#FF8C42" },
  { name: "DevOps", color: "#FF9900" },
  { name: "Cybersecurity", color: "#00C8FF" },
  { name: "Tools", color: "#7C3AED" },
];

export default function TechnologiesPage() {
  const [techList, setTechList] = useState(techData);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("techCategories");
    if (stored) {
      const parsed = JSON.parse(stored);
      setTechList(parsed.techList);
      setSelectedCategory(parsed.category);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("techCategories", JSON.stringify({ techList: techList, category: selectedCategory }));
  }, [techList, selectedCategory]);

  const filteredTech = selectedCategory
    ? techList.filter(t => t.category === selectedCategory)
    : techList;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Programaci&oacute;n</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              Tecnolog&iacute;as que estudio y conozco
            </p>
          </div>
        </FadeIn>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {categories.map(cat => {
            const className = "px-4 py-2 rounded-full text-sm font-medium transition-all " + (selectedCategory === cat.name ? "bg-[#00FF88] text-black" : "border border-white/10 text-white hover:bg-white/5");
            return (
              <button key={cat.name} onClick={() => setSelectedCategory(cat.name)} className={className}>
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTech.map(t => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: t.id * 0.1 }} className="glass rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-4" style={{ backgroundColor: t.color + "15" }}>
                <t.icon className="h-5 w-5" style={{ color: t.color }} />
              </div>
              <h3 className="text-lg font-semibold text-white">{t.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{t.category}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
