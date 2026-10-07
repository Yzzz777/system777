/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Plus, FileText, Image as ImageIcon, Paperclip, Save, X, Trash2, Pencil,
  Eye, EyeOff, Copy, Upload, Loader2, Download, Link2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category?: string;
  cover_url?: string;
  published?: boolean;
  created_at?: string;
};

type FileRec = {
  id: string;
  post_id: string;
  filename: string;
  mime: string;
  size: number;
  downloads: number;
  created_at?: string;
};

type Form = {
  id: string | null;
  title: string;
  slug: string;
  slugTouched: boolean;
  excerpt: string;
  content: string;
  category: string;
  coverUrl: string;
  published: boolean;
};

const EMPTY_FORM: Form = {
  id: null, title: "", slug: "", slugTouched: false, excerpt: "", content: "",
  category: "General", coverUrl: "", published: true,
};

const CATEGORIES = ["General", "Discord", "Ciberseguridad", "Programación", "Linux", "Proyectos"];

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function fmtSize(bytes?: number) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const isImage = (f: FileRec) => (f.mime || "").startsWith("image/");

export default function ContentAdminSection({
  showToast,
}: {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}) {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [files, setFiles] = useState<FileRec[]>([]);
  const [postFiles, setPostFiles] = useState<FileRec[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileTab, setFileTab] = useState<"imagenes" | "archivos">("imagenes");
  const [showCoverPicker, setShowCoverPicker] = useState(false);

  const toolbarImgRef = useRef<HTMLInputElement>(null);
  const toolbarFileRef = useRef<HTMLInputElement>(null);
  const editorImgRef = useRef<HTMLInputElement>(null);
  const editorFileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Espejo síncrono de form.content: insertAtCursor se llama varias veces en
  // cadena durante subidas múltiples y el estado de React aún no se ha pintado.
  const contentRef = useRef("");

  const refreshPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/blog/posts");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setPosts([]);
    }
  }, []);

  const refreshFiles = useCallback(async () => {
    try {
      const res = await fetch("/api/blog/files");
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch {
      setFiles([]);
    }
  }, []);

  const refreshPostFiles = useCallback(async (postId: string) => {
    try {
      const res = await fetch(`/api/blog/files?postId=${encodeURIComponent(postId)}`);
      const data = await res.json();
      setPostFiles(Array.isArray(data) ? data : []);
    } catch {
      setPostFiles([]);
    }
  }, []);

  useEffect(() => {
    refreshPosts();
    refreshFiles();
  }, [refreshPosts, refreshFiles]);

  // Ctrl+O → selector de archivos (como en el panel de contenido).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "o") {
        e.preventDefault();
        toolbarFileRef.current?.click();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openNew = () => {
    setForm(EMPTY_FORM);
    contentRef.current = "";
    setPostFiles([]);
    setFormError("");
    setEditing(true);
  };

  const openEdit = (p: Post) => {
    setForm({
      id: p.id,
      title: p.title || "",
      slug: p.slug || "",
      slugTouched: true,
      excerpt: p.excerpt || "",
      content: p.content || "",
      category: p.category || "General",
      coverUrl: p.cover_url || "",
      published: p.published !== false,
    });
    contentRef.current = p.content || "";
    setFormError("");
    setEditing(true);
    refreshPostFiles(p.id);
  };

  const closeEditor = () => {
    setEditing(false);
    setForm(EMPTY_FORM);
    contentRef.current = "";
    setPostFiles([]);
    setFormError("");
    setShowCoverPicker(false);
  };

  const save = async () => {
    if (!form.title.trim()) {
      setFormError("El título es obligatorio.");
      return;
    }
    const slug = form.slugTouched && form.slug.trim() ? slugify(form.slug) : slugify(form.title);
    if (!slug) {
      setFormError("No se pudo generar un slug válido.");
      return;
    }
    setSaving(true);
    try {
      const isEdit = !!form.id;
      const body: any = {
        title: form.title.trim(),
        slug,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        coverUrl: form.coverUrl,
        published: form.published,
      };
      if (isEdit) body.id = form.id;
      const res = await fetch("/api/blog/posts", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.ok && data.post) {
        setFormError("");
        setForm((f) => ({ ...f, id: data.post.id, slug: data.post.slug }));
        refreshPosts();
        refreshPostFiles(data.post.id);
        showToast(isEdit ? "Artículo actualizado" : "Artículo creado", "success");
      } else {
        setFormError(data.error || "No se pudo guardar el artículo.");
      }
    } catch {
      setFormError("Error de red al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const removePost = async (id: string) => {
    if (!window.confirm("¿Eliminar este artículo y sus archivos?")) return;
    try {
      const res = await fetch(`/api/blog/posts?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        refreshPosts();
        refreshFiles();
        if (form.id === id) closeEditor();
        showToast("Artículo eliminado", "success");
      } else {
        showToast("No se pudo eliminar", "error");
      }
    } catch {
      showToast("Error de red", "error");
    }
  };

  const togglePublish = async (p: Post) => {
    try {
      const res = await fetch("/api/blog/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, published: !p.published }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        refreshPosts();
        showToast(data.post.published ? "Artículo publicado" : "Artículo ocultado", "success");
      } else {
        showToast(data.error || "No se pudo cambiar el estado", "error");
      }
    } catch {
      showToast("Error de red", "error");
    }
  };

  const uploadFiles = async (fileList: FileList | null, postId: string, insert = false) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("postId", postId);
        const res = await fetch("/api/blog/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          showToast(data.error || `No se pudo subir ${file.name}`, "error");
          continue;
        }
        showToast(`${file.name} subido`, "success");
        if (insert && data.file) {
          const url = `/api/blog/file/${data.file.id}`;
          const markdown = isImage(data.file)
            ? `![${file.name}](${url})`
            : `[${file.name}](${url})`;
          insertAtCursor(markdown);
        }
      }
      refreshFiles();
      if (form.id) refreshPostFiles(form.id);
    } catch {
      showToast("Error de red al subir", "error");
    } finally {
      setUploading(false);
      if (toolbarImgRef.current) toolbarImgRef.current.value = "";
      if (toolbarFileRef.current) toolbarFileRef.current.value = "";
      if (editorImgRef.current) editorImgRef.current.value = "";
      if (editorFileRef.current) editorFileRef.current.value = "";
    }
  };

  const insertAtCursor = (text: string) => {
    const el = textareaRef.current;
    const base = contentRef.current;
    let next: string;
    let pos: number;
    if (!el) {
      const prefix = base && !base.endsWith("\n") ? "\n" : "";
      next = base + prefix + text;
      pos = next.length;
    } else {
      const s = el.selectionStart ?? base.length;
      const e = el.selectionEnd ?? s;
      const before = base.slice(0, s);
      const after = base.slice(e);
      const prefix = before && !before.endsWith("\n") ? "\n" : "";
      const suffix = after && !after.startsWith("\n") ? "\n" : "";
      const inserted = prefix + text + suffix;
      next = before + inserted + after;
      pos = before.length + inserted.length;
    }
    contentRef.current = next;
    setForm((f) => ({ ...f, content: next }));
    if (el) {
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(pos, pos);
      });
    }
  };

  const removeFile = async (fileId: string) => {
    if (!window.confirm("¿Eliminar este archivo?")) return;
    try {
      const res = await fetch(`/api/blog/files?fileId=${fileId}`, { method: "DELETE" });
      if (res.ok) {
        refreshFiles();
        if (form.id) refreshPostFiles(form.id);
        showToast("Archivo eliminado", "success");
      } else {
        showToast("No se pudo eliminar", "error");
      }
    } catch {
      showToast("Error de red", "error");
    }
  };

  const copyUrl = async (path: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      showToast("URL copiada", "success");
    } catch {
      showToast("No se pudo copiar", "error");
    }
  };

  const fileUrl = (f: FileRec) => `/api/blog/file/${f.id}`;
  const siteFiles = files.filter((f) => f.post_id === "general");
  const visibleFiles = siteFiles.filter((f) => (fileTab === "imagenes" ? isImage(f) : !isImage(f)));

  const editorImages = postFiles.filter(isImage);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-white">Contenido Web</h2>
          <p className="text-sm text-gray-500">Artículos del blog, imágenes y archivos del sitio.</p>
        </div>
        <a
          href="/blog"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10"
        >
          <Link2 size={14} /> Ver blog
        </a>
      </div>

      {/* ── Añadir nuevo ── */}
      <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <span className="text-sm font-bold text-white">Añadir nuevo</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E5FF] text-[#02141a] text-sm font-semibold hover:bg-[#00B8DB] transition-colors"
          >
            <FileText size={14} /> Texto
          </button>
          <button
            onClick={() => toolbarImgRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />} Imágenes
          </button>
          <button
            onClick={() => toolbarFileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Paperclip size={14} />} Archivos
          </button>
        </div>
        <span className="text-xs text-gray-600 ml-auto">Ctrl+O abre el selector de archivos</span>
        <input
          ref={toolbarImgRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => uploadFiles(e.target.files, "general")}
        />
        <input
          ref={toolbarFileRef}
          type="file"
          multiple
          hidden
          onChange={(e) => uploadFiles(e.target.files, "general")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Artículos ── */}
        <section className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Artículos ({posts?.length ?? "…"})</h3>
            <Button size="sm" onClick={openNew}>
              <Plus aria-hidden /> Nuevo
            </Button>
          </div>
          {posts === null && (
            <p className="text-sm text-gray-500 py-6 text-center">Cargando artículos…</p>
          )}
          {posts !== null && posts.length === 0 && (
            <p className="text-sm text-gray-500 py-6 text-center">
              Sin artículos todavía. Crea el primero con «Añadir nuevo → Texto».
            </p>
          )}
          <div className="space-y-3">
            {(posts ?? []).map((p) => (
              <div
                key={p.id}
                className="rounded-xl bg-white/[0.02] border border-[rgba(150,200,255,0.08)] p-4 flex flex-wrap items-center gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white truncate">{p.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.published
                          ? "bg-[#23a559]/15 text-[#23a559]"
                          : "bg-[#f0b232]/15 text-[#f0b232]"
                      }`}
                    >
                      {p.published ? "Publicado" : "Borrador"}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                      {p.category || "General"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1 truncate">
                    /blog/{p.slug}
                    {p.created_at ? ` · ${new Date(p.created_at).toLocaleDateString("es-ES")}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => togglePublish(p)}
                    title={p.published ? "Ocultar" : "Publicar"}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    {p.published ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    onClick={() => openEdit(p)}
                    title="Editar"
                    className="p-2 rounded-lg text-gray-400 hover:text-[#00E5FF] hover:bg-white/10"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => removePost(p.id)}
                    title="Eliminar"
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/10"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Archivos del sitio ── */}
        <section className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Archivos</h3>
            <button
              onClick={() => (fileTab === "imagenes" ? toolbarImgRef.current?.click() : toolbarFileRef.current?.click())}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] text-xs font-semibold hover:bg-[#00E5FF]/25 disabled:opacity-50"
            >
              {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />} Subir
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            {(["imagenes", "archivos"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFileTab(t)}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  fileTab === t
                    ? "bg-[#00E5FF]/15 text-[#00E5FF]"
                    : "bg-white/5 text-gray-500 hover:text-white"
                }`}
              >
                {t === "imagenes" ? "Imágenes" : "Archivos"}
              </button>
            ))}
          </div>

          {visibleFiles.length === 0 && (
            <p className="text-xs text-gray-600 py-4 text-center">
              {fileTab === "imagenes" ? "Sin imágenes subidas" : "Sin archivos subidos"}
            </p>
          )}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {fileTab === "imagenes" &&
              visibleFiles.map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={fileUrl(f)} alt={f.filename} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-white truncate">{f.filename}</div>
                    <div className="text-[10px] text-gray-600">{fmtSize(f.size)}</div>
                  </div>
                  <button onClick={() => copyUrl(fileUrl(f))} title="Copiar URL" className="p-1.5 text-gray-400 hover:text-white">
                    <Copy size={13} />
                  </button>
                  <button onClick={() => removeFile(f.id)} title="Eliminar" className="p-1.5 text-gray-400 hover:text-red-400">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            {fileTab === "archivos" &&
              visibleFiles.map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                  <FileText size={16} className="text-gray-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-white truncate">{f.filename}</div>
                    <div className="text-[10px] text-gray-600">{fmtSize(f.size)}</div>
                  </div>
                  <a href={fileUrl(f)} download title="Descargar" className="p-1.5 text-gray-400 hover:text-white">
                    <Download size={13} />
                  </a>
                  <button onClick={() => copyUrl(fileUrl(f))} title="Copiar URL" className="p-1.5 text-gray-400 hover:text-white">
                    <Copy size={13} />
                  </button>
                  <button onClick={() => removeFile(f.id)} title="Eliminar" className="p-1.5 text-gray-400 hover:text-red-400">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
          </div>
        </section>
      </div>

      {/* ── Editor ── */}
      {editing && (
        <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-8">
          <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0b1420] shadow-[0_24px_70px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h3 className="font-bold text-white">
                {form.id ? "Editar artículo" : "Nuevo artículo"}
              </h3>
              <button onClick={closeEditor} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ca-title" className="text-xs text-gray-500 mb-1.5 block">
                    Título
                  </Label>
                  <Input
                    id="ca-title"
                    value={form.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setForm((f) => ({
                        ...f,
                        title,
                        slug: f.slugTouched ? f.slug : slugify(title),
                      }));
                    }}
                    placeholder="Mi artículo"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="ca-slug" className="text-xs text-gray-500 mb-1.5 block">
                    Slug
                  </Label>
                  <Input
                    id="ca-slug"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value, slugTouched: true }))}
                    placeholder="mi-articulo"
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ca-excerpt" className="text-xs text-gray-500 mb-1.5 block">
                  Extracto
                </Label>
                <Input
                  id="ca-excerpt"
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Descripción corta…"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500 mb-1.5 block">Categoría</Label>
                  <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v ?? "General" }))}>
                    <SelectTrigger className="h-10 w-full bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1.5 block">Estado</Label>
                  <button
                    onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
                    className={`w-full h-10 px-4 rounded-xl text-sm font-semibold border transition-colors ${
                      form.published
                        ? "border-[#23a559]/40 bg-[#23a559]/15 text-[#23a559]"
                        : "border-[#f0b232]/40 bg-[#f0b232]/15 text-[#f0b232]"
                    }`}
                  >
                    {form.published ? "● Publicado" : "● Borrador"}
                  </button>
                </div>
              </div>

              {/* Contenido + toolbar Añadir nuevo */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Label htmlFor="ca-content" className="text-xs text-gray-500">
                    Contenido
                  </Label>
                  <span className="text-[10px] text-gray-600 ml-auto">Añadir nuevo:</span>
                  <button
                    onClick={() => editorImgRef.current?.click()}
                    disabled={uploading || !form.id}
                    title={form.id ? "Subir imagen e insertarla" : "Guarda el artículo primero"}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-gray-300 hover:bg-white/10 disabled:opacity-40"
                  >
                    <ImageIcon size={11} /> Imágenes
                  </button>
                  <button
                    onClick={() => editorFileRef.current?.click()}
                    disabled={uploading || !form.id}
                    title={form.id ? "Adjuntar archivo e insertar enlace" : "Guarda el artículo primero"}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-gray-300 hover:bg-white/10 disabled:opacity-40"
                  >
                    <Paperclip size={11} /> Archivos
                  </button>
                </div>
                <Textarea
                  id="ca-content"
                  ref={textareaRef}
                  rows={12}
                  value={form.content}
                  onChange={(e) => {
                    contentRef.current = e.target.value;
                    setForm((f) => ({ ...f, content: e.target.value }));
                  }}
                  placeholder={"Escribe tu artículo…\n\n![imagen](/api/blog/file/…) inserta una imagen en su línea\n[enlace](https://…) inserta un enlace"}
                  className="bg-white/5 border-white/10 font-mono text-xs leading-relaxed resize-y"
                />
                <input
                  ref={editorImgRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => form.id && uploadFiles(e.target.files, form.id, true)}
                />
                <input
                  ref={editorFileRef}
                  type="file"
                  multiple
                  hidden
                  onChange={(e) => form.id && uploadFiles(e.target.files, form.id, true)}
                />
              </div>

              {/* Adjuntos del post */}
              {form.id && postFiles.length > 0 && (
                <div className="rounded-xl border border-white/10 p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Adjuntos del artículo
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {postFiles.map((f) => (
                      <div key={f.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] text-xs text-gray-300">
                        {isImage(f) ? <ImageIcon size={12} /> : <FileText size={12} />}
                        <span className="max-w-40 truncate">{f.filename}</span>
                        <button
                          onClick={() =>
                            insertAtCursor(
                              isImage(f)
                                ? `![${f.filename}](${fileUrl(f)})`
                                : `[${f.filename}](${fileUrl(f)})`
                            )
                          }
                          title="Insertar en el contenido"
                          className="text-gray-500 hover:text-[#00E5FF]"
                        >
                          <Plus size={12} />
                        </button>
                        <a href={fileUrl(f)} download title="Descargar" className="text-gray-500 hover:text-white">
                          <Download size={12} />
                        </a>
                        <button onClick={() => removeFile(f.id)} title="Eliminar" className="text-gray-500 hover:text-red-400">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Portada */}
              <div>
                <Label htmlFor="ca-cover" className="text-xs text-gray-500 mb-1.5 block">
                  Portada (URL de imagen, opcional)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="ca-cover"
                    value={form.coverUrl}
                    onChange={(e) => setForm((f) => ({ ...f, coverUrl: e.target.value }))}
                    placeholder="https://… o /api/blog/file/…"
                    className="bg-white/5 border-white/10"
                  />
                  <button
                    onClick={() => setShowCoverPicker((v) => !v)}
                    className="px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 whitespace-nowrap"
                  >
                    Elegir
                  </button>
                </div>
                {showCoverPicker && (
                  <div className="mt-2 flex flex-wrap gap-2 rounded-xl border border-white/10 p-2 max-h-32 overflow-y-auto">
                    {editorImages.length === 0 && (
                      <p className="text-xs text-gray-600 p-2">
                        Sube una imagen con «Añadir nuevo → Imágenes» para elegirla de portada.
                      </p>
                    )}
                    {editorImages.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          setForm((v) => ({ ...v, coverUrl: fileUrl(f) }));
                          setShowCoverPicker(false);
                        }}
                        className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/10 hover:border-[#00E5FF] transition-colors"
                        title={f.filename}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={fileUrl(f)} alt={f.filename} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                {form.coverUrl && (
                  <div className="mt-2 relative w-40 h-20 rounded-lg overflow-hidden border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.coverUrl} alt="Portada" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {formError && (
                <p role="alert" className="text-sm text-red-400">
                  {formError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-white/10 px-6 py-4">
              <Button variant="outline" onClick={closeEditor}>
                Cancelar
              </Button>
              <Button onClick={save} disabled={saving}>
                {saving ? (
                  <Loader2 aria-hidden className="animate-spin" />
                ) : (
                  <Save aria-hidden />
                )}
                {form.id ? "Guardar cambios" : "Crear artículo"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
