"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FolderOpen, Calendar, Shield, Star, BookOpen, Users, Clock } from "lucide-react";
import { FadeIn, FadeInUp } from "@/components/ui/Animations";

const blogPosts = [
  {
    id: 1,
    title: "Next.js 15 nuevas características",
    slug: "nextjs-15-new-features",
    category: "Framework",
    author: "Ángel",
    date: "2024-01-15",
    reads: "1.2k",
    likes: 45,
    image: "/blog/nextjs-15-new-features/cover.jpg",
    content: "Resumen de las nuevas funcionalidades en Next.js 15",
  },
  {
    id: 2,
    title: "Roadmap ético hacking 2025",
    slug: "ethical-hacking-roadmap",
    category: "Ciberseguridad",
    author: "Ángel",
    date: "2024-02-10",
    reads: "890",
    likes: 32,
    image: "/blog/ethical-hacking-roadmap/cover.jpg",
    content: "Guía completa para iniciar en hacking ético",
  },
  {
    id: 3,
    title: "Ciberseguridad mejores prácticas 2025",
    slug: "cybersecurity-best-practices-2025",
    category: "Ciberseguridad",
    author: "Ángel",
    date: "2024-03-05",
    reads: "1.5k",
    likes: 58,
    image: "/blog/cybersecurity-best-practices-2025/cover.jpg",
    content: "Las mejores prácticas de ciberseguridad para este año",
  },
  {
    id: 4,
    title: "Docker para beginners",
    slug: "docker-for-beginners",
    category: "DevOps",
    author: "Ángel",
    date: "2024-04-20",
    reads: "670",
    likes: 23,
    image: "/blog/docker-for-beginners/cover.jpg",
    content: "Guía paso a paso para comenzar con Docker",
  },
];

const categories = [
  { name: "Todas", value: "all" },
  { name: "Ciberseguridad", value: "cybersecurity" },
  { name: "Framework", value: "framework" },
  { name: "DevOps", value: "devops" },
  { name: "Tutoriales", value: "tutorials" },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const stored = localStorage.getItem("blogCategory");
    if (stored) {
      setSelectedCategory(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("blogCategory", selectedCategory);
  }, [selectedCategory]);

  const filteredPosts = selectedCategory === "all"
    ? blogPosts
    : blogPosts.filter((p) => p.category.toLowerCase().includes(selectedCategory));

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Blog / Boletín</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              Noticias, actualizaciones y tutoriales técnicos
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

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: post.id * 0.1 }}
              className="glass rounded-2xl p-6 hover:shadow-lg transition-shadow border-0"
            >
              <div className="h-48 rounded-t-xl overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-transform duration-300"
                />
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              </div>
              <div className="p-6">
                <span className="text-xs text-gray-400 uppercase tracking-wider mb-2">{post.category}</span>
                <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                  <span>{post.reads} Lecturas</span>
                </div>
                <p className="mt-4 text-gray-300 line-clamp-3">
                  {post.content}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-500" />
                    <span>{post.likes} Me gusta</span>
                  </div>
                  <a
                    href={`/blog/${post.slug}`}
                    className="text-[#00FF88] hover:underline"
                  >
                    Leer más
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}