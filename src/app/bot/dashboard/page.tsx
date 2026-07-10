/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "@/components/Providers";
import {
  Server, Users, Search, ChevronLeft, ChevronRight, Settings, Shield,
  MessageSquare, Coins, BarChart3, Terminal, Crown, Bot, ExternalLink,
  RefreshCw, Power, Trash2, Plus, Save, Send, Copy, X, Menu, Zap, Lock,
  ScrollText, Award, Gift, Ban, Sparkles, Layout, Megaphone, UserCog,
  Code, Hash, ShieldBan, Flame, Bug, Palette, CheckCircle, AlertTriangle,
  Link2, Filter, AtSign, Repeat, CreditCard, Key, Wrench, Monitor,
  Ticket, Smile, ShieldAlert, UserCheck, Globe, Eye, EyeOff, Clock,
  Volume2, Home, Play, Pause, Bell,
} from "lucide-react";

const BOT_INVITE = "https://discord.com/oauth2/authorize?client_id=1502804306125132057&permissions=8&scope=bot%20applications.commands";
const SUPPORT_SERVER = "https://discord.gg/system777";
const OWNER_IDS = ["1376047332709240884", "1376047332709240884"];

const OWNER_NAV = [
  { category: "General", items: [
    { id: "inicio", label: "Inicio", icon: Home },
    { id: "modules", label: "Módulos", icon: Settings },
    { id: "hierarchy", label: "Jerarquía", icon: UserCog },
  ]},
  { category: "Mensajería", items: [
    { id: "welcome", label: "Bienvenida / Despedida", icon: MessageSquare },
    { id: "autorole", label: "Roles", icon: UserCheck },
    { id: "logs", label: "Logs del Servidor", icon: ScrollText },
  ]},
  { category: "Soporte", items: [
    { id: "tickets", label: "Tickets", icon: Ticket },
    { id: "verification", label: "Verificación", icon: Lock },
  ]},
  { category: "Engagement", items: [
    { id: "levels", label: "Niveles & XP", icon: BarChart3 },
    { id: "economy", label: "Economía", icon: Coins },
    { id: "notifications", label: "Notificaciones", icon: Bell },
  ]},
  { category: "Seguridad", items: [
    { id: "protection", label: "Protección", icon: Shield },
    { id: "moderation", label: "Moderación", icon: ShieldBan },
  ]},
  { category: "Owner", items: [
    { id: "botcontrol", label: "Control del Bot", icon: Power },
    { id: "botmessages", label: "Mensajes del Bot", icon: MessageSquare },
    { id: "globalbans", label: "Bans Globales", icon: Ban },
    { id: "broadcast", label: "Broadcast", icon: Megaphone },
    { id: "ipbans", label: "IP Bans", icon: Globe },
    { id: "staff", label: "Staff", icon: UserCog },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "premiumadmin", label: "Premium Admin", icon: Crown },
    { id: "jarvis", label: "JARVIS AI", icon: Bot },
    { id: "botlogs", label: "Bot Logs", icon: Terminal },
  ]},
];

const MEMBER_NAV = [
  { category: "General", items: [
    { id: "inicio", label: "Inicio", icon: Home },
    { id: "modules", label: "Módulos", icon: Settings },
    { id: "hierarchy", label: "Mi Jerarquía", icon: UserCog },
  ]},
  { category: "Mensajería", items: [
    { id: "welcome", label: "Bienvenida / Despedida", icon: MessageSquare },
    { id: "autorole", label: "Roles", icon: UserCheck },
    { id: "logs", label: "Logs del Servidor", icon: ScrollText },
  ]},
  { category: "Soporte", items: [
    { id: "tickets", label: "Tickets", icon: Ticket },
    { id: "verification", label: "Verificación", icon: Lock },
  ]},
  { category: "Engagement", items: [
    { id: "levels", label: "Niveles & XP", icon: BarChart3 },
    { id: "economy", label: "Economía", icon: Coins },
    { id: "notifications", label: "Notificaciones", icon: Bell },
  ]},
  { category: "Seguridad", items: [
    { id: "protection", label: "Protección", icon: Shield },
    { id: "moderation", label: "Moderación", icon: ShieldBan },
  ]},
];

function Toast({ message, type, onClose }: { message: string; type: "success" | "error" | "info"; onClose: () => void }) {
  const colors = { success: "bg-green-500/20 border-green-500/30 text-green-400", error: "bg-red-500/20 border-red-500/30 text-red-400", info: "bg-blue-500/20 border-blue-500/30 text-blue-400" };
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border ${colors[type]} flex items-center gap-2`}>
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X size={14} /></button>
    </motion.div>
  );
}

function Toggle({ checked, onChange, label, onSave }: { checked: boolean; onChange: (v: boolean) => void; label: string; onSave?: () => void }) {
  return (
    <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-[#5865F2]/5 transition-all cursor-pointer group" onClick={() => { onChange(!checked); if (onSave) setTimeout(onSave, 100); }}>
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
      <div className={`relative w-11 h-6 rounded-full transition-all duration-300 ${checked ? "bg-[#5865F2] shadow-lg shadow-[#5865F2]/30" : "bg-white/10"}`}>
        <motion.div animate={{ x: checked ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md" />
      </div>
    </label>
  );
}

function SelectInput({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
      <button type="button" onClick={() => setOpen(!open)} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm flex items-center justify-between hover:border-[#5865F2]/30 transition-all">
        <span className={selected?.value ? "text-white" : "text-gray-500"}>{selected?.label || "Seleccionar..."}</span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/10 shadow-2xl max-h-64 overflow-y-auto" style={{ background: "#1a1a2e" }}>
          {options.map((o) => (
            <button key={o.value} type="button" onClick={() => { onChange(o.value); setOpen(false); }} className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#5865F2]/15 transition-colors ${value === o.value ? "text-[#5865F2] bg-[#5865F2]/10" : "text-gray-300"}`}>
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TextInput({ value, onChange, label, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; label: string; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 placeholder-gray-600" />
    </div>
  );
}

