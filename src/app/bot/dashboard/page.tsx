/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  useSession,
  signOut,
} from "@/components/Providers";
import {
  Server,
  Users,
  Zap,
  Clock,
  LogIn,
  ShieldCheck,
  Activity,
  Settings,
  ExternalLink,
  Bot,
  Crown,
  BarChart3,
  TrendingUp,
  Command,
  Cpu,
  Globe,
  Star,
  Search,
  Send,
  RefreshCw,
  Power,
  ChevronRight,
  ChevronLeft,
  Shield,
  Ticket,
  Smile,
  Coins,
  ShieldAlert,
  Lock,
  UserCheck,
  ScrollText,
  MessageCircle,
  Trash2,
  Plus,
  Save,
  Copy,
  Terminal,
  FileText,
  Award,
  Gift,
  Ban,
  Sparkles,
  Layout,
  Megaphone,
  UserCog,
  Code,
  Box,
} from "lucide-react";

const BOT_INVITE =
  "https://discord.com/oauth2/authorize?client_id=1502804306125132057&permissions=8&scope=bot%20applications.commands";
const SUPPORT_SERVER = "https://discord.gg/system777";

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
  modules?: Record<string, boolean>;
  owner?: string;
}

interface ModuleConfig {
  welcome?: { enabled: boolean; channel: string; message: string };
  goodbye?: { enabled: boolean; channel: string; message: string };
  tickets?: { enabled: boolean; channel: string; category: string };
  levels?: { enabled: boolean; xpMultiplier: number };
  economy?: { enabled: boolean; currency: string; startingBalance: number };
  moderation?: { enabled: boolean; autoMod: boolean; logChannel: string };
  protection?: { enabled: boolean; antiRaid: boolean; antiSpam: boolean };
  verification?: { enabled: boolean; channel: string; role: string };
  autorole?: { enabled: boolean; roles: string[] };
  logs?: { enabled: boolean; channel: string };
}

interface JarvisMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface StaffMember {
  id: string;
  username: string;
  role: string;
  addedAt: string;
}

interface GlobalBan {
  id: string;
  userId: string;
  username: string;
  reason: string;
  bannedAt: string;
  bannedBy: string;
}

interface PremiumUser {
  id: string;
  username: string;
  tier: string;
  expiresAt: string;
  active: boolean;
}

interface PremiumCode {
  id: string;
  code: string;
  tier: string;
  uses: number;
  maxUses: number;
  expiresAt: string;
}

interface Analytics {
  totalCommands: number;
  commandsToday: number;
  activeGuilds: number;
  activeUsers: number;
  topCommands: { name: string; uses: number }[];
  dailyStats: { date: string; commands: number; users: number }[];
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatMemory(mb: string | number): string {
  const num = typeof mb === "string" ? parseFloat(mb) : mb;
  if (num > 1024) return `${(num / 1024).toFixed(1)} GB`;
  return `${num} MB`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const MODULES = [
  { id: "welcome", label: "Bienvenida", icon: Smile, color: "#57F287" },
  { id: "goodbye", label: "Despedida", icon: MessageCircle, color: "#ED4245" },
  { id: "tickets", label: "Tickets", icon: Ticket, color: "#FEE75C" },
  { id: "levels", label: "Niveles", icon: TrendingUp, color: "#EB459E" },
  { id: "economy", label: "Economía", icon: Coins, color: "#5865F2" },
  { id: "moderation", label: "Moderación", icon: ShieldAlert, color: "#ED4245" },
  { id: "protection", label: "Protección", icon: Lock, color: "#7C3AED" },
  { id: "verification", label: "Verificación", icon: UserCheck, color: "#57F287" },
  { id: "autorole", label: "Autorole", icon: UserCog, color: "#FEE75C" },
  { id: "logs", label: "Logs", icon: ScrollText, color: "#5865F2" },
];

export default function BotDashboardPage() {
  const { data: sessionData, status: sessionStatus } = useSession();
  const [stats, setStats] = useState<BotStats | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [guildModules, setGuildModules] = useState<ModuleConfig>({});
  const [moduleLoading, setModuleLoading] = useState(false);

  const [ownerStats, setOwnerStats] = useState<Analytics | null>(null);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [globalBans, setGlobalBans] = useState<GlobalBan[]>([]);
  const [premiumUsers, setPremiumUsers] = useState<PremiumUser[]>([]);
  const [premiumCodes, setPremiumCodes] = useState<PremiumCode[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastLoading, setBroadcastLoading] = useState(false);

  const [jarvisMessages, setJarvisMessages] = useState<JarvisMessage[]>([]);
  const [jarvisInput, setJarvisInput] = useState("");
  const [jarvisLoading, setJarvisLoading] = useState(false);
  const [jarvisMetrics, setJarvisMetrics] = useState<any>(null);
  const jarvisRef = useRef<HTMLDivElement>(null);

  const [welcomeConfig, setWelcomeConfig] = useState({ channel: "", message: "" });
  const [goodbyeConfig, setGoodbyeConfig] = useState({ channel: "", message: "" });
  const [levelsConfig, setLevelsConfig] = useState({ xpMultiplier: 1 });
  const [economyConfig, setEconomyConfig] = useState({ currency: "Coins", startingBalance: 100 });
  const [moderationConfig, setModerationConfig] = useState({ autoMod: false, logChannel: "" });
  const [protectionConfig, setProtectionConfig] = useState({ antiRaid: false, antiSpam: false });
  const [levelsTop, setLevelsTop] = useState<any[]>([]);
  const [economyTop, setEconomyTop] = useState<any[]>([]);
  const [casesList, setCasesList] = useState<any[]>([]);
  const [modAction, setModAction] = useState({ type: "ban", userId: "", reason: "" });

  const [guildSubTab, setGuildSubTab] = useState("modules");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    const fetchData = async () => {
      try {
        const [statsRes, guildsRes] = await Promise.allSettled([
          fetch("/api/bot/proxy/stats"),
          fetch("/api/bot/proxy/guilds"),
        ]);
        if (statsRes.status === "fulfilled" && statsRes.value.ok) {
          setStats(await statsRes.value.json());
        }
        if (guildsRes.status === "fulfilled" && guildsRes.value.ok) {
          const data = await guildsRes.value.json();
          setGuilds(Array.isArray(data) ? data : data.guilds || []);
        }
      } catch {}
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [sessionStatus]);

  useEffect(() => {
    if (sessionData?.user?.role !== "owner") return;
    const fetchOwnerData = async () => {
      try {
        const [analyticsRes, staffRes, bansRes, pUsersRes, pCodesRes] =
          await Promise.allSettled([
            fetch("/api/bot/proxy/analytics"),
            fetch("/api/bot/proxy/staff"),
            fetch("/api/bot/proxy/globalbans"),
            fetch("/api/bot/proxy/premium/users"),
            fetch("/api/bot/proxy/premium/codes"),
          ]);
        if (analyticsRes.status === "fulfilled" && analyticsRes.value.ok)
          setOwnerStats(await analyticsRes.value.json());
        if (staffRes.status === "fulfilled" && staffRes.value.ok) {
          const d = await staffRes.value.json();
          setStaffList(Array.isArray(d) ? d : d.staff || []);
        }
        if (bansRes.status === "fulfilled" && bansRes.value.ok) {
          const d = await bansRes.value.json();
          setGlobalBans(Array.isArray(d) ? d : d.bans || []);
        }
        if (pUsersRes.status === "fulfilled" && pUsersRes.value.ok) {
          const d = await pUsersRes.value.json();
          setPremiumUsers(Array.isArray(d) ? d : d.users || []);
        }
        if (pCodesRes.status === "fulfilled" && pCodesRes.value.ok) {
          const d = await pCodesRes.value.json();
          setPremiumCodes(Array.isArray(d) ? d : d.codes || []);
        }
      } catch {}
    };
    fetchOwnerData();
  }, [sessionData]);

  useEffect(() => {
    if (activeTab !== "jarvis") return;
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/bot/proxy/jarvis/metrics");
        if (res.ok) setJarvisMetrics(await res.json());
      } catch {}
    };
    fetchMetrics();
  }, [activeTab]);

