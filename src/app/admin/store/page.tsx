"use client";

import { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import {
  Plus,
  X,
  Package,
  Edit2,
  Trash2,
  DollarSign,
  Box,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  active: boolean;
  category: string;
  description: string;
}

const initialProducts: Product[] = [
  { id: 1, name: "Camiseta System 777", price: 29.99, stock: 150, active: true, category: "Ropa", description: "Camiseta oficial de la plataforma." },
  { id: 2, name: "Sticker Pack", price: 9.99, stock: 500, active: true, category: "Accesorios", description: "Pack de 5 stickers premium de vinilo." },
  { id: 3, name: "Mousepad Gaming", price: 24.99, stock: 75, active: true, category: "Accesorios", description: "MousepadXL con diseño exclusivo." },
  { id: 4, name: "Hoodie Premium", price: 59.99, stock: 0, active: false, category: "Ropa", description: "Sudadera con capucha de alta calidad." },
  { id: 5, name: "Taza System 777", price: 14.99, stock: 200, active: true, category: "Accesorios", description: "Taza de cerámica con logo." },
  { id: 6, name: "Libreta de Código", price: 12.99, stock: 300, active: true, category: "Papelería", description: "Libreta con templates para planificar código." },
];

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "Accesorios",
    price: 0,
    stock: 0,
  });

  const toggleActive = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const addProduct = () => {
    if (!newProduct.name) return;
    setProducts((prev) => [
      ...prev,
      { ...newProduct, id: Date.now(), active: true },
    ]);
    setNewProduct({ name: "", description: "", category: "Accesorios", price: 0, stock: 0 });
    setShowModal(false);
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin" className="mb-2 inline-block text-sm text-[#00FF88] hover:underline">
            &larr; Volver al Panel
          </Link>
          <h1 className="text-2xl font-bold text-white">Gestión de Tienda</h1>
          <p className="mt-1 text-sm text-gray-400">{products.length} productos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[#00FF88] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#00FF88]/90"
        >
          <Plus className="h-4 w-4" />
          Agregar Producto
        </button>
      </div>

      <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 sm:grid-cols-3">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00FF88]/10">
              <Package className="h-5 w-5 text-[#00FF88]" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{products.length}</div>
              <div className="text-xs text-gray-500">Productos</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00C8FF]/10">
              <Box className="h-5 w-5 text-[#00C8FF]" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                {products.reduce((sum, p) => sum + p.stock, 0)}
              </div>
              <div className="text-xs text-gray-500">Stock Total</div>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10">
              <DollarSign className="h-5 w-5 text-[#7C3AED]" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">
                ${products.filter((p) => p.active).reduce((sum, p) => sum + p.price, 0).toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">Valor del Catálogo</div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs text-gray-500 uppercase">
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4 hidden md:table-cell">Categoría</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4 hidden sm:table-cell">Stock</th>
                <th className="px-6 py-4 hidden sm:table-cell">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                        <Package className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-white">{product.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-400">{product.category}</td>
                  <td className="px-6 py-4 font-semibold text-[#00FF88]">${product.price}</td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`text-sm ${product.stock === 0 ? "text-red-400" : product.stock < 50 ? "text-[#FFD93D]" : "text-gray-300"}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <button onClick={() => toggleActive(product.id)}>
                      {product.active ? (
                        <ToggleRight className="h-6 w-6 text-[#00FF88]" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-gray-500" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Agregar Producto</h2>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-gray-400 hover:bg-white/5">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-gray-400">Nombre</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50"
                  placeholder="Nombre del producto"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Descripción</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50"
                  placeholder="Descripción del producto"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Categoría</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50"
                >
                  <option>Accesorios</option>
                  <option>Ropa</option>
                  <option>Papelería</option>
                  <option>Digital</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Precio ($)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5">
                  Cancelar
                </button>
                <button onClick={addProduct} className="flex-1 rounded-xl bg-[#00FF88] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#00FF88]/90">
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
