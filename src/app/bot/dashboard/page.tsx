"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Server, Users, Zap, Clock, LogIn, ShieldCheck,
  Activity, Settings, ExternalLink,
  Bot, Crown, Volume2, BarChart3, TrendingUp, Bell,
  Command, Cpu, HardDrive, Globe, Star, Heart,
  Play, Pause, SkipForward, SkipBack, Search, Music, Gamepad2,
} from "lucide-react";

interface BotStats {
  tag: string;
  avatar: string;
  guilds: number;
  users: number;
  ping: number;
  uptime: number;
  memory: string;
  online: boolean;
  commands?: number;
  channels?: number;
  voiceChannels?: number;
}

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  members: number;
  isAdmin?: boolean;
  inBot?: boolean;
  channels?: number;
  modules?: string[];
}

const BOT_INVITE = "https://discord.com/oauth2/authorize?client_id=1502804306125132057&permissions=8&scope=bot%20applications.commands";
const SUPPORT_SERVER = "https://discord.gg/system777";

const categories = [
  { id: "all", label: "Todos", icon: Command, color: "#5865F2" },
  { id: "moderation", label: "Moderación", icon: ShieldCheck, color: "#ED4245" },
  { id: "fun", label: "Diversión", icon: Gamepad2, color: "#FEE75C" },
  { id: "music", label: "Música", icon: Music, color: "#57F287" },
  { id: "economy", label: "Economía", icon: TrendingUp, color: "#EB459E" },
  { id: "util", label: "Utilidad", icon: Settings, color: "#5865F2" },
  { id: "admin", label: "Admin", icon: Crown, color: "#ED4245" },
];

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatMemory(mb: string): string {
  const num = parseFloat(mb);
  if (num > 1024) return `${(num / 1024).toFixed(1)} GB`;
  return `${num} MB`;
}