  useEffect(() => {
    if (jarvisRef.current) {
      jarvisRef.current.scrollTop = jarvisRef.current.scrollHeight;
    }
  }, [jarvisMessages]);

  const loadGuildModules = async (guildId: string) => {
    setModuleLoading(true);
    try {
      const res = await fetch(`/api/bot/proxy/guild/${guildId}/modules`);
      if (res.ok) {
        const data = await res.json();
        setGuildModules(data.modules || data);
      }
    } catch {}
    setModuleLoading(false);
  };

  const loadGuildDetails = async (guild: Guild) => {
    setSelectedGuild(guild);
    setGuildSubTab("modules");
    await loadGuildModules(guild.id);

    try {
      const [levelsRes, econRes, casesRes] = await Promise.allSettled([
        fetch(`/api/bot/proxy/guild/${guild.id}/levels`),
        fetch(`/api/bot/proxy/guild/${guild.id}/economy`),
        fetch(`/api/bot/proxy/cases/${guild.id}`),
      ]);
      if (levelsRes.status === "fulfilled" && levelsRes.value.ok) {
        const d = await levelsRes.value.json();
        setLevelsConfig({ xpMultiplier: d.xpMultiplier || 1 });
        if (d.top) setLevelsTop(d.top);
      }
      if (econRes.status === "fulfilled" && econRes.value.ok) {
        const d = await econRes.value.json();
        setEconomyConfig({
          currency: d.currency || "Coins",
          startingBalance: d.startingBalance || 100,
        });
        if (d.top) setEconomyTop(d.top);
      }
      if (casesRes.status === "fulfilled" && casesRes.value.ok) {
        const d = await casesRes.value.json();
        setCasesList(Array.isArray(d) ? d : d.cases || []);
      }
    } catch {}
  };

