"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Server, Users, Zap, Clock, ExternalLink,
  RefreshCw, LogIn, ShieldCheck, Terminal,
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
}

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  members: number;
  isAdmin?: boolean;
  inBot?: boolean;
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function BotDashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<BotStats | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") { setLoading(false); return; }
    const fetchData = async () => {
      try {
        const [statsRes, guildsRes] = await Promise.allSettled([
          fetch("/api/bot/stats"),
          fetch("/api/bot/guilds"),
        ]);
        if (statsRes.status === "fulfilled" && statsRes.value.ok) setStats(await statsRes.value.json());
        if (guildsRes.status === "fulfilled" && guildsRes.value.ok) setGuilds(await guildsRes.value.json());
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, [status]);

  if (status === "loading") {
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
            onClick={() => signIn("discord")}
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
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-10">
          {(session.user?.image || (session as Record<string, unknown>).discordAvatar) && (
            <Image
              src={session.user?.image || `https://cdn.discordapp.com/avatars/${(session as Record<string, unknown>).discordId}/${(session as Record<string, unknown>).discordAvatar}.png`}
              alt="avatar"
              width={56}
              height={56}
              className="rounded-full border-2 border-white/10"
            />
          )}
          <div>
            <h1 className="text-2xl font-black">
              <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">
                Hola, {session.user?.name?.split("#")[0]}
              </span>
            </h1>
            <p className="text-gray-500 text-sm">Panel de control de System 777 Bot</p>
          </div>
        </motion.div>

        {stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: <Server size={18} />, label: "Servidores", value: stats.guilds, color: "text-[#5865F2]" },
              { icon: <Users size={18} />, label: "Usuarios", value: stats.users.toLocaleString(), color: "text-[#7C3AED]" },
              { icon: <Zap size={18} />, label: "Ping", value: `${stats.ping}ms`, color: "text-[#FEE75C]" },
              { icon: <Clock size={18} />, label: "Uptime", value: formatUptime(stats.uptime), color: "text-[#57F287]" },
            ].map((item) => (
              <div key={item.label} className="glass rounded-xl p-4">
                <div className={`inline-flex p-2 rounded-lg bg-white/5 mb-3 ${item.color}`}>{item.icon}</div>
                <div className="text-2xl font-black text-white">{item.value}</div>
                <div className="text-xs text-gray-500">{item.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 mb-8 flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <Image src={stats.avatar || "/avatar.png"} alt="bot" width={56} height={56} className="rounded-full border-2 border-white/10" />
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-4 border-[#0A0A0A] ${stats.online ? "bg-green-400" : "bg-gray-500"}`} />
            </div>
            <div>
              <div className="font-bold text-white text-lg">{stats.tag}</div>
              <div className="text-sm text-gray-500 flex items-center gap-3">
                <span className={stats.online ? "text-green-400" : "text-gray-500"}>{stats.online ? "● En línea" : "● Desconectado"}</span>
                <span>Memoria: {stats.memory} MB</span>
              </div>
            </div>
            <div className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-sm text-gray-400">
              <Terminal size={14} />
              {stats.commands ?? 0} comandos
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-bold text-white mb-4">Tus servidores con System 777</h2>
          {loading ? (
            <div className="flex justify-center py-12"><RefreshCw size={24} className="text-[#5865F2] animate-spin" /></div>
          ) : guilds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {guilds.map((guild, i) => (
                <motion.div key={guild.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="glass rounded-xl p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all">
                  {guild.icon ? (
                    <Image src={guild.icon} alt={guild.name} width={48} height={48} className="rounded-xl border border-white/10 flex-shrink-0" unoptimized />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#5865F2]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#5865F2] font-black text-lg">{guild.name[0]}</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white truncate">{guild.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                      {guild.inBot ? <span className="text-green-400">● Activo</span> : <span className="text-gray-500">○ Sin bot</span>}
                      {guild.members > 0 && <span>· {guild.members.toLocaleString()} miembros</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl p-12 text-center">
              <Server size={40} className="text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No tienes servidores donde gestionar el bot todavía.</p>
              <p className="text-xs text-gray-600">Añade System 777 a tu servidor o verifica que tengas permisos de administrador.</p>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
