"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Terminal, Shield, Lock, Music, Coins, BarChart3, Gamepad2, MessageSquare, Globe, Crown } from "lucide-react";

const ALL_COMMANDS = [
  { category: "Moderación", emoji: "🛡️", icon: Shield, color: "#5865F2", name: "ban", desc: "Banea a un usuario del servidor.", usage: "/ban @usuario [razón]" },
  { category: "Moderación", emoji: "🛡️", icon: Shield, color: "#5865F2", name: "kick", desc: "Expulsa a un usuario del servidor.", usage: "/kick @usuario [razón]" },
  { category: "Moderación", emoji: "🛡️", icon: Shield, color: "#5865F2", name: "timeout", desc: "Silencia a un usuario temporalmente.", usage: "/timeout @usuario [duración] [razón]" },
  { category: "Moderación", emoji: "🛡️", icon: Shield, color: "#5865F2", name: "warn", desc: "Advierte a un usuario con registro.", usage: "/warn @usuario [razón]" },
  { category: "Moderación", emoji: "🛡️", icon: Shield, color: "#5865F2", name: "clear", desc: "Elimina mensajes en masa.", usage: "/clear [cantidad]" },
  { category: "Moderación", emoji: "🛡️", icon: Shield, color: "#5865F2", name: "nuke", desc: "Recrea el canal limpio.", usage: "/nuke" },
  { category: "Moderación", emoji: "🛡️", icon: Shield, color: "#5865F2", name: "lock", desc: "Bloquea el canal actual.", usage: "/lock [razón]" },
  { category: "Moderación", emoji: "🛡️", icon: Shield, color: "#5865F2", name: "unlock", desc: "Desbloquea el canal.", usage: "/unlock" },
  { category: "Moderación", emoji: "🛡️", icon: Shield, color: "#5865F2", name: "slowmode", desc: "Activa modo lento.", usage: "/slowmode [segundos]" },
  { category: "Moderación", emoji: "🛡️", icon: Shield, color: "#5865F2", name: "tempban", desc: "Ban temporal por tiempo.", usage: "/tempban @usuario [duración]" },
  { category: "Moderación", emoji: "🛡️", icon: Shield, color: "#5865F2", name: "softban", desc: "Ban + unban para borrar msgs.", usage: "/softban @usuario" },
  { category: "Moderación", emoji: "🛡️", icon: Shield, color: "#5865F2", name: "cases", desc: "Ver casos de moderación.", usage: "/cases" },
  { category: "Moderación", emoji: "🛡️", icon: Shield, color: "#5865F2", name: "announce", desc: "Anuncio embed formateado.", usage: "/announce [título] [mensaje]" },

  { category: "Protección", emoji: "🔒", icon: Lock, color: "#7C3AED", name: "antiraid", desc: "Configuración anti-raid.", usage: "/antiraid setup/status/lockdown" },
  { category: "Protección", emoji: "🔒", icon: Lock, color: "#7C3AED", name: "antinuke", desc: "Protección anti-nuke.", usage: "/antinuke" },
  { category: "Protección", emoji: "🔒", icon: Lock, color: "#7C3AED", name: "automod", desc: "AutoMod avanzado.", usage: "/automod setup/flood/antilink/anticaps" },
  { category: "Protección", emoji: "🔒", icon: Lock, color: "#7C3AED", name: "whitelist", desc: "Gestiona la whitelist.", usage: "/whitelist add/remove/list" },
  { category: "Protección", emoji: "🔒", icon: Lock, color: "#7C3AED", name: "logs", desc: "Configura canal de logs.", usage: "/logs [canal]" },

  { category: "Música", emoji: "🎵", icon: Music, color: "#EB459E", name: "play", desc: "Reproduce una canción.", usage: "/play [búsqueda o URL]" },
  { category: "Música", emoji: "🎵", icon: Music, color: "#EB459E", name: "queue", desc: "Muestra la cola de reproducción.", usage: "/queue" },
  { category: "Música", emoji: "🎵", icon: Music, color: "#EB459E", name: "controls", desc: "Panel de controles interactivo.", usage: "/controls" },

  { category: "Economía", emoji: "💰", icon: Coins, color: "#FEE75C", name: "eco", desc: "Sistema completo de economía.", usage: "/eco balance|daily|work|pay|bank|rich|rob|slots" },

  { category: "Niveles", emoji: "⭐", icon: BarChart3, color: "#57F287", name: "levels", desc: "Sistema de niveles.", usage: "/levels rank|top|logros" },

  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "trivia", desc: "Pregunta de trivia.", usage: "/trivia" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "coinflip", desc: "Lanza una moneda.", usage: "/coinflip" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "poll", desc: "Crea una encuesta.", usage: "/poll [pregunta]" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "hack", desc: "Hackea a un usuario (broma).", usage: "/hack @usuario" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "tictactoe", desc: "Tres en raya.", usage: "/tictactoe @usuario" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "hangman", desc: "Ahorcado interactivo.", usage: "/hangman" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "wordle", desc: "Wordle en español.", usage: "/wordle" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "riddles", desc: "Adivinanzas con botones.", usage: "/riddles" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "connect4", desc: "Conecta 4 contra otro.", usage: "/connect4 @usuario" },

  { category: "Social", emoji: "💬", icon: MessageSquare, color: "#00C8FF", name: "marry", desc: "Propón matrimonio a alguien.", usage: "/marry @usuario" },
  { category: "Social", emoji: "💬", icon: MessageSquare, color: "#00C8FF", name: "divorce", desc: "Divórciate de alguien.", usage: "/divorce @usuario" },
  { category: "Social", emoji: "💬", icon: MessageSquare, color: "#00C8FF", name: "hug", desc: "Abraza a alguien.", usage: "/hug @usuario" },
  { category: "Social", emoji: "💬", icon: MessageSquare, color: "#00C8FF", name: "kiss", desc: "Besa a alguien.", usage: "/kiss @usuario" },
  { category: "Social", emoji: "💬", icon: MessageSquare, color: "#00C8FF", name: "profile", desc: "Ver/editar tu perfil.", usage: "/profile ver/bio/afk/clan" },
  { category: "Social", emoji: "💬", icon: MessageSquare, color: "#00C8FF", name: "afk", desc: "Activa modo AFK.", usage: "/afk [motivo]" },

  { category: "Utilidad", emoji: "🔧", icon: Globe, color: "#FF8C42", name: "util", desc: "Utilidades completas del bot.", usage: "/util avatar|userinfo|serverinfo|botinfo|ping|calc|password|remind|afk|stats|rolelist|invite|snipe|weather|translate|suggest|starboard|welcome" },
  { category: "Utilidad", emoji: "🔧", icon: Globe, color: "#FF8C42", name: "ticket", desc: "Sistema de tickets.", usage: "/ticket setup/categoria/config" },
  { category: "Utilidad", emoji: "🔧", icon: Globe, color: "#FF8C42", name: "giveaway", desc: "Sorteos con botones.", usage: "/giveaway start/end/reroll" },
  { category: "Utilidad", emoji: "🔧", icon: Globe, color: "#FF8C42", name: "network", desc: "Herramientas de red.", usage: "/network ping/traceroute/nslookup/ssl" },

  { category: "Owner", emoji: "👑", icon: Crown, color: "#FFD93D", name: "status", desc: "Estado completo del bot.", usage: "/status" },
  { category: "Owner", emoji: "👑", icon: Crown, color: "#FFD93D", name: "servers", desc: "Lista todos los servidores.", usage: "/servers" },
  { category: "Owner", emoji: "👑", icon: Crown, color: "#FFD93D", name: "globalban", desc: "Ban en todos los servers.", usage: "/globalban add/remove/list" },
  { category: "Owner", emoji: "👑", icon: Crown, color: "#FFD93D", name: "broadcast", desc: "Mensaje a todos los servers.", usage: "/broadcast [mensaje]" },
  { category: "Owner", emoji: "👑", icon: Crown, color: "#FFD93D", name: "eval", desc: "Ejecutar código JS.", usage: "/eval [código]" },
  { category: "Owner", emoji: "👑", icon: Crown, color: "#FFD93D", name: "shell", desc: "Ejecutar comando del sistema.", usage: "/shell [comando]" },

  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "love", desc: "Calcula el amor entre dos usuarios.", usage: "/love @user1 @user2" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "roast", desc: "Insulta aleatorio (con cariño).", usage: "/roast [@usuario]" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "compliment", desc: "Halago aleatorio.", usage: "/compliment [@usuario]" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "rate", desc: "Califica algo del 1 al 10.", usage: "/rate [algo]" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "ascii", desc: "Convierte texto a ASCII art.", usage: "/ascii [texto]" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "urban", desc: "Definición de Urban Dictionary.", usage: "/urban [término]" },

  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "love", desc: "Calcula el amor entre dos usuarios.", usage: "/love @user1 @user2" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "roast", desc: "Insulta aleatorio (con cariño).", usage: "/roast [@usuario]" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "compliment", desc: "Halago aleatorio.", usage: "/compliment [@usuario]" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "rate", desc: "Califica algo del 1 al 10.", usage: "/rate [algo]" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "ascii", desc: "Convierte texto a ASCII art.", usage: "/ascii [texto]" },
  { category: "Diversión", emoji: "🎮", icon: Gamepad2, color: "#FF6B6B", name: "urban", desc: "Definición de Urban Dictionary.", usage: "/urban [término]" },
];