function NumberInput({ value, onChange, label, min = 0 }: { value: number; onChange: (v: number) => void; label: string; min?: number }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
      <input type="number" value={value} min={min} onChange={(e) => onChange(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
    </div>
  );
}

export default function BotDashboardPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("inicio");
  const [guilds, setGuilds] = useState<any[]>([]);
  const [guildConfig, setGuildConfig] = useState<any>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [ownerData, setOwnerData] = useState<any>(null);
  const [hierarchy, setHierarchy] = useState<any[]>([]);
  const [hierarchyForm, setHierarchyForm] = useState({ userId: "", rank: "moderator", note: "" });
  const [botMessages, setBotMessages] = useState<any[]>([]);
  const [botMsgInput, setBotMsgInput] = useState("");
  const [botMsgTarget, setBotMsgTarget] = useState("all");

  const isOwner = OWNER_IDS.includes((session?.user as any)?.id || session?.user?.name || "");

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const api = useCallback(async (path: string, opts?: RequestInit) => {
    try {
      const res = await fetch(`/api/bot/proxy/${path}`, { ...opts, headers: { "Content-Type": "application/json", ...opts?.headers } });
      return await res.json();
    } catch (e) {
      showToast("Error de conexión", "error");
      return null;
    }
  }, [showToast]);

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, guildsRes] = await Promise.all([
          fetch("/api/bot/proxy/public/stats").then(r => r.json()).catch(() => null),
          fetch("/api/bot/guilds").then(r => r.json()).catch(() => null),
        ]);
        if (statsRes) setStats(statsRes);
        if (guildsRes) setGuilds(Array.isArray(guildsRes) ? guildsRes : []);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const loadGuild = useCallback(async (guildId: string) => {
    setSelectedServer(guildId);
    setActiveTab("inicio");
    const data = await api(`public/guild/${guildId}`);
    if (data?.ok) {
      const cfg = data.config || {};
      if (data.ticketConfig) cfg.tickets = data.ticketConfig;
      setGuildConfig(cfg);
      setChannels(data.channels || []);
      setRoles(data.roles || []);
    }
  }, [api]);

  useEffect(() => {
    if (activeTab === "hierarchy" && isOwner) {
      api("staff").then((s: any) => { if (s?.members) setHierarchy(Object.values(s.members)); }).catch(() => {});
    }
  }, [activeTab, isOwner, api]);

  const saveConfig = useCallback(async (path: string, body: any) => {
    const publicPath = path.replace(/guild\/([^/]+)/, 'public/guild/$1');
    const res = await api(publicPath, { method: "POST", body: JSON.stringify(body) });
    if (res?.ok !== false) {
      showToast("Guardado correctamente", "success");
      if (selectedServer) loadGuild(selectedServer);
    } else {
      showToast(res?.msg || "Error al guardar", "error");
    }
  }, [api, showToast, selectedServer, loadGuild]);

  const filteredGuilds = guilds.filter((g: any) => !searchQuery || g.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0f1a" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#5865F2] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0f0f1a" }}>
        <div className="glass rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#5865F2]/20 flex items-center justify-center mx-auto mb-6"><Shield size={32} className="text-[#5865F2]" /></div>
          <h2 className="text-2xl font-black mb-3"><span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">Panel de Control</span></h2>
          <p className="text-gray-500 mb-8">Inicia sesión con tu cuenta de Discord para gestionar tus servidores.</p>
          <button onClick={() => window.location.href = "/api/auth/discord"} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors font-bold text-white">
            <Bot size={18} /> Iniciar sesión con Discord
          </button>
        </div>
      </div>
    );
  }

  if (!selectedServer) {
    return (
      <div className="min-h-screen" style={{ background: "#0f0f1a" }}>
        <header className="border-b border-white/5" style={{ background: "#141428" }}>
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#5865F2]/20 flex items-center justify-center"><Bot size={18} className="text-[#5865F2]" /></div>
              <span className="font-bold text-white">System 777</span>
            </div>
            <div className="flex items-center gap-3">
              <a href={BOT_INVITE} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-[#5865F2]/10 text-[#5865F2] text-xs font-semibold hover:bg-[#5865F2]/20">Invítame</a>
              <a href={SUPPORT_SERVER} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 text-xs hover:bg-white/10">Soporte</a>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
                {session.user?.image && <Image src={session.user.image} alt="" width={24} height={24} className="rounded-full" />}
                <span className="text-sm text-white">{session.user?.name}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Selecciona un servidor</h1>
            <p className="text-gray-500">Estás en un total de {guilds.length} servidores.</p>
          </div>
          <div className="flex gap-3 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar servidor..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
            </div>
            <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm hover:bg-white/10"><RefreshCw size={14} /> Actualizar</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGuilds.map((guild: any) => (
              <motion.div key={guild.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-5 hover:-translate-y-0.5 transition-all cursor-pointer" style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.05)" }} onClick={() => loadGuild(guild.id)}>
                <div className="flex items-center gap-4 mb-4">
                  {guild.icon ? (
                    <Image src={guild.icon} alt={guild.name} width={56} height={56} className="rounded-2xl" unoptimized />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-[#5865F2]/20 flex items-center justify-center"><span className="text-[#5865F2] font-black text-xl">{guild.name?.[0]}</span></div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white truncate">{guild.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Users size={10} /> {guild.members?.toLocaleString()} Miembros</div>
                    {guild.inBot && <div className="text-xs text-[#57F287] mt-1">✅ Bot activo</div>}
                    {!guild.inBot && <div className="text-xs text-gray-600 mt-1">⚠️ Bot no está en este servidor</div>}
                    {!guild.isAdmin && <div className="text-xs text-yellow-500/70 mt-1">👁️ Solo lectura</div>}
                  </div>
                </div>
                <button disabled={!guild.inBot} className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${guild.inBot ? "bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/20" : "bg-white/5 text-gray-600 cursor-not-allowed"}`}>{guild.inBot ? (guild.isAdmin ? "Configurar" : "Ver") : "Invitar Bot"}</button>
              </motion.div>
            ))}
          </div>
          {filteredGuilds.length === 0 && (
            <div className="text-center py-20">
              <Server size={48} className="text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron servidores.</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  const selectedGuild = guilds.find((g: any) => g.id === selectedServer);
  const channelOptions = [{ value: "", label: "Seleccionar canal..." }, ...channels.map((c: any) => ({ value: c.id, label: `#${c.name}` }))];
  const roleOptions = [{ value: "", label: "Seleccionar rol..." }, ...roles.map((r: any) => ({ value: r.id, label: `@${r.name}` }))];
  const catOptions = [{ value: "", label: "Seleccionar categoría..." }, ...channels.filter((c: any) => c.type === 4).map((c: any) => ({ value: c.id, label: c.name }))];

  return (
    <div className="flex min-h-screen" style={{ background: "#0f0f1a" }}>
      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</AnimatePresence>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} flex-shrink-0 transition-all duration-300 flex flex-col border-r border-white/5`} style={{ background: "#141428" }}>
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            {selectedGuild?.icon ? (
              <Image src={selectedGuild.icon} alt="" width={36} height={36} className="rounded-xl flex-shrink-0" unoptimized />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[#5865F2]/20 flex items-center justify-center flex-shrink-0"><span className="text-[#5865F2] font-bold text-sm">{selectedGuild?.name?.[0]}</span></div>
            )}
            {sidebarOpen && <div className="min-w-0 flex-1"><div className="text-sm font-bold text-white truncate">{selectedGuild?.name}</div><div className="text-xs text-gray-500">{selectedGuild?.members?.toLocaleString()} miembros</div></div>}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {(isOwner ? OWNER_NAV : MEMBER_NAV).map((section) => (
            <div key={section.category} className="mb-3">
              {sidebarOpen && <div className="px-3 py-1.5 text-xs font-semibold text-gray-600 uppercase">{section.category}</div>}
              {section.items.map((item) => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${activeTab === item.id ? "bg-[#5865F2]/15 text-[#5865F2]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  <item.icon size={16} className="flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5 space-y-1">
          <button onClick={() => setSelectedServer(null)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5">
            <ChevronLeft size={16} /> {sidebarOpen && "Mis Servidores"}
          </button>
          <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10">
            <Power size={16} /> {sidebarOpen && "Cerrar Sesión"}
          </button>
        </div>

        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 border-t border-white/5 text-gray-500 hover:text-white">
          {sidebarOpen ? <ChevronLeft size={16} className="mx-auto" /> : <ChevronRight size={16} className="mx-auto" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {activeTab === "inicio" && (
            <div className="space-y-6">
              <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, #5865F220, #7C3AED20)", border: "1px solid rgba(88,101,242,0.2)" }}>
                <h2 className="text-xl font-black text-white mb-2">¡Gracias por agregar System 777!</h2>
                <p className="text-gray-400 text-sm mb-4">Aquí tienes algunas funciones populares para empezar:</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setActiveTab("welcome")} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors">👋 Dar la bienvenida</button>
                  <button onClick={() => setActiveTab("levels")} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors">⭐ Configurar niveles</button>
                  <button onClick={() => setActiveTab("modules")} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors">⚡ Activar módulos</button>
                  <button onClick={() => setActiveTab("protection")} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors">🛡️ Protección</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: <Settings size={24} />, title: "Módulos", desc: "Activa o desactiva funciones del bot", tab: "modules", color: "#5865F2" },
                  { icon: <Crown size={24} />, title: "Premium", desc: "Obtén funciones exclusivas", tab: "premiumadmin", color: "#FEE75C" },
                  { icon: <Shield size={24} />, title: "Protección", desc: "Anti-raid, anti-spam y más", tab: "protection", color: "#57F287" },
                  { icon: <MessageSquare size={24} />, title: "Bienvenida", desc: "Mensajes automáticos de entrada", tab: "welcome", color: "#EB459E" },
                  { icon: <Ticket size={24} />, title: "Tickets", desc: "Sistema de soporte por tickets", tab: "tickets", color: "#FEE75C" },
                  { icon: <BarChart3 size={24} />, title: "Niveles", desc: "Sistema de XP y rangos", tab: "levels", color: "#57F287" },
                ].map((card) => (
                  <button key={card.title} onClick={() => setActiveTab(card.tab)} className="glass rounded-2xl p-6 text-left hover:-translate-y-0.5 transition-all">
                    <div className="mb-3" style={{ color: card.color }}>{card.icon}</div>
                    <div className="font-bold text-white mb-1">{card.title}</div>
                    <div className="text-xs text-gray-500">{card.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "modules" && (
            <ModulesSection config={guildConfig} saveConfig={saveConfig} />
          )}

          {activeTab === "welcome" && (
            <WelcomeSection config={guildConfig} channels={channelOptions} saveConfig={saveConfig} />
          )}

          {activeTab === "tickets" && (
            <TicketsSection config={guildConfig} channels={channelOptions} roles={roleOptions} categories={catOptions} saveConfig={saveConfig} api={api} guildId={selectedServer!} showToast={showToast} />
          )}

          {activeTab === "autorole" && (
            <AutoroleSection config={guildConfig} roles={roleOptions} saveConfig={saveConfig} />
          )}

          {activeTab === "logs" && (
            <LogsSection config={guildConfig} channels={channelOptions} saveConfig={saveConfig} />
          )}

          {activeTab === "protection" && (
            <ProtectionSection config={guildConfig} channels={channelOptions} saveConfig={saveConfig} />
          )}

          {activeTab === "moderation" && (
            <ModerationSection guildId={selectedServer!} api={api} />
          )}

          {activeTab === "levels" && (
            <LevelsSection config={guildConfig} channels={channelOptions} roles={roleOptions} saveConfig={saveConfig} api={api} guildId={selectedServer!} />
          )}

          {activeTab === "economy" && (
            <EconomySection config={guildConfig} saveConfig={saveConfig} api={api} guildId={selectedServer!} />
          )}

          {activeTab === "verification" && (
            <VerificationSection config={guildConfig} channels={channelOptions} roles={roleOptions} saveConfig={saveConfig} api={api} guildId={selectedServer!} showToast={showToast} />
          )}

          {activeTab === "botcontrol" && <BotControlSection api={api} stats={stats} />}
          {activeTab === "globalbans" && <GlobalBansSection api={api} />}
          {activeTab === "broadcast" && <BroadcastSection api={api} showToast={showToast} />}
          {activeTab === "ipbans" && <IPBansSection api={api} />}
          {activeTab === "staff" && <StaffSection api={api} />}
          {activeTab === "analytics" && <AnalyticsSection api={api} />}
          {activeTab === "premiumadmin" && <PremiumAdminSection api={api} />}
          {activeTab === "jarvis" && <JarvisSection api={api} stats={stats} />}
          {activeTab === "botlogs" && <BotLogsSection api={api} />}
          {activeTab === "notifications" && <NotificationsSection api={api} channels={channelOptions} roles={roleOptions} guildId={selectedServer!} showToast={showToast} />}
          {activeTab === "hierarchy" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white">{isOwner ? "Jerarquía del Staff" : "Mi Jerarquía"}</h2>
              {isOwner && (
                <div className="glass rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-white">Agregar Staff</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input value={hierarchyForm.userId} onChange={(e) => setHierarchyForm({ ...hierarchyForm, userId: e.target.value })} placeholder="User ID" className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
                    <SelectInput value={hierarchyForm.rank} onChange={(v) => setHierarchyForm({ ...hierarchyForm, rank: v })} label="Rango" options={[
                      { value: "trial_staff", label: "🔰 Trial Staff" },
                      { value: "ticket_staff", label: "🎫 Ticket Staff" },
                      { value: "support", label: "💬 Support" },
                      { value: "moderator", label: "🔨 Moderator" },
                      { value: "admin", label: "🛡️ Admin" },
                      { value: "developer", label: "⚙️ Developer" },
                      { value: "co_owner", label: "💠 Co-Owner" },
                    ]} />
                    <input value={hierarchyForm.note} onChange={(e) => setHierarchyForm({ ...hierarchyForm, note: e.target.value })} placeholder="Nota (opcional)" className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
                  </div>
                  <button onClick={async () => { const r = await api("staff/add", { method: "POST", body: JSON.stringify(hierarchyForm) }); if (r?.ok !== false) { showToast("Staff agregado", "success"); const s = await api("staff"); if (s?.members) setHierarchy(Object.values(s.members)); } else showToast(r?.msg || "Error", "error"); }} className="px-4 py-2 rounded-xl bg-[#5865F2] text-white text-sm font-bold hover:bg-[#4752c4]">Agregar</button>
                </div>
              )}
              <div className="glass rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/5"><th className="text-left px-4 py-3 text-gray-500">Miembro</th><th className="text-left px-4 py-3 text-gray-500">Rango</th><th className="text-left px-4 py-3 text-gray-500">Desde</th>{isOwner && <th className="text-left px-4 py-3 text-gray-500">Acciones</th>}</tr></thead>
                  <tbody>
                    {hierarchy.map((m: any) => {
                      const ranks: Record<string, { icon: string; label: string; color: string }> = { owner: { icon: "👑", label: "Owner", color: "#FFD700" }, co_owner: { icon: "💠", label: "Co-Owner", color: "#FF8C00" }, developer: { icon: "⚙️", label: "Developer", color: "#9B59B6" }, admin: { icon: "🛡️", label: "Admin", color: "#E74C3C" }, moderator: { icon: "🔨", label: "Moderator", color: "#3498DB" }, support: { icon: "💬", label: "Support", color: "#2ECC71" }, premium_manager: { icon: "💎", label: "Premium Manager", color: "#F1C40F" }, ticket_staff: { icon: "🎫", label: "Ticket Staff", color: "#1ABC9C" }, trial_staff: { icon: "🔰", label: "Trial Staff", color: "#95A5A6" } };
                      const r = ranks[m.rank] || { icon: "?", label: m.rank, color: "#666" };
                      return (
                        <tr key={m.userId} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="px-4 py-3 text-white">{m.userId}</td>
                          <td className="px-4 py-3"><span style={{ color: r.color }}>{r.icon} {r.label}</span></td>
                          <td className="px-4 py-3 text-gray-500">{m.addedAt ? new Date(m.addedAt).toLocaleDateString() : "-"}</td>
                          {isOwner && <td className="px-4 py-3"><button onClick={async () => { await api(`staff/${m.userId}`, { method: "DELETE" }); const s = await api("staff"); if (s?.members) setHierarchy(Object.values(s.members)); }} className="text-red-400 hover:text-red-300 text-xs">Remover</button></td>}
                        </tr>
                      );
                    })}
                    {hierarchy.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Sin staff asignado</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === "botmessages" && isOwner && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white">Mensajes del Bot</h2>
              <div className="glass rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-white">Enviar Mensaje como Bot</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SelectInput value={botMsgTarget} onChange={setBotMsgTarget} label="Destinatario" options={[
                    { value: "all", label: "📢 Todos los servidores" },
                    ...guilds.map((g: any) => ({ value: g.id, label: `🏠 ${g.name}` })),
                  ]} />
                  <input value={botMsgInput} onChange={(e) => setBotMsgInput(e.target.value)} placeholder="Mensaje para enviar..." className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
                </div>
                <div className="flex gap-2">
                  <button onClick={async () => { if (!botMsgInput) return; const r = await api("broadcast", { method: "POST", body: JSON.stringify({ message: botMsgInput, target: botMsgTarget }) }); if (r?.ok !== false) { showToast("Mensaje enviado", "success"); setBotMsgInput(""); setBotMessages([{ text: botMsgInput, target: botMsgTarget, ts: Date.now() }, ...botMessages]); } else showToast(r?.msg || "Error", "error"); }} className="px-4 py-2 rounded-xl bg-[#5865F2] text-white text-sm font-bold hover:bg-[#4752c4]"><Send size={14} className="inline mr-1" /> Enviar</button>
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4">Historial de Mensajes</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {botMessages.map((m: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <Bot size={14} className="text-[#5865F2]" />
                        <span className="text-xs text-gray-500">{m.target === "all" ? "Todos los servidores" : guilds.find((g: any) => g.id === m.target)?.name || m.target}</span>
                        <span className="text-xs text-gray-600">{new Date(m.ts).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm text-gray-300">{m.text}</p>
                    </div>
                  ))}
                  {botMessages.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Sin mensajes enviados aún</p>}
                </div>
              </div>
            </div>
          )}
          </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function ModulesSection({ config, saveConfig }: { config: any; saveConfig: any }) {
  const [modules, setModules] = useState(config?.modules || {});
  const moduleList = [
    { id: "welcome", label: "Bienvenida", icon: "👋", cat: "Comunidad" },
    { id: "goodbye", label: "Despedida", icon: "👋", cat: "Comunidad" },
    { id: "tickets", label: "Tickets", icon: "🎫", cat: "Soporte" },
    { id: "levels", label: "Niveles & XP", icon: "📊", cat: "Engagement" },
    { id: "economy", label: "Economía", icon: "💰", cat: "Engagement" },
    { id: "moderation", label: "Moderación", icon: "⚔️", cat: "Seguridad" },
    { id: "protection", label: "Protección", icon: "🛡️", cat: "Seguridad" },
    { id: "verification", label: "Verificación", icon: "🔐", cat: "Seguridad" },
    { id: "autorole", label: "AutoRole", icon: "🎭", cat: "Comunidad" },
    { id: "logs", label: "Logs", icon: "📜", cat: "Administración" },
  ];
  const toggleModule = (id: string, value: boolean) => {
    const updated = { ...modules, [id]: value };
    setModules(updated);
    saveConfig(`guild/${config?.id || ""}/modules`, { modules: updated });
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white mb-1">⚡ Control de Módulos</h2>
        <p className="text-sm text-gray-500">Activa o desactiva funciones del bot en este servidor.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {moduleList.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <Toggle checked={!!modules[m.id]} onChange={(v) => toggleModule(m.id, v)} label={`${m.icon} ${m.label}`} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function WelcomeSection({ config, channels, saveConfig }: { config: any; channels: any[]; saveConfig: any }) {
  const [welcome, setWelcome] = useState(config?.welcome || { enabled: false, channel: "", title: "", message: "", color: "#5865F2", image: "" });
  const [goodbye, setGoodbye] = useState(config?.goodbye || { enabled: false, channel: "", message: "" });
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-8">
      <div>
        <h2 className="text-xl font-black text-white mb-1">👋 Bienvenida / Despedida</h2>
        <p className="text-sm text-gray-500">Mensajes automáticos cuando alguien entra o sale.</p>
      </div>
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white">Bienvenida</h3>
        <Toggle checked={!!welcome.enabled} onChange={(v) => setWelcome({ ...welcome, enabled: v })} label="Activar bienvenida" />
        <SelectInput value={welcome.channel || ""} onChange={(v) => setWelcome({ ...welcome, channel: v })} options={channels} label="Canal" />
        <TextInput value={welcome.title || ""} onChange={(v) => setWelcome({ ...welcome, title: v })} label="Título del embed" placeholder="¡Bienvenido!" />
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Mensaje</label>
          <textarea value={welcome.message || ""} onChange={(e) => setWelcome({ ...welcome, message: e.target.value })} placeholder="¡Hola {user}! Bienvenido a {server}!" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 h-24 resize-none" />
          <p className="text-xs text-gray-600 mt-1">Variables: {'{user}'} {'{server}'} {'{membercount}'}</p>
        </div>
        <TextInput value={welcome.color || ""} onChange={(v) => setWelcome({ ...welcome, color: v })} label="Color (hex)" placeholder="#5865F2" />
        <TextInput value={welcome.image || ""} onChange={(v) => setWelcome({ ...welcome, image: v })} label="Imagen URL (opcional)" placeholder="https://..." />
        <button onClick={() => saveConfig(`guild/${config?.id || ""}/welcome`, welcome)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5865F2] text-white text-sm font-semibold hover:bg-[#4752c4]"><Save size={14} /> Guardar Bienvenida</button>
      </div>
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white">Despedida</h3>
        <Toggle checked={!!goodbye.enabled} onChange={(v) => setGoodbye({ ...goodbye, enabled: v })} label="Activar despedida" />
        <SelectInput value={goodbye.channel || ""} onChange={(v) => setGoodbye({ ...goodbye, channel: v })} options={channels} label="Canal" />
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Mensaje</label>
          <textarea value={goodbye.message || ""} onChange={(e) => setGoodbye({ ...goodbye, message: e.target.value })} placeholder="¡Adiós {user}!" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 h-24 resize-none" />
        </div>
        <button onClick={() => saveConfig(`guild/${config?.id || ""}/goodbye`, goodbye)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5865F2] text-white text-sm font-semibold hover:bg-[#4752c4]"><Save size={14} /> Guardar Despedida</button>
      </div>
    </motion.div>
  );
}

function TicketsSection({ config, channels, roles, categories, saveConfig, api, guildId, showToast }: any) {
  const tc = config?.tickets || {};
  const [ticketCfg, setTicketCfg] = useState({
    channelId: tc.panelChannel || "",
    supportRoleId: tc.supportRole || "",
    logChannelId: tc.logChannel || "",
    categoryId: tc.ticketCategory || "",
    title: tc.panelTitle || "Soporte",
    description: tc.panelDescription || tc.panelDesc || "Selecciona el tipo de ticket.",
    color: tc.panelColor || "#5865F2",
    prefix: tc.prefix || "ticket",
    maxTickets: tc.maxPerUser || 3,
    pingRole: tc.pingRole || false,
    dmTranscript: tc.dmTranscript !== false,
    welcomeMsg: tc.welcomeMessage || "",
  });
  const [ticketCategories, setTicketCategories] = useState<any[]>(tc.categories || []);
  const publishPanel = async () => {
    const res = await api(`public/guild/${guildId}/tickets/panel`, { method: "POST" });
    if (res?.ok) { showToast(res.msg || "Panel publicado", "success"); } else { showToast(res?.msg || "Error al publicar", "error"); }
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white mb-1">🎫 Tickets</h2>
        <p className="text-sm text-gray-500">Configura el sistema de tickets de soporte.</p>
      </div>
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white">Configuración del Panel</h3>
        <SelectInput value={ticketCfg.channelId} onChange={(v) => setTicketCfg({ ...ticketCfg, channelId: v })} options={channels} label="Canal del panel" />
        <SelectInput value={ticketCfg.supportRoleId} onChange={(v) => setTicketCfg({ ...ticketCfg, supportRoleId: v })} options={roles} label="Rol de Soporte" />
        <SelectInput value={ticketCfg.logChannelId} onChange={(v) => setTicketCfg({ ...ticketCfg, logChannelId: v })} options={channels} label="Canal de Logs" />
        <SelectInput value={ticketCfg.categoryId} onChange={(v) => setTicketCfg({ ...ticketCfg, categoryId: v })} options={categories} label="Categoría Discord" />
        <TextInput value={ticketCfg.title} onChange={(v) => setTicketCfg({ ...ticketCfg, title: v })} label="Título del embed" />
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Descripción</label>
          <textarea value={ticketCfg.description} onChange={(e) => setTicketCfg({ ...ticketCfg, description: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none h-20 resize-none" />
        </div>
        <TextInput value={ticketCfg.color} onChange={(v) => setTicketCfg({ ...ticketCfg, color: v })} label="Color (hex)" />
        <TextInput value={ticketCfg.prefix} onChange={(v) => setTicketCfg({ ...ticketCfg, prefix: v })} label="Prefijo canal" />
        <NumberInput value={ticketCfg.maxTickets} onChange={(v) => setTicketCfg({ ...ticketCfg, maxTickets: v })} label="Máx tickets por usuario" />
        <Toggle checked={!!ticketCfg.pingRole} onChange={(v) => setTicketCfg({ ...ticketCfg, pingRole: v })} label="Ping al rol de soporte" />
        <Toggle checked={!!ticketCfg.dmTranscript} onChange={(v) => setTicketCfg({ ...ticketCfg, dmTranscript: v })} label="DM transcript al cerrar" />
        <TextInput value={ticketCfg.welcomeMsg} onChange={(v) => setTicketCfg({ ...ticketCfg, welcomeMsg: v })} label="Mensaje al abrir ticket" placeholder="Hola {user}, ¿en qué puedo ayudarte?" />
        <div className="flex gap-2">
          <button onClick={() => saveConfig(`guild/${guildId}/tickets/setup`, { ...ticketCfg, categories: ticketCategories })} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5865F2] text-white text-sm font-semibold hover:bg-[#4752c4]"><Save size={14} /> Guardar</button>
          <button onClick={publishPanel} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#57F287]/10 text-[#57F287] text-sm font-semibold hover:bg-[#57F287]/20"><Send size={14} /> Publicar en Discord</button>
        </div>
      </div>
    </div>
  );
}

function AutoroleSection({ config, roles, saveConfig }: any) {
  const [roleId, setRoleId] = useState(config?.autorole?.roleId || "");
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-white mb-1">🎭 AutoRole</h2><p className="text-sm text-gray-500">Rol asignado automáticamente al unirse.</p></div>
      <div className="glass rounded-2xl p-6 space-y-4">
        <SelectInput value={roleId} onChange={setRoleId} options={roles} label="Rol a asignar" />
        <button onClick={() => saveConfig(`guild/${config?.id || ""}/autorole`, { roleId })} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5865F2] text-white text-sm font-semibold hover:bg-[#4752c4]"><Save size={14} /> Guardar</button>
      </div>
    </div>
  );
}

function LogsSection({ config, channels, saveConfig }: any) {
  const [logs, setLogs] = useState(config?.logChannels || { moderation: "", messages: "", members: "", channels: "", roles: "", voice: "" });
  const logTypes = [
    { key: "moderation", label: "Moderación" },
    { key: "messages", label: "Mensajes" },
    { key: "members", label: "Miembros" },
    { key: "channels", label: "Canales" },
    { key: "roles", label: "Roles" },
    { key: "voice", label: "Voz" },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div><h2 className="text-xl font-black text-white mb-1">📜 Logs del Servidor</h2><p className="text-sm text-gray-500">Define qué canales reciben los eventos.</p></div>
      <div className="glass rounded-2xl p-6 space-y-4">
        {logTypes.map((lt) => (
          <SelectInput key={lt.key} value={logs[lt.key] || ""} onChange={(v) => setLogs({ ...logs, [lt.key]: v })} options={channels} label={lt.label} />
        ))}
        <button onClick={() => saveConfig(`guild/${config?.id || ""}/logs`, logs)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5865F2] text-white text-sm font-semibold hover:bg-[#4752c4]"><Save size={14} /> Guardar</button>
      </div>
    </motion.div>
  );
}

function ProtectionSection({ config, channels, saveConfig }: any) {
  const [prot, setProt] = useState(config?.protection || {
    antiraid: { enabled: false, threshold: 5, action: "timeout" },
    antispam: { enabled: false, maxMessages: 5 },
    antiphishing: { enabled: false },
    antialt: { enabled: false, minAge: 7 },
    antinuke: { enabled: false, channels: { threshold: 3, action: "ban" }, roles: { threshold: 3, action: "ban" }, emojis: { threshold: 3, action: "ban" }, bans: { threshold: 3, action: "ban" }, kicks: { threshold: 3, action: "ban" }, webhooks: { threshold: 3, action: "ban" } },
    automod: { antiLinks: false, antiZalgo: false, antiDuplicates: false, antiCaps: false, antiMassMentions: false, antiInvites: false, logChannel: "" },
    wordFilter: { enabled: false, words: "", warningMessage: "", action: "delete" },
  });
  const actionOpts = [{ value: "timeout", label: "Timeout" }, { value: "kick", label: "Kick" }, { value: "ban", label: "Ban" }, { value: "removeRoles", label: "Quitar roles" }, { value: "lockdown", label: "Lockdown" }];
  const nukeActions = [{ value: "removeRoles", label: "Quitar roles" }, { value: "kick", label: "Kick" }, { value: "ban", label: "Ban" }, { value: "lockdown", label: "Lockdown" }];
  const filterActions = [{ value: "delete", label: "Solo eliminar" }, { value: "delete+warn", label: "Eliminar + Warn" }, { value: "delete+timeout", label: "Eliminar + Timeout" }];
  const u = (path: string, val: any) => { const p = path.split("."); const n = { ...prot }; let o: any = n; for (let i = 0; i < p.length - 1; i++) { o = o[p[i]]; } o[p[p.length - 1]] = val; setProt(n); };
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-white mb-1">🛡️ Protección</h2><p className="text-sm text-gray-500">Anti-raid, anti-spam, anti-phishing y más.</p></div>
      {[
        { title: "Anti-Raid", path: "antiraid", hasThreshold: true, threshLabel: "Umbral (joins/10s)", hasAction: true },
        { title: "Anti-Spam", path: "antispam", hasThreshold: true, threshLabel: "Máx mensajes / 5s" },
        { title: "Anti-Phishing", path: "antiphishing" },
        { title: "Anti-Alt", path: "antialt", hasThreshold: true, threshLabel: "Edad mínima (días)" },
      ].map((section) => (
        <div key={section.path} className="glass rounded-2xl p-6 space-y-3">
          <Toggle checked={!!prot[section.path]?.enabled} onChange={(v) => u(`${section.path}.enabled`, v)} label={section.title} />
          {section.hasThreshold && <NumberInput value={prot[section.path]?.threshold || 0} onChange={(v) => u(`${section.path}.threshold`, v)} label={section.threshLabel || "Umbral"} />}
          {section.hasAction && <SelectInput value={prot[section.path]?.action || "timeout"} onChange={(v) => u(`${section.path}.action`, v)} options={actionOpts} label="Acción" />}
        </div>
      ))}
      <div className="glass rounded-2xl p-6 space-y-4">
        <Toggle checked={!!prot.antinuke?.enabled} onChange={(v) => u("antinuke.enabled", v)} label="💣 Anti-Nuke" />
        {prot.antinuke?.enabled && ["channels", "roles", "emojis", "bans", "kicks", "webhooks"].map((key) => (
          <div key={key} className="pl-4 border-l-2 border-white/5 space-y-2">
            <p className="text-sm text-gray-400 capitalize">{key}</p>
            <div className="flex gap-3">
              <div className="flex-1"><NumberInput value={prot.antinuke?.[key]?.threshold || 3} onChange={(v) => u(`antinuke.${key}.threshold`, v)} label="Umbral" /></div>
              <div className="flex-1"><SelectInput value={prot.antinuke?.[key]?.action || "ban"} onChange={(v) => u(`antinuke.${key}.action`, v)} options={nukeActions} label="Acción" /></div>
            </div>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-6 space-y-3">
        <h3 className="font-bold text-white">📝 AutoMod</h3>
        {["antiLinks", "antiZalgo", "antiDuplicates", "antiCaps", "antiMassMentions", "antiInvites"].map((key) => (
          <Toggle key={key} checked={!!prot.automod?.[key]} onChange={(v) => u(`automod.${key}`, v)} label={key.replace(/([A-Z])/g, " $1").replace("anti ", "").trim()} />
        ))}
        <SelectInput value={prot.automod?.logChannel || ""} onChange={(v) => u("automod.logChannel", v)} options={channels} label="Canal de logs AutoMod" />
      </div>
      <div className="glass rounded-2xl p-6 space-y-3">
        <h3 className="font-bold text-white">🚫 Filtro de Palabras</h3>
        <Toggle checked={!!prot.wordFilter?.enabled} onChange={(v) => u("wordFilter.enabled", v)} label="Activar filtro" />
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Palabras bloqueadas (una por línea)</label>
          <textarea value={prot.wordFilter?.words || ""} onChange={(e) => u("wordFilter.words", e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none h-24 resize-none font-mono" />
        </div>
        <TextInput value={prot.wordFilter?.warningMessage || ""} onChange={(v) => u("wordFilter.warningMessage", v)} label="Mensaje de advertencia" />
        <SelectInput value={prot.wordFilter?.action || "delete"} onChange={(v) => u("wordFilter.action", v)} options={filterActions} label="Acción" />
      </div>
      <button onClick={() => saveConfig(`guild/${config?.id || ""}/protection`, prot)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5865F2] text-white text-sm font-semibold hover:bg-[#4752c4]"><Save size={14} /> Guardar Protección</button>
    </div>
  );
}

function ModerationSection({ guildId, api }: { guildId: string; api: any }) {
  const [form, setForm] = useState({ userId: "", reason: "", duration: "5", deleteDays: "0" });
  const [cases, setCases] = useState<any[]>([]);
  const [loadingCases, setLoadingCases] = useState(false);
  const loadCases = async () => { setLoadingCases(true); const d = await api(`cases/${guildId}`); setCases(d?.cases || []); setLoadingCases(false); };
  useEffect(() => { loadCases(); }, []);
  const doAction = async (action: string) => {
    const res = await api(`guild/${guildId}/action`, { method: "POST", body: JSON.stringify({ action, userId: form.userId, reason: form.reason, duration: action === "timeout" ? Number(form.duration) : undefined, deleteDays: action === "ban" ? Number(form.deleteDays) : undefined }) });
    if (res?.ok) loadCases();
  };
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-white mb-1">⚔️ Moderación</h2><p className="text-sm text-gray-500">Acciones rápidas y casos recientes.</p></div>
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white">⚡ Acción Rápida</h3>
        <TextInput value={form.userId} onChange={(v) => setForm({ ...form, userId: v })} label="User ID" placeholder="123456789" />
        <TextInput value={form.reason} onChange={(v) => setForm({ ...form, reason: v })} label="Razón" />
        <div className="grid grid-cols-2 gap-3">
          <SelectInput value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} options={[{ value: "5", label: "5 min" }, { value: "10", label: "10 min" }, { value: "30", label: "30 min" }, { value: "60", label: "1 hora" }, { value: "360", label: "6 horas" }, { value: "720", label: "12 horas" }, { value: "1440", label: "1 día" }, { value: "10080", label: "7 días" }]} label="Duración timeout" />
          <SelectInput value={form.deleteDays} onChange={(v) => setForm({ ...form, deleteDays: v })} options={[{ value: "0", label: "No eliminar" }, { value: "1", label: "Últimas 24h" }, { value: "7", label: "Últimos 7 días" }]} label="Ban - eliminar msgs" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => doAction("warn")} className="flex-1 py-2.5 rounded-xl bg-[#FEE75C]/10 text-[#FEE75C] text-sm font-semibold hover:bg-[#FEE75C]/20">⚠️ Warn</button>
          <button onClick={() => doAction("timeout")} className="flex-1 py-2.5 rounded-xl bg-[#5865F2]/10 text-[#5865F2] text-sm font-semibold hover:bg-[#5865F2]/20">⏱️ Timeout</button>
          <button onClick={() => doAction("kick")} className="flex-1 py-2.5 rounded-xl bg-[#FEE75C]/10 text-[#FEE75C] text-sm font-semibold hover:bg-[#FEE75C]/20">👢 Kick</button>
          <button onClick={() => doAction("ban")} className="flex-1 py-2.5 rounded-xl bg-[#ED4245]/10 text-[#ED4245] text-sm font-semibold hover:bg-[#ED4245]/20">⛔ Ban</button>
        </div>
      </div>
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">📋 Casos ({cases.length})</h3>
          <button onClick={loadCases} className="text-xs text-gray-500 hover:text-white flex items-center gap-1"><RefreshCw size={12} /> Actualizar</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-gray-500 text-xs"><th className="text-left py-2">#</th><th className="text-left py-2">Tipo</th><th className="text-left py-2">Usuario</th><th className="text-left py-2">Razón</th><th className="text-left py-2">Fecha</th></tr></thead>
            <tbody>{cases.map((c: any, i: number) => (
              <tr key={i} className="border-t border-white/5"><td className="py-2 text-gray-400">{c.caseNumber || i + 1}</td><td className="py-2"><span className="px-2 py-0.5 rounded text-xs bg-white/5">{c.type}</span></td><td className="py-2 text-gray-300">{c.targetId}</td><td className="py-2 text-gray-400 truncate max-w-[200px]">{c.reason}</td><td className="py-2 text-gray-500 text-xs">{new Date(c.timestamp).toLocaleDateString()}</td></tr>
            ))}</tbody>
          </table>
        </div>
        {cases.length === 0 && <p className="text-gray-600 text-sm text-center py-4">Sin casos</p>}
      </div>
    </div>
  );
}

function LevelsSection({ config, channels, roles, saveConfig, api, guildId }: any) {
  const [lvl, setLvl] = useState(config?.levels || { enabled: false, xpPerMessage: 15, xpPerVoiceMin: 10, announceChannel: "", multiplier: "1", levelUpMsg: "¡{user} subió al nivel {level}!", ignoreBots: true, resetRoles: false, rewards: [] });
  const [top, setTop] = useState<any[]>([]);
  const [newReward, setNewReward] = useState({ level: 0, roleId: "" });
  useEffect(() => { api(`guild/${guildId}/levels/top`).then((d: any) => setTop(d?.top || [])); }, []);
  const multiplierOpts = [{ value: "1", label: "1× Normal" }, { value: "1.5", label: "1.5× Boost" }, { value: "2", label: "2× Doble XP" }, { value: "3", label: "3× Triple XP" }];
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-white mb-1">📊 Niveles & XP</h2><p className="text-sm text-gray-500">Sistema de experiencia y recompensas.</p></div>
      <div className="glass rounded-2xl p-6 space-y-4">
        <Toggle checked={!!lvl.enabled} onChange={(v) => setLvl({ ...lvl, enabled: v })} label="Activar sistema de niveles" />
        <div className="grid grid-cols-2 gap-3">
          <NumberInput value={lvl.xpPerMessage || 15} onChange={(v) => setLvl({ ...lvl, xpPerMessage: v })} label="XP por mensaje" />
          <NumberInput value={lvl.xpPerVoiceMin || 10} onChange={(v) => setLvl({ ...lvl, xpPerVoiceMin: v })} label="XP en voz (por min)" />
        </div>
        <SelectInput value={lvl.announceChannel || ""} onChange={(v) => setLvl({ ...lvl, announceChannel: v })} options={channels} label="Canal de anuncio" />
        <SelectInput value={lvl.multiplier || "1"} onChange={(v) => setLvl({ ...lvl, multiplier: v })} options={multiplierOpts} label="Multiplicador global" />
        <TextInput value={lvl.levelUpMsg || ""} onChange={(v) => setLvl({ ...lvl, levelUpMsg: v })} label="Mensaje de subida" />
        <Toggle checked={!!lvl.ignoreBots} onChange={(v) => setLvl({ ...lvl, ignoreBots: v })} label="Ignorar bots" />
        <Toggle checked={!!lvl.resetRoles} onChange={(v) => setLvl({ ...lvl, resetRoles: v })} label="Resetear roles al subir" />
      </div>
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white">🎭 Recompensas por Nivel</h3>
        <div className="flex gap-3">
          <NumberInput value={newReward.level} onChange={(v) => setNewReward({ ...newReward, level: v })} label="Nivel" />
          <div className="flex-1"><SelectInput value={newReward.roleId} onChange={(v) => setNewReward({ ...newReward, roleId: v })} options={roles} label="Rol" /></div>
          <button onClick={() => { if (newReward.roleId) setLvl({ ...lvl, rewards: [...(lvl.rewards || []), newReward] }); setNewReward({ level: 0, roleId: "" }); }} className="self-end px-4 py-2.5 rounded-xl bg-[#57F287]/10 text-[#57F287] text-sm font-semibold hover:bg-[#57F287]/20"><Plus size={14} /></button>
        </div>
        <div className="space-y-2">{(lvl.rewards || []).map((r: any, i: number) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]"><span className="text-sm text-gray-300">Nivel {r.level} → {roles.find((o: any) => o.value === r.roleId)?.label || r.roleId}</span><button onClick={() => setLvl({ ...lvl, rewards: lvl.rewards.filter((_: any, j: number) => j !== i) })} className="text-red-400 hover:text-red-300"><Trash2 size={12} /></button></div>
        ))}</div>
      </div>
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold text-white mb-3">🏆 Top Niveles</h3>
        <div className="space-y-2">{top.map((t: any, i: number) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.03]"><span className="text-xs text-gray-600 w-6">#{i + 1}</span><span className="text-sm text-gray-300">{t.userId}</span><span className="ml-auto text-xs text-[#5865F2]">Lv {t.level} · {t.xp} XP</span></div>
        ))}</div>
        {top.length === 0 && <p className="text-gray-600 text-sm text-center py-4">Sin datos</p>}
      </div>
      <button onClick={() => saveConfig(`guild/${guildId}/levels`, lvl)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5865F2] text-white text-sm font-semibold hover:bg-[#4752c4]"><Save size={14} /> Guardar Niveles</button>
    </div>
  );
}

function EconomySection({ config, saveConfig, api, guildId }: any) {
  const [eco, setEco] = useState(config?.economy || { enabled: false, currencySingular: "coin", currencyPlural: "coins", emoji: "🪙", initialBalance: 100, dailyReward: 50, workReward: 100, dailyCooldown: 24, workCooldown: 1, allowRob: true, maxRobPercent: 20, slotsMultiplier: 5, minSlotBet: 10, maxSlotBet: 1000 });
  const [top, setTop] = useState<any[]>([]);
  useEffect(() => { api(`guild/${guildId}/economy/top`).then((d: any) => setTop(d?.top || [])); }, []);
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-white mb-1">💰 Economía</h2><p className="text-sm text-gray-500">Monedas, trabajo, apuestas y más.</p></div>
      <div className="glass rounded-2xl p-6 space-y-4">
        <Toggle checked={!!eco.enabled} onChange={(v) => setEco({ ...eco, enabled: v })} label="Activar economía" />
        <div className="grid grid-cols-3 gap-3">
          <TextInput value={eco.currencySingular} onChange={(v) => setEco({ ...eco, currencySingular: v })} label="Moneda (singular)" />
          <TextInput value={eco.currencyPlural} onChange={(v) => setEco({ ...eco, currencyPlural: v })} label="Moneda (plural)" />
          <TextInput value={eco.emoji} onChange={(v) => setEco({ ...eco, emoji: v })} label="Emoji" />
        </div>
        <NumberInput value={eco.initialBalance} onChange={(v) => setEco({ ...eco, initialBalance: v })} label="Balance inicial" />
        <div className="grid grid-cols-2 gap-3">
          <NumberInput value={eco.dailyReward} onChange={(v) => setEco({ ...eco, dailyReward: v })} label="Reward /daily" />
          <NumberInput value={eco.workReward} onChange={(v) => setEco({ ...eco, workReward: v })} label="Reward /work" />
          <NumberInput value={eco.dailyCooldown} onChange={(v) => setEco({ ...eco, dailyCooldown: v })} label="Cooldown /daily (horas)" />
          <NumberInput value={eco.workCooldown} onChange={(v) => setEco({ ...eco, workCooldown: v })} label="Cooldown /work (horas)" />
        </div>
        <Toggle checked={!!eco.allowRob} onChange={(v) => setEco({ ...eco, allowRob: v })} label="Permitir /rob" />
        <div className="grid grid-cols-3 gap-3">
          <NumberInput value={eco.maxRobPercent} onChange={(v) => setEco({ ...eco, maxRobPercent: v })} label="% máximo robable" />
          <NumberInput value={eco.slotsMultiplier} onChange={(v) => setEco({ ...eco, slotsMultiplier: v })} label="Multiplicador slots" />
          <NumberInput value={eco.minSlotBet} onChange={(v) => setEco({ ...eco, minSlotBet: v })} label="Apuesta mín /slots" />
        </div>
        <NumberInput value={eco.maxSlotBet} onChange={(v) => setEco({ ...eco, maxSlotBet: v })} label="Apuesta máx /slots" />
      </div>
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold text-white mb-3">🏆 Top Riqueza</h3>
        <div className="space-y-2">{top.map((t: any, i: number) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.03]"><span className="text-xs text-gray-600 w-6">#{i + 1}</span><span className="text-sm text-gray-300">{t.userId}</span><span className="ml-auto text-xs text-[#FEE75C]">{eco.emoji} {t.balance?.toLocaleString()}</span></div>
        ))}</div>
        {top.length === 0 && <p className="text-gray-600 text-sm text-center py-4">Sin datos</p>}
      </div>
      <button onClick={() => saveConfig(`guild/${guildId}/economy`, eco)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5865F2] text-white text-sm font-semibold hover:bg-[#4752c4]"><Save size={14} /> Guardar Economía</button>
    </div>
  );
}

function VerificationSection({ config, channels, roles, saveConfig, api, guildId, showToast }: any) {
  const [verifyCfg, setVerifyCfg] = useState(config?.verifyCfg || { active: false, channelId: "", roleId: "", customMsg: "" });
  const setupVerify = async () => { 
    const res = await api(`public/guild/${guildId}/verify/setup`, { method: "POST", body: JSON.stringify({ channelId: verifyCfg.channelId, roleId: verifyCfg.roleId, customMsg: verifyCfg.customMsg }) }); 
    if (res?.ok) { showToast(res.msg || "Verificación publicada", "success"); } else { showToast(res?.msg || "Error", "error"); }
  };
  const removeVerify = async () => { 
    const res = await api(`public/guild/${guildId}/verify/remove`, { method: "POST" }); 
    if (res?.ok) { showToast("Verificación desactivada", "success"); } else { showToast(res?.msg || "Error", "error"); }
  };
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-white mb-1">🔐 Verificación</h2><p className="text-sm text-gray-500">Canal de verificación con IP tracking.</p></div>
      <div className="glass rounded-2xl p-6 space-y-4">
        {verifyCfg.active && <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#57F287]/10 text-[#57F287] text-sm"><CheckCircle size={14} /> Verificación Activa</div>}
        <Toggle checked={!!verifyCfg.active} onChange={(v) => setVerifyCfg({ ...verifyCfg, active: v })} label="Activar verificación" />
        <SelectInput value={verifyCfg.channelId} onChange={(v) => setVerifyCfg({ ...verifyCfg, channelId: v })} options={channels} label="Canal de verificación" />
        <SelectInput value={verifyCfg.roleId} onChange={(v) => setVerifyCfg({ ...verifyCfg, roleId: v })} options={roles} label="Rol de verificación" />
        <TextInput value={verifyCfg.customMsg} onChange={(v) => setVerifyCfg({ ...verifyCfg, customMsg: v })} label="Mensaje personalizado" />
        <div className="flex gap-2">
          <button onClick={setupVerify} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5865F2] text-white text-sm font-semibold hover:bg-[#4752c4]"><Send size={14} /> Publicar</button>
          <button onClick={removeVerify} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#ED4245]/10 text-[#ED4245] text-sm font-semibold hover:bg-[#ED4245]/20"><Trash2 size={14} /> Desactivar</button>
        </div>
      </div>
    </div>
  );
}

function BotControlSection({ api, stats }: { api: any; stats: any }) {
  const [power, setPower] = useState({ online: false, ping: 0 });
  useEffect(() => { api("power").then((d: any) => setPower(d || {})); }, []);
  const doPower = async (action: string) => { await api("power", { method: "POST", body: JSON.stringify({ action }) }); setTimeout(() => api("power").then((d: any) => setPower(d || {})), 3000); };
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-white mb-1">⚡ Control del Bot</h2><p className="text-sm text-gray-500">Enciende, apaga o reinicia System 777.</p></div>
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-3 h-3 rounded-full ${power.online ? "bg-green-400" : "bg-gray-500"}`} />
          <span className="text-white font-bold">{power.online ? "Online" : "Offline"}</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => doPower("start")} className="flex-1 py-3 rounded-xl bg-[#57F287]/10 text-[#57F287] text-sm font-semibold hover:bg-[#57F287]/20">▶ Encender</button>
          <button onClick={() => doPower("stop")} className="flex-1 py-3 rounded-xl bg-[#ED4245]/10 text-[#ED4245] text-sm font-semibold hover:bg-[#ED4245]/20">⏹ Apagar</button>
          <button onClick={() => doPower("restart")} className="flex-1 py-3 rounded-xl bg-[#FEE75C]/10 text-[#FEE75C] text-sm font-semibold hover:bg-[#FEE75C]/20">↺ Reiniciar</button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center"><div className="text-2xl font-black text-white">{stats?.ping || power.ping || "—"}</div><div className="text-xs text-gray-500">Ping</div></div>
          <div className="text-center"><div className="text-2xl font-black text-white">{stats?.guilds || "—"}</div><div className="text-xs text-gray-500">Servidores</div></div>
          <div className="text-center"><div className="text-2xl font-black text-white">{stats?.memory || "—"} MB</div><div className="text-xs text-gray-500">Memoria</div></div>
        </div>
      </div>
    </div>
  );
}

function GlobalBansSection({ api }: { api: any }) {
  const [form, setForm] = useState({ userId: "", reason: "" });
  const [bans, setBans] = useState<any>({});
  const loadBans = async () => { const d = await api("globalbans"); if (d) setBans(d); };
  useEffect(() => { loadBans(); }, []);
  const addBan = async () => { await api("globalbans", { method: "POST", body: JSON.stringify(form) }); setForm({ userId: "", reason: "" }); loadBans(); };
  const removeBan = async (id: string) => { await api(`globalbans/${id}`, { method: "DELETE" }); loadBans(); };
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-white mb-1">⛔ Bans Globales</h2><p className="text-sm text-gray-500">Banea usuarios en todos los servidores.</p></div>
      <div className="glass rounded-2xl p-6 space-y-4">
        <TextInput value={form.userId} onChange={(v) => setForm({ ...form, userId: v })} label="User ID" />
        <TextInput value={form.reason} onChange={(v) => setForm({ ...form, reason: v })} label="Razón" />
        <button onClick={addBan} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#ED4245] text-white text-sm font-semibold hover:bg-[#ED4245]/80"><Ban size={14} /> Banear</button>
      </div>
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold text-white mb-3">Bans activos ({Object.keys(bans).length})</h3>
        <div className="space-y-2">{Object.entries(bans).map(([id, ban]: [string, any]) => (
          <div key={id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03]"><div><span className="text-sm text-white">{id}</span><span className="text-xs text-gray-500 ml-2">{ban.reason}</span></div><button onClick={() => removeBan(id)} className="text-red-400 hover:text-red-300"><Trash2 size={12} /></button></div>
        ))}</div>
        {Object.keys(bans).length === 0 && <p className="text-gray-600 text-sm text-center py-4">Sin bans</p>}
      </div>
    </div>
  );
}