  const toggleModule = async (moduleId: string) => {
    if (!selectedGuild) return;
    const currentValue =
      guildModules[moduleId as keyof ModuleConfig] &&
      typeof guildModules[moduleId as keyof ModuleConfig] === "object"
        ? (guildModules[moduleId as keyof ModuleConfig] as any).enabled
        : !!guildModules[moduleId as keyof ModuleConfig];

    const newValue = !currentValue;
    setModuleLoading(true);
    try {
      const res = await fetch(
        `/api/bot/proxy/guild/${selectedGuild.id}/modules`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ module: moduleId, enabled: newValue }),
        }
      );
      if (res.ok) {
        setGuildModules((prev) => ({
          ...prev,
          [moduleId]: {
            ...(prev[moduleId as keyof ModuleConfig] as any),
            enabled: newValue,
          },
        }));
        showToast(
          `Módulo ${moduleId} ${newValue ? "activado" : "desactivado"}`,
          "success"
        );
      }
    } catch {
      showToast("Error al actualizar módulo", "error");
    }
    setModuleLoading(false);
  };

  const saveWelcomeConfig = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(
        `/api/bot/proxy/guild/${selectedGuild.id}/welcome`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(welcomeConfig),
        }
      );
      if (res.ok) showToast("Configuración de bienvenida guardada", "success");
    } catch {
      showToast("Error al guardar", "error");
    }
  };

  const saveGoodbyeConfig = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(
        `/api/bot/proxy/guild/${selectedGuild.id}/goodbye`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(goodbyeConfig),
        }
      );
      if (res.ok) showToast("Configuración de despedida guardada", "success");
    } catch {
      showToast("Error al guardar", "error");
    }
  };

  const saveTicketsSetup = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(
        `/api/bot/proxy/guild/${selectedGuild.id}/tickets/setup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled: true }),
        }
      );
      if (res.ok) showToast("Tickets configurados", "success");
    } catch {
      showToast("Error al configurar tickets", "error");
    }
  };

  const saveLevelsConfig = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(
        `/api/bot/proxy/guild/${selectedGuild.id}/levels`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(levelsConfig),
        }
      );
      if (res.ok) {
        showToast("Configuración de niveles guardada", "success");
        const topRes = await fetch(
          `/api/bot/proxy/guild/${selectedGuild.id}/levels/top`
        );
        if (topRes.ok) {
          const d = await topRes.json();
          setLevelsTop(Array.isArray(d) ? d : d.top || []);
        }
      }
    } catch {
      showToast("Error al guardar", "error");
    }
  };

  const saveEconomyConfig = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(
        `/api/bot/proxy/guild/${selectedGuild.id}/economy`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(economyConfig),
        }
      );
      if (res.ok) {
        showToast("Configuración de economía guardada", "success");
        const topRes = await fetch(
          `/api/bot/proxy/guild/${selectedGuild.id}/economy/top`
        );
        if (topRes.ok) {
          const d = await topRes.json();
          setEconomyTop(Array.isArray(d) ? d : d.top || []);
        }
      }
    } catch {
      showToast("Error al guardar", "error");
    }
  };

  const executeModAction = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(
        `/api/bot/proxy/guild/${selectedGuild.id}/action`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modAction),
        }
      );
      if (res.ok) {
        showToast(`Acción ${modAction.type} ejecutada`, "success");
        setModAction({ type: "ban", userId: "", reason: "" });
        const casesRes = await fetch(
          `/api/bot/proxy/cases/${selectedGuild.id}`
        );
        if (casesRes.ok) {
          const d = await casesRes.json();
          setCasesList(Array.isArray(d) ? d : d.cases || []);
        }
      }
    } catch {
      showToast("Error al ejecutar acción", "error");
    }
  };

  const saveProtectionConfig = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(
        `/api/bot/proxy/guild/${selectedGuild.id}/protection`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(protectionConfig),
        }
      );
      if (res.ok) showToast("Configuración de protección guardada", "success");
    } catch {
      showToast("Error al guardar", "error");
    }
  };

  const sendJarvisMessage = async () => {
    if (!jarvisInput.trim() || jarvisLoading) return;
    const userMsg: JarvisMessage = {
      role: "user",
      content: jarvisInput.trim(),
      timestamp: new Date().toISOString(),
    };
    setJarvisMessages((prev) => [...prev, userMsg]);
    setJarvisInput("");
    setJarvisLoading(true);
    try {
      const res = await fetch("/api/bot/proxy/jarvis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });
      if (res.ok) {
        const data = await res.json();
        setJarvisMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response || data.message || "Sin respuesta",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setJarvisMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error de conexión con JARVIS",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
    setJarvisLoading(false);
  };

  const executePowerAction = async (action: "restart" | "stop") => {
    try {
      const res = await fetch("/api/bot/proxy/power", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) showToast(`Bot ${action === "restart" ? "reiniciado" : "detenido"}`, "success");
    } catch {
      showToast("Error al ejecutar acción", "error");
    }
  };

  const addGlobalBan = async (userId: string, reason: string) => {
    try {
      const res = await fetch("/api/bot/proxy/globalbans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, reason }),
      });
      if (res.ok) {
        showToast("Ban global añadido", "success");
        const bansRes = await fetch("/api/bot/proxy/globalbans");
        if (bansRes.ok) {
          const d = await bansRes.json();
          setGlobalBans(Array.isArray(d) ? d : d.bans || []);
        }
      }
    } catch {
      showToast("Error al añadir ban", "error");
    }
  };

  const removeGlobalBan = async (banId: string) => {
    try {
      const res = await fetch(`/api/bot/proxy/globalbans`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: banId }),
      });
      if (res.ok) {
        setGlobalBans((prev) => prev.filter((b) => b.id !== banId));
        showToast("Ban global eliminado", "success");
      }
    } catch {
      showToast("Error al eliminar ban", "error");
    }
  };

  const sendBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    setBroadcastLoading(true);
    try {
      const res = await fetch("/api/bot/proxy/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: broadcastMessage }),
      });
      if (res.ok) {
        showToast("Broadcast enviado", "success");
        setBroadcastMessage("");
      }
    } catch {
      showToast("Error al enviar broadcast", "error");
    }
    setBroadcastLoading(false);
  };

  const addStaff = async (username: string, role: string) => {
    try {
      const res = await fetch("/api/bot/proxy/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, role }),
      });
      if (res.ok) {
        showToast("Staff añadido", "success");
        const staffRes = await fetch("/api/bot/proxy/staff");
        if (staffRes.ok) {
          const d = await staffRes.json();
          setStaffList(Array.isArray(d) ? d : d.staff || []);
        }
      }
    } catch {
      showToast("Error al añadir staff", "error");
    }
  };

  const removeStaff = async (staffId: string) => {
    try {
      const res = await fetch("/api/bot/proxy/staff", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: staffId }),
      });
      if (res.ok) {
        setStaffList((prev) => prev.filter((s) => s.id !== staffId));
        showToast("Staff eliminado", "success");
      }
    } catch {
      showToast("Error al eliminar staff", "error");
    }
  };

  if (sessionStatus === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5865F2] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!sessionData || !sessionData.user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass rounded-2xl p-10 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#5865F2]/20 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} className="text-[#5865F2]" />
          </div>
          <h2 className="text-2xl font-black mb-3">
            <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">
              Panel de Control
            </span>
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Inicia sesión con tu cuenta de Discord para acceder al panel y
            gestionar tus servidores.
          </p>
          <button
            onClick={() => (window.location.href = "/api/auth/discord")}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors font-bold text-white"
          >
            <LogIn size={18} />
            Iniciar sesión con Discord
          </button>
        </motion.div>
      </main>
    );
  }

  const user = sessionData.user;
  const isOwner = user.role === "owner";

  const tabs = [
    { id: "overview", label: "Resumen", icon: BarChart3 },
    { id: "servers", label: "Servidores", icon: Server },
    ...(isOwner
      ? [{ id: "owner", label: "Owner Panel", icon: Crown }]
      : []),
    { id: "jarvis", label: "JARVIS AI", icon: Sparkles },
  ];

  return (
    <main className="min-h-screen pt-20 pb-12 px-4 bot-section">
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-24 right-4 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-lg ${
            toast.type === "success"
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : toast.type === "error"
              ? "bg-red-500/20 text-red-400 border border-red-500/30"
              : "bg-[#5865F2]/20 text-[#5865F2] border border-[#5865F2]/30"
          }`}
        >
          {toast.message}
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            {user.image && (
              <Image
                src={user.image}
                alt="avatar"
                width={56}
                height={56}
                className="rounded-full border-2 border-[#5865F2]/30"
              />
            )}
            <div>
              <h1 className="text-2xl font-black">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">
                  Hola, {user.name || user.username}
                </span>
              </h1>
              <p className="text-gray-500 text-sm">
                Panel de control de System 777 Bot
              </p>
            </div>
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <a
              href={BOT_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white"
            >
              <ExternalLink size={14} /> Invitar Bot
            </a>
            <a
              href={SUPPORT_SERVER}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm text-gray-300"
            >
              <Globe size={14} /> Soporte
            </a>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm text-gray-300"
            >
              Salir
            </button>
          </div>
        </motion.div>

        {stats && activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {[
              {
                icon: <Server size={20} />,
                label: "Servidores",
                value: stats.guilds,
                color: "#5865F2",
                bg: "bg-[#5865F2]/10",
              },
              {
                icon: <Users size={20} />,
                label: "Usuarios",
                value: stats.users.toLocaleString(),
                color: "#7C3AED",
                bg: "bg-[#7C3AED]/10",
              },
              {
                icon: <Zap size={20} />,
                label: "Ping",
                value: `${stats.ping}ms`,
                color: stats.ping < 100 ? "#57F287" : "#ED4245",
                bg: stats.ping < 100 ? "bg-[#57F287]/10" : "bg-[#ED4245]/10",
              },
              {
                icon: <Clock size={20} />,
                label: "Uptime",
                value: formatUptime(stats.uptime),
                color: "#57F287",
                bg: "bg-[#57F287]/10",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="glass rounded-xl p-5 hover:-translate-y-0.5 transition-all"
              >
                <div
                  className={`inline-flex p-2.5 rounded-xl ${item.bg} mb-3`}
                  style={{ color: item.color }}
                >
                  {item.icon}
                </div>
                <div className="text-2xl font-black text-white">{item.value}</div>
                <div className="text-xs text-gray-500 mt-1">{item.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {stats && activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative flex-shrink-0">
                {stats.avatar && (
                  <Image
                    src={stats.avatar}
                    alt="bot"
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-[#5865F2]/30"
                  />
                )}
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-4 border-[#0A0A0A] ${
                    stats.online ? "bg-green-400" : "bg-gray-500"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-xl">{stats.tag}</div>
                <div className="text-sm text-gray-500 flex flex-wrap items-center gap-3 mt-1">
                  <span className={stats.online ? "text-green-400" : "text-gray-500"}>
                    {stats.online ? "● En línea" : "● Desconectado"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Cpu size={12} /> {formatMemory(stats.memory)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Command size={12} /> {stats.commands ?? 60}+ comandos
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="px-4 py-2 rounded-xl bg-white/5 text-center">
                  <div className="text-lg font-bold text-white">
                    {stats.channels ?? "—"}
                  </div>
                  <div className="text-xs text-gray-500">Canales</div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/5 text-center">
                  <div className="text-lg font-bold text-white">
                    {stats.voiceChannels ?? "—"}
                  </div>
                  <div className="text-xs text-gray-500">Voz</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id !== "servers") setSelectedGuild(null);
              }}
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

        {/* ==================== TAB: OVERVIEW ==================== */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-[#5865F2]" /> Estado del
                  Bot
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-xs text-gray-500 mb-1">Ping</div>
                    <div className="text-xl font-bold text-white">
                      {stats ? `${stats.ping}ms` : "—"}
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                      <div
                        className={`h-1.5 rounded-full ${
                          (stats?.ping || 0) < 100
                            ? "bg-green-400"
                            : (stats?.ping || 0) < 200
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }`}
                        style={{
                          width: `${Math.min(100, (stats?.ping || 0) / 3)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-xs text-gray-500 mb-1">Memoria</div>
                    <div className="text-xl font-bold text-white">
                      {stats ? formatMemory(stats.memory) : "—"}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-xs text-gray-500 mb-1">Uptime</div>
                    <div className="text-xl font-bold text-white">
                      {stats ? formatUptime(stats.uptime) : "—"}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-xs text-gray-500 mb-1">Estado</div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          stats?.online ? "bg-green-400" : "bg-gray-500"
                        }`}
                      />
                      <span className="text-xl font-bold text-white">
                        {stats?.online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {ownerStats && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <BarChart3 size={18} className="text-[#7C3AED]" /> Estadísticas
                    Globales
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="text-xs text-gray-500 mb-1">
                        Comandos Totales
                      </div>
                      <div className="text-xl font-bold text-white">
                        {ownerStats.totalCommands.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="text-xs text-gray-500 mb-1">
                        Hoy
                      </div>
                      <div className="text-xl font-bold text-white">
                        {ownerStats.commandsToday.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="text-xs text-gray-500 mb-1">
                        Servidores Activos
                      </div>
                      <div className="text-xl font-bold text-white">
                        {ownerStats.activeGuilds}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="text-xs text-gray-500 mb-1">
                        Usuarios Activos
                      </div>
                      <div className="text-xl font-bold text-white">
                        {ownerStats.activeUsers.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Star size={18} className="text-[#FEE75C]" /> Acciones
                  Rápidas
                </h3>
                <div className="space-y-2">
                  <a
                    href={BOT_INVITE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 transition-colors text-[#5865F2]"
                  >
                    <ExternalLink size={16} />{" "}
                    <span className="text-sm font-semibold">Invitar Bot</span>
                  </a>
                  <a
                    href={SUPPORT_SERVER}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#57F287]/10 hover:bg-[#57F287]/20 transition-colors text-[#57F287]"
                  >
                    <Globe size={16} />{" "}
                    <span className="text-sm font-semibold">
                      Servidor de Soporte
                    </span>
                  </a>
                  <Link
                    href="/bot/commands"
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#FEE75C]/10 hover:bg-[#FEE75C]/20 transition-colors text-[#FEE75C]"
                  >
                    <Command size={16} />{" "}
                    <span className="text-sm font-semibold">Ver Comandos</span>
                  </Link>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Crown size={18} className="text-[#FEE75C]" /> Top Servidores
                </h3>
                <div className="space-y-2">
                  {guilds
                    .filter((g) => g.members > 0)
                    .sort((a, b) => b.members - a.members)
                    .slice(0, 5)
                    .map((guild, i) => (
                      <div
                        key={guild.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => {
                          setActiveTab("servers");
                          loadGuildDetails(guild);
                        }}
                      >
                        <span className="text-xs font-bold text-gray-600 w-4">
                          #{i + 1}
                        </span>
                        {guild.icon ? (
                          <Image
                            src={guild.icon}
                            alt=""
                            width={28}
                            height={28}
                            className="rounded-lg"
                            unoptimized
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-[#5865F2]/20 flex items-center justify-center">
                            <span className="text-[#5865F2] text-xs font-bold">
                              {guild.name[0]}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white truncate">
                            {guild.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {guild.members.toLocaleString()} miembros
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================== TAB: SERVERS ==================== */}
        {activeTab === "servers" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {selectedGuild ? (
              <div>
                <button
                  onClick={() => setSelectedGuild(null)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-6 transition-colors"
                >
                  <ChevronLeft size={16} /> Volver a servidores
                </button>

                <div className="flex items-center gap-4 mb-6">
                  {selectedGuild.icon ? (
                    <Image
                      src={selectedGuild.icon}
                      alt={selectedGuild.name}
                      width={56}
                      height={56}
                      className="rounded-xl border border-white/10"
                      unoptimized
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#5865F2]/20 flex items-center justify-center">
                      <span className="text-[#5865F2] font-black text-xl">
                        {selectedGuild.name[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {selectedGuild.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedGuild.members.toLocaleString()} miembros · ID:{" "}
                      {selectedGuild.id}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
                  {[
                    { id: "modules", label: "Módulos", icon: Layout },
                    { id: "welcome", label: "Bienvenida", icon: Smile },
                    { id: "goodbye", label: "Despedida", icon: MessageCircle },
                    { id: "tickets", label: "Tickets", icon: Ticket },
                    { id: "levels", label: "Niveles", icon: TrendingUp },
                    { id: "economy", label: "Economía", icon: Coins },
                    { id: "moderation", label: "Moderación", icon: ShieldAlert },
                    { id: "protection", label: "Protección", icon: Lock },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setGuildSubTab(sub.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                        guildSubTab === sub.id
                          ? "bg-[#5865F2]/20 text-[#5865F2]"
                          : "text-gray-500 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <sub.icon size={14} /> {sub.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {guildSubTab === "modules" && (
                    <motion.div
                      key="modules"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="glass rounded-2xl p-6"
                    >
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Layout size={18} className="text-[#5865F2]" /> Módulos
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {MODULES.map((mod) => {
                          const modData = guildModules[
                            mod.id as keyof ModuleConfig
                          ] as any;
                          const isEnabled =
                            modData && typeof modData === "object"
                              ? modData.enabled
                              : !!modData;
                          return (
                            <div
                              key={mod.id}
                              className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="p-2 rounded-lg"
                                  style={{
                                    backgroundColor: `${mod.color}15`,
                                    color: mod.color,
                                  }}
                                >
                                  <mod.icon size={16} />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-white">
                                    {mod.label}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {mod.id}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => toggleModule(mod.id)}
                                disabled={moduleLoading}
                                className={`relative w-12 h-6 rounded-full transition-colors ${
                                  isEnabled ? "bg-[#5865F2]" : "bg-gray-700"
                                }`}
                              >
                                <div
                                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                    isEnabled ? "left-7" : "left-1"
                                  }`}
                                />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {guildSubTab === "welcome" && (
                    <motion.div
                      key="welcome"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="glass rounded-2xl p-6"
                    >
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Smile size={18} className="text-[#57F287]" />{" "}
                        Configuración de Bienvenida
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">
                            Canal de bienvenida
                          </label>
                          <input
                            type="text"
                            value={welcomeConfig.channel}
                            onChange={(e) =>
                              setWelcomeConfig((prev) => ({
                                ...prev,
                                channel: e.target.value,
                              }))
                            }
                            placeholder="#bienvenida"
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">
                            Mensaje de bienvenida
                          </label>
                          <textarea
                            value={welcomeConfig.message}
                            onChange={(e) =>
                              setWelcomeConfig((prev) => ({
                                ...prev,
                                message: e.target.value,
                              }))
                            }
                            placeholder="¡Bienvenido {user} al servidor {server}!"
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 resize-none"
                          />
                        </div>
                        <div className="text-xs text-gray-600">
                          Variables: {"{user}"} {"{server}"} {"{count}"}
                        </div>
                        <button
                          onClick={saveWelcomeConfig}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white"
                        >
                          <Save size={14} /> Guardar
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {guildSubTab === "goodbye" && (
                    <motion.div
                      key="goodbye"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="glass rounded-2xl p-6"
                    >
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <MessageCircle size={18} className="text-[#ED4245]" />{" "}
                        Configuración de Despedida
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">
                            Canal de despedida
                          </label>
                          <input
                            type="text"
                            value={goodbyeConfig.channel}
                            onChange={(e) =>
                              setGoodbyeConfig((prev) => ({
                                ...prev,
                                channel: e.target.value,
                              }))
                            }
                            placeholder="#despedida"
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">
                            Mensaje de despedida
                          </label>
                          <textarea
                            value={goodbyeConfig.message}
                            onChange={(e) =>
                              setGoodbyeConfig((prev) => ({
                                ...prev,
                                message: e.target.value,
                              }))
                            }
                            placeholder="¡{user} ha abandonado el servidor!"
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 resize-none"
                          />
                        </div>
                        <button
                          onClick={saveGoodbyeConfig}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white"
                        >
                          <Save size={14} /> Guardar
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {guildSubTab === "tickets" && (
                    <motion.div
                      key="tickets"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="glass rounded-2xl p-6"
                    >
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Ticket size={18} className="text-[#FEE75C]" /> Tickets
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Configura el sistema de tickets para que los usuarios
                        puedan crear tickets de soporte.
                      </p>
                      <button
                        onClick={saveTicketsSetup}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white"
                      >
                        <Settings size={14} /> Configurar Tickets
                      </button>
                    </motion.div>
                  )}

                  {guildSubTab === "levels" && (
                    <motion.div
                      key="levels"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="glass rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                          <TrendingUp size={18} className="text-[#EB459E]" />{" "}
                          Configuración de Niveles
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">
                              Multiplicador XP
                            </label>
                            <input
                              type="number"
                              value={levelsConfig.xpMultiplier}
                              onChange={(e) =>
                                setLevelsConfig({
                                  xpMultiplier: parseFloat(e.target.value) || 1,
                                })
                              }
                              min="0.1"
                              max="10"
                              step="0.1"
                              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50"
                            />
                          </div>
                          <button
                            onClick={saveLevelsConfig}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white"
                          >
                            <Save size={14} /> Guardar
                          </button>
                        </div>
                      </div>

                      {levelsTop.length > 0 && (
                        <div className="glass rounded-2xl p-6">
                          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Award size={18} className="text-[#FEE75C]" /> Top
                            Niveles
                          </h3>
                          <div className="space-y-2">
                            {levelsTop.map((entry: any, i: number) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                              >
                                <span
                                  className={`text-sm font-bold w-6 text-center ${
                                    i === 0
                                      ? "text-[#FEE75C]"
                                      : i === 1
                                      ? "text-gray-300"
                                      : i === 2
                                      ? "text-[#CD7F32]"
                                      : "text-gray-600"
                                  }`}
                                >
                                  #{i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm text-white truncate">
                                    {entry.username || entry.userId}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Nivel {entry.level || 0} · XP{" "}
                                    {(entry.xp || 0).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {guildSubTab === "economy" && (
                    <motion.div
                      key="economy"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="glass rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                          <Coins size={18} className="text-[#5865F2]" />{" "}
                          Configuración de Economía
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">
                              Nombre de la moneda
                            </label>
                            <input
                              type="text"
                              value={economyConfig.currency}
                              onChange={(e) =>
                                setEconomyConfig((prev) => ({
                                  ...prev,
                                  currency: e.target.value,
                                }))
                              }
                              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">
                              Balance inicial
                            </label>
                            <input
                              type="number"
                              value={economyConfig.startingBalance}
                              onChange={(e) =>
                                setEconomyConfig((prev) => ({
                                  ...prev,
                                  startingBalance: parseInt(e.target.value) || 100,
                                }))
                              }
                              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50"
                            />
                          </div>
                          <button
                            onClick={saveEconomyConfig}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white"
                          >
                            <Save size={14} /> Guardar
                          </button>
                        </div>
                      </div>

                      {economyTop.length > 0 && (
                        <div className="glass rounded-2xl p-6">
                          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Coins size={18} className="text-[#FEE75C]" /> Top
                            Economía
                          </h3>
                          <div className="space-y-2">
                            {economyTop.map((entry: any, i: number) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                              >
                                <span
                                  className={`text-sm font-bold w-6 text-center ${
                                    i === 0
                                      ? "text-[#FEE75C]"
                                      : i === 1
                                      ? "text-gray-300"
                                      : i === 2
                                      ? "text-[#CD7F32]"
                                      : "text-gray-600"
                                  }`}
                                >
                                  #{i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm text-white truncate">
                                    {entry.username || entry.userId}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {(entry.balance || 0).toLocaleString()}{" "}
                                    {economyConfig.currency}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {guildSubTab === "moderation" && (
                    <motion.div
                      key="moderation"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="glass rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                          <ShieldAlert
                            size={18}
                            className="text-[#ED4245]"
                          />{" "}
                          Configuración de Moderación
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <div>
                              <div className="text-sm font-semibold text-white">
                                AutoMod
                              </div>
                              <div className="text-xs text-gray-500">
                                Moderación automática de mensajes
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                setModerationConfig((prev) => ({
                                  ...prev,
                                  autoMod: !prev.autoMod,
                                }))
                              }
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                moderationConfig.autoMod
                                  ? "bg-[#5865F2]"
                                  : "bg-gray-700"
                              }`}
                            >
                              <div
                                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                  moderationConfig.autoMod
                                    ? "left-7"
                                    : "left-1"
                                }`}
                              />
                            </button>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">
                              Canal de logs
                            </label>
                            <input
                              type="text"
                              value={moderationConfig.logChannel}
                              onChange={(e) =>
                                setModerationConfig((prev) => ({
                                  ...prev,
                                  logChannel: e.target.value,
                                }))
                              }
                              placeholder="#mod-logs"
                              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50"
                            />
                          </div>
                          <button
                            onClick={async () => {
                              if (!selectedGuild) return;
                              try {
                                const res = await fetch(
                                  `/api/bot/proxy/guild/${selectedGuild.id}/modules`,
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      module: "moderation",
                                      enabled: true,
                                      ...moderationConfig,
                                    }),
                                  }
                                );
                                if (res.ok)
                                  showToast("Moderación configurada", "success");
                              } catch {
                                showToast("Error", "error");
                              }
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white"
                          >
                            <Save size={14} /> Guardar
                          </button>
                        </div>
                      </div>

                      <div className="glass rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                          <Shield size={18} className="text-[#ED4245]" /> Acción
                          Moderadora
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">
                              Tipo de acción
                            </label>
                            <select
                              value={modAction.type}
                              onChange={(e) =>
                                setModAction((prev) => ({
                                  ...prev,
                                  type: e.target.value,
                                }))
                              }
                              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50"
                            >
                              <option value="ban">Ban</option>
                              <option value="kick">Kick</option>
                              <option value="mute">Mute</option>
                              <option value="warn">Warn</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">
                              ID del usuario
                            </label>
                            <input
                              type="text"
                              value={modAction.userId}
                              onChange={(e) =>
                                setModAction((prev) => ({
                                  ...prev,
                                  userId: e.target.value,
                                }))
                              }
                              placeholder="ID de Discord"
                              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">
                              Razón
                            </label>
                            <input
                              type="text"
                              value={modAction.reason}
                              onChange={(e) =>
                                setModAction((prev) => ({
                                  ...prev,
                                  reason: e.target.value,
                                }))
                              }
                              placeholder="Razón..."
                              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50"
                            />
                          </div>
                          <button
                            onClick={executeModAction}
                            disabled={!modAction.userId}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ED4245] hover:bg-[#c03537] transition-colors text-sm font-semibold text-white disabled:opacity-50"
                          >
                            <ShieldAlert size={14} /> Ejecutar
                          </button>
                        </div>
                      </div>

                      {casesList.length > 0 && (
                        <div className="glass rounded-2xl p-6">
                          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <FileText
                              size={18}
                              className="text-[#5865F2]"
                            />{" "}
                            Historial de Casos
                          </h3>
                          <div className="space-y-2">
                            {casesList.slice(0, 10).map((c: any, i: number) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                              >
                                <span className="text-xs font-bold text-gray-600 w-8">
                                  #{c.id || i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm text-white">
                                    {c.type || "Unknown"} — {c.userId || "N/A"}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {c.reason || "Sin razón"} ·{" "}
                                    {c.timestamp
                                      ? formatDate(c.timestamp)
                                      : "Fecha desconocida"}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {guildSubTab === "protection" && (
                    <motion.div
                      key="protection"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="glass rounded-2xl p-6"
                    >
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Lock size={18} className="text-[#7C3AED]" />{" "}
                        Configuración de Protección
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                          <div>
                            <div className="text-sm font-semibold text-white">
                              Anti-Raid
                            </div>
                            <div className="text-xs text-gray-500">
                              Protección contra raids
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setProtectionConfig((prev) => ({
                                ...prev,
                                antiRaid: !prev.antiRaid,
                              }))
                            }
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              protectionConfig.antiRaid
                                ? "bg-[#5865F2]"
                                : "bg-gray-700"
                            }`}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                protectionConfig.antiRaid ? "left-7" : "left-1"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                          <div>
                            <div className="text-sm font-semibold text-white">
                              Anti-Spam
                            </div>
                            <div className="text-xs text-gray-500">
                              Protección contra spam
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setProtectionConfig((prev) => ({
                                ...prev,
                                antiSpam: !prev.antiSpam,
                              }))
                            }
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              protectionConfig.antiSpam
                                ? "bg-[#5865F2]"
                                : "bg-gray-700"
                            }`}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                protectionConfig.antiSpam ? "left-7" : "left-1"
                              }`}
                            />
                          </button>
                        </div>
                        <button
                          onClick={saveProtectionConfig}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white"
                        >
                          <Save size={14} /> Guardar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <div className="relative mb-6">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="text"
                    placeholder="Buscar servidores..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50"
                  />
                </div>

                {guilds.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {guilds
                      .filter(
                        (g) =>
                          g.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          g.id.includes(searchQuery)
                      )
                      .map((guild, i) => (
                        <motion.div
                          key={guild.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="glass rounded-xl p-5 hover:-translate-y-0.5 transition-all cursor-pointer"
                          onClick={() => loadGuildDetails(guild)}
                        >
                          <div className="flex items-center gap-4">
                            {guild.icon ? (
                              <Image
                                src={guild.icon}
                                alt={guild.name}
                                width={56}
                                height={56}
                                className="rounded-xl border border-white/10 flex-shrink-0"
                                unoptimized
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-xl bg-[#5865F2]/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-[#5865F2] font-black text-xl">
                                  {guild.name[0]}
                                </span>
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-white truncate">
                                {guild.name}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                <span className="flex items-center gap-1">
                                  <Users size={10} />{" "}
                                  {guild.members.toLocaleString()}
                                </span>
                                {guild.inBot && (
                                  <span className="text-green-400 flex items-center gap-1">
                                    <Bot size={10} /> Bot activo
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight
                              size={16}
                              className="text-gray-600 flex-shrink-0"
                            />
                          </div>
                        </motion.div>
                      ))}
                  </div>
                ) : (
                  <div className="glass rounded-2xl p-12 text-center">
                    <Server
                      size={48}
                      className="text-gray-700 mx-auto mb-4"
                    />
                    <p className="text-gray-500 mb-2">
                      No tienes servidores donde gestionar el bot.
                    </p>
                    <a
                      href={BOT_INVITE}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5865F2] text-white text-sm font-semibold mt-4"
                    >
                      <ExternalLink size={14} /> Invitar Bot a tu servidor
                    </a>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* ==================== TAB: OWNER PANEL ==================== */}
        {activeTab === "owner" && isOwner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Power size={18} className="text-[#ED4245]" /> Control del Bot
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => executePowerAction("restart")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 transition-colors text-sm font-semibold text-yellow-400"
                >
                  <RefreshCw size={14} /> Reiniciar
                </button>
                <button
                  onClick={() => executePowerAction("stop")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-colors text-sm font-semibold text-red-400"
                >
                  <Power size={14} /> Detener
                </button>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Megaphone size={18} className="text-[#5865F2]" /> Broadcast
              </h3>
              <div className="space-y-4">
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Escribe un mensaje para enviar a todos los servidores..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 resize-none"
                />
                <button
                  onClick={sendBroadcast}
                  disabled={!broadcastMessage.trim() || broadcastLoading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white disabled:opacity-50"
                >
                  <Send size={14} />{" "}
                  {broadcastLoading ? "Enviando..." : "Enviar Broadcast"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Ban size={18} className="text-[#ED4245]" /> Bans Globales
                </h3>
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="ID de usuario"
                    id="banUserId"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50"
                  />
                  <input
                    type="text"
                    placeholder="Razón"
                    id="banReason"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50"
                  />
                  <button
                    onClick={() => {
                      const userIdEl = document.getElementById(
                        "banUserId"
                      ) as HTMLInputElement;
                      const reasonEl = document.getElementById(
                        "banReason"
                      ) as HTMLInputElement;
                      if (userIdEl.value) {
                        addGlobalBan(userIdEl.value, reasonEl.value);
                        userIdEl.value = "";
                        reasonEl.value = "";
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ED4245] hover:bg-[#c03537] transition-colors text-sm font-semibold text-white"
                  >
                    <Plus size={14} /> Añadir Ban
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {globalBans.map((ban) => (
                    <div
                      key={ban.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                    >
                      <Ban size={14} className="text-red-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">
                          {ban.username} ({ban.userId})
                        </div>
                        <div className="text-xs text-gray-500">
                          {ban.reason} · {formatDate(ban.bannedAt)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeGlobalBan(ban.id)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <UserCog size={18} className="text-[#5865F2]" /> Staff
                </h3>
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Username"
                    id="staffUsername"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50"
                  />
                  <select
                    id="staffRole"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50"
                  >
                    <option value="moderator">Moderador</option>
                    <option value="admin">Admin</option>
                    <option value="developer">Developer</option>
                  </select>
                  <button
                    onClick={() => {
                      const usernameEl = document.getElementById(
                        "staffUsername"
                      ) as HTMLInputElement;
                      const roleEl = document.getElementById(
                        "staffRole"
                      ) as HTMLSelectElement;
                      if (usernameEl.value) {
                        addStaff(usernameEl.value, roleEl.value);
                        usernameEl.value = "";
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white"
                  >
                    <Plus size={14} /> Añadir Staff
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {staffList.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                    >
                      <UserCog
                        size={14}
                        className="text-[#5865F2] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">
                          {member.username}
                        </div>
                        <div className="text-xs text-gray-500">
                          {member.role} · {formatDate(member.addedAt)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeStaff(member.id)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {ownerStats && (
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#7C3AED]" /> Analytics
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-xs text-gray-500 mb-1">
                      Comandos Totales
                    </div>
                    <div className="text-xl font-bold text-white">
                      {ownerStats.totalCommands.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-xs text-gray-500 mb-1">Hoy</div>
                    <div className="text-xl font-bold text-white">
                      {ownerStats.commandsToday.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-xs text-gray-500 mb-1">
                      Servidores Activos
                    </div>
                    <div className="text-xl font-bold text-white">
                      {ownerStats.activeGuilds}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="text-xs text-gray-500 mb-1">
                      Usuarios Activos
                    </div>
                    <div className="text-xl font-bold text-white">
                      {ownerStats.activeUsers.toLocaleString()}
                    </div>
                  </div>
                </div>
                {ownerStats.topCommands && ownerStats.topCommands.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">
                      Top Comandos
                    </h4>
                    <div className="space-y-2">
                      {ownerStats.topCommands.slice(0, 5).map((cmd, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2 rounded-lg"
                        >
                          <span className="text-xs font-bold text-gray-600 w-4">
                            #{i + 1}
                          </span>
                          <code className="px-2 py-1 rounded-lg bg-[#5865F2]/10 text-[#5865F2] text-sm font-mono">
                            {cmd.name}
                          </code>
                          <span className="text-sm text-gray-400 ml-auto">
                            {cmd.uses.toLocaleString()} usos
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Gift size={18} className="text-[#EB459E]" /> Premium Users
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {premiumUsers.length > 0 ? (
                    premiumUsers.map((pu) => (
                      <div
                        key={pu.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            pu.active ? "bg-green-400" : "bg-gray-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white truncate">
                            {pu.username}
                          </div>
                          <div className="text-xs text-gray-500">
                            {pu.tier} · Expira{" "}
                            {pu.expiresAt ? formatDate(pu.expiresAt) : "N/A"}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Sin usuarios premium
                    </p>
                  )}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Code size={18} className="text-[#57F287]" /> Premium Codes
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {premiumCodes.length > 0 ? (
                    premiumCodes.map((pc) => (
                      <div
                        key={pc.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                      >
                        <code className="px-2 py-1 rounded-lg bg-[#57F287]/10 text-[#57F287] text-sm font-mono">
                          {pc.code}
                        </code>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500">
                            {pc.tier} · {pc.uses}/{pc.maxUses} usos
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(pc.code);
                            showToast("Código copiado", "success");
                          }}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Sin códigos premium
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================== TAB: JARVIS AI ==================== */}
        {activeTab === "jarvis" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            <div className="lg:col-span-3 glass rounded-2xl p-6 flex flex-col h-[600px]">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-[#7C3AED]" /> JARVIS AI
              </h3>
              <div
                ref={jarvisRef}
                className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2"
              >
                {jarvisMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Sparkles
                      size={48}
                      className="text-[#7C3AED]/30 mb-4"
                    />
                    <p className="text-gray-500 text-sm">
                      Escribe un mensaje para empezar a chatear con JARVIS
                    </p>
                  </div>
                )}
                {jarvisMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                        msg.role === "user"
                          ? "bg-[#5865F2] text-white rounded-br-md"
                          : "bg-white/5 text-gray-300 rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {jarvisLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" />
                        <div
                          className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={jarvisInput}
                  onChange={(e) => setJarvisInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendJarvisMessage()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50"
                />
                <button
                  onClick={sendJarvisMessage}
                  disabled={!jarvisInput.trim() || jarvisLoading}
                  className="px-4 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-white disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-[#57F287]" /> Métricas
                </h3>
                {jarvisMetrics ? (
                  <div className="space-y-3">
                    {Object.entries(jarvisMetrics).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/5"
                      >
                        <span className="text-xs text-gray-500">{key}</span>
                        <span className="text-sm text-white font-semibold">
                          {typeof value === "number"
                            ? value.toLocaleString()
                            : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Cargando métricas...
                  </p>
                )}
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Zap size={18} className="text-[#FEE75C]" /> Acciones Rápidas
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      sendJarvisMessage()
                    }
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors text-left"
                  >
                    <Terminal size={14} className="text-[#57F287] flex-shrink-0" />
                    <span className="text-sm text-gray-300">
                      Ver logs del bot
                    </span>
                  </button>
                  <button
                    onClick={() => executePowerAction("restart")}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors text-left"
                  >
                    <RefreshCw
                      size={14}
                      className="text-[#FEE75C] flex-shrink-0"
                    />
                    <span className="text-sm text-gray-300">
                      Reiniciar bot
                    </span>
                  </button>
                  <button
                    onClick={() =>
                      setJarvisInput("¿Cuál es el estado de PM2?")
                    }
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors text-left"
                  >
                    <Box size={14} className="text-[#5865F2] flex-shrink-0" />
                    <span className="text-sm text-gray-300">
                      Estado de PM2
                    </span>
                  </button>
                  <button
                    onClick={() =>
                      setJarvisInput("Muestra las estadísticas actuales")
                    }
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors text-left"
                  >
                    <BarChart3
                      size={14}
                      className="text-[#7C3AED] flex-shrink-0"
                    />
                    <span className="text-sm text-gray-300">
                      Ver estadísticas
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
