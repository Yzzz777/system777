"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Server, Users, Zap, Clock, HardDrive, Wifi, WifiOff } from "lucide-react";

interface BotStatus {
  status: string;
  ping: number;
  uptime: { seconds: number; formatted: string };
  guilds: number;
  users: number;
  commands: { total: number; used: number; topCommand: string | null };
  memory: { heapMB: string; rssMB: string };
  version: string;
  nodeVersion: string;
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function BotStatusPage() {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/bot/stats");
        if (res.ok) {
          const data = await res.json();
          setStatus({
            status: data.online ? "online" : "offline",
            ping: data.ping,
            uptime: { seconds: data.uptime, formatted: formatUptime(data.uptime) },
            guilds: data.guilds,
            users: data.users,
            commands: { total: data.commands || 0, used: 0, topCommand: null },
            memory: { heapMB: data.memory || "0", rssMB: "0" },
            version: "1.2.0",
            nodeVersion: "v20",
          });
        }
      } catch {}
      setLoading(false);
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5865F2] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const isOnline = status?.status === "online";

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">Estado del Bot</span>
          </h1>
          <p className="text-gray-400 text-lg">Monitoreo en tiempo real de System 777</p>
        </motion.div>

        {/* Status indicator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-8 mb-8 text-center">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${isOnline ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
            {isOnline ? <Wifi size={20} className="text-green-400" /> : <WifiOff size={20} className="text-red-400" />}
            <span className={`text-lg font-bold ${isOnline ? "text-green-400" : "text-red-400"}`}>
              {isOnline ? "En Línea" : "Fuera de Línea"}
            </span>
          </div>
          {status && (
            <p className="mt-4 text-sm text-gray-500">Versión {status.version} · Node {status.nodeVersion}</p>
          )}
        </motion.div>

        {status ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <Zap size={20} />, label: "Ping", value: `${status.ping}ms`, color: "#5865F2", desc: "Latencia WebSocket" },
              { icon: <Clock size={20} />, label: "Uptime", value: status.uptime.formatted, color: "#57F287", desc: "Tiempo activo" },
              { icon: <Server size={20} />, label: "Servidores", value: status.guilds.toString(), color: "#7C3AED", desc: "Servidores activos" },
              { icon: <Users size={20} />, label: "Usuarios", value: status.users.toLocaleString(), color: "#EB459E", desc: "Usuarios totales" },
              { icon: <HardDrive size={20} />, label: "Memoria", value: `${status.memory.heapMB} MB`, color: "#FFD93D", desc: "Heap utilizado" },
              { icon: <Activity size={20} />, label: "Comandos", value: `${status.commands.used} usados`, color: "#FF8C42", desc: `${status.commands.total} registrados` },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="glass rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-white/5" style={{ color: item.color }}>{item.icon}</div>
                  <span className="text-sm text-gray-400">{item.label}</span>
                </div>
                <div className="text-2xl font-black text-white">{item.value}</div>
                <div className="text-xs text-gray-600 mt-1">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <WifiOff size={40} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No se pudo conectar al bot</p>
            <p className="text-xs text-gray-600">El bot podría estar offline o la URL de la API no está configurada.</p>
          </div>
        )}
      </div>
    </main>
  );
}