function BroadcastSection({ api, showToast }: { api: any; showToast: any }) {
  const [msg, setMsg] = useState("");
  const send = async () => { 
    if (!msg.trim()) return;
    const res = await api("public/broadcast", { method: "POST", body: JSON.stringify({ message: msg }) }); 
    if (res?.ok) { setMsg(""); } 
  };
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-white mb-1">📢 Broadcast</h2><p className="text-sm text-gray-500">Envía un mensaje a todos los servidores.</p></div>
      <div className="glass rounded-2xl p-6 space-y-4">
        <div><label className="block text-xs text-gray-500 mb-1.5">Mensaje</label><textarea value={msg} onChange={(e) => setMsg(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none h-32 resize-none" /></div>
        <button onClick={send} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5865F2] text-white text-sm font-semibold hover:bg-[#4752c4]"><Send size={14} /> Enviar a todos</button>
      </div>
    </div>
  );
}

function IPBansSection({ api }: { api: any }) {
  const [ipForm, setIpForm] = useState({ ip: "", reason: "" });
  const [lookupId, setLookupId] = useState("");
  const [lookupIp, setLookupIp] = useState("");
  const [bannedIps, setBannedIps] = useState<any>({});
  const [lookupResult, setLookupResult] = useState<any>(null);
  const loadBans = async () => { const d = await api("ipban"); if (d?.bannedIps) setBannedIps(d.bannedIps); };
  useEffect(() => { loadBans(); }, []);
  const banIp = async () => { await api("ipban", { method: "POST", body: JSON.stringify(ipForm) }); setIpForm({ ip: "", reason: "" }); loadBans(); };
  const unbanIp = async (ip: string) => { await api(`ipban/${ip}`, { method: "DELETE" }); loadBans(); };
  const lookupUser = async () => { const d = await api(`ipregistry/${lookupId}`); setLookupResult(d); };
  const lookupByIp = async () => { const d = await api(`ipregistry/ip/${lookupIp}`); setLookupResult(d); };
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-white mb-1">🌐 IP Bans</h2><p className="text-sm text-gray-500">Banea IPs completas.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white">Banear IP</h3>
          <TextInput value={ipForm.ip} onChange={(v) => setIpForm({ ...ipForm, ip: v })} label="IP" placeholder="1.2.3.4" />
          <TextInput value={ipForm.reason} onChange={(v) => setIpForm({ ...ipForm, reason: v })} label="Razón" />
          <button onClick={banIp} className="w-full py-2.5 rounded-xl bg-[#ED4245]/10 text-[#ED4245] text-sm font-semibold hover:bg-[#ED4245]/20"><Globe size={14} className="inline mr-2" />Banear IP</button>
        </div>
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white">Buscar IPs</h3>
          <TextInput value={lookupId} onChange={setLookupId} label="User ID" />
          <button onClick={lookupUser} className="w-full py-2 rounded-xl bg-white/5 text-gray-300 text-sm hover:bg-white/10">🔍 Buscar por usuario</button>
          <TextInput value={lookupIp} onChange={setLookupIp} label="IP" />
          <button onClick={lookupByIp} className="w-full py-2 rounded-xl bg-white/5 text-gray-300 text-sm hover:bg-white/10">🔍 Buscar por IP</button>
        </div>
      </div>
      {lookupResult && (
        <div className="glass rounded-2xl p-6"><h3 className="font-bold text-white mb-3">Resultado</h3><pre className="text-xs text-gray-400 overflow-auto max-h-48">{JSON.stringify(lookupResult, null, 2)}</pre></div>
      )}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold text-white mb-3">IPs Baneadas ({Object.keys(bannedIps).length})</h3>
        <div className="space-y-2">{Object.entries(bannedIps).map(([ip, ban]: [string, any]) => (
          <div key={ip} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03]"><div><span className="text-sm text-white font-mono">{ip}</span><span className="text-xs text-gray-500 ml-2">{ban.reason}</span></div><button onClick={() => unbanIp(ip)} className="text-red-400 hover:text-red-300"><Trash2 size={12} /></button></div>
        ))}</div>
      </div>
    </div>
  );
}