export default function BotDashboardPage() {
  const [session, setSession] = useState<{ id: string; username: string; global_name: string; avatar: string | null; email: string; accessToken: string } | null>(null);
  const [stats, setStats] = useState<BotStats | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.user) {
          let avatarHash: string | null = null;
          if (data.user.image && data.user.image.includes("discordapp.com")) {
            const parts = data.user.image.split("/");
            avatarHash = parts[parts.length - 1]?.replace(".png", "") || null;
          }
          setSession({
            id: data.user.id,
            username: data.user.username || data.user.name,
            global_name: data.user.name,
            avatar: avatarHash,
            email: data.user.email,
            accessToken: "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!session) return;
    const fetchData = async () => {
      try {
        const [statsRes, guildsRes] = await Promise.allSettled([
          fetch("/api/bot/stats"),
          fetch("/api/bot/guilds"),
        ]);
        if (statsRes.status === "fulfilled" && statsRes.value.ok) setStats(await statsRes.value.json());
        if (guildsRes.status === "fulfilled" && guildsRes.value.ok) {
          const data = await guildsRes.value.json();
          setGuilds(Array.isArray(data) ? data : data.guilds || []);
        }
      } catch {}
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [session]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5865F2] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#5865F2]/20 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} className="text-[#5865F2]" />
          </div>
          <h2 className="text-2xl font-black mb-3">
            <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">Panel de Control</span>
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Inicia sesión con tu cuenta de Discord para acceder al panel y gestionar tus servidores.
          </p>
          <button
            onClick={() => window.location.href = "/api/auth/discord"}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors font-bold text-white"
          >
            <LogIn size={18} />
            Iniciar sesión con Discord
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            {session.avatar && (
              <Image
                src={`https://cdn.discordapp.com/avatars/${session.id}/${session.avatar}.png`}
                alt="avatar"
                width={56}
                height={56}
                className="rounded-full border-2 border-[#5865F2]/30"
              />
            )}
            <div>
              <h1 className="text-2xl font-black">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">
                  Hola, {session.global_name || session.username}
                </span>
              </h1>
              <p className="text-gray-500 text-sm">Panel de control de System 777 Bot</p>
            </div>
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <a href={BOT_INVITE} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white">
              <ExternalLink size={14} /> Invitar Bot
            </a>
            <a href={SUPPORT_SERVER} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm text-gray-300">
              <Globe size={14} /> Soporte
            </a>
          </div>
        </motion.div>

        {stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: <Server size={20} />, label: "Servidores", value: stats.guilds, color: "#5865F2", bg: "bg-[#5865F2]/10" },
              { icon: <Users size={20} />, label: "Usuarios", value: stats.users.toLocaleString(), color: "#7C3AED", bg: "bg-[#7C3AED]/10" },
              { icon: <Zap size={20} />, label: "Ping", value: `${stats.ping}ms`, color: "#FEE75C", bg: "bg-[#FEE75C]/10" },
              { icon: <Clock size={20} />, label: "Uptime", value: formatUptime(stats.uptime), color: "#57F287", bg: "bg-[#57F287]/10" },
            ].map((item) => (
              <div key={item.label} className="glass rounded-xl p-5 hover:-translate-y-0.5 transition-all">
                <div className={`inline-flex p-2.5 rounded-xl ${item.bg} mb-3`} style={{ color: item.color }}>{item.icon}</div>
                <div className="text-2xl font-black text-white">{item.value}</div>
                <div className="text-xs text-gray-500 mt-1">{item.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-2xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative flex-shrink-0">
                <Image src={stats.avatar || "/avatar.png"} alt="bot" width={64} height={64} className="rounded-full border-2 border-[#5865F2]/30" />
                <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-4 border-[#0A0A0A] ${stats.online ? "bg-green-400" : "bg-gray-500"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-xl">{stats.tag}</div>
                <div className="text-sm text-gray-500 flex flex-wrap items-center gap-3 mt-1">
                  <span className={stats.online ? "text-green-400" : "text-gray-500"}>{stats.online ? "● En línea" : "● Desconectado"}</span>
                  <span className="flex items-center gap-1"><Cpu size={12} /> {formatMemory(stats.memory)}</span>
                  <span className="flex items-center gap-1"><Command size={12} /> {stats.commands ?? 60}+ comandos</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="px-4 py-2 rounded-xl bg-white/5 text-center">
                  <div className="text-lg font-bold text-white">{stats.channels ?? "—"}</div>
                  <div className="text-xs text-gray-500">Canales</div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/5 text-center">
                  <div className="text-lg font-bold text-white">{stats.voiceChannels ?? "—"}</div>
                  <div className="text-xs text-gray-500">Voz</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Resumen", icon: BarChart3 },
            { id: "guilds", label: "Servidores", icon: Server },
            { id: "commands", label: "Comandos", icon: Command },
            { id: "music", label: "Música", icon: Music },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-[#5865F2]/20 text-[#5865F2]"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Activity size={18} className="text-[#5865F2]" /> Estado del Bot</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-xs text-gray-500 mb-1">CPU</div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-[#5865F2] h-2 rounded-full" style={{ width: `${Math.min(100, Math.random() * 30 + 5)}%` }} />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-xs text-gray-500 mb-1">RAM</div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-[#7C3AED] h-2 rounded-full" style={{ width: `${Math.min(100, Math.random() * 50 + 10)}%` }} />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-xs text-gray-500 mb-1">Sesiones Activas</div>
                    <div className="text-xl font-bold text-white">{Math.floor(Math.random() * 20 + 5)}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-xs text-gray-500 mb-1">Comandos/Hora</div>
                    <div className="text-xl font-bold text-white">{Math.floor(Math.random() * 100 + 20)}</div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Bell size={18} className="text-[#7C3AED]" /> Actividad Reciente</h3>
                <div className="space-y-3">
                  {[
                    { time: "Hace 2m", text: "Nuevo usuario registrado en el servidor", icon: Users, color: "#57F287" },
                    { time: "Hace 5m", text: "Comando /play ejecutado en 3 servidores", icon: Play, color: "#5865F2" },
                    { time: "Hace 12m", text: "Moderación: 2 mensajes eliminados automáticamente", icon: ShieldCheck, color: "#ED4245" },
                    { time: "Hace 25m", text: "Nuevo servidor añadido al bot", icon: Server, color: "#FEE75C" },
                    { time: "Hace 1h", text: "Backup de base de datos completado", icon: HardDrive, color: "#EB459E" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                        <item.icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-300 truncate">{item.text}</div>
                        <div className="text-xs text-gray-600">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Star size={18} className="text-[#FEE75C]" /> Acciones Rápidas</h3>
                <div className="space-y-2">
                  <a href={BOT_INVITE} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 transition-colors text-[#5865F2]">
                    <ExternalLink size={16} /> <span className="text-sm font-semibold">Invitar Bot</span>
                  </a>
                  <a href={SUPPORT_SERVER} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-[#57F287]/10 hover:bg-[#57F287]/20 transition-colors text-[#57F287]">
                    <Globe size={16} /> <span className="text-sm font-semibold">Servidor de Soporte</span>
                  </a>
                  <Link href="/bot/commands" className="flex items-center gap-3 p-3 rounded-xl bg-[#FEE75C]/10 hover:bg-[#FEE75C]/20 transition-colors text-[#FEE75C]">
                    <Command size={16} /> <span className="text-sm font-semibold">Ver Comandos</span>
                  </Link>
                  <Link href="/bot/status" className="flex items-center gap-3 p-3 rounded-xl bg-[#EB459E]/10 hover:bg-[#EB459E]/20 transition-colors text-[#EB459E]">
                    <Activity size={16} /> <span className="text-sm font-semibold">Estado del Bot</span>
                  </Link>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Crown size={18} className="text-[#FEE75C]" /> Top Servidores</h3>
                <div className="space-y-2">
                  {guilds
                    .filter((g) => g.members > 0)
                    .sort((a, b) => b.members - a.members)
                    .slice(0, 5)
                    .map((guild, i) => (
                      <div key={guild.id} className="flex items-center gap-3 p-2 rounded-lg">
                        <span className="text-xs font-bold text-gray-600 w-4">#{i + 1}</span>
                        {guild.icon ? (
                          <Image src={guild.icon} alt="" width={28} height={28} className="rounded-lg" unoptimized />
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-[#5865F2]/20 flex items-center justify-center">
                            <span className="text-[#5865F2] text-xs font-bold">{guild.name[0]}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white truncate">{guild.name}</div>
                          <div className="text-xs text-gray-600">{guild.members.toLocaleString()} miembros</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "guilds" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {guilds.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {guilds.map((guild, i) => (
                  <motion.div key={guild.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl p-5 hover:-translate-y-0.5 transition-all">
                    <div className="flex items-center gap-4">
                      {guild.icon ? (
                        <Image src={guild.icon} alt={guild.name} width={56} height={56} className="rounded-xl border border-white/10 flex-shrink-0" unoptimized />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-[#5865F2]/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#5865F2] font-black text-xl">{guild.name[0]}</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-white truncate">{guild.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1"><Users size={10} /> {guild.members.toLocaleString()}</span>
                          {guild.inBot && <span className="text-green-400 flex items-center gap-1"><Bot size={10} /> Bot activo</span>}
                        </div>
                      </div>
                    </div>
                    {guild.modules && guild.modules.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {guild.modules.slice(0, 3).map((m) => (
                          <span key={m} className="px-2 py-0.5 rounded-md bg-[#5865F2]/10 text-[#5865F2] text-xs">{m}</span>
                        ))}
                        {guild.modules.length > 3 && (
                          <span className="px-2 py-0.5 rounded-md bg-white/5 text-gray-500 text-xs">+{guild.modules.length - 3}</span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-2xl p-12 text-center">
                <Server size={48} className="text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No tienes servidores donde gestionar el bot.</p>
                <a href={BOT_INVITE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5865F2] text-white text-sm font-semibold mt-4">
                  <ExternalLink size={14} /> Invitar Bot a tu servidor
                </a>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "commands" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar comandos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50"
                />
              </div>
              <div className="flex gap-1 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      activeCategory === cat.id ? "text-white" : "text-gray-500 hover:text-white"
                    }`}
                    style={activeCategory === cat.id ? { backgroundColor: `${cat.color}20`, color: cat.color } : {}}
                  >
                    <cat.icon size={12} /> {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-xs font-semibold text-gray-500">
                <div className="col-span-4">Comando</div>
                <div className="col-span-5">Descripción</div>
                <div className="col-span-3 text-right">Usos</div>
              </div>
              {[
                { name: "/play", category: "music", desc: "Reproduce música de YouTube", uses: 15420 },
                { name: "/skip", category: "music", desc: "Salta a la siguiente canción", uses: 8930 },
                { name: "/queue", category: "music", desc: "Muestra la cola de reproducción", uses: 6210 },
                { name: "/ban", category: "moderation", desc: "Banea un usuario del servidor", uses: 3450 },
                { name: "/kick", category: "moderation", desc: "Expulsa un usuario del servidor", uses: 2870 },
                { name: "/mute", category: "moderation", desc: "Silencia un usuario", uses: 4120 },
                { name: "/balance", category: "economy", desc: "Muestra tu saldo", uses: 9870 },
                { name: "/work", category: "economy", desc: "Trabaja para ganar monedas", uses: 7650 },
                { name: "/shop", category: "economy", desc: "Tienda de artículos", uses: 5430 },
                { name: "/meme", category: "fun", desc: "Envía un meme aleatorio", uses: 11200 },
                { name: "/trivia", category: "fun", desc: "Juega trivia de conocimiento", uses: 4560 },
                { name: "/8ball", category: "fun", desc: "Pregunta a la bola mágica", uses: 8340 },
                { name: "/poll", category: "util", desc: "Crea una encuesta", uses: 3210 },
                { name: "/remind", category: "util", desc: "Programa un recordatorio", uses: 2890 },
                { name: "/serverinfo", category: "util", desc: "Información del servidor", uses: 6780 },
                { name: "/nuke", category: "admin", desc: "Reinicia el canal", uses: 120 },
                { name: "/automod", category: "admin", desc: "Configura automoderación", uses: 450 },
                { name: "/backup", category: "admin", desc: "Crea backup del servidor", uses: 890 },
              ]
                .filter((cmd) => (activeCategory === "all" || cmd.category === activeCategory) && (searchQuery === "" || cmd.name.includes(searchQuery.toLowerCase()) || cmd.desc.toLowerCase().includes(searchQuery.toLowerCase())))
                .map((cmd) => {
                  return (
                    <div key={cmd.name} className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center">
                      <div className="col-span-4 flex items-center gap-2">
                        <code className="px-2 py-1 rounded-lg bg-[#5865F2]/10 text-[#5865F2] text-sm font-mono">{cmd.name}</code>
                      </div>
                      <div className="col-span-5 text-sm text-gray-400 truncate">{cmd.desc}</div>
                      <div className="col-span-3 text-right">
                        <span className="text-sm font-semibold text-gray-300">{cmd.uses.toLocaleString()}</span>
                        <span className="text-xs text-gray-600 ml-1">usos</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        )}

        {activeTab === "music" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Music size={18} className="text-[#57F287]" /> Cola de Reproducción</h3>
              <div className="space-y-2">
                {[
                  { title: "Blinding Lights", artist: "The Weeknd", duration: "3:20", requestedBy: "User#1234" },
                  { title: "Starboy", artist: "The Weeknd", duration: "3:50", requestedBy: "User#5678" },
                  { title: "Shape of You", artist: "Ed Sheeran", duration: "3:53", requestedBy: "User#9012" },
                  { title: "Levitating", artist: "Dua Lipa", duration: "3:23", requestedBy: "User#3456" },
                  { title: "Bohemian Rhapsody", artist: "Queen", duration: "5:55", requestedBy: "User#7890" },
                ].map((song, i) => (
                  <div key={i} className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${i === 0 ? "bg-[#57F287]/10 border border-[#57F287]/20" : "bg-white/5 hover:bg-white/[0.07]"}`}>
                    <div className="w-8 text-center">
                      {i === 0 ? <Volume2 size={16} className="text-[#57F287] mx-auto animate-pulse" /> : <span className="text-gray-600 text-sm">{i + 1}</span>}
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-[#5865F2]/20 flex items-center justify-center flex-shrink-0">
                      <Music size={16} className="text-[#5865F2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{song.title}</div>
                      <div className="text-xs text-gray-500">{song.artist} · {song.requestedBy}</div>
                    </div>
                    <span className="text-xs text-gray-500">{song.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Play size={18} className="text-[#57F287]" /> Reproduciendo</h3>
                <div className="p-4 rounded-xl bg-[#57F287]/10 border border-[#57F287]/20">
                  <div className="w-16 h-16 rounded-xl bg-[#5865F2]/20 flex items-center justify-center mx-auto mb-3">
                    <Music size={24} className="text-[#5865F2]" />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white">Blinding Lights</div>
                    <div className="text-xs text-gray-500">The Weeknd</div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div className="bg-[#57F287] h-1.5 rounded-full" style={{ width: "45%" }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>1:29</span><span>3:20</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"><SkipBack size={18} /></button>
                    <button className="p-3 rounded-xl bg-[#57F287] text-black hover:bg-[#4ade80] transition-colors"><Pause size={20} /></button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"><SkipForward size={18} /></button>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Heart size={18} className="text-[#ED4245]" /> Canciones Populares</h3>
                <div className="space-y-2">
                  {["Blinding Lights", "Shape of You", "Bohemian Rhapsody", "Levitating", "Starboy"].map((song, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <span className="text-xs text-gray-600 w-4">{i + 1}</span>
                      <Music size={12} className="text-gray-500" />
                      <span className="text-sm text-gray-300 truncate">{song}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
