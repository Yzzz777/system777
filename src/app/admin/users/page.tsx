"use client";

import { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import {
  Search,
  Ban,
  Trash2,
  ChevronDown,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
}

const initialUsers: User[] = [
  { id: 1, name: "María García", email: "maria@ejemplo.com", role: "Estudiante", status: "Activo", joined: "2024-01-15" },
  { id: 2, name: "Alex Chen", email: "alex@ejemplo.com", role: "Instructor", status: "Activo", joined: "2024-02-20" },
  { id: 3, name: "Sarah Wilson", email: "sarah@ejemplo.com", role: "Estudiante", status: "Baneado", joined: "2024-03-10" },
  { id: 4, name: "Carlos Ruiz", email: "carlos@ejemplo.com", role: "Admin", status: "Activo", joined: "2024-01-05" },
  { id: 5, name: "Ana López", email: "ana@ejemplo.com", role: "Estudiante", status: "Activo", joined: "2024-04-12" },
  { id: 6, name: "David Park", email: "david@ejemplo.com", role: "Instructor", status: "Inactivo", joined: "2024-02-28" },
  { id: 7, name: "Laura Martínez", email: "laura@ejemplo.com", role: "Estudiante", status: "Activo", joined: "2024-05-01" },
  { id: 8, name: "Pedro Sánchez", email: "pedro@ejemplo.com", role: "Estudiante", status: "Baneado", joined: "2024-03-22" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [editingId, setEditingId] = useState<number | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "Todos" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleBan = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Baneado" ? "Activo" : "Baneado" }
          : u
      )
    );
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const changeRole = (id: number, role: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    setEditingId(null);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin" className="mb-2 inline-block text-sm text-[#00FF88] hover:underline">
            &larr; Volver al Panel
          </Link>
          <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
          <p className="mt-1 text-sm text-gray-400">{users.length} usuarios registrados</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50"
        >
          <option value="Todos">Todos los Roles</option>
          <option value="Estudiante">Estudiante</option>
          <option value="Instructor">Instructor</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs text-gray-500 uppercase">
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4 hidden md:table-cell">Rol</th>
                <th className="px-6 py-4 hidden sm:table-cell">Estado</th>
                <th className="px-6 py-4 hidden lg:table-cell">Registro</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00FF88]/10 text-xs font-bold text-[#00FF88]">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="relative">
                      <button
                        onClick={() => setEditingId(editingId === user.id ? null : user.id)}
                        className="flex items-center gap-1 rounded-lg bg-white/5 px-3 py-1 text-xs text-gray-300 hover:bg-white/10"
                      >
                        {user.role}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      {editingId === user.id && (
                        <div className="absolute left-0 top-8 z-10 w-36 rounded-xl border border-white/10 bg-[#111] py-1 shadow-xl">
                          {["Estudiante", "Instructor", "Admin"].map((r) => (
                            <button
                              key={r}
                              onClick={() => changeRole(user.id, r)}
                              className="block w-full px-4 py-2 text-left text-xs text-gray-300 hover:bg-white/5 hover:text-white"
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.status === "Activo"
                          ? "bg-[#00FF88]/10 text-[#00FF88]"
                          : user.status === "Baneado"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 hidden lg:table-cell">{user.joined}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleBan(user.id)}
                        className={`rounded-lg p-2 transition-colors ${
                          user.status === "Baneado"
                            ? "text-[#00FF88] hover:bg-[#00FF88]/10"
                            : "text-red-400 hover:bg-red-500/10"
                        }`}
                        title={user.status === "Baneado" ? "Desbanear" : "Banear"}
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                        title="Eliminar"
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
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            No se encontraron usuarios.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