function StaffSection({ api }: { api: any }) {
  const [form, setForm] = useState({ userId: "", rank: "helper", note: "" });
  const [staff, setStaff] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const load = async () => { const d = await api("staff"); if (d?.staff) setStaff(d.staff); const l = await api("staff/logs?limit=50"); if (l?.logs) setLogs(l.logs); };
  useEffect(() => { load(); }, []);
  const add = async () => { await api("staff/add", { method: "POST", body: JSON.stringify(form) }); setForm({ userId: "", rank: "helper", note: "" }); load(); };
  const remove = async (id: string) => { await api(`staff/${id}`, { method: "DELETE" }); load(); };
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-white mb-1">👮 Staff</h2><p className="text-sm text-gray-500">Gestiona el equipo de staff.</p></div>
      <div className="glass rounded-2xl p-6 space-y-4">
        <TextInput value={form.userId} onChange={(v) => setForm({ ...form, userId: v })} label="User ID" />
        <SelectInput value={form.rank} onChange={(v) => setForm({ ...form, rank: v })} options={[{ value: "helper", label: "Helper" }, { value: "mod", label: "Moderador" }, { value: "admin", label: "Admin" }, { value: "co-owner", label: "Co-Owner" }]} label="Rango" />
        <TextInput value={form.note} onChange={(v) => setForm({ ...form, note: v })} label="Nota" />
        <button onClick={add} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#5865F2] text-white text-sm font-semibold hover:bg-[#4752c4]"><Plus size={14} /> Añadir</button>
      </div>
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold text-white mb-3">Staff ({staff.length})</h3>
        <div className="space-y-2">{staff.map((s: any) => (
          <div key={s.userId} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03]"><div><span className="text-sm text-white">{s.userId}</span><span className="text-xs text-[#5865F2] ml-2">{s.rank}</span>{s.note && <span className="text-xs text-gray-500 ml-2">{s.note}</span>}</div><button onClick={() => remove(s.userId)} className="text-red-400 hover:text-red-300"><Trash2 size={12} /></button></div>
        ))}</div>
      </div>
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold text-white mb-3">📜 Audit Log</h3>
        <div className="space-y-1 max-h-64 overflow-y-auto">{logs.map((l: any, i: number) => (
          <div key={i} className="text-xs text-gray-400 py-1 border-b border-white/5">{l.action} — {l.userId} — {new Date(l.timestamp).toLocaleString()}</div>
        ))}</div>
        {logs.length === 0 && <p className="text-gray-600 text-sm text-center py-4">Sin logs</p>}
      </div>
    </div>
  );
}

