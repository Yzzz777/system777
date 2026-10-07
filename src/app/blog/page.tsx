"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  ArrowRight,
  Plus,
  Trash2,
  Loader2,
  PenLine,
} from "lucide-react";
import { OWNER_DISCORD_ID } from "@/lib/owner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [isOwner, setIsOwner] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", category: "General" });

  useEffect(() => {
    let alive = true;
    // El owner se detecta en el servidor: la cookie es HttpOnly y no puede
    // leerse desde JavaScript, así que se consulta /api/auth/session.
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive) setIsOwner(data?.user?.id === OWNER_DISCORD_ID);
      })
      .catch(() => {});
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
        toast.success("Artículo publicado", { description: data.post.title });
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
        toast.success("Artículo eliminado");
      }
    } catch {
      /* noop */
    }
  };

  return (
    <div className="relative px-4 pb-[var(--section-y)] pt-10 sm:px-6 sm:pt-14">
      <div className="grid-bg" aria-hidden />
    <div className="bg-vignette" aria-hidden />
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
            <Input
              id="blog-search"
              type="search"
              placeholder="Buscar artículos…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {isOwner && (
            <Button onClick={() => setShowCreate((v) => !v)}>
              <Plus aria-hidden />
              Nuevo post
            </Button>
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
                  ? "border-[rgba(0,229,255,0.45)] bg-[var(--brand-dim)] text-[var(--brand)]"
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="post-title" className="stat-label mb-1.5">
                  Título
                </Label>
                <Input
                  id="post-title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Mi artículo"
                />
              </div>
              <div>
                <Label htmlFor="post-slug" className="stat-label mb-1.5">
                  Slug (opcional)
                </Label>
                <Input
                  id="post-slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="mi-articulo"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="post-excerpt" className="stat-label mb-1.5">
                Extracto
              </Label>
              <Input
                id="post-excerpt"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Descripción corta…"
              />
            </div>
            <div>
              <Label htmlFor="post-content" className="stat-label mb-1.5">
                Contenido
              </Label>
              <Textarea
                id="post-content"
                rows={5}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Escribe tu artículo…"
                className="resize-y"
              />
            </div>
            <div>
              <Label htmlFor="post-category" className="stat-label mb-1.5">
                Categoría
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v ?? "General" })}
              >
                <SelectTrigger
                  id="post-category"
                  className="h-10 w-full bg-[rgba(255,255,255,0.03)]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "General",
                    "Discord",
                    "Ciberseguridad",
                    "Programación",
                    "Linux",
                    "Proyectos",
                  ].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formError && (
              <p role="alert" className="text-sm text-red-400">
                {formError}
              </p>
            )}

            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={sending}>
                {sending ? (
                  <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                ) : (
                  <PenLine aria-hidden />
                )}
                Publicar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreate(false);
                  setFormError("");
                }}
              >
                Cancelar
              </Button>
            </div>
            <p className="text-[11px] text-[var(--text-3)]">
              El endpoint exige sesión de owner verificada contra Discord: sin ella devuelve 401.
            </p>
          </div>
        )}

        {/* Estado */}
        {posts === null && !error && (
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2" aria-busy="true" aria-label="Cargando artículos">
            {[0, 1].map((i) => (
              <li key={i} className="panel p-6">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="mt-4 h-5 w-2/3" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-4/5" />
                <div className="mt-5 border-t border-[rgba(0,229,255,0.14)] pt-4">
                  <Skeleton className="h-4 w-20" />
                </div>
              </li>
            ))}
          </ul>
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
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtered.map((post) => (
              <li key={post.id} className="flex">
                <article className="panel panel-hover flex h-full w-full flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge variant="outline" className="font-mono">
                      {post.category || "General"}
                    </Badge>
                    <time
                      dateTime={post.created_at}
                      className="flex items-center gap-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-3)]"
                    >
                      <Clock aria-hidden className="h-3 w-3" />
                      {new Date(post.created_at).toLocaleDateString("es-ES")}
                    </time>
                    {!post.published && (
                      <Badge variant="outline" className="font-mono text-[var(--warn)]">
                        Borrador
                      </Badge>
                    )}
                  </div>
                  <h2 className="mt-3 text-lg font-bold leading-snug">{post.title}</h2>
                  {post.excerpt && (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-2)]">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between border-t border-[rgba(0,229,255,0.14)] pt-4">
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0"
                      render={<Link href={`/blog/${post.slug}`} />}
                    >
                      Leer
                      <ArrowRight aria-hidden />
                    </Button>
                    {isOwner && (
                      <Button
                        variant="destructive"
                        size="xs"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 aria-hidden />
                        Eliminar
                      </Button>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="relative mt-10 text-center text-xs text-[var(--text-3)]">
        ¿Buscas documentación técnica?{" "}
        <Link href="/library" className="text-[var(--brand)] hover:underline">
          Ve a la biblioteca
        </Link>
      </p>
    </div>
  );
}
