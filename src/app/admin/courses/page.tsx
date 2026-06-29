"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  Plus,
  X,
  Search,
  Trash2,
  Pencil,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  lessons: number;
  price: number;
  isPremium: boolean;
}

const CATEGORIES = [
  "Todos",
  "Programación",
  "Desarrollo Web",
  "Frontend",
  "Backend",
  "Full Stack",
  "Ciberseguridad",
  "Linux",
  "Discord",
  "Cloud",
  "DevOps",
  "Bases de Datos",
];

const LEVELS = ["Principiante", "Intermedio", "Avanzado", "Experto"];

const defaultCourses: Course[] = [
  { id: "1", slug: "html-fundamentals", title: "Fundamentos de HTML", description: "Aprende los fundamentos de HTML para crear páginas web.", category: "Programación", level: "Principiante", lessons: 12, price: 0, isPremium: false },
  { id: "2", slug: "css-masterclass", title: "Masterclass de CSS", description: "Domina CSS con técnicas modernas de diseño.", category: "Desarrollo Web", level: "Principiante", lessons: 18, price: 0, isPremium: false },
  { id: "3", slug: "javascript-complete", title: "Guía Completa de JavaScript", description: "Aprende JavaScript desde cero hasta nivel avanzado.", category: "Programación", level: "Intermedio", lessons: 35, price: 0, isPremium: false },
  { id: "4", slug: "react-complete", title: "Curso Completo de React", description: "Desarrolla aplicaciones modernas con React.", category: "Frontend", level: "Intermedio", lessons: 42, price: 29.99, isPremium: true },
  { id: "5", slug: "nextjs-mastery", title: "Dominio de Next.js", description: "Domina Next.js para aplicaciones full stack.", category: "Full Stack", level: "Avanzado", lessons: 48, price: 39.99, isPremium: true },
  { id: "6", slug: "python-complete", title: "Curso Completo de Python", description: "Aprende Python desde cero con proyectos prácticos.", category: "Programación", level: "Principiante", lessons: 28, price: 0, isPremium: false },
  { id: "7", slug: "ethical-hacking", title: "Hacking Ético Completo", description: "Conviértete en un hacker ético profesional.", category: "Ciberseguridad", level: "Intermedio", lessons: 55, price: 49.99, isPremium: true },
  { id: "8", slug: "linux-admin", title: "Administración de Linux", description: "Administra servidores Linux como un profesional.", category: "Linux", level: "Principiante", lessons: 20, price: 0, isPremium: false },
  { id: "9", slug: "discord-js-bot", title: "Desarrollo de Bots con Discord.js", description: "Crea bots potentes para Discord con Discord.js.", category: "Discord", level: "Intermedio", lessons: 25, price: 19.99, isPremium: true },
  { id: "10", slug: "nodejs-backend", title: "Desarrollo Backend con Node.js", description: "Construye APIs y servicios backend robustos.", category: "Backend", level: "Intermedio", lessons: 32, price: 29.99, isPremium: true },
  { id: "11", slug: "postgresql-database", title: "PostgreSQL Completo", description: "Domina PostgreSQL y bases de datos relacionales.", category: "Bases de Datos", level: "Intermedio", lessons: 22, price: 0, isPremium: false },
  { id: "12", slug: "kubernetes-docker", title: "Docker y Kubernetes", description: "Containerización y orquestación moderna.", category: "DevOps", level: "Avanzado", lessons: 30, price: 39.99, isPremium: true },
  { id: "13", slug: "penetration-testing", title: "Pruebas de Penetración", description: "Realiza pentesting profesional de sistemas.", category: "Ciberseguridad", level: "Avanzado", lessons: 45, price: 59.99, isPremium: true },
  { id: "14", slug: "network-security", title: "Seguridad de Redes", description: "Protege redes contra amenazas cibernéticas.", category: "Ciberseguridad", level: "Intermedio", lessons: 26, price: 29.99, isPremium: true },
  { id: "15", slug: "react-native-mobile", title: "Desarrollo Móvil con React Native", description: "Crea apps móviles multiplataforma.", category: "Frontend", level: "Intermedio", lessons: 38, price: 34.99, isPremium: true },
  { id: "16", slug: "python-django", title: "Python Django Full Stack", description: "Desarrolla aplicaciones web completas con Django.", category: "Backend", level: "Intermedio", lessons: 40, price: 34.99, isPremium: true },
  { id: "17", slug: "cloud-aws", title: "Cloud Computing con AWS", description: "Domina los servicios de Amazon Web Services.", category: "Cloud", level: "Intermedio", lessons: 34, price: 39.99, isPremium: true },
  { id: "18", slug: "malware-analysis", title: "Análisis de Malware", description: "Analiza y desarma malware profesionalmente.", category: "Ciberseguridad", level: "Experto", lessons: 40, price: 69.99, isPremium: true },
  { id: "19", slug: "git-github-complete", title: "Git y GitHub Completo", description: "Domina el control de versiones con Git y GitHub.", category: "Programación", level: "Principiante", lessons: 15, price: 0, isPremium: false },
  { id: "20", slug: "typescript-complete", title: "TypeScript Completo", description: "Aprende TypeScript para código más robusto.", category: "Programación", level: "Intermedio", lessons: 22, price: 0, isPremium: false },
];