function AnalyticsSection({ api }: { api: any }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => { api("analytics").then((d: any) => setData(d)); }, []);
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-white mb-1">📊 Analytics</h2><p className="text-sm text-gray-500">Estadísticas de uso del bot.</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Comandos totales", value: data?.commandsUsed || 0 },
          { label: "Servidores", value: data?.guilds?.length || 0 },
          { label: "Usuarios", value: data?.totalUsers || 0 },
          { label: "Uptime", value: data?.uptime || "—" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-4 text-center"><div className="text-2xl font-black text-white">{typeof s.value === "number" ? s.value.toLocaleString() : s.value}</div><div className="text-xs text-gray-500 mt-1">{s.label}</div></div>
        ))}
      </div>
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold text-white mb-3">Top Comandos</h3>
        <div className="space-y-2">{(data?.topCommands || []).slice(0, 20).map((c: any, i: number) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.03]"><span className="text-xs text-gray-600 w-6">#{i + 1}</span><span className="text-sm text-gray-300">/{c.name}</span><span className="ml-auto text-xs text-gray-500">{c.count} usos</span></div>
        ))}</div>
      </div>
    </div>
  );
}

function PremiumAdminSection({ api }: { api: any }) {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState<any[]>([]);
  const [codes, setCodes] = useState<any[]>([]);
  const [grantForm, setGrantForm] = useState({ userId: "", plan: "Sharingan", days: 30 });
  const [codeForm, setCodeForm] = useState({ plan: "Sharingan", days: 30, uses: 1 });
  useEffect(() => {
    api("premium/users").then((d: any) => setUsers(d?.users || []));
    api("premium/codes").then((d: any) => setCodes(d?.codes || []));
  }, []);
  const grant = async () => { await api("premium/grant", { method: "POST", body: JSON.stringify(grantForm) }); setGrantForm({ userId: "", plan: "Sharingan", days: 30 }); };
  const revoke = async (id: string) => { await api("premium/revoke", { method: "POST", body: JSON.stringify({ userId: id }) }); };
  const genCode = async () => { await api("premium/codes/generate", { method: "POST", body: JSON.stringify(codeForm) }); api("premium/codes").then((d: any) => setCodes(d?.codes || [])); };
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-white mb-1">👑 Premium Admin</h2></div>
      <div className="flex gap-2 overflow-x-auto pb-2">{["users", "codes"].map((t) => (
        <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${tab === t ? "bg-[#5865F2]/20 text-[#5865F2]" : "text-gray-500 hover:text-white"}`}>{t === "users" ? "Usuarios" : "Códigos"}</button>
      ))}</div>
      {tab === "users" && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white">Grant Premium</h3>
          <div className="flex gap-3">
            <div className="flex-1"><TextInput value={grantForm.userId} onChange={(v) => setGrantForm({ ...grantForm, userId: v })} label="User ID" /></div>
            <div className="flex-1"><SelectInput value={grantForm.plan} onChange={(v) => setGrantForm({ ...grantForm, plan: v })} options={[{ value: "Sharingan", label: "Sharingan" }, { value: "Mangekyo", label: "Mangekyo" }, { value: "Rinnegan", label: "Rinnegan" }]} label="Plan" /></div>
            <div className="w-24"><NumberInput value={grantForm.days} onChange={(v) => setGrantForm({ ...grantForm, days: v })} label="Días" /></div>
            <button onClick={grant} className="self-end px-4 py-2.5 rounded-xl bg-[#5865F2] text-white text-sm font-semibold hover:bg-[#4752c4]"><Plus size={14} /></button>
          </div>
          <h3 className="font-bold text-white mt-4">Usuarios ({users.length})</h3>
          <div className="space-y-2">{users.map((u: any) => (
            <div key={u.id || u.userId} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03]"><div><span className="text-sm text-white">{u.username || u.id}</span><span className="text-xs text-[#FEE75C] ml-2">{u.plan || u.tier}</span></div><button onClick={() => revoke(u.id || u.userId)} className="text-red-400 hover:text-red-300 text-xs">Revoke</button></div>
          ))}</div>
        </div>
      )}
      {tab === "codes" && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white">Generar Código</h3>
          <div className="flex gap-3">
            <div className="flex-1"><SelectInput value={codeForm.plan} onChange={(v) => setCodeForm({ ...codeForm, plan: v })} options={[{ value: "Sharingan", label: "Sharingan" }, { value: "Mangekyo", label: "Mangekyo" }, { value: "Rinnegan", label: "Rinnegan" }]} label="Plan" /></div>
            <div className="w-24"><NumberInput value={codeForm.days} onChange={(v) => setCodeForm({ ...codeForm, days: v })} label="Días" /></div>
            <div className="w-24"><NumberInput value={codeForm.uses} onChange={(v) => setCodeForm({ ...codeForm, uses: v })} label="Usos" /></div>
            <button onClick={genCode} className="self-end px-4 py-2.5 rounded-xl bg-[#5865F2] text-white text-sm font-semibold hover:bg-[#4752c4]"><Plus size={14} /></button>
          </div>
          <h3 className="font-bold text-white mt-4">Códigos ({codes.length})</h3>
          <div className="space-y-2">{codes.map((c: any) => (
            <div key={c.code} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03]"><div><span className="text-sm text-white font-mono">{c.code}</span><span className="text-xs text-gray-500 ml-2">{c.plan} · {c.days}d · {c.used || 0}/{c.uses} usos</span></div><button onClick={() => { navigator.clipboard.writeText(c.code); }} className="text-gray-500 hover:text-white"><Copy size={12} /></button></div>
          ))}</div>
        </div>
      )}
    </div>
  );
}

function JarvisSection({ api, stats }: { api: any; stats: any }) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("llama-3.3-70b-versatile");
  const [mode, setMode] = useState("professional");
  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    const res = await api("jarvis/chat", { method: "POST", body: JSON.stringify({ message: input, model, mode }) });
    setMessages((prev) => [...prev, { role: "bot", content: res?.reply || "Error de conexión" }]);
    setLoading(false);
  };
  const quickAction = async (action: string) => {
    setMessages((prev) => [...prev, { role: "user", content: `/${action}` }]);
    setLoading(true);
    const res = await api("jarvis/action", { method: "POST", body: JSON.stringify({ action }) });
    setMessages((prev) => [...prev, { role: "bot", content: res?.result || "Error" }]);
    setLoading(false);
  };
  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-black text-white mb-1">🤖 JARVIS AI</h2><p className="text-sm text-gray-500">Asistente IA integrado.</p></div>
      <div className="flex gap-3">
        <SelectInput value={model} onChange={setModel} options={[{ value: "llama-3.3-70b-versatile", label: "LLaMA 3.3 70B" }, { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B" }, { value: "gemma2-9b-it", label: "Gemma 2 9B" }, { value: "llama-3.1-8b-instant", label: "LLaMA 3.1 8B" }]} label="Modelo" />
        <SelectInput value={mode} onChange={setMode} options={[{ value: "professional", label: "Professional" }, { value: "stark", label: "Stark (Iron Man)" }]} label="Modo" />
      </div>
      <div className="glass rounded-2xl p-4 h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.length === 0 && <div className="text-center text-gray-600 py-20">JARVIS online. ¿En qué puedo ayudarte?</div>}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${m.role === "user" ? "bg-[#5865F2] text-white" : "bg-white/5 text-gray-300"}`}>{m.content}</div>
            </div>
          ))}
          {loading && <div className="flex justify-start"><div className="bg-white/5 px-4 py-2.5 rounded-2xl text-sm text-gray-500">Pensando...</div></div>}
        </div>
        <div className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Escribe un mensaje..." className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none" disabled={loading} />
          <button onClick={send} disabled={loading} className="px-4 py-2.5 rounded-xl bg-[#5865F2] text-white hover:bg-[#4752c4] disabled:opacity-50"><Send size={16} /></button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {["logs", "restart", "pm2", "stats", "error_log"].map((a) => (
          <button key={a} onClick={() => quickAction(a)} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-gray-400 hover:bg-white/10">{a}</button>
        ))}
      </div>
    </div>
  );
}

