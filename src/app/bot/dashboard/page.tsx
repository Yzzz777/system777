/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "@/components/Providers";
import {
  Server, Users, Zap, Clock, LogIn, ShieldCheck, Activity, Settings,
  ExternalLink, Bot, Crown, BarChart3, TrendingUp, Command, Cpu, Globe,
  Star, Search, Send, RefreshCw, Power, ChevronRight, ChevronLeft,
  Shield, Ticket, Smile, Coins, ShieldAlert, Lock, UserCheck, ScrollText,
  MessageCircle, Trash2, Plus, Save, Copy, Terminal, FileText, Award,
  Gift, Ban, Sparkles, Layout, Megaphone, UserCog, Code, Menu, X,
  Hash, Volume2, ShieldBan, Flame, Bug, MessageSquare,
  Palette, Type, CheckCircle, AlertTriangle,
  Link2, Filter, AtSign, Repeat,
  CreditCard, Key, Wrench, Monitor, Gamepad2,
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
  node?: string;
  version?: string;
  heapUsed?: number;
  rss?: number;
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

interface Channel {
  id: string;
  name: string;
  type: number;
}

interface Role {
  id: string;
  name: string;
  color: number;
  position: number;
}

interface GuildConfig {
  channels?: Channel[];
  roles?: Role[];
  categories?: any[];
  modules?: Record<string, any>;
  welcome?: any;
  goodbye?: any;
  autorole?: any;
  logs?: any;
  protection?: any;
  levels?: any;
  economy?: any;
  tickets?: any;
  verification?: any;
}

interface ModuleConfig {
  [key: string]: any;
}

interface JarvisMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface StaffMember {
  id: string;
  userId?: string;
  username: string;
  role: string;
  rank?: string;
  note?: string;
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

interface IpBan {
  id: string;
  ip: string;
  userId?: string;
  reason: string;
  bannedAt: string;
}

interface PremiumUser {
  id: string;
  username: string;
  tier: string;
  plan?: string;
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
  uptime?: number;
}

interface UserProfile {
  id: string;
  username: string;
  email?: string;
  image?: string;
  role?: string;
  premium?: {
    active: boolean;
    plan?: string;
    expiresAt?: string;
  };
}

interface ModerationCase {
  id: string;
  type: string;
  userId: string;
  username?: string;
  moderatorId?: string;
  reason: string;
  duration?: string;
  timestamp: string;
}

interface TicketButton {
  id: string;
  emoji: string;
  label: string;
  buttonId: string;
  color: string;
  description: string;
  welcomeMessage: string;
}

interface SecurityData {
  flaggedUsers: any[];
  highRisk: number;
  alerts: any[];
  altsDetected: number;
  recentAlerts: any[];
}

interface BotLogEntry {
  level: string;
  message: string;
  timestamp: string;
  source?: string;
}

interface PremiumRequest {
  id: string;
  userId: string;
  username: string;
  plan: string;
  status: string;
  createdAt: string;
}

interface PremiumCoupon {
  code: string;
  discount: number;
  uses: number;
  maxUses: number;
  expiresAt: string;
}

interface PremiumPlan {
  name: string;
  price: number;
  features: string[];
  storeUrl?: string;
}

interface PremiumHistory {
  action: string;
  userId: string;
  username: string;
  plan?: string;
  timestamp: string;
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

type SectionId =
  | "overview" | "servers" | "profile"
  | "modules" | "welcome" | "tickets" | "autorole" | "logs" | "protection"
  | "moderation" | "levels" | "economy" | "verification"
  | "bot-control" | "global-bans" | "broadcast" | "ip-bans" | "security"
  | "staff" | "analytics" | "premium-admin" | "jarvis" | "bot-logs" | "terminal";

interface NavItem {
  id: SectionId;
  label: string;
  icon: any;
  ownerOnly?: boolean;
  serverOnly?: boolean;
  category: "general" | "server" | "owner";
}

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Resumen", icon: BarChart3, category: "general" },
  { id: "servers", label: "Servidores", icon: Server, category: "general" },
  { id: "profile", label: "Mi Perfil", icon: UserCog, category: "general" },
  { id: "modules", label: "Control de Módulos", icon: Layout, serverOnly: true, category: "server" },
  { id: "welcome", label: "Bienvenida / Despedida", icon: Smile, serverOnly: true, category: "server" },
  { id: "tickets", label: "Tickets", icon: Ticket, serverOnly: true, category: "server" },
  { id: "autorole", label: "Roles", icon: UserCog, serverOnly: true, category: "server" },
  { id: "logs", label: "Logs", icon: ScrollText, serverOnly: true, category: "server" },
  { id: "protection", label: "Protección", icon: ShieldAlert, serverOnly: true, category: "server" },
  { id: "moderation", label: "Moderación", icon: Shield, serverOnly: true, category: "server" },
  { id: "levels", label: "Niveles & XP", icon: TrendingUp, serverOnly: true, category: "server" },
  { id: "economy", label: "Economía", icon: Coins, serverOnly: true, category: "server" },
  { id: "verification", label: "Verificación", icon: UserCheck, serverOnly: true, category: "server" },
  { id: "bot-control", label: "Control del Bot", icon: Power, ownerOnly: true, category: "owner" },
  { id: "global-bans", label: "Bans Globales", icon: Ban, ownerOnly: true, category: "owner" },
  { id: "broadcast", label: "Broadcast", icon: Megaphone, ownerOnly: true, category: "owner" },
  { id: "ip-bans", label: "IP Bans", icon: ShieldBan, ownerOnly: true, category: "owner" },
  { id: "security", label: "Security", icon: ShieldCheck, ownerOnly: true, category: "owner" },
  { id: "staff", label: "Staff", icon: Users, ownerOnly: true, category: "owner" },
  { id: "analytics", label: "Analytics", icon: BarChart3, ownerOnly: true, category: "owner" },
  { id: "premium-admin", label: "Premium Admin", icon: Crown, ownerOnly: true, category: "owner" },
  { id: "jarvis", label: "JARVIS AI", icon: Sparkles, ownerOnly: true, category: "owner" },
  { id: "terminal", label: "Terminal", icon: Terminal, ownerOnly: true, category: "owner" },
  { id: "bot-logs", label: "Bot Logs", icon: FileText, ownerOnly: true, category: "owner" },
];

const MODULES = [
  { id: "welcome", label: "Bienvenida", icon: Smile, color: "#57F287", category: "Comunidad" },
  { id: "goodbye", label: "Despedida", icon: MessageCircle, color: "#ED4245", category: "Comunidad" },
  { id: "tickets", label: "Tickets", icon: Ticket, color: "#FEE75C", category: "Comunidad" },
  { id: "levels", label: "Niveles", icon: TrendingUp, color: "#EB459E", category: "Entretenimiento" },
  { id: "economy", label: "Economía", icon: Coins, color: "#5865F2", category: "Entretenimiento" },
  { id: "moderation", label: "Moderación", icon: ShieldAlert, color: "#ED4245", category: "Seguridad" },
  { id: "protection", label: "Protección", icon: Lock, color: "#7C3AED", category: "Seguridad" },
  { id: "verification", label: "Verificación", icon: UserCheck, color: "#57F287", category: "Seguridad" },
  { id: "autorole", label: "Autorole", icon: UserCog, color: "#FEE75C", category: "Utilidad" },
  { id: "logs", label: "Logs", icon: ScrollText, color: "#5865F2", category: "Utilidad" },
];

const PREMIUM_PLANS = [
  { name: "Sharingan", price: "$4.99/mes", features: ["5 servidores", "10 comandos premium", "Soporte prioritario"], color: "#ED4245" },
  { name: "Mangekyo", price: "$9.99/mes", features: ["15 servidores", "25 comandos premium", "Soporte VIP", "JARVIS acceso"], color: "#7C3AED" },
  { name: "Rinnegan", price: "$19.99/mes", features: ["Ilimitado", "Todos los comandos", "Soporte 24/7", "JARVIS completo", "API acceso"], color: "#5865F2" },
];

const TICKET_BUTTON_COLORS = [
  { value: "Primary", label: "Blue", hex: "#5865F2" },
  { value: "Secondary", label: "Gray", hex: "#99AAB5" },
  { value: "Success", label: "Green", hex: "#57F287" },
  { value: "Danger", label: "Red", hex: "#ED4245" },
];

const CHANNEL_SELECT_CLASSES = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 appearance-none";

function Toggle({ enabled, onToggle, disabled }: { enabled: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? "bg-[#5865F2]" : "bg-gray-700"} ${disabled ? "opacity-50" : ""}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? "left-7" : "left-1"}`} />
    </button>
  );
}

export default function BotDashboardPage() {
  const { data: sessionData, status: sessionStatus } = useSession();
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [stats, setStats] = useState<BotStats | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [guildConfig, setGuildConfig] = useState<GuildConfig>({});
  const [guildModules, setGuildModules] = useState<ModuleConfig>({});
  const [moduleLoading, setModuleLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const [ownerStats, setOwnerStats] = useState<Analytics | null>(null);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [globalBans, setGlobalBans] = useState<GlobalBan[]>([]);
  const [ipBans, setIpBans] = useState<IpBan[]>([]);
  const [premiumUsers, setPremiumUsers] = useState<PremiumUser[]>([]);
  const [premiumCodes, setPremiumCodes] = useState<PremiumCode[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [botPowerStatus, setBotPowerStatus] = useState<string>("online");

  const [jarvisMessages, setJarvisMessages] = useState<JarvisMessage[]>([]);
  const [jarvisInput, setJarvisInput] = useState("");
  const [jarvisLoading, setJarvisLoading] = useState(false);
  const [jarvisMetrics, setJarvisMetrics] = useState<any>(null);
  const [jarvisModel, setJarvisModel] = useState("llama-3.3-70b");
  const [jarvisMode, setJarvisMode] = useState<"professional" | "stark">("professional");
  const jarvisRef = useRef<HTMLDivElement>(null);

  const [welcomeConfig, setWelcomeConfig] = useState({
    enabled: false, channel: "", title: "", message: "", color: "#5865F2", image: "",
  });
  const [goodbyeConfig, setGoodbyeConfig] = useState({
    enabled: false, channel: "", title: "", message: "", color: "#ED4245", image: "",
  });
  const [autoroleConfig, setAutoroleConfig] = useState({ enabled: false, roleId: "" });
  const [logsConfig, setLogsConfig] = useState({
    enabled: false, moderation: "", messages: "", members: "", channels: "", roles: "", voice: "",
  });
  const [protectionConfig, setProtectionConfig] = useState({
    enabled: false,
    antiRaid: { enabled: false, threshold: 5, action: "timeout" as "timeout" | "kick" | "ban" },
    antiSpam: { enabled: false, maxMessages: 5 },
    antiPhishing: { enabled: false },
    antiAlt: { enabled: false, minAgeDays: 7 },
    antiNuke: {
      enabled: false,
      channels: { threshold: 3, action: "remove_roles" as string },
      roles: { threshold: 2, action: "remove_roles" as string },
      emojis: { threshold: 5, action: "timeout" as string },
      bans: { threshold: 3, action: "timeout" as string },
      kicks: { threshold: 3, action: "timeout" as string },
      webhooks: { threshold: 3, action: "timeout" as string },
    },
    autoMod: {
      enabled: false, logChannel: "",
      links: false, zalgo: false, duplicates: false, caps: false, massMentions: false, invites: false,
    },
    wordFilter: { enabled: false, words: "", warningMessage: "", action: "delete" as "delete" | "delete+warn" | "delete+timeout" },
  });
  const [moderationConfig, setModerationConfig] = useState({
    enabled: false, autoMod: false, logChannel: "",
  });
  const [levelsConfig, setLevelsConfig] = useState({
    enabled: false, xpPerMessage: 15, xpVoicePerMinute: 10,
    announceChannel: "", multiplier: "1x", levelUpMessage: "",
    ignoreBots: true, resetRoles: false,
    rewards: [] as { level: number; roleId: string }[],
  });
  const [economyConfig, setEconomyConfig] = useState({
    enabled: false, currencyName: "Coins", currencyPlural: "Coins", currencyEmoji: "🪙",
    startingBalance: 100, workReward: 100, workCooldown: 3600,
    dailyReward: 500, dailyCooldown: 86400,
    robEnabled: true, maxRobPercent: 20, slotsEnabled: true,
    slotsMultiplier: 2, slotsMinBet: 10, slotsMaxBet: 1000,
  });
  const [ticketConfig, setTicketConfig] = useState({
    channel: "", title: "", description: "", color: "#5865F2", image: "",
    supportRole: "", logChannel: "", category: "", prefix: "TICKET-",
    maxTickets: 5, pingOnCreate: true, dmTranscript: true,
  });
  const [ticketButtons, setTicketButtons] = useState<TicketButton[]>([
    { id: "1", emoji: "🎫", label: "Soporte General", buttonId: "support_general", color: "Primary", description: "Soporte general del servidor", welcomeMessage: "Hola, bienvenido al soporte. ¿En qué podemos ayudarte?" },
  ]);
  const [verifyConfig, setVerifyConfig] = useState({
    enabled: false, channel: "", message: "", roleId: "",
  });

  const [levelsTop, setLevelsTop] = useState<any[]>([]);
  const [economyTop, setEconomyTop] = useState<any[]>([]);
  const [casesList, setCasesList] = useState<ModerationCase[]>([]);
  const [openTickets, setOpenTickets] = useState<any[]>([]);

  const [modAction, setModAction] = useState({
    type: "ban", userId: "", reason: "", duration: "1h", deleteDays: 0,
  });
  const [globalBanForm, setGlobalBanForm] = useState({ userId: "", reason: "" });
  const [ipBanForm, setIpBanForm] = useState({ ip: "", reason: "" });
  const [ipLookupUserId, setIpLookupUserId] = useState("");
  const [ipLookupIp, setIpLookupIp] = useState("");
  const [ipLookupResults, setIpLookupResults] = useState<any>(null);
  const [staffForm, setStaffForm] = useState({ userId: "", rank: "moderator", note: "" });
  const [premiumCodeTier, setPremiumCodeTier] = useState("Sharingan");
  const [redeemCode, setRedeemCode] = useState("");
  const [premiumGrantForm, setPremiumGrantForm] = useState({ userId: "", tier: "Sharingan" });

  const [securityData, setSecurityData] = useState<SecurityData | null>(null);
  const [staffLogs, setStaffLogs] = useState<any[]>([]);
  const [botLogs, setBotLogs] = useState<BotLogEntry[]>([]);
  const [botLogsAutoRefresh, setBotLogsAutoRefresh] = useState(false);
  const [securityGuildId, setSecurityGuildId] = useState("");

  const [premiumRequests, setPremiumRequests] = useState<PremiumRequest[]>([]);
  const [premiumHistory, setPremiumHistory] = useState<PremiumHistory[]>([]);
  const [premiumServers, setPremiumServers] = useState<any[]>([]);
  const [premiumPlansConfig, setPremiumPlansConfig] = useState<PremiumPlan[]>([]);
  const [premiumStoreUrl, setPremiumStoreUrl] = useState("");
  const [premiumBlacklist, setPremiumBlacklist] = useState<any[]>([]);
  const [premiumBlacklistForm, setPremiumBlacklistForm] = useState("");
  const [premiumCoupons, setPremiumCoupons] = useState<PremiumCoupon[]>([]);
  const [premiumCouponForm, setPremiumCouponForm] = useState({ code: "", discount: 10, maxUses: 100, expiresAt: "" });
  const [premiumForceExpireId, setPremiumForceExpireId] = useState("");
  const [premiumGiveAllIds, setPremiumGiveAllIds] = useState("");
  const [premiumGiveAllPlan, setPremiumGiveAllPlan] = useState("Sharingan");
  const [premiumGiveAllDays, setPremiumGiveAllDays] = useState(30);
  const [premiumAdminTab, setPremiumAdminTab] = useState("users");

  const [guildSubTab, setGuildSubTab] = useState("modules");

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    const fetchData = async () => {
      try {
        const [statsRes, guildsRes, profileRes] = await Promise.allSettled([
          fetch("/api/bot/proxy/public/stats"),
          fetch("/api/bot/proxy/public/guilds"),
          fetch("/api/bot/proxy/profile/me"),
        ]);
        if (statsRes.status === "fulfilled" && statsRes.value.ok) {
          setStats(await statsRes.value.json());
        }
        if (guildsRes.status === "fulfilled" && guildsRes.value.ok) {
          const data = await guildsRes.value.json();
          setGuilds(Array.isArray(data) ? data : data.guilds || []);
        }
        if (profileRes.status === "fulfilled" && profileRes.value.ok) {
          setUserProfile(await profileRes.value.json());
        }
      } catch {}
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [sessionStatus]);

  useEffect(() => {
    if (sessionData?.user?.role !== "OWNER" && sessionData?.user?.role !== "owner") return;
    const fetchOwnerData = async () => {
      try {
        const [analyticsRes, staffRes, bansRes, ipBansRes, pUsersRes, pCodesRes, powerRes, ownerStatsRes] =
          await Promise.allSettled([
            fetch("/api/bot/proxy/analytics"),
            fetch("/api/bot/proxy/staff"),
            fetch("/api/bot/proxy/globalbans"),
            fetch("/api/bot/proxy/ipban"),
            fetch("/api/bot/proxy/premium/users"),
            fetch("/api/bot/proxy/premium/codes"),
            fetch("/api/bot/proxy/power"),
            fetch("/api/bot/proxy/stats"),
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
        if (ipBansRes.status === "fulfilled" && ipBansRes.value.ok) {
          const d = await ipBansRes.value.json();
          setIpBans(Array.isArray(d) ? d : d.bans || []);
        }
        if (pUsersRes.status === "fulfilled" && pUsersRes.value.ok) {
          const d = await pUsersRes.value.json();
          setPremiumUsers(Array.isArray(d) ? d : d.users || []);
        }
        if (pCodesRes.status === "fulfilled" && pCodesRes.value.ok) {
          const d = await pCodesRes.value.json();
          setPremiumCodes(Array.isArray(d) ? d : d.codes || []);
        }
        if (powerRes.status === "fulfilled" && powerRes.value.ok) {
          const d = await powerRes.value.json();
          setBotPowerStatus(d.status || "online");
        }
        if (ownerStatsRes.status === "fulfilled" && ownerStatsRes.value.ok) {
          const d = await ownerStatsRes.value.json();
          setStats((prev) => prev ? { ...prev, ...d } : d);
        }
      } catch {}
    };
    fetchOwnerData();
  }, [sessionData]);

  useEffect(() => {
    if (activeSection !== "jarvis") return;
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/bot/proxy/jarvis/metrics");
        if (res.ok) setJarvisMetrics(await res.json());
      } catch {}
    };
    fetchMetrics();
  }, [activeSection]);

  useEffect(() => {
    if (jarvisRef.current) {
      jarvisRef.current.scrollTop = jarvisRef.current.scrollHeight;
    }
  }, [jarvisMessages]);

  useEffect(() => {
    if (activeSection !== "bot-logs" || !botLogsAutoRefresh) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/bot/proxy/logs");
        if (res.ok) {
          const d = await res.json();
          setBotLogs(Array.isArray(d) ? d : d.logs || []);
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [activeSection, botLogsAutoRefresh]);

  const loadGuildConfig = async (guildId: string) => {
    try {
      const res = await fetch(`/api/bot/proxy/guild/${guildId}`);
      if (res.ok) {
        const data = await res.json();
        setGuildConfig(data);
        if (data.modules) setGuildModules(data.modules);
        if (data.welcome) setWelcomeConfig((prev) => ({ ...prev, ...data.welcome }));
        if (data.goodbye) setGoodbyeConfig((prev) => ({ ...prev, ...data.goodbye }));
        if (data.autorole) setAutoroleConfig((prev) => ({ ...prev, ...data.autorole }));
        if (data.logs) setLogsConfig((prev) => ({ ...prev, ...data.logs }));
        if (data.protection) setProtectionConfig((prev) => ({ ...prev, ...data.protection }));
        if (data.levels) setLevelsConfig((prev) => ({ ...prev, ...data.levels }));
        if (data.economy) setEconomyConfig((prev) => ({ ...prev, ...data.economy }));
        if (data.tickets) setTicketConfig((prev) => ({ ...prev, ...data.tickets }));
        if (data.verification) setVerifyConfig((prev) => ({ ...prev, ...data.verification }));
        if (data.ticketButtons) setTicketButtons(data.ticketButtons);
      }
    } catch {}
  };

  const loadGuildDetails = async (guild: Guild) => {
    setSelectedGuild(guild);
    setGuildSubTab("modules");
    await loadGuildConfig(guild.id);
    try {
      const [levelsTopRes, econTopRes, casesRes, ticketsRes] = await Promise.allSettled([
        fetch(`/api/bot/proxy/guild/${guild.id}/levels/top`),
        fetch(`/api/bot/proxy/guild/${guild.id}/economy/top`),
        fetch(`/api/bot/proxy/cases/${guild.id}`),
        fetch(`/api/bot/proxy/guild/${guild.id}/tickets/list`),
      ]);
      if (levelsTopRes.status === "fulfilled" && levelsTopRes.value.ok) {
        const d = await levelsTopRes.value.json();
        setLevelsTop(Array.isArray(d) ? d : d.top || []);
      }
      if (econTopRes.status === "fulfilled" && econTopRes.value.ok) {
        const d = await econTopRes.value.json();
        setEconomyTop(Array.isArray(d) ? d : d.top || []);
      }
      if (casesRes.status === "fulfilled" && casesRes.value.ok) {
        const d = await casesRes.value.json();
        setCasesList(Array.isArray(d) ? d : d.cases || []);
      }
      if (ticketsRes.status === "fulfilled" && ticketsRes.value.ok) {
        const d = await ticketsRes.value.json();
        setOpenTickets(Array.isArray(d) ? d : d.tickets || []);
      }
    } catch {}
  };

  const selectGuild = (guild: Guild) => {
    loadGuildDetails(guild);
    setActiveSection("modules");
    setSidebarOpen(false);
  };

  const goBackFromGuild = () => {
    setSelectedGuild(null);
    setActiveSection("servers");
  };

  const handleNavClick = (item: NavItem) => {
    if (item.serverOnly && !selectedGuild) {
      setActiveSection("servers");
    } else {
      setActiveSection(item.id);
    }
    setSidebarOpen(false);
  };

  const saveModuleConfig = async (moduleId: string, config: any) => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(`/api/bot/proxy/guild/${selectedGuild.id}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: moduleId, ...config }),
      });
      if (res.ok) showToast(`Módulo ${moduleId} guardado`, "success");
      else showToast("Error al guardar", "error");
    } catch {
      showToast("Error de conexión", "error");
    }
  };

  const toggleModule = async (moduleId: string) => {
    if (!selectedGuild) return;
    const currentValue = guildModules[moduleId]?.enabled ?? false;
    const newValue = !currentValue;
    setModuleLoading(true);
    try {
      const res = await fetch(`/api/bot/proxy/guild/${selectedGuild.id}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: moduleId, enabled: newValue }),
      });
      if (res.ok) {
        setGuildModules((prev) => ({ ...prev, [moduleId]: { ...(prev[moduleId] || {}), enabled: newValue } }));
        showToast(`Módulo ${moduleId} ${newValue ? "activado" : "desactivado"}`, "success");
      }
    } catch {
      showToast("Error al actualizar módulo", "error");
    }
    setModuleLoading(false);
  };

  const saveWelcome = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(`/api/bot/proxy/guild/${selectedGuild.id}/welcome`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(welcomeConfig),
      });
      if (res.ok) showToast("Configuración de bienvenida guardada", "success");
    } catch { showToast("Error al guardar", "error"); }
  };

  const saveGoodbye = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(`/api/bot/proxy/guild/${selectedGuild.id}/goodbye`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goodbyeConfig),
      });
      if (res.ok) showToast("Configuración de despedida guardada", "success");
    } catch { showToast("Error al guardar", "error"); }
  };

  const saveAutorole = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(`/api/bot/proxy/guild/${selectedGuild.id}/autorole`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(autoroleConfig),
      });
      if (res.ok) showToast("Autorole guardado", "success");
    } catch { showToast("Error al guardar", "error"); }
  };

  const saveLogs = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(`/api/bot/proxy/guild/${selectedGuild.id}/logs`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logsConfig),
      });
      if (res.ok) showToast("Logs configurados", "success");
    } catch { showToast("Error al guardar", "error"); }
  };

  const saveProtection = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(`/api/bot/proxy/guild/${selectedGuild.id}/protection`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(protectionConfig),
      });
      if (res.ok) showToast("Protección guardada", "success");
    } catch { showToast("Error al guardar", "error"); }
  };

  const saveLevels = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(`/api/bot/proxy/guild/${selectedGuild.id}/levels`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(levelsConfig),
      });
      if (res.ok) {
        showToast("Niveles guardados", "success");
        const topRes = await fetch(`/api/bot/proxy/guild/${selectedGuild.id}/levels/top`);
        if (topRes.ok) {
          const d = await topRes.json();
          setLevelsTop(Array.isArray(d) ? d : d.top || []);
        }
      }
    } catch { showToast("Error al guardar", "error"); }
  };

  const saveEconomy = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(`/api/bot/proxy/guild/${selectedGuild.id}/economy`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(economyConfig),
      });
      if (res.ok) {
        showToast("Economía guardada", "success");
        const topRes = await fetch(`/api/bot/proxy/guild/${selectedGuild.id}/economy/top`);
        if (topRes.ok) {
          const d = await topRes.json();
          setEconomyTop(Array.isArray(d) ? d : d.top || []);
        }
      }
    } catch { showToast("Error al guardar", "error"); }
  };

  const saveTicketsSetup = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(`/api/bot/proxy/guild/${selectedGuild.id}/tickets/setup`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ticketConfig, buttons: ticketButtons }),
      });
      if (res.ok) showToast("Tickets configurados", "success");
    } catch { showToast("Error al configurar", "error"); }
  };

  const saveTicketConfig = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(`/api/bot/proxy/guild/${selectedGuild.id}/tickets/config`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ticketConfig, buttons: ticketButtons }),
      });
      if (res.ok) showToast("Configuración de tickets guardada", "success");
    } catch { showToast("Error al guardar", "error"); }
  };

  const publishTicketPanel = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(`/api/bot/proxy/guild/${selectedGuild.id}/tickets/panel`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ticketConfig, buttons: ticketButtons }),
      });
      if (res.ok) showToast("Panel de tickets publicado", "success");
    } catch { showToast("Error al publicar", "error"); }
  };

  const addTicketCategory = async (catName: string) => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(`/api/bot/proxy/guild/${selectedGuild.id}/tickets/category`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName }),
      });
      if (res.ok) showToast("Categoría añadida", "success");
    } catch { showToast("Error al añadir categoría", "error"); }
  };

  const removeTicketCategory = async (catId: string) => {
    if (!selectedGuild) return;
    try {
      const res = await fetch(`/api/bot/proxy/guild/${selectedGuild.id}/tickets/category/${catId}`, {
        method: "DELETE",
      });
      if (res.ok) showToast("Categoría eliminada", "success");
    } catch { showToast("Error al eliminar", "error"); }
  };

  const saveVerification = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch("/api/bot/proxy/verify/setup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verifyConfig),
      });
      if (res.ok) showToast("Verificación configurada", "success");
    } catch { showToast("Error al configurar", "error"); }
  };

  const removeVerification = async () => {
    if (!selectedGuild) return;
    try {
      const res = await fetch("/api/bot/proxy/verify/remove", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guildId: selectedGuild.id }),
      });
      if (res.ok) {
        setVerifyConfig({ enabled: false, channel: "", message: "", roleId: "" });
        showToast("Verificación eliminada", "success");
      }
    } catch { showToast("Error al eliminar", "error"); }
  };

  const executeModAction = async () => {
    if (!selectedGuild || !modAction.userId) return;
    try {
      const res = await fetch(`/api/bot/proxy/guild/${selectedGuild.id}/action`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modAction),
      });
      if (res.ok) {
        showToast(`Acción ${modAction.type} ejecutada`, "success");
        setModAction({ type: "ban", userId: "", reason: "", duration: "1h", deleteDays: 0 });
        const casesRes = await fetch(`/api/bot/proxy/cases/${selectedGuild.id}`);
        if (casesRes.ok) {
          const d = await casesRes.json();
          setCasesList(Array.isArray(d) ? d : d.cases || []);
        }
      }
    } catch { showToast("Error al ejecutar", "error"); }
  };

  const executePowerAction = async (action: "start" | "restart" | "stop") => {
    try {
      const res = await fetch("/api/bot/proxy/power", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setBotPowerStatus(action === "stop" ? "offline" : "online");
        showToast(`Bot ${action === "restart" ? "reiniciado" : action === "stop" ? "detenido" : "iniciado"}`, "success");
      }
    } catch { showToast("Error al ejecutar acción", "error"); }
  };

  const addGlobalBan = async () => {
    if (!globalBanForm.userId) return;
    try {
      const res = await fetch("/api/bot/proxy/globalbans", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(globalBanForm),
      });
      if (res.ok) {
        showToast("Ban global añadido", "success");
        setGlobalBanForm({ userId: "", reason: "" });
        const bansRes = await fetch("/api/bot/proxy/globalbans");
        if (bansRes.ok) {
          const d = await bansRes.json();
          setGlobalBans(Array.isArray(d) ? d : d.bans || []);
        }
      }
    } catch { showToast("Error al añadir ban", "error"); }
  };

  const removeGlobalBan = async (banId: string) => {
    try {
      const res = await fetch("/api/bot/proxy/globalbans", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: banId }),
      });
      if (res.ok) {
        setGlobalBans((prev) => prev.filter((b) => b.id !== banId));
        showToast("Ban eliminado", "success");
      }
    } catch { showToast("Error al eliminar", "error"); }
  };

  const sendBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    setBroadcastLoading(true);
    try {
      const res = await fetch("/api/bot/proxy/broadcast", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: broadcastMessage }),
      });
      if (res.ok) { showToast("Broadcast enviado", "success"); setBroadcastMessage(""); }
    } catch { showToast("Error al enviar", "error"); }
    setBroadcastLoading(false);
  };

  const addIpBan = async () => {
    if (!ipBanForm.ip) return;
    try {
      const res = await fetch("/api/bot/proxy/ipban", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ipBanForm),
      });
      if (res.ok) {
        showToast("IP baneada", "success");
        setIpBanForm({ ip: "", reason: "" });
        const bansRes = await fetch("/api/bot/proxy/ipban");
        if (bansRes.ok) {
          const d = await bansRes.json();
          setIpBans(Array.isArray(d) ? d : d.bans || []);
        }
      }
    } catch { showToast("Error al banear IP", "error"); }
  };

  const removeIpBan = async (banId: string) => {
    try {
      const res = await fetch("/api/bot/proxy/ipban", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: banId }),
      });
      if (res.ok) {
        setIpBans((prev) => prev.filter((b) => b.id !== banId));
        showToast("IP ban eliminado", "success");
      }
    } catch { showToast("Error al eliminar", "error"); }
  };

  const lookupUserIps = async () => {
    if (!ipLookupUserId) return;
    try {
      const res = await fetch(`/api/bot/proxy/ipregistry/${ipLookupUserId}`);
      if (res.ok) setIpLookupResults(await res.json());
    } catch { showToast("Error al buscar IPs", "error"); }
  };

  const lookupIpAccounts = async () => {
    if (!ipLookupIp) return;
    try {
      const res = await fetch(`/api/bot/proxy/ipregistry/ip/${ipLookupIp}`);
      if (res.ok) setIpLookupResults(await res.json());
    } catch { showToast("Error al buscar por IP", "error"); }
  };

  const addStaff = async () => {
    if (!staffForm.userId) return;
    try {
      const res = await fetch("/api/bot/proxy/staff/add", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staffForm),
      });
      if (res.ok) {
        showToast("Staff añadido", "success");
        setStaffForm({ userId: "", rank: "moderator", note: "" });
        const staffRes = await fetch("/api/bot/proxy/staff");
        if (staffRes.ok) {
          const d = await staffRes.json();
          setStaffList(Array.isArray(d) ? d : d.staff || []);
        }
      }
    } catch { showToast("Error al añadir staff", "error"); }
  };

  const removeStaff = async (userId: string) => {
    try {
      const res = await fetch(`/api/bot/proxy/staff/${userId}`, { method: "DELETE" });
      if (res.ok) {
        setStaffList((prev) => prev.filter((s) => s.userId !== userId && s.id !== userId));
        showToast("Staff eliminado", "success");
      }
    } catch { showToast("Error al eliminar", "error"); }
  };

  const loadStaffLogs = async () => {
    try {
      const res = await fetch("/api/bot/proxy/staff/logs");
      if (res.ok) {
        const d = await res.json();
        setStaffLogs(Array.isArray(d) ? d : d.logs || []);
      }
    } catch {}
  };

  const grantPremium = async () => {
    if (!premiumGrantForm.userId) return;
    try {
      const res = await fetch("/api/bot/proxy/premium/grant", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(premiumGrantForm),
      });
      if (res.ok) {
        showToast("Premium concedido", "success");
        setPremiumGrantForm({ userId: "", tier: "Sharingan" });
        const pRes = await fetch("/api/bot/proxy/premium/users");
        if (pRes.ok) {
          const d = await pRes.json();
          setPremiumUsers(Array.isArray(d) ? d : d.users || []);
        }
      }
    } catch { showToast("Error al conceder premium", "error"); }
  };

  const revokePremium = async (userId: string) => {
    try {
      const res = await fetch("/api/bot/proxy/premium/revoke", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setPremiumUsers((prev) => prev.map((p) => p.id === userId ? { ...p, active: false } : p));
        showToast("Premium revocado", "success");
      }
    } catch { showToast("Error al revocar", "error"); }
  };

  const forceExpirePremium = async () => {
    if (!premiumForceExpireId) return;
    try {
      const res = await fetch("/api/bot/proxy/premium/forceexpire", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: premiumForceExpireId }),
      });
      if (res.ok) {
        showToast("Premium expirado forzadamente", "success");
        setPremiumForceExpireId("");
      }
    } catch { showToast("Error al expirar", "error"); }
  };

  const giveAllPremium = async () => {
    const ids = premiumGiveAllIds.split(",").map((s) => s.trim()).filter(Boolean);
    if (ids.length === 0) return;
    try {
      const res = await fetch("/api/bot/proxy/premium/giveall", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: ids, plan: premiumGiveAllPlan, days: premiumGiveAllDays }),
      });
      if (res.ok) {
        showToast(`Premium concedido a ${ids.length} usuarios`, "success");
        setPremiumGiveAllIds("");
      }
    } catch { showToast("Error al dar premium", "error"); }
  };

  const generatePremiumCode = async () => {
    try {
      const res = await fetch("/api/bot/proxy/premium/codes/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: premiumCodeTier }),
      });
      if (res.ok) {
        showToast("Código generado", "success");
        const codesRes = await fetch("/api/bot/proxy/premium/codes");
        if (codesRes.ok) {
          const d = await codesRes.json();
          setPremiumCodes(Array.isArray(d) ? d : d.codes || []);
        }
      }
    } catch { showToast("Error al generar código", "error"); }
  };

  const redeemPremiumCode = async () => {
    if (!redeemCode.trim()) return;
    try {
      const res = await fetch("/api/bot/proxy/premium/redeem", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: redeemCode }),
      });
      if (res.ok) {
        showToast("Código canjeado", "success");
        setRedeemCode("");
        const profileRes = await fetch("/api/bot/proxy/profile/me");
        if (profileRes.ok) setUserProfile(await profileRes.json());
      }
    } catch { showToast("Error al canjear", "error"); }
  };

  const loadPremiumRequests = async () => {
    try {
      const res = await fetch("/api/bot/proxy/premium/requests");
      if (res.ok) {
        const d = await res.json();
        setPremiumRequests(Array.isArray(d) ? d : d.requests || []);
      }
    } catch {}
  };

  const approvePremiumRequest = async (reqId: string) => {
    try {
      const res = await fetch(`/api/bot/proxy/premium/request/${reqId}/approve`, { method: "POST" });
      if (res.ok) {
        showToast("Solicitud aprobada", "success");
        loadPremiumRequests();
      }
    } catch { showToast("Error al aprobar", "error"); }
  };

  const denyPremiumRequest = async (reqId: string) => {
    try {
      const res = await fetch(`/api/bot/proxy/premium/request/${reqId}/deny`, { method: "POST" });
      if (res.ok) {
        showToast("Solicitud denegada", "success");
        loadPremiumRequests();
      }
    } catch { showToast("Error al denegar", "error"); }
  };

  const loadPremiumHistory = async () => {
    try {
      const res = await fetch("/api/bot/proxy/premium/history");
      if (res.ok) {
        const d = await res.json();
        setPremiumHistory(Array.isArray(d) ? d : d.history || []);
      }
    } catch {}
  };

  const loadPremiumServers = async () => {
    try {
      const res = await fetch("/api/bot/proxy/premium/servers");
      if (res.ok) {
        const d = await res.json();
        setPremiumServers(Array.isArray(d) ? d : d.servers || []);
      }
    } catch {}
  };

  const loadPremiumPlans = async () => {
    try {
      const res = await fetch("/api/bot/proxy/premium/plans");
      if (res.ok) {
        const d = await res.json();
        setPremiumPlansConfig(Array.isArray(d) ? d : d.plans || []);
      }
    } catch {}
  };

  const savePremiumStoreUrl = async () => {
    try {
      const res = await fetch("/api/bot/proxy/premium/plans/storeurl", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeUrl: premiumStoreUrl }),
      });
      if (res.ok) showToast("URL de tienda guardada", "success");
    } catch { showToast("Error al guardar", "error"); }
  };

  const loadPremiumBlacklist = async () => {
    try {
      const res = await fetch("/api/bot/proxy/premium/blacklist");
      if (res.ok) {
        const d = await res.json();
        setPremiumBlacklist(Array.isArray(d) ? d : d.blacklist || []);
      }
    } catch {}
  };

  const addPremiumBlacklist = async () => {
    if (!premiumBlacklistForm) return;
    try {
      const res = await fetch("/api/bot/proxy/premium/blacklist/add", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: premiumBlacklistForm }),
      });
      if (res.ok) {
        showToast("Añadido a blacklist", "success");
        setPremiumBlacklistForm("");
        loadPremiumBlacklist();
      }
    } catch { showToast("Error al añadir", "error"); }
  };

  const removePremiumBlacklist = async (userId: string) => {
    try {
      const res = await fetch(`/api/bot/proxy/premium/blacklist/${userId}`, { method: "DELETE" });
      if (res.ok) {
        setPremiumBlacklist((prev) => prev.filter((b: any) => b.userId !== userId));
        showToast("Eliminado de blacklist", "success");
      }
    } catch { showToast("Error al eliminar", "error"); }
  };

  const loadPremiumCoupons = async () => {
    try {
      const res = await fetch("/api/bot/proxy/premium/coupons");
      if (res.ok) {
        const d = await res.json();
        setPremiumCoupons(Array.isArray(d) ? d : d.coupons || []);
      }
    } catch {}
  };

  const createPremiumCoupon = async () => {
    try {
      const res = await fetch("/api/bot/proxy/premium/coupons/create", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(premiumCouponForm),
      });
      if (res.ok) {
        showToast("Cupón creado", "success");
        setPremiumCouponForm({ code: "", discount: 10, maxUses: 100, expiresAt: "" });
        loadPremiumCoupons();
      }
    } catch { showToast("Error al crear cupón", "error"); }
  };

  const deletePremiumCoupon = async (code: string) => {
    try {
      const res = await fetch(`/api/bot/proxy/premium/coupons/${code}`, { method: "DELETE" });
      if (res.ok) {
        setPremiumCoupons((prev) => prev.filter((c) => c.code !== code));
        showToast("Cupón eliminado", "success");
      }
    } catch { showToast("Error al eliminar", "error"); }
  };

  const loadPremiumAdminData = useCallback(async (tab: string) => {
    if (tab === "requests") loadPremiumRequests();
    else if (tab === "history") loadPremiumHistory();
    else if (tab === "servers") loadPremiumServers();
    else if (tab === "plans") loadPremiumPlans();
    else if (tab === "blacklist") loadPremiumBlacklist();
    else if (tab === "coupons") loadPremiumCoupons();
  }, []);

  const fetchSecurityData = async () => {
    const gid = securityGuildId || selectedGuild?.id;
    if (!gid) return;
    try {
      const res = await fetch(`/api/bot/proxy/security/${gid}`);
      if (res.ok) setSecurityData(await res.json());
    } catch { showToast("Error al cargar seguridad", "error"); }
  };

  const sendJarvisMessage = async () => {
    if (!jarvisInput.trim() || jarvisLoading) return;
    const userMsg: JarvisMessage = { role: "user", content: jarvisInput.trim(), timestamp: new Date().toISOString() };
    setJarvisMessages((prev) => [...prev, userMsg]);
    setJarvisInput("");
    setJarvisLoading(true);
    try {
      const res = await fetch("/api/bot/proxy/jarvis/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, model: jarvisModel, mode: jarvisMode }),
      });
      if (res.ok) {
        const data = await res.json();
        setJarvisMessages((prev) => [...prev, {
          role: "assistant", content: data.response || data.message || "Sin respuesta", timestamp: new Date().toISOString(),
        }]);
      }
    } catch {
      setJarvisMessages((prev) => [...prev, {
        role: "assistant", content: "Error de conexión con JARVIS", timestamp: new Date().toISOString(),
      }]);
    }
    setJarvisLoading(false);
  };

  const jarvisQuickAction = async (action: string) => {
    try {
      const res = await fetch("/api/bot/proxy/jarvis/action", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const data = await res.json();
        setJarvisMessages((prev) => [...prev, {
          role: "assistant", content: data.response || data.message || "Acción ejecutada", timestamp: new Date().toISOString(),
        }]);
      }
    } catch {}
  };

  const clearJarvisChat = () => {
    setJarvisMessages([]);
  };

  const exportJarvisChat = () => {
    const content = jarvisMessages.map((m) => `[${m.role}] ${m.content}`).join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jarvis-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Conversación exportada", "success");
  };

  const loadBotLogs = async () => {
    try {
      const res = await fetch("/api/bot/proxy/logs");
      if (res.ok) {
        const d = await res.json();
        setBotLogs(Array.isArray(d) ? d : d.logs || []);
      }
    } catch {}
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
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="glass rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#5865F2]/20 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} className="text-[#5865F2]" />
          </div>
          <h2 className="text-2xl font-black mb-3">
            <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">
              Panel de Control
            </span>
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Inicia sesión con tu cuenta de Discord para acceder al panel y gestionar tus servidores.
          </p>
          <button onClick={() => (window.location.href = "/api/auth/discord")}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors font-bold text-white">
            <LogIn size={18} /> Iniciar sesión con Discord
          </button>
        </motion.div>
      </main>
    );
  }

  const user = sessionData.user;
  const isOwner = user.role === "OWNER" || user.role === "owner";
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (item.ownerOnly && !isOwner) return false;
    if (item.serverOnly && !selectedGuild) return false;
    return true;
  });

  return (
    <main className="min-h-screen pt-16 pb-12 flex bot-section">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-[60] px-4 py-3 rounded-xl text-sm font-semibold shadow-lg ${
              toast.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : toast.type === "error" ? "bg-red-500/20 text-red-400 border border-red-500/30"
              : "bg-[#5865F2]/20 text-[#5865F2] border border-[#5865F2]/30"
            }`}>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setSidebarOpen(true)}
        className="fixed top-20 left-4 z-50 lg:hidden p-2 rounded-xl bg-white/10 backdrop-blur text-white">
        <Menu size={20} />
      </button>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-[#0A0A0A]/95 backdrop-blur-xl border-r border-white/5 z-50 overflow-y-auto transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {user.image && (
                <Image src={user.image} alt="avatar" width={36} height={36} className="rounded-full border-2 border-[#5865F2]/30" />
              )}
              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate">{user.name || user.username}</div>
                <div className="text-xs text-gray-500 truncate">{user.email || ""}</div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-white/10 text-gray-500">
              <X size={18} />
            </button>
          </div>

          {selectedGuild && (
            <div className="mb-6 p-3 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/20">
              <div className="flex items-center gap-3">
                {selectedGuild.icon ? (
                  <Image src={selectedGuild.icon} alt="" width={32} height={32} className="rounded-lg" unoptimized />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-[#5865F2]/30 flex items-center justify-center">
                    <span className="text-[#5865F2] text-xs font-bold">{selectedGuild.name[0]}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{selectedGuild.name}</div>
                  <div className="text-xs text-gray-500">{selectedGuild.members.toLocaleString()} miembros</div>
                </div>
              </div>
              <button onClick={goBackFromGuild}
                className="mt-2 w-full flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-white py-1 rounded-lg hover:bg-white/5 transition-colors">
                <ChevronLeft size={12} /> Cambiar servidor
              </button>
            </div>
          )}

          <div className="mb-3">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 px-2">General</div>
            {NAV_ITEMS.filter((n) => n.category === "general").map((item) => (
              <button key={item.id} onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSection === item.id ? "bg-[#5865F2]/20 text-[#5865F2]" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}>
                <item.icon size={16} /> {item.label}
              </button>
            ))}
          </div>

          {selectedGuild && (
            <div className="mb-3">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 px-2">Servidor</div>
              {NAV_ITEMS.filter((n) => n.category === "server").map((item) => (
                <button key={item.id} onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeSection === item.id ? "bg-[#5865F2]/20 text-[#5865F2]" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>
                  <item.icon size={16} /> {item.label}
                </button>
              ))}
            </div>
          )}

          {isOwner && (
            <div className="mb-3">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 px-2">Owner</div>
              {NAV_ITEMS.filter((n) => n.category === "owner").map((item) => (
                <button key={item.id} onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeSection === item.id ? "bg-[#7C3AED]/20 text-[#7C3AED]" : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>
                  <item.icon size={16} /> {item.label}
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-white/5 space-y-1">
            <a href={BOT_INVITE} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-[#5865F2] hover:bg-white/5 transition-colors">
              <ExternalLink size={16} /> Invitar Bot
            </a>
            <a href={SUPPORT_SERVER} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-[#57F287] hover:bg-white/5 transition-colors">
              <Globe size={16} /> Soporte
            </a>
            <button onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors">
              <Power size={16} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 p-6 lg:p-8">
        <AnimatePresence mode="wait">

          {/* ==================== OVERVIEW ==================== */}
          {activeSection === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">Resumen</span>
              </h1>

              {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { icon: <Server size={20} />, label: "Servidores", value: stats.guilds, color: "#5865F2", bg: "bg-[#5865F2]/10" },
                    { icon: <Users size={20} />, label: "Usuarios", value: stats.users.toLocaleString(), color: "#7C3AED", bg: "bg-[#7C3AED]/10" },
                    { icon: <Zap size={20} />, label: "Ping", value: `${stats.ping}ms`, color: stats.ping < 100 ? "#57F287" : "#ED4245", bg: stats.ping < 100 ? "bg-[#57F287]/10" : "bg-[#ED4245]/10" },
                    { icon: <Clock size={20} />, label: "Uptime", value: formatUptime(stats.uptime), color: "#57F287", bg: "bg-[#57F287]/10" },
                  ].map((item) => (
                    <div key={item.label} className="glass rounded-xl p-5 hover:-translate-y-0.5 transition-all">
                      <div className={`inline-flex p-2.5 rounded-xl ${item.bg} mb-3`} style={{ color: item.color }}>{item.icon}</div>
                      <div className="text-2xl font-black text-white">{item.value}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {stats && (
                <div className="glass rounded-2xl p-6 mb-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="relative flex-shrink-0">
                      {stats.avatar && <Image src={stats.avatar} alt="bot" width={64} height={64} className="rounded-full border-2 border-[#5865F2]/30" />}
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
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Activity size={18} className="text-[#5865F2]" /> Estado del Bot</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/5">
                        <div className="text-xs text-gray-500 mb-1">Ping</div>
                        <div className="text-xl font-bold text-white">{stats ? `${stats.ping}ms` : "—"}</div>
                        <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                          <div className={`h-1.5 rounded-full ${(stats?.ping || 0) < 100 ? "bg-green-400" : (stats?.ping || 0) < 200 ? "bg-yellow-400" : "bg-red-400"}`}
                            style={{ width: `${Math.min(100, (stats?.ping || 0) / 3)}%` }} />
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5">
                        <div className="text-xs text-gray-500 mb-1">Memoria</div>
                        <div className="text-xl font-bold text-white">{stats ? formatMemory(stats.memory) : "—"}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5">
                        <div className="text-xs text-gray-500 mb-1">Uptime</div>
                        <div className="text-xl font-bold text-white">{stats ? formatUptime(stats.uptime) : "—"}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5">
                        <div className="text-xs text-gray-500 mb-1">Estado</div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${stats?.online ? "bg-green-400" : "bg-gray-500"}`} />
                          <span className="text-xl font-bold text-white">{stats?.online ? "Online" : "Offline"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Layout size={18} className="text-[#57F287]" /> Módulos Activos</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {MODULES.map((mod) => {
                        const isEnabled = guildModules[mod.id]?.enabled ?? false;
                        return (
                          <div key={mod.id} className={`flex items-center gap-2 p-3 rounded-xl ${isEnabled ? "bg-white/5" : "bg-white/[0.02] opacity-40"}`}>
                            <mod.icon size={14} style={{ color: mod.color }} />
                            <span className="text-xs text-white font-medium">{mod.label}</span>
                            <div className={`ml-auto w-2 h-2 rounded-full ${isEnabled ? "bg-green-400" : "bg-gray-600"}`} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Star size={18} className="text-[#FEE75C]" /> Acciones Rápidas</h3>
                    <div className="space-y-2">
                      <a href={BOT_INVITE} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 transition-colors text-[#5865F2]">
                        <ExternalLink size={16} /> <span className="text-sm font-semibold">Invitar Bot</span>
                      </a>
                      <a href={SUPPORT_SERVER} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#57F287]/10 hover:bg-[#57F287]/20 transition-colors text-[#57F287]">
                        <Globe size={16} /> <span className="text-sm font-semibold">Servidor de Soporte</span>
                      </a>
                      <Link href="/bot/commands"
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#FEE75C]/10 hover:bg-[#FEE75C]/20 transition-colors text-[#FEE75C]">
                        <Command size={16} /> <span className="text-sm font-semibold">Ver Comandos</span>
                      </Link>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Crown size={18} className="text-[#FEE75C]" /> Top Servidores</h3>
                    <div className="space-y-2">
                      {guilds.filter((g) => g.members > 0).sort((a, b) => b.members - a.members).slice(0, 5).map((guild, i) => (
                        <div key={guild.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                          onClick={() => { setActiveSection("servers"); selectGuild(guild); }}>
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
              </div>
            </motion.div>
          )}

          {/* ==================== SERVERS ==================== */}
          {activeSection === "servers" && (
            <motion.div key="servers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">Servidores</span>
              </h1>

              <div className="relative mb-6">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" placeholder="Buscar servidores..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
              </div>

              {guilds.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {guilds.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.id.includes(searchQuery))
                    .map((guild, i) => (
                      <motion.div key={guild.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="glass rounded-xl p-5 hover:-translate-y-0.5 transition-all cursor-pointer"
                        onClick={() => selectGuild(guild)}>
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
                          <ChevronRight size={16} className="text-gray-600 flex-shrink-0" />
                        </div>
                      </motion.div>
                    ))}
                </div>
              ) : (
                <div className="glass rounded-2xl p-12 text-center">
                  <Server size={48} className="text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No tienes servidores donde gestionar el bot.</p>
                  <a href={BOT_INVITE} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5865F2] text-white text-sm font-semibold mt-4">
                    <ExternalLink size={14} /> Invitar Bot a tu servidor
                  </a>
                </div>
              )}
            </motion.div>
          )}

          {/* ==================== PROFILE ==================== */}
          {activeSection === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">Mi Perfil</span>
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass rounded-2xl p-6">
                  <div className="flex flex-col items-center text-center">
                    {user.image && <Image src={user.image} alt="avatar" width={96} height={96} className="rounded-full border-3 border-[#5865F2]/30 mb-4" />}
                    <h2 className="text-xl font-bold text-white">{user.name || user.username}</h2>
                    <p className="text-sm text-gray-500 mt-1">{user.email || ""}</p>
                    <div className="mt-3 px-3 py-1 rounded-full bg-[#5865F2]/20 text-[#5865F2] text-xs font-semibold">
                      {user.role || "USER"}
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                      <Hash size={14} className="text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">ID de Discord</div>
                        <div className="text-sm text-white font-mono">{user.id}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Crown size={18} className="text-[#FEE75C]" /> Estado Premium</h3>
                    {userProfile?.premium?.active ? (
                      <div className="p-4 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center">
                            <Crown size={20} className="text-[#7C3AED]" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">Premium Activo</div>
                            <div className="text-xs text-gray-400">
                              Plan: {userProfile.premium.plan || "N/A"} · Expira: {userProfile.premium.expiresAt ? formatDate(userProfile.premium.expiresAt) : "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                            <Crown size={20} className="text-gray-500" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">Sin Premium</div>
                            <div className="text-xs text-gray-400">Obtén acceso a funciones exclusivas</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Key size={18} className="text-[#57F287]" /> Canjear Código Premium</h3>
                    <div className="flex gap-3">
                      <input type="text" placeholder="Código de premium..." value={redeemCode} onChange={(e) => setRedeemCode(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                      <button onClick={redeemPremiumCode} disabled={!redeemCode.trim()}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#57F287] hover:bg-[#45b865] transition-colors text-sm font-semibold text-white disabled:opacity-50">
                        <Gift size={14} /> Canjear
                      </button>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><CreditCard size={18} className="text-[#EB459E]" /> Planes Premium</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {PREMIUM_PLANS.map((plan) => (
                        <div key={plan.name} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                          <div className="text-lg font-bold mb-1" style={{ color: plan.color }}>{plan.name}</div>
                          <div className="text-2xl font-black text-white mb-3">{plan.price}</div>
                          <div className="space-y-2">
                            {plan.features.map((f, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                                <CheckCircle size={12} className="text-green-400 flex-shrink-0" /> {f}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== MODULES ==================== */}
          {activeSection === "modules" && selectedGuild && (
            <motion.div key="modules" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">Control de Módulos</span>
              </h1>
              {["Seguridad", "Comunidad", "Entretenimiento", "Utilidad", "Premium"].map((cat) => {
                const catModules = MODULES.filter((m) => m.category === cat);
                if (catModules.length === 0) return null;
                return (
                  <div key={cat} className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{cat}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {catModules.map((mod) => {
                        const isEnabled = guildModules[mod.id]?.enabled ?? false;
                        return (
                          <div key={mod.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg" style={{ backgroundColor: `${mod.color}15`, color: mod.color }}>
                                <mod.icon size={16} />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-white">{mod.label}</div>
                                <div className="text-xs text-gray-500">{mod.id}</div>
                              </div>
                            </div>
                            <Toggle enabled={isEnabled} onToggle={() => toggleModule(mod.id)} disabled={moduleLoading} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* ==================== WELCOME / GOODBYE ==================== */}
          {activeSection === "welcome" && selectedGuild && (
            <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">Bienvenida / Despedida</span>
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Smile size={18} className="text-[#57F287]" /> Bienvenida</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <div>
                        <div className="text-sm font-semibold text-white">Activar Bienvenida</div>
                        <div className="text-xs text-gray-500">Enviar mensaje al nuevo miembro</div>
                      </div>
                      <Toggle enabled={welcomeConfig.enabled} onToggle={() => setWelcomeConfig((p) => ({ ...p, enabled: !p.enabled }))} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Canal</label>
                      <select value={welcomeConfig.channel} onChange={(e) => setWelcomeConfig((p) => ({ ...p, channel: e.target.value }))}
                        className={CHANNEL_SELECT_CLASSES}>
                        <option value="">Seleccionar canal...</option>
                        {guildConfig.channels?.filter((c) => c.type === 0).map((ch) => (
                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Título</label>
                      <input type="text" value={welcomeConfig.title} onChange={(e) => setWelcomeConfig((p) => ({ ...p, title: e.target.value }))}
                        placeholder="¡Bienvenido!" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Mensaje</label>
                      <textarea value={welcomeConfig.message} onChange={(e) => setWelcomeConfig((p) => ({ ...p, message: e.target.value }))}
                        placeholder="¡Hola {user}! Bienvenido a {server}. Ahora somos {membercount} miembros." rows={3}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 resize-none" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Color (hex)</label>
                      <input type="color" value={welcomeConfig.color} onChange={(e) => setWelcomeConfig((p) => ({ ...p, color: e.target.value }))}
                        className="w-12 h-10 rounded-lg bg-transparent cursor-pointer" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Imagen URL</label>
                      <input type="url" value={welcomeConfig.image} onChange={(e) => setWelcomeConfig((p) => ({ ...p, image: e.target.value }))}
                        placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                    </div>
                    <div className="text-xs text-gray-600">Variables: {"{user}"} {"{server}"} {"{membercount}"} {"{usertag}"}</div>
                    <button onClick={saveWelcome} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white">
                      <Save size={14} /> Guardar
                    </button>
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-[#5865F2]/5 border border-[#5865F2]/20">
                    <div className="text-xs text-gray-500 mb-2 font-semibold">Vista Previa del Embed</div>
                    <div className="rounded-xl overflow-hidden border border-white/10">
                      <div className="h-2" style={{ backgroundColor: welcomeConfig.color }} />
                      <div className="p-4 bg-[#2F3136]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-[#5865F2]/30" />
                          <div>
                            <div className="text-sm font-semibold text-[#5865F2]">{selectedGuild?.name || "Server"}</div>
                            <div className="text-xs text-gray-500">Hoy a las 00:00</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-white mb-1">{welcomeConfig.title || "¡Bienvenido!"}</div>
                        <div className="text-sm text-gray-300">{welcomeConfig.message || "Mensaje de bienvenida..."}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><MessageCircle size={18} className="text-[#ED4245]" /> Despedida</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <div>
                        <div className="text-sm font-semibold text-white">Activar Despedida</div>
                        <div className="text-xs text-gray-500">Enviar mensaje al abandonar</div>
                      </div>
                      <Toggle enabled={goodbyeConfig.enabled} onToggle={() => setGoodbyeConfig((p) => ({ ...p, enabled: !p.enabled }))} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Canal</label>
                      <select value={goodbyeConfig.channel} onChange={(e) => setGoodbyeConfig((p) => ({ ...p, channel: e.target.value }))}
                        className={CHANNEL_SELECT_CLASSES}>
                        <option value="">Seleccionar canal...</option>
                        {guildConfig.channels?.filter((c) => c.type === 0).map((ch) => (
                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Título</label>
                      <input type="text" value={goodbyeConfig.title} onChange={(e) => setGoodbyeConfig((p) => ({ ...p, title: e.target.value }))}
                        placeholder="¡Adiós!" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Mensaje</label>
                      <textarea value={goodbyeConfig.message} onChange={(e) => setGoodbyeConfig((p) => ({ ...p, message: e.target.value }))}
                        placeholder="¡{user} ha abandonado {server}! Ahora somos {membercount}." rows={3}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 resize-none" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Color (hex)</label>
                      <input type="color" value={goodbyeConfig.color} onChange={(e) => setGoodbyeConfig((p) => ({ ...p, color: e.target.value }))}
                        className="w-12 h-10 rounded-lg bg-transparent cursor-pointer" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Imagen URL</label>
                      <input type="url" value={goodbyeConfig.image} onChange={(e) => setGoodbyeConfig((p) => ({ ...p, image: e.target.value }))}
                        placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                    </div>
                    <button onClick={saveGoodbye} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white">
                      <Save size={14} /> Guardar
                    </button>
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-[#ED4245]/5 border border-[#ED4245]/20">
                    <div className="text-xs text-gray-500 mb-2 font-semibold">Vista Previa del Embed</div>
                    <div className="rounded-xl overflow-hidden border border-white/10">
                      <div className="h-2" style={{ backgroundColor: goodbyeConfig.color }} />
                      <div className="p-4 bg-[#2F3136]">
                        <div className="text-sm font-bold text-white mb-1">{goodbyeConfig.title || "¡Adiós!"}</div>
                        <div className="text-sm text-gray-300">{goodbyeConfig.message || "Mensaje de despedida..."}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== TICKETS ==================== */}
          {activeSection === "tickets" && selectedGuild && (
            <motion.div key="tickets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">Tickets</span>
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Palette size={18} className="text-[#5865F2]" /> Panel Builder</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Canal del Panel</label>
                        <select value={ticketConfig.channel} onChange={(e) => setTicketConfig((p) => ({ ...p, channel: e.target.value }))}
                          className={CHANNEL_SELECT_CLASSES}>
                          <option value="">Seleccionar canal...</option>
                          {guildConfig.channels?.filter((c) => c.type === 0).map((ch) => (
                            <option key={ch.id} value={ch.id}>#{ch.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Título</label>
                        <input type="text" value={ticketConfig.title} onChange={(e) => setTicketConfig((p) => ({ ...p, title: e.target.value }))}
                          placeholder="Soporte" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Descripción</label>
                        <textarea value={ticketConfig.description} onChange={(e) => setTicketConfig((p) => ({ ...p, description: e.target.value }))}
                          placeholder="Haz clic en el botón para crear un ticket" rows={2}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 resize-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Color</label>
                          <input type="color" value={ticketConfig.color} onChange={(e) => setTicketConfig((p) => ({ ...p, color: e.target.value }))}
                            className="w-12 h-10 rounded-lg bg-transparent cursor-pointer" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Imagen URL</label>
                          <input type="url" value={ticketConfig.image} onChange={(e) => setTicketConfig((p) => ({ ...p, image: e.target.value }))}
                            placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Settings size={18} className="text-[#FEE75C]" /> Configuración Base</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Rol de Soporte</label>
                        <select value={ticketConfig.supportRole} onChange={(e) => setTicketConfig((p) => ({ ...p, supportRole: e.target.value }))}
                          className={CHANNEL_SELECT_CLASSES}>
                          <option value="">Seleccionar rol...</option>
                          {guildConfig.roles?.map((r) => (
                            <option key={r.id} value={r.id}>@{r.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Canal de Logs</label>
                        <select value={ticketConfig.logChannel} onChange={(e) => setTicketConfig((p) => ({ ...p, logChannel: e.target.value }))}
                          className={CHANNEL_SELECT_CLASSES}>
                          <option value="">Seleccionar canal...</option>
                          {guildConfig.channels?.filter((c) => c.type === 0).map((ch) => (
                            <option key={ch.id} value={ch.id}>#{ch.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Categoría</label>
                        <select value={ticketConfig.category} onChange={(e) => setTicketConfig((p) => ({ ...p, category: e.target.value }))}
                          className={CHANNEL_SELECT_CLASSES}>
                          <option value="">Seleccionar categoría...</option>
                          {guildConfig.categories?.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Prefijo</label>
                        <input type="text" value={ticketConfig.prefix} onChange={(e) => setTicketConfig((p) => ({ ...p, prefix: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Máx. Tickets por usuario</label>
                        <input type="number" value={ticketConfig.maxTickets} onChange={(e) => setTicketConfig((p) => ({ ...p, maxTickets: parseInt(e.target.value) || 5 }))}
                          min={1} max={10} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div className="text-sm font-semibold text-white">Ping al crear</div>
                        <Toggle enabled={ticketConfig.pingOnCreate} onToggle={() => setTicketConfig((p) => ({ ...p, pingOnCreate: !p.pingOnCreate }))} />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div className="text-sm font-semibold text-white">Transcript por DM</div>
                        <Toggle enabled={ticketConfig.dmTranscript} onToggle={() => setTicketConfig((p) => ({ ...p, dmTranscript: !p.dmTranscript }))} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Hash size={18} className="text-[#EB459E]" /> Button Builder ({ticketButtons.length}/5)</h3>
                    <div className="space-y-4">
                      {ticketButtons.map((btn, idx) => (
                        <div key={btn.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-white">Botón {idx + 1}</span>
                            <button onClick={() => setTicketButtons((prev) => prev.filter((_, i) => i !== idx))}
                              className="p-1 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Emoji</label>
                              <input type="text" value={btn.emoji} onChange={(e) => {
                                const newBtns = [...ticketButtons];
                                newBtns[idx] = { ...newBtns[idx], emoji: e.target.value };
                                setTicketButtons(newBtns);
                              }} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5865F2]/50" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Label</label>
                              <input type="text" value={btn.label} onChange={(e) => {
                                const newBtns = [...ticketButtons];
                                newBtns[idx] = { ...newBtns[idx], label: e.target.value };
                                setTicketButtons(newBtns);
                              }} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5865F2]/50" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">ID Único</label>
                              <input type="text" value={btn.buttonId} onChange={(e) => {
                                const newBtns = [...ticketButtons];
                                newBtns[idx] = { ...newBtns[idx], buttonId: e.target.value };
                                setTicketButtons(newBtns);
                              }} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5865F2]/50 font-mono" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Color</label>
                              <select value={btn.color} onChange={(e) => {
                                const newBtns = [...ticketButtons];
                                newBtns[idx] = { ...newBtns[idx], color: e.target.value };
                                setTicketButtons(newBtns);
                              }} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5865F2]/50 appearance-none">
                                {TICKET_BUTTON_COLORS.map((c) => (
                                  <option key={c.value} value={c.value}>{c.label} ({c.hex})</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="mt-3">
                            <label className="text-xs text-gray-500 mb-1 block">Descripción</label>
                            <input type="text" value={btn.description} onChange={(e) => {
                              const newBtns = [...ticketButtons];
                              newBtns[idx] = { ...newBtns[idx], description: e.target.value };
                              setTicketButtons(newBtns);
                            }} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5865F2]/50" />
                          </div>
                          <div className="mt-3">
                            <label className="text-xs text-gray-500 mb-1 block">Mensaje de Bienvenida</label>
                            <textarea value={btn.welcomeMessage} onChange={(e) => {
                              const newBtns = [...ticketButtons];
                              newBtns[idx] = { ...newBtns[idx], welcomeMessage: e.target.value };
                              setTicketButtons(newBtns);
                            }} rows={2} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5865F2]/50 resize-none" />
                          </div>
                        </div>
                      ))}
                      {ticketButtons.length < 5 && (
                        <button onClick={() => setTicketButtons((prev) => [...prev, {
                          id: String(Date.now()), emoji: "🎫", label: "Nuevo Ticket", buttonId: `btn_${Date.now()}`,
                          color: "Primary", description: "", welcomeMessage: "",
                        }])}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/10 hover:border-[#5865F2]/30 transition-colors text-sm text-gray-400 hover:text-white">
                          <Plus size={14} /> Añadir Botón
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Ticket size={18} className="text-[#57F287]" /> Tickets Abiertos ({openTickets.length})</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {openTickets.length > 0 ? openTickets.map((t: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                          <Ticket size={14} className="text-[#FEE75C] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white truncate">{t.channelName || `Ticket ${i + 1}`}</div>
                            <div className="text-xs text-gray-500">{t.userId || "N/A"} · {t.status || "open"}</div>
                          </div>
                        </div>
                      )) : <p className="text-sm text-gray-500 text-center py-4">No hay tickets abiertos</p>}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={saveTicketsSetup}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white">
                      <Save size={14} /> Guardar Config
                    </button>
                    <button onClick={publishTicketPanel}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#57F287] hover:bg-[#45b865] transition-colors text-sm font-semibold text-white">
                      <Send size={14} /> Publicar Panel
                    </button>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Palette size={18} className="text-[#5865F2]" /> Vista Previa</h3>
                    <div className="rounded-xl overflow-hidden border border-white/10">
                      <div className="h-2" style={{ backgroundColor: ticketConfig.color }} />
                      <div className="p-4 bg-[#2F3136]">
                        <div className="text-sm font-bold text-white mb-1">{ticketConfig.title || "Soporte"}</div>
                        <div className="text-xs text-gray-300 mb-3">{ticketConfig.description || "Haz clic en el botón para crear un ticket"}</div>
                        {ticketButtons.map((btn) => (
                          <div key={btn.id} className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-white/5">
                            <span>{btn.emoji}</span>
                            <span className="text-xs text-white font-semibold">{btn.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== AUTOROLE ==================== */}
          {activeSection === "autorole" && selectedGuild && (
            <motion.div key="autorole" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">Roles (Autorole)</span>
              </h1>
              <div className="glass rounded-2xl p-6 max-w-2xl">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><UserCog size={18} className="text-[#FEE75C]" /> Autorole</h3>
                <p className="text-sm text-gray-400 mb-4">Asigna automáticamente un rol a los nuevos miembros que se unan al servidor.</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div>
                      <div className="text-sm font-semibold text-white">Activar Autorole</div>
                      <div className="text-xs text-gray-500">Auto-asignar rol a nuevos miembros</div>
                    </div>
                    <Toggle enabled={autoroleConfig.enabled} onToggle={() => setAutoroleConfig((p) => ({ ...p, enabled: !p.enabled }))} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Rol a asignar</label>
                    <select value={autoroleConfig.roleId} onChange={(e) => setAutoroleConfig((p) => ({ ...p, roleId: e.target.value }))}
                      className={CHANNEL_SELECT_CLASSES}>
                      <option value="">Seleccionar rol...</option>
                      {guildConfig.roles?.map((r) => (
                        <option key={r.id} value={r.id}>@{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={saveAutorole}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white">
                    <Save size={14} /> Guardar
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== LOGS ==================== */}
          {activeSection === "logs" && selectedGuild && (
            <motion.div key="logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">Logs</span>
              </h1>
              <div className="glass rounded-2xl p-6 max-w-2xl">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><ScrollText size={18} className="text-[#5865F2]" /> Configuración de Logs</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div className="text-sm font-semibold text-white">Activar Logs</div>
                    <Toggle enabled={logsConfig.enabled} onToggle={() => setLogsConfig((p) => ({ ...p, enabled: !p.enabled }))} />
                  </div>
                  {[
                    { key: "moderation", label: "Moderación", icon: ShieldAlert },
                    { key: "messages", label: "Mensajes", icon: MessageCircle },
                    { key: "members", label: "Miembros", icon: Users },
                    { key: "channels", label: "Canales", icon: Hash },
                    { key: "roles", label: "Roles", icon: UserCog },
                    { key: "voice", label: "Voz", icon: Volume2 },
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key}>
                      <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2"><Icon size={14} /> {label}</label>
                      <select value={(logsConfig as any)[key]} onChange={(e) => setLogsConfig((p) => ({ ...p, [key]: e.target.value }))}
                        className={CHANNEL_SELECT_CLASSES}>
                        <option value="">Seleccionar canal...</option>
                        {guildConfig.channels?.filter((c) => c.type === 0).map((ch) => (
                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <button onClick={saveLogs}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white">
                    <Save size={14} /> Guardar
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== PROTECTION ==================== */}
          {activeSection === "protection" && selectedGuild && (
            <motion.div key="protection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">Protección</span>
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><ShieldAlert size={18} className="text-[#ED4245]" /> Anti-Raid</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div className="text-sm font-semibold text-white">Activar Anti-Raid</div>
                        <Toggle enabled={protectionConfig.antiRaid.enabled}
                          onToggle={() => setProtectionConfig((p) => ({ ...p, antiRaid: { ...p.antiRaid, enabled: !p.antiRaid.enabled } }))} />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Umbral (miembros/10s)</label>
                        <input type="number" value={protectionConfig.antiRaid.threshold}
                          onChange={(e) => setProtectionConfig((p) => ({ ...p, antiRaid: { ...p.antiRaid, threshold: parseInt(e.target.value) || 5 } }))}
                          min={1} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Acción</label>
                        <select value={protectionConfig.antiRaid.action}
                          onChange={(e) => setProtectionConfig((p) => ({ ...p, antiRaid: { ...p.antiRaid, action: e.target.value as any } }))}
                          className={CHANNEL_SELECT_CLASSES}>
                          <option value="timeout">Timeout</option>
                          <option value="kick">Kick</option>
                          <option value="ban">Ban</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><MessageSquare size={18} className="text-[#FEE75C]" /> Anti-Spam</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div className="text-sm font-semibold text-white">Activar Anti-Spam</div>
                        <Toggle enabled={protectionConfig.antiSpam.enabled}
                          onToggle={() => setProtectionConfig((p) => ({ ...p, antiSpam: { ...p.antiSpam, enabled: !p.antiSpam.enabled } }))} />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Máx. mensajes / 5 seg</label>
                        <input type="number" value={protectionConfig.antiSpam.maxMessages}
                          onChange={(e) => setProtectionConfig((p) => ({ ...p, antiSpam: { ...p.antiSpam, maxMessages: parseInt(e.target.value) || 5 } }))}
                          min={1} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Bug size={18} className="text-[#57F287]" /> Anti-Phishing</h3>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <div className="text-sm font-semibold text-white">Activar Anti-Phishing</div>
                      <Toggle enabled={protectionConfig.antiPhishing.enabled}
                        onToggle={() => setProtectionConfig((p) => ({ ...p, antiPhishing: { ...p.antiPhishing, enabled: !p.antiPhishing.enabled } }))} />
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Bot size={18} className="text-[#EB459E]" /> Anti-Alt</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div className="text-sm font-semibold text-white">Activar Anti-Alt</div>
                        <Toggle enabled={protectionConfig.antiAlt.enabled}
                          onToggle={() => setProtectionConfig((p) => ({ ...p, antiAlt: { ...p.antiAlt, enabled: !p.antiAlt.enabled } }))} />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Edad mínima de cuenta (días)</label>
                        <input type="number" value={protectionConfig.antiAlt.minAgeDays}
                          onChange={(e) => setProtectionConfig((p) => ({ ...p, antiAlt: { ...p.antiAlt, minAgeDays: parseInt(e.target.value) || 7 } }))}
                          min={1} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Flame size={18} className="text-[#ED4245]" /> Anti-Nuke</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div className="text-sm font-semibold text-white">Activar Anti-Nuke</div>
                        <Toggle enabled={protectionConfig.antiNuke.enabled}
                          onToggle={() => setProtectionConfig((p) => ({ ...p, antiNuke: { ...p.antiNuke, enabled: !p.antiNuke.enabled } }))} />
                      </div>
                      {(["channels", "roles", "emojis", "bans", "kicks", "webhooks"] as const).map((sub) => (
                        <div key={sub} className="p-3 rounded-xl bg-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-white capitalize">{sub}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Umbral</label>
                              <input type="number" value={(protectionConfig.antiNuke as any)[sub].threshold}
                                onChange={(e) => setProtectionConfig((p) => ({
                                  ...p, antiNuke: { ...p.antiNuke, [sub]: { ...(p.antiNuke as any)[sub], threshold: parseInt(e.target.value) || 3 } },
                                }))}
                                min={1} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5865F2]/50" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 mb-1 block">Acción</label>
                              <select value={(protectionConfig.antiNuke as any)[sub].action}
                                onChange={(e) => setProtectionConfig((p) => ({
                                  ...p, antiNuke: { ...p.antiNuke, [sub]: { ...(p.antiNuke as any)[sub], action: e.target.value } },
                                }))}
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5865F2]/50 appearance-none">
                                {(sub === "channels" || sub === "roles") ? (
                                  <>
                                    <option value="remove_roles">Quitar roles</option>
                                    <option value="kick">Kick</option>
                                    <option value="ban">Ban</option>
                                    <option value="lockdown">Lockdown</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="remove_roles">Quitar roles</option>
                                    <option value="kick">Kick</option>
                                    <option value="ban">Ban</option>
                                  </>
                                )}
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Filter size={18} className="text-[#7C3AED]" /> AutoMod</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div className="text-sm font-semibold text-white">Activar AutoMod</div>
                        <Toggle enabled={protectionConfig.autoMod.enabled}
                          onToggle={() => setProtectionConfig((p) => ({ ...p, autoMod: { ...p.autoMod, enabled: !p.autoMod.enabled } }))} />
                      </div>
                      {[
                        { key: "links", label: "Links", icon: Link2 },
                        { key: "zalgo", label: "Zalgo", icon: AlertTriangle },
                        { key: "duplicates", label: "Duplicados", icon: Repeat },
                        { key: "caps", label: "Mayúsculas", icon: Type },
                        { key: "massMentions", label: "Mass Mentions", icon: AtSign },
                        { key: "invites", label: "Invites", icon: Globe },
                      ].map(({ key, label, icon: Icon }) => (
                        <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                          <div className="flex items-center gap-2">
                            <Icon size={14} className="text-gray-400" />
                            <span className="text-sm text-white">{label}</span>
                          </div>
                          <Toggle enabled={(protectionConfig.autoMod as any)[key]}
                            onToggle={() => setProtectionConfig((p) => ({
                              ...p, autoMod: { ...p.autoMod, [key]: !(p.autoMod as any)[key] },
                            }))} />
                        </div>
                      ))}
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Canal de Log AutoMod</label>
                        <select value={protectionConfig.autoMod.logChannel}
                          onChange={(e) => setProtectionConfig((p) => ({ ...p, autoMod: { ...p.autoMod, logChannel: e.target.value } }))}
                          className={CHANNEL_SELECT_CLASSES}>
                          <option value="">Seleccionar canal...</option>
                          {guildConfig.channels?.filter((c) => c.type === 0).map((ch) => (
                            <option key={ch.id} value={ch.id}>#{ch.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Filter size={18} className="text-[#FEE75C]" /> Filtro de Palabras</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div className="text-sm font-semibold text-white">Activar Filtro</div>
                        <Toggle enabled={protectionConfig.wordFilter.enabled}
                          onToggle={() => setProtectionConfig((p) => ({ ...p, wordFilter: { ...p.wordFilter, enabled: !p.wordFilter.enabled } }))} />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Palabras (una por línea)</label>
                        <textarea value={protectionConfig.wordFilter.words}
                          onChange={(e) => setProtectionConfig((p) => ({ ...p, wordFilter: { ...p.wordFilter, words: e.target.value } }))}
                          placeholder={"palabra1\npalabra2\npalabra3"} rows={4}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 resize-none font-mono" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Mensaje de Advertencia</label>
                        <input type="text" value={protectionConfig.wordFilter.warningMessage}
                          onChange={(e) => setProtectionConfig((p) => ({ ...p, wordFilter: { ...p.wordFilter, warningMessage: e.target.value } }))}
                          placeholder="Ese contenido no está permitido." className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Acción</label>
                        <select value={protectionConfig.wordFilter.action}
                          onChange={(e) => setProtectionConfig((p) => ({ ...p, wordFilter: { ...p.wordFilter, action: e.target.value as any } }))}
                          className={CHANNEL_SELECT_CLASSES}>
                          <option value="delete">Eliminar mensaje</option>
                          <option value="delete+warn">Eliminar + Advertencia</option>
                          <option value="delete+timeout">Eliminar + Timeout</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button onClick={saveProtection}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white">
                    <Save size={14} /> Guardar Todo
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== MODERATION ==================== */}
          {activeSection === "moderation" && selectedGuild && (
            <motion.div key="moderation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">Moderación</span>
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Shield size={18} className="text-[#ED4245]" /> Acción Moderadora</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">ID del Usuario</label>
                      <input type="text" value={modAction.userId} onChange={(e) => setModAction((p) => ({ ...p, userId: e.target.value }))}
                        placeholder="ID de Discord" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Razón</label>
                      <input type="text" value={modAction.reason} onChange={(e) => setModAction((p) => ({ ...p, reason: e.target.value }))}
                        placeholder="Razón de la acción..." className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Duración</label>
                        <select value={modAction.duration} onChange={(e) => setModAction((p) => ({ ...p, duration: e.target.value }))}
                          className={CHANNEL_SELECT_CLASSES}>
                          <option value="5m">5 minutos</option>
                          <option value="10m">10 minutos</option>
                          <option value="30m">30 minutos</option>
                          <option value="1h">1 hora</option>
                          <option value="6h">6 horas</option>
                          <option value="12h">12 horas</option>
                          <option value="1d">1 día</option>
                          <option value="7d">7 días</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Eliminar Mensajes</label>
                        <select value={modAction.deleteDays} onChange={(e) => setModAction((p) => ({ ...p, deleteDays: parseInt(e.target.value) }))}
                          className={CHANNEL_SELECT_CLASSES}>
                          <option value={0}>No</option>
                          <option value={1}>Últimas 24h</option>
                          <option value={7}>Últimos 7 días</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {[
                        { type: "warn", label: "Warn", color: "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400", icon: AlertTriangle },
                        { type: "timeout", label: "Timeout", color: "bg-orange-500/20 hover:bg-orange-500/30 text-orange-400", icon: Clock },
                        { type: "kick", label: "Kick", color: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400", icon: Users },
                        { type: "ban", label: "Ban", color: "bg-red-500/20 hover:bg-red-500/30 text-red-400", icon: Ban },
                      ].map(({ type, label, color, icon: Icon }) => (
                        <button key={type} onClick={() => { setModAction((p) => ({ ...p, type })); executeModAction(); }}
                          disabled={!modAction.userId}
                          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl transition-colors text-sm font-semibold disabled:opacity-40 ${color}`}>
                          <Icon size={14} /> {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><FileText size={18} className="text-[#5865F2]" /> Historial de Casos</h3>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {casesList.length > 0 ? casesList.map((c, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <span className="text-xs font-bold text-gray-600 w-8">#{c.id || i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-bold mr-2 ${
                              c.type === "ban" ? "bg-red-500/20 text-red-400" :
                              c.type === "kick" ? "bg-blue-500/20 text-blue-400" :
                              c.type === "timeout" ? "bg-orange-500/20 text-orange-400" :
                              "bg-yellow-500/20 text-yellow-400"
                            }`}>{c.type}</span>
                            {c.username || c.userId || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {c.reason || "Sin razón"} · {c.moderatorId ? `Mod: ${c.moderatorId}` : ""} · {c.timestamp ? formatDate(c.timestamp) : "—"}
                          </div>
                        </div>
                      </div>
                    )) : <p className="text-sm text-gray-500 text-center py-4">Sin casos registrados</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== LEVELS ==================== */}
          {activeSection === "levels" && selectedGuild && (
            <motion.div key="levels" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">Niveles & XP</span>
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-[#EB459E]" /> Configuración de XP</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div className="text-sm font-semibold text-white">Activar Sistema de Niveles</div>
                        <Toggle enabled={levelsConfig.enabled} onToggle={() => setLevelsConfig((p) => ({ ...p, enabled: !p.enabled }))} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">XP por Mensaje</label>
                          <input type="number" value={levelsConfig.xpPerMessage}
                            onChange={(e) => setLevelsConfig((p) => ({ ...p, xpPerMessage: parseInt(e.target.value) || 15 }))}
                            min={1} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">XP Voz / Min</label>
                          <input type="number" value={levelsConfig.xpVoicePerMinute}
                            onChange={(e) => setLevelsConfig((p) => ({ ...p, xpVoicePerMinute: parseInt(e.target.value) || 10 }))}
                            min={1} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Canal de Anuncios</label>
                        <select value={levelsConfig.announceChannel}
                          onChange={(e) => setLevelsConfig((p) => ({ ...p, announceChannel: e.target.value }))}
                          className={CHANNEL_SELECT_CLASSES}>
                          <option value="">Ninguno</option>
                          {guildConfig.channels?.filter((c) => c.type === 0).map((ch) => (
                            <option key={ch.id} value={ch.id}>#{ch.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Multiplicador</label>
                        <select value={levelsConfig.multiplier}
                          onChange={(e) => setLevelsConfig((p) => ({ ...p, multiplier: e.target.value }))}
                          className={CHANNEL_SELECT_CLASSES}>
                          <option value="1x">1x (Normal)</option>
                          <option value="1.5x">1.5x</option>
                          <option value="2x">2x</option>
                          <option value="3x">3x</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Mensaje de Subida de Nivel</label>
                        <input type="text" value={levelsConfig.levelUpMessage}
                          onChange={(e) => setLevelsConfig((p) => ({ ...p, levelUpMessage: e.target.value }))}
                          placeholder="¡Felicidades {user}! Has alcanzado el nivel {level}!" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div className="text-sm font-semibold text-white">Ignorar Bots</div>
                        <Toggle enabled={levelsConfig.ignoreBots} onToggle={() => setLevelsConfig((p) => ({ ...p, ignoreBots: !p.ignoreBots }))} />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div className="text-sm font-semibold text-white">Reset al perder Roles</div>
                        <Toggle enabled={levelsConfig.resetRoles} onToggle={() => setLevelsConfig((p) => ({ ...p, resetRoles: !p.resetRoles }))} />
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Award size={18} className="text-[#FEE75C]" /> Recompensas por Nivel</h3>
                    <div className="space-y-3">
                      {levelsConfig.rewards.map((r, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">Lv.</span>
                            <input type="number" value={r.level}
                              onChange={(e) => {
                                const newRewards = [...levelsConfig.rewards];
                                newRewards[i].level = parseInt(e.target.value) || 1;
                                setLevelsConfig((p) => ({ ...p, rewards: newRewards }));
                              }}
                              min={1} className="w-14 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 text-center" />
                          </div>
                          <div className="flex-1">
                            <select value={r.roleId}
                              onChange={(e) => {
                                const newRewards = [...levelsConfig.rewards];
                                newRewards[i].roleId = e.target.value;
                                setLevelsConfig((p) => ({ ...p, rewards: newRewards }));
                              }}
                              className={CHANNEL_SELECT_CLASSES}>
                              <option value="">Seleccionar rol...</option>
                              {guildConfig.roles?.map((role) => (
                                <option key={role.id} value={role.id}>@{role.name}</option>
                              ))}
                            </select>
                          </div>
                          <button onClick={() => setLevelsConfig((p) => ({ ...p, rewards: p.rewards.filter((_, idx) => idx !== i) }))}
                            className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => setLevelsConfig((p) => ({ ...p, rewards: [...p.rewards, { level: (p.rewards[p.rewards.length - 1]?.level || 0) + 5, roleId: "" }] }))}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/10 hover:border-[#5865F2]/30 transition-colors text-sm text-gray-400 hover:text-white">
                        <Plus size={14} /> Añadir Recompensa
                      </button>
                    </div>
                  </div>

                  <button onClick={saveLevels}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white">
                    <Save size={14} /> Guardar
                  </button>
                </div>

                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Award size={18} className="text-[#FEE75C]" /> Top Niveles</h3>
                  <div className="space-y-2">
                    {levelsTop.length > 0 ? levelsTop.map((entry: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <span className={`text-sm font-bold w-6 text-center ${
                          i === 0 ? "text-[#FEE75C]" : i === 1 ? "text-gray-300" : i === 2 ? "text-[#CD7F32]" : "text-gray-600"
                        }`}>#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white truncate">{entry.username || entry.userId}</div>
                          <div className="text-xs text-gray-500">Nivel {entry.level || 0} · XP {(entry.xp || 0).toLocaleString()}</div>
                        </div>
                      </div>
                    )) : <p className="text-sm text-gray-500 text-center py-4">Sin datos aún</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== ECONOMY ==================== */}
          {activeSection === "economy" && selectedGuild && (
            <motion.div key="economy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">Economía</span>
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Coins size={18} className="text-[#5865F2]" /> Configuración General</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div className="text-sm font-semibold text-white">Activar Economía</div>
                        <Toggle enabled={economyConfig.enabled} onToggle={() => setEconomyConfig((p) => ({ ...p, enabled: !p.enabled }))} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Moneda (singular)</label>
                          <input type="text" value={economyConfig.currencyName}
                            onChange={(e) => setEconomyConfig((p) => ({ ...p, currencyName: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Moneda (plural)</label>
                          <input type="text" value={economyConfig.currencyPlural}
                            onChange={(e) => setEconomyConfig((p) => ({ ...p, currencyPlural: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Emoji</label>
                          <input type="text" value={economyConfig.currencyEmoji}
                            onChange={(e) => setEconomyConfig((p) => ({ ...p, currencyEmoji: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Balance Inicial</label>
                          <input type="number" value={economyConfig.startingBalance}
                            onChange={(e) => setEconomyConfig((p) => ({ ...p, startingBalance: parseInt(e.target.value) || 100 }))}
                            min={0} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Wrench size={18} className="text-[#57F287]" /> Work & Daily</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Recompensa Work</label>
                          <input type="number" value={economyConfig.workReward}
                            onChange={(e) => setEconomyConfig((p) => ({ ...p, workReward: parseInt(e.target.value) || 100 }))}
                            min={0} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Cooldown Work (seg)</label>
                          <input type="number" value={economyConfig.workCooldown}
                            onChange={(e) => setEconomyConfig((p) => ({ ...p, workCooldown: parseInt(e.target.value) || 3600 }))}
                            min={60} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Recompensa Daily</label>
                          <input type="number" value={economyConfig.dailyReward}
                            onChange={(e) => setEconomyConfig((p) => ({ ...p, dailyReward: parseInt(e.target.value) || 500 }))}
                            min={0} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Cooldown Daily (seg)</label>
                          <input type="number" value={economyConfig.dailyCooldown}
                            onChange={(e) => setEconomyConfig((p) => ({ ...p, dailyCooldown: parseInt(e.target.value) || 86400 }))}
                            min={3600} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Gamepad2 size={18} className="text-[#EB459E]" /> Gambling</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div className="text-sm font-semibold text-white">Activar Rob</div>
                        <Toggle enabled={economyConfig.robEnabled}
                          onToggle={() => setEconomyConfig((p) => ({ ...p, robEnabled: !p.robEnabled }))} />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Máx. % Rob</label>
                        <input type="number" value={economyConfig.maxRobPercent}
                          onChange={(e) => setEconomyConfig((p) => ({ ...p, maxRobPercent: parseInt(e.target.value) || 20 }))}
                          min={1} max={100} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <div className="text-sm font-semibold text-white">Activar Slots</div>
                        <Toggle enabled={economyConfig.slotsEnabled}
                          onToggle={() => setEconomyConfig((p) => ({ ...p, slotsEnabled: !p.slotsEnabled }))} />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Multiplier</label>
                          <input type="number" value={economyConfig.slotsMultiplier}
                            onChange={(e) => setEconomyConfig((p) => ({ ...p, slotsMultiplier: parseInt(e.target.value) || 2 }))}
                            min={1} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5865F2]/50" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Min Bet</label>
                          <input type="number" value={economyConfig.slotsMinBet}
                            onChange={(e) => setEconomyConfig((p) => ({ ...p, slotsMinBet: parseInt(e.target.value) || 10 }))}
                            min={1} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5865F2]/50" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Max Bet</label>
                          <input type="number" value={economyConfig.slotsMaxBet}
                            onChange={(e) => setEconomyConfig((p) => ({ ...p, slotsMaxBet: parseInt(e.target.value) || 1000 }))}
                            min={1} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5865F2]/50" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button onClick={saveEconomy}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white">
                    <Save size={14} /> Guardar
                  </button>
                </div>

                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Coins size={18} className="text-[#FEE75C]" /> Top Economía</h3>
                  <div className="space-y-2">
                    {economyTop.length > 0 ? economyTop.map((entry: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <span className={`text-sm font-bold w-6 text-center ${
                          i === 0 ? "text-[#FEE75C]" : i === 1 ? "text-gray-300" : i === 2 ? "text-[#CD7F32]" : "text-gray-600"
                        }`}>#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white truncate">{entry.username || entry.userId}</div>
                          <div className="text-xs text-gray-500">{(entry.balance || 0).toLocaleString()} {economyConfig.currencyName}</div>
                        </div>
                      </div>
                    )) : <p className="text-sm text-gray-500 text-center py-4">Sin datos aún</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== VERIFICATION ==================== */}
          {activeSection === "verification" && selectedGuild && (
            <motion.div key="verification" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">Verificación</span>
              </h1>
              <div className="glass rounded-2xl p-6 max-w-2xl">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><UserCheck size={18} className="text-[#57F287]" /> Sistema de Verificación</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                    <div className={`w-3 h-3 rounded-full ${verifyConfig.enabled ? "bg-green-400" : "bg-gray-500"}`} />
                    <div>
                      <div className="text-sm font-semibold text-white">{verifyConfig.enabled ? "Activo" : "Inactivo"}</div>
                      <div className="text-xs text-gray-500">{verifyConfig.enabled ? "La verificación está configurada" : "Configura la verificación para tu servidor"}</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Canal de Verificación</label>
                    <select value={verifyConfig.channel}
                      onChange={(e) => setVerifyConfig((p) => ({ ...p, channel: e.target.value }))}
                      className={CHANNEL_SELECT_CLASSES}>
                      <option value="">Seleccionar canal...</option>
                      {guildConfig.channels?.filter((c) => c.type === 0).map((ch) => (
                        <option key={ch.id} value={ch.id}>#{ch.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Rol de Verificación</label>
                    <select value={verifyConfig.roleId}
                      onChange={(e) => setVerifyConfig((p) => ({ ...p, roleId: e.target.value }))}
                      className={CHANNEL_SELECT_CLASSES}>
                      <option value="">Seleccionar rol...</option>
                      {guildConfig.roles?.map((r) => (
                        <option key={r.id} value={r.id}>@{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Mensaje Personalizado</label>
                    <textarea value={verifyConfig.message}
                      onChange={(e) => setVerifyConfig((p) => ({ ...p, message: e.target.value }))}
                      placeholder="Haz clic en el botón para verificar tu cuenta." rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 resize-none" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={saveVerification}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white">
                      <Save size={14} /> Publicar
                    </button>
                    <button onClick={removeVerification}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-colors text-sm font-semibold text-red-400">
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== BOT CONTROL (Owner) ==================== */}
          {activeSection === "bot-control" && isOwner && (
            <motion.div key="bot-control" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#ED4245] bg-clip-text text-transparent">Control del Bot</span>
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-4 h-4 rounded-full ${botPowerStatus === "online" ? "bg-green-400" : "bg-red-400"}`} />
                    <h3 className="font-bold text-white">Estado</h3>
                  </div>
                  <div className={`text-3xl font-black ${botPowerStatus === "online" ? "text-green-400" : "text-red-400"}`}>
                    {botPowerStatus === "online" ? "Online" : "Offline"}
                  </div>
                </div>
                {stats && (
                  <>
                    <div className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4"><Zap size={18} className="text-[#5865F2]" /><h3 className="font-bold text-white">Ping</h3></div>
                      <div className="text-3xl font-black text-white">{stats.ping}ms</div>
                    </div>
                    <div className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4"><Server size={18} className="text-[#7C3AED]" /><h3 className="font-bold text-white">Servidores</h3></div>
                      <div className="text-3xl font-black text-white">{stats.guilds}</div>
                    </div>
                  </>
                )}
              </div>

              {stats && (
                <div className="glass rounded-2xl p-6 mb-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Cpu size={18} className="text-[#57F287]" /> Detalles del Sistema</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="text-xs text-gray-500">Memoria</div>
                      <div className="text-lg font-bold text-white">{formatMemory(stats.memory)}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="text-xs text-gray-500">Node.js</div>
                      <div className="text-lg font-bold text-white">{stats.node || "—"}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="text-xs text-gray-500">Heap Used</div>
                      <div className="text-lg font-bold text-white">{stats.heapUsed ? `${stats.heapUsed}MB` : "—"}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                      <div className="text-xs text-gray-500">RSS</div>
                      <div className="text-lg font-bold text-white">{stats.rss ? `${stats.rss}MB` : "—"}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Power size={18} className="text-[#ED4245]" /> Control</h3>
                <div className="flex gap-3">
                  <button onClick={() => executePowerAction("start")}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500/20 hover:bg-green-500/30 transition-colors text-sm font-semibold text-green-400">
                    <Power size={16} /> Iniciar
                  </button>
                  <button onClick={() => executePowerAction("restart")}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 transition-colors text-sm font-semibold text-yellow-400">
                    <RefreshCw size={16} /> Reiniciar
                  </button>
                  <button onClick={() => executePowerAction("stop")}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-colors text-sm font-semibold text-red-400">
                    <Power size={16} /> Detener
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== GLOBAL BANS (Owner) ==================== */}
          {activeSection === "global-bans" && isOwner && (
            <motion.div key="global-bans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#ED4245] bg-clip-text text-transparent">Bans Globales</span>
              </h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Ban size={18} className="text-[#ED4245]" /> Añadir Ban Global</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">ID de Usuario</label>
                      <input type="text" value={globalBanForm.userId} onChange={(e) => setGlobalBanForm((p) => ({ ...p, userId: e.target.value }))}
                        placeholder="ID de Discord" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Razón</label>
                      <input type="text" value={globalBanForm.reason} onChange={(e) => setGlobalBanForm((p) => ({ ...p, reason: e.target.value }))}
                        placeholder="Razón del ban..." className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                    </div>
                    <button onClick={addGlobalBan} disabled={!globalBanForm.userId}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ED4245] hover:bg-[#c03537] transition-colors text-sm font-semibold text-white disabled:opacity-50">
                      <Plus size={14} /> Añadir Ban
                    </button>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Ban size={18} className="text-[#ED4245]" /> Bans Activos ({globalBans.length})</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {globalBans.length > 0 ? globalBans.map((ban) => (
                      <div key={ban.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <Ban size={14} className="text-red-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white truncate">{ban.username} ({ban.userId})</div>
                          <div className="text-xs text-gray-500">{ban.reason} · {formatDate(ban.bannedAt)}</div>
                        </div>
                        <button onClick={() => removeGlobalBan(ban.id)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )) : <p className="text-sm text-gray-500 text-center py-4">Sin bans globales</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== BROADCAST (Owner) ==================== */}
          {activeSection === "broadcast" && isOwner && (
            <motion.div key="broadcast" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#5865F2] bg-clip-text text-transparent">Broadcast</span>
              </h1>
              <div className="glass rounded-2xl p-6 max-w-2xl">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Megaphone size={18} className="text-[#5865F2]" /> Enviar Broadcast</h3>
                <p className="text-sm text-gray-400 mb-4">Envía un mensaje a todos los servidores donde el bot está presente.</p>
                <div className="space-y-4">
                  <textarea value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Escribe un mensaje para enviar a todos los servidores..." rows={5}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 resize-none" />
                  <button onClick={sendBroadcast} disabled={!broadcastMessage.trim() || broadcastLoading}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white disabled:opacity-50">
                    <Send size={14} /> {broadcastLoading ? "Enviando..." : "Enviar Broadcast"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== IP BANS (Owner) ==================== */}
          {activeSection === "ip-bans" && isOwner && (
            <motion.div key="ip-bans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#ED4245] bg-clip-text text-transparent">IP Bans</span>
              </h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><ShieldBan size={18} className="text-[#ED4245]" /> Banear IP</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Dirección IP</label>
                        <input type="text" value={ipBanForm.ip} onChange={(e) => setIpBanForm((p) => ({ ...p, ip: e.target.value }))}
                          placeholder="192.168.1.1" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 font-mono" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Razón</label>
                        <input type="text" value={ipBanForm.reason} onChange={(e) => setIpBanForm((p) => ({ ...p, reason: e.target.value }))}
                          placeholder="Razón del ban..." className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                      </div>
                      <button onClick={addIpBan} disabled={!ipBanForm.ip}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ED4245] hover:bg-[#c03537] transition-colors text-sm font-semibold text-white disabled:opacity-50">
                        <Plus size={14} /> Banear IP
                      </button>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Search size={18} className="text-[#5865F2]" /> Lookup de IPs</h3>
                    <p className="text-xs text-gray-500 mb-3">Busca las IPs asociadas a un usuario, o los usuarios asociados a una IP.</p>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input type="text" value={ipLookupUserId} onChange={(e) => setIpLookupUserId(e.target.value)}
                          placeholder="ID de usuario..." className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5865F2]/50" />
                        <button onClick={lookupUserIps} disabled={!ipLookupUserId}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-xs font-semibold text-white disabled:opacity-50">
                          <Search size={12} /> IPs
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={ipLookupIp} onChange={(e) => setIpLookupIp(e.target.value)}
                          placeholder="Dirección IP..." className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5865F2]/50 font-mono" />
                        <button onClick={lookupIpAccounts} disabled={!ipLookupIp}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6328c4] transition-colors text-xs font-semibold text-white disabled:opacity-50">
                          <Search size={12} /> Cuentas
                        </button>
                      </div>
                    </div>
                    {ipLookupResults && (
                      <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(ipLookupResults, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>

                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><ShieldBan size={18} className="text-[#ED4245]" /> IPs Baneadas ({ipBans.length})</h3>
                  <div className="text-xs text-gray-500 mb-3">Las IPs baneadas bloquean el acceso a la verificación y al bot.</div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {ipBans.length > 0 ? ipBans.map((ban) => (
                      <div key={ban.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <ShieldBan size={14} className="text-red-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white font-mono truncate">{ban.ip}</div>
                          <div className="text-xs text-gray-500">{ban.reason} · {formatDate(ban.bannedAt)}</div>
                        </div>
                        <button onClick={() => removeIpBan(ban.id)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )) : <p className="text-sm text-gray-500 text-center py-4">Sin IPs baneadas</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== SECURITY (Owner) ==================== */}
          {activeSection === "security" && isOwner && (
            <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#ED4245] bg-clip-text text-transparent">Security</span>
              </h1>

              <div className="glass rounded-2xl p-6 mb-6 max-w-xl">
                <div className="flex gap-3">
                  <input type="text" value={securityGuildId} onChange={(e) => setSecurityGuildId(e.target.value)}
                    placeholder={selectedGuild ? `ID: ${selectedGuild.id}` : "Guild ID..."}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                  <button onClick={fetchSecurityData}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white">
                    <ShieldCheck size={14} /> Cargar
                  </button>
                </div>
              </div>

              {securityData ? (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: "Usuarios Flagged", value: securityData.flaggedUsers?.length || 0, color: "#ED4245", icon: AlertTriangle },
                      { label: "Alto Riesgo", value: securityData.highRisk || 0, color: "#FEE75C", icon: ShieldAlert },
                      { label: "Alertas", value: securityData.alerts?.length || 0, color: "#5865F2", icon: Bug },
                      { label: "Alts Detectados", value: securityData.altsDetected || 0, color: "#EB459E", icon: Bot },
                    ].map((item) => (
                      <div key={item.label} className="glass rounded-xl p-5">
                        <div className="inline-flex p-2 rounded-lg mb-2" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                          <item.icon size={18} />
                        </div>
                        <div className="text-2xl font-black text-white">{item.value}</div>
                        <div className="text-xs text-gray-500">{item.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass rounded-2xl p-6">
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Bug size={18} className="text-[#ED4245]" /> Alertas Recientes</h3>
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {securityData.recentAlerts?.length > 0 ? securityData.recentAlerts.map((alert: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                            <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-white">{alert.message || alert.type || "Alerta"}</div>
                              <div className="text-xs text-gray-500">{alert.timestamp ? formatDate(alert.timestamp) : "—"}</div>
                            </div>
                          </div>
                        )) : <p className="text-sm text-gray-500 text-center py-4">Sin alertas recientes</p>}
                      </div>
                    </div>

                    <div className="glass rounded-2xl p-6">
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2"><ShieldAlert size={18} className="text-[#EB459E]" /> Top Usuarios Flagged</h3>
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {securityData.flaggedUsers?.length > 0 ? securityData.flaggedUsers.map((fu: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                            <span className="text-xs font-bold text-gray-600 w-6">#{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-white">{fu.username || fu.userId || "N/A"}</div>
                              <div className="text-xs text-gray-500">{fu.reason || "Sin razón"} · Riesgo: {fu.risk || "—"}</div>
                            </div>
                          </div>
                        )) : <p className="text-sm text-gray-500 text-center py-4">Sin usuarios flagged</p>}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass rounded-2xl p-12 text-center">
                  <ShieldCheck size={48} className="text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Ingresa un Guild ID para cargar datos de seguridad.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ==================== STAFF (Owner) ==================== */}
          {activeSection === "staff" && isOwner && (
            <motion.div key="staff" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#5865F2] bg-clip-text text-transparent">Staff</span>
              </h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><UserCog size={18} className="text-[#5865F2]" /> Añadir Staff</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">ID de Usuario</label>
                      <input type="text" value={staffForm.userId} onChange={(e) => setStaffForm((p) => ({ ...p, userId: e.target.value }))}
                        placeholder="ID de Discord" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Rango</label>
                      <select value={staffForm.rank} onChange={(e) => setStaffForm((p) => ({ ...p, rank: e.target.value }))}
                        className={CHANNEL_SELECT_CLASSES}>
                        <option value="moderator">Moderador</option>
                        <option value="admin">Admin</option>
                        <option value="developer">Developer</option>
                        <option value="owner">Owner</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Nota</label>
                      <input type="text" value={staffForm.note} onChange={(e) => setStaffForm((p) => ({ ...p, note: e.target.value }))}
                        placeholder="Nota opcional..." className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                    </div>
                    <button onClick={addStaff} disabled={!staffForm.userId}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white disabled:opacity-50">
                      <Plus size={14} /> Añadir Staff
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Users size={18} className="text-[#7C3AED]" /> Staff ({staffList.length})</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {staffList.length > 0 ? staffList.map((member) => (
                        <div key={member.id || member.userId} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                          <UserCog size={14} className="text-[#5865F2] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white truncate">{member.username || member.userId}</div>
                            <div className="text-xs text-gray-500">
                              {member.rank || member.role} {member.note ? `· ${member.note}` : ""} · {formatDate(member.addedAt)}
                            </div>
                          </div>
                          <button onClick={() => removeStaff(member.userId || member.id)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )) : <p className="text-sm text-gray-500 text-center py-4">Sin staff registrado</p>}
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white flex items-center gap-2"><ScrollText size={18} className="text-[#5865F2]" /> Auditoría de Staff</h3>
                      <button onClick={loadStaffLogs}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors">
                        <RefreshCw size={12} /> Cargar
                      </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {staffLogs.length > 0 ? staffLogs.map((log: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                          <div className="text-xs text-gray-500">{log.action || "—"}</div>
                          <div className="text-xs text-white">{log.userId || "—"}</div>
                          <div className="text-xs text-gray-600 ml-auto">{log.timestamp ? formatDate(log.timestamp) : ""}</div>
                        </div>
                      )) : <p className="text-sm text-gray-500 text-center py-2">Sin registros</p>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== ANALYTICS (Owner) ==================== */}
          {activeSection === "analytics" && isOwner && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#5865F2] bg-clip-text text-transparent">Analytics</span>
              </h1>

              {ownerStats && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: "Comandos Totales", value: ownerStats.totalCommands.toLocaleString(), icon: Command, color: "#5865F2" },
                      { label: "Comandos Hoy", value: ownerStats.commandsToday.toLocaleString(), icon: TrendingUp, color: "#57F287" },
                      { label: "Servidores Activos", value: ownerStats.activeGuilds, icon: Server, color: "#7C3AED" },
                      { label: "Usuarios Activos", value: ownerStats.activeUsers.toLocaleString(), icon: Users, color: "#FEE75C" },
                    ].map((item) => (
                      <div key={item.label} className="glass rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <item.icon size={18} style={{ color: item.color }} />
                          <span className="text-xs text-gray-500">{item.label}</span>
                        </div>
                        <div className="text-2xl font-black text-white">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {ownerStats.topCommands && ownerStats.topCommands.length > 0 && (
                    <div className="glass rounded-2xl p-6">
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-[#7C3AED]" /> Top Comandos</h3>
                      <div className="space-y-3">
                        {ownerStats.topCommands.map((cmd, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-600 w-6">#{i + 1}</span>
                            <code className="px-2 py-1 rounded-lg bg-[#5865F2]/10 text-[#5865F2] text-sm font-mono">{cmd.name}</code>
                            <div className="flex-1">
                              <div className="w-full bg-white/10 rounded-full h-2">
                                <div className="bg-[#5865F2] h-2 rounded-full"
                                  style={{ width: `${Math.min(100, (cmd.uses / (ownerStats.topCommands[0]?.uses || 1)) * 100)}%` }} />
                              </div>
                            </div>
                            <span className="text-sm text-gray-400 w-20 text-right">{cmd.uses.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* ==================== PREMIUM ADMIN (Owner) ==================== */}
          {activeSection === "premium-admin" && isOwner && (
            <motion.div key="premium-admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#FEE75C] bg-clip-text text-transparent">Premium Admin</span>
              </h1>

              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {[
                  { id: "users", label: "Usuarios" },
                  { id: "grant", label: "Conceder" },
                  { id: "codes", label: "Códigos" },
                  { id: "requests", label: "Solicitudes" },
                  { id: "history", label: "Historial" },
                  { id: "servers", label: "Servidores" },
                  { id: "plans", label: "Planes" },
                  { id: "blacklist", label: "Blacklist" },
                  { id: "coupons", label: "Cupones" },
                  { id: "forceexpire", label: "Force Expire" },
                  { id: "giveall", label: "Give All" },
                ].map((tab) => (
                  <button key={tab.id} onClick={() => { setPremiumAdminTab(tab.id); loadPremiumAdminData(tab.id); }}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      premiumAdminTab === tab.id ? "bg-[#7C3AED]/20 text-[#7C3AED]" : "bg-white/5 text-gray-400 hover:text-white"
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {premiumAdminTab === "users" && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Users size={18} className="text-[#EB459E]" /> Usuarios Premium ({premiumUsers.length})</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {premiumUsers.length > 0 ? premiumUsers.map((pu) => (
                      <div key={pu.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <div className={`w-2 h-2 rounded-full ${pu.active ? "bg-green-400" : "bg-gray-500"}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white truncate">{pu.username}</div>
                          <div className="text-xs text-gray-500">{pu.tier || pu.plan} · {pu.expiresAt ? formatDate(pu.expiresAt) : "N/A"}</div>
                        </div>
                        {pu.active && (
                          <button onClick={() => revokePremium(pu.id)}
                            className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors text-xs font-semibold text-red-400">
                            Revocar
                          </button>
                        )}
                      </div>
                    )) : <p className="text-sm text-gray-500 text-center py-4">Sin usuarios premium</p>}
                  </div>
                </div>
              )}

              {premiumAdminTab === "grant" && (
                <div className="glass rounded-2xl p-6 max-w-xl">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Crown size={18} className="text-[#FEE75C]" /> Conceder Premium</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">ID de Usuario</label>
                      <input type="text" value={premiumGrantForm.userId}
                        onChange={(e) => setPremiumGrantForm((p) => ({ ...p, userId: e.target.value }))}
                        placeholder="ID de Discord" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Tier</label>
                      <select value={premiumGrantForm.tier}
                        onChange={(e) => setPremiumGrantForm((p) => ({ ...p, tier: e.target.value }))}
                        className={CHANNEL_SELECT_CLASSES}>
                        <option value="Sharingan">Sharingan</option>
                        <option value="Mangekyo">Mangekyo</option>
                        <option value="Rinnegan">Rinnegan</option>
                      </select>
                    </div>
                    <button onClick={grantPremium} disabled={!premiumGrantForm.userId}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#57F287] hover:bg-[#45b865] transition-colors text-sm font-semibold text-white disabled:opacity-50">
                      <Gift size={14} /> Conceder
                    </button>
                  </div>
                </div>
              )}

              {premiumAdminTab === "codes" && (
                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6 max-w-xl">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Code size={18} className="text-[#57F287]" /> Generar Código</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Tier</label>
                        <select value={premiumCodeTier} onChange={(e) => setPremiumCodeTier(e.target.value)}
                          className={CHANNEL_SELECT_CLASSES}>
                          <option value="Sharingan">Sharingan</option>
                          <option value="Mangekyo">Mangekyo</option>
                          <option value="Rinnegan">Rinnegan</option>
                        </select>
                      </div>
                      <button onClick={generatePremiumCode}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white">
                        <Plus size={14} /> Generar Código
                      </button>
                    </div>
                  </div>
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Key size={18} className="text-[#57F287]" /> Códigos ({premiumCodes.length})</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {premiumCodes.length > 0 ? premiumCodes.map((pc) => (
                        <div key={pc.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                          <code className="px-2 py-1 rounded-lg bg-[#57F287]/10 text-[#57F287] text-sm font-mono">{pc.code}</code>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-500">{pc.tier} · {pc.uses}/{pc.maxUses} usos</div>
                          </div>
                          <button onClick={() => { navigator.clipboard.writeText(pc.code); showToast("Código copiado", "success"); }}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                            <Copy size={14} />
                          </button>
                        </div>
                      )) : <p className="text-sm text-gray-500 text-center py-4">Sin códigos generados</p>}
                    </div>
                  </div>
                </div>
              )}

              {premiumAdminTab === "requests" && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><MessageCircle size={18} className="text-[#5865F2]" /> Solicitudes Pendientes</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {premiumRequests.length > 0 ? premiumRequests.map((req) => (
                      <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white">{req.username} ({req.userId})</div>
                          <div className="text-xs text-gray-500">{req.plan} · {req.status} · {formatDate(req.createdAt)}</div>
                        </div>
                        {req.status === "pending" && (
                          <div className="flex gap-2">
                            <button onClick={() => approvePremiumRequest(req.id)}
                              className="px-3 py-1 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-xs font-semibold text-green-400">
                              Aprobar
                            </button>
                            <button onClick={() => denyPremiumRequest(req.id)}
                              className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs font-semibold text-red-400">
                              Denegar
                            </button>
                          </div>
                        )}
                      </div>
                    )) : <p className="text-sm text-gray-500 text-center py-4">Sin solicitudes</p>}
                  </div>
                </div>
              )}

              {premiumAdminTab === "history" && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><ScrollText size={18} className="text-[#7C3AED]" /> Historial</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {premiumHistory.length > 0 ? premiumHistory.map((h, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                          h.action === "grant" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}>{h.action}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white">{h.username} ({h.userId})</div>
                          <div className="text-xs text-gray-500">{h.plan || "—"} · {formatDate(h.timestamp)}</div>
                        </div>
                      </div>
                    )) : <p className="text-sm text-gray-500 text-center py-4">Sin historial</p>}
                  </div>
                </div>
              )}

              {premiumAdminTab === "servers" && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Server size={18} className="text-[#5865F2]" /> Servidores con Premium</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {premiumServers.length > 0 ? premiumServers.map((s: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <Server size={14} className="text-[#5865F2] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white">{s.name || s.id}</div>
                          <div className="text-xs text-gray-500">{s.plan || "—"} · {s.members || 0} miembros</div>
                        </div>
                      </div>
                    )) : <p className="text-sm text-gray-500 text-center py-4">Sin servidores con premium</p>}
                  </div>
                </div>
              )}

              {premiumAdminTab === "plans" && (
                <div className="glass rounded-2xl p-6 max-w-xl">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><CreditCard size={18} className="text-[#FEE75C]" /> Configurar Planes</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">URL de Tienda</label>
                      <input type="url" value={premiumStoreUrl} onChange={(e) => setPremiumStoreUrl(e.target.value)}
                        placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                    </div>
                    <button onClick={savePremiumStoreUrl}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-sm font-semibold text-white">
                      <Save size={14} /> Guardar URL
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      {PREMIUM_PLANS.map((plan) => (
                        <div key={plan.name} className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="text-lg font-bold" style={{ color: plan.color }}>{plan.name}</div>
                          <div className="text-sm text-white font-semibold">{plan.price}</div>
                          <div className="mt-2 space-y-1">
                            {plan.features.map((f, i) => (
                              <div key={i} className="flex items-center gap-1 text-xs text-gray-400">
                                <CheckCircle size={10} className="text-green-400" /> {f}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {premiumAdminTab === "blacklist" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Ban size={18} className="text-[#ED4245]" /> Añadir a Blacklist</h3>
                    <div className="flex gap-3">
                      <input type="text" value={premiumBlacklistForm} onChange={(e) => setPremiumBlacklistForm(e.target.value)}
                        placeholder="ID de usuario..." className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                      <button onClick={addPremiumBlacklist} disabled={!premiumBlacklistForm}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ED4245] hover:bg-[#c03537] transition-colors text-sm font-semibold text-white disabled:opacity-50">
                        <Plus size={14} /> Añadir
                      </button>
                    </div>
                  </div>
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Ban size={18} className="text-[#ED4245]" /> Blacklist ({premiumBlacklist.length})</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {premiumBlacklist.length > 0 ? premiumBlacklist.map((bl: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                          <Ban size={14} className="text-red-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white">{bl.username || bl.userId || "—"}</div>
                            <div className="text-xs text-gray-500">{bl.reason || "Sin razón"}</div>
                          </div>
                          <button onClick={() => removePremiumBlacklist(bl.userId)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )) : <p className="text-sm text-gray-500 text-center py-4">Sin usuarios en blacklist</p>}
                    </div>
                  </div>
                </div>
              )}

              {premiumAdminTab === "coupons" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Gift size={18} className="text-[#57F287]" /> Crear Cupón</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Código</label>
                        <input type="text" value={premiumCouponForm.code} onChange={(e) => setPremiumCouponForm((p) => ({ ...p, code: e.target.value }))}
                          placeholder="DESCUENTO20" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 font-mono" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Descuento %</label>
                          <input type="number" value={premiumCouponForm.discount}
                            onChange={(e) => setPremiumCouponForm((p) => ({ ...p, discount: parseInt(e.target.value) || 10 }))}
                            min={1} max={100} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Máx. Usos</label>
                          <input type="number" value={premiumCouponForm.maxUses}
                            onChange={(e) => setPremiumCouponForm((p) => ({ ...p, maxUses: parseInt(e.target.value) || 100 }))}
                            min={1} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                        </div>
                      </div>
                      <button onClick={createPremiumCoupon} disabled={!premiumCouponForm.code}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#57F287] hover:bg-[#45b865] transition-colors text-sm font-semibold text-white disabled:opacity-50">
                        <Plus size={14} /> Crear Cupón
                      </button>
                    </div>
                  </div>
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Gift size={18} className="text-[#57F287]" /> Cupones ({premiumCoupons.length})</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {premiumCoupons.length > 0 ? premiumCoupons.map((c) => (
                        <div key={c.code} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                          <code className="px-2 py-1 rounded-lg bg-[#57F287]/10 text-[#57F287] text-sm font-mono">{c.code}</code>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-500">{c.discount}% · {c.uses}/{c.maxUses} usos</div>
                          </div>
                          <button onClick={() => deletePremiumCoupon(c.code)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )) : <p className="text-sm text-gray-500 text-center py-4">Sin cupones</p>}
                    </div>
                  </div>
                </div>
              )}

              {premiumAdminTab === "forceexpire" && (
                <div className="glass rounded-2xl p-6 max-w-xl">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-[#ED4245]" /> Forzar Expiración</h3>
                  <p className="text-sm text-gray-400 mb-4">Expira el premium de un usuario inmediatamente.</p>
                  <div className="flex gap-3">
                    <input type="text" value={premiumForceExpireId} onChange={(e) => setPremiumForceExpireId(e.target.value)}
                      placeholder="ID de usuario..." className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                    <button onClick={forceExpirePremium} disabled={!premiumForceExpireId}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ED4245] hover:bg-[#c03537] transition-colors text-sm font-semibold text-white disabled:opacity-50">
                      <Ban size={14} /> Expirar
                    </button>
                  </div>
                </div>
              )}

              {premiumAdminTab === "giveall" && (
                <div className="glass rounded-2xl p-6 max-w-xl">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Gift size={18} className="text-[#FEE75C]" /> Dar Premium a Todos</h3>
                  <p className="text-sm text-gray-400 mb-4">Concede premium a múltiples usuarios a la vez.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">IDs de Usuario (separados por coma)</label>
                      <textarea value={premiumGiveAllIds} onChange={(e) => setPremiumGiveAllIds(e.target.value)}
                        placeholder="123456789, 987654321, ..." rows={3}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 resize-none font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Plan</label>
                        <select value={premiumGiveAllPlan} onChange={(e) => setPremiumGiveAllPlan(e.target.value)}
                          className={CHANNEL_SELECT_CLASSES}>
                          <option value="Sharingan">Sharingan</option>
                          <option value="Mangekyo">Mangekyo</option>
                          <option value="Rinnegan">Rinnegan</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Días</label>
                        <input type="number" value={premiumGiveAllDays}
                          onChange={(e) => setPremiumGiveAllDays(parseInt(e.target.value) || 30)}
                          min={1} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50" />
                      </div>
                    </div>
                    <button onClick={giveAllPremium} disabled={!premiumGiveAllIds.trim()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FEE75C] hover:bg-[#e0c83a] transition-colors text-sm font-semibold text-black disabled:opacity-50">
                      <Gift size={14} /> Dar Premium a Todos
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ==================== JARVIS AI (Owner) ==================== */}
          {activeSection === "jarvis" && isOwner && (
            <motion.div key="jarvis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#EB459E] bg-clip-text text-transparent">JARVIS AI</span>
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 glass rounded-2xl p-6 flex flex-col h-[600px]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center">
                        <Sparkles size={16} className="text-[#7C3AED]" />
                      </div>
                      <h3 className="font-bold text-white">JARVIS AI</h3>
                      <span className="text-xs text-gray-500">{jarvisMessages.length} mensajes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={exportJarvisChat} disabled={jarvisMessages.length === 0}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50">
                        <FileText size={12} /> Exportar
                      </button>
                      <button onClick={clearJarvisChat} disabled={jarvisMessages.length === 0}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50">
                        <Trash2 size={12} /> Limpiar
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500">Modelo:</label>
                      <select value={jarvisModel} onChange={(e) => setJarvisModel(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#5865F2]/50 appearance-none">
                        <option value="llama-3.3-70b">LLaMA 3.3 70B</option>
                        <option value="mixtral-8x7b">Mixtral 8x7B</option>
                        <option value="gemma-2-9b">Gemma 2 9B</option>
                        <option value="llama-3.1-8b">LLaMA 3.1 8B</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500">Modo:</label>
                      <button onClick={() => setJarvisMode((p) => p === "professional" ? "stark" : "professional")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          jarvisMode === "stark" ? "bg-[#ED4245]/20 text-[#ED4245]" : "bg-[#5865F2]/20 text-[#5865F2]"
                        }`}>
                        {jarvisMode === "stark" ? "Stark (Iron Man)" : "Professional"}
                      </button>
                    </div>
                  </div>

                  <div ref={jarvisRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                    {jarvisMessages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Sparkles size={48} className="text-[#7C3AED]/30 mb-4" />
                        <p className="text-gray-500 text-sm">Escribe un mensaje para empezar a chatear con JARVIS</p>
                        <p className="text-gray-600 text-xs mt-1">Modo actual: {jarvisMode === "stark" ? "Stark" : "Professional"}</p>
                      </div>
                    )}
                    {jarvisMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-[#5865F2] text-white rounded-br-md"
                            : "bg-white/5 text-gray-300 rounded-bl-md"
                        }`}>
                          {msg.content}
                          <div className={`text-[10px] mt-1 ${msg.role === "user" ? "text-blue-200" : "text-gray-600"}`}>
                            {new Date(msg.timestamp).toLocaleTimeString("es-ES")}
                          </div>
                        </div>
                      </div>
                    ))}
                    {jarvisLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-bl-md">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0.1s" }} />
                            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0.2s" }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input type="text" value={jarvisInput} onChange={(e) => setJarvisInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendJarvisMessage()}
                      placeholder="Escribe un mensaje..." disabled={jarvisLoading}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#5865F2]/50 disabled:opacity-50" />
                    <button onClick={sendJarvisMessage} disabled={!jarvisInput.trim() || jarvisLoading}
                      className="px-4 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] transition-colors text-white disabled:opacity-50">
                      <Send size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Activity size={18} className="text-[#57F287]" /> Métricas</h3>
                    {jarvisMetrics ? (
                      <div className="space-y-2">
                        {[
                          { key: "servers", label: "Servidores" },
                          { key: "users", label: "Usuarios" },
                          { key: "ping", label: "Ping" },
                          { key: "uptime", label: "Uptime" },
                          { key: "premium", label: "Premium" },
                          { key: "staff", label: "Staff" },
                          { key: "ram", label: "RAM" },
                          { key: "blacklist", label: "Blacklist" },
                          { key: "economy", label: "Economía" },
                          { key: "topServers", label: "Top Servidores" },
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                            <span className="text-xs text-gray-500">{label}</span>
                            <span className="text-sm text-white font-semibold">
                              {jarvisMetrics[key] !== undefined ? (typeof jarvisMetrics[key] === "number" ? jarvisMetrics[key].toLocaleString() : String(jarvisMetrics[key])) : "—"}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">Cargando métricas...</p>
                    )}
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Zap size={18} className="text-[#FEE75C]" /> Acciones Rápidas</h3>
                    <div className="space-y-2">
                      {[
                        { label: "Ver logs del bot", icon: Terminal, color: "#57F287", action: "logs" },
                        { label: "Reiniciar bot", icon: RefreshCw, color: "#FEE75C", action: "restart" },
                        { label: "Estado de PM2", icon: Monitor, color: "#5865F2", action: "pm2" },
                        { label: "Log de errores", icon: AlertTriangle, color: "#ED4245", action: "errorlog" },
                        { label: "Ver estadísticas", icon: BarChart3, color: "#7C3AED", action: "stats" },
                      ].map(({ label, icon: Icon, color, action }) => (
                        <button key={action}
                          onClick={() => jarvisQuickAction(action)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors text-left">
                          <Icon size={14} style={{ color }} className="flex-shrink-0" />
                          <span className="text-sm text-gray-300">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== TERMINAL (Owner) ==================== */}
          {activeSection === "terminal" && isOwner && (
            <motion.div key="terminal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#57F287] bg-clip-text text-transparent">Terminal</span>
              </h1>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Terminal size={18} className="text-[#57F287]" /> Terminal del Bot</h3>
                <p className="text-sm text-gray-400 mb-4">Accede a la terminal del bot para ejecutar comandos en vivo.</p>
                <div className="rounded-xl overflow-hidden border border-white/10 bg-black min-h-[500px]">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-500 ml-2">Terminal</span>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-green-400 font-mono mb-2">$ Bot Terminal Access</div>
                    <div className="text-sm text-gray-400 font-mono mb-4">Para acceder a la terminal completa, utiliza SSH o el panel de administración del servidor.</div>
                    <a href={SUPPORT_SERVER} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 transition-colors text-sm text-[#5865F2]">
                      <ExternalLink size={14} /> Solicitar acceso al terminal
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== BOT LOGS (Owner) ==================== */}
          {activeSection === "bot-logs" && isOwner && (
            <motion.div key="bot-logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#5865F2] bg-clip-text text-transparent">Bot Logs</span>
              </h1>

              <div className="glass rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white flex items-center gap-2"><FileText size={18} className="text-[#5865F2]" /> Últimas 100 entradas ({botLogs.length})</h3>
                    <div className="flex items-center gap-2">
                      <Toggle enabled={botLogsAutoRefresh} onToggle={() => setBotLogsAutoRefresh((p) => !p)} />
                      <span className="text-xs text-gray-500">Auto-refresh</span>
                    </div>
                  </div>
                  <button onClick={loadBotLogs}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm text-gray-400 hover:text-white">
                    <RefreshCw size={14} /> Cargar
                  </button>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="space-y-1 max-h-[600px] overflow-y-auto font-mono text-xs">
                  {botLogs.length > 0 ? botLogs.map((log, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5">
                      <span className={`flex-shrink-0 w-14 text-right ${
                        log.level === "error" ? "text-red-400" :
                        log.level === "warn" ? "text-yellow-400" :
                        log.level === "info" ? "text-blue-400" :
                        "text-gray-500"
                      }`}>
                        [{log.level?.toUpperCase() || "LOG"}]
                      </span>
                      <span className="text-gray-600 flex-shrink-0 w-36">{log.timestamp ? formatDate(log.timestamp) : "—"}</span>
                      {log.source && <span className="text-[#7C3AED] flex-shrink-0">[{log.source}]</span>}
                      <span className="text-gray-300 break-all">{log.message}</span>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500 text-center py-8 font-sans">Haz clic en &quot;Cargar&quot; para obtener los logs del bot.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
