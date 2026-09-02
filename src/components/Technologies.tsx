"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code, Shield, Terminal, Layers, Server, Database, Cloud, MessageSquare, Rocket } from "lucide-react";
import { FadeIn } from "@/components/ui/Animations";

const features = [
  { icon: Code, title: "Programaci" + String.fromCharCode(138) + "n", desc: "HTML, CSS, JS, React, Next.js, Python, Java y m" + String.fromCharCode(138) + "s de 20 lenguajes y frameworks.", color: "#00FF88" },
  { icon: Shield, title: "Ciberseguridad", desc: "Hacking ltico, pruebas de penetracion, forensics, an" + String.fromCharCode(138) + "lisis SOC y operaciones Red/Blue.", color: "#00C8FF" },
  { icon: Terminal, title: "Linux y DevOps", desc: "Administraci" + String.fromCharCode(138) + "n de Linux, gesti" + String.fromCharCode(138) + "n de servidores, Docker, Kubernetes, CI/CD.", color: "#7C3AED" },
  { icon: MessageSquare, title: "Desarrollo Discord", desc: "Crea bots con Discord.js/Py, tickets, verificaci" + String.fromCharCode(138) + "n, economa y sistemas de m" + String.fromCharCode(138) + "sica.", color: "#FF6B6B" },
  { icon: Cloud, title: "Cloud Computing", desc: "AWS, Azure, GCP, Cloudflare,arquitecturas serverless y despliegue en la nube.", color: "#FFD93D" },
  { icon: Database, title: "Bases de Datos", desc: "PostgreSQL, MySQL, MongoDB, Redis, dise" + String.fromCharCode(138) + "n, optimizaci" + String.fromCharCode(138) + "n y escalabilidad.", color: "#FF8C42" },
];

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

  useEffect(function () {
    var stored = localStorage.getItem("techCategories");
    if (stored) {
      var parsed = JSON.parse(stored);
      setTechList(parsed.techList);
      setSelectedCategory(parsed.category);
    }
  }, []);

  useEffect(function () {
    localStorage.setItem("techCategories", JSON.stringify({ techList: techList, category: selectedCategory }));
  }, [techList, selectedCategory]);

  var filteredTech = selectedCategory
    ? techList.filter(function (t) { return t.category === selectedCategory; })
    : techList;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Programaci" + String.fromCharCode(138) + "n</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              Tecnolog" + String.fromCharCode(138) + " que estudio y conozco
            </p>
          </div>
        </FadeIn>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {categories.map(function (cat) {
            var _className = "px-4 py-2 rounded-full text-sm font-medium transition-all ";
            var _classExtra = selectedCategory === cat.name
              ? "bg-[#00FF88] text-black"
              : "border border-white/10 text-white hover:bg-white/5";
            return React.createElement("button", { key: cat.name, onClick: function () { setSelectedCategory(cat.name); }, className: _className + _classExtra }, cat.name);
          })}
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTech.map(function (t) {
            return React.createElement("div", { key: t.id, className: "glass rounded-xl p-6 hover:shadow-lg transition-shadow" },
              React.createElement("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl mb-4", style: { backgroundColor: t.color + "15" } },
                React.createElement(t.icon, { className: "h-5 w-5", style: { color: t.color } })
              ),
              React.createElement("h3", { className: "text-lg font-semibold text-white" }, t.name),
              React.createElement("p", { className: "text-sm text-gray-400 mt-1" }, t.category)
            );
          })}
        </div>
      </div>
    </section>
  );
}