function BotLogsSection({ api }: { api: any }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const load = async () => { const d = await api("logs"); if (Array.isArray(d)) setLogs(d); };
  useEffect(() => { load(); }, []);
  useEffect(() => { if (!autoRefresh) return; const i = setInterval(load, 5000); return () => clearInterval(i); }, [autoRefresh]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-black text-white mb-1">💻 Bot Logs</h2><p className="text-sm text-gray-500">Últimas 100 entradas de log.</p></div>
        <div className="flex items-center gap-3">
          <Toggle checked={autoRefresh} onChange={setAutoRefresh} label="Auto-refresh" />
          <button onClick={load} className="text-gray-400 hover:text-white"><RefreshCw size={16} /></button>
        </div>
      </div>
      <div className="glass rounded-2xl p-4 font-mono text-xs text-gray-400 h-[500px] overflow-y-auto space-y-1">
        {logs.map((l: any, i: number) => (
          <div key={i} className="py-0.5">{typeof l === "string" ? l : JSON.stringify(l)}</div>
        ))}
        {logs.length === 0 && <div className="text-center text-gray-600 py-20">Sin logs</div>}
      </div>
    </div>
  );
}

function NotificationsSection({ api, channels, roles, guildId, showToast }: any) {
  const [notifs, setNotifs] = useState<any>({ youtube: [], kick: [], tiktok: [] });
  const [history, setHistory] = useState<any[]>([]);
  const [tab, setTab] = useState("youtube");
  const [ytForm, setYtForm] = useState({ channelId: "", discordChannelId: "", roleId: "", message: "", color: "#FF0000" });
  const [kickForm, setKickForm] = useState({ username: "", discordChannelId: "", roleId: "", message: "", color: "#53FC18" });
  const [ttForm, setTtForm] = useState({ username: "", discordChannelId: "", roleId: "", message: "", color: "#000000" });

  useEffect(() => {
    api("notifications").then((d: any) => {
      if (d?.config) setNotifs(d.config);
      if (d?.history) setHistory(d.history);
    });
  }, [api]);

  const addYouTube = async () => {
    if (!ytForm.channelId || !ytForm.discordChannelId) return showToast("Canal ID y canal Discord requeridos", "error");
    const res = await api("notifications/youtube", { method: "POST", body: JSON.stringify({ ...ytForm, guildId }) });
    if (res?.ok) { showToast("YouTube notificación agregada", "success"); setYtForm({ channelId: "", discordChannelId: "", roleId: "", message: "", color: "#FF0000" }); const d = await api("notifications"); if (d?.config) setNotifs(d.config); }
  };
  const removeYouTube = async (id: string) => {
    await api(`notifications/youtube/${id}`, { method: "DELETE" });
    const d = await api("notifications"); if (d?.config) setNotifs(d.config);
  };
  const addKick = async () => {
    if (!kickForm.username || !kickForm.discordChannelId) return showToast("Username y canal Discord requeridos", "error");
    const res = await api("notifications/kick", { method: "POST", body: JSON.stringify({ ...kickForm, guildId }) });
    if (res?.ok) { showToast("Kick notificación agregada", "success"); setKickForm({ username: "", discordChannelId: "", roleId: "", message: "", color: "#53FC18" }); const d = await api("notifications"); if (d?.config) setNotifs(d.config); }
  };
  const removeKick = async (id: string) => {
    await api(`notifications/kick/${id}`, { method: "DELETE" });
    const d = await api("notifications"); if (d?.config) setNotifs(d.config);
  };
  const addTikTok = async () => {
    if (!ttForm.username || !ttForm.discordChannelId) return showToast("Username y canal Discord requeridos", "error");
    const res = await api("notifications/tiktok", { method: "POST", body: JSON.stringify({ ...ttForm, guildId }) });
    if (res?.ok) { showToast("TikTok notificación agregada", "success"); setTtForm({ username: "", discordChannelId: "", roleId: "", message: "", color: "#000000" }); const d = await api("notifications"); if (d?.config) setNotifs(d.config); }
  };
  const removeTikTok = async (id: string) => {
    await api(`notifications/tiktok/${id}`, { method: "DELETE" });
    const d = await api("notifications"); if (d?.config) setNotifs(d.config);
  };
  const checkNow = async () => { await api("notifications/check", { method: "POST" }); showToast("Check completado", "success"); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-black text-white mb-1">🔔 Notificaciones de Streamers</h2><p className="text-sm text-gray-500">Notifica cuando haya contenido nuevo en YouTube, Kick o TikTok.</p></div>
        <button onClick={checkNow} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5865F2]/10 text-[#5865F2] text-sm font-semibold hover:bg-[#5865F2]/20"><RefreshCw size={14} /> Verificar Ahora</button>
      </div>

      <div className="flex gap-2">
        {[{ id: "youtube", label: "YouTube", color: "#FF0000" }, { id: "kick", label: "Kick", color: "#53FC18" }, { id: "tiktok", label: "TikTok", color: "#000000" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === t.id ? "text-white" : "text-gray-400 hover:text-white"}`} style={tab === t.id ? { background: t.color + "20", color: t.color } : { background: "rgba(255,255,255,0.03)" }}>{t.label}</button>
        ))}
      </div>

      {tab === "youtube" && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white">Agregar Canal de YouTube</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput value={ytForm.channelId} onChange={(v: string) => setYtForm({ ...ytForm, channelId: v })} label="Channel ID de YouTube" placeholder="UC-lHJZR3Gqxm24_Vd_AJ5Yw" />
            <SelectInput value={ytForm.discordChannelId} onChange={(v: string) => setYtForm({ ...ytForm, discordChannelId: v })} options={channels} label="Canal Discord" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectInput value={ytForm.roleId} onChange={(v: string) => setYtForm({ ...ytForm, roleId: v })} options={roles} label="Rol a Ping (opcional)" />
            <TextInput value={ytForm.color} onChange={(v: string) => setYtForm({ ...ytForm, color: v })} label="Color" placeholder="#FF0000" />
          </div>
          <TextInput value={ytForm.message} onChange={(v: string) => setYtForm({ ...ytForm, message: v })} label="Mensaje (opcional)" placeholder="Nuevo video: {video} — {url}" />
          <button onClick={addYouTube} className="px-6 py-2.5 rounded-xl bg-[#FF0000] text-white text-sm font-semibold hover:bg-[#CC0000]"><Plus size={14} className="inline mr-1" /> Agregar</button>
          <div className="space-y-2">
            {(notifs.youtube || []).map((s: any) => (
              <div key={s.channelId} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                <span className="text-sm text-white">📺 {s.channelId}</span>
                <button onClick={() => removeYouTube(s.channelId)} className="text-red-400 hover:text-red-300 text-xs"><Trash2 size={12} /></button>
              </div>
            ))}
            {(!notifs.youtube || notifs.youtube.length === 0) && <p className="text-gray-600 text-sm">Sin canales de YouTube configurados</p>}
          </div>
        </div>
      )}

      {tab === "kick" && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white">Agregar Canal de Kick</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput value={kickForm.username} onChange={(v: string) => setKickForm({ ...kickForm, username: v })} label="Username de Kick" placeholder="xqc" />
            <SelectInput value={kickForm.discordChannelId} onChange={(v: string) => setKickForm({ ...kickForm, discordChannelId: v })} options={channels} label="Canal Discord" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectInput value={kickForm.roleId} onChange={(v: string) => setKickForm({ ...kickForm, roleId: v })} options={roles} label="Rol a Ping (opcional)" />
            <TextInput value={kickForm.color} onChange={(v: string) => setKickForm({ ...kickForm, color: v })} label="Color" placeholder="#53FC18" />
          </div>
          <TextInput value={kickForm.message} onChange={(v: string) => setKickForm({ ...kickForm, message: v })} label="Mensaje (opcional)" placeholder="{user} está en directo: {title}" />
          <button onClick={addKick} className="px-6 py-2.5 rounded-xl bg-[#53FC18] text-black text-sm font-semibold hover:bg-[#45E015]"><Plus size={14} className="inline mr-1" /> Agregar</button>
          <div className="space-y-2">
            {(notifs.kick || []).map((s: any) => (
              <div key={s.username} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                <span className="text-sm text-white">🎮 {s.username} {s.isLive && <span className="text-[#53FC18]">🔴 EN DIRECTO</span>}</span>
                <button onClick={() => removeKick(s.username)} className="text-red-400 hover:text-red-300 text-xs"><Trash2 size={12} /></button>
              </div>
            ))}
            {(!notifs.kick || notifs.kick.length === 0) && <p className="text-gray-600 text-sm">Sin canales de Kick configurados</p>}
          </div>
        </div>
      )}

      {tab === "tiktok" && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white">Agregar Canal de TikTok</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput value={ttForm.username} onChange={(v: string) => setTtForm({ ...ttForm, username: v })} label="Username de TikTok" placeholder="@usuario" />
            <SelectInput value={ttForm.discordChannelId} onChange={(v: string) => setTtForm({ ...ttForm, discordChannelId: v })} options={channels} label="Canal Discord" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectInput value={ttForm.roleId} onChange={(v: string) => setTtForm({ ...ttForm, roleId: v })} options={roles} label="Rol a Ping (opcional)" />
            <TextInput value={ttForm.color} onChange={(v: string) => setTtForm({ ...ttForm, color: v })} label="Color" placeholder="#000000" />
          </div>
          <TextInput value={ttForm.message} onChange={(v: string) => setTtForm({ ...ttForm, message: v })} label="Mensaje (opcional)" placeholder="{user} subió: {video}" />
          <button onClick={addTikTok} className="px-6 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800"><Plus size={14} className="inline mr-1" /> Agregar</button>
          <div className="space-y-2">
            {(notifs.tiktok || []).map((s: any) => (
              <div key={s.username} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                <span className="text-sm text-white">🎵 {s.username}</span>
                <button onClick={() => removeTikTok(s.username)} className="text-red-400 hover:text-red-300 text-xs"><Trash2 size={12} /></button>
              </div>
            ))}
            {(!notifs.tiktok || notifs.tiktok.length === 0) && <p className="text-gray-600 text-sm">Sin canales de TikTok configurados</p>}
          </div>
        </div>
      )}

      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold text-white mb-4">📜 Historial de Notificaciones</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {history.map((h: any, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
              <span className={`text-xs px-2 py-0.5 rounded-full ${h.type === "youtube" ? "bg-[#FF0000]/20 text-[#FF0000]" : h.type === "kick" ? "bg-[#53FC18]/20 text-[#53FC18]" : "bg-white/10 text-white"}`}>{h.type}</span>
              <span className="text-sm text-gray-300 truncate">{h.title || h.username || h.channel}</span>
              <span className="text-xs text-gray-600 ml-auto">{h.ts ? new Date(h.ts).toLocaleTimeString() : ""}</span>
            </div>
          ))}
          {history.length === 0 && <p className="text-gray-600 text-sm text-center py-4">Sin notificaciones enviadas aún</p>}
        </div>
      </div>
    </div>
  );
}
