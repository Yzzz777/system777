"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/Animations";

const projects = [
  { id: 1, name: "System 777 Bot", desc: "Bot Discord", color: "#5865F2", github: "https://github.com/Yzzz777/system-777", web: "https://jrsystem7777.com", stats: "21 servidores, 4622 usuarios" },
  { id: 2, name: "Dashboard", desc: "Panel web", color: "#7C3AED", github: "https://github.com/Yzzz777/system777", web: "https://12e022de.system777.pages.dev", stats: "24/7" },
  { id: 3, name: "Web Personal", desc: "Sitio personal", color: "#EB459E", github: "https://github.com/Yzzz777/system777", web: "https://jrsystem7777.com", stats: "10,000+ visitas" },
];

const categories = [
  { name: "Todos", value: "all" },
  { name: "Bots", value: "bots" },
  { name: "Web", value: "web" },
];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const stored = localStorage.getItem("projectsCategory");
    if (stored) setSelectedCategory(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("projectsCategory", selectedCategory);
  }, [selectedCategory]);

  const filtered = selectedCategory === "all" ? projects : projects.filter(p => p.name.toLowerCase().includes(selectedCategory));

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Proyectos</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">Mis proyectos</p>
          </div>
        </FadeIn>

        <div className="mt-8 flex flex-col sm:flex-row gap-2 justify-center">
          {categories.map(c => {
            const isSelected = selectedCategory === c.value;
            const btnClass = "px-4 py-2 rounded-full text-sm font-medium " + (isSelected ? "bg-[#00FF88] text-black" : "border border-white/10 text-white hover:bg-white/5");
            return React.createElement("button", { key: c.value, onClick: () => setSelectedCategory(c.value), className: btnClass }, c.name);
          })}
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: p.id * 0.1 }} className="glass rounded-2xl p-6 hover:shadow-lg">
              <div className="h-48 rounded-xl mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent transition-transform duration-300" style={{ background: `linear-gradient(to bottom, ${p.color}20, transparent)` }} />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{p.desc}</p>
                  <div className="mt-3 flex gap-2">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-white/5 rounded px-2 py-0.5">{p.stats}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">Servers</div>
                  <div className="text-sm text-gray-400">Active</div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <a href={p.github} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-xl py-2 bg-white/10 text-white text-sm hover:bg-white/5 transition text-center">GitHub</a>
                <a href={p.web} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-xl py-2 bg-white/10 text-white text-sm hover:bg-white/5 transition text-center">Web</a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
