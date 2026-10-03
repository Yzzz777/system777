"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  ArrowRight,
  Plus,
  X,
  Trash2,
  Loader2,
  PenLine,
} from "lucide-react";
import { getSession } from "@/lib/session";
import { OWNER_DISCORD_ID } from "@/lib/adminAuth";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  cover_url?: string;
  author: string;
  published: boolean;
  created_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", category: "General" });
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsOwner(getSession()?.id === OWNER_DISCORD_ID);
    let alive = true;
    fetch("/api/blog/posts")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad status"))))
      .then((data) => {
        if (alive && Array.isArray(data)) setPosts(data);
        else if (alive) setPosts([]);
      })
      .catch(() => {
        if (alive) {
          setPosts([]);
          setError("No se pudo cargar el blog.");
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  const closeDialog = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDialog();
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, closeDialog]);

  const categories = ["Todos", ...Array.from(new Set((posts ?? []).map((p) => p.category || "General")))];
  const filtered = (posts ?? []).filter((p) => {
    const q = search.trim().toLowerCase();
    const matchCat = category === "Todos" || (p.category || "General") === category;
    const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.excerpt || "").toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const handleCreate = async () => {
    setFormError("");
    if (!form.title.trim()) {
      setFormError("El título es obligatorio.");
      return;
    }
    const slug =
      form.slug.trim() ||
      form.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    setSending(true);
    try {
      const res = await fetch("/api/blog/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug, published: true }),
      });
      const data = await res.json();
      if (res.ok && data.ok && data.post) {
        setPosts((prev) => [data.post, ...(prev ?? [])]);
        setForm({ title: "", slug: "", excerpt: "", content: "", category: "General" });
        setShowCreate(false);
      } else {
        setFormError(data.error || "No se pudo crear el post.");
      }
    } catch {
      setFormError("Error de red al crear el post.");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/posts?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => (prev ?? []).filter((p) => p.id !== id));
        setSelected(null);
      }
    } catch {
      /* noop */
    }
  };

  return (
    <div className="relative px-4 pb-[var(--section-y)] pt-10 sm:px-6 sm:pt-14">
      <div className="grid-bg" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <span className="eyebrow justify-center">Notas</span>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2rem,5.5vw,3.25rem)] font-bold tracking-tight">
            Blog
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-2)]">
            Artículos escritos por mí, con base de datos real. Si no hay publicaciones, aquí no
            aparecen textos de relleno.
          </p>
        </div>

        {/* Controles */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]"
            />
            <label htmlFor="blog-search" className="sr-only">
              Buscar artículos
            </label>
            <input
              id="blog-search"
              type="search"
              placeholder="Buscar artículos…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[12px] border border-[var(--line)] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--text-3)] outline-none transition-colors focus:border-[rgba(0,255,136,0.5)]"
            />
          </div>
          {isOwner && (
            <button
              type="button"
              onClick={() => setShowCreate((v) => !v)}
              className="btn btn-primary !py-2.5"
            >
              <Plus aria-hidden className="h-4 w-4" />
              Nuevo post
            </button>
          )}
        </div>

        {/* Categorías */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`rounded-[10px] border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                category === c
                  ? "border-[rgba(0,255,136,0.45)] bg-[var(--brand-dim)] text-[var(--brand)]"
                  : "border-[var(--line)] bg-white/[0.03] text-[var(--text-3)] hover:text-[var(--text)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Formulario owner */}
        {showCreate && isOwner && (
          <div className="panel mt-6 space-y-4 p-6">
            <h2 className="text-lg font-bold">Crear artículo</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="post-title" className="stat-label mb-1.5 block">
                  Título
                </label>
                <input
                  id="post-title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Mi artículo"
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="post-slug" className="stat-label mb-1.5 block">
                  Slug (opcional)
                </label>
                <input
                  id="post-slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="mi-articulo"
                  className="input"
                />
              </div>
            </div>
            <div>
              <label htmlFor="post-excerpt" className="stat-label mb-1.5 block">
                Extracto
              </label>
              <input
                id="post-excerpt"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Descripción corta…"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="post-content" className="stat-label mb-1.5 block">
                Contenido
              </label>
              <textarea
                id="post-content"
                rows={5}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Escribe tu artículo…"
                className="input resize-y"
              />
            </div>
            <div>
              <label htmlFor="post-category" className="stat-label mb-1.5 block">
                Categoría
              </label>
              <select
                id="post-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input"
              >
                {["General", "Discord", "Ciberseguridad", "Programación", "Linux", "Proyectos"].map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  )
                )}
              </select>
            </div>

            {formError && (
              <p role="alert" className="text-sm text-red-400">
                {formError}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCreate}
                disabled={sending}
                className="btn btn-primary"
              >
                {sending ? (
                  <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                ) : (
                  <PenLine aria-hidden className="h-4 w-4" />
                )}
                Publicar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreate(false);
                  setFormError("");
                }}
                className="btn btn-ghost"
              >
                Cancelar
              </button>
            </div>
            <p className="text-[11px] text-[var(--text-3)]">
              El endpoint exige sesión de owner verificada contra Discord: sin ella devuelve 401.
            </p>
          </div>
        )}

        {/* Estado */}
        {posts === null && !error && (
          <div className="panel mt-8 p-10 text-center text-sm text-[var(--text-3)]">
            Cargando artículos…
          </div>
        )}

        {error && posts !== null && (
          <div className="panel mt-8 p-10 text-center text-sm text-[var(--text-3)]">{error}</div>
        )}

        {posts !== null && filtered.length === 0 && !error && (
          <div className="panel mt-8 p-10 text-center">
            <p className="text-[var(--text-2)]">
              {posts.length === 0
                ? "Todavía no hay artículos publicados."
                : "Ningún artículo coincide con la búsqueda."}
            </p>
            <p className="mt-2 text-xs text-[var(--text-3)]">
              {posts.length === 0
                ? "Estoy escribiendo el primero; aparecerá aquí."
                : "Prueba con otra palabra o categoría."}
            </p>
          </div>
        )}

        {/* Lista */}
        {filtered.length > 0 && (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {filtered.map((post) => (
              <li key={post.id} className="flex">
                <article className="panel panel-hover flex h-full w-full flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="chip">{post.category || "General"}</span>
                    <time
                      dateTime={post.created_at}
                      className="flex items-center gap-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-3)]"
                    >
                      <Clock aria-hidden className="h-3 w-3" />
                      {new Date(post.created_at).toLocaleDateString("es-ES")}
                    </time>
                    {!post.published && <span className="chip !text-[var(--warn)]">Borrador</span>}
                  </div>
                  <h2 className="mt-3 text-lg font-bold leading-snug">{post.title}</h2>
                  {post.excerpt && (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-2)]">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-4">
                    <button
                      type="button"
                      onClick={() => setSelected(post)}
                      className="inline-flex items-center gap-1.5 text-sm text-[var(--brand)] hover:underline"
                    >
                      Leer
                      <ArrowRight aria-hidden className="h-4 w-4" />
                    </button>
                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
                        className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300"
                      >
                        <Trash2 aria-hidden className="h-3.5 w-3.5" />
                        Eliminar
                      </button>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={closeDialog}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="post-dialog-title"
            onClick={(e) => e.stopPropagation()}
            className="panel max-h-[85vh] w-full max-w-2xl overflow-y-auto p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="chip">{selected.category || "General"}</span>
                <h2 id="post-dialog-title" className="mt-2 text-xl font-bold">
                  {selected.title}
                </h2>
                <time
                  dateTime={selected.created_at}
                  className="mt-1 block font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-3)]"
                >
                  {new Date(selected.created_at).toLocaleDateString("es-ES")} ·{" "}
                  {selected.author || "Ángel"}
                </time>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={closeDialog}
                aria-label="Cerrar"
                className="shrink-0 rounded-[8px] border border-[var(--line)] p-2 text-[var(--text-3)] transition-colors hover:text-[var(--text)]"
              >
                <X aria-hidden className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-2)]">
              {selected.content || selected.excerpt || "Sin contenido todavía."}
            </div>

            {selected.cover_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selected.cover_url}
                alt=""
                className="mt-5 max-h-72 w-full rounded-[10px] object-cover"
              />
            )}
          </div>
        </div>
      )}

      <p className="relative mt-10 text-center text-xs text-[var(--text-3)]">
        ¿Buscas documentación técnica?{" "}
        <Link href="/library" className="text-[var(--brand)] hover:underline">
          Ve a la biblioteca
        </Link>
      </p>
    </div>
  );
}
