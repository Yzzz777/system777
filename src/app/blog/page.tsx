"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Search, Clock, User, Tag, ArrowRight, Upload, FileText, Image, Download, X, Plus, Eye, Edit3, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from "@/components/ui/Animations";

interface BlogFile { id: string; filename: string; mime: string; size: number; downloads: number; }
interface BlogPost { id: string; title: string; slug: string; excerpt: string; content: string; category: string; cover_url: string; author: string; published: boolean; created_at: string; files?: BlogFile[]; }

const defaultPosts: BlogPost[] = [
  { id: "1", title: "System 777: Todo lo que Puede Hacer tu Bot", slug: "system-777-features", excerpt: "Tour completo por las 100+ funcionalidades de System 777.", content: "", category: "Discord", cover_url: "", author: "System 777", published: true, created_at: "2026-03-01" },
  { id: "2", title: "Protege tu Servidor de Discord", slug: "discord-bot-security", excerpt: "Anti-raid, anti-nuke, automod: como proteger tu comunidad.", content: "", category: "Ciberseguridad", cover_url: "", author: "System 777", published: true, created_at: "2026-02-20" },
  { id: "3", title: "Deploy de Next.js 15 en Cloudflare Pages", slug: "nextjs-15-deploy", excerpt: "Paso a paso para desplegar Next.js 15 en Cloudflare.", content: "", category: "Programacion", cover_url: "", author: "System 777", published: true, created_at: "2026-02-10" },
];

