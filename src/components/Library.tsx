"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { File, Download } from "lucide-react";
import { FadeIn } from "@/components/ui/Animations";

const files = [
  { id: 1, name: "system-777-docs.pdf", size: "2.4 MB", type: "PDF", downloads: "128", category: "Documentación" },
  { id: 2, name: "bot-setup.zip", size: "8.7 MB", type: "ZIP", downloads: "89", category: "Configuración" },
  { id: 3, name: "database-backup.rar", size: "15.3 MB", type: "RAR", downloads: "45", category: "Backups" },
  { id: 4, name: "README.md", size: "128 KB", type: "MD", downloads: "234", category: "Documentación" },
  { id: 5, name: "config.env.example", size: "3.2 KB", type: "TXT", downloads: "312", category: "Configuración" },
  { id: 6, name: "design-system.ai", size: "45.6 MB", type: "AI", downloads: "12", category: "Diseño" },
];

const categories = [
  { name: "Todos", value: "all" },
  { name: "Documentación", value: "docs" },
  { name: "Configuración", value: "config" },
  { name: "Backups", value: "backups" },
  { name: "Diseño", value: "design" },
];

export default function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const stored = localStorage.getItem("libraryCategory");
    if (stored) setSelectedCategory(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("libraryCategory", selectedCategory);
  }, [selectedCategory]);

  const filtered = selectedCategory === "all" ? files : files.filter(f => f.category.toLowerCase().includes(selectedCategory));

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Biblioteca</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">Archivos personales</p>
          </div>
        </FadeIn>

        <div className="mt-8 flex flex-col sm:flex-row gap-2 justify-center">
          {categories.map(c => (
            <button key={c.value} onClick={() => setSelectedCategory(c.value)} className="px-4 py-2 rounded-full text-sm font-medium">
              {c.name}
            </button>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(f => (
            <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: f.id * 0.1 }} className="glass rounded-xl p-6 hover:shadow-lg">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "#00FF88" + "15" }}>
                <File className="h-6 w-6" style={{ color: "#00FF88" }} />
              </div>
              <h3 className="text-lg font-semibold text-white">{f.name}</h3>
              <p className="text-sm text-gray-400 mb-2"><span className="mr-2">{f.size}</span>{f.type}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{f.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">{f.downloads} descargas</span>
                  <Download className="h-4 w-4 text-[#00FF88]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