const emptyForm: Omit<Course, "id" | "slug"> = {
  title: "",
  description: "",
  category: "Programación",
  level: "Principiante",
  lessons: 10,
  price: 0,
  isPremium: false,
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin_courses");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCourses(parsed);
          return;
        }
      }
    } catch {}
    setCourses(defaultCourses);
  }, []);

  const save = useCallback((list: Course[]) => {
    localStorage.setItem("admin_courses", JSON.stringify(list));
    setCourses(list);
  }, []);

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "Todos" || c.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (course: Course) => {
    setEditingId(course.id);
    setForm({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      lessons: course.lessons,
      price: course.price,
      isPremium: course.isPremium,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editingId) {
      save(
        courses.map((c) =>
          c.id === editingId ? { ...c, ...form } : c
        )
      );
    } else {
      const slug = form.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const newCourse: Course = {
        id: Date.now().toString(),
        slug,
        ...form,
      };
      save([...courses, newCourse]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    save(courses.filter((c) => c.id !== id));
    setConfirmDelete(null);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Cursos</h1>
          <p className="mt-1 text-sm text-gray-400">{courses.length} cursos en total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-[#00FF88] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#00FF88]/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Crear Curso
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50 transition-colors"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50 transition-colors"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-[#121212]">
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-2xl py-20">
          <BookOpen className="h-12 w-12 text-gray-600" />
          <p className="mt-4 text-gray-400">No se encontraron cursos</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="glass rounded-2xl p-5 flex flex-col"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00FF88]/10">
                  <BookOpen className="h-5 w-5 text-[#00FF88]" />
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    course.isPremium
                      ? "bg-[#7C3AED]/10 text-[#7C3AED]"
                      : "bg-[#00FF88]/10 text-[#00FF88]"
                  }`}
                >
                  {course.isPremium ? "Premium" : "Gratis"}
                </span>
              </div>

              <h3 className="mt-3 font-semibold text-white line-clamp-1">
                {course.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                {course.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-gray-400">
                  {course.category}
                </span>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-gray-400">
                  {course.level}
                </span>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-gray-400">
                  {course.lessons} lecciones
                </span>
              </div>

              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-[#00FF88]">
                  {course.price === 0 ? "Gratis" : `$${course.price}`}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(course)}
                    className="rounded-lg p-2 text-[#00C8FF] hover:bg-[#00C8FF]/10 transition-colors"
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(course.id)}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Editar Curso" : "Crear Curso"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs text-gray-400">Título *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50 transition-colors"
                  placeholder="Nombre del curso"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-400">
                  Descripción
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50 transition-colors"
                  placeholder="Descripción del curso"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-gray-400">
                    Categoría
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50 transition-colors"
                  >
                    {CATEGORIES.filter((c) => c !== "Todos").map((c) => (
                      <option key={c} value={c} className="bg-[#121212]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-400">
                    Nivel
                  </label>
                  <select
                    value={form.level}
                    onChange={(e) =>
                      setForm({ ...form, level: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50 transition-colors"
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l} className="bg-[#121212]">
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-gray-400">
                    Lecciones
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.lessons}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        lessons: Math.max(1, Number(e.target.value)),
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-400">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">Premium</p>
                  <p className="text-xs text-gray-500">Curso de pago</p>
                </div>
                <button
                  onClick={() =>
                    setForm({ ...form, isPremium: !form.isPremium })
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    form.isPremium ? "bg-[#00FF88]" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      form.isPremium ? "translate-x-5.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 rounded-xl bg-[#00FF88] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#00FF88]/90 transition-colors"
                >
                  {editingId ? "Guardar Cambios" : "Crear Curso"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-sm rounded-2xl p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">
              Eliminar curso
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Esta acción no se puede deshacer. ¿Estás seguro?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500/90 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
