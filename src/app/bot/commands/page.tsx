"use client";

import { useState } from "react";
import {
  Search,
  Terminal,
  Shield,
  Lock,
  Music,
  Coins,
  BarChart3,
  Gamepad2,
  MessageSquare,
  Globe,
  Crown,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
];

const CATEGORIES = ["Todos", ...Array.from(new Set(ALL_COMMANDS.map((c) => c.category)))];

export default function BotCommandsPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const filtered = ALL_COMMANDS.filter((cmd) => {
    const matchCat = activeCategory === "Todos" || cmd.category === activeCategory;
    const matchSearch =
      !query || cmd.name.toLowerCase().includes(query) || cmd.desc.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  const copyUsage = async (usage: string) => {
    try {
      await navigator.clipboard.writeText(usage);
      toast.success("Comando copiado", { description: usage });
    } catch {
      toast.error("No se pudo copiar", { description: "Tu navegador bloqueó el portapapeles." });
    }
  };

  return (
    <div className="relative px-4 pb-[var(--section-y)] pt-10 sm:px-6 sm:pt-14">
      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <span className="eyebrow justify-center">
            <Terminal aria-hidden className="h-3 w-3" />
            Referencia pública
          </span>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-[clamp(2rem,5.5vw,3.25rem)] font-bold tracking-tight">
            Comandos de System 777
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--text-2)]">
            {ALL_COMMANDS.length} entradas en esta referencia, organizadas por categoría. El bot
            registra en Discord {""}
            <span className="text-[var(--text)]">la lista real de comandos</span> desde su VPS.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-3)]"
            />
            <label htmlFor="cmd-search" className="sr-only">
              Buscar comando
            </label>
            <Input
              id="cmd-search"
              type="search"
              placeholder="Buscar comando o descripción…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 focus-visible:border-[rgba(0,229,255,0.55)] focus-visible:ring-[rgba(0,229,255,0.15)]"
            />
          </div>
          <p className="shrink-0 font-[family-name:var(--font-mono)] text-xs text-[var(--text-3)]">
            {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
          </p>
        </div>

        <Tabs
          value={activeCategory}
          onValueChange={(v) => setActiveCategory(v)}
          className="mt-4"
        >
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1.5 bg-transparent p-0 sm:w-fit">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="h-8 flex-none border border-[var(--line)] bg-white/[0.03] px-3.5 text-[13px] text-[var(--text-3)] hover:bg-white/[0.06] hover:text-[var(--text)] data-active:border-[rgba(0,229,255,0.55)] data-active:bg-[rgba(0,229,255,0.14)] data-active:text-[#59f1ff]"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-4 outline-none">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((cmd) => (
                <li
                  key={`${cmd.category}-${cmd.name}`}
                  className="panel panel-hover h-full min-w-0 p-4"
                >
                  <div className="flex min-w-0 items-start gap-2.5">
                    <Terminal
                      aria-hidden
                      className="mt-1 h-3.5 w-3.5 shrink-0"
                      style={{ color: cmd.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-[var(--text)]">
                          /{cmd.name}
                        </span>
                        <Badge variant="outline" className="h-5 font-mono text-[10px]">
                          {cmd.emoji} {cmd.category}
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-3)]">
                        {cmd.desc}
                      </p>
                      <div className="mt-1.5 flex items-start gap-1.5">
                        <code className="min-w-0 flex-1 break-words font-[family-name:var(--font-mono)] text-[11px] text-[var(--data)]">
                          {cmd.usage}
                        </code>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                aria-label={`Copiar comando /${cmd.name}`}
                                className="shrink-0 text-[var(--text-3)] hover:text-[var(--brand)]"
                                onClick={() => copyUsage(cmd.usage)}
                              />
                            }
                          >
                            <Copy aria-hidden />
                          </TooltipTrigger>
                          <TooltipContent>Copiar comando</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {filtered.length === 0 && (
              <div className="panel p-12 text-center text-sm text-[var(--text-3)]">
                No hay comandos para “{search}” en esta referencia.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
