"use client";

import { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import {
  Lock,
  Key,
  Smartphone,
  Globe,
  Activity,
  Save,
  Check,
  AlertTriangle,
  Trash2,
  Plus,
  X,
} from "lucide-react";

interface Session {
  id: string;
  device: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

interface LogEntry {
  id: number;
  action: string;
  user: string;
  ip: string;
  time: string;
}

const initialSessions: Session[] = [
  { id: "1", device: "Chrome en Linux", ip: "192.168.1.100", lastActive: "Ahora", current: true },
  { id: "2", device: "Safari en iPhone", ip: "192.168.1.101", lastActive: "Hace 2 horas", current: false },
  { id: "3", device: "Firefox en Windows", ip: "10.0.0.50", lastActive: "Ayer", current: false },
];

const initialLogs: LogEntry[] = [
  { id: 1, action: "Inicio de sesión", user: "Carlos Ruiz", ip: "192.168.1.100", time: "2024-05-15 14:30" },
  { id: 2, action: "Cambio de contraseña", user: "María García", ip: "192.168.1.101", time: "2024-05-15 12:15" },
  { id: 3, action: "Inicio de sesión fallido", user: "alex@ejemplo.com", ip: "10.0.0.50", time: "2024-05-15 11:00" },
  { id: 4, action: "Actualización de perfil", user: "Sarah Wilson", ip: "192.168.1.102", time: "2024-05-14 16:45" },
  { id: 5, action: "Inicio de sesión", user: "Alex Chen", ip: "10.0.0.55", time: "2024-05-14 09:15" },
];

export default function SecurityPage() {
  const [saved, setSaved] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecial: true,
  });
  const [whitelist, setWhitelist] = useState(["192.168.1.0/24", "10.0.0.0/8"]);
  const [newIp, setNewIp] = useState("");
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [logs] = useState<LogEntry[]>(initialLogs);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const revokeSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const addIp = () => {
    if (newIp && !whitelist.includes(newIp)) {
      setWhitelist((prev) => [...prev, newIp]);
      setNewIp("");
    }
  };

  const removeIp = (ip: string) => {
    setWhitelist((prev) => prev.filter((i) => i !== ip));
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin" className="mb-2 inline-block text-sm text-[#00FF88] hover:underline">
            &larr; Volver al Panel
          </Link>
          <h1 className="text-2xl font-bold text-white">Seguridad</h1>
          <p className="mt-1 text-sm text-gray-400">Gestiona la seguridad de la plataforma</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-[#00FF88] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#00FF88]/90"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Guardado" : "Guardar"}
        </button>
      </div>

      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Lock className="h-5 w-5 text-[#00FF88]" />
            Política de Contraseñas
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-gray-400">Longitud Mínima</label>
              <input
                type="number"
                value={passwordPolicy.minLength}
                onChange={(e) => setPasswordPolicy({ ...passwordPolicy, minLength: Number(e.target.value) })}
                min={6}
                max={32}
                className="w-full max-w-xs rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[#00FF88]/50"
              />
            </div>
            <div className="space-y-3">
              {[
                { key: "requireUppercase", label: "Requerir mayúsculas" },
                { key: "requireNumbers", label: "Requerir números" },
                { key: "requireSpecial", label: "Requerir caracteres especiales" },
              ].map((opt) => (
                <label key={opt.key} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={(passwordPolicy as Record<string, boolean | number>)[opt.key] as boolean}
                    onChange={(e) =>
                      setPasswordPolicy({ ...passwordPolicy, [opt.key]: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#00FF88] focus:ring-[#00FF88]/50"
                  />
                  <span className="text-sm text-gray-300">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Smartphone className="h-5 w-5 text-[#00FF88]" />
            Autenticación de Dos Factores (2FA)
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">
                {twoFactor
                  ? "La autenticación de dos factores está activa."
                  : "La autenticación de dos factores está desactivada."}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Añade una capa extra de seguridad a las cuentas de administrador.
              </p>
            </div>
            <button
              onClick={() => setTwoFactor(!twoFactor)}
              className={`relative h-8 w-14 rounded-full transition-colors ${
                twoFactor ? "bg-[#00FF88]" : "bg-white/10"
              }`}
            >
              <div
                className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-transform ${
                  twoFactor ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {twoFactor && (
            <div className="mt-4 rounded-xl border border-[#00FF88]/20 bg-[#00FF88]/5 p-4">
              <div className="flex items-center gap-2 text-sm text-[#00FF88]">
                <Check className="h-4 w-4" />
                2FA activo — Los administradores deben usar authenticator app
              </div>
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Key className="h-5 w-5 text-[#00FF88]" />
            Sesiones Activas
          </h2>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-xl border border-white/5 px-4 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{session.device}</span>
                    {session.current && (
                      <span className="rounded-full bg-[#00FF88]/10 px-2 py-0.5 text-[10px] text-[#00FF88]">
                        Actual
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    <span>IP: {session.ip}</span>
                    <span>{session.lastActive}</span>
                  </div>
                </div>
                {!session.current && (
                  <button
                    onClick={() => revokeSession(session.id)}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3 w-3" />
                    Revocar
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Globe className="h-5 w-5 text-[#00FF88]" />
            Lista Blanca de IPs
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              placeholder="192.168.1.0/24"
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00FF88]/50"
              onKeyDown={(e) => e.key === "Enter" && addIp()}
            />
            <button
              onClick={addIp}
              className="flex items-center gap-1 rounded-xl bg-[#00FF88]/10 px-4 py-2.5 text-sm text-[#00FF88] hover:bg-[#00FF88]/20"
            >
              <Plus className="h-4 w-4" />
              Agregar
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {whitelist.map((ip) => (
              <span
                key={ip}
                className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-gray-300"
              >
                {ip}
                <button onClick={() => removeIp(ip)} className="text-gray-500 hover:text-red-400">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Activity className="h-5 w-5 text-[#00FF88]" />
            Registro de Actividad
          </h2>
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    log.action.includes("fallido")
                      ? "bg-red-500/10"
                      : "bg-[#00FF88]/10"
                  }`}>
                    {log.action.includes("fallido") ? (
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    ) : (
                      <Check className="h-4 w-4 text-[#00FF88]" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-white">{log.action}</div>
                    <div className="text-xs text-gray-500">{log.user} &middot; {log.ip}</div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