const CATEGORIES = ["Todos", ...Array.from(new Set(ALL_COMMANDS.map((c) => c.category)))];

export default function BotCommandsPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  const filtered = ALL_COMMANDS.filter((cmd) => {
    const matchCat = activeCategory === "Todos" || cmd.category === activeCategory;
    const matchSearch = !search || cmd.name.toLowerCase().includes(search.toLowerCase()) || cmd.desc?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-[#5865F2] to-[#7C3AED] bg-clip-text text-transparent">Comandos</span>
          </h1>
          <p className="text-gray-400 text-lg">{ALL_COMMANDS.length} comandos disponibles en System 777</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar comando..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 outline-none focus:border-[#5865F2]/50 transition-colors"
          />
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-[#5865F2] text-white"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-600 mb-4">{filtered.length} comandos encontrados</p>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${search}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {filtered.map((cmd, i) => (
              <motion.div
                key={cmd.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.06] hover:border-white/0.12 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <Terminal size={14} className="mt-0.5 flex-shrink-0" style={{ color: cmd.color }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-white text-sm">/{cmd.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500">
                        {cmd.emoji} {cmd.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{cmd.desc}</p>
                    <code className="text-[10px] text-gray-600 mt-1 block">{cmd.usage}</code>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            No se encontraron comandos para &quot;{search}&quot;
          </div>
        )}
      </div>
    </main>
  );
}