const allCategories = ["Todos", "Discord", "Ciberseguridad", "Programacion", "Linux", "Archivos", "Proyectos"];
const catColors: Record<string, string> = { Discord: "#5865F2", Ciberseguridad: "#ED4245", Programacion: "#00FF88", Linux: "#FCC624", Archivos: "#7C3AED", Proyectos: "#00C8FF", General: "#95A5A6" };

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", category: "General", cover_url: "" });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const filtered = posts.filter((p) => {
    const matchCat = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCreate = async () => {
    if (!form.title || !form.slug) return;
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    try {
      const res = await fetch("/api/blog/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, slug, published: true }) });
      const data = await res.json();
      if (data.ok && data.post) {
        if (selectedFiles.length > 0 && data.post.id) {
          for (const file of selectedFiles) {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("postId", data.post.id);
            await fetch("/api/blog/upload", { method: "POST", body: fd });
          }
        }
        setPosts([{ ...data.post, files: [] }, ...posts]);
        setForm({ title: "", slug: "", excerpt: "", content: "", category: "General", cover_url: "" });
        setSelectedFiles([]);
        setShowCreate(false);
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/blog/posts?id=${id}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p.id !== id));
    setSelectedPost(null);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setSelectedFiles([...selectedFiles, ...Array.from(e.dataTransfer.files)]); };

  const isImage = (mime: string) => mime.startsWith("image/");

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4">
        <FadeIn>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Blog</h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">Articulos, archivos y recursos — todo listo para descargar</p>
          </div>
        </FadeIn>

        {/* Controls */}
        <FadeIn delay={0.1}>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" />
            </div>
            <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 rounded-xl bg-[#00FF88] px-5 py-3 text-sm font-semibold text-black hover:bg-[#00CC6A] transition-colors">
              <Plus className="h-4 w-4" /> Nuevo Post
            </button>
          </div>
        </FadeIn>

        {/* Categories */}
        <FadeIn delay={0.15}>
          <div className="mt-6 flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`rounded-full px-4 py-2 text-sm transition-colors ${selectedCategory === cat ? "bg-[#00FF88] text-black" : "border border-white/10 text-gray-400 hover:border-white/20 hover:text-white"}`}>
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Create Form */}
        <AnimatePresence>
          {showCreate && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="glass rounded-2xl p-6 mt-8 space-y-4">
                <h3 className="text-lg font-bold text-white">Crear Nuevo Post</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Titulo</label>
                    <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="Mi articulo" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Slug</label>
                    <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="mi-articulo" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Excerpt</label>
                  <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="Descripcion corta..." />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Contenido</label>
                  <textarea rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="Escribe tu articulo..." />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Categoria</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#00FF88]/50">
                      {allCategories.filter((c) => c !== "Todos").map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Cover URL (imagen)</label>
                    <input value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50" placeholder="https://..." />
                  </div>
                </div>

                {/* File Upload Zone */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Archivos adjuntos</label>
                  <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className="rounded-xl border-2 border-dashed border-white/10 p-6 text-center hover:border-[#00FF88]/30 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mx-auto h-8 w-8 text-gray-600 mb-2" />
                    <p className="text-sm text-gray-400">Arrastra archivos aqui o click para seleccionar</p>
                    <p className="text-xs text-gray-600 mt-1">Imagenes, PDFs, ZIPs, scripts, etc.</p>
                    <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => setSelectedFiles([...selectedFiles, ...Array.from(e.target.files || [])])} />
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {selectedFiles.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2">
                          {f.type.startsWith("image/") ? <Image className="h-4 w-4 text-[#00C8FF]" /> : <FileText className="h-4 w-4 text-[#7C3AED]" />}
                          <span className="text-sm text-white flex-1 truncate">{f.name}</span>
                          <span className="text-xs text-gray-500">{formatSize(f.size)}</span>
                          <button onClick={() => setSelectedFiles(selectedFiles.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300"><X className="h-3 w-3" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button onClick={handleCreate} disabled={uploading} className="flex items-center gap-2 rounded-xl bg-[#00FF88] px-6 py-2.5 text-sm font-semibold text-black hover:bg-[#00CC6A] disabled:opacity-50">
                    {uploading ? "Subiendo..." : "Publicar"}
                  </button>
                  <button onClick={() => { setShowCreate(false); setSelectedFiles([]); }} className="rounded-xl border border-white/10 px-6 py-2.5 text-sm text-gray-400 hover:text-white">Cancelar</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post Detail Modal */}
        <AnimatePresence>
          {selectedPost && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelectedPost(null)}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs rounded-full px-2 py-0.5 font-medium" style={{ backgroundColor: (catColors[selectedPost.category] || "#00FF88") + "15", color: catColors[selectedPost.category] || "#00FF88" }}>{selectedPost.category}</span>
                    <h2 className="mt-2 text-2xl font-bold text-white">{selectedPost.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{selectedPost.excerpt}</p>
                  </div>
                  <button onClick={() => setSelectedPost(null)} className="text-gray-500 hover:text-white"><X className="h-5 w-5" /></button>
                </div>
                {selectedPost.content && <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>}
                {selectedPost.files && selectedPost.files.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-bold text-white mb-3">Archivos adjuntos</h4>
                    <div className="space-y-2">
                      {selectedPost.files.map((f) => (
                        <div key={f.id} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
                          {isImage(f.mime) ? <Image className="h-4 w-4 text-[#00C8FF]" /> : <FileText className="h-4 w-4 text-[#7C3AED]" />}
                          <span className="text-sm text-white flex-1 truncate">{f.filename}</span>
                          <span className="text-xs text-gray-500">{formatSize(f.size)}</span>
                          <span className="text-xs text-gray-500"><Download className="h-3 w-3 inline" /> {f.downloads}</span>
                          <a href={`/api/blog/file/${f.id}`} download className="rounded-lg bg-[#00FF88]/10 px-3 py-1.5 text-xs font-medium text-[#00FF88] hover:bg-[#00FF88]/20">Descargar</a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-6 flex gap-3">
                  <button onClick={() => handleDelete(selectedPost.id)} className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400 hover:bg-red-500/20"><Trash2 className="h-3 w-3" /> Eliminar</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts Grid */}
        <StaggerContainer className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <StaggerItem key={post.id}>
              <HoverScale>
                <div className="group glass rounded-2xl overflow-hidden cursor-pointer" onClick={() => setSelectedPost(post)}>
                  {post.cover_url ? (
                    <div className="h-40 overflow-hidden"><img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" /></div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-[#00FF88]/10 to-[#00C8FF]/10 relative">
                      <div className="absolute inset-0 flex items-center justify-center"><Tag className="h-12 w-12 text-white/5" /></div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="rounded-full px-2 py-0.5 font-medium" style={{ backgroundColor: (catColors[post.category] || "#00FF88") + "15", color: catColors[post.category] || "#00FF88" }}>{post.category}</span>
                      <span className="flex items-center gap-1 text-gray-500"><Clock className="h-3 w-3" /> {new Date(post.created_at).toLocaleDateString("es-ES")}</span>
                      {post.files && post.files.length > 0 && <span className="flex items-center gap-1 text-gray-500"><FileText className="h-3 w-3" /> {post.files.length} archivos</span>}
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-white group-hover:text-[#00FF88] transition-colors line-clamp-2">{post.title}</h2>
                    <p className="mt-2 text-sm text-gray-400 line-clamp-2">{post.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                      <span className="flex items-center gap-1 text-[#00FF88] group-hover:gap-2 transition-all">Ver <ArrowRight className="h-3 w-3" /></span>
                    </div>
                  </div>
                </div>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {filtered.length === 0 && <div className="mt-20 text-center text-gray-400">No se encontraron articulos</div>}
      </div>
    </div>
  );
}
