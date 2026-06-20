"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Star, BookOpen, Code, Shield, FileText, Package } from "lucide-react";
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem, HoverScale } from "@/components/ui/Animations";

const products = [
  { id: 1, name: "Bootcamp Completo de Python", price: 29.99, category: "Cursos", rating: 4.9, sales: 1250, icon: Code, color: "#3776AB" },
  { id: 2, name: "Kit de Laboratorio de Hacking Ético", price: 49.99, category: "Laboratorios", rating: 4.8, sales: 890, icon: Shield, color: "#00C8FF" },
  { id: 3, name: "Pack de Hojas de Referencia JavaScript", price: 9.99, category: "Plantillas", rating: 4.7, sales: 2100, icon: FileText, color: "#F7DF1E" },
  { id: 4, name: "Colección de Scripts DevOps", price: 19.99, category: "Scripts", rating: 4.8, sales: 650, icon: Code, color: "#339933" },
  { id: 5, name: "Plantillas de Proyectos React", price: 24.99, category: "Plantillas", rating: 4.9, sales: 1800, icon: Code, color: "#61DAFB" },
  { id: 6, name: "Bundle de Ebooks de Ciberseguridad", price: 39.99, category: "Ebooks", rating: 4.7, sales: 950, icon: BookOpen, color: "#00FF88" },
  { id: 7, name: "Referencia de Comandos Linux", price: 14.99, category: "Ebooks", rating: 4.6, sales: 1500, icon: BookOpen, color: "#FCC624" },
  { id: 8, name: "Kit de Inicio para Bots Discord", price: 19.99, category: "Scripts", rating: 4.8, sales: 720, icon: Code, color: "#7C3AED" },
  { id: 9, name: "Guía de Despliegue en Cloud", price: 34.99, category: "Ebooks", rating: 4.9, sales: 430, icon: BookOpen, color: "#FF9900" },
  { id: 10, name: "Plantillas de Esquemas de BD", price: 12.99, category: "Plantillas", rating: 4.5, sales: 870, icon: Package, color: "#FF8C42" },
];

const categories = ["Todos", "Cursos", "Ebooks", "Scripts", "Plantillas", "Laboratorios"];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [cart, setCart] = useState<number[]>([]);
  const filtered = selectedCategory === "Todos" ? products : products.filter((p) => p.category === selectedCategory);
  const toggleCart = (id: number) => setCart((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Tienda Digital</h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">Cursos premium, ebooks, scripts, plantillas y laboratorios virtuales</p>
          </div>
        </FadeIn>

        <FadeInUp delay={0.1}>
          <div className="mt-8 flex items-center justify-center gap-2">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`rounded-full px-4 py-2 text-sm transition-all ${selectedCategory === cat ? "bg-[#00FF88] text-black font-semibold" : "border border-white/10 text-gray-400 hover:text-white"}`}>
                {cat}
              </button>
            ))}
          </div>
        </FadeInUp>

        {cart.length > 0 && (
          <FadeIn>
            <div className="mt-6 glass rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-[#00FF88]" />
                <span className="text-sm text-white">{cart.length} artículo(s) en el carrito</span>
                <span className="text-sm font-bold text-[#00FF88]">${filtered.filter((p) => cart.includes(p.id)).reduce((sum, p) => sum + p.price, 0).toFixed(2)}</span>
              </div>
              <button className="rounded-xl bg-[#00FF88] px-6 py-2 text-sm font-semibold text-black hover:bg-[#00CC6A]">Pagar</button>
            </div>
          </FadeIn>
        )}

        <StaggerContainer className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <StaggerItem key={product.id}>
              <HoverScale>
                <div className="glass rounded-2xl overflow-hidden h-full flex flex-col">
                  <div className="h-40 flex items-center justify-center" style={{ backgroundColor: product.color + "10" }}>
                    <motion.div whileHover={{ rotate: 10, scale: 1.1 }}><product.icon className="h-12 w-12" style={{ color: product.color }} /></motion.div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-xs font-medium text-gray-500 uppercase">{product.category}</div>
                    <h3 className="mt-1 text-lg font-semibold text-white">{product.name}</h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-[#FFD93D] text-[#FFD93D]" /> {product.rating}</span>
                      <span>·</span><span>{product.sales.toLocaleString()} ventas</span>
                    </div>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="text-xl font-bold text-white">${product.price}</span>
                      <button onClick={() => toggleCart(product.id)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${cart.includes(product.id) ? "bg-[#00FF88] text-black" : "border border-[#00FF88]/30 text-[#00FF88] hover:bg-[#00FF88]/10"}`}>
                        {cart.includes(product.id) ? "En Carrito" : "Agregar"}
                      </button>
                    </div>
                  </div>
                </div>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp delay={0.3}>
          <div className="mt-16 glass neon-glow rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white">Obtenlo Todo con Pro</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">Desbloquea todos los cursos premium, recursos y herramientas con una sola suscripción.</p>
            <Link href="/register" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#00FF88] px-8 py-3.5 text-sm font-semibold text-black transition-all hover:bg-[#00CC6A]">
              Ser Pro - $29.99/mes
            </Link>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}
